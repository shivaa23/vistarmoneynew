import { Grid } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";
import SimpleSlider from "../component/SimpleSlider";

const LandingPageTestimonials = () => {
  return (
    <Grid xs={12} className="sectionBreake">
      <Container maxWidth="lg">
        <div className="landing-bg_main_font" style={{ textAlign: "center" }}>
          What Our Clients Say
        </div>
        <div
          className="landingPageSubHeading"
          style={{ textAlign: "center", marginBottom: "2ch" }}
        >
          Strong relationships are extremely important to us because we have
          experienced their advantages for our company. In order for us to get
          it right, customer feedback is crucial.
        </div>
        <SimpleSlider />
      </Container>
    </Grid>
  );
};

export default LandingPageTestimonials;
