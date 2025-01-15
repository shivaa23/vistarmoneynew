import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import ApiPaginate from "../component/ApiPaginate";
import { CustomStyles } from "../component/CustomStyle";
import ApiEndpoints from "../network/ApiEndPoints";
import CachedIcon from "@mui/icons-material/Cached";
import { datemonthYear } from "../utils/DateUtils";
import CommonMpinModal from "../modals/CommonMpinModal";
import { get, postJsonData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import moment from "moment";
import { json2Excel } from "../utils/exportToExcel";
import { primaryColor } from "../theme/setThemeColor";
import ExcelUploadModal from "../modals/ExcelUploadModal";
import AddIcon from "@mui/icons-material/Add";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";

const KhataBookStatement = () => {
  const remark = useRef("");
  const amount = useRef("");
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const role = user?.role.toLowerCase();
  const [apiData, setApiData] = useState();
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState();
  const location = useLocation();
  const id = (location && location.state.id) || "none";
  const [query, setQuery] = useState(`id=${id}`);
  const [mpin, setmpin] = useState("");
  const [noOfResponses, setNoOfResponses] = useState(0);
  const [filterValues, setFilterValues] = useState({ date: {}, dateVal: null });
  const [radioValue, setRadioValue] = React.useState();
  const navigate = useNavigate();
  const handleChange = (event) => {
    setRadioValue(event.target.value);
  };

  // console.log("val,", radioValue);

  let refresh;
  let handleCloseModal;
  function refreshFunc(setQuerry) {
    if (refresh) refresh();
  }

  // useEffect(() => {}, [
  //   // given.current.value,
  //   amount.current.value,
  //   remark.current.value,
  // ]);
  const handleSubmit = () => {
    const data = {
      id: id,
      // [radioValue]: taken.current.value,
      type: radioValue,
      amount: amount.current.value,
      remark: remark.current.value,
      mpin: mpin,
    };

    if (mpin) {
      postJsonData(
        ApiEndpoints.ADD_BOOKS_STATEMENT,
        data,
        setRequest,
        (res) => {
          okSuccessToast(res.data.message);
          setmpin("");
          document.getElementById("amount").value = "";
          document.getElementById("remark").value = "";
          refreshFunc();
        },
        (error) => {
          apiErrorToast(error);
          setmpin("");
        }
      );
    }
  };
  useEffect(() => {
    if (mpin && mpin.length === 6) {
      handleSubmit();
    }
  }, [mpin]);

  const columns = [
    {
      name: "Id",
      selector: (row) => (
        <div>
          <div>{row.id}</div>
        </div>
      ),
    },
    {
      name: "Created At",
      selector: (row) => (
        <div>
          <div>{datemonthYear(row.created_at)}</div>
        </div>
      ),
    },
    {
      name: "Remarks",
      selector: (row) => (
        <div>
          <div>{row.remarks}</div>
        </div>
      ),
    },
    {
      name: "Credit",
      selector: (row) => (
        <div>
          <div>{Number(row.credit).toFixed(2)}</div>
        </div>
      ),
    },

    {
      name: "Debit",
      selector: (row) => <div>{Number(row.debit).toFixed(2)}</div>,
    },

    {
      name: "Balance",
      selector: (row) => Number(row.balance).toFixed(2),
    },
  ];

  const getExcel = () => {
    get(
      ApiEndpoints.KHATA_BOOKS_STATEMENT,
      `${
        query
          ? query + "&page=1&paginate=10&export=1"
          : "page=1&paginate=10&export=1"
      }`,
      setRequest,
      (res) => {
        const apiData = res.data.data.data;
        const newApiData = apiData.map((item) => {
          const created_at = moment(item.created_at && item.created_at).format(
            "DD-MM-YYYY"
          );
          const updated_at = moment(item.updated_at && item.updated_at).format(
            "DD-MM-YYYY"
          );
          return { ...item, created_at, updated_at };
        });
        json2Excel(
          `Khata Statement ${moment(new Date().toJSON()).format(
            "Do MMM YYYY"
          )} | ${moment(new Date().toJSON()).format("hh:mm a")}`,
          JSON.parse(JSON.stringify(newApiData && newApiData))
        );
        handleCloseModal();
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  return (
    <div>
      <Box sx={{ alignItems: "center" }}>
        <Box
          component="form"
          id="addtxn"
          validate
          autoComplete="off"
          sx={{
            "& .MuiTextField-root": { m: 1 },
            objectFit: "contain",
            overflowY: "scroll",
          }}
          className="position-relative"
        >
          <Grid container sx={{ alignItems: "center", mt: 2 }}>
            <Grid lg={1.2} md={1.3} sm={1.3} xs={2.5} sx={{ ml: 1 }}>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={radioValue}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="DEBIT"
                    control={
                      <Radio
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: 18,
                          },
                          "&.Mui-checked": {
                            color: primaryColor(),
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: "15px" }}>Given</Typography>
                    }
                  />
                  <FormControlLabel
                    value="CREDIT"
                    control={
                      <Radio
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: 18,
                          },
                          "&.Mui-checked": {
                            color: primaryColor(),
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: "15px" }}>Taken</Typography>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid lg={4.55} sm={4} xs={3.5}>
              <FormControl sx={{ width: "100%" }}>
                <TextField autoComplete="off"
                  label="Amount"
                  id="amount"
                  size="small"
                  type="number"
                  required
                  inputRef={amount}
                />
              </FormControl>
            </Grid>

            <Grid lg={4.55} sm={4} xs={3.5}>
              <FormControl sx={{ width: "100%" }}>
                <TextField autoComplete="off"
                  label="Remark"
                  id="remark"
                  size="small"
                  type="text"
                  required
                  inputRef={remark}
                />
              </FormControl>
            </Grid>
            <Grid md={1.5} xs={2}>
              <Button
                variant="contained"
                className="button-red"
                size="medium"
                form="addtxn"
                sx={{
                  textTransform: "capitalize",
                  px: 2,
                  py: 1,
                  width: "100%",
                }}
                // disabled={
                //   (given.current && given.current.value === "") ||
                //   (taken.current && taken.current.value === "") ||
                //   (remark.current && remark.current.value === "")
                // }
                onClick={() => {
                  if (
                    amount.current.value !== "" &&
                    remark.current.value !== "" &&
                    radioValue !== undefined
                  )
                    setOpen(true);
                }}
              >
                <AddIcon sx={{ fontSize: "18px", mr: 0.5, ml: -1 }} />
                Add
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          size="small"
          className="otp-hover-purple mb-2"
          sx={{
            color: primaryColor(),
            pr: 1,
          }}
          onClick={() => {
            if (role === "ret" || role === "dd") {
              navigate("/customer/khata-book");
            }
            if (role === "ad") {
              navigate("/ad/khata-book");
            }
          }}
        >
          <KeyboardBackspaceIcon fontSize="small" /> Back
        </Button>
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Tooltip title="export">
            <ExcelUploadModal
              btn
              dateFilter
              request={request}
              getExcel={getExcel}
              filterValues={filterValues}
              setFilterValues={setFilterValues}
              noOfResponses={noOfResponses}
              setQuery={setQuery}
              handleCloseCB={(closeModal) => {
                handleCloseModal = closeModal;
              }}
            />
          </Tooltip>
          <Tooltip title="refresh">
            <IconButton
              aria-label="refresh"
              color="success"
              onClick={() => {
                refreshFunc(setQuery);
              }}
            >
              <CachedIcon className="refresh-purple" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <ApiPaginate
        apiEnd={ApiEndpoints.KHATA_BOOKS_STATEMENT}
        columns={columns}
        tableStyle={CustomStyles}
        apiData={apiData}
        setApiData={setApiData}
        queryParam={query ? query : ""}
        returnRefetch={(ref) => {
          refresh = ref;
        }}
        ExpandedComponent={null}
        responses={(val) => {
          setNoOfResponses(val);
        }}
      />
      <CommonMpinModal
        open={open}
        setOpen={setOpen}
        mPinCallBack={(mPinValue) => {
          setmpin(mPinValue);
        }}
      />
    </div>
  );
};

export default KhataBookStatement;
