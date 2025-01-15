import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Avatar, Button, Divider, Grid, Typography } from "@mui/material";
import ModalHeader from "./ModalHeader";
import { loginPage1,  success_gif } from "../iconsImports";
import { useState } from "react";
import AnimateIcon from "../component/AnimateIcon";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import InfoIcon from "@mui/icons-material/Info";
import moment from "moment";
import { getEnv } from "../theme/setThemeColor";
import { PROJECTS } from "../utils/constants";

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

const SuccessRechargeModal = ({ successRecharge, setShowSuccess }) => {
  const [open, setOpen] = useState(true);

  const envName = getEnv();
  const handleClose = () => {
    setOpen(false);
    setShowSuccess(false);
  };

  return (
    <Box
      sx={{
        display: "grid",
        justifyContent: "center",
      }}
    >
      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <ModalHeader title="" handleClose={handleClose} />
            <Box
              component="div"
              id="repeatRecharge"
              noValidate
              autoComplete="off"
              className="text-center"
              sx={{
                "& .MuiTextField-root": { m: 2 },
                objectFit: "contain",
                display: "grid",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid
                container
                sx={{ pt: 1, display: "flex", justifyContent: "center" }}
              >
                <Grid
                  container
                  sx={{
                    backgroundColor: "#0077b6",
                    px: 2,
                    borderRadius: "8px",
                    width: { lg: "80%", md: "80%", sm: "100%", sx: "100%" },
                  }}
                >
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      fontWeight: "bold",
                      color: "#fff",
                      alignItems: "center",
                      pt: 2,
                    }}
                  >
                    <span>
                      {envName === PROJECTS.moneyoddr ? (
                        <span className="diff-font">₹ </span>
                      ) : (
                        <CurrencyRupeeIcon sx={{ fontSize: "2.5rem" }} />
                      )}
                    </span>
                    <span style={{ fontSize: "2.5rem" }}>
                      {successRecharge?.amount}
                    </span>
                    {/* <div>&#8377; {successRecharge.amount} 400</div> */}
                  </Grid>
                  <Grid
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                      p: 0,
                      mb: 2,
                    }}
                  >
                    <Box sx={{ pr: 1 }}>
                      <AnimateIcon
                        src={success_gif}
                        width="40px"
                        height="30px"
                      />
                    </Box>
                    <div>
                      <Typography
                        sx={{
                          fontSize: "18px",
                          color: "#fff",
                          fontWeight: 500,
                        }}
                      >
                        Recharge Successful
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
                {/* amount number */}
                <Grid
                  item
                  md={12}
                  xs={12}
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "center",
                    height: "max-content",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: { lg: "80%", md: "80%", sm: "100%", sx: "100%" },
                    }}
                  >
                    <Box sx={{ textAlign: "left" }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#6B7379",
                        }}
                      >
                        Number
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 800,
                        }}
                      >
                        {successRecharge?.number}
                      </div>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#6B7379",
                        }}
                      >
                        Amount
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 800,
                        }}
                      >
                        ₹ {successRecharge?.amount}
                      </div>
                    </Box>
                  </Box>
                </Grid>
                {/* status  and operator*/}
                <Grid
                  item
                  md={12}
                  xs={12}
                  sx={{
                    mt: 1,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: { lg: "80%", md: "80%", sm: "100%", sx: "100%" },
                    }}
                  >
                    <Box sx={{ textAlign: "left" }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#6B7379",
                        }}
                      >
                        Operator
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 800,
                        }}
                      >
                        {successRecharge?.operator}
                      </div>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#6B7379",
                        }}
                      >
                        Status
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 800,
                        }}
                      >
                        {/* {successRecharge.success} */}
                        SUCCESS
                      </div>
                    </Box>
                  </Box>
                </Grid>
                {/* op id and date and time */}
                <Grid
                  item
                  md={12}
                  xs={12}
                  sx={{
                    mt: 1,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: { lg: "80%", md: "80%", sm: "100%", sx: "100%" },
                    }}
                  >
                    <Box sx={{ textAlign: "left" }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#6B7379",
                        }}
                      >
                        Operator ID
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 800,
                        }}
                      >
                        {successRecharge?.operator_id}
                      </div>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#6B7379",
                        }}
                      >
                        Date & Time
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 800,
                        }}
                      >
                        {/* 4:30PM, 23 Feb 2023 */}
                        {moment().format("hh:mm A,  Do MMM YYYY")}
                      </div>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    fontWeight: 400,
                    borderRadius: "8px",
                    // color: "rgb(112, 117, 142)",
                    fontSize: "0.8rem",
                    color: "#000",
                    backgroundColor: "rgba(96, 89, 201, 0.118)",
                    width: { lg: "80%", md: "80%", sm: "100%", sx: "100%" },
                    textAlign: "center",
                    py: 1,
                    mt: 2,
                  }}
                >
                  <InfoIcon sx={{ fontsize: "10px !important" }} /> Recharge
                  processed successfully. It will be reflected soon!
                </Box>
              </Grid>
            </Box>

            <>
              <Divider
                sx={{ color: "#000", border: "1px solid black", mt: 2, mb: 3 }}
              />
              <div
                className="d-flex justify-content-between"
                style={{
                  width: "100%",
                  mt: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <img src={loginPage1} width="120rem" alt="logo" />

                <Button onClick={handleClose}>Close</Button>
              </div>
            </>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};
export default SuccessRechargeModal;
