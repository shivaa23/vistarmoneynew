/* eslint-disable array-callback-return */
import {
  Box,
  FormControl,
  Grid,
  TextField,
  Typography,
  Card,
  Button,
  Divider,
  Tooltip,
} from "@mui/material";
import React, { useContext, useState, useEffect, useRef } from "react";
import { postJsonData, get } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import EnterMpinModal from "../modals/EnterMpinModal";
import SuccessRechargeModal from "../modals/SuccessRechargeModal";
import Loader from "../component/loading-screen/Loader";
import AuthContext from "../store/AuthContext";
import BillPaymentModal from "../modals/BillPaymentModal";
import OperatorSearch from "./OperatorSearch";
import CardComponent from "./CardComponent";
import CircleComponent from "./CircleComponent";
import { faListSquares } from "@fortawesome/free-solid-svg-icons";
import ReplyIcon from "@mui/icons-material/Reply";
import BbpsCardComponent from "../component/BbpsCardComponent";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import styled from "styled-components";
import { back } from "../iconsImports";
const InnerIcon = styled(Box)(({ theme }) => ({
  // padding: theme.spacing(1),
  width: "60px",
  height: "60px",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 1px 4px",
  // background: theme.palette.common.white,
}));
const ElectricityForm = ({ title, type, resetView, name, image }) => {
  const authCtx = useContext(AuthContext);
  const location = authCtx.location;
  const [fetchRequest, setFetchRequest] = useState(false);
  const [billPayRequest, setBillPayRequest] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [operatorId, setOperatorId] = useState("");
  const [opName, setOpName] = useState("");
  const [successRecharge, setSuccessRechage] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [params, setParams] = useState([]);
  const [changeFetchToPay, setChangeFetchToPay] = useState(false);
  const [billDetails, setBillDetails] = useState();
  const [paramsValue, setparamsValue] = useState({});
  const [data, setData] = useState("");
  const [visibleAmount, setVisibleAmount] = useState(false);
  const [amountValue, setAmountValue] = useState("");
  const [operatorList, setOperatorList] = useState([]);
  const [operatorVal, setOperatorVal] = useState([]);
  const [IsOptSelected, setIsOptSelected] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [operatorIcon, setOperatorIcon] = useState();
  const [amount, setAmmount] = useState();
  const [caNumber, setCaNumber] = useState();
  const operatorRef = useRef();
  // setCaNumber(paramsValue.param1)
  useEffect(() => {
    if (paramsValue && paramsValue.param1) {
      // Set the caNumber to the param1 value from paramsValue
      setCaNumber(paramsValue.param1);
    }
  }, [paramsValue]); // This will only run when paramsValue changes

  const handleSubmit = (event) => {
    event && event.preventDefault();
    const data = {};
    params.forEach((item, index) => {
      if (item || item !== "") {
        data["param" + (index + 1)] = document.getElementById(
          "param" + (index + 1)
        )?.value;
      }
    });
    setData(data);
  };

  const fetchBill = () => {
    const data = {
      latitude: location.lat,
      longitude: location.long,
      operator: operatorId,
    };
    params.forEach((item, index) => {
      if (item && item !== "") {
        data["param" + (index + 1)] = document.getElementById(
          "param" + (index + 1)
        ).value;
      }
    });

    if (!data.param1) {
      apiErrorToast("All Fields are required");
    } else {
      postJsonData(
        ApiEndpoints.RECH_FETCH_BILL,
        data,
        setFetchRequest,
        (res) => {
          setBillDetails(res.data.data);
          setAmmount(res.data.data.dueAmount);
          okSuccessToast(
            res.data.message.param1
              ? res.data.message.param1[0]
              : res.data.message
          );
          if (!res.data.message.param1) {
            if (
              res.data.message.toLowerCase() ===
              "Bill Fetch Service Is Down Please Enter The Amount Manually".toLowerCase()
            ) {
              setVisibleAmount(true);
              setChangeFetchToPay(true);
              handleSubmit();
            }
          }
        },
        (err) => {
          apiErrorToast(err);
        }
      );
    }
  };
  const handleBack = () => {
    resetView(false);

    // setShowSecondPage(0); // Set the state to 1 when the button is clicked
  };

  const handleOperatorChange = (event) => {
    const selectedOperator = operatorVal.find(
      (item) => item.code === event.target.value
    );
    setOpName(selectedOperator ? selectedOperator.name : "");
    setOperatorIcon(selectedOperator ? selectedOperator.img : "");
  };

  const getOperator = () => {
    get(
      ApiEndpoints.GET_OPERATOR,
      `sub_type=${type}`,
      null,
      (res) => {
        setOperatorList(res.data.data);
        setOperatorVal(res.data.data);
        const allParams = res.data.data
          .flatMap((op) => [op.param1, op.param2, op.param3])
          .filter(Boolean);
        setParams(allParams);
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  useEffect(() => {
    getOperator();
  }, []);
  const filteredOperators = operatorVal.filter((operator) =>
    operator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenVal = (operator) => {
    setIsOptSelected(true);
    setOperatorId(operator.code);
    setSelectedCard(operator.code);
    setOperatorIcon(operator.code);
    setOpName(operator.name);
    setParams([operator.param1, operator.param2, operator.param3]);
  };

  return (
    <div className="position-relative" id="whole">
      <Loader loading={fetchRequest} circleBlue />

      {!IsOptSelected && (
        <>
          <div className="position-relative" id="whole">
            {/* Existing loader and other components */}
            <Loader loading={fetchRequest} circleBlue />

            {/* Title and Back Button */}
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 2 }}
            >
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                {/* Image and Title Section */}
                <Grid item xs={12} sm="auto" sx={{ ml: 1 }}>
                  <Box display="flex" alignItems="center">
                    <InnerIcon>
                      <img
                        src={image}
                        alt="Biller"
                        style={{ width: 40, height: 40 }}
                      />
                    </InnerIcon>
                    <Typography variant="h6" align="left" sx={{ ml: 1 }}>
                      {name}
                      {/* Dynamically render biller name */}
                    </Typography>
                  </Box>
                </Grid>

                {/* Search Bar */}
                <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
                  <TextField
                    label="Search"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "#fff",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#757575",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#cccccc",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#999999",
                      },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#3f51b5",
                      },
                    }}
                  />
                </Grid>

                {/* Back Button */}
                {/* <Grid item xs={12} sm="auto">
          <Button
            variant="contained"
            onClick={handleBack}
            sx={{ ml: 2 }}
          >
            <ReplyIcon /> Back
          </Button> */}
                {/* </Grid> */}
                <Grid
                  item
                  xs={12}
                  sm="auto"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mr: 2,
                    mt: 1,
                  }}
                >
                  <Button
                    size="small"
                    id="verify-btn"
                    className="button-props"
                    onClick={handleBack}
                  >
                    <span style={{ marginRight: "5px" }}>Home</span>
                    <img
                      src={back}
                      alt="back"
                      style={{ width: "18px", height: "20px" }}
                    />
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {/* Search Box */}
            {/* <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <TextField
            label="Search Operator"
            variant="outlined"
            fullWidth
            size="small"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
      </Grid> */}

            {/* Display filtered operator list */}
            <Grid
              container
              spacing={2}
              sx={{
                mt: 3,
                maxHeight: "550px", // Adjust the max height as per your needs
                overflowY: "auto", // Makes the data scrollable
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: 2,
              }}
            >
              {filteredOperators.length > 0 ? (
                filteredOperators.map((operator, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <CardComponent
                      title={operator.name}
                      img={operator.code}
                      onClick={() => handleOpenVal(operator)}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography>No data found</Typography>
                </Grid>
              )}
            </Grid>

            {/* Existing functionality (rest of the component) */}
          </div>
        </>
      )}
      {IsOptSelected && (
        <Grid container spacing={2}>
          {/* Left Section for Operator List */}
          <Grid
            item
            lg={4}
            xs={12}
            sm={4}
            sx={{
              mt: 2,
              height: "600px",
              width: "600px",
              overflowY: "auto", // Ensure scrollability
              p: 2,
            }}
          >
            {/* Search Box for Electricity Operators */}
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                },
                "& .MuiInputLabel-root": {
                  color: "#757575",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#cccccc",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#999999",
                },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3f51b5",
                },
              }}
            />

            <Divider sx={{ my: 2, backgroundColor: "grey.500", height: 1.5 }} />

            {/* Card Count */}
            <Typography
              variant="caption" // Smaller variant for text size
              sx={{
                mt: -2,
                justifyContent: "end",
                display: "flex", // Flex for alignment
                alignItems: "flex-start",
              }}
              align="right"
            >
              {filteredOperators.length}{" "}
              {filteredOperators.length === 1 ? "electricity " : `${type}`}{" "}
              found
            </Typography>

            {/* Scrollable Card List */}
            <Box sx={{ overflowY: "auto", maxHeight: "480px" }}>
              {operatorVal &&
                operatorVal
                  .filter((operator) =>
                    operator.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  ) // Filter operators based on the search term
                  .map((operator, index) => (
                    <CardComponent
                      key={index}
                      title={operator.name}
                      img={operator.code}
                      height="55px"
                      onClick={() => {
                        handleOpenVal(operator);
                      }}
                      isSelected={opName === operator.name}
                    />
                  ))}
            </Box>
          </Grid>

          {/* Right Form Section */}
          <Grid item lg={8} xs={12} sm={8} sx={{ mr: -6 }}>
            <Box
              sx={{
                height: "100%",
                p: 3,
              }}
            >
              <Grid
                item
                xs={12}
                sm="auto"
                display="flex"
                justifyContent="flex-start"
                sx={{ mb: 3 }}
              >
                <Button
                  variant="contained"
                  onClick={handleBack}
                  sx={{ ml: 2 }} // Margin left for spacing
                >
                  <ReplyIcon /> Home
                </Button>
              </Grid>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  flexWrap: "wrap",
                  marginBottom: "16px",
                }}
              >
                <CircleComponent img={operatorIcon} />
                <Tooltip title={opName} arrow>
                  <Typography
                    sx={{
                      fontSize: { xs: "18px", sm: "20px", md: "24px" },
                      fontWeight: "bold",
                      ml: "15px",
                      wordWrap: "break-word",
                    }}
                  >
                    {opName.split(" ").length > 3
                      ? `${opName.split(" ").slice(0, 3).join(" ")}...`
                      : opName}
                  </Typography>
                </Tooltip>
              </div>

              <Box
                component="form"
                id="electricity"
                validate="true"
                autoComplete="off"
                onSubmit={handleSubmit}
                sx={{
                  "& .MuiTextField-root": { m: 1, width: "100%" },
                  overflowY: "auto",
                  maxHeight: "400px",
                }}
              >
                <Grid container spacing={0.5}>
                  {params.map((item, i) => (
                    <Grid item xs={12} key={i}>
                      {item && item !== "" && (
                        <FormControl
                          sx={{
                            width: {
                              xs: "100%",
                              sm: "80%",
                              md: "80%",
                              lg: "80%",
                              xl: "80%",
                            },
                            mr: "19%",
                          }}
                        >
                          <TextField
                            label={item}
                            id={"param" + (i + 1).toString()}
                            size="small"
                            sx={{
                              width: "400px",
                              "& .MuiInputBase-input": {
                                fontSize: "12px",
                                color: "black",
                              },
                              "& .MuiInputBase-input::placeholder": {
                                fontSize: "12px",
                                opacity: 1,
                              },
                            }}
                            onChange={(e) => {
                              setparamsValue({
                                ...paramsValue,
                                [e.currentTarget.id]: e.currentTarget?.value,
                              });
                            }}
                            required
                          />
                        </FormControl>
                      )}
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <FormControl
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "80%",
                          md: "80%",
                          lg: "80%",
                          xl: "80%",
                        },
                        mr: "19%",
                      }}
                    >
                      <TextField
                        label="Amount"
                        id="amount"
                        size="small"
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: "12px",
                            color: "black",
                          },
                          "& .MuiInputBase-input::placeholder": {
                            fontSize: "12px",
                            opacity: 1,
                          },
                        }}
                        value={amountValue}
                        onChange={(e) => {
                          setAmountValue(e.target.value);
                        }}
                        required
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              {/* Payment Modal */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <BillPaymentModal
                  changeFetchToPay={changeFetchToPay}
                  amountValue={amountValue}
                  fetchBill={fetchBill}
                  caNumber={caNumber}
                  billDetails={billDetails}
                  setBillDetails={setBillDetails}
                  payRequest={billPayRequest}
                  setBillPayRequest={setBillPayRequest}
                  modalVisible={modalVisible}
                  setModalVisible={setModalVisible}
                  operatorId={operatorId}
                  operatorName={opName}
                  amount={amount}
                  successRecharge={successRecharge}
                  setSuccessRechage={setSuccessRechage}
                  showSuccess={showSuccess}
                  setShowSuccess={setShowSuccess}
                  data={data}
                />
              </div>
            </Box>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default ElectricityForm;
