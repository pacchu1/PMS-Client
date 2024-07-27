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

// API endpoint to get all departments
app.get('/department_data', async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to delete a department by ID
app.delete('/department_data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Department.findOneAndDelete({ departmentid: id });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// API endpoint to update multiple departments
app.put('/department_data', async (req, res) => {
  try {
    const updatedDepartments = req.body;

    for (const updatedDepartment of updatedDepartments) {
      await Department.findOneAndUpdate(
        { departmentid: updatedDepartment.departmentid },
        updatedDepartment
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
