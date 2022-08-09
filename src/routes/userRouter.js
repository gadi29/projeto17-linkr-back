import { Router } from "express";
import { getUserPage } from "../controllers/userControllers.js";

const userRouter = Router();

userRouter.get("/user/:id", getUserPage);

export default userRouter;
