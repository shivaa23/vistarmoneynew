import { FormControl, MenuItem, TextField } from "@mui/material";
import React from "react";

const ActiveInActiveTextFied = ({ defaultVal, lable, onChangeValue }) => {
  return (
    <FormControl sx={{ width: "100%" }}>
      <TextField autoComplete="off"
        select
        label={lable}
        id="status"
        size="small"
        required
        onChange={onChangeValue}
        defaultValue={defaultVal}
      >
        <MenuItem value="1">Active</MenuItem>
        <MenuItem value="0">In-Active</MenuItem>
      </TextField>
    </FormControl>
  );
};

export default ActiveInActiveTextFied;
