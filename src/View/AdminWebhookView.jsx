import { Box, IconButton, Tooltip } from "@mui/material";
import React from "react";
import ApiEndpoints from "../network/ApiEndPoints";
import CachedIcon from "@mui/icons-material/Cached";
import { useState } from "react";
import { massegetable } from "../component/CustomStyle";
import { ddmmyy, dateToTime1 } from "../utils/DateUtils";
import ApiPaginateSearch from "../component/ApiPaginateSearch";

let refresh;
function refreshFunc(setQueryParams) {
  setQueryParams("");
  if (refresh) refresh();
}
const AdminWebhookView = () => {
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();

  const searchOptions = [{ field: "Req From", parameter: "req_from" }];

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      width: "100px",
    },
    {
      name: "Date",
      selector: (row) => (
        <div className="mb-1">
          {ddmmyy(row.created_at)}

          {dateToTime1(row.created_at)}
        </div>
      ),
      width: "130px",
    },
    {
      name: "From",
      selector: (row) => row.req_from,
      width: "100px",
    },
    {
      name: "Messages",
      selector: (row) => (
        <div
          style={{
            whiteSpace: "break-spaces",
            overflow: "hidden",
            textOverflow: "clip",
            textAlign: "left",
          }}
        >
          {row.response}
        </div>
      ),
    },
  ];

  return (
    <Box>
      <div>
        <ApiPaginateSearch
          apiEnd={ApiEndpoints.GET_WEBHOOK}
          searchOptions={searchOptions}
          setQuery={setQuery}
          query={query}
          columns={columns}
          apiData={apiData}
          showSearch={false}
          tableStyle={massegetable}
          setApiData={setApiData}
          ExpandedComponent=""
          queryParam={query ? query : ""}
          returnRefetch={(ref) => {
            refresh = ref;
          }}
          actionButtons={
            <Box sx={{ display: "flex", justifyContent: "end" }}>
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
                  <CachedIcon className="refresh-purple" />
                </IconButton>
              </Tooltip>
            </Box>
          }
        />
        {/* <ApiPaginate
          apiEnd={ApiEndpoints.GET_WEBHOOK}
          columns={columns}
          apiData={apiData}
          tableStyle={massegetable}
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

export default AdminWebhookView;
