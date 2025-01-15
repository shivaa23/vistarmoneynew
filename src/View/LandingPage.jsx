import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import LandingPageIntro from "./LandingPageIntro";
import LandingPageWhoWeAre from "./LandingPageWhoWeAre";
import LandingPageWeOffer from "./LandingPageWeOffer";
import LandingPageBuildSecurity from "./LandingPageBuildSecurity";
import { useDispatch } from "react-redux";
import { clearFlightRedux } from "../features/flight/flightSlice";

const LandingPage = () => {
  // const authCtx = useContext(AuthContext);
  // const userStatus = authCtx?.user?.status;
  // const role = authCtx?.user?.role;

  // const isLoggedIn = authCtx.isLoggedIn;
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (userStatus === 1) {
  //     if (role === "Admin") {
  //       navigate("/admin/dashboard");
  //     } else if (role === "Asm") {
  //       navigate("/asm/dashboard");
  //     } else if (role === "Api") {
  //       navigate("/api-user/dashboard");
  //     } else if (role === "Ad") {
  //       navigate("/ad/dashboard");
  //     } else if (role === "Ret" || role === "Dd") {
  //       navigate("/customer/dashboard");
  //     } else if (role === "Acc") {
  //       navigate("/account/dashboard");
  //     } else {
  //     }
  //   }
  // }, []);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      clearFlightRedux({
        type: "clear",
      })
    );
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{process.env.REACT_APP_TITLE}</title>
        <meta name="description" content="DilliPay" />
        <meta name="keywords" content="DilliPay" />
      </Helmet>
      <div className="app-content
      ">
        <LandingPageIntro />
        <LandingPageWhoWeAre />
        <LandingPageWeOffer />
        {/* <ServiceCrausal /> */}

        <LandingPageBuildSecurity />
        {/* <LandingPageAppDnld /> */}
        {/* <LandingPageTestimonials /> */}
      </div>
    </div>
  );
};

export default LandingPage;
