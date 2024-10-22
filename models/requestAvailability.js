const mongoose = require('mongoose');

// Create a schema for individual service request
const serviceRequestSchema = new mongoose.Schema({
  serviceType: { type: String, required: true },
  count: { type: Number, default: 0 }
});

// Create a schema for daily service requests
const dailyServiceRequestsSchema = new mongoose.Schema({
  date: { type: String, required: true },
  services: {
    type: [serviceRequestSchema],  // Array of service requests
    default: [
      { serviceType: "Room Cleaning", count: 0 },
      { serviceType: "Bathroom Cleaning", count: 0 },
    ]
  }
});

// Create the model from the schema
const DailyServiceRequests = mongoose.model('DailyServiceRequests', dailyServiceRequestsSchema);

module.exports = DailyServiceRequests;