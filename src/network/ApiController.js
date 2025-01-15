import Axios from "axios";
import useAxios, { configure } from "axios-hooks";
import Swal from "sweetalert2";
import { apiErrorToast, toastWithTimer } from "../utils/ToastUtil";
import { checkNetwork } from "../utils/NatworkUtil";
import { BASE_URL } from "./ApiEndPoints";
import LRU from "lru-cache";
import HashPayload from "../utils/HashPayload";

const cache = new LRU({ max: 10 });

let axios;
const deleteUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  localStorage.removeItem("user_nepal");
  localStorage.removeItem("nepal_token");
  localStorage.removeItem("location");
  localStorage.removeItem("docs");
  localStorage.removeItem("MoneyTransfer");
  localStorage.removeItem("items");
  localStorage.removeItem("subIndex");
  localStorage.removeItem("selectedRow");
  localStorage.removeItem("index");
  setTimeout(() => {
    window.open("/login", "_self");
  }, 100);
};

export const getAxios = (token = null) => {
  if (!token) {
    token = localStorage.getItem("access_token");
  }
  axios = Axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token && token}`,
    },
  });
  configure({ axios, cache });

  axios.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      //console.log(config);
      config.headers["Content-Type"] = "application/json";
      //alert("Token set");
      return config;
    },

    function (error) {
      // Do something with request error
      // console.log(error);
      return Promise.reject(error);
    }
  );
  return axios;
};
// self invoke for first time
getAxios();
export const useAx = (endpoint) => {
  return useAxios(endpoint);
};

export const onInValidAuth = (error, next) => {
  // alert(JSON.stringify(error.response));
  if (error.response && error.response.status === 401) {
    // alert(error.response.message);
    Swal.fire("Unathorized, you need to Relogin.");
    deleteUser();
    // history.pushState(history.state, "login", "/login");
    // location.reload();
  }
  //alert("error " + error);
  if (next) {
    next(error);
  } else {
    apiErrorToast(error);
  }
};
export const postFormData = (
  endpoint,
  formData,
  setIsProgress,
  onSuccess,
  onError
) => {
  if (setIsProgress) setIsProgress(true);
  if (!checkNetwork()) {
    if (setIsProgress) setIsProgress(false);
    toastWithTimer(
      '<div class="styled-msg">Kindly login again<strong class="redbox"></strong></div>',
      5000,
      "Network connection error",
      deleteUser
    );
    // Swal.fire("Check your network Connection!!!");
    return false;
  }
  axios
    .post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
    .then((response) => {
      const data = response;
      onSuccess(data);
      if (setIsProgress) setIsProgress(false);
    })
    .catch((error) => {
      if (setIsProgress) setIsProgress(false);
      onInValidAuth(error, onError);
    });
};

export const postFormDataQuery = (
  endpoint,
  formData,
  setIsProgress,
  onSuccess,
  onError,
  query
) => {
  if (setIsProgress) setIsProgress(true);
  if (!checkNetwork()) {
    if (setIsProgress) setIsProgress(false);
    toastWithTimer(
      '<div class="styled-msg">Kindly login again<strong class="redbox"></strong></div>',
      5000,
      "Network connection error",
      deleteUser
    );
    // Swal.fire("Check your network Connection!!!");
    return false;
  }
  axios
    .post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      params: query,
    })
    .then((response) => {
      const data = response;
      onSuccess(data);
      if (setIsProgress) setIsProgress(false);
    })
    .catch((error) => {
      if (setIsProgress) setIsProgress(false);
      onInValidAuth(error, onError);
    });
};
export const putFormData = (
  id,
  endpoint,
  formData,
  setIsProgress,
  onSuccess,
  onError
) => {
  setIsProgress(true);
  if (!checkNetwork()) {
    if (setIsProgress) setIsProgress(false);
    toastWithTimer(
      '<div class="styled-msg">Kindly login again<strong class="redbox"></strong></div>',
      5000,
      "Network connection error",
      deleteUser
    );
    // Swal.fire("Check your network Connection!!!");
    return false;
  }
  axios
    .put(endpoint + "/" + id, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
    .then((response) => {
      const data = response.data;
      onSuccess(data);
      setIsProgress(false);
    })
    .catch((error) => {
      setIsProgress(false);
      onInValidAuth(error, onError);
    });
};

export const putJsonData = (
  endpoint,
  jsonData,
  queryString,
  setIsProgress,
  onSuccess,
  onError
) => {
  setIsProgress(true);
  if (!checkNetwork()) {
    if (setIsProgress) setIsProgress(false);
    toastWithTimer(
      '<div class="styled-msg">Kindly login again<strong class="redbox"></strong></div>',
      5000,
      "Network connection error",
      deleteUser
    );
    // Swal.fire("Check your network Connection!!!");
    return false;
  }
  axios
    .put(`${endpoint}${queryString && queryString + "/"}`, jsonData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
    .then((response) => {
      const data = response;
      onSuccess(data);
      setIsProgress(false);
    })
    .catch((error) => {
      setIsProgress(false);
      onInValidAuth(error, onError);
    });
};

export const postJsonData = (
  endpoint,
  jsonData,
  setIsProgress,
  onSuccess,
  onError
) => {
  // Uncomment below line to implement payload hash
  jsonData = HashPayload(jsonData);
  if (setIsProgress) setIsProgress(true);
  if (!checkNetwork()) {
    if (setIsProgress) setIsProgress(false);
    toastWithTimer(
      '<div class="styled-msg">Kindly login again<strong class="redbox"></strong></div>',
      5000,
      "Network connection error",
      deleteUser
    );
    // Swal.fire("Check your network Connection!!!");
    return false;
  }
  return axios
    .post(
      endpoint,
      jsonData,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          Cookie: "cookie1-value;",
        },
      },

      { withCredentials: true }
    )
    .then((response) => {
      const data = response;

      onSuccess(data);
      if (setIsProgress) setIsProgress(false);
    })
    .catch((error) => {
      // Swal.fire("post error", JSON.stringify(JSON.stringify(error.message)));
      if (error && error.message === "Network Error") {
        // history.pushState(history.state, "login", "/login");
        // location.reload();
      } else {
        if (setIsProgress) setIsProgress(false);
        onInValidAuth(error, onError);
      }
      if (setIsProgress) setIsProgress(false);
    });
};
export const postJsonDataQuery = (
  endpoint,
  jsonData,
  setIsProgress,
  onSuccess,
  onError,
  query
) => {
  if (setIsProgress) setIsProgress(true);
  //console.log("data => "+JSON.stringify(jsonData))
  if (!checkNetwork()) {
    if (setIsProgress) setIsProgress(false);
    toastWithTimer(
      '<div class="styled-msg">Kindly login again<strong class="redbox"></strong></div>',
      5000,
      "Network connection error",
      deleteUser
    );
    // Swal.fire("Check your network Connection!!!");
    return false;
  }
  return axios
    .post(endpoint, jsonData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      params: query,
    })
    .then((response) => {
      const data = response;
      // console.log("api response=> ", JSON.stringify(response));
      // okSuccessToast("Success", JSON.stringify(data));
      onSuccess(data);
      if (setIsProgress) setIsProgress(false);
    })
    .catch((error) => {
      // Swal.fire("post error", JSON.stringify(JSON.stringify(error.message)));
      if (error && error.message === "Network Error") {
        // history.pushState(history.state, "login", "/login");
        // location.reload();
      } else {
        if (setIsProgress) setIsProgress(false);
        onInValidAuth(error, onError);
      }
      if (setIsProgress) setIsProgress(false);
    });
};
export const deleteJsonData = (
  endpoint,
  jsonData,
  queryString,
  setIsProgress,
  onSuccess,
  onError
) => {
  console.log("req body", jsonData);
  if (setIsProgress) setIsProgress(true);
  if (!checkNetwork()) {
    if (setIsProgress) setIsProgress(false);
    toastWithTimer(
      '<div class="styled-msg">Kindly login again<strong class="redbox"></strong></div>',
      5000,
      "Network connection error",
      deleteUser
    );
    // Swal.fire("Check your network Connection!!!");
    return false;
  }
  axios
    .delete(`${endpoint}${queryString && `${queryString}`}`, {
      data: jsonData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
    .then((response) => {
      const data = response;
      onSuccess(data);
      if (setIsProgress) setIsProgress(false);
    })
    .catch((error) => {
      if (setIsProgress) setIsProgress(false);
      onInValidAuth(error, onError);
    });
};
export const getRequest = (endpoint, setIsProgress, onSuccess, onError) => {
  if (setIsProgress) setIsProgress(true);
  if (!checkNetwork()) {
    if (setIsProgress) setIsProgress(false);
    toastWithTimer(
      '<div class="styled-msg">Kindly login again<strong class="redbox"></strong></div>',
      5000,
      "Network connection error",
      deleteUser
    );
    // Swal.fire("Check your network Connection!!!");
    return false;
  }
  axios
    .get(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
    .then((response) => {
      const data = response;
      onSuccess(data);
      if (setIsProgress) setIsProgress(false);
    })
    .catch((error) => {
      if (setIsProgress) setIsProgress(false);
      onInValidAuth(error, onError);
    });
};
export const get = (
  endpoint,
  queryString,
  setIsProgress,
  onSuccess,
  onError
) => {
  if (setIsProgress) setIsProgress(true);
  if (!checkNetwork()) {
    if (setIsProgress) setIsProgress(false);
    toastWithTimer(
      '<div class="styled-msg">Kindly login again<strong class="redbox"></strong></div>',
      5000,
      "Network connection error",
      deleteUser
    );
    // Swal.fire("Check your network Connection!!!");
    return false;
  }
  axios
    .get(`${endpoint}${queryString && `?${queryString}`}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
    .then((response) => {
      const data = response;
      onSuccess(data);
      if (setIsProgress) setIsProgress(false);
    })
    .catch((error) => {
      onInValidAuth(error, onError);
      if (setIsProgress) setIsProgress(false);
    });
};
export const patchJsonData = (
  endpoint,
  jsonData,
  pathParam,
  setIsProgress,
  onSuccess,
  onError
) => {
  if (setIsProgress) setIsProgress(true);
  //console.log("data => "+JSON.stringify(jsonData))
  if (!checkNetwork()) {
    if (setIsProgress) setIsProgress(false);
    toastWithTimer(
      '<div class="styled-msg">Kindly login again<strong class="redbox"></strong></div>',
      5000,
      "Network connection error",
      deleteUser
    );
    // Swal.fire("Check your network Connection!!!");
    return false;
  }
  return axios
    .patch(`${endpoint}${pathParam && pathParam + "/"}`, jsonData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
    .then((response) => {
      const data = response;
      // console.log("api response=> ", JSON.stringify(response));
      // okSuccessToast("Success", JSON.stringify(data));
      onSuccess(data);
      if (setIsProgress) setIsProgress(false);
    })
    .catch((error) => {
      // Swal.fire("post error", JSON.stringify(JSON.stringify(error.message)));
      if (error && error.message === "Network Error") {
        // history.pushState(history.state, "login", "/login");
        // location.reload();
      } else {
        if (setIsProgress) setIsProgress(false);
        onInValidAuth(error, onError);
      }
    });
};

export const loginApi = (
  endpoint,
  jsonData,
  setIsProgress,
  onSuccess,
  onError
) => {
  if (setIsProgress) setIsProgress(true);
  axios
    .post(endpoint, jsonData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `null`,
      },
    })
    .then((response) => {
      const data = response;
      onSuccess(data);
      if (setIsProgress) setIsProgress(false);
    })
    .catch((error) => {
      onInValidAuth(error, onError);
      if (setIsProgress) setIsProgress(false);
    });
};
