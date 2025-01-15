import {
  Box,
  Button,
  FormControl,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import ModalHeader from "../../modals/ModalHeader";
import Loader from "../loading-screen/Loader";
import ResetMpin from "../../modals/ResetMpin";
import PinInput from "react-pin-input";
import ModalFooter from "../../modals/ModalFooter";
import { useContext } from "react";
import AuthContext from "../../store/AuthContext";
import { apiErrorToast, okSuccessToast } from "../../utils/ToastUtil";
import useCommonContext from "../../store/CommonContext";
import { validateApiCall } from "../../utils/LastApiCallChecker";
import { postJsonData } from "../../network/ApiController";
import ApiEndpoints from "../../network/ApiEndPoints";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  boxShadow: 24,
  fontFamily: "Poppins",
  height: "max-content",
  overflowY: "scroll",
  p: 2,
};

// BUTTONTEXT IS ALSO THE PAYMENT TYPE
const SettlementPaymentModes = ({ buttonText, style, row }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx && authCtx.user;
  const loc = authCtx.location && authCtx.location;
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [amount, setAmount] = useState("");
  const [err, setErr] = useState("");
  const [mpin, setMpin] = useState("");

  const { getRecentData } = useCommonContext();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      number: user && user.username,
      amount: amount,
      ben_acc: row?.acc_number,
      ben_id: row?.id,
      ifsc: row?.ifsc,
      latitude: loc.lat,
      longitude: loc.long,
      ben_name: row?.name,
      type: buttonText,
      pf: "WEB",
      mpin: mpin,
      pipe: "bank 1",
    };

    if (validateApiCall()) {
      postJsonData(
        ApiEndpoints.EXP_TRANSFER,
        data,
        setRequest,
        (res) => {
          const rrn = res.data.RRN;
          okSuccessToast(`Transaction processed successfully with URT ${rrn}`);
          getRecentData();
          setErr("");
        },
        (error) => {
          if (error && error) {
            if (error.response.data.message === "Invalid M Pin") {
              setErr(error.response.data.message);
              apiErrorToast(error.response.data.message);
            } else {
              getRecentData();
              setErr("");
              handleClose();
              apiErrorToast(error);
            }
          }
        }
      );
    } else {
      const error = {
        message: "Kindly wait some time before another request",
      };
      setErr(error);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
        mx: 1,
      }}
    >
      <Button
        variant="outlined"
        sx={{
          ...style,
          p: 0,
          borderRadius: "8px",
          "&:hover": {
            ...style,
          },
        }}
        onClick={handleOpen}
      >
        {buttonText}
      </Button>
      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle} className="sm_modal">
            <ModalHeader
              title={`${buttonText} Transfer`}
              handleClose={handleClose}
            />
            <Loader loading={request} />
            {buttonText === "UPI" ? (
              <Typography
                sx={{ textAlign: "center", minHeight: "300px", mt: 2 }}
              >
                Comming Soon!
              </Typography>
            ) : (
              <>
                <Box
                  component="form"
                  id="settlementPayment"
                  validate
                  autoComplete="off"
                  onSubmit={handleSubmit}
                  sx={{
                    "& .MuiTextField-root": { m: 2 },
                  }}
                >
                  <Grid container sx={{ pt: 1 }}>
                    {/* table */}
                    <Grid
                      item
                      md={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <table className="mt-table">
                        <tr>
                          <td>Name</td>
                          <td>:</td>
                          <td style={{ textAlign: "right" }}>
                            {row && row?.name}
                          </td>
                        </tr>
                        <tr>
                          <td>Bank Name</td> <td>:</td>
                          <td style={{ textAlign: "right" }}>
                            {row && row?.bank}
                          </td>
                        </tr>
                        <tr>
                          <td>Account</td>
                          <td>:</td>
                          <td style={{ textAlign: "right" }}>
                            {row && row.acc_number}
                          </td>
                        </tr>
                        <tr>
                          <td>IFSC </td>
                          <td>:</td>
                          <td style={{ textAlign: "right" }}>
                            {row && row?.ifsc}
                          </td>
                        </tr>
                      </table>
                    </Grid>
                    {/* amount */}
                    <Grid
                      item
                      md={12}
                      xs={12}
                      sx={{ mt: 2, display: "flex", justifyContent: "center" }}
                      // hidden={onComplete}
                    >
                      <FormControl sx={{ width: "74%" }}>
                        <TextField
                          autoComplete="off"
                          label="Enter Amount"
                          id="amount"
                          size="small"
                          type="number"
                          required
                          InputProps={
                            {
                              //   inputProps: { min: "0", max: remDailyLimit },
                            }
                          }
                          onChange={(event) => {
                            setErr("");
                            setAmount(event.target.value);
                          }}
                          inputProps={{
                            form: {
                              autocomplete: "off",
                            },
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "+" || e.key === "-") {
                              e.preventDefault();
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    {/* mpin */}
                    {amount && amount && (
                      <>
                        <Grid
                          item
                          md={12}
                          xs={12}
                          sx={{ display: "flex", justifyContent: "center" }}
                          // hidden={onComplete}
                        >
                          <FormControl>
                            <Typography
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              Enter M-PIN
                            </Typography>
                            <PinInput
                              length={6}
                              type="password"
                              onChange={(value, index) => {
                                if (err !== "") {
                                  setErr("");
                                }
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
                          sx={{
                            display: "flex",
                            justifyContent: "end",
                            pr: 12,
                            mt: 1,
                          }}
                          // hidden={onComplete}
                        >
                          <ResetMpin variant="text" />
                        </Grid>
                      </>
                    )}
                  </Grid>
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    {err && err && (
                      <Box
                        sx={{
                          width: "100%",
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

                        {err.data && err.message === "Invalid M Pin" && (
                          <div className="blink_text">
                            Attempts remaining:{err && 5 - Number(err.data)}
                          </div>
                        )}
                      </Box>
                    )}
                  </Grid>
                </Box>
                <ModalFooter
                  form="settlementPayment"
                  btn="Submit"
                  request={request}
                />
              </>
            )}
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default SettlementPaymentModes;
