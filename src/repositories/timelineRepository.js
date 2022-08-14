import connection from "../db/database.js";
import urlMetadata from "url-metadata";


async function getTimelinePosts () {
    
    const { rows: timelinePosts } = await connection.query(`
        SELECT
            p."id" AS "postId",
            u."name" AS "userName",
            u."id" AS "userId", 
            u."userPhoto" AS "userPhoto", 
            p."postText", 
            p."postUrl", 
            p."urlTitle", 
            p."urlDescription",
            p."urlImage", 
            COUNT(l."postId")::int AS "likesQty",
            COALESCE(JSON_AGG(l."userId") FILTER (WHERE l."userId" IS NOT NULL), '[]'::json) AS "usersIdLiked",
            COALESCE(JSON_AGG(l."userName") FILTER (WHERE l."userName" IS NOT NULL), '[]'::json) AS "usersNameLiked"
        FROM "posts" p
        LEFT JOIN "likes" l ON p."id" = l."postId"
        JOIN "users" u ON p."userId" = u."id"
        GROUP BY p."id", u."name", u."userPhoto"
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

function getUserPost(postId, userId) {
    return connection.query(`
        SELECT * FROM "posts" WHERE id = $1 AND "userId" = $2`,
        [postId, userId]);
}

function deletePost(postId) {
    return connection.query(`
        DELETE FROM "posts" WHERE id = $1`,
        [postId]);
}

function editPost(newPostText, postId) {
    return connection.query(`
    UPDATE "posts" SET "postText"=$1 WHERE id=$2`,
    [newPostText, postId]);
}

const timelineRepository = {
    getTimelinePosts,
    createPost,
    getUserPost,
    deletePost,
    editPost
}

export default timelineRepository;