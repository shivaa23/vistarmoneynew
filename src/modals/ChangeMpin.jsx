import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FormControl, Grid, Button } from "@mui/material";
import ApiEndpoints from "../network/ApiEndPoints";
import { postJsonData } from "../network/ApiController";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import PinInput from "react-pin-input";
import { useState } from "react";
import Loader from "../component/loading-screen/Loader";

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

const ChangeMpin = ({ refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [oldMpin, setOldMpin] = useState(false);
  const [newMpin, setNewMpin] = useState(false);
  const [err, setErr] = useState();
  const [attemptsErr, setAttemptsErr] = useState();

  const [newMpinError, setNewMpinError] = useState();
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setOldMpin(false);
    setNewMpin(false);
    setErr(false);
    setNewMpinError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      old_mpin: oldMpin && oldMpin,
      new_mpin: newMpin && newMpin,
    };
    if (!oldMpin || oldMpin.length < 6) {
      setErr("Enter old Mpin before proceeding");
      event.stopPropagation();
    }
    if (!newMpin || newMpin.length < 6) {
      setNewMpinError("Enter Mpin before proceeding");
      event.stopPropagation();
    } else if (oldMpin === newMpin) {
      setNewMpinError("Old and New M-PIN can not be same");
      event.stopPropagation();
    } else if (data.newPass !== data.newPass1) {
      apiErrorToast("New Password doest not matched");
    } else if (oldMpin && newMpin) {
      setRequest(true);
      postJsonData(
        ApiEndpoints.CHANGE_MPIN,
        data,
        setRequest,
        (res) => {
          okSuccessToast("MPIN changed successfully");
          handleClose();
          if (refresh) refresh();
        },
        (error) => {
          if (error.response.data.message === "Invalid M Pin") {
            setAttemptsErr(error.response.data);
          } else {
            apiErrorToast(error);
            if (refresh) refresh();
          }
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
        variant="contained"
        className="button-Red"
        style={{
          fontSize: "10px",
          marginLeft: "5px",
        }}
        onClick={handleOpen}
      >
        Change MPIN
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <Loader loading={request} />
          <ModalHeader title="Change MPIN" handleClose={handleClose} />
          <Box
            component="form"
            id="forgotPass"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
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
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    Old M-PIN
                  </div>
                  <PinInput
                    length={6}
                    focus
                    type="password"
                    onChange={(value, index) => {
                      if (err !== "") {
                        setErr("");
                      }
                      setOldMpin(value);
                    }}
                    inputMode="text"
                    regexCriteria={/^[0-9]*$/}
                    inputStyle={{
                      width: "40px",
                      height: "40px",
                      marginRight: { xs: "3px", md: "5px" },
                      textAlign: "center",
                      borderRadius: "0",
                      border: "none",
                      borderBottom: "1px solid #000",
                      padding: "5px",
                      outline: "none",
                    }}
                  />
                </FormControl>
              </Grid>
              {err && err && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                    ml: 5,
                    fontSize: "12px",
                    px: 2,
                    color: "#DC5F5F",
                  }}
                >
                  {err && <div>{err && err}</div>}
                </Box>
              )}
              <Grid
                item
                md={12}
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  >
                    New M-PIN
                  </div>
                  <PinInput
                    length={6}
                    type="password"
                    onChange={(value, index) => {
                      if (newMpinError !== "") {
                        setNewMpinError("");
                      }
                      setNewMpin(value);
                    }}
                    inputMode="text"
                    regexCriteria={/^[0-9]*$/}
                    inputStyle={{
                      width: "40px",
                      height: "40px",
                      marginRight: { xs: "3px", md: "5px" },
                      textAlign: "center",
                      borderRadius: "0",
                      border: "none",
                      borderBottom: "1px solid #000",
                      padding: "5px",
                      outline: "none",
                    }}
                  />
                </FormControl>
              </Grid>
              {newMpinError && newMpinError && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                    ml: 5,
                    fontSize: "12px",
                    px: 2,
                    color: "#DC5F5F",
                  }}
                >
                  {newMpinError}
                </Box>
              )}
            </Grid>
            {attemptsErr && attemptsErr && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 2,
                  fontSize: "12px",
                  px: 2,
                  color: "#DC5F5F",
                }}
              >
                {attemptsErr.message && attemptsErr.message && (
                  <div>{attemptsErr && attemptsErr.message}</div>
                )}

                {attemptsErr.data && attemptsErr.data && (
                  <div className="blink_text">
                    Attempts remaining:
                    {attemptsErr && 5 - Number(attemptsErr.data)}
                  </div>
                )}
              </Box>
            )}
            <ModalFooter
              form="forgotPass"
              request={request || err || newMpinError}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
export default ChangeMpin;
