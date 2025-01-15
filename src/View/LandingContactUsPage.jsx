import {
  Button,
  Card,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  TextField,
  } from "@mui/material";
import React, { useEffect, useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box } from "@mui/system";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import EmailIcon from "@mui/icons-material/Email";
import { PATTERNS } from "../utils/ValidationUtil";
import PhoneIcon from '@mui/icons-material/Phone'; // Import the mobile icon
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import BusinessIcon from '@mui/icons-material/Business';
import {
  primaryColor,
  getEnv,
  getFirmAddress,
  getFirmContact,
  getFirmEmail,
  primaryLight,
} from "../theme/setThemeColor";

const LandingContactUsPage = () => {
  const [isEmailv, setIsEmailv] = useState(true);
  const [isMobv, setIsMobv] = useState(true);
  const [name, setName] = useState("");

  const isLetters = (str) => /^[A-Za-z]*$/.test(str);

  const onInputChange = (e) => {
    const { value } = e.target;
    if (isLetters(value)) {
      setName(value);
    }
  };

  const envValue = getEnv();
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    let data;

    data = {
      first_name: form.c_fname.value,
      mobile: form.c_mobile.value,
      email: form.c_email.value,
      city: form.c_city.value,
      company: form.c_company.value,
      message: form.c_message.value,
    };
    console.log(data);
  };
  useEffect(() => {
    // 👇️ scroll to top on page load
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div id="contact-us">
    <div className={envValue !== "MoneyOddr" && "builSecurity_bg"}>
      {envValue !== "MoneyOddr" && (
        <Grid xs={12} className="servicePageBg">
          {/* <Box component="div" className="pageHead" sx={{ textAlign: "center", mt: 7 }}>
            Contact Us!
          </Box> */}
        </Grid>
      )}
      <Grid container>
        <Container maxWidth="lg">
          {envValue !== "MoneyOddr" && (
            <Grid container spacing={3} sx={{ mt: { lg: 5, md: 18, sm:0 ,xs: 0 } }}>
              <Grid item lg={7} md={7} sm={12} xs={12}>
                <Box className="landingPageHeadings">Reach out to us!</Box>
                <Box
                  component="form"
                  id="contact"
                  sx={{ width: "100%", padding: 3, borderRadius: 2, boxShadow: 3 }}
                  onSubmit={handleSubmit}
                >
                  <Grid container spacing={2}>
                    <Grid item lg={12} sm={12} xs={12}>
                      <FormControl fullWidth variant="outlined">
                        <TextField
                          autoComplete="off"
                          id="c_fname"
                          placeholder="Full Name"
                          variant="outlined"
                          type="text"
                          value={name}
                          onChange={onInputChange}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ bgcolor: 'white' }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item lg={12}sm={12} xs={12}>
                      <FormControl fullWidth variant="outlined">
                        <TextField
                          autoComplete="off"
                          id="c_mobile"
                          placeholder="Mobile Number"
                          variant="outlined"
                          error={!isMobv}
                          required
                          helperText={!isMobv ? "Enter a valid mobile" : ""}
                          onChange={(e) => {
                            setIsMobv(PATTERNS.MOBILE.test(e.target.value));
                            if (e.target.value === "") setIsMobv(true);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "+" || e.key === "-") {
                              e.preventDefault();
                            }
                            if (e.target.value.length === 10 && e.key.toLowerCase() !== "backspace") {
                              e.preventDefault();
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ bgcolor: 'white' }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item lg={12} sm={12} xs={12}>
                      <FormControl fullWidth variant="outlined">
                        <TextField
                          autoComplete="off"
                          id="c_email"
                          placeholder="Email Id"
                          variant="outlined"
                          error={!isEmailv}
                          required
                          helperText={!isEmailv ? "Enter a valid email" : ""}
                          onChange={(e) => {
                            setIsEmailv(PATTERNS.EMAIL.test(e.target.value));
                            if (e.target.value === "") setIsEmailv(true);
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ bgcolor: 'white' }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item lg={12} sm={12} xs={12}>
                      <FormControl fullWidth variant="outlined">
                        <TextField
                          autoComplete="off"
                          id="c_city"
                          placeholder="City"
                          variant="outlined"
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationCityIcon />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ bgcolor: 'white' }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item lg={12} sm={12} xs={12}>
                      <FormControl fullWidth variant="outlined">
                        <TextField
                          autoComplete="off"
                          id="c_company"
                          placeholder="Company/Organization"
                          variant="outlined"
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <BusinessIcon />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ bgcolor: 'white' }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item lg={12} sm={12} xs={12}>
                      <FormControl fullWidth variant="outlined">
                        <TextField
                          autoComplete="off"
                          multiline
                          id="c_message"
                          placeholder="Your Message"
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <MessageIcon />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ bgcolor: 'white' }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      width: "100%",
                      mt: 3,
                      padding:"10px",
                      // bgcolor: 'primary.main',
                      // '&:hover': {
                      //   bgcolor: 'primary.dark',
                      // },
                      backgroundColor:"#009688",
                      '&:hover': {
                        bgcolor: "#009688",
                       },
                      borderRadius: 2,
                      boxShadow: 2,
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              </Grid>
              <Grid 
  item 
  lg={5} 
  md={5} 
  sm={12} 
  xs={12} 
  sx={{ 
    display: { md: "block", xs: "none" }, 
    mt: 4,
    animation: 'slideInFromRight 1.5s ease-in-out' // Apply animation here
  }}
>
  <Grid container spacing={3}>
    {/* Card 1 */}
    <Grid item xs={12}>
      <Card
        sx={{
          width: "100%",
          borderRadius: "12px",
          textAlign: "center",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 10px 50px",
          transition: "transform 0.3s, box-shadow 0.3s",
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.15)",
          }
        }}
      >
        <LocationOnIcon sx={{ color:"#319B88", fontSize: "2rem", mt: 2 }} />
        <div className="landing-bg_para" style={{ fontWeight: 500, textAlign:"center" }}>
          OUR MAIN OFFICE
        </div>
        <Box component="div" sx={{ color: "#000", p: 2, backgroundColor: "#A3C8B4", height: "100px" }}>
          {getFirmAddress()}
        </Box>
      </Card>
    </Grid>
    {/* Card 2 */}
    <Grid item xs={12}>
      <Card
        sx={{
          width: "100%",
          borderRadius: "12px",
          textAlign: "center",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 10px 50px",
          transition: "transform 0.3s, box-shadow 0.3s",
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.15)",
          }
        }}
      >
        <PhoneAndroidIcon sx={{ color: "#319B88", fontSize: "2rem", mt: 2 }} />
        <div className="landing-bg_para" style={{ fontWeight: 500, textAlign:"center" }}>
          PHONE NUMBER
        </div>
        <Box component="div" sx={{ color: "#000", p: 2, backgroundColor: "#A3C8B4", height: "100px" }}>
          {getFirmContact()}
        </Box>
      </Card>
    </Grid>
    {/* Card 3 */}
    <Grid item xs={12}>
      <Card
        sx={{
          width: "100%",
          borderRadius: "12px",
          textAlign: "center",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 10px 50px",
          transition: "transform 0.3s, box-shadow 0.3s",
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.15)",
          }
        }}
      >
        <EmailIcon sx={{ color: "#319B88", fontSize: "2rem", mt: 2 }} />
        <div className="landing-bg_para" style={{ fontWeight: 500, textAlign:"center" }}>
          EMAIL
        </div>
        <Box component="div" sx={{ color: "#000", p: 2, backgroundColor: "#A3C8B4", height: "100px" }}>
          {getFirmEmail()}
        </Box>
      </Card>
    </Grid>
  </Grid>
</Grid>

            </Grid>
          )}
        </Container>
      </Grid>
    </div>
  </div>
  
  
  );
};

export default LandingContactUsPage;
