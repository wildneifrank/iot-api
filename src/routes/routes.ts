import DataController from "controllers/data_controller";
import { Router } from "express";

const routes = Router();

// ---------------------------------------- PUBLIC ROUTES ---------------------------------------- //
routes.get("/", DataController.getAll);

export default routes;
