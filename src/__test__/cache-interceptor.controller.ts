import { CACHE_MANAGER, Controller, Get, Inject, UseInterceptors } from "@nestjs/common";
import { ControllerCacheInterceptor } from "../controller-cache.interceptor";
import { LocalCache, RedisCache } from "../cache.decorator";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";
import { CacheWithStoreName } from "../interfaces/store-name.interface";

@Controller()
@UseInterceptors(ControllerCacheInterceptor)
export class CacheInterceptorController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: CacheWithStoreName,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @RedisCache({
    ttl: 60,
    validate: (value: any) => Boolean(value),
    logger: console.log,
  })
  @Get("redis/ping")
  async pingRedis() {
    return "PONG";
  }

  @Get("redis/pong")
  async pongRedis() {
    return this.redis.get("cache:redis:ping");
  }

  @LocalCache({
    ttl: 60,
    validate: (value: any) => Boolean(value),
    logger: console.log,
  })
  @Get("local/ping")
  async pingLocal() {
    return "PONG";
  }

  @Get("local/pong")
  async pongLocal() {
    return this.cache.get("cache:local:ping");
  }
}
