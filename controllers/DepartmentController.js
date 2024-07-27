// controllers/departmentController.js
const Department = require('../models/DepartmentModel');


exports.getAllUniqueDepartmentNames = async (req, res) => {
  try {
    const departments = await Department.find({}, 'departmentname');
    const departmentNames = departments.map((department) => department.departmentname);
    return Array.from(new Set(departmentNames));
  } catch (error) {
    console.error(error);
    throw error;  
  }
}

exports.getUniqueDepartmentNames  = async (req, res) => {
  try {
    const { departmentname } = req.params;
    const department = await Department.findOne({ departmentname });
    
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.status(200).json(department);
    console.log("Sent department data:", department);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find({}, 'departmentname designation');
    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    await Department.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

exports.  addNewDepartment = async (req, res) => {
  try {
    const { departmentname, designation } = req.body;
    const department = new Department({ departmentname, designation });
    await department.save();
    res.status(200).json({ message: 'Department added successfully', department });
    // console.log("Received a request to add department:", req.body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addDepartment = async (req, res) => {
  try {
    const { departmentname, designation } = req.body;

    // Check if the department with the given name already exists
    const existingDepartment = await Department.findOne({ departmentname });
    if (existingDepartment) {
      return res.status(400).json({ success: false, error: 'Department already exists' });
    }

    // Create a new department
    const newDepartment = new Department({
      departmentname,
      designation: designation.split(',').map((d) => d.trim()), // Convert string to array
    });

    await newDepartment.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

exports.updateDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { departmentname, designation } = req.body;
    await Department.findByIdAndUpdate(id, { departmentname, designation });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}