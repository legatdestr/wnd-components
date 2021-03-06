// template

!(function (g, n, u) {
    "use strict";

    /**
     * templayed templater
     * @author archan937
     * @link https://github.com/archan937/templayed.js/blob/master/src/templayed.js
     * @link http://archan937.github.io/templayed.js/ demo
     * @type {Function}
     * @example <caption>Example usage of template</caption>
     * template  = "<ul>{{#names}}<li>{{../fullName}}</li>{{/names}}</ul>",
     * // variables = {
     * //   names: [{firstName: "Paul", lastName: "Engel"}, {firstName: "Chunk", lastName: "Norris"}],
     * //   fullName: function() {
     * //     return this.lastName + ", " + this.firstName;
     * //   }
     * // };
     * // templayed(template)(variables); //=> "<ul><li>Engel, Paul</li><li>Norris, Chunk</li></ul>";
     */
    var templayed = u.template = function (template, vars) {

        var get = function (path, i) {
                i = 1;
                path = path.replace(/\.\.\//g, function () {
                    i++;
                    return '';
                });
                var js = ['vars[vars.length - ', i, ']'],
                    keys = (path == "." ? [] : path.split(".")),
                    j = 0;
                for (j; j < keys.length; j++) {
                    js.push('.' + keys[j]);
                }
                ;
                return js.join('');
            },
            tag = function (template) {
                return template.replace(/\{\{(!|&|\{)?\s*(.*?)\s*}}+/g, function (match, operator, context) {
                    if (operator == "!") return '';
                    var i = inc++;
                    return ['"; var o', i, ' = ', get(context), ', s', i, ' = typeof(o', i, ') == "function" ? o', i, '.call(vars[vars.length - 1]) : o', i, '; s', i, ' = ( s', i, ' || s', i, ' == 0 ? s', i, ': "") + ""; s += ',
                        (operator ? ('s' + i) : '(/[&"><]/.test(s' + i + ') ? s' + i + '.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/>/g,"&gt;").replace(/</g,"&lt;") : s' + i + ')'), ' + "'
                    ].join('');
                });
            },
            block = function (template) {
                return tag(template.replace(/\{\{(\^|#)(.*?)}}(.*?)\{\{\/\2}}/g, function (match, operator, key, context) {
                    var i = inc++;
                    return ['"; var o', i, ' = ', get(key), '; ',
                        (operator == "^" ? ['if ((o', i, ' instanceof Array) ? !o', i, '.length : !o', i, ') { s += "', block(context), '"; } '] : ['if (typeof(o', i, ') == "boolean" && o', i, ') { s += "', block(context), '"; } else if (o', i, ') { for (var i', i, ' = 0; i', i, ' < o',
                            i, '.length; i', i, '++) { vars.push(o', i, '[i', i, ']); s += "', block(context), '"; vars.pop(); }}'
                        ]).join(''), '; s += "'
                    ].join('');
                }));
            },
            inc = 0;

        return new Function("vars", 'vars = [vars], s = "' + block(template.replace(/"/g, '\\"').replace(/[\n|\r\n]/g, '\\n')) + '"; return s;');
    };

}(this, typeof EM === 'object' ? EM : this.EM = {},
    typeof EM.Utils === 'object' ? EM.Utils : this.EM.Utils = {}));
