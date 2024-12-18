import { Request, Response } from "express";
import Dog from "model/dog";
import { DogSchema, UpdateDogSchema } from "schema";
import { HttpStatusCodes, ResponseMessages } from "types/enums";
import { ICreateDog, IDelete, IDog, IGetDog, IUpdateDog } from "types/types";
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

  async update(req: IUpdateDog, res: Response): Promise<void> {
    try {
      const validationResult = UpdateDogSchema.safeParse(req.body);

      if (!validationResult.success) {
        sendResponse(
          res,
          HttpStatusCodes.BAD_REQUEST,
          ResponseMessages.DATA_INVALID,
          validationResult.error.format()
        );
        return;
      }

      const { key, ...data } = validationResult.data as {
        key: string;
      } & Partial<IDog>;

      if (!key) {
        sendResponse(
          res,
          HttpStatusCodes.BAD_REQUEST,
          ResponseMessages.KEY_REQUIRED,
          null
        );
        return;
      }

      await Dog.update(key, data);

      sendResponse(res, HttpStatusCodes.OK, ResponseMessages.DOG_UPDATED, null);
    } catch (error) {
      console.error("Error updating dog:", error);
      sendResponse(
        res,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        ResponseMessages.UNEXPECTED_ERROR,
        null
      );
      return;
    }
  }

  async delete(req: IDelete, res: Response): Promise<void> {
    try {
      const { key } = req.params as { key: string };

      await Dog.delete(key);

      sendResponse(res, HttpStatusCodes.OK, ResponseMessages.DOG_DELETED, null);

      return;
    } catch (error) {
      console.error("Error deleting dog:", error);
      sendResponse(
        res,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        ResponseMessages.UNEXPECTED_ERROR,
        null
      );
      return;
    }
  }

  async dog(req: IGetDog, res: Response): Promise<void> {
    try {
      const { ownerKey } = req.params as { ownerKey: string };

      if (!ownerKey) {
        sendResponse(
          res,
          HttpStatusCodes.BAD_REQUEST,
          ResponseMessages.KEY_REQUIRED,
          null
        );
        return;
      }

      const dogs = await Dog.where<IDog>({ ownerKey });

      if (dogs.length === 0) {
        sendResponse(
          res,
          HttpStatusCodes.NOT_FOUND,
          ResponseMessages.USER_NOT_FOUND,
          null
        );
        return;
      }

      sendResponse(res, HttpStatusCodes.OK, undefined, dogs);
    } catch (error) {
      console.error("Error fetching dog:", error);
      sendResponse(
        res,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        ResponseMessages.UNEXPECTED_ERROR,
        null
      );
    }
  }
}

export default new DogController();
