const Holiday = require('../models/AddHolidayModel');

const addHoliday = async (req, res) => {
  const { date, description } = req.body;

  try {
    const newHoliday = new Holiday({
      date,
      description,
    });

    await newHoliday.save();

    res.status(201).json({ success: true, message: 'Holiday added successfully' });
  } catch (error) {
    console.error('Error adding holiday:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

const getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find();
    res.json(holidays);
  } catch (error) {
    console.error('Error fetching holidays:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

const updateHolidays = async (req, res) => {
  try {
    const updatedHolidays = req.body;

    const updatePromises = updatedHolidays.map(async holiday => {
      await Holiday.findOneAndUpdate({ slno: holiday.slno }, { $set: holiday });
    });

    await Promise.all(updatePromises);
    res.json({ success: true, message: 'Holidays updated successfully' });
  } catch (error) {
    console.error('Error updating holidays:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

const deleteHoliday = async (req, res) => {
  try {
    const descriptions = req.body.descriptions;
    await Holiday.deleteMany({ description: { $in: descriptions } });
    res.json({ success: true, message: 'Holidays deleted successfully' });
  } catch (error) {
    console.error('Error deleting holidays:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

const getTotalHolidaysForEmployee = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    console.log('Fetching holidays for employeeId:', employeeId);

    const totalHolidays = await Holiday.countDocuments({ empId: employeeId });

    res.json({ totalHolidays });
  } catch (error) {
    console.error('Error fetching holidays for employee:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};


module.exports = {
  addHoliday,
  getHolidays,
  updateHolidays,
  deleteHoliday,
  getTotalHolidaysForEmployee,
  
};
