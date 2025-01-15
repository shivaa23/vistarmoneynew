import React from "react";
import { useState } from "react";
import CachedIcon from "@mui/icons-material/Cached";
import {
  Box,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import ApiPaginateSearch from "../../../component/ApiPaginateSearch";
import ApiEndpoints from "../../../network/ApiEndPoints";
import { CustomStyles } from "../../../component/CustomStyle";

let refresh;
function refreshFunc(setQueryParams) {
  if (refresh) refresh();
}
const Customers = () => {
  const [query, setQuery] = useState();
  const [apiData, setApiData] = useState([]);
  const [isUnverifiedCustomers, setIsUnverifiedCustomers] = useState(false);

  const searchOptions = [{ field: "Name", parameter: "name" }];

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      width: "70px",
    },
  ];

  return (
    <Grid container xs={12}>
      <Grid xs={12}>
        <div className="my-2">
          <ApiPaginateSearch
            actionButtons={
              <Grid
                item
                md={8}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { md: "end", xs: "start" },
                  flexDirection: { md: "row", xs: "column" },
                }}
              >
                <FormGroup
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    mr: 2,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        value={isUnverifiedCustomers}
                        defaultChecked={isUnverifiedCustomers}
                        onChange={() =>
                          setIsUnverifiedCustomers(!isUnverifiedCustomers)
                        }
                      />
                    }
                  />
                  <Typography variant="caption">
                    {isUnverifiedCustomers ? "Unverified" : "Verified"}
                  </Typography>
                </FormGroup>
                <Box
                  sx={{ display: "flex", justifyContent: "end", mr: 5, mt: 2 }}
                >
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
            }
            apiEnd={ApiEndpoints.NEPAL_UVCUSTOMERS}
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
        </div>
      </Grid>
    </Grid>
  );
};

export default Customers;
