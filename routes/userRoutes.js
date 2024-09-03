const express = require('express');
const router = express.Router();

const { auth } = require('../middlewares/auth');
const { upload, multerErrorHandler } = require('../middlewares/multer');
const userController = require('../controllers/user/userController');

//Get user Details by ID
router.get("/:id", auth, userController.getUser);

//Follow user
router.post("/:id/follow", auth, userController.followUser);

//Unfollow user
router.post("/:id/unfollow", auth, userController.unfollowUser);

//Edit user
router.put("/:id", auth, userController.editUser);

//Get user Tweets
router.get("/:id/tweets", auth, userController.getTweetsByUser);

//Upload profile picture
router.post("/:id/uploadProfilePic", auth, upload.single('profilePic'), userController.uploadProfilePic);

router.use(multerErrorHandler);

module.exports = router;