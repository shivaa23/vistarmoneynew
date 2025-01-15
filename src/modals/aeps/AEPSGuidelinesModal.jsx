import { Box, Grid, Modal, Typography, Fade, Slide,Collapse,Zoom } from "@mui/material";
import React from "react";

import { aepsGuidelinesImg, aepsGuidelinesNewImg } from "../../iconsImports";
import ModalFooter from "../ModalFooter";
import { primaryColor } from "../../theme/setThemeColor";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "max-content",
  overflowY: "scroll",
};

const AEPSGuidelinesModal = ({ open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
<Box sx={style} className="sm_modal">
            <Typography
              sx={{
                textAlign: "center",
                fontSize: "25px",
                color: primaryColor(),
              }}
            >
              AEPS Guidelines
            </Typography>
            <Grid container>
              <Grid item md={12} xs={12}>
                <img src={aepsGuidelinesNewImg} alt="guidelines" width="100%" />
              </Grid>
            </Grid>
            <ModalFooter onClick={handleClose} btn="Accept" />
          </Box>
      </Modal>
    </Box>
  );
};

export default AEPSGuidelinesModal;
