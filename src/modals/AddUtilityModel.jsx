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

const AddUtilityModel = ({ refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [asmList, setAsmList] = useState([]);
  const [currentAsm, setCurrentAsm] = useState("");
  const [status, setStatus] = useState("Active"); // New state for status dropdown

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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      name: form.elements["name"]?.value || "",
      ad: form.elements["ad"]?.value || "",
      md: form.elements["md"]?.value || "",
      ret: form.elements["ret"]?.value || "",
      dd: form.elements["dd"]?.value || "",
      status: status === "Active" ? 1 : 0, // Map status to 1 for Active and 0 for Inactive
    };
  
    setRequest(true);
    postJsonData(
      ApiEndpoints.CREATE_UTILITY_SCHEME,
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
  

  const getAsmList = () => {
    get(
      ApiEndpoints.GET_USERS,
      `page=1&paginate=10&role=Asm&export=`,
      setRequest,
      (res) => {
        const asmArray = res.data.data;
        setAsmList(
          asmArray &&
            asmArray.map((item) => ({
              id: item.id,
              name: item.name,
            }))
        );
        setOpen(true);
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
                    <TextField autoComplete="off" label="Name" id="name" size="small" required />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off" label="Dd" id="dd" size="small" required />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off" label="Ret" id="ret" size="small" required />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off" label="Ad" id="ad" size="small" required />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off" label="Md" id="md" size="small" required />
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

export default AddUtilityModel;
