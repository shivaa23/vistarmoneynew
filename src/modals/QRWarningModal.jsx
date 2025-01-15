import { Box, Grid, Modal, Typography } from "@mui/material";
import React from "react";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  pb: 2,
  height: "max-content",
  overflowY: "scroll",
};

const QRWarningModal = ({ open, setOpen, setShowQr, showQr }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const showQrCode = () => {
    setShowQr(!showQr);

    setOpen(false);
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
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title="QR Code" handleClose={handleClose} />
          <Grid container sx={{ pt: 1 }}>
            <Grid
              item
              md={12}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ py: 1, px: 1, background: "#ffedc4", display: "flex" }}
              >
                <InfoOutlinedIcon sx={{ color: "#FFCC56", mr: 1 }} />

                <span>
                  Please do not take any payment on this QR code against cash
                </span>
              </Typography>
            </Grid>
          </Grid>
          <ModalFooter btn="Accept" onClick={showQrCode} />
        </Box>
      </Modal>
    </Box>
  );
};

export default QRWarningModal;
