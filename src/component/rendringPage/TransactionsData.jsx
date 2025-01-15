import React, { useState, useEffect } from 'react';
import { Box, Grid } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import BarChartIcon from "@mui/icons-material/BarChart";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

// import RetTxnCardComponent from "./RetTxnCardComponent"
import RetTxnCardComponent from '../RetTxnCardComponent';

import { postJsonData } from '../../network/ApiController';
import ApiEndpoints from '../../network/ApiEndPoints';
import { apiErrorToast } from '../../utils/ToastUtil';
import Loader from "../loading-screen/Loader"; 
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { StyledTab } from '../TodayThisLastComponent';




const TransactionsData = () => {
  const [txnDataReq, setTxnDataReq] = useState(false);
  const [txnDataDuration, setTxnDataDuration] = useState("TODAY");
  const [txnData, setTxnData] = useState([
    {
      name: "SUCCESS",
      balance: "0",
      percent: "0",
      icon: <CheckIcon sx={{ fontSize: "16px" }} />,
      color: "rgb(75, 192, 192)",
      bgColor: "rgb(75, 192, 192 , 0.20)",
    },
    {
      name: "PENDING",
      balance: "0",
      percent: "0",
      icon: <PriorityHighOutlinedIcon sx={{ fontSize: "16px" }} />,
      color: "rgba(255, 204, 86)",
      bgColor: "rgb(255, 204, 86 , 0.20)",
    },
    {
      name: "FAILED",
      balance: "0",
      percent: "0",
      icon: <CloseOutlinedIcon sx={{ fontSize: "16px" }} />,
      color: "rgba(255, 99, 133)",
      bgColor: "rgb(255, 99, 133 , 0.20)",
    },
    {
      name: "TOTAL",
      balance: "0",
      percent: "0",
      icon: <BarChartIcon sx={{ fontSize: "16px" }} />,
      color: "rgb(153, 102, 255)",
      bgColor: "rgb(153, 102, 255 , 0.20)",
    },
  ]);
  const handleChange = (event, newValue) => {
    if (process.env.REACT_APP_TITLE === "DilliPay")
      setTxnDataDuration(newValue);
    else setTxnDataDuration(event);
  };

  const getTxnData = () => {
    postJsonData(
      ApiEndpoints.ADMIN_DASHBOARD_GET_TXN_DATA,
      { type: txnDataDuration },
      setTxnDataReq,
      (res) => {
        const data = res.data.data;
        const newData = txnData.map((oldData) => {
          const updatedData = { ...oldData };
          if (updatedData.name === "SUCCESS") {
            updatedData.balance = data.SUCCESS;
            updatedData.percent = data.SUCCESS ? (data.SUCCESS * 100) / data.TOTAL : 0;
          }
          if (updatedData.name === "PENDING") {
            updatedData.balance = data.PENDING;
            updatedData.percent = data.PENDING ? (data.PENDING * 100) / data.TOTAL : 0;
          }
          if (updatedData.name === "FAILED") {
            updatedData.balance = data.FAILED;
            updatedData.percent = data.FAILED ? (data.FAILED * 100) / data.TOTAL : 0;
          }
          if (updatedData.name === "TOTAL") {
            updatedData.balance = data.TOTAL;
            updatedData.percent = data.TOTAL ? 100 : 0;
          }
          return updatedData;
        });

        setTxnData(newData);
      },
      (err) => {
        apiErrorToast(err);
        setTxnData([]);
      }
    );
  };

  useEffect(() => {
    getTxnData();
  }, [txnDataDuration]);
 

  return (
    <>
    
      {txnDataReq && <Loader loading={txnDataReq} circleBlue />}
      <Grid
        container
        sx={{
          alignItems: "center",
          marginBottom: "1rem",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {txnData.map((item, index) => (
          <Box
            key={index}
            sx={{
              width: { xs: "100%", sm: "auto", md: "calc(25% - 16px)" },
              maxWidth: "100%",
              boxSizing: "border-box",
              flexGrow: 1,
            }}
          >
            <RetTxnCardComponent item={item} />
          </Box>
        ))}
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          width: "12%",
          backgroundImage: `linear-gradient(
            135deg,
            hsl(255deg 28% 31%) 0%,
            hsl(261deg 22% 47%) 57%,
            hsl(266deg 32% 64%) 100%
          )`,
          borderTopRightRadius: "4px",
          borderTopLeftRadius: "4px",
        }}
      >
         <StyledTabs
          value={txnDataDuration}
          onChange={handleChange}
          indicatorColor="secondary"
         
          scrollButtons="auto"
          aria-label="full width tabs example"
        >
          <StyledTab label="TODAY" value="TODAY" />
          <StyledTab label="THIS" value="THIS" />
          <StyledTab label="LAST" value="LAST" />
        </StyledTabs>
       </Grid> 
    </>
  );
};

export default TransactionsData;
export const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  // borderRadius: "4px",
  padding: "12px 10px",
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