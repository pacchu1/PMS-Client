const mongoose = require('mongoose');

const paySlipSchema = new mongoose.Schema({
  employeeName: String,
  employeeId: String,
  accountNumber: String,
  bankName: String,
  UANNumber: String,
  workingDays: Number,
  department: String,
  designation: String,
  year: Number,
  month: String,
  workingDays: Number,
  PanNumber: String,
  joiningDate: String,
  houseRentAllowance: Number,
  medicalAllowance: Number,
  dearnessAllowance: Number,
  travellingAllowance: Number,
  basicSalary: Number,
  grossSalary: Number,
  netSalary: Number,
  totalAllowance: Number,
  pf: Number,
  professionalTax: Number,
  others: Number,
  pdfUrl: String,
});

const PaySlip = mongoose.model('PaySlip', paySlipSchema);

module.exports = PaySlip; 
