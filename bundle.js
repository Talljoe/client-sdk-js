/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../node_modules/@protobufjs/aspromise/index.js":
/*!******************************************************!*\
  !*** ../node_modules/@protobufjs/aspromise/index.js ***!
  \******************************************************/
/***/ ((module) => {

"use strict";

module.exports = asPromise;

/**
 * Callback as used by {@link util.asPromise}.
 * @typedef asPromiseCallback
 * @type {function}
 * @param {Error|null} error Error, if any
 * @param {...*} params Additional arguments
 * @returns {undefined}
 */

/**
 * Returns a promise from a node-style callback function.
 * @memberof util
 * @param {asPromiseCallback} fn Function to call
 * @param {*} ctx Function context
 * @param {...*} params Function arguments
 * @returns {Promise<*>} Promisified function
 */
function asPromise(fn, ctx/*, varargs */) {
    var params  = new Array(arguments.length - 1),
        offset  = 0,
        index   = 2,
        pending = true;
    while (index < arguments.length)
        params[offset++] = arguments[index++];
    return new Promise(function executor(resolve, reject) {
        params[offset] = function callback(err/*, varargs */) {
            if (pending) {
                pending = false;
                if (err)
                    reject(err);
                else {
                    var params = new Array(arguments.length - 1),
                        offset = 0;
                    while (offset < params.length)
                        params[offset++] = arguments[offset];
                    resolve.apply(null, params);
                }
            }
        };
        try {
            fn.apply(ctx || null, params);
        } catch (err) {
            if (pending) {
                pending = false;
                reject(err);
            }
        }
    });
}


/***/ }),

/***/ "../node_modules/@protobufjs/base64/index.js":
/*!***************************************************!*\
  !*** ../node_modules/@protobufjs/base64/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * A minimal base64 implementation for number arrays.
 * @memberof util
 * @namespace
 */
var base64 = exports;

/**
 * Calculates the byte length of a base64 encoded string.
 * @param {string} string Base64 encoded string
 * @returns {number} Byte length
 */
base64.length = function length(string) {
    var p = string.length;
    if (!p)
        return 0;
    var n = 0;
    while (--p % 4 > 1 && string.charAt(p) === "=")
        ++n;
    return Math.ceil(string.length * 3) / 4 - n;
};

// Base64 encoding table
var b64 = new Array(64);

// Base64 decoding table
var s64 = new Array(123);

// 65..90, 97..122, 48..57, 43, 47
for (var i = 0; i < 64;)
    s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;

/**
 * Encodes a buffer to a base64 encoded string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} Base64 encoded string
 */
base64.encode = function encode(buffer, start, end) {
    var parts = null,
        chunk = [];
    var i = 0, // output index
        j = 0, // goto index
        t;     // temporary
    while (start < end) {
        var b = buffer[start++];
        switch (j) {
            case 0:
                chunk[i++] = b64[b >> 2];
                t = (b & 3) << 4;
                j = 1;
                break;
            case 1:
                chunk[i++] = b64[t | b >> 4];
                t = (b & 15) << 2;
                j = 2;
                break;
            case 2:
                chunk[i++] = b64[t | b >> 6];
                chunk[i++] = b64[b & 63];
                j = 0;
                break;
        }
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (j) {
        chunk[i++] = b64[t];
        chunk[i++] = 61;
        if (j === 1)
            chunk[i++] = 61;
    }
    if (parts) {
        if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};

var invalidEncoding = "invalid encoding";

/**
 * Decodes a base64 encoded string to a buffer.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Number of bytes written
 * @throws {Error} If encoding is invalid
 */
base64.decode = function decode(string, buffer, offset) {
    var start = offset;
    var j = 0, // goto index
        t;     // temporary
    for (var i = 0; i < string.length;) {
        var c = string.charCodeAt(i++);
        if (c === 61 && j > 1)
            break;
        if ((c = s64[c]) === undefined)
            throw Error(invalidEncoding);
        switch (j) {
            case 0:
                t = c;
                j = 1;
                break;
            case 1:
                buffer[offset++] = t << 2 | (c & 48) >> 4;
                t = c;
                j = 2;
                break;
            case 2:
                buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
                t = c;
                j = 3;
                break;
            case 3:
                buffer[offset++] = (t & 3) << 6 | c;
                j = 0;
                break;
        }
    }
    if (j === 1)
        throw Error(invalidEncoding);
    return offset - start;
};

/**
 * Tests if the specified string appears to be base64 encoded.
 * @param {string} string String to test
 * @returns {boolean} `true` if probably base64 encoded, otherwise false
 */
base64.test = function test(string) {
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
};


/***/ }),

/***/ "../node_modules/@protobufjs/eventemitter/index.js":
/*!*********************************************************!*\
  !*** ../node_modules/@protobufjs/eventemitter/index.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";

module.exports = EventEmitter;

/**
 * Constructs a new event emitter instance.
 * @classdesc A minimal event emitter.
 * @memberof util
 * @constructor
 */
function EventEmitter() {

    /**
     * Registered listeners.
     * @type {Object.<string,*>}
     * @private
     */
    this._listeners = {};
}

/**
 * Registers an event listener.
 * @param {string} evt Event name
 * @param {function} fn Listener
 * @param {*} [ctx] Listener context
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.on = function on(evt, fn, ctx) {
    (this._listeners[evt] || (this._listeners[evt] = [])).push({
        fn  : fn,
        ctx : ctx || this
    });
    return this;
};

/**
 * Removes an event listener or any matching listeners if arguments are omitted.
 * @param {string} [evt] Event name. Removes all listeners if omitted.
 * @param {function} [fn] Listener to remove. Removes all listeners of `evt` if omitted.
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.off = function off(evt, fn) {
    if (evt === undefined)
        this._listeners = {};
    else {
        if (fn === undefined)
            this._listeners[evt] = [];
        else {
            var listeners = this._listeners[evt];
            for (var i = 0; i < listeners.length;)
                if (listeners[i].fn === fn)
                    listeners.splice(i, 1);
                else
                    ++i;
        }
    }
    return this;
};

/**
 * Emits an event by calling its listeners with the specified arguments.
 * @param {string} evt Event name
 * @param {...*} args Arguments
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.emit = function emit(evt) {
    var listeners = this._listeners[evt];
    if (listeners) {
        var args = [],
            i = 1;
        for (; i < arguments.length;)
            args.push(arguments[i++]);
        for (i = 0; i < listeners.length;)
            listeners[i].fn.apply(listeners[i++].ctx, args);
    }
    return this;
};


/***/ }),

/***/ "../node_modules/@protobufjs/float/index.js":
/*!**************************************************!*\
  !*** ../node_modules/@protobufjs/float/index.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


module.exports = factory(factory);

/**
 * Reads / writes floats / doubles from / to buffers.
 * @name util.float
 * @namespace
 */

/**
 * Writes a 32 bit float to a buffer using little endian byte order.
 * @name util.float.writeFloatLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Writes a 32 bit float to a buffer using big endian byte order.
 * @name util.float.writeFloatBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Reads a 32 bit float from a buffer using little endian byte order.
 * @name util.float.readFloatLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Reads a 32 bit float from a buffer using big endian byte order.
 * @name util.float.readFloatBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Writes a 64 bit double to a buffer using little endian byte order.
 * @name util.float.writeDoubleLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Writes a 64 bit double to a buffer using big endian byte order.
 * @name util.float.writeDoubleBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Reads a 64 bit double from a buffer using little endian byte order.
 * @name util.float.readDoubleLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Reads a 64 bit double from a buffer using big endian byte order.
 * @name util.float.readDoubleBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

// Factory function for the purpose of node-based testing in modified global environments
function factory(exports) {

    // float: typed array
    if (typeof Float32Array !== "undefined") (function() {

        var f32 = new Float32Array([ -0 ]),
            f8b = new Uint8Array(f32.buffer),
            le  = f8b[3] === 128;

        function writeFloat_f32_cpy(val, buf, pos) {
            f32[0] = val;
            buf[pos    ] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
        }

        function writeFloat_f32_rev(val, buf, pos) {
            f32[0] = val;
            buf[pos    ] = f8b[3];
            buf[pos + 1] = f8b[2];
            buf[pos + 2] = f8b[1];
            buf[pos + 3] = f8b[0];
        }

        /* istanbul ignore next */
        exports.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
        /* istanbul ignore next */
        exports.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;

        function readFloat_f32_cpy(buf, pos) {
            f8b[0] = buf[pos    ];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            return f32[0];
        }

        function readFloat_f32_rev(buf, pos) {
            f8b[3] = buf[pos    ];
            f8b[2] = buf[pos + 1];
            f8b[1] = buf[pos + 2];
            f8b[0] = buf[pos + 3];
            return f32[0];
        }

        /* istanbul ignore next */
        exports.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
        /* istanbul ignore next */
        exports.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;

    // float: ieee754
    })(); else (function() {

        function writeFloat_ieee754(writeUint, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
                val = -val;
            if (val === 0)
                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos);
            else if (isNaN(val))
                writeUint(2143289344, buf, pos);
            else if (val > 3.4028234663852886e+38) // +-Infinity
                writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
            else if (val < 1.1754943508222875e-38) // denormal
                writeUint((sign << 31 | Math.round(val / 1.401298464324817e-45)) >>> 0, buf, pos);
            else {
                var exponent = Math.floor(Math.log(val) / Math.LN2),
                    mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
                writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
            }
        }

        exports.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
        exports.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);

        function readFloat_ieee754(readUint, buf, pos) {
            var uint = readUint(buf, pos),
                sign = (uint >> 31) * 2 + 1,
                exponent = uint >>> 23 & 255,
                mantissa = uint & 8388607;
            return exponent === 255
                ? mantissa
                ? NaN
                : sign * Infinity
                : exponent === 0 // denormal
                ? sign * 1.401298464324817e-45 * mantissa
                : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
        }

        exports.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
        exports.readFloatBE = readFloat_ieee754.bind(null, readUintBE);

    })();

    // double: typed array
    if (typeof Float64Array !== "undefined") (function() {

        var f64 = new Float64Array([-0]),
            f8b = new Uint8Array(f64.buffer),
            le  = f8b[7] === 128;

        function writeDouble_f64_cpy(val, buf, pos) {
            f64[0] = val;
            buf[pos    ] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
            buf[pos + 4] = f8b[4];
            buf[pos + 5] = f8b[5];
            buf[pos + 6] = f8b[6];
            buf[pos + 7] = f8b[7];
        }

        function writeDouble_f64_rev(val, buf, pos) {
            f64[0] = val;
            buf[pos    ] = f8b[7];
            buf[pos + 1] = f8b[6];
            buf[pos + 2] = f8b[5];
            buf[pos + 3] = f8b[4];
            buf[pos + 4] = f8b[3];
            buf[pos + 5] = f8b[2];
            buf[pos + 6] = f8b[1];
            buf[pos + 7] = f8b[0];
        }

        /* istanbul ignore next */
        exports.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
        /* istanbul ignore next */
        exports.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;

        function readDouble_f64_cpy(buf, pos) {
            f8b[0] = buf[pos    ];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            f8b[4] = buf[pos + 4];
            f8b[5] = buf[pos + 5];
            f8b[6] = buf[pos + 6];
            f8b[7] = buf[pos + 7];
            return f64[0];
        }

        function readDouble_f64_rev(buf, pos) {
            f8b[7] = buf[pos    ];
            f8b[6] = buf[pos + 1];
            f8b[5] = buf[pos + 2];
            f8b[4] = buf[pos + 3];
            f8b[3] = buf[pos + 4];
            f8b[2] = buf[pos + 5];
            f8b[1] = buf[pos + 6];
            f8b[0] = buf[pos + 7];
            return f64[0];
        }

        /* istanbul ignore next */
        exports.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
        /* istanbul ignore next */
        exports.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;

    // double: ieee754
    })(); else (function() {

        function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
                val = -val;
            if (val === 0) {
                writeUint(0, buf, pos + off0);
                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos + off1);
            } else if (isNaN(val)) {
                writeUint(0, buf, pos + off0);
                writeUint(2146959360, buf, pos + off1);
            } else if (val > 1.7976931348623157e+308) { // +-Infinity
                writeUint(0, buf, pos + off0);
                writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
            } else {
                var mantissa;
                if (val < 2.2250738585072014e-308) { // denormal
                    mantissa = val / 5e-324;
                    writeUint(mantissa >>> 0, buf, pos + off0);
                    writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
                } else {
                    var exponent = Math.floor(Math.log(val) / Math.LN2);
                    if (exponent === 1024)
                        exponent = 1023;
                    mantissa = val * Math.pow(2, -exponent);
                    writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
                    writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
                }
            }
        }

        exports.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
        exports.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);

        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
            var lo = readUint(buf, pos + off0),
                hi = readUint(buf, pos + off1);
            var sign = (hi >> 31) * 2 + 1,
                exponent = hi >>> 20 & 2047,
                mantissa = 4294967296 * (hi & 1048575) + lo;
            return exponent === 2047
                ? mantissa
                ? NaN
                : sign * Infinity
                : exponent === 0 // denormal
                ? sign * 5e-324 * mantissa
                : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
        }

        exports.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
        exports.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);

    })();

    return exports;
}

// uint helpers

function writeUintLE(val, buf, pos) {
    buf[pos    ] =  val        & 255;
    buf[pos + 1] =  val >>> 8  & 255;
    buf[pos + 2] =  val >>> 16 & 255;
    buf[pos + 3] =  val >>> 24;
}

function writeUintBE(val, buf, pos) {
    buf[pos    ] =  val >>> 24;
    buf[pos + 1] =  val >>> 16 & 255;
    buf[pos + 2] =  val >>> 8  & 255;
    buf[pos + 3] =  val        & 255;
}

function readUintLE(buf, pos) {
    return (buf[pos    ]
          | buf[pos + 1] << 8
          | buf[pos + 2] << 16
          | buf[pos + 3] << 24) >>> 0;
}

function readUintBE(buf, pos) {
    return (buf[pos    ] << 24
          | buf[pos + 1] << 16
          | buf[pos + 2] << 8
          | buf[pos + 3]) >>> 0;
}


/***/ }),

/***/ "../node_modules/@protobufjs/inquire/index.js":
/*!****************************************************!*\
  !*** ../node_modules/@protobufjs/inquire/index.js ***!
  \****************************************************/
/***/ ((module) => {

"use strict";

module.exports = inquire;

/**
 * Requires a module only if available.
 * @memberof util
 * @param {string} moduleName Module to require
 * @returns {?Object} Required module if available and not empty, otherwise `null`
 */
function inquire(moduleName) {
    try {
        var mod = eval("quire".replace(/^/,"re"))(moduleName); // eslint-disable-line no-eval
        if (mod && (mod.length || Object.keys(mod).length))
            return mod;
    } catch (e) {} // eslint-disable-line no-empty
    return null;
}


/***/ }),

/***/ "../node_modules/@protobufjs/pool/index.js":
/*!*************************************************!*\
  !*** ../node_modules/@protobufjs/pool/index.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";

module.exports = pool;

/**
 * An allocator as used by {@link util.pool}.
 * @typedef PoolAllocator
 * @type {function}
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */

/**
 * A slicer as used by {@link util.pool}.
 * @typedef PoolSlicer
 * @type {function}
 * @param {number} start Start offset
 * @param {number} end End offset
 * @returns {Uint8Array} Buffer slice
 * @this {Uint8Array}
 */

/**
 * A general purpose buffer pool.
 * @memberof util
 * @function
 * @param {PoolAllocator} alloc Allocator
 * @param {PoolSlicer} slice Slicer
 * @param {number} [size=8192] Slab size
 * @returns {PoolAllocator} Pooled allocator
 */
function pool(alloc, slice, size) {
    var SIZE   = size || 8192;
    var MAX    = SIZE >>> 1;
    var slab   = null;
    var offset = SIZE;
    return function pool_alloc(size) {
        if (size < 1 || size > MAX)
            return alloc(size);
        if (offset + size > SIZE) {
            slab = alloc(SIZE);
            offset = 0;
        }
        var buf = slice.call(slab, offset, offset += size);
        if (offset & 7) // align to 32 bit
            offset = (offset | 7) + 1;
        return buf;
    };
}


/***/ }),

/***/ "../node_modules/@protobufjs/utf8/index.js":
/*!*************************************************!*\
  !*** ../node_modules/@protobufjs/utf8/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * A minimal UTF8 implementation for number arrays.
 * @memberof util
 * @namespace
 */
var utf8 = exports;

/**
 * Calculates the UTF8 byte length of a string.
 * @param {string} string String
 * @returns {number} Byte length
 */
utf8.length = function utf8_length(string) {
    var len = 0,
        c = 0;
    for (var i = 0; i < string.length; ++i) {
        c = string.charCodeAt(i);
        if (c < 128)
            len += 1;
        else if (c < 2048)
            len += 2;
        else if ((c & 0xFC00) === 0xD800 && (string.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
            ++i;
            len += 4;
        } else
            len += 3;
    }
    return len;
};

/**
 * Reads UTF8 bytes as a string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} String read
 */
utf8.read = function utf8_read(buffer, start, end) {
    var len = end - start;
    if (len < 1)
        return "";
    var parts = null,
        chunk = [],
        i = 0, // char offset
        t;     // temporary
    while (start < end) {
        t = buffer[start++];
        if (t < 128)
            chunk[i++] = t;
        else if (t > 191 && t < 224)
            chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
        else if (t > 239 && t < 365) {
            t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 0x10000;
            chunk[i++] = 0xD800 + (t >> 10);
            chunk[i++] = 0xDC00 + (t & 1023);
        } else
            chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (parts) {
        if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};

/**
 * Writes a string as UTF8 bytes.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Bytes written
 */
utf8.write = function utf8_write(string, buffer, offset) {
    var start = offset,
        c1, // character 1
        c2; // character 2
    for (var i = 0; i < string.length; ++i) {
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
            buffer[offset++] = c1;
        } else if (c1 < 2048) {
            buffer[offset++] = c1 >> 6       | 192;
            buffer[offset++] = c1       & 63 | 128;
        } else if ((c1 & 0xFC00) === 0xD800 && ((c2 = string.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
            c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
            ++i;
            buffer[offset++] = c1 >> 18      | 240;
            buffer[offset++] = c1 >> 12 & 63 | 128;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        } else {
            buffer[offset++] = c1 >> 12      | 224;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        }
    }
    return offset - start;
};


/***/ }),

/***/ "../node_modules/events/events.js":
/*!****************************************!*\
  !*** ../node_modules/events/events.js ***!
  \****************************************/
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "../node_modules/loglevel/lib/loglevel.js":
/*!************************************************!*\
  !*** ../node_modules/loglevel/lib/loglevel.js ***!
  \************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
    "use strict";
    if (true) {
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function () {
    "use strict";

    // Slightly dubious tricks to cut down minimized file size
    var noop = function() {};
    var undefinedType = "undefined";
    var isIE = (typeof window !== undefinedType) && (typeof window.navigator !== undefinedType) && (
        /Trident\/|MSIE /.test(window.navigator.userAgent)
    );

    var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
    ];

    // Cross-browser bind equivalent that works at least back to IE6
    function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === 'function') {
            return method.bind(obj);
        } else {
            try {
                return Function.prototype.bind.call(method, obj);
            } catch (e) {
                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
                return function() {
                    return Function.prototype.apply.apply(method, [obj, arguments]);
                };
            }
        }
    }

    // Trace() doesn't print the message in IE, so for that case we need to wrap it
    function traceForIE() {
        if (console.log) {
            if (console.log.apply) {
                console.log.apply(console, arguments);
            } else {
                // In old IE, native console methods themselves don't have apply().
                Function.prototype.apply.apply(console.log, [console, arguments]);
            }
        }
        if (console.trace) console.trace();
    }

    // Build the best logging method possible for this env
    // Wherever possible we want to bind, not wrap, to preserve stack traces
    function realMethod(methodName) {
        if (methodName === 'debug') {
            methodName = 'log';
        }

        if (typeof console === undefinedType) {
            return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
        } else if (methodName === 'trace' && isIE) {
            return traceForIE;
        } else if (console[methodName] !== undefined) {
            return bindMethod(console, methodName);
        } else if (console.log !== undefined) {
            return bindMethod(console, 'log');
        } else {
            return noop;
        }
    }

    // These private functions always need `this` to be set properly

    function replaceLoggingMethods(level, loggerName) {
        /*jshint validthis:true */
        for (var i = 0; i < logMethods.length; i++) {
            var methodName = logMethods[i];
            this[methodName] = (i < level) ?
                noop :
                this.methodFactory(methodName, level, loggerName);
        }

        // Define log.log as an alias for log.debug
        this.log = this.debug;
    }

    // In old IE versions, the console isn't present until you first open it.
    // We build realMethod() replacements here that regenerate logging methods
    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
        return function () {
            if (typeof console !== undefinedType) {
                replaceLoggingMethods.call(this, level, loggerName);
                this[methodName].apply(this, arguments);
            }
        };
    }

    // By default, we use closely bound real methods wherever possible, and
    // otherwise we wait for a console to appear, and then try again.
    function defaultMethodFactory(methodName, level, loggerName) {
        /*jshint validthis:true */
        return realMethod(methodName) ||
               enableLoggingWhenConsoleArrives.apply(this, arguments);
    }

    function Logger(name, defaultLevel, factory) {
      var self = this;
      var currentLevel;

      var storageKey = "loglevel";
      if (typeof name === "string") {
        storageKey += ":" + name;
      } else if (typeof name === "symbol") {
        storageKey = undefined;
      }

      function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

          if (typeof window === undefinedType || !storageKey) return;

          // Use localStorage if available
          try {
              window.localStorage[storageKey] = levelName;
              return;
          } catch (ignore) {}

          // Use session cookie as fallback
          try {
              window.document.cookie =
                encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {}
      }

      function getPersistedLevel() {
          var storedLevel;

          if (typeof window === undefinedType || !storageKey) return;

          try {
              storedLevel = window.localStorage[storageKey];
          } catch (ignore) {}

          // Fallback to cookies if local storage gives us nothing
          if (typeof storedLevel === undefinedType) {
              try {
                  var cookie = window.document.cookie;
                  var location = cookie.indexOf(
                      encodeURIComponent(storageKey) + "=");
                  if (location !== -1) {
                      storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
                  }
              } catch (ignore) {}
          }

          // If the stored level is not valid, treat it as if nothing was stored.
          if (self.levels[storedLevel] === undefined) {
              storedLevel = undefined;
          }

          return storedLevel;
      }

      /*
       *
       * Public logger API - see https://github.com/pimterry/loglevel for details
       *
       */

      self.name = name;

      self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
          "ERROR": 4, "SILENT": 5};

      self.methodFactory = factory || defaultMethodFactory;

      self.getLevel = function () {
          return currentLevel;
      };

      self.setLevel = function (level, persist) {
          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
              level = self.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
              currentLevel = level;
              if (persist !== false) {  // defaults to true
                  persistLevelIfPossible(level);
              }
              replaceLoggingMethods.call(self, level, name);
              if (typeof console === undefinedType && level < self.levels.SILENT) {
                  return "No console available for logging";
              }
          } else {
              throw "log.setLevel() called with invalid level: " + level;
          }
      };

      self.setDefaultLevel = function (level) {
          if (!getPersistedLevel()) {
              self.setLevel(level, false);
          }
      };

      self.enableAll = function(persist) {
          self.setLevel(self.levels.TRACE, persist);
      };

      self.disableAll = function(persist) {
          self.setLevel(self.levels.SILENT, persist);
      };

      // Initialize with the right level
      var initialLevel = getPersistedLevel();
      if (initialLevel == null) {
          initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
      }
      self.setLevel(initialLevel, false);
    }

    /*
     *
     * Top-level API
     *
     */

    var defaultLogger = new Logger();

    var _loggersByName = {};
    defaultLogger.getLogger = function getLogger(name) {
        if ((typeof name !== "symbol" && typeof name !== "string") || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }

        var logger = _loggersByName[name];
        if (!logger) {
          logger = _loggersByName[name] = new Logger(
            name, defaultLogger.getLevel(), defaultLogger.methodFactory);
        }
        return logger;
    };

    // Grab the current global log variable in case of overwrite
    var _log = (typeof window !== undefinedType) ? window.log : undefined;
    defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType &&
               window.log === defaultLogger) {
            window.log = _log;
        }

        return defaultLogger;
    };

    defaultLogger.getLoggers = function getLoggers() {
        return _loggersByName;
    };

    // ES6 default export, for compatibility
    defaultLogger['default'] = defaultLogger;

    return defaultLogger;
}));


/***/ }),

/***/ "../node_modules/long/src/long.js":
/*!****************************************!*\
  !*** ../node_modules/long/src/long.js ***!
  \****************************************/
/***/ ((module) => {

module.exports = Long;

/**
 * wasm optimizations, to do native i64 multiplication and divide
 */
var wasm = null;

try {
  wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
    0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11
  ])), {}).exports;
} catch (e) {
  // no wasm support :(
}

/**
 * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
 *  See the from* functions below for more convenient ways of constructing Longs.
 * @exports Long
 * @class A Long class for representing a 64 bit two's-complement integer value.
 * @param {number} low The low (signed) 32 bits of the long
 * @param {number} high The high (signed) 32 bits of the long
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @constructor
 */
function Long(low, high, unsigned) {

    /**
     * The low 32 bits as a signed value.
     * @type {number}
     */
    this.low = low | 0;

    /**
     * The high 32 bits as a signed value.
     * @type {number}
     */
    this.high = high | 0;

    /**
     * Whether unsigned or not.
     * @type {boolean}
     */
    this.unsigned = !!unsigned;
}

// The internal representation of a long is the two given signed, 32-bit values.
// We use 32-bit pieces because these are the size of integers on which
// Javascript performs bit-operations.  For operations like addition and
// multiplication, we split each number into 16 bit pieces, which can easily be
// multiplied within Javascript's floating-point representation without overflow
// or change in sign.
//
// In the algorithms below, we frequently reduce the negative case to the
// positive case by negating the input(s) and then post-processing the result.
// Note that we must ALWAYS check specially whether those values are MIN_VALUE
// (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
// a positive number, it overflows back into a negative).  Not handling this
// case would often result in infinite recursion.
//
// Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
// methods on which they depend.

/**
 * An indicator used to reliably determine if an object is a Long or not.
 * @type {boolean}
 * @const
 * @private
 */
Long.prototype.__isLong__;

Object.defineProperty(Long.prototype, "__isLong__", { value: true });

/**
 * @function
 * @param {*} obj Object
 * @returns {boolean}
 * @inner
 */
function isLong(obj) {
    return (obj && obj["__isLong__"]) === true;
}

/**
 * Tests if the specified object is a Long.
 * @function
 * @param {*} obj Object
 * @returns {boolean}
 */
Long.isLong = isLong;

/**
 * A cache of the Long representations of small integer values.
 * @type {!Object}
 * @inner
 */
var INT_CACHE = {};

/**
 * A cache of the Long representations of small unsigned integer values.
 * @type {!Object}
 * @inner
 */
var UINT_CACHE = {};

/**
 * @param {number} value
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromInt(value, unsigned) {
    var obj, cachedObj, cache;
    if (unsigned) {
        value >>>= 0;
        if (cache = (0 <= value && value < 256)) {
            cachedObj = UINT_CACHE[value];
            if (cachedObj)
                return cachedObj;
        }
        obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
        if (cache)
            UINT_CACHE[value] = obj;
        return obj;
    } else {
        value |= 0;
        if (cache = (-128 <= value && value < 128)) {
            cachedObj = INT_CACHE[value];
            if (cachedObj)
                return cachedObj;
        }
        obj = fromBits(value, value < 0 ? -1 : 0, false);
        if (cache)
            INT_CACHE[value] = obj;
        return obj;
    }
}

/**
 * Returns a Long representing the given 32 bit integer value.
 * @function
 * @param {number} value The 32 bit integer in question
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromInt = fromInt;

/**
 * @param {number} value
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromNumber(value, unsigned) {
    if (isNaN(value))
        return unsigned ? UZERO : ZERO;
    if (unsigned) {
        if (value < 0)
            return UZERO;
        if (value >= TWO_PWR_64_DBL)
            return MAX_UNSIGNED_VALUE;
    } else {
        if (value <= -TWO_PWR_63_DBL)
            return MIN_VALUE;
        if (value + 1 >= TWO_PWR_63_DBL)
            return MAX_VALUE;
    }
    if (value < 0)
        return fromNumber(-value, unsigned).neg();
    return fromBits((value % TWO_PWR_32_DBL) | 0, (value / TWO_PWR_32_DBL) | 0, unsigned);
}

/**
 * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
 * @function
 * @param {number} value The number in question
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromNumber = fromNumber;

/**
 * @param {number} lowBits
 * @param {number} highBits
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromBits(lowBits, highBits, unsigned) {
    return new Long(lowBits, highBits, unsigned);
}

/**
 * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
 *  assumed to use 32 bits.
 * @function
 * @param {number} lowBits The low 32 bits
 * @param {number} highBits The high 32 bits
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromBits = fromBits;

/**
 * @function
 * @param {number} base
 * @param {number} exponent
 * @returns {number}
 * @inner
 */
var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)

/**
 * @param {string} str
 * @param {(boolean|number)=} unsigned
 * @param {number=} radix
 * @returns {!Long}
 * @inner
 */
function fromString(str, unsigned, radix) {
    if (str.length === 0)
        throw Error('empty string');
    if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
        return ZERO;
    if (typeof unsigned === 'number') {
        // For goog.math.long compatibility
        radix = unsigned,
        unsigned = false;
    } else {
        unsigned = !! unsigned;
    }
    radix = radix || 10;
    if (radix < 2 || 36 < radix)
        throw RangeError('radix');

    var p;
    if ((p = str.indexOf('-')) > 0)
        throw Error('interior hyphen');
    else if (p === 0) {
        return fromString(str.substring(1), unsigned, radix).neg();
    }

    // Do several (8) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = fromNumber(pow_dbl(radix, 8));

    var result = ZERO;
    for (var i = 0; i < str.length; i += 8) {
        var size = Math.min(8, str.length - i),
            value = parseInt(str.substring(i, i + size), radix);
        if (size < 8) {
            var power = fromNumber(pow_dbl(radix, size));
            result = result.mul(power).add(fromNumber(value));
        } else {
            result = result.mul(radixToPower);
            result = result.add(fromNumber(value));
        }
    }
    result.unsigned = unsigned;
    return result;
}

/**
 * Returns a Long representation of the given string, written using the specified radix.
 * @function
 * @param {string} str The textual representation of the Long
 * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to signed
 * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
 * @returns {!Long} The corresponding Long value
 */
Long.fromString = fromString;

/**
 * @function
 * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromValue(val, unsigned) {
    if (typeof val === 'number')
        return fromNumber(val, unsigned);
    if (typeof val === 'string')
        return fromString(val, unsigned);
    // Throws for non-objects, converts non-instanceof Long:
    return fromBits(val.low, val.high, typeof unsigned === 'boolean' ? unsigned : val.unsigned);
}

/**
 * Converts the specified value to a Long using the appropriate from* function for its type.
 * @function
 * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val Value
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long}
 */
Long.fromValue = fromValue;

// NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
// no runtime penalty for these.

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_16_DBL = 1 << 16;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_24_DBL = 1 << 24;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;

/**
 * @type {!Long}
 * @const
 * @inner
 */
var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);

/**
 * @type {!Long}
 * @inner
 */
var ZERO = fromInt(0);

/**
 * Signed zero.
 * @type {!Long}
 */
Long.ZERO = ZERO;

/**
 * @type {!Long}
 * @inner
 */
var UZERO = fromInt(0, true);

/**
 * Unsigned zero.
 * @type {!Long}
 */
Long.UZERO = UZERO;

/**
 * @type {!Long}
 * @inner
 */
var ONE = fromInt(1);

/**
 * Signed one.
 * @type {!Long}
 */
Long.ONE = ONE;

/**
 * @type {!Long}
 * @inner
 */
var UONE = fromInt(1, true);

/**
 * Unsigned one.
 * @type {!Long}
 */
Long.UONE = UONE;

/**
 * @type {!Long}
 * @inner
 */
var NEG_ONE = fromInt(-1);

/**
 * Signed negative one.
 * @type {!Long}
 */
Long.NEG_ONE = NEG_ONE;

/**
 * @type {!Long}
 * @inner
 */
var MAX_VALUE = fromBits(0xFFFFFFFF|0, 0x7FFFFFFF|0, false);

/**
 * Maximum signed value.
 * @type {!Long}
 */
Long.MAX_VALUE = MAX_VALUE;

/**
 * @type {!Long}
 * @inner
 */
var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF|0, 0xFFFFFFFF|0, true);

/**
 * Maximum unsigned value.
 * @type {!Long}
 */
Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;

/**
 * @type {!Long}
 * @inner
 */
var MIN_VALUE = fromBits(0, 0x80000000|0, false);

/**
 * Minimum signed value.
 * @type {!Long}
 */
Long.MIN_VALUE = MIN_VALUE;

/**
 * @alias Long.prototype
 * @inner
 */
var LongPrototype = Long.prototype;

/**
 * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
 * @returns {number}
 */
LongPrototype.toInt = function toInt() {
    return this.unsigned ? this.low >>> 0 : this.low;
};

/**
 * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
 * @returns {number}
 */
LongPrototype.toNumber = function toNumber() {
    if (this.unsigned)
        return ((this.high >>> 0) * TWO_PWR_32_DBL) + (this.low >>> 0);
    return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
};

/**
 * Converts the Long to a string written in the specified radix.
 * @param {number=} radix Radix (2-36), defaults to 10
 * @returns {string}
 * @override
 * @throws {RangeError} If `radix` is out of range
 */
LongPrototype.toString = function toString(radix) {
    radix = radix || 10;
    if (radix < 2 || 36 < radix)
        throw RangeError('radix');
    if (this.isZero())
        return '0';
    if (this.isNegative()) { // Unsigned Longs are never negative
        if (this.eq(MIN_VALUE)) {
            // We need to change the Long value before it can be negated, so we remove
            // the bottom-most digit in this base and then recurse to do the rest.
            var radixLong = fromNumber(radix),
                div = this.div(radixLong),
                rem1 = div.mul(radixLong).sub(this);
            return div.toString(radix) + rem1.toInt().toString(radix);
        } else
            return '-' + this.neg().toString(radix);
    }

    // Do several (6) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned),
        rem = this;
    var result = '';
    while (true) {
        var remDiv = rem.div(radixToPower),
            intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
            digits = intval.toString(radix);
        rem = remDiv;
        if (rem.isZero())
            return digits + result;
        else {
            while (digits.length < 6)
                digits = '0' + digits;
            result = '' + digits + result;
        }
    }
};

/**
 * Gets the high 32 bits as a signed integer.
 * @returns {number} Signed high bits
 */
LongPrototype.getHighBits = function getHighBits() {
    return this.high;
};

/**
 * Gets the high 32 bits as an unsigned integer.
 * @returns {number} Unsigned high bits
 */
LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
    return this.high >>> 0;
};

/**
 * Gets the low 32 bits as a signed integer.
 * @returns {number} Signed low bits
 */
LongPrototype.getLowBits = function getLowBits() {
    return this.low;
};

/**
 * Gets the low 32 bits as an unsigned integer.
 * @returns {number} Unsigned low bits
 */
LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
    return this.low >>> 0;
};

/**
 * Gets the number of bits needed to represent the absolute value of this Long.
 * @returns {number}
 */
LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
    if (this.isNegative()) // Unsigned Longs are never negative
        return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
    var val = this.high != 0 ? this.high : this.low;
    for (var bit = 31; bit > 0; bit--)
        if ((val & (1 << bit)) != 0)
            break;
    return this.high != 0 ? bit + 33 : bit + 1;
};

/**
 * Tests if this Long's value equals zero.
 * @returns {boolean}
 */
LongPrototype.isZero = function isZero() {
    return this.high === 0 && this.low === 0;
};

/**
 * Tests if this Long's value equals zero. This is an alias of {@link Long#isZero}.
 * @returns {boolean}
 */
LongPrototype.eqz = LongPrototype.isZero;

/**
 * Tests if this Long's value is negative.
 * @returns {boolean}
 */
LongPrototype.isNegative = function isNegative() {
    return !this.unsigned && this.high < 0;
};

/**
 * Tests if this Long's value is positive.
 * @returns {boolean}
 */
LongPrototype.isPositive = function isPositive() {
    return this.unsigned || this.high >= 0;
};

/**
 * Tests if this Long's value is odd.
 * @returns {boolean}
 */
LongPrototype.isOdd = function isOdd() {
    return (this.low & 1) === 1;
};

/**
 * Tests if this Long's value is even.
 * @returns {boolean}
 */
LongPrototype.isEven = function isEven() {
    return (this.low & 1) === 0;
};

/**
 * Tests if this Long's value equals the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.equals = function equals(other) {
    if (!isLong(other))
        other = fromValue(other);
    if (this.unsigned !== other.unsigned && (this.high >>> 31) === 1 && (other.high >>> 31) === 1)
        return false;
    return this.high === other.high && this.low === other.low;
};

/**
 * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.eq = LongPrototype.equals;

/**
 * Tests if this Long's value differs from the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.notEquals = function notEquals(other) {
    return !this.eq(/* validates */ other);
};

/**
 * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.neq = LongPrototype.notEquals;

/**
 * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.ne = LongPrototype.notEquals;

/**
 * Tests if this Long's value is less than the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lessThan = function lessThan(other) {
    return this.comp(/* validates */ other) < 0;
};

/**
 * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lt = LongPrototype.lessThan;

/**
 * Tests if this Long's value is less than or equal the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
    return this.comp(/* validates */ other) <= 0;
};

/**
 * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lte = LongPrototype.lessThanOrEqual;

/**
 * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.le = LongPrototype.lessThanOrEqual;

/**
 * Tests if this Long's value is greater than the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.greaterThan = function greaterThan(other) {
    return this.comp(/* validates */ other) > 0;
};

/**
 * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.gt = LongPrototype.greaterThan;

/**
 * Tests if this Long's value is greater than or equal the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
    return this.comp(/* validates */ other) >= 0;
};

/**
 * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.gte = LongPrototype.greaterThanOrEqual;

/**
 * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.ge = LongPrototype.greaterThanOrEqual;

/**
 * Compares this Long's value with the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {number} 0 if they are the same, 1 if the this is greater and -1
 *  if the given one is greater
 */
LongPrototype.compare = function compare(other) {
    if (!isLong(other))
        other = fromValue(other);
    if (this.eq(other))
        return 0;
    var thisNeg = this.isNegative(),
        otherNeg = other.isNegative();
    if (thisNeg && !otherNeg)
        return -1;
    if (!thisNeg && otherNeg)
        return 1;
    // At this point the sign bits are the same
    if (!this.unsigned)
        return this.sub(other).isNegative() ? -1 : 1;
    // Both are positive if at least one is unsigned
    return (other.high >>> 0) > (this.high >>> 0) || (other.high === this.high && (other.low >>> 0) > (this.low >>> 0)) ? -1 : 1;
};

/**
 * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {number} 0 if they are the same, 1 if the this is greater and -1
 *  if the given one is greater
 */
LongPrototype.comp = LongPrototype.compare;

/**
 * Negates this Long's value.
 * @returns {!Long} Negated Long
 */
LongPrototype.negate = function negate() {
    if (!this.unsigned && this.eq(MIN_VALUE))
        return MIN_VALUE;
    return this.not().add(ONE);
};

/**
 * Negates this Long's value. This is an alias of {@link Long#negate}.
 * @function
 * @returns {!Long} Negated Long
 */
LongPrototype.neg = LongPrototype.negate;

/**
 * Returns the sum of this and the specified Long.
 * @param {!Long|number|string} addend Addend
 * @returns {!Long} Sum
 */
LongPrototype.add = function add(addend) {
    if (!isLong(addend))
        addend = fromValue(addend);

    // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

    var a48 = this.high >>> 16;
    var a32 = this.high & 0xFFFF;
    var a16 = this.low >>> 16;
    var a00 = this.low & 0xFFFF;

    var b48 = addend.high >>> 16;
    var b32 = addend.high & 0xFFFF;
    var b16 = addend.low >>> 16;
    var b00 = addend.low & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 + b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 + b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 + b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 + b48;
    c48 &= 0xFFFF;
    return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
};

/**
 * Returns the difference of this and the specified Long.
 * @param {!Long|number|string} subtrahend Subtrahend
 * @returns {!Long} Difference
 */
LongPrototype.subtract = function subtract(subtrahend) {
    if (!isLong(subtrahend))
        subtrahend = fromValue(subtrahend);
    return this.add(subtrahend.neg());
};

/**
 * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
 * @function
 * @param {!Long|number|string} subtrahend Subtrahend
 * @returns {!Long} Difference
 */
LongPrototype.sub = LongPrototype.subtract;

/**
 * Returns the product of this and the specified Long.
 * @param {!Long|number|string} multiplier Multiplier
 * @returns {!Long} Product
 */
LongPrototype.multiply = function multiply(multiplier) {
    if (this.isZero())
        return ZERO;
    if (!isLong(multiplier))
        multiplier = fromValue(multiplier);

    // use wasm support if present
    if (wasm) {
        var low = wasm.mul(this.low,
                           this.high,
                           multiplier.low,
                           multiplier.high);
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    if (multiplier.isZero())
        return ZERO;
    if (this.eq(MIN_VALUE))
        return multiplier.isOdd() ? MIN_VALUE : ZERO;
    if (multiplier.eq(MIN_VALUE))
        return this.isOdd() ? MIN_VALUE : ZERO;

    if (this.isNegative()) {
        if (multiplier.isNegative())
            return this.neg().mul(multiplier.neg());
        else
            return this.neg().mul(multiplier).neg();
    } else if (multiplier.isNegative())
        return this.mul(multiplier.neg()).neg();

    // If both longs are small, use float multiplication
    if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
        return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);

    // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
    // We can skip products that would overflow.

    var a48 = this.high >>> 16;
    var a32 = this.high & 0xFFFF;
    var a16 = this.low >>> 16;
    var a00 = this.low & 0xFFFF;

    var b48 = multiplier.high >>> 16;
    var b32 = multiplier.high & 0xFFFF;
    var b16 = multiplier.low >>> 16;
    var b00 = multiplier.low & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 * b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 * b00;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c16 += a00 * b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 * b00;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a16 * b16;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a00 * b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
    c48 &= 0xFFFF;
    return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
};

/**
 * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
 * @function
 * @param {!Long|number|string} multiplier Multiplier
 * @returns {!Long} Product
 */
LongPrototype.mul = LongPrototype.multiply;

/**
 * Returns this Long divided by the specified. The result is signed if this Long is signed or
 *  unsigned if this Long is unsigned.
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Quotient
 */
LongPrototype.divide = function divide(divisor) {
    if (!isLong(divisor))
        divisor = fromValue(divisor);
    if (divisor.isZero())
        throw Error('division by zero');

    // use wasm support if present
    if (wasm) {
        // guard against signed division overflow: the largest
        // negative number / -1 would be 1 larger than the largest
        // positive number, due to two's complement.
        if (!this.unsigned &&
            this.high === -0x80000000 &&
            divisor.low === -1 && divisor.high === -1) {
            // be consistent with non-wasm code path
            return this;
        }
        var low = (this.unsigned ? wasm.div_u : wasm.div_s)(
            this.low,
            this.high,
            divisor.low,
            divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    if (this.isZero())
        return this.unsigned ? UZERO : ZERO;
    var approx, rem, res;
    if (!this.unsigned) {
        // This section is only relevant for signed longs and is derived from the
        // closure library as a whole.
        if (this.eq(MIN_VALUE)) {
            if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
                return MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
            else if (divisor.eq(MIN_VALUE))
                return ONE;
            else {
                // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                var halfThis = this.shr(1);
                approx = halfThis.div(divisor).shl(1);
                if (approx.eq(ZERO)) {
                    return divisor.isNegative() ? ONE : NEG_ONE;
                } else {
                    rem = this.sub(divisor.mul(approx));
                    res = approx.add(rem.div(divisor));
                    return res;
                }
            }
        } else if (divisor.eq(MIN_VALUE))
            return this.unsigned ? UZERO : ZERO;
        if (this.isNegative()) {
            if (divisor.isNegative())
                return this.neg().div(divisor.neg());
            return this.neg().div(divisor).neg();
        } else if (divisor.isNegative())
            return this.div(divisor.neg()).neg();
        res = ZERO;
    } else {
        // The algorithm below has not been made for unsigned longs. It's therefore
        // required to take special care of the MSB prior to running it.
        if (!divisor.unsigned)
            divisor = divisor.toUnsigned();
        if (divisor.gt(this))
            return UZERO;
        if (divisor.gt(this.shru(1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
            return UONE;
        res = UZERO;
    }

    // Repeat the following until the remainder is less than other:  find a
    // floating-point that approximates remainder / other *from below*, add this
    // into the result, and subtract it from the remainder.  It is critical that
    // the approximate value is less than or equal to the real value so that the
    // remainder never becomes negative.
    rem = this;
    while (rem.gte(divisor)) {
        // Approximate the result of division. This may be a little greater or
        // smaller than the actual value.
        approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));

        // We will tweak the approximate result by changing it in the 48-th digit or
        // the smallest non-fractional digit, whichever is larger.
        var log2 = Math.ceil(Math.log(approx) / Math.LN2),
            delta = (log2 <= 48) ? 1 : pow_dbl(2, log2 - 48),

        // Decrease the approximation until it is smaller than the remainder.  Note
        // that if it is too large, the product overflows and is negative.
            approxRes = fromNumber(approx),
            approxRem = approxRes.mul(divisor);
        while (approxRem.isNegative() || approxRem.gt(rem)) {
            approx -= delta;
            approxRes = fromNumber(approx, this.unsigned);
            approxRem = approxRes.mul(divisor);
        }

        // We know the answer can't be zero... and actually, zero would cause
        // infinite recursion since we would make no progress.
        if (approxRes.isZero())
            approxRes = ONE;

        res = res.add(approxRes);
        rem = rem.sub(approxRem);
    }
    return res;
};

/**
 * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Quotient
 */
LongPrototype.div = LongPrototype.divide;

/**
 * Returns this Long modulo the specified.
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.modulo = function modulo(divisor) {
    if (!isLong(divisor))
        divisor = fromValue(divisor);

    // use wasm support if present
    if (wasm) {
        var low = (this.unsigned ? wasm.rem_u : wasm.rem_s)(
            this.low,
            this.high,
            divisor.low,
            divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    return this.sub(this.div(divisor).mul(divisor));
};

/**
 * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.mod = LongPrototype.modulo;

/**
 * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.rem = LongPrototype.modulo;

/**
 * Returns the bitwise NOT of this Long.
 * @returns {!Long}
 */
LongPrototype.not = function not() {
    return fromBits(~this.low, ~this.high, this.unsigned);
};

/**
 * Returns the bitwise AND of this Long and the specified.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.and = function and(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
};

/**
 * Returns the bitwise OR of this Long and the specified.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.or = function or(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
};

/**
 * Returns the bitwise XOR of this Long and the given one.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.xor = function xor(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
};

/**
 * Returns this Long with bits shifted to the left by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftLeft = function shiftLeft(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
        return this;
    else if (numBits < 32)
        return fromBits(this.low << numBits, (this.high << numBits) | (this.low >>> (32 - numBits)), this.unsigned);
    else
        return fromBits(0, this.low << (numBits - 32), this.unsigned);
};

/**
 * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shl = LongPrototype.shiftLeft;

/**
 * Returns this Long with bits arithmetically shifted to the right by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftRight = function shiftRight(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
        return this;
    else if (numBits < 32)
        return fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >> numBits, this.unsigned);
    else
        return fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1, this.unsigned);
};

/**
 * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shr = LongPrototype.shiftRight;

/**
 * Returns this Long with bits logically shifted to the right by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    numBits &= 63;
    if (numBits === 0)
        return this;
    else {
        var high = this.high;
        if (numBits < 32) {
            var low = this.low;
            return fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits, this.unsigned);
        } else if (numBits === 32)
            return fromBits(high, 0, this.unsigned);
        else
            return fromBits(high >>> (numBits - 32), 0, this.unsigned);
    }
};

/**
 * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shru = LongPrototype.shiftRightUnsigned;

/**
 * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;

/**
 * Converts this Long to signed.
 * @returns {!Long} Signed long
 */
LongPrototype.toSigned = function toSigned() {
    if (!this.unsigned)
        return this;
    return fromBits(this.low, this.high, false);
};

/**
 * Converts this Long to unsigned.
 * @returns {!Long} Unsigned long
 */
LongPrototype.toUnsigned = function toUnsigned() {
    if (this.unsigned)
        return this;
    return fromBits(this.low, this.high, true);
};

/**
 * Converts this Long to its byte representation.
 * @param {boolean=} le Whether little or big endian, defaults to big endian
 * @returns {!Array.<number>} Byte representation
 */
LongPrototype.toBytes = function toBytes(le) {
    return le ? this.toBytesLE() : this.toBytesBE();
};

/**
 * Converts this Long to its little endian byte representation.
 * @returns {!Array.<number>} Little endian byte representation
 */
LongPrototype.toBytesLE = function toBytesLE() {
    var hi = this.high,
        lo = this.low;
    return [
        lo        & 0xff,
        lo >>>  8 & 0xff,
        lo >>> 16 & 0xff,
        lo >>> 24       ,
        hi        & 0xff,
        hi >>>  8 & 0xff,
        hi >>> 16 & 0xff,
        hi >>> 24
    ];
};

/**
 * Converts this Long to its big endian byte representation.
 * @returns {!Array.<number>} Big endian byte representation
 */
LongPrototype.toBytesBE = function toBytesBE() {
    var hi = this.high,
        lo = this.low;
    return [
        hi >>> 24       ,
        hi >>> 16 & 0xff,
        hi >>>  8 & 0xff,
        hi        & 0xff,
        lo >>> 24       ,
        lo >>> 16 & 0xff,
        lo >>>  8 & 0xff,
        lo        & 0xff
    ];
};

/**
 * Creates a Long from its byte representation.
 * @param {!Array.<number>} bytes Byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @param {boolean=} le Whether little or big endian, defaults to big endian
 * @returns {Long} The corresponding Long value
 */
Long.fromBytes = function fromBytes(bytes, unsigned, le) {
    return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
};

/**
 * Creates a Long from its little endian byte representation.
 * @param {!Array.<number>} bytes Little endian byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {Long} The corresponding Long value
 */
Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
    return new Long(
        bytes[0]       |
        bytes[1] <<  8 |
        bytes[2] << 16 |
        bytes[3] << 24,
        bytes[4]       |
        bytes[5] <<  8 |
        bytes[6] << 16 |
        bytes[7] << 24,
        unsigned
    );
};

/**
 * Creates a Long from its big endian byte representation.
 * @param {!Array.<number>} bytes Big endian byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {Long} The corresponding Long value
 */
Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
    return new Long(
        bytes[4] << 24 |
        bytes[5] << 16 |
        bytes[6] <<  8 |
        bytes[7],
        bytes[0] << 24 |
        bytes[1] << 16 |
        bytes[2] <<  8 |
        bytes[3],
        unsigned
    );
};


/***/ }),

/***/ "../node_modules/protobufjs/minimal.js":
/*!*********************************************!*\
  !*** ../node_modules/protobufjs/minimal.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// minimal library entry point.


module.exports = __webpack_require__(/*! ./src/index-minimal */ "../node_modules/protobufjs/src/index-minimal.js");


/***/ }),

/***/ "../node_modules/protobufjs/src/index-minimal.js":
/*!*******************************************************!*\
  !*** ../node_modules/protobufjs/src/index-minimal.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var protobuf = exports;

/**
 * Build type, one of `"full"`, `"light"` or `"minimal"`.
 * @name build
 * @type {string}
 * @const
 */
protobuf.build = "minimal";

// Serialization
protobuf.Writer       = __webpack_require__(/*! ./writer */ "../node_modules/protobufjs/src/writer.js");
protobuf.BufferWriter = __webpack_require__(/*! ./writer_buffer */ "../node_modules/protobufjs/src/writer_buffer.js");
protobuf.Reader       = __webpack_require__(/*! ./reader */ "../node_modules/protobufjs/src/reader.js");
protobuf.BufferReader = __webpack_require__(/*! ./reader_buffer */ "../node_modules/protobufjs/src/reader_buffer.js");

// Utility
protobuf.util         = __webpack_require__(/*! ./util/minimal */ "../node_modules/protobufjs/src/util/minimal.js");
protobuf.rpc          = __webpack_require__(/*! ./rpc */ "../node_modules/protobufjs/src/rpc.js");
protobuf.roots        = __webpack_require__(/*! ./roots */ "../node_modules/protobufjs/src/roots.js");
protobuf.configure    = configure;

/* istanbul ignore next */
/**
 * Reconfigures the library according to the environment.
 * @returns {undefined}
 */
function configure() {
    protobuf.util._configure();
    protobuf.Writer._configure(protobuf.BufferWriter);
    protobuf.Reader._configure(protobuf.BufferReader);
}

// Set up buffer utility according to the environment
configure();


/***/ }),

/***/ "../node_modules/protobufjs/src/reader.js":
/*!************************************************!*\
  !*** ../node_modules/protobufjs/src/reader.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Reader;

var util      = __webpack_require__(/*! ./util/minimal */ "../node_modules/protobufjs/src/util/minimal.js");

var BufferReader; // cyclic

var LongBits  = util.LongBits,
    utf8      = util.utf8;

/* istanbul ignore next */
function indexOutOfRange(reader, writeLength) {
    return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
}

/**
 * Constructs a new reader instance using the specified buffer.
 * @classdesc Wire format reader using `Uint8Array` if available, otherwise `Array`.
 * @constructor
 * @param {Uint8Array} buffer Buffer to read from
 */
function Reader(buffer) {

    /**
     * Read buffer.
     * @type {Uint8Array}
     */
    this.buf = buffer;

    /**
     * Read buffer position.
     * @type {number}
     */
    this.pos = 0;

    /**
     * Read buffer length.
     * @type {number}
     */
    this.len = buffer.length;
}

var create_array = typeof Uint8Array !== "undefined"
    ? function create_typed_array(buffer) {
        if (buffer instanceof Uint8Array || Array.isArray(buffer))
            return new Reader(buffer);
        throw Error("illegal buffer");
    }
    /* istanbul ignore next */
    : function create_array(buffer) {
        if (Array.isArray(buffer))
            return new Reader(buffer);
        throw Error("illegal buffer");
    };

var create = function create() {
    return util.Buffer
        ? function create_buffer_setup(buffer) {
            return (Reader.create = function create_buffer(buffer) {
                return util.Buffer.isBuffer(buffer)
                    ? new BufferReader(buffer)
                    /* istanbul ignore next */
                    : create_array(buffer);
            })(buffer);
        }
        /* istanbul ignore next */
        : create_array;
};

/**
 * Creates a new reader using the specified buffer.
 * @function
 * @param {Uint8Array|Buffer} buffer Buffer to read from
 * @returns {Reader|BufferReader} A {@link BufferReader} if `buffer` is a Buffer, otherwise a {@link Reader}
 * @throws {Error} If `buffer` is not a valid buffer
 */
Reader.create = create();

Reader.prototype._slice = util.Array.prototype.subarray || /* istanbul ignore next */ util.Array.prototype.slice;

/**
 * Reads a varint as an unsigned 32 bit value.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.uint32 = (function read_uint32_setup() {
    var value = 4294967295; // optimizer type-hint, tends to deopt otherwise (?!)
    return function read_uint32() {
        value = (         this.buf[this.pos] & 127       ) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) <<  7) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 14) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 21) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] &  15) << 28) >>> 0; if (this.buf[this.pos++] < 128) return value;

        /* istanbul ignore if */
        if ((this.pos += 5) > this.len) {
            this.pos = this.len;
            throw indexOutOfRange(this, 10);
        }
        return value;
    };
})();

/**
 * Reads a varint as a signed 32 bit value.
 * @returns {number} Value read
 */
Reader.prototype.int32 = function read_int32() {
    return this.uint32() | 0;
};

/**
 * Reads a zig-zag encoded varint as a signed 32 bit value.
 * @returns {number} Value read
 */
Reader.prototype.sint32 = function read_sint32() {
    var value = this.uint32();
    return value >>> 1 ^ -(value & 1) | 0;
};

/* eslint-disable no-invalid-this */

function readLongVarint() {
    // tends to deopt with local vars for octet etc.
    var bits = new LongBits(0, 0);
    var i = 0;
    if (this.len - this.pos > 4) { // fast route (lo)
        for (; i < 4; ++i) {
            // 1st..4th
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
        // 5th
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) >>  4) >>> 0;
        if (this.buf[this.pos++] < 128)
            return bits;
        i = 0;
    } else {
        for (; i < 3; ++i) {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
            // 1st..3th
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
        // 4th
        bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
        return bits;
    }
    if (this.len - this.pos > 4) { // fast route (hi)
        for (; i < 5; ++i) {
            // 6th..10th
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
    } else {
        for (; i < 5; ++i) {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
            // 6th..10th
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
    }
    /* istanbul ignore next */
    throw Error("invalid varint encoding");
}

/* eslint-enable no-invalid-this */

/**
 * Reads a varint as a signed 64 bit value.
 * @name Reader#int64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a varint as an unsigned 64 bit value.
 * @name Reader#uint64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a zig-zag encoded varint as a signed 64 bit value.
 * @name Reader#sint64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a varint as a boolean.
 * @returns {boolean} Value read
 */
Reader.prototype.bool = function read_bool() {
    return this.uint32() !== 0;
};

function readFixed32_end(buf, end) { // note that this uses `end`, not `pos`
    return (buf[end - 4]
          | buf[end - 3] << 8
          | buf[end - 2] << 16
          | buf[end - 1] << 24) >>> 0;
}

/**
 * Reads fixed 32 bits as an unsigned 32 bit integer.
 * @returns {number} Value read
 */
Reader.prototype.fixed32 = function read_fixed32() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    return readFixed32_end(this.buf, this.pos += 4);
};

/**
 * Reads fixed 32 bits as a signed 32 bit integer.
 * @returns {number} Value read
 */
Reader.prototype.sfixed32 = function read_sfixed32() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    return readFixed32_end(this.buf, this.pos += 4) | 0;
};

/* eslint-disable no-invalid-this */

function readFixed64(/* this: Reader */) {

    /* istanbul ignore if */
    if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 8);

    return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
}

/* eslint-enable no-invalid-this */

/**
 * Reads fixed 64 bits.
 * @name Reader#fixed64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads zig-zag encoded fixed 64 bits.
 * @name Reader#sfixed64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a float (32 bit) as a number.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.float = function read_float() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    var value = util.float.readFloatLE(this.buf, this.pos);
    this.pos += 4;
    return value;
};

/**
 * Reads a double (64 bit float) as a number.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.double = function read_double() {

    /* istanbul ignore if */
    if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 4);

    var value = util.float.readDoubleLE(this.buf, this.pos);
    this.pos += 8;
    return value;
};

/**
 * Reads a sequence of bytes preceeded by its length as a varint.
 * @returns {Uint8Array} Value read
 */
Reader.prototype.bytes = function read_bytes() {
    var length = this.uint32(),
        start  = this.pos,
        end    = this.pos + length;

    /* istanbul ignore if */
    if (end > this.len)
        throw indexOutOfRange(this, length);

    this.pos += length;
    if (Array.isArray(this.buf)) // plain array
        return this.buf.slice(start, end);
    return start === end // fix for IE 10/Win8 and others' subarray returning array of size 1
        ? new this.buf.constructor(0)
        : this._slice.call(this.buf, start, end);
};

/**
 * Reads a string preceeded by its byte length as a varint.
 * @returns {string} Value read
 */
Reader.prototype.string = function read_string() {
    var bytes = this.bytes();
    return utf8.read(bytes, 0, bytes.length);
};

/**
 * Skips the specified number of bytes if specified, otherwise skips a varint.
 * @param {number} [length] Length if known, otherwise a varint is assumed
 * @returns {Reader} `this`
 */
Reader.prototype.skip = function skip(length) {
    if (typeof length === "number") {
        /* istanbul ignore if */
        if (this.pos + length > this.len)
            throw indexOutOfRange(this, length);
        this.pos += length;
    } else {
        do {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
        } while (this.buf[this.pos++] & 128);
    }
    return this;
};

/**
 * Skips the next element of the specified wire type.
 * @param {number} wireType Wire type received
 * @returns {Reader} `this`
 */
Reader.prototype.skipType = function(wireType) {
    switch (wireType) {
        case 0:
            this.skip();
            break;
        case 1:
            this.skip(8);
            break;
        case 2:
            this.skip(this.uint32());
            break;
        case 3:
            while ((wireType = this.uint32() & 7) !== 4) {
                this.skipType(wireType);
            }
            break;
        case 5:
            this.skip(4);
            break;

        /* istanbul ignore next */
        default:
            throw Error("invalid wire type " + wireType + " at offset " + this.pos);
    }
    return this;
};

Reader._configure = function(BufferReader_) {
    BufferReader = BufferReader_;
    Reader.create = create();
    BufferReader._configure();

    var fn = util.Long ? "toLong" : /* istanbul ignore next */ "toNumber";
    util.merge(Reader.prototype, {

        int64: function read_int64() {
            return readLongVarint.call(this)[fn](false);
        },

        uint64: function read_uint64() {
            return readLongVarint.call(this)[fn](true);
        },

        sint64: function read_sint64() {
            return readLongVarint.call(this).zzDecode()[fn](false);
        },

        fixed64: function read_fixed64() {
            return readFixed64.call(this)[fn](true);
        },

        sfixed64: function read_sfixed64() {
            return readFixed64.call(this)[fn](false);
        }

    });
};


/***/ }),

/***/ "../node_modules/protobufjs/src/reader_buffer.js":
/*!*******************************************************!*\
  !*** ../node_modules/protobufjs/src/reader_buffer.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = BufferReader;

// extends Reader
var Reader = __webpack_require__(/*! ./reader */ "../node_modules/protobufjs/src/reader.js");
(BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;

var util = __webpack_require__(/*! ./util/minimal */ "../node_modules/protobufjs/src/util/minimal.js");

/**
 * Constructs a new buffer reader instance.
 * @classdesc Wire format reader using node buffers.
 * @extends Reader
 * @constructor
 * @param {Buffer} buffer Buffer to read from
 */
function BufferReader(buffer) {
    Reader.call(this, buffer);

    /**
     * Read buffer.
     * @name BufferReader#buf
     * @type {Buffer}
     */
}

BufferReader._configure = function () {
    /* istanbul ignore else */
    if (util.Buffer)
        BufferReader.prototype._slice = util.Buffer.prototype.slice;
};


/**
 * @override
 */
BufferReader.prototype.string = function read_string_buffer() {
    var len = this.uint32(); // modifies pos
    return this.buf.utf8Slice
        ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len))
        : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
};

/**
 * Reads a sequence of bytes preceeded by its length as a varint.
 * @name BufferReader#bytes
 * @function
 * @returns {Buffer} Value read
 */

BufferReader._configure();


/***/ }),

/***/ "../node_modules/protobufjs/src/roots.js":
/*!***********************************************!*\
  !*** ../node_modules/protobufjs/src/roots.js ***!
  \***********************************************/
/***/ ((module) => {

"use strict";

module.exports = {};

/**
 * Named roots.
 * This is where pbjs stores generated structures (the option `-r, --root` specifies a name).
 * Can also be used manually to make roots available accross modules.
 * @name roots
 * @type {Object.<string,Root>}
 * @example
 * // pbjs -r myroot -o compiled.js ...
 *
 * // in another module:
 * require("./compiled.js");
 *
 * // in any subsequent module:
 * var root = protobuf.roots["myroot"];
 */


/***/ }),

/***/ "../node_modules/protobufjs/src/rpc.js":
/*!*********************************************!*\
  !*** ../node_modules/protobufjs/src/rpc.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


/**
 * Streaming RPC helpers.
 * @namespace
 */
var rpc = exports;

/**
 * RPC implementation passed to {@link Service#create} performing a service request on network level, i.e. by utilizing http requests or websockets.
 * @typedef RPCImpl
 * @type {function}
 * @param {Method|rpc.ServiceMethod<Message<{}>,Message<{}>>} method Reflected or static method being called
 * @param {Uint8Array} requestData Request data
 * @param {RPCImplCallback} callback Callback function
 * @returns {undefined}
 * @example
 * function rpcImpl(method, requestData, callback) {
 *     if (protobuf.util.lcFirst(method.name) !== "myMethod") // compatible with static code
 *         throw Error("no such method");
 *     asynchronouslyObtainAResponse(requestData, function(err, responseData) {
 *         callback(err, responseData);
 *     });
 * }
 */

/**
 * Node-style callback as used by {@link RPCImpl}.
 * @typedef RPCImplCallback
 * @type {function}
 * @param {Error|null} error Error, if any, otherwise `null`
 * @param {Uint8Array|null} [response] Response data or `null` to signal end of stream, if there hasn't been an error
 * @returns {undefined}
 */

rpc.Service = __webpack_require__(/*! ./rpc/service */ "../node_modules/protobufjs/src/rpc/service.js");


/***/ }),

/***/ "../node_modules/protobufjs/src/rpc/service.js":
/*!*****************************************************!*\
  !*** ../node_modules/protobufjs/src/rpc/service.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Service;

var util = __webpack_require__(/*! ../util/minimal */ "../node_modules/protobufjs/src/util/minimal.js");

// Extends EventEmitter
(Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;

/**
 * A service method callback as used by {@link rpc.ServiceMethod|ServiceMethod}.
 *
 * Differs from {@link RPCImplCallback} in that it is an actual callback of a service method which may not return `response = null`.
 * @typedef rpc.ServiceMethodCallback
 * @template TRes extends Message<TRes>
 * @type {function}
 * @param {Error|null} error Error, if any
 * @param {TRes} [response] Response message
 * @returns {undefined}
 */

/**
 * A service method part of a {@link rpc.Service} as created by {@link Service.create}.
 * @typedef rpc.ServiceMethod
 * @template TReq extends Message<TReq>
 * @template TRes extends Message<TRes>
 * @type {function}
 * @param {TReq|Properties<TReq>} request Request message or plain object
 * @param {rpc.ServiceMethodCallback<TRes>} [callback] Node-style callback called with the error, if any, and the response message
 * @returns {Promise<Message<TRes>>} Promise if `callback` has been omitted, otherwise `undefined`
 */

/**
 * Constructs a new RPC service instance.
 * @classdesc An RPC service as returned by {@link Service#create}.
 * @exports rpc.Service
 * @extends util.EventEmitter
 * @constructor
 * @param {RPCImpl} rpcImpl RPC implementation
 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
 */
function Service(rpcImpl, requestDelimited, responseDelimited) {

    if (typeof rpcImpl !== "function")
        throw TypeError("rpcImpl must be a function");

    util.EventEmitter.call(this);

    /**
     * RPC implementation. Becomes `null` once the service is ended.
     * @type {RPCImpl|null}
     */
    this.rpcImpl = rpcImpl;

    /**
     * Whether requests are length-delimited.
     * @type {boolean}
     */
    this.requestDelimited = Boolean(requestDelimited);

    /**
     * Whether responses are length-delimited.
     * @type {boolean}
     */
    this.responseDelimited = Boolean(responseDelimited);
}

/**
 * Calls a service method through {@link rpc.Service#rpcImpl|rpcImpl}.
 * @param {Method|rpc.ServiceMethod<TReq,TRes>} method Reflected or static method
 * @param {Constructor<TReq>} requestCtor Request constructor
 * @param {Constructor<TRes>} responseCtor Response constructor
 * @param {TReq|Properties<TReq>} request Request message or plain object
 * @param {rpc.ServiceMethodCallback<TRes>} callback Service callback
 * @returns {undefined}
 * @template TReq extends Message<TReq>
 * @template TRes extends Message<TRes>
 */
Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {

    if (!request)
        throw TypeError("request must be specified");

    var self = this;
    if (!callback)
        return util.asPromise(rpcCall, self, method, requestCtor, responseCtor, request);

    if (!self.rpcImpl) {
        setTimeout(function() { callback(Error("already ended")); }, 0);
        return undefined;
    }

    try {
        return self.rpcImpl(
            method,
            requestCtor[self.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
            function rpcCallback(err, response) {

                if (err) {
                    self.emit("error", err, method);
                    return callback(err);
                }

                if (response === null) {
                    self.end(/* endedByRPC */ true);
                    return undefined;
                }

                if (!(response instanceof responseCtor)) {
                    try {
                        response = responseCtor[self.responseDelimited ? "decodeDelimited" : "decode"](response);
                    } catch (err) {
                        self.emit("error", err, method);
                        return callback(err);
                    }
                }

                self.emit("data", response, method);
                return callback(null, response);
            }
        );
    } catch (err) {
        self.emit("error", err, method);
        setTimeout(function() { callback(err); }, 0);
        return undefined;
    }
};

/**
 * Ends this service and emits the `end` event.
 * @param {boolean} [endedByRPC=false] Whether the service has been ended by the RPC implementation.
 * @returns {rpc.Service} `this`
 */
Service.prototype.end = function end(endedByRPC) {
    if (this.rpcImpl) {
        if (!endedByRPC) // signal end to rpcImpl
            this.rpcImpl(null, null, null);
        this.rpcImpl = null;
        this.emit("end").off();
    }
    return this;
};


/***/ }),

/***/ "../node_modules/protobufjs/src/util/longbits.js":
/*!*******************************************************!*\
  !*** ../node_modules/protobufjs/src/util/longbits.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = LongBits;

var util = __webpack_require__(/*! ../util/minimal */ "../node_modules/protobufjs/src/util/minimal.js");

/**
 * Constructs new long bits.
 * @classdesc Helper class for working with the low and high bits of a 64 bit value.
 * @memberof util
 * @constructor
 * @param {number} lo Low 32 bits, unsigned
 * @param {number} hi High 32 bits, unsigned
 */
function LongBits(lo, hi) {

    // note that the casts below are theoretically unnecessary as of today, but older statically
    // generated converter code might still call the ctor with signed 32bits. kept for compat.

    /**
     * Low bits.
     * @type {number}
     */
    this.lo = lo >>> 0;

    /**
     * High bits.
     * @type {number}
     */
    this.hi = hi >>> 0;
}

/**
 * Zero bits.
 * @memberof util.LongBits
 * @type {util.LongBits}
 */
var zero = LongBits.zero = new LongBits(0, 0);

zero.toNumber = function() { return 0; };
zero.zzEncode = zero.zzDecode = function() { return this; };
zero.length = function() { return 1; };

/**
 * Zero hash.
 * @memberof util.LongBits
 * @type {string}
 */
var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";

/**
 * Constructs new long bits from the specified number.
 * @param {number} value Value
 * @returns {util.LongBits} Instance
 */
LongBits.fromNumber = function fromNumber(value) {
    if (value === 0)
        return zero;
    var sign = value < 0;
    if (sign)
        value = -value;
    var lo = value >>> 0,
        hi = (value - lo) / 4294967296 >>> 0;
    if (sign) {
        hi = ~hi >>> 0;
        lo = ~lo >>> 0;
        if (++lo > 4294967295) {
            lo = 0;
            if (++hi > 4294967295)
                hi = 0;
        }
    }
    return new LongBits(lo, hi);
};

/**
 * Constructs new long bits from a number, long or string.
 * @param {Long|number|string} value Value
 * @returns {util.LongBits} Instance
 */
LongBits.from = function from(value) {
    if (typeof value === "number")
        return LongBits.fromNumber(value);
    if (util.isString(value)) {
        /* istanbul ignore else */
        if (util.Long)
            value = util.Long.fromString(value);
        else
            return LongBits.fromNumber(parseInt(value, 10));
    }
    return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
};

/**
 * Converts this long bits to a possibly unsafe JavaScript number.
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {number} Possibly unsafe number
 */
LongBits.prototype.toNumber = function toNumber(unsigned) {
    if (!unsigned && this.hi >>> 31) {
        var lo = ~this.lo + 1 >>> 0,
            hi = ~this.hi     >>> 0;
        if (!lo)
            hi = hi + 1 >>> 0;
        return -(lo + hi * 4294967296);
    }
    return this.lo + this.hi * 4294967296;
};

/**
 * Converts this long bits to a long.
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {Long} Long
 */
LongBits.prototype.toLong = function toLong(unsigned) {
    return util.Long
        ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned))
        /* istanbul ignore next */
        : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
};

var charCodeAt = String.prototype.charCodeAt;

/**
 * Constructs new long bits from the specified 8 characters long hash.
 * @param {string} hash Hash
 * @returns {util.LongBits} Bits
 */
LongBits.fromHash = function fromHash(hash) {
    if (hash === zeroHash)
        return zero;
    return new LongBits(
        ( charCodeAt.call(hash, 0)
        | charCodeAt.call(hash, 1) << 8
        | charCodeAt.call(hash, 2) << 16
        | charCodeAt.call(hash, 3) << 24) >>> 0
    ,
        ( charCodeAt.call(hash, 4)
        | charCodeAt.call(hash, 5) << 8
        | charCodeAt.call(hash, 6) << 16
        | charCodeAt.call(hash, 7) << 24) >>> 0
    );
};

/**
 * Converts this long bits to a 8 characters long hash.
 * @returns {string} Hash
 */
LongBits.prototype.toHash = function toHash() {
    return String.fromCharCode(
        this.lo        & 255,
        this.lo >>> 8  & 255,
        this.lo >>> 16 & 255,
        this.lo >>> 24      ,
        this.hi        & 255,
        this.hi >>> 8  & 255,
        this.hi >>> 16 & 255,
        this.hi >>> 24
    );
};

/**
 * Zig-zag encodes this long bits.
 * @returns {util.LongBits} `this`
 */
LongBits.prototype.zzEncode = function zzEncode() {
    var mask =   this.hi >> 31;
    this.hi  = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
    this.lo  = ( this.lo << 1                   ^ mask) >>> 0;
    return this;
};

/**
 * Zig-zag decodes this long bits.
 * @returns {util.LongBits} `this`
 */
LongBits.prototype.zzDecode = function zzDecode() {
    var mask = -(this.lo & 1);
    this.lo  = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
    this.hi  = ( this.hi >>> 1                  ^ mask) >>> 0;
    return this;
};

/**
 * Calculates the length of this longbits when encoded as a varint.
 * @returns {number} Length
 */
LongBits.prototype.length = function length() {
    var part0 =  this.lo,
        part1 = (this.lo >>> 28 | this.hi << 4) >>> 0,
        part2 =  this.hi >>> 24;
    return part2 === 0
         ? part1 === 0
           ? part0 < 16384
             ? part0 < 128 ? 1 : 2
             : part0 < 2097152 ? 3 : 4
           : part1 < 16384
             ? part1 < 128 ? 5 : 6
             : part1 < 2097152 ? 7 : 8
         : part2 < 128 ? 9 : 10;
};


/***/ }),

/***/ "../node_modules/protobufjs/src/util/minimal.js":
/*!******************************************************!*\
  !*** ../node_modules/protobufjs/src/util/minimal.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var util = exports;

// used to return a Promise where callback is omitted
util.asPromise = __webpack_require__(/*! @protobufjs/aspromise */ "../node_modules/@protobufjs/aspromise/index.js");

// converts to / from base64 encoded strings
util.base64 = __webpack_require__(/*! @protobufjs/base64 */ "../node_modules/@protobufjs/base64/index.js");

// base class of rpc.Service
util.EventEmitter = __webpack_require__(/*! @protobufjs/eventemitter */ "../node_modules/@protobufjs/eventemitter/index.js");

// float handling accross browsers
util.float = __webpack_require__(/*! @protobufjs/float */ "../node_modules/@protobufjs/float/index.js");

// requires modules optionally and hides the call from bundlers
util.inquire = __webpack_require__(/*! @protobufjs/inquire */ "../node_modules/@protobufjs/inquire/index.js");

// converts to / from utf8 encoded strings
util.utf8 = __webpack_require__(/*! @protobufjs/utf8 */ "../node_modules/@protobufjs/utf8/index.js");

// provides a node-like buffer pool in the browser
util.pool = __webpack_require__(/*! @protobufjs/pool */ "../node_modules/@protobufjs/pool/index.js");

// utility to work with the low and high bits of a 64 bit value
util.LongBits = __webpack_require__(/*! ./longbits */ "../node_modules/protobufjs/src/util/longbits.js");

/**
 * Whether running within node or not.
 * @memberof util
 * @type {boolean}
 */
util.isNode = Boolean(typeof __webpack_require__.g !== "undefined"
                   && __webpack_require__.g
                   && __webpack_require__.g.process
                   && __webpack_require__.g.process.versions
                   && __webpack_require__.g.process.versions.node);

/**
 * Global object reference.
 * @memberof util
 * @type {Object}
 */
util.global = util.isNode && __webpack_require__.g
           || typeof window !== "undefined" && window
           || typeof self   !== "undefined" && self
           || this; // eslint-disable-line no-invalid-this

/**
 * An immuable empty array.
 * @memberof util
 * @type {Array.<*>}
 * @const
 */
util.emptyArray = Object.freeze ? Object.freeze([]) : /* istanbul ignore next */ []; // used on prototypes

/**
 * An immutable empty object.
 * @type {Object}
 * @const
 */
util.emptyObject = Object.freeze ? Object.freeze({}) : /* istanbul ignore next */ {}; // used on prototypes

/**
 * Tests if the specified value is an integer.
 * @function
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is an integer
 */
util.isInteger = Number.isInteger || /* istanbul ignore next */ function isInteger(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
};

/**
 * Tests if the specified value is a string.
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is a string
 */
util.isString = function isString(value) {
    return typeof value === "string" || value instanceof String;
};

/**
 * Tests if the specified value is a non-null object.
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is a non-null object
 */
util.isObject = function isObject(value) {
    return value && typeof value === "object";
};

/**
 * Checks if a property on a message is considered to be present.
 * This is an alias of {@link util.isSet}.
 * @function
 * @param {Object} obj Plain object or message instance
 * @param {string} prop Property name
 * @returns {boolean} `true` if considered to be present, otherwise `false`
 */
util.isset =

/**
 * Checks if a property on a message is considered to be present.
 * @param {Object} obj Plain object or message instance
 * @param {string} prop Property name
 * @returns {boolean} `true` if considered to be present, otherwise `false`
 */
util.isSet = function isSet(obj, prop) {
    var value = obj[prop];
    if (value != null && obj.hasOwnProperty(prop)) // eslint-disable-line eqeqeq, no-prototype-builtins
        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
    return false;
};

/**
 * Any compatible Buffer instance.
 * This is a minimal stand-alone definition of a Buffer instance. The actual type is that exported by node's typings.
 * @interface Buffer
 * @extends Uint8Array
 */

/**
 * Node's Buffer class if available.
 * @type {Constructor<Buffer>}
 */
util.Buffer = (function() {
    try {
        var Buffer = util.inquire("buffer").Buffer;
        // refuse to use non-node buffers if not explicitly assigned (perf reasons):
        return Buffer.prototype.utf8Write ? Buffer : /* istanbul ignore next */ null;
    } catch (e) {
        /* istanbul ignore next */
        return null;
    }
})();

// Internal alias of or polyfull for Buffer.from.
util._Buffer_from = null;

// Internal alias of or polyfill for Buffer.allocUnsafe.
util._Buffer_allocUnsafe = null;

/**
 * Creates a new buffer of whatever type supported by the environment.
 * @param {number|number[]} [sizeOrArray=0] Buffer size or number array
 * @returns {Uint8Array|Buffer} Buffer
 */
util.newBuffer = function newBuffer(sizeOrArray) {
    /* istanbul ignore next */
    return typeof sizeOrArray === "number"
        ? util.Buffer
            ? util._Buffer_allocUnsafe(sizeOrArray)
            : new util.Array(sizeOrArray)
        : util.Buffer
            ? util._Buffer_from(sizeOrArray)
            : typeof Uint8Array === "undefined"
                ? sizeOrArray
                : new Uint8Array(sizeOrArray);
};

/**
 * Array implementation used in the browser. `Uint8Array` if supported, otherwise `Array`.
 * @type {Constructor<Uint8Array>}
 */
util.Array = typeof Uint8Array !== "undefined" ? Uint8Array /* istanbul ignore next */ : Array;

/**
 * Any compatible Long instance.
 * This is a minimal stand-alone definition of a Long instance. The actual type is that exported by long.js.
 * @interface Long
 * @property {number} low Low bits
 * @property {number} high High bits
 * @property {boolean} unsigned Whether unsigned or not
 */

/**
 * Long.js's Long class if available.
 * @type {Constructor<Long>}
 */
util.Long = /* istanbul ignore next */ util.global.dcodeIO && /* istanbul ignore next */ util.global.dcodeIO.Long
         || /* istanbul ignore next */ util.global.Long
         || util.inquire("long");

/**
 * Regular expression used to verify 2 bit (`bool`) map keys.
 * @type {RegExp}
 * @const
 */
util.key2Re = /^true|false|0|1$/;

/**
 * Regular expression used to verify 32 bit (`int32` etc.) map keys.
 * @type {RegExp}
 * @const
 */
util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;

/**
 * Regular expression used to verify 64 bit (`int64` etc.) map keys.
 * @type {RegExp}
 * @const
 */
util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;

/**
 * Converts a number or long to an 8 characters long hash string.
 * @param {Long|number} value Value to convert
 * @returns {string} Hash
 */
util.longToHash = function longToHash(value) {
    return value
        ? util.LongBits.from(value).toHash()
        : util.LongBits.zeroHash;
};

/**
 * Converts an 8 characters long hash string to a long or number.
 * @param {string} hash Hash
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {Long|number} Original value
 */
util.longFromHash = function longFromHash(hash, unsigned) {
    var bits = util.LongBits.fromHash(hash);
    if (util.Long)
        return util.Long.fromBits(bits.lo, bits.hi, unsigned);
    return bits.toNumber(Boolean(unsigned));
};

/**
 * Merges the properties of the source object into the destination object.
 * @memberof util
 * @param {Object.<string,*>} dst Destination object
 * @param {Object.<string,*>} src Source object
 * @param {boolean} [ifNotSet=false] Merges only if the key is not already set
 * @returns {Object.<string,*>} Destination object
 */
function merge(dst, src, ifNotSet) { // used by converters
    for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
        if (dst[keys[i]] === undefined || !ifNotSet)
            dst[keys[i]] = src[keys[i]];
    return dst;
}

util.merge = merge;

/**
 * Converts the first character of a string to lower case.
 * @param {string} str String to convert
 * @returns {string} Converted string
 */
util.lcFirst = function lcFirst(str) {
    return str.charAt(0).toLowerCase() + str.substring(1);
};

/**
 * Creates a custom error constructor.
 * @memberof util
 * @param {string} name Error name
 * @returns {Constructor<Error>} Custom error constructor
 */
function newError(name) {

    function CustomError(message, properties) {

        if (!(this instanceof CustomError))
            return new CustomError(message, properties);

        // Error.call(this, message);
        // ^ just returns a new error instance because the ctor can be called as a function

        Object.defineProperty(this, "message", { get: function() { return message; } });

        /* istanbul ignore next */
        if (Error.captureStackTrace) // node
            Error.captureStackTrace(this, CustomError);
        else
            Object.defineProperty(this, "stack", { value: new Error().stack || "" });

        if (properties)
            merge(this, properties);
    }

    (CustomError.prototype = Object.create(Error.prototype)).constructor = CustomError;

    Object.defineProperty(CustomError.prototype, "name", { get: function() { return name; } });

    CustomError.prototype.toString = function toString() {
        return this.name + ": " + this.message;
    };

    return CustomError;
}

util.newError = newError;

/**
 * Constructs a new protocol error.
 * @classdesc Error subclass indicating a protocol specifc error.
 * @memberof util
 * @extends Error
 * @template T extends Message<T>
 * @constructor
 * @param {string} message Error message
 * @param {Object.<string,*>} [properties] Additional properties
 * @example
 * try {
 *     MyMessage.decode(someBuffer); // throws if required fields are missing
 * } catch (e) {
 *     if (e instanceof ProtocolError && e.instance)
 *         console.log("decoded so far: " + JSON.stringify(e.instance));
 * }
 */
util.ProtocolError = newError("ProtocolError");

/**
 * So far decoded message instance.
 * @name util.ProtocolError#instance
 * @type {Message<T>}
 */

/**
 * A OneOf getter as returned by {@link util.oneOfGetter}.
 * @typedef OneOfGetter
 * @type {function}
 * @returns {string|undefined} Set field name, if any
 */

/**
 * Builds a getter for a oneof's present field name.
 * @param {string[]} fieldNames Field names
 * @returns {OneOfGetter} Unbound getter
 */
util.oneOfGetter = function getOneOf(fieldNames) {
    var fieldMap = {};
    for (var i = 0; i < fieldNames.length; ++i)
        fieldMap[fieldNames[i]] = 1;

    /**
     * @returns {string|undefined} Set field name, if any
     * @this Object
     * @ignore
     */
    return function() { // eslint-disable-line consistent-return
        for (var keys = Object.keys(this), i = keys.length - 1; i > -1; --i)
            if (fieldMap[keys[i]] === 1 && this[keys[i]] !== undefined && this[keys[i]] !== null)
                return keys[i];
    };
};

/**
 * A OneOf setter as returned by {@link util.oneOfSetter}.
 * @typedef OneOfSetter
 * @type {function}
 * @param {string|undefined} value Field name
 * @returns {undefined}
 */

/**
 * Builds a setter for a oneof's present field name.
 * @param {string[]} fieldNames Field names
 * @returns {OneOfSetter} Unbound setter
 */
util.oneOfSetter = function setOneOf(fieldNames) {

    /**
     * @param {string} name Field name
     * @returns {undefined}
     * @this Object
     * @ignore
     */
    return function(name) {
        for (var i = 0; i < fieldNames.length; ++i)
            if (fieldNames[i] !== name)
                delete this[fieldNames[i]];
    };
};

/**
 * Default conversion options used for {@link Message#toJSON} implementations.
 *
 * These options are close to proto3's JSON mapping with the exception that internal types like Any are handled just like messages. More precisely:
 *
 * - Longs become strings
 * - Enums become string keys
 * - Bytes become base64 encoded strings
 * - (Sub-)Messages become plain objects
 * - Maps become plain objects with all string keys
 * - Repeated fields become arrays
 * - NaN and Infinity for float and double fields become strings
 *
 * @type {IConversionOptions}
 * @see https://developers.google.com/protocol-buffers/docs/proto3?hl=en#json
 */
util.toJSONOptions = {
    longs: String,
    enums: String,
    bytes: String,
    json: true
};

// Sets up buffer utility according to the environment (called in index-minimal)
util._configure = function() {
    var Buffer = util.Buffer;
    /* istanbul ignore if */
    if (!Buffer) {
        util._Buffer_from = util._Buffer_allocUnsafe = null;
        return;
    }
    // because node 4.x buffers are incompatible & immutable
    // see: https://github.com/dcodeIO/protobuf.js/pull/665
    util._Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from ||
        /* istanbul ignore next */
        function Buffer_from(value, encoding) {
            return new Buffer(value, encoding);
        };
    util._Buffer_allocUnsafe = Buffer.allocUnsafe ||
        /* istanbul ignore next */
        function Buffer_allocUnsafe(size) {
            return new Buffer(size);
        };
};


/***/ }),

/***/ "../node_modules/protobufjs/src/writer.js":
/*!************************************************!*\
  !*** ../node_modules/protobufjs/src/writer.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Writer;

var util      = __webpack_require__(/*! ./util/minimal */ "../node_modules/protobufjs/src/util/minimal.js");

var BufferWriter; // cyclic

var LongBits  = util.LongBits,
    base64    = util.base64,
    utf8      = util.utf8;

/**
 * Constructs a new writer operation instance.
 * @classdesc Scheduled writer operation.
 * @constructor
 * @param {function(*, Uint8Array, number)} fn Function to call
 * @param {number} len Value byte length
 * @param {*} val Value to write
 * @ignore
 */
function Op(fn, len, val) {

    /**
     * Function to call.
     * @type {function(Uint8Array, number, *)}
     */
    this.fn = fn;

    /**
     * Value byte length.
     * @type {number}
     */
    this.len = len;

    /**
     * Next operation.
     * @type {Writer.Op|undefined}
     */
    this.next = undefined;

    /**
     * Value to write.
     * @type {*}
     */
    this.val = val; // type varies
}

/* istanbul ignore next */
function noop() {} // eslint-disable-line no-empty-function

/**
 * Constructs a new writer state instance.
 * @classdesc Copied writer state.
 * @memberof Writer
 * @constructor
 * @param {Writer} writer Writer to copy state from
 * @ignore
 */
function State(writer) {

    /**
     * Current head.
     * @type {Writer.Op}
     */
    this.head = writer.head;

    /**
     * Current tail.
     * @type {Writer.Op}
     */
    this.tail = writer.tail;

    /**
     * Current buffer length.
     * @type {number}
     */
    this.len = writer.len;

    /**
     * Next state.
     * @type {State|null}
     */
    this.next = writer.states;
}

/**
 * Constructs a new writer instance.
 * @classdesc Wire format writer using `Uint8Array` if available, otherwise `Array`.
 * @constructor
 */
function Writer() {

    /**
     * Current length.
     * @type {number}
     */
    this.len = 0;

    /**
     * Operations head.
     * @type {Object}
     */
    this.head = new Op(noop, 0, 0);

    /**
     * Operations tail
     * @type {Object}
     */
    this.tail = this.head;

    /**
     * Linked forked states.
     * @type {Object|null}
     */
    this.states = null;

    // When a value is written, the writer calculates its byte length and puts it into a linked
    // list of operations to perform when finish() is called. This both allows us to allocate
    // buffers of the exact required size and reduces the amount of work we have to do compared
    // to first calculating over objects and then encoding over objects. In our case, the encoding
    // part is just a linked list walk calling operations with already prepared values.
}

var create = function create() {
    return util.Buffer
        ? function create_buffer_setup() {
            return (Writer.create = function create_buffer() {
                return new BufferWriter();
            })();
        }
        /* istanbul ignore next */
        : function create_array() {
            return new Writer();
        };
};

/**
 * Creates a new writer.
 * @function
 * @returns {BufferWriter|Writer} A {@link BufferWriter} when Buffers are supported, otherwise a {@link Writer}
 */
Writer.create = create();

/**
 * Allocates a buffer of the specified size.
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */
Writer.alloc = function alloc(size) {
    return new util.Array(size);
};

// Use Uint8Array buffer pool in the browser, just like node does with buffers
/* istanbul ignore else */
if (util.Array !== Array)
    Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);

/**
 * Pushes a new operation to the queue.
 * @param {function(Uint8Array, number, *)} fn Function to call
 * @param {number} len Value byte length
 * @param {number} val Value to write
 * @returns {Writer} `this`
 * @private
 */
Writer.prototype._push = function push(fn, len, val) {
    this.tail = this.tail.next = new Op(fn, len, val);
    this.len += len;
    return this;
};

function writeByte(val, buf, pos) {
    buf[pos] = val & 255;
}

function writeVarint32(val, buf, pos) {
    while (val > 127) {
        buf[pos++] = val & 127 | 128;
        val >>>= 7;
    }
    buf[pos] = val;
}

/**
 * Constructs a new varint writer operation instance.
 * @classdesc Scheduled varint writer operation.
 * @extends Op
 * @constructor
 * @param {number} len Value byte length
 * @param {number} val Value to write
 * @ignore
 */
function VarintOp(len, val) {
    this.len = len;
    this.next = undefined;
    this.val = val;
}

VarintOp.prototype = Object.create(Op.prototype);
VarintOp.prototype.fn = writeVarint32;

/**
 * Writes an unsigned 32 bit value as a varint.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.uint32 = function write_uint32(value) {
    // here, the call to this.push has been inlined and a varint specific Op subclass is used.
    // uint32 is by far the most frequently used operation and benefits significantly from this.
    this.len += (this.tail = this.tail.next = new VarintOp(
        (value = value >>> 0)
                < 128       ? 1
        : value < 16384     ? 2
        : value < 2097152   ? 3
        : value < 268435456 ? 4
        :                     5,
    value)).len;
    return this;
};

/**
 * Writes a signed 32 bit value as a varint.
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.int32 = function write_int32(value) {
    return value < 0
        ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) // 10 bytes per spec
        : this.uint32(value);
};

/**
 * Writes a 32 bit value as a varint, zig-zag encoded.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.sint32 = function write_sint32(value) {
    return this.uint32((value << 1 ^ value >> 31) >>> 0);
};

function writeVarint64(val, buf, pos) {
    while (val.hi) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
        val.hi >>>= 7;
    }
    while (val.lo > 127) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = val.lo >>> 7;
    }
    buf[pos++] = val.lo;
}

/**
 * Writes an unsigned 64 bit value as a varint.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.uint64 = function write_uint64(value) {
    var bits = LongBits.from(value);
    return this._push(writeVarint64, bits.length(), bits);
};

/**
 * Writes a signed 64 bit value as a varint.
 * @function
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.int64 = Writer.prototype.uint64;

/**
 * Writes a signed 64 bit value as a varint, zig-zag encoded.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.sint64 = function write_sint64(value) {
    var bits = LongBits.from(value).zzEncode();
    return this._push(writeVarint64, bits.length(), bits);
};

/**
 * Writes a boolish value as a varint.
 * @param {boolean} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.bool = function write_bool(value) {
    return this._push(writeByte, 1, value ? 1 : 0);
};

function writeFixed32(val, buf, pos) {
    buf[pos    ] =  val         & 255;
    buf[pos + 1] =  val >>> 8   & 255;
    buf[pos + 2] =  val >>> 16  & 255;
    buf[pos + 3] =  val >>> 24;
}

/**
 * Writes an unsigned 32 bit value as fixed 32 bits.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.fixed32 = function write_fixed32(value) {
    return this._push(writeFixed32, 4, value >>> 0);
};

/**
 * Writes a signed 32 bit value as fixed 32 bits.
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.sfixed32 = Writer.prototype.fixed32;

/**
 * Writes an unsigned 64 bit value as fixed 64 bits.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.fixed64 = function write_fixed64(value) {
    var bits = LongBits.from(value);
    return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
};

/**
 * Writes a signed 64 bit value as fixed 64 bits.
 * @function
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.sfixed64 = Writer.prototype.fixed64;

/**
 * Writes a float (32 bit).
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.float = function write_float(value) {
    return this._push(util.float.writeFloatLE, 4, value);
};

/**
 * Writes a double (64 bit float).
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.double = function write_double(value) {
    return this._push(util.float.writeDoubleLE, 8, value);
};

var writeBytes = util.Array.prototype.set
    ? function writeBytes_set(val, buf, pos) {
        buf.set(val, pos); // also works for plain array values
    }
    /* istanbul ignore next */
    : function writeBytes_for(val, buf, pos) {
        for (var i = 0; i < val.length; ++i)
            buf[pos + i] = val[i];
    };

/**
 * Writes a sequence of bytes.
 * @param {Uint8Array|string} value Buffer or base64 encoded string to write
 * @returns {Writer} `this`
 */
Writer.prototype.bytes = function write_bytes(value) {
    var len = value.length >>> 0;
    if (!len)
        return this._push(writeByte, 1, 0);
    if (util.isString(value)) {
        var buf = Writer.alloc(len = base64.length(value));
        base64.decode(value, buf, 0);
        value = buf;
    }
    return this.uint32(len)._push(writeBytes, len, value);
};

/**
 * Writes a string.
 * @param {string} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.string = function write_string(value) {
    var len = utf8.length(value);
    return len
        ? this.uint32(len)._push(utf8.write, len, value)
        : this._push(writeByte, 1, 0);
};

/**
 * Forks this writer's state by pushing it to a stack.
 * Calling {@link Writer#reset|reset} or {@link Writer#ldelim|ldelim} resets the writer to the previous state.
 * @returns {Writer} `this`
 */
Writer.prototype.fork = function fork() {
    this.states = new State(this);
    this.head = this.tail = new Op(noop, 0, 0);
    this.len = 0;
    return this;
};

/**
 * Resets this instance to the last state.
 * @returns {Writer} `this`
 */
Writer.prototype.reset = function reset() {
    if (this.states) {
        this.head   = this.states.head;
        this.tail   = this.states.tail;
        this.len    = this.states.len;
        this.states = this.states.next;
    } else {
        this.head = this.tail = new Op(noop, 0, 0);
        this.len  = 0;
    }
    return this;
};

/**
 * Resets to the last state and appends the fork state's current write length as a varint followed by its operations.
 * @returns {Writer} `this`
 */
Writer.prototype.ldelim = function ldelim() {
    var head = this.head,
        tail = this.tail,
        len  = this.len;
    this.reset().uint32(len);
    if (len) {
        this.tail.next = head.next; // skip noop
        this.tail = tail;
        this.len += len;
    }
    return this;
};

/**
 * Finishes the write operation.
 * @returns {Uint8Array} Finished buffer
 */
Writer.prototype.finish = function finish() {
    var head = this.head.next, // skip noop
        buf  = this.constructor.alloc(this.len),
        pos  = 0;
    while (head) {
        head.fn(head.val, buf, pos);
        pos += head.len;
        head = head.next;
    }
    // this.head = this.tail = null;
    return buf;
};

Writer._configure = function(BufferWriter_) {
    BufferWriter = BufferWriter_;
    Writer.create = create();
    BufferWriter._configure();
};


/***/ }),

/***/ "../node_modules/protobufjs/src/writer_buffer.js":
/*!*******************************************************!*\
  !*** ../node_modules/protobufjs/src/writer_buffer.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = BufferWriter;

// extends Writer
var Writer = __webpack_require__(/*! ./writer */ "../node_modules/protobufjs/src/writer.js");
(BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;

var util = __webpack_require__(/*! ./util/minimal */ "../node_modules/protobufjs/src/util/minimal.js");

/**
 * Constructs a new buffer writer instance.
 * @classdesc Wire format writer using node buffers.
 * @extends Writer
 * @constructor
 */
function BufferWriter() {
    Writer.call(this);
}

BufferWriter._configure = function () {
    /**
     * Allocates a buffer of the specified size.
     * @function
     * @param {number} size Buffer size
     * @returns {Buffer} Buffer
     */
    BufferWriter.alloc = util._Buffer_allocUnsafe;

    BufferWriter.writeBytesBuffer = util.Buffer && util.Buffer.prototype instanceof Uint8Array && util.Buffer.prototype.set.name === "set"
        ? function writeBytesBuffer_set(val, buf, pos) {
          buf.set(val, pos); // faster than copy (requires node >= 4 where Buffers extend Uint8Array and set is properly inherited)
          // also works for plain array values
        }
        /* istanbul ignore next */
        : function writeBytesBuffer_copy(val, buf, pos) {
          if (val.copy) // Buffer values
            val.copy(buf, pos, 0, val.length);
          else for (var i = 0; i < val.length;) // plain array values
            buf[pos++] = val[i++];
        };
};


/**
 * @override
 */
BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
    if (util.isString(value))
        value = util._Buffer_from(value, "base64");
    var len = value.length >>> 0;
    this.uint32(len);
    if (len)
        this._push(BufferWriter.writeBytesBuffer, len, value);
    return this;
};

function writeStringBuffer(val, buf, pos) {
    if (val.length < 40) // plain js is faster for short strings (probably due to redundant assertions)
        util.utf8.write(val, buf, pos);
    else if (buf.utf8Write)
        buf.utf8Write(val, pos);
    else
        buf.write(val, pos);
}

/**
 * @override
 */
BufferWriter.prototype.string = function write_string_buffer(value) {
    var len = util.Buffer.byteLength(value);
    this.uint32(len);
    if (len)
        this._push(writeStringBuffer, len, value);
    return this;
};


/**
 * Finishes the write operation.
 * @name BufferWriter#finish
 * @function
 * @returns {Buffer} Finished buffer
 */

BufferWriter._configure();


/***/ }),

/***/ "../node_modules/rtcpeerconnection-shim/rtcpeerconnection.js":
/*!*******************************************************************!*\
  !*** ../node_modules/rtcpeerconnection-shim/rtcpeerconnection.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var SDPUtils = __webpack_require__(/*! sdp */ "../node_modules/sdp/sdp.js");

function fixStatsType(stat) {
  return {
    inboundrtp: 'inbound-rtp',
    outboundrtp: 'outbound-rtp',
    candidatepair: 'candidate-pair',
    localcandidate: 'local-candidate',
    remotecandidate: 'remote-candidate'
  }[stat.type] || stat.type;
}

function writeMediaSection(transceiver, caps, type, stream, dtlsRole) {
  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

  // Map ICE parameters (ufrag, pwd) to SDP.
  sdp += SDPUtils.writeIceParameters(
      transceiver.iceGatherer.getLocalParameters());

  // Map DTLS parameters to SDP.
  sdp += SDPUtils.writeDtlsParameters(
      transceiver.dtlsTransport.getLocalParameters(),
      type === 'offer' ? 'actpass' : dtlsRole || 'active');

  sdp += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp += 'a=recvonly\r\n';
  } else {
    sdp += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    var trackId = transceiver.rtpSender._initialTrackId ||
        transceiver.rtpSender.track.id;
    transceiver.rtpSender._initialTrackId = trackId;
    // spec.
    var msid = 'msid:' + (stream ? stream.id : '-') + ' ' +
        trackId + '\r\n';
    sdp += 'a=' + msid;
    // for Chrome. Legacy should no longer be required.
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
        ' ' + msid;

    // RTX
    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
          ' ' + msid;
      sdp += 'a=ssrc-group:FID ' +
          transceiver.sendEncodingParameters[0].ssrc + ' ' +
          transceiver.sendEncodingParameters[0].rtx.ssrc +
          '\r\n';
    }
  }
  // FIXME: this should be written by writeRtpDescription.
  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
      ' cname:' + SDPUtils.localCName + '\r\n';
  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
        ' cname:' + SDPUtils.localCName + '\r\n';
  }
  return sdp;
}

// Edge does not like
// 1) stun: filtered after 14393 unless ?transport=udp is present
// 2) turn: that does not have all of turn:host:port?transport=udp
// 3) turn: with ipv6 addresses
// 4) turn: occurring muliple times
function filterIceServers(iceServers, edgeVersion) {
  var hasTurn = false;
  iceServers = JSON.parse(JSON.stringify(iceServers));
  return iceServers.filter(function(server) {
    if (server && (server.urls || server.url)) {
      var urls = server.urls || server.url;
      if (server.url && !server.urls) {
        console.warn('RTCIceServer.url is deprecated! Use urls instead.');
      }
      var isString = typeof urls === 'string';
      if (isString) {
        urls = [urls];
      }
      urls = urls.filter(function(url) {
        var validTurn = url.indexOf('turn:') === 0 &&
            url.indexOf('transport=udp') !== -1 &&
            url.indexOf('turn:[') === -1 &&
            !hasTurn;

        if (validTurn) {
          hasTurn = true;
          return true;
        }
        return url.indexOf('stun:') === 0 && edgeVersion >= 14393 &&
            url.indexOf('?transport=udp') === -1;
      });

      delete server.url;
      server.urls = isString ? urls[0] : urls;
      return !!urls.length;
    }
  });
}

// Determines the intersection of local and remote capabilities.
function getCommonCapabilities(localCapabilities, remoteCapabilities) {
  var commonCapabilities = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: []
  };

  var findCodecByPayloadType = function(pt, codecs) {
    pt = parseInt(pt, 10);
    for (var i = 0; i < codecs.length; i++) {
      if (codecs[i].payloadType === pt ||
          codecs[i].preferredPayloadType === pt) {
        return codecs[i];
      }
    }
  };

  var rtxCapabilityMatches = function(lRtx, rRtx, lCodecs, rCodecs) {
    var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
    var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
    return lCodec && rCodec &&
        lCodec.name.toLowerCase() === rCodec.name.toLowerCase();
  };

  localCapabilities.codecs.forEach(function(lCodec) {
    for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
      var rCodec = remoteCapabilities.codecs[i];
      if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() &&
          lCodec.clockRate === rCodec.clockRate) {
        if (lCodec.name.toLowerCase() === 'rtx' &&
            lCodec.parameters && rCodec.parameters.apt) {
          // for RTX we need to find the local rtx that has a apt
          // which points to the same local codec as the remote one.
          if (!rtxCapabilityMatches(lCodec, rCodec,
              localCapabilities.codecs, remoteCapabilities.codecs)) {
            continue;
          }
        }
        rCodec = JSON.parse(JSON.stringify(rCodec)); // deepcopy
        // number of channels is the highest common number of channels
        rCodec.numChannels = Math.min(lCodec.numChannels,
            rCodec.numChannels);
        // push rCodec so we reply with offerer payload type
        commonCapabilities.codecs.push(rCodec);

        // determine common feedback mechanisms
        rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function(fb) {
          for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
            if (lCodec.rtcpFeedback[j].type === fb.type &&
                lCodec.rtcpFeedback[j].parameter === fb.parameter) {
              return true;
            }
          }
          return false;
        });
        // FIXME: also need to determine .parameters
        //  see https://github.com/openpeer/ortc/issues/569
        break;
      }
    }
  });

  localCapabilities.headerExtensions.forEach(function(lHeaderExtension) {
    for (var i = 0; i < remoteCapabilities.headerExtensions.length;
         i++) {
      var rHeaderExtension = remoteCapabilities.headerExtensions[i];
      if (lHeaderExtension.uri === rHeaderExtension.uri) {
        commonCapabilities.headerExtensions.push(rHeaderExtension);
        break;
      }
    }
  });

  // FIXME: fecMechanisms
  return commonCapabilities;
}

// is action=setLocalDescription with type allowed in signalingState
function isActionAllowedInSignalingState(action, type, signalingState) {
  return {
    offer: {
      setLocalDescription: ['stable', 'have-local-offer'],
      setRemoteDescription: ['stable', 'have-remote-offer']
    },
    answer: {
      setLocalDescription: ['have-remote-offer', 'have-local-pranswer'],
      setRemoteDescription: ['have-local-offer', 'have-remote-pranswer']
    }
  }[type][action].indexOf(signalingState) !== -1;
}

function maybeAddCandidate(iceTransport, candidate) {
  // Edge's internal representation adds some fields therefore
  // not all fieldѕ are taken into account.
  var alreadyAdded = iceTransport.getRemoteCandidates()
      .find(function(remoteCandidate) {
        return candidate.foundation === remoteCandidate.foundation &&
            candidate.ip === remoteCandidate.ip &&
            candidate.port === remoteCandidate.port &&
            candidate.priority === remoteCandidate.priority &&
            candidate.protocol === remoteCandidate.protocol &&
            candidate.type === remoteCandidate.type;
      });
  if (!alreadyAdded) {
    iceTransport.addRemoteCandidate(candidate);
  }
  return !alreadyAdded;
}


function makeError(name, description) {
  var e = new Error(description);
  e.name = name;
  // legacy error codes from https://heycam.github.io/webidl/#idl-DOMException-error-names
  e.code = {
    NotSupportedError: 9,
    InvalidStateError: 11,
    InvalidAccessError: 15,
    TypeError: undefined,
    OperationError: undefined
  }[name];
  return e;
}

module.exports = function(window, edgeVersion) {
  // https://w3c.github.io/mediacapture-main/#mediastream
  // Helper function to add the track to the stream and
  // dispatch the event ourselves.
  function addTrackToStreamAndFireEvent(track, stream) {
    stream.addTrack(track);
    stream.dispatchEvent(new window.MediaStreamTrackEvent('addtrack',
        {track: track}));
  }

  function removeTrackFromStreamAndFireEvent(track, stream) {
    stream.removeTrack(track);
    stream.dispatchEvent(new window.MediaStreamTrackEvent('removetrack',
        {track: track}));
  }

  function fireAddTrack(pc, track, receiver, streams) {
    var trackEvent = new Event('track');
    trackEvent.track = track;
    trackEvent.receiver = receiver;
    trackEvent.transceiver = {receiver: receiver};
    trackEvent.streams = streams;
    window.setTimeout(function() {
      pc._dispatchEvent('track', trackEvent);
    });
  }

  var RTCPeerConnection = function(config) {
    var pc = this;

    var _eventTarget = document.createDocumentFragment();
    ['addEventListener', 'removeEventListener', 'dispatchEvent']
        .forEach(function(method) {
          pc[method] = _eventTarget[method].bind(_eventTarget);
        });

    this.canTrickleIceCandidates = null;

    this.needNegotiation = false;

    this.localStreams = [];
    this.remoteStreams = [];

    this._localDescription = null;
    this._remoteDescription = null;

    this.signalingState = 'stable';
    this.iceConnectionState = 'new';
    this.connectionState = 'new';
    this.iceGatheringState = 'new';

    config = JSON.parse(JSON.stringify(config || {}));

    this.usingBundle = config.bundlePolicy === 'max-bundle';
    if (config.rtcpMuxPolicy === 'negotiate') {
      throw(makeError('NotSupportedError',
          'rtcpMuxPolicy \'negotiate\' is not supported'));
    } else if (!config.rtcpMuxPolicy) {
      config.rtcpMuxPolicy = 'require';
    }

    switch (config.iceTransportPolicy) {
      case 'all':
      case 'relay':
        break;
      default:
        config.iceTransportPolicy = 'all';
        break;
    }

    switch (config.bundlePolicy) {
      case 'balanced':
      case 'max-compat':
      case 'max-bundle':
        break;
      default:
        config.bundlePolicy = 'balanced';
        break;
    }

    config.iceServers = filterIceServers(config.iceServers || [], edgeVersion);

    this._iceGatherers = [];
    if (config.iceCandidatePoolSize) {
      for (var i = config.iceCandidatePoolSize; i > 0; i--) {
        this._iceGatherers.push(new window.RTCIceGatherer({
          iceServers: config.iceServers,
          gatherPolicy: config.iceTransportPolicy
        }));
      }
    } else {
      config.iceCandidatePoolSize = 0;
    }

    this._config = config;

    // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
    // everything that is needed to describe a SDP m-line.
    this.transceivers = [];

    this._sdpSessionId = SDPUtils.generateSessionId();
    this._sdpSessionVersion = 0;

    this._dtlsRole = undefined; // role for a=setup to use in answers.

    this._isClosed = false;
  };

  Object.defineProperty(RTCPeerConnection.prototype, 'localDescription', {
    configurable: true,
    get: function() {
      return this._localDescription;
    }
  });
  Object.defineProperty(RTCPeerConnection.prototype, 'remoteDescription', {
    configurable: true,
    get: function() {
      return this._remoteDescription;
    }
  });

  // set up event handlers on prototype
  RTCPeerConnection.prototype.onicecandidate = null;
  RTCPeerConnection.prototype.onaddstream = null;
  RTCPeerConnection.prototype.ontrack = null;
  RTCPeerConnection.prototype.onremovestream = null;
  RTCPeerConnection.prototype.onsignalingstatechange = null;
  RTCPeerConnection.prototype.oniceconnectionstatechange = null;
  RTCPeerConnection.prototype.onconnectionstatechange = null;
  RTCPeerConnection.prototype.onicegatheringstatechange = null;
  RTCPeerConnection.prototype.onnegotiationneeded = null;
  RTCPeerConnection.prototype.ondatachannel = null;

  RTCPeerConnection.prototype._dispatchEvent = function(name, event) {
    if (this._isClosed) {
      return;
    }
    this.dispatchEvent(event);
    if (typeof this['on' + name] === 'function') {
      this['on' + name](event);
    }
  };

  RTCPeerConnection.prototype._emitGatheringStateChange = function() {
    var event = new Event('icegatheringstatechange');
    this._dispatchEvent('icegatheringstatechange', event);
  };

  RTCPeerConnection.prototype.getConfiguration = function() {
    return this._config;
  };

  RTCPeerConnection.prototype.getLocalStreams = function() {
    return this.localStreams;
  };

  RTCPeerConnection.prototype.getRemoteStreams = function() {
    return this.remoteStreams;
  };

  // internal helper to create a transceiver object.
  // (which is not yet the same as the WebRTC 1.0 transceiver)
  RTCPeerConnection.prototype._createTransceiver = function(kind, doNotAdd) {
    var hasBundleTransport = this.transceivers.length > 0;
    var transceiver = {
      track: null,
      iceGatherer: null,
      iceTransport: null,
      dtlsTransport: null,
      localCapabilities: null,
      remoteCapabilities: null,
      rtpSender: null,
      rtpReceiver: null,
      kind: kind,
      mid: null,
      sendEncodingParameters: null,
      recvEncodingParameters: null,
      stream: null,
      associatedRemoteMediaStreams: [],
      wantReceive: true
    };
    if (this.usingBundle && hasBundleTransport) {
      transceiver.iceTransport = this.transceivers[0].iceTransport;
      transceiver.dtlsTransport = this.transceivers[0].dtlsTransport;
    } else {
      var transports = this._createIceAndDtlsTransports();
      transceiver.iceTransport = transports.iceTransport;
      transceiver.dtlsTransport = transports.dtlsTransport;
    }
    if (!doNotAdd) {
      this.transceivers.push(transceiver);
    }
    return transceiver;
  };

  RTCPeerConnection.prototype.addTrack = function(track, stream) {
    if (this._isClosed) {
      throw makeError('InvalidStateError',
          'Attempted to call addTrack on a closed peerconnection.');
    }

    var alreadyExists = this.transceivers.find(function(s) {
      return s.track === track;
    });

    if (alreadyExists) {
      throw makeError('InvalidAccessError', 'Track already exists.');
    }

    var transceiver;
    for (var i = 0; i < this.transceivers.length; i++) {
      if (!this.transceivers[i].track &&
          this.transceivers[i].kind === track.kind) {
        transceiver = this.transceivers[i];
      }
    }
    if (!transceiver) {
      transceiver = this._createTransceiver(track.kind);
    }

    this._maybeFireNegotiationNeeded();

    if (this.localStreams.indexOf(stream) === -1) {
      this.localStreams.push(stream);
    }

    transceiver.track = track;
    transceiver.stream = stream;
    transceiver.rtpSender = new window.RTCRtpSender(track,
        transceiver.dtlsTransport);
    return transceiver.rtpSender;
  };

  RTCPeerConnection.prototype.addStream = function(stream) {
    var pc = this;
    if (edgeVersion >= 15025) {
      stream.getTracks().forEach(function(track) {
        pc.addTrack(track, stream);
      });
    } else {
      // Clone is necessary for local demos mostly, attaching directly
      // to two different senders does not work (build 10547).
      // Fixed in 15025 (or earlier)
      var clonedStream = stream.clone();
      stream.getTracks().forEach(function(track, idx) {
        var clonedTrack = clonedStream.getTracks()[idx];
        track.addEventListener('enabled', function(event) {
          clonedTrack.enabled = event.enabled;
        });
      });
      clonedStream.getTracks().forEach(function(track) {
        pc.addTrack(track, clonedStream);
      });
    }
  };

  RTCPeerConnection.prototype.removeTrack = function(sender) {
    if (this._isClosed) {
      throw makeError('InvalidStateError',
          'Attempted to call removeTrack on a closed peerconnection.');
    }

    if (!(sender instanceof window.RTCRtpSender)) {
      throw new TypeError('Argument 1 of RTCPeerConnection.removeTrack ' +
          'does not implement interface RTCRtpSender.');
    }

    var transceiver = this.transceivers.find(function(t) {
      return t.rtpSender === sender;
    });

    if (!transceiver) {
      throw makeError('InvalidAccessError',
          'Sender was not created by this connection.');
    }
    var stream = transceiver.stream;

    transceiver.rtpSender.stop();
    transceiver.rtpSender = null;
    transceiver.track = null;
    transceiver.stream = null;

    // remove the stream from the set of local streams
    var localStreams = this.transceivers.map(function(t) {
      return t.stream;
    });
    if (localStreams.indexOf(stream) === -1 &&
        this.localStreams.indexOf(stream) > -1) {
      this.localStreams.splice(this.localStreams.indexOf(stream), 1);
    }

    this._maybeFireNegotiationNeeded();
  };

  RTCPeerConnection.prototype.removeStream = function(stream) {
    var pc = this;
    stream.getTracks().forEach(function(track) {
      var sender = pc.getSenders().find(function(s) {
        return s.track === track;
      });
      if (sender) {
        pc.removeTrack(sender);
      }
    });
  };

  RTCPeerConnection.prototype.getSenders = function() {
    return this.transceivers.filter(function(transceiver) {
      return !!transceiver.rtpSender;
    })
    .map(function(transceiver) {
      return transceiver.rtpSender;
    });
  };

  RTCPeerConnection.prototype.getReceivers = function() {
    return this.transceivers.filter(function(transceiver) {
      return !!transceiver.rtpReceiver;
    })
    .map(function(transceiver) {
      return transceiver.rtpReceiver;
    });
  };


  RTCPeerConnection.prototype._createIceGatherer = function(sdpMLineIndex,
      usingBundle) {
    var pc = this;
    if (usingBundle && sdpMLineIndex > 0) {
      return this.transceivers[0].iceGatherer;
    } else if (this._iceGatherers.length) {
      return this._iceGatherers.shift();
    }
    var iceGatherer = new window.RTCIceGatherer({
      iceServers: this._config.iceServers,
      gatherPolicy: this._config.iceTransportPolicy
    });
    Object.defineProperty(iceGatherer, 'state',
        {value: 'new', writable: true}
    );

    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = [];
    this.transceivers[sdpMLineIndex].bufferCandidates = function(event) {
      var end = !event.candidate || Object.keys(event.candidate).length === 0;
      // polyfill since RTCIceGatherer.state is not implemented in
      // Edge 10547 yet.
      iceGatherer.state = end ? 'completed' : 'gathering';
      if (pc.transceivers[sdpMLineIndex].bufferedCandidateEvents !== null) {
        pc.transceivers[sdpMLineIndex].bufferedCandidateEvents.push(event);
      }
    };
    iceGatherer.addEventListener('localcandidate',
      this.transceivers[sdpMLineIndex].bufferCandidates);
    return iceGatherer;
  };

  // start gathering from an RTCIceGatherer.
  RTCPeerConnection.prototype._gather = function(mid, sdpMLineIndex) {
    var pc = this;
    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
    if (iceGatherer.onlocalcandidate) {
      return;
    }
    var bufferedCandidateEvents =
      this.transceivers[sdpMLineIndex].bufferedCandidateEvents;
    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = null;
    iceGatherer.removeEventListener('localcandidate',
      this.transceivers[sdpMLineIndex].bufferCandidates);
    iceGatherer.onlocalcandidate = function(evt) {
      if (pc.usingBundle && sdpMLineIndex > 0) {
        // if we know that we use bundle we can drop candidates with
        // ѕdpMLineIndex > 0. If we don't do this then our state gets
        // confused since we dispose the extra ice gatherer.
        return;
      }
      var event = new Event('icecandidate');
      event.candidate = {sdpMid: mid, sdpMLineIndex: sdpMLineIndex};

      var cand = evt.candidate;
      // Edge emits an empty object for RTCIceCandidateComplete‥
      var end = !cand || Object.keys(cand).length === 0;
      if (end) {
        // polyfill since RTCIceGatherer.state is not implemented in
        // Edge 10547 yet.
        if (iceGatherer.state === 'new' || iceGatherer.state === 'gathering') {
          iceGatherer.state = 'completed';
        }
      } else {
        if (iceGatherer.state === 'new') {
          iceGatherer.state = 'gathering';
        }
        // RTCIceCandidate doesn't have a component, needs to be added
        cand.component = 1;
        // also the usernameFragment. TODO: update SDP to take both variants.
        cand.ufrag = iceGatherer.getLocalParameters().usernameFragment;

        var serializedCandidate = SDPUtils.writeCandidate(cand);
        event.candidate = Object.assign(event.candidate,
            SDPUtils.parseCandidate(serializedCandidate));

        event.candidate.candidate = serializedCandidate;
        event.candidate.toJSON = function() {
          return {
            candidate: event.candidate.candidate,
            sdpMid: event.candidate.sdpMid,
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            usernameFragment: event.candidate.usernameFragment
          };
        };
      }

      // update local description.
      var sections = SDPUtils.getMediaSections(pc._localDescription.sdp);
      if (!end) {
        sections[event.candidate.sdpMLineIndex] +=
            'a=' + event.candidate.candidate + '\r\n';
      } else {
        sections[event.candidate.sdpMLineIndex] +=
            'a=end-of-candidates\r\n';
      }
      pc._localDescription.sdp =
          SDPUtils.getDescription(pc._localDescription.sdp) +
          sections.join('');
      var complete = pc.transceivers.every(function(transceiver) {
        return transceiver.iceGatherer &&
            transceiver.iceGatherer.state === 'completed';
      });

      if (pc.iceGatheringState !== 'gathering') {
        pc.iceGatheringState = 'gathering';
        pc._emitGatheringStateChange();
      }

      // Emit candidate. Also emit null candidate when all gatherers are
      // complete.
      if (!end) {
        pc._dispatchEvent('icecandidate', event);
      }
      if (complete) {
        pc._dispatchEvent('icecandidate', new Event('icecandidate'));
        pc.iceGatheringState = 'complete';
        pc._emitGatheringStateChange();
      }
    };

    // emit already gathered candidates.
    window.setTimeout(function() {
      bufferedCandidateEvents.forEach(function(e) {
        iceGatherer.onlocalcandidate(e);
      });
    }, 0);
  };

  // Create ICE transport and DTLS transport.
  RTCPeerConnection.prototype._createIceAndDtlsTransports = function() {
    var pc = this;
    var iceTransport = new window.RTCIceTransport(null);
    iceTransport.onicestatechange = function() {
      pc._updateIceConnectionState();
      pc._updateConnectionState();
    };

    var dtlsTransport = new window.RTCDtlsTransport(iceTransport);
    dtlsTransport.ondtlsstatechange = function() {
      pc._updateConnectionState();
    };
    dtlsTransport.onerror = function() {
      // onerror does not set state to failed by itself.
      Object.defineProperty(dtlsTransport, 'state',
          {value: 'failed', writable: true});
      pc._updateConnectionState();
    };

    return {
      iceTransport: iceTransport,
      dtlsTransport: dtlsTransport
    };
  };

  // Destroy ICE gatherer, ICE transport and DTLS transport.
  // Without triggering the callbacks.
  RTCPeerConnection.prototype._disposeIceAndDtlsTransports = function(
      sdpMLineIndex) {
    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
    if (iceGatherer) {
      delete iceGatherer.onlocalcandidate;
      delete this.transceivers[sdpMLineIndex].iceGatherer;
    }
    var iceTransport = this.transceivers[sdpMLineIndex].iceTransport;
    if (iceTransport) {
      delete iceTransport.onicestatechange;
      delete this.transceivers[sdpMLineIndex].iceTransport;
    }
    var dtlsTransport = this.transceivers[sdpMLineIndex].dtlsTransport;
    if (dtlsTransport) {
      delete dtlsTransport.ondtlsstatechange;
      delete dtlsTransport.onerror;
      delete this.transceivers[sdpMLineIndex].dtlsTransport;
    }
  };

  // Start the RTP Sender and Receiver for a transceiver.
  RTCPeerConnection.prototype._transceive = function(transceiver,
      send, recv) {
    var params = getCommonCapabilities(transceiver.localCapabilities,
        transceiver.remoteCapabilities);
    if (send && transceiver.rtpSender) {
      params.encodings = transceiver.sendEncodingParameters;
      params.rtcp = {
        cname: SDPUtils.localCName,
        compound: transceiver.rtcpParameters.compound
      };
      if (transceiver.recvEncodingParameters.length) {
        params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
      }
      transceiver.rtpSender.send(params);
    }
    if (recv && transceiver.rtpReceiver && params.codecs.length > 0) {
      // remove RTX field in Edge 14942
      if (transceiver.kind === 'video'
          && transceiver.recvEncodingParameters
          && edgeVersion < 15019) {
        transceiver.recvEncodingParameters.forEach(function(p) {
          delete p.rtx;
        });
      }
      if (transceiver.recvEncodingParameters.length) {
        params.encodings = transceiver.recvEncodingParameters;
      } else {
        params.encodings = [{}];
      }
      params.rtcp = {
        compound: transceiver.rtcpParameters.compound
      };
      if (transceiver.rtcpParameters.cname) {
        params.rtcp.cname = transceiver.rtcpParameters.cname;
      }
      if (transceiver.sendEncodingParameters.length) {
        params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
      }
      transceiver.rtpReceiver.receive(params);
    }
  };

  RTCPeerConnection.prototype.setLocalDescription = function(description) {
    var pc = this;

    // Note: pranswer is not supported.
    if (['offer', 'answer'].indexOf(description.type) === -1) {
      return Promise.reject(makeError('TypeError',
          'Unsupported type "' + description.type + '"'));
    }

    if (!isActionAllowedInSignalingState('setLocalDescription',
        description.type, pc.signalingState) || pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not set local ' + description.type +
          ' in state ' + pc.signalingState));
    }

    var sections;
    var sessionpart;
    if (description.type === 'offer') {
      // VERY limited support for SDP munging. Limited to:
      // * changing the order of codecs
      sections = SDPUtils.splitSections(description.sdp);
      sessionpart = sections.shift();
      sections.forEach(function(mediaSection, sdpMLineIndex) {
        var caps = SDPUtils.parseRtpParameters(mediaSection);
        pc.transceivers[sdpMLineIndex].localCapabilities = caps;
      });

      pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
        pc._gather(transceiver.mid, sdpMLineIndex);
      });
    } else if (description.type === 'answer') {
      sections = SDPUtils.splitSections(pc._remoteDescription.sdp);
      sessionpart = sections.shift();
      var isIceLite = SDPUtils.matchPrefix(sessionpart,
          'a=ice-lite').length > 0;
      sections.forEach(function(mediaSection, sdpMLineIndex) {
        var transceiver = pc.transceivers[sdpMLineIndex];
        var iceGatherer = transceiver.iceGatherer;
        var iceTransport = transceiver.iceTransport;
        var dtlsTransport = transceiver.dtlsTransport;
        var localCapabilities = transceiver.localCapabilities;
        var remoteCapabilities = transceiver.remoteCapabilities;

        // treat bundle-only as not-rejected.
        var rejected = SDPUtils.isRejected(mediaSection) &&
            SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;

        if (!rejected && !transceiver.rejected) {
          var remoteIceParameters = SDPUtils.getIceParameters(
              mediaSection, sessionpart);
          var remoteDtlsParameters = SDPUtils.getDtlsParameters(
              mediaSection, sessionpart);
          if (isIceLite) {
            remoteDtlsParameters.role = 'server';
          }

          if (!pc.usingBundle || sdpMLineIndex === 0) {
            pc._gather(transceiver.mid, sdpMLineIndex);
            if (iceTransport.state === 'new') {
              iceTransport.start(iceGatherer, remoteIceParameters,
                  isIceLite ? 'controlling' : 'controlled');
            }
            if (dtlsTransport.state === 'new') {
              dtlsTransport.start(remoteDtlsParameters);
            }
          }

          // Calculate intersection of capabilities.
          var params = getCommonCapabilities(localCapabilities,
              remoteCapabilities);

          // Start the RTCRtpSender. The RTCRtpReceiver for this
          // transceiver has already been started in setRemoteDescription.
          pc._transceive(transceiver,
              params.codecs.length > 0,
              false);
        }
      });
    }

    pc._localDescription = {
      type: description.type,
      sdp: description.sdp
    };
    if (description.type === 'offer') {
      pc._updateSignalingState('have-local-offer');
    } else {
      pc._updateSignalingState('stable');
    }

    return Promise.resolve();
  };

  RTCPeerConnection.prototype.setRemoteDescription = function(description) {
    var pc = this;

    // Note: pranswer is not supported.
    if (['offer', 'answer'].indexOf(description.type) === -1) {
      return Promise.reject(makeError('TypeError',
          'Unsupported type "' + description.type + '"'));
    }

    if (!isActionAllowedInSignalingState('setRemoteDescription',
        description.type, pc.signalingState) || pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not set remote ' + description.type +
          ' in state ' + pc.signalingState));
    }

    var streams = {};
    pc.remoteStreams.forEach(function(stream) {
      streams[stream.id] = stream;
    });
    var receiverList = [];
    var sections = SDPUtils.splitSections(description.sdp);
    var sessionpart = sections.shift();
    var isIceLite = SDPUtils.matchPrefix(sessionpart,
        'a=ice-lite').length > 0;
    var usingBundle = SDPUtils.matchPrefix(sessionpart,
        'a=group:BUNDLE ').length > 0;
    pc.usingBundle = usingBundle;
    var iceOptions = SDPUtils.matchPrefix(sessionpart,
        'a=ice-options:')[0];
    if (iceOptions) {
      pc.canTrickleIceCandidates = iceOptions.substr(14).split(' ')
          .indexOf('trickle') >= 0;
    } else {
      pc.canTrickleIceCandidates = false;
    }

    sections.forEach(function(mediaSection, sdpMLineIndex) {
      var lines = SDPUtils.splitLines(mediaSection);
      var kind = SDPUtils.getKind(mediaSection);
      // treat bundle-only as not-rejected.
      var rejected = SDPUtils.isRejected(mediaSection) &&
          SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;
      var protocol = lines[0].substr(2).split(' ')[2];

      var direction = SDPUtils.getDirection(mediaSection, sessionpart);
      var remoteMsid = SDPUtils.parseMsid(mediaSection);

      var mid = SDPUtils.getMid(mediaSection) || SDPUtils.generateIdentifier();

      // Reject datachannels which are not implemented yet.
      if (rejected || (kind === 'application' && (protocol === 'DTLS/SCTP' ||
          protocol === 'UDP/DTLS/SCTP'))) {
        // TODO: this is dangerous in the case where a non-rejected m-line
        //     becomes rejected.
        pc.transceivers[sdpMLineIndex] = {
          mid: mid,
          kind: kind,
          protocol: protocol,
          rejected: true
        };
        return;
      }

      if (!rejected && pc.transceivers[sdpMLineIndex] &&
          pc.transceivers[sdpMLineIndex].rejected) {
        // recycle a rejected transceiver.
        pc.transceivers[sdpMLineIndex] = pc._createTransceiver(kind, true);
      }

      var transceiver;
      var iceGatherer;
      var iceTransport;
      var dtlsTransport;
      var rtpReceiver;
      var sendEncodingParameters;
      var recvEncodingParameters;
      var localCapabilities;

      var track;
      // FIXME: ensure the mediaSection has rtcp-mux set.
      var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
      var remoteIceParameters;
      var remoteDtlsParameters;
      if (!rejected) {
        remoteIceParameters = SDPUtils.getIceParameters(mediaSection,
            sessionpart);
        remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection,
            sessionpart);
        remoteDtlsParameters.role = 'client';
      }
      recvEncodingParameters =
          SDPUtils.parseRtpEncodingParameters(mediaSection);

      var rtcpParameters = SDPUtils.parseRtcpParameters(mediaSection);

      var isComplete = SDPUtils.matchPrefix(mediaSection,
          'a=end-of-candidates', sessionpart).length > 0;
      var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:')
          .map(function(cand) {
            return SDPUtils.parseCandidate(cand);
          })
          .filter(function(cand) {
            return cand.component === 1;
          });

      // Check if we can use BUNDLE and dispose transports.
      if ((description.type === 'offer' || description.type === 'answer') &&
          !rejected && usingBundle && sdpMLineIndex > 0 &&
          pc.transceivers[sdpMLineIndex]) {
        pc._disposeIceAndDtlsTransports(sdpMLineIndex);
        pc.transceivers[sdpMLineIndex].iceGatherer =
            pc.transceivers[0].iceGatherer;
        pc.transceivers[sdpMLineIndex].iceTransport =
            pc.transceivers[0].iceTransport;
        pc.transceivers[sdpMLineIndex].dtlsTransport =
            pc.transceivers[0].dtlsTransport;
        if (pc.transceivers[sdpMLineIndex].rtpSender) {
          pc.transceivers[sdpMLineIndex].rtpSender.setTransport(
              pc.transceivers[0].dtlsTransport);
        }
        if (pc.transceivers[sdpMLineIndex].rtpReceiver) {
          pc.transceivers[sdpMLineIndex].rtpReceiver.setTransport(
              pc.transceivers[0].dtlsTransport);
        }
      }
      if (description.type === 'offer' && !rejected) {
        transceiver = pc.transceivers[sdpMLineIndex] ||
            pc._createTransceiver(kind);
        transceiver.mid = mid;

        if (!transceiver.iceGatherer) {
          transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex,
              usingBundle);
        }

        if (cands.length && transceiver.iceTransport.state === 'new') {
          if (isComplete && (!usingBundle || sdpMLineIndex === 0)) {
            transceiver.iceTransport.setRemoteCandidates(cands);
          } else {
            cands.forEach(function(candidate) {
              maybeAddCandidate(transceiver.iceTransport, candidate);
            });
          }
        }

        localCapabilities = window.RTCRtpReceiver.getCapabilities(kind);

        // filter RTX until additional stuff needed for RTX is implemented
        // in adapter.js
        if (edgeVersion < 15019) {
          localCapabilities.codecs = localCapabilities.codecs.filter(
              function(codec) {
                return codec.name !== 'rtx';
              });
        }

        sendEncodingParameters = transceiver.sendEncodingParameters || [{
          ssrc: (2 * sdpMLineIndex + 2) * 1001
        }];

        // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
        var isNewTrack = false;
        if (direction === 'sendrecv' || direction === 'sendonly') {
          isNewTrack = !transceiver.rtpReceiver;
          rtpReceiver = transceiver.rtpReceiver ||
              new window.RTCRtpReceiver(transceiver.dtlsTransport, kind);

          if (isNewTrack) {
            var stream;
            track = rtpReceiver.track;
            // FIXME: does not work with Plan B.
            if (remoteMsid && remoteMsid.stream === '-') {
              // no-op. a stream id of '-' means: no associated stream.
            } else if (remoteMsid) {
              if (!streams[remoteMsid.stream]) {
                streams[remoteMsid.stream] = new window.MediaStream();
                Object.defineProperty(streams[remoteMsid.stream], 'id', {
                  get: function() {
                    return remoteMsid.stream;
                  }
                });
              }
              Object.defineProperty(track, 'id', {
                get: function() {
                  return remoteMsid.track;
                }
              });
              stream = streams[remoteMsid.stream];
            } else {
              if (!streams.default) {
                streams.default = new window.MediaStream();
              }
              stream = streams.default;
            }
            if (stream) {
              addTrackToStreamAndFireEvent(track, stream);
              transceiver.associatedRemoteMediaStreams.push(stream);
            }
            receiverList.push([track, rtpReceiver, stream]);
          }
        } else if (transceiver.rtpReceiver && transceiver.rtpReceiver.track) {
          transceiver.associatedRemoteMediaStreams.forEach(function(s) {
            var nativeTrack = s.getTracks().find(function(t) {
              return t.id === transceiver.rtpReceiver.track.id;
            });
            if (nativeTrack) {
              removeTrackFromStreamAndFireEvent(nativeTrack, s);
            }
          });
          transceiver.associatedRemoteMediaStreams = [];
        }

        transceiver.localCapabilities = localCapabilities;
        transceiver.remoteCapabilities = remoteCapabilities;
        transceiver.rtpReceiver = rtpReceiver;
        transceiver.rtcpParameters = rtcpParameters;
        transceiver.sendEncodingParameters = sendEncodingParameters;
        transceiver.recvEncodingParameters = recvEncodingParameters;

        // Start the RTCRtpReceiver now. The RTPSender is started in
        // setLocalDescription.
        pc._transceive(pc.transceivers[sdpMLineIndex],
            false,
            isNewTrack);
      } else if (description.type === 'answer' && !rejected) {
        transceiver = pc.transceivers[sdpMLineIndex];
        iceGatherer = transceiver.iceGatherer;
        iceTransport = transceiver.iceTransport;
        dtlsTransport = transceiver.dtlsTransport;
        rtpReceiver = transceiver.rtpReceiver;
        sendEncodingParameters = transceiver.sendEncodingParameters;
        localCapabilities = transceiver.localCapabilities;

        pc.transceivers[sdpMLineIndex].recvEncodingParameters =
            recvEncodingParameters;
        pc.transceivers[sdpMLineIndex].remoteCapabilities =
            remoteCapabilities;
        pc.transceivers[sdpMLineIndex].rtcpParameters = rtcpParameters;

        if (cands.length && iceTransport.state === 'new') {
          if ((isIceLite || isComplete) &&
              (!usingBundle || sdpMLineIndex === 0)) {
            iceTransport.setRemoteCandidates(cands);
          } else {
            cands.forEach(function(candidate) {
              maybeAddCandidate(transceiver.iceTransport, candidate);
            });
          }
        }

        if (!usingBundle || sdpMLineIndex === 0) {
          if (iceTransport.state === 'new') {
            iceTransport.start(iceGatherer, remoteIceParameters,
                'controlling');
          }
          if (dtlsTransport.state === 'new') {
            dtlsTransport.start(remoteDtlsParameters);
          }
        }

        // If the offer contained RTX but the answer did not,
        // remove RTX from sendEncodingParameters.
        var commonCapabilities = getCommonCapabilities(
          transceiver.localCapabilities,
          transceiver.remoteCapabilities);

        var hasRtx = commonCapabilities.codecs.filter(function(c) {
          return c.name.toLowerCase() === 'rtx';
        }).length;
        if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
          delete transceiver.sendEncodingParameters[0].rtx;
        }

        pc._transceive(transceiver,
            direction === 'sendrecv' || direction === 'recvonly',
            direction === 'sendrecv' || direction === 'sendonly');

        // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
        if (rtpReceiver &&
            (direction === 'sendrecv' || direction === 'sendonly')) {
          track = rtpReceiver.track;
          if (remoteMsid) {
            if (!streams[remoteMsid.stream]) {
              streams[remoteMsid.stream] = new window.MediaStream();
            }
            addTrackToStreamAndFireEvent(track, streams[remoteMsid.stream]);
            receiverList.push([track, rtpReceiver, streams[remoteMsid.stream]]);
          } else {
            if (!streams.default) {
              streams.default = new window.MediaStream();
            }
            addTrackToStreamAndFireEvent(track, streams.default);
            receiverList.push([track, rtpReceiver, streams.default]);
          }
        } else {
          // FIXME: actually the receiver should be created later.
          delete transceiver.rtpReceiver;
        }
      }
    });

    if (pc._dtlsRole === undefined) {
      pc._dtlsRole = description.type === 'offer' ? 'active' : 'passive';
    }

    pc._remoteDescription = {
      type: description.type,
      sdp: description.sdp
    };
    if (description.type === 'offer') {
      pc._updateSignalingState('have-remote-offer');
    } else {
      pc._updateSignalingState('stable');
    }
    Object.keys(streams).forEach(function(sid) {
      var stream = streams[sid];
      if (stream.getTracks().length) {
        if (pc.remoteStreams.indexOf(stream) === -1) {
          pc.remoteStreams.push(stream);
          var event = new Event('addstream');
          event.stream = stream;
          window.setTimeout(function() {
            pc._dispatchEvent('addstream', event);
          });
        }

        receiverList.forEach(function(item) {
          var track = item[0];
          var receiver = item[1];
          if (stream.id !== item[2].id) {
            return;
          }
          fireAddTrack(pc, track, receiver, [stream]);
        });
      }
    });
    receiverList.forEach(function(item) {
      if (item[2]) {
        return;
      }
      fireAddTrack(pc, item[0], item[1], []);
    });

    // check whether addIceCandidate({}) was called within four seconds after
    // setRemoteDescription.
    window.setTimeout(function() {
      if (!(pc && pc.transceivers)) {
        return;
      }
      pc.transceivers.forEach(function(transceiver) {
        if (transceiver.iceTransport &&
            transceiver.iceTransport.state === 'new' &&
            transceiver.iceTransport.getRemoteCandidates().length > 0) {
          console.warn('Timeout for addRemoteCandidate. Consider sending ' +
              'an end-of-candidates notification');
          transceiver.iceTransport.addRemoteCandidate({});
        }
      });
    }, 4000);

    return Promise.resolve();
  };

  RTCPeerConnection.prototype.close = function() {
    this.transceivers.forEach(function(transceiver) {
      /* not yet
      if (transceiver.iceGatherer) {
        transceiver.iceGatherer.close();
      }
      */
      if (transceiver.iceTransport) {
        transceiver.iceTransport.stop();
      }
      if (transceiver.dtlsTransport) {
        transceiver.dtlsTransport.stop();
      }
      if (transceiver.rtpSender) {
        transceiver.rtpSender.stop();
      }
      if (transceiver.rtpReceiver) {
        transceiver.rtpReceiver.stop();
      }
    });
    // FIXME: clean up tracks, local streams, remote streams, etc
    this._isClosed = true;
    this._updateSignalingState('closed');
  };

  // Update the signaling state.
  RTCPeerConnection.prototype._updateSignalingState = function(newState) {
    this.signalingState = newState;
    var event = new Event('signalingstatechange');
    this._dispatchEvent('signalingstatechange', event);
  };

  // Determine whether to fire the negotiationneeded event.
  RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function() {
    var pc = this;
    if (this.signalingState !== 'stable' || this.needNegotiation === true) {
      return;
    }
    this.needNegotiation = true;
    window.setTimeout(function() {
      if (pc.needNegotiation) {
        pc.needNegotiation = false;
        var event = new Event('negotiationneeded');
        pc._dispatchEvent('negotiationneeded', event);
      }
    }, 0);
  };

  // Update the ice connection state.
  RTCPeerConnection.prototype._updateIceConnectionState = function() {
    var newState;
    var states = {
      'new': 0,
      closed: 0,
      checking: 0,
      connected: 0,
      completed: 0,
      disconnected: 0,
      failed: 0
    };
    this.transceivers.forEach(function(transceiver) {
      if (transceiver.iceTransport && !transceiver.rejected) {
        states[transceiver.iceTransport.state]++;
      }
    });

    newState = 'new';
    if (states.failed > 0) {
      newState = 'failed';
    } else if (states.checking > 0) {
      newState = 'checking';
    } else if (states.disconnected > 0) {
      newState = 'disconnected';
    } else if (states.new > 0) {
      newState = 'new';
    } else if (states.connected > 0) {
      newState = 'connected';
    } else if (states.completed > 0) {
      newState = 'completed';
    }

    if (newState !== this.iceConnectionState) {
      this.iceConnectionState = newState;
      var event = new Event('iceconnectionstatechange');
      this._dispatchEvent('iceconnectionstatechange', event);
    }
  };

  // Update the connection state.
  RTCPeerConnection.prototype._updateConnectionState = function() {
    var newState;
    var states = {
      'new': 0,
      closed: 0,
      connecting: 0,
      connected: 0,
      completed: 0,
      disconnected: 0,
      failed: 0
    };
    this.transceivers.forEach(function(transceiver) {
      if (transceiver.iceTransport && transceiver.dtlsTransport &&
          !transceiver.rejected) {
        states[transceiver.iceTransport.state]++;
        states[transceiver.dtlsTransport.state]++;
      }
    });
    // ICETransport.completed and connected are the same for this purpose.
    states.connected += states.completed;

    newState = 'new';
    if (states.failed > 0) {
      newState = 'failed';
    } else if (states.connecting > 0) {
      newState = 'connecting';
    } else if (states.disconnected > 0) {
      newState = 'disconnected';
    } else if (states.new > 0) {
      newState = 'new';
    } else if (states.connected > 0) {
      newState = 'connected';
    }

    if (newState !== this.connectionState) {
      this.connectionState = newState;
      var event = new Event('connectionstatechange');
      this._dispatchEvent('connectionstatechange', event);
    }
  };

  RTCPeerConnection.prototype.createOffer = function() {
    var pc = this;

    if (pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not call createOffer after close'));
    }

    var numAudioTracks = pc.transceivers.filter(function(t) {
      return t.kind === 'audio';
    }).length;
    var numVideoTracks = pc.transceivers.filter(function(t) {
      return t.kind === 'video';
    }).length;

    // Determine number of audio and video tracks we need to send/recv.
    var offerOptions = arguments[0];
    if (offerOptions) {
      // Reject Chrome legacy constraints.
      if (offerOptions.mandatory || offerOptions.optional) {
        throw new TypeError(
            'Legacy mandatory/optional constraints not supported.');
      }
      if (offerOptions.offerToReceiveAudio !== undefined) {
        if (offerOptions.offerToReceiveAudio === true) {
          numAudioTracks = 1;
        } else if (offerOptions.offerToReceiveAudio === false) {
          numAudioTracks = 0;
        } else {
          numAudioTracks = offerOptions.offerToReceiveAudio;
        }
      }
      if (offerOptions.offerToReceiveVideo !== undefined) {
        if (offerOptions.offerToReceiveVideo === true) {
          numVideoTracks = 1;
        } else if (offerOptions.offerToReceiveVideo === false) {
          numVideoTracks = 0;
        } else {
          numVideoTracks = offerOptions.offerToReceiveVideo;
        }
      }
    }

    pc.transceivers.forEach(function(transceiver) {
      if (transceiver.kind === 'audio') {
        numAudioTracks--;
        if (numAudioTracks < 0) {
          transceiver.wantReceive = false;
        }
      } else if (transceiver.kind === 'video') {
        numVideoTracks--;
        if (numVideoTracks < 0) {
          transceiver.wantReceive = false;
        }
      }
    });

    // Create M-lines for recvonly streams.
    while (numAudioTracks > 0 || numVideoTracks > 0) {
      if (numAudioTracks > 0) {
        pc._createTransceiver('audio');
        numAudioTracks--;
      }
      if (numVideoTracks > 0) {
        pc._createTransceiver('video');
        numVideoTracks--;
      }
    }

    var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId,
        pc._sdpSessionVersion++);
    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
      // For each track, create an ice gatherer, ice transport,
      // dtls transport, potentially rtpsender and rtpreceiver.
      var track = transceiver.track;
      var kind = transceiver.kind;
      var mid = transceiver.mid || SDPUtils.generateIdentifier();
      transceiver.mid = mid;

      if (!transceiver.iceGatherer) {
        transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex,
            pc.usingBundle);
      }

      var localCapabilities = window.RTCRtpSender.getCapabilities(kind);
      // filter RTX until additional stuff needed for RTX is implemented
      // in adapter.js
      if (edgeVersion < 15019) {
        localCapabilities.codecs = localCapabilities.codecs.filter(
            function(codec) {
              return codec.name !== 'rtx';
            });
      }
      localCapabilities.codecs.forEach(function(codec) {
        // work around https://bugs.chromium.org/p/webrtc/issues/detail?id=6552
        // by adding level-asymmetry-allowed=1
        if (codec.name === 'H264' &&
            codec.parameters['level-asymmetry-allowed'] === undefined) {
          codec.parameters['level-asymmetry-allowed'] = '1';
        }

        // for subsequent offers, we might have to re-use the payload
        // type of the last offer.
        if (transceiver.remoteCapabilities &&
            transceiver.remoteCapabilities.codecs) {
          transceiver.remoteCapabilities.codecs.forEach(function(remoteCodec) {
            if (codec.name.toLowerCase() === remoteCodec.name.toLowerCase() &&
                codec.clockRate === remoteCodec.clockRate) {
              codec.preferredPayloadType = remoteCodec.payloadType;
            }
          });
        }
      });
      localCapabilities.headerExtensions.forEach(function(hdrExt) {
        var remoteExtensions = transceiver.remoteCapabilities &&
            transceiver.remoteCapabilities.headerExtensions || [];
        remoteExtensions.forEach(function(rHdrExt) {
          if (hdrExt.uri === rHdrExt.uri) {
            hdrExt.id = rHdrExt.id;
          }
        });
      });

      // generate an ssrc now, to be used later in rtpSender.send
      var sendEncodingParameters = transceiver.sendEncodingParameters || [{
        ssrc: (2 * sdpMLineIndex + 1) * 1001
      }];
      if (track) {
        // add RTX
        if (edgeVersion >= 15019 && kind === 'video' &&
            !sendEncodingParameters[0].rtx) {
          sendEncodingParameters[0].rtx = {
            ssrc: sendEncodingParameters[0].ssrc + 1
          };
        }
      }

      if (transceiver.wantReceive) {
        transceiver.rtpReceiver = new window.RTCRtpReceiver(
            transceiver.dtlsTransport, kind);
      }

      transceiver.localCapabilities = localCapabilities;
      transceiver.sendEncodingParameters = sendEncodingParameters;
    });

    // always offer BUNDLE and dispose on return if not supported.
    if (pc._config.bundlePolicy !== 'max-compat') {
      sdp += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }
    sdp += 'a=ice-options:trickle\r\n';

    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
      sdp += writeMediaSection(transceiver, transceiver.localCapabilities,
          'offer', transceiver.stream, pc._dtlsRole);
      sdp += 'a=rtcp-rsize\r\n';

      if (transceiver.iceGatherer && pc.iceGatheringState !== 'new' &&
          (sdpMLineIndex === 0 || !pc.usingBundle)) {
        transceiver.iceGatherer.getLocalCandidates().forEach(function(cand) {
          cand.component = 1;
          sdp += 'a=' + SDPUtils.writeCandidate(cand) + '\r\n';
        });

        if (transceiver.iceGatherer.state === 'completed') {
          sdp += 'a=end-of-candidates\r\n';
        }
      }
    });

    var desc = new window.RTCSessionDescription({
      type: 'offer',
      sdp: sdp
    });
    return Promise.resolve(desc);
  };

  RTCPeerConnection.prototype.createAnswer = function() {
    var pc = this;

    if (pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not call createAnswer after close'));
    }

    if (!(pc.signalingState === 'have-remote-offer' ||
        pc.signalingState === 'have-local-pranswer')) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not call createAnswer in signalingState ' + pc.signalingState));
    }

    var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId,
        pc._sdpSessionVersion++);
    if (pc.usingBundle) {
      sdp += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }
    sdp += 'a=ice-options:trickle\r\n';

    var mediaSectionsInOffer = SDPUtils.getMediaSections(
        pc._remoteDescription.sdp).length;
    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
      if (sdpMLineIndex + 1 > mediaSectionsInOffer) {
        return;
      }
      if (transceiver.rejected) {
        if (transceiver.kind === 'application') {
          if (transceiver.protocol === 'DTLS/SCTP') { // legacy fmt
            sdp += 'm=application 0 DTLS/SCTP 5000\r\n';
          } else {
            sdp += 'm=application 0 ' + transceiver.protocol +
                ' webrtc-datachannel\r\n';
          }
        } else if (transceiver.kind === 'audio') {
          sdp += 'm=audio 0 UDP/TLS/RTP/SAVPF 0\r\n' +
              'a=rtpmap:0 PCMU/8000\r\n';
        } else if (transceiver.kind === 'video') {
          sdp += 'm=video 0 UDP/TLS/RTP/SAVPF 120\r\n' +
              'a=rtpmap:120 VP8/90000\r\n';
        }
        sdp += 'c=IN IP4 0.0.0.0\r\n' +
            'a=inactive\r\n' +
            'a=mid:' + transceiver.mid + '\r\n';
        return;
      }

      // FIXME: look at direction.
      if (transceiver.stream) {
        var localTrack;
        if (transceiver.kind === 'audio') {
          localTrack = transceiver.stream.getAudioTracks()[0];
        } else if (transceiver.kind === 'video') {
          localTrack = transceiver.stream.getVideoTracks()[0];
        }
        if (localTrack) {
          // add RTX
          if (edgeVersion >= 15019 && transceiver.kind === 'video' &&
              !transceiver.sendEncodingParameters[0].rtx) {
            transceiver.sendEncodingParameters[0].rtx = {
              ssrc: transceiver.sendEncodingParameters[0].ssrc + 1
            };
          }
        }
      }

      // Calculate intersection of capabilities.
      var commonCapabilities = getCommonCapabilities(
          transceiver.localCapabilities,
          transceiver.remoteCapabilities);

      var hasRtx = commonCapabilities.codecs.filter(function(c) {
        return c.name.toLowerCase() === 'rtx';
      }).length;
      if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
        delete transceiver.sendEncodingParameters[0].rtx;
      }

      sdp += writeMediaSection(transceiver, commonCapabilities,
          'answer', transceiver.stream, pc._dtlsRole);
      if (transceiver.rtcpParameters &&
          transceiver.rtcpParameters.reducedSize) {
        sdp += 'a=rtcp-rsize\r\n';
      }
    });

    var desc = new window.RTCSessionDescription({
      type: 'answer',
      sdp: sdp
    });
    return Promise.resolve(desc);
  };

  RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
    var pc = this;
    var sections;
    if (candidate && !(candidate.sdpMLineIndex !== undefined ||
        candidate.sdpMid)) {
      return Promise.reject(new TypeError('sdpMLineIndex or sdpMid required'));
    }

    // TODO: needs to go into ops queue.
    return new Promise(function(resolve, reject) {
      if (!pc._remoteDescription) {
        return reject(makeError('InvalidStateError',
            'Can not add ICE candidate without a remote description'));
      } else if (!candidate || candidate.candidate === '') {
        for (var j = 0; j < pc.transceivers.length; j++) {
          if (pc.transceivers[j].rejected) {
            continue;
          }
          pc.transceivers[j].iceTransport.addRemoteCandidate({});
          sections = SDPUtils.getMediaSections(pc._remoteDescription.sdp);
          sections[j] += 'a=end-of-candidates\r\n';
          pc._remoteDescription.sdp =
              SDPUtils.getDescription(pc._remoteDescription.sdp) +
              sections.join('');
          if (pc.usingBundle) {
            break;
          }
        }
      } else {
        var sdpMLineIndex = candidate.sdpMLineIndex;
        if (candidate.sdpMid) {
          for (var i = 0; i < pc.transceivers.length; i++) {
            if (pc.transceivers[i].mid === candidate.sdpMid) {
              sdpMLineIndex = i;
              break;
            }
          }
        }
        var transceiver = pc.transceivers[sdpMLineIndex];
        if (transceiver) {
          if (transceiver.rejected) {
            return resolve();
          }
          var cand = Object.keys(candidate.candidate).length > 0 ?
              SDPUtils.parseCandidate(candidate.candidate) : {};
          // Ignore Chrome's invalid candidates since Edge does not like them.
          if (cand.protocol === 'tcp' && (cand.port === 0 || cand.port === 9)) {
            return resolve();
          }
          // Ignore RTCP candidates, we assume RTCP-MUX.
          if (cand.component && cand.component !== 1) {
            return resolve();
          }
          // when using bundle, avoid adding candidates to the wrong
          // ice transport. And avoid adding candidates added in the SDP.
          if (sdpMLineIndex === 0 || (sdpMLineIndex > 0 &&
              transceiver.iceTransport !== pc.transceivers[0].iceTransport)) {
            if (!maybeAddCandidate(transceiver.iceTransport, cand)) {
              return reject(makeError('OperationError',
                  'Can not add ICE candidate'));
            }
          }

          // update the remoteDescription.
          var candidateString = candidate.candidate.trim();
          if (candidateString.indexOf('a=') === 0) {
            candidateString = candidateString.substr(2);
          }
          sections = SDPUtils.getMediaSections(pc._remoteDescription.sdp);
          sections[sdpMLineIndex] += 'a=' +
              (cand.type ? candidateString : 'end-of-candidates')
              + '\r\n';
          pc._remoteDescription.sdp =
              SDPUtils.getDescription(pc._remoteDescription.sdp) +
              sections.join('');
        } else {
          return reject(makeError('OperationError',
              'Can not add ICE candidate'));
        }
      }
      resolve();
    });
  };

  RTCPeerConnection.prototype.getStats = function(selector) {
    if (selector && selector instanceof window.MediaStreamTrack) {
      var senderOrReceiver = null;
      this.transceivers.forEach(function(transceiver) {
        if (transceiver.rtpSender &&
            transceiver.rtpSender.track === selector) {
          senderOrReceiver = transceiver.rtpSender;
        } else if (transceiver.rtpReceiver &&
            transceiver.rtpReceiver.track === selector) {
          senderOrReceiver = transceiver.rtpReceiver;
        }
      });
      if (!senderOrReceiver) {
        throw makeError('InvalidAccessError', 'Invalid selector.');
      }
      return senderOrReceiver.getStats();
    }

    var promises = [];
    this.transceivers.forEach(function(transceiver) {
      ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport',
          'dtlsTransport'].forEach(function(method) {
            if (transceiver[method]) {
              promises.push(transceiver[method].getStats());
            }
          });
    });
    return Promise.all(promises).then(function(allStats) {
      var results = new Map();
      allStats.forEach(function(stats) {
        stats.forEach(function(stat) {
          results.set(stat.id, stat);
        });
      });
      return results;
    });
  };

  // fix low-level stat names and return Map instead of object.
  var ortcObjects = ['RTCRtpSender', 'RTCRtpReceiver', 'RTCIceGatherer',
    'RTCIceTransport', 'RTCDtlsTransport'];
  ortcObjects.forEach(function(ortcObjectName) {
    var obj = window[ortcObjectName];
    if (obj && obj.prototype && obj.prototype.getStats) {
      var nativeGetstats = obj.prototype.getStats;
      obj.prototype.getStats = function() {
        return nativeGetstats.apply(this)
        .then(function(nativeStats) {
          var mapStats = new Map();
          Object.keys(nativeStats).forEach(function(id) {
            nativeStats[id].type = fixStatsType(nativeStats[id]);
            mapStats.set(id, nativeStats[id]);
          });
          return mapStats;
        });
      };
    }
  });

  // legacy callback shims. Should be moved to adapter.js some days.
  var methods = ['createOffer', 'createAnswer'];
  methods.forEach(function(method) {
    var nativeMethod = RTCPeerConnection.prototype[method];
    RTCPeerConnection.prototype[method] = function() {
      var args = arguments;
      if (typeof args[0] === 'function' ||
          typeof args[1] === 'function') { // legacy
        return nativeMethod.apply(this, [arguments[2]])
        .then(function(description) {
          if (typeof args[0] === 'function') {
            args[0].apply(null, [description]);
          }
        }, function(error) {
          if (typeof args[1] === 'function') {
            args[1].apply(null, [error]);
          }
        });
      }
      return nativeMethod.apply(this, arguments);
    };
  });

  methods = ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'];
  methods.forEach(function(method) {
    var nativeMethod = RTCPeerConnection.prototype[method];
    RTCPeerConnection.prototype[method] = function() {
      var args = arguments;
      if (typeof args[1] === 'function' ||
          typeof args[2] === 'function') { // legacy
        return nativeMethod.apply(this, arguments)
        .then(function() {
          if (typeof args[1] === 'function') {
            args[1].apply(null);
          }
        }, function(error) {
          if (typeof args[2] === 'function') {
            args[2].apply(null, [error]);
          }
        });
      }
      return nativeMethod.apply(this, arguments);
    };
  });

  // getStats is special. It doesn't have a spec legacy method yet we support
  // getStats(something, cb) without error callbacks.
  ['getStats'].forEach(function(method) {
    var nativeMethod = RTCPeerConnection.prototype[method];
    RTCPeerConnection.prototype[method] = function() {
      var args = arguments;
      if (typeof args[1] === 'function') {
        return nativeMethod.apply(this, arguments)
        .then(function() {
          if (typeof args[1] === 'function') {
            args[1].apply(null);
          }
        });
      }
      return nativeMethod.apply(this, arguments);
    };
  });

  return RTCPeerConnection;
};


/***/ }),

/***/ "../node_modules/sdp/sdp.js":
/*!**********************************!*\
  !*** ../node_modules/sdp/sdp.js ***!
  \**********************************/
/***/ ((module) => {

"use strict";
/* eslint-env node */


// SDP helpers.
var SDPUtils = {};

// Generate an alphanumeric identifier for cname or mids.
// TODO: use UUIDs instead? https://gist.github.com/jed/982883
SDPUtils.generateIdentifier = function() {
  return Math.random().toString(36).substr(2, 10);
};

// The RTCP CNAME used by all peerconnections from the same JS.
SDPUtils.localCName = SDPUtils.generateIdentifier();

// Splits SDP into lines, dealing with both CRLF and LF.
SDPUtils.splitLines = function(blob) {
  return blob.trim().split('\n').map(function(line) {
    return line.trim();
  });
};
// Splits SDP into sessionpart and mediasections. Ensures CRLF.
SDPUtils.splitSections = function(blob) {
  var parts = blob.split('\nm=');
  return parts.map(function(part, index) {
    return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
  });
};

// returns the session description.
SDPUtils.getDescription = function(blob) {
  var sections = SDPUtils.splitSections(blob);
  return sections && sections[0];
};

// returns the individual media sections.
SDPUtils.getMediaSections = function(blob) {
  var sections = SDPUtils.splitSections(blob);
  sections.shift();
  return sections;
};

// Returns lines that start with a certain prefix.
SDPUtils.matchPrefix = function(blob, prefix) {
  return SDPUtils.splitLines(blob).filter(function(line) {
    return line.indexOf(prefix) === 0;
  });
};

// Parses an ICE candidate line. Sample input:
// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
// rport 55996"
SDPUtils.parseCandidate = function(line) {
  var parts;
  // Parse both variants.
  if (line.indexOf('a=candidate:') === 0) {
    parts = line.substring(12).split(' ');
  } else {
    parts = line.substring(10).split(' ');
  }

  var candidate = {
    foundation: parts[0],
    component: parseInt(parts[1], 10),
    protocol: parts[2].toLowerCase(),
    priority: parseInt(parts[3], 10),
    ip: parts[4],
    address: parts[4], // address is an alias for ip.
    port: parseInt(parts[5], 10),
    // skip parts[6] == 'typ'
    type: parts[7]
  };

  for (var i = 8; i < parts.length; i += 2) {
    switch (parts[i]) {
      case 'raddr':
        candidate.relatedAddress = parts[i + 1];
        break;
      case 'rport':
        candidate.relatedPort = parseInt(parts[i + 1], 10);
        break;
      case 'tcptype':
        candidate.tcpType = parts[i + 1];
        break;
      case 'ufrag':
        candidate.ufrag = parts[i + 1]; // for backward compability.
        candidate.usernameFragment = parts[i + 1];
        break;
      default: // extension handling, in particular ufrag
        candidate[parts[i]] = parts[i + 1];
        break;
    }
  }
  return candidate;
};

// Translates a candidate object into SDP candidate attribute.
SDPUtils.writeCandidate = function(candidate) {
  var sdp = [];
  sdp.push(candidate.foundation);
  sdp.push(candidate.component);
  sdp.push(candidate.protocol.toUpperCase());
  sdp.push(candidate.priority);
  sdp.push(candidate.address || candidate.ip);
  sdp.push(candidate.port);

  var type = candidate.type;
  sdp.push('typ');
  sdp.push(type);
  if (type !== 'host' && candidate.relatedAddress &&
      candidate.relatedPort) {
    sdp.push('raddr');
    sdp.push(candidate.relatedAddress);
    sdp.push('rport');
    sdp.push(candidate.relatedPort);
  }
  if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
    sdp.push('tcptype');
    sdp.push(candidate.tcpType);
  }
  if (candidate.usernameFragment || candidate.ufrag) {
    sdp.push('ufrag');
    sdp.push(candidate.usernameFragment || candidate.ufrag);
  }
  return 'candidate:' + sdp.join(' ');
};

// Parses an ice-options line, returns an array of option tags.
// a=ice-options:foo bar
SDPUtils.parseIceOptions = function(line) {
  return line.substr(14).split(' ');
};

// Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
// a=rtpmap:111 opus/48000/2
SDPUtils.parseRtpMap = function(line) {
  var parts = line.substr(9).split(' ');
  var parsed = {
    payloadType: parseInt(parts.shift(), 10) // was: id
  };

  parts = parts[0].split('/');

  parsed.name = parts[0];
  parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
  parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
  // legacy alias, got renamed back to channels in ORTC.
  parsed.numChannels = parsed.channels;
  return parsed;
};

// Generate an a=rtpmap line from RTCRtpCodecCapability or
// RTCRtpCodecParameters.
SDPUtils.writeRtpMap = function(codec) {
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  var channels = codec.channels || codec.numChannels || 1;
  return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
      (channels !== 1 ? '/' + channels : '') + '\r\n';
};

// Parses an a=extmap line (headerextension from RFC 5285). Sample input:
// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
// a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
SDPUtils.parseExtmap = function(line) {
  var parts = line.substr(9).split(' ');
  return {
    id: parseInt(parts[0], 10),
    direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
    uri: parts[1]
  };
};

// Generates a=extmap line from RTCRtpHeaderExtensionParameters or
// RTCRtpHeaderExtension.
SDPUtils.writeExtmap = function(headerExtension) {
  return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
      (headerExtension.direction && headerExtension.direction !== 'sendrecv'
        ? '/' + headerExtension.direction
        : '') +
      ' ' + headerExtension.uri + '\r\n';
};

// Parses an ftmp line, returns dictionary. Sample input:
// a=fmtp:96 vbr=on;cng=on
// Also deals with vbr=on; cng=on
SDPUtils.parseFmtp = function(line) {
  var parsed = {};
  var kv;
  var parts = line.substr(line.indexOf(' ') + 1).split(';');
  for (var j = 0; j < parts.length; j++) {
    kv = parts[j].trim().split('=');
    parsed[kv[0].trim()] = kv[1];
  }
  return parsed;
};

// Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeFmtp = function(codec) {
  var line = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.parameters && Object.keys(codec.parameters).length) {
    var params = [];
    Object.keys(codec.parameters).forEach(function(param) {
      if (codec.parameters[param]) {
        params.push(param + '=' + codec.parameters[param]);
      } else {
        params.push(param);
      }
    });
    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
  }
  return line;
};

// Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
// a=rtcp-fb:98 nack rpsi
SDPUtils.parseRtcpFb = function(line) {
  var parts = line.substr(line.indexOf(' ') + 1).split(' ');
  return {
    type: parts.shift(),
    parameter: parts.join(' ')
  };
};
// Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeRtcpFb = function(codec) {
  var lines = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
    // FIXME: special handling for trr-int?
    codec.rtcpFeedback.forEach(function(fb) {
      lines += 'a=rtcp-fb:' + pt + ' ' + fb.type +
      (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') +
          '\r\n';
    });
  }
  return lines;
};

// Parses an RFC 5576 ssrc media attribute. Sample input:
// a=ssrc:3735928559 cname:something
SDPUtils.parseSsrcMedia = function(line) {
  var sp = line.indexOf(' ');
  var parts = {
    ssrc: parseInt(line.substr(7, sp - 7), 10)
  };
  var colon = line.indexOf(':', sp);
  if (colon > -1) {
    parts.attribute = line.substr(sp + 1, colon - sp - 1);
    parts.value = line.substr(colon + 1);
  } else {
    parts.attribute = line.substr(sp + 1);
  }
  return parts;
};

SDPUtils.parseSsrcGroup = function(line) {
  var parts = line.substr(13).split(' ');
  return {
    semantics: parts.shift(),
    ssrcs: parts.map(function(ssrc) {
      return parseInt(ssrc, 10);
    })
  };
};

// Extracts the MID (RFC 5888) from a media section.
// returns the MID or undefined if no mid line was found.
SDPUtils.getMid = function(mediaSection) {
  var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
  if (mid) {
    return mid.substr(6);
  }
};

SDPUtils.parseFingerprint = function(line) {
  var parts = line.substr(14).split(' ');
  return {
    algorithm: parts[0].toLowerCase(), // algorithm is case-sensitive in Edge.
    value: parts[1]
  };
};

// Extracts DTLS parameters from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the fingerprint line as input. See also getIceParameters.
SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
    'a=fingerprint:');
  // Note: a=setup line is ignored since we use the 'auto' role.
  // Note2: 'algorithm' is not case sensitive except in Edge.
  return {
    role: 'auto',
    fingerprints: lines.map(SDPUtils.parseFingerprint)
  };
};

// Serializes DTLS parameters to SDP.
SDPUtils.writeDtlsParameters = function(params, setupType) {
  var sdp = 'a=setup:' + setupType + '\r\n';
  params.fingerprints.forEach(function(fp) {
    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
  });
  return sdp;
};

// Parses a=crypto lines into
//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#dictionary-rtcsrtpsdesparameters-members
SDPUtils.parseCryptoLine = function(line) {
  var parts = line.substr(9).split(' ');
  return {
    tag: parseInt(parts[0], 10),
    cryptoSuite: parts[1],
    keyParams: parts[2],
    sessionParams: parts.slice(3),
  };
};

SDPUtils.writeCryptoLine = function(parameters) {
  return 'a=crypto:' + parameters.tag + ' ' +
    parameters.cryptoSuite + ' ' +
    (typeof parameters.keyParams === 'object'
      ? SDPUtils.writeCryptoKeyParams(parameters.keyParams)
      : parameters.keyParams) +
    (parameters.sessionParams ? ' ' + parameters.sessionParams.join(' ') : '') +
    '\r\n';
};

// Parses the crypto key parameters into
//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#rtcsrtpkeyparam*
SDPUtils.parseCryptoKeyParams = function(keyParams) {
  if (keyParams.indexOf('inline:') !== 0) {
    return null;
  }
  var parts = keyParams.substr(7).split('|');
  return {
    keyMethod: 'inline',
    keySalt: parts[0],
    lifeTime: parts[1],
    mkiValue: parts[2] ? parts[2].split(':')[0] : undefined,
    mkiLength: parts[2] ? parts[2].split(':')[1] : undefined,
  };
};

SDPUtils.writeCryptoKeyParams = function(keyParams) {
  return keyParams.keyMethod + ':'
    + keyParams.keySalt +
    (keyParams.lifeTime ? '|' + keyParams.lifeTime : '') +
    (keyParams.mkiValue && keyParams.mkiLength
      ? '|' + keyParams.mkiValue + ':' + keyParams.mkiLength
      : '');
};

// Extracts all SDES paramters.
SDPUtils.getCryptoParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
    'a=crypto:');
  return lines.map(SDPUtils.parseCryptoLine);
};

// Parses ICE information from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the ice-ufrag and ice-pwd lines as input.
SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
  var ufrag = SDPUtils.matchPrefix(mediaSection + sessionpart,
    'a=ice-ufrag:')[0];
  var pwd = SDPUtils.matchPrefix(mediaSection + sessionpart,
    'a=ice-pwd:')[0];
  if (!(ufrag && pwd)) {
    return null;
  }
  return {
    usernameFragment: ufrag.substr(12),
    password: pwd.substr(10),
  };
};

// Serializes ICE parameters to SDP.
SDPUtils.writeIceParameters = function(params) {
  return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
      'a=ice-pwd:' + params.password + '\r\n';
};

// Parses the SDP media section and returns RTCRtpParameters.
SDPUtils.parseRtpParameters = function(mediaSection) {
  var description = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: [],
    rtcp: []
  };
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  for (var i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
    var pt = mline[i];
    var rtpmapline = SDPUtils.matchPrefix(
      mediaSection, 'a=rtpmap:' + pt + ' ')[0];
    if (rtpmapline) {
      var codec = SDPUtils.parseRtpMap(rtpmapline);
      var fmtps = SDPUtils.matchPrefix(
        mediaSection, 'a=fmtp:' + pt + ' ');
      // Only the first a=fmtp:<pt> is considered.
      codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
      codec.rtcpFeedback = SDPUtils.matchPrefix(
        mediaSection, 'a=rtcp-fb:' + pt + ' ')
        .map(SDPUtils.parseRtcpFb);
      description.codecs.push(codec);
      // parse FEC mechanisms from rtpmap lines.
      switch (codec.name.toUpperCase()) {
        case 'RED':
        case 'ULPFEC':
          description.fecMechanisms.push(codec.name.toUpperCase());
          break;
        default: // only RED and ULPFEC are recognized as FEC mechanisms.
          break;
      }
    }
  }
  SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function(line) {
    description.headerExtensions.push(SDPUtils.parseExtmap(line));
  });
  // FIXME: parse rtcp.
  return description;
};

// Generates parts of the SDP media section describing the capabilities /
// parameters.
SDPUtils.writeRtpDescription = function(kind, caps) {
  var sdp = '';

  // Build the mline.
  sdp += 'm=' + kind + ' ';
  sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
  sdp += ' UDP/TLS/RTP/SAVPF ';
  sdp += caps.codecs.map(function(codec) {
    if (codec.preferredPayloadType !== undefined) {
      return codec.preferredPayloadType;
    }
    return codec.payloadType;
  }).join(' ') + '\r\n';

  sdp += 'c=IN IP4 0.0.0.0\r\n';
  sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

  // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
  caps.codecs.forEach(function(codec) {
    sdp += SDPUtils.writeRtpMap(codec);
    sdp += SDPUtils.writeFmtp(codec);
    sdp += SDPUtils.writeRtcpFb(codec);
  });
  var maxptime = 0;
  caps.codecs.forEach(function(codec) {
    if (codec.maxptime > maxptime) {
      maxptime = codec.maxptime;
    }
  });
  if (maxptime > 0) {
    sdp += 'a=maxptime:' + maxptime + '\r\n';
  }
  sdp += 'a=rtcp-mux\r\n';

  if (caps.headerExtensions) {
    caps.headerExtensions.forEach(function(extension) {
      sdp += SDPUtils.writeExtmap(extension);
    });
  }
  // FIXME: write fecMechanisms.
  return sdp;
};

// Parses the SDP media section and returns an array of
// RTCRtpEncodingParameters.
SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
  var encodingParameters = [];
  var description = SDPUtils.parseRtpParameters(mediaSection);
  var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
  var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

  // filter a=ssrc:... cname:, ignore PlanB-msid
  var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
    .map(function(line) {
      return SDPUtils.parseSsrcMedia(line);
    })
    .filter(function(parts) {
      return parts.attribute === 'cname';
    });
  var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
  var secondarySsrc;

  var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID')
    .map(function(line) {
      var parts = line.substr(17).split(' ');
      return parts.map(function(part) {
        return parseInt(part, 10);
      });
    });
  if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
    secondarySsrc = flows[0][1];
  }

  description.codecs.forEach(function(codec) {
    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
      var encParam = {
        ssrc: primarySsrc,
        codecPayloadType: parseInt(codec.parameters.apt, 10)
      };
      if (primarySsrc && secondarySsrc) {
        encParam.rtx = {ssrc: secondarySsrc};
      }
      encodingParameters.push(encParam);
      if (hasRed) {
        encParam = JSON.parse(JSON.stringify(encParam));
        encParam.fec = {
          ssrc: primarySsrc,
          mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
        };
        encodingParameters.push(encParam);
      }
    }
  });
  if (encodingParameters.length === 0 && primarySsrc) {
    encodingParameters.push({
      ssrc: primarySsrc
    });
  }

  // we support both b=AS and b=TIAS but interpret AS as TIAS.
  var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
  if (bandwidth.length) {
    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
      bandwidth = parseInt(bandwidth[0].substr(7), 10);
    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
      // use formula from JSEP to convert b=AS to TIAS value.
      bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1000 * 0.95
          - (50 * 40 * 8);
    } else {
      bandwidth = undefined;
    }
    encodingParameters.forEach(function(params) {
      params.maxBitrate = bandwidth;
    });
  }
  return encodingParameters;
};

// parses http://draft.ortc.org/#rtcrtcpparameters*
SDPUtils.parseRtcpParameters = function(mediaSection) {
  var rtcpParameters = {};

  // Gets the first SSRC. Note tha with RTX there might be multiple
  // SSRCs.
  var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
    .map(function(line) {
      return SDPUtils.parseSsrcMedia(line);
    })
    .filter(function(obj) {
      return obj.attribute === 'cname';
    })[0];
  if (remoteSsrc) {
    rtcpParameters.cname = remoteSsrc.value;
    rtcpParameters.ssrc = remoteSsrc.ssrc;
  }

  // Edge uses the compound attribute instead of reducedSize
  // compound is !reducedSize
  var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
  rtcpParameters.reducedSize = rsize.length > 0;
  rtcpParameters.compound = rsize.length === 0;

  // parses the rtcp-mux attrіbute.
  // Note that Edge does not support unmuxed RTCP.
  var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
  rtcpParameters.mux = mux.length > 0;

  return rtcpParameters;
};

// parses either a=msid: or a=ssrc:... msid lines and returns
// the id of the MediaStream and MediaStreamTrack.
SDPUtils.parseMsid = function(mediaSection) {
  var parts;
  var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
  if (spec.length === 1) {
    parts = spec[0].substr(7).split(' ');
    return {stream: parts[0], track: parts[1]};
  }
  var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
    .map(function(line) {
      return SDPUtils.parseSsrcMedia(line);
    })
    .filter(function(msidParts) {
      return msidParts.attribute === 'msid';
    });
  if (planB.length > 0) {
    parts = planB[0].value.split(' ');
    return {stream: parts[0], track: parts[1]};
  }
};

// SCTP
// parses draft-ietf-mmusic-sctp-sdp-26 first and falls back
// to draft-ietf-mmusic-sctp-sdp-05
SDPUtils.parseSctpDescription = function(mediaSection) {
  var mline = SDPUtils.parseMLine(mediaSection);
  var maxSizeLine = SDPUtils.matchPrefix(mediaSection, 'a=max-message-size:');
  var maxMessageSize;
  if (maxSizeLine.length > 0) {
    maxMessageSize = parseInt(maxSizeLine[0].substr(19), 10);
  }
  if (isNaN(maxMessageSize)) {
    maxMessageSize = 65536;
  }
  var sctpPort = SDPUtils.matchPrefix(mediaSection, 'a=sctp-port:');
  if (sctpPort.length > 0) {
    return {
      port: parseInt(sctpPort[0].substr(12), 10),
      protocol: mline.fmt,
      maxMessageSize: maxMessageSize
    };
  }
  var sctpMapLines = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:');
  if (sctpMapLines.length > 0) {
    var parts = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:')[0]
      .substr(10)
      .split(' ');
    return {
      port: parseInt(parts[0], 10),
      protocol: parts[1],
      maxMessageSize: maxMessageSize
    };
  }
};

// SCTP
// outputs the draft-ietf-mmusic-sctp-sdp-26 version that all browsers
// support by now receiving in this format, unless we originally parsed
// as the draft-ietf-mmusic-sctp-sdp-05 format (indicated by the m-line
// protocol of DTLS/SCTP -- without UDP/ or TCP/)
SDPUtils.writeSctpDescription = function(media, sctp) {
  var output = [];
  if (media.protocol !== 'DTLS/SCTP') {
    output = [
      'm=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.protocol + '\r\n',
      'c=IN IP4 0.0.0.0\r\n',
      'a=sctp-port:' + sctp.port + '\r\n'
    ];
  } else {
    output = [
      'm=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.port + '\r\n',
      'c=IN IP4 0.0.0.0\r\n',
      'a=sctpmap:' + sctp.port + ' ' + sctp.protocol + ' 65535\r\n'
    ];
  }
  if (sctp.maxMessageSize !== undefined) {
    output.push('a=max-message-size:' + sctp.maxMessageSize + '\r\n');
  }
  return output.join('');
};

// Generate a session ID for SDP.
// https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
// recommends using a cryptographically random +ve 64-bit value
// but right now this should be acceptable and within the right range
SDPUtils.generateSessionId = function() {
  return Math.random().toString().substr(2, 21);
};

// Write boilder plate for start of SDP
// sessId argument is optional - if not supplied it will
// be generated randomly
// sessVersion is optional and defaults to 2
// sessUser is optional and defaults to 'thisisadapterortc'
SDPUtils.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
  var sessionId;
  var version = sessVer !== undefined ? sessVer : 2;
  if (sessId) {
    sessionId = sessId;
  } else {
    sessionId = SDPUtils.generateSessionId();
  }
  var user = sessUser || 'thisisadapterortc';
  // FIXME: sess-id should be an NTP timestamp.
  return 'v=0\r\n' +
      'o=' + user + ' ' + sessionId + ' ' + version +
        ' IN IP4 127.0.0.1\r\n' +
      's=-\r\n' +
      't=0 0\r\n';
};

SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

  // Map ICE parameters (ufrag, pwd) to SDP.
  sdp += SDPUtils.writeIceParameters(
    transceiver.iceGatherer.getLocalParameters());

  // Map DTLS parameters to SDP.
  sdp += SDPUtils.writeDtlsParameters(
    transceiver.dtlsTransport.getLocalParameters(),
    type === 'offer' ? 'actpass' : 'active');

  sdp += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.direction) {
    sdp += 'a=' + transceiver.direction + '\r\n';
  } else if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp += 'a=recvonly\r\n';
  } else {
    sdp += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    // spec.
    var msid = 'msid:' + stream.id + ' ' +
        transceiver.rtpSender.track.id + '\r\n';
    sdp += 'a=' + msid;

    // for Chrome.
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
        ' ' + msid;
    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
          ' ' + msid;
      sdp += 'a=ssrc-group:FID ' +
          transceiver.sendEncodingParameters[0].ssrc + ' ' +
          transceiver.sendEncodingParameters[0].rtx.ssrc +
          '\r\n';
    }
  }
  // FIXME: this should be written by writeRtpDescription.
  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
      ' cname:' + SDPUtils.localCName + '\r\n';
  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
        ' cname:' + SDPUtils.localCName + '\r\n';
  }
  return sdp;
};

// Gets the direction from the mediaSection or the sessionpart.
SDPUtils.getDirection = function(mediaSection, sessionpart) {
  // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
  var lines = SDPUtils.splitLines(mediaSection);
  for (var i = 0; i < lines.length; i++) {
    switch (lines[i]) {
      case 'a=sendrecv':
      case 'a=sendonly':
      case 'a=recvonly':
      case 'a=inactive':
        return lines[i].substr(2);
      default:
        // FIXME: What should happen here?
    }
  }
  if (sessionpart) {
    return SDPUtils.getDirection(sessionpart);
  }
  return 'sendrecv';
};

SDPUtils.getKind = function(mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  return mline[0].substr(2);
};

SDPUtils.isRejected = function(mediaSection) {
  return mediaSection.split(' ', 2)[1] === '0';
};

SDPUtils.parseMLine = function(mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var parts = lines[0].substr(2).split(' ');
  return {
    kind: parts[0],
    port: parseInt(parts[1], 10),
    protocol: parts[2],
    fmt: parts.slice(3).join(' ')
  };
};

SDPUtils.parseOLine = function(mediaSection) {
  var line = SDPUtils.matchPrefix(mediaSection, 'o=')[0];
  var parts = line.substr(2).split(' ');
  return {
    username: parts[0],
    sessionId: parts[1],
    sessionVersion: parseInt(parts[2], 10),
    netType: parts[3],
    addressType: parts[4],
    address: parts[5]
  };
};

// a very naive interpretation of a valid SDP.
SDPUtils.isValidSDP = function(blob) {
  if (typeof blob !== 'string' || blob.length === 0) {
    return false;
  }
  var lines = SDPUtils.splitLines(blob);
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].length < 2 || lines[i].charAt(1) !== '=') {
      return false;
    }
    // TODO: check the modifier a bit more.
  }
  return true;
};

// Expose public methods.
if (true) {
  module.exports = SDPUtils;
}


/***/ }),

/***/ "./sample.ts":
/*!*******************!*\
  !*** ./sample.ts ***!
  \*******************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const index_1 = __webpack_require__(/*! ../src/index */ "../src/index.ts");
const livekit_rtc_1 = __webpack_require__(/*! ../src/proto/livekit_rtc */ "../src/proto/livekit_rtc.ts");
let $ = function (id) {
    return document.getElementById(id);
};
function appendLog(...args) {
    const logger = $('log');
    for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == 'object') {
            logger.innerHTML +=
                (JSON && JSON.stringify
                    ? JSON.stringify(arguments[i], undefined, 2)
                    : arguments[i]) + ' ';
        }
        else {
            logger.innerHTML += arguments[i] + ' ';
        }
    }
    logger.innerHTML += '\n';
    (() => {
        logger.scrollTop = logger.scrollHeight;
    })();
}
function trackSubscribed(div, track, participant) {
    appendLog('track subscribed', track);
    if (track instanceof index_1.AudioTrack || track instanceof index_1.VideoTrack) {
        // const element: HTMLMediaElement = <HTMLMediaElement>(
        //   document.createElement(track.kind.toString())
        // );
        // track.attach(element);
        const element = track.attach();
        div.appendChild(element);
        return element;
    }
    return null;
}
function trackUnsubscribed(track, participant) {
    let logName = track.name;
    if (track.sid) {
        logName = track.sid;
    }
    appendLog('track unsubscribed', logName);
    if (track instanceof index_1.AudioTrack || track instanceof index_1.VideoTrack) {
        track.detach().forEach((element) => element.remove());
    }
}
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function handleData(msg, participant) {
    const str = decoder.decode(msg);
    const chat = $('chat');
    chat.value += `${participant.identity}: ${str}\n`;
}
function handleSpeakerChanged(speakers) {
    // remove tags from all
    currentRoom.participants.forEach((participant) => {
        setParticipantSpeaking(participant, speakers.includes(participant));
    });
    // do the same for local participant
    setParticipantSpeaking(currentRoom.localParticipant, speakers.includes(currentRoom.localParticipant));
}
function setParticipantSpeaking(participant, speaking) {
    participant.videoTracks.forEach((publication) => {
        const track = publication.track;
        if (track instanceof index_1.VideoTrack) {
            track.attachedElements.forEach((element) => {
                if (speaking) {
                    element.classList.add('speaking');
                }
                else {
                    element.classList.remove('speaking');
                }
            });
        }
    });
}
function participantConnected(participant) {
    var _a;
    appendLog('participant', participant.sid, 'connected', participant.metadata);
    const div = document.createElement('div');
    div.id = participant.sid;
    div.innerText = participant.identity;
    div.className = 'col-md-6 video-container';
    (_a = $('remote-area')) === null || _a === void 0 ? void 0 : _a.appendChild(div);
    participant.on(index_1.ParticipantEvent.TrackSubscribed, (track) => trackSubscribed(div, track, participant));
    participant.on(index_1.ParticipantEvent.TrackUnsubscribed, (track) => trackUnsubscribed(track, participant));
    participant.tracks.forEach((publication) => {
        if (!publication.isSubscribed)
            return;
        trackSubscribed(div, publication.track, participant);
    });
}
function participantDisconnected(participant) {
    var _a;
    appendLog('participant', participant.sid, 'disconnected');
    (_a = $(participant.sid)) === null || _a === void 0 ? void 0 : _a.remove();
}
let currentRoom;
let videoTrack;
let audioTrack;
let screenTrack;
window.connectWithFormInput = () => {
    const url = $('url').value;
    const token = $('token').value;
    const simulcast = $('simulcast').checked;
    window.connectToRoom(url, token, simulcast);
};
window.connectToRoom = (url, token, simulcast = false) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield index_1.connect(url, token, {
        logLevel: index_1.LogLevel.debug,
        audio: true,
        video: true,
        simulcast,
    });
    window.currentRoom = room;
    appendLog('connected to room', room.name);
    setButtonsForState(true);
    currentRoom = room;
    window.currentRoom = room;
    room
        .on(index_1.RoomEvent.ParticipantConnected, participantConnected)
        .on(index_1.RoomEvent.ParticipantDisconnected, participantDisconnected)
        .on(index_1.RoomEvent.DataReceived, handleData)
        .on(index_1.RoomEvent.ActiveSpeakersChanged, handleSpeakerChanged)
        .on(index_1.RoomEvent.Disconnected, () => {
        appendLog('disconnected from room');
        setButtonsForState(false);
        if (videoTrack) {
            videoTrack.stop();
            trackUnsubscribed(videoTrack);
        }
        if (audioTrack) {
            audioTrack.stop();
            trackUnsubscribed(audioTrack);
        }
    });
    appendLog('room participants', room.participants.keys());
    room.participants.forEach((participant) => {
        participantConnected(participant);
    });
    $('local-video').innerHTML = `${room.localParticipant.identity} (local)`;
    // add already published tracks
    currentRoom.localParticipant.tracks.forEach((publication) => {
        if (publication.kind === index_1.Track.Kind.Video) {
            videoTrack = publication.track;
            publishLocalVideo(videoTrack);
        }
        else if (publication.kind === index_1.Track.Kind.Audio) {
            // skip adding local audio track, to avoid your own sound
            // only process local video tracks
            audioTrack = publication.track;
        }
    });
});
window.muteVideo = () => {
    if (!currentRoom || !videoTrack)
        return;
    const video = getMyVideo();
    if (!videoTrack.isMuted) {
        appendLog('muting video');
        videoTrack.mute();
        // hide from display
        if (video) {
            video.style.display = 'none';
        }
    }
    else {
        appendLog('unmuting video');
        videoTrack.unmute();
        if (video) {
            video.style.display = '';
        }
    }
};
window.muteAudio = () => {
    if (!currentRoom || !audioTrack)
        return;
    if (!audioTrack.isMuted) {
        appendLog('muting audio');
        audioTrack.mute();
    }
    else {
        appendLog('unmuting audio');
        audioTrack.unmute();
    }
};
window.toggleVideo = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!currentRoom)
        return;
    if (videoTrack) {
        appendLog('turning video off');
        currentRoom.localParticipant.unpublishTrack(videoTrack);
        videoTrack = undefined;
        const video = getMyVideo();
        if (video)
            video.remove();
    }
    else {
        appendLog('turning video on');
        videoTrack = yield index_1.createLocalVideoTrack();
        yield publishLocalVideo(videoTrack);
    }
});
window.enterText = () => {
    const textField = $('entry');
    if (textField.value) {
        const msg = encoder.encode(textField.value);
        currentRoom.localParticipant.publishData(msg, livekit_rtc_1.DataPacket_Kind.RELIABLE);
        ($('chat')).value += `${currentRoom.localParticipant.identity} (me): ${textField.value}\n`;
        textField.value = '';
    }
};
window.shareScreen = () => __awaiter(void 0, void 0, void 0, function* () {
    if (screenTrack != undefined) {
        currentRoom.localParticipant.unpublishTrack(screenTrack);
        screenTrack = undefined;
        return;
    }
    const mediaDevices = navigator.mediaDevices;
    const preset = index_1.VideoPresets.hd;
    const ssMediaStream = yield mediaDevices.getDisplayMedia({
        audio: false,
        video: {
            width: preset.resolution.width,
            height: preset.resolution.height,
        },
    });
    for (const t of ssMediaStream.getTracks()) {
        screenTrack = new index_1.LocalVideoTrack(t, 'screen');
        yield currentRoom.localParticipant.publishTrack(t, {
            videoEncoding: { maxFramerate: 30, maxBitrate: 3000000 },
            videoCodec: 'h264',
            simulcast: false,
        });
    }
});
window.disconnectSignal = () => {
    if (!currentRoom)
        return;
    currentRoom.engine.client.close();
    if (currentRoom.engine.client.onClose) {
        currentRoom.engine.client.onClose('manual disconnect');
    }
};
window.disconnectRoom = () => {
    if (currentRoom) {
        currentRoom.disconnect();
    }
};
function publishLocalVideo(track) {
    return __awaiter(this, void 0, void 0, function* () {
        yield currentRoom.localParticipant.publishTrack(track);
        const video = track.attach();
        video.style.transform = 'scale(-1, 1)';
        $('local-video').appendChild(video);
    });
}
function setButtonsForState(connected) {
    const connectedSet = [
        'toggle-video-button',
        'mute-video-button',
        'mute-audio-button',
        'share-screen-button',
        'disconnect-ws-button',
        'disconnect-room-button',
    ];
    const disconnectedSet = ['connect-button'];
    const toRemove = connected ? connectedSet : disconnectedSet;
    const toAdd = connected ? disconnectedSet : connectedSet;
    toRemove.forEach((id) => { var _a; return (_a = $(id)) === null || _a === void 0 ? void 0 : _a.removeAttribute('disabled'); });
    toAdd.forEach((id) => { var _a; return (_a = $(id)) === null || _a === void 0 ? void 0 : _a.setAttribute('disabled', 'true'); });
}
function getMyVideo() {
    return document.querySelector('#local-video video');
}
// uncomment to autoconnect after page load
// setTimeout(() => {
//   window.connectToRoom(
//     // 'ws://localhost:7880',
//     'ws://livekit-demo-1036575819.us-east-1.elb.amazonaws.com',
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTU2MTUwOTAsImlzcyI6IkFQSXU5SmpLdFpubXRLQmtjcXNFOUJuZkgiLCJqdGkiOiJtZSIsIm1ldGFkYXRhIjp7Im9yZGVyIjoxfSwibmJmIjoxNjEzMDIzMDkwLCJ2aWRlbyI6eyJyb29tIjoibXlyb29tIiwicm9vbUpvaW4iOnRydWV9fQ.MGEzYSO-Vh8gT1iwE_C8x63Km6f5EuqXVP8HKp4qXJA'
//   );
// }, 100);


/***/ }),

/***/ "../src/api/SignalClient.ts":
/*!**********************************!*\
  !*** ../src/api/SignalClient.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WSSignalClient = void 0;
const loglevel_1 = __importDefault(__webpack_require__(/*! loglevel */ "../node_modules/loglevel/lib/loglevel.js"));
__webpack_require__(/*! webrtc-adapter */ "../node_modules/webrtc-adapter/src/js/adapter_core.js");
const livekit_rtc_1 = __webpack_require__(/*! ../proto/livekit_rtc */ "../src/proto/livekit_rtc.ts");
const version_1 = __webpack_require__(/*! ../version */ "../src/version.ts");
class WSSignalClient {
    constructor(useJSON = false) {
        this.isConnected = false;
        this.useJSON = useJSON;
    }
    join(url, token, planB = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.connect(url, token, {
                usePlanB: planB,
            });
            return res;
        });
    }
    reconnect(url, token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect(url, token, {
                reconnect: true,
            });
        });
    }
    connect(url, token, opts) {
        url += `/rtc?access_token=${token}&protocol=${version_1.protocolVersion}`;
        if (opts.reconnect) {
            url += '&reconnect=1';
        }
        if (opts.usePlanB) {
            url += '&planb=1';
        }
        return new Promise((resolve, reject) => {
            loglevel_1.default.debug('connecting to', url);
            const ws = new WebSocket(url);
            ws.binaryType = 'arraybuffer';
            ws.onerror = (ev) => {
                if (!this.ws) {
                    // not yet connected, reject
                    reject('Could not connect');
                    return;
                }
                // other errors, handle
                this.handleWSError(ev);
            };
            ws.onopen = (ev) => {
                this.ws = ws;
                if (opts.reconnect) {
                    // upon reconnection, there will not be additional handshake
                    this.isConnected = true;
                    resolve();
                }
            };
            ws.onmessage = (ev) => {
                // not considered connected until JoinResponse is received
                let msg;
                if (typeof ev.data === 'string') {
                    const json = JSON.parse(ev.data);
                    msg = livekit_rtc_1.SignalResponse.fromJSON(json);
                }
                else if (ev.data instanceof ArrayBuffer) {
                    msg = livekit_rtc_1.SignalResponse.decode(new Uint8Array(ev.data));
                }
                else {
                    loglevel_1.default.error('could not decode websocket message', typeof ev.data);
                    return;
                }
                if (!this.isConnected) {
                    // handle join message only
                    if (msg.join) {
                        this.isConnected = true;
                        resolve(msg.join);
                    }
                    else {
                        reject('did not receive join response');
                    }
                    return;
                }
                this.handleSignalResponse(msg);
            };
            ws.onclose = (ev) => {
                if (!this.isConnected)
                    return;
                loglevel_1.default.debug('websocket connection closed', ev.reason);
                this.isConnected = false;
                if (this.onClose)
                    this.onClose(ev.reason);
            };
        });
    }
    close() {
        var _a;
        this.isConnected = false;
        if (this.ws)
            this.ws.onclose = null;
        (_a = this.ws) === null || _a === void 0 ? void 0 : _a.close();
    }
    // initial offer after joining
    sendOffer(offer) {
        loglevel_1.default.debug('sending offer', offer);
        this.sendRequest({
            offer: toProtoSessionDescription(offer),
        });
    }
    // answer a server-initiated offer
    sendAnswer(answer) {
        loglevel_1.default.debug('sending answer');
        this.sendRequest({
            answer: toProtoSessionDescription(answer),
        });
    }
    sendIceCandidate(candidate, target) {
        loglevel_1.default.debug('sending ice candidate', candidate);
        this.sendRequest({
            trickle: {
                candidateInit: JSON.stringify(candidate),
                target: target,
            },
        });
    }
    sendMuteTrack(trackSid, muted) {
        this.sendRequest({
            mute: {
                sid: trackSid,
                muted: muted,
            },
        });
    }
    sendAddTrack(cid, name, type) {
        this.sendRequest({
            addTrack: {
                cid,
                name,
                type,
            },
        });
    }
    sendUpdateTrackSettings(settings) {
        this.sendRequest({ trackSetting: settings });
    }
    sendUpdateSubscription(sub) {
        this.sendRequest({ subscription: sub });
    }
    sendLeave() {
        this.sendRequest({ leave: {} });
    }
    sendRequest(req) {
        if (!this.ws) {
            throw 'cannot send signal request before connected';
        }
        if (this.useJSON) {
            this.ws.send(JSON.stringify(livekit_rtc_1.SignalRequest.toJSON(req)));
        }
        else {
            this.ws.send(livekit_rtc_1.SignalRequest.encode(req).finish());
        }
    }
    handleSignalResponse(msg) {
        if (msg.answer) {
            const sd = fromProtoSessionDescription(msg.answer);
            if (this.onAnswer) {
                this.onAnswer(sd);
            }
        }
        else if (msg.offer) {
            const sd = fromProtoSessionDescription(msg.offer);
            if (this.onOffer) {
                this.onOffer(sd);
            }
        }
        else if (msg.trickle) {
            const candidate = JSON.parse(msg.trickle.candidateInit);
            if (this.onTrickle) {
                this.onTrickle(candidate, msg.trickle.target);
            }
        }
        else if (msg.update) {
            if (this.onParticipantUpdate) {
                this.onParticipantUpdate(msg.update.participants);
            }
        }
        else if (msg.trackPublished) {
            if (this.onLocalTrackPublished) {
                this.onLocalTrackPublished(msg.trackPublished);
            }
        }
        else if (msg.speaker) {
            if (this.onActiveSpeakersChanged) {
                this.onActiveSpeakersChanged(msg.speaker.speakers);
            }
        }
        else if (msg.leave) {
            if (this.onLeave) {
                this.onLeave();
            }
        }
        else {
            console.warn('unsupported message', msg);
        }
    }
    handleWSError(ev) {
        console.error('websocket error', ev);
    }
}
exports.WSSignalClient = WSSignalClient;
function fromProtoSessionDescription(sd) {
    const rsd = {
        sdp: sd.sdp,
    };
    switch (sd.type) {
        case 'answer':
        case 'offer':
        case 'pranswer':
        case 'rollback':
            rsd.type = sd.type;
    }
    return rsd;
}
function toProtoSessionDescription(rsd) {
    const sd = {
        sdp: rsd.sdp,
        type: rsd.type,
    };
    return sd;
}


/***/ }),

/***/ "../src/index.ts":
/*!***********************!*\
  !*** ../src/index.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalParticipant = exports.RemoteParticipant = exports.Participant = exports.DataPacket_Kind = exports.RoomState = exports.Room = void 0;
const livekit_rtc_1 = __webpack_require__(/*! ./proto/livekit_rtc */ "../src/proto/livekit_rtc.ts");
Object.defineProperty(exports, "DataPacket_Kind", ({ enumerable: true, get: function () { return livekit_rtc_1.DataPacket_Kind; } }));
const LocalParticipant_1 = __webpack_require__(/*! ./room/participant/LocalParticipant */ "../src/room/participant/LocalParticipant.ts");
Object.defineProperty(exports, "LocalParticipant", ({ enumerable: true, get: function () { return LocalParticipant_1.LocalParticipant; } }));
const Participant_1 = __webpack_require__(/*! ./room/participant/Participant */ "../src/room/participant/Participant.ts");
Object.defineProperty(exports, "Participant", ({ enumerable: true, get: function () { return Participant_1.Participant; } }));
const RemoteParticipant_1 = __webpack_require__(/*! ./room/participant/RemoteParticipant */ "../src/room/participant/RemoteParticipant.ts");
Object.defineProperty(exports, "RemoteParticipant", ({ enumerable: true, get: function () { return RemoteParticipant_1.RemoteParticipant; } }));
const Room_1 = __importStar(__webpack_require__(/*! ./room/Room */ "../src/room/Room.ts"));
exports.Room = Room_1.default;
Object.defineProperty(exports, "RoomState", ({ enumerable: true, get: function () { return Room_1.RoomState; } }));
__exportStar(__webpack_require__(/*! ./livekit */ "../src/livekit.ts"), exports);
__exportStar(__webpack_require__(/*! ./options */ "../src/options.ts"), exports);
__exportStar(__webpack_require__(/*! ./room/errors */ "../src/room/errors.ts"), exports);
__exportStar(__webpack_require__(/*! ./room/events */ "../src/room/events.ts"), exports);
__exportStar(__webpack_require__(/*! ./room/track/AudioTrack */ "../src/room/track/AudioTrack.ts"), exports);
__exportStar(__webpack_require__(/*! ./room/track/LocalAudioTrack */ "../src/room/track/LocalAudioTrack.ts"), exports);
__exportStar(__webpack_require__(/*! ./room/track/LocalTrackPublication */ "../src/room/track/LocalTrackPublication.ts"), exports);
__exportStar(__webpack_require__(/*! ./room/track/LocalVideoTrack */ "../src/room/track/LocalVideoTrack.ts"), exports);
__exportStar(__webpack_require__(/*! ./room/track/options */ "../src/room/track/options.ts"), exports);
__exportStar(__webpack_require__(/*! ./room/track/RemoteAudioTrack */ "../src/room/track/RemoteAudioTrack.ts"), exports);
__exportStar(__webpack_require__(/*! ./room/track/RemoteTrackPublication */ "../src/room/track/RemoteTrackPublication.ts"), exports);
__exportStar(__webpack_require__(/*! ./room/track/RemoteVideoTrack */ "../src/room/track/RemoteVideoTrack.ts"), exports);
__exportStar(__webpack_require__(/*! ./room/track/Track */ "../src/room/track/Track.ts"), exports);
__exportStar(__webpack_require__(/*! ./room/track/TrackPublication */ "../src/room/track/TrackPublication.ts"), exports);
__exportStar(__webpack_require__(/*! ./room/track/types */ "../src/room/track/types.ts"), exports);
__exportStar(__webpack_require__(/*! ./room/track/VideoTrack */ "../src/room/track/VideoTrack.ts"), exports);
__exportStar(__webpack_require__(/*! ./version */ "../src/version.ts"), exports);


/***/ }),

/***/ "../src/livekit.ts":
/*!*************************!*\
  !*** ../src/livekit.ts ***!
  \*************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createLocalTracks = exports.createLocalAudioTrack = exports.createLocalVideoTrack = exports.connect = exports.version = void 0;
const loglevel_1 = __importDefault(__webpack_require__(/*! loglevel */ "../node_modules/loglevel/lib/loglevel.js"));
const SignalClient_1 = __webpack_require__(/*! ./api/SignalClient */ "../src/api/SignalClient.ts");
const options_1 = __webpack_require__(/*! ./options */ "../src/options.ts");
const errors_1 = __webpack_require__(/*! ./room/errors */ "../src/room/errors.ts");
const Room_1 = __importDefault(__webpack_require__(/*! ./room/Room */ "../src/room/Room.ts"));
const LocalAudioTrack_1 = __webpack_require__(/*! ./room/track/LocalAudioTrack */ "../src/room/track/LocalAudioTrack.ts");
const LocalVideoTrack_1 = __webpack_require__(/*! ./room/track/LocalVideoTrack */ "../src/room/track/LocalVideoTrack.ts");
const Track_1 = __webpack_require__(/*! ./room/track/Track */ "../src/room/track/Track.ts");
var version_1 = __webpack_require__(/*! ./version */ "../src/version.ts");
Object.defineProperty(exports, "version", ({ enumerable: true, get: function () { return version_1.version; } }));
/**
 * Connects to a LiveKit room
 *
 * ```typescript
 * connect('wss://myhost.livekit.io', token, {
 *   // publish audio and video tracks on joining
 *   audio: true,
 *   video: {
 *     resolution: VideoPresets.hd,
 *     facingMode: {
 *       ideal: "user",
 *     }
 *   }
 * })
 * ```
 * @param url URL to LiveKit server
 * @param token AccessToken, a JWT token that includes authentication and room details
 * @param options
 */
function connect(url, token, options) {
    return __awaiter(this, void 0, void 0, function* () {
        // set defaults
        options || (options = {});
        options.logLevel || (options.logLevel = options_1.LogLevel.info);
        if (options.audio === undefined)
            options.audio = false;
        if (options.video === undefined)
            options.video = false;
        loglevel_1.default.setLevel(options.logLevel);
        let config = {};
        if (options.iceServers) {
            config.iceServers = options.iceServers;
        }
        const client = new SignalClient_1.WSSignalClient();
        const room = new Room_1.default(client, config);
        // connect to room
        yield room.connect(url, token);
        // add tracks if available
        let tracks = options.tracks;
        if (!tracks) {
            if (options.audio || options.video) {
                tracks = yield createLocalTracks({
                    audio: options.audio,
                    video: options.video,
                });
            }
        }
        if (tracks) {
            for (let i = 0; i < tracks.length; i++) {
                const track = tracks[i];
                // translate publish options
                const trackOptions = {};
                if (track.kind === Track_1.Track.Kind.Video.toString() ||
                    track.kind === Track_1.Track.Kind.Video) {
                    trackOptions.videoCodec = options === null || options === void 0 ? void 0 : options.videoCodec;
                    trackOptions.videoEncoding = options === null || options === void 0 ? void 0 : options.videoEncoding;
                    trackOptions.simulcast = options === null || options === void 0 ? void 0 : options.simulcast;
                }
                else if (track.kind === Track_1.Track.Kind.Audio.toString() ||
                    track.kind === Track_1.Track.Kind.Audio) {
                    trackOptions.audioBitrate = options.audioBitrate;
                }
                const publication = yield room.localParticipant.publishTrack(track, trackOptions);
            }
        }
        return room;
    });
}
exports.connect = connect;
/**
 * Creates a [[LocalVideoTrack]] with getUserMedia()
 * @param options
 */
function createLocalVideoTrack(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const tracks = yield createLocalTracks({
            audio: false,
            video: options,
        });
        return tracks[0];
    });
}
exports.createLocalVideoTrack = createLocalVideoTrack;
function createLocalAudioTrack(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const tracks = yield createLocalTracks({
            audio: options,
            video: false,
        });
        return tracks[0];
    });
}
exports.createLocalAudioTrack = createLocalAudioTrack;
/**
 * creates a local video and audio track at the same time
 * @param options
 */
function createLocalTracks(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const constraints = {};
        if (!options)
            options = {};
        if (options.audio === undefined)
            options.audio = {};
        // default video options
        let videoOptions = Object.assign({}, options_1.VideoPresets.qhd.resolution);
        if (typeof options.video === 'object' && options.video) {
            Object.assign(videoOptions, options.video);
            if (options.video.resolution) {
                Object.assign(videoOptions, options.video.resolution);
            }
        }
        if (options.video === false) {
            constraints.video = false;
        }
        else {
            // use defaults
            constraints.video = videoOptions;
        }
        loglevel_1.default.debug('video constraints', constraints.video);
        constraints.audio = options.audio;
        const stream = yield navigator.mediaDevices.getUserMedia(constraints);
        const tracks = [];
        stream.getTracks().forEach((mediaStreamTrack) => {
            let trackOptions = mediaStreamTrack.kind === 'audio' ? options.audio : options.video;
            if (typeof trackOptions === 'boolean' || !trackOptions) {
                trackOptions = {};
            }
            tracks.push(createLocalTrack(mediaStreamTrack, trackOptions));
        });
        return tracks;
    });
}
exports.createLocalTracks = createLocalTracks;
/** @internal */
function createLocalTrack(mediaStreamTrack, options) {
    let name;
    if (options instanceof Object && options.name) {
        name = options.name;
    }
    switch (mediaStreamTrack.kind) {
        case 'audio':
            return new LocalAudioTrack_1.LocalAudioTrack(mediaStreamTrack, name, options);
        case 'video':
            return new LocalVideoTrack_1.LocalVideoTrack(mediaStreamTrack, name, options);
        default:
            throw new errors_1.TrackInvalidError('unsupported track type: ' + mediaStreamTrack.kind);
    }
}


/***/ }),

/***/ "../src/options.ts":
/*!*************************!*\
  !*** ../src/options.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VideoPresets = exports.AudioPresets = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel["trace"] = "trace";
    LogLevel["debug"] = "debug";
    LogLevel["info"] = "info";
    LogLevel["warn"] = "warn";
    LogLevel["error"] = "error";
    LogLevel["silent"] = "silent";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var AudioPresets;
(function (AudioPresets) {
    AudioPresets.telephone = {
        maxBitrate: 12000,
    };
    AudioPresets.speech = {
        maxBitrate: 20000,
    };
    AudioPresets.music = {
        maxBitrate: 32000,
    };
})(AudioPresets = exports.AudioPresets || (exports.AudioPresets = {}));
/**
 * Sane presets for video resolution/encoding
 */
var VideoPresets;
(function (VideoPresets) {
    /** 320x180 @ 15fps, 150kbps  */
    VideoPresets.qvga = {
        resolution: {
            width: { ideal: 320 },
            height: { ideal: 180 },
            frameRate: {
                ideal: 15,
                max: 30,
            },
        },
        encoding: {
            maxBitrate: 150000,
            maxFramerate: 15.0,
        },
    };
    /** 640x360 @ 30fps, 500kbps  */
    VideoPresets.vga = {
        resolution: {
            width: { ideal: 640 },
            height: { ideal: 360 },
            frameRate: {
                ideal: 30,
                max: 60,
            },
        },
        encoding: {
            maxBitrate: 500000,
            maxFramerate: 30.0,
        },
    };
    /** 960x540 @ 30fps, 1.2mbps  */
    VideoPresets.qhd = {
        resolution: {
            width: { ideal: 960 },
            height: { ideal: 540 },
            frameRate: {
                ideal: 30,
                max: 60,
            },
        },
        encoding: {
            maxBitrate: 600000,
            maxFramerate: 30.0,
        },
    };
    /** 720p @ 30fps, 2.5mbps  */
    VideoPresets.hd = {
        resolution: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: {
                ideal: 30,
                max: 60,
            },
        },
        encoding: {
            maxBitrate: 2500000,
            maxFramerate: 30.0,
        },
    };
    /** 1080p @ 30fps, 4mbps  */
    VideoPresets.fhd = {
        resolution: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: {
                ideal: 30,
                max: 60,
            },
        },
        encoding: {
            maxBitrate: 4000000,
            maxFramerate: 30.0,
        },
    };
})(VideoPresets = exports.VideoPresets || (exports.VideoPresets = {}));


/***/ }),

/***/ "../src/proto/livekit_models.ts":
/*!**************************************!*\
  !*** ../src/proto/livekit_models.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DataMessage = exports.TrackInfo = exports.ParticipantInfo = exports.Room = exports.participantInfo_StateToJSON = exports.participantInfo_StateFromJSON = exports.ParticipantInfo_State = exports.trackTypeToJSON = exports.trackTypeFromJSON = exports.TrackType = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(/*! long */ "../node_modules/long/src/long.js"));
const minimal_1 = __importDefault(__webpack_require__(/*! protobufjs/minimal */ "../node_modules/protobufjs/minimal.js"));
exports.protobufPackage = 'livekit';
var TrackType;
(function (TrackType) {
    TrackType[TrackType["AUDIO"] = 0] = "AUDIO";
    TrackType[TrackType["VIDEO"] = 1] = "VIDEO";
    TrackType[TrackType["DATA"] = 2] = "DATA";
    TrackType[TrackType["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(TrackType = exports.TrackType || (exports.TrackType = {}));
function trackTypeFromJSON(object) {
    switch (object) {
        case 0:
        case 'AUDIO':
            return TrackType.AUDIO;
        case 1:
        case 'VIDEO':
            return TrackType.VIDEO;
        case 2:
        case 'DATA':
            return TrackType.DATA;
        case -1:
        case 'UNRECOGNIZED':
        default:
            return TrackType.UNRECOGNIZED;
    }
}
exports.trackTypeFromJSON = trackTypeFromJSON;
function trackTypeToJSON(object) {
    switch (object) {
        case TrackType.AUDIO:
            return 'AUDIO';
        case TrackType.VIDEO:
            return 'VIDEO';
        case TrackType.DATA:
            return 'DATA';
        default:
            return 'UNKNOWN';
    }
}
exports.trackTypeToJSON = trackTypeToJSON;
var ParticipantInfo_State;
(function (ParticipantInfo_State) {
    /** JOINING - websocket' connected, but not offered yet */
    ParticipantInfo_State[ParticipantInfo_State["JOINING"] = 0] = "JOINING";
    /** JOINED - server received client offer */
    ParticipantInfo_State[ParticipantInfo_State["JOINED"] = 1] = "JOINED";
    /** ACTIVE - ICE connectivity established */
    ParticipantInfo_State[ParticipantInfo_State["ACTIVE"] = 2] = "ACTIVE";
    /** DISCONNECTED - WS disconnected */
    ParticipantInfo_State[ParticipantInfo_State["DISCONNECTED"] = 3] = "DISCONNECTED";
    ParticipantInfo_State[ParticipantInfo_State["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(ParticipantInfo_State = exports.ParticipantInfo_State || (exports.ParticipantInfo_State = {}));
function participantInfo_StateFromJSON(object) {
    switch (object) {
        case 0:
        case 'JOINING':
            return ParticipantInfo_State.JOINING;
        case 1:
        case 'JOINED':
            return ParticipantInfo_State.JOINED;
        case 2:
        case 'ACTIVE':
            return ParticipantInfo_State.ACTIVE;
        case 3:
        case 'DISCONNECTED':
            return ParticipantInfo_State.DISCONNECTED;
        case -1:
        case 'UNRECOGNIZED':
        default:
            return ParticipantInfo_State.UNRECOGNIZED;
    }
}
exports.participantInfo_StateFromJSON = participantInfo_StateFromJSON;
function participantInfo_StateToJSON(object) {
    switch (object) {
        case ParticipantInfo_State.JOINING:
            return 'JOINING';
        case ParticipantInfo_State.JOINED:
            return 'JOINED';
        case ParticipantInfo_State.ACTIVE:
            return 'ACTIVE';
        case ParticipantInfo_State.DISCONNECTED:
            return 'DISCONNECTED';
        default:
            return 'UNKNOWN';
    }
}
exports.participantInfo_StateToJSON = participantInfo_StateToJSON;
const baseRoom = {
    sid: '',
    name: '',
    emptyTimeout: 0,
    maxParticipants: 0,
    creationTime: 0,
    turnPassword: '',
};
exports.Room = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sid !== '') {
            writer.uint32(10).string(message.sid);
        }
        if (message.name !== '') {
            writer.uint32(18).string(message.name);
        }
        if (message.emptyTimeout !== 0) {
            writer.uint32(24).uint32(message.emptyTimeout);
        }
        if (message.maxParticipants !== 0) {
            writer.uint32(32).uint32(message.maxParticipants);
        }
        if (message.creationTime !== 0) {
            writer.uint32(40).int64(message.creationTime);
        }
        if (message.turnPassword !== '') {
            writer.uint32(50).string(message.turnPassword);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseRoom);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sid = reader.string();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    message.emptyTimeout = reader.uint32();
                    break;
                case 4:
                    message.maxParticipants = reader.uint32();
                    break;
                case 5:
                    message.creationTime = longToNumber(reader.int64());
                    break;
                case 6:
                    message.turnPassword = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseRoom);
        if (object.sid !== undefined && object.sid !== null) {
            message.sid = String(object.sid);
        }
        else {
            message.sid = '';
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = String(object.name);
        }
        else {
            message.name = '';
        }
        if (object.emptyTimeout !== undefined && object.emptyTimeout !== null) {
            message.emptyTimeout = Number(object.emptyTimeout);
        }
        else {
            message.emptyTimeout = 0;
        }
        if (object.maxParticipants !== undefined &&
            object.maxParticipants !== null) {
            message.maxParticipants = Number(object.maxParticipants);
        }
        else {
            message.maxParticipants = 0;
        }
        if (object.creationTime !== undefined && object.creationTime !== null) {
            message.creationTime = Number(object.creationTime);
        }
        else {
            message.creationTime = 0;
        }
        if (object.turnPassword !== undefined && object.turnPassword !== null) {
            message.turnPassword = String(object.turnPassword);
        }
        else {
            message.turnPassword = '';
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.sid !== undefined && (obj.sid = message.sid);
        message.name !== undefined && (obj.name = message.name);
        message.emptyTimeout !== undefined &&
            (obj.emptyTimeout = message.emptyTimeout);
        message.maxParticipants !== undefined &&
            (obj.maxParticipants = message.maxParticipants);
        message.creationTime !== undefined &&
            (obj.creationTime = message.creationTime);
        message.turnPassword !== undefined &&
            (obj.turnPassword = message.turnPassword);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseRoom);
        if (object.sid !== undefined && object.sid !== null) {
            message.sid = object.sid;
        }
        else {
            message.sid = '';
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = object.name;
        }
        else {
            message.name = '';
        }
        if (object.emptyTimeout !== undefined && object.emptyTimeout !== null) {
            message.emptyTimeout = object.emptyTimeout;
        }
        else {
            message.emptyTimeout = 0;
        }
        if (object.maxParticipants !== undefined &&
            object.maxParticipants !== null) {
            message.maxParticipants = object.maxParticipants;
        }
        else {
            message.maxParticipants = 0;
        }
        if (object.creationTime !== undefined && object.creationTime !== null) {
            message.creationTime = object.creationTime;
        }
        else {
            message.creationTime = 0;
        }
        if (object.turnPassword !== undefined && object.turnPassword !== null) {
            message.turnPassword = object.turnPassword;
        }
        else {
            message.turnPassword = '';
        }
        return message;
    },
};
const baseParticipantInfo = {
    sid: '',
    identity: '',
    state: 0,
    metadata: '',
    joinedAt: 0,
};
exports.ParticipantInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sid !== '') {
            writer.uint32(10).string(message.sid);
        }
        if (message.identity !== '') {
            writer.uint32(18).string(message.identity);
        }
        if (message.state !== 0) {
            writer.uint32(24).int32(message.state);
        }
        for (const v of message.tracks) {
            exports.TrackInfo.encode(v, writer.uint32(34).fork()).ldelim();
        }
        if (message.metadata !== '') {
            writer.uint32(42).string(message.metadata);
        }
        if (message.joinedAt !== 0) {
            writer.uint32(48).int64(message.joinedAt);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseParticipantInfo);
        message.tracks = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sid = reader.string();
                    break;
                case 2:
                    message.identity = reader.string();
                    break;
                case 3:
                    message.state = reader.int32();
                    break;
                case 4:
                    message.tracks.push(exports.TrackInfo.decode(reader, reader.uint32()));
                    break;
                case 5:
                    message.metadata = reader.string();
                    break;
                case 6:
                    message.joinedAt = longToNumber(reader.int64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseParticipantInfo);
        message.tracks = [];
        if (object.sid !== undefined && object.sid !== null) {
            message.sid = String(object.sid);
        }
        else {
            message.sid = '';
        }
        if (object.identity !== undefined && object.identity !== null) {
            message.identity = String(object.identity);
        }
        else {
            message.identity = '';
        }
        if (object.state !== undefined && object.state !== null) {
            message.state = participantInfo_StateFromJSON(object.state);
        }
        else {
            message.state = 0;
        }
        if (object.tracks !== undefined && object.tracks !== null) {
            for (const e of object.tracks) {
                message.tracks.push(exports.TrackInfo.fromJSON(e));
            }
        }
        if (object.metadata !== undefined && object.metadata !== null) {
            message.metadata = String(object.metadata);
        }
        else {
            message.metadata = '';
        }
        if (object.joinedAt !== undefined && object.joinedAt !== null) {
            message.joinedAt = Number(object.joinedAt);
        }
        else {
            message.joinedAt = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.sid !== undefined && (obj.sid = message.sid);
        message.identity !== undefined && (obj.identity = message.identity);
        message.state !== undefined &&
            (obj.state = participantInfo_StateToJSON(message.state));
        if (message.tracks) {
            obj.tracks = message.tracks.map((e) => e ? exports.TrackInfo.toJSON(e) : undefined);
        }
        else {
            obj.tracks = [];
        }
        message.metadata !== undefined && (obj.metadata = message.metadata);
        message.joinedAt !== undefined && (obj.joinedAt = message.joinedAt);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseParticipantInfo);
        message.tracks = [];
        if (object.sid !== undefined && object.sid !== null) {
            message.sid = object.sid;
        }
        else {
            message.sid = '';
        }
        if (object.identity !== undefined && object.identity !== null) {
            message.identity = object.identity;
        }
        else {
            message.identity = '';
        }
        if (object.state !== undefined && object.state !== null) {
            message.state = object.state;
        }
        else {
            message.state = 0;
        }
        if (object.tracks !== undefined && object.tracks !== null) {
            for (const e of object.tracks) {
                message.tracks.push(exports.TrackInfo.fromPartial(e));
            }
        }
        if (object.metadata !== undefined && object.metadata !== null) {
            message.metadata = object.metadata;
        }
        else {
            message.metadata = '';
        }
        if (object.joinedAt !== undefined && object.joinedAt !== null) {
            message.joinedAt = object.joinedAt;
        }
        else {
            message.joinedAt = 0;
        }
        return message;
    },
};
const baseTrackInfo = { sid: '', type: 0, name: '', muted: false };
exports.TrackInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sid !== '') {
            writer.uint32(10).string(message.sid);
        }
        if (message.type !== 0) {
            writer.uint32(16).int32(message.type);
        }
        if (message.name !== '') {
            writer.uint32(26).string(message.name);
        }
        if (message.muted === true) {
            writer.uint32(32).bool(message.muted);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseTrackInfo);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sid = reader.string();
                    break;
                case 2:
                    message.type = reader.int32();
                    break;
                case 3:
                    message.name = reader.string();
                    break;
                case 4:
                    message.muted = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseTrackInfo);
        if (object.sid !== undefined && object.sid !== null) {
            message.sid = String(object.sid);
        }
        else {
            message.sid = '';
        }
        if (object.type !== undefined && object.type !== null) {
            message.type = trackTypeFromJSON(object.type);
        }
        else {
            message.type = 0;
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = String(object.name);
        }
        else {
            message.name = '';
        }
        if (object.muted !== undefined && object.muted !== null) {
            message.muted = Boolean(object.muted);
        }
        else {
            message.muted = false;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.sid !== undefined && (obj.sid = message.sid);
        message.type !== undefined && (obj.type = trackTypeToJSON(message.type));
        message.name !== undefined && (obj.name = message.name);
        message.muted !== undefined && (obj.muted = message.muted);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseTrackInfo);
        if (object.sid !== undefined && object.sid !== null) {
            message.sid = object.sid;
        }
        else {
            message.sid = '';
        }
        if (object.type !== undefined && object.type !== null) {
            message.type = object.type;
        }
        else {
            message.type = 0;
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = object.name;
        }
        else {
            message.name = '';
        }
        if (object.muted !== undefined && object.muted !== null) {
            message.muted = object.muted;
        }
        else {
            message.muted = false;
        }
        return message;
    },
};
const baseDataMessage = {};
exports.DataMessage = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.text !== undefined) {
            writer.uint32(10).string(message.text);
        }
        if (message.binary !== undefined) {
            writer.uint32(18).bytes(message.binary);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseDataMessage);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.text = reader.string();
                    break;
                case 2:
                    message.binary = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseDataMessage);
        if (object.text !== undefined && object.text !== null) {
            message.text = String(object.text);
        }
        else {
            message.text = undefined;
        }
        if (object.binary !== undefined && object.binary !== null) {
            message.binary = bytesFromBase64(object.binary);
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.text !== undefined && (obj.text = message.text);
        message.binary !== undefined &&
            (obj.binary =
                message.binary !== undefined
                    ? base64FromBytes(message.binary)
                    : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseDataMessage);
        if (object.text !== undefined && object.text !== null) {
            message.text = object.text;
        }
        else {
            message.text = undefined;
        }
        if (object.binary !== undefined && object.binary !== null) {
            message.binary = object.binary;
        }
        else {
            message.binary = undefined;
        }
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== 'undefined')
        return globalThis;
    if (typeof self !== 'undefined')
        return self;
    if (typeof window !== 'undefined')
        return window;
    if (typeof __webpack_require__.g !== 'undefined')
        return __webpack_require__.g;
    throw 'Unable to locate global object';
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, 'base64').toString('binary'));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, 'binary').toString('base64'));
function base64FromBytes(arr) {
    const bin = [];
    for (let i = 0; i < arr.byteLength; ++i) {
        bin.push(String.fromCharCode(arr[i]));
    }
    return btoa(bin.join(''));
}
function longToNumber(long) {
    if (long.gt(Number.MAX_SAFE_INTEGER)) {
        throw new globalThis.Error('Value is larger than Number.MAX_SAFE_INTEGER');
    }
    return long.toNumber();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}


/***/ }),

/***/ "../src/proto/livekit_rtc.ts":
/*!***********************************!*\
  !*** ../src/proto/livekit_rtc.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserPacket = exports.DataPacket = exports.ICEServer = exports.LeaveRequest = exports.UpdateTrackSettings = exports.UpdateSubscription = exports.SpeakerInfo = exports.ActiveSpeakerUpdate = exports.ParticipantUpdate = exports.SessionDescription = exports.TrackPublishedResponse = exports.JoinResponse = exports.NegotiationRequest = exports.MuteTrackRequest = exports.TrickleRequest = exports.AddTrackRequest = exports.SignalResponse = exports.SignalRequest = exports.dataPacket_KindToJSON = exports.dataPacket_KindFromJSON = exports.DataPacket_Kind = exports.videoQualityToJSON = exports.videoQualityFromJSON = exports.VideoQuality = exports.signalTargetToJSON = exports.signalTargetFromJSON = exports.SignalTarget = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(/*! long */ "../node_modules/long/src/long.js"));
const minimal_1 = __importDefault(__webpack_require__(/*! protobufjs/minimal */ "../node_modules/protobufjs/minimal.js"));
const livekit_models_1 = __webpack_require__(/*! ./livekit_models */ "../src/proto/livekit_models.ts");
exports.protobufPackage = 'livekit';
var SignalTarget;
(function (SignalTarget) {
    SignalTarget[SignalTarget["PUBLISHER"] = 0] = "PUBLISHER";
    SignalTarget[SignalTarget["SUBSCRIBER"] = 1] = "SUBSCRIBER";
    SignalTarget[SignalTarget["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(SignalTarget = exports.SignalTarget || (exports.SignalTarget = {}));
function signalTargetFromJSON(object) {
    switch (object) {
        case 0:
        case 'PUBLISHER':
            return SignalTarget.PUBLISHER;
        case 1:
        case 'SUBSCRIBER':
            return SignalTarget.SUBSCRIBER;
        case -1:
        case 'UNRECOGNIZED':
        default:
            return SignalTarget.UNRECOGNIZED;
    }
}
exports.signalTargetFromJSON = signalTargetFromJSON;
function signalTargetToJSON(object) {
    switch (object) {
        case SignalTarget.PUBLISHER:
            return 'PUBLISHER';
        case SignalTarget.SUBSCRIBER:
            return 'SUBSCRIBER';
        default:
            return 'UNKNOWN';
    }
}
exports.signalTargetToJSON = signalTargetToJSON;
var VideoQuality;
(function (VideoQuality) {
    VideoQuality[VideoQuality["LOW"] = 0] = "LOW";
    VideoQuality[VideoQuality["MEDIUM"] = 1] = "MEDIUM";
    VideoQuality[VideoQuality["HIGH"] = 2] = "HIGH";
    VideoQuality[VideoQuality["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(VideoQuality = exports.VideoQuality || (exports.VideoQuality = {}));
function videoQualityFromJSON(object) {
    switch (object) {
        case 0:
        case 'LOW':
            return VideoQuality.LOW;
        case 1:
        case 'MEDIUM':
            return VideoQuality.MEDIUM;
        case 2:
        case 'HIGH':
            return VideoQuality.HIGH;
        case -1:
        case 'UNRECOGNIZED':
        default:
            return VideoQuality.UNRECOGNIZED;
    }
}
exports.videoQualityFromJSON = videoQualityFromJSON;
function videoQualityToJSON(object) {
    switch (object) {
        case VideoQuality.LOW:
            return 'LOW';
        case VideoQuality.MEDIUM:
            return 'MEDIUM';
        case VideoQuality.HIGH:
            return 'HIGH';
        default:
            return 'UNKNOWN';
    }
}
exports.videoQualityToJSON = videoQualityToJSON;
var DataPacket_Kind;
(function (DataPacket_Kind) {
    DataPacket_Kind[DataPacket_Kind["RELIABLE"] = 0] = "RELIABLE";
    DataPacket_Kind[DataPacket_Kind["LOSSY"] = 1] = "LOSSY";
    DataPacket_Kind[DataPacket_Kind["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(DataPacket_Kind = exports.DataPacket_Kind || (exports.DataPacket_Kind = {}));
function dataPacket_KindFromJSON(object) {
    switch (object) {
        case 0:
        case 'RELIABLE':
            return DataPacket_Kind.RELIABLE;
        case 1:
        case 'LOSSY':
            return DataPacket_Kind.LOSSY;
        case -1:
        case 'UNRECOGNIZED':
        default:
            return DataPacket_Kind.UNRECOGNIZED;
    }
}
exports.dataPacket_KindFromJSON = dataPacket_KindFromJSON;
function dataPacket_KindToJSON(object) {
    switch (object) {
        case DataPacket_Kind.RELIABLE:
            return 'RELIABLE';
        case DataPacket_Kind.LOSSY:
            return 'LOSSY';
        default:
            return 'UNKNOWN';
    }
}
exports.dataPacket_KindToJSON = dataPacket_KindToJSON;
const baseSignalRequest = {};
exports.SignalRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.offer !== undefined) {
            exports.SessionDescription.encode(message.offer, writer.uint32(10).fork()).ldelim();
        }
        if (message.answer !== undefined) {
            exports.SessionDescription.encode(message.answer, writer.uint32(18).fork()).ldelim();
        }
        if (message.trickle !== undefined) {
            exports.TrickleRequest.encode(message.trickle, writer.uint32(26).fork()).ldelim();
        }
        if (message.addTrack !== undefined) {
            exports.AddTrackRequest.encode(message.addTrack, writer.uint32(34).fork()).ldelim();
        }
        if (message.mute !== undefined) {
            exports.MuteTrackRequest.encode(message.mute, writer.uint32(42).fork()).ldelim();
        }
        if (message.subscription !== undefined) {
            exports.UpdateSubscription.encode(message.subscription, writer.uint32(50).fork()).ldelim();
        }
        if (message.trackSetting !== undefined) {
            exports.UpdateTrackSettings.encode(message.trackSetting, writer.uint32(58).fork()).ldelim();
        }
        if (message.leave !== undefined) {
            exports.LeaveRequest.encode(message.leave, writer.uint32(66).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSignalRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.offer = exports.SessionDescription.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.answer = exports.SessionDescription.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.trickle = exports.TrickleRequest.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.addTrack = exports.AddTrackRequest.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.mute = exports.MuteTrackRequest.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.subscription = exports.UpdateSubscription.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.trackSetting = exports.UpdateTrackSettings.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.leave = exports.LeaveRequest.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSignalRequest);
        if (object.offer !== undefined && object.offer !== null) {
            message.offer = exports.SessionDescription.fromJSON(object.offer);
        }
        else {
            message.offer = undefined;
        }
        if (object.answer !== undefined && object.answer !== null) {
            message.answer = exports.SessionDescription.fromJSON(object.answer);
        }
        else {
            message.answer = undefined;
        }
        if (object.trickle !== undefined && object.trickle !== null) {
            message.trickle = exports.TrickleRequest.fromJSON(object.trickle);
        }
        else {
            message.trickle = undefined;
        }
        if (object.addTrack !== undefined && object.addTrack !== null) {
            message.addTrack = exports.AddTrackRequest.fromJSON(object.addTrack);
        }
        else {
            message.addTrack = undefined;
        }
        if (object.mute !== undefined && object.mute !== null) {
            message.mute = exports.MuteTrackRequest.fromJSON(object.mute);
        }
        else {
            message.mute = undefined;
        }
        if (object.subscription !== undefined && object.subscription !== null) {
            message.subscription = exports.UpdateSubscription.fromJSON(object.subscription);
        }
        else {
            message.subscription = undefined;
        }
        if (object.trackSetting !== undefined && object.trackSetting !== null) {
            message.trackSetting = exports.UpdateTrackSettings.fromJSON(object.trackSetting);
        }
        else {
            message.trackSetting = undefined;
        }
        if (object.leave !== undefined && object.leave !== null) {
            message.leave = exports.LeaveRequest.fromJSON(object.leave);
        }
        else {
            message.leave = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.offer !== undefined &&
            (obj.offer = message.offer
                ? exports.SessionDescription.toJSON(message.offer)
                : undefined);
        message.answer !== undefined &&
            (obj.answer = message.answer
                ? exports.SessionDescription.toJSON(message.answer)
                : undefined);
        message.trickle !== undefined &&
            (obj.trickle = message.trickle
                ? exports.TrickleRequest.toJSON(message.trickle)
                : undefined);
        message.addTrack !== undefined &&
            (obj.addTrack = message.addTrack
                ? exports.AddTrackRequest.toJSON(message.addTrack)
                : undefined);
        message.mute !== undefined &&
            (obj.mute = message.mute
                ? exports.MuteTrackRequest.toJSON(message.mute)
                : undefined);
        message.subscription !== undefined &&
            (obj.subscription = message.subscription
                ? exports.UpdateSubscription.toJSON(message.subscription)
                : undefined);
        message.trackSetting !== undefined &&
            (obj.trackSetting = message.trackSetting
                ? exports.UpdateTrackSettings.toJSON(message.trackSetting)
                : undefined);
        message.leave !== undefined &&
            (obj.leave = message.leave
                ? exports.LeaveRequest.toJSON(message.leave)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSignalRequest);
        if (object.offer !== undefined && object.offer !== null) {
            message.offer = exports.SessionDescription.fromPartial(object.offer);
        }
        else {
            message.offer = undefined;
        }
        if (object.answer !== undefined && object.answer !== null) {
            message.answer = exports.SessionDescription.fromPartial(object.answer);
        }
        else {
            message.answer = undefined;
        }
        if (object.trickle !== undefined && object.trickle !== null) {
            message.trickle = exports.TrickleRequest.fromPartial(object.trickle);
        }
        else {
            message.trickle = undefined;
        }
        if (object.addTrack !== undefined && object.addTrack !== null) {
            message.addTrack = exports.AddTrackRequest.fromPartial(object.addTrack);
        }
        else {
            message.addTrack = undefined;
        }
        if (object.mute !== undefined && object.mute !== null) {
            message.mute = exports.MuteTrackRequest.fromPartial(object.mute);
        }
        else {
            message.mute = undefined;
        }
        if (object.subscription !== undefined && object.subscription !== null) {
            message.subscription = exports.UpdateSubscription.fromPartial(object.subscription);
        }
        else {
            message.subscription = undefined;
        }
        if (object.trackSetting !== undefined && object.trackSetting !== null) {
            message.trackSetting = exports.UpdateTrackSettings.fromPartial(object.trackSetting);
        }
        else {
            message.trackSetting = undefined;
        }
        if (object.leave !== undefined && object.leave !== null) {
            message.leave = exports.LeaveRequest.fromPartial(object.leave);
        }
        else {
            message.leave = undefined;
        }
        return message;
    },
};
const baseSignalResponse = {};
exports.SignalResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.join !== undefined) {
            exports.JoinResponse.encode(message.join, writer.uint32(10).fork()).ldelim();
        }
        if (message.answer !== undefined) {
            exports.SessionDescription.encode(message.answer, writer.uint32(18).fork()).ldelim();
        }
        if (message.offer !== undefined) {
            exports.SessionDescription.encode(message.offer, writer.uint32(26).fork()).ldelim();
        }
        if (message.trickle !== undefined) {
            exports.TrickleRequest.encode(message.trickle, writer.uint32(34).fork()).ldelim();
        }
        if (message.update !== undefined) {
            exports.ParticipantUpdate.encode(message.update, writer.uint32(42).fork()).ldelim();
        }
        if (message.trackPublished !== undefined) {
            exports.TrackPublishedResponse.encode(message.trackPublished, writer.uint32(50).fork()).ldelim();
        }
        if (message.speaker !== undefined) {
            exports.ActiveSpeakerUpdate.encode(message.speaker, writer.uint32(58).fork()).ldelim();
        }
        if (message.leave !== undefined) {
            exports.LeaveRequest.encode(message.leave, writer.uint32(66).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSignalResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.join = exports.JoinResponse.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.answer = exports.SessionDescription.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.offer = exports.SessionDescription.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.trickle = exports.TrickleRequest.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.update = exports.ParticipantUpdate.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.trackPublished = exports.TrackPublishedResponse.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.speaker = exports.ActiveSpeakerUpdate.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.leave = exports.LeaveRequest.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSignalResponse);
        if (object.join !== undefined && object.join !== null) {
            message.join = exports.JoinResponse.fromJSON(object.join);
        }
        else {
            message.join = undefined;
        }
        if (object.answer !== undefined && object.answer !== null) {
            message.answer = exports.SessionDescription.fromJSON(object.answer);
        }
        else {
            message.answer = undefined;
        }
        if (object.offer !== undefined && object.offer !== null) {
            message.offer = exports.SessionDescription.fromJSON(object.offer);
        }
        else {
            message.offer = undefined;
        }
        if (object.trickle !== undefined && object.trickle !== null) {
            message.trickle = exports.TrickleRequest.fromJSON(object.trickle);
        }
        else {
            message.trickle = undefined;
        }
        if (object.update !== undefined && object.update !== null) {
            message.update = exports.ParticipantUpdate.fromJSON(object.update);
        }
        else {
            message.update = undefined;
        }
        if (object.trackPublished !== undefined && object.trackPublished !== null) {
            message.trackPublished = exports.TrackPublishedResponse.fromJSON(object.trackPublished);
        }
        else {
            message.trackPublished = undefined;
        }
        if (object.speaker !== undefined && object.speaker !== null) {
            message.speaker = exports.ActiveSpeakerUpdate.fromJSON(object.speaker);
        }
        else {
            message.speaker = undefined;
        }
        if (object.leave !== undefined && object.leave !== null) {
            message.leave = exports.LeaveRequest.fromJSON(object.leave);
        }
        else {
            message.leave = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.join !== undefined &&
            (obj.join = message.join ? exports.JoinResponse.toJSON(message.join) : undefined);
        message.answer !== undefined &&
            (obj.answer = message.answer
                ? exports.SessionDescription.toJSON(message.answer)
                : undefined);
        message.offer !== undefined &&
            (obj.offer = message.offer
                ? exports.SessionDescription.toJSON(message.offer)
                : undefined);
        message.trickle !== undefined &&
            (obj.trickle = message.trickle
                ? exports.TrickleRequest.toJSON(message.trickle)
                : undefined);
        message.update !== undefined &&
            (obj.update = message.update
                ? exports.ParticipantUpdate.toJSON(message.update)
                : undefined);
        message.trackPublished !== undefined &&
            (obj.trackPublished = message.trackPublished
                ? exports.TrackPublishedResponse.toJSON(message.trackPublished)
                : undefined);
        message.speaker !== undefined &&
            (obj.speaker = message.speaker
                ? exports.ActiveSpeakerUpdate.toJSON(message.speaker)
                : undefined);
        message.leave !== undefined &&
            (obj.leave = message.leave
                ? exports.LeaveRequest.toJSON(message.leave)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSignalResponse);
        if (object.join !== undefined && object.join !== null) {
            message.join = exports.JoinResponse.fromPartial(object.join);
        }
        else {
            message.join = undefined;
        }
        if (object.answer !== undefined && object.answer !== null) {
            message.answer = exports.SessionDescription.fromPartial(object.answer);
        }
        else {
            message.answer = undefined;
        }
        if (object.offer !== undefined && object.offer !== null) {
            message.offer = exports.SessionDescription.fromPartial(object.offer);
        }
        else {
            message.offer = undefined;
        }
        if (object.trickle !== undefined && object.trickle !== null) {
            message.trickle = exports.TrickleRequest.fromPartial(object.trickle);
        }
        else {
            message.trickle = undefined;
        }
        if (object.update !== undefined && object.update !== null) {
            message.update = exports.ParticipantUpdate.fromPartial(object.update);
        }
        else {
            message.update = undefined;
        }
        if (object.trackPublished !== undefined && object.trackPublished !== null) {
            message.trackPublished = exports.TrackPublishedResponse.fromPartial(object.trackPublished);
        }
        else {
            message.trackPublished = undefined;
        }
        if (object.speaker !== undefined && object.speaker !== null) {
            message.speaker = exports.ActiveSpeakerUpdate.fromPartial(object.speaker);
        }
        else {
            message.speaker = undefined;
        }
        if (object.leave !== undefined && object.leave !== null) {
            message.leave = exports.LeaveRequest.fromPartial(object.leave);
        }
        else {
            message.leave = undefined;
        }
        return message;
    },
};
const baseAddTrackRequest = { cid: '', name: '', type: 0 };
exports.AddTrackRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.cid !== '') {
            writer.uint32(10).string(message.cid);
        }
        if (message.name !== '') {
            writer.uint32(18).string(message.name);
        }
        if (message.type !== 0) {
            writer.uint32(24).int32(message.type);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseAddTrackRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.cid = reader.string();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    message.type = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseAddTrackRequest);
        if (object.cid !== undefined && object.cid !== null) {
            message.cid = String(object.cid);
        }
        else {
            message.cid = '';
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = String(object.name);
        }
        else {
            message.name = '';
        }
        if (object.type !== undefined && object.type !== null) {
            message.type = livekit_models_1.trackTypeFromJSON(object.type);
        }
        else {
            message.type = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.cid !== undefined && (obj.cid = message.cid);
        message.name !== undefined && (obj.name = message.name);
        message.type !== undefined && (obj.type = livekit_models_1.trackTypeToJSON(message.type));
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseAddTrackRequest);
        if (object.cid !== undefined && object.cid !== null) {
            message.cid = object.cid;
        }
        else {
            message.cid = '';
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = object.name;
        }
        else {
            message.name = '';
        }
        if (object.type !== undefined && object.type !== null) {
            message.type = object.type;
        }
        else {
            message.type = 0;
        }
        return message;
    },
};
const baseTrickleRequest = { candidateInit: '', target: 0 };
exports.TrickleRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.candidateInit !== '') {
            writer.uint32(10).string(message.candidateInit);
        }
        if (message.target !== 0) {
            writer.uint32(16).int32(message.target);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseTrickleRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.candidateInit = reader.string();
                    break;
                case 2:
                    message.target = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseTrickleRequest);
        if (object.candidateInit !== undefined && object.candidateInit !== null) {
            message.candidateInit = String(object.candidateInit);
        }
        else {
            message.candidateInit = '';
        }
        if (object.target !== undefined && object.target !== null) {
            message.target = signalTargetFromJSON(object.target);
        }
        else {
            message.target = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.candidateInit !== undefined &&
            (obj.candidateInit = message.candidateInit);
        message.target !== undefined &&
            (obj.target = signalTargetToJSON(message.target));
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseTrickleRequest);
        if (object.candidateInit !== undefined && object.candidateInit !== null) {
            message.candidateInit = object.candidateInit;
        }
        else {
            message.candidateInit = '';
        }
        if (object.target !== undefined && object.target !== null) {
            message.target = object.target;
        }
        else {
            message.target = 0;
        }
        return message;
    },
};
const baseMuteTrackRequest = { sid: '', muted: false };
exports.MuteTrackRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sid !== '') {
            writer.uint32(10).string(message.sid);
        }
        if (message.muted === true) {
            writer.uint32(16).bool(message.muted);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMuteTrackRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sid = reader.string();
                    break;
                case 2:
                    message.muted = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMuteTrackRequest);
        if (object.sid !== undefined && object.sid !== null) {
            message.sid = String(object.sid);
        }
        else {
            message.sid = '';
        }
        if (object.muted !== undefined && object.muted !== null) {
            message.muted = Boolean(object.muted);
        }
        else {
            message.muted = false;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.sid !== undefined && (obj.sid = message.sid);
        message.muted !== undefined && (obj.muted = message.muted);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMuteTrackRequest);
        if (object.sid !== undefined && object.sid !== null) {
            message.sid = object.sid;
        }
        else {
            message.sid = '';
        }
        if (object.muted !== undefined && object.muted !== null) {
            message.muted = object.muted;
        }
        else {
            message.muted = false;
        }
        return message;
    },
};
const baseNegotiationRequest = {};
exports.NegotiationRequest = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseNegotiationRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseNegotiationRequest);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseNegotiationRequest);
        return message;
    },
};
const baseJoinResponse = { serverVersion: '' };
exports.JoinResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.room !== undefined) {
            livekit_models_1.Room.encode(message.room, writer.uint32(10).fork()).ldelim();
        }
        if (message.participant !== undefined) {
            livekit_models_1.ParticipantInfo.encode(message.participant, writer.uint32(18).fork()).ldelim();
        }
        for (const v of message.otherParticipants) {
            livekit_models_1.ParticipantInfo.encode(v, writer.uint32(26).fork()).ldelim();
        }
        if (message.serverVersion !== '') {
            writer.uint32(34).string(message.serverVersion);
        }
        for (const v of message.iceServers) {
            exports.ICEServer.encode(v, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseJoinResponse);
        message.otherParticipants = [];
        message.iceServers = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.room = livekit_models_1.Room.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.participant = livekit_models_1.ParticipantInfo.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.otherParticipants.push(livekit_models_1.ParticipantInfo.decode(reader, reader.uint32()));
                    break;
                case 4:
                    message.serverVersion = reader.string();
                    break;
                case 5:
                    message.iceServers.push(exports.ICEServer.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseJoinResponse);
        message.otherParticipants = [];
        message.iceServers = [];
        if (object.room !== undefined && object.room !== null) {
            message.room = livekit_models_1.Room.fromJSON(object.room);
        }
        else {
            message.room = undefined;
        }
        if (object.participant !== undefined && object.participant !== null) {
            message.participant = livekit_models_1.ParticipantInfo.fromJSON(object.participant);
        }
        else {
            message.participant = undefined;
        }
        if (object.otherParticipants !== undefined &&
            object.otherParticipants !== null) {
            for (const e of object.otherParticipants) {
                message.otherParticipants.push(livekit_models_1.ParticipantInfo.fromJSON(e));
            }
        }
        if (object.serverVersion !== undefined && object.serverVersion !== null) {
            message.serverVersion = String(object.serverVersion);
        }
        else {
            message.serverVersion = '';
        }
        if (object.iceServers !== undefined && object.iceServers !== null) {
            for (const e of object.iceServers) {
                message.iceServers.push(exports.ICEServer.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.room !== undefined &&
            (obj.room = message.room ? livekit_models_1.Room.toJSON(message.room) : undefined);
        message.participant !== undefined &&
            (obj.participant = message.participant
                ? livekit_models_1.ParticipantInfo.toJSON(message.participant)
                : undefined);
        if (message.otherParticipants) {
            obj.otherParticipants = message.otherParticipants.map((e) => e ? livekit_models_1.ParticipantInfo.toJSON(e) : undefined);
        }
        else {
            obj.otherParticipants = [];
        }
        message.serverVersion !== undefined &&
            (obj.serverVersion = message.serverVersion);
        if (message.iceServers) {
            obj.iceServers = message.iceServers.map((e) => e ? exports.ICEServer.toJSON(e) : undefined);
        }
        else {
            obj.iceServers = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseJoinResponse);
        message.otherParticipants = [];
        message.iceServers = [];
        if (object.room !== undefined && object.room !== null) {
            message.room = livekit_models_1.Room.fromPartial(object.room);
        }
        else {
            message.room = undefined;
        }
        if (object.participant !== undefined && object.participant !== null) {
            message.participant = livekit_models_1.ParticipantInfo.fromPartial(object.participant);
        }
        else {
            message.participant = undefined;
        }
        if (object.otherParticipants !== undefined &&
            object.otherParticipants !== null) {
            for (const e of object.otherParticipants) {
                message.otherParticipants.push(livekit_models_1.ParticipantInfo.fromPartial(e));
            }
        }
        if (object.serverVersion !== undefined && object.serverVersion !== null) {
            message.serverVersion = object.serverVersion;
        }
        else {
            message.serverVersion = '';
        }
        if (object.iceServers !== undefined && object.iceServers !== null) {
            for (const e of object.iceServers) {
                message.iceServers.push(exports.ICEServer.fromPartial(e));
            }
        }
        return message;
    },
};
const baseTrackPublishedResponse = { cid: '' };
exports.TrackPublishedResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.cid !== '') {
            writer.uint32(10).string(message.cid);
        }
        if (message.track !== undefined) {
            livekit_models_1.TrackInfo.encode(message.track, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseTrackPublishedResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.cid = reader.string();
                    break;
                case 2:
                    message.track = livekit_models_1.TrackInfo.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseTrackPublishedResponse);
        if (object.cid !== undefined && object.cid !== null) {
            message.cid = String(object.cid);
        }
        else {
            message.cid = '';
        }
        if (object.track !== undefined && object.track !== null) {
            message.track = livekit_models_1.TrackInfo.fromJSON(object.track);
        }
        else {
            message.track = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.cid !== undefined && (obj.cid = message.cid);
        message.track !== undefined &&
            (obj.track = message.track ? livekit_models_1.TrackInfo.toJSON(message.track) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseTrackPublishedResponse);
        if (object.cid !== undefined && object.cid !== null) {
            message.cid = object.cid;
        }
        else {
            message.cid = '';
        }
        if (object.track !== undefined && object.track !== null) {
            message.track = livekit_models_1.TrackInfo.fromPartial(object.track);
        }
        else {
            message.track = undefined;
        }
        return message;
    },
};
const baseSessionDescription = { type: '', sdp: '' };
exports.SessionDescription = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.type !== '') {
            writer.uint32(10).string(message.type);
        }
        if (message.sdp !== '') {
            writer.uint32(18).string(message.sdp);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSessionDescription);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.type = reader.string();
                    break;
                case 2:
                    message.sdp = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSessionDescription);
        if (object.type !== undefined && object.type !== null) {
            message.type = String(object.type);
        }
        else {
            message.type = '';
        }
        if (object.sdp !== undefined && object.sdp !== null) {
            message.sdp = String(object.sdp);
        }
        else {
            message.sdp = '';
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.type !== undefined && (obj.type = message.type);
        message.sdp !== undefined && (obj.sdp = message.sdp);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSessionDescription);
        if (object.type !== undefined && object.type !== null) {
            message.type = object.type;
        }
        else {
            message.type = '';
        }
        if (object.sdp !== undefined && object.sdp !== null) {
            message.sdp = object.sdp;
        }
        else {
            message.sdp = '';
        }
        return message;
    },
};
const baseParticipantUpdate = {};
exports.ParticipantUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.participants) {
            livekit_models_1.ParticipantInfo.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseParticipantUpdate);
        message.participants = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.participants.push(livekit_models_1.ParticipantInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseParticipantUpdate);
        message.participants = [];
        if (object.participants !== undefined && object.participants !== null) {
            for (const e of object.participants) {
                message.participants.push(livekit_models_1.ParticipantInfo.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.participants) {
            obj.participants = message.participants.map((e) => e ? livekit_models_1.ParticipantInfo.toJSON(e) : undefined);
        }
        else {
            obj.participants = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseParticipantUpdate);
        message.participants = [];
        if (object.participants !== undefined && object.participants !== null) {
            for (const e of object.participants) {
                message.participants.push(livekit_models_1.ParticipantInfo.fromPartial(e));
            }
        }
        return message;
    },
};
const baseActiveSpeakerUpdate = {};
exports.ActiveSpeakerUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.speakers) {
            exports.SpeakerInfo.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseActiveSpeakerUpdate);
        message.speakers = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.speakers.push(exports.SpeakerInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseActiveSpeakerUpdate);
        message.speakers = [];
        if (object.speakers !== undefined && object.speakers !== null) {
            for (const e of object.speakers) {
                message.speakers.push(exports.SpeakerInfo.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.speakers) {
            obj.speakers = message.speakers.map((e) => e ? exports.SpeakerInfo.toJSON(e) : undefined);
        }
        else {
            obj.speakers = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseActiveSpeakerUpdate);
        message.speakers = [];
        if (object.speakers !== undefined && object.speakers !== null) {
            for (const e of object.speakers) {
                message.speakers.push(exports.SpeakerInfo.fromPartial(e));
            }
        }
        return message;
    },
};
const baseSpeakerInfo = { sid: '', level: 0, active: false };
exports.SpeakerInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sid !== '') {
            writer.uint32(10).string(message.sid);
        }
        if (message.level !== 0) {
            writer.uint32(21).float(message.level);
        }
        if (message.active === true) {
            writer.uint32(24).bool(message.active);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSpeakerInfo);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sid = reader.string();
                    break;
                case 2:
                    message.level = reader.float();
                    break;
                case 3:
                    message.active = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSpeakerInfo);
        if (object.sid !== undefined && object.sid !== null) {
            message.sid = String(object.sid);
        }
        else {
            message.sid = '';
        }
        if (object.level !== undefined && object.level !== null) {
            message.level = Number(object.level);
        }
        else {
            message.level = 0;
        }
        if (object.active !== undefined && object.active !== null) {
            message.active = Boolean(object.active);
        }
        else {
            message.active = false;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.sid !== undefined && (obj.sid = message.sid);
        message.level !== undefined && (obj.level = message.level);
        message.active !== undefined && (obj.active = message.active);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSpeakerInfo);
        if (object.sid !== undefined && object.sid !== null) {
            message.sid = object.sid;
        }
        else {
            message.sid = '';
        }
        if (object.level !== undefined && object.level !== null) {
            message.level = object.level;
        }
        else {
            message.level = 0;
        }
        if (object.active !== undefined && object.active !== null) {
            message.active = object.active;
        }
        else {
            message.active = false;
        }
        return message;
    },
};
const baseUpdateSubscription = {
    trackSids: '',
    subscribe: false,
    quality: 0,
};
exports.UpdateSubscription = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.trackSids) {
            writer.uint32(10).string(v);
        }
        if (message.subscribe === true) {
            writer.uint32(16).bool(message.subscribe);
        }
        if (message.quality !== 0) {
            writer.uint32(32).int32(message.quality);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseUpdateSubscription);
        message.trackSids = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.trackSids.push(reader.string());
                    break;
                case 2:
                    message.subscribe = reader.bool();
                    break;
                case 4:
                    message.quality = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseUpdateSubscription);
        message.trackSids = [];
        if (object.trackSids !== undefined && object.trackSids !== null) {
            for (const e of object.trackSids) {
                message.trackSids.push(String(e));
            }
        }
        if (object.subscribe !== undefined && object.subscribe !== null) {
            message.subscribe = Boolean(object.subscribe);
        }
        else {
            message.subscribe = false;
        }
        if (object.quality !== undefined && object.quality !== null) {
            message.quality = videoQualityFromJSON(object.quality);
        }
        else {
            message.quality = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.trackSids) {
            obj.trackSids = message.trackSids.map((e) => e);
        }
        else {
            obj.trackSids = [];
        }
        message.subscribe !== undefined && (obj.subscribe = message.subscribe);
        message.quality !== undefined &&
            (obj.quality = videoQualityToJSON(message.quality));
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseUpdateSubscription);
        message.trackSids = [];
        if (object.trackSids !== undefined && object.trackSids !== null) {
            for (const e of object.trackSids) {
                message.trackSids.push(e);
            }
        }
        if (object.subscribe !== undefined && object.subscribe !== null) {
            message.subscribe = object.subscribe;
        }
        else {
            message.subscribe = false;
        }
        if (object.quality !== undefined && object.quality !== null) {
            message.quality = object.quality;
        }
        else {
            message.quality = 0;
        }
        return message;
    },
};
const baseUpdateTrackSettings = {
    trackSids: '',
    disabled: false,
    quality: 0,
};
exports.UpdateTrackSettings = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.trackSids) {
            writer.uint32(10).string(v);
        }
        if (message.disabled === true) {
            writer.uint32(24).bool(message.disabled);
        }
        if (message.quality !== 0) {
            writer.uint32(32).int32(message.quality);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseUpdateTrackSettings);
        message.trackSids = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.trackSids.push(reader.string());
                    break;
                case 3:
                    message.disabled = reader.bool();
                    break;
                case 4:
                    message.quality = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseUpdateTrackSettings);
        message.trackSids = [];
        if (object.trackSids !== undefined && object.trackSids !== null) {
            for (const e of object.trackSids) {
                message.trackSids.push(String(e));
            }
        }
        if (object.disabled !== undefined && object.disabled !== null) {
            message.disabled = Boolean(object.disabled);
        }
        else {
            message.disabled = false;
        }
        if (object.quality !== undefined && object.quality !== null) {
            message.quality = videoQualityFromJSON(object.quality);
        }
        else {
            message.quality = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.trackSids) {
            obj.trackSids = message.trackSids.map((e) => e);
        }
        else {
            obj.trackSids = [];
        }
        message.disabled !== undefined && (obj.disabled = message.disabled);
        message.quality !== undefined &&
            (obj.quality = videoQualityToJSON(message.quality));
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseUpdateTrackSettings);
        message.trackSids = [];
        if (object.trackSids !== undefined && object.trackSids !== null) {
            for (const e of object.trackSids) {
                message.trackSids.push(e);
            }
        }
        if (object.disabled !== undefined && object.disabled !== null) {
            message.disabled = object.disabled;
        }
        else {
            message.disabled = false;
        }
        if (object.quality !== undefined && object.quality !== null) {
            message.quality = object.quality;
        }
        else {
            message.quality = 0;
        }
        return message;
    },
};
const baseLeaveRequest = {};
exports.LeaveRequest = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseLeaveRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseLeaveRequest);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseLeaveRequest);
        return message;
    },
};
const baseICEServer = { urls: '', username: '', credential: '' };
exports.ICEServer = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.urls) {
            writer.uint32(10).string(v);
        }
        if (message.username !== '') {
            writer.uint32(18).string(message.username);
        }
        if (message.credential !== '') {
            writer.uint32(26).string(message.credential);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseICEServer);
        message.urls = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.urls.push(reader.string());
                    break;
                case 2:
                    message.username = reader.string();
                    break;
                case 3:
                    message.credential = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseICEServer);
        message.urls = [];
        if (object.urls !== undefined && object.urls !== null) {
            for (const e of object.urls) {
                message.urls.push(String(e));
            }
        }
        if (object.username !== undefined && object.username !== null) {
            message.username = String(object.username);
        }
        else {
            message.username = '';
        }
        if (object.credential !== undefined && object.credential !== null) {
            message.credential = String(object.credential);
        }
        else {
            message.credential = '';
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.urls) {
            obj.urls = message.urls.map((e) => e);
        }
        else {
            obj.urls = [];
        }
        message.username !== undefined && (obj.username = message.username);
        message.credential !== undefined && (obj.credential = message.credential);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseICEServer);
        message.urls = [];
        if (object.urls !== undefined && object.urls !== null) {
            for (const e of object.urls) {
                message.urls.push(e);
            }
        }
        if (object.username !== undefined && object.username !== null) {
            message.username = object.username;
        }
        else {
            message.username = '';
        }
        if (object.credential !== undefined && object.credential !== null) {
            message.credential = object.credential;
        }
        else {
            message.credential = '';
        }
        return message;
    },
};
const baseDataPacket = { kind: 0 };
exports.DataPacket = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.kind !== 0) {
            writer.uint32(8).int32(message.kind);
        }
        if (message.user !== undefined) {
            exports.UserPacket.encode(message.user, writer.uint32(18).fork()).ldelim();
        }
        if (message.speaker !== undefined) {
            exports.ActiveSpeakerUpdate.encode(message.speaker, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseDataPacket);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.kind = reader.int32();
                    break;
                case 2:
                    message.user = exports.UserPacket.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.speaker = exports.ActiveSpeakerUpdate.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseDataPacket);
        if (object.kind !== undefined && object.kind !== null) {
            message.kind = dataPacket_KindFromJSON(object.kind);
        }
        else {
            message.kind = 0;
        }
        if (object.user !== undefined && object.user !== null) {
            message.user = exports.UserPacket.fromJSON(object.user);
        }
        else {
            message.user = undefined;
        }
        if (object.speaker !== undefined && object.speaker !== null) {
            message.speaker = exports.ActiveSpeakerUpdate.fromJSON(object.speaker);
        }
        else {
            message.speaker = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.kind !== undefined &&
            (obj.kind = dataPacket_KindToJSON(message.kind));
        message.user !== undefined &&
            (obj.user = message.user ? exports.UserPacket.toJSON(message.user) : undefined);
        message.speaker !== undefined &&
            (obj.speaker = message.speaker
                ? exports.ActiveSpeakerUpdate.toJSON(message.speaker)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseDataPacket);
        if (object.kind !== undefined && object.kind !== null) {
            message.kind = object.kind;
        }
        else {
            message.kind = 0;
        }
        if (object.user !== undefined && object.user !== null) {
            message.user = exports.UserPacket.fromPartial(object.user);
        }
        else {
            message.user = undefined;
        }
        if (object.speaker !== undefined && object.speaker !== null) {
            message.speaker = exports.ActiveSpeakerUpdate.fromPartial(object.speaker);
        }
        else {
            message.speaker = undefined;
        }
        return message;
    },
};
const baseUserPacket = { participantSid: '' };
exports.UserPacket = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.participantSid !== '') {
            writer.uint32(10).string(message.participantSid);
        }
        if (message.payload.length !== 0) {
            writer.uint32(18).bytes(message.payload);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseUserPacket);
        message.payload = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.participantSid = reader.string();
                    break;
                case 2:
                    message.payload = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseUserPacket);
        message.payload = new Uint8Array();
        if (object.participantSid !== undefined && object.participantSid !== null) {
            message.participantSid = String(object.participantSid);
        }
        else {
            message.participantSid = '';
        }
        if (object.payload !== undefined && object.payload !== null) {
            message.payload = bytesFromBase64(object.payload);
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.participantSid !== undefined &&
            (obj.participantSid = message.participantSid);
        message.payload !== undefined &&
            (obj.payload = base64FromBytes(message.payload !== undefined ? message.payload : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseUserPacket);
        if (object.participantSid !== undefined && object.participantSid !== null) {
            message.participantSid = object.participantSid;
        }
        else {
            message.participantSid = '';
        }
        if (object.payload !== undefined && object.payload !== null) {
            message.payload = object.payload;
        }
        else {
            message.payload = new Uint8Array();
        }
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== 'undefined')
        return globalThis;
    if (typeof self !== 'undefined')
        return self;
    if (typeof window !== 'undefined')
        return window;
    if (typeof __webpack_require__.g !== 'undefined')
        return __webpack_require__.g;
    throw 'Unable to locate global object';
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, 'base64').toString('binary'));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, 'binary').toString('base64'));
function base64FromBytes(arr) {
    const bin = [];
    for (let i = 0; i < arr.byteLength; ++i) {
        bin.push(String.fromCharCode(arr[i]));
    }
    return btoa(bin.join(''));
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}


/***/ }),

/***/ "../src/room/PCTransport.ts":
/*!**********************************!*\
  !*** ../src/room/PCTransport.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PCTransport = void 0;
class PCTransport {
    constructor(config) {
        this.pendingCandidates = [];
        this.pc = new RTCPeerConnection(config);
    }
    addIceCandidate(candidate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pc.remoteDescription) {
                return this.pc.addIceCandidate(candidate);
            }
            else {
                this.pendingCandidates.push(candidate);
            }
        });
    }
    setRemoteDescription(sd) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pc.setRemoteDescription(sd);
            this.pendingCandidates.forEach((candidate) => {
                this.pc.addIceCandidate(candidate);
            });
            this.pendingCandidates = [];
        });
    }
    close() {
        this.pc.close();
    }
}
exports.PCTransport = PCTransport;


/***/ }),

/***/ "../src/room/RTCEngine.ts":
/*!********************************!*\
  !*** ../src/room/RTCEngine.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RTCEngine = void 0;
const events_1 = __webpack_require__(/*! events */ "../node_modules/events/events.js");
const loglevel_1 = __importDefault(__webpack_require__(/*! loglevel */ "../node_modules/loglevel/lib/loglevel.js"));
const livekit_rtc_1 = __webpack_require__(/*! ../proto/livekit_rtc */ "../src/proto/livekit_rtc.ts");
const errors_1 = __webpack_require__(/*! ./errors */ "../src/room/errors.ts");
const events_2 = __webpack_require__(/*! ./events */ "../src/room/events.ts");
const PCTransport_1 = __webpack_require__(/*! ./PCTransport */ "../src/room/PCTransport.ts");
const Track_1 = __webpack_require__(/*! ./track/Track */ "../src/room/track/Track.ts");
const utils_1 = __webpack_require__(/*! ./utils */ "../src/room/utils.ts");
const lossyDataChannel = '_lossy';
const reliableDataChannel = '_reliable';
const maxWSRetries = 10;
class RTCEngine extends events_1.EventEmitter {
    constructor(client, config) {
        super();
        this.rtcConnected = false;
        this.iceConnected = false;
        this.pendingTrackResolvers = {};
        this.handleDataMessage = (message) => {
            // decode
            const dp = livekit_rtc_1.DataPacket.decode(new Uint8Array(message.data));
            if (dp.speaker) {
                // dispatch speaker updates
                this.emit(events_2.EngineEvent.SpeakersUpdate, dp.speaker.speakers);
            }
            else if (dp.user) {
                this.emit(events_2.EngineEvent.DataPacketReceived, dp.user, dp.kind);
            }
        };
        // websocket reconnect behavior. if websocket is interrupted, and the PeerConnection
        // continues to work, we can reconnect to websocket to continue the session
        // after a number of retries, we'll close and give up permanently
        this.handleWSClose = () => {
            if (!this.iceConnected) {
                return;
            }
            if (this.numRetries >= maxWSRetries) {
                loglevel_1.default.info('could not connect to signal after', maxWSRetries, 'attempts. giving up');
                this.close();
                this.emit(events_2.EngineEvent.Disconnected);
                return;
            }
            const delay = (this.numRetries ^ 2) * 500;
            setTimeout(() => {
                if (this.iceConnected && this.url && this.token) {
                    loglevel_1.default.info('reconnecting to signal connection, attempt', this.numRetries);
                    this.client
                        .reconnect(this.url, this.token)
                        .then(() => {
                        this.numRetries = 0;
                    })
                        .catch(this.handleWSClose);
                }
            }, delay);
            this.numRetries = this.numRetries + 1;
        };
        this.emitTrackEvent = (track, stream, receiver) => {
            this.emit(events_2.EngineEvent.MediaTrackAdded, track, stream, receiver);
        };
        this.client = client;
        this.rtcConfig = config || {};
        this.numRetries = 0;
        this.useLegacy = utils_1.useLegacyAPI();
        loglevel_1.default.trace('creating RTCEngine', 'useLegacy', this.useLegacy);
    }
    join(url, token) {
        return __awaiter(this, void 0, void 0, function* () {
            this.url = url;
            this.token = token;
            const joinResponse = yield this.client.join(url, token, this.useLegacy);
            if (joinResponse.iceServers && !this.rtcConfig.iceServers) {
                this.rtcConfig.iceServers = [];
                for (let iceServer of joinResponse.iceServers) {
                    const rtcIceServer = {
                        urls: iceServer.urls,
                    };
                    if (iceServer.username)
                        rtcIceServer.username = iceServer.username;
                    if (iceServer.credential)
                        rtcIceServer.credential = iceServer.credential;
                    this.rtcConfig.iceServers.push(rtcIceServer);
                }
            }
            // update ICE servers before creating PeerConnection
            if (!this.publisher) {
                const conf = this.rtcConfig;
                if (this.useLegacy) {
                    conf.sdpSemantics = 'plan-b';
                }
                this.publisher = new PCTransport_1.PCTransport(this.rtcConfig);
                this.subscriber = new PCTransport_1.PCTransport(this.rtcConfig);
                this.configure();
            }
            // create offer
            const offer = yield this.publisher.pc.createOffer();
            yield this.publisher.pc.setLocalDescription(offer);
            this.client.sendOffer(offer);
            return joinResponse;
        });
    }
    close() {
        if (this.publisher) {
            this.publisher.close();
            this.publisher = undefined;
        }
        if (this.subscriber) {
            this.subscriber.close();
            this.subscriber = undefined;
        }
        this.client.close();
    }
    addTrack(cid, name, kind) {
        if (this.pendingTrackResolvers[cid]) {
            throw new errors_1.TrackInvalidError('a track with the same ID has already been published');
        }
        return new Promise((resolve, reject) => {
            this.pendingTrackResolvers[cid] = resolve;
            this.client.sendAddTrack(cid, name, Track_1.Track.kindToProto(kind));
        });
    }
    updateMuteStatus(trackSid, muted) {
        this.client.sendMuteTrack(trackSid, muted);
    }
    configure() {
        if (!this.publisher || !this.subscriber) {
            return;
        }
        this.publisher.pc.onicecandidate = (ev) => {
            if (!ev.candidate)
                return;
            loglevel_1.default.trace('adding ICE candidate for peer', ev.candidate);
            this.client.sendIceCandidate(ev.candidate, livekit_rtc_1.SignalTarget.PUBLISHER);
        };
        this.subscriber.pc.onicecandidate = (ev) => {
            if (!ev.candidate)
                return;
            this.client.sendIceCandidate(ev.candidate, livekit_rtc_1.SignalTarget.SUBSCRIBER);
        };
        this.publisher.pc.onnegotiationneeded = (ev) => {
            if (!this.rtcConnected) {
                return;
            }
            this.negotiate();
        };
        this.publisher.pc.oniceconnectionstatechange = (ev) => {
            if (!this.publisher) {
                return;
            }
            if (this.publisher.pc.iceConnectionState === 'connected') {
                loglevel_1.default.trace('ICE connected');
                if (this.disconnectTimeout) {
                    clearTimeout(this.disconnectTimeout);
                    this.disconnectTimeout = undefined;
                }
                if (!this.iceConnected) {
                    this.iceConnected = true;
                    this.emit(events_2.EngineEvent.Connected);
                }
            }
            else if (this.publisher.pc.iceConnectionState === 'disconnected') {
                loglevel_1.default.trace('ICE disconnected');
                if (this.disconnectTimeout) {
                    return;
                }
                // Safari sends ICE disconnect during negotiation, it'll reconnect
                // once server responds
                // We'll trigger disconnect after a long delay if we are in the waiting-for-server-answer
                // state
                const delay = this.publisher.pc.signalingState == 'have-local-offer' ? 3000 : 100;
                this.disconnectTimeout = setTimeout(() => {
                    this.disconnectTimeout = undefined;
                    this.iceConnected = false;
                    this.emit(events_2.EngineEvent.Disconnected);
                    this.close();
                }, delay);
            }
        };
        if (this.useLegacy) {
            this.subscriber.pc.addEventListener('addstream', (ev) => {
                const stream = ev.stream;
                for (let t of stream.getTracks()) {
                    this.emitTrackEvent(t, stream);
                }
            });
        }
        else {
            this.subscriber.pc.ontrack = (ev) => {
                this.emitTrackEvent(ev.track, ev.streams[0], ev.receiver);
            };
        }
        // data channels
        this.lossyDC = this.publisher.pc.createDataChannel(lossyDataChannel, {
            // will drop older packets that arrive
            ordered: true,
            maxRetransmits: 1,
        });
        this.reliableDC = this.publisher.pc.createDataChannel(reliableDataChannel, {
            ordered: true,
        });
        this.lossyDC.onmessage = this.handleDataMessage;
        this.reliableDC.onmessage = this.handleDataMessage;
        // configure signaling client
        this.client.onAnswer = (sd) => __awaiter(this, void 0, void 0, function* () {
            if (!this.publisher) {
                return;
            }
            loglevel_1.default.debug('received server answer', sd.type, this.publisher.pc.signalingState);
            yield this.publisher.setRemoteDescription(sd);
            // consider connected
            if (!this.rtcConnected)
                this.onRTCConnected();
        });
        // add candidate on trickle
        this.client.onTrickle = (candidate, target) => {
            if (!this.publisher || !this.subscriber) {
                return;
            }
            loglevel_1.default.trace('got ICE candidate from peer', candidate, target);
            if (target === livekit_rtc_1.SignalTarget.PUBLISHER) {
                this.publisher.addIceCandidate(candidate);
            }
            else {
                this.subscriber.addIceCandidate(candidate);
            }
        };
        // when server creates an offer for the client
        this.client.onOffer = (sd) => __awaiter(this, void 0, void 0, function* () {
            if (!this.subscriber) {
                return;
            }
            loglevel_1.default.debug('received server offer', sd.type, this.subscriber.pc.signalingState);
            yield this.subscriber.setRemoteDescription(sd);
            // answer the offer
            const answer = yield this.subscriber.pc.createAnswer();
            yield this.subscriber.pc.setLocalDescription(answer);
            this.client.sendAnswer(answer);
        });
        this.client.onParticipantUpdate = (updates) => {
            this.emit(events_2.EngineEvent.ParticipantUpdate, updates);
        };
        this.client.onLocalTrackPublished = (res) => {
            const resolve = this.pendingTrackResolvers[res.cid];
            if (!resolve) {
                loglevel_1.default.error('missing track resolver for ', res.cid);
                return;
            }
            delete this.pendingTrackResolvers[res.cid];
            resolve(res.track);
        };
        this.client.onActiveSpeakersChanged = (speakers) => {
            this.emit(events_2.EngineEvent.SpeakersUpdate, speakers);
        };
        this.client.onClose = this.handleWSClose;
        this.client.onLeave = () => {
            this.close();
            this.emit(events_2.EngineEvent.Disconnected);
        };
    }
    negotiate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.publisher) {
                return;
            }
            // TODO: what if signaling state changed? will need to queue and retry
            loglevel_1.default.debug('starting to negotiate', this.publisher.pc.signalingState);
            const offer = yield this.publisher.pc.createOffer();
            yield this.publisher.pc.setLocalDescription(offer);
            this.client.sendOffer(offer);
        });
    }
    // signaling channel connected
    onRTCConnected() {
        loglevel_1.default.debug('RTC connected');
        this.rtcConnected = true;
    }
}
exports.RTCEngine = RTCEngine;


/***/ }),

/***/ "../src/room/Room.ts":
/*!***************************!*\
  !*** ../src/room/Room.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomState = void 0;
const events_1 = __webpack_require__(/*! events */ "../node_modules/events/events.js");
const loglevel_1 = __importDefault(__webpack_require__(/*! loglevel */ "../node_modules/loglevel/lib/loglevel.js"));
const livekit_models_1 = __webpack_require__(/*! ../proto/livekit_models */ "../src/proto/livekit_models.ts");
const errors_1 = __webpack_require__(/*! ./errors */ "../src/room/errors.ts");
const events_2 = __webpack_require__(/*! ./events */ "../src/room/events.ts");
const LocalParticipant_1 = __webpack_require__(/*! ./participant/LocalParticipant */ "../src/room/participant/LocalParticipant.ts");
const RemoteParticipant_1 = __webpack_require__(/*! ./participant/RemoteParticipant */ "../src/room/participant/RemoteParticipant.ts");
const RTCEngine_1 = __webpack_require__(/*! ./RTCEngine */ "../src/room/RTCEngine.ts");
const utils_1 = __webpack_require__(/*! ./utils */ "../src/room/utils.ts");
var RoomState;
(function (RoomState) {
    RoomState["Disconnected"] = "disconnected";
    RoomState["Connected"] = "connected";
    RoomState["Reconnecting"] = "reconnecting";
})(RoomState = exports.RoomState || (exports.RoomState = {}));
/**
 * In LiveKit, a room is the logical grouping for a list of participants.
 * Participants in a room can publish tracks, and subscribe to others' tracks.
 *
 * a Room fires [[RoomEvent | RoomEvents]].
 *
 * @noInheritDoc
 */
class Room extends events_1.EventEmitter {
    /** @internal */
    constructor(client, config) {
        super();
        this.state = RoomState.Disconnected;
        /**
         * list of participants that are actively speaking. when this changes
         * a [[RoomEvent.ActiveSpeakersChanged]] event is fired
         */
        this.activeSpeakers = [];
        /** @internal */
        this.connect = (url, token) => __awaiter(this, void 0, void 0, function* () {
            // guard against calling connect
            if (this.localParticipant) {
                loglevel_1.default.warn('already connected to room', this.name);
                return this;
            }
            try {
                const joinResponse = yield this.engine.join(url, token);
                loglevel_1.default.debug('connected to Livekit Server', joinResponse.serverVersion);
                if (!joinResponse.serverVersion) {
                    throw new errors_1.UnsupportedServer('unknown server version');
                }
                this.state = RoomState.Connected;
                const pi = joinResponse.participant;
                this.localParticipant = new LocalParticipant_1.LocalParticipant(pi.sid, pi.identity, this.engine);
                this.localParticipant.updateInfo(pi);
                // forward metadata changed for the local participant
                this.localParticipant.on(events_2.ParticipantEvent.MetadataChanged, (metadata, p) => {
                    this.emit(events_2.RoomEvent.MetadataChanged, metadata, p);
                });
                // populate remote participants, these should not trigger new events
                joinResponse.otherParticipants.forEach((pi) => {
                    this.getOrCreateParticipant(pi.sid, pi);
                });
                this.name = joinResponse.room.name;
                this.sid = joinResponse.room.sid;
            }
            catch (err) {
                this.engine.close();
                throw err;
            }
            // don't return until ICE connected
            return new Promise((resolve, reject) => {
                const connectTimeout = setTimeout(() => {
                    // timeout
                    this.engine.close();
                    reject('could not connect after timeout');
                }, 5 * 1000);
                this.engine.once(events_2.EngineEvent.Connected, () => {
                    clearTimeout(connectTimeout);
                    resolve(this);
                });
            });
        });
        this.handleSpeakerUpdate = (speakers) => {
            const activeSpeakers = [];
            const seenSids = {};
            speakers.forEach((speaker) => {
                seenSids[speaker.sid] = true;
                if (speaker.sid === this.localParticipant.sid) {
                    this.localParticipant.audioLevel = speaker.level;
                    activeSpeakers.push(this.localParticipant);
                }
                else {
                    const p = this.participants.get(speaker.sid);
                    if (p) {
                        p.audioLevel = speaker.level;
                        activeSpeakers.push(p);
                    }
                }
            });
            if (!seenSids[this.localParticipant.sid]) {
                this.localParticipant.audioLevel = 0;
            }
            this.participants.forEach((p) => {
                if (!seenSids[p.sid]) {
                    p.audioLevel = 0;
                }
            });
            this.activeSpeakers = activeSpeakers;
            this.emit(events_2.RoomEvent.ActiveSpeakersChanged, activeSpeakers);
        };
        this.handleDataPacket = (userPacket, kind) => {
            // find the participant
            const participant = this.participants.get(userPacket.participantSid);
            if (!participant) {
                return;
            }
            this.emit(events_2.RoomEvent.DataReceived, userPacket.payload, participant, kind);
            // also emit on the participant
            participant.emit(events_2.ParticipantEvent.DataReceived, userPacket.payload, kind);
        };
        this.participants = new Map();
        this.engine = new RTCEngine_1.RTCEngine(client, config);
        this.engine.on(events_2.EngineEvent.MediaTrackAdded, (mediaTrack, stream, receiver) => {
            this.onTrackAdded(mediaTrack, stream, receiver);
        });
        this.engine.on(events_2.EngineEvent.Disconnected, (reason) => {
            this.handleDisconnect();
        });
        this.engine.on(events_2.EngineEvent.ParticipantUpdate, (participants) => {
            this.handleParticipantUpdates(participants);
        });
        this.engine.on(events_2.EngineEvent.SpeakersUpdate, this.handleSpeakerUpdate);
        this.engine.on(events_2.EngineEvent.DataPacketReceived, this.handleDataPacket);
    }
    /**
     * disconnects the room, emits [[RoomEvent.Disconnected]]
     */
    disconnect() {
        // send leave
        this.engine.client.sendLeave();
        this.engine.close();
        this.handleDisconnect();
    }
    onTrackAdded(mediaTrack, stream, receiver) {
        const parts = utils_1.unpackStreamId(stream.id);
        const participantId = parts[0];
        let trackId = parts[1];
        if (!trackId || trackId === '')
            trackId = mediaTrack.id;
        const participant = this.getOrCreateParticipant(participantId);
        participant.addSubscribedMediaTrack(mediaTrack, trackId, receiver);
    }
    handleDisconnect() {
        this.participants.clear();
        this.activeSpeakers = [];
        this.emit(events_2.RoomEvent.Disconnected);
        this.state = RoomState.Disconnected;
    }
    handleParticipantUpdates(participantInfos) {
        // handle changes to participant state, and send events
        participantInfos.forEach((info) => {
            if (info.sid === this.localParticipant.sid) {
                this.localParticipant.updateInfo(info);
                return;
            }
            let remoteParticipant = this.participants.get(info.sid);
            const isNewParticipant = !remoteParticipant;
            // create participant if doesn't exist
            remoteParticipant = this.getOrCreateParticipant(info.sid, info);
            // when it's disconnected, send updates
            if (info.state === livekit_models_1.ParticipantInfo_State.DISCONNECTED) {
                this.handleParticipantDisconnected(info.sid, remoteParticipant);
            }
            else if (isNewParticipant) {
                // fire connected event
                this.emit(events_2.RoomEvent.ParticipantConnected, remoteParticipant);
            }
            else {
                // just update, no events
                remoteParticipant.updateInfo(info);
            }
        });
    }
    handleParticipantDisconnected(sid, participant) {
        // remove and send event
        this.participants.delete(sid);
        if (!participant) {
            return;
        }
        participant.tracks.forEach((publication) => {
            participant.unpublishTrack(publication.trackSid);
        });
        this.emit(events_2.RoomEvent.ParticipantDisconnected, participant);
    }
    getOrCreateParticipant(id, info) {
        let participant = this.participants.get(id);
        if (!participant) {
            // it's possible for the RTC track to arrive before signaling data
            // when this happens, we'll create the participant and make the track work
            if (info) {
                participant = RemoteParticipant_1.RemoteParticipant.fromParticipantInfo(this.engine.client, info);
            }
            else {
                participant = new RemoteParticipant_1.RemoteParticipant(this.engine.client, id, '');
            }
            this.participants.set(id, participant);
            // also forward events
            // trackPublished is only fired for tracks added after both local participant
            // and remote participant joined the room
            participant.on(events_2.ParticipantEvent.TrackPublished, (trackPublication) => {
                this.emit(events_2.RoomEvent.TrackPublished, trackPublication, participant);
            });
            participant.on(events_2.ParticipantEvent.TrackSubscribed, (track, publication) => {
                this.emit(events_2.RoomEvent.TrackSubscribed, track, publication, participant);
            });
            participant.on(events_2.ParticipantEvent.TrackUnpublished, (publication) => {
                this.emit(events_2.RoomEvent.TrackUnpublished, publication, participant);
            });
            participant.on(events_2.ParticipantEvent.TrackUnsubscribed, (publication) => {
                this.emit(events_2.RoomEvent.TrackUnsubscribed, publication, participant);
            });
            participant.on(events_2.ParticipantEvent.TrackSubscriptionFailed, (sid) => {
                this.emit(events_2.RoomEvent.TrackSubscriptionFailed, sid, participant);
            });
            participant.on(events_2.ParticipantEvent.TrackMuted, (pub) => {
                this.emit(events_2.RoomEvent.TrackMuted, pub, participant);
            });
            participant.on(events_2.ParticipantEvent.TrackUnmuted, (pub) => {
                this.emit(events_2.RoomEvent.TrackUnmuted, pub, participant);
            });
            participant.on(events_2.ParticipantEvent.MetadataChanged, (metadata, p) => {
                this.emit(events_2.RoomEvent.MetadataChanged, metadata, p);
            });
        }
        return participant;
    }
    /** @internal */
    emit(event, ...args) {
        loglevel_1.default.debug('room event', event, ...args);
        return super.emit(event, ...args);
    }
}
exports.default = Room;


/***/ }),

/***/ "../src/room/errors.ts":
/*!*****************************!*\
  !*** ../src/room/errors.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PublishDataError = exports.UnexpectedConnectionState = exports.UnsupportedServer = exports.TrackInvalidError = exports.LivekitError = void 0;
class LivekitError {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
}
exports.LivekitError = LivekitError;
class TrackInvalidError extends LivekitError {
    constructor(message) {
        super(20, message || 'Track is invalid');
    }
}
exports.TrackInvalidError = TrackInvalidError;
class UnsupportedServer extends LivekitError {
    constructor(message) {
        super(10, message || 'Unsupported server');
    }
}
exports.UnsupportedServer = UnsupportedServer;
class UnexpectedConnectionState extends LivekitError {
    constructor(message) {
        super(12, message || 'Unexpected connection state');
    }
}
exports.UnexpectedConnectionState = UnexpectedConnectionState;
class PublishDataError extends LivekitError {
    constructor(message) {
        super(13, message || 'Unable to publish data');
    }
}
exports.PublishDataError = PublishDataError;


/***/ }),

/***/ "../src/room/events.ts":
/*!*****************************!*\
  !*** ../src/room/events.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TrackEvent = exports.EngineEvent = exports.ParticipantEvent = exports.RoomEvent = void 0;
/**
 * Events are the primary way LiveKit notifies your application of changes.
 *
 * The following are events emitted by [[Room]], listen to room events like
 *
 * ```typescript
 * room.on(RoomEvent.TrackPublished, (track, publication, participant) => {})
 * ```
 */
var RoomEvent;
(function (RoomEvent) {
    /**
     * When disconnected from room
     */
    RoomEvent["Disconnected"] = "disconnected";
    /**
     * When a [[RemoteParticipant]] joins *after* the local
     * participant. It will not emit events for participants that are already
     * in the room
     *
     * args: ([[RemoteParticipant]])
     */
    RoomEvent["ParticipantConnected"] = "participantConnected";
    /**
     * When a [[RemoteParticipant]] leaves *after* the local
     * participant has joined.
     *
     * args: ([[RemoteParticipant]])
     */
    RoomEvent["ParticipantDisconnected"] = "participantDisconnected";
    /**
     * When a new track is published to room *after* the local
     * participant has joined. It will not fire for tracks that are already published
     *
     * args: ([[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    RoomEvent["TrackPublished"] = "trackPublished";
    /**
     * The [[LocalParticipant]] has subscribed to a new track. This event will **always**
     * fire as long as new tracks are ready for use.
     *
     * args: ([[RemoteTrack]], [[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    RoomEvent["TrackSubscribed"] = "trackSubscribed";
    /**
     * Could not subscribe to a track
     *
     * args: (track sid, [[RemoteParticipant]])
     */
    RoomEvent["TrackSubscriptionFailed"] = "trackSubscriptionFailed";
    /**
     * A [[RemoteParticipant]] has unpublished a track
     *
     * args: ([[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    RoomEvent["TrackUnpublished"] = "trackUnpublished";
    /**
     * A subscribed track is no longer available. Clients should listen to this
     * event and ensure they detach tracks.
     *
     * args: ([[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    RoomEvent["TrackUnsubscribed"] = "trackUnsubscribed";
    /**
     * A track that was muted by [[RemoteParticipant]]
     *
     * args: ([[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    RoomEvent["TrackMuted"] = "trackMuted";
    /**
     * A track that was unmuted by [[RemoteParticipant]]
     *
     * args: ([[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    RoomEvent["TrackUnmuted"] = "trackUnmuted";
    /**
     * Active speakers changed. List of speakers are ordered by their audio level.
     * loudest speakers first. This will include the LocalParticipant too.
     *
     * args: (Array<[[Participant]]>)
     */
    RoomEvent["ActiveSpeakersChanged"] = "activeSpeakersChanged";
    /**
     * Participant metadata is a simple way for app-specific state to be pushed to
     * all users.
     * When RoomService.UpdateParticipantMetadata is called to change a participant's
     * state, *all*  participants in the room will fire this event.
     *
     * args: (prevMetadata: string, [[Participant]])
     */
    RoomEvent["MetadataChanged"] = "metadataChanged";
    /**
     * Data received from another participant.
     * Data packets provides the ability to use LiveKit to send/receive arbitrary payloads.
     * All participants in the room will receive the messages sent to the room.
     *
     * args (payload: Uint8Array, participant: [[Participant]], kind: [[DataPacket_Kind]])
     */
    RoomEvent["DataReceived"] = "dataReceived";
})(RoomEvent = exports.RoomEvent || (exports.RoomEvent = {}));
var ParticipantEvent;
(function (ParticipantEvent) {
    ParticipantEvent["TrackPublished"] = "trackPublished";
    ParticipantEvent["TrackSubscribed"] = "trackSubscribed";
    ParticipantEvent["TrackSubscriptionFailed"] = "trackSubscriptionFailed";
    ParticipantEvent["TrackUnpublished"] = "trackUnpublished";
    ParticipantEvent["TrackUnsubscribed"] = "trackUnsubscribed";
    ParticipantEvent["TrackMuted"] = "trackMuted";
    ParticipantEvent["TrackUnmuted"] = "trackUnmuted";
    ParticipantEvent["MetadataChanged"] = "metadataChanged";
    ParticipantEvent["DataReceived"] = "dataReceived";
})(ParticipantEvent = exports.ParticipantEvent || (exports.ParticipantEvent = {}));
/** @internal */
var EngineEvent;
(function (EngineEvent) {
    EngineEvent["Connected"] = "connected";
    EngineEvent["Disconnected"] = "disconnected";
    EngineEvent["ParticipantUpdate"] = "participantUpdate";
    EngineEvent["MediaTrackAdded"] = "mediaTrackAdded";
    EngineEvent["SpeakersUpdate"] = "speakersUpdate";
    EngineEvent["DataPacketReceived"] = "dataPacketReceived";
})(EngineEvent = exports.EngineEvent || (exports.EngineEvent = {}));
var TrackEvent;
(function (TrackEvent) {
    TrackEvent["Message"] = "message";
    TrackEvent["Muted"] = "muted";
    TrackEvent["Unmuted"] = "unmuted";
    /** @internal */
    TrackEvent["UpdateSettings"] = "updateSettings";
    /** @internal */
    TrackEvent["UpdateSubscription"] = "updateSubscription";
})(TrackEvent = exports.TrackEvent || (exports.TrackEvent = {}));


/***/ }),

/***/ "../src/room/participant/LocalParticipant.ts":
/*!***************************************************!*\
  !*** ../src/room/participant/LocalParticipant.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalParticipant = void 0;
const loglevel_1 = __importDefault(__webpack_require__(/*! loglevel */ "../node_modules/loglevel/lib/loglevel.js"));
const options_1 = __webpack_require__(/*! ../../options */ "../src/options.ts");
const livekit_rtc_1 = __webpack_require__(/*! ../../proto/livekit_rtc */ "../src/proto/livekit_rtc.ts");
const errors_1 = __webpack_require__(/*! ../errors */ "../src/room/errors.ts");
const events_1 = __webpack_require__(/*! ../events */ "../src/room/events.ts");
const LocalAudioTrack_1 = __webpack_require__(/*! ../track/LocalAudioTrack */ "../src/room/track/LocalAudioTrack.ts");
const LocalTrackPublication_1 = __webpack_require__(/*! ../track/LocalTrackPublication */ "../src/room/track/LocalTrackPublication.ts");
const LocalVideoTrack_1 = __webpack_require__(/*! ../track/LocalVideoTrack */ "../src/room/track/LocalVideoTrack.ts");
const Track_1 = __webpack_require__(/*! ../track/Track */ "../src/room/track/Track.ts");
const Participant_1 = __webpack_require__(/*! ./Participant */ "../src/room/participant/Participant.ts");
const simulcastMinWidth = 200;
class LocalParticipant extends Participant_1.Participant {
    /** @internal */
    constructor(sid, identity, engine) {
        super(sid, identity);
        /** @internal */
        this.onTrackUnmuted = (track) => {
            this.onTrackMuted(track, false);
        };
        // when the local track changes in mute status, we'll notify server as such
        /** @internal */
        this.onTrackMuted = (track, muted) => {
            if (muted === undefined) {
                muted = true;
            }
            if (!track.sid) {
                loglevel_1.default.error('could not update mute status for unpublished track', track);
                return;
            }
            this.engine.updateMuteStatus(track.sid, muted);
        };
        this.orderedPresets = [
            options_1.VideoPresets.qvga,
            options_1.VideoPresets.vga,
            options_1.VideoPresets.qhd,
            options_1.VideoPresets.hd,
            options_1.VideoPresets.fhd,
        ];
        this.audioTracks = new Map();
        this.videoTracks = new Map();
        this.tracks = new Map();
        this.engine = engine;
    }
    /**
     * Publish a new track to the room
     * @param track
     * @param options
     */
    publishTrack(track, options) {
        return __awaiter(this, void 0, void 0, function* () {
            // convert raw media track into audio or video track
            if (track instanceof MediaStreamTrack) {
                switch (track.kind) {
                    case 'audio':
                        track = new LocalAudioTrack_1.LocalAudioTrack(track, options === null || options === void 0 ? void 0 : options.name);
                        break;
                    case 'video':
                        track = new LocalVideoTrack_1.LocalVideoTrack(track, options === null || options === void 0 ? void 0 : options.name);
                        break;
                    default:
                        throw new errors_1.TrackInvalidError(`unsupported MediaStreamTrack kind ${track.kind}`);
                }
            }
            // is it already published? if so skip
            let existingPublication;
            this.tracks.forEach((publication) => {
                if (!publication.track) {
                    return;
                }
                if (publication.track === track) {
                    existingPublication = publication;
                }
            });
            if (existingPublication)
                return existingPublication;
            // handle track actions
            track.on(events_1.TrackEvent.Muted, this.onTrackMuted);
            track.on(events_1.TrackEvent.Unmuted, this.onTrackUnmuted);
            // get local track id for use during publishing
            let cid = track.mediaStreamTrack.id;
            // create track publication from track
            const ti = yield this.engine.addTrack(cid, track.name, track.kind);
            const publication = new LocalTrackPublication_1.LocalTrackPublication(track.kind, ti, track);
            let encodings = undefined;
            // for video
            if (track.kind === Track_1.Track.Kind.Video) {
                // TODO: support react native, which doesn't expose getSettings
                const settings = track.mediaStreamTrack.getSettings();
                encodings = this.computeVideoEncodings(settings.width, settings.height, options);
            }
            else if (track.kind === Track_1.Track.Kind.Audio) {
                encodings = [
                    {
                        maxBitrate: (options === null || options === void 0 ? void 0 : options.audioBitrate) || options_1.AudioPresets.speech.maxBitrate,
                    },
                ];
            }
            if (!this.engine.publisher) {
                throw new errors_1.UnexpectedConnectionState('publisher is closed');
            }
            loglevel_1.default.debug('publishing with encodings', encodings);
            const transceiver = this.engine.publisher.pc.addTransceiver(track.mediaStreamTrack, {
                direction: 'sendonly',
                sendEncodings: encodings,
            });
            // store RTPSender
            track.sender = transceiver.sender;
            if (track instanceof LocalVideoTrack_1.LocalVideoTrack) {
                track.startMonitor();
            }
            this.setPreferredCodec(transceiver, track.kind, options === null || options === void 0 ? void 0 : options.videoCodec);
            this.addTrackPublication(publication);
            // send event for publication
            this.emit(events_1.ParticipantEvent.TrackPublished, publication);
            return publication;
        });
    }
    unpublishTrack(track) {
        // look through all published tracks to find the right ones
        let publication = this.getPublicationForTrack(track);
        loglevel_1.default.debug('unpublishTrack', 'unpublishing track', track);
        // TODO: add logging
        if (!publication) {
            loglevel_1.default.warn('unpublishTrack', 'track was not unpublished because no publication was found', track);
            return null;
        }
        if (track instanceof LocalAudioTrack_1.LocalAudioTrack || track instanceof LocalVideoTrack_1.LocalVideoTrack) {
            track.removeListener(events_1.TrackEvent.Muted, this.onTrackMuted);
            track.removeListener(events_1.TrackEvent.Unmuted, this.onTrackUnmuted);
        }
        track.stop();
        let mediaStreamTrack;
        if (track instanceof MediaStreamTrack) {
            mediaStreamTrack = track;
        }
        else {
            mediaStreamTrack = track.mediaStreamTrack;
        }
        if (this.engine.publisher) {
            const senders = this.engine.publisher.pc.getSenders();
            for (const sender of senders) {
                if (sender.track === mediaStreamTrack) {
                    this.engine.publisher.pc.removeTrack(sender);
                }
            }
        }
        // remove from our maps
        this.tracks.delete(publication.trackSid);
        switch (publication.kind) {
            case Track_1.Track.Kind.Audio:
                this.audioTracks.delete(publication.trackSid);
                break;
            case Track_1.Track.Kind.Video:
                this.videoTracks.delete(publication.trackSid);
                break;
        }
        return publication;
    }
    unpublishTracks(tracks) {
        const publications = [];
        tracks.forEach((track) => {
            const pub = this.unpublishTrack(track);
            if (pub) {
                publications.push(pub);
            }
        });
        return publications;
    }
    get publisherMetrics() {
        return null;
    }
    /** @internal */
    updateInfo(info) {
        super.updateInfo(info);
        // match local track mute status to server
        for (const ti of info.tracks) {
            const pub = this.tracks.get(ti.sid);
            if (!pub) {
                continue;
            }
            if (ti.muted && !pub.isMuted) {
                pub.mute();
            }
            else if (!ti.muted && pub.isMuted) {
                pub.unmute();
            }
        }
    }
    /**
     * Publish a new data payload to the room. Data will be forwarded to each
     * participant in the room
     *
     * @param data Uint8Array of the payload. To send string data, use TextEncoder.encode
     * @param kind whether to send this as reliable or lossy.
     * For data that you need delivery guarantee (such as chat messages), use Reliable.
     * For data that should arrive as quickly as possible, but you are ok with dropped
     * packets, use Lossy.
     */
    publishData(data, kind) {
        if (data.length > 15000) {
            throw new errors_1.PublishDataError('data cannot be larger than 15k');
        }
        const packet = {
            kind: kind,
            user: {
                participantSid: this.sid,
                payload: data,
            },
        };
        const msg = livekit_rtc_1.DataPacket.encode(packet).finish();
        if (kind === livekit_rtc_1.DataPacket_Kind.LOSSY && this.engine.lossyDC) {
            this.engine.lossyDC.send(msg);
        }
        else if (kind === livekit_rtc_1.DataPacket_Kind.RELIABLE && this.engine.reliableDC) {
            this.engine.reliableDC.send(msg);
        }
    }
    getPublicationForTrack(track) {
        let publication;
        for (const pub of this.tracks.values()) {
            let localTrack = pub.track;
            if (!localTrack)
                continue;
            // this looks overly complicated due to this object tree
            if (track instanceof MediaStreamTrack) {
                if (localTrack instanceof LocalAudioTrack_1.LocalAudioTrack ||
                    localTrack instanceof LocalVideoTrack_1.LocalVideoTrack) {
                    if (localTrack.mediaStreamTrack === track) {
                        publication = publication = pub;
                        break;
                    }
                }
            }
            else if (track === localTrack) {
                publication = pub;
                break;
            }
        }
        return publication;
    }
    setPreferredCodec(transceiver, kind, videoCodec = 'vp8') {
        if (!('getCapabilities' in RTCRtpSender)) {
            return;
        }
        const cap = RTCRtpSender.getCapabilities(kind);
        if (!cap)
            return;
        const selected = cap.codecs.find((c) => c.mimeType.toLowerCase() === `video/${videoCodec}` ||
            c.mimeType.toLowerCase() === 'audio/opus');
        if (selected && 'setCodecPreferences' in transceiver) {
            transceiver.setCodecPreferences([selected]);
        }
    }
    computeVideoEncodings(width, height, options) {
        let encodings;
        let videoEncoding = options === null || options === void 0 ? void 0 : options.videoEncoding;
        if (!videoEncoding) {
            // find the right encoding based on width/height
            videoEncoding = this.determineAppropriateEncoding(width, height);
            loglevel_1.default.debug('using video encoding', videoEncoding);
        }
        if ((options === null || options === void 0 ? void 0 : options.simulcast) && width && height) {
            encodings = [
                {
                    rid: 'f',
                    maxBitrate: videoEncoding.maxBitrate,
                    maxFramerate: videoEncoding.maxFramerate,
                },
            ];
            let scaledWidth = width / 2;
            if (scaledWidth >= simulcastMinWidth) {
                encodings.push({
                    rid: 'h',
                    scaleResolutionDownBy: 2.0,
                    maxBitrate: videoEncoding.maxBitrate / 3.5,
                    maxFramerate: videoEncoding.maxFramerate,
                });
            }
            scaledWidth = width / 4;
            if (scaledWidth >= simulcastMinWidth) {
                encodings.push({
                    rid: 'q',
                    scaleResolutionDownBy: 4.0,
                    maxBitrate: videoEncoding.maxBitrate / 7,
                    maxFramerate: videoEncoding.maxFramerate,
                });
            }
        }
        else {
            encodings = [videoEncoding];
        }
        return encodings;
    }
    determineAppropriateEncoding(width, height) {
        let encoding = options_1.VideoPresets.vga.encoding;
        if (width && height) {
            for (let i = 0; i < this.orderedPresets.length; i++) {
                const preset = this.orderedPresets[i];
                if (width >= parseLongConstraint(preset.resolution.width) &&
                    height >= parseLongConstraint(preset.resolution.height)) {
                    encoding = preset.encoding;
                }
            }
        }
        return encoding;
    }
}
exports.LocalParticipant = LocalParticipant;
function parseLongConstraint(constrain) {
    if (typeof constrain === 'number') {
        return constrain;
    }
    else {
        return (constrain.exact || constrain.ideal || constrain.min || constrain.max || 0);
    }
}


/***/ }),

/***/ "../src/room/participant/Participant.ts":
/*!**********************************************!*\
  !*** ../src/room/participant/Participant.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Participant = void 0;
const events_1 = __webpack_require__(/*! events */ "../node_modules/events/events.js");
const events_2 = __webpack_require__(/*! ../events */ "../src/room/events.ts");
const Track_1 = __webpack_require__(/*! ../track/Track */ "../src/room/track/Track.ts");
class Participant extends events_1.EventEmitter {
    /** @internal */
    constructor(sid, identity) {
        super();
        /** audio level between 0-1.0, 1 being loudest, 0 being softest */
        this.audioLevel = 0;
        this.sid = sid;
        this.identity = identity;
        this.audioTracks = new Map();
        this.videoTracks = new Map();
        this.tracks = new Map();
    }
    getTracks() {
        return Array.from(this.tracks.values());
    }
    /** when participant joined the room */
    get joinedAt() {
        if (this.participantInfo) {
            return new Date(this.participantInfo.joinedAt * 1000);
        }
    }
    /** @internal */
    updateInfo(info) {
        this.identity = info.identity;
        this.sid = info.sid;
        this.setMetadata(info.metadata);
        // set this last so setMetadata can detect changes
        this.participantInfo = info;
    }
    /** @internal */
    setMetadata(md) {
        const changed = !this.participantInfo || this.participantInfo.metadata != md;
        const prevMetadata = this.metadata;
        this.metadata = md;
        if (changed) {
            this.emit(events_2.ParticipantEvent.MetadataChanged, prevMetadata);
        }
    }
    addTrackPublication(publication) {
        // forward publication driven events
        publication.on(events_2.TrackEvent.Muted, () => {
            this.emit(events_2.ParticipantEvent.TrackMuted, publication);
        });
        publication.on(events_2.TrackEvent.Unmuted, () => {
            this.emit(events_2.ParticipantEvent.TrackUnmuted, publication);
        });
        if (publication.track) {
            publication.track.sid = publication.trackSid;
        }
        this.tracks.set(publication.trackSid, publication);
        switch (publication.kind) {
            case Track_1.Track.Kind.Audio:
                this.audioTracks.set(publication.trackSid, publication);
                break;
            case Track_1.Track.Kind.Video:
                this.videoTracks.set(publication.trackSid, publication);
                break;
        }
    }
}
exports.Participant = Participant;


/***/ }),

/***/ "../src/room/participant/RemoteParticipant.ts":
/*!****************************************************!*\
  !*** ../src/room/participant/RemoteParticipant.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RemoteParticipant = void 0;
const loglevel_1 = __importDefault(__webpack_require__(/*! loglevel */ "../node_modules/loglevel/lib/loglevel.js"));
const events_1 = __webpack_require__(/*! ../events */ "../src/room/events.ts");
const RemoteAudioTrack_1 = __webpack_require__(/*! ../track/RemoteAudioTrack */ "../src/room/track/RemoteAudioTrack.ts");
const RemoteTrackPublication_1 = __webpack_require__(/*! ../track/RemoteTrackPublication */ "../src/room/track/RemoteTrackPublication.ts");
const RemoteVideoTrack_1 = __webpack_require__(/*! ../track/RemoteVideoTrack */ "../src/room/track/RemoteVideoTrack.ts");
const Track_1 = __webpack_require__(/*! ../track/Track */ "../src/room/track/Track.ts");
const Participant_1 = __webpack_require__(/*! ./Participant */ "../src/room/participant/Participant.ts");
class RemoteParticipant extends Participant_1.Participant {
    /** @internal */
    constructor(signalClient, id, name) {
        super(id, name || '');
        this.signalClient = signalClient;
        this.tracks = new Map();
        this.audioTracks = new Map();
        this.videoTracks = new Map();
    }
    /** @internal */
    static fromParticipantInfo(signalClient, pi) {
        const rp = new RemoteParticipant(signalClient, pi.sid, pi.identity);
        rp.updateInfo(pi);
        return rp;
    }
    addTrackPublication(publication) {
        super.addTrackPublication(publication);
        // register action events
        publication.on(events_1.TrackEvent.UpdateSettings, (settings) => {
            this.signalClient.sendUpdateTrackSettings(settings);
        });
        publication.on(events_1.TrackEvent.UpdateSubscription, (sub) => {
            this.signalClient.sendUpdateSubscription(sub);
        });
    }
    /** @internal */
    addSubscribedMediaTrack(mediaTrack, sid, receiver, triesLeft) {
        // find the track publication
        // it's possible for the media track to arrive before participant info
        let publication = this.getTrackPublication(sid);
        // it's also possible that the browser didn't honor our original track id
        // FireFox would use its own local uuid instead of server track id
        if (!publication) {
            if (!sid.startsWith('TR')) {
                // find the first track that matches type
                this.tracks.forEach((p) => {
                    if (!publication && mediaTrack.kind === p.kind.toString()) {
                        publication = p;
                    }
                });
            }
        }
        // when we couldn't locate the track, it's possible that the metadata hasn't
        // yet arrived. Wait a bit longer for it to arrive, or fire an error
        if (!publication) {
            if (triesLeft === 0) {
                loglevel_1.default.error('could not find published track', this.sid, sid);
                this.emit(events_1.ParticipantEvent.TrackSubscriptionFailed, sid);
                return;
            }
            if (triesLeft === undefined)
                triesLeft = 20;
            setTimeout(() => {
                this.addSubscribedMediaTrack(mediaTrack, sid, receiver, triesLeft - 1);
            }, 150);
            return;
        }
        const isVideo = mediaTrack.kind === 'video';
        let track;
        if (isVideo) {
            track = new RemoteVideoTrack_1.RemoteVideoTrack(mediaTrack, sid, receiver);
            track.startMonitor();
        }
        else {
            track = new RemoteAudioTrack_1.RemoteAudioTrack(mediaTrack, sid, receiver);
        }
        publication.setTrack(track);
        // set track name etc
        track.name = publication.trackName;
        track.sid = publication.trackSid;
        // keep publication's muted status
        track.isMuted = publication.isMuted;
        // when media track is ended, fire the event
        mediaTrack.onended = (ev) => {
            this.emit(events_1.ParticipantEvent.TrackUnsubscribed, track, publication);
        };
        this.emit(events_1.ParticipantEvent.TrackSubscribed, track, publication);
        return publication;
    }
    /** @internal */
    get hasMetadata() {
        return !!this.participantInfo;
    }
    getTrackPublication(sid) {
        return this.tracks.get(sid);
    }
    /** @internal */
    updateInfo(info) {
        const alreadyHasMetadata = this.hasMetadata;
        super.updateInfo(info);
        // we are getting a list of all available tracks, reconcile in here
        // and send out events for changes
        // reconcile track publications, publish events only if metadata is already there
        // i.e. changes since the local participant has joined
        const validTracks = new Map();
        const newTracks = new Map();
        info.tracks.forEach((ti) => {
            let publication = this.getTrackPublication(ti.sid);
            if (!publication) {
                // new publication
                let kind = Track_1.Track.kindFromProto(ti.type);
                if (!kind) {
                    return;
                }
                publication = new RemoteTrackPublication_1.RemoteTrackPublication(kind, ti.sid, ti.name);
                publication.updateInfo(ti);
                newTracks.set(ti.sid, publication);
                this.addTrackPublication(publication);
            }
            else {
                publication.updateInfo(ti);
            }
            validTracks.set(ti.sid, publication);
        });
        // send new tracks
        if (alreadyHasMetadata) {
            newTracks.forEach((publication) => {
                this.emit(events_1.ParticipantEvent.TrackPublished, publication);
            });
        }
        // detect removed tracks
        this.tracks.forEach((publication) => {
            if (!validTracks.has(publication.trackSid)) {
                this.unpublishTrack(publication.trackSid, true);
            }
        });
    }
    /** @internal */
    unpublishTrack(sid, sendUnpublish) {
        const publication = this.tracks.get(sid);
        if (!publication) {
            return;
        }
        this.tracks.delete(sid);
        // remove from the right type map
        switch (publication.kind) {
            case Track_1.Track.Kind.Audio:
                this.audioTracks.delete(sid);
                break;
            case Track_1.Track.Kind.Video:
                this.videoTracks.delete(sid);
                break;
        }
        // also send unsubscribe, if track is actively subscribed
        if (publication.track) {
            publication.track.stop();
            publication.setTrack(undefined);
            // always send unsubscribed, since apps may rely on this
            this.emit(events_1.ParticipantEvent.TrackUnsubscribed, publication);
        }
        if (sendUnpublish)
            this.emit(events_1.ParticipantEvent.TrackUnpublished, publication);
    }
    /** @internal */
    emit(event, ...args) {
        loglevel_1.default.trace('participant event', this.sid, event, ...args);
        return super.emit(event, ...args);
    }
}
exports.RemoteParticipant = RemoteParticipant;


/***/ }),

/***/ "../src/room/stats.ts":
/*!****************************!*\
  !*** ../src/room/stats.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.monitorFrequency = void 0;
exports.monitorFrequency = 5000;


/***/ }),

/***/ "../src/room/track/AudioTrack.ts":
/*!***************************************!*\
  !*** ../src/room/track/AudioTrack.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AudioTrack = void 0;
const Track_1 = __webpack_require__(/*! ./Track */ "../src/room/track/Track.ts");
const utils_1 = __webpack_require__(/*! ./utils */ "../src/room/track/utils.ts");
class AudioTrack extends Track_1.Track {
    constructor(mediaTrack, name) {
        super(Track_1.Track.Kind.Audio, name);
        this.isStarted = false;
        this.isMuted = false;
        this.attachedElements = [];
        this.mediaStreamTrack = mediaTrack;
    }
    attach(element) {
        return utils_1.attachTrack(this.mediaStreamTrack, this.attachedElements, 'audio', element);
    }
    detach(element) {
        return utils_1.detachTracks(this.mediaStreamTrack, this.attachedElements, element);
    }
    stop() {
        this.mediaStreamTrack.stop();
    }
}
exports.AudioTrack = AudioTrack;


/***/ }),

/***/ "../src/room/track/LocalAudioTrack.ts":
/*!********************************************!*\
  !*** ../src/room/track/LocalAudioTrack.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalAudioTrack = void 0;
const AudioTrack_1 = __webpack_require__(/*! ./AudioTrack */ "../src/room/track/AudioTrack.ts");
const utils_1 = __webpack_require__(/*! ./utils */ "../src/room/track/utils.ts");
class LocalAudioTrack extends AudioTrack_1.AudioTrack {
    constructor(mediaTrack, name, constraints) {
        super(mediaTrack, name);
        this.id = mediaTrack.id;
        this._constraints = constraints || {};
    }
    mute() {
        utils_1.setTrackMuted(this, true);
        return this;
    }
    unmute() {
        utils_1.setTrackMuted(this, false);
        return this;
    }
    restart(constraints) {
        utils_1.restartTrack(this, constraints);
    }
}
exports.LocalAudioTrack = LocalAudioTrack;


/***/ }),

/***/ "../src/room/track/LocalTrackPublication.ts":
/*!**************************************************!*\
  !*** ../src/room/track/LocalTrackPublication.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalTrackPublication = void 0;
const LocalAudioTrack_1 = __webpack_require__(/*! ./LocalAudioTrack */ "../src/room/track/LocalAudioTrack.ts");
const LocalVideoTrack_1 = __webpack_require__(/*! ./LocalVideoTrack */ "../src/room/track/LocalVideoTrack.ts");
const TrackPublication_1 = __webpack_require__(/*! ./TrackPublication */ "../src/room/track/TrackPublication.ts");
const utils_1 = __webpack_require__(/*! ./utils */ "../src/room/track/utils.ts");
class LocalTrackPublication extends TrackPublication_1.TrackPublication {
    constructor(kind, ti, track) {
        super(kind, ti.sid, ti.name);
        this.setTrack(track);
    }
    get isMuted() {
        if (!this.track) {
            return false;
        }
        return this.track.isMuted;
    }
    /**
     * Mute the track associated with this publication
     */
    mute() {
        if (this.track instanceof LocalVideoTrack_1.LocalVideoTrack ||
            this.track instanceof LocalAudioTrack_1.LocalAudioTrack) {
            utils_1.setTrackMuted(this.track, true);
        }
    }
    /**
     * Unmute track associated with this publication
     */
    unmute() {
        if (this.track instanceof LocalVideoTrack_1.LocalVideoTrack ||
            this.track instanceof LocalAudioTrack_1.LocalAudioTrack) {
            utils_1.setTrackMuted(this.track, false);
        }
    }
}
exports.LocalTrackPublication = LocalTrackPublication;


/***/ }),

/***/ "../src/room/track/LocalVideoTrack.ts":
/*!********************************************!*\
  !*** ../src/room/track/LocalVideoTrack.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalVideoTrack = void 0;
const loglevel_1 = __importDefault(__webpack_require__(/*! loglevel */ "../node_modules/loglevel/lib/loglevel.js"));
const stats_1 = __webpack_require__(/*! ../stats */ "../src/room/stats.ts");
const utils_1 = __webpack_require__(/*! ./utils */ "../src/room/track/utils.ts");
const VideoTrack_1 = __webpack_require__(/*! ./VideoTrack */ "../src/room/track/VideoTrack.ts");
const ridOrder = ['f', 'h', 'q'];
class LocalVideoTrack extends VideoTrack_1.VideoTrack {
    constructor(mediaTrack, name, constraints) {
        super(mediaTrack, name);
        this.monitorSender = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.sender) {
                return;
            }
            const stats = yield this.getSenderStats();
            if (this.prevStats) {
                if (this.prevStats.length !== stats.length) {
                    // can't compare if length different
                    loglevel_1.default.warn('number of tracks changed', stats);
                    return;
                }
                for (let i = 0; i < this.prevStats.length; i++) {
                    this.handleStats(this.prevStats[i], stats[i]);
                }
            }
            // compare and findout
            this.prevStats = stats;
            setTimeout(this.monitorSender, stats_1.monitorFrequency);
        });
        this.id = mediaTrack.id;
        this._constraints = constraints || {};
    }
    mute() {
        utils_1.setTrackMuted(this, true);
        return this;
    }
    unmute() {
        utils_1.setTrackMuted(this, false);
        return this;
    }
    restart(constraints) {
        utils_1.restartTrack(this, constraints);
    }
    startMonitor() {
        setTimeout(this.monitorSender, stats_1.monitorFrequency);
    }
    stop() {
        this.sender = undefined;
        super.stop();
    }
    getSenderStats() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sender) {
                return [];
            }
            const items = [];
            const stats = yield this.sender.getStats();
            let sender;
            for (const [key, v] of stats) {
                if (v.type === 'track' &&
                    v.trackIdentifier === this.mediaStreamTrack.id) {
                    sender = v;
                    break;
                }
            }
            if (!sender) {
                return items;
            }
            // match the outbound-rtp items
            for (const [key, v] of stats) {
                if (v.type === 'outbound-rtp' && v.trackId === sender.id) {
                    const vs = {
                        type: 'video',
                        streamId: v.id,
                        frameHeight: v.frameHeight,
                        frameWidth: v.frameWidth,
                        firCount: v.firCount,
                        pliCount: v.pliCount,
                        nackCount: v.nackCount,
                        packetsSent: v.packetsSent,
                        rid: v.rid,
                        retransmittedPacketsSent: v.retransmittedPacketsSent,
                        qualityLimitationReason: v.qualityLimitationReason,
                        qualityLimitationResolutionChanges: v.qualityLimitationResolutionChanges,
                    };
                    // locate the appropriate remote-inbound-rtp item
                    const r = stats.get(v.remoteId);
                    if (r) {
                        vs.jitter = r.jitter;
                        vs.packetsLost = r.packetsLost;
                        vs.roundTripTime = r.roundTripTime;
                    }
                    items.push(vs);
                }
            }
            // sort by rid, so that f, h, q is the ordering
            items.sort((a, b) => {
                const ai = ridOrder.indexOf(a.rid);
                const bi = ridOrder.indexOf(b.rid);
                if (ai === bi) {
                    return 0;
                }
                return ai < bi ? -1 : 1;
            });
            return items;
        });
    }
    handleStats(prev, curr) {
        const pliDelta = curr.pliCount - prev.pliCount;
        const nackDelta = curr.nackCount - prev.nackCount;
        const qualityLimited = curr.qualityLimitationReason && curr.qualityLimitationReason != 'none';
        if (pliDelta > 0 || qualityLimited) {
            loglevel_1.default.debug('detected publisher quality issue', 'track', this.id, 'rid', curr.rid, 'pliDelta', pliDelta, 'nackDelta', nackDelta, 'qualityLimited', curr.qualityLimitationReason, curr);
        }
    }
}
exports.LocalVideoTrack = LocalVideoTrack;


/***/ }),

/***/ "../src/room/track/RemoteAudioTrack.ts":
/*!*********************************************!*\
  !*** ../src/room/track/RemoteAudioTrack.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RemoteAudioTrack = void 0;
const events_1 = __webpack_require__(/*! ../events */ "../src/room/events.ts");
const AudioTrack_1 = __webpack_require__(/*! ./AudioTrack */ "../src/room/track/AudioTrack.ts");
class RemoteAudioTrack extends AudioTrack_1.AudioTrack {
    constructor(mediaTrack, sid, receiver) {
        super(mediaTrack);
        this.sid = sid;
        this.receiver = receiver;
    }
    /** @internal */
    setMuted(muted) {
        if (this.isMuted != muted) {
            this.isMuted = muted;
            this.emit(muted ? events_1.TrackEvent.Muted : events_1.TrackEvent.Unmuted, this);
        }
    }
}
exports.RemoteAudioTrack = RemoteAudioTrack;


/***/ }),

/***/ "../src/room/track/RemoteTrackPublication.ts":
/*!***************************************************!*\
  !*** ../src/room/track/RemoteTrackPublication.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RemoteTrackPublication = void 0;
const livekit_rtc_1 = __webpack_require__(/*! ../../proto/livekit_rtc */ "../src/proto/livekit_rtc.ts");
const events_1 = __webpack_require__(/*! ../events */ "../src/room/events.ts");
const RemoteAudioTrack_1 = __webpack_require__(/*! ./RemoteAudioTrack */ "../src/room/track/RemoteAudioTrack.ts");
const RemoteVideoTrack_1 = __webpack_require__(/*! ./RemoteVideoTrack */ "../src/room/track/RemoteVideoTrack.ts");
const TrackPublication_1 = __webpack_require__(/*! ./TrackPublication */ "../src/room/track/TrackPublication.ts");
class RemoteTrackPublication extends TrackPublication_1.TrackPublication {
    constructor(kind, id, name) {
        super(kind, id, name);
        this.isMuted = false;
        this.subscribe = false;
        this.disabled = false;
        this.videoQuality = livekit_rtc_1.VideoQuality.HIGH;
    }
    get isSubscribed() {
        return !!this.track;
    }
    /**
     * Subscribe or unsubscribe to this remote track
     * @param subscribed true to subscribe to a track, false to unsubscribe
     */
    setSubscribed(subscribed) {
        this.subscribe = !subscribed;
        const sub = {
            trackSids: [this.trackSid],
            subscribe: this.subscribe,
            quality: this.videoQuality,
        };
        this.emit(events_1.TrackEvent.UpdateSubscription, sub);
    }
    /**
     * disable server from sending down data for this track. this is useful when
     * the participant is off screen, you may disable streaming down their video
     * to reduce bandwidth requirements
     * @param enabled
     */
    setEnabled(enabled) {
        this.disabled = !enabled;
        this.emitTrackUpdate();
    }
    /**
     * for tracks that support simulcasting, adjust subscribed quality
     *
     * This indicates the highest quality the client can accept. if network
     * bandwidth does not allow, server will automatically reduce quality to
     * optimize for uninterrupted video
     */
    setVideoQuality(quality) {
        this.videoQuality = quality;
        this.emitTrackUpdate();
    }
    /** @internal */
    updateInfo(info) {
        super.updateInfo(info);
        this.isMuted = info.muted;
        if (this.track instanceof RemoteVideoTrack_1.RemoteVideoTrack ||
            this.track instanceof RemoteAudioTrack_1.RemoteAudioTrack) {
            this.track.setMuted(info.muted);
        }
    }
    emitTrackUpdate() {
        const settings = {
            trackSids: [this.trackSid],
            disabled: this.disabled,
            quality: this.videoQuality,
        };
        this.emit(events_1.TrackEvent.UpdateSettings, settings);
    }
}
exports.RemoteTrackPublication = RemoteTrackPublication;


/***/ }),

/***/ "../src/room/track/RemoteVideoTrack.ts":
/*!*********************************************!*\
  !*** ../src/room/track/RemoteVideoTrack.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RemoteVideoTrack = void 0;
const loglevel_1 = __importDefault(__webpack_require__(/*! loglevel */ "../node_modules/loglevel/lib/loglevel.js"));
const events_1 = __webpack_require__(/*! ../events */ "../src/room/events.ts");
const stats_1 = __webpack_require__(/*! ../stats */ "../src/room/stats.ts");
const VideoTrack_1 = __webpack_require__(/*! ./VideoTrack */ "../src/room/track/VideoTrack.ts");
class RemoteVideoTrack extends VideoTrack_1.VideoTrack {
    constructor(mediaTrack, sid, receiver) {
        super(mediaTrack);
        this.monitorReceiver = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.receiver) {
                return;
            }
            const stats = yield this.getReceiverStats();
            if (!stats) {
                return;
            }
            if (this.prevStats) {
                this.handleStats(this.prevStats, stats);
            }
            // compare and findout
            this.prevStats = stats;
            setTimeout(this.monitorReceiver, stats_1.monitorFrequency);
        });
        // override id to parsed ID
        this.sid = sid;
        this.receiver = receiver;
    }
    /** @internal */
    setMuted(muted) {
        if (this.isMuted != muted) {
            this.isMuted = muted;
            this.emit(muted ? events_1.TrackEvent.Muted : events_1.TrackEvent.Unmuted, this);
        }
    }
    startMonitor() {
        setTimeout(this.monitorReceiver, stats_1.monitorFrequency);
    }
    stop() {
        super.stop();
    }
    getReceiverStats() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.mediaStreamTrack || !this.receiver)
                return null;
            const stats = yield this.receiver.getStats();
            let rs;
            for (const [key, v] of stats) {
                if (v.type === 'track' &&
                    v.trackIdentifier === this.mediaStreamTrack.id) {
                    rs = v;
                    break;
                }
            }
            if (!rs) {
                return null;
            }
            // match the outbound-rtp items
            for (const [key, v] of stats) {
                if (v.type === 'inbound-rtp' && v.trackId === rs.id) {
                    return {
                        type: 'video',
                        jitterBufferDelay: rs.jitterBufferDelay,
                        packetsLost: v.packetsLost,
                        packetsReceived: v.packetsReceived,
                        streamId: v.id,
                        framesDecoded: v.framesDecoded,
                        framesDropped: v.framesDropped,
                        framesReceived: v.framesReceived,
                        frameWidth: v.frameWidth,
                        frameHeight: v.frameHeight,
                        firCount: v.firCount,
                        pliCount: v.pliCount,
                        nackCount: v.nackCount,
                    };
                }
            }
            return null;
        });
    }
    handleStats(prev, curr) {
        const pliDelta = curr.pliCount - prev.pliCount;
        const nackDelta = curr.nackCount - prev.nackCount;
        const droppedDelta = curr.framesDropped - prev.framesDropped;
        const lostDelta = curr.packetsLost - prev.packetsLost;
        if (pliDelta > 0 || droppedDelta > 0 || lostDelta > 0) {
            loglevel_1.default.debug('detected subscriber quality issue', 'track', this.sid, 'pliDelta', pliDelta, 'nackDelta', nackDelta, 'lostDelta', lostDelta, 'droppedDelta', droppedDelta, curr);
        }
    }
}
exports.RemoteVideoTrack = RemoteVideoTrack;


/***/ }),

/***/ "../src/room/track/Track.ts":
/*!**********************************!*\
  !*** ../src/room/track/Track.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Track = void 0;
const events_1 = __webpack_require__(/*! events */ "../node_modules/events/events.js");
const livekit_models_1 = __webpack_require__(/*! ../../proto/livekit_models */ "../src/proto/livekit_models.ts");
class Track extends events_1.EventEmitter {
    constructor(kind, name) {
        super();
        this.kind = kind;
        this.name = name || '';
    }
}
exports.Track = Track;
(function (Track) {
    let Kind;
    (function (Kind) {
        Kind["Audio"] = "audio";
        Kind["Video"] = "video";
    })(Kind = Track.Kind || (Track.Kind = {}));
    /** @internal */
    function kindToProto(k) {
        switch (k) {
            case Kind.Audio:
                return livekit_models_1.TrackType.AUDIO;
            case Kind.Video:
                return livekit_models_1.TrackType.VIDEO;
        }
    }
    Track.kindToProto = kindToProto;
    /** @internal */
    function kindFromProto(t) {
        switch (t) {
            case livekit_models_1.TrackType.AUDIO:
                return Kind.Audio;
            case livekit_models_1.TrackType.VIDEO:
                return Kind.Video;
        }
    }
    Track.kindFromProto = kindFromProto;
})(Track = exports.Track || (exports.Track = {}));


/***/ }),

/***/ "../src/room/track/TrackPublication.ts":
/*!*********************************************!*\
  !*** ../src/room/track/TrackPublication.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TrackPublication = void 0;
const events_1 = __webpack_require__(/*! events */ "../node_modules/events/events.js");
const events_2 = __webpack_require__(/*! ../events */ "../src/room/events.ts");
const AudioTrack_1 = __webpack_require__(/*! ./AudioTrack */ "../src/room/track/AudioTrack.ts");
const VideoTrack_1 = __webpack_require__(/*! ./VideoTrack */ "../src/room/track/VideoTrack.ts");
class TrackPublication extends events_1.EventEmitter {
    constructor(kind, id, name) {
        super();
        this.kind = kind;
        this.trackSid = id;
        this.trackName = name;
    }
    /** @internal */
    setTrack(track) {
        this.track = track;
        if (track) {
            // forward events
            track.on(events_2.TrackEvent.Muted, () => {
                this.emit(events_2.TrackEvent.Muted);
            });
            track.on(events_2.TrackEvent.Unmuted, () => {
                this.emit(events_2.TrackEvent.Unmuted);
            });
        }
    }
    /**
     * an [AudioTrack] if this publication holds an audio track
     */
    get audioTrack() {
        if (this.track instanceof AudioTrack_1.AudioTrack) {
            return this.track;
        }
    }
    /**
     * an [VideoTrack] if this publication holds a video track
     */
    get videoTrack() {
        if (this.track instanceof VideoTrack_1.VideoTrack) {
            return this.track;
        }
    }
    /**
     * returns an audio or video track
     */
    get mediaTrack() {
        if (this.track instanceof VideoTrack_1.VideoTrack || this.track instanceof AudioTrack_1.AudioTrack) {
            return this.track;
        }
    }
    /** @internal */
    updateInfo(info) {
        this.trackSid = info.sid;
        this.trackName = info.name;
    }
}
exports.TrackPublication = TrackPublication;


/***/ }),

/***/ "../src/room/track/VideoTrack.ts":
/*!***************************************!*\
  !*** ../src/room/track/VideoTrack.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VideoTrack = void 0;
const Track_1 = __webpack_require__(/*! ./Track */ "../src/room/track/Track.ts");
const utils_1 = __webpack_require__(/*! ./utils */ "../src/room/track/utils.ts");
class VideoTrack extends Track_1.Track {
    constructor(mediaTrack, name) {
        super(Track_1.Track.Kind.Video, name || mediaTrack.label);
        this.isStarted = false;
        this.isMuted = false;
        this.dimensions = {};
        this.attachedElements = [];
        this.mediaStreamTrack = mediaTrack;
        try {
            const { width, height } = mediaTrack.getSettings();
            if (width && height) {
                this.dimensions.width = width;
                this.dimensions.height = height;
            }
        }
        catch (e) {
            // ignore, react native doesn't support getSettings
        }
    }
    attach(element) {
        return (utils_1.attachTrack(this.mediaStreamTrack, this.attachedElements, 'video', element));
    }
    detach(element) {
        return utils_1.detachTracks(this.mediaStreamTrack, this.attachedElements, element);
    }
    stop() {
        this.mediaStreamTrack.stop();
    }
}
exports.VideoTrack = VideoTrack;


/***/ }),

/***/ "../src/room/track/options.ts":
/*!************************************!*\
  !*** ../src/room/track/options.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "../src/room/track/types.ts":
/*!**********************************!*\
  !*** ../src/room/track/types.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "../src/room/track/utils.ts":
/*!**********************************!*\
  !*** ../src/room/track/utils.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.restartTrack = exports.setTrackMuted = exports.detachTrack = exports.detachTracks = exports.attachTrack = void 0;
const loglevel_1 = __importDefault(__webpack_require__(/*! loglevel */ "../node_modules/loglevel/lib/loglevel.js"));
const errors_1 = __webpack_require__(/*! ../errors */ "../src/room/errors.ts");
const events_1 = __webpack_require__(/*! ../events */ "../src/room/events.ts");
const LocalVideoTrack_1 = __webpack_require__(/*! ./LocalVideoTrack */ "../src/room/track/LocalVideoTrack.ts");
// attachment/detachment helpers
function attachTrack(track, attachedElements, elementType, element) {
    if (!element) {
        element = document.createElement(elementType);
        element.autoplay = true;
        if (element instanceof HTMLVideoElement) {
            element.playsInline = true;
        }
    }
    else {
        if (element instanceof HTMLVideoElement) {
            element.playsInline = true;
        }
        element.autoplay = true;
    }
    // already attached
    if (attachedElements.includes(element)) {
        return element;
    }
    _attachTrack(track, element);
    attachedElements.push(element);
    return element;
}
exports.attachTrack = attachTrack;
function _attachTrack(track, element) {
    let mediaStream;
    if (element.srcObject instanceof MediaStream) {
        mediaStream = element.srcObject;
    }
    else {
        mediaStream = new MediaStream();
        element.srcObject = mediaStream;
    }
    // remove existing tracks of same type from stream
    let existingTracks;
    if (track.kind === 'audio') {
        existingTracks = mediaStream.getAudioTracks();
    }
    else {
        existingTracks = mediaStream.getVideoTracks();
    }
    existingTracks.forEach((et) => {
        mediaStream.removeTrack(et);
    });
    mediaStream.addTrack(track);
}
function detachTracks(track, attachedElements, element) {
    if (element) {
        detachTrack(track, element);
        const idx = attachedElements.indexOf(element);
        if (idx >= 0) {
            attachedElements.splice(idx, 1);
        }
        return element;
    }
    else {
        const detached = [];
        attachedElements.forEach((element) => {
            detachTrack(track, element);
            detached.push(element);
        });
        // remove all tracks
        attachedElements.splice(0, attachedElements.length);
        return detached;
    }
}
exports.detachTracks = detachTracks;
function detachTrack(track, element) {
    if (element.srcObject instanceof MediaStream) {
        const mediaStream = element.srcObject;
        mediaStream.removeTrack(track);
    }
}
exports.detachTrack = detachTrack;
/** @internal */
function setTrackMuted(track, muted) {
    if (track.isMuted === muted) {
        return;
    }
    track.isMuted = muted;
    track.mediaStreamTrack.enabled = !muted;
    track.emit(muted ? events_1.TrackEvent.Muted : events_1.TrackEvent.Unmuted, track);
}
exports.setTrackMuted = setTrackMuted;
function restartTrack(track, constraints) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!track.sender) {
            throw new errors_1.TrackInvalidError('unable to restart an unpublished track');
        }
        if (!constraints) {
            constraints = track._constraints;
        }
        // copy existing elements and detach
        track.mediaStreamTrack.stop();
        const streamConstraints = {
            audio: false,
            video: false,
        };
        if (track instanceof LocalVideoTrack_1.LocalVideoTrack) {
            streamConstraints.video = constraints;
        }
        else {
            streamConstraints.audio = constraints;
        }
        // TODO: for safari, there is a bug that might cause this to be wonky
        // _workaroundWebKitBug1208516
        const newTrack = yield (yield navigator.mediaDevices.getUserMedia(streamConstraints)).getTracks()[0];
        loglevel_1.default.info('re-acquired MediaStreamTrack');
        track._constraints = constraints;
        newTrack.enabled = track.mediaStreamTrack.enabled;
        yield track.sender.replaceTrack(newTrack);
        track.mediaStreamTrack = newTrack;
        track.attachedElements.forEach((el) => {
            _attachTrack(newTrack, el);
        });
    });
}
exports.restartTrack = restartTrack;


/***/ }),

/***/ "../src/room/utils.ts":
/*!****************************!*\
  !*** ../src/room/utils.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useLegacyAPI = exports.unpackStreamId = void 0;
const separator = '|';
function unpackStreamId(packed) {
    const parts = packed.split(separator);
    if (parts.length > 1) {
        return [parts[0], packed.substr(parts[0].length + 1)];
    }
    return [packed, ''];
}
exports.unpackStreamId = unpackStreamId;
function useLegacyAPI() {
    // react native is using old stream based API
    return typeof navigator != 'undefined' && navigator.product == 'ReactNative';
}
exports.useLegacyAPI = useLegacyAPI;


/***/ }),

/***/ "../src/version.ts":
/*!*************************!*\
  !*** ../src/version.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.protocolVersion = exports.version = void 0;
exports.version = '0.7.0';
exports.protocolVersion = 2;


/***/ }),

/***/ "../node_modules/webrtc-adapter/src/js/adapter_core.js":
/*!*************************************************************!*\
  !*** ../node_modules/webrtc-adapter/src/js/adapter_core.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _adapter_factory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./adapter_factory.js */ "../node_modules/webrtc-adapter/src/js/adapter_factory.js");
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */





const adapter =
  (0,_adapter_factory_js__WEBPACK_IMPORTED_MODULE_0__.adapterFactory)({window: typeof window === 'undefined' ? undefined : window});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (adapter);


/***/ }),

/***/ "../node_modules/webrtc-adapter/src/js/adapter_factory.js":
/*!****************************************************************!*\
  !*** ../node_modules/webrtc-adapter/src/js/adapter_factory.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "adapterFactory": () => (/* binding */ adapterFactory)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../node_modules/webrtc-adapter/src/js/utils.js");
/* harmony import */ var _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chrome/chrome_shim */ "../node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js");
/* harmony import */ var _edge_edge_shim__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edge/edge_shim */ "../node_modules/webrtc-adapter/src/js/edge/edge_shim.js");
/* harmony import */ var _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./firefox/firefox_shim */ "../node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js");
/* harmony import */ var _safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./safari/safari_shim */ "../node_modules/webrtc-adapter/src/js/safari/safari_shim.js");
/* harmony import */ var _common_shim__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common_shim */ "../node_modules/webrtc-adapter/src/js/common_shim.js");
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */


  // Browser shims.






// Shimming starts here.
function adapterFactory({window} = {}, options = {
  shimChrome: true,
  shimFirefox: true,
  shimEdge: true,
  shimSafari: true,
}) {
  // Utils.
  const logging = _utils__WEBPACK_IMPORTED_MODULE_0__.log;
  const browserDetails = _utils__WEBPACK_IMPORTED_MODULE_0__.detectBrowser(window);

  const adapter = {
    browserDetails,
    commonShim: _common_shim__WEBPACK_IMPORTED_MODULE_5__,
    extractVersion: _utils__WEBPACK_IMPORTED_MODULE_0__.extractVersion,
    disableLog: _utils__WEBPACK_IMPORTED_MODULE_0__.disableLog,
    disableWarnings: _utils__WEBPACK_IMPORTED_MODULE_0__.disableWarnings
  };

  // Shim browser if found.
  switch (browserDetails.browser) {
    case 'chrome':
      if (!_chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__ || !_chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__.shimPeerConnection ||
          !options.shimChrome) {
        logging('Chrome shim is not included in this adapter release.');
        return adapter;
      }
      if (browserDetails.version === null) {
        logging('Chrome shim can not determine version, not shimming.');
        return adapter;
      }
      logging('adapter.js shimming chrome.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__;

      // Must be called before shimPeerConnection.
      _common_shim__WEBPACK_IMPORTED_MODULE_5__.shimAddIceCandidateNullOrEmpty(window, browserDetails);

      _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__.shimGetUserMedia(window, browserDetails);
      _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__.shimMediaStream(window, browserDetails);
      _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__.shimPeerConnection(window, browserDetails);
      _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__.shimOnTrack(window, browserDetails);
      _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__.shimAddTrackRemoveTrack(window, browserDetails);
      _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__.shimGetSendersWithDtmf(window, browserDetails);
      _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__.shimGetStats(window, browserDetails);
      _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__.shimSenderReceiverGetStats(window, browserDetails);
      _chrome_chrome_shim__WEBPACK_IMPORTED_MODULE_1__.fixNegotiationNeeded(window, browserDetails);

      _common_shim__WEBPACK_IMPORTED_MODULE_5__.shimRTCIceCandidate(window, browserDetails);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__.shimConnectionState(window, browserDetails);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__.shimMaxMessageSize(window, browserDetails);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__.shimSendThrowTypeError(window, browserDetails);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__.removeExtmapAllowMixed(window, browserDetails);
      break;
    case 'firefox':
      if (!_firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__ || !_firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__.shimPeerConnection ||
          !options.shimFirefox) {
        logging('Firefox shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming firefox.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__;

      // Must be called before shimPeerConnection.
      _common_shim__WEBPACK_IMPORTED_MODULE_5__.shimAddIceCandidateNullOrEmpty(window, browserDetails);

      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__.shimGetUserMedia(window, browserDetails);
      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__.shimPeerConnection(window, browserDetails);
      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__.shimOnTrack(window, browserDetails);
      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__.shimRemoveStream(window, browserDetails);
      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__.shimSenderGetStats(window, browserDetails);
      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__.shimReceiverGetStats(window, browserDetails);
      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__.shimRTCDataChannel(window, browserDetails);
      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__.shimAddTransceiver(window, browserDetails);
      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__.shimGetParameters(window, browserDetails);
      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__.shimCreateOffer(window, browserDetails);
      _firefox_firefox_shim__WEBPACK_IMPORTED_MODULE_3__.shimCreateAnswer(window, browserDetails);

      _common_shim__WEBPACK_IMPORTED_MODULE_5__.shimRTCIceCandidate(window, browserDetails);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__.shimConnectionState(window, browserDetails);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__.shimMaxMessageSize(window, browserDetails);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__.shimSendThrowTypeError(window, browserDetails);
      break;
    case 'edge':
      if (!_edge_edge_shim__WEBPACK_IMPORTED_MODULE_2__ || !_edge_edge_shim__WEBPACK_IMPORTED_MODULE_2__.shimPeerConnection || !options.shimEdge) {
        logging('MS edge shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming edge.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = _edge_edge_shim__WEBPACK_IMPORTED_MODULE_2__;

      _edge_edge_shim__WEBPACK_IMPORTED_MODULE_2__.shimGetUserMedia(window, browserDetails);
      _edge_edge_shim__WEBPACK_IMPORTED_MODULE_2__.shimGetDisplayMedia(window, browserDetails);
      _edge_edge_shim__WEBPACK_IMPORTED_MODULE_2__.shimPeerConnection(window, browserDetails);
      _edge_edge_shim__WEBPACK_IMPORTED_MODULE_2__.shimReplaceTrack(window, browserDetails);

      // the edge shim implements the full RTCIceCandidate object.

      _common_shim__WEBPACK_IMPORTED_MODULE_5__.shimMaxMessageSize(window, browserDetails);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__.shimSendThrowTypeError(window, browserDetails);
      break;
    case 'safari':
      if (!_safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__ || !options.shimSafari) {
        logging('Safari shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming safari.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = _safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__;

      // Must be called before shimCallbackAPI.
      _common_shim__WEBPACK_IMPORTED_MODULE_5__.shimAddIceCandidateNullOrEmpty(window, browserDetails);

      _safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__.shimRTCIceServerUrls(window, browserDetails);
      _safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__.shimCreateOfferLegacy(window, browserDetails);
      _safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__.shimCallbacksAPI(window, browserDetails);
      _safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__.shimLocalStreamsAPI(window, browserDetails);
      _safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__.shimRemoteStreamsAPI(window, browserDetails);
      _safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__.shimTrackEventTransceiver(window, browserDetails);
      _safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__.shimGetUserMedia(window, browserDetails);
      _safari_safari_shim__WEBPACK_IMPORTED_MODULE_4__.shimAudioContext(window, browserDetails);

      _common_shim__WEBPACK_IMPORTED_MODULE_5__.shimRTCIceCandidate(window, browserDetails);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__.shimMaxMessageSize(window, browserDetails);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__.shimSendThrowTypeError(window, browserDetails);
      _common_shim__WEBPACK_IMPORTED_MODULE_5__.removeExtmapAllowMixed(window, browserDetails);
      break;
    default:
      logging('Unsupported browser!');
      break;
  }

  return adapter;
}


/***/ }),

/***/ "../node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js":
/*!*******************************************************************!*\
  !*** ../node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shimGetUserMedia": () => (/* reexport safe */ _getusermedia__WEBPACK_IMPORTED_MODULE_1__.shimGetUserMedia),
/* harmony export */   "shimGetDisplayMedia": () => (/* reexport safe */ _getdisplaymedia__WEBPACK_IMPORTED_MODULE_2__.shimGetDisplayMedia),
/* harmony export */   "shimMediaStream": () => (/* binding */ shimMediaStream),
/* harmony export */   "shimOnTrack": () => (/* binding */ shimOnTrack),
/* harmony export */   "shimGetSendersWithDtmf": () => (/* binding */ shimGetSendersWithDtmf),
/* harmony export */   "shimGetStats": () => (/* binding */ shimGetStats),
/* harmony export */   "shimSenderReceiverGetStats": () => (/* binding */ shimSenderReceiverGetStats),
/* harmony export */   "shimAddTrackRemoveTrackWithNative": () => (/* binding */ shimAddTrackRemoveTrackWithNative),
/* harmony export */   "shimAddTrackRemoveTrack": () => (/* binding */ shimAddTrackRemoveTrack),
/* harmony export */   "shimPeerConnection": () => (/* binding */ shimPeerConnection),
/* harmony export */   "fixNegotiationNeeded": () => (/* binding */ fixNegotiationNeeded)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "../node_modules/webrtc-adapter/src/js/utils.js");
/* harmony import */ var _getusermedia__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getusermedia */ "../node_modules/webrtc-adapter/src/js/chrome/getusermedia.js");
/* harmony import */ var _getdisplaymedia__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getdisplaymedia */ "../node_modules/webrtc-adapter/src/js/chrome/getdisplaymedia.js");
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */






function shimMediaStream(window) {
  window.MediaStream = window.MediaStream || window.webkitMediaStream;
}

function shimOnTrack(window) {
  if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
      window.RTCPeerConnection.prototype)) {
    Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
      get() {
        return this._ontrack;
      },
      set(f) {
        if (this._ontrack) {
          this.removeEventListener('track', this._ontrack);
        }
        this.addEventListener('track', this._ontrack = f);
      },
      enumerable: true,
      configurable: true
    });
    const origSetRemoteDescription =
        window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription =
      function setRemoteDescription() {
        if (!this._ontrackpoly) {
          this._ontrackpoly = (e) => {
            // onaddstream does not fire when a track is added to an existing
            // stream. But stream.onaddtrack is implemented so we use that.
            e.stream.addEventListener('addtrack', te => {
              let receiver;
              if (window.RTCPeerConnection.prototype.getReceivers) {
                receiver = this.getReceivers()
                  .find(r => r.track && r.track.id === te.track.id);
              } else {
                receiver = {track: te.track};
              }

              const event = new Event('track');
              event.track = te.track;
              event.receiver = receiver;
              event.transceiver = {receiver};
              event.streams = [e.stream];
              this.dispatchEvent(event);
            });
            e.stream.getTracks().forEach(track => {
              let receiver;
              if (window.RTCPeerConnection.prototype.getReceivers) {
                receiver = this.getReceivers()
                  .find(r => r.track && r.track.id === track.id);
              } else {
                receiver = {track};
              }
              const event = new Event('track');
              event.track = track;
              event.receiver = receiver;
              event.transceiver = {receiver};
              event.streams = [e.stream];
              this.dispatchEvent(event);
            });
          };
          this.addEventListener('addstream', this._ontrackpoly);
        }
        return origSetRemoteDescription.apply(this, arguments);
      };
  } else {
    // even if RTCRtpTransceiver is in window, it is only used and
    // emitted in unified-plan. Unfortunately this means we need
    // to unconditionally wrap the event.
    _utils_js__WEBPACK_IMPORTED_MODULE_0__.wrapPeerConnectionEvent(window, 'track', e => {
      if (!e.transceiver) {
        Object.defineProperty(e, 'transceiver',
          {value: {receiver: e.receiver}});
      }
      return e;
    });
  }
}

function shimGetSendersWithDtmf(window) {
  // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
  if (typeof window === 'object' && window.RTCPeerConnection &&
      !('getSenders' in window.RTCPeerConnection.prototype) &&
      'createDTMFSender' in window.RTCPeerConnection.prototype) {
    const shimSenderWithDtmf = function(pc, track) {
      return {
        track,
        get dtmf() {
          if (this._dtmf === undefined) {
            if (track.kind === 'audio') {
              this._dtmf = pc.createDTMFSender(track);
            } else {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        },
        _pc: pc
      };
    };

    // augment addTrack when getSenders is not available.
    if (!window.RTCPeerConnection.prototype.getSenders) {
      window.RTCPeerConnection.prototype.getSenders = function getSenders() {
        this._senders = this._senders || [];
        return this._senders.slice(); // return a copy of the internal state.
      };
      const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
      window.RTCPeerConnection.prototype.addTrack =
        function addTrack(track, stream) {
          let sender = origAddTrack.apply(this, arguments);
          if (!sender) {
            sender = shimSenderWithDtmf(this, track);
            this._senders.push(sender);
          }
          return sender;
        };

      const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
      window.RTCPeerConnection.prototype.removeTrack =
        function removeTrack(sender) {
          origRemoveTrack.apply(this, arguments);
          const idx = this._senders.indexOf(sender);
          if (idx !== -1) {
            this._senders.splice(idx, 1);
          }
        };
    }
    const origAddStream = window.RTCPeerConnection.prototype.addStream;
    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      this._senders = this._senders || [];
      origAddStream.apply(this, [stream]);
      stream.getTracks().forEach(track => {
        this._senders.push(shimSenderWithDtmf(this, track));
      });
    };

    const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
    window.RTCPeerConnection.prototype.removeStream =
      function removeStream(stream) {
        this._senders = this._senders || [];
        origRemoveStream.apply(this, [stream]);

        stream.getTracks().forEach(track => {
          const sender = this._senders.find(s => s.track === track);
          if (sender) { // remove sender
            this._senders.splice(this._senders.indexOf(sender), 1);
          }
        });
      };
  } else if (typeof window === 'object' && window.RTCPeerConnection &&
             'getSenders' in window.RTCPeerConnection.prototype &&
             'createDTMFSender' in window.RTCPeerConnection.prototype &&
             window.RTCRtpSender &&
             !('dtmf' in window.RTCRtpSender.prototype)) {
    const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
    window.RTCPeerConnection.prototype.getSenders = function getSenders() {
      const senders = origGetSenders.apply(this, []);
      senders.forEach(sender => sender._pc = this);
      return senders;
    };

    Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
      get() {
        if (this._dtmf === undefined) {
          if (this.track.kind === 'audio') {
            this._dtmf = this._pc.createDTMFSender(this.track);
          } else {
            this._dtmf = null;
          }
        }
        return this._dtmf;
      }
    });
  }
}

function shimGetStats(window) {
  if (!window.RTCPeerConnection) {
    return;
  }

  const origGetStats = window.RTCPeerConnection.prototype.getStats;
  window.RTCPeerConnection.prototype.getStats = function getStats() {
    const [selector, onSucc, onErr] = arguments;

    // If selector is a function then we are in the old style stats so just
    // pass back the original getStats format to avoid breaking old users.
    if (arguments.length > 0 && typeof selector === 'function') {
      return origGetStats.apply(this, arguments);
    }

    // When spec-style getStats is supported, return those when called with
    // either no arguments or the selector argument is null.
    if (origGetStats.length === 0 && (arguments.length === 0 ||
        typeof selector !== 'function')) {
      return origGetStats.apply(this, []);
    }

    const fixChromeStats_ = function(response) {
      const standardReport = {};
      const reports = response.result();
      reports.forEach(report => {
        const standardStats = {
          id: report.id,
          timestamp: report.timestamp,
          type: {
            localcandidate: 'local-candidate',
            remotecandidate: 'remote-candidate'
          }[report.type] || report.type
        };
        report.names().forEach(name => {
          standardStats[name] = report.stat(name);
        });
        standardReport[standardStats.id] = standardStats;
      });

      return standardReport;
    };

    // shim getStats with maplike support
    const makeMapStats = function(stats) {
      return new Map(Object.keys(stats).map(key => [key, stats[key]]));
    };

    if (arguments.length >= 2) {
      const successCallbackWrapper_ = function(response) {
        onSucc(makeMapStats(fixChromeStats_(response)));
      };

      return origGetStats.apply(this, [successCallbackWrapper_,
        selector]);
    }

    // promise-support
    return new Promise((resolve, reject) => {
      origGetStats.apply(this, [
        function(response) {
          resolve(makeMapStats(fixChromeStats_(response)));
        }, reject]);
    }).then(onSucc, onErr);
  };
}

function shimSenderReceiverGetStats(window) {
  if (!(typeof window === 'object' && window.RTCPeerConnection &&
      window.RTCRtpSender && window.RTCRtpReceiver)) {
    return;
  }

  // shim sender stats.
  if (!('getStats' in window.RTCRtpSender.prototype)) {
    const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
    if (origGetSenders) {
      window.RTCPeerConnection.prototype.getSenders = function getSenders() {
        const senders = origGetSenders.apply(this, []);
        senders.forEach(sender => sender._pc = this);
        return senders;
      };
    }

    const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
    if (origAddTrack) {
      window.RTCPeerConnection.prototype.addTrack = function addTrack() {
        const sender = origAddTrack.apply(this, arguments);
        sender._pc = this;
        return sender;
      };
    }
    window.RTCRtpSender.prototype.getStats = function getStats() {
      const sender = this;
      return this._pc.getStats().then(result =>
        /* Note: this will include stats of all senders that
         *   send a track with the same id as sender.track as
         *   it is not possible to identify the RTCRtpSender.
         */
        _utils_js__WEBPACK_IMPORTED_MODULE_0__.filterStats(result, sender.track, true));
    };
  }

  // shim receiver stats.
  if (!('getStats' in window.RTCRtpReceiver.prototype)) {
    const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
    if (origGetReceivers) {
      window.RTCPeerConnection.prototype.getReceivers =
        function getReceivers() {
          const receivers = origGetReceivers.apply(this, []);
          receivers.forEach(receiver => receiver._pc = this);
          return receivers;
        };
    }
    _utils_js__WEBPACK_IMPORTED_MODULE_0__.wrapPeerConnectionEvent(window, 'track', e => {
      e.receiver._pc = e.srcElement;
      return e;
    });
    window.RTCRtpReceiver.prototype.getStats = function getStats() {
      const receiver = this;
      return this._pc.getStats().then(result =>
        _utils_js__WEBPACK_IMPORTED_MODULE_0__.filterStats(result, receiver.track, false));
    };
  }

  if (!('getStats' in window.RTCRtpSender.prototype &&
      'getStats' in window.RTCRtpReceiver.prototype)) {
    return;
  }

  // shim RTCPeerConnection.getStats(track).
  const origGetStats = window.RTCPeerConnection.prototype.getStats;
  window.RTCPeerConnection.prototype.getStats = function getStats() {
    if (arguments.length > 0 &&
        arguments[0] instanceof window.MediaStreamTrack) {
      const track = arguments[0];
      let sender;
      let receiver;
      let err;
      this.getSenders().forEach(s => {
        if (s.track === track) {
          if (sender) {
            err = true;
          } else {
            sender = s;
          }
        }
      });
      this.getReceivers().forEach(r => {
        if (r.track === track) {
          if (receiver) {
            err = true;
          } else {
            receiver = r;
          }
        }
        return r.track === track;
      });
      if (err || (sender && receiver)) {
        return Promise.reject(new DOMException(
          'There are more than one sender or receiver for the track.',
          'InvalidAccessError'));
      } else if (sender) {
        return sender.getStats();
      } else if (receiver) {
        return receiver.getStats();
      }
      return Promise.reject(new DOMException(
        'There is no sender or receiver for the track.',
        'InvalidAccessError'));
    }
    return origGetStats.apply(this, arguments);
  };
}

function shimAddTrackRemoveTrackWithNative(window) {
  // shim addTrack/removeTrack with native variants in order to make
  // the interactions with legacy getLocalStreams behave as in other browsers.
  // Keeps a mapping stream.id => [stream, rtpsenders...]
  window.RTCPeerConnection.prototype.getLocalStreams =
    function getLocalStreams() {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      return Object.keys(this._shimmedLocalStreams)
        .map(streamId => this._shimmedLocalStreams[streamId][0]);
    };

  const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
  window.RTCPeerConnection.prototype.addTrack =
    function addTrack(track, stream) {
      if (!stream) {
        return origAddTrack.apply(this, arguments);
      }
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};

      const sender = origAddTrack.apply(this, arguments);
      if (!this._shimmedLocalStreams[stream.id]) {
        this._shimmedLocalStreams[stream.id] = [stream, sender];
      } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
        this._shimmedLocalStreams[stream.id].push(sender);
      }
      return sender;
    };

  const origAddStream = window.RTCPeerConnection.prototype.addStream;
  window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};

    stream.getTracks().forEach(track => {
      const alreadyExists = this.getSenders().find(s => s.track === track);
      if (alreadyExists) {
        throw new DOMException('Track already exists.',
            'InvalidAccessError');
      }
    });
    const existingSenders = this.getSenders();
    origAddStream.apply(this, arguments);
    const newSenders = this.getSenders()
      .filter(newSender => existingSenders.indexOf(newSender) === -1);
    this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
  };

  const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
  window.RTCPeerConnection.prototype.removeStream =
    function removeStream(stream) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      delete this._shimmedLocalStreams[stream.id];
      return origRemoveStream.apply(this, arguments);
    };

  const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
  window.RTCPeerConnection.prototype.removeTrack =
    function removeTrack(sender) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      if (sender) {
        Object.keys(this._shimmedLocalStreams).forEach(streamId => {
          const idx = this._shimmedLocalStreams[streamId].indexOf(sender);
          if (idx !== -1) {
            this._shimmedLocalStreams[streamId].splice(idx, 1);
          }
          if (this._shimmedLocalStreams[streamId].length === 1) {
            delete this._shimmedLocalStreams[streamId];
          }
        });
      }
      return origRemoveTrack.apply(this, arguments);
    };
}

function shimAddTrackRemoveTrack(window, browserDetails) {
  if (!window.RTCPeerConnection) {
    return;
  }
  // shim addTrack and removeTrack.
  if (window.RTCPeerConnection.prototype.addTrack &&
      browserDetails.version >= 65) {
    return shimAddTrackRemoveTrackWithNative(window);
  }

  // also shim pc.getLocalStreams when addTrack is shimmed
  // to return the original streams.
  const origGetLocalStreams = window.RTCPeerConnection.prototype
      .getLocalStreams;
  window.RTCPeerConnection.prototype.getLocalStreams =
    function getLocalStreams() {
      const nativeStreams = origGetLocalStreams.apply(this);
      this._reverseStreams = this._reverseStreams || {};
      return nativeStreams.map(stream => this._reverseStreams[stream.id]);
    };

  const origAddStream = window.RTCPeerConnection.prototype.addStream;
  window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
    this._streams = this._streams || {};
    this._reverseStreams = this._reverseStreams || {};

    stream.getTracks().forEach(track => {
      const alreadyExists = this.getSenders().find(s => s.track === track);
      if (alreadyExists) {
        throw new DOMException('Track already exists.',
            'InvalidAccessError');
      }
    });
    // Add identity mapping for consistency with addTrack.
    // Unless this is being used with a stream from addTrack.
    if (!this._reverseStreams[stream.id]) {
      const newStream = new window.MediaStream(stream.getTracks());
      this._streams[stream.id] = newStream;
      this._reverseStreams[newStream.id] = stream;
      stream = newStream;
    }
    origAddStream.apply(this, [stream]);
  };

  const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
  window.RTCPeerConnection.prototype.removeStream =
    function removeStream(stream) {
      this._streams = this._streams || {};
      this._reverseStreams = this._reverseStreams || {};

      origRemoveStream.apply(this, [(this._streams[stream.id] || stream)]);
      delete this._reverseStreams[(this._streams[stream.id] ?
          this._streams[stream.id].id : stream.id)];
      delete this._streams[stream.id];
    };

  window.RTCPeerConnection.prototype.addTrack =
    function addTrack(track, stream) {
      if (this.signalingState === 'closed') {
        throw new DOMException(
          'The RTCPeerConnection\'s signalingState is \'closed\'.',
          'InvalidStateError');
      }
      const streams = [].slice.call(arguments, 1);
      if (streams.length !== 1 ||
          !streams[0].getTracks().find(t => t === track)) {
        // this is not fully correct but all we can manage without
        // [[associated MediaStreams]] internal slot.
        throw new DOMException(
          'The adapter.js addTrack polyfill only supports a single ' +
          ' stream which is associated with the specified track.',
          'NotSupportedError');
      }

      const alreadyExists = this.getSenders().find(s => s.track === track);
      if (alreadyExists) {
        throw new DOMException('Track already exists.',
            'InvalidAccessError');
      }

      this._streams = this._streams || {};
      this._reverseStreams = this._reverseStreams || {};
      const oldStream = this._streams[stream.id];
      if (oldStream) {
        // this is using odd Chrome behaviour, use with caution:
        // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
        // Note: we rely on the high-level addTrack/dtmf shim to
        // create the sender with a dtmf sender.
        oldStream.addTrack(track);

        // Trigger ONN async.
        Promise.resolve().then(() => {
          this.dispatchEvent(new Event('negotiationneeded'));
        });
      } else {
        const newStream = new window.MediaStream([track]);
        this._streams[stream.id] = newStream;
        this._reverseStreams[newStream.id] = stream;
        this.addStream(newStream);
      }
      return this.getSenders().find(s => s.track === track);
    };

  // replace the internal stream id with the external one and
  // vice versa.
  function replaceInternalStreamId(pc, description) {
    let sdp = description.sdp;
    Object.keys(pc._reverseStreams || []).forEach(internalId => {
      const externalStream = pc._reverseStreams[internalId];
      const internalStream = pc._streams[externalStream.id];
      sdp = sdp.replace(new RegExp(internalStream.id, 'g'),
          externalStream.id);
    });
    return new RTCSessionDescription({
      type: description.type,
      sdp
    });
  }
  function replaceExternalStreamId(pc, description) {
    let sdp = description.sdp;
    Object.keys(pc._reverseStreams || []).forEach(internalId => {
      const externalStream = pc._reverseStreams[internalId];
      const internalStream = pc._streams[externalStream.id];
      sdp = sdp.replace(new RegExp(externalStream.id, 'g'),
          internalStream.id);
    });
    return new RTCSessionDescription({
      type: description.type,
      sdp
    });
  }
  ['createOffer', 'createAnswer'].forEach(function(method) {
    const nativeMethod = window.RTCPeerConnection.prototype[method];
    const methodObj = {[method]() {
      const args = arguments;
      const isLegacyCall = arguments.length &&
          typeof arguments[0] === 'function';
      if (isLegacyCall) {
        return nativeMethod.apply(this, [
          (description) => {
            const desc = replaceInternalStreamId(this, description);
            args[0].apply(null, [desc]);
          },
          (err) => {
            if (args[1]) {
              args[1].apply(null, err);
            }
          }, arguments[2]
        ]);
      }
      return nativeMethod.apply(this, arguments)
      .then(description => replaceInternalStreamId(this, description));
    }};
    window.RTCPeerConnection.prototype[method] = methodObj[method];
  });

  const origSetLocalDescription =
      window.RTCPeerConnection.prototype.setLocalDescription;
  window.RTCPeerConnection.prototype.setLocalDescription =
    function setLocalDescription() {
      if (!arguments.length || !arguments[0].type) {
        return origSetLocalDescription.apply(this, arguments);
      }
      arguments[0] = replaceExternalStreamId(this, arguments[0]);
      return origSetLocalDescription.apply(this, arguments);
    };

  // TODO: mangle getStats: https://w3c.github.io/webrtc-stats/#dom-rtcmediastreamstats-streamidentifier

  const origLocalDescription = Object.getOwnPropertyDescriptor(
      window.RTCPeerConnection.prototype, 'localDescription');
  Object.defineProperty(window.RTCPeerConnection.prototype,
      'localDescription', {
        get() {
          const description = origLocalDescription.get.apply(this);
          if (description.type === '') {
            return description;
          }
          return replaceInternalStreamId(this, description);
        }
      });

  window.RTCPeerConnection.prototype.removeTrack =
    function removeTrack(sender) {
      if (this.signalingState === 'closed') {
        throw new DOMException(
          'The RTCPeerConnection\'s signalingState is \'closed\'.',
          'InvalidStateError');
      }
      // We can not yet check for sender instanceof RTCRtpSender
      // since we shim RTPSender. So we check if sender._pc is set.
      if (!sender._pc) {
        throw new DOMException('Argument 1 of RTCPeerConnection.removeTrack ' +
            'does not implement interface RTCRtpSender.', 'TypeError');
      }
      const isLocal = sender._pc === this;
      if (!isLocal) {
        throw new DOMException('Sender was not created by this connection.',
            'InvalidAccessError');
      }

      // Search for the native stream the senders track belongs to.
      this._streams = this._streams || {};
      let stream;
      Object.keys(this._streams).forEach(streamid => {
        const hasTrack = this._streams[streamid].getTracks()
          .find(track => sender.track === track);
        if (hasTrack) {
          stream = this._streams[streamid];
        }
      });

      if (stream) {
        if (stream.getTracks().length === 1) {
          // if this is the last track of the stream, remove the stream. This
          // takes care of any shimmed _senders.
          this.removeStream(this._reverseStreams[stream.id]);
        } else {
          // relying on the same odd chrome behaviour as above.
          stream.removeTrack(sender.track);
        }
        this.dispatchEvent(new Event('negotiationneeded'));
      }
    };
}

function shimPeerConnection(window, browserDetails) {
  if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
    // very basic support for old versions.
    window.RTCPeerConnection = window.webkitRTCPeerConnection;
  }
  if (!window.RTCPeerConnection) {
    return;
  }

  // shim implicit creation of RTCSessionDescription/RTCIceCandidate
  if (browserDetails.version < 53) {
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          const nativeMethod = window.RTCPeerConnection.prototype[method];
          const methodObj = {[method]() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                window.RTCIceCandidate :
                window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          }};
          window.RTCPeerConnection.prototype[method] = methodObj[method];
        });
  }
}

// Attempt to fix ONN in plan-b mode.
function fixNegotiationNeeded(window, browserDetails) {
  _utils_js__WEBPACK_IMPORTED_MODULE_0__.wrapPeerConnectionEvent(window, 'negotiationneeded', e => {
    const pc = e.target;
    if (browserDetails.version < 72 || (pc.getConfiguration &&
        pc.getConfiguration().sdpSemantics === 'plan-b')) {
      if (pc.signalingState !== 'stable') {
        return;
      }
    }
    return e;
  });
}


/***/ }),

/***/ "../node_modules/webrtc-adapter/src/js/chrome/getdisplaymedia.js":
/*!***********************************************************************!*\
  !*** ../node_modules/webrtc-adapter/src/js/chrome/getdisplaymedia.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shimGetDisplayMedia": () => (/* binding */ shimGetDisplayMedia)
/* harmony export */ });
/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */

function shimGetDisplayMedia(window, getSourceId) {
  if (window.navigator.mediaDevices &&
    'getDisplayMedia' in window.navigator.mediaDevices) {
    return;
  }
  if (!(window.navigator.mediaDevices)) {
    return;
  }
  // getSourceId is a function that returns a promise resolving with
  // the sourceId of the screen/window/tab to be shared.
  if (typeof getSourceId !== 'function') {
    console.error('shimGetDisplayMedia: getSourceId argument is not ' +
        'a function');
    return;
  }
  window.navigator.mediaDevices.getDisplayMedia =
    function getDisplayMedia(constraints) {
      return getSourceId(constraints)
        .then(sourceId => {
          const widthSpecified = constraints.video && constraints.video.width;
          const heightSpecified = constraints.video &&
            constraints.video.height;
          const frameRateSpecified = constraints.video &&
            constraints.video.frameRate;
          constraints.video = {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sourceId,
              maxFrameRate: frameRateSpecified || 3
            }
          };
          if (widthSpecified) {
            constraints.video.mandatory.maxWidth = widthSpecified;
          }
          if (heightSpecified) {
            constraints.video.mandatory.maxHeight = heightSpecified;
          }
          return window.navigator.mediaDevices.getUserMedia(constraints);
        });
    };
}


/***/ }),

/***/ "../node_modules/webrtc-adapter/src/js/chrome/getusermedia.js":
/*!********************************************************************!*\
  !*** ../node_modules/webrtc-adapter/src/js/chrome/getusermedia.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shimGetUserMedia": () => (/* binding */ shimGetUserMedia)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "../node_modules/webrtc-adapter/src/js/utils.js");
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */


const logging = _utils_js__WEBPACK_IMPORTED_MODULE_0__.log;

function shimGetUserMedia(window, browserDetails) {
  const navigator = window && window.navigator;

  if (!navigator.mediaDevices) {
    return;
  }

  const constraintsToChrome_ = function(c) {
    if (typeof c !== 'object' || c.mandatory || c.optional) {
      return c;
    }
    const cc = {};
    Object.keys(c).forEach(key => {
      if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
        return;
      }
      const r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
      if (r.exact !== undefined && typeof r.exact === 'number') {
        r.min = r.max = r.exact;
      }
      const oldname_ = function(prefix, name) {
        if (prefix) {
          return prefix + name.charAt(0).toUpperCase() + name.slice(1);
        }
        return (name === 'deviceId') ? 'sourceId' : name;
      };
      if (r.ideal !== undefined) {
        cc.optional = cc.optional || [];
        let oc = {};
        if (typeof r.ideal === 'number') {
          oc[oldname_('min', key)] = r.ideal;
          cc.optional.push(oc);
          oc = {};
          oc[oldname_('max', key)] = r.ideal;
          cc.optional.push(oc);
        } else {
          oc[oldname_('', key)] = r.ideal;
          cc.optional.push(oc);
        }
      }
      if (r.exact !== undefined && typeof r.exact !== 'number') {
        cc.mandatory = cc.mandatory || {};
        cc.mandatory[oldname_('', key)] = r.exact;
      } else {
        ['min', 'max'].forEach(mix => {
          if (r[mix] !== undefined) {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_(mix, key)] = r[mix];
          }
        });
      }
    });
    if (c.advanced) {
      cc.optional = (cc.optional || []).concat(c.advanced);
    }
    return cc;
  };

  const shimConstraints_ = function(constraints, func) {
    if (browserDetails.version >= 61) {
      return func(constraints);
    }
    constraints = JSON.parse(JSON.stringify(constraints));
    if (constraints && typeof constraints.audio === 'object') {
      const remap = function(obj, a, b) {
        if (a in obj && !(b in obj)) {
          obj[b] = obj[a];
          delete obj[a];
        }
      };
      constraints = JSON.parse(JSON.stringify(constraints));
      remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
      remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
      constraints.audio = constraintsToChrome_(constraints.audio);
    }
    if (constraints && typeof constraints.video === 'object') {
      // Shim facingMode for mobile & surface pro.
      let face = constraints.video.facingMode;
      face = face && ((typeof face === 'object') ? face : {ideal: face});
      const getSupportedFacingModeLies = browserDetails.version < 66;

      if ((face && (face.exact === 'user' || face.exact === 'environment' ||
                    face.ideal === 'user' || face.ideal === 'environment')) &&
          !(navigator.mediaDevices.getSupportedConstraints &&
            navigator.mediaDevices.getSupportedConstraints().facingMode &&
            !getSupportedFacingModeLies)) {
        delete constraints.video.facingMode;
        let matches;
        if (face.exact === 'environment' || face.ideal === 'environment') {
          matches = ['back', 'rear'];
        } else if (face.exact === 'user' || face.ideal === 'user') {
          matches = ['front'];
        }
        if (matches) {
          // Look for matches in label, or use last cam for back (typical).
          return navigator.mediaDevices.enumerateDevices()
          .then(devices => {
            devices = devices.filter(d => d.kind === 'videoinput');
            let dev = devices.find(d => matches.some(match =>
              d.label.toLowerCase().includes(match)));
            if (!dev && devices.length && matches.includes('back')) {
              dev = devices[devices.length - 1]; // more likely the back cam
            }
            if (dev) {
              constraints.video.deviceId = face.exact ? {exact: dev.deviceId} :
                                                        {ideal: dev.deviceId};
            }
            constraints.video = constraintsToChrome_(constraints.video);
            logging('chrome: ' + JSON.stringify(constraints));
            return func(constraints);
          });
        }
      }
      constraints.video = constraintsToChrome_(constraints.video);
    }
    logging('chrome: ' + JSON.stringify(constraints));
    return func(constraints);
  };

  const shimError_ = function(e) {
    if (browserDetails.version >= 64) {
      return e;
    }
    return {
      name: {
        PermissionDeniedError: 'NotAllowedError',
        PermissionDismissedError: 'NotAllowedError',
        InvalidStateError: 'NotAllowedError',
        DevicesNotFoundError: 'NotFoundError',
        ConstraintNotSatisfiedError: 'OverconstrainedError',
        TrackStartError: 'NotReadableError',
        MediaDeviceFailedDueToShutdown: 'NotAllowedError',
        MediaDeviceKillSwitchOn: 'NotAllowedError',
        TabCaptureError: 'AbortError',
        ScreenCaptureError: 'AbortError',
        DeviceCaptureError: 'AbortError'
      }[e.name] || e.name,
      message: e.message,
      constraint: e.constraint || e.constraintName,
      toString() {
        return this.name + (this.message && ': ') + this.message;
      }
    };
  };

  const getUserMedia_ = function(constraints, onSuccess, onError) {
    shimConstraints_(constraints, c => {
      navigator.webkitGetUserMedia(c, onSuccess, e => {
        if (onError) {
          onError(shimError_(e));
        }
      });
    });
  };
  navigator.getUserMedia = getUserMedia_.bind(navigator);

  // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
  // function which returns a Promise, it does not accept spec-style
  // constraints.
  if (navigator.mediaDevices.getUserMedia) {
    const origGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(cs) {
      return shimConstraints_(cs, c => origGetUserMedia(c).then(stream => {
        if (c.audio && !stream.getAudioTracks().length ||
            c.video && !stream.getVideoTracks().length) {
          stream.getTracks().forEach(track => {
            track.stop();
          });
          throw new DOMException('', 'NotFoundError');
        }
        return stream;
      }, e => Promise.reject(shimError_(e))));
    };
  }
}


/***/ }),

/***/ "../node_modules/webrtc-adapter/src/js/common_shim.js":
/*!************************************************************!*\
  !*** ../node_modules/webrtc-adapter/src/js/common_shim.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shimRTCIceCandidate": () => (/* binding */ shimRTCIceCandidate),
/* harmony export */   "shimMaxMessageSize": () => (/* binding */ shimMaxMessageSize),
/* harmony export */   "shimSendThrowTypeError": () => (/* binding */ shimSendThrowTypeError),
/* harmony export */   "shimConnectionState": () => (/* binding */ shimConnectionState),
/* harmony export */   "removeExtmapAllowMixed": () => (/* binding */ removeExtmapAllowMixed),
/* harmony export */   "shimAddIceCandidateNullOrEmpty": () => (/* binding */ shimAddIceCandidateNullOrEmpty)
/* harmony export */ });
/* harmony import */ var sdp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sdp */ "../node_modules/sdp/sdp.js");
/* harmony import */ var sdp__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sdp__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "../node_modules/webrtc-adapter/src/js/utils.js");
/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */





function shimRTCIceCandidate(window) {
  // foundation is arbitrarily chosen as an indicator for full support for
  // https://w3c.github.io/webrtc-pc/#rtcicecandidate-interface
  if (!window.RTCIceCandidate || (window.RTCIceCandidate && 'foundation' in
      window.RTCIceCandidate.prototype)) {
    return;
  }

  const NativeRTCIceCandidate = window.RTCIceCandidate;
  window.RTCIceCandidate = function RTCIceCandidate(args) {
    // Remove the a= which shouldn't be part of the candidate string.
    if (typeof args === 'object' && args.candidate &&
        args.candidate.indexOf('a=') === 0) {
      args = JSON.parse(JSON.stringify(args));
      args.candidate = args.candidate.substr(2);
    }

    if (args.candidate && args.candidate.length) {
      // Augment the native candidate with the parsed fields.
      const nativeCandidate = new NativeRTCIceCandidate(args);
      const parsedCandidate = sdp__WEBPACK_IMPORTED_MODULE_0___default().parseCandidate(args.candidate);
      const augmentedCandidate = Object.assign(nativeCandidate,
          parsedCandidate);

      // Add a serializer that does not serialize the extra attributes.
      augmentedCandidate.toJSON = function toJSON() {
        return {
          candidate: augmentedCandidate.candidate,
          sdpMid: augmentedCandidate.sdpMid,
          sdpMLineIndex: augmentedCandidate.sdpMLineIndex,
          usernameFragment: augmentedCandidate.usernameFragment,
        };
      };
      return augmentedCandidate;
    }
    return new NativeRTCIceCandidate(args);
  };
  window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;

  // Hook up the augmented candidate in onicecandidate and
  // addEventListener('icecandidate', ...)
  _utils__WEBPACK_IMPORTED_MODULE_1__.wrapPeerConnectionEvent(window, 'icecandidate', e => {
    if (e.candidate) {
      Object.defineProperty(e, 'candidate', {
        value: new window.RTCIceCandidate(e.candidate),
        writable: 'false'
      });
    }
    return e;
  });
}

function shimMaxMessageSize(window, browserDetails) {
  if (!window.RTCPeerConnection) {
    return;
  }

  if (!('sctp' in window.RTCPeerConnection.prototype)) {
    Object.defineProperty(window.RTCPeerConnection.prototype, 'sctp', {
      get() {
        return typeof this._sctp === 'undefined' ? null : this._sctp;
      }
    });
  }

  const sctpInDescription = function(description) {
    if (!description || !description.sdp) {
      return false;
    }
    const sections = sdp__WEBPACK_IMPORTED_MODULE_0___default().splitSections(description.sdp);
    sections.shift();
    return sections.some(mediaSection => {
      const mLine = sdp__WEBPACK_IMPORTED_MODULE_0___default().parseMLine(mediaSection);
      return mLine && mLine.kind === 'application'
          && mLine.protocol.indexOf('SCTP') !== -1;
    });
  };

  const getRemoteFirefoxVersion = function(description) {
    // TODO: Is there a better solution for detecting Firefox?
    const match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
    if (match === null || match.length < 2) {
      return -1;
    }
    const version = parseInt(match[1], 10);
    // Test for NaN (yes, this is ugly)
    return version !== version ? -1 : version;
  };

  const getCanSendMaxMessageSize = function(remoteIsFirefox) {
    // Every implementation we know can send at least 64 KiB.
    // Note: Although Chrome is technically able to send up to 256 KiB, the
    //       data does not reach the other peer reliably.
    //       See: https://bugs.chromium.org/p/webrtc/issues/detail?id=8419
    let canSendMaxMessageSize = 65536;
    if (browserDetails.browser === 'firefox') {
      if (browserDetails.version < 57) {
        if (remoteIsFirefox === -1) {
          // FF < 57 will send in 16 KiB chunks using the deprecated PPID
          // fragmentation.
          canSendMaxMessageSize = 16384;
        } else {
          // However, other FF (and RAWRTC) can reassemble PPID-fragmented
          // messages. Thus, supporting ~2 GiB when sending.
          canSendMaxMessageSize = 2147483637;
        }
      } else if (browserDetails.version < 60) {
        // Currently, all FF >= 57 will reset the remote maximum message size
        // to the default value when a data channel is created at a later
        // stage. :(
        // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
        canSendMaxMessageSize =
          browserDetails.version === 57 ? 65535 : 65536;
      } else {
        // FF >= 60 supports sending ~2 GiB
        canSendMaxMessageSize = 2147483637;
      }
    }
    return canSendMaxMessageSize;
  };

  const getMaxMessageSize = function(description, remoteIsFirefox) {
    // Note: 65536 bytes is the default value from the SDP spec. Also,
    //       every implementation we know supports receiving 65536 bytes.
    let maxMessageSize = 65536;

    // FF 57 has a slightly incorrect default remote max message size, so
    // we need to adjust it here to avoid a failure when sending.
    // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1425697
    if (browserDetails.browser === 'firefox'
         && browserDetails.version === 57) {
      maxMessageSize = 65535;
    }

    const match = sdp__WEBPACK_IMPORTED_MODULE_0___default().matchPrefix(description.sdp,
      'a=max-message-size:');
    if (match.length > 0) {
      maxMessageSize = parseInt(match[0].substr(19), 10);
    } else if (browserDetails.browser === 'firefox' &&
                remoteIsFirefox !== -1) {
      // If the maximum message size is not present in the remote SDP and
      // both local and remote are Firefox, the remote peer can receive
      // ~2 GiB.
      maxMessageSize = 2147483637;
    }
    return maxMessageSize;
  };

  const origSetRemoteDescription =
      window.RTCPeerConnection.prototype.setRemoteDescription;
  window.RTCPeerConnection.prototype.setRemoteDescription =
    function setRemoteDescription() {
      this._sctp = null;
      // Chrome decided to not expose .sctp in plan-b mode.
      // As usual, adapter.js has to do an 'ugly worakaround'
      // to cover up the mess.
      if (browserDetails.browser === 'chrome' && browserDetails.version >= 76) {
        const {sdpSemantics} = this.getConfiguration();
        if (sdpSemantics === 'plan-b') {
          Object.defineProperty(this, 'sctp', {
            get() {
              return typeof this._sctp === 'undefined' ? null : this._sctp;
            },
            enumerable: true,
            configurable: true,
          });
        }
      }

      if (sctpInDescription(arguments[0])) {
        // Check if the remote is FF.
        const isFirefox = getRemoteFirefoxVersion(arguments[0]);

        // Get the maximum message size the local peer is capable of sending
        const canSendMMS = getCanSendMaxMessageSize(isFirefox);

        // Get the maximum message size of the remote peer.
        const remoteMMS = getMaxMessageSize(arguments[0], isFirefox);

        // Determine final maximum message size
        let maxMessageSize;
        if (canSendMMS === 0 && remoteMMS === 0) {
          maxMessageSize = Number.POSITIVE_INFINITY;
        } else if (canSendMMS === 0 || remoteMMS === 0) {
          maxMessageSize = Math.max(canSendMMS, remoteMMS);
        } else {
          maxMessageSize = Math.min(canSendMMS, remoteMMS);
        }

        // Create a dummy RTCSctpTransport object and the 'maxMessageSize'
        // attribute.
        const sctp = {};
        Object.defineProperty(sctp, 'maxMessageSize', {
          get() {
            return maxMessageSize;
          }
        });
        this._sctp = sctp;
      }

      return origSetRemoteDescription.apply(this, arguments);
    };
}

function shimSendThrowTypeError(window) {
  if (!(window.RTCPeerConnection &&
      'createDataChannel' in window.RTCPeerConnection.prototype)) {
    return;
  }

  // Note: Although Firefox >= 57 has a native implementation, the maximum
  //       message size can be reset for all data channels at a later stage.
  //       See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831

  function wrapDcSend(dc, pc) {
    const origDataChannelSend = dc.send;
    dc.send = function send() {
      const data = arguments[0];
      const length = data.length || data.size || data.byteLength;
      if (dc.readyState === 'open' &&
          pc.sctp && length > pc.sctp.maxMessageSize) {
        throw new TypeError('Message too large (can send a maximum of ' +
          pc.sctp.maxMessageSize + ' bytes)');
      }
      return origDataChannelSend.apply(dc, arguments);
    };
  }
  const origCreateDataChannel =
    window.RTCPeerConnection.prototype.createDataChannel;
  window.RTCPeerConnection.prototype.createDataChannel =
    function createDataChannel() {
      const dataChannel = origCreateDataChannel.apply(this, arguments);
      wrapDcSend(dataChannel, this);
      return dataChannel;
    };
  _utils__WEBPACK_IMPORTED_MODULE_1__.wrapPeerConnectionEvent(window, 'datachannel', e => {
    wrapDcSend(e.channel, e.target);
    return e;
  });
}


/* shims RTCConnectionState by pretending it is the same as iceConnectionState.
 * See https://bugs.chromium.org/p/webrtc/issues/detail?id=6145#c12
 * for why this is a valid hack in Chrome. In Firefox it is slightly incorrect
 * since DTLS failures would be hidden. See
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1265827
 * for the Firefox tracking bug.
 */
function shimConnectionState(window) {
  if (!window.RTCPeerConnection ||
      'connectionState' in window.RTCPeerConnection.prototype) {
    return;
  }
  const proto = window.RTCPeerConnection.prototype;
  Object.defineProperty(proto, 'connectionState', {
    get() {
      return {
        completed: 'connected',
        checking: 'connecting'
      }[this.iceConnectionState] || this.iceConnectionState;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'onconnectionstatechange', {
    get() {
      return this._onconnectionstatechange || null;
    },
    set(cb) {
      if (this._onconnectionstatechange) {
        this.removeEventListener('connectionstatechange',
            this._onconnectionstatechange);
        delete this._onconnectionstatechange;
      }
      if (cb) {
        this.addEventListener('connectionstatechange',
            this._onconnectionstatechange = cb);
      }
    },
    enumerable: true,
    configurable: true
  });

  ['setLocalDescription', 'setRemoteDescription'].forEach((method) => {
    const origMethod = proto[method];
    proto[method] = function() {
      if (!this._connectionstatechangepoly) {
        this._connectionstatechangepoly = e => {
          const pc = e.target;
          if (pc._lastConnectionState !== pc.connectionState) {
            pc._lastConnectionState = pc.connectionState;
            const newEvent = new Event('connectionstatechange', e);
            pc.dispatchEvent(newEvent);
          }
          return e;
        };
        this.addEventListener('iceconnectionstatechange',
          this._connectionstatechangepoly);
      }
      return origMethod.apply(this, arguments);
    };
  });
}

function removeExtmapAllowMixed(window, browserDetails) {
  /* remove a=extmap-allow-mixed for webrtc.org < M71 */
  if (!window.RTCPeerConnection) {
    return;
  }
  if (browserDetails.browser === 'chrome' && browserDetails.version >= 71) {
    return;
  }
  if (browserDetails.browser === 'safari' && browserDetails.version >= 605) {
    return;
  }
  const nativeSRD = window.RTCPeerConnection.prototype.setRemoteDescription;
  window.RTCPeerConnection.prototype.setRemoteDescription =
  function setRemoteDescription(desc) {
    if (desc && desc.sdp && desc.sdp.indexOf('\na=extmap-allow-mixed') !== -1) {
      const sdp = desc.sdp.split('\n').filter((line) => {
        return line.trim() !== 'a=extmap-allow-mixed';
      }).join('\n');
      // Safari enforces read-only-ness of RTCSessionDescription fields.
      if (window.RTCSessionDescription &&
          desc instanceof window.RTCSessionDescription) {
        arguments[0] = new window.RTCSessionDescription({
          type: desc.type,
          sdp,
        });
      } else {
        desc.sdp = sdp;
      }
    }
    return nativeSRD.apply(this, arguments);
  };
}

function shimAddIceCandidateNullOrEmpty(window, browserDetails) {
  // Support for addIceCandidate(null or undefined)
  // as well as addIceCandidate({candidate: "", ...})
  // https://bugs.chromium.org/p/chromium/issues/detail?id=978582
  // Note: must be called before other polyfills which change the signature.
  if (!(window.RTCPeerConnection && window.RTCPeerConnection.prototype)) {
    return;
  }
  const nativeAddIceCandidate =
      window.RTCPeerConnection.prototype.addIceCandidate;
  if (!nativeAddIceCandidate || nativeAddIceCandidate.length === 0) {
    return;
  }
  window.RTCPeerConnection.prototype.addIceCandidate =
    function addIceCandidate() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      // Firefox 68+ emits and processes {candidate: "", ...}, ignore
      // in older versions.
      // Native support for ignoring exists for Chrome M77+.
      // Safari ignores as well, exact version unknown but works in the same
      // version that also ignores addIceCandidate(null).
      if (((browserDetails.browser === 'chrome' && browserDetails.version < 78)
           || (browserDetails.browser === 'firefox'
               && browserDetails.version < 68)
           || (browserDetails.browser === 'safari'))
          && arguments[0] && arguments[0].candidate === '') {
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };
}


/***/ }),

/***/ "../node_modules/webrtc-adapter/src/js/edge/edge_shim.js":
/*!***************************************************************!*\
  !*** ../node_modules/webrtc-adapter/src/js/edge/edge_shim.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shimGetUserMedia": () => (/* reexport safe */ _getusermedia__WEBPACK_IMPORTED_MODULE_3__.shimGetUserMedia),
/* harmony export */   "shimGetDisplayMedia": () => (/* reexport safe */ _getdisplaymedia__WEBPACK_IMPORTED_MODULE_4__.shimGetDisplayMedia),
/* harmony export */   "shimPeerConnection": () => (/* binding */ shimPeerConnection),
/* harmony export */   "shimReplaceTrack": () => (/* binding */ shimReplaceTrack)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "../node_modules/webrtc-adapter/src/js/utils.js");
/* harmony import */ var _filtericeservers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filtericeservers */ "../node_modules/webrtc-adapter/src/js/edge/filtericeservers.js");
/* harmony import */ var rtcpeerconnection_shim__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rtcpeerconnection-shim */ "../node_modules/rtcpeerconnection-shim/rtcpeerconnection.js");
/* harmony import */ var rtcpeerconnection_shim__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(rtcpeerconnection_shim__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _getusermedia__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getusermedia */ "../node_modules/webrtc-adapter/src/js/edge/getusermedia.js");
/* harmony import */ var _getdisplaymedia__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getdisplaymedia */ "../node_modules/webrtc-adapter/src/js/edge/getdisplaymedia.js");
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */









function shimPeerConnection(window, browserDetails) {
  if (window.RTCIceGatherer) {
    if (!window.RTCIceCandidate) {
      window.RTCIceCandidate = function RTCIceCandidate(args) {
        return args;
      };
    }
    if (!window.RTCSessionDescription) {
      window.RTCSessionDescription = function RTCSessionDescription(args) {
        return args;
      };
    }
    // this adds an additional event listener to MediaStrackTrack that signals
    // when a tracks enabled property was changed. Workaround for a bug in
    // addStream, see below. No longer required in 15025+
    if (browserDetails.version < 15025) {
      const origMSTEnabled = Object.getOwnPropertyDescriptor(
          window.MediaStreamTrack.prototype, 'enabled');
      Object.defineProperty(window.MediaStreamTrack.prototype, 'enabled', {
        set(value) {
          origMSTEnabled.set.call(this, value);
          const ev = new Event('enabled');
          ev.enabled = value;
          this.dispatchEvent(ev);
        }
      });
    }
  }

  // ORTC defines the DTMF sender a bit different.
  // https://github.com/w3c/ortc/issues/714
  if (window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
    Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
      get() {
        if (this._dtmf === undefined) {
          if (this.track.kind === 'audio') {
            this._dtmf = new window.RTCDtmfSender(this);
          } else if (this.track.kind === 'video') {
            this._dtmf = null;
          }
        }
        return this._dtmf;
      }
    });
  }
  // Edge currently only implements the RTCDtmfSender, not the
  // RTCDTMFSender alias. See http://draft.ortc.org/#rtcdtmfsender2*
  if (window.RTCDtmfSender && !window.RTCDTMFSender) {
    window.RTCDTMFSender = window.RTCDtmfSender;
  }

  const RTCPeerConnectionShim = rtcpeerconnection_shim__WEBPACK_IMPORTED_MODULE_2___default()(window,
      browserDetails.version);
  window.RTCPeerConnection = function RTCPeerConnection(config) {
    if (config && config.iceServers) {
      config.iceServers = (0,_filtericeservers__WEBPACK_IMPORTED_MODULE_1__.filterIceServers)(config.iceServers,
        browserDetails.version);
      _utils__WEBPACK_IMPORTED_MODULE_0__.log('ICE servers after filtering:', config.iceServers);
    }
    return new RTCPeerConnectionShim(config);
  };
  window.RTCPeerConnection.prototype = RTCPeerConnectionShim.prototype;
}

function shimReplaceTrack(window) {
  // ORTC has replaceTrack -- https://github.com/w3c/ortc/issues/614
  if (window.RTCRtpSender &&
      !('replaceTrack' in window.RTCRtpSender.prototype)) {
    window.RTCRtpSender.prototype.replaceTrack =
        window.RTCRtpSender.prototype.setTrack;
  }
}


/***/ }),

/***/ "../node_modules/webrtc-adapter/src/js/edge/filtericeservers.js":
/*!**********************************************************************!*\
  !*** ../node_modules/webrtc-adapter/src/js/edge/filtericeservers.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "filterIceServers": () => (/* binding */ filterIceServers)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "../node_modules/webrtc-adapter/src/js/utils.js");
/*
 *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */



// Edge does not like
// 1) stun: filtered after 14393 unless ?transport=udp is present
// 2) turn: that does not have all of turn:host:port?transport=udp
// 3) turn: with ipv6 addresses
// 4) turn: occurring muliple times
function filterIceServers(iceServers, edgeVersion) {
  let hasTurn = false;
  iceServers = JSON.parse(JSON.stringify(iceServers));
  return iceServers.filter(server => {
    if (server && (server.urls || server.url)) {
      let urls = server.urls || server.url;
      if (server.url && !server.urls) {
        _utils__WEBPACK_IMPORTED_MODULE_0__.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
      }
      const isString = typeof urls === 'string';
      if (isString) {
        urls = [urls];
      }
      urls = urls.filter(url => {
        // filter STUN unconditionally.
        if (url.indexOf('stun:') === 0) {
          return false;
        }

        const validTurn = url.startsWith('turn') &&
            !url.startsWith('turn:[') &&
            url.includes('transport=udp');
        if (validTurn && !hasTurn) {
          hasTurn = true;
          return true;
        }
        return validTurn && !hasTurn;
      });

      delete server.url;
      server.urls = isString ? urls[0] : urls;
      return !!urls.length;
    }
  });
}


/***/ }),

/***/ "../node_modules/webrtc-adapter/src/js/edge/getdisplaymedia.js":
/*!*********************************************************************!*\
  !*** ../node_modules/webrtc-adapter/src/js/edge/getdisplaymedia.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shimGetDisplayMedia": () => (/* binding */ shimGetDisplayMedia)
/* harmony export */ });
/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


function shimGetDisplayMedia(window) {
  if (!('getDisplayMedia' in window.navigator)) {
    return;
  }
  if (!(window.navigator.mediaDevices)) {
    return;
  }
  if (window.navigator.mediaDevices &&
    'getDisplayMedia' in window.navigator.mediaDevices) {
    return;
  }
  window.navigator.mediaDevices.getDisplayMedia =
    window.navigator.getDisplayMedia.bind(window.navigator);
}


/***/ }),

/***/ "../node_modules/webrtc-adapter/src/js/edge/getusermedia.js":
/*!******************************************************************!*\
  !*** ../node_modules/webrtc-adapter/src/js/edge/getusermedia.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shimGetUserMedia": () => (/* binding */ shimGetUserMedia)
/* harmony export */ });
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


function shimGetUserMedia(window) {
  const navigator = window && window.navigator;

  const shimError_ = function(e) {
    return {
      name: {PermissionDeniedError: 'NotAllowedError'}[e.name] || e.name,
      message: e.message,
      constraint: e.constraint,
      toString() {
        return this.name;
      }
    };
  };

  // getUserMedia error shim.
  const origGetUserMedia = navigator.mediaDevices.getUserMedia.
      bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = function(c) {
    return origGetUserMedia(c).catch(e => Promise.reject(shimError_(e)));
  };
}


/***/ }),

/***/ "../node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js":
/*!*********************************************************************!*\
  !*** ../node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shimGetUserMedia": () => (/* reexport safe */ _getusermedia__WEBPACK_IMPORTED_MODULE_1__.shimGetUserMedia),
/* harmony export */   "shimGetDisplayMedia": () => (/* reexport safe */ _getdisplaymedia__WEBPACK_IMPORTED_MODULE_2__.shimGetDisplayMedia),
/* harmony export */   "shimOnTrack": () => (/* binding */ shimOnTrack),
/* harmony export */   "shimPeerConnection": () => (/* binding */ shimPeerConnection),
/* harmony export */   "shimSenderGetStats": () => (/* binding */ shimSenderGetStats),
/* harmony export */   "shimReceiverGetStats": () => (/* binding */ shimReceiverGetStats),
/* harmony export */   "shimRemoveStream": () => (/* binding */ shimRemoveStream),
/* harmony export */   "shimRTCDataChannel": () => (/* binding */ shimRTCDataChannel),
/* harmony export */   "shimAddTransceiver": () => (/* binding */ shimAddTransceiver),
/* harmony export */   "shimGetParameters": () => (/* binding */ shimGetParameters),
/* harmony export */   "shimCreateOffer": () => (/* binding */ shimCreateOffer),
/* harmony export */   "shimCreateAnswer": () => (/* binding */ shimCreateAnswer)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "../node_modules/webrtc-adapter/src/js/utils.js");
/* harmony import */ var _getusermedia__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getusermedia */ "../node_modules/webrtc-adapter/src/js/firefox/getusermedia.js");
/* harmony import */ var _getdisplaymedia__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getdisplaymedia */ "../node_modules/webrtc-adapter/src/js/firefox/getdisplaymedia.js");
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */






function shimOnTrack(window) {
  if (typeof window === 'object' && window.RTCTrackEvent &&
      ('receiver' in window.RTCTrackEvent.prototype) &&
      !('transceiver' in window.RTCTrackEvent.prototype)) {
    Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
      get() {
        return {receiver: this.receiver};
      }
    });
  }
}

function shimPeerConnection(window, browserDetails) {
  if (typeof window !== 'object' ||
      !(window.RTCPeerConnection || window.mozRTCPeerConnection)) {
    return; // probably media.peerconnection.enabled=false in about:config
  }
  if (!window.RTCPeerConnection && window.mozRTCPeerConnection) {
    // very basic support for old versions.
    window.RTCPeerConnection = window.mozRTCPeerConnection;
  }

  if (browserDetails.version < 53) {
    // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          const nativeMethod = window.RTCPeerConnection.prototype[method];
          const methodObj = {[method]() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                window.RTCIceCandidate :
                window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          }};
          window.RTCPeerConnection.prototype[method] = methodObj[method];
        });
  }

  const modernStatsTypes = {
    inboundrtp: 'inbound-rtp',
    outboundrtp: 'outbound-rtp',
    candidatepair: 'candidate-pair',
    localcandidate: 'local-candidate',
    remotecandidate: 'remote-candidate'
  };

  const nativeGetStats = window.RTCPeerConnection.prototype.getStats;
  window.RTCPeerConnection.prototype.getStats = function getStats() {
    const [selector, onSucc, onErr] = arguments;
    return nativeGetStats.apply(this, [selector || null])
      .then(stats => {
        if (browserDetails.version < 53 && !onSucc) {
          // Shim only promise getStats with spec-hyphens in type names
          // Leave callback version alone; misc old uses of forEach before Map
          try {
            stats.forEach(stat => {
              stat.type = modernStatsTypes[stat.type] || stat.type;
            });
          } catch (e) {
            if (e.name !== 'TypeError') {
              throw e;
            }
            // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
            stats.forEach((stat, i) => {
              stats.set(i, Object.assign({}, stat, {
                type: modernStatsTypes[stat.type] || stat.type
              }));
            });
          }
        }
        return stats;
      })
      .then(onSucc, onErr);
  };
}

function shimSenderGetStats(window) {
  if (!(typeof window === 'object' && window.RTCPeerConnection &&
      window.RTCRtpSender)) {
    return;
  }
  if (window.RTCRtpSender && 'getStats' in window.RTCRtpSender.prototype) {
    return;
  }
  const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
  if (origGetSenders) {
    window.RTCPeerConnection.prototype.getSenders = function getSenders() {
      const senders = origGetSenders.apply(this, []);
      senders.forEach(sender => sender._pc = this);
      return senders;
    };
  }

  const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
  if (origAddTrack) {
    window.RTCPeerConnection.prototype.addTrack = function addTrack() {
      const sender = origAddTrack.apply(this, arguments);
      sender._pc = this;
      return sender;
    };
  }
  window.RTCRtpSender.prototype.getStats = function getStats() {
    return this.track ? this._pc.getStats(this.track) :
        Promise.resolve(new Map());
  };
}

function shimReceiverGetStats(window) {
  if (!(typeof window === 'object' && window.RTCPeerConnection &&
      window.RTCRtpSender)) {
    return;
  }
  if (window.RTCRtpSender && 'getStats' in window.RTCRtpReceiver.prototype) {
    return;
  }
  const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
  if (origGetReceivers) {
    window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
      const receivers = origGetReceivers.apply(this, []);
      receivers.forEach(receiver => receiver._pc = this);
      return receivers;
    };
  }
  _utils__WEBPACK_IMPORTED_MODULE_0__.wrapPeerConnectionEvent(window, 'track', e => {
    e.receiver._pc = e.srcElement;
    return e;
  });
  window.RTCRtpReceiver.prototype.getStats = function getStats() {
    return this._pc.getStats(this.track);
  };
}

function shimRemoveStream(window) {
  if (!window.RTCPeerConnection ||
      'removeStream' in window.RTCPeerConnection.prototype) {
    return;
  }
  window.RTCPeerConnection.prototype.removeStream =
    function removeStream(stream) {
      _utils__WEBPACK_IMPORTED_MODULE_0__.deprecated('removeStream', 'removeTrack');
      this.getSenders().forEach(sender => {
        if (sender.track && stream.getTracks().includes(sender.track)) {
          this.removeTrack(sender);
        }
      });
    };
}

function shimRTCDataChannel(window) {
  // rename DataChannel to RTCDataChannel (native fix in FF60):
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1173851
  if (window.DataChannel && !window.RTCDataChannel) {
    window.RTCDataChannel = window.DataChannel;
  }
}

function shimAddTransceiver(window) {
  // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
  // Firefox ignores the init sendEncodings options passed to addTransceiver
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
  if (!(typeof window === 'object' && window.RTCPeerConnection)) {
    return;
  }
  const origAddTransceiver = window.RTCPeerConnection.prototype.addTransceiver;
  if (origAddTransceiver) {
    window.RTCPeerConnection.prototype.addTransceiver =
      function addTransceiver() {
        this.setParametersPromises = [];
        const initParameters = arguments[1];
        const shouldPerformCheck = initParameters &&
                                  'sendEncodings' in initParameters;
        if (shouldPerformCheck) {
          // If sendEncodings params are provided, validate grammar
          initParameters.sendEncodings.forEach((encodingParam) => {
            if ('rid' in encodingParam) {
              const ridRegex = /^[a-z0-9]{0,16}$/i;
              if (!ridRegex.test(encodingParam.rid)) {
                throw new TypeError('Invalid RID value provided.');
              }
            }
            if ('scaleResolutionDownBy' in encodingParam) {
              if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1.0)) {
                throw new RangeError('scale_resolution_down_by must be >= 1.0');
              }
            }
            if ('maxFramerate' in encodingParam) {
              if (!(parseFloat(encodingParam.maxFramerate) >= 0)) {
                throw new RangeError('max_framerate must be >= 0.0');
              }
            }
          });
        }
        const transceiver = origAddTransceiver.apply(this, arguments);
        if (shouldPerformCheck) {
          // Check if the init options were applied. If not we do this in an
          // asynchronous way and save the promise reference in a global object.
          // This is an ugly hack, but at the same time is way more robust than
          // checking the sender parameters before and after the createOffer
          // Also note that after the createoffer we are not 100% sure that
          // the params were asynchronously applied so we might miss the
          // opportunity to recreate offer.
          const {sender} = transceiver;
          const params = sender.getParameters();
          if (!('encodings' in params) ||
              // Avoid being fooled by patched getParameters() below.
              (params.encodings.length === 1 &&
               Object.keys(params.encodings[0]).length === 0)) {
            params.encodings = initParameters.sendEncodings;
            sender.sendEncodings = initParameters.sendEncodings;
            this.setParametersPromises.push(sender.setParameters(params)
              .then(() => {
                delete sender.sendEncodings;
              }).catch(() => {
                delete sender.sendEncodings;
              })
            );
          }
        }
        return transceiver;
      };
  }
}

function shimGetParameters(window) {
  if (!(typeof window === 'object' && window.RTCRtpSender)) {
    return;
  }
  const origGetParameters = window.RTCRtpSender.prototype.getParameters;
  if (origGetParameters) {
    window.RTCRtpSender.prototype.getParameters =
      function getParameters() {
        const params = origGetParameters.apply(this, arguments);
        if (!('encodings' in params)) {
          params.encodings = [].concat(this.sendEncodings || [{}]);
        }
        return params;
      };
  }
}

function shimCreateOffer(window) {
  // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
  // Firefox ignores the init sendEncodings options passed to addTransceiver
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
  if (!(typeof window === 'object' && window.RTCPeerConnection)) {
    return;
  }
  const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
  window.RTCPeerConnection.prototype.createOffer = function createOffer() {
    if (this.setParametersPromises && this.setParametersPromises.length) {
      return Promise.all(this.setParametersPromises)
      .then(() => {
        return origCreateOffer.apply(this, arguments);
      })
      .finally(() => {
        this.setParametersPromises = [];
      });
    }
    return origCreateOffer.apply(this, arguments);
  };
}

function shimCreateAnswer(window) {
  // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
  // Firefox ignores the init sendEncodings options passed to addTransceiver
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
  if (!(typeof window === 'object' && window.RTCPeerConnection)) {
    return;
  }
  const origCreateAnswer = window.RTCPeerConnection.prototype.createAnswer;
  window.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
    if (this.setParametersPromises && this.setParametersPromises.length) {
      return Promise.all(this.setParametersPromises)
      .then(() => {
        return origCreateAnswer.apply(this, arguments);
      })
      .finally(() => {
        this.setParametersPromises = [];
      });
    }
    return origCreateAnswer.apply(this, arguments);
  };
}


/***/ }),

/***/ "../node_modules/webrtc-adapter/src/js/firefox/getdisplaymedia.js":
/*!************************************************************************!*\
  !*** ../node_modules/webrtc-adapter/src/js/firefox/getdisplaymedia.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shimGetDisplayMedia": () => (/* binding */ shimGetDisplayMedia)
/* harmony export */ });
/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */


function shimGetDisplayMedia(window, preferredMediaSource) {
  if (window.navigator.mediaDevices &&
    'getDisplayMedia' in window.navigator.mediaDevices) {
    return;
  }
  if (!(window.navigator.mediaDevices)) {
    return;
  }
  window.navigator.mediaDevices.getDisplayMedia =
    function getDisplayMedia(constraints) {
      if (!(constraints && constraints.video)) {
        const err = new DOMException('getDisplayMedia without video ' +
            'constraints is undefined');
        err.name = 'NotFoundError';
        // from https://heycam.github.io/webidl/#idl-DOMException-error-names
        err.code = 8;
        return Promise.reject(err);
      }
      if (constraints.video === true) {
        constraints.video = {mediaSource: preferredMediaSource};
      } else {
        constraints.video.mediaSource = preferredMediaSource;
      }
      return window.navigator.mediaDevices.getUserMedia(constraints);
    };
}


/***/ }),

/***/ "../node_modules/webrtc-adapter/src/js/firefox/getusermedia.js":
/*!*********************************************************************!*\
  !*** ../node_modules/webrtc-adapter/src/js/firefox/getusermedia.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shimGetUserMedia": () => (/* binding */ shimGetUserMedia)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "../node_modules/webrtc-adapter/src/js/utils.js");
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */




function shimGetUserMedia(window, browserDetails) {
  const navigator = window && window.navigator;
  const MediaStreamTrack = window && window.MediaStreamTrack;

  navigator.getUserMedia = function(constraints, onSuccess, onError) {
    // Replace Firefox 44+'s deprecation warning with unprefixed version.
    _utils__WEBPACK_IMPORTED_MODULE_0__.deprecated('navigator.getUserMedia',
        'navigator.mediaDevices.getUserMedia');
    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
  };

  if (!(browserDetails.version > 55 &&
      'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
    const remap = function(obj, a, b) {
      if (a in obj && !(b in obj)) {
        obj[b] = obj[a];
        delete obj[a];
      }
    };

    const nativeGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(c) {
      if (typeof c === 'object' && typeof c.audio === 'object') {
        c = JSON.parse(JSON.stringify(c));
        remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
        remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
      }
      return nativeGetUserMedia(c);
    };

    if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
      const nativeGetSettings = MediaStreamTrack.prototype.getSettings;
      MediaStreamTrack.prototype.getSettings = function() {
        const obj = nativeGetSettings.apply(this, arguments);
        remap(obj, 'mozAutoGainControl', 'autoGainControl');
        remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
        return obj;
      };
    }

    if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
      const nativeApplyConstraints =
        MediaStreamTrack.prototype.applyConstraints;
      MediaStreamTrack.prototype.applyConstraints = function(c) {
        if (this.kind === 'audio' && typeof c === 'object') {
          c = JSON.parse(JSON.stringify(c));
          remap(c, 'autoGainControl', 'mozAutoGainControl');
          remap(c, 'noiseSuppression', 'mozNoiseSuppression');
        }
        return nativeApplyConstraints.apply(this, [c]);
      };
    }
  }
}


/***/ }),

/***/ "../node_modules/webrtc-adapter/src/js/safari/safari_shim.js":
/*!*******************************************************************!*\
  !*** ../node_modules/webrtc-adapter/src/js/safari/safari_shim.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shimLocalStreamsAPI": () => (/* binding */ shimLocalStreamsAPI),
/* harmony export */   "shimRemoteStreamsAPI": () => (/* binding */ shimRemoteStreamsAPI),
/* harmony export */   "shimCallbacksAPI": () => (/* binding */ shimCallbacksAPI),
/* harmony export */   "shimGetUserMedia": () => (/* binding */ shimGetUserMedia),
/* harmony export */   "shimConstraints": () => (/* binding */ shimConstraints),
/* harmony export */   "shimRTCIceServerUrls": () => (/* binding */ shimRTCIceServerUrls),
/* harmony export */   "shimTrackEventTransceiver": () => (/* binding */ shimTrackEventTransceiver),
/* harmony export */   "shimCreateOfferLegacy": () => (/* binding */ shimCreateOfferLegacy),
/* harmony export */   "shimAudioContext": () => (/* binding */ shimAudioContext)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "../node_modules/webrtc-adapter/src/js/utils.js");
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */



function shimLocalStreamsAPI(window) {
  if (typeof window !== 'object' || !window.RTCPeerConnection) {
    return;
  }
  if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
    window.RTCPeerConnection.prototype.getLocalStreams =
      function getLocalStreams() {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        return this._localStreams;
      };
  }
  if (!('addStream' in window.RTCPeerConnection.prototype)) {
    const _addTrack = window.RTCPeerConnection.prototype.addTrack;
    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      if (!this._localStreams) {
        this._localStreams = [];
      }
      if (!this._localStreams.includes(stream)) {
        this._localStreams.push(stream);
      }
      // Try to emulate Chrome's behaviour of adding in audio-video order.
      // Safari orders by track id.
      stream.getAudioTracks().forEach(track => _addTrack.call(this, track,
        stream));
      stream.getVideoTracks().forEach(track => _addTrack.call(this, track,
        stream));
    };

    window.RTCPeerConnection.prototype.addTrack =
      function addTrack(track, ...streams) {
        if (streams) {
          streams.forEach((stream) => {
            if (!this._localStreams) {
              this._localStreams = [stream];
            } else if (!this._localStreams.includes(stream)) {
              this._localStreams.push(stream);
            }
          });
        }
        return _addTrack.apply(this, arguments);
      };
  }
  if (!('removeStream' in window.RTCPeerConnection.prototype)) {
    window.RTCPeerConnection.prototype.removeStream =
      function removeStream(stream) {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        const index = this._localStreams.indexOf(stream);
        if (index === -1) {
          return;
        }
        this._localStreams.splice(index, 1);
        const tracks = stream.getTracks();
        this.getSenders().forEach(sender => {
          if (tracks.includes(sender.track)) {
            this.removeTrack(sender);
          }
        });
      };
  }
}

function shimRemoteStreamsAPI(window) {
  if (typeof window !== 'object' || !window.RTCPeerConnection) {
    return;
  }
  if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
    window.RTCPeerConnection.prototype.getRemoteStreams =
      function getRemoteStreams() {
        return this._remoteStreams ? this._remoteStreams : [];
      };
  }
  if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
    Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
      get() {
        return this._onaddstream;
      },
      set(f) {
        if (this._onaddstream) {
          this.removeEventListener('addstream', this._onaddstream);
          this.removeEventListener('track', this._onaddstreampoly);
        }
        this.addEventListener('addstream', this._onaddstream = f);
        this.addEventListener('track', this._onaddstreampoly = (e) => {
          e.streams.forEach(stream => {
            if (!this._remoteStreams) {
              this._remoteStreams = [];
            }
            if (this._remoteStreams.includes(stream)) {
              return;
            }
            this._remoteStreams.push(stream);
            const event = new Event('addstream');
            event.stream = stream;
            this.dispatchEvent(event);
          });
        });
      }
    });
    const origSetRemoteDescription =
      window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription =
      function setRemoteDescription() {
        const pc = this;
        if (!this._onaddstreampoly) {
          this.addEventListener('track', this._onaddstreampoly = function(e) {
            e.streams.forEach(stream => {
              if (!pc._remoteStreams) {
                pc._remoteStreams = [];
              }
              if (pc._remoteStreams.indexOf(stream) >= 0) {
                return;
              }
              pc._remoteStreams.push(stream);
              const event = new Event('addstream');
              event.stream = stream;
              pc.dispatchEvent(event);
            });
          });
        }
        return origSetRemoteDescription.apply(pc, arguments);
      };
  }
}

function shimCallbacksAPI(window) {
  if (typeof window !== 'object' || !window.RTCPeerConnection) {
    return;
  }
  const prototype = window.RTCPeerConnection.prototype;
  const origCreateOffer = prototype.createOffer;
  const origCreateAnswer = prototype.createAnswer;
  const setLocalDescription = prototype.setLocalDescription;
  const setRemoteDescription = prototype.setRemoteDescription;
  const addIceCandidate = prototype.addIceCandidate;

  prototype.createOffer =
    function createOffer(successCallback, failureCallback) {
      const options = (arguments.length >= 2) ? arguments[2] : arguments[0];
      const promise = origCreateOffer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };

  prototype.createAnswer =
    function createAnswer(successCallback, failureCallback) {
      const options = (arguments.length >= 2) ? arguments[2] : arguments[0];
      const promise = origCreateAnswer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };

  let withCallback = function(description, successCallback, failureCallback) {
    const promise = setLocalDescription.apply(this, [description]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.setLocalDescription = withCallback;

  withCallback = function(description, successCallback, failureCallback) {
    const promise = setRemoteDescription.apply(this, [description]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.setRemoteDescription = withCallback;

  withCallback = function(candidate, successCallback, failureCallback) {
    const promise = addIceCandidate.apply(this, [candidate]);
    if (!failureCallback) {
      return promise;
    }
    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };
  prototype.addIceCandidate = withCallback;
}

function shimGetUserMedia(window) {
  const navigator = window && window.navigator;

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // shim not needed in Safari 12.1
    const mediaDevices = navigator.mediaDevices;
    const _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
    navigator.mediaDevices.getUserMedia = (constraints) => {
      return _getUserMedia(shimConstraints(constraints));
    };
  }

  if (!navigator.getUserMedia && navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia) {
    navigator.getUserMedia = function getUserMedia(constraints, cb, errcb) {
      navigator.mediaDevices.getUserMedia(constraints)
      .then(cb, errcb);
    }.bind(navigator);
  }
}

function shimConstraints(constraints) {
  if (constraints && constraints.video !== undefined) {
    return Object.assign({},
      constraints,
      {video: _utils__WEBPACK_IMPORTED_MODULE_0__.compactObject(constraints.video)}
    );
  }

  return constraints;
}

function shimRTCIceServerUrls(window) {
  if (!window.RTCPeerConnection) {
    return;
  }
  // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
  const OrigPeerConnection = window.RTCPeerConnection;
  window.RTCPeerConnection =
    function RTCPeerConnection(pcConfig, pcConstraints) {
      if (pcConfig && pcConfig.iceServers) {
        const newIceServers = [];
        for (let i = 0; i < pcConfig.iceServers.length; i++) {
          let server = pcConfig.iceServers[i];
          if (!server.hasOwnProperty('urls') &&
              server.hasOwnProperty('url')) {
            _utils__WEBPACK_IMPORTED_MODULE_0__.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
            server = JSON.parse(JSON.stringify(server));
            server.urls = server.url;
            delete server.url;
            newIceServers.push(server);
          } else {
            newIceServers.push(pcConfig.iceServers[i]);
          }
        }
        pcConfig.iceServers = newIceServers;
      }
      return new OrigPeerConnection(pcConfig, pcConstraints);
    };
  window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
  // wrap static methods. Currently just generateCertificate.
  if ('generateCertificate' in OrigPeerConnection) {
    Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
      get() {
        return OrigPeerConnection.generateCertificate;
      }
    });
  }
}

function shimTrackEventTransceiver(window) {
  // Add event.transceiver member over deprecated event.receiver
  if (typeof window === 'object' && window.RTCTrackEvent &&
      'receiver' in window.RTCTrackEvent.prototype &&
      !('transceiver' in window.RTCTrackEvent.prototype)) {
    Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
      get() {
        return {receiver: this.receiver};
      }
    });
  }
}

function shimCreateOfferLegacy(window) {
  const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
  window.RTCPeerConnection.prototype.createOffer =
    function createOffer(offerOptions) {
      if (offerOptions) {
        if (typeof offerOptions.offerToReceiveAudio !== 'undefined') {
          // support bit values
          offerOptions.offerToReceiveAudio =
            !!offerOptions.offerToReceiveAudio;
        }
        const audioTransceiver = this.getTransceivers().find(transceiver =>
          transceiver.receiver.track.kind === 'audio');
        if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
          if (audioTransceiver.direction === 'sendrecv') {
            if (audioTransceiver.setDirection) {
              audioTransceiver.setDirection('sendonly');
            } else {
              audioTransceiver.direction = 'sendonly';
            }
          } else if (audioTransceiver.direction === 'recvonly') {
            if (audioTransceiver.setDirection) {
              audioTransceiver.setDirection('inactive');
            } else {
              audioTransceiver.direction = 'inactive';
            }
          }
        } else if (offerOptions.offerToReceiveAudio === true &&
            !audioTransceiver) {
          this.addTransceiver('audio');
        }

        if (typeof offerOptions.offerToReceiveVideo !== 'undefined') {
          // support bit values
          offerOptions.offerToReceiveVideo =
            !!offerOptions.offerToReceiveVideo;
        }
        const videoTransceiver = this.getTransceivers().find(transceiver =>
          transceiver.receiver.track.kind === 'video');
        if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
          if (videoTransceiver.direction === 'sendrecv') {
            if (videoTransceiver.setDirection) {
              videoTransceiver.setDirection('sendonly');
            } else {
              videoTransceiver.direction = 'sendonly';
            }
          } else if (videoTransceiver.direction === 'recvonly') {
            if (videoTransceiver.setDirection) {
              videoTransceiver.setDirection('inactive');
            } else {
              videoTransceiver.direction = 'inactive';
            }
          }
        } else if (offerOptions.offerToReceiveVideo === true &&
            !videoTransceiver) {
          this.addTransceiver('video');
        }
      }
      return origCreateOffer.apply(this, arguments);
    };
}

function shimAudioContext(window) {
  if (typeof window !== 'object' || window.AudioContext) {
    return;
  }
  window.AudioContext = window.webkitAudioContext;
}


/***/ }),

/***/ "../node_modules/webrtc-adapter/src/js/utils.js":
/*!******************************************************!*\
  !*** ../node_modules/webrtc-adapter/src/js/utils.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "extractVersion": () => (/* binding */ extractVersion),
/* harmony export */   "wrapPeerConnectionEvent": () => (/* binding */ wrapPeerConnectionEvent),
/* harmony export */   "disableLog": () => (/* binding */ disableLog),
/* harmony export */   "disableWarnings": () => (/* binding */ disableWarnings),
/* harmony export */   "log": () => (/* binding */ log),
/* harmony export */   "deprecated": () => (/* binding */ deprecated),
/* harmony export */   "detectBrowser": () => (/* binding */ detectBrowser),
/* harmony export */   "compactObject": () => (/* binding */ compactObject),
/* harmony export */   "walkStats": () => (/* binding */ walkStats),
/* harmony export */   "filterStats": () => (/* binding */ filterStats)
/* harmony export */ });
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


let logDisabled_ = true;
let deprecationWarnings_ = true;

/**
 * Extract browser version out of the provided user agent string.
 *
 * @param {!string} uastring userAgent string.
 * @param {!string} expr Regular expression used as match criteria.
 * @param {!number} pos position in the version string to be returned.
 * @return {!number} browser version.
 */
function extractVersion(uastring, expr, pos) {
  const match = uastring.match(expr);
  return match && match.length >= pos && parseInt(match[pos], 10);
}

// Wraps the peerconnection event eventNameToWrap in a function
// which returns the modified event object (or false to prevent
// the event).
function wrapPeerConnectionEvent(window, eventNameToWrap, wrapper) {
  if (!window.RTCPeerConnection) {
    return;
  }
  const proto = window.RTCPeerConnection.prototype;
  const nativeAddEventListener = proto.addEventListener;
  proto.addEventListener = function(nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap) {
      return nativeAddEventListener.apply(this, arguments);
    }
    const wrappedCallback = (e) => {
      const modifiedEvent = wrapper(e);
      if (modifiedEvent) {
        if (cb.handleEvent) {
          cb.handleEvent(modifiedEvent);
        } else {
          cb(modifiedEvent);
        }
      }
    };
    this._eventMap = this._eventMap || {};
    if (!this._eventMap[eventNameToWrap]) {
      this._eventMap[eventNameToWrap] = new Map();
    }
    this._eventMap[eventNameToWrap].set(cb, wrappedCallback);
    return nativeAddEventListener.apply(this, [nativeEventName,
      wrappedCallback]);
  };

  const nativeRemoveEventListener = proto.removeEventListener;
  proto.removeEventListener = function(nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap || !this._eventMap
        || !this._eventMap[eventNameToWrap]) {
      return nativeRemoveEventListener.apply(this, arguments);
    }
    if (!this._eventMap[eventNameToWrap].has(cb)) {
      return nativeRemoveEventListener.apply(this, arguments);
    }
    const unwrappedCb = this._eventMap[eventNameToWrap].get(cb);
    this._eventMap[eventNameToWrap].delete(cb);
    if (this._eventMap[eventNameToWrap].size === 0) {
      delete this._eventMap[eventNameToWrap];
    }
    if (Object.keys(this._eventMap).length === 0) {
      delete this._eventMap;
    }
    return nativeRemoveEventListener.apply(this, [nativeEventName,
      unwrappedCb]);
  };

  Object.defineProperty(proto, 'on' + eventNameToWrap, {
    get() {
      return this['_on' + eventNameToWrap];
    },
    set(cb) {
      if (this['_on' + eventNameToWrap]) {
        this.removeEventListener(eventNameToWrap,
            this['_on' + eventNameToWrap]);
        delete this['_on' + eventNameToWrap];
      }
      if (cb) {
        this.addEventListener(eventNameToWrap,
            this['_on' + eventNameToWrap] = cb);
      }
    },
    enumerable: true,
    configurable: true
  });
}

function disableLog(bool) {
  if (typeof bool !== 'boolean') {
    return new Error('Argument type: ' + typeof bool +
        '. Please use a boolean.');
  }
  logDisabled_ = bool;
  return (bool) ? 'adapter.js logging disabled' :
      'adapter.js logging enabled';
}

/**
 * Disable or enable deprecation warnings
 * @param {!boolean} bool set to true to disable warnings.
 */
function disableWarnings(bool) {
  if (typeof bool !== 'boolean') {
    return new Error('Argument type: ' + typeof bool +
        '. Please use a boolean.');
  }
  deprecationWarnings_ = !bool;
  return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
}

function log() {
  if (typeof window === 'object') {
    if (logDisabled_) {
      return;
    }
    if (typeof console !== 'undefined' && typeof console.log === 'function') {
      console.log.apply(console, arguments);
    }
  }
}

/**
 * Shows a deprecation warning suggesting the modern and spec-compatible API.
 */
function deprecated(oldMethod, newMethod) {
  if (!deprecationWarnings_) {
    return;
  }
  console.warn(oldMethod + ' is deprecated, please use ' + newMethod +
      ' instead.');
}

/**
 * Browser detector.
 *
 * @return {object} result containing browser and version
 *     properties.
 */
function detectBrowser(window) {
  // Returned result object.
  const result = {browser: null, version: null};

  // Fail early if it's not a browser
  if (typeof window === 'undefined' || !window.navigator) {
    result.browser = 'Not a browser.';
    return result;
  }

  const {navigator} = window;

  if (navigator.mozGetUserMedia) { // Firefox.
    result.browser = 'firefox';
    result.version = extractVersion(navigator.userAgent,
        /Firefox\/(\d+)\./, 1);
  } else if (navigator.webkitGetUserMedia ||
      (window.isSecureContext === false && window.webkitRTCPeerConnection &&
       !window.RTCIceGatherer)) {
    // Chrome, Chromium, Webview, Opera.
    // Version matches Chrome/WebRTC version.
    // Chrome 74 removed webkitGetUserMedia on http as well so we need the
    // more complicated fallback to webkitRTCPeerConnection.
    result.browser = 'chrome';
    result.version = extractVersion(navigator.userAgent,
        /Chrom(e|ium)\/(\d+)\./, 2);
  } else if (navigator.mediaDevices &&
      navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) { // Edge.
    result.browser = 'edge';
    result.version = extractVersion(navigator.userAgent,
        /Edge\/(\d+).(\d+)$/, 2);
  } else if (window.RTCPeerConnection &&
      navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) { // Safari.
    result.browser = 'safari';
    result.version = extractVersion(navigator.userAgent,
        /AppleWebKit\/(\d+)\./, 1);
    result.supportsUnifiedPlan = window.RTCRtpTransceiver &&
        'currentDirection' in window.RTCRtpTransceiver.prototype;
  } else { // Default fallthrough: not supported.
    result.browser = 'Not a supported browser.';
    return result;
  }

  return result;
}

/**
 * Checks if something is an object.
 *
 * @param {*} val The something you want to check.
 * @return true if val is an object, false otherwise.
 */
function isObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]';
}

/**
 * Remove all empty objects and undefined values
 * from a nested object -- an enhanced and vanilla version
 * of Lodash's `compact`.
 */
function compactObject(data) {
  if (!isObject(data)) {
    return data;
  }

  return Object.keys(data).reduce(function(accumulator, key) {
    const isObj = isObject(data[key]);
    const value = isObj ? compactObject(data[key]) : data[key];
    const isEmptyObject = isObj && !Object.keys(value).length;
    if (value === undefined || isEmptyObject) {
      return accumulator;
    }
    return Object.assign(accumulator, {[key]: value});
  }, {});
}

/* iterates the stats graph recursively. */
function walkStats(stats, base, resultSet) {
  if (!base || resultSet.has(base.id)) {
    return;
  }
  resultSet.set(base.id, base);
  Object.keys(base).forEach(name => {
    if (name.endsWith('Id')) {
      walkStats(stats, stats.get(base[name]), resultSet);
    } else if (name.endsWith('Ids')) {
      base[name].forEach(id => {
        walkStats(stats, stats.get(id), resultSet);
      });
    }
  });
}

/* filter getStats for a sender/receiver track. */
function filterStats(result, track, outbound) {
  const streamStatsType = outbound ? 'outbound-rtp' : 'inbound-rtp';
  const filteredResult = new Map();
  if (track === null) {
    return filteredResult;
  }
  const trackStats = [];
  result.forEach(value => {
    if (value.type === 'track' &&
        value.trackIdentifier === track.id) {
      trackStats.push(value);
    }
  });
  trackStats.forEach(trackStat => {
    result.forEach(stats => {
      if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
        walkStats(result, stats, filteredResult);
      }
    });
  });
  return filteredResult;
}



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./sample.ts");
/******/ 	
/******/ })()
;