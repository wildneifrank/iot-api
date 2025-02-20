import SensorController from "controllers/sensor_controller";
import UserController from "controllers/user_controller";

import { Router } from "express";

const routes = Router();

// ---------------------------------------- PUBLIC ROUTES ---------------------------------------- //

// Sensors
routes.get("/sensors", SensorController.sensors);
routes.get("/sensors/latest", SensorController.latestSensor);

export default routes;
