const Tweet = require('../../models/Tweet');
const User = require('../../models/User');

//Create a tweet
module.exports.createTweet = async (req, res) => {
    const content = req.body.content;
    if(!content) {
        res.status(400).send('Please provide a content');
        return;
    }

    try {
        const user = req.user;
        const tweet = await Tweet.create({
            content,
            image: req.body?.fileName? `/images/${req.body?.fileName}` : '',
            tweetedBy: user
        });

        res.status(200).send({
            success: true,
            message: 'Tweet created successfully!',
            tweet: tweet
        });
    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
};

//Like a tweet
module.exports.likeTweet = async (req, res) => {
    const tweetId = req.params.id;
    if(!tweetId) {
        res.status(400).send('Please provide a tweet ID');
        return;
    }

    try {
        const user = req.user;
        const tweet = await Tweet.findById(tweetId);
        if(!tweet) {
            res.status(400).send('Tweet does not exist!');
            return;
        }

        if(tweet.likes.includes(user._id)) {
            res.status(400).send('Already liked this tweet!');
            return;
        }

        tweet.likes = [ ...tweet.likes, user ];
        await tweet.save();

        res.status(200).send({
            success: true,
            message: 'Tweet liked successfully!'
        })
    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
}

//DisLike a tweet
module.exports.dislikeTweet = async (req, res) => {
    const tweetId = req.params.id;
    if(!tweetId) {
        res.status(400).send('Please provide a tweet ID');
        return;
    }

    try {
        const user = req.user;
        const tweet = await Tweet.findById(tweetId);
        if(!tweet) {
            res.status(400).send('Tweet does not exist!');
            return;
        }

        if(!tweet.likes.includes(user._id)) {
            res.status(400).send('You have not liked this tweet yet!');
            return;
        }

        tweet.likes = tweet.likes.filter(like => like.toString() !== user._id.toString());
        await tweet.save();

        res.status(200).send({
            success: true,
            message: 'Tweet disliked successfully!'
        })
    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
}

//Reply on a tweet
module.exports.replyTweet = async (req, res) => {
    const tweetId = req.params.id;
    const content = req.body.content;
    if(!tweetId || !content) {
        res.status(400).send('Please provide a tweet ID and content');
        return;
    }

    try {
        const user = req.user;
        const tweet = await Tweet.findById(tweetId);
        if(!tweet) {
            res.status(400).send('Tweet does not exist!');
            return;
        }

        const reply = await Tweet.create({
            content,
            tweetedBy: user,
        });

        tweet.replies = [ ...tweet.replies, reply ];
        await tweet.save();

        res.status(200).send({
            success: true,
            message: 'Tweet replied successfully!',
            tweet: reply
        });
    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
}

//Get Tweet by ID
module.exports.getTweet = async (req, res) => {
    const tweetId = req.params.id;
    if(!tweetId) {
        res.status(400).send('Please provide a tweet ID');
        return;
    }

    try {
        const tweet = await Tweet.findById(tweetId).populate('tweetedBy', '-password').populate('likes', '-password').populate('retweetBy', '-password').populate({ path: 'replies', populate: { path: 'tweetedBy', select: '-password' } });

        if(!tweet) {
            res.status(400).send('Tweet does not exist!');
            return;
        }

        res.status(200).send(tweet);
    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
}

//Get all tweets
module.exports.getAllTweets = async (req, res) => {
    try {
        const tweets = await Tweet.find().populate('tweetedBy', '-password').populate('likes', '-password').populate('retweetBy', '-password').populate('replies').sort({ createdAt: -1 });
        res.status(200).send(tweets);
    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
}

//Delete a tweet
module.exports.deleteTweet = async (req, res) => {
    const tweetId = req.params.id;
    if(!tweetId) {
        res.status(400).send('Please provide a tweet ID');
        return;
    }

    try {
        const user = req.user;
        const tweet = await Tweet.findById(tweetId);
        if(!tweet) {
            res.status(400).send('Tweet does not exist!');
            return;
        }

        if(tweet.tweetedBy.toString() !== user._id.toString()) {
            res.status(401).send('You are not authorized to delete this tweet!');
            return;
        }

        await Tweet.findByIdAndDelete(tweetId);
        res.status(200).send({
            success: true,
            message: 'Tweet deleted successfully!'
        });
    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
}

//Retweet a tweet
module.exports.retweet = async (req, res) => {
    const tweetId = req.params.id;
    if(!tweetId) {
        res.status(400).send('Please provide a tweet ID');
        return;
    }

    try {
        const user = req.user;
        const tweet = await Tweet.findById(tweetId);
        if(!tweet) {
            res.status(400).send('Tweet does not exist!');
            return;
        }

        if(tweet.retweetBy.includes(user._id)) {
            res.status(400).send('Already retweeted this tweet!');
            return;
        }

        tweet.retweetBy = [ ...tweet.retweetBy, user ];
        await tweet.save();

        res.status(200).send({
            success: true,
            message: 'Tweet retweeted successfully!'
        });
    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
}