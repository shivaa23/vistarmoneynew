import { Controller } from "react-hook-form";
import { RadioGroup, FormHelperText, FormControlLabel } from "@mui/material";
export default function RHFRadioGroup({
  name,
  options,
  control,
  errors,
  rControl,
  ...other
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <RadioGroup {...field} row {...other}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={rControl}
                label={option.label}
              />
            ))}
          </RadioGroup>

          {!!errors[name] && (
            <FormHelperText error sx={{ px: 2 }}>
              {errors[name] ? errors[name]?.message : ""}
            </FormHelperText>
          )}
        </>
      )}
    />
  );
}
