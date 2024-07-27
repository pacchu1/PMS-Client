const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  employeeId: String,
  status: String,
  timestamp: String,
  hoursWorked:Number,
});

const Login = mongoose.model('Login2', logSchema);

module.exports = Login;