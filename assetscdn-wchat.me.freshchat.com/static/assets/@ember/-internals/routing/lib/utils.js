define("@ember/-internals/routing/lib/utils", ["exports", "@ember/-internals/metal", "@ember/-internals/owner", "@ember/debug", "@ember/error", "@ember/polyfills", "router_js"], function (_exports, _metal, _owner, _debug, _error, _polyfills, _router_js) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.calculateCacheKey = calculateCacheKey;
  _exports.deprecateTransitionMethods = deprecateTransitionMethods;
  _exports.extractRouteArgs = extractRouteArgs;
  _exports.getActiveTargetName = getActiveTargetName;
  _exports.normalizeControllerQueryParams = normalizeControllerQueryParams;
  _exports.prefixRouteNameArg = prefixRouteNameArg;
  _exports.resemblesURL = resemblesURL;
  _exports.shallowEqual = shallowEqual;
  _exports.stashParamNames = stashParamNames;
  var ALL_PERIODS_REGEX = /\./g;

  function extractRouteArgs(args) {
    args = args.slice();
    var possibleQueryParams = args[args.length - 1];
    var queryParams;

    if (possibleQueryParams && Object.prototype.hasOwnProperty.call(possibleQueryParams, 'queryParams')) {
      // SAFETY: this cast is safe because we have just checked whether
      // `possibleQueryParams` -- defined as the last item in args -- both exists
      // and has the property `queryParams`. If either of these invariants change,
      // ***this is unsafe and should be changed***.
      queryParams = args.pop().queryParams;
    } else {
      queryParams = {};
    } // UNSAFE: these are simply assumed as the existing behavior of the system.
    // However, this could break if upstream refactors change it, and the types
    // here would not be able to tell us; we would lie to everything downstream.


    var routeName = args.shift();
    var models = args;
    return {
      routeName: routeName,
      models: models,
      queryParams: queryParams
    };
  }

  function getActiveTargetName(router) {
    var routeInfos = router.activeTransition ? router.activeTransition[_router_js.STATE_SYMBOL].routeInfos : router.state.routeInfos;
    return routeInfos[routeInfos.length - 1].name;
  }

  function stashParamNames(router, routeInfos) {
    if (routeInfos['_namesStashed']) {
      return;
    } // This helper exists because router.js/route-recognizer.js awkwardly
    // keeps separate a routeInfo's list of parameter names depending
    // on whether a URL transition or named transition is happening.
    // Hopefully we can remove this in the future.


    var targetRouteName = routeInfos[routeInfos.length - 1].name;

    var recogHandlers = router._routerMicrolib.recognizer.handlersFor(targetRouteName);

    var dynamicParent;

    for (var i = 0; i < routeInfos.length; ++i) {
      var routeInfo = routeInfos[i];
      var names = recogHandlers[i].names;

      if (names.length) {
        dynamicParent = routeInfo;
      }

      routeInfo['_names'] = names;
      var route = routeInfo.route;

      route._stashNames(routeInfo, dynamicParent);
    }

    routeInfos['_namesStashed'] = true;
  }

  function _calculateCacheValuePrefix(prefix, part) {
    // calculates the dot separated sections from prefix that are also
    // at the start of part - which gives us the route name
    // given : prefix = site.article.comments, part = site.article.id
    //      - returns: site.article (use get(values[site.article], 'id') to get the dynamic part - used below)
    // given : prefix = site.article, part = site.article.id
    //      - returns: site.article. (use get(values[site.article], 'id') to get the dynamic part - used below)
    var prefixParts = prefix.split('.');
    var currPrefix = '';

    for (var i = 0; i < prefixParts.length; i++) {
      var currPart = prefixParts.slice(0, i + 1).join('.');

      if (part.indexOf(currPart) !== 0) {
        break;
      }

      currPrefix = currPart;
    }

    return currPrefix;
  }
  /*
    Stolen from Controller
  */


  function calculateCacheKey(prefix, parts, values) {
    if (parts === void 0) {
      parts = [];
    }

    var suffixes = '';

    for (var i = 0; i < parts.length; ++i) {
      var part = parts[i];

      var cacheValuePrefix = _calculateCacheValuePrefix(prefix, part);

      var value = void 0;

      if (values) {
        if (cacheValuePrefix && cacheValuePrefix in values) {
          var partRemovedPrefix = part.indexOf(cacheValuePrefix) === 0 ? part.substr(cacheValuePrefix.length + 1) : part;
          value = (0, _metal.get)(values[cacheValuePrefix], partRemovedPrefix);
        } else {
          value = (0, _metal.get)(values, part);
        }
      }

      suffixes += "::" + part + ":" + value;
    }

    return prefix + suffixes.replace(ALL_PERIODS_REGEX, '-');
  }
  /*
    Controller-defined query parameters can come in three shapes:
  
    Array
      queryParams: ['foo', 'bar']
    Array of simple objects where value is an alias
      queryParams: [
        {
          'foo': 'rename_foo_to_this'
        },
        {
          'bar': 'call_bar_this_instead'
        }
      ]
    Array of fully defined objects
      queryParams: [
        {
          'foo': {
            as: 'rename_foo_to_this'
          },
        }
        {
          'bar': {
            as: 'call_bar_this_instead',
            scope: 'controller'
          }
        }
      ]
  
    This helper normalizes all three possible styles into the
    'Array of fully defined objects' style.
  */


  function normalizeControllerQueryParams(queryParams) {
    var qpMap = {};

    for (var i = 0; i < queryParams.length; ++i) {
      accumulateQueryParamDescriptors(queryParams[i], qpMap);
    }

    return qpMap;
  }

  function accumulateQueryParamDescriptors(_desc, accum) {
    var desc = _desc;
    var tmp;

    if (typeof desc === 'string') {
      tmp = {};
      tmp[desc] = {
        as: null
      };
      desc = tmp;
    }

    for (var key in desc) {
      if (!Object.prototype.hasOwnProperty.call(desc, key)) {
        return;
      }

      var singleDesc = desc[key];

      if (typeof singleDesc === 'string') {
        singleDesc = {
          as: singleDesc
        };
      }

      tmp = accum[key] || {
        as: null,
        scope: 'model'
      };
      (0, _polyfills.assign)(tmp, singleDesc);
      accum[key] = tmp;
    }
  }
  /*
    Check if a routeName resembles a url instead
  
    @private
  */


  function resemblesURL(str) {
    return typeof str === 'string' && (str === '' || str[0] === '/');
  }
  /*
    Returns an arguments array where the route name arg is prefixed based on the mount point
  
    @private
  */


  function prefixRouteNameArg(route, args) {
    var routeName = args[0];
    var owner = (0, _owner.getOwner)(route);
    var prefix = owner.mountPoint; // only alter the routeName if it's actually referencing a route.

    if (owner.routable && typeof routeName === 'string') {
      if (resemblesURL(routeName)) {
        throw new _error.default('Programmatic transitions by URL cannot be used within an Engine. Please use the route name instead.');
      } else {
        routeName = prefix + "." + routeName;
        args[0] = routeName;
      }
    }

    return args;
  }

  function shallowEqual(a, b) {
    var k;
    var aCount = 0;
    var bCount = 0;

    for (k in a) {
      if (Object.prototype.hasOwnProperty.call(a, k)) {
        if (a[k] !== b[k]) {
          return false;
        }

        aCount++;
      }
    }

    for (k in b) {
      if (Object.prototype.hasOwnProperty.call(b, k)) {
        bCount++;
      }
    }

    return aCount === bCount;
  }

  function deprecateTransitionMethods(frameworkClass, methodName) {
    (false && !(false) && (0, _debug.deprecate)("Calling " + methodName + " on a " + frameworkClass + " is deprecated. Use the RouterService instead.", false, {
      id: 'routing.transition-methods',
      for: 'ember-source',
      since: {
        enabled: '3.26.0'
      },
      until: '4.0.0',
      url: 'https://deprecations.emberjs.com/v3.x/#toc_routing-transition-methods'
    }));
  }
});