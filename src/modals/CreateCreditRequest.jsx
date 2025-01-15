import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import {
  FormControl,
  Grid,
  TextField,
  Tooltip,
  IconButton,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Modal,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { get, post, postJsonData } from "../network/ApiController"; // Ensure this handles `FormData`
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState, useEffect } from "react";
import numWords from "num-words";
import { creditReqGuidelinesImg } from "../iconsImports";
import { whiteColor } from "../theme/setThemeColor";
import LogoComponent from "../component/LogoComponent";
import { useNavigate } from "react-router-dom";

const CreateCreditRequest = ({ refresh, row }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [dateValue, setDateValue] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [bank, setBank] = useState("");
  const [fileValue, setFileValue] = useState(null);
  const [numToWords, setNumToWords] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [remark, setRemark] = useState("");
  const [amount, setAmount] = useState("");
  const [bankList, setBankList] = useState([]);
  const [modeList, setModeList] = useState([]);
  const [mode, setMode] = useState("");
  const [customRemark, setCustomRemark] = useState(""); // To store the custom remark (when "Others" is selected)
  const [modelOpen, setModelOpen] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState("");
  const [transactionid, setTransactionId] = useState("");
  const transactionId = () => {
    get(
      ApiEndpoints.GET_TXN_ID_CR_REQUEST,
      "",
      setRequest,
      (res) => {
        if (res && res.data) {
          setData(res.data);
          setTransactionId(res.data);
        } else {
          console.error("Invalid response data:", res);
        }
      },
      (err) => {
        console.error("Network Error:", err);
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  const resetForm = () => {
    setBank("");
    setMode("");
    setDateValue("");
    setFileValue(null);
    setErrorMessage("");
    setNumToWords(null);
    setAgreeTerms(false);
    setReferenceId("");
    setRemark("");
    setAmount("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileValue(file);
  };
  const handleNavigation = () => {
    const queryString = new URLSearchParams({
      amount,
      referenceId,
      bank,
      mode,
      remark,
      dateValue,
      transactionid
    }).toString();
    window.open(`/indemnityLetter?${queryString}`, "_blank");
  };

  const getCredDataList = () => {
    get(
      ApiEndpoints.GET_BANK_CREDIT_REQ,
      "",
      setRequest,
      (res) => {
        if (res && res.data) {
          setBankList(res.data.data.banks);
          setModeList(res.data.data.modes);
          setOpen(true);
        } else {
          apiErrorToast("Error fetching bank/mode data.");
        }
      },
      (error) => {
        apiErrorToast("Error: ", error);
      }
    );
  };

  React.useEffect(() => {
    resetForm();
    const today = new Date().toISOString().split("T")[0];
    setDateValue(today);
  }, [open]);

  const handleModelOpen = () => {
    setModelOpen(true);
  };
  const handleModelClose = () => {
    setModelOpen(false);
    if (refresh) refresh();
  };
  const handleOpen = () => {
    setModelOpen(false);
    getCredDataList();
    transactionId();
  };
  const handleCustomRemarkChange = (e) => {
    setCustomRemark(e.target.value);
  };
  const handleClose = () => {
    resetForm();
    setOpen(false);
    if (refresh) refresh();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("bank_name", bank);
    formData.append("mode", mode);
    formData.append("bank_ref_id", referenceId);
    formData.append("date", dateValue);
    formData.append("amount", amount);
    formData.append("remark", remark);
    formData.append("req_id", transactionid);

    // Append file if available
    if (fileValue) {
      formData.append("request_image", fileValue);
    }

    setRequest(true);

    postJsonData(
      ApiEndpoints.CREDIT_REQ,
      formData,
      setRequest,
      (res) => {
        okSuccessToast("Request Created successfully");
        handleClose();
        if (refresh) refresh();
      },
      (error) => {
        setErrorMessage(error.response.data.message);
      }
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Tooltip title="Credit Request">
        <Button
          variant="outlined"
          className="refresh-icon-risk"
          onClick={handleModelOpen}
          startIcon={
            <IconButton
              sx={{
                p: 0,
                color: whiteColor(),
              }}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          }
        >
          Request
        </Button>
      </Tooltip>
      <Modal open={modelOpen} onClose={handleModelClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <ModalHeader title=" Fund Request Guideline" />

          <Typography variant="body2" sx={{ mb: 4 }}>
            1. The Fund request/ approval of fund request will not be allowed
            after 2 Months from the date of deposit.
          </Typography>
          <Typography variant="body2" sx={{ mb: 4 }}>
            2. The proper records of Fund Request(s), slips, Ref no etc shall
            keep handy by the user of portal/ platform for the purpose of
            Reconciliation purpose of the company (Dillipay Technologies Ltd)
            for 12 months from the date of Deposit.
          </Typography>
          <Typography variant="body2" sx={{ mb: 4 }}>
            3. The user of portal/ platform shall agree all the terms,
            conditions, points of the Annexure-III as attached in Downloads
            section.
          </Typography>
          <Grid container alignItems="center" sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <LogoComponent />
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleModelClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpen}
                >
                  Proceed
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Drawer anchor="right" open={open} onClose={handleClose}>
        <Box
          sx={{
            width: 400,
            p: 2,
            height: "100%",
            boxShadow: 24,
            fontFamily: "Poppins",
            overflowY: "auto",
          }}
          role="presentation"
        >
          <ModalHeader
            title="Add Credit Request"
            handleClose={handleClose}
            subtitle="Quickly Request Credit with DilliPay Now!"
          />
          <Box
            component="form"
            id="createCreditReq"
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
          >
            <Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Transaction Id"
                    id="ref_id"
                    size="small"
                    required
                    value={transactionid}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    select
                    value={bank || ""}
                    onChange={(e) => setBank(e.target.value)}
                    id="bank"
                    label="Select Bank"
                    size="small"
                    required
                  >
                    <MenuItem dense value="select">
                      Select
                    </MenuItem>
                    {bankList &&
                      bankList.map((item, index) => (
                        <MenuItem
                          dense
                          key={index}
                          value={item.name}
                          sx={{ fontSize: "12px" }}
                        >
                          {item.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    select
                    value={mode || ""}
                    onChange={(e) => setMode(e.target.value)}
                    id="mode"
                    label="Select Mode"
                    size="small"
                    required
                  >
                    <MenuItem dense value="select">
                      Select
                    </MenuItem>
                    {modeList &&
                      modeList.map((item, index) => (
                        <MenuItem
                          dense
                          key={index}
                          value={item}
                          sx={{ fontSize: "12px" }}
                        >
                          {item}
                        </MenuItem>
                      ))}
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Reference Id"
                    id="ref_id"
                    size="small"
                    required
                    value={referenceId} // Add referenceId to form data
                    onChange={(e) => setReferenceId(e.target.value)} // Handle referenceId change
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Remark"
                    id="remark"
                    size="small"
                    required
                    value={remark} // Add referenceId to form data
                    onChange={(e) => setRemark(e.target.value)} // Handle referenceId change
                  />
                </FormControl>

                {/* <FormControl sx={{ width: "100%" }}>
                  {remark !== "other" ? (
                    <TextField
                      autoComplete="off"
                      select
                      label="Remark"
                      id="remark"
                      size="small"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)} // Handle referenceId change
                      required
                    >
                      <MenuItem value="1">Reason</MenuItem>
                      <MenuItem value="0">Amt Mismatch</MenuItem>
                      <MenuItem value="2">Date Mismatch</MenuItem>
                      <MenuItem value="3">UTR/REF No. Mismatch</MenuItem>
                      <MenuItem value="4">Wrong Bank Selection</MenuItem>
                      <MenuItem value="5">Amt Already Approved</MenuItem>
                      <MenuItem value="6">
                        Amt Already Approved to Others
                      </MenuItem>
                      <MenuItem value="7">
                        Payment Mode Wrong Selection
                      </MenuItem>
                      <MenuItem value="8">
                        Contact Your ASM Sales Person
                      </MenuItem>
                      <MenuItem value="9">Slip Attachment Not Clear</MenuItem>
                      <MenuItem value="10">Slip Attachment Not Valid</MenuItem>
                      <MenuItem value="10">Amt Not Recieved</MenuItem>
                      <MenuItem value="other">Others</MenuItem>
                    </TextField>
                  ) : (
                    <TextField
                      autoComplete="off"
                      label="Enter Custom Remark"
                      id="custom-remark"
                      size="small"
                      value={customRemark}
                      onChange={handleCustomRemarkChange}
                      // onChange={(e) => setRemark(e.target.value)} // Handle referenceId change
                      fullWidth
                      required
                    />
                  )}
                </FormControl> */}
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Select Date"
                    id="date"
                    size="small"
                    type="date"
                    value={dateValue}
                    onChange={(e) => setDateValue(e.target.value)} // Date selection logic
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Amount"
                    id="amt"
                    size="small"
                    type="number"
                    value={amount} // Amount value for form submission
                    onChange={(e) => setAmount(e.target.value)} // Handle amount change
                    InputProps={{
                      inputProps: {
                        max: 10000000,
                        min: 100,
                      },
                    }}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sx={{ mx: 2 }}>
                <span style={{ color: "green" }}>
                  {numToWords ? numToWords : ""}
                </span>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label=""
                    id="file_upload"
                    size="small"
                    type="file"
                    variant="standard"
                    onChange={handleFileChange} // File upload handler
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      border: "none",
                    }}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
                sx={{ width: "100%", color: "red", mx: 2 }}
              >
                {errorMessage ? errorMessage : ""}
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      name="agree"
                      disabled={
                        !bank ||
                        !mode ||
                        !referenceId ||
                        !remark ||
                        !dateValue ||
                        !amount ||
                        !fileValue
                      }
                    />
                  }
                  label={
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          bank &&
                          mode &&
                          referenceId &&
                          remark &&
                          dateValue &&
                          amount &&
                          fileValue
                        ) {
                          handleNavigation();
                        } else {
                          apiErrorToast(
                            "Please fill all required fields before proceeding."
                          );
                        }
                      }}
                      disabled={
                        !bank ||
                        !mode ||
                        !referenceId ||
                        !remark ||
                        !dateValue ||
                        !amount ||
                        !fileValue
                      }
                    >
                      I agree to the terms and conditions
                    </button>
                  }
                />
              </Grid>
              <Grid container alignItems="center" sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <LogoComponent />
                </Grid>
                <Grid item xs={6} sx={{ textAlign: "right" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    form="createCreditReq"
                    disabled={!agreeTerms}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default CreateCreditRequest;
