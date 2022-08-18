import commentsRepository from "../repositories/commentsRepository.js";
import timelineRepository from "../repositories/timelineRepository.js";

export async function postComment(req, res) {
 
    const userId = parseInt(res.locals.session.userId);
    const newComment = req.body;
    
    try {

        await commentsRepository.postComment(newComment.postId, userId, newComment.comment);

        const timelinePosts = await timelineRepository.getTimelinePosts(userId);

        res.status(200).send(timelinePosts);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }

}