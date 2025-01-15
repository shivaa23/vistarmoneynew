import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import ModalHeader from "../ModalHeader";
import Mount from "../../component/Mount";
import { useContext } from "react";
import AuthContext from "../../store/AuthContext";
import MyEarnings from "../../component/dashboard/retailer/MyEarnings";
import { currencySetter } from "../../utils/Currencyutil";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "100%", md: "50%" },
  height: "100vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  objectFit: "cover",
  p: 3,
};

const MyEarningsModal = ({ name, users }) => {
  const [open, setOpen] = useState(false);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {/* hidden={!users?.profit} */}

      <Box
        hidden={!users?.profit}
        sx={{
          fontSize: "12px",
          "&:hover": {
            cursor: "pointer",
          },
        }}
        onClick={handleOpen}
      >
        Profit:{" "}
        <span style={{ color: "#00bf78" }}>
          {currencySetter(users?.profit)}
        </span>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title={`Earnings`} handleClose={handleClose} />

          <Mount visible={Number(user.username) === 9999442202}>
            <MyEarnings isTitle={false} isGridStyle={false} />
          </Mount>
        </Box>
      </Modal>
    </>
  );
};

export default MyEarningsModal;
