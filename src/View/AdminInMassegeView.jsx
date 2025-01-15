import { Box, IconButton, Tooltip, Grid } from "@mui/material";
import React from "react";
import ApiEndpoints from "../network/ApiEndPoints";
import CachedIcon from "@mui/icons-material/Cached";
import { useState } from "react";
import { massegetable } from "../component/CustomStyle";
import { ddmmyy, dateToTime1 } from "../utils/DateUtils";
import ApiPaginateSearch from "../component/ApiPaginateSearch";
import FilterCard from "../modals/FilterCard";
import useCommonContext from "../store/CommonContext";
let refresh;
function refreshFunc(setQueryParams) {
  setQueryParams("");
  if (refresh) refresh();
}
const AdminInMassegeView = () => {
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();

  const [isShowFilterCard, setIsShowFilterCard] = useState(false);
  const {
    setChooseInitialCategoryFilter,
    chooseInitialCategoryFilter,
    refreshUser,
  } = useCommonContext();
  const columns = [
    {
      name: "ID",
      selector: (row) => <div className="blue-highlight-txt">{row.id}</div>,
      width: "70px",
    },
    {
      name: "Date",
      selector: (row) => (
        <div>
          {ddmmyy(row.created_at)} {dateToTime1(row.created_at)}
        </div>
      ),
      width: "140px",
    },
    {
      name: "From",
      selector: (row) => row.sender,
      width: "100px",
      fontSize: "13px",
    },
    {
      name: "Message",
      selector: (row) => (
        <div
          style={{
            whiteSpace: "break-spaces",
            fontSize: "13px",
            textAlign: "left",
          }}
        >
          {row.msg}
        </div>
      ),
      wrap: true,
    },
  ];

  const searchOptions = [{ field: "Sender", parameter: "sender" }];

  return (
    <Box sx={{ position: "relative" }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item sx={{ width: "150%" }}>
          <FilterCard
            topMargin={-1}
            bottomMargin={-1}
            ifdateFilter
            ifFromBankFilter
            ifMessageFilter
            setQuery={setQuery}
            query={query}
            chooseInitialCategoryFilter={
              chooseInitialCategoryFilter !== "ALL"
                ? chooseInitialCategoryFilter
                : false
            }
            refresh={refresh}
            isShowFilterCard={isShowFilterCard}
            setIsShowFilterCard={setIsShowFilterCard}
          />
        </Grid>

        <Box sx={{ position: "absolute", top: 0, right: 0 }}>
          <Tooltip title="refresh">
            <IconButton
              aria-label="refresh"
              sx={{ color: "#0F52BA" }}
              onClick={() => refreshFunc(setQuery)}
            >
              <CachedIcon className="refresh-purple" />
            </IconButton>
          </Tooltip>
        </Box>
      </Grid>

      <Grid>
        <div>
          <ApiPaginateSearch
            apiEnd={ApiEndpoints.GET_MASSEGE}
            searchOptions={searchOptions}
            setQuery={setQuery}
            query={query}
            columns={columns}
            // showSearch={true}
            apiData={apiData}
            tableStyle={massegetable}
            setApiData={setApiData}
            ExpandedComponent=""
            queryParam={query ? query : ""}
            returnRefetch={(ref) => {
              refresh = ref;
            }}
          />
        </div>
      </Grid>
    </Box>
  );
};

export default AdminInMassegeView;
