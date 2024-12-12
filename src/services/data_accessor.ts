import { DbInstance, IDataAccessor } from "types/types";

class DataAccessor implements IDataAccessor {
  private db: DbInstance;
  private refPath: string;

  constructor(dbInstance: DbInstance, refPath: string) {
    this.db = dbInstance;
    this.refPath = refPath;
  }

  async where<T>(key: keyof T, value: any): Promise<(T & { key: string })[]> {
    try {
      const ref = this.db.ref(this.refPath);
      const snapshot = await ref
        .orderByChild(key as string)
        .equalTo(value)
        .once("value");
      const data: (T & { key: string })[] = [];
      snapshot.forEach((child) => {
        data.push({ ...child.val(), key: child.key! });
      });
      return data;
    } catch (error) {
      console.error(`Failed to query data at path "${this.refPath}":`, error);
      return [];
    }
  }

  async find<T>(key: string): Promise<(T & { key: string }) | null> {
    try {
      const ref = this.db.ref(`${this.refPath}/${key}`);
      const snapshot = await ref.once("value");
      if (!snapshot.exists()) {
        return null;
      }
      return { ...snapshot.val(), key };
    } catch (error) {
      console.error(
        `Failed to fetch item with Key ${key} at path "${this.refPath}":`,
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

  async update<T>(key: string, data: Partial<T>): Promise<void> {
    try {
      const ref = this.db.ref(`${this.refPath}/${key}`);
      const snapshot = await ref.once("value");

      if (!snapshot.exists()) {
        throw new Error(
          `No data found with Key ${key} at path "${this.refPath}"`
        );
      }

      await ref.update(data);
    } catch (error) {
      console.error(
        `Failed to update data with Key ${key} at path "${this.refPath}":`,
        error
      );
      throw error;
    }
  }

  async all<T>(): Promise<(T & { key: string })[]> {
    try {
      const ref = this.db.ref(this.refPath);
      const snapshot = await ref.once("value");
      const data: (T & { key: string })[] = [];
      snapshot.forEach((child) => {
        data.push({ ...child.val(), key: child.key! });
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

  async delete(key: string): Promise<void> {
    try {
      const ref = this.db.ref(`${this.refPath}/${key}`);

      const snapshot = await ref.once("value");

      if (!snapshot.exists()) {
        throw new Error(
          `No data found with Key ${key} at path "${this.refPath}"`
        );
      }

      await ref.remove();
    } catch (error) {
      throw error;
    }
  }

  async getKey<T>(key: keyof T, value: any): Promise<string | null> {
    try {
      const ref = this.db.ref(this.refPath);
      const snapshot = await ref
        .orderByChild(String(key))
        .equalTo(value)
        .once("value");

      if (!snapshot.exists()) {
        console.log(`No data found for ${String(key)}: ${value}`);
        return null;
      }

      let resultKey: string | null = null;
      snapshot.forEach((child) => {
        resultKey = child.key!; // Get the first matching key
      });

      return resultKey;
    } catch (error) {
      console.error(`Failed to fetch key for ${String(key)}: ${value}`, error);
      return null;
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
