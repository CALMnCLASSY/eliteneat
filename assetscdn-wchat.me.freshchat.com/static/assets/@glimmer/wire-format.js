define("@glimmer/wire-format", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getStringFromValue = getStringFromValue;
  _exports.is = is;
  _exports.isArgument = isArgument;
  _exports.isAttribute = isAttribute;
  _exports.isGet = _exports.isFlushElement = void 0;
  _exports.isHelper = isHelper;
  _exports.isStringLiteral = isStringLiteral;

  function is(variant) {
    return function (value) {
      return Array.isArray(value) && value[0] === variant;
    };
  } // Statements


  var isFlushElement = is(12
  /* FlushElement */
  );
  _exports.isFlushElement = isFlushElement;

  function isAttribute(val) {
    return val[0] === 14
    /* StaticAttr */
    || val[0] === 15
    /* DynamicAttr */
    || val[0] === 22
    /* TrustingDynamicAttr */
    || val[0] === 16
    /* ComponentAttr */
    || val[0] === 24
    /* StaticComponentAttr */
    || val[0] === 23
    /* TrustingComponentAttr */
    || val[0] === 17
    /* AttrSplat */
    || val[0] === 4
    /* Modifier */
    ;
  }

  function isStringLiteral(expr) {
    return typeof expr === 'string';
  }

  function getStringFromValue(expr) {
    return expr;
  }

  function isArgument(val) {
    return val[0] === 21
    /* StaticArg */
    || val[0] === 20
    /* DynamicArg */
    ;
  }

  function isHelper(expr) {
    return Array.isArray(expr) && expr[0] === 28
    /* Call */
    ;
  } // Expressions


  var isGet = is(30
  /* GetSymbol */
  );
  _exports.isGet = isGet;
});