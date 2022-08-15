import connection from "../db/database.js";

function getUser(userId) {
  return connection.query(
    `SELECT "name" as "userName", "userPhoto" FROM "users" WHERE "id" = $1`,
    [userId]
  );
}

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
      COUNT("likes"."postId")::int AS "likesQty",
      COALESCE(JSON_AGG("likes"."userId") FILTER (WHERE "likes"."userId" IS NOT NULL), '[]'::json) AS "usersIdLiked",
      COALESCE(JSON_AGG("likes"."userName") FILTER (WHERE "likes"."userName" IS NOT NULL), '[]'::json) AS "usersNameLiked"
    FROM "posts"
    LEFT JOIN "likes" ON "posts"."id" = "likes"."postId"
    JOIN "users" ON "posts"."userId" = "users"."id"
    WHERE "posts"."userId" = $1
    GROUP BY "posts"."id", "users"."name", "users"."id", "users"."userPhoto"
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
  getUser,
  getUserPosts,
  searchUser
}