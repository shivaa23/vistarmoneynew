import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button, FormControl, Grid, TextField } from "@mui/material";
import ApiEndpoints from "../network/ApiEndPoints";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { postJsonData } from "../network/ApiController";
import { useState } from "react";
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
  height: "max-content",
  overflowY: "scroll",
  p: 2,
};

const ForgotPass = ({ refresh, username, setUsername }) => {
  const [open, setOpen] = useState(false);
  const [isMobV, setIsMobV] = useState(true);
  const [request, setRequest] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (username.length < 10) {
      setIsMobV(false);
    } else {
      const form = event.currentTarget;
      const data = {
        // username: form.username.value,
        username: username,
      };
      setRequest(true);
      postJsonData(
        ApiEndpoints.FORGOT_PASS,
        data,
        setRequest,
        (res) => {
          okSuccessToast("Password sent to registered mobile number");
          handleClose();
          // if (refresh) refresh();
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
        justifyContent: "end",
      }}
    >
      <Button
        // className="otp-hover-purple"
        // style={{
        //   color: "#fff",
        //   fontSize: "14px",
        //   textTransform: "capitalize",
        //   padding: "2px 8px",
        // }}
        sx={{
          color: "red",
          fontSize: "10px",
          fontFamily: "Manrope",
          fontWeight: "bold",
          mt: 2,
        }}
        onClick={handleOpen}
      >
        <u>Forgot Password?</u>
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title="Forgot Password" handleClose={handleClose} />
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
            <Grid
              container
              sx={{ pt: 1, display: "flex", justifyContent: "center" }}
            >
              <Grid item md={10} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Enter Registered Mobile number"
                    id={username}
                    size="small"
                    type="number"
                    value={username}
                    required
                    error={!isMobV}
                    helperText={!isMobV ? "Enter valid Username" : ""}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      const targetValue = e ? e.target.value : username;
                      setIsMobV(PATTERNS.MOBILE.test(targetValue));
                      if (targetValue === "") setIsMobV(true);
                    }}
                    onKeyDown={(e) => {
                      const targetValue = e ? e.target.value : username;
                      if (e.key === "+" || e.key === "-") {
                        e.preventDefault();
                      }
                      if (targetValue.length === 10) {
                        if (e.key.toLowerCase() !== "backspace")
                          e.preventDefault();
                        if (e.key.toLowerCase() === "backspace") {
                        }
                      }
                      // setUsername(e.target.value);
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <ModalFooter
            form="forgotPass"
            request={request}
            btn="Submit"
            disable={!isMobV}
          />
        </Box>
      </Modal>
    </Box>
  );
};
export default ForgotPass;
