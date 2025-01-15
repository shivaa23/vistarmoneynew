/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import useCommonContext from "../../store/CommonContext";

export function convertSecondsToMinutesAndSeconds(passedseconds) {
  // Calculate minutes and passedseconds
  const minutes = Math.floor(passedseconds / 60);
  const seconds = passedseconds % 60;

  // Format seconds to have leading zero if less than 10
  const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

  return { clockTime: minutes + " : " + formattedSeconds };
}

export const getRemainingTime = (apiTime) => {
  const theApiTime = new Date(apiTime).toString("en-IN");
  //   console.log("theApiTime", theApiTime);

  const milliReconstructedTime = new Date(theApiTime).getTime();

  const javaScriptCurrentTime = new Date().toString("en-IN");
  //   console.log("javaScriptCurrentTime", javaScriptCurrentTime);
  const milliJavaScriptCurrentTime = new Date(javaScriptCurrentTime).getTime();

  const subtractedTimeInSeconds = Math.floor(
    (milliJavaScriptCurrentTime - milliReconstructedTime) / 1000
  );

  console.log("subtractedTimeInSeconds", subtractedTimeInSeconds);

  return {
    time: subtractedTimeInSeconds > 180 ? null : subtractedTimeInSeconds,
  };
};

const AEPSTimer = () => {
  //   console.log("seconds hoook", timeInSec);

  const {
    setOpenAeps2FAModal,
    checkIf2FaCalled,
    setCheckIf2FaCalled,
    setTimeInSec,
    timeInSec,
    getUserAxios,
  } = useCommonContext();
  //   console.log("checkIf2FaCalled", checkIf2FaCalled);
  // use effect for interval
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (timeInSec > 0) {
        setTimeInSec(timeInSec - 1);
      } else {
        clearInterval(myInterval);
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  //   const apiTime = "Mon Jan 15 12:25:00 IST 2024";

  useEffect(() => {
    getUserAxios();
  }, [checkIf2FaCalled]);

  useEffect(() => {
    // if (timeInSec === 0) {
    //   setCheckIf2FaCalled("notdone");
    //   setOpenAeps2FAModal(true);
    // }
  }, [timeInSec]);
  const { clockTime } = convertSecondsToMinutesAndSeconds(timeInSec);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        ml: 3,
      }}
    >
      {timeInSec ? (
        <>
          <div>Remaining 2FA time</div>{" "}
          <div style={{ color: "red" }}>({clockTime})</div>
        </>
      ) : (
        <div style={{ color: "red", fontSize: "1.3rem" }}>2FA Expired</div>
      )}
    </Box>
  );
};

export default AEPSTimer;
