const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeid: String,
  fullname: String,
  // firstname: String,
  // lastname: String,
  fathername: String,
  mothername: String,
  department: String,
  desigination: String,
  bloodgroup: String,
  gender: String,
  martialstatus: String,
  dateofbirth: String,
  contactno: String,
  alternateno: String,
  email: String,
  password: String,
  confirmpassword: String,
  localaddress: String,
  permenantaddress: String,
  joiningdate: String,
  worklocation: String,
  imagePath: String,

  aadhar: String,
  pan: String,
  passport: String,
  drivinglicense: String,

  accountno: String,
  accountname: String,
  ifsccode: String,
  bankname: String,
  branch: String,
  uan: String,

  tenth: String,
  inter: String,
  ug: String,
  pg: String,
  experience: String,
  Skills: String,
  previouspayslip: String,
  previousrole: String,

  role: {
    type: String,
    default: "employee",
  },
  isActive:{
    type: Boolean,
    default: true,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;