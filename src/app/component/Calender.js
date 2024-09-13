"use client";
import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  getDate,
  addMinutes,
} from "date-fns";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentDay, setCurrentDay] = useState(getDate(new Date()));
  const [currentTimeRange, setCurrentTimeRange] = useState("");
  const [currentTimeRanges, setCurrentTimeRanges] = useState([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [visibleStartDate, setVisibleStartDate] = useState(1);
  const [visibleEndDate, setVisibleEndDate] = useState();
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const updateTimeRange = () => {
      const now = new Date();
      const roundedMinutes = Math.floor(now.getMinutes() / 15) * 15;
      const startTime = new Date(now.setMinutes(roundedMinutes, 0, 0));
      const endTime = addMinutes(startTime, 45); // 45 minutes later

      setCurrentTimeRange(
        `${format(startTime, "HH:mm")} - ${format(endTime, "HH:mm")}`
      );
    };

    updateTimeRange();
    const timer = setInterval(updateTimeRange, 60000);
    return () => clearInterval(timer);
  }, []);

  const prevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    setCurrentDay(1);
  };

  const nextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    setCurrentDay(1);
  };

  const nextDates = () => {
    const lastDateOfMonth = getDate(endOfMonth(currentDate));

    if (visibleEndDate >= lastDateOfMonth) {
      const newDate = addMonths(currentDate, 1);
      const newStartDate = 1;
      const newEndDate = Math.min(maxDatesToShow, getDate(endOfMonth(newDate)));
      setCurrentDate(newDate);
      setVisibleStartDate(newStartDate);
      setVisibleEndDate(newEndDate);
    } else {
      const newStartDate = visibleStartDate + maxDatesToShow;
      const newEndDate = Math.min(
        newStartDate + maxDatesToShow - 1,
        lastDateOfMonth
      );
      setVisibleStartDate(newStartDate);
      setVisibleEndDate(newEndDate);
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const prevDates = () => {
    const firstDateOfMonth = getDate(startOfMonth(currentDate));
    const today = new Date().getDate();
    const isCurrentMonth =
      currentDate.getMonth() === new Date().getMonth() &&
      currentDate.getFullYear() === new Date().getFullYear();
    if (
      isCurrentMonth &&
      visibleStartDate <= today &&
      visibleEndDate >= today
    ) {
      return;
    }
    if (visibleStartDate > firstDateOfMonth) {
      const newStartDate = Math.max(
        visibleStartDate - maxDatesToShow,
        firstDateOfMonth
      );
      const newEndDate = Math.min(
        newStartDate + maxDatesToShow - 1,
        getDate(endOfMonth(currentDate))
      );

      console.log("New Start Date:", newStartDate);
      console.log("New End Date:", newEndDate);

      setVisibleStartDate(newStartDate);
      setVisibleEndDate(newEndDate);
    } else {
      const newDate = subMonths(currentDate, 1);
      const newStartDate = 1;
      const newEndDate = Math.min(maxDatesToShow, getDate(endOfMonth(newDate)));
      setCurrentDate(newDate);
      setVisibleStartDate(newStartDate);
      setVisibleEndDate(newEndDate);
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const maxDatesToShow =
    screenWidth <= 320
      ? 3
      : screenWidth <= 428
      ? 5
      : screenWidth <= 768
      ? 5
      : screenWidth <= 1024
      ? 8
      : 10;

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const updateTimeRanges = () => {
      const now = new Date();
      const roundedMinutes = Math.floor(now.getMinutes() / 15) * 15;
      const baseTime = new Date(now.setMinutes(roundedMinutes, 0, 0));
      const ranges = Array.from({ length: 12 }, (_, index) => {
        const startTime = addMinutes(baseTime, index * 15);
        const endTime = addMinutes(startTime, 15);
        return {
          start: format(startTime, "HH:mm"),
          end: format(endTime, "HH:mm"),
        };
      });

      setCurrentTimeRanges(ranges);
    };

    updateTimeRanges();
    const timer = setInterval(updateTimeRanges, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const today = new Date();
    const currentDayInMonth =
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
        ? getDate(today)
        : 1;
    const lastDateOfMonth = getDate(endOfMonth(currentDate));
    const newStartDate = currentDayInMonth;
    const newEndDate = Math.min(
      newStartDate + maxDatesToShow - 1,
      lastDateOfMonth
    );

    setVisibleStartDate(newStartDate);
    setVisibleEndDate(newEndDate);
  }, [currentDate, maxDatesToShow]);

  const daysToShow = daysInMonth.slice(visibleStartDate - 1, visibleEndDate);
  const handleDateClick = (day) => {
    console.log("Selected date:", day);
    setSelectedDate(day);
  };
  return (
    <>
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-8">
            <p className="text-muted">Please choose time & date for booking</p>
            <div className="calender">
              <div className="heading mb-4">
                <button className="btn-previous" onClick={prevMonth}>
                  &lt;
                </button>
                <h3>{format(currentDate, "MMMM yyyy")}</h3>
                <button className="next-btn" onClick={nextMonth}>
                  &gt;
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <button className="btn-prev" onClick={prevDates}>
                  &lt;
                </button>

                <div className="date-display">
                  <div className="date-grid">
                    {daysToShow.map((day, index) => (
                      <div
                        key={index}
                        className={`calendar-day ${
                          isToday(day) ? "highlight-today" : ""
                        } ${
                          day.toDateString() === selectedDate?.toDateString()
                            ? "highlight-today"
                            : ""
                        }`}
                        style={{
                          padding: "10px",
                          textAlign: "center",
                          backgroundColor:
                            isToday(day) ||
                            day.toDateString() === selectedDate?.toDateString()
                              ? "#FF0000"
                              : "#FFF",
                          color:
                            isToday(day) ||
                            day.toDateString() === selectedDate?.toDateString()
                              ? "#FFF"
                              : "#000",
                          fontWeight:
                            isToday(day) ||
                            day.toDateString() === selectedDate?.toDateString()
                              ? "500"
                              : "normal",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={() => handleDateClick(day)}
                      >
                        <div>{format(day, "d")}</div>
                        <div>{weekDays[day.getDay()]}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="btn-next" onClick={nextDates}>
                  &gt;
                </button>
              </div>

              <div className="time-container">
                <div className="timer">
                  {currentTimeRanges.map((range, index) => (
                    <div key={index} className="time-set">
                      <p className="m-0">{`${range.start} - ${range.end}`}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
