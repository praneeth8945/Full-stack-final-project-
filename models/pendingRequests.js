const mongoose = require('mongoose');

const pendingRequestSchema = new mongoose.Schema({
    rollNumber: {
        type: String,
        required: true
    },
    name:{
        type:String,
        required:true
    },
    roomNumber: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    dateOfCreation: {
        type: String,
        required: true
    },
    comments: {
        type: String
    }
});

const PendingRequest = mongoose.model('PendingRequest', pendingRequestSchema);
module.exports = PendingRequest;