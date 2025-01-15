import React, { useContext, useRef } from "react";
import { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import {
  Box,
  FormControl,
  TextField,
  Button,
  Tooltip,
  Checkbox,
  Typography,
  FormControlLabel,
  FormHelperText,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import AuthContext from "../store/AuthContext";
import DownloadIcon from "@mui/icons-material/Download";
import html2pdf from "html2pdf.js";
import PinInput from "react-pin-input";
import ModalHeader from "../modals/ModalHeader";
import ModalFooter from "../modals/ModalFooter";
import { dilliPaysign } from "../iconsImports";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints, { BASE_URL } from "../network/ApiEndPoints";
import { useLocation } from "react-router-dom";
import { datemonthYear, myDateDDMMTT, myDateDDMMyy } from "../utils/DateUtils";
import axios from "axios";
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    lineHeight: 1.3,
  },
  section: {
    marginBottom: 9,
  },
  viewer: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  image: {
    width: 160,
  },
  stamp_image: {
    width: 200,
    marginLeft: -15,
  },
  bigtext: {
    fontSize: 200,
    letterSpacing: 0.4,
    lineHeight: 1.2,
  },
  text: {
    fontSize: 11,
    letterSpacing: 0.4,
    marginBottom: 30,
    lineHeight: 1.5,
    textAlign: "justify",
    wordWrap: "break-word",
  },
});

const AdminAgreement = () => {
  const [open, setOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState("");

  const [request, setRequest] = useState(false);
  const [aadhaar, setAadhaar] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpRefrance, setOtpRefrance] = useState("");
  const [aadhaarError, setAadhaarError] = useState(false);
  const [message, setMessage] = useState("Your are not sign Agreement");
  const [checked, setChecked] = useState(false);
  const [showForPDF, setShowForPDF] = useState(false);
  const [date, setDate] = useState();
  const [otpError, setOtpError] = useState(false);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const token = authCtx.token;
  const location = useLocation();
  const [kycImages, setKycImages] = useState({});
  const [imageUrl, setImageUrl] = useState(null);
  // Extract query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
console.log("imageUrl",imageUrl);

  // Parse and store the required state data
  const stateData = {
    name:queryParams.get("name"),
    role:queryParams.get("role"),
    state:queryParams.get("state"),
    establishment:queryParams.get("establishment"),
    username:queryParams.get("username"),
    name:queryParams.get("name"),
    rowData: queryParams.get("rowData"),
    kyc_images:queryParams.get("kyc_images"),
    ip: queryParams.get("ip"),
    pan:queryParams.get("pan"),
    type: queryParams.get("type"),
  };
  useEffect(() => {
    if (stateData.kyc_images) {
      setKycImages(JSON.parse(stateData.kyc_images));
    }
  }, [stateData.kyc_images]);

  // Log the extracted data
  console.log("The rowData is:", stateData.rowData);

  // Optional: Handle undefined or null rowData
  if (!stateData.rowData) {
    console.warn("rowData is not present in the URL query parameters.");
  }

  const contentRef = useRef();

  useEffect(() => {
    if (!stateData?.rowData) return; // Ensure stateData.rowData is available

    postJsonData(
      ApiEndpoints.AGEMENT_DATE,
      { id: stateData.rowData },
      setRequest,
      (res) => {
        const date = res.data.data.created_at;
        setMessage(
          `This agreement is electronically transmitted on ${myDateDDMMTT(
            date
          )} from IP address  ${stateData.ip}. and verified by (${
            stateData?.establishment
          }/${stateData?.name}) having PAN NO ${stateData?.pan} `
        );

        // setDate(res.data.data.created_at);
        setChecked(true); // Update the state with the date
      },
      (err) => {
        console.error("Error fetching date:", err); // Handle errors
      }
    );
  }, [stateData?.rowData]); // Empty

  const handleDownload = () => {
    setShowForPDF(true);

    setTimeout(() => {
      document.getElementById("downloadButton").classList.add("hide-in-pdf");

      const element = contentRef.current;
      const options = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: "Distributor_Agreement.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 3, letterRendering: true, useCORS: true },
        jsPDF: { unit: "in", format: "A4", orientation: "portrait" },
      };

      html2pdf()
        .set(options)
        .from(element)
        .save()
        .finally(() => {
          setShowForPDF(false);

          document
            .getElementById("downloadButton")
            .classList.remove("hide-in-pdf");
        });
    }, 500);
  };
  const getImage = async (fileName) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/${ApiEndpoints.GET_FILES}`,
        { fileName },
        { responseType: "blob", headers: headers }
      );

      const imageUrl = URL.createObjectURL(new Blob([response.data]));
      return imageUrl;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  const fetchImage = async (filename) => {
    const fileName = kycImages[filename];
    const url = await getImage(fileName);
    if (url) {
      // setOpenModal(true);
      setImageUrl(url);
    }
  };
     React.useEffect(() => {
        fetchImage("signature")
        }, [stateData]);
  const getCurrentDateTime = () => {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year} `;
  };

  useEffect(() => {
    setCurrentDateTime(getCurrentDateTime());

    const interval = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function handleChange(e) {
    setChecked(!checked);
    setOpen(!checked);
  }
  // function handleValue(e) {
  //   const { name, value } = e.target;
  //   if (name === "aadhaar") {
  //     setAadhaar(value);
  //   } else if (name === "otp") {
  //     setOtp(value);
  //   }
  // }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // width: "40%",
    boxShadow: 24,
    fontFamily: "Poppins",
    height: "max-content",
    overflowY: "scroll",
    p: 2,
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAadhaarError("");
    setOtpError("");

    // Aadhaar validation
    if (aadhaar.length !== 12) {
      setAadhaarError("Enter Valid Aadhaar Number");
      return;
    }

    // Helper function to get stateData's location
    const getLocation = (e) =>
      new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position.coords),
            (error) => reject(error)
          );
        } else {
          reject(new Error("Geolocation is not supported by this browser."));
        }
      });

    try {
      // Retrieve stateData's location
      const { latitude, longitude } = await getLocation();

      // Send Aadhaar and location data (no OTP required)
      postJsonData(
        ApiEndpoints.SEND_OTP_Okyc, // You might want to rename the API endpoint if OTP is not being sent
        { aadhaarNumber: aadhaar, latitude, longitude },
        setRequest,
        (res) => {
          console.log("Aadhaar submitted successfully", res);
          setOtpRefrance(res?.data?.data?.otpReferenceID);
          setIsOtpSent(true); // Set OTP sent status to true
        },
        (err) => {
          console.error("Error submitting Aadhaar", err);
          setAadhaarError("Error submitting Aadhaar. Please try again.");
        }
      );
    } catch (error) {
      console.error("Error fetching location:", error);
      setAadhaarError("Unable to fetch location. Please try again.");
    }
  };
  const verifyOTP = async (e) => {
    e.preventDefault();
    setOtpError("");
    const getLocation = () =>
      new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position.coords),
            (error) => reject(error)
          );
        } else {
          reject(new Error("Geolocation is not supported by this browser."));
        }
      });
    if (!isOtpSent) {
      // If OTP is not sent, validate Aadhaar number
      if (aadhaar.length !== 12) {
        setAadhaarError("Enter Valid Aadhaar Number");
        return;
      }
      // Proceed with OTP sending if Aadhaar is valid
      try {
        const { latitude, longitude } = await getLocation();

        postJsonData(
          ApiEndpoints.SEND_OTP_Okyc,
          { aadhaarNumber: aadhaar, latitude, longitude },
          setRequest,
          (res) => {
            console.log("OTP sent successfully", res);
            setOtpRefrance(res?.data?.data?.otpReferenceID);
            setIsOtpSent(true); // Set OTP sent status
          },
          (err) => {
            console.error("Error sending OTP", err);
            setOtpError("Error sending OTP. Please try again.");
          }
        );
      } catch (error) {
        console.error("Error fetching location:", error);
        setOtpError("Unable to fetch location. Please try again.");
      }
    } else {
      // OTP verification block
      if (otp.length === 6) {
        try {
          const { latitude, longitude } = await getLocation();

          // Verify OTP
          postJsonData(
            ApiEndpoints.VERIFY_OTP_OKYC,
            { otp, otpReferenceID: otpRefrance, latitude, longitude },
            setRequest,
            (res) => {
              console.log("OTP verified successfully", res);
              // setMessage(`This agreement  is electronically transmitted on ${myDateDDMMTT(
              //   date
              // )} from IP address ……………….. and verified by (${
              //   stateData?.establishment
              // }/${stateData?.name}) having PAN NO ${stateData?.pan} `);
              setChecked(true);
              handleDownload();

              handleClose();
            },
            (err) => {
              console.error("Error verifying OTP", err);
              setOtpError("Invalid OTP. Please try again.");
            }
          );
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      } else {
        setOtpError("Enter a valid OTP.");
      }
    }
  };
  const handleCloseModel = () => {
    setAadhaar("");
    setOtp("");
    setIsOtpSent(false);
    setChecked(false);
    setOpen(false);
  };
  const handleClose = () => {
    setAadhaar("");
    setOtp("");
    setIsOtpSent(false);
    setOpen(false);
  };
  return (
    <>
      <div
        ref={contentRef}
        style={{
          padding: "20px",
          flexGrow: 1,
          fontFamily: "Arial, sans-serif",
          lineHeight: "1.6",
          maxWidth: "800px",
          margin: "0 auto",
          color: "#333",
          textAlign: "justify",
          overflowWrap: "break-word",
          wordWrap: "break-word",
          whiteSpace: "normal",
        }}
      >
        <Page size="A4" style={styles.page}>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            <Typography variant="h3" align="center" fontWeight="bolder">
              RETAILER AGREEMENT
            </Typography>
            {/* <Button onClick={()=>fetchImage("signature")}>fetch</Button> */}
            <Tooltip title="Download as PDF" arrow>
              <Button
                id="downloadButton"
                onClick={handleDownload}
                style={{
                  minWidth: "auto",
                  padding: 8,
                  mb: 1,
                }}
              >
                <DownloadIcon style={{ color: "black" }} />
              </Button>
            </Tooltip>
          </Box>
          <Typography
            variant="body1"
            style={{
              lineHeight: 1.6,
              textAlign: "justify",
              wordWrap: "break-word",
            }}
            paragraph
          >
            THIS Agreement is made as of this date between:
          </Typography>

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            VistarMoney TECHNOLOGIES LIMITED
          </Typography>
          <Typography variant="body1" paragraph>
            A company incorporated under The Companies Act, 2013, having its
            registered office at Plot No 5, Second Floor, Pocket 5, Sector 24,
            Rohini, Delhi-110085.
          </Typography>
          <Typography variant="body1" paragraph>
            (Hereinafter referred to as “VistarMoney” which expression shall,
            unless repugnant to the context or meaning thereof, include their
            successors and permitted assigns) of the ONE PART; and
          </Typography>
          <Typography variant="h5" fontWeight="bold" paragraph>
            {stateData.establishment} ,{stateData.id} , {stateData.name}, {stateData.username}
          </Typography>
          <Typography variant="body1" paragraph>
            (Hereinafter referred to as "RETAILER", which expression shall,
            unless repugnant to the context or meaning thereof, include their
            successors and permitted assigns) of the SECOND PART.
          </Typography>
          <Typography variant="body1" paragraph>
            The VistarMoney and the Retailer are herein collectively referred to as
            the “Parties” and individually as a “Party.”
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              marginBottom: 2,
            }}
          >
            1. APPOINTMENT OF THE RETAILER
          </Typography>
          <Typography variant="body1" paragraph>
            Subject to the terms and conditions contained in this Retailer
            Agreement, VistarMoney hereby appoints the Retailer on a non-exclusive
            basis for the Territory to provide the services mentioned in
            Annexure-I (hereinafter referred to as "Services"), and the Retailer
            hereby agrees to provide the Services.
          </Typography>
          <Typography variant="body1" paragraph>
            The Retailer may describe himself as VistarMoney’s authorised Retailer,
            but must not hold itself out as being entitled to bind VistarMoney in
            any way.
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              marginBottom: 2,
            }}
          >
            2. COMMENCEMENT TERM AND RENEWAL
          </Typography>

          <Typography variant="body1" paragraph>
            The Retailer shall commence business in accordance with this
            Agreement within 15 days from the date of signing. This Agreement
            shall be valid for a period of 9 (nine) years unless terminated by
            either Party in accordance with clause 13.
          </Typography>
          <Typography variant="body1" paragraph>
            Upon expiry, the Agreement may be renewed at VistarMoney’s option, on
            mutually agreed terms, provided that VistarMoney informs the Retailer
            one month prior to the completion of the Term.
          </Typography>
        </Page>
        <Page size="A4" style={styles.page}>
          <section>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              3. PROVISION OF SERVICES
            </Typography>

            <Typography variant="body1" paragraph>
              During the Term, the Retailer shall render to VistarMoney services as
              defined in Annexure-I. VistarMoney reserves the right to modify,
              alter, or amend the list of Services, and the Retailer agrees to
              be bound by any such changes.
            </Typography>
          </section>

          <section>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              4. BUSINESS PLAN AND RETAILERS or DISTRIBUTORS
            </Typography>

            <Typography variant="body1" paragraph>
              The Distributor and Retailer shall mutually agree upon a Business
              Plan for sourcing retailers for VistarMoney. VistarMoney reserves the
              right to appoint additional Distributors or terminate this
              Agreement if the Distributor fails to meet the agreed minimum
              targets.
            </Typography>
            <Typography variant="body1" paragraph>
              The Distributor is solely responsible for managing credit
              transactions with the retailers in its Territory, and VistarMoney is
              not liable for any disputes arising from such transactions.
            </Typography>
          </section>

          <section>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              5.PAYMENT AND COMMISSION
            </Typography>

            <Typography variant="body1" paragraph>
              The Retailer shall deposit a sum of INR [……….../=] [……..in
              words……...] with the VistarMoney on or before the effective date. The
              deposit shall be non-interest bearing and shall be refunded at the
              time of termination of the Retailer Agreement in accordance with
              the provision defined in clause 14 (Consequences of Termination)
              of this Retailer Agreement.
            </Typography>

            <Typography variant="body1" paragraph>
              The Retailer acknowledges that the VistarMoney may reject the deposit
              at its sole discretion on or before the effective date.
            </Typography>
            <Typography variant="body1" paragraph>
              The Retailer acknowledges that the VistarMoney may reject the deposit
              at its sole discretion on or before the effective date.
            </Typography>

            <Typography variant="body1" paragraph>
              Retailer agrees and acknowledges that the VistarMoney shall not be
              responsible or liable in any manner whatsoever for the sources of
              such deposits and/or working capital, and it is the sole
              responsibility of the Retailer to ensure that the sources of such
              deposits and/or working capital are legitimate and are in
              accordance with the law of India.
            </Typography>
            <Typography variant="body1" paragraph>
              All the amount due to VistarMoney under this Retailer Agreement,
              including the deposit and working capital and/or platform fee,
              shall be deposited in accordance with the instructions provided in
              Annexure-II. Retailer agrees and acknowledges that the VistarMoney
              may, by prior written notice of two business days, modify any of
              the details mentioned in Annexure-II and the Retailer shall be
              bound by all such modifications
            </Typography>

            <Typography variant="body1" paragraph>
              Retailer acknowledges and agrees that VistarMoney strictly prohibits
              any third-party deposits in any bank accounts via any mode
              whatsoever. In the event that Retailer or its Retailer indulges in
              any such transaction(s) knowingly or unknowingly, the Retailer
              authorizes VistarMoney to freeze its account immediately.
            </Typography>

            <Typography variant="body1" paragraph>
              Retailer shall be entitled to the commission, discount or service
              fee, or such other remuneration referred in the Services, as may
              be specified by the VistarMoney, from time to time and published on
              VistarMoney’s portal. All the amounts paid by way of the commission
              shall be exclusive to all applicable taxes, including goods and
              service tax, surcharge, cess etc., by whatsoever name called, and
              such taxes will be subject to the deduction of tax at source, if
              applicable; VistarMoney shall debit the account of the Retailer to
              the extent of such taxes.
            </Typography>
            <Typography variant="body1" paragraph>
              The commission shall accrue to the Retailer only on receipt and
              realization of full payment by the VistarMoney of all dues from the
              retailers who are managed by the Distributor.
            </Typography>
            <Typography variant="body1" paragraph>
              The commission so accrued shall be paid to the Retailer on a
              monthly basis by way of bank transfer or additional credit in the
              working capital.
            </Typography>
            <Typography variant="body1" paragraph>
              Payments made to the Retailer shall be subject to such withholding
              as prescribed under the applicable law, subject to the aforesaid,
              VistarMoney assumes no responsibility for the tax compliance of the
              Retailer.
            </Typography>

            <Typography variant="body1" paragraph>
              The Retailer agrees that payments made to the Retailer shall be
              subject to the deduction of chargeback/ complaint against the AEPS
              transactions, Payment Gateway transactions and / or QR code
              transactions or any deposit or withdrawal transaction any other
              transactions whatsoever.
            </Typography>
            <Typography variant="body1" paragraph>
              The Retailer agrees and authorizes VistarMoney to impose cash deposit
              bank charges which shall be subject to deduction from the payments
              made to the Retailer.
            </Typography>
            <Typography variant="body1" paragraph>
              All costs and expenses for travelling, promotional activities and
              other similar out-of-pocket expenses incurred in the performance
              of the Services shall be borne by the Retailer.
            </Typography>

            <Typography variant="body1" paragraph>
              Retailer agrees and acknowledges that in case of any deviation
              with respect to the use of key salt, it shall be solely liable and
              responsible; and in such event, VistarMoney is authorized to
              immediately deactivate the account of Retailer without any prior
              notice. VistarMoney shall not be held responsible for any
              consequences that arise out of any unauthorized use of its
              platform in any manner.
            </Typography>

            <Typography variant="body1" paragraph>
              The Retailer agrees and authorizes VistarMoney to freeze its account
              or account of its Retailer in the event VistarMoney receives any
              complaint from any relevant statutory or non-statutory authority
              or any government department or agency. The Retailer further
              agrees and authorizes VistarMoney to withdraw the disputed amount
              along with the anticipated penalty from the such frozen account.
            </Typography>

            <Typography variant="body1" paragraph>
              Retailer agrees and acknowledges that all the sales/ receipts of
              the Retailer regarding the VistarMoney shall be immediately Deposit
              or transfer of the funds into the designated Bank Accounts of the
              VistarMoney and shall get limit from the Company/ VistarMoney
              thereafter. The Retailer shall ensure that the working limit in
              the portal by VistarMoney against the cash deposit or funds transfer
              is made available to the Retailer immediately. The Retailer shall
              inform to the Company/ VistarMoney in predefined format, if the
              Retailer fails to inform the same within seven calendar days the
              amount will be forfeit by the Company/ VistarMoney. Retailer may
              deposit such cash self or via its employee or agent or any
              authorized person into the designated Bank Accounts of the
              VistarMoney.
            </Typography>
          </section>

          <section>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              6. OPERATIONS OF THE RETAILER
            </Typography>

            <Typography variant="body1" paragraph>
              The Retailer shall operate and provide the Services from its
              independent offices equipped with the necessary infrastructure and
              workforce required to provide the Services. The Retailer shall
              provide a prior written intimation of any changes in the location
              of such office to VistarMoney.
            </Typography>
            <Typography variant="body1" paragraph>
              VistarMoney may, at its discretion, provide advice to the Retailer in
              relation to exteriors and interiors of the Retailer’s office,
              investment information technology systems, basic accounting and
              business procedure etc. The Retailer shall be bound by such advice
              of VistarMoney.
            </Typography>
          </section>
          <section>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              7. MARKET INTELLIGENCE
            </Typography>

            <Typography variant="body1" paragraph>
              The Retailer shall develop adequate and relevant market
              intelligence in relation to the Territory and shall inform
              VistarMoney from time to time about the activities of other
              persons/companies engaged in a similar business.
            </Typography>
          </section>
        </Page>
        <section>
          <Typography
            variant="h4"
            sx={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              marginBottom: 2,
            }}
          >
            8. EMPLOYEES OF RETAILER
          </Typography>

          <Typography variant="body1" paragraph>
            The Retailer shall engage the minimum number of personnel as
            specified by the VistarMoney and such other additional personnel as may
            be required to effectively provide the Services. The Retailer shall
            ensure that all personnel employed in the provision of the Services
            shall be adequately trained and shall comply with the Term of this
            Retailer Agreement. The Retailer agrees and acknowledges that it
            shall do proper due diligence and background check of all such
            personnel.
          </Typography>
          <Typography variant="body1" paragraph>
            The Retailer shall be liable and responsible for any data theft or
            misuse of any data related to clients of VistarMoney from its office.
          </Typography>
          <Typography variant="body1" paragraph>
            The Retailer agrees and acknowledges that VistarMoney will not have any
            obligations, liability or responsibility whatsoever to supervise or
            manage the Retailer's employees, agents or independent contractors.
          </Typography>
        </section>
        <Page size="A4" style={styles.page}>
          <section>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              9. INTELLECTUAL PROPERTY
            </Typography>

            <Typography variant="body1" paragraph>
              VistarMoney hereby grants the Retailer a limited, non-exclusive,
              non-transferable, non-assignable and royalty- free license to use
              the Software for the purpose of providing the Services as
              contemplated under this Retailer Agreement, which may be revoked
              by VistarMoney at its sole discretion.
            </Typography>
            <Typography variant="body1" paragraph>
              The Retailer is expressly prohibited from distributing,
              sub-licensing, assigning, transferring or otherwise the Software,
              or other technical documentation pertaining thereto, or any
              portions thereof in any form to any person.
            </Typography>
            <Typography variant="body1" paragraph>
              The Retailer may utilize any third-party software other than the
              Software provided by VistarMoney, only with prior permission from
              VistarMoney. Further, the Retailer shall ensure that the third-party
              software is validly licenced and installed.
            </Typography>
            <Typography variant="body1" paragraph>
              The VistarMoney shall retain all the rights over all the intellectual
              property, including the Software, its name and logo and all the
              rights in relation to the promotion and marketing materials. The
              Retailer hereby acknowledges that (a) the execution of this
              Retailer Agreement does not amount to any transfer to it of any
              intellectual property rights held by the VistarMoney prior to the
              execution of this Retailer Agreement, nor does this Retailer
              Agreement in any way limit the VistarMoney’s rights over its
              intellectual property, including the right to licence to others
              and, (b) any and all goodwill arising from the Retailer’s use of
              the intellectual property shall be exclusive ofVistarMoney without
              any compensation to anyone.
            </Typography>
            <Typography variant="body1" paragraph>
              The Retailer shall not use the Software of the VistarMoney in any
              manner whatsoever without the written permission of the VistarMoney.
            </Typography>
          </section>

          <section>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              10. CONFIDENTIALITY
            </Typography>

            <Typography variant="body1" paragraph>
              Parties undertake to retain in confidence the terms of this
              Retailer Agreement and all other non-public information,
              technology, materials, and know-how of the other party disclosed
              to or acquired by the receiving party pursuant to or in connection
              with this Retailer Agreement that is either designated as
              proprietary or confidential or by the nature of the circumstances
              surrounding disclosure, ought in good faith to be treated as
              proprietary or confidential information, provided that each party
              may disclose the terms and conditions of this Retailer Agreement
              to its immediate legal and financial consultants in the ordinary
              course of its business.
            </Typography>
            <Typography variant="body1" paragraph>
              That Retailer agrees and acknowledges that the VistarMoney has a
              responsibility to its customers to keep customer information
              strictly confidential. The Retailer agrees and acknowledges to
              keep all information related to customers strictly confidential
              that the Retailer is in the possession, or gains access to or
              become aware of during the course of rendering the services under
              this Retailer Agreement.
            </Typography>
            <Typography variant="body1" paragraph>
              The provision of clause 10 shall survive the expiry of termination
              of this Retailer Agreement.
            </Typography>
          </section>
        </Page>
        <Page size="A4" style={styles.page}>
          <section>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              11. COMPETITION AND SOLICIT
            </Typography>

            <Typography variant="body1" paragraph>
              The Retailer agrees and undertakes that during the Term of
              Retailer Agreement and for a period of one year thereafter, it
              shall not, directly, through its employees, affiliates or
              relatives or in a firm where the Retailer or any relative or
              nominee of the Retailer is a partner or in any company where the
              Retailer or any relative or nominee of the Retailer is a director
              or shareholder, 1.) be appointed as a Retailer for any other
              person or legal entity which is carrying on a business similar or
              in competition with any business carried by VistarMoney at the
              relevant time, whether in India or abroad, or 2.) engage in any
              business that is similar to or in competition with any business
              carried on by the VistarMoney at the relevant time.
            </Typography>
            <Typography variant="body1" paragraph>
              During the Term of Retailer Agreement, the Retailer shall not
              either directly or indirectly solicit any employee of VistarMoney for
              employment, induce or attempt to induce any such employee to
              terminate or breach his or her employment agreement with VistarMoney,
              or hire any such employee or associate with any such employee,
              either during the course of their employment with VistarMoney or
              after the termination of their employment with the VistarMoney.
            </Typography>
            <Typography variant="body1" paragraph>
              During the Term of this Retailer Agreement, the Retailer shall not
              either directly or indirectly, solicit, cause in any part or
              knowingly encourage any existing or potential clients or customers
              of VistarMoney to cease doing business or not to do business, in
              whole or in part of with VistarMoney, or solicit, cause in any part
              or knowingly encourage any existing or potential clients or
              customers of VistarMoney to do business with any person other then
              VistarMoney, or associate with any prospective clients or customers
              while they continue to be clients or customers of VistarMoney.
            </Typography>
          </section>

          <section>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              12. EXCLUSIVITY
            </Typography>

            <Typography variant="body1" paragraph>
              The Retailer shall only market and promote Services of VistarMoney,
              as authorized by the VistarMoney.
            </Typography>
          </section>

          <section>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              13. TERMINATION OF AGREEMENT
            </Typography>

            <Typography variant="body1" paragraph>
              VistarMoney may terminate this Retailer Agreement of the Retailer
              with immediate effect, if a. in the opinion of VistarMoney, Retailer
              is not the fit person to perform Services under the provision of
              Retailer Agreement. b. Retailer fails to deposit the proceeds of
              sale/ receipts made by the Retailer or its retailers to VistarMoney
              on a daily basis and perpetual basis. c. Retailer becomes the
              subject of a voluntary petitioner in bankruptcy or any voluntary
              proceedings relating to insolvency, liquidation or composition for
              the benefit of the creditors. d. Retailer fails to comply with
              directions issued by the VistarMoney under the provision of this
              Retailer Agreement. Notwithstanding anything to the contrary
              herein, VistarMoney may terminate this Retailer Agreement without
              notice.
            </Typography>
            <Typography variant="body1" paragraph>
              Retailer may terminate this Retailer Agreement with written notice
              of 60 (sixty) days to VistarMoney.
            </Typography>
          </section>
          <section>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              14. CONSEQUENCE OF TERMINATION
            </Typography>

            <Typography variant="body1" paragraph>
              Upon termination of this Retailer Agreement for any reason as
              stated in clause 13 above, the Retailer shall a. immediately
              discontinue and cease to use the trade mark, logo, other
              intellectual property, Software provided by the VistarMoney and shall
              immediately hand over all copies or documents of such intellectual
              property to VistarMoney. b. immediately return to VistarMoney all
              confidential information, originals and copies of any and all
              materials provided to the Retailer under this Retailer Agreement
              or in the course of provision of the services. c. immediately
              provide remote access to VistarMoney to disable any Software that
              VistarMoney has installed with the Retailer. d. immediately remove
              all sign board, banners, and glowboards of VistarMoney from its
              offices and also all such materials which will indicate any
              association with VistarMoney. e. immediately ceases to promote,
              market or advertise VistarMoney or its products/services. f.
              immediately clear all dues within the period of 7 days from the
              date of termination.
            </Typography>
          </section>

          <section>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              15. INDEMNITY
            </Typography>
            <Typography variant="body1" paragraph>
              The Retailer shall indemnify itself and hold VistarMoney and all its
              financial partners, affiliates, officers, directors, employees,
              successors, and assignees harmless against all customer claims,
              actions, demands, litigations, suits, proceedings, and against all
              losses, expenses, costs, damages, charges, penalties, etc., due to
              any willful negligence, fraud, breach of applicable laws, or
              breach of any terms of this Retailer Agreement directly
              attributable to the Retailer.
            </Typography>
            <Typography variant="body1" paragraph>
              Notwithstanding anything contained in this Retailer Agreement,
              VistarMoney shall not be liable to the Retailer for any incidental,
              indirect, consequential damages, or loss of revenue or business
              opportunities.
            </Typography>

            <Typography variant="body1" paragraph>
              The Retailer shall ensure that the VistarMoney platform or services
              are not used for money laundering and comply with Anti-Money
              Laundering laws, including but not limited to the Prevention of
              Money Laundering Act, 2002 and the rules and regulations made
              under it.
            </Typography>
            <Typography variant="body1" paragraph>
              Retailer undertakes that Retailer will neither allow nor entertain
              requests for transfer of money and/or any transaction through the
              use of VistarMoneyPlatform or services for the following:
              <ul>
                <li>Any form of drugs;</li>
                <li>Arms;</li>
                <li>Terrorist activities;</li>
                <li>Money laundering;</li>
                <li>Counterfeiting;</li>
                <li>Cross-border transactions;</li>
                <li>Illegal activities;</li>
                <li>Any article prohibited by Government of India.</li>
              </ul>
            </Typography>
            <Typography variant="body1" paragraph>
              Retailer undertakes that Retailer shall not indulge in the
              following:
              <ul>
                <li>
                  Breaking a single transaction into multiple transactions to
                  earn more commission;
                </li>
                <li>
                  Indulging in financial transactions resulting in
                  round-tripping of funds;
                </li>
                <li>Selling customer information to third parties;</li>
                <li>
                  Making additional copies (digital or physical) of any customer
                  forms, documents, or photographs.
                </li>
              </ul>
            </Typography>
          </section>
        </Page>
        <Page size="A4" style={styles.page}>
          <section>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              16. RELATIONSHIP BETWEEN THE PARTIES
            </Typography>

            <Typography variant="body1" paragraph>
              The Services rendered by the Retailer under this Retailer
              Agreement shall be provided as an independent contractor to
              VistarMoney, and nothing in this Retailer Agreement creates or shall
              be deemed to create the relationship of partners, joint venture,
              employees, or principal-agent between the Parties.
            </Typography>
          </section>
        </Page>
        {/* Section 17: RECORDS AND AUDIT */}
        <Page size="A4" style={styles.page}>
          <section>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              17. RECORDS AND AUDIT
            </Typography>

            <Typography variant="body1" paragraph>
              The Retailer shall maintain all statutory books as required under
              applicable laws. The Retailer shall permit VistarMoney to inspect all
              books of accounts, records, and materials during normal business
              hours.
            </Typography>
            <Typography variant="body1" paragraph>
              The Retailer shall ensure KYC details are verified and carry out
              proper due diligence as instructed by VistarMoney.
            </Typography>
            <Typography variant="body1" paragraph>
              During the Term and up to sixty days after the termination of this
              Retailer Agreement, VistarMoney may carry out an audit to determine
              whether the Retailer has fulfilled its obligations.
            </Typography>
          </section>

          {/* Section 18: AMENDMENT */}

          <section>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              18. AMENDMENT
            </Typography>

            <Typography variant="body1" paragraph>
              No changes, alterations, modifications, or additions to this
              Retailer Agreement shall be valid unless made in writing and
              executed by both parties.
            </Typography>
          </section>

          {/* Section 19: ASSIGNMENT */}

          <section>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              19. ASSIGNMENT
            </Typography>

            <Typography variant="body1" paragraph>
              The Retailer shall not assign, sub-let, or subcontract any of its
              obligations under this Retailer Agreement to a third party unless
              prior written permission is obtained from VistarMoney.
            </Typography>
          </section>

          <section>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              20. COMMUNICATION
            </Typography>

            <Typography variant="body1" paragraph>
              The Retailer agrees that VistarMoney may communicate with them via
              voice, email, SMS, or any innovative communication method deemed
              fit by VistarMoney.
            </Typography>
          </section>

          {/* Section 21: LITIGATION */}

          <section>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              21. LITIGATION
            </Typography>

            <Typography variant="body1" paragraph>
              No legal action or suit can be initiated against VistarMoney without
              giving prior legal notice within 15 days from when the dispute
              arises. Any legal proceedings shall be subject to the jurisdiction
              of the courts at Delhi.
            </Typography>
          </section>
        </Page>
        {/* Signature Section */}
        <Page size="A4" style={styles.page}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "30px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "12px 20px",
                    textAlign: "left",
                    backgroundColor: "#f4f4f4",
                    fontWeight: "bold",
                  }}
                >
                  For and on behalf of:
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "12px 20px",
                    textAlign: "left",
                    backgroundColor: "#f4f4f4",
                    fontWeight: "bold",
                  }}
                >
                  For and on behalf of:
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "12px 20px",
                    verticalAlign: "top",
                  }}
                >
                  VistarMoney TECHNOLOGIES LIMITED
                </td>

                <td
                  style={{
                    border: "1px solid #000",
                    padding: "12px 12px",
                  }}
                >
                  Shop Name :{stateData.establishment}
                  {/* <input
                type="text"
                placeholder="Shop Name"
                style={{
                  width: "60%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                }}
              /> */}
                </td>
              </tr>
              {/* <tr>
            <td
              style={{
                border: "1px solid #000",
                padding: "12px 20px",
              }}
            >
              Sd/-
            </td>
            <td
              style={{
                border: "1px solid #000",
                padding: "12px 20px",
              }}
            >
              Sd/-
            </td>
          </tr> */}
              <tr>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "12px 20px",
                  }}
                >
                  Authorised Signatory - Tarun
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "12px 20px",
                  }}
                >
                  Authorised Signatory - {stateData.name}
                </td>
              </tr>
              <tr>
                {/* <td
                  style={{
                    border: "1px solid #000",
                    padding: "12px 20px",
                  }}
                > */}
                  {/* Name: */}
                  {/* <input
                type="text"
                placeholder="Enter Name"
                style={{
                  width: "80%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                }}
              /> */}
                {/* </td> */}
                {/* <td
                  style={{
                    border: "1px solid #000",
                    padding: "12px 20px",
                  }}
                > */}
                  {/* Name:  */}
                  {/* <input
                type="text"
                placeholder="Enter Name"
                style={{
                  width: "80%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                }}
              /> */}
                {/* </td> */}
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "12px 20px",
                  }}
                >
                  Designation: Director
                  {/* <input
                type="text"
                placeholder="Designation"
                style={{
                  width: "80%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                }}
              /> */}
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "12px 20px",
                  }}
                >
                  Designation: {stateData?.role}
                  {/* <input
                type="text"
                placeholder="Designation"
                style={{
                  width: "80%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                }}
              /> */}
                </td>
              </tr>
            </tbody>
          </table>
          <Box>
            <Text>Signature :</Text>
            <img src={dilliPaysign} />
          
          </Box>

          <h5
            style={{
              marginTop: "15px",
            }}
          >
            Date:{currentDateTime}
          </h5>
          <h5
            style={{
              marginTop: "5px",
            }}
          >
            Place: {stateData.state}
          </h5>

          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                // onChange={handleChange}
                color="primary"
                sx={{ transform: "scale(1.2)" }}
              />
            }
            label={
              <Typography
                sx={{ fontSize: "1rem", color: "#333", fontWeight: "500" }}
              >
                I accept
              </Typography>
            }
            sx={{ marginLeft: "8px" }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
           {imageUrl&&
            <img src={imageUrl} alt="signature" style={{ width: '100px', height: '60px' }} />}
            { stateData.name}
            <Text>Authorised Signatory</Text>
          </div>
          {(showForPDF || message) && (
            <>
              <Typography
                style={{
                  fontSize: "1rem",
                  // color:
                  //   message ==
                  //   `This agreement  is electronically transmitted on ${myDateDDMMTT(
                  //     date
                  //   )} from IP address ${stateData.ip}. and verified by (${
                  //     user?.establishment
                  //   }/${user?.name}) having PAN NO ${user?.pan} `
                  //     ? "green"
                  //     : "red",
                  color: stateData.type === "ret_dd" ? "green" : "red",
                  // color: "green",
                  fontWeight: "bold",
                  marginTop: "8px",
                }}
              >
                {console.log(
                  "type",
                  stateData.type,
                  stateData.type === "ret_dd"
                )}
                {message}
              </Typography>
              {message ===
              `This agreement  is electronically transmitted on ${myDateDDMMTT(
                date
              )} from IP address ${stateData.ip}. and verified by (${
                stateData?.establishment
              }/${stateData?.name}) having PAN NO ${stateData?.pan} ` ? (
                <Typography
                  style={{
                    fontSize: "1rem",
                    color: "black",
                    fontWeight: "bold",
                    marginTop: "8px",
                  }}
                >
                  date is: {myDateDDMMTT(date) || "Your have not sign Agrement"}
                </Typography>
              ) : (
                ""
              )}
            </>
          )}

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                width: 400,
                padding: 2,
                margin: "auto",
                mt: "20vh",
                borderRadius: "8px",
                boxShadow: 24,
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <ModalHeader
                title="Retailer Agreement"
                handleClose={handleCloseModel}
              />

              <Box sx={{ flexGrow: 1, mt: 2 }}>
                {!isOtpSent && (
                  <div>
                    <TextField
                      label="Aadhaar Number"
                      name="aadhaar"
                      value={aadhaar}
                      variant="outlined"
                      required
                      fullWidth
                      onChange={(e) => setAadhaar(e.target.value)}
                      placeholder="Enter your Aadhaar number"
                      inputProps={{ maxLength: 12 }}
                      sx={{ marginBottom: 2, mt: 2 }}
                    />
                    {aadhaarError && (
                      <FormHelperText error>{aadhaarError}</FormHelperText> // Show error message below Aadhaar field
                    )}
                  </div>
                )}

                <div>
                  {isOtpSent && (
                    <div>
                      <Typography
                        sx={{
                          mb: 1,
                          ml: 1,
                        }}
                      >
                        Enter OTP
                      </Typography>
                      <PinInput
                        value={otp}
                        onChange={setOtp}
                        length={6}
                        autoComplete="off"
                        focus
                        required
                        type="password"
                        sx={{ marginBottom: 2, mt: 2 }}
                      />
                      {otpError && (
                        <FormHelperText error>{otpError}</FormHelperText> // Show error message below OTP field
                      )}
                    </div>
                  )}
                </div>
              </Box>
              {/* <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={isOtpSent ? !otp : !aadhaar}
                  sx={{ mr: 1, mt: 1 }}
                >
                  Submit
                </Button>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  sx={{ mr: 1, mt: 1 }}
                >
                  Cancel
                </Button> */}

              <ModalFooter
                btn={"submit"}
                // onClick={!isOtpSent ? handleSubmit : verifyOTP}
                style={{
                  backgroundColor:
                    (isOtpSent && otp.length === 6) ||
                    (!isOtpSent && aadhaar.length === 12)
                      ? "#3f51b5"
                      : "#ddd",
                  cursor:
                    (isOtpSent && otp.length === 6) ||
                    (!isOtpSent && aadhaar.length === 12)
                      ? "pointer"
                      : "not-allowed",
                }}
              />
            </Box>
          </Modal>
        </Page>
      </div>
    </>
  );
};

export default AdminAgreement;
