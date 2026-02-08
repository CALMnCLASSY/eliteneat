define("@glimmer/manager", ["exports", "@glimmer/util", "@glimmer/reference", "@glimmer/validator", "@glimmer/destroyable", "@glimmer/owner"], function (_exports, _util, _reference, _validator, _destroyable, _owner) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CustomModifierManager = _exports.CustomHelperManager = _exports.CustomComponentManager = void 0;
  _exports.capabilityFlagsFrom = capabilityFlagsFrom;
  _exports.componentCapabilities = componentCapabilities;
  _exports.getComponentTemplate = getComponentTemplate;
  _exports.getCustomTagFor = getCustomTagFor;
  _exports.getInternalComponentManager = getInternalComponentManager;
  _exports.getInternalHelperManager = getInternalHelperManager;
  _exports.getInternalModifierManager = getInternalModifierManager;
  _exports.hasCapability = hasCapability;
  _exports.hasDestroyable = hasDestroyable;
  _exports.hasInternalComponentManager = hasInternalComponentManager;
  _exports.hasInternalHelperManager = hasInternalHelperManager;
  _exports.hasInternalModifierManager = hasInternalModifierManager;
  _exports.hasValue = hasValue;
  _exports.helperCapabilities = helperCapabilities;
  _exports.managerHasCapability = managerHasCapability;
  _exports.modifierCapabilities = modifierCapabilities;
  _exports.setComponentManager = setComponentManager;
  _exports.setComponentTemplate = setComponentTemplate;
  _exports.setCustomTagFor = setCustomTagFor;
  _exports.setHelperManager = setHelperManager;
  _exports.setInternalComponentManager = setInternalComponentManager;
  _exports.setInternalHelperManager = setInternalHelperManager;
  _exports.setInternalModifierManager = setInternalModifierManager;
  _exports.setModifierManager = setModifierManager;
  var COMPONENT_MANAGERS = new WeakMap();
  var MODIFIER_MANAGERS = new WeakMap();
  var HELPER_MANAGERS = new WeakMap(); ///////////

  var getPrototypeOf = Object.getPrototypeOf;

  function setManager(map, manager, obj) {
    if (false
    /* DEBUG */
    && (typeof obj !== 'object' || obj === null) && typeof obj !== 'function') {
      throw new Error("Attempted to set a manager on a non-object value. Managers can only be associated with objects or functions. Value was " + (0, _util.debugToString)(obj));
    }

    if (false
    /* DEBUG */
    && map.has(obj)) {
      throw new Error("Attempted to set the same type of manager multiple times on a value. You can only associate one manager of each type with a given value. Value was " + (0, _util.debugToString)(obj));
    }

    map.set(obj, manager);
    return obj;
  }

  function getManager(map, obj) {
    var pointer = obj;

    while (pointer !== undefined && pointer !== null) {
      var manager = map.get(pointer);

      if (manager !== undefined) {
        return manager;
      }

      pointer = getPrototypeOf(pointer);
    }

    return undefined;
  } ///////////


  function setInternalModifierManager(manager, definition) {
    return setManager(MODIFIER_MANAGERS, manager, definition);
  }

  function getInternalModifierManager(definition, isOptional) {
    if (false
    /* DEBUG */
    && typeof definition !== 'function' && (typeof definition !== 'object' || definition === null)) {
      throw new Error("Attempted to use a value as a modifier, but it was not an object or function. Modifier definitions must be objects or functions with an associated modifier manager. The value was: " + definition);
    }

    var manager = getManager(MODIFIER_MANAGERS, definition);

    if (manager === undefined) {
      if (isOptional === true) {
        return null;
      } else if (false
      /* DEBUG */
      ) {
        throw new Error("Attempted to load a modifier, but there wasn't a modifier manager associated with the definition. The definition was: " + (0, _util.debugToString)(definition));
      }
    }

    return manager;
  }

  function setInternalHelperManager(manager, definition) {
    return setManager(HELPER_MANAGERS, manager, definition);
  }

  function getInternalHelperManager(definition, isOptional) {
    if (false
    /* DEBUG */
    && typeof definition !== 'function' && (typeof definition !== 'object' || definition === null)) {
      throw new Error("Attempted to use a value as a helper, but it was not an object or function. Helper definitions must be objects or functions with an associated helper manager. The value was: " + definition);
    }

    var manager = getManager(HELPER_MANAGERS, definition);

    if (manager === undefined) {
      if (isOptional === true) {
        return null;
      } else if (false
      /* DEBUG */
      ) {
        throw new Error("Attempted to load a helper, but there wasn't a helper manager associated with the definition. The definition was: " + (0, _util.debugToString)(definition));
      }
    }

    return manager;
  }

  function setInternalComponentManager(factory, obj) {
    return setManager(COMPONENT_MANAGERS, factory, obj);
  }

  function getInternalComponentManager(definition, isOptional) {
    if (false
    /* DEBUG */
    && typeof definition !== 'function' && (typeof definition !== 'object' || definition === null)) {
      throw new Error("Attempted to use a value as a component, but it was not an object or function. Component definitions must be objects or functions with an associated component manager. The value was: " + definition);
    }

    var manager = getManager(COMPONENT_MANAGERS, definition);

    if (manager === undefined) {
      if (isOptional === true) {
        return null;
      } else if (false
      /* DEBUG */
      ) {
        throw new Error("Attempted to load a component, but there wasn't a component manager associated with the definition. The definition was: " + (0, _util.debugToString)(definition));
      }
    }

    return manager;
  } ///////////


  function hasInternalComponentManager(definition) {
    return getManager(COMPONENT_MANAGERS, definition) !== undefined;
  }

  function hasInternalHelperManager(definition) {
    return getManager(HELPER_MANAGERS, definition) !== undefined;
  }

  function hasInternalModifierManager(definition) {
    return getManager(MODIFIER_MANAGERS, definition) !== undefined;
  }

  var FROM_CAPABILITIES = false
  /* DEBUG */
  ? new _util._WeakSet() : undefined;

  function buildCapabilities(capabilities) {
    if (false
    /* DEBUG */
    ) {
      FROM_CAPABILITIES.add(capabilities);
      Object.freeze(capabilities);
    }

    return capabilities;
  }
  /**
   * Converts a ComponentCapabilities object into a 32-bit integer representation.
   */


  function capabilityFlagsFrom(capabilities) {
    return 0 | (capabilities.dynamicLayout ? 1
    /* DynamicLayout */
    : 0) | (capabilities.dynamicTag ? 2
    /* DynamicTag */
    : 0) | (capabilities.prepareArgs ? 4
    /* PrepareArgs */
    : 0) | (capabilities.createArgs ? 8
    /* CreateArgs */
    : 0) | (capabilities.attributeHook ? 16
    /* AttributeHook */
    : 0) | (capabilities.elementHook ? 32
    /* ElementHook */
    : 0) | (capabilities.dynamicScope ? 64
    /* DynamicScope */
    : 0) | (capabilities.createCaller ? 128
    /* CreateCaller */
    : 0) | (capabilities.updateHook ? 256
    /* UpdateHook */
    : 0) | (capabilities.createInstance ? 512
    /* CreateInstance */
    : 0) | (capabilities.wrapped ? 1024
    /* Wrapped */
    : 0) | (capabilities.willDestroy ? 2048
    /* WillDestroy */
    : 0) | (capabilities.hasSubOwner ? 4096
    /* HasSubOwner */
    : 0);
  }

  function managerHasCapability(_manager, capabilities, capability) {
    return !!(capabilities & capability);
  }

  function hasCapability(capabilities, capability) {
    return !!(capabilities & capability);
  }

  var CUSTOM_TAG_FOR = new WeakMap();

  function getCustomTagFor(obj) {
    return CUSTOM_TAG_FOR.get(obj);
  }

  function setCustomTagFor(obj, customTagFn) {
    CUSTOM_TAG_FOR.set(obj, customTagFn);
  }

  function convertToInt(prop) {
    if (typeof prop === 'symbol') return null;
    var num = Number(prop);
    if (isNaN(num)) return null;
    return num % 1 === 0 ? num : null;
  }

  function tagForNamedArg(namedArgs, key) {
    return (0, _validator.track)(function () {
      if (key in namedArgs) {
        (0, _reference.valueForRef)(namedArgs[key]);
      }
    });
  }

  function tagForPositionalArg(positionalArgs, key) {
    return (0, _validator.track)(function () {
      if (key === '[]') {
        // consume all of the tags in the positional array
        positionalArgs.forEach(_reference.valueForRef);
      }

      var parsed = convertToInt(key);

      if (parsed !== null && parsed < positionalArgs.length) {
        // consume the tag of the referenced index
        (0, _reference.valueForRef)(positionalArgs[parsed]);
      }
    });
  }

  var argsProxyFor;

  var NamedArgsProxy = /*#__PURE__*/function () {
    function NamedArgsProxy(named) {
      this.named = named;
    }

    var _proto = NamedArgsProxy.prototype;

    _proto.get = function get(_target, prop) {
      var ref = this.named[prop];

      if (ref !== undefined) {
        return (0, _reference.valueForRef)(ref);
      }
    };

    _proto.has = function has(_target, prop) {
      return prop in this.named;
    };

    _proto.ownKeys = function ownKeys() {
      return Object.keys(this.named);
    };

    _proto.isExtensible = function isExtensible() {
      return false;
    };

    _proto.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(_target, prop) {
      if (false
      /* DEBUG */
      && !(prop in this.named)) {
        throw new Error("args proxies do not have real property descriptors, so you should never need to call getOwnPropertyDescriptor yourself. This code exists for enumerability, such as in for-in loops and Object.keys(). Attempted to get the descriptor for `" + String(prop) + "`");
      }

      return {
        enumerable: true,
        configurable: true
      };
    };

    return NamedArgsProxy;
  }();

  var PositionalArgsProxy = /*#__PURE__*/function () {
    function PositionalArgsProxy(positional) {
      this.positional = positional;
    }

    var _proto2 = PositionalArgsProxy.prototype;

    _proto2.get = function get(target, prop) {
      var positional = this.positional;

      if (prop === 'length') {
        return positional.length;
      }

      var parsed = convertToInt(prop);

      if (parsed !== null && parsed < positional.length) {
        return (0, _reference.valueForRef)(positional[parsed]);
      }

      return target[prop];
    };

    _proto2.isExtensible = function isExtensible() {
      return false;
    };

    _proto2.has = function has(_target, prop) {
      var parsed = convertToInt(prop);
      return parsed !== null && parsed < this.positional.length;
    };

    return PositionalArgsProxy;
  }();

  if (_util.HAS_NATIVE_PROXY) {
    argsProxyFor = function argsProxyFor(capturedArgs, type) {
      var named = capturedArgs.named,
          positional = capturedArgs.positional;

      var getNamedTag = function getNamedTag(_obj, key) {
        return tagForNamedArg(named, key);
      };

      var getPositionalTag = function getPositionalTag(_obj, key) {
        return tagForPositionalArg(positional, key);
      };

      var namedHandler = new NamedArgsProxy(named);
      var positionalHandler = new PositionalArgsProxy(positional);
      var namedTarget = Object.create(null);
      var positionalTarget = [];

      if (false
      /* DEBUG */
      ) {
        var setHandler = function setHandler(_target, prop) {
          throw new Error("You attempted to set " + String(prop) + " on the arguments of a component, helper, or modifier. Arguments are immutable and cannot be updated directly, they always represent the values that is passed down. If you want to set default values, you should use a getter and local tracked state instead.");
        };

        var forInDebugHandler = function forInDebugHandler() {
          throw new Error("Object.keys() was called on the positional arguments array for a " + type + ", which is not supported. This function is a low-level function that should not need to be called for positional argument arrays. You may be attempting to iterate over the array using for...in instead of for...of.");
        };

        namedHandler.set = setHandler;
        positionalHandler.set = setHandler;
        positionalHandler.ownKeys = forInDebugHandler;
      }

      var namedProxy = new Proxy(namedTarget, namedHandler);
      var positionalProxy = new Proxy(positionalTarget, positionalHandler);
      setCustomTagFor(namedProxy, getNamedTag);
      setCustomTagFor(positionalProxy, getPositionalTag);
      return {
        named: namedProxy,
        positional: positionalProxy
      };
    };
  } else {
    argsProxyFor = function argsProxyFor(capturedArgs, _type) {
      var named = capturedArgs.named,
          positional = capturedArgs.positional;

      var getNamedTag = function getNamedTag(_obj, key) {
        return tagForNamedArg(named, key);
      };

      var getPositionalTag = function getPositionalTag(_obj, key) {
        return tagForPositionalArg(positional, key);
      };

      var namedProxy = {};
      var positionalProxy = [];
      setCustomTagFor(namedProxy, getNamedTag);
      setCustomTagFor(positionalProxy, getPositionalTag);
      Object.keys(named).forEach(function (name) {
        Object.defineProperty(namedProxy, name, {
          enumerable: true,
          configurable: true,
          get: function get() {
            return (0, _reference.valueForRef)(named[name]);
          }
        });
      });
      positional.forEach(function (ref, index) {
        Object.defineProperty(positionalProxy, index, {
          enumerable: true,
          configurable: true,
          get: function get() {
            return (0, _reference.valueForRef)(ref);
          }
        });
      });

      if (false
      /* DEBUG */
      ) {
        // Prevent mutations in development mode. This will not prevent the
        // proxy from updating, but will prevent assigning new values or pushing
        // for instance.
        Object.freeze(namedProxy);
        Object.freeze(positionalProxy);
      }

      return {
        named: namedProxy,
        positional: positionalProxy
      };
    };
  }

  var CAPABILITIES = {
    dynamicLayout: false,
    dynamicTag: false,
    prepareArgs: false,
    createArgs: true,
    attributeHook: false,
    elementHook: false,
    createCaller: false,
    dynamicScope: true,
    updateHook: true,
    createInstance: true,
    wrapped: false,
    willDestroy: false,
    hasSubOwner: false
  };

  function componentCapabilities(managerAPI, options) {
    if (options === void 0) {
      options = {};
    }

    if (false
    /* DEBUG */
    && managerAPI !== '3.4' && managerAPI !== '3.13') {
      throw new Error('Invalid component manager compatibility specified');
    }

    var updateHook = true;

    if (managerAPI === '3.13') {
      updateHook = Boolean(options.updateHook);
    }

    return buildCapabilities({
      asyncLifeCycleCallbacks: Boolean(options.asyncLifecycleCallbacks),
      destructor: Boolean(options.destructor),
      updateHook: updateHook
    });
  }

  function hasAsyncLifeCycleCallbacks(delegate) {
    return delegate.capabilities.asyncLifeCycleCallbacks;
  }

  function hasUpdateHook(delegate) {
    return delegate.capabilities.updateHook;
  }

  function hasAsyncUpdateHook(delegate) {
    return hasAsyncLifeCycleCallbacks(delegate) && hasUpdateHook(delegate);
  }

  function hasDestructors(delegate) {
    return delegate.capabilities.destructor;
  }
  /**
    The CustomComponentManager allows addons to provide custom component
    implementations that integrate seamlessly into Ember. This is accomplished
    through a delegate, registered with the custom component manager, which
    implements a set of hooks that determine component behavior.
  
    To create a custom component manager, instantiate a new CustomComponentManager
    class and pass the delegate as the first argument:
  
    ```js
    let manager = new CustomComponentManager({
      // ...delegate implementation...
    });
    ```
  
    ## Delegate Hooks
  
    Throughout the lifecycle of a component, the component manager will invoke
    delegate hooks that are responsible for surfacing those lifecycle changes to
    the end developer.
  
    * `create()` - invoked when a new instance of a component should be created
    * `update()` - invoked when the arguments passed to a component change
    * `getContext()` - returns the object that should be
  */


  var CustomComponentManager = /*#__PURE__*/function () {
    function CustomComponentManager(factory) {
      this.factory = factory;
      this.componentManagerDelegates = new WeakMap();
    }

    var _proto3 = CustomComponentManager.prototype;

    _proto3.getDelegateFor = function getDelegateFor(owner) {
      var componentManagerDelegates = this.componentManagerDelegates;
      var delegate = componentManagerDelegates.get(owner);

      if (delegate === undefined) {
        var factory = this.factory;
        delegate = factory(owner);

        if (false
        /* DEBUG */
        && !FROM_CAPABILITIES.has(delegate.capabilities)) {
          // TODO: This error message should make sense in both Ember and Glimmer https://github.com/glimmerjs/glimmer-vm/issues/1200
          throw new Error("Custom component managers must have a `capabilities` property that is the result of calling the `capabilities('3.4' | '3.13')` (imported via `import { capabilities } from '@ember/component';`). Received: `" + JSON.stringify(delegate.capabilities) + "` for: `" + delegate + "`");
        }

        componentManagerDelegates.set(owner, delegate);
      }

      return delegate;
    };

    _proto3.create = function create(owner, definition, vmArgs) {
      var delegate = this.getDelegateFor(owner);
      var args = argsProxyFor(vmArgs.capture(), 'component');
      var component;

      if (false
      /* DEBUG */
      && _validator.deprecateMutationsInTrackingTransaction !== undefined) {
        (0, _validator.deprecateMutationsInTrackingTransaction)(function () {
          component = delegate.createComponent(definition, args);
        });
      } else {
        component = delegate.createComponent(definition, args);
      }

      return new CustomComponentState(component, delegate, args);
    };

    _proto3.getDebugName = function getDebugName(definition) {
      return typeof definition === 'function' ? definition.name : definition.toString();
    };

    _proto3.update = function update(bucket) {
      var delegate = bucket.delegate;

      if (hasUpdateHook(delegate)) {
        var component = bucket.component,
            args = bucket.args;
        delegate.updateComponent(component, args);
      }
    };

    _proto3.didCreate = function didCreate(_ref) {
      var component = _ref.component,
          delegate = _ref.delegate;

      if (hasAsyncLifeCycleCallbacks(delegate)) {
        delegate.didCreateComponent(component);
      }
    };

    _proto3.didUpdate = function didUpdate(_ref2) {
      var component = _ref2.component,
          delegate = _ref2.delegate;

      if (hasAsyncUpdateHook(delegate)) {
        delegate.didUpdateComponent(component);
      }
    };

    _proto3.didRenderLayout = function didRenderLayout() {};

    _proto3.didUpdateLayout = function didUpdateLayout() {};

    _proto3.getSelf = function getSelf(_ref3) {
      var component = _ref3.component,
          delegate = _ref3.delegate;
      return (0, _reference.createConstRef)(delegate.getContext(component), 'this');
    };

    _proto3.getDestroyable = function getDestroyable(bucket) {
      var delegate = bucket.delegate;

      if (hasDestructors(delegate)) {
        var component = bucket.component;
        (0, _destroyable.registerDestructor)(bucket, function () {
          return delegate.destroyComponent(component);
        });
        return bucket;
      }

      return null;
    };

    _proto3.getCapabilities = function getCapabilities() {
      return CAPABILITIES;
    };

    return CustomComponentManager;
  }();
  /**
   * Stores internal state about a component instance after it's been created.
   */


  _exports.CustomComponentManager = CustomComponentManager;

  var CustomComponentState = function CustomComponentState(component, delegate, args) {
    this.component = component;
    this.delegate = delegate;
    this.args = args;
  };

  function modifierCapabilities(managerAPI, optionalFeatures) {
    if (optionalFeatures === void 0) {
      optionalFeatures = {};
    }

    if (false
    /* DEBUG */
    && managerAPI !== '3.13' && managerAPI !== '3.22') {
      throw new Error('Invalid modifier manager compatibility specified');
    }

    return buildCapabilities({
      disableAutoTracking: Boolean(optionalFeatures.disableAutoTracking),
      useArgsProxy: managerAPI === '3.13' ? false : true,
      // This capability is used in Ember, exclusively in resolution mode. See the
      // Ember glimmer resolver for details.
      passFactoryToCreate: managerAPI === '3.13'
    });
  }
  /**
    The CustomModifierManager allows addons to provide custom modifier
    implementations that integrate seamlessly into Ember. This is accomplished
    through a delegate, registered with the custom modifier manager, which
    implements a set of hooks that determine modifier behavior.
    To create a custom modifier manager, instantiate a new CustomModifierManager
    class and pass the delegate as the first argument:
  
    ```js
    let manager = new CustomModifierManager({
      // ...delegate implementation...
    });
    ```
  
    ## Delegate Hooks
  
    Throughout the lifecycle of a modifier, the modifier manager will invoke
    delegate hooks that are responsible for surfacing those lifecycle changes to
    the end developer.
    * `createModifier()` - invoked when a new instance of a modifier should be created
    * `installModifier()` - invoked when the modifier is installed on the element
    * `updateModifier()` - invoked when the arguments passed to a modifier change
    * `destroyModifier()` - invoked when the modifier is about to be destroyed
  */


  var CustomModifierManager = /*#__PURE__*/function () {
    function CustomModifierManager(factory) {
      this.factory = factory;
      this.componentManagerDelegates = new WeakMap();
    }

    var _proto4 = CustomModifierManager.prototype;

    _proto4.getDelegateFor = function getDelegateFor(owner) {
      var componentManagerDelegates = this.componentManagerDelegates;
      var delegate = componentManagerDelegates.get(owner);

      if (delegate === undefined) {
        var factory = this.factory;
        delegate = factory(owner);

        if (false
        /* DEBUG */
        && !FROM_CAPABILITIES.has(delegate.capabilities)) {
          // TODO: This error message should make sense in both Ember and Glimmer https://github.com/glimmerjs/glimmer-vm/issues/1200
          throw new Error("Custom modifier managers must have a `capabilities` property that is the result of calling the `capabilities('3.13' | '3.22')` (imported via `import { capabilities } from '@ember/modifier';`). Received: `" + JSON.stringify(delegate.capabilities) + "` for: `" + delegate + "`");
        }

        componentManagerDelegates.set(owner, delegate);
      }

      return delegate;
    };

    _proto4.create = function create(owner, element, definition, capturedArgs) {
      var delegate = this.getDelegateFor(owner);
      var _delegate$capabilitie = delegate.capabilities,
          useArgsProxy = _delegate$capabilitie.useArgsProxy,
          passFactoryToCreate = _delegate$capabilitie.passFactoryToCreate;
      var argsProxy = argsProxyFor(capturedArgs, 'modifier');
      var args = useArgsProxy ? argsProxy : reifyArgs(capturedArgs);
      var instance;
      var factoryOrDefinition = definition;

      if (passFactoryToCreate) {
        // Make a fake factory. While not perfect, this should generally prevent
        // breakage in users of older modifier capabilities.
        factoryOrDefinition = {
          create: function create(args) {
            var params = (0, _util.assign)({}, args);
            (0, _owner.setOwner)(params, owner);
            return definition.create(args);
          },
          class: definition
        };
      }

      if (false
      /* DEBUG */
      && _validator.deprecateMutationsInTrackingTransaction !== undefined) {
        (0, _validator.deprecateMutationsInTrackingTransaction)(function () {
          instance = delegate.createModifier(factoryOrDefinition, args);
        });
      } else {
        instance = delegate.createModifier(factoryOrDefinition, args);
      }

      var tag = (0, _validator.createUpdatableTag)();
      var state;

      if (useArgsProxy) {
        state = {
          tag: tag,
          element: element,
          delegate: delegate,
          args: args,
          modifier: instance
        };
      } else {
        state = {
          tag: tag,
          element: element,
          modifier: instance,
          delegate: delegate,

          get args() {
            return reifyArgs(capturedArgs);
          }

        };
      }

      if (false
      /* DEBUG */
      ) {
        state.debugName = typeof definition === 'function' ? definition.name : definition.toString();
      }

      (0, _destroyable.registerDestructor)(state, function () {
        return delegate.destroyModifier(instance, argsProxy);
      });
      return state;
    };

    _proto4.getDebugName = function getDebugName(_ref4) {
      var debugName = _ref4.debugName;
      return debugName;
    };

    _proto4.getTag = function getTag(_ref5) {
      var tag = _ref5.tag;
      return tag;
    };

    _proto4.install = function install(_ref6) {
      var element = _ref6.element,
          args = _ref6.args,
          modifier = _ref6.modifier,
          delegate = _ref6.delegate;
      var capabilities = delegate.capabilities;

      if (capabilities.disableAutoTracking === true) {
        (0, _validator.untrack)(function () {
          return delegate.installModifier(modifier, element, args);
        });
      } else {
        delegate.installModifier(modifier, element, args);
      }
    };

    _proto4.update = function update(_ref7) {
      var args = _ref7.args,
          modifier = _ref7.modifier,
          delegate = _ref7.delegate;
      var capabilities = delegate.capabilities;

      if (capabilities.disableAutoTracking === true) {
        (0, _validator.untrack)(function () {
          return delegate.updateModifier(modifier, args);
        });
      } else {
        delegate.updateModifier(modifier, args);
      }
    };

    _proto4.getDestroyable = function getDestroyable(state) {
      return state;
    };

    return CustomModifierManager;
  }();

  _exports.CustomModifierManager = CustomModifierManager;

  function reifyArgs(_ref8) {
    var named = _ref8.named,
        positional = _ref8.positional;
    var reifiedNamed = (0, _util.dict)();

    for (var key in named) {
      reifiedNamed[key] = (0, _reference.valueForRef)(named[key]);
    }

    var reifiedPositional = positional.map(_reference.valueForRef);
    return {
      named: reifiedNamed,
      positional: reifiedPositional
    };
  }

  function helperCapabilities(managerAPI, options) {
    if (options === void 0) {
      options = {};
    }

    if (false
    /* DEBUG */
    && managerAPI !== '3.23') {
      throw new Error('Invalid helper manager compatibility specified');
    }

    if (false
    /* DEBUG */
    && (!(options.hasValue || options.hasScheduledEffect) || options.hasValue && options.hasScheduledEffect)) {
      throw new Error('You must pass either the `hasValue` OR the `hasScheduledEffect` capability when defining a helper manager. Passing neither, or both, is not permitted.');
    }

    if (false
    /* DEBUG */
    && options.hasScheduledEffect) {
      throw new Error('The `hasScheduledEffect` capability has not yet been implemented for helper managers. Please pass `hasValue` instead');
    }

    return buildCapabilities({
      hasValue: Boolean(options.hasValue),
      hasDestroyable: Boolean(options.hasDestroyable),
      hasScheduledEffect: Boolean(options.hasScheduledEffect)
    });
  } ////////////


  function hasValue(manager) {
    return manager.capabilities.hasValue;
  }

  function hasDestroyable(manager) {
    return manager.capabilities.hasDestroyable;
  } ////////////


  var CustomHelperManager = /*#__PURE__*/function () {
    function CustomHelperManager(factory) {
      this.factory = factory;
      this.helperManagerDelegates = new WeakMap();
      this.undefinedDelegate = null;
    }

    var _proto5 = CustomHelperManager.prototype;

    _proto5.getDelegateForOwner = function getDelegateForOwner(owner) {
      var delegate = this.helperManagerDelegates.get(owner);

      if (delegate === undefined) {
        var factory = this.factory;
        delegate = factory(owner);

        if (false
        /* DEBUG */
        && !FROM_CAPABILITIES.has(delegate.capabilities)) {
          // TODO: This error message should make sense in both Ember and Glimmer https://github.com/glimmerjs/glimmer-vm/issues/1200
          throw new Error("Custom helper managers must have a `capabilities` property that is the result of calling the `capabilities('3.23')` (imported via `import { capabilities } from '@ember/helper';`). Received: `" + JSON.stringify(delegate.capabilities) + "` for: `" + delegate + "`");
        }

        this.helperManagerDelegates.set(owner, delegate);
      }

      return delegate;
    };

    _proto5.getDelegateFor = function getDelegateFor(owner) {
      if (owner === undefined) {
        var undefinedDelegate = this.undefinedDelegate;

        if (undefinedDelegate === null) {
          var factory = this.factory;
          this.undefinedDelegate = undefinedDelegate = factory(undefined);
        }

        return undefinedDelegate;
      } else {
        return this.getDelegateForOwner(owner);
      }
    };

    _proto5.getHelper = function getHelper(definition) {
      var _this = this;

      return function (capturedArgs, owner) {
        var _a, _b;

        var manager = _this.getDelegateFor(owner);

        var args = argsProxyFor(capturedArgs, 'helper');
        var bucket = manager.createHelper(definition, args);

        if (hasValue(manager)) {
          var cache = (0, _reference.createComputeRef)(function () {
            return manager.getValue(bucket);
          }, null, false
          /* DEBUG */
          && manager.getDebugName && manager.getDebugName(definition));

          if (hasDestroyable(manager)) {
            (0, _destroyable.associateDestroyableChild)(cache, manager.getDestroyable(bucket));
          }

          return cache;
        } else if (hasDestroyable(manager)) {
          var ref = (0, _reference.createConstRef)(undefined, false
          /* DEBUG */
          && ((_b = (_a = manager.getDebugName) === null || _a === void 0 ? void 0 : _a.call(manager, definition)) !== null && _b !== void 0 ? _b : 'unknown helper'));
          (0, _destroyable.associateDestroyableChild)(ref, manager.getDestroyable(bucket));
          return ref;
        } else {
          return _reference.UNDEFINED_REFERENCE;
        }
      };
    };

    return CustomHelperManager;
  }();

  _exports.CustomHelperManager = CustomHelperManager;

  function setComponentManager(factory, obj) {
    return setInternalComponentManager(new CustomComponentManager(factory), obj);
  }

  function setModifierManager(factory, obj) {
    return setInternalModifierManager(new CustomModifierManager(factory), obj);
  }

  function setHelperManager(factory, obj) {
    return setInternalHelperManager(new CustomHelperManager(factory), obj);
  }

  var TEMPLATES = new WeakMap();
  var getPrototypeOf$1 = Object.getPrototypeOf;

  function setComponentTemplate(factory, obj) {
    if (false
    /* DEBUG */
    && !(obj !== null && (typeof obj === 'object' || typeof obj === 'function'))) {
      throw new Error("Cannot call `setComponentTemplate` on `" + (0, _util.debugToString)(obj) + "`");
    }

    if (false
    /* DEBUG */
    && TEMPLATES.has(obj)) {
      throw new Error("Cannot call `setComponentTemplate` multiple times on the same class (`" + (0, _util.debugToString)(obj) + "`)");
    }

    TEMPLATES.set(obj, factory);
    return obj;
  }

  function getComponentTemplate(obj) {
    var pointer = obj;

    while (pointer !== null) {
      var template = TEMPLATES.get(pointer);

      if (template !== undefined) {
        return template;
      }

      pointer = getPrototypeOf$1(pointer);
    }

    return undefined;
  }
});