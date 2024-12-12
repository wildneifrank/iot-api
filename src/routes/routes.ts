import AuthController from "controllers/auth_controller";
import UserController from "controllers/user_controller";

import { Router } from "express";

const routes = Router();

// ---------------------------------------- PUBLIC ROUTES ---------------------------------------- //

// Users
routes.get("/users", UserController.users);
routes.get("/user/:email", UserController.user);
routes.put("/user", UserController.update);
routes.post("/user", UserController.create);
routes.delete("/user/:key", UserController.delete);

routes.post("/generateTestToken", AuthController.generateTestToken);

export default routes;
