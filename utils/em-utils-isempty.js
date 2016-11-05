!(function (g, n, u) {
    "use strict";

    u.isEmpty = function (e) {
        if (typeof e === 'undefined') {
            return true;
        }
        if (e === 0) { // if e is a number
            return false;
        }
        var res = !e || (e == null) || (typeof e == 'undefined') || (e === '');
        if (res) {
            if (Object.prototype.toString.call(e) === '[object Array]') {
                res = e.length == 0;
            }
        }
        if (res) {
            var pr;
            for (pr in e) {
                if (Object.prototype.hasOwnProperty.call(e, pr)) {
                    res = false;
                    break;
                }
            }
        }
        return res;
    };

}(this, typeof EM === 'object' ? EM : this.EM = {},
    typeof EM.Utils === 'object' ? EM.Utils : this.EM.Utils = {}));
