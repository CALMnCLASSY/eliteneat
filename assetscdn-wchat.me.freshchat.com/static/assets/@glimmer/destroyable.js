define("@glimmer/destroyable", ["exports", "@glimmer/util", "@glimmer/global-context"], function (_exports, _util, _globalContext) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports._hasDestroyableChildren = _hasDestroyableChildren;
  _exports.assertDestroyablesDestroyed = void 0;
  _exports.associateDestroyableChild = associateDestroyableChild;
  _exports.destroy = destroy;
  _exports.destroyChildren = destroyChildren;
  _exports.enableDestroyableTracking = void 0;
  _exports.isDestroyed = isDestroyed;
  _exports.isDestroying = isDestroying;
  _exports.registerDestructor = registerDestructor;
  _exports.unregisterDestructor = unregisterDestructor;
  var DESTROYABLE_META = new WeakMap();

  function push(collection, newItem) {
    if (collection === null) {
      return newItem;
    } else if (Array.isArray(collection)) {
      collection.push(newItem);
      return collection;
    } else {
      return [collection, newItem];
    }
  }

  function iterate(collection, fn) {
    if (Array.isArray(collection)) {
      for (var i = 0; i < collection.length; i++) {
        fn(collection[i]);
      }
    } else if (collection !== null) {
      fn(collection);
    }
  }

  function remove(collection, item, message) {
    if (false
    /* DEBUG */
    ) {
      var collectionIsItem = collection === item;
      var collectionContainsItem = Array.isArray(collection) && collection.indexOf(item) !== -1;

      if (!collectionIsItem && !collectionContainsItem) {
        throw new Error(String(message));
      }
    }

    if (Array.isArray(collection) && collection.length > 1) {
      var index = collection.indexOf(item);
      collection.splice(index, 1);
      return collection;
    } else {
      return null;
    }
  }

  function getDestroyableMeta(destroyable) {
    var meta = DESTROYABLE_META.get(destroyable);

    if (meta === undefined) {
      meta = {
        parents: null,
        children: null,
        eagerDestructors: null,
        destructors: null,
        state: 0
        /* Live */

      };

      if (false
      /* DEBUG */
      ) {
        meta.source = destroyable;
      }

      DESTROYABLE_META.set(destroyable, meta);
    }

    return meta;
  }

  function associateDestroyableChild(parent, child) {
    if (false
    /* DEBUG */
    && isDestroying(parent)) {
      throw new Error('Attempted to associate a destroyable child with an object that is already destroying or destroyed');
    }

    var parentMeta = getDestroyableMeta(parent);
    var childMeta = getDestroyableMeta(child);
    parentMeta.children = push(parentMeta.children, child);
    childMeta.parents = push(childMeta.parents, parent);
    return child;
  }

  function registerDestructor(destroyable, destructor, eager) {
    if (eager === void 0) {
      eager = false;
    }

    if (false
    /* DEBUG */
    && isDestroying(destroyable)) {
      throw new Error('Attempted to register a destructor with an object that is already destroying or destroyed');
    }

    var meta = getDestroyableMeta(destroyable);
    var destructorsKey = eager === true ? 'eagerDestructors' : 'destructors';
    meta[destructorsKey] = push(meta[destructorsKey], destructor);
    return destructor;
  }

  function unregisterDestructor(destroyable, destructor, eager) {
    if (eager === void 0) {
      eager = false;
    }

    if (false
    /* DEBUG */
    && isDestroying(destroyable)) {
      throw new Error('Attempted to unregister a destructor with an object that is already destroying or destroyed');
    }

    var meta = getDestroyableMeta(destroyable);
    var destructorsKey = eager === true ? 'eagerDestructors' : 'destructors';
    meta[destructorsKey] = remove(meta[destructorsKey], destructor, false
    /* DEBUG */
    && 'attempted to remove a destructor that was not registered with the destroyable');
  } ////////////


  function destroy(destroyable) {
    var meta = getDestroyableMeta(destroyable);
    if (meta.state >= 1
    /* Destroying */
    ) return;
    var parents = meta.parents,
        children = meta.children,
        eagerDestructors = meta.eagerDestructors,
        destructors = meta.destructors;
    meta.state = 1
    /* Destroying */
    ;
    iterate(children, destroy);
    iterate(eagerDestructors, function (destructor) {
      return destructor(destroyable);
    });
    iterate(destructors, function (destructor) {
      return (0, _globalContext.scheduleDestroy)(destroyable, destructor);
    });
    (0, _globalContext.scheduleDestroyed)(function () {
      iterate(parents, function (parent) {
        return removeChildFromParent(destroyable, parent);
      });
      meta.state = 2
      /* Destroyed */
      ;
    });
  }

  function removeChildFromParent(child, parent) {
    var parentMeta = getDestroyableMeta(parent);

    if (parentMeta.state === 0
    /* Live */
    ) {
      parentMeta.children = remove(parentMeta.children, child, false
      /* DEBUG */
      && "attempted to remove child from parent, but the parent's children did not contain the child. This is likely a bug with destructors.");
    }
  }

  function destroyChildren(destroyable) {
    var _getDestroyableMeta = getDestroyableMeta(destroyable),
        children = _getDestroyableMeta.children;

    iterate(children, destroy);
  }

  function _hasDestroyableChildren(destroyable) {
    var meta = DESTROYABLE_META.get(destroyable);
    return meta === undefined ? false : meta.children !== null;
  }

  function isDestroying(destroyable) {
    var meta = DESTROYABLE_META.get(destroyable);
    return meta === undefined ? false : meta.state >= 1
    /* Destroying */
    ;
  }

  function isDestroyed(destroyable) {
    var meta = DESTROYABLE_META.get(destroyable);
    return meta === undefined ? false : meta.state >= 2
    /* Destroyed */
    ;
  } ////////////


  var enableDestroyableTracking;
  _exports.enableDestroyableTracking = enableDestroyableTracking;
  var assertDestroyablesDestroyed;
  _exports.assertDestroyablesDestroyed = assertDestroyablesDestroyed;

  if (false
  /* DEBUG */
  ) {
    var isTesting = false;

    _exports.enableDestroyableTracking = enableDestroyableTracking = function enableDestroyableTracking() {
      if (isTesting) {
        // Reset destroyable meta just in case, before throwing the error
        DESTROYABLE_META = new WeakMap();
        throw new Error('Attempted to start destroyable testing, but you did not end the previous destroyable test. Did you forget to call `assertDestroyablesDestroyed()`');
      }

      isTesting = true;
      DESTROYABLE_META = new Map();
    };

    _exports.assertDestroyablesDestroyed = assertDestroyablesDestroyed = function assertDestroyablesDestroyed() {
      if (!isTesting) {
        throw new Error('Attempted to assert destroyables destroyed, but you did not start a destroyable test. Did you forget to call `enableDestroyableTracking()`');
      }

      isTesting = false;
      var map = DESTROYABLE_META;
      DESTROYABLE_META = new WeakMap();
      var undestroyed = [];
      map.forEach(function (meta) {
        if (meta.state !== 2
        /* Destroyed */
        ) {
          undestroyed.push(meta.source);
        }
      });

      if (undestroyed.length > 0) {
        var objectsToString = undestroyed.map(_util.debugToString).join('\n    ');
        var error = new Error("Some destroyables were not destroyed during this test:\n    " + objectsToString);
        error.destroyables = undestroyed;
        throw error;
      }
    };
  }
});