define("@ember/helper/index", ["exports", "@glimmer/manager", "@glimmer/runtime"], function (_exports, _manager, _runtime) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "capabilties", {
    enumerable: true,
    get: function get() {
      return _manager.helperCapabilities;
    }
  });
  Object.defineProperty(_exports, "invokeHelper", {
    enumerable: true,
    get: function get() {
      return _runtime.invokeHelper;
    }
  });
  Object.defineProperty(_exports, "setHelperManager", {
    enumerable: true,
    get: function get() {
      return _manager.setHelperManager;
    }
  });
});