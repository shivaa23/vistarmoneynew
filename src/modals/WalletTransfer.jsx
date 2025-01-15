import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  FormControl,
  Grid,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import Loader from "../component/loading-screen/Loader";
import PinInput from "react-pin-input";
import ResetMpin from "./ResetMpin";
import AuthContext from "../store/AuthContext";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { PATTERNS } from "../utils/ValidationUtil";
import useCommonContext from "../store/CommonContext";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import { validateApiCall } from "../utils/LastApiCallChecker";

const WalletTransfer = ({ row, refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [mpin, setMpin] = useState("");
  const [err, setErr] = useState();
  const [isNameVal, setIsNameVal] = useState(true);
  const [isValMob, setisValMob] = useState(true);
  const context = useContext(AuthContext);
  const { getRecentData } = useCommonContext();
  const userLat = context?.location?.lat && context.location.lat;
  const userLong = context?.location?.long && context.location.long;
  const authCtx = useContext(AuthContext);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    boxShadow: 24,
    fontFamily: "Poppins",
    height: "max-content",
    overflowY: "scroll",
    p: 2,
  };
  const handleOpen = () => {
    if (authCtx && authCtx.user.upi_qr && authCtx.user.upi_qr === 0) {
      apiErrorToast(
        "You are unauthorized to perform this service Kindly contact administrator !"
      );
    } else {
      setOpen(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  //api call
  const handleSubmit = (event) => {
    event.preventDefault();
    const name = document.getElementById("benName").value;
    const mobile = document.getElementById("benMobile").value;
    const amount = document.getElementById("wallAmount").value;

    let data = {
      name: name,
      number: mobile,
      amount: amount,
      ben_acc: mobile,
      pf: "WEB",
      mpin: mpin,
      latitude: userLat,
      longitude: userLong,
    };
    if (mpin !== "" && amount !== "" && validateApiCall()) {
      postJsonData(
        ApiEndpoints.DMR_WALLET_TRANSFER,
        data,
        setRequest,
        (res) => {
          getRecentData();
          okSuccessToast(res.data.message);
          handleClose();
          setMpin("");
          if (refresh) refresh();
          setErr("");
        },
        (error) => {
          setMpin("");
          setErr("");
          apiErrorToast(error);
          if (error && error) {
            if (error.response.data.message === "Invalid M Pin") {
              setErr(error.response.data);
            }
          }
        }
      );
    } else if (amount === "") {
      const error = {
        message: "The amount field is required.",
      };
      setErr(error);
    } else if (mpin === "") {
      const error = {
        message: "MPIN required",
      };
      error("MPIN required");
    } else {
      const error = {
        message: "Kindly wait some time before another request",
      };
      setErr(error);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <div className="hover-zoom">
        <IconButton onClick={handleOpen} sx={{ display: "contents", mt: 2 }}>
          <Tooltip title="Paytm Transfer" placement="left">
            <LocalParkingIcon
              className="hover-white hover-zoom"
              fontSize="small"
            />
          </Tooltip>
        </IconButton>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <Loader loading={request} />
          <ModalHeader
            title="Paytm Wallet Transfer"
            handleClose={handleClose}
          />
          <Box
            component="form"
            id="wallent_transfer"
            autoComplete="off"
            validate
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": { m: 2 },
            }}
          >
            <FormControl sx={{ width: "100%" }}>
              <TextField autoComplete="off"
                label="Beneficiary Name"
                id="benName"
                name="benName"
                size="small"
                error={!isNameVal}
                helperText={!isNameVal ? "Please Enter Valid Name" : ""}
                onChange={(e) => {
                  setIsNameVal(PATTERNS.NAME.test(e.target.value));
                  if (e.target.value === "") setIsNameVal(true);
                }}
                required
              />
            </FormControl>
            <FormControl sx={{ width: "100%" }}>
              <TextField autoComplete="off"
                label="Beneficiary Paytm Number"
                id="benMobile"
                name="benMobile"
                size="small"
                type="tel"
                error={!isValMob}
                helperText={!isValMob ? "Please Enter valid Mobile" : ""}
                onChange={(e) => {
                  setisValMob(PATTERNS.MOBILE.test(e.target.value));
                  if (e.target.value === "") setisValMob(true);
                }}
                required
                inputProps={{
                  minLength: 10,
                  maxLength: 10,
                  form: {
                    autocomplete: "off",
                  },
                }}
              />
            </FormControl>
            <FormControl sx={{ width: "100%" }}>
              <TextField autoComplete="off"
                label="Amount"
                name="wallAmount"
                id="wallAmount"
                size="small"
                type="number"
                inputProps={{
                  form: {
                    autocomplete: "off",
                  },
                  pattern: "[0-9]*",
                }}
                InputProps={{
                  inputProps: {
                    max: 500000,
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
            </FormControl>
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
                  onChange={(value) => {
                    if (err !== "") {
                      setErr("");
                    }
                    setMpin(value);
                  }}
                  inputMode="text"
                  regexCriteria={/^[0-9]*$/}
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
                {err.message && err.message && <div>{err && err.message}</div>}

                {err.data && err.data && (
                  <div className="blink_text">
                    Attempts remaining:{err && 5 - Number(err.data)}
                  </div>
                )}
              </Box>
            )}
          </Box>
          <ModalFooter
            form="wallent_transfer"
            type="submit"
            request={request}
            disable={!isValMob || !mpin || !isNameVal}
            btn="Done"
          />
        </Box>
      </Modal>
    </Box>
  );
};
export default WalletTransfer;
