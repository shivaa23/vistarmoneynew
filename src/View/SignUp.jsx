import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Button,
  FormControl,
  Typography,
  Divider,
  Hidden
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Verification from "../component/Verification";
import Business from "../component/Business";
import { LoginPageIllustratorImg, loginPage } from "../iconsImports";
import Personal from "../component/Personal";
import Registration from "../component/Registration";
import ProgressBar from "../component/ProgressBar";
import LogoComponent from "../component/LogoComponent";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import {
  apiErrorToast,
  okErrorToast,
  okSuccessToast,
} from "../utils/ToastUtil";
import VerifyOtpLogin from "../modals/VerifyOtpLogin";
import AuthContext from "../store/AuthContext";
import Loader from "../component/loading-screen/Loader";
import { getGeoLocation } from "../utils/GeoLocationUtil";
import Marquee from "react-fast-marquee";

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // console.log("location", location && location.state.userStep);
  const [currentStep, setCurrentStep] = useState(0);
  const [hideNext, setHideNext] = useState(false);
  const [role, setRole] = useState("");
  //
  const [state, setState] = useState();
  const [district, setDistrict] = useState();
  const [gender, setGender] = useState();
  const [loading, setLoading] = useState(false);

  //
  const [bstate, setBstate] = useState();
  const [bdistrict, setBdistrict] = useState();
  const [request, setRequest] = useState(false);
  const [secureValidate, setSecureValidate] = useState("");
  const [handlerInfo, setHandlerInfo] = useState();
  const [username, setusername] = useState();
  const [verifStepSuccRes, setverifStepSuccRes] = useState();

  const [showError, setshowError] = useState(false);
  const authCtx = useContext(AuthContext);
  // const userLat = authCtx.location && authCtx.location.lat;
  // const userLong = authCtx.location && authCtx.location.long;
  const [tempData, setTempData] = useState();
  //
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
    locationVal();
    return () => {};
  }, []);

  useEffect(() => {
    const userStep = location && location.state && location.state.userStep;
    if (location.state) {
      if (userStep === 4) {
        setCurrentStep(1);
      } else if (userStep === 3) {
        setCurrentStep(2);
      }
      //  else if (userStep === 2) {
      //   setCurrentStep(3);
      // }
    }
  }, []);

  // console.log(role);

  // role === "ret"
  // ? "Enter your Distributer(Mobile)"
  // : role === "Dd"
  // ? "Enter your Asm(Mobile)"
  // : role === "Ad"
  // ? "Enter your Asm(Mobile)"
  // : "Enter Your Mobile"
  const handleClick = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    let data;

    if (currentStep === 0) {
      data = {
        name: `${form.fname.value} ${form.lname.value}`.toUpperCase(),
        username: form.mob.value,
        email: form.email.value,
        password: form.pass.value,
        role,
      };

      if (role === "Ad" || role === "Dd") {
        data.asm = handlerInfo && handlerInfo.id;
      } else {
        data.ad_id = handlerInfo && handlerInfo.id;
      }
    } else if (currentStep === 1) {
      data = {
        address: form.addr.value.toUpperCase(),
        state,
        district,
        pincode: form.pincode.value,
        pan: form.pan.value.toUpperCase(),
        gender,
      };
    } else if (currentStep === 2) {
      data = {
        business_address: form.baddress.value.toUpperCase(),
        business_district: bdistrict,
        business_name: form.bname.value.toUpperCase(),
        business_pincode: form.bpincode.value,
        business_state: bstate,
      };
      setTempData(data);
    }

    // else if (currentStep === 3) {
    //   data = {
    //     mobile: form.a_mob.value,
    //     pan: form.a_pan.value,
    //     aadhaar: form.aadhaar.value,
    //     email: form.email.value,
    //     latitude: userLat && userLat,
    //     longitude: userLong && userLong,
    //   };
    //   setTempData(data);
    // }
    // if (currentStep !== 3) {
    postJsonData(
      currentStep === 0
        ? ApiEndpoints.USER_REG
        : currentStep === 1
        ? ApiEndpoints.USER_PERSONALINFO
        : currentStep === 2
        ? ApiEndpoints.USER_BUSINESSINFO
        : // : currentStep === 3
          // ? ApiEndpoints.SIGN_UP_LAST
          "",
      data,
      setRequest,
      (res) => {
        // okSuccessToast("");
        if (currentStep === 0) {
          // console.log("first step data", res.data.message);
          const access = res?.data?.data?.api_token;
          authCtx.login(access);
          setSecureValidate("OTP");
          okSuccessToast(res.data.message);
        }
        if (currentStep === 1) {
          setCurrentStep(currentStep + 1);
        }
        if (currentStep === 2) {
          const data = res.data;
          okSuccessToast(data.message);
          navigate("/login");
          // setCurrentStep(currentStep + 1);
        }
        // if (currentStep === 3) {
        //   const data = res.data.data;
        //   setverifStepSuccRes(data);
        //   setSecureValidate("OTP");
        // }
      },
      (err) => {
        apiErrorToast(err);
        // if (currentStep === 3) {
        //   setSecureValidate("OTP");
        // }
      }
    );
    // }
  };

  return (
    <Grid container spacing={0} sx={{ height: '100vh', overflow: 'hidden' }}>
      {loading && (
        <Box
          sx={{
            // position: 'fixed',
            // top: 0,
            // left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
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
        lg={7}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 9,
          backgroundImage: `url(${LoginPageIllustratorImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat',
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
      
        {/* <Grid
          item
          xs={12}
          md={7}
          lg={7}
          sx={{
            backgroundColor: "#4253F0",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 9,
            borderRadius: 5,
            height: '97vh'
          }}
        >
          <Typography
            variant="h4"
            
            sx={{
              color:"#fff",
              mb:{xs:10,sm:15,md:12},
              // textAlign: {xs:"center",md:"left"},
              // marginLeft:{xs:0,sm:-10,md:-6,lg:16},
            fontSize:{xs:"18px", sm:"20px",md:"32px"},
              fontFamily:"Manrope",
              justifyContent:"center",
              alignItems:"center",
             marginLeft:{xs:0,sm:-10,md:-6,lg:0},

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
          {['Recharge and Bill payment', 'DTH Recharge', 'Money Transfer', 'Mobile Recharge', 'Nepal Money Transfer', 'Fund Transfer', 'UPI Transfer', 'Fastag Recharge', 'Insurance', 'Train Ticket', 'Domestic Money Transfer', 'AEPS', 'Micro ATM', 'Travel', 'Loan EMI'].map((item, index) => (
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
          {['Recharge and Bill payment', 'DTH Recharge', 'Money Transfer', 'Mobile Recharge', 'Nepal Money Transfer', 'Fund Transfer', 'UPI Transfer', 'Fastag Recharge', 'Insurance', 'Train Ticket', 'Domestic Money Transfer', 'AEPS', 'Micro ATM', 'Travel', 'Loan EMI'].map((item, index) => (
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
        </Grid> */}
      </Hidden>

    <Grid
    item
    xs={12}
    md={5}
    lg={5}
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      overflow: 'scroll'
      // padding: 9,
    }}
      // container
      // className="login-page position-relative"
      // sx={{ p: { md: 2, lg: 2, sm: 1, xs: 1 } }}
    >
      {/* <Grid container className="login-page position-relative" sx={{ p: 2 }}> */}
      {/* <Loader loading={loginRequest || userRequest} circleBlue /> */}
      <Grid
        className="login-form"
        sx={{
          background: "#fff",
          width: "100%",
          height: "100%",
          pt: { md: 3, lg: 6, sm: 2, xs: 2 },
          border: "none"
          // px: { md: 6, lg: 6, sm: 2, xs: 2 },
        }}
        lg={12}
        md={5.5}
        sm={7}
        xs={12}
      >
        <Grid item md={12} xs={12}>
          {/* <Box sx={{ ml: { lg: 1, md: 1, sm: 1, xs: 0 } }}>
            <LogoComponent width="250rem" />
          </Box> */}
          <Typography
          variant="h2"
            sx={{
              width: "100%",
              // my: 1,
              // color: "#5e548e",
              // color: "#4253F0",
              color: 'black',
              // fontWeight: "600",
              fontSize: '2rem',
              mb: 5,
            }}
          >
            Create new account here
          </Typography>
        </Grid>
        <Box component="form" id="loginForm" validate onSubmit={handleClick}>
          <Grid
            item
            md={12}
            xs={12}
            sx={{ height: "max-content", overflowY: "scroll" }}
          >
            {currentStep === 0 ? (
              <Registration
                setHideNext={setHideNext}
                setRole={setRole}
                role={role}
                handlerInfoCB={(val) => {
                  setHandlerInfo(val);
                }}
                setusername={setusername}
                setshowError={setshowError}
                showError={showError}
              />
            ) : currentStep === 1 ? (
              <Personal
                setHideNext={setHideNext}
                setState={setState}
                state={state}
                setDistrict={setDistrict}
                district={district}
                setGender={setGender}
                gender={gender}
              />
            ) : currentStep === 2 ? (
              <Business
                setHideNext={setHideNext}
                bstate={bstate}
                bdistrict={bdistrict}
                setBdistrict={setBdistrict}
                setBstate={setBstate}
              />
            ) : (
              // : currentStep === 3 ? (
              //   <Verification setHideNext={setHideNext} />
              // )
              ""
            )}
          </Grid>
          <Grid md={12} xs={12} sx={{ mt: 3 }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                // className={`${currentStep < 2 ? "" : "button-purple"}`}
                className="button-purple-no-imp"
                onClick={() => {
                  if (currentStep > 0) {
                    setCurrentStep(currentStep - 1);
                  }
                }}
                disabled={currentStep < 2}
                sx={{
                  backgroundColor: currentStep < 2 && "",
                  color: currentStep < 2 && "#000",
                }}
              >
                <ArrowBackIosIcon sx={{ fontSize: "15px" }} />
                Prev
              </Button>

              <Button
                form="loginForm"
                type="submit"
                // className="button-red"
                sx={{ width: "max-content" }}
                disabled={
                  hideNext ||
                  showError === "Not Distributer" ||
                  showError === "Not Asm" ||
                  request
                }
              >
                {/* {currentStep === 3 ? "Sign Up" : "Next"} */}
                {currentStep === 2 ? "Sign Up" : <>Next<ArrowForwardIosIcon sx={{ fontSize: "15px" }} /></>}
                <Loader loading={request} size="small" />
              </Button>
            </Box>
            <Grid item md={12} xs={12} sx={{ mt: 2 }}>
              <ProgressBar currentStep={currentStep} />
            </Grid>
          </Grid>
        </Box>
        {/* already have an account section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { md: "row", sm: "row" },
            justifyContent: "space-between",

            mt: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { md: "row", sm: "row", xs: "column" },
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ fontSize: "14px", fontWeight: "600", opactiy: "0.6" }}
            >
              Already have an account?{" "}
            </Typography>
            <Button
              onClick={() => {
                navigate("/login");
              }}
              className="otp-hover-purple"
              sx={{
                color: "#fff",
                fontSize: "13px !important",
                ml: 0.3,
                textTransform: "capitalize",
                padding: "2px 6px",
              }}
            >
              Login here
            </Button>
          </Box>

          <Divider orientation="vertical" flexItem />
          <Button
            className="otp-hover-purple"
            sx={{
              color: "#fff",
              fontSize: "13px !important",
              ml: 0.3,
              textTransform: "capitalize",
              padding: "2px 6px",
            }}
            onClick={() => {
              navigate("/");
            }}
          >
            Back to home
          </Button>
        </Box>
        <VerifyOtpLogin
          secureValidate={secureValidate}
          setSecureValidate={setSecureValidate}
          setUserRequest={setRequest}
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          btn="Proceed"
          usedInSignUp
          username={username}
          verifStepSuccRes={verifStepSuccRes}
          data={tempData}
          showLaoder={false}
        />
      </Grid>
    </Grid>
    </Grid>
  );
};

export default SignUp;
