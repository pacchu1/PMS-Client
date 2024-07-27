// LeaveStatus.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leave2.css';
import SideBarEmp from '../Sidebaremp';


const LeaveStatus = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the employeeId from local storage
    const storedData = localStorage.getItem('loggedInEmployee');
    const { employeeid } = JSON.parse(storedData);

    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/employee_details/${employeeid}`);
        setEmployeeData(response.data);
      } catch (error) {
        // console.error('Error fetching employee data:', error);
      }
    };

    const fetchLeaveApplications = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/leave_applications/${employeeid}`);
        setLeaveApplications(response.data);
      } catch (error) {
        console.error('Error fetching leave applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
    fetchLeaveApplications();
  }, []);

  return (
    <div className='flexdiv12'>    
    <SideBarEmp/>
    <div className='custom-container'>
     
    <div className="container12">
      <h1 className='h1-heading'>Leave Status</h1>
      {loading ? (
        <p className="loading12">Loading...</p>
      ) : (
        <>
          {employeeData ? (
            <>
              <div className='box2009'>
                {/* <h2 className="leavestatush2">Employee Details</h2> */}
                <p className="leavestatus12"><p className='width12'>Employee ID</p>:&nbsp;&nbsp; {employeeData.empId}</p>
                <p className="leavestatus12"><p className='width12'>Name</p>:&nbsp;&nbsp; {employeeData.empName}</p>
                <p className="leavestatus12"><p className='width12'>Email</p>:&nbsp;&nbsp; {employeeData.email}</p>
                <p className="leavestatus12"><p className='width12'>Department</p>:&nbsp;&nbsp; {employeeData.empDepartment}</p>
              </div>
              <div>
                {/* <h2 className="leavestatush2">Leave Applications</h2> */}
                {leaveApplications.length === 0 ? (
                  <p className="leavestatus12">No leave applications found</p>
                ) : (
                  <div className='table078'>
                  <table className='table12'>
                    <thead className='thead442'>
                      <tr>
                        <th className='th12'>From Date</th>
                        <th className='th12'>To Date</th>
                        <th className='th12'>Leave Type</th>
                        <th className='th12'>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveApplications.map((application) => (
                        <tr className='tr12' key={application._id}>
                          <td className='td12'>{application.fromDate}</td>
                          <td className='td12'>{application.toDate}</td>
                          <td className='td12'>{application.leaveType}</td>
                          <td className='td12'>{application.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="leavestatus343">No leave's Applied</p>
          )}
        </>
      )}
    </div>
    </div>
    </div>

  );
};

export default LeaveStatus;
