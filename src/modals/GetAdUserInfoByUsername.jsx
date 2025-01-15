import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast } from "../utils/ToastUtil";
import { useState } from "react";
import { get } from "../network/ApiController";
import { Icon } from "@iconify/react";
import { IconButton } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  // height: { xs: "32vh", md: "25vh" },
  height: "max-content",
  overflowY: "scroll",
  p: 2,
};

const GetAdUserInfoByUsername = ({ row }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);

  const [data, setData] = useState([]);
  const getData = () => {
    get(
      ApiEndpoints.GET_USER_BY_USERNAME,
      `username=${row.number}`,
      setRequest,
      (res) => {
        const data = res.data.data;
        setData(data);
        setOpen(true);
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  const handleOpen = () => {
    getData();
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
      {/* <Button
        variant="text"
        sx={{
          height: "15px",
          fontSize: "8px",
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
        User Info
      </Button> */}
      <IconButton
        onClick={handleOpen}
        sx={{ color: "#4045A1", fontSize: "15px" }}
      >
        <Icon icon="mage:information-square" width={25} height={25} />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title="User Info" handleClose={handleClose} />
          <Box
            component="form"
            id="response"
            noValidate
            autoComplete="off"
            // className="text-center"
            onSubmit={(event) => {
              handleClose();
            }}
            sx={{
              textAlign: "center",
              mt: 1,
            }}
          >
            <div>{data && data.name}</div>
            <div>{data && data.establishment}</div>
          </Box>
          <ModalFooter form="response" request={request} btn="Close" />
        </Box>
      </Modal>
    </Box>
  );
};
export default GetAdUserInfoByUsername;
