import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { get } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";

const NewsSection = () => {
  const [data, setData] = useState([]);
  const [isProgress, setIsProgress] = useState(false);

  const handleSubmit = () => {
    get(
      ApiEndpoints.GET_NEWS,
      "",
      setIsProgress,
      (res) => {
        if (res) {
          setData(res.data.data); // Assume data is an array of objects
        }
      },
      (err) => {
        console.error("Error fetching news:", err);
      }
    );
  };
  useEffect(() => {
    handleSubmit();
  }, []);

  const colors = ["#8B0000", "#006400", "#00008B", "#8B008B", "#8B4513"];
  // Array of colors

  return (
    <Grid
      item
      xs={12}
      sm={12}
      md={12}
      lg={12}
      sx={{
        textAlign: "center",
        display: "flex",
        borderRadius: "8px",
        backgroundColor: "#fEDCDB",
        color: "#004080",
        fontSize: "14px",
        alignItems: "center",
        justifyContent: "right",
        marginBottom: "0.6rem",
        padding: "8px 6px",
      }}
    >
      {data.length > 0 ? (
        <marquee direction="left" style={{ width: "100%" }}>
          {data.map((item, index) => (
            <span
              key={index}
              style={{
                color: colors[index % colors.length],
                margin: "0 8px",
              }}
            >
              {item.news}
              {index < data.length - 1 && " | "}
            </span>
          ))}
        </marquee>
      ) : (
        <span>No news available</span>
      )}
    </Grid>
  );
};

export default NewsSection;
