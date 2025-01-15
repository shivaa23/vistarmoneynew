import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  Avatar,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import { info } from "../iconsImports";
import ApiEndpoints from "../network/ApiEndPoints";
import { patchJsonData, postFormData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { useState } from "react";
import Loader from "../component/loading-screen/Loader";
import { primaryColor } from "../theme/setThemeColor";

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

const ActiveInactiveOpServices = ({ row, refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);

  const blockUnblock = (event) => {
    event.preventDefault();
    patchJsonData(
      ApiEndpoints.ADMIN_OP_SERVICE,
      { id: row?.id },
      "",
      setRequest,
      (resp) => {
        okSuccessToast("Services Updated..");
        if (refresh) refresh();
      },
      (err) => {
        apiErrorToast(err);
      }
    );
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
        display: "grid",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: "100%" }} onClick={handleOpen}>
        <FormControlLabel
          className="ms-1"
          control={
            <Switch
              size="small"
              checked={row?.status === 1}
              sx={{
                // "& .MuiSwitch-switchBase.Mui-checked": {
                //   color: "green",
                // },

                "&.MuiSwitch-root .MuiSwitch-switchBase": {
                  color: "red",
                },
                "&.MuiSwitch-root .Mui-checked": {
                  color: "green",
                },
              }}
              // sx={{ color: row?.active === 1 ? "green" : "red" }}
              // color={row?.active === 1 ? "success" : "warning"}
            />
          }
        />
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <Loader loading={request} />
          <ModalHeader
            subtitle="Control User Status: Activate or Deactivate."
            title="Block Un-block Service"
            handleClose={handleClose}
          />
          <Box
            component="form"
            id="blockUnblockId"
            noValidate
            autoComplete="off"
            onSubmit={blockUnblock}
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
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              {row.status !== 1 ? "Activate Service" : "In-Activate Service"}
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ mt: 2, textAlign: "center" }}
            >
              {row.status !== 1
                ? "Do you want to Activate Service " + row.name
                : "Do you want to In-Activate Service " + row.name}
            </Typography>
            <Grid
              item
              md={12}
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            ></Grid>
          </Box>
          <ModalFooter form="blockUnblockId" request={request} btn="Proceed" />
        </Box>
      </Modal>
    </Box>
  );
};
export default ActiveInactiveOpServices;
