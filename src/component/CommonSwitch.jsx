import { Grid, Switch } from "@mui/material";
import React, { useEffect } from "react";

import { styled } from "@mui/material/styles";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 40,
  height: 22,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "& + .MuiSwitch-track": {
      backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#989898",
      opacity: 1,
      border: 0,
    },
    "&.Mui-checked": {
      transform: "translateX(17px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor:
          theme.palette.mode === "dark" ? "#2ECA45" : "#49af4150",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 18,
    height: 18,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const CommonSwitch = ({
  row,
  value,
  valueSetfunc,
  defaultval,
  param,
  setParamVal,
  changeSwitch,
}) => {
  const changeSwitchVal = (e) => {
    if (e.target.checked) {
      valueSetfunc(1);
    } else {
      valueSetfunc(0);
    }
    setParamVal(param);
  };

  useEffect(() => {
    valueSetfunc(defaultval);
  }, [row]);

  return (
    <Grid>
      <IOSSwitch
        size="small"
        sx={{
          "&.MuiSwitch-root .MuiSwitch-switchBase": {
            color: "#fff",
          },
          "&.MuiSwitch-root .Mui-checked": {
            color: "#49af41",
          },
        }}
        checked={value === 1 ? true : false}
        defaultChecked={defaultval === 1 ? true : false}
        onChange={(e) => {
          changeSwitchVal(e);
          changeSwitch(param, e.target.checked);
        }}
      />
    </Grid>
  );
};

export default CommonSwitch;
