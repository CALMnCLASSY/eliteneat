define("@ember/polyfills/index", ["exports", "@ember/deprecated-features", "@ember/polyfills/lib/merge", "@ember/polyfills/lib/assign"], function (_exports, _deprecatedFeatures, _merge, _assign) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "assign", {
    enumerable: true,
    get: function get() {
      return _assign.default;
    }
  });
  Object.defineProperty(_exports, "assignPolyfill", {
    enumerable: true,
    get: function get() {
      return _assign.assign;
    }
  });
  _exports.merge = void 0;
  var merge = _deprecatedFeatures.MERGE ? _merge.default : undefined; // Export `assignPolyfill` for testing

  _exports.merge = merge;
});