import { Button, Menu, MenuItem } from "@mui/material";
import React, { useState, useEffect } from "react";
import Loader from "../component/loading-screen/Loader";
import { get, postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";

const ChangeRouteMenu = ({ row, refresh, selectedRows }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [progress, setProgress] = useState(false);
  const [routeVal, setRouteVal] = useState([]);

  useEffect(() => {
    if (anchorEl) {
      getRouteVal();
    }
  }, [anchorEl]);

  const getRouteVal = () => {
    get(
      ApiEndpoints.GET_ROUTE,
      "",
      "",
      (res) => {
        const routeArray = res.data.data;
        const routeData = routeArray.map((item) => ({
          code: item.code,
          name: item.name,
        }));
        setRouteVal(routeData);
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = (route) => {
    if (selectedRows.includes(row?.id)) {
      for (let i = 0; i < selectedRows.length; i++) {
        postJsonData(
          ApiEndpoints.CHANGE_ROUTE_OPERATOR,
          { id: selectedRows[i], route },
          setProgress,
          (res) => {
            okSuccessToast(res.data.message);

            // Call parent refresh or route change handler
            if (refresh) refresh();

            handleClose();
          },
          (err) => {
            apiErrorToast(err);
          }
        );
      }
    } else {
      postJsonData(
        ApiEndpoints.CHANGE_ROUTE_OPERATOR,
        { id: row.id, route },
        setProgress,
        (res) => {
          okSuccessToast(res.data.message);

          // Call parent refresh or route change handler
          if (refresh) refresh();
          // if (onRouteChange) onRouteChange(row.id, route);

          handleClose();
        },
        (err) => {
          apiErrorToast(err);
        }
      );
    }
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          width: "15px",
          height: "15px",
          fontSize: "13px",
          color: "#03AED2",
          "&:hover": {
            color: "#000",
            backgroundColor: "#00ff9c",
          },
          borderRadius: "5px",
          padding: "13px",
          mt: 0.5,
        }}
      >
        {row.route || "Select Route"}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Loader loading={progress} circleBlue />
        {routeVal.map((item, index) => (
          <MenuItem onClick={() => handleSubmit(item.code)} key={index}>
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ChangeRouteMenu;
