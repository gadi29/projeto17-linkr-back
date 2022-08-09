import { userRepository } from "../repositories/userRepository.js";

export async function getUser (req, res) {
  const { id } = req.params;

  try {
    const { rows: user } = await userRepository.getUserPosts(id);
    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}