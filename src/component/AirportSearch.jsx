import { Autocomplete, Box, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import useDebounce from "../utils/Debounce";
import { getId } from "../utils/Apihelper";

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

function genQuery(row, keys, value, defaultQuery) {
  let query = `${defaultQuery}&search=${value}`;
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
  defaultQuery
) {
  // get(
  //   searchApi,
  //   genQuery(row, searchParamKeys, text),
  //   null,
  //   (res) => {
  //     setApiResponse(res?.results);
  //     const myList = res.results;
  //     const filterList = myList.map((item) => {
  //       let name = item;
  //       if (typeof name === "string" || typeof name === "number") {
  //         return { label: name, id: name, item: item };
  //       }
  //       for (let i = 0; i < nameKeys.length; i++) {
  //         name = name[nameKeys[i]];
  //       }
  //       return name;
  //     });
  //     setMyOptions(filterList);
  //   },
  //   (error) => {}
  // );
  getId(
    searchApi,
    text,
    null,
    (res) => {},
    (error) => {},
    genQuery(row, searchParamKeys, text, defaultQuery),
    (results) => {
      setApiResponse(results);
      const myList = results;
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
    }
  );
}

const AirportSearch = ({
  type,
  list,
  nameKeys = ["name"],
  iconKeys = [],
  printFunc = undefined,
  label,
  placeholder,
  cb1,
  defaultValue = "",
  width = "100%",
  onFocusOut,
  inputApi,
  apiMethod = 0,
  searchApi,
  row,
  searchParamKeys = [],
  response = undefined,
  defaultQuery = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState(
    defaultValue ? defaultValue : type === EX_INPUT_TYPE.DATE ? dayjs() : ""
  );
  const [apiResponse, setApiResponse] = useState([]);
  const [myOptions, setMyOptions] = useState([]);
  const debouncedValue = useDebounce(value, 200);

  const spanStyle = {
    paddingLeft: 8,
    // paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    width: width,
    height: "100%",
    textAlign: "start",
    color: "#000000",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const handleChange = (e) => {
    if (e.target.value) {
      setValue(e.target.value);
    } else {
      setValue(e.target.value);
    }
  };

  useEffect(() => {
    if (debouncedValue && !debouncedValue.label && searchApi) {
      searchApiCall(
        searchApi,
        debouncedValue,
        setMyOptions,
        nameKeys,
        searchParamKeys,
        row,
        myOptions,
        setApiResponse,
        defaultQuery
      );
    }
  }, [debouncedValue]);

  if (!isFocused) {
    return (
      <div
        tabIndex={0}
        style={spanStyle}
        onClick={() => {
          setIsFocused(true);
        }}
        onFocus={() => {
          setIsFocused(true);
        }}
      >
        {value ? value : ""}
      </div>
    );
  } else {
    if (type && type === EX_INPUT_TYPE.AUTO_COMPLETE) {
      return (
        <Autocomplete
          freeSolo
          className="customized-textfield"
          options={myOptions}
          autoHighlight
          openOnFocus
          selectOnFocus
          clearIcon={false}
          value={value}
          onChange={(event, newValue) => {
            if (newValue) {
              if (apiResponse && apiResponse.length > 0) {
                for (let i = 0; i < apiResponse.length; i++) {
                  let list = apiResponse[i];
                  if (list.name || list.number || list.CityCode === newValue) {
                    setValue(newValue);
                    const id = list?.id;
                    if (cb1) cb1({ newValue, id, list });
                    break;
                  }
                }
              } else {
                setValue(newValue);
                if (cb1) cb1(newValue);
              }
            } else {
              setValue();
            }
          }}
          sx={{
            width: width,
            zIndex: 999999,
            marginLeft: "0px",
            background: "#e3e3e3",
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          clearText="No Value"
          noOptionsText="No Data Found"
          renderInput={(params) => (
            <TextField autoComplete="off"
              id="atxf"
              autoFocus
              {...params}
              label={label ? label : ""}
              placeholder={placeholder ? placeholder : ""}
              size="small"
              value={value}
              onChange={handleChange}
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
              {/* {printFunc ? printFunc(option) : option?.label} */}
              {option}
            </Box>
          )}
        />
      );
    }
  }
};

export default AirportSearch;
