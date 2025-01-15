import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "./Footer";
import ChatBox from "../commons/ChatBox";

const MainPage = () => {
  return (
    <div>
      <Navbar />
      {/* not using currently */}
      {/* <ContactusModal /> */}
      <Outlet />
      {/* <ChatBox /> */}
      <Footer />
    </div>
  );
};

export default MainPage;
