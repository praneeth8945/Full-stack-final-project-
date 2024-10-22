const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true },
  serviceType: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  requestedAt: { type: Date, default: Date.now },
  assignedTo: { type: String, default: null },
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
