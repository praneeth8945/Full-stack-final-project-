const express = require('express');
const PendingRequest = require('../models/pendingRequests');
const CompletedRequest = require('../models/completedRequests');
const router = express.Router();

router.post('/addPending', async (req, res) => {
    try {
        const { rollNumber,name, roomNumber, phoneNumber, serviceName, comments,date } = req.body;
        const newPending = new PendingRequest({
            rollNumber,
            name,
            roomNumber,
            phoneNumber,
            serviceName,
            dateOfCreation: date,
            comments
        });
        await newPending.save();
        res.status(201).json({ message: 'Task added to pending requests', task: newPending });
    } catch (error) {
        res.status(500).json({ message: 'Error adding task to pending', error });
    }
});
// List pending tasks by serviceName (passed in request body)
router.post('/pendingTasks', async (req, res) => {
    try {
        const { serviceName } = req.body; // Extract serviceName from the request body
        console.log("service", serviceName)
        // Build the query object, filtering by serviceName if it's provided
        const query = serviceName ? { serviceName } : {};
        // Find tasks that match the query (if no serviceName is provided, it returns all pending tasks)
        const pendingTasks = await PendingRequest.find(query);
        // If no tasks found, return a message
        if (pendingTasks.length === 0) {
            return res.status(200).json({ message: 'No pending tasks found for the given service type' });
        }
        res.status(200).json({ message: 'Pending tasks retrieved successfully', tasks: pendingTasks });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving pending tasks', error });
    }
});
// List completed tasks by serviceName (passed in request body)
router.post('/completedTasks', async (req, res) => {
    try {
        const { serviceName } = req.body; // Extract serviceName from the request body
        
        // Build the query object, filtering by serviceName if it's provided
        const query = serviceName ? { serviceName } : {};

        // Find tasks that match the query (if no serviceName is provided, it returns all completed tasks)
        const completedTasks = await CompletedRequest.find(query);

        // If no tasks found, return a message
        if (completedTasks.length === 0) {
            return res.status(404).json({ message: 'No completed tasks found for the given service type' });
        }

        res.status(200).json({ message: 'Completed tasks retrieved successfully', tasks: completedTasks });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving completed tasks', error });
    }
});
// Mark multiple tasks as complete
router.post('/completeTasks', async (req, res) => {
    try {
        const { selectedRequestIds } = req.body; // Extract array of task IDs from the request body
        if (!Array.isArray(selectedRequestIds) || selectedRequestIds.length === 0) {
            return res.status(400).json({ message: 'Invalid input. Please provide an array of task IDs.' });
        }

        // Find and remove the tasks from the PendingRequest collection
        const pendingTasks = await PendingRequest.find({ _id: { $in: selectedRequestIds } });

        if (pendingTasks.length === 0) {
            return res.status(404).json({ message: 'No pending tasks found for the provided IDs.' });
        }

        // Create an array of completed tasks
        const completedTasks = pendingTasks.map(task => ({
            rollNumber: task.rollNumber,
            name:task.name,
            roomNumber: task.roomNumber,
            phoneNumber: task.phoneNumber,
            serviceName: task.serviceName,
            dateOfCreation: task.dateOfCreation,
            dateOfCompletion: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
            comments: task.comments // Keep comments if needed
        }));

        // Remove tasks from the PendingRequest collection
        await PendingRequest.deleteMany({ _id: { $in: selectedRequestIds } });

        // Add completed tasks to the CompletedRequest collection
        await CompletedRequest.insertMany(completedTasks);

        res.status(200).json({ message: 'Tasks marked as complete successfully.', tasks: completedTasks });
    } catch (error) {
        console.error('Error marking tasks as complete:', error);
        res.status(500).json({ message: 'Error marking tasks as complete', error });
    }
});
module.exports = router;