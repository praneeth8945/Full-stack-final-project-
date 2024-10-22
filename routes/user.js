const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  const { UserName,Email, RollNumber, RoomNumber, PhoneNumber, Password } = req.body;
    console.log(UserName,Email, RollNumber, RoomNumber, PhoneNumber, Password);
  // Basic validation for required fields
  if (!UserName ||!Email|| !RollNumber || !RoomNumber || !PhoneNumber || !Password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    // Check if user with this RollNumber already exists
    const existingUser = await User.findOne({ RollNumber });
    if (existingUser) {
      return res.status(400).json({ message: "User with this Roll Number already exists" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    // Create a new user object
    const newUser = new User({
      UserName,
      Email,
      RollNumber,
      RoomNumber,
      PhoneNumber,
      Password: hashedPassword // Store hashed password
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Error registering user:", err); // Log the error for debugging
    res.status(500).json({ message: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
    const { RollNumber, Password } = req.body;
  
    // Basic validation for required fields
    if (!RollNumber || !Password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
  
    try {
      // Check if the user exists by RollNumber
      const user = await User.findOne({ RollNumber });
      if (!user) {
        return res.status(400).json({ message: "Invalid Roll Number or password" });
      }
  
      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(Password, user.Password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Roll Number or password" });
      }
  
      // If the password matches, send success response (optionally include user data)
      res.status(200).json({ message: "Login successful", user });
    } catch (err) {
      console.error("Error logging in user:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  
// Get all users
router.get('/getUsers', async (req, res) => {
      try{
        const users = await User.find();
        res.json(users);
      }catch(e){
        res.status(500).json({message: e.message})

      }
})
            
            module.exports = router;
