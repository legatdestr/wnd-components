!(function(g, n) {
    "use strict";

    var
        defaults = {
            wndClsName: 'em-modal-window',
            wndTitle: 'Форма обратной связи',
            btnCloseClsName: "close-cross",
            btnCloseTitle: 'x',
            wndBodyContent: '',
            wndBodyContentClsName: 'modal-body',
            tpl: '<div class="modal-header"><button class="{{btnCloseClsName}}" >{{btnCloseTitle}}</button><h3 class="modal-title">{{wndTitle}}</h3></div><div class="{{wndBodyContentClsName}}">{{wndBodyContent}}</div>',
            tplErrorNoPlHldrMsg: 'Template rendering error. ',
            tplPlHldrs: ['wndTitle', 'btnCloseClsName', 'btnCloseTitle', 'wndBodyContentClsName', 'wndBodyContent']
        },
        closeBtnClickHdl = function(e) {
            e.preventDefault();
            n.fire('close-cross-click', e);
            n.EmWindow.close(e.target.wndId);
        },
        genElId = function() {
            var min = 1000000,
                max = 9999999;
            return 'em-' + ~~(min - 0.5 + g.Math.random() * (max - min + 1));
        },
        crtdWnds = [];


    function EmWindow(opts) {
        var closeBt;
        (this._cfg = n.mixObjs(defaults, {})) && n.isObj(opts) && (n.mixObjs(this._cfg, opts)) &&
            (this._cfg.tplPlHldrs = g.JSON.parse(g.JSON.stringify(this._cfg.tplPlHldrs)));
        this.el = n.d.createElement('div');
        this.el.id = this.id = genElId();
        this.el.innerHTML = n.renderTpl(this._cfg.tpl, this._cfg.tplPlHldrs, this._cfg, this._cfg.tplErrorNoPlHldrMsg);
        this._inDom = false;
        crtdWnds.push({
            id: this.el.id,
            w: this
        });
        closeBt = this.el.getElementsByClassName(this._cfg.btnCloseClsName)[0];
        closeBt.wndId = this.el.id;
        closeBt.onclick = closeBtnClickHdl;
        return this;
    };

    EmWindow.prototype.open = function() {
        this.el.className = this._cfg.wndClsName;
        if (!this._inDom) {
            n.d.body.appendChild(this.el);
            this._inDom = true;
        }
        return this;
    };

    /**
     * Closes current instance of the EmWindow
     * @method close
     * @return {EmWindow} this
     */
    EmWindow.prototype.close = function() {
        this.el.parentNode.removeChild(this.el);
        this.el = null;
        n.fire('window-closed', this);
        return this;
    };

    /**
     * Content DOM element of the window
     * @method getContent
     * @return {HTMLDomElement}
     */
    EmWindow.prototype.getContent = function() {
        return this.el.getElementsByClassName(this._cfg.wndBodyContentClsName)[0];
    };

    EmWindow.prototype.setContent = function(c) {
        var b1 = this.getContent(),
            cloneDeep = false,
            b2 = b1.cloneNode(cloneDeep),
            p;
        (typeof (c) === 'object' && b2.appendChild(c)) || (b2.innerHTML = c);
        (p = b1.parentNode) && p.removeChild(b1) && p.appendChild(b2);
        return b2;
    };

    n.on('window-closed', function(w) { // prevents memory leaks
        var nWds = [];
        n.each(crtdWnds, function(k, v) {
            v.id !== w.id && nWds.push(v);
        });
        crtdWnds = nWds;
    });


    /**
     * Creates an instance of EmWindow
     * @method create
     * @param  {Object} opts options
     * @return {EmWindow} new instance
     */
    EmWindow.create = function(opts) {
        return new EmWindow(opts);
    };

    /**
     * Closes window by container DOM id
     * @method close
     * @param  {String} id container DOM id
     * @return {EmWindow}   this for chaining
     */
    EmWindow.close = function(id) {
        n.each(crtdWnds, function(k, v) {
            v.id === id && v.w.close();
        });
        return EmWindow;
    };

    n.EmWindow = EmWindow; // exports

}(this, typeof EM === 'object' ? EM : this.EM = {}));
