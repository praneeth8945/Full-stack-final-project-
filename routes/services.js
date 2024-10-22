const express = require('express');
const Service = require('../models/service');
const router = express.Router();

// Create a new service request
router.post('/create', async (req, res) => {
  const { rollNumber, serviceType, description } = req.body;

  console.log('Received data:', req.body); // Log the incoming data to check if it's correct

  try {
    const newService = new Service({ rollNumber, serviceType, description });
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    console.error('Error saving service:', err); // Log the error for debugging
    res.status(500).json({ message: err.message });
  }
});

// Get all service requests
router.get('/all', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    console.error('Error fetching services:', err); // Log the error for debugging
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
