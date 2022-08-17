import { Router } from "express";
import { getUserPage, isFollowingUser, searchUsers } from "../controllers/userControllers.js";
import validateUser from "../middlewares/validateUser.js";

const userRouter = Router();

userRouter.get("/user/:id", getUserPage);
userRouter.get("/user/following/:id", validateUser, isFollowingUser);
userRouter.get("/user", searchUsers);

export default userRouter;
