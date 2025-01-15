import { createSlice } from "@reduxjs/toolkit";
import { BOM, DEL } from "../../utils/constants";
import localStorage from "redux-persist/es/storage";

const initialState = {
  tripType: "0",
  traceid: "",
  origin: DEL,
  adultCount: 1,
  infantCount: 0,
  childrenCount: 0,
  cabin: "0",
  destination: BOM,
  arrivalDate: "",
  departureDate: new Date(),
  journey: [],
  segments: [],
  flightBookingDetails: {},
  adultArray: [{ Title: "", FirstName: "", LastName: "" }],
  childrenArray: [{ Title: "", FirstName: "", LastName: "" }],
  infantArray: [{ Title: "", FirstName: "", LastName: "" }],
};

const flightSlice = createSlice({
  name: "flightSlice",
  initialState,
  reducers: {
    setTripType: (state, { payload }) => {
      const tripType = payload;
      state.tripType = tripType;
    },
    setTraceId: (state, { payload }) => {
      const traceid = payload;
      state.traceid = traceid;
    },
    setOrigin: (state, { payload }) => {
      const origin = payload;
      state.origin = origin;
    },
    setAdultCount: (state, { payload }) => {
      const adultCount = payload;
      state.adultCount = Number(adultCount);
    },
    setChildrenCount: (state, { payload }) => {
      const childrenCount = payload;
      state.childrenCount = Number(childrenCount);
    },
    setInfantCount: (state, { payload }) => {
      const infantCount = payload;
      state.infantCount = Number(infantCount);
    },
    setCabin: (state, { payload }) => {
      const cabin = payload;
      state.cabin = cabin;
    },
    setDestination: (state, { payload }) => {
      const destination = payload;
      state.destination = destination;
    },
    setArrivalDate: (state, { payload }) => {
      const arrivalDate = payload;
      state.arrivalDate = arrivalDate;
    },
    setDepartureDate: (state, { payload }) => {
      const departureDate = payload;
      state.departureDate = departureDate;
    },
    setJourney: (state, { payload }) => {
      const journey = payload;
      state.journey = journey;
    },
    setSegments: (state, { payload }) => {
      const segments = payload;
      state.segments = segments;
    },
    setFlightBookingDetails: (state, { payload }) => {
      const flightBookingDetails = payload;
      console.log("dispatch payload received=>", payload);
      console.log("state=>", state);
      state.flightBookingDetails = {
        ...state.flightBookingDetails,
        flightBookingDetails,
      };
    },
    setAdultArray: (state, { payload }) => {
      const { adultArray, type = "add", index, val, key } = payload;
      if (type === "add") {
        state.adultArray = [...state.adultArray, adultArray];
      }
      if (type === "del") state.adultArray = adultArray;
      if (type === "mod" && index != null) {
        state.adultArray[index][key] = val;
      }
    },
    setChildrenArray: (state, { payload }) => {
      const { childrenArray, type = "add", index, val, key } = payload;
      if (type === "add") {
        state.childrenArray = [...state.childrenArray, childrenArray];
      }
      if (type === "del") state.childrenArray = childrenArray;
      if (type === "mod" && index != null) {
        state.childrenArray[index][key] = val;
      }
    },
    setInfantArray: (state, { payload }) => {
      const { infantArray, type = "add", index, val, key } = payload;
      if (type === "add") {
        state.infantArray = [...state.infantArray, infantArray];
      }
      if (type === "del") state.infantArray = infantArray;
      if (type === "mod" && index != null) {
        state.infantArray[index][key] = val;
      }
    },
    clearFlightRedux: (state, { payload }) => {
      const { type } = payload;
      if (type === "clear") {
        localStorage.removeItem("redux-root");
        Object.assign(state, initialState);
      } else {
      }
    },
  },
});

export const {
  setTripType,
  setTraceId,
  setAdultCount,
  setOrigin,
  setInfantCount,
  setCabin,
  setDestination,
  setChildrenCount,
  setArrivalDate,
  setDepartureDate,
  setJourney,
  setFlightBookingDetails,
  setAdultArray,
  setChildrenArray,
  setInfantArray,
  clearFlightRedux,
  setSegments,
} = flightSlice.actions;

export default flightSlice.reducer;
