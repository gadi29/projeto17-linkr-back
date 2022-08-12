import connection from "../db/database.js";
import timelineRepository from "../repositories/timelineRepository.js"


export async function getTimelinePosts(req, res) {
 
    try {

        const timelinePosts = await timelineRepository.getTimelinePosts();
        res.status(200).send(timelinePosts);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }

}


export async function createPost(req, res) {
 
    try {

        const newPost = req.body;
        const userId = parseInt(res.locals.session.userId);

        const timelinePosts = await timelineRepository.createPost(userId, newPost.postText, newPost.postUrl);

        res.status(201).send(timelinePosts);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }

}


export async function deletePost(req, res) {
    const { id } = req.params;
    const userId = parseInt(res.locals.session.userId);

    try {
        const { rowCount } = await timelineRepository.getUserPost(id, userId);
        if (rowCount === 0) {
            return res.sendStatus(401);
        }

        await timelineRepository.deletePost(id);
        res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}