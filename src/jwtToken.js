import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export function generateToken(userId, res) {
  try {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    return jwt.sign({userId}, jwtSecretKey, { expiresIn: "1 d" });
  } catch(error) {
    console.log(error)
    return false;
  }
}

export function validateToken(token) {
  try {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    jwt.verify(token, jwtSecretKey);
    return true;
  } catch(error) {
    console.log(error)
    return false;
  }
}
