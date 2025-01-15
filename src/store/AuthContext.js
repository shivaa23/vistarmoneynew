import React, { useState, createContext } from "react";

import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast } from "../utils/ToastUtil";

const AuthContext = createContext({
  token: "",
  nepalToken: "",
  user: "",
  nepalUser: "",
  ifDocsUploaded: "",
  location: "",
  isLoggedIn: false,
  login: (token) => {},
  saveUser: (user) => {},
  saveNepalUser: (user) => {},
  logout: () => {},
  setLocation: (lat, long) => {},
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("access_token");
  const initialNepalToken = localStorage.getItem("nepal_token");
  const initialUser = JSON.parse(localStorage.getItem("user"));
  const initialNepalUser = JSON.parse(localStorage.getItem("user_nepal"));
  const docsData = JSON.parse(localStorage.getItem("docs"));
  const [token, setToken] = useState(initialToken);
  const [nepalToken, setNepalToken] = useState(initialNepalToken);
  const [user, setUser] = useState(initialUser);
  const [apiBal, setApiBal] = useState();
  const [parentResponse, setParentResponse] = useState();
  const [currentView, setCurrentView] = useState(null);
  const [location, setLocation] = useState(
    JSON.parse(localStorage.getItem("location"))
  );
  const [nepalUser, setNepalUser] = useState(initialNepalUser);
  const userIsLoggedIn = !!token;

  const [ifDocsUploaded, setIfDocsUploaded] = useState(docsData);

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem("access_token", token);
  };
  const nepalTokenSetter = (token) => {
    setNepalToken(token);
    localStorage.setItem("nepal_token", token);
  };
  const userHandler = (passedUser) => {
    localStorage.setItem("user", JSON.stringify(passedUser));
    setUser(passedUser);
  };
  const nepalUserHandler = (passedUser) => {
    localStorage.setItem("user_nepal", JSON.stringify(passedUser));
    setNepalUser(passedUser);
  };

  const logOutFromApi = () => {
    postJsonData(
      ApiEndpoints.LOGOUT,
      {},
      null,
      (res) => {
        console.log("logout");
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const logOutHandler = () => {
    logOutFromApi();
    setToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("aepsType");
    localStorage.removeItem("user");
    localStorage.removeItem("user_nepal");
    localStorage.removeItem("nepal_token");
    localStorage.removeItem("location");
    localStorage.removeItem("docs");
    localStorage.removeItem("MoneyTransfer");
  };

  const latLongHandler = (lat, long) => {
    setLocation({ lat, long });
    localStorage.setItem("location", JSON.stringify({ lat, long }));
  };

  const setDocsInLocal = (options) => {
    localStorage.setItem("docs", JSON.stringify(options));
    setIfDocsUploaded(options);
  };

  const contextValue = {
    token: token,
    apiBal: apiBal,
    nepalToken: nepalToken,
    user: user,
    nepalUser: nepalUser,
    location: location,
    currentView: currentView,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    nepalTokenSetter: nepalTokenSetter,
    logout: logOutHandler,
    saveUser: userHandler,
    saveNepalUser: nepalUserHandler,
    setLocation: latLongHandler,
    setDocsInLocal,
    setApiBal: setApiBal,
    setCurrentView: setCurrentView,
    setParentResponse: setParentResponse,
    ifDocsUploaded,
    parentResponse: parentResponse,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
