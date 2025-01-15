import {
  Button,
  Card,
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
} from "@mui/material";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "../component/loading-screen/Loader";
import { useNavigate } from "react-router-dom";
import VerifyOtpLogin from "../modals/VerifyOtpLogin";
import React, { useEffect, useState, useRef, useContext } from "react";
import { Box } from "@mui/system";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { loginPage, loginPage1 } from "../iconsImports";
import { Icon } from "@iconify/react";
import Marquee from "react-fast-marquee";
import ForgotPass from "../modals/ForgotPass";
import ReCAPTCHA from "react-google-recaptcha";
import AuthContext from "../store/AuthContext";
import { postJsonData, get, getAxios } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okErrorToast } from "../utils/ToastUtil";
import { getGeoLocation } from "../utils/GeoLocationUtil";
import VerifyMpinLogin from "../component/VerifyMpinLogin";
const LoginPageCopy = () => {
  const [isMobv, setIsMobv] = useState(true);
  const [loginRequest, setLoginRequest] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [username, setUsername] = useState("");
  const [userRequest, setUserRequest] = useState(false);
  const [secureValidate, setSecureValidate] = useState("test");
  const authCtx = useContext(AuthContext);

  const [isOtpField, setIsOtpField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const captchaRef = useRef(null);
  const navigate = useNavigate();

  const schema = Yup.object({
    username: Yup.string()
      .matches(/^\d{0,10}$/, "Enter a valid Phone Number")
      .required("Phone number is required"),
    password: Yup.string().required("Password is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
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
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const captchaclickApi = () => {
    setCaptchaChecked(true);
    console.log("Clicked Captcha");
  };

  const handleClick = (event) => {
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
  };

  return (
    <Grid container spacing={0} sx={{ height: "100vh", overflow: "hidden" }}>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(5px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1200,
          }}
        >
          <Loader loading={loading} />
        </Box>
      )}
      {/* Left Column - Hidden on medium and smaller screens */}
      <Hidden mdDown>
        <Grid
          item
          xs={12}
          md={7}
          lg={8}
          sx={{
            backgroundColor: "#4253F0",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 9,

            height: "100vh",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "#fff",
              mb: { xs: 10, sm: 15, md: 12 },
              // textAlign: {xs:"center",md:"left"},
              // marginLeft:{xs:0,sm:-10,md:-6,lg:16},
              fontSize: { xs: "18px", sm: "20px", md: "32px" },
              fontFamily: "Manrope",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: { xs: 0, sm: -10, md: -6, lg: 0 },
            }}
          >
            The simplest way to manage
            <br /> your payments
          </Typography>
          <Box
            component="img"
            src={loginPage}
            alt="admin dash"
            sx={{
              maxWidth: "70%",
              maxHeight: "100%",
              objectFit: "cover",
              borderRadius: "16px",
              marginTop: "-70px",
              marginLeft: 16,
            }}
          />
          <br />
          <br />
          <Marquee
            fade={true}
            gradient={true}
            gradientColor="#4253F0"
            pauseOnHover={true}
            speed={100}
          >
            {/* Marquee items */}
            {[
              "Recharge and Bill payment",
              "DTH Recharge",
              "Money Transfer",
              "Mobile Recharge",
              "Nepal Money Transfer",
              "Fund Transfer",
              "UPI Transfer",
              "Fastag Recharge",
              "Insurance",
              "Train Ticket",
              "Domestic Money Transfer",
              "AEPS",
              "Micro ATM",
              "Travel",
              "Loan EMI",
            ].map((item, index) => (
              <Typography
                key={index}
                sx={{
                  color: "white",
                  marginRight: 3,
                  fontSize: "24px",
                  fontFamily: "Marope",
                }}
              >
                {item}
              </Typography>
            ))}
          </Marquee>
          <br />

          <Marquee
            fade={true}
            gradient={true}
            gradientColor="#4253F0"
            pauseOnHover={true}
          >
            {/* Repeated Marquee items */}
            {[
              "Recharge and Bill payment",
              "DTH Recharge",
              "Money Transfer",
              "Mobile Recharge",
              "Nepal Money Transfer",
              "Fund Transfer",
              "UPI Transfer",
              "Fastag Recharge",
              "Insurance",
              "Train Ticket",
              "Domestic Money Transfer",
              "AEPS",
              "Micro ATM",
              "Travel",
              "Loan EMI",
            ].map((item, index) => (
              <Typography
                key={index}
                sx={{
                  color: "white",
                  marginRight: 3,
                  fontSize: "24px",
                  fontFamily: "Marope",
                }}
              >
                {item}
              </Typography>
            ))}
          </Marquee>
        </Grid>
      </Hidden>

      {/* Right Column - Always visible */}
      <Grid
        item
        xs={12}
        md={5}
        lg={4}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 9,
        }}
      >
        <Box sx={{ padding: 3, width: "100%", maxWidth: 400 }}>
          <Box
            component="img"
            src={loginPage1}
            alt="admin dash"
            sx={{
              maxWidth: "75%",
              maxHeight: "50%",
              objectFit: "cover",
              mb: 10,
            }}
          />

          <Box component="form" id="contact" onSubmit={handleClick}>
            {!isOtpField && !isOtpField ? (
              <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} sx={{ mb: 2 }}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
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
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <TextField autoComplete="off"
                          {...field}
                          placeholder="Enter Your Password"
                          type={showPassword ? "text" : "password"}
                          variant="standard"
                          error={!!errors.password}
                          helperText={
                            errors.password ? errors.password.message : ""
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Icon
                                  icon="solar:lock-password-outline"
                                  style={{ color: "#292D32" }}
                                />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
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
                      marginTop: -5,
                    }}
                  >
                    <ForgotPass />
                  </FormControl>
                </Grid>

                <ReCAPTCHA
                  sitekey={process.env.REACT_APP_SITE_KEY}
                  ref={captchaRef}
                  onExpired={() => setCaptchaChecked(false)}
                  onChange={captchaclickApi}
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    display: "flex",
                  }}
                />
                <Grid item xs={12} sx={{ mt: 4 }}>
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
                          href="#"
                          underline="always"
                          color="#4253F0"
                          fontSize={12}
                        >
                          Terms and Conditions
                        </Link>
                      </Typography>
                    }
                    sx={{ width: "100%", textAlign: "center", marginBottom: 0 }}
                  />
                </Grid>
                <Button
                  type="submit"
                  form="contact"
                  variant="contained"
                  sx={{
                    width: "100%",
                    mt: 2,
                    color: "#fff",
                    backgroundColor: "#4253F0",
                  }}
                  disabled={!(captchaChecked && agreedToTerms)}
                >
                  {isOtpField ? "Verify OTP" : "Login"}
                </Button>
              </Grid>
            ) : (
              <VerifyMpinLogin
                username={username}
                showLaoder={false}
                secureValidate={secureValidate}
                setSecureValidate={setSecureValidate}
                setUserRequest={setUserRequest}
                btn="Login"
              />
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPageCopy;
