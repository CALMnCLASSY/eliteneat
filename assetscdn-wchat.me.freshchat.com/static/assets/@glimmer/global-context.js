define("@glimmer/global-context", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.warnIfStyleNotTrusted = _exports.toIterator = _exports.toBool = _exports.testOverrideGlobalContext = _exports.setProp = _exports.setPath = _exports.scheduleRevalidate = _exports.scheduleDestroyed = _exports.scheduleDestroy = _exports.getProp = _exports.getPath = _exports.deprecate = _exports.default = _exports.assertGlobalContextWasSet = _exports.assert = void 0;

  /**
   * This package contains global context functions for Glimmer. These functions
   * are set by the embedding environment and must be set before initial render.
   *
   * These functions should meet the following criteria:
   *
   * - Must be provided by the embedder, due to having framework specific
   *   behaviors (e.g. interop with classic Ember behaviors that should not be
   *   upstreamed) or to being out of scope for the VM (e.g. scheduling a
   *   revalidation)
   * - Never differ between render roots
   * - Never change over time
   *
   */

  /**
   * Schedules a VM revalidation.
   *
   * Note: this has a default value so that tags can warm themselves when first loaded.
   */
  var scheduleRevalidate = function scheduleRevalidate() {};
  /**
   * Schedules a destructor to run
   *
   * @param destroyable The destroyable being destroyed
   * @param destructor The destructor being scheduled
   */


  _exports.scheduleRevalidate = scheduleRevalidate;
  var scheduleDestroy;
  /**
   * Finalizes destruction
   *
   * @param finalizer finalizer function
   */

  _exports.scheduleDestroy = scheduleDestroy;
  var scheduleDestroyed;
  /**
   * Hook to provide iterators for `{{each}}` loops
   *
   * @param value The value to create an iterator for
   */

  _exports.scheduleDestroyed = scheduleDestroyed;
  var toIterator;
  /**
   * Hook to specify truthiness within Glimmer templates
   *
   * @param value The value to convert to a boolean
   */

  _exports.toIterator = toIterator;
  var toBool;
  /**
   * Hook for specifying how Glimmer should access properties in cases where it
   * needs to. For instance, accessing an object's values in templates.
   *
   * @param obj The object provided to get a value from
   * @param path The path to get the value from
   */

  _exports.toBool = toBool;
  var getProp;
  /**
   * Hook for specifying how Glimmer should update props in cases where it needs
   * to. For instance, when updating a template reference (e.g. 2-way-binding)
   *
   * @param obj The object provided to get a value from
   * @param prop The prop to set the value at
   * @param value The value to set the value to
   */

  _exports.getProp = getProp;
  var setProp;
  /**
   * Hook for specifying how Glimmer should access paths in cases where it needs
   * to. For instance, the `key` value of `{{each}}` loops.
   *
   * @param obj The object provided to get a value from
   * @param path The path to get the value from
   */

  _exports.setProp = setProp;
  var getPath;
  /**
   * Hook for specifying how Glimmer should update paths in cases where it needs
   * to. For instance, when updating a template reference (e.g. 2-way-binding)
   *
   * @param obj The object provided to get a value from
   * @param path The path to get the value from
   */

  _exports.getPath = getPath;
  var setPath;
  /**
   * Hook to warn if a style binding string or value was not marked as trusted
   * (e.g. HTMLSafe)
   */

  _exports.setPath = setPath;
  var warnIfStyleNotTrusted;
  /**
   * Hook to customize assertion messages in the VM. Usages can be stripped out
   * by using the @glimmer/vm-babel-plugins package.
   */

  _exports.warnIfStyleNotTrusted = warnIfStyleNotTrusted;
  var assert;
  /**
   * Hook to customize deprecation messages in the VM. Usages can be stripped out
   * by using the @glimmer/vm-babel-plugins package.
   */

  _exports.assert = assert;
  var deprecate;
  _exports.deprecate = deprecate;
  var globalContextWasSet = false;

  function setGlobalContext(context) {
    if (false
    /* DEBUG */
    ) {
      if (globalContextWasSet) {
        throw new Error('Attempted to set the global context twice. This should only be set once.');
      }

      globalContextWasSet = true;
    }

    _exports.scheduleRevalidate = scheduleRevalidate = context.scheduleRevalidate;
    _exports.scheduleDestroy = scheduleDestroy = context.scheduleDestroy;
    _exports.scheduleDestroyed = scheduleDestroyed = context.scheduleDestroyed;
    _exports.toIterator = toIterator = context.toIterator;
    _exports.toBool = toBool = context.toBool;
    _exports.getProp = getProp = context.getProp;
    _exports.setProp = setProp = context.setProp;
    _exports.getPath = getPath = context.getPath;
    _exports.setPath = setPath = context.setPath;
    _exports.warnIfStyleNotTrusted = warnIfStyleNotTrusted = context.warnIfStyleNotTrusted;
    _exports.assert = assert = context.assert;
    _exports.deprecate = deprecate = context.deprecate;
  }

  var assertGlobalContextWasSet;
  _exports.assertGlobalContextWasSet = assertGlobalContextWasSet;
  var testOverrideGlobalContext;
  _exports.testOverrideGlobalContext = testOverrideGlobalContext;

  if (false
  /* DEBUG */
  ) {
    _exports.assertGlobalContextWasSet = assertGlobalContextWasSet = function assertGlobalContextWasSet() {
      if (globalContextWasSet === false) {
        throw new Error('The global context for Glimmer VM was not set. You must set these global context functions to let Glimmer VM know how to accomplish certain operations. You can do this by importing `setGlobalContext` from `@glimmer/global-context`');
      }
    };

    _exports.testOverrideGlobalContext = testOverrideGlobalContext = function testOverrideGlobalContext(context) {
      var originalGlobalContext = globalContextWasSet ? {
        scheduleRevalidate: scheduleRevalidate,
        scheduleDestroy: scheduleDestroy,
        scheduleDestroyed: scheduleDestroyed,
        toIterator: toIterator,
        toBool: toBool,
        getProp: getProp,
        setProp: setProp,
        getPath: getPath,
        setPath: setPath,
        warnIfStyleNotTrusted: warnIfStyleNotTrusted,
        assert: assert,
        deprecate: deprecate
      } : null;

      if (context === null) {
        globalContextWasSet = false;
      } else {
        globalContextWasSet = true;
      }

      _exports.scheduleRevalidate = scheduleRevalidate = (context === null || context === void 0 ? void 0 : context.scheduleRevalidate) || scheduleRevalidate;
      _exports.scheduleDestroy = scheduleDestroy = (context === null || context === void 0 ? void 0 : context.scheduleDestroy) || scheduleDestroy;
      _exports.scheduleDestroyed = scheduleDestroyed = (context === null || context === void 0 ? void 0 : context.scheduleDestroyed) || scheduleDestroyed;
      _exports.toIterator = toIterator = (context === null || context === void 0 ? void 0 : context.toIterator) || toIterator;
      _exports.toBool = toBool = (context === null || context === void 0 ? void 0 : context.toBool) || toBool;
      _exports.getProp = getProp = (context === null || context === void 0 ? void 0 : context.getProp) || getProp;
      _exports.setProp = setProp = (context === null || context === void 0 ? void 0 : context.setProp) || setProp;
      _exports.getPath = getPath = (context === null || context === void 0 ? void 0 : context.getPath) || getPath;
      _exports.setPath = setPath = (context === null || context === void 0 ? void 0 : context.setPath) || setPath;
      _exports.warnIfStyleNotTrusted = warnIfStyleNotTrusted = (context === null || context === void 0 ? void 0 : context.warnIfStyleNotTrusted) || warnIfStyleNotTrusted;
      _exports.assert = assert = (context === null || context === void 0 ? void 0 : context.assert) || assert;
      _exports.deprecate = deprecate = (context === null || context === void 0 ? void 0 : context.deprecate) || deprecate;
      return originalGlobalContext;
    };
  }

  var _default = setGlobalContext;
  _exports.default = _default;
});