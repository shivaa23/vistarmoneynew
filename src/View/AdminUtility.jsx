import { Box, Button, IconButton, Tooltip } from "@mui/material";
import React from "react";
import ApiPaginate from "../component/ApiPaginate";
import ApiEndpoints from "../network/ApiEndPoints";
import CachedIcon from "@mui/icons-material/Cached";
import { useState } from "react";
import { CustomStyles } from "../component/CustomStyle";
import { useNavigate } from "react-router-dom";
import { ddmmyy, dateToTime } from "../utils/DateUtils";
import AddUtilityModel from "../modals/AddUtilityModel";
import UpdateScheme from "../modals/UpdateScheme";

let refresh;
function refreshFunc(setQueryParams) {
  setQueryParams("");
  if (refresh) refresh();
}
const AdminUtility = () => {
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();
  const navigate = useNavigate();
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
      selector: (row) => row.name,
    },
    {
      name: "Ret",
      selector: (row) => row.ret,
    },

    {
      name: "Dd",
      selector: (row) => row.dd || "NA",
    },
    {
      name: "Ad",
      selector: (row) => row.ad || "NA",
    },
    {
      name: "Md",
      selector: (row) => row.md,
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
      selector: (row) => <UpdateScheme row={row} refresh={refresh} />,
      center: true,
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Box sx={{ mr: 0.6 }}>
          <AddUtilityModel refresh={refresh} />
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
          apiEnd={ApiEndpoints.GET_UTILITY_SCHEME}
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

export default AdminUtility;
