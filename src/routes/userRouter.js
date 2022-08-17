import { Router } from "express";
import { getUserPage, searchUsers } from "../controllers/userControllers.js";
import validateUser from "../middlewares/validateUser.js";

const userRouter = Router();

userRouter.get("/user/:id", validateUser, getUserPage);
userRouter.get("/user", searchUsers);

export default userRouter;
