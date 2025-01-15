import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import Loader from "../component/loading-screen/Loader";
import ModalHeader from "./ModalHeader";
import { get } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast } from "../utils/ToastUtil";
import LabelComponent from "../component/LabelComponent";
import DetailsComponent from "../component/DetailsComponent";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "max-content",
  overflowY: "scroll",
};

const ViewVirtualAcct = () => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [apiData, setApiData] = useState(null);

  const handleOpen = () => {
    get(
      ApiEndpoints.GET_VIRTUAL_ACC,
      "",
      setRequest,
      (res) => {
        setApiData(res?.data?.data);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Button
        variant="contained"
        style={{
          fontSize: "10px",
          marginLeft: "5px",
          // background: secondaryColor(),
        }}
        onClick={handleOpen}
        className="otp-hover-purple"
        disabled={request}
      >
        {request ? <Loader loading={request} size={18} /> : "Virtual Acc"}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <Loader loading={request} />
          <ModalHeader title="View Account" handleClose={handleClose} />
          {apiData ? (
            <Grid container sx={{ my: 3 }}>
              <Grid
                item
                md={6}
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ textAlign: "left" }}>
                  <LabelComponent fontSize="15px" label="RBL Account" />
                  <DetailsComponent fontSize="15px" detail={apiData?.va} />
                </Box>
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ textAlign: "left" }}>
                  <LabelComponent fontSize="15px" label="IFSC" />
                  <DetailsComponent fontSize="15px" detail="RATN0000500" />
                </Box>
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  mt: 3,
                }}
              >
                <LabelComponent fontSize="15px" label="Allowed Accounts" />
                <DetailsComponent
                  fontSize="15px"
                  detail={apiData?.allowed_accounts}
                />
              </Grid>
            </Grid>
          ) : (
            <Grid container>
              {" "}
              <Grid item md={12} xs={12}>
                <Typography>
                  No Virtual accounts found!. Contact Admin
                </Typography>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ViewVirtualAcct;
