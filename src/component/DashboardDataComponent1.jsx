import React from "react";
import {
  Box,
  Card,
  Grid,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import Loader from "./loading-screen/Loader";
import { currencySetter } from "../utils/Currencyutil";
import RefreshIcon from "@mui/icons-material/Refresh";
import MyEarningsModal from "../modals/admin/MyEarningsModal";
import { useState } from "react";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import { useRef } from "react";
import Spinner from "./loading-screen/Spinner";

const DashboardDataComponent1 = ({
  users,
  data,
  index,
  len,
  w1 = "",
  w2 = "",
  getWalletBal,
  getBankBal,

  getAPIBal,
  apiBalancesData,
  getPrimaryBalance,
  getTertiaryBalance,

  walletReq,
  bankBalReq,
  apiBalReq,
  PrimaryRequest = false,
  TertiaryRequest = false,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const apiBalRef = useRef();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const apiRefresh = () => {
    if (users && users.name.toLowerCase() === "wallet balance") {
      if (getWalletBal) getWalletBal();
    } else if (users && users.name.toLowerCase() === "bank balance") {
      if (getBankBal) getBankBal();
    } else if (users && users.name.toLowerCase() === "api balances") {
      if (getAPIBal) getAPIBal();
    } else if (users && users.name.toLowerCase() === "primary") {
      if (getPrimaryBalance) getPrimaryBalance();
    } else if (users.name.toLowerCase() === "tertiary") {
      if (getTertiaryBalance) getTertiaryBalance();
    }
  };

  return (
    <Grid
      lg={12}
      container
      sx={{
        display: "flex",
        alignItems: "flex-start",
        borderRadius: "10px",
        position: "relative", // Set position to relative

        borderRight: {
          lg:
            data === "txn" ? "" : index === len - 1 ? "" : "1px solid #DADADA",
          md:
            data === "txn" ? "" : index === len - 1 ? "" : "1px solid #DADADA",
          xs: "",
          sm: "",
        },
      }}
    >
      {index === 0 && data === "wallet" && <Spinner loading={PrimaryRequest} />}
      {index === 1 && data === "wallet" && (
        <Spinner loading={TertiaryRequest} />
      )}
      {/* {index === 2 && data === "wallet" && <Spinner loading={walletReq} />} */}
      {index === 2 && data === "wallet" && <Spinner loading={walletReq} />}
      {index === 3 && data === "wallet" && (
        // <Spinner loading={bankBalReq ? bankBalReq : false} />
        <Spinner loading={bankBalReq} />
      )}
      {index === 4 && data === "wallet" && (
        // <Loader loading={apiBalReq ? apiBalReq : false} />
        <Spinner loading={apiBalReq} />
      )}
      <Grid
        item
        onClick={() => users.name !== "API Balances" && apiRefresh()}
        sx={{ "&:hover": { cursor: "pointer" }, width: "100%" }}
      >
        <div
          style={{
            fontSize: data === "txn" ? "25px" : "",
          }}
          onClick={() => users.name === "API Balances" && apiRefresh()}
        >
          {users.name}{" "}
          {data !== "txn" && (
            <RefreshIcon className="refresh-purple" sx={{ fontSize: "17px" }} />
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
          onClick={(e) => {
            if (users.name === "API Balances") {
              handleMenu(e);
            }
          }}
        >
          <Tooltip
            title={
              data === "txn" ? (
                ""
              ) : users.name === "Wallet Balance" ? (
                <>
                  <div>w1: {currencySetter(w1)}</div>
                  <div>w2: {currencySetter(w2)}</div>
                </>
              ) : (
                currencySetter(users.balance)
              )
            }
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                marginLeft: "6%",
              }}
            >
              <Typography sx={{ fontSize: data === "txn" ? "16px" : "22px" }}>
                {data === "txn"
                  ? users.balance
                  : Number(users.balance / 10000000).toFixed(2)}
              </Typography>
              {data !== "txn" && (
                <div style={{ marginLeft: "2px", fontSize: "12px" }}>Cr</div>
              )}
            </div>
          </Tooltip>

          <Box
            sx={{
              fontSize: "10px",
              color: users.increased ? "#00BF78" : "#DC5F5F",
              display: "flex",
              alignItems: "center",
              mt: { xs: 1, sm: 0 },
              mr: 2,
            }}
          >
            {users.increased ? (
              <NorthIcon sx={{ fontSize: { xs: "14px", sm: "16px" } }} />
            ) : (
              <SouthIcon sx={{ fontSize: { xs: "14px", sm: "18px" } }} />
            )}
            <Typography sx={{ fontSize: { xs: "10px", sm: "12px" }, ml: 0.5 }}>
              54.3%
            </Typography>
          </Box>
        </div>

        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          style={{
            paddingTop: "0rem",
            width: "350px",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          ref={apiBalRef}
        >
          {apiBalancesData?.length > 0 &&
            apiBalancesData.map((item) => (
              <MenuItem
                key={item.bankName}
                disableRipple
                sx={{
                  marginTop: "-8px",
                  width: "inherit",
                  minWidth: "280px",
                  "&:hover": {
                    backgroundColor: "#FFF",
                    cursor: "default",
                  },
                }}
              >
                <Box
                  sx={{
                    px: 0.7,
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{item.bankName}</span>
                  <span style={{ fontSize: "14px" }}>
                    {currencySetter(item.bankBalance)}
                  </span>
                </Box>
              </MenuItem>
            ))}
        </Menu>
      </Grid>

      <MyEarningsModal users={users} />
    </Grid>
  );
};

export default DashboardDataComponent1;
