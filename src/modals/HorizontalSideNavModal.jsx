import { Box, Modal } from "@mui/material";
import React from "react";
import { useState } from "react";
import Loader from "../component/loading-screen/Loader";
import ModalHeader from "./ModalHeader";

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

const HorizontalSideNavModal = ({ children, title, open, setOpen }) => {
  // console.log("open", open);
  const [request, setRequest] = useState(false);
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
        justifyContent: "end",
      }}
    >
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <Loader loading={request} />
          <ModalHeader title={title} handleClose={handleClose} />
          {children}
        </Box>
      </Modal>
    </Box>
  );
};

export default HorizontalSideNavModal;
