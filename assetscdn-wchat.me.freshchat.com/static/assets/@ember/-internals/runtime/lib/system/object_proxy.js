define("@ember/-internals/runtime/lib/system/object_proxy", ["exports", "ember-babel", "@ember/-internals/runtime/lib/system/object", "@ember/-internals/runtime/lib/mixins/-proxy"], function (_exports, _emberBabel, _object, _proxy) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /**
    `ObjectProxy` forwards all properties not defined by the proxy itself
    to a proxied `content` object.
  
    ```javascript
    import EmberObject from '@ember/object';
    import ObjectProxy from '@ember/object/proxy';
  
    let exampleObject = EmberObject.create({
      name: 'Foo'
    });
  
    let exampleProxy = ObjectProxy.create({
      content: exampleObject
    });
  
    // Access and change existing properties
    exampleProxy.get('name');          // 'Foo'
    exampleProxy.set('name', 'Bar');
    exampleObject.get('name');         // 'Bar'
  
    // Create new 'description' property on `exampleObject`
    exampleProxy.set('description', 'Foo is a whizboo baz');
    exampleObject.get('description');  // 'Foo is a whizboo baz'
    ```
  
    While `content` is unset, setting a property to be delegated will throw an
    Error.
  
    ```javascript
    import ObjectProxy from '@ember/object/proxy';
  
    let exampleProxy = ObjectProxy.create({
      content: null,
      flag: null
    });
    exampleProxy.set('flag', true);
    exampleProxy.get('flag');         // true
    exampleProxy.get('foo');          // undefined
    exampleProxy.set('foo', 'data');  // throws Error
    ```
  
    Delegated properties can be bound to and will change when content is updated.
  
    Computed properties on the proxy itself can depend on delegated properties.
  
    ```javascript
    import { computed } from '@ember/object';
    import ObjectProxy from '@ember/object/proxy';
  
    ProxyWithComputedProperty = ObjectProxy.extend({
      fullName: computed('firstName', 'lastName', function() {
        var firstName = this.get('firstName'),
            lastName = this.get('lastName');
        if (firstName && lastName) {
          return firstName + ' ' + lastName;
        }
        return firstName || lastName;
      })
    });
  
    let exampleProxy = ProxyWithComputedProperty.create();
  
    exampleProxy.get('fullName');  // undefined
    exampleProxy.set('content', {
      firstName: 'Tom', lastName: 'Dale'
    }); // triggers property change for fullName on proxy
  
    exampleProxy.get('fullName');  // 'Tom Dale'
    ```
  
    @class ObjectProxy
    @extends EmberObject
    @uses Ember.ProxyMixin
    @public
  */
  var ObjectProxy = /*#__PURE__*/function (_FrameworkObject) {
    (0, _emberBabel.inheritsLoose)(ObjectProxy, _FrameworkObject);

    function ObjectProxy() {
      return _FrameworkObject.apply(this, arguments) || this;
    }

    return ObjectProxy;
  }(_object.default);

  _exports.default = ObjectProxy;
  ObjectProxy.PrototypeMixin.reopen(_proxy.default);
});