import { userRepository } from "../repositories/userRepository.js";

export async function getUserPage (req, res) {
  const { id } = req.params;

  try {
    const { rows: userPosts } = await userRepository.getUserPosts(id);
    res.status(200).send([...userPosts]);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}