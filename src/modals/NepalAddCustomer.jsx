import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import Loader from "../component/loading-screen/Loader";
import { useEffect } from "react";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { get, postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import moment from "moment";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import {
  SourceIncomeType,
  annualIncome,
  customerType,
  genders,
} from "../utils/constants";
import { PATTERNS } from "../utils/ValidationUtil";
import { useRef } from "react";
import ExpandCircleDownOutlinedIcon from "@mui/icons-material/ExpandCircleDownOutlined";
import CommonHoverPopOpen from "../component/CommonHoverPopOpen";
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

const NepalAddCustomer = ({
  modelOpenHook,
  setMobile,
  mobileNum,
  setNewCustomer,
  getCustomerByMobileOrId,
}) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [dateOfB, setDateOfB] = useState(null);
  const [gottenOTP, setGottenOTP] = useState(false);
  const [otpRes, setOtpRes] = useState();
  const [allStates, setallStates] = useState([]);
  const [allStatesOriginal, setAllStatesOriginal] = useState([]);
  // console.log("allStates", allStates);
  const [allDistricts, setallDistricts] = useState([]);

  const [formattedDate, setFormattedDate] = useState("");
  const [stateReq, setStateReq] = useState(false);

  const [nationality, setNationality] = useState([]);
  const [IdType, setIdType] = useState([]);
  // all dropDown hooks
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [nationalityV, setNationalityV] = useState("");
  const [gender, setGender] = useState("");
  const [IdTypeV, setIdTypeV] = useState("");
  const [customerTypeV, setCutomerTypeV] = useState("");
  const [sourceInc, setSourceInc] = useState("");
  const [annualInc, setAnnualInc] = useState("");
  // validation hook
  const [validFields, setValidFields] = useState({
    name: true,
    number: true,
    otp: true,
    idnumber: true,
  });

  // last section ref

  const befLast = useRef();
  const handleClose = () => {
    // setOpen(false);
    setNewCustomer(false)
    setGottenOTP(false);
    setDateOfB(null);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    let data = {
      Name: form.name.value,
      Mobile: form.number.value,
      Dob: formattedDate,
      OTP: form.otp.value,
      OTPProcessId: otpRes?.ProcessId,
      State: state,
      District: district,
      Address: form.address.value,
      City: form.city.value,
      Nationality: nationalityV,
      Gender: gender,
      Employer: form.employer.value,
      IDType: IdTypeV,
      IDNumber: form.id_number.value,
      CustomerType: customerTypeV,
      IncomeSource: form.inc_source.value,
      SourceIncomeType: sourceInc,
      AnnualIncome: annualInc,
    };

    postJsonData(
      ApiEndpoints.NEPAL_CREATE_CUSTOMER,
      data,
      setRequest,
      (res) => {
        okSuccessToast(res.data.message);
        if (setMobile) setMobile(data.Mobile);
        getCustomerByMobileOrId(data.Mobile, "byMobile");
        handleClose();
      },
      (err) => {
        apiErrorToast(err);
        // getCustomerByMobileOrId(data.Mobile, "byMobile");
      }
    );
  };

  const getAddCusOtp = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    postJsonData(
      ApiEndpoints.NEPAL_OTP,
      {
        name: form.name.value,
        Mobile: form.number.value,
        dob: formattedDate,
        Operation: "CreateCustomer",
      },
      setRequest,
      (res) => {
        if (!gottenOTP) {
          okSuccessToast(res?.data?.message);
          setOtpRes(res?.data);
        } else {
        }

        setGottenOTP(true);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const getStates = () => {
    get(
      ApiEndpoints.NEPAL_STATE_DIS,
      "",
      setStateReq,
      (res) => {
        const data = res.data.data;
        setAllStatesOriginal(data);
        let uniqueArr = [
          ...new Map(data.map((item) => [item["StateCode"], item])).values(),
        ];
        setallStates(uniqueArr);
      },
      (err) => {
        // apiErrorToast(err);
      }
    );
  };

  const getDistricts = (code) => {
    setallDistricts([]);
    if (allStatesOriginal.length > 0) {
      const districts = allStatesOriginal.filter((item) => item.State === code);
      setallDistricts(districts);
    }
  };

  const getStaticData = (Type) => {
    postJsonData(
      ApiEndpoints.NEPAL_STATIC_DATA,
      { Type },
      null,
      (res) => {
        const staticData = res?.data?.data;
        if (Type === "Nationality") {
          // if res is array or not
          if (staticData.length > 0) {
            setNationality(staticData);
          } else {
            setNationality([staticData]);
          }
        } else if (Type === "IDType") {
          if (staticData.length > 0) {
            setIdType(staticData);
          } else {
            setIdType([staticData]);
          }
        } else {
          //  no actual use of this else , but just not to keep it empty
          setNationality([]);
          setIdType([]);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  useEffect(() => {
    if (modelOpenHook === "Add") {
      setOpen(true);
    }
  }, [modelOpenHook]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      {open && (
        <Box>
          <Loader loading={request} />
          <ModalHeader title="Add Customer" subtitle="Join the Network: Register Your Nepal Account with DilliPay!" handleClose={handleClose} />
          <Box
            component="form"
            id="nepal_add_cus"
            validate
            autoComplete="off"
            onSubmit={gottenOTP ? handleSubmit : getAddCusOtp}
            sx={{
              "& .MuiTextField-root": { m: 2 },
            }}
          >
            <Grid container sx={{ pt: 1 }}>
              <Grid
                item
                md={4}
                xs={12}
                lg={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl fullWidth>
                  <TextField
                    autoComplete="off"
                    label="Name"
                    id="name"
                    size="small"
                    required
                    error={!validFields.name}
                    helperText={!validFields.name ? "Enter valid Name" : ""}
                    onChange={(e) => {
                      setValidFields({
                        ...validFields,
                        name: PATTERNS.NAME.test(e.target.value),
                      });
                      if (e.target.value === "") {
                        setValidFields({
                          ...validFields,
                          name: true,
                        });
                      }
                    }}
                    disabled={gottenOTP}
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                md={4}
                xs={12}
                lg={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl fullWidth>
                  <TextField
                    autoComplete="off"
                    label="Mobile"
                    id="number"
                    size="small"
                    required
                    defaultValue={mobileNum.number}
                    // this below is just validations
                    error={!validFields.number}
                    helperText={!validFields.number ? "Enter valid Mobile" : ""}
                    onChange={(e) => {
                      setValidFields({
                        ...validFields,
                        number: PATTERNS.MOBILE.test(e.target.value),
                      });

                      if (e.target.value === "") {
                        setValidFields({
                          ...validFields,
                          number: true,
                        });
                      }
                    }}
                    disabled={gottenOTP}
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                md={4}
                xs={12}
                lg={6}
                sx={{ display: "flex", justifyContent: "flex-start" }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="Select DOB"
                    disabled={gottenOTP}
                    // mask="____/__/__"
                    disableFuture={true}
                    inputFormat="YYYY-MM-DD"
                    value={dateOfB}
                    onChange={(newValue) => {
                      // const date = new Date();

                      setDateOfB(newValue);

                      setFormattedDate(
                        moment(newValue["$d"]).format("YYYY-MM-DD")
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        autoComplete="off"
                        size="small"
                        required
                        {...params}
                        variant="standard"
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            {gottenOTP && (
              <Grid
                container
                sx={{ height: "50vh", overflowY: "scroll", mt: 3 }}
                id="fullModal"
              >
                <Typography sx={{ fontWeight: "600", ml: 2 }}>OTP</Typography>
                {/* OTP */}
                <div ref={befLast} style={{ width: "100%" }} id="otpSec">
                  <Grid container md={12} sx={{ mb: 3 }}>
                    <Grid
                      item
                      md={4}
                      xs={12}
                      // sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <FormControl fullWidth>
                        <TextField
                          autoComplete="off"
                          label="Enter OTP"
                          id="otp"
                          size="small"
                          required
                          variant="standard"
                          error={!validFields.otp}
                          helperText={!validFields.otp ? "Enter valid OTP" : ""}
                          onChange={(e) => {
                            setValidFields({
                              ...validFields,
                              otp: PATTERNS.OTP.test(e.target.value),
                            });
                            if (e.target.value === "") {
                              setValidFields({
                                ...validFields,
                                otp: true,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </div>
                <Typography sx={{ fontWeight: "600", ml: 2 }}>
                  PERSONAL DETAILS
                </Typography>
                {/* personal details */}

                <Grid
                  container
                  md={12}
                  sx={{
                    mb: 3,
                  }}
                >
                  {/* gender */}
                  <Grid
                    item
                    md={4}
                    xs={12}
                    // sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl fullWidth>
                      <TextField
                        autoComplete="off"
                        label="Gender"
                        id="gender"
                        size="small"
                        required
                        select
                        variant="standard"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        {genders.map((item) => {
                          return (
                            <MenuItem value={item.value}>{item.label}</MenuItem>
                          );
                        })}
                      </TextField>
                    </FormControl>
                  </Grid>
                  {/* Nationality */}
                  <Grid
                    item
                    md={4}
                    xs={12}
                    // sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl fullWidth>
                      <TextField
                        autoComplete="off"
                        label="Nationality"
                        id="nationality"
                        size="small"
                        required
                        select
                        variant="standard"
                        value={nationalityV}
                        onChange={(e) => setNationalityV(e.target.value)}
                        onFocus={() => getStaticData("Nationality")}
                      >
                        <MenuItem value="Select">
                          {" "}
                          <div style={{ textAlign: "left" }}>Select</div>
                        </MenuItem>
                        {nationality.length > 0 &&
                          nationality.map((item) => {
                            return (
                              <MenuItem value={item.Value}>
                                {" "}
                                <div style={{ textAlign: "left" }}>
                                  {item.Label}
                                </div>
                              </MenuItem>
                            );
                          })}
                      </TextField>
                    </FormControl>
                  </Grid>
                  {/* state */}
                  <Grid
                    item
                    md={4}
                    xs={12}
                    sx={{
                      position: "relative",
                    }}
                  >
                    <Loader loading={stateReq} size="small" />
                    <FormControl fullWidth>
                      <TextField
                        autoComplete="off"
                        label="State"
                        id="state"
                        size="small"
                        required
                        select
                        variant="standard"
                        value={state}
                        onChange={(e) => {
                          setState(e.target.value);
                          getDistricts(e.target.value);
                        }}
                        onFocus={() => getStates()}
                      >
                        <MenuItem value="select">
                          <div style={{ textAlign: "left" }}>Select</div>
                        </MenuItem>
                        {allStates.length > 0 &&
                          allStates.map((item) => {
                            return (
                              <MenuItem value={item.State}>
                                <div style={{ textAlign: "left" }}>
                                  {item.State}
                                </div>
                              </MenuItem>
                            );
                          })}
                      </TextField>
                    </FormControl>
                  </Grid>
                  {/* district */}
                  <Grid
                    item
                    md={4}
                    xs={12}
                    // sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl fullWidth>
                      <TextField
                        autoComplete="off"
                        label="District"
                        id="district"
                        size="small"
                        required
                        select
                        variant="standard"
                        value={district}
                        onChange={(e) => {
                          setDistrict(e.target.value);
                        }}
                      >
                        <MenuItem value="select">
                          <div style={{ textAlign: "left" }}>Select</div>
                        </MenuItem>
                        {allDistricts.length > 0 &&
                          allDistricts.map((item) => {
                            return (
                              <MenuItem value={item.District}>
                                <div style={{ textAlign: "left" }}>
                                  {item.District}
                                </div>
                              </MenuItem>
                            );
                          })}
                      </TextField>
                    </FormControl>
                  </Grid>
                  {/* city */}
                  <Grid
                    item
                    md={4}
                    xs={12}
                    // sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl fullWidth>
                      <TextField
                        autoComplete="off"
                        label="City"
                        id="city"
                        size="small"
                        required
                        variant="standard"
                      />
                    </FormControl>
                  </Grid>
                  {/* address */}
                  <Grid
                    item
                    md={8}
                    xs={12}
                    // sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl fullWidth>
                      <TextField
                        autoComplete="off"
                        label="Address"
                        id="address"
                        size="small"
                        variant="standard"
                        required
                        multiline
                        rows={2}
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <Typography sx={{ fontWeight: "600", ml: 2 }}>
                  OTHER DETAILS
                </Typography>
                {/* other details */}
                <div id="lastSec" style={{ width: "100%" }}>
                  <Grid
                    container
                    md={12}
                    sx={{
                      mb: 3,
                    }}
                  >
                    {/* Employer */}
                    <Grid
                      item
                      md={4}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl fullWidth>
                        <TextField
                          autoComplete="off"
                          label="Employer"
                          id="employer"
                          size="small"
                          required
                          variant="standard"
                          value="SELF"
                        />
                      </FormControl>
                      <CommonHoverPopOpen text="Name of Company Where Sender Works OR SELF" />
                    </Grid>
                    {/* id type */}
                    <Grid
                      item
                      md={4}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl fullWidth>
                        <TextField
                          autoComplete="off"
                          label="ID Type"
                          id="id_type"
                          size="small"
                          required
                          select
                          variant="standard"
                          value={IdTypeV}
                          onChange={(e) => setIdTypeV(e.target.value)}
                          onFocus={() => getStaticData("IDType")}
                        >
                          <MenuItem value="Select">
                            {" "}
                            <div style={{ textAlign: "left" }}>Select</div>
                          </MenuItem>
                          {IdType.length > 0 &&
                            IdType.map((item) => {
                              return (
                                <MenuItem value={item.Value}>
                                  {" "}
                                  <div style={{ textAlign: "left" }}>
                                    {item.Label}
                                  </div>
                                </MenuItem>
                              );
                            })}
                        </TextField>
                      </FormControl>
                    </Grid>
                    {/* ID Number */}
                    <Grid
                      item
                      md={4}
                      xs={12}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <FormControl fullWidth>
                        <TextField
                          autoComplete="off"
                          label="ID Number"
                          id="id_number"
                          size="small"
                          required
                          variant="standard"
                          error={!validFields.idnumber}
                          helperText={
                            !validFields.idnumber
                              ? `Enter valid ${IdTypeV}`
                              : ""
                          }
                          onChange={(e) => {
                            setValidFields({
                              ...validFields,
                              idnumber:
                                IdTypeV === "Aadhaar Card"
                                  ? PATTERNS.AADHAAR.test(e.target.value)
                                  : true,
                            });
                            if (e.target.value === "") {
                              setValidFields({
                                ...validFields,
                                idnumber: true,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    {/* customer type */}
                    <Grid
                      item
                      md={4}
                      xs={12}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <FormControl fullWidth>
                        <TextField
                          autoComplete="off"
                          label="Customer Type"
                          id="customer_type"
                          size="small"
                          required
                          select
                          variant="standard"
                          value={customerTypeV}
                          onChange={(e) => setCutomerTypeV(e.target.value)}
                        >
                          {customerType.map((item) => {
                            return (
                              <MenuItem value={item.value}>
                                <div style={{ textAlign: "left" }}>
                                  {item.label}
                                </div>
                              </MenuItem>
                            );
                          })}
                        </TextField>
                      </FormControl>
                    </Grid>
                    {/* inc source */}
                    <Grid
                      item
                      md={4}
                      xs={12}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <FormControl fullWidth>
                        <TextField
                          autoComplete="off"
                          label="Income Source"
                          id="inc_source"
                          size="small"
                          required
                          variant="standard"
                          value="SALARY"
                        />
                      </FormControl>
                    </Grid>
                    {/* Source Income Type */}
                    <Grid
                      item
                      md={4}
                      xs={12}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <FormControl fullWidth>
                        <TextField
                          autoComplete="off"
                          label="Source Income Type"
                          id="source_income_type"
                          size="small"
                          required
                          select
                          variant="standard"
                          value={sourceInc}
                          onChange={(e) => setSourceInc(e.target.value)}
                        >
                          {SourceIncomeType.map((item) => {
                            return (
                              <MenuItem value={item.value}>
                                <div style={{ textAlign: "left" }}>
                                  {item.label}
                                </div>
                              </MenuItem>
                            );
                          })}
                        </TextField>
                      </FormControl>
                    </Grid>
                    {/* annual income */}
                    <Grid
                      item
                      md={4}
                      xs={12}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <FormControl fullWidth>
                        <TextField
                          autoComplete="off"
                          label="Annual Income"
                          id="annual_income"
                          size="small"
                          required
                          select
                          variant="standard"
                          value={annualInc}
                          onChange={(e) => setAnnualInc(e.target.value)}
                        >
                          {annualIncome.map((item) => {
                            return (
                              <MenuItem value={item.value}>
                                <div style={{ textAlign: "left" }}>
                                  {item.label}
                                </div>
                              </MenuItem>
                            );
                          })}
                        </TextField>
                      </FormControl>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            )}
          </Box>
          <ModalFooter
            loadingInButton={false}
            form="nepal_add_cus"
            request={request}
            btn={gottenOTP ? "Add" : "Get OTP"}
            disable={
              gottenOTP
                ? !validFields.otp || !validFields.idnumber
                : !validFields.name || !validFields.number
            }
          />

          {gottenOTP && (
            <ExpandCircleDownOutlinedIcon
              className="open-button-wp"
              sx={{
                bottom: "80px",
                right: "32px",
                background: "#4045A1",
                fontSize: "36px",
              }}
              onClick={() => {
                let ele = document.getElementById("lastSec");
                if (ele) {
                  ele.scrollIntoView({ behavior: "smooth" });
                }
              }}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default NepalAddCustomer;
