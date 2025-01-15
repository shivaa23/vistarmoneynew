import { Button, Grid, IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { CustomStyles } from "../component/CustomStyle";
import { datemonthYear } from "../utils/DateUtils";
import ApiEndpoints from "../network/ApiEndPoints";
import { useNavigate } from "react-router-dom";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AddBookModal from "../modals/AddBookModal";
import ApiPaginateSearch from "../component/ApiPaginateSearch";
import { get } from "../network/ApiController";
import moment from "moment";
import { json2Csv, json2Excel } from "../utils/exportToExcel";
import { apiErrorToast } from "../utils/ToastUtil";
import ExcelUploadModal from "../modals/ExcelUploadModal";
import AuthContext from "../store/AuthContext";
import { useContext } from "react";
import { primaryColor } from "../theme/setThemeColor";
import useCommonContext from "../store/CommonContext";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { USER_ROLES } from "../utils/constants";
import CachedIcon from "@mui/icons-material/Cached";

let handleCloseModal;
const KhataBook = () => {
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();
  const navigate = useNavigate();
  const [request, setRequest] = useState(false);
  const [noOfResponses, setNoOfResponses] = useState(0);
  const authCtx = useContext(AuthContext);
  const user = authCtx && authCtx.user;
  const role = user?.role;
  const { setChooseInitialCategoryFilter } = useCommonContext();

  const columns = [
    {
      name: "Created At",
      selector: (row) => (
        <div>
          <div>{datemonthYear(row.created_at)}</div>
        </div>
      ),
    },
    {
      name: "Updated At",
      selector: (row) => (
        <div>
          <div>{datemonthYear(row.updated_at)}</div>
        </div>
      ),
    },

    {
      name: "name",
      selector: (row) => <div>{row.name}</div>,
    },
    {
      name: "Number",
      selector: (row) => row.mobile,
    },
    {
      name: "Balance",
      selector: (row) => Number(row.balance).toFixed(2),
    },
    {
      name: "Action",
      selector: (row) => (
        <div>
          <Tooltip title="statement">
            <IconButton
              sx={{
                color: "green",
                fontSize: "10px",
              }}
              onClick={() => {
                if (user && user.role === "Ad") {
                  navigate("/ad/khata-statement", {
                    state: {
                      id: row.id,
                      name: row.name,
                    },
                  });
                } else {
                  navigate("/customer/khata-statement", {
                    state: {
                      id: row.id,
                      name: row.name,
                    },
                  });
                }
              }}
            >
              <ReceiptLongOutlinedIcon />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];
  let refresh;
  function refreshFunc(setQuerry) {
    if (refresh) refresh();
  }
  const searchOptions = [
    { field: "Number", parameter: "number" },
    { field: "Name", parameter: "name" },
  ];

  const getExcel = () => {
    get(
      ApiEndpoints.GET_BOOKS,
      // ApiEndpoints.GET_USERS,
      `${
        query
          ? query + `&page=1&paginate=10&export=1`
          : `page=1&paginate=10&export=1`
      }`,
      setRequest,
      (res) => {
        const apiData = res.data.data;
        const newApiData = apiData.map((item) => {
          const created_at = moment(item.created_at).format("DD-MM-YYYY");
          const time_updated_at = moment(item.updated_at).format("LTS");
          return { ...item, created_at, time_updated_at };
        });
        json2Excel(
          `Khata Book ${moment(new Date().toJSON()).format(
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

  const getCsv = () => {
    get(
      ApiEndpoints.GET_BOOKS,
      `${
        query
          ? query + `&page=1&paginate=10&export=1`
          : `page=1&paginate=10&export=1`
      }`,
      setRequest,
      (res) => {
        const apiData = res.data.data;
        const newApiData = apiData.map((item) => {
          const created_at = moment(item.created_at).format("DD-MM-YYYY");
          const time_updated_at = moment(item.updated_at).format("LTS");
          return { ...item, created_at, time_updated_at };
        });
        json2Csv(
          `Khata Book ${moment(new Date().toJSON()).format(
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
      <Grid container>
        <Grid
          item
          md={12}
          sm={12}
          xs={12}
          sx={{
            display: { md: "none", sm: "none", xs: "flex" },
            justifyContent: "end",
            alignItems: "center",
            flexDirection: { md: "row" },
            pr: 1,
          }}
        >
          <div className="me-3">
            <Button
              size="small"
              className="otp-hover-purple mb-2"
              sx={{
                color: primaryColor(),
              }}
              onClick={() => {
                setChooseInitialCategoryFilter(false);
                if (role === USER_ROLES.AD) {
                  navigate("/ad/transactions");
                } else if (role === USER_ROLES.RET || role === USER_ROLES.DD) {
                  navigate("/customer/transactions");
                } else if (role === USER_ROLES.MD) {
                  navigate("/md/transactions");
                } else {
                }
              }}
            >
              <KeyboardBackspaceIcon fontSize="small" /> Back
            </Button>
          </div>
          <div className="mx-2">
            <ExcelUploadModal
              twobuttons="Download Csv"
              btn
              request={request}
              getExcel={getExcel}
              getCsv={getCsv}
              noOfResponses={noOfResponses}
              setQuery={setQuery}
              handleCloseCB={(closeModal) => {
                handleCloseModal = closeModal;
              }}
            />
          </div>
          <div className="me-2">
            <AddBookModal
              refresh={(ref) => {
                if (refreshFunc) refreshFunc();
              }}
            />
          </div>
        </Grid>

        <ApiPaginateSearch
          actionButtons={
            <Grid
              item
              md={12}
              sm={12}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: { md: "end", xs: "start" },
                alignItems: "center",
                pr: 1,
              }}
            >
           
              <ExcelUploadModal
                twobuttons="Download Csv"
                btn
                request={request}
                getExcel={getExcel}
                getCsv={getCsv}
                noOfResponses={noOfResponses}
                setQuery={setQuery}
                handleCloseCB={(closeModal) => {
                  handleCloseModal = closeModal;
                }}
              />
                 <Tooltip title="refresh">
            <IconButton 
              aria-label="refresh"
              // color="success"
              sx={{
                color:"#0F52BA"
                ,
                ml:-1
              }}
              onClick={() => {
                refreshFunc(setQuery);
              }}
            >
              <CachedIcon className="refresh-purple" />
            </IconButton>
          </Tooltip>
              <AddBookModal
                refresh={(ref) => {
                  if (refreshFunc) refreshFunc();
                }}
              />
            </Grid>
          }
          // backButton={
          //   <Button
          //     size="small"
          //     className="otp-hover-purple mb-2"
          //     sx={{
          //       color: primaryColor(),
          //     }}
          //     onClick={() => {
          //       setChooseInitialCategoryFilter(false);
          //       if (role === USER_ROLES.AD) {
          //         navigate("/ad/transactions");
          //       } else if (role === USER_ROLES.RET || role === USER_ROLES.DD) {
          //         navigate("/customer/transactions");
          //       } else if (role === USER_ROLES.MD) {
          //         navigate("/md/transactions");
          //       } else {
          //       }
          //     }}
          //   >
          //     <KeyboardBackspaceIcon fontSize="small" /> Back
          //   </Button>
          // }
          searchOptions={searchOptions}
          apiEnd={ApiEndpoints.GET_BOOKS}
          columns={columns}
          setQuery={setQuery}
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
      </Grid>
    </div>
  );
};

export default KhataBook;
