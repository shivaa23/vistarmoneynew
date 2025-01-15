import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  Icon,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import {
  back,
  Call1,
  flight1,
  LimitAcc,
  LimitTran,
  Name,
} from "../iconsImports";
import { get, postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast } from "../utils/ToastUtil";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DmrNumberListModal from "../modals/DmrNumberListModal";
import DmrAddBeneficiaryModal from "../modals/DmrAddBeneficiaryModal";
import DmrAddRemitterModal from "../modals/DmrAddRemitterModal";
import DmrVrifyNewUser from "../modals/DmrVrifyNewUser";
import Loader from "../component/loading-screen/Loader";
import { PATTERNS } from "../utils/ValidationUtil";
import BeneSearchBar from "../component/BeneSearchBar";
import { useEffect } from "react";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";
import OutletRegistration from "../component/OutletRegistration";
import { banking } from "../_nav";
import HNavButton from "../component/HNavButton";
import { useNavigate } from "react-router-dom";
import useResponsive from "../hooks/useResponsive";
import NoDataView from "../component/NoDataView";
import CustomTabs from "../component/CustomTabs";
import { mt_tab_value } from "../utils/constants";
import BeneTableComponent from "../component/BeneCardComponent";
import { getTableHeadRowColor } from "../theme/setThemeColor";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DmtAddRemModal from "./DmtAddRemModal";
import RemitterKyc from "./aeps/RemitterKyc";
import Dmt3AddBeneficiaryModal from "../modals/Dmt3AddBeneficiaryModal";
import Dmt3AddRemModal from "../modals/Dmt3AddRemModal";
const DmtContainer = ({
  filteredBeneList,
  // type,
  setMoney = false,
  resetView,
}) => {
  const [infoFetchedMob, setInfoFetchedMob] = useState(false);
  const [request, setRequest] = useState(false);
  const [remitterStatus, setRemitterStatus] = useState();
  const ismobile = useResponsive("down", "md");

  const [search, setSearch] = useState("");
  const [mobile, setMobile] = useState("");
  const [bene, setBene] = useState([]);
  const [filteredBenelist, setFilteredBenelist] = useState([]);
  const [otpRefId, setOtpRefId] = useState("");
  const [verifyotp, setVerifyotp] = useState(false);
  const [addNewRem, setAddNewRem] = useState(false);
  const [isValAccNum, setisValAccNum] = useState(true);
  const [isMobv, setIsMobv] = useState(true);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const userLat = authCtx.location.lat;
  const userLong = authCtx.location.long;
  const [numberList, setNumberList] = useState([]);
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [currentType, setCurrentType] = useState("dmt1");
  const [type, settype] = useState("dmt1");
  const [dmr2RemRes, setDmr2RemRes] = useState();
  const [remRefKey, setRemRefKey] = useState({});
  const [openRemKyc, setOpenRemKyc] = useState(false);
  const [addNewRemDmt3, setAddNewRemDmt3] = useState(false);
  // const [tabs, setTabs] = useState([]);
  const handleCloseKycModal = () => {
    setOpenRemKyc(false); // Close the modal when this function is called
  };
  useEffect(() => {
    if (search) {
      const myList = bene.filter((item) => {
        // console.log("item", item);
        return item.name
          ? item.name.toUpperCase().includes(search.toUpperCase())
          : item.bene_name.toUpperCase().includes(search.toUpperCase());
      });
      setFilteredBenelist(myList);
    } else {
      setFilteredBenelist(bene);
    }

    return () => {};
  }, [search, bene]);

  const dmtTabs = mt_tab_value;

  if (user?.dmt1 === 0 && dmtTabs["0"]) {
    delete dmtTabs["0"];
  }

  if (user?.dmt2 === 0 && dmtTabs["1"]) {
    delete dmtTabs["1"];
  }

  // if (user?.dmt1 !== 0 && dmtTabs[0]) {
  //   delete dmtTabs[0];
  // }

  const getRemitterStatus = (number) => {
    console.log("calling api");
    const apiEnd =
      type == "dmt1"
        ? ApiEndpoints.GET_REMMITTER_STATUS_NEW
        : type == "dmt2"
        ? ApiEndpoints.DMT2_REM_STAT
        : ApiEndpoints.GET_REMMITTER_STATUS_DMT3;

    postJsonData(
      apiEnd,
      {
        number: number,
        type: "M",
        latitude: userLat,
        longitude: userLong,
      },
      setRequest,
      (res) => {
        if (res && res.status === 200 && res.data.message === "OTP Sent") {
          setOtpRefId(res.data.otpReference);
          setVerifyotp(true);
        } else if (res && res.data && res.data.remitter) {
          const data = type === "dmt1" ? res.data.remitter : res.data;
          setMobile(number);
          setRemitterStatus(type === "dmt1" ? data : data.remitter);
          setBene(type === "dmt1" ? data.beneficiaries : data.data);
          setInfoFetchedMob(true);
          setNumberList("");
        } else {
          console.log("im here3");
          setRemitterStatus();
        }
      },
      (error) => {
        if (error && error) {
          if (
            error.response.status === 404 &&
            error.response.data.message === "Please do remitter e-kyc."
          ) {
            if (type == "dmt2") {
              console.log("errorin", error);
              setOpenRemKyc(true);
              // setOtpRefId(error?.response?.data?.otpReference);
            }
          }
          if (
            error.response.status === 404 &&
            error.response.data.message === "Remitter Not Found"
          ) {
            if (type === "dmt1") {
              setRemRefKey(error.response.data.data);
            }
            setAddNewRem(true);
          }
          if (
            error.response.status == 404 &&
            error.response.data.message ==
              "Please validate your aadhaar number."
          ) {
            console.log("im inside dmt3");
            setAddNewRemDmt3(true);
          }
          if (error?.response?.data?.step == 3) {
            console.log("im here");
            setVerifyotp(true);
            setDmr2RemRes(error?.response?.data?.data);
          }
        }
      }
    );
  };

  const returnMoneyNew = () => {
    setInfoFetchedMob(false);
  };
  console.log("Sss", setMoney);
  const refreshRemitterStatus = (number) => {
    postJsonData(
      ApiEndpoints.REF_REMMITTER_STATUS1,
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
          const data = res.data.remitter;
          setMobile(number);
          setRemitterStatus(data);
          setBene(data.beneficiaries);
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

  const getRemitterStatusByAcc = (event) => {
    event.preventDefault();
    const number = document.getElementById("acc").value;
    postJsonData(
      ApiEndpoints.GET_REMMITTER_STATUS_ACC,
      {
        number: number,
      },
      setRequest,
      (res) => {
        if (res && res.data) {
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
  const handleBack = () => {
    resetView(false);
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
  console.log("type is", type);

  console.log("rem", remitterStatus);
  const tabs = [
    user?.dmt1 === 1 && { label: "Dmt 1" },
    user?.dmt2 === 1 && { label: "Dmt 2" },
    user?.dmt4 === 1 && { label: "Dmt 3" },
  ].filter(Boolean);

  // useEffect(() => {
  //   if (user?.dmt1 === 1 && !tabs.includes({ label: "Dmt 1" })) {
  //     setTabs(tabs.push({ label: "Dmt 1" }));
  //   }
  //   if (user?.dmt2 === 1 && !tabs.includes({ label: "Dmt 2" })) {
  //     setTabs(tabs.push({ label: "Dmt 2" }));
  //   }
  //   if (user?.dmt3 === 1 && !tabs.includes({ label: "Dmt 3" })) {
  //     setTabs(tabs.push({ label: "Dmt 3" }));
  //   }
  // }, []);

  const handleChange = (event, newValue) => {
    console.log("newval", newValue);
    setValue(newValue);
    settype(mt_tab_value[newValue]);
    setCurrentType(mt_tab_value[newValue]);
    console.log("cms value is", type);
  };
  console.log("These are your values", value);
  return (
    <>
      {user && (
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
                            key={index}
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
                          key={index}
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
          <Box
            style={{
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

            <Grid
              container
              sx={{
                display: "flex",
                // position: "absolute",
                justifyContent: "center",
              }}
            >
              <Grid
                item
                xs={12}
                sx={{ mb: { md: 2, sm: 4, xs: 4 }, marginLeft: 0 }}
              >
                {!infoFetchedMob &&
                  !infoFetchedMob &&
                  !addNewRem &&
                  !addNewRem &&
                  !verifyotp && (
                    <CustomTabs
                      tabs={tabs}
                      value={value}
                      onChange={handleChange}
                    />
                  )}
                {user && !user.instId && type === "dmt1" && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100vh",
                      width: "100%",
                    }}
                  >
                    <OutletRegistration autoOpen />
                  </Box>
                )}
                {(type === "dmt1" && user.instId) ||
                type === "dmt2" ||
                type === "dmt3" ? (
                  <Card
                    className="card-css"
                    sx={{
                      position: "absolute",
                      width: "100%",
                      pb: 2,
                      px: 1.5,
                      m: 1,
                    }}
                  >
                    {!infoFetchedMob &&
                      !infoFetchedMob &&
                      !addNewRem &&
                      !addNewRem &&
                      !verifyotp && (
                        <Grid
                          item
                          xs={12}
                          sm="auto"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mr: 2,
                            mt: 1,
                          }}
                        >
                          <Button
                            size="small"
                            id="verify-btn"
                            className="button-props"
                            onClick={handleBack}
                          >
                            <span style={{ marginRight: "5px" }}>Home</span>
                            <img
                              src={back}
                              alt="back"
                              style={{ width: "18px", height: "20px" }}
                            />
                          </Button>
                        </Grid>
                      )}

                    <Box>
                      {!mobile ? (
                        <Typography
                          sx={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            letterSpacing: "0.05rem",
                            textAlign: "left",
                            mt: 1,
                          }}
                        >
                          {type === "dmt1"
                            ? "Domestic Money Transfer 1"
                            : type === "dmt2"
                            ? "Domestic Money Transfer 2"
                            : "Domestic Money Transfer 3"}
                        </Typography>
                      ) : null}

                      <Grid
                        container
                        sx={{
                          pb: 1.5,
                          "& .MuiTextField-root": { mt: 2 },
                          objectFit: "contain",
                          overflowY: "scroll",
                          // position: "fixed",
                        }}
                      >
                        <Grid container lg={12} sm={12} xs={12}>
                          {!infoFetchedMob &&
                            !infoFetchedMob &&
                            !addNewRem &&
                            !addNewRem &&
                            !verifyotp && (
                              <FormControl sx={{ width: "100%" }}>
                                <TextField
                                  autoComplete="off"
                                  size="small"
                                  label="Mobile Number"
                                  id="mobile"
                                  name="mobile"
                                  type="tel"
                                  value={mobile}
                                  required
                                  onChange={(e) => {
                                    setIsMobv(
                                      PATTERNS.MOBILE.test(e.target.value)
                                    );
                                    if (e.target.value === "") setIsMobv(true);
                                    setMobile(e.target.value);
                                    if (e.target.value === "") {
                                      setRemitterStatus("");
                                      setInfoFetchedMob(false);
                                      bene && setBene([]);
                                    }
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
                                  helperText={
                                    !isMobv ? "Enter valid Mobile Number" : ""
                                  }
                                  inputProps={{
                                    form: {
                                      autocomplete: "off",
                                    },
                                  }}
                                  disabled={request && request && true}
                                />
                              </FormControl>
                            )}
                        </Grid>
                      </Grid>
                      {addNewRemDmt3 && (
                        <Dmt3AddRemModal
                          rem_mobile={mobile}
                          getRemitterStatus={getRemitterStatus}
                          view="moneyTransfer"
                          dmtValue={type}
                          setAddNewRem={setAddNewRemDmt3}
                        />
                      )}

                      {addNewRem && addNewRem && (
                        <DmtAddRemModal
                          rem_mobile={mobile}
                          getRemitterStatus={getRemitterStatus}
                          apiEnd={
                            type === "dmt1"
                              ? ApiEndpoints.ADD_REM
                              : ApiEndpoints.DMT2_ADD_REM
                          }
                          view="moneyTransfer"
                          dmtValue={type}
                          setAddNewRem={setAddNewRem}
                          otpRef={otpRefId}
                          setOtpRef={setOtpRefId}
                          remRefKey={remRefKey}
                          setRemRefKey={setRemRefKey}
                        />
                      )}
                      {verifyotp && verifyotp && (
                        <DmrVrifyNewUser
                          rem_mobile={mobile}
                          getRemitterStatus={getRemitterStatus}
                          view="moneyTransfer"
                          verifyotp={verifyotp}
                          setVerifyotp={setVerifyotp}
                          apiEnd={
                            type == "dmt2"
                              ? ApiEndpoints.DMT2_REGISTER_REM
                              : ApiEndpoints.VALIDATE_OTP
                          }
                          otpRefId={otpRefId}
                          setOtpRefId={setOtpRefId}
                          dmtValue={type}
                          dmr2RemRes={dmr2RemRes}
                        />
                      )}
                      {openRemKyc && type == "dmt2" && (
                        <RemitterKyc
                          open={openRemKyc}
                          onClose={handleCloseKycModal}
                          remRefKey={remRefKey}
                          rem_mobile={mobile}
                          dmtValue={type}
                          setVerifyotp={setVerifyotp}
                          setDmr2RemRes={setDmr2RemRes}
                        />
                      )}
                      {infoFetchedMob && infoFetchedMob && (
                        <Grid width="100%">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginTop: "-13px",
                            }}
                          >
                            <Button
                              className="refresh-icon-risk"
                              variant="outlined"
                              startIcon={<ArrowBackIcon />}
                              sx={{
                                display: "flex",
                                alignItems: "left",
                              }}
                              onClick={() => {
                                setInfoFetchedMob(false);
                                setRemitterStatus();
                                setMobile("");
                              }}
                            >
                              Back
                            </Button>

                            <h1
                              style={{
                                fontSize: "24px",
                                fontWeight: "600",
                                color: "#1877f2",
                                textAlign: "center",
                                margin: "0 auto",
                              }}
                            >
                              {type === "dmt1"
                                ? "Domestic Money Transfer 1"
                                : type == "dmt2"
                                ? "Domestic Money Transfer 2"
                                : "Domestic Money Transfer 3"}
                            </h1>
                          </div>
                          <TableContainer
                            component={Paper}
                            sx={{ mt: 0, pt: 0, mb: 1.5 }}
                          >
                            <Table>
                              <TableHead>
                                <TableRow
                                  sx={{
                                    // backgroundColor: getTableHeadRowColor(),
                                    color: "#fff",
                                    fontFamily: "Poppins",
                                    borderBottom: "0.5px solid #DBDDDF",
                                  }}
                                >
                                  <TableCell align="center">
                                    Remitter Details
                                  </TableCell>
                                  <TableCell align="center">
                                    Contact Details
                                  </TableCell>
                                  <TableCell align="center">
                                    Limit Available
                                  </TableCell>
                                  <TableCell align="center">
                                    Limit Per Transaction
                                  </TableCell>
                                  <TableCell align="center">
                                    Add Beneficiary
                                  </TableCell>
                                </TableRow>
                              </TableHead>

                              <TableBody>
                                <TableRow>
                                  <TableCell
                                    sx={{
                                      verticalAlign: "middle",
                                      padding: "8px",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Box
                                        component="img"
                                        src={Name}
                                        alt="Name"
                                        sx={{
                                          maxWidth: "25px",
                                          maxHeight: "50px",
                                          mr: 1,
                                        }}
                                      />
                                      <Typography
                                        sx={{
                                          fontSize: "12px",
                                          fontWeight: "600",
                                          mt: 0.5,
                                        }}
                                      >
                                        {type === "dmt2"
                                          ? remitterStatus?.fname
                                          : remitterStatus?.firstName}{" "}
                                        {type === "dmt2"
                                          ? remitterStatus?.lname
                                          : remitterStatus?.lastName}
                                      </Typography>
                                    </Box>
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      verticalAlign: "middle",
                                      padding: "8px",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Box
                                        component="img"
                                        src={Call1}
                                        alt="Call"
                                        sx={{
                                          maxWidth: "25px",
                                          maxHeight: "50px",
                                          mr: 1,
                                        }}
                                      />
                                      <Typography
                                        sx={{
                                          fontSize: "12px",
                                          fontWeight: "600",
                                          mt: 0.2,
                                        }}
                                      >
                                        {remitterStatus?.mobile}
                                      </Typography>
                                      <BorderColorIcon
                                        sx={{
                                          color: "Black",
                                          width: 15,
                                          ml: 1,
                                        }}
                                        onClick={returnMoneyNew}
                                      />
                                    </Box>
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      verticalAlign: "middle",
                                      padding: "8px",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Box
                                        component="img"
                                        src={LimitAcc}
                                        alt="Limit"
                                        sx={{
                                          maxWidth: "25px",
                                          maxHeight: "50px",
                                          mr: 1,
                                        }}
                                      />
                                      <Box sx={{ fontWeight: "bold", ml: 1 }}>
                                        {type === "dmt2"
                                          ? remitterStatus?.bank1_limit
                                          : remitterStatus?.limitTotal}
                                      </Box>
                                    </Box>
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      verticalAlign: "middle",
                                      padding: "8px",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Box
                                        component="img"
                                        src={LimitTran}
                                        alt="Limit"
                                        sx={{
                                          maxWidth: "25px",
                                          maxHeight: "50px",
                                          mr: 1,
                                        }}
                                      />
                                      <Box sx={{ fontWeight: "bold" }}>
                                        {type === "dmt2"
                                          ? 5000
                                          : remitterStatus?.limitPerTransaction}
                                      </Box>
                                    </Box>
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      verticalAlign: "middle",
                                      padding: "8px",
                                    }}
                                  >
                                    {type === "dmt3" ? (
                                      <Dmt3AddBeneficiaryModal />
                                    ) : (
                                      <DmrAddBeneficiaryModal
                                        type={type}
                                        rem_mobile={mobile}
                                        getRemitterStatus={
                                          type === "dmt1"
                                            ? refreshRemitterStatus
                                            : getRemitterStatus
                                        }
                                        apiEnd={
                                          type === "dmt1"
                                            ? ApiEndpoints.ADD_BENE
                                            : ApiEndpoints.DMT2_ADD_BENE
                                        }
                                        view="MT_View"
                                        sx={{
                                          width: { xs: "90%", sm: "auto" },
                                        }}
                                      />
                                    )}
                                  </TableCell>
                                </TableRow>
                                {/* Render more rows as needed */}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      )}
                      <Box
                        component="form"
                        id="seachRemByAcc"
                        onSubmit={getRemitterStatusByAcc}
                        validate
                        sx={{ width: "100%" }}
                      />
                      {/* </Box> */}
                    </Box>
                    <DmrNumberListModal
                      numberList={numberList}
                      setMobile={(mob) => {
                        setMobile(mob);
                        getRemitterStatus(mob);
                      }}
                    />
                    {infoFetchedMob && infoFetchedMob && (
                      <Grid
                        lg={12}
                        sm={12}
                        xs={12}
                        sx={{ mb: { md: 2, sm: 4, xs: 12 } }}
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
                          <Box
                            sx={{
                              flex: 1, // Ensure it takes available space
                              maxWidth: {
                                lg: "100%",
                                md: "200px",
                                sm: "150px",
                                xs: "100%",
                              }, // Adjust max-width based on screen size
                            }}
                          >
                            <BeneSearchBar
                              setSearch={setSearch}
                              remMargin={true}
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
                            <Typography sx={{ fontSize: "18px", mb: 1 }}>
                              Total Beneficiary ({bene.length})
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          className="
               enable-scroll "
                          style={{
                            overflow: "auto", // Ensure that the overflow behavior is automatic
                            height: "85vh", // Fixed height to control the scrolling area
                            paddingBottom: "8px",
                            "&::-webkit-scrollbar": { display: "none" }, // Hide scrollbar for Webkit browsers
                            msOverflowStyle: "none", // Hide scrollbar for Internet Explorer and Edge
                            scrollbarWidth: "none",
                          }}
                        >
                          {bene.length <= 0 ? (
                            <Typography sx={{ mt: 2 }}>
                              No Beneficiary found.
                              <Typography sx={{ fontWeight: "bold" }}>
                                Enter Remitter's Mobile Number to view
                                Beneficiary List
                              </Typography>
                              <NoDataView />
                            </Typography>
                          ) : filteredBenelist.length <= 0 ? (
                            <Typography sx={{ mt: 2 }}>
                              No Beneficiary found.
                            </Typography>
                          ) : (
                            <TableContainer
                              sx={{
                                mt: 1,
                                // maxHeight: "400px",
                                overflowY: "auto",
                              }}
                            >
                              <Table>
                                <TableHead>
                                  <TableRow
                                    sx={{
                                      backgroundColor: getTableHeadRowColor(),
                                      color: "#fff",
                                      fontFamily: "Poppins",
                                      borderBottom: "0.5px solid #DBDDDF",
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 1,
                                    }}
                                  >
                                    <TableCell
                                      align="center"
                                      sx={{ padding: 2 }}
                                    >
                                      Avatar
                                    </TableCell>
                                    <TableCell sx={{ padding: 2 }}>
                                      Name
                                    </TableCell>
                                    <TableCell sx={{ padding: 2 }}>
                                      Account No
                                    </TableCell>
                                    <TableCell sx={{ padding: 2 }}>
                                      IFSC
                                    </TableCell>
                                    <TableCell sx={{ padding: 2 }}>
                                      Verified
                                    </TableCell>
                                    <TableCell sx={{ padding: 2, ml: 2 }}>
                                      Actions
                                    </TableCell>
                                    <TableCell sx={{ padding: 2 }}>
                                      Delete
                                    </TableCell>
                                  </TableRow>
                                </TableHead>

                                <TableBody>
                                  {filteredBenelist?.map((ben, index) => (
                                    <BeneTableComponent
                                      key={index}
                                      type={type}
                                      ben={ben}
                                      index={index}
                                      mobile={mobile}
                                      remitterStatus={remitterStatus}
                                      getRemitterStatus={getRemitterStatus}
                                      view="MT_View"
                                    />
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          )}
                        </Box>
                      </Grid>
                    )}
                  </Card>
                ) : null}
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </>
  );
};
export default DmtContainer;
