import { Box, Grid, IconButton, Tooltip } from "@mui/material";
import React from "react";
import RefreshComponent from "../component/RefreshComponent";
import CreateEditEmployees from "../component/adminEmployees/CreateEditEmployees";
import { useState } from "react";
import ApiPaginateSearch from "../component/ApiPaginateSearch";
import ApiEndpoints from "../network/ApiEndPoints";
import { CustomStyles } from "../component/CustomStyle";
import { currencySetter } from "../utils/Currencyutil";
import moment from "moment";
import DeleteEmployees from "../component/adminEmployees/DeleteEmployees";

import CachedIcon from "@mui/icons-material/Cached";
let refresh;
function refreshFunc(setQueryParams) {
  setQueryParams("");
  if (refresh) refresh();
}
const AdminEmployeesView = () => {
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();
  const searchOptions = [{ field: "Name", parameter: "name" }];

  const columns = [
    {
      name: "Joining Date",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>
          {moment(row.joining_date).format("Do MMM YYYY")}
        </div>
      ),
    },
    {
      name: "Name",
      selector: (row) => <div style={{ textAlign: "left" }}>{row.name}</div>,
    },
    {
      name: "Role",
      selector: (row) => <div style={{ textAlign: "left" }}>{row.role}</div>,
    },
    {
      name: "DOB",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>
          {moment(row.dob).format("Do MMM YYYY")}
        </div>
      ),
    },
    {
      name: "Basic",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>{currencySetter(row.basic_pay)}</div>
      ),
    },
    {
      name: "HRA",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>{currencySetter(row.hra)}</div>
      ),
    },
    {
      name: "TA",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>{currencySetter(row.ta)}</div>
      ),
    },
    {
      name: "Target",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>{currencySetter(row.target)}</div>
      ),
    },
    {
      name: "Bank",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>
          <div>{row.bank}</div>
          <div>{row.ifsc}</div>
        </div>
      ),
    },
    {
      name: "Account",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>
          <div>{row.acc_number}</div>
        </div>
      ),
    },

    {
      name: "Actions",
      selector: (row) => (
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          {/* edit */}
          <CreateEditEmployees edit row={row} refresh={refresh} />
          <DeleteEmployees row={row} refresh={refresh} />
        </Box>
      ),
      right: true,
    },
  ];

  return (
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
        <div className="mx-2">
          <CreateEditEmployees refresh={refresh} />
        </div>
        <RefreshComponent
          className="refresh-icon-table"
          onClick={() => {
            refresh();
          }}
        />
      </Grid>
      <Grid item md={12} sm={12} xs={12}>
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
                <CreateEditEmployees refresh={refresh} />
              </div>
              <Tooltip title="refresh" >
          <IconButton
            aria-label="refresh"
            sx={{
              width:"30px",
              color: "#0F52BA",
             
             
            }}
            onClick={() => {
              refreshFunc(setQuery);
            }}
          >
            <CachedIcon className="refresh-purple " />
          </IconButton>
        </Tooltip>
            </Grid>
          }
          apiEnd={ApiEndpoints.EMPLOYEES}
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
    </Grid>
  );
};

export default AdminEmployeesView;
