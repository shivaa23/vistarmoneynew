import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import Mount from "../component/Mount";
import { DateRangePicker } from "rsuite";
import Loader from "../component/loading-screen/Loader";
import { yyyymmdd } from "../utils/DateUtils";
import {
  BeneKycStatus,
  COMPLAINT_STATUS,
  ROLE_LIST,
  OPERATORLIST,
} from "../utils/constants";
import { get } from "../network/ApiController";
import { apiErrorToast } from "../utils/ToastUtil";
import ApiEndpoints from "../network/ApiEndPoints";
import useResponsive from "../hooks/useResponsive";
import OperatorSearch from "../component/OperatorSearch";
import CommonSearchField from "../component/CommonSearchField";
import predefinedRanges from "../utils/predefinedRanges";
import AuthContext from "../store/AuthContext";
import { useLocation } from "react-router-dom";
const FilterCard = ({
  isTransaction = false,
  query,
  refreshTab,
  setRefreshTab,
  setResetFilter = () => {},
  setQuery,
  clearHookCb,
  typeList = [],
  statusList = [],
  getTypes,
  refresh,
  tabQueryreset = true,
  ifTypeFilter = false,

  chooseInitialCategoryFilter = false,
  ifAdIdFilter = false,
  ifBankFilter = false,
  ifnameFilter = false,
  ifUsernameFilter = false,
  ifrouteFilter = false,
  ifoperatorFilter = false,
  ifStatusFilter = false,
  ifstatusFilter2 = false,
  iforderidFilter = false,
  ifClientIdFilter = false,
  ifestFilter = false,
  ifnumberFilter = false,
  ifotherFilter = false,
  ifdateFilter = false,
  ifRoleFilter = false,
  ifAsmFilter = false,
  ifPartnerPinNoFilter = false,
  ifInstIdFilter = false,
  ifFingIdFilter = false,
  ifIrctcIdFilter = false,
  ifComplaintStatus = false,
  ifBeneKycStatus = false,
  ifOperatorFilter = false,
  ifPlanFilter = false,
  ifFromBankFilter = false,
  ifMessageFilter = false,
  ififStatusFiltertatusFilter = false,
  ifSenderNameFilter = false,
  ifaccountNumberFilter = false,
  ifUtrFilter = false,
  iftxnIdFilter = false,
  ifsubtypeFilter = false,
  ifamountFilter = false,
  ifdescriptionFilter = false,
  ifipaddressFilter = false,

  roleList = ROLE_LIST,
  operatorList = OPERATORLIST,
  asmList,
  handleClose,
  fromOperatorPage = false,
  // new desgin changes
  backButton,
  actionButtons,
  showSearch,
  topMargin = 0,
  bottomMargin = 0,
}) => {
  const { afterToday } = DateRangePicker;
  const [numberVal, setNumberVal] = useState();
  const [orderIdVal, setOrderIdVal] = useState();
  const [clientIdVal, setClientIdVal] = useState();
  const [estVal, setEstVal] = useState();
  const [infoVal, setInfoVal] = useState("");
  const [statusVal, setStatusVal] = useState("");
  const [routeVal, setRouteVal] = useState("");
  const [optVal, setOptVal] = useState("");
  const [typeVal, setTypeVal] = useState("");
  const [nameVal, setNameVal] = useState("");
  const [usernameVal, setUsernameVal] = useState("");
  const [asmVal, setAsmVal] = useState("");
  const [roleVal, setRoleVal] = useState("");
  const [adIdVal, setAdIdVal] = useState("");
  const [bankVal, setBankVal] = useState("");
  const [instId, setInstId] = useState("");
  const [fingId, setFingId] = useState("");
  const [beneKycStatus, setBeneKycStatus] = useState("");
  const [irctcId, setIrctcId] = useState("");
  const [operator, setOperator] = useState("");
  const [plan, setPlan] = useState("");
  const [fromBank, SetFromBank] = useState("");
  const [message, SetMessage] = useState("");

  const [senderName, setSenderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [utr, setUtr] = useState("");
  const [txn_id, setTxnId] = useState("");
  const [sub_type, setSub_type] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const authCtx = useContext(AuthContext);
  const { user } = authCtx;
  const role = user?.role;
  // console.log("role", role);
  // console.log("adIdVal", adIdVal);
  // console.log("fingId", fingId);
  const location = useLocation();
  const [adList, setAdList] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [status, setStatus] = useState(
    location.pathname === "/customer/cred-req" ||
      location.pathname === "/ad/cred-req" ||
      location.pathname === "/admin/cred-req" ||
      location.pathname === "/ad/cred-req"
      ? "PENDING"
      : ""
  );
  const [adApiLoader, setAdApiLoader] = useState(false);
  // console.log("adList", adList);
  const [ip, setIp] = useState("");
  const [partnerPinNo, setPartnerPinNo] = useState("");
  const today = new Date();
  const [filterValues, setFilterValues] = useState({
    date: { start: "", end: "" },
    dateVal: "",
  });
  // const todayFilterValues = {
  //   date: { start: yyyymmdd(today), end: yyyymmdd(today) },
  //   dateVal: [today, today],
  // };
  const isMobile = useResponsive("down", "sm");
  const [request, setRequest] = useState(false);
  const [routeList, setRouteList] = useState([]);
  const [complaintStatus, setComplaintStatus] = useState("OPEN");
  // console.log("====================================");
  // console.log(complaintStatus);
  // console.log("====================================");
  console.log("refreshTab is ", refreshTab);
  const handleChangeOperator = (event) => {
    if (event.target.value !== "Operators") {
      setQuery(`operator=${event.target.value}`);
    }
  };

  useEffect(() => {
    // console.log("Entered Filter Card UseEffect");
    if (user?.role !== "Admin" && isTransaction) {
      setFilterValues({
        date: { start: yyyymmdd(today), end: yyyymmdd(today) },
        dateVal: [today, today],
      });
      let filter = "";
      // if (filterValues.date.start || filterValues.date.end) {
      filter =
        filter +
        (filter ? "&" : "") +
        "start=" +
        filterValues.date.start +
        // todayFilterValues.date.start +
        "&end=" +
        filterValues.date.end;
      // todayFilterValues.date.end;
      // }
      setQuery(filter);
    }
  }, [isTransaction]);

  // console.log("22222222222222222222222222", user.role, isTransaction);

  const getRouteValApi = () => {
    if (routeList.length === 0) {
      get(
        ApiEndpoints.GET_ROUTE,
        "",
        setRequest,
        (res) => {
          const routeArray = res.data.data;
          const routeData = routeArray.map((item) => {
            return {
              code: item.code,
              name: item.name,
            };
          });
          setRouteList(routeData);
        },
        (error) => {
          apiErrorToast(error);
        }
      );
    }
  };

  const [dataFetched, setDataFetched] = useState(false); // New flag to track API call status

  const getAdValue = () => {
    setAdApiLoader(true);
    get(
      ApiEndpoints.GET_USERS,
      `page=1&paginate=10&role=Ad&platform=WEB&export=`,
      setAdApiLoader,
      (res) => {
        const adArray = res.data.data;
        setAdList(
          adArray &&
            adArray.map((item) => ({
              id: item.id,
              name: item.establishment,
              username: item.username,
            }))
        );
        setDataFetched(true); // Set flag to true after fetching data
      },
      (error) => {
        apiErrorToast(error);
        setDataFetched(false); // Reset in case of error
      }
    );
  };
  const getBankValue = () => {
    setAdApiLoader(true);
    get(
      ApiEndpoints.GET_BANKS,
      `page=1&paginate=10&role=Ad&platform=WEB&export=`,
      setAdApiLoader,
      (res) => {
        const adArray = res.data.data;
        setBankList(
          adArray &&
            adArray.map((item) => ({
              id: item.id,
              name: item.name,
              username: item.username,
            }))
        );
        setDataFetched(true); // Set flag to true after fetching data
      },
      (error) => {
        apiErrorToast(error);
        setDataFetched(false); // Reset in case of error
      }
    );
  };

  const handleFocus = () => {
    if (adList.length < 1 && !dataFetched) {
      getAdValue();
    }
  };
  const handleFocusBank = () => {
    if (bankList.length < 1 && !dataFetched) {
      getBankValue();
    }
  };

  // useEffect(() => {
  //   if (ifAdIdFilter) getAdValue();
  // }, []);

  function createFilterQuery(
    numberVal,
    orderIdVal,
    clientIdVal,
    estVal,
    infoVal,
    routeVal,
    optVal,
    statusVal,
    typeVal,
    roleVal,
    asmVal,
    adIdVal,
    bankVal,
    instId,
    fingId,
    beneKycStatus,
    complaintStatus,
    irctcId,
    operator,
    plan,
    frombank,
    message,
    status,
    senderName,
    accountNumber,
    utr,
    txn_id,
    sub_type,
    amount,
    description,
    ip
  ) {
    let filter = "";
    if (typeVal) {
      filter = filter + "category=" + (typeVal && typeVal);
    }
    if (filterValues.date.start || filterValues.date.end) {
      filter =
        filter +
        (filter ? "&" : "") +
        "start=" +
        filterValues.date.start +
        "&end=" +
        filterValues.date.end;
    }
    if (numberVal) {
      filter =
        filter + (filter ? "&" : "") + "number=" + (numberVal && numberVal);
    }
    if (partnerPinNo) {
      filter =
        filter +
        (filter ? "&" : "") +
        "PartnerPinNo=" +
        (partnerPinNo && partnerPinNo);
    }
    if (nameVal) {
      filter = filter + (filter ? "&" : "") + "name=" + (nameVal && nameVal);
    }
    if (usernameVal) {
      filter =
        filter +
        (filter ? "&" : "") +
        "username=" +
        (usernameVal && usernameVal);
    }
    if (orderIdVal) {
      filter =
        filter + (filter ? "&" : "") + "order_id=" + (orderIdVal && orderIdVal);
    }
    if (clientIdVal) {
      filter =
        filter +
        (filter ? "&" : "") +
        "client_id=" +
        (clientIdVal && clientIdVal);
    }
    if (estVal) {
      filter =
        filter + (filter ? "&" : "") + "establishment=" + (estVal && estVal);
    }
    if (infoVal) {
      filter = filter + (filter ? "&" : "") + "ben_acc=" + (infoVal && infoVal);
    }
    if (routeVal) {
      // console.log("v=>", routeVal);
      filter = filter + (filter ? "&" : "") + "route=" + (routeVal && routeVal);
    }
    if (optVal) {
      filter = filter + (filter ? "&" : "") + "op_code=" + (optVal && optVal);
    }
    if (statusVal) {
      filter =
        filter +
        (filter ? "&" : "") +
        `${fromOperatorPage ? "active=" : "status="}` +
        (statusVal && statusVal);
    }
    if (roleVal) {
      filter = filter + (filter ? "&" : "") + "role=" + (roleVal && roleVal);
    }
    if (asmVal) {
      filter = filter + (filter ? "&" : "") + "asm=" + (asmVal && asmVal);
    }
    if (adIdVal?.value) {
      filter =
        filter + (filter ? "&" : "") + "ad_id=" + (adIdVal && adIdVal.value);
    }
    if (bankVal?.value) {
      filter =
        filter + (filter ? "&" : "") + "bank=" + (bankVal && bankVal.value);
    }
    if (instId) {
      filter = filter + (filter ? "&" : "") + "instId=" + (instId && instId);
    }
    if (fingId) {
      filter = filter + (filter ? "&" : "") + "fingId=" + (fingId && fingId);
    }
    if (beneKycStatus) {
      filter =
        filter +
        (filter ? "&" : "") +
        "kyc_status=" +
        (beneKycStatus && beneKycStatus * 1);
    }
    // if (complaintStatus) {
    //   filter =
    //     filter +
    //     (filter ? "&" : "") +
    //     "status=" +
    //     (complaintStatus && complaintStatus);
    // }
    if (irctcId) {
      filter =
        filter + (filter ? "&" : "") + "irctc_id=" + (irctcId && irctcId);
    }
    if (operator) {
      filter =
        filter + (filter ? "&" : "") + "operator=" + (operator && operator);
    }
    if (plan) {
      filter = filter + (filter ? "&" : "") + "plan=" + (plan && plan);
    }
    if (frombank) {
      filter =
        filter + (filter ? "&" : "") + "fromBank=" + (frombank && frombank);
    }
    if (message) {
      filter = filter + (filter ? "&" : "") + "message=" + (message && message);
    }
    if (status) {
      filter = filter + (filter ? "&" : "") + "status=" + (status && status);
    }
    if (senderName) {
      filter =
        filter +
        (filter ? "&" : "") +
        "senderName=" +
        (senderName && senderName);
    }
    if (accountNumber) {
      filter =
        filter +
        (filter ? "&" : "") +
        "accountNumber=" +
        (accountNumber && accountNumber);
    }
    if (utr) {
      filter = filter + (filter ? "&" : "") + "utr=" + (utr && utr);
    }
    if (txn_id) {
      filter = filter + (filter ? "&" : "") + "txn_id=" + (txn_id && txn_id);
    }
    if (sub_type) {
      filter =
        filter + (filter ? "&" : "") + "sub_type=" + (sub_type && sub_type);
    }
    if (amount) {
      filter = filter + (filter ? "&" : "") + "amount=" + (amount && amount);
    }
    if (description) {
      filter =
        filter +
        (filter ? "&" : "") +
        "description=" +
        (description && description);
    }
    if (ip) {
      filter = filter + (filter ? "&" : "") + "ip=" + (ip && ip);
    }
    if (handleClose) handleClose();
    return filter;
  }
  // console.log("operaotr", operator);

  const clearHooks = () => {
    setRouteVal("");
    if (
      (role === "Admin" &&
        (location.pathname === "/admin/transactions" ||
          location.pathname === "/admin/users")) ||
      ((role === "Ret" || role === "Dd") &&
        location.pathname === "/customer/transactions") ||
      (role === "Asm" &&
        (location.pathname === "/asm/users" ||
          (role === "Zsm" && location.pathname === "/zsm/users"))) ||
      (role === "Ad" &&
        (location.pathname === "/ad/transactions" ||
          (role === "Md" && location.pathname === "/md/transactions")))
    ) {
      setRefreshTab(0);
    }

    setInstId("");
    setFingId("");
    setIrctcId("");
    setOperator("");
    setPlan("");
    SetFromBank("");
    SetMessage("");
    setStatus(
      location.pathname === "/customer/cred-req" ||
        location.pathname === "/ad/cred-req" ||
        location.pathname === "/admin/cred-req" ||
        location.pathname === "/ad/cred-req"
        ? "ALL"
        : ""
    );
    setSenderName("");
    setAccountNumber("");
    setUtr("");
    setTxnId("");
    setSub_type("");
    setAmount("");
    setDescription("");
    setIp("");

    setBeneKycStatus("");
    setOptVal("");

    setStatusVal("");
    setFilterValues({
      date: {
        start: "",
        end: "",
      },
      dateVal: "",
    });
    setTypeVal("");
    setInfoVal("");
    setEstVal("");
    setNumberVal("");
    setOrderIdVal((prev) => "");
    setClientIdVal("");
    setNameVal("");
    setUsernameVal("");
    setComplaintStatus("OPEN");
    setRoleVal("");
    setAsmVal("");
    setAdIdVal("");
    setBankVal("")
    setPartnerPinNo("");
    if (document.getElementById("est"))
      document.getElementById("est").value = "";
    if (document.getElementById("partner_pin_no"))
      document.getElementById("partner_pin_no").value = "";
    if (document.getElementById("order_id"))
      document.getElementById("order_id").value = null;
    if (document.getElementById("client_id"))
      document.getElementById("client_id").value = "";
    if (document.getElementById("number"))
      document.getElementById("number").value = "";
    if (document.getElementById("info"))
      document.getElementById("info").value = "";
    if (document.getElementById("adId"))
      document.getElementById("adId").value = "";
    if (document.getElementById("fing_id"))
      document.getElementById("fing_id").value = "";
    if (document.getElementById("irctc_id"))
      document.getElementById("irctc_id").value = "";
    if (document.getElementById("complaint_status"))
      document.getElementById("complaint_status").value = "OPEN";
    if (document.getElementById("plan"))
      document.getElementById("plan").value = "";
    if (document.getElementById("operator"))
      document.getElementById("operator").value = "";
    if (document.getElementById("fromBank"))
      document.getElementById("fromBank").value = "";
    if (document.getElementById("message"))
      document.getElementById("message").value = "";
    if (document.getElementById("status"))
      document.getElementById("status").value = "ALL";
    if (document.getElementById("senderName"))
      document.getElementById("senderName").value = "";
    if (document.getElementById("accountNumber"))
      document.getElementById("accountNumber").value = "";
    if (document.getElementById("utr"))
      document.getElementById("utr").value = "";
    if (document.getElementById("txn_id"))
      document.getElementById("txn_id").value = "";
    if (document.getElementById("sub_type"))
      document.getElementById("sub_type").value = "";
    if (document.getElementById("amount"))
      document.getElementById("amount").value = "";
    if (document.getElementById("description"))
      document.getElementById("description").value = "";
    if (document.getElementById("ip")) document.getElementById("ip").value = "";


    setQuery(
      location.pathname === "/customer/cred-req" ||
        location.pathname === "/admin/cred-req" ||
        location.pathname === "/ad/cred-req" ||
        location.pathname === "/ad/cred-req"
        ? "status=ALL"
        : ""
    );
  };
  if (clearHookCb) clearHookCb(clearHooks);
  // setResetFilter(clearHooks)
  useEffect(() => {
    if (chooseInitialCategoryFilter) setTypeVal(chooseInitialCategoryFilter);
  }, [chooseInitialCategoryFilter]);

  return (
    <Box
      sx={{
        px: 2,
        py: -4,
        // pt: -2,
        mt: topMargin,
        mb: bottomMargin,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gridGap: !isMobile ? "10px" : "5px",
          gap: !isMobile ? "5px" : "5px",
          flexWrap: "wrap",
          margin: "0 auto",
          justifyContent: "flex-start",
          flexDirection: isMobile ? "" : "",
        }}
      >
        {!showSearch
          ? backButton && <div className="mx-2 mt-2">{backButton}</div>
          : null}
        {/* selectors */}
        {ifnumberFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "9%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="number"
                variant="standard"
                label="Number"
                onChange={(e) => {
                  setNumberVal(e.target.value);
                }}
              />
            </FormControl>
          </div>
        )}
        {ifUsernameFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "10%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="type"
                value={usernameVal}
                onChange={(e) => {
                  setUsernameVal(e.target.value);
                }}
                variant="standard"
                label="Regd. Mobile No"
              ></TextField>
            </FormControl>
          </div>
        )}
        {ifPlanFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "10.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="plan"
                value={plan}
                onChange={(e) => {
                  setPlan(e.target.value);
                }}
                variant="standard"
                label="Plan"
              />
            </FormControl>
          </div>
        )}
        {ifotherFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "10.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                onChange={(e) => {
                  setInfoVal(e.target.value);
                }}
                id="info"
                variant="standard"
                label="Acc Number"
              />
            </FormControl>
          </div>
        )}
        {iforderidFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "12%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                onChange={(e) => {
                  setOrderIdVal(e.target.value);
                }}
                variant="standard"
                id="order_id"
                label="Order Id"
              />
            </FormControl>
          </div>
        )}
        
        {ifClientIdFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "10.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                sx={{ display: "flex", justifyContent: "start" }}
                onChange={(e) => {
                  setClientIdVal(e.target.value);
                }}
                variant="standard"
                id="client_id"
                label="Client Id"
              />
            </FormControl>
          </div>
        )}
        {ifOperatorFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "10.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="operator"
                select
                label="Operator"
                value={operator}
                variant="standard"
                onChange={(e) => {
                  setOperator(e.target.value);
                }}
              >
                {operatorList.length > 0 &&
                  operatorList.map((item) => {
                    return (
                      <MenuItem dense value={item.value}>
                        {item.label}
                      </MenuItem>
                    );
                  })}
              </TextField>
            </FormControl>
          </div>
        )}
        {ifTypeFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "10.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="type"
                label="Category"
                select
                value={typeVal}
                onChange={(e) => {
                  setTypeVal(e.target.value);
                }}
                onFocus={(e) => {
                  if (getTypes) getTypes();
                }}
                variant="standard"
              >
                {typeList?.length > 0 &&
                  typeList.map((item, index) => {
                    return (
                      <MenuItem dense key={item.name} value={item.name}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
              </TextField>
            </FormControl>
          </div>
        )}
        {ifrouteFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "10.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <Loader loading={request} size="small" />
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="route"
                label="Route"
                select
                value={routeVal && routeVal}
                onChange={(e) => {
                  setRouteVal(e.target.value);
                }}
                onFocus={(e) => {
                  getRouteValApi();
                }}
                variant="standard"
              >
                <MenuItem dense value="Route" sx={{ color: "#000 !important" }}>
                  Route
                </MenuItem>
                {routeList &&
                  routeList.map((item) => {
                    return (
                      <MenuItem dense value={item.code}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
              </TextField>
            </FormControl>
          </div>
        )}
        {ifStatusFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "10.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="status"
                select
                label="status"
                value={status}
                variant="standard"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem sx={{ fontSize: "13px" }} value="ALL">
                  ALL
                </MenuItem>
                <MenuItem sx={{ fontSize: "13px" }} value="PENDING">
                  PENDING
                </MenuItem>
                <MenuItem sx={{ fontSize: "13px" }} value="APPROVED">
                  APPROVED
                </MenuItem>
                <MenuItem sx={{ fontSize: "13px" }} value="REJECTED">
                  REJECTED
                </MenuItem>
              </TextField>
            </FormControl>
          </div>
        )}
        {ifstatusFilter2 && (
          <div
            style={{
              width: isMobile ? "100%" : "10.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="status"
                select
                label="Status"
                value={status}
                variant="standard"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem sx={{ fontSize: "13px" }} value="PENDING">
                  PENDING
                </MenuItem>
                <MenuItem sx={{ fontSize: "13px" }} value="SUCCESS">
                  SUCCESS
                </MenuItem>
                <MenuItem sx={{ fontSize: "13px" }} value="FAILED">
                  FAILED
                </MenuItem>
              </TextField>
            </FormControl>
          </div>
        )}
        {ifBeneKycStatus && (
          <div
            style={{
              width: isMobile ? "100%" : "11.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="kyc_status"
                select
                label="Kyc Status"
                value={beneKycStatus && beneKycStatus}
                variant="standard"
                onChange={(e) => {
                  setBeneKycStatus(e.target.value);
                }}
                // InputProps={{
                //   startAdornment: (
                //     <InputAdornment position="start"></InputAdornment>
                //   ),
                // }}
              >
                {BeneKycStatus.length > 0 &&
                  BeneKycStatus.map((item) => {
                    return (
                      <MenuItem
                        sx={{ fontSize: "14px" }}
                        dense
                        value={item.value}
                      >
                        {item.label}
                      </MenuItem>
                    );
                  })}
              </TextField>
            </FormControl>
          </div>
        )}
        {ifComplaintStatus && (
          <div
            style={{
              width: isMobile ? "100%" : "12.5%",
              overflow: "hidden",

              marginBottom: "4px",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{
                mt: isMobile ? 0 : 2,
                width: "100%",
                textAlign: "start",
              }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="complaint_status"
                select
                label="Complaint Status"
                value={complaintStatus && complaintStatus}
                variant="standard"
                onChange={(e) => {
                  setComplaintStatus(e.target.value);
                }}
                // InputProps={{
                //   startAdornment: (
                //     <InputAdornment position="start"></InputAdornment>
                //   ),
                // }}
              >
                {COMPLAINT_STATUS.length > 0 &&
                  COMPLAINT_STATUS.map((item) => {
                    return (
                      <MenuItem dense value={item.value}>
                        {item.label}
                      </MenuItem>
                    );
                  })}
              </TextField>
            </FormControl>
          </div>
        )}
        {/* search */}
        {ifAsmFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "10.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="asm"
                select
                label="Asm"
                value={asmVal && asmVal}
                variant="standard"
                onChange={(e) => {
                  setAsmVal(e.target.value);
                }}
              >
                {asmList?.length > 0 &&
                  asmList.map((item) => {
                    return (
                      <MenuItem dense value={item.id}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
              </TextField>
            </FormControl>
          </div>
        )}
        {ifAdIdFilter && (
          <div
            style={{
              marginTop: isMobile ? 0 : "10px",
              width: isMobile ? "100%" : "13%",
              // overflow: "hidden",
              // marginTop: ".%",
            }}
            className="mx-2"
          >
            <CommonSearchField
              className="filter-input"
              placeholder="Ad name"
              list={adList}
              labelKey="name"
              valKey="id"
              valueGetter={setAdIdVal}
              filterCardStyle
              onFocus={handleFocus}
              loading={adApiLoader}
            />
          </div>
        )}
        {ifBankFilter && (
          <div
            style={{
              marginTop: isMobile ? 0 : "10px",
              width: isMobile ? "100%" : "13%",
              // overflow: "hidden",
              // marginTop: ".%",
            }}
            className="mx-2"
          >
            <CommonSearchField
              className="filter-input"
              placeholder="Bank name"
              list={bankList}
              labelKey="name"
              ifBankFilter={ifBankFilter}
              valKey="id"
              valueGetter={setBankVal}
              filterCardStyle
              onFocus={handleFocusBank}
              loading={adApiLoader}
            />
          </div>
        )}
        {ifoperatorFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "10%",
              overflow: "hidden",
              marginBottom: "0.2%",
            }}
            className="mx-1"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <OperatorSearch
                className="filter-input"
                variant="standard"
                obj={(op) => {
                  if (op) {
                    setOptVal(op.code);
                  } else {
                    setOptVal(null);
                  }
                }}
                placeholder="Operator"
                size="small"
              />
            </FormControl>
          </div>
        )}
        {ifestFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "12.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{
                mt: isMobile ? "0" : "0",
                mb: "1%",
                width: "100%",
                textAlign: "start",
              }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="est"
                variant="standard"
                label="Establishment"
                onChange={(e) => {
                  setEstVal(e.target.value);
                }}
              />
            </FormControl>
          </div>
        )}
        {ifRoleFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "10.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="role"
                select
                label="Role"
                value={roleVal && roleVal}
                variant="standard"
                onChange={(e) => {
                  setRoleVal(e.target.value);
                }}
              >
                {roleList.length > 0 &&
                  roleList.map((item) => {
                    return (
                      <MenuItem dense value={item.value}>
                        {item.label}
                      </MenuItem>
                    );
                  })}
              </TextField>
            </FormControl>
          </div>
        )}
        {/* inputs */}
        {ifPartnerPinNoFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "12%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                onChange={(e) => {
                  setPartnerPinNo(e.target.value);
                }}
                variant="standard"
                id="partner_pin_no"
                label="Partner Pin No"
              />
            </FormControl>
          </div>
        )}{" "}
        {ifnameFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "10.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="type"
                value={nameVal && nameVal}
                onChange={(e) => {
                  setNameVal(e.target.value);
                }}
                variant="standard"
                label="Name"
              ></TextField>
            </FormControl>
          </div>
        )}
        {ifInstIdFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "12%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{
                mt: isMobile ? 0 : 0,
                mb: "1%",
                width: "100%",
                textAlign: "start",
              }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                onChange={(e) => {
                  setInstId(e.target.value);
                }}
                variant="standard"
                id="order_id"
                label="Outlet Id"
              />
            </FormControl>
          </div>
        )}
        {ifFingIdFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "12%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                onChange={(e) => {
                  setFingId(e.target.value);
                }}
                variant="standard"
                id="fing_id"
                label="Fing Id"
              />
            </FormControl>
          </div>
        )}
        {ifIrctcIdFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "12%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                onChange={(e) => {
                  setIrctcId(e.target.value);
                }}
                variant="standard"
                id="irctc_id"
                label="IRCTC Id"
              />
            </FormControl>
          </div>
        )}
        {ifdateFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "16.5%",
              overflow: "hidden",
              marginBottom: "0.4%",
            }}
            className="mx-2 "
          >
            <FormControl
              className="filter-date"
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <DateRangePicker
                size="md"
                editable
                ranges={predefinedRanges}
                cleanable
                showOneCalendar
                placeholder="Date"
                placement="bottomEnd"
                value={filterValues && filterValues.dateVal}
                onChange={(value) => {
                  let dateVal = value;
                  if (value) {
                    setFilterValues({
                      ...filterValues,
                      dateVal,
                      date: {
                        start: yyyymmdd(dateVal && dateVal[0]),
                        end: yyyymmdd(dateVal && dateVal[1]),
                      },
                    });
                  } else {
                    setFilterValues({
                      ...filterValues,
                      dateVal,
                      date: {},
                    });
                  }
                }}
                disabledDate={afterToday()}
              />
            </FormControl>
          </div>
        )}
        {ifMessageFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "10.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="type"
                value={message}
                onChange={(e) => {
                  SetMessage(e.target.value);
                }}
                variant="standard"
                label="Message"
              />
            </FormControl>
          </div>
        )}
        {ifFromBankFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "fit-content",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="type"
                value={fromBank}
                onChange={(e) => {
                  SetFromBank(e.target.value);
                }}
                variant="standard"
                label="From"
              />
            </FormControl>
          </div>
        )}
        {ifSenderNameFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "10.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="type"
                value={senderName}
                onChange={(e) => {
                  setSenderName(e.target.value);
                }}
                variant="standard"
                label="SenderName"
              />
            </FormControl>
          </div>
        )}
        {ifaccountNumberFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "10.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="type"
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value);
                }}
                variant="standard"
                label="AccountNo"
              />
            </FormControl>
          </div>
        )}
        {ifUtrFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "10.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="type"
                value={utr}
                onChange={(e) => {
                  setUtr(e.target.value);
                }}
                variant="standard"
                label="UTR"
              />
            </FormControl>
          </div>
        )}
        {iftxnIdFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "10.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="type"
                value={txn_id}
                onChange={(e) => {
                  setTxnId(e.target.value);
                }}
                variant="standard"
                label="Txn Id"
              />
            </FormControl>
          </div>
        )}
        {ifsubtypeFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "10.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="type"
                value={sub_type}
                onChange={(e) => {
                  setSub_type(e.target.value);
                }}
                variant="standard"
                label="Sub Type"
              />
            </FormControl>
          </div>
        )}
        {ifamountFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "10.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="type"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                variant="standard"
                label="Amount"
              />
            </FormControl>
          </div>
        )}
        {ifdescriptionFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "10.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="type"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                variant="standard"
                label="description"
              />
            </FormControl>
          </div>
        )}
         {ifipaddressFilter && (
          <div
            style={{
              width: isMobile ? "100%" : "10.5%",
              overflow: "hidden",
            }}
            className="mx-2"
          >
            <FormControl
              sx={{ mt: isMobile ? 0 : 0, width: "100%", textAlign: "start" }}
            >
              <TextField
                autoComplete="off"
                className="filter-input"
                size={isMobile ? "small" : "small"}
                id="type"
                value={ip}
                onChange={(e) => {
                  setIp(e.target.value);
                }}
                variant="standard"
                label="IP Address"
              />
            </FormControl>
          </div>
        )}
        {/* buttons */}
        <div
          style={{
            width: isMobile ? "100%" : "fit-content",
            overflow: "hidden",
          }}
          className="me-3"
        >
          <FormControl
            sx={{
              mt: isMobile ? 0 : 0,
              width: "100%",
              textAlign: "start",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Tooltip title="apply filter">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#f39c12",
                  color: "white",
                  padding: "6px ",
                  fontSize: "13px",
                  borderRadius: "8px",
                  textTransform: "capitalize",
                  boxShadow: "0px 4px 12px rgba(243, 156, 18, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#e67e22",
                    borderRadius: "8px",
                    boxShadow: "0px 6px 14px rgba(230, 126, 34, 0.3)",
                    transform: "scale(1)",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}
                onClick={() => {
                  if (query) {
                    setQuery(
                      createFilterQuery(
                        numberVal,
                        orderIdVal,
                        clientIdVal,
                        estVal,
                        infoVal,
                        routeVal,
                        optVal,
                        statusVal,
                        typeVal,
                        roleVal,
                        asmVal,
                        adIdVal,
                        bankVal,
                        instId,
                        fingId,
                        beneKycStatus,
                        complaintStatus,
                        irctcId,
                        operator,
                        plan,
                        fromBank,
                        message,
                        status,
                        senderName,
                        accountNumber,
                        utr,
                        txn_id,
                        sub_type,
                        amount,
                        description,
                        ip
                      )
                    );
                    if (refresh) refresh();
                  } else {
                    setQuery(
                      createFilterQuery(
                        numberVal,
                        orderIdVal,
                        clientIdVal,
                        estVal,
                        infoVal,
                        routeVal,
                        optVal,
                        statusVal,
                        typeVal,
                        roleVal,
                        asmVal,
                        adIdVal,
                        bankVal,
                        instId,
                        fingId,
                        beneKycStatus,
                        complaintStatus,
                        irctcId,
                        operator,
                        plan,
                        fromBank,
                        message,
                        status,
                        senderName,
                        accountNumber,
                        utr,
                        txn_id,
                        sub_type,
                        amount,
                        description,
                        ip
                      )
                    );
                  }
                }}
              >
                Search
              </Button>
            </Tooltip>
            <Mount visible={query?.length > 0}>
              <Tooltip title="clear filter">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#ff4757", // Bright red color
                    color: "white",
                    padding: "6px",
                    fontSize: "13px",
                    ml: 1,
                    borderRadius: "8px",
                    textTransform: "Capitalize",
                    boxShadow: "0px 4px 12px rgba(255, 71, 87, 0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#e84118",
                      borderRadius: "8px",
                      boxShadow: "0px 8px 14px rgba(232, 65, 24, 0.3)",
                      transform: "scale(1)",
                    },
                    "&:active": {
                      transform: "scale(0.98)",
                    },
                  }}
                  type="reset"
                  onClick={() => {
                    clearHooks();
                  }}
                >
                  {/* <CloseIcon
                    onClick={() => {
                      clearHooks();
                    }}
                    sx={{
                      color: "white",
                      backgroundColor: "red",
                     

                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                  /> */}
                  reset
                </Button>
              </Tooltip>
            </Mount>
          </FormControl>
        </div>
        {!showSearch ? actionButtons && actionButtons : null}
      </div>
      {/* </Box> */}

      {/* <Divider sx={{ mt: 2, borderBottom: `2px solid white` }} /> */}
    </Box>
  );
};

export default FilterCard;
