import connection from "../db/database.js";
import { generateToken } from "../jwtToken.js";
import bcrypt from "bcrypt";

export async function signUp(req, res) {
  try {
    const { name, email, password, userPhoto } = req.body;
    const passwordHash = bcrypt.hashSync(password, 10);

    await connection.query(
      `INSERT INTO users (name, email, password, "userPhoto") VALUES ($1 , $2 , $3, $4)`,
      [name, email, passwordHash, userPhoto]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function signIn(req, res) {
  const userData = res.locals.session;
  const token = generateToken(userId);

  if (token) {
    await connection.query(
      `INSERT INTO "sessions" ("userId", "token") VALUES ($1 , $2)`,
      [userData.id, token]
    );
    let userDataObj = {
      userId:userData.id,
      name: userData.name,
      token: token,
      userPhoto: userData.userPhoto,
    };
    return res.status(200).send(userDataObj);
  }
  res.sendStatus(500);
}
