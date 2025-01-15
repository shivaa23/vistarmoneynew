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

const BankSearch = ({
  row,
  items,
  bankObj,
  ifscObj,
  endpt = ApiEndpoints.AEPS_BANK,
  label = "Bank Search",
  fromProfile = false,
  inputRef,
}) => {
  const [value, setValue] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [bankList, setBankList] = React.useState([]);
  const debouncedValue = useDebounce(value, 500);
  const getBanks = () => {
    get(
      endpt,
      "",
      null,
      (res) => {
        setBankList(res.data.data);
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };
  useEffect(() => {
    getBanks();
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
      if (bankList && bankList.length > 0) {
        if (debouncedValue) {
          const arr =
            bankList &&
            bankList
              .filter((bank) => {
                return (
                  (bank &&
                    bank.bank_name &&
                    bank.bank_name
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
                return bank.bank_name ? `${bank.bank_name}` : `${bank.name}`;
              });
          setSearchResult(arr);
        } else {
          setSearchResult(bankList);
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
      {bankList && (
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
            if (bankList && bankList) {
              for (let i = 0; i < bankList.length; i++) {
                const bank = bankList[i];
                if (bank.bank_name === newValue) {
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
                m:2
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

export default BankSearch;
