!(function(g, n, u) {
    "use strict";

    /**
     * Returns array of all possible DOM events 
     */
    u.getAllDomEvents = function(el) {
        el = el || n.d.createElement('div');
        var events = [];
        for (var property in el) {
            var match = property.match(/^on(.*)/)
            if (match) {
                events.push(match[1]);
            }
        }
        return events;
    };


}(this, typeof EM === 'object' ? EM : this.EM = {},
    typeof EM.Utils === 'object' ? EM.Utils : this.EM.Utils = {}));
