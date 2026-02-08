define("@ember/-internals/runtime/lib/system/object", ["exports", "ember-babel", "@ember/-internals/container", "@ember/-internals/utils", "@ember/-internals/metal", "@ember/-internals/runtime/lib/system/core_object", "@ember/-internals/runtime/lib/mixins/observable", "@ember/debug"], function (_exports, _emberBabel, _container, _utils, _metal, _core_object, _observable, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.FrameworkObject = void 0;

  /**
  @module @ember/object
  */

  /**
    `EmberObject` is the main base class for all Ember objects. It is a subclass
    of `CoreObject` with the `Observable` mixin applied. For details,
    see the documentation for each of these.
  
    @class EmberObject
    @extends CoreObject
    @uses Observable
    @public
  */
  var EmberObject = /*#__PURE__*/function (_CoreObject) {
    (0, _emberBabel.inheritsLoose)(EmberObject, _CoreObject);

    function EmberObject() {
      return _CoreObject.apply(this, arguments) || this;
    }

    (0, _emberBabel.createClass)(EmberObject, [{
      key: "_debugContainerKey",
      get: function get() {
        var factory = (0, _container.getFactoryFor)(this);
        return factory !== undefined && factory.fullName;
      }
    }]);
    return EmberObject;
  }(_core_object.default);

  _exports.default = EmberObject;
  (0, _utils.setName)(EmberObject, 'Ember.Object');

  _observable.default.apply(EmberObject.prototype);

  var FrameworkObject;
  _exports.FrameworkObject = FrameworkObject;

  _exports.FrameworkObject = FrameworkObject = /*#__PURE__*/function (_CoreObject2) {
    (0, _emberBabel.inheritsLoose)(FrameworkObject, _CoreObject2);

    function FrameworkObject() {
      return _CoreObject2.apply(this, arguments) || this;
    }

    (0, _emberBabel.createClass)(FrameworkObject, [{
      key: "_debugContainerKey",
      get: function get() {
        var factory = (0, _container.getFactoryFor)(this);
        return factory !== undefined && factory.fullName;
      }
    }]);
    return FrameworkObject;
  }(_core_object.default);

  _observable.default.apply(FrameworkObject.prototype);

  if (false
  /* DEBUG */
  ) {
    var INIT_WAS_CALLED = (0, _utils.symbol)('INIT_WAS_CALLED');
    var ASSERT_INIT_WAS_CALLED = (0, _utils.symbol)('ASSERT_INIT_WAS_CALLED');

    _exports.FrameworkObject = FrameworkObject = /*#__PURE__*/function (_EmberObject) {
      (0, _emberBabel.inheritsLoose)(DebugFrameworkObject, _EmberObject);

      function DebugFrameworkObject() {
        return _EmberObject.apply(this, arguments) || this;
      }

      var _proto = DebugFrameworkObject.prototype;

      _proto.init = function init() {
        _EmberObject.prototype.init.apply(this, arguments);

        this[INIT_WAS_CALLED] = true;
      };

      _proto[ASSERT_INIT_WAS_CALLED] = function () {
        (false && !(this[INIT_WAS_CALLED]) && (0, _debug.assert)("You must call `super.init(...arguments);` or `this._super(...arguments)` when overriding `init` on a framework object. Please update " + this + " to call `super.init(...arguments);` from `init` when using native classes or `this._super(...arguments)` when using `EmberObject.extend()`.", this[INIT_WAS_CALLED]));
      };

      return DebugFrameworkObject;
    }(EmberObject);

    (0, _metal.addListener)(FrameworkObject.prototype, 'init', null, ASSERT_INIT_WAS_CALLED);
  }
});