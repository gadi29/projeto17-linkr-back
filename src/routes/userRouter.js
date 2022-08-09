import { Router } from "express";
import { getUserPage } from "../controllers/userControllers.js";

const userRouter = Router();

userRouter.get("/user/:id", getUserPage);
userRouter.get("/user", searchUsers)

export default userRouter;
