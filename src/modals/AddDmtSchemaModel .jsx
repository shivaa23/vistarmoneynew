import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  FormControl,
  Grid,
  TextField,
  Tooltip,
  IconButton,
  MenuItem,
  Button,
  Drawer,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { get, postJsonData } from "../network/ApiController";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState } from "react";
import { whiteColor } from "../theme/setThemeColor";

const AddDmtSchemaModel = ({ refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);

  const [status, setStatus] = useState("Active"); // New state for status dropdown
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      
      name: form.elements["name"]?.value || "",
      slab3: form.elements["slab3"]?.value || "",
      slab4: form.elements["slab4"]?.value || "",
      slab5: form.elements["slab5"]?.value || "",
      slab2: form.elements["slab2"]?.value || "",
      slab1: form.elements["slab1"]?.value || "",
      ad_comm: form.elements["ad_comm"]?.value || "",
      md_comm: form.elements["md_comm"]?.value || "",
      status: status === "Active" ? 1 : 0, 
      // Convert status to 1 for Active and 0 for Inactive
    };
  
    setRequest(true);
    postJsonData(
      ApiEndpoints.CREATE_DMT_SCHEME,
      data,
      setRequest,
      (res) => {
        okSuccessToast("Scheme added successfully");
        handleClose();
        if (refresh) refresh();
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };
  

  return (
    <Box sx={{ display: "flex", justifyContent: "end" }}>
      <Tooltip title="Add Scheme">
        <Button
          variant="outlined"
          className="refresh-icon-risk"
          onClick={handleOpen}
          startIcon={
            <IconButton sx={{ p: 0, color: whiteColor() }}>
              <AddCircleOutlineIcon />
            </IconButton>
          }
          sx={{ py: 0.3 }}
        >
       Scheme
        </Button>
      </Tooltip>

      <Box>
        <Drawer open={open} anchor="right" onClose={handleClose}>
          <Box sx={{ width: 400 }}>
            <ModalHeader title="Add Scheme" handleClose={handleClose} subtitle="Easily Add New scheme with DilliPay" />
            <Box
              component="form"
              id="update-Scheme"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
              sx={{ "& .MuiTextField-root": { m: 2 } }}
            >
         <Grid container sx={{ pt: 1 }}>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Name"
                    id="name"
                    size="small"
                    required
                    // defaultValue={row?.name}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="slab1"
                    id="slab1"
                    size="small"
                    required
                    // defaultValue={row.slab1}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="slab2"
                    id="slab2"
                    size="small"
                    required
                    // defaultValue={row.slab2}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="slab3"
                    id="slab3"
                    size="small"
                    required
                    // defaultValue={row?.slab3}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="slab4"
                    id="slab4"
                    size="small"
                    required
                    // defaultValue={row?.slab4}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="slab5"
                    id="slab5"
                    size="small"
                    required
                    // defaultValue={row?.slab5}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="ad_comm"
                    id="ad_comm"
                    size="small"
                    required
                    // defaultValue={row?.ad_comm}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="md_comm"
                    id="md_comm"
                    size="small"
                    required
                    // defaultValue={row?.md_comm}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    select
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    size="small"
                    required
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
            </Grid>
              <Box sx={{ mr: "5px" }}>
                <ModalFooter form="update-Scheme" request={request} btn="Save Scheme" />
              </Box>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default AddDmtSchemaModel ;
