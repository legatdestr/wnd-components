!(function(g, n) {
    "use strict";
    var
        O = g.Object,
        hasP = n.hasP = O.prototype.hasOwnProperty,
        toString = O.prototype.toString,
        chs = {}, // channels for observers
        d = n.d = g.document,
        noop = n.noop = g.Function.prototype,
        isObj = n.isObj = function(e) {
            return toString.call(e) === '[object Object]';
        },
        isF = n.isF = function(e) {
            return toString.call(e) === '[object Function]';
        },
        isArr = n.isArr = function(e) {
            return toString.call(e) === '[object Array]';
        },
        isStr = n.isStr = function(e) {
            return toString.call(e) === '[object String]';
        },
        each = n.each = function(o, c) {
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
        mixObjs = n.mixObjs = function(src, tgt) {
            (!isObj(src) || !isObj(tgt)) && n.error('src, tgt must be the Object');
            each(src, function(propName, propVal) {
                if (!((!tgt[propName]) && (tgt[propName] = propVal))) {
                    // свойство в целевом объекте уже есть
                    if (!isObj(tgt[propName])) { // перезапись всех не Object и создание ссылки на Object
                        tgt[propName] = propVal;
                    } else {
                        // свойство в целевом есть и оно объект типа Object
                        // проверить что в исходном объекте свойство тоже объект иначе ошибка
                        if (!isObj(propVal)) {
                            throw new Error('В исходном и целевом объектах, свойства с одинаковым именем но не объекты.');
                        } else {
                            tgt[propName] = mixObjs(propVal, tgt[propName]); // рекурсивный вызов
                        }
                    }
                }
            });

            return tgt;
        },

        extendClass = n.extendClass = function(Parent, Child) {
            var pr = Child.prototype,
                it;
            Child.prototype = Object.create(Parent.prototype);
            Child.prototype.constructor = Child;
            for (it in pr)(typeof Child.prototype[it] === 'undefined') && (Child.prototype[it] = pr[it]);
            return Child;
        },

        error = n.error = function(m) {
            console && isF(console.warn) && console.warn(m);
            throw new g.Error(m);
        },

        ajax = n.ajax = (function(g, n) {
            "use strict";
            var defPars = {
                    url: '',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: null,
                    method: 'POST', // POST | GET
                    withCredentials: false
                },
                getQ = function() {
                    return g.XMLHttpRequest ? new g.XMLHttpRequest() : new g.ActiveXObject("MSXML2.XMLHTTP.3.0");
                };
            return function(prms, c, fc) {
                var i, req = getQ();
                n.isStr(prms) && (prms = {
                    url: prms
                });
                prms = n.mixObjs(defPars, prms);
                (!n.isObj(prms.headers)) && (prms.headers = g.JSON.parse(g.JSON.stringify(defPars.headers)));
                (!prms.body) && (prms.headers = {});
                for (i in req)(n.hasP.call(prms, i) && (req[i] = prms[i]));
                req.onreadystatechange = req.onreadystatechange || function() {
                    if (req.readyState == 4 && req.status == 200) n.isF(c) && c(req.status, req.responseText, req)
                    else n.isF(fc) && fc(req.status, req);
                }
                req.open(prms.method, prms.url, true);
                n.each(prms.headers, function(f, v) {
                    req.setRequestHeader(f, v);
                });
                req.send(prms.body)
            };

        }(g, n)),

        genElId = n.genElId = function() {
            var min = 1000000,
                max = 9999999;
            return 'em-' + ~~(min - 0.5 + g.Math.random() * (max - min + 1));
        },
        repl = g.String.prototype.replace,
        renderTpl = n.renderTpl = function(t, pHldrs, vals, erMsg) {
            var p;
            erMsg = erMsg || '';
            n.each(pHldrs, function(k, v) {
                p = '{{' + v + '}}';
                (t.indexOf(p) < 0) && n.error(erMsg + p + ' not found.');
                t = repl.call(t, p, vals[v]);
            });
            return t;
        };

    n.on = function(ch, fn) {
        if (!chs[ch]) chs[ch] = [];
        chs[ch].push({
            ctxt: this,
            cbck: fn
        });
        return this;
    };

    n.fire = function(ch) {
        console.log(arguments);
        var args = g.Array.prototype.slice.call(arguments, 1);
        if (chs[ch]) {
            each(chs[ch], function(args) {
                return function(k, s) {
                    s.cbck.apply(s.ctxt, args);
                };
            }(args));
        };
        return this;
    };

    n.registerWidget = function(name, FConstructor) {
        if (!n.isObj(n.widgets)) {
            n.widgets = {};
        }
        n.widgets[name] = FConstructor;
    };


}(this, typeof EM === 'object' ? EM : this.EM = {}));
