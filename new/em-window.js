!(function(g, n) {
    "use strict";

    var
        defPars = {
            hndlrs: {

            },
            //  tpl: '<div class="modal-header"><button class="{{btnCloseClsName}}" >{{btnCloseTitle}}</button><h3 class="modal-title">{{wndTitle}}</h3></div><div class="{{wndBodyContentClsName}}">{{wndBodyContent}}</div>'
            //,
            //
            tpl: '<div id="{{id}}" class="{{className}}">' +
                '<div class="{{header.class}}">' +
                '<button class="{{header.closeBtnClass}}">{{header.closeBtnTitle}}</button>' +
                '<h3 class="{{header.titleClass}}">{{header.title}}</h3>' +
                '</div>' +
                '<div class="{{body.class}}">' +
                '</div>' +
                '</div>',

            viewModel: {
                id: "em-4479974",
                className: "em-modal-window",
                header: {
                    class: "modal-header",
                    closeBtnClass: "close-cross",
                    closeBtnTitle: "x",
                    titleClass: "modal-title",
                    title: "Форма обратной связи"
                },
                body: {
                    class: "modal-body"
                }
            }

        },
        Widget = n.widgets.Widget;


    /**
     * Constructor for Window object
     * @constructor Window
     * @param  {Object} opts parameters
     */
    function Window(opts) {
        n.widgets.Widget.apply(this, arguments);
        n.mixObjs(defPars, this._cfg);
        return this;
    }

    Widget.extend(Window); // inheriting


    Window.prototype.run = function() {
        // parent method call:
        Widget.prototype.run.apply(this, arguments);
        return this;
    }

    Window.prototype.render = function() {
        var tmpl = n.template(this._cfg.tpl)(this._cfg.viewModel);
        this.setHtml(tmpl);
    }

    //  exports
    n.registerWidget('Window', Window);

}(this, typeof EM === 'object' ? EM : this.EM = {}));
