// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { format } = require('date-fns');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/employee_logs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const logSchema = new mongoose.Schema({
  employeeId: String,
  status: String,
  timestamp: String, // Change the type to String
});

const Log = mongoose.model('Log', logSchema);

// Endpoint to handle employee logs
app.post('/Employee', async (req, res) => {
  try {
    const { employeeId, status } = req.body;

    // Use date-fns to format the timestamp
    const timestamp = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", { timeZone: 'Asia/Kolkata' });

    const newLog = new Log({ employeeId, status, timestamp });
    await newLog.save();
    res.status(200).json({ message: 'Log saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
