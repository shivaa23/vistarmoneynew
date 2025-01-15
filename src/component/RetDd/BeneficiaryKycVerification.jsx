import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
// import { whiteColor } from "../../theme/setThemeColor";
// import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Loader from "../loading-screen/Loader";
import ShowDocsModal from "../../modals/ShowDocsModal";
import ModalHeader from "../../modals/ModalHeader";
import ModalFooter from "../../modals/ModalFooter";
import { useState } from "react";
import Mount from "../Mount";
import { useEffect } from "react";
import AddBeneDocs from "./AddBeneDocs";
import { postJsonData } from "../../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../../utils/ToastUtil";
import ApiEndpoints from "../../network/ApiEndPoints";
import { useForm } from "react-hook-form";
import CommonStatus from "../CommonStatus";
import { Icon } from "@iconify/react";
import { primaryColor } from "../../theme/setThemeColor";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "max-content",
  overflowY: "scroll",
};

const BeneficiaryKycVerification = ({ refresh, row }) => {
  const { handleSubmit } = useForm();
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [aadhaarFile, setAadhaarFile] = useState();
  const [accountDetailFile, setAccountDetailFile] = useState();
  const [panFile, setPanFile] = useState();

  // preview images hook
  const [panPreview, setPanPreview] = useState();
  const [aadhaarPreview, setAadhaarPreview] = useState();
  const [accountDetailPreview, setAccountDetailPreview] = useState();
  const [panV, setPanV] = useState(false);
  // aadhaar fornt
  const [aadhaarV, setAadhaarV] = useState(false);
  // aadhaar back
  const [accountDetailV, setAccountDetailV] = useState(false);

  const validateImages = (image, imgOf) => {
    if (!image) {
      return false;
    }
    const fileSize = Math.round(image.size / 1024);
    const splittedArry = image.name.split(".");
    const typeofImg = image.name.split(".")[splittedArry.length - 1];
    const fileType = ["jpg", "JPG", "png", "PNG", "jpeg", "JPEG"];
    const messageFiles = ["jpg", "png", "jpeg"];
    if (!fileType.includes(typeofImg)) {
      if (imgOf === "pan") {
        setPanV(`Please upload a valid file format for Pan ${messageFiles}`);
        return `Please upload a valid file format for Pan ${messageFiles}`;
      } else if (imgOf === "aadhaar") {
        setAadhaarV(
          `Please upload a valid file format for Aadhaar ${messageFiles}`
        );
        return `Please upload a valid file format for Aadhaar ${messageFiles}`;
      } else {
        setAccountDetailV(
          `Please upload a valid file format for Image ${messageFiles}`
        );
        return `Please upload a valid file format for Image ${messageFiles}`;
      }
    } else if (fileSize > 300) {
      if (imgOf === "pan") {
        setPanV(`File should be less than 300Kb for Pan`);
      } else if (imgOf === "aadhaar") {
        setAadhaarV(`File should be less than 300Kb for Aadhaar`);
      } else {
        setAccountDetailV(`File should be less than 300Kb for Account Detail`);
      }
    } else {
      if (imgOf === "pan") {
        setPanV(true);
        return true;
      } else if (imgOf === "aadhaar") {
        setAadhaarV(true);
        return true;
      } else {
        setAccountDetailV(true);
        return true;
      }
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setPanFile();
    setAccountDetailFile();
    setAadhaarFile();
  };

  // obj url of aadhaar
  useEffect(() => {
    if (!aadhaarFile) {
      setAadhaarPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(aadhaarFile);
    setAadhaarPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [aadhaarFile]);

  // obj url of aadhaarBack
  useEffect(() => {
    if (!accountDetailFile) {
      setAccountDetailPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(accountDetailFile);
    setAccountDetailPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [accountDetailFile]);

  // obj url Pan
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

  const handleImageUpload = () => {
    let aValid;
    let pValid;
    let AdValid;
    const formData = new FormData();
    AdValid = validateImages(accountDetailFile, "accountDetail");
    if (aValid === true || AdValid === true || pValid === true) {
      if (panFile) {
        formData.append("pan", panFile);
      }
      if (aadhaarFile) {
        formData.append("aadhaar", aadhaarFile);
      }
      if (accountDetailFile) {
        formData.append("account_detail", accountDetailFile);
      }
      formData.append("id", row?.id);
      postJsonData(
        ApiEndpoints.BENE_KYC,
        formData,
        setRequest,
        (res) => {
          okSuccessToast("Documents uploaded Successfully");
          if (refresh) refresh();
        },
        (err) => {
          apiErrorToast(err);
        }
      );
    }
  };

  return (
    <Box>
      {row?.kyc_status === 0 ? (
        <Tooltip title="Verify Beneficiary">
          <Button
            variant="outlined"
            // className="button-transparent"
            // className="pending-button"
            className="kyc-button"
            onClick={handleOpen}
            startIcon={
              <IconButton
                sx={{
                  p: 0,
                  color: "#7943c0",
                }}
              >
                <Icon icon="tdesign:user" style={{ fontSize: "15px" }} />
              </IconButton>
            }
            sx={{ py: 0.1, fontSize: "12px", minWidth: "120px" }}
          >
            <span style={{ marginTop: "1px", fontWeight: "bold" }}>KYC</span>
          </Button>
        </Tooltip>
      ) : row?.kyc_status === 1 ? (
        <CommonStatus
          status={row.kyc_status}
          approvedStatusText="Completed"
          minWidth="120px"
          fontSize="15px"
        />
      ) : row?.kyc_status === 2 ? (
        <CommonStatus
          status={row.kyc_status}
          pendingStatusText="Pending"
          minWidth="120px"
          fontSize="15px"
        />
      ) : (
        ""
      )}
      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <ModalHeader
              title="Upload KYC Documents"
              handleClose={handleClose}
            />
            <Loader loading={request} />
            <Box
              component="form"
              id="upload-images"
              validate
              autoComplete="off"
              onSubmit={handleSubmit(handleImageUpload)}
              sx={{
                "& .MuiTextField-root": { m: 2 },
              }}
            >
              <Grid
                spacing={1}
                container
                sx={{ pt: 1, display: "flex", justifyContent: "space-between" }}
              >
                {/* <Grid item md={12} sm={12} xs={12}>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      color: primaryColor(),
                      textDecoration: "underline",
                    }}
                  >
                    Choose any one of the given
                  </Typography>
                </Grid> */}
                {/* aadhaar front  ####################*/}
                {/* <Grid item md={aadhaarPreview ? 5 : 12} xs={12}>
                  <div style={{ width: aadhaarPreview ? "100%" : "42%" }}>
                    <AddBeneDocs
                      callbackImage={(imageFile) => {
                        setAadhaarFile(imageFile);
                      }}
                      title="Upload Aadhaar"
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
                      {(aadhaarV !== false || aadhaarV !== true) && aadhaarV}
                    </Typography>
                  </div>
                </Grid> */}
                {/* Show docs modal is also a grid */}
                {/* <Mount visible={aadhaarPreview}>
                  <ShowDocsModal
                    aadhaarPreview={aadhaarPreview}
                    title="Aadhaar"
                  />
                </Mount> */}
                {/* ################################### */}
                {/* aadhaar back ###################*/}
                <Grid item md={accountDetailPreview ? 5 : 12} xs={12}>
                  <div style={{ width: accountDetailPreview ? "100%" : "42%" }}>
                    <AddBeneDocs
                      callbackImage={(imageFile) => {
                        setAccountDetailFile(imageFile);
                      }}
                      title="Upload KYC Document"
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
                      {(accountDetailV !== false || accountDetailV !== true) &&
                        accountDetailV}
                    </Typography>
                  </div>
                </Grid>
                {/* Show docs modal is also a grid */}
                <Mount visible={accountDetailPreview}>
                  <ShowDocsModal
                    accountPreview={accountDetailPreview}
                    title="KYC Document"
                  />
                </Mount>
                {/* ################################### */}
                {/* Pan CArd  ###################*/}
                {/* <Grid item md={panPreview ? 5 : 12} xs={12}>
                  <div style={{ width: panPreview ? "100%" : "42%" }}>
                    <AddBeneDocs
                      callbackImage={(imageFile) => {
                        setPanFile(imageFile);
                      }}
                      title="Upload Pan Card"
                    />
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontSize: "12px",
                        color: "#5B9BD5",
                        fontWeight: "bold",
                        marginLeft: "1.2rem",
                        marginBottom: "0.4rem",
                        marginTop: "0.4rem",
                      }}
                    >
                      PAN Card is optional
                    </Typography>
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
                      {(panV !== false || panV !== true) && panV}
                    </Typography>
                  </div>
                </Grid> */}
                {/* Show docs modal is also a grid */}
                {/* <Mount visible={panPreview}>
                  <ShowDocsModal panPreview={panPreview} title="Pan" />
                </Mount> */}
                {/* ################################### */}
              </Grid>
            </Box>
            <ModalFooter
              form="upload-images"
              btn="Upload"
              // request={request}
              // disable={!aadhaarFile || !accountDetailFile || request}
              disable={
                request
                  ? request
                  : aadhaarFile || accountDetailFile || panFile
                  ? false
                  : true
              }
            />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default BeneficiaryKycVerification;
