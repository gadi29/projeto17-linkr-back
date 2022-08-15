import connection from "../db/database.js";

export async function createLike(req, res) {
  const { userId, postId,username} = req.body;
  const { user } = res.locals;
  try {
    console.log(userId, postId)
    await connection.query(
      `INSERT INTO likes ("userId", "postId", "userName") VALUES ($1, $2, $3)`,
      [userId, postId, username ]
    );
    
    return res.status(200).send("Like inserted");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function deleteLike(req, res) {
  const { idUser, postid } = req.body;
  const { user } = res.locals;
  try {
    const {rows: searchLike} = await connection.query(`select * from likes where "postId" = '${postid}' AND "userId" = '${idUser}'`)
    
    const id = searchLike[0].id
    
    await connection.query(
      `DELETE FROM likes WHERE id = ${id}
    `); 
    return res.status(200).send("Like deleted");
  } catch (error) {
    console.error(error);
   return  res.sendStatus(500);
  }
}