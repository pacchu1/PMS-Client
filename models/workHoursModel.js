const mongoose = require("mongoose");

const unifiedDataSchema = new mongoose.Schema({
  employeeId: String,
  department:String,
  fullname:String,
  startTime: String,
  startDate: String,
  endTime: String,
  endDate: String,
  breakInTime: String,
  breakOutTime: String,
  totalWorkTime: String,
  totalWorkDays: Number,
});

const UnifiedData = mongoose.model("UnifiedData", unifiedDataSchema);

module.exports = UnifiedData;

