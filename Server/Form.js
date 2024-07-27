const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3003; // You can use any available port

// Enable CORS
app.use(cors());
app.use(express.json());

// Connect to MongoDB (Make sure MongoDB is running)
mongoose.connect('mongodb://localhost:27017/form', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const departmentSchema = new mongoose.Schema({
  departmentid: String,
  departmentname: String,
  description: String,
  designation: String,
  departmenthead: String,
});

const Department = mongoose.model('Department', departmentSchema);

// API endpoint to handle department data submission
app.post('/department_data/add', async (req, res) => {
  try {
    const { departmentid, departmentname, description, designation, departmenthead } = req.body;

    // Create a new department instance
    const newDepartment = new Department({
      departmentid,
      departmentname,
      description,
      designation,
      departmenthead,
    });

    // Save the department to the database
    await newDepartment.save();

    // Respond with success
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    // Respond with an error
    res.status(500).json({ success: false, error: 'Error submitting form' });
  }
});

app.listen(port, () => {
  console.log("Server is running on port ${port}");
});