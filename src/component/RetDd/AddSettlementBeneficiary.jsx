import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  Modal,
  Tooltip,
} from "@mui/material";
import React from "react";
import { whiteColor } from "../../theme/setThemeColor";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Loader from "../loading-screen/Loader"; 
import ModalHeader from "../../modals/ModalHeader";

// RHF
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import RHFTextField from "../RHFTextField";
import ModalFooter from "../../modals/ModalFooter";
import { postJsonData } from "../../network/ApiController";
import ApiEndpoints from "../../network/ApiEndPoints";
import {
  apiErrorToast,
  confirmButtonSwalSettlement,
  okSuccessToast,
} from "../../utils/ToastUtil";
import { useContext } from "react";
import AuthContext from "../../store/AuthContext";
import PinInput from "react-pin-input";
import useCommonContext from "../../store/CommonContext";
import { PATTERNS } from "../../utils/ValidationUtil";
import BankSearch from "../BankSearch";
import { useState } from "react";

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

// VERIFY_ACC: "dmr/accountVerification",

const AddSettlementBeneficiary = ({ refresh }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx && authCtx.user;
  const loc = authCtx.location && authCtx.location;
  const { getRecentData } = useCommonContext();
  const [err, setErr] = useState();
  const [mpin, setMpin] = useState("");
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [bankName, setBankName] = useState("");
  const schema = yup.object().shape({
    ben_name: yup
      .string()
      .required("Name is required")
      .matches(PATTERNS.NAME, "Enter Atleat 2 alphabets"),
    ben_acc: yup
      .string()
      .required("Account Number is required")
      .matches(PATTERNS.ACCOUNT_NUMBER, "Invalid account number"),
    ifsc: yup
      .string()
      .required("IFSC is required")
      .matches(PATTERNS.IFSC, "Invalid IFSC number"),
  });

  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const addBeneApiCall = (name) => {
    const data = {
      name: name,
      acc_number: getValues("ben_acc"),
      ifsc: getValues("ifsc"),
      bank: bankName,
    };
      postJsonData(
      ApiEndpoints.DMR_SETTLEMENTS,
      data,
      setRequest,
      (res) => {
        if (refresh) refresh();
        okSuccessToast("Beneficiary Added successfully");
        handleClose();
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const addSettlementBeneficiary = (data) => {
    // first we verify  the bene account details

    data.latitude = loc.lat;
    data.longitude = loc.long;
    data.mpin = mpin;
    data.pf = "web";
    data.number = user?.username;
    data.ben_id = user?.username;
    data.bank = bankName;

    postJsonData(
      ApiEndpoints.VERIFY_ACC,
      data,
      setRequest,
      (res) => {
        // handleClose();
        confirmButtonSwalSettlement(
          () => addBeneApiCall(res?.data?.message),
          res?.data?.message
        );
        getRecentData();
      },
      (err) => {
        apiErrorToast(err);
        getRecentData();
        // confirmButtonSwalSettlement(
        //   () => addBeneApiCall("Avinash 05"),
        //   "Testing"
        // );
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
      <Tooltip title="Add Beneficiary">
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
          Beneficiary
        </Button>
      </Tooltip>
      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <Loader loading={request} />
            <ModalHeader title={`Beneficiary`} handleClose={handleClose} />
            <Box
              component="form"
              id="settlementBene"
              validate
              autoComplete="off"
              onSubmit={handleSubmit(addSettlementBeneficiary)}
              sx={{
                "& .MuiTextField-root": { m: 2 },
              }}
            >
              <Grid container spacing={1} sx={{ pt: 1 }}>
                <Grid item xs={12} md={12}>
                  <RHFTextField
                    label="Name"
                    name="ben_name"
                    control={control}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <RHFTextField
                    label="Account Number"
                    name="ben_acc"
                    control={control}
                    errors={errors}
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <RHFTextField
                    label="IFSC"
                    name="ifsc"
                    control={control}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <BankSearch
                      label="Bank Name"
                      endpt={ApiEndpoints.GET_BANK_DMR}
                      bankObj={(bank) => {
                        setBankName(bank);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <FormControl>
                    <div
                      style={{ display: "flex", justifyContent: "flex-start" }}
                    >
                      Enter M-PIN
                    </div>
                    <PinInput
                      length={6}
                      focus
                      type="password"
                      onChange={(value, index) => {
                        if (err !== "") {
                          setErr("");
                        }
                        setMpin(value);
                      }}
                      inputMode="text"
                      regexCriteria={/^[0-9]*$/}
                      inputStyle={{
                        width: "40px",
                        height: "40px",
                        marginRight: { xs: "3px", md: "5px" },
                        textAlign: "center",
                        borderRadius: "0",
                        border: "none",
                        borderBottom: "1px solid #000",
                        padding: "5px",
                        outline: "none",
                      }}
                    />
                    {err && err && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 2,
                          fontSize: "12px",
                          px: 2,
                          color: "#DC5F5F",
                          alignItems: "flex-start",
                        }}
                      >
                        {err && <div>{err && err}</div>}
                      </Box>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            <ModalFooter
              form={"settlementBene"}
              btn="Verify"
              type={"submit"}
              disable={request}
            />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default AddSettlementBeneficiary;
