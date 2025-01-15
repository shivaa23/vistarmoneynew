import { Box, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import ApiPaginateSearch from "../component/ApiPaginateSearch";
import { useState } from "react";
import { CustomStyles } from "../component/CustomStyle";
import ApiEndpoints from "../network/ApiEndPoints";
import { ddmmyy, dateToTime, datemonthYear } from "../utils/DateUtils";
import { useTheme } from "@mui/material/styles";
import AdminApprovesBene from "../modals/AdminApprovesBene";
import CommonStatus from "../component/CommonStatus";
import FilterCard from "../modals/FilterCard";
import CachedIcon from "@mui/icons-material/Cached";

let refresh;
function refreshFunc(setQueryParams) {
  setQueryParams("");
  if (refresh) refresh();
}
let refreshFilter;

// tabs in top bar

const AdminSettelments = () => {
  const theme = useTheme();
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();
  const [singleUser, setSingleUser] = useState(null);

  //   const authCtx = useContext(AuthContext);
  //   const user = authCtx.user;
  //   const role = user?.role;
  const [value, setValue] = useState(0);
  const [currentType, setCurrentType] = useState();

  const searchOptions = [
    { field: "AC Name", parameter: "acc_name" },
    { field: "AC Number", parameter: "acc_no" },
  ];
  const searchOptionsVa = [
    { field: "AC Name", parameter: "acc_name" },
    { field: "AC Number", parameter: "acc_no" },
  ];

  const settlementBeneficiarys = [
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
      width: "160px",
    },
    {
      name: "Id",
      selector: (row) => (
        <div className="blue-highlight-txt" style={{ textAlign: "left" }}>
          {row.id}
        </div>
      ),
      width: "60px",
    },
    {
      name: "Name",
      cell: (row) => (
        <div style={{ textAlign: "center" }}>
          <div>{row.name}</div>
          <div
            style={{
              marginTop: "2px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CommonStatus
              status={row.status}
              approvedStatusText="Verified"
              fontSize="11px"
              // minWidth="120px"
              maxWidth="120px"
            />
          </div>
        </div>
      ),
      center: true,
      wrap: true,
      width: "280px",
    },
    {
      name: "Bank",
      cell: (row) => (
        <div style={{ textAlign: "left" }}>
          <div>{row.bank}</div>
        </div>
      ),
      wrap: true,
      width: "180px",
    },
    {
      name: "Ifsc",
      cell: (row) => (
        <div style={{ textAlign: "left" }}>
          <div>{row.ifsc}</div>
        </div>
      ),
      wrap: true,
    },
    {
      name: "Account",
      cell: (row) => (
        <div style={{ textAlign: "left" }}>
          <div>{row.acc_number}</div>
        </div>
      ),
      wrap: true,
    },
    {
      name: "KYC",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>
          <CommonStatus
            status={row.kyc_status}
            approvedStatusText="Complete"
            pendingStatusText="Pending"
            rejectedStatusText="Rejected"
            fontSize="12px"
            minWidth="120px"
          />
        </div>
      ),
      center: true,
    },
    {
      name: "Actions",
      selector: (row) => <AdminApprovesBene row={row} refresh={refresh} />,
      center: true,
    },
  ];

  return (
    <Grid container>
      {/* 1  "Settlement Beneficiary's" */}
      <Grid item md={12} sm={12} xs={12}>
        <ApiPaginateSearch
          showSearch={true}
          // actionButtons={
          //   // <Grid
          //   //   item
          //   //   md={12}
          //   //   sm={12}
          //   //   xs={12}
          //   //   sx={{
          //   //     display: "flex",
          //   //     justifyContent: { md: "end", xs: "start" },
          //   //     alignItems: "center",
          //   //     pr: 1,
          //   //     mt: { md: 0, xs: 2, sm: 2 },
          //   //   }}
          //   // >
          //   //   {/* <Tooltip title="refresh">
          //   //     <IconButton
          //   //       aria-label="refresh"
          //   //       // color="success"
          //   //       sx={{
          //   //         color: "#0F52BA",
          //   //       }}
          //   //       onClick={() => {
          //   //         refreshFunc(setQuery);
          //   //       }}
          //   //     >
          //   //       <CachedIcon className="refresh-purple" />
          //   //     </IconButton>
          //   //   </Tooltip> */}
          //   // </Grid>
          // }
          apiEnd={ApiEndpoints.PAYOUT_BENES}
          searchOptions={searchOptions}
          setQuery={setQuery}
          columns={settlementBeneficiarys}
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
              showSearch={false}
              ifBeneKycStatus
              setQuery={setQuery}
              query={query}
              clearHookCb={(cb) => {
                refreshFilter = cb;
              }}
              refresh={refresh}
              actionButtons={
                <>
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
                </>
              }
            />
          }
        />
      </Grid>
    </Grid>
  );
};

export default AdminSettelments;
