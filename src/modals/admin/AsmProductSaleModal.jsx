/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  Button,
  Card,
  Grid,
  LinearProgress,
  Modal,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import ApiEndpoints from "../../network/ApiEndPoints";
import ModalHeader from "../ModalHeader";
import { currencySetter } from "../../utils/Currencyutil";
import ApiPaginate from "../../component/ApiPaginate";
import { massegetable } from "../../component/CustomStyle";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { capitalize1 } from "../../utils/TextUtil";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 3,
};
let refresh;
ChartJS.register(ArcElement, Tooltip, Legend);

const AsmProductSaleModal = ({
  name,
  id,
  amount,
  usedInUserTable = false,
  role,
  width = "max-content",
}) => {
  const [open, setOpen] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();
  const [pieData, setPieData] = useState();
  const [type, setType] = useState("Today");

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (event, newType) => {
    setType(newType);
  };

  const columnsProd = [
    {
      name: "Services",
      selector: (row) => row.service,
    },
    {
      name: "Last Month",
      selector: (row) => currencySetter(row.Last),
      width: "130px",
    },

    {
      name: "This Month",
      selector: (row) => currencySetter(row.This),
      width: "130px",
    },
    {
      name: "Today",
      selector: (row) => currencySetter(row.Today),
      width: "130px",
    },
    {
      name: "Achieved",
      selector: (row) => (
        <div style={{ width: "100px" }}>
          <div>
            {Number(row.Last) === 0
              ? "0.00%"
              : Number((parseInt(row.This) * 100) / parseInt(row.Last)).toFixed(
                  2
                ) + "%"}
          </div>
          <div>
            <LinearProgress
              variant="determinate"
              value={
                Number((parseInt(row.This) * 100) / parseInt(row.Last)) > 100
                  ? 100
                  : Number(row.Last) === 0
                  ? 0
                  : Number((parseInt(row.This) * 100) / parseInt(row.Last))
              }
            />
          </div>
        </div>
      ),
    },
  ];
  const options = {
    responsive: true,
    scales: {
      y: {
        title: { display: true, text: "Amount in ₹" },
      },
      x: {
        title: { display: true, text: "Date" },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          boxWidth: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(context.parsed);
            }
            return label;
          },
        },
      },
      title: {
        display: true,
        // text: "All Services Data",
      },
      subtitle: {
        display: false,
        // text: "All Services Data",
      },
    },
    transitions: {
      hide: {
        animations: {
          x: {
            to: 0,
          },
          y: {
            to: 0,
          },
        },
      },
    },
  };

  useEffect(() => {
    if (id) {
      if (usedInUserTable) {
        if (role === "Ret" || role === "Dd" || role === "Api") {
          setQuery(`user_id=${id}`);
        } else if (role === "Ad") {
          setQuery(`ad_id=${id}`);
        } else {
          setQuery("");
        }
      } else {
        setQuery(`asm_id=${id}`);
      }
    }
    return () => {};
  }, [id]);

  useEffect(() => {
    if (apiData && apiData.length > 0 && type) {
      const t = capitalize1(type).replace(" ", "");
      const data = {
        labels: apiData.map((item) => item.service),
        datasets: [
          {
            label: "amount",
            data: apiData.map((item) => item[t]),
            backgroundColor: [
              "rgb(255, 99, 0.385, 0.8)",
              "rgb(255, 159, 60.3854,0.8)",
              "rgb(255, 205, 0.385,0.8)",
              "rgb(75, 192, 0.385,0.8)",
              "rgb(54, 162, 0.385,0.8)",
              "rgb(153, 102, 0.385,0.8)",
              "rgb(201, 203, 0.385,0.8)",
              "#ff69b480",
              "#57aaee80",
              "#1a598d80",
              "#0077b680",
            ],
            borderColor: [
              "rgb(255, 99, 0.385,0.8)",
              "rgb(255, 159, 60.3854,0.8)",
              "rgb(255, 205, 0.385,0.8)",
              "rgb(75, 192, 0.385,0.8)",
              "rgb(54, 162, 0.385,0.8)",
              "rgb(153, 102, 0.385,0.8)",
              "rgb(201, 203, 0.385,0.8)",
              "#ff69b480",
              "#57aaee80",
              "#1a598d80",
              "#0077b680",
            ],
            borderWidth: 1,
          },
        ],
      };
      setPieData(data);
    }
    return () => {};
  }, [apiData, type]);

  return (
    <Box sx={{ display: "flex", justifyContent: "end" }}>
      <Button
        variant="text"
        size="small"
        sx={{
          fontSize: "12px",
          fontWeight: "normal",
          "&:hover": {
            cursor: "pointer",
          },
          minWidth: width,
        }}
        onClick={handleOpen}
      >
        {amount}
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader
          subtitle="Stay Informed: Your Comprehensive Product Report Awaits!"
            title={`${name}'s Product Report`}
            handleClose={handleClose}
          />
          <Box
            component="form"
            id="add_books"
            validate
            autoComplete="off"
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
          >
            <Grid container spacing={2}>
              <Grid item md={7} xs={12} lg={12}>
                <ApiPaginate
                  apiEnd={ApiEndpoints.GET_RET_PROD_SALE}
                  columns={columnsProd}
                  apiData={apiData}
                  tableStyle={massegetable}
                  setApiData={setApiData}
                  queryParam={query ? query : ""}
                  returnRefetch={(ref) => {
                    refresh = ref;
                  }}
                  ExpandedComponent={null}
                  paginateServer={false}
                  paginate={false}
                />
              </Grid>
              {/* <Grid item md={5} xs={12}>
                <Card
                  sx={{
                    textAlign: "center",
                    p: 2,
                  }}
                >
                  <ToggleButtonGroup
                    color="primary"
                    value={type}
                    exclusive
                    onChange={handleChange}
                    aria-label="type"
                  >
                    <ToggleButton value="Today">Today</ToggleButton>
                    <ToggleButton value="This">This</ToggleButton>
                    <ToggleButton value="Last">Last</ToggleButton>
                  </ToggleButtonGroup>
                  {apiData && pieData && (
                    <div id="graph-canvas-container">
                      <Pie data={pieData} options={options} height={100} />
                    </div>
                  )}
                </Card>
              </Grid> */}
            </Grid>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AsmProductSaleModal;
