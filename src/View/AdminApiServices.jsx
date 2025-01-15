import {
  Box,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import ApiEndpoints from "../network/ApiEndPoints";
import { CustomStyles } from "../component/CustomStyle";
import ActiveInactiveOpServices from "../modals/ActiveInactiveOpServices";
import EditOpServices from "../component/EditOpServices";
import CachedIcon from "@mui/icons-material/Cached";
import ApiPaginateSearch from "../component/ApiPaginateSearch";
import FilterCard from "../modals/FilterCard";
import AuthContext from "../store/AuthContext";
import Mount from "../component/Mount";
import AddOperatorModal from "../modals/AddOperatorModal";
import { ddmmyy, dateToTime1 } from "../utils/DateUtils";

let refresh;

const AdminApiServices = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [value, setValue] = useState(0);
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();
  const [isShowFilterCard, setIsShowFilterCard] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState("All");

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
          <div className="mb-2">
            {ddmmyy(row.created_at)} {dateToTime1(row.created_at)}
          </div>
          <div>
            {ddmmyy(row.updated_at)} {dateToTime1(row.updated_at)}
          </div>
        </>
      ),
    },
    {
      name: "Code",
      selector: (row) => row.code,
      
    },
    {
      name: "Name",
      selector: (row) => (
        <Tooltip title={row.name}>
          <span>{row.name}</span>
        </Tooltip>
      ),
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
      selector: (row) => (
        <ActiveInactiveOpServices row={row} refresh={refresh} />
      ),
    },
    {
      name: "Action",
      selector: (row) => (
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <EditOpServices refresh={refresh} row={row} />
        </Box>
      ),
    },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid xs={12}>
      <div>
        <ApiPaginateSearch
          actionButtons={
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-start", md: "flex-end" },
                alignItems: "center",
                mt: "-45px",
                gap: 1,
              }}
            >
              <Mount visible={user?.role === "Admin"}>
                <Box display="flex" alignItems="center">
                  <AddOperatorModal />
                  <Tooltip title="refresh">
                    <IconButton aria-label="refresh" sx={{ color: "#0F52BA" }}>
                      <CachedIcon className="refresh-purple" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Mount>
            </Grid>
          }
          apiEnd={ApiEndpoints.GET_OPERATOR}
          setQuery={setQuery}
          columns={opcolumns}
          apiData={apiData}
          setApiData={setApiData}
          tableStyle={CustomStyles}
          queryParam={query || ""}
          returnRefetch={(ref) => {
            refresh = ref;
          }}
          isFilterAllowed={user?.role?.toLowerCase() === "admin"}
          filterComponent={
            <FilterCard
              fromOperatorPage
              ifTypeFilter
              ifnameFilter
              ifrouteFilter
              ifstatusFilter
              setQuery={setQuery}
              query={query}
              refresh={refresh}
              isShowFilterCard={isShowFilterCard}
              setIsShowFilterCard={setIsShowFilterCard}
            />
          }
        />
      </div>
    </Grid>
  );
};

export default AdminApiServices;
