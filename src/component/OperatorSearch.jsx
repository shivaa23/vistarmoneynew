import { TextField, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import useDebounce from "../utils/Debounce";
import ApiEndpoints from "../network/ApiEndPoints";
import Autocomplete from "@mui/material/Autocomplete";
import { get } from "../network/ApiController";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { apiErrorToast } from "../utils/ToastUtil";

const OperatorSearch = ({
  className = "",
  obj,
  endpt = ApiEndpoints.GET_OPERATOR,
  label = "",
  placeholder = "",
  size = "small",
  variant = "outlined",
  inputRef,
}) => {
  const [value, setValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [operatorList, setOperatorList] = useState([]);
  const debouncedValue = useDebounce(value, 500);

  const getOperator = () => {
    get(
      endpt,
      "",
      null,
      (res) => {
        setOperatorList(res.data.data);
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  useEffect(() => {
    getOperator();
  }, []);

  const handleChange = (e) => {
    setValue(e.target.value);
    if (!e.target.value) {
      setSearchResult([]);
    }
  };

  useEffect(() => {
    if (debouncedValue && typeof debouncedValue !== "object") {
      if (operatorList.length > 0) {
        const arr = operatorList
          .filter((operator) =>
            operator.name.toLowerCase().includes(debouncedValue.toLowerCase())
          )
          .map((operator) => operator.name);
        setSearchResult(arr);
      }
    }
  }, [debouncedValue]);

  return (
    <Box
      sx={{
        mt: 2,
        width: {
          xs: "100%",
          sm: "80%",
          md: "80%",
          lg: "80%",
          xl: "80%",
        },
      }}
    >
      {operatorList && (
        <Autocomplete
          className="filter-input"
          id="search_particular"
          freeSolo
          size="small"
          options={searchResult.length > 0 ? searchResult : []}
          value={value}
          onChange={(event, newValue) => {
            if (newValue) {
              const selectedOperator = operatorList.find(
                (operator) => operator.name === newValue
              );
              if (selectedOperator) {
                obj(selectedOperator);
              }
              setValue(newValue);
            }
          }}
          renderInput={(params) => (
            <TextField
              autoComplete="off"
              {...params}
              className="filter-input"
              size={size}
              variant={variant}
              label={label || ""}
              placeholder={placeholder || ""}
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: "14px",
                  color: "black",
                },
                "& .MuiInputBase-input::placeholder": {
                  fontSize: "14px",
                  opacity: 1,
                },
              }}
              value={value}
              inputRef={inputRef}
              onChange={handleChange}
              required
            />
          )}
          clearIcon={
            <BackspaceIcon
              sx={{ fontSize: "15px", ml: 0 }}
              onClick={() => {
                setValue("");
                setSearchResult([]);
                obj(null);
              }}
            />
          }
        />
      )}
    </Box>
  );
};

export default OperatorSearch;
