
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginMern.css';
import { BASE_URL } from '../Helper/Helper';

const LoginMern = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeid: '',
    password: '',
    
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoleSelection = async (role) => {
    try {
      if (!role) {
        toast.error('Please select a role (Admin or Employee)');
        return;
      }
  
      const response = await axios.post(`${ BASE_URL }/login/${role}`, {
        ...formData,
      });
  
      if (response.data.success) {
        if (role === 'admin') {
          toast.success('Admin login successfull!');
          // Additional logic for admin login
          navigate('/Dashboard'); // Redirect admin to AdminDashboard
        } else {
          toast.success('Employee login successfull!');
          // Additional logic for employee login
          navigate('/Dashboard2'); // Redirect employee to EmployeeDashboard
        }
        localStorage.setItem('loggedInEmployee', JSON.stringify(response.data.user));
      } else {
        if (role === 'admin' && response.data.error === 'Admin ID not found') {
          toast.error('Admin ID not found. Please check your Admin ID.');
        } else {
          toast.error(response.data.error);
        }
  
        setError(response.data.error);
      }
    } catch (err) {
      console.error('Error:', err.response.data);
  
      if (err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Check your EmployeeID or Password and role Selected are correct');
      }
    }
  };
  return (
    <div className="login-body">
      {/* <div className="login-container"> */}
        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <h1 className="login-title">LOGIN</h1>
          <div className="login-form-group">
            <label htmlFor="employeeid" className="login-label">
              Enter ID
            </label>
            <input
              type="text"
              id="employeeid"
              name="employeeid"
              value={formData.employeeid}
              onChange={handleChange}
              className="login-input"
              required
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="login-input"
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <div className="role-buttons">
            <button
              className="role-button"
              onClick={() => handleRoleSelection('admin')}
            >
              Admin
            </button>

            <button
              className="role-button"
              onClick={() => handleRoleSelection('employee')}
            >
              Employee
            </button>
          </div>

          {/* <p className="register-link">
            Don't have an account? <Link to="/RegistrationMern">Register</Link>
          </p>
          <p className="forgot-passoword-link">
            Forgot Password? <Link to="/ForgotPassword">Click Here</Link>
          </p> */}
        </form>
      
    </div>
  );
};

export default LoginMern;









// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import './LoginMern.css';

// const LoginMern = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     employeeid: '',
//     password: '',
//   });

//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleRoleSelection = async (role) => {
//     try {
//       if (!role) {
//         window.alert('Please select a role (Admin or Employee)');
//         return;
//       }

//       const response = await axios.post('http://localhost:5001/login', {
//         ...formData,
//         role,
//       });

//       if (response.data.success) {
//         window.alert('Login successful!');

//         // Store the user information in localStorage
//         localStorage.setItem('loggedInEmployee', JSON.stringify(response.data.user));

//         if (role === 'admin') {
//           navigate('/Dashboard'); // Redirect admin to AdminDashboard
//         } else {
//           navigate('/Dashboard2'); // Redirect employee to EmployeeDashboard
//         }
//       } else {
//         setError(response.data.error);
//       }
//     } catch (err) {
//       console.error('Error:', err.response.data);

//       if (err.response.data.message) {
//         window.alert(err.response.data.message);
//       } else {
//         window.alert('Check your EmployeeID or Password and role Selected are correct ');
//       }
//     }
//   };

//   return (
//     <div className="login-body">
//       <div className="login-container">
//         <form className="login-form" onSubmit={(e) => e.preventDefault()}>
//           <h1 className="login-title">LOGIN</h1>
//           <div className="login-form-group">
//             <label htmlFor="employeeid" className="login-label">
//               Employee ID
//             </label>
//             <input
//               type="text"
//               id="employeeid"
//               name="employeeid"
//               value={formData.employeeid}
//               onChange={handleChange}
//               className="login-input"
//               required
//             />
//           </div>

//           <div className="login-form-group">
//             <label htmlFor="password" className="login-label">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className="login-input"
//               required
//             />
//           </div>

//           {error && <p className="login-error">{error}</p>}

//           <div className="role-buttons">
//             <button
//               className="role-button"
//               onClick={() => handleRoleSelection('admin')}
//             >
//               Admin
//             </button>

//             <button
//               className="role-button"
//               onClick={() => handleRoleSelection('employee')}
//             >
//               Employee
//             </button>
//           </div>

//           <p className="register-link">
//             Don't have an account? <Link to="/RegistrationMern">Register</Link>
//           </p>
//           <p className="forgot-passoword-link">
//             Forgot Password? <Link to="/ForgotPassword">Click Here</Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginMern;
