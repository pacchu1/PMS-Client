const express = require('express');
const adminController = require('../controllers/AdminController');
const router = express.Router();

const upload = adminController.upload;

router.get('/admin_data/latest_id', adminController.getLatestAdminId);
router.get('/admin_data', adminController.getAllAdmin);
router.post('/admin_data/add', upload.single('image'), adminController.addAdmin);
router.post('/login', adminController.loginAdmin);
router.delete('/admin_data/:id', adminController.deleteAdmin);
router.put('/admin_data/:id', adminController.updateAdmin);
router.post('/login/admin', adminController.loginAdminOne);
router.put('/admin_data/:adminid/activate_deactivate', adminController.activateDeactivateAdmin);

module.exports = router;