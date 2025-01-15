import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  FormControl,
  Grid,
  TextField,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import ApiEndpoints from "../network/ApiEndPoints";
import { get, postJsonData } from "../network/ApiController";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { useState } from "react";
import PinInput from "react-pin-input";
import CallMadeIcon from "@mui/icons-material/CallMade";
import ResetMpin from "./ResetMpin";
import Loader from "../component/loading-screen/Loader";
import useCommonContext from "../store/CommonContext";
import { PATTERNS } from "../utils/ValidationUtil";
import { validateApiCall } from "../utils/LastApiCallChecker";
import AuthContext from "../store/AuthContext";

const SendMoneyModal = ({ refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [mpin, setMpin] = useState("");
  const [err, setErr] = useState();
  const [isMobv, setIsMobv] = useState(true);
  const { getRecentData } = useCommonContext();
  const [usernameAdded, setUsernameAdded] = useState(false);
  const [getUser, setGetUser] = useState("");
  const [amount, setAmount] = useState("");
  const authCtx = React.useContext(AuthContext);
  const user = authCtx.user;
  const userLat = authCtx.location.lat;
  const userLong = authCtx.location.long;
  const fetchUser = (mobile) => {
    get(
      ApiEndpoints.GET_USER_BY_USERNAME,
      `username=${mobile}`,
      setRequest,
      (res) => {
        if (res && res.data && res.data) {
          setGetUser(res.data.data);
          setUsernameAdded(true);
        } else setGetUser();
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // width: "40%",
    boxShadow: 24,
    fontFamily: "Poppins",
    height: "max-content",
    overflowY: "scroll",
    p: 2,
  };
  console.log("amount", amount);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setUsernameAdded(false);
    setErr("");
    setMpin("");
    setGetUser("");
    setOpen(false);
  };
  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);

    if (value === "") {
      setErr("Amount is required.");
    } else if (value < 10) {
      setErr("Amount must be at least 10.");
    } else if (value > 100000000) {
      setErr("Amount must not exceed 10 crores.");
    } else {
      setErr("");
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    // Prepare the payload
    const data = {
      to_id: getUser?.id, // Safely access user ID
      pf: "WEB",
      req_type: "OTHER",
      amount: amount, // Use the correct amount variable
      mpin: mpin,
      latitude: userLat,
      longitude: userLong,
    };

    if (!mpin) {
      setErr({ message: "MPIN required." });
      setMpin(""); // Clear MPIN input
      return;
    }

    if (validateApiCall()) {
      postJsonData(
        ApiEndpoints.MONEY_TRANSFER,
        data,
        setRequest,
        (res) => {
          getRecentData();
          okSuccessToast("Amount Transfer Successful");
          handleClose();
          setMpin("");
          setErr("");

          setAmount("");
          setGetUser("");
          setUsernameAdded(false);

          if (refresh) refresh();
        },
        (error) => {
          setMpin("");
          setErr("");
          if (error?.response?.data?.message === "Invalid M Pin") {
            setErr(error.response.data);
          } else {
            apiErrorToast(error);
          }
        }
      );
    } else {
      setErr({ message: "Kindly wait some time before another request." });
      setMpin("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        // justifyContent: "end",
      }}
    >
      <IconButton onClick={handleOpen} sx={{ display: "contents" }}>
        <Tooltip title="Send Money" placement="top">
          <CallMadeIcon
            className="hover-white hover-zoom"
            size="1.3rem"
            sx={{ color: "#D53E3E", fontWeight: "bold" }}
          />
        </Tooltip>
      </IconButton>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <Loader loading={request} />
          <ModalHeader title="Send Money" handleClose={handleClose} />

          <Box
            component="form"
            id="money_transfer"
            validate
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": { m: 2 },
            }}
          >
            <Grid container sx={{ pt: 1 }}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Mobile"
                    id="mobile"
                    size="small"
                    type="tel"
                    inputProps={{
                      form: {
                        autocomplete: "off",
                      },
                      maxLength: 10,
                    }}
                    onKeyDown={(e) => {
                      if ((e.which >= 65 && e.which <= 90) || e.key === "+") {
                        e.preventDefault();
                      }
                      if (e.target.value.length === 10) {
                        if (e.key.toLowerCase() !== "backspace") {
                          e.preventDefault();
                        }

                        if (e.key.toLowerCase() === "backspace") {
                        }
                      }
                    }}
                    error={!isMobv}
                    helperText={!isMobv ? "Enter valid Mobile" : ""}
                    onChange={(e) => {
                      setIsMobv(PATTERNS.MOBILE.test(e.target.value));
                      if (e.target.value === "") setIsMobv(true);
                      if (PATTERNS.MOBILE.test(e.target.value)) {
                        if (e.target.value.length === 10) {
                          fetchUser(e.target.value);
                        } else {
                          setUsernameAdded(false);
                          setGetUser("");
                        }
                      }
                    }}
                    required
                  />
                </FormControl>
              </Grid>
              {usernameAdded && usernameAdded ? (
                <Grid item md={12} xs={12}>
                  <Box
                    id="userData"
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="Name"
                        id="name"
                        size="small"
                        defaultValue={getUser && getUser.name}
                        disabled
                        required
                      />
                    </FormControl>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="Establishment"
                        id="name"
                        size="small"
                        defaultValue={getUser && getUser.establishment}
                        disabled
                        required
                      />
                    </FormControl>
                  </Box>
                </Grid>
              ) : (
                ""
              )}

              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Amount"
                    id="amount"
                    size="small"
                    type="number"
                    onChange={handleAmountChange}
                    inputProps={{
                      form: {
                        autocomplete: "off",
                      },
                    }}
                    InputProps={{
                      inputProps: {
                        max: 100000000,
                        min: 10,
                      },
                    }}
                    required
                    onKeyDown={(e) => {
                      if (e.key === "+" || e.key === "-") {
                        e.preventDefault();
                      }
                    }}
                  />
                  {err && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 1, ml: 3 }}
                    >
                      {err}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    M-PIN
                  </div>
                  <PinInput
                    length={6}
                    focus
                    type="password"
                    onChange={(value, index) => {
                      if (err !== "") {
                        setErr("");
                      }
                      setMpin(value);
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
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sx={{ display: "flex", justifyContent: "end", mt: 1 }}
                  >
                    <ResetMpin variant="text" />
                  </Grid>
                </FormControl>
              </Grid>

              {err && err && (
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
                  {err.message && err.message && (
                    <div>{err && err.message}</div>
                  )}

                  {err.data && err.data && (
                    <div className="blink_text">
                      Attempts remaining:{err && 5 - Number(err.data)}
                    </div>
                  )}
                </Box>
              )}
            </Grid>
          </Box>
          <ModalFooter
            form="money_transfer"
            request={request}
            btn="Send"
            disable={err}
          />
        </Box>
      </Modal>
    </Box>
  );
};
export default SendMoneyModal;
