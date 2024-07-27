const Employee = require('../models/EmployeeModel');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

let employeeCounter = 0;

const generateUniqueId = async () => {
  try {
    const latestEmployee = await Employee.findOne({}, { employeeid: 1 }).sort({ _id: -1 });
    const lastEmployeeId = latestEmployee ? latestEmployee.employeeid : null;

    if (lastEmployeeId) {
      const lastSerialNumber = parseInt(lastEmployeeId.slice(4), 10);
      const newSerialNumber = lastSerialNumber + 1;
      const newSerialString = newSerialNumber.toString().padStart(5, '0');
      return `MTSD${newSerialString}`;
    } else {
      // If no employee exists yet, start with 1
      return `MTSD00001`;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error generating unique ID');
  }
};


const getLatestEmployeeId = async (req, res) => {
  try {
    const latestEmployee = await Employee.findOne({}, { employeeid: 1 }).sort({ _id: -1 });
    let latestId = latestEmployee ? latestEmployee.employeeid : null;

    // If latestId is null, set it to a default value
    if (!latestId) {
      const defaultId = 'MTSD00000';
      latestId = defaultId;
    }

    res.status(200).json({ latestId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    const employeesWithStatus = employees.map((employee) => ({
      ...employee.toObject(),
      isActive: employee.isActive || false,
    }));
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }


};


const getEmployeeById = async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Find the employee by their ID
    const employee = await Employee.findOne({ employeeid: employeeId });

    // If the employee is found, send the details
    if (employee) {
      res.status(200).json(employee);
    } else {
      // If no employee is found with the given ID, send a 404 status
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addEmployee = async (req, res) => {
  try {
    const {  employeeid,
      firstname,
      lastname,
      experience,
      fresherDescription,
      experiencedDropdown,
      previousrole,
      previouspayslip,
      Skills,
    } = req.body;


    console.log('Experience:', experience);
    console.log('Fresher Description:', fresherDescription);
    console.log('Skills:', Skills);
    console.log("employeeid",employeeid)

    if (employeeid === !null) {
      // Existing employee, update the record
      console.log("ddddd");
      const updatedEmployee = await Employee.findOneAndUpdate(
        { employeeid: employeeid },
        {
          ...req.body,
          imagePath: req.file ? req.file.path : null,
          experience: experience === 'experienced' ? experiencedDropdown : null,
          fresherDescription: experience === 'fresher' ? fresherDescription : null,
          Skills: experience === 'fresher' ? Skills : null,
        },
        { new: true }
      );

      if (!updatedEmployee) {
        return res.status(404).json({ message: 'Employee not found for update' });
      }

      return res.status(200).json({ message: 'Employee updated successfully' });
    } else {
      // New employee, generate a unique ID
      const newEmployee = new Employee({
        employeeid: await generateUniqueId(), // Await the result of generateUniqueId
        fullname: `${firstname} ${lastname}`,
        firstname: req.body.firstname,   
        lastname: req.body.lastname,
        fathername: req.body.fathername,
        mothername: req.body.mothername,
        department: req.body.department,
        desigination: req.body.desigination,
        gender: req.body.gender,
        bloodgroup: req.body.bloodgroup,
        dateofbirth: req.body.dateofbirth,
        martialstatus: req.body.martialstatus ,
        contactno: req.body.contactno,
        alternateno: req.body.alternateno,
        email: req.body.email,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
        localaddress: req.body.localaddress,
        permenantaddress: req.body.permenantaddress,
        joiningdate : req.body.joiningdate,
        worklocation : req.body.worklocation,
        // imagePath: req.file ? req.file.path : null,
        imagePath: req.file ? req.file.path : null,
        experience: experience === 'experienced' ? experiencedDropdown : 'fresher',
        fresherDescription: experience === 'fresher' ? fresherDescription : null,
        Skills: experience === 'fresher' ? fresherDescription : null,

        aadhar: req.body.aadhar,
        pan : req.body.pan,
        passport : req.body.passport,
        drivinglicense : req.body.drivinglicense,


        accountno: req.body.accountno,
        accountname: req.body.accountname,
        ifsccode: req.body.ifsccode,
        bankname: req.body.bankname,
        branch: req.body.branch,
        uan: req.body.uan,


        tenth: req.body.tenth,
        inter: req.body.inter,
        ug: req.body.inter,
        pg: req.body.inter,
       
        previousrole: req.body.previousrole,
        previouspayslip: req.body.previouspayslip,
       
      });

      const savedEmployee = await newEmployee.save();
      res.status(201).json(savedEmployee);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const activateDeactivateEmployee = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  

  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { employeeid: id },
      { isActive },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: `Employee with ID ${id} not found for activation/deactivation` });
    }

    const status = updatedEmployee.isActive ? 'active' : 'inactive';

    res.status(200).json({
      message: `Employee ${status} successfully`,
      isActive: updatedEmployee.isActive,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteEmployee = async (req, res) => {
  const employeeId = req.params.id;
  try {
    await Employee.findOneAndDelete({ employeeid: employeeId });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  const employeeId = req.params.id;
  const updatedEmployeeData = req.body;

  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { employeeid: employeeId },
      { $set: updatedEmployeeData },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found for update' });
    }

    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const loginEmployeeOne = async (req, res) => {
  const { employeeid, password } = req.body;

  try {
    const employee = await Employee.findOne({ employeeid });

    console.log(employee.isActive);

    // Check if the employee exists and the passwords match
    if (!employee || employee.password !== password || !employee.isActive) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Include any other necessary employee information
    const user = {
      role: 'employee', 
      employeeid: employee.employeeid,
      fullname: employee.fullname,
      email: employee.email,
      department: employee.department,
      desigination:employee.desigination,

    };

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}



const loginEmployee = async (req, res) => {
  try {
    const { employeeid, password, role } = req.body;

    const user = await Employee.findOne({ employeeid });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Employee not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }

    if (user.role === role) {
      res.status(200).json({
        success: true,
        user: {
          employeeid: user.employeeid,
          fullname: user.fullname,
          email: user.email,
          department: user.department,
          desigination:user.desigination,

        },
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid role' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getEmployeeByEmployeeId = async (req, res) => {
  const { employeeid } = req.body;

  try {
    const employee = await Employee.findOne({ Employeeid: employeeid });

    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    res.json({ success: true, employeeDetails: employee });
  } catch (error) {
    console.error('Error fetching employee details:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Assuming this is part of your backend code
const getAllEmployeesWithImages = async (req, res) => {
  try {
    // Fetch all employees with their image paths
    const employees = await Employee.find({}, { imagePath: 1, fullname: 1, employeeid: 1 });

    // Prepare the response with necessary employee details and image paths
    const employeesWithImages = employees.map(employee => {
      return {
        imagePath: employee.imagePath,
        fullname: employee.fullname,
        employeeid: employee.employeeid,
      };
    });

    res.status(200).json(employeesWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getEmployeeDetails = async (req, res) => {
  try {
    const employeeId = parseInt(req.params.employeeId);
    const employee = await Employee.findOne({ empId: employeeId });

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


// Function to get previous details
const getPreviousDetails = async (req, res) => {
  try {
    // Implement logic to fetch previous details from the database
    // For example, you could find the second latest employee based on some criteria
    const previousDetails = await Employee.find().sort({ _id: -1 }).skip(1).limit(1);

    if (!previousDetails) {
      return res.status(404).json({ error: 'Previous details not found' });
    }

    res.json(previousDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = { getAllEmployeesWithImages, getEmployeeByEmployeeId, loginEmployeeOne, getLatestEmployeeId, addEmployee, deleteEmployee, updateEmployee, upload, loginEmployee, getAllEmployees, generateUniqueId ,getEmployeeById ,activateDeactivateEmployee ,getEmployeeDetails,  getPreviousDetails,};