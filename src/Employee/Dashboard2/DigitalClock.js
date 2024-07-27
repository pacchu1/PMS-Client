import React, { useState, useEffect } from "react";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import "./DigitalClock.css";
import axios from "axios";
import Sideba1 from "../Sideba1";
import Calender from "../Calender";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebaremp from "../../Employee/Sidebaremp";

const formatDateWithZeroPadding = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${month}/${day}/${year}`;
};

const DigitalClock = () => {
  // const [currentTime, setCurrentTime] = useState(new Date());
  const [, /*enteredId*/ setEnteredId] = useState("");
  const [loggedInEmployee, setLoggedInEmployee] = useState(null);
  const [loggedInEmployeeOne, setLoggedInEmployeeOne] = useState(null);
  const [workdays, setWorkdays] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [breakInTime, setBreakInTime] = useState(null);
  const [breakOutTime, setBreakOutTime] = useState(null);
  const [totalWorkTime, setTotalWorkTime] = useState(0);
  const [isWorkdayStarted, setIsWorkdayStarted] = useState(false);
  const [toggle, setToggle] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const showSuccessToast = (message) => {
    if (toast) {
      toast.success(message);
    } else {
      console.error(
        "Error displaying success toast: 'toast' object is undefined."
      );
    }
  };

  const showErrorToast = (message) => {
    if (toast) {
      toast.error(message);
    } else {
      console.error(
        "Error displaying error toast: 'toast' object is undefined."
      );
    }
  };

  useEffect(() => {
    const fetchLoggedInEmployee = async () => {
      try {
        const response = await fetch("http://localhost:5000/LoggedInEmployee");
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const data = await response.json();
        setLoggedInEmployee(data);
        setEnteredId(data?.employeeId || "");
      } catch (error) {
        console.error("Error fetching logged-in employee:", error);
      }
    };

    fetchLoggedInEmployee();
  }, []);

  useEffect(() => {
    setEnteredId(loggedInEmployee?.employeeId || "");
  }, [loggedInEmployee]);

  useEffect(() => {
    const storedEmployee = localStorage.getItem("loggedInEmployee");

    if (storedEmployee) {
      try {
        const parsedEmployee = JSON.parse(storedEmployee);
        setLoggedInEmployeeOne(parsedEmployee);
      } catch (error) {
        console.error("Error parsing loggedInEmployee:", error);
      }
    } else {
      console.log("No loggedInEmployee found in local storage");
    }

    const storedStartDayData = localStorage.getItem("startDayData");
    if (storedStartDayData) {
      try {
        const parsedStartDayData = JSON.parse(storedStartDayData);
        setStartTime(parsedStartDayData.startTime);
        setIsWorkdayStarted(parsedStartDayData.isWorkdayStarted);
      } catch (error) {
        console.error("Error parsing start day data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (startTime) {
      const startDayData = {
        startTime,
        isWorkdayStarted,
      };
      localStorage.setItem("startDayData", JSON.stringify(startDayData));
    }
  }, [startTime, isWorkdayStarted]);

  useEffect(() => {
    // updateCalendar();
  }, [workdays]);

  const handleStartDay = async () => {
    try {
      console.log(
        "Logged-in employee data in handleStartDay:",
        loggedInEmployeeOne
      );
      const response = await axios.post(
        "http://localhost:5000/checkWorkHours",
        {
          employeeId: loggedInEmployeeOne?.employeeid || "",
          date: formatDateWithZeroPadding(new Date()),
        }
      );

      if (response.data.workHoursExist) {
        showErrorToast("You already logged out. See you tomorrow!");
      } else {
        const currentDate = new Date();
        const formattedStartTime = currentDate.toLocaleTimeString();
        setStartTime({ time: formattedStartTime, date: currentDate });
        setIsWorkdayStarted(true);

        console.log("Starting the day. Data saved to localStorage:", {
          startTime: formattedStartTime,
          isWorkdayStarted: true,
        });

        showSuccessToast("Day started successfully!");
      }
    } catch (error) {
      console.error("Error checking work hours:", error);
      showErrorToast("Error starting the day. Please try again.");
    }
  };
  const handleEndDay = async () => {
    if (startTime) {
      try {
        console.log(
          "Logged-in employee data in handleEndDay:",
          loggedInEmployeeOne
        );

        // Get the current time
        const currentDate = new Date();
        const formattedEndTime = currentDate.toLocaleTimeString();
        setEndTime({ time: formattedEndTime, date: currentDate });

        // Format end date with zero-padding for month and day
        const formattedEndDate = formatDateWithZeroPadding(currentDate);

        // Calculate total work days
        let updatedTotalWorkDays = 0; // Initialize with 0
        const totalWorkDaysResponse = await axios.get(
          ` http://localhost:5000/total_work_days/${loggedInEmployeeOne?.employeeid}`
        );

        if (
          totalWorkDaysResponse &&
          totalWorkDaysResponse.data &&
          !isNaN(totalWorkDaysResponse.data.totalWorkDays)
        ) {
          updatedTotalWorkDays = totalWorkDaysResponse.data.totalWorkDays + 1;
        }

        // Ensure that updatedTotalWorkDays is a valid number
        if (isNaN(updatedTotalWorkDays) || updatedTotalWorkDays < 1) {
          throw new Error("Invalid total work days value");
        }

        // Calculate total duration between startTime and endTime
        const totalDuration = currentDate.getTime() - startTime.date.getTime();

        // Calculate duration of breaks
        let breakDuration = 0;
        if (breakInTime && breakOutTime) {
          breakDuration =
            breakOutTime.date.getTime() - breakInTime.date.getTime();
        }

        // Subtract break duration from total duration to get effective work duration
        const effectiveWorkDuration = totalDuration - breakDuration;

        // Convert effective work duration to format (hours:minutes:seconds)
        const formattedTotalWorkTime = formatMilliseconds(
          effectiveWorkDuration
        );

        const dataToSend = {
          employeeId: loggedInEmployeeOne?.employeeid || "",
          startTime: startTime.time,
          startDate: startTime.date.toLocaleDateString(),
          endTime: formattedEndTime,
          endDate: formattedEndDate, // Update endDate format
          breakInTime: breakInTime ? breakInTime.time : null,
          breakOutTime: breakOutTime ? breakOutTime.time : null,
          workHours: formatMilliseconds(totalDuration), // Include total work hours (including breaks) in the document
          totalWorkTime: formattedTotalWorkTime, // Include effective total work time (excluding breaks) in the document
          totalWorkDays: updatedTotalWorkDays, // Include totalWorkDays in the document
        };

        const response = await axios.post(
          "http://localhost:5000/saveUnifiedData",
          dataToSend
        );

        console.log("Server response:", response.data);

        // Update the state with the new totalWorkDays value
        setWorkdays((prevWorkdays) => [...prevWorkdays, dataToSend]);

        // Clear relevant state variables
        setStartTime(null);
        setEndTime(null);
        setBreakInTime(null);
        setBreakOutTime(null);
        setTotalWorkTime(0);
        setIsWorkdayStarted(false);

        // Clear start day data from local storage
        localStorage.removeItem("startDayData");
        console.log("Local storage data cleared.");
        showSuccessToast("Day ended successfully!");
      } catch (error) {
        console.error("Error handling end day:", error);
        showErrorToast("Error ending the day. Please try again.");
      }
    } else {
      showErrorToast("Please start the day first.");
    }
  };

  const handleBreakIn = () => {
    if (startTime && startTime.date instanceof Date) {
      const currentDate = new Date();
      const formattedBreakInTime = currentDate.toLocaleTimeString();
      setBreakInTime({ time: formattedBreakInTime, date: currentDate });

      // Subtract break-in time from total work hours
      const breakInMilliseconds =
        currentDate.getTime() - startTime.date.getTime();
      setTotalWorkTime(totalWorkTime + breakInMilliseconds);
      // Log when taking a break
      console.log("Taking a break. Break in time saved to localStorage:", {
        breakInTime: formattedBreakInTime,
      });
      showSuccessToast("Break in recorded successfully!");
    } else {
      showErrorToast(
        "Break in time already recorded or the day has not started."
      );
      showErrorToast("Error recording break in. Please try again.");
    }
  };

  const handleBreakOut = () => {
    if (startTime && breakInTime && !breakOutTime) {
      const currentDate = new Date();
      const formattedBreakOutTime = currentDate.toLocaleTimeString();
      setBreakOutTime({ time: formattedBreakOutTime, date: currentDate });
      // Log when ending a break
      console.log("Ending the break. Break out time saved to localStorage:", {
        breakOutTime: formattedBreakOutTime,
      });
      showSuccessToast("Break out recorded successfully!");
    } else {
      showErrorToast(
        "Break out time already recorded or break in time is missing."
      );
      showErrorToast("Error recording break out. Please try again.");
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  const formatMilliseconds = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.round((milliseconds % (1000 * 60)) / 1000);
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="mothercontainer-admin">
      <Sidebaremp />
      <div className="masterc-container123">
        <div className="width564">
          <div className="digital-clock-container">
            <Clock
              value={currentTime}
              renderNumbers={true}
              hourMarksLength={20}
              minuteMarksLength={10}
            />

            <div className="flex23">
              <div>
                {loggedInEmployeeOne && (
                  <p className="p_enteredid">
                    {" "}
                    LOGIN ID: {loggedInEmployeeOne.employeeid}
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className="btn-flex12">
                <button className="startday-btn" onClick={handleStartDay}>
                  Start Day
                </button>
                <button className="endday-btn" onClick={handleEndDay}>
                  End Day
                </button>
                <button className="breakin-btn" onClick={handleBreakIn}>
                  Break In
                </button>
                <button className="breakout-btn" onClick={handleBreakOut}>
                  Break Out
                </button>
              </div>
              {isWorkdayStarted &&
                startTime &&
                startTime.date instanceof Date && (
                  <div className="timediv">
                    <div className="div321">
                      {" "}
                      <p className="para333">Start Time</p>: &nbsp;&nbsp;
                      {startTime.time}
                    </div>
                    <div className="div321">
                      <p className="para333">Start Date</p>: &nbsp;&nbsp;
                      {startTime.date.toLocaleDateString()}
                    </div>
                  </div>
                )}

              {endTime && (
                <div className="timediv">
                  <div className="div321">
                    <p className="para333">End Time </p>: {endTime.time}{" "}
                  </div>
                  <div className="div321">
                    {" "}
                    <p className="para333">End Date </p>:{" "}
                    {endTime.date.toLocaleDateString()}
                  </div>
                </div>
              )}

              {breakInTime && (
                <div className="timediv">
                  <div className="div321">
                    {" "}
                    <p className="para333">Break In Time&nbsp;&nbsp;</p>
                    :&nbsp;&nbsp; {breakInTime.time}
                  </div>
                  <div className="div321">
                    {" "}
                    <p className="para333">Break In Date&nbsp;&nbsp;</p>:
                    &nbsp;&nbsp;{breakInTime.date.toLocaleDateString()}
                  </div>
                </div>
              )}

              {breakOutTime && (
                <div className="timediv">
                  <div className="div321">
                    <p className="para333">Break Out Time</p>:&nbsp;&nbsp;{" "}
                    {breakOutTime.time}
                  </div>
                  <div className="div321">
                    <p className="para333">Break Out Date</p>:&nbsp;&nbsp;{" "}
                    {breakOutTime.date.toLocaleDateString()}
                  </div>
                </div>
              )}

              {isWorkdayStarted && (
                <div className="total-hrs23">
                  <p className="total-hours">
                    Total Hours Worked &nbsp;&nbsp;:&nbsp;&nbsp;{" "}
                    {formatMilliseconds(totalWorkTime)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="width56490">
          <Calender
            workdays={workdays}
            isToday={isToday}
            isWorkdayStarted={isWorkdayStarted}
          />
        </div>
        {/* <ToastContainer autoClose={3000} /> */}
      </div>
    </div>
  );
};

export default DigitalClock;
