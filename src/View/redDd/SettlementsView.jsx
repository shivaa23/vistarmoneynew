import { Box, Grid } from "@mui/material";
import React from "react";
import { useState } from "react";
import ApiPaginateSearch from "../../component/ApiPaginateSearch";
import ApiEndpoints from "../../network/ApiEndPoints";
import { CustomStyles } from "../../component/CustomStyle";
import AddSettlementBeneficiary from "../../component/RetDd/AddSettlementBeneficiary";
// import { datemonthYear } from "../../utils/DateUtils";
import RefreshComponent from "../../component/RefreshComponent";
import CommonStatus from "../../component/CommonStatus";
import BeneficiaryKycVerification from "../../component/RetDd/BeneficiaryKycVerification";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { paymentModes } from "../../utils/constants";
import SettlementPaymentModes from "../../component/RetDd/SettlementPaymentModes";
import { Icon } from "@iconify/react";
import FilterCard from "../../modals/FilterCard";
import FilterModal from "../../modals/FilterModal";
// import DeleteSettlementAccount from "../../component/RetDd/DeleteSettlementAccount";
let refresh;
let refreshFilter;
const SettlementsView = () => {
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();
  const searchOptions = [{ field: "Name", parameter: "name" }];
  const columns = [
    {
      name: "Id",
      selector: (row) => <div style={{ textAlign: "left" }}>{row.id}</div>,
      width: "30px",
    },
    // {
    //   name: "Created/Updated",
    //   selector: (row) => (
    //     <div style={{ textAlign: "left" }}>
    //       <div style={{ marginBottom: "5px" }}>
    //         {datemonthYear(row.created_at)}
    //       </div>
    //       <div>{datemonthYear(row.updated_at)}</div>
    //     </div>
    //   ),
    // },
    {
      name: "Name",
      cell: (row) => (
        <div style={{ textAlign: "center" }}>
          {" "}
          <div>{row.name}</div>
          <div style={{ marginTop: "2px" }}>
            {" "}
            <CommonStatus
              status={row.status}
              approvedStatusText="Verified"
              fontSize="13px"
            />
          </div>
        </div>
      ),
      width: "150px",
      center: true,
      wrap: true,
    },
    {
      name: "Bank",
      cell: (row) => (
        <div style={{ textAlign: "left" }}>
          <div>{row.bank}</div>
          <div>{row.ifsc}</div>
        </div>
      ),
      wrap: true,
      width: "180px",
    },
    {
      name: "Account",
      cell: (row) => (
        <div style={{ textAlign: "left" }}>
          <div>{row.acc_number}</div>
        </div>
      ),
      width: "150px",
      wrap: true,
    },
    // {
    //   name: "Account Status",
    //   selector: (row) => (
    //     <div style={{ textAlign: "left" }}>
    //       <CommonStatus status={row.status} approvedStatusText="Verified" />
    //     </div>
    //   ),
    //   width: "130px",
    //   center: true,
    // },
    {
      name: "KYC",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>
      
          <BeneficiaryKycVerification refresh={refresh} row={row} />
        </div>
      ),
      width: "130px",
      center: true,
    },
    {
      name: "Mode",
      selector: (row) => (
        <Box>
          {row.kyc_status === 1 ? (
            <Box sx={{ display: "flex" }}>
              {paymentModes.map((item) => {
                return (
                  <SettlementPaymentModes
                    buttonText={item.name}
                    row={row}
                    style={item.style}
                  />
                );
              })}
            </Box>
          ) : row.kyc_status === 0 ? (
            <Box
              sx={{
                py: 0.5,
                px: 1.5,
                backgroundColor: "#decff3",
                fontSize: "13px",
                borderRadius: "4px",
              }}
            >
              <Icon
                icon="tdesign:user"
                style={{ fontSize: "15px", color: "#7943c0" }}
              />

              <span style={{ marginLeft: "8px", color: "#7943c0" }}>
                Perform KYC before settlements
              </span>
            </Box>
          ) : (
            // this is kyc status 2 pending
            <Box
              sx={{
                py: 0.5,
                px: 1.5,
                backgroundColor: "#FFF4E5",
                fontSize: "13px",
                borderRadius: "4px",
              }}
            >
              <ErrorOutlineOutlinedIcon
                style={{ fontSize: "18px", color: "#e0b64b" }}
              />
              <span style={{ marginLeft: "8px", color: "#663C00" }}>
                KYC Pending from admin side
              </span>
            </Box>
          )}
        </Box>
      ),
      center: true,
    },
    // {
    //   name: "Action",
    //   selector: (row) => (
    //     <div style={{ textAlign: "left" }}>
    //       {" "}
    //       <DeleteSettlementAccount row={row} refresh={refresh} />
    //     </div>
    //   ),
    //   right: true,
    //   width: "50px",
    // },
  ];

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
        <div className="mx-2">
          <AddSettlementBeneficiary refresh={refresh} />
        </div>
        <RefreshComponent
          className="refresh-icon-table"
          onClick={() => {
            refresh();
          }}
        />
        <div className="mx-2 ms-3">
          <FilterModal
            showSearch={false}
            ifBeneKycStatus
            setQuery={setQuery}
            query={query}
            clearHookCb={(cb) => {
              refreshFilter = cb;
            }}
            refresh={refresh}
            actionButtons={
              <>
                <div className="mx-2">
                  <AddSettlementBeneficiary refresh={refresh} />
                </div>
                <RefreshComponent
                  className="refresh-icon-table"
                  onClick={() => {
                    refresh();
                  }}
                />
              </>
            }
          />
        </div>
      </Grid>
      <Grid item md={12} sm={12} xs={12}>
        <ApiPaginateSearch
          showSearch={false}
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
              <div className="mx-2">
                <AddSettlementBeneficiary refresh={refresh} />
              </div>
              <RefreshComponent
                className="refresh-icon-table"
                onClick={() => {
                  refresh();
                }}
              />
            </Grid>
          }
          apiEnd={ApiEndpoints.DMR_SETTLEMENTS}
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
          isFilterAllowed={true}
          // filters
          filterComponent={
            <FilterCard
              showSearch={false}
              ifBeneKycStatus
              setQuery={setQuery}
              query={query}
              clearHookCb={(cb) => {
                refreshFilter = cb;
              }}
              refresh={refresh}
              actionButtons={
                <>
                  <div className="mx-2">
                    <AddSettlementBeneficiary refresh={refresh} />
                  </div>
                  <RefreshComponent
                    className="refresh-icon-table"
                    onClick={() => {
                      refresh();
                    }}
                  />
                </>
              }
            />
          }
        />
      </Grid>
    </Grid>
  );
};

export default SettlementsView;
