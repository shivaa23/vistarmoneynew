import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import ApiPaginate from "../component/ApiPaginate";
import { CustomStyles } from "../component/CustomStyle";
import ApiEndpoints from "../network/ApiEndPoints";
import CachedIcon from "@mui/icons-material/Cached";
import { datemonthYear } from "../utils/DateUtils";
import useCommonContext from "../store/CommonContext";
import { useNavigate } from "react-router-dom";

const RetMyComplaints = () => {
  let refresh;
  function refreshFunc(setQuery) {
    setQuery(`status=OPEN`);
    if (refresh) refresh();
  }

  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState(`status=OPEN`);
  const [defaultStatus, setDefaultStatus] = useState("OPEN");
  const { setChooseInitialCategoryFilter } = useCommonContext();

  const navigate = useNavigate();
  const handleChangeStatus = (event) => {
    setDefaultStatus(event.target.value);
    if (event.target.value === "OPEN") setQuery(`status=OPEN`);
    else if (event.target.value === "CLOSED") setQuery(`status=CLOSED`);
  };

  const columns = [
    {
      name: "Date",
      selector: (row) => (
        <div>
          <div>{datemonthYear(row.created_at)}</div>
          <div>{datemonthYear(row.updated_at)}</div>
        </div>
      ),
    },
    // {
    //   name: "Operator/Route",
    //   selector: (row) => (
    //     <div style={{ textAlign: "left" }}>
    //       <div>{row.operator}</div>
    //       <div>{row.route}</div>
    //     </div>
    //   ),
    //   grow: 1.5,
    //   wrap: true,
    //   width: "150px",
    // },
    {
      name: "Number",
      selector: (row) => row.number,
      grow: 1,
    },
    {
      name: "Amount",
      selector: (row) => Number(row.amount).toFixed(2),
      grow: 1,
    },
    {
      name: "Txn ID/Status",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>
          <div>{row.txnId}</div>
          <div>{row.txn_status}</div>
        </div>
      ),
      grow: 2,
    },

    {
      name: "Message",
      cell: (row) => <div style={{ textAlign: "left" }}>{row.msg}</div>,
      width: "150px",
      wrap: true,
    },
    {
      name: "Remark",
      cell: (row) => <div style={{ textAlign: "left" }}>{row.remark}</div>,
      wrap: true,
    },
    {
      name: (
        <FormControl className="customized-textfield ms-3">
          <TextField autoComplete="off"
            select
            value={defaultStatus && defaultStatus}
            onChange={(event) => {
              handleChangeStatus(event);
            }}
            sx={{ color: "#fff" }}
          >
            <MenuItem dense value="OPEN">
              OPEN
            </MenuItem>
            <MenuItem dense value="CLOSED">
              CLOSED
            </MenuItem>
          </TextField>
        </FormControl>
      ),
      selector: (row) => <div style={{ textAlign: "right" }}>{row.status}</div>,
      center: true,
      width: "150px",
    },
  ];
  return (
    <Box>
      <Grid
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { md: 0.5, xs: 2 },
        }}
      >
        <Box

        // hidden={role === USER_ROLES.ADMIN && role === USER_ROLES.API}
        >
            {/* <Button
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
            </Button> */}
        </Box>

        <Box>
          <Tooltip title="refresh">
            <IconButton
              aria-label="refresh"
           sx={{   color:"#0F52BA"}}
              onClick={() => {
                refreshFunc(setQuery);
              }}
            >
              <CachedIcon className="refresh-purple" />
            </IconButton>
          </Tooltip>
        </Box>
      </Grid>
      <Grid sx={{ pr: { xs: 1.3, lg: 0 } }}>
        <ApiPaginate
          apiEnd={ApiEndpoints.COMPLAINTS}
          columns={columns}
          apiData={apiData}
          tableStyle={CustomStyles}
          setApiData={setApiData}
          queryParam={query ? query : ""}
          returnRefetch={(ref) => {
            refresh = ref;
          }}
          ExpandedComponent={null}
        />
      </Grid>
    </Box>
  );
};

export default RetMyComplaints;
