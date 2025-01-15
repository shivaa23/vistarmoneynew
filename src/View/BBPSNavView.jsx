import React from "react";
import { useContext } from "react";
import { useState } from "react";
import AuthContext from "../store/AuthContext";
import { get, postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import useCommonContext from "../store/CommonContext";
import { useEffect } from "react";
import { validateApiCall } from "../utils/LastApiCallChecker";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import HNavButton from "../component/HNavButton";
import { BBPS } from "../iconsImports";
import BillDetailsModal from "../modals/BillDetailsModal";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { useNavigate } from "react-router-dom";
import Loader from "../component/loading-screen/Loader";
import ModalHeader from "../modals/ModalHeader";
import { getNavImg } from "../_nav";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 3,
};

const BBPSNavView = () => {
  const [progress, setProgress] = useState(false);
  const [billerId, setBillerId] = useState("");

  const [catKey, setCatKey] = useState("");

  const [params, setParams] = useState([]);

  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const location = authCtx.location;
  const [billers, setBillers] = useState([]);
  const [fetchMandatory, setFetchMandatory] = useState("");
  const [action, setAction] = useState("");
  const [isActive, setIsActive] = useState("");

  const [categoryName, setCategoryName] = useState("");
  const [currentBiller, setCurrentBiller] = useState(false);
  const [billDetails, setBillDetails] = useState(false);
  // const [request, setRequest] = useState(false);
  const [openMpin, setOpenMpin] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [mpinVal, setMpinVal] = useState(false);

  const [payRequest, setPayRequest] = useState(false);

  const [categories, setCategories] = useState([]);

  const [modifiedCats, setModfiedCats] = useState([]);
  // console.log("modified", modifiedCats);
  // const [filteredCategories, setFilteredCategories] = useState([]);
  const [billValue, setBillValue] = useState();
  const [err, setErr] = useState();
  const { getRecentData } = useCommonContext();
  const navigate = useNavigate();
  const [filterbbps, setFilterBbps] = useState(false);
  const allowedCatgories = [
    "Electricity",
    "Gas Cylinder",
    "Mobile Postpaid",
    "Mobile Prepaid",
    "FASTag",
    "Piped Gas",
    "BBPS",
  ];

  const handleOpen = () => {
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };

  const openMpinfunc = (e) => {
    e.preventDefault();
    if (!mpinVal) setOpenMpin(true);
  };

  const handleChange = (e) => {
    if (e.target.value) {
      // console.log("if input=>", e.target.value);
      setCurrentBiller(e.target.value);
    } else {
      // console.log("else input=>", e.target.value);
      setCurrentBiller(e.target.value);
      setCurrentBiller("");
      setBillerId("");
    }
  };

  const getCategories = () => {
    get(
      ApiEndpoints.BBPS_CATEGORIES,
      ``,
      setProgress,
      (res) => {
        const data = res.data.data;
        setCategories(data);
        setCurrentBiller("");
        // categoryListChange(data);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const getBillers = (cat_key) => {
    setBillers([]);
    setParams([]);
    setCurrentBiller("");
    setMpinVal(false);
    postJsonData(
      ApiEndpoints.BBPS_GET_BILLERS,
      { categoryKey: cat_key },
      setProgress,
      (res) => {
        const data = res.data.data.records;
        if (cat_key === "C03") {
          setBillers(
            data.filter((item) => {
              return item.type === "ONUS";
            })
          );
        } else {
          setBillers(data);
        }
        setFetchMandatory("");
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };
  const getBillersDetails = (billerId) => {
    postJsonData(
      ApiEndpoints.BBPS_GET_BILLERS_DETAILS,
      { billerId: billerId },
      setProgress,
      (res) => {
        const data = res.data.data;
        setParams(data.parameters);
        setFetchMandatory(data.fetchRequirement);
        if (categoryName && categoryName.categoryName === "Electricity") {
          setParams((param) => [
            ...param,
            {
              name: "param2",
              desc: "Mobile Number",
              minLength: 10,
              maxLength: 10,
              inputType: "NUMERIC",
              mandatory: 1,
              regex: "/^[6-9]d{9}$/",
            },
          ]);
        }
        if (data.fetchRequirement === "NOT_SUPPORTED") {
          setParams((param) => [
            ...param,
            {
              name: "amount",
              desc: "Amount",
              minLength: 2,
              maxLength: 7,
              inputType: "NUMERIC",
              mandatory: 1,
              regex: "/^[6-9]d{9}$/",
            },
          ]);
        }
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const fetchBill = (event) => {
    const data = {
      billerId: billerId,
      latitude: location.lat,
      longitude: location.long,
      amount: 0,
    };
    params.map((item) => {
      let propertyName = item.name;
      data[propertyName] = document.getElementById(propertyName).value;
      return data;
    });

    if (data.param1 === "") {
      apiErrorToast("Please fill out all the fields");
    } else if (data.hasOwnProperty("param2") && data.param2 === "") {
      apiErrorToast("Please fill out all the fields");
    } else if (data.hasOwnProperty("param3") && data.param3 === "") {
      apiErrorToast("Please fill out all the fields");
    } else if (data.hasOwnProperty("param4") && data.param4 === "") {
      apiErrorToast("Please fill out all the fields");
    } else {
      postJsonData(
        ApiEndpoints.BBPS_FETCH_BILL,
        data,
        setProgress,
        (res) => {
          setBillDetails(res.data.data.data);
        },
        (err) => {
          apiErrorToast(err);
        }
      );
    }
  };

  const payBill = (event) => {
    event.preventDefault();
    const data = {
      billerId: billerId && billerId,
      biller_name: currentBiller.billerName,
      amount: billValue,
      pf: "web",
      cat: categoryName && categoryName.categoryKey,
      mpin: mpinVal,
      latitude: location.lat,
      longitude: location.long,
      enquiryReferenceId: billDetails
        ? billDetails.enquiryReferenceId
        : "15486sfdgyf",
    };
    params &&
      params.map((item) => {
        let propertyName = item.name;
        data[propertyName] = document.getElementById(propertyName).value;
        return data;
      });
    if (validateApiCall()) {
      postJsonData(
        ApiEndpoints.BBPS_PAY_BILL,
        data,
        setPayRequest,
        (res) => {
          okSuccessToast(res.data.message);
          getRecentData();
          setBillDetails(false);
          setMpinVal(false);
          setErr("");
        },
        (error) => {
          setMpinVal(false);
          apiErrorToast(error);
          getRecentData();
          setErr("");
          // setBillDetails(false);
        }
      );
    } else {
      const error = {
        message: "Kindly wait some time before another request",
      };
      setErr(error);
    }
  };

  useEffect(() => {
    if (user && user.instId) {
      getCategories();
    }
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      let modiCat = categories
        .map(({ categoryName, categoryKey, group }) => {
          return {
            title: categoryName,
            icon: getNavImg(categoryName),
            categoryKey,
            group,
          };
        })
        .filter((item) => {
          //   console.log("item", item);
          if (allowedCatgories.includes(item.title)) {
            return item;
          } else {
            return null;
          }
        });
      //   console.log("filterCats", modiCat);

      if (modiCat.length > 0) {
        modiCat.push({
          title: "BBPS",
          to: "/customer/bbps",
          icon: BBPS,
        });
      }

      setModfiedCats(modiCat);
    }
  }, [categories]);

  useEffect(() => {
    setCurrentBiller();
    setCurrentBiller("");
    setBillerId("");
    const tf = document.getElementById("biller_textfield");
    if (tf) {
      tf.value = null;
    }
    return () => {};
  }, [billers]);

  const categoryBoxStyle = {
    p: 2,
    pb: { md: 2, xs: 0 },
    height: action ? " 220px" : "auto",
    overflowY: "scroll",
    position: "relative",
    pt: 0.5,
  };
  const formStyle = {
    "& .MuiTextField-root": { m: 1 },
    display: "flex",
    justifyContent: { md: "center", sm: "left", xs: "left" },
    my: 2,
    p: 2,
    borderTop: "0.2px solid #d3d3d370",
  };

  return (
    <>
      {user && user.instId && (
        <Box
          className="card-css position-relative"
          sx={{ width: "100%", p: 2, my: 2 }}
        >
          <div style={{ width: "100%" }}>
            <Typography className="services-heading">
              {" "}
              Bharat Bill Payment System{" "}
            </Typography>
            <Grid container>
              {filterbbps
                ? modifiedCats.map((item, index) => {
                    return (
                      <Grid
                        className="horizontal-sidenav"
                        onClick={() => {
                          if (item.categoryKey) {
                            setErr("");
                            setCatKey(item.categoryKey);
                            setCategoryName(item);
                            getBillers(item.categoryKey);
                            setAction(item.title);
                            setIsActive(!isActive);
                            handleOpen();
                          } else {
                            navigate(item.to);
                          }
                        }}
                        item
                        md={2}
                        index={index}
                      >
                        <HNavButton item={item} />
                      </Grid>
                    );
                  })
                : modifiedCats
                    .filter((item) => {
                      if (item.title === "BBPS") {
                        return undefined;
                      } else {
                        return item;
                      }
                    })
                    .map((item, index) => {
                      return (
                        <Grid
                          className="horizontal-sidenav"
                          onClick={() => {
                            if (item.categoryKey) {
                              setErr("");
                              setCatKey(item.categoryKey);
                              setCategoryName(item);
                              getBillers(item.categoryKey);
                              setAction(item.title);
                              setIsActive(!isActive);
                              handleOpen();
                            } else {
                              navigate(item.to);
                            }
                          }}
                          item
                          md={2}
                          index={index}
                        >
                          <HNavButton item={item} />
                        </Grid>
                      );
                    })}
            </Grid>
          </div>
          <div
            style={{ position: "absolute", right: "15px", top: "80px" }}
            onClick={() => setFilterBbps(!filterbbps)}
            className="hover-zoom"
          >
            {" "}
            {filterbbps ? (
              <KeyboardDoubleArrowLeftIcon
                fontSize="large"
                sx={{ opacity: "0.7" }}
              />
            ) : (
              <KeyboardDoubleArrowRightIcon
                fontSize="large"
                sx={{ opacity: "0.7" }}
              />
            )}
          </div>
        </Box>
      )}
      <Modal
        open={openModal}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <Loader loading={progress} />
          <ModalHeader title={categoryName?.title} handleClose={handleClose} />

          {catKey && (
            <Box
              component="form"
              id="bbpsForm"
              validate="true"
              autoComplete="off"
              onSubmit={mpinVal ? payBill : openMpinfunc}
              sx={formStyle}
            >
              {/* <Divider /> */}
              <Grid container>
                <Grid item md={12} xs={12} sx={{ pr: 2 }}>
                  <FormControl fullWidth>
                    <Autocomplete
                      autoHighlight
                      openOnFocus
                      selectOnFocus
                      id="biller"
                      freeSolo
                      options={billers}
                      value={currentBiller.billerName}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setCurrentBiller(newValue);
                          setBillerId(newValue.billerId);
                          getBillersDetails(newValue.billerId);
                        } else {
                          setCurrentBiller("");
                          setBillerId("");
                        }
                      }}
                      clearIcon={
                        <BackspaceIcon
                          sx={{ fontSize: "15px", ml: 0 }}
                          onClick={() => {
                            setCurrentBiller("");
                            setCurrentBiller("");
                            setBillerId("");
                          }}
                        />
                      }
                      getOptionLabel={(option) => option?.billerName}
                      renderInput={(params) => (
                        <TextField autoComplete="off"
                          {...params}
                          autoFocus
                          id="biller_textfield"
                          label="Select Biller"
                          size="small"
                          sx={{
                            textAlign: "left",
                          }}
                          defaultValue=""
                          value={
                            currentBiller?.billerName
                              ? currentBiller?.billerName
                              : ""
                          }
                          onChange={handleChange}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                {params &&
                  params.map((item, index) => {
                    return (
                      <Grid item md={12} xs={12} key={index}>
                        <FormControl fullWidth>
                          <TextField autoComplete="off"
                            label={item.desc}
                            id={item.name}
                            inputProps={{
                              minLength: item.minLength,
                              maxLength: item.maxLength,
                              pattern: item.regex,
                            }}
                            // inputProps={{ style: { textTransform: "uppercase" } }}
                            size="small"
                            minLength={item.minLength}
                            maxLength={item.maxLength}
                            required={item.mandatory === 1}
                            type={
                              item.inputType && item.inputType === "NUMERIC"
                                ? "number"
                                : "text"
                            }
                          />
                        </FormControl>
                      </Grid>
                    );
                  })}
                {err && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                      fontSize: "12px",
                      px: 2,
                      color: "#DC5F5F",
                    }}
                  >
                    {err.message && err.message && (
                      <div>{err && err.message}</div>
                    )}
                  </Box>
                )}

                <Grid
                  item
                  md={12}
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <FormControl sx={{ mt: 2 }}>
                    {fetchMandatory && fetchMandatory === "MANDATORY" && (
                      <BillDetailsModal
                        billerId={billerId}
                        params={params}
                        currentBiller={currentBiller}
                        billDetails={billDetails}
                        setBillDetails={setBillDetails}
                        fetchBill={fetchBill}
                        categoryName={categoryName}
                        payRequest={payRequest}
                        payBill={payBill}
                        mpinVal={mpinVal}
                        setMpinVal={setMpinVal}
                        setOpenMpin={setOpenMpin}
                        billValue={billValue}
                        setBillValue={setBillValue}
                        err={err}
                      />
                      // <Button
                      //   type="submit"
                      //   form="bbpsForm"
                      //   className="btn-background "
                      //   sx={{
                      //     width: "100%",
                      //     mt: 1,
                      //   }}
                      // >
                      //   {fetchMandatory && fetchMandatory === "MANDATORY"
                      //     ? "Fetch Bill"
                      //     : fetchMandatory &&
                      //       fetchMandatory === "NOT_SUPPORTED"
                      //     ? "Pay Bill"
                      //     : "Proceed"}
                      // </Button>
                    )}
                    {/* chrome auto error not showing in bbps here  */}
                    {fetchMandatory && fetchMandatory === "NOT_SUPPORTED" && (
                      <Button
                        // type={mpinVal ? "submit" : "button"}
                        type="submit"
                        form="bbpsForm"
                        className="btn-background"
                        sx={{
                          width: "100%",
                          mt: 1,
                        }}
                        // onClick={() => {
                        //   if (!mpinVal) setOpenMpin(true);
                        // }}
                      >
                        {mpinVal ? "Pay Now" : "Continue"}
                      </Button>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default BBPSNavView;
