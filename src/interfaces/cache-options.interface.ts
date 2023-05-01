/**
 * Definition cache decorator options
 */
export interface CacheOptions {
  cron?: string;

  key?: string;

  ttl?: number;

  validate?: Function;

  logger?: Function;
}
