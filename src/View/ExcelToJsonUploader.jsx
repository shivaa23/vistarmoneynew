import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
} from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { postJsonData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import ApiEndpoints from "../network/ApiEndPoints";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
  maxHeight: "80vh",
  overflowY: "auto",
};

const ExcelToJsonUploader = ({ bankId, setRequest, refresh,setQuery }) => {
  const [jsonData, setJsonData] = useState([]); // State to store parsed JSON data
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Unique key for file input reset

  const handleClose = () => {
    setIsModalOpen(false);
    setJsonData([]);
    setFileInputKey(Date.now()); // Reset file input by changing the key
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsedData = XLSX.utils.sheet_to_json(worksheet);

      setJsonData(parsedData); // Store JSON data in state
      setIsModalOpen(true); // Open modal to display data
      okSuccessToast("File uploaded successfully. Review the data and upload.");
    } catch (error) {
      apiErrorToast("Error reading file: " + error.message);
    }
  };

  const handleRowUpload = (row, index) => {
    const data = {
      bankid: bankId,
      description: row?.description || "",
      credit: row?.credit || 0,
      debit: row?.debit || 0,
      remark: row?.remarks || "",
      mop: row?.mop || "",
    };

    postJsonData(
      ApiEndpoints.ADD_BANK_TXN,
      data,
      setRequest,
      () => {
        okSuccessToast(`Row ${index + 1}: Transaction added successfully.`);
        // if (refresh) refresh();
        refresh(setQuery)
        // setIsModalOpen(false)
        handleClose()

      },
      (error) => {
        apiErrorToast(`Row ${index + 1}: ${error.message}`);
      }
    );
  };

  const handleUploadAll = () => {
    jsonData.forEach((row, index) => {
      handleRowUpload(row, index);
    });
  };

  return (
    <div>
      {/* File Upload Input */}
      <Tooltip title="Upload Excel File">
        <IconButton color="primary" component="label">
          <UploadFile />
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            hidden
            key={fileInputKey} // Add unique key for reset
          />
        </IconButton>
      </Tooltip>

      {/* Modal to Display Data */}
      <Modal open={isModalOpen} onClose={handleClose}>
        <Box sx={modalStyle}>
          <h2>Uploaded Data</h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Credit</TableCell>
                  <TableCell>Debit</TableCell>
                  <TableCell>Remarks</TableCell>
                  <TableCell>MOP</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jsonData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.description || "N/A"}</TableCell>
                    <TableCell>{row.credit || 0}</TableCell>
                    <TableCell>{row.debit || 0}</TableCell>
                    <TableCell>{row.remarks || "N/A"}</TableCell>
                    <TableCell>{row.mop || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Upload All Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleUploadAll}
            style={{ marginTop: "20px", display: "flex", justifyContent: "end" }}
          >
            Upload Excel
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ExcelToJsonUploader;
