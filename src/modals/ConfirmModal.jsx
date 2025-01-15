import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const ConfirmModal = ({
  dialogeText = "Are you sure",
  dialogeTitle = "Dialoge box",
  btn,
  RadioGroup1,
  RadioGroup2,
  apiCallFunc1,
  hooksetterfunc,
  radioPrevValue,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {btn && <span onClick={handleClickOpen}>{btn}</span>}
      {RadioGroup1 && <span onClick={handleClickOpen}>{RadioGroup1}</span>}
      {RadioGroup2 && <span onClick={handleClickOpen}>{RadioGroup2}</span>}

      {/* (
        <Button variant="outlined" onClick={handleClickOpen}>
          Open alert dialog
        </Button>
      ) */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialogeTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogeText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              hooksetterfunc(radioPrevValue);
              handleClose();
            }}
            variant="contained"
            sx={{ backgroundColor: "#ef5350", p: 0.6, fontSize: "12px" }}
          >
            Cancel
          </Button>
          <Button
            autoFocus
            variant="contained"
            sx={{ backgroundColor: "#4caf50", p: 0.6, fontSize: "12px" }}
            onClick={() => {
              apiCallFunc1();
              handleClose();
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmModal;
