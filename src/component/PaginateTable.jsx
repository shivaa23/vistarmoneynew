import { Grid } from "@mui/material";
import React from "react";
import DataTable from "react-data-table-component";
import NoDataView from "./NoDataView";
import Loader from "../component/loading-screen/Loader";

const PaginateTable = ({
  columns,
  user,
  list,
  setList,
  ExpandedComponent,
  filterFunc,
  totalRows,
  handlePerRowsChange,
  handlePageChange,
  tableStyle = false,
  paginateServer = true,
  paginate = true,
  expandVisible,
  setExpandVisible,
  selectableRows,
  onSelectedRowsChange,
  selectableRowDisabled = false,
  onRowClicked,
  conditionalRowStyles,
  noDataComponent,
  persistTableHead = true,
  progressPending = false,
  per_page,
  showTotal
}) => {
  return (
    <Grid sx={{ objectFit: "cover", position: "relative" }}>
      <Loader loading={progressPending} circleBlue />
      <DataTable
        columns={columns}
        data={list}
        fixedHeader
        noDataComponent={<NoDataView />}
        persistTableHead={persistTableHead}
        expandableRowsComponent={ExpandedComponent}
        expandableRows={ExpandedComponent ? true : false}
        pagination={paginate}
        paginationServer={paginateServer}
        striped
        customStyles={tableStyle}
        highlightOnHover
        selectableRowsHighlight
        pointerOnHover={false}
        paginationTotalRows={totalRows}
        progressPending={progressPending}
        // progressComponent={<LinearIndeterminate />}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        dense={false}
        selectableRows={selectableRows}
        onSelectedRowsChange={onSelectedRowsChange}
        conditionalRowStyles={conditionalRowStyles}
        selectableRowDisabled={selectableRowDisabled}
        onRowClicked={(data) => {
          if (onRowClicked) onRowClicked(data);
        }}
        paginationRowsPerPageOptions={[10, 15, 20, 25, 30, 50, 100]}
        paginationPerPage={per_page ? per_page : 15}
      />
    </Grid>
  );
};

export default PaginateTable;
