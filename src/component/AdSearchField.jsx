/* eslint-disable react-hooks/exhaustive-deps */
import { FormControl, TextField } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import useDebounce from "../utils/Debounce";
import ApiEndpoints from "../network/ApiEndPoints";
import Autocomplete from "@mui/material/Autocomplete";
import { get } from "../network/ApiController";
import { apiErrorToast } from "../utils/ToastUtil";

const AdSearchField = ({
  row,
  items,
  bankObj,
  ifscObj,
  endpt = ApiEndpoints.AEPS_BANK,
  label = "Search Ad",
  fromProfile = false,
  inputRef,
}) => {
  const [value, setValue] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [adList, setAdList] = React.useState([]);
  const [apiLoader, setAdApiLoader] = useState(false);
  const debouncedValue = useDebounce(value, 500);
  const getAdValue = () => {
    get(
      ApiEndpoints.GET_USERS,
      `page=1&paginate=10&role=Ad&platform=WEB&export=`,
      setAdApiLoader,
      (res) => {
        const adArray = res.data.data;
        setAdList(
          adArray &&
            adArray.map((item) => {
              return {
                id: item.id,
                name: item.establishment,
              };
            })
        );
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };
  useEffect(() => {
    getAdValue();
    return () => {};
  }, []);

  const handleChange = (e) => {
    if (e.target.value) {
      setValue(e.target.value);
    } else {
      setValue(e.target.value);
      setSearchResult([]);
    }
  };

  useEffect(() => {
    if (debouncedValue) {
      if (adList && adList.length > 0) {
        if (debouncedValue) {
          const arr =
            adList &&
            adList
              .filter((bank) => {
                return (
                  (bank &&
                    bank.name &&
                    bank.name
                      .toLowerCase()
                      .includes(
                        debouncedValue && debouncedValue.toLowerCase()
                      )) ||
                  (bank &&
                    bank.name &&
                    bank.name
                      .toLowerCase()
                      .includes(debouncedValue && debouncedValue.toLowerCase()))
                );
              })
              .map((bank) => {
                return bank.name ? `${bank.name}` : `${bank.name}`;
              });
          setSearchResult(arr);
        } else {
          setSearchResult(adList);
        }
      }
    }
  }, [debouncedValue]);

  return (
    <FormControl
      sx={{
        width: "100%",
        position: "relative",
      }}
    >
      {adList && (
        <Autocomplete
          id="search_particular"
          freeSolo
          size="small"
          options={searchResult ? searchResult : ""}
          value={value}
          sx={{
            width: fromProfile ? "90%" : "96%",
            fontFamily: "Poppins",
            fontSize: "13px",
          }}
          onChange={(event, newValue) => {
            if (adList && adList) {
              for (let i = 0; i < adList.length; i++) {
                const bank = adList[i];
                if (bank.name === newValue) {
                  if (ifscObj) {
                    ifscObj(bank.bank_iin);
                  }
                  break;
                }
                if (bank.name === newValue) {
                  if (ifscObj) {
                    ifscObj(bank.ifscGlobal);
                  }
                  break;
                }
              }
            }
            setValue(newValue);
            if (bankObj) {
              bankObj(newValue);
            }
          }}
          renderInput={(params) => (
            <TextField autoComplete="off"
              {...params}
              size="small"
              multiline
              label={label}
              placeholder="Search by Bank Name"
              sx={{
                fontFamily: "Poppins",
                fontSize: "13px",
              }}
              maxRows={10}
              value={value}
              inputRef={inputRef}
              //   defaultValue={}
              onChange={handleChange}
              required
            />
          )}
        />
      )}
    </FormControl>
  );
};

export default AdSearchField;
