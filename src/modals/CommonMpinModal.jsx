import { FormControl, Grid, Modal } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import PinInput from "react-pin-input";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import ResetMpin from "./ResetMpin";
import AuthContext from "../store/AuthContext";
import { useContext } from "react";

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

const CommonMpinModal = ({
  open,
  setOpen,
  hooksetterfunc,
  radioPrevValue,
  mPinCallBack,

  title = "Enter MPIN",
}) => {
  const [err, setErr] = useState();
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const username = user && user.username;

  const handleClose = () => {
    setOpen(false);
    if (hooksetterfunc) hooksetterfunc(radioPrevValue);
    setErr(false);
  };

  const handleMpinCB = (value) => {
    if (mPinCallBack) mPinCallBack(value);
    setOpen(false);
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
          <ModalHeader title={title} handleClose={handleClose} />
          <Box
            component="form"
            id="forgotPass"
            noValidate
            autoComplete="off"
            sx={{
              "& .MuiTextField-root": { m: 2 },
            }}
          >
            <Grid container sx={{ pt: 1 }}>
              <Grid
                item
                md={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <FormControl>
                  <PinInput
                    length={6}
                    focus
                    type="password"
                    onChange={(value, index) => {
                      if (value.length === 6) {
                        handleMpinCB(value);
                      }
                      if (err !== "") {
                        setErr("");
                      }
                    }}
                    inputMode="text"
                    regexCriteria={/^[0-9]*$/}
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
            </Grid>
          </Box>
          <Grid
            item
            md={12}
            xs={12}
            sx={{ display: "flex", justifyContent: "end", pr: 4 }}
          >
            <ResetMpin variant="text" py mt username={username} />
          </Grid>
          <Grid
                item
                md={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                {err && err && (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                      fontSize: "12px",
                      px: 2,
                      color: "#DC5F5F",
                    }}
                  >
                    {err.message && err.message && (
                      <div>{err && err.message}</div>
                    )}

                    {err.data && err.message === "Invalid M Pin" && (
                      <div className="blink_text">
                        Attempts remaining:{err && 5 - Number(err.data)}
                      </div>
                    )}
                  </Box>
                )}
              </Grid>
          <ModalFooter btn="Cancel" handleClose={handleClose} />
        </Box>
      </Modal>
    </Box>
  );
};

export default CommonMpinModal;
