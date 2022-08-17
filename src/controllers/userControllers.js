import { userRepository } from "../repositories/userRepository.js";

export async function getUserPage (req, res) {
  const userId = parseInt(req.params.id);
  const mainUserId = parseInt(res.locals.session.userId);
  let followingUser;

  try {
    const { rows: userPosts, rowCount: userPostsQtd } = await userRepository.getUserPosts(userId);
    const { rowCount: following } = await userRepository.isFollowingUser(mainUserId, userId);
    
    if (mainUserId === userId) {
      followingUser = null;
    } else if (following === 0) {
      followingUser = false;
    } else if (following === 1) {
      followingUser = true;
    }

    if(userPostsQtd === 0) {
      const { rows: user } = await userRepository.getUser(userId);
      return res.status(200).send([...user, {following: followingUser}]);
    }

    res.status(200).send([...userPosts, {following: followingUser}]);
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