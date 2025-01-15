import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Typography,
  Tooltip,
  Container,
  IconButton,
  Button,
} from "@mui/material";
import React, { useEffect } from "react";
import ApiPaginateSearch from "../component/ApiPaginateSearch";
import { useState } from "react";
import { CustomStyles } from "../component/CustomStyle";
import ApiEndpoints from "../network/ApiEndPoints";
import { ddmmyy, dateToTime1 } from "../utils/DateUtils";
import IssueHandlerModal from "../modals/IssueHandlerModal";
import CommonStatus from "../component/CommonStatus";
import CachedIcon from "@mui/icons-material/Cached";
import { capitalize1 } from "../utils/TextUtil";
import { currencySetter } from "../utils/Currencyutil";
import FilterCard from "../modals/FilterCard";

let refresh;
let refreshFilter;

function refreshFunc(setQuery) {
  setQuery(`status=OPEN`);
  if (refresh) refresh();
}

const ComplaintsView = () => {
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();

  useEffect(() => {
    if (!query) setQuery("status=OPEN");
    return () => {};
  }, [query]);

  const columns = [
    {
      name: "Date",
      selector: (row) => (
        <>
          <div className="mb-1">
            {ddmmyy(row.created_at)} {dateToTime1(row.created_at)}
          </div>
          <div>
            {ddmmyy(row.updated_at)} {dateToTime1(row.updated_at)}
          </div>
        </>
      ),
    },
    {
      name: "Est",
      selector: (row) => (
        <Tooltip title={row.establishment}>
          <div style={{ textAlign: "left", fontSize: "13px" }}>
            {capitalize1(row.establishment)}
          </div>
        </Tooltip>
      ),

      wrap: true,
    },
    {
      name: "Operator/Route",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: "13px", marginBottom: "5px" }}>
            {row.operator}
          </div>
          <div
            style={{ fontSize: "10px", fontWeight: "500", color: "#535353" }}
          >
            {row.route}
          </div>
        </div>
      ),
      center: false,
      width: "130px",
      wrap: true,
    },
    {
      name: "Number",
      selector: (row) => row.number,
    },
    {
      name: "Amount",
      selector: (row) => currencySetter(row.amount),
    },
    // {
    //   name: "Txn Date",
    //   selector: (row) =>
    //     row.txn_date && datemonthYear(row.txn_date)
    //       ? row.txn_date && datemonthYear(row.txn_date)
    //       : "13/14/2025",
    //   width: "85px",
    // },
    {
      name: "Txn ID / Txn Date",
      selector: (row) => (
        <Box sx={{ cursor: "pointer" }}>
          <div style={{ textAlign: "left", marginBottom: "5px" }}>
            {row.txnId}
          </div>
          <Tooltip title="Txn Date">
            <div className="light-text" style={{ textAlign: "left" }}>
              {row.txn_date ? row.txn_date : "NA"}
            </div>
          </Tooltip>
        </Box>
      ),
      width: "150px",
    },

    {
      name: "Message",
      cell: (row) => (
        <div style={{ textAlign: "justify", fontSize: "12px" }}>
          {capitalize1(row.msg)}
        </div>
      ),

      wrap: true,
      width: "185px",
    },
    {
      name: "Handler",
      cell: (row) => (
        <div className="blue-highlight-txt" style={{ textAlign: "left" }}>
          <Tooltip title={row.handler ? row.handler : "NA"}>
            <Typography variant="div" className="light-text">
              {row.handler ? row.handler : "NA"}
            </Typography>
          </Tooltip>
        </div>
      ),

      wrap: true,
    },

    {
      name: "Remark",
      selector: (row) => (
        <div style={{ textAlign: "left", fontSize: "12px" }}>
          {row.remark ? row.remark : "NA"}
        </div>
      ),
      wrap: true,
      width: "120px",
    },
    {
      name: "Txn Status",
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
              status={row.txn_status}
              approvedStatusText="SUCCESS"
              pendingStatusText="PENDING"
              rejectedStatusText="FAILED"
              refundStatusText="REFUND"
              fontSize="12px"
            />
          </Box>
        );
      },
      wrap: true,
      width: "100px",
    },
    {
      name: "C Status",
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
              status={row.status}
              approvedStatusText="OPEN"
              rejectedStatusText="CLOSED"
              fontSize="12px"
            />
          </Box>
        );
      },
      wrap: true,
      width: "70px",
    },

    // <FormControl className="customized-textfield" fullWidth>
    //   <TextField autoComplete="off"
    //     select
    //     value={defaultStatus && defaultStatus}
    //     onChange={(event) => {
    //       handleChangeStatus(event);
    //     }}
    //     sx={{ color: "#fff" }}
    //   >
    //     <MenuItem dense value="OPEN">
    //       OPEN
    //     </MenuItem>
    //     <MenuItem dense value="CLOSED">
    //       CLOSED
    //     </MenuItem>
    //   </TextField>
    // </FormControl>

    {
      name: "Action",
      selector: (row) => <IssueHandlerModal row={row} refresh={refresh} />,
      width: "60px",
    },
  ];

  return (
    <>
      <Grid container>
      

        <Grid xs={12}>
          <ApiPaginateSearch
            // showSearch={true}
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
                {/* {/* <RefreshComponent
                  className="refresh-icon-table"
                  onClick={() => {
                    refresh();
                  }}
                /> */}
              </Grid>
            }
            apiEnd={ApiEndpoints.COMPLAINTS}
            setQuery={setQuery}
            columns={columns}
            apiData={apiData}
            setApiData={setApiData}
            tableStyle={CustomStyles}
            queryParam={query ? query : ""}
            returnRefetch={(ref) => {
              refresh = ref;
            }}
            isFilterAllowed={true}
            filterComponent={
              <FilterCard
                topMargin={-1}
                bottomMargin={-1}
                showSearch={false}
                ifComplaintStatus
                setQuery={setQuery}
                query={query}
                clearHookCb={(cb) => {
                  refreshFilter = cb;
                }}
                refresh={refresh}
                actionButtons={
                  <>
                    <Box sx={{ justifyContent: "end" }}>
                      <Tooltip title="refresh">
                        <IconButton
                          aria-label="refresh"
                          // color="success"
                          sx={{
                            color: "#0F52BA",
                            ml: -2,
                          }}
                          onClick={() => {
                            refreshFunc(setQuery);
                          }}
                        >
                          <CachedIcon className="refresh-purple" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </>
                }
              />
            }
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ComplaintsView;
