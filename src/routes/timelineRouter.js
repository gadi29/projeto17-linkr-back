import { Router } from "express";
import { 
  getTimelinePosts,
  createPost,
  deletePost,
  editPost
} from "../controllers/timelineControllers.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import postSchema from "../schemas/postSchema.js";
import validateUser from "../middlewares/validateUser.js";


const timelineRouter = Router();


timelineRouter.get("/timeline", validateUser, getTimelinePosts);
timelineRouter.post("/timeline", validateUser, validateSchema(postSchema), createPost);
timelineRouter.delete("/timeline/:id", validateUser, deletePost);
timelineRouter.put("timeline/:id", validateSchema(postSchema), editPost);

export default timelineRouter;