import connection from "../db/database.js";
import urlMetadata from "url-metadata";
import findHashtags from "find-hashtags";

async function getTimelinePosts(userId) {
  const { rows: timelinePosts } = await connection.query(
    `
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
    (SELECT COALESCE(COUNT(tl."postId"),0)::INT AS "repostCount" FROM "timeline" tl WHERE tl."postId" = p.id AND repost=true),
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
    GROUP BY p."id", u."name", u."id", u."userPhoto", tl."id", tl."userId", tl."repost"
    ORDER BY "T_id" DESC;`,
    [userId]
  );

  return timelinePosts;
}

async function createPost(userId, postText, postUrl) {
  try {
    const metadataObj = await urlMetadata(postUrl, {
      encode: "UTF-8",
      descriptionLength: 500,
    });
    const urlTitle = metadataObj.title;
    const urlDescription = metadataObj.description;
    const urlImage = metadataObj.image;

    const { rows: postId } = await connection.query(
      `INSERT INTO "posts" ("userId", "postText", "postUrl", "urlTitle", "urlDescription", "urlImage") 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING "id"`,
      [userId, postText, postUrl, urlTitle, urlDescription, urlImage]
    );

    await connection.query(
      `
      INSERT INTO "timeline" ("userId", "postId", "repost")
      VALUES ($1, $2, $3)`,
      [userId, postId[0].id, false]
    );

    const hashtagsList = findHashtags(postText);

    for (let i = 0; i < hashtagsList.length; i++) {
      const { rows: hashtagDB } = await connection.query(
        `
                SELECT * FROM "hashtags" 
                WHERE "hashtags"."name" = $1`,
        [hashtagsList[i]]
      );

      if (hashtagDB.length === 0) {
        const { rows: hashtagId } = await connection.query(
          `
                    INSERT INTO "hashtags" ("name")
                    VALUES ($1)
                    RETURNING "id"`,
          [hashtagsList[i]]
        );

        await connection.query(
          `
                    INSERT INTO "postHashtag" ("hashtagId", "postId")
                    VALUES ($1, $2)`,
          [hashtagId[0].id, postId[0].id]
        );
      } else {
        await connection.query(
          `
                    INSERT INTO "postHashtag" ("hashtagId", "postId")
                    VALUES ($1, $2)`,
          [hashtagDB[0].id, postId[0].id]
        );
      }
    }

    const timelinePosts = await getTimelinePosts();

    return timelinePosts;
  } catch (error) {
    console.log(error);
  }
}

function getUserPost(postId, userId) {
  return connection.query(
    `
        SELECT * FROM "posts" WHERE id = $1 AND "userId" = $2`,
    [postId, userId]
  );
}

function repostPost(postId, userId) {
  return connection.query(
    `
    INSERT INTO "timeline" ("userId", "postId", "repost")
            VALUES ($1, $2, true)`,
    [userId, postId]
  );
}

async function deletePost(postId) {
  await connection.query(`DELETE FROM "postHashtag" WHERE "postId" = $1`, [
    postId,
  ]);

  await connection.query(`DELETE FROM "timeline" WHERE "postId" = $1`, [
    postId,
  ]);

  await connection.query(`DELETE FROM "likes" WHERE "postId" = $1`, [postId]);

  await connection.query(`DELETE FROM "posts" WHERE id = $1`, [postId]);
}

function editPost(newPostText, postId) {
  return connection.query(
    `
    UPDATE "posts" SET "postText"=$1 WHERE id=$2`,
    [newPostText, postId]
  );
}

const timelineRepository = {
  getTimelinePosts,
  createPost,
  getUserPost,
  deletePost,
  editPost,
  repostPost,
};

export default timelineRepository;
