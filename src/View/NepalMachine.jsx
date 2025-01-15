import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { useState } from "react";
import AnimateIcon from "../component/AnimateIcon";
import AnimDeviceReady from "../assets/animate-icons/device_ready.json";
import AnimDeviceScanning from "../assets/animate-icons/fingerprint_scan.json";
import AnimDeviceSuccess from "../assets/animate-icons/fingerprint_success.json";
import AnimDeviceFail from "../assets/animate-icons/fingerprint_fail.json";
import AnimDeviceConnect from "../assets/animate-icons/device_connect.json";
import { RDDeviceStatus } from "../utils/constants";
import RdDeviceSearch from "../component/RdDeviceSearch";
import MyButton from "../component/MyButton";
import {
  CaptureFingerPrintTest,
  GetMFS100InfoLoad,
} from "../utils/MantraCapture";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import CachedIcon from "@mui/icons-material/Cached";
import Loader from "../component/loading-screen/Loader";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { useEffect } from "react";
import AuthContext from "../store/AuthContext";

const NepalMachine = ({
  setMachineRequest,
  machineRequest,
  nepalAllRes,
  reqNo,
  setNepalOnboardModalOpen,
}) => {
  const [rdDevice, setRdDevice] = useState();
  const [scanAnim, setScanAnim] = useState(RDDeviceStatus.READY);
  const [scanData, setScanData] = useState();
  const [rdDeviceList, setRdDeviceList] = useState([]);
  const [machineKYCReq, setMachineKYCRequest] = useState(false);
  const authCtx = useContext(AuthContext);
  const token = authCtx.nepalToken;
  // console.log("token in maching", authCtx.nepalToken);
  // console.log("reqNo", reqNo);

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

  const nepalMachineKYC = () => {
    let data = {};
    if (scanData) {
      data = {
        pid: scanData.pidData,
        hmac: scanData.hMac,
        skey: scanData.sessionKey,
        ci: scanData.cI,
        rdsid: scanData.rdsId,
        rdsver: scanData.rdsVer,
        dpid: scanData.dpId,
        dc: scanData.dC,
        mc: scanData.mC,
        mi: scanData.mI,
        CustomerID: nepalAllRes?.customer?.CustomerId,
        req_id: reqNo?.current,
        token,
      };
    }
    // console.log("data", data);
    postJsonData(
      ApiEndpoints.MACHINE_KYC,
      data,
      setMachineKYCRequest,
      (res) => {
        const data = res.data;
        // console.log("res of machine kyc", res.data);
        okSuccessToast(data?.ResponseMessage);
        setNepalOnboardModalOpen("addCustomer");
      },
      (err) => {
        // setNepalOnboardModalOpen("addCustomer");
        apiErrorToast(err);
      }
    );
  };
  useEffect(() => {
    getRdDeviceInfo();

    return () => {};
  }, []);

  useEffect(() => {
    return () => {};
  }, [rdDevice]);
  // console.log("rdDevice", rdDeviceList[0]?.info);

  return (
    <Grid container>
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
                  !rdDevice || rdDevice.status === RDDeviceStatus.NOT_READY
                }
                text="start scan"
                mr={3}
                onClick={() => {
                  setScanAnim(RDDeviceStatus.SCANNING);
                  CaptureFingerPrintTest(
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
          <Box
            validate
            autoComplete="off"
            sx={{
              "& .MuiTextField-root": { m: 1 },
              objectFit: "contain",
              overflowY: "scroll",
            }}
          >
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
        </Box>
        <Typography sx={{ mt: 2 }}>
          <span style={{ fontWeight: "bold", color: "#DC5F5F" }}>Note:</span>{" "}
          connect scanner for scanning the impression(when scanner is connected
          dot in the corner will be green.)
        </Typography>
      </Grid>
      <Grid item md={12} xs={12} sx={{ mt: 3 }}>
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            width: "200px",
            backgroundColor: "#0077b6",
          }}
          disabled={!scanData || machineKYCReq}
          onClick={() => nepalMachineKYC()}
        >
          <Loader loading={machineKYCReq} size="small" /> Submit
        </Button>
      </Grid>
    </Grid>
  );
};

export default NepalMachine;
