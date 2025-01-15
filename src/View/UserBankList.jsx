import { Box, Button, FormControl, Grid, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { sbiBank } from "../iconsImports";
import BankSearch from "../component/BankSearch";
import ApiEndpoints from "../network/ApiEndPoints";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AuthContext from "../store/AuthContext";
import VerifyOtpLogin from "../modals/VerifyOtpLogin";
import { get, postJsonData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { PATTERNS } from "../utils/ValidationUtil";
import Loader from "../component/loading-screen/Loader";
import { secondaryColor } from "../theme/setThemeColor";

const UserBankList = () => {
  const [bankSearchIfsc, setbankSearchIfsc] = useState();
  const [bankObjCallBack, setBankObjCallBack] = useState("");
  const [addVisible, setaddVisible] = useState(true);
  const authCtx = useContext(AuthContext);
  const user = authCtx && authCtx.user;
  const loc = authCtx.location && authCtx.location;
  const [secureValidate, setSecureValidate] = useState();
  const [verifyData, setVerifyData] = useState();
  const [accontN, setAccountN] = useState();
  const [addBankReq, setAddBankReq] = useState(false);
  const [accNoV, setAccNoV] = useState(true);
  const [settlementAccs, setSettlementAccs] = useState([]);
  const [acctHolderName, setAcctHolderName] = useState("");

  useEffect(() => {
    if (!bankObjCallBack) {
      setbankSearchIfsc("");
    }
  }, [bankObjCallBack]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (secureValidate !== "Add") {
      setSecureValidate("Add");
    }

    let data = {
      number: user?.username,
      ben_acc: accontN,
      ben_id: user?.username,
      ifsc: bankSearchIfsc,
      latitude: loc.lat,
      longitude: loc.long,
      ben_name: user?.name,
      pf: "WEB",
    };
    setVerifyData(data);
  };
  const getAddedBanks = () => {
    get(
      ApiEndpoints.GET_SETTLEMENT_ACCS,
      "",
      setAddBankReq,
      (res) => {
        const data = res?.data.data;
        setSettlementAccs(data);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const addBankAccount = (name) => {
    let data = {
      acc_number: accontN,
      ifsc: bankSearchIfsc,
      name,
      bank_name: bankObjCallBack,
      isVerified: 1,
    };
    postJsonData(
      ApiEndpoints.ADD_SETTLEMENT_ACC,
      data,
      setAddBankReq,
      (res) => {
        okSuccessToast(res?.data?.message);
        setaddVisible(true);
        getAddedBanks();
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  useEffect(() => {
    getAddedBanks();
  }, []);

  return (
    <Grid container sx={{ mt: 3 }}>
      <Loader loading={addBankReq} />
      <Grid item md={12} >
        <table>
          <tr className="table-row">
            <th className="table-header min-width">Bank Name</th>
            <th className="table-header min-width">Acount Number</th>
            <th className="table-header min-width">Name</th>
          </tr>
          {settlementAccs.length > 0 &&
            settlementAccs.map((item, index) => {
              return (
                <tr className="table-row-spacing" key={index}>
                  <td className="table-data">
                    {" "}
                    <img
                      src={sbiBank}
                      alt="sbi"
                      width="40px"
                      height="40px"
                    />{" "}
                    <div style={{ marginLeft: "10px" }}>
                      <div>
                        <h6 style={{ fontSize: "13px" }}>{item.bank_name}</h6>
                      </div>
                      <div style={{ opacity: "0.7", fontSize: "12px" }}>
                        {item.ifsc}
                      </div>
                    </div>
                  </td>
                  <td className="table-data">
                    {" "}
                    <span style={{ fontWeight: "600" }}>{item.acc_number}</span>
                  </td>

                  <td className="table-data">
                    {/* <span className="primary-bank">
                {" "}
                <FiberManualRecordIcon sx={{ fontSize: "15px" }} /> Primary
              </span> */}
                    <span style={{ fontWeight: "600" }}>{item.name}</span>
                  </td>
                </tr>
              );
            })}

          {/*  */}
        </table>
      </Grid>
      <Box
        component="form"
        id="addbank"
        validate
        autoComplete="off"
        onSubmit={handleSubmit}
        sx={{
          "& .MuiTextField-root": { m: 2 },
          width: "100%",
        }}
      >
        {!addVisible && (
          <Grid container sx={{ mt: 2 }}>
            <Grid item md={4.5} sx={{ ml: { md: 0, sm: 0 } }}>
              <FormControl sx={{ width: "100%" }}>
                <BankSearch
                  label="Bank Name"
                  endpt={ApiEndpoints.GET_BANK_DMR}
                  bankObj={(bank) => {
                    setBankObjCallBack(bank);
                  }}
                  ifscObj={(ifsc) => {
                    setbankSearchIfsc(ifsc);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4}>
              <FormControl sx={{ width: "100%" }}>
                <TextField autoComplete="off"
                  label="Account Number"
                  id="acc_no"
                  size="small"
                  required
                  error={!accNoV}
                  value={accontN}
                  helperText={!accNoV ? "Enter valid Account Number" : ""}
                  inputProps={{ style: { textTransform: "uppercase" } }}
                  onChange={(e) => {
                    setAccountN(e.target.value);
                    setAccNoV(PATTERNS.ACCOUNT_NUMBER.test(e.target.value));
                    if (e.target.value === "") setAccNoV(true);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sx={{ ml: { md: -2, sm: 0 } }}>
              <FormControl sx={{ width: "100%" }}>
                <TextField autoComplete="off"
                  label="IFSC"
                  id="ifsc"
                  size="small"
                  required
                  value={bankSearchIfsc}
                  focused={bankSearchIfsc && true}
                  onChange={(e) => setbankSearchIfsc(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid
              item
              md={0.5}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DeleteOutlineIcon
                onClick={() => {
                  setaddVisible(true);
                  setAccountN("");
                  setAccNoV(true);
                  setbankSearchIfsc("");
                }}
                color="error"
              />
            </Grid>
          </Grid>
        )}
        <Grid item md={12} sx={{ textAlign: "right", mt: 1 }}>
          {addVisible ? (
            <Button
              variant="contained"
              onClick={() =>
                setTimeout(() => {
                  addVisible && setaddVisible(false);
                }, 300)
              }
              sx={{ background: secondaryColor(), fontSize: "10px" }}
            >
              Add
            </Button>
          ) : (
            <Button
              variant="contained"
              form="addbank"
              type="submit"
              disabled={!accNoV}
              sx={{ background: secondaryColor(), fontSize: "10px" }}
            >
              Verify
            </Button>
          )}
        </Grid>
      </Box>

      <VerifyOtpLogin
        secureValidate={secureValidate}
        setSecureValidate={setSecureValidate}
        btn="Add"
        data={verifyData}
        setAcctHolderName={setAcctHolderName}
        bankAddApiCall={addBankAccount}
      />
    </Grid>
  );
};

export default UserBankList;
