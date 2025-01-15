import React from "react";
import { useState } from "react";
import FareDetailRulesTab from "./FareDetailRulesTab";
import FlightInformationTab from "./FlightInformationTab";
import { TabContext, TabPanel } from "@mui/lab";
import { AppBar, Box, Tab, Tabs } from "@mui/material";
import BaggageInfoTab from "./BaggageInfoTab";
import CancellationRule from "./CancellationRule";
import MoreFareComponent from "./MoreFareComponent";
import { closeIcon } from "../../iconsImports";
import Mount from "../Mount";
import { getHoverActive } from "../../theme/setThemeColor";

const FlightDetailComponent = ({ legs, data }) => {
  const [showFlightDetails, setShowFlightDetails] = useState(false);
  const [detailType, setDetailType] = useState("0");
  const [optionType, setOptionType] = useState("");

  const handleFlightDetail = () => {
    setShowFlightDetails(!showFlightDetails);
  };
  const handleDetailTabType = (event, newValue) => {
    setDetailType(newValue);
  };
  const handleOptionSelectType = (event, newValue) => {
    setOptionType(newValue);
  };

  return (
    <>
      {/*#############################################*/}
      {/* FLIGHT DETAILS SECTION #################### */}
      {/*#############################################*/}
      <TabContext
        value={optionType}
        sx={{
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.15)",
        }}
      >
        <div
          id="divFlightDetailSec0"
          className="sort-by-section fltdtl"
          style={{
            position: "relative",
          }}
        >
          <OptionTabs
            optionType={optionType}
            handleOptionSelectType={handleOptionSelectType}
          />
          {/* TABS */}
          <TabPanel value="0" sx={tabStyle1}>
            <TabContext
              value={detailType}
              sx={{
                boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.15)",
              }}
            >
              <DetailTabs
                detailType={detailType}
                handleDetailTabType={handleDetailTabType}
                handleFlightDetail={handleFlightDetail}
              />
              <TabPanel value="0" sx={tabStyle}>
                <FlightInformationTab legs={legs} />
              </TabPanel>
              <TabPanel value="1" sx={tabStyle}>
                <FareDetailRulesTab legs={legs} data={data} />
              </TabPanel>
              <TabPanel value="2" sx={tabStyle}>
                <BaggageInfoTab legs={legs} />
              </TabPanel>
              <TabPanel value="3" sx={tabStyle}>
                <CancellationRule legs={legs} data={data} />
              </TabPanel>
            </TabContext>
          </TabPanel>
          <TabPanel value="1" sx={tabStyle1}>
            <MoreFareComponent />
          </TabPanel>

          {/* ############################## */}
          {/* ##### CLOSE BUTTON IMAGE ##### */}
          {/* ############################## */}
          <Mount visible={optionType}>
            <Box
              sx={{
                position: "absolute",
                top: "8px",
                right: "1px",
                "&:hover": {
                  cursor: "pointer",
                },
              }}
              onClick={() => {
                setOptionType("");
              }}
            >
              <img
                src={closeIcon}
                alt="Close Icon"
                style={{
                  width: "20px",
                  height: "20px",
                }}
              />
            </Box>
          </Mount>
        </div>
      </TabContext>
    </>
  );
};

export default FlightDetailComponent;

function OptionTabs({ optionType, handleOptionSelectType }) {
  return (
    <Tabs
      value={optionType}
      textColor="inherit"
      indicatorColor="secondary"
      onChange={handleOptionSelectType}
      aria-label="option detail full width tabs"
    >
      <Tab value="0" label="Flight Detail" />
      <Tab value="1" label="+ More Fare" />
    </Tabs>
  );
}

function DetailTabs({ detailType, handleDetailTabType }) {
  return (
    <AppBar position="static">
      <Tabs
        value={detailType}
        textColor="inherit"
        variant="scrollable"
        indicatorColor="secondary"
        onChange={handleDetailTabType}
        aria-label="flight detail full width tabs"
        style={{ position: "relative", background: getHoverActive() }}
      >
        <Tab value="0" label="Flight Information" />
        <Tab value="1" label="Fare Details & Rules" />
        <Tab value="2" label="Baggage Information" />
        <Tab value="3" label="Cancellation & Change Rule" />
      </Tabs>
    </AppBar>
  );
}
const tabStyle = {
  p: 0,
  px: 3,
  backgroundColor: "#F2F2F2",
};
const tabStyle1 = {
  p: 0,
  px: 0,
  backgroundColor: "#F2F2F2",
};
