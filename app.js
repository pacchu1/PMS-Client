const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: 'Config/.env' });

const app = express();

app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(bodyParser.json());

const employeeRoutes = require('./routes/EmployeeRoutes');
const adminRoutes = require('./routes/AdminRoutes');
const departmentRoutes = require('./routes/DepartmentRoutes');
const loginRoutes = require('./routes/LoginRoutes');
const holidayRoutes = require('./routes/AddHolidayRoutes');
const leaveRoutes = require('./routes/LeaveRoutes');
const attendanceRoutes = require('./routes/AttendanceRoutes');
const payrollRoutes = require('./routes/PayrollRoutes');
const dashboardRoutes = require('./routes/DashboardRoutes');
const workHoursRoutes = require('./routes/workHoursRoutes');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', employeeRoutes);
app.use('/', adminRoutes);
app.use('/', departmentRoutes);
app.use('/', loginRoutes);
app.use('/', holidayRoutes);
app.use('/', leaveRoutes);
app.use('/', attendanceRoutes);
app.use('/', payrollRoutes);
app.use('/', dashboardRoutes);
app.use('/', workHoursRoutes);

cron.schedule('0 0 1 * *', () => {
  console.log('Running cron job to generate payslips for the next month');
  paySlipService.generatePayslipsForNextMonth();
});

app.use((req, res, next) => {
  res.header('Cache-Control', 'no-store');
  next();
});


// API endpoint to fetch previous details
app.get('/api/previous_details', (req, res) => {
  try {
    // Implement logic to fetch previous details from the database
    const previousDetails = {
      empId: 'PreviousEmp123',
      empName: 'Previous Employee',
      empDepartment: 'Previous Department',
      // Add other fields as needed
    };

    res.json(previousDetails);
  } catch (error) {
    console.error('Error fetching previous details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




