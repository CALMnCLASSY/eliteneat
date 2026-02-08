define("@ember/canary-features/index", ["exports", "@ember/-internals/environment", "@ember/polyfills"], function (_exports, _environment, _polyfills) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.FEATURES = _exports.EMBER_STRICT_MODE = _exports.EMBER_NAMED_BLOCKS = _exports.EMBER_MODERNIZED_BUILT_IN_COMPONENTS = _exports.EMBER_LIBRARIES_ISREGISTERED = _exports.EMBER_IMPROVED_INSTRUMENTATION = _exports.EMBER_GLIMMER_INVOKE_HELPER = _exports.EMBER_GLIMMER_HELPER_MANAGER = _exports.EMBER_DYNAMIC_HELPERS_AND_MODIFIERS = _exports.DEFAULT_FEATURES = void 0;
  _exports.isEnabled = isEnabled;

  /**
    Set `EmberENV.FEATURES` in your application's `config/environment.js` file
    to enable canary features in your application.
  
    See the [feature flag guide](https://guides.emberjs.com/release/configuring-ember/feature-flags/)
    for more details.
  
    @module @ember/canary-features
    @public
  */
  var DEFAULT_FEATURES = {
    EMBER_LIBRARIES_ISREGISTERED: false,
    EMBER_IMPROVED_INSTRUMENTATION: false,
    EMBER_NAMED_BLOCKS: true,
    EMBER_GLIMMER_HELPER_MANAGER: true,
    EMBER_GLIMMER_INVOKE_HELPER: true,
    EMBER_MODERNIZED_BUILT_IN_COMPONENTS: false,
    EMBER_STRICT_MODE: true,
    EMBER_DYNAMIC_HELPERS_AND_MODIFIERS: false
  };
  /**
    The hash of enabled Canary features. Add to this, any canary features
    before creating your application.
  
    @class FEATURES
    @static
    @since 1.1.0
    @public
  */

  _exports.DEFAULT_FEATURES = DEFAULT_FEATURES;
  var FEATURES = (0, _polyfills.assign)(DEFAULT_FEATURES, _environment.ENV.FEATURES);
  /**
    Determine whether the specified `feature` is enabled. Used by Ember's
    build tools to exclude experimental features from beta/stable builds.
  
    You can define the following configuration options:
  
    * `EmberENV.ENABLE_OPTIONAL_FEATURES` - enable any features that have not been explicitly
      enabled/disabled.
  
    @method isEnabled
    @param {String} feature The feature to check
    @return {Boolean}
    @since 1.1.0
    @public
  */

  _exports.FEATURES = FEATURES;

  function isEnabled(feature) {
    var value = FEATURES[feature];

    if (value === true || value === false) {
      return value;
    } else if (_environment.ENV.ENABLE_OPTIONAL_FEATURES) {
      return true;
    } else {
      return false;
    }
  }

  function featureValue(value) {
    if (_environment.ENV.ENABLE_OPTIONAL_FEATURES && value === null) {
      return true;
    }

    return value;
  }

  var EMBER_LIBRARIES_ISREGISTERED = featureValue(FEATURES.EMBER_LIBRARIES_ISREGISTERED);
  _exports.EMBER_LIBRARIES_ISREGISTERED = EMBER_LIBRARIES_ISREGISTERED;
  var EMBER_IMPROVED_INSTRUMENTATION = featureValue(FEATURES.EMBER_IMPROVED_INSTRUMENTATION);
  _exports.EMBER_IMPROVED_INSTRUMENTATION = EMBER_IMPROVED_INSTRUMENTATION;
  var EMBER_NAMED_BLOCKS = featureValue(FEATURES.EMBER_NAMED_BLOCKS);
  _exports.EMBER_NAMED_BLOCKS = EMBER_NAMED_BLOCKS;
  var EMBER_GLIMMER_HELPER_MANAGER = featureValue(FEATURES.EMBER_GLIMMER_HELPER_MANAGER);
  _exports.EMBER_GLIMMER_HELPER_MANAGER = EMBER_GLIMMER_HELPER_MANAGER;
  var EMBER_GLIMMER_INVOKE_HELPER = featureValue(FEATURES.EMBER_GLIMMER_INVOKE_HELPER);
  _exports.EMBER_GLIMMER_INVOKE_HELPER = EMBER_GLIMMER_INVOKE_HELPER;
  var EMBER_MODERNIZED_BUILT_IN_COMPONENTS = featureValue(FEATURES.EMBER_MODERNIZED_BUILT_IN_COMPONENTS);
  _exports.EMBER_MODERNIZED_BUILT_IN_COMPONENTS = EMBER_MODERNIZED_BUILT_IN_COMPONENTS;
  var EMBER_STRICT_MODE = featureValue(FEATURES.EMBER_STRICT_MODE);
  _exports.EMBER_STRICT_MODE = EMBER_STRICT_MODE;
  var EMBER_DYNAMIC_HELPERS_AND_MODIFIERS = featureValue(FEATURES.EMBER_DYNAMIC_HELPERS_AND_MODIFIERS);
  _exports.EMBER_DYNAMIC_HELPERS_AND_MODIFIERS = EMBER_DYNAMIC_HELPERS_AND_MODIFIERS;
});