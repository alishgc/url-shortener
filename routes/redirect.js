const express = require("express");
const router = express.Router();

const pool = require("../db/db")

router.get("/:shortCode", async (req, res) => {

    const shortCode = req.params.shortCode;

    try {
        
        const [rows] = await pool.execute(`
            SELECT id, original_url, click_count
            FROM urls
            WHERE short_code = ?`, [shortCode]);
        
        if(rows.length === 0){
            return res.status(404).send("Short URL not found");
        }
    
        const url = rows[0];
    
        await pool.execute(`
            UPDATE urls
            SET click_count = click_count + 1
            WHERE id = ?`, [url.id]);
    
        
        res.redirect(url.original_url);
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }

});

module.exports = router;