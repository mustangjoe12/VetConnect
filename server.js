// server.cjs
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (adjust the connection string as needed)
mongoose
    .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vetconnect', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
// Health Check Route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to VetConnect API' });
});

// Appointments Route (for demonstration)
app.get('/api/appointments', (req, res) => {
  // In a full implementation, fetch appointments from the database.
  res.json([
    { id: 1, message: 'Appointment for Fluffy on 2025-06-15' },
    { id: 2, message: 'Appointment for Rex on 2025-07-01' }
  ]);
});

/*
  Note: To enable authentication in VetConnect, you should add routes for:
    - POST /api/auth/register
    - POST /api/auth/login
  You can implement these routes here (or in separate router modules) to handle:
    - Validating registration data
    - Hashing passwords (server‑side using bcrypt or similar)
    - Creating user records in MongoDB
    - Issuing tokens (e.g., JWT) upon successful login
*/

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
