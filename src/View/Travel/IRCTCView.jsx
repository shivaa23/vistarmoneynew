import { Button, Grid } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const IRCTCView = () => {
  //   const navigate = useNavigate();
  return (
    <Grid
      container
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Grid item md={12} className="irctc-view"></Grid>
    </Grid>
  );
};

export default IRCTCView;