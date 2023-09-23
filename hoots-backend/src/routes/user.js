const router = require("express").Router();
const multer = require("multer");
const upload = multer();
const {
  addUser,
  editUser,
  loginUser,
  getUserByUsername,
  getLikesByUserId,
  getTweetsByUserId,
  getMediaByUserId,
} = require("../controllers/user/user");

router.post("/add-user", addUser);
router.put("/edit-user", [upload.fields([{name: "avatar"}, {name: "cover"}])], editUser);
router.post("/login-user", loginUser);
router.get("/get-user", getUserByUsername);
router.get("/get-tweets", getTweetsByUserId);
router.get("/get-likes", getLikesByUserId);
router.get("/get-media", getMediaByUserId);

module.exports = router;
