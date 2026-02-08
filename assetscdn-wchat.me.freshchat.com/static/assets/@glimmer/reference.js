define("@glimmer/reference", ["exports", "ember-babel", "@glimmer/global-context", "@glimmer/util", "@glimmer/validator"], function (_exports, _emberBabel, _globalContext, _util, _validator) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.UNDEFINED_REFERENCE = _exports.TRUE_REFERENCE = _exports.REFERENCE = _exports.NULL_REFERENCE = _exports.FALSE_REFERENCE = void 0;
  _exports.childRefFor = childRefFor;
  _exports.childRefFromParts = childRefFromParts;
  _exports.createComputeRef = createComputeRef;
  _exports.createConstRef = createConstRef;
  _exports.createDebugAliasRef = void 0;
  _exports.createInvokableRef = createInvokableRef;
  _exports.createIteratorItemRef = createIteratorItemRef;
  _exports.createIteratorRef = createIteratorRef;
  _exports.createPrimitiveRef = createPrimitiveRef;
  _exports.createReadOnlyRef = createReadOnlyRef;
  _exports.createUnboundRef = createUnboundRef;
  _exports.isConstRef = isConstRef;
  _exports.isInvokableRef = isInvokableRef;
  _exports.isUpdatableRef = isUpdatableRef;
  _exports.updateRef = updateRef;
  _exports.valueForRef = valueForRef;
  var REFERENCE = (0, _util.symbol)('REFERENCE');
  _exports.REFERENCE = REFERENCE;

  var ReferenceImpl = function ReferenceImpl(type) {
    this.tag = null;
    this.lastRevision = _validator.INITIAL;
    this.children = null;
    this.compute = null;
    this.update = null;
    this[REFERENCE] = type;
  };

  function createPrimitiveRef(value) {
    var ref = new ReferenceImpl(2
    /* Unbound */
    );
    ref.tag = _validator.CONSTANT_TAG;
    ref.lastValue = value;

    if (false
    /* DEBUG */
    ) {
      ref.debugLabel = String(value);
    }

    return ref;
  }

  var UNDEFINED_REFERENCE = createPrimitiveRef(undefined);
  _exports.UNDEFINED_REFERENCE = UNDEFINED_REFERENCE;
  var NULL_REFERENCE = createPrimitiveRef(null);
  _exports.NULL_REFERENCE = NULL_REFERENCE;
  var TRUE_REFERENCE = createPrimitiveRef(true);
  _exports.TRUE_REFERENCE = TRUE_REFERENCE;
  var FALSE_REFERENCE = createPrimitiveRef(false);
  _exports.FALSE_REFERENCE = FALSE_REFERENCE;

  function createConstRef(value, debugLabel) {
    var ref = new ReferenceImpl(0
    /* Constant */
    );
    ref.lastValue = value;
    ref.tag = _validator.CONSTANT_TAG;

    if (false
    /* DEBUG */
    ) {
      ref.debugLabel = debugLabel;
    }

    return ref;
  }

  function createUnboundRef(value, debugLabel) {
    var ref = new ReferenceImpl(2
    /* Unbound */
    );
    ref.lastValue = value;
    ref.tag = _validator.CONSTANT_TAG;

    if (false
    /* DEBUG */
    ) {
      ref.debugLabel = debugLabel;
    }

    return ref;
  }

  function createComputeRef(compute, update, debugLabel) {
    if (update === void 0) {
      update = null;
    }

    if (debugLabel === void 0) {
      debugLabel = 'unknown';
    }

    var ref = new ReferenceImpl(1
    /* Compute */
    );
    ref.compute = compute;
    ref.update = update;

    if (false
    /* DEBUG */
    ) {
      ref.debugLabel = "(result of a `" + debugLabel + "` helper)";
    }

    return ref;
  }

  function createReadOnlyRef(ref) {
    if (!isUpdatableRef(ref)) return ref;
    return createComputeRef(function () {
      return valueForRef(ref);
    }, null, ref.debugLabel);
  }

  function isInvokableRef(ref) {
    return ref[REFERENCE] === 3
    /* Invokable */
    ;
  }

  function createInvokableRef(inner) {
    var ref = createComputeRef(function () {
      return valueForRef(inner);
    }, function (value) {
      return updateRef(inner, value);
    });
    ref.debugLabel = inner.debugLabel;
    ref[REFERENCE] = 3
    /* Invokable */
    ;
    return ref;
  }

  function isConstRef(_ref) {
    var ref = _ref;
    return ref.tag === _validator.CONSTANT_TAG;
  }

  function isUpdatableRef(_ref) {
    var ref = _ref;
    return ref.update !== null;
  }

  function valueForRef(_ref) {
    var ref = _ref;
    var tag = ref.tag;

    if (tag === _validator.CONSTANT_TAG) {
      return ref.lastValue;
    }

    var lastRevision = ref.lastRevision;
    var lastValue;

    if (tag === null || !(0, _validator.validateTag)(tag, lastRevision)) {
      var compute = ref.compute;
      tag = ref.tag = (0, _validator.track)(function () {
        lastValue = ref.lastValue = compute();
      }, false
      /* DEBUG */
      && ref.debugLabel);
      ref.lastRevision = (0, _validator.valueForTag)(tag);
    } else {
      lastValue = ref.lastValue;
    }

    (0, _validator.consumeTag)(tag);
    return lastValue;
  }

  function updateRef(_ref, value) {
    var ref = _ref;
    var update = ref.update;
    update(value);
  }

  function childRefFor(_parentRef, path) {
    var parentRef = _parentRef;
    var type = parentRef[REFERENCE];
    var children = parentRef.children;
    var child;

    if (children === null) {
      children = parentRef.children = new Map();
    } else {
      child = children.get(path);

      if (child !== undefined) {
        return child;
      }
    }

    if (type === 2
    /* Unbound */
    ) {
      var parent = valueForRef(parentRef);

      if ((0, _util.isDict)(parent)) {
        child = createUnboundRef(parent[path], false
        /* DEBUG */
        && parentRef.debugLabel + "." + path);
      } else {
        child = UNDEFINED_REFERENCE;
      }
    } else {
      child = createComputeRef(function () {
        var parent = valueForRef(parentRef);

        if ((0, _util.isDict)(parent)) {
          return (0, _globalContext.getProp)(parent, path);
        }
      }, function (val) {
        var parent = valueForRef(parentRef);

        if ((0, _util.isDict)(parent)) {
          return (0, _globalContext.setProp)(parent, path, val);
        }
      });

      if (false
      /* DEBUG */
      ) {
        child.debugLabel = parentRef.debugLabel + "." + path;
      }
    }

    children.set(path, child);
    return child;
  }

  function childRefFromParts(root, parts) {
    var reference = root;

    for (var i = 0; i < parts.length; i++) {
      reference = childRefFor(reference, parts[i]);
    }

    return reference;
  }

  var createDebugAliasRef;
  _exports.createDebugAliasRef = createDebugAliasRef;

  if (false
  /* DEBUG */
  ) {
    _exports.createDebugAliasRef = createDebugAliasRef = function createDebugAliasRef(debugLabel, inner) {
      var update = isUpdatableRef(inner) ? function (value) {
        return updateRef(inner, value);
      } : null;
      var ref = createComputeRef(function () {
        return valueForRef(inner);
      }, update);
      ref[REFERENCE] = inner[REFERENCE];
      ref.debugLabel = debugLabel;
      return ref;
    };
  }

  var NULL_IDENTITY = {};

  var KEY = function KEY(_, index) {
    return index;
  };

  var INDEX = function INDEX(_, index) {
    return String(index);
  };

  var IDENTITY = function IDENTITY(item) {
    if (item === null) {
      // Returning null as an identity will cause failures since the iterator
      // can't tell that it's actually supposed to be null
      return NULL_IDENTITY;
    }

    return item;
  };

  function keyForPath(path) {
    if (false
    /* DEBUG */
    && path[0] === '@') {
      throw new Error("invalid keypath: '" + path + "', valid keys: @index, @identity, or a path");
    }

    return uniqueKeyFor(function (item) {
      return (0, _globalContext.getPath)(item, path);
    });
  }

  function makeKeyFor(key) {
    switch (key) {
      case '@key':
        return uniqueKeyFor(KEY);

      case '@index':
        return uniqueKeyFor(INDEX);

      case '@identity':
        return uniqueKeyFor(IDENTITY);

      default:
        return keyForPath(key);
    }
  }

  var WeakMapWithPrimitives = /*#__PURE__*/function () {
    function WeakMapWithPrimitives() {}

    var _proto = WeakMapWithPrimitives.prototype;

    _proto.set = function set(key, value) {
      if ((0, _util.isObject)(key)) {
        this.weakMap.set(key, value);
      } else {
        this.primitiveMap.set(key, value);
      }
    };

    _proto.get = function get(key) {
      if ((0, _util.isObject)(key)) {
        return this.weakMap.get(key);
      } else {
        return this.primitiveMap.get(key);
      }
    };

    (0, _emberBabel.createClass)(WeakMapWithPrimitives, [{
      key: "weakMap",
      get: function get() {
        if (this._weakMap === undefined) {
          this._weakMap = new WeakMap();
        }

        return this._weakMap;
      }
    }, {
      key: "primitiveMap",
      get: function get() {
        if (this._primitiveMap === undefined) {
          this._primitiveMap = new Map();
        }

        return this._primitiveMap;
      }
    }]);
    return WeakMapWithPrimitives;
  }();

  var IDENTITIES = new WeakMapWithPrimitives();

  function identityForNthOccurence(value, count) {
    var identities = IDENTITIES.get(value);

    if (identities === undefined) {
      identities = [];
      IDENTITIES.set(value, identities);
    }

    var identity = identities[count];

    if (identity === undefined) {
      identity = {
        value: value,
        count: count
      };
      identities[count] = identity;
    }

    return identity;
  }
  /**
   * When iterating over a list, it's possible that an item with the same unique
   * key could be encountered twice:
   *
   * ```js
   * let arr = ['same', 'different', 'same', 'same'];
   * ```
   *
   * In general, we want to treat these items as _unique within the list_. To do
   * this, we track the occurences of every item as we iterate the list, and when
   * an item occurs more than once, we generate a new unique key just for that
   * item, and that occurence within the list. The next time we iterate the list,
   * and encounter an item for the nth time, we can get the _same_ key, and let
   * Glimmer know that it should reuse the DOM for the previous nth occurence.
   */


  function uniqueKeyFor(keyFor) {
    var seen = new WeakMapWithPrimitives();
    return function (value, memo) {
      var key = keyFor(value, memo);
      var count = seen.get(key) || 0;
      seen.set(key, count + 1);

      if (count === 0) {
        return key;
      }

      return identityForNthOccurence(key, count);
    };
  }

  function createIteratorRef(listRef, key) {
    return createComputeRef(function () {
      var iterable = valueForRef(listRef);
      var keyFor = makeKeyFor(key);

      if (Array.isArray(iterable)) {
        return new ArrayIterator(iterable, keyFor);
      }

      var maybeIterator = (0, _globalContext.toIterator)(iterable);

      if (maybeIterator === null) {
        return new ArrayIterator(_util.EMPTY_ARRAY, function () {
          return null;
        });
      }

      return new IteratorWrapper(maybeIterator, keyFor);
    });
  }

  function createIteratorItemRef(_value) {
    var value = _value;
    var tag = (0, _validator.createTag)();
    return createComputeRef(function () {
      (0, _validator.consumeTag)(tag);
      return value;
    }, function (newValue) {
      if (value !== newValue) {
        value = newValue;
        (0, _validator.dirtyTag)(tag);
      }
    });
  }

  var IteratorWrapper = /*#__PURE__*/function () {
    function IteratorWrapper(inner, keyFor) {
      this.inner = inner;
      this.keyFor = keyFor;
    }

    var _proto2 = IteratorWrapper.prototype;

    _proto2.isEmpty = function isEmpty() {
      return this.inner.isEmpty();
    };

    _proto2.next = function next() {
      var nextValue = this.inner.next();

      if (nextValue !== null) {
        nextValue.key = this.keyFor(nextValue.value, nextValue.memo);
      }

      return nextValue;
    };

    return IteratorWrapper;
  }();

  var ArrayIterator = /*#__PURE__*/function () {
    function ArrayIterator(iterator, keyFor) {
      this.iterator = iterator;
      this.keyFor = keyFor;
      this.pos = 0;

      if (iterator.length === 0) {
        this.current = {
          kind: 'empty'
        };
      } else {
        this.current = {
          kind: 'first',
          value: iterator[this.pos]
        };
      }
    }

    var _proto3 = ArrayIterator.prototype;

    _proto3.isEmpty = function isEmpty() {
      return this.current.kind === 'empty';
    };

    _proto3.next = function next() {
      var value;
      var current = this.current;

      if (current.kind === 'first') {
        this.current = {
          kind: 'progress'
        };
        value = current.value;
      } else if (this.pos >= this.iterator.length - 1) {
        return null;
      } else {
        value = this.iterator[++this.pos];
      }

      var keyFor = this.keyFor;
      var key = keyFor(value, this.pos);
      var memo = this.pos;
      return {
        key: key,
        value: value,
        memo: memo
      };
    };

    return ArrayIterator;
  }();
});