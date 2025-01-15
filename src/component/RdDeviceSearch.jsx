/* eslint-disable react-hooks/exhaustive-deps */
import { FormControl, TextField } from "@mui/material";
import React from "react";
import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import useDebounce from "../utils/Debounce";
import { useEffect } from "react";

const RdDeviceSearch = ({
  label = "Select RD Device",
  list,
  nameKeys = ["info"],
  cb,
  defaultValue,
}) => {
  const [value, setValue] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
      const li = list?.find(
        (item) => item?.info.toLowerCase() === defaultValue.toLowerCase()
      );
      if (li) {
        if (cb) cb(li);
      }
    } else {
      setValue("");
    }
    return () => {};
  }, [defaultValue]);

  const handleChange = (e) => {
    if (e.target.value) {
      setValue(e.target.value);
    } else {
      setValue(e.target.value);
      setSearchResult([]);
    }
  };

  const myOptions =
    list?.length > 0
      ? list?.map((item) => {
          let name = item;
          for (let i = 0; i < nameKeys.length; i++) {
            name = name[nameKeys[i]];
          }
          return { label: name, status: item.status, item: item };
        })
      : [];

  return (
    <FormControl
      sx={{
        width: "100%",
        position: "relative",
      }}
    >
      <Autocomplete
        id="search_particular"
        size="small"
        noOptionsText="No device found"
        options={myOptions}
        value={{
          label: value?.info ? value.info : value,
          status: value?.status,
          item: value,
        }}
        sx={{
          width: "96%",
          fontFamily: "Poppins",
          fontSize: "13px",
        }}
        onChange={(event, newValue) => {
          if (newValue) {
            setValue(newValue.item);
            if (cb) cb(newValue.item);
          } else {
            setValue("");
          }
        }}
        renderInput={(params) => (
          <TextField autoComplete="off"
            {...params}
            size="small"
            multiline
            label={label}
            placeholder="Select RD Device"
            sx={{
              fontFamily: "Poppins",
              fontSize: "13px",
            }}
            maxRows={10}
            value={value}
            //   defaultValue={}
            onChange={handleChange}
            required
          />
        )}
      />
    </FormControl>
  );
};

export default RdDeviceSearch;
