define("@ember/string/lib/string_registry", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getString = getString;
  _exports.getStrings = getStrings;
  _exports.setStrings = setStrings;
  // STATE within a module is frowned upon, this exists
  // to support Ember.STRINGS but shield ember internals from this legacy global
  // API.
  var STRINGS = {};

  function setStrings(strings) {
    STRINGS = strings;
  }

  function getStrings() {
    return STRINGS;
  }

  function getString(name) {
    return STRINGS[name];
  }
});