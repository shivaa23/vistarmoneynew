import React, { useState } from "react";
import CommonStatus from "../../component/CommonStatus";
import {
  Tooltip,
  //   Snackbar,
  Grid,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";

// import InstallMobileIcon from "@mui/icons-material/InstallMobile";
// import LaptopIcon from "@mui/icons-material/Laptop";
// import AppleIcon from "@mui/icons-material/Apple";
// import AndroidIcon from "@mui/icons-material/Android";

// import SyncAltIcon from "@mui/icons-material/SyncAlt";

import { useEffect } from "react";
import { useContext } from "react";

import PrintIcon from "@mui/icons-material/Print";

import moment from "moment";

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import AuthContext from "../../store/AuthContext";
import { get } from "../../network/ApiController";
import ApiEndpoints from "../../network/ApiEndPoints";
import { json2Csv, json2Excel } from "../../utils/exportToExcel";
import { apiErrorToast } from "../../utils/ToastUtil";
import useCommonContext from "../../store/CommonContext";
import { datemonthYear } from "../../utils/DateUtils";
import { capitalize1 } from "../../utils/TextUtil";
import { currencySetter } from "../../utils/Currencyutil";
// import CheckStatusModal from "../../modals/CheckStatusModal";
// import CheckResponseModal from "../../modals/CheckResponseModal";
// import GetAdModalTxn from "../../modals/GetAdModalTxn";
// import ChangeStatusModal from "../../modals/ChangeStatusModal";
// import RaiseIssueModal from "../../modals/RaiseIssueModal";
import {
  AD_REPORTS,
  MD_REPORTS,
  REPORTS,
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
import RightSidePannel from "../../component/transactions/RightSidePannel";
import CachedIcon from "@mui/icons-material/Cached";
import RetDbTransactionTab from "../../component/Tab/RetDbTransactionTab";
import StatusDisplay from "../../StatusDisplay";
// eslint-disable-next-line no-unused-vars
let refreshFilter;

let handleCloseModal;
const AdTransactionView = () => {
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();
  const[refreshTab,setRefreshTab]=useState(0)
  const [asmList, setAsmList] = useState([]);
  const [state, setState] = useState(false);
  const [rowData, setRowData] = useState({});
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const role = user?.role.toLowerCase();

  const [showOldTransaction, setShowOldTransaction] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [request, setRequest] = useState();
  const [noOfResponses, setNoOfResponses] = useState(0);
  const [typeList, setTypeList] = useState([]);
  const[sumData,setSumData]=useState(false)
  const [tabQueryreset, setTabQueryreset] = useState(false);
  const navigate = useNavigate();

  const isFilterAllowed = useMemo(
    () =>
      user?.role.toLowerCase() === "admin" ||
      user?.role.toLowerCase() === "dd" ||
      user?.role.toLowerCase() === "ad" ||
      user?.role.toLowerCase() === "md" ||
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

  // get asm list api
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

  useEffect(() => {
    if (chooseInitialCategoryFilter && chooseInitialCategoryFilter !== "ALL") {
      setQuery(`category=${chooseInitialCategoryFilter}`);
    }
  }, [chooseInitialCategoryFilter]);

  const prefilledQuery = `category=${chooseInitialCategoryFilter}`;

  let refresh;
  function refreshFunc(setQueryParams) {
    if (refresh) refresh();
    setQueryParams(query);
    // if (refreshFilter) refreshFilter();
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
  ////  disable rows
  const isStatusPending = (row) =>
    // row.status.toLowerCase() === "pending" ||
    row.status.toLowerCase() === "refund" ||
    row.status.toLowerCase() === "failed";

  const columns = [
    {
      name: "Date/Time",
      selector: (row) => (
        <div style={{ textAlign: "left", marginBottom: "2px" }}>
          {datemonthYear(row.created_at)}
        </div>
      ),
      wrap: true,
    },
    {
      name: <span className="">Operator</span>,
      cell: (row) => (
        <div>
          <Tooltip
            placement="right"
            title={
              row.operator === "Vendor Payments" ? "settlements" : row.operator
            }
          >
            <div className="break-words mr-2">
              {row.operator === "Vendor Payments"
                ? "settlements"
                : row.operator}
            </div>
          </Tooltip>
        </div>
      ),
      wrap: true,
      width: "200px",
    },
    // est missing from ad login
    {
      name: <span className="">{"Establishment"}</span>,
      selector: (row) => (
        <div
          style={{
            textAlign: "left",
          }}
        >
          <Tooltip title={capitalize1(row.establishment)}>
            <div className="d-flex" style={{ textAlign: "left" }}>
              <span className="break-words" style={{ marginRight: "4px" }}>
                {capitalize1(row.establishment)}
              </span>
            </div>
          </Tooltip>
        </div>
      ),

      wrap: true,
      center: false,
      width: "260px",
    },
    {
      name: <span>Number</span>,
      selector: (row) => (
        <div className="d-flex flex-column align-items-start">
          <Typography
            sx={{
              fontSize: "inherit",
              fontWeight: "600",
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
      name: <span className="pe-2">Amount</span>,
      cell: (row) => (
        <div className="d-flex flex-column align-items-end pe-3 fw-bold">
          <div style={{ color: "green" }}>{currencySetter(row.amount)}</div>
        </div>
      ),
      right: true,
    },

    {
      name: <span className="pe-2">Comm</span>,
      cell: (row) => (
        <div className="fw-bold">
          <div>{currencySetter(row.ad_comm)}</div>
        </div>
      ),
      // omit: role !== "api" ,
      // omit: role !== "api" || role !== "ret" || role !== "dd",
    },
    {
      name: "TDS",
      selector: (row) => (
        <>
          <div style={{ color: "red " }} className="fw-bold">
            -{Number(row.ad_tds).toFixed(2)}
          </div>
        </>
      ),
      // omit: user && user.role !== "Ad",
    },

    {
      name: "Closing",
      selector: (row) => (
        <div className="d-flex align-items-start flex-column fw-bold">
          <div>{currencySetter(row.w1)}</div>
          <div style={{ color: "#F29132" }}>{currencySetter(row.w2)}</div>
        </div>
      ),
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
      name: "Details",
      selector: (row) => <RightSidePannel row={row} />,
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

  // if (!chooseInitialCategoryFilter && role !== "admin" && role !== "api") {
  //   return (
  //     <>
  //       <Grid container>
  //         <Grid
  //           item
  //           md={12}
  //           xs={12}
  //           sx={{
  //             textAlign: "left",
  //             pl: 3,
  //             fontSize: "25px",
  //             fontWeight: "600",
  //             mb: 3,
  //           }}
  //         >
  //           Reports
  //         </Grid>
  //         {typeList.length > 1 &&
  //           typeList
  //             .filter((i) => i.name !== "SECONDARY")
  //             .map((item) => {
  //               return (
  //                 <Grid
  //                   item
  //                   md={2}
  //                   onClick={() => {
  //                     setChooseInitialCategoryFilter(item.name);
  //                   }}
  //                   className="all-categories-box hover-less-zoom"
  //                 >
  //                   <Box sx={{ width: "30%", p: 1 }}>
  //                     <Box className="transaction-icon-box">
  //                       <img
  //                         src={`https://api.impsguru.com/public/logos/${
  //                           item.name.split(" ")[0]
  //                         }.svg`}
  //                         alt="categories"
  //                         width="65%"
  //                       />
  //                     </Box>
  //                   </Box>
  //                   <Box sx={{ width: "70%" }}>{item.name}</Box>
  //                 </Grid>
  //               );
  //             })}
  //       </Grid>

  //       <Grid
  //         container
  //         sx={{ mt: 5 }}
  //         hidden={
  //           role !== "ret" && role !== "dd" && role !== "ad" && role !== "md"
  //         }
  //       >
  //         {(role === "ad"
  //           ? AD_REPORTS
  //           : role === "md"
  //           ? MD_REPORTS
  //           : REPORTS.filter((i) => {
  //               if (user?.acst === 0) {
  //                 return i.name !== "ACCOUNT LEDGER";
  //               } else {
  //                 return i;
  //               }
  //             })
  //         ).map((item) => {
  //           return (
  //             <Grid
  //               item
  //               md={2}
  //               onClick={() => navigate(item.url)}
  //               className="all-categories-box hover-less-zoom"
  //               // sx={{
  //               //   backgroundImage: `url("https://api.impsguru.com/public/logos/${
  //               //     item.name.split(" ")[0]
  //               //   }.svg")`,
  //               // }}
  //             >
  //               <Box sx={{ width: "30%", p: 1 }}>
  //                 <Box className="transaction-icon-box">
  //                   <img
  //                     src={`https://api.impsguru.com/public/logos/${
  //                       item.name.split(" ")[0]
  //                     }.svg`}
  //                     alt="categories"
  //                     width="65%"
  //                   />
  //                 </Box>
  //               </Box>
  //               <Box sx={{ width: "70%" }}>{item.name}</Box>
  //             </Grid>
  //           );
  //         })}
  //       </Grid>
  //     </>
  //   );
  // } else {
  return (
    <Grid container>
      {/* only for small screen  */}
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
        {/* <Button
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
          </Button> */}
        {/* old new tranactions */}
        <div className="mx-2" style={{ width: "70px" }}>
          <FormGroup>
            <FormControlLabel
              sx={{
                mt: { md: 0, sm: 2, xs: 2 },
                mb: { md: 0, sm: 2, xs: 2 },
              }}
              control={
                <Switch
                  value={showOldTransaction}
                  defaultChecked={showOldTransaction}
                  onChange={() => setShowOldTransaction(!showOldTransaction)}
                />
              }
              label={
                <Typography variant="body2" style={{ fontSize: "15px" }}>
                  Old
                </Typography>
              }
            />
          </FormGroup>
        </div>

        {/* excel */}

        {/* filter */}
        <FilterCard
          iforderidFilter
          ifFromBankFilter
          ifdateFilter
          ifoperatorFilter
          ifstatusFilter
          ifUsernameFilter
          ifestFilter
          ifTypeFilter
          tabQueryreset={tabQueryreset}
          getTypes={getTypes}
          typeList={typeList.filter((item) => item.name !== "ALL")}
          ifnumberFilter
          setTabQueryreset={setTabQueryreset}
          ifotherFilter
          operatorList={operatorList}
          statusList={statusList}
          getOperatorVal={getOperatorVal}
          setQuery={setQuery}
          query={query}
          clearHookCb={(cb) => {
            refreshFilter = cb;
          }}
          refresh={refresh}
          isShowFilterCard={isShowFilterCard}
          setIsShowFilterCard={setIsShowFilterCard}
        />
      </Grid>
      <Grid xs={12} sx={{ pl: { xs: 0, md: 2 } }}>
        <RetDbTransactionTab
          setQuery={setQuery}
          setRefreshTab={setRefreshTab} refreshTab={refreshTab}
          setTabQueryreset={setTabQueryreset}
        />
        <ApiPaginateSearch
          showSearch={true}
          totalCard={
            <>
            <StatusDisplay sumData={sumData} setSumData={setSumData}/>
          </>}
          // actionButtons={
          //   <Grid
          //     item
          //     md={11}
          //     sm={12}
          //     xs={12}
          //     sx={{
          //       display: "flex",
          //       justifyContent: { md: "end", xs: "start" },
          //       alignItems: "center",
          //       flexDirection: { md: "row", xs: "column" },
          //       pr: 1,
          //     }}
          //   >
          //     <FormGroup>
          //       <FormControlLabel
          //         sx={{
          //           mt: { md: 0, sm: 2, xs: 2 },
          //           mb: { md: 0, sm: 2, xs: 2 },
          //         }}
          //         control={
          //           <Switch
          //             value={showOldTransaction}
          //             defaultChecked={showOldTransaction}
          //             onChange={() =>
          //               setShowOldTransaction(!showOldTransaction)
          //             }
          //           />
          //         }
          //         label={
          //           <Typography variant="body2" style={{ fontSize: "15px" }}>
          //             Old Transactions
          //           </Typography>
          //         }
          //       />
          //     </FormGroup>

          //     <div className="mx-2">
          //       <ExcelUploadModal
          //         twobuttons="Download Csv"
          //         btn
          //         request={request}
          //         getExcel={getExcel}
          //         getCsv={getCsv}
          //         noOfResponses={noOfResponses}
          //         setQuery={setQuery}
          //         handleCloseCB={(closeModal) => {
          //           handleCloseModal = closeModal;
          //         }}
          //       />
          //     </div>
          //     <RefreshComponent
          //       className="refresh-icon-table"
          //       onClick={() => {
          //         refreshFunc(setQuery);
          //       }}
          //     />
          //     <span className="filter-sm">
          //       <FilterModal
          //         ifdateFilter
          //         ifoperatorFilter
          //         ifstatusFilter
          //         ifUsernameFilter={
          //           user &&
          //           (user.role.toLowerCase() === "ret" ||
          //             user.role.toLowerCase() === "dd")
          //             ? false
          //             : true
          //         }
          //         ifestFilter
          //         ifnumberFilter
          //         operatorList={operatorList}
          //         statusList={statusList}
          //         getOperatorVal={getOperatorVal}
          //         setQuery={setQuery}
          //         query={query}
          //         clearHookCb={(cb) => {
          //           refreshFilter = cb;
          //         }}
          //         refresh={refresh}
          //         isShowFilterCard={isShowFilterCard}
          //         setIsShowFilterCard={setIsShowFilterCard}
          //       />
          //     </span>
          //   </Grid>
          // }
          // backButton={
          //   <Button
          //     size="small"
          //     className="otp-hover-purple"
          //     sx={{
          //       color: primaryColor(),
          //     }}
          //     onClick={() => {
          //       setChooseInitialCategoryFilter(false);
          //     }}
          //   >
          //     <KeyboardBackspaceIcon fontSize="small" /> Back
          //   </Button>
          // }
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
          setTabQueryreset={setTabQueryreset}
          setApiData={setApiData}
          tableStyle={CustomStyles}
          queryParam={query ? query : ""}
          returnRefetch={(ref) => {
            refresh = ref;
          }}
          conditionalRowStyles={conditionalRowStyles}
          selectableRows={false}
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
              showSearch={false}
              ifdateFilter={false}
              ifFromBankFilter
              setRefreshTab={setRefreshTab} 
              refreshTab={refreshTab}
              ifoperatorFilter
              ifstatusFilter
              chooseInitialCategoryFilter={
                chooseInitialCategoryFilter !== "ALL"
                  ? chooseInitialCategoryFilter
                  : false
              }
              //
              ifnumberFilter
              ifotherFilter
              ifUsernameFilter
              iforderidFilter
              ifTypeFilter
              asmList={asmList}
              typeList={typeList.filter((item) => item.name !== "ALL")}
              ifestFilter
              nonAdminColOptions={nonAdminColOptions[`${role}`]}
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
              // buttons
              // backButton={
              //   <Button
              //     size="small"
              //     className="otp-hover-purple"
              //     sx={{
              //       color: primaryColor(),
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
                  <Box sx={{ display: "flex", ml: -2 }}>
                    <ExcelUploadModal
                      twobuttons="Download Csv"
                      btn
                      request={request}
                      getExcel={getExcel}
                      getCsv={getCsv}
                      noOfResponses={noOfResponses}
                      handleCloseCB={(closeModal) => {
                        handleCloseModal = closeModal;
                      }}
                    />

                    <Tooltip title="refresh">
                      <IconButton
                        className=""
                        aria-label="refresh"
                        sx={{
                          color: "#1560bd",
                        }}
                        onClick={() => {
                          refreshFunc(setQuery);
                        }}
                      >
                        <CachedIcon
                          className="refresh-purple"
                          sx={{
                            color: "#1560bd",
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </>
              }
            />
          }
        />
      </Grid>

      {/* <RightSidePannel state={state} setState={setState} row={rowData} /> */}
    </Grid>
  );
};

export default AdTransactionView;
