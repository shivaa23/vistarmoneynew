import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import ApiEndpoints from "../network/ApiEndPoints";
import {  okSuccessToast } from "../utils/ToastUtil";
import { useState, useContext, useEffect } from "react";
import PinInput from "react-pin-input";
import AuthContext from "../store/AuthContext";
import { postJsonData } from "../network/ApiController";
import ResetMpin from "./ResetMpin";
import useCommonContext from "../store/CommonContext";
import { UpiLogo } from "../iconsImports";

const RetUpiTransferModal = ({ ben, rem_number }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const { getRecentData } = useCommonContext();
  const [mpin, setMpin] = useState("");
  const [amount, setAmount] = useState(""); // State for amount
  const [err, setErr] = useState();
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const loc = authCtx.location && authCtx.location;

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "30%",
    bgcolor: "background.paper",
    boxShadow: 24,
    fontFamily: "Poppins",
    height: "max-content",
    overflowY: "scroll",
    p: 2,
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setErr(null); // Reset error on close
    setMpin(""); // Reset MPIN on close
    setAmount(""); // Reset amount on close
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let amt = parseInt(amount);
    // Validation Logic
    if (amount === "") {
      setErr({ message: "Amount required" });
      return;
    }
    if (mpin === "") {
      setErr({ message: "MPIN required" });
      return;
    }else if (amt && amt > parseInt(user.w1)) {
      setErr("");
      const error = {
        message: "Low Balance",
      };
      setErr(error);
    }

    const data = {
      vpa: ben.bene_acc,
      latitude: loc.lat,
      longitude: loc.long,
      number: rem_number,
      pf: "WEB",
      mpin: mpin,
      amount: amt,
      name: ben.bene_name,
    };
    
    setRequest(true);
    postJsonData(
      ApiEndpoints.UPI_PAY,
      data,
      setRequest,
      (res) => {
        okSuccessToast(res.data.message);
        getRecentData();
        handleClose();
      },
      (error) => {
        getRecentData();
        if (error && error.response) {
          if (error.response.data.message === "Invalid M Pin") {
            setErr(error.response.data);
          } else {
            // apiErrorToast(error);
          }
        }
      }
    );
  };

  // Effect to validate amount and control M-PIN visibility
  useEffect(() => {
    const amt = parseInt(amount);
    if (amount !== "" && (amt < 500 || amt > 49500)) {
      setErr({ message: "Amount must be between 500 to 49500" });
    } else {
      setErr(null); // Clear error if valid
    }
  }, [amount]);

  return (
    <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
      <Button
        size="small"
        id="verify-btn"
        className="button-pinkback"
        sx={{ fontSize: "13px", py: 0, ml: 1, px: 1, display: 'flex', alignItems: 'center' }}
        onClick={handleOpen}
      >
        <span style={{ marginRight: '5px' }}>UPI</span>
        <img src={UpiLogo} alt="UPI logo" style={{ width: '18px', height: '20px' }} />
      </Button>

      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <ModalHeader title="UPI Transfer" handleClose={handleClose} />
            <Box
              component="form"
              id="expMoneyTransfer"
              validate
              autoComplete="off"
              onSubmit={handleSubmit}
              sx={{ "& .MuiTextField-root": { m: 1 } }}
            >
              <Grid container sx={{ pt: 1 }}>
                <Grid item md={12} xs={12} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <table className="mt-table">
                    <tr>
                      <td>Name</td>
                      <td>:</td>
                      <td style={{ textAlign: "right" }}>{ben.bene_name}</td>
                    </tr>
                    <tr>
                      <td>VPA</td>
                      <td>:</td>
                      <td style={{ textAlign: "right" }}>{ben.bene_acc}</td>
                    </tr>
                  </table>
                </Grid>
                <Grid item md={12} xs={12} sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FormControl sx={{ width: "90%" }}>
                    <TextField
                      label="Enter Amount"
                      id="amount"
                      size="small"
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)} // Update amount state
                      inputProps={{ autocomplete: "off" }}
                    />
                  </FormControl>
                </Grid>

                {/* Show M-PIN only if the amount is valid */}
                {amount !== "" && (parseInt(amount) >= 500 && parseInt(amount) <= 49500) && (
                  <>
                    <Grid
                      item
                      md={12}
                      xs={12}
                      sx={{ display: "flex", justifyContent: "center", mt: 2 }}
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
                          onChange={(value) => {
                            if (err) {
                              setErr(null); // Clear error if valid
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
                    >
                      <Button sx={{ mt: -2, alignItems:"end"}}>
                      <ResetMpin variant="text" py mt  />
                    </Button>

                    </Grid>
                  </>
                )}
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

                {err && (
                  <Grid item md={12} xs={12} sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
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
                      <div>{err.message}</div>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
            <ModalFooter 
              form="expMoneyTransfer" 
              request={request} 
              btn="Proceed" 
              disable={amount === "" || parseInt(amount) < 500 || parseInt(amount) > 49500}
              />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default RetUpiTransferModal;
