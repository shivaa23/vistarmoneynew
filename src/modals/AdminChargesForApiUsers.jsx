import { Icon } from "@iconify/react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { get } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { useState } from "react";
import { apiErrorToast } from "../utils/ToastUtil";
import Loader from "../component/loading-screen/Loader";
import ModalHeader from "./ModalHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  handleChangeApiUsers,
  handleChangeKeys,
  resetData,
  setApiUserCharges,
  setApiUserKeys,
  updateApiUserCharges,
  updateApiUserKeys,
} from "../features/allUsers/allUsersSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  height: "max-content",
  overflowY: "scroll",
  p: 2,
};

const AdminChargesForApiUsers = ({ row }) => {
  const [request, setRequest] = useState();
  const [open, setOpen] = useState(false);

  const { apiUserCharges, apiUserKeys } = useSelector(
    (store) => store.allUsers
  );
  const { ip, hkey } = apiUserKeys;
  const {
    AIR,
    VOD,
    JIO,
    MTT,
    BST,
    ADG,
    DSH,
    D2H,
    TSK,
    SUN,
    ACV,
    DMT,
    DMT2,
    CCB,
    WTR,
    aeps1,
    aeps2,
    payout1,
    payout2,
    payout3,
    payout4,
  } = apiUserCharges;
  const dispatch = useDispatch();

  const getApiUsersCharges = () => {
    get(
      ApiEndpoints.API_USERS_CHARGES,
      `user_id=${row.id}`,
      setRequest,
      (res) => {
        // console.log("resp.data", res.data.data);
        const data = res?.data?.data;
        dispatch(setApiUserCharges(data));
        setOpen(true);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const getApiUsersKeys = () => {
    get(
      ApiEndpoints.API_USERS_KEYS,
      `user_id=${row.id}`,
      setRequest,
      (res) => {
        // console.log("resp.data", res.data.data);
        const data = res?.data?.data;
        dispatch(setApiUserKeys(data));
        setOpen(true);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const handleOpen = () => {
    getApiUsersCharges();
    getApiUsersKeys();
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(resetData());
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("apiUserCharges", apiUserCharges);
    dispatch(updateApiUserCharges({ apiUserCharges, id: row.id }));
  };
  const handleSubmitKeys = (e) => {
    e.preventDefault();

    dispatch(updateApiUserKeys({ apiUserKeys, id: row.id }));
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch(handleChangeApiUsers({ name, value }));
  };

  const handleChangeKey = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch(handleChangeKeys({ name, value }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Tooltip title="Edit Charges & Keys">
        <IconButton
          variant="contained"
          style={{ fontSize: "10px", marginLeft: "5px", color: "#e57373" }}
          onClick={handleOpen}
        >
          <Icon
            icon="fluent:document-percent-24-regular"
            style={{ fontSize: "24px" }}
          />
        </IconButton>
      </Tooltip>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <Loader loading={request} />
          <ModalHeader title="Edit Charges" handleClose={handleClose} />

          <Box
            component="form"
            id="edit-charges"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": { mx: 2, my: 1 },
              objectFit: "contain",
              overflowY: "scroll",
              marginTop: "24px",
            }}
          >
            <Typography
              sx={{
                display: "flex",
                justifyContent: "start",
                fontSize: "15px",
                color: "black",
                pl: 2,
              }}
            >
              Charges
            </Typography>

            <Grid container sx={{ display: "flex", alignItems: "center" }}>
              <Grid item md={2} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="AIR"
                    id="AIR"
                    name="AIR"
                    size="small"
                    // required
                    variant="standard"
                    type="number"
                    //   defaultValue={userDetails && userDetails.name}
                    value={AIR}
                    onChange={handleChange}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="VOD"
                    id="VOD"
                    name="VOD"
                    size="small"
                    // required
                    variant="standard"
                    type="number"
                    //   defaultValue={userDetails && userDetails.name}
                    value={VOD}
                    onChange={handleChange}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="JIO"
                    id="JIO"
                    name="JIO"
                    size="small"
                    // required
                    variant="standard"
                    type="number"
                    //   defaultValue={userDetails && userDetails.name}
                    value={JIO}
                    onChange={handleChange}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="MTT"
                    id="MTT"
                    name="MTT"
                    size="small"
                    // required
                    variant="standard"
                    type="number"
                    //   defaultValue={userDetails && userDetails.name}
                    value={MTT}
                    onChange={handleChange}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="BST"
                    id="BST"
                    name="BST"
                    size="small"
                    // required
                    variant="standard"
                    type="number"
                    //   defaultValue={userDetails && userDetails.name}
                    value={BST}
                    onChange={handleChange}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="ADG"
                    id="ADG"
                    name="ADG"
                    size="small"
                    // required
                    variant="standard"
                    type="number"
                    //   defaultValue={userDetails && userDetails.name}
                    value={ADG}
                    onChange={handleChange}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="DSH"
                    id="DSH"
                    name="DSH"
                    size="small"
                    // required
                    variant="standard"
                    type="number"
                    //   defaultValue={userDetails && userDetails.name}
                    value={DSH}
                    onChange={handleChange}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="D2H"
                    id="D2H"
                    name="D2H"
                    size="small"
                    // required
                    variant="standard"
                    type="number"
                    //   defaultValue={userDetails && userDetails.name}
                    value={D2H}
                    onChange={handleChange}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="TSK"
                    id="TSK"
                    name="TSK"
                    size="small"
                    // required
                    variant="standard"
                    type="number"
                    //   defaultValue={userDetails && userDetails.name}
                    value={TSK}
                    onChange={handleChange}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="SUN"
                    id="SUN"
                    name="SUN"
                    size="small"
                    // required
                    variant="standard"
                    type="number"
                    //   defaultValue={userDetails && userDetails.name}
                    value={SUN}
                    onChange={handleChange}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="ACV"
                    id="ACV"
                    name="ACV"
                    size="small"
                    // required
                    variant="standard"
                    type="number"
                    //   defaultValue={userDetails && userDetails.name}
                    value={ACV}
                    onChange={handleChange}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="DMT"
                    id="DMT"
                    name="DMT"
                    size="small"
                    // required
                    variant="standard"
                    type="number"
                    //   defaultValue={userDetails && userDetails.name}
                    value={DMT}
                    onChange={handleChange}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="DMT2"
                    id="DMT2"
                    name="DMT2"
                    size="small"
                    // required
                    variant="standard"
                    type="number"
                    //   defaultValue={userDetails && userDetails.name}
                    value={DMT2}
                    onChange={handleChange}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="CCB"
                    id="CCB"
                    name="CCB"
                    size="small"
                    // required
                    variant="standard"
                    type="number"
                    //   defaultValue={userDetails && userDetails.name}
                    value={CCB}
                    onChange={handleChange}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="WTR"
                    id="WTR"
                    name="WTR"
                    size="small"
                    // required
                    variant="standard"
                    type="number"
                    //   defaultValue={userDetails && userDetails.name}
                    value={WTR}
                    onChange={handleChange}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="AEPS 1"
                    id="aeps1"
                    name="aeps1"
                    size="small"
                    // required
                    variant="standard"
                    type="number"
                    //   defaultValue={userDetails && userDetails.name}
                    value={aeps1}
                    onChange={handleChange}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="AEPS 2"
                    id="aeps2"
                    name="aeps2"
                    size="small"
                    // required
                    variant="standard"
                    type="number"
                    //   defaultValue={userDetails && userDetails.name}
                    value={aeps2}
                    onChange={handleChange}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Payout 1"
                    id="payout1"
                    name="payout1"
                    size="small"
                    // required
                    variant="standard"
                    type="number"
                    //   defaultValue={userDetails && userDetails.name}
                    value={payout1}
                    onChange={handleChange}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Payout 2"
                    id="payout2"
                    name="payout2"
                    size="small"
                    // required
                    variant="standard"
                    type="number"
                    //   defaultValue={userDetails && userDetails.name}
                    value={payout2}
                    onChange={handleChange}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Payout 3"
                    id="payout3"
                    name="payout3"
                    size="small"
                    // required
                    variant="standard"
                    type="number"
                    //   defaultValue={userDetails && userDetails.name}
                    value={payout3}
                    onChange={handleChange}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Payout 4"
                    id="payout4"
                    name="payout4"
                    size="small"
                    // required
                    variant="standard"
                    type="number"
                    //   defaultValue={userDetails && userDetails.name}
                    value={payout4}
                    onChange={handleChange}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={4} sx={{ textAlign: "center" }}>
                <Button
                  type="submit"
                  form="edit-charges"
                  className="button-red"
                  sx={{ width: "90%", textTransform: "none" }}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box
            component="form"
            id="edit-keys"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmitKeys}
            sx={{
              "& .MuiTextField-root": { mx: 2, my: 1 },
              objectFit: "contain",
              overflowY: "scroll",
              marginTop: "24px",
            }}
          >
            <Typography
              sx={{
                display: "flex",
                justifyContent: "start",
                fontSize: "15px",
                color: "black",
                pl: 2,
              }}
            >
              Api Key
            </Typography>
            <Grid container>
              <Grid item md={6} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="IP"
                    id="ip"
                    name="ip"
                    size="small"
                    // required
                    variant="standard"
                    //   defaultValue={userDetails && userDetails.name}
                    value={ip}
                    onChange={handleChangeKey}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={4}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Key"
                    id="hkey"
                    name="hkey"
                    size="small"
                    // required
                    variant="standard"
                    //   defaultValue={userDetails && userDetails.name}
                    value={hkey}
                    onChange={handleChangeKey}
                    sx={{
                      "&:disabled": {
                        background: "#d1d1d1 !important",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                md={6}
                xs={4}
                sx={{ textAlign: "left", my: { md: 3, xs: 1 } }}
              >
                <Button
                  type="submit"
                  form="edit-keys"
                  className="button-red"
                  sx={{ width: "30%", textTransform: "none" }}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AdminChargesForApiUsers;
