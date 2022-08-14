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