const UnifiedData = require('../models/workHoursModel');

exports.getAttendanceByDepartmentAndDate = async (req, res) => {
  try {
    const { department, date } = req.query;

    // Log the received request parameters
    console.log("Received request:", { department, date });

    let query = {}; // Initialize an empty query object

    // Check if department is specified
    if (department && department !== "All Department") {
      query.department = department; // Add department to the query if specified
    }

    // Add date to the query if specified
    if (date) {
      query.startDate = date;
    }

    // Query the UnifiedData collection based on the constructed query
    const attendanceData = await (department === "All Department" ? UnifiedData.find({ startDate: date }) : UnifiedData.find(query));

    // Log the filtered data
    console.log("Filtered data:", attendanceData);

    res.status(200).json(attendanceData);
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAttendanceByDepartmentYearMonth = async (req, res) => {
  try {
    const { department, year, month } = req.query;

    // Log the received request parameters
    console.log("Received request:", { department, year, month });

    let query = {}; // Initialize an empty query object

    // Check if department is specified
    if (department && department !== "All Department") {     
      query.department = department; // Add department to the query if specified
    }

    // Add year and month to the query if specified
    if (year && month) {
      query.startDate = { 
        $gte: `${month.padStart(2, '0')}/01/${year}`, // Ensure month is 2 digits
        $lte: `${month.padStart(2, '0')}/31/${year}`   // Assume 31 days for simplicity
      };
    }

    // Query the UnifiedData collection based on the constructed query
    const attendanceData = await UnifiedData.find(query);

    // Log the filtered data
    console.log("Filtered data:", attendanceData);

    res.status(200).json(attendanceData);
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.getAttendanceByCurrentDate = async (req, res) => {
  try {
    // Get the current date and format it to match the database format (MM/DD/YYYY)
    const currentDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

    // Log the received request parameters
    // console.log("Received request for current date:", currentDate);

    // Query the UnifiedData collection for the current date
    const attendanceData = await UnifiedData.find({ startDate: currentDate });

    // Calculate the total count of employees present on the current date
    const totalCount = attendanceData.length;

    // Log the total count
    // console.log("Total employees present on current date:", totalCount);

    res.status(200).json({ totalCount });
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
