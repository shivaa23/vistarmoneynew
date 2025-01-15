import React, { useState, useEffect } from "react";
import { get, postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast } from "../utils/ToastUtil";
import AuthContext from "../store/AuthContext";
import { useContext } from "react";
import CheckIcon from "@mui/icons-material/Check";
import BarChartIcon from "@mui/icons-material/BarChart";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Admindashboard } from "../ComponentImports";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import InterpreterModeIcon from '@mui/icons-material/InterpreterMode';
const Dashboard = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [request, setRequest] = useState(false);
  const [graphDuration, setGraphDuration] = useState("TODAY");
  const [transactionData, setTransactionData] = useState([])
  const [userData, setUserData] = useState([
    {
      role: "Asm",
      userCount: "0",
      icon:<InterpreterModeIcon/>,
      color: "#4045A1",
      increased: "53%",
    },
    {
      role: "ZSM",
      userCount: "0",
      icon:<InterpreterModeIcon/>,
      color: "#4045A1",
      increased: "53%",
    },
    {
      role: "Ad",
      userCount: "0",
      icon: <GroupAddIcon/>,
      color: "#DC5F5F",
      decreased: "12%",
    },
    {
      role: "Md",
      userCount: "0",
      icon: <GroupAddIcon/>,
      color: "#DC5F5F",
      decreased: "12%",
    },
    {
      role: "Ret",
      userCount: "0",
     icon: <SupervisorAccountIcon/>,
      color: "#00BF78",
      increased: "3%",
    },
    {
      role: "Dd",
      icon:<RecordVoiceOverIcon/>,
      userCount: "0",
      color: "#4045A1",
      decreased: "1%",
    },
    {
      role: "Api",
      icon:<PersonAddIcon/>,
      userCount: "0",
      color: "#ff9800",
      decreased: "1%",
    },
  ]);
  const [graphRequest, setGraphRequest] = useState(false);
  const getUsersData = () => {
    get(
      ApiEndpoints.ADMIN_DASHBOARD_GET_USER_DATA,
      ``,
      setRequest,
      (res) => {
        const data = res.data.data;
        const newData = [...userData];
        newData.forEach((item) => {
          if (item.role === "Asm") {
            item.userCount = data.Asm;
          }
          if (item.role === "Zsm") {
            item.userCount = data.Asm;
          }
          if (item.role === "Ad") {
            item.userCount = data.Ad;
          }
          if (item.role === "Ret") {
            item.userCount = data.Ret;
          }
          if (item.role === "Dd") {
            item.userCount = data.Dd;
          }
          if (item.role === "Api") {
            item.userCount = data.Api;
          }
        });
        setUserData(newData);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };
  const [txnDataReq, setTxnDataReq] = useState(false);

  const [txnData, setTxnData] = useState([
    {
      name: "TOTAL",
      balance: "0",
      percent: "100",
      icon: <BarChartIcon sx={{ fontSize: "16px" }} />,
      color: "rgb(153, 102, 255)",
      bgColor: "rgb(153, 102, 255 , 0.090)",
    },
    {
      name: "SUCCESS",
      balance: "0",
      percent: "0",
      icon: <CheckIcon sx={{ fontSize: "16px" }} />,
      color: " rgb(75, 192, 192)",
      bgColor: "rgb(75, 192, 192 , 0.090)",
    },
    {
      name: "PENDING",
      balance: "0",
      percent: "0",
      icon: <PriorityHighOutlinedIcon sx={{ fontSize: "16px" }} />,
      color: "rgba(255, 204, 86)",
      bgColor: "rgb(255, 204, 86 , 0.090)",
    },
    {
      name: "FAILED",
      balance: "0",
      percent: "0",
      icon: <CloseOutlinedIcon sx={{ fontSize: "16px" }} />,
      color: "rgba(255, 99, 133)",
      bgColor: "rgb(255, 99, 133 , 0.090)",
    },
  ]);
  const getTxnData = () => {
    postJsonData(
      ApiEndpoints.ADMIN_DASHBOARD_GET_TXN_DATA,
      {
        type: graphDuration,
      },
      setTxnDataReq,
      (res) => {
        const data = res.data.data;
        setTransactionData(data);
        const newData = [...txnData];
        newData.forEach((oldData) => {
          if (oldData.name === "SUCCESS") {
            oldData.balance = data.SUCCESS;
            if (data.SUCCESS === 0) {
              oldData.percent = 0;
            } else {
              oldData.percent = (data.SUCCESS * 100) / data.TOTAL;
            }
          }
          if (oldData.name === "PENDING") {
            oldData.balance = data.PENDING;
            if (data.PENDING === 0) {
              oldData.percent = 0;
            } else {
              oldData.percent = (data.PENDING * 100) / data.TOTAL;
            }
          }
          if (oldData.name === "FAILED") {
            oldData.balance = data.FAILED;
            if (data.FAILED === 0) {
              oldData.percent = 0;
            } else {
              oldData.percent = (data.FAILED * 100) / data.TOTAL;
            }
          }
          if (oldData.name === "TOTAL") {
            oldData.balance = data.TOTAL;
          }
        });
        setTxnData(newData);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  useEffect(() => {}, []);

  useEffect(() => {
    if (user && (user.role === "Asm" || user.role === "Zsm")) {
      getTxnData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphDuration]);

  useEffect(() => {
    if (user && user.role !== "Asm" && user.role !== "Zsm") {
      getUsersData();
    } else if (user && (user.role === "Asm" || user.role === "Zsm")) {
      getTxnData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Admindashboard
        graphDuration={graphDuration}
        setGraphDuration={setGraphDuration}
        user={user}
        request={request}
        userData={userData}
        graphRequest={graphRequest}
        setGraphRequest={setGraphRequest}
        getTxnData={getTxnData}
        txnDataReq={txnDataReq}
        txnData={txnData}
        transactionData={transactionData}
      />
    </>
  );
};

export default Dashboard;
