import React from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  Modal,
  TextField,
} from "@mui/material";
import { useState } from "react";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { PATTERNS } from "../utils/ValidationUtil";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "max-content",
};

const UsernameChangeModal = ({ uname, disabled }) => {
  const [isUsernameOtp, setIsUsernameOtp] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [username, setUsername] = useState(uname);
  // const [name, setName] = useState(
  //   remitterStatus && remitterStatus.firstName + " " + remitterStatus.lastName
  // );
  const [isMobV, setIsMobV] = useState(true);
  const [otp, setOtp] = useState("");
  const [oldOtp, setOldOtp] = useState("");
  const [otpRefId, setOtpRefId] = useState("");
  const [progress, setProgress] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const requestOtp = (e) => {
    e.preventDefault();
    let data;
    data = {
      newUsername: username,
    };
    postJsonData(
      ApiEndpoints.CHANGE_USERNAME_OTP,
      data,
      setProgress,
      (res) => {
        const data = res.data;
        setIsUsernameOtp(true);
        setOtpRefId(data.otp_ref_id);
        okSuccessToast(data.message);
      },
      (err) => {
        apiErrorToast(err.message);
      }
    );
  };
  //
  const handleOtpLogin = (e) => {
    e.preventDefault();
    let data;

    data = {
      otp: otp,
      otpReference: otpRefId,
    };

    postJsonData(
      ApiEndpoints.CHANGE_USERNAME,
      data,
      setProgress,
      (res) => {
        const data = res.data;
        setOpen();
        okSuccessToast(data.message);
      },
      (err) => {
        apiErrorToast(err.message);
      }
    );
  };
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "top",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <TextField autoComplete="off"
            disabled={true}
            id="username"
            label="Username"
            size="small"
            value={uname}
            // value={name}
            sx={{
              backgroundColor: "#F2F3F5",
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    color="primary"
                    variant="text"
                    size="small"
                    onClick={() => {
                      handleOpen();
                    }}
                    disabled={disabled}
                  >
                    change
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </Box>
      {/* modal */}

      <Modal open={open}>
        <Box sx={style} className="sm_modal">
          <ModalHeader title="Change Username" handleClose={handleClose} />
          <Box
            component="form"
            id="change_number"
            autoComplete="off"
            validate
            onSubmit={isUsernameOtp ? handleOtpLogin : requestOtp}
            sx={{
              "& .MuiTextField-root": { m: 2 },
              // objectFit: "contain",
              // width: "100%",
              // height: "auto",
              // overflowY: "scroll",
              // position: "relative",
            }}
          >
            <Grid container sx={{ pt: 1 }}>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    id="username"
                    label="Username"
                    size="small"
                    type="number"
                    onChange={(e) => {
                      setIsMobV(PATTERNS.MOBILE.test(e.target.value));
                      setUsername(e.target.value);
                      if (e.target.value === "") setIsMobV(true);
                    }}
                    required
                    value={username}
                    error={!isMobV}
                    helperText={!isMobV ? "Enter valid username" : ""}
                    disabled
                  />
                </FormControl>
              </Grid>
              {isUsernameOtp && (
                <div>
                  {" "}
                  <Grid item md={12} xs={12}>
                    <FormControl fullWidth>
                      <TextField autoComplete="off"
                        id="otp"
                        type="text"
                        label="Enter Old Username OTP"
                        size="small"
                        value={oldOtp}
                        required
                        onChange={(e) => {
                          setOldOtp(e.target.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <FormControl fullWidth>
                      <TextField autoComplete="off"
                        id="otp"
                        type="text"
                        label="Enter New Username OTP"
                        size="small"
                        value={otp}
                        required
                        onChange={(e) => {
                          setOtp(e.target.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </div>
              )}
            </Grid>
            <ModalFooter
              form="change_number"
              request={progress}
              btn={isUsernameOtp ? "Verify OTP" : "Get OTP"}
            />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default UsernameChangeModal;
