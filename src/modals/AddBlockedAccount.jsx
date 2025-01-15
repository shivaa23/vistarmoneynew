import * as React from "react";
import Box from "@mui/material/Box";
import {
  FormControl,
  Grid,
  TextField,
  Tooltip,
  IconButton,
  Button,
  Drawer,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState } from "react";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { get, postJsonData } from "../network/ApiController";
import { whiteColor } from "../theme/setThemeColor";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const AddBlockedAccount = ({ refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [asmList, setAsmList] = useState([]);

  // Define the Yup validation schema
  const schema = Yup.object().shape({
    acc_no: Yup.string()
      .required("Account number is required")
      .matches(/^\d{5,16}$/, "Account number must be between 5 and 16 digits")
  });

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const handleOpen = () => {
    getAsmList();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (data) => {
    setRequest(true);
    postJsonData(
      ApiEndpoints.GET_BLOCKED_AC,
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
            asmArray.map((item) => ({
              id: item.id,
              name: item.name,
            }))
        );
        setOpen(true);
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "end" }}>
      <Tooltip title="Add Account">
        <Button
          variant="outlined"
          className="refresh-icon-risk"
          onClick={handleOpen}
          startIcon={
            <IconButton sx={{ p: 0, color: whiteColor() }}>
              <AddCircleOutlineIcon />
            </IconButton>
          }
          sx={{ py: 0.3 }}
        >
          Block Account
        </Button>
      </Tooltip>

      <Box>
        <Drawer open={open} anchor="right" onClose={handleClose}>
          <Box sx={{ width: 400 }}>
            <ModalHeader
              title="Add Account"
              handleClose={handleClose}
              subtitle="Easily Add New Accounts with VistarMoney"
            />
            <Box
              component="form"
              id="addAcc"
              validate="true"
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ "& .MuiTextField-root": { m: 1 } }}
            >
              <Grid container sx={{ pt: 1 }}>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <Controller
                      name="acc_no"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          autoComplete="off"
                          label="Account Number"
                          id="acc_no"
                          size="small"
                          required
                          error={!!errors.acc_no}
                          helperText={errors.acc_no ? errors.acc_no.message : ""}
                          inputProps={{
                            maxLength: 16, // Limit to 16 digits
                            pattern: "[0-9]*", // Ensure only numbers can be input
                          }}
                          onInput={(e) => {
                            // Allow only digits
                            e.target.value = e.target.value.replace(/[^0-9]/g, "");
                          }}                    
                              />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      autoComplete="off"
                      label="IFSC"
                      id="ifsc"
                      size="small"
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ mr: "5px" }}>
                <ModalFooter form="addAcc" request={request} />
              </Box>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default AddBlockedAccount;
