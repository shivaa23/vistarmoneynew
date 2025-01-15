import React, { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  FormControl,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Loader from "../component/loading-screen/Loader";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";

const UserAddBankModal = ({refresh}) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [status, setStatus] = useState("");
  const [active, setActive] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    accNo: "",
    ifsc: "",
    balance: "",
    branch: "",
  });

  // Open and Close Drawer
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setFormData({
      name: "",
      accNo: "",
      ifsc: "",
      balance: "",
      branch: "",
    });
    setStatus("");
    setActive("");
    if (refresh) refresh();
    setOpen(false);
  };
  

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle Status Change
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setActive(event.target.value);
  };
  const handleActiveChange = (event) => {
   
    setActive(event.target.value);
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setRequest(true);

    postJsonData(
      ApiEndpoints.ADD_BANK,
      { ...formData, status, active },
      setRequest,
      (res) => {
        handleClose()
        okSuccessToast(res.data.message)
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Button
        variant="outlined"
        onClick={handleOpen}
        startIcon={<AddCircleOutlineIcon />}
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "8px",
          fontSize: "12px",
          color: "#ffffff",
          fontWeight: "700",
          borderRadius: "8px",
          transition: "all 0.3s ease",
          justifyContent: "center",
          background: "#00693E",
          "&:hover": {
            backgroundColor: "#122480",
          },
        }}
        aria-label="Add Bank"
      >
        Bank
      </Button>
      <Drawer open={open} onClose={handleClose} anchor="right">
        <Box sx={{ width: 400, p: 2 }}>
          <Loader loading={request} />
          <ModalHeader title="Add Bank" handleClose={handleClose} />
          <Box
            component="form"
            id="addBankForm"
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
          >
            <Grid container sx={{ pt: 1 }}>
              <Grid item xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Name"
                    id="name"
                    size="small"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Account Number"
                    id="accNo"
                    size="small"
                    value={formData.accNo}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Branch"
                    id="branch"
                    size="small"
                    value={formData.branch}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="IFSC"
                    id="ifsc"
                    size="small"
                    value={formData.ifsc}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Balance"
                    id="balance"
                    size="small"
                    value={formData.balance}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    select
                    label="Status"
                    id="status"
                    size="small"
                    value={status}
                    onChange={handleStatusChange}
                    required
                  >
                    <MenuItem value="1">Active</MenuItem>
                    <MenuItem value="0">Inactive</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    select
                    label="active"
                    id="active"
                    size="small"
                    value={active}
                    onChange={handleActiveChange}
                    required
                  >
                    <MenuItem value="1">Active</MenuItem>
                    <MenuItem value="0">Inactive</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <ModalFooter form="addBankForm" request={request} />
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default UserAddBankModal;
