import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button, Grid } from "@mui/material";
import ModalHeader from "./ModalHeader";
import { useState } from "react";
import { datemonthYear } from "../utils/DateUtils";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import PersonIcon from "@mui/icons-material/Person";
import ModalFooter from "./ModalFooter";

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

const RepeatRechargeModal = ({ data, setAmount }) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: "grid",
        justifyContent: "center",
      }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title="Repeat Recharge" handleClose={handleClose} />
          <Box
            component="form"
            id="repeatRecharge"
            noValidate
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              setAmount(data.last_success_amount);
              handleClose();
            }}
            className="text-center"
            sx={{
              "& .MuiTextField-root": { m: 2 },
              objectFit: "contain",
              display: "grid",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid container sx={{ pt: 1 }}>
              <div
                style={{
                  width: "100%",
                  marginLeft: "16px",
                  marginRight: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  textAlign: "center",
                  alignItems: "center",
                  marginTop: "8px",
                  backgroundColor: "#0077b61e",
                  borderRadius: "8px",
                  padding: "16px",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <MobileFriendlyIcon sx={{ mr: 1 }} />
                  {data.number}
                  {"(" + data.operator + ")"}
                </span>

                <span style={{ display: "flex", alignItems: "center" }}>
                  {data.customer_name ? (
                    <div>
                      <PersonIcon sx={{ mr: 1 }} /> {data.customer_name}
                    </div>
                  ) : (
                    ""
                  )}
                </span>
              </div>
              <Box
                sx={{
                  width: "100%",
                  height: "120px",
                  display: "grid",
                  justifyContent: "center",
                  backgroundColor: "#0077b614",
                  alignItems: "center",
                  py: 3,
                  borderRadius: "8px",
                  margin: "16px",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "34px",
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                    lineHeight: "1px",
                    color: "success",
                  }}
                >
                  <span className="diff-font">₹</span>
                  {"  "}
                  {data.last_success_amount}
                </span>
                <span
                  className="hover-zoom"
                  style={{
                    fontSize: "15px",
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                    lineHeight: "1px",
                  }}
                >
                  Last Recharge on {datemonthYear(data.last_success)}
                </span>
              </Box>
            </Grid>
            <Button
              form="repeatRecharge"
              type="submit"
              sx={{ m: 2, p: 1.5 }}
              className="btn-background"
            >
              Repeat Recharge
            </Button>
          </Box>
          <ModalFooter handleClose={handleClose} btn="Change Amount" />
        </Box>
      </Modal>
    </Box>
  );
};
export default RepeatRechargeModal;
