import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  Avatar,
  FormControl,
  Grid,
  Switch,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import { info } from "../iconsImports";
import ApiEndpoints from "../network/ApiEndPoints";
import { postFormData, postJsonData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";

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

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 40,
  height: 22,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "& + .MuiSwitch-track": {
      backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#989898",
      opacity: 1,
      border: 0,
    },
    "&.Mui-checked": {
      transform: "translateX(17px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor:
          theme.palette.mode === "dark" ? "#2ECA45" : "#49af4150",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 18,
    height: 18,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const ActiveInactiveModal = ({ row, refresh }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false); // Track API request state
  const [switchChecked, setSwitchChecked] = useState(row.status === 1);

  useEffect(() => {
    // Update switchChecked whenever row.status changes
    setSwitchChecked(row.status === 1);
  }, [row.status]);

  const toggleStatus = () => {
    const newStatus = row.status === 1 ? 0 : 1; // Toggle status
    setRequesting(true); // Start API request

    // Send API request to update status
    postFormData(
      ApiEndpoints.VIRTUAL_ACCS,
      { id: row.id, status: newStatus },
      setRequesting,
      (res) => {
        // On success, update row.status and switch state
        row.status = newStatus; // Update locally (optional, depends on how you manage state globally)
        setSwitchChecked(newStatus === 1); // Update switch state
        okSuccessToast("Status updated successfully");
        setRequesting(false);
        setOpen(false);
        if (refresh) refresh();
      },
      (error) => {
        // On error, handle appropriately (e.g., show error message)
        apiErrorToast("Error updating status", error);
        setRequesting(false);
      }
    );
  };

  const handleSubmit = () => {
    postJsonData(
      ApiEndpoints.ADMIN_DASHBOARD_GET_PRIMARY_BALANCE,
      {
        id: row?.id,
        status: !row?.status,
      },
      setLoading,
      (res) => {
        console.log("This is your response", res);
        okSuccessToast("Status updated successfully");
        handleClose();
        refresh();
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const handleSwitchChange = () => {
    // Open modal for confirmation
    setOpen(true);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (refresh) refresh();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", mr: 3 }} onClick={handleSwitchChange}>
        {row.status === 1 ? (
          <Tooltip title="Active">
            <LockOpenOutlinedIcon sx={{ color: "#00BF78" }} />
          </Tooltip>
        ) : (
          <Tooltip title="In-Active">
            <LockOutlinedIcon sx={{ color: "#DC5F5F" }} />
          </Tooltip>
        )}
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader
            title={`${switchChecked ? "Disable" : "Enable"} Account`}
            handleClose={handleClose}
          />
          <Box
            component="form"
            id="blockUnblockId"
            noValidate
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              toggleStatus();
            }}
            className="text-center"
            sx={{
              "& .MuiTextField-root": { m: 2 },
              objectFit: "contain",
              display: "grid",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar
                src={info}
                sx={{
                  width: 160,
                  height: 160,
                  objectFit: "cover",
                  objectPosition: "100% 0",
                }}
                alt="logo"
              />
            </Box>
            <Typography
              id="modal-modal-title"
              variant="h6"
              sx={{ textAlign: "center" }}
            >
              {switchChecked ? "Disable Account!!" : "Enable Account!!"}
            </Typography>

            <Typography
              id="modal-modal-description"
              sx={{ mt: 2, textAlign: "center" }}
            >
              {switchChecked
                ? "Do you want to disable account?"
                : "Do you want to enable account?"}
            </Typography>
            <Grid
              item
              md={12}
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <FormControl></FormControl>
            </Grid>
          </Box>
          <ModalFooter
            form="Update VA Status"
            request={requesting}
            btn="Submit"
            onClick={() => handleSubmit()}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default ActiveInactiveModal;
