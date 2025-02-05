import { Request, Response } from "express";
import Sensor from "model/sensor";
import { HttpStatusCodes, ResponseMessages } from "types/enums";
import { sendResponse } from "utils/response";

class SensorController {
  async sensors(req: Request, res: Response): Promise<void> {
    try {
      const sensors = await Sensor.all();

      const filteredSensors = sensors
        .map((sensor) => ({
          ...sensor,
          temperature: Number(sensor.temperature),
        }))
        .filter(
          (sensor) =>
            sensor.heartbeat >= 45 &&
            sensor.heartbeat <= 200 &&
            sensor.temperature >= 28 &&
            sensor.temperature <= 38
        );

      sendResponse(res, HttpStatusCodes.OK, undefined, filteredSensors);
    } catch (error) {
      console.error("Error fetching data:", error);
      sendResponse(
        res,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        ResponseMessages.UNEXPECTED_ERROR,
        null
      );
    }
  }
}

export default new SensorController();
