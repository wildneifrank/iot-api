import { Request, Response } from "express";
import { Dog } from "model/dog";
import { DogSchema } from "schema";
import { HttpStatusCodes, ResponseMessages } from "types/enums";
import {
  ICreateDog,
  ICreateUser,
  IDeleteUser,
  IDog,
  IGetUser,
  IUpdateUser,
  IUser,
} from "types/types";
import { sendResponse } from "utils/response";

class DogController {
  async dogs(req: Request, res: Response): Promise<void> {
    try {
      const dogs = await Dog.all();
      sendResponse(res, HttpStatusCodes.OK, undefined, dogs);
    } catch (error) {
      console.error("Error fetching users:", error);
      sendResponse(
        res,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        ResponseMessages.UNEXPECTED_ERROR,
        null
      );
      return;
    }
  }

  async create(req: ICreateDog, res: Response): Promise<void> {
    try {
      const validationResult = DogSchema.safeParse(req.body);

      if (!validationResult.success) {
        sendResponse(
          res,
          HttpStatusCodes.BAD_REQUEST,
          ResponseMessages.DATA_INVALID,
          validationResult.error.format()
        );
        return;
      }
      const dog: IDog = validationResult.data;
      await Dog.create(dog);

      sendResponse(res, HttpStatusCodes.OK, ResponseMessages.DOG_CREATED, null);
      return;
    } catch (error) {
      console.error("Error creating user:", error);
      sendResponse(
        res,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        ResponseMessages.UNEXPECTED_ERROR,
        null
      );
      return;
    }
  }

  //   async update(req: IUpdateUser, res: Response): Promise<void> {
  //     try {
  //       const { key, ...data } = req.body as { key: string } & Partial<IUser>;

  //       if (!key) {
  //         sendResponse(
  //           res,
  //           HttpStatusCodes.BAD_REQUEST,
  //           ResponseMessages.KEY_REQUIRED,
  //           null
  //         );
  //         return;
  //       }

  //       if (data.email) {
  //         const userAlreadyExists = await User.where<IUser>({
  //           email: data.email,
  //         });

  //         if (userAlreadyExists.length > 0) {
  //           sendResponse(
  //             res,
  //             HttpStatusCodes.BAD_REQUEST,
  //             ResponseMessages.USER_ALREADY_EXISTS,
  //             null
  //           );
  //           return;
  //         }
  //       }

  //       await User.update(key, data);

  //       sendResponse(
  //         res,
  //         HttpStatusCodes.OK,
  //         ResponseMessages.USER_UPDATED,
  //         null
  //       );
  //     } catch (error) {
  //       console.error("Error updating user:", error);
  //       sendResponse(
  //         res,
  //         HttpStatusCodes.INTERNAL_SERVER_ERROR,
  //         ResponseMessages.UNEXPECTED_ERROR,
  //         null
  //       );
  //       return;
  //     }
  //   }

  //   async delete(req: IDeleteUser, res: Response): Promise<void> {
  //     try {
  //       const { key } = req.params as { key: string };

  //       await User.delete(key);

  //       sendResponse(
  //         res,
  //         HttpStatusCodes.OK,
  //         ResponseMessages.USER_DELETED,
  //         null
  //       );

  //       return;
  //     } catch (error) {
  //       console.error("Error deleting user:", error);
  //       sendResponse(
  //         res,
  //         HttpStatusCodes.INTERNAL_SERVER_ERROR,
  //         ResponseMessages.UNEXPECTED_ERROR,
  //         null
  //       );
  //       return;
  //     }
  //   }

  //   async user(req: IGetUser, res: Response): Promise<void> {
  //     try {
  //       const { email } = req.params as { email: string };

  //       if (!email) {
  //         sendResponse(
  //           res,
  //           HttpStatusCodes.BAD_REQUEST,
  //           ResponseMessages.EMAIL_REQUIRED,
  //           null
  //         );
  //         return;
  //       }

  //       const users = await User.where<IUser>({ email });

  //       if (users.length === 0) {
  //         sendResponse(
  //           res,
  //           HttpStatusCodes.NOT_FOUND,
  //           ResponseMessages.USER_NOT_FOUND,
  //           null
  //         );
  //         return;
  //       }

  //       const user = users[0];

  //       sendResponse(res, HttpStatusCodes.OK, undefined, user);
  //     } catch (error) {
  //       console.error("Error fetching user:", error);
  //       sendResponse(
  //         res,
  //         HttpStatusCodes.INTERNAL_SERVER_ERROR,
  //         ResponseMessages.UNEXPECTED_ERROR,
  //         null
  //       );
  //     }
  //   }
}

export default new DogController();
