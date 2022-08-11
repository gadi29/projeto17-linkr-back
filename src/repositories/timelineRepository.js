import connection from "../db/database.js";
import urlMetadata from "url-metadata";


async function getTimelinePosts () {
    
    const { rows: timelinePosts } = await connection.query(`
        SELECT 
            p.id AS "postId",
            u."name" AS "userName",
            u."id" AS "userId",
            u."userPhoto" AS "userPhoto", 
            p."postText", 
            p."postUrl", 
            p."urlTitle", 
            p."urlDescription",
            p."urlImage" 
        FROM "posts" p
        JOIN "users" u ON p."userId" = u."id"
        ORDER BY p."createdAt" DESC
        LIMIT 20`
    );

    return timelinePosts;
}

async function createPost (userId, postText, postUrl) {

    try {
        const metadataObj = await urlMetadata(postUrl, {encode: 'UTF-8', descriptionLength: 500});
        const urlTitle = metadataObj.title;
        const urlDescription = metadataObj.description;
        const urlImage = metadataObj.image;

        await connection.query(`
            INSERT INTO "posts" ("userId", "postText", "postUrl", "urlTitle", "urlDescription", "urlImage") 
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [userId, postText, postUrl, urlTitle, urlDescription, urlImage]    
        );

        const timelinePosts = await getTimelinePosts();

        return timelinePosts;

    } catch (error) {
        console.log(error);
    }
}


const timelineRepository = {
    getTimelinePosts,
    createPost
}

export default timelineRepository;