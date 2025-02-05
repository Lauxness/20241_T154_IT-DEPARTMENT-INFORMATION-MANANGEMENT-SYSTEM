import React, { useRef, useEffect } from "react";
import { Chart } from "chart.js";

const BarChart = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Initialize the Chart.js chart when the component mounts
    const ctx = canvasRef.current.getContext("2d");

    // Create the chart
    const chart = new Chart(ctx, {
      type: "bar", // Bar chart type
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: "My First dataset",
            backgroundColor: "blue",
            borderColor: "white",
            data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98],
            barPercentage: 0.6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawTicks: false,
            },
            ticks: {
              display: false,
            },
          },
          y: {
            border: {
              display: false,
            },
            grid: {
              display: false,
              drawBorder: false,
              drawTicks: false,
            },
            ticks: {
              display: false,
            },
          },
        },
      },
    });
    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        height: "100%",
        maxHeight: "70px",
        width: "100%",
        maxWidth: "200px",
        minWidth: "0px",
      }}
    />
  );
};

export default BarChart;
