import { Box, Grid, IconButton, Tooltip } from "@mui/material";
import React, { useContext, useState } from "react";
import ApiPaginateSearch from "../component/ApiPaginateSearch";
import AuthContext from "../store/AuthContext";
import { CustomStyles } from "../component/CustomStyle";
import RefreshComponent from "../component/RefreshComponent";
import ApiEndpoints from "../network/ApiEndPoints";
import { ddmmyy, dateToTime } from "../utils/DateUtils";
import { useTheme } from "@mui/material/styles";
import CommonStatus from "../component/CommonStatus";
import ActiveInactiveModal from "../modals/ActiveInactiveModal";
import EditVirtualAccounts from "../component/accountLimits/EditVirtualAccounts";
import CheckResponseModal from "../modals/CheckResponseModal";
import { currencySetter } from "../utils/Currencyutil";
import FilterCard from "../modals/FilterCard";
import CachedIcon from "@mui/icons-material/Cached";
import EditVirtualTransactions from "../modals/EditVirtualTransactions";

let refresh;

const AdminVirtualAccounts = ({ value }) => {
  const theme = useTheme();
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState("");
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const role = user?.role;

  console.log("Current value:", value);

  const searchOptionsVa = [
    { field: "AC Name", parameter: "acc_name" },
    { field: "AC Number", parameter: "acc_no" },
  ];

  const virtualAccountsColumns = [
    {
      name: "Created/Updated",
      selector: (row) => (
        <>
          <div className="mb-2" style={{ textAlign: "left" }}>
            {ddmmyy(row.created_at)} {dateToTime(row.created_at)}
          </div>
          <div>
            {ddmmyy(row.updated_at)} {dateToTime(row.updated_at)}
          </div>
        </>
      ),
      width: "150px",
    },
    {
      name: "ID",
      selector: (row) => (
        <div className="blue-highlight-txt" style={{ textAlign: "left" }}>
          {row.user_id}
        </div>
      ),
      width: "100px",
    },
    {
      name: "User",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>{row.establishment}</div>
      ),
      wrap: true,
      width: "280px",
    },
    {
      name: "Virtual Account",
      cell: (row) => (
        <div style={{ textAlign: "center", color: "#473b7f" }}>{row.va}</div>
      ),
      wrap: true,
    },
    {
      name: "Allowed Accounts",
      cell: (row) => (
        <div style={{ textAlign: "left" }}>{row.allowed_accounts}</div>
      ),
      wrap: true,
      width: "300px",
    },
    {
      name: "Actions",
      selector: (row) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <ActiveInactiveModal row={row} refresh={refresh} />
          <EditVirtualAccounts
            row={row}
            refresh={refresh}
            setApiData={setApiData}
          />
        </Box>
      ),
      right: true,
    },
  ];

  const virtualTransactionsColumns = [
    {
      name: "Created/Updated",
      selector: (row) => (
        <>
          <div className="mb-2" style={{ textAlign: "left" }}>
            {ddmmyy(row.created_at)} {dateToTime(row.created_at)}
          </div>
          <div>
            {ddmmyy(row.updated_at)} {dateToTime(row.updated_at)}
          </div>
        </>
      ),
    },
    {
      name: "UTR",
      cell: (row) => (
        <div style={{ textAlign: "left", fontSize: "13px" }}>
          {row.utr_number}
        </div>
      ),
      wrap: true,
      width: "190px",
    },
    {
      name: "Account Number",
      cell: (row) => (
        <div style={{ textAlign: "left" }}>
          <div>{row.acc_number}</div>
          <div className="light-text" style={{ textAlign: "center" }}>
            {row.ifsc}
          </div>
        </div>
      ),
      width: "170px",
      wrap: true,
    },
    {
      name: "Sender Name/Info",
      cell: (row) => (
        <div style={{ textAlign: "left", fontSize: "13px" }}>
          <div>{row.sender_name}</div>
          <div className="light-text">{row.sender_info}</div>
        </div>
      ),
      wrap: true,
      width: "180px",
    },
    {
      name: "VA",
      cell: (row) => (
        <div style={{ textAlign: "center" }}>{row.va_account}</div>
      ),
      center: true,
      wrap: true,
    },
    {
      name: "Credit Date",
      cell: (row) => (
        <div style={{ textAlign: "center" }}>
          {row?.credit_date?.split(" ")[0]}
        </div>
      ),
      center: true,
      wrap: true,
    },
    {
      name: "Amount",
      cell: (row) => (
        <div style={{ textAlign: "center", fontWeight: 500, fontSize: "15px" }}>
          {currencySetter(row.amount)}
        </div>
      ),
      center: true,
      grow: 1,
      wrap: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <CommonStatus
          status={row.status}
          approvedStatusText="Success"
          pendingStatusText="Pending"
          rejectedStatusText="Failed"
          refundStatusText="Refund"
          fontSize="13px"
        />
      ),
      center: true,
      width: "110px",
    },
    {
      name: "Response",
      selector: (row) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CheckResponseModal
            row={row}
            fontSize="11px"
            width="110px"
            height="30px"
            bottomRadius="8px"
          />
        </Box>
      ),

      center: true,
    },
    {
      name: "Actions",
      selector: (row) => (
        <Box sx={{ display: "flex" }}>
          {user.id === 1 && (
            <EditVirtualTransactions row={row} refresh={refresh} />
          )}
        </Box>
      ),
      center: true,
    },
  ];

  const refreshFunc = () => {
    setQuery("");
    if (refresh) refresh();
  };

  return (
    <Grid container>
      {/* Header */}
      <Grid
        item
        md={12}
        sm={12}
        xs={12}
        sx={{
          backgroundImage: `linear-gradient(90deg, #0077c0 0%, #00aaff 100%)`,
          maxHeight: "60px",
          borderTopRightRadius: "4px",
          borderTopLeftRadius: "4px",
        }}
      ></Grid>

      {/* Refresh Button for Mobile */}
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
            pr: 1,
          }}
        >
          <RefreshComponent
            className="refresh-icon-table"
            onClick={refreshFunc}
          />
        </Grid>

        {/* Virtual Accounts */}
        {value === 3 && (
          <Grid item md={12} sm={12} xs={12}>
            <ApiPaginateSearch
              showSearch={true}
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
                    pr: 2,
                    mt: { md: 0, xs: 2, sm: 2 },
                  }}
                >
                  {/* Additional action buttons can be added here if needed */}
                </Grid>
              }
              apiEnd={ApiEndpoints.VIRTUAL_ACCS}
              setQuery={setQuery}
              columns={virtualAccountsColumns}
              apiData={apiData}
              setApiData={setApiData}
              tableStyle={CustomStyles}
              queryParam={query}
              returnRefetch={(ref) => {
                refresh = ref;
              }}
              isFilterAllowed={true}
              filterComponent={
                <FilterCard
                  showSearch={false}
                  ifUsernameFilter
                  setQuery={setQuery}
                  query={query}
                  refresh={refresh}
                  actionButtons={
                    <Tooltip title="Refresh">
                      <IconButton
                        aria-label="refresh"
                        sx={{
                          width: "30px",
                          color: "#0F52BA",
                          ml: -1,
                        }}
                        onClick={refreshFunc}
                      >
                        <CachedIcon className="refresh-purple" />
                      </IconButton>
                    </Tooltip>
                  }
                />
              }
            />
          </Grid>
        )}

        {/* Virtual Transactions */}
        {value === 4 && (
          <Grid item md={12} sm={12} xs={12}>
            <ApiPaginateSearch
              showSearch={true}
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
                    pr: 2,
                    mt: { md: 0, xs: 2, sm: 2 },
                  }}
                >
                  {/* Additional action buttons can be added here if needed */}
                </Grid>
              }
              apiEnd={ApiEndpoints.VIRTUAL_TRANSACTIONS}
              searchOptions={searchOptionsVa}
              setQuery={setQuery}
              columns={virtualTransactionsColumns}
              apiData={apiData}
              setApiData={setApiData}
              tableStyle={CustomStyles}
              queryParam={query}
              returnRefetch={(ref) => {
                refresh = ref;
              }}
              isFilterAllowed={true}
              filterComponent={
                <FilterCard
                  showSearch={false}
                  ifBeneKycStatus
                  ifSenderNameFilter
                  ifaccountNumberFilter
                  ifUtrFilter
                  ifdateFilter
                  setQuery={setQuery}
                  query={query}
                  refresh={refresh}
                  actionButtons={
                    <Tooltip title="Refresh">
                      <IconButton
                        aria-label="refresh"
                        sx={{
                          width: "30px",
                          color: "#0F52BA",
                          ml: -1,
                        }}
                        onClick={refreshFunc}
                      >
                        <CachedIcon className="refresh-purple" />
                      </IconButton>
                    </Tooltip>
                  }
                />
              }
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default AdminVirtualAccounts;
