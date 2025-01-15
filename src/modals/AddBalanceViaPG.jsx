import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { useState } from "react";
import WalletIcon from "@mui/icons-material/Wallet";
import Loader from "../component/loading-screen/Loader";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast } from "../utils/ToastUtil";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import RHFTextField from "../component/RHFTextField";
import { PATTERNS } from "../utils/ValidationUtil";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  boxShadow: 24,
  fontFamily: "Poppins",
  height: "max-content",
  overflowY: "scroll",
  p: 2,
};
const AddBalanceViaPG = ({ refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const schema = yup.object().shape({
    cust_email: yup.string().required("customer email required"),
    cust_name: yup.string().required("customer name required"),
    cust_phone: yup
      .string()
      .required("customer phone required")
      .matches(PATTERNS.MOBILE, "invalid mobile number"),
    amount: yup
      .number()
      .required("transfer amount required")
      .min(100)
      .max(500000)
      .typeError("amount must be a number"),
  });

  const defaultValues = useMemo(
    () => ({
      cust_email: "",
      cust_name: "",
      cust_phone: "",
      amount: "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), defaultValues });

  const createOrder = (fData) => {
    postJsonData(
      ApiEndpoints.CREATE_ORDER,
      fData,
      setRequest,
      (res) => {
        const data = res.data.data;
        const hash = res.data.hash?.toUpperCase();
        const newData = {
          ...data,
          hash,
        };

        // prepare querystring parameters for the api .........
        const queryString = Object.keys(newData)
          .map(
            (key) =>
              `${encodeURIComponent(key)?.toUpperCase()}=${encodeURIComponent(
                newData[key]
              )}`
          )
          .join("&");
        const REDIRECT_URL = `https://www.paygoal.in/order/v1/payment?${queryString}`;
        window.open(REDIRECT_URL, "_blank");
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };
  return (
    <>
      <div className="hover-zoom" onClick={handleOpen}>
        <IconButton
          className="hover-zoom"
          sx={{ display: "contents", color: "#fff" }}
        >
          <Tooltip title="Add Money" placement="left">
            <div className="d-flex">
              <WalletIcon className="hover-white" sx={{ color: "#D53E3E" }} />
              <Typography sx={{ fontWeight: "bold" }}>+</Typography>
            </div>
          </Tooltip>
        </IconButton>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <Loader loading={request} />
          <ModalHeader title="Add Balance" handleClose={handleClose} />
          <Box
            component="form"
            id="money_transfer"
            validate
            autoComplete="off"
            onSubmit={handleSubmit(createOrder)}
            sx={{
              "& .MuiTextField-root": { m: 2 },
            }}
          >
            <Grid container sx={{ pt: 1 }}>
              <Grid item md={6} xs={12}>
                <RHFTextField
                  label="Customer Name"
                  name="cust_name"
                  control={control}
                  errors={errors}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <RHFTextField
                  label="Customer Email"
                  name="cust_email"
                  control={control}
                  errors={errors}
                />
              </Grid>
              <Grid item xs={12}>
                <RHFTextField
                  label="Customer Mobile"
                  name="cust_phone"
                  control={control}
                  errors={errors}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <RHFTextField
                  label="Amount"
                  name="amount"
                  control={control}
                  errors={errors}
                />
              </Grid>
            </Grid>
          </Box>
          <ModalFooter form="money_transfer" request={request} btn="Send" />
        </Box>
      </Modal>
    </>
  );
};
export default AddBalanceViaPG;
