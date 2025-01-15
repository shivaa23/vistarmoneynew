import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Grid } from "@mui/material";
import ModalHeader from "./ModalHeader";
import { useEffect } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "20%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
};

const DmrNumberListModal = ({ numberList, setMobile }) => {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (numberList && numberList.length > 0) setOpen(true);
  }, [numberList]);

  const handleClose = () => {
    setOpen(false);
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
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title="Select Number" handleClose={handleClose} />
          {numberList &&
            numberList.map((item, index) => {
              return (
                <Grid
                  style={{
                    textAlign: "center",
                    margin: "12px",
                  }}
                  onClick={() => {
                    setMobile(item.remitter);
                    handleClose();
                  }}
                  className="card-css light-bkgd"
                >
                  {item.remitter}
                </Grid>
              );
            })}
        </Box>
      </Modal>
    </Box>
  );
};
export default DmrNumberListModal;
