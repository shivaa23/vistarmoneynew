import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button, FormControl, Grid, TextField } from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import PinInput from "react-pin-input";
import { useState } from "react";
import Loader from "../component/loading-screen/Loader";
import { get, getAxios, postJsonData } from "../network/ApiController";
import ApiEndpoints, { BASE_URL } from "../network/ApiEndPoints";
import AuthContext from "../store/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  apiErrorToast,
  confirmButtonSwal,
  okSuccessToast,
} from "../utils/ToastUtil";
import ResetMpin from "./ResetMpin";
import { useEffect } from "react";
import TimerButton from "../component/TimerButton";
import useCommonContext from "../store/CommonContext";
import { otherTokenApiCallPost } from "../utils/otherTokenApiCall";

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
const DmrVrifyNewUser = ({
  rem_mobile,
  getRemitterStatus,
  view,
  verifyotp,
  apiEnd,
  otpRefId,
  setOtpRefId,
  setVerifyotp,
  dmtValue,
  dmr2RemRes
  
}) => {
  const [open, setOpen] = useState(true);
  const [request, setRequest] = useState(false);

  const [mobile, setMobile] = useState(rem_mobile);
useEffect(() => {
setOpen(true)
  return () => {
  }
}, [verifyotp])
console.log("dmr2RemRes----dmr2RemRes",dmr2RemRes);
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
    setOpen(false);
    setOtpRefId("");
    setMobile(null)
    setVerifyotp(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    const data = {
      otp: form.otp.value,
      ...(view === "expressTransfer"
        ? { rem_number: rem_mobile }
        : { otpReference: otpRefId }),
    };

    const dmt2Data={
      ...dmr2RemRes,
      otp: form.otp.value,

    }
    console.log("he;llo",dmt2Data);
    postJsonData(
      dmtValue === "express" ? ApiEndpoints.VALIDATE_EXP_OTP : apiEnd,
      dmtValue=="dmt2"?dmt2Data:data,
      setRequest,
      (res) => {
        console.log("verify dmt2 remitter-",res?.data?.message);
        const msg=res?.data?.message?res?.data?.message:"Remitter Found"
        okSuccessToast("SUCCESS",msg)
        if (getRemitterStatus) {
          getRemitterStatus(rem_mobile);
        }
        handleClose();
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title="Verify Remitter" handleClose={handleClose} />
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
                    disabled={rem_mobile?true:false}
                    inputProps={{ maxLength: "10" }}
                    onChange={(e) => {
                      setMobile(e.target.value);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Enter OTP"
                    id="otp"
                    size="small"
                    required
                    inputProps={{ maxLength: 6 }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <ModalFooter form="add_rem" request={request} />
        </Box>
      </Modal>
    </Box>
  );
};
export default DmrVrifyNewUser;
