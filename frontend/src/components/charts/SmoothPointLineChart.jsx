import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto"; // Import Chart.js

const SmoothPointLineChart = () => {
  const chartRef = useRef(null); // Create a reference for the canvas

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d"); // Get 2d context of the canvas
    const chart = new Chart(ctx, {
      type: "line", // Chart type
      data: {
        labels: ["", "", "", "", "", "", ""], // Empty labels
        datasets: [
          {
            label: null,
            backgroundColor: "transparent", // Transparent background
            borderColor: "#2d56fb", // Border color of the line
            pointBackgroundColor: "white", // Point color
            data: [65, 59, 84, 84, 51, 55, 40], // Data points
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false, // Hide the legend
          },
          tooltip: {
            enabled: false, // Disable tooltips
          },
        },
        scales: {
          x: {
            border: {
              display: false, // Hide border
            },
            grid: {
              display: false, // Hide grid
              drawBorder: false,
            },
            ticks: {
              display: false, // Hide ticks
            },
          },
          y: {
            min: 30,
            max: 89,
            display: false, // Hide the y-axis
            grid: {
              display: false, // Hide grid
            },
            ticks: {
              display: false, // Hide ticks
            },
          },
        },
        elements: {
          line: {
            borderWidth: 1, // Line border width
            tension: 0.4, // Line tension (curvature)
          },
          point: {
            radius: 4, // Point radius
            hoverRadius: 0, // Disable hover radius
            hitRadius: 0, // Disable hit radius
          },
        },
        interaction: {
          mode: "none", // Disable interactions
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <canvas
      ref={chartRef}
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

export default SmoothPointLineChart;
