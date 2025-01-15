import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material";
import React from "react";
import { back, cmsIcon } from "../iconsImports";
import { useState } from "react";
import AuthContext from "../store/AuthContext";
import { useContext } from "react";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import Mount from "../component/Mount";
import { Icon } from "@iconify/react";
import Loader from "../component/loading-screen/Loader";
import { useEffect } from "react";
import BackspaceIcon from "@mui/icons-material/Backspace";
import BillDetailsModal from "../modals/BillDetailsModal";
import CommonMpinModal from "../modals/CommonMpinModal";
import { validateApiCall } from "../utils/LastApiCallChecker";
import useCommonContext from "../store/CommonContext";
import CryptoJS from "crypto-js";
import useResponsive from "../hooks/useResponsive";
import CustomTabs from "../component/CustomTabs";
import { cms_tab_value, mt_tab_value } from "../utils/constants";
import { styled } from "@mui/material/styles";

const OuterIcon = styled(Box)(({ theme, bg = "#08509E" }) => ({
  top: "-12px",
  zIndex: 1,
  right: "-12px",
  width: "100px",
  height: "100px",
  display: "flex",
  borderRadius: "50%",
  position: "absolute",
  alignItems: "center",
  justifyContent: "center",
  background: bg,
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px inset",
}));

const InnerIcon = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  width: "48px",
  height: "48px",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
  background: theme.palette.common.white,
}));

const CMSView = ({ resetView }) => {
  const [request, setRequest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, settype] = useState("cms1");
  const authCtx = useContext(AuthContext);
  const location = authCtx.location;
  const [url, setUrl] = useState(undefined);
  const [hardCodeLoading, setHardCodeLoading] = useState(false);
  const [operators, setOperators] = useState([]);
  // const [bbpsLoanEmiType, setBbpsLoanEmiType] = useState([]);
  const [currentBiller, setCurrentBiller] = useState(false);
  // console.log("currentBiller", currentBiller);
  const [billerId, setBillerId] = useState("");
  const [billDetails, setBillDetails] = useState(false);
  const [params, setParams] = useState([]);
  const [fetchMandatory, setFetchMandatory] = useState("");
  const [categoryName, setCategoryName] = useState("Loan EMI");
  const [payRequest, setPayRequest] = useState(false);
  const [billValue, setBillValue] = useState();
  const [err, setErr] = useState();
  const [openMpin, setOpenMpin] = useState(false);
  const [mpinVal, setMpinVal] = useState(false);
  const { getRecentData } = useCommonContext();
  const isMobile = useResponsive("md", "down");
  const [tabValue, setTabValue] = useState("tab1");
  const [value, setValue] = useState(0);
  const [currentType, setCurrentType] = useState("cms1"); // Default active tab value

  const handleBack = () => {
    resetView(false);
  };

  const filterOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option) => option.billerName,
  });

  const getBillers = () => {
    setOperators([]);
    setParams([]);
    setCurrentBiller("");
    postJsonData(
      ApiEndpoints.BBPS_GET_BILLERS,
      { categoryKey: "C13" },
      setLoading,
      (res) => {
        const data = res?.data?.data?.records;
        setOperators(data);
        setFetchMandatory("");
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  // GET BBPS Billers
  const getBillersDetails = (billerId) => {
    postJsonData(
      ApiEndpoints.BBPS_GET_BILLERS_DETAILS,
      { billerId: billerId },
      setLoading,
      (res) => {
        const data = res.data.data;
        setParams(data.parameters);
        setFetchMandatory(data.fetchRequirement);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  // fetch bill
  const fetchBill = (event) => {
    const data = {
      billerId: billerId,
      latitude: location.lat,
      longitude: location.long,
      amount: 0,
    };
    params.map((item) => {
      let propertyName = item.name;
      data[propertyName] =
        item.inputType === "NUMERIC"
          ? Number(document.getElementById(propertyName).value)
          : document.getElementById(propertyName).value;
      return data;
    });

    if (data.param1 === "") {
      apiErrorToast("Please fill out all the fields");
    } else if (data.hasOwnProperty("param2") && data.param2 === "") {
      apiErrorToast("Please fill out all the fields");
    } else if (data.hasOwnProperty("param3") && data.param3 === "") {
      apiErrorToast("Please fill out all the fields");
    } else if (data.hasOwnProperty("param4") && data.param4 === "") {
      apiErrorToast("Please fill out all the fields");
    } else {
      postJsonData(
        ApiEndpoints.BBPS_FETCH_BILL,
        data,
        setLoading,
        (res) => {
          setBillDetails(res.data.data.data);
        },
        (err) => {
          apiErrorToast(err);
        }
      );
    }
  };

  // pay bill
  const payBill = (event) => {
    event.preventDefault();
    const data = {
      billerId: billerId && billerId,
      biller_name: currentBiller?.billerName,
      amount: billValue,
      pf: "web",
      cat: "C13",
      mpin: mpinVal,
      latitude: location.lat,
      longitude: location.long,
      enquiryReferenceId: billDetails
        ? billDetails.enquiryReferenceId
        : "15486sfdgyf",
    };
    params &&
      params.map((item) => {
        let propertyName = item.name;
        data[propertyName] =
          item.inputType === "NUMERIC"
            ? Number(document.getElementById(propertyName).value)
            : document.getElementById(propertyName).value;
        return data;
      });
    if (validateApiCall()) {
      postJsonData(
        ApiEndpoints.BBPS_PAY_BILL,
        data,
        setPayRequest,
        (res) => {
          okSuccessToast(res.data.message);
          getRecentData();
          setBillDetails(false);
          setMpinVal(false);
          setErr("");
        },
        (error) => {
          setMpinVal(false);
          apiErrorToast(error);
          getRecentData();
          setErr("");
          // setBillDetails(false);
        }
      );
    } else {
      const error = {
        message: "Kindly wait some time before another request",
      };
      setErr(error);
    }
  };

  useEffect(() => {
    // getBillersDetails();
    getBillers();
  }, []);

  // CMS 1 handle submit
  const handleSubmit = (event) => {
    setHardCodeLoading(true);
    event.preventDefault();
    let amount = document.getElementById("amount").value;
    let mobile = document.getElementById("mob").value;
    const data = {
      amount,
      latitude: location?.lat,
      longitude: location.long,
      pf: "web",
      mobile,
      additionalParams: null,
    };
    postJsonData(
      ApiEndpoints.CREATE_ORDER_CMS,
      data,
      setRequest,
      (res) => {
        const wholeRes = res.data.data;
        let parsedBase64Key = CryptoJS.enc.Base64.parse(
          wholeRes.superMerchantSkey.substring(0, 32)
        );

        // console.log("parsedBase64Key", parsedBase64Key);

        const encrypted = CryptoJS.AES.encrypt(
          JSON.stringify(wholeRes),
          parsedBase64Key,
          {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
          }
        );

        // skey : substring (0,32)
        //

        // console.log("encrypted", encrypted);

        const encryptedString = btoa(encrypted);

        // console.log("encryptedString", encryptedString);

        if (encryptedString) {
          setUrl(
            `https://fpuat.tapits.in/UberCMSBC/#/login?data=${encryptedString}&skey=${wholeRes.superMerchantSkey.substring(
              0,
              32
            )}`
          );

          // window.open(
          //   `https://fpuat.tapits.in/UberCMSBC/#/login?data=${encryptedString}&skey=${wholeRes.superMerchantSkey}`,
          //   "_blank"
          // );

          //   setTimeout(() => {
          //     setHardCodeLoading(false);
          //   }, 1500);
        }
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  if (request) {
    return (
      <Grid sx={{ position: "relative" }}>
        <div>
          <Loader loading={request} />
        </div>
      </Grid>
    );
  }

  // const tabs = [{label: "Cms 2"}];
  // const handleChange = (event, newValue) => {
  //   console.log("newval", newValue);
  //   setValue(newValue);
  //   settype(cms_tab_value[newValue]);
  //   setCurrentType(cms_tab_value[newValue]);
  //   console.log("cms value is", type);
  // };

  return (
    <>
      <Grid>
        {/* <CustomTabs tabs={tabs} value={value} onChange={handleChange} /> */}

        <Box
          sx={{
            display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
            // height: "100vh",
            position: "relative",
            mt: 1,
          }}
        >
          <OuterIcon>
            <InnerIcon>
              <img src={cmsIcon} alt="cms" width="140%" />
            </InnerIcon>
          </OuterIcon>
          <Mount visible={url}>
            <Grid container>
              <Grid
                item
                md={12}
                xs={12}
                lg={12}
                sx={{
                  position: "absolute",
                  top: "100px",
                  left: "100px",
                  overflowY: "hidden",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <img src={cmsIcon} alt="cms" width="20%" />
                  <Icon
                    icon="iconamoon:close-fill"
                    onClick={() => setUrl(undefined)}
                    style={{ fontSize: "40px" }}
                  />
                </div>
                <iframe
                  src={url}
                  title="description"
                  frameBorder="0"
                  marginHeight="0"
                  style={{
                    width: isMobile ? "100px" : "800px",
                    height: "600px",
                  }}
                ></iframe>
              </Grid>
            </Grid>
          </Mount>
          <Mount visible={!url}>
            <Grid
              container
              sx={{
                width: { lg: "100%", md: "100%", sm: "100%", xs: "100%" },
                px: { md: 5, sm: 3, xs: 1 },
                py: 3,
                position: "relative",
              }}
              className="card-css"
            >
              <Grid
                item
                xs={12}
                sm="auto"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",

                  mt: 1,
                }}
              >
                <Button
                  size="small"
                  id="verify-btn"
                  className="button-props"
                  onClick={handleBack}
                  sx={{ ml: 7 }}
                >
                  <span>Home</span>
                  <img
                    src={back}
                    alt="back"
                    style={{ width: "18px", height: "20px" }}
                  />
                </Button>
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "left",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "600",
                    textAlign: "center",
                    fontSize: "22px",

                    ml: 7,
                    mt: 2,
                  }}
                >
                  {type === "cms1" && "Cash Management System "}
                </Typography>
              </Grid>

              {/* <Grid item md={12} xs={12} sx={{ mt: 3 }}>
            <div sx={{ display: "flex" }}>
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  
                  textAlign: "left",
                  mt: 1,
                }}
              >
                Choose Between CMS 1 OR CMS 2
              </Typography>
              <RadioGroup
                row
                value={type}
                onChange={(e) => settype(e.target.value)}
              >
                <FormControlLabel
                  value="cms1"
                  control={<Radio />}
                  label="CMS 1"
                />
                <FormControlLabel
                  value="cms2"
                  control={<Radio />}
                  label="CMS 2"
                />
              </RadioGroup>
            </div>
          </Grid> */}
              {/* {type === "cms1" ? (
                <Grid item md={12} xs={12}>
                  <Box
                    component="form"
                    id="cms_transfer"
                    validate
                    autoComplete="off"
                    onSubmit={handleSubmit}
                    sx={{
                      "& .MuiTextField-root": { m: 2 },
                    }}
                  >
                    <Grid container sx={{ pt: 1 }}>
                      <Grid item md={12} xs={12}>
                        <FormControl sx={{ width: "90%" }}>
                          <TextField
                            autoComplete="off"
                            label="Amount"
                            id="amount"
                            size="small"
                            type="number"
                            inputProps={{
                              form: {
                                autocomplete: "off",
                              },
                            }}
                            InputProps={{
                              inputProps: {
                                max: 500000,
                                min: 10,
                              },
                            }}
                            required
                            onKeyDown={(e) => {
                              if (e.key === "+" || e.key === "-") {
                                e.preventDefault();
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <FormControl sx={{ width: "90%" }}>
                          <TextField
                            autoComplete="off"
                            label="Mobile"
                            id="mob"
                            size="small"
                            type="number"
                            inputProps={{
                              form: {
                                autocomplete: "off",
                              },
                            }}
                            required
                          />
                        </FormControl>
                      </Grid>
                      {/* <Grid item md={12} xs={12}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField autoComplete="off"
                        label="Remark"
                        id="remark"
                        size="small"
                        multiline
                        rows={3}
                        inputProps={{
                          form: {
                            autocomplete: "off",
                          },
                        }}
                        required
                      />
                    </FormControl>
                  </Grid> */}
                    {/* </Grid>
                  </Box>
                  <Button
                    type="submit"
                    form="cms_transfer"
                    className="btn-background"
                    sx={{
                      width: "87%",
                      mt: 1,
                    }}
                    disabled={request}
                  >
                    <span>Proceed</span>
                  </Button>
                </Grid> */}
              {/* ) : ( */} 
                <>
                  <Grid item md={12} xs={12} sx={{ mt: 2 }}>
                    <Loader loading={loading} />
                    <Autocomplete
                      filterOptions={filterOptions}
                      autoHighlight
                      openOnFocus
                      selectOnFocus
                      id="biller"
                      // freeSolo
                      options={operators}
                      value={currentBiller.billerName}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setCurrentBiller(newValue);
                          setBillerId(newValue.billerId);
                          getBillersDetails(newValue.billerId);
                        } else {
                          setCurrentBiller("");
                          setBillerId("");
                        }
                      }}
                      getOptionLabel={(option) => {
                        return currentBiller.billerName
                          ? currentBiller.billerName
                          : "Select Biller";
                      }}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          sx={{
                            "& > img": { mr: 2, flexShrink: 0 },
                            fontSize: "12px",
                          }}
                          {...props}
                        >
                          <Typography>{option.billerName}</Typography>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <FormControl sx={{ width: "87%" }}>
                          <TextField
                            autoComplete="off"
                            {...params}
                            // autoFocus
                            id="biller_textfield"
                            label="Select Biller"
                            size="small"
                            sx={{
                              textAlign: "center",
                            }}
                            // defaultValue=""
                            // value={
                            //   currentBiller?.billerName
                            //     ? currentBiller?.billerName
                            //     : ""
                            // }
                            // onChange={handleChange}
                          />
                        </FormControl>
                      )}
                      clearIcon={
                        <BackspaceIcon
                          sx={{ fontSize: "15px", ml: 0 }}
                          onClick={() => {
                            setCurrentBiller("");
                            setBillerId("");
                          }}
                        />
                      }
                    />
                  </Grid>

                  {/* ##### map the params that comes from selecting the operators #####*/}
                  {params &&
                    params.map((item, index) => {
                      return (
                        <Grid item md={12} xs={12} key={index} sx={{ mt: 2 }}>
                          <FormControl
                            sx={{
                              width: "87%",
                            }}
                          >
                            <TextField
                              autoComplete="off"
                              label={item.desc}
                              id={item.name}
                              inputProps={{
                                minLength: item.minLength,
                                maxLength: item.maxLength,
                                pattern: item.regex,
                              }}
                              // inputProps={{ style: { textTransform: "uppercase" } }}
                              size="small"
                              minLength={item.minLength}
                              maxLength={item.maxLength}
                              required={item.mandatory === 1}
                              type={
                                item.inputType && item.inputType === "NUMERIC"
                                  ? "number"
                                  : "text"
                              }
                            />
                          </FormControl>
                        </Grid>
                      );
                    })}
                  {err && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                        fontSize: "12px",
                        px: 2,
                        color: "#DC5F5F",
                      }}
                    >
                      {err.message && err.message && (
                        <div>{err && err.message}</div>
                      )}
                    </Box>
                  )}
                  <Grid item md={12} xs={12}>
                    <FormControl sx={{ mt: 2, width: "87%" }}>
                      {fetchMandatory && fetchMandatory === "MANDATORY" && (
                        <BillDetailsModal
                          billerId={billerId}
                          params={params}
                          currentBiller={currentBiller}
                          billDetails={billDetails}
                          setBillDetails={setBillDetails}
                          fetchBill={fetchBill}
                          categoryName={categoryName}
                          payRequest={payRequest}
                          payBill={payBill}
                          mpinVal={mpinVal}
                          setMpinVal={setMpinVal}
                          setOpenMpin={setOpenMpin}
                          billValue={billValue}
                          setBillValue={setBillValue}
                          err={err}
                        />
                      )}
                      {/* chrome auto error not showing in bbps here  */}
                      {fetchMandatory && fetchMandatory === "NOT_SUPPORTED" && (
                        <Button
                          type="submit"
                          form="bbpsForm"
                          className="btn-background"
                          sx={{
                            width: "100%",
                            mt: 1,
                          }}
                        >
                          {mpinVal ? "Pay Now" : "Continue"}
                        </Button>
                      )}
                    </FormControl>
                  </Grid>
                </>
              {/* )} */}
            </Grid>
          </Mount>
          <CommonMpinModal
            open={openMpin}
            setOpen={setOpenMpin}
            mPinCallBack={(mPinValue) => {
              setMpinVal(mPinValue);
            }}
          />
        </Box>
      </Grid>
    </>
  );
};

export default CMSView;
