import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast } from "../utils/ToastUtil";
import DmrNumberListModal from "../modals/DmrNumberListModal";
import DmrAddBeneficiaryModal from "../modals/DmrAddBeneficiaryModal";
import DmrAddRemitterModal from "../modals/DmrAddRemitterModal";
import DmrVrifyNewUser from "../modals/DmrVrifyNewUser";
import Loader from "../component/loading-screen/Loader";
import BeneSearchBar from "../component/BeneSearchBar";
import { PATTERNS } from "../utils/ValidationUtil";
import { getEnv, getTableHeadRowColor } from "../theme/setThemeColor";
import AuthContext from "../store/AuthContext";
import { PROJECTS, vendor_tab_value } from "../utils/constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { banking } from "../_nav";
import HNavButton from "../component/HNavButton";
import { useNavigate } from "react-router-dom";
import BeneCardVender from "../component/BeneCardVender";
import { back, Call1, LimitAcc, LimitTran, Name } from "../iconsImports";
import NoDataView from "../component/NoDataView";
import CustomTabs from "../component/CustomTabs";
import VendorAddBeneficiaryModal from "../modals/VendorAddBeneficiaryModal ";

const VendorPayments = ({ resetView }) => {
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
  const [value, setValue] = useState(0);
  const [currentType, setCurrentType] = useState(0);
  const [type, settype] = useState("express");

  const handleBack = () => {
    resetView(false);
  };
  //
  // const envName = getEnv();
  console.log("type is ", type);

  useEffect(() => {
    if (user) {
      // console.log("here in if", user);
      // if (!infoFetchedMob) {
      //   settype(
      //     user?.dmt4 === 1 && user?.st === 1
      //       ? "express"
      //       : user?.dmt4 === 1
      //       ? "express"
      //       : user?.st === 1
      //       ? "super"
      //       : "express"
      //   );
      // }
    }
  }, [user]);

  const getRemitterStatus = (number) => {
    postJsonData(
      type === "express"
        ? ApiEndpoints.NEW_GET_REMMITTER_STATUS
        : ApiEndpoints.GET_REMMITTER_STATUS_SUPER,
      {
        number: number,
      },
      setRequest,
      (res) => {
        if (res && res?.status === 200 && res?.data?.message === "OTP Sent") {
          setOtpRefId(res?.data?.otpReference);
          setVerifyotp(true);
        } else if (res && res?.data && res?.data) {
          const data = res?.data;
          if (res?.data?.remitter && res?.data?.message === "Verify Remitter") {
            setVerifyotp(true);

            // setOtpRefId(res.data.otpReference);
          }
          setMobile(number);
          setRemitterStatus(data?.remitter);
          setBene(data?.data);
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
  const returnMoneyNew = () => {
    setInfoFetchedMob(false);
  };
  const [numberList, setNumberList] = useState([]);

  const getRemitterStatusByAcc = (event) => {
    event.preventDefault();
    const number = document.getElementById("acc")?.value;
    postJsonData(
      ApiEndpoints.GET_REMMITTER_STATUS_ACC,
      {
        // number: number,
        number: mobile,
      },
      setRequest,
      (res) => {
        if (res && res.data && res.data) {
          const data = res.data.data;
          if (data?.length > 0) {
            setNumberList(data);
            document.getElementById("acc").value = "";
            document.getElementById("acc").focus = "off";
          } else {
            // apiErrorToast("No Vendor Found! Kindly Change Account Number");
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
  const tabs = [
    { label: "Wallet" },
    user?.st === 1 && { label: "Vendor Payment" },
  ].filter(Boolean);
  const handleChange = (event, newValue) => {
    console.log("newval", newValue);
    setValue(newValue);
    settype(vendor_tab_value[newValue]);
    setCurrentType(newValue);

    console.log("vendor type", type);
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
      {/* {user && !user.instId && (
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
      )} */}
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
                            index={index}
                            onClick={() => navigate(mitem.to)}
                            className="horizontal-sidenav"
                          >
                            <HNavButton item={mitem} />
                          </Grid>
                        );
                      })
                  : banking?.map((item, index) => {
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
            // style={{
            //   display: "flex",
            //   justifyContent: "center",
            //   height: "90vh",
            //   alignItems: infoFetchedMob
            //     ? "flex-start"
            //     : user?.layout && user?.layout === 2
            //     ? "start"
            //     : "center",
            // }}
            className="position-relative"
          >
            <Loader changeloder=" " circleBlue loading={request} />
            {/* initial form */}
            {!addNewRem && (
              <Grid
                container
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Grid
                  item
                  lg={12}
                  sm={12}
                  xs={12}
                  sx={{
                    mb: { md: 2, sm: 6, xs: 4 },
                    mr: { md: 0, sm: 1.3, xs: 1.3 },
                    marginLeft: 0,
                  }}
                >
                  {!infoFetchedMob &&
                    !infoFetchedMob &&
                    !addNewRem &&
                    !addNewRem &&
                    !verifyotp &&
                    !verifyotp && (
                      <CustomTabs
                        tabs={tabs}
                        value={value}
                        onChange={handleChange}
                      />
                    )}
                  <Card
                    className="card-css"
                    sx={{
                      width: "100%",
                      px: 1.5,
                      pb: 2,
                    }}
                  >
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
                        {type == "express" ? "Wallet" : "Vendor Payment"}
                      </Typography>
                    ) : null}
                    <Box
                      component="form"
                      id="seachRemByAcc"
                      sx={{
                        "& .MuiTextField-root": { mt: 2 },
                        objectFit: "contain",
                        overflowY: "scroll",
                      }}
                      onSubmit={getRemitterStatusByAcc}
                    >
                      <Grid
                        container
                        md={12}
                        sm={12}
                        xs={12}
                        sx={{
                          mb: { md: 1, sm: 4, xs: 4 },
                          mr: { md: 0, sm: 1.3, xs: 1.3 },
                        }}
                      >
                        <Grid item md={12} xs={12}>
                          {!infoFetchedMob &&
                            !infoFetchedMob &&
                            !addNewRem &&
                            !addNewRem &&
                            !verifyotp &&
                            !verifyotp && (
                              <FormControl sx={{ width: "100%" }}>
                                <TextField
                                  autoComplete="off"
                                  label="Mobile Number"
                                  id="mobile"
                                  name="mobile"
                                  type="tel"
                                  value={mobile}
                                  size="small"
                                  required
                                  onChange={(e) => {
                                    setIsMobv(
                                      PATTERNS.MOBILE.test(e.target.value)
                                    );
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
                                  helperText={
                                    !isMobv ? "Enter valid Mobile Number" : ""
                                  }
                                  inputProps={{
                                    form: {
                                      autocomplete: "off",
                                    },
                                    maxLength: "10",
                                  }}
                                  disabled={request && request && true}
                                />
                              </FormControl>
                            )}
                        </Grid>

                        {infoFetchedMob && infoFetchedMob && (
                          <Grid width="100%">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: "-7px",
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
                                {type == "express"
                                  ? "Wallet"
                                  : "Vendor Payment"}
                              </h1>
                            </div>
                            <TableContainer
                              component={Paper}
                              sx={{ mt: 0, pt: 0, mb: 0.5 }}
                            >
                              <Table>
                                {/* Table Head */}
                                <TableHead>
                                  <TableRow>
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
                                      Add Wallet
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
                                            : remitterStatus?.name}{" "}
                                          {/* {type === "dmt2"
                                          ? remitterStatus?.lname
                                          : remitterStatus?.lastName} */}
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
                                            mt: 0.4,
                                          }}
                                        >
                                          {remitterStatus?.number}
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
                                          {remitterStatus?.rem_limit}
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
                                          {remitterStatus?.limitPerTransaction ||
                                            "NA"}
                                        </Box>
                                      </Box>
                                    </TableCell>

                                    <TableCell
                                      sx={{
                                        verticalAlign: "middle",
                                        padding: "8px",
                                      }}
                                    >
                                      <VendorAddBeneficiaryModal
                                        rem_mobile={mobile}
                                        apiEnd={ApiEndpoints.ADD_BENE_EXPRESS}
                                        // apiEnd={ApiEndpoints.NEW_ADD_BENE_EXPRESS}
                                        getRemitterStatus={
                                          type === "express"
                                            ? getRemitterStatus
                                            : getRemitterStatus
                                        }
                                        type={type}
                                        view="MT_View"
                                      />
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                    {infoFetchedMob && infoFetchedMob && (
                      <Grid
                        lg={12}
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
                          <Box
                            sx={{
                              flex: 1,
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
                              label="Search Vendors"
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
                              Vendor List ({bene?.length})
                            </Typography>
                          </Box>
                        </Box>
                        <div
                          className="enable-scroll"
                          style={{
                            overflow: "auto",
                            height: "85vh",

                            paddingBottom: "8px",
                            "&::-webkit-scrollbar": { display: "none" }, // Hide scrollbar for Webkit browsers
                            msOverflowStyle: "none", // Hide scrollbar for Internet Explorer and Edge
                            scrollbarWidth: "none",
                          }}
                        >
                          {bene?.length <= 0 ? (
                            <Typography sx={{ mt: 2 }}>
                              No Vendor found.
                              <Typography sx={{ fontWeight: "bold" }}>
                                Enter Remitter's Mobile Number to view Vendor
                                List
                              </Typography>
                              <NoDataView />
                            </Typography>
                          ) : filteredBenelist?.length <= 0 ? (
                            <Typography sx={{ mt: 2 }}>
                              No Vendor found.
                            </Typography>
                          ) : (
                            <TableContainer sx={{ mt: 1 }}>
                              <Table>
                                <TableHead
                                  sx={{
                                    border: "none",
                                    color: "#fff",
                                    backgroundColor: getTableHeadRowColor(),
                                    fontFamily: "Poppins",
                                    paddingLeft: "8px",
                                    minHeight: "30px", // Set minimum height
                                    maxHeight: "30px", // Set maximum height
                                    borderBottom: "0.5px solid #DBDDDF",
                                    paddingBottom: "4px",
                                    paddingTop: "4px",
                                  }}
                                >
                                  <TableRow
                                    sx={{
                                      maxHeight: "30px", // Apply max height to the row

                                      paddingBottom: "4px",
                                      paddingTop: "4px",
                                    }}
                                  >
                                    <TableCell
                                      align="center"
                                      sx={{ maxHeight: "30px", padding: "4px" }}
                                    >
                                      Avatar
                                    </TableCell>
                                    <TableCell
                                      sx={{ maxHeight: "30px", padding: "4px" }}
                                    >
                                      Name
                                    </TableCell>
                                    <TableCell
                                      sx={{ maxHeight: "30px", padding: "4px" }}
                                    >
                                      Account No
                                    </TableCell>
                                    <TableCell
                                      sx={{ maxHeight: "30px", padding: "4px" }}
                                    >
                                      IFSC
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      sx={{ maxHeight: "30px", padding: "4px" }}
                                    >
                                      Verified
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      sx={{ maxHeight: "30px", padding: "4px" }}
                                    >
                                      Actions
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      sx={{ maxHeight: "30px", padding: "4px" }}
                                    >
                                      Delete
                                    </TableCell>
                                  </TableRow>
                                </TableHead>

                                <TableBody>
                                  {filteredBenelist?.map((ben, index) => {
                                    return (
                                      <>
                                        <BeneCardVender
                                          type={type}
                                          ben={ben}
                                          index={index}
                                          mobile={mobile}
                                          remitterStatus={remitterStatus}
                                          getRemitterStatus={getRemitterStatus}
                                          view="MT_View"
                                        />
                                      </>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </TableContainer>
                            // Vendor mapping......
                            // filteredBenelist.map((ben, index) => {
                            //   return (
                            //     <>
                            //       <BeneCardVender
                            //         type={type}
                            //         ben={ben}
                            //         index={index}
                            //         mobile={mobile}
                            //         remitterStatus={remitterStatus}
                            //         getRemitterStatus={getRemitterStatus}
                            //         view="MT_View"
                            //       />
                            //     </>
                            //   );
                            // })
                          )}
                        </div>
                      </Grid>
                    )}
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
              </Grid>
            )}
            {addNewRem && addNewRem && (
              <DmrAddRemitterModal
                rem_mobile={mobile}
                dmtValue={type}
                registeredData={remitterStatus}
                getRemitterStatus={getRemitterStatus}
                // apiEnd={ApiEndpoints.ADD_REM}
                apiEnd={
                  type === "express"
                    ? ApiEndpoints.ADD_REM_EXPRESS
                    : ApiEndpoints.ADD_REM_SUPER
                }
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
                dmtValue={type}
                apiEnd={ApiEndpoints.VALIDATE_SUP_OTP}
                otpRefId={otpRefId && otpRefId}
                setOtpRefId={setOtpRefId}
                setVerifyotp={setVerifyotp}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default VendorPayments;
