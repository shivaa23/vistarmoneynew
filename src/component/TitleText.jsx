import { Typography } from "@mui/material";
import React from "react";
import { primaryColor } from "../theme/setThemeColor";

const TitleText = ({ text }) => {
  return (
    <div>
      <Typography
        variant="h6"
        sx={{
          fontFamily: "Poppins",
          fontSize: "20px",
          fontWeight: "550",
          display: "flex",
          alignItems: "center",
          color: primaryColor(),
          justifyContent: "center",
          marginBottom: "16px",
          marginTop: "16px",
        }}
      >
        {text}
      </Typography>
    </div>
  );
};

export default TitleText;
