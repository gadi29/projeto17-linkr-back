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
        //const userId = parseInt(res.locals.session.userId);
        const userId = 1; //Substituir para a linha acima quando o middleware de validação de token estiver pronto

        const timelinePosts = await timelineRepository.createPost(userId, newPost.content, newPost.postUrl);

        res.status(201).send(timelinePosts);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }

}
