import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Sideba1 from "../Sideba1";
import './Holiday2.css'
import SideBarEmp from '../Sidebaremp';
import { BASE_URL } from "../../Helper/Helper";

const ManageHolidayTable = ({ holidayData, handleDelete }) => {

  const sortedHolidayData = holidayData.sort((a, b) => new Date(a.date) - new Date(b.date));

  const tableStyle = {
    width: '60%',
    borderCollapse: 'collapse',
    marginTop: '12px',
  };

  const thStyle = {
    backgroundColor: '#000080',
    fontWeight: 'bold',
    padding: '10px',
    textAlign: 'center',
    border: '1px solid #ccc',
    color: 'white',
  };

  const tdStyle = {
    padding: '10px',
    textAlign: 'center',
    border: '1px solid #ccc',
  };

  const evenRowStyle = {
    backgroundColor: '#f9f9f9',
  };

  return (
    <div className='home45'>
      <div className='holidaylist24'>
        <p className='empholiday'>Holiday Checklist</p>
      </div>
      <div className='outsideborder12'>
        <div className='table-container453'>
          <table className='table1145'>
            <thead className='thead332'>
              <tr>
                <th className='thbody6'>Date</th>
                <th className='thbody6'>Holiday</th>
              </tr>
            </thead>
            <tbody className='tbody609'>
              {sortedHolidayData.map((holiday, index) => (
                <tr key={index}>
                  <td className="td12">{holiday.date}</td>
                  <td className="td12">{holiday.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <marquee behavior="scroll" direction="left" scrollamount="5" className="marquee">
          Holiday Notice: "Upcoming holidays reminder: Plan your schedule ahead for the upcoming festive season."
        </marquee>
      </div>
    </div>
  );
};

const AddHoliday = ({ handleAddHoliday, handleCloseAddHoliday }) => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const initialValues = {
    date: '',
    description: '',
  };

  const validationSchema = Yup.object().shape({
    date: Yup.string().required('Date is required'),
    description: Yup.string().required('Description is required'),
  });

  const thStyle = {
    backgroundColor: '#000080',
    fontWeight: 'bold',
    padding: '10px',
    textAlign: 'center',
    border: '1px solid #ccc',
    color: 'white',
  };

  const inputStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      console.log('values ', values);
      await axios.post('http://localhost:4000/holiday_data/add', values);
      alert('Form submitted successfully');
  
      // Fetch updated holiday data
      const response = await axios.get('http://localhost:4000/holiday_data');
      const responseData = response.data;
  
      // Get the newly added holiday from the response
      const newHoliday = responseData.find((holiday) => holiday.date === values.date);
  
      // Update holiday data in parent component
      handleAddHoliday(newHoliday.date, newHoliday.description);
  
      resetForm();
      setDate('');
      setDescription('');
  
      handleCloseAddHoliday();
    } catch (error) {
      console.error(error);
      alert('Error submitting form');
    } finally {
      setSubmitting(false);
    }
  };

  const [showPopup, setShowPopup] = useState(true); // State to manage popup visibility
  
  const handleClosePopup = () => {
    setShowPopup(false); // Set showPopup state to false to close the popup
  };

  return (
    <div>
      {showPopup && (
        <div className='holi'>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            <Form>
              <p className='content123'>Add Holiday</p>
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td style={thStyle}>Date:</td>
                    <td className="td12">
                      <Field type="date" name="date" style={inputStyle} required />
                    </td>
                  </tr>
                  <tr>
                    <td style={thStyle}>Description:</td>
                    <td className="td12">
                      <Field as="textarea" name="description" style={{ ...inputStyle, height: '100px' }} required />
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '10px', // Adjust spacing between buttons if needed
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                  onClick={handleClosePopup}
                >
                  Cancel
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      )}
    </div>
  );
};

const Holiday = () => {
  const [showAddHoliday, setShowAddHoliday] = useState(false);
  const [holidayData, setHolidayData] = useState([]);

  const handleAddHoliday = (date, description) => {
    const newHoliday = {
      date: date,
      holiday: description,
    };
    setHolidayData([...holidayData, newHoliday]);
  };

  const handleDelete = (date) => {
    setHolidayData(holidayData.filter((holiday) => holiday.date !== date));
  };

  const handleCloseAddHoliday = () => {
    setShowAddHoliday(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${ BASE_URL }/holiday_data`);
        const responseData = response.data;
        console.log('responseDataRR',responseData);
        setHolidayData(responseData);
      } catch (error) {
        console.error(error);
        // Handle error case
      }
    };

    fetchData();
  }, []);

  return (
    <div className='mothercontainer-admin'>
      <SideBarEmp/>
      <div className='holidayborder'>
        <div className='home'>
          <div className='outsideborder12'>
            {/* <h1>
              <u>Holiday Management</u>
            </h1> */}
            {/* <button onClick={() => setShowAddHoliday(true)}>Add Holiday</button> */}
          </div>
        </div>
        {showAddHoliday && <AddHoliday handleAddHoliday={handleAddHoliday} handleCloseAddHoliday={handleCloseAddHoliday} />}
        <ManageHolidayTable holidayData={holidayData} handleDelete={handleDelete} />
      </div>
    </div>
  );
};

export default Holiday;
