import React from "react";

import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import { getStatusColor } from "../theme/setThemeColor";
import { Box, Typography } from "@mui/material";

// custom progress circle . . .
export default function CustomCircularProgress(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        }}
        thickness={props.thickness1 ? props.thickness1 : 2}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="determinate"
        disableShrink
        sx={{
          color: getStatusColor(props.status),
          // animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        thickness={props.thickness2 ? props.thickness2 : 4}
        {...props}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          component="div"
          color="text.secondary"
          sx={{
            fontSize: "11px",
            fontWeight: "bold",
          }}
        >
          {Number(props.value).toFixed(2)}%
        </Typography>
      </Box>
    </Box>
  );
}
