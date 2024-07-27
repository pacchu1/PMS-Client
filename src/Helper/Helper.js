// // Assuming you have axios installed (you can install it using npm install axios)
// import axios from 'axios';

// // Utility function to fetch employee details by ID
// export const fetchEmployeeById = async (employeeId) => {
//   try {
//     const response = await axios.get(`http://localhost:5000/employee/${employeeId}`);
//     return response.data.employeeDetails;
//   } catch (error) {
//     console.error('Error fetching employee details:', error);
//     throw error;
//   }
// };




export const BASE_URL=`http://localhost:5000`;




// import React, { useState } from 'react';

// const YourComponent = ({ employeeDataVisible, detailedViewData, handleLeaveApproval }) => {
//   const [disabledButtons, setDisabledButtons] = useState({});

//   const toggleButtons = (index) => {
//     setDisabledButtons((prevDisabledButtons) => ({
//       ...prevDisabledButtons,
//       [index]: !prevDisabledButtons[index],
//     }));
//   };

//   return (
//     {employeeDataVisible && (
//       <div className="indexbox12">
//         {detailedViewData.map((employee, index) => (
//           <div key={index} className={`open-details ${employee.status === 'approved' ? 'approved' : employee.status === 'rejected' ? 'rejected' : ''}`}>
//             <p className="employee123">
//               <span className="idselect89" onClick={() => openDetailViewModal(employee.empId)}>{employee.empId}</span>
//               &nbsp;&nbsp;&nbsp;
//               <p className="parawidth56">{employee.empName}</p>
//             </p>
//             <div className="btnflex">
//               <button
//                 className={`approve-btn ${disabledButtons[index] ? 'disabled' : ''}`}
//                 onClick={() => {
//                   handleLeaveApproval(employee._id, "approved");
//                   toggleButtons(index);
//                 }}
//                 disabled={disabledButtons[index] || employee.status === 'approved' || employee.status === 'rejected'}
//               >
//                 Approve
//               </button>
//               <button
//                 className={`reject-btn ${disabledButtons[index] ? 'disabled' : ''}`}
//                 onClick={() => {
//                   handleLeaveApproval(employee._id, "rejected");
//                   toggleButtons(index);
//                 }}
//                 disabled={disabledButtons[index] || employee.status === 'approved' || employee.status === 'rejected'}
//               >
//                 Reject
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     )}
//   );
// };

// export default YourComponent;



