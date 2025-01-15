/* eslint-disable react-hooks/exhaustive-deps */
import {
    Autocomplete,
    Box,
    Button,
    FormControl,
    Grid,
    TextField,
    Typography,
    createFilterOptions,
  } from "@mui/material";
  import React from "react";
  import { get, postJsonData } from "../network/ApiController";
  import ApiEndpoints from "../network/ApiEndPoints";
  import { useState } from "react";
  import { useEffect } from "react";
  import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
  import { useContext } from "react";
  import AuthContext from "../store/AuthContext";
  import { CircularButton } from "../component/BBPSButtonComponent";
  import Spinner from "../commons/Spinner";
  import OutletRegistration from "../component/OutletRegistration";
  import BeneSearchBar from "../component/BeneSearchBar";
  import { bbpsPng } from "../iconsImports";
  import BillDetailsModal from "../modals/BillDetailsModal";
  import CommonMpinModal from "../modals/CommonMpinModal";
  import useCommonContext from "../store/CommonContext";
  import BackspaceIcon from "@mui/icons-material/Backspace";
  import { validateApiCall } from "../utils/LastApiCallChecker";
  
  const BBPSView = () => {
    const [progress, setProgress] = useState(false);
  
    const [catKey, setCatKey] = useState("");
  
    const [params, setParams] = useState([]);
    // console.log("params", params);
  
    const authCtx = useContext(AuthContext);
    const user = authCtx.user;
    const location = authCtx.location;
    const [billerId, setBillerId] = useState("");
    const [billers, setBillers] = useState([]);
    // console.log("billers", billers);
    const [fetchMandatory, setFetchMandatory] = useState("");
    const [action, setAction] = useState("");
    const [isActive, setIsActive] = useState("");
    const [search, setSearch] = useState("");
    const [categoryName, setCategoryName] = useState("");
    // console.log("categoryName", categoryName);
    const [currentBiller, setCurrentBiller] = useState(false);
  
    const [billDetails, setBillDetails] = useState(false);
    // const [request, setRequest] = useState(false);
    const [openMpin, setOpenMpin] = useState(false);
    const [mpinVal, setMpinVal] = useState(false);
  
    const [payRequest, setPayRequest] = useState(false);
    // const [isEdit, setIsEdit] = useState(false);
  
    const filterOptions = createFilterOptions({
      matchFrom: "start",
      stringify: (option) => option.billerName,
    });
  
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
    const [categories, setCategories] = useState([]);
  
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [billValue, setBillValue] = useState();
    const [pan, setPan] = useState("");
    const [err, setErr] = useState();
  
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
  
    const getBillersDetails = (billerId) => {
      postJsonData(
        ApiEndpoints.BBPS_GET_BILLERS_DETAILS,
        { billerId: billerId },
        setProgress,
        (res) => {
          const data = res.data.data;
          setParams(data.parameters);
          setFetchMandatory(data.fetchRequirement);
          // console.log("data.parameters", data?.parameters[1]?.name);
          if (
            categoryName &&
            categoryName.categoryName === "Electricity" &&
            data?.parameters[1]?.desc !== "Mobile Number"
          ) {
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
  
    const { getRecentData } = useCommonContext();
  
    const fetchBill = (event) => {
      const data = {
        billerId: billerId,
        latitude: location.lat,
        longitude: location.long,
        amount: 0,
      };
      params.map((item) => {
        let propertyName = item.name;
        data[propertyName] =
          item.inputType === "NUMERIC"
            ? Number(document.getElementById(propertyName).value)
            : document.getElementById(propertyName).value;
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
  
    useEffect(() => {
      if (search) {
        const myList = categories.filter((item) => {
          return item.categoryName.toUpperCase().includes(search.toUpperCase());
        });
        setFilteredCategories(myList);
      } else {
        setFilteredCategories(categories);
      }
  
      return () => {};
    }, [search, categories]);
  
    useEffect(() => {
      if (user && user.instId) {
        getCategories();
      }
    }, []);
  
    const payBill = (event) => {
      event.preventDefault();
      const data = {
        billerId: billerId && billerId,
        biller_name: currentBiller.billerName,
        amount: billValue,
        pan: pan ? pan : undefined,
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
          data[propertyName] =
            item.inputType === "NUMERIC"
              ? Number(document.getElementById(propertyName).value)
              : document.getElementById(propertyName).value;
          return data;
        });
  
      console.log("data", data);
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
  
    //  #### OLD FUNCTION DON'T REMOVE ######
    // const openMpinfunc = (e) => {
    //   e.preventDefault();
    //   if (!mpinVal) setOpenMpin(true);
    // };
  
    const openMpinfunc = (e) => {
      e.preventDefault();
      params.forEach((eachparam) => {
        if (
          eachparam.desc === "Amount" &&
          document.getElementById("amount").value > 50000 &&
          !document.getElementById("pan")
        ) {
          // console.log("here in amount 50000");
          setParams((param) => [
            ...param,
            {
              name: "pan",
              desc: "Pan",
              mandatory: 0,
              regex: "^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$",
            },
          ]);
          return;
        }
      });
  
      if (
        !mpinVal &&
        document.getElementById("amount") &&
        document.getElementById("amount").value < 50000
      ) {
        // console.log("here in less 50000 open mpin");
        setParams(params.filter((eachparam) => eachparam.name !== "pan"));
        setOpenMpin(true);
      } else if (
        !mpinVal &&
        document.getElementById("amount").value > 50000 &&
        document.getElementById("pan")
      ) {
        // console.log("here in greater 50000 open mpin");
        setOpenMpin(true);
      } else {
        //
      }
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
  
    useEffect(() => {
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
      my: 4,
      p: 2,
      mb: 12,
      borderTop: "0.2px solid #d3d3d370",
    };
  
    return (
      <>
        {user && !user.instId && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <OutletRegistration autoOpen />
          </Box>
        )}
        {user && user.instId && (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ width: "70%" }}>
                <BeneSearchBar
                  setSearch={setSearch}
                  label="Search for Categories"
                />
              </span>
              <span>
                <img src={bbpsPng} width="120" alt="bbps" />
              </span>
            </Box>
            <div
              className="card-css"
              style={{
                height: "max-content",
                marginTop: "12px",
                position: "relative",
              }}
            >
              <Spinner loading={progress || payRequest} />
              {/* <Spinner loading={progress} /> */}
              {/* categories */}
              <Box sx={categoryBoxStyle} className="enable-scroll">
                <Grid container>
                  {filteredCategories?.length > 0 &&
                    filteredCategories.map((item, index) => {
                      return (
                        <Grid item xs={4} sm={4} md={3} lg={1.2} key={index}>
                          <CircularButton
                            onClick={() => {
                              setErr("");
                              setCatKey(item.categoryKey);
                              setCategoryName(item);
                              getBillers(item.categoryKey);
                              setAction(item.categoryName);
                              setIsActive(!isActive);
                              setCurrentBiller({});
                            }}
                            txt={item.categoryName}
                            img={item.iconUrl}
                            // img2={getRecAndBillInvertImg(item.categoryName)}
                            isActive={action === item.categoryName}
                          />
                        </Grid>
                      );
                    })}
                </Grid>
              </Box>
  
              {/* form */}
              <Box>
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
                    <Grid
                      container
                      sx={{
                        pt: 1,
                        width: { md: "60%", sm: "90%", xs: "90%" },
                      }}
                    >
                      <Grid item md={12} xs={12}>
                        <FormControl
                          fullWidth
                          sx={{
                            width: "97.5%",
                            display: "flex",
                            justifyContent: "flex-start",
                            textAlign: "left",
                          }}
                        >
                          <Autocomplete
                            filterOptions={filterOptions}
                            autoHighlight
                            openOnFocus
                            selectOnFocus
                            id="biller"
                            // freeSolo
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
                            getOptionLabel={(option) => {
                              return currentBiller.billerName
                                ? currentBiller.billerName
                                : "Select Biller";
                            }}
                            renderOption={(props, option) => (
                              <Box
                                component="li"
                                sx={{
                                  "& > img": { mr: 2, flexShrink: 0 },
                                  fontSize: "12px",
                                }}
                                {...props}
                              >
                                <Typography>{option.billerName}</Typography>
                              </Box>
                            )}
                            renderInput={(params) => (
                              <FormControl fullWidth>
                                <TextField autoComplete="off"
                                  {...params}
                                  // autoFocus
                                  id="biller_textfield"
                                  label="Select Biller"
                                  size="small"
                                  sx={{
                                    textAlign: "left",
                                  }}
                                  // defaultValue=""
                                  // value={
                                  //   currentBiller?.billerName
                                  //     ? currentBiller?.billerName
                                  //     : ""
                                  // }
                                  // onChange={handleChange}
                                />
                              </FormControl>
                            )}
                            clearIcon={
                              <BackspaceIcon
                                sx={{ fontSize: "15px", ml: 0 }}
                                onClick={() => {
                                  setCurrentBiller("");
                                  setBillerId("");
                                }}
                              />
                            }
                          />
                        </FormControl>
                      </Grid>
                      {params &&
                        params.map((item, index) => {
                          return (
                            <Grid item md={12} xs={12} key={index}>
                              <FormControl
                                sx={{
                                  width: "100%",
                                }}
                              >
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
  
                      <Grid item md={12} xs={12}>
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
                              setPan={setPan}
                              pan={pan}
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
                          {fetchMandatory &&
                            fetchMandatory === "NOT_SUPPORTED" && (
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
            </div>
            <CommonMpinModal
              open={openMpin}
              setOpen={setOpenMpin}
              mPinCallBack={(mPinValue) => {
                setMpinVal(mPinValue);
              }}
            />
          </>
        )}
      </>
    );
  };
  
  export default BBPSView;
  