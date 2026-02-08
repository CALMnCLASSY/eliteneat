define("@simple-dom/document", ["exports", "ember-babel"], function (_exports, _emberBabel) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var EMPTY_ATTRS = [];

  function indexOfAttribute(attributes, namespaceURI, localName) {
    for (var i = 0; i < attributes.length; i++) {
      var attr = attributes[i];

      if (attr.namespaceURI === namespaceURI && attr.localName === localName) {
        return i;
      }
    }

    return -1;
  }

  function adjustAttrName(namespaceURI, localName) {
    return namespaceURI === "http://www.w3.org/1999/xhtml"
    /* HTML */
    ? localName.toLowerCase() : localName;
  }

  function _getAttribute(attributes, namespaceURI, localName) {
    var index = indexOfAttribute(attributes, namespaceURI, localName);
    return index === -1 ? null : attributes[index].value;
  }

  function _removeAttribute(attributes, namespaceURI, localName) {
    var index = indexOfAttribute(attributes, namespaceURI, localName);

    if (index !== -1) {
      attributes.splice(index, 1);
    }
  } // https://dom.spec.whatwg.org/#dom-element-setattributens


  function _setAttribute(element, namespaceURI, prefix, localName, value) {
    if (typeof value !== 'string') {
      value = '' + value;
    }

    var attributes = element.attributes;

    if (attributes === EMPTY_ATTRS) {
      attributes = element.attributes = [];
    } else {
      var index = indexOfAttribute(attributes, namespaceURI, localName);

      if (index !== -1) {
        attributes[index].value = value;
        return;
      }
    }

    attributes.push({
      localName: localName,
      name: prefix === null ? localName : prefix + ':' + localName,
      namespaceURI: namespaceURI,
      prefix: prefix,
      specified: true,
      value: value
    });
  }

  var ChildNodes = /*#__PURE__*/function () {
    function ChildNodes(node) {
      this.node = node;
      this.stale = true;
      this._length = 0;
    }

    var _proto = ChildNodes.prototype;

    _proto.item = function item(index) {
      return index < this.length ? this[index] : null;
    };

    (0, _emberBabel.createClass)(ChildNodes, [{
      key: "length",
      get: function get() {
        if (this.stale) {
          this.stale = false;
          var len = 0;
          var child = this.node.firstChild;

          for (; child !== null; len++) {
            this[len] = child;
            child = child.nextSibling;
          }

          var oldLen = this._length;
          this._length = len;

          for (; len < oldLen; len++) {
            delete this[len];
          }
        }

        return this._length;
      }
    }]);
    return ChildNodes;
  }();

  function _cloneNode(node, deep) {
    var clone = nodeFrom(node);

    if (deep) {
      var child = node.firstChild;
      var nextChild = child;

      while (child !== null) {
        nextChild = child.nextSibling;
        clone.appendChild(child.cloneNode(true));
        child = nextChild;
      }
    }

    return clone;
  }

  function nodeFrom(node) {
    var namespaceURI;

    if (node.nodeType === 1
    /* ELEMENT_NODE */
    ) {
      namespaceURI = node.namespaceURI;
    }

    var clone = new SimpleNodeImpl(node.ownerDocument, node.nodeType, node.nodeName, node.nodeValue, namespaceURI);

    if (node.nodeType === 1
    /* ELEMENT_NODE */
    ) {
      clone.attributes = copyAttrs(node.attributes);
    }

    return clone;
  }

  function copyAttrs(attrs) {
    if (attrs === EMPTY_ATTRS) {
      return EMPTY_ATTRS;
    }

    var copy = [];

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      copy.push({
        localName: attr.localName,
        name: attr.name,
        namespaceURI: attr.namespaceURI,
        prefix: attr.prefix,
        specified: true,
        value: attr.value
      });
    }

    return copy;
  }

  function _insertBefore(parentNode, newChild, refChild) {
    invalidate(parentNode);
    insertBetween(parentNode, newChild, refChild === null ? parentNode.lastChild : refChild.previousSibling, refChild);
  }

  function _removeChild(parentNode, oldChild) {
    invalidate(parentNode);
    removeBetween(parentNode, oldChild, oldChild.previousSibling, oldChild.nextSibling);
  }

  function invalidate(parentNode) {
    var childNodes = parentNode._childNodes;

    if (childNodes !== undefined) {
      childNodes.stale = true;
    }
  }

  function insertBetween(parentNode, newChild, previousSibling, nextSibling) {
    if (newChild.nodeType === 11
    /* DOCUMENT_FRAGMENT_NODE */
    ) {
      insertFragment(newChild, parentNode, previousSibling, nextSibling);
      return;
    }

    if (newChild.parentNode !== null) {
      _removeChild(newChild.parentNode, newChild);
    }

    newChild.parentNode = parentNode;
    newChild.previousSibling = previousSibling;
    newChild.nextSibling = nextSibling;

    if (previousSibling === null) {
      parentNode.firstChild = newChild;
    } else {
      previousSibling.nextSibling = newChild;
    }

    if (nextSibling === null) {
      parentNode.lastChild = newChild;
    } else {
      nextSibling.previousSibling = newChild;
    }
  }

  function removeBetween(parentNode, oldChild, previousSibling, nextSibling) {
    oldChild.parentNode = null;
    oldChild.previousSibling = null;
    oldChild.nextSibling = null;

    if (previousSibling === null) {
      parentNode.firstChild = nextSibling;
    } else {
      previousSibling.nextSibling = nextSibling;
    }

    if (nextSibling === null) {
      parentNode.lastChild = previousSibling;
    } else {
      nextSibling.previousSibling = previousSibling;
    }
  }

  function insertFragment(fragment, parentNode, previousSibling, nextSibling) {
    var firstChild = fragment.firstChild;

    if (firstChild === null) {
      return;
    }

    fragment.firstChild = null;
    fragment.lastChild = null;
    var lastChild = firstChild;
    var newChild = firstChild;
    firstChild.previousSibling = previousSibling;

    if (previousSibling === null) {
      parentNode.firstChild = firstChild;
    } else {
      previousSibling.nextSibling = firstChild;
    }

    while (newChild !== null) {
      newChild.parentNode = parentNode;
      lastChild = newChild;
      newChild = newChild.nextSibling;
    }

    lastChild.nextSibling = nextSibling;

    if (nextSibling === null) {
      parentNode.lastChild = lastChild;
    } else {
      nextSibling.previousSibling = lastChild;
    }
  }

  function parseQualifiedName(qualifiedName) {
    var localName = qualifiedName;
    var prefix = null;
    var i = qualifiedName.indexOf(':');

    if (i !== -1) {
      prefix = qualifiedName.slice(0, i);
      localName = qualifiedName.slice(i + 1);
    }

    return [prefix, localName];
  }

  var SimpleNodeImpl = /*#__PURE__*/function () {
    function SimpleNodeImpl(ownerDocument, nodeType, nodeName, nodeValue, namespaceURI) {
      this.ownerDocument = ownerDocument;
      this.nodeType = nodeType;
      this.nodeName = nodeName;
      this.nodeValue = nodeValue;
      this.namespaceURI = namespaceURI;
      this.parentNode = null;
      this.previousSibling = null;
      this.nextSibling = null;
      this.firstChild = null;
      this.lastChild = null;
      this.attributes = EMPTY_ATTRS;
      /**
       * @internal
       */

      this._childNodes = undefined;
    }

    var _proto2 = SimpleNodeImpl.prototype;

    _proto2.cloneNode = function cloneNode(deep) {
      return _cloneNode(this, deep === true);
    };

    _proto2.appendChild = function appendChild(newChild) {
      _insertBefore(this, newChild, null);

      return newChild;
    };

    _proto2.insertBefore = function insertBefore(newChild, refChild) {
      _insertBefore(this, newChild, refChild);

      return newChild;
    };

    _proto2.removeChild = function removeChild(oldChild) {
      _removeChild(this, oldChild);

      return oldChild;
    };

    _proto2.insertAdjacentHTML = function insertAdjacentHTML(position, html) {
      var raw = new SimpleNodeImpl(this.ownerDocument, -1
      /* RAW_NODE */
      , '#raw', html, void 0);
      var parentNode;
      var nextSibling;

      switch (position) {
        case 'beforebegin':
          parentNode = this.parentNode;
          nextSibling = this;
          break;

        case 'afterbegin':
          parentNode = this;
          nextSibling = this.firstChild;
          break;

        case 'beforeend':
          parentNode = this;
          nextSibling = null;
          break;

        case 'afterend':
          parentNode = this.parentNode;
          nextSibling = this.nextSibling;
          break;

        default:
          throw new Error('invalid position');
      }

      if (parentNode === null) {
        throw new Error(position + " requires a parentNode");
      }

      _insertBefore(parentNode, raw, nextSibling);
    };

    _proto2.getAttribute = function getAttribute(name) {
      var localName = adjustAttrName(this.namespaceURI, name);
      return _getAttribute(this.attributes, null, localName);
    };

    _proto2.getAttributeNS = function getAttributeNS(namespaceURI, localName) {
      return _getAttribute(this.attributes, namespaceURI, localName);
    };

    _proto2.setAttribute = function setAttribute(name, value) {
      var localName = adjustAttrName(this.namespaceURI, name);

      _setAttribute(this, null, null, localName, value);
    };

    _proto2.setAttributeNS = function setAttributeNS(namespaceURI, qualifiedName, value) {
      var _parseQualifiedName = parseQualifiedName(qualifiedName),
          prefix = _parseQualifiedName[0],
          localName = _parseQualifiedName[1];

      _setAttribute(this, namespaceURI, prefix, localName, value);
    };

    _proto2.removeAttribute = function removeAttribute(name) {
      var localName = adjustAttrName(this.namespaceURI, name);

      _removeAttribute(this.attributes, null, localName);
    };

    _proto2.removeAttributeNS = function removeAttributeNS(namespaceURI, localName) {
      _removeAttribute(this.attributes, namespaceURI, localName);
    };

    _proto2.createElement = function createElement(name) {
      return new SimpleNodeImpl(this, 1
      /* ELEMENT_NODE */
      , name.toUpperCase(), null, "http://www.w3.org/1999/xhtml"
      /* HTML */
      );
    };

    _proto2.createElementNS = function createElementNS(namespace, qualifiedName) {
      // Node name is case-preserving in XML contexts, but returns canonical uppercase form in HTML contexts
      // https://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html#ID-104682815
      var nodeName = namespace === "http://www.w3.org/1999/xhtml"
      /* HTML */
      ? qualifiedName.toUpperCase() : qualifiedName; // we don't care to parse the qualified name because we only support HTML documents
      // which don't support prefixed elements

      return new SimpleNodeImpl(this, 1
      /* ELEMENT_NODE */
      , nodeName, null, namespace);
    };

    _proto2.createTextNode = function createTextNode(text) {
      return new SimpleNodeImpl(this, 3
      /* TEXT_NODE */
      , '#text', text, void 0);
    };

    _proto2.createComment = function createComment(text) {
      return new SimpleNodeImpl(this, 8
      /* COMMENT_NODE */
      , '#comment', text, void 0);
    }
    /**
     * Backwards compat
     * @deprecated
     */
    ;

    _proto2.createRawHTMLSection = function createRawHTMLSection(text) {
      return new SimpleNodeImpl(this, -1
      /* RAW_NODE */
      , '#raw', text, void 0);
    };

    _proto2.createDocumentFragment = function createDocumentFragment() {
      return new SimpleNodeImpl(this, 11
      /* DOCUMENT_FRAGMENT_NODE */
      , '#document-fragment', null, void 0);
    };

    (0, _emberBabel.createClass)(SimpleNodeImpl, [{
      key: "tagName",
      get: function get() {
        return this.nodeName;
      }
    }, {
      key: "childNodes",
      get: function get() {
        var children = this._childNodes;

        if (children === undefined) {
          children = this._childNodes = new ChildNodes(this);
        }

        return children;
      }
    }, {
      key: "doctype",
      get: function get() {
        return this.firstChild;
      }
    }, {
      key: "documentElement",
      get: function get() {
        return this.lastChild;
      }
    }, {
      key: "head",
      get: function get() {
        return this.documentElement.firstChild;
      }
    }, {
      key: "body",
      get: function get() {
        return this.documentElement.lastChild;
      }
    }]);
    return SimpleNodeImpl;
  }();

  function createHTMLDocument() {
    // dom.d.ts types ownerDocument as Document but for a document ownerDocument is null
    var document = new SimpleNodeImpl(null, 9
    /* DOCUMENT_NODE */
    , '#document', null, "http://www.w3.org/1999/xhtml"
    /* HTML */
    );
    var doctype = new SimpleNodeImpl(document, 10
    /* DOCUMENT_TYPE_NODE */
    , 'html', null, "http://www.w3.org/1999/xhtml"
    /* HTML */
    );
    var html = new SimpleNodeImpl(document, 1
    /* ELEMENT_NODE */
    , 'HTML', null, "http://www.w3.org/1999/xhtml"
    /* HTML */
    );
    var head = new SimpleNodeImpl(document, 1
    /* ELEMENT_NODE */
    , 'HEAD', null, "http://www.w3.org/1999/xhtml"
    /* HTML */
    );
    var body = new SimpleNodeImpl(document, 1
    /* ELEMENT_NODE */
    , 'BODY', null, "http://www.w3.org/1999/xhtml"
    /* HTML */
    );
    html.appendChild(head);
    html.appendChild(body);
    document.appendChild(doctype);
    document.appendChild(html);
    return document;
  }

  var _default = createHTMLDocument;
  _exports.default = _default;
});