import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  FormControl,
  MenuItem,
  TextField,
  IconButton,
  Tooltip,
  Container,
  Snackbar,
  Button,
  Grid,
} from "@mui/material";
import ApiEndpoints from "../network/ApiEndPoints";
// import ApiPaginate from "../component/ApiPaginate";
import { ddmmyy, dateToTime1 } from "../utils/DateUtils";
import { CustomStyles } from "../component/CustomStyle";
import CreditRequestModal from "../modals/CreditRequestModal";
import numWords from "num-words";
import CachedIcon from "@mui/icons-material/Cached";
// import FilterComponent from "../component/FilterComponent";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";
import CreateCreditRequest from "../modals/CreateCreditRequest";
import { useNavigate } from "react-router-dom";
import { currencySetter } from "../utils/Currencyutil";
// import ApiPaginateSearch from "../component/ApiPaginateSearch";
import ApiPaginate from "../component/ApiPaginate";
import { get } from "../network/ApiController";
import { apiErrorToast } from "../utils/ToastUtil";
import { json2Excel } from "../utils/exportToExcel";
import moment from "moment";
import ExcelUploadModal from "../modals/ExcelUploadModal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { capitalize1 } from "../utils/TextUtil";
import CommonStatus from "../component/CommonStatus";
import { Icon } from "@iconify/react";

import FilterCard from "../modals/FilterCard";
import useCommonContext from "../store/CommonContext";
import MyButton from "../component/MyButton";
import Loader from "../component/loading-screen/Loader";
import ViewModal from "../modals/ViewModal";
import ApiPaginateSearch from "../component/ApiPaginateSearch";
import StatusDisplay from "../StatusDisplay";
import { keyframes } from "@emotion/react";
import { styled } from "@mui/material/styles";
import UpdateIcon from "@mui/icons-material/Update";
import Menu from "@mui/material/Menu";
import { mt_tab_value } from "../utils/constants";
import CustomTabs from "../component/CustomTabs";
import ReopenCreditRequest from "../modals/ReopenCreditRequest";
const CreditRequestView = () => {
  const navigate = useNavigate();
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
  const [prefilledQuery, SetPrefilledQuery] = useState("status=");
  const [sumData, setSumData] = useState(false);

  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState("status=PENDING");

  const [open, setOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState("PENDING");
  const [noOfResponses, setNoOfResponses] = useState(0);
  // console.log("noOfResponses", noOfResponses);
  const [request, setRequest] = useState(false);
  const [asmVal, setAsmVal] = useState([]);
  const [filterValues, setFilterValues] = useState({ date: {}, dateVal: null });
  //
  const [isShowFilterCard, setIsShowFilterCard] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [intervalSec, setIntervalSec] = useState(0); // Selected interval in seconds
  const [elapsedTime, setElapsedTime] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isActive, setIsActive] = useState(false);
   const [value, setValue] = useState(0);
    const [currentType, setCurrentType] = useState("dmt1");
    const [type, settype] = useState("dmt1");
    const tabs = [
      { label: "Normal" },
 { label: "Miscellaneous" },
 
    ].filter(Boolean);
  const {
    setChooseInitialCategoryFilter,
    chooseInitialCategoryFilter,
    refreshUser,
  } = useCommonContext();

  function refreshFunc(setQueryParams) {
    if (refresh) refresh();
  }

  // check screen is big or small
  const [isBig, setIsBig] = React.useState(
    window.innerWidth < 900 ? false : true
  );

  const changeApply = () => {
    if (window.innerWidth < 900) setIsBig(false);
    if (window.innerWidth > 900) setIsBig(true);
  };
  useEffect(() => {
    window.addEventListener("resize", changeApply);
    return () => {
      window.removeEventListener("resize", changeApply);
    };
  }, []);

  let handleCloseModal;
  let refresh;
  function refreshFunc(setQueryParams) {
    // setQueryParams("status=PENDING");
    // setDefaultStatus("PENDING");
    if (refresh) refresh();
  }
  //
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

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

  const getUserAsm = () => {
    get(
      ApiEndpoints.GET_USERS,
      `page=1&paginate=100&role=Asm&export=`,
      null,
      (res) => {
        const asmArray = res.data.data;
        setAsmVal(
          asmArray &&
            asmArray.map((item) => {
              return {
                id: item.id,
                name: item.name,
              };
            })
        );
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };
  const handleNavigation = (row) => {
    // Set the remark in state if needed for other purposes
    // setRemark(row?.remark);

    // Construct query string from the row object
    const queryString = new URLSearchParams({
      amount: row?.amount,
      referenceId: row?.referenceId,
      bank: row?.bank_name,
      mode: row?.mode,
      remark: row?.remark,
      name: row?.name,
      id: row?.id,
      user_id: row?.user_id,
      mobile: row?.username,
      dateValue: row?.date,
      txn_id: row?.txn_id,
    }).toString();

    // Open the new URL with the query string
    window.open(`/indemnityLetter?${queryString}`, "_blank");
  };

  const findAsmWithId = (id) => {
    let item = asmVal && asmVal.find((item) => item.id === Number(id));
    // return item && item.name
    if (item) {
      return item.name;
    } else {
      return "";
    }
  };

  useEffect(() => {
    if (user.role === "Admin") getUserAsm();
  }, []);

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
  const handleChange = (event, newValue) => {
    console.log("newval", newValue);
    setValue(newValue);
    settype(mt_tab_value[newValue]);
    setCurrentType(mt_tab_value[newValue]);
    console.log("cms value is", type);
  };
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);
  const columns = [
    {
      name: "Created/Updated",
      selector: (row) => (
        <>
          <div className="mb-2">
            {ddmmyy(row.created_at)} {dateToTime1(row.created_at)}
          </div>
          <div>
            {ddmmyy(row.updated_at)} {dateToTime1(row.updated_at)}
          </div>
        </>
      ),
      wrap: true,
      width: "125px",
    },
    {
      name: "Deposit Date & Txn ID",
      selector: (row) =>
        user && user.role === "Admin" ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "5px",
                textAlign: "left",
              }}
            >
              {row.date}
            </div>

            <div
              style={{
                fontSize: "13px",
                color: "gray",
                cursor: "pointer",
                textAlign: "left",
              }}
              title={row.txn_id || "Transaction ID not available"}
            >
              {row.txn_id || "NA"}
            </div>
          </div>
        ) : null,
      wrap: true,
      omit: user && user.role !== "Admin",
      width: "180px",
    },

    {
      name: "Deposit Date",
      selector: (row) => <div>{row.date}</div>,
      wrap: true,
      omit: user && user.role === "Admin",
    },
    {
      name: "Transaction Id",
      selector: (row) => (
        <div style={{ fontSize: "13px" }}>{row.txn_id || "NA"}</div>
      ),
      wrap: true,
      omit: user && user.role === "Admin",
    },
    {
      name: <span className="mx-2">Merchant</span>,

      selector: (row) => (
        <>
          <div style={{ textAlign: "left", fontSize: "13px" }}>
            <div>{capitalize1(row.name)}</div>
          </div>
          <div
            
          >
         <span style={{ fontSize: "13px" }}
            onClick={() => {
              copyToClipBoard(row.username);
              handleClickSnack();
            }}>  {row.username}</span> 
         <Tooltip title="Go To Account">
              <IconButton
                sx={{ color: "#00693E", mx: 0.3 }}
                onClick={() => {
                  navigate("/admin/accountStatement", {
                    state: {
                      mobile: row.username,
                      acc_name: row.name,
                      bal: row.balance,
                    },
                  });
                }}
              >
                <Icon icon="ion:arrow-undo-sharp" width={20} height={20} />
              </IconButton>
            </Tooltip>
            <Snackbar
              open={open}
              autoHideDuration={3000}
              onClose={handleCloseSnack}
              message="number copied"
              sx={{ zIndex: 10000 }}
            />
          </div>
        </>
      ),
      wrap: true,
      width: "140px",

      omit:
        user && user.role === "Admin"
          ? false
          : user && user.role === "Asm"
          ? false
          : true,
    },

    {
      name: "Role",
      selector: (row) => (
        <div className="blue-highlight-txt" style={{ textAlign: "left" }}>
          {row.role && row.role === "Ret"
            ? "Ret"
            : row.role && row.role === "Ad"
            ? "AD"
            : row.role && row.role === "Api"
            ? "Corp"
            : row.role && row.role === "Asm"
            ? "SM"
            : row.role && row.role === "Dd"
            ? "DD"
            : ""}
        </div>
      ),
      wrap: true,

      omit:
        user && user.role === "Admin"
          ? false
          : user && user.role === "Asm"
          ? false
          : true,
    },
    {
      name: "ASM",
      selector: (row) => (
        <div style={{ fontSize: "13px" }}>
          {findAsmWithId(row.asm_Id) ? findAsmWithId(row.asm_Id) : "NA"}
        </div>
      ),
      wrap: true,

      omit:
        user && user.role === "Admin"
          ? false
          : user && user.role === "Asm"
          ? true
          : true,
    },
    {
      name: "Bank & MOP",
      selector: (row) =>
        user && user.role === "Admin" ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "5px",
                textAlign: "left",
              }}
            >
              {row.bank_name}
            </div>

            <div
              style={{
                fontSize: "13px",
                color: "gray",
                cursor: "pointer",
                textAlign: "left",
              }}
              title={row.mode || "NA"}
            >
              {row.mode || "NA"}
            </div>
          </div>
        ) : null,
      wrap: true,
      omit: user && user.role !== "Admin",
      width: "140px",
    },
    {
      name: "Bank",
      selector: (row) => (
        <div style={{ textAlign: "left", fontSize: "12px" }}>
          <div>{row.bank_name}</div>
        </div>
      ),
      wrap: true,
      omit: user && user.role === "Admin",
    },
    {
      name: "MOP",
      selector: (row) => (
        <div style={{ textAlign: "left", fontSize: "13px" }}>
          <div style={{ color: "grey" }}>{row.mode}</div>
        </div>
      ),
      wrap: true,
      omit: user && user.role === "Admin",
      center: false,
    },

    {
      name: "Ref",
      selector: (row) => (
        <div style={{ textAlign: "left", fontsize: "13px" }}>
          {row.bank_ref_id}
        </div>
      ),
      wrap: true,
    },
    {
      name: "Amount",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>
          <div>{currencySetter(row.amount)}</div>
          <Box sx={{ color: "grey", fontSize: "10.5px", mt: 0.5 }}>
            {numWords(row.amount)}
          </Box>
        </div>
      ),
      wrap: true,
    },
    {
      name: "Credit",
      selector: (row) => currencySetter(row.ledger_bal),
      wrap: true,

      // omit: user && (user.role === "Ret" || user.role === "Dd"),
      omit: user && user.role !== "Admin",
    },
    {
      name: "Remarks",
      selector: (row) => (
        <div style={{ fontSize: "13px", textAlign: "left" }}>
          {row.remark ? row.remark : "NA"}
        </div>
      ),
      wrap: true,
    },
    {
      name: "Status",
      selector: (row) => {
        return (
          <Box
            sx={{
              display: "flex",

              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <CommonStatus
              status={row?.status}
              approvedStatusText="APPROVED"
              pendingStatusText="PENDING"
              rejectedStatusText="REJECTED"
              fontSize="11px"
            />
          </Box>
        );
      },
      wrap: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {row?.status === "REJECTED" && (
            <>
           {(user?.role === "Dd" || user?.role === "Ret" || user?.role === "AD" || user?.role === "Md") && (
          <ReopenCreditRequest row={row}  refresh={refresh} />
  )}
              {/* <ViewModal row={row} refresh={refresh} />
              <Tooltip title="Indemnity Bond">
                <IconButton
                  sx={{ color: "#1a73e8" }}
                  onClick={() => handleNavigation(row)} // Pass the row object as an argument
                >
                  <Icon
                    icon="material-symbols:description-outline"
                    width={25}
                    height={25}
                  />
                </IconButton>
              </Tooltip> */}
            </>
          )}
        </Box>
      ),
      wrap: true,
      width:"150px",
      omit:
      user && user.role === "Ret"||user.role === "Dd"
        ? defaultStatus && defaultStatus === "APPROVED"
          ? true
          : false
        : true,
    },
    

    {
      name: <span className="mx-3">Action</span>,
      selector: (row) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {row?.status === "REJECTED" ? (
            <>
              <CreditRequestModal row={row} action="REOPEN" refresh={refresh} />
              <ViewModal row={row} refresh={refresh} />
              <Tooltip title="Indemnity Bond">
                <IconButton
                  sx={{ color: "#1a73e8" }}
                  onClick={() => handleNavigation(row)} // Pass the row object as an argument
                >
                  <Icon
                    icon="material-symbols:description-outline"
                    width={25}
                    height={25}
                  />
                </IconButton>
              </Tooltip>
            </>
          ) : row?.status === "PENDING" ? (
            <div style={{ display: "flex" }}>
              <CreditRequestModal
                row={row}
                action="APPROVE"
                refresh={refresh}
              />
              <CreditRequestModal row={row} action="REJECT" refresh={refresh} />

              <ViewModal row={row} refresh={refresh} />
              {/* Indemnity Bond Icon */}
              <Tooltip title="Indemnity Bond">
                <IconButton
                  sx={{ color: "#1a73e8" }}
                  onClick={() => handleNavigation(row)} // Pass the row object as an argument
                >
                  <Icon
                    icon="material-symbols:description-outline"
                    width={25}
                    height={25}
                  />
                </IconButton>
              </Tooltip>
            </div>
          ) : (
            <>
              {/* <Box
                sx={{ display: "flex", alignItems: "center", color: "green" }}
              >
                <CheckCircleIcon sx={{ mr: 0.3 }} />
                Already Approved
              </Box> */}
              <ViewModal row={row} refresh={refresh} />

              <Tooltip title="Indemnity Bond">
                <IconButton
                  sx={{ color: "#1a73e8" }}
                  onClick={() => handleNavigation(row)} // Pass the row object as an argument
                >
                  <Icon
                    icon="material-symbols:description-outline"
                    width={25}
                    height={25}
                  />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      ),
      wrap: true,
      width: "170px",
      omit:
        user && user.role === "Admin"
          ? defaultStatus && defaultStatus === "APPROVED"
            ? true
            : false
          : true,
    },
  ];

  // excel api call
  const getExcel = () => {
    get(
      ApiEndpoints.CRED_REQ,
      `${
        query
          ? query + "&page=1&paginate=10&export=1"
          : "page=1&paginate=10&export=1&status=ALL"
      }`,
      setRequest,
      (res) => {
        const apiData = res.data.data;
        // console.log("data", apiData);
        json2Excel(
          `Fund Request ${moment(new Date().toJSON()).format(
            "Do MMM YYYY"
          )} | ${moment(new Date().toJSON()).format("hh:mm a")}`,
          JSON.parse(JSON.stringify(apiData && apiData))
        );
        handleCloseModal();
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  return (
    
    <Grid >
      <Grid>
        {user.role==="Admin"&&
            <CustomTabs
                              tabs={tabs}
                              value={value}
                              onChange={handleChange}
                            />}
                            </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          pb: 1,
          pt: 1,
          width: "100%",
        }}
      >
        
                        
        <Box>
          <FilterCard
            ifStatusFilter
            iftxnIdFilter
            ifnumberFilter={user.role === "Admin"}
            // ifestFilter={user.role === "Admin"}
            setQuery={setQuery}
            ifdateFilter
            query={query}
            chooseInitialCategoryFilter={
              chooseInitialCategoryFilter !== "ALL"
                ? chooseInitialCategoryFilter
                : false
            }
            refresh={refresh}
            isShowFilterCard={isShowFilterCard}
            setIsShowFilterCard={setIsShowFilterCard}
            actionButtons={
              <>
                <Tooltip title="export">
                  <ExcelUploadModal
                    btn
                    request={request}
                    getExcel={getExcel}
                    noOfResponses={noOfResponses}
                    setQuery={setQuery}
                    handleCloseCB={(closeModal) => {
                      handleCloseModal = closeModal;
                    }}
                  />
                </Tooltip>
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
                    <CachedIcon className="refresh-purple " />
                  </IconButton>
                </Tooltip>
                <Box sx={{ display: "flex", ml: 2 }}>
                  <div>
                    <Tooltip title="Scheduler">
                      <BlinkingIcon active={isActive} onClick={handleClick} />
                    </Tooltip>
                    {isActive && <span>{elapsedTime}</span>}
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        ml: { lg: 130, sm: 50, xs: 2 },
                        top: { sm: "20%", lg: "15%" },
                        right: { xs: 0, sm: 50 },
                        width: { xs: "auto", sm: "200px" },
                      }}
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
        </Box>
        {user?.role !== "Admin" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Loader loading={request} size="small" />
            <CreateCreditRequest refresh={refreshFunc} />
          </Box>
        )}
      </Box>

      <Grid xs={12}>
        <ApiPaginateSearch
          apiEnd={ApiEndpoints.CRED_REQ}
          columns={columns}
          apiData={apiData}
          tableStyle={CustomStyles}
          setApiData={setApiData}
          queryParam={query ? query : ""}
          returnRefetch={(ref) => {
            refresh = ref;
          }}
          ExpandedComponent={null}
          responses={(val) => {
            setNoOfResponses(val);
          }}
          setSumData={setSumData}
          totalCard={
            <>
              <StatusDisplay sumData={sumData} setSumData={setSumData} />
            </>
          }
        />
      </Grid>
    </Grid>
  );
};

export default CreditRequestView;

{
  /* date filter */
}
{
  /* <Box sx={{ mx: 2 }}>
          <DateRangePicker
            placement={isBig ? "leftStart" : "auto"}
            showOneCalendar
            placeholder="Date"
            size="xs"
            cleanable
            value={filterValues.dateVal}
            ranges={predefinedRanges}
            onChange={(value) => {
              const dateVal = value;
              const dates = {
                start: dateVal && dateVal[0],
                end: dateVal && dateVal[1],
              };
              setFilterValues({
                ...filterValues,
                date: {
                  start: yyyymmdd(dates.start),
                  end: yyyymmdd(dates.end),
                },
                dateVal,
              });
              if (dateVal) {
                setQuery(
                  `${prefilledQuery}&start=${yyyymmdd(
                    dateVal[0]
                  )}&end=${yyyymmdd(dateVal[1])}`
                );
              } else {
                setQuery(${prefilledQuery});
              }
            }}
            // disabledDate={afterToday()}
          />
        </Box> */
}
