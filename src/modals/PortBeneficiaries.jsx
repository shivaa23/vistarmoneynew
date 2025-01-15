import React, { useState } from "react";
import { get, postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import {
  Box,
  FormControl,
  Grid,
  Modal,
  TextField,
  Tooltip,
} from "@mui/material";
import VerifyOtpLogin from "./VerifyOtpLogin";
import Loader from "../component/loading-screen/Loader";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import ApiSearch from "../component/ApiSearch";
import { port } from "../iconsImports";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  height: "max-ceontent",
  overflowY: "scroll",
  p: 2,
};

const PortBeneficiaries = ({
  view,
  dmtValue,
  ben,
  remitterStatus,
  getRemitterStatus,
}) => {
  // console.log("remitterStatus", remitterStatus);
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [otpRef, setOtpRef] = useState("");
  const [secureValidate, setSecureValidate] = useState("");
  const [bankName, setBankName] = useState("");
  const [ifscVal, setIfscVal] = useState("");
  const [bankId, setBankId] = useState("");

  // console.log("bankList", bankList);

  const handleOpen = () => {
    getBankList();
  };
  const handleClose = () => {
    setOpen(false);
  };

  const portBene = (e) => {
    e.preventDefault();
    const data = {
      name: ben?.bene_name
        ? ben.bene_name.replace(/[^a-zA-Z ]/g, "")
        : ben.name.replace(/[^a-zA-Z ]/g, ""),
      rem_mobile: remitterStatus?.mobile,
      account_number: ben.bene_acc
        ? ben.bene_acc.toUpperCase()
        : ben.account.toUpperCase(),
      ifsc: ifscVal,
      bank_name: bankName,
      bank_id: bankId,
      verified:
        dmtValue === "dmt2" && ben.status === 1
          ? 1
          : dmtValue === "dmt1" && ben?.verificationDt !== null
          ? 1
          : 0,
    };
    postJsonData(
      dmtValue === "dmt2"
        ? ApiEndpoints.ADD_BENE
        : dmtValue === "dmt1"
        ? ApiEndpoints.DMT2_ADD_BENE
        : "",
      data,
      setRequest,
      (res) => {
        if (res?.data?.status === "OTP" && dmtValue === "dmt2") {
          setSecureValidate("Beneficiary");
          setOtpRef(res?.data?.otpReference);
          handleClose();
        } else {
          okSuccessToast(res?.data?.message);
          if (getRemitterStatus) getRemitterStatus(remitterStatus?.mobile);
          handleClose();
        }
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };
  const getBankList = () => {
    get(
      view === "MT_View" && dmtValue === "dmt2"
        ? ApiEndpoints.GET_BANK_DMR
        : ApiEndpoints.DMT2_BANK_LIST,
      ``,
      setRequest,
      (res) => {
        const data = res.data.data;
        setBankList(data);
        setOpen(true);
      },
      (err) => {
        apiErrorToast(err);
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
      <Tooltip title="PORT">
        <Loader loading={request} size="small" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            color: "#cc0000",

            border: "3px solid #3c3a3a",
            gap: "2px",
            padding: "0.8px",
          }}
        >
          <img
            src={port}
            onClick={handleOpen}
            alt="PORT"
            style={{ width: "16px", height: "14px" }} // Added margin for spacing
          />
          <span>PORT</span>
        </div>
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
            <ModalHeader title="Port Beneficiary" handleClose={handleClose} />
            <Box
              component="form"
              id="portbene"
              validate
              autoComplete="off"
              onSubmit={portBene}
              sx={{
                "& .MuiTextField-root": { m: 1 },
              }}
            >
              <Grid container sx={{ pt: 1 }}>
                <Grid item md={12} xs={12}>
                  {/* <FormControl fullWidth>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={bankList}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setBankId(
                            view === "MT_View" && dmtValue === "dmt2"
                              ? newValue.bankId
                              : dmtValue === "dmt1"
                              ? newValue.id
                              : newValue.bankId
                          );
                          setIfscVal(
                            view === "MT_View" && dmtValue === "dmt2"
                              ? newValue.ifscGlobal
                              : dmtValue === "dmt1"
                              ? newValue.ifsc
                              : newValue.ifscGlobal
                          );
                          setBankName(newValue.name);
                        }
                      }}
                      sx={{ width: "97%" }}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField autoComplete="off"
                          {...params}
                          label="Select Bank"
                          size="small"
                          required
                        />
                      )}
                      clearIcon={
                        <BackspaceIcon
                          sx={{ fontSize: "15px", ml: 0 }}
                          onClick={() => {
                            setBankId("");
                            setIfscVal("");
                            setBankName("");
                          }}
                        />
                      }
                    />
                  </FormControl> */}
                  <ApiSearch
                    label="Search Bank"
                    name="user_id"
                    placeholder="Bank"
                    cb1={(item) => {
                      setBankId(
                        view === "MT_View" && dmtValue === "dmt1"
                          ? item.id
                          : item.bankId
                      );
                      setIfscVal(
                        view === "MT_View" && dmtValue === "dmt1"
                          ? item.ifsc
                          : item.ifscGlobal
                      );
                      setBankName(item.newValue);
                    }}
                    nameKeys={["name"]}
                    searchApi={
                      view === "MT_View" && dmtValue === "dmt1"
                        ? ApiEndpoints.DMT2_BANK_LIST
                        : ApiEndpoints.GET_BANK_DMR
                    }
                    sx={{
                      mt: 3,
                      width: "97%",
                    }}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      autoComplete="off"
                      label="Name"
                      id="name"
                      size="small"
                      defaultValue={ben.bene_name ? ben?.bene_name : ben?.name}
                      required
                      disabled
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      autoComplete="off"
                      label="Account Number"
                      id="accno"
                      size="small"
                      defaultValue={ben.bene_acc ? ben?.bene_acc : ben?.account}
                      required
                      disabled
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <ModalFooter
                form="portbene"
                request={request}
                btn="Port Beneficiary"
              />
            </Box>
          </Box>
        </Modal>
      </Box>
      <VerifyOtpLogin
        secureValidate={secureValidate}
        setSecureValidate={setSecureValidate}
        showLaoder={false}
        btn="Verify OTP"
        data={otpRef}
      />
    </Box>
  );
};

export default PortBeneficiaries;
