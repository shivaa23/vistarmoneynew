import { createSlice } from "@reduxjs/toolkit";
import { getGeoLocation } from "../../utils/GeoLocationUtil";

// eslint-disable-next-line no-unused-vars
const locationVal = getGeoLocation();

const initialState = {
  latitude: "this is lat",
  longitude: "this is long",
};
//  getGeoLocation(
//   (lat, long) => {

//     return [userLat, userLong];
//   },
//   (err) => {
//     okErrorToast("Location", err);
//   }
// );
const hardwarePermissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setLatLong: (state, { payload }) => {
      console.log("actions", payload);
      state.latitude = payload.lat;
      state.longitude = payload.long;
    },
  },
});

export const { setLatLong } = hardwarePermissionsSlice.actions;
export default hardwarePermissionsSlice.reducer;
