import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import Loader from "../component/loading-screen/Loader";
import ModalHeader from "./ModalHeader";
import { defaultLayout } from "../iconsImports";
import { get, postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast } from "../utils/ToastUtil";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";
import newNavPreview from "../assets/new_nav_preview.png";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "max-content",
  overflowY: "scroll",
};

const ChangeLayoutModal = () => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [value, setValue] = React.useState(user?.layout * 1);
  const navigate = useNavigate();
  const handleChange = (event) => {
    setValue(event.target.value * 1);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const changeSwitch = (value) => {
    const data = { layout: value * 1 };
    postJsonData(
      ApiEndpoints.UPDATE_USER_PROFILE,
      data,
      setRequest,
      (res) => {
        const data = res?.data?.data;
        // console.log("data", data);
        authCtx.saveUser(data);

        setTimeout(() => {
          if (data.layout === 2) navigate("/customer/services");
        }, 800);
        handleClose();
        // get(
        //   ApiEndpoints.GET_ME_USER,
        //   "",
        //   setRequest,
        //   (res) => {
        //     const data = res.data.data;
        //     const docs = res.data.docs;
        //     authCtx.saveUser(data);
        //     if (docs && typeof docs === "object") {
        //       authCtx.setDocsInLocal(docs);
        //     }
        //     setTimeout(() => {
        //       window.location.reload();
        //     }, 200);
        //   },
        //   (error) => {
        //     authCtx.logout();
        //     navigate("/login");
        //     apiErrorToast(error);
        //   }
        // );
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
      >
        Change Layout
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <Loader loading={request} />
          <ModalHeader
            title="Choose between layouts"
            handleClose={handleClose}
          />
          <Box sx={{ my: 3, display: "flex", justifyContent: "center" }}>
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value}
                onChange={(e) => {
                  handleChange(e);
                  changeSwitch(e.target.value);
                }}
                default
                row
              >
                <FormControlLabel
                  value={1}
                  control={<Radio />}
                  label={
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        sx={{
                          mb: 2,
                          textAlign: "center",
                          textDecoration:
                            value === 1
                              ? "underline solid #4045A1 3px"
                              : "none",
                        }}
                      >
                        Default Layout
                      </Typography>

                      <img src={defaultLayout} alt="default" width="300px" />
                    </div>
                  }
                  labelPlacement="top"
                />
                <FormControlLabel
                  value={2}
                  control={<Radio />}
                  label={
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        sx={{
                          mb: 2,
                          textAlign: "center",
                          textDecoration:
                            value === 2
                              ? "underline solid #4045A1 3px"
                              : "none",
                        }}
                      >
                        Services Layout
                      </Typography>
                      <img src={newNavPreview} alt="new_nav" width="300px" />
                    </div>
                  }
                  labelPlacement="top"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ChangeLayoutModal;
