import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import ApiEndpoints from "../network/ApiEndPoints";
import { useState } from "react";
import EnterMpinModal from "../modals/EnterMpinModal";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";
import { cardNumberFormat } from "../utils/FormattingUtils";
import { PATTERNS } from "../utils/ValidationUtil";
import { rupayimg, visaimg, masterimg, back } from "../iconsImports";

const CreditcardForm = ({resetView}) => {
  const authCtx = useContext(AuthContext);
  const userLat = authCtx.location && authCtx.location.lat;
  const userLong = authCtx.location && authCtx.location.long;
  // const [request, setRequest] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // const [successRecharge, setSuccessRechage] = useState([]);
  // const [showSuccess, setShowSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [showCardNumber, setShowCardNumber] = useState("");
  const [data, setData] = useState("");
  const [isMobv, setIsMobv] = useState(true);
  const [cardType, setCardType] = useState("");
  const [apiCallStatus, setApiCallStatus] = useState(false);
  const handleBack = () => {
    resetView(false);
  };
  // const CreditCardSchema = Yup.object().shape({
  //   amount: Yup.number().required().typeError("Incorrect format"),
  //   interest_rate: Yup.number().required().typeError("Incorrect format"),
  //   tenure: Yup.number().required().typeError("Incorrect format"),
  // });

  // const methods = useForm({
  //   resolver: yupResolver(CreditCardSchema),
  //   defaultValues: {
  //     firstName: "",
  //     lastName: "",
  //   },
  // });

  useEffect(() => {
    if (apiCallStatus) {
      document.getElementById("mobile").value = "";
      document.getElementById("name").value = "";
      document.getElementById("card_number").value = "";
      document.getElementById("amount").value = "";
      setCardType("");
    }
  }, [apiCallStatus]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      cnumber: cardNumber && cardNumber.split("-").join(""),
      number: form.mobile.value,
      name: form.name.value,
      amount: form.amount.value,
      latitude: userLat,
      longitude: userLong,
      pf: "WEB",
    };
    setData(data);
    setModalVisible(true);
  };

  return (
  
    <div>
         <Grid
                    item
                    md={12}
                    xs={12}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Button
                      size="small"
                      id="verify-btn"
                      className="button-props"
                      onClick={handleBack}
                    >
                      <span style={{ marginRight: "5px" }}>Back</span>
                      <img
                        src={back}
                        alt="UPI logo"
                        style={{ width: "18px", height: "20px" }}
                      />
                    </Button>
                    </Grid>
      <Box sx={{ p: 3 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: "24px", fontWeight: "bold",ml:3 }}>
            Credit Card Bill Payment
          </Typography>
        </div>
        <Box
          component="form"
          id="creditCard"
          validate
          autoComplete="off"
          onSubmit={handleSubmit}
          sx={{
            "& .MuiTextField-root": { m: 2 },
            objectFit: "contain",
            overflowY: "scroll",
          }}
        >
         
          <Grid container sx={{ pt: 1 }} disabled>
            <Grid item md={12} xs={12}>
              <FormControl sx={{ width: "100%" }}>
                <TextField autoComplete="off"
                  label="Registered Mobile Number"
                  id="mobile"
                  type="tel"
                  size="small"
                  error={!isMobv}
                  inputProps={{ maxLength: 10 }}
                  helperText={!isMobv ? "Enter valid Mobile" : ""}
                  onChange={(e) => {
                    setIsMobv(PATTERNS.MOBILE.test(e.target.value));
                    if (e.target.value === "") setIsMobv(true);
                  }}
                 
                  required
                />
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl sx={{ width: "100%" }}>
                <TextField autoComplete="off"
                  label="Name"
                  id="name"
                  size="small"
                  onChange={(e) => {}}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl sx={{ width: "100%" }}>
                <TextField autoComplete="off"
                  label="Card Number"
                  id="card_number"
                  size="small"
                  inputProps={{
                    maxLength: 19,
                  }}
                  value={showCardNumber && showCardNumber}
                  autoFocus={cardNumber && cardNumber}
                  focused={cardNumber && cardNumber}
                  onChange={(e) => {
                    setShowCardNumber(cardNumberFormat(e.target.value));
                    setCardNumber(e.target.value);
                    if (e.target.value.startsWith("5")) {
                      setCardType("master");
                    } else if (e.target.value.startsWith("4")) {
                      setCardType("visa");
                    } else if (e.target.value.startsWith("6")) {
                      setCardType("rupay");
                    } else if (e.target.value === "") {
                      setCardType("");
                    } else {
                      setCardType("");
                    }
                  }}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {cardType && (
                          <img
                            src={`${
                              cardType === "master"
                                ? masterimg
                                : cardType === "visa"
                                ? visaimg
                                : cardType === "rupay"
                                ? rupayimg
                                : ""
                            }`}
                            alt="card img"
                            width="30"
                          />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item md={12} xs={12}>
              <FormControl sx={{ width: "100%" }}>
                <TextField autoComplete="off"
                  label="Amount"
                  id="amount"
                  type="number"
                  size="small"
                  onChange={(e) => {
                    document.getElementById("card_number").blur();
                  }}
                  required
                  InputProps={{
                    inputProps: {
                      min: 1,
                    },
                  }}
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
        <Button
          type="submit"
          form="creditCard"
          className="btn-background"
          sx={{
            width: "95%",
            mt: 1,
          }}
          disabled={!isMobv}
          // endIcon={<ArrowForwardIosIcon />}
          // disabled={request && request ? true : false}
        >
          {/* {params.length > 0 ? "Proceed to pay" : "Fetch Info"} */}
          Proceed
        </Button>

        {modalVisible && modalVisible && (
          <EnterMpinModal
            data={data}
            setData={setData}
            setModalVisible={setModalVisible}
            // setSuccessRechage={setSuccessRechage}
            apiEnd={ApiEndpoints.BILLPAY_CC}
            // setShowSuccess={setShowSuccess}
            sendBkApiStatus={(val) => {
              setApiCallStatus(val);
            }}
          />
        )}
      </Box>
    </div>
  );
};

export default CreditcardForm;
