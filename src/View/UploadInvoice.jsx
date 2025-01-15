import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

const UploadInvoice = () => {
  const [open, setOpen] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleProceed = () => {
    // Handle the proceed action (form submission, file upload, etc.)
    console.log("GST Invoice Date:", invoiceDate);
    console.log("GST Invoice Number:", invoiceNumber);
    console.log("Selected File:", selectedFile);
  };

  return (
    <>
      <Tooltip title="Upload Invoice">
        <IconButton onClick={handleOpen}>
          <UploadIcon sx={{ cursor: "pointer" }} />
        </IconButton>
      </Tooltip>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {/* Close Icon */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#000",
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Title */}
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
          >
            Upload GST Invoice
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              bgcolor: "#fdf3d3",
              p: 2,
              borderRadius: "4px",
              color: "#333",
            }}
          >
            I confirm that the invoice being uploaded is based upon the
            commission summary provided by VistarMoney. Upon verification of the
            invoice by VistarMoney, GST credit of{" "}
            <span style={{ color: "red" }}>₹000000</span> will be credited to
            your VistarMoney account.
          </Typography>

          {/* Native DatePicker */}
          <TextField autoComplete="off"
            label="GST Invoice Date"
            type="date"
            fullWidth
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
          />

          {/* GST Invoice Number */}
          <TextField autoComplete="off"
            label="GST Invoice Number"
            fullWidth
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* File Upload */}
          <Box
            sx={{
              border: "2px dashed #ccc",
              borderRadius: "8px",
              textAlign: "center",
              py: 3,
              mb: 2,
              cursor: "pointer",
            }}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <input
              id="fileInput"
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <CloudUploadIcon sx={{ fontSize: 50, color: "#ccc" }} />
            <Typography variant="body1" sx={{ mt: 1 }}>
              Drop your pdf file here
            </Typography>
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 1, color: "green" }}>
                {selectedFile.name}
              </Typography>
            )}
          </Box>

          {/* Proceed Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleProceed}
            sx={{ bgcolor: "#007bff", color: "#fff" }}
          >
            Proceed
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default UploadInvoice;
