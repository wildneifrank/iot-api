import fs from "fs-extra";
import path from "path";
import { API } from "types";
import { fileURLToPath } from "url";

type DataItem = API.Models.IDataItem;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DataAccessor {
  private filePath: string;

  constructor() {
    this.filePath = path.join(__dirname, "..", "database", "data.json");
  }

  // Method to read data from JSON file
  public async readData(): Promise<DataItem[]> {
    const data = await fs.readFile(this.filePath, "utf-8");
    return JSON.parse(data) as DataItem[];
  }

  // Method to write data to JSON file
  private async writeData(data: DataItem[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  // Method to add a new item and return its ID
  public async create(item: DataItem): Promise<number> {
    const data = await this.readData();
    data.push(item);
    await this.writeData(data);
    return item.id; // Return the ID of the added item
  }

  // Method to update an existing item
  public async update(id: number, updates: Partial<DataItem>): Promise<void> {
    const data = await this.readData();
    const index = data.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Item not found");
    data[index] = { ...data[index], ...updates };
    await this.writeData(data);
  }

  // Method to delete an item
  public async delete(id: number): Promise<void> {
    const data = await this.readData();
    const updatedData = data.filter((item) => item.id !== id);
    await this.writeData(updatedData);
  }

  // Method to find an item by id
  public async find(id: number): Promise<DataItem | null> {
    const data = await this.readData();
    return data.find((item) => item.id === id) || null;
  }

  // Method to find items that match a specific field and value
  public async where(field: keyof DataItem, value: any): Promise<DataItem[]> {
    const data = await this.readData();
    return data.filter((item) => item[field] === value);
  }

  // Method to return all data
  public async all(): Promise<DataItem[]> {
    return await this.readData();
  }
}

export default DataAccessor;
