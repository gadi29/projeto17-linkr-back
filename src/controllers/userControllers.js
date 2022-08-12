import { userRepository } from "../repositories/userRepository.js";

export async function getUserPage (req, res) {
  const { id } = req.params;

  try {
    const { rows: userPosts, rowCount } = await userRepository.getUserPosts(id);
    
    if(rowCount === 0) {
      const { rows: user } = await userRepository.getUser(id);
      return res.status(200).send(user);
    }

    res.status(200).send([...userPosts]);
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