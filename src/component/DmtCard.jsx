import React, { useState, useContext } from 'react';
import { Box, Card, FormControl, Grid, TextField, Typography } from '@mui/material';
import { PATTERNS } from "../utils/ValidationUtil";
import ApiEndpoints from '../network/ApiEndPoints';
import { postJsonData } from "../network/ApiController";
import { apiErrorToast } from '../utils/ToastUtil';
import AuthContext from "../store/AuthContext";
const DmtCard = () => {
  const [mobile, setMobile] = useState("");
  const [isMobv, setIsMobv] = useState(true);
  const [request, setRequest] = useState(false);
  const [bene, setBene] = useState([]);
  const [otpRefId, setOtpRefId] = useState("");
  const [addNewRem, setAddNewRem] = useState(false);
  const [verifyotp, setVerifyotp] = useState(false);
  const [dmtValue, setDmtValue] = useState('dmt1'); // Default value, adjust as needed
  const [remitterStatus, setRemitterStatus] = useState();
  const [infoFetchedMob, setInfoFetchedMob] = useState(false);

  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

  const getRemitterStatus = (number) => {
    postJsonData(
      dmtValue === "dmt1"
        ? ApiEndpoints.GET_REMMITTER_STATUS
        : ApiEndpoints.DMT2_REM_STAT,
      {
        number: number,
        type: "M",
      },
      setRequest,
      (res) => {
        if (res && res.status === 200 && res.data.message === "OTP Sent") {
          setOtpRefId(res.data.otpReference);
          setVerifyotp(true);
        } else if (res && res.data && res.data.remitter) {
          const data = dmtValue === "dmt1" ? res.data.remitter : res.data;
          setMobile(number);
          setRemitterStatus(dmtValue === "dmt1" ? data : data.remitter);
          setBene(dmtValue === "dmt1" ? data.beneficiaries : data.data);
          setInfoFetchedMob(true);
        } else {
          setRemitterStatus();
        }
      },
      (error) => {
        if (error && error.response) {
          if (
            error.response.status === 404 &&
            error.response.data.message === "Remitter Not Found"
          ) {
            if (dmtValue === "dmt2") {
              setOtpRefId(error?.response?.data?.otpReference);
            }
            setAddNewRem(true);
          } else {
            apiErrorToast(error);
          }
        }
      }
    );
  };

  return (
    <Card
      sx={{
        background: "#fff",
        borderRadius: "8px",
        padding: "1.3rem",
        boxShadow:
          "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
        mb: { md: 0, lg: 0, xs: 1, sm: 1 },
        width: { xs: "100%", sm: "100%", md: "100%", lg: "100%" },
        maxWidth: "100%",
        height: "200px"
      }}
    >
     <Box
                    component="form"
                    sx={{
                      "& .MuiTextField-root": { mt: 2 },
                      objectFit: "contain",
                      overflowY: "scroll",
                    }}
                  >
                    <Grid container spacing={2} sx={{ pt: 1 }}>
                      <Grid item md={4} xs={12}>
                    
      <FormControl sx={{ width: "100%" }}>
        <TextField autoComplete="off"
          size="small"
          label="Enter Remitter Mobile Number"
          id="mobile"
          name="mobile"
          type="tel"
          value={mobile}
          required
          onChange={(e) => {
            const value = e.target.value;
            setIsMobv(PATTERNS.MOBILE.test(value));
            if (value === "") setIsMobv(true);
            setMobile(value);
            if (value === "") {
              setRemitterStatus("");
              setInfoFetchedMob(false);
              bene && setBene([]);
            }
            if (value.length === 9) {
              setRemitterStatus("");
              setInfoFetchedMob(false);
              bene && setBene([]);
            }
            if (PATTERNS.MOBILE.test(value)) {
              getRemitterStatus(value);
            }
          }}
          error={!isMobv}
          helperText={!isMobv ? "Enter valid Mobile" : ""}
          inputProps={{
            form: {
              autocomplete: "off",
            },
          }}
          disabled={request && request && true}
        />
      </FormControl>
      </Grid>
      </Grid>
      
      </Box>
    </Card>
  );
};

export default DmtCard;
