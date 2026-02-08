define("@ember/-internals/extension-support/lib/data_adapter", ["exports", "ember-babel", "@ember/-internals/owner", "@ember/runloop", "@ember/-internals/metal", "@ember/string", "@ember/-internals/utils", "@ember/-internals/runtime", "@glimmer/validator"], function (_exports, _emberBabel, _owner, _runloop, _metal, _string, _utils, _runtime, _validator) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function iterate(arr, fn) {
    if (_utils.HAS_NATIVE_SYMBOL && Symbol.iterator in arr) {
      for (var _iterator = (0, _emberBabel.createForOfIteratorHelperLoose)(arr), _step; !(_step = _iterator()).done;) {
        var item = _step.value;
        fn(item);
      }
    } else {
      arr.forEach(fn);
    }
  }

  var RecordsWatcher = /*#__PURE__*/function () {
    var _proto = RecordsWatcher.prototype;

    _proto.getCacheForItem = function getCacheForItem(record) {
      var _this = this;

      var recordCache = this.recordCaches.get(record);

      if (!recordCache) {
        var hasBeenAdded = false;
        recordCache = (0, _validator.createCache)(function () {
          if (!hasBeenAdded) {
            _this.added.push(_this.wrapRecord(record));

            hasBeenAdded = true;
          } else {
            _this.updated.push(_this.wrapRecord(record));
          }
        });
        this.recordCaches.set(record, recordCache);
      }

      return recordCache;
    };

    function RecordsWatcher(records, recordsAdded, recordsUpdated, recordsRemoved, wrapRecord, release) {
      var _this2 = this;

      this.recordCaches = new Map();
      this.added = [];
      this.updated = [];
      this.removed = [];
      this.release = release;
      this.wrapRecord = wrapRecord;
      this.recordArrayCache = (0, _validator.createCache)(function () {
        var seen = new Set(); // Track `[]` for legacy support

        (0, _validator.consumeTag)((0, _validator.tagFor)(records, '[]'));
        iterate(records, function (record) {
          (0, _validator.getValue)(_this2.getCacheForItem(record));
          seen.add(record);
        }); // Untrack this operation because these records are being removed, they
        // should not be polled again in the future

        (0, _validator.untrack)(function () {
          _this2.recordCaches.forEach(function (cache, record) {
            if (!seen.has(record)) {
              _this2.removed.push(wrapRecord(record));

              _this2.recordCaches.delete(record);
            }
          });
        });

        if (_this2.added.length > 0) {
          recordsAdded(_this2.added);
          _this2.added = [];
        }

        if (_this2.updated.length > 0) {
          recordsUpdated(_this2.updated);
          _this2.updated = [];
        }

        if (_this2.removed.length > 0) {
          recordsRemoved(_this2.removed);
          _this2.removed = [];
        }
      });
    }

    _proto.revalidate = function revalidate() {
      (0, _validator.getValue)(this.recordArrayCache);
    };

    return RecordsWatcher;
  }();

  var TypeWatcher = /*#__PURE__*/function () {
    function TypeWatcher(records, onChange, release) {
      var hasBeenAccessed = false;
      this.cache = (0, _validator.createCache)(function () {
        // Empty iteration, we're doing this just
        // to track changes to the records array
        iterate(records, function () {}); // Also track `[]` for legacy support

        (0, _validator.consumeTag)((0, _validator.tagFor)(records, '[]'));

        if (hasBeenAccessed === true) {
          onChange();
        } else {
          hasBeenAccessed = true;
        }
      });
      this.release = release;
    }

    var _proto2 = TypeWatcher.prototype;

    _proto2.revalidate = function revalidate() {
      (0, _validator.getValue)(this.cache);
    };

    return TypeWatcher;
  }();
  /**
  @module @ember/debug
  */

  /**
    The `DataAdapter` helps a data persistence library
    interface with tools that debug Ember such
    as the [Ember Inspector](https://github.com/emberjs/ember-inspector)
    for Chrome and Firefox.
  
    This class will be extended by a persistence library
    which will override some of the methods with
    library-specific code.
  
    The methods likely to be overridden are:
  
    * `getFilters`
    * `detect`
    * `columnsForType`
    * `getRecords`
    * `getRecordColumnValues`
    * `getRecordKeywords`
    * `getRecordFilterValues`
    * `getRecordColor`
  
    The adapter will need to be registered
    in the application's container as `dataAdapter:main`.
  
    Example:
  
    ```javascript
    Application.initializer({
      name: "data-adapter",
  
      initialize: function(application) {
        application.register('data-adapter:main', DS.DataAdapter);
      }
    });
    ```
  
    @class DataAdapter
    @extends EmberObject
    @public
  */


  var _default = _runtime.Object.extend({
    init: function init() {
      this._super.apply(this, arguments);

      this.containerDebugAdapter = (0, _owner.getOwner)(this).lookup('container-debug-adapter:main');
      this.releaseMethods = (0, _runtime.A)();
      this.recordsWatchers = new Map();
      this.typeWatchers = new Map();
      this.flushWatchers = null;
    },

    /**
      The container-debug-adapter which is used
      to list all models.
       @property containerDebugAdapter
      @default undefined
      @since 1.5.0
      @public
    **/

    /**
      The number of attributes to send
      as columns. (Enough to make the record
      identifiable).
       @private
      @property attributeLimit
      @default 3
      @since 1.3.0
    */
    attributeLimit: 3,

    /**
       Ember Data > v1.0.0-beta.18
       requires string model names to be passed
       around instead of the actual factories.
        This is a stamp for the Ember Inspector
       to differentiate between the versions
       to be able to support older versions too.
        @public
       @property acceptsModelName
     */
    acceptsModelName: true,

    /**
       Map from records arrays to RecordsWatcher instances
        @private
       @property recordsWatchers
       @since 3.26.0
     */

    /**
      Map from records arrays to TypeWatcher instances
       @private
      @property typeWatchers
      @since 3.26.0
     */

    /**
      Callback that is currently scheduled on backburner end to flush and check
      all active watchers.
       @private
      @property flushWatchers
      @since 3.26.0
      */

    /**
      Stores all methods that clear observers.
      These methods will be called on destruction.
       @private
      @property releaseMethods
      @since 1.3.0
    */

    /**
      Specifies how records can be filtered.
      Records returned will need to have a `filterValues`
      property with a key for every name in the returned array.
       @public
      @method getFilters
      @return {Array} List of objects defining filters.
       The object should have a `name` and `desc` property.
    */
    getFilters: function getFilters() {
      return (0, _runtime.A)();
    },

    /**
      Fetch the model types and observe them for changes.
       @public
      @method watchModelTypes
       @param {Function} typesAdded Callback to call to add types.
      Takes an array of objects containing wrapped types (returned from `wrapModelType`).
       @param {Function} typesUpdated Callback to call when a type has changed.
      Takes an array of objects containing wrapped types.
       @return {Function} Method to call to remove all observers
    */
    watchModelTypes: function watchModelTypes(typesAdded, typesUpdated) {
      var _this3 = this;

      var modelTypes = this.getModelTypes();
      var releaseMethods = (0, _runtime.A)();
      var typesToSend;
      typesToSend = modelTypes.map(function (type) {
        var klass = type.klass;

        var wrapped = _this3.wrapModelType(klass, type.name);

        releaseMethods.push(_this3.observeModelType(type.name, typesUpdated));
        return wrapped;
      });
      typesAdded(typesToSend);

      var release = function release() {
        releaseMethods.forEach(function (fn) {
          return fn();
        });

        _this3.releaseMethods.removeObject(release);
      };

      this.releaseMethods.pushObject(release);
      return release;
    },
    _nameToClass: function _nameToClass(type) {
      if (typeof type === 'string') {
        var owner = (0, _owner.getOwner)(this);
        var Factory = owner.factoryFor("model:" + type);
        type = Factory && Factory.class;
      }

      return type;
    },

    /**
      Fetch the records of a given type and observe them for changes.
       @public
      @method watchRecords
       @param {String} modelName The model name.
       @param {Function} recordsAdded Callback to call to add records.
      Takes an array of objects containing wrapped records.
      The object should have the following properties:
        columnValues: {Object} The key and value of a table cell.
        object: {Object} The actual record object.
       @param {Function} recordsUpdated Callback to call when a record has changed.
      Takes an array of objects containing wrapped records.
       @param {Function} recordsRemoved Callback to call when a record has removed.
      Takes an array of objects containing wrapped records.
       @return {Function} Method to call to remove all observers.
    */
    watchRecords: function watchRecords(modelName, recordsAdded, recordsUpdated, recordsRemoved) {
      var _this4 = this;

      var klass = this._nameToClass(modelName);

      var records = this.getRecords(klass, modelName);
      var recordsWatchers = this.recordsWatchers;
      var recordsWatcher = recordsWatchers.get(records);

      if (!recordsWatcher) {
        recordsWatcher = new RecordsWatcher(records, recordsAdded, recordsUpdated, recordsRemoved, function (record) {
          return _this4.wrapRecord(record);
        }, function () {
          recordsWatchers.delete(records);

          _this4.updateFlushWatchers();
        });
        recordsWatchers.set(records, recordsWatcher);
        this.updateFlushWatchers();
        recordsWatcher.revalidate();
      }

      return recordsWatcher.release;
    },
    updateFlushWatchers: function updateFlushWatchers() {
      var _this5 = this;

      if (this.flushWatchers === null) {
        if (this.typeWatchers.size > 0 || this.recordsWatchers.size > 0) {
          this.flushWatchers = function () {
            _this5.typeWatchers.forEach(function (watcher) {
              return watcher.revalidate();
            });

            _this5.recordsWatchers.forEach(function (watcher) {
              return watcher.revalidate();
            });
          };

          _runloop.backburner.on('end', this.flushWatchers);
        }
      } else if (this.typeWatchers.size === 0 && this.recordsWatchers.size === 0) {
        _runloop.backburner.off('end', this.flushWatchers);

        this.flushWatchers = null;
      }
    },

    /**
      Clear all observers before destruction
      @private
      @method willDestroy
    */
    willDestroy: function willDestroy() {
      this._super.apply(this, arguments);

      this.typeWatchers.forEach(function (watcher) {
        return watcher.release();
      });
      this.recordsWatchers.forEach(function (watcher) {
        return watcher.release();
      });
      this.releaseMethods.forEach(function (fn) {
        return fn();
      });

      if (this.flushWatchers) {
        _runloop.backburner.off('end', this.flushWatchers);
      }
    },

    /**
      Detect whether a class is a model.
       Test that against the model class
      of your persistence library.
       @public
      @method detect
      @return boolean Whether the class is a model class or not.
    */
    detect: function detect() {
      return false;
    },

    /**
      Get the columns for a given model type.
       @public
      @method columnsForType
      @return {Array} An array of columns of the following format:
       name: {String} The name of the column.
       desc: {String} Humanized description (what would show in a table column name).
    */
    columnsForType: function columnsForType() {
      return (0, _runtime.A)();
    },

    /**
      Adds observers to a model type class.
       @private
      @method observeModelType
      @param {String} modelName The model type name.
      @param {Function} typesUpdated Called when a type is modified.
      @return {Function} The function to call to remove observers.
    */
    observeModelType: function observeModelType(modelName, typesUpdated) {
      var _this6 = this;

      var klass = this._nameToClass(modelName);

      var records = this.getRecords(klass, modelName);

      var onChange = function onChange() {
        typesUpdated([_this6.wrapModelType(klass, modelName)]);
      };

      var typeWatchers = this.typeWatchers;
      var typeWatcher = typeWatchers.get(records);

      if (!typeWatcher) {
        typeWatcher = new TypeWatcher(records, onChange, function () {
          typeWatchers.delete(records);

          _this6.updateFlushWatchers();
        });
        typeWatchers.set(records, typeWatcher);
        this.updateFlushWatchers();
        typeWatcher.revalidate();
      }

      return typeWatcher.release;
    },

    /**
      Wraps a given model type and observes changes to it.
       @private
      @method wrapModelType
      @param {Class} klass A model class.
      @param {String} modelName Name of the class.
      @return {Object} Contains the wrapped type and the function to remove observers
      Format:
        type: {Object} The wrapped type.
          The wrapped type has the following format:
            name: {String} The name of the type.
            count: {Integer} The number of records available.
            columns: {Columns} An array of columns to describe the record.
            object: {Class} The actual Model type class.
        release: {Function} The function to remove observers.
    */
    wrapModelType: function wrapModelType(klass, name) {
      var records = this.getRecords(klass, name);
      var typeToSend;
      typeToSend = {
        name: name,
        count: (0, _metal.get)(records, 'length'),
        columns: this.columnsForType(klass),
        object: klass
      };
      return typeToSend;
    },

    /**
      Fetches all models defined in the application.
       @private
      @method getModelTypes
      @return {Array} Array of model types.
    */
    getModelTypes: function getModelTypes() {
      var _this7 = this;

      var containerDebugAdapter = this.get('containerDebugAdapter');
      var types;

      if (containerDebugAdapter.canCatalogEntriesByType('model')) {
        types = containerDebugAdapter.catalogEntriesByType('model');
      } else {
        types = this._getObjectsOnNamespaces();
      } // New adapters return strings instead of classes.


      types = (0, _runtime.A)(types).map(function (name) {
        return {
          klass: _this7._nameToClass(name),
          name: name
        };
      });
      types = (0, _runtime.A)(types).filter(function (type) {
        return _this7.detect(type.klass);
      });
      return (0, _runtime.A)(types);
    },

    /**
      Loops over all namespaces and all objects
      attached to them.
       @private
      @method _getObjectsOnNamespaces
      @return {Array} Array of model type strings.
    */
    _getObjectsOnNamespaces: function _getObjectsOnNamespaces() {
      var _this8 = this;

      var namespaces = (0, _runtime.A)(_runtime.Namespace.NAMESPACES);
      var types = (0, _runtime.A)();
      namespaces.forEach(function (namespace) {
        for (var key in namespace) {
          if (!Object.prototype.hasOwnProperty.call(namespace, key)) {
            continue;
          } // Even though we will filter again in `getModelTypes`,
          // we should not call `lookupFactory` on non-models


          if (!_this8.detect(namespace[key])) {
            continue;
          }

          var name = (0, _string.dasherize)(key);
          types.push(name);
        }
      });
      return types;
    },

    /**
      Fetches all loaded records for a given type.
       @public
      @method getRecords
      @return {Array} An array of records.
       This array will be observed for changes,
       so it should update when new records are added/removed.
    */
    getRecords: function getRecords() {
      return (0, _runtime.A)();
    },

    /**
      Wraps a record and observers changes to it.
       @private
      @method wrapRecord
      @param {Object} record The record instance.
      @return {Object} The wrapped record. Format:
      columnValues: {Array}
      searchKeywords: {Array}
    */
    wrapRecord: function wrapRecord(record) {
      var recordToSend = {
        object: record
      };
      recordToSend.columnValues = this.getRecordColumnValues(record);
      recordToSend.searchKeywords = this.getRecordKeywords(record);
      recordToSend.filterValues = this.getRecordFilterValues(record);
      recordToSend.color = this.getRecordColor(record);
      return recordToSend;
    },

    /**
      Gets the values for each column.
       @public
      @method getRecordColumnValues
      @return {Object} Keys should match column names defined
      by the model type.
    */
    getRecordColumnValues: function getRecordColumnValues() {
      return {};
    },

    /**
      Returns keywords to match when searching records.
       @public
      @method getRecordKeywords
      @return {Array} Relevant keywords for search.
    */
    getRecordKeywords: function getRecordKeywords() {
      return (0, _runtime.A)();
    },

    /**
      Returns the values of filters defined by `getFilters`.
       @public
      @method getRecordFilterValues
      @param {Object} record The record instance.
      @return {Object} The filter values.
    */
    getRecordFilterValues: function getRecordFilterValues() {
      return {};
    },

    /**
      Each record can have a color that represents its state.
       @public
      @method getRecordColor
      @param {Object} record The record instance
      @return {String} The records color.
        Possible options: black, red, blue, green.
    */
    getRecordColor: function getRecordColor() {
      return null;
    }
  });

  _exports.default = _default;
});