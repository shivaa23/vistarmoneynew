import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  Button,
  FormControl,
  Grid,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import { useState } from "react";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PersonIcon from "@mui/icons-material/Person";
import ModalFooter from "./ModalFooter";
import { postJsonData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import ApiEndpoints from "../network/ApiEndPoints";
import CancelIcon from '@mui/icons-material/Cancel';
import Loader from "../component/loading-screen/Loader";
import { Info } from "@mui/icons-material";
import { secondaryColor } from "../theme/setThemeColor";
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

const DeleteBeneficiaryModal = ({
  bene,
  mob,
  getRemitterStatus,
  apiEnd,
  view,
  dmtValue,
}) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [otpData, setOtpData] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setIsConfirmed(false);
  };
  const deleteBene = () => {
    postJsonData(
      apiEnd,
      {
        rem_mobile: mob,
        ben_id: bene.benid ? bene.benid : bene.id,
        id: bene.id,
      },
      setRequest,
      (res) => {
        if (view === "expressTransfer") {
          okSuccessToast(res.data.message);
          handleClose();
          if (getRemitterStatus) {
            getRemitterStatus(mob);
          }
        } else if (view === "moneyTransfer" && dmtValue === "dmt2") {
          okSuccessToast(res.data.message);
          handleClose();
          if (getRemitterStatus) {
            getRemitterStatus(mob);
          }
        } else {
          const data = res.data;
          setOtpData(data);
          setIsConfirmed(true);
        }
      },
      (err) => {
        apiErrorToast(err);
        handleClose();
      }
    );
  };

  const validateOtp = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      otp: form.otp.value,
      otpReference: otpData.otp_ref_id,
    };
    postJsonData(
      ApiEndpoints.VALIDATE_OTP,
      data,
      setRequest,
      (res) => {
        okSuccessToast("Beneficiary deleted SuccessFully");
        handleClose();
        if (getRemitterStatus) {
          getRemitterStatus(mob);
        }
      },
      (err) => {
        apiErrorToast(err);
        handleClose();
      }
    );
  };

  return (
    <Box
      sx={{
        display: "grid",
        justifyContent: "center",
      }}
    >
      <Tooltip title="Delete">
        <CancelIcon
          className="circle-red"
          fontSize="small"
          sx={{
            color: "#df5f5f",
            ml: 1,
            mr: 0.6,
          }}
          onClick={handleOpen}
        />
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
          subtitle="Simplify Your List: Easily Remove Beneficiaries with VistarMoney!"
            title={
              view === "expressTransfer"
                ? "Delete Vendor"
                : "Delete Beneficiary"
            }
            handleClose={handleClose}
          />
          <Typography
            className="text-center"
            sx={{
              fontSize: "14px",
              fontWeight: "600",
              color: secondaryColor(),
            }}
          >
            <Info sx={{ mr: 1 }} />
            {`Are you sure you want to delete this ${
              view === "expressTransfer" ? "vendor" : "beneficiary"
            } ?`}
          </Typography>
          <Box
            component="form"
            id="deleteBene"
            noValidate
            autoComplete="off"
            onSubmit={validateOtp}
            className="text-center"
            sx={{
              "& .MuiTextField-root": { m: 2 },
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
                    <td style={{ padding: "16px", paddingBottom: "6px" }}>
                      <PersonIcon sx={{ mr: 1, fontSize: "16px" }} />
                      Name
                    </td>
                    <td style={{ padding: "16px", paddingBottom: "6px" }}>:</td>
                    <td style={{ padding: "16px", paddingBottom: "6px" }}>
                      {view === "expressTransfer"
                        ? bene.bene_name
                        : bene.name
                        ? bene.name
                        : bene.bene_name}
                      {/* {"(" + bene.bank + ")"} */}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "16px", paddingTop: "6px" }}>
                      <AccountBalanceIcon
                        fontSize="small"
                        sx={{ mr: 1, fontSize: "16px" }}
                      />
                      A/C{" "}
                    </td>{" "}
                    <td style={{ padding: "16px", paddingTop: "6px" }}>:</td>
                    <td style={{ padding: "16px", paddingTop: "6px" }}>
                      {view === "expressTransfer"
                        ? bene.bene_acc
                        : bene.account
                        ? bene.account
                        : bene.accno
                        ? bene.accno
                        : bene.bene_acc}
                    </td>
                  </tr>
                </table>
              </Grid>

              {isConfirmed && (
                <Grid
                  item
                  md={12}
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <FormControl sx={{ width: "76%" }}>
                    <TextField autoComplete="off"
                      label="Enter OTP"
                      id="otp"
                      size="small"
                      required
                      // sx={{
                      //   "& label": {
                      //     marginLeft: "35%",
                      //   },
                      //   "&.Mui-focused": {
                      //     marginLeft: "35%",
                      //   },
                      // }}
                    />
                  </FormControl>
                </Grid>
              )}
            </Grid>
            {!isConfirmed && (
              <Button
                sx={{ width: "70%", mt: 2 }}
                className="btn-background"
                onClick={() => {
                  deleteBene();
                }}
              >
                Delete
              </Button>
            )}
          </Box>
          {isConfirmed && isConfirmed ? (
            <ModalFooter
              form="deleteBene"
              request={request}
              btn="Delete Beneficiary"
            />
          ) : (
            <ModalFooter
              handleClose={handleClose}
              request={request}
              btn="Cancel"
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};
export default DeleteBeneficiaryModal;
