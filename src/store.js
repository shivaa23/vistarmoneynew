import { configureStore } from "@reduxjs/toolkit";
import hardwarePermissionsReducer from "./features/extraFeatures/hardwarePermissionsSlice";
import flightSlice from "./features/flight/flightSlice";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import {
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from "react-redux";
import { combineReducers } from "redux";
import allUsersSlice from "./features/allUsers/allUsersSlice";

const rootReducer = combineReducers({
  latLong: hardwarePermissionsReducer,
  flight: flightSlice,
  allUsers: allUsersSlice,
});

const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  whitelist: ["flight"],
};

const store = configureStore({
  reducer: persistReducer(rootPersistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    }),
});
const persistor = persistStore(store);
const { dispatch } = store;

const useSelector = useAppSelector;

const useDispatch = () => useAppDispatch();

export { store, persistor, dispatch, useSelector, useDispatch };
