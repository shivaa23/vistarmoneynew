import { Box, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import ApiPaginateSearch from "../component/ApiPaginateSearch";
import { useState } from "react";
import { CustomStyles } from "../component/CustomStyle";
import ApiEndpoints from "../network/ApiEndPoints";
import { ddmmyy, dateToTime, datemonthYear } from "../utils/DateUtils";
import { currencySetter } from "../utils/Currencyutil";
import { useTheme } from "@mui/material/styles";
import CreateEditLimitAccount from "../component/accountLimits/CreateEditLimtAccount";
import AdminDeleteLimitedAccounts from "../component/accountLimits/AdminDeleteLimitedAccounts";

import CachedIcon from "@mui/icons-material/Cached";

import { TabPanel } from "@mui/lab";

let refresh;
function refreshFunc(setQueryParams) {
  setQueryParams("");
  if (refresh) refresh();
}
let refreshFilter;

const AdminAccountLimit = () => {
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

  const columns = [
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
      name: "AC Name",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>{row.acc_name}</div>
      ),
      wrap: true,
    },
    {
      name: "AC Number",
      selector: (row) => row.acc_no,
    },
    {
      name: "AC IFSC",
      selector: (row) => row.ifsc,
    },
    {
      name: "AC Type",
      selector: (row) => row.acc_type,
    },
    {
      name: "AC Limit",
      selector: (row) => currencySetter(row.acc_limit),
    },
    {
      name: "Actions",
      selector: (row) => (
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          {/* edit */}

          <CreateEditLimitAccount edit row={row} refresh={refresh} />
          <AdminDeleteLimitedAccounts row={row} refresh={refresh} />
        </Box>
      ),
      right: true,
    },
  ];

  return (
   <>
   <Grid
          item
          md={12}
          sm={12}
          xs={12}
          sx={{
    
          }}
        >
        
            <ApiPaginateSearch
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
                  <div className="mx-2">
                    <CreateEditLimitAccount refresh={refresh} />
                  </div>
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
              apiEnd={ApiEndpoints.ADMIN_ACCOUNTS_LIMITS}
              searchOptions={searchOptions}
              setQuery={setQuery}
              columns={columns}
              apiData={apiData}
              setApiData={setApiData}
              tableStyle={CustomStyles}
              queryParam={query ? query : ""}
              returnRefetch={(ref) => {
                refresh = ref;
              }}
            />
     
        </Grid>
 </>
  )
}

export default AdminAccountLimit
