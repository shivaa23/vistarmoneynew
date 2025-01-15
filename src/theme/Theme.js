import { Button, createTheme, styled } from "@mui/material";
import { primaryColor, secondaryColor, whiteColor } from "./setThemeColor";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#4045A1",
    },
    secondary: {
      main: "#DC5F5F",
    },
    theme_green: {
      main: "#00BF78",
    },
  },
});

//buttons
export const PrimaryButton = styled(Button)(() => ({
  backgroundColor: primaryColor(),
  width: "12rem",
  height: "3rem",
  
  color: whiteColor(),
  "&:hover": {
    backgroundColor: primaryColor(),
  },
}));
export const SecondaryButton = styled(Button)(() => ({
  backgroundColor: secondaryColor(),
  width: "12rem",
  height: "3rem",
  "&:hover": {
    backgroundColor: secondaryColor(),
  },
}));

export const PurpleOutline = styled(Button)(({ theme }) => ({
  color: "#4045A1",
  backgroundColor: "#fff",
  paddingTop: 8,
  paddingBottom: 8,
  paddingLeft: 16,
  paddingRight: 16,
  border: "1px dashed #314259",
  "&:hover": {
    backgroundColor: "#d6d6d6",
  },
}));
