import { Box, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import ApiPaginateSearch from "../component/ApiPaginateSearch";
import { ddmmyy, dateToTime } from "../utils/DateUtils";
import LaptopIcon from "@mui/icons-material/Laptop";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast } from "../utils/ToastUtil";
import { CustomStyles } from "../component/CustomStyle";
import { android2, macintosh2, windows2, linux2 } from "../iconsImports";
import AuthContext from "../store/AuthContext";
import CachedIcon from "@mui/icons-material/Cached";
import StatusDisplay from "../StatusDisplay";
import { currencySetter } from "../utils/Currencyutil";
import ExcelUploadModal from "../modals/ExcelUploadModal";
import { json2Csv, json2Excel } from "../utils/exportToExcel";
import moment from "moment";
import CommonStatus from "../component/CommonStatus";
import { capitalize1 } from "../utils/TextUtil";
import { get } from "../network/ApiController";
import FilterCard from "../modals/FilterCard";
// import { currencySetter } from "../utils/Currencyutil";
let refresh;
let handleCloseModal;
const AccountLedger = () => {
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState("");
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [request, setRequest] = useState();
  const [sumData, setSumData] = useState(false);
  const [showOldTransaction, setShowOldTransaction] = useState(false);
  const [noOfResponses, setNoOfResponses] = useState(0);
  const [isShowFilterCard, setIsShowFilterCard] = useState(false);
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
      name: "Particular",
      selector: (row) => (
        <Tooltip title={row?.operator}>
          <div style={{ textAlign: "left" }}>{capitalize1(row?.operator)}</div>
        </Tooltip>
      ),
      width: "190px",
      wrap: true,
    },
    {
      name: "Amount txn",
      selector: (row) => (
        <Tooltip title={row?.amount}>
          <div style={{ textAlign: "left" }}>{row?.amount}</div>
        </Tooltip>
      ),
    },

    {
      name: "Debit",
      selector: (row) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: "16px",
              textAlign: "justify",
              fontWeight: "500",
            }}
          >
            {row.txn_type === "DR" && (
              <div style={{ color: "red", textAlign: "left" }}>
                -{currencySetter(row.net_amount)}
              </div>
            )}
          </Box>
        );
      },

      wrap: true,
      center: false,
    },
    {
      name: "Credit",
      selector: (row) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: "16px",
              textAlign: "justify",
              fontWeight: "500",
            }}
          >
            {row.txn_type === "CR" && (
              <div style={{ color: "green", textAlign: "left" }}>
                +{currencySetter(row.net_amount)}
              </div>
            )}
          </Box>
        );
      },

      wrap: true,
      center: false,
    },
    {
      name: "Balance",
      selector: (row) => {
        return (
          <Tooltip title={row.ip}>
            {user.role === "Ad" && (
              <Typography>{currencySetter(row.ad_closing)}</Typography>
            )}
            {user.role === "Md" && (
              <Typography>{currencySetter(row.md_closing)}</Typography>
            )}

            {(user.role == "Dd" || user.role == "Ret") && (
              <>
                <Typography align="left">{currencySetter(row.w1)}</Typography>
                <Typography align="left">{currencySetter(row.w2)}</Typography>
              </>
            )}
          </Tooltip>
        );
      },
    },
    {
      name: "Status",
      selector: (row) => (
        <>
          <CommonStatus
            status={row?.status}
            approvedStatusText="Success"
            pendingStatusText="Pending"
            rejectedStatusText="Failed"
            refundStatusText="Refund"
            fontSize="11px"
            minWidth="90px"
            maxWidth="100px"
          />
        </>
      ),
      center: true,
    },
  ];

  const getExcel = () => {
    get(
      ApiEndpoints.GET_TRANSACTIONS,
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

  function refreshFunc(setQuery) {
    setQuery("");
    if (refresh) refresh();
  }

  return (
    <Box>
      <Grid container>

        <Grid item md={12} sm={12} xs={12}>
          <ApiPaginateSearch
       showSearch={false}
          
            setSumData={setSumData}
            isFilterAllowed={true}
            filterComponent={
              <Grid
                sx={{
                  mb: 1,
                }}
              >
                <FilterCard
                  ifdateFilter
                  setQuery={setQuery}
                  query={query}
                  refresh={refresh}
                  isShowFilterCard={isShowFilterCard}
                  setIsShowFilterCard={setIsShowFilterCard}
                  actionButtons={
                    <>
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
                    </>
                  }
                />
              </Grid>
            }
           
            totalCard={
              <>
                <StatusDisplay sumData={sumData} setSumData={setSumData} />
              </>
            }
            apiEnd={ApiEndpoints.GET_TRANSACTIONS}
            columns={columns}
            apiData={apiData}
            setApiData={setApiData}
            tableStyle={CustomStyles}
            queryParam={query ? `${query}&type_txn=LEDGER` : `type_txn=LEDGER`}
            returnRefetch={(ref) => {
              refresh = ref;
            }}
            responses={(val) => {
              setNoOfResponses(val);
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccountLedger;
