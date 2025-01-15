import { Box, Button, Grid, Modal, Typography, TextField, Snackbar, IconButton, FormControl } from "@mui/material";
import React, { useState, useEffect } from "react";
import ModalHeader from "./ModalHeader";
import Loader from "../component/loading-screen/Loader";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import CloseIcon from '@mui/icons-material/Close';
import PinInput from "react-pin-input";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "90%",  // 90% of the screen width on extra small screens
    sm: "70%",  // 70% on small screens
    md: "50%",  // 50% on medium screens
    lg: "40%",  // 40% on large screens
  },
  maxWidth: "400px",  // Set a max width to avoid excessive width on larger screens
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
  height: "auto",
  maxHeight: "90vh",  // Limit height for small screens
  overflowY: "auto",  // Add scroll for overflowing content
};

const ApiKey = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [openOtpBox, setOpenOtpBox] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [request, setRequest] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State to manage Snackbar visibility
  const [err, setErr] = useState();
  
  // Timer state
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);

  const copyToClipBoard = (copyMe) => {
    try {
      navigator.clipboard.writeText(copyMe);
      setSnackbarOpen(true); // Show snackbar after copying
    } catch (err) {
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const sendOtp = () => {
    postJsonData(
      ApiEndpoints.SEND_OTP,
      {},
      () => {},
      (res) => {
        setRequest(false);
        if (res?.data?.status === "Success") {
          setOpenOtpBox(true);
          setTimer(120); // Reset timer on OTP send
          setCanResend(false); // Disable resend until timer finishes
        } else {
          apiErrorToast(res?.data?.message || "Failed to send OTP");
        }
      },
      (err) => {
        setRequest(false);
        apiErrorToast(err || "An error occurred. Please try again.");
      }
    );
  };

  const handleOpen = () => {
    setRequest(true);
    sendOtp();
  };

  const verifyOtp = () => {
    setRequest(true);
    postJsonData(
      ApiEndpoints.GET_API_KEY,
      { otp },
      () => {},
      (res) => {
        setRequest(false);
        if (res.data.status === "Success") {
          setApiKey(res?.data?.data?.hkey);
          setOtpVerified(true);
          setOpen(true);
          setOpenOtpBox(false);
        } else {
          apiErrorToast(res.data.message || "OTP Verification Failed");
        }
      },
      (err) => {
        setRequest(false);
        apiErrorToast(err || "An error occurred during OTP verification.");
      }
    );
  };

  const handleClose = () => {
    setOpen(false);
    setOpenOtpBox(false);
    setOtp("");
    setApiKey("");
    setOtpVerified(false);
  };

  const openReset = () => {
    setOpenOtpBox(true);
    resetApiKey();
  };

  const resetApiKey = () => {
    postJsonData(
      ApiEndpoints.RESET_API_KEY,
      { otp },
      () => {},
      (res) => {
        setApiKey(res?.data?.data?.hkey);
      },
      (err) => {
        apiErrorToast(err.message || "An error occurred while resetting the API Key.");
      }
    );
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Button
        variant="contained"
        style={{ fontSize: "10px", marginLeft: "5px" }}
        onClick={handleOpen}
        className="otp-hover-purple"
        disabled={request}
      >
        {request ? <Loader loading={request} size={18} /> : "Api Key"}
      </Button>

      {/* OTP Modal */}
      <Modal
        open={openOtpBox && !otpVerified}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          {request &&<Loader loading={request} />}
          <ModalHeader title="Verify OTP" handleClose={handleClose} />
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12}>
              <FormControl>
                <PinInput
                  length={6}
                  focus
                  type="password"
                  onChange={(value) => {
                    setErr("");
                    setOtp(value);
                  }}
                  regexCriteria={/^[0-9]*$/}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              {canResend ? (
                <Button variant="contained" onClick={sendOtp} sx={{ mr: 2.5 }}>
                  Resend OTP
                </Button>
              ) : (
                <Typography>{`Resend in ${timer}s`}</Typography>
              )}
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={verifyOtp}
                disabled={request || !otp}
              >
                {request ? "Verifying..." : "Verify OTP"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* API Key Modal */}
      <Modal
        open={otpVerified && open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title="View API Key" handleClose={handleClose} />
          <Grid container>
            <Grid item xs={12} sx={{ mb: 2, display: "flex", alignItems: "center" }}>
              <Typography
                variant="body1"
                sx={{ wordBreak: "break-word", mt: 2, flexGrow: 1 }}
              >
                {apiKey || "No API Key"}
              </Typography>
             
            </Grid>
            <Grid >
            <Button
            variant="contained"
                color="secondary"
                sx={{ cursor: 'pointer', ml: 1 ,mb:2}}
                onClick={() => {
                  copyToClipBoard(apiKey);
                }}
              >
                Copy key
                </Button>
                </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={openReset}
              >
                Reset API Key
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Snackbar for Copy Action */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="API Key copied!"
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default ApiKey;
