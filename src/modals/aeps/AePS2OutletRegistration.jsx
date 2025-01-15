import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button, Grid, Typography, Tab } from "@mui/material";
import ModalHeader from "../ModalHeader";
import ModalFooter from "../ModalFooter";
import { useContext } from "react";
import AuthContext from "../../store/AuthContext";
import { AEPS_TYPE } from "../../utils/constants";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { convertFileToBase64 } from "../../utils/cropImageUtils";
import { get, postFormData } from "../../network/ApiController";
import ApiEndpoints from "../../network/ApiEndPoints";
import RHFTextField from "../../component/RHFTextField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { alpha } from "@mui/material/styles";
import { primaryColor } from "../../theme/setThemeColor";
import { apiErrorToast, okSuccessToast } from "../../utils/ToastUtil";
import { PATTERNS } from "../../utils/ValidationUtil";
import Aeps2VerifyOtpModal from "./Aeps2VerifyOtpModal";
import useCommonContext from "../../store/CommonContext";
import { useEffect } from "react";
import Loader from "../../component/loading-screen/Loader";
import { useCallback } from "react";
import { genrandstr } from "../../utils/TextUtil";
import RHFSelect from "../../component/RHFSelect";
import { useMemo } from "react";

import { TabContext, TabList, TabPanel } from "@mui/lab";
const style = {
  p: 2,
  top: "50%",
  left: "50%",
  width: "80%",
  boxShadow: 24,
  height: "90vh",
  overflowY: "scroll",
  position: "absolute",
  fontFamily: "Poppins",
  bgcolor: "background.paper",
  transform: "translate(-50%, -50%)",
};

const AePS2OutletRegistration = ({ open, setOpen, refresh }) => {
  const authCtx = useContext(AuthContext);
  const userLat = authCtx?.location?.lat;
  const userLong = authCtx?.location?.long;
  const user = authCtx.user;
  const [panFile, setPanFile] = useState("");
  const [request, setRequest] = useState(false);
  const [shopImage, setShopImage] = useState("");
  const [aadhaarFile, setAadhaarFile] = useState("");
  const [primaryKeyId, setPrimaryKeyId] = useState(false);
  const [encodeFPTxnId, setEncodeFPTxnId] = useState(false);
  const { setAepsType } = useCommonContext();
  const [state, setState] = useState([]);

  // const handleOpen = () => {
  //   setOpen(true);
  // };
  const handleClose = () => {
    setOpen(false);
    reset();
    setPanFile("");
    setShopImage("");
    setAadhaarFile("");
  };

  const getStates = useCallback(() => {
    get(
      ApiEndpoints.AEPS2_STATES,
      "",
      setRequest,
      (res) => {
        setState(res.data);
      },
      (err) => {
        apiErrorToast("get states failed, contact admin");
      }
    );
  }, []);

  useEffect(() => {
    if (open && state.length === 0) getStates();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, getStates]);

  const schema = yup.object().shape({
    FirstName: yup.string().required(),
    MiddleName: yup.string().required(),
    LastName: yup.string().required(),
    MobileNumber: yup.string().required().matches(PATTERNS.MOBILE),
    Address1: yup.string().required(),
    Address2: yup.string().required(),
    State: yup.string().required(),
    City: yup.string().required(),
    District: yup.string().required(),
    PinCode: yup.string().required(),
    ShopAddress: yup.string().required(),
    ShopCity: yup.string().required(),
    ShopDistrict: yup.string().required(),
    ShopState: yup.string().required(),
    ShopPinCode: yup.string().required(),
    BusinessType: yup.string().required(),
    // DeviceId: yup.string().required(),
    AadhaarNumber: yup
      .string()
      .required()
      .matches(PATTERNS.AADHAAR, "incorrect format"),
    PanNumber: yup
      .string()
      .required()
      .matches(PATTERNS.PAN, "incorrect format"),
    BankAccount: yup.string().required(),
    Ifsc: yup.string().required(),
    BankName: yup.string().required(),
  });

  const defaultValues = useMemo(
    () => ({
      FirstName: user
        ? (user?.name?.split(" ")[0] ?? "") ||
          (user?.acc_name?.split(" ")[0] ?? "")
        : "",
      MiddleName: "",
      LastName: user
        ? (user?.name?.split(" ")[1] ?? "") ||
          (user?.acc_name?.split(" ")[1] ?? "")
        : "",
      BankAccount: user?.acc_number,
      Ifsc: user?.ifsc,
      BankName: user?.bank,
      PanNumber: user?.pan,
      PinCode: user?.pincode,
      State: user?.state,
      ShopState: user?.state,
      ShopPinCode: user?.pincode,
      District: user?.district,
      ShopDistrict: user?.district,
      MobileNumber: user?.username,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors, isValid },
  } = useForm({ resolver: yupResolver(schema), defaultValues });

  const merchantEkyc = () => {
    const formData = {
      mobileNumber: getValues("MobileNumber"),
      // mobileNumber: authCtx.user?.username,
      aadharNumber: getValues("AadhaarNumber"),
      panNumber: getValues("PanNumber"),
      longitude: userLong,
      latitude: userLat,
    };
    const queryString = Object.keys(formData)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(formData[key])}`
      )
      .join("&");
    postFormData(
      `${ApiEndpoints.AEPS2_MERCHANTEKYC}?${queryString}`,
      "",
      setRequest,
      (res) => {
        // console.log("res=>", res);
        const data = res.data.data;
        setPrimaryKeyId(data.primaryKeyId);
        setEncodeFPTxnId(data.encodeFPTxnId);
        okSuccessToast("OTP sent");
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const outletRegistration = (data) => {
    let formData = new FormData();
    delete data.AadharImage;
    delete data.PanImage;
    delete data.ShopImage;
    data.BankName = data.BankName.toUpperCase();
    data.PanNumber = data.PanNumber.toUpperCase();
    data.Ifsc = data.Ifsc.toUpperCase();
    formData.append("AadhaarImage", aadhaarFile.split(",")[1]);
    formData.append("PanImage", panFile.split(",")[1]);
    formData.append("ShopImage", shopImage.split(",")[1]);
    formData.append("Latitude", userLat);
    formData.append("Longitude", userLong);
    formData.append("DeviceId", genrandstr(15));
    // formData.append("DeviceId", 351996303471977);
    if (!aadhaarFile || !panFile || !shopImage) {
      alert("upload remaining documents before proceeding!!!");
    } else {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          formData.append(key, data[key]);
        }
      }
      postFormData(
        ApiEndpoints.AEPS2_OUTLETREG,
        formData,
        setRequest,
        (res) => {
          // okSuccessToast(res.data.message);
          merchantEkyc();
        },
        (err) => {
          apiErrorToast(err);
        }
      );
    }
  };

  useEffect(() => {
    if (!open) setAepsType("");

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   console.log("aadhaarFile=>", aadhaarFile);

  //   return () => {};
  // }, [aadhaarFile]);

  const validateInputFile = (value = "") => {
    if (value[0]) {
      const fileTypes = ["jpg", "JPG", "png", "PNG", "JPEG", "jpeg"];
      const messageFiles = ["jpg", "JPG", "png", "PNG", "JPEG", "jpeg"];
      const splittedArry = value[0].name.split(".");
      const actualType = value[0].name.split(".")[splittedArry.length - 1];

      if (!fileTypes.includes(actualType)) {
        console.log("file type error");
        return `please upload a valid file format ${messageFiles}`;
      }

      const fileSize = Math.round(value[0].size / 1024);
      if (fileSize > 500) {
        console.log("file size error=>", fileSize);
        return `File should be less than 5MB`;
      }
    }
  };

  // handle file change functions . . . .
  const handleAadhaarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64String = await convertFileToBase64(file);
      setAadhaarFile(base64String);
      // setValue("aadhaar_card", base64String);
    }
  };
  const handlePanChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64String = await convertFileToBase64(file);
      setPanFile(base64String);
      // setValue("pan_card", base64String);
    }
  };
  const handleShopChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64String = await convertFileToBase64(file);
      setShopImage(base64String);
      // setValue("shop_image", base64String);
    }
  };
  const [value, setValue] = React.useState("1");
  const handleChange = (even, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <Modal
        open={open === AEPS_TYPE.AEPS2}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <Loader loading={request} />
          <ModalHeader
            title="Outlet Registration(AePS 2)"
            subtitle="Enjoy seamless aadhaar services with DilliPay"
            handleClose={handleClose}
          />
          <Box
            component="form"
            id="outlet2Reg"
            validate
            autoComplete="off"
            sx={{ height: "56vh", overflowY: "scroll" }}
            onSubmit={handleSubmit(outletRegistration)}
          >
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12}>
                <TabContext value={value}>
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                    }}
                  >
                    <TabList
                      sx={{
                        "& .MuiTabs-indicator": {
                          backgroundColor: "orange",
                        },
                      }}
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                    >
                      <Tab label="Personal Details" value="1" />
                      <Tab label="Shop Details" value="2" />
                      <Tab label="Bank Details" value="3" />
                      <Tab label="Documents" value="4" />
                    </TabList>
                  </Box>

                  {/* Tab Panel for Personal Details */}
                  <TabPanel value="1">
                    <Grid container spacing={2} sx={{ pt: 1, mt: 0 }}>
                      {/* Fields for Personal Details */}
                      <Grid item xs={12} md={4} sm={6}>
                        <RHFTextField
                          label="First Name"
                          name="FirstName"
                          control={control}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} md={4} sm={6}>
                        <RHFTextField
                          label="Middle Name"
                          name="MiddleName"
                          control={control}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} md={4} sm={6}>
                        <RHFTextField
                          label="Last Name"
                          name="LastName"
                          control={control}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} md={4} sm={6}>
                        <RHFTextField
                          label="Mobile Number"
                          name="MobileNumber"
                          control={control}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} md={4} sm={6}>
                        <RHFTextField
                          label="Address line 1"
                          name="Address1"
                          control={control}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} md={4} sm={6}>
                        <RHFTextField
                          label="Address line 2"
                          name="Address2"
                          control={control}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} md={4} sm={6}>
                        <RHFSelect
                          label="State"
                          name="State"
                          defaultValue=""
                          control={control}
                          errors={errors}
                        >
                          <option value="" />
                          {state.map((item) => (
                            <option key={item.stateId} value={item.stateId}>
                              {item.state}
                            </option>
                          ))}
                        </RHFSelect>
                      </Grid>
                      <Grid item xs={12} md={4} sm={6}>
                        <RHFTextField
                          label="City"
                          name="City"
                          control={control}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} md={4} sm={6}>
                        <RHFTextField
                          label="District"
                          name="District"
                          control={control}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} md={4} sm={6}>
                        <RHFTextField
                          label="Pincode"
                          name="PinCode"
                          control={control}
                          errors={errors}
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>

                  {/* Tab Panel for Shop Details */}
                  <TabPanel value="2">
                    <Grid container spacing={2} sx={{ pt: 1, mt: 0 }}>
                      <Grid item xs={12} md={4} sm={6}>
                        <RHFTextField
                          label="Business Type"
                          name="BusinessType"
                          control={control}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} md={4} sm={6}>
                        <RHFTextField
                          label="Shop Address"
                          name="ShopAddress"
                          control={control}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} md={4} sm={6}>
                        <RHFTextField
                          label="Shop City"
                          name="ShopCity"
                          control={control}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} md={4} sm={6}>
                        <RHFTextField
                          label="Shop District"
                          name="ShopDistrict"
                          control={control}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} md={4} sm={6}>
                        <RHFSelect
                          label="Shop State"
                          name="ShopState"
                          defaultValue=""
                          control={control}
                          errors={errors}
                        >
                          <option value="" />
                          {state.map((item) => {
                            return (
                              <option key={item.stateId} value={item.stateId}>
                                {item.state}
                              </option>
                            );
                          })}
                        </RHFSelect>
                      </Grid>
                      <Grid item xs={12} md={4} sm={6}>
                        <RHFTextField
                          label="Shop Pincode"
                          name="ShopPinCode"
                          control={control}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} md={4} sm={6}>
                        <RHFTextField
                          label="Aadhaar number"
                          name="AadhaarNumber"
                          control={control}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} md={4} sm={6}>
                        <RHFTextField
                          label="PAN"
                          name="PanNumber"
                          control={control}
                          errors={errors}
                          inputProps={{ style: { textTransform: "uppercase" } }}
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>

                  {/* Tab Panel for Bank Details */}
                  <TabPanel value="3">
                    <Grid container spacing={2} sx={{ pt: 1, mt: 0 }}>
                      <Grid item xs={12} md={4} sm={6}>
                        <RHFTextField
                          label="Bank name"
                          name="BankName"
                          control={control}
                          errors={errors}
                          inputProps={{ style: { textTransform: "uppercase" } }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4} sm={6}>
                        <RHFTextField
                          label="Bank Account"
                          name="BankAccount"
                          control={control}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} md={4} sm={6}>
                        <RHFTextField
                          label="IFSC"
                          name="Ifsc"
                          control={control}
                          errors={errors}
                          inputProps={{ style: { textTransform: "uppercase" } }}
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>

                  {/* Tab Panel for Documents */}
                  <TabPanel value="4">
                    <Grid container spacing={2} sx={{ pt: 1, mt: 0 }}>
                      {/* Aadhaar Card Upload */}
                      <Grid item xs={12} md={4} sm={6}>
                        <label htmlFor="AadharImage">Aadhaar Card</label>
                        <input
                          type="file"
                          id="AadharImage"
                          name="AadharImage"
                          className="form-control"
                          {...register("AadharImage", {
                            required: "Valid Aadhaar card required",
                            validate: async (value) => {
                              validateInputFile(value);
                            },
                          })}
                          onChange={handleAadhaarChange}
                        />
                        <ErrorComponent errors={errors} name="AadharImage" />
                      </Grid>

                      <Grid item xs={12} md={4} sm={6}>
                        <label htmlFor="PanImage">PAN Card</label>
                        <input
                          type="file"
                          id="PanImage"
                          name="PanImage"
                          className="form-control"
                          {...register("PanImage", {
                            required: "Valid PAN required",
                            validate: async (value) => {
                              validateInputFile(value);
                            },
                          })}
                          onChange={handlePanChange}
                        />
                        <ErrorComponent errors={errors} name="PanImage" />
                      </Grid>

                      <Grid item xs={12} md={4} sm={6}>
                        <label htmlFor="ShopImage">Shop Image</label>
                        <input
                          type="file"
                          id="ShopImage"
                          name="ShopImage"
                          className="form-control"
                          {...register("ShopImage", {
                            required: "Valid Image required",
                            validate: async (value) => {
                              validateInputFile(value);
                            },
                          })}
                          onChange={handleShopChange}
                        />
                        <ErrorComponent errors={errors} name="ShopImage" />
                      </Grid>
                    </Grid>
                  </TabPanel>
                </TabContext>
              </Grid>
            </Grid>
          </Box>
          <footer
            style={{ textAlign: "left", color: "grey", marginLeft: "2px" }}
          >
            ** The form is only submitted when all fields are filled out
            correctly by the user.
          </footer>
          <ModalFooter
            form={"outlet2Reg"}
            btn="Continue"
            type={"submit"}
            disable={request && !isValid}
            
          />
        </Box>
      </Modal>

      <Aeps2VerifyOtpModal
        btn="Verify"
        primaryKeyId={primaryKeyId}
        encodeFPTxnId={encodeFPTxnId}
        setPrimaryKeyId={setPrimaryKeyId}
        identifier={getValues("AadhaarNumber")}
      />
    </Box>
  );
};

export default AePS2OutletRegistration;

function ErrorComponent({ errors, name }) {
  return (
    <>
      <Typography
        sx={{
          fontSize: "12px",
          color: "red",
          fontWeight: "bold",
          marginLeft: "1.2rem",
        }}
      >
        {errors[name] && errors[name].message}
      </Typography>
      <Typography
        sx={{
          fontSize: "12px",
          color: "#9092a3",
          fontWeight: "bold",
          marginLeft: "1.2rem",
          marginBottom: "0.4rem",
          marginTop: "0.4rem",
        }}
      >
        Only (jpg, png, jpeg)
      </Typography>
      <Typography
        sx={{
          fontSize: "12px",
          color: "#9092a3",
          fontWeight: "bold",
          marginLeft: "1.2rem",
        }}
      >
        Maximum Size: 5MB
      </Typography>
    </>
  );
}
