import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button, FormControl, Grid } from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import PinInput from "react-pin-input";
import { useState } from "react";
import Loader from "../component/loading-screen/Loader";
import { get, getAxios, postJsonData } from "../network/ApiController";
import ApiEndpoints, { BASE_URL } from "../network/ApiEndPoints";
import AuthContext from "../store/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  apiErrorToast,
  confirmButtonSwal,
  okSuccessToast,
} from "../utils/ToastUtil";
import ResetMpin from "./ResetMpin";
import { useEffect } from "react";
import TimerButton from "../component/TimerButton";
import useCommonContext from "../store/CommonContext";
import { otherTokenApiCallPost } from "../utils/otherTokenApiCall";

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

const VerifyOtpLogin = ({
  username,
  setSecureValidate,
  secureValidate,
  setUserRequest,
  btn = "Login",
  setCurrentStep = false,
  usedInSignUp = false,
  currentStep = 0,
  verifStepSuccRes = false,
  data,
  showLaoder = true,
  // just in case of adding bene
  otpRef="",
  getRemitterStatus,
  rem_mobile,
  setOpenBene,
  adUserData,
  bankAddApiCall,
  setAcctHolderName,
  // used in outlet registration only for now
  handleCloseCallBk,
  resendOtpApi
  // resendOtpApi = () => {}
}) => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [otp, setOtp] = useState("");
  const [title, setTitle] = useState("");
  const [err, setErr] = useState();
  const [isresend, setIsResend] = useState(true);
  const [resendOtp, setResendOtp] = useState();
  const { getRecentData, refreshUser } = useCommonContext();
  const [insideData, setInsideData] = useState();

  useEffect(() => {
    setInsideData(data);
  }, [])

  const handleClose = () => {
    setOpen(false);
    setSecureValidate("");
    setErr("");
    setOtp("");
  };

  useEffect(() => {
    if (
      secureValidate === "MPIN" ||
      secureValidate === "OTP" ||
      secureValidate === "Beneficiary" ||
      secureValidate === "adAdd" ||
      secureValidate === "Add"
    ) {
      setOpen(true);
      setTitle(
        `Verify ${
          secureValidate === "Beneficiary" || secureValidate === "adAdd"
            ? "OTP"
            : secureValidate === "Add"
            ? "MPIN"
            : secureValidate
        }`
      );
    }
  }, [secureValidate]);

  const otpAtBeneAdd = (e) => {
    e.preventDefault();
    // data here is otpReferenceID only
    postJsonData(
      ApiEndpoints.VALIDATE_OTP,
      { otpReference: data, otp },
      setRequest,
      (res) => {
        if (getRemitterStatus) getRemitterStatus(rem_mobile);
        okSuccessToast("Beneficiary Added Successfuly");
        getRecentData();
        if (setOpenBene) setOpenBene(false);
        setOpen(false);
        setSecureValidate("");
      },
      (err) => {
        apiErrorToast(err);
        if (getRemitterStatus) getRemitterStatus(rem_mobile);
        setSecureValidate("");
      }
    );
  };

  // this function is used in outlet reg api call
  const otpSubmitAtSignUp = (e) => {
    let data;
    if (currentStep !== 3) {
      data = { otp };
    } else {
      data = {
        otp,
        hash: verifStepSuccRes && verifStepSuccRes.hash,
        // otpReferenceID: verifStepSuccRes && verifStepSuccRes.otpReferenceID,
        otpReferenceID: otpRef
      };
    }
    setInsideData(data)
    e && e.preventDefault();
    if (secureValidate === "adAdd") {
      otherTokenApiCallPost(
        BASE_URL + ApiEndpoints.VERIFY_MOBILE,
        data,
        adUserData?.api_token,
        setRequest,
        (res) => {
          okSuccessToast(res.data.message);
          setOpen(false);
        },
        (err) => {
          apiErrorToast(err);
        }
      );
    } else {
      postJsonData(
        currentStep !== 3
          ? ApiEndpoints.VERIFY_MOBILE
          : ApiEndpoints.AEPS_VALIDATE,
        data,
        setRequest,
        (res) => {
          refreshUser();
          okSuccessToast(res.data.message);
          setOpen(false);
          if (currentStep !== 3) {
            if (setCurrentStep) setCurrentStep(currentStep + 1);
          }
          // used in outlet reg api call
          if (handleCloseCallBk) handleCloseCallBk("closemodal");
        },
        (err) => {
          apiErrorToast(err);
        }
      );
    }
  };

  const resendOtpFunc = () => {
    postJsonData(
      ApiEndpoints.RESEND_OTP,
      { username },
      setRequest,
      (res) => {
        okSuccessToast(res.data.message);
        setIsResend(true);
      },
      (err) => {
        apiErrorToast(err);
        setIsResend(false);
      }
    );
  };

  const resendOtpLast = () => {
    console.log("This is your data in resend OTP Last", data, insideData)
    postJsonData(
      ApiEndpoints.SIGN_UP_LAST,
      data ? data : insideData,
      setRequest,
      (res) => {
        okSuccessToast(res.data.message);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };
  // veriify bank
  const verifyBank = (e) => {
    data.mpin = otp;
    e.preventDefault();
    postJsonData(
      ApiEndpoints.VERIFY_ACC,
      data,
      setRequest,
      (res) => {
        const name = res?.data?.message;

        getRecentData();
        handleClose();
        confirmButtonSwal(() => bankAddApiCall(name), name);
      },
      (err) => {
        // confirmButtonSwal(() => bankAddApiCall("verifird"), "verified");
        apiErrorToast(err);
        if (err && err) {
          if (err.response.data.message === "Invalid M Pin") {
            setErr(err.response.data);
          }
        }
      }
    );
  };

  const handleSubmit = (event) => {
    let data;
    event.preventDefault();
    if (!otp || otp.length < 6) {
      setErr("");
      setOtp("");
      const error = {
        message: "Six Digit OTP Required",
      };
      setErr(error);
    } else {
      setErr("");
      if (secureValidate === "OTP") {
        data = {
          username: username,
          otp: otp,
        };
      }
      if (secureValidate === "MPIN") {
        data = {
          username: username,
          mpin: otp,
        };
      }

      postJsonData(
        ApiEndpoints.LOGIN_OTP_VALIDATE,
        data,
        setRequest,
        (res) => {
          if (res && res.data && res.data.access_token) {
            const access = res?.data?.access_token;
            authCtx.login(access);
            get(
              ApiEndpoints.GET_ME_USER,
              "",
              setUserRequest,
              (res) => {
                handleClose();
                getAxios(access);
                const user = res.data.data;
                const docs = res?.data?.docs;
                authCtx.saveUser(user);
                if (docs && typeof docs === "object") {
                  authCtx.setDocsInLocal(docs);
                }
                if (user?.status === 1) {
                  if (user && user.role === "Admin") {
                    navigate("/admin/dashboard");
                  } else if (user && user.role === "Asm") {
                    navigate("/asm/dashboard");
                  } else if (user && user.role === "Zsm") {
                    navigate("/zsm/dashboard");
                  } else if (user && user.role === "Ad") {
                    navigate("/ad/dashboard");
                  } else if (user && user.role === "Md") {
                    navigate("/md/dashboard");
                  } else if (
                    user &&
                    (user.role === "Ret" || user.role === "Dd")
                  ) {
                    if (user?.layout === 1) {
                      navigate("/customer/dashboard", {
                        state: { login: true },
                      });
                    } else if (user?.layout === 2) {
                      navigate("/customer/services", {
                        state: { login: true },
                      });
                    } else {
                      navigate("/customer/dashboard", {
                        state: { login: true },
                      });
                    }
                  } else if (user && user.role === "Acc") {
                    navigate("/account/dashboard");
                  } else if (user && user.role === "Api") {
                    navigate("/api-user/dashboard");
                  } else {
                    navigate("/other/dashboard");
                  }
                } else {
                  navigate("/sign-up", { state: { userStep: user.status } });
                }
              },
              (error) => {
                apiErrorToast(error);
                authCtx.logout();
              }
            );
          }
        },
        (error) => {
          apiErrorToast(error);
          if (error && error) {
            if (error.response.data.message === "Invalid M Pin") {
              setErr(error.response.data);
            }
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <Loader loading={request} />
          <ModalHeader title={title} handleClose={handleClose} />
          <Box
            component="form"
            id="VerifyOtpLogin"
            noValidate
            autoComplete="off"
            onSubmit={
              usedInSignUp
                ? otpSubmitAtSignUp
                : secureValidate === "Beneficiary"
                ? otpAtBeneAdd
                : secureValidate === "Add"
                ? verifyBank
                : handleSubmit
            }
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
                  <PinInput
                    length={6}
                    focus
                    type="password"
                    onChange={(value, index) => {
                      if (err !== "") {
                        setErr("");
                      }
                      setOtp(value);
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
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          {secureValidate === "MPIN" && (
            <>
              <Grid
                item
                md={12}
                xs={12}
                sx={{ display: "flex", justifyContent: "end", pr: 11, pt: 2 }}
              >
                <ResetMpin variant="text" py mt username={username} />
              </Grid>
              {err && err && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                    fontSize: "12px",
                    px: 2,
                    pt: 2,
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
            </>
          )}
          {secureValidate === "OTP" && (
            <Grid
              item
              md={12}
              xs={12}
              sx={{ display: "flex", justifyContent: "end", pr: 11 }}
            >
              <Box>
                {/* {isresend ? ( */}
                {true ? (
                  <TimerButton
                    initialSeconds={120}
                    setIsResend={setResendOtp}
                    isresend={resendOtp}
                    // resendOtp={resendOtpApi}
                    resendOtp={resendOtpFunc}
                  />
                ) : (
                  <Button
                    onClick={currentStep === 3 ? resendOtpLast : resendOtpFunc}
                    sx={{
                      position: "relative",
                    }}
                  >
                    <Loader loading={request && showLaoder} size="small" />
                    Resend OTP
                  </Button>
                )}
                {err && err.message && <div>{err && err.message}</div>}
              </Box>
            </Grid>
          )}

          <ModalFooter form="VerifyOtpLogin" btn={btn} />
        </Box>
      </Modal>
    </Box>
  );
};
export default VerifyOtpLogin;
