const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/PayrollController');


router.post('/Add_payslip', payrollController.createPaySlip);
router.get('/get_payslip', payrollController.getPayslip);
router.get('/get_employee_payslips', payrollController.  getPayslipForEmployee,);//to fetch perticular employee payslip




module.exports = router;
