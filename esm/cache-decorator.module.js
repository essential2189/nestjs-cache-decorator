var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CacheDecoratorModule_1;
import { CacheModule, Module, } from "@nestjs/common";
import { CacheDecoratorExplore } from "./cache-decorator.explore";
import { DiscoveryModule } from "@nestjs/core";
import { ControllerCacheInterceptor } from "./controller-cache.interceptor";
/**
 * This module is based on the cache aside pattern.
 */
let CacheDecoratorModule = CacheDecoratorModule_1 = class CacheDecoratorModule {
    static register(options) {
        return {
            global: true,
            module: CacheDecoratorModule_1,
            providers: [CacheDecoratorExplore, ControllerCacheInterceptor],
            imports: [CacheModule.register(options)],
            exports: [CacheModule.register(options)],
        };
    }
    static registerAsync(options) {
        return {
            global: true,
            module: CacheDecoratorModule_1,
            providers: [CacheDecoratorExplore, ControllerCacheInterceptor],
            imports: [CacheModule.registerAsync(options)],
            exports: [CacheModule.registerAsync(options)],
        };
    }
};
CacheDecoratorModule = CacheDecoratorModule_1 = __decorate([
    Module({ imports: [DiscoveryModule] })
], CacheDecoratorModule);
export { CacheDecoratorModule };
//# sourceMappingURL=cache-decorator.module.js.map