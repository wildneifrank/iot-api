import DataAccessor from "services/data_accessor";
import { db } from "database/db";
import { IDataAccessor, IDog } from "types/types";
import { DataPaths } from "types/enums";

const dataAccessor: IDataAccessor = new DataAccessor(db, DataPaths.DOGS);

export class Dog<T = any> {
  static async where<T extends Record<string, any>>(
    params: Partial<T>
  ): Promise<T[]> {
    const keys = Object.keys(params) as (keyof T)[];
    let data: T[] = [];

    for (const key of keys) {
      const value = params[key];
      if (value !== undefined) {
        const items = await dataAccessor.where(key, value);
        data.push(...items);
      }
    }
    return data;
  }

  static async find<T>(key: string): Promise<T | null> {
    return await dataAccessor.find<T>(key);
  }

  static async create<T extends IDog>(data: T): Promise<boolean> {
    try {
      await dataAccessor.create<IDog>(data);
      return true;
    } catch (error) {
      console.error("Failed to create data item:", error);
      return false;
    }
  }

  static async update<T>(key: string, data: Partial<T>): Promise<void> {
    try {
      await dataAccessor.update(key, data);
    } catch (error) {
      console.error(`Failed to update item with ID ${key}:`, error);
      throw error;
    }
  }

  static async all<T>(): Promise<T[]> {
    try {
      return await dataAccessor.all<T>();
    } catch (error) {
      console.error("Failed to fetch all data items:", error);
      return [];
    }
  }

  static async delete<T extends string>(key: T): Promise<boolean> {
    try {
      await dataAccessor.delete(key);
      return true;
    } catch (error) {
      console.error(`Failed to delete item with ID ${key}:`, error);
      return false;
    }
  }

  static listen<T>(callback: (data: T[]) => void): void {
    try {
      dataAccessor.listen(callback);
    } catch (error) {
      console.error("Failed to listen for data changes:", error);
    }
  }
}
