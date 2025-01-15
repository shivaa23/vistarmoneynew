import { Box, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import ApiPaginateSearch from "../component/ApiPaginateSearch";
import { useState } from "react";
import { CustomStyles } from "../component/CustomStyle";
import ApiEndpoints from "../network/ApiEndPoints";
import { ddmmyy, dateToTime,  } from "../utils/DateUtils";
import { useTheme } from "@mui/material/styles";
import CachedIcon from "@mui/icons-material/Cached";
import DeleteBlockedAcc from "../modals/DeleteBlockedAcc";
import AddBlockedAccount from "../modals/AddBlockedAccount";

let refresh;
function refreshFunc(setQueryParams) {
  setQueryParams("");
  if (refresh) refresh();
}
let refreshFilter;

// tabs in top bar

const AdminBlockedAc = () => {
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
      name: "CreatedAt",
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
      name: "UpdatedAt",
      selector: (row) => (
        <>
          <div className="mb-2" style={{ textAlign: "left" }}>
            {ddmmyy(row.created_at)} {dateToTime(row.updated_at)}
          </div>
          <div>
            {ddmmyy(row.updated_at)} {dateToTime(row.updated_at)}
          </div>
        </>
      ),
    },

    {
      name: "Account Number",
      cell: (row) => (
        <div style={{ textAlign: "center" }}>
          <div>{row.acc_no}</div>
        </div>
      ),
      center: true,
      wrap: true,
    },

    {
      name: "Ifsc",
      cell: (row) => (
        <div style={{ textAlign: "center" }}>
          <div>{row.ifsc}</div>
        </div>
      ),
      center: true,
      wrap: true,
    },

    {
      name: "Actions",
      selector: (row) => (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <DeleteBlockedAcc row={row} refresh={refresh} />
          </div>
        </>
      ),
    },
  ];

  return (
    <Grid container>
      {/* 1  "Settlement Beneficiary's" */}
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
                pr: 1,
                mt: { md: 0, xs: 2, sm: 2 },
              }}
            >
              <AddBlockedAccount refresh={refresh} />
              <Tooltip title="refresh">
                <IconButton
                  aria-label="refresh"
                  // color="success"
                  sx={{
                    color: "#0F52BA",
                  }}
                  onClick={() => {
                    refreshFunc(setQuery);
                  }}
                >
                  <CachedIcon className="refresh-purple" />
                </IconButton>
              </Tooltip>
            </Grid>
          }
          apiEnd={ApiEndpoints.GET_BLOCKED_AC}
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
        />
      </Grid>
    </Grid>
  );
};

export default AdminBlockedAc;
