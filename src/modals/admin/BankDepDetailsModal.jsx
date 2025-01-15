/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  Button,
  Card,
  Drawer,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import ApiEndpoints from "../../network/ApiEndPoints";
import ModalHeader from "../ModalHeader";
import { currencySetter } from "../../utils/Currencyutil";
import ApiPaginate from "../../component/ApiPaginate";
import { massegetable } from "../../component/CustomStyle";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

let refresh;

const BankDepDetailsModal = ({
  bank_id,
  usedInUserTable = false,
  width = "max-content",
  icon,
  name,
}) => {
  const [open, setOpen] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [query, setQuery] = useState();
  const [type, setType] = useState("TODAY");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // For mobile responsiveness

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
      name: "MOP",
      selector: (row) => (row?.mop ? row?.mop : "NA"),
    },
    {
      name: "Total",
      selector: (row) => currencySetter(row?.Total),
      width: "130px",
    },
  ];

  useEffect(() => {
    if (type) setQuery(`type=${type}&bank_id=${bank_id}`);
    return () => {};
  }, [type]);

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
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : "400px", // Full width on mobile, 400px on larger screens
          },
        }}
      >
        <Box
          sx={{
            p: isMobile ? 1 : 2, // Padding is smaller on mobile for space efficiency
            width: "100%",
            boxSizing: "border-box",
          }}
          className="sm_modal"
        >
          <ModalHeader
          subtitle="Track Your Deposits with Detailed Insights."
            title={`${name}'s Deposite Report`}
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
            <Grid container spacing={isMobile ? 1 : 2}>
              <Grid item xs={12}>
                <Card
                  sx={{
                    textAlign: "center",
                    p: { xs: 1, sm: 2 }, // Adjust padding for mobile and larger screens
                  }}
                >
                  <ToggleButtonGroup
                    color="primary"
                    value={type}
                    exclusive
                    onChange={handleChange}
                    aria-label="type"
                    sx={{
                      "& .MuiToggleButton-root": {
                        fontSize: isMobile ? "8px" : "12px", // Smaller font on mobile
                        padding: isMobile ? "6px 10px" : "8px 16px", // Adjust button padding for mobile
                      },
                    }}
                  >
                    <ToggleButton value="TODAY">Today</ToggleButton>
                    <ToggleButton value="THIS">This</ToggleButton>
                    <ToggleButton value="LAST">Last</ToggleButton>
                  </ToggleButtonGroup>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <ApiPaginate
                  apiEnd={ApiEndpoints.BANK_DETAILS}
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
            </Grid>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default BankDepDetailsModal;
