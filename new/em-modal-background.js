!(function(n) {
    "use strict";

    var
        elId = 'em-modal-background',
        getEl = function() {
            return n.d.getElementById(elId) || n.d.createElement('div');
        },
        hide = function(el) {
            el.style.display = 'none';
            el.onclick = null;
            n.fire(elId + '-hide', el);
            return el;
        },
        clickHandler = function(e) {
            e.preventDefault();
            hide(e.target) && n.fire(elId + '-click', e.target);
            return false;
        },
        show = function() {
            var el = getEl();
            el.id = el.id || elId;
            el.onclick = clickHandler;
            el.style.display = 'block';
            n.d.getElementById(elId) || n.d.body.appendChild(el);
            n.fire(elId + '-show', el);
            return el;
        };

    n.ModalBackground = {
        show: show,
        hide: hide
    };

}(typeof EM === 'object' ? EM : this.EM = {}));