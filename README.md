<!-- PROJECT LOGO -->
<br />
<div align="center">
<h2>nestjs-cache-decorator</h2>

  <p align="center">
    NestJS Cache Decorator
    <br>
    A custom decorator is implemented in Nestjs to provide convenience for caching, called the 'cache decorator'.
  </p>
</div>

<br>

<!-- TABLE OF CONTENTS -->

## Table of Contents

<ol>
  <li><a href="#installation">Installation</a></li>
  <li><a href="#configuration">Configuration</a></li>
  <li><a href="#usage-controller">Usage (Controller)</a></li>
  <li><a href="#usage-provider">Usage (Provider)</a></li>
  <li><a href="#license">License</a></li>
</ol>

<!-- INSTALLATION -->

## Installation

```sh
npm install nestjs-cache-decorator

pnpm install nestjs-cache-decorator
```

## Configuration

### Static redis cache configuration

```typescript
import {Module} from "@nestjs/common";
import {LocalCacheDecoratorModule} from "nestjs-cache-decorator";
import redisStore from "cache-manager-redis-store";

@Module({
    imports: [
        CacheDecoratorModule.register({
            host: "host",
            port: 6379,
            password: "password",
            db: 0,
            store: redisStore,
        }),
    ],
})
export class AppModule {
}
```

### Static local cache configuration

```typescript
import {Module} from "@nestjs/common";
import {LocalCacheDecoratorModule} from "nestjs-cache-decorator";

@Module({
    imports: [
        CacheDecoratorModule.register({}), // default `store: "memory"`
    ],
})
export class AppModule {
}
```

### Async redis cache configuration

```typescript
import {Module} from "@nestjs/common";
import {LocalCacheDecoratorModule} from "nestjs-cache-decorator";
import redisStore from "cache-manager-redis-store";

@Module({
    imports: [
        CacheDecoratorModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService): Promise<CacheModuleOptions> => {
                const config = configService.get("redis");
                return {...config, store: redisStore};
            },
        }),
    ],
})
export class AppModule {
}
```

## Usage (Controller)

If the `key` field is empty, the default cache key will be **HTTP URL Path** where `/` is replaced to `:`. If the `key`
field
exists, the cache key will be `{http url path}:{http url path}:...:{key}`.

Use the `validate` filed function to verify the result of the method.

The `logger` creates a log when data is cached or when there is a cache hit. When the `logger` is set to `console.log`,
the output will be as follows:

- When data is cached : `Cached { cacheKey: 'example:redis' }`
- When cache hit : `Cache Hit { cacheKey: 'example:redis' }`

```typescript
@Controller("example")
@UseInterceptors(ControllerCacheInterceptor)
export class ExampleController {

    @RedisCache({
        ttl: 60,
        validate: (value: any) => Boolean(value),
        logger: console.log,
    })
    @Get("redis")
    async example() {
    }
}
```

## Usage (Provider)

If the `key` field is empty, the default cache key will be `{className}:{methodName}:{methodArgs}`. If the `key` field
exists, the cache key will be `{className}:{methodName}:{key}`.

Use the `validate` filed function to verify the result of the method.

The `logger` creates a log when data is cached or when there is a cache hit. When the `logger` is set to `console.log`,
the output will be as follows:

- When data is cached : `Cached { cacheKey: 'ExampleService:cacheExample:test' }`
- When cache hit : `Cache Hit { cacheKey: 'ExampleService:cacheExample:test' }`

### Cache by TTL

Caching takes place when the function `cacheExample()` is called and the result is not already cached.

The cache will expire after the TTL (Time To Live) duration.

```typescript
@Injectable()
export class ExampleService {

    @RedisCache({
        ttl: 60,        // expire after 60s
        key: "test",   // cache key : `ExampleService:cacheExample:test`
        validate: (value: any) => Boolean(value),
        logger: console.log,
    })
    redisCacheExample() {
    }

    @LocalCache({
        ttl: 60,        // expire after 60s
        key: "test",   // cache key : `ExampleService:cacheExample:test`
        validate: (value: any) => Boolean(value),
        logger: console.log,
    })
    localCacheExample() {
    }
}
```

### Cache by Cron

For the example below, `cacheExample()` method will be called each time the current second is 45. In other words, the
method will be run once per minute, at the 45 second mark.

The `cron` field supports all standard [cron patterns](http://crontab.org/):

- Asterisk (e.g. *)
- Ranges (e.g. 1-3,5)
- Steps (e.g. */2)

```typescript
@Injectable()
export class ExampleService {

    @RedisCache({
        cron: "45 * * * * *",   // The method is executed every 45 second, and the result is cached.
        key: "test",
        validate: (value: any) => Boolean(value),
        logger: console.log,
    })
    redisCacheExample() {
    }

    @LocalCache({
        cron: "45 * * * * *",   // The method is executed every 45 second, and the result is cached.
        key: "test",
        validate: (value: any) => Boolean(value),
        logger: console.log,
    })
    localCacheExample() {
    }
}
```

In the example above, we passed `45 * * * * *` to the decorator. The following key shows how each position in the cron
pattern string is interpreted:

```typescript
* * * * * *
| | | | | |
| | | | |
day
of
week
| | | | months
| | | day
of
month
| | hours
| minutes
seconds(optional)
```

### Decorator options

```typescript
export interface CacheOptions {
    cron?: string;

    key?: string;

    ttl?: number;

    validate?: Function;

    logger?: Function;
}
```


