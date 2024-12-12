import DataAccessor from "services/data_accessor";
import { db } from "database/db";
import { IDataAccessor, IUser } from "types/types";
import { DataPaths } from "types/enums";

const dataAccessor: IDataAccessor = new DataAccessor(db, DataPaths.USERS);

export class User<T = any> {
  static async where<T extends Record<string, any>>(
    params: Partial<T>
  ): Promise<T[]> {
    try {
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
    } catch (error) {
      return [];
    }
  }

  static async find<T>(key: string): Promise<T | null> {
    return await dataAccessor.find<T>(key);
  }

  static async create<T extends IUser>(data: T): Promise<void> {
    try {
      await dataAccessor.create<IUser>(data);
      return;
    } catch (error) {
      throw error;
    }
  }

  static async update<T extends IUser>(
    key: string,
    data: Partial<T>
  ): Promise<void> {
    try {
      if (Object.keys(data).length === 0) {
        throw new Error("No data provided for update");
      }

      await dataAccessor.update(key, data);
      console.log(`User with key ${key} updated successfully.`);
      return;
    } catch (error) {
      throw error;
    }
  }

  static async all<T>(): Promise<T[]> {
    try {
      return await dataAccessor.all<T>();
    } catch (error) {
      return [];
    }
  }

  static async delete<T extends string>(key: T): Promise<void> {
    try {
      await dataAccessor.delete(key);
      return;
    } catch (error) {
      throw error;
    }
  }

  static async key(email: string): Promise<string | null> {
    try {
      const userKey = await dataAccessor.getKey<IUser>("email", email);
      return userKey;
    } catch (error) {
      return null;
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
