import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { CacheDecoratorModule } from "../cache-decorator.module";
import { CacheService } from "./cache.service";
import redisStore from "cache-manager-redis-store";
import { CacheInterceptorController } from "./cache-interceptor.controller";
import { RedisModule } from "@nestjs-modules/ioredis";
import supertest from "supertest";

describe("Local Cache", function () {
  let app: INestApplication;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        CacheDecoratorModule.register({ store: "memory" }),
        CacheDecoratorModule.register({
          store: redisStore,
        }),
        RedisModule.forRoot({
          config: {},
        }),
      ],
      controllers: [CacheInterceptorController],
      providers: [CacheService],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it("Controller Redis", async () => {
    const requester = supertest(app.getHttpServer());
    await requester.get("/redis/ping").expect(200).expect("PONG");
    await requester.get("/redis/pong").expect(200).expect('"PONG"');
  });

  it("Controller Local", async () => {
    const requester = supertest(app.getHttpServer());
    await requester.get("/local/ping").expect(200).expect("PONG");
    await requester.get("/local/pong").expect(200).expect("PONG");
  });

  it("Check Local Caching", async () => {
    const cacheService = moduleRef.get<CacheService>(CacheService);

    await cacheService.pingLocal();
    const result = await cacheService.pongLocal();
    expect(result).toBe("PONG_LOCAL");
  });

  it("Check Redis Caching", async () => {
    const cacheService = moduleRef.get<CacheService>(CacheService);

    await cacheService.pingRedis();
    const result = await cacheService.pongRedis();
    expect(result).toBe('"PONG_REDIS"');
  });

  afterAll(() => app.close());
});
