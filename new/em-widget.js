!(function(g, n) {
    "use strict";

    var
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
                    n.fire(this.getName() + '_click', ctxt);
                    n.isF(this._hndlrs[hndlrName]) && this._hndlrs[hndlrName](ctxt);
                }
            }
        },
        bindHndlrs = function(obj, hndlrs) {
            (!n.isObj(obj._hndlrs)) && (obj._hndlrs = {});
            n.each(hndlrs, function(k, v) {
                obj._hndlrs[k] = v.bind(obj);
            });
            return this;
        },
        unbindHndlrs = function(obj, hndlrs) {
            n.each(hndlrs, function(k, v) {
                obj._hndlrs[k] = null;
            });
            obj._hndlrs = null;
            return this;
        };

    function Widget(opts) {
        this._cfg = this._cfg || null;
        this._hndlrs = this._hndlrs || null;
        this._name = this._name || null;
        this.setOptions(opts);
        n.isObj(opts) && n.isStr(opts.name) && this.setName(opts.name) || (this.setName(n.genElId() + '-widget'));
        return this;
    }

    Widget.extend = n.extendClass.bind(Widget, Widget);

    /**
     * Setup new options
     * @method setOptions
     * @param  {Object}   opts
     */
    Widget.prototype.setOptions = function(opts) {
        (!n.isObj(opts)) && (opts = {});
        (!n.isObj(this._cfg)) && (this._cfg = n.mixObjs(defPars, {}));
        this._cfg = n.mixObjs(opts, this._cfg);
        return this;
    };

    /**
     * Returns copy of the current options object
     * @method getOptions
     * @param  {Object}   opts options
     * @return {Object}        options
     */
    Widget.prototype.getOptions = function(opts) {
        return g.JSON.parse(g.JSON.stringify(this._cfg));
    };

    Widget.prototype.getEl = function(className) {
        var el = this._cfg.el ? this._cfg.el : (this._cfg.el = n.d.createElement('div'));
        className && (n.isStr(className) && (el = el.getElementsByClassName(className)[0])) || (className && n.error('className is wrong'));
        return el;
    };

    Widget.prototype.run = function() {
        bindHndlrs(this, this._cfg.hndlrs);
        this.getEl().addEventListener('click', this._hndlrs.onClick);
        n.fire(this.getName() + '_run', this);
        return this;
    };

    Widget.prototype.stop = function() {
        this.getEl().removeEventListener('click', this._hndlrs.onClick);
        unbindHndlrs(this, this._cfg.hndlrs);
        n.fire(this.getName() + '_stop', this);
        return this;
    };

    Widget.prototype.setName = function(name) {
        (!n.isStr(name)) && n.error('name is not set') ||
            (this._name = (name || this._cfg.name));
        return this;
    }

    Widget.prototype.getName = function() {
        return this._name;
    }

    Widget.prototype.setHtml = function(html) {
        this.getEl().innerHTML = html;
        n.fire(this.getName() + '_html_changed', this);
        return this;
    }

    Widget.prototype.getHtml = function(html) {
        return this.getEl().innerHTML;
    }


    n.registerWidget('Widget', Widget); // exports

}(this, typeof EM === 'object' ? EM : this.EM = {}));
