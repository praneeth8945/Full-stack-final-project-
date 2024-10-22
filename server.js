const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
const serviceRoutes = require('./routes/services');
const adminRoutes = require('./routes/admin'); // Importing admin route
const userRoutes = require('./routes/user'); // Importing user route
const requestAvailability = require('./routes/requestAvailability');
const tasks = require('./routes/tasks');
app.use('/api/auth',userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/admin', adminRoutes); // Using the admin route
app.use('/api/availability',requestAvailability);
app.use('/api/tasks',tasks);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
