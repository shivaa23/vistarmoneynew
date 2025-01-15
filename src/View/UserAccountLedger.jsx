import {
  Box,
  Button,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import ApiPaginate from "../component/ApiPaginate";
import { CustomStyles } from "../component/CustomStyle";
import ApiEndpoints from "../network/ApiEndPoints";
import CachedIcon from "@mui/icons-material/Cached";
import { datemonthYear, yyyymmdd } from "../utils/DateUtils";
import { get } from "../network/ApiController";
import { apiErrorToast } from "../utils/ToastUtil";
import moment from "moment";
import { json2Csv, json2Excel } from "../utils/exportToExcel";
import ExcelUploadModal from "../modals/ExcelUploadModal";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";
import { currencySetter } from "../utils/Currencyutil";
import { DateRangePicker } from "rsuite";
import { primaryColor } from "../theme/setThemeColor";
import useCommonContext from "../store/CommonContext";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import predefinedRanges from "../utils/predefinedRanges";

const UserAccountLedger = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [apiData, setApiData] = useState();
  const [request, setRequest] = useState();

  const [query, setQuery] = useState(`mobile=${user?.username}`);

  const [noOfResponses, setNoOfResponses] = useState(0);
  const [filterValues, setFilterValues] = useState({ date: {}, dateVal: null });
  // const [radioValue, setRadioValue] = React.useState();
  const [excelrequest, setExcelRequest] = useState(false);
  const navigate = useNavigate();

  const { setChooseInitialCategoryFilter } = useCommonContext();

  const { afterToday } = DateRangePicker;

  let refresh;
  let handleCloseModal;
  function refreshFunc() {
    setQuery(`mobile=${user?.username}`);
    if (refresh) refresh();
    setFilterValues({ ...filterValues, date: {}, dateVal: null });
  }

  const columns = [
    {
      name: (
        <div>
          <DateRangePicker
            showOneCalendar
            placeholder="Date"
            size="xs"
            cleanable
            value={filterValues.dateVal}
            ranges={predefinedRanges}
            onChange={(value) => {
              const dateVal = value;
              const dates = {
                start: dateVal[0],
                end: dateVal[1],
              };
              setFilterValues({
                ...filterValues,
                date: {
                  start: yyyymmdd(dates.start),
                  end: yyyymmdd(dates.end),
                },
                dateVal,
              });
              setQuery(
                `mobile=${user?.username}&start=${yyyymmdd(
                  dates.start
                )}&end=${yyyymmdd(dates.end)}`
              );
            }}
            disabledDate={afterToday()}
          />
        </div>
      ),
      selector: (row) => datemonthYear(row.created_at),
      grow: 1,
    },

    {
      name: "Remarks",
      selector: (row) => (
        <div
          className="break-words"
          style={{
            // overflow: "hidden",
            display: "flex",
            justifyContent: "flex-start",
            textAlign: "left",
          }}
        >
          {row.remarks}
        </div>
      ),
      width: "350px",
      wrap: true,
      // grow: 3,
      center: false,
    },
    {
      name: "Bank Name",
      selector: (row) => row.bank,
      grow: 1.2,
    },
    {
      name: "Given",
      selector: (row) => currencySetter(row.given),
    },
    {
      name: "Taken",
      selector: (row) => currencySetter(row.taken),
    },
    {
      name: "Balance",
      selector: (row) => currencySetter(row.balance),
    },
  ];
  const getExcel = () => {
    get(
      ApiEndpoints.GET_ACCOUNT_STATEMENT,
      `${
        query
          ? query + "&page=1&paginate=10&export=1"
          : "page=1&paginate=10&export=1"
      }`,
      setExcelRequest,
      (res) => {
        const apiData = res.data.data;

        const newApiData = apiData.map((item) => {
          const created_at = moment(item.created_at && item.created_at).format(
            "DD-MM-YYYY"
          );
          const updated_at = moment(item.updated_at && item.updated_at).format(
            "DD-MM-YYYY"
          );
          return { ...item, created_at, updated_at };
        });
        json2Excel(
          `Khata Statement ${moment(new Date().toJSON()).format(
            "Do MMM YYYY"
          )} | ${moment(new Date().toJSON()).format("hh:mm a")}`,
          JSON.parse(JSON.stringify(newApiData && newApiData))
        );
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const getCsv = () => {
    get(
      ApiEndpoints.GET_ACCOUNT_STATEMENT,
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
          `Account Ledger ${moment(new Date().toJSON()).format(
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

  return (
    <Grid container>
      <Grid
        item
        md={12}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 1,
          alignItems: "center",
        }}
      >
        {/*  */}
        <Box
          sx={{ width: "50%", textAlign: "left" }}
          // hidden={role === USER_ROLES.ADMIN && role === USER_ROLES.API}
        >
          <Button
            size="small"
            className="otp-hover-purple mb-2"
            sx={{
              color: primaryColor(),
            }}
            onClick={() => {
              setChooseInitialCategoryFilter(false);
              navigate("/customer/transactions");
            }}
          >
            <KeyboardBackspaceIcon fontSize="small" /> Back
          </Button>
        </Box>
        <Box sx={{ width: "50%", display: "flex", justifyContent: "flex-end" }}>
          <Tooltip title="export">
            <ExcelUploadModal
              btn
              twobuttons="Download Csv"
              dateFilter
              request={excelrequest}
              getExcel={getExcel}
              getCsv={getCsv}
              filterValues={filterValues}
              setFilterValues={setFilterValues}
              noOfResponses={noOfResponses}
              setQuery={setQuery}
              defaultQuery={"mobile"}
              queryValue={user?.username}
              handleCloseCB={(closeModal) => {
                handleCloseModal = closeModal;
              }}
            />
          </Tooltip>

          <Tooltip title="refresh">
            <IconButton
              aria-label="refresh"
              color="success"
              onClick={() => {
                refreshFunc(setQuery);
              }}
            >
              <CachedIcon className="refresh-purple" />
            </IconButton>
          </Tooltip>
        </Box>
      </Grid>
      <Grid item md={12}>
        <ApiPaginate
          apiEnd={ApiEndpoints.GET_ACCOUNT_STATEMENT}
          columns={columns}
          tableStyle={CustomStyles}
          apiData={apiData}
          setApiData={setApiData}
          queryParam={query ? query : ""}
          returnRefetch={(ref) => {
            refresh = ref;
          }}
          ExpandedComponent={null}
          responses={(val) => {
            setNoOfResponses(val);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default UserAccountLedger;
