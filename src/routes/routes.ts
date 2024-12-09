import DataController from "controllers/data_controller";
import AuthController from "controllers/auth_controller";
import UserController from "controllers/user_controller";

import { Router } from "express";

const routes = Router();

// ---------------------------------------- PUBLIC ROUTES ---------------------------------------- //

// Users
routes.get("/users", UserController.users);
routes.post("/user", UserController.create);
routes.delete("/user/:id", UserController.delete);

routes.get("/", DataController.getAll);
routes.post("/generateTestToken", AuthController.generateTestToken);

export default routes;
