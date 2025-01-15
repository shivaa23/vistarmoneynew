import * as React from "react";
import Box from "@mui/material/Box";
import {
  FormControl,
  Grid,
  TextField,
  IconButton,
  Tooltip,
  MenuItem,
  Avatar,
  Drawer,
} from "@mui/material";
import ApiEndpoints from "../network/ApiEndPoints";
import { postJsonData } from "../network/ApiController";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { useState } from "react";
import PinInput from "react-pin-input";
import { rupee1 } from "../iconsImports";
import ResetMpin from "./ResetMpin";
import useCommonContext from "../store/CommonContext";

const MoneyTransferModal = ({ row, refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [mpin, setMpin] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const { getRecentData } = useCommonContext();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    boxShadow: 24,
    fontFamily: "Poppins",
    // height: { xs: "35vh", md: "55vh" },
    height: "max-content",
    overflowY: "scroll",
    p: 2,
  };
  React.useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          (error) => {
            setError(error.message);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    let amt = document.getElementById("amount").value;
    const data = {
      to_id: row.id,
      pf: "WEB",
      req_type: "CHAIN",
      amount: amt,
      mpin: mpin,
      latitude: latitude,
      longitude: longitude,
    };
    setRequest(true);
    postJsonData(
      ApiEndpoints.MONEY_TRANSFER,
      data,
      setRequest,
      (res) => {
        getRecentData();
        okSuccessToast("Request Processed successfully");
        handleClose();
        if (refresh) refresh();
      },
      (error) => {
        apiErrorToast(error);
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
      <Tooltip title="Money Transfer">
        <IconButton onClick={handleOpen}>
          <img
            src={rupee1}
            alt="Money Transfer"
            style={{ width: "25px", height: "25px" }}
          />
          {/* <CurrencyRupeeIcon /> */}
        </IconButton>
      </Tooltip>
      <Box>
        <Drawer open={open} onClose={handleClose} anchor="right">
          <Box sx={{ width: 400 }} className="sm_modal">
            <ModalHeader title="Money Transfer" handleClose={handleClose} />
            <Box
              component="form"
              id="money_transfer"
              validate
              autoComplete="off"
              onSubmit={handleSubmit}
              sx={{
                "& .MuiTextField-root": { m: 2 },
              }}
            >
              <Grid container sx={{ pt: 1 }}>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      autoComplete="off"
                      label="Retailer"
                      id="retailer"
                      size="small"
                      disabled
                      defaultValue={row.establishment}
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      autoComplete="off"
                      select
                      label="Payment Type"
                      id="payment_type"
                      size="small"
                      defaultValue="CREDIT"
                      required
                    >
                      <MenuItem value="CREDIT">CREDIT</MenuItem>
                      <MenuItem value="DEBIT">DEBIT</MenuItem>
                    </TextField>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      autoComplete="off"
                      label="Amount"
                      id="amount"
                      size="small"
                      inputProps={{
                        form: {
                          autocomplete: "off",
                        },
                      }}
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <FormControl>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      M-PIN
                    </div>
                    <PinInput
                      length={6}
                      type="password"
                      onChange={(value, index) => {
                        setMpin(value);
                      }}
                      inputMode="text"
                      regexCriteria={/^[0-9]*$/}
                    />
                  </FormControl>
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                  sx={{ display: "flex", justifyContent: "end" }}
                >
                  <ResetMpin variant="text" />
                </Grid>
                
              </Grid>
            </Box>
            <ModalFooter form="money_transfer" request={request} btn="Done" />
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};
export default MoneyTransferModal;
