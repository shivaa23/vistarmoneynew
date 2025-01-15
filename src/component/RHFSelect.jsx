import { Controller } from "react-hook-form";
import { FormControl, TextField } from "@mui/material";

// ----------------------------------------------------------------------

export default function RHFSelect({
  name,
  children,
  control,
  errors,
  defaultValue = "",
  ...other
}) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormControl sx={{ width: "100%" }}>
          <TextField autoComplete="off"
            {...field}
            select
            fullWidth
            size="small"
            SelectProps={{ native: true }}
            error={!!errors[name]}
            helperText={errors[name] ? errors[name]?.message : ""}
            {...other}
          >
            {children}
          </TextField>
        </FormControl>
      )}
    />
  );
}
