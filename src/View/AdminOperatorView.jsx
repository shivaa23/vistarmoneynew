/* eslint-disable no-unused-vars */
import {
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  MenuItem,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import ApiEndpoints from "../network/ApiEndPoints";
import { useState } from "react";
import { CustomStyles } from "../component/CustomStyle";
import ActiveInactiveOperator from "../modals/ActiveInactiveOperator";
import EditOperator from "../modals/EditOperator";
import AddOperatorModal from "../modals/AddOperatorModal";
import ChangeRouteMenu from "../component/ChangeRouteMenu";
import { currencySetter } from "../utils/Currencyutil";
import FilterCard from "../modals/FilterCard";
import AuthContext from "../store/AuthContext";
import { get } from "../network/ApiController";
import { apiErrorToast } from "../utils/ToastUtil";
import ApiPaginateSearch from "../component/ApiPaginateSearch";
import { capitalize1 } from "../utils/TextUtil";
import ChangePipeMenu from "../modals/ChangePipeMenu";
import Mount from "../component/Mount";
import { ddmmyy, dateToTime } from "../utils/DateUtils";
import ActiveInactiveOpServices from "../modals/ActiveInactiveOpServices";
import EditOpServices from "../component/EditOpServices";
import CachedIcon from "@mui/icons-material/Cached";
import { Checkbox } from "@mui/material";
import { Check } from "@mui/icons-material";
let refresh;
let refreshFilter;
function refreshFunc(setQueryParams) {
  // setQueryParams("");
  if (refresh) refresh();
  // if (refreshFilter) refreshFilter();
}
const AdminOperatorView = () => {
  const [apiData, setApiData] = useState([]);
  const [apiUserData, setApiUserData] = useState([]);
  // console.log("apiUserData", apiUserData);
  // console.log("apiData", apiData);
  const [query, setQuery] = useState();
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [isShowFilterCard, setIsShowFilterCard] = useState(false);
  const [request, setRequest] = useState(false);
  const [typeList, setTypeList] = useState([]);
  const [defaultStatus, setDefaultStatus] = useState("All");
  const [showoperatorservices, setShowOperatorServices] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const handleCheckboxChange = (e, rowId) => {
    if (e.target.checked) {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, rowId]);
    } else {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((id) => id !== rowId)
      );
      setSelectAll(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allRowIds = apiData.map((row) => row.id);
      setSelectedRows(allRowIds);
      setSelectAll(true);
    } else {
      setSelectedRows([]);
      setSelectAll(false);
    }
  };
  const handleChangeStatus = (event) => {
    setDefaultStatus(
      event.target.value === "All" ? event.target.value : event.target.value * 1
    );
    if (event.target.value !== "All") {
      setQuery(`active=${event.target.value * 1}`);
    } else if (event.target.value === "All") setQuery("");
  };

  const handleOpServices = (e) => {
    setShowOperatorServices(e.target.checked);
  };
  let routeList;
  // const typeList = [
  //   { name: "UTILITY", code: "utility" },
  //   { name: "VERIFICATION", code: "verification" },
  // ];
  const statusList = [
    { name: "ACTIVE", code: 1 },
    { name: "IN-ACTIVE", code: 0 },
  ];
  const searchOptions = [{ field: "Name", parameter: "name" }];
  const [rowArray, setRowArray] = useState([]);

  const columnOptions = ["Name", "Code", "Type", "Route"];
  const columns = [
    {
      name: (
        <Checkbox
          checked={selectAll}
          onChange={handleSelectAll}
          inputProps={{ "aria-label": "Select All" }}
        />
      ),
      selector: (row) => (
        <Checkbox
          checked={selectedRows.includes(row.id)}
          onChange={(e) => handleCheckboxChange(e, row.id)}
        />
      ),
      width: "50px",
      center: true,
    },
    {
      name: "ID",
      selector: (row) => <div className="blue-highlight-txt">{row.id}</div>,
      width: "70px",
    },
    {
      name: "Name",
      selector: (row) => (
        <div style={{ fontSize: "14px", textAlign: "left" }}>{row.name}</div>
      ),
      wrap: true,
      width: "140px",
    },
    {
      name: "Code",
      selector: (row) => (
        <div style={{ fontSize: "14px", textAlign: "left" }}>{row.code}</div>
      ),
    },
    {
      name: "Type",
      selector: (row) => (
        <div style={{ fontSize: "14px", textAlign: "left" }}>
          {capitalize1(row.category)}
        </div>
      ),
      wrap: true,
      width: "140px",
    },
    {
      name: "Sub Type",
      selector: (row) => (
        <div style={{ fontSize: "14px", textAlign: "left" }}>
          {row.sub_type || "NA"}
        </div>
      ),
      wrap: true,
      width: "140px",
    },

    {
      name: <span className="mx-3">Route</span>,
      selector: (row) => (
        <div style={{ textAlign: "left", fontSize: "13px", fontWeight: "500" }}>
          {/* <div style={{ fontSize: "13px", fontWeight: "500" }}>{row.route}</div> */}
          <ChangeRouteMenu
            row={row}
            refresh={refreshFunc}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
        </div>
      ),
      center: false,
    },
    {
      name: "Adm Comm",
      selector: (row) => currencySetter(row.admin_comm),
    },
    {
      name: "Ret Comm",
      selector: (row) => currencySetter(row.ret_comm),
    },
    {
      name: "Ad Comm",
      selector: (row) => currencySetter(row.ad_comm),
    },
    {
      name: "Dd Comm",
      selector: (row) => currencySetter(row.dd_comm),
    },
    {
      name: (
        <FormControl className="customized-textfield">
          <TextField
            autoComplete="off"
            select
            value={defaultStatus}
            onChange={handleChangeStatus}
            sx={{ color: "#fff" }}
          >
            <MenuItem dense value="All">
              All
            </MenuItem>
            <MenuItem dense value="1">
              ACTIVE
            </MenuItem>
            <MenuItem dense value="0">
              IN-ACTIVE
            </MenuItem>
          </TextField>
        </FormControl>
      ),
      selector: (row) => <ActiveInactiveOperator row={row} refresh={refresh} />,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <EditOperator row={row} refresh={refresh} />
          <Box sx={{ mr: 0.5 }}>
            <Mount visible={row.code === "DMT2"}>
              <ChangePipeMenu />
            </Mount>
          </Box>
        </div>
      ),
    },
  ];
  const opcolumns = [
    {
      name: "ID",
      selector: (row) => <div className="blue-highlight-txt">{row.id}</div>,
      width: "70px",
    },
    {
      name: "Created/Updated",
      selector: (row) => (
        <>
          <div className="mb-2" style={{ textAlign: "left" }}>
            {ddmmyy(row.created_at)} {dateToTime(row.created_at)}
          </div>
          <div>
            {ddmmyy(row.updated_at)} {dateToTime(row.updated_at)}
          </div>
        </>
      ),
    },
    {
      name: "Code",
      selector: (row) => row.code,
      width: "70px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Type",
      selector: (row) => row.type,
    },
    {
      name: "Route",
      selector: (row) => row.route,
    },
    {
      name: "Admin Comm",
      selector: (row) => row.a_comm,
    },
    {
      name: (
        <FormControl className="customized-textfield">
          <TextField
            autoComplete="off"
            select
            value={defaultStatus}
            // onChange={handleChangeStatus}
          >
            <MenuItem dense value="All">
              Allasa
            </MenuItem>
            <MenuItem dense value="1">
              ACTIVE
            </MenuItem>
            <MenuItem dense value="0">
              IN-ACTIVE
            </MenuItem>
          </TextField>
        </FormControl>
      ),
      selector: (row) => (
        <ActiveInactiveOpServices row={row} refresh={refresh} />
      ),
    },
    {
      name: "Action",
      selector: (row) => (
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          {/* <EditOpServices refresh={refresh} row={row} /> */}
        </Box>
      ),
    },
  ];

  function refreshFunc(setQueryParams) {
    setDefaultStatus("Status");
    if (refresh) refresh();
    setSelectedRows("");
    // if (refreshFilter) refreshFilter();
  }

  // get types
  const getTypes = () => {
    if (typeList.length === 0) {
      get(
        ApiEndpoints.GET_CATEGORIES,
        "",
        setRequest,
        (res) => {
          const data = res.data.data;

          setTypeList(data);
        },
        (err) => {
          apiErrorToast(err);
        }
      );
    }
  };
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

          position: "relative",
        }}
      >
        {/* <Box sx={{ width: "150%" }}>
          <Mount visible={user?.role === "Admin"}>
            <FormGroup>
              <FormControlLabel
                sx={{
                  mt: { md: 0, sm: 2, xs: 2 },
                  mb: { md: 0, sm: 2, xs: 2 },
                }}
                control={
                  <Switch
                    value={showoperatorservices}
                    defaultChecked={showoperatorservices}
                    onChange={handleOpServices}
                  />
                }
                label={
                  <Typography variant="body2" style={{ fontSize: "15px" }}>
                    Api Services
                  </Typography>
                }
              />
            </FormGroup>
          </Mount>
        </Box> */}

        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
       
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

      <Grid xs={12}>
        <div>
      
          <ApiPaginateSearch
          
            actionButtons={
         ""
            }
            apiEnd={
              showoperatorservices
                ? ApiEndpoints.ADMIN_OP_SERVICE
                : ApiEndpoints.GET_OPERATOR
            }
            searchOptions={searchOptions}
            setQuery={setQuery}
            columns={showoperatorservices ? opcolumns : columns}
            apiData={showoperatorservices ? apiUserData : apiData}
            setApiData={showoperatorservices ? setApiUserData : setApiData}
            tableStyle={CustomStyles}
            queryParam={query ? query : ""}
            returnRefetch={(ref) => {
              refresh = ref;
            }}
            isFilterAllowed={user?.role?.toLowerCase() === "admin"}
            filterComponent={
              <FilterCard
                // topMargin={-1}
                // bottomMargin={-1}
                fromOperatorPage
                ifTypeFilter
                ifnameFilter
                ifrouteFilter
                ifstatusFilter
                ifsubtypeFilter
                typeList={typeList}
                getTypes={getTypes}
                routeList={routeList}
                statusList={statusList}
                setQuery={setQuery}
                query={query}
                clearHookCb={(cb) => {
                  refreshFilter = cb;
                }}
                refresh={refresh}
                isShowFilterCard={isShowFilterCard}
                actionButtons={

                  <>
                       <Grid
            item
            // md={4}
            // sm={6}
            // xs={6}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              // alignItems: "center",
            }}
          >
            <AddOperatorModal refresh={refresh} />
            <Tooltip title="refresh">
              <IconButton
                aria-label="refresh"
                // color="success"
                sx={{
                  color: "#0F52BA",
                }}
                onClick={() => {
                  refreshFunc(setQuery);
                }}
              >
                <CachedIcon className="refresh-purple" />
              </IconButton>
            </Tooltip>
          </Grid>
                  </>
                }
                setIsShowFilterCard={setIsShowFilterCard}
              />
            }
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default AdminOperatorView;
