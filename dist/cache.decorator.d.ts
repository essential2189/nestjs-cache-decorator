import { CacheOptions } from "./interfaces";
/**
 * Defining Decorator Functions by Local Cache
 * @param options
 * @constructor
 */
export declare function LocalCache(options?: CacheOptions): MethodDecorator;
/**
 * Defining Decorator Functions by Redis Cache
 * @param options
 * @constructor
 */
export declare function RedisCache(options?: CacheOptions): MethodDecorator;
/**
 * Defining Decorator Functions by Redis Cache
 * @param options
 * @constructor
 */
export declare function HttpCache(options?: CacheOptions): MethodDecorator;
//# sourceMappingURL=cache.decorator.d.ts.map