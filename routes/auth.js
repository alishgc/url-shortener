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
        req.session.message = "Input feild should not be empty";
        return res.redirect("/auth/register");
    }
    if(username.length < 3){
        req.session.message = "Username should be at least 3 characters long";
        return res.redirect("/auth/register");
    }
    if(password.length < 8){
        req.session.message = "Password should be at least 8 characters long";
        return res.redirect("/auth/register");        
    }

    try {
        
        const [rows] = await pool.execute(
            `SELECT id FROM users WHERE username = ? OR email = ?`,[username, email]);
        
        if(rows.length > 0) {
            req.session.message = "Username or email already exists.";
            return res.redirect("/auth/register");
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        await pool.execute(`INSERT INTO users (username, email, password) VALUES (?,?,?)`,[username, email, hashedPassword])
    
        req.session.message = "Registration successful!";
        res.redirect("/auth/login");
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
        req.session.message = "Input feild should not be empty";
        return res.redirect("/auth/login");
    }

    try {
        const [rows] = await pool.execute(`
            SELECT id, username, password
            FROM users
            WHERE email = ?`,[email]);
    
        if(rows.length === 0){
            req.session.message = "Invalid email or password.";
            return res.redirect("/auth/login");
        }
    
        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
    
        if (!passwordMatch) {
            req.session.message = "Invalid email or password.";
            return res.redirect("/auth/login");
        }
        req.session.userId = user.id;
        res.redirect("/dashboard");
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
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