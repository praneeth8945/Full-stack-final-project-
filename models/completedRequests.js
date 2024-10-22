const mongoose = require('mongoose');
const completedRequestSchema = new mongoose.Schema({
    rollNumber: {
        type: String,
        required: true
    },
    name:{
        type:String,
        required: true
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
        required: true // Date in 'ddmmyyyy' format
    },
    dateOfCompletion: {
        type: String,
        required: true
    },
    comments: {
        type: String
    }
});

const CompletedRequest = mongoose.model('CompletedRequest', completedRequestSchema);
module.exports = CompletedRequest;