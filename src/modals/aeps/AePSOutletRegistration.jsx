import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  Grid,
  FormControl,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ApiEndpoints from "../../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../../utils/ToastUtil";
import { postJsonData } from "../../network/ApiController";
import Loader from "../../component/loading-screen/Loader";
import { primaryColor } from "../../theme/setThemeColor";
import { useState } from "react";
import { PATTERNS } from "../../utils/ValidationUtil";
import ModalHeader from "../ModalHeader";
import ModalFooter from "../ModalFooter";
import { useContext } from "react";
import AuthContext from "../../store/AuthContext";
import VerifyOtpLogin from "../VerifyOtpLogin";
import { AEPS_TYPE } from "../../utils/constants";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "max-content",
  overflowY: "scroll",
};

const AePSOutletRegistration = ({ open, setOpen, refresh, aepsType }) => {
  const currentStep = 3;
  // const [open, setOpen] = useState(false);
  const [isConsent, setIsConsent] = useState(false);
  const [isValMob, setIsValMob] = useState(true);
  const [request, setRequest] = useState(false);
  const [initiateData, setInitiateData] = useState();
  const user = useContext(AuthContext);
  const userLat = user.location.lat && user.location.lat;
  const userLong = user.location.long && user.location.long;
  const [secureValidate, setSecureValidate] = useState("");
  const [tempData, setTempData] = useState();
  const [otpRef, setOtpRef] = useState("");
  const handleClose = () => {
    setOpen(false);
    setIsValMob(true);
    setIsConsent(false);
  };

  const outletRegistration = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      mobile: form.mobile.value,
      pan: form.pan.value,
      aadhaar: form.aadhaar.value,
      email: form.emailId.value,
      bankAccountNo: form.bankAccountNo.value,
      bankIfsc: form.bankIfsc.value,
      latitude: userLat,
      longitude: userLong,
    };
    setTempData(data);
    postJsonData(
      ApiEndpoints.AEPS_INITIATE,
      data,
      setRequest,
      (res) => {
        okSuccessToast(res?.data?.message);
        setInitiateData(res?.data?.data);
        setOtpRef(res?.data?.data?.otpReferenceID);
        setSecureValidate("OTP");
        // handleClose();
        if (refresh) refresh();
      },
      (error) => {
        apiErrorToast(error);
        // handleClose();
      }
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <Modal
        open={open === AEPS_TYPE.AEPS1}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <Loader loading={request} />
          <ModalHeader title="Outlet Registration" handleClose={handleClose} />
          <Box
            component="form"
            id="outletRegistration"
            validate
            autoComplete="off"
            onSubmit={outletRegistration}
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
          >
            <Grid container sx={{ pt: 1 }}>
              <Grid item xs={12}>
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

              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Email ID"
                    id="emailId"
                    size="small"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Bank account number"
                    id="bankAccountNo"
                    size="small"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Bank IFSC"
                    id="bankIfsc"
                    size="small"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <FormControlLabel
                  size="small"
                  control={
                    <Checkbox
                      sx={{
                        color: primaryColor(),
                        "&.Mui-checked": {
                          color: primaryColor(),
                        },
                      }}
                      defaultChecked={isConsent}
                      onClick={() => {
                        setIsConsent(!isConsent);
                      }}
                    />
                  }
                  label={
                    <span style={{ fontSize: "0.7rem" }}>
                      I hereby give my consent and submit voluntarily at my own
                      discretion, my Aadhaar Number or VID for the purpose of
                      establishing my identity on the portal. The Aadhaar
                      submitted herewith shall not be used for any purpose other
                      than mentioned, or as per the requirements of the law.
                    </span>
                  }
                />
              </Grid>
            </Grid>
          </Box>
          <ModalFooter
            form="outletRegistration"
            request={request}
            btn="Continue"
            disable={request || !isConsent}
          />
        </Box>
      </Modal>
      <VerifyOtpLogin
        secureValidate={secureValidate}
        setSecureValidate={setSecureValidate}
        setUserRequest={setRequest}
        currentStep={currentStep}
        btn="Proceed"
        usedInSignUp
        otpRef={otpRef}
        verifStepSuccRes={initiateData}
        data={tempData}
        showLaoder={false}
      />
    </Box>
  );
};
export default AePSOutletRegistration;
