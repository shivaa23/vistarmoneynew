import { FormControl, TextField } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import useDebounce from "../utils/Debounce";
import ApiEndpoints from "../network/ApiEndPoints";
import Autocomplete from "@mui/material/Autocomplete";
import { get } from "../network/ApiController";
import { apiErrorToast } from "../utils/ToastUtil";
import Loader from "../component/loading-screen/Loader";

const TransactionSearch = ({ pendingTxnList, defaultTxn, setDefaultTxn }) => {
  const [value, setValue] = useState(false);
  const [request, setRequest] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [userList, setUserList] = React.useState([]);
  const debouncedValue = useDebounce(defaultTxn, 500);

  const handleChange = (e) => {
    if (e.target.value) {
      setDefaultTxn(e.target.value);
    } else {
      setDefaultTxn("");
      setSearchResult([]);
      // handleClose();
    }
  };

  return (
    <FormControl
      sx={{
        width: "100%",
        position: "relative",
      }}
    >
      <Loader loading={request} circleBlue />
      {pendingTxnList && (
        <Autocomplete
          id="search_particular"
          freeSolo
          size="small"
          options={
            pendingTxnList
              ? pendingTxnList.map((item) => {
                  return (
                    item.created_at +
                    "/" +
                    item.description +
                    "/" +
                    (item.credit <= 0 ? item.debit : item.credit)
                  );
                })
              : ""
          }
          value={defaultTxn}
          sx={{ width: "96%", fontFamily: "Poppins", fontSize: "13px" }}
          onChange={(event, newValue) => {
            setDefaultTxn(newValue);
          }}
          renderInput={(params) => (
            <TextField autoComplete="off"
              {...params}
              size="small"
              // multiline
              label="Search Transaction"
              placeholder="Search"
              required
              sx={{
                fontFamily: "Poppins",
                fontSize: "13px",
              }}
              // maxRows={10}
              value={value && value}
              onChange={handleChange}
            />
          )}
        />
      )}
    </FormControl>
  );
};

export default TransactionSearch;
