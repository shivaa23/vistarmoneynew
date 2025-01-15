import React, { useEffect, useState } from "react";
import {
  FormControl,
  Grid,
  TextField,
  Typography,
  IconButton,
  Box,
  Modal,
  Tooltip,
  InputAdornment,
  MenuItem,
  Tab,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import ApiEndpoints from "../network/ApiEndPoints";
import { get, postJsonData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Controller, useForm } from "react-hook-form";
import Loader from "../component/loading-screen/Loader";
import BankSearch from "../component/BankSearch";
import CommonSearchField from "../component/CommonSearchField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Mount from "../component/Mount";
import { TabContext, TabList, TabPanel } from "@mui/lab";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "63%",
  marginTop: "2%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  height: "max-content",
  overflowY: "scroll",
  p: 2,
};

const ViewUserModal = ({ row, refresh, asmArray, adArray }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const query = `id=${row && row.id}`;
  const [userDetails, setUserDetails] = useState([]);
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);
  const [showBankInfo, setshowBankInfo] = useState(false);
  const [showOtherInfo, setShowOtherInfo] = useState(false);
  const [securityInfo, setSecurityInfo] = useState(false);

  const [bankObjCallBack, setbankObjCallBack] = useState();
  const [bankSearchIfsc, setbankSearchIfsc] = useState();
  const [asmSearchVal, setAsmSearchVal] = useState({});
  const [adSearchVal, setAdSearchVal] = useState({});
  const [bcDropdown, setBcDropDown] = useState("");
  const [userRequest, setUserRequest] = useState(false);
console.log("asmArray",asmArray);

  const handleBankInfo = () => {
    setshowBankInfo(!showBankInfo);
  };
  const handleBusinessInfo = () => {
    setShowBusinessInfo(!showBusinessInfo);
  };
  const handleOtherInfo = () => {
    setShowOtherInfo(!showOtherInfo);
  };
  const handleSecurityInfo = () => {
    setSecurityInfo(!securityInfo);
  };

  const getuser = () => {
    get(
      ApiEndpoints.GET_USER_BY_ID,
      query,
      setUserRequest,
      (res) => {
        if (res && res.data && res.data) {
          setUserDetails(res.data.data);
          setBcDropDown(res?.data?.data.type);
          setOpen(true);
        } else setUserDetails();
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  const updateUser = (data) => {
    data.id = row.id;
    data.ifsc = bankSearchIfsc ? bankSearchIfsc : userDetails.ifsc;
    data.parent = adSearchVal?.value;
    data.asm = asmSearchVal?.value;
    data.type = bcDropdown;
    // console.log("data", data);
    // event.preventDefault();
    // const form = event.currentTarget;
    // const data = {
    //   id: row.id,
    //   name: form.name.value,
    //   gender: form.gender.value,
    //   username: userDetails && userDetails.username,
    //   email: form.email.value,
    //   hold: form.hold.value,
    //   mpin_retries: form.mpin_retries.value,
    //   establishment: form.est.value,
    //   p_address: form.p_address.value,
    //   b_address: form.b_address.value,
    //   state: form.state.value,
    //   district: form.district.value,
    //   pincode: form.pincode.value,
    //   aadhar: form.aadhar.value,
    //   pan: form.pan.value,
    //   gstin: form.gstin.value,
    //   role: form.role.value,
    //   parent: form.parent.value,
    //   asm: form.asm.value,
    //   // dmt_slab1: form.dmt_slab1.value,
    //   // dmt_slab2: form.dmt_slab2.value,
    //   ip: form.ip.value,
    //   acc_name: form.acc_name.value,
    //   acc_number: form.acc_number.value,
    //   ifsc: form.ifsc.value,
    //   bank: form.bank.value,
    //   is_acc_verified: isAccVerified,
    // };
    postJsonData(
      ApiEndpoints.UPDATE_USER,
      data,
      setRequest,
      (res) => {
        okSuccessToast("User updated successfully");
        handleClose();
        if (refresh) {
          refresh();
        }
      },
      (error) => {
        apiErrorToast(error);
        if (refresh) {
          refresh();
        }
      }
    );
  };

  const handleOpen = () => {
    getuser();
  };

  const handleClose = () => {
    setOpen(false);
    handleBankInfo();
    handleBusinessInfo();
    handleOtherInfo();
    handleSecurityInfo();
  };

  const schema = yup.object().shape({
    payout_limit: yup
      .number()
      .min(10, "Payout limit cannot be less than 10")
      .max(100000, "Payout limit cannot be greater than 100000"),
    bc_rate: yup
      .number()
      .min(3, "Bc rate cannot be less than 3")
      .max(10, "Bc rate cannot be greater than 10"),
  });

  const { handleSubmit, control } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (!bankObjCallBack) setbankSearchIfsc(undefined);
  }, [bankObjCallBack]);
  const [value, setValue] = React.useState("1");

  const handleChange = (even, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {userRequest ? (
        <IconButton variant="contained" style={{ marginLeft: "5px" }}>
          <Loader loading={userRequest} size={22} />
        </IconButton>
      ) : (
        <Tooltip title="Edit User">
          <IconButton
            variant="contained"
            style={{ fontSize: "10px", marginLeft: "5px", color: "#d11f75" }}
            onClick={handleOpen}
          >
            <DriveFileRenameOutlineIcon />
          </IconButton>
        </Tooltip>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {userDetails && (
          <Box sx={style} className="sm_modal">
            <Loader loading={request} />
            <ModalHeader title="Edit User" handleClose={handleClose} />
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label=" Personal Details" value="1" />
                  <Tab label=" Business Information" value="2" />
                  <Tab label=" Bank Information" value="3" />
                  <Tab label="OTHER INFORMATION " value="4" />
                  <Tab label=" SECURITY Information" value="5" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <Grid container sx={{ pt: 1 }}>
                  {/* <Grid item md={4} xs={6}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="Name"
                        id="name"
                        size="small"
                        required
                        defaultValue={userDetails && userDetails.name}
                     
                        sx={{
                          "&:disabled": {
                            background: "#d1d1d1 !important",
                          },
                          m: 2,
                        }}
                      />
                    </FormControl>
                  </Grid> */}
                  <Grid item md={4} xs={6}>
                    <Controller
                      name="name"
                      control={control}
                      defaultValue={userDetails.name}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            label="name"
                            id="name"
                            size="small"
                            sx={{ m: 2 }}
                            required
                            value={value}
                            defaultValue={userDetails.name}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        </FormControl>
                      )}
                    ></Controller>
                  </Grid>
                  <Grid item md={4} xs={6}>
                    <Controller
                      name="gender"
                      control={control}
                      defaultValue={userDetails?.gender?.toUpperCase()}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            label="Gender"
                            id="gender"
                            size="small"
                            required
                            select
                            defaultValue={userDetails?.gender?.toUpperCase()}
                            value={value}
                            onChange={onChange}
                            sx={{ m: 2 }}
                            error={!!error}
                            helperText={error ? error.message : null}
                          >
                            <MenuItem value="MALE">Male</MenuItem>
                            <MenuItem value="FEMALE">Female</MenuItem>
                            <MenuItem value="OTHER">Other</MenuItem>
                          </TextField>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  
                  <Grid item md={4} xs={6}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="Username"
                        id="username"
                        size="small"
                        required
                        sx={{ m: 2 }}
                        defaultValue={userDetails.username}
                        disabled
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {userDetails &&
                                userDetails.is_mobile_verified && (
                                  <Tooltip title="Verified" placement="top">
                                    <VerifiedIcon color="success" />
                                  </Tooltip>
                                )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={6}>
                    <Controller
                      name="email"
                      control={control}
                      defaultValue={userDetails.email}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            label="Email"
                            id="email"
                            size="small"
                            sx={{ m: 2 }}
                            required
                            value={value}
                            defaultValue={userDetails.email}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        </FormControl>
                      )}
                    ></Controller>
                  </Grid>
                  <Grid item md={4} xs={6}>
                    <Controller
                      name="p_address"
                      control={control}
                      defaultValue={userDetails.p_address}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            label="Address"
                            id="p_address"
                            size="small"
                            required
                            sx={{ m: 2 }}
                            defaultValue={userDetails.p_address}
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        </FormControl>
                      )}
                    ></Controller>
                  </Grid>
                  <Grid item md={4} xs={6}>
                    <Controller
                      name="aadhar"
                      control={control}
                      defaultValue={userDetails.aadhar}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            label="Aadhar"
                            id="aadhar"
                            size="small"
                            required
                            sx={{ m: 2 }}
                            defaultValue={userDetails.aadhar}
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        </FormControl>
                      )}
                    ></Controller>
                  </Grid>
                  <Grid item md={4} xs={6}>
                    <Controller
                      name="pan"
                      control={control}
                      defaultValue={userDetails.pan}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            label="PAN"
                            id="pan"
                            size="small"
                            required
                            sx={{ m: 2 }}
                            defaultValue={userDetails.pan}
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        </FormControl>
                      )}
                    ></Controller>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value="2">
                <>
                  <Grid container sx={{ pt: 1, m: 0 }}>
                    <Grid item md={4} xs={6}>
                      <Controller
                        name="establishment"
                        control={control}
                        defaultValue={userDetails.establishment}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <FormControl sx={{ width: "100%" }}>
                            <TextField
                              autoComplete="off"
                              label="Establishment"
                              id="establishment"
                              size="small"
                              required
                              sx={{ m: 2 }}
                              defaultValue={userDetails?.establishment}
                              value={value}
                              onChange={onChange}
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          </FormControl>
                        )}
                        rules={{ required: "First name required" }}
                      />
                    </Grid>
                    {/* <Grid item md={4} xs={6}>
                      <Controller
                        name="bname"
                        control={control}
                        defaultValue={userDetails.name}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <FormControl sx={{ width: "100%" }}>
                            <TextField autoComplete="off"
                              label="Business Name"
                              id="bname"
                              size="small"
                              required
                              defaultValue={userDetails.name}
                              value={value}
                              onChange={onChange}
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          </FormControl>
                        )}
                      ></Controller>
                    </Grid> */}
                    <Grid item md={4} xs={6}>
                      <Controller
                        name="b_address"
                        control={control}
                        defaultValue={userDetails?.b_address}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <FormControl sx={{ width: "100%" }}>
                            <TextField
                              autoComplete="off"
                              label="Address"
                              id="b_address"
                              sx={{ m: 2 }}
                              size="small"
                              required
                              defaultValue={userDetails?.b_address}
                              value={value}
                              onChange={onChange}
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          </FormControl>
                        )}
                      ></Controller>
                    </Grid>
                    <Grid item md={4} xs={6}>
                      <Controller
                        name="state"
                        control={control}
                        defaultValue={userDetails?.state}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <FormControl sx={{ width: "100%" }}>
                            <TextField
                              autoComplete="off"
                              label="State"
                              id="state"
                              size="small"
                              sx={{ m: 2 }}
                              required
                              defaultValue={userDetails?.state}
                              value={value}
                              onChange={onChange}
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          </FormControl>
                        )}
                      ></Controller>
                    </Grid>
                    <Grid item md={4} xs={6}>
                      <Controller
                        name="district"
                        control={control}
                        defaultValue={userDetails?.district}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <FormControl sx={{ width: "100%" }}>
                            <TextField
                              autoComplete="off"
                              label="District"
                              id="district"
                              size="small"
                              required
                              sx={{ m: 2 }}
                              defaultValue={userDetails?.district}
                              value={value}
                              onChange={onChange}
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          </FormControl>
                        )}
                      ></Controller>
                    </Grid>
                    <Grid item md={4} xs={6}>
                      <Controller
                        name="pincode"
                        control={control}
                        defaultValue={userDetails?.pincode}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <FormControl sx={{ width: "100%" }}>
                            <TextField
                              autoComplete="off"
                              label="Pincode"
                              id="pincode"
                              size="small"
                              required
                              sx={{ m: 2 }}
                              defaultValue={userDetails?.pincode}
                              value={value}
                              onChange={onChange}
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          </FormControl>
                        )}
                      ></Controller>
                    </Grid>
                    {/* <Grid item md={4} xs={6}>
                      <Controller
                        name="pan"
                        control={control}
                        defaultValue={userDetails.pan}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <FormControl sx={{ width: "100%" }}>
                            <TextField autoComplete="off"
                              label="PAN"
                              id="pan"
                              size="small"
                              required
                              defaultValue={userDetails.pan}
                              value={value}
                              onChange={onChange}
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          </FormControl>
                        )}
                      ></Controller>
                    </Grid> */}
                    <Grid item md={4} xs={6}>
                      <Controller
                        name="gstin"
                        control={control}
                        defaultValue={userDetails?.gstin}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <FormControl sx={{ width: "100%" }}>
                            <TextField
                              autoComplete="off"
                              label="GSTIN"
                              id="gstin"
                              size="small"
                              required
                              sx={{ m: 2 }}
                              defaultValue={userDetails?.gstin}
                              value={value}
                              onChange={onChange}
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          </FormControl>
                        )}
                      ></Controller>
                    </Grid>
                    <Grid item md={4} xs={6}>
                      <Controller
                        name="mpin_retries"
                        control={control}
                        defaultValue={userDetails?.mpin_retries}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <FormControl sx={{ width: "100%" }}>
                            <TextField
                              autoComplete="off"
                              label="MPIN Retries"
                              id="mpin_retries"
                              size="small"
                              required
                              sx={{ m: 2 }}
                              defaultValue={userDetails?.mpin_retries}
                              value={value}
                              onChange={onChange}
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          </FormControl>
                        )}
                      ></Controller>
                    </Grid>
                    <Grid item md={4} xs={6}>
                      <Controller
                        name="role"
                        control={control}
                        defaultValue={
                          userDetails?.role && userDetails?.role === "Ret"
                            ? "RETAILER"
                            : userDetails?.role && userDetails?.role === "Ad"
                            ? "AREA DISTRIBUTER"
                            : userDetails?.role && userDetails?.role === "Api"
                            ? "CORPORATES"
                            : userDetails?.role && userDetails?.role === "Asm"
                            ? "SALES MANAGER"
                            : userDetails?.role && userDetails?.role === "Dd"
                            ? "DIRECT DEALER"
                            : ""
                        }
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <FormControl sx={{ width: "100%" }}>
                            <TextField
                              autoComplete="off"
                              label="Role"
                              id="role"
                              size="small"
                              required
                              sx={{ m: 2 }}
                              defaultValue={
                                userDetails?.role && userDetails?.role === "Ret"
                                  ? "RETAILER"
                                  : userDetails?.role &&
                                    userDetails?.role === "Ad"
                                  ? "AREA DISTRIBUTER"
                                  : userDetails?.role &&
                                    userDetails?.role === "Api"
                                  ? "CORPORATES"
                                  : userDetails?.role &&
                                    userDetails?.role === "Asm"
                                  ? "SALES MANAGER"
                                  : userDetails?.role &&
                                    userDetails?.role === "Dd"
                                  ? "DIRECT DEALER"
                                  : ""
                              }
                              value={value}
                              onChange={onChange}
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          </FormControl>
                        )}
                      ></Controller>
                    </Grid>
                    {/* <Grid item md={4} xs={6}>
                      <Controller
                        name="parent"
                        control={control}
                        defaultValue={userDetails?.parent}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <FormControl sx={{ width: "100%" }}>
                            <TextField autoComplete="off"
                              label="Parent"
                              id="parent"
                              size="small"
                              required
                              defaultValue={userDetails?.parent}
                              value={value}
                              onChange={onChange}
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          </FormControl>
                        )}
                      ></Controller>
                    </Grid> */}
                    <Grid item md={4} xs={6} sx={{ mt: 1.5 }}>
                      <CommonSearchField
                        label="Change Parent"
                        placeholder="Parent"
                        list={adArray}
                        labelKey="establishment"
                        valKey="id"
                        valueGetter={setAdSearchVal}
                        defaultVal={userDetails?.parent}
                      />
                    </Grid>
                    {/* <Grid item md={4} xs={6}>
                      <Controller
                        name="asm"
                        control={control}
                        defaultValue={userDetails.asm}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <FormControl sx={{ width: "100%" }}>
                            <TextField autoComplete="off"
                              label="ASM"
                              id="asm"
                              size="small"
                              required
                              defaultValue={userDetails.asm}
                              value={value}
                              onChange={onChange}
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          </FormControl>
                        )}
                      ></Controller>
                    </Grid> */}
                    <Grid item md={4} xs={6} sx={{ mx: 1.7 }}>
                      <CommonSearchField
                        label=" Change ASM"
                        placeholder="ASM"
                        list={asmArray}
                        labelKey="name"
                        valKey="id"
                        valueGetter={setAsmSearchVal}
                        defaultVal={userDetails?.asm}
                        // asmArray={}
                      />
                    </Grid>
                    {/* <Grid item md={4} xs={6}>
                      <Controller
                        name="dmt_slab1"
                        control={control}
                        defaultValue={userDetails?.dmt_slab1}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <FormControl sx={{ width: "100%" }}>
                            <TextField autoComplete="off"
                              label="DMT slab1"
                              id="dmt_slab1"
                              size="small"
                              required
                              defaultValue={userDetails?.dmt_slab1}
                              value={value}
                              onChange={onChange}
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          </FormControl>
                        )}
                      ></Controller>
                    </Grid> */}
                    {/* <Grid item md={4} xs={6}>
                      <Controller
                        name="dmt_slab2"
                        control={control}
                        defaultValue={userDetails?.dmt_slab2}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <FormControl sx={{ width: "100%" }}>
                            <TextField autoComplete="off"
                              label="DMT slab2"
                              id="dmt_slab2"
                              size="small"
                              required
                              defaultValue={userDetails?.dmt_slab2}
                              value={value}
                              onChange={onChange}
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          </FormControl>
                        )}
                      ></Controller>
                    </Grid> */}
                  </Grid>
                </>
              </TabPanel>
              <TabPanel value="3">
                <Grid container sx={{ pt: 1 }}>
                  <Grid item md={4} xs={6}>
                    <Controller
                      name="acc_name"
                      control={control}
                      defaultValue={userDetails.acc_name}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            label="Account Name"
                            id="acc_name"
                            size="small"
                            required
                            sx={{ m: 2 }}
                            defaultValue={userDetails.acc_name}
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        </FormControl>
                      )}
                    ></Controller>
                  </Grid>
                  <Grid item md={4} xs={6} sx={{mt:2}}>
                    {/* <BankSearch
                      fromProfile={true}
                      label="Bank Name"
                      endpt={ApiEndpoints.GET_BANK_DMR}
                      bankObj={(bank) => {
                        setbankObjCallBack(bank);
                      }}
                      ifscObj={(ifsc) => {
                        setbankSearchIfsc(ifsc);
                      }}
                    /> */}
                    <Controller
                        name="bank"
                        control={control}
                        defaultValue={userDetails.bank}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <FormControl sx={{ width: "100%" }}>
                            <TextField autoComplete="off"
                              label="Bank Name"
                              id="bank"
                              size="small"
                              required
                              defaultValue={userDetails.bank}
                              value={value}
                              onChange={onChange}
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          </FormControl>
                        )}
                      ></Controller>
                  </Grid>
                  <Grid item md={4} xs={6}>
                    <Controller
                      name="acc_number"
                      control={control}
                      defaultValue={userDetails.acc_number}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            label="Account number"
                            id="acc_number"
                            size="small"
                            required
                            sx={{ m: 2 }}
                            defaultValue={userDetails.acc_number}
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        </FormControl>
                      )}
                    ></Controller>
                  </Grid>
                  <Grid item md={4} xs={6}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="IFSC Code"
                        id="ifsc"
                        sx={{ m: 2 }}
                        size="small"
                        required
                        // defaultValue={
                        //   bankSearchIfsc
                        //     ? bankSearchIfsc
                        //     : userDetails.ifsc
                        // }
                        value={
                          bankSearchIfsc ? bankSearchIfsc : userDetails.ifsc
                        }
                        onChange={(e) => setbankSearchIfsc(e.target.value)}
                        focused={bankSearchIfsc}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={6}>
                    <Controller
                      name="is_acc_verified"
                      control={control}
                      defaultValue={userDetails.is_acc_verified}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            label="Account Verified"
                            id="is_acc_verified"
                            size="small"
                            required
                            select
                            defaultValue={userDetails.is_acc_verified}
                            value={value}
                            onChange={onChange}
                            sx={{ m: 2 }}
                            error={!!error}
                            helperText={error ? error.message : null}
                          >
                            <MenuItem value="0">In-Active</MenuItem>
                            <MenuItem value="1">Active</MenuItem>
                          </TextField>
                        </FormControl>
                      )}
                    ></Controller>
                    {/* <ActiveInActiveTextFied
                        defaultVal={userDetails.is_acc_verified}
                        lable="Is Account Verified"
                        onChangeValue={(e) => {
                          setIsAccVerified(e.target.value);
                        }}
                      /> */}
                  </Grid>
                  <Grid item md={4} xs={6}>
                    <Controller
                      name="vqr"
                      control={control}
                      defaultValue={userDetails?.vqr}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            label="VQR"
                            id="vqr"
                            size="small"
                            required
                            sx={{ m: 2 }}
                            defaultValue={userDetails?.vqr}
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        </FormControl>
                      )}
                    ></Controller>
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value="4">
                {" "}
                <Grid container sx={{ pt: 1 }}>
                  <Grid item md={3} xs={6}>
                    <Controller
                      name="hitback"
                      control={control}
                      defaultValue={userDetails.hitback}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            label="Callback"
                            id="hitback"
                            size="small"
                            required
                            sx={{ m: 2 }}
                            defaultValue={userDetails.hitBack}
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        </FormControl>
                      )}
                    ></Controller>
                    {/* <FormControl sx={{ width: "100%" }}>
                        <TextField autoComplete="off"
                          label="Callback"
                          id="callback"
                          size="small"
                          required
                          defaultValue={userDetails.hitBack}
                          onChange={(e) => {
                            checkHitbackValid(e.target.value);
                          }}
                          error={!isCbValid}
                          helperText={!isCbValid && "Enter a valid URL"}
                        />
                      </FormControl> */}
                  </Grid>
                  <Grid item md={3} xs={6}>
                    <Controller
                      name="ip"
                      control={control}
                      defaultValue={userDetails.ip}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            label="IP"
                            id="ip"
                            size="small"
                            required
                            sx={{ m: 2 }}
                            defaultValue={userDetails.ip}
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        </FormControl>
                      )}
                    ></Controller>
                  </Grid>
                  <Grid item md={3} xs={6}>
                    <Controller
                      name="hold"
                      control={control}
                      defaultValue={userDetails.hold}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            label="Hold"
                            id="hold"
                            size="small"
                            required
                            sx={{ m: 2 }}
                            defaultValue={userDetails.hold}
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        </FormControl>
                      )}
                    ></Controller>
                  </Grid>
                  <Grid item md={3} xs={6}>
                    <Controller
                      name="matm_serial"
                      control={control}
                      defaultValue={userDetails?.matm_serial}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            label="MATM Serial"
                            id="matm_serial"
                            size="small"
                            required
                            sx={{ m: 2 }}
                            defaultValue={userDetails?.matm_serial}
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        </FormControl>
                      )}
                    ></Controller>
                  </Grid>
                  <Grid item md={3} xs={6}>
                    <Controller
                      name="payout_limit"
                      control={control}
                      defaultValue={userDetails?.payout_limit}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            label="Payout limit"
                            id="payout_limit"
                            size="small"
                            required
                            sx={{ m: 2 }}
                            defaultValue={userDetails?.payout_limit}
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            type="number"
                            helperText={error ? error.message : null}
                          />
                        </FormControl>
                      )}
                    ></Controller>
                  </Grid>
                  <Grid item md={3} xs={6}>
                    <Controller
                      name="type"
                      control={control}
                      defaultValue={userDetails?.type}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            label="User Type"
                            id="type"
                            size="small"
                            select
                            sx={{ m: 2 }}
                            defaultValue={userDetails?.type}
                            value={bcDropdown}
                            onChange={(e) => setBcDropDown(e.target.value)}
                            // error={!!error}
                            // helperText={error ? error.message : null}
                          >
                            <MenuItem value="BC">BC</MenuItem>
                            <MenuItem value="NONBC">NON-BC</MenuItem>
                          </TextField>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Mount visible={bcDropdown === "BC"}>
                    <Grid item md={3} xs={6}>
                      <Controller
                        name="bc_rate"
                        control={control}
                        defaultValue={userDetails?.bc_rate}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <FormControl sx={{ width: "100%" }}>
                            <TextField
                              autoComplete="off"
                              label="BC Rate"
                              id="bc_rate"
                              size="small"
                              defaultValue={userDetails?.bc_rate}
                              value={value}
                              onChange={onChange}
                              error={!!error}
                              sx={{ m: 2 }}
                              type="number"
                              helperText={error ? error.message : null}
                            />
                          </FormControl>
                        )}
                      ></Controller>
                    </Grid>
                  </Mount>
                  <Grid item md={3} xs={6}>
                    <Controller
                      name="csp"
                      control={control}
                      defaultValue={userDetails?.csp}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            label="Nepal CSP Code"
                            id="csp"
                            size="small"
                            defaultValue={userDetails?.csp}
                            value={value}
                            sx={{ m: 2 }}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        </FormControl>
                      )}
                    ></Controller>
                  </Grid>

                  {/* here */}
                  <Grid item md={3} xs={6}>
                    <Controller
                      name="irctc"
                      control={control}
                      defaultValue={userDetails?.csp}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            label="IRCTC login id"
                            id="irctc"
                            size="small"
                            defaultValue={userDetails?.irctc}
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            sx={{ m: 2 }}
                            helperText={error ? error.message : null}
                          />
                        </FormControl>
                      )}
                    ></Controller>
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value="5">
                <Grid container sx={{ pt: 1 }}>
                  <Grid item md={4} xs={6}>
                    <Controller
                      name="two_factor"
                      control={control}
                      defaultValue={userDetails.two_factor}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            label="Login Type"
                            id="two_factor"
                            size="small"
                            required
                            defaultValue={userDetails.two_factor}
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        </FormControl>
                      )}
                    ></Controller>
                  </Grid>
                </Grid>
              </TabPanel>
            </TabContext>

            <Box
              component="form"
              id="edit-user"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(updateUser)}
              sx={{
                "& .MuiTextField-root": { m: 2 },
                objectFit: "contain",
              }}
            >
              <ModalFooter form="edit-user" request={request} btn="Save User" />
            </Box>
          </Box>
        )}
      </Modal>
    </Box>
  );
};
export default ViewUserModal;
