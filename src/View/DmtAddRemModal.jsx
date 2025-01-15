import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Fab, FormControl, Grid, TextField, Typography } from "@mui/material";
import { useState,useEffect } from "react";
import ApiEndpoints from "../network/ApiEndPoints";
import { postJsonData } from "../network/ApiController";
import Loader from "../commons/Spinner";
import ModalHeader from "../modals/ModalHeader";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import ModalFooter from "../modals/ModalFooter";
import RemitterKyc from "./aeps/RemitterKyc";



const DmtAddRemModal = ({
  rem_mobile,
  getRemitterStatus,
  apiEnd,
  view,
  setAddNewRem,
  verifyRem,
  setVerifyRem,
  otpRef,
  setOtpRef,
  dmtValue,
  remRefKey,
  setRemRefKey,
}) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [mobile, setMobile] = useState(rem_mobile);
  const [otpRefId, setOtpRefId] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [openRemKyc, setOpenRemKyc] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null); // State for remaining time
  const [timerInterval, setTimerInterval] = useState(null); // State for the interval ID
const [dmr2RemRes, setDmr2RemRes] = useState()
  useEffect(() => {
    setOpen(true);
  }, [mobile]);
console.log("dmr2RemRes",dmr2RemRes);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    boxShadow: 24,
    fontFamily: "Poppins",
    height: "max-content",
    overflowY: "scroll",
    p: 2,
  };

  const handleClose = () => {
    if (setAddNewRem) setAddNewRem(false);
    if (setOtpRef) setOtpRef(null);
    if (remRefKey) setRemRefKey({});
    setOpen(false);
  };

  const handleCloseKycModal = () => {
    setOpenRemKyc(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data =
      view && view === "upiTransfer"
        ? {
            rem_number: mobile,
            name: form.rem_name.value,
          }
        : dmtValue && dmtValue === "dmt1"
        ? {
            aadhaar_number: form.aadhaar_number.value,
            number: mobile,
            referenceKey: remRefKey?.referenceKey,
          }
        : {
            first_name: form.first_name.value,
            last_name: form.last_name.value,
            number: mobile,
          };

    if (showOtp) {
      postJsonData(
        verifyRem
          ? ApiEndpoints.VERIFY_REM_UPI
          : view === "expressTransfer"
          ? ApiEndpoints.VALIDATE_EXP_OTP
          : ApiEndpoints.VALIDATE_OTP,
        {
          rem_number: mobile,
          otp: form.otp.value,
          otpReference: otpRefId,
          referenceKey: remRefKey?.referenceKey,
        },
        setRequest,
        (res) => {
          const data = res.data.data;
          setRemRefKey(data);
          setOpenRemKyc(true);
          setShowOtp(false);
          setOtpRefId("");
        },
        (error) => {
          apiErrorToast(error);
        }
      );
    } else if (otpRef) {
      postJsonData(
        apiEnd,
        {
          number: mobile,
          otp: form.otp.value,
          otpReference: otpRef,
          first_name: form.first_name.value,
          last_name: form.last_name.value,
        },
        setRequest,
        (res) => {
          if (getRemitterStatus) {
            getRemitterStatus(mobile);
          }
          handleClose();
          okSuccessToast(res.data.message);
        },
        (error) => {
          apiErrorToast(error);
        }
      );
    } else {
      postJsonData(
        apiEnd,
        data,
        setRequest,
        (res) => {
          const data = res.data;
          setRemRefKey(data.data);
          setOtpRefId(data.otp_ref_id);
          setShowOtp(true);
        },
        (error) => {
          apiErrorToast(error);
        }
      );
    }
  };

  useEffect(() => {
    if (remRefKey?.validity) {
      const validityDate = new Date(remRefKey.validity);

      if (isNaN(validityDate.getTime())) {
        console.error("Invalid validity:", remRefKey.validity);
        setRemainingTime("Invalid time");
        return;
      }

      const updateRemainingTime = () => {
        const currentTime = new Date();
        const diffTime = validityDate - currentTime; // Time difference in ms

        if (diffTime <= 0) {
          clearInterval(timerInterval); // Clear the interval if time is up
          setRemainingTime("Time expired");
        } else {
          setRemainingTime(diffTime); // Update remaining time
        }
      };

      // Start the interval to update the remaining time every second
      const intervalId = setInterval(updateRemainingTime, 1000);
      setTimerInterval(intervalId);

      // Clean up interval when component is unmounted or validity time changes
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [remRefKey]); // Trigger this effect when remRefKey changes

  const formatRemainingTime = (time) => {
    if (time === "Invalid time" || time === "Time expired") {
      return time;
    }

    const totalSeconds = Math.floor(time / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}:${minutes}:${seconds}`;
  };


  useEffect(() => {
    if(remainingTime==="Time expired"){
      handleClose()
    }
    return () => {}
  }, [])
  
  return (
    <Box sx={{ display: "flex", justifyContent: "end" }}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <Loader loading={request} />
          <ModalHeader title="Add Remitter" handleClose={handleClose} />
          <Box
            component="form"
            id="add_rem"
            validate
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{ "& .MuiTextField-root": { m: 1 } }}
          >
            <Grid container sx={{ pt: 1 }}>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Mobile"
                    id="mobile"
                    size="small"
                    required
                    disabled
                    value={mobile}
                    inputProps={{ maxLength: "10" }}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </FormControl>
              </Grid>

              {view === "upiTransfer" ? (
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      label="Name"
                      id="rem_name"
                      size="small"
                      required
                      inputProps={{ minLength: 3 }}
                    />
                  </FormControl>
                </Grid>
              ) : (
                <>
                  {dmtValue === "dmt1" && (
                    <Grid item md={12} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          label="Aadhaar Number"
                          id="aadhaar_number"
                          size="small"
                          disabled={showOtp || otpRef&&true}
                          required
                          inputProps={{ minLength: 3 }}
                        />
                      </FormControl>
                    </Grid>
                  )}
                  {/* {dmtValue === "dmt2" && (
                    <>
                      <Grid item md={12} xs={12}>
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            label="First Name"
                            id="first_name"
                            size="small"
                            required
                            inputProps={{ minLength: 3 }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            label="Last Name"
                            id="last_name"
                            size="small"
                            required
                            inputProps={{ minLength: 3 }}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )} */}
                </>
              )}

              {(showOtp || otpRef) && (
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      label="OTP"
                      id="otp"
                      size="small"
                      required
                      inputProps={{ maxLength: 6 }}
                    />
                  </FormControl>
                </Grid>
              )}

              {/* Custom Remaining Time */}
              <Grid item md={12} xs={12}>
                <Typography
                  variant="span"
                  sx={{
                    textAlign: "center",
                    color: remainingTime === "Time expired" ? "red" : "green",
                    fontWeight: 500,
                    fontSize: "0.8rem",
                    pl:1
                  }}
                >
                  Remaining Time: {formatRemainingTime(remainingTime)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <ModalFooter form="add_rem" request={request} btn="Proceed" />
        </Box>
      </Modal>

      {openRemKyc && (
        <RemitterKyc
          open={openRemKyc}
          onClose={handleCloseKycModal}
          remRefKey={remRefKey}
          rem_mobile={rem_mobile}
          getRemitterStatus={getRemitterStatus}
          dmtValue={dmtValue}
          setDmr2RemRes={setDmr2RemRes}
        />
      )}
    </Box>
  );
};

export default DmtAddRemModal;
