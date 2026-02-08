define("@glimmer/util", ["exports", "ember-babel"], function (_exports, _emberBabel) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports._WeakSet = _exports.Stack = _exports.SERIALIZATION_FIRST_NODE_STRING = _exports.NonemptyStack = _exports.LOGGER = _exports.LOCAL_LOGGER = _exports.HAS_NATIVE_SYMBOL = _exports.HAS_NATIVE_PROXY = _exports.EMPTY_STRING_ARRAY = _exports.EMPTY_NUMBER_ARRAY = _exports.EMPTY_ARRAY = _exports.DictSet = void 0;
  _exports.assert = debugAssert$$1;
  _exports.assertNever = assertNever;
  _exports.assertPresent = assertPresent;
  _exports.beginTestSteps = _exports.assign = void 0;
  _exports.buildUntouchableThis = buildUntouchableThis;
  _exports.castToBrowser = castToBrowser;
  _exports.castToSimple = castToSimple;
  _exports.checkNode = checkNode;
  _exports.clearElement = clearElement;
  _exports.constants = constants;
  _exports.debugToString = void 0;
  _exports.decodeHandle = decodeHandle;
  _exports.decodeImmediate = decodeImmediate;
  _exports.decodeNegative = decodeNegative;
  _exports.decodePositive = decodePositive;
  _exports.deprecate = deprecate$$1;
  _exports.dict = dict;
  _exports.emptyArray = emptyArray;
  _exports.encodeHandle = encodeHandle;
  _exports.encodeImmediate = encodeImmediate;
  _exports.encodeNegative = encodeNegative;
  _exports.encodePositive = encodePositive;
  _exports.endTestSteps = void 0;
  _exports.ensureGuid = ensureGuid;
  _exports.enumerableSymbol = enumerableSymbol;
  _exports.exhausted = exhausted;
  _exports.expect = expect;
  _exports.extractHandle = extractHandle;
  _exports.fillNulls = fillNulls;
  _exports.ifPresent = ifPresent;
  _exports.initializeGuid = initializeGuid;
  _exports.intern = intern;
  _exports.isDict = isDict;
  _exports.isEmptyArray = isEmptyArray;
  _exports.isErrHandle = isErrHandle;
  _exports.isHandle = isHandle;
  _exports.isNonPrimitiveHandle = isNonPrimitiveHandle;
  _exports.isObject = isObject;
  _exports.isOkHandle = isOkHandle;
  _exports.isPresent = isPresent;
  _exports.isSerializationFirstNode = isSerializationFirstNode;
  _exports.isSmallInt = isSmallInt;
  _exports.keys = keys;
  _exports.logStep = void 0;
  _exports.mapPresent = mapPresent;
  _exports.strip = strip;
  _exports.symbol = void 0;
  _exports.toPresentOption = toPresentOption;
  _exports.tuple = void 0;
  _exports.unreachable = unreachable;
  _exports.unwrap = unwrap;
  _exports.unwrapHandle = unwrapHandle;
  _exports.unwrapTemplate = unwrapTemplate;
  _exports.values = values;
  _exports.verifySteps = void 0;
  var EMPTY_ARRAY = Object.freeze([]);
  _exports.EMPTY_ARRAY = EMPTY_ARRAY;

  function emptyArray() {
    return EMPTY_ARRAY;
  }

  var EMPTY_STRING_ARRAY = emptyArray();
  _exports.EMPTY_STRING_ARRAY = EMPTY_STRING_ARRAY;
  var EMPTY_NUMBER_ARRAY = emptyArray();
  /**
   * This function returns `true` if the input array is the special empty array sentinel,
   * which is sometimes used for optimizations.
   */

  _exports.EMPTY_NUMBER_ARRAY = EMPTY_NUMBER_ARRAY;

  function isEmptyArray(input) {
    return input === EMPTY_ARRAY;
  } // import Logger from './logger';


  function debugAssert$$1(test, msg) {
    // if (!alreadyWarned) {
    //   alreadyWarned = true;
    //   Logger.warn("Don't leave debug assertions on in public builds");
    // }
    if (!test) {
      throw new Error(msg || 'assertion failure');
    }
  }

  function deprecate$$1(desc) {
    LOCAL_LOGGER.warn("DEPRECATION: " + desc);
  }

  var GUID = 0;

  function initializeGuid(object) {
    return object._guid = ++GUID;
  }

  function ensureGuid(object) {
    return object._guid || initializeGuid(object);
  }

  function dict() {
    return Object.create(null);
  }

  function isDict(u) {
    return u !== null && u !== undefined;
  }

  function isObject(u) {
    return typeof u === 'function' || typeof u === 'object' && u !== null;
  }

  var DictSet = /*#__PURE__*/function () {
    function DictSet() {
      this.dict = dict();
    }

    var _proto = DictSet.prototype;

    _proto.add = function add(obj) {
      if (typeof obj === 'string') this.dict[obj] = obj;else this.dict[ensureGuid(obj)] = obj;
      return this;
    };

    _proto.delete = function _delete(obj) {
      if (typeof obj === 'string') delete this.dict[obj];else if (obj._guid) delete this.dict[obj._guid];
    };

    return DictSet;
  }();

  _exports.DictSet = DictSet;

  var StackImpl = /*#__PURE__*/function () {
    function StackImpl(values) {
      if (values === void 0) {
        values = [];
      }

      this.current = null;
      this.stack = values;
    }

    var _proto2 = StackImpl.prototype;

    _proto2.push = function push(item) {
      this.current = item;
      this.stack.push(item);
    };

    _proto2.pop = function pop() {
      var item = this.stack.pop();
      var len = this.stack.length;
      this.current = len === 0 ? null : this.stack[len - 1];
      return item === undefined ? null : item;
    };

    _proto2.nth = function nth(from) {
      var len = this.stack.length;
      return len < from ? null : this.stack[len - from];
    };

    _proto2.isEmpty = function isEmpty() {
      return this.stack.length === 0;
    };

    _proto2.toArray = function toArray() {
      return this.stack;
    };

    (0, _emberBabel.createClass)(StackImpl, [{
      key: "size",
      get: function get() {
        return this.stack.length;
      }
    }]);
    return StackImpl;
  }();

  _exports.Stack = StackImpl;

  var NonemptyStackImpl = /*#__PURE__*/function () {
    function NonemptyStackImpl(values) {
      this.stack = values;
      this.current = values[values.length - 1];
    }

    var _proto3 = NonemptyStackImpl.prototype;

    _proto3.push = function push(item) {
      this.current = item;
      this.stack.push(item);
    };

    _proto3.pop = function pop() {
      if (this.stack.length === 1) {
        throw new Error("cannot pop the last element of a NonemptyStack");
      }

      var item = this.stack.pop();
      var len = this.stack.length;
      this.current = this.stack[len - 1];
      return item;
    };

    _proto3.nth = function nth(from) {
      var len = this.stack.length;
      return from >= len ? null : this.stack[from];
    };

    _proto3.nthBack = function nthBack(from) {
      var len = this.stack.length;
      return len < from ? null : this.stack[len - from];
    };

    _proto3.toArray = function toArray() {
      return this.stack;
    };

    (0, _emberBabel.createClass)(NonemptyStackImpl, [{
      key: "size",
      get: function get() {
        return this.stack.length;
      }
    }]);
    return NonemptyStackImpl;
  }();

  _exports.NonemptyStack = NonemptyStackImpl;

  function clearElement(parent) {
    var current = parent.firstChild;

    while (current) {
      var next = current.nextSibling;
      parent.removeChild(current);
      current = next;
    }
  }

  var SERIALIZATION_FIRST_NODE_STRING = '%+b:0%';
  _exports.SERIALIZATION_FIRST_NODE_STRING = SERIALIZATION_FIRST_NODE_STRING;

  function isSerializationFirstNode(node) {
    return node.nodeValue === SERIALIZATION_FIRST_NODE_STRING;
  }

  var _a;

  var objKeys = Object.keys;

  function assignFn(obj) {
    for (var i = 1; i < arguments.length; i++) {
      var assignment = arguments[i];
      if (assignment === null || typeof assignment !== 'object') continue;

      var _keys = objKeys(assignment);

      for (var j = 0; j < _keys.length; j++) {
        var key = _keys[j];
        obj[key] = assignment[key];
      }
    }

    return obj;
  }

  var assign = (_a = Object.assign) !== null && _a !== void 0 ? _a : assignFn;
  _exports.assign = assign;

  function fillNulls(count) {
    var arr = new Array(count);

    for (var i = 0; i < count; i++) {
      arr[i] = null;
    }

    return arr;
  }

  function values(obj) {
    var vals = [];

    for (var key in obj) {
      vals.push(obj[key]);
    }

    return vals;
  }
  /**
    Strongly hint runtimes to intern the provided string.
  
    When do I need to use this function?
  
    For the most part, never. Pre-mature optimization is bad, and often the
    runtime does exactly what you need it to, and more often the trade-off isn't
    worth it.
  
    Why?
  
    Runtimes store strings in at least 2 different representations:
    Ropes and Symbols (interned strings). The Rope provides a memory efficient
    data-structure for strings created from concatenation or some other string
    manipulation like splitting.
  
    Unfortunately checking equality of different ropes can be quite costly as
    runtimes must resort to clever string comparison algorithms. These
    algorithms typically cost in proportion to the length of the string.
    Luckily, this is where the Symbols (interned strings) shine. As Symbols are
    unique by their string content, equality checks can be done by pointer
    comparison.
  
    How do I know if my string is a rope or symbol?
  
    Typically (warning general sweeping statement, but truthy in runtimes at
    present) static strings created as part of the JS source are interned.
    Strings often used for comparisons can be interned at runtime if some
    criteria are met.  One of these criteria can be the size of the entire rope.
    For example, in chrome 38 a rope longer then 12 characters will not
    intern, nor will segments of that rope.
  
    Some numbers: http://jsperf.com/eval-vs-keys/8
  
    Known Trick™
  
    @private
    @return {String} interned version of the provided string
  */


  function intern(str) {
    var obj = {};
    obj[str] = 1;

    for (var key in obj) {
      if (key === str) {
        return key;
      }
    }

    return str;
  }

  var HAS_NATIVE_PROXY = typeof Proxy === 'function';
  _exports.HAS_NATIVE_PROXY = HAS_NATIVE_PROXY;

  var HAS_NATIVE_SYMBOL = function () {
    if (typeof Symbol !== 'function') {
      return false;
    } // eslint-disable-next-line symbol-description


    return typeof Symbol() === 'symbol';
  }();

  _exports.HAS_NATIVE_SYMBOL = HAS_NATIVE_SYMBOL;

  function keys(obj) {
    return Object.keys(obj);
  }

  function unwrap(val) {
    if (val === null || val === undefined) throw new Error("Expected value to be present");
    return val;
  }

  function expect(val, message) {
    if (val === null || val === undefined) throw new Error(message);
    return val;
  }

  function unreachable(message) {
    if (message === void 0) {
      message = 'unreachable';
    }

    return new Error(message);
  }

  function exhausted(value) {
    throw new Error("Exhausted " + value);
  }

  var tuple = function tuple() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args;
  };

  _exports.tuple = tuple;

  function enumerableSymbol(key) {
    return intern("__" + key + Math.floor(Math.random() * Date.now()) + "__");
  }

  var symbol = HAS_NATIVE_SYMBOL ? Symbol : enumerableSymbol;
  _exports.symbol = symbol;

  function strip(strings) {
    var out = '';

    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    for (var i = 0; i < strings.length; i++) {
      var string = strings[i];
      var dynamic = args[i] !== undefined ? String(args[i]) : '';
      out += "" + string + dynamic;
    }

    var lines = out.split('\n');

    while (lines.length && lines[0].match(/^\s*$/)) {
      lines.shift();
    }

    while (lines.length && lines[lines.length - 1].match(/^\s*$/)) {
      lines.pop();
    }

    var min = Infinity;

    for (var _iterator = (0, _emberBabel.createForOfIteratorHelperLoose)(lines), _step; !(_step = _iterator()).done;) {
      var line = _step.value;
      var leading = line.match(/^\s*/)[0].length;
      min = Math.min(min, leading);
    }

    var stripped = [];

    for (var _iterator2 = (0, _emberBabel.createForOfIteratorHelperLoose)(lines), _step2; !(_step2 = _iterator2()).done;) {
      var _line = _step2.value;
      stripped.push(_line.slice(min));
    }

    return stripped.join('\n');
  }

  function isHandle(value) {
    return value >= 0;
  }

  function isNonPrimitiveHandle(value) {
    return value > 3
    /* ENCODED_UNDEFINED_HANDLE */
    ;
  }

  function constants() {
    for (var _len3 = arguments.length, values = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      values[_key3] = arguments[_key3];
    }

    return [false, true, null, undefined].concat(values);
  }

  function isSmallInt(value) {
    return value % 1 === 0 && value <= 536870911
    /* MAX_INT */
    && value >= -536870912
    /* MIN_INT */
    ;
  }

  function encodeNegative(num) {
    return num & -536870913
    /* SIGN_BIT */
    ;
  }

  function decodeNegative(num) {
    return num | ~-536870913
    /* SIGN_BIT */
    ;
  }

  function encodePositive(num) {
    return ~num;
  }

  function decodePositive(num) {
    return ~num;
  }

  function encodeHandle(num) {
    return num;
  }

  function decodeHandle(num) {
    return num;
  }

  function encodeImmediate(num) {
    num |= 0;
    return num < 0 ? encodeNegative(num) : encodePositive(num);
  }

  function decodeImmediate(num) {
    num |= 0;
    return num > -536870913
    /* SIGN_BIT */
    ? decodePositive(num) : decodeNegative(num);
  } // Warm


  [1, -1].forEach(function (x) {
    return decodeImmediate(encodeImmediate(x));
  });

  function unwrapHandle(handle) {
    if (typeof handle === 'number') {
      return handle;
    } else {
      var error = handle.errors[0];
      throw new Error("Compile Error: " + error.problem + " @ " + error.span.start + ".." + error.span.end);
    }
  }

  function unwrapTemplate(template) {
    if (template.result === 'error') {
      throw new Error("Compile Error: " + template.problem + " @ " + template.span.start + ".." + template.span.end);
    }

    return template;
  }

  function extractHandle(handle) {
    if (typeof handle === 'number') {
      return handle;
    } else {
      return handle.handle;
    }
  }

  function isOkHandle(handle) {
    return typeof handle === 'number';
  }

  function isErrHandle(handle) {
    return typeof handle === 'number';
  }

  var weakSet = typeof WeakSet === 'function' ? WeakSet : /*#__PURE__*/function () {
    function WeakSetPolyFill() {
      this._map = new WeakMap();
    }

    var _proto4 = WeakSetPolyFill.prototype;

    _proto4.add = function add(val) {
      this._map.set(val, true);

      return this;
    };

    _proto4.delete = function _delete(val) {
      return this._map.delete(val);
    };

    _proto4.has = function has(val) {
      return this._map.has(val);
    };

    return WeakSetPolyFill;
  }();
  _exports._WeakSet = weakSet;

  function castToSimple(node) {
    if (isDocument(node)) {
      return node;
    } else if (isElement(node)) {
      return node;
    } else {
      return node;
    }
  }

  function castToBrowser(node, sugaryCheck) {
    if (node === null || node === undefined) {
      return null;
    }

    if (typeof document === undefined) {
      throw new Error('Attempted to cast to a browser node in a non-browser context');
    }

    if (isDocument(node)) {
      return node;
    }

    if (node.ownerDocument !== document) {
      throw new Error('Attempted to cast to a browser node with a node that was not created from this document');
    }

    return checkNode(node, sugaryCheck);
  }

  function checkError(from, check) {
    return new Error("cannot cast a " + from + " into " + check);
  }

  function isDocument(node) {
    return node.nodeType === 9
    /* DOCUMENT_NODE */
    ;
  }

  function isElement(node) {
    return node.nodeType === 1
    /* ELEMENT_NODE */
    ;
  }

  function checkNode(node, check) {
    var isMatch = false;

    if (node !== null) {
      if (typeof check === 'string') {
        isMatch = stringCheckNode(node, check);
      } else if (Array.isArray(check)) {
        isMatch = check.some(function (c) {
          return stringCheckNode(node, c);
        });
      } else {
        throw unreachable();
      }
    }

    if (isMatch) {
      return node;
    } else {
      throw checkError("SimpleElement(" + node + ")", check);
    }
  }

  function stringCheckNode(node, check) {
    switch (check) {
      case 'NODE':
        return true;

      case 'HTML':
        return node instanceof HTMLElement;

      case 'SVG':
        return node instanceof SVGElement;

      case 'ELEMENT':
        return node instanceof Element;

      default:
        if (check.toUpperCase() === check) {
          throw new Error("BUG: this code is missing handling for a generic node type");
        }

        return node instanceof Element && node.tagName.toLowerCase() === check;
    }
  }

  function isPresent(list) {
    return list.length > 0;
  }

  function ifPresent(list, ifPresent, otherwise) {
    if (isPresent(list)) {
      return ifPresent(list);
    } else {
      return otherwise();
    }
  }

  function toPresentOption(list) {
    if (isPresent(list)) {
      return list;
    } else {
      return null;
    }
  }

  function assertPresent(list, message) {
    if (message === void 0) {
      message = "unexpected empty list";
    }

    if (!isPresent(list)) {
      throw new Error(message);
    }
  }

  function mapPresent(list, callback) {
    if (list === null) {
      return null;
    }

    var out = [];

    for (var _iterator3 = (0, _emberBabel.createForOfIteratorHelperLoose)(list), _step3; !(_step3 = _iterator3()).done;) {
      var item = _step3.value;
      out.push(callback(item));
    }

    return out;
  }

  function buildUntouchableThis(source) {
    var context = null;

    if (false
    /* DEBUG */
    && HAS_NATIVE_PROXY) {
      var assertOnProperty = function assertOnProperty(property) {
        throw new Error("You accessed `this." + String(property) + "` from a function passed to the " + source + ", but the function itself was not bound to a valid `this` context. Consider updating to use a bound function (for instance, use an arrow function, `() => {}`).");
      };

      context = new Proxy({}, {
        get: function get(_target, property) {
          assertOnProperty(property);
        },
        set: function set(_target, property) {
          assertOnProperty(property);
          return false;
        },
        has: function has(_target, property) {
          assertOnProperty(property);
          return false;
        }
      });
    }

    return context;
  }

  var debugToString;

  if (false
  /* DEBUG */
  ) {
    var getFunctionName = function getFunctionName(fn) {
      var functionName = fn.name;

      if (functionName === undefined) {
        var match = Function.prototype.toString.call(fn).match(/function (\w+)\s*\(/);
        functionName = match && match[1] || '';
      }

      return functionName.replace(/^bound /, '');
    };

    var getObjectName = function getObjectName(obj) {
      var name;
      var className;

      if (obj.constructor && typeof obj.constructor === 'function') {
        className = getFunctionName(obj.constructor);
      }

      if ('toString' in obj && obj.toString !== Object.prototype.toString && obj.toString !== Function.prototype.toString) {
        name = obj.toString();
      } // If the class has a decent looking name, and the `toString` is one of the
      // default Ember toStrings, replace the constructor portion of the toString
      // with the class name. We check the length of the class name to prevent doing
      // this when the value is minified.


      if (name && name.match(/<.*:ember\d+>/) && className && className[0] !== '_' && className.length > 2 && className !== 'Class') {
        return name.replace(/<.*:/, "<" + className + ":");
      }

      return name || className;
    };

    var getPrimitiveName = function getPrimitiveName(value) {
      return String(value);
    };

    debugToString = function debugToString(value) {
      if (typeof value === 'function') {
        return getFunctionName(value) || "(unknown function)";
      } else if (typeof value === 'object' && value !== null) {
        return getObjectName(value) || "(unknown object)";
      } else {
        return getPrimitiveName(value);
      }
    };
  }

  var debugToString$1 = debugToString;
  _exports.debugToString = debugToString$1;
  var beginTestSteps;
  _exports.beginTestSteps = beginTestSteps;
  var endTestSteps;
  _exports.endTestSteps = endTestSteps;
  var verifySteps;
  _exports.verifySteps = verifySteps;
  var logStep;
  /**
   * This constant exists to make it easier to differentiate normal logs from
   * errant console.logs. LOCAL_LOGGER should only be used inside a
   * LOCAL_SHOULD_LOG check.
   *
   * It does not alleviate the need to check LOCAL_SHOULD_LOG, which is used
   * for stripping.
   */

  _exports.logStep = logStep;
  var LOCAL_LOGGER = console;
  /**
   * This constant exists to make it easier to differentiate normal logs from
   * errant console.logs. LOGGER can be used outside of LOCAL_SHOULD_LOG checks,
   * and is meant to be used in the rare situation where a console.* call is
   * actually appropriate.
   */

  _exports.LOCAL_LOGGER = LOCAL_LOGGER;
  var LOGGER = console;
  _exports.LOGGER = LOGGER;

  function assertNever(value, desc) {
    if (desc === void 0) {
      desc = 'unexpected unreachable branch';
    }

    LOGGER.log('unreachable', value);
    LOGGER.log(desc + " :: " + JSON.stringify(value) + " (" + value + ")");
    throw new Error("code reached unreachable");
  }
});