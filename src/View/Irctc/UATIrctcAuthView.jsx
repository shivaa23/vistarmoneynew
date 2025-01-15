import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import React from "react";
import LogoComponent from "../../component/LogoComponent";
import { useState } from "react";
import { PATTERNS } from "../../utils/ValidationUtil";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PinInput from "react-pin-input";
import { irctcAuthImg } from "../../iconsImports";
import { postJsonData } from "../../network/ApiController";
import Loader from "../../component/loading-screen/Loader";
import ApiEndpoints from "../../network/ApiEndPoints";
import { useSearchParams } from "react-router-dom";
import { decode } from "js-base64";
import { useEffect } from "react";
import { apiErrorToast } from "../../utils/ToastUtil";
const UATIrctcAuthView = () => {
  const [isMobv, setIsMobv] = useState(true);
  const [showPass, setShowPass] = useState(0);
  const [err, setErr] = useState();
  const [mpin, setMpin] = useState("");
  const [request, setRequest] = useState(false);
  const [decodedParams, setDecodedParams] = useState();

  const [searchParams] = useSearchParams();

  const paramsData = searchParams.get("data");
  // console.log("paramsData", paramsData);

  useEffect(() => {
    if (paramsData) {
      let jsonParams = {};
      const decodedParams = decode(paramsData);
      const keyValuePairs = decodedParams.split("|");
      // console.log("keyValuePairs", keyValuePairs);

      keyValuePairs.forEach((pair) => {
        const [key, value] = pair.split("=");
        jsonParams[key] = value;
      });
      setDecodedParams(jsonParams);
      // console.log("jsonParams", jsonParams);
    }
  }, [paramsData]);

  const loginIrctc = (e) => {
    e.preventDefault();
    if (!mpin || mpin.length < 6) {
      setErr("Mpin should be 6 digits");
      e.stopPropagation();
    }
    const form = e.currentTarget;
    let data = {};
    if (decodedParams) {
      data = {
        ...decodedParams,
        username: form.username.value,
        password: form.password.value,
        mpin: mpin,
      };
    } else {
      data = {
        username: form.username.value,
        password: form.password.value,
        mpin: mpin,
      };
    }

    postJsonData(
      ApiEndpoints.UAT_IRCTC_AUTH_PAYMENT,
      data,
      setRequest,
      (res) => {
        const data = res.data;
        console.log("resp", res.data);
        window.open(`${data.url}?encdata=${data.encdata}`, "_self");
        // okSuccessToast(res?.data?.message);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };
  return (
    <Box className="imps-gradient-background">
      <Grid
        container
        sx={{
          width: { md: "85%", sm: "95%", xs: "95%" },
          height: "max-content",
          minHeight: { md: "550px", sm: "auto", xs: "auto" },
          backgroundColor: "#fff",
          borderRadius: "4px",
        }}
      >
        <Grid
          item
          md={7}
          sx={{
            backgroundColor: "#9A82BC30",
            display: { md: "block", sm: "none", xs: "none" },
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              flexDirection: "column",
            }}
          >
            {/* <h1>IRCTC</h1> */}
            <img src={irctcAuthImg} alt="irctc" width="80%" height="75%" />
          </div>
        </Grid>
        <Grid
          item
          md={5}
          xs={12}
          sx={{
            p: { md: 6, sm: 3, xs: 3 },
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            flexDirection: "column",
          }}
        >
          <Grid
            component="form"
            id="loginForm"
            onSubmit={loginIrctc}
            container
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
            className="position-relative"
          >
            <Loader loading={request} />
            <Grid item md={12} xs={12}>
              <Box
                sx={{
                  ml: { lg: 1, md: 1, sm: 1, xs: 0 },
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <LogoComponent width="250rem" />
              </Box>
            </Grid>
            <Grid item md={12} xs={12} sx={{ mt: 4 }}>
              <FormControl
                md={12}
                sx={{
                  width: { md: "85%", sm: "100%", xs: "100%" },
                  background: "white",
                  color: "#1692ff",
                }}
              >
                <TextField autoComplete="off"
                  label="Registered Mobile Number"
                  id="username"
                  size="small"
                  type="number"
                  required
                  error={!isMobv}
                  helperText={!isMobv ? "Enter valid Mobile" : ""}
                  onChange={(e) => {
                    setIsMobv(PATTERNS.MOBILE.test(e.target.value));
                    if (e.target.value === "") setIsMobv(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "+" || e.key === "-") e.preventDefault();
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item md={12} xs={12} sx={{ mt: 4 }}>
              <FormControl
                sx={{
                  width: { md: "85%", sm: "100%", xs: "100%" },
                  background: "white",
                }}
              >
                <TextField autoComplete="off"
                  label="Password"
                  id="password"
                  size="small"
                  type={showPass === 0 ? "password" : "text"}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {showPass === 0 ? (
                          <FontAwesomeIcon
                            icon={faEyeSlash}
                            onClick={() => {
                              setShowPass(1);
                            }}
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faEye}
                            onClick={() => {
                              setShowPass(0);
                            }}
                          />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
              sx={{ display: "flex", justifyContent: "center", mt: 4 }}
            >
              <FormControl>
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  Enter M-PIN
                </div>
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
                  inputMode="text"
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
                {err && err && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                      fontSize: "12px",
                      px: 2,
                      color: "#DC5F5F",
                      alignItems: "flex-start",
                    }}
                  >
                    {err && <div>{err && err}</div>}
                  </Box>
                )}
              </FormControl>
            </Grid>
            <Grid
              md={10}
              xs={12}
              sx={{
                mt: 5,
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button
                form="loginForm"
                type="submit"
                className="btn-background"
                sx={{ width: "80%", textTransform: "capitalize" }}
                disabled={request}
              >
                Pay here
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UATIrctcAuthView;
