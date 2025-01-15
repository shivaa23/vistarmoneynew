import React, { useState } from "react";
import {
  Tooltip,
  Snackbar,
  // IconButton,
  Grid,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography,
  Button,
  Box,
  Drawer,
  IconButton,
  MenuItem,
  FormControl,
  Select,
  Stack,
} from "@mui/material";
// import InstallMobileIcon from "@mui/icons-material/InstallMobile";
// import LaptopIcon from "@mui/icons-material/Laptop";
// import AppleIcon from "@mui/icons-material/Apple";
// import AndroidIcon from "@mui/icons-material/Android";
// import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { useEffect } from "react";
import { useContext } from "react";

// import PrintIcon from "@mui/icons-material/Print";
import CachedIcon from "@mui/icons-material/Cached";
import moment from "moment";

import { useMemo } from "react";

import { useNavigate } from "react-router-dom";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import AuthContext from "../../store/AuthContext";
import ApiEndpoints from "../../network/ApiEndPoints";
import { get } from "../../network/ApiController";
import { json2Csv, json2Excel } from "../../utils/exportToExcel";
import { apiErrorToast } from "../../utils/ToastUtil";
import useCommonContext from "../../store/CommonContext";
import { ddmmyy, dateToTime, datemonthYear } from "../../utils/DateUtils";
// import CheckStatusModal from "../../modals/CheckStatusModal";
// import CheckResponseModal from "../../modals/CheckResponseModal";
// import { capitalize1 } from "../../utils/TextUtil";
// import GetAdModalTxn from "../../modals/GetAdModalTxn";
import { currencySetter } from "../../utils/Currencyutil";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RaiseIssueModal from "../../modals/RaiseIssueModal";
import PrintIcon from "@mui/icons-material/Print";
import {
  AD_REPORTS,
  REPORTS,
  Transaction_Tab,
  mt_tab_value,
  nonAdminColOptions,
  searchOptions,
} from "../../utils/constants";
import ApiPaginateSearch from "../../component/ApiPaginateSearch";
import ExcelUploadModal from "../../modals/ExcelUploadModal";
import RefreshComponent from "../../component/RefreshComponent";
import FilterModal from "../../modals/FilterModal";
import { primaryColor } from "../../theme/setThemeColor";
import { CustomStyles } from "../../component/CustomStyle";
import FilterCard from "../../modals/FilterCard";
// import { Icon } from "@iconify/react";
import RightSidePannel from "../../component/transactions/RightSidePannel";
import CustomTabs from "../../component/CustomTabs";
import RetDbTransactionTab from "../../component/Tab/RetDbTransactionTab";
import CommonStatus from "../../component/CommonStatus";
import { Icon } from "@iconify/react";
import { getStatusColor } from "../../theme/setThemeColor";

// import { currencySetter } from "../../utils/Currencyutil";
import { capitalize1 } from "../../utils/TextUtil";

// import { useContext } from "react";
// import AuthContext from "../../store/AuthContext";
import { createFileName, useScreenshot } from "use-react-screenshot";
import { createRef } from "react";
// import { Icon } from "@iconify/react";

import { Crisp } from "crisp-sdk-web";

import CloseIcon from "@mui/icons-material/Close";
import LogoComponent from "../../component/LogoComponent";
import Timeline from "../../component/transactions/Timeline";
import Mount from "../../component/Mount";
import Loader from "../../component/loading-screen/Loader";
import CommonSnackBar from "../../component/CommonSnackBar";
import StatusDisplay from "../../StatusDisplay";
// eslint-disable-next-line no-unused-vars
let refreshFilter;
let refresh;
let handleCloseModal;
const RetDdTransactionView = () => {
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [sumData, setSumData] = useState(false);
  const [state, setState] = useState(true);
  const [openViews, setOpenViews] = useState(false);
  const [redirection, setRedirection] = useState(false);
  const [rowData, setRowData] = useState({});
  const [showOldTransaction, setShowOldTransaction] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [request, setRequest] = useState();
  // const [tabQueryreset, setTabQueryreset] = useState(true)
  const [noOfResponses, setNoOfResponses] = useState(0);
  const [typeList, setTypeList] = useState([]);
  const navigate = useNavigate();
  const [resetFilter, setResetFilter] = useState(false);
  const [value, setValue] = useState(0);
  const [currentType, setCurrentType] = useState();
  const [tabQueryreset, setTabQueryreset] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const role = user?.role.toLowerCase();
  const [refreshTab, setRefreshTab] = useState(0);
  const [currentTab, setCurrentTab] = useState("");
  const [image, takeScreenshot] = useScreenshot({
    type: "image/png",
    quality: 1.0,
  });
  console.log("currentTab", currentTab);

  const download = (
    image,
    { name = "Transaction Details", extension = "png" } = {}
  ) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const LabelComponent = ({ label }) => {
    return (
      <span style={{ textAlign: "left", fontSize: "13px", minWidth: "100px" }}>
        {label}
      </span>
    );
  };

  const DetailsComponent = ({ details }) => {
    return (
      <CommonSnackBar>
        <span
          style={{ textAlign: "right", fontSize: "13px" }}
          className="fw-bold"
        >
          {details}
        </span>
      </CommonSnackBar>
    );
  };

  const ref = createRef(null);
  const downloadScreenshot = () => {
    takeScreenshot(ref.current).then(download);
  };

  const openView = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  // const chooseCat = (value) => {
  //   setQuery("&category=" + value);
  // };
  // const [columnOptions, setColumnOptions] = useState([]);

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
      // ApiEndpoints.GET_USERS,
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
  console.log("open data is", openViews);
  // const openView=()=>{
  //   // setRowData(row);
  //   setOpenViews(true)
  // }

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

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isShowFilterCard, setIsShowFilterCard] = useState(false);
  const {
    setChooseInitialCategoryFilter,
    chooseInitialCategoryFilter,
    refreshUser,
  } = useCommonContext();

  const prefilledQuery = `category=${chooseInitialCategoryFilter}`;

  useEffect(() => {
    if (chooseInitialCategoryFilter && chooseInitialCategoryFilter !== "ALL") {
      setQuery(`category=${chooseInitialCategoryFilter}`);
    }
  }, [chooseInitialCategoryFilter]);

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
        // const op = opArray.map((item) => {
        //   return {
        //     code: item.code,
        //     name: item.name,
        //   };
        // });
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
  ////  disable rows
  const isStatusPending = (row) =>
    // row.status.toLowerCase() === "pending" ||
    row.status.toLowerCase() === "refund" ||
    row.status.toLowerCase() === "failed" ||
    row.operator === "Vendor Payments";

  const objectData = (row, utility) => {
    // if (utility) {
    const operator = row?.operator;
    const mobile_no = row?.number;
    const date_time = row?.created_at;
    const Transaction_Id = row?.order_id;
    const Type = row?.type;
    const UTR_NO = row?.op_id;
    const Amount = row?.amount;
    const Status = row?.status;
    const data = new URLSearchParams({
      operator,
      mobile_no,
      date_time,
      Transaction_Id,
      UTR_NO,
      Amount,
      Status,
    });
    console.log("THis is stringified data", data, JSON.stringify(data));
    return data;
    // }
    // localStorage.setItem("selectedRow", JSON.stringify(row));
    // return "";
  };
  const columns = [
    {
      name: "Date/Time",
      selector: (row) => (
        <div className="mb-1" style={{ textAlign: "left" }}>
          {ddmmyy(row.created_at)} {dateToTime(row.created_at)}
        </div>
      ),
      wrap: true,
    },

    {
      name: <span className="">Operator</span>,
      selector: (row) => (
        <div style={{ fontsize: "11px", textAlign: "left" }}>
          <Tooltip
            placement="bottom"
            title={
              row.operator === "Vendor Payments" ? "settlements" : row.operator
            }
          >
            <div>
              {row.operator === "Vendor Payments"
                ? "settlements"
                : row.operator}
            </div>
          </Tooltip>
        </div>
      ),
      wrap: true,
      width: "120px",
    },
    // est missing from ad login

    {
      name: <span className="">Number</span>,
      selector: (row) => (
        <div className="d-flex flex-column align-items-start">
          <Typography
            sx={{
              fontSize: "inherit",
              fontWeight: "500",
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

      grow: 1,
    },
    {
      name: <span className="ms-3">Info</span>,
      selector: (row) => (
        <Typography
          className="d-flex flex-column align-items-start ms-3"
          sx={{
            fontSize: "10px",
            textAlign: "left",
            color: "#535353",
            fontWeight: "500",
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
      width: "125px",
      omit: role === "ad",
    },
    {
      name: "Operator Id",
      selector: (row) => (
        <Tooltip title={row.op_id} placement="right">
          <div
            className="break-words"
            style={{
              fontSize: "10px",
              fontWeight: "500",
              textAlign: "left",
            }}
          >
            {row.op_id}
          </div>
        </Tooltip>
      ),

      width: "120px",
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
        </div>
      ),
      width: "130px",
    },

    {
      name: <span className="pe-2">Amount</span>,
      cell: (row) => (
        <div className="d-flex flex-column align-items-end pe-3 fw-bold">
          <div style={{ color: "green" }}>{currencySetter(row.amount)}</div>

          <div style={{ color: "#5B4C7D" }} hidden={role !== "admin"}>
            {currencySetter(row.ad_comm)}
          </div>
        </div>
      ),
      right: true,
    },

    // {
    //   name: "Charge",
    //   cell: (row) => (
    //     <div style={{ color: "red", textAlign: "right" }} className="fw-bold">
    //       {currencySetter(row.ret_charge)}
    //     </div>
    //   ),

    //   center: true,
    // },
    // {
    //   name: "GST",
    //   cell: (row) => (
    //     <div style={{ color: "red", textAlign: "center" }} className="fw-bold">
    //       {currencySetter(row.gst)}
    //     </div>
    //   ),

    //   center: true,
    // },

    // {
    //   name: <span className="pe-2">Comm</span>,
    //   cell: (row) => (
    //     <div className="fw-bold">
    //       <div>
    //         {currencySetter(role === "ad" ? row.ad_comm : row.ret_comm)}
    //       </div>
    //     </div>
    //   ),
    // },
    // {
    //   name: "TDS",
    //   selector: (row) => (
    //     <>
    //       <div style={{ color: "#715E93" }} className="fw-bold">
    //         {currencySetter(role === "ad" ? row.ad_tds : row.ret_tds)}
    //       </div>
    //     </>
    //   ),
    //   // omit: user && user.role !== "Ad",
    // },

    // {
    //   name: "CR/DR",
    //   selector: (row) => (
    //     <>
    //       <div
    //         style={{
    //           color: row.txn_type === "CR" ? "green" : "red",
    //           textAlign: "left",
    //         }}
    //         className="fw-bold"
    //       >
    //         {row.txn_type === "CR" ? "+ " : "- "}
    //         {currencySetter(row.net_amount)}
    //       </div>
    //     </>
    //   ),
    //   omit: user && user.role === "Ad",
    // },
    {
      name: <span className="pe-2">GST/TDS</span>,
      cell: (row) => (
        <div className="fw-bold">
          <div>{currencySetter(row.gst)}</div>
          <div>{currencySetter(row.ret_tds)}</div>
        </div>
      ),
      omit: role !== "admin",
    },
    {
      name: "Main Bal",
      selector: (row) => (
        <div className="d-flex align-items-start flex-column fw-bold">
          <div>{currencySetter(row.w1)}</div>
        </div>
      ),
    },
    {
      name: "Aeps Bal",
      selector: (row) => (
        <div className="d-flex align-items-start flex-column fw-bold">
          <div style={{ color: "#F29132" }}>{currencySetter(row.w2)}</div>
        </div>
      ),
    },
    // {
    //   name: <span className="pe-2">Gst</span>,
    //   cell: (row) => (
    //     <div style={{ textAlign: "left", fontSize: "12px" }}>
    //       <div>{currencySetter(row.gst)}</div>
    //       {/* <div>{currencySetter(row.ret_tds)}</div> */}
    //     </div>
    //   ),
    // },
    {
      name: <span>Ret Commission</span>,
      cell: (row) => (
        <div style={{ textAlign: "left", fontSize: "12px" }}>
          <div>{row?.ret_comm}</div>
        </div>
      ),
    },
    {
      name: <span>TDS</span>,
      cell: (row) => (
        <div style={{ textAlign: "left", fontSize: "12px" }}>
          <div>{row?.ret_tds}</div>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",

              alignItems: "center",
            }}
          >
            <CommonStatus
              status={row.status}
              approvedStatusText="Success"
              pendingStatusText="Pending"
              rejectedStatusText="Failed"
              refundStatusText="Refund"
              fontSize="11px"
              maxWidth="85px"
              minWidth="85px"
            />
          </Box>
        </>
      ),
    },

    {
      name: "Details",
      selector: (row) => (
        <>
          {(user.role === "Ret" || user.role === "Dd") && (
            <RightSidePannel row={row} />
          )}
        </>
      ),
      center: true,
      width: "70px",
    },
    {
      name: "Action",
      selector: (row) => (
        <>
          <PrintIcon
            onClick={() => {
              console.log("Type of transaction", row?.type);
              setRedirection(row);
              if (
                !["PREPAID", "DTH", "UTILITY"].includes(currentTab || row?.type)
              ) {
                localStorage.setItem("selectedRow", JSON.stringify(row));
              }
              window.open(
                ["PREPAID", "DTH", "UTILITY"].includes(currentTab || row?.type)
                  ? //  ||
                    //   ["PREPAID", "DTH", "UTILITY"].includes(row?.type)
                    `/UtilityReciept?${objectData(row, true)}`
                  : `/receipt?${objectData(row, true)}`,
                "_blank"
              );
            }}
          />
        </>
      ),
      center: true,
      width: "70px",
    },
  ];

  // const searchOptions = [
  //   { field: "Number", parameter: "number" },
  //   { field: "Account", parameter: "ben_acc" },
  //   { field: "Username", parameter: "username" },
  // ];
  const transactions = [
    { title: "Total Transactions", amount: "$1000" },
    { title: "Pending ", amount: "$200" },
    { title: "Completed ", amount: "$800" },
    { title: "Failed ", amount: "$50" },
    { title: "Refunded ", amount: "$150" },
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
      console.log(
        "This is your selectedRow",
        // selectedRows,
        selectedRows.selectedRows
      );
      if (redirection) {
        localStorage.setItem("selectedRow", JSON.stringify(redirection));
      }
    }
    return () => {};
  }, [selectedRows, redirection]);
  const tabs = [
    { label: "ALL" },
    { label: "Money Transfer" },

    { label: "Collections" },
    { label: "Admin Transfer" },
    { label: "Utility" },
    { label: "verification" },
    { label: "Recharge" },
    { label: "Irctc" },
  ];
  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  //   if (typeof resetFilter === 'function') {
  //     resetFilter(); // Call resetFilter only if it's a function
  //   }
  //   console.log("data of value",newValue)
  //   setCurrentType(Transaction_Tab[newValue])
  //   // console.log(Transaction_Tab[newValue])
  //   const selectedTab = Transaction_Tab[newValue];
  //   setQuery(`category=${selectedTab}`);

  // };
  // console.log("data of value",newValue)

  if (!chooseInitialCategoryFilter && role !== "admin" && role !== "api") {
    return (
      <>
        {/* <CustomTabs
      tabs={tabs}
      value={value}
      onChange={handleChange}

    /> */}
        <RetDbTransactionTab
          setQuery={setQuery}
          setRefreshTab={setRefreshTab}
          setCurrentTab={setCurrentTab}
          refreshTab={refreshTab}
          setTabQueryreset={setTabQueryreset}
        />
        {/* <Grid container>
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
        </Grid> */}
              

        <Grid xs={12} sx={{ pl: { xs: 0, md: 0 } }}>
          <ApiPaginateSearch
            showSearch={false}
            totalCard={
              <>
                <StatusDisplay sumData={sumData} setSumData={setSumData} />
              </>
            }
            actionButtons={
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
                {user?.role?.toLowerCase() !== "admin" &&
                  user?.role?.toLowerCase() !== "asm" &&
                  user?.role?.toLowerCase() !== "ad" &&
                  user?.role?.toLowerCase() !== "api" && (
                    <Tooltip title="Download Receipt" placement="top">
                      <PrintIcon
                        color="danger"
                        className=" mx-2 refresh-purple"
                        onClick={() => {
                          if (
                            selectedRows &&
                            selectedRows.selectedRows &&
                            selectedRows.selectedRows.length > 0
                          ) {
                            window.open("/receipt", "_blank");
                          } else {
                            apiErrorToast("No Transaction Selected.");
                          }
                        }}
                      />
                    </Tooltip>
                  )}
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
                </div>
                <RefreshComponent
                  onClick={() => {
                    refreshFunc(setQuery);
                  }}
                />
              </Grid>
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
            setResetFilter={setResetFilter}
            queryParam={query ? query : ""}
            setTabQueryreset={setTabQueryreset}
            returnRefetch={(ref) => {
              refresh = ref;
            }}
            conditionalRowStyles={conditionalRowStyles}
            selectableRows
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
                showSearch={false}
                ifoperatorFilter
                setRefreshTab={setRefreshTab}
                refreshTab={refreshTab}
                ifstatusFilter2
                setTabQueryreset={setTabQueryreset}
                // ifFromBankFilter
                ifdateFilter
                // type and category is same
                ifTypeFilter
                chooseInitialCategoryFilter={
                  chooseInitialCategoryFilter !== "ALL"
                    ? chooseInitialCategoryFilter
                    : false
                }
                //
                tabQueryreset={tabQueryreset}
                ifnumberFilter
                ifotherFilter
                setResetFilter={setResetFilter}
                typeList={typeList.filter((item) => item.name !== "ALL")}
                nonAdminColOptions={nonAdminColOptions[`${role}`]}
                statusList={statusList}
                operatorList={operatorList}
                getOperatorVal={getOperatorVal}
                setQuery={setQuery}
                query={query}
                clearHookCb={(cb) => {
                  refreshFilter = cb;
                }}
                refresh={refresh}
                getTypes={getTypes}
                isShowFilterCard={isShowFilterCard}
                setIsShowFilterCard={setIsShowFilterCard}
                // button
                // backButton={
                //   <Button
                //     size="small"
                //     className="otp-hover-purple"
                //     sx={{
                //       color: primaryColor(),
                //       mt: 2,
                //     }}
                //     onClick={() => {
                //       setChooseInitialCategoryFilter(false);
                //     }}
                //   >
                //     <KeyboardBackspaceIcon fontSize="small" /> Back
                //   </Button>
                // }
                actionButtons={
                  <>
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

                    {/* <Tooltip title="Download Receipt" placement="top">
                      <PrintIcon
                        color="danger"
                        className="text-danger"
                        onClick={() => {
                          // if (
                          //   selectedRows &&
                          //   selectedRows.selectedRows &&
                          //   selectedRows.selectedRows.length > 0
                          // ) {
                          const path =
                            currentTab === "UTILITY" ||
                            currentTab === "PREPAID" ||
                            currentTab === "DTH"
                              ? `/UtilityReciept?transaction_id=${"111111"}`
                              : "/receipt";
                          window.open(path, "_blank");
                          // } else {
                          //   apiErrorToast("No Transaction Selected.");
                          // }
                        }}
                      />
                    </Tooltip> */}

                    <div className="me-1">
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
                    <Tooltip title="refresh">
                      <IconButton
                        aria-label="refresh"
                        // color="success"
                        sx={{
                          color: "#0F52BA",
                          ml: -1,
                        }}
                        onClick={() => {
                          refreshFunc(setQuery);
                        }}
                      >
                        <CachedIcon className="refresh-purple" />
                      </IconButton>
                    </Tooltip>
                  </>
                }
              />
            }
          />
        </Grid>

        {/* <Grid
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
        </Grid> */}
      </>
    );
  } else {
    return (
      <Grid container>
        {/* small screen action button and filter modal show only on small screen*/}

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
          {/* back button */}
          <div className="me-3">
            <Button
              size="small"
              className="otp-hover-purple"
              sx={{
                color: primaryColor(),
              }}
              onClick={() => {
                setChooseInitialCategoryFilter(false);
              }}
            >
              <KeyboardBackspaceIcon fontSize="small" /> Back
            </Button>
          </div>{" "}
          {/* radio toggle */}
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
                    onChange={() => setShowOldTransaction(!showOldTransaction)}
                  >
                    <MenuItem value={true}>Old</MenuItem>
                    <MenuItem value={false}>New</MenuItem>
                  </Select>
                </FormControl>
              }
            />
          </FormGroup>
          {/* excel */}
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
          </div>
          {/* refresh */}
          <div className="me-3">
            <RefreshComponent
              className="refresh-icon-table"
              onClick={() => {
                refreshFunc(setQuery);
              }}
            />
          </div>
          <FilterModal
            ifoperatorFilter
            ifstatusFilter
            ifdateFilter
            // type and category is sa
            ifTypeFilter
            ifnumberFilter
            ifotherFilter
            typeList={typeList.filter((item) => item.name !== "ALL")}
            operatorList={operatorList}
            statusList={statusList}
            getOperatorVal={getOperatorVal}
            setQuery={setQuery}
            query={query}
            clearHookCb={(cb) => {
              refreshFilter = cb;
            }}
            getTypes={getTypes}
            refresh={refresh}
          />{" "}
        </Grid>
      </Grid>
    );
  }
};

export default RetDdTransactionView;
