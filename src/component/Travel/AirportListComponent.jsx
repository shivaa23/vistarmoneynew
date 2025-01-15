import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Popover } from "@mui/material";
import flightSvg from "../../assets_travel/images/icons/flight.svg";
import { get } from "../../network/ApiController";
import ApiEndpoints from "../../network/ApiEndPoints";
import { apiErrorToast } from "../../utils/ToastUtil";
import useDebounce from "../../utils/Debounce";
import Mount from "../Mount";

const AirportListComponent = ({
  place,
  setPlace,
  placeholder = "From",
  isOuter = true,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [airportList, setAirportList] = useState([]);
  const [request, setRequest] = useState(false);
  const [query, setQuery] = useState("type=DOMESTIC");
  //   const [place, setPlace] = useState();
  const [searchValue, setSearchValue] = useState();
  const debouncedSearchPlace = useDebounce(searchValue, 300);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    if (!place) {
      // setPlace();
      setSearchValue();
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // get airport function
  const getAirportList = useCallback(() => {
    get(
      ApiEndpoints.GETAIRPORTS,
      query,
      setRequest,
      (res) => {
        setAirportList(res.data.data);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  }, [query]);

  useEffect(() => {
    if (!request) getAirportList();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAirportList]);

  const createFilter = (debouncedSearchPlace) => {
    let filter = "type=DOMESTIC";
    if (debouncedSearchPlace)
      filter = filter + (filter ? "&" : "") + "search=" + debouncedSearchPlace;
    return filter;
  };

  useEffect(() => {
    setQuery(createFilter(debouncedSearchPlace));
    return () => {};
  }, [debouncedSearchPlace]);

  const selectedCityComponent = useMemo(() => {
    const uniqueId = Date.now(); // Generate a unique identifier
    return (
      <div onClick={handleClick}>
        <Mount visible={isOuter}>
          <label
            className={isOuter ? "form-label" : ""}
            style={{
              color: isOuter ? "" : "#ECF0F1",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {placeholder}
          </label>
        </Mount>
        <div key={uniqueId} className="innerspcr" id="frmcity">
          <input
            id="FromSector"
            type="text"
            className="hide-txtbox input_city ac_input"
            placeholder={placeholder}
            autocomplete="off"
            style={{ display: "none" }}
          />
          <input
            type="text"
            tabindex="1"
            autocomplete="off"
            id="FromSector_show"
            placeholder={placeholder}
            className={isOuter ? "autoFlll cityinput" : "autoFlll cityinput2"}
            defaultValue=""
            value={place?.CityName}
            //   onChange={handleInputPlace}
            required
          />
          <Mount visible={isOuter}>
            <p id="FromSectorSpan" className="airptname tellipsis">
              {place
                ? `[${place?.CityCode}] ${place?.AirportName}`
                : "airport details"}
            </p>
          </Mount>
          <p className="gpsicon" style={{ display: "none" }}>
            <img src="/Content/img/gps_icon.svg" alt="" />
          </p>
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place, placeholder]);

  return (
    <div className="fss_flex depcity_colm sechver">
      {selectedCityComponent}

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className="autosearch fromsectr" id="fromautoFill_in">
          {/* search input component */}
          <div className="searcityCol">
            <i className="searcIcn"></i>
            <input
              id="a_FromSector_show"
              type="text"
              className="srctinput autoFlll"
              placeholder="From"
              autocomplete="off"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
            />
          </div>

          {/* list scroll card */}
          <div
            id="fromautoFill"
            className="ovscroll"
            style={{ display: "block" }}
          >
            <div className="clr"></div>{" "}
            <div className="topCityhd">Top Cities</div>
            <ul className="ausuggest">
              {airportList?.length > 0 &&
                airportList.slice(0, 5).map((item, index) => {
                  return (
                    <ListComponent
                      data={item}
                      setPlace={setPlace}
                      handleClose={handleClose}
                    />
                  );
                })}
            </ul>
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default AirportListComponent;

function ListComponent({ data, setPlace, handleClose }) {
  const { CityName, CityCode, AirportName, CountryName } = data;

  const handleInputPlace = useCallback(
    (selection) => {
      setPlace(null);
      setTimeout(() => {
        setPlace(selection);
      }, 100);
      if (handleClose) handleClose();
    },
    [setPlace, handleClose]
  );

  return (
    <li
      onClick={() => {
        handleInputPlace(data);
      }}
    >
      <div className="mflexcol">
        <img src={flightSvg} alt="Flight" className="mgr10" />
        <div>
          <p>
            <span id="spn12" className="flsctrhead">
              {CityName}({CityCode})
            </span>
          </p>
          <p id="airport12" className="autosrpt">
            {AirportName}
          </p>
        </div>
        <div className="flcountry"> {CountryName} </div>
      </div>
    </li>
  );
}
