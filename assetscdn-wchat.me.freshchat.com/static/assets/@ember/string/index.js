define("@ember/string/index", ["exports", "@ember/string/lib/string_registry", "@ember/-internals/environment", "@ember/-internals/utils", "@ember/debug"], function (_exports, _string_registry, _environment, _utils, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "_getStrings", {
    enumerable: true,
    get: function get() {
      return _string_registry.getStrings;
    }
  });
  Object.defineProperty(_exports, "_setStrings", {
    enumerable: true,
    get: function get() {
      return _string_registry.setStrings;
    }
  });
  _exports.camelize = camelize;
  _exports.capitalize = capitalize;
  _exports.classify = classify;
  _exports.dasherize = dasherize;
  _exports.decamelize = decamelize;
  _exports.loc = loc;
  _exports.underscore = underscore;
  _exports.w = w;

  /**
  @module @ember/string
  */
  var STRING_DASHERIZE_REGEXP = /[ _]/g;
  var STRING_DASHERIZE_CACHE = new _utils.Cache(1000, function (key) {
    return decamelize(key).replace(STRING_DASHERIZE_REGEXP, '-');
  });
  var STRING_CAMELIZE_REGEXP_1 = /(-|_|\.|\s)+(.)?/g;
  var STRING_CAMELIZE_REGEXP_2 = /(^|\/)([A-Z])/g;
  var CAMELIZE_CACHE = new _utils.Cache(1000, function (key) {
    return key.replace(STRING_CAMELIZE_REGEXP_1, function (_match, _separator, chr) {
      return chr ? chr.toUpperCase() : '';
    }).replace(STRING_CAMELIZE_REGEXP_2, function (match
    /*, separator, chr */
    ) {
      return match.toLowerCase();
    });
  });
  var STRING_CLASSIFY_REGEXP_1 = /^(-|_)+(.)?/;
  var STRING_CLASSIFY_REGEXP_2 = /(.)(-|_|\.|\s)+(.)?/g;
  var STRING_CLASSIFY_REGEXP_3 = /(^|\/|\.)([a-z])/g;
  var CLASSIFY_CACHE = new _utils.Cache(1000, function (str) {
    var replace1 = function replace1(_match, _separator, chr) {
      return chr ? "_" + chr.toUpperCase() : '';
    };

    var replace2 = function replace2(_match, initialChar, _separator, chr) {
      return initialChar + (chr ? chr.toUpperCase() : '');
    };

    var parts = str.split('/');

    for (var i = 0; i < parts.length; i++) {
      parts[i] = parts[i].replace(STRING_CLASSIFY_REGEXP_1, replace1).replace(STRING_CLASSIFY_REGEXP_2, replace2);
    }

    return parts.join('/').replace(STRING_CLASSIFY_REGEXP_3, function (match
    /*, separator, chr */
    ) {
      return match.toUpperCase();
    });
  });
  var STRING_UNDERSCORE_REGEXP_1 = /([a-z\d])([A-Z]+)/g;
  var STRING_UNDERSCORE_REGEXP_2 = /-|\s+/g;
  var UNDERSCORE_CACHE = new _utils.Cache(1000, function (str) {
    return str.replace(STRING_UNDERSCORE_REGEXP_1, '$1_$2').replace(STRING_UNDERSCORE_REGEXP_2, '_').toLowerCase();
  });
  var STRING_CAPITALIZE_REGEXP = /(^|\/)([a-z\u00C0-\u024F])/g;
  var CAPITALIZE_CACHE = new _utils.Cache(1000, function (str) {
    return str.replace(STRING_CAPITALIZE_REGEXP, function (match
    /*, separator, chr */
    ) {
      return match.toUpperCase();
    });
  });
  var STRING_DECAMELIZE_REGEXP = /([a-z\d])([A-Z])/g;
  var DECAMELIZE_CACHE = new _utils.Cache(1000, function (str) {
    return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
  });
  /**
    Defines string helper methods including string formatting and localization.
    Unless `EmberENV.EXTEND_PROTOTYPES.String` is `false` these methods will also be
    added to the `String.prototype` as well.
  
    @class String
    @public
  */

  function _fmt(str, formats) {
    // first, replace any ORDERED replacements.
    var idx = 0; // the current index for non-numerical replacements

    return str.replace(/%@([0-9]+)?/g, function (_s, argIndex) {
      var i = argIndex ? parseInt(argIndex, 10) - 1 : idx++;
      var r = i < formats.length ? formats[i] : undefined;
      return typeof r === 'string' ? r : r === null ? '(null)' : r === undefined ? '' : String(r);
    });
  }
  /**
    Formats the passed string, but first looks up the string in the localized
    strings hash. This is a convenient way to localize text.
  
    Note that it is traditional but not required to prefix localized string
    keys with an underscore or other character so you can easily identify
    localized strings.
  
    ```javascript
    import { loc } from '@ember/string';
  
    Ember.STRINGS = {
      '_Hello World': 'Bonjour le monde',
      '_Hello %@ %@': 'Bonjour %@ %@'
    };
  
    loc("_Hello World");  // 'Bonjour le monde';
    loc("_Hello %@ %@", ["John", "Smith"]);  // "Bonjour John Smith";
    ```
  
    @method loc
    @param {String} str The string to format
    @param {Array} formats Optional array of parameters to interpolate into string.
    @return {String} formatted string
    @public
    @deprecated
  */


  function loc(str, formats) {
    (false && !(false) && (0, _debug.deprecate)('loc is deprecated, please use a dedicated localization solution like ember-intl. More alternatives listed at https://emberobserver.com/categories/internationalization.', false, {
      id: 'ember-string.loc',
      until: '4.0.0',
      for: 'ember-source',
      url: 'https://deprecations.emberjs.com/v3.x#toc_ember-string-loc',
      since: {
        enabled: '3.24'
      }
    }));

    if (!Array.isArray(formats) || arguments.length > 2) {
      formats = Array.prototype.slice.call(arguments, 1);
    }

    str = (0, _string_registry.getString)(str) || str;
    return _fmt(str, formats);
  }
  /**
    Splits a string into separate units separated by spaces, eliminating any
    empty strings in the process. This is a convenience method for split that
    is mostly useful when applied to the `String.prototype`.
  
    ```javascript
    import { w } from '@ember/string';
  
    w("alpha beta gamma").forEach(function(key) {
      console.log(key);
    });
  
    // > alpha
    // > beta
    // > gamma
    ```
  
    @method w
    @param {String} str The string to split
    @return {Array} array containing the split strings
    @public
  */


  function w(str) {
    return str.split(/\s+/);
  }
  /**
    Converts a camelized string into all lower case separated by underscores.
  
    ```javascript
    import { decamelize } from '@ember/string';
  
    decamelize('innerHTML');          // 'inner_html'
    decamelize('action_name');        // 'action_name'
    decamelize('css-class-name');     // 'css-class-name'
    decamelize('my favorite items');  // 'my favorite items'
    ```
  
    @method decamelize
    @param {String} str The string to decamelize.
    @return {String} the decamelized string.
    @public
  */


  function decamelize(str) {
    return DECAMELIZE_CACHE.get(str);
  }
  /**
    Replaces underscores, spaces, or camelCase with dashes.
  
    ```javascript
    import { dasherize } from '@ember/string';
  
    dasherize('innerHTML');                // 'inner-html'
    dasherize('action_name');              // 'action-name'
    dasherize('css-class-name');           // 'css-class-name'
    dasherize('my favorite items');        // 'my-favorite-items'
    dasherize('privateDocs/ownerInvoice';  // 'private-docs/owner-invoice'
    ```
  
    @method dasherize
    @param {String} str The string to dasherize.
    @return {String} the dasherized string.
    @public
  */


  function dasherize(str) {
    return STRING_DASHERIZE_CACHE.get(str);
  }
  /**
    Returns the lowerCamelCase form of a string.
  
    ```javascript
    import { camelize } from '@ember/string';
  
    camelize('innerHTML');                   // 'innerHTML'
    camelize('action_name');                 // 'actionName'
    camelize('css-class-name');              // 'cssClassName'
    camelize('my favorite items');           // 'myFavoriteItems'
    camelize('My Favorite Items');           // 'myFavoriteItems'
    camelize('private-docs/owner-invoice');  // 'privateDocs/ownerInvoice'
    ```
  
    @method camelize
    @param {String} str The string to camelize.
    @return {String} the camelized string.
    @public
  */


  function camelize(str) {
    return CAMELIZE_CACHE.get(str);
  }
  /**
    Returns the UpperCamelCase form of a string.
  
    ```javascript
    import { classify } from '@ember/string';
  
    classify('innerHTML');                   // 'InnerHTML'
    classify('action_name');                 // 'ActionName'
    classify('css-class-name');              // 'CssClassName'
    classify('my favorite items');           // 'MyFavoriteItems'
    classify('private-docs/owner-invoice');  // 'PrivateDocs/OwnerInvoice'
    ```
  
    @method classify
    @param {String} str the string to classify
    @return {String} the classified string
    @public
  */


  function classify(str) {
    return CLASSIFY_CACHE.get(str);
  }
  /**
    More general than decamelize. Returns the lower\_case\_and\_underscored
    form of a string.
  
    ```javascript
    import { underscore } from '@ember/string';
  
    underscore('innerHTML');                 // 'inner_html'
    underscore('action_name');               // 'action_name'
    underscore('css-class-name');            // 'css_class_name'
    underscore('my favorite items');         // 'my_favorite_items'
    underscore('privateDocs/ownerInvoice');  // 'private_docs/owner_invoice'
    ```
  
    @method underscore
    @param {String} str The string to underscore.
    @return {String} the underscored string.
    @public
  */


  function underscore(str) {
    return UNDERSCORE_CACHE.get(str);
  }
  /**
    Returns the Capitalized form of a string
  
    ```javascript
    import { capitalize } from '@ember/string';
  
    capitalize('innerHTML')                 // 'InnerHTML'
    capitalize('action_name')               // 'Action_name'
    capitalize('css-class-name')            // 'Css-class-name'
    capitalize('my favorite items')         // 'My favorite items'
    capitalize('privateDocs/ownerInvoice'); // 'PrivateDocs/ownerInvoice'
    ```
  
    @method capitalize
    @param {String} str The string to capitalize.
    @return {String} The capitalized string.
    @public
  */


  function capitalize(str) {
    return CAPITALIZE_CACHE.get(str);
  }

  if (_environment.ENV.EXTEND_PROTOTYPES.String) {
    var deprecateEmberStringPrototypeExtension = function deprecateEmberStringPrototypeExtension(name, fn, message) {
      if (message === void 0) {
        message = "String prototype extensions are deprecated. Please import " + name + " from '@ember/string' instead.";
      }

      return function () {
        (false && !(false) && (0, _debug.deprecate)(message, false, {
          id: 'ember-string.prototype-extensions',
          for: 'ember-source',
          since: {
            enabled: '3.24'
          },
          until: '4.0.0',
          url: 'https://deprecations.emberjs.com/v3.x/#toc_ember-string-prototype_extensions'
        }));
        return fn.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
      };
    };

    Object.defineProperties(String.prototype, {
      /**
        See [String.w](/ember/release/classes/String/methods/w?anchor=w).
             @method w
        @for @ember/string
        @static
        @private
        @deprecated
      */
      w: {
        configurable: true,
        enumerable: false,
        writeable: true,
        value: deprecateEmberStringPrototypeExtension('w', w)
      },

      /**
        See [String.loc](/ember/release/classes/String/methods/loc?anchor=loc).
             @method loc
        @for @ember/string
        @static
        @private
        @deprecated
      */
      loc: {
        configurable: true,
        enumerable: false,
        writeable: true,
        value: function value() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return loc(this, args);
        }
      },

      /**
        See [String.camelize](/ember/release/classes/String/methods/camelize?anchor=camelize).
             @method camelize
        @for @ember/string
        @static
        @private
        @deprecated
      */
      camelize: {
        configurable: true,
        enumerable: false,
        writeable: true,
        value: deprecateEmberStringPrototypeExtension('camelize', camelize)
      },

      /**
        See [String.decamelize](/ember/release/classes/String/methods/decamelize?anchor=decamelize).
             @method decamelize
        @for @ember/string
        @static
        @private
        @deprecated
      */
      decamelize: {
        configurable: true,
        enumerable: false,
        writeable: true,
        value: deprecateEmberStringPrototypeExtension('decamelize', decamelize)
      },

      /**
        See [String.dasherize](/ember/release/classes/String/methods/dasherize?anchor=dasherize).
             @method dasherize
        @for @ember/string
        @static
        @private
        @deprecated
      */
      dasherize: {
        configurable: true,
        enumerable: false,
        writeable: true,
        value: deprecateEmberStringPrototypeExtension('dasherize', dasherize)
      },

      /**
        See [String.underscore](/ember/release/classes/String/methods/underscore?anchor=underscore).
             @method underscore
        @for @ember/string
        @static
        @private
        @deprecated
      */
      underscore: {
        configurable: true,
        enumerable: false,
        writeable: true,
        value: deprecateEmberStringPrototypeExtension('underscore', underscore)
      },

      /**
        See [String.classify](/ember/release/classes/String/methods/classify?anchor=classify).
             @method classify
        @for @ember/string
        @static
        @private
        @deprecated
      */
      classify: {
        configurable: true,
        enumerable: false,
        writeable: true,
        value: deprecateEmberStringPrototypeExtension('classify', classify)
      },

      /**
        See [String.capitalize](/ember/release/classes/String/methods/capitalize?anchor=capitalize).
             @method capitalize
        @for @ember/string
        @static
        @private
        @deprecated
      */
      capitalize: {
        configurable: true,
        enumerable: false,
        writeable: true,
        value: deprecateEmberStringPrototypeExtension('capitalize', capitalize)
      }
    });
  }
});