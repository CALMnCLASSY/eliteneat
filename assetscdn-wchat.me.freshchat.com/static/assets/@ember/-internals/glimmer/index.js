define("@ember/-internals/glimmer/index", ["exports", "ember-babel", "@ember/polyfills", "@glimmer/opcode-compiler", "@ember/-internals/metal", "@ember/debug", "@ember/deprecated-features", "@ember/string", "@glimmer/reference", "@glimmer/validator", "@ember/-internals/views", "@glimmer/destroyable", "@glimmer/manager", "@ember/-internals/utils", "@ember/instrumentation", "@ember/runloop", "@glimmer/util", "@ember/-internals/owner", "@glimmer/runtime", "@ember/-internals/runtime", "@ember/-internals/browser-environment", "@ember/engine", "@ember/service", "@ember/object", "@ember/-internals/environment", "@ember/-internals/container", "@glimmer/node", "@ember/-internals/glimmer", "@glimmer/global-context", "@ember/-internals/routing", "@ember/error", "@glimmer/program", "rsvp"], function (_exports, _emberBabel, _polyfills, _opcodeCompiler, _metal, _debug, _deprecatedFeatures, _string, _reference, _validator, _views, _destroyable, _manager2, _utils, _instrumentation, _runloop, _util, _owner2, _runtime, _runtime2, _browserEnvironment, _engine, _service, _object, _environment2, _container, _node, _glimmer, _globalContext, _routing, _error, _program, _rsvp) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Component = _exports.Checkbox = void 0;
  Object.defineProperty(_exports, "DOMChanges", {
    enumerable: true,
    get: function get() {
      return _runtime.DOMChanges;
    }
  });
  Object.defineProperty(_exports, "DOMTreeConstruction", {
    enumerable: true,
    get: function get() {
      return _runtime.DOMTreeConstruction;
    }
  });
  _exports.LinkComponent = _exports.Input = _exports.INVOKE = _exports.Helper = void 0;
  Object.defineProperty(_exports, "NodeDOMTreeConstruction", {
    enumerable: true,
    get: function get() {
      return _node.NodeDOMTreeConstruction;
    }
  });
  _exports.TextField = _exports.TextArea = _exports.SafeString = _exports.RootTemplate = _exports.Renderer = _exports.OutletView = void 0;
  _exports._resetRenderers = _resetRenderers;
  _exports.componentCapabilities = void 0;
  _exports.escapeExpression = escapeExpression;
  _exports.getTemplate = getTemplate;
  _exports.getTemplates = getTemplates;
  _exports.hasTemplate = hasTemplate;
  _exports.helper = helper;
  _exports.htmlSafe = htmlSafe;
  _exports.isHTMLSafe = isHTMLSafe$1;
  Object.defineProperty(_exports, "isSerializationFirstNode", {
    enumerable: true,
    get: function get() {
      return _runtime.isSerializationFirstNode;
    }
  });
  _exports.modifierCapabilities = void 0;
  _exports.renderSettled = renderSettled;
  _exports.setComponentManager = setComponentManager$1;
  _exports.setTemplate = setTemplate;
  _exports.setTemplates = setTemplates;
  _exports.setupApplicationRegistry = setupApplicationRegistry;
  _exports.setupEngineRegistry = setupEngineRegistry;
  Object.defineProperty(_exports, "template", {
    enumerable: true,
    get: function get() {
      return _opcodeCompiler.templateFactory;
    }
  });
  Object.defineProperty(_exports, "templateCacheCounters", {
    enumerable: true,
    get: function get() {
      return _opcodeCompiler.templateCacheCounters;
    }
  });

  var _CoreView$extend, _templateObject, _templateObject2, _templateObject3, _templateObject4;

  var RootTemplate = (0, _opcodeCompiler.templateFactory)({
    "id": "9BtKrod8",
    "block": "[[[46,[30,0],null,null,null]],[],false,[\"component\"]]",
    "moduleName": "packages/@ember/-internals/glimmer/lib/templates/root.hbs",
    "isStrictMode": false
  });
  _exports.RootTemplate = RootTemplate;

  function isTemplateFactory(template) {
    return typeof template === 'function';
  }
  /**
  @module @ember/template
  */


  var SafeString = /*#__PURE__*/function () {
    function SafeString(string) {
      this.string = string;
    }

    var _proto = SafeString.prototype;

    _proto.toString = function toString() {
      return "" + this.string;
    };

    _proto.toHTML = function toHTML() {
      return this.toString();
    };

    return SafeString;
  }();

  _exports.SafeString = SafeString;
  var escape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  var possible = /[&<>"'`=]/;
  var badChars = /[&<>"'`=]/g;

  function escapeChar(chr) {
    return escape[chr];
  }

  function escapeExpression(string) {
    if (typeof string !== 'string') {
      // don't escape SafeStrings, since they're already safe
      if (string && string.toHTML) {
        return string.toHTML();
      } else if (string === null || string === undefined) {
        return '';
      } else if (!string) {
        return String(string);
      } // Force a string conversion as this will be done by the append regardless and
      // the regex test will do this transparently behind the scenes, causing issues if
      // an object's to string has escaped characters in it.


      string = String(string);
    }

    if (!possible.test(string)) {
      return string;
    }

    return string.replace(badChars, escapeChar);
  }
  /**
    Mark a string as safe for unescaped output with Ember templates. If you
    return HTML from a helper, use this function to
    ensure Ember's rendering layer does not escape the HTML.
  
    ```javascript
    import { htmlSafe } from '@ember/template';
  
    htmlSafe('<div>someString</div>')
    ```
  
    @method htmlSafe
    @for @ember/template
    @static
    @return {SafeString} A string that will not be HTML escaped by Handlebars.
    @public
  */


  function htmlSafe(str) {
    if (str === null || str === undefined) {
      str = '';
    } else if (typeof str !== 'string') {
      str = String(str);
    }

    return new SafeString(str);
  }
  /**
    Detects if a string was decorated using `htmlSafe`.
  
    ```javascript
    import { htmlSafe, isHTMLSafe } from '@ember/template';
  
    var plainString = 'plain string',
        safeString = htmlSafe('<div>someValue</div>');
  
    isHTMLSafe(plainString); // false
    isHTMLSafe(safeString);  // true
    ```
  
    @method isHTMLSafe
    @for @ember/template
    @static
    @return {Boolean} `true` if the string was decorated with `htmlSafe`, `false` otherwise.
    @public
  */


  function isHTMLSafe$1(str) {
    return str !== null && typeof str === 'object' && typeof str.toHTML === 'function';
  }

  function referenceForParts(rootRef, parts) {
    var isAttrs = parts[0] === 'attrs'; // TODO deprecate this

    if (isAttrs) {
      parts.shift();

      if (parts.length === 1) {
        return (0, _reference.childRefFor)(rootRef, parts[0]);
      }
    }

    return (0, _reference.childRefFromParts)(rootRef, parts);
  }

  function parseAttributeBinding(microsyntax) {
    var colonIndex = microsyntax.indexOf(':');

    if (colonIndex === -1) {
      (false && !(microsyntax !== 'class') && (0, _debug.assert)('You cannot use class as an attributeBinding, use classNameBindings instead.', microsyntax !== 'class'));
      return [microsyntax, microsyntax, true];
    } else {
      var prop = microsyntax.substring(0, colonIndex);
      var attribute = microsyntax.substring(colonIndex + 1);
      (false && !(attribute !== 'class') && (0, _debug.assert)('You cannot use class as an attributeBinding, use classNameBindings instead.', attribute !== 'class'));
      return [prop, attribute, false];
    }
  }

  function installAttributeBinding(component, rootRef, parsed, operations) {
    var prop = parsed[0],
        attribute = parsed[1],
        isSimple = parsed[2];

    if (attribute === 'id') {
      var elementId = (0, _metal.get)(component, prop);

      if (elementId === undefined || elementId === null) {
        elementId = component.elementId;
      }

      elementId = (0, _reference.createPrimitiveRef)(elementId);
      operations.setAttribute('id', elementId, true, null);
      return;
    }

    var isPath = prop.indexOf('.') > -1;
    var reference = isPath ? referenceForParts(rootRef, prop.split('.')) : (0, _reference.childRefFor)(rootRef, prop);
    (false && !(!(isSimple && isPath)) && (0, _debug.assert)("Illegal attributeBinding: '" + prop + "' is not a valid attribute name.", !(isSimple && isPath)));

    if (_deprecatedFeatures.EMBER_COMPONENT_IS_VISIBLE && attribute === 'style' && createStyleBindingRef !== undefined) {
      reference = createStyleBindingRef(reference, (0, _reference.childRefFor)(rootRef, 'isVisible'));
    }

    operations.setAttribute(attribute, reference, false, null);
  }

  var DISPLAY_NONE = 'display: none;';
  var SAFE_DISPLAY_NONE = htmlSafe(DISPLAY_NONE);
  var createStyleBindingRef;
  var installIsVisibleBinding;

  if (_deprecatedFeatures.EMBER_COMPONENT_IS_VISIBLE) {
    createStyleBindingRef = function createStyleBindingRef(inner, isVisibleRef) {
      return (0, _reference.createComputeRef)(function () {
        var value = (0, _reference.valueForRef)(inner);
        var isVisible = (0, _reference.valueForRef)(isVisibleRef);

        if (false
        /* DEBUG */
        && isVisible !== undefined) {
          (false && !(false) && (0, _debug.deprecate)("The `isVisible` property on classic component classes is deprecated. Was accessed:\n\n" + (0, _validator.logTrackingStack)(), false, {
            id: 'ember-component.is-visible',
            until: '4.0.0',
            url: 'https://deprecations.emberjs.com/v3.x#toc_ember-component-is-visible',
            for: 'ember-source',
            since: {
              enabled: '3.15.0-beta.1'
            }
          }));
        }

        if (isVisible !== false) {
          return value;
        } else if (!value) {
          return SAFE_DISPLAY_NONE;
        } else {
          var style = value + ' ' + DISPLAY_NONE;
          return isHTMLSafe$1(value) ? htmlSafe(style) : style;
        }
      });
    };

    installIsVisibleBinding = function installIsVisibleBinding(rootRef, operations) {
      operations.setAttribute('style', createStyleBindingRef(_reference.UNDEFINED_REFERENCE, (0, _reference.childRefFor)(rootRef, 'isVisible')), false, null);
    };
  }

  function createClassNameBindingRef(rootRef, microsyntax, operations) {
    var _microsyntax$split = microsyntax.split(':'),
        prop = _microsyntax$split[0],
        truthy = _microsyntax$split[1],
        falsy = _microsyntax$split[2];

    var isStatic = prop === '';

    if (isStatic) {
      operations.setAttribute('class', (0, _reference.createPrimitiveRef)(truthy), true, null);
    } else {
      var isPath = prop.indexOf('.') > -1;
      var parts = isPath ? prop.split('.') : [];
      var value = isPath ? referenceForParts(rootRef, parts) : (0, _reference.childRefFor)(rootRef, prop);
      var ref;

      if (truthy === undefined) {
        ref = createSimpleClassNameBindingRef(value, isPath ? parts[parts.length - 1] : prop);
      } else {
        ref = createColonClassNameBindingRef(value, truthy, falsy);
      }

      operations.setAttribute('class', ref, false, null);
    }
  }

  function createSimpleClassNameBindingRef(inner, path) {
    var dasherizedPath;
    return (0, _reference.createComputeRef)(function () {
      var value = (0, _reference.valueForRef)(inner);

      if (value === true) {
        (false && !(path !== undefined) && (0, _debug.assert)('You must pass a path when binding a to a class name using classNameBindings', path !== undefined));
        return dasherizedPath || (dasherizedPath = (0, _string.dasherize)(path));
      } else if (value || value === 0) {
        return String(value);
      } else {
        return null;
      }
    });
  }

  function createColonClassNameBindingRef(inner, truthy, falsy) {
    return (0, _reference.createComputeRef)(function () {
      return (0, _reference.valueForRef)(inner) ? truthy : falsy;
    });
  }

  function NOOP() {}
  /**
    @module ember
  */

  /**
    Represents the internal state of the component.
  
    @class ComponentStateBucket
    @private
  */


  var ComponentStateBucket = /*#__PURE__*/function () {
    function ComponentStateBucket(component, args, argsTag, finalizer, hasWrappedElement, isInteractive) {
      var _this = this;

      this.component = component;
      this.args = args;
      this.argsTag = argsTag;
      this.finalizer = finalizer;
      this.hasWrappedElement = hasWrappedElement;
      this.isInteractive = isInteractive;
      this.classRef = null;
      this.classRef = null;
      this.argsRevision = args === null ? 0 : (0, _validator.valueForTag)(argsTag);
      this.rootRef = (0, _reference.createConstRef)(component, 'this');
      (0, _destroyable.registerDestructor)(this, function () {
        return _this.willDestroy();
      }, true);
      (0, _destroyable.registerDestructor)(this, function () {
        return _this.component.destroy();
      });
    }

    var _proto2 = ComponentStateBucket.prototype;

    _proto2.willDestroy = function willDestroy() {
      var component = this.component,
          isInteractive = this.isInteractive;

      if (isInteractive) {
        (0, _validator.beginUntrackFrame)();
        component.trigger('willDestroyElement');
        component.trigger('willClearRender');
        (0, _validator.endUntrackFrame)();
        var element = (0, _views.getViewElement)(component);

        if (element) {
          (0, _views.clearElementView)(element);
          (0, _views.clearViewElement)(component);
        }
      }

      component.renderer.unregister(component);
    };

    _proto2.finalize = function finalize() {
      var finalizer = this.finalizer;
      finalizer();
      this.finalizer = NOOP;
    };

    return ComponentStateBucket;
  }();

  function internalHelper(helper) {
    return (0, _manager2.setInternalHelperManager)(helper, {});
  }
  /**
  @module ember
  */


  var ACTIONS = new _util._WeakSet();
  var INVOKE = (0, _utils.symbol)('INVOKE');
  /**
    The `{{action}}` helper provides a way to pass triggers for behavior (usually
    just a function) between components, and into components from controllers.
  
    ### Passing functions with the action helper
  
    There are three contexts an action helper can be used in. The first two
    contexts to discuss are attribute context, and Handlebars value context.
  
    ```handlebars
    {{! An example of attribute context }}
    <div onclick={{action "save"}}></div>
    {{! Examples of Handlebars value context }}
    {{input on-input=(action "save")}}
    {{yield (action "refreshData") andAnotherParam}}
    ```
  
    In these contexts,
    the helper is called a "closure action" helper. Its behavior is simple:
    If passed a function name, read that function off the `actions` property
    of the current context. Once that function is read, or immediately if a function was
    passed, create a closure over that function and any arguments.
    The resulting value of an action helper used this way is simply a function.
  
    For example, in the attribute context:
  
    ```handlebars
    {{! An example of attribute context }}
    <div onclick={{action "save"}}></div>
    ```
  
    The resulting template render logic would be:
  
    ```js
    var div = document.createElement('div');
    var actionFunction = (function(context){
      return function() {
        return context.actions.save.apply(context, arguments);
      };
    })(context);
    div.onclick = actionFunction;
    ```
  
    Thus when the div is clicked, the action on that context is called.
    Because the `actionFunction` is just a function, closure actions can be
    passed between components and still execute in the correct context.
  
    Here is an example action handler on a component:
  
    ```app/components/my-component.js
    import Component from '@glimmer/component';
    import { action } from '@ember/object';
  
    export default class extends Component {
      @action
      save() {
        this.model.save();
      }
    }
    ```
  
    Actions are always looked up on the `actions` property of the current context.
    This avoids collisions in the naming of common actions, such as `destroy`.
    Two options can be passed to the `action` helper when it is used in this way.
  
    * `target=someProperty` will look to `someProperty` instead of the current
      context for the `actions` hash. This can be useful when targeting a
      service for actions.
    * `value="target.value"` will read the path `target.value` off the first
      argument to the action when it is called and rewrite the first argument
      to be that value. This is useful when attaching actions to event listeners.
  
    ### Invoking an action
  
    Closure actions curry both their scope and any arguments. When invoked, any
    additional arguments are added to the already curried list.
    Actions should be invoked using the [sendAction](/ember/release/classes/Component/methods/sendAction?anchor=sendAction)
    method. The first argument to `sendAction` is the action to be called, and
    additional arguments are passed to the action function. This has interesting
    properties combined with currying of arguments. For example:
  
    ```app/components/update-name.js
    import Component from '@glimmer/component';
    import { action } from '@ember/object';
  
    export default class extends Component {
      @action
      setName(model, name) {
        model.set('name', name);
      }
    }
    ```
  
    ```app/components/update-name.hbs
    {{input on-input=(action (action 'setName' @model) value="target.value")}}
    ```
  
    The first argument (`@model`) was curried over, and the run-time argument (`event`)
    becomes a second argument. Action calls can be nested this way because each simply
    returns a function. Any function can be passed to the `{{action}}` helper, including
    other actions.
  
    Actions invoked with `sendAction` have the same currying behavior as demonstrated
    with `on-input` above. For example:
  
    ```app/components/my-input.js
    import Component from '@glimmer/component';
    import { action } from '@ember/object';
  
    export default class extends Component {
      @action
      setName(model, name) {
        model.set('name', name);
      }
    }
    ```
  
    ```handlebars
    <MyInput @submit={{action 'setName' @model}} />
    ```
  
    or
  
    ```handlebars
    {{my-input submit=(action 'setName' @model)}}
    ```
  
    ```app/components/my-component.js
    import Component from '@ember/component';
  
    export default Component.extend({
      click() {
        // Note that model is not passed, it was curried in the template
        this.sendAction('submit', 'bob');
      }
    });
    ```
  
    ### Attaching actions to DOM elements
  
    The third context of the `{{action}}` helper can be called "element space".
    For example:
  
    ```handlebars
    {{! An example of element space }}
    <div {{action "save"}}></div>
    ```
  
    Used this way, the `{{action}}` helper provides a useful shortcut for
    registering an HTML element in a template for a single DOM event and
    forwarding that interaction to the template's context (controller or component).
    If the context of a template is a controller, actions used this way will
    bubble to routes when the controller does not implement the specified action.
    Once an action hits a route, it will bubble through the route hierarchy.
  
    ### Event Propagation
  
    `{{action}}` helpers called in element space can control event bubbling. Note
    that the closure style actions cannot.
  
    Events triggered through the action helper will automatically have
    `.preventDefault()` called on them. You do not need to do so in your event
    handlers. If you need to allow event propagation (to handle file inputs for
    example) you can supply the `preventDefault=false` option to the `{{action}}` helper:
  
    ```handlebars
    <div {{action "sayHello" preventDefault=false}}>
      <input type="file" />
      <input type="checkbox" />
    </div>
    ```
  
    To disable bubbling, pass `bubbles=false` to the helper:
  
    ```handlebars
    <button {{action 'edit' post bubbles=false}}>Edit</button>
    ```
  
    To disable bubbling with closure style actions you must create your own
    wrapper helper that makes use of `event.stopPropagation()`:
  
    ```handlebars
    <div onclick={{disable-bubbling (action "sayHello")}}>Hello</div>
    ```
  
    ```app/helpers/disable-bubbling.js
    import { helper } from '@ember/component/helper';
  
    export function disableBubbling([action]) {
      return function(event) {
        event.stopPropagation();
        return action(event);
      };
    }
    export default helper(disableBubbling);
    ```
  
    If you need the default handler to trigger you should either register your
    own event handler, or use event methods on your view class. See
    ["Responding to Browser Events"](/ember/release/classes/Component)
    in the documentation for `Component` for more information.
  
    ### Specifying DOM event type
  
    `{{action}}` helpers called in element space can specify an event type.
    By default the `{{action}}` helper registers for DOM `click` events. You can
    supply an `on` option to the helper to specify a different DOM event name:
  
    ```handlebars
    <div {{action "anActionName" on="doubleClick"}}>
      click me
    </div>
    ```
  
    See ["Event Names"](/ember/release/classes/Component) for a list of
    acceptable DOM event names.
  
    ### Specifying whitelisted modifier keys
  
    `{{action}}` helpers called in element space can specify modifier keys.
    By default the `{{action}}` helper will ignore click events with pressed modifier
    keys. You can supply an `allowedKeys` option to specify which keys should not be ignored.
  
    ```handlebars
    <div {{action "anActionName" allowedKeys="alt"}}>
      click me
    </div>
    ```
  
    This way the action will fire when clicking with the alt key pressed down.
    Alternatively, supply "any" to the `allowedKeys` option to accept any combination of modifier keys.
  
    ```handlebars
    <div {{action "anActionName" allowedKeys="any"}}>
      click me with any key pressed
    </div>
    ```
  
    ### Specifying a Target
  
    A `target` option can be provided to the helper to change
    which object will receive the method call. This option must be a path
    to an object, accessible in the current context:
  
    ```app/templates/application.hbs
    <div {{action "anActionName" target=someService}}>
      click me
    </div>
    ```
  
    ```app/controllers/application.js
    import Controller from '@ember/controller';
    import { inject as service } from '@ember/service';
  
    export default class extends Controller {
      @service someService;
    }
    ```
  
    @method action
    @for Ember.Templates.helpers
    @public
  */

  _exports.INVOKE = INVOKE;
  var action$1 = internalHelper(function (args) {
    var named = args.named,
        positional = args.positional; // The first two argument slots are reserved.
    // pos[0] is the context (or `this`)
    // pos[1] is the action name or function
    // Anything else is an action argument.

    var context = positional[0],
        action$$1 = positional[1],
        restArgs = positional.slice(2);
    var debugKey = action$$1.debugLabel;
    var target = 'target' in named ? named.target : context;
    var processArgs = makeArgsProcessor('value' in named && named.value, restArgs);
    var fn$$1;

    if ((0, _reference.isInvokableRef)(action$$1)) {
      fn$$1 = makeClosureAction(action$$1, action$$1, invokeRef, processArgs, debugKey);
    } else {
      fn$$1 = makeDynamicClosureAction((0, _reference.valueForRef)(context), target, action$$1, processArgs, debugKey);
    }

    ACTIONS.add(fn$$1);
    return (0, _reference.createUnboundRef)(fn$$1, '(result of an `action` helper)');
  });

  function NOOP$1(args) {
    return args;
  }

  function makeArgsProcessor(valuePathRef, actionArgsRef) {
    var mergeArgs;

    if (actionArgsRef.length > 0) {
      mergeArgs = function mergeArgs(args) {
        return actionArgsRef.map(_reference.valueForRef).concat(args);
      };
    }

    var readValue;

    if (valuePathRef) {
      readValue = function readValue(args) {
        var valuePath = (0, _reference.valueForRef)(valuePathRef);

        if (valuePath && args.length > 0) {
          args[0] = (0, _metal.get)(args[0], valuePath);
        }

        return args;
      };
    }

    if (mergeArgs && readValue) {
      return function (args) {
        return readValue(mergeArgs(args));
      };
    } else {
      return mergeArgs || readValue || NOOP$1;
    }
  }

  function makeDynamicClosureAction(context, targetRef, actionRef, processArgs, debugKey) {
    // We don't allow undefined/null values, so this creates a throw-away action to trigger the assertions
    if (false
    /* DEBUG */
    ) {
      makeClosureAction(context, (0, _reference.valueForRef)(targetRef), (0, _reference.valueForRef)(actionRef), processArgs, debugKey);
    }

    return function () {
      return makeClosureAction(context, (0, _reference.valueForRef)(targetRef), (0, _reference.valueForRef)(actionRef), processArgs, debugKey).apply(void 0, arguments);
    };
  }

  function makeClosureAction(context, target, action$$1, processArgs, debugKey) {
    var self;
    var fn$$1;
    (false && !(action$$1 !== undefined && action$$1 !== null) && (0, _debug.assert)("Action passed is null or undefined in (action) from " + target + ".", action$$1 !== undefined && action$$1 !== null));

    if (typeof action$$1[INVOKE] === 'function') {
      (false && !(false) && (0, _debug.deprecate)("Usage of the private INVOKE API to make an object callable via action or fn is no longer supported. Please update to pass in a callback function instead. Received: " + String(action$$1), false, {
        until: '3.25.0',
        id: 'actions.custom-invoke-invokable',
        for: 'ember-source',
        since: {
          enabled: '3.23.0-beta.1'
        }
      }));
      self = action$$1;
      fn$$1 = action$$1[INVOKE];
    } else {
      var typeofAction = typeof action$$1;

      if (typeofAction === 'string') {
        self = target;
        fn$$1 = target.actions && target.actions[action$$1];
        (false && !(Boolean(fn$$1)) && (0, _debug.assert)("An action named '" + action$$1 + "' was not found in " + target, Boolean(fn$$1)));
      } else if (typeofAction === 'function') {
        self = context;
        fn$$1 = action$$1;
      } else {
        // tslint:disable-next-line:max-line-length
        (false && !(false) && (0, _debug.assert)("An action could not be made for `" + (debugKey || action$$1) + "` in " + target + ". Please confirm that you are using either a quoted action name (i.e. `(action '" + (debugKey || 'myAction') + "')`) or a function available in " + target + ".", false));
      }
    }

    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key2 = 0; _key2 < _len; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var payload = {
        target: self,
        args: args,
        label: '@glimmer/closure-action'
      };
      return (0, _instrumentation.flaggedInstrument)('interaction.ember-action', payload, function () {
        return _runloop.join.apply(void 0, [self, fn$$1].concat(processArgs(args)));
      });
    };
  } // The code above:
  // 1. Finds an action function, usually on the `actions` hash
  // 2. Calls it with the target as the correct `this` context
  // Previously, `UPDATE_REFERENCED_VALUE` was a method on the reference itself,
  // so this made a bit more sense. Now, it isn't, and so we need to create a
  // function that can have `this` bound to it when called. This allows us to use
  // the same codepath to call `updateRef` on the reference.


  function invokeRef(value) {
    (0, _reference.updateRef)(this, value);
  } // inputs needed by CurlyComponents (attrs and props, with mutable
  // cells, etc).


  function processComponentArgs(namedArgs) {
    var attrs = Object.create(null);
    var props = Object.create(null);
    props[ARGS] = namedArgs;

    for (var name in namedArgs) {
      var ref = namedArgs[name];
      var value = (0, _reference.valueForRef)(ref);
      var isAction = typeof value === 'function' && ACTIONS.has(value);

      if ((0, _reference.isUpdatableRef)(ref) && !isAction) {
        attrs[name] = new MutableCell(ref, value);
      } else {
        attrs[name] = value;
      }

      props[name] = value;
    }

    props.attrs = attrs;
    return props;
  }

  var REF = (0, _utils.symbol)('REF');

  var MutableCell = /*#__PURE__*/function () {
    function MutableCell(ref, value) {
      this[_views.MUTABLE_CELL] = true;
      this[REF] = ref;
      this.value = value;
    }

    var _proto3 = MutableCell.prototype;

    _proto3.update = function update(val) {
      (0, _reference.updateRef)(this[REF], val);
    };

    return MutableCell;
  }();

  var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};

    for (var p in s) {
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }

    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
  };

  var ARGS = (0, _utils.enumerableSymbol)('ARGS');
  var HAS_BLOCK = (0, _utils.enumerableSymbol)('HAS_BLOCK');
  var DIRTY_TAG = (0, _utils.symbol)('DIRTY_TAG');
  var IS_DISPATCHING_ATTRS = (0, _utils.symbol)('IS_DISPATCHING_ATTRS');
  var BOUNDS = (0, _utils.symbol)('BOUNDS');
  var EMBER_VIEW_REF = (0, _reference.createPrimitiveRef)('ember-view');

  function aliasIdToElementId(args, props) {
    if (args.named.has('id')) {
      // tslint:disable-next-line:max-line-length
      (false && !(!args.named.has('elementId')) && (0, _debug.assert)("You cannot invoke a component with both 'id' and 'elementId' at the same time.", !args.named.has('elementId')));
      props.elementId = props.id;
    }
  } // We must traverse the attributeBindings in reverse keeping track of
  // what has already been applied. This is essentially refining the concatenated
  // properties applying right to left.


  function applyAttributeBindings(attributeBindings, component, rootRef, operations) {
    var seen = [];
    var i = attributeBindings.length - 1;

    while (i !== -1) {
      var binding = attributeBindings[i];
      var parsed = parseAttributeBinding(binding);
      var attribute = parsed[1];

      if (seen.indexOf(attribute) === -1) {
        seen.push(attribute);
        installAttributeBinding(component, rootRef, parsed, operations);
      }

      i--;
    }

    if (seen.indexOf('id') === -1) {
      var id = component.elementId ? component.elementId : (0, _utils.guidFor)(component);
      operations.setAttribute('id', (0, _reference.createPrimitiveRef)(id), false, null);
    }

    if (_deprecatedFeatures.EMBER_COMPONENT_IS_VISIBLE && installIsVisibleBinding !== undefined && seen.indexOf('style') === -1) {
      installIsVisibleBinding(rootRef, operations);
    }
  }

  var EMPTY_POSITIONAL_ARGS = [];
  (0, _debug.debugFreeze)(EMPTY_POSITIONAL_ARGS);

  var CurlyComponentManager = /*#__PURE__*/function () {
    function CurlyComponentManager() {}

    var _proto4 = CurlyComponentManager.prototype;

    _proto4.templateFor = function templateFor(component) {
      var layout = component.layout,
          layoutName = component.layoutName;
      var owner = (0, _owner2.getOwner)(component);
      var factory;

      if (layout === undefined) {
        if (layoutName !== undefined) {
          var _factory = owner.lookup("template:" + layoutName);

          (false && !(_factory !== undefined) && (0, _debug.assert)("Layout `" + layoutName + "` not found!", _factory !== undefined));
          factory = _factory;
        } else {
          return null;
        }
      } else if (isTemplateFactory(layout)) {
        factory = layout;
      } else {
        // no layout was found, use the default layout
        return null;
      }

      return (0, _util.unwrapTemplate)(factory(owner)).asWrappedLayout();
    };

    _proto4.getDynamicLayout = function getDynamicLayout(bucket) {
      return this.templateFor(bucket.component);
    };

    _proto4.getTagName = function getTagName(state) {
      var component = state.component,
          hasWrappedElement = state.hasWrappedElement;

      if (!hasWrappedElement) {
        return null;
      }

      return component && component.tagName || 'div';
    };

    _proto4.getCapabilities = function getCapabilities() {
      return CURLY_CAPABILITIES;
    };

    _proto4.prepareArgs = function prepareArgs(ComponentClass, args) {
      var _a;

      if (args.named.has('__ARGS__')) {
        var _b = args.named.capture(),
            __ARGS__ = _b.__ARGS__,
            rest = __rest(_b, ["__ARGS__"]);

        var prepared = {
          positional: EMPTY_POSITIONAL_ARGS,
          named: (0, _polyfills.assign)((0, _polyfills.assign)({}, rest), (0, _reference.valueForRef)(__ARGS__))
        };
        return prepared;
      }

      var _ref = (_a = ComponentClass.class) !== null && _a !== void 0 ? _a : ComponentClass,
          positionalParams = _ref.positionalParams; // early exits


      if (positionalParams === undefined || positionalParams === null || args.positional.length === 0) {
        return null;
      }

      var named;

      if (typeof positionalParams === 'string') {
        var _named;

        (false && !(!args.named.has(positionalParams)) && (0, _debug.assert)("You cannot specify positional parameters and the hash argument `" + positionalParams + "`.", !args.named.has(positionalParams)));
        var captured = args.positional.capture();
        named = (_named = {}, _named[positionalParams] = (0, _reference.createComputeRef)(function () {
          return (0, _runtime.reifyPositional)(captured);
        }), _named);
        (0, _polyfills.assign)(named, args.named.capture());
      } else if (Array.isArray(positionalParams) && positionalParams.length > 0) {
        var count = Math.min(positionalParams.length, args.positional.length);
        named = {};
        (0, _polyfills.assign)(named, args.named.capture());

        for (var i = 0; i < count; i++) {
          // As of TS 3.7, tsc is giving us the following error on this line without the type annotation
          //
          //   TS7022: 'name' implicitly has type 'any' because it does not have a type annotation and is
          //   referenced directly or indirectly in its own initializer.
          //
          // This is almost certainly a TypeScript bug, feel free to try and remove the annotation after
          // upgrading if it is not needed anymore.
          var name = positionalParams[i];
          (false && !(!args.named.has(name)) && (0, _debug.assert)("You cannot specify both a positional param (at position " + i + ") and the hash argument `" + name + "`.", !args.named.has(name)));
          named[name] = args.positional.at(i);
        }
      } else {
        return null;
      }

      return {
        positional: _util.EMPTY_ARRAY,
        named: named
      };
    }
    /*
     * This hook is responsible for actually instantiating the component instance.
     * It also is where we perform additional bookkeeping to support legacy
     * features like exposed by view mixins like ChildViewSupport, ActionSupport,
     * etc.
     */
    ;

    _proto4.create = function create(owner, ComponentClass, args, _ref2, dynamicScope, callerSelfRef, hasBlock) {
      var isInteractive = _ref2.isInteractive;
      // Get the nearest concrete component instance from the scope. "Virtual"
      // components will be skipped.
      var parentView = dynamicScope.view; // Capture the arguments, which tells Glimmer to give us our own, stable
      // copy of the Arguments object that is safe to hold on to between renders.

      var capturedArgs = args.named.capture();
      (0, _validator.beginTrackFrame)();
      var props = processComponentArgs(capturedArgs);
      var argsTag = (0, _validator.endTrackFrame)(); // Alias `id` argument to `elementId` property on the component instance.

      aliasIdToElementId(args, props); // Set component instance's parentView property to point to nearest concrete
      // component.

      props.parentView = parentView; // Set whether this component was invoked with a block
      // (`{{#my-component}}{{/my-component}}`) or without one
      // (`{{my-component}}`).

      props[HAS_BLOCK] = hasBlock; // Save the current `this` context of the template as the component's
      // `_target`, so bubbled actions are routed to the right place.

      props._target = (0, _reference.valueForRef)(callerSelfRef);
      (0, _owner2.setOwner)(props, owner); // caller:
      // <FaIcon @name="bug" />
      //
      // callee:
      // <i class="fa-{{@name}}"></i>
      // Now that we've built up all of the properties to set on the component instance,
      // actually create it.

      (0, _validator.beginUntrackFrame)();
      var component = ComponentClass.create(props);
      var finalizer = (0, _instrumentation._instrumentStart)('render.component', initialRenderInstrumentDetails, component); // We become the new parentView for downstream components, so save our
      // component off on the dynamic scope.

      dynamicScope.view = component; // Unless we're the root component, we need to add ourselves to our parent
      // component's childViews array.

      if (parentView !== null && parentView !== undefined) {
        (0, _views.addChildView)(parentView, component);
      }

      component.trigger('didReceiveAttrs');
      var hasWrappedElement = component.tagName !== ''; // We usually do this in the `didCreateElement`, but that hook doesn't fire for tagless components

      if (!hasWrappedElement) {
        if (isInteractive) {
          component.trigger('willRender');
        }

        component._transitionTo('hasElement');

        if (isInteractive) {
          component.trigger('willInsertElement');
        }
      } // Track additional lifecycle metadata about this component in a state bucket.
      // Essentially we're saving off all the state we'll need in the future.


      var bucket = new ComponentStateBucket(component, capturedArgs, argsTag, finalizer, hasWrappedElement, isInteractive);

      if (args.named.has('class')) {
        bucket.classRef = args.named.get('class');
      }

      if (false
      /* DEBUG */
      ) {
        processComponentInitializationAssertions(component, props);
      }

      if (isInteractive && hasWrappedElement) {
        component.trigger('willRender');
      }

      (0, _validator.endUntrackFrame)(); // consume every argument so we always run again

      (0, _validator.consumeTag)(bucket.argsTag);
      (0, _validator.consumeTag)(component[DIRTY_TAG]);
      return bucket;
    };

    _proto4.getDebugName = function getDebugName(definition) {
      var _a;

      return definition.fullName || definition.normalizedName || ((_a = definition.class) === null || _a === void 0 ? void 0 : _a.name) || definition.name;
    };

    _proto4.getSelf = function getSelf(_ref3) {
      var rootRef = _ref3.rootRef;
      return rootRef;
    };

    _proto4.didCreateElement = function didCreateElement(_ref4, element, operations) {
      var component = _ref4.component,
          classRef = _ref4.classRef,
          isInteractive = _ref4.isInteractive,
          rootRef = _ref4.rootRef;
      (0, _views.setViewElement)(component, element);
      (0, _views.setElementView)(element, component);
      var attributeBindings = component.attributeBindings,
          classNames = component.classNames,
          classNameBindings = component.classNameBindings;

      if (attributeBindings && attributeBindings.length) {
        applyAttributeBindings(attributeBindings, component, rootRef, operations);
      } else {
        var id = component.elementId ? component.elementId : (0, _utils.guidFor)(component);
        operations.setAttribute('id', (0, _reference.createPrimitiveRef)(id), false, null);

        if (_deprecatedFeatures.EMBER_COMPONENT_IS_VISIBLE) {
          installIsVisibleBinding(rootRef, operations);
        }
      }

      if (classRef) {
        var ref = createSimpleClassNameBindingRef(classRef);
        operations.setAttribute('class', ref, false, null);
      }

      if (classNames && classNames.length) {
        classNames.forEach(function (name) {
          operations.setAttribute('class', (0, _reference.createPrimitiveRef)(name), false, null);
        });
      }

      if (classNameBindings && classNameBindings.length) {
        classNameBindings.forEach(function (binding) {
          createClassNameBindingRef(rootRef, binding, operations);
        });
      }

      operations.setAttribute('class', EMBER_VIEW_REF, false, null);

      if ('ariaRole' in component) {
        operations.setAttribute('role', (0, _reference.childRefFor)(rootRef, 'ariaRole'), false, null);
      }

      component._transitionTo('hasElement');

      if (isInteractive) {
        (0, _validator.beginUntrackFrame)();
        component.trigger('willInsertElement');
        (0, _validator.endUntrackFrame)();
      }
    };

    _proto4.didRenderLayout = function didRenderLayout(bucket, bounds) {
      bucket.component[BOUNDS] = bounds;
      bucket.finalize();
    };

    _proto4.didCreate = function didCreate(_ref5) {
      var component = _ref5.component,
          isInteractive = _ref5.isInteractive;

      if (isInteractive) {
        component._transitionTo('inDOM');

        component.trigger('didInsertElement');
        component.trigger('didRender');
      }
    };

    _proto4.update = function update(bucket) {
      var component = bucket.component,
          args = bucket.args,
          argsTag = bucket.argsTag,
          argsRevision = bucket.argsRevision,
          isInteractive = bucket.isInteractive;
      bucket.finalizer = (0, _instrumentation._instrumentStart)('render.component', rerenderInstrumentDetails, component);
      (0, _validator.beginUntrackFrame)();

      if (args !== null && !(0, _validator.validateTag)(argsTag, argsRevision)) {
        (0, _validator.beginTrackFrame)();
        var props = processComponentArgs(args);
        argsTag = bucket.argsTag = (0, _validator.endTrackFrame)();
        bucket.argsRevision = (0, _validator.valueForTag)(argsTag);
        component[IS_DISPATCHING_ATTRS] = true;
        component.setProperties(props);
        component[IS_DISPATCHING_ATTRS] = false;
        component.trigger('didUpdateAttrs');
        component.trigger('didReceiveAttrs');
      }

      if (isInteractive) {
        component.trigger('willUpdate');
        component.trigger('willRender');
      }

      (0, _validator.endUntrackFrame)();
      (0, _validator.consumeTag)(argsTag);
      (0, _validator.consumeTag)(component[DIRTY_TAG]);
    };

    _proto4.didUpdateLayout = function didUpdateLayout(bucket) {
      bucket.finalize();
    };

    _proto4.didUpdate = function didUpdate(_ref6) {
      var component = _ref6.component,
          isInteractive = _ref6.isInteractive;

      if (isInteractive) {
        component.trigger('didUpdate');
        component.trigger('didRender');
      }
    };

    _proto4.getDestroyable = function getDestroyable(bucket) {
      return bucket;
    };

    return CurlyComponentManager;
  }();

  function processComponentInitializationAssertions(component, props) {
    (false && !(function () {
      var classNameBindings = component.classNameBindings;

      for (var i = 0; i < classNameBindings.length; i++) {
        var binding = classNameBindings[i];

        if (typeof binding !== 'string' || binding.length === 0) {
          return false;
        }
      }

      return true;
    }()) && (0, _debug.assert)("classNameBindings must be non-empty strings: " + component, function () {
      var classNameBindings = component.classNameBindings;

      for (var i = 0; i < classNameBindings.length; i++) {
        var binding = classNameBindings[i];

        if (typeof binding !== 'string' || binding.length === 0) {
          return false;
        }
      }

      return true;
    }()));
    (false && !(function () {
      var classNameBindings = component.classNameBindings;

      for (var i = 0; i < classNameBindings.length; i++) {
        var binding = classNameBindings[i];

        if (binding.split(' ').length > 1) {
          return false;
        }
      }

      return true;
    }()) && (0, _debug.assert)("classNameBindings must not have spaces in them: " + component, function () {
      var classNameBindings = component.classNameBindings;

      for (var i = 0; i < classNameBindings.length; i++) {
        var binding = classNameBindings[i];

        if (binding.split(' ').length > 1) {
          return false;
        }
      }

      return true;
    }()));
    (false && !(component.tagName !== '' || !component.classNameBindings || component.classNameBindings.length === 0) && (0, _debug.assert)("You cannot use `classNameBindings` on a tag-less component: " + component, component.tagName !== '' || !component.classNameBindings || component.classNameBindings.length === 0));
    (false && !(component.tagName !== '' || props.id === component.elementId || !component.elementId && component.elementId !== '') && (0, _debug.assert)("You cannot use `elementId` on a tag-less component: " + component, component.tagName !== '' || props.id === component.elementId || !component.elementId && component.elementId !== ''));
    (false && !(component.tagName !== '' || !component.attributeBindings || component.attributeBindings.length === 0) && (0, _debug.assert)("You cannot use `attributeBindings` on a tag-less component: " + component, component.tagName !== '' || !component.attributeBindings || component.attributeBindings.length === 0));
  }

  function initialRenderInstrumentDetails(component) {
    return component.instrumentDetails({
      initialRender: true
    });
  }

  function rerenderInstrumentDetails(component) {
    return component.instrumentDetails({
      initialRender: false
    });
  }

  var CURLY_CAPABILITIES = {
    dynamicLayout: true,
    dynamicTag: true,
    prepareArgs: true,
    createArgs: true,
    attributeHook: true,
    elementHook: true,
    createCaller: true,
    dynamicScope: true,
    updateHook: true,
    createInstance: true,
    wrapped: true,
    willDestroy: true,
    hasSubOwner: false
  };
  var CURLY_COMPONENT_MANAGER = new CurlyComponentManager();

  function isCurlyManager(manager) {
    return manager === CURLY_COMPONENT_MANAGER;
  }
  /**
  @module @ember/component
  */

  /**
    A component is a reusable UI element that consists of a `.hbs` template and an
    optional JavaScript class that defines its behavior. For example, someone
    might make a `button` in the template and handle the click behavior in the
    JavaScript file that shares the same name as the template.
  
    Components are broken down into two categories:
  
    - Components _without_ JavaScript, that are based only on a template. These
      are called Template-only or TO components.
    - Components _with_ JavaScript, which consist of a template and a backing
      class.
  
    Ember ships with two types of JavaScript classes for components:
  
    1. Glimmer components, imported from `@glimmer/component`, which are the
       default component's for Ember Octane (3.15) and more recent editions.
    2. Classic components, imported from `@ember/component`, which were the
       default for older editions of Ember (pre 3.15).
  
    Below is the documentation for Classic components. If you are looking for the
    API documentation for Template-only or Glimmer components, it is
    [available here](/ember/release/modules/@glimmer%2Fcomponent).
  
    ## Defining a Classic Component
  
    If you want to customize the component in order to handle events, transform
    arguments or maintain internal state, you implement a subclass of `Component`.
  
    One example is to add computed properties to your component:
  
    ```app/components/person-profile.js
    import Component from '@ember/component';
  
    export default Component.extend({
      displayName: computed('person.title', 'person.firstName', 'person.lastName', function() {
        let { title, firstName, lastName } = this.person;
  
        if (title) {
          return `${title} ${lastName}`;
        } else {
          return `${firstName} ${lastName}`;
        }
      })
    });
    ```
  
    And then use it in the component's template:
  
    ```app/templates/components/person-profile.hbs
    <h1>{{this.displayName}}</h1>
    {{yield}}
    ```
  
    ## Customizing a Classic Component's HTML Element in JavaScript
  
    ### HTML Tag
  
    The default HTML tag name used for a component's HTML representation is `div`.
    This can be customized by setting the `tagName` property.
  
    Consider the following component class:
  
    ```app/components/emphasized-paragraph.js
    import Component from '@ember/component';
  
    export default Component.extend({
      tagName: 'em'
    });
    ```
  
    When invoked, this component would produce output that looks something like
    this:
  
    ```html
    <em id="ember1" class="ember-view"></em>
    ```
  
    ### HTML `class` Attribute
  
    The HTML `class` attribute of a component's tag can be set by providing a
    `classNames` property that is set to an array of strings:
  
    ```app/components/my-widget.js
    import Component from '@ember/component';
  
    export default Component.extend({
      classNames: ['my-class', 'my-other-class']
    });
    ```
  
    Invoking this component will produce output that looks like this:
  
    ```html
    <div id="ember1" class="ember-view my-class my-other-class"></div>
    ```
  
    `class` attribute values can also be set by providing a `classNameBindings`
    property set to an array of properties names for the component. The return
    value of these properties will be added as part of the value for the
    components's `class` attribute. These properties can be computed properties:
  
    ```app/components/my-widget.js
    import Component from '@ember/component';
    import { computed } from '@ember/object';
  
    export default Component.extend({
      classNames: ['my-class', 'my-other-class'],
      classNameBindings: ['propertyA', 'propertyB'],
  
      propertyA: 'from-a',
      propertyB: computed(function() {
        if (someLogic) { return 'from-b'; }
      })
    });
    ```
  
    Invoking this component will produce HTML that looks like:
  
    ```html
    <div id="ember1" class="ember-view my-class my-other-class from-a from-b"></div>
    ```
  
    Note that `classNames` and `classNameBindings` is in addition to the `class`
    attribute passed with the angle bracket invocation syntax. Therefore, if this
    component was invoked like so:
  
    ```handlebars
    <MyWidget class="from-invocation" />
    ```
  
    The resulting HTML will look similar to this:
  
    ```html
    <div id="ember1" class="from-invocation ember-view my-class my-other-class from-a from-b"></div>
    ```
  
    If the value of a class name binding returns a boolean the property name
    itself will be used as the class name if the property is true. The class name
    will not be added if the value is `false` or `undefined`.
  
    ```app/components/my-widget.js
    import Component from '@ember/component';
  
    export default Component.extend({
      classNameBindings: ['hovered'],
  
      hovered: true
    });
    ```
  
    Invoking this component will produce HTML that looks like:
  
    ```html
    <div id="ember1" class="ember-view hovered"></div>
    ```
  
    ### Custom Class Names for Boolean Values
  
    When using boolean class name bindings you can supply a string value other
    than the property name for use as the `class` HTML attribute by appending the
    preferred value after a ":" character when defining the binding:
  
    ```app/components/my-widget.js
    import Component from '@ember/component';
  
    export default Component.extend({
      classNameBindings: ['awesome:so-very-cool'],
  
      awesome: true
    });
    ```
  
    Invoking this component will produce HTML that looks like:
  
    ```html
    <div id="ember1" class="ember-view so-very-cool"></div>
    ```
  
    Boolean value class name bindings whose property names are in a
    camelCase-style format will be converted to a dasherized format:
  
    ```app/components/my-widget.js
    import Component from '@ember/component';
  
    export default Component.extend({
      classNameBindings: ['isUrgent'],
  
      isUrgent: true
    });
    ```
  
    Invoking this component will produce HTML that looks like:
  
    ```html
    <div id="ember1" class="ember-view is-urgent"></div>
    ```
  
    Class name bindings can also refer to object values that are found by
    traversing a path relative to the component itself:
  
    ```app/components/my-widget.js
    import Component from '@ember/component';
    import EmberObject from '@ember/object';
  
    export default Component.extend({
      classNameBindings: ['messages.empty'],
  
      messages: EmberObject.create({
        empty: true
      })
    });
    ```
  
    Invoking this component will produce HTML that looks like:
  
    ```html
    <div id="ember1" class="ember-view empty"></div>
    ```
  
    If you want to add a class name for a property which evaluates to true and
    and a different class name if it evaluates to false, you can pass a binding
    like this:
  
    ```app/components/my-widget.js
    import Component from '@ember/component';
  
    export default Component.extend({
      classNameBindings: ['isEnabled:enabled:disabled'],
      isEnabled: true
    });
    ```
  
    Invoking this component will produce HTML that looks like:
  
    ```html
    <div id="ember1" class="ember-view enabled"></div>
    ```
  
    When isEnabled is `false`, the resulting HTML representation looks like this:
  
    ```html
    <div id="ember1" class="ember-view disabled"></div>
    ```
  
    This syntax offers the convenience to add a class if a property is `false`:
  
    ```app/components/my-widget.js
    import Component from '@ember/component';
  
    // Applies no class when isEnabled is true and class 'disabled' when isEnabled is false
    export default Component.extend({
      classNameBindings: ['isEnabled::disabled'],
      isEnabled: true
    });
    ```
  
    Invoking this component when the `isEnabled` property is true will produce
    HTML that looks like:
  
    ```html
    <div id="ember1" class="ember-view"></div>
    ```
  
    Invoking it when the `isEnabled` property on the component is `false` will
    produce HTML that looks like:
  
    ```html
    <div id="ember1" class="ember-view disabled"></div>
    ```
  
    Updates to the value of a class name binding will result in automatic update
    of the  HTML `class` attribute in the component's rendered HTML
    representation. If the value becomes `false` or `undefined` the class name
    will be removed.
  
    Both `classNames` and `classNameBindings` are concatenated properties. See
    [EmberObject](/ember/release/classes/EmberObject) documentation for more
    information about concatenated properties.
  
    ### Other HTML Attributes
  
    The HTML attribute section of a component's tag can be set by providing an
    `attributeBindings` property set to an array of property names on the component.
    The return value of these properties will be used as the value of the component's
    HTML associated attribute:
  
    ```app/components/my-anchor.js
    import Component from '@ember/component';
  
    export default Component.extend({
      tagName: 'a',
      attributeBindings: ['href'],
  
      href: 'http://google.com'
    });
    ```
  
    Invoking this component will produce HTML that looks like:
  
    ```html
    <a id="ember1" class="ember-view" href="http://google.com"></a>
    ```
  
    One property can be mapped on to another by placing a ":" between
    the source property and the destination property:
  
    ```app/components/my-anchor.js
    import Component from '@ember/component';
  
    export default Component.extend({
      tagName: 'a',
      attributeBindings: ['url:href'],
  
      url: 'http://google.com'
    });
    ```
  
    Invoking this component will produce HTML that looks like:
  
    ```html
    <a id="ember1" class="ember-view" href="http://google.com"></a>
    ```
  
    HTML attributes passed with angle bracket invocations will take precedence
    over those specified in `attributeBindings`. Therefore, if this component was
    invoked like so:
  
    ```handlebars
    <MyAnchor href="http://bing.com" @url="http://google.com" />
    ```
  
    The resulting HTML will looks like this:
  
    ```html
    <a id="ember1" class="ember-view" href="http://bing.com"></a>
    ```
  
    Note that the `href` attribute is ultimately set to `http://bing.com`,
    despite it having attribute binidng to the `url` property, which was
    set to `http://google.com`.
  
    Namespaced attributes (e.g. `xlink:href`) are supported, but have to be
    mapped, since `:` is not a valid character for properties in Javascript:
  
    ```app/components/my-use.js
    import Component from '@ember/component';
  
    export default Component.extend({
      tagName: 'use',
      attributeBindings: ['xlinkHref:xlink:href'],
  
      xlinkHref: '#triangle'
    });
    ```
  
    Invoking this component will produce HTML that looks like:
  
    ```html
    <use xlink:href="#triangle"></use>
    ```
  
    If the value of a property monitored by `attributeBindings` is a boolean, the
    attribute will be present or absent depending on the value:
  
    ```app/components/my-text-input.js
    import Component from '@ember/component';
  
    export default Component.extend({
      tagName: 'input',
      attributeBindings: ['disabled'],
  
      disabled: false
    });
    ```
  
    Invoking this component will produce HTML that looks like:
  
    ```html
    <input id="ember1" class="ember-view" />
    ```
  
    `attributeBindings` can refer to computed properties:
  
    ```app/components/my-text-input.js
    import Component from '@ember/component';
    import { computed } from '@ember/object';
  
    export default Component.extend({
      tagName: 'input',
      attributeBindings: ['disabled'],
  
      disabled: computed(function() {
        if (someLogic) {
          return true;
        } else {
          return false;
        }
      })
    });
    ```
  
    To prevent setting an attribute altogether, use `null` or `undefined` as the
    value of the property used in `attributeBindings`:
  
    ```app/components/my-text-input.js
    import Component from '@ember/component';
  
    export default Component.extend({
      tagName: 'form',
      attributeBindings: ['novalidate'],
      novalidate: null
    });
    ```
  
    Updates to the property of an attribute binding will result in automatic
    update of the  HTML attribute in the component's HTML output.
  
    `attributeBindings` is a concatenated property. See
    [EmberObject](/ember/release/classes/EmberObject) documentation for more
    information about concatenated properties.
  
    ## Layouts
  
    The `layout` property can be used to dynamically specify a template associated
    with a component class, instead of relying on Ember to link together a
    component class and a template based on file names.
  
    In general, applications should not use this feature, but it's commonly used
    in addons for historical reasons.
  
    The `layout` property should be set to the default export of a template
    module, which is the name of a template file without the `.hbs` extension.
  
    ```app/templates/components/person-profile.hbs
    <h1>Person's Title</h1>
    <div class='details'>{{yield}}</div>
    ```
  
    ```app/components/person-profile.js
      import Component from '@ember/component';
      import layout from '../templates/components/person-profile';
  
      export default Component.extend({
        layout
      });
    ```
  
    If you invoke the component:
  
    ```handlebars
    <PersonProfile>
      <h2>Chief Basket Weaver</h2>
      <h3>Fisherman Industries</h3>
    </PersonProfile>
    ```
  
    or
  
    ```handlebars
    {{#person-profile}}
      <h2>Chief Basket Weaver</h2>
      <h3>Fisherman Industries</h3>
    {{/person-profile}}
    ```
  
    It will result in the following HTML output:
  
    ```html
    <h1>Person's Title</h1>
      <div class="details">
      <h2>Chief Basket Weaver</h2>
      <h3>Fisherman Industries</h3>
    </div>
    ```
  
    ## Handling Browser Events
  
    Components can respond to user-initiated events in one of three ways: passing
    actions with angle bracket invocation, adding event handler methods to the
    component's class, or adding actions to the component's template.
  
    ### Passing Actions With Angle Bracket Invocation
  
    For one-off events specific to particular instance of a component, it is possible
    to pass actions to the component's element using angle bracket invocation syntax.
  
    ```handlebars
    <MyWidget {{action 'firstWidgetClicked'}} />
  
    <MyWidget {{action 'secondWidgetClicked'}} />
    ```
  
    In this case, when the first component is clicked on, Ember will invoke the
    `firstWidgetClicked` action. When the second component is clicked on, Ember
    will invoke the `secondWidgetClicked` action instead.
  
    Besides `{{action}}`, it is also possible to pass any arbitrary element modifiers
    using the angle bracket invocation syntax.
  
    ### Event Handler Methods
  
    Components can also respond to user-initiated events by implementing a method
    that matches the event name. This approach is appropriate when the same event
    should be handled by all instances of the same component.
  
    An event object will be passed as the argument to the event handler method.
  
    ```app/components/my-widget.js
    import Component from '@ember/component';
  
    export default Component.extend({
      click(event) {
        // `event.target` is either the component's element or one of its children
        let tag = event.target.tagName.toLowerCase();
        console.log('clicked on a `<${tag}>` HTML element!');
      }
    });
    ```
  
    In this example, whenever the user clicked anywhere inside the component, it
    will log a message to the console.
  
    It is possible to handle event types other than `click` by implementing the
    following event handler methods. In addition, custom events can be registered
    by using `Application.customEvents`.
  
    Touch events:
  
    * `touchStart`
    * `touchMove`
    * `touchEnd`
    * `touchCancel`
  
    Keyboard events:
  
    * `keyDown`
    * `keyUp`
    * `keyPress`
  
    Mouse events:
  
    * `mouseDown`
    * `mouseUp`
    * `contextMenu`
    * `click`
    * `doubleClick`
    * `focusIn`
    * `focusOut`
  
    Form events:
  
    * `submit`
    * `change`
    * `focusIn`
    * `focusOut`
    * `input`
  
    Drag and drop events:
  
    * `dragStart`
    * `drag`
    * `dragEnter`
    * `dragLeave`
    * `dragOver`
    * `dragEnd`
    * `drop`
  
    ### `{{action}}` Helper
  
    Instead of handling all events of a particular type anywhere inside the
    component's element, you may instead want to limit it to a particular
    element in the component's template. In this case, it would be more
    convenient to implement an action instead.
  
    For example, you could implement the action `hello` for the `person-profile`
    component:
  
    ```app/components/person-profile.js
    import Component from '@ember/component';
  
    export default Component.extend({
      actions: {
        hello(name) {
          console.log("Hello", name);
        }
      }
    });
    ```
  
    And then use it in the component's template:
  
    ```app/templates/components/person-profile.hbs
    <h1>{{@person.name}}</h1>
  
    <button {{action 'hello' @person.name}}>
      Say Hello to {{@person.name}}
    </button>
    ```
  
    When the user clicks the button, Ember will invoke the `hello` action,
    passing in the current value of `@person.name` as an argument.
  
    See [Ember.Templates.helpers.action](/ember/release/classes/Ember.Templates.helpers/methods/action?anchor=action).
  
    @class Component
    @extends Ember.CoreView
    @uses Ember.TargetActionSupport
    @uses Ember.ClassNamesSupport
    @uses Ember.ActionSupport
    @uses Ember.ViewMixin
    @uses Ember.ViewStateSupport
    @public
  */


  var Component = _views.CoreView.extend(_views.ChildViewsSupport, _views.ViewStateSupport, _views.ClassNamesSupport, _runtime2.TargetActionSupport, _views.ActionSupport, _views.ViewMixin, (_CoreView$extend = {
    isComponent: true,
    init: function init() {
      this._super.apply(this, arguments);

      this[IS_DISPATCHING_ATTRS] = false;
      this[DIRTY_TAG] = (0, _validator.createTag)();
      this[BOUNDS] = null;

      if (false
      /* DEBUG */
      && this.renderer._isInteractive && this.tagName === '') {
        var eventNames = [];
        var eventDispatcher = (0, _owner2.getOwner)(this).lookup('event_dispatcher:main');
        var events = eventDispatcher && eventDispatcher._finalEvents || {}; // tslint:disable-next-line:forin

        for (var key in events) {
          var methodName = events[key];

          if (typeof this[methodName] === 'function') {
            eventNames.push(methodName);
          }
        } // If in a tagless component, assert that no event handlers are defined


        (false && !(!eventNames.length) && (0, _debug.assert)( // tslint:disable-next-line:max-line-length
        "You can not define `" + eventNames + "` function(s) to handle DOM event in the `" + this + "` tagless component since it doesn't have any DOM element.", !eventNames.length));
      }

      (false && !(this.mouseEnter === undefined) && (0, _debug.deprecate)(this + ": Using `mouseEnter` event handler methods in components has been deprecated.", this.mouseEnter === undefined, {
        id: 'ember-views.event-dispatcher.mouseenter-leave-move',
        until: '4.0.0',
        url: 'https://emberjs.com/deprecations/v3.x#toc_component-mouseenter-leave-move',
        for: 'ember-source',
        since: {
          enabled: '3.13.0-beta.1'
        }
      }));
      (false && !(this.mouseLeave === undefined) && (0, _debug.deprecate)(this + ": Using `mouseLeave` event handler methods in components has been deprecated.", this.mouseLeave === undefined, {
        id: 'ember-views.event-dispatcher.mouseenter-leave-move',
        until: '4.0.0',
        url: 'https://emberjs.com/deprecations/v3.x#toc_component-mouseenter-leave-move',
        for: 'ember-source',
        since: {
          enabled: '3.13.0-beta.1'
        }
      }));
      (false && !(this.mouseMove === undefined) && (0, _debug.deprecate)(this + ": Using `mouseMove` event handler methods in components has been deprecated.", this.mouseMove === undefined, {
        id: 'ember-views.event-dispatcher.mouseenter-leave-move',
        until: '4.0.0',
        url: 'https://emberjs.com/deprecations/v3.x#toc_component-mouseenter-leave-move',
        for: 'ember-source',
        since: {
          enabled: '3.13.0-beta.1'
        }
      }));
    },
    rerender: function rerender() {
      (0, _validator.dirtyTag)(this[DIRTY_TAG]);

      this._super();
    }
  }, _CoreView$extend[_metal.PROPERTY_DID_CHANGE] = function (key, value) {
    if (this[IS_DISPATCHING_ATTRS]) {
      return;
    }

    var args = this[ARGS];
    var reference = args !== undefined ? args[key] : undefined;

    if (reference !== undefined && (0, _reference.isUpdatableRef)(reference)) {
      (0, _reference.updateRef)(reference, arguments.length === 2 ? value : (0, _metal.get)(this, key));
    }
  }, _CoreView$extend.getAttr = function getAttr(key) {
    // TODO Intimate API should be deprecated
    return this.get(key);
  }, _CoreView$extend.readDOMAttr = function readDOMAttr(name) {
    // TODO revisit this
    var _element = (0, _views.getViewElement)(this);

    (false && !(_element !== null) && (0, _debug.assert)("Cannot call `readDOMAttr` on " + this + " which does not have an element", _element !== null));
    var element = _element;
    var isSVG = element.namespaceURI === "http://www.w3.org/2000/svg"
    /* SVG */
    ;

    var _normalizeProperty = (0, _runtime.normalizeProperty)(element, name),
        type = _normalizeProperty.type,
        normalized = _normalizeProperty.normalized;

    if (isSVG || type === 'attr') {
      return element.getAttribute(normalized);
    }

    return element[normalized];
  }, _CoreView$extend.didReceiveAttrs = function didReceiveAttrs() {}, _CoreView$extend.didRender = function didRender() {}, _CoreView$extend.willRender = function willRender() {}, _CoreView$extend.didUpdateAttrs = function didUpdateAttrs() {}, _CoreView$extend.willUpdate = function willUpdate() {}, _CoreView$extend.didUpdate = function didUpdate() {}, _CoreView$extend));

  _exports.Component = Component;

  Component.toString = function () {
    return '@ember/component';
  };

  Component.reopenClass({
    isComponentFactory: true,
    positionalParams: []
  });
  (0, _manager2.setInternalComponentManager)(CURLY_COMPONENT_MANAGER, Component);
  var layout = (0, _opcodeCompiler.templateFactory)({
    "id": "14evwHqT",
    "block": "[[],[],false,[]]",
    "moduleName": "packages/@ember/-internals/glimmer/lib/templates/empty.hbs",
    "isStrictMode": false
  });
  /**
  @module @ember/component
  */

  /**
    The internal class used to create text inputs when the `{{input}}`
    helper is used with `type` of `checkbox`.
  
    See [Ember.Templates.helpers.input](/ember/release/classes/Ember.Templates.helpers/methods/input?anchor=input)  for usage details.
  
    ## Direct manipulation of `checked`
  
    The `checked` attribute of an `Checkbox` object should always be set
    through the Ember object or by interacting with its rendered element
    representation via the mouse, keyboard, or touch. Updating the value of the
    checkbox via jQuery will result in the checked value of the object and its
    element losing synchronization.
  
    ## Layout and LayoutName properties
  
    Because HTML `input` elements are self closing `layout` and `layoutName`
    properties will not be applied.
  
    @class Checkbox
    @extends Component
    @public
  */

  var Checkbox = Component.extend({
    layout: layout,

    /**
      By default, this component will add the `ember-checkbox` class to the component's element.
         @property classNames
      @type Array | String
      @default ['ember-checkbox']
      @public
     */
    classNames: ['ember-checkbox'],
    tagName: 'input',

    /**
      By default this component will forward a number of arguments to attributes on the the
      component's element:
         * indeterminate
      * disabled
      * tabindex
      * name
      * autofocus
      * required
      * form
         When invoked with curly braces, this is the exhaustive list of HTML attributes you can
      customize (i.e. `{{input type="checkbox" disabled=true}}`).
         When invoked with angle bracket invocation, this list is irrelevant, because you can use HTML
      attribute syntax to customize the element (i.e.
      `<Input @type="checkbox" disabled data-custom="custom value" />`). However, `@type` and
      `@checked` must be passed as named arguments, not attributes.
         @property attributeBindings
      @type Array | String
      @default ['type', 'checked', 'indeterminate', 'disabled', 'tabindex', 'name', 'autofocus', 'required', 'form']
      @public
    */
    attributeBindings: ['type', 'checked', 'indeterminate', 'disabled', 'tabindex', 'name', 'autofocus', 'required', 'form'],

    /**
      Sets the `type` attribute of the `Checkbox`'s element
         @property disabled
      @default false
      @private
     */
    type: 'checkbox',

    /**
      Sets the `disabled` attribute of the `Checkbox`'s element
         @property disabled
      @default false
      @public
     */
    disabled: false,

    /**
      Corresponds to the `indeterminate` property of the `Checkbox`'s element
         @property disabled
      @default false
      @public
     */
    indeterminate: false,

    /**
      Whenever the checkbox is inserted into the DOM, perform initialization steps, which include
      setting the indeterminate property if needed.
         If this method is overridden, `super` must be called.
         @method
      @public
     */
    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);

      this.element.indeterminate = Boolean(this.indeterminate);
    },

    /**
      Whenever the `change` event is fired on the checkbox, update its `checked` property to reflect
      whether the checkbox is checked.
         If this method is overridden, `super` must be called.
         @method
      @public
     */
    change: function change() {
      (0, _metal.set)(this, 'checked', this.element.checked);
    }
  });
  _exports.Checkbox = Checkbox;

  if (false
  /* DEBUG */
  ) {
    var UNSET = {};
    Checkbox.reopen({
      value: UNSET,
      didReceiveAttrs: function didReceiveAttrs() {
        this._super();

        (false && !(!(this.type === 'checkbox' && this.value !== UNSET)) && (0, _debug.assert)("`<Input @type='checkbox' @value={{...}} />` is not supported; " + "please use `<Input @type='checkbox' @checked={{...}} />` instead.", !(this.type === 'checkbox' && this.value !== UNSET)));
      }
    });
  }

  Checkbox.toString = function () {
    return '@ember/component/checkbox';
  };
  /**
  @module @ember/component
  */


  var inputTypes = _browserEnvironment.hasDOM ? Object.create(null) : null;

  function canSetTypeOfInput(type) {
    // if running in outside of a browser always return
    // the original type
    if (!_browserEnvironment.hasDOM) {
      return Boolean(type);
    }

    if (type in inputTypes) {
      return inputTypes[type];
    }

    var inputTypeTestElement = document.createElement('input');

    try {
      inputTypeTestElement.type = type;
    } catch (e) {// ignored
    }

    return inputTypes[type] = inputTypeTestElement.type === type;
  }
  /**
    The internal class used to create text inputs when the `Input` component is used with `type` of `text`.
  
    See [Ember.Templates.components.Input](/ember/release/classes/Ember.Templates.components/methods/Input?anchor=Input) for usage details.
  
    ## Layout and LayoutName properties
  
    Because HTML `input` elements are self closing `layout` and `layoutName`
    properties will not be applied.
  
    @class TextField
    @extends Component
    @uses Ember.TextSupport
    @public
  */


  var TextField = Component.extend(_views.TextSupport, {
    layout: layout,

    /**
      By default, this component will add the `ember-text-field` class to the component's element.
         @property classNames
      @type Array | String
      @default ['ember-text-field']
      @public
     */
    classNames: ['ember-text-field'],
    tagName: 'input',

    /**
      By default this component will forward a number of arguments to attributes on the the
      component's element:
         * accept
      * autocomplete
      * autosave
      * dir
      * formaction
      * formenctype
      * formmethod
      * formnovalidate
      * formtarget
      * height
      * inputmode
      * lang
      * list
      * type
      * max
      * min
      * multiple
      * name
      * pattern
      * size
      * step
      * value
      * width
         When invoked with `{{input type="text"}}`, you can only customize these attributes. When invoked
      with `<Input @type="text" />`, you can just use HTML attributes directly.
         @property attributeBindings
      @type Array | String
      @default ['accept', 'autocomplete', 'autosave', 'dir', 'formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget', 'height', 'inputmode', 'lang', 'list', 'type', 'max', 'min', 'multiple', 'name', 'pattern', 'size', 'step', 'value', 'width']
      @public
    */
    attributeBindings: ['accept', 'autocomplete', 'autosave', 'dir', 'formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget', 'height', 'inputmode', 'lang', 'list', 'type', 'max', 'min', 'multiple', 'name', 'pattern', 'size', 'step', 'value', 'width'],

    /**
      As the user inputs text, this property is updated to reflect the `value` property of the HTML
      element.
         @property value
      @type String
      @default ""
      @public
    */
    value: '',

    /**
      The `type` attribute of the input element.
         @property type
      @type String
      @default "text"
      @public
    */
    type: (0, _metal.computed)({
      get: function get() {
        return 'text';
      },
      set: function set(_key, value) {
        var type = 'text';

        if (canSetTypeOfInput(value)) {
          type = value;
        }

        return type;
      }
    }),

    /**
      The `size` of the text field in characters.
         @property size
      @type String
      @default null
      @public
    */
    size: null,

    /**
      The `pattern` attribute of input element.
         @property pattern
      @type String
      @default null
      @public
    */
    pattern: null,

    /**
      The `min` attribute of input element used with `type="number"` or `type="range"`.
         @property min
      @type String
      @default null
      @since 1.4.0
      @public
    */
    min: null,

    /**
      The `max` attribute of input element used with `type="number"` or `type="range"`.
         @property max
      @type String
      @default null
      @since 1.4.0
      @public
    */
    max: null
  });
  _exports.TextField = TextField;

  TextField.toString = function () {
    return '@ember/component/text-field';
  };
  /**
  @module @ember/component
  */

  /**
    The `Textarea` component inserts a new instance of `<textarea>` tag into the template.
  
    The `@value` argument provides the content of the `<textarea>`.
  
    This template:
  
    ```handlebars
    <Textarea @value="A bunch of text" />
    ```
  
    Would result in the following HTML:
  
    ```html
    <textarea class="ember-text-area">
      A bunch of text
    </textarea>
    ```
  
    The `@value` argument is two-way bound. If the user types text into the textarea, the `@value`
    argument is updated. If the `@value` argument is updated, the text in the textarea is updated.
  
    In the following example, the `writtenWords` property on the component will be updated as the user
    types 'Lots of text' into the text area of their browser's window.
  
    ```app/components/word-editor.js
    import Component from '@glimmer/component';
    import { tracked } from '@glimmer/tracking';
  
    export default class WordEditorComponent extends Component {
      @tracked writtenWords = "Lots of text that IS bound";
    }
    ```
  
    ```handlebars
    <Textarea @value={{writtenWords}} />
    ```
  
    Would result in the following HTML:
  
    ```html
    <textarea class="ember-text-area">
      Lots of text that IS bound
    </textarea>
    ```
  
    If you wanted a one way binding, you could use the `<textarea>` element directly, and use the
    `value` DOM property and the `input` event.
  
    ### Actions
  
    The `Textarea` component takes a number of arguments with callbacks that are invoked in
    response to user events.
  
    * `enter`
    * `insert-newline`
    * `escape-press`
    * `focus-in`
    * `focus-out`
    * `key-press`
  
    These callbacks are passed to `Textarea` like this:
  
    ```handlebars
    <Textarea @value={{this.searchWord}} @enter={{this.query}} />
    ```
  
    ## Classic Invocation Syntax
  
    The `Textarea` component can also be invoked using curly braces, just like any other Ember
    component.
  
    For example, this is an invocation using angle-bracket notation:
  
    ```handlebars
    <Textarea @value={{this.searchWord}} @enter={{this.query}} />
    ```
  
    You could accomplish the same thing using classic invocation:
  
    ```handlebars
    {{textarea value=this.searchWord enter=this.query}}
    ```
  
    The main difference is that angle-bracket invocation supports any HTML attribute using HTML
    attribute syntax, because attributes and arguments have different syntax when using angle-bracket
    invocation. Curly brace invocation, on the other hand, only has a single syntax for arguments,
    and components must manually map attributes onto component arguments.
  
    When using classic invocation with `{{textarea}}`, only the following attributes are mapped onto
    arguments:
  
    * rows
    * cols
    * name
    * selectionEnd
    * selectionStart
    * autocomplete
    * wrap
    * lang
    * dir
    * value
  
    ## Classic `layout` and `layoutName` properties
  
    Because HTML `textarea` elements do not contain inner HTML the `layout` and
    `layoutName` properties will not be applied.
  
    @method Textarea
    @for Ember.Templates.components
    @see {TextArea}
    @public
  */

  /**
    See Ember.Templates.components.Textarea.
  
    @method textarea
    @for Ember.Templates.helpers
    @see {Ember.Templates.components.textarea}
    @public
  */

  /**
    The internal representation used for `Textarea` invocations.
  
    @class TextArea
    @extends Component
    @see {Ember.Templates.components.Textarea}
    @uses Ember.TextSupport
    @public
  */


  var TextArea = Component.extend(_views.TextSupport, {
    classNames: ['ember-text-area'],
    layout: layout,
    tagName: 'textarea',
    attributeBindings: ['rows', 'cols', 'name', 'selectionEnd', 'selectionStart', 'autocomplete', 'wrap', 'lang', 'dir', 'value'],
    rows: null,
    cols: null
  });
  _exports.TextArea = TextArea;

  TextArea.toString = function () {
    return '@ember/component/text-area';
  };

  var layout$1 = (0, _opcodeCompiler.templateFactory)({
    "id": "Hma8ydcX",
    "block": "[[[41,[48,[30,1]],[[[18,1,null]],[]],[[[1,[30,0,[\"linkTitle\"]]]],[]]]],[\"&default\"],false,[\"if\",\"has-block\",\"yield\"]]",
    "moduleName": "packages/@ember/-internals/glimmer/lib/templates/link-to.hbs",
    "isStrictMode": false
  });
  /**
  @module ember
  */

  /**
    The `LinkTo` component renders a link to the supplied `routeName` passing an optionally
    supplied model to the route as its `model` context of the route. The block for `LinkTo`
    becomes the contents of the rendered element:
  
    ```handlebars
    <LinkTo @route='photoGallery'>
      Great Hamster Photos
    </LinkTo>
    ```
  
    This will result in:
  
    ```html
    <a href="/hamster-photos">
      Great Hamster Photos
    </a>
    ```
  
    ### Disabling the `LinkTo` component
  
    The `LinkTo` component can be disabled by using the `disabled` argument. A disabled link
    doesn't result in a transition when activated, and adds the `disabled` class to the `<a>`
    element.
  
    (The class name to apply to the element can be overridden by using the `disabledClass`
    argument)
  
    ```handlebars
    <LinkTo @route='photoGallery' @disabled={{true}}>
      Great Hamster Photos
    </LinkTo>
    ```
  
    ### Handling `href`
  
    `<LinkTo>` will use your application's Router to fill the element's `href` property with a URL
    that matches the path to the supplied `routeName`.
  
    ### Handling current route
  
    The `LinkTo` component will apply a CSS class name of 'active' when the application's current
    route matches the supplied routeName. For example, if the application's current route is
    'photoGallery.recent', then the following invocation of `LinkTo`:
  
    ```handlebars
    <LinkTo @route='photoGallery.recent'>
      Great Hamster Photos
    </LinkTo>
    ```
  
    will result in
  
    ```html
    <a href="/hamster-photos/this-week" class="active">
      Great Hamster Photos
    </a>
    ```
  
    The CSS class used for active classes can be customized by passing an `activeClass` argument:
  
    ```handlebars
    <LinkTo @route='photoGallery.recent' @activeClass="current-url">
      Great Hamster Photos
    </LinkTo>
    ```
  
    ```html
    <a href="/hamster-photos/this-week" class="current-url">
      Great Hamster Photos
    </a>
    ```
  
    ### Keeping a link active for other routes
  
    If you need a link to be 'active' even when it doesn't match the current route, you can use the
    `current-when` argument.
  
    ```handlebars
    <LinkTo @route='photoGallery' @current-when='photos'>
      Photo Gallery
    </LinkTo>
    ```
  
    This may be helpful for keeping links active for:
  
    * non-nested routes that are logically related
    * some secondary menu approaches
    * 'top navigation' with 'sub navigation' scenarios
  
    A link will be active if `current-when` is `true` or the current
    route is the route this link would transition to.
  
    To match multiple routes 'space-separate' the routes:
  
    ```handlebars
    <LinkTo @route='gallery' @current-when='photos drawings paintings'>
      Art Gallery
    </LinkTo>
    ```
  
    ### Supplying a model
  
    An optional `model` argument can be used for routes whose
    paths contain dynamic segments. This argument will become
    the model context of the linked route:
  
    ```javascript
    Router.map(function() {
      this.route("photoGallery", {path: "hamster-photos/:photo_id"});
    });
    ```
  
    ```handlebars
    <LinkTo @route='photoGallery' @model={{this.aPhoto}}>
      {{aPhoto.title}}
    </LinkTo>
    ```
  
    ```html
    <a href="/hamster-photos/42">
      Tomster
    </a>
    ```
  
    ### Supplying multiple models
  
    For deep-linking to route paths that contain multiple
    dynamic segments, the `models` argument can be used.
  
    As the router transitions through the route path, each
    supplied model argument will become the context for the
    route with the dynamic segments:
  
    ```javascript
    Router.map(function() {
      this.route("photoGallery", { path: "hamster-photos/:photo_id" }, function() {
        this.route("comment", {path: "comments/:comment_id"});
      });
    });
    ```
  
    This argument will become the model context of the linked route:
  
    ```handlebars
    <LinkTo @route='photoGallery.comment' @models={{array this.aPhoto this.comment}}>
      {{comment.body}}
    </LinkTo>
    ```
  
    ```html
    <a href="/hamster-photos/42/comments/718">
      A+++ would snuggle again.
    </a>
    ```
  
    ### Supplying an explicit dynamic segment value
  
    If you don't have a model object available to pass to `LinkTo`,
    an optional string or integer argument can be passed for routes whose
    paths contain dynamic segments. This argument will become the value
    of the dynamic segment:
  
    ```javascript
    Router.map(function() {
      this.route("photoGallery", { path: "hamster-photos/:photo_id" });
    });
    ```
  
    ```handlebars
    <LinkTo @route='photoGallery' @model={{aPhotoId}}>
      {{this.aPhoto.title}}
    </LinkTo>
    ```
  
    ```html
    <a href="/hamster-photos/42">
      Tomster
    </a>
    ```
  
    When transitioning into the linked route, the `model` hook will
    be triggered with parameters including this passed identifier.
  
    ### Allowing Default Action
  
    By default the `<LinkTo>` component prevents the default browser action by calling
    `preventDefault()` to avoid reloading the browser page.
  
    If you need to trigger a full browser reload pass `@preventDefault={{false}}`:
  
    ```handlebars
    <LinkTo @route='photoGallery' @model={{this.aPhotoId}} @preventDefault={{false}}>
      {{this.aPhotoId.title}}
    </LinkTo>
    ```
  
    ### Supplying a `tagName`
  
    By default `<LinkTo>` renders an `<a>` element. This can be overridden for a single use of
    `<LinkTo>` by supplying a `tagName` argument:
  
    ```handlebars
    <LinkTo @route='photoGallery' @tagName='li'>
      Great Hamster Photos
    </LinkTo>
    ```
  
    This produces:
  
    ```html
    <li>
      Great Hamster Photos
    </li>
    ```
  
    In general, this is not recommended.
  
    ### Supplying query parameters
  
    If you need to add optional key-value pairs that appear to the right of the ? in a URL,
    you can use the `query` argument.
  
    ```handlebars
    <LinkTo @route='photoGallery' @query={{hash page=1 per_page=20}}>
      Great Hamster Photos
    </LinkTo>
    ```
  
    This will result in:
  
    ```html
    <a href="/hamster-photos?page=1&per_page=20">
      Great Hamster Photos
    </a>
    ```
  
    @for Ember.Templates.components
    @method LinkTo
    @see {LinkComponent}
    @public
  */

  /**
    @module @ember/routing
  */

  /**
    See [Ember.Templates.components.LinkTo](/ember/release/classes/Ember.Templates.components/methods/input?anchor=LinkTo).
  
    @for Ember.Templates.helpers
    @method link-to
    @see {Ember.Templates.components.LinkTo}
    @public
  **/

  /**
    `LinkComponent` is the internal component invoked with `<LinkTo>` or `{{link-to}}`.
  
    @class LinkComponent
    @extends Component
    @see {Ember.Templates.components.LinkTo}
    @public
  **/

  var UNDEFINED = Object.freeze({
    toString: function toString() {
      return 'UNDEFINED';
    }
  });
  var EMPTY_QUERY_PARAMS = Object.freeze({});
  var LinkComponent = Component.extend({
    layout: layout$1,
    tagName: 'a',

    /**
      @property route
      @public
    */
    route: UNDEFINED,

    /**
      @property model
      @public
    */
    model: UNDEFINED,

    /**
      @property models
      @public
    */
    models: UNDEFINED,

    /**
      @property query
      @public
    */
    query: UNDEFINED,

    /**
      Used to determine when this `LinkComponent` is active.
         @property current-when
      @public
    */
    'current-when': null,

    /**
      Sets the `title` attribute of the `LinkComponent`'s HTML element.
         @property title
      @default null
      @public
    **/
    title: null,

    /**
      Sets the `rel` attribute of the `LinkComponent`'s HTML element.
         @property rel
      @default null
      @public
    **/
    rel: null,

    /**
      Sets the `tabindex` attribute of the `LinkComponent`'s HTML element.
         @property tabindex
      @default null
      @public
    **/
    tabindex: null,

    /**
      Sets the `target` attribute of the `LinkComponent`'s HTML element.
         @since 1.8.0
      @property target
      @default null
      @public
    **/
    target: null,

    /**
      The CSS class to apply to `LinkComponent`'s element when its `active`
      property is `true`.
         @property activeClass
      @type String
      @default active
      @public
    **/
    activeClass: 'active',

    /**
      The CSS class to apply to `LinkComponent`'s element when its `loading`
      property is `true`.
         @property loadingClass
      @type String
      @default loading
      @private
    **/
    loadingClass: 'loading',

    /**
      The CSS class to apply to a `LinkComponent`'s element when its `disabled`
      property is `true`.
         @property disabledClass
      @type String
      @default disabled
      @private
    **/
    disabledClass: 'disabled',

    /**
      Determines whether the `LinkComponent` will trigger routing via
      the `replaceWith` routing strategy.
         @property replace
      @type Boolean
      @default false
      @public
    **/
    replace: false,

    /**
      By default this component will forward `href`, `title`, `rel`, `tabindex`, and `target`
      arguments to attributes on the component's element. When invoked with `{{link-to}}`, you can
      only customize these attributes. When invoked with `<LinkTo>`, you can just use HTML
      attributes directly.
         @property attributeBindings
      @type Array | String
      @default ['title', 'rel', 'tabindex', 'target']
      @public
    */
    attributeBindings: ['href', 'title', 'rel', 'tabindex', 'target'],

    /**
      By default this component will set classes on its element when any of the following arguments
      are truthy:
         * active
      * loading
      * disabled
         When these arguments are truthy, a class with the same name will be set on the element. When
      falsy, the associated class will not be on the element.
         @property classNameBindings
      @type Array
      @default ['active', 'loading', 'disabled', 'ember-transitioning-in', 'ember-transitioning-out']
      @public
    */
    classNameBindings: ['active', 'loading', 'disabled', 'transitioningIn', 'transitioningOut'],

    /**
      By default this component responds to the `click` event. When the component element is an
      `<a>` element, activating the link in another way, such as using the keyboard, triggers the
      click event.
         @property eventName
      @type String
      @default click
      @private
    */
    eventName: 'click',
    // this is doc'ed here so it shows up in the events
    // section of the API documentation, which is where
    // people will likely go looking for it.

    /**
      Triggers the `LinkComponent`'s routing behavior. If
      `eventName` is changed to a value other than `click`
      the routing behavior will trigger on that custom event
      instead.
         @event click
      @private
    */

    /**
      An overridable method called when `LinkComponent` objects are instantiated.
         Example:
         ```app/components/my-link.js
      import LinkComponent from '@ember/routing/link-component';
         export default LinkComponent.extend({
        init() {
          this._super(...arguments);
          console.log('Event is ' + this.get('eventName'));
        }
      });
      ```
         NOTE: If you do override `init` for a framework class like `Component`,
      be sure to call `this._super(...arguments)` in your
      `init` declaration! If you don't, Ember may not have an opportunity to
      do important setup work, and you'll see strange behavior in your
      application.
         @method init
      @private
    */
    init: function init() {
      this._super.apply(this, arguments);

      (false && !(!this._isEngine || this._engineMountPoint !== undefined) && (0, _debug.assert)('You attempted to use the <LinkTo> component within a routeless engine, this is not supported. ' + 'If you are using the ember-engines addon, use the <LinkToExternal> component instead. ' + 'See https://ember-engines.com/docs/links for more info.', !this._isEngine || this._engineMountPoint !== undefined)); // Map desired event name to invoke function

      var eventName = this.eventName;
      this.on(eventName, this, this._invoke);
    },
    _routing: (0, _service.inject)('-routing'),
    _currentRoute: (0, _metal.alias)('_routing.currentRouteName'),
    _currentRouterState: (0, _metal.alias)('_routing.currentState'),
    _targetRouterState: (0, _metal.alias)('_routing.targetState'),
    _isEngine: (0, _metal.computed)(function () {
      return (0, _engine.getEngineParent)((0, _owner2.getOwner)(this)) !== undefined;
    }),
    _engineMountPoint: (0, _metal.computed)(function () {
      return (0, _owner2.getOwner)(this).mountPoint;
    }),
    _route: (0, _metal.computed)('route', '_currentRouterState', function computeLinkToComponentRoute() {
      var route = this.route;
      return route === UNDEFINED ? this._currentRoute : this._namespaceRoute(route);
    }),
    _models: (0, _metal.computed)('model', 'models', function computeLinkToComponentModels() {
      var model = this.model,
          models = this.models;
      (false && !(model === UNDEFINED || models === UNDEFINED) && (0, _debug.assert)('You cannot provide both the `@model` and `@models` arguments to the <LinkTo> component.', model === UNDEFINED || models === UNDEFINED));

      if (model !== UNDEFINED) {
        return [model];
      } else if (models !== UNDEFINED) {
        (false && !(Array.isArray(models)) && (0, _debug.assert)('The `@models` argument must be an array.', Array.isArray(models)));
        return models;
      } else {
        return [];
      }
    }),
    _query: (0, _metal.computed)('query', function computeLinkToComponentQuery() {
      var query = this.query;

      if (query === UNDEFINED) {
        return EMPTY_QUERY_PARAMS;
      } else {
        return (0, _polyfills.assign)({}, query);
      }
    }),

    /**
      Accessed as a classname binding to apply the component's `disabledClass`
      CSS `class` to the element when the link is disabled.
         When `true`, interactions with the element will not trigger route changes.
      @property disabled
      @private
    */
    disabled: (0, _metal.computed)({
      get: function get(_key) {
        // always returns false for `get` because (due to the `set` just below)
        // the cached return value from the set will prevent this getter from _ever_
        // being called after a set has occurred
        return false;
      },
      set: function set(_key, value) {
        this._isDisabled = value;
        return value ? this.disabledClass : false;
      }
    }),

    /**
      Accessed as a classname binding to apply the component's `activeClass`
      CSS `class` to the element when the link is active.
         This component is considered active when its `currentWhen` property is `true`
      or the application's current route is the route this component would trigger
      transitions into.
         The `currentWhen` property can match against multiple routes by separating
      route names using the ` ` (space) character.
         @property active
      @private
    */
    active: (0, _metal.computed)('activeClass', '_active', function computeLinkToComponentActiveClass() {
      return this._active ? this.activeClass : false;
    }),
    _active: (0, _metal.computed)('_currentRouterState', '_route', '_models', '_query', 'loading', 'current-when', function computeLinkToComponentActive() {
      var state = this._currentRouterState;

      if (state) {
        return this._isActive(state);
      } else {
        return false;
      }
    }),
    willBeActive: (0, _metal.computed)('_currentRouterState', '_targetRouterState', '_route', '_models', '_query', 'loading', 'current-when', function computeLinkToComponentWillBeActive() {
      var current = this._currentRouterState,
          target = this._targetRouterState;

      if (current === target) {
        return;
      }

      return this._isActive(target);
    }),
    _isActive: function _isActive(routerState) {
      var _this2 = this;

      if (this.loading) {
        return false;
      }

      var currentWhen = this['current-when'];

      if (typeof currentWhen === 'boolean') {
        return currentWhen;
      }

      var models = this._models,
          routing = this._routing;

      if (typeof currentWhen === 'string') {
        return currentWhen.split(' ').some(function (route) {
          return routing.isActiveForRoute(models, undefined, _this2._namespaceRoute(route), routerState);
        });
      } else {
        return routing.isActiveForRoute(models, this._query, this._route, routerState);
      }
    },
    transitioningIn: (0, _metal.computed)('_active', 'willBeActive', function computeLinkToComponentTransitioningIn() {
      if (this.willBeActive === true && !this._active) {
        return 'ember-transitioning-in';
      } else {
        return false;
      }
    }),
    transitioningOut: (0, _metal.computed)('_active', 'willBeActive', function computeLinkToComponentTransitioningOut() {
      if (this.willBeActive === false && this._active) {
        return 'ember-transitioning-out';
      } else {
        return false;
      }
    }),
    _namespaceRoute: function _namespaceRoute(route) {
      var mountPoint = this._engineMountPoint;

      if (mountPoint === undefined) {
        return route;
      } else if (route === 'application') {
        return mountPoint;
      } else {
        return mountPoint + "." + route;
      }
    },

    /**
      Event handler that invokes the link, activating the associated route.
         @method _invoke
      @param {Event} event
      @private
    */
    _invoke: function _invoke(event) {
      if (!(0, _views.isSimpleClick)(event)) {
        return true;
      }

      var bubbles = this.bubbles,
          preventDefault = this.preventDefault;
      var target = this.element.target;
      var isSelf = !target || target === '_self';

      if (preventDefault !== false && isSelf) {
        event.preventDefault();
      }

      if (bubbles === false) {
        event.stopPropagation();
      }

      if (this._isDisabled) {
        return false;
      }

      if (this.loading) {
        // tslint:disable-next-line:max-line-length
        (false && (0, _debug.warn)('This link is in an inactive loading state because at least one of its models ' + 'currently has a null/undefined value, or the provided route name is invalid.', false, {
          id: 'ember-glimmer.link-to.inactive-loading-state'
        }));
        return false;
      }

      if (!isSelf) {
        return false;
      }

      var routeName = this._route,
          models = this._models,
          queryParams = this._query,
          shouldReplace = this.replace;
      var payload = {
        queryParams: queryParams,
        routeName: routeName
      };
      (0, _instrumentation.flaggedInstrument)('interaction.link-to', payload, this._generateTransition(payload, routeName, models, queryParams, shouldReplace));
      return false;
    },
    _generateTransition: function _generateTransition(payload, qualifiedRouteName, models, queryParams, shouldReplace) {
      var routing = this._routing;
      return function () {
        payload.transition = routing.transitionTo(qualifiedRouteName, models, queryParams, shouldReplace);
      };
    },

    /**
      Sets the element's `href` attribute to the url for
      the `LinkComponent`'s targeted route.
         If the `LinkComponent`'s `tagName` is changed to a value other
      than `a`, this property will be ignored.
         @property href
      @private
    */
    href: (0, _metal.computed)('_currentRouterState', '_route', '_models', '_query', 'tagName', 'loading', 'loadingHref', function computeLinkToComponentHref() {
      if (this.tagName !== 'a') {
        return;
      }

      if (this.loading) {
        return this.loadingHref;
      }

      var route = this._route,
          models = this._models,
          query = this._query,
          routing = this._routing;

      if (false
      /* DEBUG */
      ) {
        /*
         * Unfortunately, to get decent error messages, we need to do this.
         * In some future state we should be able to use a "feature flag"
         * which allows us to strip this without needing to call it twice.
         *
         * if (isDebugBuild()) {
         *   // Do the useful debug thing, probably including try/catch.
         * } else {
         *   // Do the performant thing.
         * }
         */
        try {
          return routing.generateURL(route, models, query);
        } catch (e) {
          // tslint:disable-next-line:max-line-length
          e.message = "While generating link to route \"" + this.route + "\": " + e.message;
          throw e;
        }
      } else {
        return routing.generateURL(route, models, query);
      }
    }),
    loading: (0, _metal.computed)('_route', '_modelsAreLoaded', 'loadingClass', function computeLinkToComponentLoading() {
      var route = this._route,
          loaded = this._modelsAreLoaded;

      if (!loaded || route === null || route === undefined) {
        return this.loadingClass;
      }
    }),
    _modelsAreLoaded: (0, _metal.computed)('_models', function computeLinkToComponentModelsAreLoaded() {
      var models = this._models;

      for (var i = 0; i < models.length; i++) {
        var model = models[i];

        if (model === null || model === undefined) {
          return false;
        }
      }

      return true;
    }),

    /**
      The default href value to use while a link-to is loading.
      Only applies when tagName is 'a'
         @property loadingHref
      @type String
      @default #
      @private
    */
    loadingHref: '#',
    didReceiveAttrs: function didReceiveAttrs() {
      var _this3 = this;

      var disabledWhen = this.disabledWhen;

      if (disabledWhen !== undefined) {
        this.set('disabled', disabledWhen);
      }

      var params = this.params;

      if (!params || params.length === 0) {
        (false && !(!(this.route === UNDEFINED && this.model === UNDEFINED && this.models === UNDEFINED && this.query === UNDEFINED)) && (0, _debug.assert)('You must provide at least one of the `@route`, `@model`, `@models` or `@query` argument to `<LinkTo>`.', !(this.route === UNDEFINED && this.model === UNDEFINED && this.models === UNDEFINED && this.query === UNDEFINED)));
        var models = this._models;

        if (models.length > 0) {
          var lastModel = models[models.length - 1];

          if (typeof lastModel === 'object' && lastModel !== null && lastModel.isQueryParams) {
            this.query = lastModel.values;
            models.pop();
          }
        }

        return;
      }

      var hasBlock = this[HAS_BLOCK];
      params = params.slice(); // Process the positional arguments, in order.
      // 1. Inline link title comes first, if present.

      if (!hasBlock) {
        this.set('linkTitle', params.shift());
      } // 2. The last argument is possibly the `query` object.


      var queryParams = params[params.length - 1];

      if (queryParams && queryParams.isQueryParams) {
        this.set('query', params.pop().values);
      } else {
        this.set('query', UNDEFINED);
      } // 3. If there is a `route`, it is now at index 0.


      if (params.length === 0) {
        this.set('route', UNDEFINED);
      } else {
        this.set('route', params.shift());
      } // 4. Any remaining indices (if any) are `models`.


      this.set('model', UNDEFINED);
      this.set('models', params);
      (0, _debug.runInDebug)(function () {
        params = _this3.params.slice();
        var equivalentNamedArgs = [];
        var hasQueryParams = false; // Process the positional arguments, in order.
        // 1. Inline link title comes first, if present.

        if (!hasBlock) {
          params.shift();
        } // 2. The last argument is possibly the `query` object.


        var query = params[params.length - 1];

        if (query && query.isQueryParams) {
          params.pop();
          hasQueryParams = true;
        } // 3. If there is a `route`, it is now at index 0.


        if (params.length > 0) {
          params.shift();
          equivalentNamedArgs.push('`@route`');
        } // 4. Any remaining params (if any) are `models`.


        if (params.length === 1) {
          equivalentNamedArgs.push('`@model`');
        } else if (params.length > 1) {
          equivalentNamedArgs.push('`@models`');
        }

        if (hasQueryParams) {
          equivalentNamedArgs.push('`@query`');
        }

        if (equivalentNamedArgs.length > 0) {
          var message = 'Invoking the `<LinkTo>` component with positional arguments is deprecated.';
          message += "Please use the equivalent named arguments (" + equivalentNamedArgs.join(', ') + ")";

          if (hasQueryParams) {
            message += ' along with the `hash` helper';
          }

          if (!hasBlock) {
            message += " and pass a block for the link's content.";
          }

          message += '.';
          (false && !(false) && (0, _debug.deprecate)(message, false, {
            id: 'ember-glimmer.link-to.positional-arguments',
            until: '4.0.0',
            for: 'ember-source',
            url: 'https://deprecations.emberjs.com/v3.x#toc_ember-glimmer-link-to-positional-arguments',
            since: {
              enabled: '3.26.0-beta.1'
            }
          }));
        }
      });
    }
  });
  _exports.LinkComponent = LinkComponent;

  LinkComponent.toString = function () {
    return '@ember/routing/link-component';
  };

  LinkComponent.reopenClass({
    positionalParams: 'params'
  });
  var CAPABILITIES = {
    dynamicLayout: false,
    dynamicTag: false,
    prepareArgs: false,
    createArgs: true,
    attributeHook: false,
    elementHook: false,
    createCaller: true,
    dynamicScope: false,
    updateHook: false,
    createInstance: true,
    wrapped: false,
    willDestroy: false,
    hasSubOwner: false
  };

  var InternalManager = /*#__PURE__*/function () {
    function InternalManager(ComponentClass, name) {
      this.ComponentClass = ComponentClass;
      this.name = name;
    }

    var _proto5 = InternalManager.prototype;

    _proto5.getCapabilities = function getCapabilities() {
      return CAPABILITIES;
    };

    _proto5.create = function create(owner, _definition, args, env, _dynamicScope, caller) {
      (false && !((0, _reference.isConstRef)(caller)) && (0, _debug.assert)('caller must be const', (0, _reference.isConstRef)(caller)));
      (false && !(args.positional.length === 0) && (0, _debug.assert)("The " + this.name + " component does not take any positional arguments", args.positional.length === 0));
      var ComponentClass = this.ComponentClass;
      var instance = new ComponentClass(owner, args.named.capture(), (0, _reference.valueForRef)(caller));
      return {
        env: env,
        instance: instance
      };
    };

    _proto5.didCreate = function didCreate() {};

    _proto5.didUpdate = function didUpdate() {};

    _proto5.didRenderLayout = function didRenderLayout() {};

    _proto5.didUpdateLayout = function didUpdateLayout() {};

    _proto5.getDebugName = function getDebugName() {
      return this.name;
    };

    _proto5.getSelf = function getSelf(_ref7) {
      var instance = _ref7.instance;
      return (0, _reference.createConstRef)(instance, 'this');
    };

    _proto5.getDestroyable = function getDestroyable(state) {
      return state.instance;
    };

    return InternalManager;
  }();

  var InputTemplate = (0, _opcodeCompiler.templateFactory)({
    "id": "K/QPSitg",
    "block": "[[[41,[30,0,[\"modernized\"]],[[[11,\"input\"],[16,1,[30,0,[\"id\"]]],[16,0,[30,0,[\"class\"]]],[16,\"autocapitalize\",[30,0,[\"_autocapitalize\"]]],[16,\"autocorrect\",[30,0,[\"_autocorrect\"]]],[16,\"autofocus\",[30,0,[\"_autofocus\"]]],[16,\"disabled\",[30,0,[\"_disabled\"]]],[16,\"form\",[30,0,[\"_form\"]]],[16,\"maxlength\",[30,0,[\"_maxlength\"]]],[16,\"minlength\",[30,0,[\"_minlength\"]]],[16,\"placeholder\",[30,0,[\"_placeholder\"]]],[16,\"readonly\",[30,0,[\"_readonly\"]]],[16,\"required\",[30,0,[\"_required\"]]],[16,\"selectionDirection\",[30,0,[\"_selectionDirection\"]]],[16,\"spellcheck\",[30,0,[\"_spellcheck\"]]],[16,\"tabindex\",[30,0,[\"_tabindex\"]]],[16,\"title\",[30,0,[\"_title\"]]],[16,\"accept\",[30,0,[\"_accept\"]]],[16,\"autocomplete\",[30,0,[\"_autocomplete\"]]],[16,\"autosave\",[30,0,[\"_autosave\"]]],[16,\"dir\",[30,0,[\"_dir\"]]],[16,\"formaction\",[30,0,[\"_formaction\"]]],[16,\"formenctype\",[30,0,[\"_formenctype\"]]],[16,\"formmethod\",[30,0,[\"_formmethod\"]]],[16,\"formnovalidate\",[30,0,[\"_formnovalidate\"]]],[16,\"formtarget\",[30,0,[\"_formtarget\"]]],[16,\"height\",[30,0,[\"_height\"]]],[16,\"inputmode\",[30,0,[\"_inputmode\"]]],[16,\"lang\",[30,0,[\"_lang\"]]],[16,\"list\",[30,0,[\"_list\"]]],[16,\"max\",[30,0,[\"_max\"]]],[16,\"min\",[30,0,[\"_min\"]]],[16,\"multiple\",[30,0,[\"_multiple\"]]],[16,3,[30,0,[\"_name\"]]],[16,\"pattern\",[30,0,[\"_pattern\"]]],[16,\"size\",[30,0,[\"_size\"]]],[16,\"step\",[30,0,[\"_step\"]]],[16,\"width\",[30,0,[\"_width\"]]],[16,\"indeterminate\",[30,0,[\"_indeterminate\"]]],[17,1],[16,4,[30,0,[\"type\"]]],[16,\"checked\",[30,0,[\"checked\"]]],[16,2,[30,0,[\"value\"]]],[4,[38,1],[\"change\",[30,0,[\"change\"]]],null],[4,[38,1],[\"input\",[30,0,[\"input\"]]],null],[4,[38,1],[\"keyup\",[30,0,[\"keyUp\"]]],null],[4,[38,1],[\"paste\",[30,0,[\"valueDidChange\"]]],null],[4,[38,1],[\"cut\",[30,0,[\"valueDidChange\"]]],null],[4,[38,1],[\"touchstart\",[30,0,[\"_touchStart\"]]],null],[4,[38,1],[\"touchmove\",[30,0,[\"_touchMove\"]]],null],[4,[38,1],[\"touchend\",[30,0,[\"_touchEnd\"]]],null],[4,[38,1],[\"touchcancel\",[30,0,[\"_touchCancel\"]]],null],[4,[38,1],[\"keydown\",[30,0,[\"_keyDown\"]]],null],[4,[38,1],[\"keypress\",[30,0,[\"_keyPress\"]]],null],[4,[38,1],[\"mousedown\",[30,0,[\"_mouseDown\"]]],null],[4,[38,1],[\"mouseup\",[30,0,[\"_mouseUp\"]]],null],[4,[38,1],[\"contextmenu\",[30,0,[\"_contextMenu\"]]],null],[4,[38,1],[\"click\",[30,0,[\"_click\"]]],null],[4,[38,1],[\"dblclick\",[30,0,[\"_doubleClick\"]]],null],[4,[38,1],[\"focusin\",[30,0,[\"_focusIn\"]]],null],[4,[38,1],[\"focusout\",[30,0,[\"_focusOut\"]]],null],[4,[38,1],[\"submit\",[30,0,[\"_submit\"]]],null],[4,[38,1],[\"dragstart\",[30,0,[\"_dragStart\"]]],null],[4,[38,1],[\"drag\",[30,0,[\"_drag\"]]],null],[4,[38,1],[\"dragenter\",[30,0,[\"_dragEnter\"]]],null],[4,[38,1],[\"dragleave\",[30,0,[\"_dragLeave\"]]],null],[4,[38,1],[\"dragover\",[30,0,[\"_dragOver\"]]],null],[4,[38,1],[\"drop\",[30,0,[\"_drop\"]]],null],[4,[38,1],[\"dragend\",[30,0,[\"_dragEnd\"]]],null],[4,[38,1],[\"mouseenter\",[30,0,[\"_mouseEnter\"]]],null],[4,[38,1],[\"mouseleave\",[30,0,[\"_mouseLeave\"]]],null],[4,[38,1],[\"mousemove\",[30,0,[\"_mouseMove\"]]],null],[12],[13]],[]],[[[44,[[50,\"-checkbox\",0,null,null],[50,\"-text-field\",0,null,null]],[[[41,[30,0,[\"isCheckbox\"]],[[[8,[30,2],[[17,1]],[[\"@target\",\"@__ARGS__\"],[[30,0,[\"caller\"]],[30,0,[\"args\"]]]],null]],[]],[[[8,[30,3],[[17,1]],[[\"@target\",\"@__ARGS__\"],[[30,0,[\"caller\"]],[30,0,[\"args\"]]]],null]],[]]]],[2,3]]]],[]]]],[\"&attrs\",\"Checkbox\",\"TextField\"],false,[\"if\",\"on\",\"let\",\"component\"]]",
    "moduleName": "packages/@ember/-internals/glimmer/lib/templates/input.hbs",
    "isStrictMode": false
  });

  var InternalComponent = /*#__PURE__*/function () {
    function InternalComponent(owner, args, caller) {
      this.owner = owner;
      this.args = args;
      this.caller = caller;
      (0, _owner2.setOwner)(this, owner);
    } // Override this


    InternalComponent.toString = function toString() {
      return 'internal component';
    };

    var _proto6 = InternalComponent.prototype;

    _proto6.arg = function arg(key) {
      var ref = this.args[key];
      return ref ? (0, _reference.valueForRef)(ref) : undefined;
    };

    _proto6.toString = function toString() {
      return "<" + this.constructor.toString() + ":" + (0, _utils.guidFor)(this) + ">";
    };

    return InternalComponent;
  }();

  var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
      if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };

  var isValidInputType;

  if (_browserEnvironment.hasDOM && false
  /* EMBER_MODERNIZED_BUILT_IN_COMPONENTS */
  ) {
    var INPUT_TYPES = Object.create(null);
    var INPUT_ELEMENT = document.createElement('input');
    INPUT_TYPES[''] = false;
    INPUT_TYPES['text'] = true;
    INPUT_TYPES['checkbox'] = true;

    isValidInputType = function isValidInputType(type) {
      var isValid = INPUT_TYPES[type];

      if (isValid === undefined) {
        try {
          INPUT_ELEMENT.type = type;
          isValid = INPUT_ELEMENT.type === type;
        } catch (e) {
          isValid = false;
        } finally {
          INPUT_ELEMENT.type = 'text';
        }

        INPUT_TYPES[type] = isValid;
      }

      return isValid;
    };
  } else {
    isValidInputType = function isValidInputType(type) {
      return type !== '';
    };
  }

  function NOOP$2() {}

  var UNINITIALIZED = Object.freeze({});
  /**
   * This interface paves over the differences between these three cases:
   *
   * 1. `<Input />` or `<Input @value="some string" />`
   * 2. `<Input @value={{this.value}} />`
   * 3. `<Input @value={{to-upper-case this.value}} />`
   *
   * For the first set of cases (any const reference in general), the semantics
   * are that `@value` is treated as an initial value only, just like the `value`
   * attribute. Perhaps using the `value` attribute would have been more Correct™
   * here, but that would make a pretty confusing API, and the user's intent is
   * pretty clear, so we support it.
   *
   * The second case is the most common. `{{this.value}}` is an updatable
   * reference here so the value is fully owned and bound to the "upstream" value
   * and we don't store a copy of it in the component.
   *
   * The last case is the most tricky. There are a lot of different ways for this
   * to happen, but the end result is that we have a non-const and non-updatable
   * reference in our hands. The semantics here is a mix of the first two cases.
   * We take the computed value as the initial value, but hold a copy of it and
   * allow it to diverge from upstream. However, when the upstream recomputes to
   * a value different than what we originally had, we would reconcile with the
   * new upstream value and throw away the local copy.
   *
   * It's not clear that we intended to support the last case, or that it is used
   * intentionally in the real world, but it's a fallout of the two-way binding
   * system and `Ember.Component` semantics from before.
   *
   * This interface paves over the differences so the component doesn't have to
   * worry about it.
   *
   * All of the above applies to `@checked` as well.
   */

  function valueFrom(reference) {
    if (reference === undefined) {
      return new LocalValue(undefined);
    } else if ((0, _reference.isConstRef)(reference)) {
      return new LocalValue((0, _reference.valueForRef)(reference));
    } else if ((0, _reference.isUpdatableRef)(reference)) {
      return new UpstreamValue(reference);
    } else {
      return new ForkedValue(reference);
    }
  }

  var LocalValue = /*#__PURE__*/function () {
    function LocalValue(value) {
      this.value = value;
    }

    var _proto7 = LocalValue.prototype;

    _proto7.get = function get() {
      return this.value;
    };

    _proto7.set = function set(value) {
      this.value = value;
    };

    return LocalValue;
  }();

  __decorate([_metal.tracked], LocalValue.prototype, "value", void 0);

  var UpstreamValue = /*#__PURE__*/function () {
    function UpstreamValue(reference) {
      this.reference = reference;
    }

    var _proto8 = UpstreamValue.prototype;

    _proto8.get = function get() {
      return (0, _reference.valueForRef)(this.reference);
    };

    _proto8.set = function set(value) {
      (0, _reference.updateRef)(this.reference, value);
    };

    return UpstreamValue;
  }();

  var ForkedValue = /*#__PURE__*/function () {
    function ForkedValue(reference) {
      this.lastUpstreamValue = UNINITIALIZED;
      this.upstream = new UpstreamValue(reference);
    }

    var _proto9 = ForkedValue.prototype;

    _proto9.get = function get() {
      var upstreamValue = this.upstream.get();

      if (upstreamValue !== this.lastUpstreamValue) {
        this.lastUpstreamValue = upstreamValue;
        this.local = new LocalValue(upstreamValue);
      }

      (false && !(this.local) && (0, _debug.assert)('[BUG] this.local must have been initialized at this point', this.local));
      return this.local.get();
    };

    _proto9.set = function set(value) {
      (false && !(this.local) && (0, _debug.assert)('[BUG] this.local must have been initialized at this point', this.local));
      this.local.set(value);
    };

    return ForkedValue;
  }();
  /**
    See [Ember.Templates.components.Input](/ember/release/classes/Ember.Templates.components/methods/Input?anchor=Input).
  
    @method input
    @for Ember.Templates.helpers
    @param {Hash} options
    @public
    */

  /**
    The `Input` component lets you create an HTML `<input>` element.
  
    ```handlebars
    <Input @value="987" />
    ```
  
    creates an `<input>` element with `type="text"` and value set to 987.
  
    ### Text field
  
    If no `type` argument is specified, a default of type 'text' is used.
  
    ```handlebars
    Search:
    <Input @value={{this.searchWord}} />
    ```
  
    In this example, the initial value in the `<input>` will be set to the value of
    `this.searchWord`. If the user changes the text, the value of `this.searchWord` will also be
    updated.
  
    ### Actions
  
    The `Input` component takes a number of arguments with callbacks that are invoked in response to
    user events.
  
    * `enter`
    * `insert-newline`
    * `escape-press`
    * `focus-in`
    * `focus-out`
    * `key-down`
    * `key-press`
    * `key-up`
  
    These callbacks are passed to `Input` like this:
  
    ```handlebars
    <Input @value={{this.searchWord}} @enter={{this.query}} />
    ```
  
    Starting with Ember Octane, we recommend using the `{{on}}` modifier to call actions
    on specific events, such as the input event.
  
    ```handlebars
    <label for="input-name">Name:</label>
    <Input
      @id="input-name"
      @value={{this.name}}
      {{on "input" this.validateName}}
    />
    ```
  
    The event name (e.g. `focusout`, `input`, `keydown`) always follows the casing
    that the HTML standard uses.
  
    ### `<input>` HTML Attributes to Avoid
  
    In most cases, if you want to pass an attribute to the underlying HTML `<input>` element, you
    can pass the attribute directly, just like any other Ember component.
  
    ```handlebars
    <Input @type="text" size="10" />
    ```
  
    In this example, the `size` attribute will be applied to the underlying `<input>` element in the
    outputted HTML.
  
    However, there are a few attributes where you **must** use the `@` version.
  
    * `@type`: This argument is used to control which Ember component is used under the hood
    * `@value`: The `@value` argument installs a two-way binding onto the element. If you wanted a
      one-way binding, use `<input>` with the `value` property and the `input` event instead.
    * `@checked` (for checkboxes): like `@value`, the `@checked` argument installs a two-way binding
      onto the element. If you wanted a one-way binding, use `<input type="checkbox">` with
      `checked` and the `input` event instead.
  
    ### Extending `TextField`
  
    Internally, `<Input @type="text" />` creates an instance of `TextField`, passing arguments from
    the helper to `TextField`'s `create` method. Subclassing `TextField` is supported but not
    recommended.
  
    See [TextField](/ember/release/classes/TextField)
  
    ### Checkbox
  
    To create an `<input type="checkbox">`:
  
    ```handlebars
    Emberize Everything:
    <Input @type="checkbox" @checked={{this.isEmberized}} name="isEmberized" />
    ```
  
    This will bind the checked state of this checkbox to the value of `isEmberized` -- if either one
    changes, it will be reflected in the other.
  
    ### Extending `Checkbox`
  
    Internally, `<Input @type="checkbox" />` creates an instance of `Checkbox`. Subclassing
    `TextField` is supported but not recommended.
  
    See [Checkbox](/ember/release/classes/Checkbox)
  
    @method Input
    @for Ember.Templates.components
    @see {TextField}
    @see {Checkbox}
    @param {Hash} options
    @public
  */


  var Input = /*#__PURE__*/function (_InternalComponent) {
    (0, _emberBabel.inheritsLoose)(Input, _InternalComponent);

    function Input() {
      var _this4;

      _this4 = _InternalComponent.apply(this, arguments) || this;
      _this4.modernized = Boolean(false
      /* EMBER_MODERNIZED_BUILT_IN_COMPONENTS */
      );
      _this4._checked = valueFrom(_this4.args.checked);
      _this4._value = valueFrom(_this4.args.value);
      return _this4;
    }
    /**
     * The default HTML id attribute. We don't really _need_ one, this is just
     * added for compatibility as it's hard to tell if people rely on it being
     * present, and it doens't really hurt.
     *
     * However, don't rely on this internally, like passing it to `getElementId`.
     * This can be (and often is) overriden by passing an `id` attribute on the
     * invocation, which shadows this default id via `...attributes`.
     */


    var _proto10 = Input.prototype;

    _proto10.checkedDidChange = function checkedDidChange(event) {
      this.checked = this.elementFor(event).checked;
    };

    _proto10.valueDidChange = function valueDidChange(event) {
      this.value = this.valueFor(event);
    };

    _proto10.change = function change(event) {
      if (this.isCheckbox) {
        this.checkedDidChange(event);
      } else {
        this.valueDidChange(event);
      }
    };

    _proto10.input = function input(event) {
      if (!this.isCheckbox) {
        this.valueDidChange(event);
      }
    };

    _proto10.keyUp = function keyUp(event) {
      var value = this.valueFor(event);

      switch (event.key) {
        case 'Enter':
          this.callbackFor('enter')(value, event);
          this.callbackFor('insert-newline')(value, event);
          break;

        case 'Escape':
          this.callbackFor('escape-press')(value, event);
          break;
      }
    };

    _proto10.elementFor = function elementFor(event) {
      (false && !(event.target instanceof HTMLInputElement) && (0, _debug.assert)('[BUG] Event target must be the <input> element', event.target instanceof HTMLInputElement));
      return event.target;
    };

    _proto10.valueFor = function valueFor(event) {
      return this.elementFor(event).value;
    };

    _proto10.callbackFor = function callbackFor(type) {
      var callback = this.arg(type);

      if (callback) {
        (false && !(typeof callback === 'function') && (0, _debug.assert)("The `@" + type + "` argument to the <Input> component must be a function", typeof callback === 'function'));
        return callback;
      } else {
        return NOOP$2;
      }
    };

    (0, _emberBabel.createClass)(Input, [{
      key: "id",
      get: function get() {
        return (0, _utils.guidFor)(this);
      }
      /**
       * The default HTML class attribute. Similar to the above, we don't _need_
       * them, they are just added for compatibility as it's similarly hard to tell
       * if people rely on it in their CSS etc, and it doens't really hurt.
       */

    }, {
      key: "class",
      get: function get() {
        if (this.isCheckbox) {
          return 'ember-checkbox ember-view';
        } else {
          return 'ember-text-field ember-view';
        }
      }
      /**
       * The HTML type attribute.
       */

    }, {
      key: "type",
      get: function get() {
        var type = this.arg('type');

        if (type === null || type === undefined) {
          return 'text';
        }

        (false && !(typeof type === 'string') && (0, _debug.assert)('The `@type` argument to the <Input> component must be a string', typeof type === 'string'));
        return isValidInputType(type) ? type : 'text';
      }
    }, {
      key: "isCheckbox",
      get: function get() {
        return this.arg('type') === 'checkbox';
      }
    }, {
      key: "checked",
      get: function get() {
        var _this5 = this;

        if (this.isCheckbox) {
          (false && (0, _debug.warn)('`<Input @type="checkbox" />` reflects its checked state via the `@checked` argument. ' + 'You wrote `<Input @type="checkbox" @value={{...}} />` which is likely not what you intended. ' + 'Did you mean `<Input @type="checkbox" @checked={{...}} />`?', (0, _validator.untrack)(function () {
            return _this5.args.checked !== undefined || _this5.args.value === undefined || typeof (0, _reference.valueForRef)(_this5.args.value) === 'string';
          }), {
            id: 'ember.built-in-components.input-checkbox-value'
          }));
          return this._checked.get();
        } else {
          return undefined;
        }
      },
      set: function set(checked) {
        var _this6 = this;

        (false && (0, _debug.warn)('`<Input @type="checkbox" />` reflects its checked state via the `@checked` argument. ' + 'You wrote `<Input @type="checkbox" @value={{...}} />` which is likely not what you intended. ' + 'Did you mean `<Input @type="checkbox" @checked={{...}} />`?', (0, _validator.untrack)(function () {
          return _this6.args.checked !== undefined || _this6.args.value === undefined || typeof (0, _reference.valueForRef)(_this6.args.value) === 'string';
        }), {
          id: 'ember.built-in-components.input-checkbox-value'
        }));

        this._checked.set(checked);
      }
    }, {
      key: "value",
      get: function get() {
        return this._value.get();
      },
      set: function set(value) {
        this._value.set(value);
      }
    }]);
    return Input;
  }(InternalComponent);

  __decorate([_object.action], Input.prototype, "checkedDidChange", null);

  __decorate([_object.action], Input.prototype, "valueDidChange", null);

  __decorate([_object.action], Input.prototype, "change", null);

  __decorate([_object.action], Input.prototype, "input", null);

  __decorate([_object.action], Input.prototype, "keyUp", null); // Deprecated features


  var InputComponent = {
    // Factory interface
    create: function create() {
      throw (0, _debug.assert)('Use constructor instead of create');
    },
    toString: function toString() {
      return '@ember/component/input';
    }
  };
  _exports.Input = InputComponent;
  (0, _manager2.setInternalComponentManager)(new InternalManager(Input, 'input'), InputComponent);
  (0, _manager2.setComponentTemplate)(InputTemplate, InputComponent);
  Input.toString = InputComponent.toString;
  /**
  @module @ember/component
  */

  var RECOMPUTE_TAG = (0, _utils.symbol)('RECOMPUTE_TAG');
  /**
    Ember Helpers are functions that can compute values, and are used in templates.
    For example, this code calls a helper named `format-currency`:
  
    ```app/templates/application.hbs
    <Cost @cents={{230}} />
    ```
  
    ```app/components/cost.hbs
    <div>{{format-currency @cents currency="$"}}</div>
    ```
  
    Additionally a helper can be called as a nested helper.
    In this example, we show the formatted currency value if the `showMoney`
    named argument is truthy.
  
    ```handlebars
    {{if @showMoney (format-currency @cents currency="$")}}
    ```
  
    Helpers defined using a class must provide a `compute` function. For example:
  
    ```app/helpers/format-currency.js
    import Helper from '@ember/component/helper';
  
    export default class extends Helper {
      compute([cents], { currency }) {
        return `${currency}${cents * 0.01}`;
      }
    }
    ```
  
    Each time the input to a helper changes, the `compute` function will be
    called again.
  
    As instances, these helpers also have access to the container and will accept
    injected dependencies.
  
    Additionally, class helpers can call `recompute` to force a new computation.
  
    @class Helper
    @public
    @since 1.13.0
  */

  var Helper = _runtime2.FrameworkObject.extend({
    init: function init() {
      this._super.apply(this, arguments);

      this[RECOMPUTE_TAG] = (0, _validator.createTag)();
    },

    /**
      On a class-based helper, it may be useful to force a recomputation of that
      helpers value. This is akin to `rerender` on a component.
         For example, this component will rerender when the `currentUser` on a
      session service changes:
         ```app/helpers/current-user-email.js
      import Helper from '@ember/component/helper'
      import { inject as service } from '@ember/service'
      import { observer } from '@ember/object'
         export default Helper.extend({
        session: service(),
           onNewUser: observer('session.currentUser', function() {
          this.recompute();
        }),
           compute() {
          return this.get('session.currentUser.email');
        }
      });
      ```
         @method recompute
      @public
      @since 1.13.0
    */
    recompute: function recompute() {
      var _this7 = this;

      (0, _runloop.join)(function () {
        return (0, _validator.dirtyTag)(_this7[RECOMPUTE_TAG]);
      });
    }
  });

  _exports.Helper = Helper;
  var IS_CLASSIC_HELPER = (0, _utils.symbol)('IS_CLASSIC_HELPER');
  Helper.isHelperFactory = true;
  Helper[IS_CLASSIC_HELPER] = true;

  function isClassicHelper(obj) {
    return obj[IS_CLASSIC_HELPER] === true;
  }

  var ClassicHelperManager = /*#__PURE__*/function () {
    function ClassicHelperManager(owner) {
      this.capabilities = (0, _manager2.helperCapabilities)('3.23', {
        hasValue: true,
        hasDestroyable: true
      });
      var ownerInjection = {};
      (0, _owner2.setOwner)(ownerInjection, owner);
      this.ownerInjection = ownerInjection;
    }

    var _proto11 = ClassicHelperManager.prototype;

    _proto11.createHelper = function createHelper(definition, args) {
      var instance = definition.class === undefined ? definition.create(this.ownerInjection) : definition.create();
      return {
        instance: instance,
        args: args
      };
    };

    _proto11.getDestroyable = function getDestroyable(_ref8) {
      var instance = _ref8.instance;
      return instance;
    };

    _proto11.getValue = function getValue(_ref9) {
      var instance = _ref9.instance,
          args = _ref9.args;
      var ret;
      var positional = args.positional,
          named = args.named;

      if (false
      /* DEBUG */
      ) {
        (0, _validator.deprecateMutationsInTrackingTransaction)(function () {
          ret = instance.compute(positional, named);
        });
      } else {
        ret = instance.compute(positional, named);
      }

      (0, _validator.consumeTag)(instance[RECOMPUTE_TAG]);
      return ret;
    };

    _proto11.getDebugName = function getDebugName(definition) {
      return (0, _utils.getDebugName)(definition.class['prototype']);
    };

    return ClassicHelperManager;
  }();

  (0, _manager2.setHelperManager)(function (owner) {
    return new ClassicHelperManager(owner);
  }, Helper);
  var CLASSIC_HELPER_MANAGER = (0, _manager2.getInternalHelperManager)(Helper); ///////////

  var Wrapper = /*#__PURE__*/function () {
    function Wrapper(compute) {
      this.compute = compute;
      this.isHelperFactory = true;
    }

    var _proto12 = Wrapper.prototype;

    _proto12.create = function create() {
      // needs new instance or will leak containers
      return {
        compute: this.compute
      };
    };

    return Wrapper;
  }();

  var SimpleClassicHelperManager = /*#__PURE__*/function () {
    function SimpleClassicHelperManager() {
      this.capabilities = (0, _manager2.helperCapabilities)('3.23', {
        hasValue: true
      });
    }

    var _proto13 = SimpleClassicHelperManager.prototype;

    _proto13.createHelper = function createHelper(definition, args) {
      var compute = definition.compute;

      if (false
      /* DEBUG */
      ) {
        return function () {
          var ret;
          (0, _validator.deprecateMutationsInTrackingTransaction)(function () {
            ret = compute.call(null, args.positional, args.named);
          });
          return ret;
        };
      }

      return function () {
        return compute.call(null, args.positional, args.named);
      };
    };

    _proto13.getValue = function getValue(fn$$1) {
      return fn$$1();
    };

    _proto13.getDebugName = function getDebugName(definition) {
      return (0, _utils.getDebugName)(definition.compute);
    };

    return SimpleClassicHelperManager;
  }();

  var SIMPLE_CLASSIC_HELPER_MANAGER = new SimpleClassicHelperManager();
  (0, _manager2.setHelperManager)(function () {
    return SIMPLE_CLASSIC_HELPER_MANAGER;
  }, Wrapper.prototype);
  /**
    In many cases it is not necessary to use the full `Helper` class.
    The `helper` method create pure-function helpers without instances.
    For example:
  
    ```app/helpers/format-currency.js
    import { helper } from '@ember/component/helper';
  
    export default helper(function([cents], {currency}) {
      return `${currency}${cents * 0.01}`;
    });
    ```
  
    @static
    @param {Function} helper The helper function
    @method helper
    @for @ember/component/helper
    @public
    @since 1.13.0
  */

  function helper(helperFn) {
    return new Wrapper(helperFn);
  }

  function instrumentationPayload(def) {
    return {
      object: def.name + ":" + def.outlet
    };
  }

  var CAPABILITIES$1 = {
    dynamicLayout: false,
    dynamicTag: false,
    prepareArgs: false,
    createArgs: false,
    attributeHook: false,
    elementHook: false,
    createCaller: false,
    dynamicScope: true,
    updateHook: false,
    createInstance: true,
    wrapped: false,
    willDestroy: false,
    hasSubOwner: false
  };

  var OutletComponentManager = /*#__PURE__*/function () {
    function OutletComponentManager() {}

    var _proto14 = OutletComponentManager.prototype;

    _proto14.create = function create(_owner, definition, _args, env, dynamicScope) {
      var parentStateRef = dynamicScope.get('outletState');
      var currentStateRef = definition.ref;
      dynamicScope.set('outletState', currentStateRef);
      var state = {
        self: (0, _reference.createConstRef)(definition.controller, 'this'),
        finalize: (0, _instrumentation._instrumentStart)('render.outlet', instrumentationPayload, definition)
      };

      if (env.debugRenderTree !== undefined) {
        state.outlet = {
          name: definition.outlet
        };
        var parentState = (0, _reference.valueForRef)(parentStateRef);
        var parentOwner = parentState && parentState.render && parentState.render.owner;
        var currentOwner = (0, _reference.valueForRef)(currentStateRef).render.owner;

        if (parentOwner && parentOwner !== currentOwner) {
          var engine = currentOwner;
          (false && !(typeof currentOwner.mountPoint === 'string') && (0, _debug.assert)('invalid engine: missing mountPoint', typeof currentOwner.mountPoint === 'string'));
          (false && !(currentOwner.routable === true) && (0, _debug.assert)('invalid engine: missing routable', currentOwner.routable === true));
          var mountPoint = engine.mountPoint;
          state.engine = engine;
          state.engineBucket = {
            mountPoint: mountPoint
          };
        }
      }

      return state;
    };

    _proto14.getDebugName = function getDebugName(_ref10) {
      var name = _ref10.name;
      return name;
    };

    _proto14.getDebugCustomRenderTree = function getDebugCustomRenderTree(definition, state, args) {
      var nodes = [];

      if (state.outlet) {
        nodes.push({
          bucket: state.outlet,
          type: 'outlet',
          name: state.outlet.name,
          args: _runtime.EMPTY_ARGS,
          instance: undefined,
          template: undefined
        });
      }

      if (state.engineBucket) {
        nodes.push({
          bucket: state.engineBucket,
          type: 'engine',
          name: state.engineBucket.mountPoint,
          args: _runtime.EMPTY_ARGS,
          instance: state.engine,
          template: undefined
        });
      }

      nodes.push({
        bucket: state,
        type: 'route-template',
        name: definition.name,
        args: args,
        instance: definition.controller,
        template: (0, _util.unwrapTemplate)(definition.template).moduleName
      });
      return nodes;
    };

    _proto14.getCapabilities = function getCapabilities() {
      return CAPABILITIES$1;
    };

    _proto14.getSelf = function getSelf(_ref11) {
      var self = _ref11.self;
      return self;
    };

    _proto14.didCreate = function didCreate() {};

    _proto14.didUpdate = function didUpdate() {};

    _proto14.didRenderLayout = function didRenderLayout(state) {
      state.finalize();
    };

    _proto14.didUpdateLayout = function didUpdateLayout() {};

    _proto14.getDestroyable = function getDestroyable() {
      return null;
    };

    return OutletComponentManager;
  }();

  var OUTLET_MANAGER = new OutletComponentManager();

  var OutletComponentDefinition = function OutletComponentDefinition(state, manager) {
    if (manager === void 0) {
      manager = OUTLET_MANAGER;
    }

    this.state = state;
    this.manager = manager; // handle is not used by this custom definition

    this.handle = -1;
    var capabilities = manager.getCapabilities();
    this.capabilities = (0, _manager2.capabilityFlagsFrom)(capabilities);
    this.compilable = capabilities.wrapped ? (0, _util.unwrapTemplate)(state.template).asWrappedLayout() : (0, _util.unwrapTemplate)(state.template).asLayout();
    this.resolvedName = state.name;
  };

  function createRootOutlet(outletView) {
    if (_environment2.ENV._APPLICATION_TEMPLATE_WRAPPER) {
      var WRAPPED_CAPABILITIES = (0, _polyfills.assign)({}, CAPABILITIES$1, {
        dynamicTag: true,
        elementHook: true,
        wrapped: true
      });

      var WrappedOutletComponentManager = /*#__PURE__*/function (_OutletComponentManag) {
        (0, _emberBabel.inheritsLoose)(WrappedOutletComponentManager, _OutletComponentManag);

        function WrappedOutletComponentManager() {
          return _OutletComponentManag.apply(this, arguments) || this;
        }

        var _proto15 = WrappedOutletComponentManager.prototype;

        _proto15.getTagName = function getTagName() {
          return 'div';
        };

        _proto15.getCapabilities = function getCapabilities() {
          return WRAPPED_CAPABILITIES;
        };

        _proto15.didCreateElement = function didCreateElement(component, element) {
          // to add GUID id and class
          element.setAttribute('class', 'ember-view');
          element.setAttribute('id', (0, _utils.guidFor)(component));
        };

        return WrappedOutletComponentManager;
      }(OutletComponentManager);

      var WRAPPED_OUTLET_MANAGER = new WrappedOutletComponentManager();
      return new OutletComponentDefinition(outletView.state, WRAPPED_OUTLET_MANAGER);
    } else {
      return new OutletComponentDefinition(outletView.state);
    }
  }

  var RootComponentManager = /*#__PURE__*/function (_CurlyComponentManage) {
    (0, _emberBabel.inheritsLoose)(RootComponentManager, _CurlyComponentManage);

    function RootComponentManager(component) {
      var _this8;

      _this8 = _CurlyComponentManage.call(this) || this;
      _this8.component = component;
      return _this8;
    }

    var _proto16 = RootComponentManager.prototype;

    _proto16.create = function create(_owner, _state, _args, _ref12, dynamicScope) {
      var isInteractive = _ref12.isInteractive;
      var component = this.component;
      var finalizer = (0, _instrumentation._instrumentStart)('render.component', initialRenderInstrumentDetails, component);
      dynamicScope.view = component;
      var hasWrappedElement = component.tagName !== ''; // We usually do this in the `didCreateElement`, but that hook doesn't fire for tagless components

      if (!hasWrappedElement) {
        if (isInteractive) {
          component.trigger('willRender');
        }

        component._transitionTo('hasElement');

        if (isInteractive) {
          component.trigger('willInsertElement');
        }
      }

      if (false
      /* DEBUG */
      ) {
        processComponentInitializationAssertions(component, {});
      }

      var bucket = new ComponentStateBucket(component, null, _validator.CONSTANT_TAG, finalizer, hasWrappedElement, isInteractive);
      (0, _validator.consumeTag)(component[DIRTY_TAG]);
      return bucket;
    };

    return RootComponentManager;
  }(CurlyComponentManager); // ROOT is the top-level template it has nothing but one yield.
  // it is supposed to have a dummy element


  var ROOT_CAPABILITIES = {
    dynamicLayout: true,
    dynamicTag: true,
    prepareArgs: false,
    createArgs: false,
    attributeHook: true,
    elementHook: true,
    createCaller: true,
    dynamicScope: true,
    updateHook: true,
    createInstance: true,
    wrapped: true,
    willDestroy: false,
    hasSubOwner: false
  };

  var RootComponentDefinition = function RootComponentDefinition(component) {
    // handle is not used by this custom definition
    this.handle = -1;
    this.resolvedName = '-top-level';
    this.capabilities = (0, _manager2.capabilityFlagsFrom)(ROOT_CAPABILITIES);
    this.compilable = null;
    this.manager = new RootComponentManager(component);
    this.state = (0, _container.getFactoryFor)(component);
  };
  /**
  @module ember
  */

  /**
    The `{{#each}}` helper loops over elements in a collection. It is an extension
    of the base Handlebars `{{#each}}` helper.
  
    The default behavior of `{{#each}}` is to yield its inner block once for every
    item in an array passing the item as the first block parameter.
  
    Assuming the `@developers` argument contains this array:
  
    ```javascript
    [{ name: 'Yehuda' },{ name: 'Tom' }, { name: 'Paul' }];
    ```
  
    ```handlebars
    <ul>
      {{#each @developers as |person|}}
        <li>Hello, {{person.name}}!</li>
      {{/each}}
    </ul>
    ```
  
    The same rules apply to arrays of primitives.
  
    ```javascript
    ['Yehuda', 'Tom', 'Paul']
    ```
  
    ```handlebars
    <ul>
      {{#each @developerNames as |name|}}
        <li>Hello, {{name}}!</li>
      {{/each}}
    </ul>
    ```
  
    During iteration, the index of each item in the array is provided as a second block
    parameter.
  
    ```handlebars
    <ul>
      {{#each @developers as |person index|}}
        <li>Hello, {{person.name}}! You're number {{index}} in line</li>
      {{/each}}
    </ul>
    ```
  
    ### Specifying Keys
  
    In order to improve rendering speed, Ember will try to reuse the DOM elements
    where possible. Specifically, if the same item is present in the array both
    before and after the change, its DOM output will be reused.
  
    The `key` option is used to tell Ember how to determine if the items in the
    array being iterated over with `{{#each}}` has changed between renders. By
    default the item's object identity is used.
  
    This is usually sufficient, so in most cases, the `key` option is simply not
    needed. However, in some rare cases, the objects' identities may change even
    though they represent the same underlying data.
  
    For example:
  
    ```javascript
    people.map(person => {
      return { ...person, type: 'developer' };
    });
    ```
  
    In this case, each time the `people` array is `map`-ed over, it will produce
    an new array with completely different objects between renders. In these cases,
    you can help Ember determine how these objects related to each other with the
    `key` option:
  
    ```handlebars
    <ul>
      {{#each @developers key="name" as |person|}}
        <li>Hello, {{person.name}}!</li>
      {{/each}}
    </ul>
    ```
  
    By doing so, Ember will use the value of the property specified (`person.name`
    in the example) to find a "match" from the previous render. That is, if Ember
    has previously seen an object from the `@developers` array with a matching
    name, its DOM elements will be re-used.
  
    There are two special values for `key`:
  
      * `@index` - The index of the item in the array.
      * `@identity` - The item in the array itself.
  
    ### {{else}} condition
  
    `{{#each}}` can have a matching `{{else}}`. The contents of this block will render
    if the collection is empty.
  
    ```handlebars
    <ul>
      {{#each @developers as |person|}}
        <li>{{person.name}} is available!</li>
      {{else}}
        <li>Sorry, nobody is available for this task.</li>
      {{/each}}
    </ul>
    ```
  
    @method each
    @for Ember.Templates.helpers
    @public
   */

  /**
    The `{{each-in}}` helper loops over properties on an object.
  
    For example, given this component definition:
  
    ```app/components/developer-details.js
    import Component from '@glimmer/component';
    import { tracked } from '@glimmer/tracking';
  
    export default class extends Component {
      @tracked developer = {
        "name": "Shelly Sails",
        "age": 42
      };
    }
    ```
  
    This template would display all properties on the `developer`
    object in a list:
  
    ```app/components/developer-details.hbs
    <ul>
      {{#each-in this.developer as |key value|}}
        <li>{{key}}: {{value}}</li>
      {{/each-in}}
    </ul>
    ```
  
    Outputting their name and age.
  
    @method each-in
    @for Ember.Templates.helpers
    @public
    @since 2.1.0
  */


  var EachInWrapper = function EachInWrapper(inner) {
    this.inner = inner;
  };

  var eachIn = internalHelper(function (_ref13) {
    var positional = _ref13.positional;
    var inner = positional[0];
    return (0, _reference.createComputeRef)(function () {
      var iterable = (0, _reference.valueForRef)(inner);
      (0, _validator.consumeTag)((0, _metal.tagForObject)(iterable));

      if ((0, _utils.isProxy)(iterable)) {
        // this is because the each-in doesn't actually get(proxy, 'key') but bypasses it
        // and the proxy's tag is lazy updated on access
        iterable = (0, _runtime2._contentFor)(iterable);
      }

      return new EachInWrapper(iterable);
    });
  });

  function toIterator(iterable) {
    if (iterable instanceof EachInWrapper) {
      return toEachInIterator(iterable.inner);
    } else {
      return toEachIterator(iterable);
    }
  }

  function toEachInIterator(iterable) {
    if (!isIndexable(iterable)) {
      return null;
    }

    if (Array.isArray(iterable) || (0, _utils.isEmberArray)(iterable)) {
      return ObjectIterator.fromIndexable(iterable);
    } else if (_utils.HAS_NATIVE_SYMBOL && isNativeIterable(iterable)) {
      return MapLikeNativeIterator.from(iterable);
    } else if (hasForEach(iterable)) {
      return ObjectIterator.fromForEachable(iterable);
    } else {
      return ObjectIterator.fromIndexable(iterable);
    }
  }

  function toEachIterator(iterable) {
    if (!(0, _utils.isObject)(iterable)) {
      return null;
    }

    if (Array.isArray(iterable)) {
      return ArrayIterator.from(iterable);
    } else if ((0, _utils.isEmberArray)(iterable)) {
      return EmberArrayIterator.from(iterable);
    } else if (_utils.HAS_NATIVE_SYMBOL && isNativeIterable(iterable)) {
      return ArrayLikeNativeIterator.from(iterable);
    } else if (hasForEach(iterable)) {
      return ArrayIterator.fromForEachable(iterable);
    } else {
      return null;
    }
  }

  var BoundedIterator = /*#__PURE__*/function () {
    function BoundedIterator(length) {
      this.length = length;
      this.position = 0;
    }

    var _proto17 = BoundedIterator.prototype;

    _proto17.isEmpty = function isEmpty() {
      return false;
    };

    _proto17.memoFor = function memoFor(position) {
      return position;
    };

    _proto17.next = function next() {
      var length = this.length,
          position = this.position;

      if (position >= length) {
        return null;
      }

      var value = this.valueFor(position);
      var memo = this.memoFor(position);
      this.position++;
      return {
        value: value,
        memo: memo
      };
    };

    return BoundedIterator;
  }();

  var ArrayIterator = /*#__PURE__*/function (_BoundedIterator) {
    (0, _emberBabel.inheritsLoose)(ArrayIterator, _BoundedIterator);

    function ArrayIterator(array$$1) {
      var _this9;

      _this9 = _BoundedIterator.call(this, array$$1.length) || this;
      _this9.array = array$$1;
      return _this9;
    }

    ArrayIterator.from = function from(iterable) {
      return iterable.length > 0 ? new this(iterable) : null;
    };

    ArrayIterator.fromForEachable = function fromForEachable(object) {
      var array$$1 = [];
      object.forEach(function (item) {
        return array$$1.push(item);
      });
      return this.from(array$$1);
    };

    var _proto18 = ArrayIterator.prototype;

    _proto18.valueFor = function valueFor(position) {
      return this.array[position];
    };

    return ArrayIterator;
  }(BoundedIterator);

  var EmberArrayIterator = /*#__PURE__*/function (_BoundedIterator2) {
    (0, _emberBabel.inheritsLoose)(EmberArrayIterator, _BoundedIterator2);

    function EmberArrayIterator(array$$1) {
      var _this10;

      _this10 = _BoundedIterator2.call(this, array$$1.length) || this;
      _this10.array = array$$1;
      return _this10;
    }

    EmberArrayIterator.from = function from(iterable) {
      return iterable.length > 0 ? new this(iterable) : null;
    };

    var _proto19 = EmberArrayIterator.prototype;

    _proto19.valueFor = function valueFor(position) {
      return (0, _metal.objectAt)(this.array, position);
    };

    return EmberArrayIterator;
  }(BoundedIterator);

  var ObjectIterator = /*#__PURE__*/function (_BoundedIterator3) {
    (0, _emberBabel.inheritsLoose)(ObjectIterator, _BoundedIterator3);

    function ObjectIterator(keys, values) {
      var _this11;

      _this11 = _BoundedIterator3.call(this, values.length) || this;
      _this11.keys = keys;
      _this11.values = values;
      return _this11;
    }

    ObjectIterator.fromIndexable = function fromIndexable(obj) {
      var keys = Object.keys(obj);
      var length = keys.length;

      if (length === 0) {
        return null;
      } else {
        var values = [];

        for (var i = 0; i < length; i++) {
          var value = void 0;
          var key = keys[i];
          value = obj[key]; // Add the tag of the returned value if it is an array, since arrays
          // should always cause updates if they are consumed and then changed

          if ((0, _validator.isTracking)()) {
            (0, _validator.consumeTag)((0, _validator.tagFor)(obj, key));

            if (Array.isArray(value)) {
              (0, _validator.consumeTag)((0, _validator.tagFor)(value, '[]'));
            }
          }

          values.push(value);
        }

        return new this(keys, values);
      }
    };

    ObjectIterator.fromForEachable = function fromForEachable(obj) {
      var keys = [];
      var values = [];
      var length = 0;
      var isMapLike = false; // Not using an arrow function here so we can get an accurate `arguments`

      obj.forEach(function (value, key) {
        isMapLike = isMapLike || arguments.length >= 2;

        if (isMapLike) {
          keys.push(key);
        }

        values.push(value);
        length++;
      });

      if (length === 0) {
        return null;
      } else if (isMapLike) {
        return new this(keys, values);
      } else {
        return new ArrayIterator(values);
      }
    };

    var _proto20 = ObjectIterator.prototype;

    _proto20.valueFor = function valueFor(position) {
      return this.values[position];
    };

    _proto20.memoFor = function memoFor(position) {
      return this.keys[position];
    };

    return ObjectIterator;
  }(BoundedIterator);

  var NativeIterator = /*#__PURE__*/function () {
    function NativeIterator(iterable, result) {
      this.iterable = iterable;
      this.result = result;
      this.position = 0;
    }

    NativeIterator.from = function from(iterable) {
      var iterator = iterable[Symbol.iterator]();
      var result = iterator.next();
      var done = result.done;

      if (done) {
        return null;
      } else {
        return new this(iterator, result);
      }
    };

    var _proto21 = NativeIterator.prototype;

    _proto21.isEmpty = function isEmpty() {
      return false;
    };

    _proto21.next = function next() {
      var iterable = this.iterable,
          result = this.result,
          position = this.position;

      if (result.done) {
        return null;
      }

      var value = this.valueFor(result, position);
      var memo = this.memoFor(result, position);
      this.position++;
      this.result = iterable.next();
      return {
        value: value,
        memo: memo
      };
    };

    return NativeIterator;
  }();

  var ArrayLikeNativeIterator = /*#__PURE__*/function (_NativeIterator) {
    (0, _emberBabel.inheritsLoose)(ArrayLikeNativeIterator, _NativeIterator);

    function ArrayLikeNativeIterator() {
      return _NativeIterator.apply(this, arguments) || this;
    }

    var _proto22 = ArrayLikeNativeIterator.prototype;

    _proto22.valueFor = function valueFor(result) {
      return result.value;
    };

    _proto22.memoFor = function memoFor(_result, position) {
      return position;
    };

    return ArrayLikeNativeIterator;
  }(NativeIterator);

  var MapLikeNativeIterator = /*#__PURE__*/function (_NativeIterator2) {
    (0, _emberBabel.inheritsLoose)(MapLikeNativeIterator, _NativeIterator2);

    function MapLikeNativeIterator() {
      return _NativeIterator2.apply(this, arguments) || this;
    }

    var _proto23 = MapLikeNativeIterator.prototype;

    _proto23.valueFor = function valueFor(result) {
      return result.value[1];
    };

    _proto23.memoFor = function memoFor(result) {
      return result.value[0];
    };

    return MapLikeNativeIterator;
  }(NativeIterator);

  function hasForEach(value) {
    return typeof value['forEach'] === 'function';
  }

  function isNativeIterable(value) {
    return typeof value[Symbol.iterator] === 'function';
  }

  function isIndexable(value) {
    return value !== null && (typeof value === 'object' || typeof value === 'function');
  }

  function toBool(predicate) {
    if ((0, _utils.isProxy)(predicate)) {
      (0, _validator.consumeTag)((0, _metal.tagForProperty)(predicate, 'content'));
      return Boolean((0, _metal.get)(predicate, 'isTruthy'));
    } else if ((0, _runtime2.isArray)(predicate)) {
      (0, _validator.consumeTag)((0, _metal.tagForProperty)(predicate, '[]'));
      return predicate.length !== 0;
    } else if ((0, _glimmer.isHTMLSafe)(predicate)) {
      return Boolean(predicate.toString());
    } else {
      return Boolean(predicate);
    }
  } // Setup global context


  (0, _globalContext.default)({
    scheduleRevalidate: function scheduleRevalidate() {
      _runloop.backburner.ensureInstance();
    },
    toBool: toBool,
    toIterator: toIterator,
    getProp: _metal._getProp,
    setProp: _metal._setProp,
    getPath: _metal.get,
    setPath: _metal.set,
    scheduleDestroy: function scheduleDestroy(destroyable, destructor) {
      (0, _runloop.schedule)('actions', null, destructor, destroyable);
    },
    scheduleDestroyed: function scheduleDestroyed(finalizeDestructor) {
      (0, _runloop.schedule)('destroy', null, finalizeDestructor);
    },
    warnIfStyleNotTrusted: function warnIfStyleNotTrusted(value) {
      (false && (0, _debug.warn)((0, _views.constructStyleDeprecationMessage)(value), function () {
        if (value === null || value === undefined || isHTMLSafe$1(value)) {
          return true;
        }

        return false;
      }(), {
        id: 'ember-htmlbars.style-xss-warning'
      }));
    },
    assert: function assert(test, msg, options) {
      var _a;

      if (false
      /* DEBUG */
      ) {
        var id = options === null || options === void 0 ? void 0 : options.id;
        var override = VM_ASSERTION_OVERRIDES.filter(function (o) {
          return o.id === id;
        })[0];
        (false && !(test) && (0, _debug.assert)((_a = override === null || override === void 0 ? void 0 : override.message) !== null && _a !== void 0 ? _a : msg, test));
      }
    },
    deprecate: function deprecate(msg, test, options) {
      var _a;

      if (false
      /* DEBUG */
      ) {
        var id = options.id;
        var override = VM_DEPRECATION_OVERRIDES.filter(function (o) {
          return o.id === id;
        })[0];
        if (!override) throw new Error("deprecation override for " + id + " not found"); // allow deprecations to be disabled in the VM_DEPRECATION_OVERRIDES array below

        if (!override.disabled) {
          (false && !(Boolean(test)) && (0, _debug.deprecate)((_a = override.message) !== null && _a !== void 0 ? _a : msg, Boolean(test), override));
        }
      }
    }
  });

  if (false
  /* DEBUG */
  ) {
    _validator.setTrackingTransactionEnv === null || _validator.setTrackingTransactionEnv === void 0 ? void 0 : (0, _validator.setTrackingTransactionEnv)({
      debugMessage: function debugMessage(obj, keyName) {
        var dirtyString = keyName ? "`" + keyName + "` on `" + (_utils.getDebugName === null || _utils.getDebugName === void 0 ? void 0 : (0, _utils.getDebugName)(obj)) + "`" : "`" + (_utils.getDebugName === null || _utils.getDebugName === void 0 ? void 0 : (0, _utils.getDebugName)(obj)) + "`";
        return "You attempted to update " + dirtyString + ", but it had already been used previously in the same computation.  Attempting to update a value after using it in a computation can cause logical errors, infinite revalidation bugs, and performance issues, and is not supported.";
      }
    });
  } ///////////
  // VM Assertion/Deprecation overrides


  var VM_DEPRECATION_OVERRIDES = [{
    id: 'autotracking.mutation-after-consumption',
    until: '4.0.0',
    for: 'ember-source',
    since: {
      enabled: '3.21.0'
    }
  }, {
    id: 'this-property-fallback',
    disabled: _environment2.ENV._DISABLE_PROPERTY_FALLBACK_DEPRECATION,
    url: 'https://deprecations.emberjs.com/v3.x#toc_this-property-fallback',
    until: '4.0.0',
    for: 'ember-source',
    since: {
      enabled: '3.26.0'
    }
  }];
  var VM_ASSERTION_OVERRIDES = []; ///////////
  // Define environment delegate

  var EmberEnvironmentDelegate = /*#__PURE__*/function () {
    function EmberEnvironmentDelegate(owner, isInteractive) {
      this.owner = owner;
      this.isInteractive = isInteractive;
      this.enableDebugTooling = _environment2.ENV._DEBUG_RENDER_TREE;
    }

    var _proto24 = EmberEnvironmentDelegate.prototype;

    _proto24.onTransactionCommit = function onTransactionCommit() {};

    return EmberEnvironmentDelegate;
  }();

  var helper$1;

  if (false
  /* DEBUG */
  ) {
    helper$1 = function helper$1(args) {
      var inner = args.positional[0];
      return (0, _reference.createComputeRef)(function () {
        var value = (0, _reference.valueForRef)(inner);
        (false && !(value !== null && value !== undefined) && (0, _debug.assert)('You cannot pass a null or undefined destination element to in-element', value !== null && value !== undefined));
        return value;
      });
    };
  } else {
    helper$1 = function helper$1(args) {
      return args.positional[0];
    };
  }

  var inElementNullCheckHelper = internalHelper(helper$1);
  var normalizeClassHelper = internalHelper(function (_ref14) {
    var positional = _ref14.positional;
    return (0, _reference.createComputeRef)(function () {
      var classNameParts = (0, _reference.valueForRef)(positional[0]).split('.');
      var className = classNameParts[classNameParts.length - 1];
      var value = (0, _reference.valueForRef)(positional[1]);

      if (value === true) {
        return (0, _string.dasherize)(className);
      } else if (!value && value !== 0) {
        return '';
      } else {
        return String(value);
      }
    });
  });
  /**
  @module ember
  */

  /**
    This reference is used to get the `[]` tag of iterables, so we can trigger
    updates to `{{each}}` when it changes. It is put into place by a template
    transform at build time, similar to the (-each-in) helper
  */

  var trackArray = internalHelper(function (_ref15) {
    var positional = _ref15.positional;
    var inner = positional[0];
    return (0, _reference.createComputeRef)(function () {
      var iterable = (0, _reference.valueForRef)(inner);

      if ((0, _utils.isObject)(iterable)) {
        (0, _validator.consumeTag)((0, _metal.tagForProperty)(iterable, '[]'));
      }

      return iterable;
    });
  });
  /**
  @module ember
  */

  /**
    The `mut` helper lets you __clearly specify__ that a child `Component` can update the
    (mutable) value passed to it, which will __change the value of the parent component__.
  
    To specify that a parameter is mutable, when invoking the child `Component`:
  
    ```handlebars
    <MyChild @childClickCount={{fn (mut totalClicks)}} />
    ```
  
     or
  
    ```handlebars
    {{my-child childClickCount=(mut totalClicks)}}
    ```
  
    The child `Component` can then modify the parent's value just by modifying its own
    property:
  
    ```javascript
    // my-child.js
    export default Component.extend({
      click() {
        this.incrementProperty('childClickCount');
      }
    });
    ```
  
    Note that for curly components (`{{my-component}}`) the bindings are already mutable,
    making the `mut` unnecessary.
  
    Additionally, the `mut` helper can be combined with the `fn` helper to
    mutate a value. For example:
  
    ```handlebars
    <MyChild @childClickCount={{this.totalClicks}} @click-count-change={{fn (mut totalClicks))}} />
    ```
  
    or
  
    ```handlebars
    {{my-child childClickCount=totalClicks click-count-change=(fn (mut totalClicks))}}
    ```
  
    The child `Component` would invoke the function with the new click value:
  
    ```javascript
    // my-child.js
    export default Component.extend({
      click() {
        this.get('click-count-change')(this.get('childClickCount') + 1);
      }
    });
    ```
  
    The `mut` helper changes the `totalClicks` value to what was provided as the `fn` argument.
  
    The `mut` helper, when used with `fn`, will return a function that
    sets the value passed to `mut` to its first argument. As an example, we can create a
    button that increments a value passing the value directly to the `fn`:
  
    ```handlebars
    {{! inc helper is not provided by Ember }}
    <button onclick={{fn (mut count) (inc count)}}>
      Increment count
    </button>
    ```
  
    @method mut
    @param {Object} [attr] the "two-way" attribute that can be modified.
    @for Ember.Templates.helpers
    @public
  */

  var mut = internalHelper(function (_ref16) {
    var positional = _ref16.positional;
    var ref = positional[0]; // TODO: Improve this error message. This covers at least two distinct
    // cases:
    //
    // 1. (mut "not a path") – passing a literal, result from a helper
    //    invocation, etc
    //
    // 2. (mut receivedValue) – passing a value received from the caller
    //    that was originally derived from a literal, result from a helper
    //    invocation, etc
    //
    // This message is alright for the first case, but could be quite
    // confusing for the second case.

    (false && !((0, _reference.isUpdatableRef)(ref)) && (0, _debug.assert)('You can only pass a path to mut', (0, _reference.isUpdatableRef)(ref)));
    return (0, _reference.createInvokableRef)(ref);
  });
  /**
  @module ember
  */

  /**
    This is a helper to be used in conjunction with the link-to helper.
    It will supply url query parameters to the target route.
  
    @example In this example we are setting the `direction` query param to the value `"asc"`
  
    ```app/templates/application.hbs
    <LinkTo
      @route="posts"
      {{query-params direction="asc"}}
    >
      Sort
    </LinkTo>
    ```
  
    @method query-params
    @for Ember.Templates.helpers
    @param {Object} hash takes a hash of query parameters
    @return {Object} A `QueryParams` object for `{{link-to}}`
    @public
  */

  var queryParams = internalHelper(function (_ref17) {
    var positional = _ref17.positional,
        named = _ref17.named;
    return (0, _reference.createComputeRef)(function () {
      (false && !(positional.length === 0) && (0, _debug.assert)("The `query-params` helper only accepts named arguments, e.g. (query-params queryParamPropertyName='foo') as opposed to (query-params 'foo')", positional.length === 0));
      (false && !(false) && (0, _debug.deprecate)('The `query-params` helper is deprecated. Invoke `<LinkTo>` with the `@query` named argument and the `hash` helper instead.', false, {
        id: 'ember-glimmer.link-to.positional-arguments',
        until: '4.0.0',
        for: 'ember-source',
        url: 'https://deprecations.emberjs.com/v3.x#toc_ember-glimmer-link-to-positional-arguments',
        since: {
          enabled: '3.26.0-beta.1'
        }
      }));
      return new _routing.QueryParams((0, _polyfills.assign)({}, (0, _runtime.reifyNamed)(named)));
    });
  });
  /**
    The `readonly` helper let's you specify that a binding is one-way only,
    instead of two-way.
    When you pass a `readonly` binding from an outer context (e.g. parent component),
    to to an inner context (e.g. child component), you are saying that changing that
    property in the inner context does not change the value in the outer context.
  
    To specify that a binding is read-only, when invoking the child `Component`:
  
    ```app/components/my-parent.js
    export default Component.extend({
      totalClicks: 3
    });
    ```
  
    ```app/templates/components/my-parent.hbs
    {{log totalClicks}} // -> 3
    <MyChild @childClickCount={{readonly totalClicks}} />
    ```
    ```
    {{my-child childClickCount=(readonly totalClicks)}}
    ```
  
    Now, when you update `childClickCount`:
  
    ```app/components/my-child.js
    export default Component.extend({
      click() {
        this.incrementProperty('childClickCount');
      }
    });
    ```
  
    The value updates in the child component, but not the parent component:
  
    ```app/templates/components/my-child.hbs
    {{log childClickCount}} //-> 4
    ```
  
    ```app/templates/components/my-parent.hbs
    {{log totalClicks}} //-> 3
    <MyChild @childClickCount={{readonly totalClicks}} />
    ```
    or
    ```app/templates/components/my-parent.hbs
    {{log totalClicks}} //-> 3
    {{my-child childClickCount=(readonly totalClicks)}}
    ```
  
    ### Objects and Arrays
  
    When passing a property that is a complex object (e.g. object, array) instead of a primitive object (e.g. number, string),
    only the reference to the object is protected using the readonly helper.
    This means that you can change properties of the object both on the parent component, as well as the child component.
    The `readonly` binding behaves similar to the `const` keyword in JavaScript.
  
    Let's look at an example:
  
    First let's set up the parent component:
  
    ```app/components/my-parent.js
    import Component from '@ember/component';
  
    export default Component.extend({
      clicks: null,
  
      init() {
        this._super(...arguments);
        this.set('clicks', { total: 3 });
      }
    });
    ```
  
    ```app/templates/components/my-parent.hbs
    {{log clicks.total}} //-> 3
    <MyChild @childClicks={{readonly clicks}} />
    ```
    ```app/templates/components/my-parent.hbs
    {{log clicks.total}} //-> 3
    {{my-child childClicks=(readonly clicks)}}
    ```
  
    Now, if you update the `total` property of `childClicks`:
  
    ```app/components/my-child.js
    import Component from '@ember/component';
  
    export default Component.extend({
      click() {
        this.get('clicks').incrementProperty('total');
      }
    });
    ```
  
    You will see the following happen:
  
    ```app/templates/components/my-parent.hbs
    {{log clicks.total}} //-> 4
    <MyChild @childClicks={{readonly clicks}} />
    ```
    or
    ```app/templates/components/my-parent.hbs
    {{log clicks.total}} //-> 4
    {{my-child childClicks=(readonly clicks)}}
    ```
  
    ```app/templates/components/my-child.hbs
    {{log childClicks.total}} //-> 4
    ```
  
    @method readonly
    @param {Object} [attr] the read-only attribute.
    @for Ember.Templates.helpers
    @private
  */

  var readonly = internalHelper(function (_ref18) {
    var positional = _ref18.positional;
    return (0, _reference.createReadOnlyRef)(positional[0]);
  });
  /**
  @module ember
  */

  /**
    The `{{unbound}}` helper disconnects the one-way binding of a property,
    essentially freezing its value at the moment of rendering. For example,
    in this example the display of the variable `name` will not change even
    if it is set with a new value:
  
    ```handlebars
    {{unbound this.name}}
    ```
  
    Like any helper, the `unbound` helper can accept a nested helper expression.
    This allows for custom helpers to be rendered unbound:
  
    ```handlebars
    {{unbound (some-custom-helper)}}
    {{unbound (capitalize this.name)}}
    {{! You can use any helper, including unbound, in a nested expression }}
    {{capitalize (unbound this.name)}}
    ```
  
    The `unbound` helper only accepts a single argument, and it return an
    unbound value.
  
    @method unbound
    @for Ember.Templates.helpers
    @public
  */

  var unbound = internalHelper(function (_ref19) {
    var positional = _ref19.positional,
        named = _ref19.named;
    (false && !(positional.length === 1 && Object.keys(named).length === 0) && (0, _debug.assert)('unbound helper cannot be called with multiple params or hash params', positional.length === 1 && Object.keys(named).length === 0));
    return (0, _reference.createUnboundRef)((0, _reference.valueForRef)(positional[0]), '(resurt of an `unbound` helper)');
  });
  var MODIFIERS = ['alt', 'shift', 'meta', 'ctrl'];
  var POINTER_EVENT_TYPE_REGEX = /^click|mouse|touch/;

  function isAllowedEvent(event, allowedKeys) {
    if (allowedKeys === null || allowedKeys === undefined) {
      if (POINTER_EVENT_TYPE_REGEX.test(event.type)) {
        return (0, _views.isSimpleClick)(event);
      } else {
        allowedKeys = '';
      }
    }

    if (allowedKeys.indexOf('any') >= 0) {
      return true;
    }

    for (var i = 0; i < MODIFIERS.length; i++) {
      if (event[MODIFIERS[i] + 'Key'] && allowedKeys.indexOf(MODIFIERS[i]) === -1) {
        return false;
      }
    }

    return true;
  }

  var ActionHelper = {
    // registeredActions is re-exported for compatibility with older plugins
    // that were using this undocumented API.
    registeredActions: _views.ActionManager.registeredActions,
    registerAction: function registerAction(actionState) {
      var actionId = actionState.actionId;
      _views.ActionManager.registeredActions[actionId] = actionState;
      return actionId;
    },
    unregisterAction: function unregisterAction(actionState) {
      var actionId = actionState.actionId;
      delete _views.ActionManager.registeredActions[actionId];
    }
  };

  var ActionState = /*#__PURE__*/function () {
    function ActionState(element, actionId, actionArgs, namedArgs, positionalArgs) {
      var _this12 = this;

      this.tag = (0, _validator.createUpdatableTag)();
      this.element = element;
      this.actionId = actionId;
      this.actionArgs = actionArgs;
      this.namedArgs = namedArgs;
      this.positional = positionalArgs;
      this.eventName = this.getEventName();
      (0, _destroyable.registerDestructor)(this, function () {
        return ActionHelper.unregisterAction(_this12);
      });
    }

    var _proto25 = ActionState.prototype;

    _proto25.getEventName = function getEventName() {
      var on$$1 = this.namedArgs.on;
      return on$$1 !== undefined ? (0, _reference.valueForRef)(on$$1) : 'click';
    };

    _proto25.getActionArgs = function getActionArgs() {
      var result = new Array(this.actionArgs.length);

      for (var i = 0; i < this.actionArgs.length; i++) {
        result[i] = (0, _reference.valueForRef)(this.actionArgs[i]);
      }

      return result;
    };

    _proto25.getTarget = function getTarget() {
      var implicitTarget = this.implicitTarget,
          namedArgs = this.namedArgs;
      var target = namedArgs.target;
      return target !== undefined ? (0, _reference.valueForRef)(target) : (0, _reference.valueForRef)(implicitTarget);
    };

    _proto25.handler = function handler(event) {
      var _this13 = this;

      var actionName = this.actionName,
          namedArgs = this.namedArgs;
      var bubbles = namedArgs.bubbles,
          preventDefault = namedArgs.preventDefault,
          allowedKeys = namedArgs.allowedKeys;
      var bubblesVal = bubbles !== undefined ? (0, _reference.valueForRef)(bubbles) : undefined;
      var preventDefaultVal = preventDefault !== undefined ? (0, _reference.valueForRef)(preventDefault) : undefined;
      var allowedKeysVal = allowedKeys !== undefined ? (0, _reference.valueForRef)(allowedKeys) : undefined;
      var target = this.getTarget();
      var shouldBubble = bubblesVal !== false;

      if (!isAllowedEvent(event, allowedKeysVal)) {
        return true;
      }

      if (preventDefaultVal !== false) {
        event.preventDefault();
      }

      if (!shouldBubble) {
        event.stopPropagation();
      }

      (0, _runloop.join)(function () {
        var args = _this13.getActionArgs();

        var payload = {
          args: args,
          target: target,
          name: null
        };

        if (typeof actionName[INVOKE] === 'function') {
          (false && !(false) && (0, _debug.deprecate)("Usage of the private INVOKE API to make an object callable via action or fn is no longer supported. Please update to pass in a callback function instead. Received: " + String(actionName), false, {
            until: '3.25.0',
            id: 'actions.custom-invoke-invokable',
            for: 'ember-source',
            since: {
              enabled: '3.23.0-beta.1'
            }
          }));
          (0, _instrumentation.flaggedInstrument)('interaction.ember-action', payload, function () {
            actionName[INVOKE].apply(actionName, args);
          });
          return;
        }

        if ((0, _reference.isInvokableRef)(actionName)) {
          (0, _instrumentation.flaggedInstrument)('interaction.ember-action', payload, function () {
            (0, _reference.updateRef)(actionName, args[0]);
          });
          return;
        }

        if (typeof actionName === 'function') {
          (0, _instrumentation.flaggedInstrument)('interaction.ember-action', payload, function () {
            actionName.apply(target, args);
          });
          return;
        }

        payload.name = actionName;

        if (target.send) {
          (0, _instrumentation.flaggedInstrument)('interaction.ember-action', payload, function () {
            target.send.apply(target, [actionName].concat(args));
          });
        } else {
          (false && !(typeof target[actionName] === 'function') && (0, _debug.assert)("The action '" + actionName + "' did not exist on " + target, typeof target[actionName] === 'function'));
          (0, _instrumentation.flaggedInstrument)('interaction.ember-action', payload, function () {
            target[actionName].apply(target, args);
          });
        }
      });
      return shouldBubble;
    };

    return ActionState;
  }();

  var ActionModifierManager = /*#__PURE__*/function () {
    function ActionModifierManager() {}

    var _proto26 = ActionModifierManager.prototype;

    _proto26.create = function create(_owner, element, _state, _ref20) {
      var named = _ref20.named,
          positional = _ref20.positional;
      var actionArgs = []; // The first two arguments are (1) `this` and (2) the action name.
      // Everything else is a param.

      for (var i = 2; i < positional.length; i++) {
        actionArgs.push(positional[i]);
      }

      var actionId = (0, _utils.uuid)();
      var actionState = new ActionState(element, actionId, actionArgs, named, positional);
      (false && !(actionState.eventName !== 'mouseEnter' && actionState.eventName !== 'mouseLeave' && actionState.eventName !== 'mouseMove') && (0, _debug.deprecate)("Using the `{{action}}` modifier with `" + actionState.eventName + "` events has been deprecated.", actionState.eventName !== 'mouseEnter' && actionState.eventName !== 'mouseLeave' && actionState.eventName !== 'mouseMove', {
        id: 'ember-views.event-dispatcher.mouseenter-leave-move',
        until: '4.0.0',
        url: 'https://emberjs.com/deprecations/v3.x#toc_action-mouseenter-leave-move',
        for: 'ember-source',
        since: {
          enabled: '3.13.0-beta.1'
        }
      }));
      return actionState;
    };

    _proto26.getDebugName = function getDebugName() {
      return 'action';
    };

    _proto26.install = function install(actionState) {
      var element = actionState.element,
          actionId = actionState.actionId,
          positional = actionState.positional;
      var actionName;
      var actionNameRef;
      var implicitTarget;

      if (positional.length > 1) {
        implicitTarget = positional[0];
        actionNameRef = positional[1];

        if ((0, _reference.isInvokableRef)(actionNameRef)) {
          actionName = actionNameRef;
        } else {
          actionName = (0, _reference.valueForRef)(actionNameRef);

          if (false
          /* DEBUG */
          ) {
            var actionPath = actionNameRef.debugLabel;
            var actionPathParts = actionPath.split('.');
            var actionLabel = actionPathParts[actionPathParts.length - 1];
            (false && !(typeof actionName === 'string' || typeof actionName === 'function') && (0, _debug.assert)('You specified a quoteless path, `' + actionPath + '`, to the ' + '{{action}} helper which did not resolve to an action name (a ' + 'string). Perhaps you meant to use a quoted actionName? (e.g. ' + '{{action "' + actionLabel + '"}}).', typeof actionName === 'string' || typeof actionName === 'function'));
          }
        }
      }

      actionState.actionName = actionName;
      actionState.implicitTarget = implicitTarget;
      ActionHelper.registerAction(actionState);
      element.setAttribute('data-ember-action', '');
      element.setAttribute("data-ember-action-" + actionId, String(actionId));
    };

    _proto26.update = function update(actionState) {
      var positional = actionState.positional;
      var actionNameRef = positional[1];

      if (!(0, _reference.isInvokableRef)(actionNameRef)) {
        actionState.actionName = (0, _reference.valueForRef)(actionNameRef);
      }

      actionState.eventName = actionState.getEventName();
    };

    _proto26.getTag = function getTag(actionState) {
      return actionState.tag;
    };

    _proto26.getDestroyable = function getDestroyable(actionState) {
      return actionState;
    };

    return ActionModifierManager;
  }();

  var ACTION_MODIFIER_MANAGER = new ActionModifierManager();
  var actionModifier = (0, _manager2.setInternalModifierManager)(ACTION_MODIFIER_MANAGER, {});
  var CAPABILITIES$2 = {
    dynamicLayout: true,
    dynamicTag: false,
    prepareArgs: false,
    createArgs: true,
    attributeHook: false,
    elementHook: false,
    createCaller: true,
    dynamicScope: true,
    updateHook: true,
    createInstance: true,
    wrapped: false,
    willDestroy: false,
    hasSubOwner: true
  };

  var MountManager = /*#__PURE__*/function () {
    function MountManager() {}

    var _proto27 = MountManager.prototype;

    _proto27.getDynamicLayout = function getDynamicLayout(state) {
      var templateFactory$$1 = state.engine.lookup('template:application');
      return (0, _util.unwrapTemplate)(templateFactory$$1(state.engine)).asLayout();
    };

    _proto27.getCapabilities = function getCapabilities() {
      return CAPABILITIES$2;
    };

    _proto27.getOwner = function getOwner(state) {
      return state.engine;
    };

    _proto27.create = function create(owner, _ref21, args, env) {
      var name = _ref21.name;
      // TODO
      // mount is a runtime helper, this shouldn't use dynamic layout
      // we should resolve the engine app template in the helper
      // it also should use the owner that looked up the mount helper.
      var engine = owner.buildChildEngineInstance(name);
      engine.boot();
      var applicationFactory = engine.factoryFor("controller:application");
      var controllerFactory = applicationFactory || (0, _routing.generateControllerFactory)(engine, 'application');
      var controller;
      var self;
      var bucket;
      var modelRef;

      if (args.named.has('model')) {
        modelRef = args.named.get('model');
      }

      if (modelRef === undefined) {
        controller = controllerFactory.create();
        self = (0, _reference.createConstRef)(controller, 'this');
        bucket = {
          engine: engine,
          controller: controller,
          self: self,
          modelRef: modelRef
        };
      } else {
        var model = (0, _reference.valueForRef)(modelRef);
        controller = controllerFactory.create({
          model: model
        });
        self = (0, _reference.createConstRef)(controller, 'this');
        bucket = {
          engine: engine,
          controller: controller,
          self: self,
          modelRef: modelRef
        };
      }

      if (env.debugRenderTree) {
        (0, _destroyable.associateDestroyableChild)(engine, controller);
      }

      return bucket;
    };

    _proto27.getDebugName = function getDebugName(_ref22) {
      var name = _ref22.name;
      return name;
    };

    _proto27.getDebugCustomRenderTree = function getDebugCustomRenderTree(definition, state, args, templateModuleName) {
      return [{
        bucket: state.engine,
        instance: state.engine,
        type: 'engine',
        name: definition.name,
        args: args
      }, {
        bucket: state.controller,
        instance: state.controller,
        type: 'route-template',
        name: 'application',
        args: args,
        template: templateModuleName
      }];
    };

    _proto27.getSelf = function getSelf(_ref23) {
      var self = _ref23.self;
      return self;
    };

    _proto27.getDestroyable = function getDestroyable(bucket) {
      return bucket.engine;
    };

    _proto27.didCreate = function didCreate() {};

    _proto27.didUpdate = function didUpdate() {};

    _proto27.didRenderLayout = function didRenderLayout() {};

    _proto27.didUpdateLayout = function didUpdateLayout() {};

    _proto27.update = function update(bucket) {
      var controller = bucket.controller,
          modelRef = bucket.modelRef;

      if (modelRef !== undefined) {
        controller.set('model', (0, _reference.valueForRef)(modelRef));
      }
    };

    return MountManager;
  }();

  var MOUNT_MANAGER = new MountManager();

  var MountDefinition = function MountDefinition(resolvedName) {
    this.resolvedName = resolvedName; // handle is not used by this custom definition

    this.handle = -1;
    this.manager = MOUNT_MANAGER;
    this.compilable = null;
    this.capabilities = (0, _manager2.capabilityFlagsFrom)(CAPABILITIES$2);
    this.state = {
      name: resolvedName
    };
  };
  /**
    The `{{mount}}` helper lets you embed a routeless engine in a template.
    Mounting an engine will cause an instance to be booted and its `application`
    template to be rendered.
  
    For example, the following template mounts the `ember-chat` engine:
  
    ```handlebars
    {{! application.hbs }}
    {{mount "ember-chat"}}
    ```
  
    Additionally, you can also pass in a `model` argument that will be
    set as the engines model. This can be an existing object:
  
    ```
    <div>
      {{mount 'admin' model=userSettings}}
    </div>
    ```
  
    Or an inline `hash`, and you can even pass components:
  
    ```
    <div>
      <h1>Application template!</h1>
      {{mount 'admin' model=(hash
          title='Secret Admin'
          signInButton=(component 'sign-in-button')
      )}}
    </div>
    ```
  
    @method mount
    @param {String} name Name of the engine to mount.
    @param {Object} [model] Object that will be set as
                            the model of the engine.
    @for Ember.Templates.helpers
    @public
  */


  var mountHelper = internalHelper(function (args, owner) {
    (false && !(owner) && (0, _debug.assert)('{{mount}} must be used within a component that has an owner', owner));
    var nameRef = args.positional[0];
    var captured;
    (false && !(args.positional.length === 1) && (0, _debug.assert)('You can only pass a single positional argument to the {{mount}} helper, e.g. {{mount "chat-engine"}}.', args.positional.length === 1));

    if (false
    /* DEBUG */
    && args.named) {
      var keys = Object.keys(args.named);
      var extra = keys.filter(function (k) {
        return k !== 'model';
      });
      (false && !(extra.length === 0) && (0, _debug.assert)('You can only pass a `model` argument to the {{mount}} helper, ' + 'e.g. {{mount "profile-engine" model=this.profile}}. ' + ("You passed " + extra.join(',') + "."), extra.length === 0));
    }

    captured = (0, _runtime.createCapturedArgs)(args.named, _runtime.EMPTY_POSITIONAL);
    var lastName, lastDef;
    return (0, _reference.createComputeRef)(function () {
      var name = (0, _reference.valueForRef)(nameRef);

      if (typeof name === 'string') {
        if (lastName === name) {
          return lastDef;
        }

        (false && !(owner.hasRegistration("engine:" + name)) && (0, _debug.assert)("You used `{{mount '" + name + "'}}`, but the engine '" + name + "' can not be found.", owner.hasRegistration("engine:" + name)));
        lastName = name;
        lastDef = (0, _runtime.curry)(0
        /* Component */
        , new MountDefinition(name), owner, captured, true);
        return lastDef;
      } else {
        (false && !(name === null || name === undefined) && (0, _debug.assert)("Invalid engine name '" + name + "' specified, engine name must be either a string, null or undefined.", name === null || name === undefined));
        lastDef = null;
        lastName = null;
        return null;
      }
    });
  });
  /**
    The `{{outlet}}` helper lets you specify where a child route will render in
    your template. An important use of the `{{outlet}}` helper is in your
    application's `application.hbs` file:
  
    ```app/templates/application.hbs
    <MyHeader />
  
    <div class="my-dynamic-content">
      <!-- this content will change based on the current route, which depends on the current URL -->
      {{outlet}}
    </div>
  
    <MyFooter />
    ```
  
    You may also specify a name for the `{{outlet}}`, which is useful when using more than one
    `{{outlet}}` in a template:
  
    ```app/templates/application.hbs
    {{outlet "menu"}}
    {{outlet "sidebar"}}
    {{outlet "main"}}
    ```
  
    Your routes can then render into a specific one of these `outlet`s by specifying the `outlet`
    attribute in your `renderTemplate` function:
  
    ```app/routes/menu.js
    import Route from '@ember/routing/route';
  
    export default class MenuRoute extends Route {
      renderTemplate() {
        this.render({ outlet: 'menu' });
      }
    }
    ```
  
    See the [routing guide](https://guides.emberjs.com/release/routing/rendering-a-template/) for more
    information on how your `route` interacts with the `{{outlet}}` helper.
    Note: Your content __will not render__ if there isn't an `{{outlet}}` for it.
  
    @method outlet
    @param {String} [name]
    @for Ember.Templates.helpers
    @public
  */

  var outletHelper = internalHelper(function (args, owner, scope) {
    (false && !(owner) && (0, _debug.assert)('Expected owner to be present, {{outlet}} requires an owner', owner));
    (false && !(scope) && (0, _debug.assert)('Expected dynamic scope to be present. You may have attempted to use the {{outlet}} keyword dynamically. This keyword cannot be used dynamically.', scope));
    var nameRef;

    if (args.positional.length === 0) {
      nameRef = (0, _reference.createPrimitiveRef)('main');
    } else {
      nameRef = args.positional[0];
    }

    var outletRef = (0, _reference.createComputeRef)(function () {
      var state = (0, _reference.valueForRef)(scope.get('outletState'));
      var outlets = state !== undefined ? state.outlets : undefined;
      return outlets !== undefined ? outlets[(0, _reference.valueForRef)(nameRef)] : undefined;
    });
    var lastState = null;
    var definition = null;
    return (0, _reference.createComputeRef)(function () {
      var _a, _b;

      var outletState = (0, _reference.valueForRef)(outletRef);
      var state = stateFor(outletRef, outletState);

      if (!validate(state, lastState)) {
        lastState = state;

        if (state !== null) {
          var named = (0, _util.dict)();
          named.model = (0, _reference.childRefFromParts)(outletRef, ['render', 'model']);

          if (false
          /* DEBUG */
          ) {
            named.model = (0, _reference.createDebugAliasRef)('@model', named.model);
          }

          var _args2 = (0, _runtime.createCapturedArgs)(named, _runtime.EMPTY_POSITIONAL);

          definition = (0, _runtime.curry)(0
          /* Component */
          , new OutletComponentDefinition(state), (_b = (_a = outletState === null || outletState === void 0 ? void 0 : outletState.render) === null || _a === void 0 ? void 0 : _a.owner) !== null && _b !== void 0 ? _b : owner, _args2, true);
        } else {
          definition = null;
        }
      }

      return definition;
    });
  });

  function stateFor(ref, outlet) {
    if (outlet === undefined) return null;
    var render = outlet.render;
    if (render === undefined) return null;
    var template = render.template;
    if (template === undefined) return null; // this guard can be removed once @ember/test-helpers@1.6.0 has "aged out"
    // and is no longer considered supported

    if (isTemplateFactory(template)) {
      template = template(render.owner);
    }

    return {
      ref: ref,
      name: render.name,
      outlet: render.outlet,
      template: template,
      controller: render.controller,
      model: render.model
    };
  }

  function validate(state, lastState) {
    if (state === null) {
      return lastState === null;
    }

    if (lastState === null) {
      return false;
    }

    return state.template === lastState.template && state.controller === lastState.controller;
  }

  function instrumentationPayload$1(name) {
    return {
      object: "component:" + name
    };
  }

  function componentFor(name, owner, options) {
    var fullName = "component:" + name;
    return owner.factoryFor(fullName, options) || null;
  }

  function layoutFor(name, owner, options) {
    var templateFullName = "template:components/" + name;
    return owner.lookup(templateFullName, options) || null;
  }

  function lookupComponentPair(owner, name, options) {
    var component = componentFor(name, owner, options);

    if (component !== null && component.class !== undefined) {
      var _layout = (0, _manager2.getComponentTemplate)(component.class);

      if (_layout !== undefined) {
        return {
          component: component,
          layout: _layout
        };
      }
    }

    var layout = layoutFor(name, owner, options);

    if (component === null && layout === null) {
      return null;
    } else {
      return {
        component: component,
        layout: layout
      };
    }
  }

  var _lookupPartial;

  var templateFor;
  var parseUnderscoredName;

  if (_deprecatedFeatures.PARTIALS) {
    _lookupPartial = function lookupPartial(templateName, owner) {
      (false && !(false) && (0, _debug.deprecate)("The use of `{{partial}}` is deprecated, please refactor the \"" + templateName + "\" partial to a component", false, {
        id: 'ember-views.partial',
        until: '4.0.0',
        url: 'https://deprecations.emberjs.com/v3.x#toc_ember-views-partial',
        for: 'ember-source',
        since: {
          enabled: '3.15.0-beta.1'
        }
      }));

      if (templateName === null) {
        return;
      }

      var template = templateFor(owner, parseUnderscoredName(templateName), templateName);
      (false && !(Boolean(template)) && (0, _debug.assert)("Unable to find partial with name \"" + templateName + "\"", Boolean(template)));
      return template;
    };

    templateFor = function templateFor(owner, underscored, name) {
      if (_deprecatedFeatures.PARTIALS) {
        if (!name) {
          return;
        }

        (false && !(name.indexOf('.') === -1) && (0, _debug.assert)("templateNames are not allowed to contain periods: " + name, name.indexOf('.') === -1));

        if (!owner) {
          throw new _error.default('Container was not found when looking up a views template. ' + 'This is most likely due to manually instantiating an Ember.View. ' + 'See: http://git.io/EKPpnA');
        }

        return owner.lookup("template:" + underscored) || owner.lookup("template:" + name);
      }
    };

    parseUnderscoredName = function parseUnderscoredName(templateName) {
      var nameParts = templateName.split('/');
      var lastPart = nameParts[nameParts.length - 1];
      nameParts[nameParts.length - 1] = "_" + lastPart;
      return nameParts.join('/');
    };
  }

  var BUILTIN_KEYWORD_HELPERS = {
    action: action$1,
    mut: mut,
    readonly: readonly,
    unbound: unbound,
    'query-params': queryParams,
    '-hash': _runtime.hash,
    '-each-in': eachIn,
    '-normalize-class': normalizeClassHelper,
    '-track-array': trackArray,
    '-mount': mountHelper,
    '-outlet': outletHelper,
    '-in-el-null': inElementNullCheckHelper
  };
  var BUILTIN_HELPERS = (0, _polyfills.assign)((0, _polyfills.assign)({}, BUILTIN_KEYWORD_HELPERS), {
    array: _runtime.array,
    concat: _runtime.concat,
    fn: _runtime.fn,
    get: _runtime.get,
    hash: _runtime.hash
  });
  var BUILTIN_KEYWORD_MODIFIERS = {
    action: actionModifier
  };
  var BUILTIN_MODIFIERS = (0, _polyfills.assign)((0, _polyfills.assign)({}, BUILTIN_KEYWORD_MODIFIERS), {
    on: _runtime.on
  });
  var CLASSIC_HELPER_MANAGER_ASSOCIATED = new _util._WeakSet();

  var ResolverImpl = /*#__PURE__*/function () {
    function ResolverImpl() {
      this.componentDefinitionCache = new Map();
    }

    var _proto28 = ResolverImpl.prototype;

    _proto28.lookupPartial = function lookupPartial(name, owner) {
      if (_deprecatedFeatures.PARTIALS) {
        var templateFactory$$1 = _lookupPartial(name, owner);

        var template = templateFactory$$1(owner);
        return new _opcodeCompiler.PartialDefinitionImpl(name, template);
      } else {
        return null;
      }
    };

    _proto28.lookupHelper = function lookupHelper(name, owner) {
      (false && !(!(BUILTIN_HELPERS[name] && owner.hasRegistration("helper:" + name))) && (0, _debug.assert)("You attempted to overwrite the built-in helper \"" + name + "\" which is not allowed. Please rename the helper.", !(BUILTIN_HELPERS[name] && owner.hasRegistration("helper:" + name))));
      var helper$$1 = BUILTIN_HELPERS[name];

      if (helper$$1 !== undefined) {
        return helper$$1;
      }

      var factory = owner.factoryFor("helper:" + name);

      if (factory === undefined) {
        return null;
      }

      var definition = factory.class;

      if (definition === undefined) {
        return null;
      }

      if (typeof definition === 'function' && isClassicHelper(definition)) {
        // For classic class based helpers, we need to pass the factoryFor result itself rather
        // than the raw value (`factoryFor(...).class`). This is because injections are already
        // bound in the factoryFor result, including type-based injections
        if (false
        /* DEBUG */
        ) {
          // In DEBUG we need to only set the associated value once, otherwise
          // we'll trigger an assertion
          if (!CLASSIC_HELPER_MANAGER_ASSOCIATED.has(factory)) {
            CLASSIC_HELPER_MANAGER_ASSOCIATED.add(factory);
            (0, _manager2.setInternalHelperManager)(CLASSIC_HELPER_MANAGER, factory);
          }
        } else {
          (0, _manager2.setInternalHelperManager)(CLASSIC_HELPER_MANAGER, factory);
        }

        return factory;
      }

      return definition;
    };

    _proto28.lookupBuiltInHelper = function lookupBuiltInHelper(name) {
      var _a;

      return (_a = BUILTIN_KEYWORD_HELPERS[name]) !== null && _a !== void 0 ? _a : null;
    };

    _proto28.lookupModifier = function lookupModifier(name, owner) {
      var builtin = BUILTIN_MODIFIERS[name];

      if (builtin !== undefined) {
        return builtin;
      }

      var modifier = owner.factoryFor("modifier:" + name);

      if (modifier === undefined) {
        return null;
      }

      return modifier.class || null;
    };

    _proto28.lookupBuiltInModifier = function lookupBuiltInModifier(name) {
      var _a;

      return (_a = BUILTIN_KEYWORD_MODIFIERS[name]) !== null && _a !== void 0 ? _a : null;
    };

    _proto28.lookupComponent = function lookupComponent(name, owner) {
      var pair = lookupComponentPair(owner, name);

      if (pair === null) {
        (false && !(name !== 'text-area') && (0, _debug.assert)('Could not find component `<TextArea />` (did you mean `<Textarea />`?)', name !== 'text-area'));
        return null;
      }

      var template = null;
      var key;

      if (pair.component === null) {
        key = template = pair.layout(owner);
      } else {
        key = pair.component;
      }

      var cachedComponentDefinition = this.componentDefinitionCache.get(key);

      if (cachedComponentDefinition !== undefined) {
        return cachedComponentDefinition;
      }

      if (template === null && pair.layout !== null) {
        template = pair.layout(owner);
      }

      var finalizer = (0, _instrumentation._instrumentStart)('render.getComponentDefinition', instrumentationPayload$1, name);
      var definition = null;

      if (pair.component === null) {
        if (_environment2.ENV._TEMPLATE_ONLY_GLIMMER_COMPONENTS) {
          definition = {
            state: (0, _runtime.templateOnlyComponent)(undefined, name),
            manager: _runtime.TEMPLATE_ONLY_COMPONENT_MANAGER,
            template: template
          };
        } else {
          var factory = owner.factoryFor((0, _container.privatize)(_templateObject || (_templateObject = (0, _emberBabel.taggedTemplateLiteralLoose)(["component:-default"]))));
          var manager = (0, _manager2.getInternalComponentManager)(factory.class);
          definition = {
            state: factory,
            manager: manager,
            template: template
          };
        }
      } else {
        (false && !(pair.component.class !== undefined) && (0, _debug.assert)("missing component class " + name, pair.component.class !== undefined));
        var _factory2 = pair.component;
        var ComponentClass = _factory2.class;

        var _manager = (0, _manager2.getInternalComponentManager)(ComponentClass);

        definition = {
          state: isCurlyManager(_manager) ? _factory2 : ComponentClass,
          manager: _manager,
          template: template
        };
      }

      finalizer();
      this.componentDefinitionCache.set(key, definition);
      (false && !(!(definition === null && name === 'text-area')) && (0, _debug.assert)('Could not find component `<TextArea />` (did you mean `<Textarea />`?)', !(definition === null && name === 'text-area')));
      return definition;
    };

    return ResolverImpl;
  }();

  var DynamicScope = /*#__PURE__*/function () {
    function DynamicScope(view, outletState) {
      this.view = view;
      this.outletState = outletState;
    }

    var _proto29 = DynamicScope.prototype;

    _proto29.child = function child() {
      return new DynamicScope(this.view, this.outletState);
    };

    _proto29.get = function get(key) {
      // tslint:disable-next-line:max-line-length
      (false && !(key === 'outletState') && (0, _debug.assert)("Using `-get-dynamic-scope` is only supported for `outletState` (you used `" + key + "`).", key === 'outletState'));
      return this.outletState;
    };

    _proto29.set = function set(key, value) {
      // tslint:disable-next-line:max-line-length
      (false && !(key === 'outletState') && (0, _debug.assert)("Using `-with-dynamic-scope` is only supported for `outletState` (you used `" + key + "`).", key === 'outletState'));
      this.outletState = value;
      return value;
    };

    return DynamicScope;
  }(); // This wrapper logic prevents us from rerendering in case of a hard failure
  // during render. This prevents infinite revalidation type loops from occuring,
  // and ensures that errors are not swallowed by subsequent follow on failures.


  function errorLoopTransaction(fn$$1) {
    if (false
    /* DEBUG */
    ) {
      return function () {
        var didError = true;

        try {
          fn$$1();
          didError = false;
        } finally {
          if (didError) {
            // Noop the function so that we won't keep calling it and causing
            // infinite looping failures;
            fn$$1 = function fn$$1() {
              console.warn('Attempted to rerender, but the Ember application has had an unrecoverable error occur during render. You should reload the application after fixing the cause of the error.');
            };
          }
        }
      };
    } else {
      return fn$$1;
    }
  }

  var RootState = /*#__PURE__*/function () {
    function RootState(root, runtime, context, owner, template, self, parentElement, dynamicScope, builder) {
      var _this14 = this;

      this.root = root;
      this.runtime = runtime;
      (false && !(template !== undefined) && (0, _debug.assert)("You cannot render `" + (0, _reference.valueForRef)(self) + "` without a template.", template !== undefined));
      this.id = (0, _views.getViewId)(root);
      this.result = undefined;
      this.destroyed = false;
      this.render = errorLoopTransaction(function () {
        var layout = (0, _util.unwrapTemplate)(template).asLayout();
        var iterator = (0, _runtime.renderMain)(runtime, context, owner, self, builder(runtime.env, {
          element: parentElement,
          nextSibling: null
        }), layout, dynamicScope);
        var result = _this14.result = iterator.sync(); // override .render function after initial render

        _this14.render = errorLoopTransaction(function () {
          return result.rerender({
            alwaysRevalidate: false
          });
        });
      });
    }

    var _proto30 = RootState.prototype;

    _proto30.isFor = function isFor(possibleRoot) {
      return this.root === possibleRoot;
    };

    _proto30.destroy = function destroy() {
      var result = this.result,
          env = this.runtime.env;
      this.destroyed = true;
      this.runtime = undefined;
      this.root = null;
      this.result = undefined;
      this.render = undefined;

      if (result !== undefined) {
        /*
         Handles these scenarios:
                * When roots are removed during standard rendering process, a transaction exists already
           `.begin()` / `.commit()` are not needed.
         * When roots are being destroyed manually (`component.append(); component.destroy() case), no
           transaction exists already.
         * When roots are being destroyed during `Renderer#destroy`, no transaction exists
                */
        (0, _runtime.inTransaction)(env, function () {
          return (0, _destroyable.destroy)(result);
        });
      }
    };

    return RootState;
  }();

  var renderers = [];

  function _resetRenderers() {
    renderers.length = 0;
  }

  function register(renderer) {
    (false && !(renderers.indexOf(renderer) === -1) && (0, _debug.assert)('Cannot register the same renderer twice', renderers.indexOf(renderer) === -1));
    renderers.push(renderer);
  }

  function deregister(renderer) {
    var index = renderers.indexOf(renderer);
    (false && !(index !== -1) && (0, _debug.assert)('Cannot deregister unknown unregistered renderer', index !== -1));
    renderers.splice(index, 1);
  }

  function loopBegin() {
    for (var i = 0; i < renderers.length; i++) {
      renderers[i]._scheduleRevalidate();
    }
  }

  function K() {
    /* noop */
  }

  var renderSettledDeferred = null;
  /*
    Returns a promise which will resolve when rendering has settled. Settled in
    this context is defined as when all of the tags in use are "current" (e.g.
    `renderers.every(r => r._isValid())`). When this is checked at the _end_ of
    the run loop, this essentially guarantees that all rendering is completed.
  
    @method renderSettled
    @returns {Promise<void>} a promise which fulfills when rendering has settled
  */

  function renderSettled() {
    if (renderSettledDeferred === null) {
      renderSettledDeferred = _rsvp.default.defer(); // if there is no current runloop, the promise created above will not have
      // a chance to resolve (because its resolved in backburner's "end" event)

      if (!(0, _runloop.getCurrentRunLoop)()) {
        // ensure a runloop has been kicked off
        _runloop.backburner.schedule('actions', null, K);
      }
    }

    return renderSettledDeferred.promise;
  }

  function resolveRenderPromise() {
    if (renderSettledDeferred !== null) {
      var resolve = renderSettledDeferred.resolve;
      renderSettledDeferred = null;

      _runloop.backburner.join(null, resolve);
    }
  }

  var loops = 0;

  function loopEnd() {
    for (var i = 0; i < renderers.length; i++) {
      if (!renderers[i]._isValid()) {
        if (loops > _environment2.ENV._RERENDER_LOOP_LIMIT) {
          loops = 0; // TODO: do something better

          renderers[i].destroy();
          throw new Error('infinite rendering invalidation detected');
        }

        loops++;
        return _runloop.backburner.join(null, K);
      }
    }

    loops = 0;
    resolveRenderPromise();
  }

  _runloop.backburner.on('begin', loopBegin);

  _runloop.backburner.on('end', loopEnd);

  var Renderer = /*#__PURE__*/function () {
    function Renderer(owner, document, env, rootTemplate, viewRegistry, builder) {
      if (builder === void 0) {
        builder = _runtime.clientBuilder;
      }

      this._inRenderTransaction = false;
      this._lastRevision = -1;
      this._destroyed = false;
      this._owner = owner;
      this._rootTemplate = rootTemplate(owner);
      this._viewRegistry = viewRegistry;
      this._roots = [];
      this._removedRoots = [];
      this._builder = builder;
      this._isInteractive = env.isInteractive; // resolver is exposed for tests

      var resolver = this._runtimeResolver = new ResolverImpl();
      var sharedArtifacts = (0, _program.artifacts)();
      this._context = (0, _opcodeCompiler.programCompilationContext)(sharedArtifacts, resolver);
      var runtimeEnvironmentDelegate = new EmberEnvironmentDelegate(owner, env.isInteractive);
      this._runtime = (0, _runtime.runtimeContext)({
        appendOperations: env.hasDOM ? new _runtime.DOMTreeConstruction(document) : new _node.NodeDOMTreeConstruction(document),
        updateOperations: new _runtime.DOMChanges(document)
      }, runtimeEnvironmentDelegate, sharedArtifacts, resolver);
    }

    Renderer.create = function create(props) {
      var document = props.document,
          env = props.env,
          rootTemplate = props.rootTemplate,
          _viewRegistry = props._viewRegistry,
          builder = props.builder;
      return new this((0, _owner2.getOwner)(props), document, env, rootTemplate, _viewRegistry, builder);
    };

    var _proto31 = Renderer.prototype;

    // renderer HOOKS
    _proto31.appendOutletView = function appendOutletView(view, target) {
      var definition = createRootOutlet(view);

      this._appendDefinition(view, (0, _runtime.curry)(0
      /* Component */
      , definition, view.owner, null, true), target);
    };

    _proto31.appendTo = function appendTo(view, target) {
      var definition = new RootComponentDefinition(view);

      this._appendDefinition(view, (0, _runtime.curry)(0
      /* Component */
      , definition, this._owner, null, true), target);
    };

    _proto31._appendDefinition = function _appendDefinition(root, definition, target) {
      var self = (0, _reference.createConstRef)(definition, 'this');
      var dynamicScope = new DynamicScope(null, _reference.UNDEFINED_REFERENCE);
      var rootState = new RootState(root, this._runtime, this._context, this._owner, this._rootTemplate, self, target, dynamicScope, this._builder);

      this._renderRoot(rootState);
    };

    _proto31.rerender = function rerender() {
      this._scheduleRevalidate();
    };

    _proto31.register = function register(view) {
      var id = (0, _views.getViewId)(view);
      (false && !(!this._viewRegistry[id]) && (0, _debug.assert)('Attempted to register a view with an id already in use: ' + id, !this._viewRegistry[id]));
      this._viewRegistry[id] = view;
    };

    _proto31.unregister = function unregister(view) {
      delete this._viewRegistry[(0, _views.getViewId)(view)];
    };

    _proto31.remove = function remove(view) {
      view._transitionTo('destroying');

      this.cleanupRootFor(view);

      if (this._isInteractive) {
        view.trigger('didDestroyElement');
      }
    };

    _proto31.cleanupRootFor = function cleanupRootFor(view) {
      // no need to cleanup roots if we have already been destroyed
      if (this._destroyed) {
        return;
      }

      var roots = this._roots; // traverse in reverse so we can remove items
      // without mucking up the index

      var i = this._roots.length;

      while (i--) {
        var root = roots[i];

        if (root.isFor(view)) {
          root.destroy();
          roots.splice(i, 1);
        }
      }
    };

    _proto31.destroy = function destroy() {
      if (this._destroyed) {
        return;
      }

      this._destroyed = true;

      this._clearAllRoots();
    };

    _proto31.getElement = function getElement(view) {
      if (this._isInteractive) {
        return (0, _views.getViewElement)(view);
      } else {
        throw new Error('Accessing `this.element` is not allowed in non-interactive environments (such as FastBoot).');
      }
    };

    _proto31.getBounds = function getBounds(view) {
      var bounds = view[BOUNDS];
      (false && !(Boolean(bounds)) && (0, _debug.assert)('object passed to getBounds must have the BOUNDS symbol as a property', Boolean(bounds)));
      var parentElement = bounds.parentElement();
      var firstNode = bounds.firstNode();
      var lastNode = bounds.lastNode();
      return {
        parentElement: parentElement,
        firstNode: firstNode,
        lastNode: lastNode
      };
    };

    _proto31.createElement = function createElement(tagName) {
      return this._runtime.env.getAppendOperations().createElement(tagName);
    };

    _proto31._renderRoot = function _renderRoot(root) {
      var roots = this._roots;
      roots.push(root);

      if (roots.length === 1) {
        register(this);
      }

      this._renderRootsTransaction();
    };

    _proto31._renderRoots = function _renderRoots() {
      var _this15 = this;

      var roots = this._roots,
          runtime = this._runtime,
          removedRoots = this._removedRoots;
      var initialRootsLength;

      do {
        initialRootsLength = roots.length;
        (0, _runtime.inTransaction)(runtime.env, function () {
          // ensure that for the first iteration of the loop
          // each root is processed
          for (var i = 0; i < roots.length; i++) {
            var root = roots[i];

            if (root.destroyed) {
              // add to the list of roots to be removed
              // they will be removed from `this._roots` later
              removedRoots.push(root); // skip over roots that have been marked as destroyed

              continue;
            } // when processing non-initial reflush loops,
            // do not process more roots than needed


            if (i >= initialRootsLength) {
              continue;
            }

            root.render();
          }

          _this15._lastRevision = (0, _validator.valueForTag)(_validator.CURRENT_TAG);
        });
      } while (roots.length > initialRootsLength); // remove any roots that were destroyed during this transaction


      while (removedRoots.length) {
        var root = removedRoots.pop();
        var rootIndex = roots.indexOf(root);
        roots.splice(rootIndex, 1);
      }

      if (this._roots.length === 0) {
        deregister(this);
      }
    };

    _proto31._renderRootsTransaction = function _renderRootsTransaction() {
      if (this._inRenderTransaction) {
        // currently rendering roots, a new root was added and will
        // be processed by the existing _renderRoots invocation
        return;
      } // used to prevent calling _renderRoots again (see above)
      // while we are actively rendering roots


      this._inRenderTransaction = true;
      var completedWithoutError = false;

      try {
        this._renderRoots();

        completedWithoutError = true;
      } finally {
        if (!completedWithoutError) {
          this._lastRevision = (0, _validator.valueForTag)(_validator.CURRENT_TAG);
        }

        this._inRenderTransaction = false;
      }
    };

    _proto31._clearAllRoots = function _clearAllRoots() {
      var roots = this._roots;

      for (var i = 0; i < roots.length; i++) {
        var root = roots[i];
        root.destroy();
      }

      this._removedRoots.length = 0;
      this._roots = []; // if roots were present before destroying
      // deregister this renderer instance

      if (roots.length) {
        deregister(this);
      }
    };

    _proto31._scheduleRevalidate = function _scheduleRevalidate() {
      _runloop.backburner.scheduleOnce('render', this, this._revalidate);
    };

    _proto31._isValid = function _isValid() {
      return this._destroyed || this._roots.length === 0 || (0, _validator.validateTag)(_validator.CURRENT_TAG, this._lastRevision);
    };

    _proto31._revalidate = function _revalidate() {
      if (this._isValid()) {
        return;
      }

      this._renderRootsTransaction();
    };

    (0, _emberBabel.createClass)(Renderer, [{
      key: "debugRenderTree",
      get: function get() {
        var debugRenderTree = this._runtime.env.debugRenderTree;
        (false && !(debugRenderTree) && (0, _debug.assert)('Attempted to access the DebugRenderTree, but it did not exist. Is the Ember Inspector open?', debugRenderTree));
        return debugRenderTree;
      }
    }]);
    return Renderer;
  }();

  _exports.Renderer = Renderer;
  var TEMPLATES = {};

  function setTemplates(templates) {
    TEMPLATES = templates;
  }

  function getTemplates() {
    return TEMPLATES;
  }

  function getTemplate(name) {
    if (Object.prototype.hasOwnProperty.call(TEMPLATES, name)) {
      return TEMPLATES[name];
    }
  }

  function hasTemplate(name) {
    return Object.prototype.hasOwnProperty.call(TEMPLATES, name);
  }

  function setTemplate(name, template) {
    return TEMPLATES[name] = template;
  }
  /**
  @module ember
  */

  /**
    Calls [String.loc](/ember/release/classes/String/methods/loc?anchor=loc) with the
    provided string. This is a convenient way to localize text within a template.
    For example:
  
    ```javascript
    Ember.STRINGS = {
      '_welcome_': 'Bonjour'
    };
    ```
  
    ```handlebars
    <div class='message'>
      {{loc '_welcome_'}}
    </div>
    ```
  
    ```html
    <div class='message'>
      Bonjour
    </div>
    ```
  
    See [String.loc](/ember/release/classes/String/methods/loc?anchor=loc) for how to
    set up localized string references.
  
    @method loc
    @for Ember.Templates.helpers
    @param {String} str The string to format.
    @see {String#loc}
    @public
    @deprecated
  */


  var loc$1 = helper(function (params) {
    return _string.loc.apply(null, params
    /* let the other side handle errors */
    );
  });
  var OutletTemplate = (0, _opcodeCompiler.templateFactory)({
    "id": "3jT+eJpe",
    "block": "[[[46,[28,[37,1],null,null],null,null,null]],[],false,[\"component\",\"-outlet\"]]",
    "moduleName": "packages/@ember/-internals/glimmer/lib/templates/outlet.hbs",
    "isStrictMode": false
  });
  var TOP_LEVEL_NAME = '-top-level';
  var TOP_LEVEL_OUTLET = 'main';

  var OutletView = /*#__PURE__*/function () {
    function OutletView(_environment, owner, template) {
      this._environment = _environment;
      this.owner = owner;
      this.template = template;
      var outletStateTag = (0, _validator.createTag)();
      var outletState = {
        outlets: {
          main: undefined
        },
        render: {
          owner: owner,
          into: undefined,
          outlet: TOP_LEVEL_OUTLET,
          name: TOP_LEVEL_NAME,
          controller: undefined,
          model: undefined,
          template: template
        }
      };
      var ref = this.ref = (0, _reference.createComputeRef)(function () {
        (0, _validator.consumeTag)(outletStateTag);
        return outletState;
      }, function (state) {
        (0, _validator.dirtyTag)(outletStateTag);
        outletState.outlets.main = state;
      });
      this.state = {
        ref: ref,
        name: TOP_LEVEL_NAME,
        outlet: TOP_LEVEL_OUTLET,
        template: template,
        controller: undefined,
        model: undefined
      };
    }

    OutletView.extend = function extend(injections) {
      return /*#__PURE__*/function (_OutletView) {
        (0, _emberBabel.inheritsLoose)(_class, _OutletView);

        function _class() {
          return _OutletView.apply(this, arguments) || this;
        }

        _class.create = function create(options) {
          if (options) {
            return _OutletView.create.call(this, (0, _polyfills.assign)({}, injections, options));
          } else {
            return _OutletView.create.call(this, injections);
          }
        };

        return _class;
      }(OutletView);
    };

    OutletView.reopenClass = function reopenClass(injections) {
      (0, _polyfills.assign)(this, injections);
    };

    OutletView.create = function create(options) {
      var _environment = options._environment,
          templateFactory$$1 = options.template;
      var owner = (0, _owner2.getOwner)(options);
      var template = templateFactory$$1(owner);
      return new OutletView(_environment, owner, template);
    };

    var _proto32 = OutletView.prototype;

    _proto32.appendTo = function appendTo(selector) {
      var target;

      if (this._environment.hasDOM) {
        target = typeof selector === 'string' ? document.querySelector(selector) : selector;
      } else {
        target = selector;
      }

      var renderer = this.owner.lookup('renderer:-dom');
      (0, _runloop.schedule)('render', renderer, 'appendOutletView', this, target);
    };

    _proto32.rerender = function rerender() {
      /**/
    };

    _proto32.setOutletState = function setOutletState(state) {
      (0, _reference.updateRef)(this.ref, state);
    };

    _proto32.destroy = function destroy() {
      /**/
    };

    return OutletView;
  }();

  _exports.OutletView = OutletView;

  function setupApplicationRegistry(registry) {
    registry.injection('renderer', 'env', '-environment:main'); // because we are using injections we can't use instantiate false
    // we need to use bind() to copy the function so factory for
    // association won't leak

    registry.register('service:-dom-builder', {
      create: function create(_ref24) {
        var bootOptions = _ref24.bootOptions;
        var _renderMode = bootOptions._renderMode;

        switch (_renderMode) {
          case 'serialize':
            return _node.serializeBuilder.bind(null);

          case 'rehydrate':
            return _runtime.rehydrationBuilder.bind(null);

          default:
            return _runtime.clientBuilder.bind(null);
        }
      }
    });
    registry.injection('service:-dom-builder', 'bootOptions', '-environment:main');
    registry.injection('renderer', 'builder', 'service:-dom-builder');
    registry.register((0, _container.privatize)(_templateObject2 || (_templateObject2 = (0, _emberBabel.taggedTemplateLiteralLoose)(["template:-root"]))), RootTemplate);
    registry.injection('renderer', 'rootTemplate', (0, _container.privatize)(_templateObject3 || (_templateObject3 = (0, _emberBabel.taggedTemplateLiteralLoose)(["template:-root"]))));
    registry.register('renderer:-dom', Renderer);
    registry.injection('renderer', 'document', 'service:-document');
  }

  function setupEngineRegistry(registry) {
    registry.optionsForType('template', {
      instantiate: false
    });
    registry.register('view:-outlet', OutletView);
    registry.register('template:-outlet', OutletTemplate);
    registry.injection('view:-outlet', 'template', 'template:-outlet');
    registry.optionsForType('helper', {
      instantiate: false
    });
    registry.register('helper:loc', loc$1);
    registry.register('component:-text-field', TextField);
    registry.register('component:-checkbox', Checkbox);
    registry.register('component:link-to', LinkComponent);
    registry.register('component:input', InputComponent);
    registry.register('component:textarea', TextArea);

    if (!_environment2.ENV._TEMPLATE_ONLY_GLIMMER_COMPONENTS) {
      registry.register((0, _container.privatize)(_templateObject4 || (_templateObject4 = (0, _emberBabel.taggedTemplateLiteralLoose)(["component:-default"]))), Component);
    }
  }

  function setComponentManager$1(stringOrFunction, obj) {
    var factory;

    if (_deprecatedFeatures.COMPONENT_MANAGER_STRING_LOOKUP && typeof stringOrFunction === 'string') {
      (false && !(false) && (0, _debug.deprecate)('Passing the name of the component manager to "setupComponentManager" is deprecated. Please pass a function that produces an instance of the manager.', false, {
        id: 'deprecate-string-based-component-manager',
        until: '4.0.0',
        url: 'https://emberjs.com/deprecations/v3.x/#toc_component-manager-string-lookup',
        for: 'ember-source',
        since: {
          enabled: '3.8.0'
        }
      }));

      factory = function factory(owner) {
        return owner.lookup("component-manager:" + stringOrFunction);
      };
    } else {
      factory = stringOrFunction;
    }

    return (0, _manager2.setComponentManager)(factory, obj);
  }

  var componentCapabilities$1 = _manager2.componentCapabilities;
  _exports.componentCapabilities = componentCapabilities$1;
  var modifierCapabilities$1 = _manager2.modifierCapabilities;
  _exports.modifierCapabilities = modifierCapabilities$1;

  if (false
  /* DEBUG */
  ) {
    _exports.componentCapabilities = componentCapabilities$1 = function componentCapabilities$1(version, options) {
      (false && !(version === '3.13') && (0, _debug.deprecate)('Versions of component manager capabilities prior to 3.13 have been deprecated. You must update to the 3.13 capabilities.', version === '3.13', {
        id: 'manager-capabilities.components-3-4',
        url: 'https://emberjs.com/deprecations/v3.x#toc_manager-capabilities-components-3-4',
        until: '4.0.0',
        for: 'ember-source',
        since: {
          enabled: '3.26.0'
        }
      }));
      return (0, _manager2.componentCapabilities)(version, options);
    };

    _exports.modifierCapabilities = modifierCapabilities$1 = function modifierCapabilities$1(version, options) {
      (false && !(version === '3.22') && (0, _debug.deprecate)('Versions of modifier manager capabilities prior to 3.22 have been deprecated. You must update to the 3.22 capabilities.', version === '3.22', {
        id: 'manager-capabilities.modifiers-3-13',
        url: 'https://emberjs.com/deprecations/v3.x#toc_manager-capabilities-modifiers-3-13',
        until: '4.0.0',
        for: 'ember-source',
        since: {
          enabled: '3.26.0'
        }
      }));
      return (0, _manager2.modifierCapabilities)(version, options);
    };
  }
  /**
    [Glimmer](https://github.com/tildeio/glimmer) is a templating engine used by Ember.js that is compatible with a subset of the [Handlebars](http://handlebarsjs.com/) syntax.
  
    ### Showing a property
  
    Templates manage the flow of an application's UI, and display state (through
    the DOM) to a user. For example, given a component with the property "name",
    that component's template can use the name in several ways:
  
    ```app/components/person-profile.js
    import Component from '@ember/component';
  
    export default Component.extend({
      name: 'Jill'
    });
    ```
  
    ```app/components/person-profile.hbs
    {{this.name}}
    <div>{{this.name}}</div>
    <span data-name={{this.name}}></span>
    ```
  
    Any time the "name" property on the component changes, the DOM will be
    updated.
  
    Properties can be chained as well:
  
    ```handlebars
    {{@aUserModel.name}}
    <div>{{@listOfUsers.firstObject.name}}</div>
    ```
  
    ### Using Ember helpers
  
    When content is passed in mustaches `{{}}`, Ember will first try to find a helper
    or component with that name. For example, the `if` helper:
  
    ```app/components/person-profile.hbs
    {{if this.name "I have a name" "I have no name"}}
    <span data-has-name={{if this.name true}}></span>
    ```
  
    The returned value is placed where the `{{}}` is called. The above style is
    called "inline". A second style of helper usage is called "block". For example:
  
    ```handlebars
    {{#if this.name}}
      I have a name
    {{else}}
      I have no name
    {{/if}}
    ```
  
    The block form of helpers allows you to control how the UI is created based
    on the values of properties.
    A third form of helper is called "nested". For example here the concat
    helper will add " Doe" to a displayed name if the person has no last name:
  
    ```handlebars
    <span data-name={{concat this.firstName (
      if this.lastName (concat " " this.lastName) "Doe"
    )}}></span>
    ```
  
    Ember's built-in helpers are described under the [Ember.Templates.helpers](/ember/release/classes/Ember.Templates.helpers)
    namespace. Documentation on creating custom helpers can be found under
    [helper](/ember/release/functions/@ember%2Fcomponent%2Fhelper/helper) (or
    under [Helper](/ember/release/classes/Helper) if a helper requires access to
    dependency injection).
  
    ### Invoking a Component
  
    Ember components represent state to the UI of an application. Further
    reading on components can be found under [Component](/ember/release/classes/Component).
  
    @module @ember/component
    @main @ember/component
    @public
   */

});