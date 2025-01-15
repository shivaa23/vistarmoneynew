import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Modal, Button } from "@mui/material";
import ModalFooter from "./ModalFooter";
import VendorPayments from "../View/VendorPayments";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { IconButton } from "rsuite";

const modalStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  overflowY: "auto",
};

const SuperTransferModel = ({ resetView }) => {
  const [open, setOpen] = useState(true); // Modal is open by default
  const [request, setRequest] = useState(false);

  const handleClose = () => {
    resetView(null); // Close the modal when the close button is clicked
  };

  return (
    <Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="send-notification-title"
        aria-describedby="send-notification-description"
      >
        <Box sx={modalStyle}>
          {/* Header: Back button on the left, Close button on the right */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between", // Space between items
              alignItems: "center", // Align items vertically in the center
              mb: 2, // Margin below the row
            }}
          >
            {/* Left-aligned Back button */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={handleClose} // Handle close modal
              sx={{
                backgroundColor: "#1976d2", // Primary blue color
                color: "#fff", // White text
                "&:hover": {
                  backgroundColor: "#115293", // Darker blue on hover
                },
                textTransform: "none", // Keep text in normal case
                borderRadius: "8px", // Rounded corners
                fontFamily: "Poppins", // Custom font
                fontWeight: 500,
                fontSize: "19px",
              }}
            >
              Back
            </Button>

            {/* Right-aligned Close button */}
            <IconButton
              onClick={handleClose} // Handle close modal
              sx={{
                fontSize: "29px", // Larger icon size
                color: "#000", // Default black color
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          {/* Vendor Payments content */}
          <Box  sx={{ "& .MuiTextField-root": { m: 2 } }}>
            <VendorPayments />
          </Box>

          {/* Footer: Modal Footer with a Send button */}
          <Box sx={{ textAlign: "right", mr: 2 }}>
            {/* <ModalFooter form="send_notification" request={request} btn="Send" /> */}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default SuperTransferModel;
