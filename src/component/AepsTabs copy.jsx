import React, { useContext, useRef } from "react";
import {
  Backdrop,
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Card } from "@mui/material";
import MyButton from "./MyButton";
import CachedIcon from "@mui/icons-material/Cached";
import { AEPS, RDDeviceStatus } from "../utils/constants";
import { CaptureFingerPrint } from "../utils/MantraCapture";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import AnimateIcon from "../component/AnimateIcon";
import AnimDeviceConnect from "../assets/animate-icons/device_connect.json";
import AnimDeviceReady from "../assets/animate-icons/device_ready.json";
import AnimDeviceScanning from "../assets/animate-icons/fingerprint_scan.json";
import AnimDeviceSuccess from "../assets/animate-icons/fingerprint_success.json";
import AnimDeviceFail from "../assets/animate-icons/fingerprint_fail.json";
import BankSearch from "./BankSearch";
import ApiEndpoints from "../network/ApiEndPoints";
import { postJsonData } from "../network/ApiController";
import { useState } from "react";
import AuthContext from "../store/AuthContext";
import { IMaskInput } from "react-imask";
import PropTypes from "prop-types";
import MiniStatement from "./MiniStatement";
import { PATTERNS } from "../utils/ValidationUtil";
import Swal from "sweetalert2";
import RdDeviceSearch from "./RdDeviceSearch";
import { useEffect } from "react";
import useCommonContext from "../store/CommonContext";
import useDebounce from "../utils/Debounce";

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

let bankObjCallBack, ifscObjCallBack;
let apiEnd;

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
}) => {
  const [aadhaar, setAdhaar] = useState({
    aadhaar: "",
    numberformat: "1320",
  });
  const context = useContext(AuthContext);
  const userLat = context.location.lat && context.location.lat;
  const userLong = context.location.long && context.location.long;
  const [getBankData, setGetBankData] = useState();
  const [balanceData, setBalanceData] = useState();
  const [isValMob, setisValMob] = useState(true);
  const [isValAadhar, setisValAadhar] = useState(true);

  const [request, setRequest] = useState(false);
  const [accBalance, setAccBalance] = useState();
  const [showForm, setShowForm] = useState(false);
  const mobileRef = useRef();
  const aadhaarRef = useRef();
  // const amountRef = useRef();
  const bankRef = useRef();

  const [open, setOpen] = useState(false);
  const [remitterDetails, setRemitterDetails] = useState();
  const { getRecentData } = useCommonContext();
  const mobileRefValue = mobileRef?.current?.value;
  const aadhaarRefValue = aadhaarRef?.current?.value;
  // const amountRefValue = amountRef?.current?.value;
  const bankRefValue = bankRef?.current?.value;
  const [amountInputVal, setAmountInputVal] = useState();
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
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
    setRemitterDetails(remVal);
    if (view === AEPS.CASH_WITHDRAWAL || view === AEPS.APAY) {
      const amount = debouncedValue && debouncedValue;
      if (view === AEPS.CASH_WITHDRAWAL) {
        apiEnd = ApiEndpoints.AEPS_CASHWITHDRAWAL;
      } else if (view === AEPS.APAY) {
        apiEnd = ApiEndpoints.AEPS_APAY;
      }
      payload = {
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
    postJsonData(
      apiEnd && apiEnd !== "" ? apiEnd : null,
      payload,
      setRequest,
      (data) => {
        if (view === AEPS.STATEMENT) {
          if (data && data.data && data.data.data) {
            //remove parse before live
            setAccBalance(data?.data?.bankAccountBalance);
            setGetBankData(
              // data && data.data.data ? JSON.parse(data.data.data) : ""
              data && data.data.data ? data.data.data : ""
            );
            setOpen(true);

            getRecentData();
          } else {
            okSuccessToast(data.message);
          }
          setScanAnim(RDDeviceStatus.READY);
        } else if (view === AEPS.BALANCE_ENQUIRY) {
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
      },
      (error) => {
        apiErrorToast(error);
        setScanData();
        setScanAnim(RDDeviceStatus.READY);
      }
    );
  };

  useEffect(
    (e) => {
      if (scanData) {
        aepsSubmit(e);
        // formRef.current.submit();
      }
    },
    [scanData]
  );
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
              id="aepsSubmit"
              // ref={formRef}
              validate
              autoComplete="off"
              // onSubmit={aepsSubmit}
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

                <Grid item md={12} xs={12}>
                  <BankSearch
                    bankObj={(bank) => {
                      bankObjCallBack = bank;
                    }}
                    ifscObj={(ifsc) => {
                      ifscObjCallBack = ifsc;
                    }}
                    endpt={ApiEndpoints.AEPS_BANK}
                    label="Search Bank"
                    inputRef={bankRef}
                  />
                </Grid>
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
                <span
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    display: "flex",
                    justifyContent: "between",
                    alignItems: "center",
                  }}
                >
                  {showForm ? (
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
                      disabled={!showForm}
                    />
                  ) : (
                    <Typography
                      component="div"
                      sx={{ fontSize: "13px", pr: 1, color: "red" }}
                    >
                      Fill out the form first
                    </Typography>
                  )}

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
      <div className="mt-4 d-flex align-items-center justify-content-center">
        {/* <MyButton
          text="Submit to Proceed"
          form="aepsSubmit"
          type="submit"
          red={true}
          // hoverOrange={true}
          disabled={!scanData}
        /> */}
      </div>
      {(balanceData || getBankData) && (
        <MiniStatement
          remitterDetails={remitterDetails}
          open={open}
          setOpen={setOpen}
          accBalance={accBalance}
          setGetBankData={setGetBankData}
          getBankData={getBankData}
          balanceData={balanceData}
          view={view}
        />
      )}

      {/* driver information */}
      <Box sx={{ mt: 4, mb: { xs: 8, lg: 0 } }}>
        <Card sx={{ mt: 1, p: 2, textAlign: "left" }}>
          <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
            Download Device Driver
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "left",
              mt: 2,
            }}
          >
            <Button
              onClick={() => {
                window.open(
                  "http://download.mantratecapp.com/Forms/DownLoadFiles",
                  "_blank"
                );
              }}
              variant="contained"
              sx={{
                backgroundColor: "#dc5f5f25",
                color: "#DC5F5F",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#DC5F5F",
                  color: "#fff",
                },
              }}
            >
              MANTRA
            </Button>
            <Button
              onClick={() => {
                window.open("https://acpl.in.net/RdService.html", "_blank");
              }}
              variant="contained"
              sx={{
                ml: 2,
                backgroundColor: "#dc5f5f25",
                color: "#DC5F5F",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#DC5F5F",
                  color: "#fff",
                },
              }}
            >
              STARTEK
            </Button>
            <Button
              onClick={() => {
                window.open("https://rdserviceonline.com/", "_blank");
              }}
              variant="contained"
              sx={{
                ml: 2,
                backgroundColor: "#dc5f5f25",
                color: "#DC5F5F",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#DC5F5F",
                  color: "#fff",
                },
              }}
            >
              MORPHO
            </Button>
          </Box>
          <Typography sx={{ mt: 3 }}>
            <span style={{ fontWeight: "bold", color: "#DC5F5F" }}>
              Step1:{" "}
            </span>
            After successfully registering your device, copy & paste the below
            link in your Chrome browser:
            chrome://flags/#allow-insecure-localhost
          </Typography>
          <Typography sx={{ mt: 1 }}>
            <span style={{ fontWeight: "bold", color: "#DC5F5F" }}>
              Step2:{" "}
            </span>
            Click on "Enable" and re-launch Chrome browser.
          </Typography>
        </Card>
      </Box>
    </Box>
  );
};

export default AepsTabs;
