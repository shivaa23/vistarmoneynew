import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";

import ApiEndpoints from "../network/ApiEndPoints";

import AuthContext from "../store/AuthContext";

import { validateApiCall } from "../utils/LastApiCallChecker";
import { postFormData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import useCommonContext from "../store/CommonContext";
let refresh;
const TransferW2ToW1 = () => {
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState("");
  const authCtx = useContext(AuthContext);
  const [request, setRequest] = useState(false);
  const [walletTransferErrMsg, setWalletTransferErrMsg] = useState("");
  const { getRecentData, refreshUser, userRequest } = useCommonContext();
  const [err, setErr] = useState();

  const userLat = authCtx.location && authCtx.location.lat;
  const userLong = authCtx.location && authCtx.location.long;
  const user = authCtx?.user;

  // ######################################
  // W2 TO W1 TRANSFER API CALL ...........
  // ######################################
  const handleW2ToW1Transfer = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      amount: form.w2_amount.value,
      pf: "WEB",
      latitude: userLat,
      longitude: userLong,
    };

    if (validateApiCall()) {
      postFormData(
        ApiEndpoints.W2TOW1_TRANSFER,
        data,
        setRequest,
        (res) => {
          okSuccessToast(res.data.message);
          setWalletTransferErrMsg("");
          document.getElementById("w2_amount").value = "";
          document.getElementById("w2_amount").focused = "off";
          refreshUser();
          getRecentData();
          setErr("");
        },
        (err) => {
          setErr("");
          if (
            err.response.data.message.amount &&
            err.response.data.message.amount
          ) {
            setWalletTransferErrMsg(err.response.data.message.amount);
          } else {
            setWalletTransferErrMsg("");
            apiErrorToast(err);
            refreshUser();
            getRecentData();
          }
        }
      );
    } else {
      setErr("");
      const error = {
        message: "Kindly wait some time before another request",
      };
      setErr(error);
    }
  };

  return (
    <Grid container sx={{ mt: 5, p: 3 }}>
      <Grid
        className="card-css"
        item
        md={12}
        sm={12}
        xs={12}
        sx={{
          borderRadius: "8px",
          padding: 3,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          backgroundColor: "#fff",
        }}
      >
        {/* Heading */}
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "20px",
            textAlign: "left",
            mb: 2,
          }}
        >
          Wallet Transfer: W2 to W1
        </Typography>

        {/* Form */}
        <Box
          component="form"
          id="walletTransfer"
          validate="true"
          autoComplete="off"
          onSubmit={handleW2ToW1Transfer}
        >
          <FormControl sx={{ width: "100%", mt: 3 }}>
            <TextField
              autoComplete="off"
              label="Enter Amount"
              id="w2_amount"
              type="number"
              onChange={() => {
                setWalletTransferErrMsg("");
              }}
              required
              size="small"
              sx={{ backgroundColor: "#f9f9f9" }}
              onKeyDown={(e) => {
                if (e.key === "+" || e.key === "-") {
                  e.preventDefault();
                }
              }}
            />
          </FormControl>
        </Box>

        {/* Error Messages */}
        <Box sx={{ width: "100%", textAlign: "right", mt: 2 }}>
          {err && (
            <Typography sx={{ fontSize: "12px", color: "red" }}>
              {err?.message}
            </Typography>
          )}
          {walletTransferErrMsg && (
            <Typography sx={{ fontSize: "12px", color: "red" }}>
              {walletTransferErrMsg}
            </Typography>
          )}
        </Box>

        {/* Submit Button */}
        <Box sx={{ width: "100%", textAlign: "right", mt: 2 }}>
          <Button
            variant="contained"
            sx={{
              fontSize: "13px",
              textTransform: "capitalize",
              mt: 2,
            }}
            className="otp-hover-purple"
            form="walletTransfer"
            type="submit"
            disabled={request}
          >
            Proceed
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default TransferW2ToW1;
