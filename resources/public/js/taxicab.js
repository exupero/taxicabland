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
            ;

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
            ;

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
            ;

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
            ;

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
            ;

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
            ;

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
            ;

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
            ;

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
            ;

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
            ;

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
            ;

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

/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
            ;var h,aa=this||self;function ba(a){var b=typeof a;return"object"!=b?b:a?Array.isArray(a)?"array":b:"null"}function ca(a){return Object.prototype.hasOwnProperty.call(a,ea)&&a[ea]||(a[ea]=++fa)}var ea="closure_uid_"+(1E9*Math.random()>>>0),fa=0;function ha(a,b,c){return a.call.apply(a.bind,arguments)}
function ja(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var e=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(e,d);return a.apply(b,e)}}return function(){return a.apply(b,arguments)}}function ka(a,b,c){ka=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ha:ja;return ka.apply(null,arguments)};function la(a){const b=[];let c=0;for(const d in a)b[c++]=d;return b};function ma(a){const b=a.length;if(0<b){const c=Array(b);for(let d=0;d<b;d++)c[d]=a[d];return c}return[]}function na(a,b){a.sort(b||pa)}function qa(a,b){const c=Array(a.length);for(let e=0;e<a.length;e++)c[e]={index:e,value:a[e]};const d=b||pa;na(c,function(e,f){return d(e.value,f.value)||e.index-f.index});for(b=0;b<a.length;b++)a[b]=c[b].value}function pa(a,b){return a>b?1:a<b?-1:0};var ra;a:{const a=aa.navigator;if(a){const b=a.userAgent;if(b){ra=b;break a}}ra=""}let sa=ra;function ta(a){return-1!=sa.indexOf(a)};function ua(a,b){null!=a&&this.append.apply(this,arguments)}h=ua.prototype;h.eb="";h.set=function(a){this.eb=""+a};h.append=function(a,b,c){this.eb+=String(a);if(null!=b)for(let d=1;d<arguments.length;d++)this.eb+=arguments[d];return this};h.clear=function(){this.eb=""};h.toString=function(){return this.eb};var va={},xa={},ya;if("undefined"===typeof va||"undefined"===typeof xa||"undefined"===typeof q)var q={};if("undefined"===typeof va||"undefined"===typeof xa||"undefined"===typeof za)var za=null;if("undefined"===typeof va||"undefined"===typeof xa||"undefined"===typeof Aa)var Aa=null;var Ba=null;if("undefined"===typeof va||"undefined"===typeof xa||"undefined"===typeof Ca)var Ca=null;function Da(){return new u(null,5,[Ea,!0,Fa,!0,Ha,!1,Ia,!1,Ja,null],null)}
function Ka(){za=function(){var a=arguments;return console.log.apply(console,ma.call(null,a))};Aa=function(){var a=arguments;return console.error.apply(console,ma.call(null,a))}}function F(a){return null!=a&&!1!==a}function La(a){return null==a}function Ma(a){return a instanceof Array}function Na(a){return null==a?!0:!1===a?!0:!1}function Oa(a,b){return a[ba(null==b?null:b)]?!0:a._?!0:!1}
function Pa(a,b){var c=null==b?null:b.constructor;return Error(["No protocol method ",a," defined for type ",F(F(c)?c.Eb:c)?c.gb:ba(b),": ",b].join(""))}function Qa(a){var b=a.gb;return F(b)?b:G.h(a)}var Ra="undefined"!==typeof Symbol&&"function"===ba(Symbol)?Symbol.iterator:"@@iterator";function Sa(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}function Ta(a){return Ua(function(b,c){b.push(c);return b},[],a)}function Va(){}
function Wa(a){if(null!=a&&null!=a.Y)a=a.Y(a);else{var b=Wa[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=Wa._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("ICounted.-count",a);}return a}function Xa(){}function Ya(a){if(null!=a&&null!=a.da)a=a.da(a);else{var b=Ya[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=Ya._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("IEmptyableCollection.-empty",a);}return a}function Za(){}
function $a(a,b){if(null!=a&&null!=a.ca)a=a.ca(a,b);else{var c=$a[ba(null==a?null:a)];if(null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else if(c=$a._,null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else throw Pa("ICollection.-conj",a);}return a}function ab(){}
var cb=function(){function a(d,e,f){var g=bb[ba(null==d?null:d)];if(null!=g)return g.j?g.j(d,e,f):g.call(null,d,e,f);g=bb._;if(null!=g)return g.j?g.j(d,e,f):g.call(null,d,e,f);throw Pa("IIndexed.-nth",d);}function b(d,e){var f=bb[ba(null==d?null:d)];if(null!=f)return f.g?f.g(d,e):f.call(null,d,e);f=bb._;if(null!=f)return f.g?f.g(d,e):f.call(null,d,e);throw Pa("IIndexed.-nth",d);}var c=null;c=function(d,e,f){switch(arguments.length){case 2:return b.call(this,d,e);case 3:return a.call(this,d,e,f)}throw Error("Invalid arity: "+
arguments.length);};c.g=b;c.j=a;return c}(),bb=function bb(a){switch(arguments.length){case 2:return bb.g(arguments[0],arguments[1]);case 3:return bb.j(arguments[0],arguments[1],arguments[2]);default:throw Error(["Invalid arity: ",G.h(arguments.length)].join(""));}};bb.g=function(a,b){return null!=a&&null!=a.$?a.$(a,b):cb.g(a,b)};bb.j=function(a,b,c){return null!=a&&null!=a.Ea?a.Ea(a,b,c):cb.j(a,b,c)};bb.K=3;function db(){}
function eb(a){if(null!=a&&null!=a.ga)a=a.ga(a);else{var b=eb[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=eb._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("ISeq.-first",a);}return a}function gb(a){if(null!=a&&null!=a.ha)a=a.ha(a);else{var b=gb[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=gb._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("ISeq.-rest",a);}return a}function hb(){}
function ib(a){if(null!=a&&null!=a.ba)a=a.ba(a);else{var b=ib[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=ib._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("INext.-next",a);}return a}function jb(){}
var lb=function(){function a(d,e,f){var g=kb[ba(null==d?null:d)];if(null!=g)return g.j?g.j(d,e,f):g.call(null,d,e,f);g=kb._;if(null!=g)return g.j?g.j(d,e,f):g.call(null,d,e,f);throw Pa("ILookup.-lookup",d);}function b(d,e){var f=kb[ba(null==d?null:d)];if(null!=f)return f.g?f.g(d,e):f.call(null,d,e);f=kb._;if(null!=f)return f.g?f.g(d,e):f.call(null,d,e);throw Pa("ILookup.-lookup",d);}var c=null;c=function(d,e,f){switch(arguments.length){case 2:return b.call(this,d,e);case 3:return a.call(this,d,e,
f)}throw Error("Invalid arity: "+arguments.length);};c.g=b;c.j=a;return c}(),kb=function kb(a){switch(arguments.length){case 2:return kb.g(arguments[0],arguments[1]);case 3:return kb.j(arguments[0],arguments[1],arguments[2]);default:throw Error(["Invalid arity: ",G.h(arguments.length)].join(""));}};kb.g=function(a,b){return null!=a&&null!=a.aa?a.aa(a,b):lb.g(a,b)};kb.j=function(a,b,c){return null!=a&&null!=a.J?a.J(a,b,c):lb.j(a,b,c)};kb.K=3;function mb(){}
function nb(a,b){if(null!=a&&null!=a.fb)a=a.fb(a,b);else{var c=nb[ba(null==a?null:a)];if(null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else if(c=nb._,null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else throw Pa("IAssociative.-contains-key?",a);}return a}function ob(a,b,c){if(null!=a&&null!=a.Ua)a=a.Ua(a,b,c);else{var d=ob[ba(null==a?null:a)];if(null!=d)a=d.j?d.j(a,b,c):d.call(null,a,b,c);else if(d=ob._,null!=d)a=d.j?d.j(a,b,c):d.call(null,a,b,c);else throw Pa("IAssociative.-assoc",a);}return a}
function pb(a,b){if(null!=a&&null!=a.vb)a=a.vb(a,b);else{var c=pb[ba(null==a?null:a)];if(null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else if(c=pb._,null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else throw Pa("IFind.-find",a);}return a}function qb(){}function rb(a,b){if(null!=a&&null!=a.Sb)a=a.Sb(a,b);else{var c=rb[ba(null==a?null:a)];if(null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else if(c=rb._,null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else throw Pa("IMap.-dissoc",a);}return a}
function sb(a){if(null!=a&&null!=a.xc)a=a.key;else{var b=sb[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=sb._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("IMapEntry.-key",a);}return a}function tb(a){if(null!=a&&null!=a.yc)a=a.D;else{var b=tb[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=tb._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("IMapEntry.-val",a);}return a}function ub(){}
function vb(a){if(null!=a&&null!=a.Ab)a=a.Ab(a);else{var b=vb[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=vb._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("IStack.-peek",a);}return a}function wb(a){if(null!=a&&null!=a.Bb)a=a.Bb(a);else{var b=wb[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=wb._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("IStack.-pop",a);}return a}function xb(){}
function yb(a){if(null!=a&&null!=a.Rb)a=a.Rb(a);else{var b=yb[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=yb._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("IDeref.-deref",a);}return a}function zb(){}function Ab(a){if(null!=a&&null!=a.T)a=a.T(a);else{var b=Ab[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=Ab._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("IMeta.-meta",a);}return a}
function Bb(a,b){if(null!=a&&null!=a.X)a=a.X(a,b);else{var c=Bb[ba(null==a?null:a)];if(null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else if(c=Bb._,null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else throw Pa("IWithMeta.-with-meta",a);}return a}function Cb(){}
var Eb=function(){function a(d,e,f){var g=Db[ba(null==d?null:d)];if(null!=g)return g.j?g.j(d,e,f):g.call(null,d,e,f);g=Db._;if(null!=g)return g.j?g.j(d,e,f):g.call(null,d,e,f);throw Pa("IReduce.-reduce",d);}function b(d,e){var f=Db[ba(null==d?null:d)];if(null!=f)return f.g?f.g(d,e):f.call(null,d,e);f=Db._;if(null!=f)return f.g?f.g(d,e):f.call(null,d,e);throw Pa("IReduce.-reduce",d);}var c=null;c=function(d,e,f){switch(arguments.length){case 2:return b.call(this,d,e);case 3:return a.call(this,d,e,
f)}throw Error("Invalid arity: "+arguments.length);};c.g=b;c.j=a;return c}(),Db=function Db(a){switch(arguments.length){case 2:return Db.g(arguments[0],arguments[1]);case 3:return Db.j(arguments[0],arguments[1],arguments[2]);default:throw Error(["Invalid arity: ",G.h(arguments.length)].join(""));}};Db.g=function(a,b){return null!=a&&null!=a.ja?a.ja(a,b):Eb.g(a,b)};Db.j=function(a,b,c){return null!=a&&null!=a.ka?a.ka(a,b,c):Eb.j(a,b,c)};Db.K=3;function Fb(){}
function Gb(a,b){if(null!=a&&null!=a.wb)a=a.wb(a,b,!0);else{var c=Gb[ba(null==a?null:a)];if(null!=c)a=c.j?c.j(a,b,!0):c.call(null,a,b,!0);else if(c=Gb._,null!=c)a=c.j?c.j(a,b,!0):c.call(null,a,b,!0);else throw Pa("IKVReduce.-kv-reduce",a);}return a}function Hb(a,b){if(null!=a&&null!=a.H)a=a.H(a,b);else{var c=Hb[ba(null==a?null:a)];if(null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else if(c=Hb._,null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else throw Pa("IEquiv.-equiv",a);}return a}
function Ib(a){if(null!=a&&null!=a.Z)a=a.Z(a);else{var b=Ib[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=Ib._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("IHash.-hash",a);}return a}function Jb(){}function Kb(a){if(null!=a&&null!=a.S)a=a.S(a);else{var b=Kb[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=Kb._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("ISeqable.-seq",a);}return a}function Lb(){}function Mb(){}function Nb(){}
function Ob(a,b){if(null!=a&&null!=a.kc)a=a.kc(a,b);else{var c=Ob[ba(null==a?null:a)];if(null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else if(c=Ob._,null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else throw Pa("IWriter.-write",a);}return a}function Pb(){}function Qb(a,b,c){if(null!=a&&null!=a.U)a=a.U(a,b,c);else{var d=Qb[ba(null==a?null:a)];if(null!=d)a=d.j?d.j(a,b,c):d.call(null,a,b,c);else if(d=Qb._,null!=d)a=d.j?d.j(a,b,c):d.call(null,a,b,c);else throw Pa("IPrintWithWriter.-pr-writer",a);}return a}
function Rb(a){if(null!=a&&null!=a.mb)a=a.mb(a);else{var b=Rb[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=Rb._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("IEditableCollection.-as-transient",a);}return a}function Sb(a,b){if(null!=a&&null!=a.pb)a=a.pb(a,b);else{var c=Sb[ba(null==a?null:a)];if(null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else if(c=Sb._,null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else throw Pa("ITransientCollection.-conj!",a);}return a}
function Tb(a){if(null!=a&&null!=a.Cb)a=a.Cb(a);else{var b=Tb[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=Tb._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("ITransientCollection.-persistent!",a);}return a}function Ub(a,b,c){if(null!=a&&null!=a.ob)a=a.ob(a,b,c);else{var d=Ub[ba(null==a?null:a)];if(null!=d)a=d.j?d.j(a,b,c):d.call(null,a,b,c);else if(d=Ub._,null!=d)a=d.j?d.j(a,b,c):d.call(null,a,b,c);else throw Pa("ITransientAssociative.-assoc!",a);}return a}
function Vb(){}function Wb(a,b){if(null!=a&&null!=a.lb)a=a.lb(a,b);else{var c=Wb[ba(null==a?null:a)];if(null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else if(c=Wb._,null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else throw Pa("IComparable.-compare",a);}return a}function Xb(a){if(null!=a&&null!=a.bc)a=a.bc(a);else{var b=Xb[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=Xb._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("IChunk.-drop-first",a);}return a}
function Yb(a){if(null!=a&&null!=a.tb)a=a.tb(a);else{var b=Yb[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=Yb._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("IChunkedSeq.-chunked-first",a);}return a}function Zb(a){if(null!=a&&null!=a.ab)a=a.ab(a);else{var b=Zb[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=Zb._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("IChunkedSeq.-chunked-rest",a);}return a}
function $b(a){if(null!=a&&null!=a.xb)a=a.xb(a);else{var b=$b[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=$b._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("INamed.-name",a);}return a}function ac(a){if(null!=a&&null!=a.yb)a=a.yb(a);else{var b=ac[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=ac._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("INamed.-namespace",a);}return a}
function bc(a,b){if(null!=a&&null!=a.Cc)a=a.Cc(a,b);else{var c=bc[ba(null==a?null:a)];if(null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else if(c=bc._,null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else throw Pa("IReset.-reset!",a);}return a}
var ec=function(){function a(f,g,k,l,m){var n=dc[ba(null==f?null:f)];if(null!=n)return n.P?n.P(f,g,k,l,m):n.call(null,f,g,k,l,m);n=dc._;if(null!=n)return n.P?n.P(f,g,k,l,m):n.call(null,f,g,k,l,m);throw Pa("ISwap.-swap!",f);}function b(f,g,k,l){var m=dc[ba(null==f?null:f)];if(null!=m)return m.G?m.G(f,g,k,l):m.call(null,f,g,k,l);m=dc._;if(null!=m)return m.G?m.G(f,g,k,l):m.call(null,f,g,k,l);throw Pa("ISwap.-swap!",f);}function c(f,g,k){var l=dc[ba(null==f?null:f)];if(null!=l)return l.j?l.j(f,g,k):l.call(null,
f,g,k);l=dc._;if(null!=l)return l.j?l.j(f,g,k):l.call(null,f,g,k);throw Pa("ISwap.-swap!",f);}function d(f,g){var k=dc[ba(null==f?null:f)];if(null!=k)return k.g?k.g(f,g):k.call(null,f,g);k=dc._;if(null!=k)return k.g?k.g(f,g):k.call(null,f,g);throw Pa("ISwap.-swap!",f);}var e=null;e=function(f,g,k,l,m){switch(arguments.length){case 2:return d.call(this,f,g);case 3:return c.call(this,f,g,k);case 4:return b.call(this,f,g,k,l);case 5:return a.call(this,f,g,k,l,m)}throw Error("Invalid arity: "+arguments.length);
};e.g=d;e.j=c;e.G=b;e.P=a;return e}(),dc=function dc(a){switch(arguments.length){case 2:return dc.g(arguments[0],arguments[1]);case 3:return dc.j(arguments[0],arguments[1],arguments[2]);case 4:return dc.G(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return dc.P(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error(["Invalid arity: ",G.h(arguments.length)].join(""));}};dc.g=function(a,b){return null!=a&&null!=a.Ec?a.Ec(a,b):ec.g(a,b)};
dc.j=function(a,b,c){return null!=a&&null!=a.Fc?a.Fc(a,b,c):ec.j(a,b,c)};dc.G=function(a,b,c,d){return null!=a&&null!=a.Gc?a.Gc(a,b,c,d):ec.G(a,b,c,d)};dc.P=function(a,b,c,d,e){return null!=a&&null!=a.Hc?a.Hc(a,b,c,d,e):ec.P(a,b,c,d,e)};dc.K=5;function fc(){}function gc(a){if(null!=a&&null!=a.Ga)a=a.Ga(a);else{var b=gc[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=gc._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("IIterable.-iterator",a);}return a}
function hc(a){this.Rc=a;this.o=1073741824;this.F=0}hc.prototype.kc=function(a,b){return this.Rc.append(b)};function ic(a){var b=new ua;a.U(null,new hc(b),Da());return G.h(b)}var jc="undefined"!==typeof Math&&"undefined"!==typeof Math.imul?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function kc(a){a=jc(a|0,-862048943);return jc(a<<15|a>>>-15,461845907)}
function lc(a,b){a=(a|0)^(b|0);return jc(a<<13|a>>>-13,5)+-430675100|0}function mc(a,b){a=(a|0)^b;a=jc(a^a>>>16,-2048144789);a=jc(a^a>>>13,-1028477387);return a^a>>>16}function nc(a){a:{var b=1;for(var c=0;;)if(b<a.length){var d=b+2;c=lc(c,kc(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^kc(a.charCodeAt(a.length-1)):b;return mc(b,jc(2,a.length))}var oc={},pc=0;
function qc(a){255<pc&&(oc={},pc=0);if(null==a)return 0;var b=oc[a];if("number"===typeof b)a=b;else{a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b){var e=c+1;d=jc(31,d)+a.charCodeAt(c);c=e}else{b=d;break a}else b=0;else b=0;oc[a]=b;pc+=1;a=b}return a}
function rc(a){if(null!=a&&(a.o&4194304||q===a.Xc))return a.Z(null)^0;if("number"===typeof a){if(isFinite(a))return Math.floor(a)%2147483647;switch(a){case Infinity:return 2146435072;case -Infinity:return-1048576;default:return 2146959360}}else return!0===a?a=1231:!1===a?a=1237:"string"===typeof a?(a=qc(a),0!==a&&(a=kc(a),a=lc(0,a),a=mc(a,4))):a=a instanceof Date?a.valueOf()^0:null==a?0:Ib(a)^0,a}function sc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}
function tc(a,b){if(a.Va===b.Va)return 0;var c=Na(a.Ca);if(F(c?b.Ca:c))return-1;if(F(a.Ca)){if(Na(b.Ca))return 1;c=pa.call(null,a.Ca,b.Ca);return 0===c?pa.call(null,a.name,b.name):c}return pa.call(null,a.name,b.name)}function uc(a,b,c,d,e){this.Ca=a;this.name=b;this.Va=c;this.kb=d;this.Ta=e;this.o=2154168321;this.F=4096}h=uc.prototype;h.toString=function(){return this.Va};h.equiv=function(a){return this.H(null,a)};h.H=function(a,b){return b instanceof uc?this.Va===b.Va:!1};
h.call=function(){var a=null;a=function(b,c,d){switch(arguments.length){case 2:return H.g(c,this);case 3:return H.j(c,this,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.g=function(b,c){return H.g(c,this)};a.j=function(b,c,d){return H.j(c,this,d)};return a}();h.apply=function(a,b){var c=Sa(b);a=this.call;b=a.apply;var d=[this],e=d.concat;if(20<c.length){var f=c.slice(0,20);f.push(c.slice(20));c=f}return b.call(a,this,e.call(d,c))};h.h=function(a){return H.g(a,this)};
h.g=function(a,b){return H.j(a,this,b)};h.T=function(){return this.Ta};h.X=function(a,b){return new uc(this.Ca,this.name,this.Va,this.kb,b)};h.Z=function(){var a=this.kb;return null!=a?a:this.kb=a=sc(nc(this.name),qc(this.Ca))};h.xb=function(){return this.name};h.yb=function(){return this.Ca};h.U=function(a,b){return Ob(b,this.Va)};
var vc=function vc(a){switch(arguments.length){case 1:return vc.h(arguments[0]);case 2:return vc.g(arguments[0],arguments[1]);default:throw Error(["Invalid arity: ",G.h(arguments.length)].join(""));}};vc.h=function(a){for(;;){if(a instanceof uc)return a;if("string"===typeof a){var b=a.indexOf("/");return 1>b?vc.g(null,a):vc.g(a.substring(0,b),a.substring(b+1,a.length))}if(a instanceof I)a=a.Ha;else throw Error("no conversion to symbol");}};
vc.g=function(a,b){var c=null!=a?[G.h(a),"/",G.h(b)].join(""):b;return new uc(a,b,c,null,null)};vc.K=2;function wc(a){return null!=a?a.F&131072||q===a.Yc?!0:a.F?!1:Oa(fc,a):Oa(fc,a)}function K(a){if(null==a)return null;if(null!=a&&(a.o&8388608||q===a.Dc))return a.S(null);if(Ma(a)||"string"===typeof a)return 0===a.length?null:new xc(a,0,null);if(null!=a&&null!=a[Ra])return yc((null!==a&&Ra in a?a[Ra]:void 0).call(a));if(Oa(Jb,a))return Kb(a);throw Error([G.h(a)," is not ISeqable"].join(""));}
function L(a){if(null==a)return null;if(null!=a&&(a.o&64||q===a.nb))return a.ga(null);a=K(a);return null==a?null:eb(a)}function zc(a){return null!=a?null!=a&&(a.o&64||q===a.nb)?a.ha(null):(a=K(a))?a.ha(null):Ac:Ac}function O(a){return null==a?null:null!=a&&(a.o&128||q===a.zb)?a.ba(null):K(zc(a))}
var Bc=function Bc(a){switch(arguments.length){case 1:return Bc.h(arguments[0]);case 2:return Bc.g(arguments[0],arguments[1]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Bc.v(arguments[0],arguments[1],new xc(c.slice(2),0,null))}};Bc.h=function(){return!0};Bc.g=function(a,b){return null==a?null==b:a===b||Hb(a,b)};Bc.v=function(a,b,c){for(;;)if(Bc.g(a,b))if(O(c))a=b,b=L(c),c=O(c);else return Bc.g(b,L(c));else return!1};
Bc.L=function(a){var b=L(a),c=O(a);a=L(c);c=O(c);return this.v(b,a,c)};Bc.K=2;function Cc(a){this.M=a}Cc.prototype.next=function(){if(null!=this.M){var a=L(this.M);this.M=O(this.M);return{value:a,done:!1}}return{value:null,done:!0}};function Dc(a){return new Cc(K(a))}function Ec(a,b){this.value=a;this.Lb=b;this.$b=null;this.o=8388672;this.F=0}Ec.prototype.S=function(){return this};Ec.prototype.ga=function(){return this.value};Ec.prototype.ha=function(){null==this.$b&&(this.$b=yc(this.Lb));return this.$b};
function yc(a){var b=a.next();return F(b.done)?null:new Ec(b.value,a)}function Fc(a,b){a=kc(a);a=lc(0,a);return mc(a,b)}function Gc(a){var b=0,c=1;for(a=K(a);;)if(null!=a)b+=1,c=jc(31,c)+rc(L(a))|0,a=O(a);else return Fc(c,b)}var Hc=Fc(1,0);function Ic(a){var b=0,c=0;for(a=K(a);;)if(null!=a)b+=1,c=c+rc(L(a))|0,a=O(a);else return Fc(c,b)}var Jc=Fc(0,0);Va["null"]=!0;Wa["null"]=function(){return 0};Date.prototype.H=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};
Date.prototype.ub=q;Date.prototype.lb=function(a,b){if(b instanceof Date)return pa.call(null,this.valueOf(),b.valueOf());throw Error(["Cannot compare ",G.h(this)," to ",G.h(b)].join(""));};Hb.number=function(a,b){return a===b};zb["function"]=!0;Ab["function"]=function(){return null};Ib._=function(a){return ca(a)};function Kc(a){return a+1}function Lc(){this.D=!1;this.o=32768;this.F=0}Lc.prototype.Rb=function(){return this.D};function Mc(a){return a instanceof Lc}
function Nc(a,b){var c=a.Y(null);if(0===c)return b.B?b.B():b.call(null);for(var d=a.$(null,0),e=1;;)if(e<c){var f=a.$(null,e);d=b.g?b.g(d,f):b.call(null,d,f);if(Mc(d))return yb(d);e+=1}else return d}function Oc(a,b){var c=a.length;if(0===a.length)return b.B?b.B():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e];d=b.g?b.g(d,f):b.call(null,d,f);if(Mc(d))return yb(d);e+=1}else return d}
function Qc(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c];e=b.g?b.g(e,f):b.call(null,e,f);if(Mc(e))return yb(e);c+=1}else return e}function Rc(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.g?b.g(c,f):b.call(null,c,f);if(Mc(c))return yb(c);d+=1}else return c}function Sc(a){return null!=a?a.o&2||q===a.sc?!0:a.o?!1:Oa(Va,a):Oa(Va,a)}function Tc(a){return null!=a?a.o&16||q===a.ic?!0:a.o?!1:Oa(ab,a):Oa(ab,a)}
function Uc(a,b,c){var d=Vc(a);if(c>=d)return-1;!(0<c)&&0>c&&(c+=d,c=0>c?0:c);for(;;)if(c<d){if(Bc.g(Wc(a,c),b))return c;c+=1}else return-1}function Xc(a,b,c){var d=Vc(a);if(0===d)return-1;0<c?(--d,c=d<c?d:c):c=0>c?d+c:c;for(;;)if(0<=c){if(Bc.g(Wc(a,c),b))return c;--c}else return-1}function Yc(a,b){this.i=a;this.u=b}Yc.prototype.la=function(){return this.u<this.i.length};Yc.prototype.next=function(){var a=this.i[this.u];this.u+=1;return a};
function xc(a,b,c){this.i=a;this.u=b;this.A=c;this.o=166592766;this.F=139264}h=xc.prototype;h.toString=function(){return ic(this)};h.equiv=function(a){return this.H(null,a)};h.indexOf=function(){var a=null;a=function(b,c){switch(arguments.length){case 1:return Uc(this,b,0);case 2:return Uc(this,b,c)}throw Error("Invalid arity: "+arguments.length);};a.h=function(b){return Uc(this,b,0)};a.g=function(b,c){return Uc(this,b,c)};return a}();
h.lastIndexOf=function(){function a(c){return Xc(this,c,Vc(this))}var b=null;b=function(c,d){switch(arguments.length){case 1:return a.call(this,c);case 2:return Xc(this,c,d)}throw Error("Invalid arity: "+arguments.length);};b.h=a;b.g=function(c,d){return Xc(this,c,d)};return b}();h.$=function(a,b){a=b+this.u;if(0<=a&&a<this.i.length)return this.i[a];throw Error("Index out of bounds");};h.Ea=function(a,b,c){a=b+this.u;return 0<=a&&a<this.i.length?this.i[a]:c};h.Ga=function(){return new Yc(this.i,this.u)};
h.T=function(){return this.A};h.ba=function(){return this.u+1<this.i.length?new xc(this.i,this.u+1,null):null};h.Y=function(){var a=this.i.length-this.u;return 0>a?0:a};h.Z=function(){return Gc(this)};h.H=function(a,b){return Zc(this,b)};h.da=function(){return Ac};h.ja=function(a,b){return Rc(this.i,b,this.i[this.u],this.u+1)};h.ka=function(a,b,c){return Rc(this.i,b,c,this.u)};h.ga=function(){return this.i[this.u]};h.ha=function(){return this.u+1<this.i.length?new xc(this.i,this.u+1,null):Ac};
h.S=function(){return this.u<this.i.length?this:null};h.X=function(a,b){return b===this.A?this:new xc(this.i,this.u,b)};h.ca=function(a,b){return $c(b,this)};xc.prototype[Ra]=function(){return Dc(this)};function ad(a){return 0<a.length?new xc(a,0,null):null}Hb._=function(a,b){return a===b};
var bd=function bd(a){switch(arguments.length){case 0:return bd.B();case 1:return bd.h(arguments[0]);case 2:return bd.g(arguments[0],arguments[1]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return bd.v(arguments[0],arguments[1],new xc(c.slice(2),0,null))}};bd.B=function(){return cd};bd.h=function(a){return a};bd.g=function(a,b){return null!=a?$a(a,b):new dd(null,b,null,1,null)};
bd.v=function(a,b,c){for(;;)if(F(c))a=bd.g(a,b),b=L(c),c=O(c);else return bd.g(a,b)};bd.L=function(a){var b=L(a),c=O(a);a=L(c);c=O(c);return this.v(b,a,c)};bd.K=2;function ed(a){return null==a?null:null!=a&&(a.o&4||q===a.tc)?a.da(null):(null!=a?a.o&4||q===a.tc||(a.o?0:Oa(Xa,a)):Oa(Xa,a))?Ya(a):null}
function Vc(a){if(null!=a)if(null!=a&&(a.o&2||q===a.sc))a=a.Y(null);else if(Ma(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.o&8388608||q===a.Dc))a:{a=K(a);for(var b=0;;){if(Sc(a)){a=b+Wa(a);break a}a=O(a);b+=1}}else a=Wa(a);else a=0;return a}function fd(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return K(a)?L(a):c;if(Tc(a))return bb.j(a,b,c);if(K(a))a=O(a),--b;else return c}}
function Wc(a,b){if("number"!==typeof b)throw Error("Index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.o&16||q===a.ic))return a.$(null,b);if(Ma(a)){if(-1<b&&b<a.length)return a[b|0];throw Error("Index out of bounds");}if("string"===typeof a){if(-1<b&&b<a.length)return a.charAt(b|0);throw Error("Index out of bounds");}if(null!=a&&(a.o&64||q===a.nb)||null!=a&&(a.o&16777216||q===a.jc)){if(0>b)throw Error("Index out of bounds");a:for(;;){if(null==a)throw Error("Index out of bounds");
if(0===b){if(K(a)){a=L(a);break a}throw Error("Index out of bounds");}if(Tc(a)){a=bb.g(a,b);break a}if(K(a))a=O(a),--b;else throw Error("Index out of bounds");}return a}if(Oa(ab,a))return bb.g(a,b);throw Error(["nth not supported on this type ",G.h(Qa(null==a?null:a.constructor))].join(""));}
function gd(a,b){if("number"!==typeof b)throw Error("Index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.o&16||q===a.ic))return a.Ea(null,b,null);if(Ma(a))return-1<b&&b<a.length?a[b|0]:null;if("string"===typeof a)return-1<b&&b<a.length?a.charAt(b|0):null;if(null!=a&&(a.o&64||q===a.nb)||null!=a&&(a.o&16777216||q===a.jc))return 0>b?null:fd(a,b);if(Oa(ab,a))return bb.j(a,b,null);throw Error(["nth not supported on this type ",G.h(Qa(null==a?null:a.constructor))].join(""));
}var H=function H(a){switch(arguments.length){case 2:return H.g(arguments[0],arguments[1]);case 3:return H.j(arguments[0],arguments[1],arguments[2]);default:throw Error(["Invalid arity: ",G.h(arguments.length)].join(""));}};H.g=function(a,b){return null==a?null:null!=a&&(a.o&256||q===a.wc)?a.aa(null,b):Ma(a)?null!=b&&b<a.length?a[b|0]:null:"string"===typeof a?null!=b&&-1<b&&b<a.length?a.charAt(b|0):null:Oa(jb,a)?kb.g(a,b):null};
H.j=function(a,b,c){return null!=a?null!=a&&(a.o&256||q===a.wc)?a.J(null,b,c):Ma(a)?null!=b&&-1<b&&b<a.length?a[b|0]:c:"string"===typeof a?null!=b&&-1<b&&b<a.length?a.charAt(b|0):c:Oa(jb,a)?kb.j(a,b,c):c:c};H.K=3;var hd=function hd(a){switch(arguments.length){case 3:return hd.j(arguments[0],arguments[1],arguments[2]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return hd.v(arguments[0],arguments[1],arguments[2],new xc(c.slice(3),0,null))}};
hd.j=function(a,b,c){return null!=a&&(a.o&512||q===a.rc)?a.Ua(null,b,c):null!=a?ob(a,b,c):id([b,c])};hd.v=function(a,b,c,d){for(;;)if(a=hd.j(a,b,c),F(d))b=L(d),c=L(O(d)),d=O(O(d));else return a};hd.L=function(a){var b=L(a),c=O(a);a=L(c);var d=O(c);c=L(d);d=O(d);return this.v(b,a,c,d)};hd.K=3;
var jd=function jd(a){switch(arguments.length){case 1:return jd.h(arguments[0]);case 2:return jd.g(arguments[0],arguments[1]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return jd.v(arguments[0],arguments[1],new xc(c.slice(2),0,null))}};jd.h=function(a){return a};jd.g=function(a,b){return null==a?null:rb(a,b)};jd.v=function(a,b,c){for(;;){if(null==a)return null;a=jd.g(a,b);if(F(c))b=L(c),c=O(c);else return a}};
jd.L=function(a){var b=L(a),c=O(a);a=L(c);c=O(c);return this.v(b,a,c)};jd.K=2;function kd(a,b){this.l=a;this.A=b;this.o=393217;this.F=0}h=kd.prototype;h.T=function(){return this.A};h.X=function(a,b){return new kd(this.l,b)};
h.call=function(){function a(p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa,Ga){p=this;return p.l.va?p.l.va(x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa,Ga):p.l.call(null,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa,Ga)}function b(p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa){p=this;return p.l.ua?p.l.ua(x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa):p.l.call(null,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa)}function c(p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa){p=this;return p.l.ta?p.l.ta(x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa):p.l.call(null,
x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa)}function d(p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia){p=this;return p.l.sa?p.l.sa(x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia):p.l.call(null,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia)}function e(p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da){p=this;return p.l.ra?p.l.ra(x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da):p.l.call(null,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da)}function f(p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y){p=this;return p.l.qa?p.l.qa(x,y,z,A,B,C,D,J,M,P,R,S,V,Y):p.l.call(null,x,y,z,A,B,C,D,J,M,P,R,S,V,Y)}function g(p,
x,y,z,A,B,C,D,J,M,P,R,S,V){p=this;return p.l.pa?p.l.pa(x,y,z,A,B,C,D,J,M,P,R,S,V):p.l.call(null,x,y,z,A,B,C,D,J,M,P,R,S,V)}function k(p,x,y,z,A,B,C,D,J,M,P,R,S){p=this;return p.l.oa?p.l.oa(x,y,z,A,B,C,D,J,M,P,R,S):p.l.call(null,x,y,z,A,B,C,D,J,M,P,R,S)}function l(p,x,y,z,A,B,C,D,J,M,P,R){p=this;return p.l.na?p.l.na(x,y,z,A,B,C,D,J,M,P,R):p.l.call(null,x,y,z,A,B,C,D,J,M,P,R)}function m(p,x,y,z,A,B,C,D,J,M,P){p=this;return p.l.ma?p.l.ma(x,y,z,A,B,C,D,J,M,P):p.l.call(null,x,y,z,A,B,C,D,J,M,P)}function n(p,
x,y,z,A,B,C,D,J,M){p=this;return p.l.ya?p.l.ya(x,y,z,A,B,C,D,J,M):p.l.call(null,x,y,z,A,B,C,D,J,M)}function r(p,x,y,z,A,B,C,D,J){p=this;return p.l.ia?p.l.ia(x,y,z,A,B,C,D,J):p.l.call(null,x,y,z,A,B,C,D,J)}function w(p,x,y,z,A,B,C,D){p=this;return p.l.xa?p.l.xa(x,y,z,A,B,C,D):p.l.call(null,x,y,z,A,B,C,D)}function t(p,x,y,z,A,B,C){p=this;return p.l.fa?p.l.fa(x,y,z,A,B,C):p.l.call(null,x,y,z,A,B,C)}function v(p,x,y,z,A,B){p=this;return p.l.P?p.l.P(x,y,z,A,B):p.l.call(null,x,y,z,A,B)}function E(p,x,y,
z,A){p=this;return p.l.G?p.l.G(x,y,z,A):p.l.call(null,x,y,z,A)}function N(p,x,y,z){p=this;return p.l.j?p.l.j(x,y,z):p.l.call(null,x,y,z)}function Q(p,x,y){p=this;return p.l.g?p.l.g(x,y):p.l.call(null,x,y)}function T(p,x){p=this;return p.l.h?p.l.h(x):p.l.call(null,x)}function X(p){p=this;return p.l.B?p.l.B():p.l.call(null)}var U=null;U=function(p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa,Ga,fb,cc){switch(arguments.length){case 1:return X.call(this,p);case 2:return T.call(this,p,x);case 3:return Q.call(this,
p,x,y);case 4:return N.call(this,p,x,y,z);case 5:return E.call(this,p,x,y,z,A);case 6:return v.call(this,p,x,y,z,A,B);case 7:return t.call(this,p,x,y,z,A,B,C);case 8:return w.call(this,p,x,y,z,A,B,C,D);case 9:return r.call(this,p,x,y,z,A,B,C,D,J);case 10:return n.call(this,p,x,y,z,A,B,C,D,J,M);case 11:return m.call(this,p,x,y,z,A,B,C,D,J,M,P);case 12:return l.call(this,p,x,y,z,A,B,C,D,J,M,P,R);case 13:return k.call(this,p,x,y,z,A,B,C,D,J,M,P,R,S);case 14:return g.call(this,p,x,y,z,A,B,C,D,J,M,P,R,
S,V);case 15:return f.call(this,p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y);case 16:return e.call(this,p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da);case 17:return d.call(this,p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia);case 18:return c.call(this,p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa);case 19:return b.call(this,p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa);case 20:return a.call(this,p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa,Ga);case 21:return this.l.wa?this.l.wa(x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa,Ga,fb):this.l.call(null,x,y,
z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa,Ga,fb);case 22:return ld(this.l,x,y,z,A,ad([B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa,Ga,fb,cc]))}throw Error("Invalid arity: "+(arguments.length-1));};U.h=X;U.g=T;U.j=Q;U.G=N;U.P=E;U.fa=v;U.xa=t;U.ia=w;U.ya=r;U.ma=n;U.na=m;U.oa=l;U.pa=k;U.qa=g;U.ra=f;U.sa=e;U.ta=d;U.ua=c;U.va=b;U.wa=a;return U}();h.apply=function(a,b){var c=Sa(b);a=this.call;b=a.apply;var d=[this],e=d.concat;if(20<c.length){var f=c.slice(0,20);f.push(c.slice(20));c=f}return b.call(a,this,e.call(d,c))};
h.B=function(){return this.l.B?this.l.B():this.l.call(null)};h.h=function(a){return this.l.h?this.l.h(a):this.l.call(null,a)};h.g=function(a,b){return this.l.g?this.l.g(a,b):this.l.call(null,a,b)};h.j=function(a,b,c){return this.l.j?this.l.j(a,b,c):this.l.call(null,a,b,c)};h.G=function(a,b,c,d){return this.l.G?this.l.G(a,b,c,d):this.l.call(null,a,b,c,d)};h.P=function(a,b,c,d,e){return this.l.P?this.l.P(a,b,c,d,e):this.l.call(null,a,b,c,d,e)};
h.fa=function(a,b,c,d,e,f){return this.l.fa?this.l.fa(a,b,c,d,e,f):this.l.call(null,a,b,c,d,e,f)};h.xa=function(a,b,c,d,e,f,g){return this.l.xa?this.l.xa(a,b,c,d,e,f,g):this.l.call(null,a,b,c,d,e,f,g)};h.ia=function(a,b,c,d,e,f,g,k){return this.l.ia?this.l.ia(a,b,c,d,e,f,g,k):this.l.call(null,a,b,c,d,e,f,g,k)};h.ya=function(a,b,c,d,e,f,g,k,l){return this.l.ya?this.l.ya(a,b,c,d,e,f,g,k,l):this.l.call(null,a,b,c,d,e,f,g,k,l)};
h.ma=function(a,b,c,d,e,f,g,k,l,m){return this.l.ma?this.l.ma(a,b,c,d,e,f,g,k,l,m):this.l.call(null,a,b,c,d,e,f,g,k,l,m)};h.na=function(a,b,c,d,e,f,g,k,l,m,n){return this.l.na?this.l.na(a,b,c,d,e,f,g,k,l,m,n):this.l.call(null,a,b,c,d,e,f,g,k,l,m,n)};h.oa=function(a,b,c,d,e,f,g,k,l,m,n,r){return this.l.oa?this.l.oa(a,b,c,d,e,f,g,k,l,m,n,r):this.l.call(null,a,b,c,d,e,f,g,k,l,m,n,r)};
h.pa=function(a,b,c,d,e,f,g,k,l,m,n,r,w){return this.l.pa?this.l.pa(a,b,c,d,e,f,g,k,l,m,n,r,w):this.l.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w)};h.qa=function(a,b,c,d,e,f,g,k,l,m,n,r,w,t){return this.l.qa?this.l.qa(a,b,c,d,e,f,g,k,l,m,n,r,w,t):this.l.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w,t)};h.ra=function(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v){return this.l.ra?this.l.ra(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v):this.l.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w,t,v)};
h.sa=function(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E){return this.l.sa?this.l.sa(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E):this.l.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E)};h.ta=function(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N){return this.l.ta?this.l.ta(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N):this.l.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N)};h.ua=function(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q){return this.l.ua?this.l.ua(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q):this.l.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q)};
h.va=function(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T){return this.l.va?this.l.va(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T):this.l.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T)};h.wa=function(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T,X){return this.l.wa?this.l.wa(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T,X):this.l.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T,X)};function md(a,b){return"function"===typeof a?new kd(a,b):null==a?null:Bb(a,b)}
function nd(a){var b=null!=a;return(b?null!=a?a.o&131072||q===a.zc||(a.o?0:Oa(zb,a)):Oa(zb,a):b)?Ab(a):null}function od(a){return null==a?!1:null!=a?a.o&8||q===a.Vc?!0:a.o?!1:Oa(Za,a):Oa(Za,a)}function pd(a){return null!=a?a.o&16777216||q===a.jc?!0:a.o?!1:Oa(Lb,a):Oa(Lb,a)}function qd(a){return null==a?!1:null!=a?a.o&1024||q===a.ad?!0:a.o?!1:Oa(qb,a):Oa(qb,a)}function rd(a){return null!=a?a.o&67108864||q===a.cd?!0:a.o?!1:Oa(Nb,a):Oa(Nb,a)}
function sd(a){return null!=a?a.o&16384||q===a.ed?!0:a.o?!1:Oa(xb,a):Oa(xb,a)}function td(a){return null!=a?a.F&512||q===a.Uc?!0:!1:!1}function ud(a,b,c,d,e){for(;;){if(0===e)return c;c[d]=a[b];d+=1;--e;b+=1}}var vd={};function wd(a){return null==a?!1:null!=a?a.o&64||q===a.nb?!0:a.o?!1:Oa(db,a):Oa(db,a)}function xd(a){return null==a?!1:!1===a?!1:!0}function yd(a){return"number"===typeof a&&!isNaN(a)&&Infinity!==a&&parseFloat(a)===parseInt(a,10)}
function zd(a,b){return null!=a&&(a.o&512||q===a.rc)?a.fb(null,b):Oa(mb,a)?nb(a,b):H.j(a,b,vd)===vd?!1:!0}
function Ad(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return pa.call(null,a,b);throw Error(["Cannot compare ",G.h(a)," to ",G.h(b)].join(""));}if(null!=a?a.F&2048||q===a.ub||(a.F?0:Oa(Vb,a)):Oa(Vb,a))return Wb(a,b);if("string"!==typeof a&&!Ma(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error(["Cannot compare ",G.h(a)," to ",G.h(b)].join(""));return pa.call(null,a,b)}
function Cd(a,b){var c=Vc(a),d=Vc(b);if(c<d)a=-1;else if(c>d)a=1;else if(0===c)a=0;else a:for(d=0;;){var e=Ad(Wc(a,d),Wc(b,d));if(0===e&&d+1<c)d+=1;else{a=e;break a}}return a}function Dd(){return Bc.g(Ad,Ad)?Ad:function(a,b){var c=Ad.g?Ad.g(a,b):Ad.call(null,a,b);return"number"===typeof c?c:F(c)?-1:F(Ad.g?Ad.g(b,a):Ad.call(null,b,a))?1:0}}function Ed(a){if(K(a)){var b=Fd(a),c=Dd();qa.call(null,b,c);return md(K(b),nd(a))}return Ac}
function Gd(a,b){return(b=K(b))?Ua(a,L(b),O(b)):a.B?a.B():a.call(null)}function Hd(a,b,c){for(c=K(c);;)if(c){var d=L(c);b=a.g?a.g(b,d):a.call(null,b,d);if(Mc(b))return yb(b);c=O(c)}else return b}function Id(a,b){a=gc(a);if(F(a.la()))for(var c=a.next();;)if(a.la()){var d=a.next();c=b.g?b.g(c,d):b.call(null,c,d);if(Mc(c))return yb(c)}else return c;else return b.B?b.B():b.call(null)}
function Jd(a,b,c){for(a=gc(a);;)if(a.la()){var d=a.next();c=b.g?b.g(c,d):b.call(null,c,d);if(Mc(c))return yb(c)}else return c}function Kd(a,b){return null!=b&&(b.o&524288||q===b.Bc)?b.ja(null,a):Ma(b)?Oc(b,a):"string"===typeof b?Oc(b,a):Oa(Cb,b)?Db.g(b,a):wc(b)?Id(b,a):Gd(a,b)}function Ua(a,b,c){return null!=c&&(c.o&524288||q===c.Bc)?c.ka(null,a,b):Ma(c)?Qc(c,a,b):"string"===typeof c?Qc(c,a,b):Oa(Cb,c)?Db.j(c,a,b):wc(c)?Jd(c,a,b):Hd(a,b,c)}function Ld(a,b){return null!=b?Gb(b,a):!0}
function Md(a){return a}var Nd=function Nd(a){switch(arguments.length){case 0:return Nd.B();case 1:return Nd.h(arguments[0]);case 2:return Nd.g(arguments[0],arguments[1]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Nd.v(arguments[0],arguments[1],new xc(c.slice(2),0,null))}};Nd.B=function(){return 0};Nd.h=function(a){return a};Nd.g=function(a,b){return a+b};Nd.v=function(a,b,c){return Ua(Nd,a+b,c)};
Nd.L=function(a){var b=L(a),c=O(a);a=L(c);c=O(c);return this.v(b,a,c)};Nd.K=2;var Od=function Od(a){switch(arguments.length){case 0:return Od.B();case 1:return Od.h(arguments[0]);case 2:return Od.g(arguments[0],arguments[1]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Od.v(arguments[0],arguments[1],new xc(c.slice(2),0,null))}};Od.B=function(){return 1};Od.h=function(a){return a};Od.g=function(a,b){return a*b};
Od.v=function(a,b,c){return Ua(Od,a*b,c)};Od.L=function(a){var b=L(a),c=O(a);a=L(c);c=O(c);return this.v(b,a,c)};Od.K=2;var Pd=function Pd(a){switch(arguments.length){case 1:return Pd.h(arguments[0]);case 2:return Pd.g(arguments[0],arguments[1]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Pd.v(arguments[0],arguments[1],new xc(c.slice(2),0,null))}};Pd.h=function(){return!0};Pd.g=function(a,b){return a<=b};
Pd.v=function(a,b,c){for(;;)if(a<=b)if(O(c))a=b,b=L(c),c=O(c);else return b<=L(c);else return!1};Pd.L=function(a){var b=L(a),c=O(a);a=L(c);c=O(c);return this.v(b,a,c)};Pd.K=2;var Qd=function Qd(a){switch(arguments.length){case 1:return Qd.h(arguments[0]);case 2:return Qd.g(arguments[0],arguments[1]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Qd.v(arguments[0],arguments[1],new xc(c.slice(2),0,null))}};Qd.h=function(){return!0};
Qd.g=function(a,b){return a>=b};Qd.v=function(a,b,c){for(;;)if(a>=b)if(O(c))a=b,b=L(c),c=O(c);else return b>=L(c);else return!1};Qd.L=function(a){var b=L(a),c=O(a);a=L(c);c=O(c);return this.v(b,a,c)};Qd.K=2;function Rd(a){return a-1}function Sd(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function Td(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}
var G=function G(a){switch(arguments.length){case 0:return G.B();case 1:return G.h(arguments[0]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return G.v(arguments[0],new xc(c.slice(1),0,null))}};G.B=function(){return""};G.h=function(a){return null==a?"":[a].join("")};G.v=function(a,b){for(a=new ua(G.h(a));;)if(F(b))a=a.append(G.h(L(b))),b=O(b);else return a.toString()};G.L=function(a){var b=L(a);a=O(a);return this.v(b,a)};G.K=1;
function Zc(a,b){if(pd(b))if(Sc(a)&&Sc(b)&&Vc(a)!==Vc(b))a=!1;else a:for(a=K(a),b=K(b);;){if(null==a){a=null==b;break a}if(null!=b&&Bc.g(L(a),L(b)))a=O(a),b=O(b);else{a=!1;break a}}else a=null;return xd(a)}function dd(a,b,c,d,e){this.A=a;this.first=b;this.Za=c;this.count=d;this.C=e;this.o=65937646;this.F=8192}h=dd.prototype;h.toString=function(){return ic(this)};h.equiv=function(a){return this.H(null,a)};
h.indexOf=function(){var a=null;a=function(b,c){switch(arguments.length){case 1:return Uc(this,b,0);case 2:return Uc(this,b,c)}throw Error("Invalid arity: "+arguments.length);};a.h=function(b){return Uc(this,b,0)};a.g=function(b,c){return Uc(this,b,c)};return a}();
h.lastIndexOf=function(){function a(c){return Xc(this,c,this.count)}var b=null;b=function(c,d){switch(arguments.length){case 1:return a.call(this,c);case 2:return Xc(this,c,d)}throw Error("Invalid arity: "+arguments.length);};b.h=a;b.g=function(c,d){return Xc(this,c,d)};return b}();h.T=function(){return this.A};h.ba=function(){return 1===this.count?null:this.Za};h.Y=function(){return this.count};h.Ab=function(){return this.first};h.Bb=function(){return this.ha(null)};
h.Z=function(){var a=this.C;return null!=a?a:this.C=a=Gc(this)};h.H=function(a,b){return Zc(this,b)};h.da=function(){return Bb(Ac,this.A)};h.ja=function(a,b){return Gd(b,this)};h.ka=function(a,b,c){return Hd(b,c,this)};h.ga=function(){return this.first};h.ha=function(){return 1===this.count?Ac:this.Za};h.S=function(){return this};h.X=function(a,b){return b===this.A?this:new dd(b,this.first,this.Za,this.count,this.C)};h.ca=function(a,b){return new dd(this.A,b,this,this.count+1,null)};
function Ud(a){return null!=a?a.o&33554432||q===a.$c?!0:a.o?!1:Oa(Mb,a):Oa(Mb,a)}dd.prototype[Ra]=function(){return Dc(this)};function Vd(a){this.A=a;this.o=65937614;this.F=8192}h=Vd.prototype;h.toString=function(){return ic(this)};h.equiv=function(a){return this.H(null,a)};
h.indexOf=function(){var a=null;a=function(b,c){switch(arguments.length){case 1:return Uc(this,b,0);case 2:return Uc(this,b,c)}throw Error("Invalid arity: "+arguments.length);};a.h=function(b){return Uc(this,b,0)};a.g=function(b,c){return Uc(this,b,c)};return a}();
h.lastIndexOf=function(){function a(c){return Xc(this,c,Vc(this))}var b=null;b=function(c,d){switch(arguments.length){case 1:return a.call(this,c);case 2:return Xc(this,c,d)}throw Error("Invalid arity: "+arguments.length);};b.h=a;b.g=function(c,d){return Xc(this,c,d)};return b}();h.T=function(){return this.A};h.ba=function(){return null};h.Y=function(){return 0};h.Ab=function(){return null};h.Bb=function(){throw Error("Can't pop empty list");};h.Z=function(){return Hc};
h.H=function(a,b){return Ud(b)||pd(b)?null==K(b):!1};h.da=function(){return this};h.ja=function(a,b){return Gd(b,this)};h.ka=function(a,b,c){return Hd(b,c,this)};h.ga=function(){return null};h.ha=function(){return Ac};h.S=function(){return null};h.X=function(a,b){return b===this.A?this:new Vd(b)};h.ca=function(a,b){return new dd(this.A,b,null,1,null)};var Ac=new Vd(null);Vd.prototype[Ra]=function(){return Dc(this)};
var Wd=function Wd(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Wd.v(0<c.length?new xc(c.slice(0),0,null):null)};Wd.v=function(a){if(a instanceof xc&&0===a.u)var b=a.i;else a:for(b=[];;)if(null!=a)b.push(eb(a)),a=ib(a);else break a;a=b.length;for(var c=Ac;;)if(0<a){var d=a-1;c=$a(c,b[a-1]);a=d}else return c};Wd.K=0;Wd.L=function(a){return this.v(K(a))};function Xd(a,b,c,d){this.A=a;this.first=b;this.Za=c;this.C=d;this.o=65929452;this.F=8192}h=Xd.prototype;
h.toString=function(){return ic(this)};h.equiv=function(a){return this.H(null,a)};h.indexOf=function(){var a=null;a=function(b,c){switch(arguments.length){case 1:return Uc(this,b,0);case 2:return Uc(this,b,c)}throw Error("Invalid arity: "+arguments.length);};a.h=function(b){return Uc(this,b,0)};a.g=function(b,c){return Uc(this,b,c)};return a}();
h.lastIndexOf=function(){function a(c){return Xc(this,c,Vc(this))}var b=null;b=function(c,d){switch(arguments.length){case 1:return a.call(this,c);case 2:return Xc(this,c,d)}throw Error("Invalid arity: "+arguments.length);};b.h=a;b.g=function(c,d){return Xc(this,c,d)};return b}();h.T=function(){return this.A};h.ba=function(){return null==this.Za?null:K(this.Za)};h.Z=function(){var a=this.C;return null!=a?a:this.C=a=Gc(this)};h.H=function(a,b){return Zc(this,b)};h.da=function(){return Ac};
h.ja=function(a,b){return Gd(b,this)};h.ka=function(a,b,c){return Hd(b,c,this)};h.ga=function(){return this.first};h.ha=function(){return null==this.Za?Ac:this.Za};h.S=function(){return this};h.X=function(a,b){return b===this.A?this:new Xd(b,this.first,this.Za,this.C)};h.ca=function(a,b){return new Xd(null,b,this,null)};Xd.prototype[Ra]=function(){return Dc(this)};
function $c(a,b){return null==b?new dd(null,a,null,1,null):null!=b&&(b.o&64||q===b.nb)?new Xd(null,a,b,null):new Xd(null,a,K(b),null)}function Yd(a,b){if(a.Ha===b.Ha)return 0;var c=Na(a.Ca);if(F(c?b.Ca:c))return-1;if(F(a.Ca)){if(Na(b.Ca))return 1;c=pa.call(null,a.Ca,b.Ca);return 0===c?pa.call(null,a.name,b.name):c}return pa.call(null,a.name,b.name)}function I(a,b,c,d){this.Ca=a;this.name=b;this.Ha=c;this.kb=d;this.o=2153775105;this.F=4096}h=I.prototype;h.toString=function(){return[":",G.h(this.Ha)].join("")};
h.equiv=function(a){return this.H(null,a)};h.H=function(a,b){return b instanceof I?this.Ha===b.Ha:!1};h.call=function(){var a=null;a=function(b,c,d){switch(arguments.length){case 2:return H.g(c,this);case 3:return H.j(c,this,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.g=function(b,c){return H.g(c,this)};a.j=function(b,c,d){return H.j(c,this,d)};return a}();
h.apply=function(a,b){var c=Sa(b);a=this.call;b=a.apply;var d=[this],e=d.concat;if(20<c.length){var f=c.slice(0,20);f.push(c.slice(20));c=f}return b.call(a,this,e.call(d,c))};h.h=function(a){return H.g(a,this)};h.g=function(a,b){return H.j(a,this,b)};h.Z=function(){var a=this.kb;return null!=a?a:this.kb=a=sc(nc(this.name),qc(this.Ca))+2654435769|0};h.xb=function(){return this.name};h.yb=function(){return this.Ca};h.U=function(a,b){return Ob(b,[":",G.h(this.Ha)].join(""))};
function Zd(a,b){return a===b?!0:a instanceof I&&b instanceof I?a.Ha===b.Ha:!1}function $d(a){if(null!=a&&(a.F&4096||q===a.Ac))return a.yb(null);throw Error(["Doesn't support namespace: ",G.h(a)].join(""));}var ae=function ae(a){switch(arguments.length){case 1:return ae.h(arguments[0]);case 2:return ae.g(arguments[0],arguments[1]);default:throw Error(["Invalid arity: ",G.h(arguments.length)].join(""));}};
ae.h=function(a){if(a instanceof I)return a;if(a instanceof uc)return new I($d(a),be(a),a.Va,null);if(Bc.g("/",a))return new I(null,a,a,null);if("string"===typeof a){var b=a.split("/");return 2===b.length?new I(b[0],b[1],a,null):new I(null,b[0],a,null)}return null};ae.g=function(a,b){a=a instanceof I?be(a):a instanceof uc?be(a):a;b=b instanceof I?be(b):b instanceof uc?be(b):b;return new I(a,b,[F(a)?[G.h(a),"/"].join(""):null,G.h(b)].join(""),null)};ae.K=2;
function ce(a,b,c){this.A=a;this.Fb=b;this.M=null;this.C=c;this.o=32374988;this.F=1}h=ce.prototype;h.toString=function(){return ic(this)};h.equiv=function(a){return this.H(null,a)};function de(a){null!=a.Fb&&(a.M=a.Fb.B?a.Fb.B():a.Fb.call(null),a.Fb=null);return a.M}
h.indexOf=function(){var a=null;a=function(b,c){switch(arguments.length){case 1:return Uc(this,b,0);case 2:return Uc(this,b,c)}throw Error("Invalid arity: "+arguments.length);};a.h=function(b){return Uc(this,b,0)};a.g=function(b,c){return Uc(this,b,c)};return a}();
h.lastIndexOf=function(){function a(c){return Xc(this,c,Vc(this))}var b=null;b=function(c,d){switch(arguments.length){case 1:return a.call(this,c);case 2:return Xc(this,c,d)}throw Error("Invalid arity: "+arguments.length);};b.h=a;b.g=function(c,d){return Xc(this,c,d)};return b}();h.T=function(){return this.A};h.ba=function(){this.S(null);return null==this.M?null:O(this.M)};h.Z=function(){var a=this.C;return null!=a?a:this.C=a=Gc(this)};h.H=function(a,b){return Zc(this,b)};
h.da=function(){return Bb(Ac,this.A)};h.ja=function(a,b){return Gd(b,this)};h.ka=function(a,b,c){return Hd(b,c,this)};h.ga=function(){this.S(null);return null==this.M?null:L(this.M)};h.ha=function(){this.S(null);return null!=this.M?zc(this.M):Ac};h.S=function(){de(this);if(null==this.M)return null;for(var a=this.M;;)if(a instanceof ce)a=de(a);else return this.M=a,K(this.M)};h.X=function(a,b){var c=this;return b===this.A?c:new ce(b,function(){return c.S(null)},this.C)};
h.ca=function(a,b){return $c(b,this)};ce.prototype[Ra]=function(){return Dc(this)};function ee(a){this.O=a;this.end=0;this.o=2;this.F=0}ee.prototype.add=function(a){this.O[this.end]=a;return this.end+=1};ee.prototype.I=function(){var a=new fe(this.O,0,this.end);this.O=null;return a};ee.prototype.Y=function(){return this.end};function ge(a){return new ee(Array(a))}function fe(a,b,c){this.i=a;this.Ba=b;this.end=c;this.o=524306;this.F=0}h=fe.prototype;h.Y=function(){return this.end-this.Ba};
h.$=function(a,b){return this.i[this.Ba+b]};h.Ea=function(a,b,c){return 0<=b&&b<this.end-this.Ba?this.i[this.Ba+b]:c};h.bc=function(){if(this.Ba===this.end)throw Error("-drop-first of empty chunk");return new fe(this.i,this.Ba+1,this.end)};h.ja=function(a,b){return Rc(this.i,b,this.i[this.Ba],this.Ba+1)};h.ka=function(a,b,c){return Rc(this.i,b,c,this.Ba)};function he(a,b,c,d){this.I=a;this.Qa=b;this.A=c;this.C=d;this.o=31850732;this.F=1536}h=he.prototype;h.toString=function(){return ic(this)};
h.equiv=function(a){return this.H(null,a)};h.indexOf=function(){var a=null;a=function(b,c){switch(arguments.length){case 1:return Uc(this,b,0);case 2:return Uc(this,b,c)}throw Error("Invalid arity: "+arguments.length);};a.h=function(b){return Uc(this,b,0)};a.g=function(b,c){return Uc(this,b,c)};return a}();
h.lastIndexOf=function(){function a(c){return Xc(this,c,Vc(this))}var b=null;b=function(c,d){switch(arguments.length){case 1:return a.call(this,c);case 2:return Xc(this,c,d)}throw Error("Invalid arity: "+arguments.length);};b.h=a;b.g=function(c,d){return Xc(this,c,d)};return b}();h.T=function(){return this.A};h.ba=function(){return 1<Wa(this.I)?new he(Xb(this.I),this.Qa,null,null):null==this.Qa?null:Kb(this.Qa)};h.Z=function(){var a=this.C;return null!=a?a:this.C=a=Gc(this)};
h.H=function(a,b){return Zc(this,b)};h.da=function(){return Ac};h.ga=function(){return bb.g(this.I,0)};h.ha=function(){return 1<Wa(this.I)?new he(Xb(this.I),this.Qa,null,null):null==this.Qa?Ac:this.Qa};h.S=function(){return this};h.tb=function(){return this.I};h.ab=function(){return null==this.Qa?Ac:this.Qa};h.X=function(a,b){return b===this.A?this:new he(this.I,this.Qa,b,this.C)};h.ca=function(a,b){return $c(b,this)};h.Qb=function(){return null==this.Qa?null:this.Qa};he.prototype[Ra]=function(){return Dc(this)};
function ie(a,b){return 0===Wa(a)?b:new he(a,b,null,null)}function je(a,b){a.add(b)}function Fd(a){var b=[];for(a=K(a);;)if(null!=a)b.push(L(a)),a=O(a);else return b}function ke(a){if("number"===typeof a)a:{var b=Array(a);if(wd(null))for(var c=0,d=K(null);;)if(d&&c<a)b[c]=L(d),c+=1,d=O(d);else{a=b;break a}else{for(c=0;;)if(c<a)b[c]=null,c+=1;else break;a=b}}else a=Ta(a);return a}function le(a,b){if(Sc(b))return Vc(b);var c=0;for(b=K(b);;)if(null!=b&&c<a)c+=1,b=O(b);else return c}
var me=function me(a){if(null==a)return null;var c=O(a);return null==c?K(L(a)):$c(L(a),me.h?me.h(c):me.call(null,c))},ne=function ne(a){switch(arguments.length){case 0:return ne.B();case 1:return ne.h(arguments[0]);case 2:return ne.g(arguments[0],arguments[1]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return ne.v(arguments[0],arguments[1],new xc(c.slice(2),0,null))}};ne.B=function(){return new ce(null,function(){return null},null)};
ne.h=function(a){return new ce(null,function(){return a},null)};ne.g=function(a,b){return new ce(null,function(){var c=K(a);return c?td(c)?ie(Yb(c),ne.g(Zb(c),b)):$c(L(c),ne.g(zc(c),b)):b},null)};ne.v=function(a,b,c){return function g(e,f){return new ce(null,function(){var k=K(e);return k?td(k)?ie(Yb(k),g(Zb(k),f)):$c(L(k),g(zc(k),f)):F(f)?g(L(f),O(f)):null},null)}(ne.g(a,b),c)};ne.L=function(a){var b=L(a),c=O(a);a=L(c);c=O(c);return this.v(b,a,c)};ne.K=2;
function oe(a,b,c){var d=K(c);if(0===b)return a.B?a.B():a.call(null);c=eb(d);var e=gb(d);if(1===b)return a.h?a.h(c):a.call(null,c);d=eb(e);var f=gb(e);if(2===b)return a.g?a.g(c,d):a.call(null,c,d);e=eb(f);var g=gb(f);if(3===b)return a.j?a.j(c,d,e):a.call(null,c,d,e);f=eb(g);var k=gb(g);if(4===b)return a.G?a.G(c,d,e,f):a.call(null,c,d,e,f);g=eb(k);var l=gb(k);if(5===b)return a.P?a.P(c,d,e,f,g):a.call(null,c,d,e,f,g);k=eb(l);var m=gb(l);if(6===b)return a.fa?a.fa(c,d,e,f,g,k):a.call(null,c,d,e,f,g,k);
l=eb(m);var n=gb(m);if(7===b)return a.xa?a.xa(c,d,e,f,g,k,l):a.call(null,c,d,e,f,g,k,l);m=eb(n);var r=gb(n);if(8===b)return a.ia?a.ia(c,d,e,f,g,k,l,m):a.call(null,c,d,e,f,g,k,l,m);n=eb(r);var w=gb(r);if(9===b)return a.ya?a.ya(c,d,e,f,g,k,l,m,n):a.call(null,c,d,e,f,g,k,l,m,n);r=eb(w);var t=gb(w);if(10===b)return a.ma?a.ma(c,d,e,f,g,k,l,m,n,r):a.call(null,c,d,e,f,g,k,l,m,n,r);w=eb(t);var v=gb(t);if(11===b)return a.na?a.na(c,d,e,f,g,k,l,m,n,r,w):a.call(null,c,d,e,f,g,k,l,m,n,r,w);t=eb(v);var E=gb(v);
if(12===b)return a.oa?a.oa(c,d,e,f,g,k,l,m,n,r,w,t):a.call(null,c,d,e,f,g,k,l,m,n,r,w,t);v=eb(E);var N=gb(E);if(13===b)return a.pa?a.pa(c,d,e,f,g,k,l,m,n,r,w,t,v):a.call(null,c,d,e,f,g,k,l,m,n,r,w,t,v);E=eb(N);var Q=gb(N);if(14===b)return a.qa?a.qa(c,d,e,f,g,k,l,m,n,r,w,t,v,E):a.call(null,c,d,e,f,g,k,l,m,n,r,w,t,v,E);N=eb(Q);var T=gb(Q);if(15===b)return a.ra?a.ra(c,d,e,f,g,k,l,m,n,r,w,t,v,E,N):a.call(null,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N);Q=eb(T);var X=gb(T);if(16===b)return a.sa?a.sa(c,d,e,f,g,k,l,
m,n,r,w,t,v,E,N,Q):a.call(null,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q);T=eb(X);var U=gb(X);if(17===b)return a.ta?a.ta(c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T):a.call(null,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T);X=eb(U);var p=gb(U);if(18===b)return a.ua?a.ua(c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T,X):a.call(null,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T,X);U=eb(p);p=gb(p);if(19===b)return a.va?a.va(c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T,X,U):a.call(null,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T,X,U);var x=eb(p);gb(p);if(20===b)return a.wa?a.wa(c,
d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T,X,U,x):a.call(null,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T,X,U,x);throw Error("Only up to 20 arguments supported on functions");}function pe(a){return null!=a&&(a.o&128||q===a.zb)?a.ba(null):K(zc(a))}function qe(a,b,c){return null==c?a.h?a.h(b):a.call(a,b):re(a,b,eb(c),pe(c))}function re(a,b,c,d){return null==d?a.g?a.g(b,c):a.call(a,b,c):se(a,b,c,eb(d),pe(d))}function se(a,b,c,d,e){return null==e?a.j?a.j(b,c,d):a.call(a,b,c,d):te(a,b,c,d,eb(e),pe(e))}
function te(a,b,c,d,e,f){if(null==f)return a.G?a.G(b,c,d,e):a.call(a,b,c,d,e);var g=eb(f),k=O(f);if(null==k)return a.P?a.P(b,c,d,e,g):a.call(a,b,c,d,e,g);f=eb(k);var l=O(k);if(null==l)return a.fa?a.fa(b,c,d,e,g,f):a.call(a,b,c,d,e,g,f);k=eb(l);var m=O(l);if(null==m)return a.xa?a.xa(b,c,d,e,g,f,k):a.call(a,b,c,d,e,g,f,k);l=eb(m);var n=O(m);if(null==n)return a.ia?a.ia(b,c,d,e,g,f,k,l):a.call(a,b,c,d,e,g,f,k,l);m=eb(n);var r=O(n);if(null==r)return a.ya?a.ya(b,c,d,e,g,f,k,l,m):a.call(a,b,c,d,e,g,f,k,
l,m);n=eb(r);var w=O(r);if(null==w)return a.ma?a.ma(b,c,d,e,g,f,k,l,m,n):a.call(a,b,c,d,e,g,f,k,l,m,n);r=eb(w);var t=O(w);if(null==t)return a.na?a.na(b,c,d,e,g,f,k,l,m,n,r):a.call(a,b,c,d,e,g,f,k,l,m,n,r);w=eb(t);var v=O(t);if(null==v)return a.oa?a.oa(b,c,d,e,g,f,k,l,m,n,r,w):a.call(a,b,c,d,e,g,f,k,l,m,n,r,w);t=eb(v);var E=O(v);if(null==E)return a.pa?a.pa(b,c,d,e,g,f,k,l,m,n,r,w,t):a.call(a,b,c,d,e,g,f,k,l,m,n,r,w,t);v=eb(E);var N=O(E);if(null==N)return a.qa?a.qa(b,c,d,e,g,f,k,l,m,n,r,w,t,v):a.call(a,
b,c,d,e,g,f,k,l,m,n,r,w,t,v);E=eb(N);var Q=O(N);if(null==Q)return a.ra?a.ra(b,c,d,e,g,f,k,l,m,n,r,w,t,v,E):a.call(a,b,c,d,e,g,f,k,l,m,n,r,w,t,v,E);N=eb(Q);var T=O(Q);if(null==T)return a.sa?a.sa(b,c,d,e,g,f,k,l,m,n,r,w,t,v,E,N):a.call(a,b,c,d,e,g,f,k,l,m,n,r,w,t,v,E,N);Q=eb(T);var X=O(T);if(null==X)return a.ta?a.ta(b,c,d,e,g,f,k,l,m,n,r,w,t,v,E,N,Q):a.call(a,b,c,d,e,g,f,k,l,m,n,r,w,t,v,E,N,Q);T=eb(X);var U=O(X);if(null==U)return a.ua?a.ua(b,c,d,e,g,f,k,l,m,n,r,w,t,v,E,N,Q,T):a.call(a,b,c,d,e,g,f,k,
l,m,n,r,w,t,v,E,N,Q,T);X=eb(U);var p=O(U);if(null==p)return a.va?a.va(b,c,d,e,g,f,k,l,m,n,r,w,t,v,E,N,Q,T,X):a.call(a,b,c,d,e,g,f,k,l,m,n,r,w,t,v,E,N,Q,T,X);U=eb(p);p=O(p);if(null==p)return a.wa?a.wa(b,c,d,e,g,f,k,l,m,n,r,w,t,v,E,N,Q,T,X,U):a.call(a,b,c,d,e,g,f,k,l,m,n,r,w,t,v,E,N,Q,T,X,U);b=[b,c,d,e,g,f,k,l,m,n,r,w,t,v,E,N,Q,T,X,U];for(c=p;;)if(c)b.push(eb(c)),c=O(c);else break;return a.apply(a,b)}
function ue(a,b){if(a.L){var c=a.K,d=le(c+1,b);return d<=c?oe(a,d,b):a.L(b)}b=K(b);return null==b?a.B?a.B():a.call(a):qe(a,eb(b),pe(b))}function ve(a,b,c){if(a.L){b=$c(b,c);var d=a.K;c=le(d,c)+1;return c<=d?oe(a,c,b):a.L(b)}return qe(a,b,K(c))}function we(a,b,c,d,e){return a.L?(b=$c(b,$c(c,$c(d,e))),c=a.K,e=3+le(c-2,e),e<=c?oe(a,e,b):a.L(b)):se(a,b,c,d,K(e))}function ld(a,b,c,d,e,f){return a.L?(f=me(f),b=$c(b,$c(c,$c(d,$c(e,f)))),c=a.K,f=4+le(c-3,f),f<=c?oe(a,f,b):a.L(b)):te(a,b,c,d,e,me(f))}
function xe(a){return null!=a&&(a.o&64||q===a.nb)?O(a)?id(Fd(a)):K(a)?L(a):ye:a}function ze(a){return K(a)?a:null}
function Ae(){if("undefined"===typeof va||"undefined"===typeof xa||"undefined"===typeof ya)ya=function(a){this.Lc=a;this.o=393216;this.F=0},ya.prototype.X=function(a,b){return new ya(b)},ya.prototype.T=function(){return this.Lc},ya.prototype.la=function(){return!1},ya.prototype.next=function(){return Error("No such element")},ya.prototype.remove=function(){return Error("Unsupported operation")},ya.Eb=!0,ya.gb="cljs.core/t_cljs$core13345",ya.Ub=function(a){return Ob(a,"cljs.core/t_cljs$core13345")};
return new ya(ye)}function Be(a,b){for(;;){if(null==K(b))return!0;var c=L(b);c=a.h?a.h(c):a.call(null,c);if(F(c))b=O(b);else return!1}}function Ce(a,b){for(;;)if(b=K(b)){var c=L(b);c=a.h?a.h(c):a.call(null,c);if(F(c))return c;b=O(b)}else return null}
function De(a){return function(){function b(g,k){return Na(a.g?a.g(g,k):a.call(null,g,k))}function c(g){return Na(a.h?a.h(g):a.call(null,g))}function d(){return Na(a.B?a.B():a.call(null))}var e=null,f=function(){function g(l,m,n){var r=null;if(2<arguments.length){r=0;for(var w=Array(arguments.length-2);r<w.length;)w[r]=arguments[r+2],++r;r=new xc(w,0,null)}return k.call(this,l,m,r)}function k(l,m,n){a.L?(l=$c(l,$c(m,n)),m=a.K,n=2+le(m-1,n),n=n<=m?oe(a,n,l):a.L(l)):n=re(a,l,m,K(n));return Na(n)}g.K=
2;g.L=function(l){var m=L(l);l=O(l);var n=L(l);l=zc(l);return k(m,n,l)};g.v=k;return g}();e=function(g,k,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,g);case 2:return b.call(this,g,k);default:var m=null;if(2<arguments.length){m=0;for(var n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new xc(n,0,null)}return f.v(g,k,m)}throw Error("Invalid arity: "+arguments.length);};e.K=2;e.L=f.L;e.B=d;e.h=c;e.g=b;e.v=f.v;return e}()}
function Ee(){return function(){function a(b){if(0<arguments.length)for(var c=0,d=Array(arguments.length-0);c<d.length;)d[c]=arguments[c+0],++c;return!1}a.K=0;a.L=function(b){K(b);return!1};a.v=function(){return!1};return a}()}
function Fe(a,b){return function(){function c(l,m,n){return a.G?a.G(b,l,m,n):a.call(null,b,l,m,n)}function d(l,m){return a.j?a.j(b,l,m):a.call(null,b,l,m)}function e(l){return a.g?a.g(b,l):a.call(null,b,l)}function f(){return a.h?a.h(b):a.call(null,b)}var g=null,k=function(){function l(n,r,w,t){var v=null;if(3<arguments.length){v=0;for(var E=Array(arguments.length-3);v<E.length;)E[v]=arguments[v+3],++v;v=new xc(E,0,null)}return m.call(this,n,r,w,v)}function m(n,r,w,t){return ld(a,b,n,r,w,ad([t]))}
l.K=3;l.L=function(n){var r=L(n);n=O(n);var w=L(n);n=O(n);var t=L(n);n=zc(n);return m(r,w,t,n)};l.v=m;return l}();g=function(l,m,n,r){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,l);case 2:return d.call(this,l,m);case 3:return c.call(this,l,m,n);default:var w=null;if(3<arguments.length){w=0;for(var t=Array(arguments.length-3);w<t.length;)t[w]=arguments[w+3],++w;w=new xc(t,0,null)}return k.v(l,m,n,w)}throw Error("Invalid arity: "+arguments.length);};g.K=3;g.L=k.L;g.B=
f;g.h=e;g.g=d;g.j=c;g.v=k.v;return g}()}function Ge(a){this.state=a;this.qc=this.Tc=this.A=null;this.F=16386;this.o=6455296}h=Ge.prototype;h.equiv=function(a){return this.H(null,a)};h.H=function(a,b){return this===b};h.Rb=function(){return this.state};h.T=function(){return this.A};h.Z=function(){return ca(this)};function He(a){return new Ge(a)}
function Ie(a,b){if(a instanceof Ge){var c=a.Tc;if(null!=c&&!F(c.h?c.h(b):c.call(null,b)))throw Error("Validator rejected reference state");c=a.state;a.state=b;if(null!=a.qc)a:for(var d=K(a.qc),e=null,f=0,g=0;;)if(g<f){var k=e.$(null,g),l=gd(k,0);k=gd(k,1);k.G?k.G(l,a,c,b):k.call(null,l,a,c,b);g+=1}else if(d=K(d))td(d)?(e=Yb(d),d=Zb(d),l=e,f=Vc(e),e=l):(e=L(d),l=gd(e,0),k=gd(e,1),k.G?k.G(l,a,c,b):k.call(null,l,a,c,b),d=O(d),e=null,f=0),g=0;else break a;return b}return bc(a,b)}
var Ke=function Ke(a){switch(arguments.length){case 2:return Ke.g(arguments[0],arguments[1]);case 3:return Ke.j(arguments[0],arguments[1],arguments[2]);case 4:return Ke.G(arguments[0],arguments[1],arguments[2],arguments[3]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Ke.v(arguments[0],arguments[1],arguments[2],arguments[3],new xc(c.slice(4),0,null))}};
Ke.g=function(a,b){if(a instanceof Ge){var c=a.state;b=b.h?b.h(c):b.call(null,c);a=Ie(a,b)}else a=dc.g(a,b);return a};Ke.j=function(a,b,c){if(a instanceof Ge){var d=a.state;b=b.g?b.g(d,c):b.call(null,d,c);a=Ie(a,b)}else a=dc.j(a,b,c);return a};Ke.G=function(a,b,c,d){if(a instanceof Ge){var e=a.state;b=b.j?b.j(e,c,d):b.call(null,e,c,d);a=Ie(a,b)}else a=dc.G(a,b,c,d);return a};Ke.v=function(a,b,c,d,e){return a instanceof Ge?Ie(a,we(b,a.state,c,d,e)):dc.P(a,b,c,d,e)};
Ke.L=function(a){var b=L(a),c=O(a);a=L(c);var d=O(c);c=L(d);var e=O(d);d=L(e);e=O(e);return this.v(b,a,c,d,e)};Ke.K=4;
var Le=function Le(a){switch(arguments.length){case 1:return Le.h(arguments[0]);case 2:return Le.g(arguments[0],arguments[1]);case 3:return Le.j(arguments[0],arguments[1],arguments[2]);case 4:return Le.G(arguments[0],arguments[1],arguments[2],arguments[3]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Le.v(arguments[0],arguments[1],arguments[2],arguments[3],new xc(c.slice(4),0,null))}};
Le.h=function(a){return function(b){return function(){function c(k,l){l=a.h?a.h(l):a.call(null,l);return b.g?b.g(k,l):b.call(null,k,l)}function d(k){return b.h?b.h(k):b.call(null,k)}function e(){return b.B?b.B():b.call(null)}var f=null,g=function(){function k(m,n,r){var w=null;if(2<arguments.length){w=0;for(var t=Array(arguments.length-2);w<t.length;)t[w]=arguments[w+2],++w;w=new xc(t,0,null)}return l.call(this,m,n,w)}function l(m,n,r){n=ve(a,n,r);return b.g?b.g(m,n):b.call(null,m,n)}k.K=2;k.L=function(m){var n=
L(m);m=O(m);var r=L(m);m=zc(m);return l(n,r,m)};k.v=l;return k}();f=function(k,l,m){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,k);case 2:return c.call(this,k,l);default:var n=null;if(2<arguments.length){n=0;for(var r=Array(arguments.length-2);n<r.length;)r[n]=arguments[n+2],++n;n=new xc(r,0,null)}return g.v(k,l,n)}throw Error("Invalid arity: "+arguments.length);};f.K=2;f.L=g.L;f.B=e;f.h=d;f.g=c;f.v=g.v;return f}()}};
Le.g=function(a,b){return new ce(null,function(){var c=K(b);if(c){if(td(c)){for(var d=Yb(c),e=Vc(d),f=ge(e),g=0;;)if(g<e)je(f,function(){var k=bb.g(d,g);return a.h?a.h(k):a.call(null,k)}()),g+=1;else break;return ie(f.I(),Le.g(a,Zb(c)))}return $c(function(){var k=L(c);return a.h?a.h(k):a.call(null,k)}(),Le.g(a,zc(c)))}return null},null)};
Le.j=function(a,b,c){return new ce(null,function(){var d=K(b),e=K(c);if(d&&e){var f=L(d);var g=L(e);f=a.g?a.g(f,g):a.call(null,f,g);d=$c(f,Le.j(a,zc(d),zc(e)))}else d=null;return d},null)};Le.G=function(a,b,c,d){return new ce(null,function(){var e=K(b),f=K(c),g=K(d);if(e&&f&&g){var k=L(e);var l=L(f),m=L(g);k=a.j?a.j(k,l,m):a.call(null,k,l,m);e=$c(k,Le.G(a,zc(e),zc(f),zc(g)))}else e=null;return e},null)};
Le.v=function(a,b,c,d,e){return Le.g(function(f){return ue(a,f)},function k(g){return new ce(null,function(){var l=Le.g(K,g);return Be(Md,l)?$c(Le.g(L,l),k(Le.g(zc,l))):null},null)}(bd.v(e,d,ad([c,b]))))};Le.L=function(a){var b=L(a),c=O(a);a=L(c);var d=O(c);c=L(d);var e=O(d);d=L(e);e=O(e);return this.v(b,a,c,d,e)};Le.K=4;function Me(a){return new ce(null,function(){a:for(var b=1,c=a;;)if(c=K(c),0<b&&c)--b,c=zc(c);else break a;return c},null)}
function Ne(a,b,c,d,e){this.A=a;this.all=b;this.Fa=c;this.current=d;this.Ob=e;this.o=26083532;this.F=1}h=Ne.prototype;h.toString=function(){return ic(this)};function Oe(a){if(!a.current){var b=O(a.Fa);a.current=b?b:a.all}return a.current}h.T=function(){return this.A};h.ba=function(){return this.ha(null)};h.da=function(){return Ac};
h.ja=function(a,b){for(var c=this,d=Oe(this),e=L(d);;){var f=function(){var g=O(d);return g?g:c.all}();a=function(){var g=e,k=L(f);return b.g?b.g(g,k):b.call(null,g,k)}();if(Mc(a))return yb(a);d=f;e=a}};h.ka=function(a,b,c){for(var d=this,e=Oe(this),f=c;;){c=function(){var g=f,k=L(e);return b.g?b.g(g,k):b.call(null,g,k)}();if(Mc(c))return yb(c);e=a=function(){var g=O(e);return g?g:d.all}();f=c}};h.ga=function(){return L(Oe(this))};
h.ha=function(){null==this.Ob&&(this.Ob=new Ne(null,this.all,Oe(this),null,null));return this.Ob};h.S=function(){return this};h.X=function(a,b){return b===this.A?this:new Ne(b,this.all,this.Fa,this.current,this.Ob)};h.ca=function(a,b){return $c(b,this)};function Pe(a){return(a=K(a))?new Ne(null,a,null,a,null):Ac}function Qe(a,b,c,d){this.A=a;this.count=b;this.D=c;this.next=d;this.C=null;this.o=32374988;this.F=1}h=Qe.prototype;h.toString=function(){return ic(this)};
h.equiv=function(a){return this.H(null,a)};h.indexOf=function(){var a=null;a=function(b,c){switch(arguments.length){case 1:return Uc(this,b,0);case 2:return Uc(this,b,c)}throw Error("Invalid arity: "+arguments.length);};a.h=function(b){return Uc(this,b,0)};a.g=function(b,c){return Uc(this,b,c)};return a}();
h.lastIndexOf=function(){function a(c){return Xc(this,c,this.count)}var b=null;b=function(c,d){switch(arguments.length){case 1:return a.call(this,c);case 2:return Xc(this,c,d)}throw Error("Invalid arity: "+arguments.length);};b.h=a;b.g=function(c,d){return Xc(this,c,d)};return b}();h.T=function(){return this.A};h.ba=function(){return null==this.next?1<this.count?this.next=new Qe(null,this.count-1,this.D,null):-1===this.count?this:null:this.next};
h.Z=function(){var a=this.C;return null!=a?a:this.C=a=Gc(this)};h.H=function(a,b){return Zc(this,b)};h.da=function(){return Ac};h.ja=function(a,b){if(-1===this.count)for(var c=b.g?b.g(this.D,this.D):b.call(null,this.D,this.D);;){if(Mc(c))return yb(c);c=b.g?b.g(c,this.D):b.call(null,c,this.D)}else for(a=1,c=this.D;;)if(a<this.count){c=b.g?b.g(c,this.D):b.call(null,c,this.D);if(Mc(c))return yb(c);a+=1}else return c};
h.ka=function(a,b,c){if(-1===this.count)for(c=b.g?b.g(c,this.D):b.call(null,c,this.D);;){if(Mc(c))return yb(c);c=b.g?b.g(c,this.D):b.call(null,c,this.D)}else for(a=0;;)if(a<this.count){c=b.g?b.g(c,this.D):b.call(null,c,this.D);if(Mc(c))return yb(c);a+=1}else return c};h.ga=function(){return this.D};h.ha=function(){return null==this.next?1<this.count?this.next=new Qe(null,this.count-1,this.D,null):-1===this.count?this:Ac:this.next};h.S=function(){return this};
h.X=function(a,b){return b===this.A?this:new Qe(b,this.count,this.D,this.next)};h.ca=function(a,b){return $c(b,this)};var Re=function Re(a){switch(arguments.length){case 0:return Re.B();case 1:return Re.h(arguments[0]);case 2:return Re.g(arguments[0],arguments[1]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Re.v(arguments[0],arguments[1],new xc(c.slice(2),0,null))}};Re.B=function(){return Ac};
Re.h=function(a){return new ce(null,function(){return a},null)};Re.g=function(a,b){return new ce(null,function(){var c=K(a),d=K(b);return c&&d?$c(L(c),$c(L(d),Re.g(zc(c),zc(d)))):null},null)};Re.v=function(a,b,c){return new ce(null,function(){var d=Le.g(K,bd.v(c,b,ad([a])));return Be(Md,d)?ne.g(Le.g(L,d),ue(Re,Le.g(zc,d))):null},null)};Re.L=function(a){var b=L(a),c=O(a);a=L(c);c=O(c);return this.v(b,a,c)};Re.K=2;
function Se(a,b){return new ce(null,function(){var c=K(b);if(c){if(td(c)){for(var d=Yb(c),e=Vc(d),f=ge(e),g=0;;)if(g<e){var k=bb.g(d,g);k=a.h?a.h(k):a.call(null,k);F(k)&&(k=bb.g(d,g),f.add(k));g+=1}else break;return ie(f.I(),Se(a,Zb(c)))}d=L(c);c=zc(c);return F(a.h?a.h(d):a.call(null,d))?$c(d,Se(a,c)):Se(a,c)}return null},null)}function Te(a,b){return Se(De(a),b)}
function Ue(a,b){return function e(d){return new ce(null,function(){if(F(a.h?a.h(d):a.call(null,d))){var f=ad([K.h?K.h(d):K.call(null,d)]);f=ue(ne,ve(Le,e,f))}else f=null;return $c(d,f)},null)}(b)}function Ve(a){return Se(function(b){return!pd(b)},zc(Ue(pd,a)))}function We(a,b){return null!=a?null!=a&&(a.F&4||q===a.Wc)?Bb(Tb(Ua(Sb,Rb(a),b)),nd(a)):Ua($a,a,b):Ua(bd,a,b)}function Xe(a,b){return Tb(Ua(function(c,d){d=a.h?a.h(d):a.call(null,d);return Sb(c,d)},Rb(cd),b))}
function Ye(a,b){return Ua(H,a,b)}
var Ze=function Ze(a,b,c){var e=K(b);b=L(e);var f=O(e);if(f){e=hd.j;var g=H.g(a,b);c=Ze.j?Ze.j(g,f,c):Ze.call(null,g,f,c);a=e.call(hd,a,b,c)}else a=hd.j(a,b,c);return a},$e=function $e(a){switch(arguments.length){case 3:return $e.j(arguments[0],arguments[1],arguments[2]);case 4:return $e.G(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return $e.P(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);case 6:return $e.fa(arguments[0],arguments[1],arguments[2],arguments[3],
arguments[4],arguments[5]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return $e.v(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],new xc(c.slice(6),0,null))}};$e.j=function(a,b,c){var d=K(b);b=L(d);if(d=O(d))a=hd.j(a,b,$e.j(H.g(a,b),d,c));else{d=hd.j;var e=H.g(a,b);c=c.h?c.h(e):c.call(null,e);a=d.call(hd,a,b,c)}return a};
$e.G=function(a,b,c,d){var e=K(b);b=L(e);if(e=O(e))a=hd.j(a,b,$e.G(H.g(a,b),e,c,d));else{e=hd.j;var f=H.g(a,b);c=c.g?c.g(f,d):c.call(null,f,d);a=e.call(hd,a,b,c)}return a};$e.P=function(a,b,c,d,e){var f=K(b);b=L(f);if(f=O(f))a=hd.j(a,b,$e.P(H.g(a,b),f,c,d,e));else{f=hd.j;var g=H.g(a,b);c=c.j?c.j(g,d,e):c.call(null,g,d,e);a=f.call(hd,a,b,c)}return a};
$e.fa=function(a,b,c,d,e,f){var g=K(b);b=L(g);if(g=O(g))a=hd.j(a,b,$e.fa(H.g(a,b),g,c,d,e,f));else{g=hd.j;var k=H.g(a,b);c=c.G?c.G(k,d,e,f):c.call(null,k,d,e,f);a=g.call(hd,a,b,c)}return a};$e.v=function(a,b,c,d,e,f,g){var k=K(b);b=L(k);return(k=O(k))?hd.j(a,b,ld($e,H.g(a,b),k,c,d,ad([e,f,g]))):hd.j(a,b,ld(c,H.g(a,b),d,e,f,ad([g])))};$e.L=function(a){var b=L(a),c=O(a);a=L(c);var d=O(c);c=L(d);var e=O(d);d=L(e);var f=O(e);e=L(f);var g=O(f);f=L(g);g=O(g);return this.v(b,a,c,d,e,f,g)};$e.K=6;
function af(a,b){var c=hd.j;var d=H.g(a,b);d=zc.h?zc.h(d):zc.call(null,d);return c.call(hd,a,b,d)}function bf(a,b,c,d){var e=hd.j,f=H.g(a,b);c=c.g?c.g(f,d):c.call(null,f,d);return e.call(hd,a,b,c)}function cf(a,b){this.V=a;this.i=b}function df(a){return new cf(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function ef(a){return new cf(a.V,Sa(a.i))}
function ff(a){a=a.s;return 32>a?0:a-1>>>5<<5}function gf(a,b,c){for(;;){if(0===b)return c;var d=df(a);d.i[0]=c;c=d;b-=5}}var hf=function hf(a,b,c,d){var f=ef(c),g=a.s-1>>>b&31;5===b?f.i[g]=d:(c=c.i[g],null!=c?(b-=5,a=hf.G?hf.G(a,b,c,d):hf.call(null,a,b,c,d)):a=gf(null,b-5,d),f.i[g]=a);return f};function jf(a,b){throw Error(["No item ",G.h(a)," in vector of length ",G.h(b)].join(""));}
function kf(a,b){if(b>=ff(a))return a.R;var c=a.root;for(a=a.shift;;)if(0<a){var d=a-5;c=c.i[b>>>a&31];a=d}else return c.i}var lf=function lf(a,b,c,d,e){var g=ef(c);if(0===b)g.i[d&31]=e;else{var k=d>>>b&31;b-=5;c=c.i[k];a=lf.P?lf.P(a,b,c,d,e):lf.call(null,a,b,c,d,e);g.i[k]=a}return g},mf=function mf(a,b,c){var e=a.s-2>>>b&31;if(5<b){b-=5;var f=c.i[e];a=mf.j?mf.j(a,b,f):mf.call(null,a,b,f);if(null==a&&0===e)return null;c=ef(c);c.i[e]=a;return c}if(0===e)return null;c=ef(c);c.i[e]=null;return c};
function nf(a,b,c){this.ac=this.u=0;this.i=a;this.Sc=b;this.start=0;this.end=c}nf.prototype.la=function(){return this.u<this.end};nf.prototype.next=function(){32===this.u-this.ac&&(this.i=kf(this.Sc,this.u),this.ac+=32);var a=this.i[this.u&31];this.u+=1;return a};function of(a,b,c,d){return c<d?pf(a,b,Wc(a,c),c+1,d):b.B?b.B():b.call(null)}
function pf(a,b,c,d,e){var f=c;c=d;for(d=kf(a,d);;)if(c<e){var g=c&31;d=0===g?kf(a,c):d;g=d[g];f=b.g?b.g(f,g):b.call(null,f,g);if(Mc(f))return yb(f);c+=1}else return f}function W(a,b,c,d,e,f){this.A=a;this.s=b;this.shift=c;this.root=d;this.R=e;this.C=f;this.o=167666463;this.F=139268}h=W.prototype;h.vb=function(a,b){return 0<=b&&b<this.s?new qf(b,kf(this,b)[b&31]):null};h.toString=function(){return ic(this)};h.equiv=function(a){return this.H(null,a)};
h.indexOf=function(){var a=null;a=function(b,c){switch(arguments.length){case 1:return Uc(this,b,0);case 2:return Uc(this,b,c)}throw Error("Invalid arity: "+arguments.length);};a.h=function(b){return Uc(this,b,0)};a.g=function(b,c){return Uc(this,b,c)};return a}();
h.lastIndexOf=function(){function a(c){return Xc(this,c,Vc(this))}var b=null;b=function(c,d){switch(arguments.length){case 1:return a.call(this,c);case 2:return Xc(this,c,d)}throw Error("Invalid arity: "+arguments.length);};b.h=a;b.g=function(c,d){return Xc(this,c,d)};return b}();h.aa=function(a,b){return this.J(null,b,null)};h.J=function(a,b,c){return"number"===typeof b?this.Ea(null,b,c):c};
h.wb=function(a,b,c){a=0;for(var d=c;;)if(a<this.s){var e=kf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=f+a,k=e[f];d=b.j?b.j(d,g,k):b.call(null,d,g,k);if(Mc(d)){e=d;break a}f+=1}else{e=d;break a}if(Mc(e))return yb(e);a+=c;d=e}else return d};h.$=function(a,b){return(0<=b&&b<this.s?kf(this,b):jf(b,this.s))[b&31]};h.Ea=function(a,b,c){return 0<=b&&b<this.s?kf(this,b)[b&31]:c};
h.cc=function(a,b){if(0<=a&&a<this.s){if(ff(this)<=a){var c=Sa(this.R);c[a&31]=b;return new W(this.A,this.s,this.shift,this.root,c,null)}return new W(this.A,this.s,this.shift,lf(this,this.shift,this.root,a,b),this.R,null)}if(a===this.s)return this.ca(null,b);throw Error(["Index ",G.h(a)," out of bounds  [0,",G.h(this.s),"]"].join(""));};h.Ga=function(){var a=this.s;return new nf(0<Vc(this)?kf(this,0):null,this,a)};h.T=function(){return this.A};h.Y=function(){return this.s};
h.Ab=function(){return 0<this.s?this.$(null,this.s-1):null};h.Bb=function(){if(0===this.s)throw Error("Can't pop empty vector");if(1===this.s)return Bb(cd,this.A);if(1<this.s-ff(this))return new W(this.A,this.s-1,this.shift,this.root,this.R.slice(0,-1),null);var a=kf(this,this.s-2),b=mf(this,this.shift,this.root);b=null==b?Z:b;var c=this.s-1;return 5<this.shift&&null==b.i[1]?new W(this.A,c,this.shift-5,b.i[0],a,null):new W(this.A,c,this.shift,b,a,null)};
h.Z=function(){var a=this.C;return null!=a?a:this.C=a=Gc(this)};h.H=function(a,b){if(b instanceof W)if(this.s===Vc(b))for(a=this.Ga(null),b=b.Ga(null);;)if(a.la()){var c=a.next(),d=b.next();if(!Bc.g(c,d))return!1}else return!0;else return!1;else return Zc(this,b)};
h.mb=function(){var a=this.s,b=this.shift,c=new cf({},Sa(this.root.i)),d=this.R,e=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];ud(d,0,e,0,d.length);return new rf(a,b,c,e)};h.da=function(){return Bb(cd,this.A)};h.ja=function(a,b){return of(this,b,0,this.s)};
h.ka=function(a,b,c){a=0;for(var d=c;;)if(a<this.s){var e=kf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=e[f];d=b.g?b.g(d,g):b.call(null,d,g);if(Mc(d)){e=d;break a}f+=1}else{e=d;break a}if(Mc(e))return yb(e);a+=c;d=e}else return d};h.Ua=function(a,b,c){if("number"===typeof b)return this.cc(b,c);throw Error("Vector's key for assoc must be a number.");};h.fb=function(a,b){return yd(b)?0<=b&&b<this.s:!1};
h.S=function(){if(0===this.s)var a=null;else if(32>=this.s)a=new xc(this.R,0,null);else{a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.i[0];else{a=a.i;break a}}a=new sf(this,a,0,0,null)}return a};h.X=function(a,b){return b===this.A?this:new W(b,this.s,this.shift,this.root,this.R,this.C)};
h.ca=function(a,b){if(32>this.s-ff(this)){a=this.R.length;for(var c=Array(a+1),d=0;;)if(d<a)c[d]=this.R[d],d+=1;else break;c[a]=b;return new W(this.A,this.s+1,this.shift,this.root,c,null)}a=(c=this.s>>>5>1<<this.shift)?this.shift+5:this.shift;c?(c=df(null),c.i[0]=this.root,d=gf(null,this.shift,new cf(null,this.R)),c.i[1]=d):c=hf(this,this.shift,this.root,new cf(null,this.R));return new W(this.A,this.s+1,a,c,[b],null)};
h.call=function(a,b){if("number"===typeof b)return this.$(null,b);throw Error("Key must be integer");};h.apply=function(a,b){var c=Sa(b);a=this.call;b=a.apply;var d=[this],e=d.concat;if(20<c.length){var f=c.slice(0,20);f.push(c.slice(20));c=f}return b.call(a,this,e.call(d,c))};h.h=function(a){if("number"===typeof a)return this.$(null,a);throw Error("Key must be integer");};
var Z=new cf(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),cd=new W(null,0,5,Z,[],Hc);function tf(a,b){var c=a.length;a=b?a:Sa(a);if(32>c)return new W(null,c,5,Z,a,null);b=32;for(var d=(new W(null,32,5,Z,a.slice(0,32),null)).mb(null);;)if(b<c){var e=b+1;d=Sb(d,a[b]);b=e}else return Tb(d)}W.prototype[Ra]=function(){return Dc(this)};
function uf(a){return vf(a)?new W(null,2,5,Z,[sb(a),tb(a)],null):sd(a)?md(a,null):Ma(a)?tf(a,!0):Tb(Ua(Sb,Rb(cd),a))}var wf=function wf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return wf.v(0<c.length?new xc(c.slice(0),0,null):null)};wf.v=function(a){return a instanceof xc&&0===a.u?tf(a.i,!Ma(a.i)):uf(a)};wf.K=0;wf.L=function(a){return this.v(K(a))};
function sf(a,b,c,d,e){this.Ia=a;this.node=b;this.u=c;this.Ba=d;this.A=e;this.C=null;this.o=32375020;this.F=1536}h=sf.prototype;h.toString=function(){return ic(this)};h.equiv=function(a){return this.H(null,a)};h.indexOf=function(){var a=null;a=function(b,c){switch(arguments.length){case 1:return Uc(this,b,0);case 2:return Uc(this,b,c)}throw Error("Invalid arity: "+arguments.length);};a.h=function(b){return Uc(this,b,0)};a.g=function(b,c){return Uc(this,b,c)};return a}();
h.lastIndexOf=function(){function a(c){return Xc(this,c,Vc(this))}var b=null;b=function(c,d){switch(arguments.length){case 1:return a.call(this,c);case 2:return Xc(this,c,d)}throw Error("Invalid arity: "+arguments.length);};b.h=a;b.g=function(c,d){return Xc(this,c,d)};return b}();h.T=function(){return this.A};h.ba=function(){if(this.Ba+1<this.node.length){var a=new sf(this.Ia,this.node,this.u,this.Ba+1,null);return null==a?null:a}return this.Qb()};
h.Z=function(){var a=this.C;return null!=a?a:this.C=a=Gc(this)};h.H=function(a,b){return Zc(this,b)};h.da=function(){return Ac};h.ja=function(a,b){return of(this.Ia,b,this.u+this.Ba,Vc(this.Ia))};h.ka=function(a,b,c){return pf(this.Ia,b,c,this.u+this.Ba,Vc(this.Ia))};h.ga=function(){return this.node[this.Ba]};h.ha=function(){if(this.Ba+1<this.node.length){var a=new sf(this.Ia,this.node,this.u,this.Ba+1,null);return null==a?Ac:a}return this.ab(null)};h.S=function(){return this};
h.tb=function(){var a=this.node;return new fe(a,this.Ba,a.length)};h.ab=function(){var a=this.u+this.node.length;return a<Wa(this.Ia)?new sf(this.Ia,kf(this.Ia,a),a,0,null):Ac};h.X=function(a,b){return b===this.A?this:new sf(this.Ia,this.node,this.u,this.Ba,b)};h.ca=function(a,b){return $c(b,this)};h.Qb=function(){var a=this.u+this.node.length;return a<Wa(this.Ia)?new sf(this.Ia,kf(this.Ia,a),a,0,null):null};sf.prototype[Ra]=function(){return Dc(this)};
function xf(a,b){return a===b.V?b:new cf(a,Sa(b.i))}var yf=function yf(a,b,c,d){c=xf(a.root.V,c);var f=a.s-1>>>b&31;if(5===b)a=d;else{var g=c.i[f];null!=g?(b-=5,a=yf.G?yf.G(a,b,g,d):yf.call(null,a,b,g,d)):a=gf(a.root.V,b-5,d)}c.i[f]=a;return c};function rf(a,b,c,d){this.s=a;this.shift=b;this.root=c;this.R=d;this.F=88;this.o=275}h=rf.prototype;
h.pb=function(a,b){if(this.root.V){if(32>this.s-ff(this))this.R[this.s&31]=b;else{a=new cf(this.root.V,this.R);var c=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];c[0]=b;this.R=c;this.s>>>5>1<<this.shift?(b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],c=this.shift+5,b[0]=
this.root,b[1]=gf(this.root.V,this.shift,a),this.root=new cf(this.root.V,b),this.shift=c):this.root=yf(this,this.shift,this.root,a)}this.s+=1;return this}throw Error("conj! after persistent!");};h.Cb=function(){if(this.root.V){this.root.V=null;var a=this.s-ff(this),b=Array(a);ud(this.R,0,b,0,a);return new W(null,this.s,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
h.ob=function(a,b,c){if("number"===typeof b)return zf(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
function zf(a,b,c){if(a.root.V){if(0<=b&&b<a.s){if(ff(a)<=b)a.R[b&31]=c;else{var d=function(){return function k(f,g){g=xf(a.root.V,g);if(0===f)g.i[b&31]=c;else{var l=b>>>f&31;f=k(f-5,g.i[l]);g.i[l]=f}return g}(a.shift,a.root)}();a.root=d}return a}if(b===a.s)return a.pb(null,c);throw Error(["Index ",G.h(b)," out of bounds for TransientVector of length",G.h(a.s)].join(""));}throw Error("assoc! after persistent!");}h.Y=function(){if(this.root.V)return this.s;throw Error("count after persistent!");};
h.$=function(a,b){if(this.root.V)return(0<=b&&b<this.s?kf(this,b):jf(b,this.s))[b&31];throw Error("nth after persistent!");};h.Ea=function(a,b,c){return 0<=b&&b<this.s?this.$(null,b):c};h.aa=function(a,b){return this.J(null,b,null)};h.J=function(a,b,c){if(this.root.V)return"number"===typeof b?this.Ea(null,b,c):c;throw Error("lookup after persistent!");};
h.call=function(){var a=null;a=function(b,c,d){switch(arguments.length){case 2:return this.aa(null,c);case 3:return this.J(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.g=function(b,c){return this.aa(null,c)};a.j=function(b,c,d){return this.J(null,c,d)};return a}();h.apply=function(a,b){var c=Sa(b);a=this.call;b=a.apply;var d=[this],e=d.concat;if(20<c.length){var f=c.slice(0,20);f.push(c.slice(20));c=f}return b.call(a,this,e.call(d,c))};h.h=function(a){return this.aa(null,a)};
h.g=function(a,b){return this.J(null,a,b)};function Af(){this.o=2097152;this.F=0}Af.prototype.equiv=function(a){return this.H(null,a)};Af.prototype.H=function(){return!1};var Bf=new Af;function Cf(a,b){return xd(qd(b)&&!rd(b)?Vc(a)===Vc(b)?(null!=a?a.o&1048576||q===a.Zc||(a.o?0:Oa(Fb,a)):Oa(Fb,a))?Ld(function(c,d,e){return Bc.g(H.j(b,d,Bf),e)?!0:new Lc},a):Be(function(c){return Bc.g(H.j(b,L(c),Bf),L(O(c)))},a):null:null)}function Df(a,b,c){this.u=0;this.Qc=a;this.fc=5;this.Kc=b;this.oc=c}
Df.prototype.la=function(){var a=this.u<this.fc;return a?a:this.oc.la()};Df.prototype.next=function(){if(this.u<this.fc){var a=Wc(this.Kc,this.u);this.u+=1;return new qf(a,kb.g(this.Qc,a))}return this.oc.next()};Df.prototype.remove=function(){return Error("Unsupported operation")};function Ef(a){this.M=a}Ef.prototype.next=function(){if(null!=this.M){var a=L(this.M),b=gd(a,0);a=gd(a,1);this.M=O(this.M);return{value:[b,a],done:!1}}return{value:null,done:!0}};function Ff(a){this.M=a}
Ff.prototype.next=function(){if(null!=this.M){var a=L(this.M);this.M=O(this.M);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function Gf(a,b){if(b instanceof I)a:{var c=a.length;b=b.Ha;for(var d=0;;){if(c<=d){a=-1;break a}if(a[d]instanceof I&&b===a[d].Ha){a=d;break a}d+=2}}else if("string"===typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){a=-1;break a}if(b===a[d]){a=d;break a}d+=2}else if(b instanceof uc)a:for(c=a.length,b=b.Va,d=0;;){if(c<=d){a=-1;break a}if(a[d]instanceof uc&&b===a[d].Va){a=d;break a}d+=2}else if(null==b)a:for(b=a.length,c=0;;){if(b<=c){a=-1;break a}if(null==a[c]){a=c;break a}c+=2}else a:for(c=
a.length,d=0;;){if(c<=d){a=-1;break a}if(Bc.g(b,a[d])){a=d;break a}d+=2}return a}function qf(a,b){this.key=a;this.D=b;this.C=null;this.o=166619935;this.F=0}h=qf.prototype;h.vb=function(a,b){switch(b){case 0:return new qf(0,this.key);case 1:return new qf(1,this.D);default:return null}};
h.indexOf=function(){var a=null;a=function(b,c){switch(arguments.length){case 1:return Uc(this,b,0);case 2:return Uc(this,b,c)}throw Error("Invalid arity: "+arguments.length);};a.h=function(b){return Uc(this,b,0)};a.g=function(b,c){return Uc(this,b,c)};return a}();
h.lastIndexOf=function(){function a(c){return Xc(this,c,Vc(this))}var b=null;b=function(c,d){switch(arguments.length){case 1:return a.call(this,c);case 2:return Xc(this,c,d)}throw Error("Invalid arity: "+arguments.length);};b.h=a;b.g=function(c,d){return Xc(this,c,d)};return b}();h.aa=function(a,b){return this.Ea(null,b,null)};h.J=function(a,b,c){return this.Ea(null,b,c)};h.$=function(a,b){if(0===b)return this.key;if(1===b)return this.D;throw Error("Index out of bounds");};
h.Ea=function(a,b,c){return 0===b?this.key:1===b?this.D:c};h.cc=function(a,b){return(new W(null,2,5,Z,[this.key,this.D],null)).cc(a,b)};h.T=function(){return null};h.Y=function(){return 2};h.xc=function(){return this.key};h.yc=function(){return this.D};h.Ab=function(){return this.D};h.Bb=function(){return new W(null,1,5,Z,[this.key],null)};h.Z=function(){var a=this.C;return null!=a?a:this.C=a=Gc(this)};h.H=function(a,b){return Zc(this,b)};h.da=function(){return null};
h.ja=function(a,b){return Nc(this,b)};h.ka=function(a,b,c){a:{a=this.Y(null);var d=c;for(c=0;;)if(c<a){var e=this.$(null,c);d=b.g?b.g(d,e):b.call(null,d,e);if(Mc(d)){b=yb(d);break a}c+=1}else{b=d;break a}}return b};h.Ua=function(a,b,c){return hd.j(new W(null,2,5,Z,[this.key,this.D],null),b,c)};h.fb=function(a,b){return 0===b||1===b};h.S=function(){return new xc([this.key,this.D],0,null)};h.X=function(a,b){return md(new W(null,2,5,Z,[this.key,this.D],null),b)};
h.ca=function(a,b){return new W(null,3,5,Z,[this.key,this.D,b],null)};h.call=function(){var a=null;a=function(b,c,d){switch(arguments.length){case 2:return this.$(null,c);case 3:return this.Ea(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.g=function(b,c){return this.$(null,c)};a.j=function(b,c,d){return this.Ea(null,c,d)};return a}();
h.apply=function(a,b){var c=Sa(b);a=this.call;b=a.apply;var d=[this],e=d.concat;if(20<c.length){var f=c.slice(0,20);f.push(c.slice(20));c=f}return b.call(a,this,e.call(d,c))};h.h=function(a){return this.$(null,a)};h.g=function(a,b){return this.Ea(null,a,b)};function vf(a){return null!=a?a.o&2048||q===a.bd?!0:!1:!1}function Hf(a,b,c){this.i=a;this.u=b;this.Ta=c;this.o=32374990;this.F=0}h=Hf.prototype;h.toString=function(){return ic(this)};h.equiv=function(a){return this.H(null,a)};
h.indexOf=function(){var a=null;a=function(b,c){switch(arguments.length){case 1:return Uc(this,b,0);case 2:return Uc(this,b,c)}throw Error("Invalid arity: "+arguments.length);};a.h=function(b){return Uc(this,b,0)};a.g=function(b,c){return Uc(this,b,c)};return a}();
h.lastIndexOf=function(){function a(c){return Xc(this,c,Vc(this))}var b=null;b=function(c,d){switch(arguments.length){case 1:return a.call(this,c);case 2:return Xc(this,c,d)}throw Error("Invalid arity: "+arguments.length);};b.h=a;b.g=function(c,d){return Xc(this,c,d)};return b}();h.T=function(){return this.Ta};h.ba=function(){return this.u<this.i.length-2?new Hf(this.i,this.u+2,null):null};h.Y=function(){return(this.i.length-this.u)/2};h.Z=function(){return Gc(this)};
h.H=function(a,b){return Zc(this,b)};h.da=function(){return Ac};h.ja=function(a,b){return Gd(b,this)};h.ka=function(a,b,c){return Hd(b,c,this)};h.ga=function(){return new qf(this.i[this.u],this.i[this.u+1])};h.ha=function(){return this.u<this.i.length-2?new Hf(this.i,this.u+2,null):Ac};h.S=function(){return this};h.X=function(a,b){return b===this.Ta?this:new Hf(this.i,this.u,b)};h.ca=function(a,b){return $c(b,this)};Hf.prototype[Ra]=function(){return Dc(this)};
function If(a,b){this.i=a;this.u=0;this.s=b}If.prototype.la=function(){return this.u<this.s};If.prototype.next=function(){var a=new qf(this.i[this.u],this.i[this.u+1]);this.u+=2;return a};function u(a,b,c,d){this.A=a;this.s=b;this.i=c;this.C=d;this.o=16647951;this.F=139268}h=u.prototype;h.vb=function(a,b){a=Gf(this.i,b);return-1===a?null:new qf(this.i[a],this.i[a+1])};h.toString=function(){return ic(this)};h.equiv=function(a){return this.H(null,a)};h.keys=function(){return Dc(Jf(this))};
h.entries=function(){return new Ef(K(K(this)))};h.values=function(){return Dc(Kf(this))};h.has=function(a){return zd(this,a)};h.get=function(a,b){return this.J(null,a,b)};h.forEach=function(a){for(var b=K(this),c=null,d=0,e=0;;)if(e<d){var f=c.$(null,e),g=gd(f,0);f=gd(f,1);a.g?a.g(f,g):a.call(null,f,g);e+=1}else if(b=K(b))td(b)?(c=Yb(b),b=Zb(b),g=c,d=Vc(c),c=g):(c=L(b),g=gd(c,0),f=gd(c,1),a.g?a.g(f,g):a.call(null,f,g),b=O(b),c=null,d=0),e=0;else return null};
h.aa=function(a,b){return this.J(null,b,null)};h.J=function(a,b,c){a=Gf(this.i,b);return-1===a?c:this.i[a+1]};h.wb=function(a,b,c){a=this.i.length;for(var d=0;;)if(d<a){var e=this.i[d],f=this.i[d+1];c=b.j?b.j(c,e,f):b.call(null,c,e,f);if(Mc(c))return yb(c);d+=2}else return c};h.Ga=function(){return new If(this.i,2*this.s)};h.T=function(){return this.A};h.Y=function(){return this.s};h.Z=function(){var a=this.C;return null!=a?a:this.C=a=Ic(this)};
h.H=function(a,b){if(qd(b)&&!rd(b))if(a=this.i.length,this.s===b.Y(null))for(var c=0;;)if(c<a){var d=b.J(null,this.i[c],vd);if(d!==vd)if(Bc.g(this.i[c+1],d))c+=2;else return!1;else return!1}else return!0;else return!1;else return!1};h.mb=function(){return new Lf(this.i.length,Sa(this.i))};h.da=function(){return Bb(ye,this.A)};h.ja=function(a,b){return Id(this,b)};h.ka=function(a,b,c){return Jd(this,b,c)};
h.Sb=function(a,b){if(0<=Gf(this.i,b)){a=this.i.length;var c=a-2;if(0===c)return this.da(null);c=Array(c);for(var d=0,e=0;;){if(d>=a)return new u(this.A,this.s-1,c,null);Bc.g(b,this.i[d])?d+=2:(c[e]=this.i[d],c[e+1]=this.i[d+1],e+=2,d+=2)}}else return this};
h.Ua=function(a,b,c){a=Gf(this.i,b);if(-1===a){if(this.s<Mf){a=this.i;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new u(this.A,this.s+1,e,null)}return Bb(ob(We(Nf,this),b,c),this.A)}if(c===this.i[a+1])return this;b=Sa(this.i);b[a+1]=c;return new u(this.A,this.s,b,null)};h.fb=function(a,b){return-1!==Gf(this.i,b)};h.S=function(){var a=this.i;return 0<=a.length-2?new Hf(a,0,null):null};h.X=function(a,b){return b===this.A?this:new u(b,this.s,this.i,this.C)};
h.ca=function(a,b){if(sd(b))return this.Ua(null,bb.g(b,0),bb.g(b,1));a=this;for(b=K(b);;){if(null==b)return a;var c=L(b);if(sd(c))a=ob(a,bb.g(c,0),bb.g(c,1)),b=O(b);else throw Error("conj on a map takes map entries or seqables of map entries");}};
h.call=function(){var a=null;a=function(b,c,d){switch(arguments.length){case 2:return this.aa(null,c);case 3:return this.J(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.g=function(b,c){return this.aa(null,c)};a.j=function(b,c,d){return this.J(null,c,d)};return a}();h.apply=function(a,b){var c=Sa(b);a=this.call;b=a.apply;var d=[this],e=d.concat;if(20<c.length){var f=c.slice(0,20);f.push(c.slice(20));c=f}return b.call(a,this,e.call(d,c))};h.h=function(a){return this.aa(null,a)};
h.g=function(a,b){return this.J(null,a,b)};var ye=new u(null,0,[],Jc),Mf=8;function Of(a,b){return a===b?!0:Zd(a,b)?!0:Bc.g(a,b)}function Pf(a){for(var b=0,c=0;;)if(b<a.length){var d;a:for(d=0;;)if(d<b){var e=Of(a[b],a[d]);if(e){d=e;break a}d=2+d}else{d=!1;break a}c=d?c:c+2;b=2+b}else return c}function Qf(a,b){var c=a.length-1,d=K(b);b=Array(c+2*Vc(d));a=ud(a,0,b,0,c);for(b=c;;)if(d){var e=L(d);a[b]=sb(e);a[b+1]=tb(e);b=2+c;d=O(d)}else return a}
function id(a){var b=a.length,c=1===(b&1),d;if(!(d=c))a:for(d=0;;)if(d<a.length){var e;b:for(e=0;;)if(e<d){var f=Of(a[d],a[e]);if(f){e=f;break b}e=2+e}else{e=!1;break b}if(e){d=e;break a}d=2+d}else{d=!1;break a}return d?Rf(a,c):new u(null,b/2,a,null)}
function Rf(a,b){var c=b?Qf(a,We(ye,a[a.length-1])):a;a=Pf(c);var d=c.length;if(a<d){a=Array(a);for(var e=0,f=0;;)if(e<d)(function(){for(var g=0;;)if(g<f){var k=Of(c[e],c[g]);if(k)return k;g=2+g}else return!1})()?(b=f,e=2+e,f=b):(b=function(){for(var g=d-2;;)if(g>=e){if(Of(c[e],c[g]))return g;g-=2}else return g}(),a[f]=c[e],a[f+1]=c[b+1],b=2+f,e=2+e,f=b);else break;return new u(null,a.length/2,a,null)}return new u(null,c.length/2,c,null)}u.prototype[Ra]=function(){return Dc(this)};
function Lf(a,b){this.qb={};this.rb=a;this.i=b;this.o=259;this.F=56}h=Lf.prototype;h.Y=function(){if(this.qb)return Sd(this.rb);throw Error("count after persistent!");};h.aa=function(a,b){return this.J(null,b,null)};h.J=function(a,b,c){if(this.qb)return a=Gf(this.i,b),-1===a?c:this.i[a+1];throw Error("lookup after persistent!");};
h.pb=function(a,b){if(this.qb){if(vf(b))return this.ob(null,sb(b),tb(b));if(sd(b))return this.ob(null,b.h?b.h(0):b.call(null,0),b.h?b.h(1):b.call(null,1));a=K(b);for(b=this;;){var c=L(a);if(F(c))a=O(a),b=Ub(b,sb(c),tb(c));else return b}}else throw Error("conj! after persistent!");};h.Cb=function(){if(this.qb)return this.qb=!1,new u(null,Sd(this.rb),this.i,null);throw Error("persistent! called twice");};
h.ob=function(a,b,c){if(this.qb){a=Gf(this.i,b);if(-1===a){if(this.rb+2<=2*Mf)return this.rb+=2,this.i.push(b),this.i.push(c),this;a:{a=this.rb;for(var d=this.i,e=Rb(Nf),f=0;;)if(f<a)e=Ub(e,d[f],d[f+1]),f+=2;else break a}return Ub(e,b,c)}c!==this.i[a+1]&&(this.i[a+1]=c);return this}throw Error("assoc! after persistent!");};
h.call=function(){var a=null;a=function(b,c,d){switch(arguments.length){case 2:return this.J(null,c,null);case 3:return this.J(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.g=function(b,c){return this.J(null,c,null)};a.j=function(b,c,d){return this.J(null,c,d)};return a}();h.apply=function(a,b){var c=Sa(b);a=this.call;b=a.apply;var d=[this],e=d.concat;if(20<c.length){var f=c.slice(0,20);f.push(c.slice(20));c=f}return b.call(a,this,e.call(d,c))};
h.h=function(a){return this.J(null,a,null)};h.g=function(a,b){return this.J(null,a,b)};function Sf(){this.D=!1}function Tf(a,b,c){a=Sa(a);a[b]=c;return a}function Uf(a,b){var c=Array(a.length-2);ud(a,0,c,0,2*b);ud(a,2*(b+1),c,2*b,c.length-2*b);return c}function Vf(a,b,c,d){a=a.hb(b);a.i[c]=d;return a}
function Wf(a,b,c){for(var d=a.length,e=0,f=c;;)if(e<d){c=a[e];if(null!=c){var g=a[e+1];c=b.j?b.j(f,c,g):b.call(null,f,c,g)}else c=a[e+1],c=null!=c?c.Mb(b,f):f;if(Mc(c))return c;e+=2;f=c}else return f}function Xf(a){this.i=a;this.u=0;this.Ra=this.Nb=null}Xf.prototype.advance=function(){for(var a=this.i.length;;)if(this.u<a){var b=this.i[this.u],c=this.i[this.u+1];null!=b?b=this.Nb=new qf(b,c):null!=c?(b=gc(c),b=b.la()?this.Ra=b:!1):b=!1;this.u+=2;if(b)return!0}else return!1};
Xf.prototype.la=function(){var a=null!=this.Nb;return a?a:(a=null!=this.Ra)?a:this.advance()};Xf.prototype.next=function(){if(null!=this.Nb){var a=this.Nb;this.Nb=null;return a}if(null!=this.Ra)return a=this.Ra.next(),this.Ra.la()||(this.Ra=null),a;if(this.advance())return this.next();throw Error("No such element");};Xf.prototype.remove=function(){return Error("Unsupported operation")};function Yf(a,b,c){this.V=a;this.W=b;this.i=c;this.F=131072;this.o=0}h=Yf.prototype;
h.hb=function(a){if(a===this.V)return this;var b=Td(this.W),c=Array(0>b?4:2*(b+1));ud(this.i,0,c,0,2*b);return new Yf(a,this.W,c)};h.Jb=function(){return Zf(this.i,0,null)};h.Mb=function(a,b){return Wf(this.i,a,b)};h.cb=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.W&e))return d;var f=Td(this.W&e-1);e=this.i[2*f];f=this.i[2*f+1];return null==e?f.cb(a+5,b,c,d):Of(c,e)?f:d};
h.Pa=function(a,b,c,d,e,f){var g=1<<(c>>>b&31),k=Td(this.W&g-1);if(0===(this.W&g)){var l=Td(this.W);if(2*l<this.i.length){a=this.hb(a);b=a.i;f.D=!0;a:for(c=2*(l-k),f=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*k]=d;b[2*k+1]=e;a.W|=g;return a}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>b&31]=$f.Pa(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0===
(this.W>>>d&1)?d+=1:(k[d]=null!=this.i[e]?$f.Pa(a,b+5,rc(this.i[e]),this.i[e],this.i[e+1],f):this.i[e+1],e+=2,d+=1);else break;return new ag(a,l+1,k)}b=Array(2*(l+4));ud(this.i,0,b,0,2*k);b[2*k]=d;b[2*k+1]=e;ud(this.i,2*k,b,2*(k+1),2*(l-k));f.D=!0;a=this.hb(a);a.i=b;a.W|=g;return a}l=this.i[2*k];g=this.i[2*k+1];if(null==l)return l=g.Pa(a,b+5,c,d,e,f),l===g?this:Vf(this,a,2*k+1,l);if(Of(d,l))return e===g?this:Vf(this,a,2*k+1,e);f.D=!0;f=b+5;b=rc(l);if(b===c)e=new bg(null,b,2,[l,g,d,e]);else{var m=
new Sf;e=$f.Pa(a,f,b,l,g,m).Pa(a,f,c,d,e,m)}d=2*k;k=2*k+1;a=this.hb(a);a.i[d]=null;a.i[k]=e;return a};
h.Oa=function(a,b,c,d,e){var f=1<<(b>>>a&31),g=Td(this.W&f-1);if(0===(this.W&f)){var k=Td(this.W);if(16<=k){g=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];g[b>>>a&31]=$f.Oa(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0===(this.W>>>c&1)?c+=1:(g[c]=null!=this.i[d]?$f.Oa(a+5,rc(this.i[d]),this.i[d],this.i[d+1],e):this.i[d+1],d+=2,c+=1);else break;return new ag(null,k+1,g)}a=Array(2*(k+1));ud(this.i,
0,a,0,2*g);a[2*g]=c;a[2*g+1]=d;ud(this.i,2*g,a,2*(g+1),2*(k-g));e.D=!0;return new Yf(null,this.W|f,a)}var l=this.i[2*g];f=this.i[2*g+1];if(null==l)return k=f.Oa(a+5,b,c,d,e),k===f?this:new Yf(null,this.W,Tf(this.i,2*g+1,k));if(Of(c,l))return d===f?this:new Yf(null,this.W,Tf(this.i,2*g+1,d));e.D=!0;e=this.W;k=this.i;a+=5;var m=rc(l);if(m===b)c=new bg(null,m,2,[l,f,c,d]);else{var n=new Sf;c=$f.Oa(a,m,l,f,n).Oa(a,b,c,d,n)}a=2*g;g=2*g+1;d=Sa(k);d[a]=null;d[g]=c;return new Yf(null,e,d)};
h.Ib=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.W&e))return d;var f=Td(this.W&e-1);e=this.i[2*f];f=this.i[2*f+1];return null==e?f.Ib(a+5,b,c,d):Of(c,e)?new qf(e,f):d};h.Kb=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.W&d))return this;var e=Td(this.W&d-1),f=this.i[2*e],g=this.i[2*e+1];return null==f?(a=g.Kb(a+5,b,c),a===g?this:null!=a?new Yf(null,this.W,Tf(this.i,2*e+1,a)):this.W===d?null:new Yf(null,this.W^d,Uf(this.i,e))):Of(c,f)?this.W===d?null:new Yf(null,this.W^d,Uf(this.i,e)):this};
h.Ga=function(){return new Xf(this.i)};var $f=new Yf(null,0,[]);function cg(a){this.i=a;this.u=0;this.Ra=null}cg.prototype.la=function(){for(var a=this.i.length;;){if(null!=this.Ra&&this.Ra.la())return!0;if(this.u<a){var b=this.i[this.u];this.u+=1;null!=b&&(this.Ra=gc(b))}else return!1}};cg.prototype.next=function(){if(this.la())return this.Ra.next();throw Error("No such element");};cg.prototype.remove=function(){return Error("Unsupported operation")};
function ag(a,b,c){this.V=a;this.s=b;this.i=c;this.F=131072;this.o=0}h=ag.prototype;h.hb=function(a){return a===this.V?this:new ag(a,this.s,Sa(this.i))};h.Jb=function(){return dg(this.i,0,null)};h.Mb=function(a,b){for(var c=this.i.length,d=0;;)if(d<c){var e=this.i[d];if(null!=e){b=e.Mb(a,b);if(Mc(b))return b;d+=1}else d+=1}else return b};h.cb=function(a,b,c,d){var e=this.i[b>>>a&31];return null!=e?e.cb(a+5,b,c,d):d};
h.Pa=function(a,b,c,d,e,f){var g=c>>>b&31,k=this.i[g];if(null==k)return a=Vf(this,a,g,$f.Pa(a,b+5,c,d,e,f)),a.s+=1,a;b=k.Pa(a,b+5,c,d,e,f);return b===k?this:Vf(this,a,g,b)};h.Oa=function(a,b,c,d,e){var f=b>>>a&31,g=this.i[f];if(null==g)return new ag(null,this.s+1,Tf(this.i,f,$f.Oa(a+5,b,c,d,e)));a=g.Oa(a+5,b,c,d,e);return a===g?this:new ag(null,this.s,Tf(this.i,f,a))};h.Ib=function(a,b,c,d){var e=this.i[b>>>a&31];return null!=e?e.Ib(a+5,b,c,d):d};
h.Kb=function(a,b,c){var d=b>>>a&31,e=this.i[d];if(null!=e){a=e.Kb(a+5,b,c);if(a===e)d=this;else if(null==a)if(8>=this.s)a:{e=this.i;a=e.length;b=Array(2*(this.s-1));c=0;for(var f=1,g=0;;)if(c<a)c!==d&&null!=e[c]?(b[f]=e[c],f+=2,g|=1<<c,c+=1):c+=1;else{d=new Yf(null,g,b);break a}}else d=new ag(null,this.s-1,Tf(this.i,d,a));else d=new ag(null,this.s,Tf(this.i,d,a));return d}return this};h.Ga=function(){return new cg(this.i)};
function eg(a,b,c){b*=2;for(var d=0;;)if(d<b){if(Of(c,a[d]))return d;d+=2}else return-1}function bg(a,b,c,d){this.V=a;this.Ya=b;this.s=c;this.i=d;this.F=131072;this.o=0}h=bg.prototype;h.hb=function(a){if(a===this.V)return this;var b=Array(2*(this.s+1));ud(this.i,0,b,0,2*this.s);return new bg(a,this.Ya,this.s,b)};h.Jb=function(){return Zf(this.i,0,null)};h.Mb=function(a,b){return Wf(this.i,a,b)};h.cb=function(a,b,c,d){a=eg(this.i,this.s,c);return 0>a?d:Of(c,this.i[a])?this.i[a+1]:d};
h.Pa=function(a,b,c,d,e,f){if(c===this.Ya){b=eg(this.i,this.s,d);if(-1===b){if(this.i.length>2*this.s)return b=2*this.s,c=2*this.s+1,a=this.hb(a),a.i[b]=d,a.i[c]=e,f.D=!0,a.s+=1,a;c=this.i.length;b=Array(c+2);ud(this.i,0,b,0,c);b[c]=d;b[c+1]=e;f.D=!0;d=this.s+1;a===this.V?(this.i=b,this.s=d,a=this):a=new bg(this.V,this.Ya,d,b);return a}return this.i[b+1]===e?this:Vf(this,a,b+1,e)}return(new Yf(a,1<<(this.Ya>>>b&31),[null,this,null,null])).Pa(a,b,c,d,e,f)};
h.Oa=function(a,b,c,d,e){return b===this.Ya?(a=eg(this.i,this.s,c),-1===a?(a=2*this.s,b=Array(a+2),ud(this.i,0,b,0,a),b[a]=c,b[a+1]=d,e.D=!0,new bg(null,this.Ya,this.s+1,b)):Bc.g(this.i[a+1],d)?this:new bg(null,this.Ya,this.s,Tf(this.i,a+1,d))):(new Yf(null,1<<(this.Ya>>>a&31),[null,this])).Oa(a,b,c,d,e)};h.Ib=function(a,b,c,d){a=eg(this.i,this.s,c);return 0>a?d:Of(c,this.i[a])?new qf(this.i[a],this.i[a+1]):d};
h.Kb=function(a,b,c){a=eg(this.i,this.s,c);return-1===a?this:1===this.s?null:new bg(null,this.Ya,this.s-1,Uf(this.i,Sd(a)))};h.Ga=function(){return new Xf(this.i)};function fg(a,b,c,d,e){this.A=a;this.Sa=b;this.u=c;this.M=d;this.C=e;this.o=32374988;this.F=0}h=fg.prototype;h.toString=function(){return ic(this)};h.equiv=function(a){return this.H(null,a)};
h.indexOf=function(){var a=null;a=function(b,c){switch(arguments.length){case 1:return Uc(this,b,0);case 2:return Uc(this,b,c)}throw Error("Invalid arity: "+arguments.length);};a.h=function(b){return Uc(this,b,0)};a.g=function(b,c){return Uc(this,b,c)};return a}();
h.lastIndexOf=function(){function a(c){return Xc(this,c,Vc(this))}var b=null;b=function(c,d){switch(arguments.length){case 1:return a.call(this,c);case 2:return Xc(this,c,d)}throw Error("Invalid arity: "+arguments.length);};b.h=a;b.g=function(c,d){return Xc(this,c,d)};return b}();h.T=function(){return this.A};h.ba=function(){return null==this.M?Zf(this.Sa,this.u+2,null):Zf(this.Sa,this.u,O(this.M))};h.Z=function(){var a=this.C;return null!=a?a:this.C=a=Gc(this)};h.H=function(a,b){return Zc(this,b)};
h.da=function(){return Ac};h.ja=function(a,b){return Gd(b,this)};h.ka=function(a,b,c){return Hd(b,c,this)};h.ga=function(){return null==this.M?new qf(this.Sa[this.u],this.Sa[this.u+1]):L(this.M)};h.ha=function(){var a=null==this.M?Zf(this.Sa,this.u+2,null):Zf(this.Sa,this.u,O(this.M));return null!=a?a:Ac};h.S=function(){return this};h.X=function(a,b){return b===this.A?this:new fg(b,this.Sa,this.u,this.M,this.C)};h.ca=function(a,b){return $c(b,this)};fg.prototype[Ra]=function(){return Dc(this)};
function Zf(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new fg(null,a,b,null,null);var d=a[b+1];if(F(d)&&(d=d.Jb(),F(d)))return new fg(null,a,b+2,d,null);b+=2}else return null;else return new fg(null,a,b,c,null)}function gg(a,b,c,d,e){this.A=a;this.Sa=b;this.u=c;this.M=d;this.C=e;this.o=32374988;this.F=0}h=gg.prototype;h.toString=function(){return ic(this)};h.equiv=function(a){return this.H(null,a)};
h.indexOf=function(){var a=null;a=function(b,c){switch(arguments.length){case 1:return Uc(this,b,0);case 2:return Uc(this,b,c)}throw Error("Invalid arity: "+arguments.length);};a.h=function(b){return Uc(this,b,0)};a.g=function(b,c){return Uc(this,b,c)};return a}();
h.lastIndexOf=function(){function a(c){return Xc(this,c,Vc(this))}var b=null;b=function(c,d){switch(arguments.length){case 1:return a.call(this,c);case 2:return Xc(this,c,d)}throw Error("Invalid arity: "+arguments.length);};b.h=a;b.g=function(c,d){return Xc(this,c,d)};return b}();h.T=function(){return this.A};h.ba=function(){return dg(this.Sa,this.u,O(this.M))};h.Z=function(){var a=this.C;return null!=a?a:this.C=a=Gc(this)};h.H=function(a,b){return Zc(this,b)};h.da=function(){return Ac};
h.ja=function(a,b){return Gd(b,this)};h.ka=function(a,b,c){return Hd(b,c,this)};h.ga=function(){return L(this.M)};h.ha=function(){var a=dg(this.Sa,this.u,O(this.M));return null!=a?a:Ac};h.S=function(){return this};h.X=function(a,b){return b===this.A?this:new gg(b,this.Sa,this.u,this.M,this.C)};h.ca=function(a,b){return $c(b,this)};gg.prototype[Ra]=function(){return Dc(this)};
function dg(a,b,c){if(null==c)for(c=a.length;;)if(b<c){var d=a[b];if(F(d)&&(d=d.Jb(),F(d)))return new gg(null,a,b+1,d,null);b+=1}else return null;else return new gg(null,a,b,c,null)}function hg(a,b){this.Aa=a;this.pc=b;this.ec=!1}hg.prototype.la=function(){return!this.ec||this.pc.la()};hg.prototype.next=function(){if(this.ec)return this.pc.next();this.ec=!0;return new qf(null,this.Aa)};hg.prototype.remove=function(){return Error("Unsupported operation")};
function ig(a,b,c,d,e,f){this.A=a;this.s=b;this.root=c;this.za=d;this.Aa=e;this.C=f;this.o=16123663;this.F=139268}h=ig.prototype;h.vb=function(a,b){return null==b?this.za?new qf(null,this.Aa):null:null==this.root?null:this.root.Ib(0,rc(b),b,null)};h.toString=function(){return ic(this)};h.equiv=function(a){return this.H(null,a)};h.keys=function(){return Dc(Jf(this))};h.entries=function(){return new Ef(K(K(this)))};h.values=function(){return Dc(Kf(this))};h.has=function(a){return zd(this,a)};
h.get=function(a,b){return this.J(null,a,b)};h.forEach=function(a){for(var b=K(this),c=null,d=0,e=0;;)if(e<d){var f=c.$(null,e),g=gd(f,0);f=gd(f,1);a.g?a.g(f,g):a.call(null,f,g);e+=1}else if(b=K(b))td(b)?(c=Yb(b),b=Zb(b),g=c,d=Vc(c),c=g):(c=L(b),g=gd(c,0),f=gd(c,1),a.g?a.g(f,g):a.call(null,f,g),b=O(b),c=null,d=0),e=0;else return null};h.aa=function(a,b){return this.J(null,b,null)};h.J=function(a,b,c){return null==b?this.za?this.Aa:c:null==this.root?c:this.root.cb(0,rc(b),b,c)};
h.wb=function(a,b,c){a=this.za?b.j?b.j(c,null,this.Aa):b.call(null,c,null,this.Aa):c;Mc(a)?b=yb(a):null!=this.root?(b=this.root.Mb(b,a),b=Mc(b)?yb(b):b):b=a;return b};h.Ga=function(){var a=this.root?gc(this.root):Ae();return this.za?new hg(this.Aa,a):a};h.T=function(){return this.A};h.Y=function(){return this.s};h.Z=function(){var a=this.C;return null!=a?a:this.C=a=Ic(this)};h.H=function(a,b){return Cf(this,b)};h.mb=function(){return new jg(this.root,this.s,this.za,this.Aa)};
h.da=function(){return Bb(Nf,this.A)};h.Sb=function(a,b){if(null==b)return this.za?new ig(this.A,this.s-1,this.root,!1,null,null):this;if(null==this.root)return this;a=this.root.Kb(0,rc(b),b);return a===this.root?this:new ig(this.A,this.s-1,a,this.za,this.Aa,null)};
h.Ua=function(a,b,c){if(null==b)return this.za&&c===this.Aa?this:new ig(this.A,this.za?this.s:this.s+1,this.root,!0,c,null);a=new Sf;b=(null==this.root?$f:this.root).Oa(0,rc(b),b,c,a);return b===this.root?this:new ig(this.A,a.D?this.s+1:this.s,b,this.za,this.Aa,null)};h.fb=function(a,b){return null==b?this.za:null==this.root?!1:this.root.cb(0,rc(b),b,vd)!==vd};h.S=function(){if(0<this.s){var a=null!=this.root?this.root.Jb():null;return this.za?$c(new qf(null,this.Aa),a):a}return null};
h.X=function(a,b){return b===this.A?this:new ig(b,this.s,this.root,this.za,this.Aa,this.C)};h.ca=function(a,b){if(sd(b))return this.Ua(null,bb.g(b,0),bb.g(b,1));a=this;for(b=K(b);;){if(null==b)return a;var c=L(b);if(sd(c))a=ob(a,bb.g(c,0),bb.g(c,1)),b=O(b);else throw Error("conj on a map takes map entries or seqables of map entries");}};
h.call=function(){var a=null;a=function(b,c,d){switch(arguments.length){case 2:return this.aa(null,c);case 3:return this.J(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.g=function(b,c){return this.aa(null,c)};a.j=function(b,c,d){return this.J(null,c,d)};return a}();h.apply=function(a,b){var c=Sa(b);a=this.call;b=a.apply;var d=[this],e=d.concat;if(20<c.length){var f=c.slice(0,20);f.push(c.slice(20));c=f}return b.call(a,this,e.call(d,c))};h.h=function(a){return this.aa(null,a)};
h.g=function(a,b){return this.J(null,a,b)};var Nf=new ig(null,0,null,!1,null,Jc);ig.prototype[Ra]=function(){return Dc(this)};function jg(a,b,c,d){this.V={};this.root=a;this.count=b;this.za=c;this.Aa=d;this.o=259;this.F=56}function kg(a,b,c){if(a.V){if(null==b)a.Aa!==c&&(a.Aa=c),a.za||(a.count+=1,a.za=!0);else{var d=new Sf;b=(null==a.root?$f:a.root).Pa(a.V,0,rc(b),b,c,d);b!==a.root&&(a.root=b);d.D&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}h=jg.prototype;
h.Y=function(){if(this.V)return this.count;throw Error("count after persistent!");};h.aa=function(a,b){return null==b?this.za?this.Aa:null:null==this.root?null:this.root.cb(0,rc(b),b)};h.J=function(a,b,c){return null==b?this.za?this.Aa:c:null==this.root?c:this.root.cb(0,rc(b),b,c)};
h.pb=function(a,b){a:if(this.V)if(vf(b))a=kg(this,sb(b),tb(b));else if(sd(b))a=kg(this,b.h?b.h(0):b.call(null,0),b.h?b.h(1):b.call(null,1));else for(a=K(b),b=this;;){var c=L(a);if(F(c))a=O(a),b=kg(b,sb(c),tb(c));else{a=b;break a}}else throw Error("conj! after persistent");return a};h.Cb=function(){if(this.V){this.V=null;var a=new ig(null,this.count,this.root,this.za,this.Aa,null)}else throw Error("persistent! called twice");return a};h.ob=function(a,b,c){return kg(this,b,c)};
h.call=function(){var a=null;a=function(b,c,d){switch(arguments.length){case 2:return this.aa(null,c);case 3:return this.J(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.g=function(b,c){return this.aa(null,c)};a.j=function(b,c,d){return this.J(null,c,d)};return a}();h.apply=function(a,b){var c=Sa(b);a=this.call;b=a.apply;var d=[this],e=d.concat;if(20<c.length){var f=c.slice(0,20);f.push(c.slice(20));c=f}return b.call(a,this,e.call(d,c))};h.h=function(a){return this.aa(null,a)};
h.g=function(a,b){return this.J(null,a,b)};function lg(a,b){this.N=a;this.Ta=b;this.o=32374988;this.F=0}h=lg.prototype;h.toString=function(){return ic(this)};h.equiv=function(a){return this.H(null,a)};h.indexOf=function(){var a=null;a=function(b,c){switch(arguments.length){case 1:return Uc(this,b,0);case 2:return Uc(this,b,c)}throw Error("Invalid arity: "+arguments.length);};a.h=function(b){return Uc(this,b,0)};a.g=function(b,c){return Uc(this,b,c)};return a}();
h.lastIndexOf=function(){function a(c){return Xc(this,c,Vc(this))}var b=null;b=function(c,d){switch(arguments.length){case 1:return a.call(this,c);case 2:return Xc(this,c,d)}throw Error("Invalid arity: "+arguments.length);};b.h=a;b.g=function(c,d){return Xc(this,c,d)};return b}();h.T=function(){return this.Ta};h.ba=function(){var a=(null!=this.N?this.N.o&128||q===this.N.zb||(this.N.o?0:Oa(hb,this.N)):Oa(hb,this.N))?this.N.ba(null):O(this.N);return null==a?null:new lg(a,null)};h.Z=function(){return Gc(this)};
h.H=function(a,b){return Zc(this,b)};h.da=function(){return Ac};h.ja=function(a,b){return Gd(b,this)};h.ka=function(a,b,c){return Hd(b,c,this)};h.ga=function(){return this.N.ga(null).key};h.ha=function(){var a=(null!=this.N?this.N.o&128||q===this.N.zb||(this.N.o?0:Oa(hb,this.N)):Oa(hb,this.N))?this.N.ba(null):O(this.N);return null!=a?new lg(a,null):Ac};h.S=function(){return this};h.X=function(a,b){return b===this.Ta?this:new lg(this.N,b)};h.ca=function(a,b){return $c(b,this)};lg.prototype[Ra]=function(){return Dc(this)};
function Jf(a){return(a=K(a))?new lg(a,null):null}function mg(a,b){this.N=a;this.Ta=b;this.o=32374988;this.F=0}h=mg.prototype;h.toString=function(){return ic(this)};h.equiv=function(a){return this.H(null,a)};h.indexOf=function(){var a=null;a=function(b,c){switch(arguments.length){case 1:return Uc(this,b,0);case 2:return Uc(this,b,c)}throw Error("Invalid arity: "+arguments.length);};a.h=function(b){return Uc(this,b,0)};a.g=function(b,c){return Uc(this,b,c)};return a}();
h.lastIndexOf=function(){function a(c){return Xc(this,c,Vc(this))}var b=null;b=function(c,d){switch(arguments.length){case 1:return a.call(this,c);case 2:return Xc(this,c,d)}throw Error("Invalid arity: "+arguments.length);};b.h=a;b.g=function(c,d){return Xc(this,c,d)};return b}();h.T=function(){return this.Ta};h.ba=function(){var a=(null!=this.N?this.N.o&128||q===this.N.zb||(this.N.o?0:Oa(hb,this.N)):Oa(hb,this.N))?this.N.ba(null):O(this.N);return null==a?null:new mg(a,null)};h.Z=function(){return Gc(this)};
h.H=function(a,b){return Zc(this,b)};h.da=function(){return Ac};h.ja=function(a,b){return Gd(b,this)};h.ka=function(a,b,c){return Hd(b,c,this)};h.ga=function(){return this.N.ga(null).D};h.ha=function(){var a=(null!=this.N?this.N.o&128||q===this.N.zb||(this.N.o?0:Oa(hb,this.N)):Oa(hb,this.N))?this.N.ba(null):O(this.N);return null!=a?new mg(a,null):Ac};h.S=function(){return this};h.X=function(a,b){return b===this.Ta?this:new mg(this.N,b)};h.ca=function(a,b){return $c(b,this)};mg.prototype[Ra]=function(){return Dc(this)};
function Kf(a){return(a=K(a))?new mg(a,null):null}var ng=function ng(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return ng.v(0<c.length?new xc(c.slice(0),0,null):null)};ng.v=function(a){return F(Ce(Md,a))?Kd(function(b,c){return bd.g(F(b)?b:ye,c)},a):null};ng.K=0;ng.L=function(a){return this.v(K(a))};
var og=function og(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return og.v(arguments[0],1<c.length?new xc(c.slice(1),0,null):null)};og.v=function(a,b){if(F(Ce(Md,b))){var c=function(d,e){var f=sb(e),g=tb(e);if(zd(d,f)){e=hd.j;var k=H.g(d,f);g=a.g?a.g(k,g):a.call(null,k,g);d=e.call(hd,d,f,g)}else d=hd.j(d,f,g);return d};return Kd(function(d,e){return Ua(c,F(d)?d:ye,K(e))},b)}return null};og.K=1;og.L=function(a){var b=L(a);a=O(a);return this.v(b,a)};
function pg(a){for(var b=ye,c=K(new W(null,1,5,Z,[qg],null));;)if(c){var d=L(c),e=H.j(a,d,rg);b=Bc.g(e,rg)?b:hd.j(b,d,e);c=O(c)}else return Bb(b,nd(a))}function sg(a){this.Lb=a}sg.prototype.la=function(){return this.Lb.la()};sg.prototype.next=function(){if(this.Lb.la())return this.Lb.next().key;throw Error("No such element");};sg.prototype.remove=function(){return Error("Unsupported operation")};function tg(a,b,c){this.A=a;this.bb=b;this.C=c;this.o=15077647;this.F=139268}h=tg.prototype;
h.toString=function(){return ic(this)};h.equiv=function(a){return this.H(null,a)};h.keys=function(){return Dc(K(this))};h.entries=function(){return new Ff(K(K(this)))};h.values=function(){return Dc(K(this))};h.has=function(a){return zd(this,a)};
h.forEach=function(a){for(var b=K(this),c=null,d=0,e=0;;)if(e<d){var f=c.$(null,e),g=gd(f,0);f=gd(f,1);a.g?a.g(f,g):a.call(null,f,g);e+=1}else if(b=K(b))td(b)?(c=Yb(b),b=Zb(b),g=c,d=Vc(c),c=g):(c=L(b),g=gd(c,0),f=gd(c,1),a.g?a.g(f,g):a.call(null,f,g),b=O(b),c=null,d=0),e=0;else return null};h.aa=function(a,b){return this.J(null,b,null)};h.J=function(a,b,c){a=pb(this.bb,b);return F(a)?sb(a):c};h.Ga=function(){return new sg(gc(this.bb))};h.T=function(){return this.A};h.Y=function(){return Wa(this.bb)};
h.Z=function(){var a=this.C;return null!=a?a:this.C=a=Ic(this)};h.H=function(a,b){if(a=null==b?!1:null!=b?b.o&4096||q===b.dd?!0:b.o?!1:Oa(ub,b):Oa(ub,b))if(a=Vc(this)===Vc(b))try{return Ld(function(c,d){return(c=zd(b,d))?c:new Lc},this.bb)}catch(c){if(c instanceof Error)return!1;throw c;}else return a;else return a};h.mb=function(){return new ug(Rb(this.bb))};h.da=function(){return Bb(vg,this.A)};h.S=function(){return Jf(this.bb)};h.X=function(a,b){return b===this.A?this:new tg(b,this.bb,this.C)};
h.ca=function(a,b){return new tg(this.A,hd.j(this.bb,b,null),null)};h.call=function(){var a=null;a=function(b,c,d){switch(arguments.length){case 2:return this.aa(null,c);case 3:return this.J(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.g=function(b,c){return this.aa(null,c)};a.j=function(b,c,d){return this.J(null,c,d)};return a}();
h.apply=function(a,b){var c=Sa(b);a=this.call;b=a.apply;var d=[this],e=d.concat;if(20<c.length){var f=c.slice(0,20);f.push(c.slice(20));c=f}return b.call(a,this,e.call(d,c))};h.h=function(a){return this.aa(null,a)};h.g=function(a,b){return this.J(null,a,b)};var vg=new tg(null,ye,Jc);tg.prototype[Ra]=function(){return Dc(this)};function ug(a){this.$a=a;this.F=136;this.o=259}h=ug.prototype;h.pb=function(a,b){this.$a=Ub(this.$a,b,null);return this};h.Cb=function(){return new tg(null,Tb(this.$a),null)};
h.Y=function(){return Vc(this.$a)};h.aa=function(a,b){return this.J(null,b,null)};h.J=function(a,b,c){return kb.j(this.$a,b,vd)===vd?c:b};h.call=function(){function a(d,e,f){return kb.j(this.$a,e,vd)===vd?f:e}function b(d,e){return kb.j(this.$a,e,vd)===vd?null:e}var c=null;c=function(d,e,f){switch(arguments.length){case 2:return b.call(this,d,e);case 3:return a.call(this,d,e,f)}throw Error("Invalid arity: "+(arguments.length-1));};c.g=b;c.j=a;return c}();
h.apply=function(a,b){var c=Sa(b);a=this.call;b=a.apply;var d=[this],e=d.concat;if(20<c.length){var f=c.slice(0,20);f.push(c.slice(20));c=f}return b.call(a,this,e.call(d,c))};h.h=function(a){return kb.j(this.$a,a,vd)===vd?null:a};h.g=function(a,b){return kb.j(this.$a,a,vd)===vd?b:a};function be(a){if(null!=a&&(a.F&4096||q===a.Ac))return a.xb(null);if("string"===typeof a)return a;throw Error(["Doesn't support name: ",G.h(a)].join(""));}
function wg(a,b){var c=Rb(ye);a=K(a);for(b=K(b);;)if(a&&b){var d=L(a),e=L(b);c=Ub(c,d,e);a=O(a);b=O(b)}else return Tb(c)}function xg(a,b,c){this.start=a;this.step=b;this.count=c;this.o=82;this.F=0}h=xg.prototype;h.Y=function(){return this.count};h.ga=function(){return this.start};h.$=function(a,b){return this.start+b*this.step};h.Ea=function(a,b,c){return 0<=b&&b<this.count?this.start+b*this.step:c};
h.bc=function(){if(1>=this.count)throw Error("-drop-first of empty chunk");return new xg(this.start+this.step,this.step,this.count-1)};function yg(a,b,c){this.u=a;this.end=b;this.step=c}yg.prototype.la=function(){return 0<this.step?this.u<this.end:this.u>this.end};yg.prototype.next=function(){var a=this.u;this.u+=this.step;return a};function zg(a,b,c,d,e,f,g){this.A=a;this.start=b;this.end=c;this.step=d;this.I=e;this.Xa=f;this.C=g;this.o=32375006;this.F=140800}h=zg.prototype;h.toString=function(){return ic(this)};
h.equiv=function(a){return this.H(null,a)};h.indexOf=function(){var a=null;a=function(b,c){switch(arguments.length){case 1:return Uc(this,b,0);case 2:return Uc(this,b,c)}throw Error("Invalid arity: "+arguments.length);};a.h=function(b){return Uc(this,b,0)};a.g=function(b,c){return Uc(this,b,c)};return a}();
h.lastIndexOf=function(){function a(c){return Xc(this,c,Vc(this))}var b=null;b=function(c,d){switch(arguments.length){case 1:return a.call(this,c);case 2:return Xc(this,c,d)}throw Error("Invalid arity: "+arguments.length);};b.h=a;b.g=function(c,d){return Xc(this,c,d)};return b}();h.Gb=function(){if(null==this.I){var a=this.Y(null);32<a?(this.Xa=new zg(null,this.start+32*this.step,this.end,this.step,null,null,null),this.I=new xg(this.start,this.step,32)):this.I=new xg(this.start,this.step,a)}};
h.$=function(a,b){if(0<=b&&b<this.Y(null))return this.start+b*this.step;if(0<=b&&this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};h.Ea=function(a,b,c){return 0<=b&&b<this.Y(null)?this.start+b*this.step:0<=b&&this.start>this.end&&0===this.step?this.start:c};h.Ga=function(){return new yg(this.start,this.end,this.step)};h.T=function(){return this.A};
h.ba=function(){return 0<this.step?this.start+this.step<this.end?new zg(null,this.start+this.step,this.end,this.step,null,null,null):null:this.start+this.step>this.end?new zg(null,this.start+this.step,this.end,this.step,null,null,null):null};h.Y=function(){return Math.ceil((this.end-this.start)/this.step)};h.Z=function(){var a=this.C;return null!=a?a:this.C=a=Gc(this)};h.H=function(a,b){return Zc(this,b)};h.da=function(){return Ac};h.ja=function(a,b){return Nc(this,b)};
h.ka=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){c=b.g?b.g(c,a):b.call(null,c,a);if(Mc(c))return yb(c);a+=this.step}else return c};h.ga=function(){return this.start};h.ha=function(){var a=this.ba(null);return null==a?Ac:a};h.S=function(){return this};h.tb=function(){this.Gb();return this.I};h.ab=function(){this.Gb();return null==this.Xa?Ac:this.Xa};h.X=function(a,b){return b===this.A?this:new zg(b,this.start,this.end,this.step,this.I,this.Xa,this.C)};
h.ca=function(a,b){return $c(b,this)};h.Qb=function(){return K(this.ab(null))};zg.prototype[Ra]=function(){return Dc(this)};function Ag(a,b,c,d,e,f,g){this.A=a;this.start=b;this.end=c;this.step=d;this.I=e;this.Xa=f;this.C=g;this.F=140800;this.o=32374988}h=Ag.prototype;h.toString=function(){return ic(this)};h.equiv=function(a){return this.H(null,a)};
h.indexOf=function(){var a=null;a=function(b,c){switch(arguments.length){case 1:return Uc(this,b,0);case 2:return Uc(this,b,c)}throw Error("Invalid arity: "+arguments.length);};a.h=function(b){return Uc(this,b,0)};a.g=function(b,c){return Uc(this,b,c)};return a}();
h.lastIndexOf=function(){function a(c){return Xc(this,c,Vc(this))}var b=null;b=function(c,d){switch(arguments.length){case 1:return a.call(this,c);case 2:return Xc(this,c,d)}throw Error("Invalid arity: "+arguments.length);};b.h=a;b.g=function(c,d){return Xc(this,c,d)};return b}();
h.Gb=function(){if(null==this.I){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a:{var b=0;for(var c=this.start;;)if(32>b){if(a[b]=c,b+=1,c+=this.step,!(0<this.step?c<this.end:c>this.end)){b=this.I=new fe(a,0,b);break a}}else{b=c;break a}}null==this.I&&(this.I=new fe(a,0,32),(0<this.step?b<this.end:b>this.end)&&(this.Xa=new Ag(null,b,this.end,this.step,null,null,null)))}};
h.Ga=function(){return new yg(this.start,this.end,this.step)};h.T=function(){return this.A};h.ba=function(){return 0<this.step?this.start+this.step<this.end?new Ag(null,this.start+this.step,this.end,this.step,null,null,null):null:this.start+this.step>this.end?new Ag(null,this.start+this.step,this.end,this.step,null,null,null):null};h.Z=function(){var a=this.C;return null!=a?a:this.C=a=Gc(this)};h.H=function(a,b){return Zc(this,b)};h.da=function(){return Ac};h.ja=function(a,b){return Gd(b,this)};
h.ka=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){c=b.g?b.g(c,a):b.call(null,c,a);if(Mc(c))return yb(c);a+=this.step}else return c};h.ga=function(){return this.start};h.ha=function(){var a=this.ba(null);return null==a?Ac:a};h.S=function(){return this};h.tb=function(){this.Gb();return this.I};h.ab=function(){this.Gb();return null==this.Xa?Ac:this.Xa};h.X=function(a,b){return b===this.A?this:new Ag(b,this.start,this.end,this.step,this.I,this.Xa,this.C)};
h.ca=function(a,b){return $c(b,this)};h.Qb=function(){return K(this.ab(null))};Ag.prototype[Ra]=function(){return Dc(this)};function Bg(a,b,c){return 0<c?b<=a?Ac:yd(a)&&yd(b)&&yd(c)?new zg(null,a,b,c,null,null,null):new Ag(null,a,b,c,null,null,null):0>c?b>=a?Ac:yd(a)&&yd(b)&&yd(c)?new zg(null,a,b,c,null,null,null):new Ag(null,a,b,c,null,null,null):b===a?Ac:new Qe(null,-1,a,null)}
function Cg(a,b){return function(){function c(l,m,n){return new W(null,2,5,Z,[a.j?a.j(l,m,n):a.call(null,l,m,n),b.j?b.j(l,m,n):b.call(null,l,m,n)],null)}function d(l,m){return new W(null,2,5,Z,[a.g?a.g(l,m):a.call(null,l,m),b.g?b.g(l,m):b.call(null,l,m)],null)}function e(l){return new W(null,2,5,Z,[a.h?a.h(l):a.call(null,l),b.h?b.h(l):b.call(null,l)],null)}function f(){return new W(null,2,5,Z,[a.B?a.B():a.call(null),b.B?b.B():b.call(null)],null)}var g=null,k=function(){function l(n,r,w,t){var v=null;
if(3<arguments.length){v=0;for(var E=Array(arguments.length-3);v<E.length;)E[v]=arguments[v+3],++v;v=new xc(E,0,null)}return m.call(this,n,r,w,v)}function m(n,r,w,t){return new W(null,2,5,Z,[we(a,n,r,w,t),we(b,n,r,w,t)],null)}l.K=3;l.L=function(n){var r=L(n);n=O(n);var w=L(n);n=O(n);var t=L(n);n=zc(n);return m(r,w,t,n)};l.v=m;return l}();g=function(l,m,n,r){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,l);case 2:return d.call(this,l,m);case 3:return c.call(this,l,m,
n);default:var w=null;if(3<arguments.length){w=0;for(var t=Array(arguments.length-3);w<t.length;)t[w]=arguments[w+3],++w;w=new xc(t,0,null)}return k.v(l,m,n,w)}throw Error("Invalid arity: "+arguments.length);};g.K=3;g.L=k.L;g.B=f;g.h=e;g.g=d;g.j=c;g.v=k.v;return g}()}function Dg(a){a:for(var b=a;;)if(b=K(b))b=O(b);else break a;return a}
function Eg(a,b,c,d,e,f,g){var k=Ba;Ba=null==Ba?null:Ba-1;try{if(null!=Ba&&0>Ba)return Ob(a,"#");Ob(a,c);if(0===Ja.h(f))K(g)&&Ob(a,function(){var t=Fg.h(f);return F(t)?t:"..."}());else{if(K(g)){var l=L(g);b.j?b.j(l,a,f):b.call(null,l,a,f)}for(var m=O(g),n=Ja.h(f)-1;;)if(!m||null!=n&&0===n){K(m)&&0===n&&(Ob(a,d),Ob(a,function(){var t=Fg.h(f);return F(t)?t:"..."}()));break}else{Ob(a,d);var r=L(m);c=a;g=f;b.j?b.j(r,c,g):b.call(null,r,c,g);var w=O(m);c=n-1;m=w;n=c}}return Ob(a,e)}finally{Ba=k}}
function Gg(a,b){b=K(b);for(var c=null,d=0,e=0;;)if(e<d){var f=c.$(null,e);Ob(a,f);e+=1}else if(b=K(b))c=b,td(c)?(b=Yb(c),d=Zb(c),c=b,f=Vc(b),b=d,d=f):(f=L(c),Ob(a,f),b=O(c),c=null,d=0),e=0;else return null}var Hg={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Ig(a){return['"',G.h(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(b){return Hg[b]})),'"'].join("")}
function Jg(a,b){return(a=xd(H.g(a,Ha)))?(a=null!=b?b.o&131072||q===b.zc?!0:!1:!1)?null!=nd(b):a:a}
function Kg(a,b,c){if(null==a)return Ob(b,"nil");Jg(c,a)&&(Ob(b,"^"),Lg(nd(a),b,c),Ob(b," "));if(a.Eb)return a.Ub(b);if(null!=a?a.o&2147483648||q===a.ea||(a.o?0:Oa(Pb,a)):Oa(Pb,a))return Qb(a,b,c);if(!0===a||!1===a)return Ob(b,G.h(a));if("number"===typeof a)return Ob(b,isNaN(a)?"##NaN":a===Number.POSITIVE_INFINITY?"##Inf":a===Number.NEGATIVE_INFINITY?"##-Inf":G.h(a));if(null!=a&&a.constructor===Object)return Ob(b,"#js "),Mg(Le.g(function(d){var e=/[A-Za-z_\*\+\?!\-'][\w\*\+\?!\-']*/;if("string"===
typeof d)e=e.exec(d),e=null!=e&&Bc.g(e[0],d)?1===e.length?e[0]:uf(e):null;else throw new TypeError("re-matches must match against a string.");return new qf(null!=e?ae.h(d):d,a[d])},la.call(null,a)),b,c);if(Ma(a))return Eg(b,Lg,"#js ["," ","]",c,a);if("string"===typeof a)return F(Fa.h(c))?Ob(b,Ig(a)):Ob(b,a);if("function"===typeof a)return c=a.name,c=null==c||/^[\s\xa0]*$/.test(c)?"Function":c,Gg(b,ad(["#object[",c,F(!1)?[' "',G.h(a),'"'].join(""):"","]"]));if(a instanceof Date)return c=function(d,
e){for(d=G.h(d);;)if(d.length<e)d=["0",d].join("");else return d},Gg(b,ad(['#inst "',c(a.getUTCFullYear(),4),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),3),"-",'00:00"']));if(a instanceof RegExp)return Gg(b,ad(['#"',a.source,'"']));if("symbol"===ba(a)||"undefined"!==typeof Symbol&&a instanceof Symbol)return Gg(b,ad(["#object[",a.toString(),"]"]));if(F(function(){var d=null==a?null:a.constructor;
return null==d?null:d.gb}()))return Gg(b,ad(["#object[",a.constructor.gb.replace(RegExp("/","g"),"."),"]"]));c=function(){var d=null==a?null:a.constructor;return null==d?null:d.name}();c=null==c||/^[\s\xa0]*$/.test(c)?"Object":c;return null==a.constructor?Gg(b,ad(["#object[",c,"]"])):Gg(b,ad(["#object[",c," ",G.h(a),"]"]))}function Lg(a,b,c){var d=Ng.h(c);return F(d)?(c=hd.j(c,Og,Kg),d.j?d.j(a,b,c):d.call(null,a,b,c)):Kg(a,b,c)}
function Pg(a){return a instanceof uc?vc.g(null,be(a)):ae.g(null,be(a))}function Qg(a){if(F(!1)){var b=K(a),c=K(b),d=L(c);O(c);gd(d,0);gd(d,1);c=ed(a);for(a=null;;){d=a;b=K(b);a=L(b);var e=O(b),f=a;a=gd(f,0);b=gd(f,1);if(F(f))if(a instanceof I||a instanceof uc)if(F(d))if(Bc.g(d,$d(a)))c=hd.j(c,Pg(a),b),a=d,b=e;else return null;else if(d=$d(a),F(d))c=hd.j(c,Pg(a),b),a=d,b=e;else return null;else return null;else return new W(null,2,5,Z,[d,c],null)}}else return null}
function Rg(a,b,c,d,e){return Eg(d,function(f,g,k){var l=sb(f);c.j?c.j(l,g,k):c.call(null,l,g,k);Ob(g," ");f=tb(f);return c.j?c.j(f,g,k):c.call(null,f,g,k)},[G.h(a),"{"].join(""),", ","}",e,K(b))}function Mg(a,b,c){var d=Lg,e=qd(a)?Qg(a):null,f=gd(e,0);e=gd(e,1);return F(f)?Rg(["#:",G.h(f)].join(""),e,d,b,c):Rg(null,a,d,b,c)}xc.prototype.ea=q;xc.prototype.U=function(a,b,c){return Eg(b,Lg,"("," ",")",c,this)};ce.prototype.ea=q;ce.prototype.U=function(a,b,c){return Eg(b,Lg,"("," ",")",c,this)};
qf.prototype.ea=q;qf.prototype.U=function(a,b,c){return Eg(b,Lg,"["," ","]",c,this)};fg.prototype.ea=q;fg.prototype.U=function(a,b,c){return Eg(b,Lg,"("," ",")",c,this)};Hf.prototype.ea=q;Hf.prototype.U=function(a,b,c){return Eg(b,Lg,"("," ",")",c,this)};Ec.prototype.ea=q;Ec.prototype.U=function(a,b,c){return Eg(b,Lg,"("," ",")",c,this)};sf.prototype.ea=q;sf.prototype.U=function(a,b,c){return Eg(b,Lg,"("," ",")",c,this)};Xd.prototype.ea=q;
Xd.prototype.U=function(a,b,c){return Eg(b,Lg,"("," ",")",c,this)};zg.prototype.ea=q;zg.prototype.U=function(a,b,c){return Eg(b,Lg,"("," ",")",c,this)};ig.prototype.ea=q;ig.prototype.U=function(a,b,c){return Mg(this,b,c)};gg.prototype.ea=q;gg.prototype.U=function(a,b,c){return Eg(b,Lg,"("," ",")",c,this)};Ne.prototype.ea=q;Ne.prototype.U=function(a,b,c){return Eg(b,Lg,"("," ",")",c,this)};tg.prototype.ea=q;tg.prototype.U=function(a,b,c){return Eg(b,Lg,"#{"," ","}",c,this)};he.prototype.ea=q;
he.prototype.U=function(a,b,c){return Eg(b,Lg,"("," ",")",c,this)};Ge.prototype.ea=q;Ge.prototype.U=function(a,b,c){Ob(b,"#object[cljs.core.Atom ");Lg(new u(null,1,[Sg,this.state],null),b,c);return Ob(b,"]")};mg.prototype.ea=q;mg.prototype.U=function(a,b,c){return Eg(b,Lg,"("," ",")",c,this)};Qe.prototype.ea=q;Qe.prototype.U=function(a,b,c){return Eg(b,Lg,"("," ",")",c,this)};W.prototype.ea=q;W.prototype.U=function(a,b,c){return Eg(b,Lg,"["," ","]",c,this)};Vd.prototype.ea=q;
Vd.prototype.U=function(a,b){return Ob(b,"()")};u.prototype.ea=q;u.prototype.U=function(a,b,c){return Mg(this,b,c)};Ag.prototype.ea=q;Ag.prototype.U=function(a,b,c){return Eg(b,Lg,"("," ",")",c,this)};lg.prototype.ea=q;lg.prototype.U=function(a,b,c){return Eg(b,Lg,"("," ",")",c,this)};dd.prototype.ea=q;dd.prototype.U=function(a,b,c){return Eg(b,Lg,"("," ",")",c,this)};uc.prototype.ub=q;
uc.prototype.lb=function(a,b){if(b instanceof uc)return tc(this,b);throw Error(["Cannot compare ",G.h(this)," to ",G.h(b)].join(""));};I.prototype.ub=q;I.prototype.lb=function(a,b){if(b instanceof I)return Yd(this,b);throw Error(["Cannot compare ",G.h(this)," to ",G.h(b)].join(""));};W.prototype.ub=q;W.prototype.lb=function(a,b){if(sd(b))return Cd(this,b);throw Error(["Cannot compare ",G.h(this)," to ",G.h(b)].join(""));};qf.prototype.ub=q;
qf.prototype.lb=function(a,b){if(sd(b))return Cd(this,b);throw Error(["Cannot compare ",G.h(this)," to ",G.h(b)].join(""));};var Tg=null;function Ug(a){null==Tg&&(Tg=He(0));return vc.h([G.h(a),G.h(Ke.g(Tg,Kc))].join(""))}function Vg(){}function Wg(a){if(null!=a&&null!=a.vc)a=a.vc(a);else{var b=Wg[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=Wg._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("IEncodeJS.-clj-\x3ejs",a);}return a}
function Xg(a,b){if(null!=a?q===a.uc||(a.Ic?0:Oa(Vg,a)):Oa(Vg,a))a=Wg(a);else if("string"===typeof a||"number"===typeof a||a instanceof I||a instanceof uc)a=b.h?b.h(a):b.call(null,a);else{var c=ad([a]);a=Da();if(null==c||Na(K(c)))a="";else{b=G;var d=b.h,e=new ua,f=new hc(e);Lg(L(c),f,a);c=K(O(c));for(var g=null,k=0,l=0;;)if(l<k){var m=g.$(null,l);Ob(f," ");Lg(m,f,a);l+=1}else if(c=K(c))g=c,td(g)?(c=Yb(g),k=Zb(g),g=c,m=Vc(c),c=k,k=m):(m=L(g),Ob(f," "),Lg(m,f,a),c=O(g),g=null,k=0),l=0;else break;a=
d.call(b,e)}}return a}var Yg=function Yg(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Yg.v(arguments[0],1<c.length?new xc(c.slice(1),0,null):null)};
Yg.v=function(a,b){b=xe(b);var c=H.j(b,Zg,be),d=function g(f){if(null==f)return null;if(null!=f?q===f.uc||(f.Ic?0:Oa(Vg,f)):Oa(Vg,f))return Wg(f);if(f instanceof I)return c.h?c.h(f):c.call(null,f);if(f instanceof uc)return G.h(f);if(qd(f)){var k={};f=K(f);for(var l=null,m=0,n=0;;)if(n<m){var r=l.$(null,n),w=gd(r,0),t=gd(r,1);r=k;w=Xg(w,d);t=g(t);r[w]=t;n+=1}else if(f=K(f))td(f)?(m=Yb(f),f=Zb(f),l=m,m=Vc(m)):(l=L(f),m=gd(l,0),n=gd(l,1),l=k,m=Xg(m,d),n=g(n),l[m]=n,f=O(f),l=null,m=0),n=0;else break;
return k}if(od(f)){k=[];f=K(Le.g(g,f));l=null;for(n=m=0;;)if(n<m)r=l.$(null,n),k.push(r),n+=1;else if(f=K(f))l=f,td(l)?(f=Yb(l),n=Zb(l),l=f,m=Vc(f),f=n):(f=L(l),k.push(f),f=O(l),l=null,m=0),n=0;else break;return k}return f};return d(a)};Yg.K=1;Yg.L=function(a){var b=L(a);a=O(a);return this.v(b,a)};var $g=null;function ah(){null==$g&&($g=He(new u(null,3,[bh,ye,ch,ye,dh,ye],null)));return $g}
function eh(a,b,c){var d=Bc.g(b,c);if(d)return d;d=dh.h(a);d=d.h?d.h(b):d.call(null,b);if(!(d=zd(d,c))&&(d=sd(c)))if(d=sd(b))if(d=Vc(c)===Vc(b)){d=!0;for(var e=0;;)if(d&&e!==Vc(c))d=eh(a,b.h?b.h(e):b.call(null,e),c.h?c.h(e):c.call(null,e)),e+=1;else return d}else return d;else return d;else return d}function fh(a){var b=yb(ah());return ze(H.g(bh.h(b),a))}function gh(a,b,c,d){Ke.g(a,function(){return yb(b)});Ke.g(c,function(){return yb(d)})}
var hh=function hh(a,b,c){var e=function(){var f=yb(c);return f.h?f.h(a):f.call(null,a)}();e=F(F(e)?e.h?e.h(b):e.call(null,b):e)?!0:null;if(F(e))return e;e=function(){for(var f=fh(b);;)if(0<Vc(f)){var g=L(f);hh.j?hh.j(a,g,c):hh.call(null,a,g,c);f=zc(f)}else return null}();if(F(e))return e;e=function(){for(var f=fh(a);;)if(0<Vc(f)){var g=L(f);hh.j?hh.j(g,b,c):hh.call(null,g,b,c);f=zc(f)}else return null}();return F(e)?e:!1};function ih(a,b,c,d){c=hh(a,b,c);return F(c)?c:eh(d,a,b)}
var jh=function jh(a,b,c,d,e,f,g,k){var m=Ua(function(r,w){var t=gd(w,0);gd(w,1);if(eh(yb(c),b,t)){r=null==r||ih(t,L(r),e,yb(c))?w:r;if(!ih(L(r),t,e,yb(c)))throw Error(["Multiple methods in multimethod '",G.h(a),"' match dispatch value: ",G.h(b)," -\x3e ",G.h(t)," and ",G.h(L(r)),", and neither is preferred"].join(""));return r}return r},null,yb(d)),n=function(){var r;if(r=null==m)r=yb(d),r=r.h?r.h(k):r.call(null,k);return F(r)?new W(null,2,5,Z,[k,r],null):m}();if(F(n)){if(Bc.g(yb(g),yb(c)))return Ke.G(f,
hd,b,L(O(n))),L(O(n));gh(f,d,g,c);return jh.ia?jh.ia(a,b,c,d,e,f,g,k):jh.call(null,a,b,c,d,e,f,g,k)}return null};function kh(a,b){throw Error(["No method in multimethod '",G.h(a),"' for dispatch value: ",G.h(b)].join(""));}function lh(a,b,c,d,e,f,g){var k=mh;this.name=a;this.m=b;this.Jc=k;this.Xb=c;this.Zb=d;this.Pc=e;this.Yb=f;this.Pb=g;this.o=4194305;this.F=4352}h=lh.prototype;
h.call=function(){function a(p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa,Ga){p=this;var fb=p.m.va?p.m.va(x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa,Ga):p.m.call(null,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa,Ga),cc=nh(this,fb);F(cc)||kh(p.name,fb);return cc.va?cc.va(x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa,Ga):cc.call(null,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa,Ga)}function b(p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa){p=this;var Ga=p.m.ua?p.m.ua(x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa):p.m.call(null,x,y,
z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa),fb=nh(this,Ga);F(fb)||kh(p.name,Ga);return fb.ua?fb.ua(x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa):fb.call(null,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa)}function c(p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa){p=this;var wa=p.m.ta?p.m.ta(x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa):p.m.call(null,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa),Ga=nh(this,wa);F(Ga)||kh(p.name,wa);return Ga.ta?Ga.ta(x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa):Ga.call(null,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa)}function d(p,
x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia){p=this;var oa=p.m.sa?p.m.sa(x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia):p.m.call(null,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia),wa=nh(this,oa);F(wa)||kh(p.name,oa);return wa.sa?wa.sa(x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia):wa.call(null,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia)}function e(p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da){p=this;var ia=p.m.ra?p.m.ra(x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da):p.m.call(null,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da),oa=nh(this,ia);F(oa)||kh(p.name,ia);return oa.ra?oa.ra(x,y,z,A,B,
C,D,J,M,P,R,S,V,Y,da):oa.call(null,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da)}function f(p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y){p=this;var da=p.m.qa?p.m.qa(x,y,z,A,B,C,D,J,M,P,R,S,V,Y):p.m.call(null,x,y,z,A,B,C,D,J,M,P,R,S,V,Y),ia=nh(this,da);F(ia)||kh(p.name,da);return ia.qa?ia.qa(x,y,z,A,B,C,D,J,M,P,R,S,V,Y):ia.call(null,x,y,z,A,B,C,D,J,M,P,R,S,V,Y)}function g(p,x,y,z,A,B,C,D,J,M,P,R,S,V){p=this;var Y=p.m.pa?p.m.pa(x,y,z,A,B,C,D,J,M,P,R,S,V):p.m.call(null,x,y,z,A,B,C,D,J,M,P,R,S,V),da=nh(this,Y);F(da)||kh(p.name,
Y);return da.pa?da.pa(x,y,z,A,B,C,D,J,M,P,R,S,V):da.call(null,x,y,z,A,B,C,D,J,M,P,R,S,V)}function k(p,x,y,z,A,B,C,D,J,M,P,R,S){p=this;var V=p.m.oa?p.m.oa(x,y,z,A,B,C,D,J,M,P,R,S):p.m.call(null,x,y,z,A,B,C,D,J,M,P,R,S),Y=nh(this,V);F(Y)||kh(p.name,V);return Y.oa?Y.oa(x,y,z,A,B,C,D,J,M,P,R,S):Y.call(null,x,y,z,A,B,C,D,J,M,P,R,S)}function l(p,x,y,z,A,B,C,D,J,M,P,R){p=this;var S=p.m.na?p.m.na(x,y,z,A,B,C,D,J,M,P,R):p.m.call(null,x,y,z,A,B,C,D,J,M,P,R),V=nh(this,S);F(V)||kh(p.name,S);return V.na?V.na(x,
y,z,A,B,C,D,J,M,P,R):V.call(null,x,y,z,A,B,C,D,J,M,P,R)}function m(p,x,y,z,A,B,C,D,J,M,P){p=this;var R=p.m.ma?p.m.ma(x,y,z,A,B,C,D,J,M,P):p.m.call(null,x,y,z,A,B,C,D,J,M,P),S=nh(this,R);F(S)||kh(p.name,R);return S.ma?S.ma(x,y,z,A,B,C,D,J,M,P):S.call(null,x,y,z,A,B,C,D,J,M,P)}function n(p,x,y,z,A,B,C,D,J,M){p=this;var P=p.m.ya?p.m.ya(x,y,z,A,B,C,D,J,M):p.m.call(null,x,y,z,A,B,C,D,J,M),R=nh(this,P);F(R)||kh(p.name,P);return R.ya?R.ya(x,y,z,A,B,C,D,J,M):R.call(null,x,y,z,A,B,C,D,J,M)}function r(p,x,
y,z,A,B,C,D,J){p=this;var M=p.m.ia?p.m.ia(x,y,z,A,B,C,D,J):p.m.call(null,x,y,z,A,B,C,D,J),P=nh(this,M);F(P)||kh(p.name,M);return P.ia?P.ia(x,y,z,A,B,C,D,J):P.call(null,x,y,z,A,B,C,D,J)}function w(p,x,y,z,A,B,C,D){p=this;var J=p.m.xa?p.m.xa(x,y,z,A,B,C,D):p.m.call(null,x,y,z,A,B,C,D),M=nh(this,J);F(M)||kh(p.name,J);return M.xa?M.xa(x,y,z,A,B,C,D):M.call(null,x,y,z,A,B,C,D)}function t(p,x,y,z,A,B,C){p=this;var D=p.m.fa?p.m.fa(x,y,z,A,B,C):p.m.call(null,x,y,z,A,B,C),J=nh(this,D);F(J)||kh(p.name,D);return J.fa?
J.fa(x,y,z,A,B,C):J.call(null,x,y,z,A,B,C)}function v(p,x,y,z,A,B){p=this;var C=p.m.P?p.m.P(x,y,z,A,B):p.m.call(null,x,y,z,A,B),D=nh(this,C);F(D)||kh(p.name,C);return D.P?D.P(x,y,z,A,B):D.call(null,x,y,z,A,B)}function E(p,x,y,z,A){p=this;var B=p.m.G?p.m.G(x,y,z,A):p.m.call(null,x,y,z,A),C=nh(this,B);F(C)||kh(p.name,B);return C.G?C.G(x,y,z,A):C.call(null,x,y,z,A)}function N(p,x,y,z){p=this;var A=p.m.j?p.m.j(x,y,z):p.m.call(null,x,y,z),B=nh(this,A);F(B)||kh(p.name,A);return B.j?B.j(x,y,z):B.call(null,
x,y,z)}function Q(p,x,y){p=this;var z=p.m.g?p.m.g(x,y):p.m.call(null,x,y),A=nh(this,z);F(A)||kh(p.name,z);return A.g?A.g(x,y):A.call(null,x,y)}function T(p,x){p=this;var y=p.m.h?p.m.h(x):p.m.call(null,x),z=nh(this,y);F(z)||kh(p.name,y);return z.h?z.h(x):z.call(null,x)}function X(p){p=this;var x=p.m.B?p.m.B():p.m.call(null),y=nh(this,x);F(y)||kh(p.name,x);return y.B?y.B():y.call(null)}var U=null;U=function(p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa,Ga,fb,cc){switch(arguments.length){case 1:return X.call(this,
p);case 2:return T.call(this,p,x);case 3:return Q.call(this,p,x,y);case 4:return N.call(this,p,x,y,z);case 5:return E.call(this,p,x,y,z,A);case 6:return v.call(this,p,x,y,z,A,B);case 7:return t.call(this,p,x,y,z,A,B,C);case 8:return w.call(this,p,x,y,z,A,B,C,D);case 9:return r.call(this,p,x,y,z,A,B,C,D,J);case 10:return n.call(this,p,x,y,z,A,B,C,D,J,M);case 11:return m.call(this,p,x,y,z,A,B,C,D,J,M,P);case 12:return l.call(this,p,x,y,z,A,B,C,D,J,M,P,R);case 13:return k.call(this,p,x,y,z,A,B,C,D,J,
M,P,R,S);case 14:return g.call(this,p,x,y,z,A,B,C,D,J,M,P,R,S,V);case 15:return f.call(this,p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y);case 16:return e.call(this,p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da);case 17:return d.call(this,p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia);case 18:return c.call(this,p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa);case 19:return b.call(this,p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa);case 20:return a.call(this,p,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa,Ga);case 21:var Bd=this.m.wa?this.m.wa(x,y,z,A,
B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa,Ga,fb):this.m.call(null,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa,Ga,fb),Pc=nh(this,Bd);F(Pc)||kh(this.name,Bd);return Pc.wa?Pc.wa(x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa,Ga,fb):Pc.call(null,x,y,z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa,Ga,fb);case 22:return Bd=ld(this.m,x,y,z,A,ad([B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa,Ga,fb,cc])),Pc=nh(this,Bd),F(Pc)||kh(this.name,Bd),ld(Pc,x,y,z,A,ad([B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa,Ga,fb,cc]))}throw Error("Invalid arity: "+(arguments.length-
1));};U.h=X;U.g=T;U.j=Q;U.G=N;U.P=E;U.fa=v;U.xa=t;U.ia=w;U.ya=r;U.ma=n;U.na=m;U.oa=l;U.pa=k;U.qa=g;U.ra=f;U.sa=e;U.ta=d;U.ua=c;U.va=b;U.wa=a;return U}();h.apply=function(a,b){var c=Sa(b);a=this.call;b=a.apply;var d=[this],e=d.concat;if(20<c.length){var f=c.slice(0,20);f.push(c.slice(20));c=f}return b.call(a,this,e.call(d,c))};h.B=function(){var a=this.m.B?this.m.B():this.m.call(null),b=nh(this,a);F(b)||kh(this.name,a);return b.B?b.B():b.call(null)};
h.h=function(a){var b=this.m.h?this.m.h(a):this.m.call(null,a),c=nh(this,b);F(c)||kh(this.name,b);return c.h?c.h(a):c.call(null,a)};h.g=function(a,b){var c=this.m.g?this.m.g(a,b):this.m.call(null,a,b),d=nh(this,c);F(d)||kh(this.name,c);return d.g?d.g(a,b):d.call(null,a,b)};h.j=function(a,b,c){var d=this.m.j?this.m.j(a,b,c):this.m.call(null,a,b,c),e=nh(this,d);F(e)||kh(this.name,d);return e.j?e.j(a,b,c):e.call(null,a,b,c)};
h.G=function(a,b,c,d){var e=this.m.G?this.m.G(a,b,c,d):this.m.call(null,a,b,c,d),f=nh(this,e);F(f)||kh(this.name,e);return f.G?f.G(a,b,c,d):f.call(null,a,b,c,d)};h.P=function(a,b,c,d,e){var f=this.m.P?this.m.P(a,b,c,d,e):this.m.call(null,a,b,c,d,e),g=nh(this,f);F(g)||kh(this.name,f);return g.P?g.P(a,b,c,d,e):g.call(null,a,b,c,d,e)};
h.fa=function(a,b,c,d,e,f){var g=this.m.fa?this.m.fa(a,b,c,d,e,f):this.m.call(null,a,b,c,d,e,f),k=nh(this,g);F(k)||kh(this.name,g);return k.fa?k.fa(a,b,c,d,e,f):k.call(null,a,b,c,d,e,f)};h.xa=function(a,b,c,d,e,f,g){var k=this.m.xa?this.m.xa(a,b,c,d,e,f,g):this.m.call(null,a,b,c,d,e,f,g),l=nh(this,k);F(l)||kh(this.name,k);return l.xa?l.xa(a,b,c,d,e,f,g):l.call(null,a,b,c,d,e,f,g)};
h.ia=function(a,b,c,d,e,f,g,k){var l=this.m.ia?this.m.ia(a,b,c,d,e,f,g,k):this.m.call(null,a,b,c,d,e,f,g,k),m=nh(this,l);F(m)||kh(this.name,l);return m.ia?m.ia(a,b,c,d,e,f,g,k):m.call(null,a,b,c,d,e,f,g,k)};h.ya=function(a,b,c,d,e,f,g,k,l){var m=this.m.ya?this.m.ya(a,b,c,d,e,f,g,k,l):this.m.call(null,a,b,c,d,e,f,g,k,l),n=nh(this,m);F(n)||kh(this.name,m);return n.ya?n.ya(a,b,c,d,e,f,g,k,l):n.call(null,a,b,c,d,e,f,g,k,l)};
h.ma=function(a,b,c,d,e,f,g,k,l,m){var n=this.m.ma?this.m.ma(a,b,c,d,e,f,g,k,l,m):this.m.call(null,a,b,c,d,e,f,g,k,l,m),r=nh(this,n);F(r)||kh(this.name,n);return r.ma?r.ma(a,b,c,d,e,f,g,k,l,m):r.call(null,a,b,c,d,e,f,g,k,l,m)};h.na=function(a,b,c,d,e,f,g,k,l,m,n){var r=this.m.na?this.m.na(a,b,c,d,e,f,g,k,l,m,n):this.m.call(null,a,b,c,d,e,f,g,k,l,m,n),w=nh(this,r);F(w)||kh(this.name,r);return w.na?w.na(a,b,c,d,e,f,g,k,l,m,n):w.call(null,a,b,c,d,e,f,g,k,l,m,n)};
h.oa=function(a,b,c,d,e,f,g,k,l,m,n,r){var w=this.m.oa?this.m.oa(a,b,c,d,e,f,g,k,l,m,n,r):this.m.call(null,a,b,c,d,e,f,g,k,l,m,n,r),t=nh(this,w);F(t)||kh(this.name,w);return t.oa?t.oa(a,b,c,d,e,f,g,k,l,m,n,r):t.call(null,a,b,c,d,e,f,g,k,l,m,n,r)};h.pa=function(a,b,c,d,e,f,g,k,l,m,n,r,w){var t=this.m.pa?this.m.pa(a,b,c,d,e,f,g,k,l,m,n,r,w):this.m.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w),v=nh(this,t);F(v)||kh(this.name,t);return v.pa?v.pa(a,b,c,d,e,f,g,k,l,m,n,r,w):v.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w)};
h.qa=function(a,b,c,d,e,f,g,k,l,m,n,r,w,t){var v=this.m.qa?this.m.qa(a,b,c,d,e,f,g,k,l,m,n,r,w,t):this.m.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w,t),E=nh(this,v);F(E)||kh(this.name,v);return E.qa?E.qa(a,b,c,d,e,f,g,k,l,m,n,r,w,t):E.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w,t)};
h.ra=function(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v){var E=this.m.ra?this.m.ra(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v):this.m.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w,t,v),N=nh(this,E);F(N)||kh(this.name,E);return N.ra?N.ra(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v):N.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w,t,v)};
h.sa=function(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E){var N=this.m.sa?this.m.sa(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E):this.m.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E),Q=nh(this,N);F(Q)||kh(this.name,N);return Q.sa?Q.sa(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E):Q.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E)};
h.ta=function(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N){var Q=this.m.ta?this.m.ta(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N):this.m.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N),T=nh(this,Q);F(T)||kh(this.name,Q);return T.ta?T.ta(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N):T.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N)};
h.ua=function(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q){var T=this.m.ua?this.m.ua(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q):this.m.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q),X=nh(this,T);F(X)||kh(this.name,T);return X.ua?X.ua(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q):X.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q)};
h.va=function(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T){var X=this.m.va?this.m.va(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T):this.m.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T),U=nh(this,X);F(U)||kh(this.name,X);return U.va?U.va(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T):U.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T)};
h.wa=function(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T,X){var U=this.m.wa?this.m.wa(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T,X):this.m.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T,X),p=nh(this,U);F(p)||kh(this.name,U);return p.wa?p.wa(a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T,X):p.call(null,a,b,c,d,e,f,g,k,l,m,n,r,w,t,v,E,N,Q,T,X)};function oh(a,b){var c=ph;Ke.G(c.Zb,hd,a,b);gh(c.Yb,c.Zb,c.Pb,c.Xb)}
function nh(a,b){Bc.g(yb(a.Pb),yb(a.Xb))||gh(a.Yb,a.Zb,a.Pb,a.Xb);var c=yb(a.Yb);c=c.h?c.h(b):c.call(null,b);return F(c)?c:jh(a.name,b,a.Xb,a.Zb,a.Pc,a.Yb,a.Pb,a.Jc)}h.xb=function(){return $b(this.name)};h.yb=function(){return ac(this.name)};h.Z=function(){return ca(this)};if("undefined"===typeof va||"undefined"===typeof xa||"undefined"===typeof qh)var qh=null;"undefined"!==typeof console&&Ka();
if("undefined"===typeof va||"undefined"===typeof xa||"undefined"===typeof rh)var rh=function(){throw Error("cljs.core/*eval* not bound");};var sh=new I(null,"y","y",-1757859776),th=new I(null,"role","role",-736691072),uh=new I(null,"description","description",-1428560544),vh=new I(null,"path","path",-188191168),wh=new I(null,"onmouseup","onmouseup",168100736),xh=new I(null,"d1","d1",-1264719807),yh=new I(null,"labels","labels",-626734591),zh=new I(null,"p2","p2",905500641),Ah=new I(null,"min","min",444991522),Bh=new I(null,"r","r",-471384190),Ch=new I(null,"d2","d2",2138401859),Dh=new I(null,"v","v",21465059),Eh=new I(null,"show-labels?",
"show-labels?",-616006332),Ha=new I(null,"meta","meta",1499536964),Fh=new I(null,"selected","selected",574897764),Gh=new I(null,"ul","ul",-1349521403),Hh=new I(null,"f1","f1",1714532389),Ih=new I(null,"color","color",1011675173),Ia=new I(null,"dup","dup",556298533),Jh=new I(null,"add-point","add-point",-1861575067),Kh=new I(null,"ray","ray",-972479417),Lh=new I(null,"scale","scale",-230427353),Mh=new I(null,"button","button",1456579943),Nh=new I(null,"holding","holding",1269510599),Oh=new I(null,
"redo","redo",501190664),Ph=new I(null,"parallel","parallel",-1863607128),mh=new I(null,"default","default",-1987822328),Qh=new I(null,"finally-block","finally-block",832982472),Rh=new I(null,"grid","grid",402978600),Th=new I(null,"strong","strong",269529E3),Uh=new I(null,"name","name",1843675177),Vh=new I(null,"li","li",723558921),Wh=new I(null,"value","value",305978217),Xh=new I(null,"section","section",-300141526),Yh=new I(null,"tool","tool",-1298696470),Zh=new I(null,"circle","circle",1903212362),
$h=new I(null,"y1","y1",589123466),ai=new I(null,"onclick","onclick",1297553739),bi=new I(null,"line-segment","line-segment",-798085781),ci=new I(null,"dy","dy",1719547243),di=new I(null,"release","release",-1534371381),ei=new I(null,"move","move",-2110884309),fi=new I(null,"anti-history","anti-history",1855784523),gi=new I(null,"hold","hold",-1621118005),hi=new I(null,"history","history",-247395220),Sg=new I(null,"val","val",128701612),ii=new I(null,"recur","recur",-437573268),ji=new I(null,"type",
"type",1174270348),ki=new I(null,"colors","colors",1157174732),li=new I(null,"draggable?","draggable?",-236042740),mi=new I(null,"catch-block","catch-block",1175212748),ni=new I(null,"loops","loops",-1766681555),oi=new I(null,"points","points",-1486596883),pi=new I(null,"midset","midset",729550093),qi=new I(null,"perpendicular","perpendicular",-122487411),Og=new I(null,"fallback-impl","fallback-impl",-1501286995),Zg=new I(null,"keyword-fn","keyword-fn",-64566675),Ea=new I(null,"flush-on-newline",
"flush-on-newline",-151457939),ri=new I(null,"r2","r2",252844174),si=new I(null,"hyperbola","hyperbola",-396303090),ti=new I(null,"p1","p1",-936759954),ui=new I(null,"className","className",-1983287057),ch=new I(null,"descendants","descendants",1824886031),vi=new I(null,"k","k",-2146297393),wi=new I(null,"no-op","no-op",-93046065),dh=new I(null,"ancestors","ancestors",-776045424),xi=new I(null,"div","div",1057191632),Fa=new I(null,"readably","readably",1129599760),Fg=new I(null,"more-marker","more-marker",
-14717935),yi=new I(null,"g","g",1738089905),zi=new I(null,"c","c",-1763192079),Ai=new I(null,"defining-points","defining-points",384743506),Bi=new I(null,"guides","guides",-1398390510),Ci=new I(null,"undo","undo",-1818036302),Di=new I(null,"line","line",212345235),Ei=new I(null,"r1","r1",690974900),Ja=new I(null,"print-length","print-length",1931866356),Fi=new I(null,"max","max",61366548),Gi=new I(null,"f2","f2",396168596),Hi=new I(null,"cx","cx",1272694324),Ii=new I(null,"label","label",1718410804),
Ji=new I(null,"id","id",-1388402092),Ki=new I(null,"class","class",-2030961996),Li=new I(null,"cy","cy",755331060),Mi=new I(null,"catch-exception","catch-exception",-1997306795),bh=new I(null,"parents","parents",-2027538891),Ni=new I(null,"onmousedown","onmousedown",-1118865611),Oi=new I(null,"parabola","parabola",-1319322731),Pi=new I(null,"prev","prev",-1597069226),Qi=new I(null,"svg","svg",856789142),Ri=new I(null,"ellipse","ellipse",1135891702),Si=new I(null,"continue-block","continue-block",
-1852047850),Ti=new I(null,"sweeps","sweeps",941098264),Ui=new I(null,"d","d",1972142424),Vi=new I(null,"f","f",-1597136552),Wi=new I(null,"point","point",1813198264),Xi=new I(null,"strokes","strokes",-1645650952),Yi=new I(null,"x","x",2099068185),Zi=new I(null,"x1","x1",-1863922247),$i=new I(null,"input","input",556931961),aj=new I(null,"onmousemove","onmousemove",341554202),bj=new I(null,"h1","h1",-1896887462),cj=new I(null,"y2","y2",-718691301),dj=new I(null,"main","main",-2117802661),ej=new I(null,
"hierarchy","hierarchy",-1053470341),fj=new I(null,"save-image","save-image",-2127892773),Ng=new I(null,"alt-impl","alt-impl",670969595),gj=new I(null,"selected?","selected?",-742502788),hj=new I(null,"handler","handler",-195596612),ij=new I(null,"step","step",1288888124),jj=new I(null,"grid-spacing","grid-spacing",1668963196),kj=new I(null,"mindist","mindist",1821140860),lj=new I(null,"p","p",151049309),mj=new I(null,"x2","x2",-1362513475),nj=new I(null,"show-labels","show-labels",41391613),oj=new I(null,
"href","href",-793805698),pj=new I(null,"bisect","bisect",1224004862),qj=new I(null,"areas","areas",-1988969730),rj=new I(null,"a","a",-2123407586),sj=new I(null,"select","select",1147833503),tj=new I(null,"clear","clear",1877104959),rg=new I("cljs.core","not-found","cljs.core/not-found",-1572889185),uj=new I(null,"foreignObject","foreignObject",25502111),vj=new I(null,"text","text",-1790561697),qg=new I(null,"shapes","shapes",1897594879);var wj={},xj,yj={};function zj(a,b){if(null!=a&&null!=a.dc)a=a.dc(a,b);else{var c=zj[ba(null==a?null:a)];if(null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else if(c=zj._,null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else throw Pa("ReadPort.take!",a);}return a}function Aj(a,b,c){if(null!=a&&null!=a.Tb)a=a.Tb(a,b,c);else{var d=Aj[ba(null==a?null:a)];if(null!=d)a=d.j?d.j(a,b,c):d.call(null,a,b,c);else if(d=Aj._,null!=d)a=d.j?d.j(a,b,c):d.call(null,a,b,c);else throw Pa("WritePort.put!",a);}return a}
function Bj(a){if(null!=a&&null!=a.Db)a=a.Db(a);else{var b=Bj[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=Bj._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("Channel.close!",a);}return a}function Cj(a){if(null!=a&&null!=a.mc)a=!0;else{var b=Cj[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=Cj._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("Handler.active?",a);}return a}
function Dj(a){if(null!=a&&null!=a.nc)a=a.f;else{var b=Dj[ba(null==a?null:a)];if(null!=b)a=b.h?b.h(a):b.call(null,a);else if(b=Dj._,null!=b)a=b.h?b.h(a):b.call(null,a);else throw Pa("Handler.commit",a);}return a}function Ej(a,b){if(null!=a&&null!=a.lc)a=a.lc(a,b);else{var c=Ej[ba(null==a?null:a)];if(null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else if(c=Ej._,null!=c)a=c.g?c.g(a,b):c.call(null,a,b);else throw Pa("Buffer.add!*",a);}return a}
var Fj=function Fj(a){switch(arguments.length){case 1:return Fj.h(arguments[0]);case 2:return Fj.g(arguments[0],arguments[1]);default:throw Error(["Invalid arity: ",G.h(arguments.length)].join(""));}};Fj.h=function(a){return a};Fj.g=function(a,b){return Ej(a,b)};Fj.K=2;function Gj(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function Hj(a){this.length=this.R=this.head=0;this.i=a}Hj.prototype.pop=function(){if(0===this.length)return null;var a=this.i[this.R];this.i[this.R]=null;this.R=(this.R+1)%this.i.length;--this.length;return a};Hj.prototype.unshift=function(a){this.i[this.head]=a;this.head=(this.head+1)%this.i.length;this.length+=1;return null};function Ij(a,b){a.length+1===a.i.length&&a.resize();a.unshift(b)}
Hj.prototype.resize=function(){var a=Array(2*this.i.length);return this.R<this.head?(Gj(this.i,this.R,a,0,this.length),this.R=0,this.head=this.length,this.i=a):this.R>this.head?(Gj(this.i,this.R,a,0,this.i.length-this.R),Gj(this.i,0,a,this.i.length-this.R,this.head),this.R=0,this.head=this.length,this.i=a):this.R===this.head?(this.head=this.R=0,this.i=a):null};function Jj(a,b){for(var c=a.length,d=0;;)if(d<c){var e=a.pop();(b.h?b.h(e):b.call(null,e))&&a.unshift(e);d+=1}else break}
function Kj(a,b){this.O=a;this.n=b;this.o=2;this.F=0}function Lj(a){return a.O.length===a.n}Kj.prototype.lc=function(a,b){Ij(this.O,b);return this};Kj.prototype.Y=function(){return this.O.length};function Mj(){return ta("iPhone")&&!ta("iPod")&&!ta("iPad")};ta("Opera");ta("Trident")||ta("MSIE");ta("Edge");!ta("Gecko")||-1!=sa.toLowerCase().indexOf("webkit")&&!ta("Edge")||ta("Trident")||ta("MSIE")||ta("Edge");-1!=sa.toLowerCase().indexOf("webkit")&&!ta("Edge")&&ta("Mobile");ta("Macintosh");ta("Windows");ta("Linux")||ta("CrOS");var Nj=aa.navigator||null;Nj&&(Nj.appVersion||"").indexOf("X11");ta("Android");Mj();ta("iPad");ta("iPod");Mj()||ta("iPad")||ta("iPod");sa.toLowerCase().indexOf("kaios");function Oj(){var a=document;var b="IFRAME";"application/xhtml+xml"===a.contentType&&(b=b.toLowerCase());return a.createElement(b)};var Pj;
function Qj(){var a=aa.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&!ta("Presto")&&(a=function(){var e=Oj();e.style.display="none";document.documentElement.appendChild(e);var f=e.contentWindow;e=f.document;e.open();e.close();var g="callImmediate"+Math.random(),k="file:"==f.location.protocol?"*":f.location.protocol+"//"+f.location.host;e=ka(function(l){if(("*"==k||l.origin==k)&&l.data==g)this.port1.onmessage()},this);f.addEventListener("message",e,
!1);this.port1={};this.port2={postMessage:function(){f.postMessage(g,k)}}});if("undefined"!==typeof a&&!ta("Trident")&&!ta("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var e=c.hc;c.hc=null;e()}};return function(e){d.next={hc:e};d=d.next;b.port2.postMessage(0)}}return function(e){aa.setTimeout(e,0)}};var Rj=new Hj(Array(32)),Sj=!1,Tj=!1;function Uj(){Sj=!0;Tj=!1;for(var a=0;;){var b=Rj.pop();if(null!=b&&(b.B?b.B():b.call(null),1024>a)){a+=1;continue}break}Sj=!1;return 0<Rj.length?Vj.B?Vj.B():Vj.call(null):null}function Vj(){if(Tj&&Sj)return null;Tj=!0;"function"!==typeof aa.setImmediate||aa.Window&&aa.Window.prototype&&!ta("Edge")&&aa.Window.prototype.setImmediate==aa.setImmediate?(Pj||(Pj=Qj()),Pj(Uj)):aa.setImmediate(Uj)}function Wj(a){Ij(Rj,a);Vj()};var Xj={},Yj;
function Zj(a){if("undefined"===typeof va||"undefined"===typeof xa||"undefined"===typeof wj||"undefined"===typeof yj||"undefined"===typeof Xj||"undefined"===typeof Yj)Yj=function(b,c){this.D=b;this.Mc=c;this.o=425984;this.F=0},Yj.prototype.X=function(b,c){return new Yj(this.D,c)},Yj.prototype.T=function(){return this.Mc},Yj.prototype.Rb=function(){return this.D},Yj.Eb=!0,Yj.gb="cljs.core.async.impl.channels/t_cljs$core$async$impl$channels15188",Yj.Ub=function(b){return Ob(b,"cljs.core.async.impl.channels/t_cljs$core$async$impl$channels15188")};return new Yj(a,
ye)}function ak(a,b){this.Hb=a;this.D=b}function bk(a){return Cj(a.Hb)}function ck(a,b,c,d){this.sb=a;this.Wb=0;this.jb=b;this.Vb=0;this.O=c;this.closed=!1;this.Ja=d}function dk(a){for(;;){var b=a.jb.pop();if(null!=b){var c=b.Hb;Wj(function(d){return function(){return d.h?d.h(!0):d.call(null,!0)}}(c.f,c,b.D,b,a))}break}Jj(a.jb,Ee());a.Db(null)}
ck.prototype.Tb=function(a,b,c){var d=this;if(a=d.closed)return Zj(!a);if(F(function(){var l=d.O;return F(l)?Na(Lj(d.O)):l}())){for(c=Mc(d.Ja.g?d.Ja.g(d.O,b):d.Ja.call(null,d.O,b));;){if(0<d.sb.length&&0<Vc(d.O)){var e=d.sb.pop(),f=e.f,g=d.O.O.pop();Wj(function(l,m){return function(){return l.h?l.h(m):l.call(null,m)}}(f,g,e,c,a,this))}break}c&&dk(this);return Zj(!0)}a=function(){for(;;){var l=d.sb.pop();if(F(l)){if(F(!0))return l}else return null}}();if(F(a)){var k=a.f;Wj(function(){return k.h?k.h(b):
k.call(null,b)});return Zj(!0)}64<d.Vb?(d.Vb=0,Jj(d.jb,bk)):d.Vb+=1;Ij(d.jb,new ak(c,b));return null};
ck.prototype.dc=function(a,b){var c=this;if(null!=c.O&&0<Vc(c.O)){b=b.f;for(a=Zj(c.O.O.pop());;){if(!F(Lj(c.O))){var d=c.jb.pop();if(null!=d){var e=d.Hb,f=d.D;Wj(function(k){return function(){return k.h?k.h(!0):k.call(null,!0)}}(e.f,e,f,d,b,a,this));Mc(c.Ja.g?c.Ja.g(c.O,f):c.Ja.call(null,c.O,f))&&dk(this);continue}}break}return a}a=function(){for(;;){var k=c.jb.pop();if(F(k)){if(Cj(k.Hb))return k}else return null}}();if(F(a)){var g=Dj(a.Hb);Wj(function(){return g.h?g.h(!0):g.call(null,!0)});return Zj(a.D)}if(F(c.closed))return F(c.O)&&
(c.Ja.h?c.Ja.h(c.O):c.Ja.call(null,c.O)),F(F(!0)?b.f:!0)?(b=function(){var k=c.O;return F(k)?0<Vc(c.O):k}(),b=F(b)?c.O.O.pop():null,Zj(b)):null;64<c.Wb?(c.Wb=0,Jj(c.sb,Cj)):c.Wb+=1;Ij(c.sb,b);return null};
ck.prototype.Db=function(){var a=this;if(!a.closed)for(a.closed=!0,F(function(){var e=a.O;return F(e)?0===a.jb.length:e}())&&(a.Ja.h?a.Ja.h(a.O):a.Ja.call(null,a.O));;){var b=a.sb.pop();if(null!=b){var c=b.f,d=F(function(){var e=a.O;return F(e)?0<Vc(a.O):e}())?a.O.O.pop():null;Wj(function(e,f){return function(){return e.h?e.h(f):e.call(null,f)}}(c,d,b,this))}else break}return null};function ek(a){console.log(a);return null}
function fk(a,b){var c=F(null)?null:ek;b=c.h?c.h(b):c.call(null,b);return null==b?a:Fj.g(a,b)}
function gk(a){return new ck(new Hj(Array(32)),new Hj(Array(32)),a,function(){var b=F(null)?null.h?null.h(Fj):null.call(null,Fj):Fj;return function(){function c(f,g){try{return b.g?b.g(f,g):b.call(null,f,g)}catch(k){return fk(f,k)}}function d(f){try{return b.h?b.h(f):b.call(null,f)}catch(g){return fk(f,g)}}var e=null;e=function(f,g){switch(arguments.length){case 1:return d.call(this,f);case 2:return c.call(this,f,g)}throw Error("Invalid arity: "+arguments.length);};e.h=d;e.g=c;return e}()}())};var hk={},ik;
function jk(a){if("undefined"===typeof va||"undefined"===typeof xa||"undefined"===typeof wj||"undefined"===typeof yj||"undefined"===typeof hk||"undefined"===typeof ik)ik=function(b,c){this.f=b;this.Nc=c;this.o=393216;this.F=0},ik.prototype.X=function(b,c){return new ik(this.f,c)},ik.prototype.T=function(){return this.Nc},ik.prototype.mc=function(){return!0},ik.prototype.nc=function(){return this.f},ik.Eb=!0,ik.gb="cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers15215",ik.Ub=function(b){return Ob(b,
"cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers15215")};return new ik(a,ye)}function kk(a){try{var b=a[0];return b.h?b.h(a):b.call(null,a)}catch(c){if(c instanceof Object)throw b=c,a[6].Db(null),b;throw c;}}function lk(a,b,c){c=c.dc(null,jk(function(d){a[2]=d;a[1]=b;return kk(a)}));return F(c)?(a[2]=yb(c),a[1]=b,ii):null}function mk(a,b,c){b=b.Tb(null,c,jk(function(d){a[2]=d;a[1]=16;return kk(a)}));return F(b)?(a[2]=yb(b),a[1]=16,ii):null}
function nk(a,b){a=a[6];null!=b&&a.Tb(null,b,jk(function(){return null}));a.Db(null);return a}function ok(a,b,c,d,e,f,g,k){this.Ka=a;this.La=b;this.Na=c;this.Ma=d;this.Fa=e;this.Wa=f;this.Da=g;this.C=k;this.o=2230716170;this.F=139264}h=ok.prototype;h.aa=function(a,b){return this.J(null,b,null)};
h.J=function(a,b,c){switch(b instanceof I?b.Ha:null){case "catch-block":return this.Ka;case "catch-exception":return this.La;case "finally-block":return this.Na;case "continue-block":return this.Ma;case "prev":return this.Fa;default:return H.j(this.Da,b,c)}};h.wb=function(a,b,c){return Ua(function(d,e){var f=gd(e,0);e=gd(e,1);return b.j?b.j(d,f,e):b.call(null,d,f,e)},c,this)};
h.U=function(a,b,c){return Eg(b,function(d){return Eg(b,Lg,""," ","",c,d)},"#cljs.core.async.impl.ioc-helpers.ExceptionFrame{",", ","}",c,ne.g(new W(null,5,5,Z,[new W(null,2,5,Z,[mi,this.Ka],null),new W(null,2,5,Z,[Mi,this.La],null),new W(null,2,5,Z,[Qh,this.Na],null),new W(null,2,5,Z,[Si,this.Ma],null),new W(null,2,5,Z,[Pi,this.Fa],null)],null),this.Da))};h.Ga=function(){return new Df(this,new W(null,5,5,Z,[mi,Mi,Qh,Si,Pi],null),F(this.Da)?gc(this.Da):Ae())};h.T=function(){return this.Wa};
h.Y=function(){return 5+Vc(this.Da)};h.Z=function(){var a=this.C;return null!=a?a:this.C=a=846900531^Ic(this)};h.H=function(a,b){return null!=b&&this.constructor===b.constructor&&Bc.g(this.Ka,b.Ka)&&Bc.g(this.La,b.La)&&Bc.g(this.Na,b.Na)&&Bc.g(this.Ma,b.Ma)&&Bc.g(this.Fa,b.Fa)&&Bc.g(this.Da,b.Da)};
h.Sb=function(a,b){return zd(new tg(null,new u(null,5,[Qh,null,mi,null,Mi,null,Pi,null,Si,null],null),null),b)?jd.g(Bb(We(ye,this),this.Wa),b):new ok(this.Ka,this.La,this.Na,this.Ma,this.Fa,this.Wa,ze(jd.g(this.Da,b)),null)};h.fb=function(a,b){switch(b instanceof I?b.Ha:null){case "catch-block":case "catch-exception":case "finally-block":case "continue-block":case "prev":return!0;default:return zd(this.Da,b)}};
h.Ua=function(a,b,c){return F(Zd.g?Zd.g(mi,b):Zd.call(null,mi,b))?new ok(c,this.La,this.Na,this.Ma,this.Fa,this.Wa,this.Da,null):F(Zd.g?Zd.g(Mi,b):Zd.call(null,Mi,b))?new ok(this.Ka,c,this.Na,this.Ma,this.Fa,this.Wa,this.Da,null):F(Zd.g?Zd.g(Qh,b):Zd.call(null,Qh,b))?new ok(this.Ka,this.La,c,this.Ma,this.Fa,this.Wa,this.Da,null):F(Zd.g?Zd.g(Si,b):Zd.call(null,Si,b))?new ok(this.Ka,this.La,this.Na,c,this.Fa,this.Wa,this.Da,null):F(Zd.g?Zd.g(Pi,b):Zd.call(null,Pi,b))?new ok(this.Ka,this.La,this.Na,
this.Ma,c,this.Wa,this.Da,null):new ok(this.Ka,this.La,this.Na,this.Ma,this.Fa,this.Wa,hd.j(this.Da,b,c),null)};h.S=function(){return K(ne.g(new W(null,5,5,Z,[new qf(mi,this.Ka),new qf(Mi,this.La),new qf(Qh,this.Na),new qf(Si,this.Ma),new qf(Pi,this.Fa)],null),this.Da))};h.X=function(a,b){return new ok(this.Ka,this.La,this.Na,this.Ma,this.Fa,b,this.Da,this.C)};h.ca=function(a,b){return sd(b)?this.Ua(null,bb.g(b,0),bb.g(b,1)):Ua($a,this,b)};
function pk(a){for(;;){var b=a[4],c=mi.h(b),d=Mi.h(b),e=a[5];if(F(function(){var f=e;return F(f)?Na(b):f}()))throw e;if(F(function(){var f=e;return F(f)?(f=c,F(f)?e instanceof d:f):f}())){a[1]=c;a[2]=e;a[5]=null;a[4]=hd.v(b,mi,null,ad([Mi,null]));break}if(F(function(){var f=e;return F(f)?Na(c)&&Na(Qh.h(b)):f}()))a[4]=Pi.h(b);else{if(F(function(){var f=e;return F(f)?(f=Na(c))?Qh.h(b):f:f}())){a[1]=Qh.h(b);a[4]=hd.j(b,Qh,null);break}if(F(function(){var f=Na(e);return f?Qh.h(b):f}())){a[1]=Qh.h(b);a[4]=
hd.j(b,Qh,null);break}if(Na(e)&&Na(Qh.h(b))){a[1]=Si.h(b);a[4]=Pi.h(b);break}throw Error("No matching clause");}}};function qk(a,b,c){this.key=a;this.D=b;this.forward=c;this.o=2155872256;this.F=0}qk.prototype.S=function(){return new dd(null,this.key,new dd(null,this.D,null,1,null),2,null)};qk.prototype.U=function(a,b,c){return Eg(b,Lg,"["," ","]",c,this)};function rk(a,b,c){c=Array(c+1);for(var d=0;;)if(d<c.length)c[d]=null,d+=1;else break;return new qk(a,b,c)}function sk(a,b,c,d){for(;;){if(0>c)return a;a:for(;;){var e=a.forward[c];if(F(e))if(e.key<b)a=e;else break a;else break a}null!=d&&(d[c]=a);--c}}
function tk(){this.ib=rk(null,null,0);this.level=0;this.o=2155872256;this.F=0}tk.prototype.put=function(a,b){var c=Array(15),d=sk(this.ib,a,this.level,c).forward[0];if(null!=d&&d.key===a)return d.D=b;a:for(d=0;;)if(.5>Math.random()&&15>d)d+=1;else break a;if(d>this.level){for(var e=this.level+1;;)if(e<=d+1)c[e]=this.ib,e+=1;else break;this.level=d}for(a=rk(a,b,Array(d));;)return 0<=this.level?(c=c[0].forward,a.forward[0]=c[0],c[0]=a):null};
tk.prototype.remove=function(a){var b=Array(15),c=sk(this.ib,a,this.level,b).forward[0];if(null!=c&&c.key===a){for(a=0;;)if(a<=this.level){var d=b[a].forward;d[a]===c&&(d[a]=c.forward[a]);a+=1}else break;for(;;)if(0<this.level&&null==this.ib.forward[this.level])--this.level;else return null}else return null};function uk(a){for(var b=vk,c=b.ib,d=b.level;;){if(0>d)return c===b.ib?null:c;var e;a:for(e=c;;){e=e.forward[d];if(null==e){e=null;break a}if(e.key>=a)break a}null!=e?(--d,c=e):--d}}
tk.prototype.S=function(){return function c(b){return new ce(null,function(){return null==b?null:$c(new W(null,2,5,Z,[b.key,b.D],null),c(b.forward[0]))},null)}(this.ib.forward[0])};tk.prototype.U=function(a,b,c){return Eg(b,function(d){return Eg(b,Lg,""," ","",c,d)},"{",", ","}",c,this)};var vk=new tk;function wk(){var a=(new Date).valueOf()+30,b=uk(a);b=F(F(b)?b.key<a+10:b)?b.D:null;if(F(b))return b;var c=gk(null);vk.put(a,c);setTimeout(function(){vk.remove(a);return Bj(c)},30);return c};function xk(a){if("undefined"===typeof va||"undefined"===typeof xa||"undefined"===typeof wj||"undefined"===typeof xj)xj=function(b,c){this.f=b;this.Oc=c;this.o=393216;this.F=0},xj.prototype.X=function(b,c){return new xj(this.f,c)},xj.prototype.T=function(){return this.Oc},xj.prototype.mc=function(){return!0},xj.prototype.nc=function(){return this.f},xj.Eb=!0,xj.gb="cljs.core.async/t_cljs$core$async15301",xj.Ub=function(b){return Ob(b,"cljs.core.async/t_cljs$core$async15301")};return new xj(a,ye)}
function yk(a){a=Bc.g(a,0)?null:a;return gk("number"===typeof a?new Kj(new Hj(Array(a)),a):a)}function zk(a,b){a=zj(a,xk(b));if(F(a)){var c=yb(a);F(!0)?b.h?b.h(c):b.call(null,c):Wj(function(){return b.h?b.h(c):b.call(null,c)})}return null}
var Ak=xk(function(){return null}),Bk=function Bk(a){switch(arguments.length){case 2:return Bk.g(arguments[0],arguments[1]);case 3:return Bk.j(arguments[0],arguments[1],arguments[2]);case 4:return Bk.G(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error(["Invalid arity: ",G.h(arguments.length)].join(""));}};Bk.g=function(a,b){a=Aj(a,b,Ak);return F(a)?yb(a):!0};Bk.j=function(a,b,c){return Bk.G(a,b,c,!0)};
Bk.G=function(a,b,c,d){a=Aj(a,b,xk(c));if(F(a)){var e=yb(a);F(d)?c.h?c.h(e):c.call(null,e):Wj(function(){return c.h?c.h(e):c.call(null,e)});return e}return!0};Bk.K=4;var Ck=Error();var Dk=VDOM.diff,Ek=VDOM.patch,Fk=VDOM.create;function Gk(a){return Te(La,Te(wd,Ue(wd,a)))}function Hk(a,b,c){return new VDOM.VHtml(be(a),Yg(b),Yg(c))}function Ik(a,b,c){return new VDOM.VSvg(be(a),Yg(b),Yg(c))}
var Jk=function Jk(a){if(null==a)return new VDOM.VText("");if(wd(a))return Hk(xi,ye,Le.g(Jk,Gk(a)));if("string"===typeof a||"number"===typeof a)return new VDOM.VText(a);if(Bc.g(Qi,L(a)))return Kk.h?Kk.h(a):Kk.call(null,a);var c=K(a);a=L(c);var d=O(c);c=L(d);d=O(d);return Hk(a,c,Le.g(Jk,Gk(d)))},Kk=function Kk(a){if(null==a)return new VDOM.VText("");if("string"===typeof a||"number"===typeof a)return new VDOM.VText(a);if(Bc.g(uj,L(a))){var c=K(a);a=L(c);c=O(c);var d=L(c);c=O(c);return Ik(a,d,Le.g(Jk,
Gk(c)))}c=K(a);a=L(c);c=O(c);d=L(c);c=O(c);return Ik(a,d,Le.g(Kk,Gk(c)))};function Lk(){var a=Mk,b=Nk,c=Ok,d=yk(null);Bk.g(d,b);var e=yk(1);Wj(function(){var f=function(){function k(l){var m=l[1];if(1===m)return lk(l,2,c);if(2===m){m=b;var n=l[2];l[7]=n;l[8]=m;l[2]=null;l[1]=3;return ii}return 3===m?(n=l[7],m=l[8],m=a.g?a.g(m,n):a.call(null,m,n),n=Bk.g(d,m),l[9]=m,l[10]=n,lk(l,5,c)):4===m?nk(l,l[2]):5===m?(m=l[9],n=l[2],l[7]=n,l[8]=m,l[2]=null,l[1]=3,ii):null}return function(){function l(r){for(;;){a:try{for(;;){var w=k(r);if(!Zd(w,ii)){var t=w;break a}}}catch(v){if(v instanceof
Object)r[5]=v,pk(r),t=ii;else throw v;}if(!Zd(t,ii))return t}}function m(){var r=[null,null,null,null,null,null,null,null,null,null,null];r[0]=n;r[1]=1;return r}var n=null;n=function(r){switch(arguments.length){case 0:return m.call(this);case 1:return l.call(this,r)}throw Error("Invalid arity: "+arguments.length);};n.B=m;n.h=l;return n}()}(),g=function(){var k=f.B?f.B():f.call(null);k[6]=e;return k}();return kk(g)});return d};var Pk={};Ka();function Qk(a,b){return ng.v(ad([b,new u(null,2,[Ji,Ug(be(a)),ji,a],null)]))}function Rk(a,b){return function(c){return Sk(a,b,new W(null,1,5,Z,[c],null))}}function Sk(a,b,c){return Bc.g(Vc(b),Vc(c))?new W(null,2,5,Z,[Rk(a,b),Qk(a,wg(b,c))],null):new W(null,1,5,Z,[function(d){return Sk(a,b,bd.g(c,d))}],null)}
var Tk=function Tk(a){switch(arguments.length){case 1:return Tk.h(arguments[0]);case 2:return Tk.g(arguments[0],arguments[1]);default:throw Error(["Invalid arity: ",G.h(arguments.length)].join(""));}};Tk.h=function(a){var b=Tk.g,c=Ug("mindist");a=[a];for(var d=a.length,e=Rb(vg),f=0;;)if(f<d)Sb(e,a[f]),f+=1;else break;a=Tb(e);return b.call(Tk,c,a)};Tk.g=function(a,b){return new W(null,2,5,Z,[function(c){return Tk.g(a,bd.g(b,c))},new u(null,3,[Ji,a,ji,kj,oi,b],null)],null)};Tk.K=2;
var Uk=new W(null,3,5,Z,["1st","2nd","3rd"],null);
function Vk(a){return new W(null,3,5,Z,[Gh,ye,function(){return function d(c){return new ce(null,function(){for(;;){var e=K(c);if(e){if(td(e)){var f=Yb(e),g=Vc(f),k=ge(g);a:for(var l=0;;)if(l<g){var m=bb.g(f,l),n=gd(m,0);m=gd(m,1);n=new W(null,5,5,Z,[Vh,ye,new W(null,3,5,Z,[Th,ye,[G.h(n)," point"].join("")],null)," — ",m],null);k.add(n);l+=1}else{f=!0;break a}return f?ie(k.I(),d(Zb(e))):ie(k.I(),null)}f=L(e);k=gd(f,0);f=gd(f,1);return $c(new W(null,5,5,Z,[Vh,ye,new W(null,3,5,Z,[Th,ye,[G.h(k)," point"].join("")],
null)," — ",f],null),d(zc(e)))}return null}},null)}(Le.j(wf,Uk,a))}()],null)}
var Xk=new W(null,13,5,Z,[new u(null,4,[Ji,Wi,Uh,"Point",hj,function Wk(){return new W(null,1,5,Z,[Wk],null)},uh,new W(null,3,5,Z,[lj,ye,"Create a point."],null)],null),new u(null,4,[Ji,Di,Uh,"Line",hj,Rk(Di,new W(null,2,5,Z,[ti,zh],null)),uh,new dd(null,new W(null,3,5,Z,[lj,ye,"Create a line."],null),new dd(null,Vk(ad(["the start of the line","the end of the line"])),new dd(null,new W(null,3,5,Z,[lj,ye,"A line is the collinear set of points through two points."],null),null,1,null),2,null),3,null)],
null),new u(null,4,[Ji,bi,Uh,"Line Segment",hj,Rk(bi,new W(null,2,5,Z,[ti,zh],null)),uh,new dd(null,new W(null,3,5,Z,[lj,ye,"Create a line segment."],null),new dd(null,Vk(ad(["the start of the line segment","the end of the line segment"])),new dd(null,new W(null,3,5,Z,[lj,ye,"A line segment is the set of points between two points."],null),null,1,null),2,null),3,null)],null),new u(null,4,[Ji,Kh,Uh,"Ray",hj,Rk(Kh,new W(null,2,5,Z,[ti,zh],null)),uh,new dd(null,new W(null,3,5,Z,[lj,ye,"Create a ray."],
null),new dd(null,Vk(ad(["the start of the ray","the line through which the ray passes"])),null,1,null),2,null)],null),new u(null,4,[Ji,Ph,Uh,"Parallel",hj,Rk(Ph,new W(null,3,5,Z,[ti,zh,vi],null)),uh,new dd(null,new W(null,3,5,Z,[lj,ye,"Create a line parallel to the line between two points."],null),new dd(null,Vk(ad(["a point on the line","another point on the line","a point through which the parallel line passes"])),null,1,null),2,null)],null),new u(null,4,[Ji,pi,Uh,"Midset",hj,Rk(pi,new W(null,
2,5,Z,[ti,zh],null)),uh,new dd(null,new W(null,3,5,Z,[lj,ye,"Create a midset."],null),new dd(null,Vk(ad(["the first point","the second point"])),new dd(null,new W(null,3,5,Z,[lj,ye,"A midset is the set of points equidistant from two points."],null),null,1,null),2,null),3,null)],null),new u(null,4,[Ji,qi,Uh,"Perpendicular",hj,Rk(qi,new W(null,3,5,Z,[ti,zh,vi],null)),uh,new dd(null,new W(null,3,5,Z,[lj,ye,"Create a perpendicular."],null),new dd(null,Vk(ad(["a point on the line","another point on the line",
"a point through which the perpendicular passes"])),new dd(null,new W(null,3,5,Z,[lj,ye,"A perpendicular is the shortest line between a point and a line, extended indefinitely."],null),null,1,null),2,null),3,null)],null),new u(null,4,[Ji,pj,Uh,"Bisect",hj,Rk(pj,new W(null,3,5,Z,[Ei,Dh,ri],null)),uh,new dd(null,new W(null,3,5,Z,[lj,ye,"Show the line that bisects an angle."],null),new dd(null,Vk(ad(["a point on the first ray","the vertex of the rays","a point on the second ray"])),null,1,null),2,null)],
null),new u(null,4,[Ji,Zh,Uh,"Circle",hj,Rk(Zh,new W(null,2,5,Z,[zi,Bh],null)),uh,new dd(null,new W(null,3,5,Z,[lj,ye,"Create a circle."],null),new dd(null,Vk(ad(["the center of the circle","the point through which the circumference passes"])),new dd(null,new W(null,3,5,Z,[lj,ye,"A circle is the set of points a constant distance from another point."],null),null,1,null),2,null),3,null)],null),new u(null,4,[Ji,Ri,Uh,"Ellipse",hj,Rk(Ri,new W(null,3,5,Z,[Hh,Gi,vi],null)),uh,new dd(null,new W(null,3,5,
Z,[lj,ye,"Create an ellipse."],null),new dd(null,Vk(ad(["one focus","another focus","a point through which the circumference passes"])),new dd(null,new W(null,3,5,Z,[lj,ye,"An ellipse is the set of points a constant total distance from two points."],null),null,1,null),2,null),3,null)],null),new u(null,4,[Ji,Oi,Uh,"Parabola",hj,Rk(Oi,new W(null,3,5,Z,[Vi,xh,Ch],null)),uh,new dd(null,new W(null,3,5,Z,[lj,ye,"Create a parabola."],null),new dd(null,Vk(ad(["the focus","a point on the directrix","another point on the directrix"])),
new dd(null,new W(null,3,5,Z,[lj,ye,"A parabola is the set of points equidistant from a point and a line."],null),null,1,null),2,null),3,null)],null),new u(null,4,[Ji,si,Uh,"Hyperbola",hj,Rk(si,new W(null,3,5,Z,[Hh,Gi,vi],null)),uh,new dd(null,new W(null,3,5,Z,[lj,ye,"Create a hyperbola."],null),new dd(null,Vk(ad(["a focus","another focus","a point that defines the ratio"])),null,1,null),2,null)],null),new u(null,4,[Ji,kj,Uh,"Minimum Distance",hj,Tk,uh,new dd(null,new W(null,3,5,Z,[lj,ye,"Show the area with minimum total distance to multiple points."],
null),new dd(null,new W(null,3,5,Z,[lj,ye,"A minimum distance is the area that's the least sum total distance to more than one point."],null),null,1,null),2,null)],null)],null);function Yk(a,b,c){if(Ud(c)){var d=ue(Wd,Le.g(a,c));return b.h?b.h(d):b.call(null,d)}return vf(c)?(d=new qf(function(){var e=sb(c);return a.h?a.h(e):a.call(null,e)}(),function(){var e=tb(c);return a.h?a.h(e):a.call(null,e)}()),b.h?b.h(d):b.call(null,d)):wd(c)?(d=Dg(Le.g(a,c)),b.h?b.h(d):b.call(null,d)):rd(c)?(d=Ua(function(e,f){return bd.g(e,a.h?a.h(f):a.call(null,f))},c,c),b.h?b.h(d):b.call(null,d)):od(c)?(d=We(ed(c),Le.g(a,c)),b.h?b.h(d):b.call(null,d)):b.h?b.h(c):b.call(null,c)}
var Zk=function Zk(a,b){return Yk(Fe(Zk,a),a,b)};function $k(a,b){var c=xe(a);a=H.g(c,Yi);c=H.g(c,sh);b=xe(b);var d=H.g(b,Yi);return(H.g(b,sh)-c)/(d-a)}function al(a,b){b=xe(b);var c=H.g(b,Yi);return H.g(b,sh)-a*c}function bl(a,b){return function(c){return a*c+b}}function cl(a,b){return function(c){return(c-b)/a}}
function dl(a,b){a=xe(a);var c=H.g(a,Yi),d=H.g(a,sh);a=gd(b,0);b=gd(b,1);var e=$k(a,b);b=Math.abs(e);var f=al(e,a);return Bc.g(Infinity,b)?new u(null,2,[Yi,a.h?a.h(Yi):a.call(null,Yi),sh,d],null):1<b?new u(null,2,[Yi,function(){var g=cl(e,f);return g.h?g.h(d):g.call(null,d)}(),sh,d],null):new u(null,2,[Yi,c,sh,function(){var g=bl(e,f);return g.h?g.h(c):g.call(null,c)}()],null)}function el(a,b){return fl(Yi,a,b)+fl(sh,a,b)}
function fl(a,b,c){return Math.abs((a.h?a.h(b):a.call(null,b))-(a.h?a.h(c):a.call(null,c)))}function gl(a){return Kd(Nd,a)/Vc(a)}function hl(a,b){return a-.01<b&&b<a+.01}function il(a,b,c){var d=$k(a,b);c=$k(b,c);return Bc.g(Math.abs(d),Infinity)&&Bc.g(Math.abs(c),Infinity)||hl(d,c)&&hl(al(d,a),al(c,b))}function jl(a){var b=Le.g(Yi,a);a=Le.g(sh,a);var c=ue(Pd,b);b=F(c)?c:ue(Qd,b);return F(b)?(b=ue(Pd,a),F(b)?b:ue(Qd,a)):b}
function kl(a,b){var c=xe(a);a=H.g(c,Yi);c=H.g(c,sh);var d=xe(b);b=H.g(d,Yi);d=H.g(d,sh);return new u(null,2,[Yi,gl(ad([a,b])),sh,gl(ad([c,d]))],null)}function ll(a,b){var c=xe(a),d=H.g(c,Yi);c=H.g(c,sh);var e=xe(b),f=H.g(e,Yi);e=H.g(e,sh);if(0===d-f)return new u(null,2,[Yi,d,sh,e<c?0:1E4],null);b=$k(a,b);a=al(b,a);d=f<d?0:1E4;c=e<c?0:1E4;c=1<Math.abs(b)?new W(null,2,5,Z,[(c-a)/b,c],null):new W(null,2,5,Z,[d,a+b*d],null);d=gd(c,0);c=gd(c,1);return new u(null,2,[Yi,d,sh,c],null)}
function ml(a,b){var c=xe(a);a=H.g(c,Yi);c=H.g(c,sh);var d=xe(b);b=H.g(d,Yi);d=H.g(d,sh);return new W(null,2,5,Z,[new u(null,2,[Yi,a,sh,d],null),new u(null,2,[Yi,b,sh,c],null)],null)}function nl(a,b){var c=ml(a,b),d=gd(c,0);c=gd(c,1);return new W(null,4,5,Z,[a,d,b,c],null)}function ol(a){var b=xe(a);a=H.g(b,Yi);b=H.g(b,sh);return(0>=a||1E4<=a)&&(0>=b||1E4<=b)}function pl(a,b,c){return bf(bf(a,Yi,Nd,b),sh,Nd,c)}
function ql(a,b){a=xe(a);H.g(a,Yi);H.g(a,sh);return new W(null,4,5,Z,[pl(a,-b,0),pl(a,0,-b),pl(a,b,0),pl(a,0,b)],null)}function rl(a,b){return Bc.g(Yi.h(a),Yi.h(b))}
function sl(a,b){var c=gd(a,0),d=gd(a,1);a=gd(b,0);b=gd(b,1);if(rl(c,d)&&rl(a,b))return null;if(rl(c,d)){var e=Yi.h(c),f=$k(a,b),g=al(f,a);return new u(null,2,[Yi,e,sh,function(){var m=bl(f,g);return m.h?m.h(e):m.call(null,e)}()],null)}if(rl(a,b))return e=Yi.h(a),f=$k(c,d),g=al(f,c),new u(null,2,[Yi,e,sh,function(){var m=bl(f,g);return m.h?m.h(e):m.call(null,e)}()],null);if(Bc.g($k(c,d),$k(a,b)))return null;var k=$k(c,d);b=$k(a,b);var l=al(k,c);e=(al(b,a)-l)/(k-b);return new u(null,2,[Yi,e,sh,function(){var m=
bl(k,l);return m.h?m.h(e):m.call(null,e)}()],null)}function tl(a,b){var c=gd(a,0),d=gd(a,1);return Te(La,Le.g(function(e){return sl(new W(null,2,5,Z,[c,d],null),e)},Le.j(wf,b,Me(Pe(b)))))}function ul(a,b){var c=xe(a);a=H.g(c,Yi);c=H.g(c,sh);var d=xe(b);b=H.g(d,Yi);d=H.g(d,sh);a=b-a;c=d-c;return new W(null,2,5,Z,[a/Math.abs(a),c/Math.abs(c)],null)}function vl(a,b,c){a=$k(a,b);a=Bc.g(Infinity,Math.abs(a))?pl(c,0,1):pl(c,1,a);return new W(null,2,5,Z,[ll(c,a),ll(a,c)],null)};function wl(a){return function(b){b.stopPropagation();return a.B?a.B():a.call(null)}};var xl={};if("undefined"===typeof Pk||"undefined"===typeof xl||"undefined"===typeof ph)var ph=function(){var a=He(ye),b=He(ye),c=He(ye),d=He(ye),e=H.j(ye,ej,ah.B?ah.B():ah.call(null));return new lh(vc.g("taxicab.shapes","shape"),function(f){f=xe(f);return H.g(f,ji)},e,a,b,c,d)}();oh(Wi,function(a){var b=xe(a);H.g(b,Ji);a=H.g(b,Yi);var c=H.g(b,sh);b=H.g(b,Ii);return new u(null,1,[oi,new W(null,1,5,Z,[new u(null,4,[Yi,a,sh,c,Ii,b,li,!0],null)],null)],null)});
oh(Di,function(a){var b=xe(a);H.g(b,Ji);a=H.g(b,ti);b=H.g(b,zh);return new u(null,2,[Xi,new W(null,1,5,Z,[new W(null,2,5,Z,[ll(b,a),ll(a,b)],null)],null),Ai,new W(null,2,5,Z,[a,b],null)],null)});oh(bi,function(a){var b=xe(a);a=H.g(b,ti);b=H.g(b,zh);return new u(null,2,[Xi,new W(null,1,5,Z,[new W(null,2,5,Z,[a,b],null)],null),Ai,new W(null,2,5,Z,[a,b],null)],null)});
oh(Kh,function(a){var b=xe(a);a=H.g(b,ti);b=H.g(b,zh);return new u(null,2,[Xi,new W(null,1,5,Z,[new W(null,2,5,Z,[a,ll(a,b)],null)],null),Ai,new W(null,2,5,Z,[a,b],null)],null)});oh(Ph,function(a){var b=xe(a);a=H.g(b,ti);var c=H.g(b,zh);b=H.g(b,vi);return new u(null,3,[Xi,new W(null,1,5,Z,[vl(a,c,b)],null),Ai,new W(null,3,5,Z,[a,c,b],null),Bi,new W(null,1,5,Z,[new W(null,2,5,Z,[ll(a,c),ll(c,a)],null)],null)],null)});
oh(pi,function(a){function b(f){return hl(el(c,f),el(d,f))}a=xe(a);var c=H.g(a,ti),d=H.g(a,zh);a=kl(c,d);a=el(c,a);var e=Se(b,ne.g(ql(c,a),ql(d,a)));a=gd(e,0);e=gd(e,1);return new u(null,4,[Xi,new W(null,1,5,Z,[new W(null,2,5,Z,[a,e],null)],null),Ti,new W(null,2,5,Z,[new W(null,2,5,Z,[a,Se(b,ql(a,1))],null),Bc.g(a,e)?null:new W(null,2,5,Z,[e,Se(b,ql(e,1))],null)],null),Ai,new W(null,2,5,Z,[c,d],null),Bi,new W(null,1,5,Z,[new W(null,2,5,Z,[c,d],null)],null)],null)});
oh(qi,function(a){var b=xe(a);a=H.g(b,ti);var c=H.g(b,zh);b=H.g(b,vi);var d=$k(a,c);Bc.g(1,d)?d=new W(null,2,5,Z,[new W(null,3,5,Z,[b,pl(b,1,0),pl(b,0,-1)],null),new W(null,3,5,Z,[b,pl(b,-1,0),pl(b,0,1)],null)],null):Bc.g(-1,d)?d=new W(null,2,5,Z,[new W(null,3,5,Z,[b,pl(b,-1,0),pl(b,0,-1)],null),new W(null,3,5,Z,[b,pl(b,1,0),pl(b,0,1)],null)],null):(d=dl(b,new W(null,2,5,Z,[a,c],null)),d=new W(null,1,5,Z,[new W(null,3,5,Z,[b,ll(d,b),ll(b,d)],null)],null));return new u(null,3,[Ti,d,Ai,new W(null,3,
5,Z,[a,c,b],null),Bi,new W(null,1,5,Z,[new W(null,2,5,Z,[ll(a,c),ll(c,a)],null)],null)],null)});
oh(pj,function(a){function b(g,k){k=sl(g,k);var l=gd(g,0);g=gd(g,1);var m=il(l,g,k);m?(m=jl(ad([l,g,k])),k=F(m)?m:jl(ad([l,k,g]))):k=m;return k}function c(g,k,l){var m=vl(g,k,pl(g,l,0)),n=el(g,dl(g,m));return F(l-.001<=n&&n<=l+.001)?new W(null,2,5,Z,[m,vl(g,k,pl(g,-l,0))],null):new W(null,2,5,Z,[vl(g,k,pl(g,0,l)),vl(g,k,pl(g,0,-l))],null)}var d=xe(a);a=H.g(d,Ei);var e=H.g(d,Dh);d=H.g(d,ri);var f=sl(L(Se(Fe(b,new W(null,2,5,Z,[e,d],null)),c(e,a,1))),L(Se(Fe(b,new W(null,2,5,Z,[e,a],null)),c(e,d,1))));
return new u(null,3,[Xi,new W(null,1,5,Z,[new W(null,2,5,Z,[ll(e,f),ll(f,e)],null)],null),Ai,new W(null,3,5,Z,[a,e,d],null),Bi,new W(null,2,5,Z,[new W(null,2,5,Z,[ll(a,e),ll(e,a)],null),new W(null,2,5,Z,[ll(d,e),ll(e,d)],null)],null)],null)});oh(Zh,function(a){var b=xe(a);a=H.g(b,zi);b=H.g(b,Bh);return new u(null,2,[ni,new W(null,1,5,Z,[ql(a,el(a,b))],null),Ai,new W(null,2,5,Z,[hd.j(a,th,"Center"),b],null)],null)});
oh(Ri,function(a){var b=xe(a);a=H.g(b,Hh);var c=H.g(b,Gi);b=H.g(b,vi);var d=xe(a),e=H.g(d,Yi);d=H.g(d,sh);var f=xe(c),g=H.g(f,Yi);f=H.g(f,sh);g=Ed(new W(null,2,5,Z,[e,g],null));e=gd(g,0);g=gd(g,1);f=Ed(new W(null,2,5,Z,[d,f],null));d=gd(f,0);f=gd(f,1);var k=(el(a,b)+el(c,b)-el(a,c))/2;return new u(null,2,[ni,new W(null,1,5,Z,[new W(null,9,5,Z,[new u(null,2,[Yi,e-k,sh,d],null),new u(null,2,[Yi,e-k,sh,f],null),new u(null,2,[Yi,e,sh,f+k],null),new u(null,2,[Yi,g,sh,f+k],null),new u(null,2,[Yi,g+k,sh,
f],null),new u(null,2,[Yi,g+k,sh,d],null),new u(null,2,[Yi,g,sh,d-k],null),new u(null,2,[Yi,e,sh,d-k],null),new u(null,2,[Yi,e-k,sh,d],null)],null)],null),Ai,new W(null,3,5,Z,[hd.j(a,th,"Focus"),hd.j(c,th,"Focus"),b],null)],null)});
oh(Oi,function(a){function b(f){var g=el(f,c);f=el(f,dl(f,new W(null,2,5,Z,[d,e],null)));return hl(g,f)}a=xe(a);var c=H.g(a,Vi),d=H.g(a,xh),e=H.g(a,Ch);return new u(null,3,[Xi,Bc.g(1,Math.abs($k(d,e)))?function(){var f=kl(c,sl(new W(null,2,5,Z,[d,e],null),new W(null,2,5,Z,[c,pl(c,1,0)],null))),g=kl(c,sl(new W(null,2,5,Z,[d,e],null),new W(null,2,5,Z,[c,pl(c,0,1)],null))),k=Se(b,ql(f,1));k=gd(k,0);var l=Se(b,ql(g,1));l=gd(l,0);return new W(null,1,5,Z,[new W(null,4,5,Z,[ll(f,k),f,g,ll(g,l)],null)],null)}():
function(){var f=kl(c,dl(c,new W(null,2,5,Z,[d,e],null))),g=sl(new W(null,2,5,Z,[d,e],null),new W(null,2,5,Z,[c,pl(c,1,1)],null)),k=sl(new W(null,2,5,Z,[d,e],null),new W(null,2,5,Z,[c,pl(c,1,-1)],null)),l=Se(b,ml(c,g));l=gd(l,0);var m=Se(b,ml(c,k));m=gd(m,0);return new W(null,1,5,Z,[new W(null,5,5,Z,[ll(g,l),l,f,m,ll(k,m)],null)],null)}(),Ai,new W(null,3,5,Z,[hd.j(c,th,"Focus"),d,e],null),Bi,new W(null,1,5,Z,[new W(null,2,5,Z,[ll(d,e),ll(e,d)],null)],null)],null)});
oh(si,function(a){function b(m,n){var r=Le.g(Fe(Od,l),ul(m,n));n=gd(r,0);r=gd(r,1);n=Se(function(w){return d(w)&&hl(l,el(m,w))},tl(new W(null,2,5,Z,[pl(m,n,0),pl(m,0,r)],null),nl(f,g)));return new u(null,2,[Xi,new W(null,1,5,Z,[n],null),Ti,Le.g(c,n)],null)}function c(m){return new W(null,2,5,Z,[m,Se(d,ql(m,5))],null)}function d(m){return hl(k,e(m))}function e(m){return Math.abs(el(m,f)-el(m,g))}a=xe(a);var f=H.g(a,Hh),g=H.g(a,Gi);a=H.g(a,vi);var k=e(a),l=(el(f,g)-k)/2;a=new W(null,2,5,Z,[hd.j(f,th,
"Focus"),hd.j(g,th,"Focus")],null);return 0===l?new u(null,2,[Ti,new W(null,2,5,Z,[c(f),c(g)],null),Ai,a],null):ng.v(ad([og.v(ne,ad([b(f,g),b(g,f)])),new u(null,1,[Ai,a],null)]))});
oh(kj,function(a){a=xe(a);var b=H.g(a,oi);a=ng.v;var c=new u(null,1,[Ai,b],null);var d=Vc(b);if(!yd(d))throw Error(["Argument must be an integer: ",G.h(d)].join(""));if(0===(d&1)){d=Vc(b)/2|0;var e=Ed(Le.g(Yi,b));b=Ed(Le.g(sh,b));d=new W(null,2,5,Z,[new u(null,2,[Yi,Wc(e,d-1),sh,Wc(b,d-1)],null),new u(null,2,[Yi,Wc(e,d),sh,Wc(b,d)],null)],null);b=gd(d,0);d=gd(d,1);var f=xe(b);e=H.g(f,Yi);f=H.g(f,sh);var g=xe(d),k=H.g(g,Yi);g=H.g(g,sh);var l=Bc.g(e,k),m=Bc.g(f,g);b=l&&m?new u(null,1,[oi,new W(null,
1,5,Z,[b],null)],null):l||m?new u(null,1,[Xi,new W(null,1,5,Z,[new W(null,2,5,Z,[b,d],null)],null)],null):new u(null,1,[qj,new W(null,1,5,Z,[new W(null,5,5,Z,[new u(null,2,[Yi,e,sh,f],null),new u(null,2,[Yi,e,sh,g],null),new u(null,2,[Yi,k,sh,g],null),new u(null,2,[Yi,k,sh,f],null),new u(null,2,[Yi,e,sh,f],null)],null)],null)],null)}else d=Z,e=Vc(b)/2|0,f=Ed(Le.g(Yi,b)),b=Ed(Le.g(sh,b)),b=new u(null,2,[Yi,Wc(f,e),sh,Wc(b,e)],null),b=new u(null,1,[oi,new W(null,1,5,d,[b],null)],null);return a.call(ng,
ad([c,b]))});function yl(a){a=a.getBoundingClientRect();return new W(null,2,5,Z,[a.width,a.height],null)}function zl(){return document.getElementById("workspace")}function Al(a){var b=zl(),c=a.clientX;a=a.clientY;var d=b.createSVGPoint();d.x=c;d.y=a;return d.matrixTransform(b.getScreenCTM().inverse())}var Bl=Cg(function(a){return a.x},function(a){return a.y});function Cl(a){a=xe(a);a=H.g(a,ji);return Bc.g(Wi,a)}
function Dl(a,b){return new W(null,3,5,Z,[xi,new u(null,1,[Ji,"tools"],null),function(){return function e(d){return new ce(null,function(){for(;;){var f=K(d);if(f){var g=f;if(td(g)){var k=Yb(g),l=Vc(k),m=ge(l);return function(){for(var N=0;;)if(N<l){var Q=bb.g(k,N),T=xe(Q),X=T,U=H.g(T,Uh),p=H.g(T,Ji),x=Bc.g(Ji.h(a),p);je(m,new W(null,4,5,Z,[xi,new u(null,1,[ui,"tool-container"],null),new W(null,3,5,Z,[Mh,new u(null,3,[Ji,["tool-",be(p)].join(""),ui,["tool",x?" selected":null].join(""),ai,function(y,
z,A,B,C){return function(){var D=new W(null,2,5,Z,[Yh,C],null);return b.h?b.h(D):b.call(null,D)}}(N,x,Q,T,X,U,p,k,l,m,g,f)],null),U],null),x?new W(null,3,5,Z,[xi,new u(null,1,[ui,"description"],null),uh.h(X)],null):null],null));N+=1}else return!0}()?ie(m.I(),e(Zb(g))):ie(m.I(),null)}var n=L(g),r=xe(n),w=r,t=H.g(r,Uh),v=H.g(r,Ji),E=Bc.g(Ji.h(a),v);return $c(new W(null,4,5,Z,[xi,new u(null,1,[ui,"tool-container"],null),new W(null,3,5,Z,[Mh,new u(null,3,[Ji,["tool-",be(v)].join(""),ui,["tool",E?" selected":
null].join(""),ai,function(N,Q,T,X){return function(){var U=new W(null,2,5,Z,[Yh,X],null);return b.h?b.h(U):b.call(null,U)}}(E,n,r,w,t,v,g,f)],null),t],null),E?new W(null,3,5,Z,[xi,new u(null,1,[ui,"description"],null),uh.h(w)],null):null],null),e(zc(g)))}return null}},null)}(Xk)}()],null)}
function El(a,b){var c=xe(a);a=H.g(c,hi);var d=H.g(c,fi),e=H.g(c,Eh);c=H.g(c,jj);return new W(null,8,5,Z,[xi,new u(null,1,[Ji,"options"],null),K(a)?new W(null,3,5,Z,[Mh,new u(null,1,[ai,function(){return b.h?b.h(Ci):b.call(null,Ci)}],null),"Undo"],null):null,K(d)?new W(null,3,5,Z,[Mh,new u(null,1,[ai,function(){return b.h?b.h(Oh):b.call(null,Oh)}],null),"Redo"],null):null,F(e)?new W(null,3,5,Z,[Mh,new u(null,1,[ai,function(){var f=new W(null,2,5,Z,[nj,!1],null);return b.h?b.h(f):b.call(null,f)}],
null),"Hide labels"],null):new W(null,3,5,Z,[Mh,new u(null,1,[ai,function(){var f=new W(null,2,5,Z,[nj,!0],null);return b.h?b.h(f):b.call(null,f)}],null),"Show labels"],null),new W(null,3,5,Z,[Mh,new u(null,1,[ai,function(){return b.h?b.h(fj):b.call(null,fj)}],null),"Save Image"],null),new W(null,3,5,Z,[Mh,new u(null,1,[ai,function(){return b.h?b.h(tj):b.call(null,tj)}],null),"Clear Workspace"],null),new W(null,4,5,Z,[xi,new u(null,1,[ui,"widget"],null),"Grid",new W(null,2,5,Z,[$i,new u(null,6,[ji,
"range",Ah,0,Fi,40,ij,5,Wh,c,aj,function(){var f=new W(null,2,5,Z,[Rh,this.value|0],null);return b.h?b.h(f):b.call(null,f)}],null)],null)],null)],null)}
function Fl(a,b){if(F(F(a)?2<b:a)){a=yl(a);var c=gd(a,0),d=gd(a,1);return new W(null,4,5,Z,[yi,new u(null,1,[Ki,"grid"],null),function(){return function g(f){return new ce(null,function(){for(;;){var k=K(f);if(k){if(td(k)){var l=Yb(k),m=Vc(l),n=ge(m);a:for(var r=0;;)if(r<m){var w=bb.g(l,r);n.add(new W(null,2,5,Z,[Di,new u(null,3,[Zi,w,mj,w,cj,"100%"],null)],null));r+=1}else{l=!0;break a}return l?ie(n.I(),g(Zb(k))):ie(n.I(),null)}n=L(k);return $c(new W(null,2,5,Z,[Di,new u(null,3,[Zi,n,mj,n,cj,"100%"],
null)],null),g(zc(k)))}return null}},null)}(Bg(0,c,b))}(),function(){return function g(f){return new ce(null,function(){for(;;){var k=K(f);if(k){if(td(k)){var l=Yb(k),m=Vc(l),n=ge(m);a:for(var r=0;;)if(r<m){var w=bb.g(l,r);n.add(new W(null,2,5,Z,[Di,new u(null,3,[mj,"100%",$h,w,cj,w],null)],null));r+=1}else{l=!0;break a}return l?ie(n.I(),g(Zb(k))):ie(n.I(),null)}n=L(k);return $c(new W(null,2,5,Z,[Di,new u(null,3,[mj,"100%",$h,n,cj,n],null)],null),g(zc(k)))}return null}},null)}(Bg(0,d,b))}()],null)}return null}
function Gl(a,b){var c=xe(b);b=H.g(c,Ji);c=jd.g(c,Ji);c=Zk(function(d){return d instanceof uc?jd.g(a.h?a.h(d):a.call(null,d),Ji):d},c);return hd.j(c,Ji,b)}function Hl(a){var b=gd(a,0);a=gd(a,1);return[G.h(b),",",G.h(a)].join("")}var Il=Cg(Yi,sh);function Jl(a){if(K(a)){var b=G;a=Le.g(Hl,Le.g(Il,a));a=Me(Re.g(new Qe(null,-1,"L",null),a));b=ve(b,"M",a)}else b=null;return b}function Kl(a){return[G.h(Jl(a)),"Z"].join("")}
var Ll=function Ll(a){switch(arguments.length){case 2:return Ll.g(arguments[0],arguments[1]);case 3:return Ll.j(arguments[0],arguments[1],arguments[2]);default:throw Error(["Invalid arity: ",G.h(arguments.length)].join(""));}};Ll.g=function(a,b){return new W(null,2,5,Z,[vh,new u(null,2,[Ki,"stroke",Ui,Jl(new W(null,2,5,Z,[a,ll(a,b)],null))],null)],null)};
Ll.j=function(a,b,c){if(il(a,b,c))a=new W(null,2,5,Z,[vh,new u(null,2,[Ki,"stroke",Ui,Jl(new W(null,2,5,Z,[ll(a,b),ll(a,c)],null))],null)],null);else{var d=Z;b=ll(a,b);c=ll(a,c);var e=Se(ol,ml(b,c));e=gd(e,0);a=new W(null,2,5,d,[vh,new u(null,2,[Ki,"area",Ui,Kl(new W(null,4,5,Z,[a,b,e,c],null))],null)],null)}return a};Ll.K=3;function Ml(a){return new W(null,4,5,Z,[yi,new u(null,1,[Ki,"stroked"],null),a,a],null)}
function Nl(a,b,c){var d=xe(a),e=H.g(d,oi),f=xe(b),g=H.g(f,ji),k=H.g(f,Ji),l=H.g(f,Ih),m=H.g(f,gj),n=wl(function(){var r=new W(null,2,5,Z,[sj,k],null);return c.h?c.h(r):c.call(null,r)});return new W(null,9,5,Z,[yi,new u(null,1,[Ki,[Bc.g(Wi,g)?null:"shape"," ",be(g)," ",F(l)?be(l):null].join("")],null),function(){return function t(w){return new ce(null,function(){for(;;){var v=K(w);if(v){if(td(v)){var E=Yb(v),N=Vc(E),Q=ge(N);a:for(var T=0;;)if(T<N){var X=bb.g(E,T),U=xe(X);X=H.g(U,Yi);var p=H.g(U,sh);
U=H.g(U,Ii);Q.add(Ml(new W(null,3,5,Z,[vj,new u(null,4,[Ki,"label",Yi,X,sh,p,ci,-10],null),U],null)));T+=1}else{E=!0;break a}return E?ie(Q.I(),t(Zb(v))):ie(Q.I(),null)}Q=L(v);N=xe(Q);Q=H.g(N,Yi);E=H.g(N,sh);N=H.g(N,Ii);return $c(Ml(new W(null,3,5,Z,[vj,new u(null,4,[Ki,"label",Yi,Q,sh,E,ci,-10],null),N],null)),t(zc(v)))}return null}},null)}(e)}(),function(){return function t(w){return new ce(null,function(){for(;;){var v=K(w);if(v){if(td(v)){var E=Yb(v),N=Vc(E),Q=ge(N);a:for(var T=0;;)if(T<N){var X=
bb.g(E,T);X=new W(null,2,5,Z,[vh,new u(null,3,[Ki,"area",Ui,Jl(X),Ni,n],null)],null);Q.add(X);T+=1}else{E=!0;break a}return E?ie(Q.I(),t(Zb(v))):ie(Q.I(),null)}Q=L(v);return $c(new W(null,2,5,Z,[vh,new u(null,3,[Ki,"area",Ui,Jl(Q),Ni,n],null)],null),t(zc(v)))}return null}},null)}(d.h?d.h(qj):d.call(null,qj))}(),function(){return function t(w){return new ce(null,function(){for(;;){var v=K(w);if(v){if(td(v)){var E=Yb(v),N=Vc(E),Q=ge(N);a:for(var T=0;;)if(T<N){var X=bb.g(E,T);X=Ze(ue(Ll,Ve(X)),new W(null,
2,5,Z,[1,Ni],null),n);Q.add(X);T+=1}else{E=!0;break a}return E?ie(Q.I(),t(Zb(v))):ie(Q.I(),null)}Q=L(v);return $c(Ze(ue(Ll,Ve(Q)),new W(null,2,5,Z,[1,Ni],null),n),t(zc(v)))}return null}},null)}(d.h?d.h(Ti):d.call(null,Ti))}(),function(){return function t(w){return new ce(null,function(){for(;;){var v=K(w);if(v){if(td(v)){var E=Yb(v),N=Vc(E),Q=ge(N);a:for(var T=0;;)if(T<N){var X=bb.g(E,T);X=new W(null,2,5,Z,[vh,new u(null,3,[Ki,"stroke",Ui,Jl(X),Ni,n],null)],null);Q.add(X);T+=1}else{E=!0;break a}return E?
ie(Q.I(),t(Zb(v))):ie(Q.I(),null)}Q=L(v);return $c(new W(null,2,5,Z,[vh,new u(null,3,[Ki,"stroke",Ui,Jl(Q),Ni,n],null)],null),t(zc(v)))}return null}},null)}(d.h?d.h(Xi):d.call(null,Xi))}(),function(){return function t(w){return new ce(null,function(){for(;;){var v=K(w);if(v){if(td(v)){var E=Yb(v),N=Vc(E),Q=ge(N);a:for(var T=0;;)if(T<N){var X=bb.g(E,T);X=new W(null,2,5,Z,[vh,new u(null,3,[Ki,"stroke",Ui,Kl(X),Ni,n],null)],null);Q.add(X);T+=1}else{E=!0;break a}return E?ie(Q.I(),t(Zb(v))):ie(Q.I(),null)}Q=
L(v);return $c(new W(null,2,5,Z,[vh,new u(null,3,[Ki,"stroke",Ui,Kl(Q),Ni,n],null)],null),t(zc(v)))}return null}},null)}(d.h?d.h(ni):d.call(null,ni))}(),function(){return function t(w){return new ce(null,function(){for(;;){var v=K(w);if(v){var E=v;if(td(E)){var N=Yb(E),Q=Vc(N),T=ge(Q);return function(){for(var z=0;;)if(z<Q){var A=bb.g(N,z),B=xe(A),C=H.g(B,Yi),D=H.g(B,sh),J=H.g(B,li);je(T,new W(null,2,5,Z,[Zh,ng.v(ad([F(J)?new u(null,2,[Ni,wl(function(M,P,R,S,V,Y,da,ia,oa,wa,Ga,fb,cc,Bd,Pc,Zl,$l,am,
bm,Sh){return function(){var Je=new W(null,2,5,Z,[gi,Sh],null);return c.h?c.h(Je):c.call(null,Je)}}(z,A,B,C,D,J,N,Q,T,E,v,n,a,d,d,e,b,f,g,k,l,m)),wh,function(){return function(){return c.h?c.h(di):c.call(null,di)}}(z,A,B,C,D,J,N,Q,T,E,v,n,a,d,d,e,b,f,g,k,l,m)],null):new u(null,1,[Ni,wl(function(M,P,R,S,V,Y,da,ia,oa,wa,Ga,fb,cc,Bd,Pc,Zl,$l,am,bm,Sh){return function(){var Je=new W(null,2,5,Z,[sj,Sh],null);return c.h?c.h(Je):c.call(null,Je)}}(z,A,B,C,D,J,N,Q,T,E,v,n,a,d,d,e,b,f,g,k,l,m))],null),new u(null,
4,[Ki,"area",Bh,5,Hi,C,Li,D],null)]))],null));z+=1}else return!0}()?ie(T.I(),t(Zb(E))):ie(T.I(),null)}var X=L(E),U=xe(X),p=H.g(U,Yi),x=H.g(U,sh),y=H.g(U,li);return $c(new W(null,2,5,Z,[Zh,ng.v(ad([F(y)?new u(null,2,[Ni,wl(function(z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa){return function(){var Ga=new W(null,2,5,Z,[gi,wa],null);return c.h?c.h(Ga):c.call(null,Ga)}}(X,U,p,x,y,E,v,n,a,d,d,e,b,f,g,k,l,m)),wh,function(){return function(){return c.h?c.h(di):c.call(null,di)}}(X,U,p,x,y,E,v,n,a,d,d,e,b,f,g,k,l,
m)],null):new u(null,1,[Ni,wl(function(z,A,B,C,D,J,M,P,R,S,V,Y,da,ia,oa,wa){return function(){var Ga=new W(null,2,5,Z,[sj,wa],null);return c.h?c.h(Ga):c.call(null,Ga)}}(X,U,p,x,y,E,v,n,a,d,d,e,b,f,g,k,l,m))],null),new u(null,4,[Ki,"area",Bh,5,Hi,p,Li,x],null)]))],null),t(zc(E)))}return null}},null)}(e)}(),F(m)?function(){return function t(w){return new ce(null,function(){for(;;){var v=K(w);if(v){if(td(v)){var E=Yb(v),N=Vc(E),Q=ge(N);a:for(var T=0;;)if(T<N){var X=bb.g(E,T),U=xe(X);X=H.g(U,Yi);var p=
H.g(U,sh);U=H.g(U,th);Q.add(new dd(null,Ml(new W(null,3,5,Z,[vj,new u(null,4,[Ki,"role",Yi,X,sh,p,ci,21],null),U],null)),null,1,null));T+=1}else{E=!0;break a}return E?ie(Q.I(),t(Zb(v))):ie(Q.I(),null)}Q=L(v);N=xe(Q);Q=H.g(N,Yi);E=H.g(N,sh);N=H.g(N,th);return $c(new dd(null,Ml(new W(null,3,5,Z,[vj,new u(null,4,[Ki,"role",Yi,Q,sh,E,ci,21],null),N],null)),null,1,null),t(zc(v)))}return null}},null)}(d.h?d.h(Ai):d.call(null,Ai))}():null],null)}
function Ol(a){return function d(c){return new ce(null,function(){for(;;){var e=K(c);if(e){if(td(e)){var f=Yb(e),g=Vc(f),k=ge(g);a:for(var l=0;;)if(l<g){var m=bb.g(f,l);m=new W(null,2,5,Z,[vh,new u(null,2,[Ki,"guide",Ui,Jl(m)],null)],null);k.add(m);l+=1}else{f=!0;break a}return f?ie(k.I(),d(Zb(e))):ie(k.I(),null)}k=L(e);return $c(new W(null,2,5,Z,[vh,new u(null,2,[Ki,"guide",Ui,Jl(k)],null)],null),d(zc(e)))}return null}},null)}(a.h?a.h(Bi):a.call(null,Bi))}
function Pl(a,b){b=xe(b);var c=H.g(b,ji);H.g(b,Ih);return new W(null,3,5,Z,[yi,new u(null,1,[Ki,["highlight ",be(c)].join("")],null),function(){return function f(e){return new ce(null,function(){for(;;){var g=K(e);if(g){if(td(g)){var k=Yb(g),l=Vc(k),m=ge(l);a:for(var n=0;;)if(n<l){var r=bb.g(k,n);r=xe(r);var w=H.g(r,Yi),t=H.g(r,sh);H.g(r,th);m.add(new W(null,2,5,Z,[Zh,new u(null,4,[Ki,"point",Bh,7,Hi,w,Li,t],null)],null));n+=1}else{k=!0;break a}return k?ie(m.I(),f(Zb(g))):ie(m.I(),null)}m=L(g);m=
xe(m);k=H.g(m,Yi);l=H.g(m,sh);H.g(m,th);return $c(new W(null,2,5,Z,[Zh,new u(null,4,[Ki,"point",Bh,7,Hi,k,Li,l],null)],null),f(zc(g)))}return null}},null)}(a.h?a.h(Ai):a.call(null,Ai))}()],null)}
function Ql(a){var b=Ok;a=xe(a);var c=H.g(a,qg),d=H.g(a,Nh);H.g(a,Fh);var e=H.g(a,Yh),f=H.g(a,jj),g=H.g(a,Eh),k=Fe(Bk,b);return new W(null,4,5,Z,[dj,new u(null,1,[ui,F(g)?"labeled":null],null),new W(null,3,5,Z,[Xh,new u(null,1,[ui,"sidebar"],null),new W(null,8,5,Z,[xi,new u(null,1,[ui,"inside"],null),new W(null,3,5,Z,[bj,ye,"Taxicabland"],null),new W(null,3,5,Z,[rj,new u(null,2,[Ji,"explain",oj,"https://en.wikipedia.org/wiki/Taxicab_geometry"],null),"What is taxicab geometry?"],null),new W(null,3,
5,Z,[xi,new u(null,1,[Ji,"tip"],null),"Select shapes to see what points define them."],null),Dl(e,k),El(a,k),new W(null,3,5,Z,[rj,new u(null,2,[Ji,"source",oj,"https://github.com/exupero/taxicabland"],null),"GitHub"],null)],null)],null),new W(null,3,5,Z,[Xh,new u(null,1,[ui,"main"],null),new W(null,3,5,Z,[xi,new u(null,1,[ui,"maximize"],null),new W(null,4,5,Z,[Qi,new u(null,4,[Ji,"workspace",aj,function(l){return F(d)?(l=new W(null,2,5,Z,[ei,Al(l)],null),k.h?k.h(l):k.call(null,l)):null},wh,function(){return k.h?
k.h(di):k.call(null,di)},Ni,function(l){var m=Z;l=Al(l);l=Bl.h?Bl.h(l):Bl.call(null,l);m=new W(null,2,5,m,[Jh,l],null);return k.h?k.h(m):k.call(null,m)}],null),Fl(zl(),f),function(){function l(n){return F(n.h?n.h(Ji):n.call(null,Ji))?Nl(ph.h?ph.h(n):ph.call(null,n),n,k):null}var m=Le.g(Fe(Gl,c),Kf(c));return new dd(null,Le.g(l,Te(gj,Te(Cl,m))),new dd(null,function(){var n=L(Se(gj,m));if(F(n)&&F(n.h?n.h(ji):n.call(null,ji))){var r=ph.h?ph.h(n):ph.call(null,n);return new dd(null,Ol(r),new dd(null,Nl(r,
n,k),new dd(null,Pl(r,n),null,1,null),2,null),3,null)}return null}(),new dd(null,Le.g(l,Se(Cl,m)),null,1,null),2,null),3,null)}()],null)],null)],null)],null)};var Rl={};Ka();
function Sl(a,b){a=xe(a);var c=H.g(a,ki);c=gd(c,0);b=xe(b);var d=H.g(b,Ji);if(null==b)return a;var e;if(e=null==Ye(a,new W(null,2,5,Z,[qg,d],null)))e=xe(b),e=H.g(e,ji),e=!zd(new tg(null,new u(null,5,[Kh,null,Ph,null,bi,null,Di,null,Wi,null],null),null),e);return e?Ze(af(a,ki),new W(null,2,5,Z,[qg,d],null),hd.j(b,Ih,c)):F(Ye(a,new W(null,2,5,Z,[qg,d],null)))?(c=Ye(a,new W(null,3,5,Z,[qg,d,Ih],null)),Ze(a,new W(null,2,5,Z,[qg,d],null),hd.j(b,Ih,c))):Ze(a,new W(null,2,5,Z,[qg,d],null),b)}
function Tl(a,b){a=xe(a);var c=H.g(a,Yh);c=xe(c);c=H.g(c,hj);c=c.h?c.h(b):c.call(null,b);b=gd(c,0);c=gd(c,1);return Sl(Ze(a,new W(null,2,5,Z,[Yh,hj],null),b),c)}function Ul(a,b,c){return hd.v(a,Yi,b,ad([sh,c]))}function Vl(a,b,c){var d=b.h?b.h(a):b.call(null,a),e=pg(a);return bf(hd.j(ng.v(ad([a,null==d?null:vb(d)])),b,null==d?null:wb(d)),c,bd,e)}function Wl(a){return 2>a?Md:function(b){return Math.round(b/a)*a}}
function Xl(a){a=xe(a);var b=H.g(a,Fh);return F(b)?hd.j($e.G(a,new W(null,2,5,Z,[qg,b],null),jd,gj),Fh,null):a}function Yl(a,b,c){return Bc.g(b,c)?a:Ze(hd.j(Xl(a),Fh,b),new W(null,3,5,Z,[qg,b,gj],null),!0)}function cm(a,b,c){var d=Ug("point"),e=Wl(jj.h(a));return Tl(af(hd.j(Sl(Xl(bf(a,hi,bd,pg(a))),new u(null,5,[Ji,d,ji,Wi,Ii,L(a.h?a.h(yh):a.call(null,yh)),Yi,e.h?e.h(b):e.call(null,b),sh,e.h?e.h(c):e.call(null,c)],null)),Nh,d),yh),d)}
function Mk(a,b){try{if(Zd(b,wi))return a;throw Ck;}catch(T){if(T instanceof Error){var c=T;if(c===Ck)try{if(Zd(b,tj))return hd.j(bf(a,hi,bd,pg(a)),qg,ye);throw Ck;}catch(X){if(X instanceof Error)if(c=X,c===Ck)try{if(Zd(b,fj))return saveSvgAsPng(zl(),"taxicab.png",Yg(new u(null,1,[Lh,3],null))),a;throw Ck;}catch(U){if(U instanceof Error)if(c=U,c===Ck)try{if(Zd(b,Ci))return Vl(a,hi,fi);throw Ck;}catch(p){if(p instanceof Error)if(c=p,c===Ck)try{if(Zd(b,Oh))return Vl(a,fi,hi);throw Ck;}catch(x){if(x instanceof
Error)if(c=x,c===Ck)try{if(sd(b)&&2===Vc(b))try{var d=Wc(b,0);if(Zd(d,nj)){var e=Wc(b,1);return hd.j(a,Eh,e)}throw Ck;}catch(y){if(y instanceof Error)if(e=y,e===Ck)try{d=Wc(b,0);if(Zd(d,Rh)){var f=Wc(b,1);return hd.j(a,jj,f)}throw Ck;}catch(z){if(z instanceof Error)if(f=z,f===Ck)try{d=Wc(b,0);if(Zd(d,Yh)){var g=Wc(b,1);return hd.j(a,Yh,g)}throw Ck;}catch(A){if(A instanceof Error){var k=A;if(k===Ck)try{if(d=Wc(b,0),Zd(d,Jh))try{var l=Wc(b,1);if(sd(l)&&2===Vc(l)){var m=Wc(l,0),n=Wc(l,1);return cm(a,
m,n)}throw Ck;}catch(B){if(B instanceof Error){var r=B;if(r===Ck)throw Ck;throw r;}throw B;}else throw Ck;}catch(B){if(B instanceof Error)if(r=B,r===Ck)try{d=Wc(b,0);if(Zd(d,gi)){var w=Wc(b,1);return Tl(hd.j(bf(a,hi,bd,pg(a)),Nh,w),w)}throw Ck;}catch(C){if(C instanceof Error)if(g=C,g===Ck)try{d=Wc(b,0);if(Zd(d,ei)){var t=Wc(b,1),v=Nh.h(a);if(F(v)){var E=Wl(jj.h(a));return $e.P(a,new W(null,2,5,Z,[qg,v],null),Ul,function(){var D=t.x;return E.h?E.h(D):E.call(null,D)}(),function(){var D=t.y;return E.h?
E.h(D):E.call(null,D)}())}return a}throw Ck;}catch(D){if(D instanceof Error){d=D;if(d===Ck)throw Ck;throw d;}throw D;}else throw g;else throw C;}else throw r;else throw B;}else throw k;}else throw A;}else throw f;else throw z;}else throw e;else throw y;}else throw Ck;}catch(y){if(y instanceof Error)if(e=y,e===Ck)try{if(Zd(b,di))return hd.j(a,Nh,null);throw Ck;}catch(z){if(z instanceof Error)if(f=z,f===Ck)try{if(sd(b)&&2===Vc(b))try{var N=Wc(b,0);if(Zd(N,sj)){w=Wc(b,1);var Q=a.h?a.h(Fh):a.call(null,
Fh);return Yl(Xl(a),w,Q)}throw Ck;}catch(A){if(A instanceof Error){k=A;if(k===Ck)throw Ck;throw k;}throw A;}else throw Ck;}catch(A){if(A instanceof Error){k=A;if(k===Ck)throw Error(["No matching clause: ",G.h(b)].join(""));throw k;}throw A;}else throw f;else throw z;}else throw e;else throw y;}else throw c;else throw x;}else throw c;else throw p;}else throw c;else throw U;}else throw c;else throw X;}else throw c;}else throw T;}}var Nk;
a:for(var dm=[yh,Eh,Fh,Nh,Yh,fi,hi,ki,jj,qg],em=[Pe("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),!0,null,null,L(Xk),cd,cd,Pe(Le.g(function(a){return ae.h(["color",G.h(a)].join(""))},Bg(1,10,1))),15,ye],fm=dm.length,gm=0,hm=Rb(Nf);;)if(gm<fm){if(em.length<=gm)throw Error(["No value supplied for key: ",G.h(dm[gm])].join(""));var im=gm+1,jm=Ub(hm,dm[gm],em[gm]);gm=im;hm=jm}else{Nk=Tb(hm);break a}if("undefined"===typeof Pk||"undefined"===typeof Rl||"undefined"===typeof Ok)var Ok=yk(null);
if("undefined"===typeof Pk||"undefined"===typeof Rl||"undefined"===typeof km)var km=Lk();
(function(a,b){var c=yk(1);Wj(function(){var d=function(){function f(g){var k=g[1];return 1===k?(g[2]=null,g[1]=2,ii):2===k?lk(g,4,a):3===k?nk(g,g[2]):4===k?(k=g[2],g[7]=k,g[1]=F(k)?5:6,ii):5===k?(k=g[7],k=b.h?b.h(k):b.call(null,k),g[8]=k,g[2]=null,g[1]=2,ii):6===k?(g[2]=null,g[1]=7,ii):7===k?(g[2]=g[2],g[1]=3,ii):null}return function(){function g(m){for(;;){a:try{for(;;){var n=f(m);if(!Zd(n,ii)){var r=n;break a}}}catch(w){if(w instanceof Object)m[5]=w,pk(m),r=ii;else throw w;}if(!Zd(r,ii))return r}}
function k(){var m=[null,null,null,null,null,null,null,null,null];m[0]=l;m[1]=1;return m}var l=null;l=function(m){switch(arguments.length){case 0:return k.call(this);case 1:return g.call(this,m)}throw Error("Invalid arity: "+arguments.length);};l.B=k;l.h=g;return l}()}(),e=function(){var f=d.B?d.B():d.call(null);f[6]=c;return f}();return kk(e)});return c})(function(a,b){var c=uf(b),d=yk(null),e=Vc(c),f=ke(e),g=yk(1),k=He(null),l=Xe(function(n){return function(r){f[n]=r;return 0===Ke.g(k,Rd)?Bk.g(g,
f.slice(0)):null}},Bg(0,e,1)),m=yk(1);Wj(function(){var n=function(){function w(t){var v=t[1];if(7===v)return t[2]=null,t[1]=8,ii;if(1===v)return t[2]=null,t[1]=2,ii;if(4===v)return v=t[7],t[1]=F(v<e)?6:7,ii;if(15===v)return t[2]=t[2],t[1]=3,ii;if(13===v)return v=Bj(d),t[2]=v,t[1]=15,ii;if(6===v)return t[2]=null,t[1]=11,ii;if(3===v)return nk(t,t[2]);if(12===v){v=t[2];var E=Ce(La,v);t[8]=v;t[1]=F(E)?13:14;return ii}return 2===v?(v=Ie(k,e),t[7]=0,t[9]=v,t[2]=null,t[1]=4,ii):11===v?(v=t[7],t[4]=new ok(10,
Object,null,9,t[4],null,null,null),E=c.h?c.h(v):c.call(null,v),v=l.h?l.h(v):l.call(null,v),v=zk(E,v),t[2]=v,pk(t),ii):9===v?(v=t[7],E=t[2],t[7]=v+1,t[10]=E,t[2]=null,t[1]=4,ii):5===v?(t[11]=t[2],lk(t,12,g)):14===v?(v=t[8],v=ue(a,v),mk(t,d,v)):16===v?(t[12]=t[2],t[2]=null,t[1]=2,ii):10===v?(E=t[2],v=Ke.g(k,Rd),t[13]=E,t[2]=v,pk(t),ii):8===v?(t[2]=t[2],t[1]=5,ii):null}return function(){function t(N){for(;;){a:try{for(;;){var Q=w(N);if(!Zd(Q,ii)){var T=Q;break a}}}catch(X){if(X instanceof Object)N[5]=
X,pk(N),T=ii;else throw X;}if(!Zd(T,ii))return T}}function v(){var N=[null,null,null,null,null,null,null,null,null,null,null,null,null,null];N[0]=E;N[1]=1;return N}var E=null;E=function(N){switch(arguments.length){case 0:return v.call(this);case 1:return t.call(this,N)}throw Error("Invalid arity: "+arguments.length);};E.B=v;E.h=t;return E}()}(),r=function(){var w=n.B?n.B():n.call(null);w[6]=m;return w}();return kk(r)});return d}(function(a){return Ql(a)},new W(null,1,5,Z,[km],null)),function(a){var b=
He(new VDOM.VText("")),c=He(function(){var e=yb(b);return Fk.h?Fk.h(e):Fk.call(null,e)}()),d=null==window.requestAnimationFrame?function(e){return e.B?e.B():e.call(null)}:function(e){return window.requestAnimationFrame(e)};a.appendChild(yb(c));return function(e){function f(){return Ke.j(c,Ek,k)}var g=Jk(e),k=function(){var l=yb(b);return Dk.g?Dk.g(l,g):Dk.call(null,l,g)}();Ie(b,g);return d.h?d.h(f):d.call(null,f)}}(document.body));
if("undefined"===typeof Pk||"undefined"===typeof Rl||"undefined"===typeof lm)var lm=function(){window.onresize=function(){return Bk.g(Ok,wi)};var a=yk(1);Wj(function(){var b=function(){return function(){function d(g){for(;;){a:try{for(;;){var k=g,l=k[1];if(1===l){var m=wk();var n=lk(k,2,m)}else if(2===l){var r=k[2],w=Bk.g(Ok,wi);k[7]=r;n=nk(k,w)}else n=null;if(!Zd(n,ii)){var t=n;break a}}}catch(v){if(v instanceof Object)g[5]=v,pk(g),t=ii;else throw v;}if(!Zd(t,ii))return t}}function e(){var g=[null,
null,null,null,null,null,null,null];g[0]=f;g[1]=1;return g}var f=null;f=function(g){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,g)}throw Error("Invalid arity: "+arguments.length);};f.B=e;f.h=d;return f}()}(),c=function(){var d=b.B?b.B():b.call(null);d[6]=a;return d}();return kk(c)});return a}();