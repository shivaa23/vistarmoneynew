import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import ModalHeader from "./ModalHeader";

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
  pb: 4,
  height: "max-content",
  overflowY: "scroll",
};

const AskForDocsModal = ({ open, setopen }) => {
  const navigate = useNavigate();
  const handleClose = () => {
    setopen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title="Upload Documents" handleClose={handleClose} />
          <Grid container sx={{ pt: 1 }}>
            <Grid
              item
              md={12}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography>Kindly upload your KYC documents first</Typography>
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                mt: 3,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  color: "#fff",
                  p: 0,
                  minWidth: "0px",
                  padding: "0.5rem 1.2rem",
                }}
                onClick={() =>
                  navigate("/customer/my-profile", { state: { docs: true } })
                }
              >
                {/* <Link
                  to="/customer/my-profile"
                  style={{ color: "#fff", padding: "0.5rem 1.2rem" }}
                >
                  Go
                </Link> */}
                Go
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default AskForDocsModal;
