import { Button, Container, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import {
  aadharAtm_img,
  api,
  irctc_img,
  mobileR_img,
  mt,
  qrCode_img,
} from "../iconsImports";
import { primaryColor, getEnv } from "../theme/setThemeColor";
import StayCurrentPortraitIcon from "@mui/icons-material/StayCurrentPortrait";
import SatelliteAltIcon from "@mui/icons-material/SatelliteAlt";
import AodIcon from "@mui/icons-material/Aod";
import TrainIcon from "@mui/icons-material/Train";
import { useNavigate } from "react-router-dom";

const LandingServicesPage = () => {
  const envName = getEnv();
  const navigate = useNavigate();
  // useEffect(() => {
  //   window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  // }, []);
  return (
    <div
      className={envName === "MoneyOddr" ? "" : "builSecurity_bg"}
      sx={{ paddingBottom: "none !important" }}
      id="our-services"
    >
      <Grid xs={12} sm={6} className="servicePageBg1">
        <Box
          component="div"
          className="pageHead1"
          sx={{
            textAlign: "center",
            marginTop: "-3px",
          }}
        >
          Our Services
        </Box>
        {envName === "MoneyOddr" ? (
          <>
            <div className="landingPageSubHeading px-5">
              Unlock new possibilities for your business and boost your earnings
              with <span style={{ fontWeight: "900" }}>MoneyOddR</span>. <br />
              It is a single platform and a one stop solution offering multiple
              range of services
              <br /> which you can provide to your customer and maximise your
              earnings.
            </div>
          </>
        ) : (
          <>
            <div className="landingPageSubHeading">
              We have exciting services for you on our application
            </div>
          </>
        )}
      </Grid>
      {/* <Container maxWidth="lg" className="sectionBreake" sx={{ pb: 10 }}> */}
      <Container maxWidth="lg" sx={{ pb: 10, mt: 10 }}>
        <Grid container className="flex-hc-vc mb-5">
          <Grid
            md={2.7}
            className="icon-box"
            sx={{
              textAlign: "left",
              mb: { md: 0, sm: 2, xs: 2 },
              mt: { md: 0, sm: 3, xs: 3 },
            }}
          >
            <span className="icon">
              <StayCurrentPortraitIcon
                sx={
                  {

                    // color: secondaryColor(),
                    fontSize: "2.2rem",
                  }
                }
                className="actual-icon"
              />
            </span>
            <Typography className="icon-box-heading">
              Bill Payments & Recharges
            </Typography>
            <Typography className="box-para justify-content ">
              Earn more by doing DTH/ Mobile recharges, Utility bill payments,
              for your customers easily and quickly of more than 150 companies.
            </Typography>
          </Grid>
          <Grid
            md={2.7}
            className="icon-box"
            sx={{ textAlign: "left", mb: { md: 0, sm: 2, xs: 2 } }}
          >
            <span className="icon">
              <SatelliteAltIcon
                sx={{
                  // color: secondaryColor(),
                  fontSize: "2.2rem",
                }}
                className="actual-icon"
              />
            </span>
            <Typography className="icon-box-heading">DTH Recharge</Typography>
            <Typography className="box-para justify-content">
              With
              <span style={{ marginRight: "3px", marginLeft: "3px" }}>
                {envName === "MoneyOddr" ? "MoneyOddR" : "VistarMoney"}
              </span>
              merchant app, choose from a variety of operators like Airtel DTH,
              Dish TV, Videocon D2h.
            </Typography>
          </Grid>
          <Grid
            md={2.7}
            className="icon-box"
            sx={{ textAlign: "left", mb: { md: 0, sm: 2, xs: 2 } }}
          >
            <span className="icon">
              <AodIcon
                sx={{
                  // color: secondaryColor(),
                  fontSize: "2.2rem",
                }}
                className="actual-icon"
              />
            </span>
            <Typography className="icon-box-heading">
              Utility Recharge
            </Typography>
            <Typography className="box-para justify-content">
              Gone are the days when anyone used to stand in a long queue,
              waiting for hours just for filling their monthly bills namely
              Electricity, Water, and Gas.
            </Typography>
          </Grid>
          {/* <Grid
            md={2.7}
            className="icon-box"
            sx={{ textAlign: "left", mb: { md: 0, sm: 2, xs: 2 } }}
          >
            <span className="icon">
              <TrainIcon
                sx={{
                  // color: secondaryColor(),
                  fontSize: "2.2rem",
                }}
                className="actual-icon"
              />
            </span>
            <Typography className="icon-box-heading">Money Transfer</Typography>
            <Typography className="box-para justify-content">
              We are proud to say that we are Offering Instant and Secure
              Payment Soution to our Customer. Now Our Customers can do Instant
              Money Transfer from our portal
            </Typography>
          </Grid> */}
          {/* <Grid item md={12}>
            {" "}
            <img src={braj} alt="" />
          </Grid> */}
        </Grid>

        <Grid container maxWidth="lg" className="bottom2top">
          <Grid
            lg={6}
            md={6}
            sx={{ display: { md: "block", sm: "none", xs: "none" } }}
          >
            <img src={irctc_img} alt="irctc img " width="80%"></img>
          </Grid>
          {envName === "MoneyOddr" ? (
            <Grid md={6} lg={6} sm={12} xs={12} sx={{ mt: { md: 5, xs: 0 } }}>
              <span
                className="landingPageHeadings"
                style={{
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "start",
                }}
              >
                Travel Services
              </span>
              <Box
                style={{
                  width: "60px",
                  height: "10px",
                  backgroundColor:
                    envName === "MoneyOddr" ? "#01A0E2" : "#0077b6",
                }}
              ></Box>
              <div className="landing-bg_para" style={{ textAlign: "justify" }}>
                MoneyOddR offers you a comprehensive range of travel options,
                including flights, hotels, train, bus and vacation packages all
                in one convenient platform. With our user-friendly interface and
                reliable service partners you can effortlessly search, compare,
                and book the best deals as per your customer preferences.
              </div>
              <Box
                sx={{ display: "flex", justifyContent: "left", mt: 2, mb: 3 }}
              >
                <Button
                  // className="button-red"
                  sx={{
                    backgroundColor: "#FF7F50",
                    color: "#fff",
                  }}
                  onClick={() => {
                    navigate("/sign-up");
                  }}
                >
                  Signup now
                </Button>
              </Box>
            </Grid>
          ) : (
            <Grid md={6} lg={6} sm={12} xs={12} sx={{ mt: { md: 5, xs: 0 } }}>
              <span
                className="landingPageHeadings"
                style={{
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "start",
                }}
              >
                IRCTC Ticket Booking
              </span>
              <Box
                style={{
                  width: "60px",
                  height: "10px",
                  backgroundColor:
                    envName === "MoneyOddr" ? "#01A0E2" : primaryColor(),
                }}
              ></Box>
              <div className="s" style={{ textAlign: "justify" }}>
                {getEnv()} proud to say that we are one of the few vendors who
                are authorized from IRCTC to book train tickets. Now you can
                easily book tickets online for any train, class, or destination.
                With us, you don’t need to worry about the status of your
                booking because our service is highly fast, safe, simple and
                reliable. So before you miss on to your favorite berth, download
                our app today !
              </div>
              <Box
                sx={{ display: "flex", justifyContent: "left", mt: 2, mb: 3 }}
              >
                <Button
                  // className="button-red"
                  sx={{
                    backgroundColor: "#FF7F50",
                    color: "#fff",
                  }}
                  onClick={() => {
                    navigate("/sign-up");
                  }}
                >
                  Signup now
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>

        <Grid container maxWidth="lg" className="bottom2top">
          <Grid md={6} lg={6} sm={12} xs={12} sx={{ mt: { md: 5, xs: 0 } }}>
            <span
              className="landingPageHeadings"
              style={{
                textAlign: "left",
                display: "flex",
                justifyContent: "start",
              }}
            >
              My QR/UPI
            </span>
            <Box
              style={{
                width: "60px",
                height: "10px",
                backgroundColor:
                  envName === "MoneyOddr" ? "#01A0E2" : primaryColor(),
              }}
            ></Box>
            <div className="landing-bg_para" style={{ textAlign: "justify" }}>
              <span style={{ marginRight: "10px" }}>
                {getEnv() === "MoneyOddr" ? "MoneyOddR" : "VistarMoney"}
              </span>
              brings you one more attractive option of increasing your options
              of accepting payments in the form of QR codes or UPI. Basically QR
              code is a contactless payment service that enables your customers
              to simply scan a code from their smartphone and complete the
              transaction. The service is highly reliable, safe, and secure and
              the transaction is performed almost instantly.{" "}
            </div>
            <Box sx={{ display: "flex", justifyContent: "left", mt: 2, mb: 3 }}>
              <Button
                // className="button-red"
                sx={{
                  backgroundColor: "#FF7F50",
                  color: "#fff",
                }}
                onClick={() => {
                  navigate("/sign-up");
                }}
              >
                Signup now
              </Button>
            </Box>
          </Grid>
          <Grid
            lg={6}
            md={6}
            sx={{ display: { md: "block", sm: "none", xs: "none" } }}
          >
            <img src={qrCode_img} alt="qrCode img " width="80%"></img>
          </Grid>
        </Grid>
        {/* <Grid container maxWidth="lg" className="bottom2top">
          <Grid
            lg={6}
            md={6}
            sx={{ display: { md: "block", sm: "none", xs: "none" } }}
          >
            <img src={mt} alt="irctc" width="80%"></img>
          </Grid>
          {envName === "MoneyOddr" ? (
            ""
            // <Grid md={6} lg={6} sm={12} xs={12}>
            //   <span
            //     className="landingPageHeadings"
            //     style={{
            //       textAlign: "left",
            //       display: "flex",
            //       justifyContent: "start",
            //     }}
            //   >
            //     Domestic Money Transfer
            //   </span>
            //   <Box
            //     style={{
            //       width: "60px",
            //       height: "10px",
            //       backgroundColor:
            //         envName === "MoneyOddr" ? "#01A0E2" : primaryColor(),
            //     }}
            //   ></Box>
            //   <div className="landing-bg_para" style={{ textAlign: "justify" }}>
            //     Money Transfer is a facility through which money can be easily
            //     transferred to any account across india instantly without
            //     visiting the bank branch. This Service was introduced to help
            //     and support the unorganised and rural areas where the majority
            //     of the population are not aware of the banking system. With this
            //     facility you can help your local population to transfer their
            //     money to their designated account and earn attractive
            //     commission.
            //     <Box
            //       sx={{ display: "flex", justifyContent: "left", mt: 2, mb: 3 }}
            //     >
            //       <Button
            //         // className="button-red"
            //         sx={{
            //           backgroundColor: "#FF7F50",
            //           color: "#fff",
            //         }}
            //         onClick={() => {
            //           navigate("/sign-up");
            //         }}
            //       >
            //         Signup now
            //       </Button>
            //     </Box>
            //   </div>
            // </Grid>
          ) : (
            ""
            // <Grid md={6} lg={6} sm={12} xs={12}>
            //   <span
            //     className="landingPageHeadings"
            //     style={{
            //       textAlign: "left",
            //       display: "flex",
            //       justifyContent: "start",
            //     }}
            //   >
            //     Money Transfer
            //   </span>
            //   <Box
            //     style={{
            //       width: "60px",
            //       height: "10px",
            //       backgroundColor:
            //         envName === "MoneyOddr" ? "#01A0E2" : primaryColor(),
            //     }}
            //   ></Box>
            //   <div className="landing-bg_para" style={{ textAlign: "justify" }}>
            //     At {getEnv()} we understand your concerns and try to come up
            //     with solutions for addressing those issues. We realized that
            //     sending money to your friends and family was still a difficult
            //     task for many people and for solving that problem, we bring you
            //     the
            //     <span className="mx-1">{getEnv()}</span> money transfer feature.
            //     This can be used to send money anywhere across India and Nepal.
            //     It is highly safe, secure, and reliable
            //   </div>
            //   <Box
            //     sx={{ display: "flex", justifyContent: "left", mt: 2, mb: 3 }}
            //   >
            //     <Button
            //       // className="button-red"
            //       sx={{
            //         backgroundColor: "#FF7F50",
            //         color: "#fff",
            //       }}
            //       onClick={() => {
            //         navigate("/sign-up");
            //       }}
            //     >
            //       Signup now
            //     </Button>
            //   </Box>
            // </Grid>
          )}
        </Grid> */}
        <Grid container maxWidth="lg" className="bottom2top">
          {envName === "MoneyOddr" && (

            ""
            // <Grid md={6} lg={6} sm={12} xs={12}>
            //   <span
            //     className="landingPageHeadings"
            //     style={{
            //       textAlign: "left",
            //       display: "flex",
            //       justifyContent: "start",
            //     }}
            //   >
            //     AEPS
            //   </span>
            //   <Box
            //     style={{
            //       width: "60px",
            //       height: "10px",
            //       backgroundColor:
            //         envName === "MoneyOddr" ? "#01A0E2" : primaryColor(),
            //     }}
            //   ></Box>
            //   <div className="landing-bg_para" style={{ textAlign: "justify" }}>
            //     <span style={{ fontWeight: "900" }}>
            //       Aadhaar Enabled Payment System
            //     </span>
            //     is one of the major initiatives of Indian banking system by
            //     which a customer can use the banking services like Cash Deposit
            //     & Withdrawal, Balance Enquiry and Mini Statement etc. from their
            //     aadhaar linked bank account by using the biometric
            //     authentication. This service is majorly used in the area where
            //     either ATM(s) are Not available/Non Operative or by the people
            //     who are non active banking user(s). Join MoneyOddR today and
            //     make a difference in people's lives while growing your business.
            //   </div>
            //   <Box
            //     sx={{ display: "flex", justifyContent: "left", mt: 2, mb: 3 }}
            //   >
            //     <Button
            //       // className="button-red"
            //       sx={{
            //         backgroundColor: "#FF7F50",
            //         color: "#fff",
            //       }}
            //       onClick={() => {
            //         navigate("/sign-up");
            //       }}
            //     >
            //       Signup now
            //     </Button>
            //   </Box>
            // </Grid>
          ) 
          // : (
          //   <Grid md={6} lg={6} sm={12} xs={12}>
          //     <span
          //       className="landingPageHeadings"
          //       style={{
          //         textAlign: "left",
          //         display: "flex",
          //         justifyContent: "start",
          //       }}
          //     >
          //       Aadhar ATM
          //     </span>
          //     <Box
          //       style={{
          //         width: "60px",
          //         height: "10px",
          //         backgroundColor:
          //           envName === "MoneyOddr" ? "#01A0E2" : primaryColor(),
          //       }}
          //     ></Box>
          //     <div className="landing-bg_para" style={{ textAlign: "justify" }}>
          //       Are you fed up with the lengthy lines, computer issues, and lack
          //       of cash at your local bank branch. But stop worrying since
          //       {getEnv()} has a feature called Aadhar ATM that will instantly
          //       transform your everyday store into an ATM outlet. With us, you
          //       might offer your customers fundamental ATM services like cash
          //       withdrawal and balance inquiries.
          //     </div>
          //     <Box
          //       sx={{ display: "flex", justifyContent: "left", mt: 2, mb: 3 }}
          //     >
          //       <Button
          //         // className="button-red"
          //         sx={{
          //           backgroundColor: "#FF7F50",
          //           color: "#fff",
          //         }}
          //         onClick={() => {
          //           navigate("/sign-up");
          //         }}
          //       >
          //         Signup now
          //       </Button>
          //     </Box>
          //   </Grid>
          // )}
}
          {/* <Grid
            lg={6}
            md={6}
            sx={{ display: { md: "block", sm: "none", xs: "none" } }}
          >
            <img src={aadharAtm_img} alt="irctc" width="80%"></img>
          </Grid> */}
        </Grid>
        <Grid container maxWidth="lg" className="bottom2top">
          <Grid
            lg={6}
            md={6}
            sx={{ display: { md: "block", sm: "none", xs: "none" } }}
          >
            <img src={mobileR_img} alt="Mobile recharge" width="80%"></img>
          </Grid>
          {envName === "MoneyOddr" ? (
            <Grid md={6} lg={6} sm={12} xs={12}>
              <span
                className="landingPageHeadings"
                style={{
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "start",
                }}
              >
                Prepaid Mobile & DTH Recharges
              </span>
              <Box
                style={{
                  width: "60px",
                  height: "10px",
                  backgroundColor:
                    envName === "MoneyOddr" ? "#01A0E2" : primaryColor(),
                }}
              ></Box>
              <div className="landing-bg_para" style={{ textAlign: "justify" }}>
                MoneyOddR gives you the platform where you can find multiple
                operators and suitable plans for your customers and makes the
                recharge experience better than ever. Also MoneyOddR gives you
                the opportunity to earn a good commission on each recharge.
              </div>
              <Box
                sx={{ display: "flex", justifyContent: "left", mt: 2, mb: 3 }}
              >
                <Button
                  // className="button-red"
                  sx={{
                    backgroundColor: "#FF7F50",
                    color: "#fff",
                  }}
                  onClick={() => {
                    navigate("/sign-up");
                  }}
                >
                  Signup now
                </Button>
              </Box>
            </Grid>
          ) : (
            <Grid md={6} lg={6} sm={12} xs={12}>
              <span
                className="landingPageHeadings"
                style={{
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "start",
                }}
              >
                Mobile Recharge
              </span>
              <Box
                style={{
                  width: "60px",
                  height: "10px",
                  backgroundColor:
                    envName === "MoneyOddr" ? "#01A0E2" : primaryColor(),
                }}
              ></Box>
              <div className="landing-bg_para" style={{ textAlign: "justify" }}>
                Earn more by doing DTH/ Mobile recharges, Utility bill payments,
                for your customers easily and quickly of more than 150
                companies. Now help your customers by making bill payments and
                recharge at the snap of your fingertips with the help of the{" "}
                {getEnv()} Merchant App. {getEnv()} enables any retailer to make
                any recharge and bill payments associated with Electricity,
                Water, Gas, DTH, and Telecomm to name a few. Thereby, {getEnv()}{" "}
                converts any shop into a one-stop solution for any of the
                customer needs associating with bill payment and recharge.
              </div>
              <Box
                sx={{ display: "flex", justifyContent: "left", mt: 2, mb: 3 }}
              >
                <Button
                  // className="button-red"
                  sx={{
                    backgroundColor: "#FF7F50",
                    color: "#fff",
                  }}
                  onClick={() => {
                    navigate("/sign-up");
                  }}
                >
                  Signup now
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
        <Grid container maxWidth="lg" className="bottom2top">
          <Grid md={6} lg={6} sm={12} xs={12}>
            <span
              className="landingPageHeadings"
              style={{
                textAlign: "left",
                display: "flex",
                justifyContent: "start",
              }}
            >
              API banking
            </span>
            <Box
              style={{
                width: "60px",
                height: "10px",
                backgroundColor: primaryColor(),
              }}
            ></Box>
            <div className="landing-bg_para" style={{ textAlign: "justify" }}>
              An intuitive, simple-to-implement, and iterative modern API
              banking stack. has been built with scalability and dependability
              in mind.An great banking tool, API banking simplifies the process
              of doing online banking through your website. Simply integrate the
              system into your backend ERP to begin doing balance inquiries,
              {/* money transfers, */}
               and other financial operations on our platform!
            </div>
            <Box sx={{ display: "flex", justifyContent: "left", mt: 2, mb: 3 }}>
              <Button
                // className="button-red"
                sx={{
                  backgroundColor: "#FF7F50",
                  color: "#fff",
                }}
                onClick={() => {
                  navigate("/sign-up");
                }}
              >
                Signup now
              </Button>
            </Box>
          </Grid>
          <Grid
            lg={6}
            md={6}
            sx={{ display: { md: "block", sm: "none", xs: "none" } }}
          >
            <img src={api} alt="Mobile recharge" width="80%"></img>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default LandingServicesPage;
