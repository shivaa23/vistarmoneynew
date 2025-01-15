import * as React from "react";
import Box from "@mui/material/Box";
import {
  FormControl,
  Grid,
  TextField,
  Tooltip,
  IconButton,
  Modal,
} from "@mui/material";
import Loader from "../../commons/Loader";
import { useState } from "react";
import ModalHeader from "../../modals/ModalHeader";
import ModalFooter from "../../modals/ModalFooter";
import { Icon } from "@iconify/react";

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
  height: "max-content",
  overflowY: "scroll",
};

const CreateEditLimitBank = ({ refresh, edit = false, row }) => {
  const [open, setOpen] = React.useState(false);
  const [request, setRequest] = useState(false);

  const [bankData, setBankData] = useState({
    name: row?.name || "",
    accNo: row?.accNo || "",
    ifsc: row?.ifsc || "",
    branch: row?.branch || "",
    balance: row?.balance || "",
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form from submitting and refreshing the page
    console.log("Submitted data:", bankData);

    // Call your API or perform any actions with the data here
    setRequest(true); // Simulate a request
    setTimeout(() => {
      setRequest(false); // Simulate a request completion
      setOpen(false); // Close the modal after submission
    }, 1000);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "start",
      }}
    >
      <Tooltip title="Edit Bank">
        <IconButton onClick={handleOpen}>
          <Icon
            icon="basil:edit-solid"
            style={{ fontSize: "24px" }}
            className="refresh-icon-risk"
          />
        </IconButton>
      </Tooltip>

      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <Loader loading={request} />
            <ModalHeader title={"Edit Bank"} handleClose={handleClose} />
            <Box
              component="form"
              id="Banklimit"
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
                      label="Bank Name"
                      id="acc_name"
                      size="small"
                      name="name"
                      required
                      value={bankData.name}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Account Number"
                      id="acc_no"
                      size="small"
                      name="accNo"
                      required
                      value={bankData.accNo}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Bank IFSC"
                      id="ifsc"
                      size="small"
                      name="ifsc"
                      required
                      value={bankData.ifsc}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Branch Name"
                      id="branch"
                      size="small"
                      name="branch"
                      required
                      type="text"
                      value={bankData.branch}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Bank Balance"
                      id="bank_balance"
                      size="small"
                      name="balance"
                      required
                      type="number"
                      value={bankData.balance}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            <ModalFooter
              form="Banklimit"
              type="submit"
              btn="Submit"
              disable={request}
            />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default CreateEditLimitBank;
