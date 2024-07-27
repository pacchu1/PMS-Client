const LeaveModel = require('../models/LeaveModel');
const nodemailer = require('nodemailer');

const lastEmailSentMap = new Map();
  

const getLeaveData = async (req, res) => {
  try {
    const leaveData = await LeaveModel.find();
    res.json(leaveData);
  } catch (error) {
    // console.error('Error fetching leave data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getEmployeesOnLeaveToday = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0]; // Use the provided date or today's date
    const employeesOnLeaveToday = await LeaveModel.find({ fromDate: date });
    // console.log("employeesOnLeaveToday", employeesOnLeaveToday);

    res.status(200).json(employeesOnLeaveToday);
  } catch (error) {
    // console.error('Error fetching employees on leave today:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const submitLeaveRequest = async (req, res) => {
  const {
    empId,
    empName,
    empDepartment,
    email,
    leaveType,
    fromDate,
    toDate,
    comment,
    file,
    
  } = req.body;

  const currentDate = new Date().toISOString().split('T')[0];
  const lastEmailSentDate = lastEmailSentMap.get(empId);

  // Check if an email was already sent for this employee ID today
  if (lastEmailSentDate === currentDate) {
    // If email already sent today, respond with an error message
    return res.status(400).json({ error: 'Email already sent for today' });
  }

  const newLeave = new LeaveModel({
    empId,
    empName,
    empDepartment,
    email,
    leaveType,
    fromDate,
    toDate,
    comment,
    file,
    status: 'pending', // Make sure this is set correctly
  });
  
  

  try {
    // Save leave request to the database
    await newLeave.save();
    console.log('Data stored successfully:', newLeave);

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'venubekkam3@gmail.com', // Your Gmail email address
        pass: 'jbst xlja mxgn koig', // Your Gmail password
      },
    });

    const mailOptions = {
      from: newLeave.email,
      to: 'bekkamvenugopal34@gmail.com',
      subject: 'Leave Application',
      html: `
        <center><p><strong>Leave Application</strong></p></center>
        <ul>
          Employee Name: ${newLeave.empName}<br/>
          Employee ID: ${newLeave.empId}<br/>
          Department: ${newLeave.empDepartment}<br/>
       
          <p>To, <br/> The HR Manager, <br/> Matrical Technologies, <br/> Bangalore.</p>

          <p>Subject: Application for Leave. </p>
          <p>Dear Sir/Madam, </p>

          <p>I hope this letter finds you well. I am writing to formally request a leave of absence from work due to ${newLeave.leaveType}. <br/>

          ${newLeave.comment} <br/>

          Thank you for considering my request. I look forward to your positive response. <br/><br/>

          Sincerely,

          </p>

          Employee Name: ${newLeave.empName}<br/>
          Employee ID: ${newLeave.empId}<br/>
          Email: ${newLeave.email}<br/>
          file: ${file ? 'Image attached' : 'No attachment'}<br/>
      `,
    };

    console.log('Mail options:', mailOptions); // Log mail options for debugging

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully', newLeave.email);

     // Update last sent email timestamp for this employee ID
     lastEmailSentMap.set(empId, currentDate);

     setTimeout(() => {
       res.json({ status: 'Mail Sended Successfully.' });
       setTimeout(() => {
         return res.end();
       }, 2000);
     }, 2000);
   } catch (error) {
     console.error('Server-side error:', error);
     setTimeout(() => {
       res.status(500).json({ error: 'Internal Server Error' });
       setTimeout(() => {
         return res.end();
       }, 2000);
     }, 2000);
   }
 };
 



const getTotalLeaves = async (req, res) =>{
  try {
    const employeeId = req.params.employeeId;
    const totalLeaves = await Leave.countDocuments({ empId: employeeId });
    res.json({ totalLeaves });
  } catch (error) {
    console.error('Error fetching total leaves:', error);
    res.status(500).json({ error: 'Server Error' });
  }
}



const getEmployeeDetails = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    console.log(employeeId);

    let employee;

    // Check if employeeId is in ObjectId format
    if (/^[0-9a-fA-F]{24}$/.test(employeeId)) {
      employee = await LeaveModel.findById(employeeId).exec();
    } else {
      // Assuming employeeId is in empId format
      employee = await LeaveModel.findOne({ empId: employeeId });
    }

    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
    } else {
      res.json(employee);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const approveLeave = async (req, res) => {
  const { leaveId, status } = req.body;

  try {
    // Find the leave request by leaveId and update the status
    const leaveRequest = await LeaveModel.findByIdAndUpdate(
      leaveId,
      { status: status },
      { new: true }
    );

    // You can also send an email notification to the employee here

    res.json({ status: 'Leave request updated successfully', leaveRequest });
    
  } catch (error) {
    console.error('Error approving leave:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
 


const leaveStatus = async (req, res) => {
  const { employeeId } = req.params;

  try {
    console.log('Received employeeId:', employeeId);

    const leaveRecord = await LeaveModel.findOne({ empId: employeeId });

    console.log('Leave record:', leaveRecord);

    if (leaveRecord) {
      console.log('Status found:', leaveRecord.status);
      res.json({ status: leaveRecord.status });
    } else {
      console.log('Leave record not found');
      res.status(404).json({ error: 'Leave record not found' });
    }
  } catch (error) {
    // console.error('Error fetching leave status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getLeaveApplications = async (req, res) => {
  const { employeeid } = req.params;

  try {
    const leaveApplications = await LeaveModel.find({ empId: employeeid });
    res.json(leaveApplications);
  } catch (error) {
    // console.error('Error fetching leave applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getPendingLeaveApplications = async (req, res) => {
  try {
    const pendingLeaveApplications = await LeaveModel.find({ status: 'pending' });
    res.json(pendingLeaveApplications);
  } catch (error) {
    // console.error('Error fetching pending leave applications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to fetch approved leave applications
const getApprovedLeaveApplications = async (req, res) => {
  try {
    const approvedLeaveApplications = await LeaveModel.find({ status: 'approved' });
    res.json(approvedLeaveApplications);
  } catch (error) {
    // console.error('Error fetching approved leave applications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to fetch rejected leave applications
const getRejectedLeaveApplications = async (req, res) => {
  try {
    const rejectedLeaveApplications = await LeaveModel.find({ status: 'rejected' });
    res.json(rejectedLeaveApplications);
  } catch (error) {
    // console.error('Error fetching rejected leave applications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




module.exports = {
  submitLeaveRequest,
  getLeaveData,
  getTotalLeaves,
  getEmployeesOnLeaveToday,
  getEmployeeDetails,
  approveLeave,
  leaveStatus,
  getLeaveApplications,
  getPendingLeaveApplications,
  getApprovedLeaveApplications,
  getRejectedLeaveApplications,
};
