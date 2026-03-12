const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        required: true
    },
    Name: String,
    username: {
        type: String,
        unique: true,
        required: true
    },
    bio: String,
    branch: String,
    college: String,
    profilePic: {
        type: String,
        default: '/images/default_avatar.png'
    },
    Followers: {
        type: [String],
        default: []
    },
    Following: {
        type: [String],
        default: []
    },
    saved: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Post",
        default: []
    },
    notifications: {
        type: [
            {
                senderName: { type: String },
                type: { type: String },
                postId: { type: String },
                read: { type: Boolean, default: false },
                createdAt: { type: Date, default: Date.now }
            }
        ],
        default: []
    }
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);