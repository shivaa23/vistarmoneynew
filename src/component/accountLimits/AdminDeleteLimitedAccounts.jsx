import React from "react";
import { useState } from "react";
import { deleteJsonData } from "../../network/ApiController";
import ApiEndpoints from "../../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../../utils/ToastUtil";
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
import Loader from "../loading-screen/Loader";

const AdminDeleteLimitedAccounts = ({ row, refresh }) => {
  const [open, setOpen] = React.useState(false);
  const [request, setRequest] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteAccount = () => {
    deleteJsonData(
      ApiEndpoints.ADMIN_ACCOUNTS_LIMITS,
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
  //   const deleteAccount = async () => {
  //     try {
  //       const res = await axios.delete(
  //         BASE_URL + ApiEndpoints.ADMIN_ACCOUNTS_LIMITS,
  //         // {
  //         // { id: row?.id },
  //         {
  //           data: { id: row?.id },
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //           },
  //         }
  //       );
  //       okSuccessToast(res?.data?.message);
  //       handleClose();
  //     } catch (error) {
  //       apiErrorToast(error);
  //     }
  //   };

  return (
    <div>
      <Tooltip title="Delete Account">
        <IconButton sx={{ color: "#ff0000" }} onClick={handleClickOpen}>
          <Icon icon="icon-park-outline:delete-five" width={26} height={26} />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{ color: "#e57373" }}>
          Delete Account
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div style={{ minWidth: "400px" }}>
              <section>
                <span>Are you sure you want to delete this account!</span>
              </section>
              <section style={{ marginTop: "18px" }}>
                <div className="my-2">
                  <span style={{ marginRight: "8px", color: "#000" }}>
                    Name:
                  </span>{" "}
                  <span
                    style={{ fontWeight: "600", color: "#000", opacity: "0.7" }}
                  >
                    {row.acc_name ?? "NA"}
                  </span>
                </div>
                <div className="my-2">
                  <span style={{ marginRight: "8px", color: "#000" }}>
                    Account:
                  </span>{" "}
                  <span
                    style={{ fontWeight: "600", color: "#000", opacity: "0.7" }}
                  >
                    {row.acc_no ?? "NA"}
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
              deleteAccount();
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

export default AdminDeleteLimitedAccounts;
