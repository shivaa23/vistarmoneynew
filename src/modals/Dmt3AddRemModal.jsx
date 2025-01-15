import React, { useState, useContext } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FormControl, Grid, TextField } from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { postJsonData } from "../network/ApiController";
import AuthContext from "../store/AuthContext";

import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast } from "../utils/ToastUtil";
import RemitterKyc from "../View/aeps/RemitterKyc";

const Dmt3AddRemModal = ({ rem_mobile, setAddNewRem, dmtValue }) => {
  const [mobile, setMobile] = useState(rem_mobile);
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [request, setRequest] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [remRefKey, setRemRefKey] = useState(null);
  const [openRemKyc, setOpenRemKyc] = useState(false);
  const authCtx = useContext(AuthContext);
  const location = authCtx.location || { lat: 0, long: 0 }; // Provide default if location is not available

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 2,
  };

  const handleClose = () => {
    setAddNewRem(false); // Close the modal from the parent
  };

  const handleSubmit = (event) => {
    console.log("api call add redm");

    event.preventDefault();
    const data = {
      aadhaar_number: aadhaarNumber,
      number: mobile,
      latitude: location.lat,
      longitude: location.long,
    };

    postJsonData(
      ApiEndpoints.DMT3_ADD_REM,
      data,
      setRequest,
      (res) => {
        console.log("res", res?.data?.message);

        console.log("responseMessage out");

        if (
          res?.data?.message ==
          "Aadhar validated successfully and OTP has been sent to register remitter for registration."
        ) {
          console.log("responseMessage");

          setRemRefKey(res.data.data);
          setOpenRemKyc(true); // Open RemitterKyc modal
        } else {
          apiErrorToast(res?.data?.status, res?.data?.message);
        }
      },
      (error) => {
        console.error("Error:", error);
      }
    );
  };
  console.log("openRemKyc", openRemKyc);

  return (
    <Box>
      <Modal open={true} onClose={handleClose}>
        <Box sx={style}>
          <ModalHeader title="Add Remitter" handleClose={handleClose} />
          <Box
            id="add_rem"
            component="form"
            onSubmit={handleSubmit}
            sx={{ "& .MuiTextField-root": { m: 1 } }}
          >
            <Grid container>
              <Grid item xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Mobile"
                    id="mobile"
                    size="small"
                    required
                    disabled
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Aadhaar Number"
                    id="aadhaar_number"
                    size="small"
                    required
                    disabled={showOtp}
                    value={aadhaarNumber} // Bind to state
                    onChange={(e) => setAadhaarNumber(e.target.value)} // Set state value
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <ModalFooter form="add_rem" request={request} btn="Proceed" />
        </Box>
      </Modal>

      {openRemKyc && (
        <RemitterKyc
          open={openRemKyc}
          onClose={() => setOpenRemKyc(false)}
          remRefKey={remRefKey}
          rem_mobile={rem_mobile}
          aadhaarNumber={aadhaarNumber}
          dmtValue={dmtValue}
        />
      )}
    </Box>
  );
};

export default Dmt3AddRemModal;
