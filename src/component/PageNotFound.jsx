import { Box, Button, Container } from "@mui/material";
import React from "react";
import { notFound404 } from "../iconsImports";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Container maxWidth="lg">
        <Box component="div">
          <img alt="404 Not Found" src={notFound404} width="600px" />
        </Box>
        Error page Not Found
        <Button
          onClick={() => {
            navigate("/");
          }}
        >
          Login Here
        </Button>
      </Container>
    </>
  );
};
export default PageNotFound;
