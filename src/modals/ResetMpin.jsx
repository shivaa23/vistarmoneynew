import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Grid, Button, Typography } from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { useState } from "react";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { primaryColor, getEnv, secondaryColor } from "../theme/setThemeColor";
import Loader from "../component/loading-screen/Loader";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";
import { PROJECTS } from "../utils/constants";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "70%", md: "50%", lg: "40%" }, // Responsive width
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  height: "max-content",
  maxHeight: "80vh", // Limit maximum height for better scrolling on smaller screens
  overflowY: "auto", // Use auto to scroll when content overflows
  p: 2,
};
const ResetMpin = ({ variant, py, mt, username }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx && authCtx.user;
  const authUsername = user?.username;
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const envName = getEnv();
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const resetmpin = (event) => {
    event.preventDefault();
    postJsonData(
      ApiEndpoints.RESET_MPIN,
      {
        username: username? username : authUsername,
      },
      setRequest,
      (res) => {
        okSuccessToast(res?.data?.message);
        // if (refresh) refresh();
        handleClose();
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Button
        variant={variant ? variant : "contained"}
        sx={{
          fontSize: { xs: "8px", sm: "10px" },
          marginLeft: variant ? "" : "5px",
          background: variant ? "" : secondaryColor(),
          py: py ? 0.3 : undefined,
          mt: mt ? 1 : undefined,
        }}
        onClick={handleOpen}
        className="button-green"
      >
        RESET MPIN
      </Button>

      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <Loader loading={request} />
            <ModalHeader title="Reset Mpin" handleClose={handleClose} />
            <Box
              component="form"
              id="ResetMpin"
              noValidate
              autoComplete="off"
              onSubmit={resetmpin}
              sx={{
                "& .MuiTextField-root": { m: 2 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Grid container sx={{ pt: 1 }}>
                <Grid item md={12} xs={12}>
                  <Typography
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      fontSize: { xs: "20px", sm: "24px", md: "28px" },
                      fontWeight: "bold",
                    }}
                  >
                    Are you Sure?
                  </Typography>
                  <Typography
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      fontSize: { xs: "14px", sm: "16px", md: "18px" }, // Responsive font size
                      fontWeight: "bold",
                    }}
                  >
                    You want to Reset your mpin.
                  </Typography>
                  
                </Grid>
              </Grid>
            </Box>

            <ModalFooter form="ResetMpin" request={request} btn="Reset Mpin" />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};
export default ResetMpin;
