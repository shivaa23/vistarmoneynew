import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  FormControl,
  Grid,
  TextField,
  Tooltip,
  IconButton,
  MenuItem,
  Button,
  Drawer,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { get, postJsonData } from "../network/ApiController";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState } from "react";
import { whiteColor } from "../theme/setThemeColor";

const AddBankAccountModal = ({ refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [asmList, setAsmList] = useState([]);
  const [currentAsm, setCurrentAsm] = useState("");

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    boxShadow: 24,
    fontFamily: "Poppins",
    height: "max-content",
    overflowY: "scroll",
    p: 2,
  };
  const handleOpen = () => {
    getAsmList();
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      name: form.owner_name.value,
      establishment: form.shop_name.value,
      mobile: form.mobile.value,
      creditlimit: form.credit_limit.value,
      asm: currentAsm,
    };
    setRequest(true);
    postJsonData(
      ApiEndpoints.ADD_ACCOUNT,
      data,
      setRequest,
      (res) => {
        okSuccessToast("Account added successfully");
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

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Tooltip title="Add Account">
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
            Account
          </Button>
        </Tooltip>
      {/* <Tooltip title="Add Account">
        <IconButton
          aria-label="addAccount"
          onClick={handleOpen}
          sx={{
            color: "black",
          }}
        >
          <AddCircleOutlineIcon className="refresh-icon-table" />
        </IconButton>
      </Tooltip> */}

      <Box>
        <Drawer
          open={open}
          anchor="right"
          onClose={handleClose}
         
        >
          <Box sx={{width:400}} >
            <ModalHeader title="Add Account" handleClose={handleClose} subtitle="Easily Add New Accounts with DilliPay" />
            <Box
              component="form"
              id="addAcc"
              validate
              autoComplete="off"
              onSubmit={handleSubmit}
              sx={{
                "& .MuiTextField-root": { m: 1 },
              }}
            >
              <Grid container sx={{ pt: 1 }}>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Owner Name"
                      id="owner_name"
                      size="small"
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Shop Name"
                      id="shop_name"
                      size="small"
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Registerd Mobile"
                      id="mobile"
                      size="small"
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Credit Limit"
                      id="credit_limit"
                      size="small"
                      required
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
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
              <Box sx={{mr:"5px"}}>
              <ModalFooter form="addAcc" request={request} />
              </Box>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};
export default AddBankAccountModal;
