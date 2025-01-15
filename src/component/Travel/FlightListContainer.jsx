import React, { useCallback } from "react";
import cheapestIcon from "../../assets_travel/images/icons/cheapest-icon.svg";
import easyTrip from "../../assets_travel/images/icons/easytrip-lg.svg";
import { AirIndia } from "../../iconsImports";
import FlightDetailComponent from "./FlightDetailComponent";
import { Box, Skeleton, Stack } from "@mui/material";
import LoaderFull from "../../commons/LoaderFull";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { postJsonData } from "../../network/ApiController";
import ApiEndpoints from "../../network/ApiEndPoints";
import { useEffect } from "react";
import Mount from "../Mount";
import OneWayFlightForm2 from "./OneWayFlightForm2";
import { useDispatch, useSelector } from "react-redux";
import {
  setJourney,
  setSegments,
  setTraceId,
} from "../../features/flight/flightSlice";
import { LoadingButton } from "@mui/lab";

const FlightListContainer = () => {
  const [searchParams] = useSearchParams();
  const [request, setRequest] = useState(false);
  const [flightList, setFlightList] = useState([]);
  const [isShowMoreFare, setIsShowMoreFare] = useState(false);
  const dispatch = useDispatch();
  const { traceid, tripType } = useSelector((state) => state?.flight);

  const handleMoreFare = () => {
    setIsShowMoreFare(!isShowMoreFare);
  };

  const searchFlights = useCallback(() => {
    postJsonData(
      `${ApiEndpoints.SEARCH_FLIGHTS}?${searchParams}`,
      "",
      setRequest,
      (res) => {
        setFlightList(res.data.data.Journeys[0].Segments);
        dispatch(setTraceId(res.data.data.TraceId));
        dispatch(setSegments(res.data.data.Journeys[0].Segments));
      },
      (err) => {}
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    searchFlights();

    return () => {};
  }, [searchFlights]);

  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <LoaderFull
        loading={request}
        text="Just a moment, we are searching for the flights on this route."
        blur={1}
      />
      <Mount visible={request}>
        <Stack>
          <Skeleton animation="wave" />
          <Skeleton animation="wave" variant="text" height={200} />
          <Skeleton animation="wave" variant="text" height={200} />
          <Skeleton animation="wave" variant="text" height={200} />
          <Skeleton animation="wave" variant="text" height={200} />
          <Skeleton animation="wave" variant="text" height={200} />
          <Skeleton animation="wave" variant="text" height={200} />
        </Stack>
      </Mount>

      {/* ##### INNER FLIGHT LIST CONTAINER ##### */}
      <OneWayFlightForm2 />

      <Mount visible={!request && flightList.length > 0}>
        <div className="top_b_mflx" id="divCHPMsg">
          <div className="top_icon">
            <img src={cheapestIcon} className="emtdis" alt="" />
            <img
              src={easyTrip}
              style={{ display: "none" }}
              className="easydis"
              alt=""
            />
          </div>
          <div className="txt_chpst">
            <span className="top_chpst">Cheapest </span>{" "}
            <span id="spnCpMsg">Flights starting from ₹ 4491</span>{" "}
          </div>
        </div>

        {/* ---------------------- */}
        {/* fetched flight mapping */}
        {/* ---------------------- */}
        {flightList.map((item, index) => {
          return (
            <FlightCard
              data={item}
              isShowMoreFare={isShowMoreFare}
              handleMoreFare={handleMoreFare}
              tripType={Number(tripType)}
              traceid={traceid}
              searchParams={searchParams}
            />
          );
        })}
      </Mount>
    </Box>
  );
};

export default FlightListContainer;

function FlightCard({
  data,
  isShowMoreFare,
  handleMoreFare,
  tripType,
  traceid,
  searchParams,
}) {
  const [request, setRequest] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stops = data.Bonds.map((bonds, index) => bonds.Legs.length - 1);
  const legs = data.Bonds.map((bonds, index) => bonds.Legs);
  const flightName = data.Bonds.map((bonds) => bonds.Legs[0].FlightName);
  const Cabin = data.Bonds.map((bonds) => bonds.Legs[0].Cabin);
  const JourneyTime = data.Bonds.map((bonds) => bonds.JourneyTime);
  const AircraftCode = data.Bonds.map((bonds) => bonds.Legs[0].AircraftCode);
  const AircraftType = data.Bonds.map((bonds) => bonds.Legs[0].AircraftType);
  const Origin_Start = data.Bonds.map((bonds) => bonds.Legs[0].Origin);
  const Destination_Last = data.Bonds.map((bonds) => {
    const legs = bonds.Legs;
    const lastLegIndex = legs.length - 1;

    if (lastLegIndex >= 0) {
      return legs[lastLegIndex].Destination;
    } else {
      return null;
    }
  });
  const DepartureTime_Start = data.Bonds.map(
    (bonds) => bonds.Legs[0].DepartureTime
  );
  const ArrivalTime_Last = data.Bonds.map((bonds) => {
    const legs = bonds.Legs;
    const lastLegIndex = legs.length - 1;

    if (lastLegIndex >= 0) {
      return legs[lastLegIndex].ArrivalTime;
    } else {
      return null;
    }
  });
  const base_fare = data.Fare.BasicFare;

  const priceCheck = () => {
    const formData = {
      Adults: searchParams.get("Adults"),
      Childs: searchParams.get("Childs"),
      Infants: searchParams.get("Infants"),
      BeginDate: searchParams.get("BeginDate"),
      Destination: searchParams.get("Destination"),
      Origin: searchParams.get("Origin"),
      MobileNumber: searchParams.get("MobileNumber"),
      TripType: searchParams.get("TripType"),
      Cabin: searchParams.get("Cabin"),
      AirpricePosition: 1,
      TraceId: traceid,
      Segment: [data],
    };
    postJsonData(
      ApiEndpoints.PRICE_CHECK_FLIGHTS,
      formData,
      setRequest,
      (res) => {
        dispatch(setJourney(res.data.data.Journeys[0].Segments));
        navigate("/customer/booking-review");
      },
      (err) => {}
    );
  };

  return (
    <>
      {/* FLIGHT LIST CARD COMPONENT */}
      <div
        className={
          tripType === 1
            ? "col-md-6 col-sm-12 main-bo-lis pad-top-bot px-3"
            : "col-md-12 col-sm-12 main-bo-lis pad-top-bot px-3"
        }
      >
        {/* FLIGHT DETAIL CARD */}
        <div className="row">
          <div className="col-md-2 col-sm-2 col-xs-4">
            <div className="row">
              <div
                className="col-md-5 col-sm-5 "
                style={{ padding: "0 6px 0 24px" }}
              >
                <div className="flgi-l">
                  <img alt="Flight" src={AirIndia} />
                </div>
              </div>
              <div className="col-md-7 col-sm-7 padd-lft airl-txt-n">
                <span className="txt-r4">{flightName}</span>
                <br />
                <span className="txt-r5">
                  <span className="">{AircraftCode}</span>-
                  <span className="">{AircraftType}</span>
                </span>
                <br />
                <span className="txt-r5" style={{ display: "none" }}>
                  {Cabin}
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-2 col-sm-2 col-xs-4 top5">
            <span className="txt-r2-n">{DepartureTime_Start}</span>
            <br />
            <span className="txt-r3-n">{Origin_Start}</span>
          </div>
          <div className="col-md-2 col-sm-2 col-xs-5 non-st">
            <span className="dura_md">{JourneyTime}</span>
            <div className="arrow-md-lm"></div>
            <span className="dura_md2">
              {stops <= 0 ? "non-stop" : `${stops}-stop`}
            </span>
          </div>
          <div className="col-md-2 col-sm-2 col-xs-3 top5 txdir">
            <span className="txt-r2-n">{ArrivalTime_Last}</span>
            <br />
            <span className="txt-r3-n">{Destination_Last}</span>
          </div>

          <div
            className="col-md-2 col-sm-2 col-xs-5 mr5 cle"
            style={{ position: "relative" }}
          >
            <div className="row">
              {/* rupee_icon1 */}
              {/* <div className="col-md-1 col-sm-1 col-xs-2 red_Rs"></div> */}
              <div
                className="col-md-8 col-sm-8 col-xs-9 txt-r6-n exPrc d-flex align-items-center"
                id="spnPrice1"
              >
                <div>₹</div>&nbsp; <div>{base_fare}</div>
              </div>
            </div>
            <div
              id="divFareSummary0"
              className="fareSummary"
              style={{
                display: "none",
                zIndex: 1000,
                position: "absolute",
                backgroundColor: "white",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "rgb(35, 157, 222)",
                fontSize: "12px",
                color: "rgb(0, 0, 0)",
                width: "250px",
                right: 0,
              }}
            ></div>
          </div>

          <div className="col-md-2 col-sm-2 col-xs-6 txt-al-rt">
            <span className="txt-r7 dis-n"></span>
            <LoadingButton
              loading={request}
              variant="contained"
              type="button"
              className="btn book-bt-n"
              onClick={() => {
                priceCheck();
              }}
            >
              Book Now
            </LoadingButton>
            <button
              type="button"
              id="btnSeg0"
              className="btn viewfarebtn ng-scope"
              style={{ display: "none" }}
            >
              View Fare
            </button>
          </div>
        </div>

        {/* PROMO CODE PARA */}
        <div className="row">
          {/*div className="full-str" style="padding: 3px 1%;color: #e25b18;margin: 0;font-size: 14px;display:block" id="divNote{{s.SK}}"  ng-show="s.lstFr[0].ICPS==false" ng-bind="s.lstFr[0].Nt"></div*/}
          <div
            className="full-str "
            style={{
              padding: "3px 6px",
              color: "#3a3a3a",
              fontSize: "13px",
              background: "#fffbed",
              float: "left",
              width: "auto",
              margin: "0 0 7px 15px",
              border: "0",
              borderLeft: " 3px solid #efdc9c",
            }}
            id="divNote1"
            ng-show="s.lstFr[0].IST==false &amp;&amp; s.lstFr[0].ICPS==false"
            ng-bind="s.lstFr[0].Nt"
          >
            Use Promo Code: BOOKNOW to get flat Rs.300 OFF on this flight
          </div>
        </div>

        {/* ############################### */}
        {/* MORE FARE COMPONENT ########### */}
        {/* ############################### */}
        {/* <Mount visible={isShowMoreFare}> */}
        {/* </Mount> */}
        {/* MORE FARE END ################# */}

        <div className="clr"></div>
        <div className="clr"></div>

        {/* ================================================================= */}
        {/* FLIGHT DETAIL BUTTON AND DROPDOWN COMPONENT */}
        {/* ================================================================= */}
        <FlightDetailComponent legs={legs} data={data} />
      </div>
    </>
  );
}
