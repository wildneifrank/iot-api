import { Response, NextFunction } from "express";
import { HttpStatusCodes, ResponseMessages } from "types/enums";
import { sendResponse } from "utils/response";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { IVerifyTokenRequest } from "types/types";
import { auth } from "database/db";

const verifyTokenMiddleware = async (
  req: IVerifyTokenRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token: string = req.body.token;

    if (!token) {
      sendResponse(
        res,
        HttpStatusCodes.BAD_REQUEST,
        ResponseMessages.TOKEN_REQUIRED,
        null
      );
      return;
    }

    const decodedToken: DecodedIdToken | null = await verifyUserToken(token);

    if (!decodedToken) {
      sendResponse(
        res,
        HttpStatusCodes.UNAUTHORIZED,
        ResponseMessages.TOKEN_INVALID,
        null
      );
      return;
    }

    // Attach the decoded token to the request for use in the next middleware or route handler
    req.body.data = decodedToken;

    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    sendResponse<null>(
      res,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ResponseMessages.UNEXPECTED_ERROR,
      null
    );
  }
};

async function verifyUserToken(
  idToken: string
): Promise<DecodedIdToken | null> {
  try {
    console.log(idToken);
    const decodedToken = await auth.verifyIdToken(idToken, true);
    console.log("Decoded Token:", decodedToken);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

export default verifyTokenMiddleware;
