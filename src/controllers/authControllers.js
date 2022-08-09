import connection from "../db/database.js";
import { generateToken } from "../jwtToken.js";
import bcrypt from "bcrypt";

export async function signUp(req, res) {
  try {
    const { name, email, password,userPhoto } = req.body;
    const passwordHash = bcrypt.hashSync(password, 10);

    await connection.query(
      `INSERT INTO users (name, email, password, "userPhoto") VALUES ($1 , $2 , $3, $4)`
      ,[name, email, passwordHash, userPhoto]
    );

    res.sendStatus(201);
  } catch(error) {
    console.log(error)
    res.sendStatus(500);
  }
}

export async function signIn(req, res) {
  const token = generateToken(req.body);
  if (token) {
    return res.status(200).send(token);
  }
  res.sendStatus(500);
}
