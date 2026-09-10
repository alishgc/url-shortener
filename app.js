require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;

const pool = require("./db/db");
const session = require('express-session');

const authRouter = require("./routes/auth");
const requireAuth = require("./middleware/auth");
const urlsRouter = require("./routes/urls");
const redirectRouter = require("./routes/redirect");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => { 
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});


app.use("/auth", authRouter);
app.use("/urls", urlsRouter);

// database connection test 
async function connectDB() {
    try {
        await pool.execute("SELECT 1");
        console.log("✅ Database connected.");
    } catch (error) {
        console.error(error);
    }
}

connectDB();

app.get("/", async (req, res) => {
    res.render("index");
});



app.get("/dashboard", requireAuth, async (req, res) => {

    const userId = req.session.userId;

    try {

        const [urls] = await pool.execute(
            `SELECT id, original_url, short_code, click_count, created_at
             FROM urls
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [userId]
        );
        res.render("dashboard", { urls });

    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }

});


app.use("/", redirectRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
