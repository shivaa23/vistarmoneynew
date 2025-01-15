import {
  FormControl,
  Grid,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import PinInput from "react-pin-input";
import Loader from "../component/loading-screen/Loader";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { PATTERNS } from "../utils/ValidationUtil";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import ResetMpin from "./ResetMpin";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button } from "rsuite";
import { whiteColor } from "../theme/setThemeColor";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 3,
};
const AddBookModal = ({ refresh }) => {
  const [request, setRequest] = useState(false);
  const [open, setOpen] = useState(false);
  const [mpin, setMpin] = useState();
  const [err, setErr] = useState("");
  const [isValName, setisValName] = useState(true);
  const [isValMob, setisValMob] = useState(true);
  const [isValBname, setisValBname] = useState(true);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //API CALL
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.name.value;
    const business = form.b_name.value;
    const mobile = form.mobile.value;
    const data = {
      name: name,
      establishment: business,
      mobile: mobile,
      mpin: mpin,
    };
    if (mpin !== "") {
      postJsonData(
        ApiEndpoints.ADD_BOOKS,
        data,
        setRequest,
        (res) => {
          if (refresh) refresh();
          okSuccessToast(res.data.message);
          handleClose();
        },
        (error) => {
          if (error && error) {
            if (error.response.data.message === "Invalid M Pin") {
              setErr(error.response.data);
            } else {
              setErr("");
              handleClose();
              apiErrorToast(error);
            }
          } else {
            setErr("");
            setMpin("");
            const error = {
              message: "MPIN required",
            };
            setErr(error);
          }
        }
      );
    }
  };
  return (
    <Box sx={{ display: "flex", justifyContent: "end" }}>
      <Tooltip title="Add New Book">
      <Button
            variant="outlined"
            // className="button-transparent"
            className="refresh-icon-risk"
            onClick={handleOpen}
            startIcon={
              <IconButton
                sx={{
                  p: 0,

                  color: whiteColor(),
                }}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            }
          
          >
       New Book
          </Button>
      </Tooltip>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <Loader loading={request} />

          <ModalHeader title="Add New Book" handleClose={handleClose} />
          <Box
            component="form"
            id="add_books"
            validate
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": { m: 1 },
              display: "flex",
              alignItems: "center",
            }}
          >
            <Grid spacing={1} container xs={12}>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Name"
                    id="name"
                    size="small"
                    type="text"
                    required
                    helperText={!isValName ? "Invalid Name" : ""}
                    error={!isValName}
                    onChange={(e) => {
                      setisValName(PATTERNS.NAME.test(e.target.value));
                      if (e.target.value === "") setisValName(true);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Business Name"
                    id="b_name"
                    size="small"
                    type="text"
                    required
                    helperText={!isValBname ? "Invalid Business Name" : ""}
                    error={!isValBname}
                    onChange={(e) => {
                      setisValBname(PATTERNS.NAME.test(e.target.value));
                      if (e.target.value === "") setisValBname(true);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Mobile Number"
                    id="mobile"
                    size="small"
                    type="tel"
                    error={!isValMob}
                    helperText={!isValMob ? "Invalid Mobile Number" : ""}
                    onChange={(e) => {
                      setisValMob(PATTERNS.MOBILE.test(e.target.value));
                      if (e.target.value === "") setisValMob(true);
                    }}
                    inputProps={{ maxLength: 10 }}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid
                md={12}
                xs={12}
                sx={{ display: "flex", justifyContent: "center", mt: 2 }}
              >
                <FormControl>
                  <Typography
                    sx={{ display: "flex", justifyContent: "center", mb: 1 }}
                  >
                    Enter M-Pin
                  </Typography>
                  <PinInput
                    length={6}
                    focus
                    type="password"
                    onChange={(value, index) => {
                      setMpin(value);
                    }}
                    regexCriteria={/^[0-9]*$/}
                    inputStyle={{
                      width: "40px",
                      height: "40px",
                      marginRight: { xs: "3px", md: "5px" },
                      textAlign: "center",
                      borderRadius: "0",
                      border: "none",
                      borderBottom: "1px solid #000",
                      padding: "5px",
                      outline: "none",
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
                sx={{ display: "flex", justifyContent: "end", mt: 1 }}
              >
                <ResetMpin variant="text" />
              </Grid>
              {err && err && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                    fontSize: "12px",
                    px: 2,
                    color: "#DC5F5F",
                  }}
                >
                  {err.message && err.message && (
                    <div>{err && err.message}</div>
                  )}
                  {err.data && err.data && (
                    <div className="blink_text">
                      Attempts remaining:{err && 5 - Number(err.data)}
                    </div>
                  )}
                </Box>
              )}
            </Grid>
          </Box>
          <ModalFooter
            form="add_books"
            type="submit"
            request={request}
            disable={!mpin || !isValBname || !isValMob || !isValName}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default AddBookModal;
