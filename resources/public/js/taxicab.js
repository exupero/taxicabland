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
b&&"undefined"==typeof a.call)return"object";return b}var ba="closure_uid_"+(1E9*Math.random()>>>0),ea=0;function fa(a,b,c){return a.call.apply(a.bind,arguments)}function ga(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function ia(a,b,c){ia=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?fa:ga;return ia.apply(null,arguments)};function ja(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function ka(a,b){null!=a&&this.append.apply(this,arguments)}h=ka.prototype;h.Za="";h.set=function(a){this.Za=""+a};h.append=function(a,b,c){this.Za+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.Za+=arguments[d];return this};h.clear=function(){this.Za=""};h.toString=function(){return this.Za};function na(a,b){a.sort(b||pa)}function qa(a,b){for(var c=0;c<a.length;c++)a[c]={index:c,value:a[c]};var d=b||pa;na(a,function(a,b){return d(a.value,b.value)||a.index-b.index});for(c=0;c<a.length;c++)a[c]=a[c].value}function pa(a,b){return a>b?1:a<b?-1:0};var ra={},sa;if("undefined"===typeof ta)var ta=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof ua)var ua=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var wa=null;if("undefined"===typeof xa)var xa=null;function ya(){return new q(null,5,[Ca,!0,Da,!0,Ea,!1,Fa,!1,Ga,null],null)}Ha;
function Ia(){ta=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Ja(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,Ha.b?Ha.b(a):Ha.call(null,a))}a.A=0;a.F=function(a){a=w(a);return b(a)};a.j=b;return a}();ua=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Ja(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,
Ha.b?Ha.b(a):Ha.call(null,a))}a.A=0;a.F=function(a){a=w(a);return b(a)};a.j=b;return a}()}function x(a){return null!=a&&!1!==a}Ka;y;function La(a){return null==a}function Ma(a){return a instanceof Array}function Na(a){return null==a?!0:!1===a?!0:!1}function Oa(a,b){return a[p(null==b?null:b)]?!0:a._?!0:!1}function A(a,b){var c=null==b?null:b.constructor,c=x(x(c)?c.Db:c)?c.cb:p(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}
function Qa(a){var b=a.cb;return x(b)?b:""+B(a)}var Ra="undefined"!==typeof Symbol&&"function"===p(Symbol)?Symbol.iterator:"@@iterator";function Sa(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}D;Ta;var Ha=function Ha(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ha.b(arguments[0]);case 2:return Ha.a(arguments[0],arguments[1]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
Ha.b=function(a){return Ha.a(null,a)};Ha.a=function(a,b){function c(a,b){a.push(b);return a}var d=[];return Ta.c?Ta.c(c,d,b):Ta.call(null,c,d,b)};Ha.A=2;function Va(){}
var Wa=function Wa(b){if(null!=b&&null!=b.Z)return b.Z(b);var c=Wa[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Wa._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("ICounted.-count",b);},Xa=function Xa(b){if(null!=b&&null!=b.aa)return b.aa(b);var c=Xa[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Xa._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IEmptyableCollection.-empty",b);};function Ya(){}
var Za=function Za(b,c){if(null!=b&&null!=b.Y)return b.Y(b,c);var d=Za[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Za._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("ICollection.-conj",b);};function $a(){}
var G=function G(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return G.a(arguments[0],arguments[1]);case 3:return G.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
G.a=function(a,b){if(null!=a&&null!=a.$)return a.$(a,b);var c=G[p(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=G._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw A("IIndexed.-nth",a);};G.c=function(a,b,c){if(null!=a&&null!=a.Aa)return a.Aa(a,b,c);var d=G[p(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=G._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw A("IIndexed.-nth",a);};G.A=3;function ab(){}
var bb=function bb(b){if(null!=b&&null!=b.ea)return b.ea(b);var c=bb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=bb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("ISeq.-first",b);},cb=function cb(b){if(null!=b&&null!=b.ua)return b.ua(b);var c=cb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=cb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("ISeq.-rest",b);};function db(){}function eb(){}
var gb=function gb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return gb.a(arguments[0],arguments[1]);case 3:return gb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
gb.a=function(a,b){if(null!=a&&null!=a.O)return a.O(a,b);var c=gb[p(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=gb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw A("ILookup.-lookup",a);};gb.c=function(a,b,c){if(null!=a&&null!=a.L)return a.L(a,b,c);var d=gb[p(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=gb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw A("ILookup.-lookup",a);};gb.A=3;
var hb=function hb(b,c){if(null!=b&&null!=b.Ub)return b.Ub(b,c);var d=hb[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=hb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("IAssociative.-contains-key?",b);},ib=function ib(b,c,d){if(null!=b&&null!=b.Wa)return b.Wa(b,c,d);var e=ib[p(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=ib._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw A("IAssociative.-assoc",b);};function jb(){}
var kb=function kb(b,c){if(null!=b&&null!=b.Lb)return b.Lb(b,c);var d=kb[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=kb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("IMap.-dissoc",b);};function mb(){}
var nb=function nb(b){if(null!=b&&null!=b.wb)return b.wb(b);var c=nb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=nb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IMapEntry.-key",b);},ob=function ob(b){if(null!=b&&null!=b.xb)return b.xb(b);var c=ob[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ob._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IMapEntry.-val",b);};function pb(){}
var qb=function qb(b){if(null!=b&&null!=b.$a)return b.$a(b);var c=qb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=qb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IStack.-peek",b);},rb=function rb(b){if(null!=b&&null!=b.ab)return b.ab(b);var c=rb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=rb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IStack.-pop",b);};function sb(){}
var tb=function tb(b,c,d){if(null!=b&&null!=b.bb)return b.bb(b,c,d);var e=tb[p(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=tb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw A("IVector.-assoc-n",b);},ub=function ub(b){if(null!=b&&null!=b.ub)return b.ub(b);var c=ub[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ub._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IDeref.-deref",b);};function wb(){}
var xb=function xb(b){if(null!=b&&null!=b.R)return b.R(b);var c=xb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=xb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IMeta.-meta",b);},yb=function yb(b,c){if(null!=b&&null!=b.S)return b.S(b,c);var d=yb[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=yb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("IWithMeta.-with-meta",b);};function zb(){}
var Ab=function Ab(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ab.a(arguments[0],arguments[1]);case 3:return Ab.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
Ab.a=function(a,b){if(null!=a&&null!=a.ca)return a.ca(a,b);var c=Ab[p(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=Ab._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw A("IReduce.-reduce",a);};Ab.c=function(a,b,c){if(null!=a&&null!=a.da)return a.da(a,b,c);var d=Ab[p(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Ab._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw A("IReduce.-reduce",a);};Ab.A=3;
var Bb=function Bb(b,c){if(null!=b&&null!=b.B)return b.B(b,c);var d=Bb[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Bb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("IEquiv.-equiv",b);},Cb=function Cb(b){if(null!=b&&null!=b.P)return b.P(b);var c=Cb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Cb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IHash.-hash",b);};function Db(){}
var Eb=function Eb(b){if(null!=b&&null!=b.U)return b.U(b);var c=Eb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Eb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("ISeqable.-seq",b);};function Fb(){}function Gb(){}function Hb(){}
var Ib=function Ib(b,c){if(null!=b&&null!=b.jc)return b.jc(0,c);var d=Ib[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Ib._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("IWriter.-write",b);},Jb=function Jb(b,c,d){if(null!=b&&null!=b.N)return b.N(b,c,d);var e=Jb[p(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Jb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw A("IPrintWithWriter.-pr-writer",b);},Kb=function Kb(b,c,d){if(null!=b&&
null!=b.ic)return b.ic(0,c,d);var e=Kb[p(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Kb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw A("IWatchable.-notify-watches",b);},Lb=function Lb(b){if(null!=b&&null!=b.lb)return b.lb(b);var c=Lb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Lb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IEditableCollection.-as-transient",b);},Mb=function Mb(b,c){if(null!=b&&null!=b.Bb)return b.Bb(b,c);var d=
Mb[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Mb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("ITransientCollection.-conj!",b);},Ob=function Ob(b){if(null!=b&&null!=b.Cb)return b.Cb(b);var c=Ob[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Ob._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("ITransientCollection.-persistent!",b);},Pb=function Pb(b,c,d){if(null!=b&&null!=b.Ab)return b.Ab(b,c,d);var e=Pb[p(null==b?null:b)];if(null!=e)return e.c?
e.c(b,c,d):e.call(null,b,c,d);e=Pb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw A("ITransientAssociative.-assoc!",b);},Qb=function Qb(b,c,d){if(null!=b&&null!=b.hc)return b.hc(0,c,d);var e=Qb[p(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Qb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw A("ITransientVector.-assoc-n!",b);};function Rb(){}
var Sb=function Sb(b,c){if(null!=b&&null!=b.kb)return b.kb(b,c);var d=Sb[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Sb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("IComparable.-compare",b);},Tb=function Tb(b){if(null!=b&&null!=b.ec)return b.ec();var c=Tb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Tb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IChunk.-drop-first",b);},Ub=function Ub(b){if(null!=b&&null!=b.Wb)return b.Wb(b);var c=
Ub[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Ub._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IChunkedSeq.-chunked-first",b);},Vb=function Vb(b){if(null!=b&&null!=b.Xb)return b.Xb(b);var c=Vb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Vb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IChunkedSeq.-chunked-rest",b);},Wb=function Wb(b){if(null!=b&&null!=b.Vb)return b.Vb(b);var c=Wb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,
b);c=Wb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IChunkedNext.-chunked-next",b);},Xb=function Xb(b){if(null!=b&&null!=b.yb)return b.yb(b);var c=Xb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Xb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("INamed.-name",b);},Yb=function Yb(b){if(null!=b&&null!=b.zb)return b.zb(b);var c=Yb[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Yb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("INamed.-namespace",
b);},Zb=function Zb(b,c){if(null!=b&&null!=b.Ac)return b.Ac(b,c);var d=Zb[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Zb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("IReset.-reset!",b);},$b=function $b(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return $b.a(arguments[0],arguments[1]);case 3:return $b.c(arguments[0],arguments[1],arguments[2]);case 4:return $b.u(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return $b.D(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};$b.a=function(a,b){if(null!=a&&null!=a.Cc)return a.Cc(a,b);var c=$b[p(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=$b._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw A("ISwap.-swap!",a);};
$b.c=function(a,b,c){if(null!=a&&null!=a.Dc)return a.Dc(a,b,c);var d=$b[p(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=$b._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw A("ISwap.-swap!",a);};$b.u=function(a,b,c,d){if(null!=a&&null!=a.Ec)return a.Ec(a,b,c,d);var e=$b[p(null==a?null:a)];if(null!=e)return e.u?e.u(a,b,c,d):e.call(null,a,b,c,d);e=$b._;if(null!=e)return e.u?e.u(a,b,c,d):e.call(null,a,b,c,d);throw A("ISwap.-swap!",a);};
$b.D=function(a,b,c,d,e){if(null!=a&&null!=a.Fc)return a.Fc(a,b,c,d,e);var f=$b[p(null==a?null:a)];if(null!=f)return f.D?f.D(a,b,c,d,e):f.call(null,a,b,c,d,e);f=$b._;if(null!=f)return f.D?f.D(a,b,c,d,e):f.call(null,a,b,c,d,e);throw A("ISwap.-swap!",a);};$b.A=5;var ac=function ac(b){if(null!=b&&null!=b.Ha)return b.Ha(b);var c=ac[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ac._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IIterable.-iterator",b);};
function bc(a){this.Qc=a;this.g=1073741824;this.C=0}bc.prototype.jc=function(a,b){return this.Qc.append(b)};function cc(a){var b=new ka;a.N(null,new bc(b),ya());return""+B(b)}var dc="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function ec(a){a=dc(a|0,-862048943);return dc(a<<15|a>>>-15,461845907)}
function fc(a,b){var c=(a|0)^(b|0);return dc(c<<13|c>>>-13,5)+-430675100|0}function gc(a,b){var c=(a|0)^b,c=dc(c^c>>>16,-2048144789),c=dc(c^c>>>13,-1028477387);return c^c>>>16}function hc(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=fc(c,ec(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^ec(a.charCodeAt(a.length-1)):b;return gc(b,dc(2,a.length))}ic;jc;kc;lc;var mc={},oc=0;
function pc(a){255<oc&&(mc={},oc=0);var b=mc[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=dc(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}else b=0;else b=0;mc[a]=b;oc+=1}return a=b}function qc(a){null!=a&&(a.g&4194304||a.Uc)?a=a.P(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=pc(a),0!==a&&(a=ec(a),a=fc(0,a),a=gc(a,4))):a=a instanceof Date?a.valueOf():null==a?0:Cb(a);return a}
function rc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function Ka(a,b){return b instanceof a}function sc(a,b){if(a.Sa===b.Sa)return 0;var c=Na(a.wa);if(x(c?b.wa:c))return-1;if(x(a.wa)){if(Na(b.wa))return 1;c=pa(a.wa,b.wa);return 0===c?pa(a.name,b.name):c}return pa(a.name,b.name)}H;function jc(a,b,c,d,e){this.wa=a;this.name=b;this.Sa=c;this.jb=d;this.za=e;this.g=2154168321;this.C=4096}h=jc.prototype;h.toString=function(){return this.Sa};h.equiv=function(a){return this.B(null,a)};
h.B=function(a,b){return b instanceof jc?this.Sa===b.Sa:!1};h.call=function(){function a(a,b,c){return H.c?H.c(b,this,c):H.call(null,b,this,c)}function b(a,b){return H.a?H.a(b,this):H.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};
h.b=function(a){return H.a?H.a(a,this):H.call(null,a,this)};h.a=function(a,b){return H.c?H.c(a,this,b):H.call(null,a,this,b)};h.R=function(){return this.za};h.S=function(a,b){return new jc(this.wa,this.name,this.Sa,this.jb,b)};h.P=function(){var a=this.jb;return null!=a?a:this.jb=a=rc(hc(this.name),pc(this.wa))};h.yb=function(){return this.name};h.zb=function(){return this.wa};h.N=function(a,b){return Ib(b,this.Sa)};
var tc=function tc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return tc.b(arguments[0]);case 2:return tc.a(arguments[0],arguments[1]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};tc.b=function(a){if(a instanceof jc)return a;var b=a.indexOf("/");return-1===b?tc.a(null,a):tc.a(a.substring(0,b),a.substring(b+1,a.length))};tc.a=function(a,b){var c=null!=a?[B(a),B("/"),B(b)].join(""):b;return new jc(a,b,c,null,null)};
tc.A=2;uc;vc;Ja;function w(a){if(null==a)return null;if(null!=a&&(a.g&8388608||a.Bc))return a.U(null);if(Ma(a)||"string"===typeof a)return 0===a.length?null:new Ja(a,0);if(Oa(Db,a))return Eb(a);throw Error([B(a),B(" is not ISeqable")].join(""));}function J(a){if(null==a)return null;if(null!=a&&(a.g&64||a.w))return a.ea(null);a=w(a);return null==a?null:bb(a)}function wc(a){return null!=a?null!=a&&(a.g&64||a.w)?a.ua(null):(a=w(a))?cb(a):L:L}
function M(a){return null==a?null:null!=a&&(a.g&128||a.Mb)?a.ta(null):w(wc(a))}var kc=function kc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return kc.b(arguments[0]);case 2:return kc.a(arguments[0],arguments[1]);default:return kc.j(arguments[0],arguments[1],new Ja(c.slice(2),0))}};kc.b=function(){return!0};kc.a=function(a,b){return null==a?null==b:a===b||Bb(a,b)};
kc.j=function(a,b,c){for(;;)if(kc.a(a,b))if(M(c))a=b,b=J(c),c=M(c);else return kc.a(b,J(c));else return!1};kc.F=function(a){var b=J(a),c=M(a);a=J(c);c=M(c);return kc.j(b,a,c)};kc.A=2;function xc(a){this.H=a}xc.prototype.next=function(){if(null!=this.H){var a=J(this.H);this.H=M(this.H);return{value:a,done:!1}}return{value:null,done:!0}};function yc(a){return new xc(w(a))}zc;function Ac(a,b,c){this.value=a;this.ob=b;this.Sb=c;this.g=8388672;this.C=0}Ac.prototype.U=function(){return this};
Ac.prototype.ea=function(){return this.value};Ac.prototype.ua=function(){null==this.Sb&&(this.Sb=zc.b?zc.b(this.ob):zc.call(null,this.ob));return this.Sb};function zc(a){var b=a.next();return x(b.done)?L:new Ac(b.value,a,null)}function Bc(a,b){var c=ec(a),c=fc(0,c);return gc(c,b)}function Cc(a){var b=0,c=1;for(a=w(a);;)if(null!=a)b+=1,c=dc(31,c)+qc(J(a))|0,a=M(a);else return Bc(c,b)}var Ec=Bc(1,0);function Fc(a){var b=0,c=0;for(a=w(a);;)if(null!=a)b+=1,c=c+qc(J(a))|0,a=M(a);else return Bc(c,b)}
var Gc=Bc(0,0);N;ic;Hc;Va["null"]=!0;Wa["null"]=function(){return 0};Date.prototype.B=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.tb=!0;Date.prototype.kb=function(a,b){if(b instanceof Date)return pa(this.valueOf(),b.valueOf());throw Error([B("Cannot compare "),B(this),B(" to "),B(b)].join(""));};Bb.number=function(a,b){return a===b};Ic;wb["function"]=!0;xb["function"]=function(){return null};Cb._=function(a){return a[ba]||(a[ba]=++ea)};
function Jc(a){return a+1}P;function Kc(a){this.G=a;this.g=32768;this.C=0}Kc.prototype.ub=function(){return this.G};function Lc(a){return a instanceof Kc}function P(a){return ub(a)}function Mc(a,b){var c=Wa(a);if(0===c)return b.s?b.s():b.call(null);for(var d=G.a(a,0),e=1;;)if(e<c){var f=G.a(a,e),d=b.a?b.a(d,f):b.call(null,d,f);if(Lc(d))return ub(d);e+=1}else return d}
function Oc(a,b,c){var d=Wa(a),e=c;for(c=0;;)if(c<d){var f=G.a(a,c),e=b.a?b.a(e,f):b.call(null,e,f);if(Lc(e))return ub(e);c+=1}else return e}function Pc(a,b){var c=a.length;if(0===a.length)return b.s?b.s():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.a?b.a(d,f):b.call(null,d,f);if(Lc(d))return ub(d);e+=1}else return d}function Qc(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.a?b.a(e,f):b.call(null,e,f);if(Lc(e))return ub(e);c+=1}else return e}
function Rc(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.a?b.a(c,f):b.call(null,c,f);if(Lc(c))return ub(c);d+=1}else return c}Sc;Q;Tc;Uc;function Vc(a){return null!=a?a.g&2||a.sc?!0:a.g?!1:Oa(Va,a):Oa(Va,a)}function Wc(a){return null!=a?a.g&16||a.fc?!0:a.g?!1:Oa($a,a):Oa($a,a)}function Xc(a,b){this.f=a;this.m=b}Xc.prototype.va=function(){return this.m<this.f.length};Xc.prototype.next=function(){var a=this.f[this.m];this.m+=1;return a};
function Ja(a,b){this.f=a;this.m=b;this.g=166199550;this.C=8192}h=Ja.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.B(null,a)};h.$=function(a,b){var c=b+this.m;return c<this.f.length?this.f[c]:null};h.Aa=function(a,b,c){a=b+this.m;return a<this.f.length?this.f[a]:c};h.Ha=function(){return new Xc(this.f,this.m)};h.ta=function(){return this.m+1<this.f.length?new Ja(this.f,this.m+1):null};h.Z=function(){var a=this.f.length-this.m;return 0>a?0:a};h.P=function(){return Cc(this)};
h.B=function(a,b){return Hc.a?Hc.a(this,b):Hc.call(null,this,b)};h.aa=function(){return L};h.ca=function(a,b){return Rc(this.f,b,this.f[this.m],this.m+1)};h.da=function(a,b,c){return Rc(this.f,b,c,this.m)};h.ea=function(){return this.f[this.m]};h.ua=function(){return this.m+1<this.f.length?new Ja(this.f,this.m+1):L};h.U=function(){return this.m<this.f.length?this:null};h.Y=function(a,b){return Q.a?Q.a(b,this):Q.call(null,b,this)};Ja.prototype[Ra]=function(){return yc(this)};
var vc=function vc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return vc.b(arguments[0]);case 2:return vc.a(arguments[0],arguments[1]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};vc.b=function(a){return vc.a(a,0)};vc.a=function(a,b){return b<a.length?new Ja(a,b):null};vc.A=2;
var uc=function uc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return uc.b(arguments[0]);case 2:return uc.a(arguments[0],arguments[1]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};uc.b=function(a){return vc.a(a,0)};uc.a=function(a,b){return vc.a(a,b)};uc.A=2;Ic;Yc;function Tc(a,b,c){this.Kb=a;this.m=b;this.o=c;this.g=32374990;this.C=8192}h=Tc.prototype;h.toString=function(){return cc(this)};
h.equiv=function(a){return this.B(null,a)};h.R=function(){return this.o};h.ta=function(){return 0<this.m?new Tc(this.Kb,this.m-1,null):null};h.Z=function(){return this.m+1};h.P=function(){return Cc(this)};h.B=function(a,b){return Hc.a?Hc.a(this,b):Hc.call(null,this,b)};h.aa=function(){var a=L,b=this.o;return Ic.a?Ic.a(a,b):Ic.call(null,a,b)};h.ca=function(a,b){return Yc.a?Yc.a(b,this):Yc.call(null,b,this)};h.da=function(a,b,c){return Yc.c?Yc.c(b,c,this):Yc.call(null,b,c,this)};
h.ea=function(){return G.a(this.Kb,this.m)};h.ua=function(){return 0<this.m?new Tc(this.Kb,this.m-1,null):L};h.U=function(){return this};h.S=function(a,b){return new Tc(this.Kb,this.m,b)};h.Y=function(a,b){return Q.a?Q.a(b,this):Q.call(null,b,this)};Tc.prototype[Ra]=function(){return yc(this)};Bb._=function(a,b){return a===b};
var Zc=function Zc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Zc.s();case 1:return Zc.b(arguments[0]);case 2:return Zc.a(arguments[0],arguments[1]);default:return Zc.j(arguments[0],arguments[1],new Ja(c.slice(2),0))}};Zc.s=function(){return $c};Zc.b=function(a){return a};Zc.a=function(a,b){return null!=a?Za(a,b):Za(L,b)};Zc.j=function(a,b,c){for(;;)if(x(c))a=Zc.a(a,b),b=J(c),c=M(c);else return Zc.a(a,b)};
Zc.F=function(a){var b=J(a),c=M(a);a=J(c);c=M(c);return Zc.j(b,a,c)};Zc.A=2;function R(a){if(null!=a)if(null!=a&&(a.g&2||a.sc))a=a.Z(null);else if(Ma(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.g&8388608||a.Bc))a:{a=w(a);for(var b=0;;){if(Vc(a)){a=b+Wa(a);break a}a=M(a);b+=1}}else a=Wa(a);else a=0;return a}function ad(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return w(a)?J(a):c;if(Wc(a))return G.c(a,b,c);if(w(a)){var d=M(a),e=b-1;a=d;b=e}else return c}}
function bd(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.g&16||a.fc))return a.$(null,b);if(Ma(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.g&64||a.w)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(w(c)){c=J(c);break a}throw Error("Index out of bounds");}if(Wc(c)){c=G.a(c,d);break a}if(w(c))c=M(c),--d;else throw Error("Index out of bounds");
}}return c}if(Oa($a,a))return G.a(a,b);throw Error([B("nth not supported on this type "),B(Qa(null==a?null:a.constructor))].join(""));}
function S(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.g&16||a.fc))return a.Aa(null,b,null);if(Ma(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.g&64||a.w))return ad(a,b);if(Oa($a,a))return G.a(a,b);throw Error([B("nth not supported on this type "),B(Qa(null==a?null:a.constructor))].join(""));}
var H=function H(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return H.a(arguments[0],arguments[1]);case 3:return H.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};H.a=function(a,b){return null==a?null:null!=a&&(a.g&256||a.gc)?a.O(null,b):Ma(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:Oa(eb,a)?gb.a(a,b):null};
H.c=function(a,b,c){return null!=a?null!=a&&(a.g&256||a.gc)?a.L(null,b,c):Ma(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:Oa(eb,a)?gb.c(a,b,c):c:c};H.A=3;cd;var T=function T(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return T.c(arguments[0],arguments[1],arguments[2]);default:return T.j(arguments[0],arguments[1],arguments[2],new Ja(c.slice(3),0))}};T.c=function(a,b,c){return null!=a?ib(a,b,c):dd([b],[c])};
T.j=function(a,b,c,d){for(;;)if(a=T.c(a,b,c),x(d))b=J(d),c=J(M(d)),d=M(M(d));else return a};T.F=function(a){var b=J(a),c=M(a);a=J(c);var d=M(c),c=J(d),d=M(d);return T.j(b,a,c,d)};T.A=3;var ed=function ed(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ed.b(arguments[0]);case 2:return ed.a(arguments[0],arguments[1]);default:return ed.j(arguments[0],arguments[1],new Ja(c.slice(2),0))}};ed.b=function(a){return a};
ed.a=function(a,b){return null==a?null:kb(a,b)};ed.j=function(a,b,c){for(;;){if(null==a)return null;a=ed.a(a,b);if(x(c))b=J(c),c=M(c);else return a}};ed.F=function(a){var b=J(a),c=M(a);a=J(c);c=M(c);return ed.j(b,a,c)};ed.A=2;function fd(a,b){this.h=a;this.o=b;this.g=393217;this.C=0}h=fd.prototype;h.R=function(){return this.o};h.S=function(a,b){return new fd(this.h,b)};
h.call=function(){function a(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K,V){a=this;return D.vb?D.vb(a.h,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K,V):D.call(null,a.h,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K,V)}function b(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K){a=this;return a.h.qa?a.h.qa(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K):a.h.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K)}function c(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E){a=this;return a.h.pa?a.h.pa(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E):
a.h.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E)}function d(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I){a=this;return a.h.oa?a.h.oa(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I):a.h.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I)}function e(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F){a=this;return a.h.na?a.h.na(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F):a.h.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F)}function f(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C){a=this;return a.h.ma?a.h.ma(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C):a.h.call(null,b,
c,d,e,f,g,k,l,m,n,r,t,u,v,z,C)}function g(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z){a=this;return a.h.la?a.h.la(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z):a.h.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z)}function k(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v){a=this;return a.h.ka?a.h.ka(b,c,d,e,f,g,k,l,m,n,r,t,u,v):a.h.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v)}function l(a,b,c,d,e,f,g,k,l,m,n,r,t,u){a=this;return a.h.ja?a.h.ja(b,c,d,e,f,g,k,l,m,n,r,t,u):a.h.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u)}function m(a,b,c,d,e,f,g,k,l,m,n,r,t){a=this;
return a.h.ia?a.h.ia(b,c,d,e,f,g,k,l,m,n,r,t):a.h.call(null,b,c,d,e,f,g,k,l,m,n,r,t)}function n(a,b,c,d,e,f,g,k,l,m,n,r){a=this;return a.h.ha?a.h.ha(b,c,d,e,f,g,k,l,m,n,r):a.h.call(null,b,c,d,e,f,g,k,l,m,n,r)}function r(a,b,c,d,e,f,g,k,l,m,n){a=this;return a.h.ga?a.h.ga(b,c,d,e,f,g,k,l,m,n):a.h.call(null,b,c,d,e,f,g,k,l,m,n)}function t(a,b,c,d,e,f,g,k,l,m){a=this;return a.h.sa?a.h.sa(b,c,d,e,f,g,k,l,m):a.h.call(null,b,c,d,e,f,g,k,l,m)}function u(a,b,c,d,e,f,g,k,l){a=this;return a.h.ra?a.h.ra(b,c,
d,e,f,g,k,l):a.h.call(null,b,c,d,e,f,g,k,l)}function v(a,b,c,d,e,f,g,k){a=this;return a.h.ba?a.h.ba(b,c,d,e,f,g,k):a.h.call(null,b,c,d,e,f,g,k)}function z(a,b,c,d,e,f,g){a=this;return a.h.W?a.h.W(b,c,d,e,f,g):a.h.call(null,b,c,d,e,f,g)}function C(a,b,c,d,e,f){a=this;return a.h.D?a.h.D(b,c,d,e,f):a.h.call(null,b,c,d,e,f)}function F(a,b,c,d,e){a=this;return a.h.u?a.h.u(b,c,d,e):a.h.call(null,b,c,d,e)}function I(a,b,c,d){a=this;return a.h.c?a.h.c(b,c,d):a.h.call(null,b,c,d)}function K(a,b,c){a=this;
return a.h.a?a.h.a(b,c):a.h.call(null,b,c)}function V(a,b){a=this;return a.h.b?a.h.b(b):a.h.call(null,b)}function oa(a){a=this;return a.h.s?a.h.s():a.h.call(null)}var E=null,E=function(ca,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua,E,fb,lb,vb,Nb,nc,Nc,Ed,Ae,Sg){switch(arguments.length){case 1:return oa.call(this,ca);case 2:return V.call(this,ca,O);case 3:return K.call(this,ca,O,da);case 4:return I.call(this,ca,O,da,ha);case 5:return F.call(this,ca,O,da,ha,la);case 6:return C.call(this,ca,O,da,ha,la,ma);case 7:return z.call(this,
ca,O,da,ha,la,ma,va);case 8:return v.call(this,ca,O,da,ha,la,ma,va,za);case 9:return u.call(this,ca,O,da,ha,la,ma,va,za,Aa);case 10:return t.call(this,ca,O,da,ha,la,ma,va,za,Aa,Ba);case 11:return r.call(this,ca,O,da,ha,la,ma,va,za,Aa,Ba,Pa);case 12:return n.call(this,ca,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua);case 13:return m.call(this,ca,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua,E);case 14:return l.call(this,ca,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua,E,fb);case 15:return k.call(this,ca,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua,E,
fb,lb);case 16:return g.call(this,ca,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua,E,fb,lb,vb);case 17:return f.call(this,ca,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua,E,fb,lb,vb,Nb);case 18:return e.call(this,ca,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua,E,fb,lb,vb,Nb,nc);case 19:return d.call(this,ca,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua,E,fb,lb,vb,Nb,nc,Nc);case 20:return c.call(this,ca,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua,E,fb,lb,vb,Nb,nc,Nc,Ed);case 21:return b.call(this,ca,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua,E,fb,lb,vb,Nb,nc,Nc,Ed,Ae);case 22:return a.call(this,
ca,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua,E,fb,lb,vb,Nb,nc,Nc,Ed,Ae,Sg)}throw Error("Invalid arity: "+arguments.length);};E.b=oa;E.a=V;E.c=K;E.u=I;E.D=F;E.W=C;E.ba=z;E.ra=v;E.sa=u;E.ga=t;E.ha=r;E.ia=n;E.ja=m;E.ka=l;E.la=k;E.ma=g;E.na=f;E.oa=e;E.pa=d;E.qa=c;E.Yb=b;E.vb=a;return E}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};h.s=function(){return this.h.s?this.h.s():this.h.call(null)};h.b=function(a){return this.h.b?this.h.b(a):this.h.call(null,a)};
h.a=function(a,b){return this.h.a?this.h.a(a,b):this.h.call(null,a,b)};h.c=function(a,b,c){return this.h.c?this.h.c(a,b,c):this.h.call(null,a,b,c)};h.u=function(a,b,c,d){return this.h.u?this.h.u(a,b,c,d):this.h.call(null,a,b,c,d)};h.D=function(a,b,c,d,e){return this.h.D?this.h.D(a,b,c,d,e):this.h.call(null,a,b,c,d,e)};h.W=function(a,b,c,d,e,f){return this.h.W?this.h.W(a,b,c,d,e,f):this.h.call(null,a,b,c,d,e,f)};
h.ba=function(a,b,c,d,e,f,g){return this.h.ba?this.h.ba(a,b,c,d,e,f,g):this.h.call(null,a,b,c,d,e,f,g)};h.ra=function(a,b,c,d,e,f,g,k){return this.h.ra?this.h.ra(a,b,c,d,e,f,g,k):this.h.call(null,a,b,c,d,e,f,g,k)};h.sa=function(a,b,c,d,e,f,g,k,l){return this.h.sa?this.h.sa(a,b,c,d,e,f,g,k,l):this.h.call(null,a,b,c,d,e,f,g,k,l)};h.ga=function(a,b,c,d,e,f,g,k,l,m){return this.h.ga?this.h.ga(a,b,c,d,e,f,g,k,l,m):this.h.call(null,a,b,c,d,e,f,g,k,l,m)};
h.ha=function(a,b,c,d,e,f,g,k,l,m,n){return this.h.ha?this.h.ha(a,b,c,d,e,f,g,k,l,m,n):this.h.call(null,a,b,c,d,e,f,g,k,l,m,n)};h.ia=function(a,b,c,d,e,f,g,k,l,m,n,r){return this.h.ia?this.h.ia(a,b,c,d,e,f,g,k,l,m,n,r):this.h.call(null,a,b,c,d,e,f,g,k,l,m,n,r)};h.ja=function(a,b,c,d,e,f,g,k,l,m,n,r,t){return this.h.ja?this.h.ja(a,b,c,d,e,f,g,k,l,m,n,r,t):this.h.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t)};
h.ka=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u){return this.h.ka?this.h.ka(a,b,c,d,e,f,g,k,l,m,n,r,t,u):this.h.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u)};h.la=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v){return this.h.la?this.h.la(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v):this.h.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v)};h.ma=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z){return this.h.ma?this.h.ma(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z):this.h.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z)};
h.na=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C){return this.h.na?this.h.na(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C):this.h.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C)};h.oa=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F){return this.h.oa?this.h.oa(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F):this.h.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F)};
h.pa=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I){return this.h.pa?this.h.pa(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I):this.h.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I)};h.qa=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K){return this.h.qa?this.h.qa(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K):this.h.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K)};
h.Yb=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,V){return D.vb?D.vb(this.h,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,V):D.call(null,this.h,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,V)};function Ic(a,b){return"function"==p(a)?new fd(a,b):null==a?null:yb(a,b)}function gd(a){var b=null!=a;return(b?null!=a?a.g&131072||a.xc||(a.g?0:Oa(wb,a)):Oa(wb,a):b)?xb(a):null}function hd(a){return null==a?!1:null!=a?a.g&8||a.Sc?!0:a.g?!1:Oa(Ya,a):Oa(Ya,a)}
function id(a){return null==a?!1:null!=a?a.g&4096||a.Yc?!0:a.g?!1:Oa(pb,a):Oa(pb,a)}function jd(a){return null!=a?a.g&16777216||a.Xc?!0:a.g?!1:Oa(Fb,a):Oa(Fb,a)}function kd(a){return null==a?!1:null!=a?a.g&1024||a.vc?!0:a.g?!1:Oa(jb,a):Oa(jb,a)}function ld(a){return null!=a?a.g&67108864||a.Wc?!0:a.g?!1:Oa(Hb,a):Oa(Hb,a)}function md(a){return null!=a?a.g&16384||a.Zc?!0:a.g?!1:Oa(sb,a):Oa(sb,a)}nd;od;function pd(a){return null!=a?a.C&512||a.Rc?!0:!1:!1}
function qd(a){var b=[];ja(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function rd(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var sd={};function td(a){return null==a?!1:null!=a?a.g&64||a.w?!0:a.g?!1:Oa(ab,a):Oa(ab,a)}function ud(a){return null==a?!1:!1===a?!1:!0}function vd(a,b){return H.c(a,b,sd)===sd?!1:!0}
function lc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return pa(a,b);throw Error([B("Cannot compare "),B(a),B(" to "),B(b)].join(""));}if(null!=a?a.C&2048||a.tb||(a.C?0:Oa(Rb,a)):Oa(Rb,a))return Sb(a,b);if("string"!==typeof a&&!Ma(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([B("Cannot compare "),B(a),B(" to "),B(b)].join(""));return pa(a,b)}
function wd(a,b){var c=R(a),d=R(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=lc(bd(a,d),bd(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}function xd(a){return kc.a(a,lc)?lc:function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return"number"===typeof d?d:x(d)?-1:x(a.a?a.a(c,b):a.call(null,c,b))?1:0}}yd;function zd(a){var b;b=lc;w(a)?(a=yd.b?yd.b(a):yd.call(null,a),b=xd(b),qa(a,b),b=w(a)):b=L;return b}
var Yc=function Yc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Yc.a(arguments[0],arguments[1]);case 3:return Yc.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};Yc.a=function(a,b){var c=w(b);if(c){var d=J(c),c=M(c);return Ta.c?Ta.c(a,d,c):Ta.call(null,a,d,c)}return a.s?a.s():a.call(null)};
Yc.c=function(a,b,c){for(c=w(c);;)if(c){var d=J(c);b=a.a?a.a(b,d):a.call(null,b,d);if(Lc(b))return ub(b);c=M(c)}else return b};Yc.A=3;Ad;var Ta=function Ta(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ta.a(arguments[0],arguments[1]);case 3:return Ta.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
Ta.a=function(a,b){return null!=b&&(b.g&524288||b.zc)?b.ca(null,a):Ma(b)?Pc(b,a):"string"===typeof b?Pc(b,a):Oa(zb,b)?Ab.a(b,a):Yc.a(a,b)};Ta.c=function(a,b,c){return null!=c&&(c.g&524288||c.zc)?c.da(null,a,b):Ma(c)?Qc(c,a,b):"string"===typeof c?Qc(c,a,b):Oa(zb,c)?Ab.c(c,a,b):Yc.c(a,b,c)};Ta.A=3;function Bd(a){return a}
var Cd=function Cd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Cd.s();case 1:return Cd.b(arguments[0]);case 2:return Cd.a(arguments[0],arguments[1]);default:return Cd.j(arguments[0],arguments[1],new Ja(c.slice(2),0))}};Cd.s=function(){return 0};Cd.b=function(a){return a};Cd.a=function(a,b){return a+b};Cd.j=function(a,b,c){return Ta.c(Cd,a+b,c)};Cd.F=function(a){var b=J(a),c=M(a);a=J(c);c=M(c);return Cd.j(b,a,c)};Cd.A=2;
var Dd=function Dd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Dd.s();case 1:return Dd.b(arguments[0]);case 2:return Dd.a(arguments[0],arguments[1]);default:return Dd.j(arguments[0],arguments[1],new Ja(c.slice(2),0))}};Dd.s=function(){return 1};Dd.b=function(a){return a};Dd.a=function(a,b){return a*b};Dd.j=function(a,b,c){return Ta.c(Dd,a*b,c)};Dd.F=function(a){var b=J(a),c=M(a);a=J(c);c=M(c);return Dd.j(b,a,c)};Dd.A=2;ra.dd;
var Fd=function Fd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Fd.b(arguments[0]);case 2:return Fd.a(arguments[0],arguments[1]);default:return Fd.j(arguments[0],arguments[1],new Ja(c.slice(2),0))}};Fd.b=function(){return!0};Fd.a=function(a,b){return a<=b};Fd.j=function(a,b,c){for(;;)if(a<=b)if(M(c))a=b,b=J(c),c=M(c);else return b<=J(c);else return!1};Fd.F=function(a){var b=J(a),c=M(a);a=J(c);c=M(c);return Fd.j(b,a,c)};Fd.A=2;
var Gd=function Gd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Gd.b(arguments[0]);case 2:return Gd.a(arguments[0],arguments[1]);default:return Gd.j(arguments[0],arguments[1],new Ja(c.slice(2),0))}};Gd.b=function(){return!0};Gd.a=function(a,b){return a>=b};Gd.j=function(a,b,c){for(;;)if(a>=b)if(M(c))a=b,b=J(c),c=M(c);else return b>=J(c);else return!1};Gd.F=function(a){var b=J(a),c=M(a);a=J(c);c=M(c);return Gd.j(b,a,c)};Gd.A=2;
function Hd(a){return a-1}Id;function Id(a,b){return(a%b+b)%b}function Jd(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function Kd(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function Ld(a,b){for(var c=b,d=w(a);;)if(d&&0<c)--c,d=M(d);else return d}
var B=function B(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return B.s();case 1:return B.b(arguments[0]);default:return B.j(arguments[0],new Ja(c.slice(1),0))}};B.s=function(){return""};B.b=function(a){return null==a?"":""+a};B.j=function(a,b){for(var c=new ka(""+B(a)),d=b;;)if(x(d))c=c.append(""+B(J(d))),d=M(d);else return c.toString()};B.F=function(a){var b=J(a);a=M(a);return B.j(b,a)};B.A=1;U;Md;
function Hc(a,b){var c;if(jd(b))if(Vc(a)&&Vc(b)&&R(a)!==R(b))c=!1;else a:{c=w(a);for(var d=w(b);;){if(null==c){c=null==d;break a}if(null!=d&&kc.a(J(c),J(d)))c=M(c),d=M(d);else{c=!1;break a}}}else c=null;return ud(c)}function Sc(a){if(w(a)){var b=qc(J(a));for(a=M(a);;){if(null==a)return b;b=rc(b,qc(J(a)));a=M(a)}}else return 0}Nd;Od;Md;Pd;Qd;function Uc(a,b,c,d,e){this.o=a;this.first=b;this.ya=c;this.count=d;this.v=e;this.g=65937646;this.C=8192}h=Uc.prototype;h.toString=function(){return cc(this)};
h.equiv=function(a){return this.B(null,a)};h.R=function(){return this.o};h.ta=function(){return 1===this.count?null:this.ya};h.Z=function(){return this.count};h.$a=function(){return this.first};h.ab=function(){return cb(this)};h.P=function(){var a=this.v;return null!=a?a:this.v=a=Cc(this)};h.B=function(a,b){return Hc(this,b)};h.aa=function(){return yb(L,this.o)};h.ca=function(a,b){return Yc.a(b,this)};h.da=function(a,b,c){return Yc.c(b,c,this)};h.ea=function(){return this.first};
h.ua=function(){return 1===this.count?L:this.ya};h.U=function(){return this};h.S=function(a,b){return new Uc(b,this.first,this.ya,this.count,this.v)};h.Y=function(a,b){return new Uc(this.o,b,this,this.count+1,null)};function Rd(a){return null!=a?a.g&33554432||a.Vc?!0:a.g?!1:Oa(Gb,a):Oa(Gb,a)}Uc.prototype[Ra]=function(){return yc(this)};function Sd(a){this.o=a;this.g=65937614;this.C=8192}h=Sd.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.B(null,a)};h.R=function(){return this.o};
h.ta=function(){return null};h.Z=function(){return 0};h.$a=function(){return null};h.ab=function(){throw Error("Can't pop empty list");};h.P=function(){return Ec};h.B=function(a,b){return Rd(b)||jd(b)?null==w(b):!1};h.aa=function(){return this};h.ca=function(a,b){return Yc.a(b,this)};h.da=function(a,b,c){return Yc.c(b,c,this)};h.ea=function(){return null};h.ua=function(){return L};h.U=function(){return null};h.S=function(a,b){return new Sd(b)};h.Y=function(a,b){return new Uc(this.o,b,null,1,null)};
var L=new Sd(null);Sd.prototype[Ra]=function(){return yc(this)};var ic=function ic(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return ic.j(0<c.length?new Ja(c.slice(0),0):null)};ic.j=function(a){var b;if(a instanceof Ja&&0===a.m)b=a.f;else a:for(b=[];;)if(null!=a)b.push(a.ea(null)),a=a.ta(null);else break a;a=b.length;for(var c=L;;)if(0<a){var d=a-1,c=c.Y(null,b[a-1]);a=d}else return c};ic.A=0;ic.F=function(a){return ic.j(w(a))};
function Td(a,b,c,d){this.o=a;this.first=b;this.ya=c;this.v=d;this.g=65929452;this.C=8192}h=Td.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.B(null,a)};h.R=function(){return this.o};h.ta=function(){return null==this.ya?null:w(this.ya)};h.P=function(){var a=this.v;return null!=a?a:this.v=a=Cc(this)};h.B=function(a,b){return Hc(this,b)};h.aa=function(){return Ic(L,this.o)};h.ca=function(a,b){return Yc.a(b,this)};h.da=function(a,b,c){return Yc.c(b,c,this)};h.ea=function(){return this.first};
h.ua=function(){return null==this.ya?L:this.ya};h.U=function(){return this};h.S=function(a,b){return new Td(b,this.first,this.ya,this.v)};h.Y=function(a,b){return new Td(null,b,this,this.v)};Td.prototype[Ra]=function(){return yc(this)};function Q(a,b){var c=null==b;return(c?c:null!=b&&(b.g&64||b.w))?new Td(null,a,b,null):new Td(null,a,w(b),null)}
function Ud(a,b){if(a.Ia===b.Ia)return 0;var c=Na(a.wa);if(x(c?b.wa:c))return-1;if(x(a.wa)){if(Na(b.wa))return 1;c=pa(a.wa,b.wa);return 0===c?pa(a.name,b.name):c}return pa(a.name,b.name)}function y(a,b,c,d){this.wa=a;this.name=b;this.Ia=c;this.jb=d;this.g=2153775105;this.C=4096}h=y.prototype;h.toString=function(){return[B(":"),B(this.Ia)].join("")};h.equiv=function(a){return this.B(null,a)};h.B=function(a,b){return b instanceof y?this.Ia===b.Ia:!1};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return H.a(c,this);case 3:return H.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return H.a(c,this)};a.c=function(a,c,d){return H.c(c,this,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};h.b=function(a){return H.a(a,this)};h.a=function(a,b){return H.c(a,this,b)};
h.P=function(){var a=this.jb;return null!=a?a:this.jb=a=rc(hc(this.name),pc(this.wa))+2654435769|0};h.yb=function(){return this.name};h.zb=function(){return this.wa};h.N=function(a,b){return Ib(b,[B(":"),B(this.Ia)].join(""))};function Vd(a,b){return a===b?!0:a instanceof y&&b instanceof y?a.Ia===b.Ia:!1}
var Wd=function Wd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Wd.b(arguments[0]);case 2:return Wd.a(arguments[0],arguments[1]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
Wd.b=function(a){if(a instanceof y)return a;if(a instanceof jc){var b;if(null!=a&&(a.C&4096||a.yc))b=a.zb(null);else throw Error([B("Doesn't support namespace: "),B(a)].join(""));return new y(b,Md.b?Md.b(a):Md.call(null,a),a.Sa,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new y(b[0],b[1],a,null):new y(null,b[0],a,null)):null};Wd.a=function(a,b){return new y(a,b,[B(x(a)?[B(a),B("/")].join(""):null),B(b)].join(""),null)};Wd.A=2;
function Xd(a,b,c,d){this.o=a;this.nb=b;this.H=c;this.v=d;this.g=32374988;this.C=0}h=Xd.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.B(null,a)};function Yd(a){null!=a.nb&&(a.H=a.nb.s?a.nb.s():a.nb.call(null),a.nb=null);return a.H}h.R=function(){return this.o};h.ta=function(){Eb(this);return null==this.H?null:M(this.H)};h.P=function(){var a=this.v;return null!=a?a:this.v=a=Cc(this)};h.B=function(a,b){return Hc(this,b)};h.aa=function(){return Ic(L,this.o)};
h.ca=function(a,b){return Yc.a(b,this)};h.da=function(a,b,c){return Yc.c(b,c,this)};h.ea=function(){Eb(this);return null==this.H?null:J(this.H)};h.ua=function(){Eb(this);return null!=this.H?wc(this.H):L};h.U=function(){Yd(this);if(null==this.H)return null;for(var a=this.H;;)if(a instanceof Xd)a=Yd(a);else return this.H=a,w(this.H)};h.S=function(a,b){return new Xd(b,this.nb,this.H,this.v)};h.Y=function(a,b){return Q(b,this)};Xd.prototype[Ra]=function(){return yc(this)};Zd;
function $d(a,b){this.J=a;this.end=b;this.g=2;this.C=0}$d.prototype.add=function(a){this.J[this.end]=a;return this.end+=1};$d.prototype.K=function(){var a=new Zd(this.J,0,this.end);this.J=null;return a};$d.prototype.Z=function(){return this.end};function ae(a){return new $d(Array(a),0)}function Zd(a,b,c){this.f=a;this.fa=b;this.end=c;this.g=524306;this.C=0}h=Zd.prototype;h.Z=function(){return this.end-this.fa};h.$=function(a,b){return this.f[this.fa+b]};
h.Aa=function(a,b,c){return 0<=b&&b<this.end-this.fa?this.f[this.fa+b]:c};h.ec=function(){if(this.fa===this.end)throw Error("-drop-first of empty chunk");return new Zd(this.f,this.fa+1,this.end)};h.ca=function(a,b){return Rc(this.f,b,this.f[this.fa],this.fa+1)};h.da=function(a,b,c){return Rc(this.f,b,c,this.fa)};function nd(a,b,c,d){this.K=a;this.Qa=b;this.o=c;this.v=d;this.g=31850732;this.C=1536}h=nd.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.B(null,a)};
h.R=function(){return this.o};h.ta=function(){if(1<Wa(this.K))return new nd(Tb(this.K),this.Qa,this.o,null);var a=Eb(this.Qa);return null==a?null:a};h.P=function(){var a=this.v;return null!=a?a:this.v=a=Cc(this)};h.B=function(a,b){return Hc(this,b)};h.aa=function(){return Ic(L,this.o)};h.ea=function(){return G.a(this.K,0)};h.ua=function(){return 1<Wa(this.K)?new nd(Tb(this.K),this.Qa,this.o,null):null==this.Qa?L:this.Qa};h.U=function(){return this};h.Wb=function(){return this.K};
h.Xb=function(){return null==this.Qa?L:this.Qa};h.S=function(a,b){return new nd(this.K,this.Qa,b,this.v)};h.Y=function(a,b){return Q(b,this)};h.Vb=function(){return null==this.Qa?null:this.Qa};nd.prototype[Ra]=function(){return yc(this)};function be(a,b){return 0===Wa(a)?b:new nd(a,b,null,null)}function ce(a,b){a.add(b)}function Pd(a){return Ub(a)}function Qd(a){return Vb(a)}function yd(a){for(var b=[];;)if(w(a))b.push(J(a)),a=M(a);else return b}
function de(a){if("number"===typeof a)a:{var b=Array(a);if(td(null))for(var c=0,d=w(null);;)if(d&&c<a)b[c]=J(d),c+=1,d=M(d);else{a=b;break a}else{for(c=0;;)if(c<a)b[c]=null,c+=1;else break;a=b}}else a=Ha.b(a);return a}function ee(a,b){if(Vc(a))return R(a);for(var c=a,d=b,e=0;;)if(0<d&&w(c))c=M(c),--d,e+=1;else return e}
var fe=function fe(b){return null==b?null:null==M(b)?w(J(b)):Q(J(b),fe(M(b)))},ge=function ge(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ge.s();case 1:return ge.b(arguments[0]);case 2:return ge.a(arguments[0],arguments[1]);default:return ge.j(arguments[0],arguments[1],new Ja(c.slice(2),0))}};ge.s=function(){return new Xd(null,function(){return null},null,null)};ge.b=function(a){return new Xd(null,function(){return a},null,null)};
ge.a=function(a,b){return new Xd(null,function(){var c=w(a);return c?pd(c)?be(Ub(c),ge.a(Vb(c),b)):Q(J(c),ge.a(wc(c),b)):b},null,null)};ge.j=function(a,b,c){return function e(a,b){return new Xd(null,function(){var c=w(a);return c?pd(c)?be(Ub(c),e(Vb(c),b)):Q(J(c),e(wc(c),b)):x(b)?e(J(b),M(b)):null},null,null)}(ge.a(a,b),c)};ge.F=function(a){var b=J(a),c=M(a);a=J(c);c=M(c);return ge.j(b,a,c)};ge.A=2;function he(a){return Ob(a)}
var ie=function ie(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ie.s();case 1:return ie.b(arguments[0]);case 2:return ie.a(arguments[0],arguments[1]);default:return ie.j(arguments[0],arguments[1],new Ja(c.slice(2),0))}};ie.s=function(){return Lb($c)};ie.b=function(a){return a};ie.a=function(a,b){return Mb(a,b)};ie.j=function(a,b,c){for(;;)if(a=Mb(a,b),x(c))b=J(c),c=M(c);else return a};
ie.F=function(a){var b=J(a),c=M(a);a=J(c);c=M(c);return ie.j(b,a,c)};ie.A=2;
function je(a,b,c){var d=w(c);if(0===b)return a.s?a.s():a.call(null);c=bb(d);var e=cb(d);if(1===b)return a.b?a.b(c):a.b?a.b(c):a.call(null,c);var d=bb(e),f=cb(e);if(2===b)return a.a?a.a(c,d):a.a?a.a(c,d):a.call(null,c,d);var e=bb(f),g=cb(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=bb(g),k=cb(g);if(4===b)return a.u?a.u(c,d,e,f):a.u?a.u(c,d,e,f):a.call(null,c,d,e,f);var g=bb(k),l=cb(k);if(5===b)return a.D?a.D(c,d,e,f,g):a.D?a.D(c,d,e,f,g):a.call(null,c,d,e,f,g);var k=bb(l),
m=cb(l);if(6===b)return a.W?a.W(c,d,e,f,g,k):a.W?a.W(c,d,e,f,g,k):a.call(null,c,d,e,f,g,k);var l=bb(m),n=cb(m);if(7===b)return a.ba?a.ba(c,d,e,f,g,k,l):a.ba?a.ba(c,d,e,f,g,k,l):a.call(null,c,d,e,f,g,k,l);var m=bb(n),r=cb(n);if(8===b)return a.ra?a.ra(c,d,e,f,g,k,l,m):a.ra?a.ra(c,d,e,f,g,k,l,m):a.call(null,c,d,e,f,g,k,l,m);var n=bb(r),t=cb(r);if(9===b)return a.sa?a.sa(c,d,e,f,g,k,l,m,n):a.sa?a.sa(c,d,e,f,g,k,l,m,n):a.call(null,c,d,e,f,g,k,l,m,n);var r=bb(t),u=cb(t);if(10===b)return a.ga?a.ga(c,d,e,
f,g,k,l,m,n,r):a.ga?a.ga(c,d,e,f,g,k,l,m,n,r):a.call(null,c,d,e,f,g,k,l,m,n,r);var t=bb(u),v=cb(u);if(11===b)return a.ha?a.ha(c,d,e,f,g,k,l,m,n,r,t):a.ha?a.ha(c,d,e,f,g,k,l,m,n,r,t):a.call(null,c,d,e,f,g,k,l,m,n,r,t);var u=bb(v),z=cb(v);if(12===b)return a.ia?a.ia(c,d,e,f,g,k,l,m,n,r,t,u):a.ia?a.ia(c,d,e,f,g,k,l,m,n,r,t,u):a.call(null,c,d,e,f,g,k,l,m,n,r,t,u);var v=bb(z),C=cb(z);if(13===b)return a.ja?a.ja(c,d,e,f,g,k,l,m,n,r,t,u,v):a.ja?a.ja(c,d,e,f,g,k,l,m,n,r,t,u,v):a.call(null,c,d,e,f,g,k,l,m,n,
r,t,u,v);var z=bb(C),F=cb(C);if(14===b)return a.ka?a.ka(c,d,e,f,g,k,l,m,n,r,t,u,v,z):a.ka?a.ka(c,d,e,f,g,k,l,m,n,r,t,u,v,z):a.call(null,c,d,e,f,g,k,l,m,n,r,t,u,v,z);var C=bb(F),I=cb(F);if(15===b)return a.la?a.la(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C):a.la?a.la(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C):a.call(null,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C);var F=bb(I),K=cb(I);if(16===b)return a.ma?a.ma(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F):a.ma?a.ma(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F):a.call(null,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F);var I=
bb(K),V=cb(K);if(17===b)return a.na?a.na(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I):a.na?a.na(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I):a.call(null,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I);var K=bb(V),oa=cb(V);if(18===b)return a.oa?a.oa(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K):a.oa?a.oa(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K):a.call(null,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K);V=bb(oa);oa=cb(oa);if(19===b)return a.pa?a.pa(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,V):a.pa?a.pa(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,V):a.call(null,c,d,e,
f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,V);var E=bb(oa);cb(oa);if(20===b)return a.qa?a.qa(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,V,E):a.qa?a.qa(c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,V,E):a.call(null,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,V,E);throw Error("Only up to 20 arguments supported on functions");}
var D=function D(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return D.a(arguments[0],arguments[1]);case 3:return D.c(arguments[0],arguments[1],arguments[2]);case 4:return D.u(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return D.D(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return D.j(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new Ja(c.slice(5),0))}};
D.a=function(a,b){var c=a.A;if(a.F){var d=ee(b,c+1);return d<=c?je(a,d,b):a.F(b)}return a.apply(a,yd(b))};D.c=function(a,b,c){b=Q(b,c);c=a.A;if(a.F){var d=ee(b,c+1);return d<=c?je(a,d,b):a.F(b)}return a.apply(a,yd(b))};D.u=function(a,b,c,d){b=Q(b,Q(c,d));c=a.A;return a.F?(d=ee(b,c+1),d<=c?je(a,d,b):a.F(b)):a.apply(a,yd(b))};D.D=function(a,b,c,d,e){b=Q(b,Q(c,Q(d,e)));c=a.A;return a.F?(d=ee(b,c+1),d<=c?je(a,d,b):a.F(b)):a.apply(a,yd(b))};
D.j=function(a,b,c,d,e,f){b=Q(b,Q(c,Q(d,Q(e,fe(f)))));c=a.A;return a.F?(d=ee(b,c+1),d<=c?je(a,d,b):a.F(b)):a.apply(a,yd(b))};D.F=function(a){var b=J(a),c=M(a);a=J(c);var d=M(c),c=J(d),e=M(d),d=J(e),f=M(e),e=J(f),f=M(f);return D.j(b,a,c,d,e,f)};D.A=5;function ke(a){return w(a)?a:null}
var le=function le(){"undefined"===typeof sa&&(sa=function(b,c){this.Nc=b;this.Mc=c;this.g=393216;this.C=0},sa.prototype.S=function(b,c){return new sa(this.Nc,c)},sa.prototype.R=function(){return this.Mc},sa.prototype.va=function(){return!1},sa.prototype.next=function(){return Error("No such element")},sa.prototype.remove=function(){return Error("Unsupported operation")},sa.ac=function(){return new W(null,2,5,X,[Ic(me,new q(null,1,[ne,ic(oe,ic($c))],null)),ra.cd],null)},sa.Db=!0,sa.cb="cljs.core/t_cljs$core20055",
sa.Pb=function(b,c){return Ib(c,"cljs.core/t_cljs$core20055")});return new sa(le,pe)};qe;function qe(a,b,c,d){this.qb=a;this.first=b;this.ya=c;this.o=d;this.g=31719628;this.C=0}h=qe.prototype;h.S=function(a,b){return new qe(this.qb,this.first,this.ya,b)};h.Y=function(a,b){return Q(b,Eb(this))};h.aa=function(){return L};h.B=function(a,b){return null!=Eb(this)?Hc(this,b):jd(b)&&null==w(b)};h.P=function(){return Cc(this)};h.U=function(){null!=this.qb&&this.qb.step(this);return null==this.ya?null:this};
h.ea=function(){null!=this.qb&&Eb(this);return null==this.ya?null:this.first};h.ua=function(){null!=this.qb&&Eb(this);return null==this.ya?L:this.ya};h.ta=function(){null!=this.qb&&Eb(this);return null==this.ya?null:Eb(this.ya)};qe.prototype[Ra]=function(){return yc(this)};function re(a,b){for(;;){if(null==w(b))return!0;var c;c=J(b);c=a.b?a.b(c):a.call(null,c);if(x(c)){c=a;var d=M(b);a=c;b=d}else return!1}}
function se(a,b){for(;;)if(w(b)){var c;c=J(b);c=a.b?a.b(c):a.call(null,c);if(x(c))return c;c=a;var d=M(b);a=c;b=d}else return null}function te(a){if("number"===typeof a&&!isNaN(a)&&Infinity!==a&&parseFloat(a)===parseInt(a,10))return 0===(a&1);throw Error([B("Argument must be an integer: "),B(a)].join(""));}
function ue(a){return function(){function b(b,c){return Na(a.a?a.a(b,c):a.call(null,b,c))}function c(b){return Na(a.b?a.b(b):a.call(null,b))}function d(){return Na(a.s?a.s():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new Ja(g,0)}return c.call(this,a,d,f)}function c(b,d,e){return Na(D.u(a,b,d,e))}b.A=2;b.F=function(a){var b=J(a);a=M(a);var d=J(a);a=wc(a);return c(b,d,a)};b.j=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new Ja(n,0)}return f.j(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.A=2;e.F=f.F;e.s=d;e.b=c;e.a=b;e.j=f.j;return e}()}
function ve(){return function(){function a(a){if(0<arguments.length)for(var c=0,d=Array(arguments.length-0);c<d.length;)d[c]=arguments[c+0],++c;return!1}a.A=0;a.F=function(a){w(a);return!1};a.j=function(){return!1};return a}()}
function we(a,b){return function(){function c(c,d,e){return a.u?a.u(b,c,d,e):a.call(null,b,c,d,e)}function d(c,d){return a.c?a.c(b,c,d):a.call(null,b,c,d)}function e(c){return a.a?a.a(b,c):a.call(null,b,c)}function f(){return a.b?a.b(b):a.call(null,b)}var g=null,k=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,k=Array(arguments.length-3);g<k.length;)k[g]=arguments[g+3],++g;g=new Ja(k,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return D.j(a,b,c,e,f,uc([g],0))}c.A=
3;c.F=function(a){var b=J(a);a=M(a);var c=J(a);a=M(a);var e=J(a);a=wc(a);return d(b,c,e,a)};c.j=d;return c}(),g=function(a,b,g,r){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var t=null;if(3<arguments.length){for(var t=0,u=Array(arguments.length-3);t<u.length;)u[t]=arguments[t+3],++t;t=new Ja(u,0)}return k.j(a,b,g,t)}throw Error("Invalid arity: "+arguments.length);};g.A=3;g.F=k.F;g.s=f;g.b=
e;g.a=d;g.c=c;g.j=k.j;return g}()}xe;function ye(a,b,c,d){this.state=a;this.o=b;this.qc=d;this.C=16386;this.g=6455296}h=ye.prototype;h.equiv=function(a){return this.B(null,a)};h.B=function(a,b){return this===b};h.ub=function(){return this.state};h.R=function(){return this.o};
h.ic=function(a,b,c){a=w(this.qc);for(var d=null,e=0,f=0;;)if(f<e){var g=d.$(null,f),k=S(g,0),g=S(g,1);g.u?g.u(k,this,b,c):g.call(null,k,this,b,c);f+=1}else if(a=w(a))pd(a)?(d=Ub(a),a=Vb(a),k=d,e=R(d),d=k):(d=J(a),k=S(d,0),g=S(d,1),g.u?g.u(k,this,b,c):g.call(null,k,this,b,c),a=M(a),d=null,e=0),f=0;else return null};h.P=function(){return this[ba]||(this[ba]=++ea)};
var ze=function ze(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ze.b(arguments[0]);default:return ze.j(arguments[0],new Ja(c.slice(1),0))}};ze.b=function(a){return new ye(a,null,0,null)};ze.j=function(a,b){var c=null!=b&&(b.g&64||b.w)?D.a(N,b):b,d=H.a(c,Ea);H.a(c,Be);return new ye(a,d,0,null)};ze.F=function(a){var b=J(a);a=M(a);return ze.j(b,a)};ze.A=1;Ce;
function De(a,b){if(a instanceof ye){var c=a.state;a.state=b;null!=a.qc&&Kb(a,c,b);return b}return Zb(a,b)}var Ee=function Ee(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ee.a(arguments[0],arguments[1]);case 3:return Ee.c(arguments[0],arguments[1],arguments[2]);case 4:return Ee.u(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Ee.j(arguments[0],arguments[1],arguments[2],arguments[3],new Ja(c.slice(4),0))}};
Ee.a=function(a,b){var c;a instanceof ye?(c=a.state,c=b.b?b.b(c):b.call(null,c),c=De(a,c)):c=$b.a(a,b);return c};Ee.c=function(a,b,c){if(a instanceof ye){var d=a.state;b=b.a?b.a(d,c):b.call(null,d,c);a=De(a,b)}else a=$b.c(a,b,c);return a};Ee.u=function(a,b,c,d){if(a instanceof ye){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=De(a,b)}else a=$b.u(a,b,c,d);return a};Ee.j=function(a,b,c,d,e){return a instanceof ye?De(a,D.D(b,a.state,c,d,e)):$b.D(a,b,c,d,e)};
Ee.F=function(a){var b=J(a),c=M(a);a=J(c);var d=M(c),c=J(d),e=M(d),d=J(e),e=M(e);return Ee.j(b,a,c,d,e)};Ee.A=4;function Fe(a){this.state=a;this.g=32768;this.C=0}Fe.prototype.ub=function(){return this.state};function xe(a){return new Fe(a)}
var U=function U(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return U.b(arguments[0]);case 2:return U.a(arguments[0],arguments[1]);case 3:return U.c(arguments[0],arguments[1],arguments[2]);case 4:return U.u(arguments[0],arguments[1],arguments[2],arguments[3]);default:return U.j(arguments[0],arguments[1],arguments[2],arguments[3],new Ja(c.slice(4),0))}};
U.b=function(a){return function(b){return function(){function c(c,d){var e=a.b?a.b(d):a.call(null,d);return b.a?b.a(c,e):b.call(null,c,e)}function d(a){return b.b?b.b(a):b.call(null,a)}function e(){return b.s?b.s():b.call(null)}var f=null,g=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new Ja(g,0)}return d.call(this,a,b,f)}function d(c,e,f){e=D.c(a,e,f);return b.a?b.a(c,e):b.call(null,c,e)}c.A=2;c.F=function(a){var b=
J(a);a=M(a);var c=J(a);a=wc(a);return d(b,c,a)};c.j=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,r=Array(arguments.length-2);n<r.length;)r[n]=arguments[n+2],++n;n=new Ja(r,0)}return g.j(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.A=2;f.F=g.F;f.s=e;f.b=d;f.a=c;f.j=g.j;return f}()}};
U.a=function(a,b){return new Xd(null,function(){var c=w(b);if(c){if(pd(c)){for(var d=Ub(c),e=R(d),f=ae(e),g=0;;)if(g<e)ce(f,function(){var b=G.a(d,g);return a.b?a.b(b):a.call(null,b)}()),g+=1;else break;return be(f.K(),U.a(a,Vb(c)))}return Q(function(){var b=J(c);return a.b?a.b(b):a.call(null,b)}(),U.a(a,wc(c)))}return null},null,null)};
U.c=function(a,b,c){return new Xd(null,function(){var d=w(b),e=w(c);if(d&&e){var f=Q,g;g=J(d);var k=J(e);g=a.a?a.a(g,k):a.call(null,g,k);d=f(g,U.c(a,wc(d),wc(e)))}else d=null;return d},null,null)};U.u=function(a,b,c,d){return new Xd(null,function(){var e=w(b),f=w(c),g=w(d);if(e&&f&&g){var k=Q,l;l=J(e);var m=J(f),n=J(g);l=a.c?a.c(l,m,n):a.call(null,l,m,n);e=k(l,U.u(a,wc(e),wc(f),wc(g)))}else e=null;return e},null,null)};
U.j=function(a,b,c,d,e){var f=function k(a){return new Xd(null,function(){var b=U.a(w,a);return re(Bd,b)?Q(U.a(J,b),k(U.a(wc,b))):null},null,null)};return U.a(function(){return function(b){return D.a(a,b)}}(f),f(Zc.j(e,d,uc([c,b],0))))};U.F=function(a){var b=J(a),c=M(a);a=J(c);var d=M(c),c=J(d),e=M(d),d=J(e),e=M(e);return U.j(b,a,c,d,e)};U.A=4;
function Ge(a){return new Xd(null,function(b){return function(){return b(1,a)}}(function(a,c){for(;;){var d=w(c);if(0<a&&d){var e=a-1,d=wc(d);a=e;c=d}else return d}}),null,null)}var He=function He(b){return new Xd(null,function(){var c=w(b);return c?ge.a(c,He(c)):null},null,null)};function Ie(a){return new Xd(null,function(){return Q(a,Ie(a))},null,null)}
var Je=function Je(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Je.a(arguments[0],arguments[1]);default:return Je.j(arguments[0],arguments[1],new Ja(c.slice(2),0))}};Je.a=function(a,b){return new Xd(null,function(){var c=w(a),d=w(b);return c&&d?Q(J(c),Q(J(d),Je.a(wc(c),wc(d)))):null},null,null)};
Je.j=function(a,b,c){return new Xd(null,function(){var d=U.a(w,Zc.j(c,b,uc([a],0)));return re(Bd,d)?ge.a(U.a(J,d),D.a(Je,U.a(wc,d))):null},null,null)};Je.F=function(a){var b=J(a),c=M(a);a=J(c);c=M(c);return Je.j(b,a,c)};Je.A=2;function Ke(a){return Ge(Je.a(Ie("L"),a))}Le;
function Me(a,b){return new Xd(null,function(){var c=w(b);if(c){if(pd(c)){for(var d=Ub(c),e=R(d),f=ae(e),g=0;;)if(g<e){var k;k=G.a(d,g);k=a.b?a.b(k):a.call(null,k);x(k)&&(k=G.a(d,g),f.add(k));g+=1}else break;return be(f.K(),Me(a,Vb(c)))}d=J(c);c=wc(c);return x(a.b?a.b(d):a.call(null,d))?Q(d,Me(a,c)):Me(a,c)}return null},null,null)}function Ne(a,b){return Me(ue(a),b)}
function Oe(a,b){var c=w;return function e(b){return new Xd(null,function(){var g=Q,k;x(a.b?a.b(b):a.call(null,b))?(k=uc([c.b?c.b(b):c.call(null,b)],0),k=D.a(ge,D.c(U,e,k))):k=null;return g(b,k)},null,null)}(b)}function Pe(a){return Me(function(a){return!jd(a)},wc(Oe(jd,a)))}function Qe(a,b){return null!=a?null!=a&&(a.C&4||a.Tc)?Ic(he(Ta.c(Mb,Lb(a),b)),gd(a)):Ta.c(Za,a,b):Ta.c(Zc,L,b)}function Re(a,b){return he(Ta.c(function(b,d){return ie.a(b,a.b?a.b(d):a.call(null,d))},Lb($c),b))}
function Se(a,b){var c;a:{c=sd;for(var d=a,e=w(b);;)if(e)if(null!=d?d.g&256||d.gc||(d.g?0:Oa(eb,d)):Oa(eb,d)){d=H.c(d,J(e),c);if(c===d){c=null;break a}e=M(e)}else{c=null;break a}else{c=d;break a}}return c}
var Te=function Te(b,c,d){var e=S(c,0);c=Ld(c,1);return x(c)?T.c(b,e,Te(H.a(b,e),c,d)):T.c(b,e,d)},Ue=function Ue(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Ue.c(arguments[0],arguments[1],arguments[2]);case 4:return Ue.u(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Ue.D(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);case 6:return Ue.W(arguments[0],arguments[1],arguments[2],arguments[3],
arguments[4],arguments[5]);default:return Ue.j(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],new Ja(c.slice(6),0))}};Ue.c=function(a,b,c){var d=S(b,0);b=Ld(b,1);return x(b)?T.c(a,d,Ue.c(H.a(a,d),b,c)):T.c(a,d,function(){var b=H.a(a,d);return c.b?c.b(b):c.call(null,b)}())};Ue.u=function(a,b,c,d){var e=S(b,0);b=Ld(b,1);return x(b)?T.c(a,e,Ue.u(H.a(a,e),b,c,d)):T.c(a,e,function(){var b=H.a(a,e);return c.a?c.a(b,d):c.call(null,b,d)}())};
Ue.D=function(a,b,c,d,e){var f=S(b,0);b=Ld(b,1);return x(b)?T.c(a,f,Ue.D(H.a(a,f),b,c,d,e)):T.c(a,f,function(){var b=H.a(a,f);return c.c?c.c(b,d,e):c.call(null,b,d,e)}())};Ue.W=function(a,b,c,d,e,f){var g=S(b,0);b=Ld(b,1);return x(b)?T.c(a,g,Ue.W(H.a(a,g),b,c,d,e,f)):T.c(a,g,function(){var b=H.a(a,g);return c.u?c.u(b,d,e,f):c.call(null,b,d,e,f)}())};Ue.j=function(a,b,c,d,e,f,g){var k=S(b,0);b=Ld(b,1);return x(b)?T.c(a,k,D.j(Ue,H.a(a,k),b,c,d,uc([e,f,g],0))):T.c(a,k,D.j(c,H.a(a,k),d,e,f,uc([g],0)))};
Ue.F=function(a){var b=J(a),c=M(a);a=J(c);var d=M(c),c=J(d),e=M(d),d=J(e),f=M(e),e=J(f),g=M(f),f=J(g),g=M(g);return Ue.j(b,a,c,d,e,f,g)};Ue.A=6;function Ve(a,b){return T.c(a,b,function(){var c=H.a(a,b);return wc.b?wc.b(c):wc.call(null,c)}())}function We(a,b,c,d){return T.c(a,b,function(){var e=H.a(a,b);return c.a?c.a(e,d):c.call(null,e,d)}())}function Xe(a,b){this.T=a;this.f=b}
function Ye(a){return new Xe(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function Ze(a){return new Xe(a.T,Sa(a.f))}function $e(a){a=a.l;return 32>a?0:a-1>>>5<<5}function af(a,b,c){for(;;){if(0===b)return c;var d=Ye(a);d.f[0]=c;c=d;b-=5}}var bf=function bf(b,c,d,e){var f=Ze(d),g=b.l-1>>>c&31;5===c?f.f[g]=e:(d=d.f[g],b=null!=d?bf(b,c-5,d,e):af(null,c-5,e),f.f[g]=b);return f};
function cf(a,b){throw Error([B("No item "),B(a),B(" in vector of length "),B(b)].join(""));}function df(a,b){if(b>=$e(a))return a.M;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.f[b>>>d&31],d=e;else return c.f}function ef(a,b){return 0<=b&&b<a.l?df(a,b):cf(b,a.l)}
var ff=function ff(b,c,d,e,f){var g=Ze(d);if(0===c)g.f[e&31]=f;else{var k=e>>>c&31;b=ff(b,c-5,d.f[k],e,f);g.f[k]=b}return g},gf=function gf(b,c,d){var e=b.l-2>>>c&31;if(5<c){b=gf(b,c-5,d.f[e]);if(null==b&&0===e)return null;d=Ze(d);d.f[e]=b;return d}if(0===e)return null;d=Ze(d);d.f[e]=null;return d};function hf(a,b,c,d,e,f){this.m=a;this.Tb=b;this.f=c;this.Ga=d;this.start=e;this.end=f}hf.prototype.va=function(){return this.m<this.end};
hf.prototype.next=function(){32===this.m-this.Tb&&(this.f=df(this.Ga,this.m),this.Tb+=32);var a=this.f[this.m&31];this.m+=1;return a};jf;kf;lf;P;mf;nf;of;function W(a,b,c,d,e,f){this.o=a;this.l=b;this.shift=c;this.root=d;this.M=e;this.v=f;this.g=167668511;this.C=8196}h=W.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.B(null,a)};h.O=function(a,b){return gb.c(this,b,null)};h.L=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};
h.$=function(a,b){return ef(this,b)[b&31]};h.Aa=function(a,b,c){return 0<=b&&b<this.l?df(this,b)[b&31]:c};h.bb=function(a,b,c){if(0<=b&&b<this.l)return $e(this)<=b?(a=Sa(this.M),a[b&31]=c,new W(this.o,this.l,this.shift,this.root,a,null)):new W(this.o,this.l,this.shift,ff(this,this.shift,this.root,b,c),this.M,null);if(b===this.l)return Za(this,c);throw Error([B("Index "),B(b),B(" out of bounds  [0,"),B(this.l),B("]")].join(""));};
h.Ha=function(){var a=this.l;return new hf(0,0,0<R(this)?df(this,0):null,this,0,a)};h.R=function(){return this.o};h.Z=function(){return this.l};h.wb=function(){return G.a(this,0)};h.xb=function(){return G.a(this,1)};h.$a=function(){return 0<this.l?G.a(this,this.l-1):null};
h.ab=function(){if(0===this.l)throw Error("Can't pop empty vector");if(1===this.l)return yb($c,this.o);if(1<this.l-$e(this))return new W(this.o,this.l-1,this.shift,this.root,this.M.slice(0,-1),null);var a=df(this,this.l-2),b=gf(this,this.shift,this.root),b=null==b?X:b,c=this.l-1;return 5<this.shift&&null==b.f[1]?new W(this.o,c,this.shift-5,b.f[0],a,null):new W(this.o,c,this.shift,b,a,null)};h.P=function(){var a=this.v;return null!=a?a:this.v=a=Cc(this)};
h.B=function(a,b){if(b instanceof W)if(this.l===R(b))for(var c=ac(this),d=ac(b);;)if(x(c.va())){var e=c.next(),f=d.next();if(!kc.a(e,f))return!1}else return!0;else return!1;else return Hc(this,b)};h.lb=function(){return new lf(this.l,this.shift,jf.b?jf.b(this.root):jf.call(null,this.root),kf.b?kf.b(this.M):kf.call(null,this.M))};h.aa=function(){return Ic($c,this.o)};h.ca=function(a,b){return Mc(this,b)};
h.da=function(a,b,c){a=0;for(var d=c;;)if(a<this.l){var e=df(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=e[f],d=b.a?b.a(d,g):b.call(null,d,g);if(Lc(d)){e=d;break a}f+=1}else{e=d;break a}if(Lc(e))return P.b?P.b(e):P.call(null,e);a+=c;d=e}else return d};h.Wa=function(a,b,c){if("number"===typeof b)return tb(this,b,c);throw Error("Vector's key for assoc must be a number.");};
h.U=function(){if(0===this.l)return null;if(32>=this.l)return new Ja(this.M,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.f[0];else{a=a.f;break a}}return of.u?of.u(this,a,0,0):of.call(null,this,a,0,0)};h.S=function(a,b){return new W(b,this.l,this.shift,this.root,this.M,this.v)};
h.Y=function(a,b){if(32>this.l-$e(this)){for(var c=this.M.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.M[e],e+=1;else break;d[c]=b;return new W(this.o,this.l+1,this.shift,this.root,d,null)}c=(d=this.l>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=Ye(null),d.f[0]=this.root,e=af(null,this.shift,new Xe(null,this.M)),d.f[1]=e):d=bf(this,this.shift,this.root,new Xe(null,this.M));return new W(this.o,this.l+1,c,d,[b],null)};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.$(null,c);case 3:return this.Aa(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.$(null,c)};a.c=function(a,c,d){return this.Aa(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};h.b=function(a){return this.$(null,a)};h.a=function(a,b){return this.Aa(null,a,b)};
var X=new Xe(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),$c=new W(null,0,5,X,[],Ec);function pf(a){var b=a.length;if(32>b)return new W(null,b,5,X,a,null);for(var c=32,d=(new W(null,32,5,X,a.slice(0,32),null)).lb(null);;)if(c<b)var e=c+1,d=ie.a(d,a[c]),c=e;else return Ob(d)}W.prototype[Ra]=function(){return yc(this)};function Ad(a){return Ma(a)?pf(a):Ob(Ta.c(Mb,Lb($c),a))}
var qf=function qf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return qf.j(0<c.length?new Ja(c.slice(0),0):null)};qf.j=function(a){return a instanceof Ja&&0===a.m?pf(a.f):Ad(a)};qf.A=0;qf.F=function(a){return qf.j(w(a))};rf;function od(a,b,c,d,e,f){this.Ca=a;this.node=b;this.m=c;this.fa=d;this.o=e;this.v=f;this.g=32375020;this.C=1536}h=od.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.B(null,a)};h.R=function(){return this.o};
h.ta=function(){if(this.fa+1<this.node.length){var a;a=this.Ca;var b=this.node,c=this.m,d=this.fa+1;a=of.u?of.u(a,b,c,d):of.call(null,a,b,c,d);return null==a?null:a}return Wb(this)};h.P=function(){var a=this.v;return null!=a?a:this.v=a=Cc(this)};h.B=function(a,b){return Hc(this,b)};h.aa=function(){return Ic($c,this.o)};h.ca=function(a,b){var c;c=this.Ca;var d=this.m+this.fa,e=R(this.Ca);c=rf.c?rf.c(c,d,e):rf.call(null,c,d,e);return Mc(c,b)};
h.da=function(a,b,c){a=this.Ca;var d=this.m+this.fa,e=R(this.Ca);a=rf.c?rf.c(a,d,e):rf.call(null,a,d,e);return Oc(a,b,c)};h.ea=function(){return this.node[this.fa]};h.ua=function(){if(this.fa+1<this.node.length){var a;a=this.Ca;var b=this.node,c=this.m,d=this.fa+1;a=of.u?of.u(a,b,c,d):of.call(null,a,b,c,d);return null==a?L:a}return Vb(this)};h.U=function(){return this};h.Wb=function(){var a=this.node;return new Zd(a,this.fa,a.length)};
h.Xb=function(){var a=this.m+this.node.length;if(a<Wa(this.Ca)){var b=this.Ca,c=df(this.Ca,a);return of.u?of.u(b,c,a,0):of.call(null,b,c,a,0)}return L};h.S=function(a,b){return of.D?of.D(this.Ca,this.node,this.m,this.fa,b):of.call(null,this.Ca,this.node,this.m,this.fa,b)};h.Y=function(a,b){return Q(b,this)};h.Vb=function(){var a=this.m+this.node.length;if(a<Wa(this.Ca)){var b=this.Ca,c=df(this.Ca,a);return of.u?of.u(b,c,a,0):of.call(null,b,c,a,0)}return null};od.prototype[Ra]=function(){return yc(this)};
var of=function of(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return of.c(arguments[0],arguments[1],arguments[2]);case 4:return of.u(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return of.D(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};of.c=function(a,b,c){return new od(a,ef(a,b),b,c,null,null)};
of.u=function(a,b,c,d){return new od(a,b,c,d,null,null)};of.D=function(a,b,c,d,e){return new od(a,b,c,d,e,null)};of.A=5;sf;function tf(a,b,c,d,e){this.o=a;this.Ga=b;this.start=c;this.end=d;this.v=e;this.g=167666463;this.C=8192}h=tf.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.B(null,a)};h.O=function(a,b){return gb.c(this,b,null)};h.L=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};
h.$=function(a,b){return 0>b||this.end<=this.start+b?cf(b,this.end-this.start):G.a(this.Ga,this.start+b)};h.Aa=function(a,b,c){return 0>b||this.end<=this.start+b?c:G.c(this.Ga,this.start+b,c)};h.bb=function(a,b,c){var d=this.start+b;a=this.o;c=T.c(this.Ga,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return sf.D?sf.D(a,c,b,d,null):sf.call(null,a,c,b,d,null)};h.R=function(){return this.o};h.Z=function(){return this.end-this.start};h.$a=function(){return G.a(this.Ga,this.end-1)};
h.ab=function(){if(this.start===this.end)throw Error("Can't pop empty vector");var a=this.o,b=this.Ga,c=this.start,d=this.end-1;return sf.D?sf.D(a,b,c,d,null):sf.call(null,a,b,c,d,null)};h.P=function(){var a=this.v;return null!=a?a:this.v=a=Cc(this)};h.B=function(a,b){return Hc(this,b)};h.aa=function(){return Ic($c,this.o)};h.ca=function(a,b){return Mc(this,b)};h.da=function(a,b,c){return Oc(this,b,c)};
h.Wa=function(a,b,c){if("number"===typeof b)return tb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};h.U=function(){var a=this;return function(b){return function d(e){return e===a.end?null:Q(G.a(a.Ga,e),new Xd(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};h.S=function(a,b){return sf.D?sf.D(b,this.Ga,this.start,this.end,this.v):sf.call(null,b,this.Ga,this.start,this.end,this.v)};
h.Y=function(a,b){var c=this.o,d=tb(this.Ga,this.end,b),e=this.start,f=this.end+1;return sf.D?sf.D(c,d,e,f,null):sf.call(null,c,d,e,f,null)};h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.$(null,c);case 3:return this.Aa(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.$(null,c)};a.c=function(a,c,d){return this.Aa(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};
h.b=function(a){return this.$(null,a)};h.a=function(a,b){return this.Aa(null,a,b)};tf.prototype[Ra]=function(){return yc(this)};function sf(a,b,c,d,e){for(;;)if(b instanceof tf)c=b.start+c,d=b.start+d,b=b.Ga;else{var f=R(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new tf(a,b,c,d,e)}}
var rf=function rf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return rf.a(arguments[0],arguments[1]);case 3:return rf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};rf.a=function(a,b){return rf.c(a,b,R(a))};rf.c=function(a,b,c){return sf(null,a,b,c,null)};rf.A=3;function uf(a,b){return a===b.T?b:new Xe(a,Sa(b.f))}function jf(a){return new Xe({},Sa(a.f))}
function kf(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];rd(a,0,b,0,a.length);return b}var vf=function vf(b,c,d,e){d=uf(b.root.T,d);var f=b.l-1>>>c&31;if(5===c)b=e;else{var g=d.f[f];b=null!=g?vf(b,c-5,g,e):af(b.root.T,c-5,e)}d.f[f]=b;return d};function lf(a,b,c,d){this.l=a;this.shift=b;this.root=c;this.M=d;this.C=88;this.g=275}h=lf.prototype;
h.Bb=function(a,b){if(this.root.T){if(32>this.l-$e(this))this.M[this.l&31]=b;else{var c=new Xe(this.root.T,this.M),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.M=d;if(this.l>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=af(this.root.T,this.shift,c);this.root=new Xe(this.root.T,d);this.shift=e}else this.root=vf(this,this.shift,this.root,c)}this.l+=1;return this}throw Error("conj! after persistent!");};h.Cb=function(){if(this.root.T){this.root.T=null;var a=this.l-$e(this),b=Array(a);rd(this.M,0,b,0,a);return new W(null,this.l,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
h.Ab=function(a,b,c){if("number"===typeof b)return Qb(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
h.hc=function(a,b,c){var d=this;if(d.root.T){if(0<=b&&b<d.l)return $e(this)<=b?d.M[b&31]=c:(a=function(){return function f(a,k){var l=uf(d.root.T,k);if(0===a)l.f[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.l)return Mb(this,c);throw Error([B("Index "),B(b),B(" out of bounds for TransientVector of length"),B(d.l)].join(""));}throw Error("assoc! after persistent!");};
h.Z=function(){if(this.root.T)return this.l;throw Error("count after persistent!");};h.$=function(a,b){if(this.root.T)return ef(this,b)[b&31];throw Error("nth after persistent!");};h.Aa=function(a,b,c){return 0<=b&&b<this.l?G.a(this,b):c};h.O=function(a,b){return gb.c(this,b,null)};h.L=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.O(null,c);case 3:return this.L(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.O(null,c)};a.c=function(a,c,d){return this.L(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};h.b=function(a){return this.O(null,a)};h.a=function(a,b){return this.L(null,a,b)};function wf(){this.g=2097152;this.C=0}
wf.prototype.equiv=function(a){return this.B(null,a)};wf.prototype.B=function(){return!1};var xf=new wf;function yf(a,b){return ud(kd(b)?R(a)===R(b)?re(Bd,U.a(function(a){return kc.a(H.c(b,J(a),xf),J(M(a)))},a)):null:null)}function zf(a,b,c,d,e){this.m=a;this.Pc=b;this.cc=c;this.Ic=d;this.oc=e}zf.prototype.va=function(){var a=this.m<this.cc;return a?a:this.oc.va()};zf.prototype.next=function(){if(this.m<this.cc){var a=bd(this.Ic,this.m);this.m+=1;return new W(null,2,5,X,[a,gb.a(this.Pc,a)],null)}return this.oc.next()};
zf.prototype.remove=function(){return Error("Unsupported operation")};function Af(a){this.H=a}Af.prototype.next=function(){if(null!=this.H){var a=J(this.H),b=S(a,0),a=S(a,1);this.H=M(this.H);return{value:[b,a],done:!1}}return{value:null,done:!0}};function Bf(a){return new Af(w(a))}function Cf(a){this.H=a}Cf.prototype.next=function(){if(null!=this.H){var a=J(this.H);this.H=M(this.H);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function Df(a,b){var c;if(b instanceof y)a:{c=a.length;for(var d=b.Ia,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof y&&d===a[e].Ia){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof jc)a:for(c=a.length,d=b.Sa,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof jc&&d===a[e].Sa){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(kc.a(b,a[d])){c=d;break a}d+=2}return c}Ef;function Ff(a,b,c){this.f=a;this.m=b;this.za=c;this.g=32374990;this.C=0}h=Ff.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.B(null,a)};h.R=function(){return this.za};h.ta=function(){return this.m<this.f.length-2?new Ff(this.f,this.m+2,this.za):null};h.Z=function(){return(this.f.length-this.m)/2};h.P=function(){return Cc(this)};h.B=function(a,b){return Hc(this,b)};
h.aa=function(){return Ic(L,this.za)};h.ca=function(a,b){return Yc.a(b,this)};h.da=function(a,b,c){return Yc.c(b,c,this)};h.ea=function(){return new W(null,2,5,X,[this.f[this.m],this.f[this.m+1]],null)};h.ua=function(){return this.m<this.f.length-2?new Ff(this.f,this.m+2,this.za):L};h.U=function(){return this};h.S=function(a,b){return new Ff(this.f,this.m,b)};h.Y=function(a,b){return Q(b,this)};Ff.prototype[Ra]=function(){return yc(this)};Gf;Hf;function If(a,b,c){this.f=a;this.m=b;this.l=c}
If.prototype.va=function(){return this.m<this.l};If.prototype.next=function(){var a=new W(null,2,5,X,[this.f[this.m],this.f[this.m+1]],null);this.m+=2;return a};function q(a,b,c,d){this.o=a;this.l=b;this.f=c;this.v=d;this.g=16647951;this.C=8196}h=q.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.B(null,a)};h.keys=function(){return yc(Gf.b?Gf.b(this):Gf.call(null,this))};h.entries=function(){return Bf(w(this))};
h.values=function(){return yc(Hf.b?Hf.b(this):Hf.call(null,this))};h.has=function(a){return vd(this,a)};h.get=function(a,b){return this.L(null,a,b)};h.forEach=function(a){for(var b=w(this),c=null,d=0,e=0;;)if(e<d){var f=c.$(null,e),g=S(f,0),f=S(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=w(b))pd(b)?(c=Ub(b),b=Vb(b),g=c,d=R(c),c=g):(c=J(b),g=S(c,0),f=S(c,1),a.a?a.a(f,g):a.call(null,f,g),b=M(b),c=null,d=0),e=0;else return null};h.O=function(a,b){return gb.c(this,b,null)};
h.L=function(a,b,c){a=Df(this.f,b);return-1===a?c:this.f[a+1]};h.Ha=function(){return new If(this.f,0,2*this.l)};h.R=function(){return this.o};h.Z=function(){return this.l};h.P=function(){var a=this.v;return null!=a?a:this.v=a=Fc(this)};h.B=function(a,b){if(null!=b&&(b.g&1024||b.vc)){var c=this.f.length;if(this.l===b.Z(null))for(var d=0;;)if(d<c){var e=b.L(null,this.f[d],sd);if(e!==sd)if(kc.a(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return yf(this,b)};
h.lb=function(){return new Ef({},this.f.length,Sa(this.f))};h.aa=function(){return yb(pe,this.o)};h.ca=function(a,b){return Yc.a(b,this)};h.da=function(a,b,c){return Yc.c(b,c,this)};h.Lb=function(a,b){if(0<=Df(this.f,b)){var c=this.f.length,d=c-2;if(0===d)return Xa(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new q(this.o,this.l-1,d,null);kc.a(b,this.f[e])||(d[f]=this.f[e],d[f+1]=this.f[e+1],f+=2);e+=2}}else return this};
h.Wa=function(a,b,c){a=Df(this.f,b);if(-1===a){if(this.l<Jf){a=this.f;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new q(this.o,this.l+1,e,null)}return yb(ib(Qe(Kf,this),b,c),this.o)}if(c===this.f[a+1])return this;b=Sa(this.f);b[a+1]=c;return new q(this.o,this.l,b,null)};h.Ub=function(a,b){return-1!==Df(this.f,b)};h.U=function(){var a=this.f;return 0<=a.length-2?new Ff(a,0,null):null};h.S=function(a,b){return new q(b,this.l,this.f,this.v)};
h.Y=function(a,b){if(md(b))return ib(this,G.a(b,0),G.a(b,1));for(var c=this,d=w(b);;){if(null==d)return c;var e=J(d);if(md(e))c=ib(c,G.a(e,0),G.a(e,1)),d=M(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.O(null,c);case 3:return this.L(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.O(null,c)};a.c=function(a,c,d){return this.L(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};h.b=function(a){return this.O(null,a)};h.a=function(a,b){return this.L(null,a,b)};var pe=new q(null,0,[],Gc),Jf=8;q.prototype[Ra]=function(){return yc(this)};
Lf;function Ef(a,b,c){this.mb=a;this.hb=b;this.f=c;this.g=258;this.C=56}h=Ef.prototype;h.Z=function(){if(x(this.mb))return Jd(this.hb);throw Error("count after persistent!");};h.O=function(a,b){return gb.c(this,b,null)};h.L=function(a,b,c){if(x(this.mb))return a=Df(this.f,b),-1===a?c:this.f[a+1];throw Error("lookup after persistent!");};
h.Bb=function(a,b){if(x(this.mb)){if(null!=b?b.g&2048||b.wc||(b.g?0:Oa(mb,b)):Oa(mb,b))return Pb(this,Nd.b?Nd.b(b):Nd.call(null,b),Od.b?Od.b(b):Od.call(null,b));for(var c=w(b),d=this;;){var e=J(c);if(x(e))c=M(c),d=Pb(d,Nd.b?Nd.b(e):Nd.call(null,e),Od.b?Od.b(e):Od.call(null,e));else return d}}else throw Error("conj! after persistent!");};h.Cb=function(){if(x(this.mb))return this.mb=!1,new q(null,Jd(this.hb),this.f,null);throw Error("persistent! called twice");};
h.Ab=function(a,b,c){if(x(this.mb)){a=Df(this.f,b);if(-1===a){if(this.hb+2<=2*Jf)return this.hb+=2,this.f.push(b),this.f.push(c),this;a=Lf.a?Lf.a(this.hb,this.f):Lf.call(null,this.hb,this.f);return Pb(a,b,c)}c!==this.f[a+1]&&(this.f[a+1]=c);return this}throw Error("assoc! after persistent!");};Mf;cd;function Lf(a,b){for(var c=Lb(Kf),d=0;;)if(d<a)c=Pb(c,b[d],b[d+1]),d+=2;else return c}function Nf(){this.G=!1}Of;Pf;De;Qf;ze;P;function Rf(a,b){return a===b?!0:Vd(a,b)?!0:kc.a(a,b)}
function Sf(a,b,c){a=Sa(a);a[b]=c;return a}function Tf(a,b){var c=Array(a.length-2);rd(a,0,c,0,2*b);rd(a,2*(b+1),c,2*b,c.length-2*b);return c}function Uf(a,b,c,d){a=a.eb(b);a.f[c]=d;return a}Vf;function Wf(a,b,c,d){this.f=a;this.m=b;this.Jb=c;this.La=d}Wf.prototype.advance=function(){for(var a=this.f.length;;)if(this.m<a){var b=this.f[this.m],c=this.f[this.m+1];null!=b?b=this.Jb=new W(null,2,5,X,[b,c],null):null!=c?(b=ac(c),b=b.va()?this.La=b:!1):b=!1;this.m+=2;if(b)return!0}else return!1};
Wf.prototype.va=function(){var a=null!=this.Jb;return a?a:(a=null!=this.La)?a:this.advance()};Wf.prototype.next=function(){if(null!=this.Jb){var a=this.Jb;this.Jb=null;return a}if(null!=this.La)return a=this.La.next(),this.La.va()||(this.La=null),a;if(this.advance())return this.next();throw Error("No such element");};Wf.prototype.remove=function(){return Error("Unsupported operation")};function Xf(a,b,c){this.T=a;this.V=b;this.f=c}h=Xf.prototype;
h.eb=function(a){if(a===this.T)return this;var b=Kd(this.V),c=Array(0>b?4:2*(b+1));rd(this.f,0,c,0,2*b);return new Xf(a,this.V,c)};h.Gb=function(){return Of.b?Of.b(this.f):Of.call(null,this.f)};h.Xa=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.V&e))return d;var f=Kd(this.V&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.Xa(a+5,b,c,d):Rf(c,e)?f:d};
h.Ka=function(a,b,c,d,e,f){var g=1<<(c>>>b&31),k=Kd(this.V&g-1);if(0===(this.V&g)){var l=Kd(this.V);if(2*l<this.f.length){a=this.eb(a);b=a.f;f.G=!0;a:for(c=2*(l-k),f=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*k]=d;b[2*k+1]=e;a.V|=g;return a}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>b&31]=Yf.Ka(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.V>>>d&1)&&(k[d]=null!=this.f[e]?Yf.Ka(a,b+5,qc(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new Vf(a,l+1,k)}b=Array(2*(l+4));rd(this.f,0,b,0,2*k);b[2*k]=d;b[2*k+1]=e;rd(this.f,2*k,b,2*(k+1),2*(l-k));f.G=!0;a=this.eb(a);a.f=b;a.V|=g;return a}l=this.f[2*k];g=this.f[2*k+1];if(null==l)return l=g.Ka(a,b+5,c,d,e,f),l===g?this:Uf(this,a,2*k+1,l);if(Rf(d,l))return e===g?this:Uf(this,a,2*k+1,e);f.G=!0;f=b+5;d=Qf.ba?Qf.ba(a,f,l,g,c,d,e):Qf.call(null,a,f,l,g,c,d,e);e=2*
k;k=2*k+1;a=this.eb(a);a.f[e]=null;a.f[k]=d;return a};
h.Ja=function(a,b,c,d,e){var f=1<<(b>>>a&31),g=Kd(this.V&f-1);if(0===(this.V&f)){var k=Kd(this.V);if(16<=k){g=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];g[b>>>a&31]=Yf.Ja(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.V>>>c&1)&&(g[c]=null!=this.f[d]?Yf.Ja(a+5,qc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new Vf(null,k+1,g)}a=Array(2*(k+1));rd(this.f,
0,a,0,2*g);a[2*g]=c;a[2*g+1]=d;rd(this.f,2*g,a,2*(g+1),2*(k-g));e.G=!0;return new Xf(null,this.V|f,a)}var l=this.f[2*g],f=this.f[2*g+1];if(null==l)return k=f.Ja(a+5,b,c,d,e),k===f?this:new Xf(null,this.V,Sf(this.f,2*g+1,k));if(Rf(c,l))return d===f?this:new Xf(null,this.V,Sf(this.f,2*g+1,d));e.G=!0;e=this.V;k=this.f;a+=5;a=Qf.W?Qf.W(a,l,f,b,c,d):Qf.call(null,a,l,f,b,c,d);c=2*g;g=2*g+1;d=Sa(k);d[c]=null;d[g]=a;return new Xf(null,e,d)};
h.Hb=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.V&d))return this;var e=Kd(this.V&d-1),f=this.f[2*e],g=this.f[2*e+1];return null==f?(a=g.Hb(a+5,b,c),a===g?this:null!=a?new Xf(null,this.V,Sf(this.f,2*e+1,a)):this.V===d?null:new Xf(null,this.V^d,Tf(this.f,e))):Rf(c,f)?new Xf(null,this.V^d,Tf(this.f,e)):this};h.Ha=function(){return new Wf(this.f,0,null,null)};var Yf=new Xf(null,0,[]);function Zf(a,b,c){this.f=a;this.m=b;this.La=c}
Zf.prototype.va=function(){for(var a=this.f.length;;){if(null!=this.La&&this.La.va())return!0;if(this.m<a){var b=this.f[this.m];this.m+=1;null!=b&&(this.La=ac(b))}else return!1}};Zf.prototype.next=function(){if(this.va())return this.La.next();throw Error("No such element");};Zf.prototype.remove=function(){return Error("Unsupported operation")};function Vf(a,b,c){this.T=a;this.l=b;this.f=c}h=Vf.prototype;h.eb=function(a){return a===this.T?this:new Vf(a,this.l,Sa(this.f))};
h.Gb=function(){return Pf.b?Pf.b(this.f):Pf.call(null,this.f)};h.Xa=function(a,b,c,d){var e=this.f[b>>>a&31];return null!=e?e.Xa(a+5,b,c,d):d};h.Ka=function(a,b,c,d,e,f){var g=c>>>b&31,k=this.f[g];if(null==k)return a=Uf(this,a,g,Yf.Ka(a,b+5,c,d,e,f)),a.l+=1,a;b=k.Ka(a,b+5,c,d,e,f);return b===k?this:Uf(this,a,g,b)};
h.Ja=function(a,b,c,d,e){var f=b>>>a&31,g=this.f[f];if(null==g)return new Vf(null,this.l+1,Sf(this.f,f,Yf.Ja(a+5,b,c,d,e)));a=g.Ja(a+5,b,c,d,e);return a===g?this:new Vf(null,this.l,Sf(this.f,f,a))};
h.Hb=function(a,b,c){var d=b>>>a&31,e=this.f[d];if(null!=e){a=e.Hb(a+5,b,c);if(a===e)d=this;else if(null==a)if(8>=this.l)a:{e=this.f;a=e.length;b=Array(2*(this.l-1));c=0;for(var f=1,g=0;;)if(c<a)c!==d&&null!=e[c]&&(b[f]=e[c],f+=2,g|=1<<c),c+=1;else{d=new Xf(null,g,b);break a}}else d=new Vf(null,this.l-1,Sf(this.f,d,a));else d=new Vf(null,this.l,Sf(this.f,d,a));return d}return this};h.Ha=function(){return new Zf(this.f,0,null)};
function $f(a,b,c){b*=2;for(var d=0;;)if(d<b){if(Rf(c,a[d]))return d;d+=2}else return-1}function ag(a,b,c,d){this.T=a;this.Ua=b;this.l=c;this.f=d}h=ag.prototype;h.eb=function(a){if(a===this.T)return this;var b=Array(2*(this.l+1));rd(this.f,0,b,0,2*this.l);return new ag(a,this.Ua,this.l,b)};h.Gb=function(){return Of.b?Of.b(this.f):Of.call(null,this.f)};h.Xa=function(a,b,c,d){a=$f(this.f,this.l,c);return 0>a?d:Rf(c,this.f[a])?this.f[a+1]:d};
h.Ka=function(a,b,c,d,e,f){if(c===this.Ua){b=$f(this.f,this.l,d);if(-1===b){if(this.f.length>2*this.l)return b=2*this.l,c=2*this.l+1,a=this.eb(a),a.f[b]=d,a.f[c]=e,f.G=!0,a.l+=1,a;c=this.f.length;b=Array(c+2);rd(this.f,0,b,0,c);b[c]=d;b[c+1]=e;f.G=!0;d=this.l+1;a===this.T?(this.f=b,this.l=d,a=this):a=new ag(this.T,this.Ua,d,b);return a}return this.f[b+1]===e?this:Uf(this,a,b+1,e)}return(new Xf(a,1<<(this.Ua>>>b&31),[null,this,null,null])).Ka(a,b,c,d,e,f)};
h.Ja=function(a,b,c,d,e){return b===this.Ua?(a=$f(this.f,this.l,c),-1===a?(a=2*this.l,b=Array(a+2),rd(this.f,0,b,0,a),b[a]=c,b[a+1]=d,e.G=!0,new ag(null,this.Ua,this.l+1,b)):kc.a(this.f[a],d)?this:new ag(null,this.Ua,this.l,Sf(this.f,a+1,d))):(new Xf(null,1<<(this.Ua>>>a&31),[null,this])).Ja(a,b,c,d,e)};h.Hb=function(a,b,c){a=$f(this.f,this.l,c);return-1===a?this:1===this.l?null:new ag(null,this.Ua,this.l-1,Tf(this.f,Jd(a)))};h.Ha=function(){return new Wf(this.f,0,null,null)};
var Qf=function Qf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return Qf.W(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return Qf.ba(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
Qf.W=function(a,b,c,d,e,f){var g=qc(b);if(g===d)return new ag(null,g,2,[b,c,e,f]);var k=new Nf;return Yf.Ja(a,g,b,c,k).Ja(a,d,e,f,k)};Qf.ba=function(a,b,c,d,e,f,g){var k=qc(c);if(k===e)return new ag(null,k,2,[c,d,f,g]);var l=new Nf;return Yf.Ka(a,b,k,c,d,l).Ka(a,b,e,f,g,l)};Qf.A=7;function bg(a,b,c,d,e){this.o=a;this.Ya=b;this.m=c;this.H=d;this.v=e;this.g=32374860;this.C=0}h=bg.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.B(null,a)};h.R=function(){return this.o};
h.P=function(){var a=this.v;return null!=a?a:this.v=a=Cc(this)};h.B=function(a,b){return Hc(this,b)};h.aa=function(){return Ic(L,this.o)};h.ca=function(a,b){return Yc.a(b,this)};h.da=function(a,b,c){return Yc.c(b,c,this)};h.ea=function(){return null==this.H?new W(null,2,5,X,[this.Ya[this.m],this.Ya[this.m+1]],null):J(this.H)};
h.ua=function(){if(null==this.H){var a=this.Ya,b=this.m+2;return Of.c?Of.c(a,b,null):Of.call(null,a,b,null)}var a=this.Ya,b=this.m,c=M(this.H);return Of.c?Of.c(a,b,c):Of.call(null,a,b,c)};h.U=function(){return this};h.S=function(a,b){return new bg(b,this.Ya,this.m,this.H,this.v)};h.Y=function(a,b){return Q(b,this)};bg.prototype[Ra]=function(){return yc(this)};
var Of=function Of(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Of.b(arguments[0]);case 3:return Of.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};Of.b=function(a){return Of.c(a,0,null)};
Of.c=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new bg(null,a,b,null,null);var d=a[b+1];if(x(d)&&(d=d.Gb(),x(d)))return new bg(null,a,b+2,d,null);b+=2}else return null;else return new bg(null,a,b,c,null)};Of.A=3;function cg(a,b,c,d,e){this.o=a;this.Ya=b;this.m=c;this.H=d;this.v=e;this.g=32374860;this.C=0}h=cg.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.B(null,a)};h.R=function(){return this.o};
h.P=function(){var a=this.v;return null!=a?a:this.v=a=Cc(this)};h.B=function(a,b){return Hc(this,b)};h.aa=function(){return Ic(L,this.o)};h.ca=function(a,b){return Yc.a(b,this)};h.da=function(a,b,c){return Yc.c(b,c,this)};h.ea=function(){return J(this.H)};h.ua=function(){var a=this.Ya,b=this.m,c=M(this.H);return Pf.u?Pf.u(null,a,b,c):Pf.call(null,null,a,b,c)};h.U=function(){return this};h.S=function(a,b){return new cg(b,this.Ya,this.m,this.H,this.v)};h.Y=function(a,b){return Q(b,this)};
cg.prototype[Ra]=function(){return yc(this)};var Pf=function Pf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Pf.b(arguments[0]);case 4:return Pf.u(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};Pf.b=function(a){return Pf.u(null,a,0,null)};
Pf.u=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(x(e)&&(e=e.Gb(),x(e)))return new cg(a,b,c+1,e,null);c+=1}else return null;else return new cg(a,b,c,d,null)};Pf.A=4;Mf;function dg(a,b,c){this.Ba=a;this.pc=b;this.bc=c}dg.prototype.va=function(){return this.bc&&this.pc.va()};dg.prototype.next=function(){if(this.bc)return this.pc.next();this.bc=!0;return this.Ba};dg.prototype.remove=function(){return Error("Unsupported operation")};
function cd(a,b,c,d,e,f){this.o=a;this.l=b;this.root=c;this.xa=d;this.Ba=e;this.v=f;this.g=16123663;this.C=8196}h=cd.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.B(null,a)};h.keys=function(){return yc(Gf.b?Gf.b(this):Gf.call(null,this))};h.entries=function(){return Bf(w(this))};h.values=function(){return yc(Hf.b?Hf.b(this):Hf.call(null,this))};h.has=function(a){return vd(this,a)};h.get=function(a,b){return this.L(null,a,b)};
h.forEach=function(a){for(var b=w(this),c=null,d=0,e=0;;)if(e<d){var f=c.$(null,e),g=S(f,0),f=S(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=w(b))pd(b)?(c=Ub(b),b=Vb(b),g=c,d=R(c),c=g):(c=J(b),g=S(c,0),f=S(c,1),a.a?a.a(f,g):a.call(null,f,g),b=M(b),c=null,d=0),e=0;else return null};h.O=function(a,b){return gb.c(this,b,null)};h.L=function(a,b,c){return null==b?this.xa?this.Ba:c:null==this.root?c:this.root.Xa(0,qc(b),b,c)};
h.Ha=function(){var a=this.root?ac(this.root):le;return this.xa?new dg(this.Ba,a,!1):a};h.R=function(){return this.o};h.Z=function(){return this.l};h.P=function(){var a=this.v;return null!=a?a:this.v=a=Fc(this)};h.B=function(a,b){return yf(this,b)};h.lb=function(){return new Mf({},this.root,this.l,this.xa,this.Ba)};h.aa=function(){return yb(Kf,this.o)};
h.Lb=function(a,b){if(null==b)return this.xa?new cd(this.o,this.l-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.Hb(0,qc(b),b);return c===this.root?this:new cd(this.o,this.l-1,c,this.xa,this.Ba,null)};h.Wa=function(a,b,c){if(null==b)return this.xa&&c===this.Ba?this:new cd(this.o,this.xa?this.l:this.l+1,this.root,!0,c,null);a=new Nf;b=(null==this.root?Yf:this.root).Ja(0,qc(b),b,c,a);return b===this.root?this:new cd(this.o,a.G?this.l+1:this.l,b,this.xa,this.Ba,null)};
h.Ub=function(a,b){return null==b?this.xa:null==this.root?!1:this.root.Xa(0,qc(b),b,sd)!==sd};h.U=function(){if(0<this.l){var a=null!=this.root?this.root.Gb():null;return this.xa?Q(new W(null,2,5,X,[null,this.Ba],null),a):a}return null};h.S=function(a,b){return new cd(b,this.l,this.root,this.xa,this.Ba,this.v)};
h.Y=function(a,b){if(md(b))return ib(this,G.a(b,0),G.a(b,1));for(var c=this,d=w(b);;){if(null==d)return c;var e=J(d);if(md(e))c=ib(c,G.a(e,0),G.a(e,1)),d=M(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.O(null,c);case 3:return this.L(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.O(null,c)};a.c=function(a,c,d){return this.L(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};h.b=function(a){return this.O(null,a)};h.a=function(a,b){return this.L(null,a,b)};var Kf=new cd(null,0,null,!1,null,Gc);
function dd(a,b){for(var c=a.length,d=0,e=Lb(Kf);;)if(d<c)var f=d+1,e=e.Ab(null,a[d],b[d]),d=f;else return Ob(e)}cd.prototype[Ra]=function(){return yc(this)};function Mf(a,b,c,d,e){this.T=a;this.root=b;this.count=c;this.xa=d;this.Ba=e;this.g=258;this.C=56}function eg(a,b,c){if(a.T){if(null==b)a.Ba!==c&&(a.Ba=c),a.xa||(a.count+=1,a.xa=!0);else{var d=new Nf;b=(null==a.root?Yf:a.root).Ka(a.T,0,qc(b),b,c,d);b!==a.root&&(a.root=b);d.G&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}h=Mf.prototype;
h.Z=function(){if(this.T)return this.count;throw Error("count after persistent!");};h.O=function(a,b){return null==b?this.xa?this.Ba:null:null==this.root?null:this.root.Xa(0,qc(b),b)};h.L=function(a,b,c){return null==b?this.xa?this.Ba:c:null==this.root?c:this.root.Xa(0,qc(b),b,c)};
h.Bb=function(a,b){var c;a:if(this.T)if(null!=b?b.g&2048||b.wc||(b.g?0:Oa(mb,b)):Oa(mb,b))c=eg(this,Nd.b?Nd.b(b):Nd.call(null,b),Od.b?Od.b(b):Od.call(null,b));else{c=w(b);for(var d=this;;){var e=J(c);if(x(e))c=M(c),d=eg(d,Nd.b?Nd.b(e):Nd.call(null,e),Od.b?Od.b(e):Od.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};h.Cb=function(){var a;if(this.T)this.T=null,a=new cd(null,this.count,this.root,this.xa,this.Ba,null);else throw Error("persistent! called twice");return a};
h.Ab=function(a,b,c){return eg(this,b,c)};fg;gg;function gg(a,b,c,d,e){this.key=a;this.G=b;this.left=c;this.right=d;this.v=e;this.g=32402207;this.C=0}h=gg.prototype;h.replace=function(a,b,c,d){return new gg(a,b,c,d,null)};h.O=function(a,b){return G.c(this,b,null)};h.L=function(a,b,c){return G.c(this,b,c)};h.$=function(a,b){return 0===b?this.key:1===b?this.G:null};h.Aa=function(a,b,c){return 0===b?this.key:1===b?this.G:c};
h.bb=function(a,b,c){return(new W(null,2,5,X,[this.key,this.G],null)).bb(null,b,c)};h.R=function(){return null};h.Z=function(){return 2};h.wb=function(){return this.key};h.xb=function(){return this.G};h.$a=function(){return this.G};h.ab=function(){return new W(null,1,5,X,[this.key],null)};h.P=function(){var a=this.v;return null!=a?a:this.v=a=Cc(this)};h.B=function(a,b){return Hc(this,b)};h.aa=function(){return $c};h.ca=function(a,b){return Mc(this,b)};h.da=function(a,b,c){return Oc(this,b,c)};
h.Wa=function(a,b,c){return T.c(new W(null,2,5,X,[this.key,this.G],null),b,c)};h.U=function(){return Za(Za(L,this.G),this.key)};h.S=function(a,b){return Ic(new W(null,2,5,X,[this.key,this.G],null),b)};h.Y=function(a,b){return new W(null,3,5,X,[this.key,this.G,b],null)};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.O(null,c);case 3:return this.L(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.O(null,c)};a.c=function(a,c,d){return this.L(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};h.b=function(a){return this.O(null,a)};h.a=function(a,b){return this.L(null,a,b)};gg.prototype[Ra]=function(){return yc(this)};
function fg(a,b,c,d,e){this.key=a;this.G=b;this.left=c;this.right=d;this.v=e;this.g=32402207;this.C=0}h=fg.prototype;h.replace=function(a,b,c,d){return new fg(a,b,c,d,null)};h.O=function(a,b){return G.c(this,b,null)};h.L=function(a,b,c){return G.c(this,b,c)};h.$=function(a,b){return 0===b?this.key:1===b?this.G:null};h.Aa=function(a,b,c){return 0===b?this.key:1===b?this.G:c};h.bb=function(a,b,c){return(new W(null,2,5,X,[this.key,this.G],null)).bb(null,b,c)};h.R=function(){return null};h.Z=function(){return 2};
h.wb=function(){return this.key};h.xb=function(){return this.G};h.$a=function(){return this.G};h.ab=function(){return new W(null,1,5,X,[this.key],null)};h.P=function(){var a=this.v;return null!=a?a:this.v=a=Cc(this)};h.B=function(a,b){return Hc(this,b)};h.aa=function(){return $c};h.ca=function(a,b){return Mc(this,b)};h.da=function(a,b,c){return Oc(this,b,c)};h.Wa=function(a,b,c){return T.c(new W(null,2,5,X,[this.key,this.G],null),b,c)};h.U=function(){return Za(Za(L,this.G),this.key)};
h.S=function(a,b){return Ic(new W(null,2,5,X,[this.key,this.G],null),b)};h.Y=function(a,b){return new W(null,3,5,X,[this.key,this.G,b],null)};h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.O(null,c);case 3:return this.L(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.O(null,c)};a.c=function(a,c,d){return this.L(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};
h.b=function(a){return this.O(null,a)};h.a=function(a,b){return this.L(null,a,b)};fg.prototype[Ra]=function(){return yc(this)};Nd;var N=function N(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return N.j(0<c.length?new Ja(c.slice(0),0):null)};N.j=function(a){for(var b=w(a),c=Lb(Kf);;)if(b){a=M(M(b));var d=J(b),b=J(M(b)),c=Pb(c,d,b),b=a}else return Ob(c)};N.A=0;N.F=function(a){return N.j(w(a))};function hg(a,b){this.I=a;this.za=b;this.g=32374988;this.C=0}h=hg.prototype;
h.toString=function(){return cc(this)};h.equiv=function(a){return this.B(null,a)};h.R=function(){return this.za};h.ta=function(){var a=(null!=this.I?this.I.g&128||this.I.Mb||(this.I.g?0:Oa(db,this.I)):Oa(db,this.I))?this.I.ta(null):M(this.I);return null==a?null:new hg(a,this.za)};h.P=function(){return Cc(this)};h.B=function(a,b){return Hc(this,b)};h.aa=function(){return Ic(L,this.za)};h.ca=function(a,b){return Yc.a(b,this)};h.da=function(a,b,c){return Yc.c(b,c,this)};h.ea=function(){return this.I.ea(null).wb(null)};
h.ua=function(){var a=(null!=this.I?this.I.g&128||this.I.Mb||(this.I.g?0:Oa(db,this.I)):Oa(db,this.I))?this.I.ta(null):M(this.I);return null!=a?new hg(a,this.za):L};h.U=function(){return this};h.S=function(a,b){return new hg(this.I,b)};h.Y=function(a,b){return Q(b,this)};hg.prototype[Ra]=function(){return yc(this)};function Gf(a){return(a=w(a))?new hg(a,null):null}function Nd(a){return nb(a)}function ig(a,b){this.I=a;this.za=b;this.g=32374988;this.C=0}h=ig.prototype;h.toString=function(){return cc(this)};
h.equiv=function(a){return this.B(null,a)};h.R=function(){return this.za};h.ta=function(){var a=(null!=this.I?this.I.g&128||this.I.Mb||(this.I.g?0:Oa(db,this.I)):Oa(db,this.I))?this.I.ta(null):M(this.I);return null==a?null:new ig(a,this.za)};h.P=function(){return Cc(this)};h.B=function(a,b){return Hc(this,b)};h.aa=function(){return Ic(L,this.za)};h.ca=function(a,b){return Yc.a(b,this)};h.da=function(a,b,c){return Yc.c(b,c,this)};h.ea=function(){return this.I.ea(null).xb(null)};
h.ua=function(){var a=(null!=this.I?this.I.g&128||this.I.Mb||(this.I.g?0:Oa(db,this.I)):Oa(db,this.I))?this.I.ta(null):M(this.I);return null!=a?new ig(a,this.za):L};h.U=function(){return this};h.S=function(a,b){return new ig(this.I,b)};h.Y=function(a,b){return Q(b,this)};ig.prototype[Ra]=function(){return yc(this)};function Hf(a){return(a=w(a))?new ig(a,null):null}function Od(a){return ob(a)}
var jg=function jg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return jg.j(0<c.length?new Ja(c.slice(0),0):null)};jg.j=function(a){return x(se(Bd,a))?Ta.a(function(a,c){return Zc.a(x(a)?a:pe,c)},a):null};jg.A=0;jg.F=function(a){return jg.j(w(a))};var kg=function kg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return kg.j(arguments[0],1<c.length?new Ja(c.slice(1),0):null)};
kg.j=function(a,b){return x(se(Bd,b))?Ta.a(function(a){return function(b,e){return Ta.c(a,x(b)?b:pe,w(e))}}(function(b,d){var e=J(d),f=J(M(d));return vd(b,e)?T.c(b,e,function(){var d=H.a(b,e);return a.a?a.a(d,f):a.call(null,d,f)}()):T.c(b,e,f)}),b):null};kg.A=1;kg.F=function(a){var b=J(a);a=M(a);return kg.j(b,a)};function lg(a){for(var b=pe,c=w(new W(null,1,5,X,[mg],null));;)if(c)var d=J(c),e=H.c(a,d,ng),b=kc.a(e,ng)?b:T.c(b,d,e),c=M(c);else return Ic(b,gd(a))}og;function pg(a){this.ob=a}
pg.prototype.va=function(){return this.ob.va()};pg.prototype.next=function(){if(this.ob.va())return this.ob.next().M[0];throw Error("No such element");};pg.prototype.remove=function(){return Error("Unsupported operation")};function qg(a,b,c){this.o=a;this.fb=b;this.v=c;this.g=15077647;this.C=8196}h=qg.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.B(null,a)};h.keys=function(){return yc(w(this))};h.entries=function(){var a=w(this);return new Cf(w(a))};h.values=function(){return yc(w(this))};
h.has=function(a){return vd(this,a)};h.forEach=function(a){for(var b=w(this),c=null,d=0,e=0;;)if(e<d){var f=c.$(null,e),g=S(f,0),f=S(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=w(b))pd(b)?(c=Ub(b),b=Vb(b),g=c,d=R(c),c=g):(c=J(b),g=S(c,0),f=S(c,1),a.a?a.a(f,g):a.call(null,f,g),b=M(b),c=null,d=0),e=0;else return null};h.O=function(a,b){return gb.c(this,b,null)};h.L=function(a,b,c){return hb(this.fb,b)?b:c};h.Ha=function(){return new pg(ac(this.fb))};h.R=function(){return this.o};h.Z=function(){return Wa(this.fb)};
h.P=function(){var a=this.v;return null!=a?a:this.v=a=Fc(this)};h.B=function(a,b){return id(b)&&R(this)===R(b)&&re(function(a){return function(b){return vd(a,b)}}(this),b)};h.lb=function(){return new og(Lb(this.fb))};h.aa=function(){return Ic(rg,this.o)};h.U=function(){return Gf(this.fb)};h.S=function(a,b){return new qg(b,this.fb,this.v)};h.Y=function(a,b){return new qg(this.o,T.c(this.fb,b,null),null)};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.O(null,c);case 3:return this.L(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.O(null,c)};a.c=function(a,c,d){return this.L(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};h.b=function(a){return this.O(null,a)};h.a=function(a,b){return this.L(null,a,b)};var rg=new qg(null,pe,Gc);
function sg(a){var b=a.length;if(b<=Jf)for(var c=0,d=Lb(pe);;)if(c<b)var e=c+1,d=Pb(d,a[c],null),c=e;else return new qg(null,Ob(d),null);else for(c=0,d=Lb(rg);;)if(c<b)e=c+1,d=Mb(d,a[c]),c=e;else return Ob(d)}qg.prototype[Ra]=function(){return yc(this)};function og(a){this.Va=a;this.C=136;this.g=259}h=og.prototype;h.Bb=function(a,b){this.Va=Pb(this.Va,b,null);return this};h.Cb=function(){return new qg(null,Ob(this.Va),null)};h.Z=function(){return R(this.Va)};h.O=function(a,b){return gb.c(this,b,null)};
h.L=function(a,b,c){return gb.c(this.Va,b,sd)===sd?c:b};h.call=function(){function a(a,b,c){return gb.c(this.Va,b,sd)===sd?c:b}function b(a,b){return gb.c(this.Va,b,sd)===sd?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};h.b=function(a){return gb.c(this.Va,a,sd)===sd?null:a};
h.a=function(a,b){return gb.c(this.Va,a,sd)===sd?b:a};function Md(a){if(null!=a&&(a.C&4096||a.yc))return a.yb(null);if("string"===typeof a)return a;throw Error([B("Doesn't support name: "),B(a)].join(""));}function tg(a,b){for(var c=Lb(pe),d=w(a),e=w(b);;)if(d&&e)var f=J(d),g=J(e),c=Pb(c,f,g),d=M(d),e=M(e);else return Ob(c)}function ug(a,b,c){this.m=a;this.end=b;this.step=c}ug.prototype.va=function(){return 0<this.step?this.m<this.end:this.m>this.end};
ug.prototype.next=function(){var a=this.m;this.m+=this.step;return a};function vg(a,b,c,d,e){this.o=a;this.start=b;this.end=c;this.step=d;this.v=e;this.g=32375006;this.C=8192}h=vg.prototype;h.toString=function(){return cc(this)};h.equiv=function(a){return this.B(null,a)};h.$=function(a,b){if(b<Wa(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};
h.Aa=function(a,b,c){return b<Wa(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};h.Ha=function(){return new ug(this.start,this.end,this.step)};h.R=function(){return this.o};h.ta=function(){return 0<this.step?this.start+this.step<this.end?new vg(this.o,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new vg(this.o,this.start+this.step,this.end,this.step,null):null};h.Z=function(){return Na(Eb(this))?0:Math.ceil((this.end-this.start)/this.step)};
h.P=function(){var a=this.v;return null!=a?a:this.v=a=Cc(this)};h.B=function(a,b){return Hc(this,b)};h.aa=function(){return Ic(L,this.o)};h.ca=function(a,b){return Mc(this,b)};h.da=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){c=b.a?b.a(c,a):b.call(null,c,a);if(Lc(c))return P.b?P.b(c):P.call(null,c);a+=this.step}else return c};h.ea=function(){return null==Eb(this)?null:this.start};
h.ua=function(){return null!=Eb(this)?new vg(this.o,this.start+this.step,this.end,this.step,null):L};h.U=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};h.S=function(a,b){return new vg(b,this.start,this.end,this.step,this.v)};h.Y=function(a,b){return Q(b,this)};vg.prototype[Ra]=function(){return yc(this)};
function wg(a,b){return function(){function c(c,d,e){return new W(null,2,5,X,[a.c?a.c(c,d,e):a.call(null,c,d,e),b.c?b.c(c,d,e):b.call(null,c,d,e)],null)}function d(c,d){return new W(null,2,5,X,[a.a?a.a(c,d):a.call(null,c,d),b.a?b.a(c,d):b.call(null,c,d)],null)}function e(c){return new W(null,2,5,X,[a.b?a.b(c):a.call(null,c),b.b?b.b(c):b.call(null,c)],null)}function f(){return new W(null,2,5,X,[a.s?a.s():a.call(null),b.s?b.s():b.call(null)],null)}var g=null,k=function(){function c(a,b,e,f){var g=null;
if(3<arguments.length){for(var g=0,k=Array(arguments.length-3);g<k.length;)k[g]=arguments[g+3],++g;g=new Ja(k,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return new W(null,2,5,X,[D.D(a,c,e,f,g),D.D(b,c,e,f,g)],null)}c.A=3;c.F=function(a){var b=J(a);a=M(a);var c=J(a);a=M(a);var e=J(a);a=wc(a);return d(b,c,e,a)};c.j=d;return c}(),g=function(a,b,g,r){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);
default:var t=null;if(3<arguments.length){for(var t=0,u=Array(arguments.length-3);t<u.length;)u[t]=arguments[t+3],++t;t=new Ja(u,0)}return k.j(a,b,g,t)}throw Error("Invalid arity: "+arguments.length);};g.A=3;g.F=k.F;g.s=f;g.b=e;g.a=d;g.c=c;g.j=k.j;return g}()}function xg(a){a:for(var b=a;;)if(w(b))b=M(b);else break a;return a}
function mf(a,b,c,d,e,f,g){var k=wa;wa=null==wa?null:wa-1;try{if(null!=wa&&0>wa)return Ib(a,"#");Ib(a,c);if(0===Ga.b(f))w(g)&&Ib(a,function(){var a=yg.b(f);return x(a)?a:"..."}());else{if(w(g)){var l=J(g);b.c?b.c(l,a,f):b.call(null,l,a,f)}for(var m=M(g),n=Ga.b(f)-1;;)if(!m||null!=n&&0===n){w(m)&&0===n&&(Ib(a,d),Ib(a,function(){var a=yg.b(f);return x(a)?a:"..."}()));break}else{Ib(a,d);var r=J(m);c=a;g=f;b.c?b.c(r,c,g):b.call(null,r,c,g);var t=M(m);c=n-1;m=t;n=c}}return Ib(a,e)}finally{wa=k}}
function zg(a,b){for(var c=w(b),d=null,e=0,f=0;;)if(f<e){var g=d.$(null,f);Ib(a,g);f+=1}else if(c=w(c))d=c,pd(d)?(c=Ub(d),e=Vb(d),d=c,g=R(c),c=e,e=g):(g=J(d),Ib(a,g),c=M(d),d=null,e=0),f=0;else return null}var Ag={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Bg(a){return[B('"'),B(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Ag[a]})),B('"')].join("")}Cg;
function Dg(a,b){var c=ud(H.a(a,Ea));return c?(c=null!=b?b.g&131072||b.xc?!0:!1:!1)?null!=gd(b):c:c}
function Eg(a,b,c){if(null==a)return Ib(b,"nil");if(Dg(c,a)){Ib(b,"^");var d=gd(a);nf.c?nf.c(d,b,c):nf.call(null,d,b,c);Ib(b," ")}if(a.Db)return a.Pb(a,b,c);if(null!=a&&(a.g&2147483648||a.X))return a.N(null,b,c);if(!0===a||!1===a||"number"===typeof a)return Ib(b,""+B(a));if(null!=a&&a.constructor===Object)return Ib(b,"#js "),d=U.a(function(b){return new W(null,2,5,X,[Wd.b(b),a[b]],null)},qd(a)),Cg.u?Cg.u(d,nf,b,c):Cg.call(null,d,nf,b,c);if(Ma(a))return mf(b,nf,"#js ["," ","]",c,a);if("string"==typeof a)return x(Da.b(c))?
Ib(b,Bg(a)):Ib(b,a);if("function"==p(a)){var e=a.name;c=x(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return zg(b,uc(["#object[",c,' "',""+B(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+B(a);;)if(R(c)<b)c=[B("0"),B(c)].join("");else return c},zg(b,uc(['#inst "',""+B(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),
3),"-",'00:00"'],0));if(a instanceof RegExp)return zg(b,uc(['#"',a.source,'"'],0));if(null!=a&&(a.g&2147483648||a.X))return Jb(a,b,c);if(x(a.constructor.cb))return zg(b,uc(["#object[",a.constructor.cb.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=x(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return zg(b,uc(["#object[",c," ",""+B(a),"]"],0))}function nf(a,b,c){var d=Fg.b(c);return x(d)?(c=T.c(c,Gg,Eg),d.c?d.c(a,b,c):d.call(null,a,b,c)):Eg(a,b,c)}
var Ce=function Ce(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Ce.j(0<c.length?new Ja(c.slice(0),0):null)};Ce.j=function(a){var b=ya();if(null==a||Na(w(a)))b="";else{var c=B,d=new ka;a:{var e=new bc(d);nf(J(a),e,b);a=w(M(a));for(var f=null,g=0,k=0;;)if(k<g){var l=f.$(null,k);Ib(e," ");nf(l,e,b);k+=1}else if(a=w(a))f=a,pd(f)?(a=Ub(f),g=Vb(f),f=a,l=R(a),a=g,g=l):(l=J(f),Ib(e," "),nf(l,e,b),a=M(f),f=null,g=0),k=0;else break a}b=""+c(d)}return b};Ce.A=0;
Ce.F=function(a){return Ce.j(w(a))};function Cg(a,b,c,d){return mf(c,function(a,c,d){var k=nb(a);b.c?b.c(k,c,d):b.call(null,k,c,d);Ib(c," ");a=ob(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,w(a))}Fe.prototype.X=!0;Fe.prototype.N=function(a,b,c){Ib(b,"#object [cljs.core.Volatile ");nf(new q(null,1,[Hg,this.state],null),b,c);return Ib(b,"]")};Ja.prototype.X=!0;Ja.prototype.N=function(a,b,c){return mf(b,nf,"("," ",")",c,this)};Xd.prototype.X=!0;
Xd.prototype.N=function(a,b,c){return mf(b,nf,"("," ",")",c,this)};bg.prototype.X=!0;bg.prototype.N=function(a,b,c){return mf(b,nf,"("," ",")",c,this)};gg.prototype.X=!0;gg.prototype.N=function(a,b,c){return mf(b,nf,"["," ","]",c,this)};Ff.prototype.X=!0;Ff.prototype.N=function(a,b,c){return mf(b,nf,"("," ",")",c,this)};Ac.prototype.X=!0;Ac.prototype.N=function(a,b,c){return mf(b,nf,"("," ",")",c,this)};od.prototype.X=!0;od.prototype.N=function(a,b,c){return mf(b,nf,"("," ",")",c,this)};
Td.prototype.X=!0;Td.prototype.N=function(a,b,c){return mf(b,nf,"("," ",")",c,this)};Tc.prototype.X=!0;Tc.prototype.N=function(a,b,c){return mf(b,nf,"("," ",")",c,this)};cd.prototype.X=!0;cd.prototype.N=function(a,b,c){return Cg(this,nf,b,c)};cg.prototype.X=!0;cg.prototype.N=function(a,b,c){return mf(b,nf,"("," ",")",c,this)};tf.prototype.X=!0;tf.prototype.N=function(a,b,c){return mf(b,nf,"["," ","]",c,this)};qg.prototype.X=!0;qg.prototype.N=function(a,b,c){return mf(b,nf,"#{"," ","}",c,this)};
nd.prototype.X=!0;nd.prototype.N=function(a,b,c){return mf(b,nf,"("," ",")",c,this)};ye.prototype.X=!0;ye.prototype.N=function(a,b,c){Ib(b,"#object [cljs.core.Atom ");nf(new q(null,1,[Hg,this.state],null),b,c);return Ib(b,"]")};ig.prototype.X=!0;ig.prototype.N=function(a,b,c){return mf(b,nf,"("," ",")",c,this)};fg.prototype.X=!0;fg.prototype.N=function(a,b,c){return mf(b,nf,"["," ","]",c,this)};W.prototype.X=!0;W.prototype.N=function(a,b,c){return mf(b,nf,"["," ","]",c,this)};Sd.prototype.X=!0;
Sd.prototype.N=function(a,b){return Ib(b,"()")};qe.prototype.X=!0;qe.prototype.N=function(a,b,c){return mf(b,nf,"("," ",")",c,this)};q.prototype.X=!0;q.prototype.N=function(a,b,c){return Cg(this,nf,b,c)};vg.prototype.X=!0;vg.prototype.N=function(a,b,c){return mf(b,nf,"("," ",")",c,this)};hg.prototype.X=!0;hg.prototype.N=function(a,b,c){return mf(b,nf,"("," ",")",c,this)};Uc.prototype.X=!0;Uc.prototype.N=function(a,b,c){return mf(b,nf,"("," ",")",c,this)};jc.prototype.tb=!0;
jc.prototype.kb=function(a,b){if(b instanceof jc)return sc(this,b);throw Error([B("Cannot compare "),B(this),B(" to "),B(b)].join(""));};y.prototype.tb=!0;y.prototype.kb=function(a,b){if(b instanceof y)return Ud(this,b);throw Error([B("Cannot compare "),B(this),B(" to "),B(b)].join(""));};tf.prototype.tb=!0;tf.prototype.kb=function(a,b){if(md(b))return wd(this,b);throw Error([B("Cannot compare "),B(this),B(" to "),B(b)].join(""));};W.prototype.tb=!0;
W.prototype.kb=function(a,b){if(md(b))return wd(this,b);throw Error([B("Cannot compare "),B(this),B(" to "),B(b)].join(""));};var Ig=null;function Jg(a){null==Ig&&(Ig=ze.b?ze.b(0):ze.call(null,0));return tc.b([B(a),B(Ee.a(Ig,Jc))].join(""))}function Kg(a){return function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return Lc(d)?new Kc(d):d}}
function Le(a){return function(b){return function(){function c(a,c){return Ta.c(b,a,c)}function d(b){return a.b?a.b(b):a.call(null,b)}function e(){return a.s?a.s():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.s=e;f.b=d;f.a=c;return f}()}(Kg(a))}Lg;function Mg(){}
var Ng=function Ng(b){if(null!=b&&null!=b.uc)return b.uc(b);var c=Ng[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Ng._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("IEncodeJS.-clj-\x3ejs",b);};Og;function Pg(a){return(null!=a?a.tc||(a.Gc?0:Oa(Mg,a)):Oa(Mg,a))?Ng(a):"string"===typeof a||"number"===typeof a||a instanceof y||a instanceof jc?Og.b?Og.b(a):Og.call(null,a):Ce.j(uc([a],0))}
var Og=function Og(b){if(null==b)return null;if(null!=b?b.tc||(b.Gc?0:Oa(Mg,b)):Oa(Mg,b))return Ng(b);if(b instanceof y)return Md(b);if(b instanceof jc)return""+B(b);if(kd(b)){var c={};b=w(b);for(var d=null,e=0,f=0;;)if(f<e){var g=d.$(null,f),k=S(g,0),g=S(g,1);c[Pg(k)]=Og(g);f+=1}else if(b=w(b))pd(b)?(e=Ub(b),b=Vb(b),d=e,e=R(e)):(e=J(b),d=S(e,0),e=S(e,1),c[Pg(d)]=Og(e),b=M(b),d=null,e=0),f=0;else break;return c}if(hd(b)){c=[];b=w(U.a(Og,b));d=null;for(f=e=0;;)if(f<e)k=d.$(null,f),c.push(k),f+=1;else if(b=
w(b))d=b,pd(d)?(b=Ub(d),f=Vb(d),d=b,e=R(b),b=f):(b=J(d),c.push(b),b=M(d),d=null,e=0),f=0;else break;return c}return b},Lg=function Lg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Lg.s();case 1:return Lg.b(arguments[0]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};Lg.s=function(){return Lg.b(1)};Lg.b=function(a){return Math.random()*a};Lg.A=1;var Qg=null;
function Rg(){if(null==Qg){var a=new q(null,3,[Tg,pe,Ug,pe,Vg,pe],null);Qg=ze.b?ze.b(a):ze.call(null,a)}return Qg}function Wg(a,b,c){var d=kc.a(b,c);if(!d&&!(d=vd(Vg.b(a).call(null,b),c))&&(d=md(c))&&(d=md(b)))if(d=R(c)===R(b))for(var d=!0,e=0;;)if(d&&e!==R(c))d=Wg(a,b.b?b.b(e):b.call(null,e),c.b?c.b(e):c.call(null,e)),e+=1;else return d;else return d;else return d}function Xg(a){var b;b=Rg();b=P.b?P.b(b):P.call(null,b);return ke(H.a(Tg.b(b),a))}
function Yg(a,b,c,d){Ee.a(a,function(){return P.b?P.b(b):P.call(null,b)});Ee.a(c,function(){return P.b?P.b(d):P.call(null,d)})}var Zg=function Zg(b,c,d){var e=(P.b?P.b(d):P.call(null,d)).call(null,b),e=x(x(e)?e.b?e.b(c):e.call(null,c):e)?!0:null;if(x(e))return e;e=function(){for(var e=Xg(c);;)if(0<R(e))Zg(b,J(e),d),e=wc(e);else return null}();if(x(e))return e;e=function(){for(var e=Xg(b);;)if(0<R(e))Zg(J(e),c,d),e=wc(e);else return null}();return x(e)?e:!1};
function $g(a,b,c){c=Zg(a,b,c);if(x(c))a=c;else{c=Wg;var d;d=Rg();d=P.b?P.b(d):P.call(null,d);a=c(d,a,b)}return a}
var ah=function ah(b,c,d,e,f,g,k){var l=Ta.c(function(e,g){var k=S(g,0);S(g,1);if(Wg(P.b?P.b(d):P.call(null,d),c,k)){var l;l=(l=null==e)?l:$g(k,J(e),f);l=x(l)?g:e;if(!x($g(J(l),k,f)))throw Error([B("Multiple methods in multimethod '"),B(b),B("' match dispatch value: "),B(c),B(" -\x3e "),B(k),B(" and "),B(J(l)),B(", and neither is preferred")].join(""));return l}return e},null,P.b?P.b(e):P.call(null,e));if(x(l)){if(kc.a(P.b?P.b(k):P.call(null,k),P.b?P.b(d):P.call(null,d)))return Ee.u(g,T,c,J(M(l))),
J(M(l));Yg(g,e,k,d);return ah(b,c,d,e,f,g,k)}return null};function bh(a,b){throw Error([B("No method in multimethod '"),B(a),B("' for dispatch value: "),B(b)].join(""));}function ch(a,b,c,d,e,f,g,k){this.name=a;this.i=b;this.Hc=c;this.Fb=d;this.pb=e;this.Oc=f;this.Ib=g;this.sb=k;this.g=4194305;this.C=4352}h=ch.prototype;
h.call=function(){function a(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K,V){a=this;var oa=D.j(a.i,b,c,d,e,uc([f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K,V],0)),hj=dh(this,oa);x(hj)||bh(a.name,oa);return D.j(hj,b,c,d,e,uc([f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K,V],0))}function b(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K){a=this;var V=a.i.qa?a.i.qa(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K):a.i.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K),oa=dh(this,V);x(oa)||bh(a.name,V);return oa.qa?oa.qa(b,c,d,e,f,g,k,l,m,n,r,t,
u,v,z,C,F,I,E,K):oa.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E,K)}function c(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E){a=this;var K=a.i.pa?a.i.pa(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E):a.i.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E),V=dh(this,K);x(V)||bh(a.name,K);return V.pa?V.pa(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E):V.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,E)}function d(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I){a=this;var E=a.i.oa?a.i.oa(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I):a.i.call(null,
b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I),K=dh(this,E);x(K)||bh(a.name,E);return K.oa?K.oa(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I):K.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I)}function e(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F){a=this;var I=a.i.na?a.i.na(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F):a.i.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F),E=dh(this,I);x(E)||bh(a.name,I);return E.na?E.na(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F):E.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F)}function f(a,b,c,d,e,f,g,k,l,m,n,r,t,u,
v,z,C){a=this;var F=a.i.ma?a.i.ma(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C):a.i.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C),I=dh(this,F);x(I)||bh(a.name,F);return I.ma?I.ma(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C):I.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C)}function g(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z){a=this;var C=a.i.la?a.i.la(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z):a.i.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z),F=dh(this,C);x(F)||bh(a.name,C);return F.la?F.la(b,c,d,e,f,g,k,l,m,n,r,t,u,v,z):F.call(null,b,c,d,e,f,g,k,l,m,n,r,
t,u,v,z)}function k(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v){a=this;var z=a.i.ka?a.i.ka(b,c,d,e,f,g,k,l,m,n,r,t,u,v):a.i.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v),C=dh(this,z);x(C)||bh(a.name,z);return C.ka?C.ka(b,c,d,e,f,g,k,l,m,n,r,t,u,v):C.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u,v)}function l(a,b,c,d,e,f,g,k,l,m,n,r,t,u){a=this;var v=a.i.ja?a.i.ja(b,c,d,e,f,g,k,l,m,n,r,t,u):a.i.call(null,b,c,d,e,f,g,k,l,m,n,r,t,u),z=dh(this,v);x(z)||bh(a.name,v);return z.ja?z.ja(b,c,d,e,f,g,k,l,m,n,r,t,u):z.call(null,b,c,d,e,f,
g,k,l,m,n,r,t,u)}function m(a,b,c,d,e,f,g,k,l,m,n,r,t){a=this;var u=a.i.ia?a.i.ia(b,c,d,e,f,g,k,l,m,n,r,t):a.i.call(null,b,c,d,e,f,g,k,l,m,n,r,t),v=dh(this,u);x(v)||bh(a.name,u);return v.ia?v.ia(b,c,d,e,f,g,k,l,m,n,r,t):v.call(null,b,c,d,e,f,g,k,l,m,n,r,t)}function n(a,b,c,d,e,f,g,k,l,m,n,r){a=this;var t=a.i.ha?a.i.ha(b,c,d,e,f,g,k,l,m,n,r):a.i.call(null,b,c,d,e,f,g,k,l,m,n,r),u=dh(this,t);x(u)||bh(a.name,t);return u.ha?u.ha(b,c,d,e,f,g,k,l,m,n,r):u.call(null,b,c,d,e,f,g,k,l,m,n,r)}function r(a,b,
c,d,e,f,g,k,l,m,n){a=this;var r=a.i.ga?a.i.ga(b,c,d,e,f,g,k,l,m,n):a.i.call(null,b,c,d,e,f,g,k,l,m,n),t=dh(this,r);x(t)||bh(a.name,r);return t.ga?t.ga(b,c,d,e,f,g,k,l,m,n):t.call(null,b,c,d,e,f,g,k,l,m,n)}function t(a,b,c,d,e,f,g,k,l,m){a=this;var n=a.i.sa?a.i.sa(b,c,d,e,f,g,k,l,m):a.i.call(null,b,c,d,e,f,g,k,l,m),r=dh(this,n);x(r)||bh(a.name,n);return r.sa?r.sa(b,c,d,e,f,g,k,l,m):r.call(null,b,c,d,e,f,g,k,l,m)}function u(a,b,c,d,e,f,g,k,l){a=this;var m=a.i.ra?a.i.ra(b,c,d,e,f,g,k,l):a.i.call(null,
b,c,d,e,f,g,k,l),n=dh(this,m);x(n)||bh(a.name,m);return n.ra?n.ra(b,c,d,e,f,g,k,l):n.call(null,b,c,d,e,f,g,k,l)}function v(a,b,c,d,e,f,g,k){a=this;var l=a.i.ba?a.i.ba(b,c,d,e,f,g,k):a.i.call(null,b,c,d,e,f,g,k),m=dh(this,l);x(m)||bh(a.name,l);return m.ba?m.ba(b,c,d,e,f,g,k):m.call(null,b,c,d,e,f,g,k)}function z(a,b,c,d,e,f,g){a=this;var k=a.i.W?a.i.W(b,c,d,e,f,g):a.i.call(null,b,c,d,e,f,g),l=dh(this,k);x(l)||bh(a.name,k);return l.W?l.W(b,c,d,e,f,g):l.call(null,b,c,d,e,f,g)}function C(a,b,c,d,e,f){a=
this;var g=a.i.D?a.i.D(b,c,d,e,f):a.i.call(null,b,c,d,e,f),k=dh(this,g);x(k)||bh(a.name,g);return k.D?k.D(b,c,d,e,f):k.call(null,b,c,d,e,f)}function F(a,b,c,d,e){a=this;var f=a.i.u?a.i.u(b,c,d,e):a.i.call(null,b,c,d,e),g=dh(this,f);x(g)||bh(a.name,f);return g.u?g.u(b,c,d,e):g.call(null,b,c,d,e)}function I(a,b,c,d){a=this;var e=a.i.c?a.i.c(b,c,d):a.i.call(null,b,c,d),f=dh(this,e);x(f)||bh(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function K(a,b,c){a=this;var d=a.i.a?a.i.a(b,c):a.i.call(null,
b,c),e=dh(this,d);x(e)||bh(a.name,d);return e.a?e.a(b,c):e.call(null,b,c)}function V(a,b){a=this;var c=a.i.b?a.i.b(b):a.i.call(null,b),d=dh(this,c);x(d)||bh(a.name,c);return d.b?d.b(b):d.call(null,b)}function oa(a){a=this;var b=a.i.s?a.i.s():a.i.call(null),c=dh(this,b);x(c)||bh(a.name,b);return c.s?c.s():c.call(null)}var E=null,E=function(E,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua,Dc,fb,lb,vb,Nb,nc,Nc,Ed,Ae,Sg){switch(arguments.length){case 1:return oa.call(this,E);case 2:return V.call(this,E,O);case 3:return K.call(this,
E,O,da);case 4:return I.call(this,E,O,da,ha);case 5:return F.call(this,E,O,da,ha,la);case 6:return C.call(this,E,O,da,ha,la,ma);case 7:return z.call(this,E,O,da,ha,la,ma,va);case 8:return v.call(this,E,O,da,ha,la,ma,va,za);case 9:return u.call(this,E,O,da,ha,la,ma,va,za,Aa);case 10:return t.call(this,E,O,da,ha,la,ma,va,za,Aa,Ba);case 11:return r.call(this,E,O,da,ha,la,ma,va,za,Aa,Ba,Pa);case 12:return n.call(this,E,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua);case 13:return m.call(this,E,O,da,ha,la,ma,va,za,
Aa,Ba,Pa,Ua,Dc);case 14:return l.call(this,E,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua,Dc,fb);case 15:return k.call(this,E,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua,Dc,fb,lb);case 16:return g.call(this,E,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua,Dc,fb,lb,vb);case 17:return f.call(this,E,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua,Dc,fb,lb,vb,Nb);case 18:return e.call(this,E,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua,Dc,fb,lb,vb,Nb,nc);case 19:return d.call(this,E,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua,Dc,fb,lb,vb,Nb,nc,Nc);case 20:return c.call(this,E,O,da,
ha,la,ma,va,za,Aa,Ba,Pa,Ua,Dc,fb,lb,vb,Nb,nc,Nc,Ed);case 21:return b.call(this,E,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua,Dc,fb,lb,vb,Nb,nc,Nc,Ed,Ae);case 22:return a.call(this,E,O,da,ha,la,ma,va,za,Aa,Ba,Pa,Ua,Dc,fb,lb,vb,Nb,nc,Nc,Ed,Ae,Sg)}throw Error("Invalid arity: "+arguments.length);};E.b=oa;E.a=V;E.c=K;E.u=I;E.D=F;E.W=C;E.ba=z;E.ra=v;E.sa=u;E.ga=t;E.ha=r;E.ia=n;E.ja=m;E.ka=l;E.la=k;E.ma=g;E.na=f;E.oa=e;E.pa=d;E.qa=c;E.Yb=b;E.vb=a;return E}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sa(b)))};
h.s=function(){var a=this.i.s?this.i.s():this.i.call(null),b=dh(this,a);x(b)||bh(this.name,a);return b.s?b.s():b.call(null)};h.b=function(a){var b=this.i.b?this.i.b(a):this.i.call(null,a),c=dh(this,b);x(c)||bh(this.name,b);return c.b?c.b(a):c.call(null,a)};h.a=function(a,b){var c=this.i.a?this.i.a(a,b):this.i.call(null,a,b),d=dh(this,c);x(d)||bh(this.name,c);return d.a?d.a(a,b):d.call(null,a,b)};
h.c=function(a,b,c){var d=this.i.c?this.i.c(a,b,c):this.i.call(null,a,b,c),e=dh(this,d);x(e)||bh(this.name,d);return e.c?e.c(a,b,c):e.call(null,a,b,c)};h.u=function(a,b,c,d){var e=this.i.u?this.i.u(a,b,c,d):this.i.call(null,a,b,c,d),f=dh(this,e);x(f)||bh(this.name,e);return f.u?f.u(a,b,c,d):f.call(null,a,b,c,d)};h.D=function(a,b,c,d,e){var f=this.i.D?this.i.D(a,b,c,d,e):this.i.call(null,a,b,c,d,e),g=dh(this,f);x(g)||bh(this.name,f);return g.D?g.D(a,b,c,d,e):g.call(null,a,b,c,d,e)};
h.W=function(a,b,c,d,e,f){var g=this.i.W?this.i.W(a,b,c,d,e,f):this.i.call(null,a,b,c,d,e,f),k=dh(this,g);x(k)||bh(this.name,g);return k.W?k.W(a,b,c,d,e,f):k.call(null,a,b,c,d,e,f)};h.ba=function(a,b,c,d,e,f,g){var k=this.i.ba?this.i.ba(a,b,c,d,e,f,g):this.i.call(null,a,b,c,d,e,f,g),l=dh(this,k);x(l)||bh(this.name,k);return l.ba?l.ba(a,b,c,d,e,f,g):l.call(null,a,b,c,d,e,f,g)};
h.ra=function(a,b,c,d,e,f,g,k){var l=this.i.ra?this.i.ra(a,b,c,d,e,f,g,k):this.i.call(null,a,b,c,d,e,f,g,k),m=dh(this,l);x(m)||bh(this.name,l);return m.ra?m.ra(a,b,c,d,e,f,g,k):m.call(null,a,b,c,d,e,f,g,k)};h.sa=function(a,b,c,d,e,f,g,k,l){var m=this.i.sa?this.i.sa(a,b,c,d,e,f,g,k,l):this.i.call(null,a,b,c,d,e,f,g,k,l),n=dh(this,m);x(n)||bh(this.name,m);return n.sa?n.sa(a,b,c,d,e,f,g,k,l):n.call(null,a,b,c,d,e,f,g,k,l)};
h.ga=function(a,b,c,d,e,f,g,k,l,m){var n=this.i.ga?this.i.ga(a,b,c,d,e,f,g,k,l,m):this.i.call(null,a,b,c,d,e,f,g,k,l,m),r=dh(this,n);x(r)||bh(this.name,n);return r.ga?r.ga(a,b,c,d,e,f,g,k,l,m):r.call(null,a,b,c,d,e,f,g,k,l,m)};h.ha=function(a,b,c,d,e,f,g,k,l,m,n){var r=this.i.ha?this.i.ha(a,b,c,d,e,f,g,k,l,m,n):this.i.call(null,a,b,c,d,e,f,g,k,l,m,n),t=dh(this,r);x(t)||bh(this.name,r);return t.ha?t.ha(a,b,c,d,e,f,g,k,l,m,n):t.call(null,a,b,c,d,e,f,g,k,l,m,n)};
h.ia=function(a,b,c,d,e,f,g,k,l,m,n,r){var t=this.i.ia?this.i.ia(a,b,c,d,e,f,g,k,l,m,n,r):this.i.call(null,a,b,c,d,e,f,g,k,l,m,n,r),u=dh(this,t);x(u)||bh(this.name,t);return u.ia?u.ia(a,b,c,d,e,f,g,k,l,m,n,r):u.call(null,a,b,c,d,e,f,g,k,l,m,n,r)};h.ja=function(a,b,c,d,e,f,g,k,l,m,n,r,t){var u=this.i.ja?this.i.ja(a,b,c,d,e,f,g,k,l,m,n,r,t):this.i.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t),v=dh(this,u);x(v)||bh(this.name,u);return v.ja?v.ja(a,b,c,d,e,f,g,k,l,m,n,r,t):v.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t)};
h.ka=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u){var v=this.i.ka?this.i.ka(a,b,c,d,e,f,g,k,l,m,n,r,t,u):this.i.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u),z=dh(this,v);x(z)||bh(this.name,v);return z.ka?z.ka(a,b,c,d,e,f,g,k,l,m,n,r,t,u):z.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u)};
h.la=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v){var z=this.i.la?this.i.la(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v):this.i.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v),C=dh(this,z);x(C)||bh(this.name,z);return C.la?C.la(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v):C.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v)};
h.ma=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z){var C=this.i.ma?this.i.ma(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z):this.i.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z),F=dh(this,C);x(F)||bh(this.name,C);return F.ma?F.ma(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z):F.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z)};
h.na=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C){var F=this.i.na?this.i.na(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C):this.i.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C),I=dh(this,F);x(I)||bh(this.name,F);return I.na?I.na(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C):I.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C)};
h.oa=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F){var I=this.i.oa?this.i.oa(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F):this.i.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F),K=dh(this,I);x(K)||bh(this.name,I);return K.oa?K.oa(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F):K.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F)};
h.pa=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I){var K=this.i.pa?this.i.pa(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I):this.i.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I),V=dh(this,K);x(V)||bh(this.name,K);return V.pa?V.pa(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I):V.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I)};
h.qa=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K){var V=this.i.qa?this.i.qa(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K):this.i.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K),oa=dh(this,V);x(oa)||bh(this.name,V);return oa.qa?oa.qa(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K):oa.call(null,a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K)};
h.Yb=function(a,b,c,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,V){var oa=D.j(this.i,a,b,c,d,uc([e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,V],0)),E=dh(this,oa);x(E)||bh(this.name,oa);return D.j(E,a,b,c,d,uc([e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,K,V],0))};function eh(a,b){var c=fh;Ee.u(c.pb,T,a,b);Yg(c.Ib,c.pb,c.sb,c.Fb)}
function dh(a,b){kc.a(P.b?P.b(a.sb):P.call(null,a.sb),P.b?P.b(a.Fb):P.call(null,a.Fb))||Yg(a.Ib,a.pb,a.sb,a.Fb);var c=(P.b?P.b(a.Ib):P.call(null,a.Ib)).call(null,b);if(x(c))return c;c=ah(a.name,b,a.Fb,a.pb,a.Oc,a.Ib,a.sb);return x(c)?c:(P.b?P.b(a.pb):P.call(null,a.pb)).call(null,a.Hc)}h.yb=function(){return Xb(this.name)};h.zb=function(){return Yb(this.name)};h.P=function(){return this[ba]||(this[ba]=++ea)};var Y=new y(null,"y","y",-1757859776),gh=new y(null,"role","role",-736691072),hh=new y(null,"description","description",-1428560544),ih=new y(null,"path","path",-188191168),jh=new y(null,"onmouseup","onmouseup",168100736),kh=new y(null,"d1","d1",-1264719807),lh=new y(null,"labels","labels",-626734591),mh=new y(null,"p2","p2",905500641),nh=new y(null,"min","min",444991522),oh=new y(null,"r","r",-471384190),ph=new y(null,"d2","d2",2138401859),qh=new y(null,"v","v",21465059),rh=new y(null,"show-labels?",
"show-labels?",-616006332),Ea=new y(null,"meta","meta",1499536964),sh=new y(null,"selected","selected",574897764),th=new y(null,"ul","ul",-1349521403),uh=new y(null,"f1","f1",1714532389),vh=new y(null,"color","color",1011675173),Fa=new y(null,"dup","dup",556298533),wh=new y(null,"add-point","add-point",-1861575067),xh=new y(null,"private","private",-558947994),yh=new y(null,"ray","ray",-972479417),zh=new y(null,"scale","scale",-230427353),Ah=new y(null,"button","button",1456579943),Bh=new y(null,
"holding","holding",1269510599),Be=new y(null,"validator","validator",-1966190681),Ch=new y(null,"redo","redo",501190664),Dh=new y(null,"parallel","parallel",-1863607128),Eh=new y(null,"default","default",-1987822328),Fh=new y(null,"finally-block","finally-block",832982472),Gh=new y(null,"grid","grid",402978600),Hh=new y(null,"strong","strong",269529E3),Ih=new y(null,"name","name",1843675177),Jh=new y(null,"li","li",723558921),Kh=new y(null,"value","value",305978217),Lh=new y(null,"section","section",
-300141526),Mh=new y(null,"tool","tool",-1298696470),Nh=new y(null,"circle","circle",1903212362),Oh=new y(null,"y1","y1",589123466),Ph=new y(null,"onclick","onclick",1297553739),Qh=new y(null,"line-segment","line-segment",-798085781),Rh=new y(null,"dy","dy",1719547243),Sh=new y(null,"release","release",-1534371381),Th=new y(null,"move","move",-2110884309),Uh=new y(null,"anti-history","anti-history",1855784523),Vh=new y(null,"hold","hold",-1621118005),Wh=new y(null,"history","history",-247395220),
Hg=new y(null,"val","val",128701612),Xh=new y(null,"recur","recur",-437573268),Yh=new y(null,"type","type",1174270348),Zh=new y(null,"colors","colors",1157174732),$h=new y(null,"draggable?","draggable?",-236042740),ai=new y(null,"catch-block","catch-block",1175212748),bi=new y(null,"loops","loops",-1766681555),ci=new y(null,"points","points",-1486596883),di=new y(null,"midset","midset",729550093),ei=new y(null,"perpendicular","perpendicular",-122487411),Gg=new y(null,"fallback-impl","fallback-impl",
-1501286995),Ca=new y(null,"flush-on-newline","flush-on-newline",-151457939),fi=new y(null,"r2","r2",252844174),gi=new y(null,"hyperbola","hyperbola",-396303090),hi=new y(null,"p1","p1",-936759954),ii=new y(null,"className","className",-1983287057),Ug=new y(null,"descendants","descendants",1824886031),ji=new y(null,"k","k",-2146297393),ki=new y(null,"no-op","no-op",-93046065),Vg=new y(null,"ancestors","ancestors",-776045424),li=new y(null,"div","div",1057191632),Da=new y(null,"readably","readably",
1129599760),mi=new jc(null,"box","box",-1123515375,null),yg=new y(null,"more-marker","more-marker",-14717935),ni=new y(null,"g","g",1738089905),oi=new y(null,"c","c",-1763192079),pi=new y(null,"defining-points","defining-points",384743506),qi=new y(null,"guides","guides",-1398390510),ri=new y(null,"undo","undo",-1818036302),si=new y(null,"line","line",212345235),ti=new jc(null,"val","val",1769233139,null),ui=new y(null,"r1","r1",690974900),Ga=new y(null,"print-length","print-length",1931866356),vi=
new y(null,"max","max",61366548),wi=new y(null,"f2","f2",396168596),xi=new y(null,"cx","cx",1272694324),yi=new y(null,"label","label",1718410804),zi=new y(null,"id","id",-1388402092),Ai=new y(null,"class","class",-2030961996),Bi=new y(null,"cy","cy",755331060),Ci=new y(null,"catch-exception","catch-exception",-1997306795),Tg=new y(null,"parents","parents",-2027538891),Di=new y(null,"onmousedown","onmousedown",-1118865611),Ei=new y(null,"parabola","parabola",-1319322731),Fi=new y(null,"prev","prev",
-1597069226),Gi=new y(null,"svg","svg",856789142),Hi=new y(null,"ellipse","ellipse",1135891702),Ii=new y(null,"continue-block","continue-block",-1852047850),Ji=new y(null,"sweeps","sweeps",941098264),Ki=new y(null,"d","d",1972142424),Li=new y(null,"f","f",-1597136552),Mi=new y(null,"point","point",1813198264),Ni=new y(null,"strokes","strokes",-1645650952),Z=new y(null,"x","x",2099068185),Oi=new y(null,"x1","x1",-1863922247),Pi=new y(null,"input","input",556931961),Qi=new y(null,"onmousemove","onmousemove",
341554202),oe=new jc(null,"quote","quote",1377916282,null),Ri=new y(null,"h1","h1",-1896887462),ne=new y(null,"arglists","arglists",1661989754),Si=new y(null,"y2","y2",-718691301),me=new jc(null,"nil-iter","nil-iter",1101030523,null),Ti=new y(null,"main","main",-2117802661),Ui=new y(null,"hierarchy","hierarchy",-1053470341),Vi=new y(null,"save-image","save-image",-2127892773),Fg=new y(null,"alt-impl","alt-impl",670969595),Wi=new jc(null,"fn-handler","fn-handler",648785851,null),Xi=new y(null,"selected?",
"selected?",-742502788),Yi=new y(null,"handler","handler",-195596612),Zi=new y(null,"step","step",1288888124),$i=new y(null,"grid-spacing","grid-spacing",1668963196),aj=new y(null,"mindist","mindist",1821140860),bj=new y(null,"p","p",151049309),cj=new y(null,"x2","x2",-1362513475),dj=new y(null,"show-labels","show-labels",41391613),ej=new y(null,"href","href",-793805698),fj=new y(null,"bisect","bisect",1224004862),gj=new y(null,"areas","areas",-1988969730),ij=new y(null,"a","a",-2123407586),jj=new y(null,
"select","select",1147833503),kj=new y(null,"clear","clear",1877104959),ng=new y("cljs.core","not-found","cljs.core/not-found",-1572889185),lj=new y(null,"foreignObject","foreignObject",25502111),mj=new y(null,"text","text",-1790561697),nj=new jc(null,"f","f",43394975,null),mg=new y(null,"shapes","shapes",1897594879);Ia();function oj(a,b){return jg.j(uc([b,new q(null,2,[zi,Jg(Md(a)),Yh,a],null)],0))}function pj(a,b){return function(c){return qj(a,b,new W(null,1,5,X,[c],null))}}function qj(a,b,c){return kc.a(R(b),R(c))?new W(null,2,5,X,[pj(a,b),oj(a,tg(b,c))],null):new W(null,1,5,X,[function(d){return qj(a,b,Zc.a(c,d))}],null)}
var rj=function rj(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return rj.b(arguments[0]);case 2:return rj.a(arguments[0],arguments[1]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};rj.b=function(a){return rj.a(Jg("mindist"),sg([a]))};rj.a=function(a,b){return new W(null,2,5,X,[function(c){return rj.a(a,Zc.a(b,c))},new q(null,3,[zi,a,Yh,aj,ci,b],null)],null)};rj.A=2;var sj=new W(null,3,5,X,["1st","2nd","3rd"],null);
function tj(a){return new W(null,3,5,X,[th,pe,function(){return function c(a){return new Xd(null,function(){for(;;){var e=w(a);if(e){if(pd(e)){var f=Ub(e),g=R(f),k=ae(g);a:for(var l=0;;)if(l<g){var m=G.a(f,l),n=S(m,0),m=S(m,1),n=new W(null,5,5,X,[Jh,pe,new W(null,3,5,X,[Hh,pe,[B(n),B(" point")].join("")],null)," \u2014 ",m],null);k.add(n);l+=1}else{f=!0;break a}return f?be(k.K(),c(Vb(e))):be(k.K(),null)}f=J(e);k=S(f,0);f=S(f,1);return Q(new W(null,5,5,X,[Jh,pe,new W(null,3,5,X,[Hh,pe,[B(k),B(" point")].join("")],
null)," \u2014 ",f],null),c(wc(e)))}return null}},null,null)}(U.c(qf,sj,a))}()],null)}
var vj=new W(null,13,5,X,[new q(null,4,[zi,Mi,Ih,"Point",Yi,function uj(){return new W(null,1,5,X,[uj],null)},hh,new W(null,3,5,X,[bj,pe,"Create a point."],null)],null),new q(null,4,[zi,si,Ih,"Line",Yi,pj(si,new W(null,2,5,X,[hi,mh],null)),hh,Za(Za(Za(L,new W(null,3,5,X,[bj,pe,"A line is the collinear set of points through two points."],null)),tj(uc(["the start of the line","the end of the line"],0))),new W(null,3,5,X,[bj,pe,"Create a line."],null))],null),new q(null,4,[zi,Qh,Ih,"Line Segment",Yi,
pj(Qh,new W(null,2,5,X,[hi,mh],null)),hh,Za(Za(Za(L,new W(null,3,5,X,[bj,pe,"A line segment is the set of points between two points."],null)),tj(uc(["the start of the line segment","the end of the line segment"],0))),new W(null,3,5,X,[bj,pe,"Create a line segment."],null))],null),new q(null,4,[zi,yh,Ih,"Ray",Yi,pj(yh,new W(null,2,5,X,[hi,mh],null)),hh,Za(Za(L,tj(uc(["the start of the ray","the line through which the ray passes"],0))),new W(null,3,5,X,[bj,pe,"Create a ray."],null))],null),new q(null,
4,[zi,Dh,Ih,"Parallel",Yi,pj(Dh,new W(null,3,5,X,[hi,mh,ji],null)),hh,Za(Za(L,tj(uc(["a point on the line","another point on the line","a point through which the parallel line passes"],0))),new W(null,3,5,X,[bj,pe,"Create a line parallel to the line between two points."],null))],null),new q(null,4,[zi,di,Ih,"Midset",Yi,pj(di,new W(null,2,5,X,[hi,mh],null)),hh,Za(Za(Za(L,new W(null,3,5,X,[bj,pe,"A midset is the set of points equidistant from two points."],null)),tj(uc(["the first point","the second point"],
0))),new W(null,3,5,X,[bj,pe,"Create a midset."],null))],null),new q(null,4,[zi,ei,Ih,"Perpendicular",Yi,pj(ei,new W(null,3,5,X,[hi,mh,ji],null)),hh,Za(Za(Za(L,new W(null,3,5,X,[bj,pe,"A perpendicular is the shortest line between a point and a line, extended indefinitely."],null)),tj(uc(["a point on the line","another point on the line","a point through which the perpendicular passes"],0))),new W(null,3,5,X,[bj,pe,"Create a perpendicular."],null))],null),new q(null,4,[zi,fj,Ih,"Bisect",Yi,pj(fj,new W(null,
3,5,X,[ui,qh,fi],null)),hh,Za(Za(L,tj(uc(["a point on the first ray","the vertex of the rays","a point on the second ray"],0))),new W(null,3,5,X,[bj,pe,"Show the line that bisects an angle."],null))],null),new q(null,4,[zi,Nh,Ih,"Circle",Yi,pj(Nh,new W(null,2,5,X,[oi,oh],null)),hh,Za(Za(Za(L,new W(null,3,5,X,[bj,pe,"A circle is the set of points a constant distance from another point."],null)),tj(uc(["the center of the circle","the point through which the circumference passes"],0))),new W(null,3,
5,X,[bj,pe,"Create a circle."],null))],null),new q(null,4,[zi,Hi,Ih,"Ellipse",Yi,pj(Hi,new W(null,3,5,X,[uh,wi,ji],null)),hh,Za(Za(Za(L,new W(null,3,5,X,[bj,pe,"An ellipse is the set of points a constant total distance from two points."],null)),tj(uc(["one focus","another focus","a point through which the circumference passes"],0))),new W(null,3,5,X,[bj,pe,"Create an ellipse."],null))],null),new q(null,4,[zi,Ei,Ih,"Parabola",Yi,pj(Ei,new W(null,3,5,X,[Li,kh,ph],null)),hh,Za(Za(Za(L,new W(null,3,5,
X,[bj,pe,"A parabola is the set of points equidistant from a point and a line."],null)),tj(uc(["the focus","a point on the directrix","another point on the directrix"],0))),new W(null,3,5,X,[bj,pe,"Create a parabola."],null))],null),new q(null,4,[zi,gi,Ih,"Hyperbola",Yi,pj(gi,new W(null,3,5,X,[uh,wi,ji],null)),hh,Za(Za(L,tj(uc(["a focus","another focus","a point that defines the ratio"],0))),new W(null,3,5,X,[bj,pe,"Create a hyperbola."],null))],null),new q(null,4,[zi,aj,Ih,"Minimum Distance",Yi,
rj,hh,Za(Za(L,new W(null,3,5,X,[bj,pe,"A minimum distance is the area that's the least sum total distance to more than one point."],null)),new W(null,3,5,X,[bj,pe,"Show the area with minimum total distance to multiple points."],null))],null)],null);var wj;a:{var xj=aa.navigator;if(xj){var yj=xj.userAgent;if(yj){wj=yj;break a}}wj=""};var zj,Aj=function Aj(b,c){if(null!=b&&null!=b.Zb)return b.Zb(0,c);var d=Aj[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Aj._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("ReadPort.take!",b);},Bj=function Bj(b,c,d){if(null!=b&&null!=b.Ob)return b.Ob(0,c,d);var e=Bj[p(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Bj._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw A("WritePort.put!",b);},Cj=function Cj(b){if(null!=b&&null!=b.Nb)return b.Nb();
var c=Cj[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Cj._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("Channel.close!",b);},Dj=function Dj(b){if(null!=b&&null!=b.mc)return!0;var c=Dj[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Dj._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("Handler.active?",b);},Ej=function Ej(b){if(null!=b&&null!=b.nc)return b.Fa;var c=Ej[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Ej._;if(null!=c)return c.b?
c.b(b):c.call(null,b);throw A("Handler.commit",b);},Fj=function Fj(b,c){if(null!=b&&null!=b.lc)return b.lc(0,c);var d=Fj[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Fj._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw A("Buffer.add!*",b);},Gj=function Gj(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Gj.b(arguments[0]);case 2:return Gj.a(arguments[0],arguments[1]);default:throw Error([B("Invalid arity: "),
B(c.length)].join(""));}};Gj.b=function(a){return a};Gj.a=function(a,b){return Fj(a,b)};Gj.A=2;var Hj,Ij=function Ij(b){"undefined"===typeof Hj&&(Hj=function(b,d,e){this.$b=b;this.Fa=d;this.Kc=e;this.g=393216;this.C=0},Hj.prototype.S=function(b,d){return new Hj(this.$b,this.Fa,d)},Hj.prototype.R=function(){return this.Kc},Hj.prototype.mc=function(){return!0},Hj.prototype.nc=function(){return this.Fa},Hj.ac=function(){return new W(null,3,5,X,[Ic(Wi,new q(null,2,[xh,!0,ne,ic(oe,ic(new W(null,1,5,X,[nj],null)))],null)),nj,ra.ad],null)},Hj.Db=!0,Hj.cb="cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers18913",
Hj.Pb=function(b,d){return Ib(d,"cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers18913")});return new Hj(Ij,b,pe)};function Jj(a){try{return a[0].call(null,a)}catch(b){throw b instanceof Object&&a[6].Nb(),b;}}function Kj(a,b,c){c=c.Zb(0,Ij(function(c){a[2]=c;a[1]=b;return Jj(a)}));return x(c)?(a[2]=P.b?P.b(c):P.call(null,c),a[1]=b,Xh):null}function Lj(a,b,c){b=b.Ob(0,c,Ij(function(b){a[2]=b;a[1]=16;return Jj(a)}));return x(b)?(a[2]=P.b?P.b(b):P.call(null,b),a[1]=16,Xh):null}
function Mj(a,b){var c=a[6];null!=b&&c.Ob(0,b,Ij(function(){return function(){return null}}(c)));c.Nb();return c}function Nj(a,b,c,d,e,f,g,k){this.Ma=a;this.Na=b;this.Pa=c;this.Oa=d;this.Ra=e;this.Ta=f;this.Da=g;this.v=k;this.g=2229667594;this.C=8192}h=Nj.prototype;h.O=function(a,b){return gb.c(this,b,null)};
h.L=function(a,b,c){switch(b instanceof y?b.Ia:null){case "catch-block":return this.Ma;case "catch-exception":return this.Na;case "finally-block":return this.Pa;case "continue-block":return this.Oa;case "prev":return this.Ra;default:return H.c(this.Da,b,c)}};
h.N=function(a,b,c){return mf(b,function(){return function(a){return mf(b,nf,""," ","",c,a)}}(this),"#cljs.core.async.impl.ioc-helpers.ExceptionFrame{",", ","}",c,ge.a(new W(null,5,5,X,[new W(null,2,5,X,[ai,this.Ma],null),new W(null,2,5,X,[Ci,this.Na],null),new W(null,2,5,X,[Fh,this.Pa],null),new W(null,2,5,X,[Ii,this.Oa],null),new W(null,2,5,X,[Fi,this.Ra],null)],null),this.Da))};h.Ha=function(){return new zf(0,this,5,new W(null,5,5,X,[ai,Ci,Fh,Ii,Fi],null),ac(this.Da))};h.R=function(){return this.Ta};
h.Z=function(){return 5+R(this.Da)};h.P=function(){var a=this.v;if(null!=a)return a;a:for(var a=0,b=w(this);;)if(b)var c=J(b),a=(a+(qc(Nd.b?Nd.b(c):Nd.call(null,c))^qc(Od.b?Od.b(c):Od.call(null,c))))%4503599627370496,b=M(b);else break a;return this.v=a};h.B=function(a,b){var c;c=x(b)?(c=this.constructor===b.constructor)?yf(this,b):c:b;return x(c)?!0:!1};
h.Lb=function(a,b){return vd(new qg(null,new q(null,5,[Fh,null,ai,null,Ci,null,Fi,null,Ii,null],null),null),b)?ed.a(Ic(Qe(pe,this),this.Ta),b):new Nj(this.Ma,this.Na,this.Pa,this.Oa,this.Ra,this.Ta,ke(ed.a(this.Da,b)),null)};
h.Wa=function(a,b,c){return x(Vd.a?Vd.a(ai,b):Vd.call(null,ai,b))?new Nj(c,this.Na,this.Pa,this.Oa,this.Ra,this.Ta,this.Da,null):x(Vd.a?Vd.a(Ci,b):Vd.call(null,Ci,b))?new Nj(this.Ma,c,this.Pa,this.Oa,this.Ra,this.Ta,this.Da,null):x(Vd.a?Vd.a(Fh,b):Vd.call(null,Fh,b))?new Nj(this.Ma,this.Na,c,this.Oa,this.Ra,this.Ta,this.Da,null):x(Vd.a?Vd.a(Ii,b):Vd.call(null,Ii,b))?new Nj(this.Ma,this.Na,this.Pa,c,this.Ra,this.Ta,this.Da,null):x(Vd.a?Vd.a(Fi,b):Vd.call(null,Fi,b))?new Nj(this.Ma,this.Na,this.Pa,
this.Oa,c,this.Ta,this.Da,null):new Nj(this.Ma,this.Na,this.Pa,this.Oa,this.Ra,this.Ta,T.c(this.Da,b,c),null)};h.U=function(){return w(ge.a(new W(null,5,5,X,[new W(null,2,5,X,[ai,this.Ma],null),new W(null,2,5,X,[Ci,this.Na],null),new W(null,2,5,X,[Fh,this.Pa],null),new W(null,2,5,X,[Ii,this.Oa],null),new W(null,2,5,X,[Fi,this.Ra],null)],null),this.Da))};h.S=function(a,b){return new Nj(this.Ma,this.Na,this.Pa,this.Oa,this.Ra,b,this.Da,this.v)};
h.Y=function(a,b){return md(b)?ib(this,G.a(b,0),G.a(b,1)):Ta.c(Za,this,b)};
function Oj(a){for(;;){var b=a[4],c=ai.b(b),d=Ci.b(b),e=a[5];if(x(function(){var a=e;return x(a)?Na(b):a}()))throw e;if(x(function(){var a=e;return x(a)?(a=c,x(a)?e instanceof d:a):a}())){a[1]=c;a[2]=e;a[5]=null;a[4]=T.j(b,ai,null,uc([Ci,null],0));break}if(x(function(){var a=e;return x(a)?Na(c)&&Na(Fh.b(b)):a}()))a[4]=Fi.b(b);else{if(x(function(){var a=e;return x(a)?(a=Na(c))?Fh.b(b):a:a}())){a[1]=Fh.b(b);a[4]=T.c(b,Fh,null);break}if(x(function(){var a=Na(e);return a?Fh.b(b):a}())){a[1]=Fh.b(b);a[4]=
T.c(b,Fh,null);break}if(Na(e)&&Na(Fh.b(b))){a[1]=Ii.b(b);a[4]=Fi.b(b);break}throw Error("No matching clause");}}};function Pj(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function Qj(a,b,c,d){this.head=a;this.M=b;this.length=c;this.f=d}Qj.prototype.pop=function(){if(0===this.length)return null;var a=this.f[this.M];this.f[this.M]=null;this.M=(this.M+1)%this.f.length;--this.length;return a};Qj.prototype.unshift=function(a){this.f[this.head]=a;this.head=(this.head+1)%this.f.length;this.length+=1;return null};function Rj(a,b){a.length+1===a.f.length&&a.resize();a.unshift(b)}
Qj.prototype.resize=function(){var a=Array(2*this.f.length);return this.M<this.head?(Pj(this.f,this.M,a,0,this.length),this.M=0,this.head=this.length,this.f=a):this.M>this.head?(Pj(this.f,this.M,a,0,this.f.length-this.M),Pj(this.f,0,a,this.f.length-this.M,this.head),this.M=0,this.head=this.length,this.f=a):this.M===this.head?(this.head=this.M=0,this.f=a):null};function Sj(a,b){for(var c=a.length,d=0;;)if(d<c){var e=a.pop();(b.b?b.b(e):b.call(null,e))&&a.unshift(e);d+=1}else break}
function Tj(a){return new Qj(0,0,0,Array(a))}function Uj(a,b){this.J=a;this.n=b;this.g=2;this.C=0}function Vj(a){return a.J.length===a.n}Uj.prototype.lc=function(a,b){Rj(this.J,b);return this};Uj.prototype.Z=function(){return this.J.length};var Wj;
function Xj(){var a=aa.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==wj.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ia(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==wj.indexOf("Trident")&&-1==wj.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.dc;c.dc=null;a()}};return function(a){d.next={dc:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=
document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var Yj=Tj(32),Zj=!1,ak=!1;bk;function ck(){Zj=!0;ak=!1;for(var a=0;;){var b=Yj.pop();if(null!=b&&(b.s?b.s():b.call(null),1024>a)){a+=1;continue}break}Zj=!1;return 0<Yj.length?bk.s?bk.s():bk.call(null):null}function bk(){var a=ak;if(x(x(a)?Zj:a))return null;ak=!0;"function"!=p(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(Wj||(Wj=Xj()),Wj(ck)):aa.setImmediate(ck)}function dk(a){Rj(Yj,a);bk()}function ek(a){setTimeout(a,30)};var fk,gk=function gk(b){"undefined"===typeof fk&&(fk=function(b,d,e){this.rc=b;this.G=d;this.Lc=e;this.g=425984;this.C=0},fk.prototype.S=function(b,d){return new fk(this.rc,this.G,d)},fk.prototype.R=function(){return this.Lc},fk.prototype.ub=function(){return this.G},fk.ac=function(){return new W(null,3,5,X,[Ic(mi,new q(null,1,[ne,ic(oe,ic(new W(null,1,5,X,[ti],null)))],null)),ti,ra.bd],null)},fk.Db=!0,fk.cb="cljs.core.async.impl.channels/t_cljs$core$async$impl$channels18976",fk.Pb=function(b,d){return Ib(d,
"cljs.core.async.impl.channels/t_cljs$core$async$impl$channels18976")});return new fk(gk,b,pe)};function hk(a,b){this.Eb=a;this.G=b}function ik(a){return Dj(a.Eb)}var jk=function jk(b){if(null!=b&&null!=b.kc)return b.kc();var c=jk[p(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=jk._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw A("MMC.abort",b);};function kk(a,b,c,d,e,f,g){this.rb=a;this.Rb=b;this.ib=c;this.Qb=d;this.J=e;this.closed=f;this.Ea=g}
kk.prototype.kc=function(){for(;;){var a=this.ib.pop();if(null!=a){var b=a.Eb;dk(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(b.Fa,b,a.G,a,this))}break}Sj(this.ib,ve());return Cj(this)};
kk.prototype.Ob=function(a,b,c){var d=this;if(a=d.closed)return gk(!a);if(x(function(){var a=d.J;return x(a)?Na(Vj(d.J)):a}())){for(c=Lc(d.Ea.a?d.Ea.a(d.J,b):d.Ea.call(null,d.J,b));;){if(0<d.rb.length&&0<R(d.J)){var e=d.rb.pop(),f=e.Fa,g=d.J.J.pop();dk(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(f,g,e,c,a,this))}break}c&&jk(this);return gk(!0)}e=function(){for(;;){var a=d.rb.pop();if(x(a)){if(x(!0))return a}else return null}}();if(x(e))return c=Ej(e),dk(function(a){return function(){return a.b?
a.b(b):a.call(null,b)}}(c,e,a,this)),gk(!0);64<d.Qb?(d.Qb=0,Sj(d.ib,ik)):d.Qb+=1;Rj(d.ib,new hk(c,b));return null};
kk.prototype.Zb=function(a,b){var c=this;if(null!=c.J&&0<R(c.J)){for(var d=b.Fa,e=gk(c.J.J.pop());;){if(!x(Vj(c.J))){var f=c.ib.pop();if(null!=f){var g=f.Eb,k=f.G;dk(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(g.Fa,g,k,f,d,e,this));Lc(c.Ea.a?c.Ea.a(c.J,k):c.Ea.call(null,c.J,k))&&jk(this);continue}}break}return e}d=function(){for(;;){var a=c.ib.pop();if(x(a)){if(Dj(a.Eb))return a}else return null}}();if(x(d))return e=Ej(d.Eb),dk(function(a){return function(){return a.b?a.b(!0):
a.call(null,!0)}}(e,d,this)),gk(d.G);if(x(c.closed))return x(c.J)&&(c.Ea.b?c.Ea.b(c.J):c.Ea.call(null,c.J)),x(x(!0)?b.Fa:!0)?(d=function(){var a=c.J;return x(a)?0<R(c.J):a}(),d=x(d)?c.J.J.pop():null,gk(d)):null;64<c.Rb?(c.Rb=0,Sj(c.rb,Dj)):c.Rb+=1;Rj(c.rb,b);return null};
kk.prototype.Nb=function(){var a=this;if(!a.closed)for(a.closed=!0,x(function(){var b=a.J;return x(b)?0===a.ib.length:b}())&&(a.Ea.b?a.Ea.b(a.J):a.Ea.call(null,a.J));;){var b=a.rb.pop();if(null==b)break;else{var c=b.Fa,d=x(function(){var b=a.J;return x(b)?0<R(a.J):b}())?a.J.J.pop():null;dk(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(c,d,b,this))}}return null};function lk(a){console.log(a);return null}
function mk(a,b){var c=(x(null)?null:lk).call(null,b);return null==c?a:Gj.a(a,c)}
function nk(a){return new kk(Tj(32),0,Tj(32),0,a,!1,function(){return function(a){return function(){function c(c,d){try{return a.a?a.a(c,d):a.call(null,c,d)}catch(e){return mk(c,e)}}function d(c){try{return a.b?a.b(c):a.call(null,c)}catch(d){return mk(c,d)}}var e=null,e=function(a,b){switch(arguments.length){case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};e.b=d;e.a=c;return e}()}(x(null)?null.b?null.b(Gj):null.call(null,Gj):Gj)}())};function ok(a,b,c){this.key=a;this.G=b;this.forward=c;this.g=2155872256;this.C=0}ok.prototype.U=function(){return Za(Za(L,this.G),this.key)};ok.prototype.N=function(a,b,c){return mf(b,nf,"["," ","]",c,this)};function pk(a,b,c){c=Array(c+1);for(var d=0;;)if(d<c.length)c[d]=null,d+=1;else break;return new ok(a,b,c)}function qk(a,b,c,d){for(;;){if(0>c)return a;a:for(;;){var e=a.forward[c];if(x(e))if(e.key<b)a=e;else break a;else break a}null!=d&&(d[c]=a);--c}}
function rk(a,b){this.gb=a;this.level=b;this.g=2155872256;this.C=0}rk.prototype.put=function(a,b){var c=Array(15),d=qk(this.gb,a,this.level,c).forward[0];if(null!=d&&d.key===a)return d.G=b;a:for(d=0;;)if(.5>Math.random()&&15>d)d+=1;else break a;if(d>this.level){for(var e=this.level+1;;)if(e<=d+1)c[e]=this.gb,e+=1;else break;this.level=d}for(d=pk(a,b,Array(d));;)return 0<=this.level?(c=c[0].forward,d.forward[0]=c[0],c[0]=d):null};
rk.prototype.remove=function(a){var b=Array(15),c=qk(this.gb,a,this.level,b).forward[0];if(null!=c&&c.key===a){for(a=0;;)if(a<=this.level){var d=b[a].forward;d[a]===c&&(d[a]=c.forward[a]);a+=1}else break;for(;;)if(0<this.level&&null==this.gb.forward[this.level])--this.level;else return null}else return null};function sk(a){for(var b=tk,c=b.gb,d=b.level;;){if(0>d)return c===b.gb?null:c;var e;a:for(e=c;;){e=e.forward[d];if(null==e){e=null;break a}if(e.key>=a)break a}null!=e?(--d,c=e):--d}}
rk.prototype.U=function(){return function(a){return function c(d){return new Xd(null,function(){return function(){return null==d?null:Q(new W(null,2,5,X,[d.key,d.G],null),c(d.forward[0]))}}(a),null,null)}}(this)(this.gb.forward[0])};rk.prototype.N=function(a,b,c){return mf(b,function(){return function(a){return mf(b,nf,""," ","",c,a)}}(this),"{",", ","}",c,this)};var tk=new rk(pk(null,null,0),0);
function uk(){var a=(new Date).valueOf()+30,b=sk(a),c=x(x(b)?b.key<a+10:b)?b.G:null;if(x(c))return c;var d=nk(null);tk.put(a,d);ek(function(a,b,c){return function(){tk.remove(c);return Cj(a)}}(d,c,a,b));return d};var vk=function vk(b){"undefined"===typeof zj&&(zj=function(b,d,e){this.$b=b;this.Fa=d;this.Jc=e;this.g=393216;this.C=0},zj.prototype.S=function(b,d){return new zj(this.$b,this.Fa,d)},zj.prototype.R=function(){return this.Jc},zj.prototype.mc=function(){return!0},zj.prototype.nc=function(){return this.Fa},zj.ac=function(){return new W(null,3,5,X,[Ic(Wi,new q(null,2,[xh,!0,ne,ic(oe,ic(new W(null,1,5,X,[nj],null)))],null)),nj,ra.$c],null)},zj.Db=!0,zj.cb="cljs.core.async/t_cljs$core$async16145",zj.Pb=
function(b,d){return Ib(d,"cljs.core.async/t_cljs$core$async16145")});return new zj(vk,b,pe)};function wk(a){a=kc.a(a,0)?null:a;return nk("number"===typeof a?new Uj(Tj(a),a):a)}function xk(a,b){var c=Aj(a,vk(b));if(x(c)){var d=P.b?P.b(c):P.call(null,c);x(!0)?b.b?b.b(d):b.call(null,d):dk(function(a){return function(){return b.b?b.b(a):b.call(null,a)}}(d,c))}return null}
var yk=vk(function(){return null}),zk=function zk(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return zk.a(arguments[0],arguments[1]);case 3:return zk.c(arguments[0],arguments[1],arguments[2]);case 4:return zk.u(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};zk.a=function(a,b){var c=Bj(a,b,yk);return x(c)?P.b?P.b(c):P.call(null,c):!0};
zk.c=function(a,b,c){return zk.u(a,b,c,!0)};zk.u=function(a,b,c,d){a=Bj(a,b,vk(c));return x(a)?(b=P.b?P.b(a):P.call(null,a),x(d)?c.b?c.b(b):c.call(null,b):dk(function(a){return function(){return c.b?c.b(a):c.call(null,a)}}(b,a,a)),b):!0};zk.A=4;var Ak=VDOM.diff,Bk=VDOM.patch,Ck=VDOM.create;function Dk(a){return Ne(La,Ne(td,Oe(td,a)))}function Ek(a,b,c){return new VDOM.VHtml(Md(a),Og(b),Og(c))}function Fk(a,b,c){return new VDOM.VSvg(Md(a),Og(b),Og(c))}Gk;
var Hk=function Hk(b){if(null==b)return new VDOM.VText("");if(td(b))return Ek(li,pe,U.a(Hk,Dk(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(kc.a(Gi,J(b)))return Gk.b?Gk.b(b):Gk.call(null,b);var c=S(b,0),d=S(b,1);b=Ld(b,2);return Ek(c,d,U.a(Hk,Dk(b)))},Gk=function Gk(b){if(null==b)return new VDOM.VText("");if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(kc.a(lj,J(b))){var c=S(b,0),d=S(b,1);b=Ld(b,2);return Fk(c,d,U.a(Hk,Dk(b)))}c=S(b,0);d=S(b,
1);b=Ld(b,2);return Fk(c,d,U.a(Gk,Dk(b)))};var Ik=Error();function Jk(a){return function(b){b.stopPropagation();return a.s?a.s():a.call(null)}};function Kk(a,b,c){if(Rd(c))return c=D.a(ic,U.a(a,c)),b.b?b.b(c):b.call(null,c);if(td(c))return c=xg(U.a(a,c)),b.b?b.b(c):b.call(null,c);if(ld(c))return c=Ta.c(function(b,c){return Zc.a(b,a.b?a.b(c):a.call(null,c))},c,c),b.b?b.b(c):b.call(null,c);hd(c)&&(c=Qe(null==c?null:Xa(c),U.a(a,c)));return b.b?b.b(c):b.call(null,c)}var Lk=function Lk(b,c){return Kk(we(Lk,b),b,c)};function Mk(){var a=Nk,b=Ok,c=Pk,d=wk(null);zk.a(d,b);var e=wk(1);dk(function(d,e){return function(){var k=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!Vd(e,Xh)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Oj(c),d=Xh;else throw f;}if(!Vd(d,Xh))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,
a)}throw Error("Invalid arity: "+arguments.length);};d.s=c;d.b=b;return d}()}(function(d,e){return function(d){var f=d[1];if(1===f)return Kj(d,2,c);if(2===f){var f=b,g=d[2];d[7]=f;d[8]=g;d[2]=null;d[1]=3;return Xh}return 3===f?(f=d[9],f=d[7],g=d[8],f=a.a?a.a(f,g):a.call(null,f,g),g=zk.a(e,f),d[9]=f,d[10]=g,Kj(d,5,c)):4===f?(f=d[2],Mj(d,f)):5===f?(f=d[9],g=d[2],d[7]=f,d[8]=g,d[2]=null,d[1]=3,Xh):null}}(d,e),d,e)}(),l=function(){var a=k.s?k.s():k.call(null);a[6]=d;return a}();return Jj(l)}}(e,d));return d}
;function Qk(a){return Math.abs(a)}function Rk(a,b){var c=null!=a&&(a.g&64||a.w)?D.a(N,a):a,d=H.a(c,Z),c=H.a(c,Y),e=null!=b&&(b.g&64||b.w)?D.a(N,b):b,f=H.a(e,Z);return(H.a(e,Y)-c)/(f-d)}function Sk(a,b){var c=null!=b&&(b.g&64||b.w)?D.a(N,b):b,d=H.a(c,Z);return H.a(c,Y)-a*d}function Tk(a,b){return function(c){return a*c+b}}function Uk(a,b){return function(c){return(c-b)/a}}
function Vk(a,b){var c=null!=a&&(a.g&64||a.w)?D.a(N,a):a,d=H.a(c,Z),c=H.a(c,Y),e=S(b,0),f=S(b,1),f=Rk(e,f),g=Qk(f),k=Sk(f,e);return kc.a(Infinity,g)?new q(null,2,[Z,e.b?e.b(Z):e.call(null,Z),Y,c],null):1<g?new q(null,2,[Z,Uk(f,k).call(null,c),Y,c],null):new q(null,2,[Z,d,Y,Tk(f,k).call(null,d)],null)}function Wk(a,b){return Xk(Z,a,b)+Xk(Y,a,b)}function Xk(a,b,c){return Qk((a.b?a.b(b):a.call(null,b))-(a.b?a.b(c):a.call(null,c)))}function Yk(a){return Ta.a(Cd,a)/R(a)}
function Zk(a,b){return a-.01<b&&b<a+.01}function $k(a,b,c){var d=Rk(a,b);c=Rk(b,c);var e=kc.a(Qk(d),Infinity)&&kc.a(Qk(c),Infinity);if(e)return e;e=Zk(d,c);return x(e)?Zk(Sk(d,a),Sk(c,b)):e}function al(a){var b=U.a(Z,a);a=U.a(Y,a);var c=D.a(Fd,b),b=x(c)?c:D.a(Gd,b);return x(b)?(b=D.a(Fd,a),x(b)?b:D.a(Gd,a)):b}
function bl(a,b){var c=null!=a&&(a.g&64||a.w)?D.a(N,a):a,d=H.a(c,Z),c=H.a(c,Y),e=null!=b&&(b.g&64||b.w)?D.a(N,b):b,f=H.a(e,Z),e=H.a(e,Y);return new q(null,2,[Z,Yk(uc([d,f],0)),Y,Yk(uc([c,e],0))],null)}function cl(a){var b=R(a)/2|0,c=zd(U.a(Z,a));a=zd(U.a(Y,a));return new q(null,2,[Z,bd(c,b),Y,bd(a,b)],null)}
function dl(a,b){var c=null!=a&&(a.g&64||a.w)?D.a(N,a):a,d=H.a(c,Z),c=H.a(c,Y),e=null!=b&&(b.g&64||b.w)?D.a(N,b):b,f=H.a(e,Z),g=H.a(e,Y);if(0===d-f)return new q(null,2,[Z,d,Y,g<c?0:1E4],null);var e=Rk(a,b),k=Sk(e,a),d=f<d?0:1E4,c=g<c?0:1E4,c=1<Qk(e)?new W(null,2,5,X,[(c-k)/e,c],null):new W(null,2,5,X,[d,k+e*d],null),d=S(c,0),c=S(c,1);return new q(null,2,[Z,d,Y,c],null)}
function el(a,b){var c=null!=a&&(a.g&64||a.w)?D.a(N,a):a,d=H.a(c,Z),c=H.a(c,Y),e=null!=b&&(b.g&64||b.w)?D.a(N,b):b,f=H.a(e,Z),e=H.a(e,Y);return new W(null,2,5,X,[new q(null,2,[Z,d,Y,e],null),new q(null,2,[Z,f,Y,c],null)],null)}function fl(a,b){var c=el(a,b),d=S(c,0),c=S(c,1);return new W(null,4,5,X,[a,d,b,c],null)}function gl(a){var b=null!=a&&(a.g&64||a.w)?D.a(N,a):a;a=H.a(b,Z);b=H.a(b,Y);return(0>=a||1E4<=a)&&(0>=b||1E4<=b)}function hl(a,b,c){return We(We(a,Z,Cd,b),Y,Cd,c)}
function il(a,b){var c=null!=a&&(a.g&64||a.w)?D.a(N,a):a;H.a(c,Z);H.a(c,Y);return new W(null,4,5,X,[hl(c,-b,0),hl(c,0,-b),hl(c,b,0),hl(c,0,b)],null)}function jl(a,b){return kc.a(Z.b(a),Z.b(b))}
function kl(a,b){var c=S(a,0),d=S(a,1),e=S(b,0),f=S(b,1),g;g=jl(c,d);g=x(g)?jl(e,f):g;if(x(g))return null;if(x(jl(c,d)))return g=Z.b(c),f=Rk(e,f),e=Sk(f,e),new q(null,2,[Z,g,Y,Tk(f,e).call(null,g)],null);if(x(jl(e,f)))return g=Z.b(e),f=Rk(c,d),e=Sk(f,c),new q(null,2,[Z,g,Y,Tk(f,e).call(null,g)],null);if(kc.a(Rk(c,d),Rk(e,f)))return null;d=Rk(c,d);g=Rk(e,f);c=Sk(d,c);g=(Sk(g,e)-c)/(d-g);return new q(null,2,[Z,g,Y,Tk(d,c).call(null,g)],null)}
function ll(a,b){var c=S(a,0),d=S(a,1);return Ne(La,U.a(function(a,b,c){return function(a){return kl(new W(null,2,5,X,[b,c],null),a)}}(a,c,d),U.c(qf,b,Ge(He(b)))))}function ml(a,b){var c=null!=a&&(a.g&64||a.w)?D.a(N,a):a,d=H.a(c,Z),c=H.a(c,Y),e=null!=b&&(b.g&64||b.w)?D.a(N,b):b,f=H.a(e,Z),e=H.a(e,Y),d=f-d,c=e-c;return new W(null,2,5,X,[d/Qk(d),c/Qk(c)],null)}function nl(a,b,c){a=Rk(a,b);a=kc.a(Infinity,Qk(a))?hl(c,0,1):hl(c,1,a);return new W(null,2,5,X,[dl(c,a),dl(a,c)],null)};if("undefined"===typeof fh)var fh=function(){var a=ze.b?ze.b(pe):ze.call(null,pe),b=ze.b?ze.b(pe):ze.call(null,pe),c=ze.b?ze.b(pe):ze.call(null,pe),d=ze.b?ze.b(pe):ze.call(null,pe),e=H.c(pe,Ui,Rg());return new ch(tc.a("taxicab.shapes","shape"),function(){return function(a){a=null!=a&&(a.g&64||a.w)?D.a(N,a):a;return H.a(a,Yh)}}(a,b,c,d,e),Eh,e,a,b,c,d)}();
eh(Mi,function(a){var b=null!=a&&(a.g&64||a.w)?D.a(N,a):a;H.a(b,zi);a=H.a(b,Z);var c=H.a(b,Y),b=H.a(b,yi);return new q(null,1,[ci,new W(null,1,5,X,[new q(null,4,[Z,a,Y,c,yi,b,$h,!0],null)],null)],null)});eh(si,function(a){var b=null!=a&&(a.g&64||a.w)?D.a(N,a):a;H.a(b,zi);a=H.a(b,hi);b=H.a(b,mh);return new q(null,2,[Ni,new W(null,1,5,X,[new W(null,2,5,X,[dl(b,a),dl(a,b)],null)],null),pi,new W(null,2,5,X,[a,b],null)],null)});
eh(Qh,function(a){var b=null!=a&&(a.g&64||a.w)?D.a(N,a):a;a=H.a(b,hi);b=H.a(b,mh);return new q(null,2,[Ni,new W(null,1,5,X,[new W(null,2,5,X,[a,b],null)],null),pi,new W(null,2,5,X,[a,b],null)],null)});eh(yh,function(a){var b=null!=a&&(a.g&64||a.w)?D.a(N,a):a;a=H.a(b,hi);b=H.a(b,mh);return new q(null,2,[Ni,new W(null,1,5,X,[new W(null,2,5,X,[a,dl(a,b)],null)],null),pi,new W(null,2,5,X,[a,b],null)],null)});
eh(Dh,function(a){var b=null!=a&&(a.g&64||a.w)?D.a(N,a):a;a=H.a(b,hi);var c=H.a(b,mh),b=H.a(b,ji);return new q(null,3,[Ni,new W(null,1,5,X,[nl(a,c,b)],null),pi,new W(null,3,5,X,[a,c,b],null),qi,new W(null,1,5,X,[new W(null,2,5,X,[dl(a,c),dl(c,a)],null)],null)],null)});
eh(di,function(a){var b=null!=a&&(a.g&64||a.w)?D.a(N,a):a,c=H.a(b,hi),d=H.a(b,mh),e=function(a,b,c,d){return function(a){return Zk(Wk(c,a),Wk(d,a))}}(a,b,c,d),f=bl(c,d),g=Wk(c,f),k=Me(e,ge.a(il(c,g),il(d,g))),l=S(k,0),m=S(k,1);a=function(a){return function(b){return Me(a,il(b,1))}}(e,f,g,k,l,m,a,b,c,d);return new q(null,4,[Ni,new W(null,1,5,X,[new W(null,2,5,X,[l,m],null)],null),Ji,new W(null,2,5,X,[new W(null,2,5,X,[l,a(l)],null),kc.a(l,m)?null:new W(null,2,5,X,[m,a(m)],null)],null),pi,new W(null,
2,5,X,[c,d],null),qi,new W(null,1,5,X,[new W(null,2,5,X,[c,d],null)],null)],null)});
eh(ei,function(a){var b=null!=a&&(a.g&64||a.w)?D.a(N,a):a;a=H.a(b,hi);var c=H.a(b,mh),b=H.a(b,ji),d=Rk(a,c);kc.a(1,d)?d=new W(null,2,5,X,[new W(null,3,5,X,[b,hl(b,1,0),hl(b,0,-1)],null),new W(null,3,5,X,[b,hl(b,-1,0),hl(b,0,1)],null)],null):kc.a(-1,d)?d=new W(null,2,5,X,[new W(null,3,5,X,[b,hl(b,-1,0),hl(b,0,-1)],null),new W(null,3,5,X,[b,hl(b,1,0),hl(b,0,1)],null)],null):(d=Vk(b,new W(null,2,5,X,[a,c],null)),d=new W(null,1,5,X,[new W(null,3,5,X,[b,dl(d,b),dl(b,d)],null)],null));return new q(null,
3,[Ji,d,pi,new W(null,3,5,X,[a,c,b],null),qi,new W(null,1,5,X,[new W(null,2,5,X,[dl(a,c),dl(c,a)],null)],null)],null)});
eh(fj,function(a){var b=null!=a&&(a.g&64||a.w)?D.a(N,a):a,c=H.a(b,ui),d=H.a(b,qh),e=H.a(b,fi),f=function(){return function(a,b,c){var d=nl(a,b,hl(a,c,0)),e=Wk(a,Vk(a,d));return x(c-.001<=e&&e<=c+.001)?new W(null,2,5,X,[d,nl(a,b,hl(a,-c,0))],null):new W(null,2,5,X,[nl(a,b,hl(a,0,c)),nl(a,b,hl(a,0,-c))],null)}}(a,b,c,d,e);a=function(a,b){return function(c,d,e){return J(Me(we(b,new W(null,2,5,X,[c,e],null)),a(c,d,1)))}}(f,function(){return function(a,b){var c;c=kl(a,b);var d=S(a,0),e=S(a,1),f=$k(d,e,
c);x(f)?(f=al(uc([d,e,c],0)),c=x(f)?f:al(uc([d,c,e],0))):c=f;return c}}(f,a,b,c,d,e),a,b,c,d,e);a=kl(a(d,c,e),a(d,e,c));return new q(null,3,[Ni,new W(null,1,5,X,[new W(null,2,5,X,[dl(d,a),dl(a,d)],null)],null),pi,new W(null,3,5,X,[c,d,e],null),qi,new W(null,2,5,X,[new W(null,2,5,X,[dl(c,d),dl(d,c)],null),new W(null,2,5,X,[dl(e,d),dl(d,e)],null)],null)],null)});
eh(Nh,function(a){var b=null!=a&&(a.g&64||a.w)?D.a(N,a):a;a=H.a(b,oi);b=H.a(b,oh);return new q(null,2,[bi,new W(null,1,5,X,[il(a,Wk(a,b))],null),pi,new W(null,2,5,X,[T.c(a,gh,"Center"),b],null)],null)});
eh(Hi,function(a){var b=null!=a&&(a.g&64||a.w)?D.a(N,a):a;a=H.a(b,uh);var c=H.a(b,wi),b=H.a(b,ji),d=null!=a&&(a.g&64||a.w)?D.a(N,a):a,e=H.a(d,Z),d=H.a(d,Y),f=null!=c&&(c.g&64||c.w)?D.a(N,c):c,g=H.a(f,Z),f=H.a(f,Y),g=zd(new W(null,2,5,X,[e,g],null)),e=S(g,0),g=S(g,1),f=zd(new W(null,2,5,X,[d,f],null)),d=S(f,0),f=S(f,1),k=(Wk(a,b)+Wk(c,b)-Wk(a,c))/2;return new q(null,2,[bi,new W(null,1,5,X,[new W(null,9,5,X,[new q(null,2,[Z,e-k,Y,d],null),new q(null,2,[Z,e-k,Y,f],null),new q(null,2,[Z,e,Y,f+k],null),
new q(null,2,[Z,g,Y,f+k],null),new q(null,2,[Z,g+k,Y,f],null),new q(null,2,[Z,g+k,Y,d],null),new q(null,2,[Z,g,Y,d-k],null),new q(null,2,[Z,e,Y,d-k],null),new q(null,2,[Z,e-k,Y,d],null)],null)],null),pi,new W(null,3,5,X,[T.c(a,gh,"Focus"),T.c(c,gh,"Focus"),b],null)],null)});
eh(Ei,function(a){var b=null!=a&&(a.g&64||a.w)?D.a(N,a):a,c=H.a(b,Li),d=H.a(b,kh),e=H.a(b,ph),f=function(a,b,c,d,e){return function(a){var b=Wk(a,c);a=Wk(a,Vk(a,new W(null,2,5,X,[d,e],null)));return Zk(b,a)}}(a,b,c,d,e);return new q(null,3,[Ni,kc.a(1,Qk(Rk(d,e)))?function(){var a=bl(c,kl(new W(null,2,5,X,[d,e],null),new W(null,2,5,X,[c,hl(c,1,0)],null))),b=bl(c,kl(new W(null,2,5,X,[d,e],null),new W(null,2,5,X,[c,hl(c,0,1)],null))),l=Me(f,il(a,1)),l=S(l,0),m=Me(f,il(b,1)),m=S(m,0);return new W(null,
1,5,X,[new W(null,4,5,X,[dl(a,l),a,b,dl(b,m)],null)],null)}():function(){var a=bl(c,Vk(c,new W(null,2,5,X,[d,e],null))),b=kl(new W(null,2,5,X,[d,e],null),new W(null,2,5,X,[c,hl(c,1,1)],null)),l=kl(new W(null,2,5,X,[d,e],null),new W(null,2,5,X,[c,hl(c,1,-1)],null)),m=Me(f,el(c,b)),m=S(m,0),n=Me(f,el(c,l)),n=S(n,0);return new W(null,1,5,X,[new W(null,5,5,X,[dl(b,m),m,a,n,dl(l,n)],null)],null)}(),pi,new W(null,3,5,X,[T.c(c,gh,"Focus"),d,e],null),qi,new W(null,1,5,X,[new W(null,2,5,X,[dl(d,e),dl(e,d)],
null)],null)],null)});
eh(gi,function(a){var b=null!=a&&(a.g&64||a.w)?D.a(N,a):a,c=H.a(b,uh),d=H.a(b,wi),e=H.a(b,ji),f=function(a,b,c,d){return function(a){return Qk(Wk(a,c)-Wk(a,d))}}(a,b,c,d,e),g=f(e),k=(Wk(c,d)-g)/2,l=function(a,b){return function(c){return Zk(b,a(c))}}(f,g,k,a,b,c,d,e),m=function(a,b,c,d){return function(a){return new W(null,2,5,X,[a,Me(d,il(a,5))],null)}}(f,g,k,l,a,b,c,d,e),n=new W(null,2,5,X,[T.c(c,gh,"Focus"),T.c(d,gh,"Focus")],null);if(0===k)return new q(null,2,[Ji,new W(null,2,5,X,[m(c),m(d)],
null),pi,n],null);a=function(a,b,c,d,e,f,g,k,l,m,n){return function(E,ca){var O=U.a(we(Dd,c),ml(E,ca)),da=S(O,0),ha=S(O,1),O=Me(function(a,b,c,d,e,f,g){return function(a){var b=g(a);return x(b)?Zk(f,Wk(E,a)):b}}(O,da,ha,a,b,c,d,e,f,g,k,l,m,n),ll(new W(null,2,5,X,[hl(E,da,0),hl(E,0,ha)],null),fl(l,m)));return new q(null,2,[Ni,new W(null,1,5,X,[O],null),Ji,U.a(e,O)],null)}}(f,g,k,l,m,n,a,b,c,d,e);return jg.j(uc([kg.j(ge,uc([a(c,d),a(d,c)],0)),new q(null,1,[pi,n],null)],0))});
eh(aj,function(a){a=null!=a&&(a.g&64||a.w)?D.a(N,a):a;var b=H.a(a,ci);return jg.j(uc([new q(null,1,[pi,b],null),te(R(b))?function(){var a,d=R(b)/2|0;a=zd(U.a(Z,b));var e=zd(U.a(Y,b));a=new W(null,2,5,X,[new q(null,2,[Z,bd(a,d-1),Y,bd(e,d-1)],null),new q(null,2,[Z,bd(a,d),Y,bd(e,d)],null)],null);d=S(a,0);a=S(a,1);var f=null!=d&&(d.g&64||d.w)?D.a(N,d):d,e=H.a(f,Z),f=H.a(f,Y),g=null!=a&&(a.g&64||a.w)?D.a(N,a):a,k=H.a(g,Z),g=H.a(g,Y),l=kc.a(e,k),m=kc.a(f,g);return l&&m?new q(null,1,[ci,new W(null,1,5,
X,[d],null)],null):l||m?new q(null,1,[Ni,new W(null,1,5,X,[new W(null,2,5,X,[d,a],null)],null)],null):new q(null,1,[gj,new W(null,1,5,X,[new W(null,5,5,X,[new q(null,2,[Z,e,Y,f],null),new q(null,2,[Z,e,Y,g],null),new q(null,2,[Z,k,Y,g],null),new q(null,2,[Z,k,Y,f],null),new q(null,2,[Z,e,Y,f],null)],null)],null)],null)}():new q(null,1,[ci,new W(null,1,5,X,[cl(b)],null)],null)],0))});function ol(a,b){var c=pl(),d=c.createSVGPoint();d.x=a;d.y=b;return d.matrixTransform(c.getScreenCTM().inverse())}function ql(a){a=a.getBoundingClientRect();return new W(null,2,5,X,[a.width,a.height],null)}function pl(){return document.getElementById("workspace")}var rl=wg(function(a){return a.x},function(a){return a.y});function sl(a){a=null!=a&&(a.g&64||a.w)?D.a(N,a):a;a=H.a(a,Yh);return kc.a(Mi,a)}
function tl(a,b){return new W(null,3,5,X,[li,new q(null,1,[zi,"tools"],null),function(){return function d(e){return new Xd(null,function(){for(;;){var f=w(e);if(f){var g=f;if(pd(g)){var k=Ub(g),l=R(k),m=ae(l);return function(){for(var d=0;;)if(d<l){var e=G.a(k,d),n=null!=e&&(e.g&64||e.w)?D.a(N,e):e,r=n,t=H.a(n,Ih),u=H.a(n,zi),v=kc.a(zi.b(a),u);ce(m,new W(null,4,5,X,[li,new q(null,1,[ii,"tool-container"],null),new W(null,3,5,X,[Ah,new q(null,3,[zi,[B("tool-"),B(Md(u))].join(""),ii,[B("tool"),B(v?" selected":
null)].join(""),Ph,function(a,d,e,f,g){return function(){var a=new W(null,2,5,X,[Mh,g],null);return b.b?b.b(a):b.call(null,a)}}(d,v,e,n,r,t,u,k,l,m,g,f)],null),t],null),v?new W(null,3,5,X,[li,new q(null,1,[ii,"description"],null),hh.b(r)],null):null],null));d+=1}else return!0}()?be(m.K(),d(Vb(g))):be(m.K(),null)}var n=J(g),r=null!=n&&(n.g&64||n.w)?D.a(N,n):n,t=r,u=H.a(r,Ih),v=H.a(r,zi),z=kc.a(zi.b(a),v);return Q(new W(null,4,5,X,[li,new q(null,1,[ii,"tool-container"],null),new W(null,3,5,X,[Ah,new q(null,
3,[zi,[B("tool-"),B(Md(v))].join(""),ii,[B("tool"),B(z?" selected":null)].join(""),Ph,function(a,d,e,f){return function(){var a=new W(null,2,5,X,[Mh,f],null);return b.b?b.b(a):b.call(null,a)}}(z,n,r,t,u,v,g,f)],null),u],null),z?new W(null,3,5,X,[li,new q(null,1,[ii,"description"],null),hh.b(t)],null):null],null),d(wc(g)))}return null}},null,null)}(vj)}()],null)}
function ul(a,b){var c=null!=a&&(a.g&64||a.w)?D.a(N,a):a,d=H.a(c,Wh),e=H.a(c,Uh),f=H.a(c,rh),g=H.a(c,$i);return new W(null,8,5,X,[li,new q(null,1,[zi,"options"],null),w(d)?new W(null,3,5,X,[Ah,new q(null,1,[Ph,function(){return function(){return b.b?b.b(ri):b.call(null,ri)}}(a,c,d,e,f,g)],null),"Undo"],null):null,w(e)?new W(null,3,5,X,[Ah,new q(null,1,[Ph,function(){return function(){return b.b?b.b(Ch):b.call(null,Ch)}}(a,c,d,e,f,g)],null),"Redo"],null):null,x(f)?new W(null,3,5,X,[Ah,new q(null,1,
[Ph,function(){return function(){var a=new W(null,2,5,X,[dj,!1],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g)],null),"Hide labels"],null):new W(null,3,5,X,[Ah,new q(null,1,[Ph,function(){return function(){var a=new W(null,2,5,X,[dj,!0],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g)],null),"Show labels"],null),new W(null,3,5,X,[Ah,new q(null,1,[Ph,function(){return function(){return b.b?b.b(Vi):b.call(null,Vi)}}(a,c,d,e,f,g)],null),"Save Image"],null),new W(null,3,5,X,[Ah,new q(null,
1,[Ph,function(){return function(){return b.b?b.b(kj):b.call(null,kj)}}(a,c,d,e,f,g)],null),"Clear Workspace"],null),new W(null,4,5,X,[li,new q(null,1,[ii,"widget"],null),"Grid",new W(null,2,5,X,[Pi,new q(null,6,[Yh,"range",nh,0,vi,40,Zi,5,Kh,g,Qi,function(){return function(){var a=new W(null,2,5,X,[Gh,this.value|0],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g)],null)],null)],null)],null)}
function vl(a){var b=pl();if(x(x(b)?2<a:b)){var c=ql(b),d=S(c,0),e=S(c,1);return new W(null,4,5,X,[ni,new q(null,1,[Ai,"grid"],null),function(){return function(a,b,c){return function m(d){return new Xd(null,function(){return function(){for(;;){var a=w(d);if(a){if(pd(a)){var b=Ub(a),c=R(b),e=ae(c);a:for(var f=0;;)if(f<c){var g=G.a(b,f);e.add(new W(null,2,5,X,[si,new q(null,3,[Oi,g,cj,g,Si,"100%"],null)],null));f+=1}else{b=!0;break a}return b?be(e.K(),m(Vb(a))):be(e.K(),null)}e=J(a);return Q(new W(null,
2,5,X,[si,new q(null,3,[Oi,e,cj,e,Si,"100%"],null)],null),m(wc(a)))}return null}}}(a,b,c),null,null)}}(c,d,e)(new vg(null,0,d,a,null))}(),function(){return function(a,b,c){return function m(d){return new Xd(null,function(){return function(){for(;;){var a=w(d);if(a){if(pd(a)){var b=Ub(a),c=R(b),e=ae(c);a:for(var f=0;;)if(f<c){var g=G.a(b,f);e.add(new W(null,2,5,X,[si,new q(null,3,[cj,"100%",Oh,g,Si,g],null)],null));f+=1}else{b=!0;break a}return b?be(e.K(),m(Vb(a))):be(e.K(),null)}e=J(a);return Q(new W(null,
2,5,X,[si,new q(null,3,[cj,"100%",Oh,e,Si,e],null)],null),m(wc(a)))}return null}}}(a,b,c),null,null)}}(c,d,e)(new vg(null,0,e,a,null))}()],null)}return null}function wl(a,b){var c=null!=b&&(b.g&64||b.w)?D.a(N,b):b,d=H.a(c,zi),e=function(){return function(b){return b instanceof jc?ed.a(a.b?a.b(b):a.call(null,b),zi):b}}(b,c,c,d),c=ed.a(c,zi),e=Lk(e,c);return T.c(e,zi,d)}function xl(a){var b=S(a,0);a=S(a,1);return[B(b),B(","),B(a)].join("")}var yl=wg(Z,Y);
function zl(a){return w(a)?D.c(B,"M",Ke(U.a(xl,U.a(yl,a)))):null}function Al(a){return[B(zl(a)),B("Z")].join("")}var Bl=function Bl(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Bl.a(arguments[0],arguments[1]);case 3:return Bl.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
Bl.a=function(a,b){return new W(null,2,5,X,[ih,new q(null,2,[Ai,"stroke",Ki,zl(new W(null,2,5,X,[a,dl(a,b)],null))],null)],null)};Bl.c=function(a,b,c){if(x($k(a,b,c)))a=new W(null,2,5,X,[ih,new q(null,2,[Ai,"stroke",Ki,zl(new W(null,2,5,X,[dl(a,b),dl(a,c)],null))],null)],null);else{var d=X;b=dl(a,b);c=dl(a,c);var e=Me(gl,el(b,c)),e=S(e,0);a=new W(null,2,5,d,[ih,new q(null,2,[Ai,"area",Ki,Al(new W(null,4,5,X,[a,b,e,c],null))],null)],null)}return a};Bl.A=3;
function Cl(a){return new W(null,4,5,X,[ni,new q(null,1,[Ai,"stroked"],null),a,a],null)}
function Dl(a,b,c){var d=null!=a&&(a.g&64||a.w)?D.a(N,a):a,e=H.a(d,ci),f=null!=b&&(b.g&64||b.w)?D.a(N,b):b,g=H.a(f,Yh),k=H.a(f,zi),l=H.a(f,vh),m=H.a(f,Xi),n=Jk(function(a,b,d,e,f,g,k,l){return function(){var a=new W(null,2,5,X,[jj,l],null);return c.b?c.b(a):c.call(null,a)}}(a,d,d,e,b,f,g,k,l,m));return new W(null,9,5,X,[ni,new q(null,1,[Ai,[B(kc.a(Mi,g)?null:"shape"),B(" "),B(Md(g)),B(" "),B(x(l)?Md(l):null)].join("")],null),function(){return function(a,b,c,d,e,f,g,k,l,m,n){return function ca(O){return new Xd(null,
function(){return function(){for(;;){var a=w(O);if(a){if(pd(a)){var b=Ub(a),c=R(b),d=ae(c);a:for(var e=0;;)if(e<c){var f=G.a(b,e),g=null!=f&&(f.g&64||f.w)?D.a(N,f):f,f=H.a(g,Z),k=H.a(g,Y),g=H.a(g,yi);d.add(Cl(new W(null,3,5,X,[mj,new q(null,4,[Ai,"label",Z,f,Y,k,Rh,-10],null),g],null)));e+=1}else{b=!0;break a}return b?be(d.K(),ca(Vb(a))):be(d.K(),null)}d=J(a);c=null!=d&&(d.g&64||d.w)?D.a(N,d):d;d=H.a(c,Z);b=H.a(c,Y);c=H.a(c,yi);return Q(Cl(new W(null,3,5,X,[mj,new q(null,4,[Ai,"label",Z,d,Y,b,Rh,
-10],null),c],null)),ca(wc(a)))}return null}}}(a,b,c,d,e,f,g,k,l,m,n),null,null)}}(n,a,d,d,e,b,f,g,k,l,m)(e)}(),function(){return function(a,b,c,d,e,f,g,k,l,m,n){return function ca(O){return new Xd(null,function(a){return function(){for(;;){var b=w(O);if(b){if(pd(b)){var c=Ub(b),d=R(c),e=ae(d);a:for(var f=0;;)if(f<d){var g=G.a(c,f),g=new W(null,2,5,X,[ih,new q(null,3,[Ai,"area",Ki,zl(g),Di,a],null)],null);e.add(g);f+=1}else{c=!0;break a}return c?be(e.K(),ca(Vb(b))):be(e.K(),null)}e=J(b);return Q(new W(null,
2,5,X,[ih,new q(null,3,[Ai,"area",Ki,zl(e),Di,a],null)],null),ca(wc(b)))}return null}}}(a,b,c,d,e,f,g,k,l,m,n),null,null)}}(n,a,d,d,e,b,f,g,k,l,m)(d.b?d.b(gj):d.call(null,gj))}(),function(){return function(a,b,c,d,e,f,g,k,l,m,n){return function ca(O){return new Xd(null,function(a){return function(){for(;;){var b=w(O);if(b){if(pd(b)){var c=Ub(b),d=R(c),e=ae(d);a:for(var f=0;;)if(f<d){var g=G.a(c,f),g=Te(D.a(Bl,Pe(g)),new W(null,2,5,X,[1,Di],null),a);e.add(g);f+=1}else{c=!0;break a}return c?be(e.K(),
ca(Vb(b))):be(e.K(),null)}e=J(b);return Q(Te(D.a(Bl,Pe(e)),new W(null,2,5,X,[1,Di],null),a),ca(wc(b)))}return null}}}(a,b,c,d,e,f,g,k,l,m,n),null,null)}}(n,a,d,d,e,b,f,g,k,l,m)(d.b?d.b(Ji):d.call(null,Ji))}(),function(){return function(a,b,c,d,e,f,g,k,l,m,n){return function ca(O){return new Xd(null,function(a){return function(){for(;;){var b=w(O);if(b){if(pd(b)){var c=Ub(b),d=R(c),e=ae(d);a:for(var f=0;;)if(f<d){var g=G.a(c,f),g=new W(null,2,5,X,[ih,new q(null,3,[Ai,"stroke",Ki,zl(g),Di,a],null)],
null);e.add(g);f+=1}else{c=!0;break a}return c?be(e.K(),ca(Vb(b))):be(e.K(),null)}e=J(b);return Q(new W(null,2,5,X,[ih,new q(null,3,[Ai,"stroke",Ki,zl(e),Di,a],null)],null),ca(wc(b)))}return null}}}(a,b,c,d,e,f,g,k,l,m,n),null,null)}}(n,a,d,d,e,b,f,g,k,l,m)(d.b?d.b(Ni):d.call(null,Ni))}(),function(){return function(a,b,c,d,e,f,g,k,l,m,n){return function ca(O){return new Xd(null,function(a){return function(){for(;;){var b=w(O);if(b){if(pd(b)){var c=Ub(b),d=R(c),e=ae(d);a:for(var f=0;;)if(f<d){var g=
G.a(c,f),g=new W(null,2,5,X,[ih,new q(null,3,[Ai,"stroke",Ki,Al(g),Di,a],null)],null);e.add(g);f+=1}else{c=!0;break a}return c?be(e.K(),ca(Vb(b))):be(e.K(),null)}e=J(b);return Q(new W(null,2,5,X,[ih,new q(null,3,[Ai,"stroke",Ki,Al(e),Di,a],null)],null),ca(wc(b)))}return null}}}(a,b,c,d,e,f,g,k,l,m,n),null,null)}}(n,a,d,d,e,b,f,g,k,l,m)(d.b?d.b(bi):d.call(null,bi))}(),function(){return function(a,b,d,e,f,g,k,l,m,n,oa){return function ca(O){return new Xd(null,function(a,b,d,e,f,g,k,l,m,n,r){return function(){for(;;){var t=
w(O);if(t){var u=t;if(pd(u)){var v=Ub(u),z=R(v),C=ae(z);return function(){for(var F=0;;)if(F<z){var I=G.a(v,F),K=null!=I&&(I.g&64||I.w)?D.a(N,I):I,O=H.a(K,Z),V=H.a(K,Y),ca=H.a(K,$h);ce(C,new W(null,2,5,X,[Nh,jg.j(uc([x(ca)?new q(null,2,[Di,Jk(function(a,b,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,ma,K){return function(){var a=new W(null,2,5,X,[Vh,K],null);return c.b?c.b(a):c.call(null,a)}}(F,I,K,O,V,ca,v,z,C,u,t,a,b,d,e,f,g,k,l,m,n,r)),jh,function(){return function(){return c.b?c.b(Sh):c.call(null,Sh)}}(F,
I,K,O,V,ca,v,z,C,u,t,a,b,d,e,f,g,k,l,m,n,r)],null):new q(null,1,[Di,Jk(function(a,b,d,e,f,g,k,l,m,n,r,t,u,v,z,C,F,I,ma,K){return function(){var a=new W(null,2,5,X,[jj,K],null);return c.b?c.b(a):c.call(null,a)}}(F,I,K,O,V,ca,v,z,C,u,t,a,b,d,e,f,g,k,l,m,n,r))],null),new q(null,4,[Ai,"area",oh,5,xi,O,Bi,V],null)],0))],null));F+=1}else return!0}()?be(C.K(),ca(Vb(u))):be(C.K(),null)}var F=J(u),I=null!=F&&(F.g&64||F.w)?D.a(N,F):F,K=H.a(I,Z),V=H.a(I,Y),oa=H.a(I,$h);return Q(new W(null,2,5,X,[Nh,jg.j(uc([x(oa)?
new q(null,2,[Di,Jk(function(a,b,d,e,f,g,k,l,m,n,r,t,u,v,z,C){return function(){var a=new W(null,2,5,X,[Vh,C],null);return c.b?c.b(a):c.call(null,a)}}(F,I,K,V,oa,u,t,a,b,d,e,f,g,k,l,m,n,r)),jh,function(){return function(){return c.b?c.b(Sh):c.call(null,Sh)}}(F,I,K,V,oa,u,t,a,b,d,e,f,g,k,l,m,n,r)],null):new q(null,1,[Di,Jk(function(a,b,d,e,f,g,k,l,m,n,r,t,u,v,z,C){return function(){var a=new W(null,2,5,X,[jj,C],null);return c.b?c.b(a):c.call(null,a)}}(F,I,K,V,oa,u,t,a,b,d,e,f,g,k,l,m,n,r))],null),
new q(null,4,[Ai,"area",oh,5,xi,K,Bi,V],null)],0))],null),ca(wc(u)))}return null}}}(a,b,d,e,f,g,k,l,m,n,oa),null,null)}}(n,a,d,d,e,b,f,g,k,l,m)(e)}(),x(m)?function(){return function(a,b,c,d,e,f,g,k,l,m,n){return function ca(O){return new Xd(null,function(){return function(){for(;;){var a=w(O);if(a){if(pd(a)){var b=Ub(a),c=R(b),d=ae(c);a:for(var e=0;;)if(e<c){var f=G.a(b,e),g=null!=f&&(f.g&64||f.w)?D.a(N,f):f,f=H.a(g,Z),k=H.a(g,Y),g=H.a(g,gh),f=Za(L,Cl(new W(null,3,5,X,[mj,new q(null,4,[Ai,"role",
Z,f,Y,k,Rh,21],null),g],null)));d.add(f);e+=1}else{b=!0;break a}return b?be(d.K(),ca(Vb(a))):be(d.K(),null)}d=J(a);c=null!=d&&(d.g&64||d.w)?D.a(N,d):d;d=H.a(c,Z);b=H.a(c,Y);c=H.a(c,gh);return Q(Za(L,Cl(new W(null,3,5,X,[mj,new q(null,4,[Ai,"role",Z,d,Y,b,Rh,21],null),c],null))),ca(wc(a)))}return null}}}(a,b,c,d,e,f,g,k,l,m,n),null,null)}}(n,a,d,d,e,b,f,g,k,l,m)(d.b?d.b(pi):d.call(null,pi))}():null],null)}
function El(a){return function c(a){return new Xd(null,function(){for(;;){var e=w(a);if(e){if(pd(e)){var f=Ub(e),g=R(f),k=ae(g);a:for(var l=0;;)if(l<g){var m=G.a(f,l),m=new W(null,2,5,X,[ih,new q(null,2,[Ai,"guide",Ki,zl(m)],null)],null);k.add(m);l+=1}else{f=!0;break a}return f?be(k.K(),c(Vb(e))):be(k.K(),null)}k=J(e);return Q(new W(null,2,5,X,[ih,new q(null,2,[Ai,"guide",Ki,zl(k)],null)],null),c(wc(e)))}return null}},null,null)}(a.b?a.b(qi):a.call(null,qi))}
function Fl(a,b){var c=null!=b&&(b.g&64||b.w)?D.a(N,b):b,d=H.a(c,Yh),e=H.a(c,vh);return new W(null,3,5,X,[ni,new q(null,1,[Ai,[B("highlight "),B(Md(d))].join("")],null),function(){return function(a,b,c,d){return function n(e){return new Xd(null,function(){return function(){for(;;){var a=w(e);if(a){if(pd(a)){var b=Ub(a),c=R(b),d=ae(c);a:for(var f=0;;)if(f<c){var g=G.a(b,f),g=null!=g&&(g.g&64||g.w)?D.a(N,g):g,k=H.a(g,Z),l=H.a(g,Y);H.a(g,gh);d.add(new W(null,2,5,X,[Nh,new q(null,4,[Ai,"point",oh,7,xi,
k,Bi,l],null)],null));f+=1}else{b=!0;break a}return b?be(d.K(),n(Vb(a))):be(d.K(),null)}d=J(a);d=null!=d&&(d.g&64||d.w)?D.a(N,d):d;b=H.a(d,Z);c=H.a(d,Y);H.a(d,gh);return Q(new W(null,2,5,X,[Nh,new q(null,4,[Ai,"point",oh,7,xi,b,Bi,c],null)],null),n(wc(a)))}return null}}}(a,b,c,d),null,null)}}(b,c,d,e)(a.b?a.b(pi):a.call(null,pi))}()],null)}
function Gl(a){var b=Pk,c=null!=a&&(a.g&64||a.w)?D.a(N,a):a,d=H.a(c,mg),e=H.a(c,Bh),f=H.a(c,sh),g=H.a(c,Mh),k=H.a(c,$i),l=H.a(c,rh),m=we(zk,b);return new W(null,4,5,X,[Ti,new q(null,1,[ii,x(l)?"labeled":null],null),new W(null,3,5,X,[Lh,new q(null,1,[ii,"sidebar"],null),new W(null,8,5,X,[li,new q(null,1,[ii,"inside"],null),new W(null,3,5,X,[Ri,pe,"Taxicabland"],null),new W(null,3,5,X,[ij,new q(null,2,[zi,"explain",ej,"https://en.wikipedia.org/wiki/Taxicab_geometry"],null),"What is taxicab geometry?"],
null),new W(null,3,5,X,[li,new q(null,1,[zi,"tip"],null),"Select shapes to see what points define them."],null),tl(g,m),ul(c,m),new W(null,3,5,X,[ij,new q(null,2,[zi,"source",ej,"https://github.com/exupero/taxicabland"],null),"GitHub"],null)],null)],null),new W(null,3,5,X,[Lh,new q(null,1,[ii,"main"],null),new W(null,3,5,X,[li,new q(null,1,[ii,"maximize"],null),new W(null,4,5,X,[Gi,new q(null,4,[zi,"workspace",Qi,function(a,b,c,d,e,f){return function(b){return x(f)?(b=new W(null,2,5,X,[Th,ol(b.clientX,
b.clientY)],null),a.b?a.b(b):a.call(null,b)):null}}(m,a,c,c,d,e,f,g,k,l),jh,function(a){return function(){return a.b?a.b(Sh):a.call(null,Sh)}}(m,a,c,c,d,e,f,g,k,l),Di,function(a){return function(b){var c=X;b=ol(b.clientX,b.clientY);b=rl.b?rl.b(b):rl.call(null,b);c=new W(null,2,5,c,[wh,b],null);return a.b?a.b(c):a.call(null,c)}}(m,a,c,c,d,e,f,g,k,l)],null),vl(k),function(){var b=function(a){return function(b){return x(b.b?b.b(zi):b.call(null,zi))?Dl(fh.b?fh.b(b):fh.call(null,b),b,a):null}}(m,a,c,c,
d,e,f,g,k,l),r=U.a(we(wl,d),Hf(d));return Za(Za(Za(L,U.a(b,Me(sl,r))),function(){var a=J(Me(Xi,r));if(x(a)&&x(a.b?a.b(Yh):a.call(null,Yh))){var b=fh.b?fh.b(a):fh.call(null,a);return Za(Za(Za(L,Fl(b,a)),Dl(b,a,m)),El(b))}return null}()),U.a(b,Ne(Xi,Ne(sl,r))))}()],null)],null)],null)],null)};Ia();
function Hl(a,b){var c=null!=a&&(a.g&64||a.w)?D.a(N,a):a,d=H.a(c,Zh),e=S(d,0),d=null!=b&&(b.g&64||b.w)?D.a(N,b):b,f=H.a(d,zi);if(null==d)return c;var g=null==Se(c,new W(null,2,5,X,[mg,f],null));g&&(g=null!=d&&(d.g&64||d.w)?D.a(N,d):d,g=H.a(g,Yh),g=!vd(new qg(null,new q(null,5,[yh,null,Dh,null,Qh,null,si,null,Mi,null],null),null),g));return x(g)?Te(Ve(c,Zh),new W(null,2,5,X,[mg,f],null),T.c(d,vh,e)):x(Se(c,new W(null,2,5,X,[mg,f],null)))?(e=Se(c,new W(null,3,5,X,[mg,f,vh],null)),Te(c,new W(null,2,
5,X,[mg,f],null),T.c(d,vh,e))):Te(c,new W(null,2,5,X,[mg,f],null),d)}function Il(a,b){var c=null!=a&&(a.g&64||a.w)?D.a(N,a):a,d=H.a(c,Mh),d=null!=d&&(d.g&64||d.w)?D.a(N,d):d,d=H.a(d,Yi),e=d.b?d.b(b):d.call(null,b),d=S(e,0),e=S(e,1);return Hl(Te(c,new W(null,2,5,X,[Mh,Yi],null),d),e)}function Jl(a,b,c){return T.j(a,Z,b,uc([Y,c],0))}function Kl(){var a=pl(),b=Og(new q(null,1,[zh,3],null));saveSvgAsPng(a,"taxicab.png",b)}
function Ll(a,b,c){var d=b.b?b.b(a):b.call(null,a),e=lg(a);return We(T.c(jg.j(uc([a,null==d?null:qb(d)],0)),b,null==d?null:rb(d)),c,Zc,e)}function Ml(a){return 2>a?Bd:function(b){return Math.round(b/a)*a}}function Nl(a){a=null!=a&&(a.g&64||a.w)?D.a(N,a):a;var b=H.a(a,sh);return x(b)?T.c(Ue.u(a,new W(null,2,5,X,[mg,b],null),ed,Xi),sh,null):a}function Ol(a,b,c){return kc.a(b,c)?a:Te(T.c(Nl(a),sh,b),new W(null,3,5,X,[mg,b,Xi],null),!0)}
function Pl(a,b,c){var d=Jg("point"),e=Ml($i.b(a));return Il(Ve(T.c(Hl(Nl(We(a,Wh,Zc,lg(a))),new q(null,5,[zi,d,Yh,Mi,yi,J(a.b?a.b(lh):a.call(null,lh)),Z,e.b?e.b(b):e.call(null,b),Y,e.b?e.b(c):e.call(null,c)],null)),Bh,d),lh),d)}
function Nk(a,b){try{if(Vd(b,ki))return a;throw Ik;}catch(c){if(c instanceof Error)if(c===Ik)try{if(Vd(b,kj))return T.c(We(a,Wh,Zc,lg(a)),mg,pe);throw Ik;}catch(d){if(d instanceof Error)if(d===Ik)try{if(Vd(b,Vi))return Kl(),a;throw Ik;}catch(e){if(e instanceof Error)if(e===Ik)try{if(Vd(b,ri))return Ll(a,Wh,Uh);throw Ik;}catch(f){if(f instanceof Error)if(f===Ik)try{if(Vd(b,Ch))return Ll(a,Uh,Wh);throw Ik;}catch(g){if(g instanceof Error)if(g===Ik)try{if(md(b)&&2===R(b))try{var k=bd(b,0);if(Vd(k,dj)){var l=
bd(b,1);return T.c(a,rh,l)}throw Ik;}catch(m){if(m instanceof Error)if(l=m,l===Ik)try{k=bd(b,0);if(Vd(k,Gh)){var n=bd(b,1);return T.c(a,$i,n)}throw Ik;}catch(r){if(r instanceof Error)if(n=r,n===Ik)try{k=bd(b,0);if(Vd(k,Mh)){var t=bd(b,1);return T.c(a,Mh,t)}throw Ik;}catch(u){if(u instanceof Error){var v=u;if(v===Ik)try{if(k=bd(b,0),Vd(k,wh))try{var z=bd(b,1);if(md(z)&&2===R(z)){var C=bd(z,0),F=bd(z,1);return Pl(a,C,F)}throw Ik;}catch(I){if(I instanceof Error){var K=I;if(K===Ik)throw Ik;throw K;}throw I;
}else throw Ik;}catch(V){if(V instanceof Error)if(K=V,K===Ik)try{k=bd(b,0);if(Vd(k,Vh)){var oa=bd(b,1);return Il(T.c(We(a,Wh,Zc,lg(a)),Bh,oa),oa)}throw Ik;}catch(E){if(E instanceof Error)if(E===Ik)try{k=bd(b,0);if(Vd(k,Th)){var ca=bd(b,1),O=Bh.b(a);if(x(O)){var da=Ml($i.b(a));return Ue.D(a,new W(null,2,5,X,[mg,O],null),Jl,function(){var a=ca.x;return da.b?da.b(a):da.call(null,a)}(),function(){var a=ca.y;return da.b?da.b(a):da.call(null,a)}())}return a}throw Ik;}catch(ha){if(ha instanceof Error&&ha===
Ik)throw Ik;throw ha;}else throw E;else throw E;}else throw K;else throw V;}else throw v;}else throw u;}else throw n;else throw r;}else throw l;else throw m;}else throw Ik;}catch(la){if(la instanceof Error)if(l=la,l===Ik)try{if(Vd(b,Sh))return T.c(a,Bh,null);throw Ik;}catch(ma){if(ma instanceof Error)if(n=ma,n===Ik)try{if(md(b)&&2===R(b))try{var va=bd(b,0);if(Vd(va,jj)){var oa=bd(b,1),za=a.b?a.b(sh):a.call(null,sh);return Ol(Nl(a),oa,za)}throw Ik;}catch(Aa){if(Aa instanceof Error){v=Aa;if(v===Ik)throw Ik;
throw v;}throw Aa;}else throw Ik;}catch(Ba){if(Ba instanceof Error){v=Ba;if(v===Ik)throw Error([B("No matching clause: "),B(b)].join(""));throw v;}throw Ba;}else throw n;else throw ma;}else throw l;else throw la;}else throw g;else throw g;}else throw f;else throw f;}else throw e;else throw e;}else throw d;else throw d;}else throw c;else throw c;}}
var Ok=dd([lh,rh,sh,Bh,Mh,Uh,Wh,Zh,$i,mg],[He("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),!0,null,null,J(vj),$c,$c,He(U.a(function(a){return Wd.b([B("color"),B(a)].join(""))},new vg(null,1,10,1,null))),15,pe]);if("undefined"===typeof Pk)var Pk=wk(null);if("undefined"===typeof Ql)var Ql=Mk();
(function(a,b){var c=wk(1);dk(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!Vd(e,Xh)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Oj(c),d=Xh;else throw f;}if(!Vd(d,Xh))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.s=c;d.b=b;return d}()}(function(){return function(c){var d=c[1];return 1===d?(c[2]=null,c[1]=2,Xh):2===d?Kj(c,4,a):3===d?(d=c[2],Mj(c,d)):4===d?(d=c[7],d=c[2],c[7]=d,c[1]=x(d)?5:6,Xh):5===d?(d=c[7],d=b.b?b.b(d):b.call(null,d),c[8]=d,c[2]=null,c[1]=2,Xh):6===d?(c[2]=null,c[1]=7,Xh):7===d?(d=c[2],c[2]=d,c[1]=3,Xh):null}}(c),c)}(),f=function(){var a=e.s?e.s():e.call(null);a[6]=c;return a}();return Jj(f)}}(c));return c})(function(a,b){var c=Ad(b),d=wk(null),e=R(c),f=de(e),g=wk(1),
k=ze.b?ze.b(null):ze.call(null,null),l=Re(function(a,b,c,d,e,f){return function(g){return function(a,b,c,d,e,f){return function(a){d[g]=a;return 0===Ee.a(f,Hd)?zk.a(e,d.slice(0)):null}}(a,b,c,d,e,f)}}(c,d,e,f,g,k),new vg(null,0,e,1,null)),m=wk(1);dk(function(b,c,d,e,f,g,k,l){return function(){var m=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!Vd(e,Xh)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Oj(c),d=Xh;else throw f;}if(!Vd(d,
Xh))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.s=c;d.b=b;return d}()}(function(b,c,d,e,f,g,k,l){return function(b){var f=b[1];if(7===f)return b[2]=null,b[1]=8,Xh;if(1===f)return b[2]=null,b[1]=2,Xh;if(4===f){var m=b[7],f=m<e;b[1]=x(f)?6:7;return Xh}return 15===f?
(f=b[2],b[2]=f,b[1]=3,Xh):13===f?(f=Cj(d),b[2]=f,b[1]=15,Xh):6===f?(b[2]=null,b[1]=11,Xh):3===f?(f=b[2],Mj(b,f)):12===f?(f=b[8],f=b[2],m=se(La,f),b[8]=f,b[1]=x(m)?13:14,Xh):2===f?(f=De.a?De.a(k,e):De.call(null,k,e),b[9]=f,b[7]=0,b[2]=null,b[1]=4,Xh):11===f?(m=b[7],b[4]=new Nj(10,Object,null,9,b[4],null,null,null),f=c.b?c.b(m):c.call(null,m),m=l.b?l.b(m):l.call(null,m),f=xk(f,m),b[2]=f,Oj(b),Xh):9===f?(m=b[7],b[10]=b[2],b[7]=m+1,b[2]=null,b[1]=4,Xh):5===f?(b[11]=b[2],Kj(b,12,g)):14===f?(f=b[8],f=D.a(a,
f),Lj(b,d,f)):16===f?(b[12]=b[2],b[2]=null,b[1]=2,Xh):10===f?(m=b[2],f=Ee.a(k,Hd),b[13]=m,b[2]=f,Oj(b),Xh):8===f?(f=b[2],b[2]=f,b[1]=5,Xh):null}}(b,c,d,e,f,g,k,l),b,c,d,e,f,g,k,l)}(),K=function(){var a=m.s?m.s():m.call(null);a[6]=b;return a}();return Jj(K)}}(m,c,d,e,f,g,k,l));return d}(function(a){return Gl(a)},new W(null,1,5,X,[Ql],null)),function(a){var b=function(){var a=new VDOM.VText("");return ze.b?ze.b(a):ze.call(null,a)}(),c=function(){var a;a=P.b?P.b(b):P.call(null,b);a=Ck.b?Ck.b(a):Ck.call(null,
a);return ze.b?ze.b(a):ze.call(null,a)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.s?a.s():a.call(null)}}(b,c):function(){return function(a){return window.requestAnimationFrame(a)}}(b,c);a.appendChild(P.b?P.b(c):P.call(null,c));return function(a,b,c){return function(d){var l=Hk(d);d=function(){var b=P.b?P.b(a):P.call(null,a);return Ak.a?Ak.a(b,l):Ak.call(null,b,l)}();De.a?De.a(a,l):De.call(null,a,l);d=function(a,b,c,d){return function(){return Ee.c(d,Bk,b)}}(l,d,
a,b,c);return c.b?c.b(d):c.call(null,d)}}(b,c,d)}(document.body));
if("undefined"===typeof Rl)var Rl=function(){window.onresize=function(){return zk.a(Pk,ki)};var a=wk(1);dk(function(a){return function(){var c=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var f=a(c);if(!Vd(f,Xh)){d=f;break a}}}catch(g){if(g instanceof Object)c[5]=g,Oj(c),d=Xh;else throw g;}if(!Vd(d,Xh))return d}}function c(){var a=[null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.s=c;d.b=b;return d}()}(function(){return function(a){var b=a[1];if(1===b)return b=uk(),Kj(a,2,b);if(2===b){var b=a[2],c=zk.a(Pk,ki);a[7]=b;return Mj(a,c)}return null}}(a),a)}(),d=function(){var d=c.s?c.s():c.call(null);d[6]=a;return d}();return Jj(d)}}(a));return a}();