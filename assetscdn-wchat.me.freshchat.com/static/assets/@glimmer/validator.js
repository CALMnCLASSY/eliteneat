define("@glimmer/validator", ["exports", "@ember/polyfills", "@glimmer/global-context"], function (_exports, _polyfills, _globalContext) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.VolatileTag = _exports.VOLATILE_TAG = _exports.VOLATILE = _exports.INITIAL = _exports.CurrentTag = _exports.CURRENT_TAG = _exports.CONSTANT_TAG = _exports.CONSTANT = _exports.COMPUTE = _exports.ALLOW_CYCLES = void 0;
  _exports.beginTrackFrame = beginTrackFrame;
  _exports.beginTrackingTransaction = void 0;
  _exports.beginUntrackFrame = beginUntrackFrame;
  _exports.bump = bump;
  _exports.combine = void 0;
  _exports.consumeTag = consumeTag;
  _exports.createCache = createCache;
  _exports.createTag = createTag;
  _exports.createUpdatableTag = createUpdatableTag;
  _exports.dirtyTag = _exports.deprecateMutationsInTrackingTransaction = void 0;
  _exports.dirtyTagFor = dirtyTagFor;
  _exports.endTrackFrame = endTrackFrame;
  _exports.endTrackingTransaction = void 0;
  _exports.endUntrackFrame = endUntrackFrame;
  _exports.getValue = getValue;
  _exports.isConst = isConst;
  _exports.isConstTag = isConstTag;
  _exports.isTracking = isTracking;
  _exports.logTrackingStack = void 0;
  _exports.resetTracking = resetTracking;
  _exports.setTrackingTransactionEnv = _exports.runInTrackingTransaction = void 0;
  _exports.tagFor = tagFor;
  _exports.tagMetaFor = tagMetaFor;
  _exports.track = track;
  _exports.trackedData = trackedData;
  _exports.untrack = untrack;
  _exports.updateTag = void 0;
  _exports.validateTag = validateTag;
  _exports.valueForTag = valueForTag;

  // eslint-disable-next-line @typescript-eslint/ban-types
  function indexable(input) {
    return input;
  } // This is a duplicate utility from @glimmer/util because `@glimmer/validator`
  // should not depend on any other @glimmer packages, in order to avoid pulling
  // in types and prevent regressions in `@glimmer/tracking` (which has public types).


  var symbol = typeof Symbol !== 'undefined' ? Symbol : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function (key) {
    return "__" + key + Math.floor(Math.random() * Date.now()) + "__";
  }; // eslint-disable-next-line @typescript-eslint/no-explicit-any

  var symbolFor = typeof Symbol !== 'undefined' ? Symbol.for : function (key) {
    return "__GLIMMER_VALIDATOR_SYMBOL_FOR_" + key;
  };

  function getGlobal() {
    // eslint-disable-next-line node/no-unsupported-features/es-builtins
    if (typeof globalThis !== 'undefined') return indexable(globalThis);
    if (typeof self !== 'undefined') return indexable(self);
    if (typeof window !== 'undefined') return indexable(window);
    if (typeof global !== 'undefined') return indexable(global);
    throw new Error('unable to locate global object');
  }

  function unwrap(val) {
    if (val === null || val === undefined) throw new Error("Expected value to be present");
    return val;
  }

  var beginTrackingTransaction;
  _exports.beginTrackingTransaction = beginTrackingTransaction;
  var endTrackingTransaction;
  _exports.endTrackingTransaction = endTrackingTransaction;
  var runInTrackingTransaction;
  _exports.runInTrackingTransaction = runInTrackingTransaction;
  var deprecateMutationsInTrackingTransaction;
  _exports.deprecateMutationsInTrackingTransaction = deprecateMutationsInTrackingTransaction;
  var resetTrackingTransaction;
  var setTrackingTransactionEnv;
  _exports.setTrackingTransactionEnv = setTrackingTransactionEnv;
  var assertTagNotConsumed;

  var _markTagAsConsumed;

  var logTrackingStack;
  _exports.logTrackingStack = logTrackingStack;

  if (false
  /* DEBUG */
  ) {
    var CONSUMED_TAGS = null;
    var TRANSACTION_STACK = []; /////////

    var TRANSACTION_ENV = {
      debugMessage: function debugMessage(obj, keyName) {
        var objName;

        if (typeof obj === 'function') {
          objName = obj.name;
        } else if (typeof obj === 'object' && obj !== null) {
          var className = obj.constructor && obj.constructor.name || '(unknown class)';
          objName = "(an instance of " + className + ")";
        } else if (obj === undefined) {
          objName = '(an unknown tag)';
        } else {
          objName = String(obj);
        }

        var dirtyString = keyName ? "`" + keyName + "` on `" + objName + "`" : "`" + objName + "`";
        return "You attempted to update " + dirtyString + ", but it had already been used previously in the same computation.  Attempting to update a value after using it in a computation can cause logical errors, infinite revalidation bugs, and performance issues, and is not supported.";
      }
    };

    _exports.setTrackingTransactionEnv = setTrackingTransactionEnv = function setTrackingTransactionEnv(env) {
      return (0, _polyfills.assign)(TRANSACTION_ENV, env);
    };

    _exports.beginTrackingTransaction = beginTrackingTransaction = function beginTrackingTransaction(_debugLabel, deprecate$$1) {
      if (deprecate$$1 === void 0) {
        deprecate$$1 = false;
      }

      CONSUMED_TAGS = CONSUMED_TAGS || new WeakMap();
      var debugLabel = _debugLabel || undefined;
      var parent = TRANSACTION_STACK[TRANSACTION_STACK.length - 1] || null;
      TRANSACTION_STACK.push({
        parent: parent,
        debugLabel: debugLabel,
        deprecate: deprecate$$1
      });
    };

    _exports.endTrackingTransaction = endTrackingTransaction = function endTrackingTransaction() {
      if (TRANSACTION_STACK.length === 0) {
        throw new Error('attempted to close a tracking transaction, but one was not open');
      }

      TRANSACTION_STACK.pop();

      if (TRANSACTION_STACK.length === 0) {
        CONSUMED_TAGS = null;
      }
    };

    resetTrackingTransaction = function resetTrackingTransaction() {
      var stack = '';

      if (TRANSACTION_STACK.length > 0) {
        stack = logTrackingStack(TRANSACTION_STACK[TRANSACTION_STACK.length - 1]);
      }

      TRANSACTION_STACK = [];
      CONSUMED_TAGS = null;
      return stack;
    };
    /**
     * Creates a global autotracking transaction. This will prevent any backflow
     * in any `track` calls within the transaction, even if they are not
     * externally consumed.
     *
     * `runInAutotrackingTransaction` can be called within itself, and it will add
     * onto the existing transaction if one exists.
     *
     * TODO: Only throw an error if the `track` is consumed.
     */


    _exports.runInTrackingTransaction = runInTrackingTransaction = function runInTrackingTransaction(fn, debugLabel) {
      beginTrackingTransaction(debugLabel);
      var didError = true;

      try {
        var value = fn();
        didError = false;
        return value;
      } finally {
        if (didError !== true) {
          endTrackingTransaction();
        }
      }
    };
    /**
     * Switches to deprecating within an autotracking transaction, if one exists.
     * If `runInAutotrackingTransaction` is called within the callback of this
     * method, it switches back to throwing an error, allowing zebra-striping of
     * the types of errors that are thrown.
     *
     * Does not start an autotracking transaction.
     *
     * NOTE: For Ember usage only, in general you should assert that these
     * invariants are true.
     */


    _exports.deprecateMutationsInTrackingTransaction = deprecateMutationsInTrackingTransaction = function deprecateMutationsInTrackingTransaction(fn, debugLabel) {
      beginTrackingTransaction(debugLabel, true);

      try {
        fn();
      } finally {
        endTrackingTransaction();
      }
    };

    var nthIndex = function nthIndex(str, pattern, n, startingPos) {
      if (startingPos === void 0) {
        startingPos = -1;
      }

      var i = startingPos;

      while (n-- > 0 && i++ < str.length) {
        i = str.indexOf(pattern, i);
        if (i < 0) break;
      }

      return i;
    };

    var makeTrackingErrorMessage = function makeTrackingErrorMessage(transaction, obj, keyName) {
      var message = [TRANSACTION_ENV.debugMessage(obj, keyName && String(keyName))];
      message.push("`" + String(keyName) + "` was first used:");
      message.push(logTrackingStack(transaction));
      message.push("Stack trace for the update:");
      return message.join('\n\n');
    };

    _exports.logTrackingStack = logTrackingStack = function logTrackingStack(transaction) {
      var trackingStack = [];
      var current = transaction || TRANSACTION_STACK[TRANSACTION_STACK.length - 1];
      if (current === undefined) return '';

      while (current) {
        if (current.debugLabel) {
          trackingStack.unshift(current.debugLabel);
        }

        current = current.parent;
      } // TODO: Use String.prototype.repeat here once we can drop support for IE11


      return trackingStack.map(function (label, index) {
        return Array(2 * index + 1).join(' ') + label;
      }).join('\n');
    };

    _markTagAsConsumed = function markTagAsConsumed(_tag) {
      if (!CONSUMED_TAGS || CONSUMED_TAGS.has(_tag)) return;
      CONSUMED_TAGS.set(_tag, TRANSACTION_STACK[TRANSACTION_STACK.length - 1]); // We need to mark the tag and all of its subtags as consumed, so we need to
      // cast it and access its internals. In the future this shouldn't be necessary,
      // this is only for computed properties.

      var tag = _tag;

      if (tag.subtag) {
        _markTagAsConsumed(tag.subtag);
      }

      if (tag.subtags) {
        tag.subtags.forEach(function (tag) {
          return _markTagAsConsumed(tag);
        });
      }
    };

    assertTagNotConsumed = function assertTagNotConsumed(tag, obj, keyName) {
      if (CONSUMED_TAGS === null) return;
      var transaction = CONSUMED_TAGS.get(tag);
      if (!transaction) return;
      var currentTransaction = TRANSACTION_STACK[TRANSACTION_STACK.length - 1];

      if (currentTransaction.deprecate) {
        (false && !(false) && (0, _globalContext.deprecate)(makeTrackingErrorMessage(transaction, obj, keyName), false, {
          id: 'autotracking.mutation-after-consumption'
        }));
      } else {
        // This hack makes the assertion message nicer, we can cut off the first
        // few lines of the stack trace and let users know where the actual error
        // occurred.
        try {
          (false && (0, _globalContext.assert)(false, makeTrackingErrorMessage(transaction, obj, keyName)));
        } catch (e) {
          if (e.stack) {
            var updateStackBegin = e.stack.indexOf('Stack trace for the update:');

            if (updateStackBegin !== -1) {
              var start = nthIndex(e.stack, '\n', 1, updateStackBegin);
              var end = nthIndex(e.stack, '\n', 4, updateStackBegin);
              e.stack = e.stack.substr(0, start) + e.stack.substr(end);
            }
          }

          throw e;
        }
      }
    };
  }

  var CONSTANT = 0;
  _exports.CONSTANT = CONSTANT;
  var INITIAL = 1;
  _exports.INITIAL = INITIAL;
  var VOLATILE = NaN;
  _exports.VOLATILE = VOLATILE;
  var $REVISION = INITIAL;

  function bump() {
    $REVISION++;
  } //////////


  var COMPUTE = symbol('TAG_COMPUTE'); //////////

  /**
   * `value` receives a tag and returns an opaque Revision based on that tag. This
   * snapshot can then later be passed to `validate` with the same tag to
   * determine if the tag has changed at all since the time that `value` was
   * called.
   *
   * @param tag
   */

  _exports.COMPUTE = COMPUTE;

  function valueForTag(tag) {
    return tag[COMPUTE]();
  }
  /**
   * `validate` receives a tag and a snapshot from a previous call to `value` with
   * the same tag, and determines if the tag is still valid compared to the
   * snapshot. If the tag's state has changed at all since then, `validate` will
   * return false, otherwise it will return true. This is used to determine if a
   * calculation related to the tags should be rerun.
   *
   * @param tag
   * @param snapshot
   */


  function validateTag(tag, snapshot) {
    return snapshot >= tag[COMPUTE]();
  }

  var TYPE = symbol('TAG_TYPE'); // this is basically a const
  // eslint-disable-next-line @typescript-eslint/naming-convention

  var ALLOW_CYCLES;
  _exports.ALLOW_CYCLES = ALLOW_CYCLES;

  if (false
  /* DEBUG */
  ) {
    _exports.ALLOW_CYCLES = ALLOW_CYCLES = new WeakMap();
  }

  function allowsCycles(tag) {
    if (ALLOW_CYCLES === undefined) {
      return true;
    } else {
      return ALLOW_CYCLES.has(tag);
    }
  }

  var MonomorphicTagImpl = /*#__PURE__*/function () {
    function MonomorphicTagImpl(type) {
      this.revision = INITIAL;
      this.lastChecked = INITIAL;
      this.lastValue = INITIAL;
      this.isUpdating = false;
      this.subtag = null;
      this.subtagBufferCache = null;
      this[TYPE] = type;
    }

    MonomorphicTagImpl.combine = function combine(tags) {
      switch (tags.length) {
        case 0:
          return CONSTANT_TAG;

        case 1:
          return tags[0];

        default:
          var tag = new MonomorphicTagImpl(2
          /* Combinator */
          );
          tag.subtag = tags;
          return tag;
      }
    };

    var _proto = MonomorphicTagImpl.prototype;

    _proto[COMPUTE] = function () {
      var lastChecked = this.lastChecked;

      if (this.isUpdating === true) {
        if (false
        /* DEBUG */
        && !allowsCycles(this)) {
          throw new Error('Cycles in tags are not allowed');
        }

        this.lastChecked = ++$REVISION;
      } else if (lastChecked !== $REVISION) {
        this.isUpdating = true;
        this.lastChecked = $REVISION;

        try {
          var subtag = this.subtag,
              revision = this.revision;

          if (subtag !== null) {
            if (Array.isArray(subtag)) {
              for (var i = 0; i < subtag.length; i++) {
                var value = subtag[i][COMPUTE]();
                revision = Math.max(value, revision);
              }
            } else {
              var subtagValue = subtag[COMPUTE]();

              if (subtagValue === this.subtagBufferCache) {
                revision = Math.max(revision, this.lastValue);
              } else {
                // Clear the temporary buffer cache
                this.subtagBufferCache = null;
                revision = Math.max(revision, subtagValue);
              }
            }
          }

          this.lastValue = revision;
        } finally {
          this.isUpdating = false;
        }
      }

      return this.lastValue;
    };

    MonomorphicTagImpl.updateTag = function updateTag(_tag, _subtag) {
      if (false
      /* DEBUG */
      && _tag[TYPE] !== 1
      /* Updatable */
      ) {
        throw new Error('Attempted to update a tag that was not updatable');
      } // TODO: TS 3.7 should allow us to do this via assertion


      var tag = _tag;
      var subtag = _subtag;

      if (subtag === CONSTANT_TAG) {
        tag.subtag = null;
      } else {
        // There are two different possibilities when updating a subtag:
        //
        // 1. subtag[COMPUTE]() <= tag[COMPUTE]();
        // 2. subtag[COMPUTE]() > tag[COMPUTE]();
        //
        // The first possibility is completely fine within our caching model, but
        // the second possibility presents a problem. If the parent tag has
        // already been read, then it's value is cached and will not update to
        // reflect the subtag's greater value. Next time the cache is busted, the
        // subtag's value _will_ be read, and it's value will be _greater_ than
        // the saved snapshot of the parent, causing the resulting calculation to
        // be rerun erroneously.
        //
        // In order to prevent this, when we first update to a new subtag we store
        // its computed value, and then check against that computed value on
        // subsequent updates. If its value hasn't changed, then we return the
        // parent's previous value. Once the subtag changes for the first time,
        // we clear the cache and everything is finally in sync with the parent.
        tag.subtagBufferCache = subtag[COMPUTE]();
        tag.subtag = subtag;
      }
    };

    MonomorphicTagImpl.dirtyTag = function dirtyTag(tag, disableConsumptionAssertion) {
      if (false
      /* DEBUG */
      && !(tag[TYPE] === 1
      /* Updatable */
      || tag[TYPE] === 0
      /* Dirtyable */
      )) {
        throw new Error('Attempted to dirty a tag that was not dirtyable');
      }

      if (false
      /* DEBUG */
      && disableConsumptionAssertion !== true) {
        // Usually by this point, we've already asserted with better error information,
        // but this is our last line of defense.
        unwrap(assertTagNotConsumed)(tag);
      }

      tag.revision = ++$REVISION;
      (0, _globalContext.scheduleRevalidate)();
    };

    return MonomorphicTagImpl;
  }();

  var DIRTY_TAG = MonomorphicTagImpl.dirtyTag;
  _exports.dirtyTag = DIRTY_TAG;
  var UPDATE_TAG = MonomorphicTagImpl.updateTag; //////////

  _exports.updateTag = UPDATE_TAG;

  function createTag() {
    return new MonomorphicTagImpl(0
    /* Dirtyable */
    );
  }

  function createUpdatableTag() {
    return new MonomorphicTagImpl(1
    /* Updatable */
    );
  } //////////


  var CONSTANT_TAG = new MonomorphicTagImpl(3
  /* Constant */
  );
  _exports.CONSTANT_TAG = CONSTANT_TAG;

  function isConstTag(tag) {
    return tag === CONSTANT_TAG;
  } //////////


  var VolatileTag = /*#__PURE__*/function () {
    function VolatileTag() {}

    var _proto2 = VolatileTag.prototype;

    _proto2[COMPUTE] = function () {
      return VOLATILE;
    };

    return VolatileTag;
  }();

  _exports.VolatileTag = VolatileTag;
  var VOLATILE_TAG = new VolatileTag(); //////////

  _exports.VOLATILE_TAG = VOLATILE_TAG;

  var CurrentTag = /*#__PURE__*/function () {
    function CurrentTag() {}

    var _proto3 = CurrentTag.prototype;

    _proto3[COMPUTE] = function () {
      return $REVISION;
    };

    return CurrentTag;
  }();

  _exports.CurrentTag = CurrentTag;
  var CURRENT_TAG = new CurrentTag(); //////////

  _exports.CURRENT_TAG = CURRENT_TAG;
  var _combine = MonomorphicTagImpl.combine; // Warm

  _exports.combine = _combine;
  var tag1 = createUpdatableTag();
  var tag2 = createUpdatableTag();
  var tag3 = createUpdatableTag();
  valueForTag(tag1);
  DIRTY_TAG(tag1);
  valueForTag(tag1);
  UPDATE_TAG(tag1, _combine([tag2, tag3]));
  valueForTag(tag1);
  DIRTY_TAG(tag2);
  valueForTag(tag1);
  DIRTY_TAG(tag3);
  valueForTag(tag1);
  UPDATE_TAG(tag1, tag3);
  valueForTag(tag1);
  DIRTY_TAG(tag3);
  valueForTag(tag1);

  function isObjectLike(u) {
    return typeof u === 'object' && u !== null || typeof u === 'function';
  }

  var TRACKED_TAGS = new WeakMap();

  function dirtyTagFor(obj, key, meta) {
    if (false
    /* DEBUG */
    && !isObjectLike(obj)) {
      throw new Error("BUG: Can't update a tag for a primitive");
    }

    var tags = meta === undefined ? TRACKED_TAGS.get(obj) : meta; // No tags have been setup for this object yet, return

    if (tags === undefined) return; // Dirty the tag for the specific property if it exists

    var propertyTag = tags.get(key);

    if (propertyTag !== undefined) {
      if (false
      /* DEBUG */
      ) {
        unwrap(assertTagNotConsumed)(propertyTag, obj, key);
      }

      DIRTY_TAG(propertyTag, true);
    }
  }

  function tagMetaFor(obj) {
    var tags = TRACKED_TAGS.get(obj);

    if (tags === undefined) {
      tags = new Map();
      TRACKED_TAGS.set(obj, tags);
    }

    return tags;
  }

  function tagFor(obj, key, meta) {
    var tags = meta === undefined ? tagMetaFor(obj) : meta;
    var tag = tags.get(key);

    if (tag === undefined) {
      tag = createUpdatableTag();
      tags.set(key, tag);
    }

    return tag;
  }
  /**
   * An object that that tracks @tracked properties that were consumed.
   */


  var Tracker = /*#__PURE__*/function () {
    function Tracker() {
      this.tags = new Set();
      this.last = null;
    }

    var _proto4 = Tracker.prototype;

    _proto4.add = function add(tag) {
      if (tag === CONSTANT_TAG) return;
      this.tags.add(tag);

      if (false
      /* DEBUG */
      ) {
        unwrap(_markTagAsConsumed)(tag);
      }

      this.last = tag;
    };

    _proto4.combine = function combine() {
      var tags = this.tags;

      if (tags.size === 0) {
        return CONSTANT_TAG;
      } else if (tags.size === 1) {
        return this.last;
      } else {
        var tagsArr = [];
        tags.forEach(function (tag) {
          return tagsArr.push(tag);
        });
        return _combine(tagsArr);
      }
    };

    return Tracker;
  }();
  /**
   * Whenever a tracked computed property is entered, the current tracker is
   * saved off and a new tracker is replaced.
   *
   * Any tracked properties consumed are added to the current tracker.
   *
   * When a tracked computed property is exited, the tracker's tags are
   * combined and added to the parent tracker.
   *
   * The consequence is that each tracked computed property has a tag
   * that corresponds to the tracked properties consumed inside of
   * itself, including child tracked computed properties.
   */


  var CURRENT_TRACKER = null;
  var OPEN_TRACK_FRAMES = [];

  function beginTrackFrame(debuggingContext) {
    OPEN_TRACK_FRAMES.push(CURRENT_TRACKER);
    CURRENT_TRACKER = new Tracker();

    if (false
    /* DEBUG */
    ) {
      unwrap(beginTrackingTransaction)(debuggingContext);
    }
  }

  function endTrackFrame() {
    var current = CURRENT_TRACKER;

    if (false
    /* DEBUG */
    ) {
      if (OPEN_TRACK_FRAMES.length === 0) {
        throw new Error('attempted to close a tracking frame, but one was not open');
      }

      unwrap(endTrackingTransaction)();
    }

    CURRENT_TRACKER = OPEN_TRACK_FRAMES.pop() || null;
    return unwrap(current).combine();
  }

  function beginUntrackFrame() {
    OPEN_TRACK_FRAMES.push(CURRENT_TRACKER);
    CURRENT_TRACKER = null;
  }

  function endUntrackFrame() {
    if (false
    /* DEBUG */
    && OPEN_TRACK_FRAMES.length === 0) {
      throw new Error('attempted to close a tracking frame, but one was not open');
    }

    CURRENT_TRACKER = OPEN_TRACK_FRAMES.pop() || null;
  } // This function is only for handling errors and resetting to a valid state


  function resetTracking() {
    while (OPEN_TRACK_FRAMES.length > 0) {
      OPEN_TRACK_FRAMES.pop();
    }

    CURRENT_TRACKER = null;

    if (false
    /* DEBUG */
    ) {
      return unwrap(resetTrackingTransaction)();
    }
  }

  function isTracking() {
    return CURRENT_TRACKER !== null;
  }

  function consumeTag(tag) {
    if (CURRENT_TRACKER !== null) {
      CURRENT_TRACKER.add(tag);
    }
  } //////////


  var FN = symbol('FN');
  var LAST_VALUE = symbol('LAST_VALUE');
  var TAG = symbol('TAG');
  var SNAPSHOT = symbol('SNAPSHOT');
  var DEBUG_LABEL = symbol('DEBUG_LABEL');

  function createCache(fn, debuggingLabel) {
    var _cache;

    if (false
    /* DEBUG */
    && !(typeof fn === 'function')) {
      throw new Error("createCache() must be passed a function as its first parameter. Called with: " + String(fn));
    }

    var cache = (_cache = {}, _cache[FN] = fn, _cache[LAST_VALUE] = undefined, _cache[TAG] = undefined, _cache[SNAPSHOT] = -1, _cache);

    if (false
    /* DEBUG */
    ) {
      cache[DEBUG_LABEL] = debuggingLabel;
    }

    return cache;
  }

  function getValue(cache) {
    assertCache(cache, 'getValue');
    var fn = cache[FN];
    var tag = cache[TAG];
    var snapshot = cache[SNAPSHOT];

    if (tag === undefined || !validateTag(tag, snapshot)) {
      beginTrackFrame();

      try {
        cache[LAST_VALUE] = fn();
      } finally {
        tag = endTrackFrame();
        cache[TAG] = tag;
        cache[SNAPSHOT] = valueForTag(tag);
        consumeTag(tag);
      }
    } else {
      consumeTag(tag);
    }

    return cache[LAST_VALUE];
  }

  function isConst(cache) {
    assertCache(cache, 'isConst');
    var tag = cache[TAG];
    assertTag(tag, cache);
    return isConstTag(tag);
  }

  function assertCache(value, fnName) {
    if (false
    /* DEBUG */
    && !(typeof value === 'object' && value !== null && FN in value)) {
      throw new Error(fnName + "() can only be used on an instance of a cache created with createCache(). Called with: " + String(value));
    }
  } // replace this with `expect` when we can


  function assertTag(tag, cache) {
    if (false
    /* DEBUG */
    && tag === undefined) {
      throw new Error("isConst() can only be used on a cache once getValue() has been called at least once. Called with cache function:\n\n" + String(cache[FN]));
    }
  } //////////
  // Legacy tracking APIs
  // track() shouldn't be necessary at all in the VM once the autotracking
  // refactors are merged, and we should generally be moving away from it. It may
  // be necessary in Ember for a while longer, but I think we'll be able to drop
  // it in favor of cache sooner rather than later.


  function track(callback, debugLabel) {
    beginTrackFrame(debugLabel);
    var tag;

    try {
      callback();
    } finally {
      tag = endTrackFrame();
    }

    return tag;
  } // untrack() is currently mainly used to handle places that were previously not
  // tracked, and that tracking now would cause backtracking rerender assertions.
  // I think once we move everyone forward onto modern APIs, we'll probably be
  // able to remove it, but I'm not sure yet.


  function untrack(callback) {
    beginUntrackFrame();

    try {
      return callback();
    } finally {
      endUntrackFrame();
    }
  }

  function trackedData(key, initializer) {
    var values = new WeakMap();
    var hasInitializer = typeof initializer === 'function';

    function getter(self) {
      consumeTag(tagFor(self, key));
      var value; // If the field has never been initialized, we should initialize it

      if (hasInitializer && !values.has(self)) {
        value = initializer.call(self);
        values.set(self, value);
      } else {
        value = values.get(self);
      }

      return value;
    }

    function setter(self, value) {
      dirtyTagFor(self, key);
      values.set(self, value);
    }

    return {
      getter: getter,
      setter: setter
    };
  }

  var GLIMMER_VALIDATOR_REGISTRATION = symbolFor('GLIMMER_VALIDATOR_REGISTRATION');
  var globalObj = getGlobal();

  if (globalObj[GLIMMER_VALIDATOR_REGISTRATION] === true) {
    throw new Error('The `@glimmer/validator` library has been included twice in this application. It could be different versions of the package, or the same version included twice by mistake. `@glimmer/validator` depends on having a single copy of the package in use at any time in an application, even if they are the same version. You must dedupe your build to remove the duplicate packages in order to prevent this error.');
  }

  globalObj[GLIMMER_VALIDATOR_REGISTRATION] = true;
});