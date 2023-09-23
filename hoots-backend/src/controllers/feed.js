const { Op } = require("sequelize");
const { User, Tweet, Follower, sequelize } = require("../sequelize");
const { getMyLikes } = require("./user/globals");

module.exports = {
  getFeed: async (req, res) => {
    // query -> {userId}
    if (!req.query.userId)
      return res.status(400).json({ errors: 'userId is required' });

    module.exports.getMyFollowing(req.query.userId).then((response) => {
      const following = [];
      response.forEach((el) => following.push(el.id));
      Promise.all([
        module.exports.getTweets(following),
        module.exports.getLikes(following),
        getMyLikes(req.query.userId),
      ]).then((values) => {
        let likeSet = new Set();
        values[2].map((tweet) => likeSet.add(tweet.tweetId));

        let tweets = values[0];
        const uniqueSet = new Set();
        tweets = tweets.filter((tweet) => {
          if (uniqueSet.has(tweet["Tweets.id"])) return false;
          uniqueSet.add(tweet["Tweets.id"]);
          return true;
        });
        tweets.sort(
          (a, b) =>
            new Date(b["Tweets.createdAt"]) - new Date(a["Tweets.createdAt"])
        );
        tweets = tweets.map((tweet) => {
          let deepCopy = { ...tweet };
          if (likeSet.has(tweet["Tweets.id"])) deepCopy.selfLiked = true;
          return deepCopy;
        });

        return res.status(200).json({ tweets: tweets });
      });
    });
  },
  whoFollow: async (req, res) => {
    console.log("follow");
    // query -> {userId}
    // Get my following and don't select
    const following = `SELECT Users.id FROM Users INNER JOIN Followers ON Users.id = Followers.followed WHERE follower = '${req.query.userId}'`;
    const whoFollow = await User.findAll({
      attributes: ["id", "firstname", "lastname", "username", "avatar"],
      where: {
        id: {
          [Op.not]: req.query.userId,
          [Op.notIn]: sequelize.literal(`(${following})`),
        },
      },
      limit: 5,
    });
    return res.status(200).json({ whoFollow });
  },
  getMyFollowing: async (id) => {
    const users = await User.findAll({
      attributes: ["id"],
      include: {
        model: Follower,
        as: "Following",
        required: true,
        attributes: [],
        where: {
          follower: id,
        },
      },
      raw: true,
    });
    return users;
  },
  getTweets: async (following) => {
    const tweets = await User.findAll({
      attributes: ["firstname", "lastname", "username", "avatar"],
      include: {
        model: Tweet,
        required: true,
        where: {
          userId: {
            [Op.in]: following,
          },
        },
      },
      raw: true,
    });
    return tweets;
  },
  getLikes: async (following) => {
    const tweetIds = `SELECT Tweets.id from Tweets INNER JOIN Likes ON Tweets.id = Likes.tweetId WHERE Likes.userId IN (${
      following.length ? following.map((el) => "'" + el + "'").toString() : null
    })`;
    const tweets = await User.findAll({
      attributes: ["firstname", "lastname", "username", "avatar"],
      include: {
        model: Tweet,
        required: true,
        where: {
          id: {
            [Op.in]: sequelize.literal(`(${tweetIds})`),
          },
        },
      },
      raw: true,
    });
    return tweets;
  },
};
