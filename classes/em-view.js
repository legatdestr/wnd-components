!(function(g, n) {
    "use strict";

    // 1 - EventHandling = Presenter
    // 2 - DOM Manipulation = View
    // 3 - AJAX calls = Model


    var
        observer = n.Utils.observer,
        superMethods = {
            createMethodNameByClassName: function(cName, action) {
                (!n.isStr(cName)) && n.error('the clasName is not String');
                action = n.isStr(action) ? action : 'click';
                (action.length < 2) && n.error('action length is less than 2');
                cName = g.String.prototype.split.call(cName, ' ').join('').replace(/-([a-z])/g, function(g) {
                    return g[1].toUpperCase();
                });
                cName = 'on' + cName.charAt(0).toUpperCase() + cName.slice(1) + action;
                return cName;
            },

            onClick: function(e) {
                var target, classes, mName, self = this;
                (typeof e !== 'object') && n.error('e is not an object', e);
                target = e.target;
                (typeof target !== 'object') && n.error('e.target is not an object', target);
                classes = target.getAttribute('class');
                if (classes) {
                    classes = String.prototype.split.call(classes, ' ');
                    n.each(classes, function(k, v) {
                        mName = self.createMethodNameByClassName(v, 'click');
                        (n.isF(self[mName])) && self[mName](e);
                        console.log('trying to call method: ' + mName);
                    });
                }
                this.events.fire('click', this);
            },

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
                n.each(this, function(k, v) {
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
            },
            init: function() {
                var el = this.getEl();
                (n.getType(el) === 'null' || (typeof el !== 'object')) && n.error('View error: parent DOM element does not set');
                el.addEventListener('click', this.onClick.bind(this));
                return this;
            },
            setTmpl: function(tmpl) {
                (!n.isStr(tmpl)) && n.error('Tmpl is not a string!');
                this._tmpl = tmpl;
                return this;
            },
            getTmpl: function() {
                return this._tmpl;
            }
        };

    // Factory
    n.View = function(extMethods) {
        function View(opts) {
            this._el = null;
            this._tmpl = '';
            (this.events = {}) && (n.Utils.observer(this.events));
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
