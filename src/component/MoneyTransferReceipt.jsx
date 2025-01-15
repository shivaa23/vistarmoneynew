/* eslint-disable react-hooks/exhaustive-deps */
import "../scss/PaymentReceipt.css";
import MyButton from "./MyButton";
import { toInt } from "../utils/TextUtil";
import {  myDateDDMMyy } from "../utils/DateUtils";
import LogoComponent from "./LogoComponent";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";
import PrintIcon from "@mui/icons-material/Print";
import { useEffect } from "react";
import { useState } from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useLocation } from "react-router-dom";

let payment_data = {};
let row_data = [];
let dateToday = new Date();
let date = dateToday.getDate();
let month = dateToday.getMonth() + 1;
let year = dateToday.getFullYear();
let separator = "-";
let invoiceDate = `${year}${separator}${
  month < 10 ? `0${month}` : `${month}`
}${separator}${date}`;

const MoneyTransferReceipt = () => {
  const [value, setValue] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  // 1 is large 2 is small
  const [firstTime, setFirstTime] = useState(true);
  const [vendordata, setVendorData] = useState();
  const handleChange = (event) => {
    setValue(event.target.value * 1);
  };
  const [rowMapping, setRowMapping] = useState([]);
  payment_data = JSON.parse(localStorage.getItem("MoneyTransfer"));
  row_data = JSON.parse(localStorage.getItem("items"));
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const vendor = searchParams.get('vendor');
  // useEffect(() => {
  //   // Parse the query parameters

  // }, [location]);
  useEffect(() => {
    // Parse the query parameters
 // Get the 'aa' parameter
    if (vendor) {
      setVendorData(vendor)
      console.log("Received 'aa' parameter:", vendor);
    }
  }, [location]);
  useEffect(() => {
    // 1 is large 2 is small
    if (payment_data?.transfer_type === "MT") {
      if (value === 1) {
        setRowMapping(
          row_data && row_data?.length > 0
            ? row_data.map((payment, index) => {
                if (firstTime) {
                  setTotalAmount((val) => (val += toInt(payment?.amount)));
                }
                return (
                  <tr style={{ fontSize: "12px" }}>
                    <td
                      style={{
                        textTransform: "lowercase",
                      }}
                    >
                      {payment_data?.name
                        ? payment_data?.name
                        : payment_data?.bene_name}
                    </td>
                    <td
                      style={{
                        textTransform: "lowercase",
                      }}
                    >
                      {payment_data && payment_data.bank}
                    </td>
                    <td
                      style={{
                        textTransform: "lowercase",
                      }}
                    >
                      {payment_data && payment_data.account
                        ? payment_data.account
                        : payment_data.bene_acc}{" "}
                      <br />
                      {payment_data && payment_data.ifsc}
                    </td>
                    <td
                      style={{
                        textTransform: "lowercase",
                      }}
                    >
                      {payment_data && payment_data.choosenTransferType}
                    </td>
                    <td
                      style={{
                        textTransform: "lowercase",
                      }}
                    >
                      {payment?.meta?.res?.RRN}
                    </td>
                    <td
                      style={{
                        textTransform: "lowercase",
                      }}
                    >
                      {payment?.amount}
                    </td>
                    <td
                      style={{
                        textTransform: "lowercase",
                        color: "green",
                      }}
                    >
                      {payment?.meta?.res?.status}
                    </td>
                  </tr>
                );
              })
            : []
        );
      } else {
        setRowMapping(
          row_data && row_data.length > 0
            ? row_data.map((payment, index) => {
                if (firstTime) {
                  setTotalAmount((val) => (val += toInt(payment?.amount)));
                }
                return (
                  <div className="just-dashed-divider just-padding">
                    <tr style={{ fontSize: "12px" }}>
                      <td>Date</td>
                      <td>
                        {invoiceDate ? myDateDDMMyy(invoiceDate) : "Null"}
                      </td>
                    </tr>
                    {/*  */}
                    <tr style={{ fontSize: "12px" }}>
                      <td>Customer</td>
                      <td
                        style={{
                          textTransform: "none",
                        }}
                      >
                        {payment_data && payment_data.bene_name
                          ? payment_data.bene_name
                          : payment_data?.name}
                      </td>
                    </tr>

                    <tr style={{ fontSize: "12px", minHeight: "45px" }}>
                      <td>Customer Bank</td>
                      <td
                        style={{
                          textTransform: "",
                        }}
                      >
                        {payment_data && payment_data.bank
                          ? payment_data.bank
                          : " "}
                        <br />
                        {payment_data && payment_data.ifsc
                          ? payment_data.ifsc
                          : " "}{" "}
                      </td>
                    </tr>
                    {/*  */}
                    <tr style={{ fontSize: "12px" }}>
                      <td>Customer Acc</td>
                      <td
                        style={{
                          textTransform: "lowercase",
                        }}
                      >
                        {payment_data && payment_data.account
                          ? payment_data.account
                          : payment_data?.bene_acc}{" "}
                      </td>
                    </tr>
                    {/*  */}
                    <tr style={{ fontSize: "12px" }}>
                      <td>RRN</td>
                      <td
                        style={{
                          textTransform: "none",
                        }}
                      >
                        {payment?.meta?.res?.RRN}
                      </td>
                    </tr>
                    {/* Remitter */}
                    <tr style={{ fontSize: "12px", minHeight: "45px" }}>
                      <td>Remitter</td>
                      <td
                        style={{
                          textTransform: "none",
                        }}
                      >
                        {payment_data?.remName} <br />
                        {payment_data?.remNumb}
                      </td>
                    </tr>
                    {/*amount*/}
                    <tr style={{ fontSize: "12px" }}>
                      <td>Amount</td>
                      <td
                        style={{
                          textTransform: "none",
                        }}
                      >
                        {payment?.amount}
                      </td>
                    </tr>

                    {/*transfer type*/}
                    <tr style={{ fontSize: "12px" }}>
                      <td>Type</td>
                      <td
                        style={{
                          textTransform: "none",
                        }}
                      >
                        {payment_data?.choosenTransferType}
                      </td>
                    </tr>

                    {/*  */}

                    <tr style={{ fontSize: "12px" }}>
                      <td>Status</td>
                      <td> {payment?.meta?.res?.status}</td>
                    </tr>
                  </div>
                );
              })
            : []
        );
      }
    }

    return () => {};
  }, [value]);

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
          <MyButton
            text="Print"
            icon={<PrintIcon />}
            onClick={() => {
              setTimeout(() => {
                window.print();
              }, 300);
            }}
          />
        </div>
        <div className="parent-border-vertical">
          {/*  */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
            }}
          >
            <div>
              {!vendordata&&
              <LogoComponent width="60%" />}
              <div className="just-bold just-bigger-font just-top-bottom-margin ">
                RECEIPT
              </div>
              <div className="just-bold">
                {invoiceDate ? myDateDDMMyy(invoiceDate) : "Null"}
              </div>
            </div>

            <div className="just-text-right">
              <div className="just-bold just-little-big-font">
                Agent Information
              </div>
              <div className="just-bold just-little-big-font just-top-bottom-margin">
                {user ? user.establishment : "Null"}
              </div>
              <div className="just-bold">{user ? user.username : "Null"}</div>
            </div>
          </div>
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
            {payment_data?.transfer_type === "ET" ? (
              <div className="just-dashed-divider just-padding">
                <tr style={{ fontSize: "12px" }}>
                  <td>Date</td>
                  <td>{invoiceDate ? myDateDDMMyy(invoiceDate) : ""}</td>
                </tr>
                {/*  */}
                <tr style={{ fontSize: "12px" }}>
                  <td>Customer</td>
                  <td
                    style={{
                      textTransform: "none",
                    }}
                  >
                    {payment_data && payment_data.bene_name
                      ? payment_data.bene_name
                      : " "}
                  </td>
                </tr>

                <tr style={{ fontSize: "12px", minHeight: "45px" }}>
                  <td>Customer Bank</td>
                  <td
                    style={{
                      textTransform: "",
                    }}
                  >
                    {payment_data && payment_data.bank
                      ? payment_data.bank
                      : " "}
                    <br />
                    {payment_data && payment_data.ifsc
                      ? payment_data.ifsc
                      : " "}{" "}
                  </td>
                </tr>
                {/*  */}
                <tr style={{ fontSize: "12px" }}>
                  <td>Customer Acc</td>
                  <td
                    style={{
                      textTransform: "lowercase",
                    }}
                  >
                    {payment_data && payment_data.bene_acc
                      ? payment_data.bene_acc
                      : " "}
                  </td>
                </tr>
                {/*  */}
                <tr style={{ fontSize: "12px" }}>
                  <td>RRN</td>
                  <td
                    style={{
                      textTransform: "none",
                    }}
                  >
                    {payment_data?.rrn}
                  </td>
                </tr>
                {/* Remitter */}
                <tr style={{ fontSize: "12px", minHeight: "45px" }}>
                  <td>Remitter</td>
                  <td
                    style={{
                      textTransform: "none",
                    }}
                  >
                    {payment_data?.remName} <br />
                    {payment_data?.remNumb}
                  </td>
                </tr>
                {/*  rem mobile*/}
                <tr style={{ fontSize: "12px" }}>
                  <td>Type</td>
                  <td
                    style={{
                      textTransform: "none",
                    }}
                  >
                    {payment_data?.choosenTransferType}
                  </td>
                </tr>
                {/*  */}

                <tr style={{ fontSize: "12px" }}>
                  <td>Status</td>
                  <td>
                    {payment_data && payment_data.status
                      ? payment_data.status
                      : ""}
                  </td>
                </tr>
              </div>
            ) : (
              rowMapping
            )}
          </table>

          <div className="parent  parent-invoice-total mb-3">
            <span className="invoice-total-text child">TOTAL :</span>
            <span className="invoice-total child diff-fonts">
              ₹{" "}
              {payment_data?.transfer_type === "ET"
                ? payment_data?.amount
                : totalAmount}
              /-
            </span>
          </div>
          <div className="btnPrint d-flex justify-content-center mx-5 my-1">
            <MyButton
              text="Print"
              icon={<PrintIcon />}
              onClick={() => {
                window.print();
              }}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="mt-recipt-wrapper">
        <div className="d-flex btnPrint mx-3">
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
          <MyButton
            text="Print"
            icon={<PrintIcon />}
            onClick={() => {
              setTimeout(() => {
                window.print();
              }, 300);
            }}
          />
        </div>
        <div className="parent-border">
          <div className="border">
            <div className="parent parent-invoice-logo-type">
              <div>
                <div className="invoice-logo child">
                  {!vendordata&&

                  
                  <LogoComponent width="25%" />}
                </div>

                <span className="invoice-type child">RECEIPT</span>
                <span className="invoice-date child">
                  {invoiceDate ? myDateDDMMyy(invoiceDate) : "Null"}
                </span>
              </div>

              <table
                className="child invoice-table-address"
                style={{ borderSpacing: 0 }}
              >
                <tr className="table-addresses">
                  <th>Agent Information</th>
                </tr>
                <tr className="temp">
                  <td>
                    {user ? user.establishment : "Null"} <br />
                  </td>
                </tr>
                <tr style={{}}>{user ? user.username : "Null"}</tr>
              </table>
            </div>

            {/* <div className="parent parent-invoice-table-address">
        </div> */}
            <div className="parent parent-invoice-table">
              <div
                style={{
                  marginBottom: "0.2cm",
                  marginLeft: "1cm",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <h6>Remitter Details</h6>
                <div>{payment_data?.remName}</div>
                <div>{payment_data?.remNumb}</div>
              </div>
              <div
                className="d-flex justify-content-center"
                style={{
                  marginBottom: "0.2cm",
                }}
              >
                <h6>Payment Receipt</h6>
              </div>

              <table className="invoice-table" style={{ borderSpacing: 0 }}>
                <tr className="table-row-border">
                  <th>Name</th>
                  <th>Bank Name</th>
                  <th>Account</th>
                  <th>Type</th>
                  <th>RRN</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>

                {payment_data?.transfer_type === "ET" ? (
                  <tr style={{ fontSize: "12px" }}>
                    <td>
                      {payment_data?.name
                        ? payment_data?.name
                        : payment_data?.bene_name}
                    </td>
                    <td>{payment_data?.bank}</td>
                    <td>
                      {payment_data?.account
                        ? payment_data.account
                        : payment_data.bene_acc}{" "}
                      <br />
                      {payment_data?.ifsc}
                    </td>

                    <td>{payment_data?.choosenTransferType}</td>
                    <td>{payment_data?.rrn}</td>
                    <td>{payment_data?.amount}</td>
                    <td>{payment_data?.status}</td>
                  </tr>
                ) : (
                  rowMapping
                )}
              </table>
            </div>

            <div className="parent  parent-invoice-total">
              <span className="invoice-total-text child"> TOTAL AMOUNT :</span>
              <span className="invoice-total child">
                ₹{" "}
                {payment_data?.transfer_type === "ET"
                  ? payment_data?.amount
                  : totalAmount}
                /-
              </span>
            </div>
            <div className="btnPrint d-flex justify-content-center mx-5 my-1">
              <MyButton
                text="Print"
                icon={<PrintIcon />}
                onClick={() => {
                  window.print();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default MoneyTransferReceipt;
