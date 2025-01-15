import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginPage1, Logo } from "../iconsImports";
import AuthContext from "../store/AuthContext";

const LogoComponent = ({ width = "80px", pl = "", style }) => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [user, setUser] = useState(authCtx?.user);
  // const user = authCtx.user;
  useEffect(() => {
    if (authCtx?.user) {
      setUser(authCtx.user);
    } else {
      setUser(false);
    }
    return () => {};
  }, [authCtx]);

  const handleClick = () => {
    if (user) {
      if (user && user.status === 1) {
        if (user && user.role === "Admin") {
          navigate("/admin/dashboard");
        } else if (user && user.role === "Asm") {
          navigate("/asm/dashboard");
        } else if (user && user.role === "Ad") {
          navigate("/ad/dashboard");
        } else if (user && (user.role === "Ret" || user.role === "Dd")) {
          navigate("/customer/dashboard", { state: { login: true } });
        } else if (user && user.role === "Acc") {
          navigate("/account/dashboard");
        } else if (user && user.role === "Api") {
          navigate("/api-user/dashboard");
        } else {
          navigate("/other/dashboard");
        }
      }
    } else {
      navigate("/login");
    }
  };
  return (
    <img
      src={loginPage1}
      width={width}
      alt="logo"
      style={{ paddingLeft: pl, ...style }}

      onClick={() => {
        handleClick();
      }}

    />
  
  );
};

export default LogoComponent;
