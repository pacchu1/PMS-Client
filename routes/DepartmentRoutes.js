// routes/departmentRoutes.js
const express = require('express'); 
const router = express.Router();
const departmentController = require('../controllers/DepartmentController');

router.get('/api/department_data', departmentController.getAllDepartments);
router.get('/department_datauser/:departmentname', departmentController.getUniqueDepartmentNames);
router.get('/department_dataone', departmentController.getAllUniqueDepartmentNames);
router.delete('/department_data/:id', departmentController.deleteDepartmentById);
router.post('/department_dataasd/add', departmentController.addNewDepartment);
router.post('/department_data/add', departmentController.addDepartment);

router.put('/department_data/:id', departmentController.updateDepartmentById);

module.exports = router;