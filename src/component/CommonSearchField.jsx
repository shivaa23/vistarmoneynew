import {
  Autocomplete,
  Box,
  FormControl,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BackspaceIcon from "@mui/icons-material/Backspace";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import useDebounce from "../utils/Debounce";
import Loader from "./loading-screen/Loader";

const CommonSearchField = ({
  list,
  label,
  placeholder,
  labelKey,
  valKey,
  valueGetter,
  defaultVal = "",
  filterCardStyle = false,
  onFocus,
  loading = false,
}) => {
  const filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option) => `${option[labelKey]} ${option.username}`,
  });

  const [value, setValue] = useState({ label: "", value: null });
  const debouncedValue = useDebounce(value?.label, 500);
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    if (onFocus) onFocus();
  }, [onFocus]);

  useEffect(() => {
    if (defaultVal) {
      const foundItem = list.find((item) => item[valKey] === defaultVal);
      if (foundItem) {
        setValue({ label: foundItem[labelKey], value: foundItem[valKey] });
      }
    }
  }, [defaultVal, list, labelKey, valKey]);

  useEffect(() => {
    if (debouncedValue) {
      const lowerCaseValue = debouncedValue.toLowerCase();
      const filteredList = list.filter(
        (item) =>
          item[labelKey]?.toLowerCase().includes(lowerCaseValue) ||
          String(item.username).includes(debouncedValue)
      );
      setSearchResult(filteredList);
    } else {
      setSearchResult([]);
    }
  }, [debouncedValue, list, labelKey]);

  const handleChange = (e) => {
    if (e.target.value) {
      setValue({ ...value, label: e.target.value, value: e.target.value });
      valueGetter({ ...value, label: e.target.value, value: e.target.value });
    } else {
      setValue({ label: "", value: null });
      valueGetter({ label: "", value: null });
    }
  };

  return (
    <div className="position-relative">
      <FormControl
        sx={{
          width: "103%",
          position: "relative",
        }}
      >
        {list && (
          <Autocomplete
            loading={loading}
            filterOptions={filterOptions}
            className={filterCardStyle ? "filter-input" : ""}
            id="search_particular"
            freeSolo
            size="small"
            options={
              list.length < 100 ? list : searchResult ? searchResult : []
            }
            value={value}
            onChange={(event, newValue) => {
              if (newValue) {
                setValue({
                  label: newValue[labelKey],
                  value: newValue[valKey],
                });
                valueGetter({
                  label: newValue[labelKey],
                  value: newValue[valKey],
                });
              } else {
                setValue({ label: "", value: null });
                valueGetter({ label: "", value: null });
              }
            }}
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{
                  "& > img": { mr: 2, flexShrink: 0 },
                  fontSize: "12px",
                }}
                {...props}
              >
                <Typography
                  sx={{
                    fontSize: "10px",
                    fontWeight: "normal",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {option[labelKey]} ({option.username})
                </Typography>
              </Box>
            )}
            renderInput={(params) => (
              <FormControl fullWidth>
                <TextField
                  autoComplete="off"
                  {...params}
                  size="small"
                  className="filter-input"
                  variant={"standard"}
                  multiline
                  label={label}
                  placeholder={placeholder}
                  sx={{
                    "& .MuiInputLabel-root": {
                      fontSize: "10px",
                      fontFamily: "inherit",
                      fontWeight: "normal",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                    "& .MuiInputBase-input": {
                      fontSize: "13px",
                      color: "black",
                      fontFamily: "inherit",
                      fontWeight: "normal",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      fontWeight: "normal",
                      opacity: 1,
                      fontFamily: "inherit",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                  maxRows={4}
                  value={value.label}
                  onChange={handleChange}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: <Loader loading={loading} params={params} />,
                  }}
                />
              </FormControl>
            )}
            clearIcon={
              <BackspaceIcon
                sx={{ fontSize: "15px", mr: 2.4 }}
                onClick={() => {
                  setValue({ label: "", value: null });
                  valueGetter({ label: "", value: null });
                }}
              />
            }
          />
        )}
      </FormControl>
    </div>
  );
};
export default CommonSearchField;
