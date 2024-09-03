const express = require('express');
const router = express.Router();

const { auth } = require('../middlewares/auth');
const { upload, multerErrorHandler } = require('../middlewares/multer');
const tweetController = require('../controllers/tweet/tweetController');

//Create a tweet
router.post("/", auth, upload.single('image'), tweetController.createTweet);

//Like a tweet
router.post("/:id/like", auth, tweetController.likeTweet);

//DisLike a tweet
router.post("/:id/dislike", auth, tweetController.dislikeTweet);

//Reply on a tweet
router.post("/:id/reply", auth, tweetController.replyTweet);

//Get Tweet by ID
router.get("/:id", auth, tweetController.getTweet);

//Get all tweets
router.get("/", auth, tweetController.getAllTweets);

//Delete a tweet
router.delete("/:id", auth, tweetController.deleteTweet);

//Retweet a tweet
router.post("/:id/retweet", auth, tweetController.retweet);

router.use(multerErrorHandler);

module.exports = router;