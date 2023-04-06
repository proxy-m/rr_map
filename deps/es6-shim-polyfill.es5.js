/*!
 * @license es6-shim Copyright 2013-2022 by Mikhail B.
 *   and contributors,  MIT License
 * es6-shim-polyfill: v0.57.5
 */


if (!Object.keys) {
        Object.keys = (function() {
            'use strict';
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function(obj) {
                if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                    throw new TypeError('Object.keys called on non-object');
                }

                var result = [], prop, i;

                for (prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) {
                        result.push(prop);
                    }
                }

                if (hasDontEnumBug) {
                    for (i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) {
                            result.push(dontEnums[i]);
                        }
                    }
                }
                return result;
            };
        }());
}

//////////////////////////////////////////////

/* eslint-disable no-underscore-dangle, no-restricted-properties */
/* eslint-disable no-proto */

(function (root, factory) {
    factory();
}(window, function() {
    var call = Function.call;
    var prototypeOfObject = Object.prototype;
    var owns = call.bind(prototypeOfObject.hasOwnProperty);
    var isEnumerable = call.bind(prototypeOfObject.propertyIsEnumerable);
    var toStr = call.bind(prototypeOfObject.toString);

    // If JS engine supports accessors creating shortcuts.
    var defineGetter;
    var defineSetter;
    var lookupGetter;
    var lookupSetter;
    var supportsAccessors = owns(prototypeOfObject, '__defineGetter__');
    if (supportsAccessors) {
        defineGetter = call.bind(prototypeOfObject.__defineGetter__);
        defineSetter = call.bind(prototypeOfObject.__defineSetter__);
        lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
        lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
    }

    var isPrimitive = function isPrimitive(o) {
        return o == null || (typeof o !== 'object' && typeof o !== 'function');
    };

    // ES5 15.2.3.2
    // http://es5.github.com/#x15.2.3.2
    if (!Object.getPrototypeOf) {
        // https://github.com/es-shims/es5-shim/issues#issue/2
        // http://ejohn.org/blog/objectgetprototypeof/
        // recommended by fschaefer on github
        //
        // sure, and webreflection says ^_^
        // ... this will nerever possibly return null
        // ... Opera Mini breaks here with infinite loops
        Object.getPrototypeOf = function getPrototypeOf(object) {
            // eslint-disable-next-line no-proto
            var proto = object.__proto__;
            if (proto || proto === null) {
                return proto;
            } else if (toStr(object.constructor) === '[object Function]') {
                return object.constructor.prototype;
            } else if (object instanceof Object) {
                return prototypeOfObject;
            } else {
                // Correctly return null for Objects created with `Object.create(null)`
                // (shammed or native) or `{ __proto__: null}`.  Also returns null for
                // cross-realm objects on browsers that lack `__proto__` support (like
                // IE <11), but that's the best we can do.
                return null;
            }
        };
    }

    // ES5 15.2.3.3
    // http://es5.github.com/#x15.2.3.3

    var doesGetOwnPropertyDescriptorWork = function doesGetOwnPropertyDescriptorWork(object) {
        try {
            object.sentinel = 0;
            return Object.getOwnPropertyDescriptor(object, 'sentinel').value === 0;
        } catch (exception) {
            return false;
        }
    };

    // check whether getOwnPropertyDescriptor works if it's given. Otherwise, shim partially.
    if (Object.defineProperty) {
        var getOwnPropertyDescriptorWorksOnObject = doesGetOwnPropertyDescriptorWork({});
        var getOwnPropertyDescriptorWorksOnDom = typeof document === 'undefined' ||
        doesGetOwnPropertyDescriptorWork(document.createElement('div'));
        if (!getOwnPropertyDescriptorWorksOnDom || !getOwnPropertyDescriptorWorksOnObject) {
            var getOwnPropertyDescriptorFallback = Object.getOwnPropertyDescriptor;
        }
    }


    if (!Object.getOwnPropertyDescriptor || getOwnPropertyDescriptorFallback) {
        var ERR_NON_OBJECT = 'Object.getOwnPropertyDescriptor called on a non-object: ';

        Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
            if (isPrimitive(object)) {
                throw new TypeError(ERR_NON_OBJECT + object);
            }

            // make a valiant attempt to use the real getOwnPropertyDescriptor
            // for I8's DOM elements.
            if (getOwnPropertyDescriptorFallback) {
                try {
                    return getOwnPropertyDescriptorFallback.call(Object, object, property);
                } catch (exception) {
                    // try the shim if the real one doesn't work
                }
            }

            var descriptor;

            // If object does not owns property return undefined immediately.
            if (!owns(object, property)) {
                return descriptor;
            }

            // If object has a property then it's for sure `configurable`, and
            // probably `enumerable`. Detect enumerability though.
            descriptor = {
                enumerable: isEnumerable(object, property),
                configurable: true
            };

            // If JS engine supports accessor properties then property may be a
            // getter or setter.
            if (supportsAccessors) {
                // Unfortunately `__lookupGetter__` will return a getter even
                // if object has own non getter property along with a same named
                // inherited getter. To avoid misbehavior we temporary remove
                // `__proto__` so that `__lookupGetter__` will return getter only
                // if it's owned by an object.
                var prototype = object.__proto__;
                var notPrototypeOfObject = object !== prototypeOfObject;
                // avoid recursion problem, breaking in Opera Mini when
                // Object.getOwnPropertyDescriptor(Object.prototype, 'toString')
                // or any other Object.prototype accessor
                if (notPrototypeOfObject) {
                    object.__proto__ = prototypeOfObject;
                }

                var getter = lookupGetter(object, property);
                var setter = lookupSetter(object, property);

                if (notPrototypeOfObject) {
                    // Once we have getter and setter we can put values back.
                    object.__proto__ = prototype;
                }

                if (getter || setter) {
                    if (getter) {
                        descriptor.get = getter;
                    }
                    if (setter) {
                        descriptor.set = setter;
                    }
                    // If it was accessor property we're done and return here
                    // in order to avoid adding `value` to the descriptor.
                    return descriptor;
                }
            }

            // If we got this far we know that object has an own property that is
            // not an accessor so we set it as a value and return descriptor.
            descriptor.value = object[property];
            descriptor.writable = true;
            return descriptor;
        };
    }


    // ES5 15.2.3.4
    // http://es5.github.com/#x15.2.3.4
    if (!Object.getOwnPropertyNames) {
        Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
            return Object.keys(object);
        };
    }

    if (!Object.create) {

        // Contributed by Brandon Benvie, October, 2012
        var createEmpty;
        var supportsProto = !({ __proto__: null } instanceof Object);
                            // the following produces false positives
                            // in Opera Mini => not a reliable check
                            // Object.prototype.__proto__ === null
        var shouldUseActiveX = false;

        var getEmptyViaActiveX = function getEmptyViaActiveX() {
            var empty;
            var xDoc;

            xDoc = new ActiveXObject('htmlfile');

            var script = 'script';
            xDoc.write('<' + script + '></' + script + '>');
            xDoc.close();

            empty = xDoc.parentWindow.Object.prototype;
            xDoc = null;

            return empty;
        };

        var getEmptyViaIFrame = function getEmptyViaIFrame() {
            var iframe = document.createElement('iframe');
            var parent = document.body || document.documentElement;
            var empty;

            iframe.style.display = 'none';
            parent.appendChild(iframe);
            // eslint-disable-next-line no-script-url
            iframe.src = 'javascript:';

            empty = iframe.contentWindow.Object.prototype;
            parent.removeChild(iframe);
            iframe = null;

            return empty;
        };

        if (supportsProto || typeof document === 'undefined') { // global document
            createEmpty = function () {
                return { __proto__: null };
            };
        } else {
            // In old IE __proto__ can't be used to manually set `null`, nor does
            // any other method exist to make an object that inherits from nothing,
            // aside from Object.prototype itself. Instead, create a new global
            // object and *steal* its Object.prototype and strip it bare. This is
            // used as the prototype to create nullary objects.
            createEmpty = function () {
                // Determine which approach to use
                // see https://github.com/es-shims/es5-shim/issues/150
                var empty = shouldUseActiveX() ? getEmptyViaActiveX() : getEmptyViaIFrame();

                delete empty.constructor;
                delete empty.hasOwnProperty;
                delete empty.propertyIsEnumerable;
                delete empty.isPrototypeOf;
                delete empty.toLocaleString;
                delete empty.toString;
                delete empty.valueOf;

                var Empty = function Empty() {};
                Empty.prototype = empty;
                // short-circuit future calls
                createEmpty = function () {
                    return new Empty();
                };
                return new Empty();
            };
        }

        Object.create = function create(prototype, properties) {

            var object;
            var Type = function Type() {}; // An empty constructor.

            if (prototype === null) {
                object = createEmpty();
            } else {
                if (prototype !== null && isPrimitive(prototype)) {
                    // In the native implementation `parent` can be `null`
                    // OR *any* `instanceof Object`  (Object|Function|Array|RegExp|etc)
                    // Use `typeof` tho, b/c in old IE, DOM elements are not `instanceof Object`
                    // like they are in modern browsers. Using `Object.create` on DOM elements
                    // is...err...probably inappropriate, but the native version allows for it.
                    throw new TypeError('Object prototype may only be an Object or null'); // same msg as Chrome
                }
                Type.prototype = prototype;
                object = new Type();
                // IE has no built-in implementation of `Object.getPrototypeOf`
                // neither `__proto__`, but this manually setting `__proto__` will
                // guarantee that `Object.getPrototypeOf` will work as expected with
                // objects created using `Object.create`
                // eslint-disable-next-line no-proto
                object.__proto__ = prototype;
            }

            if (properties !== void 0) {
                Object.defineProperties(object, properties);
            }

            return object;
        };
    } else {
        Object.create && function () { // IE9-11 (all IE objects are broken)
            var object = Object.create({});
            object[0] = null;
            return object.hasOwnProperty(0); //→ false in IE9-11
        }() || Object.defineProperty(Object, 'create', function () {
            var ObjectCreate = Object.create;
            var descriptor = Object.getOwnPropertyDescriptor(Object, 'create');
            descriptor.value = function create(prototype, properties) {
                var object = ObjectCreate(prototype, properties);
                if (!Object.prototype.hasOwnProperty.call(object, 0)) {
                    // a numeric key fixes the bug,
                    // it can be removed after,
                    // unlike the alphabetic key
                    Object.defineProperty(object, 0, {
                        configurable: true
                    });
                    delete object[0];
                }
                return object;
            };
            return descriptor;
        }());
    }

    // Patch for WebKit and IE8 standard mode
    // Designed by hax <hax.github.com>
    // related issue: https://github.com/es-shims/es5-shim/issues#issue/5
    // IE8 Reference:
    //     http://msdn.microsoft.com/en-us/library/dd282900.aspx
    //     http://msdn.microsoft.com/en-us/library/dd229916.aspx
    // WebKit Bugs:
    //     https://bugs.webkit.org/show_bug.cgi?id=36423

    var doesDefinePropertyWork = function doesDefinePropertyWork(object) {
        try {
            Object.defineProperty(object, 'sentinel', {});
            return 'sentinel' in object;
        } catch (exception) {
            return false;
        }
    };


    if (Object.defineProperty) {
        var definePropertyWorksOnObject = doesDefinePropertyWork({});
        var definePropertyWorksOnDom = typeof document === 'undefined' ||
            doesDefinePropertyWork(document.createElement('div'));
        if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
            var definePropertyFallback = Object.defineProperty,
                definePropertiesFallback = Object.defineProperties;
        }
    }

    if (!Object.defineProperty || definePropertyFallback) {
        var ERR_NON_OBJECT_DESCRIPTOR = 'Property description must be an object: ';
        var ERR_NON_OBJECT_TARGET = 'Object.defineProperty called on non-object: ';
        var ERR_ACCESSORS_NOT_SUPPORTED = 'getters & setters can not be defined on this javascript engine';

        Object.defineProperty = function defineProperty(object, property, descriptor) {
            if (isPrimitive(object)) {
                throw new TypeError(ERR_NON_OBJECT_TARGET + object);
            }
            if (isPrimitive(descriptor)) {
                throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
            }
            // make a valiant attempt to use the real defineProperty
            // for I8's DOM elements.
            if (definePropertyFallback) {
                try {
                    return definePropertyFallback.call(Object, object, property, descriptor);
                } catch (exception) {
                    // try the shim if the real one doesn't work
                }
            }

            // If it's a data property.
            if ('value' in descriptor) {
                // fail silently if 'writable', 'enumerable', or 'configurable'
                // are requested but not supported

                if (supportsAccessors && (lookupGetter(object, property) || lookupSetter(object, property))) {
                    // As accessors are supported only on engines implementing
                    // `__proto__` we can safely override `__proto__` while defining
                    // a property to make sure that we don't hit an inherited
                    // accessor.
                    var prototype = object.__proto__;
                    object.__proto__ = prototypeOfObject;
                    // Deleting a property anyway since getter / setter may be
                    // defined on object itself.
                    delete object[property];
                    object[property] = descriptor.value;
                    // Setting original `__proto__` back now.
                    object.__proto__ = prototype;
                } else {
                    object[property] = descriptor.value;
                }
            } else {
                var hasGetter = 'get' in descriptor;
                var hasSetter = 'set' in descriptor;
                if (!supportsAccessors && (hasGetter || hasSetter)) {
                    throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
                }
                // If we got that far then getters and setters can be defined !!
                if (hasGetter) {
                    defineGetter(object, property, descriptor.get);
                }
                if (hasSetter) {
                    defineSetter(object, property, descriptor.set);
                }
            }
            return object;
        };
    }

    // ES5 15.2.3.7
    // http://es5.github.com/#x15.2.3.7
    if (!Object.defineProperties || definePropertiesFallback) {
        Object.defineProperties = function defineProperties(object, properties) {
            // make a valiant attempt to use the real defineProperties
            if (definePropertiesFallback) {
                try {
                    return definePropertiesFallback.call(Object, object, properties);
                } catch (exception) {
                    // try the shim if the real one doesn't work
                }
            }

            Object.keys(properties).forEach(function (property) {
                if (property !== '__proto__') {
                    Object.defineProperty(object, property, properties[property]);
                }
            });
            return object;
        };
    }

    // ES5 15.2.3.8
    // http://es5.github.com/#x15.2.3.8
    if (!Object.seal) {
        Object.seal = function seal(object) {
            if (Object(object) !== object) {
                throw new TypeError('Object.seal can only be called on Objects.');
            }
            // this is misleading and breaks feature-detection, but
            // allows "securable" code to "gracefully" degrade to working
            // but insecure code.
            return object;
        };
    }

    // ES5 15.2.3.9
    // http://es5.github.com/#x15.2.3.9
    if (!Object.freeze) {
        Object.freeze = function freeze(object) {
            if (Object(object) !== object) {
                throw new TypeError('Object.freeze can only be called on Objects.');
            }
            return object;
        };
    }

    // detect a Rhino bug and patch it
    try {
        Object.freeze(function () {});
    } catch (exception) {
        Object.freeze = (function (freezeObject) {
            return function freeze(object) {
                if (typeof object === 'function') {
                    return object;
                } else {
                    return freezeObject(object);
                }
            };
        }(Object.freeze));
    }

    // ES5 15.2.3.10
    // http://es5.github.com/#x15.2.3.10
    if (!Object.preventExtensions) {
        Object.preventExtensions = function preventExtensions(object) {
            if (Object(object) !== object) {
                throw new TypeError('Object.preventExtensions can only be called on Objects.');
            }
            return object;
        };
    }

        // ES5 15.2.3.11
    // http://es5.github.com/#x15.2.3.11
    if (!Object.isSealed) {
        Object.isSealed = function isSealed(object) {
            if (Object(object) !== object) {
                throw new TypeError('Object.isSealed can only be called on Objects.');
            }
            return false;
        };
    }

    // ES5 15.2.3.12
    // http://es5.github.com/#x15.2.3.12
    if (!Object.isFrozen) {
        Object.isFrozen = function isFrozen(object) {
            if (Object(object) !== object) {
                throw new TypeError('Object.isFrozen can only be called on Objects.');
            }
            return false;
        };
    }

    // ES5 15.2.3.13
    // http://es5.github.com/#x15.2.3.13
    if (!Object.isExtensible) {
        Object.isExtensible = function isExtensible(object) {
            // 1. If Type(O) is not Object throw a TypeError exception.
            if (Object(object) !== object) {
                throw new TypeError('Object.isExtensible can only be called on Objects.');
            }
            // 2. Return the Boolean value of the [[Extensible]] internal property of O.
            var name = '';
            while (owns(object, name)) {
                name += '?';
            }
            object[name] = true;
            var returnValue = owns(object, name);
            delete object[name];
            return returnValue;
        };
    }

}));


if (!window.Reflect) {
    window.Reflect = {};
    var noSymbolAtAll = !!window.Symbol;
    if (noSymbolAtAll) {
        window.Symbol = {};
    }
    var toStringTag = !!Symbol.toStringTag ? Symbol.toStringTag : null;
    const toStringReflectCorrect = '[object Reflect]';
    Reflect[toStringTag] = 'Reflect';
    if (Reflect.toString() != toStringReflectCorrect) {
        Reflect.toString = function toString () {
            return toStringReflectCorrect;
        }
    }    
    if (noSymbolAtAll) {
        delete window.Symbol;
    }
}
if (!Reflect.ownKeys) {
    const gOPNs = Object.getOwnPropertyNames;
    const gOPSs = Object.getOwnPropertySymbols;
    Reflect.ownKeys = function (object) {
        return gOPNs(object).concat(gOPSs ? gOPSs(object) : []);
    };
}


//--ES6-SHIM-POLYFILL:----------------------------------
const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
const concat = Function.bind.call(Function.call, Array.prototype.concat);
const keys = Reflect.ownKeys;
// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
        padString = String(typeof padString !== 'undefined' ? padString : ' ');
        if (this.length >= targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
}
if (!String.prototype.toProperCase) {
    String.prototype.toProperCase = function() {
        var words = this.split(' ');
        var results = [];
        for (var i=0; i < words.length; i++) {
            var letter = words[i].charAt(0).toUpperCase();
            results.push(letter + words[i].slice(1));
        }
        return results.join(' ');
    };
}
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.lastIndexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}
if (!Object.values) {
	Object.values = function values(O) {
		return reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), []);
	};
}
if (!Object.entries) {
	Object.entries = function entries(O) {
		return reduce(keys(O), (e, k) => concat(e, typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []), []);
	};
}
//--SEE: https://tc39.github.io/ecma262/#sec-array.prototype.findIndex :
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    }
  });
}
if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource !== null && nextSource !== undefined) {
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}
//--:ES6-SHIM-POLYFILL----------------------------------

if (!Object.is) {
  Object.defineProperty(Object, 'is', {
    value: function(x, y) {
      if (x === y) {
        // 0 === -0, but they are not identical
        return x !== 0 || 1 / x === 1 / y;
      }
       
      // NaN !== NaN, but they are identical.
      // NaNs are the only non-reflexive value, i.e., if x !== x,
      // then x is a NaN.
      // isNaN is broken: it converts its argument to number, so
      // isNaN("foo") => true
      return x !== x && y !== y;
    },
    configurable: true,
    enumerable: false,
    writable: true
  });
}

if (!Object.hasOwn) {
    ///console.error('Object.hasOwn is not implemented');
    Object.hasOwn = function hasOwn (O, P) {
        var hasSymbols = typeof Symbol === 'function' && Symbol && typeof Symbol.iterator === 'symbol';
        var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol'; 
        var fnToStr = Function.prototype.toString;
        var toStr = Object.prototype.toString;
        var fnClass = '[object Function]';
        var genClass = '[object GeneratorFunction]';
        var dateClass = '[object Date]';
        var constructorRegex = /^\s*class\b/;
        var getDay = Date.prototype.getDay;
        var isES6ClassFn = function isES6ClassFunction(value) {
	try {
		var fnStr = fnToStr.call(value);
		return constructorRegex.test(fnStr);
	} catch (e) {
		return false; // not a function
	}
};
        var tryDateObject = function tryDateGetDayCall(value) {
	try {
		getDay.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var tryFunctionObject = function tryFunctionToStr(value) {
	try {
		if (isES6ClassFn(value)) { return false; }
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};

        var isPrimitive = function isPrimitive(value) {
            return value === null || (typeof value !== 'function' && typeof value !== 'object');
        };
        var isCallable = function isCallable(value) { // require('is-callable')
            if (!value) { return false; }
            if (typeof value !== 'function' && typeof value !== 'object') { return false; }
            if (typeof value === 'function' && !value.prototype) { return true; }
            if (hasToStringTag) { return tryFunctionObject(value); }
            if (isES6ClassFn(value)) { return false; }
            var strClass = toStr.call(value);
            return strClass === fnClass || strClass === genClass;
        };
        var isDate = function isDateObject(value) { // require('is-date-object')
            if (typeof value !== 'object' || value === null) {
                return false;
            }
            return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
        }; 
        var isSymbol = (!hasSymbols) ? function isSymbol(value) { // require('is-symbol')
            // this environment does not support Symbols.
            return false && value;
        } : function isSymbol(value) {
            const symToStr = Symbol.prototype.toString;
            const symStringRegex = /^Symbol\(.*\)$/;
            const isSymbolObject = function isRealSymbolObject(value) {
                if (typeof value.valueOf() !== 'symbol') {
                    return false;
                }
                return symStringRegex.test(symToStr.call(value));
        	};
            if (typeof value === 'symbol') {
                return true;
    		}
	    	if (toStr.call(value) !== '[object Symbol]') {
		    	return false;
    		}
	    	try {
		    	return isSymbolObject(value);
    		} catch (e) {
	    		return false;
		    }
    	};
        var RequireObjectCoercible = function (value, optMessage) {
        	if (value == null) {
        		throw new $TypeError(optMessage || ('Cannot call method on ' + value));
        	}
        	return value;
        };
        var ToObject = function ToObject(value) {
            RequireObjectCoercible(value);
            return Object.assign({}, value);
        };
        var GetMethod = function GetMethod(O, P) {
	var func = O[P];
	if (func !== null && typeof func !== 'undefined') {
		if (!isCallable(func)) {
			throw new TypeError(func + ' returned for property ' + P + ' of object ' + O + ' is not a function');
		}
		return func;
	}
	return void 0;
};
    var ordinaryToPrimitive = function OrdinaryToPrimitive(O, hint) {
	if (typeof O === 'undefined' || O === null) {
		throw new TypeError('Cannot call method on ' + O);
	}
	if (typeof hint !== 'string' || (hint !== 'number' && hint !== 'string')) {
		throw new TypeError('hint must be "string" or "number"');
	}
	var methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
	var method, result, i;
	for (i = 0; i < methodNames.length; ++i) {
		method = O[methodNames[i]];
		if (isCallable(method)) {
			result = method.call(O);
			if (isPrimitive(result)) {
				return result;
			}
		}
	}
	throw new TypeError('No default value');
};
        var toPrimitive = function toPrimitive(input) { // require('es-to-primitive/es2015') 
	if (isPrimitive(input)) {
		return input;
	}
	var hint = 'default';
	if (arguments.length > 1) {
		if (arguments[1] === String) {
			hint = 'string';
		} else if (arguments[1] === Number) {
			hint = 'number';
		}
	}

	var exoticToPrim;
	if (hasSymbols) {
		if (Symbol.toPrimitive) {
			exoticToPrim = GetMethod(input, Symbol.toPrimitive);
		} else if (isSymbol(input)) {
			exoticToPrim = Symbol.prototype.valueOf;
		}
	}
	if (typeof exoticToPrim !== 'undefined') {
		var result = exoticToPrim.call(input, hint);
		if (isPrimitive(result)) {
			return result;
		}
		throw new TypeError('unable to convert exotic object to primitive');
	}
	if (hint === 'default' && (isDate(input) || isSymbol(input))) {
		hint = 'string';
	}
	return ordinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
};

	var isObject = function (A) {
		return ( (typeof A === "object" || typeof A === 'function') && (A !== null) );
	};
   
	var ToPrimitive = function(it){
		var fn, val;
		if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
		if(typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
		throw TypeError("Can't convert object to number");
	};
	
	function ToPropertyKey(argument) {
		var key = ToPrimitive(argument/*, $String*/);
		return typeof key === 'symbol' ? key : /*ToString*/''+(key);
	};
		return Object.hasOwnProperty.call(ToObject(O), ToPropertyKey(P));
	}
}

if (!Object.fromEntries) {
  Object.defineProperty(Object, 'fromEntries', {
    value(entries) {
      if (!entries) { throw new Error('Object.fromEntries() requires a single iterable argument'); } // || !entries[Symbol.iterator]
      const obj = {};
      var pair;
      for (pair of entries) {
        if (Object(pair) !== pair) {
          throw new TypeError('iterable for fromEntries should yield objects');
        }
        const {'0': key, '1': val} = pair; // Consistency with Map: contract is that entry has "0" and "1" keys, not that it is an array or iterable.
        Object.defineProperty(obj, key, {
          configurable: true,
          enumerable: true,
          writable: true,
          value: val,
        });
      }
      return obj;
    },
  });
}

if (typeof globalThis === 'undefined') {
	globalThis = function () {
		if (typeof self !== 'undefined') {
			return self;
		} else if (typeof window !== 'undefined') {
			return window;
		} else {
			return Function('return this')();
		}
	}();
}


//////////////////////////////////////////////
//REGERATOR-RUNTIME///////////////////////////
//////////////////////////////////////////////

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; };
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) });

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: true });
  defineProperty(
    GeneratorFunctionPrototype,
    "constructor",
    { value: GeneratorFunction, configurable: true }
  );
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    defineProperty(this, "_invoke", { value: enqueue });
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method;
    var method = delegate.iterator[methodName];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method, or a missing .next mehtod, always terminate the
      // yield* loop.
      context.delegate = null;

      // Note: ["return"] must be used for ES3 parsing compatibility.
      if (methodName === "throw" && delegate.iterator["return"]) {
        // If the delegate iterator has a return method, give it a
        // chance to clean up.
        context.method = "return";
        context.arg = undefined;
        maybeInvokeDelegate(delegate, context);

        if (context.method === "throw") {
          // If maybeInvokeDelegate(context) changed context.method from
          // "return" to "throw", let that override the TypeError below.
          return ContinueSentinel;
        }
      }
      if (methodName !== "return") {
        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a '" + methodName + "' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(val) {
    var object = Object(val);
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}
