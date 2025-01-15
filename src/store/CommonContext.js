import React, { useContext, createContext, useState } from "react";
import ApiEndpoints from "../network/ApiEndPoints";
import { get } from "../network/ApiController";
import { apiErrorToast, errorNotiToast } from "../utils/ToastUtil";
import { useCallback } from "react";
import AuthContext from "./AuthContext";
import { useEffect } from "react";
// import axios from "axios";
// import { getRemainingTime } from "../modals/aeps/AEPSTimer";
// import { AEPS_TYPE } from "../utils/constants";

const CommonContext = createContext();
const MINUTE_MS = 120000;

export const CommonContextProvider = ({ children }) => {
  const aepsTypeLocal = localStorage.getItem("aepsType") ?? "";
  // console.log("aepsTypeLocal", aepsTypeLocal);
  const [recentData, setRecentData] = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);
  // find which section we are on
  const [section, setSection] = useState("");
  const [openNoti, setOpenNoti] = useState(false);
  const [pushFlag, setPushFlag] = useState(true);
  const [calendarFare, setCalendarFare] = useState([]);
  const [aepsType, setAepsType] = useState(aepsTypeLocal);
  // console.log("aepsType", aepsType);
  const [openAeps2FAModal, setOpenAeps2FAModal] = useState();
  // console.log("openAeps2FAModal", openAeps2FAModal);
  const [checkIf2FaCalled, setCheckIf2FaCalled] = useState("notdone");
  const [timeInSec, setTimeInSec] = useState(null);
  // console.log("checkIf2FaCalled", checkIf2FaCalled);

  // #########################################
  // RD DEVICE HOOKS -------------------------
  // #########################################
  const [rdDevice, setRdDevice] = useState();
  const [scanData, setScanData] = useState();
  const [rdDeviceList, setRdDeviceList] = useState([]);
  const [machineRequest, setMachineRequest] = useState(false);
  // console.log("timeInSec", timeInSec);
  // #########################################
  // LOGGEDIN USER HOOKS -------------------------
  // #########################################
  const [notiCount, setNotiCount] = useState(0);
  const [userRequest, setUserRequest] = useState(false);
  const authCtx = useContext(AuthContext);
  const logout = authCtx.logout;
  const isLoggedIn = authCtx.isLoggedIn;
  const saveUser = authCtx.saveUser;
  const setLocation = authCtx.setLocation;
  const setDocsInLocal = authCtx.setDocsInLocal;
  // ##### HOOK FOR THE TRANSACTION LAYOUT ######
  const [chooseInitialCategoryFilter, setChooseInitialCategoryFilter] =
    useState(false);

  const testRedToast = (message) => {
    errorNotiToast
      .fire({
        title: message,
      })
      .then((resVal) => {
        if (resVal?.isConfirmed) {
          setOpenNoti(true);
        }
      });
  };

  const getRecentData = () => {
    get(
      ApiEndpoints.GET_RECENT_DATA,
      "",
      setRecentLoading,
      (res) => {
        if (res && res) setRecentData(res.data.data);
        else setRecentData();
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  const refreshUser = useCallback(async () => {
    get(
      ApiEndpoints.GET_ME_USER,
      "",
      setUserRequest,
      (res) => {
        const data = res.data.data;

        const docs = res.data.docs;
        setNotiCount(res.data.message);
        saveUser(data);
        if (docs && typeof docs === "object") {
          setDocsInLocal(docs);
        }
        setUserRequest(false);
      },
      (error) => {
        if (logout) logout();
        setLocation();
        apiErrorToast(error);
        setUserRequest(false);
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setLocation, setDocsInLocal, saveUser]);

  const getUserAxios = async () => {
    // try {
    //   const resp = await axios.get(BASE_URL + ApiEndpoints.GET_ME_USER, {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    //     },
    //   });
    //   const user = resp.data.data;
    //   const { time } = getRemainingTime(
    //     aepsType === AEPS_TYPE.AEPS1
    //       ? user?.ipay_auth_time
    //       : aepsType === AEPS_TYPE.AEPS2
    //       ? user?.fing_auth_time
    //       : ""
    //   );
    //   // console.log("time subtracted from current time => ", time);
    //   if (time) {
    //     setTimeInSec(3 * 60 - time);
    //   } else {
    //     setTimeInSec(null);
    //     // if (checkIf2FaCalled !== "done") setOpenAeps2FAModal(true);
    //   }
    // } catch (error) {}
  };

  // ##########################################
  // UPDATE USER DATA API CALL ON TIMELY BASIS
  // ##########################################

  // stopped it cause of unauthorised error on 28 may 2024
  // useEffect(() => {

  //   const interval = setInterval(() => {
  //     if (isLoggedIn) refreshUser();
  //   }, MINUTE_MS);

  //   return () => clearInterval(interval);
  // }, [isLoggedIn, refreshUser]);

  const setAepsTypeInLocalAndHook = (value) => {
    localStorage.setItem("aepsType", value);
    setAepsType(value);
  };

  return (
    <CommonContext.Provider
      value={{
        recentData,
        getRecentData,
        recentLoading,
        section,
        setSection,
        openNoti,
        setOpenNoti,
        testRedToast,
        setPushFlag,
        pushFlag,
        calendarFare,
        setCalendarFare,
        // ####################
        // AePS HOOKS #########
        // ####################
        aepsType,
        setAepsType,
        setAepsTypeInLocalAndHook,
        rdDevice,
        scanData,
        rdDeviceList,
        machineRequest,
        setRdDevice,
        setScanData,
        setRdDeviceList,
        setMachineRequest,
        setOpenAeps2FAModal,
        openAeps2FAModal,
        setCheckIf2FaCalled,
        checkIf2FaCalled,
        setTimeInSec,
        timeInSec,
        getUserAxios,
        // ####################
        // LOGGEDIN USER HOOKS
        // ####################
        refreshUser,
        notiCount,
        setNotiCount,
        userRequest,
        // ##### HOOK FOR TRANSACTION LAYOUT
        setChooseInitialCategoryFilter,
        chooseInitialCategoryFilter,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};

const useCommonContext = () => {
  return useContext(CommonContext);
};

export default useCommonContext;
