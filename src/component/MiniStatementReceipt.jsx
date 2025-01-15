import React from "react";
import LogoComponent from "./LogoComponent";
import PrintIcon from "@mui/icons-material/Print";
import { useState } from "react";
import { useEffect } from "react";
import MyButton from "./MyButton";
import { currencySetter } from "../utils/Currencyutil";

let row_data = [],
  remitterDetails;
const style = {
  backgroundColor: "#ffffff",
  width: "10cm",
  height: "auto",
  margin: "0 auto",
};
const MiniStatementReceipt = () => {
  const [rowMapping, setRowMapping] = useState([]);
  row_data = JSON.parse(localStorage.getItem("getBankData"));
  remitterDetails = JSON.parse(localStorage.getItem("remitterDetails"));

  useEffect(() => {
    setRowMapping(
      row_data?.length > 0
        ? row_data.map((data, index) => {
            return (
              <tr key={data}>
                <td className="statement-td">{data.date}</td>
                <td className="statement-td">{data.narration}</td>
                <td className="statement-td" style={{ textAlign: "center" }}>
                  {data.txnType}
                </td>
                <td className="statement-td">{data.amount}</td>
              </tr>
            );
          })
        : []
    );
    return () => {};
  }, []);

  return (
    <div id="mini_statement" style={style}>
      <LogoComponent width="48%" />
      <table className="aeps-stmt-table mt-2">
        <tr>
          <td style={{ width: "51.5%", fontSize: "12px" }}>
            Remittance mobile
          </td>
          <td
            style={{
              textAlign: "right",
              fontSize: "11px",
              fontWeight: "bold",
            }}
          >
            {remitterDetails?.mobile}
          </td>
        </tr>
        <tr>
          <td style={{ width: "51.5%", fontSize: "12px" }}>Remittance bank</td>
          <td
            style={{
              textAlign: "right",
              fontSize: "11px",
              fontWeight: "bold",
            }}
          >
            {remitterDetails?.bank}
          </td>
        </tr>
        <tr>
          <td style={{ width: "51.5%", fontSize: "12px" }}>
            Remittance Aadhaar
          </td>
          <td
            style={{
              textAlign: "right",
              fontSize: "11px",
              fontWeight: "bold",
            }}
          >
            {remitterDetails?.aadhaar?.aadhaar}
          </td>
        </tr>
        {remitterDetails?.balance !== null && (
          <tr>
            <td style={{ width: "51.5%", fontSize: "12px" }}>
              Available Balance
            </td>
            <td
              style={{
                textAlign: "right",
                fontSize: "11px",
                fontWeight: "bold",
              }}
            >
              {currencySetter(remitterDetails?.balance)}
            </td>
          </tr>
        )}
      </table>
      <table className="table my-2">
        <thead>
          <tr className="statement-thead">
            <th scope="col">Date</th>
            <th scope="col">Narration</th>
            <th scope="col">Txn Type</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>{rowMapping}</tbody>
      </table>
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
  );
};

export default MiniStatementReceipt;
