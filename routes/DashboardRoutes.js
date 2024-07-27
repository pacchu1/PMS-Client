const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/DashboardController');

router.post('/Employee', employeeController.createEmployeeLog);
router.get('/api/LoggedInEmployee', employeeController.getLoggedInEmployee);

module.exports = router;
