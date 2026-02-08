define("@glimmer/owner", ["exports", "@glimmer/util"], function (_exports, _util) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.OWNER = void 0;
  _exports.getOwner = getOwner;
  _exports.setOwner = setOwner;
  var OWNER = (0, _util.symbol)('OWNER');
  /**
    Framework objects in a Glimmer application may receive an owner object.
    Glimmer is unopinionated about this owner, but will forward it through its
    internal resolution system, and through its managers if it is provided.
  */

  _exports.OWNER = OWNER;

  function getOwner(object) {
    return object[OWNER];
  }
  /**
    `setOwner` set's an object's owner
  */


  function setOwner(object, owner) {
    object[OWNER] = owner;
  }
});