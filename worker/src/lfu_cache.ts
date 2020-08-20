interface CacheEntry<T> {
  ttl?: number;
  hits: number;
  expiresAt?: Date;
  value: T;
  key: string;
  size: number;
  createdAt: number;
}

interface CacheGetOptions {
  returnExpired?: boolean;
  incrementHits?: boolean;
}

interface CacheSetOptions {
  ttl?: number;
  expiresAt?: Date;
  size?: number;
}

export class LFUCache<T> {
  private store = new Map<string, CacheEntry<T>>();
  private _maxSize = 0;
  private _currentSize = 0;

  private expiresList: CacheEntry<T>[] = [];
  private isExpiresDirty = false;

  private hitsList: CacheEntry<T>[] = [];
  private isHitsDirty = false;

  private sweepRunning = false;
  private lastSweep = 0;

  public constructor(maxSize?: number) {
    if (maxSize) {
      this._maxSize = maxSize;
    }
  }
  public get count() {
    return this.store.size;
  }
  public get size() {
    return this._currentSize;
  }
  public get maxSize() {
    return this._maxSize;
  }

  public keys() {
    this.store.keys();
  }
  public set(key: string, value: T, ttl?: number): void;
  public set(key: string, value: T, opts?: CacheSetOptions): void;
  public set(
    key: string,
    value: T,
    ttlOrOpts?: number | CacheSetOptions,
  ): void {
    let opts: CacheSetOptions;
    if (typeof ttlOrOpts === "number") {
      opts = { ttl: ttlOrOpts };
    } else if (typeof ttlOrOpts === "object") {
      opts = ttlOrOpts;
    } else {
      opts = {};
    }

    let expiresAt = opts.expiresAt;
    let ttl = opts.ttl;
    let size = opts.size || 1;

    if (!expiresAt && ttl && ttl > 0) {
      expiresAt = new Date(new Date().getTime() + ttl * 1000);
    }
    const e: CacheEntry<T> = {
      hits: 0,
      value,
      expiresAt,
      ttl,
      key,
      size,
      createdAt: new Date().getTime(),
    };
    const old = this.store.get(key);
    this.store.set(key, e);
    if (old) {
      this._currentSize -= old.size;
    }

    if (this._currentSize + e.size > this._maxSize) {
      this.purge(e.size);
    }
    this._currentSize += e.size;
    if (expiresAt) {
      this.expiresList.push(e);
    }
    this.hitsList.push(e);
    this.isExpiresDirty = true;
    this.maybeSweep();
  }

  public get(key: string): T | undefined {
    const e = this.getEntry(key, { returnExpired: true, incrementHits: true });
    this.maybeSweep();
    if (e) {
      if (e.expiresAt && e.expiresAt >= new Date()) {
        this.delete(key);
        return undefined;
      }
      return e.value;
    }
    return undefined;
  }

  public delete(key: string): T | undefined {
    const e = this.getEntry(key, { returnExpired: true, incrementHits: false });
    this.maybeSweep();
    if (e) {
      e.expiresAt = new Date(0); // cleanup expiresList on next pass
      this.store.delete(key);
      this._currentSize -= e.size;
      return e.value;
    }
    return undefined;
  }

  public getEntry(
    key: string,
    opts?: CacheGetOptions,
  ): CacheEntry<T> | undefined {
    let e = this.store.get(key);

    if (e) {
      if (opts?.incrementHits !== false) {
        e.hits += 1;
        if (e.hits % 10 === 0) {
          this.isHitsDirty = true;
        }
      }
      if (e.expiresAt && e.expiresAt <= new Date()) {
        if (!opts?.returnExpired) { // value has expired
          e = undefined;
          this.store.delete(key);
        }
      }
    }
    return e;
  }

  private maybeSweep(): void {
    const t = new Date().getTime();
    if (this.lastSweep < t - 1) {
      setTimeout(this.sweep.bind(this), 0);
    }
  }
  public sweep(): number {
    if (this.sweepRunning) {
      console.warn("Cache sweep is already running, skipping");
    }
    this.isExpiresDirty = false;
    if (this.isExpiresDirty) {
      this.expiresList.sort(compareEntryExpires);
      this.isExpiresDirty = true;
    }

    const d = new Date();
    let cutoff = 0;
    let deleteCount = 0;

    for (let i = 0; i < this.expiresList.length; i++) {
      const e = this.expiresList[i];
      const expiresAt = e.expiresAt || new Date(0);
      if (expiresAt < d) {
        cutoff = i;
        const current = this.store.get(e.key);
        if (current && current === e) {
          this.store.delete(e.key);
          deleteCount += 1;
        }
      } else {
        break;
      }
    }
    if (cutoff > 0) {
      // only keep unexpired
      this.expiresList = this.expiresList.slice(cutoff);
    }
    return deleteCount;
  }

  public purge(size: number): number {
    if (this.isHitsDirty) {
      this.hitsList.sort(compareEntryHits);
      this.isHitsDirty = false;
    }

    let cutoff = 0;
    let deleteCount = 0;
    for (let i = 0; i < this.hitsList.length; i++) {
      let free = this.maxSize - this.size;
      if (free >= size) {
        break;
      }
      const e = this.hitsList[i];
      const current = this.store.get(e.key);
      if (current && current === e) {
        this.delete(e.key);
        deleteCount += 1;
      }
      cutoff = i;
    }
    if (cutoff > 0) {
      this.hitsList = this.hitsList.slice(cutoff);
    }
    return deleteCount;
  }
}

function compareEntryExpires(x: { expiresAt?: Date }, y: { expiresAt?: Date }) {
  if (x.expiresAt === y.expiresAt) {
    return 0;
  }

  // y == undefined
  if (x.expiresAt && !y.expiresAt) {
    return -1;
  }

  // x == undefined
  if (!x.expiresAt && y.expiresAt) {
    return 1;
  }

  // x < y
  if (x.expiresAt && y.expiresAt && (x.expiresAt < y.expiresAt)) {
    return -1;
  }

  // x > y
  return 1;
}

function compareEntryHits(
  x: { hits: number; createdAt: number },
  y: { hits: number; createdAt: number },
) {
  const t = new Date().getTime();
  const x1 = x.hits / (t - x.createdAt);
  const y1 = y.hits / (t - y.createdAt);
  if (x1 === y1) {
    return 0;
  }
  if (x1 < y1) {
    return -1;
  }
  return 1;
}
