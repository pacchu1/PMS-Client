
import React, { useState, useEffect } from "react";
import "./Calendar.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";



const Calendar = () => {
  const [loading, setLoading] = useState(true);
  const [loginData, setLoginData] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loggedInEmployeeOne, setLoggedInEmployeeOne] = useState(null);
  const [daysInMonth, setDaysInMonth] = useState(0);
  const [loggedInEmployee, setLoggedInEmployee] = useState(null);
  const [, /*enteredId*/ setEnteredId] = useState("");
  const [leaveData, setLeaveData] = useState([]);
  const [totalHolidaysData, setTotalHolidaysData] = useState([]);
  const [sundaysCount, setSundaysCount] = useState(0);
  const [currentMonth, setCurrentMonth] = useState("");
  const [loginDataCount, setLoginDataCount] = useState(loginData.length);
  const [leaveDataCount, setLeaveDataCount] = useState(leaveData.length);
  const [totalHolidaysDataCount, setTotalHolidaysDataCount] = useState(
    totalHolidaysData.length
  );

  const handleDatesSet = (arg) => {
    const firstDayOfMonth = arg.view.currentStart;
    const year = firstDayOfMonth.getFullYear();
    const month = firstDayOfMonth.getMonth();
  
    // Calculate the last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0);
  
    // Count the number of Sundays in the month
    let sundaysCount = 0;
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(year, month, i);
      if (date.getDay() === 0) {
        sundaysCount++;
      }
    }
  
    // Update the states
    setDaysInMonth(lastDayOfMonth.getDate());
    setSundaysCount(sundaysCount);
  
    // Filter login data for the current month
    const loginDataForMonth = loginData.filter((data) => {
      const endDate = new Date(data.endDate);
      return endDate.getFullYear() === year && endDate.getMonth() === month;
    });
  
    // Filter leave data for the current month
    const leaveDataForMonth = leaveData.filter((data) => {
      const fromDate = new Date(data.fromDate);
      return fromDate.getFullYear() === year && fromDate.getMonth() === month;
    });
  
    // Filter total holidays data for the current month
    const totalHolidaysDataForMonth = totalHolidaysData.filter((data) => {
      const date = new Date(data.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  
    // Update the counts based on the filtered data
    setLoginDataCount(loginDataForMonth.length);
    setLeaveDataCount(leaveDataForMonth.length);
    setTotalHolidaysDataCount(totalHolidaysDataForMonth.length);
  
    // Update current month in state
    setCurrentMonth(firstDayOfMonth.toLocaleString("default", { month: "long" }));
  
    // Here you can update other relevant data or perform additional actions
  };
  
  useEffect(() => {
    const generateCalendarEvents = () => {
      const events = loginData.map(({ endDate, totalWorkTime }) => {
        const dbEndDate = new Date(endDate);
        const localEndDate = new Date(
          dbEndDate.getFullYear(),
          dbEndDate.getMonth(),
          dbEndDate.getDate(),
          dbEndDate.getHours(),
          dbEndDate.getMinutes(),
          dbEndDate.getSeconds()
        );

        return {
          title: `Present: ${totalWorkTime}`,
          start: localEndDate,
          className:
            localEndDate <= new Date() ? "present-event" : "absent-event",
        };
      });

      // Transform leave data into calendar events
      const leaveEvents = leaveData.map(({ fromDate, toDate }) => {
        const start = new Date(fromDate);
        const end = new Date(toDate);

        // Add one day to include the end date
        end.setDate(end.getDate() );

        return {
          title: "Leave",
          start,
          end,
          className: "leave-event",
        };
      });

      // Transform holidays data into calendar events
      const holidayEvents = totalHolidaysData.map(({ date, description }) => ({
        title: description,
        start: new Date(date),
        className: "holiday-event",
      }));

      const currentDate = new Date();
      const previousDates = getDatesArray(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        currentDate
      );

      const absentEvents = previousDates
        .filter((date) => !hasRecordsForDate(date))
        .map((date) => ({
          title: "Absent",
          start: date,
          className: "absent-event",
        }));

      setCalendarEvents([
        ...events,
        ...absentEvents,
        ...leaveEvents,
        ...holidayEvents,
      ]);
    };

    const hasRecordsForDate = (date) => {
      return loginData.some((record) => {
        const recordDate = new Date(record.endDate);
        return (
          recordDate.getFullYear() === date.getFullYear() &&
          recordDate.getMonth() === date.getMonth() &&
          recordDate.getDate() === date.getDate()
        );
      });
    };

    generateCalendarEvents();
  }, [loginData, leaveData, totalHolidaysData]);

  const getDatesArray = (start, end) => {
    const dates = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const fetchCalendarData = async (year, month) => {
    try {
      const workHoursResponse = await fetch(
        `http://localhost:5000/workhours_data/${loggedInEmployeeOne?.employeeid}`
      );
      const leaveResponse = await fetch(
        `http://localhost:5000/leave_data/${loggedInEmployeeOne?.employeeid}`
      );
      const holidaysResponse = await fetch(
        `http://localhost:5000/holiday_data` // Fetch all holidays
      );
  
      if (
        !workHoursResponse.ok ||
        !leaveResponse.ok ||
        !holidaysResponse.ok
      ) {
        throw new Error("Network response was not ok.");
      }
  
      const workHoursData = await workHoursResponse.json();
      const leaveData = await leaveResponse.json();
      const totalHolidaysData = await holidaysResponse.json(); // Parse total holidays response
      setLoginData(workHoursData);
      setLeaveData(leaveData);
      setTotalHolidaysData(totalHolidaysData); // Set total holidays data
      setLoginDataCount(workHoursData.length); // Set login data count
      setLeaveDataCount(leaveData.length); // Set leave data count
      setTotalHolidaysDataCount(totalHolidaysData.length); // Set total holidays data count
      setLoading(false);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (loggedInEmployeeOne && loggedInEmployeeOne.employeeid) {
      fetchCalendarData();
    }
  }, [loggedInEmployeeOne]);
  

  useEffect(() => {
    // Update the loginDataCount whenever loginData changes
    setLoginDataCount(loginData.length);
  }, [loginData]);

  useEffect(() => {
    // Update the leaveDataCount whenever leaveData changes
    setLeaveDataCount(leaveData.length);
  }, [leaveData]);

  useEffect(() => {
    // Update the totalHolidaysDataCount whenever totalHolidaysData changes
    setTotalHolidaysDataCount(totalHolidaysData.length);
  }, [totalHolidaysData]);




useEffect(() => {
    const fetchLoggedInEmployee = async () => {
        try {
            const response = await fetch("http://localhost:5000/LoggedInEmployee");
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            const data = await response.json();
            setLoggedInEmployee("data", data); // This line might have an issue, should be setLoggedInEmployee(data)
            setEnteredId(data?.employeeid || "");
        } catch (error) {
            console.error("Error fetching logged-in employee:", error);
        }
    };

    fetchLoggedInEmployee();
}, []);



  // useEffect(() => {
  //   setEnteredId(loggedInEmployee?.employeeid || "");
  // }, [loggedInEmployee]);

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
  }, []);

  return (
    <>
    <div className="container001">
      <main className="main-content">
        <div className="bottom-container">
          <div className="bottom-container__left">
            <div className="detail-flex">
              <div className="cbox spending-box">
                <div className="centered-content">
                  <h3 className="section-header">Employee Name</h3>
                  <h4 className="section-input">
                    {loggedInEmployeeOne?.fullname}
                  </h4>
                  <hr />
                  <h3 className="section-header">Designation</h3>
                  <h4 className="section-input">{loggedInEmployeeOne?.desigination}</h4>
                </div>
              </div>
              <div className="detail-box">
                <h2 className="section-head34">Current session</h2>
                <h3>{currentMonth}</h3>
                <table className="table-line56 ">
                  <tbody>
                    <tr>
                      <td className="tdclass">
                        <b>{daysInMonth}</b>
                      </td>

                      <td className="tdclass">
                        <b> {loginDataCount}</b>
                      </td>
                      <td className="tdclass">
                        <b>{leaveDataCount}</b>
                      </td>
                      <td className="tdclass">
                        <b>{totalHolidaysDataCount}</b>
                      </td>
                      <td className="tdclass">
                        <b>{sundaysCount}</b>
                      </td>
                    </tr>
                    <tr>
                      <td className="tdclass">Total No. Of Days</td>
                      <td className="tdclass">Total No. of Worked</td>
                      <td className="tdclass">Total No. of Leaves</td>
                      <td className="tdclass">Total No. of Holidays</td>
                      <td className="tdclass">Total No. of Sundays</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="overflow243">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <FullCalendar
                    plugins={[
                      dayGridPlugin,
                      timeGridPlugin,
                      interactionPlugin,
                      bootstrapPlugin,
                    ]}
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    events={calendarEvents}
                    datesSet={handleDatesSet}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
};

export default Calendar;
