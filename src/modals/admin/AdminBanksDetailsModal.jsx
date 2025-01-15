import { Box, Button, Grid, Modal } from "@mui/material";
import React from "react";
import { useState } from "react";
import ModalHeader from "../ModalHeader";
import ModalFooter from "../ModalFooter";
import { primaryLight, primaryLightest } from "../../theme/setThemeColor";

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

const AdminBanksDetailsModal = ({ row }) => {
  // console.log("row", row);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        className="button-red"
        sx={{ py: 0.5, ml: 2, textTransform: "none", fontSize: "12px" }}
        onClick={handleOpen}
      >
        Details
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title="Bank details" handleClose={handleClose} />
          <Grid container sx={{ mt: 2 }}>
            <Grid
              item
              md={12}
              sm={12}
              xs={12}
              sx={{
                px: 3,
                backgroundColor: primaryLightest(),
                borderRadius: "8px",
              }}
            >
              {/* <div className="bank-details-modal">
                <span className="bank-details-modal-label">IFSC:</span>
                <span>5456465</span>
              </div> */}
            </Grid>
          </Grid>
          <ModalFooter btn="Cancel" onClick={handleClose} />
        </Box>
      </Modal>
    </div>
  );
};

export default AdminBanksDetailsModal;
