import React from "react";
import { IconButton } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";

const MachineDetectButton = ({ onClick, loading = false }) => {
  return (
    <IconButton
      className="button-purple"
      variant="contained"
      size="small"
      sx={{
        textAlign: "left",
      }}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      <CachedIcon
        className={`refresh-purple ${loading ? "hover-rotate" : ""}`}
        fontSize="small"
      />
    </IconButton>
  );
};

export default MachineDetectButton;
