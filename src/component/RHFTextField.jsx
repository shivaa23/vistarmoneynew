import React from "react";
import { FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const RHFTextField = ({
  label,
  name,
  defaultValue,
  disabled,
  InputProps,
  placeholder,
  multiline,
  rows,
  value,
  control,
  errors,
  ...other
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{ required: true }}
      render={({ field }) => (
        <FormControl sx={{ width: "100%" }}>
          <TextField autoComplete="off"
            {...field}
            label={label}
            size="small"
            placeholder={placeholder}
            error={!!errors[name]}
            helperText={errors[name] ? errors[name]?.message : ""}
            InputProps={InputProps}
            {...other}
          />
        </FormControl>
      )}
    />
  );
};

export default RHFTextField;
