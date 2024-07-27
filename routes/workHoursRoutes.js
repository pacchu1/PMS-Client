
const express = require("express");
const router = express.Router();
const workHoursController = require("../controllers/workHoursController");

router.post("/saveUnifiedData", workHoursController.saveUnifiedData);
router.get("/total_work_days/:employeeId", workHoursController.getTotalWorkDays);
router.post("/checkWorkHours", workHoursController.checkWorkHours);
router.get('/workhours_data/:employeeId', workHoursController.getWorkHoursData);

module.exports = router;
