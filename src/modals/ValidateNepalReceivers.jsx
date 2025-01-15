import {
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { info } from "../iconsImports";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast } from "../utils/ToastUtil";
import Loader from "../component/loading-screen/Loader";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  height: "max-ceontent",
  overflowY: "scroll",
  p: 2,
};

const ValidateNepalReceivers = (props) => {
  const { accNo, token, reqNo, nepalAllRes } = props;
  const [open, setOpen] = useState(false);
  const [req, setReq] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postJsonData(
      ApiEndpoints.NEPAL_VALIDATE_RECEIVER,
      {
        AccountNumber: accNo,
      
      },
      setReq,
      (res) => {
        console.log("validate", res.data);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Button
        variant="contained"
        onClick={handleOpen}
        className="button-red"
        sx={{
          display: { md: "block", sm: "none", xs: "none" },
          fontSize: "10px",
          padding: "0px 5px !important",
          textTransform: "uppercase",
          minWidth: "58px !important",
          position: "absolute",
          bottom: "-1px",
          left: "-5px",
        }}
      >
        Verify
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal position-relative">
          <Loader loading={req} />
          <ModalHeader
            title="Verify Receiver's Bank"
            handleClose={handleClose}
          />
          <Box
            component="form"
            id="verifyReceiversBank"
            validate
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
          >
            <Grid container>
              <Grid item md={12} xs={12}>
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
                  you want to verify
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <ModalFooter
            form="verifyReceiversBank"
            //   request={request}
            btn="Verify"
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default ValidateNepalReceivers;
