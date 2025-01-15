import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { FormControl, Grid, TextField, Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { postJsonData } from "../network/ApiController";
import useCommonContext from "../store/CommonContext";
import Loader from "../component/loading-screen/Loader";

const AddBeneficiaryUpiModal = ({ rem_mobile, apiEnd, getRemitterStatus }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [vpaError, setVpaError] = useState("");

  const { getRecentData } = useCommonContext();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setVpaError(""); // Reset error when modal closes
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const vpa = form.vpa.value;

    // Check if VPA contains '@'
    if (!vpa.includes("@")) {
      setVpaError("VPA must contain '@'");
      return; // Prevent form submission
    }

    const data = {
      name: form.name.value,
      rem_number: rem_mobile,
      vpa,
    };

    postJsonData(
      apiEnd,
      data,
      setRequest,
      (res) => {
        getRecentData();
        okSuccessToast("Beneficiary Added Successfully");
        handleClose();
        if (getRemitterStatus) getRemitterStatus(rem_mobile);
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Button
        variant="text"
        className="refresh-icon-risk"
        size="small"
        onClick={handleOpen}
        sx={{
          color: "Dark-Blue",
          fontWeight: "bold",
          textTransform: "capitalize",
          fontSize: "10px",
          display: "flex",
          alignItems: "center",
          "&:hover": {
            color: "Dark-Blue",
            backgroundColor: "#D8D8D8",
            borderRadius: 8,
          },
        }}
      >
        <AddCircleIcon sx={{ mr: 1, fontSize: "16px" }} />
        Add Beneficiary
      </Button>

      <Drawer open={open} onClose={handleClose} anchor="right">
        <Box
          sx={{
            width: 400,
            p: 2,
            height: "100%",
            boxShadow: 24,
            fontFamily: "Poppins",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
          role="presentation"
        >
          <Loader loading={request} />
          <ModalHeader
            title="Add Beneficiary"
            subtitle="Easily Add Your Beneficiary and Simplify Your Transactions with DilliPay!"
            handleClose={handleClose}
          />

          <Box
            component="form"
            id="addbene"
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": { m: 1 },
              flexGrow: 1,
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
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="VPA"
                    id="vpa"
                    size="small"
                    required
                    error={!!vpaError}
                    helperText={vpaError} // Show the error message
                  />
                </FormControl>
              </Grid>
            </Grid>
            <ModalFooter
              form="addbene"
              request={request}
              btn="Add Beneficiary"
            />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default AddBeneficiaryUpiModal;
