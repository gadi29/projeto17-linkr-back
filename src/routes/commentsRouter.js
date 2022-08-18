import { Router } from "express";
import validateUser from "../middlewares/validateUser.js";
import { postComment } from "../controllers/commentsController.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import commentSchema from "../schemas/commentSchema.js";


const commentsRouter = Router();


commentsRouter.post("/comment", validateUser, validateSchema(commentSchema), postComment);

export default commentsRouter;