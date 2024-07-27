const Log = require('../models/DashboardModel');
const employeeController = require('../controllers/DashboardController');


exports.getLoggedInEmployee = async (req, res) => {
  try {
    const loggedInEmployee = await Log.findOne().sort({ timestamp: -1 }).limit(1);
    res.status(200).json(loggedInEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createEmployeeLog = async (req, res) => {
  try {
    const { employeeId, status, timestamp } = req.body;

    const newLog = new Log({ employeeId, status, timestamp });
    await newLog.save();

    res.status(200).json({ message: 'Log saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
