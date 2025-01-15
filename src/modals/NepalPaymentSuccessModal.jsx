import { Box, Button, Grid, Modal } from "@mui/material";
import React from "react";
import { useState } from "react";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { useEffect } from "react";
import { currencySetter } from "../utils/Currencyutil";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  boxShadow: 24,
  fontFamily: "Poppins",
  height: "max-content",
  overflowY: "scroll",
  p: 2,
};

const NepalPaymentSuccessModal = ({
  nepalAllRes,
  openHook,
  openHookFunc,
  nepalMtSuccessData,
  receiver,
  amount,
}) => {
  // console.log("amount", amount);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (openHook === "nepal") {
      setOpen(true);
    }
  }, [openHook]);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    openHookFunc("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal nepal-footer-bkgd">
          <Box sx={{ mt: 4 }}>
            <ModalHeader title="Nepal Transfer" handleClose={handleClose} />
            <Grid container>
              <Grid
                item
                md={12}
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <table className="mt-table">
                  <tr>
                    <td>Status</td>
                    <td>:</td>
                    <td
                      style={{
                        textAlign: "right",
                        fontSize: "16px",
                        letterSpacing: "1px",
                        fontWeight: "600",
                        color: "#66bb6a",
                      }}
                    >
                      {nepalMtSuccessData?.Message}
                    </td>
                  </tr>
                  <tr>
                    <td>Name</td>
                    <td>:</td>
                    <td style={{ textAlign: "right" }}>{receiver?.Name}</td>
                  </tr>
                  <tr hidden={!receiver?.BankName}>
                    <td>Bank Name</td> <td>:</td>
                    <td style={{ textAlign: "right" }}>{receiver?.BankName}</td>
                  </tr>
                  <tr hidden={!receiver?.AcNumber}>
                    <td>Account </td>
                    <td>:</td>
                    <td style={{ textAlign: "right" }}>{receiver?.AcNumber}</td>
                  </tr>
                  <tr>
                    <td>Amount</td>
                    <td>:</td>
                    <td style={{ textAlign: "right" }}>
                      {currencySetter(amount * 1)}
                    </td>
                  </tr>
                  <tr>
                    <td>Pin Number</td>
                    <td>:</td>
                    <td style={{ textAlign: "right" }}>
                      {nepalMtSuccessData?.PinNo}
                    </td>
                  </tr>
                </table>
              </Grid>
              {/* {onComplete && (
                <Grid
                  item
                  md={12}
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                >
                  <Button
                    variant="contained"
                    className="btn-background"
                    sx={{ textTransform: "none", width: "85%" }}
                    onClick={() => {
                      window.open("/mt-receipt", "_blank");
                    }}
                  >
                    Print Receipt
                  </Button>
                </Grid>
              )} */}
            </Grid>

            <ModalFooter nepalFooter />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default NepalPaymentSuccessModal;
