/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { success_vdo } from "../iconsImports";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { primaryColor } from "../theme/setThemeColor";

const timeout = 10;
const PaymentSuccess = () => {
  const [timer, setTimer] = useState(timeout);
  const [tries, setTries] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setTimer(timeout);
    const interval = setInterval(() => {
      setTimer((timer) => {
        if (timer > 0) {
          return timer - 1;
        }
        clearInterval(interval);
        return timer;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [tries]);

  useEffect(() => {
    if (timer === 0) navigate("/customer/dashboard");

    return () => {};
  }, [timer]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    scrollToTop();
    return () => {};
  }, []);

  return (
    <Box
      className="pg-successbg"
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          px: 1.5,
          width: "70vh",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          borderRadius: 4,
          background: "white",
          boxShadow: "0px 0px 19px 0px rgba(29,183,67,0.75)",
        }}
      >
        <Typography
          sx={{
            fontSize: "42px",
            color: "green",
          }}
        >
          Payment successfull
        </Typography>

        <video
          loop
          muted
          autoPlay={true}
          controls={false}
          style={{
            width: "300px",
            height: "300px",
          }}
        >
          <source src={success_vdo} type="video/mp4" />
        </video>
        <Typography sx={{ color: primaryColor() }}>
          Please wait while we redirect you to your dashboard in <b>{timer}</b>
          ..
        </Typography>
        <Typography sx={{ fontSize: "16px", fontWeight: "bold", mt: 1 }}>
          OR
        </Typography>
        <Button
          color="success"
          variant="outlined"
          onClick={() => {
            navigate("/customer/dashboard");
          }}
          sx={{
            mt: 1,
            boxShadow: "0px 0px 19px 0px rgba(29,183,67,0.75)",
          }}
        >
          Go to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentSuccess;
