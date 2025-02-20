import { Request, Response } from "express";
import User from "model/user";
import { HttpStatusCodes, ResponseMessages } from "types/enums";
import { sendResponse } from "utils/response";

class UserController {
  constructor() {
    this.init();
  }

  async init() {
    await User.initializeUser();
  }

  async user(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.all().then((users) => {
        if (users[0]) {
          return users[0];
        }
        return [];
      });
      sendResponse(res, HttpStatusCodes.OK, undefined, user);
    } catch (error) {
      console.error("Error fetching users:", error);
      sendResponse(
        res,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        ResponseMessages.UNEXPECTED_ERROR,
        null
      );
    }
  }
}

export default new UserController();
