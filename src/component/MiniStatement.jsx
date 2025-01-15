/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import ModalHeader from "../modals/ModalHeader";
import { AEPS } from "../utils/constants";
import LogoComponent from "./LogoComponent";
import PrintIcon from "@mui/icons-material/Print";
import { currencySetter } from "../utils/Currencyutil";
import useCommonContext from "../store/CommonContext";
import Mount from "./Mount";

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
const MiniStatement = ({
  setOpen,
  open,
  setGetBankData,
  getBankData,
  view,
  balanceData,
  remitterDetails,
  accBalance,
}) => {
    const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    if (getBankData) {
      remitterDetails.balance = accBalance && accBalance;
      localStorage.setItem("getBankData", JSON.stringify(getBankData));
      localStorage.setItem("remitterDetails", JSON.stringify(remitterDetails));
    }
    return () => {};
  }, [getBankData]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="sm_modal" sx={style}>
        <Box
          sx={{
            width: "100%",
            typography: "body1",
            position: "relative",
          }}
        >
          <ModalHeader title="" handleClose={handleClose} />

          {/* ################################################# */}
          {/* AePS1 mini statement data preparation ########### */}
          {/* ################################################# */}
          {/* &&
              aepsType === AEPS_TYPE.AEPS1 */}
          <Mount visible={view === AEPS.STATEMENT && getBankData}>
            <div id="mini_statement">
              <LogoComponent width="25%" />
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
                  <td style={{ width: "51.5%", fontSize: "12px" }}>
                    Remittance bank
                  </td>
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
                {accBalance && accBalance !== null && (
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
                      {currencySetter(accBalance && accBalance)}
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
                <tbody>
                  {getBankData?.length > 0 &&
                    getBankData.map((data, index) => {
                      return (
                        <tr key={data}>
                          <td className="statement-td">{data.date}</td>
                          <td className="statement-td">{data.narration}</td>
                          <td
                            className="statement-td"
                            style={{ textAlign: "center" }}
                          >
                            {data.txnType}
                          </td>
                          <td className="statement-td">{data.amount}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {/* <MiniStatementReceipt
                getBankData={getBankData}
                remitterDetails={remitterDetails}
              /> */}
            </div>
          </Mount>

          {/* ################################################# */}
          {/* AePS2 mini statement data preparation ########### */}
          {/* ################################################# */}
          {/* <Mount
            visible={
              view === AEPS.STATEMENT &&
              getBankData &&
              aepsType === AEPS_TYPE.AEPS2
            }
          >
            <table className="table my-2">
              <thead>
                <tr className="statement-thead">
                  <th scope="col">Date</th>
                  <th scope="col">Narration</th>
                  <th scope="col">Txn Type</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                {getBankData.length > 0 &&
                  getBankData.map((data, index) => {
                    const narration = data
                      .substring(data.indexOf(" "), data.lastIndexOf(" "))
                      .trim();
                    return (
                      <tr key={data}>
                        <td className="statement-td">
                          {data.substring(0, data.indexOf(" "))}
                        </td>
                        <td className="statement-td">
                          {narration.substring(0, narration.length - 1)}
                        </td>
                        <td className="statement-td">
                          {narration.substring(narration.length - 1)}
                        </td>
                        <td className="statement-td">
                          {data.substring(data.lastIndexOf(" "))}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Mount> */}
        </Box>

        {view === AEPS.BALANCE_ENQUIRY && balanceData && (
          <span>{balanceData?.message}</span>
        )}
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Tooltip title="Download Receipt" placement="top">
            <PrintIcon
              color="success"
              className=" mx-2 refresh-purple"
              onClick={() => {
                window.open("/bank-statement", "_blank");
              }}
            />
          </Tooltip>
        </Box>

        {/* <ModalFooter form="print" btn="Print" onClick={generatePdf} /> */}
      </Box>
    </Modal>
  );
};

export default MiniStatement;
