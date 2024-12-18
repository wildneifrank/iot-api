import { IDog } from "types/types";
import { Entity } from "./entity";
import DataAccessor from "services/data_accessor";
import { db } from "database/db";
import { DataPaths } from "types/enums";

class Dog extends Entity<IDog> {
  constructor() {
    super(new DataAccessor(db, DataPaths.DOGS));
  }
}

export default new Dog();
