import { Box, Grid, IconButton, Button, Tooltip } from "@mui/material";
import React from "react";
import ApiEndpoints from "../network/ApiEndPoints";
import { useState } from "react";
import { CustomStyles } from "../component/CustomStyle";
import { currencySetter, numberSetter } from "../utils/Currencyutil";

import CachedIcon from "@mui/icons-material/Cached";

import { dateToTime, ddmmyy } from "../utils/DateUtils";
import AddPayoutModel from "../modals/AddPayoutModel";

import ApiPaginate from "../component/ApiPaginate";
import UpdatePayoutScheme from "../modals/UpdatePayoutScheme ";
import UpdateAepsScheme from "../modals/UpdateAepsScheme";
import AddAepsModel from "../modals/AddAepsModel";
let refresh;
function refreshFunc(setQueryParams) {
  setQueryParams("");
  if (refresh) refresh();
}
const AdminAepsSchema = () => {
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();

  const columns = [
    {
      name: "Created At",
      selector: (row) => (
        <div className="mb-1">
          {ddmmyy(row.created_at)}
          <br />
          {dateToTime(row.created_at)}
        </div>
      ),
      width: "100px",
    },
    {
      name: "ID",
      selector: (row) => <div className="blue-highlight-txt">{row.id}</div>,
    },
    {
      name: "Name",
      selector: (row) => <div>{row.name}</div>,
    },
    {
      name: "Slab1",
      selector: (row) => currencySetter(row.slab1),
    },
    {
      name: "Slab2",
      selector: (row) => currencySetter(row.slab2),
    },

    {
      name: "Slab3",
      selector: (row) => currencySetter(row.slab3 || "NA"),
    },
    {
      name: "Slab4",
      selector: (row) => currencySetter(row.slab4 || "NA"),
    },
    {
      name: "Slab5",
      selector: (row) => currencySetter(row.slab5),
    },
    {
      name: "Slab6",
      selector: (row) => currencySetter(row.slab6),
    },
    {
      name: "Slab7",
      selector: (row) => currencySetter(row.slab7),
    },
    {
      name: "Slab8",
      selector: (row) => currencySetter(row.slab8),
    },
    {
      name: "Ad comm",
      selector: (row) => currencySetter(row.ad_comm || "NA"),
    },
    {
      name: "Md comm",
      selector: (row) => currencySetter(row.md_comm),
    },
    {
      name: "Status",
      selector: (row) => (
        <Box sx={{ display: "flex" }}>
          {row.status === 1 ? (
            <Button
              size="small"
              sx={{
                backgroundColor: "#399918",
                padding: "8px",
                fontSize: "12px",
                color: "#ffffff",
                fontWeight: "700",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#7CB342",
                  color: "#ffffff",
                },
              }}
            >
              Active
            </Button>
          ) : (
            <Button
              size="small"
              sx={{
                backgroundColor: "#FDA403",
                padding: "8px",
                fontSize: "12px",
                color: "#ffffff",
                fontWeight: "700",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#EB8317",
                  color: "#ffffff",
                },
              }}
            >
              InActive
            </Button>
          )}
          {/* <AdminBanksDetailsModal row={row} /> */}
        </Box>
      ),
    },

    {
      name: <span className="mx-4">Actions</span>,
      selector: (row) => <UpdateAepsScheme row={row} refresh={refresh} />,
      center: true,
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Box sx={{ mr: 0.6 }}>
          <AddAepsModel refresh={refresh} />
        </Box>
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
      </Box>
      <div>
        <ApiPaginate
          apiEnd={ApiEndpoints.GET_AEPS_SCHEMA}
          columns={columns}
          apiData={apiData}
          tableStyle={CustomStyles}
          setApiData={setApiData}
          ExpandedComponent=""
          queryParam={query ? query : ""}
          returnRefetch={(ref) => {
            refresh = ref;
          }}
          paginateServer={false}
          paginate={false}
        />
      </div>
    </Box>
  );
};

export default AdminAepsSchema;
