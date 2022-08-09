import { Router } from "express";
import { getTimelinePosts, createPost } from "../controllers/timelineControllers.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import postSchema from "../schemas/postSchema.js";




const timelineRouter = Router();


timelineRouter.get("/timeline", getTimelinePosts);
timelineRouter.post("/timeline", validateSchema(postSchema), createPost);


export default timelineRouter;