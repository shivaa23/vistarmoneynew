import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  FormControl,
  Grid,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { postJsonData } from "../network/ApiController";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Loader from "../component/loading-screen/Loader";
import CommonMpinModal from "./CommonMpinModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "max-content",
  overflowY: "scroll",
};

const ChangePass = ({ refresh }) => {
  const [open, setOpen] = React.useState(false);
  const [showPass, setShowPass] = useState(0);
  const [showNewPass, setShowNewPass] = useState(0);
  const [showNewPass1, setShowNewPass1] = useState(0);
  const [passMatched, setPassMatched] = useState(true);
  const [request, setRequest] = React.useState(false);
  const [MpinCallBackVal, setMpinCallBackVal] = useState(false);
  const [openMpin, setOpenMpin] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setMpinCallBackVal(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      old_password: form.old_pass.value,
      password: form.new_pass.value,
      password_confirmation: form.new_pass1.value,
      mpin: MpinCallBackVal && MpinCallBackVal * 1,
    };
    if (data.newPass !== data.newPass1) {
      apiErrorToast("New Password doest not matched");
    } else if (!MpinCallBackVal || MpinCallBackVal.length < 6) {
      apiErrorToast("Mpin Required");
    } else {
      setRequest(true);
      postJsonData(
        ApiEndpoints.CHANGE_PASS,
        data,
        setRequest,
        (res) => {
          okSuccessToast("Password changed successfully");
          handleClose();
          if (refresh) refresh();
        },
        (error) => {
          apiErrorToast(error);
          handleClose();
        }
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Button
        className="button-Red"
        variant="contained"
        style={{ fontSize: "10px" }}
        onClick={handleOpen}
      >
        Change Password
      </Button>

      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <Loader loading={request} />
            <ModalHeader title="Change Password" handleClose={handleClose} />
            <Box
              component="form"
              id="forgotPass"
              validate
              autoComplete="off"
              onSubmit={handleSubmit}
              sx={{
                "& .MuiTextField-root": { m: 2 },
              }}
            >
              <Grid container sx={{ pt: 1 }}>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      autoComplete="off"
                      label="Enter Old Password"
                      id="old_pass"
                      size="small"
                      type={showPass === 0 ? "password" : "text"}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {showPass === 0 ? (
                              <FontAwesomeIcon
                                icon={faEyeSlash}
                                onClick={() => {
                                  setShowPass(1);
                                }}
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={faEye}
                                onClick={() => {
                                  setShowPass(0);
                                }}
                              />
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      autoComplete="off"
                      label="Enter New Password"
                      id="new_pass"
                      size="small"
                      type={showNewPass === 0 ? "password" : "text"}
                      required
                      error={!passMatched}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {showNewPass === 0 ? (
                              <FontAwesomeIcon
                                icon={faEyeSlash}
                                onClick={() => {
                                  setShowNewPass(1);
                                }}
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={faEye}
                                onClick={() => {
                                  setShowNewPass(0);
                                }}
                              />
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      autoComplete="off"
                      label="Enter New Password"
                      id="new_pass1"
                      size="small"
                      type={showNewPass1 === 0 ? "password" : "text"}
                      required
                      error={!passMatched}
                      onChange={(event) => {
                        if (
                          document.getElementById("new_pass").value !==
                          event.target.value
                        ) {
                          setPassMatched(false);
                        } else if (
                          document.getElementById("new_pass").value ===
                          event.target.value
                        ) {
                          setPassMatched(true);
                        }
                        if (!event.target.value) {
                          setPassMatched(true);
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {showNewPass1 === 0 ? (
                              <FontAwesomeIcon
                                icon={faEyeSlash}
                                onClick={() => {
                                  setShowNewPass1(1);
                                }}
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={faEye}
                                onClick={() => {
                                  setShowNewPass1(0);
                                }}
                              />
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            <ModalFooter
              form="forgotPass"
              type={MpinCallBackVal ? "submit" : "button"}
              request={request}
              btn={MpinCallBackVal ? "Update" : "Continue"}
              onClick={() => {
                if (!MpinCallBackVal) setOpenMpin(true);
              }}
              disable={request}
            />
          </Box>
        </Modal>
      </Box>
      <CommonMpinModal
        open={openMpin}
        setOpen={setOpenMpin}
        mPinCallBack={(mPinValue) => {
          setMpinCallBackVal(mPinValue);
        }}
      />
    </Box>
  );
};
export default ChangePass;
