import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FormControl, Grid, Typography, Button, Tooltip } from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { postJsonData } from "../network/ApiController";
import { useState } from "react";
import PinInput from "react-pin-input";
import AuthContext from "../store/AuthContext";
import { useContext } from "react";
import ResetMpin from "./ResetMpin";
import useCommonContext from "../store/CommonContext";
import Loader from "../component/loading-screen/Loader";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
const AccountVerificationModal = ({
  ben,
  rem_number,
  remitterStatus,
  getRemitterStatus,
  dmtValue,
  view = "",
}) => {
  // console.log("ben", ben);
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [mpin, setMpin] = useState("");
  const [err, setErr] = useState();
  const { getRecentData } = useCommonContext();

  const authCtx = useContext(AuthContext);
  const loc = authCtx.location && authCtx.location;
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
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (mpin !== "") {
      const data = {
        number: rem_number && rem_number,
        ben_acc: ben.bene_acc
          ? ben.bene_acc
          : ben.account
          ? ben.account
          : ben.accno,
        ben_id: ben.id ? ben.id : ben.bene_id,
        ifsc: ben.ifsc,
        latitude: loc.lat,
        longitude: loc.long,
        ben_name: ben.bene_name && ben.bene_name ? ben.bene_name : ben.name,
        pf: "WEB",
        mpin: mpin,
        verified: dmtValue === "dmt2" ? 1 : undefined,
      };
      setRequest(true);
      postJsonData(
        ApiEndpoints.VERIFY_ACC,
        data,
        setRequest,
        (res) => {
          getRecentData();
          okSuccessToast(res.data.message);
          handleClose();
          if (remitterStatus) getRemitterStatus(rem_number);
        },
        (error) => {
          if (error && error) {
            if (error.response.data.message === "Invalid M Pin") {
              setErr(error.response.data);
            } else {
              getRecentData();
              setErr("");
              handleClose();
              apiErrorToast(error);
            }
            if (remitterStatus) getRemitterStatus(rem_number);
          }
        }
      );
    } else {
      setErr("");
      setMpin("");
      const error = {
        message: "MPIN required",
      };
      setErr(error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
      }}
    >
      <Tooltip title="Verify Now">
        <Button
          endIcon={<PriorityHighIcon />}
          className="button-prop"
          sx={{
            fontSize: "13px",
            py: 0,
            ml: 1,
            px: 1,
            display: "flex",
            alignItems: "center",
          }}
          onClick={handleOpen}
        >
          <Loader loading={request} size="small" />
          Verify
        </Button>
      </Tooltip>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <Loader loading={request} />
          <ModalHeader
            title="Verify Account"
            subtitle="Verify Now, Transact with Confidence!"
            handleClose={handleClose}
          />
          <Box
            component="form"
            id="expMoneyTransfer"
            validate
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
          >
            <Grid container sx={{ pt: 1 }}>
              <Grid
                item
                md={12}
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <table className="mt-table">
                  <tr>
                    <td>Name</td>
                    <td>:</td>
                    <td style={{ textAlign: "right" }}>
                      {ben.bene_name && ben.bene_name
                        ? ben.bene_name
                        : ben.name}
                    </td>
                  </tr>
                  <tr>
                    <td>Bank Name </td> <td>:</td>
                    <td style={{ textAlign: "right" }}>
                      {ben.bank ? ben.bank : ben.bankname}
                    </td>
                  </tr>
                  <tr>
                    <td>Account </td>
                    <td>:</td>
                    <td style={{ textAlign: "right" }}>
                      {ben.bene_acc && ben.bene_acc
                        ? ben.bene_acc
                        : ben.account
                        ? ben.account
                        : ben.accno}
                    </td>
                  </tr>
                  <tr>
                    <td>IFSC </td>
                    <td>:</td>
                    <td style={{ textAlign: "right" }}>{ben.ifsc}</td>
                  </tr>
                </table>
              </Grid>

              <Grid
                item
                md={12}
                xs={12}
                sx={{ display: "flex", justifyContent: "center", mt: 2 }}
              >
                <FormControl>
                  <Typography
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    Enter M-PIN
                  </Typography>
                  <PinInput
                    length={6}
                    focus
                    type="password"
                    onChange={(value, index) => {
                      setMpin(value);
                    }}
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
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sx={{ display: "flex", justifyContent: "end", mt: 2 }}
                  >
                    <ResetMpin variant="text" />
                  </Grid>
                </FormControl>
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                {err && err && (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                      fontSize: "12px",
                      px: 2,
                      color: "#DC5F5F",
                    }}
                  >
                    {err.message && err.message && (
                      <div>{err && err.message}</div>
                    )}

                    {err.data && err.message === "Invalid M Pin" && (
                      <div className="blink_text">
                        Attempts remaining:{err && 5 - Number(err.data)}
                      </div>
                    )}
                  </Box>
                )}
              </Grid>
            </Grid>
            <ModalFooter
              form="expMoneyTransfer"
              request={request}
              btn="Proceed"
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
export default AccountVerificationModal;
