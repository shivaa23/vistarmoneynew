import React, { useEffect, useMemo, useState } from "react";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import {
  Alert,
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  blackColor,
  primaryColor,
  primaryLight,
  secondaryColor,
  whiteColor,
} from "../../../theme/setThemeColor";
import { AirIndia } from "../../../iconsImports";
import Mount from "../../Mount";
import useResponsive from "../../../hooks/useResponsive";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import BoyIcon from "@mui/icons-material/Boy";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { BOOKINGSTEP } from "../../../utils/constants";
import { Icon } from "@iconify/react";
import {
  setAdultArray,
  setChildrenArray,
  setFlightBookingDetails,
  setInfantArray,
} from "../../../features/flight/flightSlice";
import RHFTextField from "../../RHFTextField";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import { PATTERNS } from "../../../utils/ValidationUtil";
import { postJsonData } from "../../../network/ApiController";
import ApiEndpoints from "../../../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../../../utils/ToastUtil";
import { LoadingButton } from "@mui/lab";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : `${primaryLight()}50`,
  flexDirection: "row",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    // marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

// ##########################
// MAIN COMPONENT ###########
// ##########################
const TravellerDetail = ({ activeStep, setActiveStep }) => {
  const dispatch = useDispatch();
  const [request, setRequest] = useState(false);
  const isMobile = useResponsive("down", "lg");
  const {
    journey,
    origin,
    destination,
    departureDate,
    adultCount,
    infantCount,
    childrenCount,
    flightBookingDetails,
    adultArray,
    childrenArray,
    infantArray,
    segments,
  } = useSelector((state) => state?.flight);

  const journeyDetails = useMemo(() => {
    if (journey && journey.length === 0) {
      return {
        stops: null,
        legs: null,
        flightName: null,
        Cabin: null,
        JourneyTime: null,
        AircraftCode: null,
        AircraftType: null,
        Origin_Start: null,
        Destination_Last: null,
        DepartureTime_Start: null,
        ArrivalTime_Last: null,
        base_fare: null,
      };
    } else if (journey && journey.length > 0) {
      const firstLeg = journey[0].Bonds[0]?.Legs[0];
      const lastLeg =
        journey[0].Bonds[journey[0].Bonds.length - 1]?.Legs.slice(-1)[0];

      return {
        stops: journey[0].Bonds.map((bonds) => bonds.Legs.length - 1),
        legs: journey[0].Bonds.map((bonds) => bonds.Legs),
        flightName: journey[0].Bonds.map((bonds) => bonds.Legs[0].FlightName),
        Cabin: journey[0].Bonds.map((bonds) => bonds.Legs[0].Cabin),
        JourneyTime: journey[0].Bonds.map((bonds) => bonds.JourneyTime),
        AircraftCode: journey[0].Bonds.map(
          (bonds) => bonds.Legs[0].AircraftCode
        ),
        AircraftType: journey[0].Bonds.map(
          (bonds) => bonds.Legs[0].AircraftType
        ),
        Origin_Start: journey[0].Bonds.map((bonds) => bonds.Legs[0].Origin),
        Destination_Last: journey[0].Bonds.map(
          (bonds) => lastLeg?.Destination || null
        ),
        Duration: journey[0].Bonds.map((bonds) => firstLeg?.Duration || null),
        DepartureDate: journey[0].Bonds.map(
          (bonds) => firstLeg?.DepartureDate || null
        ),
        DepartureTime_Start: journey[0].Bonds.map(
          (bonds) => firstLeg?.DepartureTime || null
        ),
        ArrivalDate: journey[0].Bonds.map(
          (bonds) => lastLeg?.ArrivalDate || null
        ),
        ArrivalTime_Last: journey[0].Bonds.map(
          (bonds) => lastLeg?.ArrivalTime || null
        ),
        base_fare: journey[0].Fare?.BasicFare || null,
        DepartureTerminal:
          journey[0].Bonds.map((bonds) => bonds.Legs[0].DepartureTerminal) ||
          null,
        ArrivalTerminal:
          journey[0].Bonds.map((bonds) => bonds.Legs[0].ArrivalTerminal) ||
          null,
      };
    }
  }, [journey]);

  // ######### SCHEMA ##########
  const schema = yup.object().shape({
    MobileNumber: yup
      .string()
      .required("Please enter your mobile number *")
      .matches(PATTERNS.MOBILE),
  });

  const defaultValues = useMemo(
    () => ({
      MobileNumber: "",
    }),
    []
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const submitReviewForm = (data) => {
    console.log(
      "flightBookingDetails in submit=>",
      flightBookingDetails.flightBookingDetails
    );
    const tempBookingData = {
      ...data,
      ...flightBookingDetails.flightBookingDetails,
      AdultTraveller: adultArray,
      ChildTraveller: childrenArray,
      InfantTraveller: infantArray,
      Segment: [segments],
    };
    // if (adultCount > 0) tempBookingData.AdultTraveller = adultArray;
    // if (childrenCount > 0) tempBookingData.ChildTraveller = childrenArray;
    // if (infantCount > 0) tempBookingData.InfantTraveller = infantArray;
    dispatch(setFlightBookingDetails(tempBookingData));

    postJsonData(
      ApiEndpoints.BOOK_FLIGHT,
      tempBookingData,
      setRequest,
      (res) => {
        okSuccessToast(res.data.message);
        setActiveStep(BOOKINGSTEP.PAYMENT);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  useEffect(() => {

    return () => {};
  }, [flightBookingDetails]);

  return (
    <Box
      component="form"
      id="traveller_form"
      autoComplete="off"
      onSubmit={handleSubmit(submitReviewForm)}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Grid container spacing={4}>
            {/* ####### FLIGHT DETAILS CARD CODE ####### */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: primaryLight(),
                  color: whiteColor(),
                  px: 2,
                  py: 1,
                }}
              >
                <AirplaneTicketIcon fontSize="medium" />
                <Typography
                  sx={{
                    fontSize: "18px",
                    ml: 1,
                  }}
                >
                  Booking Details
                </Typography>
              </Box>
              <Card>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    display: "flex",
                    fontSize: "12px",
                    color: whiteColor(),
                    width: "max-content",
                    letterSpacing: "1.1px",
                    borderBottomRightRadius: "12px",
                    backgroundColor: primaryColor(),
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => {
                    setActiveStep(BOOKINGSTEP.REVIEW);
                  }}
                >
                  EDIT
                </Box>

                {/* ####################### */}
                <Mount visible={!isMobile}>
                  <Box
                    sx={{
                      px: 2,
                      mt: 1,
                      pb: 2,
                    }}
                  >
                    {/* ################# */}
                    {/* INFO BOX */}
                    {/* ################# */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <AirplaneTicketIcon fontSize="large" />
                      <Typography
                        sx={{
                          fontSize: "18px",
                          ml: 1,
                        }}
                      >
                        {origin.CityName} - {destination.CityName} |{" "}
                        {moment(departureDate).format("ddd-LL")}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: { xs: "left", md: "center" },
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      {/* FIRST BOX */}
                      <Box
                        sx={{
                          display: "flex",
                        }}
                      >
                        <img
                          alt="Flight"
                          src={AirIndia}
                          style={{
                            width: "28px",
                            height: "28px",
                          }}
                        />
                        <Box
                          sx={{
                            ml: 2,
                            textAlign: "left",
                          }}
                        >
                          <Typography>{journeyDetails?.flightName}</Typography>
                          <Typography
                            sx={{
                              fontSize: "13px",
                            }}
                          >
                            {journeyDetails?.AircraftCode} -{" "}
                            {journeyDetails?.AircraftType}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px",
                            }}
                          >
                            {journeyDetails?.Cabin}
                          </Typography>
                        </Box>
                      </Box>

                      {/* SECOND BOX */}
                      <Box
                        sx={{
                          ml: 2,
                          textAlign: "left",
                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          {journeyDetails?.DepartureTime_Start}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                        >
                          {journeyDetails?.Origin_Start}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "13px",
                          }}
                        >
                          {journeyDetails.DepartureDate},{" "}
                          {journeyDetails.DepartureTime_Start}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "13px",
                          }}
                        >
                          Terminal {journeyDetails?.DepartureTerminal}
                        </Typography>
                      </Box>

                      {/* THIRD BOX */}
                      <Box>
                        <div
                          className="fli3"
                          style={{
                            position: "relative",
                          }}
                        >
                          <div className="stp">
                            <span ng-bind="l.duration" className="ng-binding">
                              {journeyDetails?.Duration}
                            </span>
                          </div>
                          <div className="lin2 lindvd">
                            <div className="fli-i"></div>
                          </div>
                          <div className="clr"></div>
                          <div className="ref" id="spnRefundable">
                            <span>Refundable</span>
                          </div>
                          <div className="clr"></div>
                        </div>
                      </Box>

                      {/* FOURTH BOX */}
                      <Box
                        sx={{
                          ml: 2,
                          textAlign: "left",
                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          {journeyDetails?.ArrivalTime_Last}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                        >
                          {journeyDetails?.Destination_Last}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "13px",
                          }}
                        >
                          {journeyDetails?.ArrivalDate},{" "}
                          {journeyDetails?.ArrivalTime_Last}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "13px",
                          }}
                        >
                          Terminal {journeyDetails?.ArrivalTerminal}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Mount>

                {/* ####################### */}
                <Mount visible={isMobile}>
                  <Box
                    sx={{
                      px: 2,
                      mt: 1,
                    }}
                  >
                    {/* ################# */}
                    {/* INFO BOX */}
                    {/* ################# */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        textAlign: "left",
                      }}
                    >
                      <AirplaneTicketIcon fontSize="large" />
                      <Typography
                        sx={{
                          fontSize: { xs: "13px", lg: "18px" },
                          ml: 1,
                        }}
                      >
                        {origin.CityName} - {destination.CityName} |{" "}
                        {moment(departureDate).format("ddd-LL")}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: { xs: "left", md: "center" },
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      {/* FIRST BOX */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                          }}
                        >
                          <img
                            alt="Flight"
                            src={AirIndia}
                            style={{
                              width: "28px",
                              height: "28px",
                            }}
                          />
                          <Box
                            sx={{
                              ml: 2,
                              textAlign: "left",
                            }}
                          >
                            <Typography>
                              {journeyDetails?.flightName}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: "10px", lg: "13px" },
                              }}
                            >
                              {journeyDetails?.AircraftCode} -
                              {journeyDetails?.AircraftType} (
                              {journeyDetails?.Cabin})
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            backgroundColor: "#EAE8E8",
                            color: blackColor(),
                            fontWeight: "bold",
                            width: "max-content",
                            borderRadius: "12px",
                            fontSize: { xs: "10px", lg: "12px" },
                            px: { xs: 1, lg: 1.5 },
                            py: { xs: 0.2, lg: 0.5 },
                            letterSpacing: { xs: "1px", lg: "1.1px" },
                          }}
                        >
                          Retail Fare
                        </Box>
                      </Box>

                      {/* OTHER BOX CONTAINERS */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mt: { xs: 1.5, lg: 0 },
                        }}
                      >
                        {/* SECOND BOX */}
                        <Box
                          sx={{
                            ml: { xs: 0, lg: 2 },
                            textAlign: "left",
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: "bold",
                            }}
                          >
                            {journeyDetails?.DepartureTime_Start}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: "10px", lg: "13px" },
                              fontWeight: "bold",
                            }}
                          >
                            {journeyDetails?.Origin_Start}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: "10px", lg: "13px" },
                            }}
                          >
                            {journeyDetails.DepartureDate},{" "}
                            {journeyDetails.DepartureTime_Start}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: "10px", lg: "13px" },
                            }}
                          >
                            Terminal {journeyDetails?.DepartureTerminal}
                          </Typography>
                        </Box>

                        {/* THIRD BOX */}
                        <Box>
                          <div
                            className="fli3"
                            style={{
                              position: "relative",
                            }}
                          >
                            <div className="">
                              <Typography
                                sx={{
                                  fontSize: { xs: "10px", lg: "13px" },
                                }}
                              >
                                {journeyDetails?.Duration}
                              </Typography>
                            </div>
                            <div className="lin2 lindvd">
                              <div className="fli-i"></div>
                            </div>
                            <div className="clr"></div>
                            <div className="ref" id="spnRefundable">
                              <span>Refundable</span>
                            </div>
                            <div className="clr"></div>
                          </div>
                        </Box>

                        {/* FOURTH BOX */}
                        <Box
                          sx={{
                            ml: 2,
                            textAlign: "left",
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: "bold",
                            }}
                          >
                            {journeyDetails?.ArrivalTime_Last}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: "10px", lg: "13px" },
                              fontWeight: "bold",
                            }}
                          >
                            {journeyDetails?.Destination_Last}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: "10px", lg: "13px" },
                            }}
                          >
                            {journeyDetails?.ArrivalDate},{" "}
                            {journeyDetails?.ArrivalTime_Last}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: "10px", lg: "13px" },
                            }}
                          >
                            Terminal {journeyDetails?.ArrivalTerminal}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Mount>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <CardHeading
                title="Traveller Details"
                subTitle="(Name should be same as in Government ID proof)"
                px={0}
              />
              <Card
                sx={{
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  py: 1,
                  px: 3,
                }}
              >
                <TravellerCard />
              </Card>
            </Grid>
            <Grid item xs={12}>
              <CardHeading
                title="Contact Details"
                subTitle="(Your Mobile number will be used only for sending flight related communication)"
                transparent
                px={0}
              />
              <Card
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  py: 0.1,
                }}
              >
                <FormControl fullWidth>
                  <RHFTextField
                    name="MobileNumber"
                    placeholder="Enter Mobile number"
                    control={control}
                    errors={errors}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ContactPhoneIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              </Card>
            </Grid>

            {/* ####### CONTINUE BOOKING BUTTON ####### */}
            <Grid item xs={12}>
              <LoadingButton
                loading={request}
                fullWidth
                form="traveller_form"
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: primaryColor(),
                  py: 2,
                  borderRadius: "8px",
                  "&:hover": {
                    cursor: "pointer",
                    fontWeight: "bold",
                    color: whiteColor(),
                    backgroundColor: secondaryColor(),
                  },
                }}
              >
                Continue Booking
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>

        {/* GRID 2 */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              {/* PRICE SUMMARY HEADING */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: primaryLight(),
                  color: whiteColor(),
                  px: 2,
                  py: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "18px",
                    ml: 1,
                  }}
                >
                  Price Summary
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: whiteColor(),
                    pr: 1,
                    pl: 0.5,
                  }}
                >
                  <PassengerCount title="Adult" count={adultCount} />
                  <PassengerCount
                    icon={<BoyIcon fontSize="small" />}
                    title="Child"
                    count={childrenCount}
                  />
                  <PassengerCount
                    icon={<ChildFriendlyIcon fontSize="small" />}
                    title="Infants"
                    count={infantCount}
                  />
                </Box>
              </Box>
              {/* PRICE SUMMARY BODY */}
              <Card
                sx={{
                  px: 2,
                  py: 1,
                }}
              >
                <RowComponent title="Adult x 1" value="4600" />
                <RowComponent title="Child x 0" value="600" />
                <GrandTotalRow title="Grand Total" value="5200" />
              </Card>
            </Grid>

            {/* ####### CONTINUE BOOKING BUTTON ####### */}
            <Grid item xs={12}>
              <LoadingButton
                loading={request}
                fullWidth
                type="submit"
                form="traveller_form"
                variant="contained"
                sx={{
                  backgroundColor: primaryColor(),
                  borderRadius: "8px",
                  py: 2,
                  "&:hover": {
                    cursor: "pointer",
                    fontWeight: "bold",
                    color: whiteColor(),
                    backgroundColor: secondaryColor(),
                  },
                }}
              >
                Continue Booking
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TravellerDetail;
// ##########################
// MAIN COMPONENT END #######
// ##########################

const RowComponent = ({ title = "", value = "" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #d3d3d3",
        py: 0.5,
      }}
    >
      <Typography
        sx={{
          fontSize: "13px",
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontSize: "13px",
        }}
      >
        ₹ {value}
      </Typography>
    </Box>
  );
};

const GrandTotalRow = ({ title = "", value = "" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #d3d3d3",
        py: 0.5,
      }}
    >
      <Typography
        sx={{
          fontSize: "18px",
          color: "#D63B05",
          fontWeight: "bold",
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontSize: "18px",
          color: "#D63B05",
          fontWeight: "bold",
        }}
      >
        ₹ {value}
      </Typography>
    </Box>
  );
};

const CardHeading = ({
  title = "",
  transparent = false,
  subTitle = "",
  px = 2,
  py = 1,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: transparent ? "" : primaryLight(),
        color: transparent ? blackColor() : whiteColor(),
        px: px,
        py: py,
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Mount visible={title}>
          <Typography
            sx={{
              fontSize: "18px",
              ml: 1,
            }}
          >
            {title}
          </Typography>
        </Mount>
        <Mount visible={subTitle}>
          <Typography
            sx={{
              fontSize: "13px",
              ml: title ? 1 : 1,
            }}
          >
            {subTitle}
          </Typography>
        </Mount>
      </span>
    </Box>
  );
};

const PassengerCount = ({
  icon = <AccessibilityIcon fontSize="small" />,
  count = 0,
  title = "Adult",
}) => {
  return (
    <Typography
      sx={{
        display: "flex",
        alignItems: "center",
        color: blackColor(),
      }}
    >
      <Tooltip title={title} placement="top">
        <IconButton
          size="small"
          sx={{
            color: blackColor(),
            backgroundColor: whiteColor(),
          }}
        >
          {icon}
        </IconButton>
      </Tooltip>
      <Typography
        sx={{
          fontWeight: "bold",
        }}
      >
        : {count}
      </Typography>
    </Typography>
  );
};
const CardHeading2 = ({
  title = "",
  actions = false,
  transparent = false,
  subTitle = "",
  px = 2,
  py = 1,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: transparent ? "" : primaryLight(),
        color: transparent ? blackColor() : whiteColor(),
        px: px,
        py: py,
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          marginLeft: 2,
        }}
      >
        <Mount visible={title}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {actions}

            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                textAlign: "left",
                ml: 3,
              }}
            >
              {title}
            </Typography>
          </Box>
        </Mount>
        <Mount visible={subTitle}>
          <Typography
            sx={{
              fontSize: "13px",
              textAlign: "left",
            }}
          >
            {subTitle}
          </Typography>
        </Mount>
      </div>
    </Box>
  );
};

// ######### DYNAMIC TRAVELLER DETAILS INPUT FIELDS #########
const TravellerCard = () => {
  const {
    adultArray,
    childrenArray,
    infantArray,
    adultCount,
    childrenCount,
    infantCount,
  } = useSelector((state) => state?.flight);
  const [error, setError] = useState({ type: "", err: "" });
  const dispatch = useDispatch();

  const setAdultValueToArray = (passedIndex, key, value) => {
    dispatch(
      setAdultArray({ type: "mod", index: passedIndex, val: value, key: key })
    );
  };
  const setChildrenValueToArray = (passedIndex, key, value) => {
    dispatch(
      setChildrenArray({
        type: "mod",
        index: passedIndex,
        val: value,
        key: key,
      })
    );
  };
  const setInfantValueToArray = (passedIndex, key, value) => {
    dispatch(
      setInfantArray({ type: "mod", index: passedIndex, val: value, key: key })
    );
  };

  const addAdultRow = () => {
    if (Number(adultArray.length) < adultCount) {
      dispatch(
        setAdultArray({ adultArray: { Title: "", LastName: "", lastname: "" } })
      );
    } else if (Number(adultArray.length) === adultCount) {
      setError({
        type: "adult",
        err: `You have already selected ${adultCount} ADULT . Remove before adding a new one`,
      });
    }
  };
  const addChildrenRow = () => {
    if (Number(childrenArray.length) < childrenCount) {
      dispatch(
        setChildrenArray({
          childrenArray: { Title: "", LastName: "", lastname: "" },
        })
      );
    } else if (Number(childrenArray.length) === childrenCount) {
      setError({
        type: "children",
        err: `You have already selected ${childrenCount} CHILD . Remove before adding a new one`,
      });
    }
  };
  const addInfantRow = () => {
    if (Number(infantArray.length) < infantCount) {
      dispatch(
        setInfantArray({
          infantArray: { Title: "", LastName: "", lastname: "" },
        })
      );
    } else if (Number(infantArray.length) === infantCount) {
      setError({
        type: "infant",
        err: `You have already selected ${infantCount} INFANT . Remove before adding a new one`,
      });
    }
  };

  const deleteAdultRow = (passedIndex) => {
    if (error?.type === "adult") setError("");
    dispatch(
      setAdultArray({
        type: "del",
        adultArray: adultArray.filter((item, index) => index !== passedIndex),
      })
    );
  };
  const deleteChildrenRow = (passedIndex) => {
    if (error?.type === "children") setError("");
    dispatch(
      setChildrenArray({
        type: "del",
        childrenArray: childrenArray.filter(
          (item, index) => index !== passedIndex
        ),
      })
    );
  };
  const deleteInfantRow = (passedIndex) => {
    if (error?.type === "infant") setError("");
    dispatch(
      setInfantArray({
        type: "del",
        infantArray: infantArray.filter((item, index) => index !== passedIndex),
      })
    );
  };

  return (
    <>
      {/* ADULT TRAVELLERS ARRAY */}
      <Mount visible={adultCount > 0}>
        {error?.type === "adult" && (
          <Alert severity="error">{error?.err}</Alert>
        )}
        <Box
          sx={{
            mt: 2,
            mb: 2,
          }}
        >
          {adultCount > 0 &&
            adultArray?.length > 0 &&
            adultArray.map((item, index) => {
              return (
                <Card
                  sx={{
                    width: "100%",
                    mb: 1,
                  }}
                >
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="traveller_details-content"
                      id="traveller_details-header"
                    >
                      <CardHeading2
                        title={`Adult ${index + 1}`}
                        actions={
                          <Icon
                            icon="ant-design:delete-twotone"
                            color="red"
                            onClick={() => deleteAdultRow(index)}
                          />
                        }
                        transparent
                        px={0}
                        py={0}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item md={4} xs={11}>
                          <FormControl
                            sx={{
                              width: "100%",
                            }}
                          >
                            <TextField autoComplete="off"
                              select
                              label="Title"
                              size="small"
                              required
                              value={item.Title}
                              onChange={(e) =>
                                setAdultValueToArray(
                                  index,
                                  "Title",
                                  e.target.value
                                )
                              }
                            >
                              <MenuItem label="MR" value="MR">
                                MR
                              </MenuItem>
                              <MenuItem label="MS" value="MS">
                                MS
                              </MenuItem>
                              <MenuItem label="Mrs" value="Mrs">
                                Mrs.
                              </MenuItem>
                            </TextField>
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={11}>
                          <FormControl
                            sx={{
                              width: "100%",
                            }}
                          >
                            <TextField autoComplete="off"
                              label="First Name & (Middle name, if any)"
                              size="small"
                              required
                              value={item.FirstName}
                              onChange={(e) =>
                                setAdultValueToArray(
                                  index,
                                  "FirstName",
                                  e.target.value
                                )
                              }
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={11}>
                          <FormControl
                            sx={{
                              width: "100%",
                            }}
                          >
                            <TextField autoComplete="off"
                              label="Last Name"
                              size="small"
                              required
                              value={item.LastName}
                              onChange={(e) =>
                                setAdultValueToArray(
                                  index,
                                  "LastName",
                                  e.target.value
                                )
                              }
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Card>
              );
            })}
          <Button
            variant="text"
            size="small"
            color="secondary"
            onClick={addAdultRow}
            startIcon={
              <Icon icon="fluent:add-16-filled" style={{ fontSize: "14px" }} />
            }
            sx={{ textTransform: "none" }}
          >
            Add Adult
          </Button>
        </Box>
      </Mount>
      {/* CHILDREN TRAVELLERS ARRAY */}
      <Mount visible={childrenCount > 0}>
        <Box
          sx={{
            mt: 2,
            mb: 2,
          }}
        >
          {error?.type === "children" && (
            <Alert severity="error">{error?.err}</Alert>
          )}
          {childrenCount > 0 &&
            childrenArray?.length > 0 &&
            childrenArray.map((item, index) => {
              return (
                <Card
                  sx={{
                    width: "100%",
                    mt: 2,
                  }}
                >
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="children_details-content"
                      id="children_details-header"
                    >
                      <CardHeading2
                        title={`Child ${index + 1}`}
                        actions={
                          <Icon
                            icon="ant-design:delete-twotone"
                            color="red"
                            onClick={() => deleteChildrenRow(index)}
                          />
                        }
                        transparent
                        px={0}
                        py={0}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item md={4} xs={11}>
                          <FormControl
                            sx={{
                              width: "100%",
                            }}
                          >
                            <TextField autoComplete="off"
                              select
                              label="Title"
                              size="small"
                              required
                              value={item.Title}
                              onChange={(e) =>
                                setChildrenValueToArray(
                                  index,
                                  "Title",
                                  e.target.value
                                )
                              }
                            >
                              <MenuItem label="Miss" value="MISS">
                                Miss
                              </MenuItem>
                              <MenuItem label="Master" value="MASTER">
                                Master
                              </MenuItem>
                            </TextField>
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={11}>
                          <FormControl
                            sx={{
                              width: "100%",
                            }}
                          >
                            <TextField autoComplete="off"
                              label="First Name & (Middle name, if any)"
                              size="small"
                              required
                              value={item.FirstName}
                              onChange={(e) =>
                                setChildrenValueToArray(
                                  index,
                                  "FirstName",
                                  e.target.value
                                )
                              }
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={11}>
                          <FormControl
                            sx={{
                              width: "100%",
                            }}
                          >
                            <TextField autoComplete="off"
                              label="Last Name"
                              size="small"
                              required
                              value={item.LastName}
                              onChange={(e) =>
                                setChildrenValueToArray(
                                  index,
                                  "LastName",
                                  e.target.value
                                )
                              }
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Card>
              );
            })}

          <Button
            variant="text"
            size="small"
            color="secondary"
            onClick={addChildrenRow}
            startIcon={
              <Icon icon="fluent:add-16-filled" style={{ fontSize: "14px" }} />
            }
            sx={{ textTransform: "none" }}
          >
            Add Child
          </Button>
        </Box>
      </Mount>
      {/* INFANT TRAVELLERS ARRAY */}
      <Mount visible={infantCount > 0}>
        <Box
          sx={{
            mt: 2,
            mb: 2,
          }}
        >
          {error?.type === "infant" && (
            <Alert severity="error">{error?.err}</Alert>
          )}
          {infantCount > 0 &&
            infantArray?.length > 0 &&
            infantArray.map((item, index) => {
              return (
                <Card
                  sx={{
                    width: "100%",
                    mt: 2,
                  }}
                >
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="infant_details-content"
                      id="infant_details-header"
                    >
                      <CardHeading2
                        title={`Infant ${index + 1}`}
                        actions={
                          <Icon
                            icon="ant-design:delete-twotone"
                            color="red"
                            onClick={() => deleteInfantRow(index)}
                          />
                        }
                        transparent
                        px={0}
                        py={0}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item md={4} xs={11}>
                          <FormControl
                            sx={{
                              width: "100%",
                            }}
                          >
                            <TextField autoComplete="off"
                              select
                              label="Title"
                              size="small"
                              required
                              value={item.Title}
                              onChange={(e) =>
                                setInfantValueToArray(
                                  index,
                                  "Title",
                                  e.target.value
                                )
                              }
                            >
                              <MenuItem label="Miss" value="MISS">
                                Miss
                              </MenuItem>
                              <MenuItem label="Master" value="MASTER">
                                Master
                              </MenuItem>
                            </TextField>
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={11}>
                          <FormControl
                            sx={{
                              width: "100%",
                            }}
                          >
                            <TextField autoComplete="off"
                              label="First Name & (Middle name, if any)"
                              size="small"
                              required
                              value={item.FirstName}
                              onChange={(e) =>
                                setInfantValueToArray(
                                  index,
                                  "FirstName",
                                  e.target.value
                                )
                              }
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={11}>
                          <FormControl
                            sx={{
                              width: "100%",
                            }}
                          >
                            <TextField autoComplete="off"
                              label="Last Name"
                              size="small"
                              required
                              value={item.LastName}
                              onChange={(e) =>
                                setInfantValueToArray(
                                  index,
                                  "LastName",
                                  e.target.value
                                )
                              }
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Card>
              );
            })}

          <Button
            variant="text"
            size="small"
            color="secondary"
            onClick={addInfantRow}
            startIcon={
              <Icon icon="fluent:add-16-filled" style={{ fontSize: "14px" }} />
            }
            sx={{ textTransform: "none" }}
          >
            Add Infant
          </Button>
        </Box>
      </Mount>
    </>
  );
};
