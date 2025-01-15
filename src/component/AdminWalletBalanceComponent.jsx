import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { get, postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import AuthContext from "../store/AuthContext";
import { apiErrorToast } from "../utils/ToastUtil";
import DashboardDataComponent1 from "./DashboardDataComponent1";

const AdminWalletBalanceComponent = ({
  graphDuration,
  isPaisaKart = false,
}) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const setApiBal = authCtx.setApiBal;
  const [prequest, setPRequest] = useState(false);
  const [trequest, setTRequest] = useState(false);

  const [walletBalReq, setWalletBalReq] = useState(false);
  const [bankBalReq, setBankBalReq] = useState(false);
  const [apiBalReq, setApiBalReq] = useState(false);
  const [w1, setW1] = useState("");
  const [w2, setW2] = useState("");
  const [walletData, setWalletData] = useState([
    { name: "Primary", balance: "0", color: "#00BF78" },
    { name: "Tertiary", balance: "0", color: "#9f86c0" },
    { name: "Wallet Balance", balance: "0", color: "#DC5F5F" },
    { name: "Bank Balance", balance: "0", color: "#F08D17" },
    { name: "API Balances", balance: "0", color: "#FFB6C6" },
  ]);
  const [walletDataAsm, setWalletDataAsm] = useState([
    { name: "Primary", balance: "0", color: "#00BF78" },
    { name: "Tertiary", balance: "0", color: "#9f86c0" },
  ]);
  const [apiBalancesData, setApiBalancesData] = useState([]);
  const getBankBalance = () => {
    get(
      ApiEndpoints.ADMIN_DASHBOARD_GET_BANK_BALANCE,
      ``,
      setBankBalReq,
      (res) => {
        const data = res.data.data;
        const newData = [...walletData];

        newData.forEach((item) => {
          if (item.name === "Bank Balance") {
            item.balance = data;
          }
          setApiBal(item);
        });
        setWalletData(newData);
        // setApiBal(newData);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };
  const getAPIBalance = () => {
    get(
      ApiEndpoints.ADMIN_DASHBOARD_GET_API_BALANCE,
      ``,
      setApiBalReq,
      (res) => {
        const data = res.data.data;

        const newData = [...walletData];
        let amount = data;
        const bankBalDorpData = Object.keys(data).map((item) => {
          return { bankName: item, bankBalance: data[item] };
        });
        setApiBalancesData(bankBalDorpData);
        Object.values(data).forEach((item) => {
          amount = amount + item * 1;
        });

        newData.forEach((item) => {
          if (item.name === "API Balances") {
            item.balance = amount;
          }
        });
        setWalletData(newData);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const getWalletBalance = () => {
    get(
      ApiEndpoints.ADMIN_DASHBOARD_GET_WALLET_BALANCE,
      ``,
      setWalletBalReq,
      (res) => {
        const data =
          parseInt(res.data.data.w1) / 100 + parseInt(res.data.data.w2) / 100;

        setW1(parseInt(res.data.data.w1) / 100);
        setW2(parseInt(res.data.data.w2) / 100);
        const newData = [...walletData];
        newData.forEach((item) => {
          if (item.name === "Wallet Balance") {
            item.balance = data;
          }
        });
        setWalletData(newData);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };
  const getPrimaryBalance = () => {
    postJsonData(
      ApiEndpoints.ADMIN_DASHBOARD_GET_PRIMARY_BALANCE,
      {
        type: graphDuration,
      },
      setPRequest,
      (res) => {
        const data = res.data.data;

        const newData =
          user && (user.role === "Asm" || user.role === "Zsm")
            ? [...walletDataAsm]
            : [...walletData];
        newData.forEach((item) => {
          if (item.name === "Primary") {
            item.balance = data;
          }
        });
        if (user && (user.role === "Asm" || user.role === "Zsm")) {
          setWalletDataAsm(newData);
        } else {
          setWalletData(newData);
        }
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };
  const getTertiaryBalance = () => {
    postJsonData(
      ApiEndpoints.ADMIN_DASHBOARD_GET_TERTIARY_BALANCE,
      {
        type: graphDuration,
      },
      setTRequest,
      (res) => {
        const data = res.data.data;
        const profit = res.data.profit;
        const newData =
          user && (user.role === "Asm" || user.role === "Zsm")
            ? [...walletDataAsm]
            : [...walletData];
        newData.forEach((item) => {
          if (item.name === "Tertiary") {
            item.balance = data;
            item.profit = profit;
          }
        });
        if (user && (user.role === "Asm" || user.role === "Zsm")) {
          setWalletDataAsm(newData);
        } else {
          setWalletData(newData);
        }
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };
  useEffect(() => {
    getPrimaryBalance();
    getTertiaryBalance();
  }, [graphDuration]);

  // useEffect(() => {
  //   setApiBal({"getApiBal": getAPIBalance, "bal": walletData[3].balance})
  // }, [getAPIBalance])

  useEffect(() => {
    if (user && (user.role === "Asm" || user.role === "Zsm")) {
      getPrimaryBalance();
      getTertiaryBalance();
    } else {
      getWalletBalance();
      getBankBalance();
      getPrimaryBalance();
      getTertiaryBalance();
      getAPIBalance();
    }
  }, []);

  return (
    <Grid
      container
      xs={12}
      md={12}
      lg={12}
      sx={{
        borderRadius: "8px",
        // padding: "1rem",
        width: { lg: "100%", md: "100%", sm: "100%" },
        ml: { lg: "0", md: "0", xs: "0" },
      }}
    >
      {user && (user.role === "Asm" || user.role === "Zsm")
        ? walletDataAsm.map((item, index) => (
            <Grid
              key={index}
              item
              xs={2.8}
              sm={6}
              md={2.8}
              sx={{
                ml: 2,
                mb: { sm: 2, md: 2, xs: 2 },
                display: "flex",
                flexDirection: "row",
                height: "100%",
                boxShadow: 1,
              }}
            >
              <DashboardDataComponent1
                users={item}
                data="wallet"
                index={index}
                len={walletDataAsm.length}
                w1={w1}
                w2={w2}
                getWalletBal={getWalletBalance}
                getBankBal={getBankBalance}
                getPrimaryBalance={getPrimaryBalance}
                getTertiaryBalance={getTertiaryBalance}
                PrimaryRequest={prequest}
                TertiaryRequest={trequest}
                walletReq={walletBalReq}
                bankBalReq={bankBalReq}
                sx={{ flex: 1 }}
              />
            </Grid>
          ))
        : walletData.map((item, index) => (
            <Grid
              key={index}
              item
              xs={6}
              sm={5.5}
              md={2.2}
              sx={{
                ml: 2,
                borderRadius: "5px",
                mb: { sm: 2, md: 2, xs: 2 },
                width: "100%",
                boxShadow: 1,
                height: "100%",
              }}
            >
              <DashboardDataComponent1
                users={item}
                data="wallet"
                index={index}
                len={walletData.length}
                w1={w1}
                w2={w2}
                getWalletBal={getWalletBalance}
                getBankBal={getBankBalance}
                getAPIBal={getAPIBalance}
                apiBalancesData={apiBalancesData}
                getPrimaryBalance={getPrimaryBalance}
                getTertiaryBalance={getTertiaryBalance}
                PrimaryRequest={prequest}
                TertiaryRequest={trequest}
                walletReq={walletBalReq}
                bankBalReq={bankBalReq}
                apiBalReq={apiBalReq}
              />
            </Grid>
          ))}
    </Grid>
  );
};

export default AdminWalletBalanceComponent;
