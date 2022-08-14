import connection from "../db/database.js";


async function getTrending () {
    
    const {rows: trending} = await connection.query(`
        SELECT
            h."name" AS "hashtag",
            COUNT(hp."hashtagId")::int AS "timesUsed"
        FROM "postHashtag" hp
        JOIN "hashtags" h ON h."id" = hp."hashtagId"
        GROUP BY h."name"
        ORDER BY "timesUsed" DESC
        LIMIT 10`
    );

    return trending;
}

async function getHashtagPosts (hashtag) {

    const { rows: hashtagPosts } = await connection.query(`
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
        JOIN "postHashtag" ph ON ph."postId" = p."id"
        JOIN hashtags h ON h."id" = ph."hashtagId"
        WHERE h."name" = $1
        GROUP BY p."id", u."name", u."id", u."userPhoto"
        ORDER BY p."createdAt" DESC
        LIMIT 20`,
        [hashtag]
    );

    return hashtagPosts;

}

const hashtagsRepository = {
    getTrending,
    getHashtagPosts
}

export default hashtagsRepository;