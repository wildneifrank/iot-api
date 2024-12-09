import { Request, Response } from "express";
import { User } from "model/user";
import { HttpStatusCodes } from "types/enums";
import { IDeleteUser, IUser } from "types/types";
import { sendResponse } from "utils/response";

class UserController {
  async users(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.all();
      sendResponse(res, HttpStatusCodes.OK, undefined, user);
    } catch (error) {
      console.error("Error fetching users:", error);
      sendResponse(
        res,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        "Error fetching users",
        null
      );
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const user: IUser = {
        id: 0,
        name: "teste da silva 2",
        email: "example2@gmail.com",
      };
      const userHasBeenCreated = await User.create(user);

      sendResponse(res, HttpStatusCodes.OK, undefined, userHasBeenCreated);
    } catch (error) {
      console.error("Error creating user:", error);
      sendResponse(
        res,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        "Error creating user",
        null
      );
    }
  }

  async delete(req: IDeleteUser, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const userHasBeenDeleted = await User.delete(id);

      if (!userHasBeenDeleted) {
        sendResponse(
          res,
          HttpStatusCodes.NOT_FOUND,
          undefined,
          userHasBeenDeleted
        );
        return;
      }

      sendResponse(res, HttpStatusCodes.OK, undefined, userHasBeenDeleted);
      return;
    } catch (error) {
      console.error("Error deleting user:", error);
      sendResponse(
        res,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        "Error deleting user",
        null
      );
    }
  }
}

export default new UserController();
