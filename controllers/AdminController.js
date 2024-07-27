const Admin = require('../models/AdminModel');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

let adminCounter = 0;

const generateUniqueId = async () => {
  try {
    const latestAdmin = await Admin.findOne({}, { adminid: 1 }).sort({ _id: -1 });
    const lastAdminId = latestAdmin ? latestAdmin.adminid : null;

    if (lastAdminId) {
      const lastSerialNumber = parseInt(lastAdminId.slice(4), 10);
      const newSerialNumber = lastSerialNumber + 1;
      const newSerialString = newSerialNumber.toString().padStart(5, '0');
      return `ADM${newSerialString}`;
    } else {
      // If no admin exists yet, start with 1
      return `ADM00001`;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error generating unique ID');
  }
};



const getLatestAdminId = async (req, res) => {
  try {
    const latestAdmin = await Admin.findOne({}, { adminid: 1 }).sort({ _id: -1 });
    let latestId = latestAdmin ? latestAdmin.adminid : null;

    // If latestId is null, set it to a default value
    if (!latestId) {
      const defaultId = 'ADM00000';
      latestId = defaultId;

      // You may want to save this default ID to the database as well.
      // If so, uncomment the following lines:
      // const newEmployee = new Employee({ employeeid: defaultId });
      // await newEmployee.save();
    }

    res.status(200).json({ latestId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const addAdmin = async (req, res) => {
  try {
    const { adminid } = req.body;

    if (adminid) {
      // Existing Admin, update the record
      const updatedAdmin = await Admin.findOneAndUpdate(
        { adminid: adminid },
        { ...req.body, imagePath: req.file ? req.file.path : null },
        { new: true }
      );

      if (!updatedAdmin) {
        return res.status(404).json({ message: 'Admin not found for update' });
      }

      return res.status(200).json({ message: 'Admin updated successfully' });
    } else {
      // New Admin , generate a unique ID
      const newAdmin = new Admin({
        adminid: await generateUniqueId(), // Await the result of generateUniqueId
        fullname: req.body.fullname,
        fathername: req.body.fathername,
        mothername: req.body.mothername,
        department: req.body.department,
        designation: req.body.designation,
        joiningDate: req.body.joiningDate,
        maritalstatus: req.body.maritalstatus,
        gender: req.body.gender,
        dateofbirth: req.body.dateofbirth,
        bloodgroup: req.body.bloodgroup,
        phonenumber: req.body.phonenumber,
        alternateno: req.body.alternateno,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        CurrentAddress: req.body.CurrentAddress,
        permanentaddress: req.body.permanentaddress,
        workLocation: req.body.workLocation,

        Aadharno: req.body.Aadharno,
        panno: req.body.panno,
        passport: req.body.passport,
        licensenumber: req.body.licensenumber,

        AccountHolder: req.body.AccountHolder,
        accountNumber: req.body.accountNumber,
        ifsccode: req.body.ifsccode,
        bankname: req.body.bankname,
        Branch: req.body.Branch,
        uan: req.body.uan,

        ssc: req.body.ssc,
        inter: req.body.inter,
        ug: req.body.ug,
        pg: req.body.pg,

        previouspayslip: req.body.previouspayslip,
        experience: req.body.experience,
        Previouspackage: req.body.Previouspackage,
        previousrole: req.body.previousrole,

        imagePath: req.file ? req.file.path : null,
        role: req.body.role,
      });

      const savedAdmin = await newAdmin.save();
      res.status(200).json(savedAdmin);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const activateDeactivateAdmin = async (req, res) => {
  const { adminid } = req.params;
  const { isActive } = req.body;
  console.log("id",adminid);

  try {
    const updatedAdmin = await Admin.findOneAndUpdate(
      { adminid: adminid },
      { isActive },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: `Admin with ID ${adminid} not found for activation/deactivation` });
    }

    const status = updatedAdmin.isActive ? 'active' : 'inactive';

    res.status(200).json({
      message: `Admin ${status} successfully`,
      isActive: updatedAdmin.isActive,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






  

const getAllAdmin = async (req, res) => {
  try {
      const admin = await Admin.find();
      res.status(200).json(admin);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteAdmin = async (req, res) => {
  const adminId = req.params.id;
  try {
    await Admin.findOneAndDelete({ adminid: adminId });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAdmin = async (req, res) => {
  const adminId = req.params.id;
  const updatedAdminData = req.body;

  try {
    const updatedAdmin = await Admin.findOneAndUpdate(
      { adminid: adminId },
      { $set: updatedAdminData },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found for update' });
    }

    res.status(200).json({ message: 'Admin updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  updateAdmin,
};




const loginAdminOne = async (req, res) => {
  const { employeeid, password } = req.body;

  try {
    const admin = await Admin.findOne({ adminid: employeeid });

    // Check if the employee exists and the passwords match
    if (!admin || admin.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Include any other necessary employee information
    const user = { role: 'admin', adminid: admin.adminid,
    fullname: admin.fullname,
    email: admin.email,
    department:admin.department,
  };

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}



const loginAdmin = async (req, res) => {
  try {
    const { adminid, password, role } = req.body;

    const user = await Admin.findOne({ adminid });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Admin not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }

    if (user.role === role) {
      res.status(200).json({
        success: true,
        user: {
            adminid: user.adminid,
          fullname: user.fullname,
          email: user.email,
          department:user.department,
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

module.exports = { loginAdminOne,getLatestAdminId, addAdmin, deleteAdmin, updateAdmin, upload,loginAdmin,getAllAdmin,generateUniqueId,activateDeactivateAdmin };