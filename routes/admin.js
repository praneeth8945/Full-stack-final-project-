const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


// Sample admin credentials (username and hashed password)
const adminCredentials = {
    username: 'admin', // Change this to your desired admin username
    password: '$2a$10$QFLcp4pCzS7kT/dWPLZ/m.eTHGZKlBWVpbm8mp2pFwZyFR/ZOas5G' // Hash of 'password123'
};

// Admin login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Check if the username matches
    if (username !== adminCredentials.username) {
        return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }

    // Check if the password matches using bcrypt
    const isMatch = await bcrypt.compare(password, adminCredentials.password);
    if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }

    // If login is successful, send success response
    res.json({ success: true, message: 'Login successful' });
});

module.exports = router;
