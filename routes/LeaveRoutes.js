const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/LeaveController');
const { getPreviousDetails } = require('../controllers/EmployeeController');


router.post('/submitLeave', leaveController.submitLeaveRequest);
router.get('/api/leave_today', leaveController.getEmployeesOnLeaveToday);
router.get('/total_leaves/:employeeId', leaveController.getTotalLeaves);
router.get('/leave_data/:employeeId', leaveController.getLeaveData);
router.get('/employee_details/:employeeId', leaveController.getEmployeeDetails);
router.post('/approveLeave', leaveController.approveLeave);//to approve or reject the leave 
router.get('/api/leave_status/:employeeId', leaveController.leaveStatus);// to get the result of the leave status                                              
router.get('/api/leave_applications/:employeeid', leaveController.getLeaveApplications); // Updated route
router.get('/api/allLeaveData', leaveController.getLeaveData); 

router.get('/api/pending_leave_applications', leaveController.getPendingLeaveApplications);

// Route to fetch approved leave applications
router.get('/api/approved_leave_applications', leaveController.getApprovedLeaveApplications);

// Route to fetch rejected leave applications
router.get('/api/rejected_leave_applications', leaveController.getRejectedLeaveApplications);


 
module.exports = router;   

