const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Post = require("../models/Post");
const fs = require('fs');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/profile/"); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage });

router.put("/mark-notifications-read", async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      { "$set": { "notifications.$[elem].read": true } },
      { 
        arrayFilters: [{ "elem.read": false }], 
        new: true 
      }
    );

    res.status(200).json("Notifications marked as read.");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/search', async (req, res) => {
    const {q} = req.query;
    try {
        const users = await User.find({
        username: { $regex: q, $options: 'i'}}).limit(5).select('username profilePic college');

        res.json(users);
    } catch(err) {
        res.status(500).json({message: 'search failed'});
    }
})
router.put("/:id", upload.single('profilePic'), async (req, res) => {

    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const updatedData = {
            username: req.body.username,
            bio: req.body.bio,
            branch: req.body.branch,
            college: req.body.college
        };

        if (req.file) {
            if (user.profilePic && user.profilePic !== 'default_avatar.png') {
                const oldPath = path.join(__dirname, '../uploads/profile', user.profilePic);
                
                if (fs.existsSync(oldPath)) {
                    fs.unlink(oldPath, (err) => {
                        if (err) console.error("Error deleting old profile pic:", err);
                    });
                }
            }
            updatedData.profilePic = req.file.filename;
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { $set: updatedData }, 
            { new: true }
        );
        res.json(updatedUser);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

router.get("/:id", async(req, res) => {
    try{
        const {id} = req.params;
        const user = await User.findOne({ username: id })
            .populate("saved")
            .lean();

        if (!user) return res.status(404).json({ message: "User not found" });

        const posts = await Post.find({ userId: user._id, anonymous: false })
            .populate("userId", "username profilePic") 
            .sort({ createdAt: -1 });

        res.json({ user, posts });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

router.put("/:id/follow", async(req, res) => {
    try{
        const { id } = req.params;
        const currentUser = req.body.current_user;

        if(id === currentUser) {
            return res.status(400).json({ message:"You can't follow yourself" });
        }

        const userToFollow = await User.findOne({username: id});
        
        const currentUserDoc = await User.findOne({ username: currentUser });

        if(!userToFollow || !currentUserDoc) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFollowing = currentUserDoc.Following.includes(id);

        if(isFollowing) {
            currentUserDoc.Following = currentUserDoc.Following.filter(
                u => u !== id
            );

            userToFollow.Followers = userToFollow.Followers.filter(
                u => u !== currentUser
            );

        } else {
            currentUserDoc.Following.push(id);
            userToFollow.Followers.push(currentUser);
        }

        await currentUserDoc.save();
        await userToFollow.save();

        res.json({ 
            Followers: userToFollow.Followers,
            Following: currentUserDoc.Following
         });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete("/:id/delete-account", async (req, res) => {
  if (req.user._id.toString() !== req.params.id) {
    return res.status(403).json("You can only delete your own account!");
  }

  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    const userPosts = await Post.find({ userId: userId, postImg: { $exists: true, $ne: "" } });

    if (!user) return res.status(404).json("User not found");
    if (user.profilePic && user.profilePic !== 'default_avatar.png') {
      const profilePath = path.join(__dirname, "../uploads/profile", user.profilePic);
      if (fs.existsSync(profilePath)) {
        fs.unlink(profilePath, (err) => { if (err) console.error(err); });
      }
    }

    userPosts.forEach((post) => {
      const postPath = path.join(__dirname, "../uploads/posts", post.postImg);
      if (fs.existsSync(postPath)) {
        fs.unlink(postPath, (err) => { if (err) console.error(err); });
      }
    });

    await Post.updateMany(
      { likes: userId },
      { $pull: { likes: userId } }
    );

    await Post.updateMany(
      { userId: userId },
      { $set: { userId: null, postImg: "" } } 
    );

    await Post.updateMany(
        { "comments.user": userId },
        { $set: { "comments.$[elem].user": null } },
        { arrayFilters: [{ "elem.user": userId }] }
    );

    await User.findByIdAndDelete(userId);

    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      
      req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Session destroy failed" });
        
        res.clearCookie("connect.sid", { path: "/" });
        return res.json({ message: "Account deleted and files purged." });
      });
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/check-username/:username', async (req, res) => {
    const user = await User.findOne({ username: req.params.username.toString() });
    res.json({ isAvailable: !user });
})


module.exports = router;