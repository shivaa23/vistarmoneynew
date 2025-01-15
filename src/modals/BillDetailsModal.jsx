import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  Grid,
  Button,
  TextField,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import DownloadIcon from "@mui/icons-material/Download";
import Loader from "../component/loading-screen/Loader";
import { apiErrorToast } from "../utils/ToastUtil";
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

const BillDetailsModal = ({
  billerId,
  params,
  currentBiller,
  billDetails,
  setBillDetails,
  fetchBill,
  request,
  categoryName,
  payBill,
  mpinVal,
  payRequest,
  setMpinVal,
  openMpin,
  setOpenMpin,
  // isEdit,
  // setIsEdit,
  billValue,
  setBillValue,
  pan,
  setPan,
  err,
}) => {
  // console.log("billValue", billValue, typeof billValue);
  // const handleClickShowPassword = () => {
  //   if (isEdit === true) {
  //     setBillValue(Number(billDetails.BillAmount).toFixed(2));
  //   }
  //   setIsEdit((show) => !show);
  // };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleOpen = () => {
    if (fetchBill) fetchBill();
  };
  const handleClose = () => {
    setBillDetails(false);
    setMpinVal(false);
    setPan("");
  };

  React.useEffect(() => {
    if (billDetails.BillAmount) {
      setBillValue(Number(billDetails.BillAmount).toFixed(2));
    }
  }, [billDetails]);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Button
  className="button-purple"
  size="small"
  // type="bbpsForm"
  startIcon={<DownloadIcon />}
  sx={{
    fontSize: "12px",
   
    width: {
      lg: '100%', // Large screens: 87% width
      md: '100%', // Medium and smaller screens: Full width
      sm: '100%',
      xs: '100%',
    },
  }}
  onClick={handleOpen}
>
  Fetch Details
</Button>


      <Modal
        open={billDetails}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <Loader loading={payRequest} />
          <ModalHeader title="Bill Details" handleClose={handleClose} />
          <Box
            component="form"
            id="billPayment"
            validate
            autoComplete="off"
            // onSubmit={payBill}
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
          >
            {billDetails && (
              <Grid container sx={{ pt: 1 }}>
                <Grid
                  item
                  md={12}
                  xs={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <table className="mt-table">
                    {billDetails && billDetails.CustomerName && (
                      <tr>
                        <td>Name</td>
                        <td>:</td>
                        <td style={{ textAlign: "right" }}>
                          {billDetails.CustomerName}
                        </td>
                      </tr>
                    )}
                    {billValue * 1 > 50000 && (
                      <tr>
                        <td>Pan</td>
                        <td>:</td>
                        <td style={{ textAlign: "right" }}>
                          <TextField autoComplete="off"
                            id="pan"
                            name="Pan"
                            size="small"
                            required
                            variant="standard"
                            value={pan}
                            onChange={(e) => setPan(e.target.value)}
                            InputProps={{
                              inputProps: {
                                style: { textAlign: "right" },
                              },
                            }}
                            sx={{
                              width: "90%",
                            }}
                          />
                        </td>
                      </tr>
                    )}
                    {billDetails && billDetails.BillAmount && (
                      // (isEdit ? (
                      <tr>
                        <td>Due Amount </td>
                        <td>:</td>
                        <td
                          style={{
                            textAlign: "right",
                            padding: "0.1rem 0.5rem",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-end",
                              justifyContent: "right",
                            }}
                          >
                            {/* <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {isEdit ? (
                                <ClearIcon
                                  size="small"
                                  sx={{
                                    fontSize: "18px",
                                    mr: 1,
                                    // marginTop: "-15px",
                                  }}
                                />
                              ) : (
                                <ModeEditIcon
                                  sx={{
                                    fontSize: "18px",
                                    mr: 1,
                                    // marginTop: "-15px",
                                  }}
                                />
                              )}
                            </IconButton> */}

                            <TextField autoComplete="off"
                              id="amount"
                              name="amount"
                              size="small"
                              // label="Amount"
                              required
                              variant="standard"
                              // disabled={!isEdit}
                              value={billValue}
                              onChange={(e) => setBillValue(e.target.value)}
                              // defaultValue={Number(
                              //   billDetails.BillAmount
                              // ).toFixed(2)}
                              InputProps={{
                                inputProps: {
                                  style: { textAlign: "right" },
                                },
                              }}
                              sx={{
                                width: "60%",
                              }}
                            />
                          </Box>
                        </td>
                      </tr>
                    )}
                    {billDetails && billDetails.BillNumber && (
                      <tr>
                        <td>Bill Number </td>
                        <td>:</td>
                        <td style={{ textAlign: "right" }}>
                          {billDetails.BillNumber}
                        </td>
                      </tr>
                    )}
                    {billDetails && billDetails.BillDate && (
                      <tr>
                        <td>Bill Date </td>
                        <td>:</td>
                        <td style={{ textAlign: "right" }}>
                          {billDetails.BillDate}
                        </td>
                      </tr>
                    )}
                    {billDetails && billDetails.BillDueDate && (
                      <tr>
                        <td>Due Date </td>
                        <td>:</td>
                        <td style={{ textAlign: "right" }}>
                          {billDetails.BillDueDate}
                        </td>
                      </tr>
                    )}
                    {billDetails && billDetails.BillPeriod && (
                      <tr>
                        <td>Due Period </td>
                        <td>:</td>
                        <td style={{ textAlign: "right" }}>
                          {billDetails.BillPeriod}
                        </td>
                      </tr>
                    )}
                  </table>
                </Grid>
                {err && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                      fontSize: "12px",
                      px: 2,
                      color: "#DC5F5F",
                    }}
                  >
                    {err.message && err.message && (
                      <div>{err && err.message}</div>
                    )}
                  </Box>
                )}
              </Grid>
            )}
          </Box>
          <ModalFooter
            form="billPayment"
            type={mpinVal ? "button" : "button"}
            request={request}
            btn={mpinVal ? "Pay Now" : "Continue"}
            onClick={(e) => {
              if (billValue * 1 > 50000 && pan === "") {
                apiErrorToast("Enter pan details");
              } else {
                if (!mpinVal) setOpenMpin(true);
                if (mpinVal) payBill(e);
              }

              // payBill(e);
            }}
            disable={payRequest}
          />
          {/* <ModalFooter form="billPayment" request={payRequest} btn="Pay Now" /> */}
        </Box>
      </Modal>
    </Box>
  );
};
export default BillDetailsModal;
