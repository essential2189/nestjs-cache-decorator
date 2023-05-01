import {
  CacheModule,
  CacheModuleAsyncOptions,
  CacheModuleOptions,
  DynamicModule,
  Module,
} from "@nestjs/common";
import { CacheDecoratorExplore } from "./cache-decorator.explore";
import { DiscoveryModule } from "@nestjs/core";
import { ControllerCacheInterceptor } from "./controller-cache.interceptor";

/**
 * This module is based on the cache aside pattern.
 */
@Module({ imports: [DiscoveryModule] })
export class CacheDecoratorModule {
  static register(options: CacheModuleOptions): DynamicModule {
    return {
      global: true,
      module: CacheDecoratorModule,
      providers: [CacheDecoratorExplore, ControllerCacheInterceptor],
      imports: [CacheModule.register(options)],
      exports: [CacheModule.register(options)],
    };
  }

  static registerAsync(options: CacheModuleAsyncOptions): DynamicModule {
    return {
      global: true,
      module: CacheDecoratorModule,
      providers: [CacheDecoratorExplore, ControllerCacheInterceptor],
      imports: [CacheModule.registerAsync(options)],
      exports: [CacheModule.registerAsync(options)],
    };
  }
}
