const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { User } = require("../../sequelize");
const { addUserValidation } = require("../../utils/validation");
const {
  getMyLikes,
  getLikedTweets,
  getUserTweets,
} = require("./globals");
const upload = require("../upload");

module.exports = {
  tweetAttributes: [
    "id",
    "text",
    "media",
    "commentsCount",
    "likesCount",
    "createdAt",
  ],
  addUser: async (req, res) => {
    // Joi validation checks
    const validation = addUserValidation(req.body);
    if (validation.error)
      return res.status(400).json({ errors: validation.error.details });

    try {
      // Create password hash
      let saltRounds = 10;
      const hash = await bcrypt.hash(req.body.password, saltRounds);
      req.body.password = hash;

      // Add user to User model
      const user = await User.create(req.body);

      return res.status(200).json({
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          avatar: user.avatar,
          cover: user.cover,
          dob: user.dob,
          location: user.location,
          bio: user.bio,
        },
      });
    } catch (err) {
      let errors = {};
      console.log(err.errors);
      err.errors.map((e) => {
        if (e.path === "users.username" && e.validatorKey === "not_unique")
          errors.username = "Username is taken";
        if (e.path === "users.email" && e.validatorKey === "not_unique")
          errors.email = "Email id is already registered";
      });
      return res.status(400).json({ errors });
    }
  },
  editUser: async (req, res) => {
    // body -> {id, firstname, lastname, dob, media}
    console.log("files", req.files);
    const avatar = req.files.avatar ? req.files.avatar[0] : null;
    const cover = req.files.cover ? req.files.cover[0] : null;
    Promise.all([upload(avatar, "image"), upload(cover, "image")]).then(
      async (photos) => {
        const obj = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          bio: req.body.bio,
          location: req.body.location,
          dob: req.body.dob,
        };
        if (photos[0].secure_url) obj.avatar = photos[0].secure_url;
        if (photos[1].secure_url) obj.cover = photos[1].secure_url;
        try {
          const user = await User.update(obj, {
            where: { id: req.body.userId },
          });
          return res.status(200).json({ user: obj });
        } catch (error) {
          return res.status(400).json({ errors: error });
        }
      }
    );
  },
  loginUser: async (req, res) => {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: req.body.user }, { email: req.body.user }],
      },
      raw: true,
    });
    if (!user)
      return res.status(401).json({ user: "Incorrect username/email" });

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(401).json({ password: "Incorrect password" });

    return res.status(200).json({
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        avatar: user.avatar,
        cover: user.cover,
        dob: user.dob,
        location: user.location,
        bio: user.bio,
      },
    });
  },
  getUserByUsername: async (req, res) => {
    const user = await User.findOne({
      attributes: [
        "id",
        "firstname",
        "lastname",
        "username",
        "bio",
        "avatar",
        "cover",
        "location",
        "dob",
        "createdAt",
      ],
      where: {
        username: req.query.username,
      },
    });
    return res.status(200).json(user);
  },
  getTweetsByUserId: async (req, res) => {
    // body -> {userId, myId}
    /* 
      1. Get tweets. Get tweetIds and liked by me
      2. Add tweetIds of likes in 2 Sets
      3. Map over all tweets to add selfLiked -> true
    */
    Promise.all([
      getUserTweets(req.query.userId, module.exports.tweetAttributes),
      getMyLikes(req.query.myId),
    ]).then((values) => {
      const likeSet = new Set();
      values[1].map((tweet) => likeSet.add(tweet.tweetId));
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
      res.status(200).json({ tweets });
    });
  },
  getLikesByUserId: async (req, res) => {
    // body -> {userId, myId}
    /* 
      1. Get tweets liked by user and tweetIds liked by me
      2. Add tweetIds of likes in Sets
      3. Map over liked tweets to add selfLiked -> true
    */

    Promise.all([
      getLikedTweets(req.query.userId, module.exports.tweetAttributes),
      getMyLikes(req.query.myId),
    ]).then((values) => {
      let likedTweets = values[0];
      const likeSet = new Set();
      values[1].map((tweet) => likeSet.add(tweet.tweetId));
      likedTweets = likedTweets.map((tweet) => {
        let deepCopy = { ...tweet };
        if (likeSet.has(tweet["Tweets.id"])) deepCopy.selfLiked = true;
        return deepCopy;
      });
      return res.status(200).json({ tweets: likedTweets });
    });
  },
  getMediaByUserId: async (req, res) => {
    // body -> {userId, myId}
    Promise.all([
      getUserTweets(req.query.userId, module.exports.tweetAttributes),
      getMyLikes(req.query.myId),
    ]).then((values) => {
      const likeSet = new Set();
      values[1].map((tweet) => likeSet.add(tweet.tweetId));
      let tweets = values[0];
      const uniqueSet = new Set();
      tweets = tweets.filter((tweet) => {
        if (uniqueSet.has(tweet["Tweets.id"])) return false;
        if (!tweet["Tweets.media"]) return false;
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
      res.status(200).json({ tweets });
    });
  },
};
