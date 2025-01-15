import { Box, Button, Grid, Modal, Typography, Snackbar, IconButton, FormControl } from "@mui/material";
import React, { useEffect, useState } from "react";
import Loader from "../component/loading-screen/Loader";
import ModalHeader from "./ModalHeader";
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
  width: "400px",
  maxWidth: "90%", // Ensure responsiveness
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
  height: "auto",
};

const ApiToken = ({ user }) => {
  const [open, setOpen] = useState(false); // To manage API token modal visibility
  const [openOtpBox, setOpenOtpBox] = useState(false); // To manage OTP box visibility
  const [apiToken, setApiToken] = useState(""); // State to store API token value
  const [request, setRequest] = useState(false); // To manage loading Loader
  const [otp, setOtp] = useState(""); // To store OTP for verification
  const [otpVerified, setOtpVerified] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); 
  const [err, setErr] = useState();// To manage OTP verification state
  const [resendDisabled, setResendDisabled] = useState(false); // Disable resend button for some time
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(120);
  // Copy to Clipboard
  const copyToClipBoard = (copyMe) => {
    try {
      navigator.clipboard.writeText(copyMe);
      setSnackbarOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

  // Send OTP function
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

  // Function to handle the OTP send request
  const handleOpen = () => {
    setRequest(true); // Start the Loader/loading state
    sendOtp();
  };

  // Function to verify the OTP and get the API token
  const verifyOtp = () => {
    setRequest(true); // Start loading Loader

    postJsonData(
      ApiEndpoints.GET_API_TOKEN,
      { otp }, // Pass the OTP for verification
      () => {},
      (res) => {
        setRequest(false);
        if (res.data.status === "Success") {
          setApiToken(res?.data?.data?.api_token); // Store the API token
          setOtpVerified(true); // Mark OTP as verified
          // okSuccessToast("API Token Retrieved Successfully!");
          setOpen(true); // Open the modal after verification
          setOpenOtpBox(false); // Close the OTP modal
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
    setOtp(""); 
    setApiToken(""); 
    setOpenOtpBox(false);
    setOtpVerified(false); 
  };

  // Reset API Token
  const openReset = () => {
    setOpenOtpBox(true);
    resetApiToken();
  };

  const resetApiToken = () => {
    postJsonData(
      ApiEndpoints.RESET_API_TOKEN,
      { otp },
      () => {},
      (res) => {
        // okSuccessToast("API token reset successfully");
        setApiToken(res?.data?.data?.api_token);
      },
      (err) => {
        apiErrorToast(err.message || "An error occurred while resetting the API token.");
      }
    );
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
        {request ? <Loader loading={request} size={18} /> : "Api Token"}
      </Button>

      {/* OTP Modal */}
      <Modal
        open={openOtpBox && !otpVerified} // Show OTP modal only if OTP not verified
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          {request && <Loader loading={request} />}

          <ModalHeader title="Verify OTP" handleClose={handleClose} />

          <Grid container>
            <Grid item xs={12}>
            <FormControl>
                  <PinInput
                    length={6}
                    focus
                    type="password"
                    onChange={(value, index) => {
                      if (err !== "") {
                        setErr("");
                      }
                      setOtp(value);
                    }}
                    regexCriteria={/^[0-9]*$/}
                  />
                </FormControl>
                <Grid item xs={12} display="flex" justifyContent="flex-end">
              {canResend ? (
                <Button variant="contained" onClick={sendOtp} sx={{ mr: 2.5 }}>
                  Resend OTP
                </Button>
              ) : (
                <Typography>{`Resend in ${timer}s`}</Typography>
              )}
            </Grid>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={verifyOtp} // Call verifyOtp here
                disabled={request || !otp} // Disable if no OTP entered
              >
                {request ? "Verifying..." : "Verify OTP"}
              </Button>
            </Grid>

         
          </Grid>
        </Box>
      </Modal>

      {/* API Token Modal */}
      <Modal
        open={otpVerified && open} // Show this modal only if OTP is verified
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title="View API Token" handleClose={handleClose} />

          <Grid container>
            <Grid item xs={12} sx={{ mb: 2, display: "flex", alignItems: "center" }}>
            <Typography
              variant="body1"
              sx={{ wordBreak: "break-word", mt: 2, flexGrow: 1 }}
            >
              {apiToken || "No API Token"}
            </Typography>
            
            </Grid>
            <Button
            variant="contained"
                color="secondary"
                sx={{ cursor: 'pointer', ml: 1 ,mb:2}}
                onClick={() => {
                  copyToClipBoard(apiToken);
                }}
              >
                Copy key
                </Button>

            {/* Reset Button */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={openReset} // Open OTP box for resetting token
              >
                Reset API Token
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="API token copied!"
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

export default ApiToken;
