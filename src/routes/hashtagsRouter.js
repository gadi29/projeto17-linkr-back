import { Router } from "express";
import validateUser from "../middlewares/validateUser.js";
import { getTrending, getHashtagPosts } from "../controllers/hashtagsController.js";


const hashtagsRouter = Router();

hashtagsRouter.get("/hashtags", validateUser, getTrending);
hashtagsRouter.get("/hashtag/:hashtag", validateUser, getHashtagPosts);


export default hashtagsRouter;