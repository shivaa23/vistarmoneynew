import React from "react";
import { AirIndia } from "../../iconsImports";
import { Box, Divider } from "@mui/material";

const FlightInformationTab = ({ legs }) => {
  return (
    <div>
      {legs.map((item) =>
        item.map((data, index) => <FlightInfoCard key={index} data={data} />)
      )}
    </div>
  );
};

export default FlightInformationTab;

function FlightInfoCard({ data }) {
  const Origin = data.Origin;
  const Destination = data.Destination;
  const AircraftCode = data.AircraftCode;
  const AircraftType = data.AircraftType;
  const FlightName = data.FlightName;
  const Cabin = data.Cabin;
  const DepartureTime = data.DepartureTime;
  const DepartureDate = data.DepartureDate;
  const Duration = data.Duration;
  const ArrivalTime = data.ArrivalTime;
  const ArrivalDate = data.ArrivalDate;
  const ArrivalTerminal = data.ArrivalTerminal;
  const DepartureTerminal = data.DepartureTerminal;
  const LayoverDuration = data.LayoverDuration;

  return (
    <>
      <div className="flght-deta" id="fd0">
        <div className="">
          <div className="row"></div>
          <div className="row">
            <div
              className="col-md-12 col-sm-12 mar-to-tb"
              style={{
                textAlign: "left",
              }}
            >
              <span className="txt-r9">
                <span>{Origin}</span> → <span>{Destination}</span>{" "}
              </span>{" "}
              <span className="txt-r10"></span>
            </div>
            <div
              className="col-md-3 col-sm-3 col-xs-12 mg-btm"
              style={{
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <div className="flgi-l">
                <img
                  alt="Flight"
                  src={AirIndia}
                  style={{
                    width: "70%",
                  }}
                />
              </div>
              <Box
                sx={{
                  ml: { xs: 0, md: 5 },
                }}
              >
                <span className="txt-b2">{FlightName}</span> <br />
                <span className="txt-b3">
                  <span>{AircraftCode}</span>-<span>{AircraftType}</span>
                </span>
                <div className="clr"></div>
                <span className="txt-b3 " style={{ display: "block" }}>
                  ({Cabin})
                </span>
              </Box>
            </div>
            <div className="col-md-2 col-sm-2 col-xs-5 text-left mg-btm padi-r">
              <span className="txt-b1">
                <span>{DepartureTime}</span>
              </span>{" "}
              <br />
              <div className="txt-airct">
                <span>{Origin}</span>
                {/* (<span>DEL</span>){" "} */}
              </div>
              <span className="txt-b2nn">{DepartureDate}</span> <br />
              <span className="txt-b3 "></span>
              <span className="txt-b2nn">Terminal - {DepartureTerminal}</span>
            </div>
            <div className="col-md-4 col-sm-4 col-xs-2 txt-cen3 pad-0">
              <div className="clock-wh1 clock-img-1"></div>
              <div className="full-wd3">
                <span className="txt-b2n">
                  {Duration ? Duration : LayoverDuration}
                </span>{" "}
              </div>
            </div>
            <div className="col-md-3 col-sm-3 col-xs-5 padi-r">
              <span className="txt-b1">
                <span>{ArrivalTime}</span>
              </span>
              <br />
              <div className="txt-airct">
                <span>{Destination}</span>
                {/* (<span>BOM</span>){" "} */}
              </div>
              <span className="txt-b2nn">{ArrivalDate}</span> <br />
              <span className="txt-b3"></span>
              <span className="txt-b2nn">Terminal - {ArrivalTerminal}</span>
            </div>
          </div>
        </div>
      </div>
      <Divider sx={{ borderBottom: "2px solid grey", mt: 1 }} />
    </>
  );
}
