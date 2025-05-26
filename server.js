// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

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

// Example route: Health check
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to VetConnect API' });
});

// Example route: Get appointments (for demonstration)
app.get('/api/appointments', (req, res) => {
  // In a full implementation, fetch appointments from the database.
  res.json([
    { id: 1, message: 'Appointment for Fluffy on 2025-06-15' },
    { id: 2, message: 'Appointment for Rex on 2025-07-01' }
  ]);
});

// (Additional routes for authentication, pet records, etc., would be added here)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});