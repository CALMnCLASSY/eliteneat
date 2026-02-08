define("@glimmer/runtime", ["exports", "ember-babel", "@glimmer/util", "@glimmer/reference", "@glimmer/global-context", "@glimmer/destroyable", "@glimmer/vm", "@glimmer/validator", "@glimmer/manager", "@glimmer/program", "@glimmer/low-level", "@glimmer/owner", "@glimmer/runtime"], function (_exports, _emberBabel, _util, _reference, _globalContext, _destroyable2, _vm2, _validator, _manager5, _program, _lowLevel, _owner2, _runtime) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.array = _exports.UpdatingVM = _exports.UpdatableBlockImpl = _exports.TemplateOnlyComponentManager = _exports.TemplateOnlyComponent = _exports.TEMPLATE_ONLY_COMPONENT_MANAGER = _exports.SimpleDynamicAttribute = _exports.SERIALIZATION_FIRST_NODE_STRING = _exports.RemoteLiveBlock = _exports.RehydrateBuilder = _exports.PartialScopeImpl = _exports.NewElementBuilder = _exports.LowLevelVM = _exports.IDOMChanges = _exports.EnvironmentImpl = _exports.EMPTY_POSITIONAL = _exports.EMPTY_NAMED = _exports.EMPTY_ARGS = _exports.DynamicScopeImpl = _exports.DynamicAttribute = _exports.DOMTreeConstruction = _exports.DOMChanges = _exports.CursorImpl = _exports.CurriedValue = _exports.ConcreteBounds = void 0;
  _exports.clear = clear;
  _exports.clientBuilder = clientBuilder;
  _exports.concat = void 0;
  _exports.createCapturedArgs = createCapturedArgs;
  _exports.curry = curry;
  Object.defineProperty(_exports, "destroy", {
    enumerable: true,
    get: function get() {
      return _destroyable2.destroy;
    }
  });
  _exports.dynamicAttribute = dynamicAttribute;
  _exports.hash = _exports.get = _exports.fn = void 0;
  _exports.inTransaction = inTransaction;
  _exports.invokeHelper = invokeHelper;
  Object.defineProperty(_exports, "isDestroyed", {
    enumerable: true,
    get: function get() {
      return _destroyable2.isDestroyed;
    }
  });
  Object.defineProperty(_exports, "isDestroying", {
    enumerable: true,
    get: function get() {
      return _destroyable2.isDestroying;
    }
  });
  _exports.isSerializationFirstNode = isSerializationFirstNode;
  _exports.isWhitespace = isWhitespace;
  _exports.normalizeProperty = normalizeProperty;
  _exports.on = void 0;
  Object.defineProperty(_exports, "registerDestructor", {
    enumerable: true,
    get: function get() {
      return _destroyable2.registerDestructor;
    }
  });
  _exports.rehydrationBuilder = rehydrationBuilder;
  _exports.reifyArgs = reifyArgs;
  _exports.reifyNamed = reifyNamed$1;
  _exports.reifyPositional = reifyPositional$1;
  _exports.renderComponent = renderComponent;
  _exports.renderMain = renderMain;
  _exports.renderSync = renderSync;
  _exports.resetDebuggerCallback = resetDebuggerCallback;
  _exports.runtimeContext = runtimeContext;
  _exports.setDebuggerCallback = setDebuggerCallback;
  _exports.templateOnlyComponent = templateOnlyComponent;

  var DynamicScopeImpl = /*#__PURE__*/function () {
    function DynamicScopeImpl(bucket) {
      if (bucket) {
        this.bucket = (0, _util.assign)({}, bucket);
      } else {
        this.bucket = {};
      }
    }

    var _proto = DynamicScopeImpl.prototype;

    _proto.get = function get(key) {
      return this.bucket[key];
    };

    _proto.set = function set(key, reference) {
      return this.bucket[key] = reference;
    };

    _proto.child = function child() {
      return new DynamicScopeImpl(this.bucket);
    };

    return DynamicScopeImpl;
  }();

  _exports.DynamicScopeImpl = DynamicScopeImpl;

  var PartialScopeImpl = /*#__PURE__*/function () {
    function PartialScopeImpl( // the 0th slot is `self`
    slots, owner, callerScope, // named arguments and blocks passed to a layout that uses eval
    evalScope, // locals in scope when the partial was invoked
    partialMap) {
      this.slots = slots;
      this.owner = owner;
      this.callerScope = callerScope;
      this.evalScope = evalScope;
      this.partialMap = partialMap;
    }

    PartialScopeImpl.root = function root(self, size, owner) {
      if (size === void 0) {
        size = 0;
      }

      var refs = new Array(size + 1);

      for (var i = 0; i <= size; i++) {
        refs[i] = _reference.UNDEFINED_REFERENCE;
      }

      return new PartialScopeImpl(refs, owner, null, null, null).init({
        self: self
      });
    };

    PartialScopeImpl.sized = function sized(size, owner) {
      if (size === void 0) {
        size = 0;
      }

      var refs = new Array(size + 1);

      for (var i = 0; i <= size; i++) {
        refs[i] = _reference.UNDEFINED_REFERENCE;
      }

      return new PartialScopeImpl(refs, owner, null, null, null);
    };

    var _proto2 = PartialScopeImpl.prototype;

    _proto2.init = function init(_ref) {
      var self = _ref.self;
      this.slots[0] = self;
      return this;
    };

    _proto2.getSelf = function getSelf() {
      return this.get(0);
    };

    _proto2.getSymbol = function getSymbol(symbol$$1) {
      return this.get(symbol$$1);
    };

    _proto2.getBlock = function getBlock(symbol$$1) {
      var block = this.get(symbol$$1);
      return block === _reference.UNDEFINED_REFERENCE ? null : block;
    };

    _proto2.getEvalScope = function getEvalScope() {
      return this.evalScope;
    };

    _proto2.getPartialMap = function getPartialMap() {
      return this.partialMap;
    };

    _proto2.bind = function bind(symbol$$1, value) {
      this.set(symbol$$1, value);
    };

    _proto2.bindSelf = function bindSelf(self) {
      this.set(0, self);
    };

    _proto2.bindSymbol = function bindSymbol(symbol$$1, value) {
      this.set(symbol$$1, value);
    };

    _proto2.bindBlock = function bindBlock(symbol$$1, value) {
      this.set(symbol$$1, value);
    };

    _proto2.bindEvalScope = function bindEvalScope(map) {
      this.evalScope = map;
    };

    _proto2.bindPartialMap = function bindPartialMap(map) {
      this.partialMap = map;
    };

    _proto2.bindCallerScope = function bindCallerScope(scope) {
      this.callerScope = scope;
    };

    _proto2.getCallerScope = function getCallerScope() {
      return this.callerScope;
    };

    _proto2.child = function child() {
      return new PartialScopeImpl(this.slots.slice(), this.owner, this.callerScope, this.evalScope, this.partialMap);
    };

    _proto2.get = function get(index) {
      if (index >= this.slots.length) {
        throw new RangeError("BUG: cannot get $" + index + " from scope; length=" + this.slots.length);
      }

      return this.slots[index];
    };

    _proto2.set = function set(index, value) {
      if (index >= this.slots.length) {
        throw new RangeError("BUG: cannot get $" + index + " from scope; length=" + this.slots.length);
      }

      this.slots[index] = value;
    };

    return PartialScopeImpl;
  }(); // the VM in other classes, but are not intended to be a part of
  // Glimmer's API.


  _exports.PartialScopeImpl = PartialScopeImpl;
  var INNER_VM = (0, _util.symbol)('INNER_VM');
  var DESTROYABLE_STACK = (0, _util.symbol)('DESTROYABLE_STACK');
  var STACKS = (0, _util.symbol)('STACKS');
  var REGISTERS = (0, _util.symbol)('REGISTERS');
  var HEAP = (0, _util.symbol)('HEAP');
  var CONSTANTS = (0, _util.symbol)('CONSTANTS');
  var ARGS = (0, _util.symbol)('ARGS');
  var PC = (0, _util.symbol)('PC');

  var CursorImpl = function CursorImpl(element, nextSibling) {
    this.element = element;
    this.nextSibling = nextSibling;
  };

  _exports.CursorImpl = CursorImpl;

  var ConcreteBounds = /*#__PURE__*/function () {
    function ConcreteBounds(parentNode, first, last) {
      this.parentNode = parentNode;
      this.first = first;
      this.last = last;
    }

    var _proto3 = ConcreteBounds.prototype;

    _proto3.parentElement = function parentElement() {
      return this.parentNode;
    };

    _proto3.firstNode = function firstNode() {
      return this.first;
    };

    _proto3.lastNode = function lastNode() {
      return this.last;
    };

    return ConcreteBounds;
  }();

  _exports.ConcreteBounds = ConcreteBounds;

  var SingleNodeBounds = /*#__PURE__*/function () {
    function SingleNodeBounds(parentNode, node) {
      this.parentNode = parentNode;
      this.node = node;
    }

    var _proto4 = SingleNodeBounds.prototype;

    _proto4.parentElement = function parentElement() {
      return this.parentNode;
    };

    _proto4.firstNode = function firstNode() {
      return this.node;
    };

    _proto4.lastNode = function lastNode() {
      return this.node;
    };

    return SingleNodeBounds;
  }();

  function move(bounds, reference) {
    var parent = bounds.parentElement();
    var first = bounds.firstNode();
    var last = bounds.lastNode();
    var current = first;

    while (true) {
      var next = current.nextSibling;
      parent.insertBefore(current, reference);

      if (current === last) {
        return next;
      }

      current = next;
    }
  }

  function clear(bounds) {
    var parent = bounds.parentElement();
    var first = bounds.firstNode();
    var last = bounds.lastNode();
    var current = first;

    while (true) {
      var next = current.nextSibling;
      parent.removeChild(current);

      if (current === last) {
        return next;
      }

      current = next;
    }
  }

  function normalizeStringValue(value) {
    if (isEmpty(value)) {
      return '';
    }

    return String(value);
  }

  function shouldCoerce(value) {
    return isString(value) || isEmpty(value) || typeof value === 'boolean' || typeof value === 'number';
  }

  function isEmpty(value) {
    return value === null || value === undefined || typeof value.toString !== 'function';
  }

  function isSafeString(value) {
    return typeof value === 'object' && value !== null && typeof value.toHTML === 'function';
  }

  function isNode(value) {
    return typeof value === 'object' && value !== null && typeof value.nodeType === 'number';
  }

  function isFragment(value) {
    return isNode(value) && value.nodeType === 11;
  }

  function isString(value) {
    return typeof value === 'string';
  }
  /*
   * @method normalizeProperty
   * @param element {HTMLElement}
   * @param slotName {String}
   * @returns {Object} { name, type }
   */


  function normalizeProperty(element, slotName) {
    var type, normalized;

    if (slotName in element) {
      normalized = slotName;
      type = 'prop';
    } else {
      var lower = slotName.toLowerCase();

      if (lower in element) {
        type = 'prop';
        normalized = lower;
      } else {
        type = 'attr';
        normalized = slotName;
      }
    }

    if (type === 'prop' && (normalized.toLowerCase() === 'style' || preferAttr(element.tagName, normalized))) {
      type = 'attr';
    }

    return {
      normalized: normalized,
      type: type
    };
  } // * browser bug
  // * strange spec outlier


  var ATTR_OVERRIDES = {
    INPUT: {
      form: true,
      // Chrome 46.0.2464.0: 'autocorrect' in document.createElement('input') === false
      // Safari 8.0.7: 'autocorrect' in document.createElement('input') === false
      // Mobile Safari (iOS 8.4 simulator): 'autocorrect' in document.createElement('input') === true
      autocorrect: true,
      // Chrome 54.0.2840.98: 'list' in document.createElement('input') === true
      // Safari 9.1.3: 'list' in document.createElement('input') === false
      list: true
    },
    // element.form is actually a legitimate readOnly property, that is to be
    // mutated, but must be mutated by setAttribute...
    SELECT: {
      form: true
    },
    OPTION: {
      form: true
    },
    TEXTAREA: {
      form: true
    },
    LABEL: {
      form: true
    },
    FIELDSET: {
      form: true
    },
    LEGEND: {
      form: true
    },
    OBJECT: {
      form: true
    },
    OUTPUT: {
      form: true
    },
    BUTTON: {
      form: true
    }
  };

  function preferAttr(tagName, propName) {
    var tag = ATTR_OVERRIDES[tagName.toUpperCase()];
    return tag && tag[propName.toLowerCase()] || false;
  }

  var badProtocols = ['javascript:', 'vbscript:'];
  var badTags = ['A', 'BODY', 'LINK', 'IMG', 'IFRAME', 'BASE', 'FORM'];
  var badTagsForDataURI = ['EMBED'];
  var badAttributes = ['href', 'src', 'background', 'action'];
  var badAttributesForDataURI = ['src'];

  function has(array, item) {
    return array.indexOf(item) !== -1;
  }

  function checkURI(tagName, attribute) {
    return (tagName === null || has(badTags, tagName)) && has(badAttributes, attribute);
  }

  function checkDataURI(tagName, attribute) {
    if (tagName === null) return false;
    return has(badTagsForDataURI, tagName) && has(badAttributesForDataURI, attribute);
  }

  function requiresSanitization(tagName, attribute) {
    return checkURI(tagName, attribute) || checkDataURI(tagName, attribute);
  }

  var protocolForUrl;

  if (typeof URL === 'object' && URL !== null && // this is super annoying, TS thinks that URL **must** be a function so `URL.parse` check
  // thinks it is `never` without this `as unknown as any`
  typeof URL.parse === 'function') {
    // In Ember-land the `fastboot` package sets the `URL` global to `require('url')`
    // ultimately, this should be changed (so that we can either rely on the natural `URL` global
    // that exists) but for now we have to detect the specific `FastBoot` case first
    //
    // a future version of `fastboot` will detect if this legacy URL setup is required (by
    // inspecting Ember version) and if new enough, it will avoid shadowing the `URL` global
    // constructor with `require('url')`.
    var nodeURL = URL;

    protocolForUrl = function protocolForUrl(url) {
      var protocol = null;

      if (typeof url === 'string') {
        protocol = nodeURL.parse(url).protocol;
      }

      return protocol === null ? ':' : protocol;
    };
  } else if (typeof URL === 'function') {
    protocolForUrl = function protocolForUrl(_url) {
      try {
        var url = new URL(_url);
        return url.protocol;
      } catch (error) {
        // any non-fully qualified url string will trigger an error (because there is no
        // baseURI that we can provide; in that case we **know** that the protocol is
        // "safe" because it isn't specifically one of the `badProtocols` listed above
        // (and those protocols can never be the default baseURI)
        return ':';
      }
    };
  } else {
    // fallback for IE11 support
    var parsingNode = document.createElement('a');

    protocolForUrl = function protocolForUrl(url) {
      parsingNode.href = url;
      return parsingNode.protocol;
    };
  }

  function sanitizeAttributeValue(element, attribute, value) {
    var tagName = null;

    if (value === null || value === undefined) {
      return value;
    }

    if (isSafeString(value)) {
      return value.toHTML();
    }

    if (!element) {
      tagName = null;
    } else {
      tagName = element.tagName.toUpperCase();
    }

    var str = normalizeStringValue(value);

    if (checkURI(tagName, attribute)) {
      var protocol = protocolForUrl(str);

      if (has(badProtocols, protocol)) {
        return "unsafe:" + str;
      }
    }

    if (checkDataURI(tagName, attribute)) {
      return "unsafe:" + str;
    }

    return str;
  }

  function dynamicAttribute(element, attr, namespace, isTrusting) {
    if (isTrusting === void 0) {
      isTrusting = false;
    }

    var tagName = element.tagName,
        namespaceURI = element.namespaceURI;
    var attribute = {
      element: element,
      name: attr,
      namespace: namespace
    };

    if (false
    /* DEBUG */
    && attr === 'style' && !isTrusting) {
      return new DebugStyleAttributeManager(attribute);
    }

    if (namespaceURI === "http://www.w3.org/2000/svg"
    /* SVG */
    ) {
      return buildDynamicAttribute(tagName, attr, attribute);
    }

    var _normalizeProperty = normalizeProperty(element, attr),
        type = _normalizeProperty.type,
        normalized = _normalizeProperty.normalized;

    if (type === 'attr') {
      return buildDynamicAttribute(tagName, normalized, attribute);
    } else {
      return buildDynamicProperty(tagName, normalized, attribute);
    }
  }

  function buildDynamicAttribute(tagName, name, attribute) {
    if (requiresSanitization(tagName, name)) {
      return new SafeDynamicAttribute(attribute);
    } else {
      return new SimpleDynamicAttribute(attribute);
    }
  }

  function buildDynamicProperty(tagName, name, attribute) {
    if (requiresSanitization(tagName, name)) {
      return new SafeDynamicProperty(name, attribute);
    }

    if (isUserInputValue(tagName, name)) {
      return new InputValueDynamicAttribute(name, attribute);
    }

    if (isOptionSelected(tagName, name)) {
      return new OptionSelectedDynamicAttribute(name, attribute);
    }

    return new DefaultDynamicProperty(name, attribute);
  }

  var DynamicAttribute = function DynamicAttribute(attribute) {
    this.attribute = attribute;
  };

  _exports.DynamicAttribute = DynamicAttribute;

  var SimpleDynamicAttribute = /*#__PURE__*/function (_DynamicAttribute) {
    (0, _emberBabel.inheritsLoose)(SimpleDynamicAttribute, _DynamicAttribute);

    function SimpleDynamicAttribute() {
      return _DynamicAttribute.apply(this, arguments) || this;
    }

    var _proto5 = SimpleDynamicAttribute.prototype;

    _proto5.set = function set(dom, value, _env) {
      var normalizedValue = normalizeValue(value);

      if (normalizedValue !== null) {
        var _this$attribute = this.attribute,
            name = _this$attribute.name,
            namespace = _this$attribute.namespace;

        dom.__setAttribute(name, normalizedValue, namespace);
      }
    };

    _proto5.update = function update(value, _env) {
      var normalizedValue = normalizeValue(value);
      var _this$attribute2 = this.attribute,
          element = _this$attribute2.element,
          name = _this$attribute2.name;

      if (normalizedValue === null) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, normalizedValue);
      }
    };

    return SimpleDynamicAttribute;
  }(DynamicAttribute);

  _exports.SimpleDynamicAttribute = SimpleDynamicAttribute;

  var DefaultDynamicProperty = /*#__PURE__*/function (_DynamicAttribute2) {
    (0, _emberBabel.inheritsLoose)(DefaultDynamicProperty, _DynamicAttribute2);

    function DefaultDynamicProperty(normalizedName, attribute) {
      var _this;

      _this = _DynamicAttribute2.call(this, attribute) || this;
      _this.normalizedName = normalizedName;
      return _this;
    }

    var _proto6 = DefaultDynamicProperty.prototype;

    _proto6.set = function set(dom, value, _env) {
      if (value !== null && value !== undefined) {
        this.value = value;

        dom.__setProperty(this.normalizedName, value);
      }
    };

    _proto6.update = function update(value, _env) {
      var element = this.attribute.element;

      if (this.value !== value) {
        element[this.normalizedName] = this.value = value;

        if (value === null || value === undefined) {
          this.removeAttribute();
        }
      }
    };

    _proto6.removeAttribute = function removeAttribute() {
      // TODO this sucks but to preserve properties first and to meet current
      // semantics we must do this.
      var _this$attribute3 = this.attribute,
          element = _this$attribute3.element,
          namespace = _this$attribute3.namespace;

      if (namespace) {
        element.removeAttributeNS(namespace, this.normalizedName);
      } else {
        element.removeAttribute(this.normalizedName);
      }
    };

    return DefaultDynamicProperty;
  }(DynamicAttribute);

  var SafeDynamicProperty = /*#__PURE__*/function (_DefaultDynamicProper) {
    (0, _emberBabel.inheritsLoose)(SafeDynamicProperty, _DefaultDynamicProper);

    function SafeDynamicProperty() {
      return _DefaultDynamicProper.apply(this, arguments) || this;
    }

    var _proto7 = SafeDynamicProperty.prototype;

    _proto7.set = function set(dom, value, env) {
      var _this$attribute4 = this.attribute,
          element = _this$attribute4.element,
          name = _this$attribute4.name;
      var sanitized = sanitizeAttributeValue(element, name, value);

      _DefaultDynamicProper.prototype.set.call(this, dom, sanitized, env);
    };

    _proto7.update = function update(value, env) {
      var _this$attribute5 = this.attribute,
          element = _this$attribute5.element,
          name = _this$attribute5.name;
      var sanitized = sanitizeAttributeValue(element, name, value);

      _DefaultDynamicProper.prototype.update.call(this, sanitized, env);
    };

    return SafeDynamicProperty;
  }(DefaultDynamicProperty);

  var SafeDynamicAttribute = /*#__PURE__*/function (_SimpleDynamicAttribu) {
    (0, _emberBabel.inheritsLoose)(SafeDynamicAttribute, _SimpleDynamicAttribu);

    function SafeDynamicAttribute() {
      return _SimpleDynamicAttribu.apply(this, arguments) || this;
    }

    var _proto8 = SafeDynamicAttribute.prototype;

    _proto8.set = function set(dom, value, env) {
      var _this$attribute6 = this.attribute,
          element = _this$attribute6.element,
          name = _this$attribute6.name;
      var sanitized = sanitizeAttributeValue(element, name, value);

      _SimpleDynamicAttribu.prototype.set.call(this, dom, sanitized, env);
    };

    _proto8.update = function update(value, env) {
      var _this$attribute7 = this.attribute,
          element = _this$attribute7.element,
          name = _this$attribute7.name;
      var sanitized = sanitizeAttributeValue(element, name, value);

      _SimpleDynamicAttribu.prototype.update.call(this, sanitized, env);
    };

    return SafeDynamicAttribute;
  }(SimpleDynamicAttribute);

  var InputValueDynamicAttribute = /*#__PURE__*/function (_DefaultDynamicProper2) {
    (0, _emberBabel.inheritsLoose)(InputValueDynamicAttribute, _DefaultDynamicProper2);

    function InputValueDynamicAttribute() {
      return _DefaultDynamicProper2.apply(this, arguments) || this;
    }

    var _proto9 = InputValueDynamicAttribute.prototype;

    _proto9.set = function set(dom, value) {
      dom.__setProperty('value', normalizeStringValue(value));
    };

    _proto9.update = function update(value) {
      var input = this.attribute.element;
      var currentValue = input.value;
      var normalizedValue = normalizeStringValue(value);

      if (currentValue !== normalizedValue) {
        input.value = normalizedValue;
      }
    };

    return InputValueDynamicAttribute;
  }(DefaultDynamicProperty);

  var OptionSelectedDynamicAttribute = /*#__PURE__*/function (_DefaultDynamicProper3) {
    (0, _emberBabel.inheritsLoose)(OptionSelectedDynamicAttribute, _DefaultDynamicProper3);

    function OptionSelectedDynamicAttribute() {
      return _DefaultDynamicProper3.apply(this, arguments) || this;
    }

    var _proto10 = OptionSelectedDynamicAttribute.prototype;

    _proto10.set = function set(dom, value) {
      if (value !== null && value !== undefined && value !== false) {
        dom.__setProperty('selected', true);
      }
    };

    _proto10.update = function update(value) {
      var option = this.attribute.element;

      if (value) {
        option.selected = true;
      } else {
        option.selected = false;
      }
    };

    return OptionSelectedDynamicAttribute;
  }(DefaultDynamicProperty);

  function isOptionSelected(tagName, attribute) {
    return tagName === 'OPTION' && attribute === 'selected';
  }

  function isUserInputValue(tagName, attribute) {
    return (tagName === 'INPUT' || tagName === 'TEXTAREA') && attribute === 'value';
  }

  function normalizeValue(value) {
    if (value === false || value === undefined || value === null || typeof value.toString === 'undefined') {
      return null;
    }

    if (value === true) {
      return '';
    } // onclick function etc in SSR


    if (typeof value === 'function') {
      return null;
    }

    return String(value);
  }

  var DebugStyleAttributeManager;

  if (false
  /* DEBUG */
  ) {
    DebugStyleAttributeManager = /*#__PURE__*/function (_SimpleDynamicAttribu2) {
      (0, _emberBabel.inheritsLoose)(DebugStyleAttributeManager, _SimpleDynamicAttribu2);

      function DebugStyleAttributeManager() {
        return _SimpleDynamicAttribu2.apply(this, arguments) || this;
      }

      var _proto11 = DebugStyleAttributeManager.prototype;

      _proto11.set = function set(dom, value, env) {
        (0, _globalContext.warnIfStyleNotTrusted)(value);

        _SimpleDynamicAttribu2.prototype.set.call(this, dom, value, env);
      };

      _proto11.update = function update(value, env) {
        (0, _globalContext.warnIfStyleNotTrusted)(value);

        _SimpleDynamicAttribu2.prototype.update.call(this, value, env);
      };

      return DebugStyleAttributeManager;
    }(SimpleDynamicAttribute);
  }

  var _a;

  var First = /*#__PURE__*/function () {
    function First(node) {
      this.node = node;
    }

    var _proto12 = First.prototype;

    _proto12.firstNode = function firstNode() {
      return this.node;
    };

    return First;
  }();

  var Last = /*#__PURE__*/function () {
    function Last(node) {
      this.node = node;
    }

    var _proto13 = Last.prototype;

    _proto13.lastNode = function lastNode() {
      return this.node;
    };

    return Last;
  }();

  var CURSOR_STACK = (0, _util.symbol)('CURSOR_STACK');

  var NewElementBuilder = /*#__PURE__*/function () {
    function NewElementBuilder(env, parentNode, nextSibling) {
      this.constructing = null;
      this.operations = null;
      this[_a] = new _util.Stack();
      this.modifierStack = new _util.Stack();
      this.blockStack = new _util.Stack();
      this.pushElement(parentNode, nextSibling);
      this.env = env;
      this.dom = env.getAppendOperations();
      this.updateOperations = env.getDOM();
    }

    NewElementBuilder.forInitialRender = function forInitialRender(env, cursor) {
      return new this(env, cursor.element, cursor.nextSibling).initialize();
    };

    NewElementBuilder.resume = function resume(env, block) {
      var parentNode = block.parentElement();
      var nextSibling = block.reset(env);
      var stack = new this(env, parentNode, nextSibling).initialize();
      stack.pushLiveBlock(block);
      return stack;
    };

    var _proto14 = NewElementBuilder.prototype;

    _proto14.initialize = function initialize() {
      this.pushSimpleBlock();
      return this;
    };

    _proto14.debugBlocks = function debugBlocks() {
      return this.blockStack.toArray();
    };

    _proto14.block = function block() {
      return this.blockStack.current;
    };

    _proto14.popElement = function popElement() {
      this[CURSOR_STACK].pop();
      this[CURSOR_STACK].current;
    };

    _proto14.pushSimpleBlock = function pushSimpleBlock() {
      return this.pushLiveBlock(new SimpleLiveBlock(this.element));
    };

    _proto14.pushUpdatableBlock = function pushUpdatableBlock() {
      return this.pushLiveBlock(new UpdatableBlockImpl(this.element));
    };

    _proto14.pushBlockList = function pushBlockList(list) {
      return this.pushLiveBlock(new LiveBlockList(this.element, list));
    };

    _proto14.pushLiveBlock = function pushLiveBlock(block, isRemote) {
      if (isRemote === void 0) {
        isRemote = false;
      }

      var current = this.blockStack.current;

      if (current !== null) {
        if (!isRemote) {
          current.didAppendBounds(block);
        }
      }

      this.__openBlock();

      this.blockStack.push(block);
      return block;
    };

    _proto14.popBlock = function popBlock() {
      this.block().finalize(this);

      this.__closeBlock();

      return this.blockStack.pop();
    };

    _proto14.__openBlock = function __openBlock() {};

    _proto14.__closeBlock = function __closeBlock() {} // todo return seems unused
    ;

    _proto14.openElement = function openElement(tag) {
      var element = this.__openElement(tag);

      this.constructing = element;
      return element;
    };

    _proto14.__openElement = function __openElement(tag) {
      return this.dom.createElement(tag, this.element);
    };

    _proto14.flushElement = function flushElement(modifiers) {
      var parent = this.element;
      var element = this.constructing;

      this.__flushElement(parent, element);

      this.constructing = null;
      this.operations = null;
      this.pushModifiers(modifiers);
      this.pushElement(element, null);
      this.didOpenElement(element);
    };

    _proto14.__flushElement = function __flushElement(parent, constructing) {
      this.dom.insertBefore(parent, constructing, this.nextSibling);
    };

    _proto14.closeElement = function closeElement() {
      this.willCloseElement();
      this.popElement();
      return this.popModifiers();
    };

    _proto14.pushRemoteElement = function pushRemoteElement(element, guid, insertBefore) {
      return this.__pushRemoteElement(element, guid, insertBefore);
    };

    _proto14.__pushRemoteElement = function __pushRemoteElement(element, _guid, insertBefore) {
      this.pushElement(element, insertBefore);

      if (insertBefore === undefined) {
        while (element.lastChild) {
          element.removeChild(element.lastChild);
        }
      }

      var block = new RemoteLiveBlock(element);
      return this.pushLiveBlock(block, true);
    };

    _proto14.popRemoteElement = function popRemoteElement() {
      this.popBlock();
      this.popElement();
    };

    _proto14.pushElement = function pushElement(element, nextSibling) {
      if (nextSibling === void 0) {
        nextSibling = null;
      }

      this[CURSOR_STACK].push(new CursorImpl(element, nextSibling));
    };

    _proto14.pushModifiers = function pushModifiers(modifiers) {
      this.modifierStack.push(modifiers);
    };

    _proto14.popModifiers = function popModifiers() {
      return this.modifierStack.pop();
    };

    _proto14.didAppendBounds = function didAppendBounds(bounds) {
      this.block().didAppendBounds(bounds);
      return bounds;
    };

    _proto14.didAppendNode = function didAppendNode(node) {
      this.block().didAppendNode(node);
      return node;
    };

    _proto14.didOpenElement = function didOpenElement(element) {
      this.block().openElement(element);
      return element;
    };

    _proto14.willCloseElement = function willCloseElement() {
      this.block().closeElement();
    };

    _proto14.appendText = function appendText(string) {
      return this.didAppendNode(this.__appendText(string));
    };

    _proto14.__appendText = function __appendText(text) {
      var dom = this.dom,
          element = this.element,
          nextSibling = this.nextSibling;
      var node = dom.createTextNode(text);
      dom.insertBefore(element, node, nextSibling);
      return node;
    };

    _proto14.__appendNode = function __appendNode(node) {
      this.dom.insertBefore(this.element, node, this.nextSibling);
      return node;
    };

    _proto14.__appendFragment = function __appendFragment(fragment) {
      var first = fragment.firstChild;

      if (first) {
        var ret = new ConcreteBounds(this.element, first, fragment.lastChild);
        this.dom.insertBefore(this.element, fragment, this.nextSibling);
        return ret;
      } else {
        return new SingleNodeBounds(this.element, this.__appendComment(''));
      }
    };

    _proto14.__appendHTML = function __appendHTML(html) {
      return this.dom.insertHTMLBefore(this.element, this.nextSibling, html);
    };

    _proto14.appendDynamicHTML = function appendDynamicHTML(value) {
      var bounds = this.trustedContent(value);
      this.didAppendBounds(bounds);
    };

    _proto14.appendDynamicText = function appendDynamicText(value) {
      var node = this.untrustedContent(value);
      this.didAppendNode(node);
      return node;
    };

    _proto14.appendDynamicFragment = function appendDynamicFragment(value) {
      var bounds = this.__appendFragment(value);

      this.didAppendBounds(bounds);
    };

    _proto14.appendDynamicNode = function appendDynamicNode(value) {
      var node = this.__appendNode(value);

      var bounds = new SingleNodeBounds(this.element, node);
      this.didAppendBounds(bounds);
    };

    _proto14.trustedContent = function trustedContent(value) {
      return this.__appendHTML(value);
    };

    _proto14.untrustedContent = function untrustedContent(value) {
      return this.__appendText(value);
    };

    _proto14.appendComment = function appendComment(string) {
      return this.didAppendNode(this.__appendComment(string));
    };

    _proto14.__appendComment = function __appendComment(string) {
      var dom = this.dom,
          element = this.element,
          nextSibling = this.nextSibling;
      var node = dom.createComment(string);
      dom.insertBefore(element, node, nextSibling);
      return node;
    };

    _proto14.__setAttribute = function __setAttribute(name, value, namespace) {
      this.dom.setAttribute(this.constructing, name, value, namespace);
    };

    _proto14.__setProperty = function __setProperty(name, value) {
      this.constructing[name] = value;
    };

    _proto14.setStaticAttribute = function setStaticAttribute(name, value, namespace) {
      this.__setAttribute(name, value, namespace);
    };

    _proto14.setDynamicAttribute = function setDynamicAttribute(name, value, trusting, namespace) {
      var element = this.constructing;
      var attribute = dynamicAttribute(element, name, namespace, trusting);
      attribute.set(this, value, this.env);
      return attribute;
    };

    (0, _emberBabel.createClass)(NewElementBuilder, [{
      key: "element",
      get: function get() {
        return this[CURSOR_STACK].current.element;
      }
    }, {
      key: "nextSibling",
      get: function get() {
        return this[CURSOR_STACK].current.nextSibling;
      }
    }, {
      key: "hasBlocks",
      get: function get() {
        return this.blockStack.size > 0;
      }
    }]);
    return NewElementBuilder;
  }();

  _exports.NewElementBuilder = NewElementBuilder;
  _a = CURSOR_STACK;

  var SimpleLiveBlock = /*#__PURE__*/function () {
    function SimpleLiveBlock(parent) {
      this.parent = parent;
      this.first = null;
      this.last = null;
      this.nesting = 0;
    }

    var _proto15 = SimpleLiveBlock.prototype;

    _proto15.parentElement = function parentElement() {
      return this.parent;
    };

    _proto15.firstNode = function firstNode() {
      var first = this.first;
      return first.firstNode();
    };

    _proto15.lastNode = function lastNode() {
      var last = this.last;
      return last.lastNode();
    };

    _proto15.openElement = function openElement(element) {
      this.didAppendNode(element);
      this.nesting++;
    };

    _proto15.closeElement = function closeElement() {
      this.nesting--;
    };

    _proto15.didAppendNode = function didAppendNode(node) {
      if (this.nesting !== 0) return;

      if (!this.first) {
        this.first = new First(node);
      }

      this.last = new Last(node);
    };

    _proto15.didAppendBounds = function didAppendBounds(bounds) {
      if (this.nesting !== 0) return;

      if (!this.first) {
        this.first = bounds;
      }

      this.last = bounds;
    };

    _proto15.finalize = function finalize(stack) {
      if (this.first === null) {
        stack.appendComment('');
      }
    };

    return SimpleLiveBlock;
  }();

  var RemoteLiveBlock = /*#__PURE__*/function (_SimpleLiveBlock) {
    (0, _emberBabel.inheritsLoose)(RemoteLiveBlock, _SimpleLiveBlock);

    function RemoteLiveBlock(parent) {
      var _this2;

      _this2 = _SimpleLiveBlock.call(this, parent) || this;
      (0, _destroyable2.registerDestructor)((0, _emberBabel.assertThisInitialized)(_this2), function () {
        // In general, you only need to clear the root of a hierarchy, and should never
        // need to clear any child nodes. This is an important constraint that gives us
        // a strong guarantee that clearing a subtree is a single DOM operation.
        //
        // Because remote blocks are not normally physically nested inside of the tree
        // that they are logically nested inside, we manually clear remote blocks when
        // a logical parent is cleared.
        //
        // HOWEVER, it is currently possible for a remote block to be physically nested
        // inside of the block it is logically contained inside of. This happens when
        // the remote block is appended to the end of the application's entire element.
        //
        // The problem with that scenario is that Glimmer believes that it owns more of
        // the DOM than it actually does. The code is attempting to write past the end
        // of the Glimmer-managed root, but Glimmer isn't aware of that.
        //
        // The correct solution to that problem is for Glimmer to be aware of the end
        // of the bounds that it owns, and once we make that change, this check could
        // be removed.
        //
        // For now, a more targeted fix is to check whether the node was already removed
        // and avoid clearing the node if it was. In most cases this shouldn't happen,
        // so this might hide bugs where the code clears nested nodes unnecessarily,
        // so we should eventually try to do the correct fix.
        if (_this2.parentElement() === _this2.firstNode().parentNode) {
          clear((0, _emberBabel.assertThisInitialized)(_this2));
        }
      });
      return _this2;
    }

    return RemoteLiveBlock;
  }(SimpleLiveBlock);

  _exports.RemoteLiveBlock = RemoteLiveBlock;

  var UpdatableBlockImpl = /*#__PURE__*/function (_SimpleLiveBlock2) {
    (0, _emberBabel.inheritsLoose)(UpdatableBlockImpl, _SimpleLiveBlock2);

    function UpdatableBlockImpl() {
      return _SimpleLiveBlock2.apply(this, arguments) || this;
    }

    var _proto16 = UpdatableBlockImpl.prototype;

    _proto16.reset = function reset() {
      (0, _destroyable2.destroy)(this);
      var nextSibling = clear(this);
      this.first = null;
      this.last = null;
      this.nesting = 0;
      return nextSibling;
    };

    return UpdatableBlockImpl;
  }(SimpleLiveBlock); // FIXME: All the noops in here indicate a modelling problem


  _exports.UpdatableBlockImpl = UpdatableBlockImpl;

  var LiveBlockList = /*#__PURE__*/function () {
    function LiveBlockList(parent, boundList) {
      this.parent = parent;
      this.boundList = boundList;
      this.parent = parent;
      this.boundList = boundList;
    }

    var _proto17 = LiveBlockList.prototype;

    _proto17.parentElement = function parentElement() {
      return this.parent;
    };

    _proto17.firstNode = function firstNode() {
      var head = this.boundList[0];
      return head.firstNode();
    };

    _proto17.lastNode = function lastNode() {
      var boundList = this.boundList;
      var tail = boundList[boundList.length - 1];
      return tail.lastNode();
    };

    _proto17.openElement = function openElement(_element) {};

    _proto17.closeElement = function closeElement() {};

    _proto17.didAppendNode = function didAppendNode(_node) {};

    _proto17.didAppendBounds = function didAppendBounds(_bounds) {};

    _proto17.finalize = function finalize(_stack) {};

    return LiveBlockList;
  }();

  function clientBuilder(env, cursor) {
    return NewElementBuilder.forInitialRender(env, cursor);
  }

  var AppendOpcodes = /*#__PURE__*/function () {
    function AppendOpcodes() {
      this.evaluateOpcode = (0, _util.fillNulls)(104
      /* Size */
      ).slice();
    }

    var _proto18 = AppendOpcodes.prototype;

    _proto18.add = function add(name, evaluate, kind) {
      if (kind === void 0) {
        kind = 'syscall';
      }

      this.evaluateOpcode[name] = {
        syscall: kind !== 'machine',
        evaluate: evaluate
      };
    };

    _proto18.debugBefore = function debugBefore(vm, opcode) {
      var params = undefined;
      var opName = undefined;
      var sp;
      return {
        sp: sp,
        pc: vm.fetchValue(_vm2.$pc),
        name: opName,
        params: params,
        type: opcode.type,
        isMachine: opcode.isMachine,
        size: opcode.size,
        state: undefined
      };
    };

    _proto18.debugAfter = function debugAfter(vm, pre) {};

    _proto18.evaluate = function evaluate(vm, opcode, type) {
      var operation = this.evaluateOpcode[type];

      if (operation.syscall) {
        operation.evaluate(vm, opcode);
      } else {
        operation.evaluate(vm[INNER_VM], opcode);
      }
    };

    return AppendOpcodes;
  }();

  var APPEND_OPCODES = new AppendOpcodes();

  var AbstractOpcode = function AbstractOpcode() {
    (0, _util.initializeGuid)(this);
  };

  var UpdatingOpcode = /*#__PURE__*/function (_AbstractOpcode) {
    (0, _emberBabel.inheritsLoose)(UpdatingOpcode, _AbstractOpcode);

    function UpdatingOpcode() {
      return _AbstractOpcode.apply(this, arguments) || this;
    }

    return UpdatingOpcode;
  }(AbstractOpcode);

  function createConcatRef(partsRefs) {
    return (0, _reference.createComputeRef)(function () {
      var parts = new Array();

      for (var i = 0; i < partsRefs.length; i++) {
        var value = (0, _reference.valueForRef)(partsRefs[i]);

        if (value !== null && value !== undefined) {
          parts[i] = castToString(value);
        }
      }

      if (parts.length > 0) {
        return parts.join('');
      }

      return null;
    });
  }

  function castToString(value) {
    if (typeof value.toString !== 'function') {
      return '';
    }

    return String(value);
  }

  var TYPE = (0, _util.symbol)('TYPE');
  var INNER = (0, _util.symbol)('INNER');
  var OWNER = (0, _util.symbol)('OWNER');
  var ARGS$1 = (0, _util.symbol)('ARGS');
  var RESOLVED = (0, _util.symbol)('RESOLVED');
  var CURRIED_VALUES = new _util._WeakSet();

  function isCurriedValue(value) {
    return CURRIED_VALUES.has(value);
  }

  function isCurriedType(value, type) {
    return isCurriedValue(value) && value[TYPE] === type;
  }

  var CurriedValue =
  /** @internal */
  function CurriedValue(type, inner, owner, args, resolved) {
    if (resolved === void 0) {
      resolved = false;
    }

    CURRIED_VALUES.add(this);
    this[TYPE] = type;
    this[INNER] = inner;
    this[OWNER] = owner;
    this[ARGS$1] = args;
    this[RESOLVED] = resolved;
  };

  _exports.CurriedValue = CurriedValue;

  function resolveCurriedValue(curriedValue) {
    var currentWrapper = curriedValue;
    var positional;
    var named;
    var definition, owner, resolved;

    while (true) {
      var _currentWrapper = currentWrapper,
          curriedArgs = _currentWrapper[ARGS$1],
          inner = _currentWrapper[INNER];

      if (curriedArgs !== null) {
        var curriedNamed = curriedArgs.named,
            curriedPositional = curriedArgs.positional;

        if (curriedPositional.length > 0) {
          positional = positional === undefined ? curriedPositional : curriedPositional.concat(positional);
        }

        if (named === undefined) {
          named = [];
        }

        named.unshift(curriedNamed);
      }

      if (!isCurriedValue(inner)) {
        // Save off the owner that this helper was curried with. Later on,
        // we'll fetch the value of this register and set it as the owner on the
        // new root scope.
        definition = inner;
        owner = currentWrapper[OWNER];
        resolved = currentWrapper[RESOLVED];
        break;
      }

      currentWrapper = inner;
    }

    return {
      definition: definition,
      owner: owner,
      resolved: resolved,
      positional: positional,
      named: named
    };
  }

  function curry(type, spec, owner, args, resolved) {
    if (resolved === void 0) {
      resolved = false;
    }

    return new CurriedValue(type, spec, owner, args, resolved);
  }

  function createCurryRef(type, inner, owner, args, resolver, isStrict) {
    var lastValue, curriedDefinition;
    return (0, _reference.createComputeRef)(function () {
      var value = (0, _reference.valueForRef)(inner);

      if (value === lastValue) {
        return curriedDefinition;
      }

      if (isCurriedType(value, type)) {
        curriedDefinition = args ? curry(type, value, owner, args) : args;
      } else if (type === 0
      /* Component */
      && typeof value === 'string' && value) {
        // Only components should enter this path, as helpers and modifiers do not
        // support string based resolution
        if (false
        /* DEBUG */
        ) {
          if (isStrict) {
            throw new Error("Attempted to resolve a dynamic component with a string definition, `" + value + "` in a strict mode template. In strict mode, using strings to resolve component definitions is prohibited. You can instead import the component definition and use it directly.");
          }

          var resolvedDefinition = resolver.lookupComponent(value, owner);

          if (!resolvedDefinition) {
            throw new Error("Attempted to resolve `" + value + "`, which was expected to be a component, but nothing was found.");
          }
        }

        curriedDefinition = curry(type, value, owner, args);
      } else if ((0, _util.isObject)(value)) {
        curriedDefinition = curry(type, value, owner, args);
      } else {
        curriedDefinition = null;
      }

      lastValue = value;
      return curriedDefinition;
    });
  }
  /*
    The calling convention is:
  
    * 0-N block arguments at the bottom
    * 0-N positional arguments next (left-to-right)
    * 0-N named arguments next
  */


  var VMArgumentsImpl = /*#__PURE__*/function () {
    function VMArgumentsImpl() {
      this.stack = null;
      this.positional = new PositionalArgumentsImpl();
      this.named = new NamedArgumentsImpl();
      this.blocks = new BlockArgumentsImpl();
    }

    var _proto19 = VMArgumentsImpl.prototype;

    _proto19.empty = function empty(stack) {
      var base = stack[REGISTERS][_vm2.$sp] + 1;
      this.named.empty(stack, base);
      this.positional.empty(stack, base);
      this.blocks.empty(stack, base);
      return this;
    };

    _proto19.setup = function setup(stack, names, blockNames, positionalCount, atNames) {
      this.stack = stack;
      /*
             | ... | blocks      | positional  | named |
             | ... | b0    b1    | p0 p1 p2 p3 | n0 n1 |
       index | ... | 4/5/6 7/8/9 | 10 11 12 13 | 14 15 |
                     ^             ^             ^  ^
                   bbase         pbase       nbase  sp
      */

      var named = this.named;
      var namedCount = names.length;
      var namedBase = stack[REGISTERS][_vm2.$sp] - namedCount + 1;
      named.setup(stack, namedBase, namedCount, names, atNames);
      var positional = this.positional;
      var positionalBase = namedBase - positionalCount;
      positional.setup(stack, positionalBase, positionalCount);
      var blocks = this.blocks;
      var blocksCount = blockNames.length;
      var blocksBase = positionalBase - blocksCount * 3;
      blocks.setup(stack, blocksBase, blocksCount, blockNames);
    };

    _proto19.at = function at(pos) {
      return this.positional.at(pos);
    };

    _proto19.realloc = function realloc(offset) {
      var stack = this.stack;

      if (offset > 0 && stack !== null) {
        var positional = this.positional,
            named = this.named;
        var newBase = positional.base + offset;
        var length = positional.length + named.length;

        for (var i = length - 1; i >= 0; i--) {
          stack.copy(i + positional.base, i + newBase);
        }

        positional.base += offset;
        named.base += offset;
        stack[REGISTERS][_vm2.$sp] += offset;
      }
    };

    _proto19.capture = function capture() {
      var positional = this.positional.length === 0 ? EMPTY_POSITIONAL : this.positional.capture();
      var named = this.named.length === 0 ? EMPTY_NAMED : this.named.capture();
      return {
        named: named,
        positional: positional
      };
    };

    _proto19.clear = function clear() {
      var stack = this.stack,
          length = this.length;
      if (length > 0 && stack !== null) stack.pop(length);
    };

    (0, _emberBabel.createClass)(VMArgumentsImpl, [{
      key: "base",
      get: function get() {
        return this.blocks.base;
      }
    }, {
      key: "length",
      get: function get() {
        return this.positional.length + this.named.length + this.blocks.length * 3;
      }
    }]);
    return VMArgumentsImpl;
  }();

  var EMPTY_REFERENCES = (0, _util.emptyArray)();

  var PositionalArgumentsImpl = /*#__PURE__*/function () {
    function PositionalArgumentsImpl() {
      this.base = 0;
      this.length = 0;
      this.stack = null;
      this._references = null;
    }

    var _proto20 = PositionalArgumentsImpl.prototype;

    _proto20.empty = function empty(stack, base) {
      this.stack = stack;
      this.base = base;
      this.length = 0;
      this._references = EMPTY_REFERENCES;
    };

    _proto20.setup = function setup(stack, base, length) {
      this.stack = stack;
      this.base = base;
      this.length = length;

      if (length === 0) {
        this._references = EMPTY_REFERENCES;
      } else {
        this._references = null;
      }
    };

    _proto20.at = function at(position) {
      var base = this.base,
          length = this.length,
          stack = this.stack;

      if (position < 0 || position >= length) {
        return _reference.UNDEFINED_REFERENCE;
      }

      return stack.get(position, base);
    };

    _proto20.capture = function capture() {
      return this.references;
    };

    _proto20.prepend = function prepend(other) {
      var additions = other.length;

      if (additions > 0) {
        var base = this.base,
            length = this.length,
            stack = this.stack;
        this.base = base = base - additions;
        this.length = length + additions;

        for (var i = 0; i < additions; i++) {
          stack.set(other[i], i, base);
        }

        this._references = null;
      }
    };

    (0, _emberBabel.createClass)(PositionalArgumentsImpl, [{
      key: "references",
      get: function get() {
        var references = this._references;

        if (!references) {
          var stack = this.stack,
              base = this.base,
              length = this.length;
          references = this._references = stack.slice(base, base + length);
        }

        return references;
      }
    }]);
    return PositionalArgumentsImpl;
  }();

  var NamedArgumentsImpl = /*#__PURE__*/function () {
    function NamedArgumentsImpl() {
      this.base = 0;
      this.length = 0;
      this._references = null;
      this._names = _util.EMPTY_STRING_ARRAY;
      this._atNames = _util.EMPTY_STRING_ARRAY;
    }

    var _proto21 = NamedArgumentsImpl.prototype;

    _proto21.empty = function empty(stack, base) {
      this.stack = stack;
      this.base = base;
      this.length = 0;
      this._references = EMPTY_REFERENCES;
      this._names = _util.EMPTY_STRING_ARRAY;
      this._atNames = _util.EMPTY_STRING_ARRAY;
    };

    _proto21.setup = function setup(stack, base, length, names, atNames) {
      this.stack = stack;
      this.base = base;
      this.length = length;

      if (length === 0) {
        this._references = EMPTY_REFERENCES;
        this._names = _util.EMPTY_STRING_ARRAY;
        this._atNames = _util.EMPTY_STRING_ARRAY;
      } else {
        this._references = null;

        if (atNames) {
          this._names = null;
          this._atNames = names;
        } else {
          this._names = names;
          this._atNames = null;
        }
      }
    };

    _proto21.has = function has(name) {
      return this.names.indexOf(name) !== -1;
    };

    _proto21.get = function get(name, atNames) {
      if (atNames === void 0) {
        atNames = false;
      }

      var base = this.base,
          stack = this.stack;
      var names = atNames ? this.atNames : this.names;
      var idx = names.indexOf(name);

      if (idx === -1) {
        return _reference.UNDEFINED_REFERENCE;
      }

      var ref = stack.get(idx, base);

      if (false
      /* DEBUG */
      ) {
        return (0, _reference.createDebugAliasRef)(atNames ? name : "@" + name, ref);
      } else {
        return ref;
      }
    };

    _proto21.capture = function capture() {
      var names = this.names,
          references = this.references;
      var map = (0, _util.dict)();

      for (var i = 0; i < names.length; i++) {
        var name = names[i];

        if (false
        /* DEBUG */
        ) {
          map[name] = (0, _reference.createDebugAliasRef)("@" + name, references[i]);
        } else {
          map[name] = references[i];
        }
      }

      return map;
    };

    _proto21.merge = function merge(other) {
      var keys = Object.keys(other);

      if (keys.length > 0) {
        var names = this.names,
            length = this.length,
            stack = this.stack;
        var newNames = names.slice();

        for (var i = 0; i < keys.length; i++) {
          var name = keys[i];
          var idx = newNames.indexOf(name);

          if (idx === -1) {
            length = newNames.push(name);
            stack.pushJs(other[name]);
          }
        }

        this.length = length;
        this._references = null;
        this._names = newNames;
        this._atNames = null;
      }
    };

    _proto21.toSyntheticName = function toSyntheticName(name) {
      return name.slice(1);
    };

    _proto21.toAtName = function toAtName(name) {
      return "@" + name;
    };

    (0, _emberBabel.createClass)(NamedArgumentsImpl, [{
      key: "names",
      get: function get() {
        var names = this._names;

        if (!names) {
          names = this._names = this._atNames.map(this.toSyntheticName);
        }

        return names;
      }
    }, {
      key: "atNames",
      get: function get() {
        var atNames = this._atNames;

        if (!atNames) {
          atNames = this._atNames = this._names.map(this.toAtName);
        }

        return atNames;
      }
    }, {
      key: "references",
      get: function get() {
        var references = this._references;

        if (!references) {
          var base = this.base,
              length = this.length,
              stack = this.stack;
          references = this._references = stack.slice(base, base + length);
        }

        return references;
      }
    }]);
    return NamedArgumentsImpl;
  }();

  function toSymbolName(name) {
    return "&" + name;
  }

  var EMPTY_BLOCK_VALUES = (0, _util.emptyArray)();

  var BlockArgumentsImpl = /*#__PURE__*/function () {
    function BlockArgumentsImpl() {
      this.internalValues = null;
      this._symbolNames = null;
      this.internalTag = null;
      this.names = _util.EMPTY_STRING_ARRAY;
      this.length = 0;
      this.base = 0;
    }

    var _proto22 = BlockArgumentsImpl.prototype;

    _proto22.empty = function empty(stack, base) {
      this.stack = stack;
      this.names = _util.EMPTY_STRING_ARRAY;
      this.base = base;
      this.length = 0;
      this._symbolNames = null;
      this.internalTag = _validator.CONSTANT_TAG;
      this.internalValues = EMPTY_BLOCK_VALUES;
    };

    _proto22.setup = function setup(stack, base, length, names) {
      this.stack = stack;
      this.names = names;
      this.base = base;
      this.length = length;
      this._symbolNames = null;

      if (length === 0) {
        this.internalTag = _validator.CONSTANT_TAG;
        this.internalValues = EMPTY_BLOCK_VALUES;
      } else {
        this.internalTag = null;
        this.internalValues = null;
      }
    };

    _proto22.has = function has(name) {
      return this.names.indexOf(name) !== -1;
    };

    _proto22.get = function get(name) {
      var idx = this.names.indexOf(name);

      if (idx === -1) {
        return null;
      }

      var base = this.base,
          stack = this.stack;
      var table = stack.get(idx * 3, base);
      var scope = stack.get(idx * 3 + 1, base);
      var handle = stack.get(idx * 3 + 2, base);
      return handle === null ? null : [handle, scope, table];
    };

    _proto22.capture = function capture() {
      return new CapturedBlockArgumentsImpl(this.names, this.values);
    };

    (0, _emberBabel.createClass)(BlockArgumentsImpl, [{
      key: "values",
      get: function get() {
        var values = this.internalValues;

        if (!values) {
          var base = this.base,
              length = this.length,
              stack = this.stack;
          values = this.internalValues = stack.slice(base, base + length * 3);
        }

        return values;
      }
    }, {
      key: "symbolNames",
      get: function get() {
        var symbolNames = this._symbolNames;

        if (symbolNames === null) {
          symbolNames = this._symbolNames = this.names.map(toSymbolName);
        }

        return symbolNames;
      }
    }]);
    return BlockArgumentsImpl;
  }();

  var CapturedBlockArgumentsImpl = /*#__PURE__*/function () {
    function CapturedBlockArgumentsImpl(names, values) {
      this.names = names;
      this.values = values;
      this.length = names.length;
    }

    var _proto23 = CapturedBlockArgumentsImpl.prototype;

    _proto23.has = function has(name) {
      return this.names.indexOf(name) !== -1;
    };

    _proto23.get = function get(name) {
      var idx = this.names.indexOf(name);
      if (idx === -1) return null;
      return [this.values[idx * 3 + 2], this.values[idx * 3 + 1], this.values[idx * 3]];
    };

    return CapturedBlockArgumentsImpl;
  }();

  function createCapturedArgs(named, positional) {
    return {
      named: named,
      positional: positional
    };
  }

  function reifyNamed$1(named) {
    var reified = (0, _util.dict)();

    for (var key in named) {
      reified[key] = (0, _reference.valueForRef)(named[key]);
    }

    return reified;
  }

  function reifyPositional$1(positional) {
    return positional.map(_reference.valueForRef);
  }

  function reifyArgs(args) {
    return {
      named: reifyNamed$1(args.named),
      positional: reifyPositional$1(args.positional)
    };
  }

  var EMPTY_NAMED = Object.freeze(Object.create(null));
  _exports.EMPTY_NAMED = EMPTY_NAMED;
  var EMPTY_POSITIONAL = EMPTY_REFERENCES;
  _exports.EMPTY_POSITIONAL = EMPTY_POSITIONAL;
  var EMPTY_ARGS = createCapturedArgs(EMPTY_NAMED, EMPTY_POSITIONAL);
  _exports.EMPTY_ARGS = EMPTY_ARGS;
  APPEND_OPCODES.add(77
  /* Curry */
  , function (vm, _ref2) {
    var type = _ref2.op1,
        _isStrict = _ref2.op2;
    var stack = vm.stack;
    var definition = stack.popJs();
    var capturedArgs = stack.popJs();
    var owner = vm.getOwner();
    var resolver = vm.runtime.resolver;
    var isStrict = false;

    if (false
    /* DEBUG */
    ) {
      // strict check only happens in DEBUG builds, no reason to load it otherwise
      isStrict = vm[CONSTANTS].getValue((0, _util.decodeHandle)(_isStrict));
    }

    vm.loadValue(_vm2.$v0, createCurryRef(type, definition, owner, capturedArgs, resolver, isStrict));
  });
  APPEND_OPCODES.add(107
  /* DynamicHelper */
  , function (vm, _ref3) {
    var _definitionRegister = _ref3.op1;
    var stack = vm.stack;
    var args = stack.popJs().capture();
    var ref = vm.fetchValue(_definitionRegister);
    var helperRef;
    var initialOwner = vm.getOwner();
    var helperInstanceRef = (0, _reference.createComputeRef)(function () {
      if (helperRef !== undefined) {
        (0, _destroyable2.destroy)(helperRef);
      }

      var definition = (0, _reference.valueForRef)(ref);

      if (isCurriedType(definition, 1
      /* Helper */
      )) {
        var _resolveCurriedValue = resolveCurriedValue(definition),
            resolvedDef = _resolveCurriedValue.definition,
            owner = _resolveCurriedValue.owner,
            positional = _resolveCurriedValue.positional,
            named = _resolveCurriedValue.named;

        var _helper = resolveHelper(vm[CONSTANTS], resolvedDef, ref);

        if (named !== undefined) {
          args.named = _util.assign.apply(void 0, [{}].concat(named, [args.named]));
        }

        if (positional !== undefined) {
          args.positional = positional.concat(args.positional);
        }

        helperRef = _helper(args, owner);
        (0, _destroyable2.associateDestroyableChild)(helperInstanceRef, helperRef);
      } else if ((0, _util.isObject)(definition)) {
        var _helper2 = resolveHelper(vm[CONSTANTS], definition, ref);

        helperRef = _helper2(args, initialOwner);

        if ((0, _destroyable2._hasDestroyableChildren)(helperRef)) {
          (0, _destroyable2.associateDestroyableChild)(helperInstanceRef, helperRef);
        }
      } else {
        helperRef = _reference.UNDEFINED_REFERENCE;
      }
    });
    var helperValueRef = (0, _reference.createComputeRef)(function () {
      (0, _reference.valueForRef)(helperInstanceRef);
      return (0, _reference.valueForRef)(helperRef);
    });
    vm.associateDestroyable(helperInstanceRef);
    vm.loadValue(_vm2.$v0, helperValueRef);
  });

  function resolveHelper(constants$$1, definition, ref) {
    var handle = constants$$1.helper(definition, null, true);

    if (false
    /* DEBUG */
    && handle === null) {
      throw new Error("Expected a dynamic helper definition, but received an object or function that did not have a helper manager associated with it. The dynamic invocation was `{{" + ref.debugLabel + "}}` or `(" + ref.debugLabel + ")`, and the incorrect definition is the value at the path `" + ref.debugLabel + "`, which was: " + (0, _util.debugToString)(definition));
    }

    return constants$$1.getValue(handle);
  }

  APPEND_OPCODES.add(16
  /* Helper */
  , function (vm, _ref4) {
    var handle = _ref4.op1;
    var stack = vm.stack;
    var helper = vm[CONSTANTS].getValue(handle);
    var args = stack.popJs();
    var value = helper(args.capture(), vm.getOwner(), vm.dynamicScope());

    if ((0, _destroyable2._hasDestroyableChildren)(value)) {
      vm.associateDestroyable(value);
    }

    vm.loadValue(_vm2.$v0, value);
  });
  APPEND_OPCODES.add(21
  /* GetVariable */
  , function (vm, _ref5) {
    var symbol$$1 = _ref5.op1;
    var expr = vm.referenceForSymbol(symbol$$1);
    vm.stack.pushJs(expr);
  });
  APPEND_OPCODES.add(19
  /* SetVariable */
  , function (vm, _ref6) {
    var symbol$$1 = _ref6.op1;
    var expr = vm.stack.pop();
    vm.scope().bindSymbol(symbol$$1, expr);
  });
  APPEND_OPCODES.add(20
  /* SetBlock */
  , function (vm, _ref7) {
    var symbol$$1 = _ref7.op1;
    var handle = vm.stack.popJs();
    var scope = vm.stack.popJs();
    var table = vm.stack.popJs();
    vm.scope().bindBlock(symbol$$1, [handle, scope, table]);
  });
  APPEND_OPCODES.add(102
  /* ResolveMaybeLocal */
  , function (vm, _ref8) {
    var _name = _ref8.op1;
    var name = vm[CONSTANTS].getValue(_name);
    var locals = vm.scope().getPartialMap();
    var ref = locals[name];

    if (ref === undefined) {
      ref = (0, _reference.childRefFor)(vm.getSelf(), name);
    }

    vm.stack.pushJs(ref);
  });
  APPEND_OPCODES.add(37
  /* RootScope */
  , function (vm, _ref9) {
    var symbols = _ref9.op1;
    vm.pushRootScope(symbols, vm.getOwner());
  });
  APPEND_OPCODES.add(22
  /* GetProperty */
  , function (vm, _ref10) {
    var _key = _ref10.op1;
    var key = vm[CONSTANTS].getValue(_key);
    var expr = vm.stack.popJs();
    vm.stack.pushJs((0, _reference.childRefFor)(expr, key));
  });
  APPEND_OPCODES.add(23
  /* GetBlock */
  , function (vm, _ref11) {
    var _block = _ref11.op1;
    var stack = vm.stack;
    var block = vm.scope().getBlock(_block);

    if (block === null) {
      stack.pushNull();
    } else {
      stack.pushJs(block);
    }
  });
  APPEND_OPCODES.add(24
  /* SpreadBlock */
  , function (vm) {
    var stack = vm.stack;
    var block = stack.popJs();

    if (block && !isUndefinedReference(block)) {
      var handleOrCompilable = block[0],
          scope = block[1],
          table = block[2];
      stack.pushJs(table);
      stack.pushJs(scope);

      if (typeof handleOrCompilable === 'number') {
        stack.pushSmallInt(handleOrCompilable);
      } else {
        stack.pushJs(handleOrCompilable);
      }
    } else {
      stack.pushNull();
      stack.pushNull();
      stack.pushNull();
    }
  });

  function isUndefinedReference(input) {
    return input === _reference.UNDEFINED_REFERENCE;
  }

  APPEND_OPCODES.add(25
  /* HasBlock */
  , function (vm) {
    var stack = vm.stack;
    var block = stack.pop();

    if (block && !isUndefinedReference(block)) {
      stack.pushJs(_reference.TRUE_REFERENCE);
    } else {
      stack.pushJs(_reference.FALSE_REFERENCE);
    }
  });
  APPEND_OPCODES.add(26
  /* HasBlockParams */
  , function (vm) {
    // FIXME(mmun): should only need to push the symbol table
    var block = vm.stack.pop();
    var scope = vm.stack.popJs();
    var table = vm.stack.popJs();
    var hasBlockParams = table && table.parameters.length;
    vm.stack.pushJs(hasBlockParams ? _reference.TRUE_REFERENCE : _reference.FALSE_REFERENCE);
  });
  APPEND_OPCODES.add(27
  /* Concat */
  , function (vm, _ref12) {
    var count = _ref12.op1;
    var out = new Array(count);

    for (var i = count; i > 0; i--) {
      var offset = i - 1;
      out[offset] = vm.stack.pop();
    }

    vm.stack.pushJs(createConcatRef(out));
  });
  APPEND_OPCODES.add(109
  /* IfInline */
  , function (vm) {
    var condition = vm.stack.popJs();
    var truthy = vm.stack.popJs();
    var falsy = vm.stack.popJs();
    vm.stack.pushJs((0, _reference.createComputeRef)(function () {
      if ((0, _globalContext.toBool)((0, _reference.valueForRef)(condition)) === true) {
        return (0, _reference.valueForRef)(truthy);
      } else {
        return (0, _reference.valueForRef)(falsy);
      }
    }));
  });
  APPEND_OPCODES.add(110
  /* Not */
  , function (vm) {
    var ref = vm.stack.popJs();
    vm.stack.pushJs((0, _reference.createComputeRef)(function () {
      return !(0, _globalContext.toBool)((0, _reference.valueForRef)(ref));
    }));
  });
  APPEND_OPCODES.add(111
  /* GetDynamicVar */
  , function (vm) {
    var scope = vm.dynamicScope();
    var stack = vm.stack;
    var nameRef = stack.popJs();
    stack.pushJs((0, _reference.createComputeRef)(function () {
      var name = String((0, _reference.valueForRef)(nameRef));
      return (0, _reference.valueForRef)(scope.get(name));
    }));
  });
  APPEND_OPCODES.add(112
  /* Log */
  , function (vm) {
    var _vm$stack$popJs$captu = vm.stack.popJs().capture(),
        positional = _vm$stack$popJs$captu.positional;

    vm.loadValue(_vm2.$v0, (0, _reference.createComputeRef)(function () {
      var _console;

      // eslint-disable-next-line no-console
      (_console = console).log.apply(_console, reifyPositional$1(positional));
    }));
  });

  function resolveComponent(resolver, constants$$1, name, owner) {
    var definition = resolver.lookupComponent(name, owner);

    if (false
    /* DEBUG */
    && !definition) {
      throw new Error("Attempted to resolve `" + name + "`, which was expected to be a component, but nothing was found.");
    }

    return constants$$1.resolvedComponent(definition, name);
  }
  /** @internal */


  function hasCustomDebugRenderTreeLifecycle(manager) {
    return 'getDebugCustomRenderTree' in manager;
  }

  function createClassListRef(list) {
    return (0, _reference.createComputeRef)(function () {
      var ret = [];

      for (var i = 0; i < list.length; i++) {
        var ref = list[i];
        var value = normalizeStringValue(typeof ref === 'string' ? ref : (0, _reference.valueForRef)(list[i]));
        if (value) ret.push(value);
      }

      return ret.length === 0 ? null : ret.join(' ');
    });
  }

  APPEND_OPCODES.add(39
  /* ChildScope */
  , function (vm) {
    return vm.pushChildScope();
  });
  APPEND_OPCODES.add(40
  /* PopScope */
  , function (vm) {
    return vm.popScope();
  });
  APPEND_OPCODES.add(59
  /* PushDynamicScope */
  , function (vm) {
    return vm.pushDynamicScope();
  });
  APPEND_OPCODES.add(60
  /* PopDynamicScope */
  , function (vm) {
    return vm.popDynamicScope();
  });
  APPEND_OPCODES.add(28
  /* Constant */
  , function (vm, _ref13) {
    var other = _ref13.op1;
    vm.stack.pushJs(vm[CONSTANTS].getValue((0, _util.decodeHandle)(other)));
  });
  APPEND_OPCODES.add(29
  /* ConstantReference */
  , function (vm, _ref14) {
    var other = _ref14.op1;
    vm.stack.pushJs((0, _reference.createConstRef)(vm[CONSTANTS].getValue((0, _util.decodeHandle)(other)), false));
  });
  APPEND_OPCODES.add(30
  /* Primitive */
  , function (vm, _ref15) {
    var primitive = _ref15.op1;
    var stack = vm.stack;

    if ((0, _util.isNonPrimitiveHandle)(primitive)) {
      // it is a handle which does not already exist on the stack
      var value = vm[CONSTANTS].getValue((0, _util.decodeHandle)(primitive));
      stack.pushJs(value);
    } else {
      // is already an encoded immediate or primitive handle
      stack.pushRaw(primitive);
    }
  });
  APPEND_OPCODES.add(31
  /* PrimitiveReference */
  , function (vm) {
    var stack = vm.stack;
    var value = stack.pop();
    var ref;

    if (value === undefined) {
      ref = _reference.UNDEFINED_REFERENCE;
    } else if (value === null) {
      ref = _reference.NULL_REFERENCE;
    } else if (value === true) {
      ref = _reference.TRUE_REFERENCE;
    } else if (value === false) {
      ref = _reference.FALSE_REFERENCE;
    } else {
      ref = (0, _reference.createPrimitiveRef)(value);
    }

    stack.pushJs(ref);
  });
  APPEND_OPCODES.add(33
  /* Dup */
  , function (vm, _ref16) {
    var register = _ref16.op1,
        offset = _ref16.op2;
    var position = vm.fetchValue(register) - offset;
    vm.stack.dup(position);
  });
  APPEND_OPCODES.add(34
  /* Pop */
  , function (vm, _ref17) {
    var count = _ref17.op1;
    vm.stack.pop(count);
  });
  APPEND_OPCODES.add(35
  /* Load */
  , function (vm, _ref18) {
    var register = _ref18.op1;
    vm.load(register);
  });
  APPEND_OPCODES.add(36
  /* Fetch */
  , function (vm, _ref19) {
    var register = _ref19.op1;
    vm.fetch(register);
  });
  APPEND_OPCODES.add(58
  /* BindDynamicScope */
  , function (vm, _ref20) {
    var _names = _ref20.op1;
    var names = vm[CONSTANTS].getArray(_names);
    vm.bindDynamicScope(names);
  });
  APPEND_OPCODES.add(69
  /* Enter */
  , function (vm, _ref21) {
    var args = _ref21.op1;
    vm.enter(args);
  });
  APPEND_OPCODES.add(70
  /* Exit */
  , function (vm) {
    vm.exit();
  });
  APPEND_OPCODES.add(63
  /* PushSymbolTable */
  , function (vm, _ref22) {
    var _table = _ref22.op1;
    var stack = vm.stack;
    stack.pushJs(vm[CONSTANTS].getValue(_table));
  });
  APPEND_OPCODES.add(62
  /* PushBlockScope */
  , function (vm) {
    var stack = vm.stack;
    stack.pushJs(vm.scope());
  });
  APPEND_OPCODES.add(61
  /* CompileBlock */
  , function (vm) {
    var stack = vm.stack;
    var block = stack.pop();

    if (block) {
      stack.pushSmallInt(vm.compile(block));
    } else {
      stack.pushNull();
    }
  });
  APPEND_OPCODES.add(64
  /* InvokeYield */
  , function (vm) {
    var stack = vm.stack;
    var handle = stack.pop();
    var scope = stack.popJs();
    var table = stack.popJs();
    var args = stack.pop();

    if (table === null) {
      // To balance the pop{Frame,Scope}
      vm.pushFrame();
      vm.pushScope(scope !== null && scope !== void 0 ? scope : vm.scope());
      return;
    }

    var invokingScope = scope; // If necessary, create a child scope

    {
      var locals = table.parameters;
      var localsCount = locals.length;

      if (localsCount > 0) {
        invokingScope = invokingScope.child();

        for (var i = 0; i < localsCount; i++) {
          invokingScope.bindSymbol(locals[i], args.at(i));
        }
      }
    }
    vm.pushFrame();
    vm.pushScope(invokingScope);
    vm.call(handle);
  });
  APPEND_OPCODES.add(65
  /* JumpIf */
  , function (vm, _ref23) {
    var target = _ref23.op1;
    var reference = vm.stack.popJs();
    var value = Boolean((0, _reference.valueForRef)(reference));

    if ((0, _reference.isConstRef)(reference)) {
      if (value === true) {
        vm.goto(target);
      }
    } else {
      if (value === true) {
        vm.goto(target);
      }

      vm.updateWith(new Assert(reference));
    }
  });
  APPEND_OPCODES.add(66
  /* JumpUnless */
  , function (vm, _ref24) {
    var target = _ref24.op1;
    var reference = vm.stack.popJs();
    var value = Boolean((0, _reference.valueForRef)(reference));

    if ((0, _reference.isConstRef)(reference)) {
      if (value === false) {
        vm.goto(target);
      }
    } else {
      if (value === false) {
        vm.goto(target);
      }

      vm.updateWith(new Assert(reference));
    }
  });
  APPEND_OPCODES.add(67
  /* JumpEq */
  , function (vm, _ref25) {
    var target = _ref25.op1,
        comparison = _ref25.op2;
    var other = vm.stack.peekSmallInt();

    if (other === comparison) {
      vm.goto(target);
    }
  });
  APPEND_OPCODES.add(68
  /* AssertSame */
  , function (vm) {
    var reference = vm.stack.peekJs();

    if ((0, _reference.isConstRef)(reference) === false) {
      vm.updateWith(new Assert(reference));
    }
  });
  APPEND_OPCODES.add(71
  /* ToBoolean */
  , function (vm) {
    var stack = vm.stack;
    var valueRef = stack.popJs();
    stack.pushJs((0, _reference.createComputeRef)(function () {
      return (0, _globalContext.toBool)((0, _reference.valueForRef)(valueRef));
    }));
  });

  var Assert = /*#__PURE__*/function (_UpdatingOpcode) {
    (0, _emberBabel.inheritsLoose)(Assert, _UpdatingOpcode);

    function Assert(ref) {
      var _this3;

      _this3 = _UpdatingOpcode.call(this) || this;
      _this3.ref = ref;
      _this3.type = 'assert';
      _this3.last = (0, _reference.valueForRef)(ref);
      return _this3;
    }

    var _proto24 = Assert.prototype;

    _proto24.evaluate = function evaluate(vm) {
      var last = this.last,
          ref = this.ref;
      var current = (0, _reference.valueForRef)(ref);

      if (last !== current) {
        vm.throw();
      }
    };

    return Assert;
  }(UpdatingOpcode);

  var AssertFilter = /*#__PURE__*/function (_UpdatingOpcode2) {
    (0, _emberBabel.inheritsLoose)(AssertFilter, _UpdatingOpcode2);

    function AssertFilter(ref, filter) {
      var _this4;

      _this4 = _UpdatingOpcode2.call(this) || this;
      _this4.ref = ref;
      _this4.filter = filter;
      _this4.type = 'assert-filter';
      _this4.last = filter((0, _reference.valueForRef)(ref));
      return _this4;
    }

    var _proto25 = AssertFilter.prototype;

    _proto25.evaluate = function evaluate(vm) {
      var last = this.last,
          ref = this.ref,
          filter = this.filter;
      var current = filter((0, _reference.valueForRef)(ref));

      if (last !== current) {
        vm.throw();
      }
    };

    return AssertFilter;
  }(UpdatingOpcode);

  var JumpIfNotModifiedOpcode = /*#__PURE__*/function (_UpdatingOpcode3) {
    (0, _emberBabel.inheritsLoose)(JumpIfNotModifiedOpcode, _UpdatingOpcode3);

    function JumpIfNotModifiedOpcode() {
      var _this5;

      _this5 = _UpdatingOpcode3.apply(this, arguments) || this;
      _this5.type = 'jump-if-not-modified';
      _this5.tag = _validator.CONSTANT_TAG;
      _this5.lastRevision = _validator.INITIAL;
      return _this5;
    }

    var _proto26 = JumpIfNotModifiedOpcode.prototype;

    _proto26.finalize = function finalize(tag, target) {
      this.target = target;
      this.didModify(tag);
    };

    _proto26.evaluate = function evaluate(vm) {
      var tag = this.tag,
          target = this.target,
          lastRevision = this.lastRevision;

      if (!vm.alwaysRevalidate && (0, _validator.validateTag)(tag, lastRevision)) {
        (0, _validator.consumeTag)(tag);
        vm.goto(target);
      }
    };

    _proto26.didModify = function didModify(tag) {
      this.tag = tag;
      this.lastRevision = (0, _validator.valueForTag)(this.tag);
      (0, _validator.consumeTag)(tag);
    };

    return JumpIfNotModifiedOpcode;
  }(UpdatingOpcode);

  var BeginTrackFrameOpcode = /*#__PURE__*/function (_UpdatingOpcode4) {
    (0, _emberBabel.inheritsLoose)(BeginTrackFrameOpcode, _UpdatingOpcode4);

    function BeginTrackFrameOpcode(debugLabel) {
      var _this6;

      _this6 = _UpdatingOpcode4.call(this) || this;
      _this6.debugLabel = debugLabel;
      _this6.type = 'begin-track-frame';
      return _this6;
    }

    var _proto27 = BeginTrackFrameOpcode.prototype;

    _proto27.evaluate = function evaluate() {
      (0, _validator.beginTrackFrame)(this.debugLabel);
    };

    return BeginTrackFrameOpcode;
  }(UpdatingOpcode);

  var EndTrackFrameOpcode = /*#__PURE__*/function (_UpdatingOpcode5) {
    (0, _emberBabel.inheritsLoose)(EndTrackFrameOpcode, _UpdatingOpcode5);

    function EndTrackFrameOpcode(target) {
      var _this7;

      _this7 = _UpdatingOpcode5.call(this) || this;
      _this7.target = target;
      _this7.type = 'end-track-frame';
      return _this7;
    }

    var _proto28 = EndTrackFrameOpcode.prototype;

    _proto28.evaluate = function evaluate() {
      var tag = (0, _validator.endTrackFrame)();
      this.target.didModify(tag);
    };

    return EndTrackFrameOpcode;
  }(UpdatingOpcode);

  APPEND_OPCODES.add(41
  /* Text */
  , function (vm, _ref26) {
    var text = _ref26.op1;
    vm.elements().appendText(vm[CONSTANTS].getValue(text));
  });
  APPEND_OPCODES.add(42
  /* Comment */
  , function (vm, _ref27) {
    var text = _ref27.op1;
    vm.elements().appendComment(vm[CONSTANTS].getValue(text));
  });
  APPEND_OPCODES.add(48
  /* OpenElement */
  , function (vm, _ref28) {
    var tag = _ref28.op1;
    vm.elements().openElement(vm[CONSTANTS].getValue(tag));
  });
  APPEND_OPCODES.add(49
  /* OpenDynamicElement */
  , function (vm) {
    var tagName = (0, _reference.valueForRef)(vm.stack.popJs());
    vm.elements().openElement(tagName);
  });
  APPEND_OPCODES.add(50
  /* PushRemoteElement */
  , function (vm) {
    var elementRef = vm.stack.popJs();
    var insertBeforeRef = vm.stack.popJs();
    var guidRef = vm.stack.popJs();
    var element = (0, _reference.valueForRef)(elementRef);
    var insertBefore = (0, _reference.valueForRef)(insertBeforeRef);
    var guid = (0, _reference.valueForRef)(guidRef);

    if (!(0, _reference.isConstRef)(elementRef)) {
      vm.updateWith(new Assert(elementRef));
    }

    if (insertBefore !== undefined && !(0, _reference.isConstRef)(insertBeforeRef)) {
      vm.updateWith(new Assert(insertBeforeRef));
    }

    var block = vm.elements().pushRemoteElement(element, guid, insertBefore);
    if (block) vm.associateDestroyable(block);
  });
  APPEND_OPCODES.add(56
  /* PopRemoteElement */
  , function (vm) {
    vm.elements().popRemoteElement();
  });
  APPEND_OPCODES.add(54
  /* FlushElement */
  , function (vm) {
    var operations = vm.fetchValue(_vm2.$t0);
    var modifiers = null;

    if (operations) {
      modifiers = operations.flush(vm);
      vm.loadValue(_vm2.$t0, null);
    }

    vm.elements().flushElement(modifiers);
  });
  APPEND_OPCODES.add(55
  /* CloseElement */
  , function (vm) {
    var modifiers = vm.elements().closeElement();

    if (modifiers) {
      modifiers.forEach(function (modifier) {
        vm.env.scheduleInstallModifier(modifier);
        var manager = modifier.manager,
            state = modifier.state;
        var d = manager.getDestroyable(state);

        if (d) {
          vm.associateDestroyable(d);
        }
      });
    }
  });
  APPEND_OPCODES.add(57
  /* Modifier */
  , function (vm, _ref29) {
    var handle = _ref29.op1;

    if (vm.env.isInteractive === false) {
      return;
    }

    var owner = vm.getOwner();
    var args = vm.stack.popJs();
    var definition = vm[CONSTANTS].getValue(handle);
    var manager = definition.manager;

    var _vm$elements = vm.elements(),
        constructing = _vm$elements.constructing;

    var state = manager.create(owner, constructing, definition.state, args.capture());
    var instance = {
      manager: manager,
      state: state,
      definition: definition
    };
    var operations = vm.fetchValue(_vm2.$t0);
    operations.addModifier(instance);
    var tag = manager.getTag(state);

    if (tag !== null) {
      (0, _validator.consumeTag)(tag);
      return vm.updateWith(new UpdateModifierOpcode(tag, instance));
    }
  });
  APPEND_OPCODES.add(108
  /* DynamicModifier */
  , function (vm) {
    if (vm.env.isInteractive === false) {
      return;
    }

    var stack = vm.stack,
        constants$$1 = vm[CONSTANTS];
    var ref = stack.popJs();
    var args = stack.popJs().capture();

    var _vm$elements2 = vm.elements(),
        constructing = _vm$elements2.constructing;

    var initialOwner = vm.getOwner();
    var instanceRef = (0, _reference.createComputeRef)(function () {
      var value = (0, _reference.valueForRef)(ref);
      var owner;

      if (!(0, _util.isObject)(value)) {
        return;
      }

      var hostDefinition;

      if (isCurriedType(value, 2
      /* Modifier */
      )) {
        var _resolveCurriedValue2 = resolveCurriedValue(value),
            resolvedDefinition = _resolveCurriedValue2.definition,
            curriedOwner = _resolveCurriedValue2.owner,
            positional = _resolveCurriedValue2.positional,
            named = _resolveCurriedValue2.named;

        hostDefinition = resolvedDefinition;
        owner = curriedOwner;

        if (positional !== undefined) {
          args.positional = positional.concat(args.positional);
        }

        if (named !== undefined) {
          args.named = _util.assign.apply(void 0, [{}].concat(named, [args.named]));
        }
      } else {
        hostDefinition = value;
        owner = initialOwner;
      }

      var handle = constants$$1.modifier(hostDefinition, null, true);

      if (false
      /* DEBUG */
      && handle === null) {
        throw new Error("Expected a dynamic modifier definition, but received an object or function that did not have a modifier manager associated with it. The dynamic invocation was `{{" + ref.debugLabel + "}}`, and the incorrect definition is the value at the path `" + ref.debugLabel + "`, which was: " + (0, _util.debugToString)(hostDefinition));
      }

      var definition = constants$$1.getValue(handle);
      var manager = definition.manager;
      var state = manager.create(owner, constructing, definition.state, args);
      return {
        manager: manager,
        state: state,
        definition: definition
      };
    });
    var instance = (0, _reference.valueForRef)(instanceRef);
    var tag = null;

    if (instance !== undefined) {
      var operations = vm.fetchValue(_vm2.$t0);
      operations.addModifier(instance);
      tag = instance.manager.getTag(instance.state);

      if (tag !== null) {
        (0, _validator.consumeTag)(tag);
      }
    }

    if (!(0, _reference.isConstRef)(ref) || tag) {
      return vm.updateWith(new UpdateDynamicModifierOpcode(tag, instance, instanceRef));
    }
  });

  var UpdateModifierOpcode = /*#__PURE__*/function (_UpdatingOpcode6) {
    (0, _emberBabel.inheritsLoose)(UpdateModifierOpcode, _UpdatingOpcode6);

    function UpdateModifierOpcode(tag, modifier) {
      var _this8;

      _this8 = _UpdatingOpcode6.call(this) || this;
      _this8.tag = tag;
      _this8.modifier = modifier;
      _this8.type = 'update-modifier';
      _this8.lastUpdated = (0, _validator.valueForTag)(tag);
      return _this8;
    }

    var _proto29 = UpdateModifierOpcode.prototype;

    _proto29.evaluate = function evaluate(vm) {
      var modifier = this.modifier,
          tag = this.tag,
          lastUpdated = this.lastUpdated;
      (0, _validator.consumeTag)(tag);

      if (!(0, _validator.validateTag)(tag, lastUpdated)) {
        vm.env.scheduleUpdateModifier(modifier);
        this.lastUpdated = (0, _validator.valueForTag)(tag);
      }
    };

    return UpdateModifierOpcode;
  }(UpdatingOpcode);

  var UpdateDynamicModifierOpcode = /*#__PURE__*/function (_UpdatingOpcode7) {
    (0, _emberBabel.inheritsLoose)(UpdateDynamicModifierOpcode, _UpdatingOpcode7);

    function UpdateDynamicModifierOpcode(tag, instance, instanceRef) {
      var _this9;

      _this9 = _UpdatingOpcode7.call(this) || this;
      _this9.tag = tag;
      _this9.instance = instance;
      _this9.instanceRef = instanceRef;
      _this9.type = 'update-dynamic-modifier';
      _this9.lastUpdated = (0, _validator.valueForTag)(tag !== null && tag !== void 0 ? tag : _validator.CURRENT_TAG);
      return _this9;
    }

    var _proto30 = UpdateDynamicModifierOpcode.prototype;

    _proto30.evaluate = function evaluate(vm) {
      var tag = this.tag,
          lastUpdated = this.lastUpdated,
          instance = this.instance,
          instanceRef = this.instanceRef;
      var newInstance = (0, _reference.valueForRef)(instanceRef);

      if (newInstance !== instance) {
        if (instance !== undefined) {
          var destroyable = instance.manager.getDestroyable(instance.state);

          if (destroyable !== null) {
            (0, _destroyable2.destroy)(destroyable);
          }
        }

        if (newInstance !== undefined) {
          var manager = newInstance.manager,
              state = newInstance.state;

          var _destroyable = manager.getDestroyable(state);

          if (_destroyable !== null) {
            (0, _destroyable2.associateDestroyableChild)(this, _destroyable);
          }

          tag = manager.getTag(state);

          if (tag !== null) {
            this.lastUpdated = (0, _validator.valueForTag)(tag);
          }

          this.tag = tag;
          vm.env.scheduleInstallModifier(newInstance);
        }

        this.instance = newInstance;
      } else if (tag !== null && !(0, _validator.validateTag)(tag, lastUpdated)) {
        vm.env.scheduleUpdateModifier(instance);
        this.lastUpdated = (0, _validator.valueForTag)(tag);
      }

      if (tag !== null) {
        (0, _validator.consumeTag)(tag);
      }
    };

    return UpdateDynamicModifierOpcode;
  }(UpdatingOpcode);

  APPEND_OPCODES.add(51
  /* StaticAttr */
  , function (vm, _ref30) {
    var _name = _ref30.op1,
        _value = _ref30.op2,
        _namespace = _ref30.op3;
    var name = vm[CONSTANTS].getValue(_name);
    var value = vm[CONSTANTS].getValue(_value);
    var namespace = _namespace ? vm[CONSTANTS].getValue(_namespace) : null;
    vm.elements().setStaticAttribute(name, value, namespace);
  });
  APPEND_OPCODES.add(52
  /* DynamicAttr */
  , function (vm, _ref31) {
    var _name = _ref31.op1,
        _trusting = _ref31.op2,
        _namespace = _ref31.op3;
    var name = vm[CONSTANTS].getValue(_name);
    var trusting = vm[CONSTANTS].getValue(_trusting);
    var reference = vm.stack.popJs();
    var value = (0, _reference.valueForRef)(reference);
    var namespace = _namespace ? vm[CONSTANTS].getValue(_namespace) : null;
    var attribute = vm.elements().setDynamicAttribute(name, value, trusting, namespace);

    if (!(0, _reference.isConstRef)(reference)) {
      vm.updateWith(new UpdateDynamicAttributeOpcode(reference, attribute, vm.env));
    }
  });

  var UpdateDynamicAttributeOpcode = /*#__PURE__*/function (_UpdatingOpcode8) {
    (0, _emberBabel.inheritsLoose)(UpdateDynamicAttributeOpcode, _UpdatingOpcode8);

    function UpdateDynamicAttributeOpcode(reference, attribute, env) {
      var _this10;

      _this10 = _UpdatingOpcode8.call(this) || this;
      _this10.type = 'patch-element';
      var initialized = false;
      _this10.updateRef = (0, _reference.createComputeRef)(function () {
        var value = (0, _reference.valueForRef)(reference);

        if (initialized === true) {
          attribute.update(value, env);
        } else {
          initialized = true;
        }
      });
      (0, _reference.valueForRef)(_this10.updateRef);
      return _this10;
    }

    var _proto31 = UpdateDynamicAttributeOpcode.prototype;

    _proto31.evaluate = function evaluate() {
      (0, _reference.valueForRef)(this.updateRef);
    };

    return UpdateDynamicAttributeOpcode;
  }(UpdatingOpcode);

  APPEND_OPCODES.add(78
  /* PushComponentDefinition */
  , function (vm, _ref32) {
    var handle = _ref32.op1;
    var definition = vm[CONSTANTS].getValue(handle);
    var manager = definition.manager,
        capabilities = definition.capabilities;
    var instance = {
      definition: definition,
      manager: manager,
      capabilities: capabilities,
      state: null,
      handle: null,
      table: null,
      lookup: null
    };
    vm.stack.pushJs(instance);
  });
  APPEND_OPCODES.add(80
  /* ResolveDynamicComponent */
  , function (vm, _ref33) {
    var _isStrict = _ref33.op1;
    var stack = vm.stack;
    var component = (0, _reference.valueForRef)(stack.popJs());
    var constants$$1 = vm[CONSTANTS];
    var owner = vm.getOwner();
    var isStrict = constants$$1.getValue(_isStrict);
    vm.loadValue(_vm2.$t1, null); // Clear the temp register

    var definition;

    if (typeof component === 'string') {
      if (false
      /* DEBUG */
      && isStrict) {
        throw new Error("Attempted to resolve a dynamic component with a string definition, `" + component + "` in a strict mode template. In strict mode, using strings to resolve component definitions is prohibited. You can instead import the component definition and use it directly.");
      }

      var resolvedDefinition = resolveComponent(vm.runtime.resolver, constants$$1, component, owner);
      definition = resolvedDefinition;
    } else if (isCurriedValue(component)) {
      definition = component;
    } else {
      definition = constants$$1.component(component, owner);
    }

    stack.pushJs(definition);
  });
  APPEND_OPCODES.add(81
  /* ResolveCurriedComponent */
  , function (vm) {
    var stack = vm.stack;
    var ref = stack.popJs();
    var value = (0, _reference.valueForRef)(ref);
    var constants$$1 = vm[CONSTANTS];
    var definition;

    if (false
    /* DEBUG */
    && !(typeof value === 'function' || typeof value === 'object' && value !== null)) {
      throw new Error("Expected a component definition, but received " + value + ". You may have accidentally done <" + ref.debugLabel + ">, where \"" + ref.debugLabel + "\" was a string instead of a curried component definition. You must either use the component definition directly, or use the {{component}} helper to create a curried component definition when invoking dynamically.");
    }

    if (isCurriedValue(value)) {
      definition = value;
    } else {
      definition = constants$$1.component(value, vm.getOwner(), true);

      if (false
      /* DEBUG */
      && definition === null) {
        throw new Error("Expected a dynamic component definition, but received an object or function that did not have a component manager associated with it. The dynamic invocation was `<" + ref.debugLabel + ">` or `{{" + ref.debugLabel + "}}`, and the incorrect definition is the value at the path `" + ref.debugLabel + "`, which was: " + (0, _util.debugToString)(value));
      }
    }

    stack.pushJs(definition);
  });
  APPEND_OPCODES.add(79
  /* PushDynamicComponentInstance */
  , function (vm) {
    var stack = vm.stack;
    var definition = stack.pop();
    var capabilities, manager;

    if (isCurriedValue(definition)) {
      manager = capabilities = null;
    } else {
      manager = definition.manager;
      capabilities = definition.capabilities;
    }

    stack.pushJs({
      definition: definition,
      capabilities: capabilities,
      manager: manager,
      state: null,
      handle: null,
      table: null
    });
  });
  APPEND_OPCODES.add(82
  /* PushArgs */
  , function (vm, _ref34) {
    var _names = _ref34.op1,
        _blockNames = _ref34.op2,
        flags = _ref34.op3;
    var stack = vm.stack;
    var names = vm[CONSTANTS].getArray(_names);
    var positionalCount = flags >> 4;
    var atNames = flags & 8;
    var blockNames = flags & 7 ? vm[CONSTANTS].getArray(_blockNames) : _util.EMPTY_STRING_ARRAY;
    vm[ARGS].setup(stack, names, blockNames, positionalCount, !!atNames);
    stack.pushJs(vm[ARGS]);
  });
  APPEND_OPCODES.add(83
  /* PushEmptyArgs */
  , function (vm) {
    var stack = vm.stack;
    stack.pushJs(vm[ARGS].empty(stack));
  });
  APPEND_OPCODES.add(86
  /* CaptureArgs */
  , function (vm) {
    var stack = vm.stack;
    var args = stack.popJs();
    var capturedArgs = args.capture();
    stack.pushJs(capturedArgs);
  });
  APPEND_OPCODES.add(85
  /* PrepareArgs */
  , function (vm, _ref35) {
    var _state = _ref35.op1;
    var stack = vm.stack;
    var instance = vm.fetchValue(_state);
    var args = stack.popJs();
    var definition = instance.definition;

    if (isCurriedType(definition, 0
    /* Component */
    )) {
      var constants$$1 = vm[CONSTANTS];

      var _resolveCurriedValue3 = resolveCurriedValue(definition),
          resolvedDefinition = _resolveCurriedValue3.definition,
          owner = _resolveCurriedValue3.owner,
          resolved = _resolveCurriedValue3.resolved,
          positional = _resolveCurriedValue3.positional,
          named = _resolveCurriedValue3.named;

      if (resolved === true) {
        definition = resolvedDefinition;
      } else if (typeof resolvedDefinition === 'string') {
        var resolvedValue = vm.runtime.resolver.lookupComponent(resolvedDefinition, owner);
        definition = constants$$1.resolvedComponent(resolvedValue, resolvedDefinition);
      } else {
        definition = constants$$1.component(resolvedDefinition, owner);
      }

      if (named !== undefined) {
        args.named.merge(_util.assign.apply(void 0, [{}].concat(named)));
      }

      if (positional !== undefined) {
        args.realloc(positional.length);
        args.positional.prepend(positional);
      }

      var _definition = definition,
          _manager = _definition.manager;
      instance.definition = definition;
      instance.manager = _manager;
      instance.capabilities = definition.capabilities; // Save off the owner that this component was curried with. Later on,
      // we'll fetch the value of this register and set it as the owner on the
      // new root scope.

      vm.loadValue(_vm2.$t1, owner);
    }

    var _definition2 = definition,
        manager = _definition2.manager,
        state = _definition2.state;
    var capabilities = instance.capabilities;

    if (!(0, _manager5.managerHasCapability)(manager, capabilities, 4
    /* PrepareArgs */
    )) {
      stack.pushJs(args);
      return;
    }

    var blocks = args.blocks.values;
    var blockNames = args.blocks.names;
    var preparedArgs = manager.prepareArgs(state, args);

    if (preparedArgs) {
      args.clear();

      for (var i = 0; i < blocks.length; i++) {
        var block = blocks[i];

        if (typeof block === 'number') {
          stack.pushSmallInt(block);
        } else {
          stack.pushJs(block);
        }
      }

      var _positional = preparedArgs.positional,
          _named = preparedArgs.named;
      var positionalCount = _positional.length;

      for (var _i = 0; _i < positionalCount; _i++) {
        stack.pushJs(_positional[_i]);
      }

      var names = Object.keys(_named);

      for (var _i2 = 0; _i2 < names.length; _i2++) {
        stack.pushJs(_named[names[_i2]]);
      }

      args.setup(stack, names, blockNames, positionalCount, false);
    }

    stack.pushJs(args);
  });
  APPEND_OPCODES.add(87
  /* CreateComponent */
  , function (vm, _ref36) {
    var flags = _ref36.op1,
        _state = _ref36.op2;
    var instance = vm.fetchValue(_state);
    var definition = instance.definition,
        manager = instance.manager,
        capabilities = instance.capabilities;

    if (!(0, _manager5.managerHasCapability)(manager, capabilities, 512
    /* CreateInstance */
    )) {
      // TODO: Closure and Main components are always invoked dynamically, so this
      // opcode may run even if this capability is not enabled. In the future we
      // should handle this in a better way.
      return;
    }

    var dynamicScope = null;

    if ((0, _manager5.managerHasCapability)(manager, capabilities, 64
    /* DynamicScope */
    )) {
      dynamicScope = vm.dynamicScope();
    }

    var hasDefaultBlock = flags & 1;
    var args = null;

    if ((0, _manager5.managerHasCapability)(manager, capabilities, 8
    /* CreateArgs */
    )) {
      args = vm.stack.peekJs();
    }

    var self = null;

    if ((0, _manager5.managerHasCapability)(manager, capabilities, 128
    /* CreateCaller */
    )) {
      self = vm.getSelf();
    }

    var state = manager.create(vm.getOwner(), definition.state, args, vm.env, dynamicScope, self, !!hasDefaultBlock); // We want to reuse the `state` POJO here, because we know that the opcodes
    // only transition at exactly one place.

    instance.state = state;

    if ((0, _manager5.managerHasCapability)(manager, capabilities, 256
    /* UpdateHook */
    )) {
      vm.updateWith(new UpdateComponentOpcode(state, manager, dynamicScope));
    }
  });
  APPEND_OPCODES.add(88
  /* RegisterComponentDestructor */
  , function (vm, _ref37) {
    var _state = _ref37.op1;

    var _vm$fetchValue = vm.fetchValue(_state),
        manager = _vm$fetchValue.manager,
        state = _vm$fetchValue.state,
        capabilities = _vm$fetchValue.capabilities;

    var d = manager.getDestroyable(state);

    if (false
    /* DEBUG */
    && !(0, _manager5.managerHasCapability)(manager, capabilities, 2048
    /* WillDestroy */
    ) && d !== null && typeof 'willDestroy' in d) {
      throw new Error('BUG: Destructor has willDestroy, but the willDestroy capability was not enabled for this component. Pre-destruction hooks must be explicitly opted into');
    }

    if (d) vm.associateDestroyable(d);
  });
  APPEND_OPCODES.add(97
  /* BeginComponentTransaction */
  , function (vm, _ref38) {
    var _state = _ref38.op1;

    var _a;

    var name;

    if (false
    /* DEBUG */
    ) {
      var _vm$fetchValue2 = vm.fetchValue(_state),
          definition = _vm$fetchValue2.definition,
          manager = _vm$fetchValue2.manager;

      name = (_a = definition.resolvedName) !== null && _a !== void 0 ? _a : manager.getDebugName(definition.state);
    }

    vm.beginCacheGroup(name);
    vm.elements().pushSimpleBlock();
  });
  APPEND_OPCODES.add(89
  /* PutComponentOperations */
  , function (vm) {
    vm.loadValue(_vm2.$t0, new ComponentElementOperations());
  });
  APPEND_OPCODES.add(53
  /* ComponentAttr */
  , function (vm, _ref39) {
    var _name = _ref39.op1,
        _trusting = _ref39.op2,
        _namespace = _ref39.op3;
    var name = vm[CONSTANTS].getValue(_name);
    var trusting = vm[CONSTANTS].getValue(_trusting);
    var reference = vm.stack.popJs();
    var namespace = _namespace ? vm[CONSTANTS].getValue(_namespace) : null;
    vm.fetchValue(_vm2.$t0).setAttribute(name, reference, trusting, namespace);
  });
  APPEND_OPCODES.add(105
  /* StaticComponentAttr */
  , function (vm, _ref40) {
    var _name = _ref40.op1,
        _value = _ref40.op2,
        _namespace = _ref40.op3;
    var name = vm[CONSTANTS].getValue(_name);
    var value = vm[CONSTANTS].getValue(_value);
    var namespace = _namespace ? vm[CONSTANTS].getValue(_namespace) : null;
    vm.fetchValue(_vm2.$t0).setStaticAttribute(name, value, namespace);
  });

  var ComponentElementOperations = /*#__PURE__*/function () {
    function ComponentElementOperations() {
      this.attributes = (0, _util.dict)();
      this.classes = [];
      this.modifiers = [];
    }

    var _proto32 = ComponentElementOperations.prototype;

    _proto32.setAttribute = function setAttribute(name, value, trusting, namespace) {
      var deferred = {
        value: value,
        namespace: namespace,
        trusting: trusting
      };

      if (name === 'class') {
        this.classes.push(value);
      }

      this.attributes[name] = deferred;
    };

    _proto32.setStaticAttribute = function setStaticAttribute(name, value, namespace) {
      var deferred = {
        value: value,
        namespace: namespace
      };

      if (name === 'class') {
        this.classes.push(value);
      }

      this.attributes[name] = deferred;
    };

    _proto32.addModifier = function addModifier(modifier) {
      this.modifiers.push(modifier);
    };

    _proto32.flush = function flush(vm) {
      var type;
      var attributes = this.attributes;

      for (var name in this.attributes) {
        if (name === 'type') {
          type = attributes[name];
          continue;
        }

        var attr = this.attributes[name];

        if (name === 'class') {
          setDeferredAttr(vm, 'class', mergeClasses(this.classes), attr.namespace, attr.trusting);
        } else {
          setDeferredAttr(vm, name, attr.value, attr.namespace, attr.trusting);
        }
      }

      if (type !== undefined) {
        setDeferredAttr(vm, 'type', type.value, type.namespace, type.trusting);
      }

      return this.modifiers;
    };

    return ComponentElementOperations;
  }();

  function mergeClasses(classes) {
    if (classes.length === 0) {
      return '';
    }

    if (classes.length === 1) {
      return classes[0];
    }

    if (allStringClasses(classes)) {
      return classes.join(' ');
    }

    return createClassListRef(classes);
  }

  function allStringClasses(classes) {
    for (var i = 0; i < classes.length; i++) {
      if (typeof classes[i] !== 'string') {
        return false;
      }
    }

    return true;
  }

  function setDeferredAttr(vm, name, value, namespace, trusting) {
    if (trusting === void 0) {
      trusting = false;
    }

    if (typeof value === 'string') {
      vm.elements().setStaticAttribute(name, value, namespace);
    } else {
      var attribute = vm.elements().setDynamicAttribute(name, (0, _reference.valueForRef)(value), trusting, namespace);

      if (!(0, _reference.isConstRef)(value)) {
        vm.updateWith(new UpdateDynamicAttributeOpcode(value, attribute, vm.env));
      }
    }
  }

  APPEND_OPCODES.add(99
  /* DidCreateElement */
  , function (vm, _ref41) {
    var _state = _ref41.op1;

    var _vm$fetchValue3 = vm.fetchValue(_state),
        definition = _vm$fetchValue3.definition,
        state = _vm$fetchValue3.state;

    var manager = definition.manager;
    var operations = vm.fetchValue(_vm2.$t0);
    manager.didCreateElement(state, vm.elements().constructing, operations);
  });
  APPEND_OPCODES.add(90
  /* GetComponentSelf */
  , function (vm, _ref42) {
    var _state = _ref42.op1,
        _names = _ref42.op2;

    var _a;

    var instance = vm.fetchValue(_state);
    var definition = instance.definition,
        state = instance.state;
    var manager = definition.manager;
    var selfRef = manager.getSelf(state);

    if (vm.env.debugRenderTree !== undefined) {
      var _instance = vm.fetchValue(_state);

      var _definition3 = _instance.definition,
          _manager2 = _instance.manager;
      var args;

      if (vm.stack.peek() === vm[ARGS]) {
        args = vm[ARGS].capture();
      } else {
        var names = vm[CONSTANTS].getArray(_names);
        vm[ARGS].setup(vm.stack, names, [], 0, true);
        args = vm[ARGS].capture();
      }

      var moduleName;
      var compilable = _definition3.compilable;

      if (compilable === null) {
        compilable = _manager2.getDynamicLayout(state, vm.runtime.resolver);

        if (compilable !== null) {
          moduleName = compilable.moduleName;
        } else {
          moduleName = '__default__.hbs';
        }
      } else {
        moduleName = compilable.moduleName;
      } // For tearing down the debugRenderTree


      vm.associateDestroyable(_instance);

      if (hasCustomDebugRenderTreeLifecycle(_manager2)) {
        var nodes = _manager2.getDebugCustomRenderTree(_instance.definition.state, _instance.state, args, moduleName);

        nodes.forEach(function (node) {
          var bucket = node.bucket;
          vm.env.debugRenderTree.create(bucket, node);
          (0, _destroyable2.registerDestructor)(_instance, function () {
            var _a;

            (_a = vm.env.debugRenderTree) === null || _a === void 0 ? void 0 : _a.willDestroy(bucket);
          });
          vm.updateWith(new DebugRenderTreeUpdateOpcode(bucket));
        });
      } else {
        var name = (_a = _definition3.resolvedName) !== null && _a !== void 0 ? _a : _manager2.getDebugName(_definition3.state);
        vm.env.debugRenderTree.create(_instance, {
          type: 'component',
          name: name,
          args: args,
          template: moduleName,
          instance: (0, _reference.valueForRef)(selfRef)
        });
        vm.associateDestroyable(_instance);
        (0, _destroyable2.registerDestructor)(_instance, function () {
          var _a;

          (_a = vm.env.debugRenderTree) === null || _a === void 0 ? void 0 : _a.willDestroy(_instance);
        });
        vm.updateWith(new DebugRenderTreeUpdateOpcode(_instance));
      }
    }

    vm.stack.pushJs(selfRef);
  });
  APPEND_OPCODES.add(91
  /* GetComponentTagName */
  , function (vm, _ref43) {
    var _state = _ref43.op1;

    var _vm$fetchValue4 = vm.fetchValue(_state),
        definition = _vm$fetchValue4.definition,
        state = _vm$fetchValue4.state;

    var manager = definition.manager;
    var tagName = manager.getTagName(state); // User provided value from JS, so we don't bother to encode

    vm.stack.pushJs(tagName);
  }); // Dynamic Invocation Only

  APPEND_OPCODES.add(92
  /* GetComponentLayout */
  , function (vm, _ref44) {
    var _state = _ref44.op1;
    var instance = vm.fetchValue(_state);
    var manager = instance.manager,
        definition = instance.definition;
    var stack = vm.stack;
    var compilable = definition.compilable;

    if (compilable === null) {
      var capabilities = instance.capabilities;
      compilable = manager.getDynamicLayout(instance.state, vm.runtime.resolver);

      if (compilable === null) {
        if ((0, _manager5.managerHasCapability)(manager, capabilities, 1024
        /* Wrapped */
        )) {
          compilable = (0, _util.unwrapTemplate)(vm[CONSTANTS].defaultTemplate).asWrappedLayout();
        } else {
          compilable = (0, _util.unwrapTemplate)(vm[CONSTANTS].defaultTemplate).asLayout();
        }
      }
    }

    var handle = compilable.compile(vm.context);
    stack.pushJs(compilable.symbolTable);

    if (false
    /* DEBUG */
    && (0, _util.isErrHandle)(handle)) {
      stack.pushJs(handle);
    } else {
      stack.pushSmallInt(handle);
    }
  });
  APPEND_OPCODES.add(75
  /* Main */
  , function (vm, _ref45) {
    var register = _ref45.op1;
    var definition = vm.stack.popJs();
    var invocation = vm.stack.popJs();
    var manager = definition.manager,
        capabilities = definition.capabilities;
    var state = {
      definition: definition,
      manager: manager,
      capabilities: capabilities,
      state: null,
      handle: invocation.handle,
      table: invocation.symbolTable,
      lookup: null
    };
    vm.loadValue(register, state);
  });
  APPEND_OPCODES.add(95
  /* PopulateLayout */
  , function (vm, _ref46) {
    var _state = _ref46.op1;
    var stack = vm.stack; // In DEBUG handles could be ErrHandle objects

    var handle = false
    /* DEBUG */
    ? stack.pop() : stack.popSmallInt();
    var table = stack.popJs();
    var state = vm.fetchValue(_state);
    state.handle = handle;
    state.table = table;
  });
  APPEND_OPCODES.add(38
  /* VirtualRootScope */
  , function (vm, _ref47) {
    var _state = _ref47.op1;

    var _vm$fetchValue5 = vm.fetchValue(_state),
        table = _vm$fetchValue5.table,
        manager = _vm$fetchValue5.manager,
        capabilities = _vm$fetchValue5.capabilities,
        state = _vm$fetchValue5.state;

    var owner;

    if ((0, _manager5.managerHasCapability)(manager, capabilities, 4096
    /* HasSubOwner */
    )) {
      owner = manager.getOwner(state);
      vm.loadValue(_vm2.$t1, null); // Clear the temp register
    } else {
      // Check the temp register to see if an owner was resolved from currying
      owner = vm.fetchValue(_vm2.$t1);

      if (owner === null) {
        // If an owner wasn't found, default to using the current owner. This
        // will happen for normal dynamic component invocation,
        // e.g. <SomeClassicEmberComponent/>
        owner = vm.getOwner();
      } else {
        // Else the owner was found, so clear the temp register. This will happen
        // if we are loading a curried component, e.g. <@someCurriedComponent/>
        vm.loadValue(_vm2.$t1, null);
      }
    }

    vm.pushRootScope(table.symbols.length + 1, owner);
  });
  APPEND_OPCODES.add(94
  /* SetupForEval */
  , function (vm, _ref48) {
    var _state = _ref48.op1;
    var state = vm.fetchValue(_state);

    if (state.table.hasEval) {
      var lookup = state.lookup = (0, _util.dict)();
      vm.scope().bindEvalScope(lookup);
    }
  });
  APPEND_OPCODES.add(17
  /* SetNamedVariables */
  , function (vm, _ref49) {
    var _state = _ref49.op1;
    var state = vm.fetchValue(_state);
    var scope = vm.scope();
    var args = vm.stack.peekJs();
    var callerNames = args.named.atNames;

    for (var i = callerNames.length - 1; i >= 0; i--) {
      var atName = callerNames[i];
      var symbol$$1 = state.table.symbols.indexOf(callerNames[i]);
      var value = args.named.get(atName, true);
      if (symbol$$1 !== -1) scope.bindSymbol(symbol$$1 + 1, value);
      if (state.lookup) state.lookup[atName] = value;
    }
  });

  function bindBlock(symbolName, blockName, state, blocks, vm) {
    var symbol$$1 = state.table.symbols.indexOf(symbolName);
    var block = blocks.get(blockName);
    if (symbol$$1 !== -1) vm.scope().bindBlock(symbol$$1 + 1, block);
    if (state.lookup) state.lookup[symbolName] = block;
  }

  APPEND_OPCODES.add(18
  /* SetBlocks */
  , function (vm, _ref50) {
    var _state = _ref50.op1;
    var state = vm.fetchValue(_state);

    var _vm$stack$peekJs = vm.stack.peekJs(),
        blocks = _vm$stack$peekJs.blocks;

    for (var i = 0; i < blocks.names.length; i++) {
      bindBlock(blocks.symbolNames[i], blocks.names[i], state, blocks, vm);
    }
  }); // Dynamic Invocation Only

  APPEND_OPCODES.add(96
  /* InvokeComponentLayout */
  , function (vm, _ref51) {
    var _state = _ref51.op1;
    var state = vm.fetchValue(_state);
    vm.call(state.handle);
  });
  APPEND_OPCODES.add(100
  /* DidRenderLayout */
  , function (vm, _ref52) {
    var _state = _ref52.op1;
    var instance = vm.fetchValue(_state);
    var manager = instance.manager,
        state = instance.state,
        capabilities = instance.capabilities;
    var bounds = vm.elements().popBlock();

    if (vm.env.debugRenderTree !== undefined) {
      if (hasCustomDebugRenderTreeLifecycle(manager)) {
        var nodes = manager.getDebugCustomRenderTree(instance.definition.state, state, EMPTY_ARGS);
        nodes.reverse().forEach(function (node) {
          var bucket = node.bucket;
          vm.env.debugRenderTree.didRender(bucket, bounds);
          vm.updateWith(new DebugRenderTreeDidRenderOpcode(bucket, bounds));
        });
      } else {
        vm.env.debugRenderTree.didRender(instance, bounds);
        vm.updateWith(new DebugRenderTreeDidRenderOpcode(instance, bounds));
      }
    }

    if ((0, _manager5.managerHasCapability)(manager, capabilities, 512
    /* CreateInstance */
    )) {
      var mgr = manager;
      mgr.didRenderLayout(state, bounds);
      vm.env.didCreate(instance);
      vm.updateWith(new DidUpdateLayoutOpcode(instance, bounds));
    }
  });
  APPEND_OPCODES.add(98
  /* CommitComponentTransaction */
  , function (vm) {
    vm.commitCacheGroup();
  });

  var UpdateComponentOpcode = /*#__PURE__*/function (_UpdatingOpcode9) {
    (0, _emberBabel.inheritsLoose)(UpdateComponentOpcode, _UpdatingOpcode9);

    function UpdateComponentOpcode(component, manager, dynamicScope) {
      var _this11;

      _this11 = _UpdatingOpcode9.call(this) || this;
      _this11.component = component;
      _this11.manager = manager;
      _this11.dynamicScope = dynamicScope;
      _this11.type = 'update-component';
      return _this11;
    }

    var _proto33 = UpdateComponentOpcode.prototype;

    _proto33.evaluate = function evaluate(_vm) {
      var component = this.component,
          manager = this.manager,
          dynamicScope = this.dynamicScope;
      manager.update(component, dynamicScope);
    };

    return UpdateComponentOpcode;
  }(UpdatingOpcode);

  var DidUpdateLayoutOpcode = /*#__PURE__*/function (_UpdatingOpcode10) {
    (0, _emberBabel.inheritsLoose)(DidUpdateLayoutOpcode, _UpdatingOpcode10);

    function DidUpdateLayoutOpcode(component, bounds) {
      var _this12;

      _this12 = _UpdatingOpcode10.call(this) || this;
      _this12.component = component;
      _this12.bounds = bounds;
      _this12.type = 'did-update-layout';
      return _this12;
    }

    var _proto34 = DidUpdateLayoutOpcode.prototype;

    _proto34.evaluate = function evaluate(vm) {
      var component = this.component,
          bounds = this.bounds;
      var manager = component.manager,
          state = component.state;
      manager.didUpdateLayout(state, bounds);
      vm.env.didUpdate(component);
    };

    return DidUpdateLayoutOpcode;
  }(UpdatingOpcode);

  var DebugRenderTreeUpdateOpcode = /*#__PURE__*/function (_UpdatingOpcode11) {
    (0, _emberBabel.inheritsLoose)(DebugRenderTreeUpdateOpcode, _UpdatingOpcode11);

    function DebugRenderTreeUpdateOpcode(bucket) {
      var _this13;

      _this13 = _UpdatingOpcode11.call(this) || this;
      _this13.bucket = bucket;
      _this13.type = 'debug-render-tree-update';
      return _this13;
    }

    var _proto35 = DebugRenderTreeUpdateOpcode.prototype;

    _proto35.evaluate = function evaluate(vm) {
      var _a;

      (_a = vm.env.debugRenderTree) === null || _a === void 0 ? void 0 : _a.update(this.bucket);
    };

    return DebugRenderTreeUpdateOpcode;
  }(UpdatingOpcode);

  var DebugRenderTreeDidRenderOpcode = /*#__PURE__*/function (_UpdatingOpcode12) {
    (0, _emberBabel.inheritsLoose)(DebugRenderTreeDidRenderOpcode, _UpdatingOpcode12);

    function DebugRenderTreeDidRenderOpcode(bucket, bounds) {
      var _this14;

      _this14 = _UpdatingOpcode12.call(this) || this;
      _this14.bucket = bucket;
      _this14.bounds = bounds;
      _this14.type = 'debug-render-tree-did-render';
      return _this14;
    }

    var _proto36 = DebugRenderTreeDidRenderOpcode.prototype;

    _proto36.evaluate = function evaluate(vm) {
      var _a;

      (_a = vm.env.debugRenderTree) === null || _a === void 0 ? void 0 : _a.didRender(this.bucket, this.bounds);
    };

    return DebugRenderTreeDidRenderOpcode;
  }(UpdatingOpcode);

  var DynamicTextContent = /*#__PURE__*/function (_UpdatingOpcode13) {
    (0, _emberBabel.inheritsLoose)(DynamicTextContent, _UpdatingOpcode13);

    function DynamicTextContent(node, reference, lastValue) {
      var _this15;

      _this15 = _UpdatingOpcode13.call(this) || this;
      _this15.node = node;
      _this15.reference = reference;
      _this15.lastValue = lastValue;
      _this15.type = 'dynamic-text';
      return _this15;
    }

    var _proto37 = DynamicTextContent.prototype;

    _proto37.evaluate = function evaluate() {
      var value = (0, _reference.valueForRef)(this.reference);
      var lastValue = this.lastValue;
      if (value === lastValue) return;
      var normalized;

      if (isEmpty(value)) {
        normalized = '';
      } else if (isString(value)) {
        normalized = value;
      } else {
        normalized = String(value);
      }

      if (normalized !== lastValue) {
        var textNode = this.node;
        textNode.nodeValue = this.lastValue = normalized;
      }
    };

    return DynamicTextContent;
  }(UpdatingOpcode);

  function toContentType(value) {
    if (shouldCoerce(value)) {
      return 2
      /* String */
      ;
    } else if (isCurriedType(value, 0
    /* Component */
    ) || (0, _manager5.hasInternalComponentManager)(value)) {
      return 0
      /* Component */
      ;
    } else if (isCurriedType(value, 1
    /* Helper */
    ) || (0, _manager5.hasInternalHelperManager)(value)) {
      return 1
      /* Helper */
      ;
    } else if (isSafeString(value)) {
      return 4
      /* SafeString */
      ;
    } else if (isFragment(value)) {
      return 5
      /* Fragment */
      ;
    } else if (isNode(value)) {
      return 6
      /* Node */
      ;
    } else {
      return 2
      /* String */
      ;
    }
  }

  function toDynamicContentType(value) {
    if (!(0, _util.isObject)(value)) {
      return 2
      /* String */
      ;
    }

    if (isCurriedType(value, 0
    /* Component */
    ) || (0, _manager5.hasInternalComponentManager)(value)) {
      return 0
      /* Component */
      ;
    } else {
      if (false
      /* DEBUG */
      && !isCurriedType(value, 1
      /* Helper */
      ) && !(0, _manager5.hasInternalHelperManager)(value)) {
        throw new Error("Attempted use a dynamic value as a component or helper, but that value did not have an associated component or helper manager. The value was: " + value);
      }

      return 1
      /* Helper */
      ;
    }
  }

  APPEND_OPCODES.add(76
  /* ContentType */
  , function (vm) {
    var reference = vm.stack.peek();
    vm.stack.pushSmallInt(toContentType((0, _reference.valueForRef)(reference)));

    if (!(0, _reference.isConstRef)(reference)) {
      vm.updateWith(new AssertFilter(reference, toContentType));
    }
  });
  APPEND_OPCODES.add(106
  /* DynamicContentType */
  , function (vm) {
    var reference = vm.stack.peek();
    vm.stack.pushSmallInt(toDynamicContentType((0, _reference.valueForRef)(reference)));

    if (!(0, _reference.isConstRef)(reference)) {
      vm.updateWith(new AssertFilter(reference, toDynamicContentType));
    }
  });
  APPEND_OPCODES.add(43
  /* AppendHTML */
  , function (vm) {
    var reference = vm.stack.popJs();
    var rawValue = (0, _reference.valueForRef)(reference);
    var value = isEmpty(rawValue) ? '' : String(rawValue);
    vm.elements().appendDynamicHTML(value);
  });
  APPEND_OPCODES.add(44
  /* AppendSafeHTML */
  , function (vm) {
    var reference = vm.stack.popJs();
    var rawValue = (0, _reference.valueForRef)(reference).toHTML();
    var value = isEmpty(rawValue) ? '' : rawValue;
    vm.elements().appendDynamicHTML(value);
  });
  APPEND_OPCODES.add(47
  /* AppendText */
  , function (vm) {
    var reference = vm.stack.popJs();
    var rawValue = (0, _reference.valueForRef)(reference);
    var value = isEmpty(rawValue) ? '' : String(rawValue);
    var node = vm.elements().appendDynamicText(value);

    if (!(0, _reference.isConstRef)(reference)) {
      vm.updateWith(new DynamicTextContent(node, reference, value));
    }
  });
  APPEND_OPCODES.add(45
  /* AppendDocumentFragment */
  , function (vm) {
    var reference = vm.stack.popJs();
    var value = (0, _reference.valueForRef)(reference);
    vm.elements().appendDynamicFragment(value);
  });
  APPEND_OPCODES.add(46
  /* AppendNode */
  , function (vm) {
    var reference = vm.stack.popJs();
    var value = (0, _reference.valueForRef)(reference);
    vm.elements().appendDynamicNode(value);
  });

  function debugCallback(context, get) {
    // eslint-disable-next-line no-console
    console.info('Use `context`, and `get(<path>)` to debug this template.'); // for example...
    // eslint-disable-next-line no-unused-expressions

    context === get('this'); // eslint-disable-next-line no-debugger

    debugger;
  }

  var callback = debugCallback; // For testing purposes

  function setDebuggerCallback(cb) {
    callback = cb;
  }

  function resetDebuggerCallback() {
    callback = debugCallback;
  }

  var ScopeInspector = /*#__PURE__*/function () {
    function ScopeInspector(scope, symbols, evalInfo) {
      this.scope = scope;
      this.locals = (0, _util.dict)();

      for (var i = 0; i < evalInfo.length; i++) {
        var slot = evalInfo[i];
        var name = symbols[slot - 1];
        var ref = scope.getSymbol(slot);
        this.locals[name] = ref;
      }
    }

    var _proto38 = ScopeInspector.prototype;

    _proto38.get = function get(path) {
      var scope = this.scope,
          locals = this.locals;
      var parts = path.split('.');

      var _path$split = path.split('.'),
          head = _path$split[0],
          tail = _path$split.slice(1);

      var evalScope = scope.getEvalScope();
      var ref;

      if (head === 'this') {
        ref = scope.getSelf();
      } else if (locals[head]) {
        ref = locals[head];
      } else if (head.indexOf('@') === 0 && evalScope[head]) {
        ref = evalScope[head];
      } else {
        ref = this.scope.getSelf();
        tail = parts;
      }

      return tail.reduce(function (r, part) {
        return (0, _reference.childRefFor)(r, part);
      }, ref);
    };

    return ScopeInspector;
  }();

  APPEND_OPCODES.add(103
  /* Debugger */
  , function (vm, _ref53) {
    var _symbols = _ref53.op1,
        _evalInfo = _ref53.op2;
    var symbols = vm[CONSTANTS].getArray(_symbols);
    var evalInfo = vm[CONSTANTS].getArray((0, _util.decodeHandle)(_evalInfo));
    var inspector = new ScopeInspector(vm.scope(), symbols, evalInfo);
    callback((0, _reference.valueForRef)(vm.getSelf()), function (path) {
      return (0, _reference.valueForRef)(inspector.get(path));
    });
  });
  APPEND_OPCODES.add(101
  /* InvokePartial */
  , function (vm, _ref54) {
    var _symbols = _ref54.op1,
        _evalInfo = _ref54.op2;
    var constants$$1 = vm[CONSTANTS],
        stack = vm.stack;
    var name = (0, _reference.valueForRef)(stack.pop());
    var outerScope = vm.scope();
    var owner = outerScope.owner;
    var outerSymbols = constants$$1.getArray(_symbols);
    var evalInfo = constants$$1.getArray((0, _util.decodeHandle)(_evalInfo));
    var definition = vm.runtime.resolver.lookupPartial(name, owner);

    var _definition$getPartia = definition.getPartial(vm.context),
        symbolTable = _definition$getPartia.symbolTable,
        vmHandle = _definition$getPartia.handle;

    {
      var partialSymbols = symbolTable.symbols;
      var partialScope = vm.pushRootScope(partialSymbols.length, owner);
      var evalScope = outerScope.getEvalScope();
      partialScope.bindEvalScope(evalScope);
      partialScope.bindSelf(outerScope.getSelf());
      var locals = Object.create(outerScope.getPartialMap());

      for (var i = 0; i < evalInfo.length; i++) {
        var slot = evalInfo[i];

        if (slot !== -1) {
          var _name2 = outerSymbols[slot - 1];
          var ref = outerScope.getSymbol(slot);
          locals[_name2] = ref;
        }
      }

      if (evalScope) {
        for (var _i3 = 0; _i3 < partialSymbols.length; _i3++) {
          var _name3 = partialSymbols[_i3];
          var symbol$$1 = _i3 + 1;
          var value = evalScope[_name3];
          if (value !== undefined) partialScope.bind(symbol$$1, value);
        }
      }

      partialScope.bindPartialMap(locals);
      vm.pushFrame(); // sp += 2

      vm.call((0, _util.unwrapHandle)(vmHandle));
    }
  });
  APPEND_OPCODES.add(72
  /* EnterList */
  , function (vm, _ref55) {
    var relativeStart = _ref55.op1,
        elseTarget = _ref55.op2;
    var stack = vm.stack;
    var listRef = stack.popJs();
    var keyRef = stack.popJs();
    var keyValue = (0, _reference.valueForRef)(keyRef);
    var key = keyValue === null ? '@identity' : String(keyValue);
    var iteratorRef = (0, _reference.createIteratorRef)(listRef, key);
    var iterator = (0, _reference.valueForRef)(iteratorRef);
    vm.updateWith(new AssertFilter(iteratorRef, function (iterator) {
      return iterator.isEmpty();
    }));

    if (iterator.isEmpty() === true) {
      // TODO: Fix this offset, should be accurate
      vm.goto(elseTarget + 1);
    } else {
      vm.enterList(iteratorRef, relativeStart);
      vm.stack.pushJs(iterator);
    }
  });
  APPEND_OPCODES.add(73
  /* ExitList */
  , function (vm) {
    vm.exitList();
  });
  APPEND_OPCODES.add(74
  /* Iterate */
  , function (vm, _ref56) {
    var breaks = _ref56.op1;
    var stack = vm.stack;
    var iterator = stack.peekJs();
    var item = iterator.next();

    if (item !== null) {
      vm.registerItem(vm.enterItem(item));
    } else {
      vm.goto(breaks);
    }
  });
  var CAPABILITIES = {
    dynamicLayout: false,
    dynamicTag: false,
    prepareArgs: false,
    createArgs: false,
    attributeHook: false,
    elementHook: false,
    createCaller: false,
    dynamicScope: false,
    updateHook: false,
    createInstance: false,
    wrapped: false,
    willDestroy: false,
    hasSubOwner: false
  };

  var TemplateOnlyComponentManager = /*#__PURE__*/function () {
    function TemplateOnlyComponentManager() {}

    var _proto39 = TemplateOnlyComponentManager.prototype;

    _proto39.getCapabilities = function getCapabilities() {
      return CAPABILITIES;
    };

    _proto39.getDebugName = function getDebugName(_ref57) {
      var name = _ref57.name;
      return name;
    };

    _proto39.getSelf = function getSelf() {
      return _reference.NULL_REFERENCE;
    };

    _proto39.getDestroyable = function getDestroyable() {
      return null;
    };

    return TemplateOnlyComponentManager;
  }();

  _exports.TemplateOnlyComponentManager = TemplateOnlyComponentManager;
  var TEMPLATE_ONLY_COMPONENT_MANAGER = new TemplateOnlyComponentManager(); // This is only exported for types, don't use this class directly

  _exports.TEMPLATE_ONLY_COMPONENT_MANAGER = TEMPLATE_ONLY_COMPONENT_MANAGER;

  var TemplateOnlyComponentDefinition = /*#__PURE__*/function () {
    function TemplateOnlyComponentDefinition(moduleName, name) {
      if (moduleName === void 0) {
        moduleName = '@glimmer/component/template-only';
      }

      if (name === void 0) {
        name = '(unknown template-only component)';
      }

      this.moduleName = moduleName;
      this.name = name;
    }

    var _proto40 = TemplateOnlyComponentDefinition.prototype;

    _proto40.toString = function toString() {
      return this.moduleName;
    };

    return TemplateOnlyComponentDefinition;
  }();

  _exports.TemplateOnlyComponent = TemplateOnlyComponentDefinition;
  (0, _manager5.setInternalComponentManager)(TEMPLATE_ONLY_COMPONENT_MANAGER, TemplateOnlyComponentDefinition.prototype);
  /**
    This utility function is used to declare a given component has no backing class. When the rendering engine detects this it
    is able to perform a number of optimizations. Templates that are associated with `templateOnly()` will be rendered _as is_
    without adding a wrapping `<div>` (or any of the other element customization behaviors of [@ember/component](/ember/release/classes/Component)).
    Specifically, this means that the template will be rendered as "outer HTML".
  
    In general, this method will be used by build time tooling and would not be directly written in an application. However,
    at times it may be useful to use directly to leverage the "outer HTML" semantics mentioned above. For example, if an addon would like
    to use these semantics for its templates but cannot be certain it will only be consumed by applications that have enabled the
    `template-only-glimmer-components` optional feature.
  
    @example
  
    ```js
    import { templateOnlyComponent } from '@glimmer/runtime';
  
    export default templateOnlyComponent();
    ```
  
    @public
    @method templateOnly
    @param {String} moduleName the module name that the template only component represents, this will be used for debugging purposes
    @category EMBER_GLIMMER_SET_COMPONENT_TEMPLATE
  */

  function templateOnlyComponent(moduleName, name) {
    return new TemplateOnlyComponentDefinition(moduleName, name);
  } // http://www.w3.org/TR/html/syntax.html#html-integration-point


  var SVG_INTEGRATION_POINTS = {
    foreignObject: 1,
    desc: 1,
    title: 1
  }; // http://www.w3.org/TR/html/syntax.html#adjust-svg-attributes
  // TODO: Adjust SVG attributes
  // http://www.w3.org/TR/html/syntax.html#parsing-main-inforeign
  // TODO: Adjust SVG elements
  // http://www.w3.org/TR/html/syntax.html#parsing-main-inforeign

  var BLACKLIST_TABLE = Object.create(null);

  var DOMOperations = /*#__PURE__*/function () {
    function DOMOperations(document) {
      this.document = document;
      this.setupUselessElement();
    } // split into separate method so that NodeDOMTreeConstruction
    // can override it.


    var _proto41 = DOMOperations.prototype;

    _proto41.setupUselessElement = function setupUselessElement() {
      this.uselessElement = this.document.createElement('div');
    };

    _proto41.createElement = function createElement(tag, context) {
      var isElementInSVGNamespace, isHTMLIntegrationPoint;

      if (context) {
        isElementInSVGNamespace = context.namespaceURI === "http://www.w3.org/2000/svg"
        /* SVG */
        || tag === 'svg';
        isHTMLIntegrationPoint = !!SVG_INTEGRATION_POINTS[context.tagName];
      } else {
        isElementInSVGNamespace = tag === 'svg';
        isHTMLIntegrationPoint = false;
      }

      if (isElementInSVGNamespace && !isHTMLIntegrationPoint) {
        // FIXME: This does not properly handle <font> with color, face, or
        // size attributes, which is also disallowed by the spec. We should fix
        // this.
        if (BLACKLIST_TABLE[tag]) {
          throw new Error("Cannot create a " + tag + " inside an SVG context");
        }

        return this.document.createElementNS("http://www.w3.org/2000/svg"
        /* SVG */
        , tag);
      } else {
        return this.document.createElement(tag);
      }
    };

    _proto41.insertBefore = function insertBefore(parent, node, reference) {
      parent.insertBefore(node, reference);
    };

    _proto41.insertHTMLBefore = function insertHTMLBefore(parent, nextSibling, html) {
      if (html === '') {
        var comment = this.createComment('');
        parent.insertBefore(comment, nextSibling);
        return new ConcreteBounds(parent, comment, comment);
      }

      var prev = nextSibling ? nextSibling.previousSibling : parent.lastChild;
      var last;

      if (nextSibling === null) {
        parent.insertAdjacentHTML("beforeend"
        /* beforeend */
        , html);
        last = parent.lastChild;
      } else if (nextSibling instanceof HTMLElement) {
        nextSibling.insertAdjacentHTML('beforebegin', html);
        last = nextSibling.previousSibling;
      } else {
        // Non-element nodes do not support insertAdjacentHTML, so add an
        // element and call it on that element. Then remove the element.
        //
        // This also protects Edge, IE and Firefox w/o the inspector open
        // from merging adjacent text nodes. See ./compat/text-node-merging-fix.ts
        var uselessElement = this.uselessElement;
        parent.insertBefore(uselessElement, nextSibling);
        uselessElement.insertAdjacentHTML("beforebegin"
        /* beforebegin */
        , html);
        last = uselessElement.previousSibling;
        parent.removeChild(uselessElement);
      }

      var first = prev ? prev.nextSibling : parent.firstChild;
      return new ConcreteBounds(parent, first, last);
    };

    _proto41.createTextNode = function createTextNode(text) {
      return this.document.createTextNode(text);
    };

    _proto41.createComment = function createComment(data) {
      return this.document.createComment(data);
    };

    return DOMOperations;
  }();

  function moveNodesBefore(source, target, nextSibling) {
    var first = source.firstChild;
    var last = first;
    var current = first;

    while (current) {
      var next = current.nextSibling;
      target.insertBefore(current, nextSibling);
      last = current;
      current = next;
    }

    return new ConcreteBounds(target, first, last);
  }

  var SVG_NAMESPACE = "http://www.w3.org/2000/svg"
  /* SVG */
  ; // Patch:    insertAdjacentHTML on SVG Fix
  // Browsers: Safari, IE, Edge, Firefox ~33-34
  // Reason:   insertAdjacentHTML does not exist on SVG elements in Safari. It is
  //           present but throws an exception on IE and Edge. Old versions of
  //           Firefox create nodes in the incorrect namespace.
  // Fix:      Since IE and Edge silently fail to create SVG nodes using
  //           innerHTML, and because Firefox may create nodes in the incorrect
  //           namespace using innerHTML on SVG elements, an HTML-string wrapping
  //           approach is used. A pre/post SVG tag is added to the string, then
  //           that whole string is added to a div. The created nodes are plucked
  //           out and applied to the target location on DOM.

  function applySVGInnerHTMLFix(document, DOMClass, svgNamespace) {
    if (!document) return DOMClass;

    if (!shouldApplyFix(document, svgNamespace)) {
      return DOMClass;
    }

    var div = document.createElement('div');
    return /*#__PURE__*/function (_DOMClass) {
      (0, _emberBabel.inheritsLoose)(DOMChangesWithSVGInnerHTMLFix, _DOMClass);

      function DOMChangesWithSVGInnerHTMLFix() {
        return _DOMClass.apply(this, arguments) || this;
      }

      var _proto42 = DOMChangesWithSVGInnerHTMLFix.prototype;

      _proto42.insertHTMLBefore = function insertHTMLBefore(parent, nextSibling, html) {
        if (html === '') {
          return _DOMClass.prototype.insertHTMLBefore.call(this, parent, nextSibling, html);
        }

        if (parent.namespaceURI !== svgNamespace) {
          return _DOMClass.prototype.insertHTMLBefore.call(this, parent, nextSibling, html);
        }

        return fixSVG(parent, div, html, nextSibling);
      };

      return DOMChangesWithSVGInnerHTMLFix;
    }(DOMClass);
  }

  function fixSVG(parent, div, html, reference) {
    var source; // This is important, because descendants of the <foreignObject> integration
    // point are parsed in the HTML namespace

    if (parent.tagName.toUpperCase() === 'FOREIGNOBJECT') {
      // IE, Edge: also do not correctly support using `innerHTML` on SVG
      // namespaced elements. So here a wrapper is used.
      var wrappedHtml = '<svg><foreignObject>' + html + '</foreignObject></svg>';
      (0, _util.clearElement)(div);
      div.insertAdjacentHTML("afterbegin"
      /* afterbegin */
      , wrappedHtml);
      source = div.firstChild.firstChild;
    } else {
      // IE, Edge: also do not correctly support using `innerHTML` on SVG
      // namespaced elements. So here a wrapper is used.
      var _wrappedHtml = '<svg>' + html + '</svg>';

      (0, _util.clearElement)(div);
      div.insertAdjacentHTML("afterbegin"
      /* afterbegin */
      , _wrappedHtml);
      source = div.firstChild;
    }

    return moveNodesBefore(source, parent, reference);
  }

  function shouldApplyFix(document, svgNamespace) {
    var svg = document.createElementNS(svgNamespace, 'svg');

    try {
      svg.insertAdjacentHTML("beforeend"
      /* beforeend */
      , '<circle></circle>');
    } catch (e) {// IE, Edge: Will throw, insertAdjacentHTML is unsupported on SVG
      // Safari: Will throw, insertAdjacentHTML is not present on SVG
    } finally {
      // FF: Old versions will create a node in the wrong namespace
      if (svg.childNodes.length === 1 && svg.firstChild.namespaceURI === SVG_NAMESPACE) {
        // The test worked as expected, no fix required
        return false;
      }

      return true;
    }
  } // Patch:    Adjacent text node merging fix
  // Browsers: IE, Edge, Firefox w/o inspector open
  // Reason:   These browsers will merge adjacent text nodes. For example given
  //           <div>Hello</div> with div.insertAdjacentHTML(' world') browsers
  //           with proper behavior will populate div.childNodes with two items.
  //           These browsers will populate it with one merged node instead.
  // Fix:      Add these nodes to a wrapper element, then iterate the childNodes
  //           of that wrapper and move the nodes to their target location. Note
  //           that potential SVG bugs will have been handled before this fix.
  //           Note that this fix must only apply to the previous text node, as
  //           the base implementation of `insertHTMLBefore` already handles
  //           following text nodes correctly.


  function applyTextNodeMergingFix(document, DOMClass) {
    if (!document) return DOMClass;

    if (!shouldApplyFix$1(document)) {
      return DOMClass;
    }

    return /*#__PURE__*/function (_DOMClass2) {
      (0, _emberBabel.inheritsLoose)(DOMChangesWithTextNodeMergingFix, _DOMClass2);

      function DOMChangesWithTextNodeMergingFix(document) {
        var _this16;

        _this16 = _DOMClass2.call(this, document) || this;
        _this16.uselessComment = document.createComment('');
        return _this16;
      }

      var _proto43 = DOMChangesWithTextNodeMergingFix.prototype;

      _proto43.insertHTMLBefore = function insertHTMLBefore(parent, nextSibling, html) {
        if (html === '') {
          return _DOMClass2.prototype.insertHTMLBefore.call(this, parent, nextSibling, html);
        }

        var didSetUselessComment = false;
        var nextPrevious = nextSibling ? nextSibling.previousSibling : parent.lastChild;

        if (nextPrevious && nextPrevious instanceof Text) {
          didSetUselessComment = true;
          parent.insertBefore(this.uselessComment, nextSibling);
        }

        var bounds = _DOMClass2.prototype.insertHTMLBefore.call(this, parent, nextSibling, html);

        if (didSetUselessComment) {
          parent.removeChild(this.uselessComment);
        }

        return bounds;
      };

      return DOMChangesWithTextNodeMergingFix;
    }(DOMClass);
  }

  function shouldApplyFix$1(document) {
    var mergingTextDiv = document.createElement('div');
    mergingTextDiv.appendChild(document.createTextNode('first'));
    mergingTextDiv.insertAdjacentHTML("beforeend"
    /* beforeend */
    , 'second');

    if (mergingTextDiv.childNodes.length === 2) {
      // It worked as expected, no fix required
      return false;
    }

    return true;
  }

  ['b', 'big', 'blockquote', 'body', 'br', 'center', 'code', 'dd', 'div', 'dl', 'dt', 'em', 'embed', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'hr', 'i', 'img', 'li', 'listing', 'main', 'meta', 'nobr', 'ol', 'p', 'pre', 'ruby', 's', 'small', 'span', 'strong', 'strike', 'sub', 'sup', 'table', 'tt', 'u', 'ul', 'var'].forEach(function (tag) {
    return BLACKLIST_TABLE[tag] = 1;
  });
  var WHITESPACE = /[\t-\r \xA0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]/;
  var doc = typeof document === 'undefined' ? null : document;

  function isWhitespace(string) {
    return WHITESPACE.test(string);
  }

  var DOM;

  (function (DOM) {
    var TreeConstruction = /*#__PURE__*/function (_DOMOperations) {
      (0, _emberBabel.inheritsLoose)(TreeConstruction, _DOMOperations);

      function TreeConstruction() {
        return _DOMOperations.apply(this, arguments) || this;
      }

      var _proto44 = TreeConstruction.prototype;

      _proto44.createElementNS = function createElementNS(namespace, tag) {
        return this.document.createElementNS(namespace, tag);
      };

      _proto44.setAttribute = function setAttribute(element, name, value, namespace) {
        if (namespace === void 0) {
          namespace = null;
        }

        if (namespace) {
          element.setAttributeNS(namespace, name, value);
        } else {
          element.setAttribute(name, value);
        }
      };

      return TreeConstruction;
    }(DOMOperations);

    DOM.TreeConstruction = TreeConstruction;
    var appliedTreeConstruction = TreeConstruction;
    appliedTreeConstruction = applyTextNodeMergingFix(doc, appliedTreeConstruction);
    appliedTreeConstruction = applySVGInnerHTMLFix(doc, appliedTreeConstruction, "http://www.w3.org/2000/svg"
    /* SVG */
    );
    DOM.DOMTreeConstruction = appliedTreeConstruction;
  })(DOM || (DOM = {}));

  var DOMChangesImpl = /*#__PURE__*/function (_DOMOperations2) {
    (0, _emberBabel.inheritsLoose)(DOMChangesImpl, _DOMOperations2);

    function DOMChangesImpl(document) {
      var _this17;

      _this17 = _DOMOperations2.call(this, document) || this;
      _this17.document = document;
      _this17.namespace = null;
      return _this17;
    }

    var _proto45 = DOMChangesImpl.prototype;

    _proto45.setAttribute = function setAttribute(element, name, value) {
      element.setAttribute(name, value);
    };

    _proto45.removeAttribute = function removeAttribute(element, name) {
      element.removeAttribute(name);
    };

    _proto45.insertAfter = function insertAfter(element, node, reference) {
      this.insertBefore(element, node, reference.nextSibling);
    };

    return DOMChangesImpl;
  }(DOMOperations);

  _exports.IDOMChanges = DOMChangesImpl;
  var helper = DOMChangesImpl;
  helper = applyTextNodeMergingFix(doc, helper);
  helper = applySVGInnerHTMLFix(doc, helper, "http://www.w3.org/2000/svg"
  /* SVG */
  );
  var helper$1 = helper;
  _exports.DOMChanges = helper$1;
  var DOMTreeConstruction = DOM.DOMTreeConstruction;
  _exports.DOMTreeConstruction = DOMTreeConstruction;
  var GUID = 0;

  var Ref = /*#__PURE__*/function () {
    function Ref(value) {
      this.id = GUID++;
      this.value = value;
    }

    var _proto46 = Ref.prototype;

    _proto46.get = function get() {
      return this.value;
    };

    _proto46.release = function release() {
      if (false
      /* DEBUG */
      && this.value === null) {
        throw new Error('BUG: double release?');
      }

      this.value = null;
    };

    _proto46.toString = function toString() {
      var label = "Ref " + this.id;

      if (this.value === null) {
        return label + " (released)";
      } else {
        try {
          return label + ": " + this.value;
        } catch (_a) {
          return label;
        }
      }
    };

    return Ref;
  }();

  var DebugRenderTreeImpl = /*#__PURE__*/function () {
    function DebugRenderTreeImpl() {
      this.stack = new _util.Stack();
      this.refs = new WeakMap();
      this.roots = new Set();
      this.nodes = new WeakMap();
    }

    var _proto47 = DebugRenderTreeImpl.prototype;

    _proto47.begin = function begin() {
      this.reset();
    };

    _proto47.create = function create(state, node) {
      var internalNode = (0, _util.assign)({}, node, {
        bounds: null,
        refs: new Set()
      });
      this.nodes.set(state, internalNode);
      this.appendChild(internalNode, state);
      this.enter(state);
    };

    _proto47.update = function update(state) {
      this.enter(state);
    };

    _proto47.didRender = function didRender(state, bounds) {
      if (false
      /* DEBUG */
      && this.stack.current !== state) {
        throw new Error("BUG: expecting " + this.stack.current + ", got " + state);
      }

      this.nodeFor(state).bounds = bounds;
      this.exit();
    };

    _proto47.willDestroy = function willDestroy(state) {
      this.refs.get(state).release();
    };

    _proto47.commit = function commit() {
      this.reset();
    };

    _proto47.capture = function capture() {
      return this.captureRefs(this.roots);
    };

    _proto47.reset = function reset() {
      if (this.stack.size !== 0) {
        // We probably encountered an error during the rendering loop. This will
        // likely trigger undefined behavior and memory leaks as the error left
        // things in an inconsistent state. It is recommended that the user
        // refresh the page.
        // TODO: We could warn here? But this happens all the time in our tests?
        // Clean up the root reference to prevent errors from happening if we
        // attempt to capture the render tree (Ember Inspector may do this)
        var root = this.stack.toArray()[0];
        var ref = this.refs.get(root);

        if (ref !== undefined) {
          this.roots.delete(ref);
        }

        while (!this.stack.isEmpty()) {
          this.stack.pop();
        }
      }
    };

    _proto47.enter = function enter(state) {
      this.stack.push(state);
    };

    _proto47.exit = function exit() {
      if (false
      /* DEBUG */
      && this.stack.size === 0) {
        throw new Error('BUG: unbalanced pop');
      }

      this.stack.pop();
    };

    _proto47.nodeFor = function nodeFor(state) {
      return this.nodes.get(state);
    };

    _proto47.appendChild = function appendChild(node, state) {
      if (false
      /* DEBUG */
      && this.refs.has(state)) {
        throw new Error('BUG: child already appended');
      }

      var parent = this.stack.current;
      var ref = new Ref(state);
      this.refs.set(state, ref);

      if (parent) {
        var parentNode = this.nodeFor(parent);
        parentNode.refs.add(ref);
        node.parent = parentNode;
      } else {
        this.roots.add(ref);
      }
    };

    _proto47.captureRefs = function captureRefs(refs) {
      var _this18 = this;

      var captured = [];
      refs.forEach(function (ref) {
        var state = ref.get();

        if (state) {
          captured.push(_this18.captureNode("render-node:" + ref.id, state));
        } else {
          refs.delete(ref);
        }
      });
      return captured;
    };

    _proto47.captureNode = function captureNode(id, state) {
      var node = this.nodeFor(state);
      var type = node.type,
          name = node.name,
          args = node.args,
          instance = node.instance,
          refs = node.refs;
      var template = this.captureTemplate(node);
      var bounds = this.captureBounds(node);
      var children = this.captureRefs(refs);
      return {
        id: id,
        type: type,
        name: name,
        args: reifyArgs(args),
        instance: instance,
        template: template,
        bounds: bounds,
        children: children
      };
    };

    _proto47.captureTemplate = function captureTemplate(_ref58) {
      var template = _ref58.template;
      return template || null;
    };

    _proto47.captureBounds = function captureBounds(node) {
      var bounds = node.bounds;
      var parentElement = bounds.parentElement();
      var firstNode = bounds.firstNode();
      var lastNode = bounds.lastNode();
      return {
        parentElement: parentElement,
        firstNode: firstNode,
        lastNode: lastNode
      };
    };

    return DebugRenderTreeImpl;
  }();

  var _a$1;

  var TRANSACTION = (0, _util.symbol)('TRANSACTION');

  var TransactionImpl = /*#__PURE__*/function () {
    function TransactionImpl() {
      this.scheduledInstallModifiers = [];
      this.scheduledUpdateModifiers = [];
      this.createdComponents = [];
      this.updatedComponents = [];
    }

    var _proto48 = TransactionImpl.prototype;

    _proto48.didCreate = function didCreate(component) {
      this.createdComponents.push(component);
    };

    _proto48.didUpdate = function didUpdate(component) {
      this.updatedComponents.push(component);
    };

    _proto48.scheduleInstallModifier = function scheduleInstallModifier(modifier) {
      this.scheduledInstallModifiers.push(modifier);
    };

    _proto48.scheduleUpdateModifier = function scheduleUpdateModifier(modifier) {
      this.scheduledUpdateModifiers.push(modifier);
    };

    _proto48.commit = function commit() {
      var createdComponents = this.createdComponents,
          updatedComponents = this.updatedComponents;

      for (var i = 0; i < createdComponents.length; i++) {
        var _createdComponents$i = createdComponents[i],
            _manager3 = _createdComponents$i.manager,
            _state2 = _createdComponents$i.state;

        _manager3.didCreate(_state2);
      }

      for (var _i4 = 0; _i4 < updatedComponents.length; _i4++) {
        var _updatedComponents$_i = updatedComponents[_i4],
            _manager4 = _updatedComponents$_i.manager,
            _state3 = _updatedComponents$_i.state;

        _manager4.didUpdate(_state3);
      }

      var scheduledInstallModifiers = this.scheduledInstallModifiers,
          scheduledUpdateModifiers = this.scheduledUpdateModifiers; // Prevent a transpilation issue we guard against in Ember, the
      // throw-if-closure-required issue

      var manager, state;

      for (var _i5 = 0; _i5 < scheduledInstallModifiers.length; _i5++) {
        var modifier = scheduledInstallModifiers[_i5];
        manager = modifier.manager;
        state = modifier.state;
        var modifierTag = manager.getTag(state);

        if (modifierTag !== null) {
          var tag = (0, _validator.track)( // eslint-disable-next-line no-loop-func
          function () {
            return manager.install(state);
          }, false
          /* DEBUG */
          && "- While rendering:\n  (instance of a `" + (modifier.definition.resolvedName || manager.getDebugName(modifier.definition.state)) + "` modifier)");
          (0, _validator.updateTag)(modifierTag, tag);
        } else {
          manager.install(state);
        }
      }

      for (var _i6 = 0; _i6 < scheduledUpdateModifiers.length; _i6++) {
        var _modifier = scheduledUpdateModifiers[_i6];
        manager = _modifier.manager;
        state = _modifier.state;

        var _modifierTag = manager.getTag(state);

        if (_modifierTag !== null) {
          var _tag = (0, _validator.track)( // eslint-disable-next-line no-loop-func
          function () {
            return manager.update(state);
          }, false
          /* DEBUG */
          && "- While rendering:\n  (instance of a `" + (_modifier.definition.resolvedName || manager.getDebugName(_modifier.definition.state)) + "` modifier)");

          (0, _validator.updateTag)(_modifierTag, _tag);
        } else {
          manager.update(state);
        }
      }
    };

    return TransactionImpl;
  }();

  var EnvironmentImpl = /*#__PURE__*/function () {
    function EnvironmentImpl(options, delegate) {
      this.delegate = delegate;
      this[_a$1] = null; // Delegate methods and values

      this.isInteractive = this.delegate.isInteractive;
      this.debugRenderTree = this.delegate.enableDebugTooling ? new DebugRenderTreeImpl() : undefined;

      if (options.appendOperations) {
        this.appendOperations = options.appendOperations;
        this.updateOperations = options.updateOperations;
      } else if (options.document) {
        this.appendOperations = new DOMTreeConstruction(options.document);
        this.updateOperations = new DOMChangesImpl(options.document);
      } else if (false
      /* DEBUG */
      ) {
        throw new Error('you must pass document or appendOperations to a new runtime');
      }
    }

    var _proto49 = EnvironmentImpl.prototype;

    _proto49.getAppendOperations = function getAppendOperations() {
      return this.appendOperations;
    };

    _proto49.getDOM = function getDOM() {
      return this.updateOperations;
    };

    _proto49.begin = function begin() {
      var _b;

      (_b = this.debugRenderTree) === null || _b === void 0 ? void 0 : _b.begin();
      this[TRANSACTION] = new TransactionImpl();
    };

    _proto49.didCreate = function didCreate(component) {
      this.transaction.didCreate(component);
    };

    _proto49.didUpdate = function didUpdate(component) {
      this.transaction.didUpdate(component);
    };

    _proto49.scheduleInstallModifier = function scheduleInstallModifier(modifier) {
      if (this.isInteractive) {
        this.transaction.scheduleInstallModifier(modifier);
      }
    };

    _proto49.scheduleUpdateModifier = function scheduleUpdateModifier(modifier) {
      if (this.isInteractive) {
        this.transaction.scheduleUpdateModifier(modifier);
      }
    };

    _proto49.commit = function commit() {
      var _b;

      var transaction = this.transaction;
      this[TRANSACTION] = null;
      transaction.commit();
      (_b = this.debugRenderTree) === null || _b === void 0 ? void 0 : _b.commit();
      this.delegate.onTransactionCommit();
    };

    (0, _emberBabel.createClass)(EnvironmentImpl, [{
      key: "transaction",
      get: function get() {
        return this[TRANSACTION];
      }
    }]);
    return EnvironmentImpl;
  }();

  _exports.EnvironmentImpl = EnvironmentImpl;
  _a$1 = TRANSACTION;

  function runtimeContext(options, delegate, artifacts, resolver) {
    return {
      env: new EnvironmentImpl(options, delegate),
      program: new _program.RuntimeProgramImpl(artifacts.constants, artifacts.heap),
      resolver: resolver
    };
  }

  function inTransaction(env, cb) {
    if (!env[TRANSACTION]) {
      env.begin();

      try {
        cb();
      } finally {
        env.commit();
      }
    } else {
      cb();
    }
  }

  function initializeRegistersWithSP(sp) {
    return [0, -1, sp, 0];
  }

  var LowLevelVM = /*#__PURE__*/function () {
    function LowLevelVM(stack, heap, program, externs, registers) {
      this.stack = stack;
      this.heap = heap;
      this.program = program;
      this.externs = externs;
      this.registers = registers;
      this.currentOpSize = 0;
    }

    var _proto50 = LowLevelVM.prototype;

    _proto50.fetchRegister = function fetchRegister(register) {
      return this.registers[register];
    };

    _proto50.loadRegister = function loadRegister(register, value) {
      this.registers[register] = value;
    };

    _proto50.setPc = function setPc(pc) {
      this.registers[_vm2.$pc] = pc;
    } // Start a new frame and save $ra and $fp on the stack
    ;

    _proto50.pushFrame = function pushFrame() {
      this.stack.pushSmallInt(this.registers[_vm2.$ra]);
      this.stack.pushSmallInt(this.registers[_vm2.$fp]);
      this.registers[_vm2.$fp] = this.registers[_vm2.$sp] - 1;
    } // Restore $ra, $sp and $fp
    ;

    _proto50.popFrame = function popFrame() {
      this.registers[_vm2.$sp] = this.registers[_vm2.$fp] - 1;
      this.registers[_vm2.$ra] = this.stack.get(0);
      this.registers[_vm2.$fp] = this.stack.get(1);
    };

    _proto50.pushSmallFrame = function pushSmallFrame() {
      this.stack.pushSmallInt(this.registers[_vm2.$ra]);
    };

    _proto50.popSmallFrame = function popSmallFrame() {
      this.registers[_vm2.$ra] = this.stack.popSmallInt();
    } // Jump to an address in `program`
    ;

    _proto50.goto = function goto(offset) {
      this.setPc(this.target(offset));
    };

    _proto50.target = function target(offset) {
      return this.registers[_vm2.$pc] + offset - this.currentOpSize;
    } // Save $pc into $ra, then jump to a new address in `program` (jal in MIPS)
    ;

    _proto50.call = function call(handle) {
      this.registers[_vm2.$ra] = this.registers[_vm2.$pc];
      this.setPc(this.heap.getaddr(handle));
    } // Put a specific `program` address in $ra
    ;

    _proto50.returnTo = function returnTo(offset) {
      this.registers[_vm2.$ra] = this.target(offset);
    } // Return to the `program` address stored in $ra
    ;

    _proto50.return = function _return() {
      this.setPc(this.registers[_vm2.$ra]);
    };

    _proto50.nextStatement = function nextStatement() {
      var registers = this.registers,
          program = this.program;
      var pc = registers[_vm2.$pc];

      if (pc === -1) {
        return null;
      } // We have to save off the current operations size so that
      // when we do a jump we can calculate the correct offset
      // to where we are going. We can't simply ask for the size
      // in a jump because we have have already incremented the
      // program counter to the next instruction prior to executing.


      var opcode = program.opcode(pc);
      var operationSize = this.currentOpSize = opcode.size;
      this.registers[_vm2.$pc] += operationSize;
      return opcode;
    };

    _proto50.evaluateOuter = function evaluateOuter(opcode, vm) {
      {
        this.evaluateInner(opcode, vm);
      }
    };

    _proto50.evaluateInner = function evaluateInner(opcode, vm) {
      if (opcode.isMachine) {
        this.evaluateMachine(opcode);
      } else {
        this.evaluateSyscall(opcode, vm);
      }
    };

    _proto50.evaluateMachine = function evaluateMachine(opcode) {
      switch (opcode.type) {
        case 0
        /* PushFrame */
        :
          return this.pushFrame();

        case 1
        /* PopFrame */
        :
          return this.popFrame();

        case 3
        /* InvokeStatic */
        :
          return this.call(opcode.op1);

        case 2
        /* InvokeVirtual */
        :
          return this.call(this.stack.popSmallInt());

        case 4
        /* Jump */
        :
          return this.goto(opcode.op1);

        case 5
        /* Return */
        :
          return this.return();

        case 6
        /* ReturnTo */
        :
          return this.returnTo(opcode.op1);
      }
    };

    _proto50.evaluateSyscall = function evaluateSyscall(opcode, vm) {
      APPEND_OPCODES.evaluate(vm, opcode, opcode.type);
    };

    return LowLevelVM;
  }();

  var UpdatingVM = /*#__PURE__*/function () {
    function UpdatingVM(env, _ref59) {
      var _ref59$alwaysRevalida = _ref59.alwaysRevalidate,
          alwaysRevalidate = _ref59$alwaysRevalida === void 0 ? false : _ref59$alwaysRevalida;
      this.frameStack = new _util.Stack();
      this.env = env;
      this.dom = env.getDOM();
      this.alwaysRevalidate = alwaysRevalidate;
    }

    var _proto51 = UpdatingVM.prototype;

    _proto51.execute = function execute(opcodes, handler) {
      var _this19 = this;

      if (false
      /* DEBUG */
      ) {
        var hasErrored = true;

        try {
          (0, _validator.runInTrackingTransaction)(function () {
            return _this19._execute(opcodes, handler);
          }, '- While rendering:'); // using a boolean here to avoid breaking ergonomics of "pause on uncaught exceptions"
          // which would happen with a `catch` + `throw`

          hasErrored = false;
        } finally {
          if (hasErrored) {
            // eslint-disable-next-line no-console
            console.error("\n\nError occurred:\n\n" + (0, _validator.resetTracking)() + "\n\n");
          }
        }
      } else {
        this._execute(opcodes, handler);
      }
    };

    _proto51._execute = function _execute(opcodes, handler) {
      var frameStack = this.frameStack;
      this.try(opcodes, handler);

      while (true) {
        if (frameStack.isEmpty()) break;
        var opcode = this.frame.nextStatement();

        if (opcode === undefined) {
          frameStack.pop();
          continue;
        }

        opcode.evaluate(this);
      }
    };

    _proto51.goto = function goto(index) {
      this.frame.goto(index);
    };

    _proto51.try = function _try(ops, handler) {
      this.frameStack.push(new UpdatingVMFrame(ops, handler));
    };

    _proto51.throw = function _throw() {
      this.frame.handleException();
      this.frameStack.pop();
    };

    (0, _emberBabel.createClass)(UpdatingVM, [{
      key: "frame",
      get: function get() {
        return this.frameStack.current;
      }
    }]);
    return UpdatingVM;
  }();

  _exports.UpdatingVM = UpdatingVM;

  var ResumableVMStateImpl = /*#__PURE__*/function () {
    function ResumableVMStateImpl(state, resumeCallback) {
      this.state = state;
      this.resumeCallback = resumeCallback;
    }

    var _proto52 = ResumableVMStateImpl.prototype;

    _proto52.resume = function resume(runtime, builder) {
      return this.resumeCallback(runtime, this.state, builder);
    };

    return ResumableVMStateImpl;
  }();

  var BlockOpcode = /*#__PURE__*/function (_UpdatingOpcode14) {
    (0, _emberBabel.inheritsLoose)(BlockOpcode, _UpdatingOpcode14);

    function BlockOpcode(state, runtime, bounds, children) {
      var _this20;

      _this20 = _UpdatingOpcode14.call(this) || this;
      _this20.state = state;
      _this20.runtime = runtime;
      _this20.type = 'block';
      _this20.children = children;
      _this20.bounds = bounds;
      return _this20;
    }

    var _proto53 = BlockOpcode.prototype;

    _proto53.parentElement = function parentElement() {
      return this.bounds.parentElement();
    };

    _proto53.firstNode = function firstNode() {
      return this.bounds.firstNode();
    };

    _proto53.lastNode = function lastNode() {
      return this.bounds.lastNode();
    };

    _proto53.evaluate = function evaluate(vm) {
      vm.try(this.children, null);
    };

    return BlockOpcode;
  }(UpdatingOpcode);

  var TryOpcode = /*#__PURE__*/function (_BlockOpcode) {
    (0, _emberBabel.inheritsLoose)(TryOpcode, _BlockOpcode);

    function TryOpcode() {
      var _this21;

      _this21 = _BlockOpcode.apply(this, arguments) || this;
      _this21.type = 'try';
      return _this21;
    }

    var _proto54 = TryOpcode.prototype;

    _proto54.evaluate = function evaluate(vm) {
      vm.try(this.children, this);
    };

    _proto54.handleException = function handleException() {
      var _this22 = this;

      var state = this.state,
          bounds = this.bounds,
          runtime = this.runtime;
      (0, _destroyable2.destroyChildren)(this);
      var elementStack = NewElementBuilder.resume(runtime.env, bounds);
      var vm = state.resume(runtime, elementStack);
      var updating = [];
      var children = this.children = [];
      var result = vm.execute(function (vm) {
        vm.pushUpdating(updating);
        vm.updateWith(_this22);
        vm.pushUpdating(children);
      });
      (0, _destroyable2.associateDestroyableChild)(this, result.drop);
    };

    return TryOpcode;
  }(BlockOpcode);

  var ListItemOpcode = /*#__PURE__*/function (_TryOpcode) {
    (0, _emberBabel.inheritsLoose)(ListItemOpcode, _TryOpcode);

    function ListItemOpcode(state, runtime, bounds, key, memo, value) {
      var _this23;

      _this23 = _TryOpcode.call(this, state, runtime, bounds, []) || this;
      _this23.key = key;
      _this23.memo = memo;
      _this23.value = value;
      _this23.retained = false;
      _this23.index = -1;
      return _this23;
    }

    var _proto55 = ListItemOpcode.prototype;

    _proto55.updateReferences = function updateReferences(item) {
      this.retained = true;
      (0, _reference.updateRef)(this.value, item.value);
      (0, _reference.updateRef)(this.memo, item.memo);
    };

    _proto55.shouldRemove = function shouldRemove() {
      return !this.retained;
    };

    _proto55.reset = function reset() {
      this.retained = false;
    };

    return ListItemOpcode;
  }(TryOpcode);

  var ListBlockOpcode = /*#__PURE__*/function (_BlockOpcode2) {
    (0, _emberBabel.inheritsLoose)(ListBlockOpcode, _BlockOpcode2);

    function ListBlockOpcode(state, runtime, bounds, children, iterableRef) {
      var _this24;

      _this24 = _BlockOpcode2.call(this, state, runtime, bounds, children) || this;
      _this24.iterableRef = iterableRef;
      _this24.type = 'list-block';
      _this24.opcodeMap = new Map();
      _this24.marker = null;
      _this24.lastIterator = (0, _reference.valueForRef)(iterableRef);
      return _this24;
    }

    var _proto56 = ListBlockOpcode.prototype;

    _proto56.initializeChild = function initializeChild(opcode) {
      opcode.index = this.children.length - 1;
      this.opcodeMap.set(opcode.key, opcode);
    };

    _proto56.evaluate = function evaluate(vm) {
      var iterator = (0, _reference.valueForRef)(this.iterableRef);

      if (this.lastIterator !== iterator) {
        var bounds = this.bounds;
        var dom = vm.dom;
        var marker = this.marker = dom.createComment('');
        dom.insertAfter(bounds.parentElement(), marker, bounds.lastNode());
        this.sync(iterator);
        this.parentElement().removeChild(marker);
        this.marker = null;
        this.lastIterator = iterator;
      } // Run now-updated updating opcodes


      _BlockOpcode2.prototype.evaluate.call(this, vm);
    };

    _proto56.sync = function sync(iterator) {
      var itemMap = this.opcodeMap,
          children = this.children;
      var currentOpcodeIndex = 0;
      var seenIndex = 0;
      this.children = this.bounds.boundList = [];

      while (true) {
        var item = iterator.next();
        if (item === null) break;
        var opcode = children[currentOpcodeIndex];
        var key = item.key; // Items that have already been found and moved will already be retained,
        // we can continue until we find the next unretained item

        while (opcode !== undefined && opcode.retained === true) {
          opcode = children[++currentOpcodeIndex];
        }

        if (opcode !== undefined && opcode.key === key) {
          this.retainItem(opcode, item);
          currentOpcodeIndex++;
        } else if (itemMap.has(key)) {
          var itemOpcode = itemMap.get(key); // The item opcode was seen already, so we should move it.

          if (itemOpcode.index < seenIndex) {
            this.moveItem(itemOpcode, item, opcode);
          } else {
            // Update the seen index, we are going to be moving this item around
            // so any other items that come before it will likely need to move as
            // well.
            seenIndex = itemOpcode.index;
            var seenUnretained = false; // iterate through all of the opcodes between the current position and
            // the position of the item's opcode, and determine if they are all
            // retained.

            for (var i = currentOpcodeIndex + 1; i < seenIndex; i++) {
              if (children[i].retained === false) {
                seenUnretained = true;
                break;
              }
            } // If we have seen only retained opcodes between this and the matching
            // opcode, it means that all the opcodes in between have been moved
            // already, and we can safely retain this item's opcode.


            if (seenUnretained === false) {
              this.retainItem(itemOpcode, item);
              currentOpcodeIndex = seenIndex + 1;
            } else {
              this.moveItem(itemOpcode, item, opcode);
              currentOpcodeIndex++;
            }
          }
        } else {
          this.insertItem(item, opcode);
        }
      }

      for (var _i7 = 0; _i7 < children.length; _i7++) {
        var _opcode = children[_i7];

        if (_opcode.retained === false) {
          this.deleteItem(_opcode);
        } else {
          _opcode.reset();
        }
      }
    };

    _proto56.retainItem = function retainItem(opcode, item) {
      var children = this.children;
      (0, _reference.updateRef)(opcode.memo, item.memo);
      (0, _reference.updateRef)(opcode.value, item.value);
      opcode.retained = true;
      opcode.index = children.length;
      children.push(opcode);
    };

    _proto56.insertItem = function insertItem(item, before) {
      var _this25 = this;

      var opcodeMap = this.opcodeMap,
          bounds = this.bounds,
          state = this.state,
          runtime = this.runtime,
          children = this.children;
      var key = item.key;
      var nextSibling = before === undefined ? this.marker : before.firstNode();
      var elementStack = NewElementBuilder.forInitialRender(runtime.env, {
        element: bounds.parentElement(),
        nextSibling: nextSibling
      });
      var vm = state.resume(runtime, elementStack);
      vm.execute(function (vm) {
        vm.pushUpdating();
        var opcode = vm.enterItem(item);
        opcode.index = children.length;
        children.push(opcode);
        opcodeMap.set(key, opcode);
        (0, _destroyable2.associateDestroyableChild)(_this25, opcode);
      });
    };

    _proto56.moveItem = function moveItem(opcode, item, before) {
      var children = this.children;
      (0, _reference.updateRef)(opcode.memo, item.memo);
      (0, _reference.updateRef)(opcode.value, item.value);
      opcode.retained = true;
      var currentSibling, nextSibling;

      if (before === undefined) {
        move(opcode, this.marker);
      } else {
        currentSibling = opcode.lastNode().nextSibling;
        nextSibling = before.firstNode(); // Items are moved throughout the algorithm, so there are cases where the
        // the items already happen to be siblings (e.g. an item in between was
        // moved before this move happened). Check to see if they are siblings
        // first before doing the move.

        if (currentSibling !== nextSibling) {
          move(opcode, nextSibling);
        }
      }

      opcode.index = children.length;
      children.push(opcode);
    };

    _proto56.deleteItem = function deleteItem(opcode) {
      (0, _destroyable2.destroy)(opcode);
      clear(opcode);
      this.opcodeMap.delete(opcode.key);
    };

    return ListBlockOpcode;
  }(BlockOpcode);

  var UpdatingVMFrame = /*#__PURE__*/function () {
    function UpdatingVMFrame(ops, exceptionHandler) {
      this.ops = ops;
      this.exceptionHandler = exceptionHandler;
      this.current = 0;
    }

    var _proto57 = UpdatingVMFrame.prototype;

    _proto57.goto = function goto(index) {
      this.current = index;
    };

    _proto57.nextStatement = function nextStatement() {
      return this.ops[this.current++];
    };

    _proto57.handleException = function handleException() {
      if (this.exceptionHandler) {
        this.exceptionHandler.handleException();
      }
    };

    return UpdatingVMFrame;
  }();

  var RenderResultImpl = /*#__PURE__*/function () {
    function RenderResultImpl(env, updating, bounds, drop) {
      var _this26 = this;

      this.env = env;
      this.updating = updating;
      this.bounds = bounds;
      this.drop = drop;
      (0, _destroyable2.associateDestroyableChild)(this, drop);
      (0, _destroyable2.registerDestructor)(this, function () {
        return clear(_this26.bounds);
      });
    }

    var _proto58 = RenderResultImpl.prototype;

    _proto58.rerender = function rerender(_temp) {
      var _ref60 = _temp === void 0 ? {
        alwaysRevalidate: false
      } : _temp,
          _ref60$alwaysRevalida = _ref60.alwaysRevalidate,
          alwaysRevalidate = _ref60$alwaysRevalida === void 0 ? false : _ref60$alwaysRevalida;

      var env = this.env,
          updating = this.updating;
      var vm = new UpdatingVM(env, {
        alwaysRevalidate: alwaysRevalidate
      });
      vm.execute(updating, this);
    };

    _proto58.parentElement = function parentElement() {
      return this.bounds.parentElement();
    };

    _proto58.firstNode = function firstNode() {
      return this.bounds.firstNode();
    };

    _proto58.lastNode = function lastNode() {
      return this.bounds.lastNode();
    };

    _proto58.handleException = function handleException() {
      throw 'this should never happen';
    };

    return RenderResultImpl;
  }();

  var InnerStack = /*#__PURE__*/function () {
    function InnerStack(inner, js) {
      if (inner === void 0) {
        inner = new _lowLevel.Stack();
      }

      this.inner = inner;
      this.js = (0, _util.constants)();

      if (js !== undefined) {
        this.js = this.js.concat(js);
      }
    }

    var _proto59 = InnerStack.prototype;

    _proto59.slice = function slice(start, end) {
      var out = [];

      if (start === -1) {
        return out;
      }

      for (var i = start; i < end; i++) {
        out.push(this.get(i));
      }

      return out;
    };

    _proto59.copy = function copy(from, to) {
      this.inner.copy(from, to);
    };

    _proto59.writeJs = function writeJs(pos, value) {
      var idx = this.js.length;
      this.js.push(value);
      this.inner.writeRaw(pos, (0, _util.encodeHandle)(idx));
    };

    _proto59.writeSmallInt = function writeSmallInt(pos, value) {
      this.inner.writeRaw(pos, (0, _util.encodeImmediate)(value));
    };

    _proto59.writeTrue = function writeTrue(pos) {
      this.inner.writeRaw(pos, 1
      /* ENCODED_TRUE_HANDLE */
      );
    };

    _proto59.writeFalse = function writeFalse(pos) {
      this.inner.writeRaw(pos, 0
      /* ENCODED_FALSE_HANDLE */
      );
    };

    _proto59.writeNull = function writeNull(pos) {
      this.inner.writeRaw(pos, 2
      /* ENCODED_NULL_HANDLE */
      );
    };

    _proto59.writeUndefined = function writeUndefined(pos) {
      this.inner.writeRaw(pos, 3
      /* ENCODED_UNDEFINED_HANDLE */
      );
    };

    _proto59.writeRaw = function writeRaw(pos, value) {
      this.inner.writeRaw(pos, value);
    };

    _proto59.getJs = function getJs(pos) {
      var value = this.inner.getRaw(pos);
      return this.js[(0, _util.decodeHandle)(value)];
    };

    _proto59.getSmallInt = function getSmallInt(pos) {
      var value = this.inner.getRaw(pos);
      return (0, _util.decodeImmediate)(value);
    };

    _proto59.get = function get(pos) {
      var value = this.inner.getRaw(pos) | 0;

      if ((0, _util.isHandle)(value)) {
        return this.js[(0, _util.decodeHandle)(value)];
      } else {
        return (0, _util.decodeImmediate)(value);
      }
    };

    _proto59.reset = function reset() {
      this.inner.reset();
      this.js.length = 0;
    };

    (0, _emberBabel.createClass)(InnerStack, [{
      key: "length",
      get: function get() {
        return this.inner.len();
      }
    }]);
    return InnerStack;
  }();

  var EvaluationStackImpl = /*#__PURE__*/function () {
    // fp -> sp
    function EvaluationStackImpl(stack, registers) {
      this.stack = stack;
      this[REGISTERS] = registers;
    }

    EvaluationStackImpl.restore = function restore(snapshot) {
      var stack = new InnerStack();

      for (var i = 0; i < snapshot.length; i++) {
        var value = snapshot[i];

        if (typeof value === 'number' && (0, _util.isSmallInt)(value)) {
          stack.writeRaw(i, (0, _util.encodeImmediate)(value));
        } else if (value === true) {
          stack.writeTrue(i);
        } else if (value === false) {
          stack.writeFalse(i);
        } else if (value === null) {
          stack.writeNull(i);
        } else if (value === undefined) {
          stack.writeUndefined(i);
        } else {
          stack.writeJs(i, value);
        }
      }

      return new this(stack, initializeRegistersWithSP(snapshot.length - 1));
    };

    var _proto60 = EvaluationStackImpl.prototype;

    _proto60.pushJs = function pushJs(value) {
      this.stack.writeJs(++this[REGISTERS][_vm2.$sp], value);
    };

    _proto60.pushSmallInt = function pushSmallInt(value) {
      this.stack.writeSmallInt(++this[REGISTERS][_vm2.$sp], value);
    };

    _proto60.pushTrue = function pushTrue() {
      this.stack.writeTrue(++this[REGISTERS][_vm2.$sp]);
    };

    _proto60.pushFalse = function pushFalse() {
      this.stack.writeFalse(++this[REGISTERS][_vm2.$sp]);
    };

    _proto60.pushNull = function pushNull() {
      this.stack.writeNull(++this[REGISTERS][_vm2.$sp]);
    };

    _proto60.pushUndefined = function pushUndefined() {
      this.stack.writeUndefined(++this[REGISTERS][_vm2.$sp]);
    };

    _proto60.pushRaw = function pushRaw(value) {
      this.stack.writeRaw(++this[REGISTERS][_vm2.$sp], value);
    };

    _proto60.dup = function dup(position) {
      if (position === void 0) {
        position = this[REGISTERS][_vm2.$sp];
      }

      this.stack.copy(position, ++this[REGISTERS][_vm2.$sp]);
    };

    _proto60.copy = function copy(from, to) {
      this.stack.copy(from, to);
    };

    _proto60.popJs = function popJs(n) {
      if (n === void 0) {
        n = 1;
      }

      var top = this.stack.getJs(this[REGISTERS][_vm2.$sp]);
      this[REGISTERS][_vm2.$sp] -= n;
      return top;
    };

    _proto60.popSmallInt = function popSmallInt(n) {
      if (n === void 0) {
        n = 1;
      }

      var top = this.stack.getSmallInt(this[REGISTERS][_vm2.$sp]);
      this[REGISTERS][_vm2.$sp] -= n;
      return top;
    };

    _proto60.pop = function pop(n) {
      if (n === void 0) {
        n = 1;
      }

      var top = this.stack.get(this[REGISTERS][_vm2.$sp]);
      this[REGISTERS][_vm2.$sp] -= n;
      return top;
    };

    _proto60.peekJs = function peekJs(offset) {
      if (offset === void 0) {
        offset = 0;
      }

      return this.stack.getJs(this[REGISTERS][_vm2.$sp] - offset);
    };

    _proto60.peekSmallInt = function peekSmallInt(offset) {
      if (offset === void 0) {
        offset = 0;
      }

      return this.stack.getSmallInt(this[REGISTERS][_vm2.$sp] - offset);
    };

    _proto60.peek = function peek(offset) {
      if (offset === void 0) {
        offset = 0;
      }

      return this.stack.get(this[REGISTERS][_vm2.$sp] - offset);
    };

    _proto60.get = function get(offset, base) {
      if (base === void 0) {
        base = this[REGISTERS][_vm2.$fp];
      }

      return this.stack.get(base + offset);
    };

    _proto60.set = function set(value, offset, base) {
      if (base === void 0) {
        base = this[REGISTERS][_vm2.$fp];
      }

      this.stack.writeJs(base + offset, value);
    };

    _proto60.slice = function slice(start, end) {
      return this.stack.slice(start, end);
    };

    _proto60.capture = function capture(items) {
      var end = this[REGISTERS][_vm2.$sp] + 1;
      var start = end - items;
      return this.stack.slice(start, end);
    };

    _proto60.reset = function reset() {
      this.stack.reset();
    };

    _proto60.toArray = function toArray() {
      return this.stack.slice(this[REGISTERS][_vm2.$fp], this[REGISTERS][_vm2.$sp] + 1);
    };

    return EvaluationStackImpl;
  }();

  var _a$2, _b;

  var Stacks = function Stacks() {
    this.scope = new _util.Stack();
    this.dynamicScope = new _util.Stack();
    this.updating = new _util.Stack();
    this.cache = new _util.Stack();
    this.list = new _util.Stack();
  };

  var VM = /*#__PURE__*/function () {
    /**
     * End of migrated.
     */
    function VM(runtime, _ref61, elementStack, context) {
      var _this27 = this;

      var pc = _ref61.pc,
          scope = _ref61.scope,
          dynamicScope = _ref61.dynamicScope,
          stack = _ref61.stack;
      this.runtime = runtime;
      this.elementStack = elementStack;
      this.context = context;
      this[_a$2] = new Stacks();
      this[_b] = new _util.Stack();
      this.s0 = null;
      this.s1 = null;
      this.t0 = null;
      this.t1 = null;
      this.v0 = null;
      this.resume = initVM(this.context);

      if (false
      /* DEBUG */
      ) {
        (0, _globalContext.assertGlobalContextWasSet)();
      }

      var evalStack = EvaluationStackImpl.restore(stack);
      evalStack[REGISTERS][_vm2.$pc] = pc;
      evalStack[REGISTERS][_vm2.$sp] = stack.length - 1;
      evalStack[REGISTERS][_vm2.$fp] = -1;
      this[HEAP] = this.program.heap;
      this[CONSTANTS] = this.program.constants;
      this.elementStack = elementStack;
      this[STACKS].scope.push(scope);
      this[STACKS].dynamicScope.push(dynamicScope);
      this[ARGS] = new VMArgumentsImpl();
      this[INNER_VM] = new LowLevelVM(evalStack, this[HEAP], runtime.program, {
        debugBefore: function debugBefore(opcode) {
          return APPEND_OPCODES.debugBefore(_this27, opcode);
        },
        debugAfter: function debugAfter(state) {
          APPEND_OPCODES.debugAfter(_this27, state);
        }
      }, evalStack[REGISTERS]);
      this.destructor = {};
      this[DESTROYABLE_STACK].push(this.destructor);
    }

    var _proto61 = VM.prototype;

    // Fetch a value from a register onto the stack
    _proto61.fetch = function fetch(register) {
      var value = this.fetchValue(register);
      this.stack.pushJs(value);
    } // Load a value from the stack into a register
    ;

    _proto61.load = function load(register) {
      var value = this.stack.pop();
      this.loadValue(register, value);
    };

    _proto61.fetchValue = function fetchValue(register) {
      if ((0, _vm2.isLowLevelRegister)(register)) {
        return this[INNER_VM].fetchRegister(register);
      }

      switch (register) {
        case _vm2.$s0:
          return this.s0;

        case _vm2.$s1:
          return this.s1;

        case _vm2.$t0:
          return this.t0;

        case _vm2.$t1:
          return this.t1;

        case _vm2.$v0:
          return this.v0;
      }
    } // Load a value into a register
    ;

    _proto61.loadValue = function loadValue(register, value) {
      if ((0, _vm2.isLowLevelRegister)(register)) {
        this[INNER_VM].loadRegister(register, value);
      }

      switch (register) {
        case _vm2.$s0:
          this.s0 = value;
          break;

        case _vm2.$s1:
          this.s1 = value;
          break;

        case _vm2.$t0:
          this.t0 = value;
          break;

        case _vm2.$t1:
          this.t1 = value;
          break;

        case _vm2.$v0:
          this.v0 = value;
          break;
      }
    }
    /**
     * Migrated to Inner
     */
    // Start a new frame and save $ra and $fp on the stack
    ;

    _proto61.pushFrame = function pushFrame() {
      this[INNER_VM].pushFrame();
    } // Restore $ra, $sp and $fp
    ;

    _proto61.popFrame = function popFrame() {
      this[INNER_VM].popFrame();
    } // Jump to an address in `program`
    ;

    _proto61.goto = function goto(offset) {
      this[INNER_VM].goto(offset);
    } // Save $pc into $ra, then jump to a new address in `program` (jal in MIPS)
    ;

    _proto61.call = function call(handle) {
      this[INNER_VM].call(handle);
    } // Put a specific `program` address in $ra
    ;

    _proto61.returnTo = function returnTo(offset) {
      this[INNER_VM].returnTo(offset);
    } // Return to the `program` address stored in $ra
    ;

    _proto61.return = function _return() {
      this[INNER_VM].return();
    };

    VM.initial = function initial(runtime, context, _ref62) {
      var handle = _ref62.handle,
          self = _ref62.self,
          dynamicScope = _ref62.dynamicScope,
          treeBuilder = _ref62.treeBuilder,
          numSymbols = _ref62.numSymbols,
          owner = _ref62.owner;
      var scope = PartialScopeImpl.root(self, numSymbols, owner);
      var state = vmState(runtime.program.heap.getaddr(handle), scope, dynamicScope);
      var vm = initVM(context)(runtime, state, treeBuilder);
      vm.pushUpdating();
      return vm;
    };

    VM.empty = function empty(runtime, _ref63, context) {
      var handle = _ref63.handle,
          treeBuilder = _ref63.treeBuilder,
          dynamicScope = _ref63.dynamicScope,
          owner = _ref63.owner;
      var vm = initVM(context)(runtime, vmState(runtime.program.heap.getaddr(handle), PartialScopeImpl.root(_reference.UNDEFINED_REFERENCE, 0, owner), dynamicScope), treeBuilder);
      vm.pushUpdating();
      return vm;
    };

    _proto61.compile = function compile(block) {
      var handle = (0, _util.unwrapHandle)(block.compile(this.context));
      return handle;
    };

    _proto61.captureState = function captureState(args, pc) {
      if (pc === void 0) {
        pc = this[INNER_VM].fetchRegister(_vm2.$pc);
      }

      return {
        pc: pc,
        scope: this.scope(),
        dynamicScope: this.dynamicScope(),
        stack: this.stack.capture(args)
      };
    };

    _proto61.capture = function capture(args, pc) {
      if (pc === void 0) {
        pc = this[INNER_VM].fetchRegister(_vm2.$pc);
      }

      return new ResumableVMStateImpl(this.captureState(args, pc), this.resume);
    };

    _proto61.beginCacheGroup = function beginCacheGroup(name) {
      var opcodes = this.updating();
      var guard = new JumpIfNotModifiedOpcode();
      opcodes.push(guard);
      opcodes.push(new BeginTrackFrameOpcode(name));
      this[STACKS].cache.push(guard);
      (0, _validator.beginTrackFrame)(name);
    };

    _proto61.commitCacheGroup = function commitCacheGroup() {
      var opcodes = this.updating();
      var guard = this[STACKS].cache.pop();
      var tag = (0, _validator.endTrackFrame)();
      opcodes.push(new EndTrackFrameOpcode(guard));
      guard.finalize(tag, opcodes.length);
    };

    _proto61.enter = function enter(args) {
      var updating = [];
      var state = this.capture(args);
      var block = this.elements().pushUpdatableBlock();
      var tryOpcode = new TryOpcode(state, this.runtime, block, updating);
      this.didEnter(tryOpcode);
    };

    _proto61.enterItem = function enterItem(_ref64) {
      var key = _ref64.key,
          value = _ref64.value,
          memo = _ref64.memo;
      var stack = this.stack;
      var valueRef = (0, _reference.createIteratorItemRef)(value);
      var memoRef = (0, _reference.createIteratorItemRef)(memo);
      stack.pushJs(valueRef);
      stack.pushJs(memoRef);
      var state = this.capture(2);
      var block = this.elements().pushUpdatableBlock();
      var opcode = new ListItemOpcode(state, this.runtime, block, key, memoRef, valueRef);
      this.didEnter(opcode);
      return opcode;
    };

    _proto61.registerItem = function registerItem(opcode) {
      this.listBlock().initializeChild(opcode);
    };

    _proto61.enterList = function enterList(iterableRef, offset) {
      var updating = [];
      var addr = this[INNER_VM].target(offset);
      var state = this.capture(0, addr);
      var list = this.elements().pushBlockList(updating);
      var opcode = new ListBlockOpcode(state, this.runtime, list, updating, iterableRef);
      this[STACKS].list.push(opcode);
      this.didEnter(opcode);
    };

    _proto61.didEnter = function didEnter(opcode) {
      this.associateDestroyable(opcode);
      this[DESTROYABLE_STACK].push(opcode);
      this.updateWith(opcode);
      this.pushUpdating(opcode.children);
    };

    _proto61.exit = function exit() {
      this[DESTROYABLE_STACK].pop();
      this.elements().popBlock();
      this.popUpdating();
    };

    _proto61.exitList = function exitList() {
      this.exit();
      this[STACKS].list.pop();
    };

    _proto61.pushUpdating = function pushUpdating(list) {
      if (list === void 0) {
        list = [];
      }

      this[STACKS].updating.push(list);
    };

    _proto61.popUpdating = function popUpdating() {
      return this[STACKS].updating.pop();
    };

    _proto61.updateWith = function updateWith(opcode) {
      this.updating().push(opcode);
    };

    _proto61.listBlock = function listBlock() {
      return this[STACKS].list.current;
    };

    _proto61.associateDestroyable = function associateDestroyable(child) {
      var parent = this[DESTROYABLE_STACK].current;
      (0, _destroyable2.associateDestroyableChild)(parent, child);
    };

    _proto61.tryUpdating = function tryUpdating() {
      return this[STACKS].updating.current;
    };

    _proto61.updating = function updating() {
      return this[STACKS].updating.current;
    };

    _proto61.elements = function elements() {
      return this.elementStack;
    };

    _proto61.scope = function scope() {
      return this[STACKS].scope.current;
    };

    _proto61.dynamicScope = function dynamicScope() {
      return this[STACKS].dynamicScope.current;
    };

    _proto61.pushChildScope = function pushChildScope() {
      this[STACKS].scope.push(this.scope().child());
    };

    _proto61.pushDynamicScope = function pushDynamicScope() {
      var child = this.dynamicScope().child();
      this[STACKS].dynamicScope.push(child);
      return child;
    };

    _proto61.pushRootScope = function pushRootScope(size, owner) {
      var scope = PartialScopeImpl.sized(size, owner);
      this[STACKS].scope.push(scope);
      return scope;
    };

    _proto61.pushScope = function pushScope(scope) {
      this[STACKS].scope.push(scope);
    };

    _proto61.popScope = function popScope() {
      this[STACKS].scope.pop();
    };

    _proto61.popDynamicScope = function popDynamicScope() {
      this[STACKS].dynamicScope.pop();
    } /// SCOPE HELPERS
    ;

    _proto61.getOwner = function getOwner() {
      return this.scope().owner;
    };

    _proto61.getSelf = function getSelf() {
      return this.scope().getSelf();
    };

    _proto61.referenceForSymbol = function referenceForSymbol(symbol$$1) {
      return this.scope().getSymbol(symbol$$1);
    } /// EXECUTION
    ;

    _proto61.execute = function execute(initialize) {
      if (false
      /* DEBUG */
      ) {
        var hasErrored = true;

        try {
          var value = this._execute(initialize); // using a boolean here to avoid breaking ergonomics of "pause on uncaught exceptions"
          // which would happen with a `catch` + `throw`


          hasErrored = false;
          return value;
        } finally {
          if (hasErrored) {
            // If any existing blocks are open, due to an error or something like
            // that, we need to close them all and clean things up properly.
            var elements = this.elements();

            while (elements.hasBlocks) {
              elements.popBlock();
            } // eslint-disable-next-line no-console


            console.error("\n\nError occurred:\n\n" + (0, _validator.resetTracking)() + "\n\n");
          }
        }
      } else {
        return this._execute(initialize);
      }
    };

    _proto61._execute = function _execute(initialize) {
      if (initialize) initialize(this);
      var result;

      while (true) {
        result = this.next();
        if (result.done) break;
      }

      return result.value;
    };

    _proto61.next = function next() {
      var env = this.env,
          elementStack = this.elementStack;
      var opcode = this[INNER_VM].nextStatement();
      var result;

      if (opcode !== null) {
        this[INNER_VM].evaluateOuter(opcode, this);
        result = {
          done: false,
          value: null
        };
      } else {
        // Unload the stack
        this.stack.reset();
        result = {
          done: true,
          value: new RenderResultImpl(env, this.popUpdating(), elementStack.popBlock(), this.destructor)
        };
      }

      return result;
    };

    _proto61.bindDynamicScope = function bindDynamicScope(names) {
      var scope = this.dynamicScope();

      for (var i = names.length - 1; i >= 0; i--) {
        var name = names[i];
        scope.set(name, this.stack.popJs());
      }
    };

    (0, _emberBabel.createClass)(VM, [{
      key: "stack",
      get: function get() {
        return this[INNER_VM].stack;
      }
      /* Registers */

    }, {
      key: "pc",
      get: function get() {
        return this[INNER_VM].fetchRegister(_vm2.$pc);
      }
    }, {
      key: "program",
      get: function get() {
        return this.runtime.program;
      }
    }, {
      key: "env",
      get: function get() {
        return this.runtime.env;
      }
    }]);
    return VM;
  }();

  _exports.LowLevelVM = VM;
  _a$2 = STACKS, _b = DESTROYABLE_STACK;

  function vmState(pc, scope, dynamicScope) {
    return {
      pc: pc,
      scope: scope,
      dynamicScope: dynamicScope,
      stack: []
    };
  }

  function initVM(context) {
    return function (runtime, state, builder) {
      return new VM(runtime, state, builder, context);
    };
  }

  var TemplateIteratorImpl = /*#__PURE__*/function () {
    function TemplateIteratorImpl(vm) {
      this.vm = vm;
    }

    var _proto62 = TemplateIteratorImpl.prototype;

    _proto62.next = function next() {
      return this.vm.next();
    };

    _proto62.sync = function sync() {
      var _this28 = this;

      if (false
      /* DEBUG */
      ) {
        return (0, _validator.runInTrackingTransaction)(function () {
          return _this28.vm.execute();
        }, '- While rendering:');
      } else {
        return this.vm.execute();
      }
    };

    return TemplateIteratorImpl;
  }();

  function renderSync(env, iterator) {
    var result;
    inTransaction(env, function () {
      return result = iterator.sync();
    });
    return result;
  }

  function renderMain(runtime, context, owner, self, treeBuilder, layout, dynamicScope) {
    if (dynamicScope === void 0) {
      dynamicScope = new DynamicScopeImpl();
    }

    var handle = (0, _util.unwrapHandle)(layout.compile(context));
    var numSymbols = layout.symbolTable.symbols.length;
    var vm = VM.initial(runtime, context, {
      self: self,
      dynamicScope: dynamicScope,
      treeBuilder: treeBuilder,
      handle: handle,
      numSymbols: numSymbols,
      owner: owner
    });
    return new TemplateIteratorImpl(vm);
  }

  function renderInvocation(vm, context, owner, definition, args) {
    // Get a list of tuples of argument names and references, like
    // [['title', reference], ['name', reference]]
    var argList = Object.keys(args).map(function (key) {
      return [key, args[key]];
    });
    var blockNames = ['main', 'else', 'attrs']; // Prefix argument names with `@` symbol

    var argNames = argList.map(function (_ref65) {
      var name = _ref65[0];
      return "@" + name;
    });
    var reified = vm[CONSTANTS].component(definition, owner);
    vm.pushFrame(); // Push blocks on to the stack, three stack values per block

    for (var i = 0; i < 3 * blockNames.length; i++) {
      vm.stack.pushNull();
    }

    vm.stack.pushNull(); // For each argument, push its backing reference on to the stack

    argList.forEach(function (_ref66) {
      var reference = _ref66[1];
      vm.stack.pushJs(reference);
    }); // Configure VM based on blocks and args just pushed on to the stack.

    vm[ARGS].setup(vm.stack, argNames, blockNames, 0, true);
    var compilable = reified.compilable;
    var layoutHandle = (0, _util.unwrapHandle)(compilable.compile(context));
    var invocation = {
      handle: layoutHandle,
      symbolTable: compilable.symbolTable
    }; // Needed for the Op.Main opcode: arguments, component invocation object, and
    // component definition.

    vm.stack.pushJs(vm[ARGS]);
    vm.stack.pushJs(invocation);
    vm.stack.pushJs(reified);
    return new TemplateIteratorImpl(vm);
  }

  function renderComponent(runtime, treeBuilder, context, owner, definition, args, dynamicScope) {
    if (args === void 0) {
      args = {};
    }

    if (dynamicScope === void 0) {
      dynamicScope = new DynamicScopeImpl();
    }

    var vm = VM.empty(runtime, {
      treeBuilder: treeBuilder,
      handle: context.stdlib.main,
      dynamicScope: dynamicScope,
      owner: owner
    }, context);
    return renderInvocation(vm, context, owner, definition, recordToReference(args));
  }

  function recordToReference(record) {
    var root = (0, _reference.createConstRef)(record, 'args');
    return Object.keys(record).reduce(function (acc, key) {
      acc[key] = (0, _reference.childRefFor)(root, key);
      return acc;
    }, {});
  }

  var SERIALIZATION_FIRST_NODE_STRING = '%+b:0%';
  _exports.SERIALIZATION_FIRST_NODE_STRING = SERIALIZATION_FIRST_NODE_STRING;

  function isSerializationFirstNode(node) {
    return node.nodeValue === SERIALIZATION_FIRST_NODE_STRING;
  }

  var RehydratingCursor = /*#__PURE__*/function (_CursorImpl) {
    (0, _emberBabel.inheritsLoose)(RehydratingCursor, _CursorImpl);

    function RehydratingCursor(element, nextSibling, startingBlockDepth) {
      var _this29;

      _this29 = _CursorImpl.call(this, element, nextSibling) || this;
      _this29.startingBlockDepth = startingBlockDepth;
      _this29.candidate = null;
      _this29.injectedOmittedNode = false;
      _this29.openBlockDepth = startingBlockDepth - 1;
      return _this29;
    }

    return RehydratingCursor;
  }(CursorImpl);

  var RehydrateBuilder = /*#__PURE__*/function (_NewElementBuilder) {
    (0, _emberBabel.inheritsLoose)(RehydrateBuilder, _NewElementBuilder);

    function RehydrateBuilder(env, parentNode, nextSibling) {
      var _this30;

      _this30 = _NewElementBuilder.call(this, env, parentNode, nextSibling) || this;
      _this30.unmatchedAttributes = null;
      _this30.blockDepth = 0;
      if (nextSibling) throw new Error('Rehydration with nextSibling not supported');
      var node = _this30.currentCursor.element.firstChild;

      while (node !== null) {
        if (isOpenBlock(node)) {
          break;
        }

        node = node.nextSibling;
      }

      _this30.candidate = node;
      var startingBlockOffset = getBlockDepth(node);

      if (startingBlockOffset !== 0) {
        // We are rehydrating from a partial tree and not the root component
        // We need to add an extra block before the first block to rehydrate correctly
        // The extra block is needed since the renderComponent API creates a synthetic component invocation which generates the extra block
        var newBlockDepth = startingBlockOffset - 1;

        var newCandidate = _this30.dom.createComment("%+b:" + newBlockDepth + "%");

        node.parentNode.insertBefore(newCandidate, _this30.candidate);
        var closingNode = node.nextSibling;

        while (closingNode !== null) {
          if (isCloseBlock(closingNode) && getBlockDepth(closingNode) === startingBlockOffset) {
            break;
          }

          closingNode = closingNode.nextSibling;
        }

        var newClosingBlock = _this30.dom.createComment("%-b:" + newBlockDepth + "%");

        node.parentNode.insertBefore(newClosingBlock, closingNode.nextSibling);
        _this30.candidate = newCandidate;
        _this30.startingBlockOffset = newBlockDepth;
      } else {
        _this30.startingBlockOffset = 0;
      }

      return _this30;
    }

    var _proto63 = RehydrateBuilder.prototype;

    _proto63.disableRehydration = function disableRehydration(nextSibling) {
      var currentCursor = this.currentCursor; // rehydration will be disabled until we either:
      // * hit popElement (and return to using the parent elements cursor)
      // * hit closeBlock and the next sibling is a close block comment
      //   matching the expected openBlockDepth

      currentCursor.candidate = null;
      currentCursor.nextSibling = nextSibling;
    };

    _proto63.enableRehydration = function enableRehydration(candidate) {
      var currentCursor = this.currentCursor;
      currentCursor.candidate = candidate;
      currentCursor.nextSibling = null;
    };

    _proto63.pushElement = function pushElement(element, nextSibling) {
      if (nextSibling === void 0) {
        nextSibling = null;
      }

      var cursor = new RehydratingCursor(element, nextSibling, this.blockDepth || 0);
      /**
       * <div>   <---------------  currentCursor.element
       *   <!--%+b:1%--> <-------  would have been removed during openBlock
       *   <div> <---------------  currentCursor.candidate -> cursor.element
       *     <!--%+b:2%--> <-----  currentCursor.candidate.firstChild -> cursor.candidate
       *     Foo
       *     <!--%-b:2%-->
       *   </div>
       *   <!--%-b:1%-->  <------  becomes currentCursor.candidate
       */

      if (this.candidate !== null) {
        cursor.candidate = element.firstChild;
        this.candidate = element.nextSibling;
      }

      this[CURSOR_STACK].push(cursor);
    } // clears until the end of the current container
    // either the current open block or higher
    ;

    _proto63.clearMismatch = function clearMismatch(candidate) {
      var current = candidate;
      var currentCursor = this.currentCursor;

      if (currentCursor !== null) {
        var openBlockDepth = currentCursor.openBlockDepth;

        if (openBlockDepth >= currentCursor.startingBlockDepth) {
          while (current) {
            if (isCloseBlock(current)) {
              var closeBlockDepth = getBlockDepthWithOffset(current, this.startingBlockOffset);

              if (openBlockDepth >= closeBlockDepth) {
                break;
              }
            }

            current = this.remove(current);
          }
        } else {
          while (current !== null) {
            current = this.remove(current);
          }
        } // current cursor parentNode should be openCandidate if element
        // or openCandidate.parentNode if comment


        this.disableRehydration(current);
      }
    };

    _proto63.__openBlock = function __openBlock() {
      var currentCursor = this.currentCursor;
      if (currentCursor === null) return;
      var blockDepth = this.blockDepth;
      this.blockDepth++;
      var candidate = currentCursor.candidate;
      if (candidate === null) return;
      var tagName = currentCursor.element.tagName;

      if (isOpenBlock(candidate) && getBlockDepthWithOffset(candidate, this.startingBlockOffset) === blockDepth) {
        this.candidate = this.remove(candidate);
        currentCursor.openBlockDepth = blockDepth;
      } else if (tagName !== 'TITLE' && tagName !== 'SCRIPT' && tagName !== 'STYLE') {
        this.clearMismatch(candidate);
      }
    };

    _proto63.__closeBlock = function __closeBlock() {
      var currentCursor = this.currentCursor;
      if (currentCursor === null) return; // openBlock is the last rehydrated open block

      var openBlockDepth = currentCursor.openBlockDepth; // this currently is the expected next open block depth

      this.blockDepth--;
      var candidate = currentCursor.candidate;
      var isRehydrating = false;

      if (candidate !== null) {
        isRehydrating = true; //assert(
        //  openBlockDepth === this.blockDepth,
        //  'when rehydrating, openBlockDepth should match this.blockDepth here'
        //);

        if (isCloseBlock(candidate) && getBlockDepthWithOffset(candidate, this.startingBlockOffset) === openBlockDepth) {
          var nextSibling = this.remove(candidate);
          this.candidate = nextSibling;
          currentCursor.openBlockDepth--;
        } else {
          // close the block and clear mismatch in parent container
          // we will be either at the end of the element
          // or at the end of our containing block
          this.clearMismatch(candidate);
          isRehydrating = false;
        }
      }

      if (isRehydrating === false) {
        // check if nextSibling matches our expected close block
        // if so, we remove the close block comment and
        // restore rehydration after clearMismatch disabled
        var _nextSibling = currentCursor.nextSibling;

        if (_nextSibling !== null && isCloseBlock(_nextSibling) && getBlockDepthWithOffset(_nextSibling, this.startingBlockOffset) === this.blockDepth) {
          // restore rehydration state
          var _candidate2 = this.remove(_nextSibling);

          this.enableRehydration(_candidate2);
          currentCursor.openBlockDepth--;
        }
      }
    };

    _proto63.__appendNode = function __appendNode(node) {
      var candidate = this.candidate; // This code path is only used when inserting precisely one node. It needs more
      // comparison logic, but we can probably lean on the cases where this code path
      // is actually used.

      if (candidate) {
        return candidate;
      } else {
        return _NewElementBuilder.prototype.__appendNode.call(this, node);
      }
    };

    _proto63.__appendHTML = function __appendHTML(html) {
      var candidateBounds = this.markerBounds();

      if (candidateBounds) {
        var first = candidateBounds.firstNode();
        var last = candidateBounds.lastNode();
        var newBounds = new ConcreteBounds(this.element, first.nextSibling, last.previousSibling);
        var possibleEmptyMarker = this.remove(first);
        this.remove(last);

        if (possibleEmptyMarker !== null && isEmpty$1(possibleEmptyMarker)) {
          this.candidate = this.remove(possibleEmptyMarker);

          if (this.candidate !== null) {
            this.clearMismatch(this.candidate);
          }
        }

        return newBounds;
      } else {
        return _NewElementBuilder.prototype.__appendHTML.call(this, html);
      }
    };

    _proto63.remove = function remove(node) {
      var element = node.parentNode;
      var next = node.nextSibling;
      element.removeChild(node);
      return next;
    };

    _proto63.markerBounds = function markerBounds() {
      var _candidate = this.candidate;

      if (_candidate && isMarker(_candidate)) {
        var first = _candidate;
        var last = first.nextSibling;

        while (last && !isMarker(last)) {
          last = last.nextSibling;
        }

        return new ConcreteBounds(this.element, first, last);
      } else {
        return null;
      }
    };

    _proto63.__appendText = function __appendText(string) {
      var candidate = this.candidate;

      if (candidate) {
        if (isTextNode(candidate)) {
          if (candidate.nodeValue !== string) {
            candidate.nodeValue = string;
          }

          this.candidate = candidate.nextSibling;
          return candidate;
        } else if (isSeparator(candidate)) {
          this.candidate = this.remove(candidate);
          return this.__appendText(string);
        } else if (isEmpty$1(candidate) && string === '') {
          this.candidate = this.remove(candidate);
          return this.__appendText(string);
        } else {
          this.clearMismatch(candidate);
          return _NewElementBuilder.prototype.__appendText.call(this, string);
        }
      } else {
        return _NewElementBuilder.prototype.__appendText.call(this, string);
      }
    };

    _proto63.__appendComment = function __appendComment(string) {
      var _candidate = this.candidate;

      if (_candidate && isComment(_candidate)) {
        if (_candidate.nodeValue !== string) {
          _candidate.nodeValue = string;
        }

        this.candidate = _candidate.nextSibling;
        return _candidate;
      } else if (_candidate) {
        this.clearMismatch(_candidate);
      }

      return _NewElementBuilder.prototype.__appendComment.call(this, string);
    };

    _proto63.__openElement = function __openElement(tag) {
      var _candidate = this.candidate;

      if (_candidate && isElement(_candidate) && isSameNodeType(_candidate, tag)) {
        this.unmatchedAttributes = [].slice.call(_candidate.attributes);
        return _candidate;
      } else if (_candidate) {
        if (isElement(_candidate) && _candidate.tagName === 'TBODY') {
          this.pushElement(_candidate, null);
          this.currentCursor.injectedOmittedNode = true;
          return this.__openElement(tag);
        }

        this.clearMismatch(_candidate);
      }

      return _NewElementBuilder.prototype.__openElement.call(this, tag);
    };

    _proto63.__setAttribute = function __setAttribute(name, value, namespace) {
      var unmatched = this.unmatchedAttributes;

      if (unmatched) {
        var attr = findByName(unmatched, name);

        if (attr) {
          if (attr.value !== value) {
            attr.value = value;
          }

          unmatched.splice(unmatched.indexOf(attr), 1);
          return;
        }
      }

      return _NewElementBuilder.prototype.__setAttribute.call(this, name, value, namespace);
    };

    _proto63.__setProperty = function __setProperty(name, value) {
      var unmatched = this.unmatchedAttributes;

      if (unmatched) {
        var attr = findByName(unmatched, name);

        if (attr) {
          if (attr.value !== value) {
            attr.value = value;
          }

          unmatched.splice(unmatched.indexOf(attr), 1);
          return;
        }
      }

      return _NewElementBuilder.prototype.__setProperty.call(this, name, value);
    };

    _proto63.__flushElement = function __flushElement(parent, constructing) {
      var unmatched = this.unmatchedAttributes;

      if (unmatched) {
        for (var i = 0; i < unmatched.length; i++) {
          this.constructing.removeAttribute(unmatched[i].name);
        }

        this.unmatchedAttributes = null;
      } else {
        _NewElementBuilder.prototype.__flushElement.call(this, parent, constructing);
      }
    };

    _proto63.willCloseElement = function willCloseElement() {
      var candidate = this.candidate,
          currentCursor = this.currentCursor;

      if (candidate !== null) {
        this.clearMismatch(candidate);
      }

      if (currentCursor && currentCursor.injectedOmittedNode) {
        this.popElement();
      }

      _NewElementBuilder.prototype.willCloseElement.call(this);
    };

    _proto63.getMarker = function getMarker(element, guid) {
      var marker = element.querySelector("script[glmr=\"" + guid + "\"]");

      if (marker) {
        return marker;
      }

      return null;
    };

    _proto63.__pushRemoteElement = function __pushRemoteElement(element, cursorId, insertBefore) {
      var marker = this.getMarker(element, cursorId);

      if (insertBefore === undefined) {
        while (element.firstChild !== null && element.firstChild !== marker) {
          this.remove(element.firstChild);
        }

        insertBefore = null;
      }

      var cursor = new RehydratingCursor(element, null, this.blockDepth);
      this[CURSOR_STACK].push(cursor);

      if (marker === null) {
        this.disableRehydration(insertBefore);
      } else {
        this.candidate = this.remove(marker);
      }

      var block = new RemoteLiveBlock(element);
      return this.pushLiveBlock(block, true);
    };

    _proto63.didAppendBounds = function didAppendBounds(bounds) {
      _NewElementBuilder.prototype.didAppendBounds.call(this, bounds);

      if (this.candidate) {
        var last = bounds.lastNode();
        this.candidate = last && last.nextSibling;
      }

      return bounds;
    };

    (0, _emberBabel.createClass)(RehydrateBuilder, [{
      key: "currentCursor",
      get: function get() {
        return this[CURSOR_STACK].current;
      }
    }, {
      key: "candidate",
      get: function get() {
        if (this.currentCursor) {
          return this.currentCursor.candidate;
        }

        return null;
      },
      set: function set(node) {
        var currentCursor = this.currentCursor;
        currentCursor.candidate = node;
      }
    }]);
    return RehydrateBuilder;
  }(NewElementBuilder);

  _exports.RehydrateBuilder = RehydrateBuilder;

  function isTextNode(node) {
    return node.nodeType === 3;
  }

  function isComment(node) {
    return node.nodeType === 8;
  }

  function isOpenBlock(node) {
    return node.nodeType === 8
    /* COMMENT_NODE */
    && node.nodeValue.lastIndexOf('%+b:', 0) === 0;
  }

  function isCloseBlock(node) {
    return node.nodeType === 8
    /* COMMENT_NODE */
    && node.nodeValue.lastIndexOf('%-b:', 0) === 0;
  }

  function getBlockDepth(node) {
    return parseInt(node.nodeValue.slice(4), 10);
  }

  function getBlockDepthWithOffset(node, offset) {
    return getBlockDepth(node) - offset;
  }

  function isElement(node) {
    return node.nodeType === 1;
  }

  function isMarker(node) {
    return node.nodeType === 8 && node.nodeValue === '%glmr%';
  }

  function isSeparator(node) {
    return node.nodeType === 8 && node.nodeValue === '%|%';
  }

  function isEmpty$1(node) {
    return node.nodeType === 8 && node.nodeValue === '% %';
  }

  function isSameNodeType(candidate, tag) {
    if (candidate.namespaceURI === "http://www.w3.org/2000/svg"
    /* SVG */
    ) {
      return candidate.tagName === tag;
    }

    return candidate.tagName === tag.toUpperCase();
  }

  function findByName(array, name) {
    for (var i = 0; i < array.length; i++) {
      var attr = array[i];
      if (attr.name === name) return attr;
    }

    return undefined;
  }

  function rehydrationBuilder(env, cursor) {
    return RehydrateBuilder.forInitialRender(env, cursor);
  }

  var ARGS_CACHES = false
  /* DEBUG */
  ? new WeakMap() : undefined;

  function getArgs(proxy) {
    return (0, _validator.getValue)(false
    /* DEBUG */
    ? ARGS_CACHES.get(proxy) : proxy.argsCache);
  }

  var SimpleArgsProxy = /*#__PURE__*/function () {
    function SimpleArgsProxy(context, computeArgs) {
      if (computeArgs === void 0) {
        computeArgs = function computeArgs() {
          return EMPTY_ARGS;
        };
      }

      var argsCache = (0, _validator.createCache)(function () {
        return computeArgs(context);
      });

      if (false
      /* DEBUG */
      ) {
        ARGS_CACHES.set(this, argsCache);
        Object.freeze(this);
      } else {
        this.argsCache = argsCache;
      }
    }

    (0, _emberBabel.createClass)(SimpleArgsProxy, [{
      key: "named",
      get: function get() {
        return getArgs(this).named || EMPTY_NAMED;
      }
    }, {
      key: "positional",
      get: function get() {
        return getArgs(this).positional || EMPTY_POSITIONAL;
      }
    }]);
    return SimpleArgsProxy;
  }(); ////////////


  function invokeHelper(context, definition, computeArgs) {
    if (false
    /* DEBUG */
    && (typeof context !== 'object' || context === null)) {
      throw new Error("Expected a context object to be passed as the first parameter to invokeHelper, got " + context);
    }

    var owner = (0, _owner2.getOwner)(context);
    var internalManager = (0, _manager5.getInternalHelperManager)(definition); // TODO: figure out why assert isn't using the TS assert thing

    if (false
    /* DEBUG */
    && !internalManager) {
      throw new Error("Expected a helper definition to be passed as the second parameter to invokeHelper, but no helper manager was found. The definition value that was passed was `" + (0, _util.debugToString)(definition) + "`. Did you use setHelperManager to associate a helper manager with this value?");
    }

    if (false
    /* DEBUG */
    && typeof internalManager === 'function') {
      throw new Error('Found a helper manager, but it was an internal built-in helper manager. `invokeHelper` does not support internal helpers yet.');
    }

    var manager = internalManager.getDelegateFor(owner);
    var args = new SimpleArgsProxy(context, computeArgs);
    var bucket = manager.createHelper(definition, args);
    var cache;

    if ((0, _manager5.hasValue)(manager)) {
      cache = (0, _validator.createCache)(function () {
        if (false
        /* DEBUG */
        && ((0, _destroyable2.isDestroying)(cache) || (0, _destroyable2.isDestroyed)(cache))) {
          throw new Error("You attempted to get the value of a helper after the helper was destroyed, which is not allowed");
        }

        return manager.getValue(bucket);
      });
      (0, _destroyable2.associateDestroyableChild)(context, cache);
    } else {
      throw new Error('TODO: unreachable, to be implemented with hasScheduledEffect');
    }

    if ((0, _manager5.hasDestroyable)(manager)) {
      var destroyable = manager.getDestroyable(bucket);
      (0, _destroyable2.associateDestroyableChild)(cache, destroyable);
    }

    return cache;
  }

  function internalHelper(helper) {
    return (0, _manager5.setInternalHelperManager)(helper, {});
  }

  var context = (0, _util.buildUntouchableThis)('`fn` helper');
  /**
    The `fn` helper allows you to ensure a function that you are passing off
    to another component, helper, or modifier has access to arguments that are
    available in the template.
  
    For example, if you have an `each` helper looping over a number of items, you
    may need to pass a function that expects to receive the item as an argument
    to a component invoked within the loop. Here's how you could use the `fn`
    helper to pass both the function and its arguments together:
  
      ```app/templates/components/items-listing.hbs
    {{#each @items as |item|}}
      <DisplayItem @item=item @select={{fn this.handleSelected item}} />
    {{/each}}
    ```
  
    ```app/components/items-list.js
    import Component from '@glimmer/component';
    import { action } from '@ember/object';
  
    export default class ItemsList extends Component {
      handleSelected = (item) => {
        // ...snip...
      }
    }
    ```
  
    In this case the `display-item` component will receive a normal function
    that it can invoke. When it invokes the function, the `handleSelected`
    function will receive the `item` and any arguments passed, thanks to the
    `fn` helper.
  
    Let's take look at what that means in a couple circumstances:
  
    - When invoked as `this.args.select()` the `handleSelected` function will
      receive the `item` from the loop as its first and only argument.
    - When invoked as `this.args.select('foo')` the `handleSelected` function
      will receive the `item` from the loop as its first argument and the
      string `'foo'` as its second argument.
  
    In the example above, we used an arrow function to ensure that
    `handleSelected` is properly bound to the `items-list`, but let's explore what
    happens if we left out the arrow function:
  
    ```app/components/items-list.js
    import Component from '@glimmer/component';
  
    export default class ItemsList extends Component {
      handleSelected(item) {
        // ...snip...
      }
    }
    ```
  
    In this example, when `handleSelected` is invoked inside the `display-item`
    component, it will **not** have access to the component instance. In other
    words, it will have no `this` context, so please make sure your functions
    are bound (via an arrow function or other means) before passing into `fn`!
  
    See also [partial application](https://en.wikipedia.org/wiki/Partial_application).
  
    @method fn
    @public
  */

  var fn = internalHelper(function (_ref67) {
    var positional = _ref67.positional;
    var callbackRef = positional[0];
    if (false
    /* DEBUG */
    ) assertCallbackIsFn(callbackRef);
    return (0, _reference.createComputeRef)(function () {
      return function () {
        var _reifyPositional = (0, _runtime.reifyPositional)(positional),
            fn = _reifyPositional[0],
            args = _reifyPositional.slice(1);

        if (false
        /* DEBUG */
        ) assertCallbackIsFn(callbackRef);

        for (var _len = arguments.length, invocationArgs = new Array(_len), _key2 = 0; _key2 < _len; _key2++) {
          invocationArgs[_key2] = arguments[_key2];
        }

        if ((0, _reference.isInvokableRef)(callbackRef)) {
          var value = args.length > 0 ? args[0] : invocationArgs[0];
          return (0, _reference.updateRef)(callbackRef, value);
        } else {
          return fn.call.apply(fn, [context].concat(args, invocationArgs));
        }
      };
    }, null, 'fn');
  });
  _exports.fn = fn;

  function assertCallbackIsFn(callbackRef) {
    if (!(callbackRef && ((0, _reference.isInvokableRef)(callbackRef) || typeof (0, _reference.valueForRef)(callbackRef) === 'function'))) {
      throw new Error("You must pass a function as the `fn` helpers first argument, you passed " + (callbackRef ? (0, _reference.valueForRef)(callbackRef) : callbackRef) + ". While rendering:\n\n" + (callbackRef === null || callbackRef === void 0 ? void 0 : callbackRef.debugLabel));
    }
  }
  /**
     Use the `{{hash}}` helper to create a hash to pass as an option to your
     components. This is specially useful for contextual components where you can
     just yield a hash:
  
     ```handlebars
     {{yield (hash
        name='Sarah'
        title=office
     )}}
     ```
  
     Would result in an object such as:
  
     ```js
     { name: 'Sarah', title: this.get('office') }
     ```
  
     Where the `title` is bound to updates of the `office` property.
  
     Note that the hash is an empty object with no prototype chain, therefore
     common methods like `toString` are not available in the resulting hash.
     If you need to use such a method, you can use the `call` or `apply`
     approach:
  
     ```js
     function toString(obj) {
       return Object.prototype.toString.apply(obj);
     }
     ```
  
     @method hash
     @param {Object} options
     @return {Object} Hash
     @public
   */


  var hash = internalHelper(function (_ref68) {
    var named = _ref68.named;
    return (0, _reference.createComputeRef)(function () {
      return (0, _runtime.reifyNamed)(named);
    }, null, 'hash');
  });
  /**
     Use the `{{array}}` helper to create an array to pass as an option to your
     components.
  
     ```handlebars
     <MyComponent @people={{array
       'Tom Dale'
       'Yehuda Katz'
       this.myOtherPerson}}
     />
     ```
      or
     ```handlebars
     {{my-component people=(array
       'Tom Dale'
       'Yehuda Katz'
       this.myOtherPerson)
     }}
     ```
  
     Would result in an object such as:
  
     ```js
     ['Tom Dale', 'Yehuda Katz', this.get('myOtherPerson')]
     ```
  
     Where the 3rd item in the array is bound to updates of the `myOtherPerson` property.
  
     @method array
     @param {Array} options
     @return {Array} Array
     @public
   */

  _exports.hash = hash;
  var array = internalHelper(function (_ref69) {
    var positional = _ref69.positional;
    return (0, _reference.createComputeRef)(function () {
      return (0, _runtime.reifyPositional)(positional);
    }, null, 'array');
  });
  /**
    Dynamically look up a property on an object. The second argument to `{{get}}`
    should have a string value, although it can be bound.
  
    For example, these two usages are equivalent:
  
    ```app/components/developer-detail.js
    import Component from '@glimmer/component';
    import { tracked } from '@glimmer/tracking';
  
    export default class extends Component {
      @tracked developer = {
        name: "Sandi Metz",
        language: "Ruby"
      }
    }
    ```
  
    ```handlebars
    {{this.developer.name}}
    {{get this.developer "name"}}
    ```
  
    If there were several facts about a person, the `{{get}}` helper can dynamically
    pick one:
  
    ```app/templates/application.hbs
    <DeveloperDetail @factName="language" />
    ```
  
    ```handlebars
    {{get this.developer @factName}}
    ```
  
    For a more complex example, this template would allow the user to switch
    between showing the user's height and weight with a click:
  
    ```app/components/developer-detail.js
    import Component from '@glimmer/component';
    import { tracked } from '@glimmer/tracking';
  
    export default class extends Component {
      @tracked developer = {
        name: "Sandi Metz",
        language: "Ruby"
      }
  
      @tracked currentFact = 'name'
  
      showFact = (fact) => {
        this.currentFact = fact;
      }
    }
    ```
  
    ```app/components/developer-detail.js
    {{get this.developer this.currentFact}}
  
    <button {{on 'click' (fn this.showFact "name")}}>Show name</button>
    <button {{on 'click' (fn this.showFact "language")}}>Show language</button>
    ```
  
    The `{{get}}` helper can also respect mutable values itself. For example:
  
    ```app/components/developer-detail.js
    <Input @value={{mut (get this.person this.currentFact)}} />
  
    <button {{on 'click' (fn this.showFact "name")}}>Show name</button>
    <button {{on 'click' (fn this.showFact "language")}}>Show language</button>
    ```
  
    Would allow the user to swap what fact is being displayed, and also edit
    that fact via a two-way mutable binding.
  
    @public
    @method get
   */

  _exports.array = array;
  var get = internalHelper(function (_ref70) {
    var positional = _ref70.positional;

    var _a, _b;

    var sourceRef = (_a = positional[0]) !== null && _a !== void 0 ? _a : _reference.UNDEFINED_REFERENCE;
    var pathRef = (_b = positional[1]) !== null && _b !== void 0 ? _b : _reference.UNDEFINED_REFERENCE;
    return (0, _reference.createComputeRef)(function () {
      var source = (0, _reference.valueForRef)(sourceRef);

      if ((0, _util.isDict)(source)) {
        return (0, _globalContext.getPath)(source, String((0, _reference.valueForRef)(pathRef)));
      }
    }, function (value) {
      var source = (0, _reference.valueForRef)(sourceRef);

      if ((0, _util.isDict)(source)) {
        return (0, _globalContext.setPath)(source, String((0, _reference.valueForRef)(pathRef)), value);
      }
    }, 'get');
  });
  _exports.get = get;

  var isEmpty$2 = function isEmpty$2(value) {
    return value === null || value === undefined || typeof value.toString !== 'function';
  };

  var normalizeTextValue = function normalizeTextValue(value) {
    if (isEmpty$2(value)) {
      return '';
    }

    return String(value);
  };
  /**
    Concatenates the given arguments into a string.
  
    Example:
  
    ```handlebars
    {{some-component name=(concat firstName " " lastName)}}
  
    {{! would pass name="<first name value> <last name value>" to the component}}
    ```
  
    or for angle bracket invocation, you actually don't need concat at all.
  
    ```handlebars
    <SomeComponent @name="{{firstName}} {{lastName}}" />
    ```
  
    @public
    @method concat
  */


  var concat = internalHelper(function (_ref71) {
    var positional = _ref71.positional;
    return (0, _reference.createComputeRef)(function () {
      return (0, _runtime.reifyPositional)(positional).map(normalizeTextValue).join('');
    }, null, 'concat');
  });
  _exports.concat = concat;
  var untouchableContext = (0, _util.buildUntouchableThis)('`on` modifier');
  /*
    Internet Explorer 11 does not support `once` and also does not support
    passing `eventOptions`. In some situations it then throws a weird script
    error, like:
  
    ```
    Could not complete the operation due to error 80020101
    ```
  
    This flag determines, whether `{ once: true }` and thus also event options in
    general are supported.
  */

  var SUPPORTS_EVENT_OPTIONS = function () {
    try {
      var div = document.createElement('div');
      var counter = 0;
      div.addEventListener('click', function () {
        return counter++;
      }, {
        once: true
      });
      var event;

      if (typeof Event === 'function') {
        event = new Event('click');
      } else {
        event = document.createEvent('Event');
        event.initEvent('click', true, true);
      }

      div.dispatchEvent(event);
      div.dispatchEvent(event);
      return counter === 1;
    } catch (error) {
      return false;
    }
  }();

  var OnModifierState = /*#__PURE__*/function () {
    function OnModifierState(element, args) {
      this.tag = (0, _validator.createUpdatableTag)();
      this.shouldUpdate = true;
      this.element = element;
      this.args = args;
    }

    var _proto64 = OnModifierState.prototype;

    _proto64.updateFromArgs = function updateFromArgs() {
      var args = this.args;

      var _reifyNamed = (0, _runtime.reifyNamed)(args.named),
          once = _reifyNamed.once,
          passive = _reifyNamed.passive,
          capture = _reifyNamed.capture;

      if (once !== this.once) {
        this.once = once;
        this.shouldUpdate = true;
      }

      if (passive !== this.passive) {
        this.passive = passive;
        this.shouldUpdate = true;
      }

      if (capture !== this.capture) {
        this.capture = capture;
        this.shouldUpdate = true;
      }

      var options;

      if (once || passive || capture) {
        options = this.options = {
          once: once,
          passive: passive,
          capture: capture
        };
      } else {
        this.options = undefined;
      }

      if (false
      /* DEBUG */
      && (args.positional[0] === undefined || typeof (0, _reference.valueForRef)(args.positional[0]) !== 'string')) {
        throw new Error('You must pass a valid DOM event name as the first argument to the `on` modifier');
      }

      var eventName = (0, _reference.valueForRef)(args.positional[0]);

      if (eventName !== this.eventName) {
        this.eventName = eventName;
        this.shouldUpdate = true;
      }

      var userProvidedCallbackReference = args.positional[1];

      if (false
      /* DEBUG */
      ) {
        if (args.positional[1] === undefined) {
          throw new Error("You must pass a function as the second argument to the `on` modifier.");
        }

        var value = (0, _reference.valueForRef)(userProvidedCallbackReference);

        if (typeof value !== 'function') {
          throw new Error("You must pass a function as the second argument to the `on` modifier, you passed " + (value === null ? 'null' : typeof value) + ". While rendering:\n\n" + userProvidedCallbackReference.debugLabel);
        }
      }

      var userProvidedCallback = (0, _reference.valueForRef)(userProvidedCallbackReference);

      if (userProvidedCallback !== this.userProvidedCallback) {
        this.userProvidedCallback = userProvidedCallback;
        this.shouldUpdate = true;
      }

      if (false
      /* DEBUG */
      && args.positional.length !== 2) {
        throw new Error("You can only pass two positional arguments (event name and callback) to the `on` modifier, but you provided " + args.positional.length + ". Consider using the `fn` helper to provide additional arguments to the `on` callback.");
      }

      var needsCustomCallback = SUPPORTS_EVENT_OPTIONS === false && once ||
      /* needs manual once implementation */
      false
      /* DEBUG */
      && passive;
      /* needs passive enforcement */

      if (this.shouldUpdate) {
        if (needsCustomCallback) {
          var _callback = this.callback = function (event) {
            if (false
            /* DEBUG */
            && passive) {
              event.preventDefault = function () {
                throw new Error("You marked this listener as 'passive', meaning that you must not call 'event.preventDefault()': \n\n" + userProvidedCallback);
              };
            }

            if (!SUPPORTS_EVENT_OPTIONS && once) {
              removeEventListener(this, eventName, _callback, options);
            }

            return userProvidedCallback.call(untouchableContext, event);
          };
        } else if (false
        /* DEBUG */
        ) {
          // prevent the callback from being bound to the element
          this.callback = userProvidedCallback.bind(untouchableContext);
        } else {
          this.callback = userProvidedCallback;
        }
      }
    };

    return OnModifierState;
  }();

  var adds = 0;
  var removes = 0;

  function removeEventListener(element, eventName, callback, options) {
    removes++;

    if (SUPPORTS_EVENT_OPTIONS) {
      // when options are supported, use them across the board
      element.removeEventListener(eventName, callback, options);
    } else if (options !== undefined && options.capture) {
      // used only in the following case:
      //
      // `{ once: true | false, passive: true | false, capture: true }
      //
      // `once` is handled via a custom callback that removes after first
      // invocation so we only care about capture here as a boolean
      element.removeEventListener(eventName, callback, true);
    } else {
      // used only in the following cases:
      //
      // * where there is no options
      // * `{ once: true | false, passive: true | false, capture: false }
      element.removeEventListener(eventName, callback);
    }
  }

  function addEventListener(element, eventName, callback, options) {
    adds++;

    if (SUPPORTS_EVENT_OPTIONS) {
      // when options are supported, use them across the board
      element.addEventListener(eventName, callback, options);
    } else if (options !== undefined && options.capture) {
      // used only in the following case:
      //
      // `{ once: true | false, passive: true | false, capture: true }
      //
      // `once` is handled via a custom callback that removes after first
      // invocation so we only care about capture here as a boolean
      element.addEventListener(eventName, callback, true);
    } else {
      // used only in the following cases:
      //
      // * where there is no options
      // * `{ once: true | false, passive: true | false, capture: false }
      element.addEventListener(eventName, callback);
    }
  }
  /**
    The `{{on}}` modifier lets you easily add event listeners (it uses
    [EventTarget.addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
    internally).
  
    For example, if you'd like to run a function on your component when a `<button>`
    in the components template is clicked you might do something like:
  
    ```app/components/like-post.hbs
    <button {{on 'click' this.saveLike}}>Like this post!</button>
    ```
  
    ```app/components/like-post.js
    import Component from '@glimmer/component';
    import { action } from '@ember/object';
  
    export default class LikePostComponent extends Component {
      saveLike = () => {
        // someone likes your post!
        // better send a request off to your server...
      }
    }
    ```
  
    ### Arguments
  
    `{{on}}` accepts two positional arguments, and a few named arguments.
  
    The positional arguments are:
  
    - `event` -- the name to use when calling `addEventListener`
    - `callback` -- the function to be passed to `addEventListener`
  
    The named arguments are:
  
    - capture -- a `true` value indicates that events of this type will be dispatched
      to the registered listener before being dispatched to any EventTarget beneath it
      in the DOM tree.
    - once -- indicates that the listener should be invoked at most once after being
      added. If true, the listener would be automatically removed when invoked.
    - passive -- if `true`, indicates that the function specified by listener will never
      call preventDefault(). If a passive listener does call preventDefault(), the user
      agent will do nothing other than generate a console warning. See
      [Improving scrolling performance with passive listeners](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Improving_scrolling_performance_with_passive_listeners)
      to learn more.
  
    The callback function passed to `{{on}}` will receive any arguments that are passed
    to the event handler. Most commonly this would be the `event` itself.
  
    If you would like to pass additional arguments to the function you should use
    the `{{fn}}` helper.
  
    For example, in our example case above if you'd like to pass in the post that
    was being liked when the button is clicked you could do something like:
  
    ```app/components/like-post.hbs
    <button {{on 'click' (fn this.saveLike @post)}}>Like this post!</button>
    ```
  
    In this case, the `saveLike` function will receive two arguments: the click event
    and the value of `@post`.
  
    ### Function Context
  
    In the example above, we used an arrow function to ensure that `likePost` is
    properly bound to the `items-list`, but let's explore what happens if we
    left out the arrow function:
  
    ```app/components/like-post.js
    import Component from '@glimmer/component';
  
    export default class LikePostComponent extends Component {
      saveLike() {
        // ...snip...
      }
    }
    ```
  
    In this example, when the button is clicked `saveLike` will be invoked,
    it will **not** have access to the component instance. In other
    words, it will have no `this` context, so please make sure your functions
    are bound (via an arrow function or other means) before passing into `on`!
  
    @method on
    @public
  */


  var OnModifierManager = /*#__PURE__*/function () {
    function OnModifierManager() {
      this.SUPPORTS_EVENT_OPTIONS = SUPPORTS_EVENT_OPTIONS;
    }

    var _proto65 = OnModifierManager.prototype;

    _proto65.getDebugName = function getDebugName() {
      return 'on';
    };

    _proto65.create = function create(_owner, element, _state, args) {
      return new OnModifierState(element, args);
    };

    _proto65.getTag = function getTag(state) {
      if (state === null) {
        return null;
      }

      return state.tag;
    };

    _proto65.install = function install(state) {
      if (state === null) {
        return;
      }

      state.updateFromArgs();
      var element = state.element,
          eventName = state.eventName,
          callback = state.callback,
          options = state.options;
      addEventListener(element, eventName, callback, options);
      (0, _destroyable2.registerDestructor)(state, function () {
        return removeEventListener(element, eventName, callback, options);
      });
      state.shouldUpdate = false;
    };

    _proto65.update = function update(state) {
      if (state === null) {
        return;
      } // stash prior state for el.removeEventListener


      var element = state.element,
          eventName = state.eventName,
          callback = state.callback,
          options = state.options;
      state.updateFromArgs();

      if (!state.shouldUpdate) {
        return;
      } // use prior state values for removal


      removeEventListener(element, eventName, callback, options); // read updated values from the state object

      addEventListener(state.element, state.eventName, state.callback, state.options);
      state.shouldUpdate = false;
    };

    _proto65.getDestroyable = function getDestroyable(state) {
      return state;
    };

    (0, _emberBabel.createClass)(OnModifierManager, [{
      key: "counters",
      get: function get() {
        return {
          adds: adds,
          removes: removes
        };
      }
    }]);
    return OnModifierManager;
  }();

  var on = (0, _manager5.setInternalModifierManager)(new OnModifierManager(), {});
  _exports.on = on;
});