if(typeof Math.imul == "undefined" || (Math.imul(0xffffffff,5) == 0)) {
    Math.imul = function (a, b) {
        var ah  = (a >>> 16) & 0xffff;
        var al = a & 0xffff;
        var bh  = (b >>> 16) & 0xffff;
        var bl = b & 0xffff;
        // the shift by 0 fixes the sign on the high part
        // the final |0 converts the unsigned value into a signed value
        return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
    }
}

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":13}],3:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":36}],4:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],5:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":7}],6:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":6}],8:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":1}],9:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],10:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],11:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":16}],12:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":27,"is-object":9}],13:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":25,"../vnode/is-vnode.js":28,"../vnode/is-vtext.js":29,"../vnode/is-widget.js":30,"./apply-properties":12,"global/document":8}],14:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],15:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var render = require("./create-element")
var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":30,"../vnode/vpatch.js":33,"./apply-properties":12,"./create-element":13,"./update-widget":17}],16:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches) {
    return patchRecursive(rootNode, patches)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions) {
        renderOptions = { patch: patchRecursive }
        if (ownerDocument !== document) {
            renderOptions.document = ownerDocument
        }
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./dom-index":14,"./patch-op":15,"global/document":8,"x-is-array":10}],17:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":30}],18:[function(require,module,exports){
'use strict';

module.exports = AttributeHook;

function AttributeHook(namespace, value) {
    if (!(this instanceof AttributeHook)) {
        return new AttributeHook(namespace, value);
    }

    this.namespace = namespace;
    this.value = value;
}

AttributeHook.prototype.hook = function (node, prop, prev) {
    if (prev && prev.type === 'AttributeHook' &&
        prev.value === this.value &&
        prev.namespace === this.namespace) {
        return;
    }

    node.setAttributeNS(this.namespace, prop, this.value);
};

AttributeHook.prototype.unhook = function (node, prop, next) {
    if (next && next.type === 'AttributeHook' &&
        next.namespace === this.namespace) {
        return;
    }

    var colonPosition = prop.indexOf(':');
    var localName = colonPosition > -1 ? prop.substr(colonPosition + 1) : prop;
    node.removeAttributeNS(this.namespace, localName);
};

AttributeHook.prototype.type = 'AttributeHook';

},{}],19:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":5}],20:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],21:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":26,"../vnode/is-vhook":27,"../vnode/is-vnode":28,"../vnode/is-vtext":29,"../vnode/is-widget":30,"../vnode/vnode.js":32,"../vnode/vtext.js":34,"./hooks/ev-hook.js":19,"./hooks/soft-set-hook.js":20,"./parse-tag.js":22,"x-is-array":10}],22:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":4}],23:[function(require,module,exports){
'use strict';

var DEFAULT_NAMESPACE = null;
var EV_NAMESPACE = 'http://www.w3.org/2001/xml-events';
var XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';

// http://www.w3.org/TR/SVGTiny12/attributeTable.html
// http://www.w3.org/TR/SVG/attindex.html
var SVG_PROPERTIES = {
    'about': DEFAULT_NAMESPACE,
    'accent-height': DEFAULT_NAMESPACE,
    'accumulate': DEFAULT_NAMESPACE,
    'additive': DEFAULT_NAMESPACE,
    'alignment-baseline': DEFAULT_NAMESPACE,
    'alphabetic': DEFAULT_NAMESPACE,
    'amplitude': DEFAULT_NAMESPACE,
    'arabic-form': DEFAULT_NAMESPACE,
    'ascent': DEFAULT_NAMESPACE,
    'attributeName': DEFAULT_NAMESPACE,
    'attributeType': DEFAULT_NAMESPACE,
    'azimuth': DEFAULT_NAMESPACE,
    'bandwidth': DEFAULT_NAMESPACE,
    'baseFrequency': DEFAULT_NAMESPACE,
    'baseProfile': DEFAULT_NAMESPACE,
    'baseline-shift': DEFAULT_NAMESPACE,
    'bbox': DEFAULT_NAMESPACE,
    'begin': DEFAULT_NAMESPACE,
    'bias': DEFAULT_NAMESPACE,
    'by': DEFAULT_NAMESPACE,
    'calcMode': DEFAULT_NAMESPACE,
    'cap-height': DEFAULT_NAMESPACE,
    'class': DEFAULT_NAMESPACE,
    'clip': DEFAULT_NAMESPACE,
    'clip-path': DEFAULT_NAMESPACE,
    'clip-rule': DEFAULT_NAMESPACE,
    'clipPathUnits': DEFAULT_NAMESPACE,
    'color': DEFAULT_NAMESPACE,
    'color-interpolation': DEFAULT_NAMESPACE,
    'color-interpolation-filters': DEFAULT_NAMESPACE,
    'color-profile': DEFAULT_NAMESPACE,
    'color-rendering': DEFAULT_NAMESPACE,
    'content': DEFAULT_NAMESPACE,
    'contentScriptType': DEFAULT_NAMESPACE,
    'contentStyleType': DEFAULT_NAMESPACE,
    'cursor': DEFAULT_NAMESPACE,
    'cx': DEFAULT_NAMESPACE,
    'cy': DEFAULT_NAMESPACE,
    'd': DEFAULT_NAMESPACE,
    'datatype': DEFAULT_NAMESPACE,
    'defaultAction': DEFAULT_NAMESPACE,
    'descent': DEFAULT_NAMESPACE,
    'diffuseConstant': DEFAULT_NAMESPACE,
    'direction': DEFAULT_NAMESPACE,
    'display': DEFAULT_NAMESPACE,
    'divisor': DEFAULT_NAMESPACE,
    'dominant-baseline': DEFAULT_NAMESPACE,
    'dur': DEFAULT_NAMESPACE,
    'dx': DEFAULT_NAMESPACE,
    'dy': DEFAULT_NAMESPACE,
    'edgeMode': DEFAULT_NAMESPACE,
    'editable': DEFAULT_NAMESPACE,
    'elevation': DEFAULT_NAMESPACE,
    'enable-background': DEFAULT_NAMESPACE,
    'end': DEFAULT_NAMESPACE,
    'ev:event': EV_NAMESPACE,
    'event': DEFAULT_NAMESPACE,
    'exponent': DEFAULT_NAMESPACE,
    'externalResourcesRequired': DEFAULT_NAMESPACE,
    'fill': DEFAULT_NAMESPACE,
    'fill-opacity': DEFAULT_NAMESPACE,
    'fill-rule': DEFAULT_NAMESPACE,
    'filter': DEFAULT_NAMESPACE,
    'filterRes': DEFAULT_NAMESPACE,
    'filterUnits': DEFAULT_NAMESPACE,
    'flood-color': DEFAULT_NAMESPACE,
    'flood-opacity': DEFAULT_NAMESPACE,
    'focusHighlight': DEFAULT_NAMESPACE,
    'focusable': DEFAULT_NAMESPACE,
    'font-family': DEFAULT_NAMESPACE,
    'font-size': DEFAULT_NAMESPACE,
    'font-size-adjust': DEFAULT_NAMESPACE,
    'font-stretch': DEFAULT_NAMESPACE,
    'font-style': DEFAULT_NAMESPACE,
    'font-variant': DEFAULT_NAMESPACE,
    'font-weight': DEFAULT_NAMESPACE,
    'format': DEFAULT_NAMESPACE,
    'from': DEFAULT_NAMESPACE,
    'fx': DEFAULT_NAMESPACE,
    'fy': DEFAULT_NAMESPACE,
    'g1': DEFAULT_NAMESPACE,
    'g2': DEFAULT_NAMESPACE,
    'glyph-name': DEFAULT_NAMESPACE,
    'glyph-orientation-horizontal': DEFAULT_NAMESPACE,
    'glyph-orientation-vertical': DEFAULT_NAMESPACE,
    'glyphRef': DEFAULT_NAMESPACE,
    'gradientTransform': DEFAULT_NAMESPACE,
    'gradientUnits': DEFAULT_NAMESPACE,
    'handler': DEFAULT_NAMESPACE,
    'hanging': DEFAULT_NAMESPACE,
    'height': DEFAULT_NAMESPACE,
    'horiz-adv-x': DEFAULT_NAMESPACE,
    'horiz-origin-x': DEFAULT_NAMESPACE,
    'horiz-origin-y': DEFAULT_NAMESPACE,
    'id': DEFAULT_NAMESPACE,
    'ideographic': DEFAULT_NAMESPACE,
    'image-rendering': DEFAULT_NAMESPACE,
    'in': DEFAULT_NAMESPACE,
    'in2': DEFAULT_NAMESPACE,
    'initialVisibility': DEFAULT_NAMESPACE,
    'intercept': DEFAULT_NAMESPACE,
    'k': DEFAULT_NAMESPACE,
    'k1': DEFAULT_NAMESPACE,
    'k2': DEFAULT_NAMESPACE,
    'k3': DEFAULT_NAMESPACE,
    'k4': DEFAULT_NAMESPACE,
    'kernelMatrix': DEFAULT_NAMESPACE,
    'kernelUnitLength': DEFAULT_NAMESPACE,
    'kerning': DEFAULT_NAMESPACE,
    'keyPoints': DEFAULT_NAMESPACE,
    'keySplines': DEFAULT_NAMESPACE,
    'keyTimes': DEFAULT_NAMESPACE,
    'lang': DEFAULT_NAMESPACE,
    'lengthAdjust': DEFAULT_NAMESPACE,
    'letter-spacing': DEFAULT_NAMESPACE,
    'lighting-color': DEFAULT_NAMESPACE,
    'limitingConeAngle': DEFAULT_NAMESPACE,
    'local': DEFAULT_NAMESPACE,
    'marker-end': DEFAULT_NAMESPACE,
    'marker-mid': DEFAULT_NAMESPACE,
    'marker-start': DEFAULT_NAMESPACE,
    'markerHeight': DEFAULT_NAMESPACE,
    'markerUnits': DEFAULT_NAMESPACE,
    'markerWidth': DEFAULT_NAMESPACE,
    'mask': DEFAULT_NAMESPACE,
    'maskContentUnits': DEFAULT_NAMESPACE,
    'maskUnits': DEFAULT_NAMESPACE,
    'mathematical': DEFAULT_NAMESPACE,
    'max': DEFAULT_NAMESPACE,
    'media': DEFAULT_NAMESPACE,
    'mediaCharacterEncoding': DEFAULT_NAMESPACE,
    'mediaContentEncodings': DEFAULT_NAMESPACE,
    'mediaSize': DEFAULT_NAMESPACE,
    'mediaTime': DEFAULT_NAMESPACE,
    'method': DEFAULT_NAMESPACE,
    'min': DEFAULT_NAMESPACE,
    'mode': DEFAULT_NAMESPACE,
    'name': DEFAULT_NAMESPACE,
    'nav-down': DEFAULT_NAMESPACE,
    'nav-down-left': DEFAULT_NAMESPACE,
    'nav-down-right': DEFAULT_NAMESPACE,
    'nav-left': DEFAULT_NAMESPACE,
    'nav-next': DEFAULT_NAMESPACE,
    'nav-prev': DEFAULT_NAMESPACE,
    'nav-right': DEFAULT_NAMESPACE,
    'nav-up': DEFAULT_NAMESPACE,
    'nav-up-left': DEFAULT_NAMESPACE,
    'nav-up-right': DEFAULT_NAMESPACE,
    'numOctaves': DEFAULT_NAMESPACE,
    'observer': DEFAULT_NAMESPACE,
    'offset': DEFAULT_NAMESPACE,
    'opacity': DEFAULT_NAMESPACE,
    'operator': DEFAULT_NAMESPACE,
    'order': DEFAULT_NAMESPACE,
    'orient': DEFAULT_NAMESPACE,
    'orientation': DEFAULT_NAMESPACE,
    'origin': DEFAULT_NAMESPACE,
    'overflow': DEFAULT_NAMESPACE,
    'overlay': DEFAULT_NAMESPACE,
    'overline-position': DEFAULT_NAMESPACE,
    'overline-thickness': DEFAULT_NAMESPACE,
    'panose-1': DEFAULT_NAMESPACE,
    'path': DEFAULT_NAMESPACE,
    'pathLength': DEFAULT_NAMESPACE,
    'patternContentUnits': DEFAULT_NAMESPACE,
    'patternTransform': DEFAULT_NAMESPACE,
    'patternUnits': DEFAULT_NAMESPACE,
    'phase': DEFAULT_NAMESPACE,
    'playbackOrder': DEFAULT_NAMESPACE,
    'pointer-events': DEFAULT_NAMESPACE,
    'points': DEFAULT_NAMESPACE,
    'pointsAtX': DEFAULT_NAMESPACE,
    'pointsAtY': DEFAULT_NAMESPACE,
    'pointsAtZ': DEFAULT_NAMESPACE,
    'preserveAlpha': DEFAULT_NAMESPACE,
    'preserveAspectRatio': DEFAULT_NAMESPACE,
    'primitiveUnits': DEFAULT_NAMESPACE,
    'propagate': DEFAULT_NAMESPACE,
    'property': DEFAULT_NAMESPACE,
    'r': DEFAULT_NAMESPACE,
    'radius': DEFAULT_NAMESPACE,
    'refX': DEFAULT_NAMESPACE,
    'refY': DEFAULT_NAMESPACE,
    'rel': DEFAULT_NAMESPACE,
    'rendering-intent': DEFAULT_NAMESPACE,
    'repeatCount': DEFAULT_NAMESPACE,
    'repeatDur': DEFAULT_NAMESPACE,
    'requiredExtensions': DEFAULT_NAMESPACE,
    'requiredFeatures': DEFAULT_NAMESPACE,
    'requiredFonts': DEFAULT_NAMESPACE,
    'requiredFormats': DEFAULT_NAMESPACE,
    'resource': DEFAULT_NAMESPACE,
    'restart': DEFAULT_NAMESPACE,
    'result': DEFAULT_NAMESPACE,
    'rev': DEFAULT_NAMESPACE,
    'role': DEFAULT_NAMESPACE,
    'rotate': DEFAULT_NAMESPACE,
    'rx': DEFAULT_NAMESPACE,
    'ry': DEFAULT_NAMESPACE,
    'scale': DEFAULT_NAMESPACE,
    'seed': DEFAULT_NAMESPACE,
    'shape-rendering': DEFAULT_NAMESPACE,
    'slope': DEFAULT_NAMESPACE,
    'snapshotTime': DEFAULT_NAMESPACE,
    'spacing': DEFAULT_NAMESPACE,
    'specularConstant': DEFAULT_NAMESPACE,
    'specularExponent': DEFAULT_NAMESPACE,
    'spreadMethod': DEFAULT_NAMESPACE,
    'startOffset': DEFAULT_NAMESPACE,
    'stdDeviation': DEFAULT_NAMESPACE,
    'stemh': DEFAULT_NAMESPACE,
    'stemv': DEFAULT_NAMESPACE,
    'stitchTiles': DEFAULT_NAMESPACE,
    'stop-color': DEFAULT_NAMESPACE,
    'stop-opacity': DEFAULT_NAMESPACE,
    'strikethrough-position': DEFAULT_NAMESPACE,
    'strikethrough-thickness': DEFAULT_NAMESPACE,
    'string': DEFAULT_NAMESPACE,
    'stroke': DEFAULT_NAMESPACE,
    'stroke-dasharray': DEFAULT_NAMESPACE,
    'stroke-dashoffset': DEFAULT_NAMESPACE,
    'stroke-linecap': DEFAULT_NAMESPACE,
    'stroke-linejoin': DEFAULT_NAMESPACE,
    'stroke-miterlimit': DEFAULT_NAMESPACE,
    'stroke-opacity': DEFAULT_NAMESPACE,
    'stroke-width': DEFAULT_NAMESPACE,
    'surfaceScale': DEFAULT_NAMESPACE,
    'syncBehavior': DEFAULT_NAMESPACE,
    'syncBehaviorDefault': DEFAULT_NAMESPACE,
    'syncMaster': DEFAULT_NAMESPACE,
    'syncTolerance': DEFAULT_NAMESPACE,
    'syncToleranceDefault': DEFAULT_NAMESPACE,
    'systemLanguage': DEFAULT_NAMESPACE,
    'tableValues': DEFAULT_NAMESPACE,
    'target': DEFAULT_NAMESPACE,
    'targetX': DEFAULT_NAMESPACE,
    'targetY': DEFAULT_NAMESPACE,
    'text-anchor': DEFAULT_NAMESPACE,
    'text-decoration': DEFAULT_NAMESPACE,
    'text-rendering': DEFAULT_NAMESPACE,
    'textLength': DEFAULT_NAMESPACE,
    'timelineBegin': DEFAULT_NAMESPACE,
    'title': DEFAULT_NAMESPACE,
    'to': DEFAULT_NAMESPACE,
    'transform': DEFAULT_NAMESPACE,
    'transformBehavior': DEFAULT_NAMESPACE,
    'type': DEFAULT_NAMESPACE,
    'typeof': DEFAULT_NAMESPACE,
    'u1': DEFAULT_NAMESPACE,
    'u2': DEFAULT_NAMESPACE,
    'underline-position': DEFAULT_NAMESPACE,
    'underline-thickness': DEFAULT_NAMESPACE,
    'unicode': DEFAULT_NAMESPACE,
    'unicode-bidi': DEFAULT_NAMESPACE,
    'unicode-range': DEFAULT_NAMESPACE,
    'units-per-em': DEFAULT_NAMESPACE,
    'v-alphabetic': DEFAULT_NAMESPACE,
    'v-hanging': DEFAULT_NAMESPACE,
    'v-ideographic': DEFAULT_NAMESPACE,
    'v-mathematical': DEFAULT_NAMESPACE,
    'values': DEFAULT_NAMESPACE,
    'version': DEFAULT_NAMESPACE,
    'vert-adv-y': DEFAULT_NAMESPACE,
    'vert-origin-x': DEFAULT_NAMESPACE,
    'vert-origin-y': DEFAULT_NAMESPACE,
    'viewBox': DEFAULT_NAMESPACE,
    'viewTarget': DEFAULT_NAMESPACE,
    'visibility': DEFAULT_NAMESPACE,
    'width': DEFAULT_NAMESPACE,
    'widths': DEFAULT_NAMESPACE,
    'word-spacing': DEFAULT_NAMESPACE,
    'writing-mode': DEFAULT_NAMESPACE,
    'x': DEFAULT_NAMESPACE,
    'x-height': DEFAULT_NAMESPACE,
    'x1': DEFAULT_NAMESPACE,
    'x2': DEFAULT_NAMESPACE,
    'xChannelSelector': DEFAULT_NAMESPACE,
    'xlink:actuate': XLINK_NAMESPACE,
    'xlink:arcrole': XLINK_NAMESPACE,
    'xlink:href': XLINK_NAMESPACE,
    'xlink:role': XLINK_NAMESPACE,
    'xlink:show': XLINK_NAMESPACE,
    'xlink:title': XLINK_NAMESPACE,
    'xlink:type': XLINK_NAMESPACE,
    'xml:base': XML_NAMESPACE,
    'xml:id': XML_NAMESPACE,
    'xml:lang': XML_NAMESPACE,
    'xml:space': XML_NAMESPACE,
    'y': DEFAULT_NAMESPACE,
    'y1': DEFAULT_NAMESPACE,
    'y2': DEFAULT_NAMESPACE,
    'yChannelSelector': DEFAULT_NAMESPACE,
    'z': DEFAULT_NAMESPACE,
    'zoomAndPan': DEFAULT_NAMESPACE
};

module.exports = SVGAttributeNamespace;

function SVGAttributeNamespace(value) {
  if (SVG_PROPERTIES.hasOwnProperty(value)) {
    return SVG_PROPERTIES[value];
  }
}

},{}],24:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var h = require('./index.js');


var SVGAttributeNamespace = require('./svg-attribute-namespace');
var attributeHook = require('./hooks/attribute-hook');

var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

module.exports = svg;

function svg(tagName, properties, children) {
    if (!children && isChildren(properties)) {
        children = properties;
        properties = {};
    }

    properties = properties || {};

    // set namespace for svg
    properties.namespace = SVG_NAMESPACE;

    var attributes = properties.attributes || (properties.attributes = {});

    for (var key in properties) {
        if (!properties.hasOwnProperty(key)) {
            continue;
        }

        var namespace = SVGAttributeNamespace(key);

        if (namespace === undefined) { // not a svg attribute
            continue;
        }

        var value = properties[key];

        if (typeof value !== 'string' &&
            typeof value !== 'number' &&
            typeof value !== 'boolean'
        ) {
            continue;
        }

        if (namespace !== null) { // namespaced attribute
            properties[key] = attributeHook(namespace, value);
            continue;
        }

        attributes[key] = value
        properties[key] = undefined
    }

    return h(tagName, properties, children);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x);
}

},{"./hooks/attribute-hook":18,"./index.js":21,"./svg-attribute-namespace":23,"x-is-array":10}],25:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":26,"./is-vnode":28,"./is-vtext":29,"./is-widget":30}],26:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],27:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],28:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":31}],29:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":31}],30:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],31:[function(require,module,exports){
module.exports = "2"

},{}],32:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":26,"./is-vhook":27,"./is-vnode":28,"./is-widget":30,"./version":31}],33:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":31}],34:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":31}],35:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":27,"is-object":9}],36:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free,     // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":25,"../vnode/is-thunk":26,"../vnode/is-vnode":28,"../vnode/is-vtext":29,"../vnode/is-widget":30,"../vnode/vpatch":33,"./diff-props":35,"x-is-array":10}],37:[function(require,module,exports){
return VDOM = {
  diff: require("virtual-dom/diff"),
  patch: require("virtual-dom/patch"),
  create: require("virtual-dom/create-element"),
  VHtml: require("virtual-dom/vnode/vnode"),
  VText: require("virtual-dom/vnode/vtext"),
  VSvg: require("virtual-dom/virtual-hyperscript/svg")
}

},{"virtual-dom/create-element":2,"virtual-dom/diff":3,"virtual-dom/patch":11,"virtual-dom/virtual-hyperscript/svg":24,"virtual-dom/vnode/vnode":32,"virtual-dom/vnode/vtext":34}]},{},[37]);

var h,aa=this;
function p(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==
b&&"undefined"==typeof a.call)return"object";return b}var ba="closure_uid_"+(1E9*Math.random()>>>0),da=0;function ga(a,b,c){return a.call.apply(a.bind,arguments)}function ha(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function ia(a,b,c){ia=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ga:ha;return ia.apply(null,arguments)};function ja(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function ka(a,b){null!=a&&this.append.apply(this,arguments)}h=ka.prototype;h.$a="";h.set=function(a){this.$a=""+a};h.append=function(a,b,c){this.$a+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.$a+=arguments[d];return this};h.clear=function(){this.$a=""};h.toString=function(){return this.$a};function na(a,b){a.sort(b||oa)}function pa(a,b){for(var c=0;c<a.length;c++)a[c]={index:c,value:a[c]};var d=b||oa;na(a,function(a,b){return d(a.value,b.value)||a.index-b.index});for(c=0;c<a.length;c++)a[c]=a[c].value}function oa(a,b){return a>b?1:a<b?-1:0};var qa={},ra;if("undefined"===typeof sa)var sa=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof ta)var ta=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var va=null;if("undefined"===typeof xa)var xa=null;function ya(){return new q(null,5,[Ca,!0,Da,!0,Ea,!1,Fa,!1,Ga,null],null)}Ha;
function Ia(){sa=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Ja(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,Ha.b?Ha.b(a):Ha.call(null,a))}a.B=0;a.G=function(a){a=w(a);return b(a)};a.l=b;return a}();ta=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Ja(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,
Ha.b?Ha.b(a):Ha.call(null,a))}a.B=0;a.G=function(a){a=w(a);return b(a)};a.l=b;return a}()}function x(a){return null!=a&&!1!==a}Ka;y;function La(a){return null==a}function Ma(a){return a instanceof Array}function Na(a){return null==a?!0:!1===a?!0:!1}function Pa(a,b){return a[p(null==b?null:b)]?!0:a._?!0:!1}function A(a,b){var c=null==b?null:b.constructor,c=x(x(c)?c.Eb:c)?c.eb:p(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}
function Qa(a){var b=a.eb;return x(b)?b:""+B(a)}var Ra="undefined"!==typeof Symbol&&"function"===p(Symbol)?Symbol.iterator:"@@iterator";function Sa(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}D;Ua;var Ha=function Ha(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ha.b(arguments[0]);case 2:return Ha.a(arguments[0],arguments[1]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
Ha.b=function(a){return Ha.a(null,a)};Ha.a=function(a,b){function c(a,b){a.push(b);return a}var d=[];return Ua.c?Ua.c(c,d,b):Ua.call(null,c,d,b)};Ha.B=2;function Va(){}
var Wa=function Wa(b){if(null!=b&&null!=b.$)return b.$(b);var c=Wa[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Wa._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("ICounted.-count",b);},Xa=function Xa(b){if(null!=b&&null!=b.ba)return b.ba(b);var c=Xa[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Xa._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IEmptyableCollection.-empty",b);};function Ya(){}
var Za=function Za(b,c){if(null!=b&&null!=b.Z)return b.Z(b,c);var d=Za[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Za._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("ICollection.-conj",b);};function $a(){}
var G=function G(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return G.a(arguments[0],arguments[1]);case 3:return G.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
G.a=function(a,b){if(null!=a&&null!=a.aa)return a.aa(a,b);var c=G[p(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=G._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw A("IIndexed.-nth",a);};G.c=function(a,b,c){if(null!=a&&null!=a.Ba)return a.Ba(a,b,c);var d=G[p(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=G._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw A("IIndexed.-nth",a);};G.B=3;function ab(){}
var bb=function bb(b){if(null!=b&&null!=b.fa)return b.fa(b);var c=bb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=bb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("ISeq.-first",b);},cb=function cb(b){if(null!=b&&null!=b.va)return b.va(b);var c=cb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=cb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("ISeq.-rest",b);};function db(){}function fb(){}
var gb=function gb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return gb.a(arguments[0],arguments[1]);case 3:return gb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
gb.a=function(a,b){if(null!=a&&null!=a.P)return a.P(a,b);var c=gb[p(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=gb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw A("ILookup.-lookup",a);};gb.c=function(a,b,c){if(null!=a&&null!=a.M)return a.M(a,b,c);var d=gb[p(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=gb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw A("ILookup.-lookup",a);};gb.B=3;
var hb=function hb(b,c){if(null!=b&&null!=b.Vb)return b.Vb(b,c);var d=hb[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=hb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("IAssociative.-contains-key?",b);},ib=function ib(b,c,d){if(null!=b&&null!=b.Xa)return b.Xa(b,c,d);var e=ib[p(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=ib._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw A("IAssociative.-assoc",b);};function jb(){}
var kb=function kb(b,c){if(null!=b&&null!=b.Mb)return b.Mb(b,c);var d=kb[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=kb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("IMap.-dissoc",b);};function lb(){}
var mb=function mb(b){if(null!=b&&null!=b.xb)return b.xb(b);var c=mb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=mb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IMapEntry.-key",b);},ob=function ob(b){if(null!=b&&null!=b.yb)return b.yb(b);var c=ob[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ob._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IMapEntry.-val",b);};function pb(){}
var qb=function qb(b){if(null!=b&&null!=b.ab)return b.ab(b);var c=qb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=qb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IStack.-peek",b);},rb=function rb(b){if(null!=b&&null!=b.bb)return b.bb(b);var c=rb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=rb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IStack.-pop",b);};function sb(){}
var tb=function tb(b,c,d){if(null!=b&&null!=b.cb)return b.cb(b,c,d);var e=tb[p(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=tb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw A("IVector.-assoc-n",b);},ub=function ub(b){if(null!=b&&null!=b.vb)return b.vb(b);var c=ub[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ub._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IDeref.-deref",b);};function wb(){}
var xb=function xb(b){if(null!=b&&null!=b.S)return b.S(b);var c=xb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=xb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IMeta.-meta",b);},yb=function yb(b,c){if(null!=b&&null!=b.T)return b.T(b,c);var d=yb[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=yb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("IWithMeta.-with-meta",b);};function zb(){}
var Ab=function Ab(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ab.a(arguments[0],arguments[1]);case 3:return Ab.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
Ab.a=function(a,b){if(null!=a&&null!=a.da)return a.da(a,b);var c=Ab[p(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=Ab._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw A("IReduce.-reduce",a);};Ab.c=function(a,b,c){if(null!=a&&null!=a.ea)return a.ea(a,b,c);var d=Ab[p(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Ab._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw A("IReduce.-reduce",a);};Ab.B=3;
var Bb=function Bb(b,c){if(null!=b&&null!=b.C)return b.C(b,c);var d=Bb[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Bb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("IEquiv.-equiv",b);},Cb=function Cb(b){if(null!=b&&null!=b.R)return b.R(b);var c=Cb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Cb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IHash.-hash",b);};function Db(){}
var Eb=function Eb(b){if(null!=b&&null!=b.V)return b.V(b);var c=Eb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Eb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("ISeqable.-seq",b);};function Fb(){}function Gb(){}function Hb(){}
var Ib=function Ib(b,c){if(null!=b&&null!=b.kc)return b.kc(0,c);var d=Ib[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Ib._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("IWriter.-write",b);},Jb=function Jb(b,c,d){if(null!=b&&null!=b.O)return b.O(b,c,d);var e=Jb[p(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Jb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw A("IPrintWithWriter.-pr-writer",b);},Kb=function Kb(b,c,d){if(null!=b&&
null!=b.jc)return b.jc(0,c,d);var e=Kb[p(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Kb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw A("IWatchable.-notify-watches",b);},Lb=function Lb(b){if(null!=b&&null!=b.mb)return b.mb(b);var c=Lb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Lb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IEditableCollection.-as-transient",b);},Mb=function Mb(b,c){if(null!=b&&null!=b.Cb)return b.Cb(b,c);var d=
Mb[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Mb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("ITransientCollection.-conj!",b);},Ob=function Ob(b){if(null!=b&&null!=b.Db)return b.Db(b);var c=Ob[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Ob._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("ITransientCollection.-persistent!",b);},Pb=function Pb(b,c,d){if(null!=b&&null!=b.Bb)return b.Bb(b,c,d);var e=Pb[p(null==b?null:b)];if(null!=e)return e.c?
e.c(b,c,d):e.call(null,b,c,d);e=Pb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw A("ITransientAssociative.-assoc!",b);},Qb=function Qb(b,c,d){if(null!=b&&null!=b.ic)return b.ic(0,c,d);var e=Qb[p(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Qb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw A("ITransientVector.-assoc-n!",b);};function Rb(){}
var Sb=function Sb(b,c){if(null!=b&&null!=b.lb)return b.lb(b,c);var d=Sb[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Sb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("IComparable.-compare",b);},Tb=function Tb(b){if(null!=b&&null!=b.fc)return b.fc();var c=Tb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Tb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IChunk.-drop-first",b);},Ub=function Ub(b){if(null!=b&&null!=b.Xb)return b.Xb(b);var c=
Ub[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Ub._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IChunkedSeq.-chunked-first",b);},Vb=function Vb(b){if(null!=b&&null!=b.Yb)return b.Yb(b);var c=Vb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Vb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IChunkedSeq.-chunked-rest",b);},Wb=function Wb(b){if(null!=b&&null!=b.Wb)return b.Wb(b);var c=Wb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,
b);c=Wb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IChunkedNext.-chunked-next",b);},Xb=function Xb(b){if(null!=b&&null!=b.zb)return b.zb(b);var c=Xb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Xb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("INamed.-name",b);},Yb=function Yb(b){if(null!=b&&null!=b.Ab)return b.Ab(b);var c=Yb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Yb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("INamed.-namespace",
b);},Zb=function Zb(b,c){if(null!=b&&null!=b.Bc)return b.Bc(b,c);var d=Zb[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Zb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("IReset.-reset!",b);},$b=function $b(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return $b.a(arguments[0],arguments[1]);case 3:return $b.c(arguments[0],arguments[1],arguments[2]);case 4:return $b.v(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return $b.F(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};$b.a=function(a,b){if(null!=a&&null!=a.Dc)return a.Dc(a,b);var c=$b[p(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=$b._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw A("ISwap.-swap!",a);};
$b.c=function(a,b,c){if(null!=a&&null!=a.Ec)return a.Ec(a,b,c);var d=$b[p(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=$b._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw A("ISwap.-swap!",a);};$b.v=function(a,b,c,d){if(null!=a&&null!=a.Fc)return a.Fc(a,b,c,d);var e=$b[p(null==a?null:a)];if(null!=e)return e.v?e.v(a,b,c,d):e.call(null,a,b,c,d);e=$b._;if(null!=e)return e.v?e.v(a,b,c,d):e.call(null,a,b,c,d);throw A("ISwap.-swap!",a);};
$b.F=function(a,b,c,d,e){if(null!=a&&null!=a.Gc)return a.Gc(a,b,c,d,e);var f=$b[p(null==a?null:a)];if(null!=f)return f.F?f.F(a,b,c,d,e):f.call(null,a,b,c,d,e);f=$b._;if(null!=f)return f.F?f.F(a,b,c,d,e):f.call(null,a,b,c,d,e);throw A("ISwap.-swap!",a);};$b.B=5;var ac=function ac(b){if(null!=b&&null!=b.Ia)return b.Ia(b);var c=ac[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ac._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IIterable.-iterator",b);};
function bc(a){this.Rc=a;this.g=1073741824;this.D=0}bc.prototype.kc=function(a,b){return this.Rc.append(b)};function cc(a){var b=new ka;a.O(null,new bc(b),ya());return""+B(b)}var dc="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function ec(a){a=dc(a|0,-862048943);return dc(a<<15|a>>>-15,461845907)}
function fc(a,b){var c=(a|0)^(b|0);return dc(c<<13|c>>>-13,5)+-430675100|0}function gc(a,b){var c=(a|0)^b,c=dc(c^c>>>16,-2048144789),c=dc(c^c>>>13,-1028477387);return c^c>>>16}function hc(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=fc(c,ec(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^ec(a.charCodeAt(a.length-1)):b;return gc(b,dc(2,a.length))}ic;jc;kc;mc;var nc={},oc=0;
function pc(a){255<oc&&(nc={},oc=0);var b=nc[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=dc(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}else b=0;else b=0;nc[a]=b;oc+=1}return a=b}function qc(a){null!=a&&(a.g&4194304||a.Vc)?a=a.R(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=pc(a),0!==a&&(a=ec(a),a=fc(0,a),a=gc(a,4))):a=a instanceof Date?a.valueOf():null==a?0:Cb(a);return a}
function rc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function Ka(a,b){return b instanceof a}function sc(a,b){if(a.Ta===b.Ta)return 0;var c=Na(a.xa);if(x(c?b.xa:c))return-1;if(x(a.xa)){if(Na(b.xa))return 1;c=oa(a.xa,b.xa);return 0===c?oa(a.name,b.name):c}return oa(a.name,b.name)}H;function jc(a,b,c,d,e){this.xa=a;this.name=b;this.Ta=c;this.kb=d;this.Aa=e;this.g=2154168321;this.D=4096}h=jc.prototype;h.toString=function(){return this.Ta};h.equiv=function(a){return this.C(null,a)};
h.C=function(a,b){return b instanceof jc?this.Ta===b.Ta:!1};h.call=function(){function a(a,b,c){return H.c?H.c(b,this,c):H.call(null,b,this,c)}function b(a,b){return H.a?H.a(b,this):H.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};
h.b=function(a){return H.a?H.a(a,this):H.call(null,a,this)};h.a=function(a,b){return H.c?H.c(a,this,b):H.call(null,a,this,b)};h.S=function(){return this.Aa};h.T=function(a,b){return new jc(this.xa,this.name,this.Ta,this.kb,b)};h.R=function(){var a=this.kb;return null!=a?a:this.kb=a=rc(hc(this.name),pc(this.xa))};h.zb=function(){return this.name};h.Ab=function(){return this.xa};h.O=function(a,b){return Ib(b,this.Ta)};
var tc=function tc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return tc.b(arguments[0]);case 2:return tc.a(arguments[0],arguments[1]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};tc.b=function(a){if(a instanceof jc)return a;var b=a.indexOf("/");return-1===b?tc.a(null,a):tc.a(a.substring(0,b),a.substring(b+1,a.length))};tc.a=function(a,b){var c=null!=a?[B(a),B("/"),B(b)].join(""):b;return new jc(a,b,c,null,null)};
tc.B=2;uc;vc;Ja;function w(a){if(null==a)return null;if(null!=a&&(a.g&8388608||a.Cc))return a.V(null);if(Ma(a)||"string"===typeof a)return 0===a.length?null:new Ja(a,0);if(Pa(Db,a))return Eb(a);throw Error([B(a),B(" is not ISeqable")].join(""));}function J(a){if(null==a)return null;if(null!=a&&(a.g&64||a.A))return a.fa(null);a=w(a);return null==a?null:bb(a)}function wc(a){return null!=a?null!=a&&(a.g&64||a.A)?a.va(null):(a=w(a))?cb(a):L:L}
function M(a){return null==a?null:null!=a&&(a.g&128||a.Nb)?a.ua(null):w(wc(a))}var kc=function kc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return kc.b(arguments[0]);case 2:return kc.a(arguments[0],arguments[1]);default:return kc.l(arguments[0],arguments[1],new Ja(c.slice(2),0))}};kc.b=function(){return!0};kc.a=function(a,b){return null==a?null==b:a===b||Bb(a,b)};
kc.l=function(a,b,c){for(;;)if(kc.a(a,b))if(M(c))a=b,b=J(c),c=M(c);else return kc.a(b,J(c));else return!1};kc.G=function(a){var b=J(a),c=M(a);a=J(c);c=M(c);return kc.l(b,a,c)};kc.B=2;function xc(a){this.I=a}xc.prototype.next=function(){if(null!=this.I){var a=J(this.I);this.I=M(this.I);return{value:a,done:!1}}return{value:null,done:!0}};function yc(a){return new xc(w(a))}zc;function Ac(a,b,c){this.value=a;this.pb=b;this.Tb=c;this.g=8388672;this.D=0}Ac.prototype.V=function(){return this};
Ac.prototype.fa=function(){return this.value};Ac.prototype.va=function(){null==this.Tb&&(this.Tb=zc.b?zc.b(this.pb):zc.call(null,this.pb));return this.Tb};function zc(a){var b=a.next();return x(b.done)?L:new Ac(b.value,a,null)}function Cc(a,b){var c=ec(a),c=fc(0,c);return gc(c,b)}function Dc(a){var b=0,c=1;for(a=w(a);;)if(null!=a)b+=1,c=dc(31,c)+qc(J(a))|0,a=M(a);else return Cc(c,b)}var Ec=Cc(1,0);function Fc(a){var b=0,c=0;for(a=w(a);;)if(null!=a)b+=1,c=c+qc(J(a))|0,a=M(a);else return Cc(c,b)}
var Gc=Cc(0,0);N;ic;Hc;Va["null"]=!0;Wa["null"]=function(){return 0};Date.prototype.C=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.ub=!0;Date.prototype.lb=function(a,b){if(b instanceof Date)return oa(this.valueOf(),b.valueOf());throw Error([B("Cannot compare "),B(this),B(" to "),B(b)].join(""));};Bb.number=function(a,b){return a===b};Ic;wb["function"]=!0;xb["function"]=function(){return null};Cb._=function(a){return a[ba]||(a[ba]=++da)};
function Jc(a){return a+1}P;function Kc(a){this.H=a;this.g=32768;this.D=0}Kc.prototype.vb=function(){return this.H};function Mc(a){return a instanceof Kc}function P(a){return ub(a)}function Nc(a,b){var c=Wa(a);if(0===c)return b.u?b.u():b.call(null);for(var d=G.a(a,0),e=1;;)if(e<c){var f=G.a(a,e),d=b.a?b.a(d,f):b.call(null,d,f);if(Mc(d))return ub(d);e+=1}else return d}
function Oc(a,b,c){var d=Wa(a),e=c;for(c=0;;)if(c<d){var f=G.a(a,c),e=b.a?b.a(e,f):b.call(null,e,f);if(Mc(e))return ub(e);c+=1}else return e}function Pc(a,b){var c=a.length;if(0===a.length)return b.u?b.u():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.a?b.a(d,f):b.call(null,d,f);if(Mc(d))return ub(d);e+=1}else return d}function Qc(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.a?b.a(e,f):b.call(null,e,f);if(Mc(e))return ub(e);c+=1}else return e}
function Rc(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.a?b.a(c,f):b.call(null,c,f);if(Mc(c))return ub(c);d+=1}else return c}Sc;Q;Tc;Uc;function Vc(a){return null!=a?a.g&2||a.tc?!0:a.g?!1:Pa(Va,a):Pa(Va,a)}function Wc(a){return null!=a?a.g&16||a.gc?!0:a.g?!1:Pa($a,a):Pa($a,a)}function Xc(a,b){this.f=a;this.o=b}Xc.prototype.wa=function(){return this.o<this.f.length};Xc.prototype.next=function(){var a=this.f[this.o];this.o+=1;return a};
function Ja(a,b){this.f=a;this.o=b;this.g=166199550;this.D=8192}h=Ja.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.C(null,a)};h.aa=function(a,b){var c=b+this.o;return c<this.f.length?this.f[c]:null};h.Ba=function(a,b,c){a=b+this.o;return a<this.f.length?this.f[a]:c};h.Ia=function(){return new Xc(this.f,this.o)};h.ua=function(){return this.o+1<this.f.length?new Ja(this.f,this.o+1):null};h.$=function(){var a=this.f.length-this.o;return 0>a?0:a};h.R=function(){return Dc(this)};
h.C=function(a,b){return Hc.a?Hc.a(this,b):Hc.call(null,this,b)};h.ba=function(){return L};h.da=function(a,b){return Rc(this.f,b,this.f[this.o],this.o+1)};h.ea=function(a,b,c){return Rc(this.f,b,c,this.o)};h.fa=function(){return this.f[this.o]};h.va=function(){return this.o+1<this.f.length?new Ja(this.f,this.o+1):L};h.V=function(){return this.o<this.f.length?this:null};h.Z=function(a,b){return Q.a?Q.a(b,this):Q.call(null,b,this)};Ja.prototype[Ra]=function(){return yc(this)};
var vc=function vc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return vc.b(arguments[0]);case 2:return vc.a(arguments[0],arguments[1]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};vc.b=function(a){return vc.a(a,0)};vc.a=function(a,b){return b<a.length?new Ja(a,b):null};vc.B=2;
var uc=function uc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return uc.b(arguments[0]);case 2:return uc.a(arguments[0],arguments[1]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};uc.b=function(a){return vc.a(a,0)};uc.a=function(a,b){return vc.a(a,b)};uc.B=2;Ic;Yc;function Tc(a,b,c){this.Lb=a;this.o=b;this.s=c;this.g=32374990;this.D=8192}h=Tc.prototype;h.toString=function(){return cc(this)};
h.equiv=function(a){return this.C(null,a)};h.S=function(){return this.s};h.ua=function(){return 0<this.o?new Tc(this.Lb,this.o-1,null):null};h.$=function(){return this.o+1};h.R=function(){return Dc(this)};h.C=function(a,b){return Hc.a?Hc.a(this,b):Hc.call(null,this,b)};h.ba=function(){var a=L,b=this.s;return Ic.a?Ic.a(a,b):Ic.call(null,a,b)};h.da=function(a,b){return Yc.a?Yc.a(b,this):Yc.call(null,b,this)};h.ea=function(a,b,c){return Yc.c?Yc.c(b,c,this):Yc.call(null,b,c,this)};
h.fa=function(){return G.a(this.Lb,this.o)};h.va=function(){return 0<this.o?new Tc(this.Lb,this.o-1,null):L};h.V=function(){return this};h.T=function(a,b){return new Tc(this.Lb,this.o,b)};h.Z=function(a,b){return Q.a?Q.a(b,this):Q.call(null,b,this)};Tc.prototype[Ra]=function(){return yc(this)};Bb._=function(a,b){return a===b};
var Zc=function Zc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Zc.u();case 1:return Zc.b(arguments[0]);case 2:return Zc.a(arguments[0],arguments[1]);default:return Zc.l(arguments[0],arguments[1],new Ja(c.slice(2),0))}};Zc.u=function(){return $c};Zc.b=function(a){return a};Zc.a=function(a,b){return null!=a?Za(a,b):Za(L,b)};Zc.l=function(a,b,c){for(;;)if(x(c))a=Zc.a(a,b),b=J(c),c=M(c);else return Zc.a(a,b)};
Zc.G=function(a){var b=J(a),c=M(a);a=J(c);c=M(c);return Zc.l(b,a,c)};Zc.B=2;function R(a){if(null!=a)if(null!=a&&(a.g&2||a.tc))a=a.$(null);else if(Ma(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.g&8388608||a.Cc))a:{a=w(a);for(var b=0;;){if(Vc(a)){a=b+Wa(a);break a}a=M(a);b+=1}}else a=Wa(a);else a=0;return a}function ad(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return w(a)?J(a):c;if(Wc(a))return G.c(a,b,c);if(w(a)){var d=M(a),e=b-1;a=d;b=e}else return c}}
function bd(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.g&16||a.gc))return a.aa(null,b);if(Ma(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.g&64||a.A)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(w(c)){c=J(c);break a}throw Error("Index out of bounds");}if(Wc(c)){c=G.a(c,d);break a}if(w(c))c=M(c),--d;else throw Error("Index out of bounds");
}}return c}if(Pa($a,a))return G.a(a,b);throw Error([B("nth not supported on this type "),B(Qa(null==a?null:a.constructor))].join(""));}
function S(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.g&16||a.gc))return a.Ba(null,b,null);if(Ma(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.g&64||a.A))return ad(a,b);if(Pa($a,a))return G.a(a,b);throw Error([B("nth not supported on this type "),B(Qa(null==a?null:a.constructor))].join(""));}
var H=function H(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return H.a(arguments[0],arguments[1]);case 3:return H.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};H.a=function(a,b){return null==a?null:null!=a&&(a.g&256||a.hc)?a.P(null,b):Ma(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:Pa(fb,a)?gb.a(a,b):null};
H.c=function(a,b,c){return null!=a?null!=a&&(a.g&256||a.hc)?a.M(null,b,c):Ma(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:Pa(fb,a)?gb.c(a,b,c):c:c};H.B=3;cd;var T=function T(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return T.c(arguments[0],arguments[1],arguments[2]);default:return T.l(arguments[0],arguments[1],arguments[2],new Ja(c.slice(3),0))}};T.c=function(a,b,c){return null!=a?ib(a,b,c):dd([b],[c])};
T.l=function(a,b,c,d){for(;;)if(a=T.c(a,b,c),x(d))b=J(d),c=J(M(d)),d=M(M(d));else return a};T.G=function(a){var b=J(a),c=M(a);a=J(c);var d=M(c),c=J(d),d=M(d);return T.l(b,a,c,d)};T.B=3;var ed=function ed(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ed.b(arguments[0]);case 2:return ed.a(arguments[0],arguments[1]);default:return ed.l(arguments[0],arguments[1],new Ja(c.slice(2),0))}};ed.b=function(a){return a};
ed.a=function(a,b){return null==a?null:kb(a,b)};ed.l=function(a,b,c){for(;;){if(null==a)return null;a=ed.a(a,b);if(x(c))b=J(c),c=M(c);else return a}};ed.G=function(a){var b=J(a),c=M(a);a=J(c);c=M(c);return ed.l(b,a,c)};ed.B=2;function fd(a,b){this.i=a;this.s=b;this.g=393217;this.D=0}h=fd.prototype;h.S=function(){return this.s};h.T=function(a,b){return new fd(this.i,b)};
h.call=function(){function a(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K,X){a=this;return D.wb?D.wb(a.i,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K,X):D.call(null,a.i,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K,X)}function b(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K){a=this;return a.i.ra?a.i.ra(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K):a.i.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K)}function c(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E){a=this;return a.i.qa?a.i.qa(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E):
a.i.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E)}function d(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I){a=this;return a.i.pa?a.i.pa(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I):a.i.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I)}function e(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F){a=this;return a.i.oa?a.i.oa(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F):a.i.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F)}function f(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C){a=this;return a.i.na?a.i.na(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C):a.i.call(null,b,
c,d,e,f,g,k,l,m,n,r,t,u,v,z,C)}function g(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z){a=this;return a.i.ma?a.i.ma(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z):a.i.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z)}function k(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v){a=this;return a.i.la?a.i.la(b,c,d,e,f,g,k,l,m,n,r,t,u,v):a.i.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v)}function l(a,b,c,d,e,f,g,k,l,m,n,r,t,u){a=this;return a.i.ka?a.i.ka(b,c,d,e,f,g,k,l,m,n,r,t,u):a.i.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u)}function m(a,b,c,d,e,f,g,k,l,m,n,r,t){a=this;
return a.i.ja?a.i.ja(b,c,d,e,f,g,k,l,m,n,r,t):a.i.call(null,b,c,d,e,f,g,k,l,m,n,r,t)}function n(a,b,c,d,e,f,g,k,l,m,n,r){a=this;return a.i.ia?a.i.ia(b,c,d,e,f,g,k,l,m,n,r):a.i.call(null,b,c,d,e,f,g,k,l,m,n,r)}function r(a,b,c,d,e,f,g,k,l,m,n){a=this;return a.i.ha?a.i.ha(b,c,d,e,f,g,k,l,m,n):a.i.call(null,b,c,d,e,f,g,k,l,m,n)}function t(a,b,c,d,e,f,g,k,l,m){a=this;return a.i.ta?a.i.ta(b,c,d,e,f,g,k,l,m):a.i.call(null,b,c,d,e,f,g,k,l,m)}function u(a,b,c,d,e,f,g,k,l){a=this;return a.i.sa?a.i.sa(b,c,
d,e,f,g,k,l):a.i.call(null,b,c,d,e,f,g,k,l)}function v(a,b,c,d,e,f,g,k){a=this;return a.i.ca?a.i.ca(b,c,d,e,f,g,k):a.i.call(null,b,c,d,e,f,g,k)}function z(a,b,c,d,e,f,g){a=this;return a.i.X?a.i.X(b,c,d,e,f,g):a.i.call(null,b,c,d,e,f,g)}function C(a,b,c,d,e,f){a=this;return a.i.F?a.i.F(b,c,d,e,f):a.i.call(null,b,c,d,e,f)}function F(a,b,c,d,e){a=this;return a.i.v?a.i.v(b,c,d,e):a.i.call(null,b,c,d,e)}function I(a,b,c,d){a=this;return a.i.c?a.i.c(b,c,d):a.i.call(null,b,c,d)}function K(a,b,c){a=this;
return a.i.a?a.i.a(b,c):a.i.call(null,b,c)}function X(a,b){a=this;return a.i.b?a.i.b(b):a.i.call(null,b)}function wa(a){a=this;return a.i.u?a.i.u():a.i.call(null)}var E=null,E=function(ea,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta,E,eb,nb,vb,Nb,lc,Lc,Fd,ze,Og){switch(arguments.length){case 1:return wa.call(this,ea);case 2:return X.call(this,ea,O);case 3:return K.call(this,ea,O,ca);case 4:return I.call(this,ea,O,ca,fa);case 5:return F.call(this,ea,O,ca,fa,la);case 6:return C.call(this,ea,O,ca,fa,la,ma);case 7:return z.call(this,
ea,O,ca,fa,la,ma,ua);case 8:return v.call(this,ea,O,ca,fa,la,ma,ua,za);case 9:return u.call(this,ea,O,ca,fa,la,ma,ua,za,Aa);case 10:return t.call(this,ea,O,ca,fa,la,ma,ua,za,Aa,Ba);case 11:return r.call(this,ea,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa);case 12:return n.call(this,ea,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta);case 13:return m.call(this,ea,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta,E);case 14:return l.call(this,ea,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta,E,eb);case 15:return k.call(this,ea,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta,E,
eb,nb);case 16:return g.call(this,ea,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta,E,eb,nb,vb);case 17:return f.call(this,ea,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta,E,eb,nb,vb,Nb);case 18:return e.call(this,ea,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta,E,eb,nb,vb,Nb,lc);case 19:return d.call(this,ea,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta,E,eb,nb,vb,Nb,lc,Lc);case 20:return c.call(this,ea,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta,E,eb,nb,vb,Nb,lc,Lc,Fd);case 21:return b.call(this,ea,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta,E,eb,nb,vb,Nb,lc,Lc,Fd,ze);case 22:return a.call(this,
ea,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta,E,eb,nb,vb,Nb,lc,Lc,Fd,ze,Og)}throw Error("Invalid arity: "+arguments.length);};E.b=wa;E.a=X;E.c=K;E.v=I;E.F=F;E.X=C;E.ca=z;E.sa=v;E.ta=u;E.ha=t;E.ia=r;E.ja=n;E.ka=m;E.la=l;E.ma=k;E.na=g;E.oa=f;E.pa=e;E.qa=d;E.ra=c;E.Zb=b;E.wb=a;return E}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};h.u=function(){return this.i.u?this.i.u():this.i.call(null)};h.b=function(a){return this.i.b?this.i.b(a):this.i.call(null,a)};
h.a=function(a,b){return this.i.a?this.i.a(a,b):this.i.call(null,a,b)};h.c=function(a,b,c){return this.i.c?this.i.c(a,b,c):this.i.call(null,a,b,c)};h.v=function(a,b,c,d){return this.i.v?this.i.v(a,b,c,d):this.i.call(null,a,b,c,d)};h.F=function(a,b,c,d,e){return this.i.F?this.i.F(a,b,c,d,e):this.i.call(null,a,b,c,d,e)};h.X=function(a,b,c,d,e,f){return this.i.X?this.i.X(a,b,c,d,e,f):this.i.call(null,a,b,c,d,e,f)};
h.ca=function(a,b,c,d,e,f,g){return this.i.ca?this.i.ca(a,b,c,d,e,f,g):this.i.call(null,a,b,c,d,e,f,g)};h.sa=function(a,b,c,d,e,f,g,k){return this.i.sa?this.i.sa(a,b,c,d,e,f,g,k):this.i.call(null,a,b,c,d,e,f,g,k)};h.ta=function(a,b,c,d,e,f,g,k,l){return this.i.ta?this.i.ta(a,b,c,d,e,f,g,k,l):this.i.call(null,a,b,c,d,e,f,g,k,l)};h.ha=function(a,b,c,d,e,f,g,k,l,m){return this.i.ha?this.i.ha(a,b,c,d,e,f,g,k,l,m):this.i.call(null,a,b,c,d,e,f,g,k,l,m)};
h.ia=function(a,b,c,d,e,f,g,k,l,m,n){return this.i.ia?this.i.ia(a,b,c,d,e,f,g,k,l,m,n):this.i.call(null,a,b,c,d,e,f,g,k,l,m,n)};h.ja=function(a,b,c,d,e,f,g,k,l,m,n,r){return this.i.ja?this.i.ja(a,b,c,d,e,f,g,k,l,m,n,r):this.i.call(null,a,b,c,d,e,f,g,k,l,m,n,r)};h.ka=function(a,b,c,d,e,f,g,k,l,m,n,r,t){return this.i.ka?this.i.ka(a,b,c,d,e,f,g,k,l,m,n,r,t):this.i.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t)};
h.la=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u){return this.i.la?this.i.la(a,b,c,d,e,f,g,k,l,m,n,r,t,u):this.i.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u)};h.ma=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v){return this.i.ma?this.i.ma(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v):this.i.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v)};h.na=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z){return this.i.na?this.i.na(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z):this.i.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z)};
h.oa=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C){return this.i.oa?this.i.oa(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C):this.i.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C)};h.pa=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F){return this.i.pa?this.i.pa(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F):this.i.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F)};
h.qa=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I){return this.i.qa?this.i.qa(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I):this.i.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I)};h.ra=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K){return this.i.ra?this.i.ra(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K):this.i.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K)};
h.Zb=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,X){return D.wb?D.wb(this.i,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,X):D.call(null,this.i,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,X)};function Ic(a,b){return"function"==p(a)?new fd(a,b):null==a?null:yb(a,b)}function gd(a){var b=null!=a;return(b?null!=a?a.g&131072||a.yc||(a.g?0:Pa(wb,a)):Pa(wb,a):b)?xb(a):null}function hd(a){return null==a?!1:null!=a?a.g&8||a.Tc?!0:a.g?!1:Pa(Ya,a):Pa(Ya,a)}
function id(a){return null==a?!1:null!=a?a.g&4096||a.Zc?!0:a.g?!1:Pa(pb,a):Pa(pb,a)}function jd(a){return null!=a?a.g&16777216||a.Yc?!0:a.g?!1:Pa(Fb,a):Pa(Fb,a)}function kd(a){return null==a?!1:null!=a?a.g&1024||a.wc?!0:a.g?!1:Pa(jb,a):Pa(jb,a)}function ld(a){return null!=a?a.g&67108864||a.Xc?!0:a.g?!1:Pa(Hb,a):Pa(Hb,a)}function md(a){return null!=a?a.g&16384||a.$c?!0:a.g?!1:Pa(sb,a):Pa(sb,a)}nd;od;function pd(a){return null!=a?a.D&512||a.Sc?!0:!1:!1}
function qd(a){var b=[];ja(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function rd(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var sd={};function td(a){return null==a?!1:null!=a?a.g&64||a.A?!0:a.g?!1:Pa(ab,a):Pa(ab,a)}function ud(a){return null==a?!1:!1===a?!1:!0}function vd(a,b){return H.c(a,b,sd)===sd?!1:!0}
function mc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return oa(a,b);throw Error([B("Cannot compare "),B(a),B(" to "),B(b)].join(""));}if(null!=a?a.D&2048||a.ub||(a.D?0:Pa(Rb,a)):Pa(Rb,a))return Sb(a,b);if("string"!==typeof a&&!Ma(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([B("Cannot compare "),B(a),B(" to "),B(b)].join(""));return oa(a,b)}
function wd(a,b){var c=R(a),d=R(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=mc(bd(a,d),bd(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}function xd(a){return kc.a(a,mc)?mc:function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return"number"===typeof d?d:x(d)?-1:x(a.a?a.a(c,b):a.call(null,c,b))?1:0}}yd;function zd(a){var b;b=mc;w(a)?(a=yd.b?yd.b(a):yd.call(null,a),b=xd(b),pa(a,b),b=w(a)):b=L;return b}
var Yc=function Yc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Yc.a(arguments[0],arguments[1]);case 3:return Yc.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};Yc.a=function(a,b){var c=w(b);if(c){var d=J(c),c=M(c);return Ua.c?Ua.c(a,d,c):Ua.call(null,a,d,c)}return a.u?a.u():a.call(null)};
Yc.c=function(a,b,c){for(c=w(c);;)if(c){var d=J(c);b=a.a?a.a(b,d):a.call(null,b,d);if(Mc(b))return ub(b);c=M(c)}else return b};Yc.B=3;Ad;var Ua=function Ua(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ua.a(arguments[0],arguments[1]);case 3:return Ua.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
Ua.a=function(a,b){return null!=b&&(b.g&524288||b.Ac)?b.da(null,a):Ma(b)?Pc(b,a):"string"===typeof b?Pc(b,a):Pa(zb,b)?Ab.a(b,a):Yc.a(a,b)};Ua.c=function(a,b,c){return null!=c&&(c.g&524288||c.Ac)?c.ea(null,a,b):Ma(c)?Qc(c,a,b):"string"===typeof c?Qc(c,a,b):Pa(zb,c)?Ab.c(c,a,b):Yc.c(a,b,c)};Ua.B=3;function Bd(a){return a}
var Cd=function Cd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Cd.u();case 1:return Cd.b(arguments[0]);case 2:return Cd.a(arguments[0],arguments[1]);default:return Cd.l(arguments[0],arguments[1],new Ja(c.slice(2),0))}};Cd.u=function(){return 0};Cd.b=function(a){return a};Cd.a=function(a,b){return a+b};Cd.l=function(a,b,c){return Ua.c(Cd,a+b,c)};Cd.G=function(a){var b=J(a),c=M(a);a=J(c);c=M(c);return Cd.l(b,a,c)};Cd.B=2;
var Dd=function Dd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Dd.u();case 1:return Dd.b(arguments[0]);case 2:return Dd.a(arguments[0],arguments[1]);default:return Dd.l(arguments[0],arguments[1],new Ja(c.slice(2),0))}};Dd.u=function(){return 1};Dd.b=function(a){return a};Dd.a=function(a,b){return a*b};Dd.l=function(a,b,c){return Ua.c(Dd,a*b,c)};Dd.G=function(a){var b=J(a),c=M(a);a=J(c);c=M(c);return Dd.l(b,a,c)};Dd.B=2;qa.ed;
var Ed=function Ed(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ed.b(arguments[0]);case 2:return Ed.a(arguments[0],arguments[1]);default:return Ed.l(arguments[0],arguments[1],new Ja(c.slice(2),0))}};Ed.b=function(){return!0};Ed.a=function(a,b){return a<=b};Ed.l=function(a,b,c){for(;;)if(a<=b)if(M(c))a=b,b=J(c),c=M(c);else return b<=J(c);else return!1};Ed.G=function(a){var b=J(a),c=M(a);a=J(c);c=M(c);return Ed.l(b,a,c)};Ed.B=2;
var Gd=function Gd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Gd.b(arguments[0]);case 2:return Gd.a(arguments[0],arguments[1]);default:return Gd.l(arguments[0],arguments[1],new Ja(c.slice(2),0))}};Gd.b=function(){return!0};Gd.a=function(a,b){return a>=b};Gd.l=function(a,b,c){for(;;)if(a>=b)if(M(c))a=b,b=J(c),c=M(c);else return b>=J(c);else return!1};Gd.G=function(a){var b=J(a),c=M(a);a=J(c);c=M(c);return Gd.l(b,a,c)};Gd.B=2;
function Hd(a){return a-1}Id;function Id(a,b){return(a%b+b)%b}function Jd(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function Kd(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function Ld(a,b){for(var c=b,d=w(a);;)if(d&&0<c)--c,d=M(d);else return d}
var B=function B(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return B.u();case 1:return B.b(arguments[0]);default:return B.l(arguments[0],new Ja(c.slice(1),0))}};B.u=function(){return""};B.b=function(a){return null==a?"":""+a};B.l=function(a,b){for(var c=new ka(""+B(a)),d=b;;)if(x(d))c=c.append(""+B(J(d))),d=M(d);else return c.toString()};B.G=function(a){var b=J(a);a=M(a);return B.l(b,a)};B.B=1;U;Md;
function Hc(a,b){var c;if(jd(b))if(Vc(a)&&Vc(b)&&R(a)!==R(b))c=!1;else a:{c=w(a);for(var d=w(b);;){if(null==c){c=null==d;break a}if(null!=d&&kc.a(J(c),J(d)))c=M(c),d=M(d);else{c=!1;break a}}}else c=null;return ud(c)}function Sc(a){if(w(a)){var b=qc(J(a));for(a=M(a);;){if(null==a)return b;b=rc(b,qc(J(a)));a=M(a)}}else return 0}Nd;Od;Md;Pd;Qd;function Uc(a,b,c,d,e){this.s=a;this.first=b;this.za=c;this.count=d;this.w=e;this.g=65937646;this.D=8192}h=Uc.prototype;h.toString=function(){return cc(this)};
h.equiv=function(a){return this.C(null,a)};h.S=function(){return this.s};h.ua=function(){return 1===this.count?null:this.za};h.$=function(){return this.count};h.ab=function(){return this.first};h.bb=function(){return cb(this)};h.R=function(){var a=this.w;return null!=a?a:this.w=a=Dc(this)};h.C=function(a,b){return Hc(this,b)};h.ba=function(){return yb(L,this.s)};h.da=function(a,b){return Yc.a(b,this)};h.ea=function(a,b,c){return Yc.c(b,c,this)};h.fa=function(){return this.first};
h.va=function(){return 1===this.count?L:this.za};h.V=function(){return this};h.T=function(a,b){return new Uc(b,this.first,this.za,this.count,this.w)};h.Z=function(a,b){return new Uc(this.s,b,this,this.count+1,null)};function Rd(a){return null!=a?a.g&33554432||a.Wc?!0:a.g?!1:Pa(Gb,a):Pa(Gb,a)}Uc.prototype[Ra]=function(){return yc(this)};function Sd(a){this.s=a;this.g=65937614;this.D=8192}h=Sd.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.C(null,a)};h.S=function(){return this.s};
h.ua=function(){return null};h.$=function(){return 0};h.ab=function(){return null};h.bb=function(){throw Error("Can't pop empty list");};h.R=function(){return Ec};h.C=function(a,b){return Rd(b)||jd(b)?null==w(b):!1};h.ba=function(){return this};h.da=function(a,b){return Yc.a(b,this)};h.ea=function(a,b,c){return Yc.c(b,c,this)};h.fa=function(){return null};h.va=function(){return L};h.V=function(){return null};h.T=function(a,b){return new Sd(b)};h.Z=function(a,b){return new Uc(this.s,b,null,1,null)};
var L=new Sd(null);Sd.prototype[Ra]=function(){return yc(this)};var ic=function ic(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return ic.l(0<c.length?new Ja(c.slice(0),0):null)};ic.l=function(a){var b;if(a instanceof Ja&&0===a.o)b=a.f;else a:for(b=[];;)if(null!=a)b.push(a.fa(null)),a=a.ua(null);else break a;a=b.length;for(var c=L;;)if(0<a){var d=a-1,c=c.Z(null,b[a-1]);a=d}else return c};ic.B=0;ic.G=function(a){return ic.l(w(a))};
function Td(a,b,c,d){this.s=a;this.first=b;this.za=c;this.w=d;this.g=65929452;this.D=8192}h=Td.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.C(null,a)};h.S=function(){return this.s};h.ua=function(){return null==this.za?null:w(this.za)};h.R=function(){var a=this.w;return null!=a?a:this.w=a=Dc(this)};h.C=function(a,b){return Hc(this,b)};h.ba=function(){return Ic(L,this.s)};h.da=function(a,b){return Yc.a(b,this)};h.ea=function(a,b,c){return Yc.c(b,c,this)};h.fa=function(){return this.first};
h.va=function(){return null==this.za?L:this.za};h.V=function(){return this};h.T=function(a,b){return new Td(b,this.first,this.za,this.w)};h.Z=function(a,b){return new Td(null,b,this,this.w)};Td.prototype[Ra]=function(){return yc(this)};function Q(a,b){var c=null==b;return(c?c:null!=b&&(b.g&64||b.A))?new Td(null,a,b,null):new Td(null,a,w(b),null)}
function Ud(a,b){if(a.Ja===b.Ja)return 0;var c=Na(a.xa);if(x(c?b.xa:c))return-1;if(x(a.xa)){if(Na(b.xa))return 1;c=oa(a.xa,b.xa);return 0===c?oa(a.name,b.name):c}return oa(a.name,b.name)}function y(a,b,c,d){this.xa=a;this.name=b;this.Ja=c;this.kb=d;this.g=2153775105;this.D=4096}h=y.prototype;h.toString=function(){return[B(":"),B(this.Ja)].join("")};h.equiv=function(a){return this.C(null,a)};h.C=function(a,b){return b instanceof y?this.Ja===b.Ja:!1};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return H.a(c,this);case 3:return H.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return H.a(c,this)};a.c=function(a,c,d){return H.c(c,this,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};h.b=function(a){return H.a(a,this)};h.a=function(a,b){return H.c(a,this,b)};
h.R=function(){var a=this.kb;return null!=a?a:this.kb=a=rc(hc(this.name),pc(this.xa))+2654435769|0};h.zb=function(){return this.name};h.Ab=function(){return this.xa};h.O=function(a,b){return Ib(b,[B(":"),B(this.Ja)].join(""))};function Vd(a,b){return a===b?!0:a instanceof y&&b instanceof y?a.Ja===b.Ja:!1}
var Wd=function Wd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Wd.b(arguments[0]);case 2:return Wd.a(arguments[0],arguments[1]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
Wd.b=function(a){if(a instanceof y)return a;if(a instanceof jc){var b;if(null!=a&&(a.D&4096||a.zc))b=a.Ab(null);else throw Error([B("Doesn't support namespace: "),B(a)].join(""));return new y(b,Md.b?Md.b(a):Md.call(null,a),a.Ta,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new y(b[0],b[1],a,null):new y(null,b[0],a,null)):null};Wd.a=function(a,b){return new y(a,b,[B(x(a)?[B(a),B("/")].join(""):null),B(b)].join(""),null)};Wd.B=2;
function Xd(a,b,c,d){this.s=a;this.ob=b;this.I=c;this.w=d;this.g=32374988;this.D=0}h=Xd.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.C(null,a)};function Yd(a){null!=a.ob&&(a.I=a.ob.u?a.ob.u():a.ob.call(null),a.ob=null);return a.I}h.S=function(){return this.s};h.ua=function(){Eb(this);return null==this.I?null:M(this.I)};h.R=function(){var a=this.w;return null!=a?a:this.w=a=Dc(this)};h.C=function(a,b){return Hc(this,b)};h.ba=function(){return Ic(L,this.s)};
h.da=function(a,b){return Yc.a(b,this)};h.ea=function(a,b,c){return Yc.c(b,c,this)};h.fa=function(){Eb(this);return null==this.I?null:J(this.I)};h.va=function(){Eb(this);return null!=this.I?wc(this.I):L};h.V=function(){Yd(this);if(null==this.I)return null;for(var a=this.I;;)if(a instanceof Xd)a=Yd(a);else return this.I=a,w(this.I)};h.T=function(a,b){return new Xd(b,this.ob,this.I,this.w)};h.Z=function(a,b){return Q(b,this)};Xd.prototype[Ra]=function(){return yc(this)};Zd;
function $d(a,b){this.K=a;this.end=b;this.g=2;this.D=0}$d.prototype.add=function(a){this.K[this.end]=a;return this.end+=1};$d.prototype.L=function(){var a=new Zd(this.K,0,this.end);this.K=null;return a};$d.prototype.$=function(){return this.end};function ae(a){return new $d(Array(a),0)}function Zd(a,b,c){this.f=a;this.ga=b;this.end=c;this.g=524306;this.D=0}h=Zd.prototype;h.$=function(){return this.end-this.ga};h.aa=function(a,b){return this.f[this.ga+b]};
h.Ba=function(a,b,c){return 0<=b&&b<this.end-this.ga?this.f[this.ga+b]:c};h.fc=function(){if(this.ga===this.end)throw Error("-drop-first of empty chunk");return new Zd(this.f,this.ga+1,this.end)};h.da=function(a,b){return Rc(this.f,b,this.f[this.ga],this.ga+1)};h.ea=function(a,b,c){return Rc(this.f,b,c,this.ga)};function nd(a,b,c,d){this.L=a;this.Ra=b;this.s=c;this.w=d;this.g=31850732;this.D=1536}h=nd.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.C(null,a)};
h.S=function(){return this.s};h.ua=function(){if(1<Wa(this.L))return new nd(Tb(this.L),this.Ra,this.s,null);var a=Eb(this.Ra);return null==a?null:a};h.R=function(){var a=this.w;return null!=a?a:this.w=a=Dc(this)};h.C=function(a,b){return Hc(this,b)};h.ba=function(){return Ic(L,this.s)};h.fa=function(){return G.a(this.L,0)};h.va=function(){return 1<Wa(this.L)?new nd(Tb(this.L),this.Ra,this.s,null):null==this.Ra?L:this.Ra};h.V=function(){return this};h.Xb=function(){return this.L};
h.Yb=function(){return null==this.Ra?L:this.Ra};h.T=function(a,b){return new nd(this.L,this.Ra,b,this.w)};h.Z=function(a,b){return Q(b,this)};h.Wb=function(){return null==this.Ra?null:this.Ra};nd.prototype[Ra]=function(){return yc(this)};function be(a,b){return 0===Wa(a)?b:new nd(a,b,null,null)}function ce(a,b){a.add(b)}function Pd(a){return Ub(a)}function Qd(a){return Vb(a)}function yd(a){for(var b=[];;)if(w(a))b.push(J(a)),a=M(a);else return b}
function de(a){if("number"===typeof a)a:{var b=Array(a);if(td(null))for(var c=0,d=w(null);;)if(d&&c<a)b[c]=J(d),c+=1,d=M(d);else{a=b;break a}else{for(c=0;;)if(c<a)b[c]=null,c+=1;else break;a=b}}else a=Ha.b(a);return a}function ee(a,b){if(Vc(a))return R(a);for(var c=a,d=b,e=0;;)if(0<d&&w(c))c=M(c),--d,e+=1;else return e}
var fe=function fe(b){return null==b?null:null==M(b)?w(J(b)):Q(J(b),fe(M(b)))},ge=function ge(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ge.u();case 1:return ge.b(arguments[0]);case 2:return ge.a(arguments[0],arguments[1]);default:return ge.l(arguments[0],arguments[1],new Ja(c.slice(2),0))}};ge.u=function(){return new Xd(null,function(){return null},null,null)};ge.b=function(a){return new Xd(null,function(){return a},null,null)};
ge.a=function(a,b){return new Xd(null,function(){var c=w(a);return c?pd(c)?be(Ub(c),ge.a(Vb(c),b)):Q(J(c),ge.a(wc(c),b)):b},null,null)};ge.l=function(a,b,c){return function e(a,b){return new Xd(null,function(){var c=w(a);return c?pd(c)?be(Ub(c),e(Vb(c),b)):Q(J(c),e(wc(c),b)):x(b)?e(J(b),M(b)):null},null,null)}(ge.a(a,b),c)};ge.G=function(a){var b=J(a),c=M(a);a=J(c);c=M(c);return ge.l(b,a,c)};ge.B=2;function he(a){return Ob(a)}
var ie=function ie(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ie.u();case 1:return ie.b(arguments[0]);case 2:return ie.a(arguments[0],arguments[1]);default:return ie.l(arguments[0],arguments[1],new Ja(c.slice(2),0))}};ie.u=function(){return Lb($c)};ie.b=function(a){return a};ie.a=function(a,b){return Mb(a,b)};ie.l=function(a,b,c){for(;;)if(a=Mb(a,b),x(c))b=J(c),c=M(c);else return a};
ie.G=function(a){var b=J(a),c=M(a);a=J(c);c=M(c);return ie.l(b,a,c)};ie.B=2;
function je(a,b,c){var d=w(c);if(0===b)return a.u?a.u():a.call(null);c=bb(d);var e=cb(d);if(1===b)return a.b?a.b(c):a.b?a.b(c):a.call(null,c);var d=bb(e),f=cb(e);if(2===b)return a.a?a.a(c,d):a.a?a.a(c,d):a.call(null,c,d);var e=bb(f),g=cb(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=bb(g),k=cb(g);if(4===b)return a.v?a.v(c,d,e,f):a.v?a.v(c,d,e,f):a.call(null,c,d,e,f);var g=bb(k),l=cb(k);if(5===b)return a.F?a.F(c,d,e,f,g):a.F?a.F(c,d,e,f,g):a.call(null,c,d,e,f,g);var k=bb(l),
m=cb(l);if(6===b)return a.X?a.X(c,d,e,f,g,k):a.X?a.X(c,d,e,f,g,k):a.call(null,c,d,e,f,g,k);var l=bb(m),n=cb(m);if(7===b)return a.ca?a.ca(c,d,e,f,g,k,l):a.ca?a.ca(c,d,e,f,g,k,l):a.call(null,c,d,e,f,g,k,l);var m=bb(n),r=cb(n);if(8===b)return a.sa?a.sa(c,d,e,f,g,k,l,m):a.sa?a.sa(c,d,e,f,g,k,l,m):a.call(null,c,d,e,f,g,k,l,m);var n=bb(r),t=cb(r);if(9===b)return a.ta?a.ta(c,d,e,f,g,k,l,m,n):a.ta?a.ta(c,d,e,f,g,k,l,m,n):a.call(null,c,d,e,f,g,k,l,m,n);var r=bb(t),u=cb(t);if(10===b)return a.ha?a.ha(c,d,e,
f,g,k,l,m,n,r):a.ha?a.ha(c,d,e,f,g,k,l,m,n,r):a.call(null,c,d,e,f,g,k,l,m,n,r);var t=bb(u),v=cb(u);if(11===b)return a.ia?a.ia(c,d,e,f,g,k,l,m,n,r,t):a.ia?a.ia(c,d,e,f,g,k,l,m,n,r,t):a.call(null,c,d,e,f,g,k,l,m,n,r,t);var u=bb(v),z=cb(v);if(12===b)return a.ja?a.ja(c,d,e,f,g,k,l,m,n,r,t,u):a.ja?a.ja(c,d,e,f,g,k,l,m,n,r,t,u):a.call(null,c,d,e,f,g,k,l,m,n,r,t,u);var v=bb(z),C=cb(z);if(13===b)return a.ka?a.ka(c,d,e,f,g,k,l,m,n,r,t,u,v):a.ka?a.ka(c,d,e,f,g,k,l,m,n,r,t,u,v):a.call(null,c,d,e,f,g,k,l,m,n,
r,t,u,v);var z=bb(C),F=cb(C);if(14===b)return a.la?a.la(c,d,e,f,g,k,l,m,n,r,t,u,v,z):a.la?a.la(c,d,e,f,g,k,l,m,n,r,t,u,v,z):a.call(null,c,d,e,f,g,k,l,m,n,r,t,u,v,z);var C=bb(F),I=cb(F);if(15===b)return a.ma?a.ma(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C):a.ma?a.ma(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C):a.call(null,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C);var F=bb(I),K=cb(I);if(16===b)return a.na?a.na(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F):a.na?a.na(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F):a.call(null,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F);var I=
bb(K),X=cb(K);if(17===b)return a.oa?a.oa(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I):a.oa?a.oa(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I):a.call(null,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I);var K=bb(X),wa=cb(X);if(18===b)return a.pa?a.pa(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K):a.pa?a.pa(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K):a.call(null,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K);X=bb(wa);wa=cb(wa);if(19===b)return a.qa?a.qa(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,X):a.qa?a.qa(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,X):a.call(null,c,d,e,
f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,X);var E=bb(wa);cb(wa);if(20===b)return a.ra?a.ra(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,X,E):a.ra?a.ra(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,X,E):a.call(null,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,X,E);throw Error("Only up to 20 arguments supported on functions");}
var D=function D(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return D.a(arguments[0],arguments[1]);case 3:return D.c(arguments[0],arguments[1],arguments[2]);case 4:return D.v(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return D.F(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return D.l(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new Ja(c.slice(5),0))}};
D.a=function(a,b){var c=a.B;if(a.G){var d=ee(b,c+1);return d<=c?je(a,d,b):a.G(b)}return a.apply(a,yd(b))};D.c=function(a,b,c){b=Q(b,c);c=a.B;if(a.G){var d=ee(b,c+1);return d<=c?je(a,d,b):a.G(b)}return a.apply(a,yd(b))};D.v=function(a,b,c,d){b=Q(b,Q(c,d));c=a.B;return a.G?(d=ee(b,c+1),d<=c?je(a,d,b):a.G(b)):a.apply(a,yd(b))};D.F=function(a,b,c,d,e){b=Q(b,Q(c,Q(d,e)));c=a.B;return a.G?(d=ee(b,c+1),d<=c?je(a,d,b):a.G(b)):a.apply(a,yd(b))};
D.l=function(a,b,c,d,e,f){b=Q(b,Q(c,Q(d,Q(e,fe(f)))));c=a.B;return a.G?(d=ee(b,c+1),d<=c?je(a,d,b):a.G(b)):a.apply(a,yd(b))};D.G=function(a){var b=J(a),c=M(a);a=J(c);var d=M(c),c=J(d),e=M(d),d=J(e),f=M(e),e=J(f),f=M(f);return D.l(b,a,c,d,e,f)};D.B=5;function ke(a){return w(a)?a:null}
var le=function le(){"undefined"===typeof ra&&(ra=function(b,c){this.Oc=b;this.Nc=c;this.g=393216;this.D=0},ra.prototype.T=function(b,c){return new ra(this.Oc,c)},ra.prototype.S=function(){return this.Nc},ra.prototype.wa=function(){return!1},ra.prototype.next=function(){return Error("No such element")},ra.prototype.remove=function(){return Error("Unsupported operation")},ra.bc=function(){return new V(null,2,5,W,[Ic(me,new q(null,1,[ne,ic(oe,ic($c))],null)),qa.dd],null)},ra.Eb=!0,ra.eb="cljs.core/t_cljs$core20057",
ra.Qb=function(b,c){return Ib(c,"cljs.core/t_cljs$core20057")});return new ra(le,pe)};qe;function qe(a,b,c,d){this.rb=a;this.first=b;this.za=c;this.s=d;this.g=31719628;this.D=0}h=qe.prototype;h.T=function(a,b){return new qe(this.rb,this.first,this.za,b)};h.Z=function(a,b){return Q(b,Eb(this))};h.ba=function(){return L};h.C=function(a,b){return null!=Eb(this)?Hc(this,b):jd(b)&&null==w(b)};h.R=function(){return Dc(this)};h.V=function(){null!=this.rb&&this.rb.step(this);return null==this.za?null:this};
h.fa=function(){null!=this.rb&&Eb(this);return null==this.za?null:this.first};h.va=function(){null!=this.rb&&Eb(this);return null==this.za?L:this.za};h.ua=function(){null!=this.rb&&Eb(this);return null==this.za?null:Eb(this.za)};qe.prototype[Ra]=function(){return yc(this)};function re(a,b){for(;;){if(null==w(b))return!0;var c;c=J(b);c=a.b?a.b(c):a.call(null,c);if(x(c)){c=a;var d=M(b);a=c;b=d}else return!1}}
function se(a,b){for(;;)if(w(b)){var c;c=J(b);c=a.b?a.b(c):a.call(null,c);if(x(c))return c;c=a;var d=M(b);a=c;b=d}else return null}
function te(a){return function(){function b(b,c){return Na(a.a?a.a(b,c):a.call(null,b,c))}function c(b){return Na(a.b?a.b(b):a.call(null,b))}function d(){return Na(a.u?a.u():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new Ja(g,0)}return c.call(this,a,d,f)}function c(b,d,e){return Na(D.v(a,b,d,e))}b.B=2;b.G=function(a){var b=J(a);a=M(a);var d=J(a);a=wc(a);return c(b,d,a)};b.l=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new Ja(n,0)}return f.l(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.B=2;e.G=f.G;e.u=d;e.b=c;e.a=b;e.l=f.l;return e}()}
function ue(){return function(){function a(a){if(0<arguments.length)for(var c=0,d=Array(arguments.length-0);c<d.length;)d[c]=arguments[c+0],++c;return!1}a.B=0;a.G=function(a){w(a);return!1};a.l=function(){return!1};return a}()}
function ve(a,b){return function(){function c(c,d,e){return a.v?a.v(b,c,d,e):a.call(null,b,c,d,e)}function d(c,d){return a.c?a.c(b,c,d):a.call(null,b,c,d)}function e(c){return a.a?a.a(b,c):a.call(null,b,c)}function f(){return a.b?a.b(b):a.call(null,b)}var g=null,k=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,k=Array(arguments.length-3);g<k.length;)k[g]=arguments[g+3],++g;g=new Ja(k,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return D.l(a,b,c,e,f,uc([g],0))}c.B=
3;c.G=function(a){var b=J(a);a=M(a);var c=J(a);a=M(a);var e=J(a);a=wc(a);return d(b,c,e,a)};c.l=d;return c}(),g=function(a,b,g,r){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var t=null;if(3<arguments.length){for(var t=0,u=Array(arguments.length-3);t<u.length;)u[t]=arguments[t+3],++t;t=new Ja(u,0)}return k.l(a,b,g,t)}throw Error("Invalid arity: "+arguments.length);};g.B=3;g.G=k.G;g.u=f;g.b=
e;g.a=d;g.c=c;g.l=k.l;return g}()}we;function xe(a,b,c,d){this.state=a;this.s=b;this.rc=d;this.D=16386;this.g=6455296}h=xe.prototype;h.equiv=function(a){return this.C(null,a)};h.C=function(a,b){return this===b};h.vb=function(){return this.state};h.S=function(){return this.s};
h.jc=function(a,b,c){a=w(this.rc);for(var d=null,e=0,f=0;;)if(f<e){var g=d.aa(null,f),k=S(g,0),g=S(g,1);g.v?g.v(k,this,b,c):g.call(null,k,this,b,c);f+=1}else if(a=w(a))pd(a)?(d=Ub(a),a=Vb(a),k=d,e=R(d),d=k):(d=J(a),k=S(d,0),g=S(d,1),g.v?g.v(k,this,b,c):g.call(null,k,this,b,c),a=M(a),d=null,e=0),f=0;else return null};h.R=function(){return this[ba]||(this[ba]=++da)};
var ye=function ye(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ye.b(arguments[0]);default:return ye.l(arguments[0],new Ja(c.slice(1),0))}};ye.b=function(a){return new xe(a,null,0,null)};ye.l=function(a,b){var c=null!=b&&(b.g&64||b.A)?D.a(N,b):b,d=H.a(c,Ea);H.a(c,Ae);return new xe(a,d,0,null)};ye.G=function(a){var b=J(a);a=M(a);return ye.l(b,a)};ye.B=1;Be;
function Ce(a,b){if(a instanceof xe){var c=a.state;a.state=b;null!=a.rc&&Kb(a,c,b);return b}return Zb(a,b)}var De=function De(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return De.a(arguments[0],arguments[1]);case 3:return De.c(arguments[0],arguments[1],arguments[2]);case 4:return De.v(arguments[0],arguments[1],arguments[2],arguments[3]);default:return De.l(arguments[0],arguments[1],arguments[2],arguments[3],new Ja(c.slice(4),0))}};
De.a=function(a,b){var c;a instanceof xe?(c=a.state,c=b.b?b.b(c):b.call(null,c),c=Ce(a,c)):c=$b.a(a,b);return c};De.c=function(a,b,c){if(a instanceof xe){var d=a.state;b=b.a?b.a(d,c):b.call(null,d,c);a=Ce(a,b)}else a=$b.c(a,b,c);return a};De.v=function(a,b,c,d){if(a instanceof xe){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=Ce(a,b)}else a=$b.v(a,b,c,d);return a};De.l=function(a,b,c,d,e){return a instanceof xe?Ce(a,D.F(b,a.state,c,d,e)):$b.F(a,b,c,d,e)};
De.G=function(a){var b=J(a),c=M(a);a=J(c);var d=M(c),c=J(d),e=M(d),d=J(e),e=M(e);return De.l(b,a,c,d,e)};De.B=4;function Ee(a){this.state=a;this.g=32768;this.D=0}Ee.prototype.vb=function(){return this.state};function we(a){return new Ee(a)}
var U=function U(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return U.b(arguments[0]);case 2:return U.a(arguments[0],arguments[1]);case 3:return U.c(arguments[0],arguments[1],arguments[2]);case 4:return U.v(arguments[0],arguments[1],arguments[2],arguments[3]);default:return U.l(arguments[0],arguments[1],arguments[2],arguments[3],new Ja(c.slice(4),0))}};
U.b=function(a){return function(b){return function(){function c(c,d){var e=a.b?a.b(d):a.call(null,d);return b.a?b.a(c,e):b.call(null,c,e)}function d(a){return b.b?b.b(a):b.call(null,a)}function e(){return b.u?b.u():b.call(null)}var f=null,g=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new Ja(g,0)}return d.call(this,a,b,f)}function d(c,e,f){e=D.c(a,e,f);return b.a?b.a(c,e):b.call(null,c,e)}c.B=2;c.G=function(a){var b=
J(a);a=M(a);var c=J(a);a=wc(a);return d(b,c,a)};c.l=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,r=Array(arguments.length-2);n<r.length;)r[n]=arguments[n+2],++n;n=new Ja(r,0)}return g.l(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.B=2;f.G=g.G;f.u=e;f.b=d;f.a=c;f.l=g.l;return f}()}};
U.a=function(a,b){return new Xd(null,function(){var c=w(b);if(c){if(pd(c)){for(var d=Ub(c),e=R(d),f=ae(e),g=0;;)if(g<e)ce(f,function(){var b=G.a(d,g);return a.b?a.b(b):a.call(null,b)}()),g+=1;else break;return be(f.L(),U.a(a,Vb(c)))}return Q(function(){var b=J(c);return a.b?a.b(b):a.call(null,b)}(),U.a(a,wc(c)))}return null},null,null)};
U.c=function(a,b,c){return new Xd(null,function(){var d=w(b),e=w(c);if(d&&e){var f=Q,g;g=J(d);var k=J(e);g=a.a?a.a(g,k):a.call(null,g,k);d=f(g,U.c(a,wc(d),wc(e)))}else d=null;return d},null,null)};U.v=function(a,b,c,d){return new Xd(null,function(){var e=w(b),f=w(c),g=w(d);if(e&&f&&g){var k=Q,l;l=J(e);var m=J(f),n=J(g);l=a.c?a.c(l,m,n):a.call(null,l,m,n);e=k(l,U.v(a,wc(e),wc(f),wc(g)))}else e=null;return e},null,null)};
U.l=function(a,b,c,d,e){var f=function k(a){return new Xd(null,function(){var b=U.a(w,a);return re(Bd,b)?Q(U.a(J,b),k(U.a(wc,b))):null},null,null)};return U.a(function(){return function(b){return D.a(a,b)}}(f),f(Zc.l(e,d,uc([c,b],0))))};U.G=function(a){var b=J(a),c=M(a);a=J(c);var d=M(c),c=J(d),e=M(d),d=J(e),e=M(e);return U.l(b,a,c,d,e)};U.B=4;
function Fe(a){return new Xd(null,function(b){return function(){return b(1,a)}}(function(a,c){for(;;){var d=w(c);if(0<a&&d){var e=a-1,d=wc(d);a=e;c=d}else return d}}),null,null)}var Ge=function Ge(b){return new Xd(null,function(){var c=w(b);return c?ge.a(c,Ge(c)):null},null,null)};function He(a){return new Xd(null,function(){return Q(a,He(a))},null,null)}
var Ie=function Ie(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ie.a(arguments[0],arguments[1]);default:return Ie.l(arguments[0],arguments[1],new Ja(c.slice(2),0))}};Ie.a=function(a,b){return new Xd(null,function(){var c=w(a),d=w(b);return c&&d?Q(J(c),Q(J(d),Ie.a(wc(c),wc(d)))):null},null,null)};
Ie.l=function(a,b,c){return new Xd(null,function(){var d=U.a(w,Zc.l(c,b,uc([a],0)));return re(Bd,d)?ge.a(U.a(J,d),D.a(Ie,U.a(wc,d))):null},null,null)};Ie.G=function(a){var b=J(a),c=M(a);a=J(c);c=M(c);return Ie.l(b,a,c)};Ie.B=2;function Je(a){return Fe(Ie.a(He("L"),a))}Ke;
function Le(a,b){return new Xd(null,function(){var c=w(b);if(c){if(pd(c)){for(var d=Ub(c),e=R(d),f=ae(e),g=0;;)if(g<e){var k;k=G.a(d,g);k=a.b?a.b(k):a.call(null,k);x(k)&&(k=G.a(d,g),f.add(k));g+=1}else break;return be(f.L(),Le(a,Vb(c)))}d=J(c);c=wc(c);return x(a.b?a.b(d):a.call(null,d))?Q(d,Le(a,c)):Le(a,c)}return null},null,null)}function Me(a,b){return Le(te(a),b)}
function Ne(a,b){var c=w;return function e(b){return new Xd(null,function(){var g=Q,k;x(a.b?a.b(b):a.call(null,b))?(k=uc([c.b?c.b(b):c.call(null,b)],0),k=D.a(ge,D.c(U,e,k))):k=null;return g(b,k)},null,null)}(b)}function Oe(a){return Le(function(a){return!jd(a)},wc(Ne(jd,a)))}function Pe(a,b){return null!=a?null!=a&&(a.D&4||a.Uc)?Ic(he(Ua.c(Mb,Lb(a),b)),gd(a)):Ua.c(Za,a,b):Ua.c(Zc,L,b)}function Qe(a,b){return he(Ua.c(function(b,d){return ie.a(b,a.b?a.b(d):a.call(null,d))},Lb($c),b))}
function Re(a,b){var c;a:{c=sd;for(var d=a,e=w(b);;)if(e)if(null!=d?d.g&256||d.hc||(d.g?0:Pa(fb,d)):Pa(fb,d)){d=H.c(d,J(e),c);if(c===d){c=null;break a}e=M(e)}else{c=null;break a}else{c=d;break a}}return c}
var Se=function Se(b,c,d){var e=S(c,0);c=Ld(c,1);return x(c)?T.c(b,e,Se(H.a(b,e),c,d)):T.c(b,e,d)},Te=function Te(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Te.c(arguments[0],arguments[1],arguments[2]);case 4:return Te.v(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Te.F(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);case 6:return Te.X(arguments[0],arguments[1],arguments[2],arguments[3],
arguments[4],arguments[5]);default:return Te.l(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],new Ja(c.slice(6),0))}};Te.c=function(a,b,c){var d=S(b,0);b=Ld(b,1);return x(b)?T.c(a,d,Te.c(H.a(a,d),b,c)):T.c(a,d,function(){var b=H.a(a,d);return c.b?c.b(b):c.call(null,b)}())};Te.v=function(a,b,c,d){var e=S(b,0);b=Ld(b,1);return x(b)?T.c(a,e,Te.v(H.a(a,e),b,c,d)):T.c(a,e,function(){var b=H.a(a,e);return c.a?c.a(b,d):c.call(null,b,d)}())};
Te.F=function(a,b,c,d,e){var f=S(b,0);b=Ld(b,1);return x(b)?T.c(a,f,Te.F(H.a(a,f),b,c,d,e)):T.c(a,f,function(){var b=H.a(a,f);return c.c?c.c(b,d,e):c.call(null,b,d,e)}())};Te.X=function(a,b,c,d,e,f){var g=S(b,0);b=Ld(b,1);return x(b)?T.c(a,g,Te.X(H.a(a,g),b,c,d,e,f)):T.c(a,g,function(){var b=H.a(a,g);return c.v?c.v(b,d,e,f):c.call(null,b,d,e,f)}())};Te.l=function(a,b,c,d,e,f,g){var k=S(b,0);b=Ld(b,1);return x(b)?T.c(a,k,D.l(Te,H.a(a,k),b,c,d,uc([e,f,g],0))):T.c(a,k,D.l(c,H.a(a,k),d,e,f,uc([g],0)))};
Te.G=function(a){var b=J(a),c=M(a);a=J(c);var d=M(c),c=J(d),e=M(d),d=J(e),f=M(e),e=J(f),g=M(f),f=J(g),g=M(g);return Te.l(b,a,c,d,e,f,g)};Te.B=6;function Ue(a,b){return T.c(a,b,function(){var c=H.a(a,b);return wc.b?wc.b(c):wc.call(null,c)}())}function Ve(a,b,c,d){return T.c(a,b,function(){var e=H.a(a,b);return c.a?c.a(e,d):c.call(null,e,d)}())}function We(a,b){this.U=a;this.f=b}
function Xe(a){return new We(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function Ye(a){return new We(a.U,Sa(a.f))}function Ze(a){a=a.m;return 32>a?0:a-1>>>5<<5}function $e(a,b,c){for(;;){if(0===b)return c;var d=Xe(a);d.f[0]=c;c=d;b-=5}}var af=function af(b,c,d,e){var f=Ye(d),g=b.m-1>>>c&31;5===c?f.f[g]=e:(d=d.f[g],b=null!=d?af(b,c-5,d,e):$e(null,c-5,e),f.f[g]=b);return f};
function bf(a,b){throw Error([B("No item "),B(a),B(" in vector of length "),B(b)].join(""));}function cf(a,b){if(b>=Ze(a))return a.N;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.f[b>>>d&31],d=e;else return c.f}function df(a,b){return 0<=b&&b<a.m?cf(a,b):bf(b,a.m)}
var ef=function ef(b,c,d,e,f){var g=Ye(d);if(0===c)g.f[e&31]=f;else{var k=e>>>c&31;b=ef(b,c-5,d.f[k],e,f);g.f[k]=b}return g},ff=function ff(b,c,d){var e=b.m-2>>>c&31;if(5<c){b=ff(b,c-5,d.f[e]);if(null==b&&0===e)return null;d=Ye(d);d.f[e]=b;return d}if(0===e)return null;d=Ye(d);d.f[e]=null;return d};function gf(a,b,c,d,e,f){this.o=a;this.Ub=b;this.f=c;this.Ha=d;this.start=e;this.end=f}gf.prototype.wa=function(){return this.o<this.end};
gf.prototype.next=function(){32===this.o-this.Ub&&(this.f=cf(this.Ha,this.o),this.Ub+=32);var a=this.f[this.o&31];this.o+=1;return a};hf;jf;kf;P;lf;mf;nf;function V(a,b,c,d,e,f){this.s=a;this.m=b;this.shift=c;this.root=d;this.N=e;this.w=f;this.g=167668511;this.D=8196}h=V.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.C(null,a)};h.P=function(a,b){return gb.c(this,b,null)};h.M=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};
h.aa=function(a,b){return df(this,b)[b&31]};h.Ba=function(a,b,c){return 0<=b&&b<this.m?cf(this,b)[b&31]:c};h.cb=function(a,b,c){if(0<=b&&b<this.m)return Ze(this)<=b?(a=Sa(this.N),a[b&31]=c,new V(this.s,this.m,this.shift,this.root,a,null)):new V(this.s,this.m,this.shift,ef(this,this.shift,this.root,b,c),this.N,null);if(b===this.m)return Za(this,c);throw Error([B("Index "),B(b),B(" out of bounds  [0,"),B(this.m),B("]")].join(""));};
h.Ia=function(){var a=this.m;return new gf(0,0,0<R(this)?cf(this,0):null,this,0,a)};h.S=function(){return this.s};h.$=function(){return this.m};h.xb=function(){return G.a(this,0)};h.yb=function(){return G.a(this,1)};h.ab=function(){return 0<this.m?G.a(this,this.m-1):null};
h.bb=function(){if(0===this.m)throw Error("Can't pop empty vector");if(1===this.m)return yb($c,this.s);if(1<this.m-Ze(this))return new V(this.s,this.m-1,this.shift,this.root,this.N.slice(0,-1),null);var a=cf(this,this.m-2),b=ff(this,this.shift,this.root),b=null==b?W:b,c=this.m-1;return 5<this.shift&&null==b.f[1]?new V(this.s,c,this.shift-5,b.f[0],a,null):new V(this.s,c,this.shift,b,a,null)};h.R=function(){var a=this.w;return null!=a?a:this.w=a=Dc(this)};
h.C=function(a,b){if(b instanceof V)if(this.m===R(b))for(var c=ac(this),d=ac(b);;)if(x(c.wa())){var e=c.next(),f=d.next();if(!kc.a(e,f))return!1}else return!0;else return!1;else return Hc(this,b)};h.mb=function(){return new kf(this.m,this.shift,hf.b?hf.b(this.root):hf.call(null,this.root),jf.b?jf.b(this.N):jf.call(null,this.N))};h.ba=function(){return Ic($c,this.s)};h.da=function(a,b){return Nc(this,b)};
h.ea=function(a,b,c){a=0;for(var d=c;;)if(a<this.m){var e=cf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=e[f],d=b.a?b.a(d,g):b.call(null,d,g);if(Mc(d)){e=d;break a}f+=1}else{e=d;break a}if(Mc(e))return P.b?P.b(e):P.call(null,e);a+=c;d=e}else return d};h.Xa=function(a,b,c){if("number"===typeof b)return tb(this,b,c);throw Error("Vector's key for assoc must be a number.");};
h.V=function(){if(0===this.m)return null;if(32>=this.m)return new Ja(this.N,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.f[0];else{a=a.f;break a}}return nf.v?nf.v(this,a,0,0):nf.call(null,this,a,0,0)};h.T=function(a,b){return new V(b,this.m,this.shift,this.root,this.N,this.w)};
h.Z=function(a,b){if(32>this.m-Ze(this)){for(var c=this.N.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.N[e],e+=1;else break;d[c]=b;return new V(this.s,this.m+1,this.shift,this.root,d,null)}c=(d=this.m>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=Xe(null),d.f[0]=this.root,e=$e(null,this.shift,new We(null,this.N)),d.f[1]=e):d=af(this,this.shift,this.root,new We(null,this.N));return new V(this.s,this.m+1,c,d,[b],null)};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.aa(null,c);case 3:return this.Ba(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.aa(null,c)};a.c=function(a,c,d){return this.Ba(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};h.b=function(a){return this.aa(null,a)};h.a=function(a,b){return this.Ba(null,a,b)};
var W=new We(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),$c=new V(null,0,5,W,[],Ec);function of(a){var b=a.length;if(32>b)return new V(null,b,5,W,a,null);for(var c=32,d=(new V(null,32,5,W,a.slice(0,32),null)).mb(null);;)if(c<b)var e=c+1,d=ie.a(d,a[c]),c=e;else return Ob(d)}V.prototype[Ra]=function(){return yc(this)};function Ad(a){return Ma(a)?of(a):Ob(Ua.c(Mb,Lb($c),a))}
var pf=function pf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return pf.l(0<c.length?new Ja(c.slice(0),0):null)};pf.l=function(a){return a instanceof Ja&&0===a.o?of(a.f):Ad(a)};pf.B=0;pf.G=function(a){return pf.l(w(a))};qf;function od(a,b,c,d,e,f){this.Da=a;this.node=b;this.o=c;this.ga=d;this.s=e;this.w=f;this.g=32375020;this.D=1536}h=od.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.C(null,a)};h.S=function(){return this.s};
h.ua=function(){if(this.ga+1<this.node.length){var a;a=this.Da;var b=this.node,c=this.o,d=this.ga+1;a=nf.v?nf.v(a,b,c,d):nf.call(null,a,b,c,d);return null==a?null:a}return Wb(this)};h.R=function(){var a=this.w;return null!=a?a:this.w=a=Dc(this)};h.C=function(a,b){return Hc(this,b)};h.ba=function(){return Ic($c,this.s)};h.da=function(a,b){var c;c=this.Da;var d=this.o+this.ga,e=R(this.Da);c=qf.c?qf.c(c,d,e):qf.call(null,c,d,e);return Nc(c,b)};
h.ea=function(a,b,c){a=this.Da;var d=this.o+this.ga,e=R(this.Da);a=qf.c?qf.c(a,d,e):qf.call(null,a,d,e);return Oc(a,b,c)};h.fa=function(){return this.node[this.ga]};h.va=function(){if(this.ga+1<this.node.length){var a;a=this.Da;var b=this.node,c=this.o,d=this.ga+1;a=nf.v?nf.v(a,b,c,d):nf.call(null,a,b,c,d);return null==a?L:a}return Vb(this)};h.V=function(){return this};h.Xb=function(){var a=this.node;return new Zd(a,this.ga,a.length)};
h.Yb=function(){var a=this.o+this.node.length;if(a<Wa(this.Da)){var b=this.Da,c=cf(this.Da,a);return nf.v?nf.v(b,c,a,0):nf.call(null,b,c,a,0)}return L};h.T=function(a,b){return nf.F?nf.F(this.Da,this.node,this.o,this.ga,b):nf.call(null,this.Da,this.node,this.o,this.ga,b)};h.Z=function(a,b){return Q(b,this)};h.Wb=function(){var a=this.o+this.node.length;if(a<Wa(this.Da)){var b=this.Da,c=cf(this.Da,a);return nf.v?nf.v(b,c,a,0):nf.call(null,b,c,a,0)}return null};od.prototype[Ra]=function(){return yc(this)};
var nf=function nf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return nf.c(arguments[0],arguments[1],arguments[2]);case 4:return nf.v(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return nf.F(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};nf.c=function(a,b,c){return new od(a,df(a,b),b,c,null,null)};
nf.v=function(a,b,c,d){return new od(a,b,c,d,null,null)};nf.F=function(a,b,c,d,e){return new od(a,b,c,d,e,null)};nf.B=5;rf;function sf(a,b,c,d,e){this.s=a;this.Ha=b;this.start=c;this.end=d;this.w=e;this.g=167666463;this.D=8192}h=sf.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.C(null,a)};h.P=function(a,b){return gb.c(this,b,null)};h.M=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};
h.aa=function(a,b){return 0>b||this.end<=this.start+b?bf(b,this.end-this.start):G.a(this.Ha,this.start+b)};h.Ba=function(a,b,c){return 0>b||this.end<=this.start+b?c:G.c(this.Ha,this.start+b,c)};h.cb=function(a,b,c){var d=this.start+b;a=this.s;c=T.c(this.Ha,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return rf.F?rf.F(a,c,b,d,null):rf.call(null,a,c,b,d,null)};h.S=function(){return this.s};h.$=function(){return this.end-this.start};h.ab=function(){return G.a(this.Ha,this.end-1)};
h.bb=function(){if(this.start===this.end)throw Error("Can't pop empty vector");var a=this.s,b=this.Ha,c=this.start,d=this.end-1;return rf.F?rf.F(a,b,c,d,null):rf.call(null,a,b,c,d,null)};h.R=function(){var a=this.w;return null!=a?a:this.w=a=Dc(this)};h.C=function(a,b){return Hc(this,b)};h.ba=function(){return Ic($c,this.s)};h.da=function(a,b){return Nc(this,b)};h.ea=function(a,b,c){return Oc(this,b,c)};
h.Xa=function(a,b,c){if("number"===typeof b)return tb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};h.V=function(){var a=this;return function(b){return function d(e){return e===a.end?null:Q(G.a(a.Ha,e),new Xd(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};h.T=function(a,b){return rf.F?rf.F(b,this.Ha,this.start,this.end,this.w):rf.call(null,b,this.Ha,this.start,this.end,this.w)};
h.Z=function(a,b){var c=this.s,d=tb(this.Ha,this.end,b),e=this.start,f=this.end+1;return rf.F?rf.F(c,d,e,f,null):rf.call(null,c,d,e,f,null)};h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.aa(null,c);case 3:return this.Ba(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.aa(null,c)};a.c=function(a,c,d){return this.Ba(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};
h.b=function(a){return this.aa(null,a)};h.a=function(a,b){return this.Ba(null,a,b)};sf.prototype[Ra]=function(){return yc(this)};function rf(a,b,c,d,e){for(;;)if(b instanceof sf)c=b.start+c,d=b.start+d,b=b.Ha;else{var f=R(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new sf(a,b,c,d,e)}}
var qf=function qf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return qf.a(arguments[0],arguments[1]);case 3:return qf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};qf.a=function(a,b){return qf.c(a,b,R(a))};qf.c=function(a,b,c){return rf(null,a,b,c,null)};qf.B=3;function tf(a,b){return a===b.U?b:new We(a,Sa(b.f))}function hf(a){return new We({},Sa(a.f))}
function jf(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];rd(a,0,b,0,a.length);return b}var uf=function uf(b,c,d,e){d=tf(b.root.U,d);var f=b.m-1>>>c&31;if(5===c)b=e;else{var g=d.f[f];b=null!=g?uf(b,c-5,g,e):$e(b.root.U,c-5,e)}d.f[f]=b;return d};function kf(a,b,c,d){this.m=a;this.shift=b;this.root=c;this.N=d;this.D=88;this.g=275}h=kf.prototype;
h.Cb=function(a,b){if(this.root.U){if(32>this.m-Ze(this))this.N[this.m&31]=b;else{var c=new We(this.root.U,this.N),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.N=d;if(this.m>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=$e(this.root.U,this.shift,c);this.root=new We(this.root.U,d);this.shift=e}else this.root=uf(this,this.shift,this.root,c)}this.m+=1;return this}throw Error("conj! after persistent!");};h.Db=function(){if(this.root.U){this.root.U=null;var a=this.m-Ze(this),b=Array(a);rd(this.N,0,b,0,a);return new V(null,this.m,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
h.Bb=function(a,b,c){if("number"===typeof b)return Qb(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
h.ic=function(a,b,c){var d=this;if(d.root.U){if(0<=b&&b<d.m)return Ze(this)<=b?d.N[b&31]=c:(a=function(){return function f(a,k){var l=tf(d.root.U,k);if(0===a)l.f[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.m)return Mb(this,c);throw Error([B("Index "),B(b),B(" out of bounds for TransientVector of length"),B(d.m)].join(""));}throw Error("assoc! after persistent!");};
h.$=function(){if(this.root.U)return this.m;throw Error("count after persistent!");};h.aa=function(a,b){if(this.root.U)return df(this,b)[b&31];throw Error("nth after persistent!");};h.Ba=function(a,b,c){return 0<=b&&b<this.m?G.a(this,b):c};h.P=function(a,b){return gb.c(this,b,null)};h.M=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.P(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.P(null,c)};a.c=function(a,c,d){return this.M(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};h.b=function(a){return this.P(null,a)};h.a=function(a,b){return this.M(null,a,b)};function vf(){this.g=2097152;this.D=0}
vf.prototype.equiv=function(a){return this.C(null,a)};vf.prototype.C=function(){return!1};var wf=new vf;function xf(a,b){return ud(kd(b)?R(a)===R(b)?re(Bd,U.a(function(a){return kc.a(H.c(b,J(a),wf),J(M(a)))},a)):null:null)}function yf(a,b,c,d,e){this.o=a;this.Qc=b;this.dc=c;this.Jc=d;this.pc=e}yf.prototype.wa=function(){var a=this.o<this.dc;return a?a:this.pc.wa()};yf.prototype.next=function(){if(this.o<this.dc){var a=bd(this.Jc,this.o);this.o+=1;return new V(null,2,5,W,[a,gb.a(this.Qc,a)],null)}return this.pc.next()};
yf.prototype.remove=function(){return Error("Unsupported operation")};function zf(a){this.I=a}zf.prototype.next=function(){if(null!=this.I){var a=J(this.I),b=S(a,0),a=S(a,1);this.I=M(this.I);return{value:[b,a],done:!1}}return{value:null,done:!0}};function Af(a){return new zf(w(a))}function Bf(a){this.I=a}Bf.prototype.next=function(){if(null!=this.I){var a=J(this.I);this.I=M(this.I);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function Cf(a,b){var c;if(b instanceof y)a:{c=a.length;for(var d=b.Ja,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof y&&d===a[e].Ja){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof jc)a:for(c=a.length,d=b.Ta,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof jc&&d===a[e].Ta){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(kc.a(b,a[d])){c=d;break a}d+=2}return c}Df;function Ef(a,b,c){this.f=a;this.o=b;this.Aa=c;this.g=32374990;this.D=0}h=Ef.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.C(null,a)};h.S=function(){return this.Aa};h.ua=function(){return this.o<this.f.length-2?new Ef(this.f,this.o+2,this.Aa):null};h.$=function(){return(this.f.length-this.o)/2};h.R=function(){return Dc(this)};h.C=function(a,b){return Hc(this,b)};
h.ba=function(){return Ic(L,this.Aa)};h.da=function(a,b){return Yc.a(b,this)};h.ea=function(a,b,c){return Yc.c(b,c,this)};h.fa=function(){return new V(null,2,5,W,[this.f[this.o],this.f[this.o+1]],null)};h.va=function(){return this.o<this.f.length-2?new Ef(this.f,this.o+2,this.Aa):L};h.V=function(){return this};h.T=function(a,b){return new Ef(this.f,this.o,b)};h.Z=function(a,b){return Q(b,this)};Ef.prototype[Ra]=function(){return yc(this)};Ff;Gf;function Hf(a,b,c){this.f=a;this.o=b;this.m=c}
Hf.prototype.wa=function(){return this.o<this.m};Hf.prototype.next=function(){var a=new V(null,2,5,W,[this.f[this.o],this.f[this.o+1]],null);this.o+=2;return a};function q(a,b,c,d){this.s=a;this.m=b;this.f=c;this.w=d;this.g=16647951;this.D=8196}h=q.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.C(null,a)};h.keys=function(){return yc(Ff.b?Ff.b(this):Ff.call(null,this))};h.entries=function(){return Af(w(this))};
h.values=function(){return yc(Gf.b?Gf.b(this):Gf.call(null,this))};h.has=function(a){return vd(this,a)};h.get=function(a,b){return this.M(null,a,b)};h.forEach=function(a){for(var b=w(this),c=null,d=0,e=0;;)if(e<d){var f=c.aa(null,e),g=S(f,0),f=S(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=w(b))pd(b)?(c=Ub(b),b=Vb(b),g=c,d=R(c),c=g):(c=J(b),g=S(c,0),f=S(c,1),a.a?a.a(f,g):a.call(null,f,g),b=M(b),c=null,d=0),e=0;else return null};h.P=function(a,b){return gb.c(this,b,null)};
h.M=function(a,b,c){a=Cf(this.f,b);return-1===a?c:this.f[a+1]};h.Ia=function(){return new Hf(this.f,0,2*this.m)};h.S=function(){return this.s};h.$=function(){return this.m};h.R=function(){var a=this.w;return null!=a?a:this.w=a=Fc(this)};h.C=function(a,b){if(null!=b&&(b.g&1024||b.wc)){var c=this.f.length;if(this.m===b.$(null))for(var d=0;;)if(d<c){var e=b.M(null,this.f[d],sd);if(e!==sd)if(kc.a(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return xf(this,b)};
h.mb=function(){return new Df({},this.f.length,Sa(this.f))};h.ba=function(){return yb(pe,this.s)};h.da=function(a,b){return Yc.a(b,this)};h.ea=function(a,b,c){return Yc.c(b,c,this)};h.Mb=function(a,b){if(0<=Cf(this.f,b)){var c=this.f.length,d=c-2;if(0===d)return Xa(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new q(this.s,this.m-1,d,null);kc.a(b,this.f[e])||(d[f]=this.f[e],d[f+1]=this.f[e+1],f+=2);e+=2}}else return this};
h.Xa=function(a,b,c){a=Cf(this.f,b);if(-1===a){if(this.m<If){a=this.f;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new q(this.s,this.m+1,e,null)}return yb(ib(Pe(Jf,this),b,c),this.s)}if(c===this.f[a+1])return this;b=Sa(this.f);b[a+1]=c;return new q(this.s,this.m,b,null)};h.Vb=function(a,b){return-1!==Cf(this.f,b)};h.V=function(){var a=this.f;return 0<=a.length-2?new Ef(a,0,null):null};h.T=function(a,b){return new q(b,this.m,this.f,this.w)};
h.Z=function(a,b){if(md(b))return ib(this,G.a(b,0),G.a(b,1));for(var c=this,d=w(b);;){if(null==d)return c;var e=J(d);if(md(e))c=ib(c,G.a(e,0),G.a(e,1)),d=M(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.P(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.P(null,c)};a.c=function(a,c,d){return this.M(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};h.b=function(a){return this.P(null,a)};h.a=function(a,b){return this.M(null,a,b)};var pe=new q(null,0,[],Gc),If=8;q.prototype[Ra]=function(){return yc(this)};
Kf;function Df(a,b,c){this.nb=a;this.ib=b;this.f=c;this.g=258;this.D=56}h=Df.prototype;h.$=function(){if(x(this.nb))return Jd(this.ib);throw Error("count after persistent!");};h.P=function(a,b){return gb.c(this,b,null)};h.M=function(a,b,c){if(x(this.nb))return a=Cf(this.f,b),-1===a?c:this.f[a+1];throw Error("lookup after persistent!");};
h.Cb=function(a,b){if(x(this.nb)){if(null!=b?b.g&2048||b.xc||(b.g?0:Pa(lb,b)):Pa(lb,b))return Pb(this,Nd.b?Nd.b(b):Nd.call(null,b),Od.b?Od.b(b):Od.call(null,b));for(var c=w(b),d=this;;){var e=J(c);if(x(e))c=M(c),d=Pb(d,Nd.b?Nd.b(e):Nd.call(null,e),Od.b?Od.b(e):Od.call(null,e));else return d}}else throw Error("conj! after persistent!");};h.Db=function(){if(x(this.nb))return this.nb=!1,new q(null,Jd(this.ib),this.f,null);throw Error("persistent! called twice");};
h.Bb=function(a,b,c){if(x(this.nb)){a=Cf(this.f,b);if(-1===a){if(this.ib+2<=2*If)return this.ib+=2,this.f.push(b),this.f.push(c),this;a=Kf.a?Kf.a(this.ib,this.f):Kf.call(null,this.ib,this.f);return Pb(a,b,c)}c!==this.f[a+1]&&(this.f[a+1]=c);return this}throw Error("assoc! after persistent!");};Lf;cd;function Kf(a,b){for(var c=Lb(Jf),d=0;;)if(d<a)c=Pb(c,b[d],b[d+1]),d+=2;else return c}function Mf(){this.H=!1}Nf;Of;Ce;Pf;ye;P;function Qf(a,b){return a===b?!0:Vd(a,b)?!0:kc.a(a,b)}
function Rf(a,b,c){a=Sa(a);a[b]=c;return a}function Sf(a,b){var c=Array(a.length-2);rd(a,0,c,0,2*b);rd(a,2*(b+1),c,2*b,c.length-2*b);return c}function Tf(a,b,c,d){a=a.fb(b);a.f[c]=d;return a}Uf;function Vf(a,b,c,d){this.f=a;this.o=b;this.Kb=c;this.Ma=d}Vf.prototype.advance=function(){for(var a=this.f.length;;)if(this.o<a){var b=this.f[this.o],c=this.f[this.o+1];null!=b?b=this.Kb=new V(null,2,5,W,[b,c],null):null!=c?(b=ac(c),b=b.wa()?this.Ma=b:!1):b=!1;this.o+=2;if(b)return!0}else return!1};
Vf.prototype.wa=function(){var a=null!=this.Kb;return a?a:(a=null!=this.Ma)?a:this.advance()};Vf.prototype.next=function(){if(null!=this.Kb){var a=this.Kb;this.Kb=null;return a}if(null!=this.Ma)return a=this.Ma.next(),this.Ma.wa()||(this.Ma=null),a;if(this.advance())return this.next();throw Error("No such element");};Vf.prototype.remove=function(){return Error("Unsupported operation")};function Wf(a,b,c){this.U=a;this.W=b;this.f=c}h=Wf.prototype;
h.fb=function(a){if(a===this.U)return this;var b=Kd(this.W),c=Array(0>b?4:2*(b+1));rd(this.f,0,c,0,2*b);return new Wf(a,this.W,c)};h.Hb=function(){return Nf.b?Nf.b(this.f):Nf.call(null,this.f)};h.Ya=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.W&e))return d;var f=Kd(this.W&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.Ya(a+5,b,c,d):Qf(c,e)?f:d};
h.La=function(a,b,c,d,e,f){var g=1<<(c>>>b&31),k=Kd(this.W&g-1);if(0===(this.W&g)){var l=Kd(this.W);if(2*l<this.f.length){a=this.fb(a);b=a.f;f.H=!0;a:for(c=2*(l-k),f=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*k]=d;b[2*k+1]=e;a.W|=g;return a}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>b&31]=Xf.La(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.W>>>d&1)&&(k[d]=null!=this.f[e]?Xf.La(a,b+5,qc(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new Uf(a,l+1,k)}b=Array(2*(l+4));rd(this.f,0,b,0,2*k);b[2*k]=d;b[2*k+1]=e;rd(this.f,2*k,b,2*(k+1),2*(l-k));f.H=!0;a=this.fb(a);a.f=b;a.W|=g;return a}l=this.f[2*k];g=this.f[2*k+1];if(null==l)return l=g.La(a,b+5,c,d,e,f),l===g?this:Tf(this,a,2*k+1,l);if(Qf(d,l))return e===g?this:Tf(this,a,2*k+1,e);f.H=!0;f=b+5;d=Pf.ca?Pf.ca(a,f,l,g,c,d,e):Pf.call(null,a,f,l,g,c,d,e);e=2*
k;k=2*k+1;a=this.fb(a);a.f[e]=null;a.f[k]=d;return a};
h.Ka=function(a,b,c,d,e){var f=1<<(b>>>a&31),g=Kd(this.W&f-1);if(0===(this.W&f)){var k=Kd(this.W);if(16<=k){g=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];g[b>>>a&31]=Xf.Ka(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.W>>>c&1)&&(g[c]=null!=this.f[d]?Xf.Ka(a+5,qc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new Uf(null,k+1,g)}a=Array(2*(k+1));rd(this.f,
0,a,0,2*g);a[2*g]=c;a[2*g+1]=d;rd(this.f,2*g,a,2*(g+1),2*(k-g));e.H=!0;return new Wf(null,this.W|f,a)}var l=this.f[2*g],f=this.f[2*g+1];if(null==l)return k=f.Ka(a+5,b,c,d,e),k===f?this:new Wf(null,this.W,Rf(this.f,2*g+1,k));if(Qf(c,l))return d===f?this:new Wf(null,this.W,Rf(this.f,2*g+1,d));e.H=!0;e=this.W;k=this.f;a+=5;a=Pf.X?Pf.X(a,l,f,b,c,d):Pf.call(null,a,l,f,b,c,d);c=2*g;g=2*g+1;d=Sa(k);d[c]=null;d[g]=a;return new Wf(null,e,d)};
h.Ib=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.W&d))return this;var e=Kd(this.W&d-1),f=this.f[2*e],g=this.f[2*e+1];return null==f?(a=g.Ib(a+5,b,c),a===g?this:null!=a?new Wf(null,this.W,Rf(this.f,2*e+1,a)):this.W===d?null:new Wf(null,this.W^d,Sf(this.f,e))):Qf(c,f)?new Wf(null,this.W^d,Sf(this.f,e)):this};h.Ia=function(){return new Vf(this.f,0,null,null)};var Xf=new Wf(null,0,[]);function Yf(a,b,c){this.f=a;this.o=b;this.Ma=c}
Yf.prototype.wa=function(){for(var a=this.f.length;;){if(null!=this.Ma&&this.Ma.wa())return!0;if(this.o<a){var b=this.f[this.o];this.o+=1;null!=b&&(this.Ma=ac(b))}else return!1}};Yf.prototype.next=function(){if(this.wa())return this.Ma.next();throw Error("No such element");};Yf.prototype.remove=function(){return Error("Unsupported operation")};function Uf(a,b,c){this.U=a;this.m=b;this.f=c}h=Uf.prototype;h.fb=function(a){return a===this.U?this:new Uf(a,this.m,Sa(this.f))};
h.Hb=function(){return Of.b?Of.b(this.f):Of.call(null,this.f)};h.Ya=function(a,b,c,d){var e=this.f[b>>>a&31];return null!=e?e.Ya(a+5,b,c,d):d};h.La=function(a,b,c,d,e,f){var g=c>>>b&31,k=this.f[g];if(null==k)return a=Tf(this,a,g,Xf.La(a,b+5,c,d,e,f)),a.m+=1,a;b=k.La(a,b+5,c,d,e,f);return b===k?this:Tf(this,a,g,b)};
h.Ka=function(a,b,c,d,e){var f=b>>>a&31,g=this.f[f];if(null==g)return new Uf(null,this.m+1,Rf(this.f,f,Xf.Ka(a+5,b,c,d,e)));a=g.Ka(a+5,b,c,d,e);return a===g?this:new Uf(null,this.m,Rf(this.f,f,a))};
h.Ib=function(a,b,c){var d=b>>>a&31,e=this.f[d];if(null!=e){a=e.Ib(a+5,b,c);if(a===e)d=this;else if(null==a)if(8>=this.m)a:{e=this.f;a=e.length;b=Array(2*(this.m-1));c=0;for(var f=1,g=0;;)if(c<a)c!==d&&null!=e[c]&&(b[f]=e[c],f+=2,g|=1<<c),c+=1;else{d=new Wf(null,g,b);break a}}else d=new Uf(null,this.m-1,Rf(this.f,d,a));else d=new Uf(null,this.m,Rf(this.f,d,a));return d}return this};h.Ia=function(){return new Yf(this.f,0,null)};
function Zf(a,b,c){b*=2;for(var d=0;;)if(d<b){if(Qf(c,a[d]))return d;d+=2}else return-1}function $f(a,b,c,d){this.U=a;this.Va=b;this.m=c;this.f=d}h=$f.prototype;h.fb=function(a){if(a===this.U)return this;var b=Array(2*(this.m+1));rd(this.f,0,b,0,2*this.m);return new $f(a,this.Va,this.m,b)};h.Hb=function(){return Nf.b?Nf.b(this.f):Nf.call(null,this.f)};h.Ya=function(a,b,c,d){a=Zf(this.f,this.m,c);return 0>a?d:Qf(c,this.f[a])?this.f[a+1]:d};
h.La=function(a,b,c,d,e,f){if(c===this.Va){b=Zf(this.f,this.m,d);if(-1===b){if(this.f.length>2*this.m)return b=2*this.m,c=2*this.m+1,a=this.fb(a),a.f[b]=d,a.f[c]=e,f.H=!0,a.m+=1,a;c=this.f.length;b=Array(c+2);rd(this.f,0,b,0,c);b[c]=d;b[c+1]=e;f.H=!0;d=this.m+1;a===this.U?(this.f=b,this.m=d,a=this):a=new $f(this.U,this.Va,d,b);return a}return this.f[b+1]===e?this:Tf(this,a,b+1,e)}return(new Wf(a,1<<(this.Va>>>b&31),[null,this,null,null])).La(a,b,c,d,e,f)};
h.Ka=function(a,b,c,d,e){return b===this.Va?(a=Zf(this.f,this.m,c),-1===a?(a=2*this.m,b=Array(a+2),rd(this.f,0,b,0,a),b[a]=c,b[a+1]=d,e.H=!0,new $f(null,this.Va,this.m+1,b)):kc.a(this.f[a],d)?this:new $f(null,this.Va,this.m,Rf(this.f,a+1,d))):(new Wf(null,1<<(this.Va>>>a&31),[null,this])).Ka(a,b,c,d,e)};h.Ib=function(a,b,c){a=Zf(this.f,this.m,c);return-1===a?this:1===this.m?null:new $f(null,this.Va,this.m-1,Sf(this.f,Jd(a)))};h.Ia=function(){return new Vf(this.f,0,null,null)};
var Pf=function Pf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return Pf.X(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return Pf.ca(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
Pf.X=function(a,b,c,d,e,f){var g=qc(b);if(g===d)return new $f(null,g,2,[b,c,e,f]);var k=new Mf;return Xf.Ka(a,g,b,c,k).Ka(a,d,e,f,k)};Pf.ca=function(a,b,c,d,e,f,g){var k=qc(c);if(k===e)return new $f(null,k,2,[c,d,f,g]);var l=new Mf;return Xf.La(a,b,k,c,d,l).La(a,b,e,f,g,l)};Pf.B=7;function ag(a,b,c,d,e){this.s=a;this.Za=b;this.o=c;this.I=d;this.w=e;this.g=32374860;this.D=0}h=ag.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.C(null,a)};h.S=function(){return this.s};
h.R=function(){var a=this.w;return null!=a?a:this.w=a=Dc(this)};h.C=function(a,b){return Hc(this,b)};h.ba=function(){return Ic(L,this.s)};h.da=function(a,b){return Yc.a(b,this)};h.ea=function(a,b,c){return Yc.c(b,c,this)};h.fa=function(){return null==this.I?new V(null,2,5,W,[this.Za[this.o],this.Za[this.o+1]],null):J(this.I)};
h.va=function(){if(null==this.I){var a=this.Za,b=this.o+2;return Nf.c?Nf.c(a,b,null):Nf.call(null,a,b,null)}var a=this.Za,b=this.o,c=M(this.I);return Nf.c?Nf.c(a,b,c):Nf.call(null,a,b,c)};h.V=function(){return this};h.T=function(a,b){return new ag(b,this.Za,this.o,this.I,this.w)};h.Z=function(a,b){return Q(b,this)};ag.prototype[Ra]=function(){return yc(this)};
var Nf=function Nf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Nf.b(arguments[0]);case 3:return Nf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};Nf.b=function(a){return Nf.c(a,0,null)};
Nf.c=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new ag(null,a,b,null,null);var d=a[b+1];if(x(d)&&(d=d.Hb(),x(d)))return new ag(null,a,b+2,d,null);b+=2}else return null;else return new ag(null,a,b,c,null)};Nf.B=3;function bg(a,b,c,d,e){this.s=a;this.Za=b;this.o=c;this.I=d;this.w=e;this.g=32374860;this.D=0}h=bg.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.C(null,a)};h.S=function(){return this.s};
h.R=function(){var a=this.w;return null!=a?a:this.w=a=Dc(this)};h.C=function(a,b){return Hc(this,b)};h.ba=function(){return Ic(L,this.s)};h.da=function(a,b){return Yc.a(b,this)};h.ea=function(a,b,c){return Yc.c(b,c,this)};h.fa=function(){return J(this.I)};h.va=function(){var a=this.Za,b=this.o,c=M(this.I);return Of.v?Of.v(null,a,b,c):Of.call(null,null,a,b,c)};h.V=function(){return this};h.T=function(a,b){return new bg(b,this.Za,this.o,this.I,this.w)};h.Z=function(a,b){return Q(b,this)};
bg.prototype[Ra]=function(){return yc(this)};var Of=function Of(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Of.b(arguments[0]);case 4:return Of.v(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};Of.b=function(a){return Of.v(null,a,0,null)};
Of.v=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(x(e)&&(e=e.Hb(),x(e)))return new bg(a,b,c+1,e,null);c+=1}else return null;else return new bg(a,b,c,d,null)};Of.B=4;Lf;function cg(a,b,c){this.Ca=a;this.qc=b;this.cc=c}cg.prototype.wa=function(){return this.cc&&this.qc.wa()};cg.prototype.next=function(){if(this.cc)return this.qc.next();this.cc=!0;return this.Ca};cg.prototype.remove=function(){return Error("Unsupported operation")};
function cd(a,b,c,d,e,f){this.s=a;this.m=b;this.root=c;this.ya=d;this.Ca=e;this.w=f;this.g=16123663;this.D=8196}h=cd.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.C(null,a)};h.keys=function(){return yc(Ff.b?Ff.b(this):Ff.call(null,this))};h.entries=function(){return Af(w(this))};h.values=function(){return yc(Gf.b?Gf.b(this):Gf.call(null,this))};h.has=function(a){return vd(this,a)};h.get=function(a,b){return this.M(null,a,b)};
h.forEach=function(a){for(var b=w(this),c=null,d=0,e=0;;)if(e<d){var f=c.aa(null,e),g=S(f,0),f=S(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=w(b))pd(b)?(c=Ub(b),b=Vb(b),g=c,d=R(c),c=g):(c=J(b),g=S(c,0),f=S(c,1),a.a?a.a(f,g):a.call(null,f,g),b=M(b),c=null,d=0),e=0;else return null};h.P=function(a,b){return gb.c(this,b,null)};h.M=function(a,b,c){return null==b?this.ya?this.Ca:c:null==this.root?c:this.root.Ya(0,qc(b),b,c)};
h.Ia=function(){var a=this.root?ac(this.root):le;return this.ya?new cg(this.Ca,a,!1):a};h.S=function(){return this.s};h.$=function(){return this.m};h.R=function(){var a=this.w;return null!=a?a:this.w=a=Fc(this)};h.C=function(a,b){return xf(this,b)};h.mb=function(){return new Lf({},this.root,this.m,this.ya,this.Ca)};h.ba=function(){return yb(Jf,this.s)};
h.Mb=function(a,b){if(null==b)return this.ya?new cd(this.s,this.m-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.Ib(0,qc(b),b);return c===this.root?this:new cd(this.s,this.m-1,c,this.ya,this.Ca,null)};h.Xa=function(a,b,c){if(null==b)return this.ya&&c===this.Ca?this:new cd(this.s,this.ya?this.m:this.m+1,this.root,!0,c,null);a=new Mf;b=(null==this.root?Xf:this.root).Ka(0,qc(b),b,c,a);return b===this.root?this:new cd(this.s,a.H?this.m+1:this.m,b,this.ya,this.Ca,null)};
h.Vb=function(a,b){return null==b?this.ya:null==this.root?!1:this.root.Ya(0,qc(b),b,sd)!==sd};h.V=function(){if(0<this.m){var a=null!=this.root?this.root.Hb():null;return this.ya?Q(new V(null,2,5,W,[null,this.Ca],null),a):a}return null};h.T=function(a,b){return new cd(b,this.m,this.root,this.ya,this.Ca,this.w)};
h.Z=function(a,b){if(md(b))return ib(this,G.a(b,0),G.a(b,1));for(var c=this,d=w(b);;){if(null==d)return c;var e=J(d);if(md(e))c=ib(c,G.a(e,0),G.a(e,1)),d=M(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.P(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.P(null,c)};a.c=function(a,c,d){return this.M(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};h.b=function(a){return this.P(null,a)};h.a=function(a,b){return this.M(null,a,b)};var Jf=new cd(null,0,null,!1,null,Gc);
function dd(a,b){for(var c=a.length,d=0,e=Lb(Jf);;)if(d<c)var f=d+1,e=e.Bb(null,a[d],b[d]),d=f;else return Ob(e)}cd.prototype[Ra]=function(){return yc(this)};function Lf(a,b,c,d,e){this.U=a;this.root=b;this.count=c;this.ya=d;this.Ca=e;this.g=258;this.D=56}function dg(a,b,c){if(a.U){if(null==b)a.Ca!==c&&(a.Ca=c),a.ya||(a.count+=1,a.ya=!0);else{var d=new Mf;b=(null==a.root?Xf:a.root).La(a.U,0,qc(b),b,c,d);b!==a.root&&(a.root=b);d.H&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}h=Lf.prototype;
h.$=function(){if(this.U)return this.count;throw Error("count after persistent!");};h.P=function(a,b){return null==b?this.ya?this.Ca:null:null==this.root?null:this.root.Ya(0,qc(b),b)};h.M=function(a,b,c){return null==b?this.ya?this.Ca:c:null==this.root?c:this.root.Ya(0,qc(b),b,c)};
h.Cb=function(a,b){var c;a:if(this.U)if(null!=b?b.g&2048||b.xc||(b.g?0:Pa(lb,b)):Pa(lb,b))c=dg(this,Nd.b?Nd.b(b):Nd.call(null,b),Od.b?Od.b(b):Od.call(null,b));else{c=w(b);for(var d=this;;){var e=J(c);if(x(e))c=M(c),d=dg(d,Nd.b?Nd.b(e):Nd.call(null,e),Od.b?Od.b(e):Od.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};h.Db=function(){var a;if(this.U)this.U=null,a=new cd(null,this.count,this.root,this.ya,this.Ca,null);else throw Error("persistent! called twice");return a};
h.Bb=function(a,b,c){return dg(this,b,c)};eg;fg;function fg(a,b,c,d,e){this.key=a;this.H=b;this.left=c;this.right=d;this.w=e;this.g=32402207;this.D=0}h=fg.prototype;h.replace=function(a,b,c,d){return new fg(a,b,c,d,null)};h.P=function(a,b){return G.c(this,b,null)};h.M=function(a,b,c){return G.c(this,b,c)};h.aa=function(a,b){return 0===b?this.key:1===b?this.H:null};h.Ba=function(a,b,c){return 0===b?this.key:1===b?this.H:c};
h.cb=function(a,b,c){return(new V(null,2,5,W,[this.key,this.H],null)).cb(null,b,c)};h.S=function(){return null};h.$=function(){return 2};h.xb=function(){return this.key};h.yb=function(){return this.H};h.ab=function(){return this.H};h.bb=function(){return new V(null,1,5,W,[this.key],null)};h.R=function(){var a=this.w;return null!=a?a:this.w=a=Dc(this)};h.C=function(a,b){return Hc(this,b)};h.ba=function(){return $c};h.da=function(a,b){return Nc(this,b)};h.ea=function(a,b,c){return Oc(this,b,c)};
h.Xa=function(a,b,c){return T.c(new V(null,2,5,W,[this.key,this.H],null),b,c)};h.V=function(){return Za(Za(L,this.H),this.key)};h.T=function(a,b){return Ic(new V(null,2,5,W,[this.key,this.H],null),b)};h.Z=function(a,b){return new V(null,3,5,W,[this.key,this.H,b],null)};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.P(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.P(null,c)};a.c=function(a,c,d){return this.M(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};h.b=function(a){return this.P(null,a)};h.a=function(a,b){return this.M(null,a,b)};fg.prototype[Ra]=function(){return yc(this)};
function eg(a,b,c,d,e){this.key=a;this.H=b;this.left=c;this.right=d;this.w=e;this.g=32402207;this.D=0}h=eg.prototype;h.replace=function(a,b,c,d){return new eg(a,b,c,d,null)};h.P=function(a,b){return G.c(this,b,null)};h.M=function(a,b,c){return G.c(this,b,c)};h.aa=function(a,b){return 0===b?this.key:1===b?this.H:null};h.Ba=function(a,b,c){return 0===b?this.key:1===b?this.H:c};h.cb=function(a,b,c){return(new V(null,2,5,W,[this.key,this.H],null)).cb(null,b,c)};h.S=function(){return null};h.$=function(){return 2};
h.xb=function(){return this.key};h.yb=function(){return this.H};h.ab=function(){return this.H};h.bb=function(){return new V(null,1,5,W,[this.key],null)};h.R=function(){var a=this.w;return null!=a?a:this.w=a=Dc(this)};h.C=function(a,b){return Hc(this,b)};h.ba=function(){return $c};h.da=function(a,b){return Nc(this,b)};h.ea=function(a,b,c){return Oc(this,b,c)};h.Xa=function(a,b,c){return T.c(new V(null,2,5,W,[this.key,this.H],null),b,c)};h.V=function(){return Za(Za(L,this.H),this.key)};
h.T=function(a,b){return Ic(new V(null,2,5,W,[this.key,this.H],null),b)};h.Z=function(a,b){return new V(null,3,5,W,[this.key,this.H,b],null)};h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.P(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.P(null,c)};a.c=function(a,c,d){return this.M(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};
h.b=function(a){return this.P(null,a)};h.a=function(a,b){return this.M(null,a,b)};eg.prototype[Ra]=function(){return yc(this)};Nd;var N=function N(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return N.l(0<c.length?new Ja(c.slice(0),0):null)};N.l=function(a){for(var b=w(a),c=Lb(Jf);;)if(b){a=M(M(b));var d=J(b),b=J(M(b)),c=Pb(c,d,b),b=a}else return Ob(c)};N.B=0;N.G=function(a){return N.l(w(a))};function gg(a,b){this.J=a;this.Aa=b;this.g=32374988;this.D=0}h=gg.prototype;
h.toString=function(){return cc(this)};h.equiv=function(a){return this.C(null,a)};h.S=function(){return this.Aa};h.ua=function(){var a=(null!=this.J?this.J.g&128||this.J.Nb||(this.J.g?0:Pa(db,this.J)):Pa(db,this.J))?this.J.ua(null):M(this.J);return null==a?null:new gg(a,this.Aa)};h.R=function(){return Dc(this)};h.C=function(a,b){return Hc(this,b)};h.ba=function(){return Ic(L,this.Aa)};h.da=function(a,b){return Yc.a(b,this)};h.ea=function(a,b,c){return Yc.c(b,c,this)};h.fa=function(){return this.J.fa(null).xb(null)};
h.va=function(){var a=(null!=this.J?this.J.g&128||this.J.Nb||(this.J.g?0:Pa(db,this.J)):Pa(db,this.J))?this.J.ua(null):M(this.J);return null!=a?new gg(a,this.Aa):L};h.V=function(){return this};h.T=function(a,b){return new gg(this.J,b)};h.Z=function(a,b){return Q(b,this)};gg.prototype[Ra]=function(){return yc(this)};function Ff(a){return(a=w(a))?new gg(a,null):null}function Nd(a){return mb(a)}function hg(a,b){this.J=a;this.Aa=b;this.g=32374988;this.D=0}h=hg.prototype;h.toString=function(){return cc(this)};
h.equiv=function(a){return this.C(null,a)};h.S=function(){return this.Aa};h.ua=function(){var a=(null!=this.J?this.J.g&128||this.J.Nb||(this.J.g?0:Pa(db,this.J)):Pa(db,this.J))?this.J.ua(null):M(this.J);return null==a?null:new hg(a,this.Aa)};h.R=function(){return Dc(this)};h.C=function(a,b){return Hc(this,b)};h.ba=function(){return Ic(L,this.Aa)};h.da=function(a,b){return Yc.a(b,this)};h.ea=function(a,b,c){return Yc.c(b,c,this)};h.fa=function(){return this.J.fa(null).yb(null)};
h.va=function(){var a=(null!=this.J?this.J.g&128||this.J.Nb||(this.J.g?0:Pa(db,this.J)):Pa(db,this.J))?this.J.ua(null):M(this.J);return null!=a?new hg(a,this.Aa):L};h.V=function(){return this};h.T=function(a,b){return new hg(this.J,b)};h.Z=function(a,b){return Q(b,this)};hg.prototype[Ra]=function(){return yc(this)};function Gf(a){return(a=w(a))?new hg(a,null):null}function Od(a){return ob(a)}
var ig=function ig(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return ig.l(0<c.length?new Ja(c.slice(0),0):null)};ig.l=function(a){return x(se(Bd,a))?Ua.a(function(a,c){return Zc.a(x(a)?a:pe,c)},a):null};ig.B=0;ig.G=function(a){return ig.l(w(a))};var jg=function jg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return jg.l(arguments[0],1<c.length?new Ja(c.slice(1),0):null)};
jg.l=function(a,b){return x(se(Bd,b))?Ua.a(function(a){return function(b,e){return Ua.c(a,x(b)?b:pe,w(e))}}(function(b,d){var e=J(d),f=J(M(d));return vd(b,e)?T.c(b,e,function(){var d=H.a(b,e);return a.a?a.a(d,f):a.call(null,d,f)}()):T.c(b,e,f)}),b):null};jg.B=1;jg.G=function(a){var b=J(a);a=M(a);return jg.l(b,a)};function kg(a){for(var b=pe,c=w(new V(null,1,5,W,[lg],null));;)if(c)var d=J(c),e=H.c(a,d,mg),b=kc.a(e,mg)?b:T.c(b,d,e),c=M(c);else return Ic(b,gd(a))}ng;function og(a){this.pb=a}
og.prototype.wa=function(){return this.pb.wa()};og.prototype.next=function(){if(this.pb.wa())return this.pb.next().N[0];throw Error("No such element");};og.prototype.remove=function(){return Error("Unsupported operation")};function pg(a,b,c){this.s=a;this.gb=b;this.w=c;this.g=15077647;this.D=8196}h=pg.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.C(null,a)};h.keys=function(){return yc(w(this))};h.entries=function(){var a=w(this);return new Bf(w(a))};h.values=function(){return yc(w(this))};
h.has=function(a){return vd(this,a)};h.forEach=function(a){for(var b=w(this),c=null,d=0,e=0;;)if(e<d){var f=c.aa(null,e),g=S(f,0),f=S(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=w(b))pd(b)?(c=Ub(b),b=Vb(b),g=c,d=R(c),c=g):(c=J(b),g=S(c,0),f=S(c,1),a.a?a.a(f,g):a.call(null,f,g),b=M(b),c=null,d=0),e=0;else return null};h.P=function(a,b){return gb.c(this,b,null)};h.M=function(a,b,c){return hb(this.gb,b)?b:c};h.Ia=function(){return new og(ac(this.gb))};h.S=function(){return this.s};h.$=function(){return Wa(this.gb)};
h.R=function(){var a=this.w;return null!=a?a:this.w=a=Fc(this)};h.C=function(a,b){return id(b)&&R(this)===R(b)&&re(function(a){return function(b){return vd(a,b)}}(this),b)};h.mb=function(){return new ng(Lb(this.gb))};h.ba=function(){return Ic(qg,this.s)};h.V=function(){return Ff(this.gb)};h.T=function(a,b){return new pg(b,this.gb,this.w)};h.Z=function(a,b){return new pg(this.s,T.c(this.gb,b,null),null)};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.P(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.P(null,c)};a.c=function(a,c,d){return this.M(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};h.b=function(a){return this.P(null,a)};h.a=function(a,b){return this.M(null,a,b)};var qg=new pg(null,pe,Gc);
function rg(a){var b=a.length;if(b<=If)for(var c=0,d=Lb(pe);;)if(c<b)var e=c+1,d=Pb(d,a[c],null),c=e;else return new pg(null,Ob(d),null);else for(c=0,d=Lb(qg);;)if(c<b)e=c+1,d=Mb(d,a[c]),c=e;else return Ob(d)}pg.prototype[Ra]=function(){return yc(this)};function ng(a){this.Wa=a;this.D=136;this.g=259}h=ng.prototype;h.Cb=function(a,b){this.Wa=Pb(this.Wa,b,null);return this};h.Db=function(){return new pg(null,Ob(this.Wa),null)};h.$=function(){return R(this.Wa)};h.P=function(a,b){return gb.c(this,b,null)};
h.M=function(a,b,c){return gb.c(this.Wa,b,sd)===sd?c:b};h.call=function(){function a(a,b,c){return gb.c(this.Wa,b,sd)===sd?c:b}function b(a,b){return gb.c(this.Wa,b,sd)===sd?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};h.b=function(a){return gb.c(this.Wa,a,sd)===sd?null:a};
h.a=function(a,b){return gb.c(this.Wa,a,sd)===sd?b:a};function Md(a){if(null!=a&&(a.D&4096||a.zc))return a.zb(null);if("string"===typeof a)return a;throw Error([B("Doesn't support name: "),B(a)].join(""));}function sg(a,b){for(var c=Lb(pe),d=w(a),e=w(b);;)if(d&&e)var f=J(d),g=J(e),c=Pb(c,f,g),d=M(d),e=M(e);else return Ob(c)}function tg(a,b,c){this.o=a;this.end=b;this.step=c}tg.prototype.wa=function(){return 0<this.step?this.o<this.end:this.o>this.end};
tg.prototype.next=function(){var a=this.o;this.o+=this.step;return a};function ug(a,b,c,d,e){this.s=a;this.start=b;this.end=c;this.step=d;this.w=e;this.g=32375006;this.D=8192}h=ug.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.C(null,a)};h.aa=function(a,b){if(b<Wa(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};
h.Ba=function(a,b,c){return b<Wa(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};h.Ia=function(){return new tg(this.start,this.end,this.step)};h.S=function(){return this.s};h.ua=function(){return 0<this.step?this.start+this.step<this.end?new ug(this.s,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new ug(this.s,this.start+this.step,this.end,this.step,null):null};h.$=function(){return Na(Eb(this))?0:Math.ceil((this.end-this.start)/this.step)};
h.R=function(){var a=this.w;return null!=a?a:this.w=a=Dc(this)};h.C=function(a,b){return Hc(this,b)};h.ba=function(){return Ic(L,this.s)};h.da=function(a,b){return Nc(this,b)};h.ea=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){c=b.a?b.a(c,a):b.call(null,c,a);if(Mc(c))return P.b?P.b(c):P.call(null,c);a+=this.step}else return c};h.fa=function(){return null==Eb(this)?null:this.start};
h.va=function(){return null!=Eb(this)?new ug(this.s,this.start+this.step,this.end,this.step,null):L};h.V=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};h.T=function(a,b){return new ug(b,this.start,this.end,this.step,this.w)};h.Z=function(a,b){return Q(b,this)};ug.prototype[Ra]=function(){return yc(this)};
function vg(a,b){return function(){function c(c,d,e){return new V(null,2,5,W,[a.c?a.c(c,d,e):a.call(null,c,d,e),b.c?b.c(c,d,e):b.call(null,c,d,e)],null)}function d(c,d){return new V(null,2,5,W,[a.a?a.a(c,d):a.call(null,c,d),b.a?b.a(c,d):b.call(null,c,d)],null)}function e(c){return new V(null,2,5,W,[a.b?a.b(c):a.call(null,c),b.b?b.b(c):b.call(null,c)],null)}function f(){return new V(null,2,5,W,[a.u?a.u():a.call(null),b.u?b.u():b.call(null)],null)}var g=null,k=function(){function c(a,b,e,f){var g=null;
if(3<arguments.length){for(var g=0,k=Array(arguments.length-3);g<k.length;)k[g]=arguments[g+3],++g;g=new Ja(k,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return new V(null,2,5,W,[D.F(a,c,e,f,g),D.F(b,c,e,f,g)],null)}c.B=3;c.G=function(a){var b=J(a);a=M(a);var c=J(a);a=M(a);var e=J(a);a=wc(a);return d(b,c,e,a)};c.l=d;return c}(),g=function(a,b,g,r){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);
default:var t=null;if(3<arguments.length){for(var t=0,u=Array(arguments.length-3);t<u.length;)u[t]=arguments[t+3],++t;t=new Ja(u,0)}return k.l(a,b,g,t)}throw Error("Invalid arity: "+arguments.length);};g.B=3;g.G=k.G;g.u=f;g.b=e;g.a=d;g.c=c;g.l=k.l;return g}()}function wg(a){a:for(var b=a;;)if(w(b))b=M(b);else break a;return a}
function lf(a,b,c,d,e,f,g){var k=va;va=null==va?null:va-1;try{if(null!=va&&0>va)return Ib(a,"#");Ib(a,c);if(0===Ga.b(f))w(g)&&Ib(a,function(){var a=xg.b(f);return x(a)?a:"..."}());else{if(w(g)){var l=J(g);b.c?b.c(l,a,f):b.call(null,l,a,f)}for(var m=M(g),n=Ga.b(f)-1;;)if(!m||null!=n&&0===n){w(m)&&0===n&&(Ib(a,d),Ib(a,function(){var a=xg.b(f);return x(a)?a:"..."}()));break}else{Ib(a,d);var r=J(m);c=a;g=f;b.c?b.c(r,c,g):b.call(null,r,c,g);var t=M(m);c=n-1;m=t;n=c}}return Ib(a,e)}finally{va=k}}
function yg(a,b){for(var c=w(b),d=null,e=0,f=0;;)if(f<e){var g=d.aa(null,f);Ib(a,g);f+=1}else if(c=w(c))d=c,pd(d)?(c=Ub(d),e=Vb(d),d=c,g=R(c),c=e,e=g):(g=J(d),Ib(a,g),c=M(d),d=null,e=0),f=0;else return null}var zg={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Ag(a){return[B('"'),B(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return zg[a]})),B('"')].join("")}Bg;
function Cg(a,b){var c=ud(H.a(a,Ea));return c?(c=null!=b?b.g&131072||b.yc?!0:!1:!1)?null!=gd(b):c:c}
function Dg(a,b,c){if(null==a)return Ib(b,"nil");if(Cg(c,a)){Ib(b,"^");var d=gd(a);mf.c?mf.c(d,b,c):mf.call(null,d,b,c);Ib(b," ")}if(a.Eb)return a.Qb(a,b,c);if(null!=a&&(a.g&2147483648||a.Y))return a.O(null,b,c);if(!0===a||!1===a||"number"===typeof a)return Ib(b,""+B(a));if(null!=a&&a.constructor===Object)return Ib(b,"#js "),d=U.a(function(b){return new V(null,2,5,W,[Wd.b(b),a[b]],null)},qd(a)),Bg.v?Bg.v(d,mf,b,c):Bg.call(null,d,mf,b,c);if(Ma(a))return lf(b,mf,"#js ["," ","]",c,a);if("string"==typeof a)return x(Da.b(c))?
Ib(b,Ag(a)):Ib(b,a);if("function"==p(a)){var e=a.name;c=x(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return yg(b,uc(["#object[",c,' "',""+B(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+B(a);;)if(R(c)<b)c=[B("0"),B(c)].join("");else return c},yg(b,uc(['#inst "',""+B(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),
3),"-",'00:00"'],0));if(a instanceof RegExp)return yg(b,uc(['#"',a.source,'"'],0));if(null!=a&&(a.g&2147483648||a.Y))return Jb(a,b,c);if(x(a.constructor.eb))return yg(b,uc(["#object[",a.constructor.eb.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=x(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return yg(b,uc(["#object[",c," ",""+B(a),"]"],0))}function mf(a,b,c){var d=Eg.b(c);return x(d)?(c=T.c(c,Fg,Dg),d.c?d.c(a,b,c):d.call(null,a,b,c)):Dg(a,b,c)}
var Be=function Be(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Be.l(0<c.length?new Ja(c.slice(0),0):null)};Be.l=function(a){var b=ya();if(null==a||Na(w(a)))b="";else{var c=B,d=new ka;a:{var e=new bc(d);mf(J(a),e,b);a=w(M(a));for(var f=null,g=0,k=0;;)if(k<g){var l=f.aa(null,k);Ib(e," ");mf(l,e,b);k+=1}else if(a=w(a))f=a,pd(f)?(a=Ub(f),g=Vb(f),f=a,l=R(a),a=g,g=l):(l=J(f),Ib(e," "),mf(l,e,b),a=M(f),f=null,g=0),k=0;else break a}b=""+c(d)}return b};
Be.B=0;Be.G=function(a){return Be.l(w(a))};function Bg(a,b,c,d){return lf(c,function(a,c,d){var k=mb(a);b.c?b.c(k,c,d):b.call(null,k,c,d);Ib(c," ");a=ob(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,w(a))}Ee.prototype.Y=!0;Ee.prototype.O=function(a,b,c){Ib(b,"#object [cljs.core.Volatile ");mf(new q(null,1,[Gg,this.state],null),b,c);return Ib(b,"]")};Ja.prototype.Y=!0;Ja.prototype.O=function(a,b,c){return lf(b,mf,"("," ",")",c,this)};Xd.prototype.Y=!0;
Xd.prototype.O=function(a,b,c){return lf(b,mf,"("," ",")",c,this)};ag.prototype.Y=!0;ag.prototype.O=function(a,b,c){return lf(b,mf,"("," ",")",c,this)};fg.prototype.Y=!0;fg.prototype.O=function(a,b,c){return lf(b,mf,"["," ","]",c,this)};Ef.prototype.Y=!0;Ef.prototype.O=function(a,b,c){return lf(b,mf,"("," ",")",c,this)};Ac.prototype.Y=!0;Ac.prototype.O=function(a,b,c){return lf(b,mf,"("," ",")",c,this)};od.prototype.Y=!0;od.prototype.O=function(a,b,c){return lf(b,mf,"("," ",")",c,this)};
Td.prototype.Y=!0;Td.prototype.O=function(a,b,c){return lf(b,mf,"("," ",")",c,this)};Tc.prototype.Y=!0;Tc.prototype.O=function(a,b,c){return lf(b,mf,"("," ",")",c,this)};cd.prototype.Y=!0;cd.prototype.O=function(a,b,c){return Bg(this,mf,b,c)};bg.prototype.Y=!0;bg.prototype.O=function(a,b,c){return lf(b,mf,"("," ",")",c,this)};sf.prototype.Y=!0;sf.prototype.O=function(a,b,c){return lf(b,mf,"["," ","]",c,this)};pg.prototype.Y=!0;pg.prototype.O=function(a,b,c){return lf(b,mf,"#{"," ","}",c,this)};
nd.prototype.Y=!0;nd.prototype.O=function(a,b,c){return lf(b,mf,"("," ",")",c,this)};xe.prototype.Y=!0;xe.prototype.O=function(a,b,c){Ib(b,"#object [cljs.core.Atom ");mf(new q(null,1,[Gg,this.state],null),b,c);return Ib(b,"]")};hg.prototype.Y=!0;hg.prototype.O=function(a,b,c){return lf(b,mf,"("," ",")",c,this)};eg.prototype.Y=!0;eg.prototype.O=function(a,b,c){return lf(b,mf,"["," ","]",c,this)};V.prototype.Y=!0;V.prototype.O=function(a,b,c){return lf(b,mf,"["," ","]",c,this)};Sd.prototype.Y=!0;
Sd.prototype.O=function(a,b){return Ib(b,"()")};qe.prototype.Y=!0;qe.prototype.O=function(a,b,c){return lf(b,mf,"("," ",")",c,this)};q.prototype.Y=!0;q.prototype.O=function(a,b,c){return Bg(this,mf,b,c)};ug.prototype.Y=!0;ug.prototype.O=function(a,b,c){return lf(b,mf,"("," ",")",c,this)};gg.prototype.Y=!0;gg.prototype.O=function(a,b,c){return lf(b,mf,"("," ",")",c,this)};Uc.prototype.Y=!0;Uc.prototype.O=function(a,b,c){return lf(b,mf,"("," ",")",c,this)};jc.prototype.ub=!0;
jc.prototype.lb=function(a,b){if(b instanceof jc)return sc(this,b);throw Error([B("Cannot compare "),B(this),B(" to "),B(b)].join(""));};y.prototype.ub=!0;y.prototype.lb=function(a,b){if(b instanceof y)return Ud(this,b);throw Error([B("Cannot compare "),B(this),B(" to "),B(b)].join(""));};sf.prototype.ub=!0;sf.prototype.lb=function(a,b){if(md(b))return wd(this,b);throw Error([B("Cannot compare "),B(this),B(" to "),B(b)].join(""));};V.prototype.ub=!0;
V.prototype.lb=function(a,b){if(md(b))return wd(this,b);throw Error([B("Cannot compare "),B(this),B(" to "),B(b)].join(""));};var Hg=null;function Ig(a){null==Hg&&(Hg=ye.b?ye.b(0):ye.call(null,0));return tc.b([B(a),B(De.a(Hg,Jc))].join(""))}function Jg(a){return function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return Mc(d)?new Kc(d):d}}
function Ke(a){return function(b){return function(){function c(a,c){return Ua.c(b,a,c)}function d(b){return a.b?a.b(b):a.call(null,b)}function e(){return a.u?a.u():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.u=e;f.b=d;f.a=c;return f}()}(Jg(a))}Kg;function Lg(){}
var Mg=function Mg(b){if(null!=b&&null!=b.vc)return b.vc(b);var c=Mg[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Mg._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IEncodeJS.-clj-\x3ejs",b);};Ng;function Pg(a){return(null!=a?a.uc||(a.Hc?0:Pa(Lg,a)):Pa(Lg,a))?Mg(a):"string"===typeof a||"number"===typeof a||a instanceof y||a instanceof jc?Ng.b?Ng.b(a):Ng.call(null,a):Be.l(uc([a],0))}
var Ng=function Ng(b){if(null==b)return null;if(null!=b?b.uc||(b.Hc?0:Pa(Lg,b)):Pa(Lg,b))return Mg(b);if(b instanceof y)return Md(b);if(b instanceof jc)return""+B(b);if(kd(b)){var c={};b=w(b);for(var d=null,e=0,f=0;;)if(f<e){var g=d.aa(null,f),k=S(g,0),g=S(g,1);c[Pg(k)]=Ng(g);f+=1}else if(b=w(b))pd(b)?(e=Ub(b),b=Vb(b),d=e,e=R(e)):(e=J(b),d=S(e,0),e=S(e,1),c[Pg(d)]=Ng(e),b=M(b),d=null,e=0),f=0;else break;return c}if(hd(b)){c=[];b=w(U.a(Ng,b));d=null;for(f=e=0;;)if(f<e)k=d.aa(null,f),c.push(k),f+=1;
else if(b=w(b))d=b,pd(d)?(b=Ub(d),f=Vb(d),d=b,e=R(b),b=f):(b=J(d),c.push(b),b=M(d),d=null,e=0),f=0;else break;return c}return b},Kg=function Kg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Kg.u();case 1:return Kg.b(arguments[0]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};Kg.u=function(){return Kg.b(1)};Kg.b=function(a){return Math.random()*a};Kg.B=1;var Qg=null;
function Rg(){if(null==Qg){var a=new q(null,3,[Sg,pe,Tg,pe,Ug,pe],null);Qg=ye.b?ye.b(a):ye.call(null,a)}return Qg}function Vg(a,b,c){var d=kc.a(b,c);if(!d&&!(d=vd(Ug.b(a).call(null,b),c))&&(d=md(c))&&(d=md(b)))if(d=R(c)===R(b))for(var d=!0,e=0;;)if(d&&e!==R(c))d=Vg(a,b.b?b.b(e):b.call(null,e),c.b?c.b(e):c.call(null,e)),e+=1;else return d;else return d;else return d}function Wg(a){var b;b=Rg();b=P.b?P.b(b):P.call(null,b);return ke(H.a(Sg.b(b),a))}
function Xg(a,b,c,d){De.a(a,function(){return P.b?P.b(b):P.call(null,b)});De.a(c,function(){return P.b?P.b(d):P.call(null,d)})}var Yg=function Yg(b,c,d){var e=(P.b?P.b(d):P.call(null,d)).call(null,b),e=x(x(e)?e.b?e.b(c):e.call(null,c):e)?!0:null;if(x(e))return e;e=function(){for(var e=Wg(c);;)if(0<R(e))Yg(b,J(e),d),e=wc(e);else return null}();if(x(e))return e;e=function(){for(var e=Wg(b);;)if(0<R(e))Yg(J(e),c,d),e=wc(e);else return null}();return x(e)?e:!1};
function Zg(a,b,c){c=Yg(a,b,c);if(x(c))a=c;else{c=Vg;var d;d=Rg();d=P.b?P.b(d):P.call(null,d);a=c(d,a,b)}return a}
var $g=function $g(b,c,d,e,f,g,k){var l=Ua.c(function(e,g){var k=S(g,0);S(g,1);if(Vg(P.b?P.b(d):P.call(null,d),c,k)){var l;l=(l=null==e)?l:Zg(k,J(e),f);l=x(l)?g:e;if(!x(Zg(J(l),k,f)))throw Error([B("Multiple methods in multimethod '"),B(b),B("' match dispatch value: "),B(c),B(" -\x3e "),B(k),B(" and "),B(J(l)),B(", and neither is preferred")].join(""));return l}return e},null,P.b?P.b(e):P.call(null,e));if(x(l)){if(kc.a(P.b?P.b(k):P.call(null,k),P.b?P.b(d):P.call(null,d)))return De.v(g,T,c,J(M(l))),
J(M(l));Xg(g,e,k,d);return $g(b,c,d,e,f,g,k)}return null};function ah(a,b){throw Error([B("No method in multimethod '"),B(a),B("' for dispatch value: "),B(b)].join(""));}function bh(a,b,c,d,e,f,g,k){this.name=a;this.j=b;this.Ic=c;this.Gb=d;this.qb=e;this.Pc=f;this.Jb=g;this.tb=k;this.g=4194305;this.D=4352}h=bh.prototype;
h.call=function(){function a(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K,X){a=this;var wa=D.l(a.j,b,c,d,e,uc([f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K,X],0)),fj=ch(this,wa);x(fj)||ah(a.name,wa);return D.l(fj,b,c,d,e,uc([f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K,X],0))}function b(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K){a=this;var X=a.j.ra?a.j.ra(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K):a.j.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K),wa=ch(this,X);x(wa)||ah(a.name,X);return wa.ra?wa.ra(b,c,d,e,f,g,k,l,m,n,r,t,
u,v,z,C,F,I,E,K):wa.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K)}function c(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E){a=this;var K=a.j.qa?a.j.qa(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E):a.j.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E),X=ch(this,K);x(X)||ah(a.name,K);return X.qa?X.qa(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E):X.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E)}function d(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I){a=this;var E=a.j.pa?a.j.pa(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I):a.j.call(null,
b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I),K=ch(this,E);x(K)||ah(a.name,E);return K.pa?K.pa(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I):K.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I)}function e(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F){a=this;var I=a.j.oa?a.j.oa(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F):a.j.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F),E=ch(this,I);x(E)||ah(a.name,I);return E.oa?E.oa(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F):E.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F)}function f(a,b,c,d,e,f,g,k,l,m,n,r,t,u,
v,z,C){a=this;var F=a.j.na?a.j.na(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C):a.j.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C),I=ch(this,F);x(I)||ah(a.name,F);return I.na?I.na(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C):I.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C)}function g(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z){a=this;var C=a.j.ma?a.j.ma(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z):a.j.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z),F=ch(this,C);x(F)||ah(a.name,C);return F.ma?F.ma(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z):F.call(null,b,c,d,e,f,g,k,l,m,n,r,
t,u,v,z)}function k(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v){a=this;var z=a.j.la?a.j.la(b,c,d,e,f,g,k,l,m,n,r,t,u,v):a.j.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v),C=ch(this,z);x(C)||ah(a.name,z);return C.la?C.la(b,c,d,e,f,g,k,l,m,n,r,t,u,v):C.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v)}function l(a,b,c,d,e,f,g,k,l,m,n,r,t,u){a=this;var v=a.j.ka?a.j.ka(b,c,d,e,f,g,k,l,m,n,r,t,u):a.j.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u),z=ch(this,v);x(z)||ah(a.name,v);return z.ka?z.ka(b,c,d,e,f,g,k,l,m,n,r,t,u):z.call(null,b,c,d,e,f,
g,k,l,m,n,r,t,u)}function m(a,b,c,d,e,f,g,k,l,m,n,r,t){a=this;var u=a.j.ja?a.j.ja(b,c,d,e,f,g,k,l,m,n,r,t):a.j.call(null,b,c,d,e,f,g,k,l,m,n,r,t),v=ch(this,u);x(v)||ah(a.name,u);return v.ja?v.ja(b,c,d,e,f,g,k,l,m,n,r,t):v.call(null,b,c,d,e,f,g,k,l,m,n,r,t)}function n(a,b,c,d,e,f,g,k,l,m,n,r){a=this;var t=a.j.ia?a.j.ia(b,c,d,e,f,g,k,l,m,n,r):a.j.call(null,b,c,d,e,f,g,k,l,m,n,r),u=ch(this,t);x(u)||ah(a.name,t);return u.ia?u.ia(b,c,d,e,f,g,k,l,m,n,r):u.call(null,b,c,d,e,f,g,k,l,m,n,r)}function r(a,b,
c,d,e,f,g,k,l,m,n){a=this;var r=a.j.ha?a.j.ha(b,c,d,e,f,g,k,l,m,n):a.j.call(null,b,c,d,e,f,g,k,l,m,n),t=ch(this,r);x(t)||ah(a.name,r);return t.ha?t.ha(b,c,d,e,f,g,k,l,m,n):t.call(null,b,c,d,e,f,g,k,l,m,n)}function t(a,b,c,d,e,f,g,k,l,m){a=this;var n=a.j.ta?a.j.ta(b,c,d,e,f,g,k,l,m):a.j.call(null,b,c,d,e,f,g,k,l,m),r=ch(this,n);x(r)||ah(a.name,n);return r.ta?r.ta(b,c,d,e,f,g,k,l,m):r.call(null,b,c,d,e,f,g,k,l,m)}function u(a,b,c,d,e,f,g,k,l){a=this;var m=a.j.sa?a.j.sa(b,c,d,e,f,g,k,l):a.j.call(null,
b,c,d,e,f,g,k,l),n=ch(this,m);x(n)||ah(a.name,m);return n.sa?n.sa(b,c,d,e,f,g,k,l):n.call(null,b,c,d,e,f,g,k,l)}function v(a,b,c,d,e,f,g,k){a=this;var l=a.j.ca?a.j.ca(b,c,d,e,f,g,k):a.j.call(null,b,c,d,e,f,g,k),m=ch(this,l);x(m)||ah(a.name,l);return m.ca?m.ca(b,c,d,e,f,g,k):m.call(null,b,c,d,e,f,g,k)}function z(a,b,c,d,e,f,g){a=this;var k=a.j.X?a.j.X(b,c,d,e,f,g):a.j.call(null,b,c,d,e,f,g),l=ch(this,k);x(l)||ah(a.name,k);return l.X?l.X(b,c,d,e,f,g):l.call(null,b,c,d,e,f,g)}function C(a,b,c,d,e,f){a=
this;var g=a.j.F?a.j.F(b,c,d,e,f):a.j.call(null,b,c,d,e,f),k=ch(this,g);x(k)||ah(a.name,g);return k.F?k.F(b,c,d,e,f):k.call(null,b,c,d,e,f)}function F(a,b,c,d,e){a=this;var f=a.j.v?a.j.v(b,c,d,e):a.j.call(null,b,c,d,e),g=ch(this,f);x(g)||ah(a.name,f);return g.v?g.v(b,c,d,e):g.call(null,b,c,d,e)}function I(a,b,c,d){a=this;var e=a.j.c?a.j.c(b,c,d):a.j.call(null,b,c,d),f=ch(this,e);x(f)||ah(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function K(a,b,c){a=this;var d=a.j.a?a.j.a(b,c):a.j.call(null,
b,c),e=ch(this,d);x(e)||ah(a.name,d);return e.a?e.a(b,c):e.call(null,b,c)}function X(a,b){a=this;var c=a.j.b?a.j.b(b):a.j.call(null,b),d=ch(this,c);x(d)||ah(a.name,c);return d.b?d.b(b):d.call(null,b)}function wa(a){a=this;var b=a.j.u?a.j.u():a.j.call(null),c=ch(this,b);x(c)||ah(a.name,b);return c.u?c.u():c.call(null)}var E=null,E=function(E,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta,Bc,eb,nb,vb,Nb,lc,Lc,Fd,ze,Og){switch(arguments.length){case 1:return wa.call(this,E);case 2:return X.call(this,E,O);case 3:return K.call(this,
E,O,ca);case 4:return I.call(this,E,O,ca,fa);case 5:return F.call(this,E,O,ca,fa,la);case 6:return C.call(this,E,O,ca,fa,la,ma);case 7:return z.call(this,E,O,ca,fa,la,ma,ua);case 8:return v.call(this,E,O,ca,fa,la,ma,ua,za);case 9:return u.call(this,E,O,ca,fa,la,ma,ua,za,Aa);case 10:return t.call(this,E,O,ca,fa,la,ma,ua,za,Aa,Ba);case 11:return r.call(this,E,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa);case 12:return n.call(this,E,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta);case 13:return m.call(this,E,O,ca,fa,la,ma,ua,za,
Aa,Ba,Oa,Ta,Bc);case 14:return l.call(this,E,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta,Bc,eb);case 15:return k.call(this,E,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta,Bc,eb,nb);case 16:return g.call(this,E,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta,Bc,eb,nb,vb);case 17:return f.call(this,E,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta,Bc,eb,nb,vb,Nb);case 18:return e.call(this,E,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta,Bc,eb,nb,vb,Nb,lc);case 19:return d.call(this,E,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta,Bc,eb,nb,vb,Nb,lc,Lc);case 20:return c.call(this,E,O,ca,
fa,la,ma,ua,za,Aa,Ba,Oa,Ta,Bc,eb,nb,vb,Nb,lc,Lc,Fd);case 21:return b.call(this,E,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta,Bc,eb,nb,vb,Nb,lc,Lc,Fd,ze);case 22:return a.call(this,E,O,ca,fa,la,ma,ua,za,Aa,Ba,Oa,Ta,Bc,eb,nb,vb,Nb,lc,Lc,Fd,ze,Og)}throw Error("Invalid arity: "+arguments.length);};E.b=wa;E.a=X;E.c=K;E.v=I;E.F=F;E.X=C;E.ca=z;E.sa=v;E.ta=u;E.ha=t;E.ia=r;E.ja=n;E.ka=m;E.la=l;E.ma=k;E.na=g;E.oa=f;E.pa=e;E.qa=d;E.ra=c;E.Zb=b;E.wb=a;return E}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};
h.u=function(){var a=this.j.u?this.j.u():this.j.call(null),b=ch(this,a);x(b)||ah(this.name,a);return b.u?b.u():b.call(null)};h.b=function(a){var b=this.j.b?this.j.b(a):this.j.call(null,a),c=ch(this,b);x(c)||ah(this.name,b);return c.b?c.b(a):c.call(null,a)};h.a=function(a,b){var c=this.j.a?this.j.a(a,b):this.j.call(null,a,b),d=ch(this,c);x(d)||ah(this.name,c);return d.a?d.a(a,b):d.call(null,a,b)};
h.c=function(a,b,c){var d=this.j.c?this.j.c(a,b,c):this.j.call(null,a,b,c),e=ch(this,d);x(e)||ah(this.name,d);return e.c?e.c(a,b,c):e.call(null,a,b,c)};h.v=function(a,b,c,d){var e=this.j.v?this.j.v(a,b,c,d):this.j.call(null,a,b,c,d),f=ch(this,e);x(f)||ah(this.name,e);return f.v?f.v(a,b,c,d):f.call(null,a,b,c,d)};h.F=function(a,b,c,d,e){var f=this.j.F?this.j.F(a,b,c,d,e):this.j.call(null,a,b,c,d,e),g=ch(this,f);x(g)||ah(this.name,f);return g.F?g.F(a,b,c,d,e):g.call(null,a,b,c,d,e)};
h.X=function(a,b,c,d,e,f){var g=this.j.X?this.j.X(a,b,c,d,e,f):this.j.call(null,a,b,c,d,e,f),k=ch(this,g);x(k)||ah(this.name,g);return k.X?k.X(a,b,c,d,e,f):k.call(null,a,b,c,d,e,f)};h.ca=function(a,b,c,d,e,f,g){var k=this.j.ca?this.j.ca(a,b,c,d,e,f,g):this.j.call(null,a,b,c,d,e,f,g),l=ch(this,k);x(l)||ah(this.name,k);return l.ca?l.ca(a,b,c,d,e,f,g):l.call(null,a,b,c,d,e,f,g)};
h.sa=function(a,b,c,d,e,f,g,k){var l=this.j.sa?this.j.sa(a,b,c,d,e,f,g,k):this.j.call(null,a,b,c,d,e,f,g,k),m=ch(this,l);x(m)||ah(this.name,l);return m.sa?m.sa(a,b,c,d,e,f,g,k):m.call(null,a,b,c,d,e,f,g,k)};h.ta=function(a,b,c,d,e,f,g,k,l){var m=this.j.ta?this.j.ta(a,b,c,d,e,f,g,k,l):this.j.call(null,a,b,c,d,e,f,g,k,l),n=ch(this,m);x(n)||ah(this.name,m);return n.ta?n.ta(a,b,c,d,e,f,g,k,l):n.call(null,a,b,c,d,e,f,g,k,l)};
h.ha=function(a,b,c,d,e,f,g,k,l,m){var n=this.j.ha?this.j.ha(a,b,c,d,e,f,g,k,l,m):this.j.call(null,a,b,c,d,e,f,g,k,l,m),r=ch(this,n);x(r)||ah(this.name,n);return r.ha?r.ha(a,b,c,d,e,f,g,k,l,m):r.call(null,a,b,c,d,e,f,g,k,l,m)};h.ia=function(a,b,c,d,e,f,g,k,l,m,n){var r=this.j.ia?this.j.ia(a,b,c,d,e,f,g,k,l,m,n):this.j.call(null,a,b,c,d,e,f,g,k,l,m,n),t=ch(this,r);x(t)||ah(this.name,r);return t.ia?t.ia(a,b,c,d,e,f,g,k,l,m,n):t.call(null,a,b,c,d,e,f,g,k,l,m,n)};
h.ja=function(a,b,c,d,e,f,g,k,l,m,n,r){var t=this.j.ja?this.j.ja(a,b,c,d,e,f,g,k,l,m,n,r):this.j.call(null,a,b,c,d,e,f,g,k,l,m,n,r),u=ch(this,t);x(u)||ah(this.name,t);return u.ja?u.ja(a,b,c,d,e,f,g,k,l,m,n,r):u.call(null,a,b,c,d,e,f,g,k,l,m,n,r)};h.ka=function(a,b,c,d,e,f,g,k,l,m,n,r,t){var u=this.j.ka?this.j.ka(a,b,c,d,e,f,g,k,l,m,n,r,t):this.j.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t),v=ch(this,u);x(v)||ah(this.name,u);return v.ka?v.ka(a,b,c,d,e,f,g,k,l,m,n,r,t):v.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t)};
h.la=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u){var v=this.j.la?this.j.la(a,b,c,d,e,f,g,k,l,m,n,r,t,u):this.j.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u),z=ch(this,v);x(z)||ah(this.name,v);return z.la?z.la(a,b,c,d,e,f,g,k,l,m,n,r,t,u):z.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u)};
h.ma=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v){var z=this.j.ma?this.j.ma(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v):this.j.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v),C=ch(this,z);x(C)||ah(this.name,z);return C.ma?C.ma(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v):C.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v)};
h.na=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z){var C=this.j.na?this.j.na(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z):this.j.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z),F=ch(this,C);x(F)||ah(this.name,C);return F.na?F.na(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z):F.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z)};
h.oa=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C){var F=this.j.oa?this.j.oa(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C):this.j.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C),I=ch(this,F);x(I)||ah(this.name,F);return I.oa?I.oa(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C):I.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C)};
h.pa=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F){var I=this.j.pa?this.j.pa(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F):this.j.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F),K=ch(this,I);x(K)||ah(this.name,I);return K.pa?K.pa(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F):K.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F)};
h.qa=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I){var K=this.j.qa?this.j.qa(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I):this.j.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I),X=ch(this,K);x(X)||ah(this.name,K);return X.qa?X.qa(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I):X.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I)};
h.ra=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K){var X=this.j.ra?this.j.ra(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K):this.j.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K),wa=ch(this,X);x(wa)||ah(this.name,X);return wa.ra?wa.ra(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K):wa.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K)};
h.Zb=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,X){var wa=D.l(this.j,a,b,c,d,uc([e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,X],0)),E=ch(this,wa);x(E)||ah(this.name,wa);return D.l(E,a,b,c,d,uc([e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,X],0))};function dh(a,b){var c=eh;De.v(c.qb,T,a,b);Xg(c.Jb,c.qb,c.tb,c.Gb)}
function ch(a,b){kc.a(P.b?P.b(a.tb):P.call(null,a.tb),P.b?P.b(a.Gb):P.call(null,a.Gb))||Xg(a.Jb,a.qb,a.tb,a.Gb);var c=(P.b?P.b(a.Jb):P.call(null,a.Jb)).call(null,b);if(x(c))return c;c=$g(a.name,b,a.Gb,a.qb,a.Pc,a.Jb,a.tb);return x(c)?c:(P.b?P.b(a.qb):P.call(null,a.qb)).call(null,a.Ic)}h.zb=function(){return Xb(this.name)};h.Ab=function(){return Yb(this.name)};h.R=function(){return this[ba]||(this[ba]=++da)};var Y=new y(null,"y","y",-1757859776),fh=new y(null,"role","role",-736691072),gh=new y(null,"description","description",-1428560544),hh=new y(null,"path","path",-188191168),ih=new y(null,"onmouseup","onmouseup",168100736),jh=new y(null,"d1","d1",-1264719807),kh=new y(null,"labels","labels",-626734591),lh=new y(null,"p2","p2",905500641),mh=new y(null,"min","min",444991522),nh=new y(null,"r","r",-471384190),oh=new y(null,"d2","d2",2138401859),ph=new y(null,"v","v",21465059),qh=new y(null,"show-labels?",
"show-labels?",-616006332),Ea=new y(null,"meta","meta",1499536964),rh=new y(null,"selected","selected",574897764),sh=new y(null,"ul","ul",-1349521403),th=new y(null,"f1","f1",1714532389),uh=new y(null,"color","color",1011675173),Fa=new y(null,"dup","dup",556298533),vh=new y(null,"add-point","add-point",-1861575067),wh=new y(null,"private","private",-558947994),xh=new y(null,"ray","ray",-972479417),yh=new y(null,"scale","scale",-230427353),zh=new y(null,"button","button",1456579943),Ah=new y(null,
"holding","holding",1269510599),Ae=new y(null,"validator","validator",-1966190681),Bh=new y(null,"redo","redo",501190664),Ch=new y(null,"parallel","parallel",-1863607128),Dh=new y(null,"default","default",-1987822328),Eh=new y(null,"finally-block","finally-block",832982472),Fh=new y(null,"grid","grid",402978600),Gh=new y(null,"strong","strong",269529E3),Hh=new y(null,"name","name",1843675177),Ih=new y(null,"li","li",723558921),Jh=new y(null,"value","value",305978217),Kh=new y(null,"section","section",
-300141526),Lh=new y(null,"tool","tool",-1298696470),Mh=new y(null,"circle","circle",1903212362),Nh=new y(null,"y1","y1",589123466),Oh=new y(null,"onclick","onclick",1297553739),Ph=new y(null,"line-segment","line-segment",-798085781),Qh=new y(null,"dy","dy",1719547243),Rh=new y(null,"release","release",-1534371381),Sh=new y(null,"move","move",-2110884309),Th=new y(null,"anti-history","anti-history",1855784523),Uh=new y(null,"hold","hold",-1621118005),Vh=new y(null,"history","history",-247395220),
Gg=new y(null,"val","val",128701612),Wh=new y(null,"recur","recur",-437573268),Xh=new y(null,"type","type",1174270348),Yh=new y(null,"colors","colors",1157174732),Zh=new y(null,"catch-block","catch-block",1175212748),$h=new y(null,"loops","loops",-1766681555),ai=new y(null,"points","points",-1486596883),bi=new y(null,"midset","midset",729550093),ci=new y(null,"perpendicular","perpendicular",-122487411),Fg=new y(null,"fallback-impl","fallback-impl",-1501286995),Ca=new y(null,"flush-on-newline","flush-on-newline",
-151457939),di=new y(null,"r2","r2",252844174),ei=new y(null,"hyperbola","hyperbola",-396303090),fi=new y(null,"p1","p1",-936759954),gi=new y(null,"className","className",-1983287057),Tg=new y(null,"descendants","descendants",1824886031),hi=new y(null,"k","k",-2146297393),ii=new y(null,"no-op","no-op",-93046065),Ug=new y(null,"ancestors","ancestors",-776045424),ji=new y(null,"div","div",1057191632),Da=new y(null,"readably","readably",1129599760),ki=new jc(null,"box","box",-1123515375,null),xg=new y(null,
"more-marker","more-marker",-14717935),li=new y(null,"g","g",1738089905),mi=new y(null,"c","c",-1763192079),ni=new y(null,"defining-points","defining-points",384743506),oi=new y(null,"guides","guides",-1398390510),pi=new y(null,"undo","undo",-1818036302),qi=new y(null,"line","line",212345235),ri=new jc(null,"val","val",1769233139,null),si=new y(null,"r1","r1",690974900),Ga=new y(null,"print-length","print-length",1931866356),ti=new y(null,"max","max",61366548),ui=new y(null,"f2","f2",396168596),vi=
new y(null,"cx","cx",1272694324),wi=new y(null,"label","label",1718410804),xi=new y(null,"id","id",-1388402092),yi=new y(null,"class","class",-2030961996),zi=new y(null,"cy","cy",755331060),Ai=new y(null,"catch-exception","catch-exception",-1997306795),Sg=new y(null,"parents","parents",-2027538891),Bi=new y(null,"onmousedown","onmousedown",-1118865611),Ci=new y(null,"parabola","parabola",-1319322731),Di=new y(null,"prev","prev",-1597069226),Ei=new y(null,"svg","svg",856789142),Fi=new y(null,"ellipse",
"ellipse",1135891702),Gi=new y(null,"continue-block","continue-block",-1852047850),Hi=new y(null,"sweeps","sweeps",941098264),Ii=new y(null,"d","d",1972142424),Ji=new y(null,"f","f",-1597136552),Ki=new y(null,"point","point",1813198264),Li=new y(null,"strokes","strokes",-1645650952),Z=new y(null,"x","x",2099068185),Mi=new y(null,"x1","x1",-1863922247),Ni=new y(null,"input","input",556931961),Oi=new y(null,"onmousemove","onmousemove",341554202),oe=new jc(null,"quote","quote",1377916282,null),Pi=new y(null,
"h1","h1",-1896887462),ne=new y(null,"arglists","arglists",1661989754),Qi=new y(null,"y2","y2",-718691301),me=new jc(null,"nil-iter","nil-iter",1101030523,null),Ri=new y(null,"main","main",-2117802661),Si=new y(null,"hierarchy","hierarchy",-1053470341),Ti=new y(null,"save-image","save-image",-2127892773),Eg=new y(null,"alt-impl","alt-impl",670969595),Ui=new jc(null,"fn-handler","fn-handler",648785851,null),Vi=new y(null,"selected?","selected?",-742502788),Wi=new y(null,"handler","handler",-195596612),
Xi=new y(null,"step","step",1288888124),Yi=new y(null,"grid-spacing","grid-spacing",1668963196),Zi=new y(null,"mindist","mindist",1821140860),$i=new y(null,"p","p",151049309),aj=new y(null,"x2","x2",-1362513475),bj=new y(null,"show-labels","show-labels",41391613),cj=new y(null,"href","href",-793805698),dj=new y(null,"bisect","bisect",1224004862),ej=new y(null,"areas","areas",-1988969730),gj=new y(null,"a","a",-2123407586),hj=new y(null,"select","select",1147833503),ij=new y(null,"clear","clear",1877104959),
mg=new y("cljs.core","not-found","cljs.core/not-found",-1572889185),jj=new y(null,"foreignObject","foreignObject",25502111),kj=new y(null,"text","text",-1790561697),lj=new jc(null,"f","f",43394975,null),lg=new y(null,"shapes","shapes",1897594879);Ia();function mj(a,b){return ig.l(uc([b,new q(null,2,[xi,Ig(Md(a)),Xh,a],null)],0))}function nj(a,b){return function(c){return oj(a,b,new V(null,1,5,W,[c],null))}}function oj(a,b,c){return kc.a(R(b),R(c))?new V(null,2,5,W,[nj(a,b),mj(a,sg(b,c))],null):new V(null,1,5,W,[function(d){return oj(a,b,Zc.a(c,d))}],null)}
var pj=function pj(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return pj.b(arguments[0]);case 2:return pj.a(arguments[0],arguments[1]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};pj.b=function(a){return pj.a(Ig("mindist"),rg([a]))};pj.a=function(a,b){return new V(null,2,5,W,[function(c){return pj.a(a,Zc.a(b,c))},new q(null,3,[xi,a,Xh,Zi,ai,b],null)],null)};pj.B=2;var qj=new V(null,3,5,W,["1st","2nd","3rd"],null);
function rj(a){return new V(null,3,5,W,[sh,pe,function(){return function c(a){return new Xd(null,function(){for(;;){var e=w(a);if(e){if(pd(e)){var f=Ub(e),g=R(f),k=ae(g);a:for(var l=0;;)if(l<g){var m=G.a(f,l),n=S(m,0),m=S(m,1),n=new V(null,5,5,W,[Ih,pe,new V(null,3,5,W,[Gh,pe,[B(n),B(" point")].join("")],null)," \u2014 ",m],null);k.add(n);l+=1}else{f=!0;break a}return f?be(k.L(),c(Vb(e))):be(k.L(),null)}f=J(e);k=S(f,0);f=S(f,1);return Q(new V(null,5,5,W,[Ih,pe,new V(null,3,5,W,[Gh,pe,[B(k),B(" point")].join("")],
null)," \u2014 ",f],null),c(wc(e)))}return null}},null,null)}(U.c(pf,qj,a))}()],null)}
var tj=new V(null,13,5,W,[new q(null,4,[xi,Ki,Hh,"Point",Wi,function sj(){return new V(null,1,5,W,[sj],null)},gh,new V(null,3,5,W,[$i,pe,"Create a point."],null)],null),new q(null,4,[xi,qi,Hh,"Line",Wi,nj(qi,new V(null,2,5,W,[fi,lh],null)),gh,Za(Za(Za(L,new V(null,3,5,W,[$i,pe,"A line is the collinear set of points through two points."],null)),rj(uc(["the start of the line","the end of the line"],0))),new V(null,3,5,W,[$i,pe,"Create a line."],null))],null),new q(null,4,[xi,Ph,Hh,"Line Segment",Wi,
nj(Ph,new V(null,2,5,W,[fi,lh],null)),gh,Za(Za(Za(L,new V(null,3,5,W,[$i,pe,"A line segment is the set of points between two points."],null)),rj(uc(["the start of the line segment","the end of the line segment"],0))),new V(null,3,5,W,[$i,pe,"Create a line segment."],null))],null),new q(null,4,[xi,xh,Hh,"Ray",Wi,nj(xh,new V(null,2,5,W,[fi,lh],null)),gh,Za(Za(L,rj(uc(["the start of the ray","the line through which the ray passes"],0))),new V(null,3,5,W,[$i,pe,"Create a ray."],null))],null),new q(null,
4,[xi,Ch,Hh,"Parallel",Wi,nj(Ch,new V(null,3,5,W,[fi,lh,hi],null)),gh,Za(Za(L,rj(uc(["a point on the line","another point on the line","a point through which the parallel line passes"],0))),new V(null,3,5,W,[$i,pe,"Create a line parallel to the line between two points."],null))],null),new q(null,4,[xi,bi,Hh,"Midset",Wi,nj(bi,new V(null,2,5,W,[fi,lh],null)),gh,Za(Za(Za(L,new V(null,3,5,W,[$i,pe,"A midset is the set of points equidistant from two points."],null)),rj(uc(["the first point","the second point"],
0))),new V(null,3,5,W,[$i,pe,"Create a midset."],null))],null),new q(null,4,[xi,ci,Hh,"Perpendicular",Wi,nj(ci,new V(null,3,5,W,[fi,lh,hi],null)),gh,Za(Za(Za(L,new V(null,3,5,W,[$i,pe,"A perpendicular is the shortest line between a point and a line, extended indefinitely."],null)),rj(uc(["a point on the line","another point on the line","a point through which the perpendicular passes"],0))),new V(null,3,5,W,[$i,pe,"Create a perpendicular."],null))],null),new q(null,4,[xi,dj,Hh,"Bisect",Wi,nj(dj,new V(null,
3,5,W,[si,ph,di],null)),gh,Za(Za(L,rj(uc(["a point on the first ray","the vertex of the rays","a point on the second ray"],0))),new V(null,3,5,W,[$i,pe,"Show the line that bisects an angle."],null))],null),new q(null,4,[xi,Mh,Hh,"Circle",Wi,nj(Mh,new V(null,2,5,W,[mi,nh],null)),gh,Za(Za(Za(L,new V(null,3,5,W,[$i,pe,"A circle is the set of points a constant distance from another point."],null)),rj(uc(["the center of the circle","the point through which the circumference passes"],0))),new V(null,3,
5,W,[$i,pe,"Create a circle."],null))],null),new q(null,4,[xi,Fi,Hh,"Ellipse",Wi,nj(Fi,new V(null,3,5,W,[th,ui,hi],null)),gh,Za(Za(Za(L,new V(null,3,5,W,[$i,pe,"An ellipse is the set of points a constant total distance from two points."],null)),rj(uc(["one focus","another focus","a point through which the circumference passes"],0))),new V(null,3,5,W,[$i,pe,"Create an ellipse."],null))],null),new q(null,4,[xi,Ci,Hh,"Parabola",Wi,nj(Ci,new V(null,3,5,W,[Ji,jh,oh],null)),gh,Za(Za(Za(L,new V(null,3,5,
W,[$i,pe,"A parabola is the set of points equidistant from a point and a line."],null)),rj(uc(["the focus","a point on the directrix","another point on the directrix"],0))),new V(null,3,5,W,[$i,pe,"Create a parabola."],null))],null),new q(null,4,[xi,ei,Hh,"Hyperbola",Wi,nj(ei,new V(null,3,5,W,[th,ui,hi],null)),gh,Za(Za(L,rj(uc(["a focus","another focus","a point that defines the ratio"],0))),new V(null,3,5,W,[$i,pe,"Create a hyperbola."],null))],null),new q(null,4,[xi,Zi,Hh,"Minimum Distance",Wi,
pj,gh,Za(Za(L,new V(null,3,5,W,[$i,pe,"A minimum distance is the area that's the least sum total distance to more than one point."],null)),new V(null,3,5,W,[$i,pe,"Show the area with minimum total distance to multiple points."],null))],null)],null);var uj;a:{var vj=aa.navigator;if(vj){var wj=vj.userAgent;if(wj){uj=wj;break a}}uj=""};var xj,yj=function yj(b,c){if(null!=b&&null!=b.$b)return b.$b(0,c);var d=yj[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=yj._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("ReadPort.take!",b);},zj=function zj(b,c,d){if(null!=b&&null!=b.Pb)return b.Pb(0,c,d);var e=zj[p(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=zj._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw A("WritePort.put!",b);},Aj=function Aj(b){if(null!=b&&null!=b.Ob)return b.Ob();
var c=Aj[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Aj._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("Channel.close!",b);},Bj=function Bj(b){if(null!=b&&null!=b.nc)return!0;var c=Bj[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Bj._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("Handler.active?",b);},Cj=function Cj(b){if(null!=b&&null!=b.oc)return b.Ga;var c=Cj[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Cj._;if(null!=c)return c.b?
c.b(b):c.call(null,b);throw A("Handler.commit",b);},Dj=function Dj(b,c){if(null!=b&&null!=b.mc)return b.mc(0,c);var d=Dj[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Dj._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("Buffer.add!*",b);},Ej=function Ej(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ej.b(arguments[0]);case 2:return Ej.a(arguments[0],arguments[1]);default:throw Error([B("Invalid arity: "),
B(c.length)].join(""));}};Ej.b=function(a){return a};Ej.a=function(a,b){return Dj(a,b)};Ej.B=2;var Fj,Gj=function Gj(b){"undefined"===typeof Fj&&(Fj=function(b,d,e){this.ac=b;this.Ga=d;this.Lc=e;this.g=393216;this.D=0},Fj.prototype.T=function(b,d){return new Fj(this.ac,this.Ga,d)},Fj.prototype.S=function(){return this.Lc},Fj.prototype.nc=function(){return!0},Fj.prototype.oc=function(){return this.Ga},Fj.bc=function(){return new V(null,3,5,W,[Ic(Ui,new q(null,2,[wh,!0,ne,ic(oe,ic(new V(null,1,5,W,[lj],null)))],null)),lj,qa.bd],null)},Fj.Eb=!0,Fj.eb="cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers18915",
Fj.Qb=function(b,d){return Ib(d,"cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers18915")});return new Fj(Gj,b,pe)};function Hj(a){try{return a[0].call(null,a)}catch(b){throw b instanceof Object&&a[6].Ob(),b;}}function Ij(a,b,c){c=c.$b(0,Gj(function(c){a[2]=c;a[1]=b;return Hj(a)}));return x(c)?(a[2]=P.b?P.b(c):P.call(null,c),a[1]=b,Wh):null}function Jj(a,b,c){b=b.Pb(0,c,Gj(function(b){a[2]=b;a[1]=16;return Hj(a)}));return x(b)?(a[2]=P.b?P.b(b):P.call(null,b),a[1]=16,Wh):null}
function Kj(a,b){var c=a[6];null!=b&&c.Pb(0,b,Gj(function(){return function(){return null}}(c)));c.Ob();return c}function Lj(a,b,c,d,e,f,g,k){this.Na=a;this.Oa=b;this.Qa=c;this.Pa=d;this.Sa=e;this.Ua=f;this.Ea=g;this.w=k;this.g=2229667594;this.D=8192}h=Lj.prototype;h.P=function(a,b){return gb.c(this,b,null)};
h.M=function(a,b,c){switch(b instanceof y?b.Ja:null){case "catch-block":return this.Na;case "catch-exception":return this.Oa;case "finally-block":return this.Qa;case "continue-block":return this.Pa;case "prev":return this.Sa;default:return H.c(this.Ea,b,c)}};
h.O=function(a,b,c){return lf(b,function(){return function(a){return lf(b,mf,""," ","",c,a)}}(this),"#cljs.core.async.impl.ioc-helpers.ExceptionFrame{",", ","}",c,ge.a(new V(null,5,5,W,[new V(null,2,5,W,[Zh,this.Na],null),new V(null,2,5,W,[Ai,this.Oa],null),new V(null,2,5,W,[Eh,this.Qa],null),new V(null,2,5,W,[Gi,this.Pa],null),new V(null,2,5,W,[Di,this.Sa],null)],null),this.Ea))};h.Ia=function(){return new yf(0,this,5,new V(null,5,5,W,[Zh,Ai,Eh,Gi,Di],null),ac(this.Ea))};h.S=function(){return this.Ua};
h.$=function(){return 5+R(this.Ea)};h.R=function(){var a=this.w;if(null!=a)return a;a:for(var a=0,b=w(this);;)if(b)var c=J(b),a=(a+(qc(Nd.b?Nd.b(c):Nd.call(null,c))^qc(Od.b?Od.b(c):Od.call(null,c))))%4503599627370496,b=M(b);else break a;return this.w=a};h.C=function(a,b){var c;c=x(b)?(c=this.constructor===b.constructor)?xf(this,b):c:b;return x(c)?!0:!1};
h.Mb=function(a,b){return vd(new pg(null,new q(null,5,[Eh,null,Zh,null,Ai,null,Di,null,Gi,null],null),null),b)?ed.a(Ic(Pe(pe,this),this.Ua),b):new Lj(this.Na,this.Oa,this.Qa,this.Pa,this.Sa,this.Ua,ke(ed.a(this.Ea,b)),null)};
h.Xa=function(a,b,c){return x(Vd.a?Vd.a(Zh,b):Vd.call(null,Zh,b))?new Lj(c,this.Oa,this.Qa,this.Pa,this.Sa,this.Ua,this.Ea,null):x(Vd.a?Vd.a(Ai,b):Vd.call(null,Ai,b))?new Lj(this.Na,c,this.Qa,this.Pa,this.Sa,this.Ua,this.Ea,null):x(Vd.a?Vd.a(Eh,b):Vd.call(null,Eh,b))?new Lj(this.Na,this.Oa,c,this.Pa,this.Sa,this.Ua,this.Ea,null):x(Vd.a?Vd.a(Gi,b):Vd.call(null,Gi,b))?new Lj(this.Na,this.Oa,this.Qa,c,this.Sa,this.Ua,this.Ea,null):x(Vd.a?Vd.a(Di,b):Vd.call(null,Di,b))?new Lj(this.Na,this.Oa,this.Qa,
this.Pa,c,this.Ua,this.Ea,null):new Lj(this.Na,this.Oa,this.Qa,this.Pa,this.Sa,this.Ua,T.c(this.Ea,b,c),null)};h.V=function(){return w(ge.a(new V(null,5,5,W,[new V(null,2,5,W,[Zh,this.Na],null),new V(null,2,5,W,[Ai,this.Oa],null),new V(null,2,5,W,[Eh,this.Qa],null),new V(null,2,5,W,[Gi,this.Pa],null),new V(null,2,5,W,[Di,this.Sa],null)],null),this.Ea))};h.T=function(a,b){return new Lj(this.Na,this.Oa,this.Qa,this.Pa,this.Sa,b,this.Ea,this.w)};
h.Z=function(a,b){return md(b)?ib(this,G.a(b,0),G.a(b,1)):Ua.c(Za,this,b)};
function Mj(a){for(;;){var b=a[4],c=Zh.b(b),d=Ai.b(b),e=a[5];if(x(function(){var a=e;return x(a)?Na(b):a}()))throw e;if(x(function(){var a=e;return x(a)?(a=c,x(a)?e instanceof d:a):a}())){a[1]=c;a[2]=e;a[5]=null;a[4]=T.l(b,Zh,null,uc([Ai,null],0));break}if(x(function(){var a=e;return x(a)?Na(c)&&Na(Eh.b(b)):a}()))a[4]=Di.b(b);else{if(x(function(){var a=e;return x(a)?(a=Na(c))?Eh.b(b):a:a}())){a[1]=Eh.b(b);a[4]=T.c(b,Eh,null);break}if(x(function(){var a=Na(e);return a?Eh.b(b):a}())){a[1]=Eh.b(b);a[4]=
T.c(b,Eh,null);break}if(Na(e)&&Na(Eh.b(b))){a[1]=Gi.b(b);a[4]=Di.b(b);break}throw Error("No matching clause");}}};function Nj(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function Oj(a,b,c,d){this.head=a;this.N=b;this.length=c;this.f=d}Oj.prototype.pop=function(){if(0===this.length)return null;var a=this.f[this.N];this.f[this.N]=null;this.N=(this.N+1)%this.f.length;--this.length;return a};Oj.prototype.unshift=function(a){this.f[this.head]=a;this.head=(this.head+1)%this.f.length;this.length+=1;return null};function Pj(a,b){a.length+1===a.f.length&&a.resize();a.unshift(b)}
Oj.prototype.resize=function(){var a=Array(2*this.f.length);return this.N<this.head?(Nj(this.f,this.N,a,0,this.length),this.N=0,this.head=this.length,this.f=a):this.N>this.head?(Nj(this.f,this.N,a,0,this.f.length-this.N),Nj(this.f,0,a,this.f.length-this.N,this.head),this.N=0,this.head=this.length,this.f=a):this.N===this.head?(this.head=this.N=0,this.f=a):null};function Qj(a,b){for(var c=a.length,d=0;;)if(d<c){var e=a.pop();(b.b?b.b(e):b.call(null,e))&&a.unshift(e);d+=1}else break}
function Rj(a){return new Oj(0,0,0,Array(a))}function Sj(a,b){this.K=a;this.n=b;this.g=2;this.D=0}function Tj(a){return a.K.length===a.n}Sj.prototype.mc=function(a,b){Pj(this.K,b);return this};Sj.prototype.$=function(){return this.K.length};var Uj;
function Vj(){var a=aa.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==uj.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ia(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==uj.indexOf("Trident")&&-1==uj.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.ec;c.ec=null;a()}};return function(a){d.next={ec:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=
document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var Wj=Rj(32),Xj=!1,Yj=!1;Zj;function ak(){Xj=!0;Yj=!1;for(var a=0;;){var b=Wj.pop();if(null!=b&&(b.u?b.u():b.call(null),1024>a)){a+=1;continue}break}Xj=!1;return 0<Wj.length?Zj.u?Zj.u():Zj.call(null):null}function Zj(){var a=Yj;if(x(x(a)?Xj:a))return null;Yj=!0;"function"!=p(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(Uj||(Uj=Vj()),Uj(ak)):aa.setImmediate(ak)}function bk(a){Pj(Wj,a);Zj()}function ck(a){setTimeout(a,30)};var dk,ek=function ek(b){"undefined"===typeof dk&&(dk=function(b,d,e){this.sc=b;this.H=d;this.Mc=e;this.g=425984;this.D=0},dk.prototype.T=function(b,d){return new dk(this.sc,this.H,d)},dk.prototype.S=function(){return this.Mc},dk.prototype.vb=function(){return this.H},dk.bc=function(){return new V(null,3,5,W,[Ic(ki,new q(null,1,[ne,ic(oe,ic(new V(null,1,5,W,[ri],null)))],null)),ri,qa.cd],null)},dk.Eb=!0,dk.eb="cljs.core.async.impl.channels/t_cljs$core$async$impl$channels18978",dk.Qb=function(b,d){return Ib(d,
"cljs.core.async.impl.channels/t_cljs$core$async$impl$channels18978")});return new dk(ek,b,pe)};function fk(a,b){this.Fb=a;this.H=b}function gk(a){return Bj(a.Fb)}var hk=function hk(b){if(null!=b&&null!=b.lc)return b.lc();var c=hk[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=hk._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("MMC.abort",b);};function ik(a,b,c,d,e,f,g){this.sb=a;this.Sb=b;this.jb=c;this.Rb=d;this.K=e;this.closed=f;this.Fa=g}
ik.prototype.lc=function(){for(;;){var a=this.jb.pop();if(null!=a){var b=a.Fb;bk(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(b.Ga,b,a.H,a,this))}break}Qj(this.jb,ue());return Aj(this)};
ik.prototype.Pb=function(a,b,c){var d=this;if(a=d.closed)return ek(!a);if(x(function(){var a=d.K;return x(a)?Na(Tj(d.K)):a}())){for(c=Mc(d.Fa.a?d.Fa.a(d.K,b):d.Fa.call(null,d.K,b));;){if(0<d.sb.length&&0<R(d.K)){var e=d.sb.pop(),f=e.Ga,g=d.K.K.pop();bk(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(f,g,e,c,a,this))}break}c&&hk(this);return ek(!0)}e=function(){for(;;){var a=d.sb.pop();if(x(a)){if(x(!0))return a}else return null}}();if(x(e))return c=Cj(e),bk(function(a){return function(){return a.b?
a.b(b):a.call(null,b)}}(c,e,a,this)),ek(!0);64<d.Rb?(d.Rb=0,Qj(d.jb,gk)):d.Rb+=1;Pj(d.jb,new fk(c,b));return null};
ik.prototype.$b=function(a,b){var c=this;if(null!=c.K&&0<R(c.K)){for(var d=b.Ga,e=ek(c.K.K.pop());;){if(!x(Tj(c.K))){var f=c.jb.pop();if(null!=f){var g=f.Fb,k=f.H;bk(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(g.Ga,g,k,f,d,e,this));Mc(c.Fa.a?c.Fa.a(c.K,k):c.Fa.call(null,c.K,k))&&hk(this);continue}}break}return e}d=function(){for(;;){var a=c.jb.pop();if(x(a)){if(Bj(a.Fb))return a}else return null}}();if(x(d))return e=Cj(d.Fb),bk(function(a){return function(){return a.b?a.b(!0):
a.call(null,!0)}}(e,d,this)),ek(d.H);if(x(c.closed))return x(c.K)&&(c.Fa.b?c.Fa.b(c.K):c.Fa.call(null,c.K)),x(x(!0)?b.Ga:!0)?(d=function(){var a=c.K;return x(a)?0<R(c.K):a}(),d=x(d)?c.K.K.pop():null,ek(d)):null;64<c.Sb?(c.Sb=0,Qj(c.sb,Bj)):c.Sb+=1;Pj(c.sb,b);return null};
ik.prototype.Ob=function(){var a=this;if(!a.closed)for(a.closed=!0,x(function(){var b=a.K;return x(b)?0===a.jb.length:b}())&&(a.Fa.b?a.Fa.b(a.K):a.Fa.call(null,a.K));;){var b=a.sb.pop();if(null==b)break;else{var c=b.Ga,d=x(function(){var b=a.K;return x(b)?0<R(a.K):b}())?a.K.K.pop():null;bk(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(c,d,b,this))}}return null};function jk(a){console.log(a);return null}
function kk(a,b){var c=(x(null)?null:jk).call(null,b);return null==c?a:Ej.a(a,c)}
function lk(a){return new ik(Rj(32),0,Rj(32),0,a,!1,function(){return function(a){return function(){function c(c,d){try{return a.a?a.a(c,d):a.call(null,c,d)}catch(e){return kk(c,e)}}function d(c){try{return a.b?a.b(c):a.call(null,c)}catch(d){return kk(c,d)}}var e=null,e=function(a,b){switch(arguments.length){case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};e.b=d;e.a=c;return e}()}(x(null)?null.b?null.b(Ej):null.call(null,Ej):Ej)}())};function mk(a,b,c){this.key=a;this.H=b;this.forward=c;this.g=2155872256;this.D=0}mk.prototype.V=function(){return Za(Za(L,this.H),this.key)};mk.prototype.O=function(a,b,c){return lf(b,mf,"["," ","]",c,this)};function nk(a,b,c){c=Array(c+1);for(var d=0;;)if(d<c.length)c[d]=null,d+=1;else break;return new mk(a,b,c)}function ok(a,b,c,d){for(;;){if(0>c)return a;a:for(;;){var e=a.forward[c];if(x(e))if(e.key<b)a=e;else break a;else break a}null!=d&&(d[c]=a);--c}}
function pk(a,b){this.hb=a;this.level=b;this.g=2155872256;this.D=0}pk.prototype.put=function(a,b){var c=Array(15),d=ok(this.hb,a,this.level,c).forward[0];if(null!=d&&d.key===a)return d.H=b;a:for(d=0;;)if(.5>Math.random()&&15>d)d+=1;else break a;if(d>this.level){for(var e=this.level+1;;)if(e<=d+1)c[e]=this.hb,e+=1;else break;this.level=d}for(d=nk(a,b,Array(d));;)return 0<=this.level?(c=c[0].forward,d.forward[0]=c[0],c[0]=d):null};
pk.prototype.remove=function(a){var b=Array(15),c=ok(this.hb,a,this.level,b).forward[0];if(null!=c&&c.key===a){for(a=0;;)if(a<=this.level){var d=b[a].forward;d[a]===c&&(d[a]=c.forward[a]);a+=1}else break;for(;;)if(0<this.level&&null==this.hb.forward[this.level])--this.level;else return null}else return null};function qk(a){for(var b=rk,c=b.hb,d=b.level;;){if(0>d)return c===b.hb?null:c;var e;a:for(e=c;;){e=e.forward[d];if(null==e){e=null;break a}if(e.key>=a)break a}null!=e?(--d,c=e):--d}}
pk.prototype.V=function(){return function(a){return function c(d){return new Xd(null,function(){return function(){return null==d?null:Q(new V(null,2,5,W,[d.key,d.H],null),c(d.forward[0]))}}(a),null,null)}}(this)(this.hb.forward[0])};pk.prototype.O=function(a,b,c){return lf(b,function(){return function(a){return lf(b,mf,""," ","",c,a)}}(this),"{",", ","}",c,this)};var rk=new pk(nk(null,null,0),0);
function sk(){var a=(new Date).valueOf()+30,b=qk(a),c=x(x(b)?b.key<a+10:b)?b.H:null;if(x(c))return c;var d=lk(null);rk.put(a,d);ck(function(a,b,c){return function(){rk.remove(c);return Aj(a)}}(d,c,a,b));return d};var tk=function tk(b){"undefined"===typeof xj&&(xj=function(b,d,e){this.ac=b;this.Ga=d;this.Kc=e;this.g=393216;this.D=0},xj.prototype.T=function(b,d){return new xj(this.ac,this.Ga,d)},xj.prototype.S=function(){return this.Kc},xj.prototype.nc=function(){return!0},xj.prototype.oc=function(){return this.Ga},xj.bc=function(){return new V(null,3,5,W,[Ic(Ui,new q(null,2,[wh,!0,ne,ic(oe,ic(new V(null,1,5,W,[lj],null)))],null)),lj,qa.ad],null)},xj.Eb=!0,xj.eb="cljs.core.async/t_cljs$core$async16147",xj.Qb=
function(b,d){return Ib(d,"cljs.core.async/t_cljs$core$async16147")});return new xj(tk,b,pe)};function uk(a){a=kc.a(a,0)?null:a;return lk("number"===typeof a?new Sj(Rj(a),a):a)}function vk(a,b){var c=yj(a,tk(b));if(x(c)){var d=P.b?P.b(c):P.call(null,c);x(!0)?b.b?b.b(d):b.call(null,d):bk(function(a){return function(){return b.b?b.b(a):b.call(null,a)}}(d,c))}return null}
var wk=tk(function(){return null}),xk=function xk(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return xk.a(arguments[0],arguments[1]);case 3:return xk.c(arguments[0],arguments[1],arguments[2]);case 4:return xk.v(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};xk.a=function(a,b){var c=zj(a,b,wk);return x(c)?P.b?P.b(c):P.call(null,c):!0};
xk.c=function(a,b,c){return xk.v(a,b,c,!0)};xk.v=function(a,b,c,d){a=zj(a,b,tk(c));return x(a)?(b=P.b?P.b(a):P.call(null,a),x(d)?c.b?c.b(b):c.call(null,b):bk(function(a){return function(){return c.b?c.b(a):c.call(null,a)}}(b,a,a)),b):!0};xk.B=4;var yk=VDOM.diff,zk=VDOM.patch,Ak=VDOM.create;function Bk(a){return Me(La,Me(td,Ne(td,a)))}function Ck(a,b,c){return new VDOM.VHtml(Md(a),Ng(b),Ng(c))}function Dk(a,b,c){return new VDOM.VSvg(Md(a),Ng(b),Ng(c))}Ek;
var Fk=function Fk(b){if(null==b)return new VDOM.VText("");if(td(b))return Ck(ji,pe,U.a(Fk,Bk(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(kc.a(Ei,J(b)))return Ek.b?Ek.b(b):Ek.call(null,b);var c=S(b,0),d=S(b,1);b=Ld(b,2);return Ck(c,d,U.a(Fk,Bk(b)))},Ek=function Ek(b){if(null==b)return new VDOM.VText("");if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(kc.a(jj,J(b))){var c=S(b,0),d=S(b,1);b=Ld(b,2);return Dk(c,d,U.a(Fk,Bk(b)))}c=S(b,0);d=S(b,
1);b=Ld(b,2);return Dk(c,d,U.a(Ek,Bk(b)))};var Gk=Error();function Hk(a){return function(b){b.stopPropagation();return a.u?a.u():a.call(null)}};function Ik(a,b,c){if(Rd(c))return c=D.a(ic,U.a(a,c)),b.b?b.b(c):b.call(null,c);if(td(c))return c=wg(U.a(a,c)),b.b?b.b(c):b.call(null,c);if(ld(c))return c=Ua.c(function(b,c){return Zc.a(b,a.b?a.b(c):a.call(null,c))},c,c),b.b?b.b(c):b.call(null,c);hd(c)&&(c=Pe(null==c?null:Xa(c),U.a(a,c)));return b.b?b.b(c):b.call(null,c)}var Jk=function Jk(b,c){return Ik(ve(Jk,b),b,c)};function Kk(){var a=Lk,b=Mk,c=Nk,d=uk(null);xk.a(d,b);var e=uk(1);bk(function(d,e){return function(){var k=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!Vd(e,Wh)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Mj(c),d=Wh;else throw f;}if(!Vd(d,Wh))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,
a)}throw Error("Invalid arity: "+arguments.length);};d.u=c;d.b=b;return d}()}(function(d,e){return function(d){var f=d[1];if(1===f)return Ij(d,2,c);if(2===f){var g=b,k=d[2];d[7]=k;d[8]=g;d[2]=null;d[1]=3;return Wh}return 3===f?(k=d[7],g=d[8],f=d[9],f=a.a?a.a(g,k):a.call(null,g,k),g=xk.a(e,f),d[10]=g,d[9]=f,Ij(d,5,c)):4===f?(f=d[2],Kj(d,f)):5===f?(f=d[9],g=d[2],d[7]=g,d[8]=f,d[2]=null,d[1]=3,Wh):null}}(d,e),d,e)}(),l=function(){var a=k.u?k.u():k.call(null);a[6]=d;return a}();return Hj(l)}}(e,d));return d}
;function Ok(a){return Math.abs(a)}function Pk(a,b){var c=null!=a&&(a.g&64||a.A)?D.a(N,a):a,d=H.a(c,Z),c=H.a(c,Y),e=null!=b&&(b.g&64||b.A)?D.a(N,b):b,f=H.a(e,Z);return(H.a(e,Y)-c)/(f-d)}function Qk(a,b){var c=null!=b&&(b.g&64||b.A)?D.a(N,b):b,d=H.a(c,Z);return H.a(c,Y)-a*d}function Rk(a,b){return function(c){return a*c+b}}function Sk(a,b){return function(c){return(c-b)/a}}
function Tk(a,b){var c=null!=a&&(a.g&64||a.A)?D.a(N,a):a,d=H.a(c,Z),c=H.a(c,Y),e=S(b,0),f=S(b,1),f=Pk(e,f),e=Qk(f,e);return 1<Ok(f)?new q(null,2,[Z,Sk(f,e).call(null,c),Y,c],null):new q(null,2,[Z,d,Y,Rk(f,e).call(null,d)],null)}function Uk(a,b){return Vk(Z,a,b)+Vk(Y,a,b)}function Vk(a,b,c){return Ok((a.b?a.b(b):a.call(null,b))-(a.b?a.b(c):a.call(null,c)))}function Wk(a){return Ua.a(Cd,a)/R(a)}function Xk(a,b){return a-.01<b&&b<a+.01}
function Yk(a,b,c){var d=Pk(a,b);c=Pk(b,c);var e=kc.a(Ok(d),Infinity)&&kc.a(Ok(c),Infinity);if(e)return e;e=Xk(d,c);return x(e)?Xk(Qk(d,a),Qk(c,b)):e}function Zk(a){var b=U.a(Z,a);a=U.a(Y,a);var c=D.a(Ed,b),b=x(c)?c:D.a(Gd,b);return x(b)?(b=D.a(Ed,a),x(b)?b:D.a(Gd,a)):b}function $k(a,b){var c=null!=a&&(a.g&64||a.A)?D.a(N,a):a,d=H.a(c,Z),c=H.a(c,Y),e=null!=b&&(b.g&64||b.A)?D.a(N,b):b,f=H.a(e,Z),e=H.a(e,Y);return new q(null,2,[Z,Wk(uc([d,f],0)),Y,Wk(uc([c,e],0))],null)}
function al(a,b){var c=null!=a&&(a.g&64||a.A)?D.a(N,a):a,d=H.a(c,Z),c=H.a(c,Y),e=null!=b&&(b.g&64||b.A)?D.a(N,b):b,f=H.a(e,Z),g=H.a(e,Y);if(0===d-f)return new q(null,2,[Z,d,Y,g<c?0:1E4],null);var e=Pk(a,b),k=Qk(e,a),d=f<d?0:1E4,c=g<c?0:1E4,c=1<Ok(e)?new V(null,2,5,W,[(c-k)/e,c],null):new V(null,2,5,W,[d,k+e*d],null),d=S(c,0),c=S(c,1);return new q(null,2,[Z,d,Y,c],null)}
function bl(a,b){var c=null!=a&&(a.g&64||a.A)?D.a(N,a):a,d=H.a(c,Z),c=H.a(c,Y),e=null!=b&&(b.g&64||b.A)?D.a(N,b):b,f=H.a(e,Z),e=H.a(e,Y);return new V(null,2,5,W,[new q(null,2,[Z,d,Y,e],null),new q(null,2,[Z,f,Y,c],null)],null)}function cl(a,b){var c=bl(a,b),d=S(c,0),c=S(c,1);return new V(null,4,5,W,[a,d,b,c],null)}function dl(a){var b=null!=a&&(a.g&64||a.A)?D.a(N,a):a;a=H.a(b,Z);b=H.a(b,Y);return(0>=a||1E4<=a)&&(0>=b||1E4<=b)}function el(a,b,c){return Ve(Ve(a,Z,Cd,b),Y,Cd,c)}
function fl(a,b){var c=null!=a&&(a.g&64||a.A)?D.a(N,a):a;H.a(c,Z);H.a(c,Y);return new V(null,4,5,W,[el(c,-b,0),el(c,0,-b),el(c,b,0),el(c,0,b)],null)}function gl(a,b){return kc.a(Z.b(a),Z.b(b))}
function hl(a,b){var c=S(a,0),d=S(a,1),e=S(b,0),f=S(b,1),g;g=gl(c,d);g=x(g)?gl(e,f):g;if(x(g))return null;if(x(gl(c,d)))return g=Z.b(c),f=Pk(e,f),e=Qk(f,e),new q(null,2,[Z,g,Y,Rk(f,e).call(null,g)],null);if(x(gl(e,f)))return g=Z.b(e),f=Pk(c,d),e=Qk(f,c),new q(null,2,[Z,g,Y,Rk(f,e).call(null,g)],null);if(kc.a(Pk(c,d),Pk(e,f)))return null;d=Pk(c,d);g=Pk(e,f);c=Qk(d,c);g=(Qk(g,e)-c)/(d-g);return new q(null,2,[Z,g,Y,Rk(d,c).call(null,g)],null)}
function il(a,b){var c=S(a,0),d=S(a,1);return Me(La,U.a(function(a,b,c){return function(a){return hl(new V(null,2,5,W,[b,c],null),a)}}(a,c,d),U.c(pf,b,Fe(Ge(b)))))}function jl(a,b){return Le(function(a){return Xk(100,Uk(b,a))},il(a,fl(b,100)))}function kl(a,b){var c=null!=a&&(a.g&64||a.A)?D.a(N,a):a,d=H.a(c,Z),c=H.a(c,Y),e=null!=b&&(b.g&64||b.A)?D.a(N,b):b,f=H.a(e,Z),e=H.a(e,Y),d=f-d,c=e-c;return new V(null,2,5,W,[d/Ok(d),c/Ok(c)],null)};if("undefined"===typeof eh)var eh=function(){var a=ye.b?ye.b(pe):ye.call(null,pe),b=ye.b?ye.b(pe):ye.call(null,pe),c=ye.b?ye.b(pe):ye.call(null,pe),d=ye.b?ye.b(pe):ye.call(null,pe),e=H.c(pe,Si,Rg());return new bh(tc.a("taxicab.shapes","shape"),function(){return function(a){a=null!=a&&(a.g&64||a.A)?D.a(N,a):a;return H.a(a,Xh)}}(a,b,c,d,e),Dh,e,a,b,c,d)}();
dh(Ki,function(a){var b=null!=a&&(a.g&64||a.A)?D.a(N,a):a;H.a(b,xi);a=H.a(b,Z);var c=H.a(b,Y),b=H.a(b,wi);return new q(null,1,[ai,new V(null,1,5,W,[new q(null,3,[Z,a,Y,c,wi,b],null)],null)],null)});dh(qi,function(a){var b=null!=a&&(a.g&64||a.A)?D.a(N,a):a;H.a(b,xi);a=H.a(b,fi);b=H.a(b,lh);return new q(null,2,[Li,new V(null,1,5,W,[new V(null,2,5,W,[al(b,a),al(a,b)],null)],null),ni,new V(null,2,5,W,[a,b],null)],null)});
dh(Ph,function(a){var b=null!=a&&(a.g&64||a.A)?D.a(N,a):a;a=H.a(b,fi);b=H.a(b,lh);return new q(null,2,[Li,new V(null,1,5,W,[new V(null,2,5,W,[a,b],null)],null),ni,new V(null,2,5,W,[a,b],null)],null)});dh(xh,function(a){var b=null!=a&&(a.g&64||a.A)?D.a(N,a):a;a=H.a(b,fi);b=H.a(b,lh);return new q(null,2,[Li,new V(null,1,5,W,[new V(null,2,5,W,[a,al(a,b)],null)],null),ni,new V(null,2,5,W,[a,b],null)],null)});
dh(Ch,function(a){var b=null!=a&&(a.g&64||a.A)?D.a(N,a):a;a=H.a(b,fi);var c=H.a(b,lh),b=H.a(b,hi),d=el(b,1,Pk(a,c));return new q(null,3,[Li,new V(null,1,5,W,[new V(null,2,5,W,[al(b,d),al(d,b)],null)],null),ni,new V(null,3,5,W,[a,c,b],null),oi,new V(null,1,5,W,[new V(null,2,5,W,[al(a,c),al(c,a)],null)],null)],null)});
dh(bi,function(a){var b=null!=a&&(a.g&64||a.A)?D.a(N,a):a,c=H.a(b,fi),d=H.a(b,lh),e=function(a,b,c,d){return function(a){return Xk(Uk(c,a),Uk(d,a))}}(a,b,c,d),f=$k(c,d),g=Uk(c,f),k=Le(e,ge.a(fl(c,g),fl(d,g))),l=S(k,0),m=S(k,1);a=function(a){return function(b){return Le(a,fl(b,1))}}(e,f,g,k,l,m,a,b,c,d);return new q(null,4,[Li,new V(null,1,5,W,[new V(null,2,5,W,[l,m],null)],null),Hi,new V(null,2,5,W,[new V(null,2,5,W,[l,a(l)],null),kc.a(l,m)?null:new V(null,2,5,W,[m,a(m)],null)],null),ni,new V(null,
2,5,W,[c,d],null),oi,new V(null,1,5,W,[new V(null,2,5,W,[c,d],null)],null)],null)});
dh(ci,function(a){var b=null!=a&&(a.g&64||a.A)?D.a(N,a):a;a=H.a(b,fi);var c=H.a(b,lh),b=H.a(b,hi),d=Pk(a,c);kc.a(1,d)?d=new V(null,2,5,W,[new V(null,3,5,W,[b,el(b,1,0),el(b,0,-1)],null),new V(null,3,5,W,[b,el(b,-1,0),el(b,0,1)],null)],null):kc.a(-1,d)?d=new V(null,2,5,W,[new V(null,3,5,W,[b,el(b,-1,0),el(b,0,-1)],null),new V(null,3,5,W,[b,el(b,1,0),el(b,0,1)],null)],null):(d=Tk(b,new V(null,2,5,W,[a,c],null)),d=new V(null,1,5,W,[new V(null,3,5,W,[b,al(d,b),al(b,d)],null)],null));return new q(null,
3,[Hi,d,ni,new V(null,3,5,W,[a,c,b],null),oi,new V(null,1,5,W,[new V(null,2,5,W,[al(a,c),al(c,a)],null)],null)],null)});
dh(dj,function(a){var b=null!=a&&(a.g&64||a.A)?D.a(N,a):a,c=H.a(b,si),d=H.a(b,ph),e=H.a(b,di),b=function(a,b,c,d,e){return function(n){return J(Le(function(a,b,c,d){return function(a){var b=new V(null,2,5,W,[d,n],null),c=S(b,0),b=S(b,1),e=Yk(c,b,a);x(e)?(e=Zk(uc([c,b,a],0)),a=x(e)?e:Zk(uc([c,a,b],0))):a=e;return a}}(a,b,c,d,e),jl(new V(null,2,5,W,[d,n],null),d)))}}(a,b,c,d,e);a=b(c);b=b(e);a=$k(a,b);return new q(null,3,[Li,new V(null,1,5,W,[new V(null,2,5,W,[d,al(d,a)],null)],null),ni,new V(null,
3,5,W,[c,d,e],null),oi,new V(null,2,5,W,[new V(null,2,5,W,[d,al(d,c)],null),new V(null,2,5,W,[d,al(d,e)],null)],null)],null)});dh(Mh,function(a){var b=null!=a&&(a.g&64||a.A)?D.a(N,a):a;a=H.a(b,mi);b=H.a(b,nh);return new q(null,2,[$h,new V(null,1,5,W,[fl(a,Uk(a,b))],null),ni,new V(null,2,5,W,[T.c(a,fh,"Center"),b],null)],null)});
dh(Fi,function(a){var b=null!=a&&(a.g&64||a.A)?D.a(N,a):a;a=H.a(b,th);var c=H.a(b,ui),b=H.a(b,hi),d=null!=a&&(a.g&64||a.A)?D.a(N,a):a,e=H.a(d,Z),d=H.a(d,Y),f=null!=c&&(c.g&64||c.A)?D.a(N,c):c,g=H.a(f,Z),f=H.a(f,Y),g=zd(new V(null,2,5,W,[e,g],null)),e=S(g,0),g=S(g,1),f=zd(new V(null,2,5,W,[d,f],null)),d=S(f,0),f=S(f,1),k=(Uk(a,b)+Uk(c,b)-Uk(a,c))/2;return new q(null,2,[$h,new V(null,1,5,W,[new V(null,9,5,W,[new q(null,2,[Z,e-k,Y,d],null),new q(null,2,[Z,e-k,Y,f],null),new q(null,2,[Z,e,Y,f+k],null),
new q(null,2,[Z,g,Y,f+k],null),new q(null,2,[Z,g+k,Y,f],null),new q(null,2,[Z,g+k,Y,d],null),new q(null,2,[Z,g,Y,d-k],null),new q(null,2,[Z,e,Y,d-k],null),new q(null,2,[Z,e-k,Y,d],null)],null)],null),ni,new V(null,3,5,W,[T.c(a,fh,"Focus"),T.c(c,fh,"Focus"),b],null)],null)});
dh(Ci,function(a){var b=null!=a&&(a.g&64||a.A)?D.a(N,a):a,c=H.a(b,Ji),d=H.a(b,jh),e=H.a(b,oh),f=function(a,b,c,d,e){return function(a){var b=Uk(a,c);a=Uk(a,Tk(a,new V(null,2,5,W,[d,e],null)));return Xk(b,a)}}(a,b,c,d,e);return new q(null,3,[Li,kc.a(1,Ok(Pk(d,e)))?function(){var a=$k(c,hl(new V(null,2,5,W,[d,e],null),new V(null,2,5,W,[c,el(c,1,0)],null))),b=$k(c,hl(new V(null,2,5,W,[d,e],null),new V(null,2,5,W,[c,el(c,0,1)],null))),l=Le(f,fl(a,1)),l=S(l,0),m=Le(f,fl(b,1)),m=S(m,0);return new V(null,
1,5,W,[new V(null,4,5,W,[al(a,l),a,b,al(b,m)],null)],null)}():function(){var a=$k(c,Tk(c,new V(null,2,5,W,[d,e],null))),b=hl(new V(null,2,5,W,[d,e],null),new V(null,2,5,W,[c,el(c,1,1)],null)),l=hl(new V(null,2,5,W,[d,e],null),new V(null,2,5,W,[c,el(c,1,-1)],null)),m=Le(f,bl(c,b)),m=S(m,0),n=Le(f,bl(c,l)),n=S(n,0);return new V(null,1,5,W,[new V(null,5,5,W,[al(b,m),m,a,n,al(l,n)],null)],null)}(),ni,new V(null,3,5,W,[T.c(c,fh,"Focus"),d,e],null),oi,new V(null,1,5,W,[new V(null,2,5,W,[al(d,e),al(e,d)],
null)],null)],null)});
dh(ei,function(a){var b=null!=a&&(a.g&64||a.A)?D.a(N,a):a,c=H.a(b,th),d=H.a(b,ui),e=H.a(b,hi),f=function(a,b,c,d){return function(a){return Ok(Uk(a,c)-Uk(a,d))}}(a,b,c,d,e),g=f(e),k=(Uk(c,d)-g)/2,l=function(a,b){return function(c){return Xk(b,a(c))}}(f,g,k,a,b,c,d,e),m=function(a,b,c,d){return function(a){return new V(null,2,5,W,[a,Le(d,fl(a,5))],null)}}(f,g,k,l,a,b,c,d,e),n=new V(null,2,5,W,[T.c(c,fh,"Focus"),T.c(d,fh,"Focus")],null);if(0===k)return new q(null,2,[Hi,new V(null,2,5,W,[m(c),m(d)],
null),ni,n],null);a=function(a,b,c,d,e,f,g,k,l,m,n){return function(E,ea){var O=U.a(ve(Dd,c),kl(E,ea)),ca=S(O,0),fa=S(O,1),O=Le(function(a,b,c,d,e,f,g){return function(a){var b=g(a);return x(b)?Xk(f,Uk(E,a)):b}}(O,ca,fa,a,b,c,d,e,f,g,k,l,m,n),il(new V(null,2,5,W,[el(E,ca,0),el(E,0,fa)],null),cl(l,m)));return new q(null,2,[Li,new V(null,1,5,W,[O],null),Hi,U.a(e,O)],null)}}(f,g,k,l,m,n,a,b,c,d,e);return ig.l(uc([jg.l(ge,uc([a(c,d),a(d,c)],0)),new q(null,1,[ni,n],null)],0))});
dh(Zi,function(a){a=null!=a&&(a.g&64||a.A)?D.a(N,a):a;a=H.a(a,ai);var b=R(a);if("number"!==typeof b||isNaN(b)||Infinity===b||parseFloat(b)!==parseInt(b,10))throw Error([B("Argument must be an integer: "),B(b)].join(""));if(0===(b&1)){var c,b=R(a)/2|0;c=zd(U.a(Z,a));var d=zd(U.a(Y,a));c=new V(null,2,5,W,[new q(null,2,[Z,bd(c,b-1),Y,bd(d,b-1)],null),new q(null,2,[Z,bd(c,b),Y,bd(d,b)],null)],null);b=S(c,0);c=S(c,1);var e=null!=b&&(b.g&64||b.A)?D.a(N,b):b,d=H.a(e,Z),e=H.a(e,Y),f=null!=c&&(c.g&64||c.A)?
D.a(N,c):c,g=H.a(f,Z),f=H.a(f,Y);$k(b,c);return new q(null,2,[ej,new V(null,1,5,W,[new V(null,5,5,W,[new q(null,2,[Z,d,Y,e],null),new q(null,2,[Z,d,Y,f],null),new q(null,2,[Z,g,Y,f],null),new q(null,2,[Z,g,Y,e],null),new q(null,2,[Z,d,Y,e],null)],null)],null),ni,a],null)}b=R(a)/2|0;c=zd(U.a(Z,a));d=zd(U.a(Y,a));b=new q(null,2,[Z,bd(c,b),Y,bd(d,b)],null);c=null!=b&&(b.g&64||b.A)?D.a(N,b):b;b=H.a(c,Z);c=H.a(c,Y);return new q(null,2,[ai,new V(null,1,5,W,[new q(null,2,[Z,b,Y,c],null)],null),ni,a],null)});function ll(a,b){var c=ml(),d=c.createSVGPoint();d.x=a;d.y=b;return d.matrixTransform(c.getScreenCTM().inverse())}function nl(a){a=a.getBoundingClientRect();return new V(null,2,5,W,[a.width,a.height],null)}function ml(){return document.getElementById("workspace")}var ol=vg(function(a){return a.x},function(a){return a.y});function pl(a){a=null!=a&&(a.g&64||a.A)?D.a(N,a):a;a=H.a(a,Xh);return kc.a(Ki,a)}
function ql(a,b){return new V(null,3,5,W,[ji,new q(null,1,[xi,"tools"],null),function(){return function d(e){return new Xd(null,function(){for(;;){var f=w(e);if(f){var g=f;if(pd(g)){var k=Ub(g),l=R(k),m=ae(l);return function(){for(var d=0;;)if(d<l){var e=G.a(k,d),n=null!=e&&(e.g&64||e.A)?D.a(N,e):e,r=n,t=H.a(n,Hh),u=H.a(n,xi),v=kc.a(xi.b(a),u);ce(m,new V(null,4,5,W,[ji,new q(null,1,[gi,"tool-container"],null),new V(null,3,5,W,[zh,new q(null,3,[xi,[B("tool-"),B(Md(u))].join(""),gi,[B("tool"),B(v?" selected":
null)].join(""),Oh,function(a,d,e,f,g){return function(){var a=new V(null,2,5,W,[Lh,g],null);return b.b?b.b(a):b.call(null,a)}}(d,v,e,n,r,t,u,k,l,m,g,f)],null),t],null),v?new V(null,3,5,W,[ji,new q(null,1,[gi,"description"],null),gh.b(r)],null):null],null));d+=1}else return!0}()?be(m.L(),d(Vb(g))):be(m.L(),null)}var n=J(g),r=null!=n&&(n.g&64||n.A)?D.a(N,n):n,t=r,u=H.a(r,Hh),v=H.a(r,xi),z=kc.a(xi.b(a),v);return Q(new V(null,4,5,W,[ji,new q(null,1,[gi,"tool-container"],null),new V(null,3,5,W,[zh,new q(null,
3,[xi,[B("tool-"),B(Md(v))].join(""),gi,[B("tool"),B(z?" selected":null)].join(""),Oh,function(a,d,e,f){return function(){var a=new V(null,2,5,W,[Lh,f],null);return b.b?b.b(a):b.call(null,a)}}(z,n,r,t,u,v,g,f)],null),u],null),z?new V(null,3,5,W,[ji,new q(null,1,[gi,"description"],null),gh.b(t)],null):null],null),d(wc(g)))}return null}},null,null)}(tj)}()],null)}
function rl(a,b){var c=null!=a&&(a.g&64||a.A)?D.a(N,a):a,d=H.a(c,Vh),e=H.a(c,Th),f=H.a(c,qh),g=H.a(c,Yi);return new V(null,8,5,W,[ji,new q(null,1,[xi,"options"],null),w(d)?new V(null,3,5,W,[zh,new q(null,1,[Oh,function(){return function(){return b.b?b.b(pi):b.call(null,pi)}}(a,c,d,e,f,g)],null),"Undo"],null):null,w(e)?new V(null,3,5,W,[zh,new q(null,1,[Oh,function(){return function(){return b.b?b.b(Bh):b.call(null,Bh)}}(a,c,d,e,f,g)],null),"Redo"],null):null,x(f)?new V(null,3,5,W,[zh,new q(null,1,
[Oh,function(){return function(){var a=new V(null,2,5,W,[bj,!1],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g)],null),"Hide labels"],null):new V(null,3,5,W,[zh,new q(null,1,[Oh,function(){return function(){var a=new V(null,2,5,W,[bj,!0],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g)],null),"Show labels"],null),new V(null,3,5,W,[zh,new q(null,1,[Oh,function(){return function(){return b.b?b.b(Ti):b.call(null,Ti)}}(a,c,d,e,f,g)],null),"Save Image"],null),new V(null,3,5,W,[zh,new q(null,
1,[Oh,function(){return function(){return b.b?b.b(ij):b.call(null,ij)}}(a,c,d,e,f,g)],null),"Clear Workspace"],null),new V(null,4,5,W,[ji,new q(null,1,[gi,"widget"],null),"Grid",new V(null,2,5,W,[Ni,new q(null,6,[Xh,"range",mh,0,ti,40,Xi,5,Jh,g,Oi,function(){return function(){var a=new V(null,2,5,W,[Fh,this.value|0],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g)],null)],null)],null)],null)}
function sl(a){var b=ml();if(x(x(b)?2<a:b)){var c=nl(b),d=S(c,0),e=S(c,1);return new V(null,4,5,W,[li,new q(null,1,[yi,"grid"],null),function(){return function(a,b,c){return function m(d){return new Xd(null,function(){return function(){for(;;){var a=w(d);if(a){if(pd(a)){var b=Ub(a),c=R(b),e=ae(c);a:for(var f=0;;)if(f<c){var g=G.a(b,f);e.add(new V(null,2,5,W,[qi,new q(null,3,[Mi,g,aj,g,Qi,"100%"],null)],null));f+=1}else{b=!0;break a}return b?be(e.L(),m(Vb(a))):be(e.L(),null)}e=J(a);return Q(new V(null,
2,5,W,[qi,new q(null,3,[Mi,e,aj,e,Qi,"100%"],null)],null),m(wc(a)))}return null}}}(a,b,c),null,null)}}(c,d,e)(new ug(null,0,d,a,null))}(),function(){return function(a,b,c){return function m(d){return new Xd(null,function(){return function(){for(;;){var a=w(d);if(a){if(pd(a)){var b=Ub(a),c=R(b),e=ae(c);a:for(var f=0;;)if(f<c){var g=G.a(b,f);e.add(new V(null,2,5,W,[qi,new q(null,3,[aj,"100%",Nh,g,Qi,g],null)],null));f+=1}else{b=!0;break a}return b?be(e.L(),m(Vb(a))):be(e.L(),null)}e=J(a);return Q(new V(null,
2,5,W,[qi,new q(null,3,[aj,"100%",Nh,e,Qi,e],null)],null),m(wc(a)))}return null}}}(a,b,c),null,null)}}(c,d,e)(new ug(null,0,e,a,null))}()],null)}return null}function tl(a,b){var c=null!=b&&(b.g&64||b.A)?D.a(N,b):b,d=H.a(c,xi),e=function(){return function(b){return b instanceof jc?ed.a(a.b?a.b(b):a.call(null,b),xi):b}}(b,c,c,d),c=ed.a(c,xi),e=Jk(e,c);return T.c(e,xi,d)}function ul(a){var b=S(a,0);a=S(a,1);return[B(b),B(","),B(a)].join("")}var vl=vg(Z,Y);
function wl(a){return ge.a(a,new V(null,1,5,W,["Z"],null))}function xl(a){return w(a)?D.c(B,"M",Je(U.a(ul,U.a(vl,a)))):null}function yl(a){return w(a)?D.c(B,"M",wl(Je(U.a(ul,U.a(vl,a))))):null}var zl=function zl(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return zl.a(arguments[0],arguments[1]);case 3:return zl.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
zl.a=function(a,b){return new V(null,2,5,W,[hh,new q(null,2,[yi,"stroke",Ii,xl(new V(null,2,5,W,[a,al(a,b)],null))],null)],null)};zl.c=function(a,b,c){if(x(Yk(a,b,c)))a=new V(null,2,5,W,[hh,new q(null,2,[yi,"stroke",Ii,xl(new V(null,2,5,W,[al(a,b),al(a,c)],null))],null)],null);else{var d=W;b=al(a,b);c=al(a,c);var e=Le(dl,bl(b,c)),e=S(e,0);a=new V(null,2,5,d,[hh,new q(null,2,[yi,"area",Ii,yl(new V(null,4,5,W,[a,b,e,c],null))],null)],null)}return a};zl.B=3;
function Al(a){return new V(null,4,5,W,[li,new q(null,1,[yi,"stroked"],null),a,a],null)}
function Bl(a,b,c){var d=null!=a&&(a.g&64||a.A)?D.a(N,a):a,e=H.a(d,ai),f=null!=b&&(b.g&64||b.A)?D.a(N,b):b,g=H.a(f,Xh),k=H.a(f,xi),l=H.a(f,uh),m=H.a(f,Vi),n=Hk(function(a,b,d,e,f,g,k,l){return function(){var a=new V(null,2,5,W,[hj,l],null);return c.b?c.b(a):c.call(null,a)}}(a,d,d,e,b,f,g,k,l,m));return new V(null,9,5,W,[li,new q(null,1,[yi,[B(kc.a(Ki,g)?null:"shape"),B(" "),B(Md(g)),B(" "),B(x(l)?Md(l):null)].join("")],null),function(){return function(a,b,c,d,e,f,g,k,l,m,n){return function ea(O){return new Xd(null,
function(){return function(){for(;;){var a=w(O);if(a){if(pd(a)){var b=Ub(a),c=R(b),d=ae(c);a:for(var e=0;;)if(e<c){var f=G.a(b,e),g=null!=f&&(f.g&64||f.A)?D.a(N,f):f,f=H.a(g,Z),k=H.a(g,Y),g=H.a(g,wi);d.add(Al(new V(null,3,5,W,[kj,new q(null,4,[yi,"label",Z,f,Y,k,Qh,-10],null),g],null)));e+=1}else{b=!0;break a}return b?be(d.L(),ea(Vb(a))):be(d.L(),null)}d=J(a);c=null!=d&&(d.g&64||d.A)?D.a(N,d):d;d=H.a(c,Z);b=H.a(c,Y);c=H.a(c,wi);return Q(Al(new V(null,3,5,W,[kj,new q(null,4,[yi,"label",Z,d,Y,b,Qh,
-10],null),c],null)),ea(wc(a)))}return null}}}(a,b,c,d,e,f,g,k,l,m,n),null,null)}}(n,a,d,d,e,b,f,g,k,l,m)(e)}(),function(){return function(a,b,c,d,e,f,g,k,l,m,n){return function ea(O){return new Xd(null,function(a){return function(){for(;;){var b=w(O);if(b){if(pd(b)){var c=Ub(b),d=R(c),e=ae(d);a:for(var f=0;;)if(f<d){var g=G.a(c,f),g=new V(null,2,5,W,[hh,new q(null,3,[yi,"area",Ii,xl(g),Bi,a],null)],null);e.add(g);f+=1}else{c=!0;break a}return c?be(e.L(),ea(Vb(b))):be(e.L(),null)}e=J(b);return Q(new V(null,
2,5,W,[hh,new q(null,3,[yi,"area",Ii,xl(e),Bi,a],null)],null),ea(wc(b)))}return null}}}(a,b,c,d,e,f,g,k,l,m,n),null,null)}}(n,a,d,d,e,b,f,g,k,l,m)(d.b?d.b(ej):d.call(null,ej))}(),function(){return function(a,b,c,d,e,f,g,k,l,m,n){return function ea(O){return new Xd(null,function(a){return function(){for(;;){var b=w(O);if(b){if(pd(b)){var c=Ub(b),d=R(c),e=ae(d);a:for(var f=0;;)if(f<d){var g=G.a(c,f),g=Se(D.a(zl,Oe(g)),new V(null,2,5,W,[1,Bi],null),a);e.add(g);f+=1}else{c=!0;break a}return c?be(e.L(),
ea(Vb(b))):be(e.L(),null)}e=J(b);return Q(Se(D.a(zl,Oe(e)),new V(null,2,5,W,[1,Bi],null),a),ea(wc(b)))}return null}}}(a,b,c,d,e,f,g,k,l,m,n),null,null)}}(n,a,d,d,e,b,f,g,k,l,m)(d.b?d.b(Hi):d.call(null,Hi))}(),function(){return function(a,b,c,d,e,f,g,k,l,m,n){return function ea(O){return new Xd(null,function(a){return function(){for(;;){var b=w(O);if(b){if(pd(b)){var c=Ub(b),d=R(c),e=ae(d);a:for(var f=0;;)if(f<d){var g=G.a(c,f),g=new V(null,2,5,W,[hh,new q(null,3,[yi,"stroke",Ii,xl(g),Bi,a],null)],
null);e.add(g);f+=1}else{c=!0;break a}return c?be(e.L(),ea(Vb(b))):be(e.L(),null)}e=J(b);return Q(new V(null,2,5,W,[hh,new q(null,3,[yi,"stroke",Ii,xl(e),Bi,a],null)],null),ea(wc(b)))}return null}}}(a,b,c,d,e,f,g,k,l,m,n),null,null)}}(n,a,d,d,e,b,f,g,k,l,m)(d.b?d.b(Li):d.call(null,Li))}(),function(){return function(a,b,c,d,e,f,g,k,l,m,n){return function ea(O){return new Xd(null,function(a){return function(){for(;;){var b=w(O);if(b){if(pd(b)){var c=Ub(b),d=R(c),e=ae(d);a:for(var f=0;;)if(f<d){var g=
G.a(c,f),g=new V(null,2,5,W,[hh,new q(null,3,[yi,"stroke",Ii,yl(g),Bi,a],null)],null);e.add(g);f+=1}else{c=!0;break a}return c?be(e.L(),ea(Vb(b))):be(e.L(),null)}e=J(b);return Q(new V(null,2,5,W,[hh,new q(null,3,[yi,"stroke",Ii,yl(e),Bi,a],null)],null),ea(wc(b)))}return null}}}(a,b,c,d,e,f,g,k,l,m,n),null,null)}}(n,a,d,d,e,b,f,g,k,l,m)(d.b?d.b($h):d.call(null,$h))}(),function(){return function(a,b,d,e,f,g,k,l,m,n,wa){return function ea(O){return new Xd(null,function(a,b,d,e,f,g,k,l,m,n,r){return function(){for(;;){var t=
w(O);if(t){var u=t;if(pd(u)){var v=Ub(u),z=R(v),C=ae(z);return function(){for(var F=0;;)if(F<z){var I=G.a(v,F),K=null!=I&&(I.g&64||I.A)?D.a(N,I):I,O=H.a(K,Z),X=H.a(K,Y);ce(C,new V(null,2,5,W,[Mh,new q(null,6,[yi,"area",nh,5,vi,O,zi,X,Bi,Hk(function(a,b,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,ma){return function(){var a=new V(null,2,5,W,[Uh,ma],null);return c.b?c.b(a):c.call(null,a)}}(F,I,K,O,X,v,z,C,u,t,a,b,d,e,f,g,k,l,m,n,r)),ih,function(){return function(){return c.b?c.b(Rh):c.call(null,Rh)}}(F,I,K,O,X,
v,z,C,u,t,a,b,d,e,f,g,k,l,m,n,r)],null)],null));F+=1}else return!0}()?be(C.L(),ea(Vb(u))):be(C.L(),null)}var F=J(u),I=null!=F&&(F.g&64||F.A)?D.a(N,F):F,K=H.a(I,Z),X=H.a(I,Y);return Q(new V(null,2,5,W,[Mh,new q(null,6,[yi,"area",nh,5,vi,K,zi,X,Bi,Hk(function(a,b,d,e,f,g,k,l,m,n,r,t,u,v,z){return function(){var a=new V(null,2,5,W,[Uh,z],null);return c.b?c.b(a):c.call(null,a)}}(F,I,K,X,u,t,a,b,d,e,f,g,k,l,m,n,r)),ih,function(){return function(){return c.b?c.b(Rh):c.call(null,Rh)}}(F,I,K,X,u,t,a,b,d,
e,f,g,k,l,m,n,r)],null)],null),ea(wc(u)))}return null}}}(a,b,d,e,f,g,k,l,m,n,wa),null,null)}}(n,a,d,d,e,b,f,g,k,l,m)(e)}(),x(m)?function(){return function(a,b,c,d,e,f,g,k,l,m,n){return function ea(O){return new Xd(null,function(){return function(){for(;;){var a=w(O);if(a){if(pd(a)){var b=Ub(a),c=R(b),d=ae(c);a:for(var e=0;;)if(e<c){var f=G.a(b,e),g=null!=f&&(f.g&64||f.A)?D.a(N,f):f,f=H.a(g,Z),k=H.a(g,Y),g=H.a(g,fh),f=Za(L,Al(new V(null,3,5,W,[kj,new q(null,4,[yi,"role",Z,f,Y,k,Qh,21],null),g],null)));
d.add(f);e+=1}else{b=!0;break a}return b?be(d.L(),ea(Vb(a))):be(d.L(),null)}d=J(a);c=null!=d&&(d.g&64||d.A)?D.a(N,d):d;d=H.a(c,Z);b=H.a(c,Y);c=H.a(c,fh);return Q(Za(L,Al(new V(null,3,5,W,[kj,new q(null,4,[yi,"role",Z,d,Y,b,Qh,21],null),c],null))),ea(wc(a)))}return null}}}(a,b,c,d,e,f,g,k,l,m,n),null,null)}}(n,a,d,d,e,b,f,g,k,l,m)(d.b?d.b(ni):d.call(null,ni))}():null],null)}
function Cl(a){return function c(a){return new Xd(null,function(){for(;;){var e=w(a);if(e){if(pd(e)){var f=Ub(e),g=R(f),k=ae(g);a:for(var l=0;;)if(l<g){var m=G.a(f,l),m=new V(null,2,5,W,[hh,new q(null,2,[yi,"guide",Ii,xl(m)],null)],null);k.add(m);l+=1}else{f=!0;break a}return f?be(k.L(),c(Vb(e))):be(k.L(),null)}k=J(e);return Q(new V(null,2,5,W,[hh,new q(null,2,[yi,"guide",Ii,xl(k)],null)],null),c(wc(e)))}return null}},null,null)}(a.b?a.b(oi):a.call(null,oi))}
function Dl(a,b){var c=null!=b&&(b.g&64||b.A)?D.a(N,b):b,d=H.a(c,Xh),e=H.a(c,uh);return new V(null,3,5,W,[li,new q(null,1,[yi,[B("highlight "),B(Md(d))].join("")],null),function(){return function(a,b,c,d){return function n(e){return new Xd(null,function(){return function(){for(;;){var a=w(e);if(a){if(pd(a)){var b=Ub(a),c=R(b),d=ae(c);a:for(var f=0;;)if(f<c){var g=G.a(b,f),g=null!=g&&(g.g&64||g.A)?D.a(N,g):g,k=H.a(g,Z),l=H.a(g,Y);H.a(g,fh);d.add(new V(null,2,5,W,[Mh,new q(null,4,[yi,"point",nh,7,vi,
k,zi,l],null)],null));f+=1}else{b=!0;break a}return b?be(d.L(),n(Vb(a))):be(d.L(),null)}d=J(a);d=null!=d&&(d.g&64||d.A)?D.a(N,d):d;b=H.a(d,Z);c=H.a(d,Y);H.a(d,fh);return Q(new V(null,2,5,W,[Mh,new q(null,4,[yi,"point",nh,7,vi,b,zi,c],null)],null),n(wc(a)))}return null}}}(a,b,c,d),null,null)}}(b,c,d,e)(a.b?a.b(ni):a.call(null,ni))}()],null)}
function El(a){var b=Nk,c=null!=a&&(a.g&64||a.A)?D.a(N,a):a,d=H.a(c,lg),e=H.a(c,Ah),f=H.a(c,rh),g=H.a(c,Lh),k=H.a(c,Yi),l=H.a(c,qh),m=ve(xk,b);return new V(null,4,5,W,[Ri,new q(null,1,[gi,x(l)?"labeled":null],null),new V(null,3,5,W,[Kh,new q(null,1,[gi,"sidebar"],null),new V(null,8,5,W,[ji,new q(null,1,[gi,"inside"],null),new V(null,3,5,W,[Pi,pe,"Taxicabland"],null),new V(null,3,5,W,[gj,new q(null,2,[xi,"explain",cj,"https://en.wikipedia.org/wiki/Taxicab_geometry"],null),"What is taxicab geometry?"],
null),new V(null,3,5,W,[ji,new q(null,1,[xi,"tip"],null),"Drag points with the Point tool."],null),ql(g,m),rl(c,m),new V(null,3,5,W,[gj,new q(null,2,[xi,"source",cj,"https://github.com/exupero/taxicabland"],null),"GitHub"],null)],null)],null),new V(null,3,5,W,[Kh,new q(null,1,[gi,"main"],null),new V(null,3,5,W,[ji,new q(null,1,[gi,"maximize"],null),new V(null,4,5,W,[Ei,new q(null,4,[xi,"workspace",Oi,function(a,b,c,d,e,f){return function(b){return x(f)?(b=new V(null,2,5,W,[Sh,ll(b.clientX,b.clientY)],
null),a.b?a.b(b):a.call(null,b)):null}}(m,a,c,c,d,e,f,g,k,l),ih,function(a){return function(){return a.b?a.b(Rh):a.call(null,Rh)}}(m,a,c,c,d,e,f,g,k,l),Bi,function(a){return function(b){var c=W;b=ll(b.clientX,b.clientY);b=ol.b?ol.b(b):ol.call(null,b);c=new V(null,2,5,c,[vh,b],null);return a.b?a.b(c):a.call(null,c)}}(m,a,c,c,d,e,f,g,k,l)],null),sl(k),function(){var b=function(a){return function(b){return x(b.b?b.b(xi):b.call(null,xi))?Bl(eh.b?eh.b(b):eh.call(null,b),b,a):null}}(m,a,c,c,d,e,f,g,k,l),
r=U.a(ve(tl,d),Gf(d));return Za(Za(Za(L,U.a(b,Le(pl,r))),function(){var a=J(Le(Vi,r));if(x(a)&&x(a.b?a.b(Xh):a.call(null,Xh))){var b=eh.b?eh.b(a):eh.call(null,a);return Za(Za(Za(L,Dl(b,a)),Bl(b,a,m)),Cl(b))}return null}()),U.a(b,Me(Vi,Me(pl,r))))}()],null)],null)],null)],null)};Ia();
function Fl(a,b){var c=null!=a&&(a.g&64||a.A)?D.a(N,a):a,d=H.a(c,Yh),e=S(d,0),d=null!=b&&(b.g&64||b.A)?D.a(N,b):b,f=H.a(d,xi);if(null==d)return c;var g=null==Re(c,new V(null,2,5,W,[lg,f],null));g&&(g=null!=d&&(d.g&64||d.A)?D.a(N,d):d,g=H.a(g,Xh),g=!vd(new pg(null,new q(null,5,[xh,null,Ch,null,Ph,null,qi,null,Ki,null],null),null),g));return x(g)?Se(Ue(c,Yh),new V(null,2,5,W,[lg,f],null),T.c(d,uh,e)):x(Re(c,new V(null,2,5,W,[lg,f],null)))?(e=Re(c,new V(null,3,5,W,[lg,f,uh],null)),Se(c,new V(null,2,
5,W,[lg,f],null),T.c(d,uh,e))):Se(c,new V(null,2,5,W,[lg,f],null),d)}function Gl(a,b){var c=null!=a&&(a.g&64||a.A)?D.a(N,a):a,d=H.a(c,Lh),d=null!=d&&(d.g&64||d.A)?D.a(N,d):d,d=H.a(d,Wi),e=d.b?d.b(b):d.call(null,b),d=S(e,0),e=S(e,1);return Fl(Se(c,new V(null,2,5,W,[Lh,Wi],null),d),e)}function Hl(a,b,c){return T.l(a,Z,b,uc([Y,c],0))}function Il(){var a=ml(),b=Ng(new q(null,1,[yh,3],null));saveSvgAsPng(a,"taxicab.png",b)}
function Jl(a,b,c){var d=b.b?b.b(a):b.call(null,a),e=kg(a);return Ve(T.c(ig.l(uc([a,null==d?null:qb(d)],0)),b,null==d?null:rb(d)),c,Zc,e)}function Kl(a){return 2>a?Bd:function(b){return Math.round(b/a)*a}}function Ll(a){a=null!=a&&(a.g&64||a.A)?D.a(N,a):a;var b=H.a(a,rh);return x(b)?T.c(Te.v(a,new V(null,2,5,W,[lg,b],null),ed,Vi),rh,null):a}function Ml(a,b,c){return kc.a(b,c)?a:Se(T.c(Ll(a),rh,b),new V(null,3,5,W,[lg,b,Vi],null),!0)}
function Nl(a,b,c){var d=Ig("point"),e=Kl(Yi.b(a));return Gl(Ue(T.c(Fl(Ll(Ve(a,Vh,Zc,kg(a))),new q(null,5,[xi,d,Xh,Ki,wi,J(a.b?a.b(kh):a.call(null,kh)),Z,e.b?e.b(b):e.call(null,b),Y,e.b?e.b(c):e.call(null,c)],null)),Ah,d),kh),d)}
function Lk(a,b){try{if(Vd(b,ii))return a;throw Gk;}catch(c){if(c instanceof Error)if(c===Gk)try{if(Vd(b,ij))return T.c(Ve(a,Vh,Zc,kg(a)),lg,pe);throw Gk;}catch(d){if(d instanceof Error)if(d===Gk)try{if(Vd(b,Ti))return Il(),a;throw Gk;}catch(e){if(e instanceof Error)if(e===Gk)try{if(Vd(b,pi))return Jl(a,Vh,Th);throw Gk;}catch(f){if(f instanceof Error)if(f===Gk)try{if(Vd(b,Bh))return Jl(a,Th,Vh);throw Gk;}catch(g){if(g instanceof Error)if(g===Gk)try{if(md(b)&&2===R(b))try{var k=bd(b,0);if(Vd(k,bj)){var l=
bd(b,1);return T.c(a,qh,l)}throw Gk;}catch(m){if(m instanceof Error)if(l=m,l===Gk)try{k=bd(b,0);if(Vd(k,Fh)){var n=bd(b,1);return T.c(a,Yi,n)}throw Gk;}catch(r){if(r instanceof Error)if(n=r,n===Gk)try{k=bd(b,0);if(Vd(k,Lh)){var t=bd(b,1);return T.c(a,Lh,t)}throw Gk;}catch(u){if(u instanceof Error){var v=u;if(v===Gk)try{if(k=bd(b,0),Vd(k,vh))try{var z=bd(b,1);if(md(z)&&2===R(z)){var C=bd(z,0),F=bd(z,1);return Nl(a,C,F)}throw Gk;}catch(I){if(I instanceof Error){var K=I;if(K===Gk)throw Gk;throw K;}throw I;
}else throw Gk;}catch(X){if(X instanceof Error)if(K=X,K===Gk)try{k=bd(b,0);if(Vd(k,Uh)){var wa=bd(b,1);return Gl(T.c(Ve(a,Vh,Zc,kg(a)),Ah,wa),wa)}throw Gk;}catch(E){if(E instanceof Error)if(E===Gk)try{k=bd(b,0);if(Vd(k,Sh)){var ea=bd(b,1),O=Ah.b(a);if(x(O)){var ca=Kl(Yi.b(a));return Te.F(a,new V(null,2,5,W,[lg,O],null),Hl,function(){var a=ea.x;return ca.b?ca.b(a):ca.call(null,a)}(),function(){var a=ea.y;return ca.b?ca.b(a):ca.call(null,a)}())}return a}throw Gk;}catch(fa){if(fa instanceof Error&&fa===
Gk)throw Gk;throw fa;}else throw E;else throw E;}else throw K;else throw X;}else throw v;}else throw u;}else throw n;else throw r;}else throw l;else throw m;}else throw Gk;}catch(la){if(la instanceof Error)if(l=la,l===Gk)try{if(Vd(b,Rh))return T.c(a,Ah,null);throw Gk;}catch(ma){if(ma instanceof Error)if(n=ma,n===Gk)try{if(md(b)&&2===R(b))try{var ua=bd(b,0);if(Vd(ua,hj)){var wa=bd(b,1),za=a.b?a.b(rh):a.call(null,rh);return Ml(Ll(a),wa,za)}throw Gk;}catch(Aa){if(Aa instanceof Error){v=Aa;if(v===Gk)throw Gk;
throw v;}throw Aa;}else throw Gk;}catch(Ba){if(Ba instanceof Error){v=Ba;if(v===Gk)throw Error([B("No matching clause: "),B(b)].join(""));throw v;}throw Ba;}else throw n;else throw ma;}else throw l;else throw la;}else throw g;else throw g;}else throw f;else throw f;}else throw e;else throw e;}else throw d;else throw d;}else throw c;else throw c;}}
var Mk=dd([kh,qh,rh,Ah,Lh,Th,Vh,Yh,Yi,lg],[Ge("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),!0,null,null,J(tj),$c,$c,Ge(U.a(function(a){return Wd.b([B("color"),B(a)].join(""))},new ug(null,1,10,1,null))),15,pe]);if("undefined"===typeof Nk)var Nk=uk(null);if("undefined"===typeof Ol)var Ol=Kk();
(function(a,b){var c=uk(1);bk(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!Vd(e,Wh)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Mj(c),d=Wh;else throw f;}if(!Vd(d,Wh))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.u=c;d.b=b;return d}()}(function(){return function(c){var d=c[1];return 1===d?(c[2]=null,c[1]=2,Wh):2===d?Ij(c,4,a):3===d?(d=c[2],Kj(c,d)):4===d?(d=c[7],d=c[2],c[7]=d,c[1]=x(d)?5:6,Wh):5===d?(d=c[7],d=b.b?b.b(d):b.call(null,d),c[8]=d,c[2]=null,c[1]=2,Wh):6===d?(c[2]=null,c[1]=7,Wh):7===d?(d=c[2],c[2]=d,c[1]=3,Wh):null}}(c),c)}(),f=function(){var a=e.u?e.u():e.call(null);a[6]=c;return a}();return Hj(f)}}(c));return c})(function(a,b){var c=Ad(b),d=uk(null),e=R(c),f=de(e),g=uk(1),
k=ye.b?ye.b(null):ye.call(null,null),l=Qe(function(a,b,c,d,e,f){return function(g){return function(a,b,c,d,e,f){return function(a){d[g]=a;return 0===De.a(f,Hd)?xk.a(e,d.slice(0)):null}}(a,b,c,d,e,f)}}(c,d,e,f,g,k),new ug(null,0,e,1,null)),m=uk(1);bk(function(b,c,d,e,f,g,k,l){return function(){var m=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!Vd(e,Wh)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Mj(c),d=Wh;else throw f;}if(!Vd(d,
Wh))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.u=c;d.b=b;return d}()}(function(b,c,d,e,f,g,k,l){return function(b){var f=b[1];if(7===f)return b[2]=null,b[1]=8,Wh;if(1===f)return b[2]=null,b[1]=2,Wh;if(4===f){var m=b[7],f=m<e;b[1]=x(f)?6:7;return Wh}return 15===f?
(f=b[2],b[2]=f,b[1]=3,Wh):13===f?(f=Aj(d),b[2]=f,b[1]=15,Wh):6===f?(b[2]=null,b[1]=11,Wh):3===f?(f=b[2],Kj(b,f)):12===f?(f=b[8],f=b[2],m=se(La,f),b[8]=f,b[1]=x(m)?13:14,Wh):2===f?(f=Ce.a?Ce.a(k,e):Ce.call(null,k,e),b[7]=0,b[9]=f,b[2]=null,b[1]=4,Wh):11===f?(m=b[7],b[4]=new Lj(10,Object,null,9,b[4],null,null,null),f=c.b?c.b(m):c.call(null,m),m=l.b?l.b(m):l.call(null,m),f=vk(f,m),b[2]=f,Mj(b),Wh):9===f?(m=b[7],b[10]=b[2],b[7]=m+1,b[2]=null,b[1]=4,Wh):5===f?(b[11]=b[2],Ij(b,12,g)):14===f?(f=b[8],f=D.a(a,
f),Jj(b,d,f)):16===f?(b[12]=b[2],b[2]=null,b[1]=2,Wh):10===f?(m=b[2],f=De.a(k,Hd),b[13]=m,b[2]=f,Mj(b),Wh):8===f?(f=b[2],b[2]=f,b[1]=5,Wh):null}}(b,c,d,e,f,g,k,l),b,c,d,e,f,g,k,l)}(),K=function(){var a=m.u?m.u():m.call(null);a[6]=b;return a}();return Hj(K)}}(m,c,d,e,f,g,k,l));return d}(function(a){return El(a)},new V(null,1,5,W,[Ol],null)),function(a){var b=function(){var a=new VDOM.VText("");return ye.b?ye.b(a):ye.call(null,a)}(),c=function(){var a;a=P.b?P.b(b):P.call(null,b);a=Ak.b?Ak.b(a):Ak.call(null,
a);return ye.b?ye.b(a):ye.call(null,a)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.u?a.u():a.call(null)}}(b,c):function(){return function(a){return window.requestAnimationFrame(a)}}(b,c);a.appendChild(P.b?P.b(c):P.call(null,c));return function(a,b,c){return function(d){var l=Fk(d);d=function(){var b=P.b?P.b(a):P.call(null,a);return yk.a?yk.a(b,l):yk.call(null,b,l)}();Ce.a?Ce.a(a,l):Ce.call(null,a,l);d=function(a,b,c,d){return function(){return De.c(d,zk,b)}}(l,d,
a,b,c);return c.b?c.b(d):c.call(null,d)}}(b,c,d)}(document.body));
if("undefined"===typeof Pl)var Pl=function(){window.onresize=function(){return xk.a(Nk,ii)};var a=uk(1);bk(function(a){return function(){var c=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var f=a(c);if(!Vd(f,Wh)){d=f;break a}}}catch(g){if(g instanceof Object)c[5]=g,Mj(c),d=Wh;else throw g;}if(!Vd(d,Wh))return d}}function c(){var a=[null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.u=c;d.b=b;return d}()}(function(){return function(a){var b=a[1];if(1===b)return b=sk(),Ij(a,2,b);if(2===b){var b=a[2],c=xk.a(Nk,ii);a[7]=b;return Kj(a,c)}return null}}(a),a)}(),d=function(){var d=c.u?c.u():c.call(null);d[6]=a;return d}();return Hj(d)}}(a));return a}();