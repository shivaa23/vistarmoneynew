import * as React from "react";
import {
  Badge,
  Box,
  Button,
  Grid,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import Step from "@mui/material/Step";
import { Alert } from "@mui/material";
import { useState } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Loader from "../component/loading-screen/Loader";
import { get, postJsonData } from "../network/ApiController";
import { apiErrorToast } from "../utils/ToastUtil";
import ApiEndpoints from "../network/ApiEndPoints";
import moment from "moment";
import Tooltip from "@mui/material/Tooltip";
import { yellowNoti, redNoti, blueNoti } from "../iconsImports";
import MoreNotificationModal from "../modals/MoreNotificationModal";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import useCommonContext from "../store/CommonContext";
import { useRef } from "react";

const Notifications = () => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const { openNoti, setOpenNoti } = useCommonContext();
  const listInnerRef = useRef();

  const markRead = () => {
    postJsonData(
      ApiEndpoints.MARK_READ_NOTI,
      "",
      setActivityRequest,
      (res) => {
        get(
          ApiEndpoints.GET_ME_USER,
          "",
          setActivityRequest,
          (res) => {
            setNotiCount(res.data.message);
            // setNotiCount(10);
          },
          (error) => {
            apiErrorToast(error);
          }
        );
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
    markRead();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenNoti(false);
  };
  useEffect(() => {
    handleClose();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const [recentActivity, setRecentActivity] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [activityRequest, setActivityRequest] = useState(false);
  const [notiId, setnotiId] = useState();
  const { testRedToast, notiCount, setNotiCount } = useCommonContext();
  const openNotiRef = React.useRef();
  // const [limit, setLimit] = useState(10);

  const getActivity = () => {
    get(
      ApiEndpoints.GET_NOTIFICATION,
      "",
      setActivityRequest,
      (res) => {
        if (res?.data?.data !== undefined && res?.data.data.length > 0) {
          setRecentActivity(res.data.data);
          if (res?.data?.data[0].priority === "HIGH" && notiCount > 0) {
            testRedToast("High Priority Notification Received");
          }
          // if (res?.data?.data[0].message.includes("UPI")) {
          //   setSpeechText(res?.data?.data[0].message);
          // }
        } else setRecentActivity(false);
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  //1 if noticount is greater than 0 the getact will run
  // 2 in that we check if prio is high
  //3 if high then we open the swal
  // 4 in swal we click view and toggle openNoti hook and open the notification view and call mark read at the same time
  useEffect(() => {
    if (notiCount >= 0) getActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notiCount]);
  // /////////////////////////////////////////////////

  // useEffect(() => {
  //   testRedToast("High Priority Notification Received");
  // }, []);

  useEffect(() => {
    if (openNoti) {
      setAnchorEl(openNotiRef?.current);
      markRead();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openNoti]);

  return (
    <React.Fragment>
      {/* <TextToSpeech text="Testing Dear User You Have Recieved On Your UPI QR Code. Https://VistarMoney.Com" /> */}
      {/* <TextToSpeech1 /> */}

      <Tooltip title="Notifications" placement="bottom">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            // backgroundColor: "blue",
            // width: 30,
          }}
          className="space-bw-bell"
          onClick={handleMenu}
          ref={openNotiRef}
        >
          <Button
            onClick={() => {
              getActivity();
              markRead();
            }}
            mr={2}
          >
            {notiCount >= 0 && (
              <Badge
                badgeContent={notiCount && notiCount}
                max={99}
                color="error"
                sx={{ color: "#fff" }}
              >
                {notiCount && notiCount ? (
                  <NotificationsActiveIcon
                    className={notiCount && notiCount ? "noti-active" : ""}
                    size="large"
                    sx={{
                      m: 0.2,
                      // mr: 3,
                      fontSize: "25px",
                      transform: "scale(1)",
                      transition: "0.5s",
                      "&:hover": { transform: "scale(1.2)" },
                      display: { lg: "flex" },
                    }}
                  />
                ) : (
                  <NotificationsNoneIcon
                    size="large"
                    sx={{
                      transform: "scale(1)",
                      // mr: 3,
                      transition: "0.5s",
                      "&:hover": { transform: "scale(1.2)" },
                      display: { lg: "flex" },
                    }}
                  />
                )}
              </Badge>
            )}
          </Button>
        </div>
      </Tooltip>

      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        // keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{
          paddingTop: "0rem",
          width: "500px",
          height: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        ref={listInnerRef}
      >
        <MenuItem
          disableRipple
          sx={{
            marginTop: "-8px",
            width: "inherit",
            minWidth: "300px",
            "&:hover": {
              backgroundColor: "#FFF",
              cursor: "default",
            },
          }}
        >
          <Box
            sx={{
              position: "relative",
              height: "40vh",
              overflowY: "scroll",
            }}
          >
            <Loader loading={activityRequest} circleBlue />
            {recentActivity &&
              recentActivity.length > 0 &&
              recentActivity.map((step, index) => {
                return (
                  <Step key={index} sx={{ width: "300px" }}>
                    <Alert
                      id="noti-container"
                      key={index}
                      icon={false}
                      sx={{
                        width: "100%",
                        overflowWrap: "break-word",
                        backgroundColor: "rgba(11, 1, 133, 0.063)",
                        my: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        py: 0.28,
                        borderRadius: "4px",
                      }}
                      className="fullwidth-noti position-relative"
                      onMouseOver={() => {
                        setnotiId(step.id);
                      }}
                      onMouseLeave={() => {
                        setnotiId("");
                      }}
                    >
                      <div
                        className="text-wrap d-flex justify-content-between "
                        style={{
                          // textAlign: "left",
                          width: "100%",
                          overflowWrap: "break-word",
                          overflowX: "hidden",
                        }}
                      >
                        <div>
                          <span className="me-2 pt-1">
                            {step.priority.toLowerCase() === "low" && (
                              <img
                                src={blueNoti}
                                alt="icons"
                                className="noti-icons1"
                              />
                            )}
                            {step.priority.toLowerCase() === "medium" && (
                              <img
                                src={yellowNoti}
                                alt="icons"
                                className="noti-icons"
                              />
                            )}
                            {step.priority.toLowerCase() === "high" && (
                              <img
                                src={redNoti}
                                alt="icons"
                                className="noti-icons1"
                              />
                            )}
                          </span>
                          <span
                            className="me-2 pt-1 mb-1"
                            style={{
                              fontWeight: "400",
                              color: "#000",
                              fontSize: "0.8rem",
                              fontFamily: "Poppins,sans-serif",
                            }}
                          >
                            {step && step.message}
                          </span>
                        </div>

                        <CloseIcon
                          className={`${
                            step.id === notiId ? "d-block" : "d-none"
                          } close-icon-pos hover-zoom-color`}
                          sx={{ fontSize: "14px" }}
                        />
                      </div>
                      <Typography
                        sx={{
                          fontSize: "0.69rem",
                          letterSpacing: "0.00938em",
                          color: "rgb(144, 146, 163)",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        {step && moment(step.created_at).format("hh:mm a")} |{" "}
                        {step && moment(step.created_at).format("Do MMM YYYY")}
                      </Typography>
                    </Alert>
                  </Step>
                );
              })}
            {!recentActivity && (
              <Grid
                sx={{
                  mt: 2,
                  fontSize: "12px",
                  position: "relative",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* <img src={emptyTable} alt="no_data" width="40%" /> */}
                {/* <Loader loading={activityRequest} circle /> */}
                No Notification till now!
              </Grid>
            )}
          </Box>
        </MenuItem>
        <MenuItem
          disableRipple
          sx={{
            "&:hover": {
              backgroundColor: "#FFF",
              cursor: "default",
            },
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            sx={{ color: "#0077b6" }}
            className="otp-hover-purple"
            onClick={() => {
              handleClose();
            }}
          >
            Close
          </Button>
          <Button
            sx={{ color: "#0077b6" }}
            className="otp-hover-purple"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            More
          </Button>
        </MenuItem>
      </Menu>
      <MoreNotificationModal open={openModal} setOpen={setOpenModal} />
    </React.Fragment>
  );
};
export default Notifications;
