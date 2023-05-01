import { applyDecorators, SetMetadata } from "@nestjs/common";
import { CACHE_OPTIONS, CACHE_STORE } from "./constant";
/**
 * Defining Decorator Functions by Local Cache
 * @param options
 * @constructor
 */
export function LocalCache(options = {}) {
    return applyDecorators(SetMetadata(CACHE_OPTIONS, options), SetMetadata(CACHE_STORE, "memory"));
}
/**
 * Defining Decorator Functions by Redis Cache
 * @param options
 * @constructor
 */
export function RedisCache(options = {}) {
    return applyDecorators(SetMetadata(CACHE_OPTIONS, options), SetMetadata(CACHE_STORE, "redis"));
}
/**
 * Defining Decorator Functions by Redis Cache
 * @param options
 * @constructor
 */
export function HttpCache(options = {}) {
    return applyDecorators(SetMetadata(CACHE_OPTIONS, options));
}
//# sourceMappingURL=cache.decorator.js.map