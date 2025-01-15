import React, { useEffect } from "react";
import TravelForm from "../../component/Travel/TravelForm";
import { useDispatch } from "react-redux";
import { clearFlightRedux } from "../../features/flight/flightSlice";

const TravelContainer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      clearFlightRedux({
        type: "clear",
      })
    );

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TravelForm />
    </>
  );
};

export default TravelContainer;