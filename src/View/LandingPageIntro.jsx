import { Box, Container, Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import { PrimaryButton } from "../theme/Theme";
import { lp_illustration } from "../iconsImports";
import { useNavigate } from "react-router-dom";
import { getEnv } from "../theme/setThemeColor";
import { useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
const LandingPageIntro = () => {
  const navigate = useNavigate();
  const [env, setEnv] = useState(getEnv());

  return (
    <Box
      className="landing-bg"
      id="landing-intro"
      sx={{
        backgroundColor: "#84b067",
        backgroundSize: { md: "cover", xs: "contain" },
        color: "#fff",
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          xs={12}
          sx={{ px: { md: 8, sm: 2, xs: 1 }, alignItems: "center" }}
        >
          <Grid
            item
            md={env === "DilliPay" || env === "PaisaKart" ? 6 : 12}
            sm={12}
          >
            <Box
              sx={{
                mt: { xs: 10, md: 10 },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <h1
                style={{
                  fontSize: "3rem",
                  fontWeight: 700,
                }}
              >
                Fast , Secure , and
                <br />
                <span style={{ color: "#FFD700", fontSize: "3.2" }}>
                  Effortless
                </span>{" "}
                Payment.
              </h1>

              {process.env.REACT_APP_TITLE === "MoneyOddr" ? (
                <div className="mt-4">
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
                </div>
              ) : (
                <div>
                  <p
                    style={{
                      fontSize: "1.3rem",
                      marginTop: "2rem",
                      textAlign: "justify",
                    }}
                  >
                    <b>{env === "DilliPay" ? "DilliPay" : "PaisaKart"}</b> is
                    designed to simplify and secure online transactions for
                    businesses and individuals.
                  </p>
                  <p
                    style={{
                      fontSize: "1.3rem",
                      marginTop: "1.1rem",
                      textAlign: "justify",
                    }}
                  >
                    One of the fastest growing names in Indian Recharge industry
                    that is recognized for providing the best Recharge services
                    at High success Ratio.
                  </p>
                </div>
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
                  mt: 4,
                  alignItems: env === "MoneyOddr" ? "center" : "left",
                  justifyContent: env === "MoneyOddr" ? "center" : "left",
                }}
              >
                <PrimaryButton
                  variant="contained"
                  size="small"
                  sx={{
                    mr: { xs: 0, md: 2 },
                    mb: { md: 0, xs: 2 },
                    borderRadius: "8px",
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Get Started{" "}
                  <ArrowForwardIcon sx={{ ml: 1, fontWeight: "bold" }} />
                </PrimaryButton>
              </Box>
            </Box>
          </Grid>

          {env !== "MoneyOddr" && (
            <Grid
              item
              md={6}
              sm={12}
              sx={{ display: { xs: "none", sm: "none", md: "block" }, mt: 10 }}
            >
              <img
                src={lp_illustration}
                alt="illustration"
                width="100%"
                height="auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                style={{
                  backgroundColor: getEnv() === "PaisaKart" ? "#fff" : "",
                  borderRadius: getEnv() === "PaisaKart" ? "50%" : "",
                }}
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPageIntro;
