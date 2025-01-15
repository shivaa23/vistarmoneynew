import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  TextField,
  Container,
  Tooltip,
  MenuItem,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CachedIcon from "@mui/icons-material/Cached";
import ApiPaginate from "../component/ApiPaginate";
import ApiEndpoints from "../network/ApiEndPoints";
import { CustomStyles } from "../component/CustomStyle";
import { datemonthYear1, yyyymmdd } from "../utils/DateUtils";
import { DateRangePicker } from "rsuite";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";
import DeleteTxnBank from "../modals/DeleteTxnBank";
import { get, postJsonData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { currencySetter } from "../utils/Currencyutil";
import ExcelUploadModal from "../modals/ExcelUploadModal";
import { json2Csv, json2Excel } from "../utils/exportToExcel";
import moment from "moment";
import { primaryColor } from "../theme/setThemeColor";
import Loader from "../component/loading-screen/Loader";
import predefinedRanges from "../utils/predefinedRanges";
import { capitalize1 } from "../utils/TextUtil";
import CommonStatus from "../component/CommonStatus";
import ExcelToJsonUploader from "./ExcelToJsonUploader";

let handleCloseModal;
const AdminBankStatementView = () => {
  const { afterToday } = DateRangePicker;
  const location = useLocation();
  const bankId = location.state.bank_id;
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [apiData, setApiData] = useState([]);
  const [request, setRequest] = useState(false);
  const [excelrequest, setExcelRequest] = useState(false);
  const [query, setQuery] = useState(`bank_id=${bankId}`);
  const old_balance = location.state.balance;
  const [balance, setBalance] = useState(old_balance);
  const [filterValues, setFilterValues] = useState({ date: {}, dateVal: "" });
  const [noOfResponses, setNoOfResponses] = useState(0);
  const [mopVal, setMopVal] = useState("");

  const navigate = useNavigate();
  const mop = [];
  let refresh;
  function refreshFunc(setQueryParams) {
    setQueryParams(`bank_id=${bankId}`);
    setFilterValues({ ...filterValues, date: {}, dateVal: "" });
    if (refresh) refresh();
  }
  const handleAddTxn = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      bankid: bankId,
      description: form.desc.value,
      credit: form.credit.value === "" ? "0" : form.credit.value,
      debit: form.debit.value === "" ? "0" : form.debit.value,
      remark: form.remarks.value,
      mop: mopVal,
    };
    postJsonData(
      ApiEndpoints.ADD_BANK_TXN,
      data,
      setRequest,
      (res) => {
        okSuccessToast("transaction Added Successfully");
        setBalance(res.data.balance);
        document.getElementById("desc").value = "";
        document.getElementById("remarks").value = "";
        document.getElementById("debit").value = "";
        document.getElementById("credit").value = "";
        document.getElementById("credit").removeAttribute("disabled", "");
        document.getElementById("debit").removeAttribute("disabled", "");
        document.getElementById("mop").value = "";
        setMopVal(""); // Reset the MOP TextField value
        if (refresh) refresh();
      },
      (error) => {
        apiErrorToast(error);
        document.getElementById("addtxn").value = "";
      }
    );
  };
  const columns = [
    {
      name: "ID",
      selector: (row) => <span className="blue-highlight-txt">{row.id}</span>,
      width: "65px",
    },

    {
      name: (
        <div style={{ marginLeft: "1px" }}>
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
                `bank_id=${bankId}&start=${yyyymmdd(
                  dates.start
                )}&end=${yyyymmdd(dates.end)}`
              );
            }}
            disabledDate={afterToday()}
          />
        </div>
      ),
      selector: (row) => datemonthYear1(row.created_at),
      grow: 1,
    },
    {
      name: "Deposit Date",
      selector: (row) => (
        <span className="blue-highlight-txt">{row.date || "NA"}</span>
      ),
      width: "100px",
    },
    {
      name: "By",
      selector: (row) => (
        <div style={{ fontSize: "13px", textAlign: "left" }}>
          {row.enteredby}
        </div>
      ),
      wrap: true,
      width: "100px",
    },
    {
      name: (
        <>
          Description
          <div>
            {/* Implement your search field here */}
            <FormControl sx={{ width: "100%" }}>
              <TextField
                autoComplete="off"
                // select
                label="Search"
                id="status"
                sx={{
                  bgcolor: "white",
                  mx: 1,
                  borderRadius: 1,
                }}
                size="small"
                // required
                onChange={(e) => setQuery("search={e}")}
                defaultValue={""}
              ></TextField>
            </FormControl>
          </div>
        </>
      ),
      selector: (row) => (
        <>
          <div
            className="break-words"
            style={{
              // overflow: "hidden",
              display: "flex",
              justifyContent: "flex-start",
              textAlign: "left",
              fontSize: "13px",
            }}
          >
            {row.description}
          </div>
        </>
      ),
      width: "310px",
      wrap: true,
    },
    {
      name: <span className="ms-1">Remark</span>,
      selector: (row) => (
        <div
          className="break-words"
          style={{
            // overflow: "hidden",
            display: "flex",
            justifyContent: "flex-start",
            textAlign: "left",
            fontSize: "13px",
          }}
        >
          {capitalize1(row.remarks)}
        </div>
      ),
      width: "180px",
      wrap: true,
    },
    {
      name: <span className="ms-1">MOP</span>,
      selector: (row) => <div className="blue-highlight-txt">{row.mop}</div>,
      center: false,
    },
    {
      name: <span className="ms-1">Debit</span>,
      selector: (row) => (
        <span style={{ color: "#e01a1a" }}>{currencySetter(row.debit)}</span>
      ),

      center: false,
      grow: 1,
    },
    {
      name: <span className="ms-1">Credit</span>,
      selector: (row) => (
        <span style={{ color: "#02B062" }}>{currencySetter(row.credit)}</span>
      ),
      center: false,
      grow: 1,
    },
    {
      name: <span className="ms-1">Balance</span>,
      selector: (row) => currencySetter(row.balance),
      grow: 1,
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
              status={row.status == 0 ? 1 : 2}
              approvedStatusText="CLAIMED"
              pendingStatusText="UNCLAIMED"
              fontSize="12px"
              maxWidth="120px"
              minWidth="100px"
            />
          </Box>
        );
      },
      wrap: true,
    },
    // {
    //   name: "Status",
    //   selector: (row) =>
    //     row.status === 0 ? (
    //       <div className="status-design-active">SUCCESS</div>
    //     ) : (
    //       <div className="status-design-pending">PENDING</div>
    //     ),
    // },
  ];

  const getExcel = () => {
    get(
      ApiEndpoints.GET_BANK_STATEMENT,
      `${
        query
          ? query + `&page=1&paginate=10&export=1`
          : `page=1&paginate=10&export=1`
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
          `Bank Statement ${moment(new Date().toJSON()).format(
            "Do MMM YYYY"
          )} | ${moment(new Date().toJSON()).format("hh:mm a")}`,
          JSON.parse(JSON.stringify(newApiData && newApiData))
        );
        handleCloseModal();
      },
      (err) => {
        apiErrorToast(err);
        handleCloseModal();
      }
    );
  };

  const getCsv = () => {
    get(
      ApiEndpoints.GET_BANK_STATEMENT,
      `${
        query
          ? query + `&page=1&paginate=10&export=1`
          : `page=1&paginate=10&export=1`
      }`,
      setExcelRequest,
      (res) => {
        const apiData = res.data.data;
        const newApiData = apiData.map((item) => {
          const created_at = moment(item.created_at).format("DD-MM-YYYY");
          const time_updated_at = moment(item.updated_at).format("LTS");
          return { ...item, created_at, time_updated_at };
        });
        json2Csv(
          `Bank Statement ${moment(new Date().toJSON()).format(
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
  const handleDownload = () => {
    // Assuming the sample file is located in the public folder
    const link = document.createElement("a");
    link.href = `${process.env.PUBLIC_URL}/uplodeexcel2.xlsx`; // Path to your sample file
    link.download = "uplodeexcel2.xlsx"; // Suggested file name for download
    link.click();
  };

  return (
    <Grid Container sx={{ pr: 1 }}>
      <Box
        component="form"
        id="addtxn"
        validate="true"
        autoComplete="off"
        onSubmit={handleAddTxn}
        sx={{
          "& .MuiTextField-root": { m: 1 },
          objectFit: "contain",
          overflowY: "scroll",
        }}
        className="position-relative"
      >
        <Loader loading={request} />
        <Grid container sx={{ pt: 1 }} alignItems="center">
          <Grid item md={2} xs={3}>
            <FormControl fullWidth>
              <TextField
                autoComplete="off"
                label="Description"
                id="desc"
                size="small"
                required
              />
            </FormControl>
          </Grid>
          <Grid item md={2} xs={3}>
            <FormControl fullWidth>
              <TextField
                autoComplete="off"
                label="Remarks"
                id="remarks"
                size="small"
                required
              />
            </FormControl>
          </Grid>
          <Grid item md={2} xs={3}>
            <FormControl fullWidth>
              <TextField
                autoComplete="off"
                select
                required
                size="small"
                label="MOP"
                id="mop"
                value={mopVal}
                onChange={(e) => setMopVal(e.target.value)}
              >
                <MenuItem dense value="CASH">
                  Cash Deposit
                </MenuItem>
                <MenuItem dense value="CASH-CDM">
                  CDM Deposit
                </MenuItem>
                <MenuItem dense value="CASH-KIOSK">
                  KIOSK Deposit
                </MenuItem>
                <MenuItem dense value="IMPS">
                  IMPS
                </MenuItem>
                <MenuItem dense value="NEFT">
                  NEFT
                </MenuItem>
                <MenuItem dense value="RTGS">
                  RTGS
                </MenuItem>
                <MenuItem dense value="FT">
                  Fund Transfer
                </MenuItem>
                <MenuItem dense value="UPI">
                  UPI Transfer
                </MenuItem>
                <MenuItem dense value="GST">
                  GST
                </MenuItem>
                <MenuItem dense value="CHARGE">
                  Charge
                </MenuItem>
              </TextField>
            </FormControl>
          </Grid>
          <Grid item md={1.5} xs={3}>
            <FormControl fullWidth>
              <TextField
                autoComplete="off"
                label="Debit"
                id="debit"
                size="small"
                required
                type="number"
                inputProps={{ step: "any" }}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value.length === 0) {
                    setBalance(old_balance);
                    document
                      .getElementById("credit")
                      .removeAttribute("disabled");
                  } else if (parseFloat(value) > 0) {
                    document
                      .getElementById("credit")
                      .setAttribute("disabled", "");
                    setBalance(parseFloat(old_balance) - parseFloat(value));
                  } else if (parseFloat(value) === 0) {
                    document
                      .getElementById("credit")
                      .removeAttribute("disabled");
                  }
                }}
              />
            </FormControl>
          </Grid>
          <Grid item md={1.5} xs={3}>
            <FormControl fullWidth>
              <TextField
                autoComplete="off"
                label="Credit"
                id="credit"
                size="small"
                required
                type="number"
                inputProps={{ step: "any" }}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value.length === 0) {
                    setBalance(old_balance);
                    document
                      .getElementById("debit")
                      .removeAttribute("disabled");
                  } else if (parseFloat(value) > 0) {
                    document
                      .getElementById("debit")
                      .setAttribute("disabled", "");
                    setBalance(parseFloat(old_balance) + parseFloat(value));
                  } else if (parseFloat(value) === 0) {
                    document
                      .getElementById("debit")
                      .removeAttribute("disabled");
                  }
                }}
              />
            </FormControl>
          </Grid>
          <Grid item md={1.5} xs={3}>
            <FormControl fullWidth>
              <TextField
                autoComplete="off"
                label="Balance"
                id="balance"
                size="small"
                required
                disabled
                value={balance && currencySetter(balance)}
              />
            </FormControl>
          </Grid>
          <Grid item md={1.5} xs={2}>
            <FormControl fullWidth>
              <Button
                className="button-purple"
                form="addtxn"
                type="submit"
                disabled={request}
                sx={{ mt: 0 }}
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
          mt: 2,
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
          <Button
            size="small"
            className="otp-hover-purple mb-2"
            sx={{
              color: primaryColor(),
              pr: 1,
            }}
            onClick={handleDownload}
          >
            Sample File
          </Button>
          <ExcelToJsonUploader
            bankId={bankId}
            refresh={refreshFunc}
            setQuery={setQuery}
            setRequest={setRequest}
          />

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
              defaultQuery={"bank_id"}
              queryValue={bankId && bankId}
              handleCloseCB={(closeModal) => {
                handleCloseModal = closeModal;
              }}
            />
          </Tooltip>
          <Tooltip title="refresh">
            <IconButton
              aria-label="refresh"
              color="success"
              onClick={() => refreshFunc(setQuery)}
            >
              <CachedIcon className="refresh-purple" />
            </IconButton>
          </Tooltip>
          {(user?.role === "SAdmin" || user?.id === 1) && (
            <Tooltip title="delete">
              <DeleteTxnBank
                refresh={() => refresh && refresh()}
                setBalance={setBalance}
              />
            </Tooltip>
          )}
        </Box>
      </Box>

      <div>
        <ApiPaginate
          apiEnd={ApiEndpoints.GET_BANK_STATEMENT}
          columns={columns}
          apiData={apiData}
          tableStyle={CustomStyles}
          setApiData={setApiData}
          ExpandedComponent=""
          queryParam={query || ""}
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

export default AdminBankStatementView;
