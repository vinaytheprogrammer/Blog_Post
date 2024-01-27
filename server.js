const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const userRoutes = require("./routes/users/users");
const postRoutes = require("./routes/posts/posts");
const commentRoutes = require("./routes/comments/comment");
const globalErrHandler = require("./middleware/globalHandler");
const session = require("express-session");
const MongoStore = require("connect-mongo");


require("./config/dbConnect");

const app = express();
// app.set("view engine","ejs");
app.use(express.json());
// app.use(express.static(__dirname+"/public"));


// session config
app.use(session({
    secret : process.env.SESSION_KEY,
    resave : false,
    saveUninitialized : true,

    store : new MongoStore({       // Creating Problem
        mongoUrl : process.env.MONGO_URL,
        ttl : 24 * 60 * 60, // 1 day
    }),
})
);


// users route
app.use("/api/v1/users", userRoutes);

// posts route
app.use("/api/v1/posts", postRoutes);


// posts route
app.use("/api/v1/comments", commentRoutes);


// ------------------


//Error handler middlewares
app.use(globalErrHandler);


const PORT = process.env.PORT || 9000;
app.listen(PORT,console.log(`Server is running on PORT ${PORT}`));