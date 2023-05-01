"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpCache = exports.RedisCache = exports.LocalCache = void 0;
const common_1 = require("@nestjs/common");
const constant_1 = require("./constant");
/**
 * Defining Decorator Functions by Local Cache
 * @param options
 * @constructor
 */
function LocalCache(options = {}) {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)(constant_1.CACHE_OPTIONS, options), (0, common_1.SetMetadata)(constant_1.CACHE_STORE, "memory"));
}
exports.LocalCache = LocalCache;
/**
 * Defining Decorator Functions by Redis Cache
 * @param options
 * @constructor
 */
function RedisCache(options = {}) {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)(constant_1.CACHE_OPTIONS, options), (0, common_1.SetMetadata)(constant_1.CACHE_STORE, "redis"));
}
exports.RedisCache = RedisCache;
/**
 * Defining Decorator Functions by Redis Cache
 * @param options
 * @constructor
 */
function HttpCache(options = {}) {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)(constant_1.CACHE_OPTIONS, options));
}
exports.HttpCache = HttpCache;
//# sourceMappingURL=cache.decorator.js.map