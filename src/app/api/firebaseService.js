if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var di_1 = require('angular2/di');
var Firebase = require('firebase');
var FirebaseService = (function () {
    function FirebaseService() {
        this.ref = new Firebase("https://sizzling-torch-3178.firebaseio.com");
    }
    FirebaseService = __decorate([
        di_1.Injectable()
    ], FirebaseService);
    return FirebaseService;
})();
exports.FirebaseService = FirebaseService;
