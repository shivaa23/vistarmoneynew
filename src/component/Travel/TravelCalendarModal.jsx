import React, { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TravelCalendar from "./TravelCalendar";
import calendar from "../../assets_travel/images/icons/calendar.svg";
import { TextField } from "@mui/material";
import moment from "moment";
import { isPastDate } from "../../utils/DateUtils";
import Mount from "../Mount";
import { capitalize1 } from "../../utils/TextUtil";
import useResponsive from "../../hooks/useResponsive";
import { useDispatch } from "react-redux";
import { setTripType } from "../../features/flight/flightSlice";
import ModalHeader from "../../modals/ModalHeader";

const TravelCalendarModal = ({
  date,
  setDate,
  setTrip,
  isOuter = true,
  placeholder = "",
}) => {
  const [open, setOpen] = useState(false);
  const isMobile = useResponsive("md", "down");
  const dispatch = useDispatch();
  
  const handleOpen = () => {
    if (!date) {
      if (setTrip) dispatch(setTripType("1"));
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 2);
      setDate(currentDate);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateSet = (info) => {
    if (isPastDate(info?.date)) {
      return; // Ignore past dates
    }
    setDate(info.dateStr);
    handleClose();
  };

  const dateComponent = useMemo(() => {
    return (
      <>
        <Mount visible={date}>
          <p onClick={handleOpen}>
            <span
              id="ddayno"
              className={isOuter ? "imp25 mgr5" : "imp2_25 mgr25"}
              style={{ marginRight: 0.5 }}
            >
              {moment(date).format("DD")}
            </span>{" "}
            <span
              id="dmonthyear"
              className={isOuter ? "imp13 mgr5" : "imp2_13 mgr5"}
            >
              {moment(date).format("MMM YYYY")}
            </span>
            <Mount visible={!isMobile && !isOuter}>
              <img
                className={!isOuter ? "cl_icon2" : "cl_icon"}
                src={calendar}
                alt="calendar"
              />
            </Mount>
          </p>
        </Mount>
        <Mount visible={!date}>
          <div
            className="d-flex align-items-center"
            style={{
              paddingTop: "2.5px",
              paddingBottom: "2.5px",
            }}
          >
            <div
              className={isOuter ? "imp13 mgr5" : "imp2_13 mgr5"}
              onClick={handleOpen}
              style={{
                textAlign: "left",
              }}
            >
              Choose Date
            </div>
            <Mount visible={!isMobile && !isOuter}>
              <img
                className={date ? "cl_icon" : !isOuter ? "cl_icon2" : ""}
                src={calendar}
                alt="calendar"
              />
            </Mount>
          </div>
        </Mount>
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  return (
    <>
      <div onClick={handleOpen}>
        <Mount visible={isOuter}>
          <label
            className={isOuter ? "form-label" : ""}
            style={{
              color: isOuter ? "" : "#ECF0F1",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {capitalize1(placeholder)}
          </label>
        </Mount>
        <Box
          sx={{
            position: "relative",
          }}
        >
          <TextField autoComplete="off"
            value={moment(date).format("DD/MM/YYYY")}
            onClick={handleOpen}
            size="small"
            className="customized-textfield"
            sx={{
              input: { display: "none" }, // Hide the input if you don't want to show it.
            }}
          />
          {dateComponent}
        </Box>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title="Select Date" handleClose={handleClose} />
          <TravelCalendar
            date={date}
            setDate={setDate}
            handleDateSet={handleDateSet}
          />
        </Box>
      </Modal>
    </>
  );
};
export default TravelCalendarModal;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "calc(70% + 2px)",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  height: "calc(70% + 2px)",
  overflowY: { xs: "scroll", md: "hidden" },
  overflowX: "hidden",
  p: 2,
};
