import {
  Backdrop,
  Box,
  Fade,
  FormControl,
  Grid,
  Modal,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { PATTERNS } from "../utils/ValidationUtil";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 3,
};
const ContactusModal = () => {
  const [open, setOpen] = useState(false);
  const [isMobv, setIsMobv] = useState(true);
  const [isEmailv, setIsEmailv] = useState(true);

  const handleOpen = () => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 7000);
    return () => clearTimeout(timer);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    handleOpen();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    let data;

    data = {
      first_name: form.c_fname.value,
      last_name: form.c_lname.value,
      mobile: form.c_mobile.value,
      email: form.c_email.value,
      message: form.c_message.value,
    };
  };
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style} className="sm_modal ">
            <ModalHeader title="Contact Us" handleClose={handleClose} />
            <Box
              component="form"
              id="contact"
              onSubmit={handleSubmit}
              sx={{
                width: "100%",
                "& .MuiTextField-root": { m: 1 },
                display: "flex",
                justifyContent: "end",
                mt: 2,
              }}
            >
              <Grid container spacing={2} md={12} xs={12}>
                <Grid lg={6} md={6} sm={12} xs={12} textfield size="small">
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      size="small"
                      id="c_fname"
                      label="Full Name"
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
                <Grid lg={6} md={6} sm={12} xs={12} textfield size="small">
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      size="small"
                      id="c_mobile"
                      label="Mobile Number"
                      variant="outlined"
                      error={!isMobv}
                      helperText={!isMobv ? "Enter a valid mobile" : ""}
                      onChange={(e) => {
                        setIsMobv(PATTERNS.MOBILE.test(e.target.value));
                        if (e.target.value === "") setIsMobv(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "+" || e.key === "-") {
                          e.preventDefault();
                        }
                        if (e.target.value.length === 10) {
                          if (e.key.toLowerCase() !== "backspace")
                            e.preventDefault();
                          if (e.key.toLowerCase() === "backspace") {
                          }
                        }
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid lg={6} md={6} sm={12} xs={12} textfield size="small">
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      size="small"
                      id="c_email"
                      label="Email Id"
                      variant="outlined"
                      error={!isEmailv}
                      helperText={!isEmailv ? "Enter a valid email" : ""}
                      onChange={(e) => {
                        setIsEmailv(PATTERNS.EMAIL.test(e.target.value));
                        if (e.target.value === "") setIsEmailv(true);
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid lg={6} md={6} sm={12} xs={12} textfield size="small">
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      size="small"
                      id="c_city"
                      label="City"
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
                <Grid lg={12} md={12} sm={12} xs={12} textfield size="small">
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      size="small"
                      id="c_company"
                      label="Company/Organization"
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
                <Grid lg={12} md={12} sm={12} xs={12} textfield size="small">
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      size="small"
                      multiline
                      id="c_message"
                      aria-label="minimum height"
                      rows={3}
                      label="Your Message"
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            <ModalFooter
              btn="Submit"
              form="consult_form"
              disable={!isEmailv || !isMobv}
            />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ContactusModal;
