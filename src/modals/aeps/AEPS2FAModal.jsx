/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  Modal,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import ModalHeader from "../ModalHeader";
import {
  CaptureFingerPrint,
  GetMFS100InfoLoad,
} from "../../utils/MantraCapture";
import { AEPS_TYPE, RDDeviceStatus, TWOFASTATUS } from "../../utils/constants";
import AnimDeviceReady from "../../assets/animate-icons/device_ready.json";
import AnimDeviceScanning from "../../assets/animate-icons/fingerprint_scan.json";
import AnimDeviceSuccess from "../../assets/animate-icons/fingerprint_success.json";
import AnimDeviceFail from "../../assets/animate-icons/fingerprint_fail.json";
import AnimDeviceConnect from "../../assets/animate-icons/device_connect.json";
import AnimateIcon from "../../component/AnimateIcon";
import RdDeviceSearch from "../../component/RdDeviceSearch";
import MyButton from "../../component/MyButton";
import { apiErrorToast, okSuccessToast } from "../../utils/ToastUtil";
import { useEffect } from "react";
import { postJsonData } from "../../network/ApiController";
import ApiEndpoints from "../../network/ApiEndPoints";
import AuthContext from "../../store/AuthContext";
import Mount from "../../component/Mount";
import AePSOutletRegistration from "./AePSOutletRegistration";
import AePS2OutletRegistration from "./AePS2OutletRegistration";
import LoaderFull from "../../commons/LoaderFull";
import useCommonContext from "../../store/CommonContext";
import MyRadioButton from "../../component/Buttons/MyRadioButton";
import MachineDetectButton from "../../component/aeps/MachineDetectButton";

export function getColor(status) {
  if (status === "NOTREADY") {
    return "red";
  } else if (status === "READY") {
    return "green";
  } else {
    return "red";
  }
}

const AEPS2FAModal = ({
  isAepsOne,
  isAepsTwo,
  twoFAStatus,
  setTwoFAStatus,
}) => {
  const [open, setOpen] = useState(true);
  const [request, setRequest] = useState(false);
  // const [rdDevice, setRdDevice] = useState();
  // const [scanData, setScanData] = useState();
  // const [rdDeviceList, setRdDeviceList] = useState([]);
  // const [machineRequest, setMachineRequest] = useState(false);
  const [scanAnim, setScanAnim] = useState(RDDeviceStatus.READY);
  const context = useContext(AuthContext);
  const userLat = context.location.lat && context.location.lat;
  const userLong = context.location.long && context.location.long;
  const [aadhaar, setAadhaar] = useState("");

  // hooks for aepsType and opening outlet registration modal....
  // const [aepsType, setAepsType] = useState();

  const {
    aepsType,
    setAepsType,
    rdDevice,
    rdDeviceList,
    machineRequest,
    setRdDevice,
    setRdDeviceList,
    setMachineRequest,
    setAepsTypeInLocalAndHook,
  } = useCommonContext();
  const [scanData, setScanData] = useState();
  const [aepsOutlet, setAepsOutlet] = useState(false);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

  const handleOpen = () => {
    setOpen(true);
    if (isAepsOne && !isAepsTwo) {
      // setAepsType(AEPS_TYPE.AEPS1);
      setAepsTypeInLocalAndHook(AEPS_TYPE.AEPS1);
    }
    if (!isAepsOne && isAepsTwo) {
      // setAepsType(AEPS_TYPE.AEPS2);
      setAepsTypeInLocalAndHook(AEPS_TYPE.AEPS2);
    }
  };
  const handleClose = () => {
    setOpen(false);
    setAepsType("");
    setAepsTypeInLocalAndHook("");
    localStorage.removeItem("aepsType");
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

  function resolveScanImage(status) {
    switch (status) {
      case RDDeviceStatus.NOT_READY:
        return <AnimateIcon src={AnimDeviceConnect} />;
      case RDDeviceStatus.READY:
        return <AnimateIcon src={AnimDeviceReady} />;
      case RDDeviceStatus.SCANNING:
        return <AnimateIcon src={AnimDeviceScanning} />;
      case RDDeviceStatus.SCAN_SUCCESS:
        return <AnimateIcon src={AnimDeviceSuccess} />;
      case RDDeviceStatus.SCAN_FAILED:
        return <AnimateIcon src={AnimDeviceFail} />;
      default:
        return <AnimateIcon src={AnimDeviceConnect} />;
    }
  }

  // get aeps outlet status api call . .. .
  // use this for redirecting user to registration or 2FA
  const getAepsOutletStatus = (type) => {
    if (user) {
      postJsonData(
        ApiEndpoints.AEPS_OUTLET_STATUS,
        {
          pipe: type,
        },
        setRequest,
        (res) => {
          if (aepsType === AEPS_TYPE.AEPS1) {
            const data = res?.data;
            // console.log("res?.data", res?.data);
            const message = data.message;
            if (message === TWOFASTATUS.LOGINREQUIRED) {
              setTwoFAStatus(TWOFASTATUS.LOGINREQUIRED);
            } else if (message === TWOFASTATUS.LOGGEDIN) {
              setTwoFAStatus(TWOFASTATUS.LOGGEDIN);
            }
          } else if (aepsType === AEPS_TYPE.AEPS2) {
            setTwoFAStatus(TWOFASTATUS.LOGGEDIN);
          }
        },
        (err) => {
          apiErrorToast(err);
        }
      );
    }
  };

  // ------------------------------------------
  // api call for logging in to bank side for the day
  // ------------------------------------------
  const outletAuthApiCall = () => {
    if (scanData) {
      let data = {};
      let apiEnd = ApiEndpoints.AEPS_OUTLET_LOGIN;
      if (aepsType === AEPS_TYPE.AEPS1)
        data = {
          AadharNumber: aadhaar && aadhaar,
          ci: scanData.cI,
          dc: scanData.dC,
          dpId: scanData.dpId,
          errInfo: scanData?.errInfo,
          fCount: scanData?.fCount,
          mc: scanData?.mC,
          mi: scanData?.mI,
          nmPoints: scanData?.nmPoints,
          pidData: scanData?.pidData,
          pidDataType: scanData?.pidDataType,
          qScore: scanData?.qScore,
          rdsId: scanData?.rdsId,
          rdsVer: scanData?.rdsVer,
          sessionKey: scanData?.sessionKey,
          srno: scanData?.srno,
          hmac: scanData?.hMac,
          sysId: scanData?.sysId,
          latitude: userLat,
          longitude: userLong,
          pf: "WEB",
          type: "DAILY_LOGIN",
        };
      else if (aepsType === AEPS_TYPE.AEPS2) {
        apiEnd = ApiEndpoints.AEPS2_OUTLET_LOGIN;
        data = {
          adhaarNumber: aadhaar && aadhaar,
          captureResponse: scanData,
          deviceId: scanData.srno,
          latitude: userLat,
          longitude: userLong,
        };
      }
      postJsonData(
        apiEnd,
        data,
        setRequest,
        (res) => {
          okSuccessToast("Success");
          if (getAepsOutletStatus) getAepsOutletStatus(aepsType);
          handleClose();
        },
        (err) => {
          const errorData = JSON.stringify(err.response.data);
          apiErrorToast(errorData);
        }
      );
    } else {
      apiErrorToast("Scan first");
    }
  };

  useEffect(() => {
    if (scanData) outletAuthApiCall();
  }, [scanData]);

  // ###################################################################################
  // set aepsType dynamically based on user fields in database #########################
  // ###################################################################################
  useEffect(() => {
    if (isAepsOne && !isAepsTwo) {
      // setAepsType(AEPS_TYPE.AEPS1);
      setAepsTypeInLocalAndHook(AEPS_TYPE.AEPS1);
    }
    if (!isAepsOne && isAepsTwo) {
      // setAepsType(AEPS_TYPE.AEPS2);
      setAepsTypeInLocalAndHook(AEPS_TYPE.AEPS2);
    }
    // if (!isAepsOne && !isAepsTwo) {
    //   setAepsType(AEPS_TYPE.BOTH);
    // }
    return () => {};
  }, []);

  // ###################################################################################
  // getting outlet status on aepsType change ##########################################
  // ###################################################################################
  useEffect(() => {
    // ###################################################################################
    // conditions for instId and fingId !== null #########################################
    // ###################################################################################
    if (user?.instId) {
      if (aepsType === AEPS_TYPE.AEPS1) {
        getAepsOutletStatus(AEPS_TYPE.AEPS1);
      }
    }
    if (user?.fingId) {
      if (aepsType === AEPS_TYPE.AEPS2) {
        getAepsOutletStatus(AEPS_TYPE.AEPS2);
      }
    }
    // ###################################################################################
    // conditions for instId and fingId === null *****************************************
    // ###################################################################################
    if (!user.instId) {
      if (aepsType === AEPS_TYPE.AEPS1) {
        setAepsOutlet(AEPS_TYPE.AEPS1);
      }
    }
    if (!user.fingId) {
      if (aepsType === AEPS_TYPE.AEPS2) {
        setAepsOutlet(AEPS_TYPE.AEPS2);
      }
    }
  }, [aepsType]);

  // ###################################################################################
  // sending request to detect machine only if instId and fingId is available . . . .
  // ###################################################################################
  useEffect(() => {
    if (
      twoFAStatus &&
      aepsType === AEPS_TYPE.AEPS1 &&
      user.instId &&
      (rdDeviceList === 0 || !rdDevice)
    ) {
      setTimeout(() => {
        getRdDeviceInfo();
      }, 200);
    } else if (
      twoFAStatus &&
      aepsType === AEPS_TYPE.AEPS2 &&
      user.fingId &&
      (rdDeviceList === 0 || !rdDevice)
    ) {
      setTimeout(() => {
        getRdDeviceInfo();
      }, 200);
    }
    return () => {};
  }, [twoFAStatus]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "45%",
    bgcolor: "background.paper",
    boxShadow: 24,
    fontFamily: "Poppins",
    height: aepsType === AEPS_TYPE.AEPS1 ? "90vh" : "max-content",
    overflowY: "scroll",
    p: 2,
    pb: 3,
  };

  // ###################################################################################
  // return the required component below ***********************************************

  // https://api.impsguru.com/aeps/outletLoginStatus
  // https://api.impsguru.com/aeps/twoFaFp",

  // ###################################################################################
  return (
    <Box
      sx={{
        display: "grid",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <LoaderFull
        circle
        loading={machineRequest || request}
        text="Please wait . . . ."
      />
      <Button
        sx={{ textTransform: "none", maxHeight: "40px", px: 2, mt: 3 }}
        onClick={handleOpen}
        className="otp-hover-purple"
      >
        2 Factor Authentication
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader
            title={
              isAepsOne && isAepsTwo
                ? "AePS 1"
                : "2 Factor Authentication"
            }
            subtitle="Enjoy seamless aadhaar services with VistarMoney"
            handleClose={handleClose}
          />
          <Box
            sx={{
              // mx: 2,
              objectFit: "contain",
              width: "100%",
            }}
          >
            <Mount visible={true}>
  {setAepsTypeInLocalAndHook(AEPS_TYPE.AEPS1)}
                {/* <RadioGroup
                  className="my-radio_flex"
                  name="row-radio-buttons-group"
                  aria-labelledby="aepstype-row-radio-buttons-group-label"
                  value={aepsType}
                  defaultValue={aepsType}
                  onChange={(e) => {
                    // setAepsType(e.target.value);
                    setAepsTypeInLocalAndHook(e.target.value);
                  }}
                >
                  <MyRadioButton
                    label="AePS1"
                    name="AePS1"
                    defaultChecked
                    value={AEPS_TYPE.AEPS1}
                    checked={aepsType === AEPS_TYPE.AEPS1}
                  />
                
                </RadioGroup>
              </FormControl> */}
            </Mount>

            {/* aeps 2FA login view forms and options */}
            <Mount
              visible={
                aepsType === AEPS_TYPE.AEPS1 &&
                // (aepsType === AEPS_TYPE.AEPS1 ||
                //   aepsType === AEPS_TYPE.AEPS2)
                twoFAStatus === TWOFASTATUS.LOGINREQUIRED
              }
              // &&
              // twoFAStatus === TWOFASTATUS.LOGINREQUIRED
            >
              <Divider
                sx={{
                  borderTop: "2px solid #d3d3d3",
                }}
              />
              <Box
                component="form"
                id="outlet_login"
                validate
                autoComplete="off"
                className="text-center"
                // onSubmit={}
                sx={{
                  "& .MuiTextField-root": { m: 2 },
                  objectFit: "contain",
                  display: "grid",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Grid container className="position-relative">
                  <Grid item md={12} xs={12}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField autoComplete="off"
                        label="Aadhaar Number"
                        id="aadhaarNo"
                        size="small"
                        type="number"
                        required
                        value={aadhaar}
                        onChange={(e) => setAadhaar(e.target.value)}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <Box sx={{ display: "flex", pl: 1, pt: 1 }}>
                      <div
                        style={{
                          width: "50%",
                          minWidth: "30%",
                          height: "auto",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          position: "relative",
                        }}
                      >
                        {/* red dot code */}
                        {rdDevice && (
                          <div
                            style={{
                              background: getColor(
                                rdDevice ? rdDevice.status : ""
                              ),
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              position: "absolute",
                              top: "5px",
                              right: "5px",
                            }}
                          ></div>
                        )}
                        {/* Rd service */}
                        <span style={{ marginBottom: "12px" }}>
                          {resolveScanImage(scanAnim)}
                        </span>
                        <span
                          style={{
                            position: "absolute",
                            bottom: "8px",
                            display: "flex",
                            justifyContent: "between",
                            alignItems: "center",
                          }}
                        >
                          <MyButton
                            hidden={
                              !rdDevice ||
                              rdDevice.status === RDDeviceStatus.NOT_READY
                            }
                            text="start scan"
                            mr={3}
                            onClick={() => {
                              setScanAnim(RDDeviceStatus.SCANNING);
                              CaptureFingerPrint(
                                rdDevice && rdDevice.rdport,
                                (msg, data) => {
                                  setScanAnim(RDDeviceStatus.SCAN_SUCCESS);
                                  setScanData(data);
                                },
                                (err) => {
                                  apiErrorToast("Error", JSON.stringify(err));
                                  setScanAnim(RDDeviceStatus.SCAN_FAILED);
                                }
                              );
                            }}
                          />
                          <MachineDetectButton
                            onClick={() => {
                              if (getRdDeviceInfo) getRdDeviceInfo();
                            }}
                          />
                        </span>
                      </div>
                      <Grid container>
                        <Grid item md={12} xs={12}>
                          {
                            <RdDeviceSearch
                              list={rdDeviceList}
                              cb={(item) => {
                                if (item) setRdDevice(item);
                              }}
                              defaultValue={
                                rdDeviceList?.length > 0 &&
                                rdDeviceList[0]?.info
                              }
                            />
                          }

                          {!machineRequest && rdDeviceList === undefined && (
                            <Typography
                              sx={{
                                fontSize: "11px",
                                color: "red",
                                textAlign: "left",
                              }}
                            >
                              You do not have any RD Service installed in your
                              system
                            </Typography>
                          )}
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <FormControl sx={{ width: "100%" }}>
                            <TextField autoComplete="off"
                              label=""
                              id="d_status"
                              size="small"
                              placeholder="Device Status"
                              value={
                                rdDevice
                                  ? rdDevice.status
                                  : RDDeviceStatus.NOT_READY
                              }
                              disabled
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <FormControl sx={{ width: "100%" }}>
                            <TextField autoComplete="off"
                              label=""
                              id="scan_quality"
                              size="small"
                              placeholder="Scan Quality"
                              defaultValue={""}
                              value={scanData && scanData.score}
                              disabled
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Box>
                    {/* </Box> */}
                    <Typography sx={{ mt: 2 }}>
                      <span style={{ fontWeight: "bold", color: "#DC5F5F" }}>
                        Note:
                      </span>{" "}
                      connect scanner for scanning the impression(when scanner
                      is connected dot in the corner will be green.)
                    </Typography>
                    {/* <Button
                      onClick={() => {
                        outletAuthApiCall();
                      }}
                    >
                      submit
                    </Button> */}
                  </Grid>
                </Grid>
              </Box>
            </Mount>
            {/* <Mount visible={aepsType === AEPS_TYPE.AEPS2}>
              <Typography variant="h4">coming soon......</Typography>
            </Mount> */}
          </Box>
        </Box>
      </Modal>
      <Mount visible={AEPS_TYPE.AEPS1}>
        <AePSOutletRegistration open={aepsOutlet} setOpen={setAepsOutlet} />
      </Mount>
      <Mount visible={AEPS_TYPE.AEPS2}>
        <AePS2OutletRegistration open={aepsOutlet} setOpen={setAepsOutlet} />
      </Mount>
    </Box>
  );
};

export default AEPS2FAModal;
