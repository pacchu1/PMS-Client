
const express = require('express');
const router = express.Router();
const logController = require('../controllers/LoginController');

// Define routes
router.post('/Employee', logController.saveEmployeeLog);

module.exports = router;