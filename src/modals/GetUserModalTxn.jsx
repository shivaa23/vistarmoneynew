import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button, Typography } from "@mui/material";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast } from "../utils/ToastUtil";
import { useState } from "react";
import { get } from "../network/ApiController";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  height: { xs: "35vh", md: "45vh" },
  overflowY: "scroll",
  p: 2,
};

const GetUserModalTxn = ({ row }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);

  const [userVal, setUserVal] = useState([]);
  const getUserValue = () => {
    get(
      ApiEndpoints.GET_USER_BY_ID,
      `id=${row && row.user_id}`,
      setRequest,
      (res) => {
        const user = res.data.data;
        setUserVal({
          id: user && user.id,
          name: user && user.name,
          mob: user && user.username,
        });
        setOpen(true);
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  const handleOpen = () => {
    getUserValue();
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
          height: "8px",
          fontSize: "8px",
        }}
        onClick={handleOpen}
      >
        user
      </Button>

      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <ModalHeader title="ASM" handleClose={handleClose} />
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
                justifyContent: "left",
                alignItems: "left",
              }}
            >
              <Typography>User</Typography>
              <Box
                sx={{
                  display: "flex",
                  mx: 3,
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div>{userVal && userVal.name}</div>
                <div>{userVal && userVal.mob}</div>
              </Box>
            </Box>
            <ModalFooter form="response" request={request} btn="YES" />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};
export default GetUserModalTxn;
