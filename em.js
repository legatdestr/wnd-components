!(function(g, n) {
    "use strict";
    var
        O = g.Object,
        debug = n.debug = true,
        hasP = n.hasP = O.prototype.hasOwnProperty,
        toString = O.prototype.toString,
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
        isNum = function(e) {
            return (typeof entity === 'undefined') ? false : !isNaN(e);
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
                    if (!isObj(tgt[propName])) { // перезапись всех не Object и создание ссылки на Object
                        tgt[propName] = propVal;
                    } else {
                        if (!((!isObj(propVal)) && (n.error('В исходном и целевом объектах, не должны быть свойства с одинаковым именем но не объекты.')))) {
                            tgt[propName] = mixObjs(propVal, tgt[propName]); // рекурсивный вызов
                        }
                    }
                }
            });
            return tgt;
        },

        /**
         * Get type of the entity
         * getType(); //undefined
         * getType(null); //null
         * getType(NaN); //number
         * getType(5); //number
         * getType({}); //object
         * getType([]); //array
         * getType(''); //string
         * getType(function () {}); //function
         * getType(/a/) //regexp
         * getType(new Date()) //date
         */
        getType = n.getType = function(e) {
          return toString.call(e).split(' ')[1].slice(0, -1).toLowerCase();
        },

        extendClass = n.extendClass = function(Parent, Child) {
            var it, pr = Child.prototype;
            Child.prototype = Object.create(Parent.prototype);
            Child.prototype.constructor = Child;
            for (it in pr)(typeof Child.prototype[it] === 'undefined') && (Child.prototype[it] = pr[it]);
            return Child;
        },

        error = n.error = function(m) {
            console && isF(console.warn) && console.warn(m, arguments);
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

    n.registerWidget = function(name, definition) {
        if (!n.isObj(n.widgets)) {
            n.widgets = {};
        }
        n.widgets[name] = definition;
    };


}(this, typeof EM === 'object' ? EM : this.EM = {}));
