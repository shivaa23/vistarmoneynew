/* eslint-disable react-hooks/exhaustive-deps */
import { Box, TextField, Autocomplete, InputAdornment, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState } from "react";
import useDebounce from "../utils/Debounce";
import { get } from "../network/ApiController";

export const EX_INPUT_TYPE = {
  TEXT: 0,
  TEXT_INPUT: 1,
  AUTO_COMPLETE: 2,
  DATE: 3,
};

export const API_METHOD = {
  GET: 0,
  POST: 1,
};

function genQuery(row, keys, value, apiCallKey) {
  let query = "";
  if (value) {
    query = apiCallKey ? `${apiCallKey}=${value}` : `search=${value}`;
  }
  if (keys && row) {
    for (let i = 0; i < keys.length; i++) {
      if (typeof row[keys[i]] === "number")
        query += `&${keys[0]}=${row[keys[0]]}`;
      if (typeof row[keys[i]] === "string")
        query += `&${keys[1]}=${row[keys[0]]}`;
    }
  }
  return query;
}

function searchApiCall(
  searchApi,
  text,
  setMyOptions,
  nameKeys,
  searchParamKeys,
  row,
  myOptions,
  setApiResponse,
  apiCallKey
) {
  get(
    searchApi,
    genQuery(row, searchParamKeys, text, apiCallKey),
    () => {},
    (res) => {
      setApiResponse(res?.data?.data);
      const myList = res?.data?.data;
      const filterList = myList.map((item) => {
        let name = item;
        if (typeof name === "string" || typeof name === "number") {
          return { label: name, id: name, item: item };
        }
        for (let i = 0; i < nameKeys.length; i++) {
          name = name[nameKeys[i]];
        }
        return name;
      });
      setMyOptions(filterList);
    },
    (error) => {}
  );
}

const ApiSearch = ({
  type,
  nameKeys = ["first_name"],
  label = "Search Bank",
  placeholder,
  cb1,
  defaultValue = "",
  searchApi,
  row,
  searchParamKeys = [],
  name,
  className,
  sx,
  variant,
  apiCallKey,
  required = false,
  ...other
}) => {
  const [value, setValue] = useState(defaultValue ? defaultValue : "");
  const [apiResponse, setApiResponse] = useState([]);
  const [myOptions, setMyOptions] = useState([]);
  const debouncedValue = useDebounce(value, 200);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    if (defaultValue === "") setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    searchApiCall(
      searchApi,
      debouncedValue,
      setMyOptions,
      nameKeys,
      searchParamKeys,
      row,
      myOptions,
      setApiResponse,
      apiCallKey
    );
  }, [debouncedValue]);

  return (
    <Autocomplete
      className={className}
      {...other}
      freeSolo
      options={myOptions}
      autoHighlight
      blurOnSelect
      clearIcon={false}
      clearOnBlur
      value={value}
      isOptionEqualToValue={(option, v) => {
        if (v && value === option) {
          if (apiResponse?.length > 0) {
            let found = 0;
            for (let i = 0; i < apiResponse.length; i++) {
              const list = apiResponse[i];
              for (let j = 0; j < nameKeys.length && found === 0; j++) {
                const key = nameKeys[j];
                if (v === list[key]) {
                  setValue(v);
                  const id = list?.id;
                  const ifsc = list?.ifsc;
                  const bankId = list?.bankId;
                  const ifscGlobal = list?.ifscGlobal;
                  if (cb1) cb1({ newValue: v, id, ifsc, bankId, ifscGlobal });
                  found = 1;
                  break;
                } else {
                  if (found === 0) {
                    continue;
                  } else {
                    break;
                  }
                }
              }
            }
          }
        } else {
          setValue(v);
        }
      }}
      onChange={(event, newValue) => {
        if (newValue) {
          if (apiResponse?.length > 0) {
            let found = 0;
            for (let i = 0; i < apiResponse.length; i++) {
              const list = apiResponse[i];
              for (let j = 0; j < nameKeys.length && found === 0; j++) {
                const key = nameKeys[j];
                if (newValue === list[key]) {
                  setValue(newValue);
                  const id = list?.id;
                  const ifsc = list?.ifsc;
                  const bankId = list?.bankId;
                  const ifscGlobal = list?.ifscGlobal;
                  if (cb1) cb1({ newValue, id, ifsc, bankId, ifscGlobal });
                  found = 1;
                  break;
                } else {
                  if (found === 0) {
                    continue;
                  } else {
                    break;
                  }
                }
              }
            }
          } else {
            setValue(newValue);
            if (cb1) cb1(newValue);
          }
        } else {
          setValue("");
          if (cb1) cb1("");
        }
      }}
      clearText="No Value"
      noOptionsText="No Data Found"
      fullWidth
      sx={sx}
      renderInput={(params) => (
        <TextField autoComplete="off"
          {...params}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SearchIcon sx={{ mr: 1 }} />
              <Typography>{label}</Typography>
            </Box>
          }
          placeholder={placeholder || ""}
          size="small"
          value={value}
          onChange={handleChange}
          required={required}
        />
      )}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{
            "& > img": { mr: 2, flexShrink: 0 },
            fontSize: "12px",
            flex: 1,
            flexWrap: "nowrap",
            zIndex: 999999,
            textAlign: "left",
            overflow: "initial",
          }}
          {...props}
        >
          {option}
        </Box>
      )}
    />
  );
};

export default ApiSearch;
