!(function(g, n) {
    "use strict";

    // 1 - EventHandling = Presenter
    // 2 - DOM Manipulation = View
    // 3 - AJAX calls = Model


    var
        observer = n.Utils.observer,
        superMethods = {
            setEl: function(el) {
                this._el = el;
                return this;
            },
            getEl: function() {
                return this._el;
            },
            setOpts: function(opts, silent) {
                var self = this,
                    mName;
                silent = !!silent;
                opts = n.isObj(opts) ? opts : {};
                n.each(opts, function(k, v) {
                    mName = 'set' + k.charAt(0).toUpperCase() + k.slice(1);
                    (n.isF(self[mName]) && self[mName].call(self, v, silent));
                });
                return this;
            },
            getOpts: function() {
                var opts = {},
                    key;
                each(this, function(k, v) {
                    if (!n.isF(v)) {
                        key = g.String.prototype.split.call(k, '_').join('');
                        opts[key] = v;
                    }
                });
                return opts;
            },
            toJson: function() {
                return g.JSON.stringify(this.getOpts());
            },
            toString: function() {
                return this.toJson();
            }
        };

    // Factory
    n.View = function(extMethods) {
        function View(opts) {
            this._el = null;
            this.setOpts(opts);
            return this;
        }

        n.each(superMethods, function(k, v) {
            View.prototype[k] = v;
        });

        extMethods = n.isObj(extMethods) ? extMethods : {};
        n.each(extMethods, function(k, v) {
            View.prototype[k] = v;
        });

        return View;
    };

}(this, typeof EM === 'object' ? EM : this.EM = {}));
