import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ManageHoliday.css";
import Sidebar from "../Sidebar";
import SideBaradmin from "../SideBaradmin";
import { BASE_URL } from "../../Helper/Helper";

const ManageHoliday = () => {
  const [holidayList, setHolidayList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchHolidayData();
  }, []);

  const fetchHolidayData = () => {
    setLoading(true);
    setError(null);

    axios
      .get(`${BASE_URL}/holiday_data`)
      .then((response) => {
        const fetchedData = response.data;
        const dataWithSlno = fetchedData.map((holiday) => ({
          slno: holiday.slno,
          date: holiday.date,
          description: holiday.description,
          isSelected: false,
        }));

        setHolidayList(dataWithSlno);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleDateChange = (event, index) => {
    if (isEditMode) {
      const updatedList = [...holidayList];
      updatedList[index].date = event.target.value;
      setHolidayList(updatedList);
    }
  };

  const handleDescriptionChange = (event, index) => {
    if (isEditMode) {
      const updatedList = [...holidayList];
      updatedList[index].description = event.target.value;
      setHolidayList(updatedList);
    }
  };

  const handleCheckboxChange = (event, index) => {
    const updatedHolidayList = holidayList.map((holiday, i) => {
      if (i === index) {
        return { ...holiday, isSelected: event.target.checked };
      }
      return holiday;
    });
    setHolidayList(updatedHolidayList);
  };

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };

  const handleUpdateClick = () => {
    if (isEditMode) {
      const selectedForUpdate = holidayList.filter(
        (record) => record.isSelected
      );

      if (selectedForUpdate.length > 0) {
        axios
          .put(`${BASE_URL}/holiday_data`, selectedForUpdate)
          .then(() => {
            toast.success("Updated Successfully");
          })
          .catch((error) => {
            toast.error("Not Updated Successfully. Error: " + error.message);
          });
      } else {
        toast.error("Please select records to update");
      }
    }
  };

  const handleDeleteClick = () => {
    if (isEditMode) {
      const selectedForDelete = holidayList.filter(
        (record) => record.isSelected
      );

      if (selectedForDelete.length > 0) {
        axios
          .delete(`${BASE_URL}/holiday_data`, {
            data: {
              descriptions: selectedForDelete.map(
                (record) => record.description
              ),
            },
          })
          .then(() => {
            toast.success("Deleted Successfully");
            fetchHolidayData(); // Refresh the data after deletion
          })
          .catch((error) => {
            alert("Not Deleted Successfully. Error: " + error.message);
          });
      } else {
        alert("Please select records to delete");
      }
    }
  };

  // Sort holidays by date
  const sortedHolidayList = [...holidayList].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="mothercontainer-admin">
      <SideBaradmin />
      <div className="homeyogi">
        <div className="outsideborderyogi">
          {/* <div className="dailyyogi"> */}
          <h1 className="attendance3s">Holiday List</h1>
          {/* <h1 className="lineyogi"></h1> */}
          <div className="min-con43">
            <table className="holiday-tableyogi">
              <thead className="thead554">
                <tr>
                  <th>Serial No</th>
                  <th>Date</th>
                  <th>Holidays</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {sortedHolidayList.map((holiday, index) => (
                  <tr key={holiday.slno}>
                    <td className="td-borders">{index + 1}</td>
                    <td className="td-borders">
                      {isEditMode ? (
                        <input
                          className="input556"
                          type="date"
                          value={holiday.date}
                          onChange={(event) => handleDateChange(event, index)}
                        />
                      ) : (
                        holiday.date
                      )}
                    </td>
                    <td className="td-borders">
                      {isEditMode ? (
                        <input
                          className="input556"
                          type="text"
                          value={holiday.description}
                          onChange={(event) =>
                            handleDescriptionChange(event, index)
                          }
                        />
                      ) : (
                        holiday.description
                      )}
                    </td>
                    <td className="td-borders">
                      <input
                        type="checkbox"
                        checked={holiday.isSelected}
                        onChange={(event) => handleCheckboxChange(event, index)}
                        disabled={!isEditMode}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* </div> */}
          <div className="M1yogi">
            <div>
              <button className="manage-buttonyogi" onClick={handleEditClick}>
                {isEditMode ? "Cancel" : "Edit"}
              </button>
            </div>
            <div>
              <button className="manage-buttonyogi" onClick={handleUpdateClick}>
                Update
              </button>
            </div>
            <div>
              <button className="manage-buttonyogi" onClick={handleDeleteClick}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageHoliday;
