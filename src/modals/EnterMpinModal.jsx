import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FormControl, Grid, Typography } from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import PinInput from "react-pin-input";
import { useState } from "react";
import { postJsonData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import ResetMpin from "./ResetMpin";
import Loader from "../component/loading-screen/Loader";
import useCommonContext from "../store/CommonContext";
import { validateApiCall } from "../utils/LastApiCallChecker";
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

const EnterMpinModal = ({
  data,
  customerId,
  setAmount,
  setModalVisible,
  setSuccessRechage,
  view,
  setCustomerId,
  refreshFunc,
  apiEnd,
  setShowSuccess,
  setMobile,
  setInfoFetched,
  sendBkApiStatus,
}) => {
  const [open, setOpen] = useState(true);
  const [request, setRequest] = useState(false);
  const [mpin, setMpin] = useState("");
  const [err, setErr] = useState();
  const { getRecentData, refreshUser } = useCommonContext();

  const handleClose = () => {
    setModalVisible(false);
    setOpen(false);
    setAmount("")
    setMobile("")
    setInfoFetched(false)
    setCustomerId()
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (mpin !== "" && validateApiCall()) {
      data.mpin = mpin;
      postJsonData(
        apiEnd,
        data,
        setRequest,
        (res) => {
          getRecentData();
          if (view === "recharge") {
            setSuccessRechage(res.data.data);
            setMobile("");
            setInfoFetched(false);
            setShowSuccess(true);
          } else {
            okSuccessToast(res.data.message);
            if (refreshFunc) {
              refreshFunc();
            }
          }
          setMpin("");
          handleClose();
          if (sendBkApiStatus) sendBkApiStatus(true);
        },
        (error) => {
          getRecentData();
          // setMpin("");
          if (error && error) {
            if (error.response.message === "Invalid M Pin") {
              setErr(error.response.data);
            } else {
              apiErrorToast(error);
              if (refreshFunc) {
                refreshFunc();
              }
            }
          }
          if (sendBkApiStatus) sendBkApiStatus(true);
          handleClose();
          // setModalVisible(false);
        }
      );
    } else {
      setErr("");
      if (!validateApiCall()) {
        const validateError = {
          message: "Kindly wait some time before another request",
        };
        setErr(validateError);
      } else {
        const error = {
          message: "MPIN required",
        };
        setErr(error);
      }
    }
    refreshUser();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <Loader loading={request} />
            <ModalHeader title="Enter Mpin" handleClose={handleClose} />
            <Box
              component="form"
              id="EnterMpinModal"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
              sx={{
                "& .MuiTextField-root": { m: 2 },
              }}
            >
              <Grid container sx={{ pt: 1 }}>
                <Grid
                  item
                  md={12}
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <FormControl>
                    {/* <Typography
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      M-PIN
                    </Typography> */}
                    <PinInput
                      length={6}
                      focus
                      type="password"
                      onChange={(value, index) => {
                        if (err !== "") {
                          setErr("");
                        }
                        setMpin(value);
                      }}
                      regexCriteria={/^[0-9]*$/}
                    />
                    <Grid
                      item
                      md={12}
                      xs={12}
                      sx={{ display: "flex", justifyContent: "end", mt: 1 }}
                    >
                      <ResetMpin variant="text" />
                    </Grid>
                  </FormControl>
                </Grid>
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
            </Box>

            <ModalFooter
              form="EnterMpinModal"
              disable={request}
              btn="Proceed"
            />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};
export default EnterMpinModal;
