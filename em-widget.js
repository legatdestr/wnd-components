!(function(g, n) {
    "use strict";

    /**
     * @module Widget
     * @class Widget
     */
    var
        defPars = {
            el: null,
            hndlrs = {}
        },
        bindHndlrs = function(ent, hndlrs) {
            (!n.isObj(ent._hndlrs)) && (ent._hndlrs = {});
            n.each(hndlrs, function(k, v) {
                ent._hndlrs[k] = v.bind(ent);
            });
            return this;
        },
        unbindHndlrs = function(ent, hndlrs) {
            n.each(hndlrs, function(k, v) {
                ent._hndlrs[k] = null;
            });
            ent._hndlrs = null;
            return this;
        };


    function Widget(opts) {
        this._cfg = n.mixObjs(defPars, opts);
        this._hndlrs = null;
        return this;
    };



    Widget.prototype.getEl = function(className) {
        var el = this._cfg.el ? this._cfg.el : (this._cfg.el = n.d.createElement('div'));
        className && (n.isStr(className) && (el = el.getElementsByClassName(className)[0])) || (className && n.error('className is wrong'));
        return el;
    };

    Widget.prototype.start = function() {
        bindHndlrs(this, hndlrs);
        this.getEl().addEventListener('click', this._hndlrs.onClick);
        return this;
    };

    Widget.prototype.stop = function() {
        this.getEl().removeEventListener('click', this._hndlrs.onClick);
        unbindHndlrs(this, hndlrs);
        return this;
    };



    Widget.mixin = function() {

    }


function Widget(opts){
  this._cfg = {};
}

Widget.prototype.setOptions = function(opts){

}

function MyBtn(opts){
  Widget.apply(this, arguments);
  return this;
}

MyBtn.prototype = Object.create(Widget.prototype);
MyBtn.prototype.constructor = MyBtn;

MyBtn.prototype.setName = function(name){
  this._name = name;
  return this;
}



function inherit (Parent, Child){
   var ch_proto =  Child.prototype, x;
   Child.prototype = Object.create(Parent.prototype);
   Child.prototype.construcor = Child;
   for (x in ch_proto){
     if (ch_proto[x] ===)
   }
}

    n.Widget = EmFeedbackForm; // exports

}(this, typeof EM === 'object' ? EM : this.EM = {}));
