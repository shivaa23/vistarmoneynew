import React from "react";
import { Grid, Typography } from "@mui/material";
import { useState } from "react";
import { 
  noDataIllustrator
 } from "../iconsImports";

const NoDataView = ({ msg }) => {
  const [timer, setTimer] = useState(true);
  setTimeout(() => {
    setTimer(false);
  }, 100);
  return (
    <>
      <Grid container hidden={timer}>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <img
            src={noDataIllustrator}
            alt="no_data"
            width="40%"
            // style={{ marginTop: "24px" }}
          />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center", mb: "24px" }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Poppins",
              color: "#0077b6",
              fontWeight: "500",
            }}
          >
            {/* You do not have any Record as of now! */}
            {msg && msg ? (
              <div>{msg}</div>
            ) : (
" No data found !"
            )}
          </Typography>
        </Grid>
      </Grid>
      <h4 className="fw-bold mt-4" hidden={!timer}>
        {/* <Loader loading={timer} dots /> */}
        Please Wait . . .
      </h4>
    </>
  );
};

export default NoDataView;
