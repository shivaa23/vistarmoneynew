import { Box, Grid, IconButton } from "@mui/material";
import React from "react";
import RetTxnCardComponent from "./RetTxnCardComponent";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  primaryColor,
  secondaryColor,
  primaryLight,
} from "../theme/setThemeColor";
import Loader from "../component/loading-screen/Loader";
import { useState } from "react";
// tab styles . .  .
export const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    variant="scrollable" // Ensures tabs are scrollable on smaller screens
    scrollButtons="auto" // Shows scroll buttons automatically when needed
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  padding: "8px 8px", // Reduced padding
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 80,
    width: "0px",
    backgroundColor: "#ffffff",
  },
});

export const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  () => ({
    color: "#fff",
    fontSize: "14px",
    minHeight: "15px",
    minWidth: "25px",
    padding: "8px 6px", // Reduced padding
    borderRadius: "4px",
    "&.Mui-selected": {
      color: "#fff",
      backgroundColor: `hsla(0,0%,100%,.2)`,
      transition: `background-color .3s .2s`,
    },
    "&.Mui-focusVisible": {
      backgroundColor: "rgba(100, 95, 228, 0.32)",
    },
  })
);

const TodayThisLastComponent = ({
  txnDataDuration,
  txnDataReq,
  txnData,
  getTxnData,
  handleChange,
}) => {
  const [isActive, setIsActive] = useState("TODAY");
  return (
    <div>
      <Grid
        item
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          flexDirection: { xs: "column", md: "row" },
        }}
      ></Grid>

      {/* filter tabs component */}
      <Grid container>
        {/* First Grid with Tabs */}
        <Grid
          item
          xs={12}
          sm={12}
          md={4}
          lg={3}
          sx={{
            color: "black",
            marginBottom: "0.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <StyledTabs
            value={txnDataDuration || "TODAY"}
            onChange={handleChange}
            // onChange={(value) => setCommonSearchTime(value)}
            indicatorColor="secondary"
            aria-label="full width tabs example"
          >
            <StyledTab
              label="TODAY"
              value="TODAY"
              sx={{
                color: primaryColor(),
                fontWeight: "bold",
                px: 1,
                // mx: 0.7,
                border: "1px solid" + primaryColor(),
                textTransform: "none",

                backgroundColor: "transparent",
                "&.Mui-selected": {
                  backgroundColor: primaryColor(),
                  color: "white",
                },
                "&:hover": {
                  border: "1px solid" + primaryColor(),
                  backgroundColor: primaryColor(),
                  color: "#fff",
                },
              }}
            />

            <StyledTab
              label="THIS"
              value="THIS"
              sx={{
                color: primaryColor(),
                fontWeight: "bold",
                textTransform: "none",
                px: 1,
                mx: 0.7,
                border: "1px solid" + secondaryColor(),
                backgroundColor: "transparent",
                "&.Mui-selected": {
                  backgroundColor: primaryColor(),
                  color: "white",
                },
                "&:hover": {
                  border: "1px solid" + secondaryColor(),

                  backgroundColor: primaryColor(),
                  color: "#fff",
                },
              }}
            />
            <StyledTab
              label="LAST"
              value="LAST"
              sx={{
                color: primaryColor(),
                fontWeight: "bold",
                textTransform: "none",
                px: 1,
                border: "1px solid" + primaryLight(),
                backgroundColor: "transparent",
                "&.Mui-selected": {
                  backgroundColor: primaryColor(),
                  color: "white",
                },
                "&:hover": {
                  border: "1px solid" + primaryLight(),
                  backgroundColor: primaryColor(),
                  color: "#fff",
                },
              }}
            />
          </StyledTabs>
        </Grid>

        {/* Second Grid with Marquee */}
        <Grid
          item
          xs={12}
          sm={12}
          md={8}
          lg={9}
          sx={{
            marginTop: { xs: "1rem" },
            textAlign: "center",

            borderRadius: "8px",
            backgroundColor: "#fEDCDB",
            marginTop: "0.34%",
            color: "#004080",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "0.8rem",
          }}
        >
          {/* <IconButton sx={{ textAlign: "flex-start", color: "#003776" }}>
            <Icon icon="icon-park-outline:speaker-one" width={22} height={22} />
          </IconButton> */}

          <marquee behavior="scroll" direction="left">
            Digital payments are growing faster than ever! UPI is leading the
            way, making transactions quick and easy for millions.
          </marquee>

          {/* <IconButton sx={{ textAlign: "flex-end", color: "#003776" }}>
            <Icon icon="oui:cross-in-circle-empty" width={22} height={22} />
          </IconButton> */}
        </Grid>
      </Grid>

      {/* success fail cards mapping */}
      <Grid
        container
        sx={{
          alignItems: "center",
          marginBottom: "1rem",
          flexDirection: {
            xs: "column",
            sm: "column",
            md: "column",
            lg: "row",
          },
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {txnDataReq && <Loader loading={txnDataReq} circleBlue />}
        {txnData?.length > 0 &&
          txnData.map((item, index) => (
            <Box
              key={index}
              sx={{
                mt: -2.3,
                width: {
                  xs: "100%",
                  sm: "100%",
                  md: "100%",
                  lg: "calc(25% - 16px)",
                },
                maxWidth: "100%",
                boxSizing: "border-box",
                flexGrow: 1,
              }}
            >
              <RetTxnCardComponent item={item} />
            </Box>
          ))}
      </Grid>
    </div>
  );
};

export default TodayThisLastComponent;
