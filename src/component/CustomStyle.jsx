import { getTableHeadRowColor } from "../theme/setThemeColor";

export const CustomStyles = {
  table: {},
  tableWrapper: {
    style: {
      display: "table",
      borderRadius: "0px",
    },
  },
  headRow: {
    style: {
      border: "none",
      color: "white",
      backgroundColor: getTableHeadRowColor(),
      fontFamily: "Poppins",
      paddingLeft: "8px",
      minHeight: "37px",
      maxHeight: "37px",
      borderBottom: "0.5px solid #DBDDDF",
      paddingBottom: "4px",
      paddingTop: "4px",
    },
  },
  headCells: {
    style: {
      color: "#000",
      fontSize: "13px",
      paddingLeft: "0px",
      fontWeight: "600",
      justifyContent: "flex-start",
    },
  },
  cells: {
    style: {
      paddingLeft: "6px",
      paddingRight: "0px",
      margin: "0px",
      justifyContent: "flex-start",
    },
  },
  rows: {
    highlightOnHoverStyle: {
      backgroundColor: "#ffd9b3",
      borderBottomColor: "#FFFFFF",
      outline: "1px solid #ffffff",
    },
    stripedStyle: {
      color: "rgba(0, 0, 0, 0.87)",
      backgroundColor: "rgba(242, 244, 244, 1)",
    },
    style: {
      minHeight: "50px",
      padding: "8px",
      fontSize: "14px",
      textTransform: "capitalize",
      border: "none",
    },
  },
  pagination: {
    style: {
      minHeight: "56px",
      display: "flex",
      justifyContent: "flex-start",
      borderTopStyle: "solid",
      borderTopWidth: "1px",
    },
    pageButtonsStyle: {
      borderRadius: "50%",
      height: "40px",
      width: "40px",
      padding: "8px",
      margin: "2px",
      cursor: "pointer",
      transition: "0.4s",
    },
  },
};

export const massegetable = {
  table: {},
  tableWrapper: {
    style: {
      display: "table",
      backgroundColor: "black",
      borderRadius: "10px",
    },
  },
  headRow: {
    style: {
      border: "none",
      color: "#fff",
      backgroundColor: getTableHeadRowColor(),
      fontFamily: "Poppins",
      paddingLeft: "8px",
      minHeight: "37px",
      borderBottom: "0.5px solid #DBDDDF",
      paddingBottom: "8px",
      paddingTop: "8px",
    },
  },
  headCells: {
    style: {
      color: "#fff",
      fontSize: "13px",
      paddingLeft: "4px",
      fontWeight: "bold",
      justifyContent: "start",
    },
  },
  cells: {
    style: {
      paddingLeft: "6px",
      paddingRight: "0px",
      margin: "0px",
      justifyContent: "start",
    },
  },
  rows: {
    highlightOnHoverStyle: {
      backgroundColor: "#415d4339",
      borderBottomColor: "#FFFFFF",
      outline: "1px solid #ffffff",
    },
    style: {
      minHeight: "40px",
      padding: "4px",
      fontSize: "12px",
      // textTransform: "capitalize",
      border: "none",
    },
  },
  pagination: {
    style: {
      fontSize: "13px",
      minHeight: "56px",
      display: "flex",
      justifyContent: "flex-start",
      borderTopStyle: "solid",
      borderTopWidth: "1px",
    },
    pageButtonsStyle: {
      borderRadius: "50%",
      height: "40px",
      width: "40px",
      padding: "8px",
      margin: "2px",
      cursor: "pointer",
      transition: "0.4s",
    },
  },
};
export const businessTableStyle = {
  table: {
    style: {
      color: "black",
    },
  },
  tableWrapper: {
    style: {
      display: "table",
      backgroundColor: "black",
    },
  },
  headRow: {
    style: {
      border: "none",
      color: "#4F5E74",
      backgroundColor: "#F7F7F7",
      paddingLeft: "4px",
      minHeight: "50px",
      borderBottom: "0.5px solid #B9B9B9",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: "400",
    },
  },
  headCells: {
    style: {
      color: "#000",
      fontSize: "13px",
      paddingLeft: "4px",
    },
  },
  cells: {
    style: {
      paddingLeft: "6px",
      paddingRight: "0px",
      margin: "0px",
    },
  },
  rows: {
    highlightOnHoverStyle: {
      backgroundColor: "#D5F5E3",
      borderBottomColor: "#FFFFFF",
      outline: "1px solid #ffffff",
    },
    style: {
      minHeight: "50px",
      padding: "4px",
      fontSize: "12px",
      textTransform: "capitalize",
      cursor: "pointer",
    },
  },
  pagination: {
    style: {
      border: "none",
    },
  },
};
