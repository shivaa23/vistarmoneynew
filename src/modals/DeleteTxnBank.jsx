import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Avatar, IconButton, Typography } from "@mui/material";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import { info } from "../iconsImports";
import ApiEndpoints from "../network/ApiEndPoints";
import { postJsonData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { useState } from "react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { useLocation } from "react-router-dom";

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

const DeleteTxnBank = ({ refresh, setBalance }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);

  const location = useLocation();
  const bankId = location.state.bank_id;
  const handleDelete = (event) => {
    event.preventDefault();
    postJsonData(
      ApiEndpoints.DELETE_BANK_TXN,
      { bank_id: bankId },
      setRequest,
      (res) => {
        setBalance(res.data.balance);
        okSuccessToast("Transaction deleted successfully");
        handleClose();
        if (refresh) refresh();
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
        display: "grid",
        justifyContent: "center",
      }}
    >
      <IconButton
        aria-label="refresh"
        color="error"
        onClick={() => {
          handleOpen();
        }}
      >
        <DeleteForeverOutlinedIcon className="refresh-purple" />
      </IconButton>

      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <ModalHeader title="Delete Transaction" handleClose={handleClose} />
            <Box
              component="form"
              id="DeleteTxnBank"
              noValidate
              autoComplete="off"
              onSubmit={handleDelete}
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
                Are you sure?
              </Typography>
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2, textAlign: "center" }}
              >
                you want to delete transaction
              </Typography>
            </Box>
            <ModalFooter form="DeleteTxnBank" request={request} btn="YES" />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};
export default DeleteTxnBank;
