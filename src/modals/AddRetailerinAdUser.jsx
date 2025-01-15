import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { PATTERNS } from "../utils/ValidationUtil";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";
import { useEffect } from "react";
import { get, postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import VerifyOtpLogin from "./VerifyOtpLogin";
import { whiteColor } from "../theme/setThemeColor";

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

const AddRetailerinAdUser = ({ refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState();
  const [isMobv, setIsMobv] = useState(true);
  const [isEmailv, setIsEmailv] = useState(true);
  // const [username, setusername] = useState();
  const authCtx = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [vaidPass, setValidPass] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [secureValidate, setSecureValidate] = useState("");
  const [infoHandler, setinfoHandler] = useState();
  const [adUserData, setAdUserData] = useState();

  useEffect(() => {
    setDisableSubmit(!(isMobv && isEmailv && vaidPass));
  }, [isMobv, isEmailv, vaidPass]);
  const user = authCtx?.user;

  const getHandlerInfo = (number) => {
    // console.log("called");
    get(
      ApiEndpoints.GET_HANDLER_DETAILS,
      // { role: role === "Ad" ? "Asm" : "", username: number },
      `username=${user?.username}`,
      setRequest,
      (res) => {
        setinfoHandler(res.data.data);
      },
      (err) => {}
    );
  };

  const handleOpen = () => {
    getHandlerInfo();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    let data = {};
    data = {
      name: `${form.fname.value} ${form.lname.value}`,
      username: form.mob.value,
      email: form.email.value,
      password: form.pass.value,
      ad_id: infoHandler ? infoHandler?.id : `${user?.username}`,
      role: "Ret",
    };

    // console.log("data", data);

    postJsonData(
      ApiEndpoints.USER_REG,
      data,
      setRequest,
      (res) => {
        setSecureValidate("adAdd");
        okSuccessToast(res.data.message);
        setAdUserData(res?.data?.data);
      },
      (err) => {
        apiErrorToast(err);
        // setSecureValidate("OTP");
      }
    );
  };

  return (
    <Box>
      {/* <Tooltip title="Add retailer">
        <IconButton color="secondary" onClick={handleOpen}>
          <AddCircleOutlineIcon />
        </IconButton>
      </Tooltip> */}
         <Tooltip title=" Add retailer">
          <Button
            variant="outlined"
            // className="button-transparent"
            className="refresh-icon-risk"
            onClick={handleOpen}
            startIcon={
              <IconButton
                sx={{
                  p: 0,

                  color: whiteColor(),
                }}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            }
            sx={{ py: 0.3 }}
          >
     Add retailer
          </Button>
        </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title="Add Retailer" handleClose={handleClose} />
          <Box
            component="form"
            id="addRet"
            validate
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": { m: 1 },
              objectFit: "contain",
              overflowY: "scroll",
            }}
          >
            <Grid container style={{ marginTop: "10px" }} spacing={2}>
              <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                <FormControl
                  md={12}
                  sx={{ width: "100%", background: "white", color: "#1692ff" }}
                >
                  <TextField autoComplete="off"
                    label="First Name"
                    id="fname"
                    size="small"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                <FormControl
                  md={12}
                  sx={{ width: "100%", background: "white", color: "#1692ff" }}
                >
                  <TextField autoComplete="off"
                    label="Last Name"
                    id="lname"
                    size="small"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                <FormControl
                  md={12}
                  sx={{ width: "100%", background: "white", color: "#1692ff" }}
                >
                  <TextField autoComplete="off"
                    label="Mobile"
                    id="mob"
                    size="small"
                    required
                    type="number"
                    error={!isMobv}
                    helperText={!isMobv ? "Enter valid Mobile" : ""}
                    onChange={(e) => {
                      setIsMobv(PATTERNS.MOBILE.test(e.target.value));
                      if (e.target.value === "") setIsMobv(true);
                      // if (setusername) setusername(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "+" || e.key === "-") e.preventDefault();
                      if (e.target.value.length === 10) {
                        if (e.key.toLowerCase() !== "backspace")
                          e.preventDefault();
                        if (e.key.toLowerCase() === "backspace") {
                        }
                      }
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                <FormControl
                  md={12}
                  sm={12}
                  xs={12}
                  sx={{ width: "100%", background: "white", color: "#1692ff" }}
                >
                  <TextField autoComplete="off"
                    label="Email id"
                    id="email"
                    size="small"
                    required
                    error={!isEmailv}
                    helperText={!isEmailv ? "Enter valid Email" : ""}
                    onChange={(e) => {
                      setIsEmailv(PATTERNS.EMAIL.test(e.target.value));
                      if (e.target.value === "") setIsEmailv(true);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                lg={6}
                md={6}
                sm={12}
                xs={12}
                sx={{ mt: 2, ml: { md: 1, xs: 0 } }}
              >
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ width: "95%", background: "white", color: "#1692ff" }}
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="pass"
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                    error={!vaidPass}
                    helperText={!vaidPass ? "Enter valid Password" : ""}
                    onChange={(e) => {
                      setValidPass(PATTERNS.PASSWORD.test(e.target.value));
                      if (e.target.value === "") setValidPass(true);
                    }}
                  />
                </FormControl>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "10px",
                    color: "black",
                    fontWeight: "bold",

                    textAlign: "left",
                  }}
                >
                  (*Note: Password must be alphanumeric, With One Special
                  Character, min 8 characters)
                </Typography>
              </Grid>
            </Grid>
          </Box>
          {/* <ModalFooter form="addRet" request={request} btn="Add" /> */}
          <ModalFooter form="addRet" btn="Add" disable={disableSubmit} />
        </Box>
      </Modal>
      <VerifyOtpLogin
        secureValidate={secureValidate}
        setSecureValidate={setSecureValidate}
        setUserRequest={setRequest}
        adUserData={adUserData}
        btn="Proceed"
        usedInSignUp
        showLaoder={false}
      />
    </Box>
  );
};

export default AddRetailerinAdUser;
