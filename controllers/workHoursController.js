// workHoursController.js

const UnifiedData = require("../models/workHoursModel");

const formatDateWithZeroPadding = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Zero-padding for month
  const day = date.getDate().toString().padStart(2, "0"); // Zero-padding for day
  return `${month}/${day}/${year}`;
};

const saveUnifiedData = async (req, res) => {
  try {
    const {
      employeeId,
      startTime,
      startDate,
      endTime,
      endDate,
      breakInTime,
      breakOutTime,
      totalWorkTime,
    } = req.body;

    const formattedStartDate = formatDateWithZeroPadding(new Date(startDate));
    const formattedEndDate = formatDateWithZeroPadding(new Date(endDate));

    const existingEntries = await UnifiedData.find({ employeeId });
    const lastEntry = existingEntries[existingEntries.length - 1];

    let totalWorkDays = 1;

    if (lastEntry) {
      const lastEntryMonth = new Date(lastEntry.endDate).getMonth();
      const currentEntryMonth = new Date(endDate).getMonth();
      const lastEntryYear = new Date(lastEntry.endDate).getFullYear();
      const currentEntryYear = new Date(endDate).getFullYear();
      if (lastEntryMonth === currentEntryMonth && lastEntryYear === currentEntryYear) {
        totalWorkDays = lastEntry.totalWorkDays + 1;
      }
    }

    if (lastEntry && lastEntry.startDate === formattedStartDate) {
      lastEntry.endTime = endTime;
      lastEntry.endDate = formattedEndDate;
      lastEntry.breakInTime = breakInTime;
      lastEntry.breakOutTime = breakOutTime;
      lastEntry.totalWorkTime = totalWorkTime;
      lastEntry.totalWorkDays = totalWorkDays;

      await lastEntry.save();
    } else {
      const newUnifiedData = new UnifiedData({
        employeeId,
        startTime,
        startDate: formattedStartDate,
        endTime,
        endDate: formattedEndDate,
        breakInTime,
        breakOutTime,
        totalWorkTime,
        totalWorkDays,
      });

      await newUnifiedData.save();
    }

    console.log("Unified data saved successfully");
    res.status(200).send("Unified data saved successfully");
  } catch (error) {
    console.error("Error saving unified data:", error);
    res.status(500).send("Error saving unified data");
    console.error("Error retrieving last entry:", error);
  }
};

const checkWorkHours = async (req, res) => {
  try {
    const { employeeId, date } = req.body;

    const existingWorkHours = await UnifiedData.findOne({
      employeeId,
      startDate: date,
    });

    const workHoursExist = !!existingWorkHours;

    res.json({ workHoursExist });
  } catch (error) {
    console.error("Error checking work hours:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

const getTotalWorkDays = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const existingEntries = await UnifiedData.find({ employeeId });

    // Calculate total work days
    let totalWorkDays = 0;
    existingEntries.forEach((entry) => {
      totalWorkDays += entry.totalWorkDays;
    });

    res.json({ totalWorkDays });
  } catch (error) {
    console.error("Error fetching total work days:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

const getWorkHoursData = async (req, res) => {
  const employeeId = req.params.employeeId;
  try {
    const workHoursData = await UnifiedData.find({ employeeId }, 'endDate totalWorkTime');
    res.json(workHoursData);
  } catch (error) {
    console.error('Error fetching work hours data:', error);
    res.status(500).send('Error fetching work hours data');
  }
};

module.exports = { saveUnifiedData, checkWorkHours, getTotalWorkDays , getWorkHoursData,};
