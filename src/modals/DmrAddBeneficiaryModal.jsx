import * as React from "react";
import Box from "@mui/material/Box";
import {
  FormControl,
  Grid,
  TextField,
  Button,
  Typography,
  Drawer,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { postJsonData } from "../network/ApiController";
import { useState } from "react";
import { PATTERNS } from "../utils/ValidationUtil";
import useCommonContext from "../store/CommonContext";
import VerifyOtpLogin from "./VerifyOtpLogin";
import AuthContext from "../store/AuthContext";
import { useContext } from "react";
import PinInput from "react-pin-input";
import ResetMpin from "./ResetMpin";
import ApiSearch from "../component/ApiSearch";

const DmrAddBeneficiaryModal = ({
  type,
  rem_mobile,
  apiEnd = [],
  getRemitterStatus,
  // this view is just in the case of MT
  view,
}) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [accNoV, setAccNoV] = useState(true);
  const [mpin, setMpin] = useState("");
  const [err, setErr] = useState();
  const [isValidName, setIsValidName] = useState(true);
  const [bankId, setBankId] = useState("");
  const [bankName, setBankName] = useState("");
  const [ifscVal, setIfscVal] = useState("");
  const [secureValidate, setSecureValidate] = useState("");
  const [otpRefId, setOtpRefId] = useState("");
  const { getRecentData } = useCommonContext();
  const authCtx = useContext(AuthContext);
  const user = authCtx && authCtx.user;
  const loc = authCtx.location && authCtx.location;
  const [viewMpin, setViewMpin] = useState(false);
  const [btnName, setBtnName] = useState("Verify & Add");
  // console.log("view", view);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    boxShadow: 24,
    fontFamily: "Poppins",
    height: "max-ceontent",
    overflowY: "scroll",
    p: 2,
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setIfscVal("");
    setBankId("");
    setBtnName("Verify & Add");
    setMpin("");
    setViewMpin(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const buttonName = event?.nativeEvent?.submitter?.innerText;
    const form = event.currentTarget;

    let data = {};
    if (
      buttonName === "Add Beneficiary" ||
      buttonName === "Add Vendor" ||
      buttonName === "Add Super"
    ) {
      data = {
        name: form.name.value,
        rem_mobile: rem_mobile,
        account_number: form.acc_no.value.toUpperCase(),
        ifsc: ifscVal.toUpperCase(),
        bank_id: bankId,
        bank_name: bankName,
        verified: type ? 0 : 0,
      };
    } else {
      if (mpin !== "" && viewMpin) {
        data = {
          rem_mobile: rem_mobile && rem_mobile,
          account_number: form.acc_no.value.toUpperCase(),
          ben_id: user.username,
          bank_id: bankId,
          ifsc: ifscVal,
          latitude: loc.lat,
          longitude: loc.long,
          name: form.name.value,
          pf: "WEB",
          mpin: mpin && mpin,
        };
      } else {
        setViewMpin(true);
        setBtnName("Proceed");
        setErr("");
        setMpin("");
        if (mpin === "" && viewMpin) {
          const error = {
            message: "MPIN required",
          };
          setErr(error);
        }
      }
    }

    if (
      buttonName === "Add Beneficiary" ||
      buttonName === "Add Vendor" ||
      buttonName === "Add Super"
    ) {
      postJsonData(
        apiEnd,
        (data = {
          rem_mobile: rem_mobile && rem_mobile,
          account_number: form.acc_no.value.toUpperCase(),
          ben_id: user.username,
          ifsc: ifscVal,
          bank_id: bankId,
          latitude: loc.lat,
          longitude: loc.long,
          name: form.name.value,
          pf: "WEB",
          bank_name: bankName,
          mpin: mpin && mpin,
          verified: type ? 0 : 0,
        }),
        setRequest,
        (res) => {
          if (res?.data?.status === "OTP" && view === "MT_View" && type) {
            setSecureValidate("Beneficiary");
            setOtpRefId(res?.data?.otpReference);
          } else {
            if (getRemitterStatus) getRemitterStatus(rem_mobile);
            getRecentData();
            okSuccessToast("Beneficiary Added Successfuly");
            handleClose();
          }
        },
        (error) => {
          if (getRemitterStatus) getRemitterStatus(rem_mobile);
          apiErrorToast(error);
        }
      );
    } else if (mpin !== "") {
      postJsonData(
        ApiEndpoints.VERIFY_ACC,
        (data = {
          number: rem_mobile && rem_mobile,
          ben_acc: form.acc_no.value.toUpperCase(),
          ben_id: user.username,
          ifsc: ifscVal,
          bank_id: bankId,
          latitude: loc.lat,
          longitude: loc.long,
          ben_name: form.name.value,
          pf: "WEB",
          mpin: mpin && mpin,
        }),
        setRequest,
        (res) => {
          getRecentData();
          okSuccessToast(res.data.message);
          if (getRemitterStatus) getRemitterStatus(rem_mobile);
          const data = {
            name: res.data.message,
            rem_mobile: rem_mobile,
            account_number: form.acc_no.value.toUpperCase(),
            ifsc: ifscVal.toUpperCase(),
            bank_id: bankId,
            bank_name: bankName,
            verified: 1,
          };
          postJsonData(
            apiEnd,
            data,
            setRequest,
            (res) => {
              if (res?.data?.status === "OTP" && view === "MT_View" && type) {
                setSecureValidate("Beneficiary");
                setOtpRefId(res?.data?.otpReference);
              } else {
                if (getRemitterStatus) getRemitterStatus(rem_mobile);
                getRecentData();
                // okSuccessToast("Beneficiary Added Successfuly");
                handleClose();
              }
            },
            (error) => {
              if (getRemitterStatus) getRemitterStatus(rem_mobile);
              apiErrorToast(error);
              setViewMpin(false);
            }
          );

          // if (remitterStatus) getRemitterStatus(rem_number);
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
              setViewMpin(false);
            }
            // if (remitterStatus) getRemitterStatus(rem_number);
          }
        }
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Button
        variant="outlined"
        onClick={handleOpen}
        className="refresh-icon-risk"
        size="small"
      >
        {/* <Spinner loading={request} size="small" /> */}
        {view === "MT_View" && (type === "dmt1" || type === "dmt2")
          ? "Add Beneficiary"
          : type === "express"
          ? "Add Vendor"
          : "Add Super"}
      </Button>

      <Box>
        <Drawer open={open} onClose={handleClose} anchor="right">
          <Box sx={{ width: 400 }} className="sm_modal">
            {/* <Spinner loading={request} /> */}
            <ModalHeader
              title={view === "MT_View" ? "Add Beneficiary" : "Add Vendor"}
              handleClose={handleClose}
            />
            <Box
              component="form"
              id="addbene"
              validate
              autoComplete="off"
              onSubmit={handleSubmit}
              sx={{
                "& .MuiTextField-root": { m: 1 },
              }}
            >
              <Grid container sx={{ pt: 1 }}>
                <Grid item md={11.8} xs={11.8}>
                  <ApiSearch
                    label="Search Bank"
                    name="user_id"
                    placeholder="Bank"
                    cb1={(item) => {
                      setBankId(
                        view === "MT_View" && type === "dmt2"
                          ? item.id
                          : item.bankId
                      );
                      setIfscVal(
                        view === "MT_View" && type === "dmt2"
                          ? item.ifsc
                          : item.ifscGlobal
                      );
                      setBankName(item.newValue);
                    }}
                    nameKeys={["name"]}
                    searchApi={
                      view === "MT_View" && type === "dmt2"
                        ? ApiEndpoints.DMT2_BANK_LIST
                        : ApiEndpoints.GET_BANK_DMR
                    }
                    sx={{
                      mt: 3,
                      width: "97%",
                    }}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      label="IFSC"
                      id="ifsc"
                      size="small"
                      value={ifscVal}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      onChange={(e) => {
                        setIfscVal(e.target.value);
                      }}
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      label="Name"
                      id="name"
                      size="small"
                      error={!isValidName}
                      helperText={!isValidName ? "Enter valid Name" : ""}
                      required
                      inputProps={{ minLength: 3 }}
                      onChange={(e) => {
                        setIsValidName(PATTERNS.NAME.test(e.target.value));
                        if (e.target.value === "") setIsValidName(true);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      label="Account Number"
                      id="acc_no"
                      size="small"
                      required
                      error={!accNoV}
                      helperText={!accNoV ? "Enter valid Account Number" : ""}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      onChange={(e) => {
                        setAccNoV(PATTERNS.ACCOUNT_NUMBER.test(e.target.value));
                        if (e.target.value === "") setAccNoV(true);
                      }}
                    />
                  </FormControl>
                </Grid>

                {type && viewMpin && (
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                  >
                    <FormControl>
                      <Typography
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        Enter M-PIN
                      </Typography>
                      <PinInput
                        length={6}
                        focus
                        type="password"
                        onChange={(value, index) => {
                          setMpin(value);
                        }}
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
                        sx={{ display: "flex", justifyContent: "end" }}
                      >
                        <ResetMpin variant="text" />
                      </Grid>
                    </FormControl>
                  </Grid>
                )}
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

                {type === "dmt2" && viewMpin && (
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
                )}
              </Grid>
            </Box>
            <ModalFooter
              form="addbene"
              request={request}
              btn={
                view === "MT_View" && (type === "dmt1" || type === "dmt2")
                  ? "Add Beneficiary"
                  : type === "express"
                  ? "Add Vendor"
                  : "Add Super"
              }
              disable={!isValidName || !accNoV}
              twobuttons={type ? btnName : false}
            />
          </Box>
        </Drawer>
      </Box>
      <VerifyOtpLogin
        secureValidate={secureValidate}
        setSecureValidate={setSecureValidate}
        showLaoder={false}
        btn="Verify OTP"
        data={otpRefId}
        getRemitterStatus={getRemitterStatus}
        rem_mobile={rem_mobile}
        setOpenBene={setOpen}
      />
    </Box>
  );
};
export default DmrAddBeneficiaryModal;
