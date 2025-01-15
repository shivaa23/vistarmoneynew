import React, { useState } from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { BOOKINGSTEP } from "../../utils/constants";
import Mount from "../../component/Mount";
import TravellerDetail from "../../component/Travel/booking_review/TravellerDetail";
import PaymentDetailFlight from "../../component/Travel/booking_review/PaymentDetailFlight";
import FlightDetailReview from "../../component/Travel/booking_review/FlightDetailReview";

const BookingReviewPage = () => {
  const [activeStep, setActiveStep] = useState(BOOKINGSTEP.REVIEW);

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color={activeStep === BOOKINGSTEP.REVIEW ? "text.primary" : "inherit"}
      style={{
        fontSize: "13px",
      }}
    >
      1) Review
    </Link>,
    <Link
      underline="hover"
      key="2"
      color={activeStep === BOOKINGSTEP.TRAVELLERS ? "text.primary" : "inherit"}
      style={{
        fontSize: "13px",
      }}
    >
      2) Travellers
    </Link>,
    <Typography
      key="3"
      color={activeStep === BOOKINGSTEP.PAYMENT ? "text.primary" : "inherit"}
      style={{
        fontSize: "13px",
      }}
    >
      3) Payment
    </Typography>,
  ];

  return (
    <>
      <Breadcrumbs
        separator={<NavigateNextIcon sx={{ fontSize: "13px" }} />}
        aria-label="booking_step"
      >
        {breadcrumbs}
      </Breadcrumbs>

      <Mount visible={activeStep === BOOKINGSTEP.REVIEW}>
        <FlightDetailReview
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      </Mount>
      <Mount visible={activeStep === BOOKINGSTEP.TRAVELLERS}>
        <TravellerDetail
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      </Mount>
      <Mount visible={activeStep === BOOKINGSTEP.PAYMENT}>
        <PaymentDetailFlight
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      </Mount>
    </>
  );
};

export default BookingReviewPage;