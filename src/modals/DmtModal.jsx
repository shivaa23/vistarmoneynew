import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button, FormControl, Grid, TextField, Tooltip } from "@mui/material";
import ApiEndpoints from "../network/ApiEndPoints";
import { postJsonData } from "../network/ApiController";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { useState } from "react";
import PinInput from "react-pin-input";
import ResetMpin from "./ResetMpin";
import useCommonContext from "../store/CommonContext";
import EditIcon from "@mui/icons-material/Edit";

const DmtModal = ({ row, refresh }) => {
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
      user_id: row.id,
      charge: form.rate.value,
      mpin: mpin,
    };
    setRequest(true);
    postJsonData(
      ApiEndpoints.DMT_RATE_CHANGE,
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
      <Tooltip title="DMT Change Rate">
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
              fontWeight: "500",
            }}
            endIcon={<EditIcon />}
          >
            {Number(row.dmt_slab2).toFixed(2)}%
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
            <ModalHeader title="Change rate" handleClose={handleClose} />
            <Box
              component="form"
              id="dmt_form"
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
                      autoComplete="off"
                      label="Rate"
                      id="rate"
                      size="small"
                      defaultValue={Number(row.dmt_slab2).toFixed(2)}
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
                  sx={{ display: "flex", justifyContent: "end", pr: 12, mt: 2 }}
                >
                  <Box sx={{ mr: 4 }}>
                    <ResetMpin variant="text" />
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <ModalFooter form="dmt_form" request={request} btn="Done" />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};
export default DmtModal;
