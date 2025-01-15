import { Box, Button, Grid, IconButton, Tooltip } from "@mui/material";
import React from "react";
import ApiEndpoints from "../network/ApiEndPoints";
import CachedIcon from "@mui/icons-material/Cached";
import { useState } from "react";
import { CustomStyles } from "../component/CustomStyle";
import { datemonthYear } from "../utils/DateUtils";
import ApiPaginateSearch from "../component/ApiPaginateSearch";
import { primaryColor } from "../theme/setThemeColor";
import useCommonContext from "../store/CommonContext";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import FilterModal from "../modals/FilterModal";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";
import { USER_ROLES } from "../utils/constants";

let refresh;
function refreshFunc(setQueryParams) {
  setQueryParams(`type_txn=LEDGER`);
  if (refresh) refresh();
}
const MyLedgerView = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const role = user?.role;
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();
  const prefilledQuery = "type_txn=LEDGERR";
  const navigate = useNavigate();
  const { setChooseInitialCategoryFilter } = useCommonContext();

  const columns = [
    {
      name: "Date",
      selector: (row) => datemonthYear(row.created_at),
    },
    {
      name: "Number",
      selector: (row) => (
        <>
          {row.number}
          {/* <GetAdUserInfoByUsername row={row} /> */}
        </>
      ),
    },
    {
      name: "Platform",
      selector: (row) => row.platform,
      width: "80px",
    },
    {
      name: "EST",
      selector: (row) => row.establishment,
    },
    {
      name: "Service",
      selector: (row) => row.operator,
    },
    {
      name: "Amount",
      selector: (row) => (
        <>
          <div>{Number(row.amount).toFixed(2)}</div>
          <div>
            {row.txn_type && row.txn_type === "CR" ? "+" : "-"}
            {Number(row.net_amount).toFixed(2)}
          </div>
        </>
      ),
    },
    {
      name: "Comm/TDS",
      selector: (row) => (
        <>
          <div>
            +{Number(role === "Md" ? row.md_comm : row.ad_comm).toFixed(2)}
          </div>
          <div style={{ color: "red " }}>
            -{Number(role === "Md" ? row.md_tds : row.ad_tds).toFixed(2)}
          </div>
        </>
      ),
    },

    {
      name: "Closing",
      selector: (row) =>
        row.type === "W2W TRANSFER"
          ? Number(row.w1).toFixed(2)
          : Number(row.ad_closing).toFixed(2),
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
  ];

  const searchOptions = [
    { field: "Number", parameter: "number" },
    { field: "EST", parameter: "establishment" },
  ];

  return (
    <Box>
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
          {/* back button */}
          <Button
            size="small"
            className="otp-hover-purple"
            sx={{
              color: primaryColor(),
            }}
            onClick={() => {
              setChooseInitialCategoryFilter(false);
              if (role === USER_ROLES.AD) {
                navigate("/ad/transactions");
              } else if (role === USER_ROLES.MD) {
                navigate("/md/transactions");
              } else {
              }
            }}
          >
            <KeyboardBackspaceIcon fontSize="small" /> Back
          </Button>
          {/* refresh */}
          <div className="mx-3">
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
          </div>
          {/* filter modal */}
          <FilterModal
            ifnumberFilter
            ifestFilter
            setQuery={setQuery}
            query={query}
            clearHookCb={(cb) => {
              refresh = cb;
            }}
            refresh={refresh}
          />
        </Grid>
      </Grid>
      <div>
        <ApiPaginateSearch
          actionButtons={
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
          }
          backButton={
            <Button
              size="small"
              className="otp-hover-purple mb-2"
              sx={{
                color: primaryColor(),
              }}
              onClick={() => {
                setChooseInitialCategoryFilter(false);
                if (role === USER_ROLES.AD) {
                  navigate("/ad/transactions");
                } else if (role === USER_ROLES.MD) {
                  navigate("/md/transactions");
                } else {
                }
              }}
            >
              <KeyboardBackspaceIcon fontSize="small" /> Back
            </Button>
          }
          apiEnd={ApiEndpoints.GET_TRANSACTIONS}
          prefilledQuery={prefilledQuery}
          searchOptions={searchOptions}
          setQuery={setQuery}
          columns={columns}
          apiData={apiData}
          setApiData={setApiData}
          tableStyle={CustomStyles}
          ExpandedComponent={false}
          queryParam={query ? query : ""}
          returnRefetch={(ref) => {
            refresh = ref;
          }}
        />
        {/* <ApiPaginate
          apiEnd={ApiEndpoints.GET_TRANSACTIONS}
          columns={columns}
          apiData={apiData}
          tableStyle={CustomStyles}
          setApiData={setApiData}
          ExpandedComponent=""
          queryParam={query ? query : ""}
          returnRefetch={(ref) => {
            refresh = ref;
          }}
        /> */}
      </div>
    </Box>
  );
};

export default MyLedgerView;
