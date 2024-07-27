import React, { useState, useEffect } from "react";
import "./Reports.css";
import SideBaradmin from "../../SideBaradmin";

export const Reports = () => {
  const [showTable, setShowTable] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Department");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const fetchData = () => {
    let url = "http://localhost:5000/attendance_datareport";

    if (selectedDepartment !== "All Department") {
      url += `?department=${selectedDepartment}`;
    }

    if (selectedYear) {
      url += `${
        selectedDepartment === "All Department" ? "?" : "&"
      }year=${selectedYear}`;
    }

    if (selectedMonth) {
      url += `${
        selectedDepartment === "All Department" && !selectedYear ? "?" : "&"
      }month=${selectedMonth}`;
    }
    console.log("Frontend request URL:", url);
    fetch(url)
      .then((res) => res.json())
      .then(
        (data) => {
          if (Array.isArray(data)) {
            setUsers(data);
            setShowTable(true);
          } else {
            console.error("Data received from backend is not an array:", data);
          }
        },
        (error) => {
          console.error("Error fetching user data:", error);
        }
      );
  };

  useEffect(() => {
    fetchData();
  }, [selectedDepartment, selectedYear, selectedMonth]);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2010 + 1 },
    (_, index) => 2010 + index
  );
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleButtonClick = () => {
    fetchData();
  };

  return (
    <div className="mothercontainer-admin">
      <SideBaradmin />
      <div className="mastercontainer123">
        <div className="outsideborder4s">
          <h1 className="attendance4s">Attendance Report</h1>
          <div className="header4s">
            <div className="reportfields4s">
              <h1 className="employee4s">Employees By Department</h1>
              <select
                className="selectbox4s"
                value={selectedDepartment}
                onChange={handleDepartmentChange}
              >
                <option value="All Department">All Department</option>
                <option value="FULLSTACK DEVELOPER">
                  Full Stack Development
                </option>
                <option value="Mobile App Development">
                  Mobile App Development
                </option>
                <option value="Data Science">Data Science</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Digital Marketing">Digital Marketing</option>
              </select>
            </div>
            <div className="reportfields4s">
              <h1 className="employee4s">Year</h1>
              <select
                className="selectbox4s"
                value={selectedYear}
                onChange={handleYearChange}
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="reportfields4s">
              <h1 className="employee4s">Month</h1>
              <select
                className="selectbox4s"
                value={selectedMonth}
                onChange={handleMonthChange}
              >
                <option value="">Select Month</option>
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <button className="report-button4s" onClick={handleButtonClick}>
              Show Report
            </button>
          </div>
          {showTable && (
          
          <div className="outsideborder2312s">
            <table className="report-employee-table4s">
              <thead className="thead21">
                <tr>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Total Work Time</th>
                </tr>
              </thead>
              
                  {users
                    .sort(
                      (a, b) => new Date(b.startDate) - new Date(a.startDate)
                    ) // Sort by date
                    .map((user, index) => (
                      <tr key={index}>
                        <td className="attend34122">{user.employeeId}</td>
                        <td className="attend34122 textleft">{user.fullname}</td>
                        <td className="attend34122 textleft">{user.department}</td>
                        <td className="attend34122">
                          {new Date(user.startDate).toLocaleDateString()}
                        </td>
                        <td className="attend34122">{user.totalWorkTime}</td>
                      </tr>
                    ))}
                
              </table>
            </div>
         
        
      )}
        </div>
        
      </div>
    </div>
  );
};

export default Reports;
