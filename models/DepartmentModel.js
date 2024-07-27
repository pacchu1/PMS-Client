// models/departmentModel.js
const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  departmentid: String,
  departmentname: String,
  designation: [String],
});

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;