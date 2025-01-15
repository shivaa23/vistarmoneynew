import {
  Box,
  Button,
  Card,
  FormControl,
  FormControlLabel,
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
import React, { useContext, useState } from "react";
import { get, postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { apiErrorToast } from "../utils/ToastUtil";
import DmrAddRemitterModal from "../modals/DmrAddRemitterModal";
import AddBeneficiaryUpiModal from "../modals/AddBeneficiaryUpiModal";
import Loader from "../component/loading-screen/Loader";
import {
  back,
  Banner,
  Call1,
  LimitAcc,
  LimitTran,
  Name,
  noDataFoundGif,
} from "../iconsImports";
import { PATTERNS } from "../utils/ValidationUtil";
import { getTableHeadRowColor } from "../theme/setThemeColor";
import AuthContext from "../store/AuthContext";
import OutletRegistration from "../component/OutletRegistration";
import { banking } from "../_nav";
import HNavButton from "../component/HNavButton";
import { useNavigate } from "react-router-dom";
import BeneCardUpi from "../component/BeneCardUpi";
import NoDataView from "../component/NoDataView";
import BeneSearchBar from "../component/BeneSearchBar";
import UpiAddRemitterModal from "../modals/UpiAddRemitterModal";

const UPITransferView = ({ resetView }) => {
  const [infoFetchedMob, setInfoFetchedMob] = useState(false);
  const [request, setRequest] = useState(false);
  const [remitterStatus, setRemitterStatus] = useState();
  const [mobile, setMobile] = useState("");
  const [bene, setBene] = useState([]);
  const [addNewRem, setAddNewRem] = useState(false);
  const [verifyRem, setVerifyRem] = useState(false);
  const [isMobv, setIsMobv] = useState(true);
  const [search, setSearch] = useState("");
  const handleBack = () => {
    resetView(false);
  };
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const navigate = useNavigate();
  const returnMoneyNew = () => {
    setInfoFetchedMob(false);
  };
  const getRemitterStatus = (number) => {
    setMobile(number);
    postJsonData(
      ApiEndpoints.GET_REMITTER_STATUS_UPI,
      { rem_number: number },
      setRequest,
      (res) => {
        if (res && res.data) {
          if (res.data.message === "Verify Remitter") {
            setAddNewRem(true);
            setVerifyRem(true);
          } else {
            const data = res.data;
            setMobile(number);
            setRemitterStatus(data.remitter);
            setBene(data.data);
            setInfoFetchedMob(true);
          }
        } else {
          setRemitterStatus();
        }
      },
      (error) => {
        const errorData = error.response;
        const err_status = errorData.status;
        const err_message = errorData.data.message;

        if (err_status === 404 && err_message === "Remitter Not Found") {
          setVerifyRem(true);
          setAddNewRem(true);
        } else {
          apiErrorToast(error);
        }
      }
    );
  };

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
                      .map((mitem, index) => (
                        <Grid
                          item
                          md={2}
                          index={index}
                          onClick={() => navigate(mitem.to)}
                          className="horizontal-sidenav"
                        >
                          <HNavButton item={mitem} />
                        </Grid>
                      ))
                  : banking.map((item, index) => (
                      <Grid
                        item
                        md={2}
                        index={index}
                        onClick={() => navigate(item.to)}
                        className="horizontal-sidenav"
                      >
                        <HNavButton item={item} />
                      </Grid>
                    ))}
              </Grid>
            </Box>
          )}

          <Box
            sx={{
              height: "max-content",
              px: 1,
            }}
            className="position-relative card-css"
          >
            <Loader loading={request} circleBlue />
            <Grid container sx={{ display: "flex", justifyContent: "center" }}>
              <Card
                className="card-css"
                sx={{
                  width: "100%",
                  px: 1,
                  mt: 1,
                }}
              >
                <Grid
                  item
                  md={12}
                  sm={12}
                  xs={12}
                  sx={{
                    mb: { md: 2, sm: 4, xs: 4, lg: 4 },
                    mr: { md: 0, sm: 1.3, xs: 1.3 },
                    marginLeft: 0,
                  }}
                >
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 2,
                      mr: 2,
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
                        alt="UPI logo"
                        style={{ width: "18px", height: "20px" }}
                      />
                    </Button>
                  </Grid>
                  {!mobile ? (
                    <Typography
                      sx={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        textAlign: "left",
                        mt: 1,
                      }}
                    >
                      UPI Transfer
                    </Typography>
                  ) : null}
                  <Box
                    component="form"
                    sx={{
                      "& .MuiTextField-root": { mt: 2 },
                      objectFit: "contain",
                      overflowY: "scroll",
                    }}
                  >
                    <Grid item md={12} xs={12} lg={12}>
                      {!infoFetchedMob &&
                        !infoFetchedMob &&
                        !addNewRem &&
                        !addNewRem && (
                          <FormControl sx={{ width: "100%" }}>
                            <TextField
                              autoComplete="off"
                              sx={{ width: "100%" }}
                              label="Mobile Number"
                              id="mobile"
                              name="mobile"
                              type="tel"
                              size="small"
                              value={mobile}
                              onChange={(e) => {
                                setInfoFetchedMob(false);
                                setBene("");
                                setRemitterStatus("");
                                setIsMobv(PATTERNS.MOBILE.test(e.target.value));
                                if (e.target.value === "") setIsMobv(true);
                                setMobile(e.target.value);
                                if (PATTERNS.MOBILE.test(e.target.value)) {
                                  getRemitterStatus(e.target.value);
                                }
                              }}
                              error={!isMobv}
                              helperText={
                                !isMobv ? "Enter valid Mobile Number" : ""
                              }
                              onKeyDown={(e) => {
                                if (
                                  (e.which >= 65 && e.which <= 90) ||
                                  e.key === "+"
                                ) {
                                  e.preventDefault();
                                }
                                if (e.target.value.length === 10) {
                                  if (e.key.toLowerCase() !== "backspace") {
                                    e.preventDefault();
                                  }
                                }
                              }}
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
                      <Grid>
                        <TableContainer
                          component={Paper}
                          sx={{ mt: 0, pt: 0, mb: 1.5 }}
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
                                      {remitterStatus && remitterStatus.name}
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
                                  <AddBeneficiaryUpiModal
                                    rem_mobile={mobile}
                                    apiEnd={ApiEndpoints.ADD_BENE_UPI}
                                    getRemitterStatus={getRemitterStatus}
                                  />
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    )}
                    {/* <Grid
                        item
                        md={4}
                        xs={12}
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      ></Grid> */}
                  </Box>
                </Grid>
              </Card>
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
                        flex: 1,
                        mt: 1, // Ensure it takes available space
                        maxWidth: {
                          lg: "100%",
                          md: "200px",
                          sm: "150px",
                          xs: "100%",
                        }, // Adjust max-width based on screen size
                      }}
                    >
                      <BeneSearchBar setSearch={setSearch} remMargin={true} />
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
                      <Typography sx={{ fontSize: "18px" }}>
                        Upi List ({bene.length})
                      </Typography>
                    </Box>
                  </Box>

                  <Grid
                    container
                    sx={{
                      pr: { xs: 1.3, md: 2 },
                      pt: 2,
                      mb: { md: 2, sm: 4, xs: 4 },
                      marginLeft: 1,
                    }}
                  >
                    {bene.length <= 0 ? (
                      <Grid
                        item
                        xs={12}
                        className="d-flex align-items-start justify-content-center"
                      >
                        <Typography sx={{ mt: 2 }}>
                          No beneficiary found.
                          <Typography sx={{ fontWeight: "bold" }}>
                            Enter Remitter's Mobile Number to view Beneficiary
                            List
                          </Typography>
                          <NoDataView />
                        </Typography>
                      </Grid>
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
                              // Set maximum height
                              borderBottom: "0.5px solid #DBDDDF",
                              paddingBottom: "4px",
                              paddingTop: "4px",
                            }}
                          >
                            <TableRow
                              sx={{
                                // Apply max height to the row
                                paddingBottom: "4px",
                                paddingTop: "4px",
                              }}
                            >
                              <TableCell align="center" sx={{ padding: "4px" }}>
                                Avatar
                              </TableCell>
                              <TableCell sx={{ padding: "4px" }}>
                                Name
                              </TableCell>

                              <TableCell sx={{ padding: "4px" }}>
                                Vpa Data
                              </TableCell>

                              <TableCell align="center" sx={{ padding: "4px" }}>
                                Verified
                              </TableCell>
                              <TableCell align="center" sx={{ padding: "4px" }}>
                                Actions
                              </TableCell>
                              <TableCell align="center" sx={{ padding: "4px" }}>
                                Delete
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {bene.map((ben, index) => (
                              <BeneCardUpi ben={ben} mobile={mobile} />
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Grid>
                </Grid>
              )}
              {addNewRem && (
                <UpiAddRemitterModal
                  rem_mobile={mobile}
                  getRemitterStatus={getRemitterStatus}
                  apiEnd={ApiEndpoints.ADD_REM_UPI}
                  view="upiTransfer"
                  setAddNewRem={setAddNewRem}
                  verifyRem={verifyRem}
                  setVerifyRem={setVerifyRem}
                />
              )}
            </Grid>
          </Box>
        </>
      )}
    </>
  );
};

export default UPITransferView;
