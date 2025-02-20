import DataAccessor from "services/data_accessor";
import { db } from "database/db";
import { IUser } from "types/types";
import { DataPaths } from "types/enums";
import { Entity } from "./entity";

class User extends Entity<IUser> {
  constructor() {
    super(new DataAccessor(db, DataPaths.USERS)); // Ensure USERS is defined in DataPaths
  }

  async initializeUser(): Promise<void> {
    try {
      const users = await this.all();

      if (users.length === 0) {
        console.log("No users found. Creating default user...");

        const defaultUser: IUser = {
          name: "Helene Engels",
          email: "helene@example.com",
          tel: "+1234 567 890",
          address: "2 Miles Drive, NJ 071, New York, USA",
          sex: 0,
          ageRange: 1,
        };

        await this.create(defaultUser);
        console.log("Default user created.");
      } else {
        console.log("Users already exist. No need to create a default user.");
      }
    } catch (error) {
      console.error("Error initializing user data:", error);
    }
  }
}

export default new User();
