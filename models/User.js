const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    dob: {
        type: Date,
        required: false
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
}, {
    timestamps: true // This adds createdAt and updatedAt fields
});


module.exports = mongoose.model("User", UserSchema);