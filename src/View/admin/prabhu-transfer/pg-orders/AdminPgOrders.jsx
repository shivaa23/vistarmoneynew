import {
  Grid,
  // FormControlLabel,
  // FormGroup,
  // Switch,
  // Typography,
  Button,
} from "@mui/material";
import React from "react";
import FilterModal from "../../../../modals/FilterModal";
import RefreshComponent from "../../../../component/RefreshComponent";
import ExcelUploadModal from "../../../../modals/ExcelUploadModal";
import { useState } from "react";
import ApiEndpoints from "../../../../network/ApiEndPoints";
import { get } from "../../../../network/ApiController";
import { apiErrorToast } from "../../../../utils/ToastUtil";
import moment from "moment";
import { json2Csv, json2Excel } from "../../../../utils/exportToExcel";
import ApiPaginateSearch from "../../../../component/ApiPaginateSearch";
import { CustomStyles } from "../../../../component/CustomStyle";
import FilterCard from "../../../../modals/FilterCard";
import { datemonthYear } from "../../../../utils/DateUtils";
import AdminReqResModal from "../../../../modals/admin/AdminReqResModal";
import { primaryColor } from "../../../../theme/setThemeColor";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import { currencySetter } from "../../../../utils/Currencyutil";

let refresh;
let handleCloseModal;
let refreshFilter;
const statusList = [
  { name: "SUCCESS", code: "SUCCESS" },
  { name: "PENDING", code: "PENDING" },
  { name: "REFUND", code: "REFUND" },
  { name: "FAILED", code: "FAILED" },
];

const AdminPgOrders = () => {
  const navigate = useNavigate();
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();
  const [request, setRequest] = useState();
  const [noOfResponses, setNoOfResponses] = useState(0);

  // table data & conditional styles.....
  //   const conditionalRowStyles = [
  //     {
  //       when: (row) => row.operator.toLowerCase() === "admin transfer",
  //       style: {
  //         backgroundColor: "#dc5f5f38",
  //         "&:hover": {
  //           cursor: "pointer",
  //         },
  //       },
  //     },
  //   ];

  const getExcel = () => {
    get(
      ApiEndpoints.ADMIN_PG_ORDERS,

      `${
        query
          ? query + `&page=1&paginate=10&export=1`
          : `page=1&paginate=10&export=1`
      }`,
      setRequest,
      (res) => {
        const apiData = res.data.data;
        const newApiData = apiData.map((item) => {
          const created_at = moment(item.created_at).format("DD-MM-YYYY");
          const time_updated_at = moment(item.updated_at).format("LTS");
          return { ...item, created_at, time_updated_at };
        });
        json2Excel(
          `Transactions ${moment(new Date().toJSON()).format(
            "Do MMM YYYY"
          )} | ${moment(new Date().toJSON()).format("hh:mm a")}`,
          JSON.parse(JSON.stringify(newApiData && newApiData))
        );
        handleCloseModal();
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const getCsv = () => {
    get(
      ApiEndpoints.ADMIN_PG_ORDERS,
      `${
        query
          ? query + `&page=1&paginate=10&export=1`
          : `page=1&paginate=10&export=1`
      }`,
      setRequest,
      (res) => {
        const apiData = res.data.data;
        const newApiData = apiData.map((item) => {
          const created_at = moment(item.created_at).format("DD-MM-YYYY");
          const time_updated_at = moment(item.updated_at).format("LTS");
          return { ...item, created_at, time_updated_at };
        });
        json2Csv(
          `Transactions ${moment(new Date().toJSON()).format(
            "Do MMM YYYY"
          )} | ${moment(new Date().toJSON()).format("hh:mm a")}`,
          JSON.parse(JSON.stringify(newApiData && newApiData))
        );
        handleCloseModal();
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const columns = [
    {
      name: "Date",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>{datemonthYear(row.created_at)}</div>
      ),
      width: "150px",
    },
    {
      name: "Order ID",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>{row.order_id}</div>
      ),
    },

    {
      name: "Payment Type",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>{row.payment_type}</div>
      ),
    },
    {
      name: "Ref No",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>{row.ref_number}</div>
      ),
    },
    {
      name: "Amount",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>{currencySetter(row.amount)}</div>
      ),
    },
    {
      name: "RRN",
      selector: (row) => <div style={{ textAlign: "left" }}>{row.rrn}</div>,
    },
    {
      name: "Status",
      selector: (row) => (
        <div
          className="px-2 text-uppercase"
          style={{
            color: "#fff",
            backgroundColor:
              row.status && row.status === "SUCCESS"
                ? "#00BF78"
                : row.status && row.status === "PENDING"
                ? "#F08D17"
                : row.status && row.status === "REFUND"
                ? "#4045A1"
                : row.status && row.status === "FAILED"
                ? "#DC6F6F"
                : "#00BF78",
            fontWeight: "bold",
            borderRadius: "4px",
            minWidth: "85px",
          }}
        >
          {row.status && row.status === "SUCCESS"
            ? "Success"
            : row.status && row.status === "PENDING"
            ? "Pending"
            : row.status && row.status === "REFUND"
            ? "Refund"
            : row.status && row.status === "FAILED"
            ? "Failed"
            : "Success"}
        </div>
      ),
    },
    {
      name: "Req & Res",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>
          <AdminReqResModal data={row?.request} />
        </div>
      ),
    },
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
        {/* excel */}
        <div className="mx-2">
          <ExcelUploadModal
            twobuttons="Download Csv"
            btn
            request={request}
            getExcel={getExcel}
            getCsv={getCsv}
            noOfResponses={noOfResponses}
            setQuery={setQuery}
            handleCloseCB={(closeModal) => {
              handleCloseModal = closeModal;
            }}
          />
        </div>
        {/* refresh */}
        <div className="me-3">
          <RefreshComponent
            className="refresh-icon-table"
            onClick={() => {
              if (refresh) refresh();
            }}
          />
        </div>
        {/* filter modal */}
        <FilterModal
          iforderidFilter
          ifstatusFilter
          setQuery={setQuery}
          query={query}
          statusList={statusList}
          clearHookCb={(cb) => {
            refreshFilter = cb;
          }}
          refresh={refresh}
        />
      </Grid>
      <Grid xs={12} sx={{ pl: { xs: 0, md: 2 } }}>
        <ApiPaginateSearch
          showSearch={false}
          apiEnd={ApiEndpoints.ADMIN_PG_ORDERS}
          setQuery={setQuery}
          columns={columns}
          apiData={apiData}
          setApiData={setApiData}
          tableStyle={CustomStyles}
          returnRefetch={(ref) => {
            refresh = ref;
          }}
          //   conditionalRowStyles={conditionalRowStyles}
          responses={(val) => {
            setNoOfResponses(val);
          }}
          isFilterAllowed={true}
          filterComponent={
            <FilterCard
              showSearch={false}
              iforderidFilter
              ifstatusFilter
              statusList={statusList}
              setQuery={setQuery}
              query={query}
              clearHookCb={(cb) => {
                refreshFilter = cb;
              }}
              refresh={refresh}
              // buttons
              actionButtons={
                <>
                  <div className="">
                    <ExcelUploadModal
                      twobuttons="Download Csv"
                      btn
                      request={request}
                      getExcel={getExcel}
                      getCsv={getCsv}
                      noOfResponses={noOfResponses}
                      setQuery={setQuery}
                      handleCloseCB={(closeModal) => {
                        handleCloseModal = closeModal;
                      }}
                    />
                  </div>
                  <RefreshComponent
                    className="refresh-icon-table"
                    onClick={() => {
                      if (refresh) refresh();
                    }}
                  />
                </>
              }
              backButton={
                <Button
                  size="small"
                  className="otp-hover-purple"
                  sx={{
                    color: primaryColor(),
                  }}
                  onClick={() => navigate("/admin/transactions")}
                >
                  <KeyboardBackspaceIcon fontSize="small" /> Back
                </Button>
              }
            />
          }
        />
      </Grid>
    </Grid>
  );
};

export default AdminPgOrders;
