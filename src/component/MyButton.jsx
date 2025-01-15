import { Button, Typography } from "@mui/material";
import React from "react";
import Loader from "../component/loading-screen/Loader";

const MyButton = ({
  icon,
  endIcon,
  text = "button",
  textColor = "",
  bgColor = "",
  onClick,
  hidden = false,
  p = 1,
  mx = 0,
  mr = 0,
  ml = 0,
  mt = 0,
  mb = 0,
  loading = false,
  form = "",
  type = "",
  disabled = false,
  positionBottom = false,
  size = "medium",
  red = false,
  purple = false,
  redOutline = false,
  hoverOrange = false,
  green = false,
  color = "",
  width = "",
  focus = false,
}) => {
  return (
    <span hidden={hidden}>
      <Button
        className={`d-flex align-items-center ${
          disabled || hoverOrange
            ? "otp-hover-orange"
            : red
            ? "actual-button-red"
            : redOutline
            ? "button-red-outline"
            : purple
            ? "btn-background-red"
            : green
            ? "button-green-bold"
            : "otp-hover-purple"
        } ${positionBottom ? "bottom-right-positon" : ""}`}
        onClick={onClick}
        sx={{
          mx: mx && mx,
          mr: mr && mr,
          ml: ml && ml,
          mt: mt && mt,
          mb: mb && mb,
          p: p && p,

          color: textColor,
          "&:hover": {
            cursor: disabled && "not-allowed",
          },
          "&:disabled": {
            background: "#d1d1d1",
          },
        }}
        form={form}
        type={type}
        disabled={disabled}
        size={size}
      >
        {<span>{icon && !loading && icon}</span>}
        <span>{icon && loading && <Loader loading={loading} />}</span>
        <span className="d-flex align-items-center">
          <Typography
            sx={{
              marginLeft: icon ? "8px" : "",
              // marginRight: "4px",
              // display: { xs: "none", md: "block" },
              fontSize: "12px",
              textTransform: "capitalize",
            }}
          >
            {text}
          </Typography>
        </span>
        {endIcon && <span>{endIcon}</span>}
      </Button>
    </span>
  );
};

export default MyButton;
