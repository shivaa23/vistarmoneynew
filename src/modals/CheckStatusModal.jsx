import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import ApiEndpoints from "../network/ApiEndPoints";
import { postJsonData } from "../network/ApiController";
import { apiErrorToast } from "../utils/ToastUtil";
import { useState } from "react";
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

const CheckStatusModal = ({ row }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);

  const [status, setStatus] = useState([]);
  const getStatus = () => {
    postJsonData(
      ApiEndpoints.GET_STATUS,
      { id: row.id },
      setRequest,
      (res) => {
        if (res && res.data) {
          setStatus(res.data);
          setOpen(true);
        } else setStatus();
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  const handleOpen = () => {
    getStatus();
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
      <Button
        variant="text"
        sx={{
          width: "5px",
          height: "15px",
          fontSize: "8px",
          backgroundColor: "#FFE3E3",
          color: primaryColor(),
          // backgroundColor: "#9586EC",
          "&:hover": {
            color: "#fff",
            backgroundColor: primaryColor(),
          },
          borderRadius: "2px",
          mt: 0.5,
          minWidth: "45px",
          mr: 1,
        }}
        onClick={handleOpen}
      >
        status
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title="API Response" handleClose={handleClose} />
          <Box
            component="form"
            id="response"
            noValidate
            autoComplete="off"
            className="text-center"
            onSubmit={(event) => {
              handleClose();
            }}
            sx={{
              "& .MuiTextField-root": { m: 2 },
              objectFit: "contain",
              display: "grid",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                whiteSpace: "break-spaces",
                // overflow: "scroll",
                // textOverflow: "clip",
              }}
            >
              {status.message}
            </div>
          </Box>
          <ModalFooter form="response" request={request} btn="OK" />
        </Box>
      </Modal>
    </Box>
  );
};
export default CheckStatusModal;
