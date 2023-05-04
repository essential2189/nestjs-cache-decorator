import { CACHE_MANAGER, Controller, Get, Inject } from "@nestjs/common";
import { APICache } from "../cache.decorator";
import { CacheWithStoreName } from "../interfaces/store-name.interface";

@Controller()
export class CacheInterceptorController {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: CacheWithStoreName) {}

  @APICache({
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
