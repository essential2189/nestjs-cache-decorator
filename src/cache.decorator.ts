import { applyDecorators, SetMetadata, UseInterceptors } from "@nestjs/common";
import { CACHE_OPTIONS, CACHE_STORE } from "./constant";
import { CacheOptions } from "./interfaces";
import { ControllerCacheInterceptor } from "./controller-cache.interceptor";

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

/**
 * Defining Decorator Functions by Redis Cache
 * @param options
 * @constructor
 */
export function APICache(options: CacheOptions = {}): MethodDecorator {
  return applyDecorators(
    UseInterceptors(ControllerCacheInterceptor),
    SetMetadata(CACHE_OPTIONS, options),
  );
}
