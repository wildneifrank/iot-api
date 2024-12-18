import { ISensor } from "types/types";
import { Entity } from "./entity";
import DataAccessor from "services/data_accessor";
import { db } from "database/db";
import { DataPaths } from "types/enums";

class Sensor extends Entity<ISensor> {
  constructor() {
    super(new DataAccessor(db, DataPaths.SENSORS));
  }
}

export default new Sensor();
