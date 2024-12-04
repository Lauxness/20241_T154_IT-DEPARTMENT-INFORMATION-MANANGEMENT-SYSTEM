import React, { useRef, useEffect } from "react";
import { Chart } from "chart.js";

const SharpLineChart = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

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
            backgroundColor: "transparent",
            borderColor: "blue",
            pointBackgroundColor: "white",
            data: [1, 18, 9, 17, 34, 22, 11],
            borderWidth: 1,
            pointRadius: 4,
            hitRadius: 10,
            hoverRadius: 4,
            display: "none",
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
            border: {
              display: false,
            },
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              display: false,
            },
          },
          y: {
            min: -9,
            max: 39,
            display: false,
            grid: {
              display: false,
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

export default SharpLineChart;
