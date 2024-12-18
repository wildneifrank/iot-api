import { IDataAccessor } from "types/types";

export class Entity<T> {
  protected dataAccessor: IDataAccessor;

  constructor(dataAccessor: IDataAccessor) {
    this.dataAccessor = dataAccessor;
  }

  async where(params: Partial<T>): Promise<T[]> {
    try {
      const keys = Object.keys(params) as (keyof T)[];
      let data: T[] = [];

      for (const key of keys) {
        const value = params[key];
        if (value !== undefined) {
          const items = await this.dataAccessor.where(key, value);
          data.push(...items);
        }
      }

      return data;
    } catch (error) {
      console.error("Failed to query data with params:", error);
      return [];
    }
  }

  async find(key: string): Promise<T | null> {
    try {
      return await this.dataAccessor.find<T>(key);
    } catch (error) {
      console.error(`Failed to find item with ID ${key}:`, error);
      return null;
    }
  }

  async create(data: T): Promise<void> {
    try {
      await this.dataAccessor.create<T>(data);
    } catch (error) {
      console.error("Failed to create data item:", error);
      throw error;
    }
  }

  async update(key: string, data: Partial<T>): Promise<void> {
    try {
      await this.dataAccessor.update(key, data);
    } catch (error) {
      console.error(`Failed to update item with ID ${key}:`, error);
      throw error;
    }
  }

  async all(): Promise<T[]> {
    try {
      return await this.dataAccessor.all<T>();
    } catch (error) {
      console.error("Failed to fetch all data items:", error);
      return [];
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.dataAccessor.delete(key);
    } catch (error) {
      console.error(`Failed to delete item with ID ${key}:`, error);
      throw error;
    }
  }

  listen(callback: (data: T[]) => void): void {
    try {
      this.dataAccessor.listen(callback);
    } catch (error) {
      console.error("Failed to listen for data changes:", error);
    }
  }
}
