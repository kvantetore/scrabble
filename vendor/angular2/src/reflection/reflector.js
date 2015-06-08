var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var Reflector = (function () {
    function Reflector(reflectionCapabilities) {
        this._typeInfo = collection_1.MapWrapper.create();
        this._getters = collection_1.MapWrapper.create();
        this._setters = collection_1.MapWrapper.create();
        this._methods = collection_1.MapWrapper.create();
        this.reflectionCapabilities = reflectionCapabilities;
    }
    Reflector.prototype.registerType = function (type, typeInfo) {
        collection_1.MapWrapper.set(this._typeInfo, type, typeInfo);
    };
    Reflector.prototype.registerGetters = function (getters) {
        _mergeMaps(this._getters, getters);
    };
    Reflector.prototype.registerSetters = function (setters) {
        _mergeMaps(this._setters, setters);
    };
    Reflector.prototype.registerMethods = function (methods) {
        _mergeMaps(this._methods, methods);
    };
    Reflector.prototype.factory = function (type) {
        if (this._containsTypeInfo(type)) {
            return this._getTypeInfoField(type, "factory", null);
        }
        else {
            return this.reflectionCapabilities.factory(type);
        }
    };
    Reflector.prototype.parameters = function (typeOrFunc) {
        if (collection_1.MapWrapper.contains(this._typeInfo, typeOrFunc)) {
            return this._getTypeInfoField(typeOrFunc, "parameters", []);
        }
        else {
            return this.reflectionCapabilities.parameters(typeOrFunc);
        }
    };
    Reflector.prototype.annotations = function (typeOrFunc) {
        if (collection_1.MapWrapper.contains(this._typeInfo, typeOrFunc)) {
            return this._getTypeInfoField(typeOrFunc, "annotations", []);
        }
        else {
            return this.reflectionCapabilities.annotations(typeOrFunc);
        }
    };
    Reflector.prototype.interfaces = function (type) {
        if (collection_1.MapWrapper.contains(this._typeInfo, type)) {
            return this._getTypeInfoField(type, "interfaces", []);
        }
        else {
            return this.reflectionCapabilities.interfaces(type);
        }
    };
    Reflector.prototype.getter = function (name) {
        if (collection_1.MapWrapper.contains(this._getters, name)) {
            return collection_1.MapWrapper.get(this._getters, name);
        }
        else {
            return this.reflectionCapabilities.getter(name);
        }
    };
    Reflector.prototype.setter = function (name) {
        if (collection_1.MapWrapper.contains(this._setters, name)) {
            return collection_1.MapWrapper.get(this._setters, name);
        }
        else {
            return this.reflectionCapabilities.setter(name);
        }
    };
    Reflector.prototype.method = function (name) {
        if (collection_1.MapWrapper.contains(this._methods, name)) {
            return collection_1.MapWrapper.get(this._methods, name);
        }
        else {
            return this.reflectionCapabilities.method(name);
        }
    };
    Reflector.prototype._getTypeInfoField = function (typeOrFunc, key, defaultValue) {
        var res = collection_1.MapWrapper.get(this._typeInfo, typeOrFunc)[key];
        return lang_1.isPresent(res) ? res : defaultValue;
    };
    Reflector.prototype._containsTypeInfo = function (typeOrFunc) { return collection_1.MapWrapper.contains(this._typeInfo, typeOrFunc); };
    return Reflector;
})();
exports.Reflector = Reflector;
function _mergeMaps(target, config) {
    collection_1.StringMapWrapper.forEach(config, function (v, k) { return collection_1.MapWrapper.set(target, k, v); });
}
exports.__esModule = true;
//# sourceMappingURL=reflector.js.map