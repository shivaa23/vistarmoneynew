import React, { useState } from "react";
import { useEffect } from "react";
import { apiErrorToast } from "../../utils/ToastUtil";
import { get } from "../../network/ApiController";
import ApiEndpoints from "../../network/ApiEndPoints";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Mount from "../Mount";
import { useContext } from "react";
import AuthContext from "../../store/AuthContext";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import EnterMpinModal from "../../modals/EnterMpinModal";

const BankTransfer = ({ showBankTransfer, setShowBankTransfer }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const refreshUser = authCtx.refreshUser;
  const userLat = authCtx.location && authCtx.location.lat;
  const userLong = authCtx.location && authCtx.location.long;
  const [chosenAccount, setChosenAccount] = useState("default");
  const [chosenBankData, setchosenBankData] = useState(null);
  const [settlementAccs, setSettlementsAccs] = useState([]);
  const [checked, setChecked] = React.useState(true);
  const [data, setData] = useState({});
  const [mpinVisible, setMpinVisible] = useState(false);

  const getAddedBanks = () => {
    get(
      ApiEndpoints.GET_SETTLEMENT_ACCS,
      "",
      null,
      (res) => {
        const data = res?.data.data;
        setSettlementsAccs(data);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const filterChosenAcct = (passedId) => {
    if (passedId !== "default") {
      const filteredAcct =
        settlementAccs.length > 0 &&
        settlementAccs.filter((item) => item.id === passedId);
      setchosenBankData(filteredAcct[0]);
    }
  };
  function refreshFunc() {
    refreshUser();
  }

  const title = checked && checked ? "IMPS" : "NEFT";
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  // ######################################
  // BANK TRANSFER API CALL ...........
  // ######################################
  const submitBankTransfer = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      transferAmount: form.settlement_amt.value,
      latitude: userLat,
      longitude: userLong,
      transferMode: title && title,
      pf: "WEB",
      beneficiaryAccount: chosenBankData.acc_number,
      ifscCode: chosenBankData.ifsc,
      beneficiaryName: chosenBankData.name,
      acc_id: chosenBankData.id,
    };
    setData(data);
    setMpinVisible(true);
  };

  useEffect(() => {
    getAddedBanks();

    return () => {};
  }, []);

  return (
    <Grid
      className="card-css position-relative"
      id="bank"
      sx={{
        marginTop: "12px",
        px: 2,
        pt: 2,
      }}
    >
      {/* CLOSE BUTTON */}
      <IconButton className="top-right-position ">
        <HighlightOffRoundedIcon
          className="hover-red"
          onClick={() => {
            setShowBankTransfer(false);
          }}
        />
      </IconButton>
      <>
        <Mount visible={user && user.acc_number === ""}>
          <Typography
            sx={{
              fontWeight: "bold",
              width: "100%",
              textAlign: "left",
              pb: 2,
            }}
          >
            No account added for Settelment
          </Typography>
        </Mount>

        <div>
          <BankTransferTitle
            title={title}
            checked={checked}
            handleChange={handleChange}
          />
          {/* ######################################## */}
          {/* ########## BANK TRANSFER FORM ########## */}
          {/* ######################################## */}
          <Box
            component="form"
            id="bankTransfer"
            validate
            autoComplete="off"
            onSubmit={submitBankTransfer}
          >
            <FormControl sx={{ width: "100%", mt: 2 }}>
              <TextField
                autoComplete="off"
                label="Account"
                sx={{ backgroundColor: "#fff" }}
                size="small"
                select
                onFocus={() => {
                  if (settlementAccs.length <= 1) {
                    getAddedBanks();
                  }
                }}
                value={chosenAccount}
                onChange={(e) => {
                  setChosenAccount(e.target.value);
                  filterChosenAcct(e.target.value);
                }}
              >
                <MenuItem value="default">
                  {" "}
                  <div
                    style={{
                      fontSize: "13px",
                      textAlign: "left",
                      marginRight: "10px",
                    }}
                  >
                    Select Account
                  </div>
                </MenuItem>
                {settlementAccs.length > 0 &&
                  settlementAccs.map((item, index) => {
                    return (
                      <MenuItem
                        value={item.id}
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "13px",
                            textAlign: "left",
                            marginRight: "10px",
                          }}
                        >
                          {item.bank_name}
                        </div>
                        <div style={{ fontSize: "13px", textAlign: "left" }}>
                          {item.acc_number}
                        </div>
                      </MenuItem>
                    );
                  })}
              </TextField>
            </FormControl>
            <Grid hidden={chosenBankData === null}>
              <FormControl sx={{ width: "100%", mt: 2 }}>
                <TextField
                  autoComplete="off"
                  size="small"
                  label="Name"
                  value={chosenBankData?.name}
                  focused
                  sx={{ backgroundColor: "#fff" }}
                  disabled
                />
              </FormControl>
              <FormControl sx={{ width: "100%", mt: 2 }}>
                <TextField
                  autoComplete="off"
                  size="small"
                  label="Account Number"
                  value={chosenBankData?.acc_number}
                  focused
                  sx={{ backgroundColor: "#fff" }}
                  disabled
                />
              </FormControl>
              <FormControl sx={{ width: "100%", mt: 2 }}>
                <TextField
                  autoComplete="off"
                  size="small"
                  label="IFSC"
                  focused={chosenBankData?.ifsc && true}
                  value={chosenBankData?.ifsc}
                  sx={{ backgroundColor: "#fff" }}
                  disabled
                />
              </FormControl>
              <FormControl sx={{ width: "100%", mt: 2 }}>
                <TextField
                  autoComplete="off"
                  label="Enter Amount"
                  id="settlement_amt"
                  sx={{ backgroundColor: "#fff" }}
                  required
                  size="small"
                  type="number"
                  onKeyDown={(e) => {
                    if (e.key === "+" || e.key === "-") {
                      e.preventDefault();
                    }
                  }}
                />
              </FormControl>
            </Grid>
          </Box>

          {/* SUBMIT BUTTON */}
          <Box sx={{ width: "100%", textAlign: "right", mt: 1 }}>
            <Button
              variant="contained"
              sx={{
                fontSize: "12px",
                my: 1,
                textTransform: "capitalize",
                mt: 1,
                // backgroundColor: "#E87204",
                // "&:hover": {
                //   backgroundColor: "#E87204",
                // },
              }}
              type="submit"
              className="otp-hover-purple"
              form="bankTransfer"
            >
              Proceed
            </Button>
          </Box>

          {/* ########################## */}
          {/* MPIN MODAL */}
          {/* ########################## */}
          <Mount visible={mpinVisible}>
            <EnterMpinModal
              data={data}
              setModalVisible={setMpinVisible}
              apiEnd={ApiEndpoints.BANK_SETTELMENT}
              view="settelment"
              refreshFunc={refreshFunc}
            />
          </Mount>
        </div>
      </>
    </Grid>
  );
};

export default BankTransfer;

function BankTransferType({ title }) {
  return (
    <Typography
      sx={{
        fontSize: "12px",
        textAlign: "center",
        alignContent: "center",
      }}
    >
      {title}
    </Typography>
  );
}

function BankTransferTitle({ title, checked, handleChange }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          fontWeight: "bold",
          width: "100%",
          textAlign: "left",
          fontSize: "16px",
        }}
      >
        Bank Transfer
      </Typography>

      <Tooltip title={title === "IMPS" ? "IMPS" : "NEFT"}>
        <>
          <Mount visible={title === "NEFT"}>
            <BankTransferType title="NEFT" />
          </Mount>

          <Switch
            checked={checked}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
          <Mount visible={title === "IMPS"}>
            <BankTransferType title="IMPS" />
          </Mount>
        </>
      </Tooltip>
    </Box>
  );
}
