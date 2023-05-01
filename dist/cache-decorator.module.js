"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CacheDecoratorModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheDecoratorModule = void 0;
const common_1 = require("@nestjs/common");
const cache_decorator_explore_1 = require("./cache-decorator.explore");
const core_1 = require("@nestjs/core");
const controller_cache_interceptor_1 = require("./controller-cache.interceptor");
/**
 * This module is based on the cache aside pattern.
 */
let CacheDecoratorModule = CacheDecoratorModule_1 = class CacheDecoratorModule {
    static register(options) {
        return {
            global: true,
            module: CacheDecoratorModule_1,
            providers: [cache_decorator_explore_1.CacheDecoratorExplore, controller_cache_interceptor_1.ControllerCacheInterceptor],
            imports: [common_1.CacheModule.register(options)],
            exports: [common_1.CacheModule.register(options)],
        };
    }
    static registerAsync(options) {
        return {
            global: true,
            module: CacheDecoratorModule_1,
            providers: [cache_decorator_explore_1.CacheDecoratorExplore, controller_cache_interceptor_1.ControllerCacheInterceptor],
            imports: [common_1.CacheModule.registerAsync(options)],
            exports: [common_1.CacheModule.registerAsync(options)],
        };
    }
};
CacheDecoratorModule = CacheDecoratorModule_1 = __decorate([
    (0, common_1.Module)({ imports: [core_1.DiscoveryModule] })
], CacheDecoratorModule);
exports.CacheDecoratorModule = CacheDecoratorModule;
//# sourceMappingURL=cache-decorator.module.js.map