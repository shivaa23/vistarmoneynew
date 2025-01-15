import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {  Button, Typography } from "@mui/material";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast } from "../utils/ToastUtil";
import { useState } from "react";
import { get } from "../network/ApiController";
import { useNavigate } from "react-router-dom";
import { primaryColor } from "../theme/setThemeColor";
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

const GetAdModalTxn = ({ row }) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const getData = () => {
    get(
      ApiEndpoints.GET_USER_AD_ASM,
      `id=${row && row.ad_id},${row && row.asm_id},${row && row.user_id}`,
      null,
      (res) => {
        const data = res.data.data;
        setData(data);
        setOpen(true);
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };
  const userData = data && data.find((item) => item.id === Number(row.user_id));
  const asmData = data && data.find((item) => item.id === Number(row.asm_id));
  const adData = data && data.find((item) => item.id === Number(row.ad_id));

  const handleOpen = () => {
    getData();
  };
  const handleClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

  return (
    <Box sx={{}}>
      <Button
        variant="text"
        color="primary"
        sx={{
          width: "10px",
          height: "15px",
          fontSize: "8px",
          backgroundColor: "#FFE3E3",
          color: primaryColor(),
          "&:hover": {
            color: "#fff",
            backgroundColor: primaryColor(),
          },
          borderRadius: "2px",
          mt: 0.5,
        }}
        onClick={handleOpen}
      >
        User Info
      </Button>

      {/* <Tooltip>
        <InfoIcon
          className="otp-hover-purple"
          onClick={handleOpen}
          sx={{ color: "#4045A1", fontSize: "15px" }}
        />
      </Tooltip> */}
      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <ModalHeader title="User Info" handleClose={handleClose} />
            <Box
              component="form"
              id="response"
              noValidate
              autoComplete="off"
              className="text-center"
              onSubmit={(event) => {
                handleClose();
              }}
              sx={{
                "& .MuiTextField-root": { m: 2 },
                objectFit: "contain",
                display: "grid",
                justifyContent: "center",
                alignItems: "left",
              }}
            >
              <Box sx={{ display: "flex", my: 1 }}>
                <Typography>User:</Typography>
                <Box
                  sx={{
                    display: "flex",
                    mx: 3,
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div>{userData && userData.establishment}</div>
                  <div
                    style={{ marginLeft: "12px" }}
                    onClick={() => {
                      navigate("/admin/users", {
                        state: { username: userData && userData.username },
                      });
                    }}
                    className="underline-hover-color"
                  >
                    {userData && userData.username}
                  </div>
                </Box>
              </Box>
              <Box sx={{ display: "flex", my: 1 }}>
                <Typography>AD:</Typography>
                <Box
                  sx={{
                    display: "flex",
                    mx: 3,
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div>{adData && adData.establishment}</div>
                  <div> {adData && adData.username}</div>
                </Box>
              </Box>

              <Box sx={{ display: "flex", my: 1 }}>
                <Typography>ASM:</Typography>
                <Box
                  sx={{
                    display: "flex",
                    mx: 3,
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div>{asmData && asmData.establishment}</div>
                  <div>{asmData && asmData.username}</div>
                </Box>
              </Box>
            </Box>
            <ModalFooter btn="Close" handleClose={handleClose} />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};
export default GetAdModalTxn;
