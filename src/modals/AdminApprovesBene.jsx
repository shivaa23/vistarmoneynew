import { Box, Grid, IconButton, Modal, Tooltip } from "@mui/material";
import React from "react";
import ModalHeader from "./ModalHeader";
import { get, postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { useState } from "react";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import Mount from "../component/Mount";
import ModalFooter from "./ModalFooter";
import LabelComponent from "../component/LabelComponent";
import DetailsComponent from "../component/DetailsComponent";
import CommonStatus from "../component/CommonStatus";
import Loader from "../component/loading-screen/Loader";
import { Icon } from "@iconify/react";
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
  height: "90%",
  overflowY: "scroll",
};

const AdminApprovesBene = ({ row, refresh }) => {
  const [open, setOpen] = React.useState(false);
  const [request, setRequest] = useState(false);
  const [kycImages, setKycImages] = useState({
    aadhaar_image: "",
    account_detail_image: "",
    pan_image: "",
  });

  // console.log("panimage", kycImages);
  // const { account_detail_image, aadhaar_image, pan_image } = kycImages;
  const { account_detail_image } = kycImages;
  const handleOpen = () => {
    getBeneKYCDocs();
  };
  const handleClose = () => {
    setKycImages({
      account_detail_image: "",
      aadhaar_image: "",
      pan_image: "",
    });
    setOpen(false);
  };
  const getBeneKYCDocs = () => {
    get(
      ApiEndpoints.PAYOUT_BENE_KYC_DOCS,
      `id=${row?.id}`,
      setRequest,
      (res) => {
        const data = res?.data;
        Object.keys(data).forEach((image) => {
          if (kycImages.hasOwnProperty(image)) {
            return setKycImages((prevState) => ({
              ...prevState,
              [image]: data[image],
            }));
          }
        });
        setOpen(true);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const verifyRejectKYCDocs = (value) => {
    postJsonData(
      ApiEndpoints.PAYOUT_BENE_KYC_DOCS,
      {
        id: row?.id,
        kyc_status: value,
      },
      setRequest,
      (res) => {
        if (refresh) refresh();
        // console.log("res", res.data);
        okSuccessToast(res?.data?.message);
        handleClose();
      },
      (err) => {
        if (refresh) refresh();
        apiErrorToast(err);
      }
    );
  };

  return (
    <>
      <Tooltip title="Click to View Documents" placement="bottom">
        <IconButton
          onClick={handleOpen}
          sx={{
            color:
              row?.kyc_status === 0
                ? "#f44336"
                : row?.kyc_status === 1
                ? "#388e3c"
                : "#ffa726",
          }}
        >
          {request ? (
            <Loader loading={request} />
          ) : (
            <Icon
              icon="material-symbols:pageview-outline"
              width={25}
              height={25}
            />
          )}
        </IconButton>
      </Tooltip>
      <Modal open={open}>
        <Box sx={style} className="sm_modal">
          <ModalHeader title="Verify Documents" handleClose={handleClose} />
          <Grid container sx={{ display: "flex" }}>
            <Grid
              md={12}
              sx={{
                p: 2,
                mx: 1,
                display: "flex",
                alignItems: "flex-end",
                height: "max-content",
              }}
            >
              <div className="me-5">
                <LabelComponent label="Name" />
                <DetailsComponent detail={row?.name} fontSize="15px" />
              </div>
              <div className="me-4">
                <LabelComponent label="Account Number" />
                <DetailsComponent detail={row?.acc_number} fontSize="15px" />
              </div>
              <CommonStatus
                status={row.kyc_status}
                approvedStatusText="Verified"
                pendingStatusText="Pending"
                rejectedStatusText="Not Done"
                fontSize="18px"
                maxWidth="140px"
              />
            </Grid>
          </Grid>
          <Box sx={{ height: "65%", overflowY: "scroll" }}>
            <Grid container>
              {/* aarhaar front */}
              {/* <Mount visible={aadhaar_image}>
                <Grid
                  className="card-css"
                  item
                  md={5.7}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    p: 2,
                    mx: 1,
                  }}
                >
                  <img
                    src={aadhaar_image}
                    alt="aadhaar_image"
                    style={{ width: "100%", marginBottom: "15px" }}
                  />
                </Grid>
              </Mount> */}

              <Mount visible={account_detail_image}>
                <Grid
                  item
                  md={12}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                    mx: 1,
                  }}
                  className="card-css"
                >
                  <img
                    src={account_detail_image}
                    alt="account_image"
                    style={{ width: "90%", marginBottom: "15px" }}
                  />
                </Grid>
              </Mount>

              {/* <Mount visible={pan_image}>
                <Grid
                  item
                  md={12}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    p: 2,
                    mx: 1,
                    my: 2,
                  }}
                  className="card-css"
                >
                  <img
                    src={pan_image}
                    alt="pan_image"
                    style={{ width: "100%", marginBottom: "15px" }}
                  />
                </Grid>
              </Mount> */}
            </Grid>
          </Box>
          <ModalFooter
            request={request}
            btn="Reject"
            onClick={verifyRejectKYCDocs.bind(this, 0)}
            red1
            twobuttons="Approve"
            onClick2={verifyRejectKYCDocs.bind(this, 1)}
            disable={row?.kyc_status === 0}
            disableButtontwo={row?.kyc_status === 1 || row?.kyc_status === 0}
          />
        </Box>
      </Modal>
    </>
  );
};

export default AdminApprovesBene;
