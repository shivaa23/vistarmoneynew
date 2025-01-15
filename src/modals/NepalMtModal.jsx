import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { useState } from "react";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ModalHeader from "./ModalHeader";
import PinInput from "react-pin-input";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast } from "../utils/ToastUtil";
import ModalFooter from "./ModalFooter";
import { currencySetter } from "../utils/Currencyutil";
import Loader from "../component/loading-screen/Loader";
import NepalPaymentSuccessModal from "./NepalPaymentSuccessModal";
import { capitalize1 } from "../utils/TextUtil";
import { fetchUserAgain } from "../utils/fetchUserUtil";
import AuthContext from "../store/AuthContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  boxShadow: 24,
  fontFamily: "Poppins",
  height: "max-content",
  overflowY: "scroll",
  p: 2,
};

const NepalMtModal = ({ receiver, nepalAllRes, customerMobile }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [remittanceReq, setRemittanceReq] = useState(false);
  const [otp, setOtp] = useState();
  const [gottenOTP, setGottenOTP] = useState(false);
  const [OTPProcessId, setOTPProcessId] = useState(undefined);
  const [amount, setAmount] = useState("");
  const [serviceChargeData, setServiceChargeData] = useState(false);
  const [remittanceReason, setRemittanceReason] = useState([]);
  const [remReasonVal, setRemReasonVal] = useState("");
  const [successModal, setSuccessModal] = useState("");
  const [nepalMtSuccessData, setNepalMtSuccessData] = useState();
  const authCtx = useContext(AuthContext);
  // console.log("remmitanceReason", remittanceReason);
  // console.log("remReasonVal", remReasonVal);
  // console.log("serviceChargeData", serviceChargeData);
  // console.log("receiver", receiver);

  const { PaymentMode } = receiver;
  const { customer } = nepalAllRes;

  // console.log("customer", customer);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setServiceChargeData(false);
    setRemReasonVal("");
    setRemittanceReason([]);
    setGottenOTP(false);
  };

  const getStaticData = (Type) => {
    postJsonData(
      ApiEndpoints.NEPAL_STATIC_DATA,
      { Type },
      setRemittanceReq,
      (res) => {
        // console.log("res", res.data.data);
        const data = res?.data?.data;

        setRemittanceReason(data);
      }
    );
  };

  const handleSubmit = (e) => {
    let data = {};
    const form = e.currentTarget;
    data = {
      CustomerId: customer?.CustomerId,
      ReceiverId: receiver?.ReceiverId,
      SenderName: customer?.Name,
      SenderGender: customer?.Gender,
      SenderDoB: customer.Dob,
      SenderAddress: customer.Address,
      SenderMobile: customerMobile,
      SenderCity: customer.City,
      SenderDistrict: customer.District,
      SenderState: customer.State,
      // SenderNationality: customer.Nationality,
      Employer: customer.Employer,
      SenderIDType: customer.Ids.Id?.IdType,
      SenderIDNumber: customer?.Ids?.Id?.IdNumber,
      ReceiverID: receiver.ReceiverId,
      ReceiverName: receiver.Name,
      ReceiverGender: receiver.Gender,
      ReceiverAddress: receiver.Address,
      ReceiverMobile: receiver.Mobile,
      // receiverCity : as per sender
      PaymentMode: receiver.PaymentMode,
      CollectedAmount: serviceChargeData?.CollectionAmount,
      ServiceCharge: serviceChargeData?.ServiceCharge,
      SendAmount: form.amt.value,
      ReceiverCity: form.receiver_city.value,
      PayAmount: serviceChargeData?.PayoutAmount,
      AccountNumber:
        PaymentMode === "Account Deposit" ? receiver?.AcNumber : undefined,
      BankBranchId:
        PaymentMode === "Account Deposit" ? receiver?.BankBranchId : undefined,
      IncomeSource: customer.IncomeSource,
      RemittanceReason: remReasonVal,
      Relationship: receiver.Relationship,

      // CustomerId:customer.CustomerId,

      // PartnerPinNo
      // CSPCode
      OTPProcessId: OTPProcessId.ProcessId,
      OTP: otp,
    };
    e.preventDefault();
    postJsonData(
      ApiEndpoints.NEPAL_SEND_TRANSACTION,
      data,
      setRequest,
      (res) => {
        const data = res.data.data;
        setNepalMtSuccessData(data);
        setSuccessModal("nepal");
        setTimeout(() => {
          handleClose();
        }, 300);
      },
      (err) => {
        apiErrorToast(err);
        // setSuccessModal("nepal");
        // setTimeout(() => {
        //   handleClose();
        // }, 300);
      }
    );
    fetchUserAgain(setRequest, authCtx);
  };

  const getOtp = (e) => {
    e.preventDefault();
    // const form = e.currentTarget;

    let data = {
      Operation: "SendTransaction",
      Mobile: customerMobile,
      CustomerId: customer?.CustomerId,
      ReceiverId: receiver?.ReceiverId,
      PaymentMode,
      SendAmount: amount,
    };
    // setResendOtpData(data);
    postJsonData(
      ApiEndpoints.NEPAL_OTP,
      data,
      setRequest,
      (res) => {
        // console.log("res", res.data);
        if (!gottenOTP) {
          // okSuccessToast(res?.data?.message);
          setOTPProcessId(res?.data);
        } else {
        }

        setGottenOTP(true);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const getServiceChargeByCollection = (e) => {
    e.preventDefault();
    postJsonData(
      ApiEndpoints.GET_SERVICE_CHARGE,
      {
        PaymentMode,
        PayoutAmount: amount * 1.6,
        BankBranchId:
          PaymentMode === "Account Deposit"
            ? receiver?.BankBranchId
            : undefined,
      },
      setRequest,
      (res) => {
        const data = res?.data;
        setServiceChargeData(data?.data);
        // console.log("data in service charge", data);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const ServiceChargeDetails = ({ chargeData }) => {
    const { PayoutAmount, ServiceCharge, TransferAmount, CollectionAmount } =
      chargeData;
    return (
      <Grid
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <table className="mt-table">
          <tr>
            <td>Payout Amount</td>
            <td>:</td>
            <td style={{ textAlign: "right" }}>
              {currencySetter(PayoutAmount)}
            </td>
          </tr>
          <tr>
            <td>Collection Amount</td> <td>:</td>
            <td style={{ textAlign: "right" }}>
              {currencySetter(CollectionAmount)}
            </td>
          </tr>
          <tr>
            <td>Transfer Amount </td>
            <td>:</td>
            <td style={{ textAlign: "right" }}>
              {currencySetter(TransferAmount)}
            </td>
          </tr>
          <tr>
            <td>Service Charge </td>
            <td>:</td>
            <td style={{ textAlign: "right" }}>
              {currencySetter(ServiceCharge)}
            </td>
          </tr>
        </table>
      </Grid>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Button
        className="button-grayback"
        sx={{
          textTransform: "capitalize",
          fontSize: "12px",
          minWidth: "110px",
        }}
        startIcon={
          PaymentMode === "Cash Payment" ? (
            <PaymentsIcon />
          ) : (
            <AccountBalanceIcon />
          )
        }
        onClick={handleOpen}
      >
        {PaymentMode === "Cash Payment" ? "Cash" : "Account"}
      </Button>
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <Loader loading={request} />
          <ModalHeader
            title={`Send Money (${capitalize1(receiver?.Name)})`}
            handleClose={handleClose}
            subtitle="Seamless Indo-Nepal Transfers: Send Cash Across Borders with DilliPay!"
          />
          <Box
            component="form"
            id={
              serviceChargeData
                ? gottenOTP
                  ? "sendTransaction"
                  : "get-otp"
                : "service-charge"
            }
            validate
            autoComplete="off"
            onSubmit={
              serviceChargeData
                ? gottenOTP
                  ? handleSubmit
                  : getOtp
                : getServiceChargeByCollection
            }
            sx={{
              "& .MuiTextField-root": { m: 1 },
              mt: 2,
            }}
          >
            <Grid container>
              <Grid item md={6} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Amount"
                    id="amt"
                    size="small"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={gottenOTP}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Payout Amount"
                    id="collection_amt"
                    size="small"
                    required
                    value={currencySetter(amount * 1.6)}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Receiver's City"
                    id="receiver_city"
                    size="small"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} className="position-relative">
                <Loader loading={remittanceReq} size="small" />
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Remittance Reason"
                    id="rem_reason"
                    size="small"
                    required
                    select
                    value={remReasonVal}
                    onChange={(e) => setRemReasonVal(e.target.value)}
                    onFocus={() =>
                      remittanceReason.length < 1 &&
                      getStaticData("RemittanceReason")
                    }
                  >
                    {remittanceReason.length > 0 &&
                      remittanceReason.map((item) => {
                        return (
                          <MenuItem value={item.Value}>{item.Label}</MenuItem>
                        );
                      })}
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12} hidden={!serviceChargeData}>
                <ServiceChargeDetails chargeData={serviceChargeData} />
              </Grid>
              <Grid
                md={12}
                xs={12}
                sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                hidden={!gottenOTP}
              >
                <FormControl>
                  <Typography
                    sx={{ display: "flex", justifyContent: "center", mb: 1 }}
                  >
                    Enter OTP
                  </Typography>
                  <PinInput
                    length={6}
                    focus
                    type="password"
                    onChange={(value, index) => {
                      setOtp(value);
                    }}
                    regexCriteria={/^[0-9]*$/}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <ModalFooter
            form={
              serviceChargeData
                ? gottenOTP
                  ? "sendTransaction"
                  : "get-otp"
                : "service-charge"
            }
            type="submit"
            request={request || remittanceReq}
            btn={
              serviceChargeData
                ? gottenOTP
                  ? "Proceed"
                  : "Get OTP"
                : "Service Charge"
            }
          />
        </Box>
      </Modal>
      {/* nepal payment success modal */}
      <NepalPaymentSuccessModal
        openHook={successModal}
        receiver={receiver}
        nepalAllRes={nepalAllRes}
        openHookFunc={setSuccessModal}
        nepalMtSuccessData={nepalMtSuccessData}
        amount={amount}
      />
    </Box>
  );
};

export default NepalMtModal;
