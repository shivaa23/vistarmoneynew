import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { get, postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast } from "../utils/ToastUtil";
import VerifiedIcon from "@mui/icons-material/Verified";
import DeleteBeneficiaryModal from "../modals/DeleteBeneficiaryModal";
import DmrNumberListModal from "../modals/DmrNumberListModal";
import DmrAddBeneficiaryModal from "../modals/DmrAddBeneficiaryModal";
import DmrAddRemitterModal from "../modals/DmrAddRemitterModal";
import RetExpresTransferModal from "../modals/RetExpresTransferModal";
import AccountVerificationModal from "../modals/AccountVerificationModal";
import DmrVrifyNewUser from "../modals/DmrVrifyNewUser";
import Loader from "../component/loading-screen/Loader";
import BeneSearchBar from "../component/BeneSearchBar";
import { PATTERNS } from "../utils/ValidationUtil";
import { capitalize1 } from "../utils/TextUtil";
import { currencySetter } from "../utils/Currencyutil";
import { getEnv, randomColors } from "../theme/setThemeColor";
import AuthContext from "../store/AuthContext";
import OutletRegistration from "../component/OutletRegistration";
import { PROJECTS } from "../utils/constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { banking } from "../_nav";
import HNavButton from "../component/HNavButton";
import { useNavigate } from "react-router-dom";

const ExpressMoneyTransfer = () => {
  const [infoFetchedMob, setInfoFetchedMob] = useState(false);
  const [request, setRequest] = useState(false);
  const [remitterStatus, setRemitterStatus] = useState();
  const [mobile, setMobile] = useState("");
  const [bene, setBene] = useState([]);
  const [verifyotp, setVerifyotp] = useState(false);
  const [addNewRem, setAddNewRem] = useState(false);
  const [otpRefId, setOtpRefId] = useState("");
  const [search, setSearch] = useState("");
  const [filteredBenelist, setFilteredBenelist] = useState([]);
  const [isMobv, setIsMobv] = useState(true);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const envName = getEnv();
  const navigate = useNavigate();
  //
  // const envName = getEnv();

  const getRemitterStatus = (number) => {
    postJsonData(
      ApiEndpoints.GET_REMMITTER_STATUS,
      {
        number: number,
      },
      setRequest,
      (res) => {
        if (res && res.status === 200 && res.data.message === "OTP Sent") {
          setOtpRefId(res.data.otpReference);
          setVerifyotp(true);
        } else if (res && res.data && res.data) {
          const data = res.data;
          setMobile(number);
          setRemitterStatus(data.remitter);
          setBene(data.data);
          setInfoFetchedMob(true);
          setNumberList("");
        } else {
          setRemitterStatus();
        }
      },
      (error) => {
        if (error && error) {
          if (
            error.response.status === 404 &&
            error.response.data.message === "Remitter Not Found"
          ) {
            setAddNewRem(true);
          } else {
            apiErrorToast(error);
          }
        }
      }
    );
  };
  const refreshRemitterStatus = (number) => {
    postJsonData(
      ApiEndpoints.REF_REMMITTER_STATUS,
      {
        number: number,
      },
      setRequest,
      (res) => {
        if (res && res.status === 200 && res.data.message === "OTP Sent") {
          setOtpRefId(res.data.otpReference);
          setVerifyotp(true);
        } else if (res && res.data && res.data) {
          const data = res.data;
          setMobile(number);
          setRemitterStatus(data.remitter);
          setBene(data.data);
          setInfoFetchedMob(true);
          setNumberList("");
        } else {
          setRemitterStatus();
        }
      },
      (error) => {
        if (error && error) {
          if (
            error.response.status === 404 &&
            error.response.data.message === "Remitter Not Found"
          ) {
            setAddNewRem(true);
          } else {
            // apiErrorToast(error);
          }
        }
      }
    );
  };
  useEffect(() => {
    if (search) {
      const myList = bene.filter((item) => {
        return item.bene_name.toUpperCase().includes(search.toUpperCase());
      });
      setFilteredBenelist(myList);
    } else {
      setFilteredBenelist(bene);
    }

    return () => {};
  }, [search, bene]);

  const [numberList, setNumberList] = useState([]);

  const getRemitterStatusByAcc = (event) => {
    event.preventDefault();
    const number = document.getElementById("acc")?.value;
    postJsonData(
      ApiEndpoints.GET_REMMITTER_STATUS_ACC,
      {
        number: number,
      },
      setRequest,
      (res) => {
        if (res && res.data && res.data) {
          const data = res.data.data;
          if (data.length > 0) {
            setNumberList(data);
            document.getElementById("acc").value = "";
            document.getElementById("acc").focus = "off";
          } else {
            apiErrorToast("No Beneficiary Found! Kindly Change Account Number");
          }
        } else {
          setRemitterStatus();
        }
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  // eslint-disable-next-line no-unused-vars
  const ekycCall = () => {
    get(
      ApiEndpoints.EKYC_INITIATE,
      `rem_mobile=${mobile && mobile}`,
      setRequest,
      (res) => {
        const data = res.data;
        window.open(data.url);
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  return (
    <>
      {envName === PROJECTS.moneyoddr && infoFetchedMob && (
        <div style={{ textAlign: "left", marginBottom: "10px" }}>
          <Button
            className="button-red"
            variant="contained"
            startIcon={<ArrowBackIcon />}
            sx={{ py: 0.2, px: 2 }}
            onClick={() => {
              setInfoFetchedMob(false);
              setRemitterStatus();
              setMobile("");
            }}
          >
            back
          </Button>
        </div>
      )}
      {user && !user.instId && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <OutletRegistration autoOpen />
        </Box>
      )}
      {user && user.instId && (
        <>
          {user?.layout && user?.layout === 2 && (
            <Box
              className="card-css"
              sx={{
                width: "100%",
                my: 2,
                p: 2,
                py: 1,
              }}
            >
              <Typography className="services-heading">
                Banking Services
              </Typography>
              <Grid container>
                {user?.st === 0 ||
                user.dmt4 === 0 ||
                user?.aeps === 0 ||
                user?.nepal_transfer === 0 ||
                user?.upi_transfer === 0
                  ? banking
                      .filter((item) => {
                        if (user?.st === 0 && item.title === "Super Transfer") {
                          return undefined;
                        }
                        if (
                          user?.dmt4 === 0 &&
                          item.title === "Express Transfer"
                        ) {
                          return undefined;
                        }
                        if (user?.aeps === 0 && item.title === "AEPS") {
                          return undefined;
                        }
                        if (
                          user?.nepal_transfer === 0 &&
                          item.title === "Nepal Transfer"
                        ) {
                          return undefined;
                        }
                        if (
                          user?.upi_transfer === 0 &&
                          item.title === "UPI Transfer"
                        ) {
                          return undefined;
                        } else {
                          return item;
                        }
                      })
                      .map((mitem, index) => {
                        return (
                          <Grid
                            item
                            md={2}
                            index={index}
                            onClick={() => navigate(mitem.to)}
                            className="horizontal-sidenav"
                          >
                            <HNavButton item={mitem} />
                          </Grid>
                        );
                      })
                  : banking.map((item, index) => {
                      return (
                        <Grid
                          item
                          md={2}
                          index={index}
                          onClick={() => navigate(item.to)}
                          className="horizontal-sidenav"
                        >
                          <HNavButton item={item} />
                        </Grid>
                      );
                    })}
              </Grid>
            </Box>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              height: "90vh",
              alignItems: infoFetchedMob
                ? "flex-start"
                : user?.layout && user?.layout === 2
                ? "start"
                : "center",
            }}
            className="position-relative"
          >
            <Loader circleBlue loading={request} />
            {/* initial form */}
            <Grid container sx={{ display: "flex", justifyContent: "center" }}>
              <Grid
                item
                lg={6}
                sm={12}
                xs={12}
                sx={{
                  mb: { md: 2, sm: 4, xs: 4 },
                  mr: { md: 0, sm: 1.3, xs: 1.3 },
                }}
              >
                <Card
                  className="card-css"
                  sx={{
                    width: "100%",
                    px: 7,
                    py: 3,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      letterSpacing: "0.05rem",
                      textAlign: "left",
                      mt: 1,
                    }}
                  >
                    Express Money Transfer
                  </Typography>
                  <Box
                    component="form"
                    id="seachRemByAcc"
                    sx={{
                      pt: 1,
                      "& .MuiTextField-root": { mt: 2 },
                      objectFit: "contain",
                      overflowY: "scroll",
                    }}
                    onSubmit={getRemitterStatusByAcc}
                  >
                    <Grid container sx={{ pt: 1 }}>
                      <Grid item md={12} xs={12}>
                        <FormControl sx={{ width: "100%" }}>
                          <TextField autoComplete="off"
                            label="Mobile Number"
                            id="mobile"
                            name="mobile"
                            type="tel"
                            value={mobile}
                            size="small"
                            required
                            onChange={(e) => {
                              setIsMobv(PATTERNS.MOBILE.test(e.target.value));
                              if (e.target.value === "") {
                                setRemitterStatus("");
                                setInfoFetchedMob(false);
                                bene && setBene([]);

                                setIsMobv(true);
                              }

                              setMobile(e.target.value);
                              if (e.target.value.length === 9) {
                                setRemitterStatus("");
                                setInfoFetchedMob(false);
                                bene && setBene([]);
                              }
                              if (PATTERNS.MOBILE.test(e.target.value)) {
                                getRemitterStatus(e.target.value);
                              }
                            }}
                            error={!isMobv}
                            helperText={!isMobv ? "Enter valid Mobile" : ""}
                            // onKeyDown={(e) => {
                            //   if (
                            //     (e.which >= 65 &&
                            //       e.which <= 90 &&
                            //       e.which !== 86) ||
                            //     e.key === "+"
                            //   ) {
                            //     e.preventDefault();
                            //   }
                            //   if (e.target.value.length === 10) {
                            //     if (e.key.toLowerCase() !== "backspace") {
                            //       e.preventDefault();
                            //     }

                            //     if (e.key.toLowerCase() === "backspace") {
                            //     }
                            //   }
                            // }}
                            inputProps={{
                              form: {
                                autocomplete: "off",
                              },
                              maxLength: "10",
                            }}
                            disabled={request && request && true}
                          />
                        </FormControl>
                      </Grid>

                      {infoFetchedMob && infoFetchedMob && (
                        <div style={{ width: "100%" }}>
                          <Grid item md={12} xs={12}>
                            <FormControl sx={{ width: "100%" }}>
                              <TextField autoComplete="off"
                                label="Name"
                                id="name"
                                size="small"
                                value={
                                  remitterStatus &&
                                  remitterStatus.firstName +
                                    " " +
                                    remitterStatus.lastName
                                }
                                disabled={request && request && true}
                                // InputProps={
                                //   remitterStatus &&
                                //   remitterStatus.limitIncreaseOffer && {
                                //     endAdornment: (
                                //       <InputAdornment position="end">
                                //         <Button variant="text" onClick={ekycCall}>
                                //           E-KYC
                                //         </Button>
                                //       </InputAdornment>
                                //     ),
                                //   }
                                // }
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={12} xs={12}>
                            <table className="mt-wide-table">
                              <tr>
                                <td>Limit Per Transaction</td>
                                <td
                                  style={{
                                    textAlign: "right",
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {currencySetter(100000.0)}
                                </td>
                              </tr>
                            </table>
                            {/* <FormControl sx={{ width: "100%" }}>
                        <TextField autoComplete="off"
                          label="Limit Per Transaction"
                          id="limit"
                          size="small"
                          disabled={request && request && true}
                          value="100000.00"
                        />
                      </FormControl> */}
                          </Grid>
                        </div>
                      )}
                      {!infoFetchedMob && (
                        <>
                          <Grid
                            item
                            md={12}
                            xs={12}
                            sx={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              textAlign="center"
                              sx={{
                                width: "100%",
                                mt: 1,
                              }}
                            >
                              OR
                            </Typography>
                          </Grid>
                          <Grid item md={12} xs={12}>
                            <FormControl sx={{ width: "100%", mt: -1 }}>
                              <TextField autoComplete="off"
                                label="Account Number"
                                id="acc"
                                size="small"
                                required
                                disabled={request && request ? true : false}
                              />
                            </FormControl>
                          </Grid>
                        </>
                      )}
                    </Grid>
                    {!infoFetchedMob && (
                      <Grid item md={12} xs={12}>
                        <Button
                          type="submit"
                          form="seachRemByAcc"
                          // onClick={() => {
                          //   getRemitterStatusByAcc();
                          // }}
                          //
                          className="btn-background"
                          sx={{
                            width: "100%",
                            my: 3,
                          }}
                          endIcon={<ArrowForwardIosIcon />}
                          disabled={request && request ? true : false}
                        >
                          Proceed
                        </Button>
                      </Grid>
                    )}
                  </Box>
                </Card>
                {/* {numberList && numberList.length > 0 && ( */}
                <DmrNumberListModal
                  numberList={numberList}
                  setMobile={(mob) => {
                    setMobile(mob);
                    getRemitterStatus(mob);
                  }}
                />
                {/* )} */}
              </Grid>
              {infoFetchedMob && infoFetchedMob && (
                <Grid
                  lg={6}
                  sm={12}
                  xs={12}
                  sx={{ mb: { md: 2, sm: 4, xs: 4 } }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "end",
                      mx: { md: 2, sm: 1, xs: 0 },
                      mr: { xs: 1.3, md: 2 },
                    }}
                  >
                    <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
                      Beneficiary List ({bene.length})
                    </Typography>
                    <DmrAddBeneficiaryModal
                      rem_mobile={mobile}
                      apiEnd={ApiEndpoints.ADD_BENE_EXPRESS}
                      getRemitterStatus={refreshRemitterStatus}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "end",
                      mx: { md: 2, sm: 1, xs: 0 },
                      mr: { xs: 1.3, md: 2 },
                    }}
                  >
                    <BeneSearchBar setSearch={setSearch} />
                  </Box>
                  <div
                    className="enable-scroll"
                    style={{
                      overflowY: "scroll",
                      height: "85vh",
                      scrollBehavior: "smooth",
                    }}
                  >
                    {bene.length <= 0 ? (
                      <Typography sx={{ mt: 2 }}>
                        No Beneficiary found.
                      </Typography>
                    ) : filteredBenelist.length <= 0 ? (
                      <Typography sx={{ mt: 2 }}>
                        No Beneficiary found.
                      </Typography>
                    ) : (
                      // beneficiary mapping......
                      filteredBenelist.map((ben, index) => {
                        return (
                          <Card
                            className="card-css"
                            key={index}
                            sx={{
                              display: "flex",
                              justifyContent: "left",
                              // p: 1,
                              px: 2,
                              py: 1.5,
                              // pl: { md: 1, sm: 0, xs: 0 },
                              m: { md: 2, sm: 1, xs: 1 },
                              ml: { md: 2, sm: 0, xs: 0.5 },
                            }}
                          >
                            <Box
                              sx={{
                                alignItems: "center",
                                justifyContent: "center",
                                display: { md: "flex", sm: "none", xs: "none" },
                                background: randomColors(),
                                borderRadius: "4px",
                                height: "64px",
                                width: "64px",
                                p: 1,
                                position: "relative",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "40px",
                                }}
                              >
                                {ben &&
                                  ben.bene_name &&
                                  ben.bene_name.charAt(0).toUpperCase()}
                              </Typography>
                              <Box>
                                {ben.last_success_date &&
                                ben.last_success_date !== null ? (
                                  <Box
                                    sx={{
                                      position: "absolute",
                                      top: "-9px",
                                      right: "-5px",
                                      color: "#00bf78",
                                    }}
                                  >
                                    <Tooltip title="Already Verified">
                                      <VerifiedIcon sx={{ fontSize: "17px" }} />
                                    </Tooltip>
                                  </Box>
                                ) : (
                                  // <Button
                                  //   size="small"
                                  //   className="button-green"
                                  //   sx={{
                                  //     fontSize: "10px",
                                  //     padding: "0px 5px !important",
                                  //     textTransform: "uppercase",
                                  //     minWidth: "59px !important",
                                  //   }}
                                  //   color="success"
                                  // >
                                  //   Verified
                                  // </Button>

                                  <AccountVerificationModal
                                    ben={ben}
                                    rem_number={mobile}
                                    remitterStatus={remitterStatus}
                                    getRemitterStatus={getRemitterStatus}
                                  />
                                )}
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                justifyContent: "space-between",
                                width: "100%",
                                alignContent: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  ml: { xs: 1, md: 3 },
                                  textAlign: "center",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "left",
                                    fontWeight: "500",
                                    textTransform: "capitalize",
                                    textAlign: {
                                      md: "center",
                                      sm: "left",
                                      xs: "left",
                                    },
                                  }}
                                >
                                  {capitalize1(ben.bene_name)}
                                  {/* {ben.last_success_date &&
                            ben.last_success_date !== null ? (
                              <Tooltip title="Verified">
                                <CheckCircleOutlinedIcon
                                  color="success"
                                  sx={{ ml: "4px", fontSize: "12px" }}
                                />
                              </Tooltip>
                            ) : (
                              <Tooltip title="Unverified">
                                <ErrorIcon
                                  color="error"
                                  sx={{ ml: "4px", fontSize: "12px" }}
                                />
                              </Tooltip>
                            )} */}
                                </div>

                                <Grid
                                  sx={{
                                    display: { xs: "flex", md: "grid" },
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography
                                    sx={{ textAlign: "left", fontSize: "13px" }}
                                  >
                                    A/C : {ben.bene_acc}
                                  </Typography>
                                  <Typography
                                    sx={{ textAlign: "left", fontSize: "13px" }}
                                  >
                                    IFSC : {ben.ifsc}
                                  </Typography>
                                </Grid>
                              </Box>
                              <div
                                style={{
                                  display: "grid",
                                  alignItems: "center",
                                }}
                              >
                                <div style={{ display: "flex" }}>
                                  <RetExpresTransferModal
                                    type="NEFT"
                                    ben={ben}
                                    rem_number={mobile && mobile}
                                    rem_details={remitterStatus}
                                    apiEnd={ApiEndpoints.EXP_TRANSFER}
                                    view="Express Transfer"
                                  />
                                  <RetExpresTransferModal
                                    type="IMPS"
                                    ben={ben}
                                    rem_number={mobile && mobile}
                                    rem_details={remitterStatus}
                                    apiEnd={ApiEndpoints.EXP_TRANSFER}
                                    view="Express Transfer"
                                  />
                                </div>
                                <div
                                  style={{
                                    textAlign: "end",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    marginTop: "6px",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: {
                                        md: "none",
                                        sm: "block",
                                        xs: "block",
                                      },
                                    }}
                                  >
                                    {ben.last_success_date &&
                                    ben.last_success_date !== null ? (
                                      <Tooltip title="Already Verified">
                                        <Button
                                          size="small"
                                          // className="button-green"
                                          sx={{
                                            fontSize: "10px",
                                            padding: "0px 5px !important",
                                            textTransform: "uppercase",
                                            minWidth: "59px !important",
                                            color: "#00bf78",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          Already Verified
                                        </Button>
                                      </Tooltip>
                                    ) : (
                                      <AccountVerificationModal
                                        ben={ben}
                                        rem_number={mobile}
                                        remitterStatus={remitterStatus}
                                        getRemitterStatus={getRemitterStatus}
                                        view="express"
                                      />
                                    )}
                                  </Box>
                                  <DeleteBeneficiaryModal
                                    bene={ben}
                                    mob={mobile && mobile}
                                    getRemitterStatus={getRemitterStatus}
                                    apiEnd={ApiEndpoints.REMOVE_BENE_EXPRESS}
                                    view="expressTransfer"
                                  />
                                </div>
                              </div>
                            </Box>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </Grid>
              )}
            </Grid>
            {addNewRem && addNewRem && (
              <DmrAddRemitterModal
                rem_mobile={mobile}
                getRemitterStatus={getRemitterStatus}
                apiEnd={ApiEndpoints.ADD_REM}
                view="expressTransfer"
                setAddNewRem={setAddNewRem}
                setOtpRef={setOtpRefId}
              />
            )}
            {verifyotp && verifyotp && (
              <DmrVrifyNewUser
                rem_mobile={mobile}
                getRemitterStatus={getRemitterStatus}
                view="expressTransfer"
                verifyotp={verifyotp}
                setVerifyotp={setVerifyotp}
                apiEnd={ApiEndpoints.VALIDATE_OTP}
                otpRefId={otpRefId && otpRefId}
                setOtpRefId={setOtpRefId}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ExpressMoneyTransfer;
