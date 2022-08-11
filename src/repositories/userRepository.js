import connection from "../db/database.js";

function getUserPosts(userId) {
  return connection.query(
    `SELECT 
      "users"."id" AS "userId",
      "users"."name" AS "userName",
      "users"."userPhoto" AS "userPhoto",
      "posts".id AS "postId",
      "posts"."postText",
      "posts"."postUrl",
      "posts"."urlTitle",
      "posts"."urlDescription",
      "posts"."urlImage"
    FROM "posts"
    JOIN "users" ON "posts"."userId" = "users"."id"
    WHERE "posts"."userId" = $1
    ORDER BY "posts"."createdAt" DESC
    LIMIT 20`,
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
  getUserPosts,
  searchUser
}