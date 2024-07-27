const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeId: String,
  fullname:String,
  department: String,
  startTime: String,
  startDate: String,
  endTime: String,
  endDate: String,
  breakInTime: String,
  breakOutTime: String,
  totalWorkTime: String,
  totalWorkDays: Number,
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
