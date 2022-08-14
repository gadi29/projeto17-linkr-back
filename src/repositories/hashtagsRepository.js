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



const hashtagsRepository = {
    getTrending
}

export default hashtagsRepository;