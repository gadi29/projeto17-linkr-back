import connection from "../db/database.js";

function getUser(id) {
  return connection.query(
    `SELECT name, "userPhoto"
    FROM users WHERE id = $1`,
    [id]
  );
}

function getUserPosts(userId) {
  return connection.query(
    `SELECT "content", "postUrl"
    FROM posts WHERE posts."userId" = $1`,
    [userId]
  );
}

export const userRepository = {
  getUser,
  getUserPosts
}