import { useContext, useState } from "react";
import { get, getAxios } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
// import AuthContext from "../store/AuthContext";
import { apiErrorToast } from "./ToastUtil";


export const fetchUserAgain = ({setProgress, authCtx}) => {
    // const authCtx = useContext(AuthContext);
    const access = authCtx.token;
    get(
      ApiEndpoints.GET_ME_USER,
      "",
      setProgress,
      (res) => {
        getAxios(access);
        const newuser = res.data.data;
        const docs = res.data.docs;
        authCtx.saveUser(newuser);
        if (docs && typeof docs === "object") {
          authCtx.setDocsInLocal(docs);
        }
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };