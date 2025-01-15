import { Box, Grid } from "@mui/material";
import React from "react";
import AdminWalletBalanceComponent from "./AdminWalletBalanceComponent";
import AsmProductionSaleComponent from "./AsmProductionSaleComponent";
import DashboardDataComponent2 from "./DashboardDataComponent2";
import DashboardDataToggleComponent from "./DashboardDataToggleComponent";
import ProductionSaleComponent from "./ProductionSaleComponent";
import Loader from "../component/loading-screen/Loader";
import TrafficSourcesChart from "../TrafficSourcesChart";
import { useLocation } from "react-router-dom";
import NewsSection from "./NewsSection";

const AdminDashboard = ({
  graphDuration,
  setGraphDuration,
  user,
  request,
  setRefresh,
  refresh,
  userData,
  graphRequest,
  setGraphRequest,
  getTxnData,
  txnDataReq,
  txnData,
  transactionData,
}) => {
  const location = useLocation();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* user by roles cards */}
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "start",
        }}
      >
        <Grid xs={12} md={2.5} lg={2.5} sx={{ ml: 2, mb: 0.5 }} item>
          <DashboardDataToggleComponent
            graphDuration={graphDuration}
            setGraphDuration={setGraphDuration}
            getTxnData={getTxnData}
          />
        </Grid>
        {location.pathname === "/admin/dashboard" && (
          <Grid item xs={12} sm={12} md={9.3} lg={8.8} sx={{ ml: 2, mb: 0.5 }}>
            <NewsSection />
          </Grid>
        )}
      </Grid>
      <AdminWalletBalanceComponent graphDuration={graphDuration} />
      <Grid container spacing={2} sx={{ ml: 0.8 }}>
        {" "}
        {/* Add spacing between Grid items */}
        <Grid item xs={12} md={7.8} sx={{ mt: 1 }}>
          <ProductionSaleComponent
            graphDuration={graphDuration}
            setGraphDuration={setGraphDuration}
            graphRequest={graphRequest}
            setGraphRequest={setGraphRequest}
          />
        </Grid>
        {user.role === "Admin" ? (
          <Grid
            item
            xs={12}
            md={3.8}
            sx={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              mt: 3.8,
              ml: 1,
              padding: "1rem",
              boxShadow:
                "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
              // width: { lg: "100%", md: "100%", sm: "100%" },
              // ml: { lg: "0", md: "0", xs: "0" },
              // mr: { lg: "1.5%", md: 0, xs: 0 },
            }}
          >
            <TrafficSourcesChart
              transactionData={txnData}
              refreshFunc={getTxnData}
              request={request}
            />
          </Grid>
        ) : (
          <Grid
            item
            lg={4}
            md={4}
            sm={11.8}
            xs={11.2}
            sx={{
              background: "#fff",
              borderRadius: "8px",
              padding: "1.3rem",
              height: "auto",
              boxShadow:
                "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
              ml: { lg: 1, md: 1, sm: 0, xs: 0 },
              mt: { md: 4, xs: 1, sm: 1, lg: 4 },
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
              <TrafficSourcesChart transactionData={txnData} />
            </Grid>
            {/* <Grid
    item
    sx={{
      alignItems: "center",
      marginBottom: "1rem",
      flexDirection: { xs: "column", md: "row" },
    }}
    className="position-relative"
  >
    <Loader loading={txnDataReq} />
    {txnData &&
      txnData.map((item) => {
        return <RetTxnCardComponent item={item} key={item.id} />; // Ensure you have a unique key
      })}
  </Grid> */}
          </Grid>
        )}
      </Grid>

      <Grid
        container
        justifyContent="flex-start" // Aligns children to the end
      >
        {user && user.role !== "Asm" && user.role !== "Zsm" ? (
          <Grid item lg={7.8} md={7.8} sm={11.8} xs={11.2} sx={{ mt: 1.6 }}>
            {" "}
            {/* Adjust width here */}
            <AsmProductionSaleComponent />
            {/* <ProductSaleLineChart/> */}
          </Grid>
        ) : (
          <></>
          // <Grid
          //   item
          //   lg={3.3}
          //   md={3.3}
          //   sm={11.8}
          //   xs={11.2}
          //   sx={{
          //     background: "#fff",
          //     borderRadius: "8px",
          //     padding: "1.3rem",
          //     height: "auto",
          //     boxShadow:
          //       "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
          //     ml: { lg: 1, md: 1, sm: 0, xs: 0 },
          //     mt: { md: 2, xs: 1, sm: 1, lg: 2 },
          //   }}
          // >
          //   <Grid
          //     item
          //     sx={{
          //       display: "flex",
          //       justifyContent: "space-between",
          //       alignItems: "center",
          //       marginBottom: "1rem",
          //       flexDirection: { xs: "column", md: "row" },
          //     }}
          //   >
          //     <Typography
          //       style={{
          //         fontWeight: "500",
          //         fontSize: "18px",
          //         display: "flex",
          //         alignContent: "center",
          //       }}
          //     >
          //       {graphDuration === "TODAY"
          //         ? "Today's"
          //         : graphDuration === "LAST"
          //         ? "Last Month's"
          //         : graphDuration === "THIS"
          //         ? "This Month's"
          //         : ""}
          //       Transactions
          //       <CachedOutlinedIcon
          //         className="ms-2 rotate-on-hover"
          //         sx={{
          //           transform: "scale(1)",
          //           transition: "0.5s",
          //           "&:hover": { transform: "scale(1.2)" },
          //           ml: 1,
          //         }}
          //         onClick={() => {
          //           if (getTxnData) {
          //             getTxnData();
          //           }
          //         }}
          //       />
          //     </Typography>
          //   </Grid>
          //   <Grid
          //     item
          //     sx={{
          //       alignItems: "center",
          //       marginBottom: "1rem",
          //       flexDirection: { xs: "column", md: "row" },
          //     }}
          //     className="position-relative"
          //   >
          //     <Loader loading={txnDataReq} />
          //     {txnData &&
          //       txnData.map((item) => {
          //         return <RetTxnCardComponent item={item} key={item.id} />; // Ensure you have a unique key
          //       })}
          //   </Grid>
          // </Grid>
        )}
        {user && user.role !== "Asm" && user.role !== "Zsm" && (
          <Grid
            container
            columnSpacing={1.5}
            md={3.8}
            sm={6}
            xs={6}
            lg={3.8}
            sx={{
              display: "flex",
              justifyContent: "left",
              alignItems: "left",
              ml: 2.3,
              my: { md: 1, lg: 2, xs: 1, sm: 1 },
              background: "#fff",
              borderRadius: "8px",
              padding: "1rem",
              boxShadow:
                "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
            }}
            className="big-screen-box small-screen-box line-chart"
          >
            <Loader loading={request} />
            {userData &&
              userData.map((item, index) => {
                return <DashboardDataComponent2 users={item} key={index} />;
              })}
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
