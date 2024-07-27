const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
  slno: Number,
  date: String,
  description: String,
});

const Holiday = mongoose.model('Holiday', holidaySchema);

module.exports = Holiday;
