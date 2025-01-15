import React, { useState, useEffect } from "react";
import {
  FormControl,
  Grid,
  TextField,
  Box,
  Tooltip,
  MenuItem,
  Drawer,
  Button,
  Typography,
  TableRow,
  TableCell,
  Table,
  TableBody,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import ApiEndpoints from "../network/ApiEndPoints";
import { get, postJsonData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import UpdateIcon from "@mui/icons-material/Update";
import RefreshComponent from "../component/RefreshComponent";
import useCommonContext from "../store/CommonContext";
const UserUpdateScheme = ({ row, refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);

  const [schemeData, setSchemeData] = useState([]);
  const [utilitySchemeData, setUtilitySchemeData] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(row?.scheme || "");
  const [selectedUtilityScheme, setSelectedUtilityScheme] = useState();
  // row?.utility_scheme == schemeData?.id || ""
  const [showUtilityDropdown, setShowUtilityDropdown] = useState(false);
  const [showExtraFields, setShowExtraFieldsUtility] = useState(false);
  const [showExtraFieldsPayout, setshowExtraFieldsPayout] = useState(false);
  const [showExtraFieldsAeps, setshowExtraFieldsAeps] = useState(false);
  const [showExtraFieldsCard, setshowExtraFieldsCard] = useState(false);
  const [data, setData] = useState();
  const [name, setName] = useState("");
  const [ad, setAd] = useState("");
  const [md, setMd] = useState("");
  const [ret, setRet] = useState("");
  const [dd, setDd] = useState("");
  const [id, setId] = useState();
  const [status, setStatus] = useState(row?.status || "");
  const [slab1, setSlab1] = useState(row?.slab1 || "");
  const [slab2, setSlab2] = useState(row?.slab2 || "");
  const [slab3, setSlab3] = useState(row?.slab3 || "");
  const [slab4, setSlab4] = useState(row?.slab4 || "");
  const [slab5, setSlab5] = useState(row?.slab5 || "");
  const [slab6, setSlab6] = useState(row?.slab6 || "");
  const [slab7, setSlab7] = useState(row?.slab7 || "");
  const [slab8, setSlab8] = useState(row?.slab8 || "");
  const [adComm, setAdComm] = useState(row?.ad_comm || "");
  const [mdComm, setMdComm] = useState(row?.md_comm || "");
  const [submittedData, setSubmittedData] = useState(null);

  console.log("data", data); // Log the data for debugging
  const { getRecentData, refreshUser, userRequest } = useCommonContext();

  const resolvePreviousScheme = (row, data, scheme) => {
    let previousScheme;
    setSelectedScheme(scheme);
    if (scheme === "DMT") {
      previousScheme = row.dmt_scheme
        ? data.filter((item) => item.id === row?.dmt_scheme)[0]
        : false;
    } else if (scheme === "PAYOUT") {
      previousScheme = row.payout_scheme
        ? data.filter((item) => item.id === row?.payout_scheme)[0]
        : false;
    } else if (scheme === "UTILITY") {
      previousScheme = row.utility_scheme
        ? data.filter((item) => item.id === row?.utility_scheme)[0]
        : false;
    }
    else if (scheme === "AEPS") {
      previousScheme = row.aeps_scheme
        ? data.filter((item) => item.id === row?.aeps_scheme)[0]
        : false;
    }
    else if (scheme === "CARD") {
      previousScheme = row.card_scheme
        ? data.filter((item) => item.id === row?.card_scheme)[0]
        : false;
    }
    console.log("previousScheme",previousScheme);
    
    if (previousScheme) {
      console.log("This is your selected Utility", selectedUtilityScheme);
      if (scheme === "UTILITY") {
        setSelectedUtilityScheme(previousScheme.name);
        setshowExtraFieldsPayout(false);
        setshowExtraFieldsAeps(false)
        setshowExtraFieldsCard(false)
        setShowExtraFieldsUtility(true);
       
      }
      if (scheme === "AEPS") {
        setSelectedUtilityScheme(previousScheme.name);
        setshowExtraFieldsPayout(false);
        setShowExtraFieldsUtility(false);
        setshowExtraFieldsAeps(true)
        setshowExtraFieldsCard(false)
      }
      if (scheme === "PAYOUT" || scheme === "DMT") {
        setSelectedUtilityScheme(previousScheme.name);
        setShowExtraFieldsUtility(false);
        setshowExtraFieldsPayout(true);
        setshowExtraFieldsAeps(false)
        setshowExtraFieldsCard(false)
      }
      if (scheme === "CARD" ) {
        setSelectedUtilityScheme(previousScheme.name);
        setShowExtraFieldsUtility(false);
        setshowExtraFieldsPayout(false);
        setshowExtraFieldsAeps(false)
        setshowExtraFieldsCard(true)
      }
      setSelectedUtilityScheme(previousScheme.name);
      setId(previousScheme?.id);
      setName(previousScheme?.name || ""); // Name field
      setAd(previousScheme?.ad || ""); // Ad field
      setMd(previousScheme?.md || ""); // Md field
      setRet(previousScheme?.ret || ""); // Ret field
      setDd(previousScheme?.dd || "");
      setStatus(previousScheme?.status === 1 ? "Active" : "Inactive");
      setSlab1(previousScheme?.slab1);
      setSlab2(previousScheme?.slab2);
      setSlab3(previousScheme?.slab3);
      setSlab4(previousScheme?.slab4);
      setSlab5(previousScheme?.slab5);
      setSlab6(previousScheme?.slab6);
      setSlab7(previousScheme?.slab7);
      setSlab8(previousScheme?.slab8);
      setAdComm(previousScheme?.ad_comm);
      setMdComm(previousScheme?.md_comm); // Dd field
      // setShowExtraFieldsUtility(true);
      setShowUtilityDropdown(true);
    }
    // setData(previousScheme);
  };

  const handleOpen = () => {
    getScheme();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedScheme("");
    refresh();
    setSelectedUtilityScheme("");
    setShowUtilityDropdown(false);
    setShowExtraFieldsUtility(false);
    setshowExtraFieldsPayout(false);
    setshowExtraFieldsAeps(false)
    setshowExtraFieldsCard(false)
  };

  const getScheme = () => {
    get(
      ApiEndpoints.GET_SCHEME,
      ``,
      setRequest,
      (res) => {
        console.log("Scheme Data", res?.data);
        setSchemeData(res?.data || []);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const handleSchemeChange = (event) => {
    const schemeId = event.target.value;
    console.log("This is your scheme id", schemeId);
    setSelectedScheme(schemeId);
    getUtilityScheme(schemeId);
  };
  console.log("selectedScheme", selectedUtilityScheme);

  const getUtilityScheme = (schemeId) => {
    let endpoint;
    if (schemeId === "UTILITY") {
      endpoint = ApiEndpoints.GET_UTILITY_SCHEME;
    } else if (schemeId === "DMT") {
      console.log("dmt condition");
      endpoint = ApiEndpoints.GET_DMT_SCHEMA;
    } else if (schemeId === "PAYOUT") {
      console.log("payout condition");
      endpoint = ApiEndpoints.GET_PAYOUT_SCHEMA + `?payout2&&true`;
    }
    else if (schemeId === "AEPS") {
      console.log("payout condition");
      endpoint = ApiEndpoints.GET_AEPS_SCHEMA ;
    }
    else if (schemeId === "CARD") {
      console.log("payout condition");
      endpoint = ApiEndpoints.GET_CARD_SCHEMA ;
    }
    get(
      endpoint,
      "",
      setRequest,
      (res) => {
        setShowExtraFieldsUtility(false);
        setshowExtraFieldsPayout(false);
        setshowExtraFieldsAeps(false)
        setUtilitySchemeData(res?.data?.data || []);
        setShowUtilityDropdown(true);
        setData(res.data.data);
        resolvePreviousScheme(row, res.data.data, schemeId);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const handleUtilitySchemeChange = (event) => {
    const utilitySchemeName = event.target.value;
    setSelectedUtilityScheme(utilitySchemeName);

    const selectedSchemeData = utilitySchemeData.find(
      (scheme) => scheme.name === utilitySchemeName
    );

    if (selectedSchemeData) {
      // Set the status based on the selected scheme
      setStatus(selectedSchemeData.status === 1 ? "Active" : "Inactive");

      // Show the extra fields
      if (selectedScheme === "UTILITY") {
        setshowExtraFieldsPayout(false);
        setShowExtraFieldsUtility(true);
      }
      if (selectedScheme === "PAYOUT" || selectedScheme === "DMT") {
        setShowExtraFieldsUtility(false);
        setshowExtraFieldsPayout(true);
      }
      if (selectedScheme === "AEPS" ) {
        setShowExtraFieldsUtility(false);
        setshowExtraFieldsPayout(false);
        setshowExtraFieldsAeps(true)
      }
      if (selectedScheme === "CARD" ) {
        setShowExtraFieldsUtility(false);
        setshowExtraFieldsPayout(false);
        setshowExtraFieldsAeps(false)
        setshowExtraFieldsCard(true)
      }
      // Set the complete data object for the selected scheme

      setId(selectedSchemeData?.id);
      console.log("the id is", id);
      // Map individual fields based on selected scheme data
      setName(selectedSchemeData?.name || ""); // Name field
      setAd(selectedSchemeData?.ad || ""); // Ad field
      setMd(selectedSchemeData?.md || ""); // Md field
      setRet(selectedSchemeData?.ret || ""); // Ret field
      setDd(selectedSchemeData?.dd || "");
      setStatus(selectedSchemeData?.status === 1 ? "Active" : "Inactive");
      setSlab1(selectedSchemeData?.slab1);
      setSlab2(selectedSchemeData?.slab2);
      setSlab3(selectedSchemeData?.slab3);
      setSlab4(selectedSchemeData?.slab4);
      setSlab5(selectedSchemeData?.slab5);
      setSlab6(selectedSchemeData?.slab6);
      setSlab7(selectedSchemeData?.slab7);
      setSlab8(selectedSchemeData?.slab8);
      setAdComm(selectedSchemeData?.ad_comm);
      setMdComm(selectedSchemeData?.md_comm); // Dd field
    }
  };

  const handleUpdateScheme = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      id: row?.id,
      utility_scheme: id,
    };
  
    const payoutData = {
      payout_scheme: id,
      id: row?.id,
    };
    const dmtData = {
      dmt_scheme: id,
      id: row?.id,
    };
    const aepsData = {
      aeps_scheme: id,
      id: row?.id,
    };
    const cardData = {
      card_scheme: id,
      id: row?.id,
    };
    const apiend = ApiEndpoints.ADMIN_SERVICES;
    postJsonData(
      apiend,
      selectedScheme === "UTILITY"
        ? data
        : selectedScheme === "PAYOUT"
        ? payoutData
        : selectedScheme === "AEPS"
          ? payoutData
        : selectedScheme === "CARD"
        ? cardData
        : dmtData,
      setRequest,
      (res) => {
        okSuccessToast("Scheme Updated successfully");
        setSubmittedData(data);
        handleClose();
        if (refresh) {
          refresh();
        }
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };
  

  useEffect(() => {
    if (open && selectedScheme === schemeData) {
      if (selectedUtilityScheme) {
        handleUtilitySchemeChange(submittedData);
        console.log("the submitted data is ", submittedData);
      }
    }
  }, [open, selectedScheme, selectedUtilityScheme, schemeData, submittedData]);
  return (
    <Box sx={{ display: "flex", justifyContent: "end" }}>
      <Tooltip title="Update Scheme">
        <UpdateIcon
          onClick={handleOpen}
          sx={{
            color: "#00693E",
            // "&:hover": {
            //   backgroundColor: "#122480",
            // },
          }}
        />
        {/* <Button
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "8px",
            fontSize: "12px",
            color: "#ffffff",
            fontWeight: "700",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            justifyContent: "center",
            background: "#00693E",
            "&:hover": {
              backgroundColor: "#122480",
            },
          }}
          onClick={handleOpen}
        >
          Edit
        </Button> */}
      </Tooltip>

      <Drawer open={open} onClose={handleClose} anchor="right">
        <Box sx={{ width: 400 }} className="sm_modal">
          <ModalHeader title="Scheme" handleClose={handleClose} />
          <Box
            component="form"
            id="update-Scheme"
            noValidate
            autoComplete="off"
            onSubmit={handleUpdateScheme}
            sx={{
              "& .MuiTextField-root": { m: 2 },
            }}
          >
            <Grid container sx={{ pt: 1 }}>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    select
                    label="Scheme"
                    value={selectedScheme}
                    onChange={handleSchemeChange}
                    size="small"
                    required
                  >
                    {schemeData.map((scheme) => (
                      <MenuItem key={scheme} value={scheme}>
                        {scheme}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Grid>

              {showUtilityDropdown && (
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      select
                      label={`${selectedScheme}  NAME`}
                      value={selectedUtilityScheme}
                      onChange={handleUtilitySchemeChange}
                      size="small"
                      required
                    >
                      {utilitySchemeData.map((scheme) => (
                        <MenuItem key={scheme.id} value={scheme.name}>
                          {scheme.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                </Grid>
              )}

              {/* Conditional fields based on selected scheme name */}
              {showExtraFields && !showExtraFieldsPayout && (
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Name:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">{name || "N/A"}</Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          DD:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">{dd || "N/A"}</Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Ret:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">{ret || "N/A"}</Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Ad:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">{ad || "N/A"}</Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Md:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">{md || "N/A"}</Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Status:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {status || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
              {showExtraFieldsPayout && (
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Name:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">{name || "N/A"}</Typography>
                        {/* <TextField
                          autoComplete="off"
                          label="Name"
                          id="name"
                          size="small"
                          required
                          value={name}
                          disabled={true}
                          fullWidth
                          onChange={(e) => setName(e.target.value)}
                        /> */}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Slab1:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {slab1 || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Slab2:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {slab2 || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Slab3:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {slab3 || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Slab4:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {slab4 || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Slab5:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {slab5 || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Ad Comm:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {adComm || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Md Comm:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {mdComm || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Status:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {status || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
              
                  {showExtraFieldsAeps && (
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Name:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">{name || "N/A"}</Typography>
                        {/* <TextField
                          autoComplete="off"
                          label="Name"
                          id="name"
                          size="small"
                          required
                          value={name}
                          disabled={true}
                          fullWidth
                          onChange={(e) => setName(e.target.value)}
                        /> */}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Slab1:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {slab1 || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Slab2:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {slab2 || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Slab3:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {slab3 || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Slab4:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {slab4 || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Slab5:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {slab5 || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Slab6:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {slab6 || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Slab7:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {slab7 || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Slab8:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {slab8 || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Ad Comm:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {adComm || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Md Comm:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {mdComm || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Status:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {status || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
                    {showExtraFieldsCard && (
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Name:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">{name || "N/A"}</Typography>
                        {/* <TextField
                          autoComplete="off"
                          label="Name"
                          id="name"
                          size="small"
                          required
                          value={name}
                          disabled={true}
                          fullWidth
                          onChange={(e) => setName(e.target.value)}
                        /> */}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Slab1:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {slab1 || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Slab2:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {slab2 || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Slab3:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {slab3 || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>

            
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Ad Comm:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {adComm || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Md Comm:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {mdComm || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          Status:
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          {status || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
         
            </Grid>

            <ModalFooter
              form="update-Scheme"
              request={request}
              btn="Save Scheme"
            />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default UserUpdateScheme;
