import React from "react";
import BarChartIcon from "@mui/icons-material/BarChart";
import { Grid, Tooltip, Typography } from "@mui/material";
import Loader from "../component/loading-screen/Loader";

const RetDashboardWalletComponent = ({
  users,
  data,
  index,
  len,
  getWalletBal,
  walletReq,
}) => {
  const apiRefresh = () => {
    if (
      (users && users.name.toLowerCase() === "wallet1 balance") ||
      users.name.toLowerCase() === "wallet2 balance"
    ) {
      if (getWalletBal) getWalletBal();
    }
    // } else if (users && users.name.toLowerCase() === "bank balance") {
    //   if (getBankBal) getBankBal();
    // }
  };

  return (
    <Grid
      container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRight: {
          lg:
            data === "txn" ? "" : index === len - 1 ? "" : "1px solid #DADADA",
          md:
            data === "txn" ? "" : index === len - 1 ? "" : "1px solid #DADADA",
          xs: "",
          sm: "",
        },
      }}
      className="chart position-relative"
    >
      {(index === 2 || index === 3) && data === "wallet" && (
        <Loader loading={walletReq} circleBlue />
      )}
      <Grid item>
        <div
          style={{
            fontSize: data === "txn" ? "15px" : "",
          }}
        >
          {users.name}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => apiRefresh()}
        >
          <BarChartIcon sx={{ mr: 1, color: users.color }} />
          <Tooltip title={"\u20B9" + users.balance}>
            <Typography sx={{ fontSize: data === "txn" ? "18px" : "24px" }}>
              {data === "txn"
                ? users.balance
                : Number(users.balance / 100000).toFixed(2)}
            </Typography>
          </Tooltip>
        </div>
      </Grid>
    </Grid>
  );
};

export default RetDashboardWalletComponent;
