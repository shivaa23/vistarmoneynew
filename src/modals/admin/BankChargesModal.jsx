/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  Button,
  Card,
  Drawer,
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
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 3,
};
let refresh;
ChartJS.register(ArcElement, Tooltip, Legend);

const BankChargesModal = ({
  bank_id,
  id,
  usedInUserTable = false,
  width = "max-content",
  icon,
  name,
}) => {
  const [open, setOpen] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();
  const [pieData, setPieData] = useState();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const columnsProd = [
    {
      name: "MOP",
      selector: (row) => (row?.mop ? row?.mop : "NA"),
    },
    {
      name: "Total",
      selector: (row) => currencySetter(row?.Total),
      width: "130px",
    },
  ];

  return (
    <Box sx={{ display: "flex", justifyContent: "end" }}>
      <Box
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
        {icon}
      </Box>

      <Drawer
        open={open}
        onClose={handleClose}
        anchor="right"
      
      >
        <Box sx={{width:400}} >
          <ModalHeader
          subtitle="Be In Control: Clear Insights into Your Bank Charges!"
            title={`Bank Charges Details`}
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
              <Grid item md={12} xs={12}>
                <Card
                  sx={{
                    textAlign: "center",
                    p: 2,
                  }}
                ></Card>
              </Grid>
              <Grid item md={5} xs={12}></Grid>
            </Grid>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default BankChargesModal;
