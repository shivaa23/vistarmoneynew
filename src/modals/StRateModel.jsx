import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button, FormControl, Grid, TextField, Tooltip } from "@mui/material";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import ResetMpin from "../modals/ResetMpin";
import ModalFooter from "../modals/ModalFooter";
import PinInput from "react-pin-input";
import ModalHeader from "../modals/ModalHeader";
import ApiEndpoints from "../network/ApiEndPoints";
import useCommonContext from "../store/CommonContext";
import { postJsonData } from "../network/ApiController";

const StRateModel = ({ row, refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [mpin, setMpin] = useState("");
  const { getRecentData } = useCommonContext();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    boxShadow: 24,
    fontFamily: "Poppins",
    // height: { xs: "35vh", md: "38vh" },
    height: "max-content",
    overflowY: "scroll",

    p: 2,
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      id: row.id,
      super_rate: form.rate.value,
      mpin: mpin,
    };
    setRequest(true);
    postJsonData(
      ApiEndpoints.EDIT_SUPER_RATE,
      data,
      setRequest,
      (res) => {
        getRecentData();
        okSuccessToast("Request Processed successfully");
        handleClose();
        if (refresh) refresh();
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
      <Tooltip title=" ST Change Rate">
        <Box>
          {/* <EditIcon
            className="refresh-purple ms-2"
            sx={{
              fontSize: "14px",
            }}
            onClick={handleOpen}
          /> */}
          <Button
            size="small"
            onClick={handleOpen}
            sx={{
              p: 0,
              width: "20px",
              
            }}
            endIcon={<EditIcon />}
          >
            {Number(row.super_rate).toFixed(2)}%
          </Button>
        </Box>
      </Tooltip>
      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <ModalHeader
              title="Change Rate of Super Transfer"
              handleClose={handleClose}
            />
            <Box
              component="form"
              id="super_form"
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
                    <TextField
                      label="Rate"
                      id="rate"
                      size="small"
                      defaultValue={Number(row.super_rate).toFixed(2)}
                      required
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
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      M-PIN
                    </div>
                    <PinInput
                      length={6}
                      focus
                      type="password"
                      onChange={(value, index) => {
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
                  </FormControl>
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                  sx={{ display: "flex", justifyContent: "end", pr: 23, mt: 2 }}
                >
                  <ResetMpin variant="text" />
                </Grid>
              </Grid>
            </Box>
            <ModalFooter form="super_form" request={request} btn="Done" />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};
export default StRateModel;
