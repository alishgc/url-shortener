require("dotenv").config();
const express = require("express");
const app = express();

const session = require('express-session')

const authRouter = require("./routes/auth")

const PORT = process.env.PORT;

const pool = require("./db/db")

app.set("view engine", "ejs");

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter)


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
    res.send(`Server is running!`);
});

const requireAuth = require("./middleware/auth");

app.get("/dashboard", requireAuth, (req, res) => {
    res.send(`Welcome! Your user ID is ${req.session.userId}`);
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});