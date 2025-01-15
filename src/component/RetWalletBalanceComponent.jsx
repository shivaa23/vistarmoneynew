import { Grid } from "@mui/material";
import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { get } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import AuthContext from "../store/AuthContext";
import { apiErrorToast } from "../utils/ToastUtil";
import RetDashboardWalletComponent from "./RetDashboardWalletComponent";
import { useNavigate } from "react-router-dom";

const RetWalletBalanceComponent = ({ graphDuration }) => {
  const [request, setRequest] = useState(false);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const navigate = useNavigate();
  const [walletData, setWalletData] = useState([
    { name: "Primary", balance: "0", color: "#00BF78" },
    { name: "Tertiary", balance: "0", color: "#4045A1" },
    { name: "Wallet1 Balance", balance: user.w1, color: "#DC5F5F" },
    { name: "Wallet2 Balance", balance: user.w2, color: "#F08D17" },
  ]);

  const refreshUser = () => {
    get(
      ApiEndpoints.GET_ME_USER,
      "",
      setRequest,
      (res) => {
        const data = res.data.data;
        authCtx.saveUser(data);
        const newData = [...walletData];
        newData.forEach((item) => {
          if (item.name === "Wallet1 Balance") {
            item.balance = data.w1;
          }
          if (item.name === "Wallet2 Balance") {
            item.balance = data.w2;
          }
        });
        setWalletData(newData);
      },
      (error) => {
        authCtx.logout();
        navigate("/login");
        apiErrorToast(error);
      }
    );
  };

  return (
    <Grid
      container
      xs={12}
      md={12}
      lg={8}
      sx={{
        display: "flex",
        justifyContent: { md: "left", lg: "right", xs: "left" },
        alignItems: "start",
        mt: { md: 1, lg: 0, xs: 1 },
        mr: { md: 1, lg: 0, xs: 1 },
      }}
    >
      {walletData &&
        walletData.map((item, index) => {
          return (
            <Grid
              key={index}
              item
              xs={6}
              sm={3}
              md={3}
              sx={{
                mb: { sm: 2, md: 2, xs: 2 },
              }}
            >
              <RetDashboardWalletComponent
                users={item}
                data="wallet"
                index={index}
                len={walletData.length}
                getWalletBal={refreshUser}
                walletReq={request}
              />
            </Grid>
          );
        })}
    </Grid>
  );
};

export default RetWalletBalanceComponent;
