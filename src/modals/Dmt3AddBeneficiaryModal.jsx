import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  FormControl,
  Grid,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { postJsonData } from "../network/ApiController";
import { useState } from "react";
import { PATTERNS } from "../utils/ValidationUtil";
import useCommonContext from "../store/CommonContext";
import Spinner from "../commons/Spinner";
import VerifyOtpLogin from "./VerifyOtpLogin";
import AuthContext from "../store/AuthContext";
import { useContext } from "react";
import PinInput from "react-pin-input";
import ResetMpin from "./ResetMpin";
import ApiSearch from "../component/ApiSearch";

const Dmt3AddBeneficiaryModal = ({
  dmtValue,
  rem_mobile,
  apiEnd,
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
    setViewMpin(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const buttonName = event?.nativeEvent?.submitter?.innerText;
    const form = event.currentTarget;

    let data = {};
    if (buttonName === "Add Beneficiary" || buttonName === "Add Vendor") {
      data = {
        name: form.name.value,
        rem_mobile: rem_mobile,
        account_number: form.acc_no.value.toUpperCase(),
        ifsc: ifscVal.toUpperCase(),
        bank_id: bankId,
        bank_name: bankName,
        verified: 0,
      };
    } else {
      if (mpin !== "" && viewMpin) {
        data = {
          number: rem_mobile && rem_mobile,
          ben_acc: form.acc_no.value.toUpperCase(),
          ben_id: user.username,
          ifsc: ifscVal,
          latitude: loc.lat,
          longitude: loc.long,
          ben_name: form.name.value,
          pf: "WEB",
          mpin: mpin && mpin,
        };
      } else {
        setViewMpin(true);
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

    if (buttonName === "Add Beneficiary" || buttonName === "Add Vendor") {
      postJsonData(
        apiEnd,
        data,
        setRequest,
        (res) => {
          if (
            res?.data?.status === "OTP" &&
            view === "MT_View" &&
            dmtValue === "dmt1"
          ) {
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
        data,
        setRequest,
        (res) => {
          getRecentData();
          okSuccessToast(res.data.message);
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
              if (
                res?.data?.status === "OTP" &&
                view === "MT_View" &&
                dmtValue === "dmt1"
              ) {
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
    } else {
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
        onClick={handleOpen}
        className="button-red"
        size="small"
      >
        <Spinner loading={request} size="small" />
        {view === "MT_View" ? "Add Beneficiary" : "Add Vendor"}
      </Button>

      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <Spinner loading={request} />
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
                <Grid item md={11.6} xs={11.6}>
                  {/* <FormControl sx={{ width: "100%" }}>
                    <Autocomplete
                      // filterOptions={filterOptions}
                      disablePortal
                      id="combo-box-demo"
                      options={bankList ? bankList : ""}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setBankId(
                            view === "MT_View" && dmtValue === "dmt2"
                              ? newValue.id
                              : newValue.bankId
                          );
                          setIfscVal(
                            view === "MT_View" && dmtValue === "dmt2"
                              ? newValue.ifsc
                              : newValue.ifscGlobal
                          );
                          setBankName(newValue.name);
                        }
                      }}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Bank"
                          size="small"
                          required
                          value={bankTextVal}
                          onChange={(e) => {
                            setBankTextVal(e.target.value);
                          }}
                        />
                      )}
                      clearIcon={
                        <BackspaceIcon
                          sx={{ fontSize: "15px", ml: 0 }}
                          onClick={() => {
                            setBankId("");
                            setIfscVal("");
                            setBankName("");
                          }}
                        />
                      }
                    />
                  </FormControl> */}
                  <ApiSearch
                    label="Search Bank"
                    name="user_id"
                    placeholder="Bank"
                    cb1={(item) => {
                      setBankId(
                        view === "MT_View" && dmtValue === "dmt3"
                          ? item.id
                          : item.bankId
                      );
                      setIfscVal(
                        view === "MT_View" && dmtValue === "dmt3"
                          ? item.ifsc
                          : item.ifscGlobal
                      );
                      setBankName(item.newValue);
                    }}
                    nameKeys={["name"]}
                    searchApi={
                      view === "MT_View" && dmtValue === "dmt3"
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

         

                {dmtValue === "dmt3" && viewMpin && (
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
              btn={view === "MT_View" ? "Add Beneficiary" : "Add Vendor"}
              disable={!isValidName || !accNoV}
              twobuttons={dmtValue === "dmt3" ? "Verify & Add" : false}
              // onClick2={() => {
              //   viewMpin === false &&
              //     setTimeout(() => {
              //       setViewMpin(true);
              //     }, 300);
              // }}
            />
          </Box>
        </Modal>
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
export default Dmt3AddBeneficiaryModal;
