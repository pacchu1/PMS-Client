// Leave2.js

import React, { useState, useEffect } from "react";
import "./Leave2.css";
import axios from "axios";
import Sidebaremp from "../../Employee/Sidebaremp";

const Leave2 = ({ calendarEvents }) => {
  const [status, setStatus] = useState("");
  const [department, setDepartment] = useState("");
  const [isSingleDayLeave, setIsSingleDayLeave] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    const getCurrentDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    fetchEmployees();
    setFromDate(getCurrentDate());
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/employee_data");

      const loggedInEmployeeDataInResponse = response.data.find(
        (employee) => employee.employeeid === loggedInEmployeeData.employeeid
      );

      if (loggedInEmployeeDataInResponse) {
        const departmentFromLoggedInEmployee =
          loggedInEmployeeDataInResponse.department;

        setDepartment(departmentFromLoggedInEmployee);
      } else {
        console.error("Logged-in employee not found in response data.");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setStatus("Error fetching employees");
    }
  };

  const loggedInEmployeeData = JSON.parse(
    localStorage.getItem("loggedInEmployee")
  );
  const empIdFromLocalStorage = loggedInEmployeeData.employeeid;
  const empNameFromLocalStorage = loggedInEmployeeData.fullname;

  const handleSingleDayChange = (e) => {
    setIsSingleDayLeave(e.target.checked);

    // If the checkbox is checked, set both "From" and "To" date to today's date
    if (e.target.checked) {
      const today = new Date().toISOString().split("T")[0];
      setFromDate(today);
      setToDate(today);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSingleDayLeave || fromDate <= toDate) {
      setDateError("");
      setStatus("Sending...");
  
      const { leaveType, comment, file } = e.target.elements;
  
      const adjustedToDate = isSingleDayLeave ? fromDate : toDate;
  
      const details = {
        empId: empIdFromLocalStorage,
        empName: empNameFromLocalStorage,
        empDepartment: department,
        email: loggedInEmployeeData.email,
        leaveType: leaveType.value,
        fromDate: fromDate,
        toDate: adjustedToDate,
        comment: comment.value,
        // file: file.value,
      };
  
      try {
        const response = await axios.post(
          "http://localhost:5000/submitLeave",
          details
        );
        setStatus("");
        alert(response.data.status);
  
        // Reload the page after successful submission
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        // console.error("Error submitting leave:", error);
  
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
        console.log("Error response headers:", error.response.headers);
  
        setStatus("Error submitting leave");
        setDateError("Per Day Only One Leave Should be Applied.");
  
        // Show alert with error message
        alert("Error submitting leave: Per Day Only One Leave Should be Applied.");
  
        // Delay for 2 seconds before refreshing the page
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } else {
      setDateError("From date and To date should be Mandatory");
      // Show alert with error message
      alert("From date and To date should be Mandatory");
    }
  };
  
  return (
    <div className="mothercontainer-admin">
      <Sidebaremp />
      <div className="custom-container">
        <div className="custom-sec-page">
          <div className="custom-daily">
            <h1 className="custom-leavetypeh1">Apply Leave</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="rowchange9897">
              <div className="custom-leavetype">
                <label className="custom-employee-label" htmlFor="empId">
                  Emp ID
                </label>
                <input
                  type="text"
                  id="custom-empId"
                  name="empId"
                  className="custom-sasi"
                  required
                  value={empIdFromLocalStorage}
                  readOnly
                />
              </div>

              <div className="custom-leavetype">
                <label className="custom-employee-label" htmlFor="empName">
                  Emp Name
                </label>
                <input
                  type="text"
                  id="custom-empName"
                  name="empName"
                  className="custom-sasi"
                  required
                  value={empNameFromLocalStorage}
                  readOnly
                />
              </div>
            </div>

            <div className="rowchange9897">
              <div className="custom-leavetype">
                <label
                  className="custom-employee-label"
                  htmlFor="empDepartment"
                >
                  Emp Department
                </label>
                <input
                  type="text"
                  id="custom-empDepartment"
                  name="empDepartment"
                  className="custom-sasi"
                  value={department}
                  readOnly
                />
              </div>

              <div className="custom-leavetype">
                <label className="custom-employee-label" htmlFor="email">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="custom-sasi"
                  value={loggedInEmployeeData.email}
                  readOnly
                />
              </div>
            </div>
            <div className="rowchange9897">
              <div className="custom-leavetype">
                <label className="custom-employee-label" htmlFor="leaveType">
                  Leave Type
                </label>
                <select
                  id="custom-leaveType"
                  name="leaveType"
                  className="custom-sasi99"
                  required
                >
                  <option value="">Select Leave Type</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Maternity/Paternity Leave">
                    Maternity/Paternity Leave
                  </option>
                  <option value="Personal Leave">Personal Leave</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="custom-leavetype">
                <label className="custom-employee-label" htmlFor="comment">
                  Purpose of leave
                </label>
                <input
                  className="custom-sasi"
                  id="custom-comment"
                  name="comment"
                  required
                ></input>
              </div>
            </div>

            <div className="custom-leavetype99">
              <input
                className="leavebox"
                type="checkbox"
                id="singleDay"
                name="singleDay"
                onChange={handleSingleDayChange}
              />
              <label
                className="custom-employee-label99"
                htmlFor="singleDay"
              >
                Single Day Leave
              </label>
            </div>

            {isSingleDayLeave ? (
              // Single date input for single-day leave
              <div className="custom-leavetype">
                <label className="custom-employee-label" htmlFor="fromDate">
                  Date
                </label>
                <input
                  className="custom-date"
                  type="date"
                  id="custom-fromDate"
                  name="fromDate"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
            ) : (
              // 'From' and 'To' date inputs for multiple-day leave
              <div className="rowchange9897">
                <div className="custom-from">
                  <label className="custom-employee-label" htmlFor="fromDate">
                    From
                  </label>
                  <input
                    className="custom-date99"
                    type="date"
                    id="custom-fromDate"
                    name="fromDate"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

                <div className="custom-from">
                  <label className="custom-employee-label" htmlFor="toDate">
                    To
                  </label>
                  <input
                    className="custom-date99"
                    type="date"
                    id="custom-toDate"
                    name="toDate"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="center342">
              <button className="custom-leave-button" type="submit">
                {status}
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Leave2;
