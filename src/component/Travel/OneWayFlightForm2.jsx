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
  TextField,
  MenuItem,
} from "@mui/material";
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
import { primaryColor } from "../../theme/setThemeColor";
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
  setTripType,
} from "../../features/flight/flightSlice";

const OneWayFlightForm2 = () => {
  const [request, setRequest] = useState(false);
  const { setCalendarFare } = useCommonContext();
  // const [arrivalDate, setArrivalDate] = useState("");
  // const [departureDate, setDepartureDate] = useState(new Date());
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

  const handleChange = (event, newValue) => {
    dispatch(setTripType(newValue));
  };

  return (
    <Box
      component="form"
      id="flight_search"
      validate
      autoComplete="off"
      onSubmit={handleSubmit}
      sx={{
        position: "relative",
        backgroundColor: primaryColor(),
        borderRadius: "12px",
      }}
    >
      <LoaderFull
        loading={request}
        text="Just a moment, we are searching for the flights on this route."
        blur={1}
      />
      {/* Date selection component */}
      <Grid
        container
        spacing={1}
        className="search-pan2 row mx-0 theme-border-radius"
        sx={{
          px: 2,
          py: 1,
        }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "flex-start",
          }}
        >
          <div>
            <FlightOptions value={tripType} handleChange={handleChange} />
          </div>
        </Grid>
        {/* ################ TRAVEL CLASS OPTIONS ################ */}

        <Grid
          item
          xs={6}
          sm={6}
          md={3}
          lg={2}
          sx={{
            paddingLeft: { xs: "", md: "0px !important" },
          }}
        >
          <label
            className="form-label"
            style={{
              color: "#ECF0F1",
              textAlign: "left",
              fontSize: "14px",
            }}
          >
            FROM
          </label>
          <Button sx={buttonStyle}>
            <AirportListComponent
              placeholder="FROM"
              place={origin}
              setPlace={(place) => dispatch(setOrigin(place))}
              isOuter={false}
            />
          </Button>
        </Grid>
        <Grid item xs={6} sm={6} md={3} lg={2}>
          <label
            className="form-label"
            style={{
              color: "#ECF0F1",
              textAlign: "left",
              fontSize: "14px",
            }}
          >
            TO
          </label>
          <Button sx={buttonStyle}>
            <AirportListComponent
              placeholder="TO"
              place={destination}
              setPlace={(place) => dispatch(setDestination(place))}
              isOuter={false}
            />
          </Button>
        </Grid>
        <Grid item xs={6} sm={6} md={3} lg={2}>
          <label
            className="form-label"
            style={{
              color: "#ECF0F1",
              textAlign: "left",
              fontSize: "14px",
            }}
          >
            DEPARTURE
          </label>
          <Button sx={buttonStyle}>
            <TravelCalendarModal
              date={departureDate}
              setDate={(date) => dispatch(setDepartureDate(date))}
              isOuter={false}
              placeholder="Departure"
            />
          </Button>
        </Grid>
        <Grid item xs={6} sm={6} md={3} lg={2}>
          <label
            className="form-label"
            style={{
              color: "#ECF0F1",
              textAlign: "left",
              fontSize: "14px",
            }}
          >
            ARRIVAL
          </label>
          <Button
            sx={{
              ...buttonStyle,
            }}
          >
            <TravelCalendarModal
              date={arrivalDate}
              setDate={(date) => dispatch(setArrivalDate(date))}
              isOuter={false}
              setTrip={true}
              placeholder="Arrival"
            />
          </Button>
        </Grid>
        <Grid
          item
          xs={6}
          md={4}
          lg={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <label
            className="form-label"
            style={{
              color: "#ECF0F1",
              textAlign: "left",
              fontSize: "14px",
            }}
          >
            CLASS
          </label>
          <FormControl sx={{ width: "100%" }}>
            <TextField autoComplete="off"
              className="travel-input"
              select
              size="small"
              name="travel_class"
              value={cabin}
              onChange={handleCabin}
            >
              <MenuItem dense value="0">
                Economy
              </MenuItem>
              <MenuItem dense value="1">
                First
              </MenuItem>
              <MenuItem dense value="2">
                Business
              </MenuItem>
              <MenuItem dense value="4">
                Prem. Economy
              </MenuItem>
            </TextField>
          </FormControl>
        </Grid>

        <Grid
          item
          xs={6}
          sm={4}
          md={2}
          sx={{
            px: 1,
            ...gridStyle3,
          }}
        >
          <label
            className="form-label"
            style={{
              color: "#ECF0F1",
              textAlign: "left",
              fontSize: "14px",
            }}
          >
            ADULTS <span style={spanStyle}>(12+ Years)</span>
          </label>
          <FormControl>
            <TextField autoComplete="off"
              className="travel-input"
              select
              size="small"
              name="adult_count"
              value={adultCount}
              onChange={(e) => {
                dispatch(setAdultCount(e.target.value));
              }}
            >
              <MenuItem dense value="0">
                0
              </MenuItem>
              <MenuItem dense value="1">
                1
              </MenuItem>
              <MenuItem dense value="2">
                2
              </MenuItem>
              <MenuItem dense value="4">
                3
              </MenuItem>
              <MenuItem dense value="4">
                4
              </MenuItem>
              <MenuItem dense value="4">
                5
              </MenuItem>
              <MenuItem dense value="4">
                6
              </MenuItem>
              <MenuItem dense value="4">
                7
              </MenuItem>
              <MenuItem dense value="4">
                8
              </MenuItem>
              <MenuItem dense value="4">
                9
              </MenuItem>
              <MenuItem dense value="4">
                10
              </MenuItem>
            </TextField>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={2}
          sx={{
            px: 1,
            ...gridStyle3,
          }}
        >
          <label
            className="form-label"
            style={{
              color: "#ECF0F1",
              textAlign: "left",
              fontSize: "14px",
            }}
          >
            CHILDREN <span style={spanStyle}>(2-12 Years)</span>
          </label>
          <FormControl>
            <TextField autoComplete="off"
              className="travel-input"
              select
              size="small"
              name="children_count"
              value={childrenCount}
              onChange={(e) => {
                dispatch(setChildrenCount(e.target.value));
              }}
            >
              <MenuItem dense value="0">
                0
              </MenuItem>
              <MenuItem dense value="1">
                1
              </MenuItem>
              <MenuItem dense value="2">
                2
              </MenuItem>
              <MenuItem dense value="3">
                3
              </MenuItem>
              <MenuItem dense value="4">
                4
              </MenuItem>
              <MenuItem dense value="5">
                5
              </MenuItem>
              <MenuItem dense value="6">
                6
              </MenuItem>
            </TextField>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={2}
          sx={{
            px: 1,
            ...gridStyle3,
          }}
        >
          <label
            className="form-label"
            style={{
              color: "#ECF0F1",
              textAlign: "left",
              fontSize: "14px",
            }}
          >
            INFANTS <span style={spanStyle}>(0-2 Years)</span>
          </label>
          <FormControl>
            <TextField autoComplete="off"
              className="travel-input"
              select
              size="small"
              name="infant_count"
              value={infantCount}
              onChange={(e) => {
                dispatch(setInfantCount(e.target.value));
              }}
            >
              <MenuItem dense value="0">
                0
              </MenuItem>
              <MenuItem dense value="1">
                1
              </MenuItem>
              <MenuItem dense value="2">
                2
              </MenuItem>
              <MenuItem dense value="3">
                3
              </MenuItem>
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={4} lg={6} sx={gridStyle3}>
          <button
            type="submit"
            className="btn btn-search position-relative"
            form="flight_search"
            disabled={adultCount === 0}
          >
            <span className="fw-bold">
              <i className="bi bi-search me-2"></i>Search
            </span>
          </button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OneWayFlightForm2;

function FlightOptions({ value, handleChange }) {
  return (
    <FormControl
      sx={{
        width: "100%",
        color: "#ffffff",
      }}
    >
      <RadioGroup
        row
        value={value}
        onChange={handleChange}
        name="flight-type-radio-buttons-group"
        aria-labelledby="flight-type-radio-buttons-group-label"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <FormControlLabel
          value="0"
          control={<Radio size="small" sx={radioStyle} />}
          label="One way"
        />
        <FormControlLabel
          value="1"
          control={<Radio size="small" sx={radioStyle} />}
          label="Round Trip"
        />
      </RadioGroup>
    </FormControl>
  );
}
const radioStyle = {
  color: "#ffffff80",
  "&.Mui-checked": {
    color: "#ffffff",
  },
};
const gridStyle3 = {
  display: "flex",
  p: { xs: 1, md: 0 },
  px: { xs: 0, md: 1 },
  // ml: { xs: 2.3, md: 0 },
  "&:hover": {
    cursor: "pointer",
  },
  flexDirection: "column",
  borderBottom: { xs: "0px solid #DDDDDD", md: "0px" },
};
const buttonStyle = {
  p: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  background: "#ffffff20",
  alignItems: "flex-start",
  px: { xs: 1, md: 1 },
  my: { xs: 1, md: 0 },
  "&:hover": {
    cursor: "pointer",
  },
};

const spanStyle = {
  fontWeight: "normal",
  fontSize: "12px",
};
