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

async function getHashtagPosts (userId, hashtag) {

    const { rows: hashtagPosts } = await connection.query(`
        SELECT
        tl."id" AS "T_id",
        tl."userId" AS "T_userId",
        tl."repost" AS "T_isRepost",
        p."id" AS "postId",
        u."name" AS "userName",
        u."id" AS "userId", 
        u."userPhoto" AS "userPhoto", 
        p."postText", 
        p."postUrl", 
        p."urlTitle", 
        p."urlDescription",
        p."urlImage",
        COALESCE((
        SELECT JSON_AGG(ROW_TO_JSON(t))
        FROM (
            SELECT l."userId", l."userName"
            FROM "likes" l
            WHERE p."id" = l."postId"
        ) t
        ), '[]'::json) AS "usersLiked",
        COALESCE((
        SELECT JSON_AGG(ROW_TO_JSON(t))
        FROM (
            SELECT u."name" AS "userName", 
            u."id" AS "userId", 
            u."userPhoto" AS "userPhoto", 
            c."comment" AS "comment",
            CASE 
                WHEN EXISTS (SELECT *
                FROM "followers" f
                WHERE f."mainUserId" = $1 AND f."followingUserId" = u."id")
                THEN TRUE
                ELSE FALSE
            END	AS "isFollowing",
            CASE 
                WHEN (c."userId" = p."userId")
                THEN TRUE
                ELSE FALSE
            END	AS "isAuthor"
            FROM "comments" c 
            JOIN "users" u ON u."id" = c."userId"
            WHERE c."postId" = p."id"
        ) t
        ), '[]'::json) AS "postComments"
        FROM "timeline" tl
        JOIN "posts" p ON p.id = tl."postId"
        JOIN "users" u ON p."userId" = u."id"   
        LEFT JOIN "comments" c ON c."postId" = p."id"
        JOIN "postHashtag" ph ON ph."postId" = p."id"
        JOIN hashtags h ON h."id" = ph."hashtagId"
        WHERE h."name" = $2
        GROUP BY p."id", u."name", u."id", u."userPhoto", tl."id", tl."userId", tl."repost"
        ORDER BY "T_id" DESC;`,
        [userId, hashtag]
    );

    return hashtagPosts;

}

const hashtagsRepository = {
    getTrending,
    getHashtagPosts
}

export default hashtagsRepository;