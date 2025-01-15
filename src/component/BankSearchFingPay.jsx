/* eslint-disable react-hooks/exhaustive-deps */
import { FormControl, TextField } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import useDebounce from "../utils/Debounce";
import ApiEndpoints from "../network/ApiEndPoints";
import Autocomplete from "@mui/material/Autocomplete";
import { get } from "../network/ApiController";

const API_URL = ApiEndpoints.AEPS2_BANKS;
const BankSearchFingPay = ({
  row,
  items,
  bankObj,
  ifscObj,
  endpt = API_URL,
  label = "Bank Search",
  fromProfile = false,
  inputRef,
}) => {
  const [value, setValue] = useState();
  const [searchResult, setSearchResult] = useState([]);
  // const [request, setRequest] = useState(false);
  const [bankList, setBankList] = useState();
  const debouncedValue = useDebounce(value, 500);
  const getBanks = async () => {
    get(
      ApiEndpoints.AEPS2_BANKS,
      "",
      () => {},
      (res) => {
        setBankList(res.data.data);
      },
      (err) => {}
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
                  bank &&
                  bank.bankName &&
                  bank.bankName
                    .toLowerCase()
                    .includes(debouncedValue && debouncedValue.toLowerCase())
                );
              })
              .map((bank) => {
                return bank.bankName ? `${bank.bankName}` : `${bank.name}`;
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
      {/* <Loader loading={request} /> */}
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
                if (bank.bankName === newValue) {
                  if (ifscObj) {
                    ifscObj(bank.iinno);
                  }
                  break;
                }
                if (bank.name === newValue) {
                  if (ifscObj) {
                    ifscObj(bank.iinno);
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

export default BankSearchFingPay;
