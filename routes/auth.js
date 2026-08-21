const express = require("express");

const router = express.Router();

const bcrypt = require("bcrypt")

const pool = require("../db/db")

router.get("/register", (req, res)=>{
    res.render("register");
});


router.post("/register", async (req, res) => {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim();
    const password = req.body.password;


    if (!username || !email || !password) {
        return res.status(400).send("Input feild should not be empty");
    }
    if(username.length < 3){
        return res.status(400).send("Username should be at least 3 characters long");
    }
    if(password.length < 8){
        return res.status(400).send("Passwoed should be at least 8 characters long");
        
    }

    try {
        
        const [rows] = await pool.execute(
            `SELECT id FROM users WHERE username = ? OR email = ?`,[username, email]);
        
        if(rows.length > 0) {
            return res.status(409).send("Username or email already exists.");
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        await pool.execute(`INSERT INTO users (username, email, password) VALUES (?,?,?)`,[username, email, hashedPassword])
    
        res.send("Registration successful!");
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }

});

router.get("/login", (req, res)=>{
    res.render("login");
});

router.post("/login", async (req, res) => {

    const email = req.body.email?.trim();
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).send("Input feild should not be empty");
    }

    const [rows] = await pool.execute(`
        SELECT id, username, password
        FROM users
        WHERE email = ?`,[email]);

    if(rows.length === 0){
        return res.send("Invalid email or password.")
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res.status(401).send("Invalid email or password.");
    }
    req.session.userId = user.id;
    res.redirect("/dashboard");
});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Something went wrong");
        }

        res.redirect("/auth/login");
    });
});
module.exports = router;