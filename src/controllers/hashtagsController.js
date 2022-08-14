import hashtagsRepository from "../repositories/hashtagsRepository.js";



export async function getTrending(req, res) {
 
    try {

        const trending = await hashtagsRepository.getTrending();
        res.status(200).send(trending);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }

}

export async function getHashtagPosts(req, res) {

    const hashtag = req.params.hashtag;

    try {

        const hashtagPosts = await hashtagsRepository.getHashtagPosts(hashtag);
        res.status(200).send(hashtagPosts);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }

}