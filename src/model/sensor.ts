import { ISensor } from "types/types";
import { Entity } from "./entity";
import DataAccessor from "services/data_accessor";
import { db } from "database/db";
import { DataPaths } from "types/enums";

class Sensor extends Entity<ISensor> {
  constructor() {
    super(new DataAccessor(db, DataPaths.SENSORS));
  }

  async getLast(): Promise<ISensor | null> {
    try {
      // Fetch all data from the source
      const data = await this.all();

      // Sort the data based on timestamp or any other field
      const sortedData = data.sort((a, b) => {
        if ((a as any).timestamp && (b as any).timestamp) {
          return (b as any).timestamp - (a as any).timestamp; // descending order
        }
        return 0; // no sorting if no timestamp
      });

      return sortedData.length > 0 ? sortedData[0] : null; // Return the last data
    } catch (error) {
      console.error("Failed to fetch last data item:", error);
      return null;
    }
  }
}

export default new Sensor();
