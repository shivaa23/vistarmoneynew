import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { DateRangePicker } from "rsuite";
import { excelIcon } from "../iconsImports";
import { yyyymmdd } from "../utils/DateUtils";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import Loader from "../component/loading-screen/Loader";
import predefinedRanges from "../utils/predefinedRanges";

const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  height: "max-content",
  overflowY: "scroll",
  p: 2,
};

const ExcelUploadModal = ({
  btn,
  otherBtn,
  twobuttons,
  getExcel,
  getCsv,
  dateFilter = false,
  roleDropDown = false,
  roleAsmDown = false,
  rolechangeFunc,
  asmchangeFunc,
  userRole,
  roleHook,
  asmHook,
  asmApiData,
  filterValues,
  setFilterValues,
  request = false,
  setQuery,
  defaultQuery = false,
  queryValue,
  noOfResponses,
  handleCloseCB,
}) => {
  const [open, setOpen] = useState(false);
  const { afterToday } = DateRangePicker;
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  if (handleCloseCB) handleCloseCB(handleClose);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
      }}
    >
      {btn && (
        <Box className="mx-2" sx={{ mt: 0.1 }}>
          <Tooltip title="Excel" placement="bottom">
            <img
              src={excelIcon}
              alt="excel"
              onClick={handleOpen}
              width={28}
              height={28}
              // className="size-excel "
            />
          </Tooltip>
        </Box>
      )}
      {otherBtn && (
        <Grid md={12} onClick={handleOpen} sx={{ width: "100%" }}>
          {otherBtn}
        </Grid>
      )}
      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <Loader loading={request} />
            <ModalHeader title="Get Excel / CSV" handleClose={handleClose} />
            <Box
              //   component="form"
              id="response"
              noValidate
              autoComplete="off"
              className="text-center"
              //   onSubmit={(event) => {
              //     handleClose();
              //   }}
              sx={{
                "& .MuiTextField-root": { m: 2 },
              }}
            >
              <Grid container sx={{ pt: 1 }}>
                {/* {noOfResponses > 1000 && (
                  <Grid
                    item
                    md={12}
                    sm={12}
                    sx={{
                      fontWeight: "600",
                      fontSize: "15px",
                      mb: 2,
                      color: "red",
                    }}
                  >
                    
                    Excel Limit Exceeded. Please adjust filters
                  </Grid>
                )} */}
                {dateFilter && (
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Typography sx={{ mr: { md: 2, sm: 2, xs: 2 } }}>
                      Change Date Range
                    </Typography>

                    <DateRangePicker
                      editable
                      placeholder="Date"
                      size="xs"
                      cleanable
                      value={filterValues.dateVal && filterValues.dateVal}
                      ranges={predefinedRanges}
                      onChange={(value) => {
                        let dateVal = value;

                        setFilterValues({
                          ...filterValues,
                          dateVal,
                          date: {
                            start: yyyymmdd(dateVal && dateVal[0]),
                            end: yyyymmdd(dateVal && dateVal[1]),
                          },
                        });

                        if (dateVal) {
                          if (defaultQuery)
                            setQuery(
                              `${defaultQuery}=${queryValue}&start=${yyyymmdd(
                                dateVal[0]
                              )}&end=${yyyymmdd(dateVal[1])}`
                            );
                          else
                            setQuery(
                              `start=${yyyymmdd(dateVal[0])}&end=${yyyymmdd(
                                dateVal[1]
                              )}`
                            );
                        } else {
                          setQuery(`${defaultQuery}=${queryValue}`);
                        }
                      }}
                      disabledDate={afterToday()}
                      placement="rightStart"
                    />
                  </Grid>
                )}
                {roleDropDown && (
                  <Grid
                    item
                    md={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      sx={{
                        width: "90%",
                      }}
                    >
                      <TextField
                        autoComplete="off"
                        label="Select Role"
                        id="role"
                        select
                        defaultValue={roleHook && roleHook}
                        onChange={rolechangeFunc}
                        size="small"
                      >
                        <MenuItem dense value="Role">
                          Role
                        </MenuItem>
                        <MenuItem dense value="Api">
                          Corporates
                        </MenuItem>
                        <MenuItem dense value="Asm" hidden={userRole === "Ad"}>
                          Sales Manager
                        </MenuItem>
                        <MenuItem dense value="Ad" hidden={userRole === "Ad"}>
                          Area Distributor
                        </MenuItem>
                        <MenuItem dense value="Dd" hidden={userRole === "Ad"}>
                          Direct Dealer
                        </MenuItem>
                        <MenuItem dense value="Ret">
                          Retailer
                        </MenuItem>
                      </TextField>
                    </FormControl>
                  </Grid>
                )}

                {roleAsmDown && (
                  <Grid
                    item
                    md={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      sx={{
                        width: "90%",
                      }}
                    >
                      <TextField
                        autoComplete="off"
                        label="Select ASM"
                        id="ASM"
                        select
                        defaultValue={asmHook && asmHook}
                        onChange={asmchangeFunc}
                        size="small"
                      >
                        <MenuItem dense value="Asm">
                          Asm
                        </MenuItem>
                        {asmApiData &&
                          asmApiData.map((item, index) => {
                            return (
                              <MenuItem key={index} dense value={item.id}>
                                {item && item.name}
                              </MenuItem>
                            );
                          })}
                      </TextField>
                    </FormControl>
                  </Grid>
                )}
              </Grid>
              {noOfResponses < 100000 && (
                <Grid
                  item
                  md={12}
                  sm={12}
                  sx={{
                    my: 2,
                    // mx: 4.5,
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <div style={{ padding: "10px" }} className="mt-table">
                    <span>Total Transactions Are :</span>{" "}
                    <span style={{ color: "#4045A1" }}>{noOfResponses}</span>
                  </div>
                </Grid>
              )}
              {/* {noOfResponses > 100000 && (
                <Grid
                  item
                  md={12}
                  sm={12}
                  sx={{
                    my: 2,
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <div style={{ padding: "10px" }} className="mt-table">
                    <div>
                      <span style={{ color: "#000", fontSize: "15px" }}>
                        Total Transactions Are :
                      </span>
                      <span style={{ color: "#4045A1", fontSize: "15px" }}>
                        {noOfResponses}
                      </span>
                    </div>
                    <span
                      style={{
                        fontWeight: "500",
                        fontSize: "13px",
                        color: "red",
                      }}
                    >
                      <InfoOutlinedIcon sx={{ mr: 1 }} />
                      Excel Limit Exceeded. Apply filters to reduce transactions
                      to 100,000
                    </span>
                  </div>
                </Grid>
              )} */}
            </Box>
            <ModalFooter
              request={request}
              twobuttons={twobuttons}
              btn="Download Excel"
              onClick={getExcel}
              onClick2={getCsv}
              disable={ noOfResponses === 0}
              icon={<DownloadIcon sx={{ fontSize: "20px" }} />}
            />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default ExcelUploadModal;
