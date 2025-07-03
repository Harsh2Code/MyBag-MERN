const express = require("express");
const router = express.Router();

// Basic route with error handling
router.get("/", (req, res) => {
    try {
        // Attempt to render the page
        res.render("Navbar", {
            title: "Home Page"
        });
    } catch (error) {
        // 1. Log the error (helpful for debugging)
        console.log("Error:", error.message);
        
        // 2. Send error response to client
        res.status(500).send("Something went wrong");
    }
});

// Route with parameter validation
router.get("/user/:id", (req, res) => {
    try {
        const userId = req.params.id;
        
        // Basic validation
        if (!userId || isNaN(userId)) {
            throw new Error("Invalid user ID");
        }
        
        res.send(`User profile: ${userId}`);
    } catch (error) {
        console.log("Error:", error.message);
        res.status(400).send(error.message); // 400 = Bad Request
    }
});

// Simple 404 handler
router.use((req, res) => {
    res.status(404).send("Page not found");
});

module.exports = router;
