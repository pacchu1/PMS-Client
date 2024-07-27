const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  adminid: String,
  fullname: String,
  fathername: String,
  mothername: String,
  department: String,
  designation: String,
  gender: String,
  dateofbirth: String,
  maritalstatus: String,
  phonenumber: String,
  alternateno: String,
  bloodgroup: String,
  email: String,
  password: String,
  confirmPassword: String,
  CurrentAddress: String,
  permanentaddress: String,
  joiningDate: String,
  workLocation: String,
  Aadharno: String,
  panno: String,
  passport: String,
  licensenumber: String,

  accountNumber: String,
  AccountHolder: String,
  bankname: String,
  ifsccode: String,
  Branch: String,

  uan: String,
  ssc: String,
  inter: String,
  Btech: String,
  ug: String,
  pg: String,
  experience: String,
  Previouspackage: String,
  previouspayslip: String,
  previousrole: String,

  imagePath: String,
  role: {
    type: String,
    default: "admin",
  },
  isActive:{
    type: Boolean,
    default: true,
  },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;