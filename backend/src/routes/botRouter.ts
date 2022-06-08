import { Router } from "express";
import isAuth from "../middleware/isAuth";

import * as BotController from "../controllers/BotController";

const botRoutes = Router();

botRoutes.get("/bot", isAuth, BotController.index);

botRoutes.post("/bot", isAuth, BotController.store);

botRoutes.get("/bot/:botId", isAuth, BotController.show);

botRoutes.put("/bot/:botId", isAuth, BotController.update);

botRoutes.delete("/bot/:botId", isAuth, BotController.remove);

export default botRoutes;
