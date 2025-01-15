/* eslint-disable react-hooks/exhaustive-deps */
// ###########################################################################
// USE THIS COMPONENT TO DISPLAY <RightNavbar /> ANYWHERE IN THE PROJECT
// ###########################################################################
// IMPORTED ADDED BY ANKUR
// COMMENTS ADDED BY ANKUR DHARMOSHT.... CONTACT ME FOR ANY QUERY.......
// DO NOT DELETE THE COMMENTS IN THE FILE.....

import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Grid,
  IconButton,
  Tooltip,
  Switch,
  TextField,
  FormControl,
  Typography,
  Button,
  Card,
} from "@mui/material";
import AuthContext from "../store/AuthContext";
import { postFormData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import SendMoneyModal from "../modals/SendMoneyModal";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { upiWeb } from "../iconsImports";
import QRCode from "react-qr-code";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import Loader from "../component/loading-screen/Loader";
import { numberSetter } from "../utils/Currencyutil";
import WalletTransfer from "../modals/WalletTransfer";
import useCommonContext from "../store/CommonContext";
import OutletRegistration from "./OutletRegistration";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import QRWarningModal from "../modals/QRWarningModal";
import { validateApiCall } from "../utils/LastApiCallChecker";
import Mount from "./Mount";
import RefreshComponent from "./RefreshComponent";
import RecentHistory from "./right_sidenav/RecentHistory";
import BankTransfer from "./right_sidenav/BankTransfer";
import AddBalanceViaPG from "../modals/AddBalanceViaPG";
import { useLocation } from "react-router-dom";
import RightSideCard from "./RightSideCard";
const RightNavbar = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const userLat = authCtx.location && authCtx.location.lat;
  const userLong = authCtx.location && authCtx.location.long;
  const [showQr, setShowQr] = useState(false);
  const [open, setOpen] = useState(false);
  const [showWalletTransfer, setShowWalletTransfer] = useState(false);
  const [showBankTransfer, setShowBankTransfer] = useState(false);
  const instId = user && user.instId;
  const vqr = user && user.vqr;
  const [walletTransferErrMsg, setWalletTransferErrMsg] = useState("");
  const [request, setRequest] = useState(false);
  const { getRecentData, refreshUser, userRequest } = useCommonContext();
  const [err, setErr] = useState();
  const location = useLocation();
  const selfqrValue =
    vqr && vqr
      ? `upi://pay?pa=` + vqr + `&pn=${user && user.establishment}` + "&cu=INR"
      : "if you want to use our qr ";
  // ######################################
  // W2 TO W1 TRANSFER API CALL ...........
  // ######################################
  const handleW2ToW1Transfer = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      amount: form.w2_amount.value,
      pf: "WEB",
      latitude: userLat,
      longitude: userLong,
    };

    if (validateApiCall()) {
      postFormData(
        ApiEndpoints.W2TOW1_TRANSFER,
        data,
        setRequest,
        (res) => {
          okSuccessToast(res.data.message);
          setWalletTransferErrMsg("");
          document.getElementById("w2_amount").value = "";
          document.getElementById("w2_amount").focused = "off";
          refreshUser();
          getRecentData();
          setErr("");
        },
        (err) => {
          setErr("");
          if (
            err.response.data.message.amount &&
            err.response.data.message.amount
          ) {
            setWalletTransferErrMsg(err.response.data.message.amount);
          } else {
            setWalletTransferErrMsg("");
            apiErrorToast(err);
            refreshUser();
            getRecentData();
          }
        }
      );
    } else {
      setErr("");
      const error = {
        message: "Kindly wait some time before another request",
      };
      setErr(error);
    }
  };

  useEffect(() => {
    getRecentData();
  }, []);

  const handleOpen = () => {
    // const timer = setTimeout(() => {
    if (authCtx?.isLoggedIn) refreshUser();
    // }, 30000);
    // return () => clearTimeout(timer);
  };

  // ############################################
  // TRANSFER CARDS COMPONENT HANDLING FUNCTIONS
  // ############################################
  const handleWalletTransfer = () => {
    if (showWalletTransfer && showWalletTransfer) {
      setShowWalletTransfer(!showWalletTransfer);
    }
  };
  const handleBankTransfer = () => {
    if (showBankTransfer && showBankTransfer) {
      setShowBankTransfer(!showBankTransfer);
    }
  };
  const [isMainWallet, setIsMainWallet] = useState(false);

  const handleWalletToggle = () => {
    setIsMainWallet(!isMainWallet);
  };
  return (
    <>
      <Grid component="Box" className="right-nav">
        <Mount visible={showQr}>
          <Card
            id="qrDrop"
            sx={{
              mt: 2,
              p: { md: 1, sm: 1, xs: 2 },
              width: "100%",
            }}
            className="position-relative"
          >
            <IconButton className="top-right-position">
              <HighlightOffRoundedIcon
                className="hover-red"
                onClick={() => setShowQr(false)}
              />
            </IconButton>

            <Box style={{ fontWeight: "bold" }}>{user.name}</Box>

            <Box style={{ fontSize: "10px" }}>{selfqrValue}</Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "12px",
              }}
            >
              <QRCode value={selfqrValue} size={156} />
            </Box>
            <Box style={{ fontWeight: "bold" }}>Scan this code & pay me</Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "12px",
              }}
            >
              <img src={upiWeb} alt="upi apps" />
            </Box>
            <Typography
              sx={{
                textAlign: "center",
                fontSize: "11px",
                fontWeight: "600",
                color: "#676970",
                p: 2.2,
                pb: 0,
              }}
            >
              *Note: This Payment will be added to W2
            </Typography>
          </Card>
        </Mount>

        {/* ########################################
      ## W2 TO W1 MAIN CARD COMPONENT ##
      ######################################## */}
        <Mount visible={showWalletTransfer}>
          <Grid
            id="qrDrop"
            sx={{
              marginTop: "12px",
              px: 2,
              pt: 2,
              backgroundColor: "#ffffff",
            }}
            className="position-relative card-css"
          >
            <IconButton className="top-right-position">
              <HighlightOffRoundedIcon
                className="hover-red"
                onClick={() => {
                  setShowWalletTransfer(false);
                  setErr("");
                  setWalletTransferErrMsg("");
                }}
              />
            </IconButton>
            <Loader loading={request} circleBlue />
            <Typography
              sx={{ fontWeight: "bold", width: "100%", textAlign: "left" }}
            >
              W2 to W1 Transfer
            </Typography>
            <Box
              component="form"
              id="walletTransfer"
              validate
              autoComplete="off"
              onSubmit={handleW2ToW1Transfer}
            >
              <FormControl sx={{ width: "100%", mt: 1 }}>
                <TextField
                  autoComplete="off"
                  label="Enter Amount"
                  id="w2_amount"
                  type="number"
                  sx={{ backgroundColor: "#fff" }}
                  onChange={() => {
                    setWalletTransferErrMsg("");
                  }}
                  required
                  size="small"
                  onKeyDown={(e) => {
                    if (e.key === "+" || e.key === "-") {
                      e.preventDefault();
                    }
                  }}
                />
              </FormControl>
            </Box>
            <Box sx={{ width: "100%", textAlign: "right" }}>
              {err && (
                <Typography sx={{ fontSize: "12px", color: "#4E5555" }}>
                  {err?.message}
                </Typography>
              )}
              {walletTransferErrMsg && (
                <Typography sx={{ fontSize: "12px", color: "#4E5555" }}>
                  {walletTransferErrMsg}
                </Typography>
              )}

              <Button
                variant="contained"
                sx={{
                  fontSize: "12px",
                  my: 1,
                  textTransform: "capitalize",
                  mt: 1,
                  // backgroundColor: "#E87204",
                  // "&:hover": {
                  //   backgroundColor: "#E87204",
                  // },
                }}
                className="otp-hover-purple"
                form="walletTransfer"
                type="submit"
                disabled={request}
              >
                Proceed
              </Button>
            </Box>
          </Grid>
        </Mount>
        {/* 
      ########################################
      ## BANK TRANSFER MAIN CARD COMPONENT ##
      ######################################## */}
        <Mount visible={showBankTransfer}>
          <BankTransfer
            showBankTransfer={showBankTransfer}
            setShowBankTransfer={setShowBankTransfer}
          />
        </Mount>

        {/* ######################################## */}
        {/* ## RECENT HISTORY MAIN CARD COMPONENT ## */}
        {/* ######################################## */}
        {/* {location.pathname !== '/customer/dashboard' && <RecentHistory />} */}
        {user.aggreement === 1 && (
          <>
            <RecentHistory />
            <RightSideCard sx={{ mt: 2 }} />
          </>
        )}
        {/* ######################################## */}
        {/* ###### QR WARNING MODAL ######### */}
        {/* DISPLAYED ON QR CLICK THE FIRST TIME */}
        {/* ######################################## */}
        <QRWarningModal
          open={open}
          showQr={showQr}
          setOpen={setOpen}
          setShowQr={setShowQr}
        />
      </Grid>
    </>
  );
};

export default RightNavbar;
