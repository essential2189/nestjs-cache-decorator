import {
  CACHE_KEY_METADATA,
  CACHE_MANAGER,
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
  StreamableFile,
} from "@nestjs/common";
import { Observable, of, tap } from "rxjs";
import { CACHE_OPTIONS, CACHE_STORE } from "./constant";
import { CacheOptions } from "./interfaces";
import { isNil } from "@nestjs/common/utils/shared.utils";
import { HttpAdapterHost, Reflector } from "@nestjs/core";
import { loadPackage } from "@nestjs/common/utils/load-package.util";
import { CacheWithStoreName } from "./interfaces/store-name.interface";

@Injectable()
export class ControllerCacheInterceptor implements NestInterceptor {
  private allowedMethods = ["GET"];
  private readonly cacheManagerIsv5OrGreater: boolean;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: CacheWithStoreName,
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly reflector: Reflector,
  ) {
    // We need to check if the cache-manager package is v5 or greater
    // because the set method signature changed in v5
    const cacheManagerPackage = loadPackage("cache-manager", "CacheModule", () =>
      require("cache-manager"),
    );
    this.cacheManagerIsv5OrGreater = "memoryStore" in cacheManagerPackage;

    Logger.warn(
      'DEPRECATED! "CacheModule" (from the "@nestjs/common" package) is deprecated and will be removed in the next major release. Please, use the "@nestjs/cache-manager" package instead.',
    );
  }

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const options: CacheOptions = this.reflector.get(CACHE_OPTIONS, context.getHandler());
    if (!options) {
      return next.handle();
    }
    const cacheStore: string = this.reflector.get(CACHE_STORE, context.getHandler());

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

      return next.handle().pipe(
        tap(async (response) => {
          if (response instanceof StreamableFile) {
            return;
          }

          if (!validate(response)) {
            throw new Error("cache error");
          }

          const cacheArgs = [cacheKey, response] as [string, any];
          if (!isNil(ttl)) {
            cacheArgs.push(this.cacheManagerIsv5OrGreater ? ttl : { ttl });
          }

          try {
            await this.cache.set(...cacheArgs);
            logger("Cached", { cacheKey });
          } catch (err) {
            Logger.error(
              `An error has occurred when inserting "key: ${cacheKey}", "value: ${response}"`,
              "CacheInterceptor",
            );
          }
        }),
      );
    } catch {
      return next.handle();
    }
  }

  protected trackBy(context: ExecutionContext): string | undefined {
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    const isHttpApp = httpAdapter && !!httpAdapter.getRequestMethod;
    const cacheMetadata = this.reflector.get(CACHE_KEY_METADATA, context.getHandler());

    if (!isHttpApp || cacheMetadata) {
      return cacheMetadata;
    }

    const request = context.getArgByIndex(0);
    if (!this.isRequestCacheable(context)) {
      return undefined;
    }
    return httpAdapter.getRequestUrl(request);
  }

  protected isRequestCacheable(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    return this.allowedMethods.includes(req.method);
  }
}
