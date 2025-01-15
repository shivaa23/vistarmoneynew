/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Divider,
  Grid,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import useDebounce from "../utils/Debounce";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { secondaryColor } from "../theme/setThemeColor";

const SearchBarComp = ({
  setQuery,
  query,
  searchOptions = [],
  queryParam,
  ifFilterData,
  sendBkDBVal,
  sendBkChoosenVal,
  prefilledQuery,
}) => {
  const [value, setValue] = useState("");
  const [searchIn, setSearchIn] = useState(
    searchOptions.length > 0 && searchOptions[0].parameter
  );
  const [pressEnter, setPressEnter] = useState(true);
  const debouncedValue = useDebounce(value, 600);
  const focusRef = useRef();

  const handleChange = (event) => {
    if (event.target.value) {
      setValue(event.target.value);
    } else {
      setValue(event.target.value);
    }
  };

  // all open and close the options functions
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClearSearch = () => {
    if (debouncedValue === "" && !prefilledQuery) {
      if (setQuery) setQuery(null);
      setValue("");
    } else {
      if (setQuery) setQuery(prefilledQuery);
      setValue("");
    }
  };
  useEffect(() => {
    if (debouncedValue && ifFilterData === false && !prefilledQuery) {
      if (setQuery) {
        setQuery(
          `${
            searchIn && searchIn.parameter
              ? searchIn.parameter
              : searchOptions.length > 0 && searchOptions[0].parameter
          }=` + debouncedValue
        );
      }
    }
    //
    if (debouncedValue && ifFilterData === false && prefilledQuery) {
      if (setQuery) {
        setQuery(
          `${prefilledQuery}&${
            searchIn && searchIn.parameter
              ? searchIn.parameter
              : searchOptions.length > 0 && searchOptions[0].parameter
          }=` + debouncedValue
        );
      }
    }
    //
    if (debouncedValue && ifFilterData === true) {
      if (sendBkDBVal) sendBkDBVal(debouncedValue);
    }
    if (!debouncedValue && ifFilterData === true) {
      if (sendBkDBVal) sendBkDBVal(debouncedValue);
    }

    //
    if (debouncedValue === "" && prefilledQuery) {
      if (setQuery) setQuery(prefilledQuery);
    }
    //
    if (debouncedValue === "" && !prefilledQuery) {
      if (setQuery) setQuery(null);
    }

    focusRef.current.focus();
  }, [pressEnter, debouncedValue]);

  return (
    <Grid
      item
      md={8}
      xs={12}
      sx={{
        display: "flex",
        alignItems: "center",
        background: "#FFFFFF",
        border: "1px solid #DDE6EB",
        borderRadius: "4px",
        height: "40px",
        width: { xs: "100%", md: "60%" },
        ml: { xs: 0, md: 2 },
      }}
    >
      {/* search dropdown */}
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
        className="no-round-border"
      >
        {searchIn && searchIn.field ? (
          <Typography>{searchIn && searchIn.field}</Typography>
        ) : (
          <Tooltip title="Search Options" placement="bottom">
            <Typography>
              {searchOptions.length > 0 && searchOptions[0].field}
            </Typography>
          </Tooltip>
        )}
        {anchorEl ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </IconButton>
      <Divider
        sx={{ height: 12, m: 0.5, backgroundColor: "#000" }}
        orientation="vertical"
      />
      {/* search field */}
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        size="small"
        placeholder={`Search in ${
          searchIn.field
            ? searchIn.field
            : searchOptions.length > 0 && searchOptions[0].field
        }`}
        inputProps={{ "aria-label": "search google maps" }}
        autoFocus={true}
        ref={focusRef}
        value={value}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key.toLowerCase() === "enter") {
            setPressEnter(!pressEnter);
          }
        }}
      />
      <Divider
        sx={{ height: 12, m: 0.5, backgroundColor: "#000" }}
        orientation="vertical"
      />
      {/* the search icon */}

      {debouncedValue ? (
        <IconButton
          aria-label="clear"
          onClick={handleClearSearch}
          edge="end"
          sx={{ mr: 0.1, color: secondaryColor() }}
        >
          <ClearIcon />
        </IconButton>
      ) : (
        <IconButton sx={{ p: "10px" }} aria-label="menu">
          <SearchIcon />
        </IconButton>
      )}

      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        keepMounted
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {searchOptions.length >= 0 &&
          searchOptions.map((item) => {
            if (item.field === "") {
              return null;
            } else
              return (
                <MenuItem
                  onClick={() => {
                    setSearchIn(item);
                    if (sendBkChoosenVal) sendBkChoosenVal(item.parameter);
                    handleClose();
                  }}
                >
                  {item.field}
                </MenuItem>
              );
          })}
      </Menu>
    </Grid>
  );
};

export default SearchBarComp;
