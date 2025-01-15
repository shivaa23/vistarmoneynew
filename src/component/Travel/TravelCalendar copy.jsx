import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react"; // => request placed at the top
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import TravelCalendarToolbar from "./TravelCalendarToolbar";
import StyledCalendar from "./styles";
import { events } from "./flight_rate_data";
import { isPastDate } from "../../utils/DateUtils";
import { Calendar } from "@fullcalendar/core";

const TravelCalendar = ({ date, setDate, handleDateSet }) => {
  const calendarRef = useRef(null);
  const [view, setView] = useState("dayGridMonth");
  // const validRange = {
  //   start: new Date().toISOString().substr(0, 10), // Set start date to today
  // };
  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleChangeView = (newView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      // calendarApi.changeView("timeGrid", { duration: { months: 2 } });

      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const dayCellContent = (arg) => {
    const isPast = isPastDate(arg.date);
    return (
      <div
        className={`fc-daygrid-day${isPast ? " fc-past disabled-date" : ""}`}
      >
        {arg.dayNumberText}
      </div>
    );
  };

  useEffect(() => {
    // Check if the calendarRef is available before initializing
    if (calendarRef.current) {
      const calendar = new Calendar(calendarRef.current, {
        plugins: [
          listPlugin,
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          multiMonthPlugin,
        ],
        initialView: "multiMonthYear",
        views: {
          multiMonthYear: {
            type: "multiMonth",
            duration: { months: 2 },
          },
        },
        // dayCellContent: dayCellContent,
        weekends: true, // Set to true or false based on your requirements
        allDayMaintainDuration: true, // Set to true or false based on your requirements
        eventResizableFromStart: true, // Set to true or false based on your requirements
        events: events,
        ref: calendarRef,
        initialDate: date,
        dayMaxEventRows: 3,
        eventDisplay: "block",
        headerToolbar: false,
        dateClick: (info) => {
          alert("tp");
          handleDateSet(info);
        },
        //   select={handleSelectRange}
        //   eventDrop={handleDropEvent}
        //   eventClick={handleSelectEvent}
        //   eventResize={handleResizeEvent}
      });

      calendar.render();
    }
  }, []);

  return (
    <StyledCalendar>
      <TravelCalendarToolbar
        date={date}
        view={view}
        onNextDate={handleClickDateNext}
        onPrevDate={handleClickDatePrev}
        onToday={handleClickToday}
        onChangeView={handleChangeView}
      />
      {/* {calendar} */}
      <div ref={calendarRef}>
        {/* The calendar will be rendered inside this div */}
      </div>
      {/* <FullCalendar
        dayCellContent={dayCellContent}
        weekends
        // editable
        // droppable
        // selectable
        allDayMaintainDuration
        eventResizableFromStart
        events={events}
        ref={calendarRef}
        initialDate={date}
        initialView={view}
        dayMaxEventRows={3}
        eventDisplay="block"
        headerToolbar={false}
        dateClick={(info) => {
          handleDateSet(info);
        }}
        //   select={handleSelectRange}
        //   eventDrop={handleDropEvent}
        //   eventClick={handleSelectEvent}
        //   eventResize={handleResizeEvent}
        height={500}
        plugins={[
          listPlugin,
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          multiMonthPlugin,
        ]}
        // eventDidMount={eventDidMount}
        // dayCellDidMount={eventDidMount}
        // validRange={validRange}
      /> */}
    </StyledCalendar>
  );
};

export default TravelCalendar;
