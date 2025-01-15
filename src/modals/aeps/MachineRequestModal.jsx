import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FormControl, Grid, TextField, Typography } from "@mui/material";
import ModalHeader from "../ModalHeader";
import { useState } from "react";
import Loader from "../../component/loading-screen/Loader";
import { postJsonData } from "../../network/ApiController";
import ApiEndpoints from "../../network/ApiEndPoints";
import {
  apiErrorToast,
  okSuccessToast,
  toastWithTimer,
} from "../../utils/ToastUtil";
import { useEffect } from "react";
import { RDDeviceStatus } from "../../utils/constants";
import AnimateIcon from "../../component/AnimateIcon";
import {
  CaptureFingerPrintAeps2,
  GetMFS100InfoLoad,
} from "../../utils/MantraCapture";
import AnimDeviceReady from "../../assets/animate-icons/device_ready.json";
import AnimDeviceScanning from "../../assets/animate-icons/fingerprint_scan.json";
import AnimDeviceSuccess from "../../assets/animate-icons/fingerprint_success.json";
import AnimDeviceFail from "../../assets/animate-icons/fingerprint_fail.json";
import AnimDeviceConnect from "../../assets/animate-icons/device_connect.json";
import { getColor } from "./AEPS2FAModal";
import RdDeviceSearch from "../../component/RdDeviceSearch";
import useCommonContext from "../../store/CommonContext";
import MachineButtonGroup from "../../component/aeps/MachineButtonGroup";

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

const MachineRequestModal = ({
  btn = "Login",
  primaryKeyId,
  encodeFPTxnId,
  setPrimaryKeyId,
  identifier,
  machineModalOpen,
  setMachineModalOpen,
}) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [scanAnim, setScanAnim] = useState(RDDeviceStatus.READY);
  const [scanData, setScanData] = useState();
  // const [rdDevice, setRdDevice] = useState();
  // const [rdDeviceList, setRdDeviceList] = useState([]);
  // const [machineRequest, setMachineRequest] = useState(false);
  const {
    rdDevice,
    rdDeviceList,
    machineRequest,
    setRdDevice,
    setRdDeviceList,
    setMachineRequest,
  } = useCommonContext();

  const handleClose = () => {
    setOpen(false);
    setPrimaryKeyId(false);
    setScanData(null);
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

  const submitMachineData = () => {
    // event.preventDefault();
    const formData = {
      primaryKeyId: primaryKeyId,
      encodeFPTxnId: encodeFPTxnId,
      captureResponse: scanData,
      adhaarNumber: identifier,
      deviceId: scanData.srno,
    };
    postJsonData(
      `${ApiEndpoints.AEPS2_BIOMETRICKYC}`,
      formData,
      setRequest,
      (res) => {
        handleClose();
        okSuccessToast(res.data.message);
        toastWithTimer(
          '<div class="styled-msg">Registration Successfull. Your Window will refresh automatically in <strong class="redbox"></strong></div>',
          2000,
          "Hello"
        );
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

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

  useEffect(() => {
    if (machineModalOpen) {
      if (!rdDevice) getRdDeviceInfo();
      setOpen(true);
      setMachineModalOpen(false);
      setScanData(false);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machineModalOpen]);

  useEffect(() => {
    if (scanData) submitMachineData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanData]);

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
          <Loader loading={request || machineRequest} />
          <ModalHeader title={"Biometric KYC"} handleClose={handleClose} />
          <Box
            component="form"
            id="MachineRequestModal"
            noValidate
            autoComplete="off"
            sx={{
              "& .MuiTextField-root": { m: 2 },
            }}
          >
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
                  {/* #################################### */}
                  {/* MACHINE BUTTON GROUP --------------- */}
                  {/* #################################### */}
                  <MachineButtonGroup
                    onScan={() => {
                      setScanAnim(RDDeviceStatus.SCANNING);
                      CaptureFingerPrintAeps2(
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
                        You do not have any RD Service installed in your system
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
                          rdDevice ? rdDevice.status : RDDeviceStatus.NOT_READY
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
                connect scanner for scanning the impression(when scanner is
                connected dot in the corner will be green.)
              </Typography>
            </Grid>
          </Box>
          {/* <ModalFooter form="MachineRequestModal" btn={null} /> */}
        </Box>
      </Modal>
    </Box>
  );
};
export default MachineRequestModal;
