import { Icon } from "@iconify/react";
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
import React from "react";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { useState } from "react";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import Loader from "../component/loading-screen/Loader";

const AdminDeletesUserModal = ({ row, refresh }) => {
  //   console.log("row/", row);
  const [open, setOpen] = React.useState(false);
  const [request, setRequest] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteUser = () => {
    postJsonData(
      ApiEndpoints.DELETE_USER,
      { user_id: row.id },
      setRequest,
      (res) => {
        // console.log("res", res.data);
        if (refresh) refresh();
        okSuccessToast(res?.data?.message);
        setTimeout(() => {
          handleClose();
        }, 300);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  return (
    <div>
      <Tooltip title="Delete User">
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
          Delete User
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div style={{ minWidth: "400px" }}>
              <section>
                <span>Are you sure you want to delete this user!</span>
              </section>
              <section>
                <div className="my-2">
                  <span style={{ marginRight: "8px", color: "#000" }}>
                    Name:
                  </span>{" "}
                  <span
                    style={{ fontWeight: "600", color: "#000", opacity: "0.7" }}
                  >
                    {row.name}
                  </span>
                </div>
                <div>
                  <span style={{ marginRight: "8px", color: "#000" }}>
                    EST:
                  </span>{" "}
                  <span
                    style={{ fontWeight: "600", color: "#000", opacity: "0.7" }}
                  >
                    {row.establishment}
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
              deleteUser();
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

export default AdminDeletesUserModal;
