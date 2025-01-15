import React from "react";
import { TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";

const CounterComponent = ({ value, onIncrement, onDecrement, onChange }) => {
  const handleInputChange = (event) => {
    const newValue = parseInt(event.target.value);
    onChange(newValue);
  };

  return (
    <ToggleButtonGroup
      size="small"
      color="primary"
      sx={{
        p: 0,
        background: "#fff",
        width: "fit-content",
      }}
    >
      <ToggleButton
        onClick={onDecrement}
        sx={{
          px: 1,
          "&:hover": {
            cursor: value === 0 ? "not-allowed" : "pointer",
          },
        }}
      >
        -
      </ToggleButton>
      <ToggleButton sx={{ p: 0 }}>
        <TextField autoComplete="off"
          className="counter-textfield"
          name="counterValue"
          type="number"
          value={value}
          onChange={handleInputChange}
          InputProps={{
            inputProps: {
              min: 0,
            },
          }}
        />
      </ToggleButton>
      <ToggleButton
        onClick={onIncrement}
        sx={{
          px: 1,
        }}
      >
        +
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default CounterComponent;
