const mongoose = require('mongoose');

let TweetSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    tweetedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    retweetBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    image: {
        type: String,
        required: false
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet',
        default: []
    }],
}, {
    timestamps: true // This adds createdAt and updatedAt fields
});


module.exports = mongoose.model("Tweet", TweetSchema);