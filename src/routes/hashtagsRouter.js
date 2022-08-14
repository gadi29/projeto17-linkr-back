import { Router } from "express";
import validateUser from "../middlewares/validateUser.js";
import { getTrending } from "../controllers/hashtagsController.js";


const hashtagsRouter = Router();

hashtagsRouter.get("/hashtags", validateUser, getTrending);


export default hashtagsRouter;