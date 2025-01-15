import { Box, Button, Container } from "@mui/material";
import React from "react";
import { unauthorized401 } from "../iconsImports";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Container maxWidth="lg">
        <Box component="div">
          <img alt="404 Not Found" src={unauthorized401} width="600px" />
        </Box>
        Error page Not Found
        <Button
          onClick={() => {
            navigate("/login");
          }}
        >
          Login Here
        </Button>
      </Container>
    </>
  );
};
export default UnauthorizedPage;
