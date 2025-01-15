import React from "react";
import { serviceDown } from "../iconsImports";
import { Grid } from "@mui/material";

const ServiceDown = () => {
  return (
    <Grid container>
      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <img
          src={serviceDown}
          alt="Service down"
          width="65%"
          // style={{ marginTop: "24px" }}
        />
      </Grid>
    </Grid>
  );
};

export default ServiceDown;
