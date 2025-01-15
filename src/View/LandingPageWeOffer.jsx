import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useNavigate } from "react-router-dom";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const LandingPageWeOffer = () => {
  const navigate = useNavigate();
  const weOffer = [
    {
      icon: <MobileFriendlyIcon />,
      head: "BILL PAYMENT ",
      para: "Pay your bills through various methods,including credit/debit cards,bank transfers,and digital wallets.Choose the option that works best for you.",
    },
    {
      icon: <MobileFriendlyIcon />,
      head: "RECHARGES ",
      para: " Instantly recharge your prepaid mobile plans across all major carriers. Choose the amount and pay securely, ensuring you're always connected.",
    },
    // {
    //   icon: <AccountBalanceIcon />,
    //   head: "BANKING",
    //   para: "We offer new account opening (axis bank),Indo-Nepal remittances, account deposit, withdrawal, balance enquiry, bulk transfer, payout solution. ",
    // },
    {
      icon: <VolunteerActivismIcon />,
      head: "INSURANCE",
      para: "Get the best quote for your insurance requirements for life, health & vehicle insurance. Merchants can earn competitive commission on each policy booking.",
    },
    {
      icon: <ReceiptIcon />,
      head: "UTILITY",
      para: "Instant update all your utility bill payments including electricity, water & gas bills, credit card bills, EMI installments, wallet top-ups.",
    },
    // {
    //   icon: <MonetizationOnIcon />,
    //   head: "MONEY TRANSFER",
    //   para: "Send money instantly to friends, family, or businesses locally or internationally. Enjoy real-time processing that ensures your funds reach their destination quickly.",
    // },
  ];

  return (
    <Box sx={{ background: "#E5F6DF", py: 5 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                mb: 2,
                color: "#319b88", // Teal
                textTransform: "uppercase",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              What We Offer
            </Typography>
            {/* <Typography
              variant="h5"
              sx={{
                mt: 1,
                color: "#333",
                fontStyle: "italic",
                fontWeight: "400",
              }}
            >
              A consumer-friendly solution for mobile recharge, money transfer,
              and bill paying
            </Typography> */}
            <Typography
              variant="body1"
              sx={{
                mt: 2,
                color: "#555",
                textAlign: "justify",
                lineHeight: 1.6,
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              Open a savings account, buy stocks and mutual funds, pay your
              bills, recharge, reserve flights and movie tickets, and much more.
              With us anyone can be paid anywhere. Pay securely and without a
              card in person or online with the Paytm Wallet or directly from
              your bank account.
               {/* You can also send and receive money from
              anyone. */}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {weOffer.map((item, index) => (
                <Grid item xs={12} sm={6} md={6} key={index}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: "16px",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                      transition: "0.3s",
                      "&:hover": {
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
                        transform: "translateY(-10px)",
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: "center" }}>
                      <Box
                        sx={{
                          backgroundColor: "#319b88", // Teal
                          width: "70px",
                          height: "70px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 16px",
                          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <span style={{ color: "white", fontSize: "2rem" }}>
                          {item.icon}
                        </span>
                      </Box>
                      <Typography
                        sx={{
                          mb: 1.5,
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                          color: "#fc4a1a", // Orange
                        }}
                      >
                        {item.head}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#555", textAlign: "center" }}
                      >
                        {item.para}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center", mb: 2 }}>
                      <Button
                        onClick={() => {
                          navigate("/our-services");
                        }}
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          color: "#319b88", // Teal
                          backgroundColor: "white",
                          borderRadius: "8px",
                          padding: "8px 16px",
                          border: `2px solid #319b88`, // Teal border
                          transition: "background-color 0.3s, color 0.3s",
                          "&:hover": {
                            backgroundColor: "#fc4a1a", // Orange on hover
                            color: "white", // White text on hover
                          },
                        }}
                      >
                        Learn More
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPageWeOffer;
