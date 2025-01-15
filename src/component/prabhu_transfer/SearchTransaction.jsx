import React from "react";
import { useState } from "react";
import { Grid } from "@mui/material";
import ApiPaginateSearch from "../ApiPaginateSearch";
import ApiEndpoints from "../../network/ApiEndPoints";
import { CustomStyles } from "../CustomStyle";
import RefreshComponent from "../RefreshComponent";
import moment from "moment";
import Mount from "../Mount";
import { getStatusColor } from "../../theme/setThemeColor";
import { currencySetter } from "../../utils/Currencyutil";
import { Icon } from "@iconify/react";
import { getModesIcon } from "../../utils/iconutil";
import FilterCard from "../../modals/FilterCard";
import FilterModal from "../../modals/FilterModal";

let refresh;
function refreshFunc(setQueryParams) {
  if (refresh) refresh();
}
export const infoStyle = {
  fontSize: "10px",
  fontWeight: "bold",
  color: "#273746",
};
const isFilterAllowed = true;
const SearchTransaction = () => {
  const [query, setQuery] = useState();
  const [apiData, setApiData] = useState([]);

  const searchOptions = [{ field: "Pin No", parameter: "PinNo" }];

  const columns = [
    {
      name: "Send/Paid Date",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>
          <div style={{ marginBottom: "5px" }}>
            {moment(row.SendDate).format("MMM DD, hh:mm:ss a")}
          </div>
          {row.PaidDate && (
            <div>{moment(row.PaidDate).format("MMM DD, hh:mm:ss a")}</div>
          )}
        </div>
      ),
      wrap: true,
      width: "150px",
    },
    {
      name: "Mode",
      wrap: true,
      selector: (row) => (
        <div className="d-flex align-items-start flex-column">
          <Icon icon={getModesIcon(row.PaymentMode)} />
          <div>{row.PaymentMode}</div>
        </div>
      ),
      width: "150px",
    },
    {
      name: "ID",
      wrap: true,
      selector: (row) => row.TransactionId,
    },
    {
      name: "Sender",
      wrap: true,
      selector: (row) => (
        <div style={{ textAlign: "left" }}>
          <div style={infoStyle}>{row.SenderName}</div>
          <div style={infoStyle}>{row.SenderMobile}</div>
          <div style={infoStyle}>{row.SenderIDNumber}</div>
        </div>
      ),
      width: "150px",
    },
    {
      name: "Receiver",
      wrap: true,
      selector: (row) => (
        <div style={{ textAlign: "left" }}>
          <div style={infoStyle}>{row.ReceiverName}</div>
          <div style={infoStyle}>{row.ReceiverIDNumber}</div>
        </div>
      ),
      width: "150px",
    },
    {
      name: "Charge",
      wrap: true,
      selector: (row) => (
        <div style={{ textAlign: "left" }}>
          <div
            style={{
              color: "red",
            }}
          >
            - {currencySetter(row.ServiceCharge)}
          </div>
        </div>
      ),
      width: "80px",
    },
    {
      name: <div style={{ textAlign: "right" }}>Amount</div>,
      wrap: true,
      selector: (row) => (
        <div style={{ textAlign: "right" }}>
          <div style={infoStyle}>Sent: {currencySetter(row.SendAmount)}</div>
          <div style={infoStyle}>
            Collected: {currencySetter(row.CollectedAmount)}
          </div>
          <div style={infoStyle}>Paid: {currencySetter(row.PayAmount)}</div>
        </div>
      ),
      center: true,
      width: "200px",
    },
    {
      name: "Info",
      wrap: true,
      selector: (row) => (
        <div style={{ textAlign: "left" }}>
          <Mount visible={row.AccountNumber}>
            <div style={infoStyle}>({row.AccountNumber})</div>
          </Mount>
          <div style={infoStyle}>{row.BankName}</div>
          <div style={infoStyle}>{row.IncomeSource}</div>
        </div>
      ),
      width: "200px",
    },
    {
      name: "Status",
      wrap: true,
      selector: (row) => (
        <div
          className="d-flex align-items-start flex-column"
          style={{ textAlign: "left" }}
        >
          <div
            style={{
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "4px",
              padding: "0 6px 0 6px",
              background: getStatusColor(row.TxnStatus),
            }}
          >
            {row.TxnStatus}
          </div>
          <div style={infoStyle}>{row.PinNo}</div>
        </div>
      ),
    },
  ];

  return (
    <>
      <ApiPaginateSearch
        actionButtons={
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
           
          >
            <RefreshComponent
              onClick={() => {
                refreshFunc(setQuery);
              }}
            />
            <span className="filter-sm">
              <FilterModal
                ifPartnerPinNoFilter
                ifdateFilter
                setQuery={setQuery}
                query={query}
                clearHookCb={(cb) => {
                  refresh = cb;
                }}
                refresh={refresh}
              />
            </span>
          </Grid>
        }
        apiEnd={ApiEndpoints.NEPAL_TRANSACTION}
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
        isFilterAllowed={isFilterAllowed}
        filterComponent={
          <FilterCard
            ifPartnerPinNoFilter
            ifdateFilter
            setQuery={setQuery}
            query={query}
            clearHookCb={(cb) => {
              refresh = cb;
            }}
            refresh={refresh}
          />
        }
      />
    </>
  );
};

export default SearchTransaction;
