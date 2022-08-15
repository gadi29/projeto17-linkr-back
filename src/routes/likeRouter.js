import { Router } from "express";
import { createLike, deleteLike } from "../controllers/likeControllers.js";
import validateUser  from "../middlewares/validateUser.js";

const likeRouter = Router();
likeRouter.post("/like", validateUser, createLike);
likeRouter.post("/unlike", validateUser, deleteLike);

export default likeRouter;
