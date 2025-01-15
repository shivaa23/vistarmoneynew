import { Box, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import ApiPaginateSearch from "../component/ApiPaginateSearch";
import { ddmmyy, dateToTime } from "../utils/DateUtils";

// Icons
import LaptopIcon from "@mui/icons-material/Laptop";
import AppleIcon from "@mui/icons-material/Apple";
import AndroidIcon from "@mui/icons-material/Android";
import ApiEndpoints from "../network/ApiEndPoints";
import { CustomStyles } from "../component/CustomStyle";
import { android2, macintosh2, windows2, linux2 } from "../iconsImports";
import AuthContext from "../store/AuthContext";
import { wrap } from "gsap";
import RefreshComponent from "../component/RefreshComponent";
import CachedIcon from "@mui/icons-material/Cached";
import FilterCard from "../modals/FilterCard";
let refresh;
const LoginHistory = () => {
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState("");
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const columns = [
    {
      name: "Login At",
      selector: (row) => (
        <div>
          {ddmmyy(row.created_at)} {dateToTime(row.created_at)}
        </div>
      ),
      width:"250px"
    },

    {
      name: "Login Ip",
      selector: (row) => (
        <Tooltip title={row.ip}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "15px",
              wordBreak: "break-word", // Allows text to break and wrap
              overflowWrap: "break-word", // Ensures text wrapping
              whiteSpace: "normal",
              textAlign: "justify",
            }}
          >
            {row.ip}
          </div>
        </Tooltip>
      ),
      width:"250px"
    },
    {
      name: "Login Device",
      selector: (row) => {
        let icon;

        if (row.device.toLowerCase().includes("windows")) {
          icon = (
            <img
              src={windows2}
              style={{ width: "22px" }}
              alt="description of image"
            />
          );
        } else if (row.device.toLowerCase().includes("android")) {
          icon = (
            <img
              src={android2}
              style={{ width: "22px" }}
              alt="description of image"
            />
          );
        } else if (row.device.toLowerCase().includes("mac")) {
          icon = (
            <img
              src={macintosh2}
              style={{ width: "22px" }}
              alt="description of image"
            />
          );
        } else if (row.device.toLowerCase().includes("linux")) {
          icon = (
            <img
              src={linux2}
              style={{ width: "22px" }}
              alt="description of image"
            />
          );
        } else {
          icon = <LaptopIcon sx={{ color: "blue", width: "22px" }} />;
        }

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: "13px",
              textAlign: "justify",
              gap: 2,
            }}
          >
            {icon}
            <Typography>{row.device}</Typography>
          </Box>
        );
      },
      width: "500px",
      wrap: true,
      center: false,
    },
  ];

  function refreshFunc(setQuery) {
    setQuery("");
    if (refresh) refresh();
  }

  return (
    <Box>
      <Grid>
        <ApiPaginateSearch
        showSearch={false}
        isFilterAllowed={true}
          filterComponent={
            <>
              <FilterCard
                ifipaddressFilter
                setQuery={setQuery}
                query={query}
                clearHookCb={(cb) => {
                  refresh = cb;
                }}
                refresh={refresh}
                actionButtons={
                  <>
                    <Tooltip title="refresh">
                      <IconButton
                        aria-label="refresh"
                        sx={{
                          color: "#0BA",
                        }}
                        onClick={() => {
                          refreshFunc(setQuery);
                        }}
                      >
                        <CachedIcon className="refresh-purple" />
                      </IconButton>
                    </Tooltip>
                  </>
                }
              />
            </>
          }   
          apiEnd={ApiEndpoints.GET_LOGIN_HISTORY}
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
    </Box>
  );
};

export default LoginHistory;
