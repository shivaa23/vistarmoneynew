import {
  Box,
  Divider,
  Grid,
  Typography,
  Button,
  TextField,
  FormControl,
  Autocomplete,
} from "@mui/material";
import { useState, useEffect } from "react";
import CardComponent from "../CardComponent";
import BackspaceIcon from "@mui/icons-material/Backspace";

const BbpsCard = ({
  showSecondPage,
  setShowSecondPage,
  groupedCategories,
  getBillersDetails,
  filterOptions,
  fetchMandatory,
  setErr,
  setCatKey,
  catKey,
  setCategoryName,
  getBillers,
  setAction,
  action,
  setIsActive,
  setCurrentBiller,
  isActive,
  biller=[],
  getCategories,
  setBillerId,
  currentBiller,
  params,
  err,
}) => {
  const [selectedBillerId, setSelectedBillerId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBillers, setFilteredBillers] = useState(biller); // Initialize with full list
  const handleBackToCategories = () => {
    setShowSecondPage(1); // Set the state to 1 when the button is clicked
};
  useEffect(() => {
    setFilteredBillers(biller); // Reset filtered billers when biller changes
  }, [biller]);

  // Function to handle search input changes
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter billers based on search query
    const filtered = biller.filter((item) =>
      item.billerName.toLowerCase().includes(query)
    );
    setFilteredBillers(filtered);
  };
 const handleBackToBiler=()=>{
    showSecondPage(1)
  }
  return (
    <Box sx={{ padding: 2 }}>
      {/* First page - Category View */}
      {showSecondPage === 0 && (
        Object.keys(groupedCategories).map((groupName) => (
          <Box
            key={groupName}
            sx={{
              marginBottom: 2,
              border: "solid 1px lightgray",
              p: 3,
              borderRadius: 3,
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            }}
          >
            <Typography variant="h6" align="left" sx={{ pl: 1, mt: -2, mb: 1 }}>
              {groupName}
            </Typography>
            <Grid container spacing={2}>
              {groupedCategories[groupName].map((item, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={index}
                  sx={{ width: "100%", height: "100%" }}
                >
                  <CardComponent
                    onClick={() => {
                      setErr("");
                      setCatKey(item.categoryKey);
                      setCategoryName(item);
                      getBillers(item.categoryKey);
                      setAction(item.categoryName);
                      setIsActive(!isActive);
                    }}
                    isActive={action === item.categoryName}
                    title={item.categoryName}
                    img={item.iconUrl}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))
      )}

      {/* Second page - Biller View */}
      {showSecondPage === 1 && (
        <Box>
          {/* Search input and controls */}
          <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
            {/* Left: Category Name */}
            <Grid item xs={12} sm="auto">
              <Typography variant="h6" align="left" sx={{ ml: 1 }}>
                {biller.length > 0 ? biller[0].categoryName : "No Category"}
              </Typography>
            </Grid>

            {/* Center: Search Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Search Biller"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={handleSearch}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#fff',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#757575',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#cccccc',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#999999',
                  },
                  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3f51b5',
                  },
                }}
              />
            </Grid>

            {/* Right: Back Button */}
            <Grid item xs={12} sm="auto">
              <Button
                variant="contained"
                onClick={getCategories} // Go back to category view
                sx={{ ml: 2 }}
              >
                Back
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ m: 1, backgroundColor: "grey.500", height: 1.5 }} />

          {/* Biller List */}
          <Grid container spacing={2}>
            {filteredBillers.length > 0 ? (
              filteredBillers.map((item, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={index}
                  sx={{ width: "100%", height: "75%" }}
                >
                  <CardComponent
                    onClick={() => {
                      setSelectedBillerId(item.billerId);
                      getBillersDetails(item.billerId);
                    }}
                    title={item.billerName}
                    img={item.iconUrl}
                    isActive={selectedBillerId === item.billerId}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="h6" align="center">
                  No billers found
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* Third page - Detailed Biller View */}
      {showSecondPage === 2 && (
  <Box 
    sx={{ 
      padding: 2, 
      borderRadius: 2, 
      border: "1px solid lightgrey", 
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", 
      maxHeight: "100vh", // Set max height for full viewport
      overflow: "hidden" // Prevent overflow
    }}
  >
    <Grid container spacing={2} sx={{ height: "100%" }}>
      {/* Left side: Scrollable card with selected biller list */}
      <Grid item lg={4} xs={12} sm={4} sx={{p:2}}>
     
        {/* Fixed category name */}
        <Typography variant="h6" align="center" >
          {biller[0]?.categoryName}
        </Typography>

        {/* Fixed search bar */}
        <Grid item xs={12} lg={12} sm={6} sx={{mt:1}}>
              <TextField
                label="Search Biller"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={handleSearch}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#fff',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#757575',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#cccccc',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#999999',
                  },
                  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3f51b5',
                  },
                }}
              />
            </Grid>
        <Divider sx={{ m: 1, backgroundColor: "grey.500", height: 1.5 }} />

        {/* Scrollable list of billers */}
        <Box sx={{ maxHeight: "600px", overflowY: "auto" }}>
          {filteredBillers.length > 0 ? (
            filteredBillers.map((item, index) => (
              <Box key={index} sx={{ marginBottom: 2 }}>
                <CardComponent
                  height={"60px"}
                  title={item.billerName}
                  img={item.iconUrl}
                  onClick={() => setSelectedBillerId(item.billerId)}
                  isSelected={selectedBillerId === item.billerId}
                />
              </Box>
            ))
          ) : (
            <Typography variant="h6" align="center">
              No billers found
            </Typography>
          )}
        </Box>
      </Grid>

      {/* Right side: Scrollable detailed view */}
      <Grid 
        item xs={12} md={8} 
        sx={{ maxHeight: "600px", overflowY: "auto", padding: 2, borderLeft: "1px solid lightgrey" }}
      >
         <Button 
           variant="contained" 
           onClick={
            
           handleBackToBiler

           } 
         
         >
           Back to Categories
         </Button>
        {selectedBillerId ? (
          <>
          
          <Box>
            {/* Display detailed view for selected biller */}
            <Typography variant="h6">
              Detailed view for Biller ID: {selectedBillerId}
            </Typography>
            {/* Add detailed content here */}
            {params &&
                      params.map((item, index) => {
                        return (
                          <Grid item md={12} xs={12} key={index}>
                            <FormControl
                              sx={{
                                width: "100%",
                              }}
                            >
                              <TextField autoComplete="off"
                                label={item.desc}
                                id={item.name}
                                inputProps={{
                                  minLength: item.minLength,
                                  maxLength: item.maxLength,
                                  pattern: item.regex,
                                }}
                                // inputProps={{ style: { textTransform: "uppercase" } }}
                                size="small"
                                minLength={item.minLength}
                                maxLength={item.maxLength}
                                required={item.mandatory === 1}
                                type={
                                  item.inputType && item.inputType === "NUMERIC"
                                    ? "number"
                                    : "text"
                                }
                              />
                            </FormControl>
                          </Grid>
                        );
                      })}
                    {err && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 2,
                          fontSize: "12px",
                          px: 2,
                          color: "#DC5F5F",
                        }}
                      >
                        {err.message && err.message && (
                          <div>{err && err.message}</div>
                        )}
                      </Box>
                    )}
          </Box>
          </>
        ) : (
          <Typography variant="h6" align="center">
            Please select a biller to view details.
          </Typography>
        )}
      </Grid>
    </Grid>

   
  </Box>
)}

    </Box>
  );
};

export default BbpsCard;
