!(function(g, n) {
    "use strict";

    // 1 - EventHandling = Presenter
    // 2 - DOM Manipulation = View
    // 3 - AJAX calls = Model

    var
        observer = n.Utils.observer,
        methods = {
            init: function() {
                console.warn('Presenter is running :-)', this);
            },

            setModel: function(model) {
                (!n.isObj(model) && n.error('model should be set'));
                this._model = model;
                return this;
            },
            getModel: function() {
                return this._model;
            },
            setView: function(view) {
                (!n.isObj(view) && n.error('view should be set'));
                this._view = view;
                return this;
            },
            getView: function() {
                return this._view;
            }
        };

    n.Presenter = function(props) {
        props && (!n.isObj(props)) && n.error('Presenter properties should be type of "Object"');

        function Presenter(model, view) {
            this._model = null;
            this._view = null;
            return this.setModel(model).setView(view);
        }

        n.each(methods, function(k, v) {
            Presenter.prototype[k] = v;
        });

        return Presenter;
    };

}(this, typeof EM === 'object' ? EM : this.EM = {}));
