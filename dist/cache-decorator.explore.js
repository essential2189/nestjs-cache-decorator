"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheDecoratorExplore = void 0;
const common_1 = require("@nestjs/common");
const cron_1 = require("cron");
const core_1 = require("@nestjs/core");
const constant_1 = require("./constant");
/**
 * This module is based on the cache aside pattern.
 * It does not work on the controller. Please use interception for the controller.
 */
let CacheDecoratorExplore = class CacheDecoratorExplore {
    constructor(discoveryService, metadataScanner, reflector, cache) {
        this.discoveryService = discoveryService;
        this.metadataScanner = metadataScanner;
        this.reflector = reflector;
        this.cache = cache;
    }
    /**
     * OnModuleInit is a Lifecycle event in NestJS that is invoked when the host module's dependencies are resolved.
     * Run this method on the OnModuleInit event.
     *
     * https://docs.nestjs.com/fundamentals/lifecycle-events#lifecycle-events
     */
    onModuleInit() {
        this.explore();
    }
    /**
     * Get all singleton instances through getControllers and getProviders.
     * Scan the methods of all Provider instances.
     * Register caching and cron jobs for methods that use the cache decorator.
     *
     * @private
     */
    explore() {
        this.discoveryService.getProviders().forEach((wrapper) => {
            const { instance } = wrapper;
            if (!instance || !Object.getPrototypeOf(instance)) {
                return;
            }
            this.metadataScanner.scanFromPrototype(instance, Object.getPrototypeOf(instance), (methodName) => wrapper.isDependencyTreeStatic()
                ? this.registerCacheAndJob(instance, methodName)
                : console.warn(`Cannot register interval "${wrapper.name}@${methodName}" because it is defined in a non static provider.`));
        });
    }
    /**
     * Find the method used by the cache decorator.
     * Then Executed cache aside pattern by method.
     *
     * @param instance
     * @param methodName
     */
    registerCacheAndJob(instance, methodName) {
        const { cache, reflector } = this;
        const methodRef = instance[methodName];
        if (!methodRef) {
            return;
        }
        const cacheStore = reflector.get(constant_1.CACHE_STORE, methodRef);
        if (!cacheStore || cacheStore !== cache.store?.name) {
            return;
        }
        const metadata = reflector.get(constant_1.CACHE_OPTIONS, methodRef);
        if (!metadata) {
            return;
        }
        const cacheAsideMethod = this.cacheAside(instance, methodName, metadata, methodRef);
        Object.setPrototypeOf(cacheAsideMethod, instance[methodName]);
        instance[methodName] = cacheAsideMethod;
    }
    cacheAside(instance, methodName, options, methodRef) {
        const { cache } = this;
        const { ttl = Infinity, cron, key: customKey, validate = Boolean, logger = () => null, } = options;
        let cacheKeyPrefix = `${instance.constructor.name}:${methodName}`;
        const originMethod = (...args) => methodRef.call(instance, ...args);
        if (cron) {
            this.registerCron(cron, cacheKeyPrefix, originMethod, validate, logger);
        }
        return async (...args) => {
            if (customKey) {
                /**
                 * Key configuration
                 * Default : `{className}:{methodName}:{methodArgs}`
                 * If custom key is defined : `{className}:{methodName}:{customKey}`
                 */
                cacheKeyPrefix += `:${customKey}`;
            }
            else if (args.length) {
                cacheKeyPrefix += `:${JSON.stringify(args)}`;
            }
            const cached = await cache.get(cacheKeyPrefix);
            if (Boolean(cached)) {
                logger("Cache Hit", { cacheKey: cacheKeyPrefix });
                return cached;
            }
            const data = await originMethod(...args);
            if (!validate(data)) {
                throw new Error("cache error");
            }
            await cache.set(cacheKeyPrefix, data, { ttl });
            logger("Cached", { cacheKey: cacheKeyPrefix });
            return data;
        };
    }
    registerCron(cron, cacheKey, job, validate, logger) {
        const { cache } = this;
        const handleTick = async () => {
            const cached = await cache.get(cacheKey);
            const jobData = await job();
            logger({ cacheKey, jobData });
            const refreshedData = validate(jobData) ? jobData : cached;
            await cache.set(cacheKey, refreshedData, {
                ttl: Infinity,
            });
        };
        new cron_1.CronJob(cron, handleTick).start();
        handleTick();
    }
};
CacheDecoratorExplore = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [core_1.DiscoveryService,
        core_1.MetadataScanner,
        core_1.Reflector, Object])
], CacheDecoratorExplore);
exports.CacheDecoratorExplore = CacheDecoratorExplore;
//# sourceMappingURL=cache-decorator.explore.js.map