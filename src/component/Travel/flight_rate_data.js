export const prepareCalendarEvents = (inputJson) => {
  const events = [];
  inputJson.lstMonths?.forEach((month) => {
    month.lstCalFare.length > 0 &&
      month.lstCalFare?.forEach((fare) => {
        const startTimestamp = new Date(fare.DepDate).getTime();
        const endTimestamp = startTimestamp + 24 * 60 * 60 * 1000; // Add one day in milliseconds

        events.push({
          id: `${fare.AirLineCode}-${startTimestamp}`,
          backgroundColor: "#00A76F", // You can set different colors as needed
          start: new Date(startTimestamp).toISOString().substring(0, 10),
          end: new Date(endTimestamp).toISOString().substring(0, 10),
          title: `₹${fare?.TotalFare}`,
          allDay: true,
        });
      });
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // eslint-disable-next-line no-unused-vars
  const eventsForToday = events.filter((event) => {
    const eventStartDate = new Date(event.start);
    return eventStartDate.getDate() === today.getDate();
  });
  return events;
};
