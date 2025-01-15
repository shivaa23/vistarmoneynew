import { Box, IconButton, Tooltip } from "@mui/material";
import React from "react";
import ApiPaginate from "../component/ApiPaginate";
import ApiEndpoints from "../network/ApiEndPoints";
import CachedIcon from "@mui/icons-material/Cached";
import { useState } from "react";
import { massegetable } from "../component/CustomStyle";
import { datemonthYear } from "../utils/DateUtils";

let refresh;
function refreshFunc(queryParam, setQueryParams) {
  if (queryParam === "") {
    setQueryParams(" ");
  }
  setQueryParams("");
  if (refresh) refresh();
}
const AdminOutMassegeView = () => {
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();
  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      width: "70px",
    },
    {
      name: "Date",
      selector: (row) => datemonthYear(row.created_at),
      width: "100px",
    },
    {
      name: "From",
      selector: (row) => row.sender,
      width: "100px",
    },
    {
      name: "Massege",
      selector: (row) => (
        <div
          style={{
            whiteSpace: "break-spaces",
            overflow: "hidden",
            textOverflow: "clip",
            textAlign: "left",
          }}
        >
          {row.msg}
        </div>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Tooltip title="refresh">
          <IconButton
            aria-label="refresh"
            color="success"
            onClick={() => {
              refreshFunc(query, setQuery);
            }}
          >
            <CachedIcon className="refresh-purple" />
          </IconButton>
        </Tooltip>
      </Box>
      <div>
        <ApiPaginate
          apiEnd={ApiEndpoints.GET_OUT_MASSEGE}
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
        />
      </div>
    </Box>
  );
};

export default AdminOutMassegeView;
