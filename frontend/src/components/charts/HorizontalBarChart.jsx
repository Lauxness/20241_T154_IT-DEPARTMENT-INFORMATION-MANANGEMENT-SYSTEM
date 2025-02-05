import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const HorizontalBarChart = (props) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    console.log(
      props.dashboardData?.totalFirstYear,
      props.dashboardData?.totalSecondYear,
      props.dashboardData?.totalThirdYear,
      props.dashboardData?.totalFourthYear
    );
    // Initialize Chart.js
    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
        datasets: [
          {
            backgroundColor: "#2d55fb",
            data: [
              props.dashboardData?.totalFirstYear,
              props.dashboardData?.totalSecondYear,
              props.dashboardData?.totalThirdYear,
              props.dashboardData?.totalFourthYear,
            ],
          },
        ],
      },
      options: {
        responsive: true,

        indexAxis: "y", // Makes the bar chart horizontal
        plugins: {
          legend: {
            display: false, // Hides the legend
          },
          tooltip: {}, // Enables default tooltips
        },
        scales: {
          x: {
            grid: {
              color: "#2d55fb5a", // Custom grid line color
            },
            ticks: {
              color: "black", // Custom tick color
            },
          },
          y: {
            grid: {
              color: "#2d55fb5a", // Custom grid line color
            },
            ticks: {
              color: "black",
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
        width: "100%",
        height: "100%",
        maxHeight: "300px",
        maxWidth: "750px",
      }}
    />
  );
};

export default HorizontalBarChart;
