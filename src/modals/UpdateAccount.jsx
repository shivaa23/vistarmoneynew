import React, { useState } from "react";
import {
  FormControl,
  Grid,
  TextField,
  IconButton,
  Box,
  Modal,
  Tooltip,
  MenuItem,
  Drawer,
  Button,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import ApiEndpoints from "../network/ApiEndPoints";
import { get, postJsonData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "max-content",
  overflowY: "scroll",
};

const UpdateAccount = ({ row, refresh }) => {
  const [open, setOpen] = React.useState(false);
  const [crStatus, setCrStatus] = useState(row.crstatus);
  const [asmList, setAsmList] = useState([]);
  const [request, setRequest] = useState(false);
  const [currentAsm, setCurrentAsm] = useState(
    row && row.asm && row.asm.replace("\t", "")
  );
  const updateAccount = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      id: row.id,
      name: form.name.value,
      establishment: form.b_name.value,
      mobile: form.number.value,
      asm: currentAsm,
      creditlimit: form.crLimit.value,
      creditstatus: crStatus,
    };
    setRequest(true);
    postJsonData(
      ApiEndpoints.UPDATE_ACCOUNT,
      data,
      setRequest,
      (res) => {
        okSuccessToast("Account Updated successfully");
        handleClose();
        if (refresh) refresh();
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  const getAsmList = () => {
    get(
      ApiEndpoints.GET_USERS,
      `page=1&paginate=10&role=Asm&export=`,
      setRequest,
      (res) => {
        const asmArray = res.data.data;
        setAsmList(
          asmArray &&
            asmArray.map((item) => {
              return {
                id: item.id,
                name: item.name,
              };
            })
        );
        setOpen(true);
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  const handleOpen = () => {
    getAsmList();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeCrStatus = (event) => {
    setCrStatus(event.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Tooltip title="update Account">
        <Button
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "8px",
            fontSize: "12px",
            color: "#ffffff",
            fontWeight: "700",
            borderRadius: "8px  ",
            transition: "all 0.3s ease",
            justifyContent: "center",
            background: "#00693E",
            "&:hover": {
              backgroundColor: "#122480",
            },
          }}
          onClick={handleOpen}
        >
          Edit
        </Button>
        {/* <IconButton
          style={{ fontSize: "10px", color: "#0504AA" }}
          onClick={handleOpen}
        >
          <Icon icon="raphael:edit" width={26} height={26} />
        </IconButton> */}
      </Tooltip>

      <Drawer open={open} onClose={handleClose} anchor="right">
        <Box sx={{ width: 400 }} className="sm_modal">
          <ModalHeader
            title="Update Account"
            handleClose={handleClose}
            subtitle="Easily Update Your Account Information Today."
          />
          <Box
            component="form"
            id="update-account"
            noValidate
            autoComplete="off"
            onSubmit={updateAccount}
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
                    defaultValue={row.name}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Business Name"
                    id="b_name"
                    size="small"
                    required
                    defaultValue={row.establishment}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Number"
                    id="number"
                    size="small"
                    required
                    defaultValue={row.mobile}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    select
                    label="ASM"
                    id="asm"
                    size="small"
                    required
                    // defaultValue={row && row.asm.replace("\t", "")}
                    value={currentAsm}
                    onChange={(e) => {
                      setCurrentAsm(e.target.value);
                    }}
                  >
                    {asmList &&
                      asmList.length > 0 &&
                      asmList.map((asm, index) => {
                        return (
                          <MenuItem key={index} value={asm.name}>
                            {asm.name}
                          </MenuItem>
                        );
                      })}
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Credit Limit"
                    id="crLimit"
                    size="small"
                    required
                    defaultValue={row.creditlimit}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    select
                    label="Credit Status"
                    id="crStatus"
                    size="small"
                    required
                    defaultValue={crStatus}
                    onChange={handleChangeCrStatus}
                  >
                    <MenuItem dense value="1">
                      Active
                    </MenuItem>
                    <MenuItem dense value="0">
                      InActive
                    </MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mr: "5px" }}>
              <ModalFooter
                form="update-account"
                request={request}
                btn="save account"
              />
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};
export default UpdateAccount;
