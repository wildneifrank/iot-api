import SensorController from "controllers/sensor_controller";
import { Router } from "express";

const routes = Router();

// ---------------------------------------- PUBLIC ROUTES ---------------------------------------- //

// Sensors
routes.get("/sensors", SensorController.sensors);

export default routes;
