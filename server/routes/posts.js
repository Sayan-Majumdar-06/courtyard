const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/posts");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadPostImage = multer({ 
  storage: storage,
  limits: { filesize: 10*1024*1024 }    
});

// Create Post
router.post("/",
    uploadPostImage.single("image"),
    async(req, res) => {
      try {
        const newPost = new Post({
          userId: req.body.userId,
          title: req.body.title,
          content: req.body.content,
          type: req.body.type,
          anonymous: req.body.anonymous === 'true',
          college: req.body.college,
          image: req.file ? `/uploads/posts/${req.file.filename}` : null
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    }
);

router.get("/", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  try {
    const userCollege = req.user.college;

    let query = { college: userCollege }; 

    if (req.query.type) {
      query.type = req.query.type;
    }

    const posts = await Post.find(query)
      .populate('userId', 'username profilePic') 
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (err) {
    console.log(err.message);
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("userId", "username profilePic") // Populate the post author
      .populate("comments.user", "username profilePic");
    res.json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id/like", async (req, res) => {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);

    if (post.userId && post.userId.toString() !== userId) {
        const postOwner = await User.findById(post.userId);
        
        if (postOwner) {
          postOwner.notifications.push({
            senderName: req.user ? req.user.username : "Someone",
            type: "liked",
            postId: post._id,
            read: false
          });
          
          if (postOwner.notifications.length > 20) {
            postOwner.notifications.shift(); 
          }

          await postOwner.save();
        }
      }
    
    const isLiked = post.likes.includes(userId);
    const update = isLiked 
        ? { $pull: { likes: userId } } 
        : { $addToSet: { likes: userId } };

    const updatedPost = await Post.findOneAndUpdate(
        { _id: req.params.id },
        update,
        { returnDocument: 'after' }
    ).populate('userId', 'username profilePic');

    res.json(updatedPost);
});

router.put("/:id/comment", async (req, res) => {
  const { id } = req.params;
  const { user, text } = req.body;

  try {
    const post = await Post.findById(id).populate("comments.user", "username profilePic");
    
    post.comments.push({
      user, 
      text
    });
    
    await post.save();

    const updatedPost = await Post.findById(id).populate("comments.user", "username profilePic");

    if (updatedPost.userId && updatedPost.userId.toString() !== user) {
        const postOwner = await User.findById(updatedPost.userId);
        
        if (postOwner) {
            postOwner.notifications.push({
                senderName: req.user ? req.user.username : "A user", 
                type: "commented",
                postId: post._id,
                read: false,
            });

            if (postOwner.notifications.length > 30) postOwner.notifications.shift();

            await postOwner.save();
        }
    }
    
    res.json(updatedPost.comments);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/:postId/save", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadySaved = user.saved.some(id => id.toString() === postId);
    const update = alreadySaved 
        ? { $pull: { saved: postId } } 
        : { $addToSet: { saved: postId } };

    const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        update,
        { returnDocument: 'after' } 
    ).select("saved username profilePic"); 

    res.json(updatedUser); 
  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/report", async (req, res) => {
  const { userId, reason } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyReported = post.reports.some(r => r.reporterId.toString() === userId);
    if (alreadyReported) {
      return res.status(400).json({ message: "You have already reported this post." });
    }

    post.reports.push({ reporterId: userId, reason });
    
    if (post.reports.length >= 5) {
      post.isFlagged = true;
    }

    await post.save();
    res.json({ message: "Post reported successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
