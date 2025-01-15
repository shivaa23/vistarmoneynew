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
import { useEffect } from "react";

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

const NameChangeModal = ({ remitterStatus, rem_mobile, getRemitterStatus }) => {
  const [isNameOtp, setIsNameOtp] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  // const [name, setName] = useState(
  //   remitterStatus && remitterStatus.firstName + " " + remitterStatus.lastName
  // );

  const [otp, setOtp] = useState("");
  const [otpRefId, setOtpRefId] = useState("");
  const [progress, setProgress] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  //
  const handleClose = () => setOpen(false);
  useEffect(() => {
    setFirstName(
      remitterStatus && remitterStatus.firstName
        ? remitterStatus.firstName
        : remitterStatus.fname
    );
    setLastName(
      remitterStatus && remitterStatus.lastName
        ? remitterStatus.lastName
        : remitterStatus.lname
    );
  }, [remitterStatus]);
  //
  //
  const requestOtp = (e) => {
    e.preventDefault();
    let data;
    data = {
      number: remitterStatus && remitterStatus.mobile,
      first_name: firstName,
      last_name: lastName,
    };
    postJsonData(
      ApiEndpoints.CHANGE_NAME_OTP,
      data,
      setProgress,
      (res) => {
        const data = res.data;
        setIsNameOtp(true);
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
      ApiEndpoints.CHANGE_NAME,
      data,
      setProgress,
      (res) => {
        const data = res.data;

        setOpen(false);
        setIsNameOtp(false);
        okSuccessToast(data.message);
        if (getRemitterStatus) getRemitterStatus(rem_mobile);
        setOtp("");
      },
      (err) => {
        apiErrorToast(err.message);
      }
    );
  };
  // /////////
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
            id="name"
            label="Name"
            size="small"
            // inputRef={isUserEmailValid}
            // onChange={(e) => {
            //   setName(e.target.value);
            // }}
            value={remitterStatus && firstName + " " + lastName}
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
          <ModalHeader title="Change Name" handleClose={handleClose} />
          <Box
            component="form"
            id="change_name"
            autoComplete="off"
            validate
            onSubmit={isNameOtp ? handleOtpLogin : requestOtp}
            sx={{
              "& .MuiTextField-root": { m: 2 },
              objectFit: "contain",
              width: "100%",
              height: "auto",
              overflowY: "scroll",
              position: "relative",
            }}
          >
            <Grid container sx={{ pt: 1 }}>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    id="f_name"
                    label="Enter First Name"
                    size="small"
                    // inputRef={isUserEmailValid}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                    required
                    value={firstName}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    id="l_name"
                    label="Enter Last Name"
                    size="small"
                    // inputRef={isUserEmailValid}
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                    required
                    value={lastName}
                  />
                </FormControl>
              </Grid>
              {isNameOtp && (
                <Grid item md={12} xs={12}>
                  <FormControl fullWidth>
                    <TextField autoComplete="off"
                      id="otp"
                      type="text"
                      label="Enter OTP"
                      size="small"
                      value={otp}
                      required
                      onChange={(e) => {
                        setOtp(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
              )}
            </Grid>
            <ModalFooter
              form="change_name"
              request={progress}
              btn={isNameOtp ? "Verify OTP" : "Get OTP"}
            />
            {/* <ModalFooter
              handleClose={handleClose}
              form="change_Phone"
              request={progress}
              isOtp={isNameOtp}
            /> */}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default NameChangeModal;
