import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import LogoComponent from "./LogoComponent";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import { Email, LegendToggleRounded, Phone } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { datemonthYear } from "../utils/DateUtils";
import PrintIcon from "@mui/icons-material/Print";

export const UtilityReceipt = () => {
  const [isLarge, setIsLarge] = useState(true);
  const location = useLocation();
  let queryParams = new URLSearchParams(location.search);
  // queryParams = queryParams.data;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
        <Button
          variant={isLarge ? "contained" : "outlined"}
          onClick={() => setIsLarge(true)}
        >
          Large Receipt
        </Button>
        <Button
          variant={!isLarge ? "contained" : "outlined"}
          onClick={() => setIsLarge(false)}
        >
          Small Receipt
        </Button>
      </Box>
      {isLarge ? (
        <Box
          sx={{
            margin: "auto",
            position: "relative",
            width: { xs: "95%", sm: "90%", md: "80%" },
          }}
        >
          <Box
            sx={{
              padding: "15px",
              margin: "auto",
              borderRadius: "10px",
              backgroundColor: "#F5FFF5",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <Grid container spacing={2} alignItems="flex-start">
              <Grid item xs={8} md={9}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "4px",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      // alignItems: "center",
                      gap: "3px",
                      fontSize: { xs: "10px", sm: "12px", md: "14px" },
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: "13px", sm: "15px" },
                        height: { xs: "13px", sm: "15px" },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#D13C0B",
                        borderRadius: "50%",
                      }}
                    >
                      <FmdGoodIcon
                        sx={{
                          color: "white",
                          fontSize: { xs: "8px", sm: "10px" },
                        }}
                      />
                    </Box>
                    <p
                      style={{
                        color: "#318CE7",
                        fontSize: "inherit",
                      }}
                    >
                      Plot No.5 , Second Floor ,Pocket-5, Rohini Sector 24, New
                      Delhi 110085
                    </p>
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: { xs: "10px", sm: "12px", md: "14px" },
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: "13px", sm: "15px" },
                        height: { xs: "13px", sm: "15px" },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#D13C0B",
                        borderRadius: "50%",
                      }}
                    >
                      <Email
                        sx={{
                          color: "white",
                          fontSize: { xs: "8px", sm: "10px" },
                        }}
                      />
                    </Box>
                    <p
                      style={{
                        color: "#318CE7",
                        fontSize: "inherit",
                      }}
                    >
                      Email: support@VistarMoney.com
                    </p>
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                      fontSize: { xs: "10px", sm: "12px", md: "14px" },
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: "13px", sm: "15px" },
                        height: { xs: "13px", sm: "15px" },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#D13C0B",
                        borderRadius: "50%",
                      }}
                    >
                      <Phone
                        sx={{
                          color: "white",
                          fontSize: { xs: "8px", sm: "10px" },
                        }}
                      />
                    </Box>
                    <p
                      style={{
                        color: "#318CE7",
                        fontSize: "inherit",
                      }}
                    >
                      Phone: 9355128199
                    </p>
                  </Typography>
                </Box>
              </Grid>

              <Grid
                item
                xs={4}
                md={3}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                }}
              >
                <LogoComponent
                  sx={{
                    width: "110px",
                  }}
                />
              </Grid>
            </Grid>

            <Typography
              sx={{
                textAlign: "center",
                mt: 1.5,
                fontSize: "20px",
                fontWeight: "bold",
                color: "#327B2E",
              }}
            >
              Receipt
            </Typography>
          </Box>

          <Box className="reciept_watermark" sx={{ mt: 2 }}>
            <Grid container spacing={2} sx={{ py: 6.5 }}>
              <Grid container item xs={12}>
                {["Operator", "Bill Number", "Mobile No:", "Date & Time:"].map(
                  (label, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", textAlign: "center" }}
                      >
                        {label}
                      </Typography>
                    </Grid>
                  )
                )}
              </Grid>

              <Grid container item xs={12}>
                {[
                  queryParams.get("operator"),
                  queryParams.get("mobile_no"),
                  queryParams.get("mobile_no"),
                  datemonthYear(queryParams.get("date_time")),
                ].map((data, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <Typography variant="body1" sx={{ textAlign: "center" }}>
                      {data}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Box
              sx={{
                padding: "13px",
                borderRadius: "5px",
              }}
            >
              <Grid
                container
                spacing={2}
                sx={{
                  marginBottom: "20px",
                  mt: 1.5,
                  border: "0.5px solid #000",
                  borderRadius: "10px",
                }}
              >
                <Grid container item xs={12}>
                  {["Transaction Id", "UTR NO", "Amount", "Status"].map(
                    (label, index) => (
                      <Grid item xs={6} sm={3} key={index}>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          {label}
                        </Typography>
                      </Grid>
                    )
                  )}
                </Grid>

                <Grid container item xs={12}>
                  {[
                    queryParams.get("Transaction_Id"),
                    queryParams.get("UTR_NO"),
                    queryParams.get("Amount"),
                    queryParams.get("Status"),
                  ].map((data, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <Typography variant="body1" sx={{ textAlign: "center" }}>
                        {data}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={
                    <PrintIcon
                      sx={{
                        width: "20px",
                      }}
                    />
                  }
                  onClick={() => {
                    window.print();
                  }}
                  sx={{
                    backgroundColor: "#1E88E5",
                    display: "flex",

                    color: "#fff",
                    padding: "1px 5px",
                    borderRadius: "8px",
                    fontWeight: 50,
                    fontSize: "15px",
                    "&:hover": {
                      backgroundColor: "#1565C0",
                    },
                    "@media print": {
                      display: "none",
                    },
                  }}
                >
                  Print
                </Button>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              padding: "18px",
              margin: "auto",
              backgroundColor: "#F5FFF5",
              fontFamily: "Arial, sans-serif",
              mt: 1,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                mt: 1,
                fontWeight: "bold",
                color: "#327B2E",
              }}
            >
              VistarMoney: Your Trusted Bill Payment Partner
            </Typography>
          </Box>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              margin: "auto",
              position: "relative",
              width: "80%",
              maxWidth: "450px",
              height: "auto",
            }}
          >
            <Box
              sx={{
                padding: "8px",
                margin: "auto",
                borderRadius: "8px",
                backgroundColor: "#F5FFF5",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <Grid container spacing={1} alignItems="flex-start">
                <Grid item xs={9} md={9}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      gap: "4px",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: { xs: "8px", sm: "10px", md: "12px" },
                        textAlign: "left",
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: "10px", sm: "12px" },
                          height: { xs: "10px", sm: "12px" },
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#D13C0B",
                          borderRadius: "50%",
                          mb: 3,
                        }}
                      >
                        <FmdGoodIcon
                          sx={{
                            color: "white",
                            fontSize: { xs: "6px", sm: "8px" },
                          }}
                        />
                      </Box>
                      <p
                        style={{
                          color: "#318CE7",
                          fontSize: "inherit",
                          margin: 0,
                        }}
                      >
                        Flat No. 8, Pocket 6, Sector 22, Rohini, Delhi, 110086,
                        Plot No.5, Second Floor, Pocket-5, Rohini Sector 24, New
                        Delhi 110085
                      </p>
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: { xs: "8px", sm: "10px", md: "12px" },
                        textAlign: "left",
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: "10px", sm: "12px" },
                          height: { xs: "10px", sm: "12px" },
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#D13C0B",
                          borderRadius: "50%",
                        }}
                      >
                        <Email
                          sx={{
                            color: "white",
                            fontSize: { xs: "6px", sm: "8px" },
                          }}
                        />
                      </Box>
                      <p
                        style={{
                          color: "#318CE7",
                          fontSize: "inherit",
                          margin: 0,
                        }}
                      >
                        Email: support@VistarMoney.com
                      </p>
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: { xs: "8px", sm: "10px", md: "12px" },
                        textAlign: "left",
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: "10px", sm: "12px" },
                          height: { xs: "10px", sm: "12px" },
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#D13C0B",
                          borderRadius: "50%",
                        }}
                      >
                        <Phone
                          sx={{
                            color: "white",
                            fontSize: { xs: "6px", sm: "8px" },
                          }}
                        />
                      </Box>
                      <p
                        style={{
                          color: "#318CE7",
                          fontSize: "inherit",
                          margin: 0,
                        }}
                      >
                        Phone: 9355128199
                      </p>
                    </Typography>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={3}
                  md={3}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                  }}
                >
                  <LogoComponent width="60px" />
                </Grid>
              </Grid>

              <Typography
                sx={{
                  textAlign: "center",
                  mt: 2,
                  fontWeight: "bold",
                  color: "#327B2E",
                  fontSize: { xs: "10px", sm: "12px", md: "14px" },
                }}
              >
                Receipt
              </Typography>
            </Box>

            <Box className="reciept_watermark1" sx={{ mt: 1.5 }}>
              <Grid container spacing={1} sx={{ py: 4 }}>
                <Grid container item xs={12}>
                  {[
                    "Operator",
                    "Bill Number",
                    "Mobile No:",
                    "Date & Time:",
                  ].map((label, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "bold",
                          textAlign: "center",
                          fontSize: "10px",
                        }}
                      >
                        {label}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>

                <Grid container item xs={12}>
                  {[
                    queryParams.get("operator"),
                    queryParams.get("mobile_no"),
                    queryParams.get("mobile_no"),
                    datemonthYear(queryParams.get("date_time")),
                  ].map((data, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <Typography
                        variant="body2"
                        sx={{ textAlign: "center", fontSize: "10px" }}
                      >
                        {data}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Box
                sx={{
                  padding: "8px",
                  borderRadius: "5px",
                }}
              >
                <Grid
                  container
                  spacing={1}
                  sx={{
                    marginBottom: "10px",
                    mt: 1,
                    border: "0.5px solid #000",
                    borderRadius: "8px",
                  }}
                >
                  <Grid container item xs={12}>
                    {["Transaction Id", "UTR NO", "Amount", "Status"].map(
                      (label, index) => (
                        <Grid item xs={6} sm={3} key={index}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "bold",
                              textAlign: "center",
                              fontSize: "10px",
                              ml: 1,
                            }}
                          >
                            {label}
                          </Typography>
                        </Grid>
                      )
                    )}
                  </Grid>

                  <Grid container item xs={12}>
                    {[
                      queryParams.get("Transaction_Id"),
                      queryParams.get("UTR_NO"),
                      queryParams.get("Amount"),
                      queryParams.get("Status"),
                    ].map((data, index) => (
                      <Grid item xs={6} sm={3} key={index}>
                        <Typography
                          variant="body2"
                          sx={{ textAlign: "center", fontSize: "10px" }}
                        >
                          {data}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={
                    <PrintIcon
                      sx={{
                        width: "15px",
                      }}
                    />
                  }
                  onClick={() => {
                    window.print();
                  }}
                  sx={{
                    backgroundColor: "#1E88E5",
                    display: "flex",

                    color: "#fff",
                    padding: "1px 5px",
                    borderRadius: "8px",
                    fontWeight: 50,
                    fontSize: "10px",
                    "&:hover": {
                      backgroundColor: "#1565C0",
                    },
                    "@media print": {
                      display: "none",
                    },
                  }}
                >
                  Print
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                padding: "8px",
                margin: "auto",
                backgroundColor: "#F5FFF5",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  mt: 2,
                  fontWeight: "bold",
                  color: "#327B2E",
                  fontSize: "12px",
                }}
              >
                VistarMoney: Your Trusted Bill Payment Partner
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};
