import { Box, FormControl, Menu, MenuItem, TextField } from "@mui/material";
import React from "react";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const FilterComponent = ({ onChangeValue, name, onKeyDownValue }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleUname = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleUnameClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center" }} onClick={handleUname}>
        {name}
        <ArrowDropDownIcon />
      </Box>
      <Menu
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        id="menu-appbar"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleUnameClose}
      >
        <MenuItem>
          <FormControl className="customized-textfield" sx={{ width: "100%" }}>
            <TextField autoComplete="off"
              id="name"
              label={name}
              size="small"
              onChange={(e) => {
                if (onChangeValue) {
                  onChangeValue(e.target.value);
                }
              }}
              onKeyDown={(e) => {
                if (onKeyDownValue) {
                  onKeyDownValue(e);
                }
              }}
            />
          </FormControl>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default FilterComponent;
