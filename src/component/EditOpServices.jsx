import * as React from "react";
import Box from "@mui/material/Box";
import {
  FormControl,
  Grid,
  TextField,
  Tooltip,
  IconButton,
  Modal,
  MenuItem,
  Drawer,
} from "@mui/material";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import Loader from "../component/loading-screen/Loader";
import ModalHeader from "../modals/ModalHeader";
import ModalFooter from "../modals/ModalFooter";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { get, postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "max-content",
  overflowY: "scroll",
};
const EditOpServices = ({ refresh, row }) => {
  const [open, setOpen] = React.useState(false);
  const [request, setRequest] = useState(false);
  // const [type, setType] = useState("");
  const [route, setRoute] = useState("");
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
      // code: form.code.value,
      a_comm: form.a_comm.value,
      // type: form.type.value,
      route: route,
    };
    postJsonData(
      ApiEndpoints.ADMIN_OP_SERVICE,
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
                      disabled
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
                      defaultValue={row?.a_comm}
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
export default EditOpServices;
