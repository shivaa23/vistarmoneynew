import {
  Box,
  Button,
  Drawer,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import Loader from "../component/loading-screen/Loader";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { PATTERNS } from "../utils/ValidationUtil";
import { genders } from "../utils/constants";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  height: "max-ceontent",
  overflowY: "scroll",
  p: 2,
};

const NTAddRecModal = ({
  nepalAllRes,
  customerMobile,
  // token,
  // reqNo,
  getCustomerByMobileOrId,
}) => {
  // console.log("nepalAllRes", nepalAllRes);
  // const mobile =
  //   typeof nepalAllRes?.customer.Mobile === "string"
  //     ? nepalAllRes?.customer.Mobile
  //     : nepalAllRes?.customer.Mobile[0];
  const { customer } = nepalAllRes;
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  // console.log("payment", paymentMode);
  const [gender, setGender] = useState("");
  // const [gottenOTP, setGottenOTP] = useState(false);
  // const [otpRes, setOtpRes] = useState();
  // console.log("otpRes", otpRes);
  // const [OTP, setOTP] = useState("");
  const [validFields, setValidFields] = useState({
    name: true,
    number: true,
    otp: true,
    idnumber: true,
    accountNo: true,
  });

  const [relationships, setRelationships] = useState([]);
  const [chosenRelation, setChosenRelation] = useState("");

  const [bankReq, setBankReq] = useState(false);
  const [allBanks, setAllBanks] = useState([]);
  const [allDistricts, setallDistricts] = useState([]);
  const [allBanksOriginal, setAllBanksOriginal] = useState([]);
  const [bankBranchId, setBankBranchId] = useState("");
  // const [resendOtpData, setResendOtpData] = useState();
  // console.log("allDistricts", allDistricts);
  // console.log("bankBranchId", bankBranchId);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    // setGottenOTP(false);
    setAllBanksOriginal([]);
    setallDistricts([]);
    setAllBanks([]);
  };

  const getStaticData = (Type) => {
    postJsonData(ApiEndpoints.NEPAL_STATIC_DATA, { Type }, null, (res) => {
      // console.log("res", res.data.data);
      const data = res?.data?.data;
      if (Type === "Relationship") {
        setRelationships(data);
      }
    });
  };

  const getAllBanks = () => {
    postJsonData(
      ApiEndpoints.NEPAL_BANK_BRANCH,
      { Country: "NEPAL" },
      setBankReq,
      (res) => {
        const data = res?.data?.data;
        setAllBanksOriginal(data);
        let uniqueArr = [
          ...new Map(data.map((item) => [item["BankName"], item])).values(),
        ];
        // console.log("daa", uniqueArr);
        setAllBanks(uniqueArr);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const getDistricts = (code) => {
    setallDistricts([]);
    if (allBanksOriginal.length > 0) {
      const districts = allBanksOriginal.filter(
        (item) => item.BankName === code
      );

      setallDistricts(districts);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    let data = {};
    data = {
      CustomerId: customer.CustomerId,
      Name: form.name.value.toUpperCase(),
      Gender: gender,
      Mobile: form.mobile.value,
      Relationship: chosenRelation,
      Address: form.address.value,
      PaymentMode: paymentMode,
      BankBranchId:
        paymentMode === "Account Deposit" ? bankBranchId : undefined,
      AccountNumber:
        paymentMode === "Account Deposit" ? form.accno.value : undefined,
      // OTPProcessId: otpRes?.ProcessId,
      // OTP,
      // req_id: reqNo,
      // token,
    };

    // console.log("data", data);
    postJsonData(
      ApiEndpoints.NEPAL_CREATE_RECEIVER,
      data,
      setRequest,
      (res) => {
        const data = res.data;
        // console.log("res add rec", data);
        okSuccessToast(data.message);
        if (getCustomerByMobileOrId) {
          getCustomerByMobileOrId(customerMobile, "byNumber");
        }
        setTimeout(() => {
          handleClose();
        }, 200);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  // const getOtp = (e) => {
  //   e.preventDefault();
  //   const form = e.currentTarget;
  //   let data = {
  //     Operation: "CreateReceiver",
  //     Mobile: Array.isArray(customer?.Mobile?.string)
  //       ? customer?.Mobile?.string[0]
  //       : customer?.Mobile?.string,
  //     CustomerId: customer?.CustomerId,
  //     ReceiverName: form.name.value.toUpperCase(),
  //     PaymentMode: paymentMode,
  //     BankBranchId:
  //       paymentMode === "Account Deposit" ? bankBranchId : undefined,
  //     AccountNumber:
  //       paymentMode === "Account Deposit" ? form.accno.value : undefined,
  //   };
  //   setResendOtpData(data);
  //   postJsonData(
  //     ApiEndpoints.NEPAL_OTP,
  //     data,
  //     setRequest,
  //     (res) => {
  //       // console.log("res", res.data);
  //       if (!gottenOTP) {
  //         okSuccessToast(res?.data?.message);
  //         setOtpRes(res?.data);
  //       } else {
  //       }

  //       // setGottenOTP(true);
  //     },
  //     (err) => {
  //       apiErrorToast(err);
  //     }
  //   );
  // };

  // const resendOpt = (e) => {
  //   e.preventDefault();

  //   postJsonData(
  //     ApiEndpoints.NEPAL_OTP,
  //     resendOtpData,
  //     setRequest,
  //     (res) => {
  //       // console.log("res", res.data);
  //       if (!gottenOTP) {
  //         okSuccessToast(res?.data?.message);
  //         setOtpRes(res?.data);
  //       } else {
  //       }

  //       // setGottenOTP(true);
  //     },
  //     (err) => {
  //       apiErrorToast(err);
  //     }
  //   );
  // };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Button
        variant="text"
        onClick={handleOpen}
        size="small"
        sx={{
          color: "Dark-Blue",
          fontWeight: "bold",
          textTransform:"capitalize",
          fontSize: "10px",
          display: "flex", // Added to align items
          alignItems: "center", // Vertically center the icon and text
          '&:hover': {
            color: "Dark-Blue",
            backgroundColor: "#D8D8D8",
            borderRadius: 8,
          },
        }}
      >
                  <AddCircleIcon sx={{ mr: 1, fontSize: "16px" ,mb:0.5}} />

        <Loader loading={request} size="small" />
        Add Receiver
      </Button>
      <Drawer
        open={open}
        onClose={handleClose}
        anchor="right"
    
      >
        <Box sx={{
            width: 400,
            p: 2,
            height: "100%",
            boxShadow: 24,
            fontFamily: "Poppins",
            overflowY: "auto",
          }}
          role="presentation">
          <Loader loading={request} />
          <ModalHeader title="Add Receiver" subtitle="Empower Your Payments: Add a Receiver Today!" handleClose={handleClose} />
          <Box
            component="form"
            id="addreceiver"
            validate
            autoComplete="off"
            // onSubmit={gottenOTP ? handleSubmit : getOtp}
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
          >
            <Grid item md={12} xs={12}>
              <FormControl sx={{ width: "100%" }}>
                <TextField autoComplete="off"
                  label="Mobile"
                  id="mobile"
                  size="small"
                  type="number"
                  required
                  // error={!validFields.number}
                  // helperText={!validFields.number ? "Enter valid Mobile" : ""}
                  // onChange={(e) => {
                  //   setValidFields({
                  //     ...validFields,
                  //     number: PATTERNS.MOBILE.test(e.target.value),
                  //   });
                  //   if (e.target.value === "") {
                  //     setValidFields({
                  //       ...validFields,
                  //       number: true,
                  //     });
                  //   }
                  // }}
                />
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl sx={{ width: "100%" }}>
                <TextField autoComplete="off"
                  label="Name"
                  id="name"
                  size="small"
                  inputProps={{ style: { textTransform: "uppercase" } }}
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
                  // disabled={gottenOTP}
                />
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl sx={{ width: "100%" }}>
                <TextField autoComplete="off"
                  label="Payment Mode"
                  id="paymentMode"
                  size="small"
                  select
                  required
                  value={paymentMode}
                  onChange={(e) => {
                    setPaymentMode(e.target.value);
                  }}
                  // disabled={gottenOTP}
                >
                  <MenuItem value="Account Deposit">Account Deposit</MenuItem>
                  <MenuItem value="Cash Payment">Cash Payment</MenuItem>
                </TextField>
              </FormControl>
            </Grid>

            {paymentMode === "Account Deposit" && (
              <Grid item md={12} xs={12} sx={{ position: "relative" }}>
                <Loader loading={bankReq} size="small" />
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Select Bank"
                    id="bank"
                    size="small"
                    required
                    select
                    onFocus={() => {
                      if (allBanksOriginal.length < 1) {
                        getAllBanks();
                      }
                    }}
                    onChange={(e) => {
                      getDistricts(e.target.value);
                    }}
                  >
                    {allBanks.length > 1 &&
                      allBanks.map((item, index) => {
                        return (
                          <MenuItem value={item.BankName} key={index}>
                            {item.BankName}
                          </MenuItem>
                        );
                      })}
                  </TextField>
                </FormControl>
              </Grid>
            )}
            {paymentMode === "Account Deposit" && (
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Select District"
                    id="dis"
                    size="small"
                    required
                    select
                    value={bankBranchId}
                    onChange={(e) => {
                      setBankBranchId(e.target.value);
                    }}
                  >
                    {allDistricts.length > 0 &&
                      allDistricts.map((item, index) => {
                        return (
                          <MenuItem value={item.BankBranchId} key={index}>
                            {item.BranchName}
                          </MenuItem>
                        );
                      })}
                  </TextField>
                </FormControl>
              </Grid>
            )}
            {paymentMode === "Account Deposit" && (
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Account Number"
                    id="accno"
                    size="small"
                    required
                    error={!validFields.accountNo}
                    helperText={
                      !validFields.accountNo ? "Enter valid Account Number" : ""
                    }
                    // onChange={(e) => {
                    //   setValidFields({
                    //     ...validFields,
                    //     accountNo: PATTERNS.ACCOUNT_NUMBER.test(e.target.value),
                    //   });
                    //   if (e.target.value === "") {
                    //     setValidFields({
                    //       ...validFields,
                    //       accountNo: true,
                    //     });
                    //   }
                    // }}
                  />
                </FormControl>
              </Grid>
            )}
            {/* {gottenOTP && ( */}
            <Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Gender"
                    id="gender"
                    size="small"
                    select
                    required
                    value={gender}
                    onChange={(e) => {
                      setGender(e.target.value);
                    }}
                  >
                    {genders.map((item) => {
                      return (
                        <MenuItem value={item.value}>{item.label}</MenuItem>
                      );
                    })}
                  </TextField>
                </FormControl>
              </Grid>

              {/* <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Mobile"
                      id="mobile"
                      size="small"
                      required
                      error={!validFields.number}
                      helperText={
                        !validFields.number ? "Enter valid Mobile" : ""
                      }
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
                    />
                  </FormControl>
                </Grid> */}
              <Grid
                item
                md={12}
                xs={12}
                sx={{ display: "flex", justifyContent: "center", my: 1.5 }}
              >
                <FormControl
                  sx={{
                    width: { md: "97%", xs: "95%" },
                  }}
                >
                  <InputLabel id="relationship" sx={{ mt: -0.2 }}>
                    Relationship
                  </InputLabel>
                  <Select
                    label="Relationship"
                    id="relationship"
                    size="small"
                    required
                    select
                    value={chosenRelation}
                    onChange={(e) => setChosenRelation(e.target.value)}
                    onFocus={() => {
                      getStaticData("Relationship");
                    }}
                    MenuProps={{
                      variant: "menu",
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                        },
                      },
                    }}
                  >
                    {relationships.length > 1 &&
                      relationships?.map((item) => {
                        return (
                          <MenuItem value={item.Value}>{item.Label}</MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Address"
                    id="address"
                    size="small"
                    required
                    multiline
                    rows={2}
                  />
                </FormControl>
              </Grid>
              {/* pin input */}
              {/* <Grid
                item
                md={12}
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      margin: "8px 0",
                    }}
                  >
                    Enter OTP
                  </div>
                  <PinInput
                    length={6}
                    focus
                    type="password"
                    onChange={(value, index) => {
                      setOTP(value);
                    }}
                    inputMode="text"
                    autoSelect={false}
                    regexCriteria={/^[0-9]*$/}
                  />
                </FormControl>
              </Grid> */}
              {/* resend otp button */}
              {/* <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  pr: 2,
                  mt: 2,
                }}
              >
                <Button
                  onClick={(e) => resendOpt(e)}
                  variant="contained"
                  // className="otp-hover-purple"
                  sx={{
                    fontSize: "10px",
                    background: primaryColor(),
                    color: "#fff",
                    py: 0.5,
                    px: 1,
                    textTransform: "none",
                  }}
                >
                  Resend OTP
                </Button>
              </Box> */}
            </Grid>
            {/* )} */}
          </Box>
          <ModalFooter
            form="addreceiver"
            request={request}
            // btn={gottenOTP ? "Add Receiver" : "Get Otp"}
            btn="Add Receiver"
            disable={!validFields.name || !validFields.accountNo}
            // disable={!validFields.name}
          />
        </Box>
      </Drawer>
    </Box>
  );
};

export default NTAddRecModal;
