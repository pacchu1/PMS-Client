const express = require('express');
const router = express.Router();
const holidayController = require('../controllers/AddHolidayController');

// Define routes
router.post('/holiday_data/add', holidayController.addHoliday);
router.get('/holiday_data', holidayController.getHolidays);
router.put('/holiday_data', holidayController.updateHolidays);
router.delete('/holiday_data', holidayController.deleteHoliday);
module.exports = router;
