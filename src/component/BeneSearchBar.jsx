import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Grid, IconButton, InputBase } from "@mui/material";
import useDebounce from "../utils/Debounce";
import CloseIcon from "@mui/icons-material/Close";

const BeneSearchBar = ({
  setSearch,
  label = "Search for beneficiary",
  remMargin = false,
}) => {
  const [value, setValue] = useState("");
  const [pressEnter, setPressEnter] = useState(true);
  const debouncedValue = useDebounce(value, 400);

  const handleChange = (event) => {
    if (event.target.value) {
      setValue(event.target.value);
    } else {
      setValue(event.target.value);
    }
  };

  useEffect(() => {
    setSearch(debouncedValue);
  }, [pressEnter, debouncedValue]);

  return (
    <Grid
      item
      md={6}
      xs={12}
      sx={{
        display: "flex",
        alignItems: "center",
        background: "#FFFFFF",
        border: "1px solid #DDE6EB",
        borderRadius: "10px",
        mt: remMargin ? 0 : 2,
      }}
    >
      <IconButton sx={{ p: "10px" }} aria-label="menu">
        <SearchIcon />
      </IconButton>
      <InputBase
        id="searchBene"
        sx={{ ml: 1, flex: 1 }}
        placeholder={label}
        inputProps={{ "aria-label": "Search for beneficiary" }}
        value={value}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key.toLowerCase() === "enter") {
            // setValue(e.target.value);
            setPressEnter(!pressEnter);
          }
        }}
      />
      <IconButton
        onClick={() => {
          setValue();
          setSearch();
          document.getElementById("searchBene").value = "";
        }}
        sx={{ p: "10px" }}
        aria-label="menu"
      >
        <CloseIcon />
      </IconButton>
    </Grid>
  );
};

export default BeneSearchBar;
