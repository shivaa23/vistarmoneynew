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
import ModalHeader from "./ModalHeader";
import { CaptureFingerPrint, GetMFS100InfoLoad } from "../utils/MantraCapture";
import { RDDeviceStatus } from "../utils/constants";
import AnimDeviceReady from "../assets/animate-icons/device_ready.json";
import AnimDeviceScanning from "../assets/animate-icons/fingerprint_scan.json";
import AnimDeviceSuccess from "../assets/animate-icons/fingerprint_success.json";
import AnimDeviceFail from "../assets/animate-icons/fingerprint_fail.json";
import AnimDeviceConnect from "../assets/animate-icons/device_connect.json";
import AnimateIcon from "../component/AnimateIcon";
import RdDeviceSearch from "../component/RdDeviceSearch";
import CachedIcon from "@mui/icons-material/Cached";
import MyButton from "../component/MyButton";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { useEffect } from "react";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import AuthContext from "../store/AuthContext";
import Loader from "../component/loading-screen/Loader";
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

const AEPSAuthModal = ({ openHook, getOutletStatus, openHookSetter }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [machineRequest, setMachineRequest] = useState(false);
  const [scanData, setScanData] = useState();
  const [scanAnim, setScanAnim] = useState(RDDeviceStatus.READY);
  const [rdDevice, setRdDevice] = useState();
  const [rdDeviceList, setRdDeviceList] = useState([]);
  const context = useContext(AuthContext);
  const userLat = context.location.lat && context.location.lat;
  const userLong = context.location.long && context.location.long;
  const [aadhaar, setAadhaar] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    openHookSetter("");
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

  function getColor(status) {
    // console.log("status=>", status);
    if (status === "NOTREADY") {
      return "red";
    } else if (status === "READY") {
      return "green";
    } else {
      return "red";
    }
  }

  const outletAuthApiCall = () => {
    if (scanData) {
      let data = {};

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
      };
      postJsonData(
        ApiEndpoints.AEPS_OUTLET_LOGIN,
        data,
        setRequest,
        (res) => {
          if (getOutletStatus) getOutletStatus();
          okSuccessToast("Success");
          handleClose();
        },
        (err) => {
          apiErrorToast(err);
          openHookSetter("notAuth");
        }
      );
    } else {
      apiErrorToast("Scan first");
    }
  };
  useEffect(() => {
    if (openHook === "aeps") {
      setOpen(true);
      setTimeout(() => {
        getRdDeviceInfo();
      }, 500);
    }
  }, [openHook]);

  useEffect(() => {
    if (scanData) outletAuthApiCall();
  }, [scanData]);
  return (
    <Box
      sx={{
        display: "grid",
        justifyContent: "center",
      }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title="2FA Authentication" handleClose={handleClose} />

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
              <Loader loading={machineRequest || request} />
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
                          background: getColor(rdDevice ? rdDevice.status : ""),
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
                      <CachedIcon
                        className={`refresh-purple ${
                          machineRequest ? "hover-rotate" : ""
                        }`}
                        fontSize="small"
                        onClick={() => {
                          if (getRdDeviceInfo) getRdDeviceInfo();
                        }}
                      />
                    </span>
                  </div>
                  {/* <Box
                  validate
                  autoComplete="off"
                  sx={{
                    "& .MuiTextField-root": { m: 1 },
                    objectFit: "contain",
                    overflowY: "scroll",
                  }}
                > */}
                  <Grid container>
                    <Grid item md={12} xs={12}>
                      {/* {!machineRequest && rdDeviceList === undefined && (
                      <Box className="" sx={{ margin: "0 auto", p: 20 }}>

                      </Box>
                    )} */}
                      {
                        <RdDeviceSearch
                          list={rdDeviceList}
                          cb={(item) => {
                            if (item) setRdDevice(item);
                          }}
                          defaultValue={
                            rdDeviceList?.length > 0 && rdDeviceList[0]?.info
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
                          //required
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
                          //required
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
                  connect scanner for scanning the impression(when scanner is
                  connected dot in the corner will be green.)
                </Typography>
              </Grid>
              {/* <Grid item md={12} xs={12} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    width: "200px",
                    backgroundColor: "#0077b6",
                  }}
                  disabled={!scanData}
                  onClick={() => {}}
                >
                  <Loader loading={machineKYCReq} size="small" /> 
                  Submit
                </Button>
              </Grid> */}
            </Grid>
            {/* <ModalFooter
              form="outlet_login"
          
              btn="Submit"
              disable={!scanData}
            /> */}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AEPSAuthModal;
