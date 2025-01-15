import { Box, Typography } from "@mui/material";
import React from "react";

const HNavButton = ({ item }) => {
  return (
    <>
      <Box sx={{ mb: 0.5 }}>
        <img src={item.icon} alt={item.title} style={{ width: "80px" }} />
        {/* <span>{item.icon}</span> */}
        <Typography
          sx={{
            textTransform: "none",
            color: "#000",
            fontSize: "13px",
            fontWeight: "600",
            opacity: "0.7",
            mt: 2,
          }}
        >
          {item.title}
        </Typography>
      </Box>
    </>
  );
};

export default HNavButton;
