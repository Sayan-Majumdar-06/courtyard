const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport')
const session = require("express-session");
require("./config/passport");
const cors = require('cors');
require("dotenv").config();
const MongoStore = require('connect-mongo').default;

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
]
app.use(cors({
    origin: function (origin, callback) {
        if(!origin) return callback(null, true);

        if(allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }

        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

app.use(
    session({
        secret: "SESSION_SECRET",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: "sessions"
        }),
        cookie: {
            maxAge: 1000*60*60*24
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({limit: "10mb", extended: true}));

const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");
app.use("/api/posts", postRoutes);
app.use("/api/profile", userRoutes);
app.use("/auth", require("./routes/auth"));
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
    .then( () => { console.log("MongoDB connected"); })
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("API is running");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

