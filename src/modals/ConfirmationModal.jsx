import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Grid } from "@mui/material";
import Loader from "../component/loading-screen/Loader";
import { numberToWord } from "../utils/FormattingUtils";
import { primaryColor } from "../theme/setThemeColor";

const ConfirmationModal = ({
  setIfConfirmed,
  openConfirm,
  setOpenConfirm,
  form,
  amount,
  view,
  ben,
  request,
  mtRequest,
  dmtValue,
}) => {
  const handleClose = () => {
    setOpenConfirm(false);
  };

  return (
    <div>
      <Dialog open={openConfirm} sx={{ width: "100%" }}>
        <Loader loading={request} />
        <DialogTitle
          sx={{
            fontSize: "25px",
            color: primaryColor(),
            textAlign: "center",
          }}
        >
          Are you sure?
        </DialogTitle>
        <DialogContent>
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
                  {view && view === "Money Transfer"
                    ? ben.name
                      ? ben.name
                      : ben.bene_name
                    : ben.bene_name}
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
                  {view && view === "Money Transfer"
                    ? ben.account
                      ? ben.account
                      : ben.bene_acc
                    : ben.bene_acc}
                </td>
              </tr>
              <tr>
                <td>IFSC </td>
                <td>:</td>
                <td style={{ textAlign: "right" }}>{ben.ifsc}</td>
              </tr>
            </table>
          </Grid>
          <DialogContentText sx={{ px: 5 }}>
            <div
              style={{
                textTransform: "capitalize",
                color: "#000",
                marginTop: "8px",
                fontWeight: "600",
                textAlign: "left",
              }}
              className="diff-font"
            >
              Amount : ₹ {amount}
            </div>
            <div
              style={{
                textTransform: "capitalize",
                color: "#000",
                fontWeight: "600",
                marginTop: "8px",
                textAlign: "left",
              }}
            >
              Rupees {numberToWord(amount)}
            </div>
          </DialogContentText>
          {/* <Box
            component="form"
            id="approve_txn"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            className="text-center"
          ></Box> */}
        </DialogContent>
        <DialogActions sx={{ m: 1 }}>
          <Button
            onClick={handleClose}
            size="small"
            sx={{ backgroundColor: "#fff", color: "#9e9e9e" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form={form}
            sx={{
              color: "#fff",
              backgroundColor: "#43a047",
              "&:hover": { backgroundColor: "#43a047" },
            }}
            size="small"
            variant="contained"
            disabled={request || mtRequest}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmationModal;
