!(function(g, n, u) {
    "use strict";

    /**
     * Checks if a value exists in an array
     * @param needle
     * @param haystack
     * @param strict
     * @returns {boolean}
     */
    u.inArray = function(needle, haystack) {
        var length = haystack.length;
        for (var i = 0; i < length; i++) {
            /* jshint eqeqeq: false, curly: false */
            if (haystack[i] == needle) return true;
        }
        return false;
    }

}(this, typeof EM === 'object' ? EM : this.EM = {},
    typeof EM.Utils === 'object' ? EM.Utils : this.EM.Utils = {}));
