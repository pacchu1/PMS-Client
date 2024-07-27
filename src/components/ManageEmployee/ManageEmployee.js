import React, { useState, useEffect } from "react";
import axios from "axios";
import Popup from "reactjs-popup";
import ManageEmployeeForm from "./ManageEmployeeForm";
import "./ManageEmployee.css";
import { toast } from "react-toastify";
import Sidebar from "../Sidebar";
import matrical from "../images/matrical-logo(new).png";
import SideBaradmin from "../SideBaradmin";
import { BASE_URL } from "../../Helper/Helper";



const ManageEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddPopupOpen, setAddPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [refreshPage, setRefreshPage] = useState(false); 

 
  useEffect(() => {
    fetchEmployees();
  }, [refreshPage, searchTerm]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/employee_data`);
      console.log("Response data:", response.data); // Check the response data
      setEmployees(response.data);
      // Update filteredEmployees only if searchTerm is empty
      if (!searchTerm) {
        setFilteredEmployees(response.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleViewDetails = (employee) => {
    const employeeDetails = employees.find(
      (e) => e.employeeid === employee.employeeid
    );

    if (employeeDetails) {
      setSelectedEmployeeDetails(employeeDetails);
      setDetailsModalOpen(true);
    } else {
      console.error("Employee details not found:", employee.employeeid);
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setAddPopupOpen(true);
  };

  const handleAddOrUpdate = async (formData) => {
    try {
      if (selectedEmployee) {
        await axios.put(
          `${ BASE_URL }/employee_data/${selectedEmployee.employeeid}`,
          formData
        );
        toast.success("Employee updated successfully!");
      } else {
        await axios.post(`${ BASE_URL }/employee_data/add`, formData);
        toast.success("Employee added successfully!");
      }
      fetchEmployees();
      setSelectedEmployee(null);
      setAddPopupOpen(false);
    } catch (error) {
      console.error("Error adding/updating employee:", error);
      alert(
        "Error adding/updating employee. Please check the console for details."
      );
    }
  };

  const handleCancel = () => {
    setSelectedEmployee(null);
    setAddPopupOpen(false);
    setDetailsModalOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${ BASE_URL }/employee_data/${id}`);
      fetchEmployees();
      window.alert("employee Delete sucessfully...!");
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };
  const handleSearch = () => {
    if (searchTerm) {
      const searchTermLowerCase = searchTerm.toLowerCase();
      const filtered = employees.filter((employee) => {
        if (employee && employee.employeeid && employee.fullname) {
          return (
            employee.employeeid.toLowerCase().includes(searchTermLowerCase) ||
            employee.fullname.toLowerCase().includes(searchTermLowerCase)
          );
        }
        return false;
      });
      setFilteredEmployees(filtered);
    }
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // const handleEdit = (employee) => {
  //   setSelectedEmployee(employee);
  //   setIsPopupOpen(true);
  // };

  // const handleCancel = () => {
  //   setSelectedEmployee(null);
  //   setIsPopupOpen(false);
  // };
  const handleConfirmDelete = async (confirmed) => {
    setDeleteConfirmation(false);
    if (confirmed && deleteId) {
      await handleDeleteAction(deleteId);
    }
    setDeleteId(null);
  };
  const handleDeleteAction = async (id) => {
    try {
      await axios.delete(`${ BASE_URL }/employee_data/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleActivate = async (employeeId) => {
    try {
      const confirmActivate = window.confirm(
        "Are you sure you want to activate this employee?"
      );

      if (confirmActivate) {
        await axios.put(
         ` ${ BASE_URL }/employee_data/${employeeId}/activate_deactivate`,
          { isActive: true }
        );
        fetchEmployees();
        toast.success("Employee activated successfully!");
      } else {
        // User clicked Cancel
        console.log("Activation cancelled by user");
      }
    } catch (error) {
      console.error("Error activating employee:", error);
      toast.error("Error activating employee. Please check the console for details.");
    }
  };

  const handleDeactivate = async (employeeId) => {
    try {
      const confirmDeactivate = window.confirm(
        "Are you sure you want to deactivate this employee?"
      );

      if (confirmDeactivate) {
        await axios.put(
          `${ BASE_URL }/employee_data/${employeeId}/activate_deactivate`,
          { isActive: false }
        );
        fetchEmployees();
        toast.success("Employee deactivated successfully!");
      } else {
        // User clicked Cancel
        console.log("Deactivation cancelled by user");
      }
    } catch (error) {
      console.error("Error deactivating employee:", error);
      toast.error("Error deactivating employee. Please check the console for details.");
    }
  };

  return (
    <div className="mothercontainer-admin ${isPopupOpen ? 'blur-background' : ''}">
      <SideBaradmin />
      <div className="centerchange12">
        <div className="employee-table-container">
          <h2 className="employee-heading">Employee Management</h2>
          <input
            className="search1"
            type="text"
            placeholder="Search by ID "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button1" onClick={handleSearch}>
            Search
          </button>
          <div className="overchange34">
            <table className="employee-table">
              <thead className="thread45">
                <tr>
                  <th>Employee ID</th>
                  <th>Full Name</th>
                  <th>Department</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Contact</th>
                  <th>Local Address</th>
                  {/* <th>Role</th>
                  <th>Email</th> */}
                  <th>Actions</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="flowchain56">
                {filteredEmployees.map((employee) => (
                  <tr className="trborder43" key={employee.employeeid}>
                    <td
                      className="clickable tdborder32"
                      onClick={() => handleViewDetails(employee)}
                    >
                      {employee.employeeid}
                    </td>
                    <td className="tdborder32 textleft">{employee.fullname}</td>
                    <td className="tdborder32 textleft">{employee.department}</td>
                    <td className="tdborder32">{employee.dateofbirth}</td>
                    <td className="tdborder32">{employee.gender}</td>
                    <td className="tdborder32">{employee.contactno}</td>
                    <td className="tdborder32"> {employee.localaddress} </td>
                    {/* <td className="tdborder32">{employee.role}</td>
                    <td className="tdborder32">{employee.email}</td> */}

                    <td className=" tdborder32">
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(employee)}
                      >
                        Edit
                      </button>
                     
                    </td>
                    <td className=" tdborder32">
                      
                    <button
                    className={`activate-deactivate-button ${
                      employee.isActive ? "active12" : "inactive12"
                    }`}
                    onClick={() =>
                      employee.isActive
                        ? handleDeactivate(employee.employeeid)
                        : handleActivate(employee.employeeid)
                    }
                  >
                    {employee.isActive ? "Deactivate" : "Activate"}
                  </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Employee Details Modal */}

          {detailsModalOpen && selectedEmployeeDetails && (
            <div className="pms-popup4532">
              <div className="pms-emp-pop">
                <div className="emp-header">
                  <h2 className="pms-emp-pop1">Employee Details</h2>
                </div>

                <div className="mainsection012">
                  <div className="section01">
                    <h3 className="heading0045">Basic Details</h3>
                    <div className="basicedit-main">
                      <div className="popup-form45">
                        <p className="basicedit">
                          {selectedEmployeeDetails.imagePath ? (
                            <img
                              className="employeeimage"
                              src={`${ BASE_URL }/${selectedEmployeeDetails.imagePath}`}
                              alt=""
                              style={{ height: "150px", width: "150px" }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = matrical; // Fallback image URL or a placeholder
                              }}
                            />
                          ) : (
                            <span>No image available</span>
                          )}
                        </p>

                        <img className="matrical-logo" src={matrical}></img>
                      </div>

                      <br />
                      <p className="basicedit">
                        <p className="spanwidth40">Employee ID</p>
                        :&nbsp;&nbsp;&nbsp; {selectedEmployeeDetails.employeeid}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Full Name</p>
                        :&nbsp;&nbsp;&nbsp; {selectedEmployeeDetails.fullname}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Father's Name</p>
                        :&nbsp;&nbsp;&nbsp; {selectedEmployeeDetails.fathername}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40"> Mother Name </p>:
                        &nbsp;&nbsp;&nbsp;{selectedEmployeeDetails.mothername}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Department </p>
                        :&nbsp;&nbsp;&nbsp; {selectedEmployeeDetails.department}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Gender</p>:
                        &nbsp;&nbsp;&nbsp;{selectedEmployeeDetails.gender}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Date of Birth</p>:
                        &nbsp;&nbsp;&nbsp;{selectedEmployeeDetails.dateofbirth}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Contact </p>:
                        &nbsp;&nbsp;&nbsp;{selectedEmployeeDetails.contactno}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40"> Alternate Number</p>:
                        &nbsp;&nbsp;&nbsp;{selectedEmployeeDetails.alternateno}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Email</p>: &nbsp;&nbsp;&nbsp;
                        {selectedEmployeeDetails.email}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Password</p>
                        :&nbsp;&nbsp;&nbsp; {selectedEmployeeDetails.password}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Confirm Password</p>:
                        &nbsp;&nbsp;&nbsp;
                        {selectedEmployeeDetails.confirmpassword}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Local Address</p>:
                        &nbsp;&nbsp;&nbsp;{selectedEmployeeDetails.localaddress}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40"> Permenant Address</p>
                        :&nbsp;&nbsp;&nbsp;{" "}
                        {selectedEmployeeDetails.permenantaddress}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Joining Date</p>
                        :&nbsp;&nbsp;&nbsp;{" "}
                        {selectedEmployeeDetails.joiningdate}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Role</p>:&nbsp;&nbsp;&nbsp;{" "}
                        {selectedEmployeeDetails.role}
                      </p>
                      {/* </div>

                <div className="extradetails"> */}
                      <p className="basicedit">
                        <p className="spanwidth40">Desigination</p> :
                        &nbsp;&nbsp;&nbsp;{selectedEmployeeDetails.desigination}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Work Location</p>:
                        &nbsp;&nbsp;&nbsp;{selectedEmployeeDetails.worklocation}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Marital Status</p>:
                        &nbsp;&nbsp;&nbsp;
                        {selectedEmployeeDetails.martialstatus}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Blood Group</p> :
                        &nbsp;&nbsp;&nbsp;{selectedEmployeeDetails.bloodgroup}
                      </p>
                    </div>
                  </div>

                  <div className="section02">
                    <div>
                      <h3 className="heading0045">Bank Details</h3>
                      <div className="bankdetails-main">
                        <p className="basicedit">
                          <p className="spanwidth40"> Account Number</p>:
                          &nbsp;&nbsp;&nbsp;{selectedEmployeeDetails.accountno}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40">Account Name</p>
                          :&nbsp;&nbsp;&nbsp;{" "}
                          {selectedEmployeeDetails.accountname}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40">IFSC Code</p>:
                          &nbsp;&nbsp;&nbsp;{selectedEmployeeDetails.ifsccode}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40">Bank Name</p>:
                          &nbsp;&nbsp;&nbsp;{selectedEmployeeDetails.bankname}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40">Branch</p>
                          :&nbsp;&nbsp;&nbsp; {selectedEmployeeDetails.branch}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40">UAN</p>: &nbsp;&nbsp;&nbsp;
                          {selectedEmployeeDetails.uan}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="heading0045">Identity Details </h3>
                      <div className="identityedit-main">
                        <p className="basicedit">
                          <p className="spanwidth40">Aadhar Number</p>
                          :&nbsp;&nbsp;&nbsp; {selectedEmployeeDetails.aadhar}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40">PAN Number</p>:
                          &nbsp;&nbsp;&nbsp;{selectedEmployeeDetails.pan}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40">Passport</p>
                          :&nbsp;&nbsp;&nbsp; {selectedEmployeeDetails.passport}
                        </p>
                        {/* <p className="basicedit">
                          <p className="spanwidth40">Driving License</p>:
                          &nbsp;&nbsp;&nbsp;
                          {selectedEmployeeDetails.drivinglicense}
                        </p> */}
                      </div>
                    </div>

                    <div>
                      <h3 className="heading0045">Documentation </h3>
                      <div className="documentedit-main">
                        <p className="basicedit">
                          <p className="spanwidth40">SSC</p>: &nbsp;&nbsp;&nbsp;
                          {selectedEmployeeDetails.tenth}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40">Inter</p>
                          :&nbsp;&nbsp;&nbsp; {selectedEmployeeDetails.inter}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40">UG</p>
                          :&nbsp;&nbsp;&nbsp; {selectedEmployeeDetails.ug}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40">PG</p>
                          :&nbsp;&nbsp;&nbsp; {selectedEmployeeDetails.pg}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40">Experience</p>
                          :&nbsp;&nbsp;&nbsp;{" "}
                          {selectedEmployeeDetails.experience}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40">Previous-PaySlip</p>:
                          &nbsp;&nbsp;&nbsp;
                          {selectedEmployeeDetails.previouspayslip}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40">Previous-Role</p>:
                          &nbsp;&nbsp;&nbsp;
                          {selectedEmployeeDetails.previousrole}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="closebutton">
                  <button className="btnclose213" onClick={handleCancel}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

<Popup
            open={deleteConfirmation}
            onClose={() => handleConfirmDelete(false)}
          >
            <div className="delete-confirmation-popup">
              <p className="ppp23">Are you sure you want to delete this employee?</p>
              <div className="delete-buttons">
                <button onClick={() => handleConfirmDelete(true)}>Yes</button>
                <button onClick={() => handleConfirmDelete(false)}>No</button>
              </div>
            </div>
          </Popup>
          <Popup
            className="pop"
            open={selectedEmployee !== null || isAddPopupOpen}
            onClose={handleCancel}
            closeOnDocumentClick
          >
            <ManageEmployeeForm
              selectedEmployee={selectedEmployee}
              onSubmit={handleAddOrUpdate}
              onCancel={handleCancel}
            />
          </Popup>
        </div>
      </div>
    </div>
  );
};

export default ManageEmployee;