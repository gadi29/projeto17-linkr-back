import { userRepository } from "../repositories/userRepository.js";

export async function getUserPage (req, res) {
  const { id } = req.params;

  try {
    const { rows: user } = await userRepository.getUser(id);
    const { rows: posts } = await userRepository.getUserPosts(id);
    res.status(200).send({ ...user[0], posts: [...posts] });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function searchUsers(req, res) {
  const search = req.query.user;

  try {
    const { rows: users } = await userRepository.searchUser(search);
    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}