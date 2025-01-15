import * as React from "react";
import {
  Box,
  Grid,
  Button,
  FormControl,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Modal,
  Fade, // Import the Fade component
  Backdrop,
} from "@mui/material";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { postJsonData } from "../network/ApiController";
import Loader from "../component/loading-screen/Loader";
import { primaryColor, getEnv } from "../theme/setThemeColor";
import { useState, useEffect, useContext } from "react";
import { PATTERNS } from "../utils/ValidationUtil";
import ModalHeader from "../modals/ModalHeader";
import ModalFooter from "../modals/ModalFooter";
import AuthContext from "../store/AuthContext";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VerifyOtpLogin from "../modals/VerifyOtpLogin";
import { outletRegImg } from "../iconsImports";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "80%", md: "60%", lg: "50%" },
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 4,
  borderRadius: "12px",
  overflowY: "auto",
  maxHeight: "90vh",
};

const OutletRegistration = ({ refresh, btn, autoOpen = false }) => {
  const [open, setOpen] = useState(false);
  const [isConsent, setIsConsent] = useState(false);
  const [isValMob, setIsValMob] = useState(true);
  const [request, setRequest] = useState(false);
  const [initiateData, setInitiateData] = useState();
  const [secureValidate, setSecureValidate] = useState("");
  const [otpRef, setOtpRef] = useState("");
  const [tempData, setTempData] = useState();
  const user = useContext(AuthContext);
  const userLat = user.location.lat && user.location.lat;
  const userLong = user.location.long && user.location.long;
  const envName = getEnv();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsValMob(true);
    setIsConsent(false);
  };

  const outletRegistration = (event) => {
    event && event.preventDefault();
    let data;
    const form = event && event.currentTarget;
    if(!tempData){
    data = {
      mobile: form.mobile.value,
      pan: form.pan.value,
      aadhaar: form.aadhaar.value,
      email: form.emailId.value,
      bankAccountNo: form.bankAccountNo.value,
      bankIfsc: form.bankIfsc.value,
      latitude: userLat,
      longitude: userLong,
    };
    }else{
      data = tempData
    }
    setTempData(data);
  // }

    postJsonData(
      ApiEndpoints.AEPS_INITIATE,
      data ? data : tempData,
      setRequest,
      (res) => {
        // okSuccessToast(res?.data?.message);
        setInitiateData(res?.data?.data);
        setOtpRef(res?.data?.data?.otpReferenceID);
        setSecureValidate("OTP");
        if (refresh) refresh();
      },
      (error) => apiErrorToast(error)
    );
  };

  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, []);

  return (
    <Box sx={{ display: "flex", }}>
      {btn ? (
        <span onClick={handleOpen}>{btn}</span>
      ) : (
        <Box
          className=" outletRegBox"
          sx={{
            mt: -20,
            backgroundColor: "#1a78f20a", // Light purple background similar to the image
            borderRadius: "15px",
          }}
        >
          <Grid
            item
            md={12}
            xs={12}
            sx={{
              px: 10,
              py: 2,
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <InfoOutlinedIcon sx={{ fontSize: "3rem" }} />
            <Typography sx={{ fontSize: "30px", color: "#262525", mt: 2 }}>
              Complete Your Registration to Unlock Full Access
            </Typography>
            <Box sx={{ mt: -5 }}>
              <img src={outletRegImg} alt="outletRegImg" width={500} />
            </Box>

            <Button
              variant="contained"
              sx={{
                fontSize: "15px",
                background: primaryColor(),
                px: 5,
                mt: -3,
              }}
              onClick={handleOpen}
            >
              Outlet Registration
            </Button>
          </Grid>
        </Box>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop} // Use default Backdrop
        BackdropProps={{
          timeout: 500, // Adjust the duration of the transition if needed
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Loader loading={request} />
            <ModalHeader
              title="Outlet Registration"
              handleClose={handleClose}
            />
            <Box
              component="form"
              id="outletRegistration"
              autoComplete="off"
              onSubmit={outletRegistration}
              sx={{
                "& .MuiTextField-root": { m: 1 },
                mt: 2,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Mobile Number"
                      id="mobile"
                      size="small"
                      required
                      helperText={!isValMob ? "Invalid mobile number" : ""}
                      error={!isValMob}
                      onChange={(e) => {
                        setIsValMob(PATTERNS.MOBILE.test(e.target.value));
                        if (e.target.value === "") setIsValMob(true);
                      }}
                      inputProps={{ maxLength: 10, minLength: 10 }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="PAN"
                      id="pan"
                      size="small"
                      required
                      inputProps={{ maxLength: 10 }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Aadhaar"
                      id="aadhaar"
                      size="small"
                      required
                      inputProps={{ maxLength: 12 }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Email ID"
                      id="emailId"
                      size="small"
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Bank Account Number"
                      id="bankAccountNo"
                      size="small"
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Bank IFSC"
                      id="bankIfsc"
                      size="small"
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    size="small"
                    control={
                      <Checkbox
                        sx={{
                          color: primaryColor(),
                          "&.Mui-checked": { color: primaryColor() },
                        }}
                        checked={isConsent}
                        onClick={() => setIsConsent(!isConsent)}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: "0.75rem" }}>
                        I hereby give my consent and submit voluntarily at my
                        own discretion, my Aadhaar Number or VID for the purpose
                        of establishing my identity on the portal. The Aadhaar
                        submitted herewith shall not be used for any purpose
                        other than mentioned, or as per the requirements of the
                        law.
                      </Typography>
                    }
                  />
                </Grid>
              </Grid>
            </Box>
            <ModalFooter
              form="outletRegistration"
              primaryActionLabel="Continue"
              onPrimaryAction={outletRegistration}
              secondaryActionLabel="Cancel"
              onSecondaryAction={handleClose}
              disable={request || !isConsent}
            />
          </Box>
        </Fade>
      </Modal>
      <VerifyOtpLogin
        resendOtpApi={outletRegistration}
        secureValidate={secureValidate}
        setSecureValidate={setSecureValidate}
        setUserRequest={setRequest}
        usedInSignUp={true}
        currentStep={3}
        btn={"Verify"}
        verifStepSuccRes={initiateData}
        otpRef={otpRef}
      />
    </Box>
  );
};

export default OutletRegistration;
