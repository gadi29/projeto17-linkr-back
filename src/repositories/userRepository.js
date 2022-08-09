import connection from "../db/database.js";

function getUserPosts(userId) {
  return connection.query(
    `SELECT users.name, users."userPhoto", posts.content, posts."postUrl"
    FROM users JOIN posts ON posts."userId" = users.id
    WHERE posts."userId" = $1`,
    [userId]
  );
}

export const userRepository = {
  getUserPosts
}