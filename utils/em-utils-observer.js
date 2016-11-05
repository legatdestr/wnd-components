!(function (g, n, u) {
    "use strict";

    var
        Observer = function () {
            "use strict";
            var
                publisher = {
                    subscribers: {
                        any: []
                    },

                    on: function (type, fn, context, once) {
                        type = type || 'any';
                        fn = typeof fn === "function" ? fn : context[fn];

                        if (typeof this.subscribers[type] === "undefined") {
                            this.subscribers[type] = [];
                        }

                        var subscribers = this.subscribers[type],
                            len = subscribers.length,
                            i;
                        // prevent adding the same handlers
                        for (i = 0; i < len; i++) {
                            if (subscribers[i].fn === fn && subscribers[i].context === context) {
                                return false;
                            }
                        }

                        this.subscribers[type].push({
                            fn: fn,
                            context: context || this,
                            once: !!once
                        });
                    },
                    once: function (type, fn, context) {
                        this.on(type, fn, context, true);
                    },
                    remove: function (type, fn, context) {
                        this.fireSubscribers('unsubscribe', type, fn, context);
                    },
                    /**
                     * Fire event on current object
                     * @param {String} type
                     * @param {Object} publication
                     * @param {Boolean} async If true then event will be invoked asynchronously. True by default
                     */
                    fire: function (type, publication, async) {
                        var self = this;
                        async = !!async;
                        if (async) {
                            setTimeout(function (t, p) {
                                return function () {
                                    self.fireSubscribers('publish', t, p);
                                };

                            }(type, publication), 0);
                        } else {
                            this.fireSubscribers('publish', type, publication);
                        }
                    },
                    fireSubscribers: function (action, type, arg, context) {
                        this._eveEnabled = this._eveEnabled || true;
                        this._logEvents = this._logEvents || false;
                        if (!this._eveEnabled) {
                            return;
                        }
                        var pubtype = type || 'any',
                            subscribers = this.subscribers[pubtype],
                            i,
                            max = subscribers ? subscribers.length : 0;

                        for (i = 0; i < max; i += 1) {
                            if (action === 'publish') {
                                if (typeof subscribers[i] !== 'undefined') {
                                    subscribers[i].fn.call(subscribers[i].context, arg);
                                    if (subscribers[i].once) {
                                        this.remove(subscribers[i], subscribers[i].fn, subscribers[i].context);
                                    }
                                    if (this._logEvents) {
                                        console.log('Observer event (action, type, arg, context): ', action, type, arg, context);
                                    }
                                }
                            } else {
                                if (typeof subscribers[i] !== 'undefined') {
                                    if (subscribers[i].fn === arg && subscribers[i].context === context) {
                                        subscribers.splice(i, 1);
                                        if (this._logEvents) {
                                            console.log('Observer event removed (action, type, arg, context): ', action, type, arg, context);
                                        }
                                    }
                                }
                            }
                        }
                    },
                    removeAllEventHandlers: function (type) {
                        var subscribers = this.subscribers[type];
                        if (Object.prototype.toString.call(subscribers) !== '[object Array]') {
                            return;
                        }
                        this.subscribers[type] = [];
                    },
                    clear: function () {
                        this.subscribers = {
                            any: []
                        };
                    },
                    pause: function () {
                        this._eveEnabled = false;
                    },
                    resume: function () {
                        this._eveEnabled = true;
                    },
                    log: function (enabled) {
                        enabled = enabled || false;
                        this._logEvents = enabled;
                    }
                };

            function makePublisher(o) {
                var i;
                for (i in publisher) {
                    if (Object.prototype.hasOwnProperty.call(publisher, i) && typeof publisher[i] === "function") {
                        o[i] = publisher[i];
                    }
                }
                // create the own instance of the subscribers
                o.subscribers = {
                    any: []
                };
                return o;
            }

            return makePublisher;
        }();

    u.observer = Observer;

}(this, typeof EM === 'object' ? EM : this.EM = {},
    typeof EM.Utils === 'object' ? EM.Utils : this.EM.Utils = {}));
