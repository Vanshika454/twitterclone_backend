const User = require('../../models/User');
const Tweet = require('../../models/Tweet')

const { validateEditUser } = require('./services/validate-request');

// Get user details
module.exports.getUser = async (req, res) => {
    const userId = req.params.id;
    if(!userId) {
        res.status(400).send('Please provide a valid user ID');
        return;
    }   

    try {
        const user = await User.findById(userId);
        if(!user) {
            res.status(400).send('User does not exist!');
            return;
        }

        const {password, ...userData} = user.toObject();
        res.status(200).send(userData);
    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
};

// Following user
module.exports.followUser = async (req, res) => {
    const userId = req.params.id;
    if(!userId) {
        res.status(400).send('Please provide a valid user ID');
        return;
    }   

    

    try {
        const loggedInUser = req.user;
        const followingUser = await User.findById(userId);
        if(!followingUser) {
            res.status(400).send('User does not exist!');
            return;
        }

        if(loggedInUser.following.includes(followingUser._id)) {
            res.status(400).send('Already following this user!');
            return;
        }

        loggedInUser.following = [ ...loggedInUser.following, followingUser ];
        followingUser.followers = [ ...followingUser.followers, loggedInUser ];

        await loggedInUser.save();
        await followingUser.save();

        res.status(200).send({
            success: true,
            message: 'Following successfully!'
        })
    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
}

//Unfollowing user
module.exports.unfollowUser = async (req, res) => {
    const userId = req.params.id;
    if(!userId) {
        res.status(400).send('Please provide a valid user ID');
        return;
    }   

    try {
        const loggedInUser = req.user;
        const followingUser = await User.findById(userId);
        if(!followingUser) {
            res.status(400).send('User does not exist!');
            return;
        }

        if(!loggedInUser.following.includes(followingUser._id)) {
            res.status(400).send('You are not following this user to unfollow!');
            return;
        }

        loggedInUser.following = loggedInUser.following.filter(id => !id.equals(followingUser._id));
        followingUser.followers = followingUser.followers.filter(id => !id.equals(loggedInUser._id));

        await loggedInUser.save();
        await followingUser.save();

        res.status(200).send({
            success: true,
            message: 'Unfollowed successfully!'
        })
    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
}

//edit details
module.exports.editUser = async (req, res) => {
    const { name, dob, location } = req.body;

    try {
        validateEditUser(name, dob, location);
    } catch (error) {
        res.status(400).send(error.message);
        return;
    }

    const userId = req.params.id;
    const user = req.user;

    if(user._id.toString() !== userId) {
        res.status(401).send('You are not authorized to edit this user!');
        return;
    }

    try {
        user.name = name;
        user.dob = dob;
        user.location = location;

        await user.save();

        res.status(200).send({
            success: true,
            message: 'User details updated successfully!'
        })
    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
}

//Tweets by user
module.exports.getTweetsByUser = async (req, res) => {
    const userId = req.params.id;
    if(!userId) {
        res.status(400).send('Please provide a valid user ID');
        return;
    }   

    try {
        const user = await User.findById(userId);
        if(!user) {
            res.status(400).send('User does not exist!');
            return;
        }

        const tweets = await Tweet.find({ tweetedBy: userId._id });
        res.status(200).send(tweets);
    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
}

module.exports.uploadProfilePic = async (req, res) => {
    const userId = req.params.id;
    const user = req.user;

    if(user._id.toString() !== userId) {
        res.status(401).send('You are not authorized to edit this user!');
        return;
    }

    if(!req.body?.fileName) {
        res.status(400).send('Please upload a profile picture!');
        return;
    }

    try {
        user.profilePicture = `/images/${req.body?.fileName}`;
        await user.save();
    
        res.send({
            success: true,
            message: 'Profile picture uploaded successfully!',
        });
    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
}