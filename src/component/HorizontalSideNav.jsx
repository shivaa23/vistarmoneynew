import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";
import { reports, banking, ourServices, travelServices } from "../_nav";
import { useState } from "react";
import HNavButton from "./HNavButton";
import HorizontalSideNavModal from "../modals/HorizontalSideNavModal";
import MobileRechargeForm from "./MobileRechargeForm";
import { useNavigate } from "react-router-dom";
import ElectricityForm from "./ElectricityForm";
import OutletRegistration from "./OutletRegistration";
import CreditcardForm from "./CreditcardForm";
import BBPSNavView from "../View/BBPSNavView";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

const HorizontalSideNav = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  //filter recharges
  const [filterRec, setFilterRec] = useState(false);
  const [filterRep, setFilterRep] = useState(false);
  // filter banking
  const [filterBanking, setFilterBanking] = useState(false);

  return (
    <>
      {/* banking */}
      <Box
        className="card-css position-relative"
        sx={{
          width: "100%",
          my: 2,
          p: 2,
          py: 1,
        }}
      >
        <Typography className="services-heading">Banking Services</Typography>
        <Grid container>
          {/* 1. first we check if we have clicked on the show extra icons button that are hidden in the bottom
          2. then we see if the user has these services enabled for him or not 
          3. then we map
          */}
          {user?.st === 0 ||
          user.dmt4 === 0 ||
          user?.aeps === 0 ||
          user?.nepal_transfer === 0 ||
          user?.upi_transfer === 0 ||
          user?.stm === 0
            ? banking
                .filter((item) => {
                  if (user?.st === 0 && item.title === "Super Transfer") {
                    return undefined;
                  }
                  if (user?.dmt4 === 0 && item.title === "Express Transfer") {
                    return undefined;
                  }
                  if (user?.stm === 0 && item.title === "Settlements") {
                    return undefined;
                  }
                  if (user?.aeps === 0 && item.title === "AEPS") {
                    return undefined;
                  }
                  if (
                    user?.nepal_transfer === 0 &&
                    item.title === "Nepal Transfer"
                  ) {
                    return undefined;
                  }
                  if (
                    user?.upi_transfer === 0 &&
                    item.title === "UPI Transfer"
                  ) {
                    return undefined;
                  } else {
                    return item;
                  }
                })
                .map((mitem, index) => {
                  return (
                    <Grid
                      item
                      md={2}
                      index={index}
                      onClick={() => navigate(mitem.to)}
                      className="horizontal-sidenav"
                    >
                      <HNavButton item={mitem} />
                    </Grid>
                  );
                })
            : banking
                .filter((item) => {
                  if (!filterBanking && item.title === "UPI Transfer") {
                    return undefined;
                  } else {
                    return item;
                  }
                })
                .map((item, index) => {
                  return (
                    <Grid
                      item
                      md={2}
                      index={index}
                      onClick={() => navigate(item.to)}
                      className="horizontal-sidenav"
                    >
                      <HNavButton item={item} />
                    </Grid>
                  );
                })}
        </Grid>
        <div
          style={{ position: "absolute", right: "15px", top: "80px" }}
          onClick={() => setFilterBanking(!filterBanking)}
          className="hover-zoom"
        >
          {" "}
          {filterBanking ? (
            <KeyboardDoubleArrowLeftIcon
              fontSize="large"
              sx={{ opacity: "0.7" }}
            />
          ) : (
            <KeyboardDoubleArrowRightIcon
              fontSize="large"
              sx={{ opacity: "0.7" }}
            />
          )}
        </div>
      </Box>
      {/* recharges and bill */}
      <Box
        className="card-css position-relative"
        sx={{ width: "100%", p: 2, py: 1, display: "flex" }}
      >
        <div style={{ width: "100%" }}>
          <Typography className="services-heading">
            Recharges & Bill Payments
          </Typography>

          <Grid container>
            {filterRec
              ? ourServices.map((item, index) => {
                  return (
                    <Grid
                      item
                      md={2}
                      index={index}
                      className="horizontal-sidenav"
                      onClick={() => {
                        if (item?.isModal) {
                          setTitle(item.title);
                          setOpen(true);
                        } else {
                          navigate(item.to);
                        }
                      }}
                    >
                      <HNavButton item={item} />
                    </Grid>
                  );
                })
              : ourServices
                  .filter((item) => {
                    if (
                      item.title === "Broadband Bill" ||
                      item.title === "Water Bill" ||
                      item.title === "Landline Bill"
                    ) {
                      return undefined;
                    } else {
                      return item;
                    }
                  })
                  .map((item, index) => {
                    return (
                      <Grid
                        item
                        md={2}
                        index={index}
                        className={
                          item.title === "Show More" ? "" : "horizontal-sidenav"
                        }
                        onClick={() => {
                          if (item?.isModal) {
                            setTitle(item.title);
                            setOpen(true);
                          } else {
                            navigate(item.to);
                          }
                        }}
                      >
                        <HNavButton item={item} />
                      </Grid>
                    );
                  })}
          </Grid>
        </div>
        <div
          style={{ position: "absolute", right: "15px", top: "80px" }}
          onClick={() => setFilterRec(!filterRec)}
          className="hover-zoom"
        >
          {" "}
          {filterRec ? (
            <KeyboardDoubleArrowLeftIcon
              fontSize="large"
              sx={{ opacity: "0.7" }}
            />
          ) : (
            <KeyboardDoubleArrowRightIcon
              fontSize="large"
              sx={{ opacity: "0.7" }}
            />
          )}
        </div>
      </Box>

      {/*  BBPS*/}
      <BBPSNavView />

      {/* travel */}
      {user?.username === 7011256694 && (
        <Box
          className="card-css position-relative"
          sx={{ width: "100%", p: 2, py: 1, display: "flex" }}
        >
          <div style={{ width: "100%" }}>
            <Typography className="services-heading">
              Travel Services
            </Typography>

            <Grid container>
              {travelServices.map((item, index) => {
                return (
                  <Grid
                    item
                    md={2}
                    index={index}
                    className="horizontal-sidenav"
                    onClick={() => {
                      if (item?.isModal) {
                        setTitle(item.title);
                        setOpen(true);
                      } else if (item?.target) {
                        window.open(`${item.to}`, "_blank");
                      } else {
                        navigate(item.to);
                      }
                    }}
                  >
                    <HNavButton item={item} />
                  </Grid>
                );
              })}
            </Grid>
          </div>
          {/* <div
          style={{ position: "absolute", right: "15px", top: "80px" }}
          onClick={() => setFilterRec(!filterRec)}
          className="hover-zoom"
        >
          {" "}
          {filterRec ? (
            <KeyboardDoubleArrowLeftIcon
              fontSize="large"
              sx={{ opacity: "0.7" }}
            />
          ) : (
            <KeyboardDoubleArrowRightIcon
              fontSize="large"
              sx={{ opacity: "0.7" }}
            />
          )}
        </div> */}
        </Box>
      )}

      {/*  */}
      <Box
        className="card-css position-relative"
        sx={{ width: "100%", p: 2, my: 2, py: 1 }}
      >
        <div style={{ width: "100%" }}>
          <Typography className="services-heading">Reports</Typography>
          <Grid container>
            {filterRep
              ? reports.map((item, index) => {
                  return (
                    <Grid
                      item
                      md={2}
                      index={index}
                      onClick={() => navigate(item.to)}
                      className="horizontal-sidenav"
                    >
                      <HNavButton item={item} />
                    </Grid>
                  );
                })
              : reports
                  .filter((item) => {
                    if (item.title === "Khata Book") {
                      return undefined;
                    } else {
                      return item;
                    }
                  })
                  .map((item, index) => {
                    return (
                      <Grid
                        item
                        md={2}
                        index={index}
                        onClick={() => navigate(item.to)}
                        className="horizontal-sidenav"
                      >
                        <HNavButton item={item} />
                      </Grid>
                    );
                  })}
          </Grid>
        </div>
        <div
          style={{ position: "absolute", right: "15px", top: "80px" }}
          onClick={() => setFilterRep(!filterRep)}
          className="hover-zoom"
        >
          {" "}
          {filterRep ? (
            <KeyboardDoubleArrowLeftIcon
              fontSize="large"
              sx={{ opacity: "0.7" }}
            />
          ) : (
            <KeyboardDoubleArrowRightIcon
              fontSize="large"
              sx={{ opacity: "0.7" }}
            />
          )}
        </div>
      </Box>
      <HorizontalSideNavModal
        open={open}
        setOpen={setOpen}
        title={title}
        children={
          title === "DTH Recharge" || title === "Mobile Recharge" ? (
            <MobileRechargeForm
              view={
                title === "DTH Recharge"
                  ? "dth"
                  : title === "Mobile Recharge"
                  ? "mobile"
                  : ""
              }
            />
          ) : title === "Electricity with commission" ||
            title === "Broadband Bill" ||
            title === "Gas Bill" ||
            title === "Water Bill" ||
            title === "LIC Premium" ||
            title === "Landline Bill" ? (
            <ElectricityForm
              title={
                title === "Electricity with commission"
                  ? "Electricity Bill Payment"
                  : title === "Broadband Bill"
                  ? "Broadband Bill Payment"
                  : title === "Gas Bill"
                  ? "Gas Bill Payment"
                  : title === "LIC Premium"
                  ? "LIC Bill Payment"
                  : title === "Landline Bill"
                  ? "Landline Bill Payment"
                  : title === "Water Bill"
                  ? "Water Bill Payment"
                  : ""
              }
              subType={
                title === "Electricity with commission"
                  ? "ELECTRICITY"
                  : title === "Broadband Bill"
                  ? "BROADBAND"
                  : title === "Gas Bill"
                  ? "GAS"
                  : title === "LIC Premium"
                  ? "LIC"
                  : title === "Water Bill"
                  ? "WATER"
                  : title === "Landline Bill"
                  ? "LANDLINE"
                  : ""
              }
            />
          ) : title === "Credit Card Bill" ? (
            user && !user.instId ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <OutletRegistration autoOpen />
              </Box>
            ) : (
              <CreditcardForm />
            )
          ) : (
            ""
          )
        }
      />
    </>
  );
};

export default HorizontalSideNav;
