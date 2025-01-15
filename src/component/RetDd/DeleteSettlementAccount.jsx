import React from "react";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { deleteJsonData } from "../../network/ApiController";
import ApiEndpoints from "../../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../../utils/ToastUtil";
import Loader from "../../commons/Loader";

const DeleteSettlementAccount = ({ row, refresh }) => {
  const [open, setOpen] = React.useState(false);
  const [request, setRequest] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteEmployee = () => {
    deleteJsonData(
      ApiEndpoints.DMR_SETTLEMENTS,
      { id: row.id },
      "",
      setRequest,
      (res) => {
        okSuccessToast(res?.data?.message);
        if (refresh) refresh();
        handleClose();
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  return (
    <div>
      <Tooltip title="Delete Account">
        <IconButton onClick={handleClickOpen}>
          <Icon
            icon="ic:outline-delete"
            style={{ color: "red", fontSize: "24px" }}
          />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{ color: "#e57373" }}>
          Delete Beneficiary
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div style={{ minWidth: "400px" }}>
              <section>
                <span>Are you sure you want to delete this Beneficiary!</span>
              </section>
              <section style={{ marginTop: "18px" }}>
                <div className="my-2">
                  <span style={{ marginRight: "8px", color: "#000" }}>
                    Name:
                  </span>{" "}
                  <span
                    style={{ fontWeight: "600", color: "#000", opacity: "0.7" }}
                  >
                    {row.name ?? "NA"}
                  </span>
                </div>
                <div className="my-2">
                  <span style={{ marginRight: "8px", color: "#000" }}>
                    Bank:
                  </span>{" "}
                  <span
                    style={{ fontWeight: "600", color: "#000", opacity: "0.7" }}
                  >
                    {row.bank ?? "NA"}
                  </span>
                </div>
                <div className="my-2">
                  <span style={{ marginRight: "8px", color: "#000" }}>
                    Account:
                  </span>{" "}
                  <span
                    style={{ fontWeight: "600", color: "#000", opacity: "0.7" }}
                  >
                    {row.acc_number ?? "NA"}
                  </span>
                </div>
                <div>
                  <span style={{ marginRight: "8px", color: "#000" }}>
                    IFSC:
                  </span>{" "}
                  <span
                    style={{ fontWeight: "600", color: "#000", opacity: "0.7" }}
                  >
                    {row.ifsc ?? "NA"}
                  </span>
                </div>
              </section>
            </div>
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
            }}
            variant="contained"
            sx={{ backgroundColor: "#ef5350", p: 0.6, fontSize: "12px" }}
          >
            Cancel
          </Button>
          <Button
            autoFocus
            variant="contained"
            sx={{ backgroundColor: "#4caf50", p: 0.6, fontSize: "12px" }}
            onClick={() => {
              deleteEmployee();
            }}
            disabled={request}
          >
            <Loader loading={request} size="small" />
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteSettlementAccount;
