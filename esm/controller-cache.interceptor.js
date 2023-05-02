var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { CACHE_MANAGER, Inject, Injectable, Logger, StreamableFile, } from "@nestjs/common";
import { of, tap } from "rxjs";
import { CACHE_OPTIONS, CACHE_STORE } from "./constant";
import { isNil } from "@nestjs/common/utils/shared.utils";
import { HttpAdapterHost, Reflector } from "@nestjs/core";
import { loadPackage } from "@nestjs/common/utils/load-package.util";
let ControllerCacheInterceptor = class ControllerCacheInterceptor {
    constructor(cache, httpAdapterHost, reflector) {
        this.cache = cache;
        this.httpAdapterHost = httpAdapterHost;
        this.reflector = reflector;
        this.allowedMethods = ["GET"];
        // We need to check if the cache-manager package is v5 or greater
        // because the set method signature changed in v5
        const cacheManagerPackage = loadPackage("cache-manager", "CacheModule", () => require("cache-manager"));
        this.cacheManagerIsv5OrGreater = "memoryStore" in cacheManagerPackage;
        Logger.warn('DEPRECATED! "CacheModule" (from the "@nestjs/common" package) is deprecated and will be removed in the next major release. Please, use the "@nestjs/cache-manager" package instead.');
    }
    async intercept(context, next) {
        const options = this.reflector.get(CACHE_OPTIONS, context.getHandler());
        if (!options) {
            return next.handle();
        }
        const cacheStore = this.reflector.get(CACHE_STORE, context.getHandler());
        if (!cacheStore || cacheStore !== this.cache.store?.name) {
            return next.handle();
        }
        const { ttl = Infinity, key: customKey, validate = Boolean, logger = () => null } = options;
        let cacheKey = `cache${this.trackBy(context)?.replaceAll("/", ":")}`;
        if (customKey) {
            cacheKey += `:${customKey}`;
        }
        try {
            const value = await this.cache.get(cacheKey);
            if (!isNil(value)) {
                logger("Cache Hit", { cacheKey });
                return of(value);
            }
            return next.handle().pipe(tap(async (response) => {
                if (response instanceof StreamableFile) {
                    return;
                }
                if (!validate(response)) {
                    throw new Error("cache error");
                }
                const cacheArgs = [cacheKey, response];
                if (!isNil(ttl)) {
                    cacheArgs.push(this.cacheManagerIsv5OrGreater ? ttl : { ttl });
                }
                try {
                    await this.cache.set(...cacheArgs);
                    logger("Cached", { cacheKey });
                }
                catch (err) {
                    Logger.error(`An error has occurred when inserting "key: ${cacheKey}", "value: ${response}"`, "CacheInterceptor");
                }
            }));
        }
        catch {
            return next.handle();
        }
    }
    trackBy(context) {
        const httpAdapter = this.httpAdapterHost.httpAdapter;
        const request = context.getArgByIndex(0);
        if (!this.isRequestCacheable(context)) {
            return undefined;
        }
        return httpAdapter.getRequestUrl(request);
    }
    isRequestCacheable(context) {
        const req = context.switchToHttp().getRequest();
        return this.allowedMethods.includes(req.method);
    }
};
ControllerCacheInterceptor = __decorate([
    Injectable(),
    __param(0, Inject(CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, HttpAdapterHost,
        Reflector])
], ControllerCacheInterceptor);
export { ControllerCacheInterceptor };
//# sourceMappingURL=controller-cache.interceptor.js.map