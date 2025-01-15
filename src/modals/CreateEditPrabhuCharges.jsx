import * as React from "react";
import Box from "@mui/material/Box";
import {
  FormControl,
  Grid,
  TextField,
  Button,
  Tooltip,
  IconButton,
  Modal,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState } from "react";
import { Icon } from "@iconify/react";
import {  postJsonData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { whiteColor } from "../theme/setThemeColor";
import Loader from "../component/loading-screen/Loader";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import ApiEndpoints from "../network/ApiEndPoints";

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

const CreateEditPrabhuCharges = ({ refresh, edit = false, row }) => {
  const [open, setOpen] = React.useState(false);
  const [request, setRequest] = useState(false);
  // console.log("request", request);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    let data = {
      service_fee: form.service_fee.value,
      guru_comm: form.guru_comm.value,
      ret_comm: form.ret_comm.value,
      ret_charge: form.ret_charge.value,
      ad_comm: form.ad_comm.value,
      id: row.id,
    };

    edit
      ? postJsonData(
          ApiEndpoints.ADMIN_PRABHU_CHARGES,
          data,
          setRequest,
          (res) => {
            // console.log("res", res.data);
            okSuccessToast(res?.data?.message);
            if (refresh) refresh();
            handleClose();
          },
          (err) => {
            apiErrorToast(err);
            if (refresh) refresh();
          }
        )
      : postJsonData(
          ApiEndpoints.ADMIN_PRABHU_CHARGES,
          data,
          setRequest,
          (res) => {
            // console.log("res", res.data);
            okSuccessToast(res?.data?.message);
            if (refresh) refresh();
            handleClose();
          },
          (err) => {
            apiErrorToast(err);
            if (refresh) refresh();
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
      {" "}
      {edit ? (
        <Tooltip title="Edit Charge">
          <IconButton onClick={handleOpen}>
            <Icon
              icon="basil:edit-solid"
              style={{ fontSize: "24px" }}
              className="refresh-icon-risk"
            />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add Charge">
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
      )}
      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <Loader loading={request} />
            <ModalHeader
              title={edit ? `Edit Charge` : `Create Charge`}
              handleClose={handleClose}
            />
            <Box
              component="form"
              id="prabhucharge"
              validate
              autoComplete="off"
              onSubmit={handleSubmit}
              sx={{
                "& .MuiTextField-root": { m: 2 },
              }}
            >
              <Grid container sx={{ pt: 1 }}>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Service Fee"
                      id="service_fee"
                      size="small"
                      required
                      defaultValue={edit ? row?.service_fee : ""}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Guru Comm"
                      id="guru_comm"
                      size="small"
                      required
                      defaultValue={edit ? row?.guru_comm : ""}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Retailer Comm"
                      id="ret_comm"
                      size="small"
                      required
                      defaultValue={edit ? row?.ret_comm : ""}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Retailer Charge"
                      id="ret_charge"
                      size="small"
                      required
                      defaultValue={edit ? row?.ret_charge : ""}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Ad Comm"
                      id="ad_comm"
                      size="small"
                      required
                      type="number"
                      defaultValue={edit ? row?.ad_comm : ""}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            <ModalFooter
              form="prabhucharge"
              type="submit"
              btn="Submit"
              disable={request}
            />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};
export default CreateEditPrabhuCharges;
