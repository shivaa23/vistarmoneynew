/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from "react";
import { Box, Grid, Tooltip } from "@mui/material";
import ApiPaginateSearch from "../component/ApiPaginateSearch";
import { CustomStyles } from "../component/CustomStyle";
import ApiEndpoints from "../network/ApiEndPoints";
import AuthContext from "../store/AuthContext";
import DownloadInvoice from "./DownloadInvoice";
import UploadInvoice from "./UploadInvoice";

const ApiInvoice = () => {
  const [apiData, setApiData] = useState([]);

  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  let refresh;

  function refreshFunc(setQueryParams) {
    setQueryParams(``);
    if (refresh) refresh();
  }

  // Dummy data for testing
 

  // Function to handle download
 

  const columns = [
    {
      name: "Invoice#",
      selector: (row) => <span>{row.invoice || "NA"}</span>,
    },
    {
      name: "Invoice Date",
      selector: (row) => row.invoiceDate || "NA",
    },
    {
      name: "Type",
      selector: (row) => row.type || "NA",
    },
    {
      name: "Period",
      selector: (row) => row.period || "NA",
    },
    {
      name: "Actions",
      selector: (row) => (
        <>
        <DownloadInvoice row={row}/>
          <UploadInvoice/>
          {/* <Tooltip title="Upload Invoice">
            <UploadIcon sx={{ cursor: 'pointer', ml: 1 }} />
          </Tooltip> */}
        </>
      ),
    },
  ];

  return (
    <Box>
      <Grid container>
        <ApiPaginateSearch
          // API endpoint can be used when ready
          apiEnd={ApiEndpoints.GET_TRANSACTIONS}
          columns={columns}
          apiData={apiData}
          tableStyle={CustomStyles}
          setApiData={setApiData}
          returnRefetch={(ref) => {
            refresh = ref;
          }}
        />
      </Grid>
    </Box>
  );
};

export default ApiInvoice;
