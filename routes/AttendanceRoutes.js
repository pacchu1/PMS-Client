const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/AttendanceController');

// Define route to get attendance data by department and date
router.get('/attendance_data', attendanceController.getAttendanceByDepartmentAndDate);
router.get('/attendance_datareport', attendanceController.getAttendanceByDepartmentYearMonth);
router.get('/attendance/current', attendanceController.getAttendanceByCurrentDate);


module.exports = router;
