import React, { useContext, useEffect } from "react";
import {
  Avatar,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import AuthContext from "../store/AuthContext";
import { Box } from "@mui/system";
import { maleAvatar, femaleAvatar, userAvt } from "../iconsImports";
import ChangePass from "../modals/ChangePass";
import ChangeMpin from "../modals/ChangeMpin";
import ResetMpin from "../modals/ResetMpin";
import { useState } from "react";
import { PATTERNS } from "../utils/ValidationUtil";
import { get, getAxios, postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import Loader from "../component/loading-screen/Loader";
import UsernameChangeModal from "../modals/UsernameChangeModal";
import CommonMpinModal from "../modals/CommonMpinModal";
import UploadImageModal from "../modals/UploadImageModal";
import { useForm } from "react-hook-form";
import UploadPanModal from "../modals/UploadPanModal";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ClearIcon from "@mui/icons-material/Clear";

import HoverPopOpen from "../component/HoverPopOpen";
import { primaryColor, getEnv } from "../theme/setThemeColor";
import LockIcon from "@mui/icons-material/Lock";
import ShowDocsModal from "../modals/ShowDocsModal";
import { useLocation } from "react-router-dom";
import UserBankList from "./UserBankList";
import AuthorizationLetters from "./AuthorizationLetters";
import { my_profile, PROJECTS } from "../utils/constants";
import ApiToken from "../modals/ApiToken";
import ApiKey from "../modals/ApiKey";
import CustomTabs from "../component/CustomTabs";

import UploadModal from "../modals/UploadModal";
import DocumentUploader from "./DocumentUploder";

let bankObjCallBack;
const NewMyProfile = () => {
  const { handleSubmit } = useForm();
  const authCtx = useContext(AuthContext);
  const user = authCtx && authCtx.user;
  // const kycImages = user.kyc_images;
  const access = authCtx.token;
  console.log("user data", user);
  const [selectedType, setSelectedType] = useState("personal");
  const [editable, setEditable] = useState("");
  const [aadhaarFront, setAadhaarFront] = useState();
  const [aadhaarFrontPreview, setAadhaarFrontPreview] = useState();
  const [aadhaarBack, setAadhaarBack] = useState();
  const [aadhaarBackPreview, setAadhaarBackPreview] = useState();
  const [pan, setPan] = useState();
  const [panPreview, setPanPreview] = useState();
  const [shopPreview, setShopPreview] = useState();
  const [gst, setGst] = useState();
  const [gstPreview, setGstPreview] = useState();
  const [bank, setBank] = useState();
  const [personImage, setPersonImage] = useState();
  const [personImagePreview, setPersonImagePreview] = useState();
  const [others1, setOthers1] = useState();
  const [others1Preview, setOthers1Preview] = useState();
  const [others2, setOthers2] = useState();
  const [others2Preview, setOthers2Preview] = useState();
  const [others3, setOthers3] = useState();
  const [others3Preview, setOthers3Preview] = useState();
  const [others4, setOthers4] = useState();
  const [others4Preview, setOthers4Preview] = useState();

  // const [gender, setGender] = useState(
  //   user && user.gender && capitalize(user.gender)
  // );
  const [gender, setGender] = useState(user?.gender?.toUpperCase());

  // validations hooks
  const [isEmailv, setIsEmailv] = useState(true);
  const [isMobv, setIsMobv] = useState(true);
  // const [isAccNov, setIsAccNov] = useState(true);
  // const [isIfscNov, setIsIfscNov] = useState(true);

  // const [bankSearchIfsc, setbankSearchIfsc] = useState();
  // radio buttons hooks
  const [radioButton, setradioButton] = useState(user && user.two_factor);
  const [prevRadioState, setprevRadioState] = useState(user && user.two_factor);
  const [MpinCallBackVal, setMpinCallBackVal] = useState();
  //
  const [progress, setProgress] = useState(false);
  const [openMPin, setopenMPin] = useState(false);
  const [isBig, setIsBig] = useState(true);

  // the aadhaar and pan files hook
  const [panFile, setPanFile] = useState();
  const [aadhaarFile, setAadhaarFile] = useState();
  const [aadhaarBackFile, setAadhaarBackFile] = useState();
  const [gstFile, setGstFile] = useState();
  const [bankFile, setBankFile] = useState();
  const [others1File, setOthers1File] = useState();
  const [others2File, setOthers2File] = useState();
  const [shop, setShop] = useState();
  const [photoFile, setPhotoFile] = useState();

  const [aadhaarPreview, setAadhaarPreview] = useState();
  const [aadhaarBPreview, setAadhaarBPreview] = useState();
  const [photoPreview, setPhotoPreview] = useState();
  const [bankPreview, setBankPreview] = useState();
  const [hideDocs, setHideDocs] = useState(false);
  const [docsImgApi, setDocsImgApi] = useState();
  const [bankV, setBankV] = useState(false);
  const [aadhaarB, setAadhaarB] = useState(false);
  const [aadhaarV, setAadhaarV] = useState(false);
  const [panV, setPanV] = useState(false);
  const [photoV, setPhotoV] = useState(false);
  const [kycImages, setKycImages] = useState({});
  const envName = getEnv();
  const location = useLocation();
  // useEffect for opening doc when we come from modal
  useEffect(() => {
    if (location?.state?.docs) {
      setSelectedType("document");
    }
    return () => {};
  }, []);
  const getUserAgain = () => {
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

  const twoFactorChange = () => {
    postJsonData(
      ApiEndpoints.TWOFA_AUTH,
      { mpin: MpinCallBackVal, auth_factor: radioButton },
      setProgress,
      (res) => {
        okSuccessToast(res.data.message);
        setMpinCallBackVal("");
        getUserAgain();
      },
      (err) => {
        apiErrorToast(err);
        setMpinCallBackVal("");
        setradioButton(user && user.two_factor);
        getUserAgain();
      }
    );
  };

  const showDocumentsAfterMpin = () => {
    postJsonData(
      ApiEndpoints.OBTAIN_DOCS,
      { mpin: MpinCallBackVal },
      setProgress,
      (res) => {
        const docs = res?.data?.data;
        setDocsImgApi(docs);
        setHideDocs(true);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const handleforms = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    let data;
    if (selectedType === "personal") {
      data = {
        id: user && user.id,
        name: form.name.value,
        email: form.email.value,
        mobile: form.alter_mob.value,
        gender: gender,
        address: form.address.value,
        pan: form.pan.value,
      };
    } else if (selectedType === "business") {
      data = {
        id: user && user.id,
        business_name: form.bname.value,
        business_address: form.b_address.value,
        business_pan: form.b_pan.value,
        gstin: form.gstin.value,
      };
    } else if (selectedType === "bank") {
      data = {
        id: user && user.id,
        acc_name: form.holder_name.value,
        bank: bankObjCallBack && bankObjCallBack.split(",")[0],
        acc_number: form.accNo.value,
        ifsc: form.ifsc.value,
      };
    }
    // else if (selectedType === "document") {
    //   data = {
    //     id: user && user.id,
    //     holder_name: form.holder_name.value,
    //     bank_name: form.bank_name.value,
    //     accNo: form.accNo.value,
    //     ifsc: form.ifsc.value,
    //   };
    // }
    postJsonData(
      ApiEndpoints.UPDATE_USER_PROFILE,
      data,
      setProgress,
      (res) => {
        const user = res.data.data;
        authCtx.saveUser(user);
        okSuccessToast("Profile updated");
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const validateImages = (image, imgOf) => {
    console.log("image", image);
    const fileSize = Math.round(image.size / 1024);
    const [img, typeofImg] = image?.type.split("/");

    const fileType = ["jpg", "JPG", "png", "PNG", "jpeg", "JPEG"];
    const messageFiles = ["jpg", "png", "jpeg"];
    if (!fileType.includes(typeofImg)) {
      if (imgOf === "pan") {
        setPanV(`Please upload a valid file format for Pan ${messageFiles}`);
        return `Please upload a valid file format for Pan ${messageFiles}`;
      } else {
        setAadhaarV(
          `Please upload a valid file format for Aadhaar ${messageFiles}`
        );
        return `Please upload a valid file format for Aadhaar ${messageFiles}`;
      }
    } else if (fileSize > 300) {
      if (imgOf === "pan") {
        setPanV(`File should be less than 300Kb for Pan`);
      } else {
        setAadhaarV(`File should be less than 300Kb for Aadhar`);
      }
    } else {
      if (imgOf === "pan") {
        setPanV(true);
        return true;
      } else {
        setAadhaarV(true);
        return true;
      }
    }
  };

  const handleImageUpload = () => {
    let aValid;
    let pValid;

    const formData = new FormData();
    console.log("form data");

    aValid = validateImages(panFile, "pan");
    pValid = validateImages(aadhaarFile, "aadhaar");

    if (aValid === true && pValid === true) {
      formData.append("pan_image", panFile);
      formData.append("aadhaar_image", aadhaarFile);

      postJsonData(
        ApiEndpoints.UPLOAD_USER_KYC,
        formData,
        setProgress,
        (res) => {
          okSuccessToast("Documents uploaded Successfully");
          getUserAgain();
        },
        (err) => {
          apiErrorToast(err);
        }
      );
    }
  };
  useEffect(() => {
    if (MpinCallBackVal && MpinCallBackVal.length === 6) {
      if (selectedType === "authentication") twoFactorChange();
      if (selectedType === "document") showDocumentsAfterMpin();
    }
  }, [MpinCallBackVal]);

  // obj url of pan
  useEffect(() => {
    if (!panFile) {
      setPanPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(panFile);
    setPanPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [panFile]);

  // obj url of aadhaar
  React.useEffect(() => {
    if (!aadhaarFile) {
      setAadhaarPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(aadhaarFile);
    setAadhaarPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [aadhaarFile]);

  React.useEffect(() => {
    if (!aadhaarBackFile) {
      setAadhaarBPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(aadhaarBackFile);
    setAadhaarBPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [aadhaarBackFile]);

  React.useEffect(() => {
    if (!photoFile) {
      setPhotoPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(photoFile);
    setPhotoPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [photoFile]);
  // know window size with javascript
  const changeApply = () => {
    if (window.innerWidth < 900) setIsBig(false);
    else if (window.innerWidth > 900) setIsBig(true);
  };

  // useEffect to apply window size event
  useEffect(() => {
    window.addEventListener("resize", changeApply);

    return () => {
      window.removeEventListener("resize", changeApply);
    };
  });

  const tabs =
    user?.aggreement === 0
      ? [
          { label: "Personal " },
          { label: "Business " },
          { label: "Banking " },
          { label: "Documents" },
          { label: "2-FA" },
          { label: "Certificate" },
          { label: "Service Agreement" },
        ]
      : [
          { label: "Personal " },
          { label: "Business " },
          { label: "Banking " },
          { label: "Documents" },
          { label: "2-FA" },
          { label: "Certificate" },
        ];

  const [value, setValue] = useState(0);
  const [currentType, setCurrentType] = useState("Personal"); // Default active tab value

  const handleChange = (event, newValue) => {
    console.log("newval", newValue);
    setValue(newValue);
    setSelectedType(my_profile[newValue]);
    setCurrentType(my_profile[newValue]);
  };

  useEffect(() => {
    if (user?.kyc_images) {
      // If kyc_images is not null, parse it
      if (user.kyc_images !== null) {
        const parsedKycImages = JSON.parse(user.kyc_images);
        setKycImages(parsedKycImages);
      }
    }
  }, [user]);

  const renderUploadOption = (key) => {
    console.log("key", key);

    return (
      <Grid
        item
        md={5.6}
        sx={{
          mr: { md: 2, sm: 0, xs: 0 },
          mt: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <UploadModal
          callbackImage={(image) => {
            console.log("image", image);

            // Assuming setAadhaarFile is defined in the parent component
          }}
          key={key}
          title={key}
          maxFileSize={300}
          fileTypes={["jpg", "png", "jpeg"]}
        />
        <Typography
          sx={{
            fontFamily: "poppins",
            fontSize: "12px",
            color: "red",
            fontWeight: "bold",
            textAlign: "left",
            mt: 2,
          }}
        >
          {`Please upload ${key.charAt(0).toUpperCase() + key.slice(1)}`}
        </Typography>
      </Grid>
    );
  };

  // If kyc_images is null or empty, display the upload option
  const isKycImagesEmpty = Object.keys(kycImages).length === 0;

  return (
    <>
      <CustomTabs tabs={tabs} value={value} onChange={handleChange} />
      <Grid container sx={{ display: "flex", justifyContent: "start" }}>
        <Grid
          item
          lg={12}
          md={8.5}
          sm={12}
          xs={12}
          sx={{ backgroundColor: "#fff", mb: 2, height: "auto" }}
        >
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{ p: 2, display: "flex", justifyContent: "center" }}
            className="card-css"
          >
            <Box
              component="div"
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: {
                  lg: "row",
                  md: "row",
                  sm: "column",
                  xs: "column",
                },
                alignItems: "center",
              }}
            >
              <div style={{ position: "relative" }}>
                <Avatar
                  id="user_img"
                  alt={user.name}
                  src={user.gender === "FEMALE" ? femaleAvatar : maleAvatar}
                  sx={{ width: 90, height: 90 }}
                />

                <div
                  style={{ bottom: "-5%", right: "-5%", position: "absolute" }}
                >
                  <UploadImageModal
                    endpt={ApiEndpoints.UPLOAD_USER_PHOTO}
                    getUserAgain={getUserAgain}
                  />
                </div>
              </div>

              <Box
                component="div"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: { md: "start", xs: "center" },
                  marginLeft: { md: "28px", sm: "0px", xs: "0px" },
                }}
              >
                {/* namme */}
                <Box
                  component="div"
                  sx={{
                    fontSize: "28px",
                    fontWeight: "bolder",
                    display: "flex",
                    justifyContent: {
                      md: "space-between",
                      sm: "center",
                      xs: "center",
                    },
                  }}
                >
                  {authCtx && authCtx.user && authCtx.user.name}
                </Box>

                {/* role */}
                <Box
                  component="div"
                  sx={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    display: "flex",
                    justifyContent: "start",
                  }}
                >
                  {user.role === "Dd"
                    ? "Direct Dealer"
                    : user.role === "Ret"
                    ? "Retailer"
                    : user.role === "Ad"
                    ? "Area Distributor"
                    : user.role === "Md"
                    ? "Master Distributor"
                    : user.role === "Admin"
                    ? "Admin"
                    : user.role === "Api"
                    ? "Api"
                    : user.role === "Asm"
                    ? "Asm"
                    : user.role === "Zsm"
                    ? "Zsm"
                    : "Role"}
                </Box>
                {/* buttons */}
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start", // Align items to the start of the container
                    marginTop: "12px",
                    flexWrap: "wrap", // Allow wrapping to the next line
                    gap: "8px", // Space between buttons
                  }}
                >
                  <ChangePass sx={{ padding: "8px 16px" }} />
                  <ChangeMpin sx={{ padding: "8px 16px" }} />
                  <ResetMpin sx={{ padding: "8px 16px" }} />

                  {(user.role === "Ret" || user.role === "Dd") && (
                    <></>
                    // <ChangeLayoutModal sx={{ padding: "8px 16px" }} />
                  )}
                  {user.role !== "Admin" &&
                    user.role !== "Asm" &&
                    user.role !== "Zsm" && (
                      <>
                        {/* <ViewVirtualAcct sx={{ padding: "8px 16px" }} /> */}
                        {/* <ApiToken user={user} sx={{ padding: "8px 16px" }} />
        <ApiKey user={user} sx={{ padding: "8px 16px" }} /> */}
                      </>
                    )}
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item md={12} sm={12} xs={12} id="info-box">
            {/* personal box */}
            {selectedType === "personal" && (
              <Grid
                item
                // hidden={selectedType !== "personal"}
                className="card-css"
                sx={{ p: 3, mt: 2, mb: { md: 0, xs: 5 } }}
              >
                <Box
                  component="form"
                  id={selectedType}
                  validate
                  autoComplete="off"
                  onSubmit={handleforms}
                  sx={{
                    "& .MuiTextField-root": { m: 2 },
                    objectFit: "contain",
                    overflowY: "scroll",
                  }}
                  className="position-relative"
                >
                  {selectedType === "personal" && <Loader loading={progress} />}

                  <Typography
                    sx={{
                      py: 2,
                      px: 2,
                      // position: "relative",
                    }}
                    className="my-profile-topography"
                  >
                    Change Personal Information Here
                  </Typography>

                  <Button
                    className="edit-profile-button"
                    variant="outlined"
                    sx={{ p: 0 }}
                    onClick={() => {
                      if (editable === "personal") {
                        setEditable("");
                      } else {
                        setEditable("personal");
                      }
                    }}
                  >
                    {editable === "personal" ? (
                      <ClearIcon className="edit-icon" />
                    ) : (
                      <ModeEditIcon className="edit-icon" />
                    )}
                    <Typography
                      sx={{
                        fontSize: "13px",
                        display: { md: "flex", sm: "none", xs: "none" },
                      }}
                    >
                      {editable === "personal" ? "Cancel" : "edit"}
                    </Typography>
                  </Button>
                  <Grid container sx={{ pt: 1 }}>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          autoComplete="off"
                          label="Name"
                          id="name"
                          size="small"
                          defaultValue={user.name}
                          disabled={editable !== "personal"}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          autoComplete="off"
                          label="Email"
                          id="email"
                          size="small"
                          defaultValue={user.email}
                          error={!isEmailv}
                          disabled={editable !== "personal"}
                          helperText={!isEmailv ? "Enter valid Email Id" : ""}
                          onChange={(e) => {
                            setIsEmailv(PATTERNS.EMAIL.test(e.target.value));
                            if (e.target.value === "") setIsEmailv(true);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <UsernameChangeModal
                        uname={user && user.username}
                        disabled={editable !== "personal"}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          autoComplete="off"
                          label="Alternate Mobile"
                          id="alter_mob"
                          size="small"
                          defaultValue={user.mobile}
                          disabled={editable !== "personal"}
                          error={!isMobv}
                          helperText={!isMobv ? "Enter valid Mobile" : ""}
                          onChange={(e) => {
                            setIsMobv(PATTERNS.MOBILE.test(e.target.value));
                            if (e.target.value === "") setIsMobv(true);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          autoComplete="off"
                          label="Gender"
                          id="gender"
                          size="small"
                          // select={user && user.gender ? false : true}
                          select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          // defaultValue={user && capitalize(user.gender)}
                          // disabled={user && user.gender ? true : false}
                          disabled={editable !== "personal"}
                        >
                          <MenuItem value="MALE">
                            <div style={{ textAlign: "left" }}>Male</div>
                          </MenuItem>
                          <MenuItem value="FEMALE ">
                            <div style={{ textAlign: "left" }}>Female</div>
                          </MenuItem>
                          <MenuItem value="OTHERS">
                            <div style={{ textAlign: "left" }}>Other</div>
                          </MenuItem>
                        </TextField>
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          autoComplete="off"
                          label="Address"
                          id="address"
                          size="small"
                          defaultValue={
                            user?.address ? user.address : user?.p_address
                          }
                          disabled={editable !== "personal"}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          autoComplete="off"
                          label="PAN"
                          id="pan"
                          size="small"
                          defaultValue={user.pan}
                          disabled
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>

                <Button
                  className="button-red"
                  variant="contained"
                  type="submit"
                  form={selectedType}
                  sx={{
                    width: "96%",
                    textTransform: "capitalize",
                    mt: 1,
                    backgroundColor: "#231942",
                    "&:hover": {
                      backgroundColor: "#231942",
                    },
                  }}
                  disabled={!isEmailv || !isMobv || editable !== "personal"}
                >
                  Update Information
                </Button>
              </Grid>
            )}

            {/* business box */}
            {selectedType === "business" && (
              <Grid
                item
                // hidden={selectedType !== "business"}
                className="card-css"
                sx={{ p: 3, mt: 2, mb: { md: 0, xs: 5 } }}
              >
                <Box
                  component="form"
                  onSubmit={handleforms}
                  id={selectedType}
                  noValidate
                  autoComplete="off"
                  sx={{
                    "& .MuiTextField-root": { m: 2 },
                    objectFit: "contain",
                    overflowY: "scroll",
                  }}
                  className="position-relative"
                >
                  <Typography
                    sx={{
                      py: 2,
                      px: 2,
                    }}
                    className="my-profile-topography"
                  >
                    Change Business Information Here
                  </Typography>

                  <Button
                    className="edit-profile-button"
                    variant="outlined"
                    sx={{ p: 0 }}
                    onClick={() => {
                      if (editable === "business") {
                        setEditable("");
                      } else {
                        setEditable("business");
                      }
                    }}
                  >
                    {editable === "business" ? (
                      <ClearIcon className="edit-icon" />
                    ) : (
                      <ModeEditIcon className="edit-icon" />
                    )}
                    <Typography
                      sx={{
                        fontSize: "13px",
                        display: { md: "flex", sm: "none", xs: "none" },
                      }}
                    >
                      {editable === "business" ? "Cancel" : "edit"}
                    </Typography>
                  </Button>
                  <Grid container sx={{ pt: 1 }}>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          autoComplete="off"
                          label="Business Name"
                          id="bname"
                          size="small"
                          defaultValue={user.name}
                          // disabled={editable !== "business"}
                          disabled
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          autoComplete="off"
                          label=" Business Address"
                          id="b_address"
                          size="small"
                          defaultValue={user.address}
                          disabled={editable !== "business"}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          autoComplete="off"
                          label="PAN"
                          id="b_pan"
                          size="small"
                          defaultValue={user.pan}
                          disabled
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          autoComplete="off"
                          label="GSTIN"
                          id="gstin"
                          size="small"
                          defaultValue={user.gstin}
                          disabled
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
                <Button
                  variant="contained"
                  type="submit"
                  form={selectedType}
                  sx={{
                    width: "96%",
                    textTransform: "capitalize",
                    mt: 1,
                    backgroundColor: "#231942",
                    "&:hover": {
                      backgroundColor: "#231942",
                    },
                  }}
                  disabled={editable !== "business"}
                >
                  Update Information
                </Button>
              </Grid>
            )}

            {/* bank box */}
            {selectedType === "bank" && (
              <Grid
                item
                className="card-css"
                sx={{
                  py: 2,
                  px: 1.5,
                  mt: 2,
                  mb: { md: 0, xs: 5 },
                }}
              >
                <Box
                  component="form"
                  onSubmit={handleforms}
                  id={selectedType}
                  validate
                  autoComplete="off"
                  sx={{
                    "& .MuiTextField-root": { m: 2 },
                    objectFit: "contain",
                    overflowY: "scroll",
                  }}
                  className="position-relative"
                >
                  {selectedType === "bank" && <Loader loading={progress} />}
                  {user && user.acc_number ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Typography className="my-profile-topography">
                        Add Bank Account
                      </Typography>
                      {/* <UserAddBankModal /> */}
                    </div>
                  ) : (
                    <Typography
                      sx={{
                        py: 2,
                        px: 2,
                      }}
                      className="my-profile-topography"
                    >
                      Change Bank Information Here
                    </Typography>
                  )}
                </Box>
                <UserBankList />
              </Grid>
            )}

            {/* document box */}
            {selectedType === "document" && (
              <Grid
                item
                className="card-css position-relative"
                sx={{ p: 3, mt: 2, mb: { md: 0, xs: 5 } }}
              >
                {authCtx.ifDocsUploaded &&
                  authCtx.ifDocsUploaded.aadhaar_image === 1 &&
                  authCtx.ifDocsUploaded &&
                  authCtx.ifDocsUploaded.pan_image === 1 && (
                    <div
                      hidden={hideDocs}
                      className="position-absolute text-primary fw-bolder fs-4"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        zIndex: 100,
                        top: 0,
                        left: "1px",
                        // position: "absolute",
                        backgroundColor: "#ffffff0",
                        borderRadius: "4px",
                        backdropFilter: "blur(20px)",
                        color: "#fff",
                        background: "rgba(255, 255, 255, 0.61)",
                        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <LockIcon
                        sx={{ fontSize: "4rem" }}
                        onClick={() => setopenMPin(true)}
                        className="hover-zoom"
                      />
                      Click to view documents
                    </div>
                  )}

                <Box
                  component="form"
                  id={selectedType}
                  noValidate
                  autoComplete="off"
                  sx={{
                    "& .MuiTextField-root": { m: 2 },
                    objectFit: "contain",
                    overflowY: "scroll",
                    py: 2,
                    px: 2,
                  }}
                  className="position-relative"
                >
                  <Typography
                    sx={{
                      py: 2,
                    }}
                    className="my-profile-topography"
                  >
                    Upload Documents Here
                    {user?.kyc_images && <HoverPopOpen />}
                  </Typography>
                  <Typography
                    textAlign="justify"
                    sx={{
                      pb: 2,
                    }}
                  >
                    Upload a self-signed copy of Aadhaar and Pan <br />
                    <span style={{ fontSize: "14px" }}>
                      1. Only JPG, PNG, JPEG Images. <br />
                      2. Image Should be less than 512Kb.
                    </span>
                  </Typography>
                  <DocumentUploader view={"UploadData"} />
                </Box>
                {/* <Button
  variant="contained"
  onClick={() => handleImageUpload(selectedType)} // Trigger the function directly
  sx={{
    width: "96%",
    textTransform: "capitalize",
    mt: 1,
    backgroundColor: "#231942",
    "&:hover": {
      backgroundColor: "#231942",
    },
  }}
>
  Update Information
</Button> */}
              </Grid>
            )}
            {/* 2fa box */}
            {selectedType === "authentication" && (
              <div className=" position-relative">
                <Loader loading={progress} />
                <Grid
                  item
                  // hidden={selectedType !== "personal"}
                  className="card-css"
                  sx={{ p: 3, mt: 2, mb: { md: 0, xs: 5 } }}
                >
                  <Box
                    component="form"
                    id={selectedType}
                    validate
                    autoComplete="off"
                    onSubmit={handleforms}
                    sx={{
                      "& .MuiTextField-root": { m: 2 },
                      objectFit: "contain",
                      overflowY: "scroll",
                    }}
                    className="position-relative"
                  >
                    {selectedType === "personal" && (
                      <Loader loading={progress} />
                    )}

                    <Typography
                      sx={{
                        py: 2,
                        px: 2,
                      }}
                      className="my-profile-topography"
                    >
                      Change Authentication Type Here
                    </Typography>
                    <Grid container sx={{ pt: 1 }}>
                      <Grid item md={12} xs={12} sx={{ mx: 2 }}>
                        <Typography textAlign="justify">
                          2-Factor Authentication (2FA) is an added security
                          layer for logins, requiring two forms of
                          identification. Typically, a password or PIN plus a
                          unique one-time code sent via SMS or email, or a
                          physical security key. This helps prevent unauthorized
                          access to an account, increasing protection against
                          data breaches and identity theft.
                        </Typography>
                      </Grid>
                      <Grid item md={8} xs={12}>
                        <FormControl sx={{ width: "100%", mt: 3, mx: 2 }}>
                          <FormLabel
                            sx={{ textAlign: "left", color: primaryColor() }}
                          >
                            2-Factor Authentication (2FA)
                          </FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={radioButton}
                            onChange={(e) => {
                              setradioButton(e.target.value);
                              setopenMPin(true);
                            }}
                          >
                            <FormControlLabel
                              value="OTP"
                              control={
                                <Radio
                                  sx={{
                                    "&.Mui-checked": {
                                      color: primaryColor(),
                                    },
                                  }}
                                />
                              }
                              label="OTP"
                              sx={{ pr: 1 }}
                            />
                            <FormControlLabel
                              value="MPIN"
                              control={
                                <Radio
                                  sx={{
                                    "&.Mui-checked": {
                                      color: primaryColor(),
                                    },
                                  }}
                                />
                              }
                              label="MPin"
                              sx={{ pr: 1 }}
                            />
                            {/* <FormControlLabel
                              value="NONE"
                              control={
                                <Radio
                                  sx={{
                                    "&.Mui-checked": {
                                      color: primaryColor(),
                                    },
                                  }}
                                />
                              }
                              label="Disable"
                              sx={{
                                mx: 0,
                              }}
                            /> */}
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </div>
            )}
            {/* //token */}
            {selectedType === "TOKENDATA" && (
              <div className="position-relative">
                <Loader loading={progress} />
                <Grid
                  item
                  className="card-css"
                  sx={{ p: 3, mt: 2, mb: { md: 0, xs: 5 } }}
                >
                  <Box
                    component="form"
                    id={selectedType}
                    validate
                    autoComplete="off"
                    onSubmit={handleforms}
                    sx={{
                      "& .MuiTextField-root": { m: 2 },
                      objectFit: "contain",
                      overflowY: "scroll",
                    }}
                    className="position-relative"
                  >
                    <Typography
                      sx={{
                        py: 2,
                        px: 2,
                      }}
                      className="my-profile-topography"
                    >
                      Change API Token and API Key
                    </Typography>
                    <Grid container sx={{ pt: 1 }}>
                      <Grid item md={12} xs={12} sx={{ mx: 2 }}>
                        <Typography textAlign="justify">
                          API Token and API Key are used to authenticate and
                          authorize requests to a service. These credentials
                          help in managing and controlling access to the
                          service. Ensure that your API Token and API Key are
                          kept secure and not exposed publicly.{" "}
                        </Typography>
                      </Grid>
                      {/* New Grid container for ApiToken and ApiKey */}
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={6}>
                          <ApiToken />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <ApiKey />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </div>
            )}

            {/* bc certificate */}
            {selectedType === "bc" && envName !== PROJECTS.moneyoddr && (
              <AuthorizationLetters />
            )}

            {selectedType === "service" &&
              (user.role === "Dd" || user.role === "Ret") && (
                <Grid
                  item
                  className="card-css"
                  sx={{ p: 3, mt: 2, mb: { md: 0, xs: 5 } }}
                >
                  <h5>To View Retailer Agreement</h5>
                  <br />
                  <a href="/service" target="_blank" rel="noopener noreferrer">
                    Click here
                  </a>
                </Grid>
              )}

            {selectedType === "service" &&
              (user.role === "Ad" || user.role === "Md") && (
                // (user.role === "Ret" && (
                <Grid
                  item
                  className="card-css"
                  sx={{ p: 3, mt: 2, mb: { md: 0, xs: 5 } }}
                >
                  <h5>To View Distributor Agreement</h5>
                  <br />
                  <a
                    href="/distributoragreement"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Click here
                  </a>
                </Grid>
              )}
          </Grid>
        </Grid>
      </Grid>
      <CommonMpinModal
        open={openMPin}
        setOpen={setopenMPin}
        hooksetterfunc={setradioButton}
        radioPrevValue={prevRadioState}
        mPinCallBack={(mPinValue) => {
          setMpinCallBackVal(mPinValue);
        }}
      />
    </>
  );
};

export default NewMyProfile;
