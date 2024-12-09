import { auth } from "database/db";
import { Response } from "express";
import { HttpStatusCodes, ResponseMessages } from "types/enums";
import { IGenerateTestToken } from "types/types";
import { sendResponse } from "utils/response";

class AuthController {
  async generateTestToken(
    req: IGenerateTestToken,
    res: Response
  ): Promise<void> {
    const uid: string = req.body.uid;
    const user = await auth.getUser(uid);
    console.log(user);
    const token = await auth.createCustomToken(uid);
    sendResponse(res, HttpStatusCodes.OK, ResponseMessages.TOKEN_VALID, token);
    console.log("Custom Test Token:", token);
    return;
  }
}

export default new AuthController();
