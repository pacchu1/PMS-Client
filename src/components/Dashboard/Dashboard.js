import React, { useState, useEffect } from "react";
import { BsFillBookmarkFill } from "react-icons/bs";
import { FaUsers, FaTh, FaUser } from "react-icons/fa";
import axios from "axios";
import Modal from "react-modal";
import "./Dashboard.css";
import SideBaradmin from "../SideBaradmin";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [deptCount, setDeptCount] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyQuote, setDailyQuote] = useState("");
  const [employeesOnLeave, setEmployeesOnLeave] = useState([]);
  const [detailedViewData, setDetailedViewData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  const [isDetailViewModalOpen, setIsDetailViewModalOpen] = useState(false);
  const [isPreviousPopupOpen, setIsPreviousPopupOpen] = useState(false);
  const [previousDetails, setPreviousDetails] = useState(null);
  const [previousLeaves, setPreviousLeaves] = useState([]);
  const [rejectedApplications, setRejectedApplications] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [filteredApprovedApplications, setFilteredApprovedApplications] =
    useState([]);
  const [tab, setTab] = useState("");
  const [employeeDataVisible, setEmployeeDataVisible] = useState(true);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTermPending, setSearchTermPending] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const isEmployeeIdNotFound = filteredItems.length === 0 && searchTerm !== "";
  const [todaysLeaveData, setTodaysLeaveData] = useState(null);
  const [employeesOnLeaveCount,setEmployeesOnLeaveCount] = useState(0);
  const openTodaysLeaveData = async (empId) => {
    try {
      // Make API request to fetch leave data for the current day based on empId
      const response = await fetch(`/api/todaysLeave?empId=${empId}`);
      if (response.ok) {
        const data = await response.json();
        setTodaysLeaveData(data); // Update state with leave data for the current day
      } else {
        console.error("Failed to fetch leave data for the current day");
      }
    } catch (error) {
      console.error("Error fetching leave data for the current day:", error);
    }
  };

  const handleSearchTermChange = (event) => {
    let searchTerm = event.target.value;

    // Check if the search term starts with "MTSD" already (case-insensitive)
    if (!/^MTSD/i.test(searchTerm)) {
      // Prepend "MTSD" to the search term
      searchTerm = "MTSD" + searchTerm;
    }

    setSearchTerm(searchTerm);

    if (!searchTerm) {
      setFilteredItems(previousLeaves);
    } else {
      const filtered = previousLeaves.filter(
        (leave) =>
          leave.empId.toUpperCase().includes(searchTerm.toUpperCase()) ||
          leave.empName.toUpperCase().includes(searchTerm.toUpperCase())
      );
      setFilteredItems(filtered);
    }
    setCurrentPage(0); // Reset to first page when searching
  };

  // const filterItems = (searchTerm) => {
  //   const filtered = previousLeaves.filter(
  //     (leave) => leave.empId.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredItems(filtered);
  // };

  const handleSearchTermChangePending = (event) => {
    setSearchTermPending(event.target.value);
  };

  useEffect(() => {
    if (approvedApplications) {
      const filtered = approvedApplications.filter((application) =>
        application.empId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [approvedApplications, searchTerm]);

  // Define handleEmployeeIdClick function
  const handleEmployeeIdClick = (employeeId) => {
    console.log("Employee ID clicked:", employeeId);
  };

  const handleTabChange = (tabName) => {
    // If the clicked tab is already active, close it
    if (tab === tabName) {
      setTab("");
      setEmployeeDataVisible(true); // Show employee data when tab is closed
    } else {
      setTab(tabName);
      setEmployeeDataVisible(false); // Hide employee data when tab is clicked
    }
  };
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch("http://localhost:5000/employee_data");
        const responseOne = await fetch(
          "http://localhost:5000/api/department_data"
        );
        const employeeData = await response.json();
        const deptData = await responseOne.json();
        setEmployeeData(employeeData);
        setDeptCount(deptData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        // Get the current date and format it to mm/dd/yyyy
        const currentDate = new Date();
        const formattedMonth = (currentDate.getMonth() + 1)
          .toString()
          .padStart(2, "0"); // Ensure month is 2 digits
        const formattedDay = currentDate.getDate().toString().padStart(2, "0"); // Ensure day is 2 digits
        const formattedDate = `${formattedMonth}/${formattedDay}/${currentDate.getFullYear()}`;

        const response = await axios.get(
          `http://localhost:5000/attendance/current?date=${formattedDate}`
        );
        setAttendanceData(response.data);
        console.log("Attendance data received:", response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setLoading(false);
      }
    };
    fetchAttendanceData();
  }, []);

  const handleOnLeaveTodayClick = async () => {
    try {
      await fetchDetailedViewData();
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error handling leave today click:", error);
    }
  };

  const fetchDetailedViewData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/leave_today");
      const data = await response.json();

      // Filter data where fromDate is equal to the current date
      const currentDate = new Date().toISOString().split("T")[0];
      const filteredData = data.filter(
        (entry) => entry.fromDate === currentDate
      );

      console.log("leave_today", filteredData);

      setEmployeesOnLeave(filteredData); // Update employees on leave state with the filtered data
      setDetailedViewData(filteredData);
    } catch (error) {
      console.error("Error fetching employees on leave today:", error);
    }
  };

  useEffect(() => {
    const fetchDailyQuote = async () => {
      try {
        const response = await axios.get("https://api.quotable.io/random");
        const { content, author } = response.data;
        const quote = ` ${content} - ${author}`;
        setDailyQuote(quote);
      } catch (error) {
        console.error("Error fetching daily quote:", error);
      }
    };

    fetchDailyQuote();

    const intervalId = setInterval(fetchDailyQuote, 24 * 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

 

  const fetchEmployeesOnLeaveToday = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/leave_today");
      const data = await response.json();
      console.log("leave_today", data);
      setEmployeesOnLeave(data);
      setEmployeesOnLeaveCount(employeesOnLeave.length)
      console.log("leave_today", employeesOnLeave);
    } catch (error) {
      console.error("Error fetching employees on leave today:", error);
    }
  };

  useEffect(()=>{
    fetchEmployeesOnLeaveToday()
  },[fetchEmployeesOnLeaveToday])
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // const employee = await LeaveModel.findOne({ empId: req.params.employeeId });

  const openDetailViewModal = async (employeeId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/employee_details/${employeeId}`
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        if (response.status === 404) {
          console.error(`Employee with ID ${employeeId} not found`);
        } else {
          throw new Error(
            `Failed to fetch employee details. Status: ${response.status}`
          );
        }
      }

      const detailsData = await response.json();
      console.log("Employee details data:", detailsData);

      setSelectedEmployeeDetails(detailsData);
      setIsDetailViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  const handlePreviousPopupClick = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/previous_details"
      );
      const previousDetails = await response.json();

      setPreviousDetails(previousDetails);
      setIsPreviousPopupOpen(true);
    } catch (error) {
      console.error("Error fetching previous details:", error);
    }
  };

  useEffect(() => {
    if (isPreviousPopupOpen) {
      fetchPreviousLeaves();
    }
  }, [isPreviousPopupOpen]);

  // Function to fetch previous day's leaves
  const fetchPreviousLeaves = async () => {
    try {
      // Fetch previous day's leaves from the backend
      const response = await fetch("http://localhost:5000/api/allLeaveData"); // Adjust the API endpoint as per your backend routes
      if (!response.ok) {
        throw new Error("Failed to fetch previous leaves");
      }
      const data = await response.json();
      setPreviousLeaves(data);
    } catch (error) {
      console.error(error);
      // Handle error, such as displaying an error message to the user
    }
  };

  const fetchApprovedLeaveApplications = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/approved_leave_applications"
      );
      const data = await response.json();
      // Handle the approved leave applications data as needed
      console.log("Approved leave applications:", data);
    } catch (error) {
      console.error("Error fetching approved leave applications:", error);
    }
  };

  const fetchRejectedLeaveApplications = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/rejected_leave_applications"
      );
      const data = await response.json();
      // Handle the rejected leave applications data as needed
      console.log("Rejected leave applications:", data);
    } catch (error) {
      console.error("Error fetching rejected leave applications:", error);
    }
  };
  const fetchPendingLeaveApplications = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/pending_leave_applications"
      );
      const data = await response.json();
      // Handle the pending leave applications data as needed
      console.log("Pending leave applications:", data);
    } catch (error) {
      console.error("Error fetching pending leave applications:", error);
    }
  };

  const handleLeaveApproval = async (leaveId, status) => {
    try {
      const response = await axios.post("http://localhost:5000/approveLeave", {
        leaveId,
        status,
      });

      alert(response.data.status); // Show success alert if needed

      // Fetch updated data after approval/rejection
      const updatedPendingApplications = await fetchPendingLeaveApplications();
      const updatedApprovedApplications =
        await fetchApprovedLeaveApplications();
      const updatedRejectedApplications =
        await fetchRejectedLeaveApplications();

      // Update state with updated data
      setPendingApplications(updatedPendingApplications);
      setApprovedApplications(updatedApprovedApplications);
      setRejectedApplications(updatedRejectedApplications);
    } catch (error) {
      console.error("Error approving/rejecting leave:", error);
      alert("Failed to approve/reject leave. Please try again.");
    }
  };

  useEffect(() => {
    const fetchLeaveApplications = async () => {
      try {
        const [approved, rejected, pending] = await Promise.all([
          fetchApplications("approved"),
          fetchApplications("rejected"),
          fetchApplications("pending"),
        ]);
        setApprovedApplications(approved);
        setRejectedApplications(rejected);
        setPendingApplications(pending);
      } catch (error) {
        console.error("Error fetching leave applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveApplications();
  }, []);

  const fetchApplications = async (status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/${status}_leave_applications`
      );
      return response.json();
    } catch (error) {
      console.error(`Error fetching ${status} leave applications:, error`);
      return [];
    }
  };

  const calculateDaysDifference = (fromDate, toDate) => {
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const differenceInTime = endDate.getTime() - startDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays + 1;
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedItems = previousLeaves.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  return (
    <div className="mothercontainer-admin">
      <SideBaradmin />
      <div className="home1p">
        <div className="outsideborder1p">
          <h1 className="manage-employee1p">Dashboard</h1>
          <div className="dashboard-header1p">
            <div className="flexchain754">
              <div className="box645 box-bg-pink1p">
                <Link className="link-class" to="/ManageEmployee">
                  <p className="usha1p">Total Employees</p>
                  <div className="icon-value1p">
                    <div className="icon1p">
                      <FaUsers size={30} />
                    </div>
                    <span className="value456">
                      {loading ? "Loading..." : employeeData.length}
                    </span>
                  </div>
                </Link>
              </div>

              <div className="box645 box-bg-purple1p">
                <Link className="link-class" to="/ManageDepartment">
                  <p className="usha1p">Total Department</p>
                  <div className="icon-value1p">
                    <div className="icon1p">
                      <FaTh size={30} />
                    </div>
                    <span className="value456">{deptCount.length}</span>
                  </div>{" "}
                </Link>
              </div>
            </div>
            <div className="flexchain754">
              <div className="box645 box-bg-cyan1p">
                <Link className="link-class" to="/Attendance">
                  <p className="usha1p">Present Today</p>
                  <div className="icon-value1p">
                    <div className="icon1p">
                      <FaUser size={30} />
                    </div>
                    <span className="value456">
                      {attendanceData.totalCount}
                    </span>{" "}
                  </div>{" "}
                </Link>
              </div>
              <div className="box645 box-bg-ash1p">
      <p className="usha1p">On Leave Today</p>
      <div
        className="icon-value1p clickable09"
        onClick={handleOnLeaveTodayClick}
      >
        <div className="icon1p">
          <BsFillBookmarkFill size={30} />
        </div>
        <span className="value456">{employeesOnLeaveCount}</span>
      </div>
    </div>
            </div>
          </div>
        </div>

        <div className="outsideborder1p24">
          <h1 className="manage-employee11p">Quote of the Moment</h1>
          <div className="header1p">
            <div
              className="manage-employee11p23"
              style={{ textDecoration: "none" }}
            >
              {dailyQuote || "Loading quote..."}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for On Leave Today */}
      <Modal
        className={"modelstyle12"}
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="On Leave Today Modal"
      >
        <div className="maincontainer443">
          <div className="previousbtn765">
            <button
              className="btn-previous"
              onClick={() => setIsPreviousPopupOpen(true)}
            >
              Previous Day's Leaves
            </button>

            <input
              className="searchby43"
              type="text"
              placeholder="Search by Employee ID"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />

            <div className="renderbutton">
              <button
                className={`tab tab-btn ${
                  tab === "approved" ? "active110" : ""
                }`}
                onClick={() => handleTabChange("approved")}
              >
                Approved
              </button>
              <button
                className={`tab tab-btn ${
                  tab === "rejected" ? "active110" : ""
                }`}
                onClick={() => handleTabChange("rejected")}
              >
                Rejected
              </button>
              <button
                className={`tab tab-btn ${
                  tab === "pending" ? "active110" : ""
                }`}
                onClick={() => handleTabChange("pending")}
              >
                Pending
              </button>
            </div>
          </div>
        </div>

        <>
          {employeeDataVisible && (
            <div className="indexbox12">
              <h2 className="detaildash">
                <u>Today's Leave</u>
              </h2>
              {detailedViewData &&
                detailedViewData.map((employee, index) => (
                  <div
                    key={index}
                    className={`open-details ${
                      employee.status === "approved"
                        ? "approved"
                        : employee.status === "rejected"
                        ? "rejected"
                        : ""
                    }`}
                  >
                    <p className="employee123">
                      <span
                        className="idselect89"
                        onClick={() => openDetailViewModal(employee._id)} // Use MongoDB _id here
                      >
                        {employee.empId} {/* Display MongoDB _id */}
                      </span>
                    </p>
                    &nbsp;&nbsp;&nbsp;
                    <p className="parawidth56">{employee.empName}</p>
                    <div className="btnflex">
                      <button
                        className="approve-btn"
                        onClick={() =>
                          handleLeaveApproval(employee._id, "approved")
                        }
                        disabled={employee.status === "approved"}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() =>
                          handleLeaveApproval(employee._id, "rejected")
                        }
                        disabled={employee.status === "rejected"}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </>

        <div>
          <div className="applications-container">
            {tab === "approved" && (
              <div className="overflow120">
                <h2 className="applicationemp">
                  {" "}
                  <u>Approved Applications</u>
                </h2>

                <div className="approvetab9980">
                  <table className="application-table">
                    <thead className="thead12">
                      <tr>
                        <th className="approvedthem123">Employee ID</th>
                        <th className="approvedthem123">Employee Name</th>
                        <th className="approvedthem123">Leave Type</th>
                        <th className="approvedthem123">Applied Date</th>
                      </tr>
                    </thead>
                    <tbody className="tbody097">
                      {approvedApplications
                        .sort(
                          (a, b) => new Date(b.fromDate) - new Date(a.fromDate)
                        )
                        .map((application) => (
                          <tr
                            key={application._id}
                            className="application-row approved"
                          >
                            <td className="approvedtd">{application.empId}</td>
                            <td className="approvedtd txtleft">
                              {application.empName}
                            </td>
                            <td className="approvedtd txtleft">
                              {application.leaveType}
                            </td>
                            <td className="approvedtd">
                              {application.fromDate}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === "rejected" && (
              <div className="overflow120">
                <h2 className="applicationemp">
                  {" "}
                  <u>Rejected Applications</u>
                </h2>
                <div className="approvetab9980">
                  <table className="application-table">
                    <thead className="thead12">
                      <tr>
                        <th className="rejectedthem123">Employee ID</th>
                        <th className="rejectedthem123">Employee Name</th>
                        <th className="rejectedthem123">Leave Type</th>
                        <th className="rejectedthem123">Applied Date</th>
                        {/* Add more table headers for additional details */}
                      </tr>
                    </thead>
                    <tbody>
                      {rejectedApplications
                        .sort(
                          (a, b) => new Date(b.fromDate) - new Date(a.fromDate)
                        )
                        .map((application) => (
                          <tr
                            key={application._id}
                            className="application-row rejected"
                          >
                            <td className="rejectedtd">{application.empId}</td>
                            <td className="rejectedtd txtleft">
                              {application.empName}
                            </td>
                            <td className="rejectedtd txtleft">
                              {application.leaveType}
                            </td>
                            <td className="rejectedtd">
                              {application.fromDate}
                            </td>
                            {/* Add more table cells for additional details */}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === "pending" && (
              <div className="overflow120">
                <h2 className="applicationemp">
                  {" "}
                  <u>Pending Applications</u>
                </h2>
                <div className="approvetab9980">
                  {pendingApplications.length === 0 ? (
                    <p className="nopending">There are no pending leaves</p>
                  ) : (
                    <table className="application-table">
                      <thead className="thead12">
                        <tr>
                          <th className="approvedthem123">Employee ID</th>
                          <th className="approvedthem123">Leave Type</th>
                          <th className="approvedthem123">Applied Date</th>
                          <th className="approvedthem123">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="tbody667">
                        {pendingApplications.map((application) => (
                          <tr
                            key={application._id}
                            className="application-row pending"
                          >
                            <td className="approvedtd txtleft">
                              {application.empId}
                            </td>
                            <td className="approvedtd txtleft">
                              {application.leaveType}
                            </td>
                            <td className="approvedtd">
                              {application.fromDate}
                            </td>
                            <td className="btnflex approvedtd">
                              <button
                                className={`approve-btn ${
                                  application.isApproved ? "approved" : ""
                                }`}
                                onClick={() =>
                                  handleLeaveApproval(
                                    application._id,
                                    "approved"
                                  )
                                }
                                disabled={
                                  application.isApproved ||
                                  application.isRejected
                                }
                              >
                                {application.isApproved
                                  ? "Approved"
                                  : "Approve"}
                              </button>
                              <button
                                className={`reject-btn ${
                                  application.isRejected ? "rejected" : ""
                                }`}
                                onClick={() =>
                                  handleLeaveApproval(
                                    application._id,
                                    "rejected"
                                  )
                                }
                                disabled={
                                  application.isApproved ||
                                  application.isRejected
                                }
                              >
                                {application.isRejected ? "Rejected" : "Reject"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <Modal
          className={"leave-approvals12"}
          isOpen={isPreviousPopupOpen}
          onRequestClose={() => setIsPreviousPopupOpen(false)}
          contentLabel="Previous Day's Leaves Modal"
        >
          <div className="detaildash">
            <h2 className="previousdays">Leave Approvals</h2>
            <button
              className="leavapp756"
              onClick={() => setIsPreviousPopupOpen(false)}
            >
              X
            </button>
          </div>

          <input
            className="searchby4343"
            type="text"
            placeholder="Search by Employee ID"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
          <br />

          <div className="maintablecont">
            <table className="table112">
              <thead className="thead112">
                <tr className="tr112">
                  <th className="dashth123">Employee ID</th>
                  <th className="dashth123">Employee Name</th>
                  <th className="dashth123">Department</th>
                  <th className="dashth123">Purpose of Leave</th>
                  <th className="dashth123">Status</th>
                  <th className="dashth123">From-Date</th>
                  <th className="dashth123">To-Date</th>
                  <th className="dashth123">No-Days</th>
                </tr>
              </thead>
              <tbody>
                {displayedItems
                  .sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate))
                  .map((leave, leaveIndex) => (
                    <tr key={`leave-${leaveIndex}`}>
                      <td className="tdleave">{leave.empId}</td>
                      <td className="tdleave txtleft">{leave.empName}</td>
                      <td className="tdleave txtleft">{leave.empDepartment}</td>
                      <td className="tdleave txtleft">{leave.leaveType}</td>
                      <td className="tdleave">{leave.status}</td>
                      <td className="tdleave">{leave.fromDate}</td>
                      <td className="tdleave">{leave.toDate}</td>
                      <td className="tdleave">
                        {calculateDaysDifference(leave.fromDate, leave.toDate)}
                      </td>
                    </tr>
                  ))}
              </tbody>

              <tbody>
                {isEmployeeIdNotFound && (
                  <tr>
                    <td colSpan="8" className="noemployee">
                      No employee found with ID: {searchTerm}
                    </td>
                  </tr>
                )}
              </tbody>

              <tbody>
                {filteredItems
                  .sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate))
                  .map((leave, leaveIndex) => (
                    <tr key={`leave-${leaveIndex}`}>
                      <td className="tdleave">{leave.empId}</td>
                      <td className="tdleave txtleft">{leave.empName}</td>
                      <td className="tdleave txtleft">{leave.empDepartment}</td>
                      <td className="tdleave txtleft">{leave.leaveType}</td>
                      <td className="tdleave">{leave.status}</td>
                      <td className="tdleave">{leave.fromDate}</td>
                      <td className="tdleave">{leave.toDate}</td>
                      <td className="tdleave">
                        {calculateDaysDifference(leave.fromDate, leave.toDate)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="nextapgeprev">
            <button
              className="prevbutton"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Previous Page
            </button>
            <span className="spanpage">Page {currentPage}</span>
            <button
              className="prevbutton"
              onClick={nextPage}
              disabled={indexOfLastItem >= previousLeaves.length}
            >
              Next Page
            </button>
          </div>
        </Modal>

        <div className="open-details">
          <button
            className="close-btn"
            onClick={() => {
              setIsModalOpen(false); // Close the modal
              // Automatically refresh the page after 1 second
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }}
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Modal for Detailed View */}
      <Modal
        className={"modelstyle1212"}
        isOpen={isDetailViewModalOpen}
        onRequestClose={() => setIsDetailViewModalOpen(false)}
        contentLabel="Detailed View Modal"
      >
        <h2 className="detaildash">
          <u>Leave Application</u>
          <button
            className="cancel-btn"
            onClick={() => setIsDetailViewModalOpen(false)}
          >
            X
          </button>
        </h2>
        {/* Display detailed view data */}
        {selectedEmployeeDetails ? (
          <div className="mail-container">
            <p className="pdashboard">
              Employee ID: {selectedEmployeeDetails.empId}
            </p>
            <p className="pdashboard">
              Employee Name: {selectedEmployeeDetails.empName}
            </p>
            <p className="pdashboard">
              Department: {selectedEmployeeDetails.empDepartment}
            </p>{" "}
            <br />
            <p className="pdashboard">To,</p>
            <p className="pdashboard">The HR Manager,</p>
            <p className="pdashboard">Matrical Technologies,</p>
            <p className="pdashboard">Bangalore.</p> <br />
            <p className="pdashboard">Subject: Application for Leave.</p> <br />
            <p className="pdashboard">Dear Sir/Madam,</p>
            <p className="pdashboard">
              I hope this letter finds you well. I am writing to formally
              request a leave of absence from work due to{" "}
              {selectedEmployeeDetails.leaveType}.
            </p>
            <p className="pdashboard">
              Purpose of Leave: {selectedEmployeeDetails.comment}
            </p>{" "}
            <br />
            <p className="pdashboard">
              From Date:{" "}
              {selectedEmployeeDetails.fromDate
                ? new Date(
                    selectedEmployeeDetails.fromDate
                  ).toLocaleDateString()
                : "N/A"}
            </p>
            <p className="pdashboard">
              To Date:{" "}
              {selectedEmployeeDetails.toDate
                ? new Date(selectedEmployeeDetails.toDate).toLocaleDateString()
                : "N/A"}
            </p>{" "}
            <br />
            <p className="pdashboard">
              Thank you for considering my request. I look forward to your
              positive response.
            </p>{" "}
            <br />
            <p className="pdashboard">Sincerely,</p> <br />
            <p className="pdashboard">
              Employee Name: {selectedEmployeeDetails.empName}
            </p>
            <p className="pdashboard">
              Employee ID: {selectedEmployeeDetails.empId}
            </p>
            <p className="pdashboard">Email: {selectedEmployeeDetails.email}</p>{" "}
            <br />
            <p className="pdashboard">
              file:{" "}
              {selectedEmployeeDetails.file
                ? "Image attached"
                : "No attachment"}
            </p>{" "}
            <br />
          </div>
        ) : (
          <p>Error: Unable to fetch employee details.</p>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
