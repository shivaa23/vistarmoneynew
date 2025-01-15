import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FormControl, Grid } from "@mui/material";
import ModalHeader from "../ModalHeader";
import ModalFooter from "../ModalFooter";
import PinInput from "react-pin-input";
import { useState } from "react";
import Loader from "../../component/loading-screen/Loader";
import { postJsonData } from "../../network/ApiController";
import ApiEndpoints from "../../network/ApiEndPoints";
import { apiErrorToast } from "../../utils/ToastUtil";
import { useEffect } from "react";
import MachineRequestModal from "./MachineRequestModal";

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

const Aeps2VerifyOtpModal = ({
  btn = "Login",
  primaryKeyId,
  encodeFPTxnId,
  setPrimaryKeyId,
  identifier,
}) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState();
  const [machineModalOpen, setMachineModalOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setPrimaryKeyId(false);
    setErr("");
    setOtp("");
  };

  useEffect(() => {
    if (primaryKeyId) {
      setOpen(true);
    }

    return () => {};
  }, [primaryKeyId]);

  const validateOtp = (event) => {
    event.preventDefault();
    const formData = {
      otp: otp,
      primaryKeyId: primaryKeyId,
      encodeFPTxnId: encodeFPTxnId,
    };
    const queryString = Object.keys(formData)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(formData[key])}`
      )
      .join("&");

    postJsonData(
      `${ApiEndpoints.AEPS2_VALIDATEOTP}?${queryString}`,
      "",
      setRequest,
      (res) => {
        setMachineModalOpen(true);
        setOpen(false);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };
  // const resendOtpFunc = () => {
  //   postJsonData(
  //     ApiEndpoints.RESEND_OTP,
  //     { username },
  //     setRequest,
  //     (res) => {
  //       okSuccessToast(res.data.message);
  //       setIsResend(true);
  //     },
  //     (err) => {
  //       apiErrorToast(err);
  //       setIsResend(false);
  //     }
  //   );
  // };

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
          <Loader loading={request} />
          <ModalHeader
            title={"Enter OTP to continue registration"}
            handleClose={handleClose}
          />
          <Box
            component="form"
            id="Aeps2VerifyOtpModal"
            noValidate
            autoComplete="off"
            onSubmit={validateOtp}
            sx={{
              "& .MuiTextField-root": { m: 2 },
            }}
          >
            <Grid container sx={{ pt: 1 }}>
              <Grid
                item
                md={12}
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl>
                  <PinInput
                    length={7}
                    focus
                    type="text"
                    onChange={(value, index) => {
                      if (err !== "") {
                        setErr("");
                      }
                      setOtp(value);
                    }}
                    regexCriteria={/^[0-9]*$/}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <ModalFooter form="Aeps2VerifyOtpModal" btn={btn} />
        </Box>
      </Modal>
      <MachineRequestModal
        machineModalOpen={machineModalOpen}
        setMachineModalOpen={setMachineModalOpen}
        primaryKeyId={primaryKeyId}
        encodeFPTxnId={encodeFPTxnId}
        setPrimaryKeyId={setPrimaryKeyId}
        identifier={identifier}
      />
    </Box>
  );
};
export default Aeps2VerifyOtpModal;
