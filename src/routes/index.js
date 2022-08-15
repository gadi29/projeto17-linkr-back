import { Router } from "express";
import authRouter from "./authRouter.js";
import userRouter from "./userRouter.js";
import timelineRouter from "./timelineRouter.js";
import likeRouter from "./likeRouter.js";

const router = Router();
router.use(authRouter);
router.use(timelineRouter);
router.use(userRouter);
router.use(likeRouter);

export default router;