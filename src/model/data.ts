// src/models/transfer.ts
import DataAccessor from "services/data_accessor";
import { API } from "types";

const dataAccessor = new DataAccessor();

type DataItem = API.Models.IDataItem;

export class Data {
  static async where(params: Partial<DataItem>): Promise<DataItem[]> {
    const keys = Object.keys(params) as (keyof DataItem)[];
    let data: DataItem[] = [];

    for (const key of keys) {
      const value = params[key];
      if (value !== undefined) {
        const transfersByField = await dataAccessor.where(key, value);
        data.push(...transfersByField);
      }
    }

    // Remove duplicates based on ID
    data = data.filter(
      (transfer, index, self) =>
        index === self.findIndex((u) => u.id === transfer.id)
    );

    return data;
  }

  static async find(id: number): Promise<DataItem | null> {
    const data = await dataAccessor.find(id);
    return data;
  }

  static async create(title: string): Promise<boolean> {
    try {
      const data = await this.all(); // Fetch all items
      const lastId = data.length > 0 ? data[data.length - 1].id : 0; // Get the last item's ID or default to 0
      const newData: DataItem = { id: lastId + 1, title, votes_amount: 0 };
      await dataAccessor.create(newData);
      return true;
    } catch (error) {
      console.error("Failed to create data item:", error); // Descriptive error logging
      return false; // Only returns false if an error occurs
    }
  }

  static async update(id: number, data: Partial<DataItem>): Promise<void> {
    await dataAccessor.update(id, data);
  }

  static async all(): Promise<DataItem[]> {
    try {
      const data = await dataAccessor.all();
      return data;
    } catch (error) {
      console.error("Failed to fetch all data items:", error);
      return []; // Return an empty array if an error occurs
    }
  }
}
