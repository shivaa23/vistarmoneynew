// we start from aeps tab from there we get the txncustdata
// after that we open the  aeps 2fa modal that is aeps2loginmodal
// onComplete={(custData, bankiin) => {
//   setCustTxnData(custData);
//   setOpenAeps2FAModal(true);
//   setBankiin(bankiin);
// }}
// after that we call outletAuthApiCall in aeps2loginmodal and on completion of that call
// in the aeps2view we call the aeps txn function

//   <AEPS2LoginModal
// twoFAStatus={twoFAStatus}
// bankiin={bankiin}
// onComplete={() => {
//   AepsTxn();
// }}
// />

/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Backdrop, Box, Button, Grid, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import AepsTabs from "../../component/AepsTabs";
import { useEffect } from "react";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { styled } from "@material-ui/styles";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VerifiedIcon from "@mui/icons-material/Verified";
import {
  AEPS,
  AEPS_TYPE,
  RDDeviceStatus,
  TWOFASTATUS,
} from "../../utils/constants";
import AuthContext from "../../store/AuthContext";
import useCommonContext from "../../store/CommonContext";
import { GetMFS100InfoLoad } from "../../utils/MantraCapture";
import Mount from "../../component/Mount";
import { aepsAuthImg, back } from "../../iconsImports";
import { banking } from "../../_nav";
// this is used in case of daily login
import AEPS2FAModal from "../../modals/aeps/AEPS2FAModal";
import HNavButton from "../../component/HNavButton";
import { primaryColor } from "../../theme/setThemeColor";
// this is used in case of transaction
import AEPS2LoginModal from "../../modals/aeps/AEPS2LoginModal";
import useResponsive from "../../hooks/useResponsive";
import RdServiceDrivers from "../../component/aeps/RdServiceDrivers";
import AEPSGuidelinesModal from "../../modals/aeps/AEPSGuidelinesModal";
// import AEPSTimer from "../../modals/aeps/AEPSTimer";
import { postJsonData } from "../../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../../utils/ToastUtil";
import Swal from "sweetalert2";
import MiniStatement from "../../component/MiniStatement";
import Aeps2faFromButton from "../../modals/aeps/Aeps2faFromButton";

// tab styles . . .
const StyledTabs = styled((props) => (
  <TabList
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 80,
    width: "100%",
    backgroundColor: "#4045A1",
  },
});

const AEPS2View = ({  resetView,
}) => {
  const [value, setValue] = useState(AEPS.CASH_WITHDRAWAL);
  // console.log("value", value);
  const [scanAnim, setScanAnim] = useState(RDDeviceStatus.READY);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const isMobile = useResponsive("down", "sm");

  // aeps enabled hook setting . . .
  const [isAepsOne, setIsAepsOne] = useState(false);
  const [isAepsTwo, setIsAepsTwo] = useState(false);
  const [twoFAStatus, setTwoFAStatus] = useState(false);
  const [scanData, setScanData] = useState();
  const [request, setRequest] = useState(false);
  const [custTxnData, setCustTxnData] = useState({
    apiEnd: "",
    payload: {},
    remVal: {},
  });
  const [openGuideline, setOpenGuideline] = useState(true);
  const [accBalance, setAccBalance] = useState();
  const [getBankData, setGetBankData] = useState();
  const [balanceData, setBalanceData] = useState();
  const [open, setOpen] = useState(false);
  const [bankiin, setBankiin] = useState("");

  const {
    aepsType,
    setAepsType,
    rdDevice,
    rdDeviceList,
    machineRequest,
    setRdDevice,
    setRdDeviceList,
    setMachineRequest,
    setOpenAeps2FAModal,
    getRecentData,
  } = useCommonContext();
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  const navigate = useNavigate();

  const location = useLocation();

  const handleChange = (event, newValue) => {
    // console.log("newvalue====", newValue);
    setValue(newValue);
  };

  function getRdDeviceInfo() {
    setMachineRequest(true);
    // console.log("machine func call . . .");
    setTimeout(() => {
      // console.log("inside machine func timeout . . .");
      GetMFS100InfoLoad(
        setMachineRequest,
        (dataArray) => {
          setScanData();
          // setScanAnim(RDDeviceStatus.NOT_READY);
          for (let i = 0; i < dataArray.length; i++) {
            // console.log("data array=>", dataArray[i]);
            const data = dataArray[i];
            if (data && data.status === RDDeviceStatus.READY) {
              setScanAnim(data ? data.status : RDDeviceStatus.SCAN_FAILED);
              setRdDevice(data);
            } else if (data && data.status === RDDeviceStatus.NOT_READY) {
              // console.log("we are in not ready");
              setScanAnim(data ? data.status : RDDeviceStatus.SCAN_FAILED);
              setRdDevice(data);
            }
          }
          if (dataArray) setRdDeviceList(dataArray);
          // console.log("success status=>", machineRequest);
        },
        (err) => {
          // console.log("we are in error");
          setScanAnim(RDDeviceStatus.NOT_READY);
          setRdDevice();
          setRdDeviceList();
          setMachineRequest(false);
          setScanData();
          // setScanAnim(err ? err.status : RDDeviceStatus.SCAN_FAILED);
          // console.log("failed status=>", machineRequest);
        }
      );
    }, 200);
    // setMachineRequest(false);
  }

  useEffect(() => {
    if (user) {
      setAepsType("");
      localStorage.removeItem("aepsType");
      // if (user?.instId || user?.fingId) {
      if (Number(user.aeps) === 1) {
        setIsAepsOne(true);
      }
      if (Number(user.aeps2) === 1) {
        setIsAepsTwo(true);
      }
    }
    return () => {};
  }, [location.pathname]);

  useEffect(() => {
    if (
      twoFAStatus === TWOFASTATUS.LOGGEDIN &&
      (rdDeviceList === 0 || !rdDevice)
    ) {
      getRdDeviceInfo();
    }

    return () => {};
  }, [twoFAStatus]);

  const AepsTxn = (passedCustData) => {
    const apiEnd = passedCustData ? passedCustData.apiEnd : custTxnData?.apiEnd;
    const payload = passedCustData
      ? passedCustData.payload
      : custTxnData?.payload;
    postJsonData(
      apiEnd && apiEnd !== "" ? apiEnd : null,
      payload,
      setRequest,
      (data) => {
        if (value === AEPS.STATEMENT) {
          if (data && data.data && data.data.data) {
            //remove parse before live
            setAccBalance(data?.data?.bankAccountBalance);
            setGetBankData(data && data.data.data ? data.data.data : "");
            setOpen(true);
            getRecentData();
          } else {
            okSuccessToast(data.message);
          }
          setScanAnim(RDDeviceStatus.READY);
        } else if (value === AEPS.BALANCE_ENQUIRY) {
          setBalanceData(data);
          swalWithBootstrapButtons.fire(
            data.data.status,
            data.data.message,
            "success"
          );
        } else {
          swalWithBootstrapButtons.fire(
            data.data.status,
            data.data.message,
            "success"
          );
        }
        setScanData();
        setScanAnim(RDDeviceStatus.READY);
        setCustTxnData({
          apiEnd: "",
          payload: {},
          remVal: {},
        });
        // getUserAxios();
      },
      (error) => {
        apiErrorToast(error);
        setScanData();
        setScanAnim(RDDeviceStatus.READY);
        setCustTxnData({
          apiEnd: "",
          payload: {},
          remVal: {},
        });
      }
    );
  };
  const handleBack = () => {
    resetView(false);
  };
  if (openGuideline) {
    return (
      <AEPSGuidelinesModal open={openGuideline} setOpen={setOpenGuideline} />
    );
  } else {
    return (
      <>
        {/* 2FA VIEW; shall be rendered only if new log in or aeps || aeps2 off
      initial conditions used to render are given below---------------------------------
      ----------------------------------------------------------------------------------
      EDIT THIS COMMENTED CONDITIONS ONLY WHEN ACTUAL VISIBILITY PARAMETERS ARE UPDATED.
      ----------------------------------------------------------------------------------
      user &&
          (user?.instId ||
            user?.fingId ||
            !user.instId ||
            !user.fingId ||
            isAepsOne ||
            isAepsTwo) &&
          (!twoFAStatus || twoFAStatus === TWOFASTATUS.LOGINREQUIRED) 
      ----------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------*/}
        <Mount
          visible={
            user &&
            (user?.instId ||
              user?.fingId ||
              !user.instId ||
              !user.fingId ||
              isAepsOne ||
              isAepsTwo) &&
            (!twoFAStatus || twoFAStatus === TWOFASTATUS.LOGINREQUIRED)
          }
        >
          <Grid container>
            <Grid
              md={12}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid container>
                {/* ############################### */}
                {/* 2 FA MODAL / image GRID ------- */}
                {/* ############################### */}
                <Grid item xs={12} md={6}>
                  <Mount visible={isMobile && (isAepsOne || isAepsTwo)}>
                    <AEPS2FAModal
                      isAepsOne={isAepsOne}
                      isAepsTwo={isAepsTwo}
                      twoFAStatus={twoFAStatus}
                      setTwoFAStatus={setTwoFAStatus}
                    />
                  </Mount>
                  <Mount visible={!isMobile && (isAepsOne || isAepsTwo)}>
                    <img src={aepsAuthImg} alt="aeps" width="100%" />
                  </Mount>
                </Grid>
                {/* ############################### */}
                {/* MESSAGE / INSTRUCTION GRID ---- */}
                {/* ############################### */}
                <Grid item xs={12} md={6}>
                <Button
                            size="small"
                            id="verify-btn"
                            className="button-props"
                            onClick={handleBack}
                          >
                            <span style={{ marginRight: "5px" }}>Home</span>
                            <img
                              src={back}
                              alt="back"
                              style={{ width: "18px", height: "20px" }}
                            />
                          </Button>
                  <Box sx={{ textAlign: "left" }}>

                    <Typography
                      sx={{ fontWeight: "600", fontSize: "25px", mb: 3 }}
                    >
                      AePS 2FA Implementations
                    </Typography>
                    <ol>
                      <li>
                        <Typography className="just-sm-font ">
                          As per guidelines by NPCI, 2FA ( two factor
                          authentication) has been introduced in order to
                          control frauds AePS transactions
                        </Typography>
                      </li>
                      <li>
                        <Typography className="just-sm-font ">
                          With the Implementation of AePS 2FA, The merchants
                          will have to enable the AePS Module everyday by
                          providing their Aadhaar Authentication at the
                          beginning of the day.
                        </Typography>
                      </li>
                      <li>
                        <Typography className="just-sm-font ">
                          The Aadhaar Authentication would be visible only when
                          the merchants opt for AePS transaction
                        </Typography>
                      </li>
                      <li>
                        <Typography className="just-sm-font ">
                          Aadhaar Authentication will be valid for 24hrs, so the
                          merchants need to provide authentication again on the
                          next day.
                        </Typography>
                      </li>
                    </ol>
                    <Typography
                      sx={{ fontWeight: "600", fontSize: "25px", my: 3 }}
                    >
                      AePS 2FA Guidelines EKYC Merchants
                    </Typography>
                    <Typography className="just-sm-font ">
                      As retailer need to click on AePS Option, a pop up will
                      appear - please provide your biometric aadhaar
                      authentificaton for enabling Aeps in your ID. Post
                      successful authentication id is active for transaction
                      Biometric authentication will be valid for 24HRS only and
                      post date change the pop up will appear again
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* render this component only when hook setting is done */}
              <Mount visible={!isMobile && (isAepsOne || isAepsTwo)}>
                <AEPS2FAModal
                  isAepsOne={isAepsOne}
                  isAepsTwo={isAepsTwo}
                  twoFAStatus={twoFAStatus}
                  setTwoFAStatus={setTwoFAStatus}
                />
              </Mount>
            </Grid>
          </Grid>
        </Mount>

        {/* ------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------
      AePS VIEW; shall be rendered only if 2FA status is loggedIn in case of AePS1 -----
      IN CASE OF AePS2 IT SHOULD BE DEFAULT VISIBLE ------------------------------------
      ----------------------------------------------------------------------------------
      EDIT THIS COMMENTED CONDITIONS ONLY WHEN ACTUAL VISIBILITY PARAMETERS ARE UPDATED.
      ----------------------------------------------------------------------------------
      twoFAStatus === TWOFASTATUS.LOGGEDIN
      ----------------------------------------------------------------------------------
      ----------------------------------------------------------------------------------*/}
        <Mount visible={twoFAStatus === TWOFASTATUS.LOGGEDIN}>
          <>
            {/* the top bar of new layout */}
            {user?.layout && user?.layout === 2 && (
              <Box
                className="card-css"
                sx={{
                  width: "100%",
                  my: 2,
                  p: 2,
                  py: 1,
                }}
              >
                <Typography className="services-heading">
                  Banking Services
                </Typography>
                <Grid container>
                  {user?.st === 0 ||
                  user.dmt4 === 0 ||
                  user?.aeps === 0 ||
                  user?.nepal_transfer === 0 ||
                  user?.upi_transfer === 0
                    ? banking
                        .filter((item) => {
                          if (
                            user?.st === 0 &&
                            item.title === "Super Transfer"
                          ) {
                            return undefined;
                          }
                          if (
                            user?.dmt4 === 0 &&
                            item.title === "Express Transfer"
                          ) {
                            return undefined;
                          }
                          if (user?.aeps === 0 && item.title === "AEPS") {
                            return undefined;
                          }
                          if (
                            user?.nepal_transfer === 0 &&
                            item.title === "Nepal Transfer"
                          ) {
                            return undefined;
                          }
                          if (
                            user?.upi_transfer === 0 &&
                            item.title === "UPI Transfer"
                          ) {
                            return undefined;
                          } else {
                            return item;
                          }
                        })
                        .map((mitem, index) => {
                          return (
                            <Grid
                              item
                              md={2}
                              index={index}
                              onClick={() => navigate(mitem.to)}
                              className="horizontal-sidenav"
                            >
                              <HNavButton item={mitem} />
                            </Grid>
                          );
                        })
                    : banking.map((item, index) => {
                        return (
                          <Grid
                            item
                            md={2}
                            index={index}
                            onClick={() => navigate(item.to)}
                            className="horizontal-sidenav"
                          >
                            <HNavButton item={item} />
                          </Grid>
                        );
                      })}
                </Grid>
              </Box>
            )}
            <Box>
              {machineRequest && (
                <Backdrop
                  sx={{
                    zIndex: "100000",
                    height: "100%",
                    width: "100%",
                    backgroundColor: "#ffffff10",
                    backdropFilter: "blur(3px)",
                  }}
                  open={true}
                >
                  <div class="circle-blue"></div>
                  <h5 style={{ position: "absolute", left: "45%", top: "60%" }}>
                    Detecting RD Services. . .
                  </h5>
                </Backdrop>
              )}
              <TabContext value={value}>
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    pr: 2,
                    position: "relative",
                  }}
                >
                  {/* tablist */}
                  <StyledTabs
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                    variant="scrollable"
                  >
                    <Tab
                      icon={<CurrencyRupeeOutlinedIcon />}
                      iconPosition="start"
                      label="Cash Withdrawal"
                      value={AEPS.CASH_WITHDRAWAL}
                    />
                    <Tab
                      icon={<AccountBalanceWalletOutlinedIcon />}
                      iconPosition="start"
                      label="Balance Enquiry"
                      value={AEPS.BALANCE_ENQUIRY}
                    />
                    <Tab
                      icon={<ReceiptLongOutlinedIcon />}
                      iconPosition="start"
                      label="Mini Statement"
                      value={AEPS.STATEMENT}
                    />
                    <Mount visible={aepsType === AEPS_TYPE.AEPS1}>
                      <Tab
                        icon={<BadgeOutlinedIcon />}
                        value={AEPS.APAY}
                        iconPosition="start"
                        label="Aadhar-pay"
                      />
                    </Mount>

                    {/* -------------------------------------------- */}
                    {/* show logged in button for aeps1 */}
                    {/* -------------------------------------------- */}
                    <Mount visible={aepsType === AEPS_TYPE.AEPS2}>
                      <Aeps2faFromButton
                        twoFAStatus={twoFAStatus}
                        bankiin={bankiin}
                      />
                    </Mount>

                    {/* <AEPSTimer /> */}
                  </StyledTabs>
                </Box>
                {/* {!machineRequest && rdDeviceList?.length === 0 && (
                <Box className="mt-wide-table" sx={{ margin: "0 auto", p: 20 }}>
                  <h3>You do not have any RD Service installed in your system</h3>
                </Box>
              )} */}

                {machineRequest && (
                  <Box
                    className="mt-wide-table"
                    sx={{ margin: "0 auto", p: 20 }}
                  >
                    {/* <h3>Detecting RD Services. . .</h3> */}
                  </Box>
                )}

                {/* {!machineRequest && ( */}
                <TabPanel className="tab-panel" value={value}>
                  <AepsTabs
                    view={value}
                    rdDeviceList={rdDeviceList}
                    machineRequest={machineRequest}
                    getRdDeviceInfo={getRdDeviceInfo}
                    rdDevice={rdDevice}
                    scanAnim={scanAnim}
                    setScanAnim={setScanAnim}
                    setScanData={setScanData}
                    setRdDevice={setRdDevice}
                    scanData={scanData}
                    request={request}
                    onComplete={(custData, bankiin) => {
                      setCustTxnData(custData);
                      if (value === "WAP") {
                        // HOOKS WILL BE UPDATED HERE AS WE DO ONE EXTRA STEP HERE FOR THE TRANSACITON
                        setOpenAeps2FAModal(false);
                        AepsTxn(custData);

                      } else {
                        // HOOKS WIL NOT BE UPDATED HERE SO WE SEND DATA AS ARGU OF FUNC
                        AepsTxn(custData);
                      }
                      // this was old
                      // AepsTxn()
                      setBankiin(bankiin);
                    }}
                  />
                </TabPanel>
                {/* )} */}
              </TabContext>
            </Box>
          </>
        </Mount>

        <RdServiceDrivers />
        <Mount visible={balanceData || getBankData}>
          <MiniStatement
            remitterDetails={custTxnData?.remVal}
            open={open}
            setOpen={setOpen}
            accBalance={accBalance}
            setGetBankData={setGetBankData}
            getBankData={getBankData}
            balanceData={balanceData}
            view={value}
          />
        </Mount>
        <AEPS2LoginModal
          twoFAStatus={twoFAStatus}
          bankiin={bankiin}
          onComplete={() => {
            AepsTxn();
          }}
        />
      </>
    );
  }
};

export default AEPS2View;

