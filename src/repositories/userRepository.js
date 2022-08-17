import connection from "../db/database.js";

function getUser(userId) {
  return connection.query(
    `SELECT
      "name" as "userName",
      "userPhoto"
    FROM "users" WHERE "id" = $1`,
    [userId]
  );
}

function isFollowingUser(mainUserId, followingUserId) {
  return connection.query(
    `SELECT * FROM "followers" WHERE "mainUserId" = $1 AND "followingUserId" = $2`,
    [mainUserId, followingUserId]
  );
}

function followUser(mainUserId, followingUserId) {
  return connection.query(
    `INSERT INTO "followers" ("mainUserId", "followingUserId")
    VALUES ($1, $2)`,
    [mainUserId, followingUserId]
  );
}

function unfollowUser(mainUserId, followingUserId) {
  return connection.query(
    `DELETE FROM "followers" WHERE "mainUserId" = $1 AND "followingUserId" = $2`,
    [mainUserId, followingUserId]
  );
}

function getUserPosts(userId) {
  return connection.query(
    `SELECT
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
    WHERE p."userId" = $1
    GROUP BY p."id", u."name", u."id", u."userPhoto"
    ORDER BY p."createdAt" DESC
    LIMIT 20`,
    [userId]
  );
}

function searchUser(search, userId) {
  const params = `%${search}%`;

  return connection.query(
    `SELECT "users".id, "users"."name", "users"."userPhoto",
    ("followers".id IS NOT NULL) as "following"
    FROM users
    LEFT JOIN "followers" ON "followers"."mainUserId" = $1 AND "followers"."followingUserId" = "users".id
    WHERE users.name ILIKE $2
    ORDER BY "following" DESC, "users"."name"`,
    [userId, params]
  );
}

export const userRepository = {
  getUser,
  isFollowingUser,
  followUser,
  unfollowUser,
  getUserPosts,
  searchUser
}