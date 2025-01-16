import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { Grid, Typography, Box, IconButton } from "@mui/material";
import AuthContext from "../store/AuthContext";
import CommonCardDashBoard from "../component/CommonCardDashBoard";
import {
  moneyl,
  cms1,
  aeps1,
  upi1,
  vpay1,
  airplane1,
  bus1,
  hotel1,
  train1,
  electricity1,
  creditcard1,
  insurance1,
  dth1,
  broadband1,
  gas1,
  water1,
  landline1,
  recharge1,
  BBPS,
  postpaid1,
  cylinder,
  newCredit,
  mutualfunds,
  Loan,
  account,
  demand,
} from "../iconsImports";
import DmtContainer from "./DMTcontainer";
import CMSView from "./CMSView";
import VendorPayments from "./VendorPayments";
import UPITransferView from "./UPITransferView";
import MobileRechargeForm from "../component/MobileRechargeForm";
import CreditcardForm from "../component/CreditcardForm";
import ElectricityForm from "../component/ElectricityForm";
import AEPS2View from "./aeps/AEPS2View";
import BBPSView from "./BBPSView";
import FlightTab from "../component/Travel/FlightTab";
import BusTab from "../component/Travel/BusTab";
import TrainTab from "../component/Travel/TrainTab";
import HotelsTab from "../component/Travel/HotelsTab";
import NewsSection from "../component/NewsSection";
import NewCreditCard from "../component/NewCreditCard";
import MutualFunds from "../component/MutualFunds";
import NewLoan from "../component/Loan";
import SuperTransferModel from "../modals/SuperTransferModel";
import { UtilityReceipt, UtilityReciept } from "../component/UtilityReciept";

const RetDdDashboard = () => {
  // const [currentView, setCurrentView] = useState(null);
  const [name, setName] = useState();
  const [image, setImage] = useState();
  const location = useLocation();
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  console.log("user is ", user);
  const [sumData, setSumData] = useState(false);
  const setCurrentView = authCtx.setCurrentView;
  const currentView = authCtx.currentView;
  const dataCategories = [
    ...(user.username !== 9355080885
      ? [
          {
            title: "Banking",
            data: [
              (user?.dmt1 === 1 || user?.dmt2 === 1) && {
                id: 1,
                name: "DMT",
                img: moneyl,
                component: DmtContainer,
              },
              { id: 2, name: "CMS ", img: cms1, component: CMSView },
              // {
              //   id: 3,
              //   name: "Nepal Transfer",
              //   img: nepal1,
              //   component: NepalTransfer,
              // },
              user?.dmt4 == !0 && {
                id: 4,
                name: "PPI Wallet",
                img: vpay1,
                component: SuperTransferModel,
              },
              user.upi_transfer !== 0 && {
                id: 5,
                name: "UPI",
                img: upi1,
                component: UPITransferView,
              },
              user?.aeps !== 0 && {
                id: 6,
                name: "Aeps",
                img: aeps1,
                component: AEPS2View,
              },
              {
                id: 7,
                name: "Open Account",
                img: account,
                component: NewCreditCard,
              },
            ].filter(Boolean),
          },
        ]
      : []),
    // ...(user.username !== 9355080885
    //   ? [
    //       {
    //         title: "Banking",
    //         data: [
    //           { id: 1, name: "DMT", img: moneyl, component: DmtContainer },
    //           { id: 2, name: "CMS ", img: cms1, component: CMSView },
    //           {
    //             id: 4,
    //             name: "PPI Wallet",
    //             img: vpay1,
    //             component: SuperTransferModel,
    //           },
    //           user?.upi !== 0 && {
    //             id: 5,
    //             name: "UPI",
    //             img: upi1,
    //             component: UPITransferView,
    //           },
    //           { id: 6, name: "Aeps", img: aeps1, component: AEPS2View },
    //           {
    //             id: 7,
    //             name: "Open Account",
    //             img: account,
    //             component: NewCreditCard,
    //           },
    //         ].filter(Boolean),
    //       },
    //     ]
    //   : []),
    {
      title: "Utility Payments",
      data: [
        user?.recharge == 1&&
            {
              id: 7,
              name: "Prepaid",
              img: recharge1,
              component: MobileRechargeForm,
            },
            user?.recharge == 1&&
            {
              id: 8,
              name: "Postpaid",
              img: postpaid1,
              component: MobileRechargeForm,
            },
            user?.recharge == 1&&
            {
              id: 9,
              name: "DTH",
              img: dth1,
              component: MobileRechargeForm,
            },
          
        
      
        {
          id: 10,
          name: "Electricity Bill",
          img: electricity1,
          component: ElectricityForm,
        },
        {
          id: 11,
          name: "Credit Card Bill",
          img: creditcard1,
          component: CreditcardForm,
        },
        {
          id: 12,
          name: "BroadBand Bill",
          img: broadband1,
          component: ElectricityForm,
        },
        { id: 13, name: "Piped Gas", img: gas1, component: ElectricityForm },
        { id: 14, name: "Water Bill", img: water1, component: ElectricityForm },
        {
          id: 15,
          name: "Insurance",
          img: insurance1,
          component: ElectricityForm,
        },
        {
          id: 16,
          name: "Landline Bill",
          img: landline1,
          component: ElectricityForm,
        },
        user.bbps !== 0 && {
          id: 17,
          name: "Bbps",
          img: BBPS,
          component: BBPSView,
        },
        {
          id: 18,
          name: "Cylinder Booking",
          img: cylinder,
          component: NewCreditCard,
        },
        // {
        //   id: 19,
        //   name: "Demand Note (Electricity)",
        //   img: demand,
        //   component: NewCreditCard,
        // },
        // {
        //   id: 20,
        //   name: "IGL Commercial B",
        //   img: BBPS,
        //   component: NewCreditCard,
        // },
        // {
        //   id: 21,
        //   name: "Part Payment Electricity",
        //   img: BBPS,
        //   component: NewCreditCard,
        // },
      ].filter(Boolean),
    },
    // {
    //   title: "Wealth Management",
    //   data: [
    //     {
    //       id: 1,
    //       name: "New Credit Card",
    //       img: newCredit,
    //       component: NewCreditCard,
    //     },
    //     {
    //       id: 2,
    //       name: "Mutual Funds",
    //       img: mutualfunds,
    //       component: MutualFunds,
    //     },
    //     { id: 3, name: "New Loans", img: Loan, component: NewLoan },
    //   ].filter(Boolean),
    // },
    {
      title: "Travel",
      data: [
        user?.ft && {
          id: 18,
          name: "AIR",
          img: airplane1,
          component: FlightTab,
        },
        { id: 19, name: "BUS", img: bus1, component: BusTab },
        { id: 20, name: "HOTELS", img: hotel1, component: HotelsTab },
        { id: 21, name: "IRCTC", img: train1, component: TrainTab },
        { id: 21, name: "Recipt", img: train1, component: UtilityReceipt },
      ].filter(Boolean),
    },
  ];

  const handleCardClick = (item) => {
    setName(item.name);
    setImage(item.img);
    let title = ""; // Define a title variable
    if (item.name === "Prepaid") {
      title = "Prepaid";
    } else if (item.name === "Postpaid") {
      title = "Postpaid";
    }

    // Check if the clicked item has a component associated
    if (item.component) {
      setCurrentView({
        component: item.component,
        type:
          item.name === "DMT"
            ? "dmt1"
            : item.name === "CMS"
            ? "cms1"
            : item.name === "Vendor Payments"
            ? "express"
            : item.name === "Nepal Transfer"
            ? "nepal"
            : item.name === "Water Bill"
            ? "Water"
            : item.name === "UPI"
            ? "upi"
            : item.name === "Credit Card Bill"
            ? ""
            : item.name === "Landline Bill"
            ? "Landline"
            : item.name === "Electricity Bill"
            ? "Electricity"
            : item.name === "BroadBand Bill"
            ? "Broadband"
            : item.name === "Prepaid" || item.name === "Postpaid"
            ? "mobile"
            : item.name === "DTH"
            ? "dth"
            : item.name === "Piped Gas"
            ? "Gas"
            : item.name,
        title, // Add title prop
      });
    }
  };

  const resetView = () => {
    setCurrentView(null);
  };

  return (
    <>
      {user.aggreement === 1 ? (
        <Box>
          {location.pathname === "/customer/dashboard" && <NewsSection />}

          {!currentView ? (
            dataCategories.map((category, index) => (
              <Box
                key={index}
                sx={{
                  marginBottom: 2,
                  border: "solid 1px lightgray",
                  p: { xs: 1, sm: 3 },
                  borderRadius: 3,
                  overflow: "wrap",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                <Typography
                  variant="h6"
                  align="left"
                  sx={{
                    pl: 1,
                    mt: -2,
                    mb: 1,
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  {category.title}
                </Typography>
                <Grid container spacing={1.5}>
                  {category.data.map((item) => (
                    <Grid item key={item.id}>
                      <CommonCardDashBoard
                        name={item.name}
                        img={item.img}
                        onClick={() => handleCardClick(item)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))
          ) : (
            <currentView.component
              type={currentView.type}
              title={currentView.title} // Pass the title prop
              resetView={resetView}
              name={name}
              image={image}
            />
          )}
        </Box>
      ) : (
        <Box>
          <Grid
            item
            className="card-css"
            sx={{ p: 3, mt: 2, mb: { md: 0, xs: 5 } }}
          >
            <h5> To use our services please sign the agreement</h5>

            <br />
            <a href="/service" target="_blank" rel="noopener noreferrer">
              Click here
            </a>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default RetDdDashboard;
