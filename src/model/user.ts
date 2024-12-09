import DataAccessor from "services/data_accessor";
import { db } from "database/db";
import { IDataAccessor, IUser } from "types/types";
import { DataPaths } from "types/enums";

const dataAccessor: IDataAccessor = new DataAccessor(db, DataPaths.USER);

export class User<T = any> {
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

    // Remove duplicates based on ID if an `id` field exists
    data = data.filter(
      (item, index, self) =>
        !("id" in item) || // Ensure 'id' exists in the item
        index === self.findIndex((u) => "id" in u && u.id === item.id)
    );

    return data;
  }

  static async find<T>(id: number): Promise<T | null> {
    return await dataAccessor.find<T>(id);
  }

  static async create<T extends IUser>(data: T): Promise<boolean> {
    try {
      data.id = await this.getIndex();
      await dataAccessor.create(data);
      return true;
    } catch (error) {
      console.error("Failed to create data item:", error);
      return false;
    }
  }

  static async update<T>(id: number, data: Partial<T>): Promise<void> {
    try {
      await dataAccessor.update(id, data);
    } catch (error) {
      console.error(`Failed to update item with ID ${id}:`, error);
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

  static async delete<T extends number>(id: T): Promise<boolean> {
    try {
      await dataAccessor.delete(id);
      return true;
    } catch (error) {
      console.error(`Failed to delete item with ID ${id}:`, error);
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

  static async getIndex(): Promise<number> {
    try {
      // Fetch all users
      const users = await dataAccessor.all<IUser>();

      // Find the highest id
      const lastIndex = users.reduce(
        (max, user) => (user.id > max ? user.id : max),
        0
      );

      return lastIndex + 1;
    } catch (error) {
      console.error("Failed to retrieve the last index:", error);
      throw error;
    }
  }
}
