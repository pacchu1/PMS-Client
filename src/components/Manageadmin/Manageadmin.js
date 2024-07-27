import React, { useState, useEffect } from "react";
import axios from "axios";
import Popup from "reactjs-popup";
import ManageadminForm from "./ManageadminForm";
import "./Manageadmin.css";
import { toast } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../Sidebar";
import matrical from "../images/matrical-logo(new).png";
import SideBaradmin from "../SideBaradmin";
import { BASE_URL } from "../../Helper/Helper";

const Manageadmin = () => {
  const [admin, setAdmin] = useState([]);
  const [filteredAdmin, setFilteredAdmin] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isAddPopupOpen, setAddPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAdminDetails, setSelectedAdminDetails] = useState(null);
  const [adminid, setAdminId] = useState(null);

  useEffect(() => {
    fetchAdmin();
  }, []);

  const fetchAdmin = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin_data`);
      setAdmin(response.data);
      setFilteredAdmin(response.data);
    } catch (error) {
      console.error("Error fetching admin:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (selectedAdmin) => {
    const adminDetails = admin.find(
      (admin) => admin.adminid === selectedAdmin.adminid
    );

    if (adminDetails) {
      setSelectedAdminDetails(adminDetails);
      setDetailsModalOpen(true);
    } else {
      console.error("Admin details not found:", selectedAdmin.adminid);
    }
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setAddPopupOpen(true);
  };

  const handleAddOrUpdate = async (formData) => {
    try {
      if (selectedAdmin) {
        await axios.put(
          `${BASE_URL}/admin_data/${selectedAdmin.adminid}`,
          formData
        );
      } else {
        await axios.post(`${BASE_URL}/admin_data/add`, formData);
      }
      fetchAdmin();
      setSelectedAdmin(null);
      setAddPopupOpen(false);
      toast.success("Admin updated successfully");
    } catch (error) {
      console.error("Error adding/updating admin:", error);
      toast.error("Error adding/updating admin"); // Show error toast
    }
  };

  const handleCancel = () => {
    setSelectedAdmin(null);
    setAddPopupOpen(false);
    setDetailsModalOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/admin_data/${id}`);
      fetchAdmin();
      toast.success("Admin deleted successfully"); // Show success toast
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error("Error deleting admin"); // Show error toast
    }
  };

  const handleSearch = () => {
    const searchTermLowerCase = searchTerm.toLowerCase();
    const filtered = admin.filter((admin) => {
      const adminIdMatch =
        admin.adminid?.toLowerCase().includes(searchTermLowerCase) || false;
      const fullNameMatch =
        admin.fullname?.toLowerCase().includes(searchTermLowerCase) || false;

      return adminIdMatch || fullNameMatch;
    });

    setFilteredAdmin(filtered);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);

    // Clear filtered admin data when search input is empty
    if (e.target.value === "") {
      setFilteredAdmin(admin);
    }
  };

  const handleActivate = async (adminid) => {
    try {
      const confirmActivate = window.confirm(
        "Are you sure you want to activate this admin?"
      );
      if (confirmActivate) {
        const response = await axios.put(
          `${BASE_URL}/admin_data/${adminid}/activate_deactivate`,
          { isActive: true }
        );
        if (response.status === 200) {
          fetchAdmin();
          toast.success("Admin activated successfully!");
        } else {
          console.error("Failed to activate admin. Unexpected response:", response);
          toast.error("Failed to activate admin. Please check the console for details.");
        }
      } else {
        console.log("Activation cancelled by user");
      }
    } catch (error) {
      console.error("Error activating admin:", error);
      toast.error("Error activating admin. Please check the console for details.");
    }
  };
  

  const handleDeactivate = async (adminid) => {
    try {
      const confirmDeactivate = window.confirm(
        "Are you sure you want to deactivate this admin?"
      );
      if (confirmDeactivate) {
        await axios.put(
          `${BASE_URL}/admin_data/${adminid}/activate_deactivate`,
          { isActive: false }
        );
        fetchAdmin(); // Refresh admin list after deactivation
        toast.success("Admin deactivated successfully!");
      } else {
        console.log("Deactivation cancelled by user");
      }
    } catch (error) {
      console.error("Error deactivating admin:", error);
      toast.error(
        "Error deactivating admin. Please check the console for details."
      );
    }
  };


  return (
    <div className="mothercontainer-admin">
      <SideBaradmin />
      <div className="centerchange12">
        <div className="employee-table-container">
          <h2 className="employee-heading">Admin Management</h2>
          <input
            className="search1"
            type="text"
            placeholder="Search by ID "
            value={searchTerm}
            onChange={handleSearchInputChange}
          />

          <button className="search-button1" onClick={handleSearch}>
            Search
          </button>
          <div className="overchange34">
            <table className="employee-table">
              <thead className="thread45">
                <tr>
                  <th>Admin ID</th>
                  <th>Full Name</th>
                  {/* <th>Department</th> */}
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Actions</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="flowchain56">
                {filteredAdmin.map((admin) => (
                  <tr key={admin.adminid}>
                    <td
                      className="clickable td-borders"
                      onClick={() => handleViewDetails(admin)}
                    >
                      {admin.adminid}
                    </td>
                    <td className="left332 td-borders">{admin.fullname}</td>
                    {/* <td>{admin.department}</td> */}

                    <td
                      className="td-borders"
                      // onClick={() => handleViewDetails(employee)}
                    >
                      {admin.dateofbirth}
                    </td>
                    <td className="td-borders">{admin.gender}</td>
                    <td
                      className="td-borders"
                      // onClick={() => handleViewDetails(employee)}
                    >
                      {admin.phonenumber}
                    </td>
                    <td className="left332 td-borders">
                      {admin.currentaddress}
                    </td>
                    <td className="td-borders">{admin.role}</td>
                    <td className="left332 td-borders">{admin.email}</td>
                    <td className="td-borders">{admin.password}</td>
                    <td className=" tdborder32">
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(admin)}
                      >
                        Edit
                      </button>
                    </td>
                    <td className=" tdborder32">
                    <button
                          className={`activate-deactivate-button ${
                            admin.isActive ? "active12" : "inactive12"
                          }`}
                          onClick={() =>
                            admin.isActive
                              ? handleDeactivate(admin.adminid)
                              : handleActivate(admin.adminid)
                          }
                        >
                          {admin.isActive ? "Deactivate" : "Activate"}
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Admin Details Modal */}
          {detailsModalOpen && selectedAdminDetails && (
            <div className="pms-popup4532">
              <div className="pms-emp-pop">
                {/* <div className="pms-emp-pop-content"> */}
                <div className="emp-header">
                  <h2 className="pms-emp-pop1">Admin Details</h2>{" "}
                </div>
                <div className="mainsection012">
                  <div className="section01">
                    <h3 className="basicdetails">Basic Details</h3>
                    <div className="basicedit-main">
                      <div className="popup-form45">
                        <p className="basicedit">
                          {selectedAdminDetails.imagePath ? (
                            <img
                              className="employeeimage"
                              src={`${BASE_URL}/${selectedAdminDetails.imagePath}`}
                              alt=""
                              style={{ height: "140px", width: "140px" }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = matrical; // Fallback image URL or a placeholder
                              }}
                            />
                          ) : (
                            <span>No image available</span>
                          )}
                        </p>

                        <img
                          className="matrical-logo"
                          src={matrical}
                          // style={{ height: "130px", width: "130px " }}
                        ></img>
                      </div>
                      <br />
                      <p className="basicedit">
                        <p className="spanwidth40">Admin ID</p>
                        :&nbsp;&nbsp;&nbsp; {selectedAdminDetails.adminid}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Full Name</p>:
                        &nbsp;&nbsp;&nbsp;{selectedAdminDetails.fullname}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40"> Father Name</p>
                        :&nbsp;&nbsp;&nbsp; {selectedAdminDetails.fathername}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40"> Mother Name </p>:
                        &nbsp;&nbsp;&nbsp;{selectedAdminDetails.mothername}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Department </p>:
                        &nbsp;&nbsp;&nbsp;{selectedAdminDetails.department}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Gender</p>:
                        &nbsp;&nbsp;&nbsp;{selectedAdminDetails.gender}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40"> Date of Birth</p>
                        :&nbsp;&nbsp;&nbsp; {selectedAdminDetails.dateofbirth}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">PhoneNumber</p>:
                        &nbsp;&nbsp;&nbsp;{selectedAdminDetails.phonenumber}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40"> Alternate Number</p>:
                        &nbsp;&nbsp;&nbsp;{selectedAdminDetails.alternateno}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Email</p>:&nbsp;&nbsp;&nbsp;{" "}
                        {selectedAdminDetails.email}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Password</p>
                        :&nbsp;&nbsp;&nbsp; {selectedAdminDetails.password}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">confirmPassword</p>:
                        &nbsp;&nbsp;&nbsp;{selectedAdminDetails.confirmPassword}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40"> CurrentAddress</p>
                        :&nbsp;&nbsp;&nbsp;{" "}
                        {selectedAdminDetails.currentaddress}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40"> Permanent Address</p>
                        :&nbsp;&nbsp;&nbsp;{" "}
                        {selectedAdminDetails.permanentaddress}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Joining Date</p>
                        :&nbsp;&nbsp;&nbsp; {selectedAdminDetails.joiningDate}
                      </p>
                      <p className="basicedit">
                        <p className="spanwidth40">Role</p>: &nbsp;&nbsp;&nbsp;
                        {selectedAdminDetails.role}
                      </p>
                    </div>
                  </div>
                  <div className="section02">
                    <div>
                      <h3 className="identityclass">Profession Details :</h3>
                      <div className="extradetails bankdetails-main">
                        <p className="basicedit">
                          <p className="spanwidth40">Designation</p>
                          :&nbsp;&nbsp;&nbsp; {selectedAdminDetails.designation}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40"> Work Location</p>:
                          &nbsp;&nbsp;&nbsp;{selectedAdminDetails.workLocation}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40"> Martial Status</p>
                          :&nbsp;&nbsp;&nbsp;{" "}
                          {selectedAdminDetails.maritalstatus}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40"> Blood Group </p>
                          :&nbsp;&nbsp;&nbsp; {selectedAdminDetails.bloodgroup}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="identityclass">Identity Details :</h3>
                      <div className="identityedit-main">
                        <p className="basicedit">
                          <p className="spanwidth40"> Aadhar No</p>:
                          &nbsp;&nbsp;&nbsp;{selectedAdminDetails.Aadharno}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40"> PAN No</p>
                          :&nbsp;&nbsp;&nbsp; {selectedAdminDetails.panno}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40"> Passport</p>:
                          &nbsp;&nbsp;&nbsp;{selectedAdminDetails.passport}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="bankdetails">Bank Details</h3>
                      <div className="bankdetails-main">
                        <p className="basicedit">
                          <p className="spanwidth40">Account Number</p>
                          :&nbsp;&nbsp;&nbsp;{" "}
                          {selectedAdminDetails.accountNumber}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40"> A/C HolderName</p>:
                          &nbsp;&nbsp;&nbsp;{selectedAdminDetails.AccountHolder}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40"> IFSC Code</p>
                          :&nbsp;&nbsp;&nbsp; {selectedAdminDetails.ifsccode}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40"> Bank Name</p>:
                          &nbsp;&nbsp;&nbsp;{selectedAdminDetails.bankname}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40">Branch</p>
                          :&nbsp;&nbsp;&nbsp; {selectedAdminDetails.Branch}
                        </p>
                        <p className="basicedit">
                          <p className="spanwidth40">UAN</p>: &nbsp;&nbsp;&nbsp;
                          {selectedAdminDetails.uan}
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
            open={selectedAdmin !== null || isAddPopupOpen}
            onClose={handleCancel}
            closeOnDocumentClick
          >
            <ManageadminForm
              selectedAdmin={selectedAdmin}
              onSubmit={handleAddOrUpdate}
              onCancel={handleCancel}
            />
          </Popup>
        </div>
      </div>
    </div>
  );
};

export default Manageadmin;
