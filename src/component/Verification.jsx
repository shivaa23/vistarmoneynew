import React, { useEffect, useState } from "react";
import {
  Grid,
  FormControl,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { PATTERNS } from "../utils/ValidationUtil";

const Verification = ({ setHideNext }) => {
  const [isMobv, setIsMobv] = useState(true);
  const [isEmailv, setIsEmailv] = useState(true);
  const [isPanv, setIsPanv] = useState(true);
  const [isaadhaarv, setIsAadhaarv] = useState(true);

  useEffect(() => {
    setHideNext(!(isMobv && isEmailv && isPanv && isaadhaarv));
  }, [isMobv, isEmailv, isPanv, isaadhaarv]);
  return (
    <Grid
      // component="form"
      // id="loginForm"
      spacing={2}
      container
      sx={{ marginTop: "30px" }}
    >
      <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
        <FormControl
          md={12}
          sx={{ width: "100%", background: "white", color: "#1692ff" }}
        >
          <TextField autoComplete="off"
            label="Mobile number(linked with Aadhar)"
            id="a_mob"
            size="small"
            required
            error={!isMobv}
            helperText={!isMobv ? "Enter valid Mobile" : ""}
            onChange={(e) => {
              setIsMobv(PATTERNS.MOBILE.test(e.target.value));
              if (e.target.value === "") setIsMobv(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "+" || e.key === "-") e.preventDefault();
              if (e.target.value.length === 10) {
                if (e.key.toLowerCase() !== "backspace") e.preventDefault();
                if (e.key.toLowerCase() === "backspace") {
                }
              }
            }}
          />
        </FormControl>
      </Grid>
      <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
        <FormControl
          md={12}
          sx={{ width: "100%", background: "white", color: "#1692ff" }}
        >
          <TextField autoComplete="off"
            label="PAN Number"
            id="a_pan"
            size="small"
            required
            error={!isPanv}
            helperText={!isPanv ? "Enter valid PAN" : ""}
            onChange={(e) => {
              setIsPanv(PATTERNS.PAN.test(e.target.value));
              if (e.target.value === "") setIsPanv(true);
            }}
            onKeyDown={(e) => {
              if (e.target.value.length === 10) {
                if (e.key.toLowerCase() !== "backspace") e.preventDefault();
                if (e.key.toLowerCase() === "backspace") {
                }
              }
            }}
          />
        </FormControl>
      </Grid>
      <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
        <FormControl
          md={12}
          sx={{ width: "100%", background: "white", color: "#1692ff" }}
        >
          <TextField autoComplete="off"
            label="Aadhar Number"
            id="aadhaar"
            size="small"
            required
            error={!isaadhaarv}
            helperText={!isaadhaarv ? "Enter valid Aadhaar" : ""}
            onChange={(e) => {
              setIsAadhaarv(PATTERNS.AADHAAR.test(e.target.value));
              if (e.target.value === "") setIsAadhaarv(true);
            }}
          />
        </FormControl>
      </Grid>
      <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
        <FormControl
          md={12}
          sx={{ width: "100%", background: "white", color: "#1692ff" }}
        >
          <TextField autoComplete="off"
            label="Email Id"
            id="email"
            size="small"
            required
            error={!isEmailv}
            helperText={!isEmailv ? "Enter valid Email" : ""}
            onChange={(e) => {
              setIsEmailv(PATTERNS.EMAIL.test(e.target.value));
              if (e.target.value === "") setIsEmailv(true);
            }}
          />
        </FormControl>
      </Grid>

      <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
        <FormControlLabel
          md={12}
          sx={{
            width: "98%",
            color: "#1692ff",
            textAlign: "justify",
            fontSize: "0.5 rem !important",
          }}
          control={<Checkbox defaultChecked />}
          label={
            <Typography sx={{ fontSize: "0.8rem" }}>
              I hereby give my consent and submit voluntarily at my own
              discretion, my Aadhaar Number or VID for the purpose of
              establishing my identity on the portal. The Aadhaar submitted
              herewith shall not be used for any purpose other than mentioned,
              or as per the requirements of the law.
            </Typography>
          }
        />
      </Grid>
    </Grid>
  );
};

export default Verification;
