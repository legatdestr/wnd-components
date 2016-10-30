!(function(g, n) {
    "use strict";

    // Компонент "Форма обратной связи"
    // Собирается на основе виджетов
    // Каждый виджет в идеале строится по концепции MVP

    var M = EM.Model({
        prop1: 'prop1 default value example'
    });

    g.m = new M();
    console.log(m.get('prop1'));

    var Form = EM.View();

    g.v = new Form();

    console.log(g.v.render());

    var FormPresenter = EM.Presenter();
    g.p = new FormPresenter(g.m, g.v);
    g.p.init();



}(this, typeof EM === 'object' ? EM : this.EM = {}));
