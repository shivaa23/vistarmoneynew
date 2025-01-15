import React, { useCallback, useContext, useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import AuthContext from "../store/AuthContext";
import { get, postFormData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { numberSetter } from "../utils/Currencyutil";
import useCommonContext from "../store/CommonContext";
import { validateApiCall } from "../utils/LastApiCallChecker";
import RefreshComponent from "./RefreshComponent";
import { useLocation } from "react-router-dom";
import { keyframes } from "@mui/system";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { getFirmContact, getFirmEmail } from "../theme/setThemeColor";
import { Email, Phone } from "@mui/icons-material";

const WalletCard = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const parentResponse = authCtx.parentResponse;
  const { apiBal } = authCtx;
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
  // const [response, setResponse] = useState(parentResponse);
  const location = useLocation();
  console.log("parentResponse", parentResponse);

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
    setIsMainWallet(!isMainWallet);
  };
  const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

  const borderPulse = keyframes`
  0% { border-color: red; }
  50% { border-color: darkred; }
  100% { border-color: red; }
`;

  // const getParent = useCallback(() => {
  //   get(
  //     ApiEndpoints.GET_PARENT,
  //     "",
  //     () => {},
  //     (res) => {
  //       setResponse(res?.data?.data);
  //     },
  //     (err) => {
  //       apiErrorToast(err);
  //     }
  //   );
  // }, []);
  // useEffect(() => {
  //   if (user.role === "Dd" || user.role === "Ad" || user.role === "Md") {
  //     getParent();
  //   }
  //   return () => {};
  // }, [getParent, user]);
  return (
    <Grid
      container
      spacing={1}
      wrap="nowrap"
      alignItems="center"
      justifyContent="flex-start"
    >
      <>
        {/* help box  */}
        {(user.role == "Ret" ||
          user.role == "Ad" ||
          user.role == "Dd" ||
          user.role == "Md") && (
          <Grid item xs="auto">
            <Box
              sx={{
                padding: "5px 6px 5px 4px",
                backgroundColor: "#ffebee",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",

                width: { lg: "160px", sm: "150px", xs: "150px" },
                border: "2px solid #D71313",
                overflow: "hidden",
              }}
            >
              {/* Contact Details */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginLeft: "8px",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#212b5a",
                    fontSize: "10px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Phone sx={{ color: "#FF5722", fontSize: "14px", mr: 0.5 }} />

                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      marginLeft: "4px",
                    }}
                  >
                    {getFirmContact()}
                  </span>
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#212b5a",
                    fontSize: "10px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    mt: "0.5",
                  }}
                >
                  <Email sx={{ color: "#FF5722", fontSize: "14px", mr: 0.5 }} />

                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      marginLeft: "4px",
                    }}
                  >
                    {getFirmEmail()}
                  </span>
                </Typography>
              </Box>
            </Box>
          </Grid>
        )}

        {/* ASM Card */}
        {(user.role === "Dd" ||
          user.role === "Ret" ||
          user.role === "Ad" ||
          user.role === "Md") &&
          user.aggreement === 1 && (
            <Grid item xs="auto">
              <Box
                sx={{
                  padding: "4px 6px 3px 4px",
                  backgroundColor: "#ffebee",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  width: { lg: "140px", sm: "125px" },
                  border: "2px solid #D71313",
                }}
              >
                <Box sx={{ minWidth: "100%", textAlign: "left" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#b71c1c",
                      fontSize: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    ASM
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#212b5a", fontSize: "10px" }}
                  >
                    Mobile No-{parentResponse?.asm}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

        {/* DD Card */}
        {user.role !== "Dd" &&
          user.role !== "Ret" &&
          user.role !== "Ad" &&
          user.role !== "Admin" &&
          user.role !== "Asm" &&
          user.role !== "Zsm" &&
          user.aggreement !== 1 && (
            <Grid item xs="auto">
              <Box
                sx={{
                  padding: "4px 6px 3px 4px",
                  backgroundColor: "#ffebee",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  width: { lg: "140px", sm: "130px" },
                  border: "2px solid #D71313",
                }}
              >
                <Box sx={{ minWidth: "100%", textAlign: "left" }}>
                  <Box sx={{ display: "flex" }}>
                    <Typography
                      variant="body"
                      sx={{
                        color: "Black",
                        fontSize: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      DD- <span style={{ fontSize: "10px" }}>{user.name}</span>
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#212b5a",
                      fontSize: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    Mobile No-{" "}
                    <span style={{ fontSize: "10px", fontWeight: "bold" }}>
                      {user.username}
                    </span>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}
        {/* Wallet 1 */}
        {user.role !== "Admin" &&
          user.role !== "Asm" &&
          user.role !== "Zsm" &&
          user.aggreement === 1 && (
            <Grid item xs="auto">
              <Box
                sx={{
                  padding: "4px 6px 3px 4px",
                  backgroundColor: "#ffebee",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  width: { lg: "140px", sm: "130px", xs: "90px" },
                  border: "2px solid #D71313",
                  overflow: "hidden",
                }}
              >
                <AccountBalanceWalletIcon
                  sx={{ fontSize: 15, color: "#212b5a", mr: 1 }}
                />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#b71c1c", fontSize: "10px", marginRight: 1 }}
                  >
                    Wallet Balance
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#212b5a", fontSize: "10px", marginRight: 1 }}
                  >
                    ₹ {numberSetter(user.w1 / 100)}
                  </Typography>
                </Box>

                <RefreshComponent
                  refresh={userRequest}
                  onClick={() => refreshUser()}
                  sx={{ mb: 2, color: "#000", fontSize: 15, ml: 1 }}
                />
              </Box>
            </Grid>
          )}
        {/* hold money  */}
        {(user.role == "Ret" ||
          user.role == "Ad" ||
          user.role == "Dd" ||
          user.role == "Md") &&
          user.hold > 0 && (
            <Grid item xs="auto">
              <Box
                sx={{
                  padding: "4px 6px 3px 4px",
                  backgroundColor: "#ffebee",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  width: { lg: "140px", sm: "130px", xs: "90px" },
                  border: "2px solid #D71313",
                  overflow: "hidden",
                }}
              >
                <AccountBalanceWalletIcon
                  sx={{ fontSize: 15, color: "#212b5a", mr: 1 }}
                />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#b71c1c", fontSize: "10px", marginRight: 1 }}
                  >
                    Hold Money
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#212b5a", fontSize: "10px", marginRight: 1 }}
                  >
                    ₹ {numberSetter(user.hold / 100)}
                  </Typography>
                </Box>

                <RefreshComponent
                  refresh={userRequest}
                  onClick={() => refreshUser()}
                  sx={{ mb: 2, color: "#000", fontSize: 15, ml: 1 }}
                />
              </Box>
            </Grid>
          )}
        {/* Aeps  */}
        {user.role !== "Ad" &&
          user.role !== "Md" &&
          user.role !== "Admin" &&
          user.role !== "Asm" &&
          user.role !== "Zsm" &&
          user.username !== 9355080885 &&
          user.aggreement === 1 && (
            <Grid item xs="auto">
              <Box
                sx={{
                  padding: "4px 6px 3px 4px",
                  backgroundColor: "#ffebee",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  width: { lg: "135px", sm: "130px", xs: "100px" },
                  border: "2px solid #D71313",
                  overflow: "hidden",
                }}
              >
                <AccountBalanceWalletIcon
                  sx={{ fontSize: 15, color: "#212b5a", mr: 1 }}
                />
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#b71c1c", fontSize: "10px" }}
                  >
                    AEPS Balance
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#212b5a", fontSize: "10px" }}
                  >
                    ₹ {numberSetter(user.w2 / 100)}
                  </Typography>
                </Box>
                <RefreshComponent
                  refresh={userRequest}
                  onClick={() => refreshUser()}
                  sx={{ mb: 2, color: "#000", fontSize: 15, ml: 2 }}
                />
              </Box>
            </Grid>
          )}
        {(user.role === "Ad" || user.role === "Md") && (
          <Grid item xs="auto">
            <Box
              sx={{
                padding: "4px 6px 3px 4px",
                backgroundColor: "#ffebee",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                width: { lg: "140px", sm: "125px" },
                border: "2px solid #D71313",
              }}
            >
              <AccountBalanceWalletIcon
                sx={{ fontSize: 15, color: "#212b5a", mr: 1 }}
              />
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#b71c1c", fontSize: "10px" }}
                >
                  Comm Wallet
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#212b5a", fontSize: "10px" }}
                >
                  ₹ {numberSetter(user.w3 / 100)}
                </Typography>
              </Box>
              <RefreshComponent
                refresh={userRequest}
                onClick={() => refreshUser()}
                sx={{ mb: 2, color: "#000", fontSize: 15, ml: 1 }}
              />
            </Box>
          </Grid>
        )}
        {/* {(user.role === "Admin" ) && (
  <Grid item xs="auto">
    <Box
      sx={{
        padding: '4px 6px 3px 4px',
        backgroundColor: '#ffebee',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        width: { lg: '140px', sm: '125px' },
        border: '2px solid #D71313',
      }}
    >
      <AccountBalanceWalletIcon sx={{ fontSize: 15, color: '#212b5a', mr: 1 }} />
      <Box>
        <Typography variant="subtitle1" sx={{ color: '#b71c1c', fontSize: "10px" }}>
        Api Balance
        </Typography>
        <Typography variant="body2" sx={{ color: '#212b5a', fontSize: "10px" }}>
          ₹ {numberSetter(apiBal?.balance/ 100)}
        </Typography>
      </Box>
      <RefreshComponent
        refresh={userRequest}
        onClick={() => {
          refreshUser();
          // apiBal.getApiBal();
        }}
        sx={{ mb: 2, color: "#000", fontSize: 15, ml: 1 }}
      />
    </Box>
  </Grid>
)} */}
      </>
    </Grid>
  );
};

export default WalletCard;
