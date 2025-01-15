import React, { useState } from "react";
import {
  FormControl,
  Grid,
  TextField,
  Box,
  Tooltip,
  MenuItem,
  Drawer,
  Button,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import ApiEndpoints from "../network/ApiEndPoints";
import { get, postJsonData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";

const UpdateAepsScheme = ({ row, refresh }) => {
  const [open, setOpen] = useState(false);

  const [request, setRequest] = useState(false);
  const [status, setStatus] = useState(
    row?.status === 1 ? "Active" : "Inactive"
  ); // Set default status from row.status

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const UpdateAepsScheme = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      id: row?.id,
      name: form.elements["name"]?.value || "",
      slab3: form.elements["slab3"]?.value || "",
      slab4: form.elements["slab4"]?.value || "",
      slab5: form.elements["slab5"]?.value || "",
      slab6: form.elements["slab6"]?.value || "",
      slab7: form.elements["slab7"]?.value || "",
      slab8: form.elements["slab8"]?.value || "",

      slab2: form.elements["slab2"]?.value || "",
      slab1: form.elements["slab1"]?.value || "",
      ad_comm: form.elements["ad_comm"]?.value || "",
      md_comm: form.elements["md_comm"]?.value || "",
      status: status === "Active" ? 1 : 0,
      // Convert status to 1 for Active and 0 for Inactive
    };

    setRequest(true);
    postJsonData(
      ApiEndpoints.UPDATE_AEPS_SCHEME,
      data,
      setRequest,
      (res) => {
        okSuccessToast("Scheme Updated successfully");
        handleClose();
        if (refresh) refresh();
      },
      (error) => {
        apiErrorToast(error);
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
      <Tooltip title="Update Scheme">
        <Button
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
          onClick={handleOpen}
        >
          Edit
        </Button>
      </Tooltip>

      <Drawer open={open} onClose={handleClose} anchor="right">
        <Box sx={{ width: 400 }} className="sm_modal">
          <ModalHeader
            title="Update Scheme"
            handleClose={handleClose}
            subtitle="Easily Update Your Scheme Information Today."
          />
          <Box
            component="form"
            id="update-Scheme"
            noValidate
            autoComplete="off"
            onSubmit={UpdateAepsScheme}
            sx={{
              "& .MuiTextField-root": { m: 2 },
            }}
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
                    defaultValue={row?.name}
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
                    defaultValue={row.slab1}
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
                    defaultValue={row.slab2}
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
                    defaultValue={row?.slab3}
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
                    defaultValue={row?.slab4}
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
                    defaultValue={row?.slab5}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="slab6"
                    id="slab6"
                    size="small"
                    required
                    defaultValue={row?.slab5}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="slab7"
                    id="slab7"
                    size="small"
                    required
                    defaultValue={row?.slab5}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="slab8"
                    id="slab8"
                    size="small"
                    required
                    defaultValue={row?.slab5}
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
                    defaultValue={row?.ad_comm}
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
                    defaultValue={row?.md_comm}
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
              <ModalFooter
                form="update-Scheme"
                request={request}
                btn="Save Scheme"
              />
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};
export default UpdateAepsScheme;
