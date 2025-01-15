import React, { useEffect, useState } from "react";
import {
  FormControl,
  Grid,
  TextField,
  IconButton,
  Box,
  Tooltip,
  Drawer,
  MenuItem,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import ApiEndpoints from "../network/ApiEndPoints";
import { get, postJsonData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { Icon } from "@iconify/react";
import Loader from "../component/loading-screen/Loader";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "max-content",
  overflowY: "scroll",
};

const EditOperator = ({ row, refresh }) => {
  const [open, setOpen] = React.useState(false);
  const [request, setRequest] = useState(false);
  // const [type, setType] = useState("");
  const [route, setRoute] = useState("");
  const [active, setActive] = useState(row?.active);
  // console.log("active",active);
  
  const [routeVal, setRouteVal] = useState([]);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setRoute("");
  };

  useEffect(() => {
    if (row) setRoute(row.route);
  }, [row]);
  const getRouteVal = () => {
    get(
      ApiEndpoints.GET_ROUTE,
      "",
      "",
      (res) => {
        const routeArray = res.data.data;
        const routeData = routeArray.map((item) => {
          return {
            code: item.code,
            name: item.name,
          };
        });
        setRouteVal(routeData);
        handleOpen();
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    let data = {
      id: row?.id,
      name: form.name.value,
      a_comm: form.a_comm.value,
      ret_comm: form.ret_comm.value,
      code:form.code.value,
      ad_comm: form.ad_comm.value,
      dd_comm: form.dd_comm.value,
      category: form.category.value,
      sub_type: form.sub_type.value,
      route: route,
      active: active, // Include active status
    };
    postJsonData(
      ApiEndpoints.UPDATE_OPERATOR,
      data,
      setRequest,
      (resp) => {
        okSuccessToast("Services Updated..");
        if (refresh) refresh();
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  useEffect(() => {}, [row]);



  return (
    <Box
    sx={{
      display: "flex",
      justifyContent: "end",
    }}
  >
    {" "}
    <Tooltip title="Edit Account">
      <IconButton sx={{ color: "#0504AA" }} onClick={getRouteVal}>
        <Icon icon="raphael:edit" width={24} height={24} />
      </IconButton>
    </Tooltip>
    <Box>
      <Drawer open={open} onClose={handleClose} anchor="right">
        <Box sx={{ width: 400 }} className="sm_modal">
          <Loader loading={request} />
          <ModalHeader title={`Edit Operator`} handleClose={handleClose} />
          <Box
            component="form"
            id="editOpServices"
            validate
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": { m: 2 },
            }}
          >
            <Grid container sx={{ pt: 1 }}>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Name"
                    id="name"
                    size="small"
                    required
                    defaultValue={row?.name}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Code"
                    id="code"
                    size="small"
                    required
                    defaultValue={row?.code}
                    // disabled
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Sricode"
                    id="sricode"
                    size="small"
                    required
                    defaultValue={row?.sricode}
                    // disabled
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Admin Comm"
                    id="a_comm"
                    size="small"
                    required
                    defaultValue={row?.admin_comm}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Ret Comm"
                    id="ret_comm"
                    size="small"
                    required
                    defaultValue={row?.ret_comm}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Ad Comm"
                    id="ad_comm"
                    size="small"
                    required
                    defaultValue={row?.ad_comm}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Dd Comm"
                    id="dd_comm"
                    size="small"
                    required
                    defaultValue={row?.dd_comm}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Category"
                    id="category"
                    size="small"
                    required
                    defaultValue={row?.category}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Sub Type"
                    id="sub_type"
                    size="small"
                    required
                    defaultValue={row?.sub_type}
                  />
                </FormControl>
              </Grid>
             

              {/* <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Type"
                    id="type"
                    size="small"
                    required
                    select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                   
                  </TextField>
                </FormControl>
              </Grid> */}
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Route"
                    id="route"
                    size="small"
                    required
                    select
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    defaultValue={row?.route}
                  >
                    {routeVal.length > 0 &&
                      routeVal.map((item) => {
                        return (
                          <MenuItem value={item.code}>{item.name}</MenuItem>
                        );
                      })}
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      label="Active Status"
                      id="active_status"
                      size="small"
                      required
                      select
                      value={active === 1 ? "Active" : "Inactive"}
                      onChange={(e) => setActive(e.target.value === "Active" ? 1 : 0)}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                    </TextField>
                  </FormControl>
                </Grid>
            </Grid>
          </Box>
          <Box sx={{mr:"10px"}}>
          <ModalFooter
            form="editOpServices"
            type="submit"
            btn="Submit"
            disable={request}
          />
          </Box>
        </Box>
      </Drawer>
    </Box>
  </Box>
  );
};
export default EditOperator;
