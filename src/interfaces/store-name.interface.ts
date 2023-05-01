import { Cache, Store } from "cache-manager";

/**
 * Definition cache store naame
 */
export interface CacheWithStoreName extends Cache {
  store: StoreWithName;
}

interface StoreWithName extends Store {
  name?: string;
}
