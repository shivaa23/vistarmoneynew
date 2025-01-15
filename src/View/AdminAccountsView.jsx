import { Box, Grid, IconButton, Button, Tooltip } from "@mui/material";
import React from "react";
import ApiEndpoints from "../network/ApiEndPoints";
import { useState } from "react";
import { CustomStyles } from "../component/CustomStyle";
import AddBankAddAccountModal from "../modals/AddBankAccountModal";
import { useNavigate } from "react-router-dom";
import UpdateAccount from "../modals/UpdateAccount";
import { currencySetter, numberSetter } from "../utils/Currencyutil";
import ApiPaginateSearch from "../component/ApiPaginateSearch";
import moment from "moment";
import { get } from "../network/ApiController";
import { json2Csv, json2Excel } from "../utils/exportToExcel";
import { apiErrorToast } from "../utils/ToastUtil";
import ExcelUploadModal from "../modals/ExcelUploadModal";
import CachedIcon from "@mui/icons-material/Cached";
import FilterCard from "../modals/FilterCard";
import useCommonContext from "../store/CommonContext";
import { capitalize1 } from "../utils/TextUtil";
import { dateToTime, ddmmyy } from "../utils/DateUtils";
let refresh;
let handleCloseModal;

const AdminAccountsView = () => {
  const searchOptions = [
    { field: "Business name", parameter: "est" },
    { field: "Name", parameter: "name" },
    { field: "Number", parameter: "number" },
    { field: "ASM", parameter: "asm" },
  ];

  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();
  const [searchIn, setSearchIn] = useState(searchOptions[0].parameter);
  // eslint-disable-next-line no-unused-vars
  const [search, setSearch] = useState();
  const [debounceSearch, setdebounceSearch] = useState();
  const [request, setRequest] = useState(false);
  const [noOfResponses, setNoOfResponses] = useState(0);

  const [isShowFilterCard, setIsShowFilterCard] = useState(false);
  const {
    setChooseInitialCategoryFilter,
    chooseInitialCategoryFilter,
    refreshUser,
  } = useCommonContext();

  function refreshFunc(setQueryParams) {
    if (refresh) refresh();
  }

  const navigate = useNavigate();

  function refreshFunc(setQueryParams) {
    setQueryParams("");
    setSearch("");
    setSearchIn("est");
    setdebounceSearch("");
    if (refresh) refresh();
  }

  const filterFunc = (item, SearchInput = "") => {
    return searchIn && searchIn === "name"
      ? item.name && item.name.toLowerCase().includes(SearchInput.toLowerCase())
      : searchIn && searchIn === "est"
      ? item.establishment &&
        item.establishment.toLowerCase().includes(SearchInput.toLowerCase())
      : searchIn && searchIn === "asm"
      ? item.asm && item.asm.toLowerCase().includes(SearchInput.toLowerCase())
      : searchIn && searchIn === "number"
      ? item.mobile &&
        ("" + item.mobile).toLowerCase().includes(SearchInput.toLowerCase())
      : "";
  };
  const getExcel = () => {
    get(
      ApiEndpoints.GET_ACCOUNTS,
      `${
        query
          ? query + "&page=1&paginate=10&export=1"
          : "&page=1&paginate=10&export=1"
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
          `Accounts ${moment(new Date().toJSON()).format(
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
      ApiEndpoints.GET_ACCOUNTS,
      `${
        query
          ? query + "&page=1&paginate=10&export=1"
          : "&page=1&paginate=10&export=1"
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
      name: "ID",
      selector: (row) => <div className="blue-highlight-txt">{row.id}</div>,
      width: "70px",
    },
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
      name: "Name",
      // name: (
      //   <FilterComponent
      //     name="Name"
      //     onChangeValue={(value) => {
      //       setSearch(value);
      //       setSearchIn("name");
      //     }}
      //   />
      // ),
      selector: (row) => (
        <Box sx={{ fontSize: "13px", textAlign: "left" }}>
          {capitalize1(row.name)}
        </Box>
      ),
      wrap: "true",
    },

    {
      name: "Establishment",
      // name: (
      //   <FilterComponent
      //     name="Business name"
      //     onChangeValue={(value) => {
      //       setSearch(value);
      //       setSearchIn("est");
      //     }}
      //   />
      // ),
      selector: (row) => (
        <Box sx={{ fontSize: "13px", textAlign: "left" }}>
          {capitalize1(row.establishment)}
        </Box>
      ),
      wrap: "true",
    },
    {
      name: "Number",
      // name: (
      //   <FilterComponent
      //     name="Number"
      //     onChangeValue={(value) => {
      //       setSearch(value);
      //       setSearchIn("number");
      //     }}
      //   />
      // ),
      selector: (row) => <div style={{ fontSize: "13px" }}>{row.mobile}</div>,
    },
    {
      name: "Type",
      selector: (row) => <div style={{ fontSize: "13px" }}>{row.type}</div>,
    },
    {
      name: "ASM",
      // name: (
      //   <FilterComponent
      //     name="ASM"
      //     onChangeValue={(value) => {
      //       setSearch(value);
      //       setSearchIn("asm");
      //     }}
      //   />
      // ),
      selector: (row) => <div style={{ fontSize: "13px" }}>{row.asm}</div>,
    },
    {
      name: "Credit Limit",
      selector: (row) => numberSetter(row.creditlimit),
      grow: 1,
    },
    {
      name: "Balance",
      selector: (row) => (
        <span style={{ color: row.balance < 0 ? "green" : "red" }}>
          {currencySetter(row.balance)}
        </span>
      ),
      grow: 1,
    },
    {
      name: <span className="mx-5"> Actions</span>,
      selector: (row) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="statement">
            <Button
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "8px",
                fontSize: "12px",
                color: "#ffffff",
                fontWeight: "700",
                borderRadius: "8px  ",
                transition: "all 0.3s ease",
                justifyContent: "center",
                background: "#00A86B",
                // background: "linear-gradient(45deg, #ff9248, 	#ff6600)",
                boxShadow: "0px 4px 15px rgba(255, 165, 0, 0.2)",
                "&:hover": {
                  boxShadow: "0px 6px 20px rgba(255, 165, 0, 0.2)",
                  background: "#e0561f",
                },
              }}
              onClick={() => {
                navigate("/admin/accountStatement", {
                  state: {
                    mobile: row.mobile,
                    acc_name: row.establishment,
                    bal: row.balance,
                  },
                });
              }}
            >
              Statement
            </Button>

            {/* <Button
              display={row.status && row.status === "1" ? "none" : ""}
              style={{
                color: "green",
                fontSize: "10px",
              }}
              onClick={() => {
                navigate("/admin/accountStatement", {
                  state: {
                    mobile: row.mobile,
                    acc_name: row.establishment,
                    bal: row.balance,
                  },
                });
              }}
            >
              Statement
            </Button> */}
          </Tooltip>
          <UpdateAccount row={row} refresh={refresh} />
        </Box>
      ),
      width: "170px",
    },
  ];

  return (
    <Box>
      <ApiPaginateSearch
          showSearch={true}
        actionButtons={
          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                maxWidth: "70%",
              }}
            >
              {/* <FilterCard
                // ifdateFilter
                ifestFilter
                ifUsernameFilter
                ifAsmFilter
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
                sx={{
                  width: "100%", // Ensure it takes the full width of its container
                }}
              /> */}
            </Box>

            <Grid
              item
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <Box sx={{ mr: 0.6 }}>
                <AddBankAddAccountModal />
              </Box>

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

              <Tooltip title="refresh">
                <IconButton
                  aria-label="refresh"
                  sx={{
                    width: "30px",
                    color: "#0F52BA",
                    textAlign: "center",
                  }}
                  onClick={() => {
                    refreshFunc(setQuery);
                  }}
                >
                  <CachedIcon className="refresh-purple" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        }
        apiEnd={ApiEndpoints.GET_ACCOUNTS}
        searchOptions={searchOptions}
        setQuery={setQuery}
        columns={columns}
        apiData={apiData}
        tableStyle={CustomStyles}
        setApiData={setApiData}
        ExpandedComponent={null}
        queryParam={query ? query : ""}
        returnRefetch={(ref) => {
          refresh = ref;
        }}
        responses={(val) => {
          setNoOfResponses(val);
        }}
        paginateServer={false}
        paginate={true}
        filterData
        DBvalue={(backval) => {
          setdebounceSearch(backval);
        }}
        choseVal={(backVal) => {
          setSearchIn(backVal);
        }}
        filterFunc={filterFunc}
        search={debounceSearch && debounceSearch}
      />
    </Box>
  );
};

export default AdminAccountsView;
