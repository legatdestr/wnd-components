!(function(g, n) {
    "use strict";

    var
        defaults = {
            frmClsName: 'em-feedback-form',
            tpl: '<fieldset><div class="control-group"><label class="control-label" for="feedbackFIO">Ваше ФИО: <span class="star">*</span></label><div class="controls"><input class="feedback-inputs" type="text" tabindex="1" placeholder="Иванов Иван Иванович" name="feedbackFIO" id="feedbackFIO" autocomplete="off" autofocus="true" required></div></div><div class="control-group"><label class="control-label" for="feedbackPhone">Ваш телефон: <span class="star">*</span></label><div class="controls"><input class="feedback-inputs" type="text" placeholder="Тел.: 8 (3822) 11-11-11" name="feedbackPhone" id="feedbackPhone" autocomplete="off" required></div></div><div class="control-group"><label class="control-label" for="feedbackText">Текст: <span class="star">*</span></label><div class="controls"><textarea class="feedback-inputs" rows="5" name="feedbackText" id="feedbackText" required></textarea></div></div></fieldset>',
            tplPlHldrs: [],
            tplErrorNoPlHldrMsg: 'Template rendering error. ',
            parentEl: null
        },
        crtEls = [];


    function EmFeedbackForm(opts) {
        (this._cfg = n.mixObjs(defaults, {})) && n.isObj(opts) && (n.mixObjs(this._cfg, opts));
        this.el = n.d.createElement('form');
        this.el.id = this.id = n.genElId();
        this.el.className = this._cfg.frmClsName;
        this.el.innerHTML = n.renderTpl(this._cfg.tpl, this._cfg.tplPlHldrs, this._cfg, this._cfg.tplErrorNoPlHldrMsg);
        this._inDom = false;
        crtEls.push({
            id: this.el.id,
            f: this
        });

        return this;
    };


    EmFeedbackForm.prototype.getEL = function() {

    }

    n.EmFeedbackForm = EmFeedbackForm; // exports

}(this, typeof EM === 'object' ? EM : this.EM = {}));
