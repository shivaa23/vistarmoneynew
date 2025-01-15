import { Button, Menu, MenuItem } from "@mui/material";
import React from "react";
import { useState } from "react";
import Loader from "../component/loading-screen/Loader";
import { PIPES } from "../utils/constants";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToastsm } from "../utils/ToastUtil";

const ChangePipeMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [progress, setProgress] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setDMT2Pipe = (value) => {
    postJsonData(
      ApiEndpoints.CHANGE_OPERATOR_PIPE,
      { [value]: value },
      setProgress,
      (res) => {
        okSuccessToastsm("Pipe changed successfully");
        handleClose();
      },
      (err) => {
        apiErrorToast(err);
        handleClose();
      }
    );
  };

  return (
    <div>
      <Button
        variant="outlined"
        sx={{
          color: "#31284d",
          fontSize: "10px",
          fontWeight: "600",
          textTransform: "none",
          backgroundColor: "#D2EBD8",
          borderColor: "#9F86C0",
          "&:hover": {
            color: "#31284d",
            backgroundColor: "#9F86C090",
            borderColor: "#9F86C0",
          },
          py: 0.3,
          px: 0.8,
        }}
        onClick={handleClick}
      >
        Change Pipe
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        // className="position-relative"
      >
        <Loader loading={progress} circleBlue />
        {PIPES.map((item, index) => {
          return (
            <MenuItem
              key={index}
              onClick={() => {
                setDMT2Pipe(item.value);
              }}
            >
              {item.label}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default ChangePipeMenu;
