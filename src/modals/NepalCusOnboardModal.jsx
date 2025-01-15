import React, { useContext, useRef } from "react";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import AuthContext from "../store/AuthContext";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Modal,
  TextField,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import { useState } from "react";
import {
  SourceIncomeType,
  annualIncome,
  customerType,
} from "../utils/constants";
import ModalFooter from "./ModalFooter";
import { useEffect } from "react";

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
};

const NepalCusOnboardModal = ({
  nepalAllRes,
  nepalOnboardModalOpen,
  getCustomerByMobileOrId,
}) => {
  // console.log("nepalAllRes", nepalAllRes);
  const authCtx = useContext(AuthContext);
  const token = authCtx.nepalToken;
  const [open, setOpen] = useState(false);
  const [customerTypeV, setCutomerTypeV] = useState("");
  const [annualInc, setAnnualInc] = useState("");
  const [onboardReq, setOnboardReq] = useState(false);
  const [sourceInc, setSourceInc] = useState("");
  const reqNo = useRef(localStorage.getItem("nepal_req_id"));
  const nepalNumber = nepalAllRes?.customer?.Mobile?.string;
  // console.log("req no", reqNo.current);
  useEffect(() => {
    if (nepalOnboardModalOpen === "addCustomer") {
      setOpen(true);
    }
  }, [nepalOnboardModalOpen]);

  // const handleOpen = () => {
  //   setOpen(true);
  // };
  const handleClose = () => setOpen(false);

  const customerOnboarding = (e) => {
    e.preventDefault();
    let data = {};
    data = {
      CustomerID: nepalAllRes?.customer?.CustomerId,
      CustomerType: customerTypeV,
      SourceIncomeType: sourceInc,
      AnnualIncome: annualInc,
      token,
      req_id: reqNo?.current.slice(5),
    };
    postJsonData(
      ApiEndpoints.NEPAL_CUSTOMER_ONBOARD,
      data,
      setOnboardReq,
      (res) => {
        okSuccessToast(res?.data?.ResponseMessage);
        if (res?.data?.StatusCode === "1") {
          handleClose();
          setTimeout(() => {
            if (getCustomerByMobileOrId) {
              getCustomerByMobileOrId(
                typeof nepalNumber === "string" ? nepalNumber : nepalNumber[0]
              );
            }
          }, 200);
        }
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  return (
    <Modal open={open}>
      <Box sx={style} className="sm_modal">
        <ModalHeader title="Customer Onboard" handleClose={handleClose} />

        <Box
          component="form"
          id="addCustomer"
          autoComplete="off"
          validate
          onSubmit={customerOnboarding}
          sx={{
            "& .MuiTextField-root": { m: 2 },
            objectFit: "contain",
            width: "100%",
            height: "auto",
            overflowY: "scroll",
            position: "relative",
          }}
        >
          <Grid container sx={{ pt: 1 }}>
            <Grid item md={12} xs={12}>
              <FormControl fullWidth>
                <TextField autoComplete="off"
                  label="Customer Type"
                  id="customer_type"
                  size="small"
                  required
                  select
                  variant="standard"
                  value={customerTypeV}
                  onChange={(e) => setCutomerTypeV(e.target.value)}
                >
                  {customerType.map((item) => {
                    return (
                      <MenuItem value={item.value}>
                        <div style={{ textAlign: "left" }}>{item.label}</div>
                      </MenuItem>
                    );
                  })}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item md={12}>
              <FormControl fullWidth>
                <TextField autoComplete="off"
                  label="Annual Income"
                  id="annual_income"
                  size="small"
                  required
                  select
                  variant="standard"
                  value={annualInc}
                  onChange={(e) => setAnnualInc(e.target.value)}
                >
                  {annualIncome.map((item) => {
                    return (
                      <MenuItem value={item.value}>
                        <div style={{ textAlign: "left" }}>{item.label}</div>
                      </MenuItem>
                    );
                  })}
                </TextField>
              </FormControl>
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <FormControl fullWidth>
                <TextField autoComplete="off"
                  label="Source Income Type"
                  id="source_income_type"
                  size="small"
                  required
                  select
                  variant="standard"
                  value={sourceInc}
                  onChange={(e) => setSourceInc(e.target.value)}
                >
                  {SourceIncomeType.map((item) => {
                    return (
                      <MenuItem value={item.value}>
                        <div style={{ textAlign: "left" }}>{item.label}</div>
                      </MenuItem>
                    );
                  })}
                </TextField>
              </FormControl>
            </Grid>
          </Grid>
          <ModalFooter form="addCustomer" btn="Submit" request={onboardReq} />
        </Box>
      </Box>
    </Modal>
  );
};

export default NepalCusOnboardModal;
