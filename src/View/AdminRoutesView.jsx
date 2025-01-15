import { Box, IconButton, Tooltip } from "@mui/material";
import React from "react";
import ApiPaginate from "../component/ApiPaginate";
import ApiEndpoints from "../network/ApiEndPoints";
import CachedIcon from "@mui/icons-material/Cached";
import { useState } from "react";
import { CustomStyles } from "../component/CustomStyle";
import { ddmmyy, dateToTime } from "../utils/DateUtils";
import CommonStatus from "../component/CommonStatus";

let refresh;
function refreshFunc(setQueryParams) {
  setQueryParams("");
  if (refresh) refresh();
}
const AdminRoutesView = () => {
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();
  const columns = [
    {
      name: "ID",
      selector: (row) => <div className="blue-highlight-txt">{row.id}</div>,
      width: "70px",
    },
    {
      name: <span className="mx-5">Date</span>,
      selector: (row) => (
        <div className="mb-2">
          {ddmmyy(row.created_at)} {dateToTime(row.created_at)}
        </div>
      ),
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Code",
      selector: (row) => row.code,
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
              status={row.status}
              approvedStatusText="ONLINE"
              rejectedStatusText="OFFLINE"
              fontSize="12px"
            />
          </Box>
        );
      },
      wrap: true,
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
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
          apiEnd={ApiEndpoints.GET_ROUTE}
          columns={columns}
          apiData={apiData}
          tableStyle={CustomStyles}
          setApiData={setApiData}
          ExpandedComponent=""
          paginateServer={false}
          queryParam={query ? query : ""}
          returnRefetch={(ref) => {
            refresh = ref;
          }}
          paginate={false}
        />
      </div>
    </Box>
  );
};

export default AdminRoutesView;
