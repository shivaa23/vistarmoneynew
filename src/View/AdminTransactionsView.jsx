import React, { useState } from "react";
import {
  Tooltip,
  Snackbar,
  Grid,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography,
  Container,
  Button,
  Box,
  IconButton,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
} from "@mui/material";
import ApiEndpoints from "../network/ApiEndPoints";
import { ddmmyy, dateToTime } from "../utils/DateUtils";
import { CustomStyles } from "../component/CustomStyle";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import AppleIcon from "@mui/icons-material/Apple";
import { get } from "../network/ApiController";
import { apiErrorToast } from "../utils/ToastUtil";
import CheckResponseModal from "../modals/CheckResponseModal";
import CheckStatusModal from "../modals/CheckStatusModal";
import ChangeStatusModal from "../modals/ChangeStatusModal";
import GetAdModalTxn from "../modals/GetAdModalTxn";
import { useEffect } from "react";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";
import { currencySetter } from "../utils/Currencyutil";
import ApiPaginateSearch from "../component/ApiPaginateSearch";
import ExcelUploadModal from "../modals/ExcelUploadModal";
import moment from "moment";
import { json2Csv, json2Excel } from "../utils/exportToExcel";
import { capitalize1 } from "../utils/TextUtil";
import FilterCard from "../modals/FilterCard";
import CachedIcon from "@mui/icons-material/Cached";
import CommonStatus from "../component/CommonStatus";

import {
  AD_REPORTS,
  REPORTS,
  nonAdminColOptions,
  searchOptions,
} from "../utils/constants";
import { useMemo } from "react";
import RefreshComponent from "../component/RefreshComponent";
import { Link, useNavigate } from "react-router-dom";
import { primaryColor } from "../theme/setThemeColor";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import useCommonContext from "../store/CommonContext";
import RightSidePannel from "../component/transactions/RightSidePannel";
import UpdateIcon from "@mui/icons-material/Update";
import Menu from "@mui/material/Menu";

import { resetData } from "../features/allUsers/allUsersSlice";
import { keyframes } from "@emotion/react";
import { styled } from "@mui/material/styles";
import RetDbTransactionTab from "../component/Tab/RetDbTransactionTab";
import android from "../assets/android.png";
import explorer from "../assets/explorer.png";
import api from "../assets/Api.png";
import StatusDisplay from "../StatusDisplay";
// import { Icon } from "@iconify/react";

// eslint-disable-next-line no-unused-vars
let refreshFilter;
let refresh;
let handleCloseModal;
const blinkAnimation = keyframes`
  0% { 
    opacity: 1; 
    color: red; 
  }
  50% { 
    opacity: 0.5; 
    color: black; 
  }
  100% { 
    opacity: 1; 
    color: red; 
  }
`;
const BlinkingIcon = styled(UpdateIcon, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ active }) => ({
  fontSize: 25,
  cursor: "pointer",
  animation: active ? `${blinkAnimation} 1s infinite` : "none",
}));
const AdminTransactionsView = () => {
  const [apiData, setApiData] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [query, setQuery] = useState();
  const [sumData, setSumData] = useState(false);
  const [asmList, setAsmList] = useState([]);
  const authCtx = useContext(AuthContext);
  const [state, setState] = useState(false);
  const [rowData, setRowData] = useState(false);
  const user = authCtx.user;
  const role = user?.role.toLowerCase();
  const [scheduler, setScheduler] = useState(false);
  const [schedulerTime, setSchedulerTime] = useState(0);
  const [showOldTransaction, setShowOldTransaction] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [request, setRequest] = useState();
  const [noOfResponses, setNoOfResponses] = useState(0);
  const [typeList, setTypeList] = useState([]);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [refreshTab, setRefreshTab] = useState(0);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [intervalSec, setIntervalSec] = useState(0); // Selected interval in seconds
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentTab, setCurrentTab] = useState("");
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (intervalInSeconds) => {
    setIntervalSec(intervalInSeconds); // Set the interval display
    setElapsedTime(intervalInSeconds); // Initialize countdown
    setIsActive(true);
    handleClose(); // Close the dropdown menu

    if (intervalId) {
      clearInterval(intervalId); // Clear the existing interval
    }

    const id = setInterval(() => {
      setElapsedTime((prevTime) => {
        if (prevTime <= 1) {
          refreshFunc(""); // Refresh the page
          return intervalInSeconds; // Reset countdown to selected interval
        }
        return prevTime - 1;
      });
    }, 1000); // Update every second for countdown

    setIntervalId(id); // Store the new interval ID
    setRefreshInterval(intervalInSeconds * 1000); // Update the refresh interval
  };

  const handleStop = () => {
    setIsActive(false);
    setElapsedTime(0);
    handleClose(); // Close the dropdown menu
    if (intervalId) {
      clearInterval(intervalId); // Clear the existing interval
      setIntervalId(null); // Reset the intervalId
    }
    setRefreshInterval(null); // Reset the refresh interval
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const isFilterAllowed = useMemo(
    () =>
      user?.role.toLowerCase() === "admin" ||
      user?.role.toLowerCase() === "dd" ||
      user?.role.toLowerCase() === "ad" ||
      user?.role.toLowerCase() === "asm" ||
      user?.role.toLowerCase() === "ret" ||
      user?.role.toLowerCase() === "api",
    [user]
  );

  const getExcel = () => {
    get(
      showOldTransaction && showOldTransaction
        ? ApiEndpoints.OLD_TRANSACTIONS
        : ApiEndpoints.GET_TRANSACTIONS,
      `${
        query
          ? query + `&page=1&paginate=10&export=1`
          : `page=1&paginate=10&export=1`
      }`,
      setRequest,
      (res) => {
        const apiData = res.data.data;
        const newApiData = apiData.map((item) => {
          const created_at = moment(item.created_at).format("DD-MM-YYYY");
          const time_updated_at = moment(item.updated_at).format("LTS");
          return { ...item, created_at, time_updated_at };
        });
        json2Excel(
          `Transactions ${moment(new Date().toJSON()).format(
            "Do MMM YYYY"
          )} | ${moment(new Date().toJSON()).format("hh:mm a")}`,
          JSON.parse(JSON.stringify(newApiData && newApiData))
        );
        handleCloseModal();
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const getCsv = () => {
    get(
      showOldTransaction && showOldTransaction
        ? ApiEndpoints.OLD_TRANSACTIONS
        : ApiEndpoints.GET_TRANSACTIONS,
      `${
        query
          ? query + `&page=1&paginate=10&export=1`
          : `page=1&paginate=10&export=1`
      }`,
      setRequest,
      (res) => {
        const apiData = res.data.data;
        const newApiData = apiData.map((item) => {
          const created_at = moment(item.created_at).format("DD-MM-YYYY");
          const time_updated_at = moment(item.updated_at).format("LTS");
          return { ...item, created_at, time_updated_at };
        });
        json2Csv(
          `Transactions ${moment(new Date().toJSON()).format(
            "Do MMM YYYY"
          )} | ${moment(new Date().toJSON()).format("hh:mm a")}`,
          JSON.parse(JSON.stringify(newApiData && newApiData))
        );
        handleCloseModal();
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const getAsmValue = () => {
    get(
      ApiEndpoints.GET_USERS,
      `page=1&paginate=10&role=Asm&export=`,
      "",
      (res) => {
        const asmArray = res.data.data;
        setAsmList(
          asmArray &&
            asmArray.map((item) => {
              return {
                id: item.id,
                name: item.name,
                username: item.username,
              };
            })
        );
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  // get types
  const getTypes = () => {
    if (typeList.length === 0) {
      get(
        ApiEndpoints.GET_CATEGORIES,
        "",
        setRequest,
        (res) => {
          const data = res.data.data;
          if (data) {
            data.push({ id: 13, name: "ALL" });
          }
          setTypeList(data);
        },
        (err) => {
          apiErrorToast(err);
        }
      );
    }
  };

  useEffect(() => {
    refreshUser();
    getTypes();
    if (role === "admin") {
      getAsmValue();
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isShowFilterCard, setIsShowFilterCard] = useState(false);
  const {
    setChooseInitialCategoryFilter,
    chooseInitialCategoryFilter,
    refreshUser,
  } = useCommonContext();

  function refreshFunc(setQueryParams) {
    if (refresh) refresh();
  }

  const [operatorList, setOperatorList] = useState([]);
  const getOperatorVal = () => {
    get(
      ApiEndpoints.GET_OPERATOR,
      "",
      "",
      (res) => {
        const opArray = res.data.data;

        setOperatorList(opArray);
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  const [open, setOpen] = React.useState(false);
  const handleClickSnack = () => {
    setOpen(true);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const copyToClipBoard = (copyMe) => {
    try {
      navigator.clipboard.writeText(copyMe);
    } catch (err) {}
  };

  // table data & conditional styles.....
  const conditionalRowStyles = [
    {
      when: (row) => row.operator.toLowerCase() === "admin transfer",
      style: {
        backgroundColor: "#dc5f5f38",
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
  ];

  const isStatusPending = (row) =>
    row.status.toLowerCase() === "refund" ||
    row.status.toLowerCase() === "failed";

  const columns = [
    {
      name: "Id",
      selector: (row) => (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              textAlign: "left",
            }}
          >
            {row.id}
          </div>
        </>
      ),
      width: "40px",
    },

    {
      name: (
        <Tooltip title=" Created at /Updated at">
          <Typography
            variant=""
            sx={{
              fontSize: "13px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Created at/Updated at
          </Typography>
        </Tooltip>
      ),
      selector: (row) => (
        <>
          <div className="mb-2">
            {ddmmyy(row.created_at)} {dateToTime(row.created_at)}
          </div>
          <div>
            {ddmmyy(row.updated_at)} {dateToTime(row.updated_at)}
          </div>
        </>
      ),
      wrap: true,
      width: "135px",
    },
    {
      name: "Route",
      cell: (row) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div>
            {row.platform === "APP" ? (
              <Tooltip title="APP">
                <InstallMobileIcon fontSize="small" />
              </Tooltip>
            ) : row.platform === "WEB" ? (
              <Tooltip title="WEB">
                <img
                  src={explorer}
                  alt=""
                  style={{ width: "20px", height: "20px" }}
                />
                {/* <LaptopIcon fontSize="small" sx={{ color: "green" }} /> */}
              </Tooltip>
            ) : row.platform === "ANDROID" ? (
              <Tooltip title="ANDROID">
                <img
                  src={android}
                  alt=""
                  style={{ width: "20px", height: "20px" }}
                />
                {/* <AndroidIcon fontSize="small" sx={{ color: "blue" }} /> */}
              </Tooltip>
            ) : row.platform === "IOS" ? (
              <Tooltip title="IOS">
                <AppleIcon fontSize="small" />
              </Tooltip>
            ) : (
              <Tooltip title="API">
                <img
                  src={api}
                  alt=""
                  style={{ width: "25px", height: "25px" }}
                />
                {/* <SyncAltIcon fontSize="small" sx={{ color: "red" }} /> */}
              </Tooltip>
            )}
          </div>

          <div style={{ fontSize: "10px", fontWeight: "600", margin: "5px" }}>
            {row.route}
          </div>

          <div style={{ fontSize: "8px" }}>{row.mop}</div>
        </div>
      ),
    },

    // est missing from ad login
    {
      name: "Establishment",
      selector: (row) => (
        <div
          style={{
            textAlign: "left",
          }}
        >
          <Tooltip title={capitalize1(row.establishment)}>
            <div style={{ textAlign: "left" }}>
              <div
                className="break-words"
                style={{
                  fontSize: "12px",
                }}
              >
                {capitalize1(row.establishment)}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <GetAdModalTxn sx={{ display: "block" }} row={row} />
              </div>
            </div>
          </Tooltip>
        </div>
      ),
      wrap: true,
      width: "135px",
    },
    {
      name: <span className="">Operator</span>,
      selector: (row) => (
        <div>
          <Tooltip
            placement="right"
            title={
              row.operator === "Vendor Payments" ? "settlements" : row.operator
            }
          >
            <div className="break-words mr-2 " style={{ fontSize: "12px" }}>
              {row.operator === "Vendor Payments"
                ? "settlements"
                : row.operator}
            </div>
          </Tooltip>

          <Typography
            sx={{
              fontSize: "10px",
              color: "#535353",
              fontWeight: "500",
              textAlign: "left",
              "&:hover": {
                cursor: "pointer",
              },
            }}
            onClick={() => {
              copyToClipBoard(row.client_id);
              handleClickSnack();
            }}
          >
            {row.client_id}
            <Snackbar
              open={open}
              autoHideDuration={3000}
              onClose={handleCloseSnack}
              message="number copied"
              sx={{ zIndex: 10000 }}
            />
          </Typography>
        </div>
      ),
      wrap: true,
    },
    {
      name: <span className="">Order ID</span>,
      selector: (row) => (
        <div className="d-flex flex-column align-items-start">
          <Typography
            sx={{
              fontSize: "12px",
              // color: "#566573",
              "&:hover": {
                cursor: "pointer",
              },
            }}
            onClick={() => {
              copyToClipBoard(row.order_id);
              handleClickSnack();
            }}
          >
            {row.order_id}
            <Snackbar
              open={open}
              autoHideDuration={3000}
              onClose={handleCloseSnack}
              message="number copied"
              sx={{ zIndex: 10000 }}
            />
          </Typography>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <CheckStatusModal row={row} />
            <CheckResponseModal row={row} sx={{ fontSize: "8px" }} />
          </div>
        </div>
      ),
      width: "130px",
    },
    {
      name: " Number",
      selector: (row) => (
        <div className="d-flex flex-column align-items-start">
          <Typography
            sx={{
              fontSize: "inherit",

              "&:hover": {
                cursor: "pointer",
              },
            }}
            onClick={() => {
              copyToClipBoard(row.number);
              handleClickSnack();
            }}
          >
            {row.number}
          </Typography>
        </div>
      ),
      wrap: true,
      center: false,
    },
    {
      name: <span className="ms-3">Info</span>,
      selector: (row) => (
        <Typography
          className="d-flex flex-column align-items-start "
          sx={{
            fontSize: "9px",
            textAlign: "left",
            "&:hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => {
            copyToClipBoard(row.ben_acc);
            handleClickSnack();
          }}
        >
          <div>{row.ben_name}</div>
          <div>{row.ben_acc}</div>
          <div>{row.ifsc}</div>
        </Typography>
      ),
      wrap: true,
    },

    {
      name: <span className="pe-2">Amount</span>,
      cell: (row) => (
        <div className="d-flex flex-column align-items-end pe-3">
          <div>{currencySetter(row.amount)}</div>
          <div
            style={{
              color: row.txn_type === "CR" ? "green" : "red",
              textAlign: "right",
            }}
          >
            {row.txn_type === "CR" ? "+ " : "- "}
            {currencySetter(row.net_amount)}
          </div>
          <div style={{ color: "#5B4C7D" }}>
            {currencySetter(row.ad_comm)} / {currencySetter(row.md_comm)}
          </div>
        </div>
      ),
      right: true,
    },

    {
      name: "Opening Bal.",
      selector: (row) => (
        <div className="d-flex align-items-start flex-column ">
          <div></div>
        </div>
      ),
    },
    {
      name: "Closing",
      selector: (row) => (
        <div className="d-flex align-items-start flex-column ">
          <div>{currencySetter(row.w1)}</div>
          <div style={{ color: "#F29132" }} hidden={role === "api"}>
            {currencySetter(row.w2)}
          </div>

          <div style={{ color: "#4045A1" }}>
            {currencySetter(row.ad_closing)}
          </div>
        </div>
      ),
    },
    {
      name: "AComm.",
      selector: (row) => (
        <div
          className="d-flex align-items-start flex-column"
          style={{ fontSize: "12px" }}
        >
          {currencySetter(row.a_comm)}
        </div>
      ),
      center: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <>
          <CommonStatus
            status={row.status}
            approvedStatusText="Success"
            pendingStatusText="Pending"
            rejectedStatusText="Failed"
            refundStatusText="Refund"
            fontSize="11px"
            minWidth="90px"
            maxWidth="90px"
          />

          <div
            className="break-words"
            style={{
              fontSize: "9px",

              marginTop: "5px",
              color: "#535353",
              fontWeight: "500",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {row.op_id}
          </div>
        </>
      ),
      wrap: true,
    },
    {
      name: "Actions",
      selector: (row) => <ChangeStatusModal row={row} refresh={refresh} />,
      width: "160px",
      omit:
        user && user?.role === "Admin" && user && user?.txn_actions === 1
          ? false
          : true,

      center: true,
    },
  ];

  const statusList = [
    { name: "SUCCESS", code: "SUCCESS" },
    { name: "PENDING", code: "PENDING" },
    { name: "REFUND", code: "REFUND" },
    { name: "FAILED", code: "FAILED" },
  ];
  useEffect(() => {
    if (selectedRows) {
      localStorage.setItem(
        "selectedRow",
        JSON.stringify(selectedRows.selectedRows)
      );
    }
    return () => {};
  }, [selectedRows]);

  if (!chooseInitialCategoryFilter && role !== "admin" && role !== "api") {
    return (
      <>
        <Grid container>
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{
              display: { md: "none", sm: "none", xs: "flex" },
              justifyContent: "end",
              alignItems: "center",
              flexDirection: { md: "row" },
              pr: 1,
            }}
          >
            <Grid container>
              <Grid
                item
                md={12}
                xs={12}
                sx={{
                  textAlign: "left",
                  pl: 3,
                  fontSize: "25px",
                  fontWeight: "600",
                  mb: 3,
                }}
              >
                Reports
              </Grid>
              {typeList.length > 1 &&
                typeList
                  .filter((i) => i.name !== "SECONDARY")
                  .map((item) => {
                    return (
                      <Grid
                        item
                        md={2}
                        onClick={() => {
                          setChooseInitialCategoryFilter(item.name);
                        }}
                        className="all-categories-box hover-less-zoom"
                      >
                        <Box sx={{ width: "30%", p: 1 }}>
                          <Box className="transaction-icon-box">
                            <img
                              src={`https://api.impsguru.com/public/logos/${
                                item.name.split(" ")[0]
                              }.svg`}
                              alt="categories"
                              width="65%"
                            />
                          </Box>
                        </Box>
                        <Box sx={{ width: "70%" }}>{item.name}</Box>
                      </Grid>
                    );
                  })}
            </Grid>

            <Grid
              container
              sx={{ mt: 5 }}
              hidden={role !== "ret" && role !== "dd" && role !== "ad"}
            >
              {(role === "ad"
                ? AD_REPORTS
                : REPORTS.filter((i) => {
                    if (user?.acst === 0) {
                      return i.name !== "ACCOUNT LEDGER";
                    } else {
                      return i;
                    }
                  })
              ).map((item) => {
                return (
                  <Grid
                    item
                    md={2}
                    onClick={() => navigate(item.url)}
                    className="all-categories-box hover-less-zoom"
                    // sx={{
                    //   backgroundImage: `url("https://api.impsguru.com/public/logos/${
                    //     item.name.split(" ")[0]
                    //   }.svg")`,
                    // }}
                  >
                    <Box sx={{ width: "30%", p: 1 }}>
                      <Box className="transaction-icon-box">
                        <img
                          src={`https://api.impsguru.com/public/logos/${
                            item.name.split(" ")[0]
                          }.svg`}
                          alt="categories"
                          width="65%"
                        />
                      </Box>
                    </Box>
                    <Box sx={{ width: "70%" }}>{item.name}</Box>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  } else {
    return (
      <>
        <Grid xs={12} sx={{ pl: { xs: 0, md: 2 } }}>
          <RetDbTransactionTab
            setQuery={setQuery}
            setCurrentTab={setCurrentTab}
            setRefreshTab={setRefreshTab}
            
            refreshTab={refreshTab}
          />

          <ApiPaginateSearch
            showSearch={false}
            actionButtons={
              <Grid
                item
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: { md: "end", xs: "start" },
                  alignItems: "center",
                  flexDirection: { md: "row", xs: "column" },
                  pr: 1,
                }}
              >
                <></>
                {/* <FormGroup>
                  <FormControlLabel
                    sx={{
                      mt: { md: 0, sm: 2, xs: 2 },
                      mb: { md: 0, sm: 2, xs: 2 },
                    }}
                    control={
                      <Switch
                        value={showOldTransaction}
                        defaultChecked={showOldTransaction}
                        onChange={() =>
                          setShowOldTransaction(!showOldTransaction)
                        }
                      />
                    }
                    label={
                      <Typography variant="body2" style={{ fontSize: "15px" }}>
                        Old Transactions
                      </Typography>
                    }
                  />
                </FormGroup> */}
                {/* 
                <div className="mx-2">
                  <ExcelUploadModal
                    twobuttons="Download Csv"
                    btn
                    request={request}
                    getExcel={getExcel}
                    getCsv={getCsv}
                    noOfResponses={noOfResponses}
                    setQuery={setQuery}
                    handleCloseCB={(closeModal) => {
                      handleCloseModal = closeModal;
                    }}
                  />
                </div> */}
                {/* <RefreshComponent
                  onClick={() => {
                    refreshFunc(setQuery);
                  }}
                /> */}
              </Grid>
            }
            totalCard={
              <>
              
              <StatusDisplay sumData={sumData} setSumData={setSumData} />
              </>
            }
            backButton={
              role !== "admin" && role !== "api" ? (
                <Button
                  size="small"
                  className="otp-hover-purple mb-2"
                  sx={{
                    color: primaryColor(),
                  }}
                  onClick={() => {
                    setChooseInitialCategoryFilter(false);
                  }}
                >
                  <KeyboardBackspaceIcon fontSize="small" /> Back
                </Button>
              ) : (
                false
              )
            }
            apiEnd={
              showOldTransaction && showOldTransaction
                ? ApiEndpoints.OLD_TRANSACTIONS
                : ApiEndpoints.GET_TRANSACTIONS
            }
            searchOptions={searchOptions[`${role}`]}
            setQuery={setQuery}
            columns={columns}
            apiData={apiData}
            setSumData={setSumData}
            setApiData={setApiData}
            tableStyle={CustomStyles}
            queryParam={query ? query : ""}
            returnRefetch={(ref) => {
              refresh = ref;
            }}
            conditionalRowStyles={conditionalRowStyles}
            selectableRows={
              user &&
              user.role !== "Admin" &&
              user.role !== "Asm" &&
              user.role !== "Ad" &&
              user.role !== "Api"
              // selectedRows?.selectedRows.length === 1 &&
              // selectedRows?.selectedRows[0].operator === "Super Transfer"
            }
            selectableRowDisabled={isStatusPending}
            onSelectedRowsChange={(data) => {
              setSelectedRows(data);
            }}
            responses={(val) => {
              setNoOfResponses(val);
            }}
            isFilterAllowed={isFilterAllowed}
            filterComponent={
              <FilterCard
                isTransaction={true}
                topMargin={0}
                bottomMargin={0}
                showSearch={false}
                ifrouteFilter
                ifoperatorFilter
                ifdateFilter
                setRefreshTab={setRefreshTab}
                refreshTab={refreshTab}
                ifstatusFilter
                ifstatusFilter2
                iforderidFilter
                ifTypeFilter
                ifUsernameFilter
                ifestFilter
                ifnumberFilter
                ifotherFilter
                chooseInitialCategoryFilter={
                  chooseInitialCategoryFilter !== "ALL"
                    ? chooseInitialCategoryFilter
                    : false
                }
                ifAdIdFilter
                ifAsmFilter
                asmList={asmList}
                typeList={typeList.filter((item) => item.name !== "ALL")}
                nonAdminColOptions={nonAdminColOptions}
                statusList={statusList}
                operatorList={operatorList}
                getOperatorVal={getOperatorVal}
                setQuery={setQuery}
                query={query}
                clearHookCb={(cb) => {
                  refreshFilter = cb;
                }}
                getTypes={getTypes}
                refresh={refresh}
                isShowFilterCard={isShowFilterCard}
                setIsShowFilterCard={setIsShowFilterCard}
                actionButtons={
                  <>
                    {/* Excel Upload Button */}
                    <div>
                      <ExcelUploadModal
                        twobuttons="Download Csv"
                        btn
                        request={request}
                        getExcel={getExcel}
                        getCsv={getCsv}
                        noOfResponses={noOfResponses}
                        setQuery={setQuery}
                        handleCloseCB={(closeModal) => {
                          handleCloseModal = closeModal;
                        }}
                      />
                    </div>

                    {/* Refresh Button */}
                    <Tooltip title="refresh">
                      <IconButton
                        aria-label="refresh"
                        sx={{
                          color: "#0F52BA",
                        }}
                        onClick={() => {
                          refreshFunc(setQuery);
                        }}
                      >
                        <CachedIcon className="refresh-purple" />
                      </IconButton>
                    </Tooltip>

                    <Box sx={{ display: "flex", ml: 2 }}>
                      <FormGroup>
                        <FormControlLabel
                          sx={{
                            mt: { md: 0, sm: 2, xs: 2 },
                            mb: { md: 0, sm: 2, xs: 2 },
                          }}
                          control={
                            <FormControl size="small">
                              <Select
                                variant="standard"
                                fontSize="10px"
                                value={showOldTransaction}
                                onChange={() =>
                                  setShowOldTransaction(!showOldTransaction)
                                }
                              >
                                <MenuItem value={true}>Old</MenuItem>
                                <MenuItem value={false}>New</MenuItem>
                              </Select>
                            </FormControl>
                          }
                        />
                      </FormGroup>
                      <div>
                        <Tooltip title="Scheduler">
                          <BlinkingIcon
                            active={isActive}
                            onClick={handleClick}
                          />
                        </Tooltip>
                        {isActive && <span>{elapsedTime}</span>}
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleClose}
                        >
                          <MenuItem onClick={() => handleMenuItemClick(5)}>
                            5 sec
                          </MenuItem>
                          <MenuItem onClick={() => handleMenuItemClick(10)}>
                            10 sec
                          </MenuItem>
                          <MenuItem onClick={() => handleMenuItemClick(15)}>
                            15 sec
                          </MenuItem>
                          <MenuItem onClick={handleStop}>Stop</MenuItem>
                        </Menu>
                      </div>
                    </Box>
                  </>
                }
              />
            }
          />
        </Grid>
        {/* <RightSidePannel
          state={state}
          setState={setState}
          row={rowData}
          setRow={setRowData}
          // buttons={<ChangeStatusModal row={rowData} refresh={refresh} />}
        /> */}
      </>
    );
  }
};

export default AdminTransactionsView;
