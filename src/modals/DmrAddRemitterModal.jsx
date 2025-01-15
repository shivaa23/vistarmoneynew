import * as React from "react";
import Box from "@mui/material/Box";
import { FormControl, Grid, TextField } from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { postJsonData } from "../network/ApiController";
import { useState } from "react";
import Loader from "../component/loading-screen/Loader";
import AuthContext from "../store/AuthContext";

const DmrAddRemitterModal = ({
  rem_mobile,
  getRemitterStatus,
  apiEnd,
  dmtValue,
  view,
  setAddNewRem,
  verifyRem,
  setVerifyRem,
  otpRef,
  setOtpRef,
}) => {
  const [open, setOpen] = useState(true);
  const [request, setRequest] = useState(false);
  const [mobile, setMobile] = useState(rem_mobile);
  const [otpRefId, setOtpRefId] = useState("");
  const [otRefIdExp, setOtpRefIdExp] = useState();
  const [showOtp, setShowOtp] = useState(false);
  const authCtx = React.useContext(AuthContext);
  const user = authCtx.user;
  const userLat = authCtx.location.lat;
  const userLong = authCtx.location.long;
  console.log("otpRefId", otpRefId);
  // console.log("otpRef", otpRef);
  const style = {
    position: "absolute",
    // top: "50%",
    // left: "50%",
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
    setOpen(false);
    if (setAddNewRem) setAddNewRem(false);
    if (setOtpRef) setOtpRef(null);
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
        : dmtValue === "express"
        ? {
            aadhaar_number: form.aadhaar_number.value,
            // last_name: form.last_name.value,
            latitude: userLat,
            longitude: userLong,
            number: mobile,
          }
        : dmtValue === "super" && {
            // aadhaar_number: form.aadhaar_number.value,
            last_name: form.last_name.value,
            first_name: form.first_name.value,
            latitude: userLat,
            longitude: userLong,
            number: mobile,
          };
    if (showOtp && showOtp) {
      postJsonData(
        verifyRem && verifyRem
          ? ApiEndpoints.VERIFY_REM_UPI
          : dmtValue == "express"
          ? ApiEndpoints.NEW_VALIDATE_OTP
          : dmtValue === "super"
          ? ApiEndpoints.VALIDATE_SUP_OTP
          : ApiEndpoints.VALIDATE_OTP,
        {
          rem_number: mobile,
          otp: form.otp.value,
          otpReferenceID: otRefIdExp,
          // otpReference: otRefIdExp,
          latitude: userLat,
          longitude: userLong,
        },
        setRequest,
        (res) => {
          console.log("im here 1");

          if (getRemitterStatus) {
            getRemitterStatus(mobile);
          }
          setShowOtp(false);
          setOtpRefId("");
          setTimeout(() => {
            handleClose();
          }, 200);
        },
        (error) => {
          apiErrorToast(error);
        }
      );
    } else if (otpRef && otpRef) {
      postJsonData(
        apiEnd,
        {
          number: mobile,
          otp: form.otp.value,
          otpReference: otpRef,
          aadhaar_number: form.aadhaar_number.value,
          // last_name: form.last_name.value,
        },
        setRequest,
        (res) => {
          console.log("im here 2");

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
          console.log("im here 3");

          const data = res.data;
          setOtpRefIdExp(data.data.otpReferenceID);
          setOtpRefId(data.otp_ref_id);
          setShowOtp(true);
        },
        (error) => {
          apiErrorToast(error);
        }
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="sm_modal" sx={{ p: 1 }}>
        <Loader changeloder=" "  loading={request} />
          <ModalHeader title="Add Remitter"  subtitle=" "  handleClose={handleClose} />
          <Box
            component="form"
            id="add_rem"
            validate
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
          >
            <Grid container sx={{ pt: 1 }}>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Mobile"
                    id="mobile"
                    size="small"
                    required
                    value={mobile}
                    inputProps={{ maxLength: "10" }}
                    onChange={(e) => {
                      setMobile(e.target.value);
                    }}
                  />
                </FormControl>
              </Grid>

              {view && view === "upiTransfer" ? (
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
                  {dmtValue === "express" && (
                    <Grid item md={12} xs={12}>
                      <Grid item md={12} xs={12}>
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            label="Aadhar Number"
                            id="aadhaar_number"
                            size="small"
                            required
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  )}
                  {dmtValue === "super" && (
                    <Grid item md={12} xs={12}>
                      <Grid item md={12} xs={12}>
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            label="First name"
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
                    </Grid>
                  )}
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
            </Grid>
          </Box>
          <ModalFooter typeWallet="wallet"  form="add_rem" request={request} btn="Proceed" />
        </Box>
      </Box>
    </Box>
  );
};

export default DmrAddRemitterModal;
