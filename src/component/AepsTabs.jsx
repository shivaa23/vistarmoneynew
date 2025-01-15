import React, { useContext, useRef } from "react";
import {
  Backdrop,
  Box,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Card } from "@mui/material";
import { AEPS, AEPS_TYPE, RDDeviceStatus } from "../utils/constants";
import { CaptureFingerPrint } from "../utils/MantraCapture";
import { apiErrorToast } from "../utils/ToastUtil";
import AnimateIcon from "../component/AnimateIcon";
import AnimDeviceConnect from "../assets/animate-icons/device_connect.json";
import AnimDeviceReady from "../assets/animate-icons/device_ready.json";
import AnimDeviceScanning from "../assets/animate-icons/fingerprint_scan.json";
import AnimDeviceSuccess from "../assets/animate-icons/fingerprint_success.json";
import AnimDeviceFail from "../assets/animate-icons/fingerprint_fail.json";
import BankSearch from "./BankSearch";
import ApiEndpoints from "../network/ApiEndPoints";
import { useState } from "react";
import AuthContext from "../store/AuthContext";
import { IMaskInput } from "react-imask";
import PropTypes from "prop-types";
import { PATTERNS } from "../utils/ValidationUtil";
import RdDeviceSearch from "./RdDeviceSearch";
import { useEffect } from "react";
import useCommonContext from "../store/CommonContext";
import useDebounce from "../utils/Debounce";
import Mount from "./Mount";
import BankSearchFingPay from "./BankSearchFingPay";
import MachineButtonGroup from "./aeps/MachineButtonGroup";

let apiEnd;

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
  if (status === "NOTREADY") {
    return "red";
  } else if (status === "READY") {
    return "green";
  } else {
    return "red";
  }
}
const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="0000 0000 0000"
      definitions={{
        "#": /^[0-9]{12}$/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const AepsTabs = ({
  view,
  rdDeviceList,
  machineRequest,
  getRdDeviceInfo,
  rdDevice,
  scanAnim,
  setScanAnim,
  setScanData,
  setRdDevice,
  scanData,
  onComplete,
  request,
}) => {
  const [aadhaar, setAdhaar] = useState({
    aadhaar: "",
    numberformat: "1320",
  });

  const context = useContext(AuthContext);
  const userLat = context.location.lat && context.location.lat;
  const userLong = context.location.long && context.location.long;
  const [isValMob, setisValMob] = useState(true);
  const [isValAadhar, setisValAadhar] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const bankRef = useRef();
  const mobileRef = useRef();
  const aadhaarRef = useRef();
  const { aepsType } = useCommonContext();
  const mobileRefValue = mobileRef?.current?.value;
  const aadhaarRefValue = aadhaarRef?.current?.value;
  const bankRefValue = bankRef?.current?.value;
  const [amountInputVal, setAmountInputVal] = useState();
  const [bankObjCallBack, setbankObjCallBack] = useState("");
  const [ifscObjCallBack, setifscObjCallBack] = useState("");
  const debouncedValue = useDebounce(amountInputVal, 100);
  const handleChange = (event) => {
    const value = event.target.value;
    setAdhaar((prevAadhaar) => ({
      ...prevAadhaar,
      [event.target.name]: value,
    }));
    setisValAadhar(value.length === 14);
  };
  const toggleShowForm = () => {
    if (view === AEPS.CASH_WITHDRAWAL || view === AEPS.APAY) {
      if (
        mobileRefValue !== "" &&
        isValMob &&
        aadhaarRefValue !== "" &&
        debouncedValue !== undefined &&
        debouncedValue !== "" &&
        isValAadhar &&
        bankRefValue !== undefined
      ) {
        setShowForm(true);
      } else {
        setShowForm(false);
      }
    } else {
      if (
        mobileRefValue !== "" &&
        isValMob &&
        aadhaarRefValue !== "" &&
        isValAadhar &&
        // debouncedValue !== "" &&
        bankRefValue !== undefined
      ) {
        setShowForm(true);
      } else {
        setShowForm(false);
      }
    }
  };

  useEffect(() => {
    toggleShowForm();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [[mobileRefValue, aadhaarRefValue, debouncedValue, bankRefValue]]);

  //api call
  const aepsSubmit = (e) => {
    // if (!e || !e.currentTarget) {
    //   // Handle the case when event or currentTarget is undefined
    //   return;
    // }

    // const form = e.currentTarget;
    // e.preventDefault();
    // const mobile = form.mobile.value;
    const mobile = document.getElementById("mobile").value;
    let bank = bankObjCallBack && bankObjCallBack;
    let bankIin = ifscObjCallBack && ifscObjCallBack;
    let payload;
    var remVal = { mobile, aadhaar, bank };
    // setRemitterDetails(remVal);

    // #########################################################
    // AePS1 DATA PREPARATION ##################################
    // #########################################################
    if (aepsType === AEPS_TYPE.AEPS1) {
      if (view === AEPS.CASH_WITHDRAWAL || view === AEPS.APAY) {
        const amount = debouncedValue && debouncedValue;
        if (view === AEPS.CASH_WITHDRAWAL) {
          apiEnd = ApiEndpoints.AEPS_CASHWITHDRAWAL;
        } else if (view === AEPS.APAY) {
          apiEnd = ApiEndpoints.AEPS_APAY;
        }
        payload = {
          pipe: aepsType,
          number: mobile && mobile,
          BankName: bank && bank,
          bank_iin: bankIin,
          amount: amount ? amount : 0,
          AadharNumber: aadhaar && aadhaar.aadhaar.split(" ").join(""),
          ci: scanData?.cI,
          dc: scanData?.dC,
          dpId: scanData?.dpId,
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
      }

      if (view === AEPS.BALANCE_ENQUIRY || view === AEPS.STATEMENT) {
        if (view === AEPS.BALANCE_ENQUIRY) {
          apiEnd = ApiEndpoints.AEPS_BALANCE;
        } else if (view === AEPS.STATEMENT) {
          apiEnd = ApiEndpoints.AEPS_STATEMENT;
        }
        payload = {
          pipe: aepsType,
          type: view,
          AadharNumber: aadhaar && aadhaar.aadhaar.split(" ").join(""),
          amount: 0,
          BankName: bank,
          number: mobile && mobile,
          bank_iin: bankIin,
          ci: scanData?.cI,
          dc: scanData?.dC,
          dpId: scanData?.dpId,
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
      }
    }

    // #########################################################
    // AePS2 DATA PREPARATION ##################################
    // #########################################################
    else if (aepsType === AEPS_TYPE.AEPS2) {
      const amount = debouncedValue && debouncedValue;
      if (view === AEPS.CASH_WITHDRAWAL || view === AEPS.APAY) {
        if (view === AEPS.CASH_WITHDRAWAL) {
          apiEnd = ApiEndpoints.AEPS2_CASHWITHDRAWAL;
        } else if (view === AEPS.APAY) {
          apiEnd = ApiEndpoints.AEPS2_AADHAARPAY;
        }
        payload = {
          number: mobile && mobile,
          AadharNumber: aadhaar && aadhaar.aadhaar.split(" ").join(""),
          captureResponse: scanData,
          deviceId: scanData.srno,
          pipe: aepsType,
          BankName: bank && bank,
          bank_iin: bankIin,
          amount: amount ? amount : 0,
          latitude: userLat,
          longitude: userLong,
          pf: "WEB",
        };
      }

      if (view === AEPS.BALANCE_ENQUIRY || view === AEPS.STATEMENT) {
        if (view === AEPS.BALANCE_ENQUIRY) {
          apiEnd = ApiEndpoints.AEPS2_BALANCE;
        } else if (view === AEPS.STATEMENT) {
          apiEnd = ApiEndpoints.AEPS2_STATEMENT;
        }
        payload = {
          number: mobile && mobile,
          AadharNumber: aadhaar && aadhaar.aadhaar.split(" ").join(""),
          captureResponse: scanData,
          deviceId: scanData.srno,
          pipe: aepsType,
          BankName: bank && bank,
          bank_iin: bankIin,
          latitude: userLat,
          longitude: userLong,
          pf: "WEB",
          type: view,
        };
      }
    }

    const TxnCustData = {
      payload: payload && payload,
      apiEnd: apiEnd && apiEnd,
      remVal,
    };
    return TxnCustData;
  };

  useEffect(
    (e) => {
      let custTxnData;
      if (scanData) {
        custTxnData = aepsSubmit(e);
      }
      if (scanData && onComplete) {
        onComplete(custTxnData, ifscObjCallBack);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scanData]
  );
  const validateFunc = (e) => {
    e.preventDefault();
  };

  return (
    <Box sx={{ pt: 2, pr: { xs: 1.3, lg: 0 }, position: "relative" }}>
      {request && (
        <Backdrop
          sx={{
            // color: "#fff",
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
            Please wait request processing
          </h5>
        </Backdrop>
      )}
      <Card sx={{ p: 2 }}>
        <Grid spacing={2} container>
          <Grid item xs={12} lg={6}>
            <Box
              component="form"
              id="aepsSubmitForm"
              // ref={formRef}
              name="aepsSubmitForm"
              validate
              autoComplete="off"
              onSubmit={validateFunc}
              sx={{
                "& .MuiTextField-root": { m: 1 },
                objectFit: "contain",
                overflowY: "scroll",
              }}
            >
              <Grid container>
                {view && view === AEPS.APAY && (
                  <Grid item md={12} xs={12}>
                    <FormControl sx={{ width: "100%" }}>
                      <Typography className="blink_text">
                        This Service is Chargeable
                      </Typography>
                    </FormControl>
                  </Grid>
                )}
                <Mount visible={aepsType === AEPS_TYPE.AEPS1}>
                  <Grid item md={12} xs={12}>
                    <BankSearch
                      bankObj={(bank) => {
                        setbankObjCallBack(bank);
                      }}
                      ifscObj={(ifsc) => {
                        setifscObjCallBack(ifsc);
                      }}
                      endpt={ApiEndpoints.AEPS_BANK}
                      label="Search Bank"
                      inputRef={bankRef}
                    />
                  </Grid>
                </Mount>
                <Mount visible={aepsType === AEPS_TYPE.AEPS2}>
                  <Grid item md={12} xs={12}>
                    <BankSearchFingPay
                      bankObj={(bank) => {
                        setbankObjCallBack(bank);
                      }}
                      ifscObj={(ifsc) => {
                        setifscObjCallBack(ifsc);
                      }}
                      label="Search Bank"
                      inputRef={bankRef}
                    />
                  </Grid>
                </Mount>

                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Mobile Number"
                      id="mobile"
                      size="small"
                      required
                      inputRef={mobileRef}
                      helperText={!isValMob ? "Invalid mobile number" : ""}
                      error={!isValMob}
                      onChange={(e) => {
                        setisValMob(PATTERNS.MOBILE.test(e.target.value));
                        if (e.target.value === "") setisValMob(true);
                      }}
                      onKeyDown={(e) => {
                        if ((e.which >= 65 && e.which <= 90) || e.key === "+") {
                          e.preventDefault();
                        }
                      }}
                      inputProps={{ maxLength: 10 }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Aadhaar Number"
                      id="aadhaar"
                      name="aadhaar"
                      size="small"
                      inputRef={aadhaarRef}
                      InputProps={{
                        inputComponent: TextMaskCustom,
                        minLength: 12,
                      }}
                      helperText={!isValAadhar ? "Invalid aadhaar number" : ""}
                      error={!isValAadhar}
                      value={aadhaar.aadhaar}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Grid>
                {view &&
                  (view === AEPS.CASH_WITHDRAWAL || view === AEPS.APAY) && (
                    <Grid item md={12} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField autoComplete="off"
                          label="Amount"
                          id="amount"
                          size="small"
                          onChange={(e) => {
                            setAmountInputVal(e.target.value);
                          }}
                          // inputRef={amountRef}
                          type="text"
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                          required
                        />
                      </FormControl>
                    </Grid>
                  )}
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} lg={6}>
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
                    if (showForm === true) {
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
                    }
                  }}
                  onRdDeviceInfo={() => {
                    if (getRdDeviceInfo) getRdDeviceInfo();
                  }}
                  type="submit"
                  form="aepsSubmitForm"
                />
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
                        value={scanData?.score}
                        //required
                        disabled
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Typography sx={{ mt: 2 }}>
              <span style={{ fontWeight: "bold", color: "#DC5F5F" }}>
                Note:
              </span>
              connect scanner for scanning the impression(when scanner is
              connected dot in the corner will be green.)
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* submit button */}
      {/* <div className="mt-4 d-flex align-items-center justify-content-center">
        <MyButton
          text="Submit to Proceed"
          form="aepsSubmit"
          type="submit"
          red={true}
          // hoverOrange={true}
          // disabled={!scanData}
        />
      </div> */}
    </Box>
  );
};

export default AepsTabs;
