import { Router } from "express";
import authRouter from "./authRouter.js";
import userRouter from "./userRouter.js";
import timelineRouter from "./timelineRouter.js";

const router = Router();
router.use(authRouter);
router.use(timelineRouter);
router.use(userRouter);

export default router;