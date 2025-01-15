import { Grid } from "@mui/material";
import React from "react";
import { unauthorized } from "../iconsImports";

const Unauthorized = () => {
  return (
    <Grid container>
      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <img
          src={unauthorized}
          alt="Unauthorized"
          width="70%"
          // style={{ marginTop: "24px" }}
        />
      </Grid>
    </Grid>
  );
};

export default Unauthorized;
