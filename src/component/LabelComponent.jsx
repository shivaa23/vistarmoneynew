import { Typography } from "@mui/material";
import React from "react";

const LabelComponent = ({ label = "Name", fontSize = "13px" }) => {
  return (
    <Typography
      sx={{
        textAlign: "left",
        opacity: "0.4",
        fontWeight: "600",
        fontSize: fontSize,
        mb: 0.5,
      }}
    >
      {label}
    </Typography>
  );
};

export default LabelComponent;
