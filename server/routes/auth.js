const router = require("express").Router();
const passport = require("passport");

router.get("/google",
    passport.authenticate("google", { 
        scope:["profile", "email"],
        prompt: 'select_account'
    })
);

router.get("/google/callback", (req, res, next) => {
    passport.authenticate("google", (err, user, info) => {

        if(err) return next(err);

        if(!user) {
            req.session.destroy();
            return res.redirect(`${process.env.FRONTEND_URL}?error=invalid_email`);
        }
        
        req.logIn(user, (err) => {
            if(err) return next(err);
            res.redirect(`${process.env.FRONTEND_URL}/feed`);
        });

    })(req, res);
});

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
