import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  InputAdornment,
  Switch,
  TextField,
  Tooltip,
  Typography,
  Avatar,
} from "@mui/material";
import React from "react";
import { get, postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { useState } from "react";
import { apiErrorToast } from "../utils/ToastUtil";
import RepeatRechargeModal from "../modals/RepeatRechargeModal";
import EnterMpinModal from "../modals/EnterMpinModal";
import { useEffect } from "react";
import SuccessRechargeModal from "../modals/SuccessRechargeModal";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";
import Loader from "../component/loading-screen/Loader";
import { PATTERNS } from "../utils/ValidationUtil";
import AllPlansBar from "./AllPlansBar";
import {  getEnv } from "../theme/setThemeColor";
import { PROJECTS } from "../utils/constants";
import CardComponent from "./CardComponent";
import CircleComponent from "./CircleComponent";
import { back } from "../iconsImports";

const MobileRechargeForm = ({ type, resetView, title }) => {
  const authCtx = useContext(AuthContext);
  const userLat = authCtx.location && authCtx.location.lat;
  const userLong = authCtx.location && authCtx.location.long;
  const [isMobV, setIsMobV] = useState(true);
  const [isCustomerIdV, setIsCustomerIdV] = useState(true);
  const [checked, setChecked] = useState(true);
  const [request, setRequest] = useState(false);
  const [infoFetched, setInfoFetched] = useState(false);
  const [numberinfo, setNumberinfo] = useState();
  const [operatorCode, setOperatorCode] = useState();
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const [opName, setOpName] = useState("");
  const [amount, setAmount] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [operatorVal, setOperatorVal] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState([null]);
  const [defaultIcon, setDefaultIcon] = useState();
  const [operator, setOperator] = useState();
  const [successRecharge, setSuccessRechage] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [IsOptSelected, setIsOptSelected] = useState(false);
  const [data, setData] = useState();
  const envName = getEnv();

  const getOperatorVal = () => {
    get(
      ApiEndpoints.GET_OPERATOR,
      `sub_type=${type === "mobile" ? title : "DTH"}`,
      "",
      (res) => {
        const opArray = res.data.data;
        const op = opArray.map((item) => {
          return {
            code: item.code,
            name: item.name,
            img: item.img,
          };
        });
        setOperatorVal(op);
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  const getNumberInfo = (number) => {
    setInfoFetched(false);
    postJsonData(
      ApiEndpoints.GET_NUMBER_INFO,
      {
        number: number,
        type: type === "mobile" ? "M" : "D",
      },
      setRequest,
      (res) => {
        if (res && res.data && res.data.info) {
          const data = res.data.info;
          const customNumInfo = data;
          customNumInfo.customer_no = number;
          setNumberinfo(customNumInfo);
          setInfoFetched(true);
          getOperatorVal();
        } else {
          setNumberinfo();
        }
      },
      (error) => {
        if (
          error.response &&
          (error.response.status === 403 || error.response.status === 404)
        ) {
          setInfoFetched(true);
        } else {
          apiErrorToast(error);
        }
      }
    );
  };

  useEffect(() => {
    getOperatorVal();
    if (!numberinfo) {
      setDefaultIcon("");
    }
  }, [numberinfo]);

  useEffect(() => {
    if (operatorVal && numberinfo) {
      operatorVal.forEach((item) => {
        if (item.code === numberinfo.operator) {
          setDefaultIcon(item.img);
        }
      });
    }
    if (mobile === "" && type === "mobile") {
      setDefaultIcon("");
    }
  }, [operatorVal, numberinfo]);

  const handleSubmit = (event) => {
    if (infoFetched) {
      document.activeElement.blur();
      event.preventDefault();
      const form = event.currentTarget;

      // Determine the correct type based on title and type
      let rechargeType;
      if (type === "mobile") {
        rechargeType = title === "Prepaid" ? "PREPAID" : "POSTPAID";
      } else {
        rechargeType = "DTH";
      }

      const number =
        type === "mobile"
          ? title === "Prepaid"
            ? form.mobile.value
            : undefined
          : type === "dth"
          ? customerId
          : undefined;

      const data = {
        number, // This will be assigned based on the conditions above
        param1: title === "Postpaid" ? form.mobile.value : undefined,
        operator: operatorCode
          ? operatorCode
          : numberinfo && numberinfo.operator,
        amount: form.amount.value,
        type: rechargeType,
        pf: "WEB",
        latitude: userLat || undefined,
        longitude: userLong || undefined,
      };

      setData(data);
      setModalVisible(true);
    } else {
      event.preventDefault();
      getNumberInfo(customerId);
    }
  };
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClickMenu = (event) => {
    getOperatorVal();
    // setAnchorEl(event.currentTarget);
  };
  const handleCloseMenue = () => {
    setAnchorEl(null);
  };

  const handleOperatorChange = (event) => {
    // const selectedOperator = operatorVal.find(item => item.code === event.target.value);
    setOperator(selectedOperator);
    setOpName(selectedOperator ? selectedOperator.name : "");
    // Update the operator image
  };

  const handleOpenVal = (opt) => {
    if (!IsOptSelected) {
      setIsOptSelected(true);
    }
    setOpName(opt.name);
    setOperatorCode(opt.code);
    // alert(`You clicked on: ${operatorVal}`);
  };

  const handleBack = () => {
    resetView(false);
  };
  return (
    <div className="position-relative">
      <Grid
        item
        xs={12}
        sm="auto"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          ml: 1,
          mt: 1,
        }}
      >
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
      </Grid>
      <Loader loading={request} />
      {!IsOptSelected && (
        <Grid container spacing={2}>
          {operatorVal &&
            operatorVal.map((operator, index) => (
              <Grid
                item
                xs={6}
                sm={4}
                md={3}
                key={index}
                style={{ height: "140px" }}
              >
                <CardComponent
                  title={operator.name}
                  img={operator.code}
                  onClick={() => handleOpenVal(operator)}
                />
              </Grid>
            ))}
        </Grid>
      )}

      {IsOptSelected && (
        <Grid container spacing={2} sx={{ height: "500px" }}>
          <Grid item lg={4} xs={12} sm={3.8}>
            {operatorVal &&
              operatorVal.map((operator, index) => (
                <CardComponent
                  title={operator.name}
                  setOpIcon={setOperatorCode}
                  img={operator.code}
                  height="55px"
                  isSelected={opName === operator.name}
                  onClick={() => handleOpenVal(operator)}
                />
              ))}
          </Grid>

          <Grid item lg={7.8} xs={12} sm={8.2}>
            <Card sx={{ height: "75%", position: "relative" }}>
              <Box sx={{ p: 3 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CircleComponent img={operatorCode} />
                    <Typography
                      sx={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        marginLeft: "16px",
                      }}
                    >
                      {type === opName ? title : opName}
                    </Typography>
                  </div>

                  {type === "mobile" && (
                    <div style={{ textAlign: "right" }}>
                      <Typography
                        sx={{ mr: 4, fontSize: "25px", fontWeight: "bold" }}
                      >
                        {title}
                      </Typography>
                  
                    </div>
                  )}
                </div>

                {/* Form Section */}
                <Box
                  component="form"
                  id="recharge"
                  validate
                  autoComplete="off"
                  onSubmit={handleSubmit}
                  sx={{
                    "& .MuiTextField-root": { m: 2 },
                    objectFit: "contain",
                    overflowY: "scroll",
                  }}
                >
                  <Grid item xs={12}>
                    {type === "mobile" && (
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          autoComplete="off"
                          label="Mobile Number"
                          id="mobile"
                          type="text" // Change to 'text' to allow for custom input validation
                          size="small"
                          error={
                            !isMobV ||
                            (mobile.length === 10 && mobile.startsWith("0"))
                          }
                          helperText={
                            !isMobV
                              ? "Enter valid Mobile Number"
                              : mobile.length === 10 && mobile.startsWith("0")
                              ? "Mobile number cannot start with 0"
                              : ""
                          }
                          InputProps={{
                            inputProps: { maxLength: 10 },
                          }}
                          value={mobile}
                          onChange={(e) => {
                            const value = e.target.value;

                            // Prevent typing '0' as the first character and more than 10 digits
                            if (
                              value.length > 10 ||
                              (value.length === 1 && value.startsWith("0"))
                            ) {
                              return; // Do not update state if the condition is met
                            }

                            // Set initial state for validations
                            if (value === "") {
                              setIsMobV(true);
                              setMobile(value);
                              setInfoFetched(false);
                              setAmount("");
                              setNumberinfo("");
                              setOperator("");
                              return;
                            }

                            // Update validation state
                            const isValidLength = value.length === 10;
                            const isValidPattern = PATTERNS.MOBILE.test(value);
                            const startsWithZero = value.startsWith("0");

                            // Set the validation flag based on the conditions
                            setIsMobV(isValidPattern && !startsWithZero);

                            setMobile(value);

                            // Fetch number info only if it is a valid 10-digit number
                            if (
                              isValidLength &&
                              isValidPattern &&
                              !startsWithZero
                            ) {
                              getNumberInfo(value);
                            } else {
                              setInfoFetched(false);
                              setAmount("");
                              setNumberinfo("");
                              setOperator("");
                            }
                          }}
                          required
                          disabled={request}
                        />
                      </FormControl>
                    )}
                    {type === "dth" && (
                    <FormControl sx={{ width: "100%" }}>
                    <TextField
                      autoComplete="off"
                      label="Customer ID"
                      id="customer-id"
                      type="tel"
                      value={customerId?customerId:""}
                      error={!isCustomerIdV}
                      helperText={!isCustomerIdV ? "Enter valid Customer ID" : ""}
                      size="small"
                      inputProps={{ maxLength: 20 }}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCustomerId(value);
                        setIsCustomerIdV(PATTERNS.DTH.test(value));
                     
                      }}
                      required
                      InputProps={{
                        endAdornment:
                          infoFetched &&
                          envName !== PROJECTS.moneyoddr && (
                            <InputAdornment position="end">
                              <Button
                                variant="text"
                                onClick={() => getNumberInfo(customerId)}
                              >
                                Get Info
                              </Button>
                            </InputAdornment>
                          ),
                      }}
                    />
                  </FormControl>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="Amount"
                        id="amount"
                        size="small"
                        type="number"
                        value={amount || ""}
                        onChange={(e) => setAmount(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "+" || e.key === "-") {
                            e.preventDefault();
                          }
                        }}
                        InputProps={{
                          inputProps: { max: 10000, min: 10 },
                          endAdornment: infoFetched && type === "mobile" && (
                            <InputAdornment position="end">
                              <AllPlansBar
                                operator={operator && operator.op}
                                onClick={(plan) => setAmount(plan?.plan)}
                              />
                            </InputAdornment>
                          ),
                        }}
                        required
                        disabled={request}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      form="recharge"
                      className="btn-background"
                      sx={{
                        width: "95%",
                        mt: 1,
                      }}
                      disabled={request}
                    >
                      <span>
                        {infoFetched
                          ? "Proceed to pay"
                          : type === "mobile"
                          ? "Proceed"
                          : "Fetch Info"}
                      </span>
                    </Button>
                  </Grid>

                  {infoFetched && numberinfo && (
                    <RepeatRechargeModal
                      data={numberinfo}
                      setAmount={setAmount}
                    />
                  )}
                  {modalVisible && (
                    <EnterMpinModal
                      data={data}
                      customerId={customerId}
                      setModalVisible={setModalVisible}
                      setAmount={setAmount}
                      setSuccessRechage={setSuccessRechage}
                      setCustomerId={setCustomerId}
                      apiEnd={ApiEndpoints.PREPAID_RECHARGE}
                      view="recharge"
                      setShowSuccess={setShowSuccess}
                      setMobile={setMobile}
                      setInfoFetched={setInfoFetched}
                    />
                  )}
                  {showSuccess && (
                    <SuccessRechargeModal
                      successRecharge={successRecharge}
                      setShowSuccess={setShowSuccess}
                    />
                  )}
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default MobileRechargeForm;
