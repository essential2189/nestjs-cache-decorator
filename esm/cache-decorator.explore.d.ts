import { OnModuleInit } from "@nestjs/common";
import { DiscoveryService, MetadataScanner, Reflector } from "@nestjs/core";
import { CacheWithStoreName } from "./interfaces/store-name.interface";
/**
 * This module is based on the cache aside pattern.
 * It does not work on the controller. Please use interception for the controller.
 */
export declare class CacheDecoratorExplore implements OnModuleInit {
    private readonly discoveryService;
    private readonly metadataScanner;
    private readonly reflector;
    readonly cache: CacheWithStoreName;
    constructor(discoveryService: DiscoveryService, metadataScanner: MetadataScanner, reflector: Reflector, cache: CacheWithStoreName);
    /**
     * OnModuleInit is a Lifecycle event in NestJS that is invoked when the host module's dependencies are resolved.
     * Run this method on the OnModuleInit event.
     *
     * https://docs.nestjs.com/fundamentals/lifecycle-events#lifecycle-events
     */
    onModuleInit(): void;
    /**
     * Get all singleton instances through getControllers and getProviders.
     * Scan the methods of all Provider instances.
     * Register caching and cron jobs for methods that use the cache decorator.
     *
     * @private
     */
    explore(): void;
    /**
     * Find the method used by the cache decorator.
     * Then Executed cache aside pattern by method.
     *
     * @param instance
     * @param methodName
     */
    registerCacheAndJob(instance: Record<string, Function>, methodName: string): void;
    private cacheAside;
    registerCron(cron: string, cacheKey: string, job: Function, validate: Function, logger: Function): void;
}
//# sourceMappingURL=cache-decorator.explore.d.ts.map