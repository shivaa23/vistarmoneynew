import * as React from "react";
import Box from "@mui/material/Box";
import {
  FormControl,
  Grid,
  TextField,
  IconButton,
  Tooltip,
  Button,
  Drawer,
  MenuItem,
} from "@mui/material";
import ApiEndpoints from "../network/ApiEndPoints";
import { get, postJsonData } from "../network/ApiController";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import numWords from "num-words";
import { useState } from "react";
import PinInput from "react-pin-input";
import ResetMpin from "./ResetMpin";
import { secondaryColor } from "../theme/setThemeColor";
import { Icon } from "@iconify/react";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";

const CreditRequestModal = ({ row, action = "status", refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [mpin, setMpin] = useState("");
  const [remarkVal, setRemarkVal] = useState("");
  const [remark, setRemark] = useState("");
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
const [data, setData] = useState("");
  const [customRemark, setCustomRemark] = useState(""); // To store the custom remark (when "Others" is selected)
  const [numberToWord, setNumberToWord] = useState(numWords(row.amount));
   const [transactionid, setTransactionId] = useState("");
  const remarkOptions = {
    0: "Amt Mismatch",
    1: "Reason",
    2: "Date Mismatch",
    3: "UTR/REF No. Mismatch",
    4: "Wrong Bank Selection",
    5: "Amt Already Approved",
    6: "Amt Already Approved to Others",
    7: "Payment Mode Wrong Selection",
    8: "Contact Your ASM Sales Person",
    9: "Slip Attachment Not Clear",
    10: "Slip Attachment Not Valid",
    11: "Amt Not Received",
  };
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
  const handleOpen = () => {
    setNumberToWord(numWords(row.amount));
    setOpen(true);
    setRemark("");
    transactionId();
  };
  const handleClose = () => {
    setOpen(false);
  };
  // console.log(remarkVal);

  const handleAmountChange = (event) => {
    console.log("handleAmountChange called", event.target.value);
    setNumberToWord(numWords(event.target.value));
  };

  const handleRemarkChange = (event) => {
    const value = event.target.value;
    setRemark(value);

    if (value !== "other") {
      setCustomRemark("");
    }
  };

  const handleCustomRemarkChange = (e) => {
    const value = e.target.value;

    setCustomRemark(value);
    if (value.trim() === "") {
      setRemark("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
  
    // Determine the remark text
    let remarkText = remark === "other" ? customRemark : remarkOptions[remark];
    if (action === "APPROVE") {
      remarkText = remarkVal;
    }
  
    console.log("Action:", action);
    console.log("Remark Text:", remarkText);
    console.log("Remark Option:", remark);
  
    const data = {
      id: row?.id || "", // Handle cases where row or id might be undefined
      amount: form.amt?.value || "", // Safely access form values
      remark: remarkText, // Use the resolved remark text
      action: action || "", // Ensure action has a fallback
      txn_id: form.ref_id?.value || "", // Safely access transaction ID
      mpin: mpin || "", // Ensure mpin has a fallback
    };
  
    setRequest(true);
  
    postJsonData(
      ApiEndpoints.CRED_REQ_APPROVE,
      data,
      setRequest,
      (response) => {
        const successMessage = data.action === "REJECT"
          ? "Request cancelled successfully"
          : "Request processed successfully";
  
        okSuccessToast(successMessage);
        handleClose();
        if (refresh) refresh();
      },
      (error) => {
        console.error("Error during request:", error);
        apiErrorToast(error);
      }
    );
  };
  

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 0.4,
      }}
    >
      {action && action === "APPROVE" && (
        <Tooltip title="Approve">
          <IconButton
            onClick={handleOpen}
            sx={{
              color: "#32b83b",
              "&:hover": {
                color: "#00A300",

                transform: "scale(1)",
              },
            }}
          >
            <Icon icon="charm:square-tick" width={25} height={25} />
          </IconButton>
        </Tooltip>
      )}
{(user?.role === "Dd" || user?.role === "Ret" || user?.role === "AD" || user?.role === "Md") && 
  action === "REOPEN" && (
  <Tooltip title="Re-Request">
    <Button
      className="button-red"
      sx={{ fontSize: "10px", background: secondaryColor() }}
      variant="contained"
      onClick={handleOpen}
    >
      Re-Open
    </Button>
  </Tooltip>
)}


      {action && action === "REJECT" && (
        <Tooltip title="Reject">
          <IconButton
            onClick={handleOpen}
            sx={{
              color: "#e01a1a",
              "&:hover": {
                color: "#F10000",
                transform: "scale(1)",
              },
            }}
          >
            <Icon icon="charm:square-cross" width={25} height={25} />
          </IconButton>
        </Tooltip>
      )}
      <Box>
        <Drawer open={open} anchor="right" onClose={handleClose}>
          <Box sx={{ width: 400 }} className="sm_modal">
            <ModalHeader
              subtitle="Take Action: Quick and Simple Fund Request!"
              title={`${action} (${row.name})`}
              handleClose={handleClose}
            />
            {action && action !== "APPROVE" ? (
              <Box
                component="form"
                id="cred_req"
                validate
                autoComplete="off"
                onSubmit={handleSubmit}
                sx={{
                  "& .MuiTextField-root": { m: 2 },
                  objectFit: "contain",
                  overflowY: "scroll",
                }}
              >
                <Grid container sx={{ pt: 1 }}>
                  <Grid item md={12} xs={12}>
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
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="Amount"
                        // defaultValue={row.amount}
                        inputProps={{ readOnly: true }}
                        value={row.amount}
                        id="amt"
                        onChange={handleAmountChange}
                        size="small"
                        required
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="Amount in Words"
                        id="inWords"
                        // defaultValue={numWords(row.amount)}
                        // defaultValue={numberToWord}
                        value={numberToWord}
                        inputProps={{ readOnly: true }}
                        size="small"
                        required
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <FormControl sx={{ width: "100%" }}>
                      {remark !== "other" ? (
                        <TextField
                          autoComplete="off"
                          label="Remark"
                          select
                          id="remark"
                          size="small"
                          value={remark}
                          onChange={handleRemarkChange}
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
                          <MenuItem value="9">
                            Slip Attachment Not Clear
                          </MenuItem>
                          <MenuItem value="10">
                            Slip Attachment Not Valid
                          </MenuItem>
                          <MenuItem value="11">Amt Not Received</MenuItem>
                          <MenuItem value="other">Others</MenuItem>
                        </TextField>
                      ) : (
                        <TextField
                          autoComplete="off"
                          type="text" // This ensures the field accepts text input
                          label="Enter Custom Remark"
                          id="custom-remark"
                          size="small"
                          value={customRemark}
                          onChange={handleCustomRemarkChange}
                          required
                        />
                      )}
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        M-PIN
                      </div>
                      <PinInput
                        length={6}
                        focus
                        type="password"
                        onChange={(value, index) => {
                          setMpin(value);
                        }}
                        inputMode="text"
                        autoSelect={false}
                        regexCriteria={/^[0-9]*$/}
                      />
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    md={12}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      pr: 12,
                      mt: 2,
                    }}
                  >
                    <Box sx={{ mr: 4 }}>
                      <ResetMpin variant="text" />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box
                component="form"
                id="cred_req"
                autoComplete="off"
                validate
                onSubmit={handleSubmit}
                sx={{
                  "& .MuiTextField-root": { m: 2 },
                  objectFit: "contain",
                  overflowY: "scroll",
                }}
              >
                <Grid container sx={{ pt: 1 }}>
                  <Grid item md={12} xs={12}>
                    {/* <FormControl sx={{ width: "100%" }}>
                      <TextField autoComplete="off"
                        label="Amount"
                        defaultValue={row.amount} // amountField
                        id="amt"
                        size="small"
                        required
                      />
                    </FormControl> */}
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="Amount"
                        defaultValue={row.amount}
                        id="amt"
                        inputProps={{ maxLength: 9, type: "number" }}
                        onChange={handleAmountChange}
                        size="small"
                        required
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={12} xs={12}>
                    {/* <FormControl sx={{ width: "100%" }}>
                      <TextField autoComplete="off"
                        label="Amount in Words"
                        id="inWords"
                        defaultValue={numWords(row.amount)} // Word Field
                        size="small"
                        required
                      />
                    </FormControl> */}
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="Amount in Words"
                        id="inWords"
                        // defaultValue={numWords(row.amount)}
                        // defaultValue={numberToWord}
                        value={numberToWord}
                        size="small"
                        required
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="Remarks"
                        id="remarks"
                        size="small"
                        onChange={(e) => {
                          setRemarkVal(e.target.value);
                        }}
                        required
                        inputProps={{
                          autoFocus: "off",
                          form: {
                            autoComplete: "off",
                          },
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        M-PIN
                      </div>
                      <PinInput
                        length={6}
                        type="password"
                        onChange={(value, index) => {
                          setMpin(value);
                        }}
                        inputMode="text"
                        regexCriteria={/^[0-9]*$/}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      pr: 12,
                      mt: 2,
                    }}
                  >
                    <Box sx={{ mr: 4 }}>
                      <ResetMpin variant="text" />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            <Box sx={{ mr: "5px" }}>
              <ModalFooter form="cred_req" type="submit" request={request} />
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};
export default CreditRequestModal;
