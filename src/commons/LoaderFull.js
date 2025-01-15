import React from "react";
import { Backdrop, Typography } from "@mui/material";
import flightSvg from "../assets_travel/images/flight.svg";

const LoaderFull = ({
  loading = false,
  text = "loading....",
  blur = 3,
  textColor = "#ffffff",
  opacity = 80,
  circle = false,
}) => {
  return (
    <Backdrop
      sx={{
        zIndex: "100000",
        height: "100%",
        width: "100%",
        backgroundColor: `#000000${opacity}`,
        backdropFilter: `blur(${blur}px)`,
      }}
      open={loading}
    >
      {circle ? (
        <div class="circle-blue"></div>
      ) : (
        <img src={flightSvg} alt="flightSvg" />
      )}
      <Typography
        variant="h6"
        sx={{
          ml: 2,
          mt: 1,
          fontWeight: "normal",
          width: "300px",
          color: `${textColor} !important`,
        }}
      >
        {text}
      </Typography>
    </Backdrop>
  );
};

export default LoaderFull;
