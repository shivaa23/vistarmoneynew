/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo } from "react";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Radio,
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
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import TokenIcon from "@mui/icons-material/Token";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MailIcon from "@mui/icons-material/Mail";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import RHFTextField from "../../RHFTextField";
import RHFRadioGroup from "../../RHFRadioGroup";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import AuthContext from "../../../store/AuthContext";
import { setFlightBookingDetails } from "../../../features/flight/flightSlice";
import { BOOKINGSTEP } from "../../../utils/constants";

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
const FlightDetailReview = ({ activeStep, setActiveStep }) => {
  const isMobile = useResponsive("down", "lg");
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const dispatch = useDispatch();

  const {
    journey,
    origin,
    destination,
    departureDate,
    adultCount,
    infantCount,
    childrenCount,
    traceid,
    cabin,
    tripType,
    flightBookingDetails,
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
        TotalTaxWithOutMarkUp: journey[0].Fare?.TotalTaxWithOutMarkUp || null,
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
    email: yup.string().required("Please enter your email address *"),
    insurance_selection: yup
      .string()
      .required("NOTE: Please select Yes or No to continue"),
  });

  const defaultValues = useMemo(
    () => ({
      email: flightBookingDetails.email || "",
    }),
    []
  );

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), defaultValues });

  const submitReviewForm = (data) => {
    const tempBookingData = {
      Cabin: cabin,
      BeginDate: moment(departureDate).format("YYYY-MM-DD"),
      Destination: journeyDetails.Destination_Last[0],
      Origin: journeyDetails.Origin_Start[0],
      MobileNumber: user.username,
      TripType: tripType,
      BookingAmount:
        journeyDetails.base_fare + journeyDetails.TotalTaxWithOutMarkUp,
      TraceId: traceid,
      ...data,
    };
    dispatch(setFlightBookingDetails(tempBookingData));
    setActiveStep(BOOKINGSTEP.TRAVELLERS);
  };

  const INSURANCE_OPTION = [
    {
      value: "YES",
      label: (
        <Box>
          <Typography
            sx={{
              fontSize: "13px",
            }}
          >
            Yes, I want to secure my trip with Insurance.
          </Typography>
          <Typography
            sx={{
              fontSize: "13px",
              backgroundColor: "#DFF0D8",
              px: 1,
            }}
          >
            More than 40% of our customer choose to secure their trip.
          </Typography>
        </Box>
      ),
    },
    {
      value: "NO",
      label: (
        <Typography
          sx={{
            fontSize: "13px",
          }}
        >
          No, I don't want to insure my trip.
        </Typography>
      ),
    },
  ];
  useEffect(() => {
    if (flightBookingDetails && flightBookingDetails.email)
      setValue("email", flightBookingDetails.email);
    return () => {};
  }, []);

  return (
    <Box
      component="form"
      id="review_form"
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
                  Flight Detail
                </Typography>
              </Box>
              <Card>
                <Box
                  sx={{
                    display: "flex",
                    backgroundColor: "#5D5A5A",
                    color: whiteColor(),
                    width: "max-content",
                    borderBottomRightRadius: "12px",
                    fontSize: "12px",
                    px: 1.5,
                    py: 0.5,
                    letterSpacing: "1.1px",
                  }}
                >
                  DEPART
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

            {/* ####### INSURANCE SELECT CODE ####### */}
            <Grid item xs={12}>
              <Card>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="flight_insurance-content"
                    id="flight_insurance-header"
                  >
                    <CardHeading2
                      title="Add Travel Insurance and Secure your Trip with ACKO View/ print your booking 199/Person"
                      subTitle="(Upon Selecting Travel Insurance ,You accept the Terms and Conditions of the travel insurance policy)"
                      transparent
                      px={0}
                      py={0}
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    <InsuranceCard
                      img=""
                      title="Sum Insured"
                      value="INR 1,00,000"
                    />
                  </AccordionDetails>
                </Accordion>
                <RHFRadioGroup
                  name="insurance_selection"
                  options={INSURANCE_OPTION}
                  sx={{
                    "& .MuiFormControlLabel-root": {
                      textAlign: "left",
                      width: "100%",
                      px: 2,
                      backgroundColor: "#F7F7F7",
                      pt: 0.5,
                    },
                  }}
                  rControl={
                    <Radio
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 16,
                        },
                      }}
                    />
                  }
                  control={control}
                  errors={errors}
                />
                {/* <FormControl
                  sx={{
                    textAlign: "left",
                    width: "100%",
                    px: 2,
                    backgroundColor: "#F7F7F7",
                    pt: 0.5,
                  }}
                >
                  <RadioGroup
                    aria-labelledby="insurance_selection-btn-grp"
                    defaultValue="NO"
                    name="insurance_selection"
                  >
                    <FormControlLabel
                      value="YES"
                      control={
                        <Radio
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: 16,
                            },
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "13px",
                            }}
                          >
                            Yes, I want to secure my trip with Insurance.
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              backgroundColor: "#DFF0D8",
                              px: 1,
                            }}
                          >
                            More than 40% of our customer choose to secure their
                            trip.
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="NO"
                      control={
                        <Radio
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: 16,
                            },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontSize: "13px",
                          }}
                        >
                          No, I don't want to insure my trip.
                        </Typography>
                      }
                    />
                  </RadioGroup>
                </FormControl> */}
              </Card>
            </Grid>
            {/* ####### EMAIL ADDRESS CODE ####### */}
            <Grid item xs={12}>
              <CardHeading
                title="Contact Information"
                subTitle="(Your ticket will be sent to this email address)"
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
                    name="email"
                    placeholder="Enter Email Address"
                    control={control}
                    errors={errors}
                    defaultValue={flightBookingDetails?.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              </Card>
            </Grid>

            {/* ####### CONTINUE BOOKING BUTTON ####### */}
            <Grid item xs={12}>
              <Button
                fullWidth
                form="review_form"
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
              </Button>
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
                  <PassengerCount title="Fare" count={adultCount} />
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
                <RowComponent title="Fare" value={journeyDetails.base_fare} />
                <RowComponent
                  title="Total taxes"
                  value={journeyDetails.TotalTaxWithOutMarkUp}
                />
                <GrandTotalRow
                  title="Grand Total"
                  value={
                    journeyDetails.base_fare +
                    journeyDetails.TotalTaxWithOutMarkUp
                  }
                />
              </Card>
            </Grid>

            {/* ####### CONTINUE BOOKING BUTTON ####### */}
            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                form="review_form"
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
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FlightDetailReview;
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
        py: 0.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #d3d3d3",
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
const CardHeading2 = ({
  title = "",
  transparent = false,
  subTitle = "",
  px = 2,
  py = 1,
  startIcon = <VerifiedUserIcon />,
  endIcon = <TokenIcon />,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: transparent ? "" : primaryLight(),
        color: transparent ? blackColor() : whiteColor(),
        px: px,
        py: py,
        position: "relative",
      }}
    >
      {startIcon}
      <span
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
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                textAlign: "left",
              }}
            >
              {title}
            </Typography>
            {endIcon}
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
      </span>
    </Box>
  );
};
const InsuranceCard = ({ img, title = "", value = "" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        border: "1px solid #d3d3d3",
        width: "max-content",
        p: 2,
        borderRadius: "2px",
      }}
    >
      <VaccinesIcon />
      <Box>
        <Typography>
          {title}: {value}
        </Typography>
      </Box>
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
