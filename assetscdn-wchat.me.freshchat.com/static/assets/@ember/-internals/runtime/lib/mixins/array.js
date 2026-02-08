define("@ember/-internals/runtime/lib/mixins/array", ["exports", "@ember/-internals/metal", "@ember/-internals/utils", "@ember/debug", "@ember/-internals/runtime/lib/mixins/enumerable", "@ember/-internals/runtime/lib/compare", "@ember/-internals/environment", "@ember/-internals/runtime/lib/mixins/observable", "@ember/-internals/runtime/lib/mixins/mutable_enumerable", "@ember/-internals/runtime/lib/type-of"], function (_exports, _metal, _utils, _debug, _enumerable, _compare, _environment, _observable, _mutable_enumerable, _typeOf) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.NativeArray = _exports.MutableArray = _exports.A = void 0;
  _exports.isArray = isArray;
  _exports.removeAt = _removeAt;
  _exports.uniqBy = _uniqBy;

  var _NativeArray;

  var EMPTY_ARRAY = Object.freeze([]);

  var identityFunction = function identityFunction(item) {
    return item;
  };

  function _uniqBy(array, key) {
    if (key === void 0) {
      key = identityFunction;
    }

    (false && !(isArray(array)) && (0, _debug.assert)("first argument passed to `uniqBy` should be array", isArray(array)));

    var ret = _A2();

    var seen = new Set();
    var getter = typeof key === 'function' ? key : function (item) {
      return (0, _metal.get)(item, key);
    };
    array.forEach(function (item) {
      var val = getter(item);

      if (!seen.has(val)) {
        seen.add(val);
        ret.push(item);
      }
    });
    return ret;
  }

  function iter(key, value) {
    var valueProvided = arguments.length === 2;
    return valueProvided ? function (item) {
      return value === (0, _metal.get)(item, key);
    } : function (item) {
      return Boolean((0, _metal.get)(item, key));
    };
  }

  function findIndex(array, predicate, startAt) {
    var len = array.length;

    for (var index = startAt; index < len; index++) {
      var item = (0, _metal.objectAt)(array, index);

      if (predicate(item, index, array)) {
        return index;
      }
    }

    return -1;
  }

  function _find(array, callback, target) {
    var predicate = callback.bind(target);
    var index = findIndex(array, predicate, 0);
    return index === -1 ? undefined : (0, _metal.objectAt)(array, index);
  }

  function _any(array, callback, target) {
    var predicate = callback.bind(target);
    return findIndex(array, predicate, 0) !== -1;
  }

  function _every(array, callback, target) {
    var cb = callback.bind(target);

    var predicate = function predicate(item, index, array) {
      return !cb(item, index, array);
    };

    return findIndex(array, predicate, 0) === -1;
  }

  function _indexOf(array, val, startAt, withNaNCheck) {
    if (startAt === void 0) {
      startAt = 0;
    }

    var len = array.length;

    if (startAt < 0) {
      startAt += len;
    } // SameValueZero comparison (NaN !== NaN)


    var predicate = withNaNCheck && val !== val ? function (item) {
      return item !== item;
    } : function (item) {
      return item === val;
    };
    return findIndex(array, predicate, startAt);
  }

  function _removeAt(array, index, len) {
    if (len === void 0) {
      len = 1;
    }

    (false && !(index > -1 && index < array.length) && (0, _debug.assert)("`removeAt` index provided is out of range", index > -1 && index < array.length));
    (0, _metal.replace)(array, index, len, EMPTY_ARRAY);
    return array;
  }

  function _insertAt(array, index, item) {
    (false && !(index > -1 && index <= array.length) && (0, _debug.assert)("`insertAt` index provided is out of range", index > -1 && index <= array.length));
    (0, _metal.replace)(array, index, 0, [item]);
    return item;
  }
  /**
    Returns true if the passed object is an array or Array-like.
  
    Objects are considered Array-like if any of the following are true:
  
      - the object is a native Array
      - the object has an objectAt property
      - the object is an Object, and has a length property
  
    Unlike `typeOf` this method returns true even if the passed object is
    not formally an array but appears to be array-like (i.e. implements `Array`)
  
    ```javascript
    import { isArray } from '@ember/array';
    import ArrayProxy from '@ember/array/proxy';
  
    isArray();                                      // false
    isArray([]);                                    // true
    isArray(ArrayProxy.create({ content: [] }));    // true
    ```
  
    @method isArray
    @static
    @for @ember/array
    @param {Object} obj The object to test
    @return {Boolean} true if the passed object is an array or Array-like
    @public
  */


  function isArray(_obj) {
    var obj = _obj;

    if (false
    /* DEBUG */
    && _utils.HAS_NATIVE_PROXY && typeof _obj === 'object' && _obj !== null) {
      var possibleProxyContent = _obj[_metal.PROXY_CONTENT];

      if (possibleProxyContent !== undefined) {
        obj = possibleProxyContent;
      }
    }

    if (!obj || obj.setInterval) {
      return false;
    }

    if (Array.isArray(obj) || ArrayMixin.detect(obj)) {
      return true;
    }

    var type = (0, _typeOf.typeOf)(obj);

    if ('array' === type) {
      return true;
    }

    var length = obj.length;

    if (typeof length === 'number' && length === length && 'object' === type) {
      return true;
    }

    return false;
  }
  /*
    This allows us to define computed properties that are not enumerable.
    The primary reason this is important is that when `NativeArray` is
    applied to `Array.prototype` we need to ensure that we do not add _any_
    new enumerable properties.
  */


  function nonEnumerableComputed() {
    var property = _metal.computed.apply(void 0, arguments);

    property.enumerable = false;
    return property;
  }

  function mapBy(key) {
    return this.map(function (next) {
      return (0, _metal.get)(next, key);
    });
  } // ..........................................................
  // ARRAY
  //

  /**
    This mixin implements Observer-friendly Array-like behavior. It is not a
    concrete implementation, but it can be used up by other classes that want
    to appear like arrays.
  
    For example, ArrayProxy is a concrete class that can be instantiated to
    implement array-like behavior. This class uses the Array Mixin by way of
    the MutableArray mixin, which allows observable changes to be made to the
    underlying array.
  
    This mixin defines methods specifically for collections that provide
    index-ordered access to their contents. When you are designing code that
    needs to accept any kind of Array-like object, you should use these methods
    instead of Array primitives because these will properly notify observers of
    changes to the array.
  
    Although these methods are efficient, they do add a layer of indirection to
    your application so it is a good idea to use them only when you need the
    flexibility of using both true JavaScript arrays and "virtual" arrays such
    as controllers and collections.
  
    You can use the methods defined in this module to access and modify array
    contents in an observable-friendly way. You can also be notified whenever
    the membership of an array changes by using `.observes('myArray.[]')`.
  
    To support `EmberArray` in your own class, you must override two
    primitives to use it: `length()` and `objectAt()`.
  
    @class EmberArray
    @uses Enumerable
    @since Ember 0.9.0
    @public
  */


  var ArrayMixin = _metal.Mixin.create(_enumerable.default, {
    init: function init() {
      this._super.apply(this, arguments);

      (0, _utils.setEmberArray)(this);
    },

    /**
      __Required.__ You must implement this method to apply this mixin.
       Your array must support the `length` property. Your replace methods should
      set this property whenever it changes.
       @property {Number} length
      @public
    */

    /**
      Returns the object at the given `index`. If the given `index` is negative
      or is greater or equal than the array length, returns `undefined`.
       This is one of the primitives you must implement to support `EmberArray`.
      If your object supports retrieving the value of an array item using `get()`
      (i.e. `myArray.get(0)`), then you do not need to implement this method
      yourself.
       ```javascript
      let arr = ['a', 'b', 'c', 'd'];
       arr.objectAt(0);   // 'a'
      arr.objectAt(3);   // 'd'
      arr.objectAt(-1);  // undefined
      arr.objectAt(4);   // undefined
      arr.objectAt(5);   // undefined
      ```
       @method objectAt
      @param {Number} idx The index of the item to return.
      @return {*} item at index or undefined
      @public
    */

    /**
      This returns the objects at the specified indexes, using `objectAt`.
       ```javascript
      let arr = ['a', 'b', 'c', 'd'];
       arr.objectsAt([0, 1, 2]);  // ['a', 'b', 'c']
      arr.objectsAt([2, 3, 4]);  // ['c', 'd', undefined]
      ```
       @method objectsAt
      @param {Array} indexes An array of indexes of items to return.
      @return {Array}
      @public
     */
    objectsAt: function objectsAt(indexes) {
      var _this = this;

      return indexes.map(function (idx) {
        return (0, _metal.objectAt)(_this, idx);
      });
    },

    /**
      This is the handler for the special array content property. If you get
      this property, it will return this. If you set this property to a new
      array, it will replace the current content.
       ```javascript
      let peopleToMoon = ['Armstrong', 'Aldrin'];
       peopleToMoon.get('[]'); // ['Armstrong', 'Aldrin']
       peopleToMoon.set('[]', ['Collins']); // ['Collins']
      peopleToMoon.get('[]'); // ['Collins']
      ```
       @property []
      @return this
      @public
    */
    '[]': nonEnumerableComputed({
      get: function get() {
        return this;
      },
      set: function set(key, value) {
        this.replace(0, this.length, value);
        return this;
      }
    }),

    /**
      The first object in the array, or `undefined` if the array is empty.
       ```javascript
      let vowels = ['a', 'e', 'i', 'o', 'u'];
      vowels.firstObject; // 'a'
       vowels.shiftObject();
      vowels.firstObject; // 'e'
       vowels.reverseObjects();
      vowels.firstObject; // 'u'
       vowels.clear();
      vowels.firstObject; // undefined
      ```
       @property firstObject
      @return {Object | undefined} The first object in the array
      @public
    */
    firstObject: nonEnumerableComputed(function () {
      return (0, _metal.objectAt)(this, 0);
    }).readOnly(),

    /**
      The last object in the array, or `undefined` if the array is empty.
       @property lastObject
      @return {Object | undefined} The last object in the array
      @public
    */
    lastObject: nonEnumerableComputed(function () {
      return (0, _metal.objectAt)(this, this.length - 1);
    }).readOnly(),
    // Add any extra methods to EmberArray that are native to the built-in Array.

    /**
      Returns a new array that is a slice of the receiver. This implementation
      uses the observable array methods to retrieve the objects for the new
      slice.
       ```javascript
      let arr = ['red', 'green', 'blue'];
       arr.slice(0);       // ['red', 'green', 'blue']
      arr.slice(0, 2);    // ['red', 'green']
      arr.slice(1, 100);  // ['green', 'blue']
      ```
       @method slice
      @param {Number} beginIndex (Optional) index to begin slicing from.
      @param {Number} endIndex (Optional) index to end the slice at (but not included).
      @return {Array} New array with specified slice
      @public
    */
    slice: function slice(beginIndex, endIndex) {
      if (beginIndex === void 0) {
        beginIndex = 0;
      }

      var ret = _A2();

      var length = this.length;

      if (beginIndex < 0) {
        beginIndex = length + beginIndex;
      }

      if (endIndex === undefined || endIndex > length) {
        endIndex = length;
      } else if (endIndex < 0) {
        endIndex = length + endIndex;
      }

      while (beginIndex < endIndex) {
        ret[ret.length] = (0, _metal.objectAt)(this, beginIndex++);
      }

      return ret;
    },

    /**
      Used to determine the passed object's first occurrence in the array.
      Returns the index if found, -1 if no match is found.
       The optional `startAt` argument can be used to pass a starting
      index to search from, effectively slicing the searchable portion
      of the array. If it's negative it will add the array length to
      the startAt value passed in as the index to search from. If less
      than or equal to `-1 * array.length` the entire array is searched.
       ```javascript
      let arr = ['a', 'b', 'c', 'd', 'a'];
       arr.indexOf('a');       //  0
      arr.indexOf('z');       // -1
      arr.indexOf('a', 2);    //  4
      arr.indexOf('a', -1);   //  4, equivalent to indexOf('a', 4)
      arr.indexOf('a', -100); //  0, searches entire array
      arr.indexOf('b', 3);    // -1
      arr.indexOf('a', 100);  // -1
       let people = [{ name: 'Zoey' }, { name: 'Bob' }]
      let newPerson = { name: 'Tom' };
      people = [newPerson, ...people, newPerson];
       people.indexOf(newPerson);     //  0
      people.indexOf(newPerson, 1);  //  3
      people.indexOf(newPerson, -4); //  0
      people.indexOf(newPerson, 10); // -1
      ```
       @method indexOf
      @param {Object} object the item to search for
      @param {Number} startAt optional starting location to search, default 0
      @return {Number} index or -1 if not found
      @public
    */
    indexOf: function indexOf(object, startAt) {
      return _indexOf(this, object, startAt, false);
    },

    /**
      Returns the index of the given `object`'s last occurrence.
       - If no `startAt` argument is given, the search starts from
      the last position.
      - If it's greater than or equal to the length of the array,
      the search starts from the last position.
      - If it's negative, it is taken as the offset from the end
      of the array i.e. `startAt + array.length`.
      - If it's any other positive number, will search backwards
      from that index of the array.
       Returns -1 if no match is found.
       ```javascript
      let arr = ['a', 'b', 'c', 'd', 'a'];
       arr.lastIndexOf('a');       //  4
      arr.lastIndexOf('z');       // -1
      arr.lastIndexOf('a', 2);    //  0
      arr.lastIndexOf('a', -1);   //  4
      arr.lastIndexOf('a', -3);   //  0
      arr.lastIndexOf('b', 3);    //  1
      arr.lastIndexOf('a', 100);  //  4
      ```
       @method lastIndexOf
      @param {Object} object the item to search for
      @param {Number} startAt optional starting location to search from
      backwards, defaults to `(array.length - 1)`
      @return {Number} The last index of the `object` in the array or -1
      if not found
      @public
    */
    lastIndexOf: function lastIndexOf(object, startAt) {
      var len = this.length;

      if (startAt === undefined || startAt >= len) {
        startAt = len - 1;
      }

      if (startAt < 0) {
        startAt += len;
      }

      for (var idx = startAt; idx >= 0; idx--) {
        if ((0, _metal.objectAt)(this, idx) === object) {
          return idx;
        }
      }

      return -1;
    },
    // ..........................................................
    // ARRAY OBSERVERS
    //

    /**
      Adds an array observer to the receiving array. The array observer object
      normally must implement two methods:
       * `willChange(observedObj, start, removeCount, addCount)` - This method will be
        called just before the array is modified.
      * `didChange(observedObj, start, removeCount, addCount)` - This method will be
        called just after the array is modified.
       Both callbacks will be passed the observed object, starting index of the
      change as well as a count of the items to be removed and added. You can use
      these callbacks to optionally inspect the array during the change, clear
      caches, or do any other bookkeeping necessary.
       In addition to passing a target, you can also include an options hash
      which you can use to override the method names that will be invoked on the
      target.
       @method addArrayObserver
      @param {Object} target The observer object.
      @param {Object} opts Optional hash of configuration options including
        `willChange` and `didChange` option.
      @return {EmberArray} receiver
      @public
      @example
          import Service from '@ember/service';
           export default Service.extend({
            data: Ember.A(),
             init() {
              this._super(...arguments);
               this.data.addArrayObserver(this, {
                willChange: 'dataWillChange',
                didChange: 'dataDidChange'
              });
            },
             dataWillChange(array, start, removeCount, addCount) {
              console.log('array will change', array, start, removeCount, addCount);
            },
             dataDidChange(array, start, removeCount, addCount) {
              console.log('array did change', array, start, removeCount, addCount);
            }
          });
    */
    addArrayObserver: function addArrayObserver(target, opts) {
      return (0, _metal.addArrayObserver)(this, target, opts);
    },

    /**
      Removes an array observer from the object if the observer is current
      registered. Calling this method multiple times with the same object will
      have no effect.
       @method removeArrayObserver
      @param {Object} target The object observing the array.
      @param {Object} opts Optional hash of configuration options including
        `willChange` and `didChange` option.
      @return {EmberArray} receiver
      @public
    */
    removeArrayObserver: function removeArrayObserver(target, opts) {
      return (0, _metal.removeArrayObserver)(this, target, opts);
    },

    /**
      Becomes true whenever the array currently has observers watching changes
      on the array.
       ```javascript
      let arr = [1, 2, 3, 4, 5];
      arr.hasArrayObservers; // false
       arr.addArrayObserver(this, {
        willChange() {
          console.log('willChange');
        }
      });
      arr.hasArrayObservers; // true
      ```
       @property {Boolean} hasArrayObservers
      @public
    */
    hasArrayObservers: (0, _metal.nativeDescDecorator)({
      configurable: true,
      enumerable: false,
      get: function get() {
        return (0, _metal.hasListeners)(this, '@array:change') || (0, _metal.hasListeners)(this, '@array:before');
      }
    }),

    /**
      If you are implementing an object that supports `EmberArray`, call this
      method just before the array content changes to notify any observers and
      invalidate any related properties. Pass the starting index of the change
      as well as a delta of the amounts to change.
       ```app/components/show-post.js
      import Component from '@ember/component';
      import EmberObject from '@ember/object';
       const Post = EmberObject.extend({
        body: '',
        save() {}
      })
       export default Component.extend({
        attemptsToModify: 0,
        successfulModifications: 0,
        posts: null,
         init() {
          this._super(...arguments);
           this.posts = [1, 2, 3].map(i => Post.create({ body: i }));
          this.posts.addArrayObserver(this, {
            willChange() {
              this.incrementProperty('attemptsToModify');
            },
            didChange() {
              this.incrementProperty('successfulModifications');
            }
          });
        },
         actions: {
          editPost(post, newContent) {
            let oldContent = post.body,
                postIndex = this.posts.indexOf(post);
             this.posts.arrayContentWillChange(postIndex, 0, 0); // attemptsToModify = 1
            post.set('body', newContent);
             post.save()
              .then(response => {
                this.posts.arrayContentDidChange(postIndex, 0, 0); // successfulModifications = 1
              })
              .catch(error => {
                post.set('body', oldContent);
              })
          }
        }
      });
      ```
       @method arrayContentWillChange
      @param {Number} startIdx The starting index in the array that will change.
      @param {Number} removeAmt The number of items that will be removed. If you
        pass `null` assumes 0
      @param {Number} addAmt The number of items that will be added. If you
        pass `null` assumes 0.
      @return {EmberArray} receiver
      @public
    */
    arrayContentWillChange: function arrayContentWillChange(startIdx, removeAmt, addAmt) {
      return (0, _metal.arrayContentWillChange)(this, startIdx, removeAmt, addAmt);
    },

    /**
      If you are implementing an object that supports `EmberArray`, call this
      method just after the array content changes to notify any observers and
      invalidate any related properties. Pass the starting index of the change
      as well as a delta of the amounts to change.
       ```javascript
      let arr = [1, 2, 3, 4, 5];
       arr.copyWithin(-2); // [1, 2, 3, 1, 2]
      // arr.lastObject = 5
      arr.arrayContentDidChange(3, 2, 2);
      // arr.lastObject = 2
      ```
       @method arrayContentDidChange
      @param {Number} startIdx The starting index in the array that did change.
      @param {Number} removeAmt The number of items that were removed. If you
        pass `null` assumes 0
      @param {Number} addAmt The number of items that were added. If you
        pass `null` assumes 0.
      @return {EmberArray} receiver
      @public
    */
    arrayContentDidChange: function arrayContentDidChange(startIdx, removeAmt, addAmt) {
      return (0, _metal.arrayContentDidChange)(this, startIdx, removeAmt, addAmt);
    },

    /**
      Iterates through the array, calling the passed function on each
      item. This method corresponds to the `forEach()` method defined in
      JavaScript 1.6.
       The callback method you provide should have the following signature (all
      parameters are optional):
       ```javascript
      function(item, index, array);
      ```
       - `item` is the current item in the iteration.
      - `index` is the current index in the iteration.
      - `array` is the array itself.
       Note that in addition to a callback, you can also pass an optional target
      object that will be set as `this` on the context. This is a good way
      to give your iterator function access to the current object.
       Example Usage:
       ```javascript
      let foods = [
        { name: 'apple', eaten: false },
        { name: 'banana', eaten: false },
        { name: 'carrot', eaten: false }
      ];
       foods.forEach((food) => food.eaten = true);
       let output = '';
      foods.forEach((item, index, array) =>
        output += `${index + 1}/${array.length} ${item.name}\n`;
      );
      console.log(output);
      // 1/3 apple
      // 2/3 banana
      // 3/3 carrot
      ```
       @method forEach
      @param {Function} callback The callback to execute
      @param {Object} [target] The target object to use
      @return {Object} receiver
      @public
    */
    forEach: function forEach(callback, target) {
      if (target === void 0) {
        target = null;
      }

      (false && !(typeof callback === 'function') && (0, _debug.assert)('`forEach` expects a function as first argument.', typeof callback === 'function'));
      var length = this.length;

      for (var index = 0; index < length; index++) {
        var item = this.objectAt(index);
        callback.call(target, item, index, this);
      }

      return this;
    },

    /**
      Alias for `mapBy`.
       Returns the value of the named
      property on all items in the enumeration.
       ```javascript
      let people = [{name: 'Joe'}, {name: 'Matt'}];
       people.getEach('name');
      // ['Joe', 'Matt'];
       people.getEach('nonexistentProperty');
      // [undefined, undefined];
      ```
       @method getEach
      @param {String} key name of the property
      @return {Array} The mapped array.
      @public
    */
    getEach: mapBy,

    /**
      Sets the value on the named property for each member. This is more
      ergonomic than using other methods defined on this helper. If the object
      implements Observable, the value will be changed to `set(),` otherwise
      it will be set directly. `null` objects are skipped.
       ```javascript
      let people = [{name: 'Joe'}, {name: 'Matt'}];
       people.setEach('zipCode', '10011');
      // [{name: 'Joe', zipCode: '10011'}, {name: 'Matt', zipCode: '10011'}];
      ```
       @method setEach
      @param {String} key The key to set
      @param {Object} value The object to set
      @return {Object} receiver
      @public
    */
    setEach: function setEach(key, value) {
      return this.forEach(function (item) {
        return (0, _metal.set)(item, key, value);
      });
    },

    /**
      Maps all of the items in the enumeration to another value, returning
      a new array. This method corresponds to `map()` defined in JavaScript 1.6.
       The callback method you provide should have the following signature (all
      parameters are optional):
       ```javascript
      function(item, index, array);
      let arr = [1, 2, 3, 4, 5, 6];
       arr.map(element => element * element);
      // [1, 4, 9, 16, 25, 36];
       arr.map((element, index) => element + index);
      // [1, 3, 5, 7, 9, 11];
      ```
       - `item` is the current item in the iteration.
      - `index` is the current index in the iteration.
      - `array` is the array itself.
       It should return the mapped value.
       Note that in addition to a callback, you can also pass an optional target
      object that will be set as `this` on the context. This is a good way
      to give your iterator function access to the current object.
       @method map
      @param {Function} callback The callback to execute
      @param {Object} [target] The target object to use
      @return {Array} The mapped array.
      @public
    */
    map: function map(callback, target) {
      if (target === void 0) {
        target = null;
      }

      (false && !(typeof callback === 'function') && (0, _debug.assert)('`map` expects a function as first argument.', typeof callback === 'function'));

      var ret = _A2();

      this.forEach(function (x, idx, i) {
        return ret[idx] = callback.call(target, x, idx, i);
      });
      return ret;
    },

    /**
      Similar to map, this specialized function returns the value of the named
      property on all items in the enumeration.
       ```javascript
      let people = [{name: 'Joe'}, {name: 'Matt'}];
       people.mapBy('name');
      // ['Joe', 'Matt'];
       people.mapBy('unknownProperty');
      // [undefined, undefined];
      ```
       @method mapBy
      @param {String} key name of the property
      @return {Array} The mapped array.
      @public
    */
    mapBy: mapBy,

    /**
      Returns a new array with all of the items in the enumeration that the provided
      callback function returns true for. This method corresponds to [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter).
       The callback method should have the following signature:
       ```javascript
      function(item, index, array);
      ```
       - `item` is the current item in the iteration.
      - `index` is the current index in the iteration.
      - `array` is the array itself.
       All parameters are optional. The function should return `true` to include the item
      in the results, and `false` otherwise.
       Example:
       ```javascript
      function isAdult(person) {
        return person.age > 18;
      };
       let people = Ember.A([{ name: 'John', age: 14 }, { name: 'Joan', age: 45 }]);
       people.filter(isAdult); // returns [{ name: 'Joan', age: 45 }];
      ```
       Note that in addition to a callback, you can pass an optional target object
      that will be set as `this` on the context. This is a good way to give your
      iterator function access to the current object. For example:
       ```javascript
      function isAdultAndEngineer(person) {
        return person.age > 18 && this.engineering;
      }
       class AdultsCollection {
        engineering = false;
         constructor(opts = {}) {
          super(...arguments);
           this.engineering = opts.engineering;
          this.people = Ember.A([{ name: 'John', age: 14 }, { name: 'Joan', age: 45 }]);
        }
      }
       let collection = new AdultsCollection({ engineering: true });
      collection.people.filter(isAdultAndEngineer, { target: collection });
      ```
       @method filter
      @param {Function} callback The callback to execute
      @param {Object} [target] The target object to use
      @return {Array} A filtered array.
      @public
    */
    filter: function filter(callback, target) {
      if (target === void 0) {
        target = null;
      }

      (false && !(typeof callback === 'function') && (0, _debug.assert)('`filter` expects a function as first argument.', typeof callback === 'function'));

      var ret = _A2();

      this.forEach(function (x, idx, i) {
        if (callback.call(target, x, idx, i)) {
          ret.push(x);
        }
      });
      return ret;
    },

    /**
      Returns an array with all of the items in the enumeration where the passed
      function returns false. This method is the inverse of filter().
       The callback method you provide should have the following signature (all
      parameters are optional):
       ```javascript
      function(item, index, array);
      ```
       - *item* is the current item in the iteration.
      - *index* is the current index in the iteration
      - *array* is the array itself.
       It should return a falsey value to include the item in the results.
       Note that in addition to a callback, you can also pass an optional target
      object that will be set as "this" on the context. This is a good way
      to give your iterator function access to the current object.
       Example Usage:
       ```javascript
      const food = [
        { food: 'apple', isFruit: true },
        { food: 'bread', isFruit: false },
        { food: 'banana', isFruit: true }
      ];
      const nonFruits = food.reject(function(thing) {
        return thing.isFruit;
      }); // [{food: 'bread', isFruit: false}]
      ```
       @method reject
      @param {Function} callback The callback to execute
      @param {Object} [target] The target object to use
      @return {Array} A rejected array.
      @public
    */
    reject: function reject(callback, target) {
      if (target === void 0) {
        target = null;
      }

      (false && !(typeof callback === 'function') && (0, _debug.assert)('`reject` expects a function as first argument.', typeof callback === 'function'));
      return this.filter(function () {
        return !callback.apply(target, arguments);
      });
    },

    /**
      Filters the array by the property and an optional value. If a value is given, it returns
      the items that have said value for the property. If not, it returns all the items that
      have a truthy value for the property.
       Example Usage:
       ```javascript
      let things = Ember.A([{ food: 'apple', isFruit: true }, { food: 'beans', isFruit: false }]);
       things.filterBy('food', 'beans'); // [{ food: 'beans', isFruit: false }]
      things.filterBy('isFruit'); // [{ food: 'apple', isFruit: true }]
      ```
       @method filterBy
      @param {String} key the property to test
      @param {*} [value] optional value to test against.
      @return {Array} filtered array
      @public
    */
    filterBy: function filterBy() {
      return this.filter(iter.apply(void 0, arguments));
    },

    /**
      Returns an array with the items that do not have truthy values for the provided key.
      You can pass an optional second argument with a target value to reject for the key.
      Otherwise this will reject objects where the provided property evaluates to false.
       Example Usage:
       ```javascript
        let food = [
          { name: "apple", isFruit: true },
          { name: "carrot", isFruit: false },
          { name: "bread", isFruit: false },
        ];
        food.rejectBy('isFruit'); // [{ name: "carrot", isFruit: false }, { name: "bread", isFruit: false }]
        food.rejectBy('name', 'carrot'); // [{ name: "apple", isFruit: true }}, { name: "bread", isFruit: false }]
      ```
       @method rejectBy
      @param {String} key the property to test
      @param {*} [value] optional value to test against.
      @return {Array} rejected array
      @public
    */
    rejectBy: function rejectBy() {
      return this.reject(iter.apply(void 0, arguments));
    },

    /**
      Returns the first item in the array for which the callback returns true.
      This method is similar to the `find()` method defined in ECMAScript 2015.
       The callback method you provide should have the following signature (all
      parameters are optional):
       ```javascript
      function(item, index, array);
      ```
       - `item` is the current item in the iteration.
      - `index` is the current index in the iteration.
      - `array` is the array itself.
       It should return the `true` to include the item in the results, `false`
      otherwise.
       Note that in addition to a callback, you can also pass an optional target
      object that will be set as `this` on the context. This is a good way
      to give your iterator function access to the current object.
       Example Usage:
       ```javascript
      let users = [
        { id: 1, name: 'Yehuda' },
        { id: 2, name: 'Tom' },
        { id: 3, name: 'Melanie' },
        { id: 4, name: 'Leah' }
      ];
       users.find((user) => user.name == 'Tom'); // [{ id: 2, name: 'Tom' }]
      users.find(({ id }) => id == 3); // [{ id: 3, name: 'Melanie' }]
      ```
       @method find
      @param {Function} callback The callback to execute
      @param {Object} [target] The target object to use
      @return {Object} Found item or `undefined`.
      @public
    */
    find: function find(callback, target) {
      if (target === void 0) {
        target = null;
      }

      (false && !(typeof callback === 'function') && (0, _debug.assert)('`find` expects a function as first argument.', typeof callback === 'function'));
      return _find(this, callback, target);
    },

    /**
      Returns the first item with a property matching the passed value. You
      can pass an optional second argument with the target value. Otherwise
      this will match any property that evaluates to `true`.
       This method works much like the more generic `find()` method.
       Usage Example:
       ```javascript
      let users = [
        { id: 1, name: 'Yehuda', isTom: false },
        { id: 2, name: 'Tom', isTom: true },
        { id: 3, name: 'Melanie', isTom: false },
        { id: 4, name: 'Leah', isTom: false }
      ];
       users.findBy('id', 4); // { id: 4, name: 'Leah', isTom: false }
      users.findBy('name', 'Melanie'); // { id: 3, name: 'Melanie', isTom: false }
      users.findBy('isTom'); // { id: 2, name: 'Tom', isTom: true }
      ```
       @method findBy
      @param {String} key the property to test
      @param {String} [value] optional value to test against.
      @return {Object} found item or `undefined`
      @public
    */
    findBy: function findBy() {
      return _find(this, iter.apply(void 0, arguments));
    },

    /**
      Returns `true` if the passed function returns true for every item in the
      enumeration. This corresponds with the `Array.prototype.every()` method defined in ES5.
       The callback method should have the following signature:
       ```javascript
      function(item, index, array);
      ```
       - `item` is the current item in the iteration.
      - `index` is the current index in the iteration.
      - `array` is the array itself.
       All params are optional. The method should return `true` or `false`.
       Note that in addition to a callback, you can also pass an optional target
      object that will be set as `this` on the context. This is a good way
      to give your iterator function access to the current object.
       Usage example:
       ```javascript
      function isAdult(person) {
        return person.age > 18;
      };
       const people = Ember.A([{ name: 'John', age: 24 }, { name: 'Joan', age: 45 }]);
      const areAllAdults = people.every(isAdult);
      ```
       @method every
      @param {Function} callback The callback to execute
      @param {Object} [target] The target object to use
      @return {Boolean}
      @public
    */
    every: function every(callback, target) {
      if (target === void 0) {
        target = null;
      }

      (false && !(typeof callback === 'function') && (0, _debug.assert)('`every` expects a function as first argument.', typeof callback === 'function'));
      return _every(this, callback, target);
    },

    /**
      Returns `true` if the passed property resolves to the value of the second
      argument for all items in the array. This method is often simpler/faster
      than using a callback.
       Note that like the native `Array.every`, `isEvery` will return true when called
      on any empty array.
      ```javascript
      class Language {
        constructor(name, isProgrammingLanguage) {
          this.name = name;
          this.programmingLanguage = isProgrammingLanguage;
        }
      }
       const compiledLanguages = [
        new Language('Java', true),
        new Language('Go', true),
        new Language('Rust', true)
      ]
       const languagesKnownByMe = [
        new Language('Javascript', true),
        new Language('English', false),
        new Language('Ruby', true)
      ]
       compiledLanguages.isEvery('programmingLanguage'); // true
      languagesKnownByMe.isEvery('programmingLanguage'); // false
      ```
       @method isEvery
      @param {String} key the property to test
      @param {String} [value] optional value to test against. Defaults to `true`
      @return {Boolean}
      @since 1.3.0
      @public
    */
    isEvery: function isEvery() {
      return _every(this, iter.apply(void 0, arguments));
    },

    /**
      The any() method executes the callback function once for each element
      present in the array until it finds the one where callback returns a truthy
      value (i.e. `true`). If such an element is found, any() immediately returns
      true. Otherwise, any() returns false.
       ```javascript
      function(item, index, array);
      ```
       - `item` is the current item in the iteration.
      - `index` is the current index in the iteration.
      - `array` is the array object itself.
       Note that in addition to a callback, you can also pass an optional target
      object that will be set as `this` on the context. It can be a good way
      to give your iterator function access to an object in cases where an ES6
      arrow function would not be appropriate.
       Usage Example:
       ```javascript
      let includesManager = people.any(this.findPersonInManagersList, this);
       let includesStockHolder = people.any(person => {
        return this.findPersonInStockHoldersList(person)
      });
       if (includesManager || includesStockHolder) {
        Paychecks.addBiggerBonus();
      }
      ```
       @method any
      @param {Function} callback The callback to execute
      @param {Object} [target] The target object to use
      @return {Boolean} `true` if the passed function returns `true` for any item
      @public
    */
    any: function any(callback, target) {
      if (target === void 0) {
        target = null;
      }

      (false && !(typeof callback === 'function') && (0, _debug.assert)('`any` expects a function as first argument.', typeof callback === 'function'));
      return _any(this, callback, target);
    },

    /**
      Returns `true` if the passed property resolves to the value of the second
      argument for any item in the array. This method is often simpler/faster
      than using a callback.
       Example usage:
       ```javascript
      const food = [
        { food: 'apple', isFruit: true },
        { food: 'bread', isFruit: false },
        { food: 'banana', isFruit: true }
      ];
       food.isAny('isFruit'); // true
      ```
       @method isAny
      @param {String} key the property to test
      @param {String} [value] optional value to test against. Defaults to `true`
      @return {Boolean}
      @since 1.3.0
      @public
    */
    isAny: function isAny() {
      return _any(this, iter.apply(void 0, arguments));
    },

    /**
      This will combine the values of the array into a single value. It
      is a useful way to collect a summary value from an array. This
      corresponds to the `reduce()` method defined in JavaScript 1.8.
       The callback method you provide should have the following signature (all
      parameters are optional):
       ```javascript
      function(previousValue, item, index, array);
      ```
       - `previousValue` is the value returned by the last call to the iterator.
      - `item` is the current item in the iteration.
      - `index` is the current index in the iteration.
      - `array` is the array itself.
       Return the new cumulative value.
       In addition to the callback you can also pass an `initialValue`. An error
      will be raised if you do not pass an initial value and the enumerator is
      empty.
       Note that unlike the other methods, this method does not allow you to
      pass a target object to set as this for the callback. It's part of the
      spec. Sorry.
       Example Usage:
       ```javascript
        let numbers = [1, 2, 3, 4, 5];
         numbers.reduce(function(summation, current) {
          return summation + current;
        }); // 15 (1 + 2 + 3 + 4 + 5)
         numbers.reduce(function(summation, current) {
          return summation + current;
        }, -15); // 0 (-15 + 1 + 2 + 3 + 4 + 5)
          let binaryValues = [true, false, false];
         binaryValues.reduce(function(truthValue, current) {
          return truthValue && current;
        }); // false (true && false && false)
      ```
       @method reduce
      @param {Function} callback The callback to execute
      @param {Object} initialValue Initial value for the reduce
      @return {Object} The reduced value.
      @public
    */
    reduce: function reduce(callback, initialValue) {
      (false && !(typeof callback === 'function') && (0, _debug.assert)('`reduce` expects a function as first argument.', typeof callback === 'function'));
      var ret = initialValue;
      this.forEach(function (item, i) {
        ret = callback(ret, item, i, this);
      }, this);
      return ret;
    },

    /**
      Invokes the named method on every object in the receiver that
      implements it. This method corresponds to the implementation in
      Prototype 1.6.
       ```javascript
      class Person {
        name = null;
         constructor(name) {
          this.name = name;
        }
         greet(prefix='Hello') {
          return `${prefix} ${this.name}`;
        }
      }
       let people = [new Person('Joe'), new Person('Matt')];
       people.invoke('greet'); // ['Hello Joe', 'Hello Matt']
      people.invoke('greet', 'Bonjour'); // ['Bonjour Joe', 'Bonjour Matt']
      ```
       @method invoke
      @param {String} methodName the name of the method
      @param {Object...} args optional arguments to pass as well.
      @return {Array} return values from calling invoke.
      @public
    */
    invoke: function invoke(methodName) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var ret = _A2();

      this.forEach(function (item) {
        var _item$methodName;

        return ret.push((_item$methodName = item[methodName]) == null ? void 0 : _item$methodName.call.apply(_item$methodName, [item].concat(args)));
      });
      return ret;
    },

    /**
      Simply converts the object into a genuine array. The order is not
      guaranteed. Corresponds to the method implemented by Prototype.
       @method toArray
      @return {Array} the object as an array.
      @public
    */
    toArray: function toArray() {
      return this.map(function (item) {
        return item;
      });
    },

    /**
      Returns a copy of the array with all `null` and `undefined` elements removed.
       ```javascript
      let arr = ['a', null, 'c', undefined];
      arr.compact();  // ['a', 'c']
      ```
       @method compact
      @return {Array} the array without null and undefined elements.
      @public
    */
    compact: function compact() {
      return this.filter(function (value) {
        return value != null;
      });
    },

    /**
      Used to determine if the array contains the passed object.
      Returns `true` if found, `false` otherwise.
       The optional `startAt` argument can be used to pass a starting
      index to search from, effectively slicing the searchable portion
      of the array. If it's negative it will add the array length to
      the startAt value passed in as the index to search from. If less
      than or equal to `-1 * array.length` the entire array is searched.
       This method has the same behavior of JavaScript's [Array.includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes).
       ```javascript
      [1, 2, 3].includes(2);     // true
      [1, 2, 3].includes(4);     // false
      [1, 2, 3].includes(3, 2);  // true
      [1, 2, 3].includes(3, 3);  // false
      [1, 2, 3].includes(3, -1); // true
      [1, 2, 3].includes(1, -1); // false
      [1, 2, 3].includes(1, -4); // true
      [1, 2, NaN].includes(NaN); // true
      ```
       @method includes
      @param {Object} object The object to search for.
      @param {Number} startAt optional starting location to search, default 0
      @return {Boolean} `true` if object is found in the array.
      @public
    */
    includes: function includes(object, startAt) {
      return _indexOf(this, object, startAt, true) !== -1;
    },

    /**
      Sorts the array by the keys specified in the argument.
       You may provide multiple arguments to sort by multiple properties.
       ```javascript
     let colors = [
       { name: 'red', weight: 500 },
       { name: 'green', weight: 600 },
       { name: 'blue', weight: 500 }
      ];
      colors.sortBy('name');
     // [{name: 'blue', weight: 500}, {name: 'green', weight: 600}, {name: 'red', weight: 500}]
      colors.sortBy('weight', 'name');
     // [{name: 'blue', weight: 500}, {name: 'red', weight: 500}, {name: 'green', weight: 600}]
     ```
       @method sortBy
      @param {String} property name(s) to sort on
      @return {Array} The sorted array.
      @since 1.2.0
      @public
    */
    sortBy: function sortBy() {
      var sortKeys = arguments;
      return this.toArray().sort(function (a, b) {
        for (var i = 0; i < sortKeys.length; i++) {
          var key = sortKeys[i];
          var propA = (0, _metal.get)(a, key);
          var propB = (0, _metal.get)(b, key); // return 1 or -1 else continue to the next sortKey

          var compareValue = (0, _compare.default)(propA, propB);

          if (compareValue) {
            return compareValue;
          }
        }

        return 0;
      });
    },

    /**
      Returns a new array that contains only unique values. The default
      implementation returns an array regardless of the receiver type.
       ```javascript
      let arr = ['a', 'a', 'b', 'b'];
      arr.uniq();  // ['a', 'b']
      ```
       This only works on primitive data types, e.g. Strings, Numbers, etc.
       @method uniq
      @return {EmberArray}
      @public
    */
    uniq: function uniq() {
      return _uniqBy(this);
    },

    /**
      Returns a new array that contains only items containing a unique property value.
      The default implementation returns an array regardless of the receiver type.
       ```javascript
      let arr = [{ value: 'a' }, { value: 'a' }, { value: 'b' }, { value: 'b' }];
      arr.uniqBy('value');  // [{ value: 'a' }, { value: 'b' }]
       let arr = [2.2, 2.1, 3.2, 3.3];
      arr.uniqBy(Math.floor);  // [2.2, 3.2];
      ```
       @method uniqBy
      @param {String,Function} key
      @return {EmberArray}
      @public
    */
    uniqBy: function uniqBy(key) {
      return _uniqBy(this, key);
    },

    /**
      Returns a new array that excludes the passed value. The default
      implementation returns an array regardless of the receiver type.
      If the receiver does not contain the value it returns the original array.
       ```javascript
      let arr = ['a', 'b', 'a', 'c'];
      arr.without('a');  // ['b', 'c']
      ```
       @method without
      @param {Object} value
      @return {EmberArray}
      @public
    */
    without: function without(value) {
      if (!this.includes(value)) {
        return this; // nothing to do
      } // SameValueZero comparison (NaN !== NaN)


      var predicate = value === value ? function (item) {
        return item !== value;
      } : function (item) {
        return item === item;
      };
      return this.filter(predicate);
    }
  });
  /**
    This mixin defines the API for modifying array-like objects. These methods
    can be applied only to a collection that keeps its items in an ordered set.
    It builds upon the Array mixin and adds methods to modify the array.
    One concrete implementations of this class include ArrayProxy.
  
    It is important to use the methods in this class to modify arrays so that
    changes are observable. This allows the binding system in Ember to function
    correctly.
  
  
    Note that an Array can change even if it does not implement this mixin.
    For example, one might implement a SparseArray that cannot be directly
    modified, but if its underlying enumerable changes, it will change also.
  
    @class MutableArray
    @uses EmberArray
    @uses MutableEnumerable
    @public
  */


  var MutableArray = _metal.Mixin.create(ArrayMixin, _mutable_enumerable.default, {
    /**
      __Required.__ You must implement this method to apply this mixin.
       This is one of the primitives you must implement to support `Array`.
      You should replace amt objects started at idx with the objects in the
      passed array. You should also call `this.arrayContentDidChange()`
       Note that this method is expected to validate the type(s) of objects that it expects.
       @method replace
      @param {Number} idx Starting index in the array to replace. If
        idx >= length, then append to the end of the array.
      @param {Number} amt Number of elements that should be removed from
        the array, starting at *idx*.
      @param {EmberArray} objects An array of zero or more objects that should be
        inserted into the array at *idx*
      @public
    */

    /**
      Remove all elements from the array. This is useful if you
      want to reuse an existing array without having to recreate it.
       ```javascript
      let colors = ['red', 'green', 'blue'];
       colors.length;  // 3
      colors.clear(); // []
      colors.length;  // 0
      ```
       @method clear
      @return {Array} An empty Array.
      @public
    */
    clear: function clear() {
      var len = this.length;

      if (len === 0) {
        return this;
      }

      this.replace(0, len, EMPTY_ARRAY);
      return this;
    },

    /**
      This will use the primitive `replace()` method to insert an object at the
      specified index.
       ```javascript
      let colors = ['red', 'green', 'blue'];
       colors.insertAt(2, 'yellow');  // ['red', 'green', 'yellow', 'blue']
      colors.insertAt(5, 'orange');  // Error: Index out of range
      ```
       @method insertAt
      @param {Number} idx index of insert the object at.
      @param {Object} object object to insert
      @return {EmberArray} receiver
      @public
    */
    insertAt: function insertAt(idx, object) {
      _insertAt(this, idx, object);

      return this;
    },

    /**
      Remove an object at the specified index using the `replace()` primitive
      method. You can pass either a single index, or a start and a length.
       If you pass a start and length that is beyond the
      length this method will throw an assertion.
       ```javascript
      let colors = ['red', 'green', 'blue', 'yellow', 'orange'];
       colors.removeAt(0);     // ['green', 'blue', 'yellow', 'orange']
      colors.removeAt(2, 2);  // ['green', 'blue']
      colors.removeAt(4, 2);  // Error: Index out of range
      ```
       @method removeAt
      @param {Number} start index, start of range
      @param {Number} len length of passing range
      @return {EmberArray} receiver
      @public
    */
    removeAt: function removeAt(start, len) {
      return _removeAt(this, start, len);
    },

    /**
      Push the object onto the end of the array. Works just like `push()` but it
      is KVO-compliant.
       ```javascript
      let colors = ['red', 'green'];
       colors.pushObject('black');     // ['red', 'green', 'black']
      colors.pushObject(['yellow']);  // ['red', 'green', ['yellow']]
      ```
       @method pushObject
      @param {*} obj object to push
      @return object same object passed as a param
      @public
    */
    pushObject: function pushObject(obj) {
      return _insertAt(this, this.length, obj);
    },

    /**
      Add the objects in the passed array to the end of the array. Defers
      notifying observers of the change until all objects are added.
       ```javascript
      let colors = ['red'];
       colors.pushObjects(['yellow', 'orange']);  // ['red', 'yellow', 'orange']
      ```
       @method pushObjects
      @param {EmberArray} objects the objects to add
      @return {EmberArray} receiver
      @public
    */
    pushObjects: function pushObjects(objects) {
      this.replace(this.length, 0, objects);
      return this;
    },

    /**
      Pop object from array or nil if none are left. Works just like `pop()` but
      it is KVO-compliant.
       ```javascript
      let colors = ['red', 'green', 'blue'];
       colors.popObject();   // 'blue'
      console.log(colors);  // ['red', 'green']
      ```
       @method popObject
      @return object
      @public
    */
    popObject: function popObject() {
      var len = this.length;

      if (len === 0) {
        return null;
      }

      var ret = (0, _metal.objectAt)(this, len - 1);
      this.removeAt(len - 1, 1);
      return ret;
    },

    /**
      Shift an object from start of array or nil if none are left. Works just
      like `shift()` but it is KVO-compliant.
       ```javascript
      let colors = ['red', 'green', 'blue'];
       colors.shiftObject();  // 'red'
      console.log(colors);   // ['green', 'blue']
      ```
       @method shiftObject
      @return object
      @public
    */
    shiftObject: function shiftObject() {
      if (this.length === 0) {
        return null;
      }

      var ret = (0, _metal.objectAt)(this, 0);
      this.removeAt(0);
      return ret;
    },

    /**
      Unshift an object to start of array. Works just like `unshift()` but it is
      KVO-compliant.
       ```javascript
      let colors = ['red'];
       colors.unshiftObject('yellow');    // ['yellow', 'red']
      colors.unshiftObject(['black']);   // [['black'], 'yellow', 'red']
      ```
       @method unshiftObject
      @param {*} obj object to unshift
      @return object same object passed as a param
      @public
    */
    unshiftObject: function unshiftObject(obj) {
      return _insertAt(this, 0, obj);
    },

    /**
      Adds the named objects to the beginning of the array. Defers notifying
      observers until all objects have been added.
       ```javascript
      let colors = ['red'];
       colors.unshiftObjects(['black', 'white']);   // ['black', 'white', 'red']
      colors.unshiftObjects('yellow'); // Type Error: 'undefined' is not a function
      ```
       @method unshiftObjects
      @param {Enumberable} objects the objects to add
      @return {EmberArray} receiver
      @public
    */
    unshiftObjects: function unshiftObjects(objects) {
      this.replace(0, 0, objects);
      return this;
    },

    /**
      Reverse objects in the array. Works just like `reverse()` but it is
      KVO-compliant.
       @method reverseObjects
      @return {EmberArray} receiver
       @public
    */
    reverseObjects: function reverseObjects() {
      var len = this.length;

      if (len === 0) {
        return this;
      }

      var objects = this.toArray().reverse();
      this.replace(0, len, objects);
      return this;
    },

    /**
      Replace all the receiver's content with content of the argument.
      If argument is an empty array receiver will be cleared.
       ```javascript
      let colors = ['red', 'green', 'blue'];
       colors.setObjects(['black', 'white']);  // ['black', 'white']
      colors.setObjects([]);                  // []
      ```
       @method setObjects
      @param {EmberArray} objects array whose content will be used for replacing
          the content of the receiver
      @return {EmberArray} receiver with the new content
      @public
    */
    setObjects: function setObjects(objects) {
      if (objects.length === 0) {
        return this.clear();
      }

      var len = this.length;
      this.replace(0, len, objects);
      return this;
    },

    /**
      Remove all occurrences of an object in the array.
       ```javascript
      let cities = ['Chicago', 'Berlin', 'Lima', 'Chicago'];
       cities.removeObject('Chicago');  // ['Berlin', 'Lima']
      cities.removeObject('Lima');     // ['Berlin']
      cities.removeObject('Tokyo')     // ['Berlin']
      ```
       @method removeObject
      @param {*} obj object to remove
      @return {EmberArray} receiver
      @public
    */
    removeObject: function removeObject(obj) {
      var loc = this.length || 0;

      while (--loc >= 0) {
        var curObject = (0, _metal.objectAt)(this, loc);

        if (curObject === obj) {
          this.removeAt(loc);
        }
      }

      return this;
    },

    /**
      Removes each object in the passed array from the receiver.
       @method removeObjects
      @param {EmberArray} objects the objects to remove
      @return {EmberArray} receiver
      @public
    */
    removeObjects: function removeObjects(objects) {
      (0, _metal.beginPropertyChanges)();

      for (var i = objects.length - 1; i >= 0; i--) {
        this.removeObject(objects[i]);
      }

      (0, _metal.endPropertyChanges)();
      return this;
    },

    /**
      Push the object onto the end of the array if it is not already
      present in the array.
       ```javascript
      let cities = ['Chicago', 'Berlin'];
       cities.addObject('Lima');    // ['Chicago', 'Berlin', 'Lima']
      cities.addObject('Berlin');  // ['Chicago', 'Berlin', 'Lima']
      ```
       @method addObject
      @param {*} obj object to add, if not already present
      @return {EmberArray} receiver
      @public
    */
    addObject: function addObject(obj) {
      var included = this.includes(obj);

      if (!included) {
        this.pushObject(obj);
      }

      return this;
    },

    /**
      Adds each object in the passed array to the receiver.
       @method addObjects
      @param {EmberArray} objects the objects to add.
      @return {EmberArray} receiver
      @public
    */
    addObjects: function addObjects(objects) {
      var _this2 = this;

      (0, _metal.beginPropertyChanges)();
      objects.forEach(function (obj) {
        return _this2.addObject(obj);
      });
      (0, _metal.endPropertyChanges)();
      return this;
    }
  });
  /**
    Creates an `Ember.NativeArray` from an Array-like object.
    Does not modify the original object's contents. `A()` is not needed if
    `EmberENV.EXTEND_PROTOTYPES` is `true` (the default value). However,
    it is recommended that you use `A()` when creating addons for
    ember or when you can not guarantee that `EmberENV.EXTEND_PROTOTYPES`
    will be `true`.
  
    Example
  
    ```app/components/my-component.js
    import Component from '@ember/component';
    import { A } from '@ember/array';
  
    export default Component.extend({
      tagName: 'ul',
      classNames: ['pagination'],
  
      init() {
        this._super(...arguments);
  
        if (!this.get('content')) {
          this.set('content', A());
          this.set('otherContent', A([1,2,3]));
        }
      }
    });
    ```
  
    @method A
    @static
    @for @ember/array
    @return {Ember.NativeArray}
    @public
  */
  // Add Ember.Array to Array.prototype. Remove methods with native
  // implementations and supply some more optimized versions of generic methods
  // because they are so common.

  /**
  @module ember
  */

  /**
    The NativeArray mixin contains the properties needed to make the native
    Array support MutableArray and all of its dependent APIs. Unless you
    have `EmberENV.EXTEND_PROTOTYPES` or `EmberENV.EXTEND_PROTOTYPES.Array` set to
    false, this will be applied automatically. Otherwise you can apply the mixin
    at anytime by calling `Ember.NativeArray.apply(Array.prototype)`.
  
    @class Ember.NativeArray
    @uses MutableArray
    @uses Observable
    @public
  */


  _exports.MutableArray = MutableArray;

  var NativeArray = _metal.Mixin.create(MutableArray, _observable.default, {
    objectAt: function objectAt(idx) {
      return this[idx];
    },
    // primitive for array support.
    replace: function replace(start, deleteCount, items) {
      if (items === void 0) {
        items = EMPTY_ARRAY;
      }

      (false && !(Array.isArray(items)) && (0, _debug.assert)('The third argument to replace needs to be an array.', Array.isArray(items)));
      (0, _metal.replaceInNativeArray)(this, start, deleteCount, items);
      return this;
    }
  }); // Remove any methods implemented natively so we don't override them


  _exports.NativeArray = NativeArray;
  var ignore = ['length'];
  NativeArray.keys().forEach(function (methodName) {
    if (Array.prototype[methodName]) {
      ignore.push(methodName);
    }
  });
  _exports.NativeArray = NativeArray = (_NativeArray = NativeArray).without.apply(_NativeArray, ignore);

  var _A2;

  _exports.A = _A2;

  if (_environment.ENV.EXTEND_PROTOTYPES.Array) {
    NativeArray.apply(Array.prototype, true);

    _exports.A = _A2 = function A(arr) {
      (false && !(!(this instanceof _A2)) && (0, _debug.assert)('You cannot create an Ember Array with `new A()`, please update to calling A as a function: `A()`', !(this instanceof _A2)));
      return arr || [];
    };
  } else {
    _exports.A = _A2 = function _A(arr) {
      (false && !(!(this instanceof _A2)) && (0, _debug.assert)('You cannot create an Ember Array with `new A()`, please update to calling A as a function: `A()`', !(this instanceof _A2)));

      if (!arr) {
        arr = [];
      }

      return ArrayMixin.detect(arr) ? arr : NativeArray.apply(arr);
    };
  }

  var _default = ArrayMixin;
  _exports.default = _default;
});