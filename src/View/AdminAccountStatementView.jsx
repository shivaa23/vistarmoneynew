/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useRef } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CachedIcon from "@mui/icons-material/Cached";
import ApiPaginate from "../component/ApiPaginate";
import ApiEndpoints from "../network/ApiEndPoints";
import { CustomStyles } from "../component/CustomStyle";
import { datemonthYear, yyyymmdd } from "../utils/DateUtils";
import { DateRangePicker } from "rsuite";
import AuthContext from "../store/AuthContext";
import { useContext } from "react";
import DeleteTxnAccount from "../modals/DeleteTxnAccount";
import { useEffect } from "react";
import { get, postJsonData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import Loader from "../component/loading-screen/Loader";
import { currencySetter } from "../utils/Currencyutil";
import { json2Csv, json2Excel } from "../utils/exportToExcel";
import ExcelUploadModal from "../modals/ExcelUploadModal";
import moment from "moment";
import { primaryColor } from "../theme/setThemeColor";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import predefinedRanges from "../utils/predefinedRanges";

// const useStyles = makeStyles({
//   paper: {
//     overflowY: "scroll",
//     width: "700px",
//     height: "400px",
//   },
// });

let handleCloseModal;
const AdminAccountStatementView = () => {
  // const classes = useStyles();
  const { afterToday } = DateRangePicker;
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const location = useLocation();
  const mobile = location.state.mobile;
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState(`mobile=${mobile}`);
  const [defaultTxn, setDefaultTxn] = useState("credit");
  const bal = location.state.bal;
  const [debit, setDebit] = useState("");
  const [credit, setCredit] = useState("");
  const [bank, setBank] = useState("");
  const [desc, setDesc] = useState("");
  const [bankid, setBankid] = useState("");
  const [balance, setBalance] = useState("");
  const [request, setRequest] = useState(false);
  const [excelrequest, setExcelRequest] = useState(false);
  const [defaultRemark, setDefaultRemark] = useState("");

  const [pendingTxnList, setPendingTxnList] = useState([]);
  const [filterValues, setFilterValues] = useState({ date: {}, dateVal: null });
  // console.log("filterValues", filterValues);
  const [noOfResponses, setNoOfResponses] = useState(0);
  const inputComponent = useRef();
  const navigate = useNavigate();

  const getPendingTxnList = () => {
    get(
      ApiEndpoints.GET_PENDING_ACCOUNT_TRANSACTION,
      "",
      "",
      (res) => {
        if (res && res.data) {
          setPendingTxnList(res.data.data);
          // console.log(res.data.data);
        } else setPendingTxnList();
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };
  const getAccountBalance = () => {
    const data = {
      mobile: mobile && mobile,
    };
    postJsonData(
      ApiEndpoints.ACCOUNT_BALANCE,
      data,
      null,
      (res) => {
        setBalance(res?.data?.message);
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };
  // console.log("bal", balance);
  const handleChangeTxn = () => {
    if (
      defaultTxn !== "credit" &&
      defaultTxn !== "value" &&
      defaultTxn !== "cash"
    ) {
      setDebit(defaultTxn.debit);
      setCredit(defaultTxn.credit);
      setBank(defaultTxn.bank);
      setDesc(defaultTxn.description);
      setBankid(defaultTxn.id);
      setBalance(bal - credit + debit);
      setDefaultRemark(defaultTxn.description);
    } else if (
      defaultTxn === "credit" ||
      defaultTxn === "value" ||
      defaultTxn === "cash"
    ) {
      setDebit(0);
      setCredit(0);
      setBank(defaultTxn);
      setDesc("");
      setBalance(bal && bal);
      setBankid("");
      setDefaultRemark("");
    }
  };
  useEffect(() => {
    getAccountBalance();
    getPendingTxnList();
  }, []);

  useEffect(() => {
    handleChangeTxn();
  }, [defaultTxn]);

  let refresh;
  function refreshFunc(setQueryParams) {
    getPendingTxnList();
    setQueryParams(`mobile=${mobile}`);
    setFilterValues({ ...filterValues, date: {}, dateVal: "" });
    setDefaultRemark("");
    if (refresh) refresh();
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      user_id: mobile,
      particulars:
        defaultTxn === "credit"
          ? "credit"
          : defaultTxn === "value"
          ? "value"
          : desc,
      given: form.given.value,
      taken: form.taken.value,
      bank_txn_id:
        defaultTxn === "credit"
          ? "credit"
          : defaultTxn === "value"
          ? "value"
          : bankid,
      bank_name: bank,
      remark: form.remarks.value,
    };
    postJsonData(
      ApiEndpoints.ADD_ACCOUNT_TXN,
      data,
      setRequest,
      (res) => {
        okSuccessToast("Transaction Added Successfully");
        setDefaultTxn("credit");
        setDebit("0");
        setCredit("0");
        setBank("");
        setDesc("");
        setBalance(res.data.balance);
        setBankid("");
        setDefaultRemark("");
        getPendingTxnList();
        if (refresh) refresh();
        document.getElementById("taken").removeAttribute("disabled", "");
        document.getElementById("given").removeAttribute("disabled", "");
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => <div className="blue-highlight-txt">{row.id}</div>,
      grow: 0.2,
    },
    {
      name: (
        <div>
          <DateRangePicker
            showOneCalendar
            placeholder="Date"
            size="xs"
            cleanable
            ranges={predefinedRanges}
            value={filterValues.dateVal}
            onChange={(value) => {
              const dateVal = value;
              const dates = {
                start: dateVal[0],
                end: dateVal[1],
              };
              setFilterValues({
                ...filterValues,
                date: {
                  start: yyyymmdd(dates.start),
                  end: yyyymmdd(dates.end),
                },
                dateVal,
              });
              setQuery(
                `mobile=${mobile}&start=${yyyymmdd(dates.start)}&end=${yyyymmdd(
                  dates.end
                )}`
              );
            }}
            disabledDate={afterToday()}
          />
        </div>
      ),
      selector: (row) => datemonthYear(row.created_at),
      grow: 1,
    },
    {
      name: "By",
      selector: (row) => row.enteredby,
    },
    {
      name: "Particulars",
      cell: (row) => (
        <span
          style={{
            paddingLeft: "6px",
          }}
        >
          {row.particulars}
        </span>
      ),
    },
    {
      name: "Remarks",
      selector: (row) => (
        <div
          className="break-words"
          style={{
            // overflow: "hidden",
            display: "flex",
            justifyContent: "flex-start",
            textAlign: "left",
            fontSize: "14px",
          }}
        >
          {row.remarks}
        </div>
      ),
      width: "180px",
      wrap: true,
      // grow: 3,
      center: false,
    },
    {
      name: "Bank Name",
      selector: (row) => row.bank,
      grow: 1.2,
      wrap: true,
    },
    {
      name: "Given",
      selector: (row) => currencySetter(row.given),
    },
    {
      name: "Taken",
      selector: (row) => currencySetter(row.taken),
    },
    {
      name: "Balance",
      selector: (row) => currencySetter(row.balance),
    },
  ];

  const getExcel = () => {
    get(
      ApiEndpoints.GET_ACCOUNT_STATEMENT,
      `${
        query
          ? query + "&page=1&paginate=10&export=1"
          : "&page=1&paginate=10&export=1"
      }`,
      setExcelRequest,
      (res) => {
        const apiData = res.data.data;
        const newApiData = apiData.map((item) => {
          const created_at = moment(item.created_at).utc().format("DD-MM-YYYY");
          const updated_at = moment(item.updated_at).utc().format("DD-MM-YYYY");
          return { ...item, created_at, updated_at };
        });
        json2Excel(
          `Account Statement ${moment(new Date().toJSON()).format(
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
      ApiEndpoints.GET_ACCOUNT_STATEMENT,
      `${
        query
          ? query + "&page=1&paginate=10&export=1"
          : "&page=1&paginate=10&export=1"
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
          `Account Statement ${moment(new Date().toJSON()).format(
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

  return (
    <Grid Container sx={{ pr: 1 }}>
      <Box
        component="form"
        id="addtxn"
        validate="true"
        autoComplete="off"
        onSubmit={handleSubmit}
        sx={{
          mr: 1,
          "& .MuiTextField-root": { m: 1 },
          objectFit: "contain",
          overflowY: "scroll",
        }}
      >
        <Grid container sx={{ pt: 1 }}>
          <Loader loading={request} circleBlue />
          <Grid
            item
            md={2}
            xs={3}
            sx={{ display: "flex", alignItems: "center" }}
          >
            {/* <TransactionSearch
              pendingTxnList={pendingTxnList}
              defaultTxn={defaultTxn}
              setDefaultTxn={setDefaultTxn}
            /> */}
            <FormControl
              sx={{ width: "100%" }}
              className="input-font-size custom-select"
            >
              <InputLabel id="txn">Select Transaction</InputLabel>

              <Select
                ref={inputComponent}
                label="Select Transaction"
                size="small"
                id="txn"
                required
                select
                value={defaultTxn && defaultTxn}
                onChange={(e) => {
                  setDefaultTxn(e.target.value);
                }}
                sx={{
                  color: "#000",
                  textAlign: "left",
                }}
                MenuProps={{
                  disableScrollLock: true,
                  variant: "menu",
                  PaperProps: {
                    sx: {
                      width: "700px",
                      overflowX: "scroll",
                      maxHeight: 500,
                      left: `${
                        inputComponent.current
                          ? inputComponent.current.getBoundingClientRect().left
                          : 0
                      }px !important`,
                    },
                  },
                }}
              >
                <MenuItem
                  value="credit"
                  sx={{
                    fontSize: "12px",
                    textTransform: "capitalize",
                  }}
                >
                  credit
                </MenuItem>
                <MenuItem
                  value="value"
                  sx={{ fontSize: "12px", textTransform: "capitalize" }}
                >
                  value
                </MenuItem>
                {pendingTxnList &&
                  pendingTxnList.map((item, index) => {
                    return (
                      <MenuItem
                        key={index}
                        value={item}
                        sx={{
                          fontSize: "10px",
                          "&:hover": {
                            backgroundColor: "rgb(202, 202, 202)",
                          },
                        }}
                      > 
                    <Typography>
                        id={ item.id }:    
                        </Typography> 
                        <Typography sx={{fontSize:"12px"}}>
                        {item.created_at +
                          "/" +
                          item.id +
                          "/   " +
                          item.description +
                          "/" +
                          (item.credit <= 0 ? item.debit : item.credit)}
                          </Typography>
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item md={2.5} xs={3}>
            <FormControl sx={{ width: "100%" }} className="input-font-size">
              <TextField
                autoComplete="off"
                label="Remarks"
                id="remarks"
                size="small"
                value={defaultRemark && defaultRemark}
                onChange={(e) => setDefaultRemark(e.target.value)}
                required
              />
            </FormControl>
          </Grid>

          <Grid item md={1.5} xs={3}>
            <FormControl sx={{ width: "100%" }} className="input-font-size">
              <TextField
                autoComplete="off"
                label="Given"
                id="given"
                size="small"
                value={debit && debit}
                // disabled={!(debit && debit > 0)}
                onChange={(e) => {
                  setDebit(e.target.value);
                  if (e.target.value.length > 0) {
                    document
                      .getElementById("taken")
                      .setAttribute("disabled", "");
                    const calculatedBal = Number(bal) + Number(e.target.value);
                    setBalance(calculatedBal);
                  }
                  if (e.target.value.length === 0 || e.target.value === "0") {
                    document
                      .getElementById("taken")
                      .removeAttribute("disabled", "");
                    const calculatedBal = Number(bal) + Number(e.target.value);
                    setBalance(calculatedBal);
                  }
                }}
                disabled={
                  !(
                    defaultTxn === "credit" ||
                    defaultTxn === "value" ||
                    defaultTxn === "cash"
                  )
                }
                required
                onKeyDown={(e) => {
                  if (e.key === "+" || e.key === "-") {
                    e.preventDefault();
                  }
                }}
                type="number"
                inputProps={{
                  step: "any",
                }}
              />
            </FormControl>
          </Grid>
          <Grid item md={1.5} xs={3}>
            <FormControl sx={{ width: "100%" }} className="input-font-size">
              <TextField
                autoComplete="off"
                label="Taken"
                id="taken"
                size="small"
                type="number"
                inputProps={{
                  step: "any",
                }}
                value={credit && credit}
                onChange={(e) => {
                  setCredit(e.target.value);
                  if (e.target.value.length > 0) {
                    document
                      .getElementById("given")
                      .setAttribute("disabled", "");
                    const calculatedBal = Number(bal) - Number(e.target.value);
                    setBalance(calculatedBal);
                  }
                  if (e.target.value.length === 0 || e.target.value === "0") {
                    document
                      .getElementById("given")
                      .removeAttribute("disabled", "");
                    const calculatedBal = Number(bal) + Number(e.target.value);
                    setBalance(calculatedBal);
                  }
                }}
                disabled={
                  !(
                    defaultTxn === "credit" ||
                    defaultTxn === "value" ||
                    defaultTxn === "cash"
                  )
                }
                required
                onKeyDown={(e) => {
                  if (e.key === "+" || e.key === "-") {
                    e.preventDefault();
                  }
                }}
              />
            </FormControl>
          </Grid>
          <Grid item md={1.5} xs={3}>
            <FormControl sx={{ width: "100%" }} className="input-font-size">
              <TextField
                autoComplete="off"
                label="Bank"
                id="bank"
                size="small"
                value={bank}
                // onChange={(e) => setBank(e.target.value)}
                required
                disabled
              />
            </FormControl>
          </Grid>
          <Grid item md={1.5} xs={3}>
            <FormControl sx={{ width: "100%" }} className="input-font-size">
              <TextField
                autoComplete="off"
                label="Balance"
                id="balance"
                value={balance && balance}
                size="small"
                required
                disabled
              />
            </FormControl>
          </Grid>
          <Grid item md={1.5} xs={2}>
            <FormControl sx={{ width: "80%", mt: 1 }}>
              <Button
                className="button-purple "
                form="addtxn"
                type="submit"
                disabled={request}
              >
                ADD
              </Button>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          size="small"
          className="otp-hover-purple mb-2"
          sx={{
            color: primaryColor(),
            pr: 1,
          }}
          onClick={() => {
            navigate("/admin/banking");
          }}
        >
          <KeyboardBackspaceIcon fontSize="small" /> Back
        </Button>
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Tooltip title="export">
            <ExcelUploadModal
              btn
              twobuttons="Download Csv"
              dateFilter
              request={excelrequest}
              getExcel={getExcel}
              getCsv={getCsv}
              filterValues={filterValues}
              setFilterValues={setFilterValues}
              noOfResponses={noOfResponses}
              setQuery={setQuery}
              defaultQuery={"mobile"}
              queryValue={mobile && mobile}
              handleCloseCB={(closeModal) => {
                handleCloseModal = closeModal;
              }}
            />
          </Tooltip>
          <Tooltip title="refresh">
            <IconButton
              aria-label="refresh"
              color="success"
              onClick={() => {
                refreshFunc(setQuery);
              }}
            >
              <CachedIcon className="refresh-purple" />
            </IconButton>
          </Tooltip>
          {(user?.role === "SAdmin" || user?.id === 1) && (
            <Tooltip title="delete">
              <DeleteTxnAccount
                getPendingTxnList={getPendingTxnList}
                refetch={() => {
                  if (refresh) refresh();
                }}
                setBalance={setBalance}
              />
            </Tooltip>
          )}
          {/* {user.id === 5753|| user.role==="SAdmin" && (
            <Tooltip title="delete">
              <DeleteTxnAccount
                getPendingTxnList={getPendingTxnList}
                refetch={() => {
                  if (refresh) refresh();
                }}
                setBalance={setBalance}
              />
            </Tooltip>
          )} */}
        </Box>
      </Box>

      <div>
        <ApiPaginate
          apiEnd={ApiEndpoints.GET_ACCOUNT_STATEMENT}
          columns={columns}
          apiData={apiData}
          tableStyle={CustomStyles}
          setApiData={setApiData}
          ExpandedComponent=""
          queryParam={query ? query : ""}
          returnRefetch={(ref) => {
            refresh = ref;
          }}
          responses={(val) => {
            setNoOfResponses(val);
          }}
        />
      </div>
    </Grid>
  );
};

export default AdminAccountStatementView;
