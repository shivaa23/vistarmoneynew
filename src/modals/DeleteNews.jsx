import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Avatar, IconButton, Tooltip, Typography } from "@mui/material";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import { info } from "../iconsImports";
import ApiEndpoints from "../network/ApiEndPoints";
import { deleteJsonData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { useState } from "react";
import { Icon } from "@iconify/react";

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

const DeleteNews = ({ row, refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);

  const blockUnblock = (event) => {
    event.preventDefault();
    deleteJsonData(
      ApiEndpoints.GET_NEWS,
      { id: row.id },
      "",
      setRequest,
      (res) => {
        handleClose();
        okSuccessToast(" Deleted");
        if (refresh) {
          refresh();
        }
      },
      (error) => {
        apiErrorToast("error=>", error);
      }
    );
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
        display: "grid",
        justifyContent: "center",
      }}
    >
      <Tooltip title="Active">
        <IconButton sx={{ color: "#ff0000" }} onClick={handleOpen}>
          <Icon icon="icon-park-outline:delete-five" width={25} height={25} />
        </IconButton>
      </Tooltip>

      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <ModalHeader
              title="Delete News "
              handleClose={handleClose}
              subtitle="Easily Delete Your News  in Seconds."
            />
            <Box
              component="form"
              id="DeleteNews"
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
                Are you sure?
              </Typography>
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2, textAlign: "center" }}
              >
                you want to delete News  {row.acc_no}
              </Typography>
            </Box>
            <Box sx={{ mr: "10px" }}>
              <ModalFooter form="DeleteNews" request={request} btn="YES" />
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};
export default DeleteNews;
