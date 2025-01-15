import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";

const TimerButton = ({
  initialSeconds = 60,
  setIsResend = () => {},
  resetCount = 0,
  isresend,
  resendOtp,
  login=false
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        clearInterval(myInterval);
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  const handleRecall = () => {
    resendOtp();
    setSeconds(initialSeconds);
  }

  useEffect(() => {
    if (seconds === 0) {
      setIsResend(false);
    } else {
      setIsResend(true);
    }
    return () => {};
  }, [seconds]);

  useEffect(() => {
    setSeconds(initialSeconds);
    return () => {};
  }, [resetCount]);

  return (
    <Button
      variant={login ? "standard" : "contained"}
      disabled={isresend}
      sx={{
        width: "100%",
        textTransform: "none",
        height: "50px",
        fontSize: "0.95rem",
        backgroundColor: !login ? "#34ABF4" : "transparent",
        marginRight: "1rem",
        mt: 2
      }}
      onClick={handleRecall}
    >
      <div>
        Resend OTP 
        {seconds > 0 && <span style={{ color: "#000" }}>{" "}in { " " + seconds} s</span>}
      </div>
    </Button>
  );
};

export default TimerButton;
