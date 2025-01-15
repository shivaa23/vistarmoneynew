import React from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Backdrop, Box, Button, Grid, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import AepsTabs from "../component/AepsTabs";
import { useRef } from "react";
import { useEffect } from "react";
import { GetMFS100InfoLoad } from "../utils/MantraCapture";
import { AEPS, RDDeviceStatus } from "../utils/constants";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { styled } from "@material-ui/styles";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";
import OutletRegistration from "../component/OutletRegistration";
import { useNavigate } from "react-router-dom";
import { banking } from "../_nav";
import HNavButton from "../component/HNavButton";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast } from "../utils/ToastUtil";
import AEPSAuthModal from "../modals/AEPSAuthModal";
import VerifiedIcon from "@mui/icons-material/Verified";
import { primaryColor } from "../theme/setThemeColor";
import { aepsAuthImg, processingImg } from "../iconsImports";
// tab styles . .  .
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
const AEPSView = () => {
  const [value, setValue] = useState(AEPS.CASH_WITHDRAWAL);
  const [rdDevice, setRdDevice] = useState();
  const [rdDeviceList, setRdDeviceList] = useState([]);
  const [machineRequest, setMachineRequest] = useState(false);
  const [statusReq, setStatusReq] = useState(false);
  const [scanAnim, setScanAnim] = useState(RDDeviceStatus.READY);
  const [scanData, setScanData] = useState();
  const mounted = useRef(false);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const navigate = useNavigate();
  const [openAuthM, setOpenAuthM] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState("");
  const [outletStatus, setOutletStatus] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getOutletStats = () => {
    if (user && user.instId) {
      postJsonData(
        ApiEndpoints.AEPS_OUTLET_STATUS,
        {},
        setStatusReq,
        (res) => {
          const data = res?.data;
          // console.log("data", data);
          if (data.message === "LOGINREQUIRED") {
            setOutletStatus(data.message);
            setIsAuthenticated("notAuth");
            // setOpenAuthM("aeps");
          } else if (data.message === "LOGGEDIN" || data.message === null) {
            setOutletStatus(data.message);
            setIsAuthenticated("Auth");
            if (
              (!rdDeviceList || rdDeviceList?.length === 0) &&
              mounted.current &&
              user?.instId
              // &&
              // isAuthenticated
            ) {
              getRdDeviceInfo();
            }
          } else {
          }
        },
        (err) => {
          apiErrorToast(err);
          // setIsAuthenticated("notAuth");
        }
      );
    }
  };

  useEffect(() => {
    getOutletStats();
    mounted.current = true;
    // console.log("aeps mounted=>", mounted.current);
    return () => {
      mounted.current = false;
      // console.log("aeps mounted=>", mounted.current);
    };
  }, []);

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
            // console.log("data array=>", dataArray[i].status);
            const data = dataArray[i];
            if (data && data.status === RDDeviceStatus.READY) {
              setScanAnim(data ? data.status : RDDeviceStatus.SCAN_FAILED);
              setRdDevice(data);
            } else if (data && data.status === RDDeviceStatus.NOT_READY) {
              setScanAnim(data ? data.status : RDDeviceStatus.SCAN_FAILED);
              setRdDevice(data);
            }
          }
          if (dataArray) setRdDeviceList(dataArray);
          // console.log("success status=>", machineRequest);
        },
        (err) => {
          setScanAnim(RDDeviceStatus.NOT_READY);
          setRdDevice();
          setRdDeviceList();
          setMachineRequest(false);
          setScanData();
          // setScanAnim(err ? err.status : RDDeviceStatus.SCAN_FAILED);
          // console.log("failed status=>", machineRequest);
        }
      );
    }, 500);
    // setMachineRequest(false);
  }

  // useEffect(() => {
  //   if (
  //     (!rdDeviceList || rdDeviceList?.length === 0) &&
  //     mounted.current &&
  //     user?.instId
  //     // &&
  //     // isAuthenticated
  //   ) {
  //     getRdDeviceInfo();
  //   }

  //   return () => {};
  // }, [rdDeviceList]);

  // console.log("setRdDeviceList----", rdDeviceList);

  if (isAuthenticated === "notAuth") {
    return (
      <>
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
            <Grid sx={{ display: "flex" }}>
              <img src={aepsAuthImg} alt="aeps" width="50%" />
              <Box sx={{ textAlign: "left" }}>
                {" "}
                <Typography sx={{ fontWeight: "600", fontSize: "25px", mb: 3 }}>
                  AePS 2FA Implementations
                </Typography>
                <ol>
                  <li>
                    {" "}
                    <Typography className="just-sm-font ">
                      As per guidelines by NPCI, 2FA ( two factor
                      authentication) has been introduced in order to control
                      frauds AePS transactions
                    </Typography>
                  </li>
                  <li>
                    {" "}
                    <Typography className="just-sm-font ">
                      With the Implementation of AePS 2FA, The merchants will
                      have to enable the AePS Module everyday by providing their
                      Aadhaar Authentication at the beginning of the day.
                    </Typography>
                  </li>
                  <li>
                    {" "}
                    <Typography className="just-sm-font ">
                      The Aadhaar Authentication would be visible only when the
                      merchants opt for AePS transaction
                    </Typography>
                  </li>
                  <li>
                    {" "}
                    <Typography className="just-sm-font ">
                      Aadhaar Authentication will be valid for 24hrs, so the
                      merchants need to provide authentication again on the next
                      day.
                    </Typography>
                  </li>
                </ol>
                <Typography sx={{ fontWeight: "600", fontSize: "25px", my: 3 }}>
                  AePS 2FA Guidelines EKYC Merchants
                </Typography>
                <Typography className="just-sm-font ">
                  As retailer need to click on AePS Option, a pop up will appear
                  - please provide your biometric aadhaar authentificaton for
                  enabling Aeps in your ID. Post successful authentication id is
                  active for transaction Biometric authentication will be valid
                  for 24HRS only and post date change the pop up will appear
                  again
                </Typography>
              </Box>
            </Grid>

            <Button
              sx={{ textTransform: "none", maxHeight: "40px", px: 2, mt: 3 }}
              onClick={() => {
                getOutletStats();
              }}
              className="otp-hover-purple"
            >
              2FA Authentication
            </Button>
          </Grid>
          <AEPSAuthModal
            openHook={openAuthM}
            openHookSetter={setOpenAuthM}
            getOutletStats={getOutletStats}
          />
        </Grid>
      </>
    );
  } else if (isAuthenticated === "Auth") {
    return (
      <Box sx={{ width: "100%", typography: "body1", position: "relative" }}>
        {user && !user.instId && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <OutletRegistration autoOpen />
          </Box>
        )}
        {user && user.instId && (
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
                    <Tab
                      icon={<BadgeOutlinedIcon />}
                      iconPosition="start"
                      label="Aadhar-pay"
                      value={AEPS.APAY}
                    />
                    <Grid
                      container
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                      hidden={isAuthenticated === ""}
                    >
                      {isAuthenticated === "notAuth" ||
                      outletStatus !== "LOGGEDIN" ? (
                        <>
                          <Button
                            sx={{ textTransform: "none", maxHeight: "30px" }}
                            onClick={() => {
                              getOutletStats();
                            }}
                            className="otp-hover-purple"
                          >
                            Outlet Login
                          </Button>
                        </>
                      ) : (
                        <div
                          style={{
                            color: "#fff",
                            backgroundColor: primaryColor(),
                            borderRadius: "4px",
                            padding: "8px",
                            minWidth: "85px",
                          }}
                        >
                          Logged In <VerifiedIcon sx={{ color: "#fff" }} />
                        </div>
                      )}
                    </Grid>
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

                {!machineRequest && (
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
                    />
                  </TabPanel>
                )}
              </TabContext>
            </Box>
          </>
        )}
        <AEPSAuthModal
          openHook={openAuthM}
          openHookSetter={setOpenAuthM}
          getOutletStats={getOutletStats}
        />
      </Box>
    );
  } else {
    return (
      <Grid container>
        {user && !user.instId ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              margin: "0 auto",
            }}
          >
            <OutletRegistration autoOpen />
          </Box>
        ) : (
          <Grid
            md={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={processingImg} alt="processing" width="25%" />
            {/* <Button
        sx={{
          textTransform: "none",
          width: "150px",
          height: "50px",
          marginTop: "80px",
        }}
        onClick={() => {
          window.location.reload();
        }}
        className="otp-hover-purple"
      >
        Reload
      </Button> */}
          </Grid>
        )}
      </Grid>
    );
  }
};

export default AEPSView;
