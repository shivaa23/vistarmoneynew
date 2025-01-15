import React from "react";
import FlightListContainer from "../../component/Travel/FlightListContainer";
import { Box } from "@mui/material";

const FlightBooking = () => {
  return (
    <Box
      sx={{
        px: { xs: 2, md: 6 },
        position: "relative",
      }}
    >
      <FlightListContainer />
    </Box>
  );
};

export default FlightBooking;