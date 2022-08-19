import { Router } from "express";
import {
  getUserPage,
  getFollowingList,
  isFollowingUser,
  followUser,
  unfollowUser,
  searchUsers 
} from "../controllers/userControllers.js";
import validateUser from "../middlewares/validateUser.js";

const userRouter = Router();

userRouter.get("/user/:id", getUserPage);
userRouter.get("/following", validateUser, getFollowingList);
userRouter.get("/user/following/:id", validateUser, isFollowingUser);
userRouter.post("/user/follow/:id", validateUser, followUser);
userRouter.delete("/user/unfollow/:id", validateUser, unfollowUser);
userRouter.get("/user", validateUser, searchUsers);

export default userRouter;
