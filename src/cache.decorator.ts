import { applyDecorators, SetMetadata } from "@nestjs/common";
import { CACHE_OPTIONS, CACHE_STORE } from "./constant";
import { CacheOptions } from "./interfaces";

/**
 * Defining Decorator Functions by Local Cache
 * @param options
 * @constructor
 */
export function LocalCache(options: CacheOptions = {}): MethodDecorator {
  return applyDecorators(SetMetadata(CACHE_OPTIONS, options), SetMetadata(CACHE_STORE, "memory"));
}

/**
 * Defining Decorator Functions by Redis Cache
 * @param options
 * @constructor
 */
export function RedisCache(options: CacheOptions = {}): MethodDecorator {
  return applyDecorators(SetMetadata(CACHE_OPTIONS, options), SetMetadata(CACHE_STORE, "redis"));
}
