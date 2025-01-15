import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  FormControl,
  Grid,
  TextField,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { useState } from "react";
import Loader from "../component/loading-screen/Loader";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast } from "../utils/ToastUtil";
import { Icon } from "@iconify/react";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  boxShadow: 24,
  fontFamily: "Poppins",
  height: "max-content",
  overflowY: "scroll",
  p: 2,
};
const CMSModal = ({ refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const authCtx = useContext(AuthContext);
  const location = authCtx.location;
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let amt = document.getElementById("amount").value;
    const data = {
      amount: amt,
      latitude: location?.lat,
      longitude: location.long,
      pf: "web",
    };
    postJsonData(
      ApiEndpoints.CREATE_ORDER_CMS,
      data,
      setRequest,
      (res) => {
        const data = res.data.data;

        if (data) {
          const REDIRECT_URL = `https://fpuat.tapits.in/UberCMSBC/#/login?data=${data.encryptInfo}&skey=${data.secretKey}`;

          window.open(REDIRECT_URL, "_blank");
          handleClose();
        }
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };
  return (
    <>
      <div className="hover-less-zoom" onClick={handleOpen}>
        <Button
          variant="outlined"
          sx={{
            py: 0.2,
            fontSize: "12px",
            color: "#fff",
            borderColor: "#fff",
            "&:hover": {
              borderColor: "#fff",
              color: "#fff",
            },
          }}
          startIcon={<Icon icon="bi:cash" />}
        >
          CMS
        </Button>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <Loader loading={request} />
          <ModalHeader title="Receive cash" handleClose={handleClose} />
          <Box
            component="form"
            id="money_transfer"
            validate
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": { m: 2 },
            }}
          >
            <Grid container sx={{ pt: 1 }}>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Amount"
                    id="amount"
                    size="small"
                    type="number"
                    inputProps={{
                      form: {
                        autocomplete: "off",
                      },
                    }}
                    InputProps={{
                      inputProps: {
                        max: 500000,
                        min: 100,
                      },
                    }}
                    required
                    onKeyDown={(e) => {
                      if (e.key === "+" || e.key === "-") {
                        e.preventDefault();
                      }
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <ModalFooter form="money_transfer" request={request} btn="Submit" />
        </Box>
      </Modal>
    </>
  );
};
export default CMSModal;
