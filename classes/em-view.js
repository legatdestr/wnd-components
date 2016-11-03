!(function(g, n) {
    "use strict";

    // 1 - EventHandling = Presenter
    // 2 - DOM Manipulation = View
    // 3 - AJAX calls = Model

    var
        observer = n.Utils.observer,
        defPars = {
            el: null,
            name: null,
            hndlrs: {
                onClick: function(e) {
                    var elClass = e.target.getAttribute('class'),
                        hndlrName = null,
                        ctxt = null,
                        split = g.String.prototype.split;
                    elClass && (elClass = split.call(elClass, ' ')[0]);
                    elClass && (hndlrName = 'on' + g.Array.prototype.join.call(split.call(elClass, '-'), '') + '_click');
                    ctxt = {
                        widget: this,
                        el: e.target,
                        elClass: elClass
                    };
                    n.isF(this._hndlrs[hndlrName]) && this._hndlrs[hndlrName](ctxt);
                    this.events.fire(elClass + '_click', ctxt);
                }
            }
        },
        methods = {
            render: function() {
                console.log('render');
            }

        };

    n.View = function() {
        function View(opts) {
            this._cfg = this._cfg || null;
            this._hndlrs = this._hndlrs || null;
            this._name = this._name || null;
            (this.events = {}) && observer(this.events);
          //  this.setOptions(opts);
            return this;
        }

        n.each(methods, function(k, v) {
            View.prototype[k] = v;
        });

        return View;
    };

}(this, typeof EM === 'object' ? EM : this.EM = {}));
