// import * as React from "react";
import Box from "@mui/material/Box";
import { Button, FormControl, Grid, Typography } from "@mui/material";
import PinInput from "react-pin-input";
import { useCallback, useState } from "react";
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
import ResetMpin from "../modals/ResetMpin";
import { useEffect } from "react";
import TimerButton from "./TimerButton";
import useCommonContext from "../store/CommonContext";
import { otherTokenApiCallPost } from "../utils/otherTokenApiCall";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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

const VerifyMpinLogin = ({
  username,
  setSecureValidate,
  secureValidate,
  setUserRequest,
  setIsOtpField,
  isOtpField,
  btn = "Login",
  setCurrentStep = false,
  usedInSignUp = false,
  currentStep = 0,
  verifStepSuccRes = false,
  data,
  showLaoder = true,
  // just in case of adding bene
  getRemitterStatus,
  rem_mobile,
  setOpenBene,
  adUserData,
  bankAddApiCall,
  setAcctHolderName,
  // used in outlet registration only for now
  handleCloseCallBk,
}) => {
  const authCtx = useContext(AuthContext);

  const user = authCtx.user;
  const setParentResponse = authCtx.setParentResponse;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [otp, setOtp] = useState("");
  const [title, setTitle] = useState("");
  const [err, setErr] = useState();
  const [isresend, setIsResend] = useState(true);
  const { getRecentData, refreshUser } = useCommonContext();
  // const [parentResponse, setParentResponse] = useState("");
  const handleClose = () => {
    setOpen(false);
    setSecureValidate("");
    setErr("");
    setOtp("");
    setParentResponse("");
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
            ? "M-PIN"
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
        otpReferenceID: verifStepSuccRes && verifStepSuccRes.otpReferenceID,
      };
    }
    e.preventDefault();
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
    postJsonData(
      ApiEndpoints.SIGN_UP_LAST,
      data,
      setRequest,
      (res) => {
        okSuccessToast(res.data.message);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

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
        message: "Six Digit M pin Required",
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
          if (res && res.data && res.data?.data?.access_token) {
            const access = res?.data?.data?.access_token;
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

                if (user?.role !== "Admin") {
                  getParent();
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

  const getParent = () => {
    if (user?.role === "Admin") {
      return;
    }
    get(
      ApiEndpoints.GET_PARENT,
      "",
      () => {},
      (res) => {
        // const data = res.data.data;
        setParentResponse(res?.data?.data);
      },
      (err) => {
        // const error = "You Don't have any Asm";
        // apiErrorToast(error);
      }
    );
  };

  // const returnLoginPage = () => {
  // };

  return (
    <Grid
      container
      spacing={3}
      sx={{ justifyContent: "center", mb: { xs: 2, md: 4 } }}
    >
      <Grid item xs={12}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            sx={{
              width: "100%",
              position: "relative",
              justifyContent: "center",
            }}
          >
            <Button
              onClick={() => {
                if (!isOtpField) setIsOtpField(false);
              }}
              sx={{
                position: "absolute",
                left: { xs: "5%", sm: "10%", md: "15%" },
                padding: 0,
              }}
            >
              <ArrowBackIcon
                sx={{
                  cursor: "pointer",
                  fontSize: { xs: "1.25rem", md: "1.50rem" },
                  color: "#000",
                }}
              />
            </Button>

            <Typography
              variant="h6"
              component="h2"
              sx={{
                color: "#000",
                fontWeight: "bold",
                fontSize: { xs: "1.2rem", sm: "1.3rem", md: "1.5rem" },
                textAlign: "center",
                flexGrow: 1,
                ml: { xs: 4, sm: 6, md: 8, lg: 1 },
              }}
            >
              {title}
            </Typography>

            <Loader loading={request} />
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12}>
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
            "& .MuiTextField-root": { m: { xs: 1, sm: 2 } },
          }}
        >
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
              <FormControl
                fullWidth
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <PinInput
                  length={6}
                  autoComplete="off"
                  focus
                  type="password"
                  onChange={(value) => {
                    if (err !== "") setErr("");
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

                <Box sx={{ mt: 2, marginLeft: 25 }}>
                  <ResetMpin variant="text" username={username} />
                </Box>
              </FormControl>
            </Grid>

            {secureValidate === "MPIN" && (
              <>
                {err && (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        fontSize: "12px",
                        color: "#DC5F5F",
                        textAlign: "center",
                      }}
                    >
                      {err.message && <div>{err.message}</div>}
                      {err.data && (
                        <div className="blink_text">
                          Attempts remaining: {5 - Number(err.data)}
                        </div>
                      )}
                    </Box>
                  </Grid>
                )}
              </>
            )}

            {secureValidate === "OTP" && (
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                {isresend ? (
                  <TimerButton
                    login={true}
                    initialSeconds={30}
                    setIsResend={setIsResend}
                    isresend={isresend}
                  />
                ) : (
                  <Button
                    onClick={currentStep === 3 ? resendOtpLast : resendOtpFunc}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Loader loading={request} size="small" />
                    Resend OTP
                  </Button>
                )}
                {err && err.message && <div>{err.message}</div>}
              </Grid>
            )}
            {/* {secureValidate === "OTP" && (
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                {isresend ? (
                  <TimerButton
                    initialSeconds={120}
                    setIsResend={setIsResend}
                    isresend={isresend}
                  />
                ) : (
                  <Button
                    onClick={currentStep === 3 ? resendOtpLast : resendOtpFunc}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Loader loading={request} size="small" />
                    Resend OTP
                  </Button>
                )}
                {err && err.message && <div>{err.message}</div>}
              </Grid>
            )} */}
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                form="VerifyOtpLogin"
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  width: "100%",
                  maxWidth: { xs: "250px", md: "300px" },
                  mt: 2,
                  borderRadius: 6,
                  color: "#fff",
                  backgroundColor: "#4253F0",
                }}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default VerifyMpinLogin;
