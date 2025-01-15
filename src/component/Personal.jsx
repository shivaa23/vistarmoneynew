import React, { useEffect, useState } from "react";
import { Grid, FormControl, TextField, MenuItem } from "@mui/material";
import { PATTERNS } from "../utils/ValidationUtil";
import { get, postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";

const Personal = ({
  setHideNext,
  setState,
  state,
  setDistrict,
  district,
  setGender,
  gender,
}) => {
  const [isPinv, setIsPinv] = useState(true);
  const [isPanv, setIsPanv] = useState(true);
  const [allStates, setallStates] = useState([]);
  const [allDistricts, setallDistricts] = useState([]);

  const [request, setrequest] = useState(false);

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

  // useEffect(()=>{
  //   getStates()
  // },[])

  useEffect(() => {
    setHideNext(!(isPinv && isPanv));
    getStates();
  }, [isPinv, isPanv]);

  return (
    <Grid
      // component="form"
      // id="loginForm"
      container
      spacing={2}
      style={{ marginTop: "30px" }}
    >
      <Grid item lg={10} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
        <FormControl
          md={12}
          sx={{ width: "100%", background: "white", color: "#1692ff" }}
        >
          <TextField
            autoComplete="off"
            label="Address"
            id="addr"
            size="small"
            required
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
        </FormControl>
      </Grid>
      {/*  */}
      <Grid item lg={10} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
        <FormControl
          md={12}
          sx={{ width: "100%", background: "white", color: "#1692ff" }}
        >
          <TextField
            autoComplete="off"
            label="Gender"
            size="small"
            required
            select
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
            }}
          >
            <MenuItem value="MALE">
              <div style={{ textAlign: "left" }}>Male</div>
            </MenuItem>
            <MenuItem value="FEMALE">
              <div style={{ textAlign: "left" }}>Female</div>
            </MenuItem>
            <MenuItem value="OTHERS">
              <div style={{ textAlign: "left" }}>Others</div>
            </MenuItem>
          </TextField>
        </FormControl>
      </Grid>
      {/*  */}
      <Grid item lg={10} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
        <FormControl
          md={12}
          sx={{ width: "100%", background: "white", color: "#1692ff" }}
        >
          <TextField
            autoComplete="off"
            select
            label="State"
            id="state"
            size="small"
            required
            value={state}
            onChange={(e) => {
              setState(e.target.value);
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
          <TextField
            autoComplete="off"
            select
            label="District"
            id="district"
            size="small"
            required
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
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
          <TextField
            autoComplete="off"
            label="Pincode"
            id="pincode"
            size="small"
            type="number"
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

      <Grid item lg={10} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
        <FormControl
          md={12}
          sx={{ width: "100%", background: "white", color: "#1692ff" }}
        >
          <TextField
            autoComplete="off"
            label="PAN No"
            id="pan"
            size="small"
            required
            error={!isPanv}
            helperText={!isPanv ? "Enter valid PAN" : ""}
            inputProps={{ style: { textTransform: "uppercase" } }}
            onChange={(e) => {
              setIsPanv(PATTERNS.PAN.test(e.target.value.toUpperCase()));
              if (e.target.value === "") setIsPanv(true);
            }}
            onKeyDown={(e) => {
              if (e.target.value.length === 10) {
                if (e.key.toLowerCase() !== "backspace") e.preventDefault();
                if (e.key.toLowerCase() === "backspace") {
                  setIsPanv(true);
                }
              }
            }}
          />
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default Personal;
