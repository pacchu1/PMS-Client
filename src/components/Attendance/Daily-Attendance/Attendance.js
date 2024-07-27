import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Attendance.css";
import Sidebar from "../../Sidebar";
import SideBaradmin from "../../SideBaradmin";

const Attendance = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("All Department");
  const [selectedDate, setSelectedDate] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    // Fetch employee list when component mounts
    fetchEmployeeList();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const fetchEmployeeList = () => {
    let url = "http://localhost:5000/attendance_data"; // Backend endpoint URL
  
    // Construct query parameters based on selected department and date
    const queryParams = {};
    if (selectedDepartment !== "All Department") {
      queryParams.department = selectedDepartment;
    }
    if (selectedDate) {
      // Format the selected date to mm/dd/yyyy
      const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      queryParams.date = formattedDate;
    }
  
    // Append query parameters to the URL
    const queryString = new URLSearchParams(queryParams).toString();
    if (queryString) {
      url += "?" + queryString;
    }
  
    // Log the request URL
    console.log("Request URL:", url);
  
    // Send GET request to the backend
    fetch(url)
      .then((res) => res.json())
      .then(
        (data) => {
          setEmployeeList(data);
          setShowTable(true);
        },
        (error) => {
          console.error("Error fetching employee list:", error);
        }
      );
  };
  
  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleButtonClick = () => {
    fetchEmployeeList();
  };

  return (
    <div className="mothercontainer-admin">
      <SideBaradmin />
      <div className="home222s">
        
          <div className="outsideborder3s">
            <h1 className="attendance3s">Daily Employee Attendance</h1>
            <div className="header3s">
              <div className="fields3s">
                <h1 className="employee3s">Employees By Department</h1>
                <select
                className="selectbox40s"
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                >
                  <option value="All Department">All Department</option>
                  <option value="FULLSTACK DEVELOPER">Full Stack Development</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                </select>
              </div>
              <div className="fields3s">
                <h1 className="employee3s">Date</h1>
                <input
                className="selectbox49s"
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </div>
              <div>
                <button className="report-button421s" onClick={handleButtonClick}>Get Employee List</button>
              </div>
            </div>
            {showTable && (
            <div className="outsideborder23s">
              
              <table className="table-border12">
                <thead className="thead21">
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Start Date</th>
                    <th>Start Time</th>
                    <th>Break In Time</th>
                    <th>Break Out Time</th>
                    <th>End Date</th>
                    <th>End Time</th>
                    <th>Total Work Time</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeList.map((employee, index) => (
                    <tr key={index}>
                      <td className="attend341">{employee.employeeId}</td>
                      <td className="attend341">{employee.fullname}</td>
                      <td className="attend341">{employee.department}</td>
                      <td className="attend341">{employee.startDate}</td>
                      <td className="attend341">{employee.startTime}</td>
                      <td className="attend341">{employee.breakInTime}</td>
                      <td className="attend341">{employee.breakOutTime}</td>
                      <td className="attend341">{employee.endDate}</td>
                      <td className="attend341">{employee.endTime}</td>
                      <td className="attend341">{employee.totalWorkTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
          
        
      </div>
    </div>
  );
};

export default Attendance;