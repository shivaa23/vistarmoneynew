import React, { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { get, postJsonData } from "../network/ApiController";
import Loader from "../component/loading-screen/Loader";
import { whiteColor } from "../theme/setThemeColor";

const AddOperatorModal = ({ refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [route, setRoute] = useState("");
  const [active, setActive] = useState(1); // Default to active status
  const [routeVal, setRouteVal] = useState([]);

  const handleOpen = () => {
    setOpen(true);
    getRouteVal();
  };

  const handleClose = () => {
    setOpen(false);
    setRoute("");
  };

  const getRouteVal = () => {
    get(
      ApiEndpoints.GET_ROUTE,
      "",
      "",
      (res) => {
        const routeArray = res.data.data || [];
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    const data = {
      name: form.name.value,
      a_comm: form.a_comm.value,
      ret_comm: form.ret_comm.value,
      code: form.code.value,
      ad_comm: form.ad_comm.value,
      dd_comm: form.dd_comm.value,
      category: form.category.value,
      sub_type: form.sub_type.value,
      route: route,
      active: active,
    };

    postJsonData(
      ApiEndpoints.ADD_OPERATOR,
      data,
      setRequest,
      (resp) => {
        okSuccessToast("Operator added successfully.");
        if (refresh) refresh();
        handleClose();
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
  <Tooltip title="Add operator">
        <Button
          variant="outlined"
          // className="button-transparent"
          className="refresh-icon-risk"
          onClick={handleOpen}
          startIcon={
            <IconButton
              sx={{
                p: 0,

                color: whiteColor(),
              }}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          }
          sx={{ py: 0.3 }}
        >
       Operator
        </Button>
      </Tooltip>      <Drawer open={open} onClose={handleClose} anchor="right">
        <Box sx={{ width: 400 }} className="sm_modal">
          <Loader loading={request} />
          <ModalHeader title="Add Operator" handleClose={handleClose} />
          <Box
            component="form"
            id="addOpServices"
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": { m: 2 },
            }}
          >
            <Grid container sx={{ pt: 1 }}>
              {[
                { id: "name", label: "Name" },
                { id: "code", label: "Code" },
                { id: "sricode", label: "Sricode" },
                { id: "a_comm", label: "Admin Comm" },
                { id: "ret_comm", label: "Ret Comm" },
                { id: "ad_comm", label: "Ad Comm" },
                { id: "dd_comm", label: "Dd Comm" },
                { id: "category", label: "Category" },
                { id: "sub_type", label: "Sub Type" },
              ].map(({ id, label }) => (
                <Grid item xs={12} key={id}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      autoComplete="off"
                      label={label}
                      id={id}
                      size="small"
                      required
                    />
                  </FormControl>
                </Grid>
              ))}
              <Grid item xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Route"
                    id="route"
                    size="small"
                    select
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    required
                  >
                    {routeVal.map((item) => (
                      <MenuItem key={item.code} value={item.code}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Active Status"
                    id="active_status"
                    size="small"
                    select
                    value={active === 1 ? "Active" : "Inactive"}
                    onChange={(e) =>
                      setActive(e.target.value === "Active" ? 1 : 0)
                    }
                    required
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ mr: 2 }}>
            <ModalFooter
              form="addOpServices"
              type="submit"
              btn="Submit"
              disable={request}
            />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default AddOperatorModal;
