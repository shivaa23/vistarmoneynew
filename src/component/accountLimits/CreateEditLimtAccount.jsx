import * as React from "react";
import Box from "@mui/material/Box";

import {
  FormControl,
  Grid,
  TextField,
  Button,
  Tooltip,
  IconButton,
  Modal,
  MenuItem,
  Drawer,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Loader from "../loading-screen/Loader";
import { useState } from "react";
import ModalHeader from "../../modals/ModalHeader";
import ModalFooter from "../../modals/ModalFooter";
import { patchJsonData, postJsonData } from "../../network/ApiController";
import ApiEndpoints from "../../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../../utils/ToastUtil";
import { Icon } from "@iconify/react";
import { primaryLight, whiteColor } from "../../theme/setThemeColor";
import { useEffect } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "max-content",
  overflowY: "scroll",
};

const CreateEditLimitAccount = ({ refresh, edit = false, row }) => {
  const [open, setOpen] = React.useState(false);
  const [request, setRequest] = useState(false);
  const [accType, setAccType] = useState("default");

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setAccType("default");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    let data = {
      acc_no: form.acc_no.value,
      acc_name: form.acc_name.value,
      ifsc: form.ifsc.value,
      acc_type: accType,
      acc_limit: form.acc_limit.value,
      id: edit ? row.id : undefined,
    };

    edit
      ? patchJsonData(
          ApiEndpoints.ADMIN_ACCOUNTS_LIMITS,
          data,
          "",
          setRequest,
          (res) => {
            okSuccessToast(res?.data?.message);
            if (refresh) refresh();
            handleClose();
          },
          (err) => {
            apiErrorToast(err);
            if (refresh) refresh();
          }
        )
      : postJsonData(
          ApiEndpoints.ADMIN_ACCOUNTS_LIMITS,
          data,
          setRequest,
          (res) => {
            okSuccessToast(res?.data?.message);
            if (refresh) refresh();
            handleClose();
          },
          (err) => {
            apiErrorToast(err);
            if (refresh) refresh();
          }
        );
  };

  useEffect(() => {
    setAccType(row?.acc_type);
  }, [row]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      {" "}
      {edit ? (
        <Tooltip title="Edit Account">
          <IconButton sx={{ color: "#0504AA" }} onClick={handleOpen}>
            <Icon icon="raphael:edit" width={25} height={25} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add Account">
          <Button
            variant="outlined"
            // className="button-transparent"
            className="refresh-icon-risk"
            onClick={handleOpen}
            startIcon={
              <IconButton
                sx={{
                  p: 0,

                  color: whiteColor(),
                }}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            }
            sx={{ py: 0.3 }}
          >
            Account
          </Button>
        </Tooltip>
      )}
      <Box>
        <Drawer anchor="right" open={open} onClose={handleClose}>
          <Box sx={{ width: 400 }} className="sm_modal">
            <Loader loading={request} />
            <ModalHeader
            subtitle="Start Your Journey: Create Your Account"
              title={edit ? `Edit Account` : `Create Account`}
              handleClose={handleClose}
            />
            <Box
              component="form"
              id="accountlimit"
              validate
              autoComplete="off"
              onSubmit={handleSubmit}
              sx={{
                "& .MuiTextField-root": { m: 2 },
              }}
            >
              <Grid container sx={{ pt: 1 }}>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      autoComplete="off"
                      label="Account Name"
                      id="acc_name"
                      size="small"
                      required
                      defaultValue={edit ? row?.acc_name : ""}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      autoComplete="off"
                      label="Account Number"
                      id="acc_no"
                      size="small"
                      required
                      defaultValue={edit ? row?.acc_no : ""}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      autoComplete="off"
                      label="Account IFSC"
                      id="ifsc"
                      size="small"
                      required
                      defaultValue={edit ? row?.ifsc : ""}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      autoComplete="off"
                      label="Account Type"
                      id="acc_type"
                      size="small"
                      required
                      select
                      value={accType}
                      onChange={(e) => setAccType(e.target.value)}
                    >
                      <MenuItem value="default">Select Account Type</MenuItem>
                      <MenuItem value="current">Current</MenuItem>
                      <MenuItem value="saving">Saving</MenuItem>
                    </TextField>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      autoComplete="off"
                      label="Account Limit"
                      id="acc_limit"
                      size="small"
                      required
                      type="number"
                      defaultValue={edit ? row?.acc_limit : ""}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{mr:"10px"}}>
            <ModalFooter
              form="accountlimit"
              type="submit"
              btn="Submit"
              disable={request}
            />
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};
export default CreateEditLimitAccount;
