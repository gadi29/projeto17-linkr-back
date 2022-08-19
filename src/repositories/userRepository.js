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

function getFollowingUsers(mainUserId) {
  return connection.query(
    `SELECT "followingUserId" FROM "followers" WHERE "mainUserId" = $1`,
    [mainUserId]
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
  return connection.query(`
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
  WHERE p."userId" = $1
  GROUP BY p."id", u."name", u."id", u."userPhoto", tl."id", tl."userId", tl."repost"
  ORDER BY "T_id" DESC`,
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
  getFollowingUsers,
  isFollowingUser,
  followUser,
  unfollowUser,
  getUserPosts,
  searchUser
}