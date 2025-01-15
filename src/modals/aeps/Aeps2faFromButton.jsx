/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  FormControl,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import ModalHeader from "../ModalHeader";
import {
  CaptureFingerPrint,
  GetMFS100InfoLoad,
} from "../../utils/MantraCapture";
import { AEPS_TYPE, RDDeviceStatus } from "../../utils/constants";
import AnimDeviceReady from "../../assets/animate-icons/device_ready.json";
import AnimDeviceScanning from "../../assets/animate-icons/fingerprint_scan.json";
import AnimDeviceSuccess from "../../assets/animate-icons/fingerprint_success.json";
import AnimDeviceFail from "../../assets/animate-icons/fingerprint_fail.json";
import AnimDeviceConnect from "../../assets/animate-icons/device_connect.json";
import AnimateIcon from "../../component/AnimateIcon";
import RdDeviceSearch from "../../component/RdDeviceSearch";
import { apiErrorToast, okSuccessToast } from "../../utils/ToastUtil";
import { useEffect } from "react";
import { postJsonData } from "../../network/ApiController";
import ApiEndpoints from "../../network/ApiEndPoints";
import AuthContext from "../../store/AuthContext";
import Mount from "../../component/Mount";
import LoaderFull from "../../commons/LoaderFull";
import useCommonContext from "../../store/CommonContext";
import { primaryColor } from "../../theme/setThemeColor";
import VerifiedIcon from "@mui/icons-material/Verified";
import MachineButtonGroup from "../../component/aeps/MachineButtonGroup";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "45%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  height: "max-content",
  overflowY: "scroll",
  p: 2,
  pb: 3,
};

export function getColor(status) {
  if (status === "NOTREADY") {
    return "red";
  } else if (status === "READY") {
    return "green";
  } else {
    return "red";
  }
}

const Aeps2faFromButton = ({ twoFAStatus, bankiin }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [scanAnim, setScanAnim] = useState(RDDeviceStatus.NOT_READY);
  const context = useContext(AuthContext);
  const user = context.user;
  const userLat = context.location.lat && context.location.lat;
  const userLong = context.location.long && context.location.long;
  const [scanData, setScanData] = useState();
  const {
    aepsType,
    rdDevice,
    rdDeviceList,
    machineRequest,
    setRdDevice,
    setRdDeviceList,
    setMachineRequest,
    // getUserAxios,
    // setCheckIf2FaCalled,
  } = useCommonContext();
  // console.log("openAeps2FAModal", openAeps2FAModal);
  // console.log("user", user);
  const [aadhaar, setAadhaar] = useState(
    user?.aadhar !== null ? user?.aadhar : ""
  );

  const handleOpen = () => {
    if (!rdDevice) getRdDeviceInfo();
    setOpen(true);
  };
  const handleClose = () => {
    // console.log("inhandle close");
    setOpen(false);
    setScanData(null);
    // setCheckIf2FaCalled("done");
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

  // ------------------------------------------
  // api call for logging in to bank side for the day
  // ------------------------------------------
  const outletAuthApiCall = () => {
    if (scanData) {
      let data = {};
      let apiEnd = ApiEndpoints.AEPS_OUTLET_LOGIN;
      // console.log("userLat=>", userLat);
      // console.log("userLong=>", userLong);
      // console.log("aepsType=>", aepsType);
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
          type: "TXN_AUTH",
          bankiin: bankiin,
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
          // getUserAxios();
          handleClose();
        },
        (err) => {
          // console.log("error.resp", err.response.data.message);
          if (err.response.data.message == "Transaction failed.") {
            return apiErrorToast("2FA Failed");
          }
          apiErrorToast(err);
          // setCheckIf2FaCalled("done");
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
  // sending request to detect machine only if instId and fingId is available . . . .
  // ###################################################################################
  useEffect(() => {
    // getRdDeviceInfo();

    return () => {};
  }, [twoFAStatus]);

  // ###################################################################################
  // return the required component below ***********************************************
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
      {/* <Mount visible={aepsType === AEPS_TYPE.AEPS2}> */}
      <Mount visible={true}>
        <Button
          size="small"
          sx={{ textTransform: "none", maxHeight: "40px", px: 2, mt: 2 }}
          onClick={handleOpen}
          className="otp-hover-purple"
        >
          2FA Login
        </Button>
      </Mount>
      {/* twoFAStatus === TWOFASTATUS.LOGGEDIN */}
      <Mount visible={false}>
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
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
        </Grid>
      </Mount>

      <Modal
        // open={true}
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader
            title="Merchant Authentication"
            handleClose={handleClose}
          />
          {/* <ModalHeader title="2FA Login" /> */}
          <Box
            sx={{
              mx: 2,
              objectFit: "contain",
            }}
          >
            {/* aeps 2FA login view forms and options */}
            <Mount visible={true}>
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
                        helperText={
                          <div style={{ color: "#2979ff" }}>
                            Kindly check for your Aadhaar Number
                          </div>
                        }
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
                        {/* #################################### */}
                        {/* MACHINE BUTTON GROUP --------------- */}
                        {/* #################################### */}
                        <MachineButtonGroup
                          onScan={() => {
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
                          onRdDeviceInfo={() => {
                            if (getRdDeviceInfo) getRdDeviceInfo();
                          }}
                        />
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
                      </span>
                      connect scanner for scanning the impression(when scanner
                      is connected dot in the corner will be green.)
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Mount>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Aeps2faFromButton;
