import admin from "firebase-admin";
import { API } from "types";
import { DbInstance, IDataAccessor } from "types/types";

class DataAccessor implements IDataAccessor {
  private db: DbInstance;
  private refPath: string;

  constructor(dbInstance: DbInstance, refPath: string) {
    this.db = dbInstance;
    this.refPath = refPath;
  }

  async where<T>(key: keyof T, value: any): Promise<T[]> {
    try {
      const ref = this.db.ref(this.refPath);
      const snapshot = await ref
        .orderByChild(key as string)
        .equalTo(value)
        .once("value");
      const data: T[] = [];
      snapshot.forEach((child) => {
        data.push(child.val());
      });
      return data;
    } catch (error) {
      console.error(`Failed to query data at path "${this.refPath}":`, error);
      return [];
    }
  }

  async find<T>(id: number): Promise<T | null> {
    try {
      const ref = this.db.ref(`${this.refPath}/${id}`);
      const snapshot = await ref.once("value");
      return snapshot.val();
    } catch (error) {
      console.error(
        `Failed to fetch item with ID ${id} at path "${this.refPath}":`,
        error
      );
      return null;
    }
  }

  async create<T>(data: T): Promise<void> {
    try {
      const ref = this.db.ref(this.refPath);
      await ref.push(data);
    } catch (error) {
      console.error(`Failed to create data at path "${this.refPath}":`, error);
      throw error;
    }
  }

  async update<T>(id: number, data: Partial<T>): Promise<void> {
    try {
      const ref = this.db.ref(`${this.refPath}/${id}`);
      await ref.update(data);
    } catch (error) {
      console.error(
        `Failed to update data with ID ${id} at path "${this.refPath}":`,
        error
      );
      throw error;
    }
  }

  async all<T>(): Promise<T[]> {
    try {
      const ref = this.db.ref(this.refPath);
      const snapshot = await ref.once("value");
      const data: T[] = [];
      snapshot.forEach((child) => {
        data.push(child.val());
      });
      return data;
    } catch (error) {
      console.error(
        `Failed to fetch all data from path "${this.refPath}":`,
        error
      );
      return [];
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const ref = this.db.ref(this.refPath);

      // Query the database to find the user with the specified property
      const snapshot = await ref.orderByChild("id").equalTo(id).once("value");

      if (!snapshot.exists()) {
        throw new Error("No data found");
      }

      // Iterate over matching users and delete by their unique keys
      snapshot.forEach((child) => {
        const key = child.key;
        if (key) {
          ref.child(key).remove();
          console.log(`Successfully deleted data with key: ${key}`);
        }
      });
    } catch (error) {
      console.error(`Failed to delete data by id = ${id}:`, error);
      throw error;
    }
  }

  listen<T>(callback: (data: T[]) => void): void {
    const ref = this.db.ref(this.refPath);
    ref.on("value", (snapshot) => {
      const data: T[] = [];
      snapshot.forEach((child) => {
        data.push(child.val());
      });
      callback(data);
    });
  }
}

export default DataAccessor;
