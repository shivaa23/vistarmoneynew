import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { lp_illustration, slider1, slider2 } from "../iconsImports";
import { getEnv, secondaryColor } from "../theme/setThemeColor";
import { Box, Grid, IconButton } from "@mui/material";
import { PrimaryButton, SecondaryButton } from "../theme/Theme";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import LaunchIcon from "@mui/icons-material/Launch";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const PrevArrow = ({ onClick }) => (
  <IconButton
    className="slider-arrow left-arrow"
    onClick={onClick} // Add the onClick handler here
    aria-label="Previous Slide"
    sx={{ backgroundColor: "red" }}
  >
    <ChevronLeftIcon sx={{ fontSize: "30px" }} />
  </IconButton>
);

const NextArrow = ({ onClick }) => (
  <IconButton
    className="slider-arrow right-arrow" // Add "right-arrow" class name
    onClick={onClick}
    aria-label="Next Slide"
  >
    <ChevronRightIcon sx={{ fontSize: "30px" }} />
  </IconButton>
);

const SimpleSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };
  const navigate = useNavigate();
  const [env, setEnv] = useState(getEnv());

  return (
    <Slider {...settings}>
      <div className="slider-div">
        <div>
          <figure className="SliderCard2">
            <Grid container xs={12}>
              <Grid
                md={env === "DilliPay" || env === "PaisaKart" ? 6 : 12}
                sm={12}
              >
                <Box container>
                  <div className="lineUp">
                    <div className="landing-bg_main_font">Welcome To</div>
                    <div className="landing-bg_biggpay_font">
                      {process.env.REACT_APP_TITLE === "MoneyOddr" ? (
                        <div>
                          <span> Money</span>
                          <span
                            style={{
                              color: secondaryColor(),
                              marginLeft: "10px",
                            }}
                          >
                            OddR
                          </span>
                        </div>
                      ) : (
                        process.env.REACT_APP_TITLE
                      )}
                    </div>
                  </div>
                  <div className="lineUpDelay">
                    {process.env.REACT_APP_TITLE === "MoneyOddr" ? (
                      <div className="mt-4">
                        <main className="landing_intro">
                          <p style={{ fontSize: "23px" }}>
                            An Emerging Digital Payment Platform For
                          </p>
                          <section className="animation mt-3">
                            <div className="animText">
                              <div>INDIVIDUALS</div>
                            </div>
                            <div className="animText">
                              <div>BUSINESSMEN</div>
                            </div>
                            <div className="animText">
                              <div>CORPORATIONS</div>
                            </div>
                          </section>
                        </main>
                      </div>
                    ) : (
                      // <div className="landing_intro">
                      //   An Emerging Digital Payment Platform For Individuals,
                      //   Business Owners & Corporations.
                      // </div>
                      <div className="landing_intro">
                        New Age Payment Solution Platform For Individuals,
                        Business Owners & Corporations.
                      </div>
                    )}

                    {process.env.REACT_APP_TITLE !== "MoneyOddr" && (
                      <Box
                        component="div"
                        sx={{
                          textAlign: env === "MoneyOddr" ? "center" : "left",
                          mt: 1,
                          mb: 3,
                        }}
                      >
                        <IconButton
                          className="pulse-effect"
                          aria-label="delete"
                          sx={{
                            backgroundColor: "#fff",
                            marginRight: "0.5rem",
                            color: "#0077b6",
                          }}
                        >
                          <FacebookRoundedIcon />
                        </IconButton>
                        <IconButton
                          className="pulse-effect"
                          aria-label="delete"
                          sx={{
                            backgroundColor: "#fff",
                            marginRight: "0.5rem",
                            color: "#0077b6",
                          }}
                        >
                          <InstagramIcon />
                        </IconButton>
                        <IconButton
                          className="pulse-effect"
                          aria-label="delete"
                          sx={{
                            backgroundColor: "#fff",
                            marginRight: "0.5rem",
                            color: "#0077b6",
                          }}
                        >
                          <TwitterIcon />
                        </IconButton>
                      </Box>
                    )}
                    <Box
                      component="div"
                      sx={{
                        display: "flex",
                        flexDirection: {
                          lg: "row",
                          md: "row",
                          sm: "row",
                          xs: "column",
                        },
                        mb: 2,
                        mt: env === "MoneyOddr" ? 7 : 3,
                        alignItems: env === "MoneyOddr" ? "center" : "left",
                        justifyContent: env === "MoneyOddr" ? "center" : "left",
                      }}
                    >
                      <PrimaryButton
                        variant="contained"
                        size="large"
                        sx={{
                          mr: { xs: env === "MoneyOddr" ? 0 : 2, md: 2 },
                          mb: { md: 0, xs: 2 },
                        }}
                        onClick={() => {
                          navigate("/login");
                        }}
                      >
                        Login Here
                      </PrimaryButton>
                      <SecondaryButton
                        variant="contained"
                        size="large"
                        className="button-red"
                        href={
                          env === "MoneyOddr"
                            ? ""
                            : "https://play.google.com/store/apps/details?id=com.paisaonmobile.cm.impsguru"
                        }
                        target="_blank"
                      >
                        Download App
                      </SecondaryButton>
                    </Box>
                  </div>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "left",
                      mt: 3,
                      mb: 10,
                    }}
                  >
                    <a
                      href="https://old.impsguru.com/index"
                      rel="noreferrer"
                      target="_blank"
                    >
                      {/* <Button className="visit-btn"> */}
                      Visit our old portal
                      <LaunchIcon sx={{ ml: 1 }} />
                      {/* </Button> */}
                    </a>
                  </Box>
                </Box>
              </Grid>

              <Grid
                md={6}
                sm={12}
                sx={{
                  display: { xs: "none", sm: "none", md: "block" },
                }}
              >
                <img
                  src={lp_illustration}
                  alt="illustration"
                  width="90%"
                  height="auto"
                  style={{
                    backgroundColor: getEnv() === "PaisaKart" ? "#fff" : "",
                    borderRadius: getEnv() === "PaisaKart" ? "50%" : "",
                  }}
                />
              </Grid>
            </Grid>
          </figure>
        </div>
      </div>

      <div className="slider-div">
        <div>
          <figure className="SliderCard">
            <img src={slider1} alt="slide1" width="100%" />
          </figure>
        </div>
      </div>
      <div className="slider-div">
        <div>
          <figure className="SliderCard">
            <img src={slider2} alt="slide1" width="100%" />
          </figure>
        </div>
      </div>
    </Slider>
  );
};

export default SimpleSlider;
