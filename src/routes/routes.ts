import DataController from "controllers/data_controller";
import { Router } from "express";

const routes = Router();

// ---------------------------------------- PUBLIC ROUTES ---------------------------------------- //
routes.get("/data", DataController.data);

export default routes;
