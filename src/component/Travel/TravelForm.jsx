import React, { useState } from "react";
import FlightTab from "./FlightTab";
import CustomTabs from "../CustomTabs";
import { travel_Tab } from "../../utils/constants";
import TrainTab from "./TrainTab";
import BusTab from "./BusTab";
import HotelsTab from "./HotelsTab";
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import HouseIcon from '@mui/icons-material/House';
import TrainIcon from '@mui/icons-material/Train';
import FlightIcon from '@mui/icons-material/Flight';
const TravelForm = () => {
  return (
    <div>
      <div className="container">
        {/* search engine tabs */}

        {/* ---------------------------------- */}
        {/* product main tab list */}
        {/* ---------------------------------- */}
        <TraveltabList />

        {/* ---------------------------------- */}
        {/* product main tab list end------------------------*/}
        {/* ---------------------------------- */}

        {/* product main tab content */}
        <div className="tab-content mt-3" id="myTabContent">
          {/* flight search tab */}
          {/* <FlightTab /> */}

          {/* hotel search tab */}
          {/* <HotelTab /> */}

          {/* holiday search tab */}
          {/* <HolidaySearchTab /> */}
        </div>
      </div>
    </div>
  );
};

export default TravelForm;

// flight tablist component
function TraveltabList() {
  const [value, setValue] = useState(0);
  const [currentType, setCurrentType] = useState();
  
  const tabs = [
    { label: "AIR", content: <FlightTab /> ,icon:<FlightIcon  sx={{ color: "#ee6c4d" }} />},
    { label: "BUS"  ,content: <BusTab />,icon:<DirectionsBusIcon   sx={{ color: "#ee6c4d" }} />},
    { label: "HOTELS",content: <HotelsTab />,icon:< HouseIcon sx={{ color: "#ee6c4d" }} /> },
    { label: "Train" ,content:<TrainTab/>,icon:<TrainIcon  sx={{ color: "#ee6c4d" }} />},
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setCurrentType(travel_Tab[newValue]);

    // if (tabs[newValue].label === "Train") {
    //   // Redirect to IRCTC link when "Train" tab is clicked
    //   window.open("https://www.irctc.co.in/nget/train-search", "_blank");
    // }
  };

  return (
    <>
      <CustomTabs
        tabs={tabs}
        value={value}
        onChange={handleChange}
      />
    </>
  );
}
