const router = require("express").Router();
const passport = require("passport");

router.get("/google",
    passport.authenticate("google", { scope:["profile", "email"] })
);

router.get("/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173?error=invalid_email"}`,
        failureMessage: true
    }),

    (req, res) => {
        res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173/feed"}`);
    }
);

router.get("/me", (req, res) => {
    if(!req.user) {
        return res.status(401).json({
            user: null
        });
    }

    res.json(req.user);
});

router.get("/logout", (req, res, next) => {
    req.logout(function(err){
        if(err) return next(err);

        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.json({message: "Logged out"});
        });
    });
});

module.exports = router;
