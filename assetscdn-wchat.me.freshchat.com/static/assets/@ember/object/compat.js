define("@ember/object/compat", ["exports", "@ember/-internals/metal", "@ember/debug", "@glimmer/validator"], function (_exports, _metal, _debug, _validator) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.dependentKeyCompat = dependentKeyCompat;

  var wrapGetterSetter = function wrapGetterSetter(target, key, desc) {
    var originalGet = desc.get;
    (false && !((0, _metal.descriptorForProperty)(target, key) === undefined) && (0, _debug.assert)('You attempted to use @dependentKeyCompat on a property that already has been decorated with either @computed or @tracked. @dependentKeyCompat is only necessary for native getters that are not decorated with @computed.', (0, _metal.descriptorForProperty)(target, key) === undefined));

    if (originalGet !== undefined) {
      desc.get = function () {
        var _this = this;

        var propertyTag = (0, _validator.tagFor)(this, key);
        var ret;
        var tag = (0, _validator.track)(function () {
          ret = originalGet.call(_this);
        });
        (0, _validator.updateTag)(propertyTag, tag);
        (0, _validator.consumeTag)(tag);
        return ret;
      };
    }

    return desc;
  };

  function dependentKeyCompat(target, key, desc) {
    if (!(0, _metal.isElementDescriptor)([target, key, desc])) {
      desc = target;

      var decorator = function decorator(target, key, _desc, _meta, isClassicDecorator) {
        (false && !(isClassicDecorator) && (0, _debug.assert)('The @dependentKeyCompat decorator may only be passed a method when used in classic classes. You should decorate getters/setters directly in native classes', isClassicDecorator));
        (false && !(desc !== null && typeof desc === 'object' && (typeof desc.get === 'function' || typeof desc.set === 'function')) && (0, _debug.assert)('The dependentKeyCompat() decorator must be passed a getter or setter when used in classic classes', desc !== null && typeof desc === 'object' && (typeof desc.get === 'function' || typeof desc.set === 'function')));
        return wrapGetterSetter(target, key, desc);
      };

      (0, _metal.setClassicDecorator)(decorator);
      return decorator;
    }

    (false && !(desc !== null && typeof desc.get === 'function' || typeof desc.set === 'function') && (0, _debug.assert)('The @dependentKeyCompat decorator must be applied to getters/setters when used in native classes', desc !== null && typeof desc.get === 'function' || typeof desc.set === 'function'));
    return wrapGetterSetter(target, key, desc);
  }

  (0, _metal.setClassicDecorator)(dependentKeyCompat);
});