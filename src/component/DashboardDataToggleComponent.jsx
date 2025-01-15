import { Box, Button } from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import {
  primaryColor,
  secondaryColor,
  primaryLight,
} from "../theme/setThemeColor";

const DashboardDataToggleComponent = ({ setGraphDuration, getTxnData }) => {
  const [isActive, setIsActive] = useState("TODAY");

  useEffect(() => {
    getTxnData();
  }, [isActive]);

  return (
    <Box
      sx={{
        display: "flex",
        "& .MuiButton-root": { mx: 0.5 },
      }}
    >
      <Button
        variant="outlined"
        sx={{
          background:
            isActive && isActive === "TODAY" ? primaryColor() : "#fff",
          fontWeight: "bold",
          border: "1px solid" + primaryColor(),
          color: isActive && isActive === "TODAY" ? "#fff" : primaryColor(),
          "&:hover": {
            border: "1px solid" + primaryColor(),
            color: "#fff",
            background: primaryColor(),
          },
        }}
        onClick={() => {
          setIsActive("TODAY");
          setGraphDuration("TODAY");
        }}
      >
        Today
      </Button>
      <Button
        variant="outlined"
        color="warning"
        sx={{
          background: isActive && isActive === "THIS" ? primaryColor() : "#fff",
          fontWeight: "bold",
          border: "1px solid" + secondaryColor(),
          color: isActive && isActive === "THIS" ? "#fff" : secondaryColor(),
          "&:hover": {
            border: "1px solid" + secondaryColor(),
            color: "#fff",
            background: secondaryColor(),
          },
        }}
        onClick={() => {
          setGraphDuration("THIS");
          setIsActive("THIS");
        }}
      >
        This
      </Button>
      <Button
        variant="outlined"
        sx={{
          // 00bf78
          background: isActive && isActive === "LAST" ? primaryColor() : "#fff",
          fontWeight: "bold",
          border: "1px solid" + primaryLight(),
          color: isActive && isActive === "LAST" ? "#fff" : primaryLight(),
          "&:hover": {
            border: "1px solid" + primaryLight(),
            color: "#fff",
            background: primaryLight(),
          },
        }}
        onClick={() => {
          setGraphDuration("LAST");
          setIsActive("LAST");
        }}
      >
        Last
      </Button>
      {/* <ToggleButtonGroup
        orientation="horizontal"
        value={graphDuration}
        exclusive
        onChange={handleChange}
      >
        <ToggleButton
        value="TODAY"
        aria-label="list"
        className="custome-toggle cm-hover"
      >
        Today
      </ToggleButton>
        <ToggleButton
          value="THIS"
          aria-label="module"
          className="custome-toggle cm-hover"
        >
          This
        </ToggleButton>
        <ToggleButton
          value="LAST"
          aria-label="quilt"
          className="custome-toggle cm-hover"
        >
          Last
        </ToggleButton>
      </ToggleButtonGroup> */}
    </Box>
  );
};

export default DashboardDataToggleComponent;
