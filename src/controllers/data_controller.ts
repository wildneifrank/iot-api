import { Request, Response } from "express";
import { Data } from "model/data";
import { API } from "types";
import { sendResponse } from "utils/response";

class DataController {
  async getAll(req: Request, res: Response) {
    try {
      const data = await Data.all();

      if (data.length > 0) {
        sendResponse(
          res,
          API.Express.HttpStatusCodes.OK,
          "Data fetched successfully",
          data // Include all data in the response
        );
      } else {
        sendResponse(
          res,
          API.Express.HttpStatusCodes.OK,
          "No data found",
          [] // Return an empty array if no data is found
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      sendResponse(
        res,
        API.Express.HttpStatusCodes.INTERNAL_SERVER_ERROR,
        "An unexpected error occurred"
      );
    }
  }
}

export default new DataController();
