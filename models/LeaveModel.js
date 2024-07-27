const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  empId: { type: String, index: true },
  empName: String,
  empDepartment: String,
  email: String,
  leaveType: String,
  fromDate: String,
  toDate: String,
  comment: String,
  file: String,
  status: {
    type: String,
    default: 'pending',
  },
});

const LeaveModel = mongoose.model('Leave', leaveSchema);

module.exports = LeaveModel;