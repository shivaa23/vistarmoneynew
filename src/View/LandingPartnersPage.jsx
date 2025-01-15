import { Box, Button, Card, Grid } from "@mui/material";
import { Container } from "@mui/system";
import React, { useEffect } from "react";
import { joinus, joinus2 } from "../iconsImports";
import { useNavigate } from "react-router-dom";
import { getEnv } from "../theme/setThemeColor";

const LandingPartnersPage = () => {
  const envValue = getEnv();
  const navigate = useNavigate();
  useEffect(() => {
    // 👇️ scroll to top on page load
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <div id="our-partners">
        <Container maxWidth="lg">
          <Grid
            container
            xs={12}
            className={envValue === "MoneyOddr" ? "" : "sectionBreake"}
          >
            <Grid lg={6} md={6} className="shapedBg">
              <div className="landing-bg_main_font">
                Join
                <span style={{ marginLeft: "10px", marginRight: "10px" }}>
                  {getEnv() === "MoneyOddr" ? "MoneyOddR" : "DilliPay"}
                </span>
                Network & Expand your Distributor Business & Earn Extra Income
              </div>
              <Box className="d-flex justify-content-center">
                <Button
                  className="button-purple"
                  sx={{
                    width: "200px",
                    p: 1,
                    mt: 5,
                    display: "block",
                    fontSize: "18px",
                  }}
                  onClick={() => {
                    navigate("/sign-up");
                  }}
                >
                  Join Now
                </Button>
              </Box>

              {/* <Box
                component="div"
                sx={{
                  width: "100px",
                  height: "12px",
                  backgroundColor: "#dc5f5f",
                }}
              ></Box> */}
            </Grid>

            <Grid
              lg={6}
              md={6}
              sx={{ display: "flex", textalign: "center" }}
              className="top2Bottom"
            >
              <img src={joinus} alt="Join us" width="100%"></img>
            </Grid>
          </Grid>
        </Container>

        <div
          className={
            envValue === "MoneyOddr" ? "" : "body_Wave_bg sectionBreake"
          }
        >
          <Container maxWidth="lg" sx={{ py: 5 }}>
            {/* <Grid container>
              <Grid 
                lg={4}
                md={4}
                sm={12}
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  sx={{
                    width: "90%",
                    mr: 1,
                    py: 4,
                    mt: { lg: 0, md: 0, sm: 3, xs: 3 },
                    boxShadow:
                      "rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em",
                  }}
                >
                  <Box
                    sx={{
                      width: "70px",
                      margin: "0 auto",
                      display: "flex",
                      justifyContent: "center",
                      height: "70px",
                      borderRadius: "50%",
                      backgroundColor: "#dc5f5f36",
                    }}
                  >
                    <StorefrontIcon
                      sx={{
                        color: " #dc5f5f",
                        marginTop: "15px",
                        fontSize: "3rem",
                        mr: 2,
                      }}
                    />
                    <span className="landing-bg_main_font">5000+</span>
                  </Box>
                  <Box className="landingPageSubHeading" sx={{ mt: 2 }}>
                    Merchants
                  </Box>
                </Card>
              </Grid>
              <Grid
                lg={4}
                md={4}
                sm={12}
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  sx={{
                    width: "90%",
                    mt: { lg: 0, md: 0, sm: 3, xs: 3 },
                    mr: 1,
                    py: 4,
                    boxShadow:
                      "rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em",
                  }}
                >
                  <Box
                    sx={{
                      width: "70px",
                      margin: "0 auto",
                      display: "flex",
                      justifyContent: "center",
                      height: "70px",
                      borderRadius: "50%",
                      backgroundColor: "#dc5f5f36",
                    }}
                  >
                    <GroupAddIcon
                      sx={{
                        color: "#dc5f5f",
                        marginTop: "15px",
                        fontSize: "3rem",
                        mr: 2,
                      }}
                    />
                    <span className="landing-bg_main_font">11Lakh+</span>
                  </Box>
                  <Box className="landingPageSubHeading" sx={{ mt: 2 }}>
                    Customers
                  </Box>
                </Card>
              </Grid>
              <Grid
                lg={4}
                md={4}
                sm={12}
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  sx={{
                    width: "90%",
                    mt: { lg: 0, md: 0, sm: 3, xs: 3 },
                    mr: 1,
                    py: 4,
                    boxShadow:
                      "rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em",
                  }}
                >
                  <Box
                    component="div"
                    sx={{
                      width: "70px",
                      margin: "0 auto",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      height: "70px",
                      borderRadius: "50%",
                      backgroundColor: "#dc5f5f36",
                    }}
                  >
                    <ApartmentIcon
                      sx={{
                        color: "#dc5f5f",
                        marginTop: "15px",
                        fontSize: "3rem",
                        mr: 2,
                      }}
                    />
                    <div className="landing-bg_main_font">500+</div>
                  </Box>
                  <Box
                    component="div"
                    className="landingPageSubHeading"
                    sx={{ mt: 2 }}
                  >
                    City
                  </Box>
                </Card>
              </Grid>
            </Grid> */}

            <Grid container xs={12} className="sectionBreake">
              <Grid
                item
                lg={4}
                md={4}
                sm={12}
                xs={12}
                className="sectionBreake"
              >
                <div
                  className="landingPageHeadings "
                  style={{
                    textAlign: "left",
                  }}
                >
                  Why become a
                  <span style={{ marginLeft: "10px", marginRight: "10px" }}>
                    {getEnv() === "MoneyOddr" ? "MoneyOddR" : "DilliPay"}
                  </span>
                  Retailer ?
                </div>
                <Box
                  component="div"
                  sx={{
                    width: "100px",
                    height: "12px",
                    backgroundColor: "#dc5f5f",
                  }}
                ></Box>
                <div
                  className="landing-bg_para"
                  style={{ textAlign: "justify" }}
                >
                  {getEnv()} has always been Vocal for the Local shopkeepers.
                  Through {getEnv()}, more than 4,00,000 retailers have served
                  around 3crore unique customers in 2,300+ cities. {getEnv()}
                  has increased retailers monthly earning as well as customer's
                  footfall.
                </div>
              </Grid>
              <Grid
                item
                lg={4}
                md={4}
                sm={12}
                xs={12}
                className="sectionBreake top2Bottom"
                sx={{ pl: { lg: 3, md: 3, sm: 3, xs: 3 } }}
              >
                <Card
                  className="cards"
                  sx={{
                    width: "80%",
                    height: envValue !== "MoneyOddr" ? "120px" : "auto",

                    ml: 3,
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                    backgroundColor:
                      envValue === "MoneyOddr" ? "#202E56" : "#dc5f5f",
                    color: "#fff",
                    // boxShadow:
                    //   "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
                  }}
                >
                  <strong>
                    Become Aatmanirbhar Dukaandar and earn Rs.16,000 extra every
                    month
                  </strong>
                </Card>
                <Card
                  className="cards"
                  sx={{
                    width: "80%",
                    height: envValue !== "MoneyOddr" ? "120px" : "auto",

                    ml: 3,
                    px: 1,
                    display: "flex",
                    alignItems: "center",
                    mt: 3,
                    backgroundColor: "#fff",
                    color: "#000",
                    boxShadow:
                      "rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em",
                  }}
                >
                  <Box component="div" sx={{ color: "#fff", fontWeight: 600 }}>
                    No charges to use {getEnv()} Service
                  </Box>
                </Card>
                <Card
                  className="cards"
                  sx={{
                    width: "80%",
                    height: envValue !== "MoneyOddr" ? "120px" : "auto",
                    ml: 3,
                    mt: 3,
                    px: 1,
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    color: "#000",
                    boxShadow:
                      "rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em",
                  }}
                >
                  <Box component="div" sx={{ color: "#fff", fontWeight: 600 }}>
                    Earn token on every transaction, which helps in boosting
                    their earnings
                  </Box>
                </Card>
              </Grid>
              <Grid
                className="top2Bottom"
                lg={4}
                md={4}
                sm={12}
                xs={12}
                sx={{ pl: { lg: 0, md: 0, sm: 3, xs: 3 } }}
              >
                <Card
                  className="cards"
                  sx={{
                    width: "80%",
                    height: envValue !== "MoneyOddr" ? "120px" : "auto",
                    ml: 3,
                    mt: 3,
                    display: "flex",
                    alignItems: "center",
                    px: 1,
                    backgroundColor: "#fff",
                    color: "#000",
                    boxShadow:
                      "rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em",
                  }}
                >
                  <Box component="div" sx={{ color: "#fff", fontWeight: 600 }}>
                    Our Platform is Easy, Fast & Secure to use
                  </Box>
                </Card>
                <Card
                  className="cards"
                  sx={{
                    width: "80%",
                    height: envValue !== "MoneyOddr" ? "120px" : "auto",
                    ml: 3,
                    mt: 3,
                    px: 1,
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    color: "#000",
                    boxShadow:
                      "rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em",
                  }}
                >
                  <Box component="div" sx={{ color: "#fff", fontWeight: 600 }}>
                    Earn token on every transaction, which helps in boosting
                    their earnings
                  </Box>
                </Card>

                <Card
                  className="cards"
                  sx={{
                    width: "80%",
                    height: envValue !== "MoneyOddr" ? "120px" : "auto",
                    ml: 3,
                    px: 1,
                    display: "flex",
                    alignItems: "center",
                    mt: 3,
                    backgroundColor: "#fff",
                    color: "#000",
                    boxShadow:
                      "rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em",
                  }}
                >
                  <Box component="div" sx={{ color: "#fff", fontWeight: 600 }}>
                    All services in One App Loan facility available for
                    retailers
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </div>

        <div
          style={{
            backgroundColor: envValue === "MoneyOddr" ? "#e8f4fa" : "#CDC9FF",
          }}
        >
          <Container maxWidth="lg" sx={{ pb: 10 }}>
            <Grid container xs={12}>
              <Grid
                md={7}
                lg={7}
                sm={12}
                xs={12}
                className="sectionBreake"
                sx={{ pt: 3, px: 3 }}
              >
                <div
                  className="landingPageHeadings"
                  style={{ textAlign: "left" }}
                >
                  Why become a {getEnv()} Distributor ?
                </div>
                <Box
                  component="div"
                  sx={{
                    width: "100px",
                    height: "12px",
                    backgroundColor: "#dc5f5f",
                  }}
                ></Box>
                {envValue === "MoneyOddr" ? (
                  <Box
                    className="landing-bg_para"
                    sx={{
                      textAlign: "justify",
                      width: {
                        lg: "100%",
                        md: "100%",
                        sm: "100%",
                        xs: "100%",
                      },
                    }}
                  >
                    <Box
                      className="landing-bg_para"
                      sx={{
                        textAlign: "justify",
                        width: {
                          lg: "100%",
                          md: "100%",
                          sm: "100%",
                          xs: "100%",
                        },
                      }}
                    >
                      Join us as a Distributor and transform your retailer
                      network into a powerhouse of success. MoneyOddR is your
                      gateway to the future of digital banking, offering
                      unparalleled opportunities for growth and financial
                      empowerment. Say goodbye to costly investments, physical
                      stores, and staffing concerns. With our platform, your
                      retailers can provide essential financial services like
                      money transfer, recharges, bill payment and AEPS services
                      to customers, and both you and your retailers can earn
                      attractive commissions. We provide comprehensive training
                      and support, ensuring your retailers make the most of our
                      cutting-edge technology. Embrace the digital revolution,
                      revolutionise your business, and start your journey of
                      increased earnings while empowering others. Join us today
                      and unlock a world of possibilities.
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "left",
                        mt: 2,
                        mb: 3,
                      }}
                    >
                      <Button
                        className="button-purple"
                        onClick={() => {
                          navigate("/sign-up");
                        }}
                      >
                        Join us Now
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    className="landing-bg_para"
                    sx={{
                      textAlign: "justify",
                      width: {
                        lg: "80%",
                        md: "80%",
                        sm: "100%",
                        xs: "100%",
                      },
                    }}
                  >
                    We at {getEnv()} intend to improve our distributors earning
                    potential by enabling them to grow their business and make
                    the best out of their retail network with
                    {getEnv()}
                    services Not only the {getEnv()} Distributor, but any
                    distributor can download the distributor1 app. It will help
                    you make your daily business easy and effective. Our
                    Distributors not only have easy access to manage their KHATA
                    but also all the retailers under them. They can check the
                    retailer’s performances and identify the high and low
                    performers.
                    {getEnv()} Distributors have easy & convenient access to buy
                    and sell all the service kits at the tap of a button and
                    also transfer the balance to their retailers
                  </Box>
                )}
              </Grid>
              <Grid md={5} lg={5} sm={12} xs={12} className="sectionBreake">
                <img src={joinus2} alt="become distributor" width="90%" />
              </Grid>
            </Grid>
          </Container>
        </div>
      </div>
    </>
  );
};

export default LandingPartnersPage;
