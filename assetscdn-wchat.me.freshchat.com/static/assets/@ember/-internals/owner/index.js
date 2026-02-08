define("@ember/-internals/owner/index", ["exports", "@glimmer/owner", "@ember/-internals/utils", "@ember/debug"], function (_exports, _owner, _utils, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.LEGACY_OWNER = void 0;
  _exports.getOwner = getOwner;
  _exports.setOwner = setOwner;
  var LEGACY_OWNER = (0, _utils.enumerableSymbol)('LEGACY_OWNER');
  /**
    Framework objects in an Ember application (components, services, routes, etc.)
    are created via a factory and dependency injection system. Each of these
    objects is the responsibility of an "owner", which handled its
    instantiation and manages its lifetime.
  
    `getOwner` fetches the owner object responsible for an instance. This can
    be used to lookup or resolve other class instances, or register new factories
    into the owner.
  
    For example, this component dynamically looks up a service based on the
    `audioType` passed as an argument:
  
    ```app/components/play-audio.js
    import Component from '@glimmer/component';
    import { action } from '@ember/object';
    import { getOwner } from '@ember/application';
  
    // Usage:
    //
    //   <PlayAudio @audioType={{@model.audioType}} @audioFile={{@model.file}}/>
    //
    export default class extends Component {
      get audioService() {
        let owner = getOwner(this);
        return owner.lookup(`service:${this.args.audioType}`);
      }
  
      @action
      onPlay() {
        let player = this.audioService;
        player.play(this.args.audioFile);
      }
    }
    ```
  
    @method getOwner
    @static
    @for @ember/application
    @param {Object} object An object with an owner.
    @return {Object} An owner object.
    @since 2.3.0
    @public
  */

  _exports.LEGACY_OWNER = LEGACY_OWNER;

  function getOwner(object) {
    var owner = (0, _owner.getOwner)(object);

    if (owner === undefined) {
      owner = object[LEGACY_OWNER];
      (false && !(owner === undefined) && (0, _debug.deprecate)("You accessed the owner using `getOwner` on an object, but it was not set on that object with `setOwner`. You must use `setOwner` to set the owner on all objects. You cannot use Object.assign().", owner === undefined, {
        id: 'owner.legacy-owner-injection',
        until: '3.25.0',
        for: 'ember-source',
        since: {
          enabled: '3.22.0'
        }
      }));
    }

    return owner;
  }
  /**
    `setOwner` forces a new owner on a given object instance. This is primarily
    useful in some testing cases.
  
    @method setOwner
    @static
    @for @ember/application
    @param {Object} object An object instance.
    @param {Object} object The new owner object of the object instance.
    @since 2.3.0
    @public
  */


  function setOwner(object, owner) {
    (0, _owner.setOwner)(object, owner);
    object[LEGACY_OWNER] = owner;
  }
});