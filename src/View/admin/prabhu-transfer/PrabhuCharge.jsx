import { Box, Grid } from "@mui/material";
import React from "react";
import ApiPaginateSearch from "../../../component/ApiPaginateSearch";
import RefreshComponent from "../../../component/RefreshComponent";
import ApiEndpoints from "../../../network/ApiEndPoints";
import { currencySetter } from "../../../utils/Currencyutil";
import { datemonthYear } from "../../../utils/DateUtils";
import { useState } from "react";
import { CustomStyles } from "../../../component/CustomStyle";
import CreateEditPrabhuCharges from "../../../modals/CreateEditPrabhuCharges";
let refresh;


const searchOptions = [{ field: "Service", parameter: "service" }];

const columns = [
  {
    name: "ID",
    selector: (row) => row.id,
    width: "70px",
  },
  {
    name: "Created/Updated",
    selector: (row) => (
      <div style={{ textAlign: "left" }}>
        <div style={{ marginBottom: "5px" }}>
          {datemonthYear(row.created_at)}
        </div>
        <div>{datemonthYear(row.updated_at)}</div>
      </div>
    ),
  },
  {
    name: "Service",
    selector: (row) => <div style={{ textAlign: "left" }}>{row.service}</div>,
    wrap: true,
  },
  {
    name: "Service Fee",
    selector: (row) => (
      <div style={{ textAlign: "left" }}>{currencySetter(row.service_fee)}</div>
    ),
    wrap: true,
  },
  {
    name: "Guru Comm",
    selector: (row) => (
      <div style={{ textAlign: "left" }}>{currencySetter(row.guru_comm)}</div>
    ),
    wrap: true,
  },
  {
    name: "Ret Comm",
    selector: (row) => currencySetter(row.ret_comm),
  },
  {
    name: "Ret Charge",
    selector: (row) => currencySetter(row.ret_charge),
  },
  {
    name: "Ad Comm",
    selector: (row) => currencySetter(row.ad_comm),
  },

  {
    name: "Actions",
    selector: (row) => (
      <Box sx={{ display: "flex", justifyContent: "space-around" }}>
        {/* edit */}

        <CreateEditPrabhuCharges edit row={row} refresh={refresh} />
        {/* <AdminDeleteLimitedAccounts row={row} refresh={refresh} /> */}
      </Box>
    ),
    right: true,
  },
];

const PrabhuCharge = () => {
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();
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
        <RefreshComponent
          className="refresh-icon-table"
          onClick={() => {
            refresh();
          }}
        />
      </Grid>
      <Grid item md={12} xs={12}>
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
              <RefreshComponent
                className="refresh-icon-table"
                onClick={() => {
                  refresh();
                }}
              />
            </Grid>
          }
          apiEnd={ApiEndpoints.ADMIN_PRABHU_CHARGES}
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

export default PrabhuCharge;
