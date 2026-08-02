require("dotenv").config();
const express = require("express");
const app = express();

const PORT = process.env.PORT;

const pool = require("./db/db")

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));


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
    res.send(`Server is running! ${rows}`);
});




app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});