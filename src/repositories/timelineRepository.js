import connection from "../db/database.js";


async function getTimelinePosts () {
    const { rows: timelinePosts } = await connection.query(`
        SELECT u."name" AS "userName", u."userPhoto" AS "userPhoto", p."content", p."postUrl" 
        FROM "posts" p
        JOIN "users" u ON p."userId" = u."id"
        ORDER BY p."createdAt" DESC
        LIMIT 20`
    );

    return timelinePosts;
}

async function createPost (userId, content, postUrl) {

    await connection.query(`
        INSERT INTO "posts" ("userId", "content", "postUrl") 
        VALUES ($1, $2, $3)`,
        [userId, content, postUrl]    
    );

    const timelinePosts = await getTimelinePosts();

    return timelinePosts;
}


const timelineRepository = {
    getTimelinePosts,
    createPost
}

export default timelineRepository;