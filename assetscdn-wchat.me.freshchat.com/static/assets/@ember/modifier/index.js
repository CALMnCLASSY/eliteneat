define("@ember/modifier/index", ["exports", "@glimmer/manager"], function (_exports, _manager) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "capabilties", {
    enumerable: true,
    get: function get() {
      return _manager.modifierCapabilities;
    }
  });
  Object.defineProperty(_exports, "setModifierManager", {
    enumerable: true,
    get: function get() {
      return _manager.setModifierManager;
    }
  });
});