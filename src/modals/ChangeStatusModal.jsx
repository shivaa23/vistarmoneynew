import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FormControl, Grid, TextField, Tooltip } from "@mui/material";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import ApiEndpoints from "../network/ApiEndPoints";
import { postFormData } from "../network/ApiController";
import { apiErrorToast } from "../utils/ToastUtil";
import ReplayIcon from "@mui/icons-material/Replay";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useState } from "react";
import Swal from "sweetalert2";
import RightSidePannel from "../component/transactions/RightSidePannel";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  height: "auto",
  overflowY: "scroll",
  p: 2,
};

const ChangeStatusModal = ({ row, refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [status, setStatus] = useState("");

  const changeStatus = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    postFormData(
      ApiEndpoints.CHANGE_STATUS,
      {
        id: row.id,
        op_id: form.msg.value,
        status: status,
      },
      setRequest,
      (res) => {
        handleClose();
        Swal.fire(res.data.message);
        if (refresh) {
          refresh();
        }
      },
      (error) => {
        apiErrorToast(error);
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
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
        gap={2}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          {row?.status === "SUCCESS" && (
            <>
              <Tooltip title="Refund">
                <ReplayIcon
                  className="hover-zoom"
                  sx={{ color: "#FFBF00", cursor: "pointer" }}
                  onClick={() => {
                    handleOpen();
                    setStatus("REFUND");
                  }}
                />
              </Tooltip>
              <Tooltip title="Fail">
                <ClearIcon
                  className="hover-zoom"
                  sx={{ color: "red", cursor: "pointer" }}
                  onClick={() => {
                    handleOpen();
                    setStatus("FAIL");
                  }}
                />
              </Tooltip>
            </>
          )}
          {row?.status === "PENDING" && (
            <>
              <Tooltip title="Success">
                <CheckIcon
                  className="hover-zoom"
                  onClick={() => {
                    handleOpen();
                    setStatus("SUCCESS");
                  }}
                />
              </Tooltip>
              <Tooltip title="Refund">
                <ReplayIcon
                  className="hover-zoom"
                  onClick={() => {
                    handleOpen();
                    setStatus("REFUND");
                  }}
                />
              </Tooltip>
            </>
          )}
          {row?.status === "FAILED" && (
            <>
              <Tooltip title="Rollback">
                <RefreshIcon
                  className="hover-zoom"
                  sx={{ color: "blue", cursor: "pointer" }}
                  onClick={() => {
                    handleOpen();
                    setStatus("ROLLBACK");
                  }}
                />
              </Tooltip>
              <Tooltip title="Pass">
                <DownloadDoneIcon
                  className="hover-zoom"
                  sx={{ color: "green", cursor: "pointer" }}
                  onClick={() => {
                    handleOpen();
                    setStatus("PASS");
                  }}
                />
              </Tooltip>
            </>
          )}
        </Box>

        <Box
          sx={{
            mt: -1,
            ml: row?.status === "REFUND" ? 6 : 0,
            justifyContent: "end",
          }}
        >
          <RightSidePannel row={row} refresh={refresh} />
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title="Change Status" handleClose={handleClose} />
          <Box
            component="form"
            id="changeStatus"
            noValidate
            autoComplete="off"
            onSubmit={changeStatus}
            sx={{
              "& .MuiTextField-root": { m: 2 },
              objectFit: "contain",
            }}
          >
            <Grid item lg={12} md={12} xs={12}>
              <FormControl fullWidth>
                <TextField
                  autoComplete="off"
                  label="Message"
                  id="msg"
                  size="small"
                  required
                />
              </FormControl>
            </Grid>
          </Box>
          <ModalFooter
            form="changeStatus"
            request={request}
            btn="change status"
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default ChangeStatusModal;
