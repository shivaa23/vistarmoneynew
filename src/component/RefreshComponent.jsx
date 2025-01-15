import React from "react";
import { CircularProgress, Tooltip } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import Mount from "./Mount";

const RefreshComponent = ({
  className = "refresh-purple",
  refresh,
  onClick,
  color = "#fff",
  progressColor = "#fff",
  ...other
}) => {
  return (
    <>
      <Mount visible={refresh}>
        <Tooltip title="Refreshing">
          <CircularProgress
            size="1.1rem"
            sx={{ color: progressColor, ml: 1 }}
          />
        </Tooltip>
      </Mount>
      <Mount visible={!refresh}>
        <Tooltip title="Refresh">
          <CachedIcon
            className={className}
            onClick={onClick}
            sx={{ ml: 1, color: color }}
            {...other}
          />
        </Tooltip>
      </Mount>
    </>
  );
};

export default RefreshComponent;
