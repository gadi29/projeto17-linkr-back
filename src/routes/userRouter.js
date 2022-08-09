import { Router } from "express";

const userRouter = Router();

userRouter.get("/user/:id", getUser);

export default userRouter;
