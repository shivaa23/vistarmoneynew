/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";
import CounterComponent from "../CounterComponent";
import TravelCalendarModal from "./TravelCalendarModal";
import AirportListComponent from "./AirportListComponent";
import AuthContext from "../../store/AuthContext";
import moment from "moment";
import { postJsonData } from "../../network/ApiController";
import ApiEndpoints from "../../network/ApiEndPoints";
import { apiErrorToast } from "../../utils/ToastUtil";
import LoaderFull from "../../commons/LoaderFull";
import { prepareCalendarEvents } from "./flight_rate_data";
import useCommonContext from "../../store/CommonContext";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setAdultCount,
  setArrivalDate,
  setCabin,
  setChildrenCount,
  setDepartureDate,
  setDestination,
  setInfantCount,
  setOrigin,
} from "../../features/flight/flightSlice";

const OneWayFlightForm = () => {
  const [request, setRequest] = useState(false);
  const { setCalendarFare } = useCommonContext();
  const dispatch = useDispatch();
  const {
    tripType,
    origin,
    adultCount,
    infantCount,
    cabin,
    destination,
    childrenCount,
    arrivalDate,
    departureDate,
  } = useSelector((state) => state?.flight);
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const createCalendarFareQuery = (origin, destination) => {
    const currentDate = new Date();
    const newDate = moment(currentDate).format("YYYY-MM-DD");
    let filter = `Days=0&Months=8&Date=${newDate}`;
    if (origin && origin.CityCode) {
      filter = filter + (filter ? "&" : "") + "Origin=" + origin.CityCode;
    }
    if (destination && destination.CityCode) {
      filter =
        filter + (filter ? "&" : "") + "Destination=" + destination.CityCode;
    }
    return filter;
  };

  const getCalendarFare = useCallback((origin, destination) => {
    const query = createCalendarFareQuery(origin, destination);
    postJsonData(
      `${ApiEndpoints.GET_CALENDAR_FARE}?${query}`,
      "",
      setRequest,
      (res) => {
        setCalendarFare(prepareCalendarEvents(res?.data?.data));
      },
      (err) => {
        apiErrorToast(err);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCabin = (e) => {
    dispatch(setCabin(e.target.value));
  };

  useEffect(() => {
    if (origin && destination) {
      getCalendarFare(origin, destination);
    }
    return () => {};
  }, [getCalendarFare, origin, destination]);

  const createFormData = () => {
    let formData = `MobileNumber=${authCtx.user.username}`;
    if (adultCount >= 1) {
      formData += (formData ? "&" : "") + "Adults=" + adultCount;
    }

    if (childrenCount >= 0) {
      formData += (formData ? "&" : "") + "Childs=" + childrenCount;
    }
    if (infantCount >= 0) {
      formData += (formData ? "&" : "") + "Infants=" + infantCount;
    }

    if (departureDate) {
      formData +=
        (formData ? "&" : "") +
        "BeginDate=" +
        moment(departureDate).format("YYYY-MM-DD");
    }
    if (arrivalDate) {
      formData +=
        (formData ? "&" : "") +
        "ArrivalDate=" +
        moment(arrivalDate).format("YYYY-MM-DD");
    }

    if (origin?.CityCode) {
      formData += (formData ? "&" : "") + "Origin=" + origin.CityCode;
    }

    if (destination?.CityCode) {
      formData += (formData ? "&" : "") + "Destination=" + destination.CityCode;
    }

    if (tripType) {
      formData += (formData ? "&" : "") + "TripType=" + tripType;
    }
    if (cabin) {
      formData += (formData ? "&" : "") + "Cabin=" + cabin;
    }
    return formData;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = createFormData();
    navigate(`/customer/flights-list/?${data}`);
  };

  useEffect(() => {
    if (tripType === "1") {
      if (!arrivalDate) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 2);
        dispatch(setArrivalDate(currentDate));
      }
    }
    return () => {};
  }, [tripType]);

  return (
    <Box
      component="form"
      id="flight_search"
      validate
      autoComplete="off"
      onSubmit={handleSubmit}
      sx={{
        position: "relative",
      }}
    >
      <LoaderFull
        loading={request}
        text="Just a moment, we are searching for the flights on this route."
        blur={1}
      />
      {/* DATE SELECTION COMPONENT */}
      <Grid container className="search-pan row mx-0 theme-border-radius">
        <Grid xs={12} md={3} sx={gridStyle}>
          <Box
            sx={{
              pl: { xs: 0, md: 2 },
            }}
          >
            <AirportListComponent
              placeholder="FROM"
              place={origin}
              setPlace={(place) => dispatch(setOrigin(place))}
            />
          </Box>
        </Grid>
        <Grid xs={12} md={3} sx={gridStyle}>
          <AirportListComponent
            placeholder="TO"
            place={destination}
            setPlace={(place) => dispatch(setDestination(place))}
          />
        </Grid>
        <Grid xs={12} md={3} sx={gridStyle}>
          <Button sx={buttonStyle}>
            <TravelCalendarModal
              placeholder="DEPARTURE"
              date={departureDate}
              setDate={(date) => dispatch(setDepartureDate(date))}
            />
          </Button>
        </Grid>
        {/* <Mount visible={tripType === "1"}> */}
        <Grid
          xs={12}
          md={3}
          sx={{
            ...gridStyle2,
          }}
        >
          <Button
            sx={{
              ...buttonStyle,
            }}
            // disabled={tripType === "0"}
          >
            <TravelCalendarModal
              placeholder="ARRIVAL"
              date={arrivalDate}
              setDate={(date) => dispatch(setArrivalDate(date))}
              setTrip={true}
            />
          </Button>
        </Grid>
        {/* </Mount> */}
      </Grid>

      {/* PASSENGER SELECTION COMPONENT */}
      <Grid
        className="search-pan theme-border-radius"
        container
        sx={{ mt: 2, p: 2 }}
      >
        <Grid item xs={12} md={4} lg={3} sx={gridStyle3}>
          <label className="form-label">
            ADULTS <span style={spanStyle}>(12+ Years)</span>
          </label>
          <CounterComponent
            value={adultCount}
            onIncrement={() => dispatch(setAdultCount(adultCount + 1))}
            onDecrement={() => {
              if (adultCount > 0) dispatch(setAdultCount(adultCount - 1));
            }}
            onChange={(value) => dispatch(setAdultCount(value))}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={3} sx={gridStyle3}>
          <label className="form-label">
            CHILDREN <span style={spanStyle}>(2-12 Years)</span>
          </label>
          <CounterComponent
            value={childrenCount}
            onIncrement={() => dispatch(setChildrenCount(childrenCount + 1))}
            onDecrement={() => {
              if (childrenCount > 0)
                dispatch(setChildrenCount(childrenCount - 1));
            }}
            onChange={(value) => dispatch(setChildrenCount(value))}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={3} sx={gridStyle3}>
          <label className="form-label">
            INFANTS <span style={spanStyle}>(0-2 Years)</span>
          </label>
          <CounterComponent
            value={infantCount}
            onIncrement={() => dispatch(setInfantCount(infantCount + 1))}
            onDecrement={() => {
              if (infantCount > 0) dispatch(setInfantCount(infantCount - 1));
            }}
            onChange={(value) => dispatch(setInfantCount(value))}
          />
        </Grid>

        <Grid item xs={12} md={4} lg={3} sx={gridStyle3}>
          <button
            type="submit"
            className="btn btn-search position-relative mt-md-2"
            form="flight_search"
            disabled={adultCount === 0}
          >
            <span className="fw-bold">
              <i className="bi bi-search me-2"></i>Search
            </span>
          </button>
        </Grid>

        {/* CLASS SELECTION */}
        <Grid
          item
          xs={12}
          sx={{
            textAlign: "left",
            px: { xs: 0, md: 2 },
            mt: 1,
          }}
        >
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="oneway-radio-buttons-group-label"
              name="oneway-radio-buttons-group"
              defaultValue={cabin && cabin}
              value={cabin && cabin}
              onChange={handleCabin}
            >
              <FormControlLabel
                value="0"
                control={<Radio size="small" />}
                label={<span style={spanStyle}>Economy</span>}
              />
              <FormControlLabel
                value="1"
                control={<Radio size="small" />}
                label={<span style={spanStyle}>First</span>}
              />
              <FormControlLabel
                value="2"
                control={<Radio size="small" />}
                label={<span style={spanStyle}>Business</span>}
              />
              <FormControlLabel
                value="4"
                control={<Radio size="small" />}
                label={<span style={spanStyle}>Premium Economy</span>}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OneWayFlightForm;

const gridStyle = {
  display: "flex",
  flexDirection: "column",
  borderRight: { xs: "0px", md: "1px solid #DDDDDD" },
  borderBottom: { xs: "1px solid #DDDDDD", md: "0px" },
  p: 2,
  transition: "0.5s background",
  "&:hover": {
    cursor: "pointer",
    background: "rgba(16,73,17,0.08)",
    boxShadow:
      "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
  },
};
const gridStyle2 = {
  display: "flex",
  flexDirection: "column",
  transition: "0.5s background",
  p: 2,
  "&:hover": {
    cursor: "pointer",
    background: "rgba(16,73,17,0.08)",
    boxShadow:
      "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
  },
};
const gridStyle3 = {
  display: "flex",
  flexDirection: "column",
  borderRight: { xs: "0px", md: "1px solid #DDDDDD" },
  borderBottom: { xs: "1px solid #DDDDDD", md: "0px" },
  p: { xs: 2, md: 0 },
  px: { xs: 0, md: 2 },
  "&:hover": {
    cursor: "pointer",
  },
};
const buttonStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  p: 0,
  px: { xs: 0, md: 2 },
  "&:hover": {
    cursor: "pointer",
  },
};
const spanStyle = {
  fontWeight: "normal",
  fontSize: "12px",
};
