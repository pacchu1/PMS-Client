import React, { useState, useEffect } from "react";
// import '../styles/EmployeeForm.css';

const MangeEmployeeForm = ({ selectedEmployee, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    employeeid: "",
    fullname: "",
    fathername: "",
    mothername: "",
    department: "",
    desigination: "",
    gender: "",
    bloodgroup: "",
    martialstatus: "",
    dateofbirth: "",
    contactno: "",
    alternateno: "",
    email: "",
    password: "",
    confirmpassword: "",
    localaddress: "",
    permenantaddress: "",
    joiningdate: "",
    worklocation: "",

    aadharno: "",
    panno: "",
    passport: "",
    // drivinglicense: "",

    accountno: "",
    accountname: "",
    ifsccode: "",
    bankname: "",
    branch: "",
    uan: "",

    tenth: "",
    inter: "",
    ug: "",
    pg: "",
    experience: "",
    previouspayslip: "",
    previousrole: "",
  });

  useEffect(() => {
    if (selectedEmployee) {
      setFormData(selectedEmployee);
    } else {
      setFormData({
        employeeid: "",
        fullname: "",
        fathername: "",
        mothername: "",
        department: "",
        desigination: "",
        bloodgroup: "",
        gender: "",
        martialstatus: "",
        dateofbirth: "",
        contactno: "",
        alternateno: "",
        email: "",
        password: "",
        confirmpassword: "",
        localaddress: "",
        permenantaddress: "",
        joiningdate: "",
        worklocation: "",

        aadharno: "",
        panno: "",
        passport: "",
        // drivinglicense: "",

        accountno: "",
        accountname: "",
        ifsccode: "",
        bankname: "",
        branch: "",
        uan: "",

        tenth: "",
        inter: "",
        ug: "",
        pg: "",
        experience: "",
        previouspayslip: "",
        previousrole: "",
      });
    }
  }, [selectedEmployee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content1">
        <h2 className="h232">
          {selectedEmployee ? "Edit Employee" : "Add Employee"}
        </h2>
        <form onSubmit={handleSubmit} className="popup-form">
          <div className="threefields90">
            <div className="popup-input">
              <label>Employee ID:</label>
              <input
                type="text"
                name="employeeid"
                value={formData.employeeid}
                onChange={handleChange}
                disabled={selectedEmployee !== null}
              />
            </div>
            <div className="popup-input">
              <label>Full Name:</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
              />
            </div>
            <div className="popup-input">
              <label>Father Name:</label>
              <input
                type="text"
                name="fathername"
                value={formData.fathername}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="threefields90">
            <div className="popup-input">
              <label>Mother Name:</label>
              <input
                type="text"
                name="mothername"
                value={formData.mothername}
                onChange={handleChange}
              />
            </div>

            <div className="popup-input">
              <label htmlFor="department">Department:</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                <option value="Full Stack Development">
                  Full Stack Development
                </option>
                <option value="Mobile App Development">
                  Mobile App Development
                </option>
                <option value="Data Science">Data Science</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Digital Marketing">Digital Marketing</option>
                {/* Add more options as needed */}
              </select>
            </div>

            <div className="popup-input">
              <label htmlFor="desigination">Desigination:</label>
              <select
                id="desigination"
                name="desigination"
                value={formData.desigination}
                onChange={handleChange}
              >
                <option value="">Select Designation</option>
                <option value="desigination">Designation 1</option>
                <option value="desigination">Designation 2</option>
                <option value="desigination">Designation 3</option>
                {/* Add more options as needed */}
              </select>
            </div>
          </div>

          <div className="threefields90">
            <div className="popup-input">
              <label>Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="popup-input">
              <label>Blood Group:</label>
              <select
                name="bloodgroup"
                value={formData.bloodgroup}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="popup-input">
              <label>Date of Birth:</label>
              <input
                type="date"
                name="dateofbirth"
                value={formData.dateofbirth}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="threefields90">
            <div className="popup-input">
              <label>Martial Status:</label>
              <select
                name="martialstatus"
                value={formData.martialstatus}
                onChange={handleChange}
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
              </select>
            </div>

            <div className="popup-input">
              <label>Contact :</label>
              <input
                type="tel"
                name="contactno"
                value={formData.contactno}
                onChange={handleChange}
              />
            </div>

            <div className="popup-input">
              <label>Alternate Number:</label>
              <input
                type="tel"
                name="alternateno"
                value={formData.alternateno}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="threefields90">
            <div className="popup-input">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="popup-input">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="popup-input">
              <label>Confirm Password:</label>
              <input
                type="confirmpassword"
                name="confirmpassword"
                value={formData.confirmpassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="threefields90">
            <div className="popup-input">
              <label>Joining Date:</label>
              <input
                name="joiningdate"
                value={formData.joiningdate}
                onChange={handleChange}
              />
            </div>

            <div className="popup-input">
              <label>Work Location:</label>
              <input
                name="worklocation"
                value={formData.worklocation}
                onChange={handleChange}
              />
            </div>

            <div className="popup-input">
              <label>Aadhar Number:</label>
              <input
                name="aadhar"
                value={formData.aadhar}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="threefields90">
            <div className="popup-input">
              <label>PAN Number:</label>
              <input name="pan" value={formData.pan} onChange={handleChange} />
            </div>
            <div className="popup-input">
              <label>Passport:</label>
              <input
                name="passport"
                value={formData.passport}
                onChange={handleChange}
              />
            </div>

            {/* <div className="popup-input">
              <label>Driving License:</label>
              <input
                name="drivinglicense"
                value={formData.drivinglicense}
                onChange={handleChange}
              />
            </div> */}
          </div>

          <div className="threefields90">
            <div className="popup-input">
              <label>Account Number:</label>
              <input
                name="accountno"
                value={formData.accountno}
                onChange={handleChange}
              />
            </div>

            <div className="popup-input">
              <label>Account Name:</label>
              <input
                name="accountname"
                value={formData.accountname}
                onChange={handleChange}
              />
            </div>

            <div className="popup-input">
              <label>IFSC Code:</label>
              <input
                name="ifsccode"
                value={formData.ifsccode}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="threefields90">
            <div className="popup-input">
              <label>Bank Name:</label>
              <input
                name="bankname"
                value={formData.bankname}
                onChange={handleChange}
              />
            </div>

            <div className="popup-input">
              <label>Branch:</label>
              <input
                name="branch"
                value={formData.branch}
                onChange={handleChange}
              />
            </div>
            <div className="popup-input">
              <label>UAN:</label>
              <input name="uan" value={formData.uan} onChange={handleChange} />
            </div>
          </div>

          <div className="threefields90">
            <div className="popup-input">
              <label>SSC:</label>
              <input
                name="tenth"
                value={formData.tenth}
                onChange={handleChange}
              />
            </div>

            <div className="popup-input">
              <label>Inter:</label>
              <input
                name="inter"
                value={formData.inter}
                onChange={handleChange}
              />
            </div>

            <div className="popup-input">
              <label>UG:</label>
              <input name="ug" value={formData.ug} onChange={handleChange} />
            </div>
            <div className="popup-input">
              <label>PG:</label>
              <input name="pg" value={formData.pg} onChange={handleChange} />
            </div>
          </div>

          <div className="threefields90">
            <div className="popup-input">
              <label>Experience:</label>
              <input
                name="experience"
                value={formData.experience}
                onChange={handleChange}
              />
            </div>
            <div className="popup-input">
              <label>Previous-PaySlip:</label>
              <input
                name="previouspayslip"
                value={formData.previouspayslip}
                onChange={handleChange}
              />
            </div>
            <div className="popup-input">
              <label>Previous-Role:</label>
              <input
                name="previousrole"
                value={formData.previousrole}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="threefields9090">
            <div className="popup-input">
              <label>Local Address:</label>
              <textarea
                name="localaddress"
                value={formData.localaddress}
                onChange={handleChange}
              />
            </div>

            <div className="popup-input marginleft453">
              <label>Permanent Address:</label>
              <textarea
                name="permenantaddress"
                value={formData.permenantaddress}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="button-group ">
            <button className="popup-button" type="submit">
              {selectedEmployee ? "Update" : "Add"}
            </button>
            <button
              className="popup-button cancelbtn"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MangeEmployeeForm;
