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

function searchUser(search) {
  const params = [`%${search}%`]

  return connection.query(
    `SELECT id, name, "userPhoto"
    FROM users
    WHERE users.name ILIKE $1`,
    params
  );
}

export const userRepository = {
  getUser,
  getUserPosts,
  searchUser
}