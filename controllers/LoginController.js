const Log = require('../models/LoginModel');

const saveEmployeeLog = async (req, res) => {
  try {
    const { employeeId, status } = req.body;

    console.log('Received data:', req.body); // Log received data

    const newLog = new Log({
      employeeId,
      status,
    });

    await newLog.save();
    console.log('Log saved successfully:', newLog); // Log saved log

    res.status(200).json({ message: 'Log saved successfully' });
  } catch (error) {
    console.error('Error saving log:', error); // Log error
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  saveEmployeeLog,
};
