import { CacheModuleAsyncOptions, CacheModuleOptions, DynamicModule } from "@nestjs/common";
/**
 * This module is based on the cache aside pattern.
 */
export declare class CacheDecoratorModule {
    static register(options: CacheModuleOptions): DynamicModule;
    static registerAsync(options: CacheModuleAsyncOptions): DynamicModule;
}
//# sourceMappingURL=cache-decorator.module.d.ts.map