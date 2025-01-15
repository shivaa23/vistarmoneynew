import { Box, Grid, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import moment from "moment";
import { json2Excel } from "../utils/exportToExcel";
import { apiErrorToast } from "../utils/ToastUtil";
import ApiEndpoints from "../network/ApiEndPoints";
import { get } from "../network/ApiController";
import Loader from "../component/loading-screen/Loader";
import ExcelUploadModal from "../modals/ExcelUploadModal";
import { excelIcon } from "../iconsImports";

let handleCloseModal;
const DataListCard = ({ item, index }) => {
  const [request, setRequest] = useState(false);
  const [filterValues, setFilterValues] = useState({ date: {}, dateVal: null });

  const [query, setQuery] = useState();

  const getUserExcel = () => {
    get(
      ApiEndpoints.ADMIN_ACC_GET_USER,
      `${
        query
          ? query + "&page=1&paginate=10&export=1"
          : "page=1&paginate=10&export=1"
      }`,
      setRequest,
      (res) => {
        const apiData = res.data.data;

        const newApiData = apiData.map((item, index) => {
          const created_at = moment(item.created_at).utc().format("DD-MM-YYYY");
          const updated_at = moment(item.updated_at).utc().format("DD-MM-YYYY");
          return { ...item, created_at, updated_at };
        });
        json2Excel(
          `Users ${moment(new Date().toJSON()).format(
            "Do MMM YYYY"
          )} | ${moment(new Date().toJSON()).format("hh:mm a")}`,
          JSON.parse(JSON.stringify(newApiData && newApiData))
        );
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const getAccUserAcc = () => {
    get(
      ApiEndpoints.ADMIN_ACC_GET_ACC_USER,
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
          const updated_at = moment(item.updated_at).format("DD-MM-YYYY");
          return { ...item, created_at, updated_at };
        });
        json2Excel(
          `Account Users ${moment(new Date().toJSON()).format(
            "Do MMM YYYY"
          )} | ${moment(new Date().toJSON()).format("hh:mm a")}`,
          JSON.parse(JSON.stringify(newApiData && newApiData))
        );
        // handleCloseModal();
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };
  const getTxnExcel = () => {
    get(
      ApiEndpoints.ADMIN_ACC_GET_TXN,
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
          const updated_at = moment(item.updated_at).format("DD-MM-YYYY");
          return { ...item, created_at, updated_at };
        });
        json2Excel(
          `Transations ${moment(new Date().toJSON()).format(
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
  const getLedgerExcel = () => {
    get(
      ApiEndpoints.ADMIN_ACC_GET_LEADGER,
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
          const updated_at = moment(item.updated_at).format("DD-MM-YYYY");
          return { ...item, created_at, updated_at };
        });
        json2Excel(
          `Transations ${moment(new Date().toJSON()).format(
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

    // get(
    //   ApiEndpoints.ADMIN_ACC_GET_LEADGER,
    //   `${
    //     query
    //       ? query + `&page=1&paginate=10&export=1&type_txn=LEDGER`
    //       : `page=1&paginate=10&export=1&type_txn=LEDGER`
    //   }`,
    //   setRequest,
    //   (res) => {
    //     const apiData = res.data.data;
    //     const newApiData = apiData.map((item) => {
    //       const created_at = moment(item.created_at).format("DD-MM-YYYY");
    //       const updated_at = moment(item.updated_at).format("DD-MM-YYYY");
    //       return { ...item, created_at, updated_at };
    //     });
    //     json2Excel(
    //       `Ledger ${moment(new Date().toJSON()).format(
    //         "Do MMM YYYY"
    //       )} | ${moment(new Date().toJSON()).format("hh:mm a")}`,
    //       JSON.parse(JSON.stringify(newApiData && newApiData))
    //     );
    //     // handleCloseModal();
    //   },
    //   (err) => {
    //     apiErrorToast(err);
    //   }
    // );
  };
  const getBankTxnExcel = () => {
    get(
      ApiEndpoints.ADMIN_ACC_GET_BANK_TXN,
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
          const updated_at = moment(item.updated_at).format("DD-MM-YYYY");
          return { ...item, created_at, updated_at };
        });
        json2Excel(
          `Transations ${moment(new Date().toJSON()).format(
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

    // postJsonData(
    //   ApiEndpoints.ADMIN_ACC_GET_BANK_TXN,
    //   `${
    //     query
    //       ? query + `&page=1&paginate=10&export=1`
    //       : `page=1&paginate=10&export=1`
    //   }`,
    //   setRequest,
    //   (res) => {
    //     const apiData = res.data.data;
    //     const newApiData = apiData.map((item) => {
    //       const created_at = moment(item.created_at).format("DD-MM-YYYY");
    //       const updated_at = moment(item.updated_at).format("DD-MM-YYYY");
    //       return { ...item, created_at, updated_at };
    //     });

    //     json2Excel(
    //       `Bank Statement ${moment(new Date().toJSON()).format(
    //         "Do MMM YYYY"
    //       )} | ${moment(new Date().toJSON()).format("hh:mm a")}`,
    //       JSON.parse(JSON.stringify(newApiData && newApiData))
    //     );
    //     handleCloseModal();
    //   },
    //   (err) => {
    //     apiErrorToast(err);
    //   }
    // );
  };
  const handleClick = () => {
    if (index === 0) {
      getUserExcel();
    } else if (index === 1) {
      getAccUserAcc();
    } else if (index === 2) {
      getLedgerExcel();
    } else if (index === 3) {
      getBankTxnExcel();
    } else if (index === 4) {
      getTxnExcel();
    }
  };
  return (
    <Tooltip title={item.name}>
      {/* <Grid
        item
        md={12}
        sx={{
          my: 1,
          p: 1.5,
          backgroundColor: item.bgColor,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "4px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
          }}
        >
          <Loader loading={request} />
          {index === 4 ? (
            <Box sx={{ mr: 2 }}>
              <ExcelUploadModal
                btn
                dateFilter
                request={request}
                getExcel={getTxnExcel}
                filterValues={filterValues}
                setFilterValues={setFilterValues}
                setQuery={setQuery}
                handleCloseCB={(closeModal) => {
                  handleCloseModal = closeModal;
                }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                color: item.color,
                fontSize: "34px",
                mr: 1.5,
              }}
            >
              <img
                src={excelIcon}
                alt="excel"
                onClick={handleClick}
                className="size-excel refresh-purple"
              />
            </Box>
          )}

          <div
            style={{
              color: item.color,
              fontWeight: "bold",
              display: "flex",
              fontSize: "15px",
            }}
          >
            <Box>{item.name}</Box>
          </div>
        </div>

        <div
          style={{
            color: item.color,
            fontSize: "12px",
            textAlign: "right",
            marginLeft: "5px",
          }}
        >
          <Box>{item.title}</Box>
        </div>
      </Grid> */}
      <Box
        sx={{
          backgroundColor: item.bgColor,
          color: "#fff",
          width: "100%",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          position: "relative",
          borderRadius: "4px",
          pt: 3,
        }}
      >
        {index !== 4 || index !== 3 || index !== 2 ? (
          <Loader loading={request} />
        ) : (
          <Loader loading={false} />
        )}

        <Box>
          <span className="icon-part" style={{ backgroundColor: item.bgColor }}>
            {item.icon}
          </span>
          <Typography
            sx={{
              color: "#fff",
              mt: 3,
              mb: 2,
              fontSize: "19px",
              fontWeight: 400,
            }}
          >
            {item.name}
          </Typography>
        </Box>
        {index === 0 && (
          <Grid
            item
            className="glass-bg only-cursor"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={getUserExcel}
          >
            <Box
              sx={{
                color: item.color,
                fontSize: "40px",
                mr: 1.5,
              }}
            >
              <img
                src={excelIcon}
                alt="excel"
                // className="size-excel refresh-purple"
                className="size-excel"
              />
            </Box>
            <Typography>Download Excel</Typography>
          </Grid>
        )}
        {index === 1 && (
          <Grid
            item
            className="glass-bg only-cursor"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={getAccUserAcc}
          >
            <Box
              sx={{
                color: item.color,
                fontSize: "40px",
                mr: 1.5,
              }}
            >
              <img
                src={excelIcon}
                alt="excel"
                // className="size-excel refresh-purple"
                className="size-excel"
              />
            </Box>
            <Typography>Download Excel</Typography>
          </Grid>
        )}
        {index === 2 && (
          <ExcelUploadModal
            otherBtn={
              <Box
                className="glass-bg only-cursor"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    color: item.color,
                    fontSize: "40px",
                    mr: 1.5,
                  }}
                >
                  <img
                    src={excelIcon}
                    alt="excel"
                    // className="size-excel refresh-purple"
                    className="size-excel"
                  />
                </Box>
                <Typography>Download Excel</Typography>
              </Box>
            }
            dateFilter
            request={request}
            getExcel={getLedgerExcel}
            filterValues={filterValues}
            setFilterValues={setFilterValues}
            setQuery={setQuery}
            handleCloseCB={(closeModal) => {
              handleCloseModal = closeModal;
            }}
          />
        )}
        {index === 3 && (
          <ExcelUploadModal
            otherBtn={
              <Box
                className="glass-bg only-cursor"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    color: item.color,
                    fontSize: "40px",
                    mr: 1.5,
                  }}
                >
                  <img
                    src={excelIcon}
                    alt="excel"
                    // className="size-excel refresh-purple"
                    className="size-excel"
                  />
                </Box>
                <Typography>Download Excel</Typography>
              </Box>
            }
            dateFilter
            request={request}
            getExcel={getBankTxnExcel}
            filterValues={filterValues}
            setFilterValues={setFilterValues}
            setQuery={setQuery}
            handleCloseCB={(closeModal) => {
              handleCloseModal = closeModal;
            }}
          />
        )}
        {index === 4 && (
          <ExcelUploadModal
            otherBtn={
              <Box
                className="glass-bg only-cursor"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    color: item.color,
                    fontSize: "40px",
                    mr: 1.5,
                  }}
                >
                  <img
                    src={excelIcon}
                    alt="excel"
                    // className="size-excel refresh-purple"
                    className="size-excel"
                  />
                </Box>
                <Typography>Download Excel</Typography>
              </Box>
            }
            dateFilter
            request={request}
            getExcel={getTxnExcel}
            filterValues={filterValues}
            setFilterValues={setFilterValues}
            setQuery={setQuery}
            handleCloseCB={(closeModal) => {
              handleCloseModal = closeModal;
            }}
          />
        )}

        {/* <Grid
          item
          className="glass-bg"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            {index === 4 ? (
              <Box sx={{ mr: 2, my: 1.5 }}>
                <ExcelUploadModal
                  btn
                  dateFilter
                  request={request}
                  getExcel={getTxnExcel}
                  filterValues={filterValues}
                  setFilterValues={setFilterValues}
                  setQuery={setQuery}
                  handleCloseCB={(closeModal) => {
                    handleCloseModal = closeModal;
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  color: item.color,
                  fontSize: "40px",
                  mr: 1.5,
                }}
              >
                <img
                  src={excelIcon}
                  alt="excel"
                  onClick={handleClick}
                  className="size-excel refresh-purple"
                />
              </Box>
            )}
          </div>
          <Typography>Dowload Excel</Typography>
        </Grid> */}
      </Box>
    </Tooltip>
  );
};

export default DataListCard;
