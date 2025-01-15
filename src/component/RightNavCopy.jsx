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
  const [walletTransferErrMsg, setWalletTransferErrMsg] = useState("");
  const [request, setRequest] = useState(false);
  const { getRecentData, refreshUser, userRequest } = useCommonContext();
  const [err, setErr] = useState();
  const location = useLocation();
  const selfqrValue =
    instId && instId
      ? `upi://pay?pa=ipay.133876.` +
        instId +
        "@icici" +
        `&pn=${user && user.establishment}` +
        "&cu=INR"
      : "";

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
     setIsMainWallet(!isMainWallet)
  };
  return (
    <>
    <Grid component="Box"  >
   
    <Grid 
  
>
<Grid>
  <Box>
  Wallet 1
  <Typography>
  {numberSetter( user.w1 / 100  )} ₹
  </Typography>
  </Box>
</Grid>
<Grid>
  <Box>
  Wallet 2
  <Typography>
  {numberSetter( user.w1 / 100  )} ₹
  </Typography>
  </Box>
</Grid>

    <Grid className={user.w1 / 100 < 1000 ? "animate cards" : "cards"} sx={{ width: "400px" ,}}>
  <Grid container sx={{ display: "flex", background: "#1D89E4", borderRadius: "8px 8px 14px 14px", padding: "10px" }}>
    <Grid item xs={6} md={6} lg={6} sx={{ display: "flex", alignItems: "start", justifyContent: "flex-start", padding: "5px", }}>
      <Box sx={{ color: "white", fontSize: "16px", display: "flex", mt:1}}>
        Wallet Balance 
        <RefreshComponent refresh={userRequest} onClick={() => refreshUser()} />
      </Box>
    </Grid>

    <Grid item xs={6} md={6} lg={6} sx={{ display: "flex", justifyContent: "end", alignItems: "center", padding: "2px 2px 0px 0px" }}>
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          width: "35%", // Adjust this to control box width
          height: "65px", // Increase height to fit both elements
          display: "flex",
          flexDirection: "column", // Align items vertically
          justifyContent: "center",
          alignItems: "center",
          
        }}
      >
        <Typography variant="h1" sx={{ margin: 0, color: "#CC8C0B", fontSize: "40px" }}>{!isMainWallet ? "1 " : "2"}</Typography> {/* Increased font size */}
        <Typography variant="body2" sx={{ color: "#5382DE" }}>Wallet</Typography> {/* Display "Walleted" below the 1 */}
      </Box>
    </Grid>
  </Grid>

  <Grid container component="Box" sx={{ display: "flex", justifyContent: "space-between" }} lg={12} md={12}>
    <Grid item lg={8} md={8} sx={{ justifyContent: "end" }}>
      
      {/* Display Wallet Balance */}
      <Grid sx={{ mt: 1 }}>
        {user.w1 / 100 < 1000 && (
          <Box sx={{ textAlign: "left", fontSize: "15px", padding: "15px" }}> {/* Added padding */}
            Your Wallet Balance is low <br />
            Kindly recharge.
          </Box>
        )}
      </Grid>

      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 1.6,
        }}
      >
        <Grid item sx={{ display: "flex", justifyContent: "flex-start", }}>
          <Tooltip title={isMainWallet ? user.w1 : user.w2}>
            <Typography variant="h1" fontWeight="bold" sx={{ fontSize: "18px", ml: 4,fontSize:"20px" }}> {/* Increased font size */}
              {numberSetter(!isMainWallet ? user.w1 / 100    : user.w2 / 100)} ₹
            </Typography>
          </Tooltip>
        </Grid>

        {/* Move Switch Button Here */}
        <Grid item sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center",mt:3,mr:-6 }}>
        <Switch
  checked={isMainWallet}
  onChange={handleWalletToggle}
  sx={{
    '& .MuiSwitch-thumb': {
      backgroundColor: isMainWallet ? '#CC8C0B' : '#BED4FF', // Thumb color when on or off
    },
    '& .MuiSwitch-track': {
      backgroundColor: '#BED4FF', // Track color always set to #BED4FF
    },
  }}
/>



        </Grid>
      </Grid>
    </Grid>

    <Grid
      item
      lg={4}
      md={4}
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" ,mr:1,mb:1}}>
        {!isMainWallet ? (
          <>
          <Box sx={{display:"flex",gap:"10px",flexDirection: "column",}}>
            <SendMoneyModal />
            <AddBalanceViaPG />
            </Box>
          </>
        ) : (
          <>
            <Mount visible={user && user.instId && selfqrValue !== "" && user.upi_qr === 1}>
              <Box className="hover-zoom">
                <IconButton
                  className="hover-zoom"
                  sx={{ color: "#fff" }}
                  onClick={() => {
                    setOpen(true);
                    handleWalletTransfer();
                    handleBankTransfer();
                  }}
                >
                  <Tooltip title="QR" placement="left">
                    <QrCode2Icon className="hover-white" />
                  </Tooltip>
                </IconButton>
              </Box>
            </Mount>

            <Mount visible={user.instId}>
              <OutletRegistration
                btn={
                  <Box className="hover-zoom">
                    <IconButton className="hover-zoom" sx={{ color: "#fff" }}>
                      <Tooltip title="QR" placement="left">
                        <QrCode2Icon className="hover-white" />
                      </Tooltip>
                    </IconButton>
                  </Box>
                }
              />
            </Mount>

            <Box className="hover-zoom">
              <IconButton
                className="hover-zoom"
                sx={{ color: "#fff" }}
                onClick={() => {
                  setShowBankTransfer(!showBankTransfer);
                  handleWalletTransfer();
                }}
              >
                <Tooltip title="Bank Transfer" placement="left">
                  <AccountBalanceIcon className="hover-white" />
                </Tooltip>
              </IconButton>
            </Box>

            <Box className="hover-zoom">
              <IconButton
                sx={{ color: "#fff" }}
                onClick={() => {
                  setShowWalletTransfer(!showWalletTransfer);
                  handleBankTransfer();
                }}
              >
                <Tooltip title="W2 to W1 Transfer" placement="left">
                  <AccountBalanceWalletIcon className="hover-white" />
                </Tooltip>
              </IconButton>
            </Box>
          </>
        )}
      </Box>
    </Grid>
  </Grid>
</Grid>
</Grid>



        
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
              <TextField autoComplete="off"
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
      <RecentHistory />
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
