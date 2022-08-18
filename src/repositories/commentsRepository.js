import connection from "../db/database.js";

async function postComment (postId, userId, comment) {
    
    return connection.query(
        `INSERT INTO "comments" ("postId", "userId", "comment")
        VALUES ($1, $2, $3)`,
        [postId, userId, comment]
    );
}


const commentsRepository = {
    postComment
}

export default commentsRepository;