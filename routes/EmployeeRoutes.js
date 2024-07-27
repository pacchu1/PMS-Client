const express = require('express');
const EmployeeController = require('../controllers/EmployeeController');
const router = express.Router();
 

const upload = EmployeeController.upload;

router.get('/employee_data/latest_id', EmployeeController.getLatestEmployeeId);
router.get('/employee_data', EmployeeController.getAllEmployees);
// Modify the route to accept employeeId as a parameter
router.get('/employee_data/:employeeId', EmployeeController.getEmployeeById);//this line is to fetch emp details for payslip 
router.post('/employee_data/add', upload.single('image'), EmployeeController.addEmployee);
router.post('/login', EmployeeController.loginEmployee);
router.delete('/employee_data/:id', EmployeeController.deleteEmployee);
router.put('/employee_data/:id', EmployeeController.updateEmployee);
router.post('/login/employee', EmployeeController.loginEmployeeOne);
router.get('/employee/:employeeid', EmployeeController.getEmployeeByEmployeeId);
router.get('/employeesWithImages', EmployeeController.getAllEmployeesWithImages);
router.put('/employee_data/:id/activate_deactivate', EmployeeController.activateDeactivateEmployee);
// router.get('/employee_details/:employeeId', EmployeeController.getEmployeeDetails);



module.exports = router;



