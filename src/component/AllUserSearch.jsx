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

const AllUserSearch = ({ row, items, userObj, notiType }) => {
  const [value, setValue] = useState();
  const [request, setRequest] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [userList, setUserList] = React.useState([]);

  const debouncedValue = useDebounce(value, 500);

  const getUsers = () => {
    get(
      ApiEndpoints.GET_USERS + "?export=1&paginate=10",
      "",
      setRequest,
      (res) => {
        setUserList(res.data.data);
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };
  useEffect(() => {
    if (notiType === "SINGLE") getUsers();
    return () => {};
  }, [notiType]);

  const handleChange = (e) => {
    if (e.target.value) {
      setValue(e.target.value);
    } else {
      setValue(e.target.value);
      setSearchResult([]);
      // handleClose();
    }
  };

  useEffect(() => {
    if (debouncedValue) {
      setRequest(true);
      if (userList && userList.length > 0) {
       if (debouncedValue) {
          setRequest(true);
          const arr =
            userList &&
            userList
              .filter((user) => {
                return (
                  (user &&
                    user.establishment &&
                    user.establishment
                      .toLowerCase()
                      .includes(
                        debouncedValue && debouncedValue.toLowerCase()
                      )) ||
                  (user &&
                    user.id
                      .toString()
                      .includes(debouncedValue && debouncedValue))
                );
              })
              .map((user) => {
                return `${user.establishment},${user.id}`;
              });
          setSearchResult(arr);
          setRequest(false);
        } else {
          setSearchResult(userList);
          setRequest(false);
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
      <Loader loading={request} circleBlue />
      {userList && (
        <Autocomplete
          id="search_particular"
          freeSolo
          size="small"
          options={searchResult ? searchResult : ""}
          // defaultValue={}
          value={value}
          sx={{ width: "96%", fontFamily: "Poppins", fontSize: "13px" }}
          onChange={(event, newValue) => {
            setValue(newValue);
            if (userObj) {
              userObj(newValue);
            }
          }}
          renderInput={(params) => (
            <TextField autoComplete="off"
              {...params}
              size="small"
              multiline
              label="Search User"
              placeholder="Search by Establishment"
              required
              sx={{
                fontFamily: "Poppins",
                fontSize: "13px",
              }}
              // InputProps={{
              //   startAdornment: (
              //     <InputAdornment position="start">
              //       <ManageSearchIcon fontSize="small" />
              //     </InputAdornment>
              //   ),
              // }}
              maxRows={10}
              value={value}
              //   defaultValue={}
              onChange={handleChange}
            />
          )}
        />
      )}
    </FormControl>
  );
};

export default AllUserSearch;
