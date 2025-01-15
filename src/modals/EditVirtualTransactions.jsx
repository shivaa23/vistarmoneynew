import React, { useState } from "react";
import {
  FormControl,
  Grid,
  TextField,
  IconButton,
  Box,
  Modal,
  Tooltip,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { Icon } from "@iconify/react";
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
  height: "max-content",
  overflowY: "scroll",
};

const EditVirtualTransactions = ({ row, refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [status, setStatus] = useState(row?.status || "PENDING"); // Initial status value

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Collecting the data to log or submit
    const data = {
      acc_number: row.acc_number,
      sender_name: row.sender_name,
      va_account: row.va_account,
      amount: row.amount,
      status: status, // Get status from state
    };
    
    // Log the submitted data

    // You can make an API call here if needed
    // postJsonData(ApiEndpoints.YOUR_ENDPOINT, data).then(...).catch(...);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Tooltip title="Edit Operator">
        <IconButton onClick={handleOpen}>
          <Icon
            icon="basil:edit-solid"
            style={{ fontSize: "22px" }}
            className="refresh-icon-risk"
          />
        </IconButton>
      </Tooltip>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title="Virtual Transactions" handleClose={handleClose} />
          <Box
            component="form"
            id="edit_Transactions"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": { m: 2 },
              objectFit: "contain",
              overflowY: "scroll",
            }}
          >
            <Grid container sx={{ pt: 1 ,mt:-2.3}}>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Account Number"
                    id="acc_number"
                    size="small"
                    defaultValue={row.acc_number}
                    required
                    disabled
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Sender Name"
                    id="sender_name"
                    size="small"
                    defaultValue={row.sender_name}
                    required
                    disabled
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="VA"
                    id="va"
                    size="small"
                    defaultValue={row.va_account}
                    required
                    disabled
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Balance"
                    id="balance"
                    size="small"
                    defaultValue={row.amount}
                    required
                    disabled
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "94%", ml:2}}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)} // Handle status change
                    size="small"
                  >
                    <MenuItem value="SUCCESS">SUCCESS</MenuItem>
                    <MenuItem value="PENDING">PENDING</MenuItem>
                    <MenuItem value="REJECTED">REJECTED</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <ModalFooter form="edit_Transactions" request={request} btn="Proceed" />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default EditVirtualTransactions;
