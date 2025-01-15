/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import { Calendar } from "@fullcalendar/core";
import multiMonthPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";
import useCommonContext from "../../store/CommonContext";

const TravelCalendar = ({ date, setDate, handleDateSet }) => {
  const calendarRef = useRef(null);
  const { calendarFare } = useCommonContext();
  // const validRange = {
  //   start: new Date().toISOString().substr(0, 10), // Set start date to today
  // };
  const handleDateClick = (info) => {
    handleDateSet(info);
  };
  useEffect(() => {
    // Check if the calendarRef is available before initializing
    if (calendarRef.current) {
      const calendar = new Calendar(calendarRef.current, {
        plugins: [multiMonthPlugin, interactionPlugin],
        initialView: "multiMonthYear",
        views: {
          multiMonthYear: {
            type: "multiMonth",
            duration: { months: 2 },
          },
        },
        dayMaxEventRows: 3,
        events: calendarFare,
        initialDate: date,
        dateClick: (info) => handleDateClick(info),
        dayCellDidMount: function (arg) {
          if (arg.isPast) {
            arg.el.classList.add("disabled-date");
          }
        },
      });

      calendar.render();
    }
  }, []);

  return <div ref={calendarRef}></div>;
};

export default TravelCalendar;
