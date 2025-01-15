import {
  Button,
  FormControl,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Typography,
  Hidden,
  Modal,
} from "@mui/material";
import * as Yup from "yup";
import Divider from "@mui/material/Divider";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "../component/loading-screen/Loader";
import { useNavigate } from "react-router-dom";
import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";
import { Box } from "@mui/system";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  lockicon,
  loginPage1,
  LoginPageIllustratorImg,
  mobilelogin,
} from "../iconsImports";
import ForgotPass from "../modals/ForgotPass";
import ReCAPTCHA from "react-google-recaptcha";
import AuthContext from "../store/AuthContext";
import { postJsonData, get, getAxios } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okErrorToast } from "../utils/ToastUtil";
import { getGeoLocation } from "../utils/GeoLocationUtil";
import VerifyMpinLogin from "../component/VerifyMpinLogin";

import { PATTERNS } from "../utils/ValidationUtil";
import ModalHeader from "../modals/ModalHeader";
import ModalFooter from "../modals/ModalFooter";
import LogoComponent from "../component/LogoComponent";
const LoginPage = () => {
  const [isMobv, setIsMobv] = useState(true);
  const [isPassV, setIsPassV] = useState(true);
  const [loginRequest, setLoginRequest] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [username, setUsername] = useState("");
  const [userRequest, setUserRequest] = useState(false);
  const [secureValidate, setSecureValidate] = useState("test");
  const [password, setPassword] = useState("");
  const authCtx = useContext(AuthContext);
  // const [isMobv, setIsMobv] = useState(true);

  const [isOtpField, setIsOtpField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const captchaRef = useRef(null);
  const navigate = useNavigate();
  const [modelOpen, setModelOpen] = useState(false);
  const [isServiceDown, setIsServiceDown] = useState(false);
  //  const handleModelClose = () => {
  //     setIsServiceDown(false);
  //   };
  useEffect(() => {
    const checkServiceDownTime = () => {
      const now = new Date();
      const currentHour = now.getHours();

      if (currentHour >= 0 && currentHour < 6) {
        setIsServiceDown(true);
      } else {
        setIsServiceDown(false);
      }
    };

    checkServiceDownTime();

    const intervalId = setInterval(checkServiceDownTime, 300000);

    return () => clearInterval(intervalId);
  }, []);

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
      .required("Mobile number is required"),
    password: Yup.string().required("Password is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    locationVal();
    return () => {};
  }, []);

  const locationVal = getGeoLocation(
    (lat, long) => {
      authCtx.setLocation(lat, long);
      return [lat, long];
    },
    (err) => {
      okErrorToast("Location", err);
    }
  );
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && (e.key === "u" || e.key === "U")) ||
        (e.ctrlKey && e.shiftKey && e.key === "I")
      ) {
        e.preventDefault();
      }
    };

    const preventSelection = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("selectstart", preventSelection);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("selectstart", preventSelection);
    };
  }, []);

  // setInterval(checkDevTools, 1000);
  const handleLoginDisable = () => {
    // if (!captchaChecked) {
    //   return true;
    if (!agreedToTerms) {
      return true;
    } else if (username.length < 10) {
      return true;
    } else if (!isMobv) {
      return true;
    } else if (!isPassV) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const captchaclickApi = () => {
    setCaptchaChecked(true);
    console.log("Clicked Captcha");
  };

  const handleClick = (event) => {
    // if (isMobv && username !== ""){
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // You can handle login success/failure here
    }, 3000); // Simulate a 3-second delay

    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      username: form.username.value,
      password: form.password.value,
    };

    if (authCtx && !authCtx.location) {
      apiErrorToast("User Denied Geolocation");
      setLoading(false);
    } else {
      postJsonData(
        ApiEndpoints.SIGN_IN,
        data,
        setLoginRequest,
        (res) => {
          if (res && res.data && res.data.data && res.data.data === "MPIN") {
            setUsername(data.username);
            setSecureValidate("MPIN");
            setIsOtpField(true);
            setLoading(false);
          }
          if (res && res.data && res.data.data && res.data.data === "OTP") {
            setUsername(data.username);
            setSecureValidate("OTP");
            setIsOtpField(true);
            setLoading(false); // Hide Loader
          } else if (res && res.data.data && res.data?.data?.access_token) {
            const access = res?.data?.data?.access_token;
            authCtx.login(access);
            get(
              ApiEndpoints.GET_ME_USER,
              "",
              setUserRequest,
              (res) => {
                getAxios(access);
                const user = res.data.data;
                const docs = res?.data?.docs;
                if (docs && typeof docs === "object") {
                  authCtx.setDocsInLocal(docs);
                }
                authCtx.saveUser(user);

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
                setLoading(false); // Hide Loader
              },
              (error) => {
                apiErrorToast(error);
                authCtx.logout();
                setLoading(false); // Hide Loader
              }
            );
          }
        },
        (error) => {
          apiErrorToast(error);
          setLoading(false); // Hide Loader
        }
      );
    }
    // }
    // else{
    //   setIsMobv(false)
    // }
  };

  return (
    <div>
      {isServiceDown && (
        <Modal open={isServiceDown}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 700,
              bgcolor: "white",
              color: "black",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <ModalHeader title=" Service Unavailable" />

            <Typography id="service-down-description" sx={{ mt: 2 }}>
              Due to Security Reasons Login is not allowed from 12:00 AM mid
              night to 6:00AM. Please Login after 6:00AM.Thanks
            </Typography>
            <Grid container alignItems="center" sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <LogoComponent />
              </Grid>
              <Grid item xs={6} sx={{ textAlign: "right" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                  }}
                >
                  {/* <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleModelClose}
                  >
                    Cancel
                  </Button> */}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      )}
      <Grid container spacing={0} sx={{ height: "100vh", overflow: "hidden" }}>
        {loading && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(5px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1200,
            }}
          >
            {/* <Loader loading={loading} /> */}
          </Box>
        )}
        {/* Left Column - Hidden on medium and smaller screens */}
        <Hidden mdDown>
          <Grid
            item
            xs={12}
            md={7}
            lg={7}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 9,
              backgroundImage: `url(${LoginPageIllustratorImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "100vh",
              width: "100%",
            }}
          >
            <Typography
              variant="h1"
              sx={{
                color: "#fff",
                // mb: { xs: 10, sm: 15, md: 12 },
                // mt:{lg:0},
                // textAlign: {xs:"center",md:"left"},
                // marginLeft:{xs:0,sm:-10,md:-6,lg:16},
                fontSize: { xs: "18px", sm: "20px", md: "32px", lg: "44px" },
                fontFamily: "Manrope",
                justifyContent: "top",
                alignItems: "center",
                lineHeight: "1.3",
                letterSpacing: "0.08em",

                mb: { lg: "250px" },
                // marginLeft: { xs: 0, sm: -10, md: -6, lg: 0 },
              }}
            >
              VistarMoney <br /> Simplifying Payments <br /> Amplifying Growth
            </Typography>
          </Grid>
        </Hidden>

        {/* Right Column - Always visible */}
        <Grid
          item
          xs={12}
          md={5}
          lg={5}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 6,
            my: "auto",
            maxHeight: "80vh",
          }}
        >
          <Box sx={{}}>
            <Button>
              <Box
                component="img"
                src={loginPage1}
                alt="admin dash"
                sx={{
                  maxWidth: "50%",
                  // maxHeight: "46%",
                  maxHeight: "80vh",
                  objectFit: "cover",
                  mb: 4,
                }}
                onClick={() => navigate("/")}
              />
            </Button>
            <Loader loading={loading} />
            <Box component="form" id="contact" onSubmit={handleClick}>
              {!isOtpField && !isOtpField ? (
                <Grid container spacing={0.5} sx={{ mb: 6 }}>
                  <Grid item xs={12} sx={{ mb: 2 }}>
                    <FormControl
                      sx={{
                        width: "100%",
                        pointerEvents: isServiceDown ? "none" : "auto",
                        opacity: isServiceDown ? 0.5 : 1,
                      }}
                    >
                      <Typography
                        fullWidth
                        sx={{
                          display: "flex",
                          justifyContent: "left",
                          fontWeight: "bold",
                        }}
                      >
                        Mobile Number
                      </Typography>
                      {/* <TextField autoComplete="off"
                      placeholder="Enter your Mobile Number"
                      name="username"
                      control={control}
                      errors={errors}
                      variant="standard"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon icon="mi:call" style={{ color: "#292D32" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiInputBase-root": {
                          border: "none",
                        },
                        "& .MuiInput-underline:before": {
                          borderBottom: "1px solid #4253F0",
                        },
                        "& .MuiInput-underline:hover:before": {
                          borderBottom: "2px solid #4253F0",
                        },
                        "& .MuiInput-underline:after": {
                          borderBottom: "2px solid #4253F0",
                        },
                      }}
                    /> */}
                      <TextField
                        autoComplete="off"
                        // label="Mobile"
                        placeholder="Enter your Mobile Number"
                        // id="mob"
                        // size="small"
                        variant="outlined"
                        name="username"
                        required
                        type="number"
                        error={!isMobv}
                        helperText={!isMobv ? "Enter valid Mobile Number" : ""}
                        onChange={(e) => {
                          setIsMobv(PATTERNS.MOBILE.test(e.target.value));
                          if (e.target.value === "") setIsMobv(true);
                          if (setUsername) setUsername(e.target.value);
                        }}
                        InputProps={{
                          style: { padding: 0, borderRadius: "10px" }, // Adjust padding as needed

                          endAdornment: (
                            // <InputAdornment sx={{justifyContent:"end"}}>
                            //   <IconButton>
                            //     <Icon
                            //       icon="mi:call"
                            //       style={{ color: "#fff",backgroundColor:"#0F7709",width:"100%" }}
                            //     />
                            //   </IconButton>
                            // </InputAdornment>
                            <img
                              src={mobilelogin}
                              alt=""
                              style={{ width: "57px" }}
                            />
                          ),
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "+" || e.key === "-")
                            e.preventDefault();
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

                  <Grid item xs={12} sx={{ mt: 0 }}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      sx={{
                        pointerEvents: isServiceDown ? "none" : "auto",
                        opacity: isServiceDown ? 0.5 : 1,
                      }}
                    >
                      <Typography
                        fullWidth
                        sx={{
                          display: "flex",
                          justifyContent: "left",
                          fontWeight: "bold",
                        }}
                      >
                        Password
                      </Typography>
                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            autoComplete="off"
                            {...field}
                            placeholder="Enter Your Password"
                            type={showPassword ? "text" : "password"}
                            // variant="standard"
                            variant="outlined"
                            // error={!!errors.password}
                            error={!isPassV}
                            helperText={
                              // errors.password ? errors.password.message : ""
                              !isPassV
                                ? "Password must be alphanumeric, With One Special Character, min 8 characters"
                                : ""
                            }
                            onChange={(e) => {
                              setIsPassV(
                                PATTERNS.PASSWORD.test(e.target.value)
                              );
                              if (setPassword) setPassword(e.target.value);
                            }}
                            InputProps={{
                              style: { padding: 0, borderRadius: "10px" }, // Adjust padding as needed
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                  >
                                    {showPassword ? (
                                      <Visibility />
                                    ) : (
                                      <VisibilityOff />
                                    )}
                                  </IconButton>
                                  <img
                                    src={lockicon}
                                    alt="lock"
                                    style={{
                                      width: "57px",
                                      alignItems: "flex-end",
                                    }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                        sx={{
                          "& .MuiInputBase-root": {
                            border: "none",
                          },
                          "& .MuiInput-underline:before": {
                            borderBottom: "1px solid #4253F0",
                          },
                          "& .MuiInput-underline:hover:before": {
                            borderBottom: "2px solid #4253F0",
                          },
                          "& .MuiInput-underline:after": {
                            borderBottom: "2px solid #4253F0",
                          },
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <FormControl
                      sx={{
                        width: "100%",
                        textAlign: "end",
                        marginLeft: 0,
                        marginTop: -4,
                        pointerEvents: isServiceDown ? "none" : "auto",
                        opacity: isServiceDown ? 0.5 : 1,
                      }}
                    >
                      <ForgotPass
                        username={username}
                        setUsername={setUsername}
                      />
                    </FormControl>
                  </Grid>

                  {/* <ReCAPTCHA
                    sitekey={process.env.REACT_APP_SITE_KEY}
                    ref={captchaRef}
                    onExpired={() => setCaptchaChecked(false)}
                    onChange={captchaclickApi}
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      display: "flex",
                    }}
                  /> */}
                  <Grid item xs={12} sx={{ mb: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          fontSize={12}
                        >
                          I agree to the{" "}
                          <Link
                            href="/terms-conditions"
                            underline="always"
                            color="#4253F0"
                            fontSize={12}
                          >
                            Terms and Conditions
                          </Link>
                        </Typography>
                      }
                      sx={{
                        width: "100%",
                        textAlign: "center",
                        marginBottom: 0,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 0 }}>
                    <Button
                      type="submit"
                      form="contact"
                      variant="contained"
                      sx={{
                        width: "100%",
                        // mt: 2,
                        // marginLeft:3,
                        // borderRadius: 6,
                        color: "#fff",
                        backgroundColor: "#0F7709",
                        fontWeight: "bold",
                        "&:hover": {
                          backgroundColor: "#0F7709",
                          fontWeight: "bold",
                        },
                      }}
                      // disabled={!(captchaChecked && agreedToTerms) && (isMobv && username !== "")}
                      disabled={handleLoginDisable()}
                    >
                      {isOtpField ? "Verify OTP" : "Login"}
                    </Button>
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 0 }}>
                    {/* <Divider 
                  sx={{
                    height: "5px",
                    color: "black",
                    border: "none"
                  }}
                /> */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        my: 2,
                        width: "90%",
                        mx: "auto",
                      }}
                    >
                      <Divider
                        sx={{
                          flexGrow: 1,
                          height: "2px",
                          backgroundColor: "black",
                          border: "none",
                          color: "black",
                        }}
                      />
                      <Typography sx={{ mx: 2 }}>OR</Typography>
                      <Divider
                        sx={{
                          flexGrow: 1,
                          height: "2px",
                          backgroundColor: "black",
                          border: "none",
                          color: "black",
                        }}
                      />
                    </Box>
                    {/* npm i @fvilers/disable-react-devtools */}
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 0 }}>
                    <Button
                      // type="submit"
                      form="contact"
                      variant="contained"
                      onClick={() => {
                        navigate("/sign-up");
                      }}
                      sx={{
                        width: "100%",
                        // mt: 2,
                        // marginLeft:3,
                        // borderRadius: 6,
                        color: "#0F7709",
                        border: "1px solid #0F7709",
                        fontWeight: "bold",
                        backgroundColor: "#fff", //"#4253F0", "#D48628"
                        "&:hover": {
                          backgroundColor: "#0F7709",
                          color: "#fff",
                        },
                      }}
                      // disabled={!(captchaChecked && agreedToTerms) && (isMobv && username !== "")}
                      // disabled={handleLoginDisable()}
                    >
                      {/* {isOtpField ? "Verify OTP" : "Login"} */}Sign Up Now
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ mt: 0, display: "flex", justifyContent: "right" }}
                  ></Grid>
                </Grid>
              ) : (
                <VerifyMpinLogin
                  username={username}
                  showLaoder={false}
                  secureValidate={secureValidate}
                  setSecureValidate={setSecureValidate}
                  setUserRequest={setUserRequest}
                  setIsOtpField={setIsOtpField}
                  btn="Login"
                />
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default LoginPage;
