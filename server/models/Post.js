const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ["discussion", "placement", "event", "confession", "general"],
    required: true,
  },
  title: String,
  content: String,
  mediaUrl: String,
  mediaType: String,
  anonymous: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: [String],
    default: []
  },
  comments: [
    {
      user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      text: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  image: String,
  reports: [reportSchema],
  isFlagged: { type: Boolean, default: false },
  college: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);