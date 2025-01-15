import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  FormControl,
  Grid,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Divider,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { useState } from "react";
import PinInput from "react-pin-input";
import AuthContext from "../store/AuthContext";
import { useContext } from "react";
import { breakAmt, performMt } from "../utils/MTBreakAmtUtil";
import fail_anim from "../assets/animate-icons/fail.json";
import success_anim from "../assets/animate-icons/success_anim.json";
import { imps_l, loginPage1, Logo, neft_l } from "../iconsImports";
import { AnimateIcon28 } from "../component/AnimateIcon28";
import { postJsonData } from "../network/ApiController";
import ResetMpin from "./ResetMpin";
import CallMadeIcon from "@mui/icons-material/CallMade";
import MyButton from "../component/MyButton";
import useCommonContext from "../store/CommonContext";
import Loader from "../component/loading-screen/Loader";
import ConfirmationModal from "./ConfirmationModal";
import { validateApiCall } from "../utils/LastApiCallChecker";
import { useEffect } from "react";
import ApiEndpoints from "../network/ApiEndPoints";
const RetExpresTransferModal = ({
  type,
  ben,
  rem_number,
  view,
  limit_per_txn,
  remDailyLimit,
  rem_details,
  apiEnd,
  dmtValue,
}) => {
  // console.log("ben", ben);
  // console.log("view", view);
  // console.log("type", type);
  // console.log("rem_details", rem_details);
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [mpin, setMpin] = useState("");
  const [arrAmtRes, setArrAmtRes] = useState([]);
  // console.log("arrAmtRes", arrAmtRes);
  const [err, setErr] = useState();
  const [mtRequest, setMtRequest] = useState(false);
  const [onComplete, setOnComplete] = useState(false);
  // const [expressComplete]
  const [amount, setAmount] = useState("");
  const { getRecentData } = useCommonContext();
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const loc = authCtx.location && authCtx.location;
  // const [ifConfirmed, setIfConfirmed] = useState(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [stateresp, setStateresp] = useState("");
  const [isOtpShow, setIsOtpShow] = useState(false);
  const [remOtp, setRemOtp] = useState();
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
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setArrAmtRes([]);
    setOnComplete(false);
    setMpin("");
    setIsOtpShow(false);
    setErr("");
    setAmount("");
    setRemOtp("");
  };
  const handleOtpChange = (event) => {
    const value = event.target.value;

    // Prevent input if it's not numeric
    if (/[^0-9]/.test(value)) {
      return;
    }

    // Limit the OTP length to 6 and ensure it's at least 4
    if (value.length <= 6) {
      setErr(""); // Clear error if length is valid
      setRemOtp(value); // Update OTP value
    }
  };
  // express tranfer super transfer function
  const handleSubmit = (event) => {
    event.preventDefault();
    if (openConfirm) setOpenConfirm(false);
    if (amount === "") {
      setErr("");
      const error = {
        message: "Amount required",
      };
      setErr(error);
    } else if (mpin === "") {
      setErr("");
      const error = {
        message: "MPIN required",
      };
      setErr(error);
    } else {
      const data = {
        number: rem_number && rem_number,
        amount: amount,
        ben_acc: ben.bene_acc ? ben.bene_acc : ben.accno,
        bank_name: view === "Express Transfer" ? ben.bank : undefined,
        ben_id: ben.id ? ben.id : ben.bene_id,
        ifsc: ben.ifsc,
        latitude: loc.lat,
        longitude: loc.long,
        ben_name: ben.bene_name ? ben.bene_name : ben.name,
        type: type,
        pf: "WEB",
        otp: remOtp,
        otp_ref: stateresp,
        mpin: mpin,
        pipe:
          rem_details.bank1_limit !== 0
            ? "bank1"
            : rem_details.bank2_limit !== 0
            ? "bank2"
            : rem_details.bank3_limit !== 0
            ? "bank3"
            : undefined,
      };

      if (validateApiCall()) {
        postJsonData(
          // ApiEndpoints.EXP_TRANSFER,
          apiEnd,
          data,
          setRequest,
          (res) => {
            const rrn = res.data.RRN;
            // console.log("rrn", rrn);
            getRecentData();
            okSuccessToast(res.data.message);
            setOnComplete(true);
            setOpenConfirm(false);
            setErr("");
            if (rrn) {
              let receiptData = { ...ben };

              receiptData.choosenTransferType = type;
              receiptData.rrn = rrn;
              receiptData.amount = data.amount;
              receiptData.transfer_type = "ET";
              receiptData.status = "SUCCESS";
              receiptData.remNumb = rem_details?.mobile;
              receiptData.remName = `${
                rem_details?.firstName
                  ? rem_details?.firstName
                  : rem_details?.fName
              } ${
                rem_details.lastName ? rem_details.lastName : rem_details.lName
              }`;
              localStorage.setItem(
                "MoneyTransfer",
                JSON.stringify(receiptData)
              );
              // console.log("receiptData", receiptData);
            }
            // handleClose();
          },
          (error) => {
            if (error && error) {
              if (error.response.data.message === "Invalid M Pin") {
                setErr(error.response.data);
              } else {
                getRecentData();
                setErr("");
                handleClose();
                apiErrorToast(error);
              }
            }
          }
        );
      } else {
        setErr("");
        const error = {
          message: "Kindly wait some time before another request",
        };
        setErr(error);
      }
    }
  };
  const sendOtpMt = () => {
    console.log("im indside apicall");
    const data = {
      number: rem_number && rem_number,
      amount: amount && amount,
      ben_id: ben.benid,
      latitude: loc.lat,
      longitude: loc.long,
      type: type,
      pf: "WEB",
    };
    postJsonData(
      ApiEndpoints.OTP_EXP,
      data,
      setRequest,
      (res) => {
        console.log("reeeees", res);
        setStateresp(res?.data?.data);
        setIsOtpShow(true);
      },
      (err) => {
        console.log("errrrrr", err);
      }
    );
  };
  const handleSubmitMoneyTransfer = (event) => {
    event.preventDefault();
    if (openConfirm) setOpenConfirm(false);
    if (amount === "") {
      setErr("");
      const error = {
        message: "Amount required",
      };
      setErr(error);
    } else if (mpin === "") {
      // console.log("helloo imhere");
      setErr("");
      const error = {
        message: "MPIN required",
      };
      setErr(error);
    } else {
      let amt = parseInt(amount && amount);
      if (amt < 2 || amt > 25000) {
        setErr("");
        const error = {
          message: "Amount must be between 2 to 25000",
        };
        setErr(error);
      } else if (amt && amt > parseInt(user.w1)) {
        setErr("");
        const error = {
          message: "Low Balance",
        };
        setErr(error);
      } else {
        setErr("");

        const amt_arr = breakAmt(amt, limit_per_txn);
        const arrData = amt_arr.map((item, index) => {
          return {
            amount: item,
            meta: {
              processing: false,
            },
          };
        });
        setArrAmtRes(arrData);
        if (arrData && arrData.length > 0) {
          const postData = {
            number: rem_number && rem_number,
            ben_acc: ben.account ? ben.account : ben.bene_acc,
            ben_id: ben.benid ? ben.benid : ben.id,
            ifsc: ben.ifsc,
            latitude: loc.lat,
            longitude: loc.long,
            ben_name: ben.name ? ben.name : ben.bene_name,
            type: type,
            pf: "WEB",
            mpin: mpin,

            rem_type: "NONKYC",

            kyc: limit_per_txn && limit_per_txn * 1 > 5000 ? 1 : 0,
            pipe:
              rem_details.bank1_limit !== 0
                ? "bank1"
                : rem_details.bank2_limit !== 0
                ? "bank2"
                : rem_details.bank3_limit !== 0
                ? "bank3"
                : undefined,
          };
          const len = arrData.length;

          // console.log("data", postData);

          if (validateApiCall()) {
            performMt(
              0,
              len,
              arrData,
              postData,
              // on partial success
              (index, res) => {
                // console.log(`partSuccess => ${index} => ${JSON.stringify(res)}`);
                setArrAmtRes([...arrData]);
                // console.log("index : " + res);
              },
              // onSuccess
              (data) => {
                let beneData = { ...ben };
                beneData.choosenTransferType = type;
                beneData.transfer_type = "MT";
                beneData.remNumb = rem_details?.mobile;
                beneData.remName = `${
                  rem_details?.firstName
                    ? rem_details?.firstName
                    : rem_details?.fname
                } ${
                  rem_details.lastName
                    ? rem_details.lastName
                    : rem_details.lname
                }`;
                localStorage.setItem("MoneyTransfer", JSON.stringify(beneData));
                localStorage.setItem("items", JSON.stringify(data));
                setArrAmtRes([...arrData]);
                // console.log("bene data mt", beneData);
              },
              // onComplete
              () => {
                // okSuccessToast(
                //   "Success",
                //   "All Transactions completed successfully"
                // );
                getRecentData();
                setOnComplete(true);
              },
              (index, error) => {
                // onFailed
                setMtRequest(true);
                setOnComplete(false);
                setOpenConfirm(false);
                arrData.map((item) => {
                  if (!item.meta.res) {
                    item.meta.processing = false;
                    item.meta.error = "Transaction Aborted";
                  }
                });
                apiErrorToast(error);
                arrData[index].meta.error = JSON.stringify(
                  error.response.data.message
                );
                if (error.response.data.data && error.response.data.data) {
                  arrData[index].meta.data = error.response.data.data;
                }
                getRecentData();
                setMtRequest(false);
                setArrAmtRes([...arrData]);
              },
              setMtRequest,
              apiEnd,
              setOpenConfirm
            );
          } else {
            setErr("");
            const error = {
              message: "Kindly wait some time before another request",
            };
            setErr(error);
          }
        }
      }
    }
  };

  const handleOpenVerify = () => {
    let amt = parseInt(amount && amount);
    if (view === "Money Transfer" && (amt < 2 || amt > 25000)) {
      setErr("");
      const error = {
        message: "Amount must be between 2 to 25000",
      };
      setErr(error);
    } else if (amount === "") {
      setErr("");
      const error = {
        message: "Amount required",
      };
      setErr(error);
    } else if (mpin === "") {
      setErr("");
      const error = {
        message: "MPIN required",
      };
      setErr(error);
    } else {
      setOpenConfirm(true);
    }
  };

  // un-used for now
  const handleSubmitMoneyTransferWithoutLimit = (event) => {
    event.preventDefault();
    if (amount === "") {
      setErr("");
      const error = {
        message: "Amount required",
      };
      setErr(error);
    } else if (mpin === "") {
      setErr("");
      const error = {
        message: "MPIN required",
      };
      setErr(error);
    } else {
      const data = {
        number: rem_number && rem_number,
        ben_acc: ben.account,
        ben_id: ben.id,
        ifsc: ben.ifsc,
        latitude: loc.lat,
        longitude: loc.long,
        ben_name: ben.name,
        type: type,
        pf: "WEB",
        mpin: mpin,
        amount: amount,
        rem_type: "KYC",
        kyc: limit_per_txn && limit_per_txn * 1 > 5000 ? 1 : 0,
      };
      console.log("data without spilit", data);
      // postJsonData(
      //   ApiEndpoints.DMR_MONEY_TRANSFER,
      //   data,
      //   setRequest,
      //   (res) => {
      //     getRecentData();
      //     okSuccessToast(res.data.message);
      //     handleClose();
      //   },
      //   (error) => {
      //     if (error && error) {
      //       if (error.response.data.message === "Invalid M Pin") {
      //         setErr(error.response.data);
      //       } else {
      //         getRecentData();
      //         setErr("");
      //         handleClose();
      //         apiErrorToast(error);
      //       }
      //     }
      //   }
      // );
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
        className={
          type === "NEFT" ? "button-purple-outline" : "button-red-outline"
        }
        // startIcon={
        //   <CallMadeIcon sx={{ mr: "-6px", fontSize: "2px" }} />
        // }
        sx={{ fontSize: "13px", py: 0, ml: 1, px: 1 }}
        onClick={handleOpen}
      >
        <CallMadeIcon sx={{ fontSize: "14px", mr: 0.5 }} />
        {type && type}
      </Button>

      <Modal
        open={open}
        // onClose={!mtRequest && handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title={view + `(${type})`} subtitle=" " handleClose={handleClose} />
          <Box
            component="form"
            id="expMoneyTransfer"
            validate
            autoComplete="off"
            onSubmit={
              view && view !== "Money Transfer"
                ? handleSubmit
                : handleSubmitMoneyTransfer
            }
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
          >
            <Loader changeloder=" " loading={request} />
            <Grid container sx={{ pt: 1 }}>
              {/* <Grid item md={12} xs={12}>
                <Typography
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "24px",
                    fontFamily: "Poppins",
                    fontWeight: "bold",
                    color: "#DC5F5F",
                  }}
                >
                  {type} Transfer
                </Typography>
              </Grid> */}

              <Grid
                item
                md={12}
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <table className="mt-table">
                  <tr>
                    <td>Name</td>
                    <td>:</td>
                    <td style={{ textAlign: "right" }}>
                      {view && view === "Money Transfer"
                        ? ben.name
                          ? ben.name
                          : ben.bene_name
                        : ben.bene_name}
                    </td>
                  </tr>
                  <tr>
                    <td>Bank Name</td> <td>:</td>
                    <td style={{ textAlign: "right" }}>
                      {ben.bank ? ben.bank : ben.bankname}
                    </td>
                  </tr>
                  <tr>
                    <td>Account </td>
                    <td>:</td>
                    <td style={{ textAlign: "right" }}>
                      {view && view === "Money Transfer"
                        ? ben.account
                          ? ben.account
                          : ben.bene_acc
                        : ben.bene_acc}
                    </td>
                  </tr>
                  <tr>
                    <td>IFSC </td>
                    <td>:</td>
                    <td style={{ textAlign: "right" }}>{ben.ifsc}</td>
                  </tr>
                </table>
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
                sx={{ mt: 2, display: "flex", justifyContent: "center" }}
                hidden={onComplete}
              >
                <FormControl sx={{ width: "74%" }}>
                  <TextField
                    label="Enter Amount"
                    id="amount"
                    size="small"
                    type="number"
                    required
                    value={amount}
                    InputProps={{
                      inputProps: { min: "0", max: remDailyLimit },
                      endAdornment: (
                        <InputAdornment position="end">
                          {amount.length > 2 && (
                            <Button
                              sx={{ py: 0.5, fontSize: "10px", px: -1 }}
                              variant="contained"
                              edge="end"
                              onClick={sendOtpMt}
                              disabled={err?.data ? true : false} // Disable button if amount length is less than 3
                            >
                              Get OTP
                            </Button>
                          )}
                        </InputAdornment>
                      ),
                    }}
                    onChange={(event) => {
                      setAmount(event.target.value);
                    }}
                    inputProps={{
                      form: {
                        autocomplete: "off",
                      },
                    }}
                    onKeyDown={(e) => {
                      // Prevent typing "+" or "-" characters
                      if (e.key === "+" || e.key === "-") {
                        e.preventDefault();
                      }
                    }}
                  />
                </FormControl>
              </Grid>

              {isOtpShow && (
                <Grid container sx={{ pt: 1 }}>
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sx={{ display: "flex", justifyContent: "center" }}
                    hidden={onComplete}
                  >
                    <FormControl sx={{ width: "74%" }}>
                      <TextField
                        label="Enter OTP"
                        id="otp"
                        size="small"
                        type="text" // Use "text" type because "number" input type doesn't respect maxLength
                        required
                        value={remOtp}
                        onChange={handleOtpChange}
                        inputProps={{
                          form: { autocomplete: "off" },
                          maxLength: 6, // Set maximum length for the input
                        }}
                        error={
                          remOtp?.length > 0 &&
                          (remOtp?.length < 4 || remOtp?.length > 6)
                        }
                        helperText={
                          remOtp?.length > 0 && remOtp?.length < 6
                            ? "OTP must be at least 6 digits"
                            : remOtp?.length > 6
                            ? "OTP cannot exceed 6 digits"
                            : ""
                        }
                        onKeyDown={(e) => {
                          // Prevent typing "+" or "-" characters
                          if (e.key === "+" || e.key === "-") {
                            e.preventDefault();
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sx={{ display: "flex", justifyContent: "center" }}
                    hidden={onComplete}
                  >
                    <FormControl>
                      <Typography
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        Enter M-PIN
                      </Typography>
                      <PinInput
                        length={6}
                        type="password"
                        onChange={(value, index) => {
                          if (err !== "") {
                            setErr("");
                          }
                          setMpin(value);
                        }}
                        regexCriteria={/^[0-9]*$/}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      pr: 12,
                      mt: 1,
                    }}
                    hidden={onComplete}
                  >
                    <ResetMpin variant="text" />
                  </Grid>
                </Grid>
              )}

              {/* {amount && amount && (
                <>
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sx={{ display: "flex", justifyContent: "center" }}
                    hidden={onComplete}
                  >
                    <FormControl>
                      <Typography
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        Enter M-PIN
                      </Typography>
                      <PinInput
                        length={6}
                        type="password"
                        onChange={(value, index) => {
                          if (err !== "") {
                            setErr("");
                          }
                          setMpin(value);
                        }}
                        regexCriteria={/^[0-9]*$/}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      pr: 12,
                      mt: 1,
                    }}
                    hidden={onComplete}
                  >
                    <ResetMpin variant="text" />
                  </Grid>
                </>
              )} */}

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
              <Grid
                container
                md={12}
                xs={12}
                sx={{
                  display: "grid",
                  mt: 2,
                }}
              >
                {arrAmtRes.map((item) => {
                  return (
                    <Box
                      component="div"
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "left",
                        fontSize: "15px",
                        px: 2,
                        mb: 0.5,
                        color: "grey",
                      }}
                    >
                      <Box
                        sx={{
                          width: "18%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {" "}
                          <span className="diff-font">₹</span>{" "}
                          {`${item.amount} : `}
                        </span>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          width: "60%",
                          alignItems: "center",
                        }}
                      >
                        {/* processing */}
                        <small
                          hidden={
                            item.meta.res ||
                            item.meta.error ||
                            !item.meta.processing
                          }
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <span className="me-2">Under Processing</span>
                          <CircularProgress
                            className="me-2"
                            style={{ width: "24px", height: "24px" }}
                          />
                        </small>
                        {/* waiting */}
                        <small
                          hidden={
                            // !item.meta.res || // true
                            // item.meta.error || //true
                            !item.meta.processing //false
                          }

                          // className="d-flex"
                        >
                          <span className="me-4">Waiting . . .</span>
                        </small>
                        {item.meta.res && item.meta.res && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mr: 1,
                            }}
                          >
                            <div style={{ fontSize: "12px", color: "grey" }}>
                              {item.meta.res.message}
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "grey",
                                display: "flex",
                                justifyContent: "center",
                                alignContent: "center",
                              }}
                            >
                              <AnimateIcon28 src={success_anim} />
                            </div>
                          </Box>
                        )}

                        {item.meta.error && item.meta.error && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mr: 1,
                            }}
                          >
                            <div
                              style={{
                                fontSize: "12px",
                                color: "grey",
                                alignItems: "center",
                                display: "flex",
                              }}
                            >
                              {item.meta.error}
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "grey",
                                display: "flex",
                                justifyContent: "center",
                                alignContent: "center",
                              }}
                            >
                              <AnimateIcon28 src={fail_anim} />
                            </div>
                          </Box>
                        )}
                      </Box>
                      {item.meta.data && item.meta.data && (
                        <Box
                          className="blink_text"
                          sx={{
                            display: "flex",
                            width: "25%",
                            alignItems: "center",
                            textAlign: "right",
                          }}
                        >
                          Attempts left : {5 - item.meta.data}
                        </Box>
                      )}
                    </Box>
                  );
                })}
                {onComplete && view !== "Express Transfer" && (
                  <Grid
                    item
                    md={12}
                    sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                  >
                   <Button
  variant="contained"
  className="btn-background"
  sx={{ textTransform: "none", width: "72%" }}
  onClick={() => {
    const vendor = "vendor"; // Replace "yourValue" with the actual value of the aa prop
    window.open(`/mt-receipt?vendor=${encodeURIComponent(vendor)}`, "_blank");
  }}
>
  Print Receipt
</Button>

                  </Grid>
               )} 
              </Grid>
            </Grid>
          </Box>
          {(arrAmtRes && arrAmtRes.length > 0) || onComplete ? (
            <>
              <Divider
                sx={{
                  color: "#000",
                  border: "1px solid black",
                  mt: 2,
                  mb: 3,
                }}
              />
              <div
                className="d-flex justify-content-between"
                style={{
                  width: "100%",
                  mt: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <img src={Logo} width="120rem" alt="logo" />

                <MyButton
                  text="Close"
                  type="submit"
                  red
                  onClick={handleClose}
                />
              </div>
            </>
          ) : (
            <ModalFooter
            typeWallet="wallet"
              // form="expMoneyTransfer"
              request={request}
              btn="Proceed"
              onClick={handleOpenVerify}
            />
          )}
        </Box>
      </Modal>
      <ConfirmationModal
        openConfirm={openConfirm}
        amount={amount}
        setOpenConfirm={setOpenConfirm}
        form="expMoneyTransfer"
        view={view}
        ben={ben}
        request={request}
        mtRequest={mtRequest}
        dmtValue={dmtValue}
      />
    </Box>
  );
};
export default RetExpresTransferModal;
