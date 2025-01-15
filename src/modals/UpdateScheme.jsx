import React, { useState } from "react";
import {
  FormControl,
  Grid,
  TextField,
  IconButton,
  Box,
  Modal,
  Tooltip,
  MenuItem,
  Drawer,
  Button,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import ApiEndpoints from "../network/ApiEndPoints";
import { get, postJsonData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import MyButton from "../component/MyButton";
import { Icon } from "@iconify/react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "max-content",
  overflowY: "scroll",
};

const UpdateScheme = ({ row, refresh }) => {
  const [open, setOpen] = useState(false);
  const [crStatus, setCrStatus] = useState(row.crstatus);
  const [request, setRequest] = useState(false);
  const [status, setStatus] = useState(row.status===1?"Active":"Inactive"); // Set default status from row.status

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeCrStatus = (event) => {
    setCrStatus(event.target.value);
  };

  const UpdateScheme = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      id:row.id,
      name: form.elements["name"]?.value || "",
      ad: form.elements["ad"]?.value || "",
      md: form.elements["md"]?.value || "",
      ret: form.elements["ret"]?.value || "",
      dd: form.elements["dd"]?.value || "",
      status: status === "Active" ? 1 : 0, // Convert status to 1 for Active and 0 for Inactive
    };

    setRequest(true);
    postJsonData(
      ApiEndpoints.UPDATE_UTILITY_SCHEME,
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
            onSubmit={UpdateScheme}
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
                    defaultValue={row.name}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Dd"
                    id="dd"
                    size="small"
                    required
                    defaultValue={row.dd}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Ret"
                    id="ret"
                    size="small"
                    required
                    defaultValue={row.ret}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Ad"
                    id="ad"
                    size="small"
                    required
                    defaultValue={row.ad}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Md"
                    id="md"
                    size="small"
                    required
                    defaultValue={row.md}
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
export default UpdateScheme;
