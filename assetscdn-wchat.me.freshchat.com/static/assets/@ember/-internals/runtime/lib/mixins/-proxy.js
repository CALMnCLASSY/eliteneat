define("@ember/-internals/runtime/lib/mixins/-proxy", ["exports", "@ember/-internals/meta", "@ember/-internals/metal", "@ember/-internals/utils", "@ember/debug", "@glimmer/manager", "@glimmer/validator"], function (_exports, _meta, _metal, _utils, _debug, _manager, _validator) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.contentFor = contentFor;
  _exports.default = void 0;

  /**
  @module ember
  */
  function contentFor(proxy) {
    var content = (0, _metal.get)(proxy, 'content');
    (0, _validator.updateTag)((0, _metal.tagForObject)(proxy), (0, _metal.tagForObject)(content));
    return content;
  }

  function customTagForProxy(proxy, key, addMandatorySetter) {
    var meta = (0, _validator.tagMetaFor)(proxy);
    var tag = (0, _validator.tagFor)(proxy, key, meta);

    if (false
    /* DEBUG */
    ) {
      // TODO: Replace this with something more first class for tracking tags in DEBUG
      tag._propertyKey = key;
    }

    if (key in proxy) {
      if (false
      /* DEBUG */
      && addMandatorySetter) {
        (0, _utils.setupMandatorySetter)(tag, proxy, key);
      }

      return tag;
    } else {
      var tags = [tag, (0, _validator.tagFor)(proxy, 'content', meta)];
      var content = contentFor(proxy);

      if ((0, _utils.isObject)(content)) {
        tags.push((0, _metal.tagForProperty)(content, key, addMandatorySetter));
      }

      return (0, _validator.combine)(tags);
    }
  }
  /**
    `Ember.ProxyMixin` forwards all properties not defined by the proxy itself
    to a proxied `content` object.  See ObjectProxy for more details.
  
    @class ProxyMixin
    @namespace Ember
    @private
  */


  var _default = _metal.Mixin.create({
    /**
      The object whose properties will be forwarded.
       @property content
      @type {unknown}
      @default null
      @public
    */
    content: null,
    init: function init() {
      this._super.apply(this, arguments);

      (0, _utils.setProxy)(this);
      (0, _metal.tagForObject)(this);
      (0, _manager.setCustomTagFor)(this, customTagForProxy);
    },
    willDestroy: function willDestroy() {
      this.set('content', null);

      this._super.apply(this, arguments);
    },
    isTruthy: (0, _metal.computed)('content', function () {
      return Boolean((0, _metal.get)(this, 'content'));
    }),
    unknownProperty: function unknownProperty(key) {
      var content = contentFor(this);

      if (content) {
        return (0, _metal.get)(content, key);
      }
    },
    setUnknownProperty: function setUnknownProperty(key, value) {
      var m = (0, _meta.meta)(this);

      if (m.isInitializing() || m.isPrototypeMeta(this)) {
        // if marked as prototype or object is initializing then just
        // defineProperty rather than delegate
        (0, _metal.defineProperty)(this, key, null, value);
        return value;
      }

      var content = contentFor(this);
      (false && !(content) && (0, _debug.assert)("Cannot delegate set('" + key + "', " + value + ") to the 'content' property of object proxy " + this + ": its 'content' is undefined.", content));
      return (0, _metal.set)(content, key, value);
    }
  });

  _exports.default = _default;
});