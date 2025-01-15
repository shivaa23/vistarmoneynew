import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Tooltip,
  IconButton,
  Modal,
  Typography,
  Paper,
  Drawer,
} from "@mui/material";
import Loader from "../loading-screen/Loader"; 
import ModalHeader from "../../modals/ModalHeader";
import ModalFooter from "../../modals/ModalFooter";
import { postJsonData } from "../../network/ApiController";
import ApiEndpoints from "../../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../../utils/ToastUtil";
import { Icon } from "@iconify/react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "70%", md: "50%", lg: "40%" },
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 0, // Remove padding for a cleaner layout
  maxHeight: "80vh",
  overflow: "hidden", // Prevent the modal from scrolling entirely
  borderRadius: 2,
  display: "flex",
  flexDirection: "column",
};

const contentStyle = {
  flexGrow: 1,
  overflowY: "auto", // Make the content scrollable
  p: 3, // Add padding for content
};

const EditVirtualAccounts = ({ refresh, row,refreshFunc }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const allowedAccountsInitial = row.allowed_accounts
    ? row.allowed_accounts.split(",")
    : [];
  const [allowedAccounts, setAllowedAccounts] = useState(
    allowedAccountsInitial
  );
  const [newAccount, setNewAccount] = useState(""); // Holds the current value of the new account input

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    refreshFunc()
    setAllowedAccounts(allowedAccountsInitial);
    if (refresh) refresh();
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedAccounts = [...allowedAccounts, newAccount.trim()].filter(
      (account) => account
    );
    refreshFunc()
    let data = {
      allowed_accounts: updatedAccounts.join(","), // Join the list back into a string
      id: row.id,
    };

    postJsonData(
      ApiEndpoints.VIRTUAL_ACCS,
      data,
      setRequest,
      (res) => {
        okSuccessToast(res?.data?.message);
        if (refresh) refresh();
        refreshFunc()
        handleClose();
      },
      (err) => {
        apiErrorToast(err);
        if (refresh) refresh();
      }
    );
    refresh();
  };

  const handleDeleteAccount = (index) => {
    setAllowedAccounts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddAccount = () => {
    if (newAccount.trim()) {
      setAllowedAccounts((prev) => [...prev, newAccount.trim()]);
      setNewAccount(""); // Reset the new account input
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Tooltip title="Edit Virtual Account">
        <IconButton onClick={handleOpen}>
          <Icon
            icon="basil:edit-solid"
            style={{ fontSize: "24px" }}
            className="refresh-icon-risk"
          />
        </IconButton>
      </Tooltip>
      <Drawer
        open={open}
        onClose={handleClose}
      anchor="right"
      >
        <Box sx={{width:400}} className="sm_modal">
          <ModalHeader title="Edit Virtual Account" handleClose={handleClose}  subtitle="Easily Edit Your Virtual Account Details."/>
          <Box sx={contentStyle}>
            <Loader loading={request} />
            <Box
              component="form"
              id="accountlimit"
              validate="true"
              autoComplete="off"
              onSubmit={handleSubmit}
              sx={{
                "& .MuiTextField-root": { mb: 2 },
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      <strong>User:</strong> {row.establishment}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      <strong>Virtual Amount:</strong> {row.va}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      <strong>Allowed Accounts:</strong>
                    </Typography>
                    <Box
                      sx={{
                        maxHeight: "200px", // Restrict the height of the accounts list
                        overflowY: "auto", // Make it scrollable if it exceeds maxHeight
                      }}
                    >
                      {allowedAccounts.map((account, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography>{account}</Typography>
                          <Tooltip title="Delete Account">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteAccount(index)}
                            >
                              <Icon
                                icon="mdi:delete"
                                style={{ fontSize: "20px", color: "red" }}
                              />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ))}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                      <TextField autoComplete="off"
                        label="New Account"
                        value={newAccount}
                        onChange={(e) => setNewAccount(e.target.value)}
                        size="small"
                        fullWidth
                      />
                      <Tooltip title="Add Account">
                        <IconButton
                          onClick={handleAddAccount}
                          disabled={!newAccount.trim()}
                          sx={{ ml: 2 }}
                        >
                          <Icon
                            icon="mdi:plus-circle"
                            style={{ fontSize: "24px", color: "green" }}
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
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
  );
};

export default EditVirtualAccounts;
