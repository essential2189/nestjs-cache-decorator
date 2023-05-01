import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { LocalCache, RedisCache } from "../cache.decorator";
import { Cache } from "cache-manager";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @LocalCache({
    ttl: 60,
    key: "PING_LOCAL",
    validate: (value: any) => Boolean(value),
    logger: console.log,
  })
  async pingLocal() {
    return "PONG_LOCAL";
  }

  async pongLocal() {
    return this.cache.get("CacheService:pingLocal:PING_LOCAL");
  }

  @RedisCache({
    ttl: 60,
    key: "PING_REDIS",
    validate: (value: any) => Boolean(value),
    logger: console.log,
  })
  async pingRedis() {
    return "PONG_REDIS";
  }

  async pongRedis() {
    return this.redis.get("CacheService:pingRedis:PING_REDIS");
  }
}
