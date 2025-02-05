import { IDataAccessor } from "types/types";

export class Entity<T> {
  protected dataAccessor: IDataAccessor;
  private cache: Map<string, { data: T[]; timestamp: number }>;
  private cacheTTL: number = 60 * 1000; // Cache Time-To-Live: 60 seconds

  constructor(dataAccessor: IDataAccessor) {
    this.dataAccessor = dataAccessor;
    this.cache = new Map();
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    return cached ? Date.now() - cached.timestamp < this.cacheTTL : false;
  }

  async where(params: Partial<T>): Promise<T[]> {
    try {
      const cacheKey = JSON.stringify(params);
      if (this.isCacheValid(cacheKey)) {
        return this.cache.get(cacheKey)!.data;
      }

      const keys = Object.keys(params) as (keyof T)[];
      let data: T[] = [];

      for (const key of keys) {
        const value = params[key];
        if (value !== undefined) {
          const items = await this.dataAccessor.where(key, value);
          data.push(...items);
        }
      }

      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error("Failed to query data with params:", error);
      return [];
    }
  }

  async find(key: string): Promise<T | null> {
    if (this.isCacheValid(key)) {
      return this.cache.get(key)!.data[0] || null;
    }

    try {
      const data = await this.dataAccessor.find<T>(key);
      if (data) {
        this.cache.set(key, { data: [data], timestamp: Date.now() });
      }
      return data;
    } catch (error) {
      console.error(`Failed to find item with ID ${key}:`, error);
      return null;
    }
  }

  async create(data: T): Promise<void> {
    try {
      await this.dataAccessor.create<T>(data);
      this.cache.clear(); // Clear cache after creating new data
    } catch (error) {
      console.error("Failed to create data item:", error);
      throw error;
    }
  }

  async update(key: string, data: Partial<T>): Promise<void> {
    try {
      await this.dataAccessor.update(key, data);
      this.cache.delete(key); // Invalidate cache for updated item
    } catch (error) {
      console.error(`Failed to update item with ID ${key}:`, error);
      throw error;
    }
  }

  async all(): Promise<T[]> {
    if (this.isCacheValid("all")) {
      return this.cache.get("all")!.data;
    }

    try {
      const data = await this.dataAccessor.all<T>();
      this.cache.set("all", { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error("Failed to fetch all data items:", error);
      return [];
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.dataAccessor.delete(key);
      this.cache.delete(key); // Invalidate cache for deleted item
    } catch (error) {
      console.error(`Failed to delete item with ID ${key}:`, error);
      throw error;
    }
  }

  listen(callback: (data: T[]) => void): void {
    try {
      this.dataAccessor.listen((data) => {
        this.cache.clear(); // Clear cache when data changes

        if (Array.isArray(data)) {
          callback(data as T[]);
        } else {
          console.error("Received invalid data type in listen callback:", data);
        }
      });
    } catch (error) {
      console.error("Failed to listen for data changes:", error);
    }
  }
}
