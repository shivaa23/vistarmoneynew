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
import ApiEndpoints from "../network/ApiEndPoints";
import { get, postJsonData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
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

const UserEditBankModal = ({ row, refresh }) => {
  const [open, setOpen] = React.useState(false);
  const [status, setstatus] = useState(row?.status);
  const [asmList, setAsmList] = useState([]);
  const [request, setRequest] = useState(false);
  const [active, setActive] = useState(row?.status);

  const UserEditBankModal = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      id: row.id,
      name: form.name.value,
      branch: form.branch.value,
      accNo: form.accNo.value,
      balance:form.accNo.value,
      ifsc: form.ifsc.value,
      status:status,
      active:active
    };
    setRequest(true);
    postJsonData(
      ApiEndpoints.UPDATE_BANK,
      data,
      setRequest,
      (res) => {
        okSuccessToast("bank Updated successfully");
        handleClose();
        if (refresh) refresh();
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };
  const handleActiveChange = (event) => {
   
    setActive(event.target.value);
  };



  const handleOpen = () => {
  setOpen(true)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangestatus = (event) => {
    setstatus(event.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Tooltip title="update bank">
        <Button
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "8px",
            fontSize: "12px",
            color: "#ffffff",
            fontWeight: "700",
            borderRadius: "8px  ",
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
        {/* <IconButton
          style={{ fontSize: "10px", color: "#0504AA" }}
          onClick={handleOpen}
        >
          <Icon icon="raphael:edit" width={26} height={26} />
        </IconButton> */}
      </Tooltip>

      <Drawer open={open} onClose={handleClose} anchor="right">
        <Box sx={{ width: 400 }} className="sm_modal">
          <ModalHeader
            title="Update bank"
            handleClose={handleClose}
            subtitle="Easily Update Your bank Information Today."
          />
          <Box
            component="form"
            id="update-bank"
            noValidate
            autoComplete="off"
            onSubmit={UserEditBankModal}
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
                    label="Branch"
                    id="branch"
                    size="small"
                    required
                    defaultValue={row?.branch}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Account Number"
                    id="accNo"
                    size="small"
                    required
                    disabled={true}
                    defaultValue={row.accNo}
                  />
                </FormControl>
              </Grid>
       
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Ifsc"
                    id="ifsc"
                    size="small"
                    required
                    defaultValue={row.ifsc}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    select
                    label="Status"
                    id="status"
                    size="small"
                    required
                    defaultValue={status}
                    onChange={handleChangestatus}
                  >
                    <MenuItem dense value="1">
                      Active
                    </MenuItem>
                    <MenuItem dense value="0">
                      InActive
                    </MenuItem>
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
            <Box sx={{ mr: "5px" }}>
              <ModalFooter
                form="update-bank"
                request={request}
                btn="save bank"
              />
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};
export default UserEditBankModal;
