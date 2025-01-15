import { Snackbar } from "@mui/material";
import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const CommonSnackBar = ({ children, text = "right", input = false, sx }) => {
  const vertical = "top";
  const horizontal = "right";
  const [open, setOpen] = useState(false);
  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <CopyToClipboard
        text={input ? input : children?.props?.children}
        onCopy={() => {
          setOpen(true);
        }}
        className="just-hover"
        style={{ textAlign: text }}
      >
        <span>{children}</span>
      </CopyToClipboard>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={2000}
        onClose={handleCloseSnack}
        message="Copied"
        sx={{ zIndex: 10000, mt: 7, mr: 5, ...sx }}
      />
    </>
  );
};

export default CommonSnackBar;
