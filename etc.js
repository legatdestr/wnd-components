!(function(g, EM, VMasker) {
    "use strict";
    var
        noop = g.Function.prototype,
        defaults = {
            enabledCaptcha: false,
            telMask: '9 (9999) 99-99-99',
            uriSubmit: '',
            successMessage: 'Успешный запрос',
            errorMessage: 'Ошибка',
            onSubmit: noop,
            onClose: noop,
            fieldsetHTML: '<fieldset><div class="control-group"><label class="control-label" for="feedbackFIO">Ваше ФИО: <span class="star">*</span></label><div class="controls"><input class="feedback-inputs" type="text" tabindex="1" placeholder="Иванов Иван Иванович" name="feedbackFIO" id="feedbackFIO" autocomplete="off" autofocus="true" required></div></div><div class="control-group"><label class="control-label" for="feedbackPhone">Ваш телефон: <span class="star">*</span></label><div class="controls"><input class="feedback-inputs" type="text" placeholder="Тел.: 8 (3822) 11-11-11" name="feedbackPhone" id="feedbackPhone" autocomplete="off" required></div></div><div class="control-group"><label class="control-label" for="feedbackText">Текст: <span class="star">*</span></label><div class="controls"><textarea class="feedback-inputs" rows="5" name="feedbackText" id="feedbackText" required></textarea></div></div></fieldset>',
            captchaSitekey: '6LekWCkTAAAAAIXaYLJD4ISt_KPUoCaRmKQe--HL'
        },
        O = g.Object,
        hasP = O.prototype.hasOwnProperty,
        toString = O.prototype.toString,
        isObj = function(e) {
            return toString.call(e) === '[object Object]';
        },
        isF = function(e) {
            return toString.call(e) === '[object Function]';
        },
        isArr = function(e) {
            return toString.call(e) === '[object Array]';
        },
        each = function(o, c) {
            var e, l;
            if (isF(c) && isObj(o)) {
                for (e in o) {
                    hasP.call(o, e) && c.call(o, e, o[e]);
                }
            } else
            if (isF(c) && isArr(o) && (l = o.length)) {
                for (e = 0; e++ < l; c.call(o, e - 1, o[e - 1]));
            };
            return o;
        },
        mixObjs = function(src, tgt) {
            each(src, function(k, v) {
                return (typeof tgt[k] === 'undefined') && (tgt[k] = v);
            });
            return tgt;
        };

    function EmWindow(opts) {
        (this._cfg = mixObjs(defaults, {})) && isObj(opts) && (mixObjs(this._cfg, opts));
        mixObjs(winPubMethods, this);
        return this;
    }
    // exports
    EM.FeedbackN = EmWindow;

    var
        Background = function() {
"";
            function Background() {

            };


        }(),

        var
            close = function() {
                var background;
                if (feedbackWindow) {
                    if (feedbackWindow.style.display === 'block') {
                        background = document.getElementById('background');
                        if (background) {
                            background.parentNode.removeChild(background);
                        }
                        feedbackWindow.style.display = 'none';
                        clearValidationErrorMessages();
                        clearInputsValues();
                    }
                }
            },
            closeHandler = function(e) {
                e.preventDefault() && close();
            },
            /**
             * Create control buttons with actions
             * @return {object} controlButtons - two control buttons: close window and submit message
             */
            getControlButtons = function() {
                var controlButtons = document.createElement('div'),
                    submitButton = document.createElement('input'),
                    closeButton = document.createElement('button');

                controlButtons.className = 'control-buttons';
                submitButton.className = 'submit-button btn btn-primary';
                closeButton.className = 'close-button btn';

                submitButton.type = 'submit';
                closeButton.type = 'button';

                closeButton.innerHTML = 'Закрыть';

                controlButtons.appendChild(closeButton);
                controlButtons.appendChild(submitButton);

                closeButton.addEventListener('click', closeHandler);

                submitButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    if (validateInputs()) {
                        makeRequest();
                    }
                });

                return controlButtons;
            },
            /**
             * Create feedback form
             * @return {object} form - form for modal window
             */
            getFeedbackForm = function() {
                var form = document.createElement('form');
                form.className = 'feedback-form';
                form.innerHTML = this._cfg.fieldsetHTML;
                form.appendChild(getControlButtons());
                return form;
            },
            /**
             * Create a modal window with a given content
             * @param {object} content - content for body of modal window
             * @return {object} modalWindow - modal window with content in the body
             */
            getModalWindow = function(content) {
                var modalWindow = document.createElement('div'),
                    modalHeader = document.createElement('div'),
                    modalBody = document.createElement('div'),
                    modalTitle = document.createElement('h3'),
                    closeCross = document.createElement('button');

                modalWindow.className = 'modal-window';
                modalHeader.className = 'modal-header';
                modalBody.className = 'modal-body';
                modalTitle.className = 'modal-title';
                closeCross.className = 'close-cross';

                closeCross.innerHTML = 'x';
                modalTitle.innerHTML = 'Форма обратной связи';

                modalHeader.appendChild(closeCross);
                modalHeader.appendChild(modalTitle);

                if (content) {
                    modalBody.appendChild(content);
                }

                modalWindow.appendChild(modalHeader);
                modalWindow.appendChild(modalBody);

                closeCross.addEventListener('click', function() {
                    close();
                });

                return modalWindow;
            },

            render = function() {
                var background = document.createElement('div'), // слой затемнения
                    feedbackForm = getFeedbackForm(),
                    telMask = this._cfg.telMask,
                    tel,
                    fieldset,
                    captcha,
                    captchaWidget;

                feedbackWindow = getModalWindow(feedbackForm);

                background.id = 'background'; // id чтобы подхватить стиль
                feedbackWindow.className = 'modal-window';

                document.body.appendChild(background); // включаем затемнение
                document.body.appendChild(feedbackWindow); // добавляем модальное окно

                if (options.enabledCaptcha) {
                    fieldset = document.querySelector('.feedback-form').childNodes[0];
                    captcha = document.createElement('div');
                    captcha.className = 'captcha clearfix';
                    fieldset.appendChild(captcha);

                    if (!grecaptcha) {
                        throw new Error('ReCaptcha not found!');
                    }

                    captchaWidget = grecaptcha.render(captcha, {
                        'sitekey': this._cfg.captchaSitekey
                    });
                }

                tel = document.getElementById('feedbackPhone');
                VMasker(tel).maskPattern(telMask);

                feedbackWindow.style.display = 'block';

                background.onclick = function() {
                    close();
                    return false;
                };
            },

            winPubMethods = {


                /**
                 * Open modal feedback window
                 * @return {object} feedbackWindow - modal feedback window
                 */
                open: function open() {
                    if (!feedbackWindow) {
                        render();
                    } else {
                        if (feedbackWindow.style.display !== 'block') {
                            feedbackWindow.style.display = 'block';
                            document.body.appendChild(getBackground());
                        }
                    }
                    return feedbackWindow;
                },


                /**
                 * Close modal feedback window
                 */
                close: close


            };



}(this, typeof EM === 'object' ? EM : this.EM = {}), VMasker);


/**
 * Feedback window class
 * @param {object} options - settings for window: uriSubmit and enabledCaptcha
 */
EM.Feedback = function Feedback(options) {
    'use strict';
    var feedbackWindow;









    /**
     * Send messages and other data to the server and decides
     * what action to perform when the server response
     */
    function makeRequest() {
        var inputs = document.querySelectorAll('.feedback-inputs'),
            body = '',
            i,
            xhr = new XMLHttpRequest(),
            submitButton = document.getElementsByClassName('submit-button')[0];

        for (i = 0; i < inputs.length; i++) {
            body += inputs[i].name + '=' + encodeURIComponent(inputs[i].value) + '&';

            if (i === (inputs.length - 1)) {
                body = body.substring(0, body.length - 1);
            }
        }

        if (options.enabledCaptcha) {
            body += '&captcha=' + encodeURIComponent(grecaptcha.getResponse());
        }

        xhr.open("POST", options.uriSubmit, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.send();

        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;

            submitButton.innerHTML = 'Готово!';

            if (xhr.status != 200) {

            } else {

            }
        }
    }

    /**
     * It displays a message about successful sending a message
     */
    function renderSuccessMessage() {
        var fieldset = document.getElementsByClassName('feedback-form')[0].childNodes[0],
            message = document.createElement('span');

        message.className = 'feedback-success';
        message.innerHTML = options.successMessage || 'Спасибо! Ваше сообщение отправлено.';

        fieldset.appendChild(message);
    }

    /**
     * Removes a message about successful sending a message
     */
    function clearSuccessMessage() {

    }

    /**
     * Checks each field to meet the conditions
     * @return {boolean} result - if at least one field does not
     * pass validation returns false, else returns true
     */
    function validateInputs() {
        var inputs = document.querySelectorAll('.feedback-inputs'),
            i,
            j = 0,
            result = false,
            message,
            captcha = document.querySelector('.captcha');

        clearValidationErrorMessages();

        for (i = 0; i < inputs.length; i++) {

            if (!checkInput(inputs[i])) {
                message = createErrorMessage(inputs[i]);
                inputs[i].parentNode.appendChild(message);
                j++;
            }
        }

        if (options.enabledCaptcha) {
            if (!validateCaptcha()) {
                message = createErrorMessageForCaptcha();
                captcha.childNodes[0].appendChild(message);
                j++;
            }
        }

        if (j === 0) {
            result = true;
        }

        return result;
    }

    /**
     * Removes all message of validation errors
     */
    function clearValidationErrorMessages() {
        var messages = document.querySelectorAll('.validate-error'),
            i;

        for (i = 0; i < messages.length; i++) {
            messages[i].parentNode.removeChild(messages[i]);
        }
    }

    /**
     * Removes all values of the fields
     */
    function clearInputsValues() {
        var inputs = document.querySelectorAll('.feedback-inputs'),
            i;

        for (i = 0; i < inputs.length; i++) {
            inputs[i].value = '';
        }
    }

    /**
     * Creates a message when you try to send a message without verification CAPTCHA
     * @return {object} message - html element with error text
     */
    function createErrorMessageForCaptcha() {
        var textCaptcha = 'Установите флажок.',
            message = document.createElement('span');

        message.innerHTML = textCaptcha;
        message.className = 'validate-error';

        return message;
    }

    /**
     * Creates an error message if the field is not passed validation
     * @param {object} input - field of the form with the value
     * @return {object} message - message validation failure
     */
    function createErrorMessage(input) {

        if (!input) {
            return false;
        }

        var message = document.createElement('span'),
            textFio = 'Неправильные данные в поле ФИО. Вводите только буквы русского алфавита. Убедитесь, что присутствуют хотя бы фамилия и имя.',
            textPhone = 'Введите номер телефона в правильном формате.',
            textMessage = 'Введите текст сообщения. Не менее 10 символов.';

        message.className = 'validate-error';

        switch (input.id) {
            case 'feedbackFIO':
                message.innerHTML = textFio;
                break;
            case 'feedbackPhone':
                message.innerHTML = textPhone;
                break;
            case 'feedbackText':
                message.innerHTML = textMessage;
                break;
            default:
                message.innerHTML = 'Заполните поле.';
                break
        }

        return message;

    }

    /**
     * Verification CAPTCHA
     * @return {boolean} result - if the validation fails returns false
     */
    function validateCaptcha() {
        var response = grecaptcha.getResponse(),
            result = false;

        if (response.length !== 0) {
            result = true;
        }

        return result;
    }

    /**
     * Input validation
     * @param {object} input - field of the form
     * @return {boolean} result - if the validation fails returns false
     */
    function checkInput(input) {
        var regExpForFio = new RegExp('^[А-ЯЁ][а-яё]+(-[А-ЯЁ][а-яё]+)? [А-ЯЁ][а-яё]+( [А-ЯЁ][а-яё]+)?$'),
            result = false;

        switch (input.id) {
            case 'feedbackFIO':
                if (regExpForFio.test(input.value)) {
                    result = true;
                }
                break;
            case 'feedbackPhone':
                if (input.value.length === 17) {
                    result = true;
                }
                break;
            case 'feedbackText':
                if (input.value.length >= 10) {
                    result = true;
                }
                break;
            default:
                result = true;
                break;
        }

        return result;
    }

    /**
     * Creates background for the modal window with the action
     * @return {object} background - background layer for the modal window
     */
    function getBackground() {
        var background = document.createElement('div');
        background.id = 'background';

        background.onclick = function() { // при клике на слой затемнения все исчезнет
            background.parentNode.removeChild(background); // удаляем затемнение
            feedbackWindow.style.display = 'none'; // делаем окно невидимым
            return false;
        };

        return background;
    }

    this.open = open;
    this.close = close;
};
