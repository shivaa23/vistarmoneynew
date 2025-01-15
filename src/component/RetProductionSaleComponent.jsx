import React from "react";
import { FormControlLabel, Grid, LinearProgress, Switch, Typography } from "@mui/material";
import { useState } from "react";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import ApiPaginate from "./ApiPaginate";
import { CustomStyles } from "./CustomStyle";
import { apiErrorToast } from "../utils/ToastUtil";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { useEffect } from "react";
import { currencySetter } from "../utils/Currencyutil";
import CheckIcon from "@mui/icons-material/Check";
import BarChartIcon from "@mui/icons-material/BarChart";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import TodayThisLastComponent from "./TodayThisLastComponent";
import MyEarnings from "./dashboard/retailer/MyEarnings";
import Mount from "./Mount";

let refresh;
function refreshFunc(setQueryParams) {
  setQueryParams("");
  if (refresh) refresh();
}
const RetProductionSaleComponent = ({role,USER_ROLES}) => {
  const [txnDataReq, setTxnDataReq] = useState(false);
  const [txnDataDuration, setTxnDataDuration] = useState("TODAY");
  const [apiData, setApiData] = useState([]);
  const [showProductTable, setShowProductTable] = useState(true);
  const [query, setQuery] = useState();
  const [commonSearchTime, setCommonSearchTime] = useState('today');
  const handleChange = (event, newValue) => {
    if (process.env.REACT_APP_TITLE === "DilliPay")
      setTxnDataDuration(newValue);
    else setTxnDataDuration(event);
  };

  const [txnData, setTxnData] = useState([
    {
      name: "SUCCESS",
      balance: "0",
      percent: "0",
      icon: <CheckIcon sx={{ fontSize: "16px" }} />,
      color: " rgb(75, 192, 192)",
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

  const getTxnData = () => {
    postJsonData(
      ApiEndpoints.ADMIN_DASHBOARD_GET_TXN_DATA,
      {
        type: txnDataDuration,
      },
      setTxnDataReq,
      (res) => {
        const data = res.data.data;
        const newData = [...txnData];
        newData.forEach((oldData) => {
          if (oldData.name === "SUCCESS") {
            oldData.balance = data.SUCCESS;
            if (data.SUCCESS === 0) {
              oldData.percent = 0;
            } else {
              oldData.percent = (data.SUCCESS * 100) / data.TOTAL;
            }
          }
          if (oldData.name === "PENDING") {
            oldData.balance = data.PENDING;
            if (data.PENDING === 0) {
              oldData.percent = 0;
            } else {
              oldData.percent = (data.PENDING * 100) / data.TOTAL;
            }
          }
          if (oldData.name === "FAILED") {
            oldData.balance = data.FAILED;
            if (data.FAILED === 0) {
              oldData.percent = 0;
            } else {
              oldData.percent = (data.FAILED * 100) / data.TOTAL;
            }
          }
          if (oldData.name === "TOTAL") {
            oldData.balance = data.TOTAL;
            if (data.TOTAL !== 0) {
              oldData.percent = (data.TOTAL * 100) / data.TOTAL;
            } else {
              oldData.percent = 0;
            }
          }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txnDataDuration]);

  const columns = [
    {
      name: "Services",
      selector: (row) => <Typography  sx={{fontSize:"12px"}}>{row.service}</Typography>,
    },
    {
      name: "Last Month",
      selector: (row) =>  <Typography  sx={{fontSize:"12px"}}>{currencySetter(row.Last)}</Typography>
    },

    {
      name: "This Month",
      selector: (row) =><Typography  sx={{fontSize:"12px"}}> {currencySetter(row.This)}</Typography>,
    },
    {
      name: "Today",
      selector: (row) =><Typography  sx={{fontSize:"12px"}}> {currencySetter(row.Today)}</Typography>,
    },

    {
      name: "Achieved",
      selector: (row) => (
        <div style={{ width: "100px",fontSize:"12px" }}>
          <div>
            {Number(row.Last) === 0
              ? "0.00%"
              : Number((parseInt(row.This) * 100) / parseInt(row.Last)).toFixed(
                  2
                ) + "%"}
          </div>
          <div>
            <LinearProgress
              variant="determinate"
              value={
                Number((parseInt(row.This) * 100) / parseInt(row.Last)) > 100
                  ? 100
                  : Number(row.Last) === 0
                  ? 0
                  : Number((parseInt(row.This) * 100) / parseInt(row.Last))
              }
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
    {/* <HtmlRenderer data={"jhdhcv"}/> */}
     
        <TodayThisLastComponent
         item
          txnDataDuration={txnDataDuration}
          txnDataReq={txnDataReq}
          txnData={txnData}
          getTxnData={getTxnData}
          handleChange={handleChange}
        />
        
     
    <Grid
  container
  sx={{
    
   
    ml:.5,
    pr: { xs: 1.3, lg: 0 },
    mb: { xs: 8, lg: 0 },
  }}
  spacing={2}
    >
     

      {/* product sale card component */}
      <Grid
         item
        //  lg={role === 'Api' ? 12 : 7}
        lg={12}
         md={12}
         sm={12}
         xs={12}
         sx={{
           background: "#fff",
           height: "auto",
           minHeight: { lg:"100px",xs: "160px", md: "180px" },
           borderRadius: "8px",
           boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
          //  mr: { lg: role === "Api" ? 1 : 0 },
          mr: 2
            
            
         }}
      >
        <Grid
           item
           sx={{
             display: "flex",
             justifyContent: "space-between",
             alignItems: "center",
             marginBottom: "1rem",
             
             flexDirection: { xs: "column", md: "row" },
           }}
        >
          <Typography
            style={{
              fontWeight: "500",
              fontSize: "16px",
              display: "flex",
              alignContent: "center",
            }}
          >
            {showProductTable ? "Product Sale" : "My Earnings"}
            <CachedOutlinedIcon
              className="ms-2 refresh-purple"
              sx={{
                ml: 1,
              }}
              onClick={() => {
                refreshFunc(setQuery);
              }}
            />
          </Typography>
          {/* Integrate your toggle button here */}
          <FormControlLabel control={<Switch />} label={showProductTable ? "My Earning" : "Product Table"} onChange={() => setShowProductTable(!showProductTable)} />
        </Grid>
        {/* product sale table */}
        
       
        <Grid
  item
  sx={{ minHeight: { md: "330px", sm: "170px", xs: "170px" },p:1,ml:-2 ,mb:2,mt:1 }} // Set p to a smaller value
>
  {showProductTable ?
  (<ApiPaginate
    apiEnd={ApiEndpoints.GET_RET_PROD_SALE}
    columns={columns}
    apiData={apiData}
    tableStyle={CustomStyles}
    setApiData={setApiData}
    ExpandedComponent=""
    queryParam={query ? query : ""}
    returnRefetch={(ref) => {
      refresh = ref;
    }}
    paginate={false}
  />)
  :
  <Mount
      visible={
        role !== USER_ROLES.ASM &&
        role !== USER_ROLES.ACC &&
        role !== USER_ROLES.API
      }
      sx={{
        // pt: 2
      }}
    >
      <MyEarnings txnDataDuration={txnDataDuration} handleChange={handleChange}/>
    </Mount>}
</Grid>

       
      </Grid>
      {/* <Grid
    item
    lg={5}
    md={7}
    sm={12}
    xs={12}
    sx={{ minHeight: { md: "350px", sm: "180px", xs: "180px" } }}
  >
    <Mount
      visible={
        role !== USER_ROLES.ASM &&
        role !== USER_ROLES.ACC &&
        role !== USER_ROLES.API
      }
    >
      <MyEarnings txnDataDuration={txnDataDuration} handleChange={handleChange}/>
    </Mount>
  </Grid> */}
      {/* <RightNavbar/> */}
      {/* transactions card component */}
      
    </Grid>
  </>
  );
};

export default RetProductionSaleComponent;
