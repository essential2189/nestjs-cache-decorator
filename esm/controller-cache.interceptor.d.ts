import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { HttpAdapterHost, Reflector } from "@nestjs/core";
import { CacheWithStoreName } from "./interfaces/store-name.interface";
export declare class ControllerCacheInterceptor implements NestInterceptor {
    private readonly cache;
    private readonly httpAdapterHost;
    private readonly reflector;
    private allowedMethods;
    private readonly cacheManagerIsv5OrGreater;
    constructor(cache: CacheWithStoreName, httpAdapterHost: HttpAdapterHost, reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>>;
    protected trackBy(context: ExecutionContext): string | undefined;
    protected isRequestCacheable(context: ExecutionContext): boolean;
}
//# sourceMappingURL=controller-cache.interceptor.d.ts.map