import React, { useEffect } from "react";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { get, postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminTripleChart = ({data}) => {
  const [chartData, setChartData] = useState();
  const [chartDates, setChartDates] = useState();
  const [todayData, setTodayData] = useState();
  const [lastData, setLastData] = useState();
  const [thisData, setThisData] = useState();

  useEffect(() => {
    setTodayData(data && data.map((item) => item.Today));
    setLastData(data && data.map((item) => item.Last));
    setThisData(data && data.map((item) => item.This));
    setChartDates(data && data.map((item) => item.service));
  }, [data]);
  // }, [graphData]);

  const data1 = {
    labels: chartDates && chartDates,
    datasets: [
      {
        data: todayData && todayData,
        fill: true,
        backgroundColor: ["rgba(255, 99, 133, 0.385)"],
        borderColor: ["rgb(255, 99, 132)"],
        borderWidth: 1,
      },
      {
        data: thisData && thisData,
        fill: true,
        backgroundColor: ["rgba(255, 160, 64, 0.385)"],
        borderColor: ["rgb(255, 159, 64)"],
        borderWidth: 1,
      },
      {
        data: lastData && lastData,
        fill: true,
        backgroundColor: ["rgba(255, 204, 86, 0.385)"],
        borderColor: [
          "rgb(255, 99, 132)",
          // "rgb(255, 159, 64)",
          // "rgb(255, 205, 86)",
          // "rgb(75, 192, 192)",
          // "rgb(54, 162, 235)",
          // "rgb(153, 102, 255)",
          // "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      }
    ],
  };

  const data2 = {
    labels: chartDates && chartDates,
    datasets: [
      {
        data: todayData && todayData,
        fill: true,
        backgroundColor: ["rgba(255, 99, 133, 0.385)"],
        borderColor: ["rgb(255, 99, 132)"],
        borderWidth: 1,
      },
      {
        data: thisData && thisData,
        fill: true,
        backgroundColor: ["rgba(255, 160, 64, 0.385)"],
        borderColor: ["rgb(255, 159, 64)"],
        borderWidth: 1,
      },
      {
        data: lastData && lastData,
        fill: true,
        backgroundColor: ["rgba(255, 204, 86, 0.385)"],
        borderColor: [
          "rgb(255, 99, 132)",
          // "rgb(255, 159, 64)",
          // "rgb(255, 205, 86)",
          // "rgb(75, 192, 192)",
          // "rgb(54, 162, 235)",
          // "rgb(153, 102, 255)",
          // "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      }
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        title: { display: true, text: "Amount in ₹" },
      },
      x: {
        title: { display: true, text: "Services" },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
  };

  return <Bar data={data1 && data1} options={options} />;
};

export default AdminTripleChart;
