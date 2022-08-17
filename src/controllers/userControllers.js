import { userRepository } from "../repositories/userRepository.js";

export async function getUserPage (req, res) {
  const userId = parseInt(req.params.id);

  try {
    const { rows: userPosts, rowCount: userPostsQtd } = await userRepository.getUserPosts(userId);

    if(userPostsQtd === 0) {
      const { rows: user } = await userRepository.getUser(userId);
      return res.status(200).send([...user]);
    }

    res.status(200).send([...userPosts]);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function isFollowingUser(req, res) {
  const userId = parseInt(req.params.id);
  const mainUserId = parseInt(res.locals.session.userId);
  let followingUser;

  try {
    const { rowCount: following } = await userRepository.isFollowingUser(mainUserId, userId);

    if (mainUserId === userId) {
      followingUser = null;
    } else if (following === 0) {
      followingUser = false;
    } else if (following === 1) {
      followingUser = true;
    }

    res.status(200).send({following: followingUser});

  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function followUser(req, res) {
  const userId = parseInt(req.params.id);
  const mainUserId = parseInt(res.locals.session.userId);

  try {
    await userRepository.followUser(mainUserId, userId);
    res.sendStatus(201);

  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function unfollowUser(req, res) {
  const userId = parseInt(req.params.id);
  const mainUserId = parseInt(res.locals.session.userId);
  
  try {
    await userRepository.unfollowUser(mainUserId, userId);
    res.sendStatus(200);
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