const express = require('express');
const router = express.Router();
const DailyServiceRequests = require('../models/requestAvailability');
router.post('/services', async (req, res) => {
  const { date, serviceType } = req.body;
  if (!date) {
    return res.status(400).json({ message: "Please provide a date" });
  }
  if (!serviceType) {
    return res.status(400).json({ message: "Please provide a serviceType" });
  }
    try {
        let serviceRequests = await DailyServiceRequests.findOne({ date });
        if (!serviceRequests) {
            serviceRequests = new DailyServiceRequests({
            date: date,
            services: [
            { serviceType: "Room Cleaning", count: 0 },
            { serviceType: "Bathroom Cleaning", count: 0 }
            ]
        });
      await serviceRequests.save();
      console.log('New service request created:', serviceRequests);
    }
    const service = serviceRequests.services.find(s => s.serviceType === serviceType);

    if (!service) {
      return res.status(404).json({ message: `No service requests found for ${serviceType} on this date` });
    }
    res.json({ serviceType: serviceType, count: service.count });
  } catch (err) {
    console.error("Error fetching service requests:", err);
    res.status(500).json({ message: err.message });
  }
});


router.post('/AddService', async (req, res) => {
    try {
      const { date, name,serviceType ,rollNumber,roomNumber,phoneNumber} = req.body;
      console.log(date,name,serviceType,rollNumber,roomNumber,phoneNumber);
      // Validate input
      if (!date) {
        return res.status(400).json({ message: "Please provide a date" });
      }
      if (!serviceType) {
        return res.status(400).json({ message: "Please provide a serviceType" });
      }  
      // Find the record for the specific date
      let serviceDate = await DailyServiceRequests.findOne({ date });
  
      // If no record exists for the date, create a new one
      if (!serviceDate) {
        serviceDate = new DailyServiceRequests({
          date: date,
          services: [
            { serviceType: "Room Cleaning", count: 0 },
            { serviceType: "Bathroom Cleaning", count: 0 }
          ]
        });
        await serviceDate.save();
      }
      const service = serviceDate.services.find(s => s.serviceType === serviceType);
      if (service) {
        service.count++;
        fetch('http://localhost:5000/api/tasks/addPending', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "rollNumber": rollNumber,
                                  "roomNumber": roomNumber,
                                  "name":name,
                                  "phoneNumber": phoneNumber,
                                  "serviceName": serviceType,
                                  "date": date})
      })
      .then(response => response.json())
      .then(data => {
          console.log('Response from another route:', data);
      })
      .catch(err => console.error('Error:', err));
      } else {
        serviceDate.services.push({ serviceType, count: 1 });
      }
      // Save the updated record
      await serviceDate.save();
  
      // Return the updated count for the serviceType
      return res.json({message:"Created Successfully"});
    } catch (e) {
      console.error("Error adding/updating service requests:", e);
      res.status(500).json({ message: e.message });
    }
  });
  
  module.exports = router;