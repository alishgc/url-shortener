const express = require("express");
const router = express.Router();

const pool = require("../db/db");
const requireAuth = require("../middleware/auth");

const crypto = require("crypto");

router.post("/", requireAuth, async (req, res)=>{

    const userId = req.session.userId;
    const url = req.body.url;

    try {
        const parsedUrl = new URL(url);

        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
            return res.status(400).send("Only HTTP and HTTPS URLs are allowed");
    }
    } catch {
        return res.status(400).send("Invalid URL");
    }

    for (let attempt = 0; attempt < 5; attempt++) {

        const shortCode = crypto.randomBytes(4).toString("base64url");

        try {
            await pool.execute(`INSERT INTO urls (user_id, original_url, short_code) VALUES (?, ?, ?)`, [userId, url, shortCode]);
            req.session.message = "URL shortened successfully!";
            return res.redirect("/dashboard");
            
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY"){
                continue;
            }
            return res.status(500).send("Something went wrong");
        }
    }

    return res.status(500).send("Could not generate a unique short URL");

});

router.post("/:id", requireAuth, async (req, res)=> {

    const id = req.params.id;

    const userId = req.session.userId;

    try {
        
        const [result] = await pool.execute(`
            DELETE FROM urls 
            WHERE id = ?
            AND user_id = ?
            `,[id, userId] 
        );
    
        if(result.affectedRows === 0){
            req.session.message = "URL not found.";
            return res.redirect("dashboard");
        }

        req.session.message = "URL deleted successfully!";
        res.redirect("/dashboard");

    } catch (error) {
        console.error(error);
        res.status(500).send("Something Went Wrong");
    }


});

module.exports = router;