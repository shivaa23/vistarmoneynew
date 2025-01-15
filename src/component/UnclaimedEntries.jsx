import { Box, IconButton, Tooltip, Grid } from "@mui/material";
import React from "react";
// import ApiPaginate from "../component/ApiPaginate";
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
const UnclaimedEntries = () => {
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();
console.log("apiData",apiData[1]);

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
      name: "Bank",
      selector: (row) => row.bank,
      width: "170px",
      fontSize: "13px",
    },
    {
      name: "Description",
      selector: (row) => (
        <div
          style={{
            fontSize: "13px",
          }}
        >
          {row.description}
        </div>
      ),
      wrap: true,
    },
    {
      name: "Credit",
      selector: (row) => row.credit,
      width: "100px",
      fontSize: "13px",
    },
    {
      name: "Debit",
      selector: (row) => row.debit,
      width: "100px",
      fontSize: "13px",
    },
  ];

  return (
    <Box>
  
      <ApiPaginateSearch
        apiEnd={ApiEndpoints.GET_PENDING_ACCOUNT_TRANSACTION}
        setQuery={setQuery}
        query={query}
        columns={columns}
        showSearch={false}
        apiData={apiData}
        tableStyle={massegetable}
        setApiData={setApiData}
        ExpandedComponent=""
        queryParam={query ? query : ""}
        returnRefetch={(ref) => {
          refresh = ref;
        }}
        isFilterAllowed={true}
        filterComponent={
          <Box
          sx={{
            flexGrow: 1,
            maxWidth: "70%",
          }}
        >
          <FilterCard
            ifdateFilter
            ifFromBankFilter
            ifamountFilter
            ifBankFilter
            ifdescriptionFilter
            setQuery={setQuery}
            query={query}
            chooseInitialCategoryFilter={
              chooseInitialCategoryFilter !== "ALL"
                ? chooseInitialCategoryFilter
                : false
            }
            refresh={refresh}
            isShowFilterCard={isShowFilterCard}
            actionButtons={

              <>   <Tooltip title="refresh">
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
            </Tooltip></>
            }
            setIsShowFilterCard={setIsShowFilterCard}
            sx={{
              width: "100%",
            }}
          />
        
        </Box>
        }
      />
    </Box>
  );
};

export default UnclaimedEntries;

// UnclaimedEntries
