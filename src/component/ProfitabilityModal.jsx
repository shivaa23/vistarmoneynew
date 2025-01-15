/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Modal,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";
import { useState,useEffect } from "react";
import ModalHeader from "../modals/ModalHeader";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast } from "../utils/ToastUtil";
import Loader from "../component/loading-screen/Loader";
import { currencySetter } from "../utils/Currencyutil";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "45%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 3,
};

const ProfitabilityModal = ({ row, btn, name, width, apiKey }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [profit, setProfit] = useState("");
  const [duration, setDuration] = useState("TODAY");
  const handleOpen = () => {
    setOpen(true);
    getUserProfit();
  };
  const handleClose = () => {
    setOpen(false);
  };

  const getUserProfit = () => {
    postJsonData(
      ApiEndpoints.USER_PROFIT,
      {
        [apiKey]: row.asm_id,
        type: duration,
      },
      setRequest,
      (res) => {
        setProfit(res?.data?.data);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  useEffect(() => {
    if (open) getUserProfit();
  }, [duration]);

  return (
    <Box sx={{ display: "flex", justifyContent: "end" }}>
      <Button
        variant="text"
        size="small"
        sx={{
          fontSize: "12px",
          fontWeight: "normal",
          "&:hover": {
            cursor: "pointer",
          },
          minWidth: width,
        }}
        onClick={handleOpen}
      >
        {btn}
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader
            title={`${name}'s Profitability Report`}
            handleClose={handleClose}
          />
          <Loader loading={request} />
          <Grid container spacing={2} sx={{ pl: 3 }}>
            <Grid item md={12} sx={{ mt: 2 }}>
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Choose Duration
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <FormControlLabel
                    value="TODAY"
                    control={<Radio />}
                    label="Today"
                  />
                  <FormControlLabel
                    value="THIS"
                    control={<Radio />}
                    label="This"
                  />
                  <FormControlLabel
                    value="LAST"
                    control={<Radio />}
                    label="Last"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12} sx={{ mt: 1, pl: 1 }}>
              <span
                style={{
                  fontSize: "16px",
                  marginRight: "8px",
                }}
              >
                {" "}
                Profit Amount:
              </span>{" "}
              {"   "}
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginRight: "8px",
                }}
              >
                {currencySetter(profit)}
              </span>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProfitabilityModal;
