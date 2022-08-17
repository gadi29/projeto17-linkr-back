import { Router } from "express";
import {
  getUserPage,
  isFollowingUser,
  followUser,
  unfollowUser,
  searchUsers 
} from "../controllers/userControllers.js";
import validateUser from "../middlewares/validateUser.js";

const userRouter = Router();

userRouter.get("/user/:id", getUserPage);
userRouter.get("/user/following/:id", validateUser, isFollowingUser);
userRouter.post("/user/follow/:id", validateUser, followUser);
userRouter.delete("/user/unfollow/:id", validateUser, unfollowUser);
userRouter.get("/user", searchUsers);

export default userRouter;
