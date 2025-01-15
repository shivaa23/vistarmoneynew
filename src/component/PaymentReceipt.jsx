import "../scss/PaymentReceipt.css";
import { toInt } from "../utils/TextUtil";
import { datemonthYear, myDateDDMMyy } from "../utils/DateUtils";
import { numIn2Dec } from "../utils/RupeeUtil";
import LogoComponent from "./LogoComponent";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";
import PrintIcon from "@mui/icons-material/Print";
import { useEffect } from "react";
import { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
} from "@mui/material";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TableContainer,
} from "@mui/material";
import { LocationOn, Email, Phone } from "@mui/icons-material";
import { breakAmt } from "../utils/MTBreakAmtUtil";
import { numberToWord } from "../utils/FormattingUtils";
import { useLocation } from "react-router-dom";

let row_data = [];
// let rowMapping = [];
let totalAmount = 0;
let dateToday = new Date();
let date = dateToday.getDate();
let month = dateToday.getMonth() + 1;
let year = dateToday.getFullYear();
let separator = "-";
let invoiceDate = `${year}${separator}${
  month < 10 ? `0${month}` : `${month}`
}${separator}${date}`;

const PaymentReceipt = () => {
  const [rowMapping, setRowMapping] = useState([]);
  row_data = JSON.parse(localStorage.getItem("selectedRow"));
  row_data = [row_data];
  console.log("This is your row_data in Receipt", row_data);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [value, setValue] = useState(1);
  const [firstTime, setFirstTime] = useState(true);
  const [splitAmtArr, setSplitAmtArr] = useState([]);
  const [payment, setPayment] = useState();
  const location = useLocation();
  let queryParams = new URLSearchParams(location.search);
  const hideHeader=payment?.operator
  console.log("operator",payment?.operator);
  
  const handleChange = (event) => {
    setValue(event.target.value * 1);
  };
  console.log(
    "This is your redirection data",
    queryParams.get("date_time"),
    datemonthYear(queryParams.get("date_time"))
  );
  const dummyData = {
    outletName: "RAHUL TELECOM",
    mobileNo: "9999445469",
    beneficiary: "Sonu",
    accountNo: "37296396227",
    bankName: "Bank of Baroda",
    dateTime: "28/03/2024 06:39 PM",
    tid: "3729639622665567",
    utr: "40881977779",
    amount: 5000,
    status: "Success",
  };
  useEffect(() => {
    // 1 is large 2 is small
    if (value === 1) {
      setRowMapping(
        row_data && row_data.length > 0
          ? // eslint-disable-next-line array-callback-return
            row_data.map((payment, index) => {
              setPayment(payment);
              //
              if (
                payment.operator === "Super Transfer" ||
                payment.operator === "Vendor Payments"
              ) {
                if (firstTime) totalAmount += toInt(payment?.amount);
                const amt_arr = breakAmt(payment?.amount, 5000);
                const arrData = amt_arr.map((splitItem, index) => {
                  return {
                    amount: splitItem,
                    created_at: payment.created_at,
                    number: payment.number,
                    ben_name: payment.ben_name,
                    operator: payment.operator,
                    ben_acc: payment.ben_acc,
                    ifsc: payment.ifsc,
                    op_id: payment.op_id,
                    status: payment.status,
                  };
                });
                let splitAmt = arrData.reverse();
                setSplitAmtArr(splitAmt);
              } else {
                if (firstTime) totalAmount += toInt(payment?.amount);
                return (
                  <tr style={{ fontSize: "12px" }}>
                    <td>
                      {payment && payment.created_at
                        ? datemonthYear(payment.created_at)
                        : ""}
                    </td>
                    <td
                      style={{
                        textTransform: "lowercase",
                      }}
                    >
                      {payment && payment.number ? payment.number : " "} <br />
                      {payment && payment.ben_name ? payment.ben_name : " "}
                    </td>
                    <td
                      style={{
                        textTransform: "lowercase",
                      }}
                    >
                      {payment &&
                      payment.operator &&
                      (payment.operator === "Vendor Payments" ||
                        payment.operator === "Express Transfer" ||
                        payment.operator === "Domestic Money Transfer" ||
                        payment.operator === "Domestic Money Transfer 2")
                        ? "Money Transfer"
                        : payment.operator}
                    </td>
                    <td>
                      {payment && payment.ben_acc ? payment.ben_acc : ""}
                      <br />
                      {payment && payment.ifsc ? payment.ifsc : ""}
                    </td>
                    {/* <td>{payment && payment.ifsc ? payment.ifsc : ""}</td> */}
                    <td>{payment && payment.op_id ? payment.op_id : ""}</td>
                    <td>
                      {payment && payment.amount
                        ? `${numIn2Dec(payment.amount)} INR`
                        : ""}
                      <br />

                      {payment.operator === "Nepal Transfer" &&
                      payment &&
                      payment.amount
                        ? `${numIn2Dec(payment.amount * 1.6)} NPR`
                        : ""}
                    </td>
                    <td>{payment && payment.status ? payment.status : ""}</td>
                  </tr>
                );
              }
            })
          : []
      );
    } else {
      setRowMapping(
        row_data && row_data.length > 0
          ? row_data.map((payment, index) => {
              if (firstTime) totalAmount += toInt(payment?.amount);
              return (
                <div className="just-dashed-divider just-padding">
                  <tr style={{ fontSize: "12px" }}>
                    <td>Date</td>
                    <td>
                      {queryParams
                        ? //  && queryParams.get("date_time")
                          // ? datemonthYear(queryParams.created_at)
                          datemonthYear(queryParams.get("date_time"))
                        : ""}
                    </td>
                  </tr>
                  {/*  */}
                  <tr style={{ fontSize: "12px", minHeight: "45px" }}>
                    <td>Customer</td>
                    <td
                      style={{
                        textTransform: "lowercase",
                      }}
                    >
                      {payment && payment.number ? payment.number : " "} <br />
                      {payment && payment.ben_name ? payment.ben_name : " "}
                    </td>
                  </tr>
                  {/*  */}
                  <tr style={{ fontSize: "12px" }}>
                    <td>Operator</td>
                    <td
                      style={{
                        textTransform: "lowercase",
                      }}
                    >
                      {payment &&
                      payment.operator &&
                      (payment.operator === "Vendor Payments" ||
                        payment.operator === "Express Transfer" ||
                        payment.operator === "Domestic Money Transfer" ||
                        payment.operator === "Domestic Money Transfer 2")
                        ? "Money Transfer"
                        : payment.operator}
                    </td>
                  </tr>
                  {/*  */}
                  {/* <tr style={{ fontSize: "12px" }}>
                    <td>Operator</td>
                    <td
                      style={{
                        textTransform: "lowercase",
                      }}
                    >
                      {payment && payment.operator
                        ? payment.operator === "Vendor Payments"
                          ? "Express Transfer"
                          : payment.operator
                        : ""}
                    </td>
                  </tr> */}
                  {/*  */}
                  <tr style={{ fontSize: "12px", minHeight: "45px" }}>
                    <td>Acc Details</td>
                    <td>
                      {payment && payment.ben_acc ? payment.ben_acc : ""}
                      <br />
                      {payment && payment.ifsc ? payment.ifsc : ""}
                    </td>
                  </tr>
                  {/*  */}
                  <tr style={{ fontSize: "12px" }}>
                    <td> Operator ID</td>
                    <td>{payment && payment.op_id ? payment.op_id : ""}</td>
                  </tr>
                  {/*  */}
                  <tr style={{ fontSize: "12px" }}>
                    <td>Amount</td>
                    <td>
                      {payment && payment.amount
                        ? `${numIn2Dec(payment.amount)} INR`
                        : ""}
                      <br />
                      {payment.operator === "Nepal Transfer" &&
                      payment &&
                      payment.amount
                        ? `${numIn2Dec(payment.amount * 1.6)} NPR`
                        : ""}
                    </td>
                  </tr>
                  {/*  */}
                  <tr style={{ fontSize: "12px" }}>
                    <td>Status</td>
                    <td>{payment && payment.status ? payment.status : ""}</td>
                  </tr>
                </div>
              );
            })
          : []
      );
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (value === 1) {
      row_data &&
        row_data.length > 0 &&
        // eslint-disable-next-line array-callback-return
        row_data.map((payment) => {
          // if (payment.operator === "Super Transfer") {

          // }
          if (
            payment.operator === "Super Transfer" ||
            payment.operator === "Vendor Payments"
          ) {
            setRowMapping(
              splitAmtArr.map((splitItem) => {
                return (
                  <tr style={{ fontSize: "12px" }}>
                    <td>
                      {splitItem && splitItem.created_at
                        ? datemonthYear(splitItem.created_at)
                        : ""}
                    </td>
                    <td
                      style={{
                        textTransform: "lowercase",
                      }}
                    >
                      {splitItem && splitItem.number ? splitItem.number : " "}{" "}
                      <br />
                      {splitItem && splitItem.ben_name
                        ? splitItem.ben_name
                        : " "}
                    </td>
                    <td
                      style={{
                        textTransform: "lowercase",
                      }}
                    >
                      {splitItem && splitItem.operator
                        ? splitItem.operator === "Vendor Payments"
                          ? "Express Transfer"
                          : splitItem.operator
                        : ""}
                    </td>
                    <td>
                      {splitItem && splitItem.ben_acc ? splitItem.ben_acc : ""}
                      <br />
                      {splitItem && splitItem.ifsc ? splitItem.ifsc : ""}
                    </td>
                    {/* <td>{splitItem && splitItem.ifsc ? splitItem.ifsc : ""}</td> */}
                    <td>
                      {splitItem && splitItem.op_id ? splitItem.op_id : ""}
                    </td>
                    <td>
                      {splitItem && splitItem.amount
                        ? numIn2Dec(splitItem.amount)
                        : ""}
                    </td>
                    <td>
                      {splitItem && splitItem.status ? splitItem.status : ""}
                    </td>
                  </tr>
                );
              })
            );
          }
        });
    } else {
      row_data.length > 0 &&
        // eslint-disable-next-line array-callback-return
        row_data.map((payment) => {
          if (
            payment.operator === "Super Transfer" ||
            payment.operator === "Vendor Payments"
          ) {
            setRowMapping(
              splitAmtArr && splitAmtArr.length > 0
                ? splitAmtArr.map((splitItem) => {
                    // if (firstTime) totalAmount += toInt(payment?.amount);
                    return (
                      <div className="just-dashed-divider just-padding">
                        <tr style={{ fontSize: "12px" }}>
                          <td>Date</td>
                          <td>
                            {splitItem && splitItem.created_at
                              ? datemonthYear(splitItem.created_at)
                              : ""}
                          </td>
                        </tr>
                        {/*  */}
                        <tr style={{ fontSize: "12px" }}>
                          <td>Customer</td>
                          <td
                            style={{
                              textTransform: "lowercase",
                            }}
                          >
                            {splitItem && splitItem.number
                              ? splitItem.number
                              : " "}{" "}
                            <br />
                            {splitItem && splitItem.ben_name
                              ? splitItem.ben_name
                              : " "}
                          </td>
                        </tr>
                        {/*  */}
                        <tr style={{ fontSize: "12px" }}>
                          <td>Operator</td>
                          <td
                            style={{
                              textTransform: "lowercase",
                            }}
                          >
                            {splitItem && splitItem.operator
                              ? splitItem.operator === "Vendor Payments"
                                ? "Express Transfer"
                                : splitItem.operator
                              : ""}
                          </td>
                        </tr>
                        {/*  */}
                        {/* <tr style={{ fontSize: "12px" }}>
                          <td>Operator</td>
                          <td
                            style={{
                              textTransform: "lowercase",
                            }}
                          >
                            {splitItem && splitItem.operator
                              ? splitItem.operator === "Vendor Payments"
                                ? "Express Transfer"
                                : splitItem.operator
                              : ""}
                          </td>
                        </tr> */}
                        {/*  */}
                        <tr style={{ fontSize: "12px" }}>
                          <td>Acc Details</td>
                          <td>
                            {splitItem && splitItem.ben_acc
                              ? splitItem.ben_acc
                              : ""}
                            <br />
                            {splitItem && splitItem.ifsc ? splitItem.ifsc : ""}
                          </td>
                        </tr>
                        {/*  */}
                        <tr style={{ fontSize: "12px" }}>
                          <td> Operator ID</td>
                          <td>
                            {splitItem && splitItem.op_id
                              ? splitItem.op_id
                              : ""}
                          </td>
                        </tr>
                        {/*  */}
                        <tr style={{ fontSize: "12px" }}>
                          <td>Amount</td>
                          <td>
                            {splitItem && splitItem.amount
                              ? numIn2Dec(splitItem.amount)
                              : ""}
                          </td>
                        </tr>
                        {/*  */}
                        <tr style={{ fontSize: "12px" }}>
                          <td>Status</td>
                          <td>
                            {splitItem && splitItem.status
                              ? splitItem.status
                              : ""}
                          </td>
                        </tr>
                      </div>
                    );
                  })
                : []
            );
          }
        });
    }
  }, [value, splitAmtArr]);

  if (value === 2) {
    return (
      <div className="like-parent-border">
        <div className="d-flex btnPrint">
          <FormControl fullWidth sx={{ textAlign: "left" }}>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={(e) => {
                setFirstTime(false);
                handleChange(e);
              }}
              default
              row
            >
              <FormControlLabel
                value={1}
                control={<Radio />}
                label="Large Receipt"
                // labelPlacement="top"
              />
              <FormControlLabel
                value={2}
                control={<Radio />}
                label="Small Receipt"
                // labelPlacement="top"
              />
            </RadioGroup>
          </FormControl>
          {/* <MyButton
            text="Print"
            icon={<PrintIcon />}
            onClick={() => {
              setTimeout(() => {
                window.print();
              }, 300);
            }}
          /> */}
        </div>
        <Grid className="parent-border-vertical">
          {/*  */}
          <Grid
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
            }}
          >{hideHeader!=="Vendor Payments"&&
            <Grid>
              
              <LogoComponent width="40%" />
            </Grid>
  }
            {/* <Grid className="just-text-right">
              {user ? user.establishment : "Null"}

              {user ? user.username : "Null"}
            </Grid> */}
          </Grid>
          {/*  */}
          <div
            className="d-flex justify-content-center"
            style={{
              marginBottom: "0.2cm",
              marginTop: "0.2cm",
            }}
          >
            <h6>Transaction Summary</h6>
          </div>
          {/*  */}
          <div className="just-divider"></div>
          <table className="" style={{ borderSpacing: 0, width: "100%" }}>
            {rowMapping}
          </table>

          <div className="parent  parent-invoice-total mb-3">
            <span className="invoice-total-text child">TOTAL :</span>
            <span className="invoice-total child diff-fonts">
              ₹ {payment?.amount}/-
            </span>
          </div>
          <div className="btnPrint d-flex justify-content-center mx-5 my-1">
            <Button
              variant="contained"
              color="primary"
              startIcon={<PrintIcon />}
              onClick={() => {
                window.print();
              }}
              sx={{
                backgroundColor: "#1E88E5",
                color: "#fff",
                padding: "9px 18px",
                borderRadius: "8px",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#1565C0",
                },
                "@media print": {
                  display: "none",
                },
              }}
            >
              Print
            </Button>
          </div>
        </Grid>
      </div>
    );
  } else {
    return (
      <>
        <div className="like-parent-border btnPrint">
          <FormControl fullWidth sx={{ textAlign: "left" }}>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={(e) => {
                setFirstTime(false);
                handleChange(e);
              }}
              default
              row
            >
              <FormControlLabel
                value={1}
                control={<Radio />}
                label="Large Receipt"
                // labelPlacement="top"
              />
              <FormControlLabel
                value={2}
                control={<Radio />}
                label="Small Receipt"
                // labelPlacement="top"
              />
            </RadioGroup>
          </FormControl>
        </div>
        <Grid className="parent-border">
          <Box sx={{ px: 2, py: 1, mt: 1.5 }}>
            <Grid container justifyContent="space-between" lg={12}>
              {/* Left Side - Logo */}
              <Grid item xs={12} lg={6} sm={6} sx={{ textAlign: "left" }}>
              {hideHeader!=="Vendor Payments"&& <LogoComponent width="40%" />}

                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    color: "#1E88E5",
                    mt: 3,
                    textDecoration: "underline",
                    textDecorationThickness: "2px",
                    textUnderlineOffset: "3px",
                    textDecorationColor: "#0D47A1",
                  }}
                >
                  Payment Confirmation
                </Typography>
              </Grid>

              {/* Right Side - Location, Email, and Phone */}
              <Grid item xs={12} lg={6} sm={6}>
                <Box
                  display="grid"
                  flexDirection="column"
                  alignItems="start"
                  sx={{ ml: 2 }}
                >
                  {/* Align to the right */}

                  {/* Location Icon with Dummy Address */}
                  {hideHeader!=="Vendor Payments"&&
                  <>
                  <Box
                    sx={{
                      display: "flex",
                      mt: 1,
                      gap: 1.2,

                      color: "#FF5722",
                    }}
                  >
                    <LocationOn color="#256BC5" fontSize="small" />
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#256BC5",
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "14px",
                      }}
                    >
                      Plot No.5 2nd floor Pocket-5, Rohini Sec 24, Delhi 110085
                    </Typography>
                  </Box>
                
                  {/* Email Icon with Dummy Email */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 1,
                      gap: 1.2,
                      color: "#FF5722",
                    }}
                  >
                    <Email color="#FF5722" fontSize="small" />
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#256BC5",
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      Email: support@VistarMoney.com
                    </Typography>
                  </Box>

                  {/* Phone Icon with Dummy Mobile Number */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 1,
                      gap: 1.2,
                      color: "#FF5722",
                    }}
                  >
                    <Phone color="#FF5722" fontSize="small" />
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#256BC5",
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      Phone: 9355128199
                    </Typography>
                  </Box>
                  </>
  }
                </Box>
              </Grid>
            </Grid>

            {/* <Typography>Payment Confirmations</Typography> */}
            <Box
              sx={{
                marginLeft: { xs: "10px", sm: "20px", md: "45px" },
              }}
            >
              <Grid
                container
                sx={{
                  justifyContent: "center",
                  mt: 4,
                  textAlign: "left",
                  fontSize: "15px",
                }}
              >
                {/* Left column */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  lg={6}
                  container
                  justifyContent="center"
                  textAlign="left"
                >
                  <Grid item xs={12} lg={6} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#295A9B",
                        textAlign: "left",
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      Outlet Name:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} lg={6} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#256BC5",
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "15px",
                        textTransform: "uppercase",
                      }}
                    >
                      {payment?.establishment}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} lg={6} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#295A9B",

                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      Beneficiary:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} lg={6} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#256BC5",
                        fontSize: "15px",
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      {payment?.ben_name}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} lg={6} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#295A9B",
                        textAlign: "left",
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      Ifsc Code:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} lg={6} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#256BC5",
                        fontSize: "15px",
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      {payment?.ifsc}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Right column */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  lg={6}
                  container
                  justifyContent="center"
                  textAlign="left"
                >
                  <Grid item xs={12} lg={6} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#295A9B",
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      Mobile No:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} lg={6} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#256BC5",
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      {payment?.number}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} lg={6} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#295A9B",
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      Account No:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} lg={6} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#256BC5",
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      {payment?.ben_acc}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} lg={6} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#295A9B",
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      Date & Time:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} lg={6} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#256BC5",
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      {datemonthYear(payment?.created_at)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            <Box display="flex" justifyContent="center" textAlign="center">
              <Typography
                variant="body"
                sx={{
                  width: "auto",
                  backgroundColor: "#E3F2FD",
                  color: "#0D47A1",
                  padding: "10px 30px",
                  textAlign: "center",
                  borderRadius: "25px",
                  border: "2px solid #90CAF9",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  fontSize: "1rem",
                  mt: 3,
                  fontWeight: 600,
                }}
              >
                Transaction Summary
              </Typography>
            </Box>

            <TableContainer
              sx={{
                mt: 1.5,
                color: "#1A237E",
                fontWeight: 700,
                border: "1px solid #BBDEFB",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        border: "1px solid #64B5F6",
                        backgroundColor: "#E3F2FD",
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      TID
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #64B5F6",
                        backgroundColor: "#E3F2FD",
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      Type
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #64B5F6",
                        backgroundColor: "#E3F2FD",
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      UTR
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #64B5F6",
                        backgroundColor: "#E3F2FD",
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #64B5F6",
                        backgroundColor: "#E3F2FD",
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell
                      sx={{
                        border: "1px solid #64B5F6",
                        fontSize: "0.95rem",
                      }}
                    >
                      {payment?.order_id}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #64B5F6",
                        fontSize: "0.95rem",
                      }}
                    >
                      {payment?.type}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #64B5F6",
                        fontSize: "0.95rem",
                      }}
                    >
                      {payment?.op_id}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #64B5F6",
                        fontSize: "0.95rem",
                      }}
                    >
                      {payment?.amount}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #64B5F6",
                        fontSize: "0.95rem",
                      }}
                    >
                      {payment?.status}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Grid
              sx={{
                justifyContent: "space-between",
                display: "flex",
                color: "#256BC5",
              }}
            >
              <Grid sx={{ justifyContent: "start" }}>
                <Box
                  sx={{
                    justifyContent: "start",
                    display: "flex",
                    mt: 2,
                    color: "#0D47A1",
                    fontWeight: 700,
                    fontSize: "1.35rem",
                  }}
                >
                  <Typography variant="body1">
                    Total Amount: <strong>₹ {payment?.amount}/-</strong>
                  </Typography>
                </Box>
                <Box sx={{ justifyContent: "start", display: "flex", mt: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#0D47A1",
                      fontSize: "1rem",
                      fontWeight: 500,
                    }}
                  >
                    Amount (In Words):{" "}
                    <strong>
                      {(numberToWord(payment?.amount) || "").toUpperCase()} /-
                    </strong>
                  </Typography>
                </Box>
              </Grid>

              <Grid mt={3} sx={{ textAlign: "right", mr: 1, fontSize: "12px" }}>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PrintIcon />}
                    onClick={() => {
                      window.print();
                    }}
                    sx={{
                      backgroundColor: "#1E88E5",
                      color: "#fff",
                      padding: "9px 18px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: "#1565C0",
                      },
                      "@media print": {
                        display: "none",
                      },
                    }}
                  >
                    Print
                  </Button>
                </div>
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#0D47A1",
                mt: 10,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textAlign: "left",
                }}
              >
                2024 All Rights Reserved
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textAlign: "right",
                }}
              >
                This is a system generated receipt, hence no seal or signature
                required.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </>
    );
  }
};

export default PaymentReceipt;
