import React, { useEffect, useState } from "react";
import { Grid, FormControl, TextField, MenuItem } from "@mui/material";
import { PATTERNS } from "../utils/ValidationUtil";
import { get, postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";

const Business = ({
  setHideNext,
  bstate,
  bdistrict,
  setBdistrict,
  setBstate,
}) => {
  const [isPinv, setIsPinv] = useState(true);
  const [request, setrequest] = useState(false);
  const [allStates, setallStates] = useState([]);
  const [allDistricts, setallDistricts] = useState([]);

  const getStates = () => {
    get(
      ApiEndpoints.GET_STATES,
      "",
      setrequest,
      (res) => {
        const data = res.data.data;
        setallStates(data);
      },
      (err) => {}
    );
  };

  const getDistricts = (passedValue) => {
    postJsonData(
      ApiEndpoints.GET_DISTRICTS,
      { state_code: passedValue },
      setrequest,
      (res) => {
        const data = res.data.data;
        setallDistricts(data);
      },
      (err) => {}
    );
  };

  useEffect(() => {
    setHideNext(!isPinv);
  }, [isPinv]);

  return (
    <Grid
      // component="form"
      // id="loginForm"
      container
      style={{ marginTop: "30px" }}
      spacing={2}
    >
      <Grid item lg={10} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
        <FormControl
          md={12}
          sx={{ width: "100%", background: "white", color: "#1692ff" }}
        >
          <TextField autoComplete="off"
            label="Business name"
            id="bname"
            size="small"
            required
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
        </FormControl>
      </Grid>
      <Grid item lg={10} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
        <FormControl
          md={12}
          sx={{ width: "100%", background: "white", color: "#1692ff" }}
        >
          <TextField autoComplete="off"
            select
            label="State"
            id="state"
            size="small"
            required
            value={bstate}
            onChange={(e) => {
              setBstate(e.target.value);
              getDistricts(e.target.value);
            }}
            onFocus={() => getStates()}
          >
            <MenuItem value="select">
              <div style={{ textAlign: "left" }}>Select</div>
            </MenuItem>
            {allStates.length > 0 &&
              allStates.map((item) => {
                return (
                  <MenuItem value={item.state_code}>
                    <div style={{ textAlign: "left" }}>{item.name}</div>
                  </MenuItem>
                );
              })}
          </TextField>
        </FormControl>
      </Grid>
      <Grid item lg={10} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
        <FormControl
          md={12}
          sx={{ width: "100%", background: "white", color: "#1692ff" }}
        >
          <TextField autoComplete="off"
            select
            label="District"
            id="district"
            size="small"
            required
            value={bdistrict}
            onChange={(e) => {
              setBdistrict(e.target.value);
            }}
          >
            <MenuItem>
              <div style={{ textAlign: "left" }}>Select</div>
            </MenuItem>

            {allDistricts.length > 0 &&
              allDistricts.map((item) => {
                return (
                  <MenuItem value={item.name}>
                    <div style={{ textAlign: "left" }}>{item.name}</div>
                  </MenuItem>
                );
              })}
          </TextField>
        </FormControl>
      </Grid>
      <Grid item lg={10} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
        <FormControl
          md={12}
          sx={{ width: "100%", background: "white", color: "#1692ff" }}
        >
          <TextField autoComplete="off"
            label="Pincode"
            id="bpincode"
            size="small"
            required
            error={!isPinv}
            helperText={!isPinv ? "Enter valid PIN Code" : ""}
            onChange={(e) => {
              setIsPinv(PATTERNS.PIN.test(e.target.value));
              if (e.target.value === "") setIsPinv(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "+" || e.key === "-") e.preventDefault();
              if (e.target.value.length === 6) {
                if (e.key.toLowerCase() !== "backspace") e.preventDefault();
                if (e.key.toLowerCase() === "backspace") {
                }
              }
            }}
          />
        </FormControl>
      </Grid>
      <Grid item lg={10} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
        <FormControl
          md={12}
          sx={{ width: "100%", background: "white", color: "#1692ff" }}
        >
          <TextField autoComplete="off"
            label="Business Address"
            id="baddress"
            size="small"
            required
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default Business;
