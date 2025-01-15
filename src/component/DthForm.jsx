import {
    Box,
    Button,
    FormControl,
    Grid,
    InputAdornment,
    MenuItem,
    Switch,
    TextField,
    Tooltip,
    Typography,
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
  import Spinner from "../commons/Spinner";
  import { PATTERNS } from "../utils/ValidationUtil";
  import AllPlansBar from "./AllPlansBar";
  import { primaryColor, getEnv } from "../theme/setThemeColor";
  import { PROJECTS } from "../utils/constants";
  
  const DthForm = ({ view, setOperatorIcon,operatorIcon }) => {
    const authCtx = useContext(AuthContext);
    const userLat = authCtx.location && authCtx.location.lat;
    const userLong = authCtx.location && authCtx.location.long;
    const [isMobV, setIsMobV] = useState(true);
    const [isCustomerIdV, setIsCustomerIdV] = useState(true);
    const [checked, setChecked] = React.useState(true);
    const [request, setRequest] = useState(false);
    const [infoFetched, setInfoFetched] = useState(false);
    const [numberinfo, setNumberinfo] = useState();
    const [mobile, setMobile] = useState("");
    const [amount, setAmount] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [operatorVal, setOperatorVal] = useState([]);
    const [defaultIcon, setdefaultIcon] = useState();
    const [operator, setOperator] = useState();
    const [successRecharge, setSuccessRechage] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [customerId, setCustomerId] = useState("");
    let title = checked && checked ? "Prepaid" : "Postpaid";
    const envName = getEnv();
  
    const getOperatorVal = () => {
      // setOperator("");
      get(
        ApiEndpoints.GET_OPERATOR,
        `sub_type=${view === "mobile" ? title : "DTH"}`,
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
    const [data, setData] = useState("");  
    const getNumberInfo = (number) => {
      setInfoFetched(false);
      postJsonData(
        ApiEndpoints.GET_NUMBER_INFO,
        {
          number: number,
          type: view === "mobile" ? "M" : "D",
        },
        setRequest,
        (res) => {
          if (res && res.data && res.data) {
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
            error &&
            error.response &&
            error.response.status &&
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
      // if (numberinfo && numberinfo) {
      //   const val = {
      //     op: numberinfo.operator,
      //     img: numberinfo.img,
      //   };
      //   setOperator(val);
      // }
      // if nothing is typed in the number text field then numberinfo = null
      if (!numberinfo) {
        setdefaultIcon("");
      }
    }, [numberinfo]);
  
    useEffect(() => {
      if (operatorVal && numberinfo) {
        operatorVal &&
          operatorVal.forEach((item) => {
            if (item.code === numberinfo.operator) {
              setdefaultIcon(item.img);
            }
          });
      }
  
  
      if (mobile === "" && view === "mobile") {
        setdefaultIcon("");
      }
    }, [operatorVal, numberinfo]);
  
    const handleSubmit = (event) => {
      if (infoFetched) {
        document.activeElement.blur();
        event.preventDefault();
        const form = event.currentTarget;
        const data = {
          number: title === "Prepaid" ? form.mobile.value : undefined,
          param1: title === "Postpaid" ? form.mobile.value : undefined,
          operator:
            operator && operator.op
              ? operator.op
              : numberinfo && numberinfo.operator,
          amount: form.amount.value,
          type: view === "mobile" ? title.toUpperCase() : "DTH",
          pf: "WEB",
          latitude: userLat && userLat,
          longitude: userLong && userLong,
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
      const selectedOperator = operatorVal.find(item => item.code === event.target.value);
      setOperator(selectedOperator); 
      setOperatorIcon(selectedOperator ? selectedOperator.img : ""); // Update the operator image
    };
    return (
     
      <div className="position-relative"  >
     
        <Spinner circleBlue loading={request} />
        <Box className="" sx={{ p: 3 }}>
       
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: "24px", fontWeight: "bold" }}>
              {view === "mobile" ? title : "DTH"}
            </Typography>
            {view === "mobile" && (
              <div style={{ textAlign: "right" }}>
                <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
                  {title && title === "Prepaid"
                    ? "Switch to Postpaid"
                    : "Switch to Prepaid"}
                </Typography>
                <Tooltip
                  title={title && title === "Prepaid" ? "Postpaid" : "Prepaid"}
                >
                  <Switch
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "controlled" }}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: primaryColor(),
                      },
                    }}
                  />
                </Tooltip>
              </div>
            )}
          </div>
  
          <div id="prepaid">
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
              <Grid sx={{ pt: 1 }} disabled>
                <Grid item md={12} xs={12}>
                  {view === "mobile" && (
                    <FormControl sx={{ width: "100%" }}>
                      <TextField autoComplete="off"
                        label="Mobile Number"
                        id="mobile"
                        type="number"
                        size="small"
                        error={!isMobV}
                        helperText={!isMobV ? "Enter valid Mobile" : ""}
                        InputProps={{
                          inputProps: { maxLength: 10 },
                        }}
                        value={mobile && mobile}
                        // onKeyDown={(e) => {
                        //   if (e.key === "+") {
                        //     e.preventDefault();
                        //   }
                        //   if (e.target.value.length === 10) {
                        //     if (e.key.toLowerCase() !== "backspace") {
                        //       e.preventDefault();
                        //     }
  
                        //     if (e.key.toLowerCase() === "backspace") {
                        //     }
                        //   }
                        // }}
                        onChange={(e) => {
                          setIsMobV(PATTERNS.MOBILE.test(e.target.value));
                          if (e.target.value === "") setIsMobV(true);
                          setMobile(e.target.value);
                          if (
                            e.target.value.length === 10 &&
                            PATTERNS.MOBILE.test(e.target.value)
                          ) {
                            getNumberInfo(e.target.value);
                          } else {
                            setInfoFetched(false);
                            setAmount("");
                            setNumberinfo("");
                            setOperator("");
                          }
                        }}
                        required
                        disabled={request && request ? true : false}
                      />
                       
                    </FormControl>
                  )}
  
                  {/* DTH FROM HERE */}
                  {view === "dth" && (
                    <FormControl sx={{ width: "100%" }}>
                      <TextField autoComplete="off"
                        label="Customer ID"
                        id="mobile"
                        type="tel"
                        error={!isCustomerIdV}
                        helperText={
                          !isCustomerIdV ? "Enter valid Customer Id" : ""
                        }
                        size="small"
                        inputProps={{ maxLength: 20 }}
                        onChange={(e) => {
                          setCustomerId(e.target.value);
                          setIsCustomerIdV(PATTERNS.DTH.test(e.target.value));
                          if (e.target.value === "") {
                            setIsCustomerIdV(true);
                            setInfoFetched(false);
                            setAmount("");
                            setNumberinfo("");
                            setOperator("");
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            infoFetched &&
                            e.key.toLowerCase() === "backspace"
                          ) {
                            setInfoFetched(false);
                            setAmount("");
                            setNumberinfo("");
                            setOperator("");
                          }
                        }}
                        required
                        InputProps={{
                          endAdornment: infoFetched &&
                            envName !== PROJECTS.moneyoddr && (
                              <InputAdornment position="end">
                                <Button
                                  variant="text"
                                  onClick={() => {
                                    getNumberInfo(customerId);
                                  }}
                                >
                                  get Info
                                </Button>
                              </InputAdornment>
                            ),
                        }}
                      />
                    </FormControl>
                  )}
                </Grid>
               {operatorVal&&(
                  <div style={{ width: "100%" }}>
                    <Grid item md={12} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField autoComplete="off"
                          label="Service Provider"
                          id="operator"
                         size="small"
                          required
                          select
                          onFocus={handleClickMenu}
                          value={
                            operator && operator.op
                              ? operator.op
                              : numberinfo && numberinfo.operator
                          }
                          onChange={handleOperatorChange}
                          disabled={request}
                        >
                          {operatorVal &&
                            operatorVal.map((option, index) => (
                              <MenuItem
                                value={option.code}
                                key={index}
                                // onClick={(e) => {
                                //   const val = {
                                //     op: option.code,
                                //     img: option.img,
                                //   };
                                //   setOperator(val);
                                //   setAnchorEl(null);
                                // }}
                              >
                                <div style={{ textAlign: "left" }}>
                                  <img
                                    src={option.img}
                                    width="24px"
                                    height="auto"
                                    alt="operator_img"
                                    style={{ marginRight: "12px" }}
                                  />
                                  {option.name}
                                </div>
                              </MenuItem>
                            ))}
                        </TextField>
                      </FormControl>
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField autoComplete="off"
                          label="Amount"
                          id="amount"
                          size="small"
                          type="number"
                          value={amount && amount}
                          onChange={(e) => {
                            setAmount(e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "+" || e.key === "-") {
                              e.preventDefault();
                            }
                          }}
                          InputProps={{
                            inputProps: { max: 10000, min: 10 },
                            endAdornment: infoFetched && view === "mobile" && (
                              <InputAdornment position="end">
                                <AllPlansBar
                                  operator={operator && operator.op}
                                  onClick={(plan) => {
                                    setAmount(plan?.plan);
                                  }}
                                />
                              </InputAdornment>
                            ),
                          }}
                          required
                          disabled={request && request ? true : false}
                        />
                      </FormControl>
                    </Grid>
                  </div>
                )}
              </Grid>
            </Box>
            <Button
              type="submit"
              form="recharge"
              className="btn-background"
              sx={{
                width: "95%",
                mt: 1,
              }}
              // endIcon={<ArrowForwardIosIcon sx={{ fontSize: "10px" }} />}
              disabled={request}
            >
              <span>
                {infoFetched
                  ? "Proceed to pay"
                  : view === "mobile"
                  ? "Proceed"
                  : "Fetch Info"}
              </span>
              {/* <ArrowForwardIosIcon sx={{ fontSize: "16px" }} /> */}
            </Button>
            {infoFetched && numberinfo && (
              <RepeatRechargeModal data={numberinfo} setAmount={setAmount} />
            )}
            {modalVisible && modalVisible && (
              <EnterMpinModal
                data={data}
                setModalVisible={setModalVisible}
                setSuccessRechage={setSuccessRechage}
                apiEnd={ApiEndpoints.PREPAID_RECHARGE}
                view="recharge"
                setShowSuccess={setShowSuccess}
                setMobile={setMobile}
                setInfoFetched={setInfoFetched}
              />
            )}
            {showSuccess && showSuccess && (
              <SuccessRechargeModal
                successRecharge={successRecharge}
                setShowSuccess={setShowSuccess}
              />
            )}
  {/* 
           {operatorIcon && (
            <img src={operatorIcon} alt="Selected Operator" width="100" style={{ marginTop: "20px" }} />
          )} */}
          </div>
        </Box>
      </div>
      
    );
  };
  
  export default DthForm;
  