define("@ember/-internals/meta/lib/meta", ["exports", "ember-babel", "@ember/-internals/utils", "@ember/debug", "@glimmer/destroyable"], function (_exports, _emberBabel, _utils, _debug, _destroyable) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.meta = _exports.counters = _exports.UNDEFINED = _exports.Meta = void 0;
  _exports.peekMeta = peekMeta;
  _exports.setMeta = setMeta;
  var objectPrototype = Object.prototype;
  var counters;
  _exports.counters = counters;

  if (false
  /* DEBUG */
  ) {
    _exports.counters = counters = {
      peekCalls: 0,
      peekPrototypeWalks: 0,
      setCalls: 0,
      deleteCalls: 0,
      metaCalls: 0,
      metaInstantiated: 0,
      matchingListenersCalls: 0,
      observerEventsCalls: 0,
      addToListenersCalls: 0,
      removeFromListenersCalls: 0,
      removeAllListenersCalls: 0,
      listenersInherited: 0,
      listenersFlattened: 0,
      parentListenersUsed: 0,
      flattenedListenersCalls: 0,
      reopensAfterFlatten: 0,
      readableLazyChainsCalls: 0,
      writableLazyChainsCalls: 0
    };
  }
  /**
  @module ember
  */


  var UNDEFINED = (0, _utils.symbol)('undefined');
  _exports.UNDEFINED = UNDEFINED;
  var currentListenerVersion = 1;

  var Meta = /*#__PURE__*/function () {
    // DEBUG
    function Meta(obj) {
      this._listenersVersion = 1;
      this._inheritedEnd = -1;
      this._flattenedVersion = 0;

      if (false
      /* DEBUG */
      ) {
        counters.metaInstantiated++;
      }

      this._parent = undefined;
      this._descriptors = undefined;
      this._mixins = undefined;
      this._lazyChains = undefined;
      this._values = undefined;
      this._revisions = undefined; // initial value for all flags right now is false
      // see FLAGS const for detailed list of flags used

      this._isInit = false; // used only internally

      this.source = obj;
      this.proto = obj.constructor === undefined ? undefined : obj.constructor.prototype;
      this._listeners = undefined;
    }

    var _proto = Meta.prototype;

    // These methods are here to prevent errors in legacy compat with some addons
    // that used them as intimate API
    _proto.setSourceDestroying = function setSourceDestroying() {
      (false && !(false) && (0, _debug.deprecate)('setSourceDestroying is deprecated, use the destroy() API to destroy the object directly instead', false, {
        id: 'meta-destruction-apis',
        until: '3.25.0',
        for: 'ember-source',
        since: {
          enabled: '3.21.0'
        }
      }));
    };

    _proto.setSourceDestroyed = function setSourceDestroyed() {
      (false && !(false) && (0, _debug.deprecate)('setSourceDestroyed is deprecated, use the destroy() API to destroy the object directly instead', false, {
        id: 'meta-destruction-apis',
        until: '3.25.0',
        for: 'ember-source',
        since: {
          enabled: '3.21.0'
        }
      }));
    };

    _proto.isSourceDestroying = function isSourceDestroying() {
      (false && !(false) && (0, _debug.deprecate)('isSourceDestroying is deprecated, use the isDestroying() API to check the object destruction state directly instead', false, {
        id: 'meta-destruction-apis',
        until: '3.25.0',
        for: 'ember-source',
        since: {
          enabled: '3.21.0'
        }
      }));
      return (0, _destroyable.isDestroying)(this.source);
    };

    _proto.isSourceDestroyed = function isSourceDestroyed() {
      (false && !(false) && (0, _debug.deprecate)('isSourceDestroyed is deprecated, use the isDestroyed() API to check the object destruction state directly instead', false, {
        id: 'meta-destruction-apis',
        until: '3.25.0',
        for: 'ember-source',
        since: {
          enabled: '3.21.0'
        }
      }));
      return (0, _destroyable.isDestroyed)(this.source);
    };

    _proto.setInitializing = function setInitializing() {
      this._isInit = true;
    };

    _proto.unsetInitializing = function unsetInitializing() {
      this._isInit = false;
    };

    _proto.isInitializing = function isInitializing() {
      return this._isInit;
    };

    _proto.isPrototypeMeta = function isPrototypeMeta(obj) {
      return this.proto === this.source && this.source === obj;
    };

    _proto._getOrCreateOwnMap = function _getOrCreateOwnMap(key) {
      return this[key] || (this[key] = Object.create(null));
    };

    _proto._getOrCreateOwnSet = function _getOrCreateOwnSet(key) {
      return this[key] || (this[key] = new Set());
    };

    _proto._findInheritedMap = function _findInheritedMap(key, subkey) {
      var pointer = this;

      while (pointer !== null) {
        var map = pointer[key];

        if (map !== undefined) {
          var value = map.get(subkey);

          if (value !== undefined) {
            return value;
          }
        }

        pointer = pointer.parent;
      }
    };

    _proto._hasInInheritedSet = function _hasInInheritedSet(key, value) {
      var pointer = this;

      while (pointer !== null) {
        var set = pointer[key];

        if (set !== undefined && set.has(value)) {
          return true;
        }

        pointer = pointer.parent;
      }

      return false;
    };

    _proto.valueFor = function valueFor(key) {
      var values = this._values;
      return values !== undefined ? values[key] : undefined;
    };

    _proto.setValueFor = function setValueFor(key, value) {
      var values = this._getOrCreateOwnMap('_values');

      values[key] = value;
    };

    _proto.revisionFor = function revisionFor(key) {
      var revisions = this._revisions;
      return revisions !== undefined ? revisions[key] : undefined;
    };

    _proto.setRevisionFor = function setRevisionFor(key, revision) {
      var revisions = this._getOrCreateOwnMap('_revisions');

      revisions[key] = revision;
    };

    _proto.writableLazyChainsFor = function writableLazyChainsFor(key) {
      if (false
      /* DEBUG */
      ) {
        counters.writableLazyChainsCalls++;
      }

      var lazyChains = this._getOrCreateOwnMap('_lazyChains');

      var chains = lazyChains[key];

      if (chains === undefined) {
        chains = lazyChains[key] = [];
      }

      return chains;
    };

    _proto.readableLazyChainsFor = function readableLazyChainsFor(key) {
      if (false
      /* DEBUG */
      ) {
        counters.readableLazyChainsCalls++;
      }

      var lazyChains = this._lazyChains;

      if (lazyChains !== undefined) {
        return lazyChains[key];
      }

      return undefined;
    };

    _proto.addMixin = function addMixin(mixin) {
      (false && !(!(0, _destroyable.isDestroyed)(this.source)) && (0, _debug.assert)((0, _destroyable.isDestroyed)(this.source) ? "Cannot add mixins of `" + (0, _utils.toString)(mixin) + "` on `" + (0, _utils.toString)(this.source) + "` call addMixin after it has been destroyed." : '', !(0, _destroyable.isDestroyed)(this.source)));

      var set = this._getOrCreateOwnSet('_mixins');

      set.add(mixin);
    };

    _proto.hasMixin = function hasMixin(mixin) {
      return this._hasInInheritedSet('_mixins', mixin);
    };

    _proto.forEachMixins = function forEachMixins(fn) {
      var pointer = this;
      var seen;

      while (pointer !== null) {
        var set = pointer._mixins;

        if (set !== undefined) {
          seen = seen === undefined ? new Set() : seen; // TODO cleanup typing here

          set.forEach(function (mixin) {
            if (!seen.has(mixin)) {
              seen.add(mixin);
              fn(mixin);
            }
          });
        }

        pointer = pointer.parent;
      }
    };

    _proto.writeDescriptors = function writeDescriptors(subkey, value) {
      (false && !(!(0, _destroyable.isDestroyed)(this.source)) && (0, _debug.assert)((0, _destroyable.isDestroyed)(this.source) ? "Cannot update descriptors for `" + subkey + "` on `" + (0, _utils.toString)(this.source) + "` after it has been destroyed." : '', !(0, _destroyable.isDestroyed)(this.source)));
      var map = this._descriptors || (this._descriptors = new Map());
      map.set(subkey, value);
    };

    _proto.peekDescriptors = function peekDescriptors(subkey) {
      var possibleDesc = this._findInheritedMap('_descriptors', subkey);

      return possibleDesc === UNDEFINED ? undefined : possibleDesc;
    };

    _proto.removeDescriptors = function removeDescriptors(subkey) {
      this.writeDescriptors(subkey, UNDEFINED);
    };

    _proto.forEachDescriptors = function forEachDescriptors(fn) {
      var pointer = this;
      var seen;

      while (pointer !== null) {
        var map = pointer._descriptors;

        if (map !== undefined) {
          seen = seen === undefined ? new Set() : seen;
          map.forEach(function (value, key) {
            if (!seen.has(key)) {
              seen.add(key);

              if (value !== UNDEFINED) {
                fn(key, value);
              }
            }
          });
        }

        pointer = pointer.parent;
      }
    };

    _proto.addToListeners = function addToListeners(eventName, target, method, once, sync) {
      if (false
      /* DEBUG */
      ) {
        counters.addToListenersCalls++;
      }

      this.pushListener(eventName, target, method, once ? 1
      /* ONCE */
      : 0
      /* ADD */
      , sync);
    };

    _proto.removeFromListeners = function removeFromListeners(eventName, target, method) {
      if (false
      /* DEBUG */
      ) {
        counters.removeFromListenersCalls++;
      }

      this.pushListener(eventName, target, method, 2
      /* REMOVE */
      );
    };

    _proto.pushListener = function pushListener(event, target, method, kind, sync) {
      if (sync === void 0) {
        sync = false;
      }

      var listeners = this.writableListeners();
      var i = indexOfListener(listeners, event, target, method); // remove if found listener was inherited

      if (i !== -1 && i < this._inheritedEnd) {
        listeners.splice(i, 1);
        this._inheritedEnd--;
        i = -1;
      } // if not found, push. Note that we must always push if a listener is not
      // found, even in the case of a function listener remove, because we may be
      // attempting to add or remove listeners _before_ flattening has occurred.


      if (i === -1) {
        (false && !(!(this.isPrototypeMeta(this.source) && typeof method === 'function')) && (0, _debug.assert)('You cannot add function listeners to prototypes. Convert the listener to a string listener, or add it to the instance instead.', !(this.isPrototypeMeta(this.source) && typeof method === 'function')));
        (false && !(!(!this.isPrototypeMeta(this.source) && typeof method === 'function' && kind === 2
        /* REMOVE */
        )) && (0, _debug.assert)('You attempted to remove a function listener which did not exist on the instance, which means you may have attempted to remove it before it was added.', !(!this.isPrototypeMeta(this.source) && typeof method === 'function' && kind === 2)));
        listeners.push({
          event: event,
          target: target,
          method: method,
          kind: kind,
          sync: sync
        });
      } else {
        var listener = listeners[i]; // If the listener is our own listener and we are trying to remove it, we
        // want to splice it out entirely so we don't hold onto a reference.

        if (kind === 2
        /* REMOVE */
        && listener.kind !== 2
        /* REMOVE */
        ) {
          listeners.splice(i, 1);
        } else {
          (false && !(!(listener.kind === 0
          /* ADD */
          && kind === 0
          /* ADD */
          && listener.sync !== sync)) && (0, _debug.assert)("You attempted to add an observer for the same method on '" + event.split(':')[0] + "' twice to " + target + " as both sync and async. Observers must be either sync or async, they cannot be both. This is likely a mistake, you should either remove the code that added the observer a second time, or update it to always be sync or async. The method was " + method + ".", !(listener.kind === 0 && kind === 0 && listener.sync !== sync))); // update own listener

          listener.kind = kind;
          listener.sync = sync;
        }
      }
    };

    _proto.writableListeners = function writableListeners() {
      // Check if we need to invalidate and reflatten. We need to do this if we
      // have already flattened (flattened version is the current version) and
      // we are either writing to a prototype meta OR we have never inherited, and
      // may have cached the parent's listeners.
      if (this._flattenedVersion === currentListenerVersion && (this.source === this.proto || this._inheritedEnd === -1)) {
        if (false
        /* DEBUG */
        ) {
          counters.reopensAfterFlatten++;
        }

        currentListenerVersion++;
      } // Inherited end has not been set, then we have never created our own
      // listeners, but may have cached the parent's


      if (this._inheritedEnd === -1) {
        this._inheritedEnd = 0;
        this._listeners = [];
      }

      return this._listeners;
    }
    /**
      Flattening is based on a global revision counter. If the revision has
      bumped it means that somewhere in a class inheritance chain something has
      changed, so we need to reflatten everything. This can only happen if:
         1. A meta has been flattened (listener has been called)
      2. The meta is a prototype meta with children who have inherited its
         listeners
      3. A new listener is subsequently added to the meta (e.g. via `.reopen()`)
         This is a very rare occurrence, so while the counter is global it shouldn't
      be updated very often in practice.
    */
    ;

    _proto.flattenedListeners = function flattenedListeners() {
      if (false
      /* DEBUG */
      ) {
        counters.flattenedListenersCalls++;
      }

      if (this._flattenedVersion < currentListenerVersion) {
        if (false
        /* DEBUG */
        ) {
          counters.listenersFlattened++;
        }

        var parent = this.parent;

        if (parent !== null) {
          // compute
          var parentListeners = parent.flattenedListeners();

          if (parentListeners !== undefined) {
            if (this._listeners === undefined) {
              // If this instance doesn't have any of its own listeners (writableListeners
              // has never been called) then we don't need to do any flattening, return
              // the parent's listeners instead.
              if (false
              /* DEBUG */
              ) {
                counters.parentListenersUsed++;
              }

              this._listeners = parentListeners;
            } else {
              var listeners = this._listeners;

              if (this._inheritedEnd > 0) {
                listeners.splice(0, this._inheritedEnd);
                this._inheritedEnd = 0;
              }

              for (var i = 0; i < parentListeners.length; i++) {
                var listener = parentListeners[i];
                var index = indexOfListener(listeners, listener.event, listener.target, listener.method);

                if (index === -1) {
                  if (false
                  /* DEBUG */
                  ) {
                    counters.listenersInherited++;
                  }

                  listeners.unshift(listener);
                  this._inheritedEnd++;
                }
              }
            }
          }
        }

        this._flattenedVersion = currentListenerVersion;
      }

      return this._listeners;
    };

    _proto.matchingListeners = function matchingListeners(eventName) {
      var listeners = this.flattenedListeners();
      var result;

      if (false
      /* DEBUG */
      ) {
        counters.matchingListenersCalls++;
      }

      if (listeners !== undefined) {
        for (var index = 0; index < listeners.length; index++) {
          var listener = listeners[index]; // REMOVE listeners are placeholders that tell us not to
          // inherit, so they never match. Only ADD and ONCE can match.

          if (listener.event === eventName && (listener.kind === 0
          /* ADD */
          || listener.kind === 1
          /* ONCE */
          )) {
            if (result === undefined) {
              // we create this array only after we've found a listener that
              // matches to avoid allocations when no matches are found.
              result = [];
            }

            result.push(listener.target, listener.method, listener.kind === 1
            /* ONCE */
            );
          }
        }
      }

      return result;
    };

    _proto.observerEvents = function observerEvents() {
      var listeners = this.flattenedListeners();
      var result;

      if (false
      /* DEBUG */
      ) {
        counters.observerEventsCalls++;
      }

      if (listeners !== undefined) {
        for (var index = 0; index < listeners.length; index++) {
          var listener = listeners[index]; // REMOVE listeners are placeholders that tell us not to
          // inherit, so they never match. Only ADD and ONCE can match.

          if ((listener.kind === 0
          /* ADD */
          || listener.kind === 1
          /* ONCE */
          ) && listener.event.indexOf(':change') !== -1) {
            if (result === undefined) {
              // we create this array only after we've found a listener that
              // matches to avoid allocations when no matches are found.
              result = [];
            }

            result.push(listener);
          }
        }
      }

      return result;
    };

    (0, _emberBabel.createClass)(Meta, [{
      key: "parent",
      get: function get() {
        var parent = this._parent;

        if (parent === undefined) {
          var proto = getPrototypeOf(this.source);
          this._parent = parent = proto === null || proto === objectPrototype ? null : meta(proto);
        }

        return parent;
      }
    }]);
    return Meta;
  }();

  _exports.Meta = Meta;
  var getPrototypeOf = Object.getPrototypeOf;
  var metaStore = new WeakMap();

  function setMeta(obj, meta) {
    (false && !(obj !== null) && (0, _debug.assert)('Cannot call `setMeta` on null', obj !== null));
    (false && !(obj !== undefined) && (0, _debug.assert)('Cannot call `setMeta` on undefined', obj !== undefined));
    (false && !(typeof obj === 'object' || typeof obj === 'function') && (0, _debug.assert)("Cannot call `setMeta` on " + typeof obj, typeof obj === 'object' || typeof obj === 'function'));

    if (false
    /* DEBUG */
    ) {
      counters.setCalls++;
    }

    metaStore.set(obj, meta);
  }

  function peekMeta(obj) {
    (false && !(obj !== null) && (0, _debug.assert)('Cannot call `peekMeta` on null', obj !== null));
    (false && !(obj !== undefined) && (0, _debug.assert)('Cannot call `peekMeta` on undefined', obj !== undefined));
    (false && !(typeof obj === 'object' || typeof obj === 'function') && (0, _debug.assert)("Cannot call `peekMeta` on " + typeof obj, typeof obj === 'object' || typeof obj === 'function'));

    if (false
    /* DEBUG */
    ) {
      counters.peekCalls++;
    }

    var meta = metaStore.get(obj);

    if (meta !== undefined) {
      return meta;
    }

    var pointer = getPrototypeOf(obj);

    while (pointer !== null) {
      if (false
      /* DEBUG */
      ) {
        counters.peekPrototypeWalks++;
      }

      meta = metaStore.get(pointer);

      if (meta !== undefined) {
        if (meta.proto !== pointer) {
          // The meta was a prototype meta which was not marked as initializing.
          // This can happen when a prototype chain was created manually via
          // Object.create() and the source object does not have a constructor.
          meta.proto = pointer;
        }

        return meta;
      }

      pointer = getPrototypeOf(pointer);
    }

    return null;
  }
  /**
    Retrieves the meta hash for an object. If `writable` is true ensures the
    hash is writable for this object as well.
  
    The meta object contains information about computed property descriptors as
    well as any watched properties and other information. You generally will
    not access this information directly but instead work with higher level
    methods that manipulate this hash indirectly.
  
    @method meta
    @for Ember
    @private
  
    @param {Object} obj The object to retrieve meta for
    @param {Boolean} [writable=true] Pass `false` if you do not intend to modify
      the meta hash, allowing the method to avoid making an unnecessary copy.
    @return {Object} the meta hash for an object
  */


  var meta = function meta(obj) {
    (false && !(obj !== null) && (0, _debug.assert)('Cannot call `meta` on null', obj !== null));
    (false && !(obj !== undefined) && (0, _debug.assert)('Cannot call `meta` on undefined', obj !== undefined));
    (false && !(typeof obj === 'object' || typeof obj === 'function') && (0, _debug.assert)("Cannot call `meta` on " + typeof obj, typeof obj === 'object' || typeof obj === 'function'));

    if (false
    /* DEBUG */
    ) {
      counters.metaCalls++;
    }

    var maybeMeta = peekMeta(obj); // remove this code, in-favor of explicit parent

    if (maybeMeta !== null && maybeMeta.source === obj) {
      return maybeMeta;
    }

    var newMeta = new Meta(obj);
    setMeta(obj, newMeta);
    return newMeta;
  };

  _exports.meta = meta;

  if (false
  /* DEBUG */
  ) {
    meta._counters = counters;
  }

  function indexOfListener(listeners, event, target, method) {
    for (var i = listeners.length - 1; i >= 0; i--) {
      var listener = listeners[i];

      if (listener.event === event && listener.target === target && listener.method === method) {
        return i;
      }
    }

    return -1;
  }
});