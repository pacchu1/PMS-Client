const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  employeeId: String,
  status: String,
  timestamp: String,
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
