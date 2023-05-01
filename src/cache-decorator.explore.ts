import { CACHE_MANAGER, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { CronJob } from "cron";
import { CacheOptions } from "./interfaces";
import { DiscoveryService, MetadataScanner, Reflector } from "@nestjs/core";
import { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";
import { CACHE_OPTIONS, CACHE_STORE } from "./constant";
import { CacheWithStoreName } from "./interfaces/store-name.interface";

/**
 * This module is based on the cache aside pattern.
 * It does not work on the controller. Please use interception for the controller.
 */
@Injectable()
export class CacheDecoratorExplore implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) readonly cache: CacheWithStoreName,
  ) {}

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
    this.discoveryService.getProviders().forEach((wrapper: InstanceWrapper) => {
      const { instance } = wrapper;
      if (!instance || !Object.getPrototypeOf(instance)) {
        return;
      }
      this.metadataScanner.scanFromPrototype(
        instance,
        Object.getPrototypeOf(instance),
        (methodName: string) =>
          wrapper.isDependencyTreeStatic()
            ? this.registerCacheAndJob(instance, methodName)
            : console.warn(
                `Cannot register interval "${wrapper.name}@${methodName}" because it is defined in a non static provider.`,
              ),
      );
    });
  }

  /**
   * Find the method used by the cache decorator.
   * Then Executed cache aside pattern by method.
   *
   * @param instance
   * @param methodName
   */
  registerCacheAndJob(instance: Record<string, Function>, methodName: string) {
    const { cache, reflector } = this;

    const methodRef = instance[methodName];
    if (!methodRef) {
      return;
    }
    const cacheStore: string = reflector.get(CACHE_STORE, methodRef);
    if (!cacheStore || cacheStore !== cache.store?.name) {
      return;
    }
    const metadata: CacheOptions = reflector.get(CACHE_OPTIONS, methodRef);
    if (!metadata) {
      return;
    }

    const cacheAsideMethod = this.cacheAside(instance, methodName, metadata, methodRef);

    Object.setPrototypeOf(cacheAsideMethod, instance[methodName]);
    instance[methodName] = cacheAsideMethod;
  }

  private cacheAside(
    instance: Record<string, Function>,
    methodName: string,
    options: CacheOptions,
    methodRef: Function,
  ) {
    const { cache } = this;

    const {
      ttl = Infinity,
      cron,
      key: customKey,
      validate = Boolean,
      logger = () => null,
    } = options;

    let cacheKeyPrefix = `${instance.constructor.name}:${methodName}`;

    const originMethod = (...args: unknown[]) => methodRef.call(instance, ...args);

    if (cron) {
      this.registerCron(cron, cacheKeyPrefix, originMethod, validate, logger);
    }

    return async (...args: unknown[]) => {
      if (customKey) {
        /**
         * Key configuration
         * Default : `{className}:{methodName}:{methodArgs}`
         * If custom key is defined : `{className}:{methodName}:{customKey}`
         */
        cacheKeyPrefix += `:${customKey}`;
      } else if (args.length) {
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

  registerCron(
    cron: string,
    cacheKey: string,
    job: Function,
    validate: Function,
    logger: Function,
  ) {
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

    new CronJob(cron, handleTick).start();
    handleTick();
  }
}
