import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto"; // This will auto-register all the necessary components of Chart.js

const SmoothLineChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            label: "My First dataset",
            backgroundColor: "rgba(255,255,255,.2)",
            borderColor: "orange",
            data: [78, 81, 80, 45, 34, 12, 40],
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
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
            display: false,
          },
          y: {
            display: false,
          },
        },
        elements: {
          line: {
            borderWidth: 2,
            tension: 0.4,
          },
          point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
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

export default SmoothLineChart;
