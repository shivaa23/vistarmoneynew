import { Grid } from "@mui/material";
import React from "react";
import ApiPaginate from "./ApiPaginate";
import SearchBarComp from "./SearchBarComp";
import Mount from "./Mount";
import useResponsive from "../hooks/useResponsive";
const ApiPaginateSearch = ({
  apiEnd,
  columns,
  apiData,
  tableStyle,
  setApiData,
  queryParam,
  returnRefetch,
  setQuery,
  query,
  setSumData=false,
  searchOptions = [],
  actionButtons,
  responses,
  conditionalRowStyles,
  selectableRows = false,
  onSelectedRowsChange,
  filterData = false,
  DBvalue,
  choseVal,
  filterFunc,
  search,
  selectableRowDisabled,
  prefilledQuery = false,
  paginateServer = true,
  filterComponent = false,
  isFilterAllowed = false,
  per_page,
  showTotal = false,
  backButton,
  totalCard,
  showSearch = false,
  filteredData
}) => {
  const isDesktop = useResponsive("up", "sm");

  return (
    <>
      <Grid className="table-container" container>
        <Mount visible={isFilterAllowed && isDesktop}>
          <Grid item md={12} xs={12}>
            {filterComponent}
          </Grid>
        </Mount>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItem: "center",
            mt: 1,
            mb: 0.7,
          }}
        >
          {/* this is a grid */}
          <Mount visible={showSearch}>
            <SearchBarComp
              prefilledQuery={prefilledQuery}
              setQuery={setQuery}
              query={query}
              queryParam={queryParam}
              searchOptions={searchOptions}
              ifFilterData={filterData}
              sendBkDBVal={(dbVal) => {
                if (DBvalue) DBvalue(dbVal);
              }}
              sendBkChoosenVal={(choosenVal) => {
                if (choseVal) choseVal(choosenVal);
              }}
            />
          </Mount>

          {/* this is a grid too */}
          <Mount visible={showSearch}>
            <Grid
              container
              sx={{
                pl: 2,
                display: { md: "block", sm: "none", xs: "none" },
                textAlign: "right",
              }}
            >
              {actionButtons ? actionButtons : <span></span>}
            </Grid>
          </Mount>
        </Grid>
        <Mount visible={showSearch}>
          <Grid
            item
            md={12}
            sx={{
              textAlign: "left",
              pl: 2,
              display: { md: "block", sm: "none", xs: "none" },
            }}
          >
            {backButton}
          </Grid>
        </Mount>
        <Mount visible={showSearch||!showSearch}>
          <Grid
            item
            md={12}
            sx={{
              textAlign: "left",
              pl: 2,
              display: { md: "block", sm: "none", xs: "none" },
            }}
          >
            {totalCard}
          </Grid>
        </Mount>
      </Grid>

      {/* TABLE */}
      <Grid container>
        <Grid item xs={12}>
          <ApiPaginate
            showSearch={showSearch}
            prefilledQuery={prefilledQuery}
            apiEnd={apiEnd}
            columns={columns}
            apiData={apiData}
            tableStyle={tableStyle}
            setApiData={setApiData}
            setSumData={setSumData}
            queryParam={queryParam ? queryParam : ""}
            returnRefetch={returnRefetch}
            ExpandedComponent={null}
            conditionalRowStyles={conditionalRowStyles}
            selectableRows={selectableRows}
            onSelectedRowsChange={onSelectedRowsChange}
            responses={responses}
            filterFunc={filterFunc}
            search={search && search}
            paginateServer={paginateServer}
            paginate={true}
            selectableRowDisabled={selectableRowDisabled}
            per_page={per_page}
            showTotal
            filteredData={filteredData}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ApiPaginateSearch;
